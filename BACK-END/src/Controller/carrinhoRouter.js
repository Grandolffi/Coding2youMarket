const express = require("express");
const router = express.Router();

const {
  insertCarrinho,
  getCarrinho,
  getCarrinhoPorPedido,
  editCarrinho,
  deleteCarrinho
} = require("../Model/DAO/carrinhoDAO");


// READ
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


// READ POR ID
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


// READ POR PEDIDO
router.get("/carrinho/pedido/:pedidoId", async (req, res) => {
  try {
    const pedidoId = Number(req.params.pedidoId);

    if (!pedidoId) {
      return res.status(400).json({
        success: false,
        message: "pedidoId inválido"
      });
    }

    const carrinho = await getCarrinhoPorPedido(pedidoId);

    if (!carrinho || carrinho.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Carrinho vazio para este pedido"
      });
    }

    return res.status(200).json(carrinho);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar carrinho do pedido",
      error: error.message
    });
  }
});


// CREATE
router.post("/carrinho", async (req, res) => {
  try {
    const { pedidoId, produtoId, quantidade, observacao } = req.body;

    if (!pedidoId || !produtoId || quantidade == null) {
      return res.status(400).json({
        success: false,
        message: "pedidoId, produtoId e quantidade são obrigatórios"
      });
    }

    const result = await insertCarrinho(
      pedidoId,
      produtoId,
      quantidade,
      observacao
    );

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


//UPDATE
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

// DELETE
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

module.exports = router;
