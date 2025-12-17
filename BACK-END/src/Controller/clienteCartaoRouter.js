const express = require("express");
const router = express.Router();

const {insertCartaoCliente, getCartoesCliente, getCartoesClientePorUsuario, editCartaoCliente, deleteCartaoCliente}
 = require("../Model/DAO/clienteCartaoDao");

//READ
router.get("/cartoes-cliente", async (req, res) => {
  try {
    const cartoes = await getCartoesCliente();

    return res.status(200).json({
      success: true,
      cartoes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar vínculos de cartão",
      error: error.message
    });
  }
});

//READ POR USUÁRIO
router.get("/cartoes-cliente/usuario/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;

    if (!usuarioId) {
      return res.status(400).json({
        success: false,
        message: "usuarioId inválido"
      });
    }

    const cartoes = await getCartoesClientePorUsuario(usuarioId);

    if (!cartoes || cartoes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nenhum cartão vinculado encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      cartoes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar cartões do usuário",
      error: error.message
    });
  }
});

//CREATE - VINCULAR CARTAO
router.post("/cartoes-cliente", async (req, res) => {
  try {
    const { usuarioId, cartaoId } = req.body;

    if (!usuarioId || !cartaoId) {
      return res.status(400).json({
        success: false,
        message: "usuarioId e cartaoId são obrigatórios"
      });
    }

    const vinculo = await insertCartaoCliente(usuarioId, cartaoId);

    return res.status(201).json({
      success: true,
      message: "Cartão vinculado ao usuário com sucesso",
      cartaoCliente: vinculo
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao vincular cartão",
      error: error.message
    });
  }
});

// ATIVAR / DESATIVAR 
router.put("/cartoes-cliente/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { ativo } = req.body;

    if (!id || typeof ativo !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "ID ou status inválido"
      });
    }

    const atualizado = await editCartaoCliente(id, ativo);

    if (!atualizado) {
      return res.status(404).json({
        success: false,
        message: "Vínculo não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vínculo atualizado com sucesso",
      cartaoCliente: atualizado
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao atualizar vínculo",
      error: error.message
    });
  }
});

// SOFT DELETE 
router.patch("/cartoes-cliente/:id/desvincular", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID inválido"
      });
    }

    const desvinculado = await deleteCartaoCliente(id);

    if (!desvinculado) {
      return res.status(404).json({
        success: false,
        message: "Vínculo não encontrado ou já desativado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cartão desvinculado com sucesso"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao desvincular cartão",
      error: error.message
    });
  }
});

module.exports = router;
