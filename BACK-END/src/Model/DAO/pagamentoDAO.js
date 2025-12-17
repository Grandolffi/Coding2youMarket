const pool = require('../../Config/Db/mysqlConnect');

class Pagamento {
  constructor(
    id,
    pedidoId,
    assinaturaId,
    usuarioId,
    cartaoId,
    valor,
    status,
    dataPagamento
  ) {
    this.id = id;
    this.pedidoId = pedidoId;
    this.assinaturaId = assinaturaId;
    this.usuarioId = usuarioId;
    this.cartaoId = cartaoId;
    this.valor = valor;
    this.status = status;
    this.dataPagamento = dataPagamento;
  }
}

//CREATE
async function insertPagamento({
  pedidoId,
  assinaturaId,
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
    INSERT INTO pagamento (
      pedidoId,
      assinaturaId,
      usuarioId,
      cartaoId,
      valor,
      status,
      dataPagamento
    )
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
    RETURNING *
    `,
    [pedidoId, assinaturaId, usuarioId, cartaoId, valor, status]
  );

  return rows[0];
}
//READ
async function getPagamentos() {
  const { rows } = await pool.query('SELECT * FROM pagamento');
  return rows;
}

//READ POR ID
async function getPagamentoPorId(id) {
  if (!id) return false;

  const { rows } = await pool.query(
    'SELECT * FROM pagamento WHERE id = $1',
    [id]
  );

  return rows[0];
}

//READ POR USUARIO ID 
async function getPagamentosPorUsuario(usuarioId) {
  if (!usuarioId) return false;

  const { rows } = await pool.query(
    'SELECT * FROM pagamento WHERE usuarioId = $1',
    [usuarioId]
  );

  return rows;
}

//READ POR PEDIDO ID
async function getPagamentosPorPedidoId(pedidoId) {
  if (!pedidoId) return false;

  const { rows } = await pool.query(
    'SELECT * FROM pagamento WHERE pedidoId = $1',
    [pedidoId]
  );

  return rows;
}

//READ POR ASSINATURA ID
async function getPagamentosPorAssinaturaId(assinaturaId) {
  if (!assinaturaId) return false;

  const { rows } = await pool.query(
    'SELECT * FROM pagamento WHERE assinaturaId = $1',
    [assinaturaId]
  );

  return rows;
}

//UPDATE
async function updateStatusPagamento(id, status) {
  const statusPermitidos = ['pendente', 'aprovado', 'recusado', 'estornado'];

  if (!id || !statusPermitidos.includes(status)) return false;

  const { rows } = await pool.query(
    `
    UPDATE pagamento
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
    'DELETE FROM pagamento WHERE id = $1',
    [id]
  );

  return rowCount > 0;
}

module.exports = {
  Pagamento, insertPagamento, getPagamentos, getPagamentoPorId, getPagamentosPorUsuario, 
  getPagamentosPorPedidoId, getPagamentosPorAssinaturaId, updateStatusPagamento, deletePagamento
};
