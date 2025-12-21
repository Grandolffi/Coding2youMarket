if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

async function auth(req, res, next) {

  if (req.originalUrl === '/api/pagamentos/webhook') {
    return next();
  }

  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      error: true,
      message: "Token não informado"
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        error: true,
        message: "Não autorizado"
      });
    }

    req.usuario = decoded;
    return next();

  } catch (error) {
    console.error("Erro ao validar token:", error.message);
    return res.status(401).json({
      error: true,
      message: "Token inválido ou expirado"
    });
  }
}

module.exports = auth;
