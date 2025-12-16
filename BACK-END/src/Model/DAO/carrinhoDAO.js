const pool = require('../../Config/Db/mysqlConnect');

class Carrinho {
  constructor(id, pedidoId, produtoId, quantidade, observacao) {
    this.id = id;
    this.pedidoId = pedidoId;
    this.produtoId = produtoId;
    this.quantidade = quantidade;
    this.observacao = observacao;
  }
}

// CREATE
async function insertCarrinho(
  pedidoId,
  produtoId,
  quantidade,
  observacao
) {
  if (!pedidoId || !produtoId || quantidade == null) {
    console.error("Falha ao inserir no carrinho: pedidoId, produtoId e quantidade são obrigatórios.");
    return false;
  }

  const result = await pool.query(
    `
    INSERT INTO carrinho (
      pedidoId,
      produtoId,
      quantidade,
      observacao
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [pedidoId, produtoId, quantidade, observacao]
  );

  return result.rows[0];
}

// READ 
async function getCarrinho() {
  const { rows } = await pool.query("SELECT * FROM carrinho");
  return rows;
}

// READ POR PEDIDO
async function getCarrinhoPorPedido(pedidoId) {
  if (!pedidoId) {
    console.error("pedidoId não informado.");
    return false;
  }

  const { rows } = await pool.query(
    "SELECT * FROM carrinho WHERE pedidoId = $1",
    [pedidoId]
  );

  return rows;
}

// UPDATE
async function editCarrinho(id, quantidade, observacao) {
  if (!id || quantidade == null) {
    console.error("Falha ao editar carrinho: id e quantidade são obrigatórios.");
    return false;
  }

  const result = await pool.query(
    `
    UPDATE carrinho
    SET quantidade = $1,
        observacao = $2
    WHERE id = $3
    RETURNING *
    `,
    [quantidade, observacao, id]
  );

  if (result.rows.length === 0) return false;
  return result.rows[0];
}

// DELETE
async function deleteCarrinho(id) {
  if (!id) {
    console.error("ID do carrinho não informado.");
    return false;
  }

  const result = await pool.query(
    `
    DELETE FROM carrinho
    WHERE id = $1
    RETURNING id
    `,
    [id]
  );

  return result.rows.length > 0;
}

// EXPORTS
module.exports = {
  Carrinho, insertCarrinho, getCarrinho, getCarrinhoPorPedido, editCarrinho, deleteCarrinho
};
