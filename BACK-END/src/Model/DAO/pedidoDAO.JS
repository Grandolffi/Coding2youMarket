const pool = require('../../Config/Db/mysqlConnect');

class Pedido {
  constructor(id, usuarioId, precoTotal, data) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.precoTotal = precoTotal;
    this.data = data;
  }
}

// CREATE
async function insertPedido(usuarioId, precoTotal) {
  if (!usuarioId || precoTotal == null) {
    console.error("Falha ao criar pedido: usuarioId e precoTotal são obrigatórios.");
    return false;
  }

  const [result] = await pool.query(
    `
    INSERT INTO pedido (
      usuarioId,
      precoTotal,
      data
    )
    VALUES (?, ?, NOW())
    `,
    [usuarioId, precoTotal]
  );

  return result;
}

// READ
async function getPedidos() {
  const [rows] = await pool.query("SELECT * FROM pedido");
  return rows;
}

// READ POR USUÁRIO
async function getPedidoPorUsuario(usuarioId) {
  if (!usuarioId) {
    console.error("usuarioId não informado.");
    return false;
  }

  const [rows] = await pool.query(
    "SELECT * FROM pedido WHERE usuarioId = ?",
    [usuarioId]
  );

  return rows;
}

// UPDATE
async function editPedido(id, precoTotal) {
  if (!id || precoTotal == null) {
    console.error("Falha ao editar pedido: id e precoTotal são obrigatórios.");
    return false;
  }

  const [result] = await pool.query(
    `
    UPDATE pedido
    SET precoTotal = ?
    WHERE id = ?
    `,
    [precoTotal, id]
  );

  return result.affectedRows > 0;
}

// DELETE
async function deletePedido(id) {
  if (!id) {
    console.error("ID do pedido não informado.");
    return false;
  }

  const [result] = await pool.query(
    "DELETE FROM pedido WHERE id = ?",
    [id]
  );

  return result.affectedRows > 0;
}

// EXPORTS
module.exports = {
  Pedido, insertPedido, getPedidos, getPedidoPorUsuario, editPedido, deletePedido
};
