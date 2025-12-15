const pool = require('../../Config/Db/mysqlConnect');

class Carrinho {
  constructor(id, usuarioId, produtoId, quantidade, observacao) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.produtoId = produtoId;
    this.quantidade = quantidade;
    this.observacao = observacao;
  }
}

// CREATE

async function insertCarrinho(
  usuarioId,
  produtoId,
  quantidade,
  observacao
) {
  if (!usuarioId || !produtoId || quantidade == null) {
    console.error("Falha ao inserir no carrinho: usuarioId, produtoId e quantidade são obrigatórios.");
    return false;
  }

  const result = await pool.query(
    `
    INSERT INTO carrinho (
      usuarioId,
      produtoId,
      quantidade,
      observacao
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [usuarioId, produtoId, quantidade, observacao]
  );

  return result.rows[0];
}

//READ 

async function getCarrinho() {
  const { rows } = await pool.query("SELECT * FROM carrinho");
  return rows;
}

// READ POR USUÁRIO

async function getCarrinhoPorUsuario(usuarioId) {
  if (!usuarioId) {
    console.error("usuarioId não informado.");
    return false;
  }

  const { rows } = await pool.query(
    "SELECT * FROM carrinho WHERE usuarioId = $1",
    [usuarioId]
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
    `DELETE FROM carrinho
    WHERE id = $1
    RETURNING id
    `,
    [id]
  );

  return result.rows.length > 0;
}

// EXPORTS 

module.exports = {
  Carrinho, insertCarrinho, getCarrinho, getCarrinhoPorUsuario, editCarrinho, deleteCarrinho
};
