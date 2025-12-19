const express = require("express");
const router = express.Router();

const {insertPedido, getPedidos, getPedidoPorId, getPedidosPorUsuario, getPedidosAtivos,
  updateStatusPedido, updateDatasPedido, deletePedido, cancelarPedido} 
  = require("../Model/DAO/pedidoDao");

const auth = require("../Middleware/authJWTMid");

router.use(auth);

// READ TODOS ATIVOS
router.get("/pedidos/ativos", async (req, res) => {
  try {
    const pedidos = await getPedidosAtivos();
    return res.status(200).json({ success: true, pedidos });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar pedidos ativos",
      error: error.message
    });
  }
});


// READ POR PEDIDO DO USUARIO
router.get("/pedidos/meus", async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const pedidos = await getPedidosPorUsuario(usuarioId);

    if (!pedidos || pedidos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nenhum pedido encontrado"
      });
    }

    return res.status(200).json({ success: true, pedidos });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar pedidos do usuário",
      error: error.message
    });
  }
});


// READ TODOS
router.get("/pedidos", async (req, res) => {
  try {
    const pedidos = await getPedidos();
    return res.status(200).json({ success: true, pedidos });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar pedidos",
      error: error.message
    });
  }
});


// READ POR ID
router.get("/pedidos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const usuarioId = req.usuario.id;

    const pedido = await getPedidoPorId(id);

    if (!pedido || pedido.usuarioId !== usuarioId) {
      return res.status(404).json({
        success: false,
        message: "Pedido não encontrado"
      });
    }

    return res.status(200).json({ success: true, pedido });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar pedido",
      error: error.message
    });
  }
});


// CREATE 
router.post("/pedidos", async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const {
      enderecoId,
      frequencia,
      diaEntrega,
      valorTotal,
      valorFinal,
      dataProximaEntrega,
      dataProximaCobranca
    } = req.body;

    if (!enderecoId || !frequencia || valorTotal == null || valorFinal == null) {
      return res.status(400).json({
        success: false,
        message: "Campos obrigatórios não informados"
      });
    }

    const pedido = await insertPedido({
      usuarioId,
      enderecoId,
      frequencia,
      diaEntrega,
      valorTotal,
      valorFinal,
      dataProximaEntrega,
      dataProximaCobranca
    });

    return res.status(201).json({
      success: true,
      message: "Pedido criado com sucesso",
      pedido
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao criar pedido",
      error: error.message
    });
  }
});


// UPDATE STATUS
router.put("/pedidos/:id/status", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const statusPermitidos = ["ativa", "pausada", "cancelada", "pendente_estoque"];

    if (!statusPermitidos.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status inválido"
      });
    }

    const pedidoAtualizado = await updateStatusPedido(id, status);

    if (!pedidoAtualizado) {
      return res.status(404).json({
        success: false,
        message: "Pedido não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Status atualizado",
      pedido: pedidoAtualizado
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao atualizar status",
      error: error.message
    });
  }
});


// UPDATE DATAS
router.put("/pedidos/:id/datas", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { dataProximaEntrega, dataProximaCobranca } = req.body;

    const pedidoAtualizado = await updateDatasPedido(
      id,
      dataProximaEntrega,
      dataProximaCobranca
    );

    if (!pedidoAtualizado) {
      return res.status(404).json({
        success: false,
        message: "Pedido não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Datas atualizadas",
      pedido: pedidoAtualizado
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao atualizar datas",
      error: error.message
    });
  }
});


// SOFT DELETE 
router.patch("/pedidos/:id/cancelar", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const pedidoCancelado = await cancelarPedido(id);

    if (!pedidoCancelado) {
      return res.status(404).json({
        success: false,
        message: "Pedido não encontrado ou já cancelado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Pedido cancelado",
      pedido: pedidoCancelado
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao cancelar pedido",
      error: error.message
    });
  }
});


// HARD DELETE
router.delete("/pedidos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const deletado = await deletePedido(id);

    if (!deletado) {
      return res.status(404).json({
        success: false,
        message: "Pedido não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Pedido removido definitivamente"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao deletar pedido",
      error: error.message
    });
  }
});

module.exports = router;
