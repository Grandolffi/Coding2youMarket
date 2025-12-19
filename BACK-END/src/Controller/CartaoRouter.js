const express = require("express");
const router = express.Router();

const {insertCartaoCredito, getCartoesCredito, getCartoesPorUsuario, getCartaoById, editCartaoCredito,
  deleteCartaoCredito} = require("../Model/DAO/cartaoDAO");

const auth = require("../Middleware/authJWTMid");

router.use(auth);


//READ TODOS
router.get("/cartoes", async (req, res) => {
  try {
    const cartoes = await getCartoesCredito();
    return res.status(200).json({
      success: true,
      cartoes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar cartões",
      error: error.message
    });
  }
});


// READ CARTÕES POR USER
router.get("/cartoes/meus", async (req, res) => {
  try {
    const usuarioId = req.usuario.userId;

    const cartoes = await getCartoesPorUsuario(usuarioId);

    return res.status(200).json({
      success: true,
      cartoes: cartoes || []
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar cartões do usuário",
      error: error.message
    });
  }
});


// READ CARTOES POR ID
router.get("/cartoes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID inválido"
      });
    }

    const cartao = await getCartaoById(id);

    if (!cartao) {
      return res.status(404).json({
        success: false,
        message: "Cartão não encontrado"
      });
    }

    // CHECANDO ID PARA SO O USER VER O PROPRIO CARTAO
    if (cartao.usuarioid !== req.usuario.userId) {
      return res.status(403).json({
        success: false,
        message: "Acesso negado"
      });
    }

    return res.status(200).json({
      success: true,
      cartao
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar cartão",
      error: error.message
    });
  }
});


// CREATE
router.post("/cartoes", async (req, res) => {
  try {
    const usuarioId = req.usuario.userId;
    const {
      tokenCartao,
      bandeira,
      ultimos4Digitos,
      nomeImpresso,
      principal,
      isDebito
    } = req.body;

    if (!tokenCartao || !bandeira || !ultimos4Digitos || !nomeImpresso) {
      return res.status(400).json({
        success: false,
        message: "Campos obrigatórios não informados"
      });
    }

    const cartao = await insertCartaoCredito(
      usuarioId,
      tokenCartao,
      bandeira,
      ultimos4Digitos,
      nomeImpresso,
      principal,
      isDebito
    );

    return res.status(201).json({
      success: true,
      message: "Cartão adicionado com sucesso",
      cartao
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao adicionar cartão",
      error: error.message
    });
  }
});


// UPDATE
router.put("/cartoes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nomeImpresso, principal } = req.body;

    const cartao = await getCartaoById(id);

    if (!cartao) {
      return res.status(404).json({
        success: false,
        message: "Cartão não encontrado"
      });
    }

    if (cartao.usuarioid !== req.usuario.userId) {
      return res.status(403).json({
        success: false,
        message: "Acesso negado"
      });
    }

    const atualizado = await editCartaoCredito(id, nomeImpresso, principal);

    return res.status(200).json({
      success: true,
      message: "Cartão atualizado com sucesso",
      cartao: atualizado
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao atualizar cartão",
      error: error.message
    });
  }
});


// DELETE
router.delete("/cartoes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const cartao = await getCartaoById(id);

    if (!cartao) {
      return res.status(404).json({
        success: false,
        message: "Cartão não encontrado"
      });
    }

    if (cartao.usuarioid !== req.usuario.userId) {
      return res.status(403).json({
        success: false,
        message: "Acesso negado"
      });
    }

    await deleteCartaoCredito(id);

    return res.status(200).json({
      success: true,
      message: "Cartão removido com sucesso"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao remover cartão",
      error: error.message
    });
  }
});

module.exports = router;
