const express = require("express");
const router = express.Router();

const {insertEntrega, getEntregas, getEntregaPorId, getEntregasPorPedido, editStatusEntrega, confirmarEntrega,
  registrarProblemaEstoque, deleteEntrega} = require("../Model/DAO/entregaDao");

const auth = require("../Middleware/authJWTMid");

router.use(auth);


// READ TODAS 
router.get("/entregas", async (req, res) => {
  try {
    const entregas = await getEntregas();

    return res.status(200).json({
      success: true,
      entregas
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar entregas",
      error: error.message
    });
  }
});


// READ POR PEDIDO
router.get("/entregas/pedido/:pedidoId", async (req, res) => {
  try {
    const pedidoId = Number(req.params.pedidoId);

    if (!pedidoId) {
      return res.status(400).json({
        success: false,
        message: "pedidoId inválido"
      });
    }

    const entregas = await getEntregasPorPedido(pedidoId);

    if (!entregas || entregas.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nenhuma entrega encontrada para este pedido"
      });
    }

    return res.status(200).json({
      success: true,
      entregas
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar entregas do pedido",
      error: error.message
    });
  }
});


// READ POR ID
router.get("/entregas/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID inválido"
      });
    }

    const entrega = await getEntregaPorId(id);

    if (!entrega) {
      return res.status(404).json({
        success: false,
        message: "Entrega não encontrada"
      });
    }

    return res.status(200).json({
      success: true,
      entrega
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar entrega",
      error: error.message
    });
  }
});


// CREATE 
router.post("/entregas", async (req, res) => {
  try {
    const {
      pedidoId,
      enderecoId,
      dataEntrega,
      status,
      problemaEstoque,
      observacoes
    } = req.body;

    if (!pedidoId || !enderecoId || !dataEntrega) {
      return res.status(400).json({
        success: false,
        message: "Campos obrigatórios não informados"
      });
    }

    const entrega = await insertEntrega(
      pedidoId,
      enderecoId,
      dataEntrega,
      status,
      problemaEstoque,
      observacoes
    );

    if (!entrega) {
      return res.status(400).json({
        success: false,
        message: "Erro ao criar entrega"
      });
    }

    return res.status(201).json({
      success: true,
      message: "Entrega criada com sucesso",
      entrega
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao criar entrega",
      error: error.message
    });
  }
});


// UPDATE STATUS
router.put("/entregas/:id/status", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!id || !status) {
      return res.status(400).json({
        success: false,
        message: "ID ou status inválido"
      });
    }

    const entrega = await editStatusEntrega(id, status);

    if (!entrega) {
      return res.status(404).json({
        success: false,
        message: "Entrega não encontrada"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Status atualizado com sucesso",
      entrega
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao atualizar status",
      error: error.message
    });
  }
});


// UPDATE CONFIRMAR ENTREGA
router.put("/entregas/:id/confirmar", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const entrega = await confirmarEntrega(id);

    if (!entrega) {
      return res.status(404).json({
        success: false,
        message: "Entrega não encontrada"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Entrega confirmada com sucesso",
      entrega
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao confirmar entrega",
      error: error.message
    });
  }
});


// UPDATE PROBLEMA DE ESTOQUE
router.put("/entregas/:id/problema-estoque", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { observacoes } = req.body;

    const entrega = await registrarProblemaEstoque(id, observacoes);

    if (!entrega) {
      return res.status(404).json({
        success: false,
        message: "Entrega não encontrada"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Problema de estoque registrado",
      entrega
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao registrar problema de estoque",
      error: error.message
    });
  }
});


// DELETE
router.delete("/entregas/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const sucesso = await deleteEntrega(id);

    if (!sucesso) {
      return res.status(404).json({
        success: false,
        message: "Entrega não encontrada"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Entrega removida com sucesso"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao remover entrega",
      error: error.message
    });
  }
});

module.exports = router;
