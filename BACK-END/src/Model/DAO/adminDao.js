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
      WHERE EXTRACT(MONTH FROM datacriacao) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM datacriacao) = EXTRACT(YEAR FROM CURRENT_DATE)
    `;
    const receitaMes = await client.query(receitaMesQuery);

    // Receita total de hoje (valor final após descontos)
    const receitaHojeQuery = `
      SELECT COALESCE(SUM(valorfinal), 0) as receita_hoje
      FROM pedidos
      WHERE DATE(datacriacao) = CURRENT_DATE
    `;
    const receitaHoje = await client.query(receitaHojeQuery);

    // Total de pedidos hoje
    const pedidosHojeQuery = `
      SELECT COUNT(*) as pedidos_hoje
      FROM pedidos
      WHERE DATE(datacriacao) = CURRENT_DATE
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

    // Produtos com estoque baixo (< 10)
    const estoqueBaixoQuery = `
      SELECT COUNT(*) as produtos_estoque_baixo
      FROM estoque
      WHERE quantidade < 10
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

/**
 * Retorna vendas dos últimos N dias
 */
const getVendasUltimosDias = async (dias = 7) => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        DATE(datacriacao) as data,
        COUNT(*) as total_pedidos,
        COALESCE(SUM(valortotal), 0) as receita
      FROM pedidos
      WHERE datacriacao >= CURRENT_DATE - INTERVAL '${dias} days'
      GROUP BY DATE(datacriacao)
      ORDER BY DATE(datacriacao) ASC
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
 * Retorna top 5 produtos mais vendidos
 */
const getTopProdutos = async (limit = 5) => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        p.id,
        p.nome,
        p.preco,
        COUNT(ip.id) as total_vendas,
        SUM(ip.quantidade) as quantidade_vendida
      FROM produtos p
      JOIN itempedido ip ON p.id = ip.produtoid
      GROUP BY p.id, p.nome, p.preco
      ORDER BY total_vendas DESC
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
 * Retorna todos os produtos com informações de estoque
 */
const getProdutosComEstoque = async () => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        p.id,
        p.nome,
        p.preco,
        p.descricao,
        p.imageurl,
        p.categoria,
        COALESCE(e.quantidade, 0) as estoque
      FROM produtos p
      LEFT JOIN estoque e ON p.id = e.produtoid
      ORDER BY p.nome ASC
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
const updateEstoqueProduto = async (produtoId, novaQuantidade) => {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO estoque (produtoid, quantidade)
      VALUES ($1, $2)
      ON CONFLICT (produtoid)
      DO UPDATE SET quantidade = $2
      RETURNING *
    `;
    const result = await client.query(query, [produtoId, novaQuantidade]);
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
        u.nome as usuario_nome,
        u.email as usuario_email,
        p.valortotal,
        p.valorfinal,
        p.status,
        p.frequencia,
        p.datacriacao,
        p.dataatualizacao
      FROM pedidos p
      JOIN usuarios u ON p.usuarioid = u.id
      ORDER BY p.datacriacao DESC
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
    const query = `
      UPDATE pedidos
      SET status = $2, dataatualizacao = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await client.query(query, [pedidoId, novoStatus]);
    return result.rows[0];
  } catch (error) {
    console.error('Erro em updateStatusPedido:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Retorna detalhes completos de um pedido
 */
const getPedidoDetalhes = async (pedidoId) => {
  const client = await pool.connect();
  try {
    // Informações do pedido
    const pedidoQuery = `
      SELECT 
        p.*,
        u.nome as usuario_nome,
        u.email as usuario_email
      FROM pedidos p
      JOIN usuarios u ON p.usuarioid = u.id
      WHERE p.id = $1
    `;
    const pedido = await client.query(pedidoQuery, [pedidoId]);

    if (pedido.rows.length === 0) {
      return null;
    }

    // Itens do pedido
    const itensQuery = `
      SELECT 
        ip.*,
        pr.nome as produto_nome,
        pr.preco as produto_preco
      FROM itempedido ip
      JOIN produtos pr ON ip.produtoid = pr.id
      WHERE ip.pedidoid = $1
    `;
    const itens = await client.query(itensQuery, [pedidoId]);

    return {
      ...pedido.rows[0],
      itens: itens.rows
    };
  } catch (error) {
    console.error('Erro em getPedidoDetalhes:', error);
    throw error;
  } finally {
    client.release();
  }
};

// ==================== USUARIOS ====================

/**
 * Retorna todos os usuários com informações de club
 */
const getAllUsuarios = async () => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        u.id,
        u.nome,
        u.email,
        u.ativo,
        u.role,
        u.club_marketid,
        u.datacriacao,
        cm.valormensal as club_valor
      FROM usuarios u
      LEFT JOIN club_market cm ON u.club_marketid = cm.id
      ORDER BY u.datacriacao DESC
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
