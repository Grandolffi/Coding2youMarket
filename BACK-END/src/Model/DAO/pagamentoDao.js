const pool = require('../../Config/Db/db');

class Pagamento {
  constructor(id, pedidoId, usuarioId, cartaoId, valor, status, dataPagamento, transacaoId, dataVencimento) {
    this.id = id;
    this.pedidoId = pedidoId;
    this.usuarioId = usuarioId;
    this.cartaoId = cartaoId;
    this.valor = valor;
    this.status = status;
    this.transacaoId = transacaoId;
    this.dataPagamento = dataPagamento;
    this.dataVencimento = dataVencimento;
  }
}

//CREATE
async function insertPagamento({
  pedidoId,
  usuarioId,
  cartaoId,
  valor
}) {
  const status = 'pendente';

  if (!usuarioId || !cartaoId || valor == null) {
    console.error('Falha ao inserir pagamento: dados inválidos.');
    return false;
  }

  const { rows } = await pool.query(
    `
    INSERT INTO pagamentos (
      pedidoId,
      usuarioId,
      cartaoId,
      valor,
      status,
      dataPagamento
    )
    VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING *
    `,
    [pedidoId, usuarioId, cartaoId, valor, status]
  );

  return rows[0];
}

// CREATE COM MERCADO 
async function insertPagamentoMercadoPago({
  usuarioId,
  cartaoId,
  valor,
  status,
  transacaoId
}) {
  if (!usuarioId || valor == null) {
    console.error('Falha ao inserir pagamento: dados inválidos.');
    return false;
  }
  const { rows } = await pool.query(
    `
    INSERT INTO pagamentos (
      usuarioId,
      cartaoId,
      valor,
      status,
      transacaoId,
      dataPagamento
    )
    VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING *
    `,
    [usuarioId, cartaoId, valor, status, transacaoId]
  );
  return rows[0];
}


//READ
async function getPagamentos() {
  const { rows } = await pool.query('SELECT * FROM pagamentos');
  return rows;
}

//READ POR ID
async function getPagamentoPorId(id) {
  if (!id) return false;

  const { rows } = await pool.query(
    'SELECT * FROM pagamentos WHERE id = $1',
    [id]
  );

  return rows[0];
}

//READ POR USUARIO ID 
async function getPagamentosPorUsuario(usuarioId) {
  if (!usuarioId) return false;

  const { rows } = await pool.query(
    'SELECT * FROM pagamentos WHERE usuarioId = $1',
    [usuarioId]
  );

  return rows;
}

//READ POR PEDIDO ID
async function getPagamentosPorPedidoId(pedidoId) {
  if (!pedidoId) return false;

  const { rows } = await pool.query(
    'SELECT * FROM pagamentos WHERE pedidoId = $1',
    [pedidoId]
  );

  return rows;
}

//UPDATE
async function updateStatusPagamento(id, status) {
  const statusPermitidos = ['pendente', 'aprovado', 'recusado', 'estornado'];

  if (!id || !statusPermitidos.includes(status)) return false;

  const { rows } = await pool.query(
    `
    UPDATE pagamentos
    SET status = $1
    WHERE id = $2
    RETURNING *
    `,
    [status, id]
  );

  return rows[0] || false;
}

//DELETE
async function deletePagamento(id) {
  if (!id) return false;

  const { rowCount } = await pool.query(
    'DELETE FROM pagamentos WHERE id = $1',
    [id]
  );

  return rowCount > 0;
}

module.exports = {
  Pagamento, insertPagamento, insertPagamentoMercadoPago, getPagamentos, getPagamentoPorId, getPagamentosPorUsuario,
  getPagamentosPorPedidoId, updateStatusPagamento, deletePagamento
};
