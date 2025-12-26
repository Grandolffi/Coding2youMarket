const pool = require('../../Config/Db/db');
class CartaoCredito {
  constructor(id, usuarioId, customerId, cardId, tokenCartao, bandeira, ultimos4Digitos, nomeImpresso, principal, isDebito) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.customerId = customerId;
    this.cardId = cardId;
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
    [usuarioId, tokenCartao, bandeira, ultimos4Digitos, nomeImpresso, principal, isDebito]
  );
  return result.rows[0];
}
//SALVAR CARTÃO COM CUSTOMER E CARD ID (MERCADO PAGO)
async function salvarCartaoTokenizado({
  usuarioId,
  customerId,
  cardId,
  tokenCartao,
  bandeira,
  ultimos4Digitos,
  nomeImpresso,
  principal,
  isDebito
}) {
  if (!usuarioId) {
    console.error("Falha ao salvar token: usuarioId ausente.");
    return false;
  }
  const result = await pool.query(
    `
    INSERT INTO cartoes_credito (
      usuarioid,
      customerid,
      cardid,
      tokencartao,
      bandeira,
      ultimos4digitos,
      nomeimpresso,
      principal,
      isdebito
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
    `,
    [
      usuarioId,
      customerId || null,  // ✅ ACEITA NULL
      cardId || null,      // ✅ ACEITA NULL
      tokenCartao,
      bandeira,
      ultimos4Digitos,
      nomeImpresso,
      principal,
      isDebito
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
// READ CUSTOMER ID POR USUÁRIO (para reusar customer)
async function getCustomerIdPorUsuario(usuarioId) {
  if (!usuarioId) return null;
  const { rows } = await pool.query(
    "SELECT customerid FROM cartoes_credito WHERE usuarioId = $1 AND customerid IS NOT NULL LIMIT 1",
    [usuarioId]
  );
  return rows[0]?.customerid || null;
}
// UPDATE 
async function editCartaoCredito(id, bandeira, nomeImpresso, principal, isDebito) {
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

async function salvarCustomerId(usuarioId, customerId) {
  const { rows } = await pool.query(
    `UPDATE usuarios SET mercadopago_customer_id = $1 WHERE id = $2 RETURNING *`,
    [customerId, usuarioId]
  );
  return rows[0];
}
async function getCustomerIdPorUsuario(usuarioId) {
  const { rows } = await pool.query(
    `SELECT mercadopago_customer_id FROM usuarios WHERE id = $1`,
    [usuarioId]
  );
  return rows[0]?.mercadopago_customer_id || null;
}


// EXPORTS 
module.exports = {
  CartaoCredito,
  insertCartaoCredito,
  salvarCartaoTokenizado,
  getCartoesCredito,
  getCartoesPorUsuario,
  getCartaoById,
  editCartaoCredito,
  deleteCartaoCredito,
  salvarCustomerId,
  getCustomerIdPorUsuario
};