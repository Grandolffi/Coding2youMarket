const express = require("express");
const router = express.Router();

const { insertPagamento, getPagamentos, getPagamentosPorUsuarioId, getPagamentosPorAssinaturaId, updateStatusPagamento, getPagamentoPorId} = require("../Model/DAO/pagamentoDAO");


//READ
router.get("/pagamentos", async (req, res) => {
  try {
    const pagamentos = await getPagamentos();
    return res.status(200).json(pagamentos);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar pagamentos",
      error: error.message
    });
  }
});


// READ POR ID 
router.get("/pagamentos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID do pagamento inválido"
      });
    }

    const pagamento = await getPagamentoPorId(id);

    if (!pagamento) {
      return res.status(404).json({
        success: false,
        message: "Pagamento não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      pagamento
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar pagamento",
      error: error.message
    });
  }
});


//READ POR USUÁRIO
router.get("/pagamentos/usuario/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const pagamentos = await getPagamentosPorUsuarioId(usuarioId);

    if (!pagamentos || pagamentos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nenhum pagamento encontrado para este usuário"
      });
    }

    return res.status(200).json(pagamentos);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar pagamentos do usuário",
      error: error.message
    });
  }
});


//READ POR ASSINATURA
router.get("/pagamentos/assinatura/:assinaturaId", async (req, res) => {
  try {
    const { assinaturaId } = req.params;

    const pagamentos = await getPagamentosPorAssinaturaId(assinaturaId);

    if (!pagamentos || pagamentos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nenhum pagamento encontrado para esta assinatura"
      });
    }

    return res.status(200).json(pagamentos);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar pagamentos da assinatura",
      error: error.message
    });
  }
});


//CREATE
router.post("/pagamentos", async (req, res) => {
  try {
    const { assinaturaId, usuarioId, cartaoId, valor } = req.body;

    if (!assinaturaId || !usuarioId || !cartaoId || valor == null) {
      return res.status(400).json({
        success: false,
        message: "Campos obrigatórios não informados"
      });
    }

    const pagamento = await insertPagamento(
      assinaturaId,
      usuarioId,
      cartaoId,
      valor
    );

    return res.status(201).json({
      success: true,
      message: "Pagamento criado com sucesso!",
      pagamento
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao criar pagamento",
      error: error.message
    });
  }
});


//UPDATE STATUS
router.put("/pagamentos/:id/status", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const statusPermitidos = ['pendente', 'aprovado', 'recusado', 'estornado'];

    if (!id || !statusPermitidos.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "ID ou status inválido"
      });
    }

    const pagamentoAtualizado = await updateStatusPagamento(id, status);

    if (!pagamentoAtualizado) {
      return res.status(404).json({
        success: false,
        message: "Pagamento não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Status do pagamento atualizado com sucesso!",
      pagamento: pagamentoAtualizado
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao atualizar pagamento",
      error: error.message
    });
  }
});


//CANCELAR / SOFT DELETE
router.patch("/pagamentos/:id/cancelar", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const pagamento = await getPagamentoPorId(id);

    if (!pagamento) {
      return res.status(404).json({
        success: false,
        message: "Pagamento não encontrado"
      });
    }

    if (pagamento.status === 'aprovado') {
      return res.status(403).json({
        success: false,
        message: "Pagamento aprovado não pode ser cancelado"
      });
    }

    const pagamentoCancelado = await updateStatusPagamento(id, 'estornado');

    return res.status(200).json({
      success: true,
      message: "Pagamento cancelado com sucesso!",
      pagamento: pagamentoCancelado
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao cancelar pagamento",
      error: error.message
    });
  }
});

module.exports = router;
