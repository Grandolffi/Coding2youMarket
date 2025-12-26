const pool = require('../../Config/Db/db');

class ClubMarket {
  constructor(id, dataInicio, status, valorMensal) {
    this.id = id;
    this.dataInicio = dataInicio;
    this.status = status;
    this.valorMensal = valorMensal;
  }
}

//CREATE 
async function insertClubMarket({
  valorMensal = 19.90,
  status = 'ativa'
}) {
  const { rows } = await pool.query(
    `
    INSERT INTO club_market (
      status,
      valorMensal
    )
    VALUES ($1,$2)
    RETURNING *
    `,
    [status, valorMensal]
  );

  return rows[0];
}

//READ
async function getClubMarkets() {
  const { rows } = await pool.query(
    'SELECT * FROM club_market ORDER BY id DESC'
  );
  return rows;
}

//READ POR USUARIO (busca pelo club_marketid na tabela usuarios)
async function getClubMarketPorUsuario(usuarioId) {
  if (!usuarioId) return null;

  // Primeiro busca o club_marketid do usuário
  const { rows: userRows } = await pool.query(
    'SELECT club_marketid FROM usuarios WHERE id = $1',
    [usuarioId]
  );

  if (!userRows[0] || !userRows[0].club_marketid) {
    return null;
  }

  // Depois busca os dados do club_market
  const { rows } = await pool.query(
    'SELECT * FROM club_market WHERE id = $1',
    [userRows[0].club_marketid]
  );

  return rows[0] || null;
}

//READ POR ID
async function getClubMarketPorId(id) {
  if (!id) return false;

  const { rows } = await pool.query(
    'SELECT * FROM club_market WHERE id = $1',
    [id]
  );

  return rows[0];
}

//UPDATE STATUS
async function updateStatusClubMarket(id, status) {
  const statusPermitidos = ['ativa', 'cancelada', 'suspensa'];

  if (!id || !statusPermitidos.includes(status)) return false;

  const { rows } = await pool.query(
    `
    UPDATE club_market
    SET status = $1
    WHERE id = $2
    RETURNING *
    `,
    [status, id]
  );

  return rows[0] || false;
}

//DELETE
async function deleteClubMarket(id) {
  if (!id) return false;

  const { rowCount } = await pool.query(
    'DELETE FROM club_market WHERE id = $1',
    [id]
  );

  return rowCount > 0;
}

//EXPORTS
module.exports = {
  ClubMarket, insertClubMarket, getClubMarkets, getClubMarketPorUsuario, getClubMarketPorId, updateStatusClubMarket, deleteClubMarket
};
