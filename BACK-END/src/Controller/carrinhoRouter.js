const express = require("express");
const router = express.Router();

const {
  insertCarrinho,
  getCarrinho,
  getCarrinhoPorUsuario,
  limparCarrinho,
  editCarrinho,
  deleteCarrinho
} = require("../Model/DAO/carrinhoDAO");

// READ - Todos os carrinhos (Admin)
router.get("/carrinho", async (req, res) => {
  try {
    const carrinhos = await getCarrinho();

    return res.status(200).json(carrinhos);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar carrinhos",
      error: error.message
    });
  }
});

// READ - Item específico por ID
router.get("/carrinho/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const carrinhos = await getCarrinho();
    const carrinho = carrinhos.find(c => c.id === id);

    if (!carrinho) {
      return res.status(404).json({
        success: false,
        message: "Item do carrinho não encontrado"
      });
    }

    return res.status(200).json(carrinho);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar carrinho",
      error: error.message
    });
  }
});

// READ - Carrinho por usuário
router.get("/carrinho/usuario/:usuarioId", async (req, res) => {
  try {
    const usuarioId = Number(req.params.usuarioId);

    if (!usuarioId) {
      return res.status(400).json({
        success: false,
        message: "usuarioId inválido"
      });
    }

    const carrinho = await getCarrinhoPorUsuario(usuarioId);

    if (!carrinho || carrinho.length === 0) {
      return res.status(200).json([]); // Retorna array vazio, não erro
    }

    return res.status(200).json(carrinho);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar carrinho do usuário",
      error: error.message
    });
  }
});
// CREATE - Adicionar produto ao carrinho
router.post("/carrinho", async (req, res) => {
  try {
    const { usuarioId, produtoId, quantidade, observacao } = req.body;

    if (!usuarioId || !produtoId || quantidade == null) {
      return res.status(400).json({
        success: false,
        message: "usuarioId, produtoId e quantidade são obrigatórios"
      });
    }

    const result = await insertCarrinho(usuarioId, produtoId, quantidade, observacao);

    return res.status(201).json({
      success: true,
      message: "Produto adicionado ao carrinho com sucesso!",
      carrinho: result
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao adicionar produto ao carrinho",
      error: error.message
    });
  }
});

// UPDATE - Atualizar quantidade do item
router.put("/carrinho/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { quantidade, observacao } = req.body;

    if (quantidade == null) {
      return res.status(400).json({
        success: false,
        message: "Quantidade é obrigatória"
      });
    }

    const result = await editCarrinho(id, quantidade, observacao);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Item do carrinho não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Carrinho atualizado com sucesso!",
      carrinho: result
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao editar carrinho",
      error: error.message
    });
  }
});

// DELETE - Remover item específico
router.delete("/carrinho/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await deleteCarrinho(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Item do carrinho não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item removido do carrinho com sucesso!"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao excluir item do carrinho",
      error: error.message
    });
  }
});

// DELETE - Limpar todo o carrinho do usuário

router.delete("/carrinho/limpar/:usuarioId", async (req, res) => {
  try {
    const usuarioId = Number(req.params.usuarioId);

    if (!usuarioId) {
      return res.status(400).json({
        success: false,
        message: "usuarioId inválido"
      });
    }

    const result = await limparCarrinho(usuarioId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Carrinho já está vazio"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Carrinho limpo com sucesso!"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao limpar carrinho",
      error: error.message
    });
  }
});

module.exports = router;
