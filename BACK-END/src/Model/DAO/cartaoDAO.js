const pool = require('../../Config/Db/db');

class CartaoCredito {
  constructor(id, usuarioId, tokenCartao, bandeira, ultimos4Digitos, nomeImpresso, principal, isDebito) {

    this.id = id;
    this.usuarioId = usuarioId;
    this.tokenCartao = tokenCartao;
    this.bandeira = bandeira;
    this.ultimos4Digitos = ultimos4Digitos;
    this.nomeImpresso = nomeImpresso;
    this.principal = principal;
    this.isDebito = isDebito;
  }
}

//CREATE 

async function insertCartaoCredito(usuarioId, tokenCartao, bandeira, ultimos4Digitos, nomeImpresso, principal, isDebito) {

  if (!usuarioId || !tokenCartao || !bandeira || !ultimos4Digitos || !nomeImpresso) {
    console.error("Falha ao inserir cartão: campos obrigatórios ausentes.");
    return false;
  }

  const result = await pool.query(
    `
    INSERT INTO cartoes_credito (
      usuarioId,
      tokenCartao,
      bandeira,
      ultimos4Digitos,
      nomeImpresso,
      principal,
      isDebito
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
    `,
    [
      usuarioId, tokenCartao, bandeira, ultimos4Digitos, nomeImpresso, principal, isDebito
    ]
  );

  return result.rows[0];
}

// READ TODOS
async function getCartoesCredito() {
  const { rows } = await pool.query("SELECT * FROM cartoes_credito");
  return rows;
}

// READ POR USUÁRIO

async function getCartoesPorUsuario(usuarioId) {
  if (!usuarioId) {
    console.error("usuarioId não informado.");
    return false;
  }

  const { rows } = await pool.query(
    "SELECT * FROM cartoes_credito WHERE usuarioId = $1",
    [usuarioId]
  );

  return rows;
}

// READ POR ID
async function getCartaoById(id) {
  if (!id) return false;
  const { rows } = await pool.query(
    "SELECT * FROM cartoes_credito WHERE id = $1",
    [id]
  );
  return rows[0];
}

// UPDATE 
async function editCartaoCredito(
  id,
  bandeira,
  nomeImpresso,
  principal,
  isDebito
) {
  if (!id || !nomeImpresso) {
    console.error("Falha ao editar cartão: campos obrigatórios ausentes.");
    return false;
  }

  const result = await pool.query(
    `
    UPDATE cartoes_credito
    SET nomeImpresso = $1,
        principal = $2
    WHERE id = $3
    RETURNING *
    `,
    [nomeImpresso, principal, id]
  );

  if (result.rows.length === 0) return false;
  return result.rows[0];
}

// DELETE 

async function deleteCartaoCredito(id) {
  if (!id) {
    console.error("ID do cartão não informado.");
    return false;
  }

  const result = await pool.query(
    `
    DELETE FROM cartoes_credito
    WHERE id = $1
    RETURNING id
    `,
    [id]
  );

  return result.rows.length > 0;
}

// EXPORTS 

module.exports = {
  CartaoCredito, insertCartaoCredito, getCartoesCredito, getCartoesPorUsuario, getCartaoById, editCartaoCredito, deleteCartaoCredito
};
