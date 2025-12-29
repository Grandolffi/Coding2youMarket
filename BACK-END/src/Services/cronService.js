const cron = require('node-cron');
const pool = require('../Config/Db/db');
const { enviarEmailPedidoRecorrente } = require('./emailService');


async function processarEntregasRecorrentes() {
    console.log('[CRON] Iniciando processamento de entregas recorrentes...');

    try {
        // 1. Buscar pedidos elegíveis (onde próxima entrega = hoje E status ativa)
        const { rows: pedidos } = await pool.query(`
      SELECT * FROM pedidos 
      WHERE dataproximaentrega::date = CURRENT_DATE
        AND status = 'ativa'
        AND frequencia IN ('semanal', 'quinzenal', 'mensal')
    `);

        console.log(`📦 Encontrados ${pedidos.length} pedido(s) para processar`);

        if (pedidos.length === 0) {
            console.log('✅ [CRON] Nenhum pedido para processar hoje');
            return;
        }

        // 2. Processar cada pedido
        let sucesso = 0;
        let falhas = 0;

        for (const pedido of pedidos) {
            try {
                await processarPedidoRecorrente(pedido);
                sucesso++;
            } catch (error) {
                console.error(`❌ Erro ao processar pedido #${pedido.id}:`, error.message);
                falhas++;
            }
        }

        console.log(`✅ [CRON] Processamento concluído: ${sucesso} sucesso(s), ${falhas} falha(s)`);
    } catch (error) {
        console.error('❌ [CRON] Erro fatal:', error);
    }
}

async function processarPedidoRecorrente(pedido) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        console.log(`📝 Processando pedido #${pedido.id} do usuário #${pedido.usuarioid}`);

        // a) Buscar itens do pedido original
        const { rows: itens } = await client.query(
            `SELECT * FROM pedido_itens WHERE pedidoid = $1 ORDER BY id`,
            [pedido.id]
        );

        if (!itens || itens.length === 0) {
            throw new Error(`Pedido #${pedido.id} não possui itens`);
        }

        console.log(`   📦 ${itens.length} item(ns) encontrado(s)`);

        // b) Criar novo pedido com status 'pendente'
        const { rows: [novoPedido] } = await client.query(`
      INSERT INTO pedidos (
        usuarioid,
        valortotal,
        valorfinal,
        frequencia,
        status,
        datainicio,
        dataproximaentrega,
        dataproximacobranca
      ) 
      VALUES ($1, $2, $3, $4, $5, NOW(), NULL, NULL)
      RETURNING *
    `, [
            pedido.usuarioid,
            pedido.valortotal,
            pedido.valorfinal || pedido.valortotal,
            pedido.frequencia,
            'ativa' // ← Novo pedido ativo para processamento
        ]);

        console.log(`   ✅ Novo pedido criado #${novoPedido.id} com status 'ativa'`);

        // c) Copiar todos os itens do pedido original para o novo
        for (const item of itens) {
            await client.query(`
        INSERT INTO pedido_itens (
          pedidoid,
          produtoid,
          quantidade,
          precounitario
        )
        VALUES ($1, $2, $3, $4)
      `, [
                novoPedido.id,
                item.produtoid,
                item.quantidade,
                item.precounitario
            ]);
        }

        console.log(`   ✅ ${itens.length} iten(s) copiado(s) para o novo pedido`);

        // d) Calcular próxima data baseado na frequência
        const diasProxima = pedido.frequencia === 'semanal' ? 7 :
            pedido.frequencia === 'quinzenal' ? 15 : 30;

        // e) Atualizar pedido original com novas datas
        await client.query(`
      UPDATE pedidos 
      SET 
        dataproximaentrega = dataproximaentrega + INTERVAL '${diasProxima} days',
        dataproximacobranca = dataproximacobranca + INTERVAL '${diasProxima} days'
      WHERE id = $1
    `, [pedido.id]);

        const novaData = new Date(pedido.dataproximaentrega);
        novaData.setDate(novaData.getDate() + diasProxima);

        console.log(`   ✅ Pedido original atualizado - próxima entrega: ${novaData.toLocaleDateString('pt-BR')}`);

        // f) Commit da transação
        await client.query('COMMIT');

        console.log(`✅ Pedido recorrente #${pedido.id} processado com sucesso → Novo pedido #${novoPedido.id} (ativa)`);

        // g) Enviar email de notificação (fora da transação)
        try {
            // Buscar dados do usuário
            const { rows: [usuario] } = await pool.query(
                `SELECT nome, email FROM usuarios WHERE id = $1`,
                [pedido.usuarioid]
            );

            if (usuario && usuario.email) {
                // Buscar detalhes dos produtos
                const { rows: produtosDetalhes } = await pool.query(`
                    SELECT pi.quantidade, pi.precounitario, p.nome
                    FROM pedido_itens pi
                    LEFT JOIN produtos p ON pi.produtoid = p.id
                    WHERE pi.pedidoid = $1
                `, [novoPedido.id]);

                const itensEmail = produtosDetalhes.map(p => ({
                    quantidade: p.quantidade,
                    nome: p.nome,
                    preco: parseFloat(p.precounitario)
                }));

                await enviarEmailPedidoRecorrente({
                    email: usuario.email,
                    nome: usuario.nome || 'Cliente',
                    pedidoId: novoPedido.id,
                    valorTotal: parseFloat(novoPedido.valortotal),
                    dataEntrega: novaData.toLocaleDateString('pt-BR'),
                    itens: itensEmail
                });

                console.log(`   📧 Email enviado para ${usuario.email}`);
            }
        } catch (emailError) {
            // Não bloquear o fluxo se o email falhar
            console.error(`   ⚠️  Falha ao enviar email: ${emailError.message}`);
        }

    } catch (error) {
        // Rollback em caso de erro
        await client.query('ROLLBACK');
        console.error(`❌ Erro ao processar pedido #${pedido.id}:`, error);
        throw error;
    } finally {
        client.release();
    }
}

function iniciarCron() {
    // Executar todo dia às 8h
    // '0 8 * * *' = às 8h00 de todo dia

    cron.schedule('0 8 * * *', () => {
        console.log('\n⏰ [CRON] Executando job de entregas recorrentes...');
        processarEntregasRecorrentes();
    });

    console.log('⏰ CRON de entregas recorrentes agendado para rodar diariamente às 8h');
    console.log('   Use /api/cron/processar-agora para testar manualmente');
}

module.exports = {
    iniciarCron,
    processarEntregasRecorrentes // Exportar para endpoint de teste
};
