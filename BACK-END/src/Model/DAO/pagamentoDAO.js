const pool = require('../../Config/Db/mysqlConnect');

class Pagamento {
  constructor(
    id,
    pedidoId,
    assinaturaId,
    usuarioId,
    cartaoId,
    valor,
    status
  ) {
    this.id = id;
    this.assinaturaId = assinaturaId;
    this.usuarioId = usuarioId;
    this.cartaoId = cartaoId;
    this.valor = valor;
    this.status = status;
    this.transacaoId = transacaoId;
    this.dataPagamento = dataPagamento;
    this.dataVencimento = dataVencimento;
    this.pedidoId = pedidoId;
  }
}

//pedido id

//CREATE

async function insertPagamento(assinaturaId, usuarioId, cartaoId, valor) {
  const status = 'pendente';

  if (!usuarioId || !cartaoId || valor == null) {
    console.error("Falha ao inserir pagamento: dados inválidos.");
    return false;
  }

  const result = await pool.query(
    `
    INSERT INTO pagamento (
      assinaturaId,
      usuarioId,
      cartaoId,
      valor,
      status
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [assinaturaId, usuarioId, cartaoId, valor, status]
  );

  return result.rows[0];
}


//READ

async function getPagamentos() {
  const { rows } = await pool.query("SELECT * FROM pagamento");
  return rows;
}

async function getPagamentosPorUsuario(usuarioId) {
  if (!usuarioId) {
    console.error("usuarioId não informado.");
    return false;
  }

  const { rows } = await pool.query(
    "SELECT * FROM pagamento WHERE usuarioId = $1",
    [usuarioId]
  );

  return rows;
}

async function getPagamentosPorAssinaturaId(assinaturaId) {
  if (!assinaturaId) {
    console.error("assinaturaId não informado.");
    return false;
  }

  const { rows } = await pool.query(
    "SELECT * FROM pagamento WHERE assinaturaId = $1",
    [assinaturaId]
  );

  return rows;
}

// READ - PAGAMENTOS POR USUARIO ID

async function getPagamentoPorId(usuarioId) {
  if (!usuarioId) {
    console.error("usuarioId não informado.");
    return false;
  }

  const { rows } = await pool.query(
    `
    SELECT *
    FROM pagamento
    WHERE usuarioId = $1
    `,
    [usuarioId]
  );

  return rows;
}

//UPDATE

async function updateStatusPagamento(id, status) {
  const statusPermitidos = ['pendente', 'aprovado', 'recusado', 'estornado'];

  if (!id || !statusPermitidos.includes(status)) {
    console.error("Falha ao atualizar pagamento.");
    return false;
  }

  const result = await pool.query(
    `
    UPDATE pagamento
    SET status = $1
    WHERE id = $2
    RETURNING *
    `,
    [status, id]
  );

  if (result.rows.length === 0) return false;
  return result.rows[0];
}

//DELETE

async function deletePagamento(id) {
  if (!id) {
    console.error("ID do pagamento não informado.");
    return false;
  }

  const result = await pool.query(
    `
    DELETE FROM pagamento
    WHERE id = $1
    RETURNING id
    `,
    [id]
  );

  return result.rows.length > 0;
}

module.exports = {
  Pagamento, insertPagamento, getPagamentos, getPagamentoPorId, getPagamentosPorAssinaturaId, updateStatusPagamento, deletePagamento
};
