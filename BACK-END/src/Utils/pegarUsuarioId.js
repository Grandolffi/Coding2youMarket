import jwt_decode from "jwt-decode";
import { getToken } from "../Utils/geraToken";

const pegarUsuarioId = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwt_decode(token);
    return decoded.id; 
  } catch (err) {
    console.error("Erro ao decodificar token:", err);
    return null;
  }
};

module.exports = pegarUsuarioId;