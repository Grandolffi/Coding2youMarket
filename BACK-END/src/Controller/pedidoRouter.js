const express = require("express");
const router = express.Router();

const {insertPedido, getPedidos, getPedidoPorId, getPedidosPorUsuario, getPedidosAtivos, updateStatusPedido, updateDatasPedido, deletePedido, cancelarPedido
} = require("../Model/DAO/pedidoDAO");


//READ POR PEDIDOS ATIVOS
router.get("/pedidos/ativos", async (req, res) => {
  try {
    const pedidos = await getPedidosAtivos();

    return res.status(200).json({
      success: true,
      pedidos
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar pedidos ativos",
      error: error.message
    });
  }
});


//READ - PEDIDOS POR USUÁRIO

router.get("/pedidos/usuario/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const pedidos = await getPedidosPorUsuario(usuarioId);

    if (!pedidos || pedidos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nenhum pedido encontrado para este usuário"
      });
    }

    return res.status(200).json({
      success: true,
      pedidos
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar pedidos do usuário",
      error: error.message
    });
  }
});

// READ 
router.get("/pedidos", async (req, res) => {
  try {
    const pedidos = await getPedidos();

    return res.status(200).json({
      success: true,
      pedidos
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar pedidos",
      error: error.message
    });
  }
});


// READ POR PEDIDO ID 
router.get("/pedidos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID do pedido inválido"
      });
    }

    const pedido = await getPedidoPorId(id);

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: "Pedido não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      pedido
    });
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
    const {
      usuarioId,
      enderecoId,
      frequencia,
      diaEntrega,
      valorTotal,
      valorFinal,
      dataProximaEntrega,
      dataProximaCobranca
    } = req.body;

    if (!usuarioId || !enderecoId || !frequencia || valorTotal == null || valorFinal == null) {
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


//UPDATE STATUS
router.put("/pedidos/:id/status", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const statusPermitidos = ['ativa', 'pausada', 'cancelada', 'pendente_estoque'];

    if (!id || !statusPermitidos.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "ID ou status inválido"
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
      message: "Status do pedido atualizado com sucesso",
      pedido: pedidoAtualizado
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao atualizar status do pedido",
      error: error.message
    });
  }
});


//UPDATE DATAS
router.put("/pedidos/:id/datas", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { dataProximaEntrega, dataProximaCobranca } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID inválido"
      });
    }

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
      message: "Datas do pedido atualizadas com sucesso",
      pedido: pedidoAtualizado
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao atualizar datas do pedido",
      error: error.message
    });
  }
});


//SOFT DELETE
router.patch("/pedidos/:id/cancelar", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID do pedido inválido"
      });
    }

    const pedidoCancelado = await cancelarPedido(id);

    if (!pedidoCancelado) {
      return res.status(404).json({
        success: false,
        message: "Pedido não encontrado ou já cancelado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Pedido cancelado com sucesso",
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


//HARD DELETE 
router.delete("/pedidos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID inválido"
      });
    }

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
