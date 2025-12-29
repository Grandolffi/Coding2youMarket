const pool = require('../../Config/Db/db');

class Pedido {
    constructor(id, usuarioId, enderecoId, frequencia, diaEntrega, valorTotal, valorFrete, descontoClub, valorFinal,
        status, dataInicio, dataProximaEntrega, dataProximaCobranca, dataCancelamento) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.enderecoId = enderecoId;
        this.frequencia = frequencia;
        this.diaEntrega = diaEntrega;
        this.valorTotal = valorTotal;
        this.valorFrete = valorFrete;
        this.descontoClub = descontoClub;
        this.valorFinal = valorFinal;
        this.status = status;
        this.dataInicio = dataInicio;
        this.dataProximaEntrega = dataProximaEntrega;
        this.dataProximaCobranca = dataProximaCobranca;
        this.dataCancelamento = dataCancelamento;
    }
}
// Arrumando o pedidoDao.js
//CREATE
async function insertPedido({
    usuarioId,
    enderecoId,
    frequencia,
    diaEntrega,
    valorTotal,
    valorFrete = 15.00, //VALOR FRETE PADRAO
    descontoClub = 0,
    valorFinal,
    status = 'ativa',
    dataProximaEntrega,
    dataProximaCobranca
}) {
    if (!usuarioId || !enderecoId || valorTotal == null || valorFinal == null) {
        console.error('Falha ao criar pedido: dados obrigatórios ausentes.');
        return false;
    }

    const { rows } = await pool.query(
        `
    INSERT INTO pedidos (
      usuarioid,
      enderecoid,
      frequencia,
      diaentrega,
      valortotal,
      valorfrete,
      descontoclub,
      valorfinal,
      status,
      dataproximaentrega,
      dataproximacobranca
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *
    `,
        [
            usuarioId,
            enderecoId,
            frequencia,
            diaEntrega,
            valorTotal,
            valorFrete,
            descontoClub,
            valorFinal,
            status,
            dataProximaEntrega,
            dataProximaCobranca
        ]
    );

    return rows[0];
}

//READ
async function getPedidos() {
    const { rows } = await pool.query('SELECT * FROM pedidos ORDER BY id DESC');
    return rows;
}

async function getPedidoPorId(id) {
    if (!id) return false;

    const { rows } = await pool.query(
        'SELECT * FROM pedidos WHERE id = $1',
        [id]
    );

    return rows[0];
}

async function getPedidosPorUsuario(usuarioId) {
    if (!usuarioId) return false;

    try {
        // Buscar todos os pedidos do usuário
        const { rows: pedidos } = await pool.query(
            'SELECT * FROM pedidos WHERE usuarioid = $1 ORDER BY id DESC',
            [usuarioId]
        );

        // Se não houver pedidos, retornar array vazio
        if (!pedidos || pedidos.length === 0) {
            return [];
        }

        // Para cada pedido, buscar os itens usando Promise.all
        await Promise.all(
            pedidos.map(async (pedido) => {
                try {
                    // Buscar itens do pedido
                    const { rows: itens } = await pool.query(
                        `SELECT 
                            id,
                            quantidade,
                            precounitario,
                            produtoid
                        FROM pedido_itens
                        WHERE pedidoid = $1
                        ORDER BY id`,
                        [pedido.id]
                    );

                    // Se houver itens, buscar nomes dos produtos
                    if (itens && itens.length > 0) {
                        const produtoIds = itens.map(item => item.produtoid);
                        const { rows: produtos } = await pool.query(
                            `SELECT id_produto, nome 
                            FROM produtos 
                            WHERE id_produto = ANY($1)`,
                            [produtoIds]
                        );

                        // Mapear nomes dos produtos para os itens
                        pedido.itens = itens.map(item => {
                            const produto = produtos.find(p => p.id_produto === item.produtoid);
                            return {
                                ...item,
                                nome: produto?.nome || `Produto ${item.produtoid}`
                            };
                        });
                    } else {
                        pedido.itens = [];
                    }
                } catch (error) {
                    console.error(`Erro ao buscar itens do pedido ${pedido.id}:`, error);
                    pedido.itens = []; // Fallback para array vazio
                }
            })
        );

        return pedidos;
    } catch (error) {
        console.error('Erro em getPedidosPorUsuario:', error);
        throw error;
    }
}

async function getPedidosAtivos() {
    const { rows } = await pool.query(
        "SELECT * FROM pedidos WHERE status = 'ativa'"
    );
    return rows;
}

//UPDATE
async function updateStatusPedido(id, status) {
    const statusPermitidos = ['ativa', 'pausada', 'cancelada', 'pendente_estoque'];

    if (!id || !statusPermitidos.includes(status)) return false;

    const dataCancelamento =
        status === 'cancelada' ? new Date() : null;

    const { rows } = await pool.query(
        `
    UPDATE pedidos
    SET
      status = $1,
      dataCancelamento = $2
    WHERE id = $3
    RETURNING *
    `,
        [status, dataCancelamento, id]
    );

    return rows[0] || false;
}

//UPDATE DATAS PEDIDO
async function updateDatasPedido(
    id,
    dataProximaEntrega,
    dataProximaCobranca
) {
    if (!id) return false;

    const { rows } = await pool.query(
        `
    UPDATE pedidos
    SET
      dataProximaEntrega = $1,
      dataProximaCobranca = $2
    WHERE id = $3
    RETURNING *
    `,
        [dataProximaEntrega, dataProximaCobranca, id]
    );

    return rows[0];
}

// UPDATE PEDIDO COMPLETO
async function updatePedido(id, { frequencia, diaEntrega, enderecoId, valorTotal, valorFinal, descontoClub }) {
    if (!id) return false;
    const { rows } = await pool.query(
        `
    UPDATE pedidos
    SET frequencia = $1,
        diaentrega = $2,
        enderecoid = $3,
        valortotal = $4,
        valorfinal = $5,
        descontoclub = $6
    WHERE id = $7
    RETURNING *
    `,
        [frequencia, diaEntrega, enderecoId, valorTotal, valorFinal, descontoClub, id]
    );
    return rows[0];
}

//DELETE HARD DELETE 
async function deletePedido(id) {
    if (!id) return false;

    const { rowCount } = await pool.query(
        'DELETE FROM pedidos WHERE id = $1',
        [id]
    );

    return rowCount > 0;
}

//DELETE SOFT DELETE
async function cancelarPedido(id) {
    if (!id) {
        console.error("ID do pedido não informado.");
        return false;
    }

    const { rows } = await pool.query(
        `
    UPDATE pedidos
    SET
      status = 'cancelada',
      dataCancelamento = NOW()
    WHERE id = $1
      AND status <> 'cancelada'
    RETURNING *
    `,
        [id]
    );

    return rows[0] || false;
}



module.exports = {
    Pedido, insertPedido, getPedidos, getPedidoPorId, getPedidosPorUsuario, getPedidosAtivos, updateStatusPedido, updateDatasPedido, updatePedido, deletePedido, cancelarPedido
};
