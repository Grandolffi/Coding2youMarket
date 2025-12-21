if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const jwt = require("jsonwebtoken");

function geraToken(cliente) {
  return jwt.sign(
    {
      id: cliente.id,
      email: cliente.email,
      nome: cliente.nome,
      clubMember: cliente.clubMember,
      ativo: cliente.ativo
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h"
    }
  );
}

module.exports = geraToken;

