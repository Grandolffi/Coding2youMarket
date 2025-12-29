const pool = require('../../Config/Db/db');

// ==================== DASHBOARD METRICS ====================

/**
 * Retorna métricas do dashboard admin
 */
const getDashboardMetrics = async () => {
  const client = await pool.connect();
  try {
    // Receita total do mês (valor final após descontos)
    const receitaMesQuery = `
      SELECT COALESCE(SUM(valorfinal), 0) as receita_mes
      FROM pedidos
      WHERE EXTRACT(MONTH FROM datainicio) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM datainicio) = EXTRACT(YEAR FROM CURRENT_DATE)
    `;
    const receitaMes = await client.query(receitaMesQuery);

    // Receita total de hoje (valor final após descontos)
    const receitaHojeQuery = `
      SELECT COALESCE(SUM(valorfinal), 0) as receita_hoje
      FROM pedidos
      WHERE DATE(datainicio) = CURRENT_DATE
    `;
    const receitaHoje = await client.query(receitaHojeQuery);

    // Total de pedidos hoje
    const pedidosHojeQuery = `
      SELECT COUNT(*) as pedidos_hoje
      FROM pedidos
      WHERE DATE(datainicio) = CURRENT_DATE
    `;
    const pedidosHoje = await client.query(pedidosHojeQuery);

    // Total de pedidos pendentes
    const pedidosPendentesQuery = `
      SELECT COUNT(*) as pedidos_pendentes
      FROM pedidos
      WHERE status = 'ativa'
    `;
    const pedidosPendentes = await client.query(pedidosPendentesQuery);

    // Total de usuários ativos
    const usuariosAtivosQuery = `
      SELECT COUNT(*) as usuarios_ativos
      FROM usuarios
      WHERE ativo = true
    `;
    const usuariosAtivos = await client.query(usuariosAtivosQuery);

    // Total de club members
    const clubMembersQuery = `
      SELECT COUNT(*) as total_club_members
      FROM usuarios
      WHERE club_marketid IS NOT NULL
    `;
    const clubMembers = await client.query(clubMembersQuery);

    // Distribuição de club members por plano
    const clubDistribuicaoQuery = `
      SELECT 
        club_marketid as plano_id,
        COUNT(*) as quantidade
      FROM usuarios
      WHERE club_marketid IS NOT NULL
      GROUP BY club_marketid
    `;
    const clubDistribuicao = await client.query(clubDistribuicaoQuery);

    // Produtos com estoque baixo (< 10) - usando coluna estoque dentro de produtos
    const estoqueBaixoQuery = `
      SELECT COUNT(*) as produtos_estoque_baixo
      FROM produtos
      WHERE estoque < 10
    `;
    const estoqueBaixo = await client.query(estoqueBaixoQuery);

    const result = {
      receita: {
        mes: parseFloat(receitaMes.rows[0].receita_mes) || 0,
        hoje: parseFloat(receitaHoje.rows[0].receita_hoje) || 0
      },
      pedidos: {
        hoje: parseInt(pedidosHoje.rows[0].pedidos_hoje) || 0,
        pendentes: parseInt(pedidosPendentes.rows[0].pedidos_pendentes) || 0
      },
      usuarios: {
        ativos: parseInt(usuariosAtivos.rows[0].usuarios_ativos) || 0
      },
      club: {
        total: parseInt(clubMembers.rows[0].total_club_members) || 0,
        distribuicao: clubDistribuicao.rows
      },
      estoque: {
        baixo: parseInt(estoqueBaixo.rows[0].produtos_estoque_baixo) || 0
      }
    };

    console.log('📊 Dashboard Metrics:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('Erro em getDashboardMetrics:', error);
    throw error;
  } finally {
    client.release();
  }
};

// ==================== VENDAS ====================

/**
 * Retorna vendas dos últimos N dias
 */
const getVendasUltimosDias = async (dias = 7) => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        DATE(datainicio) as data,
        COUNT(*) as total_pedidos,
        COALESCE(SUM(valorfinal), 0) as receita
      FROM pedidos
      WHERE datainicio >= CURRENT_DATE - INTERVAL '${dias} days'
      GROUP BY DATE(datainicio)
      ORDER BY DATE(datainicio) ASC
    `;
    const result = await client.query(query);
    return result.rows;
  } catch (error) {
    console.error('Erro em getVendasUltimosDias:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Retorna top N produtos mais vendidos
 */
const getTopProdutos = async (limit = 5) => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        p.id_produto as id,
        p.nome,
        p.preco,
        COALESCE(SUM(pi.quantidade), 0) as quantidade_vendida
      FROM produtos p
      LEFT JOIN pedido_itens pi ON p.id_produto = pi.produtoid
      WHERE p.ativo = true
      GROUP BY p.id_produto, p.nome, p.preco
      ORDER BY quantidade_vendida DESC
      LIMIT $1
    `;
    const result = await client.query(query, [limit]);
    return result.rows;
  } catch (error) {
    console.error('Erro em getTopProdutos:', error);
    throw error;
  } finally {
    client.release();
  }
};

// ==================== PRODUTOS ====================

/**
 * Retorna produtos com informações de estoque
 */
const getProdutosComEstoque = async () => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        id_produto as id,
        nome,
        preco,
        estoque,
        estoqueminimo,
        ativo
      FROM produtos
      ORDER BY nome
    `;
    const result = await client.query(query);
    return result.rows;
  } catch (error) {
    console.error('Erro em getProdutosComEstoque:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Atualiza estoque de um produto
 */
const updateEstoqueProduto = async (produtoId, quantidade) => {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE produtos
      SET estoque = $1
      WHERE id_produto = $2
      RETURNING id_produto as id, nome, estoque
    `;
    const result = await client.query(query, [quantidade, produtoId]);
    return result.rows[0];
  } catch (error) {
    console.error('Erro em updateEstoqueProduto:', error);
    throw error;
  } finally {
    client.release();
  }
};

// ==================== PEDIDOS ====================

/**
 * Retorna todos os pedidos com informações do usuário
 */
const getAllPedidos = async () => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        p.id,
        p.usuarioid,
        p.valortotal,
        p.valorfinal,
        p.descontoclub,
        p.status,
        p.datainicio as datacriacao,
        u.nome as usuario_nome,
        u.email as usuario_email
      FROM pedidos p
      JOIN usuarios u ON p.usuarioid = u.id
      ORDER BY p.id DESC
    `;
    const result = await client.query(query);
    return result.rows;
  } catch (error) {
    console.error('Erro em getAllPedidos:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Atualiza status de um pedido
 */
const updateStatusPedido = async (pedidoId, novoStatus) => {
  const client = await pool.connect();
  try {
    const statusPermitidos = ['ativa', 'pausada', 'cancelada', 'pendente_estoque'];

    if (!statusPermitidos.includes(novoStatus)) {
      throw new Error('Status inválido');
    }

    const query = `
      UPDATE pedidos
      SET status = $1
      WHERE id = $2
      RETURNING id, status
    `;
    const result = await client.query(query, [novoStatus, pedidoId]);
    return result.rows[0];
  } catch (error) {
    console.error('Erro em updateStatusPedido:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Retorna detalhes de um pedido
 */
const getPedidoDetalhes = async (pedidoId) => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        p.*,
        u.nome as usuario_nome,
        u.email as usuario_email,
        u.telefone as usuario_telefone
      FROM pedidos p
      JOIN usuarios u ON p.usuarioid = u.id
      WHERE p.id = $1
    `;
    const result = await client.query(query, [pedidoId]);
    return result.rows[0];
  } catch (error) {
    console.error('Erro em getPedidoDetalhes:', error);
    throw error;
  } finally {
    client.release();
  }
};

// ==================== USUÁRIOS ====================

/**
 * Retorna todos os usuários com informações de club
 */
const getAllUsuarios = async () => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        id,
        nome,
        email,
        telefone,
        clubmember,
        club_marketid,
        ativo,
        datacadastro
      FROM usuarios
      ORDER BY id DESC
    `;
    const result = await client.query(query);
    return result.rows;
  } catch (error) {
    console.error('Erro em getAllUsuarios:', error);
    throw error;
  } finally {
    client.release();
  }
};

// ==================== EXPORTS ====================

module.exports = {
  getDashboardMetrics,
  getVendasUltimosDias,
  getTopProdutos,
  getProdutosComEstoque,
  updateEstoqueProduto,
  getAllPedidos,
  updateStatusPedido,
  getPedidoDetalhes,
  getAllUsuarios
};
