const pool = require('../../Config/Db/mysqlConnect');

class CartaoCliente {
  constructor( id, usuarioId, cartaoId, ativo, dataVinculo, dataDesvinculo) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.cartaoId = cartaoId;
    this.ativo = ativo;
    this.dataVinculo = dataVinculo;
    this.dataDesvinculo = dataDesvinculo;
  }
}

//CREATE
async function insertCartaoCliente(usuarioId, cartaoId) {
  if (!usuarioId || !cartaoId) {
    console.error("Falha ao vincular cartão: campos obrigatórios ausentes.");
    return false;
  }

  const result = await pool.query(
    `
    INSERT INTO cartao_cliente (
      usuarioId,
      cartaoId,
      ativo,
      dataVinculo
    )
    VALUES ($1, $2, true, NOW())
    RETURNING *
    `,
    [usuarioId, cartaoId]
  );

  return result.rows[0];
}

//READ
async function getCartoesCliente() {
  const { rows } = await pool.query(
    "SELECT * FROM cartao_cliente"
  );
  return rows;
}

//READ POR USUÁRIO
async function getCartoesClientePorUsuario(usuarioId) {
  if (!usuarioId) {
    console.error("usuarioId não informado.");
    return false;
  }

  const { rows } = await pool.query(
    `
    SELECT *
    FROM cartao_cliente
    WHERE usuarioId = $1
      AND ativo = true
    `,
    [usuarioId]
  );

  return rows;
}

//UPDATE
async function editCartaoCliente(id, ativo) {
  if (!id) {
    console.error("ID do vínculo não informado.");
    return false;
  }

  const result = await pool.query(
    `
    UPDATE cartao_cliente
    SET ativo = $1
    WHERE id = $2
    RETURNING *
    `,
    [ativo, id]
  );

  if (result.rows.length === 0) return false;
  return result.rows[0];
}

//SOFT DELETE
async function deleteCartaoCliente(id) {
  if (!id) {
    console.error("ID do vínculo não informado.");
    return false;
  }

  const result = await pool.query(
    `
    UPDATE cartao_cliente
    SET
      ativo = false,
      dataDesvinculo = NOW()
    WHERE id = $1
      AND ativo = true
    RETURNING *
    `,
    [id]
  );

  return result.rows.length > 0;
}

//EXPORTS
module.exports = {
  CartaoCliente, insertCartaoCliente, getCartoesCliente, getCartoesClientePorUsuario, editCartaoCliente,deleteCartaoCliente
};
