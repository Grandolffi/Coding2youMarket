const pool = require('../../Config/Db/db');

class Cliente {
  constructor(
    id,
    nome,
    email,
    cpf,
    telefone,
    senha,
    clubMember,
    dataCadastroClub,
    dataCadastro,
    ativo
  ) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.cpf = cpf;
    this.telefone = telefone;
    this.senha = senha;
    this.clubMember = clubMember;
    this.dataCadastroClub = dataCadastroClub;
    this.dataCadastro = dataCadastro;
    this.ativo = ativo;
  }
}

/* ===========================
   READ - LISTAR TODOS
=========================== */
async function getClientes() {
  const { rows } = await pool.query(
    'SELECT * FROM usuarios ORDER BY id'
  );
  return rows;
}

/* ===========================
   CREATE - INSERIR CLIENTE
=========================== */
async function insertCliente(
  nome,
  email,
  cpf,
  telefone,
  senha,
  clubMember = false
) {
  if (!nome || !email || !cpf || !telefone || !senha) {
    console.error('Falha ao inserir cliente: dados obrigatórios faltando');
    return false;
  }

  const dataCadastroClub = clubMember ? new Date() : null;

  const result = await pool.query(
    `
    INSERT INTO usuarios
      (nome, email, cpf, telefone, senha, clubMember, dataCadastroClub, dataCadastro, ativo)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, NOW(), true)
    RETURNING *
    `,
    [nome, email, cpf, telefone, senha, clubMember, dataCadastroClub]
  );

  return result.rows.length > 0;
}

/* ===========================
   UPDATE - EDITAR CLIENTE
=========================== */
async function editCliente(
  id,
  nome,
  email,
  cpf,
  telefone,
  senha,
  clubMember,
  ativo
) {
  if (!id || !nome || !email || !cpf || !telefone) {
    console.error('Falha ao editar cliente: dados obrigatórios faltando');
    return false;
  }

  // Busca estado atual do clubMember
  const clienteAtual = await pool.query(
    'SELECT clubmember FROM usuarios WHERE id = $1',
    [id]
  );

  let dataCadastroClub = null;

  if (
    clienteAtual.rows.length > 0 &&
    !clienteAtual.rows[0].clubmember &&
    clubMember
  ) {
    dataCadastroClub = new Date();
  }

  let query;
  let params;

  if (senha) {
    if (dataCadastroClub) {
      query = `
        UPDATE usuarios
        SET nome = $1, email = $2, cpf = $3, telefone = $4,
            senha = $5, clubMember = $6, dataCadastroClub = $7, ativo = $8
        WHERE id = $9
        RETURNING *
      `;
      params = [
        nome,
        email,
        cpf,
        telefone,
        senha,
        clubMember,
        dataCadastroClub,
        ativo,
        id
      ];
    } else {
      query = `
        UPDATE usuarios
        SET nome = $1, email = $2, cpf = $3, telefone = $4,
            senha = $5, clubMember = $6, ativo = $7
        WHERE id = $8
        RETURNING *
      `;
      params = [
        nome,
        email,
        cpf,
        telefone,
        senha,
        clubMember,
        ativo,
        id
      ];
    }
  } else {
    if (dataCadastroClub) {
      query = `
        UPDATE usuarios
        SET nome = $1, email = $2, cpf = $3, telefone = $4,
            clubMember = $5, dataCadastroClub = $6, ativo = $7
        WHERE id = $8
        RETURNING *
      `;
      params = [
        nome,
        email,
        cpf,
        telefone,
        clubMember,
        dataCadastroClub,
        ativo,
        id
      ];
    } else {
      query = `
        UPDATE usuarios
        SET nome = $1, email = $2, cpf = $3, telefone = $4,
            clubMember = $5, ativo = $6
        WHERE id = $7
        RETURNING *
      `;
      params = [
        nome,
        email,
        cpf,
        telefone,
        clubMember,
        ativo,
        id
      ];
    }
  }

  const result = await pool.query(query, params);
  return result.rows.length > 0;
}

/* ===========================
   READ - POR EMAIL
=========================== */
async function getClienteByEmail(email) {
  if (!email) return null;

  try {
    const { rows } = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error('Erro ao buscar cliente por email:', error);
    throw error;
  }
}

/* ===========================
   READ - POR CPF
=========================== */
async function getClienteByCpf(cpf) {
  if (!cpf) return null;

  try {
    const { rows } = await pool.query(
      'SELECT * FROM usuarios WHERE cpf = $1',
      [cpf]
    );
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error('Erro ao buscar cliente por CPF:', error);
    throw error;
  }
}

/* ===========================
   UPDATE - CLUB MEMBER
=========================== */
async function updateClubMember(usuarioId, clubMember) {
  const { rows } = await pool.query(
    'UPDATE usuarios SET clubMember = $1 WHERE id = $2 RETURNING *',
    [clubMember, usuarioId]
  );
  return rows[0];
}

/* ===========================
   DELETE - CLIENTE
=========================== */
async function deleteCliente(id) {
  if (!id) {
    console.error('Falha ao remover cliente: id não informado');
    return false;
  }

  const result = await pool.query(
    'DELETE FROM usuarios WHERE id = $1 RETURNING id',
    [id]
  );

  return result.rows.length > 0;
}

module.exports = {
  Cliente,
  getClientes,
  insertCliente,
  editCliente,
  getClienteByEmail,
  getClienteByCpf,
  updateClubMember,
  deleteCliente
};
