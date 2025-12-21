const pool = require('../../Config/Db/db');

class Endereco {
  constructor(id, usuarioId, cep, rua, numero, complemento, bairro, cidade, estado, apelido, principal) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.cep = cep;
    this.rua = rua;
    this.numero = numero;
    this.complemento = complemento;
    this.bairro = bairro;
    this.cidade = cidade;
    this.estado = estado;
    this.apelido = apelido;
    this.principal = principal;
  }
}

//CREATE 
async function insertEndereco(usuarioId, cep, rua, numero, complemento, bairro, cidade, estado, apelido, principal) {

  if (!usuarioId || !cep || !rua || !numero || !bairro || !cidade || !estado) {
    console.error("Falha ao inserir endereço: campos obrigatórios ausentes.");
    return false;
  }

  const result = await pool.query(
    `
    INSERT INTO enderecos (
      usuarioId, cep, rua, numero, complemento, bairro, cidade, estado, apelido, principal
    )

    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *
    `,
    [
      usuarioId, cep, rua, numero, complemento, bairro, cidade, estado, apelido, principal
    ]
  );

  return result.rows[0];
}

// READ TODOS

async function getEnderecos() {
  const { rows } = await pool.query("SELECT * FROM enderecos");
  return rows;
}

// READ POR USUÁRIO

async function getEnderecosPorUsuario(usuarioId) {
  if (!usuarioId) {
    console.error("usuarioId não informado.");
    return false;
  }

  const { rows } = await pool.query(
    "SELECT * FROM enderecos WHERE usuarioId = $1",
    [usuarioId]
  );

  return rows;
}

// UPDATE

async function editEndereco(id, cep, rua, numero, complemento, bairro, cidade, estado, apelido, principal) {

  if (!id || !cep || !rua || !numero || !bairro || !cidade || !estado) {
    console.error("Falha ao editar endereço: campos obrigatórios ausentes.");
    return false;
  }

  const result = await pool.query(
    `
    UPDATE enderecos
    SET cep = $1,
        rua = $2,
        numero = $3,
        complemento = $4,
        bairro = $5,
        cidade = $6,
        estado = $7,
        apelido = $8,
        principal = $9
    WHERE id = $10
    RETURNING *
    `,
    [
      cep, rua, numero, complemento, bairro, cidade, estado, apelido, principal, id
    ]
  );

  if (result.rows.length === 0) return false;
  return result.rows[0];
}

// DELETE 

async function deleteEndereco(id) {
  if (!id) {
    console.error("ID do endereço não informado.");
    return false;
  }

  const result = await pool.query(
    `
    DELETE FROM enderecos
    WHERE id = $1
    RETURNING id
    `,
    [id]
  );

  return result.rows.length > 0;
}

// EXPORTS 

module.exports = {
  Endereco, insertEndereco, getEnderecos, getEnderecosPorUsuario, editEndereco, deleteEndereco
};
