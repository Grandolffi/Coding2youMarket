const express = require("express");
const router = express.Router();

const { insertCliente, getClientes, editCliente, deleteCliente } = require("../Model/DAO/clienteDAO");

const auth = require("../Middleware/authJWTMid");

router.use(auth);

//READ TODOS
router.get("/clientes", async (req, res) => {
  try {
    const clientes = await getClientes();

    return res.status(200).json({
      success: true,
      clientes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar clientes",
      error: error.message
    });
  }
});

//READ MEUS DADOS
router.get("/clientes/me", async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const clientes = await getClientes();
    const cliente = clientes.find(c => c.id === usuarioId);

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: "Cliente não encontrado"
      });
    }

    // remove senha da resposta
    const { senha, ...clienteSemSenha } = cliente;

    return res.status(200).json({
      success: true,
      cliente: clienteSemSenha
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar cliente",
      error: error.message
    });
  }
});

//CREATE
router.post("/clientes", async (req, res) => {
  try {
    const { nome, email, cpf, telefone, senha, clubMember } = req.body;

    if (!nome || !email || !cpf || !telefone || !senha) {
      return res.status(400).json({
        success: false,
        message: "Campos obrigatórios não informados"
      });
    }

    const result = await insertCliente(
      nome,
      email,
      cpf,
      telefone,
      senha,
      clubMember
    );

    if (!result) {
      return res.status(500).json({
        success: false,
        message: "Erro ao cadastrar cliente"
      });
    }

    return res.status(201).json({
      success: true,
      message: "Cliente cadastrado com sucesso"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao cadastrar cliente",
      error: error.message
    });
  }
});

//UPDATE
router.put("/clientes/me", async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { nome, email, cpf, telefone, senha, clubMember, ativo } = req.body;

    const clientes = await getClientes();
    const cliente = clientes.find(c => c.id === usuarioId);

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: "Cliente não encontrado"
      });
    }

    const atualizado = await editCliente(
      usuarioId,
      nome,
      email,
      cpf,
      telefone,
      senha,
      clubMember,
      ativo
    );

    if (!atualizado) {
      return res.status(500).json({
        success: false,
        message: "Erro ao atualizar cliente"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cliente atualizado com sucesso"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao editar cliente",
      error: error.message
    });
  }
});

//DELETE
router.delete("/clientes/me", async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const deletado = await deleteCliente(usuarioId);

    if (!deletado) {
      return res.status(404).json({
        success: false,
        message: "Cliente não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Conta removida com sucesso"
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Cliente possui vínculos e não pode ser excluído",
      error: error.message
    });
  }
});

module.exports = router;
