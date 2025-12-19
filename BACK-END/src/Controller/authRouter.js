const express = require("express");
const router = express.Router();
const geraToken = require('../Utils/geraToken')

const { insertCliente, getClientes } = require("../Model/DAO/clienteDAO");

// REGISTER
router.post("/auth/register", async (req, res) => {
  try {
    const { nome, email, cpf, telefone, senha } = req.body;

    const clientes = await getClientes();
    const emailExiste = clientes.find(c => c.email === email);

    if (emailExiste) {
      return res.status(400).json({
        success: false,
        message: "E-mail já cadastrado!"
      });
    }

    const result = await insertCliente(nome, email, cpf, telefone, senha);

    if (!result) {
      return res.status(500).json({
        success: false,
        message: "Erro ao cadastrar"
      });
    }

    return res.status(201).json({
      success: true,
      message: "Cadastro realizado com sucesso! Faça login."
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao cadastrar cliente",
      error: error.message
    });
  }
});

// LOGIN
router.post("/auth/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const clientes = await getClientes();
    const usuario = clientes.find(c => c.email === email);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "E-mail não encontrado"
      });
    }

    if (usuario.senha !== senha) {
      return res.status(401).json({
        success: false,
        message: "Senha incorreta"
      });
    }

    if (!usuario.ativo) {
      return res.status(403).json({
        success: false,
        message: "Conta desativada"
      });
    }

    //GERA TOKEN COM FUNÇÃO PADRÃO
    const token = geraToken(usuario);

    const { senha: _, ...usuarioSemSenha } = usuario;

    return res.status(200).json({
      success: true,
      message: "Login realizado com sucesso!",
      data: {
        token,
        usuario: usuarioSemSenha
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao fazer login",
      error: error.message
    });
  }
});

module.exports = router;
