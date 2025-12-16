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
    transacaoId,
    dataPagamento,
    dataVencimento
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

async function insertPagamento(assinaturaId, usuarioId, cartaoId, valor, status, transacaoId, dataPagamento, dataVencimento) {

  const statusPermitidos = ['pendente', 'aprovado', 'recusado', 'estornado'];

  if (!usuarioId || !cartaoId || valor == null || !statusPermitidos.includes(status)) {
    console.error("Falha ao inserir pagamento: campos obrigatórios ou status inválido.");
    return false;
  }

  const result = await pool.query(
    `
    INSERT INTO pagamento (
      assinaturaId,
      usuarioId,
      cartaoId,
      valor,
      status,
      transacaoId,
      dataPagamento,
      dataVencimento
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
    `,
    [
      assinaturaId, usuarioId, cartaoId, valor, status, transacaoId, dataPagamento, dataVencimento
    ]
  );

  return result.rows[0];
}

// READ TODOS 

async function getPagamentos() {
  const { rows } = await pool.query("SELECT * FROM pagamento");
  return rows;
}

//READ POR USUÁRIO

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

// READ POR ASSINATURA

async function getPagamentosPorAssinatura(assinaturaId) {
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

// UPDATE 

async function updateStatusPagamento(id, status, transacaoId) {
  const statusPermitidos = ['pendente', 'aprovado', 'recusado', 'estornado'];

  if (!id || !statusPermitidos.includes(status)) {
    console.error("Falha ao atualizar pagamento: status inválido ou ID ausente.");
    return false;
  }

  const result = await pool.query(
    `
    UPDATE pagamento
    SET status = $1,
        transacaoId = COALESCE($2, transacaoId),
        dataPagamento = CASE
          WHEN $1 = 'aprovado' THEN NOW()
          ELSE dataPagamento
        END
    WHERE id = $3
    RETURNING *
    `,
    [status, transacaoId, id]
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

//DELETE 

module.exports = {
  Pagamento, insertPagamento, getPagamentos, getPagamentosPorUsuario, getPagamentosPorAssinatura, updateStatusPagamento, deletePagamento
};
