const express = require("express");
const router = express.Router();

const { insertPagamento, getPagamentos, getPagamentoPorId, getPagamentosPorUsuario,
  updateStatusPagamento } = require("../Model/DAO/pagamentoDAO");

const auth = require("../Middleware/authJWTMid");

router.use(auth);

// READ TODOS
router.get("/pagamentos", async (req, res) => {
  try {
    const pagamentos = await getPagamentos();
    return res.json({ success: true, pagamentos });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// READ MEUS
router.get("/pagamentos/meus", async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const pagamentos = await getPagamentosPorUsuario(usuarioId);

    return res.json({ success: true, pagamentos: pagamentos || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// READ POR ID
router.get("/pagamentos/:id", async (req, res) => {
  try {
    const pagamento = await getPagamentoPorId(req.params.id);

    if (!pagamento) {
      return res.status(404).json({ message: "Pagamento não encontrado" });
    }

    if (pagamento.usuarioid !== req.usuario.id) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    return res.json({ success: true, pagamento });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// CREATE
router.post("/pagamentos", async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { cartaoId, valor } = req.body;

    const pagamento = await insertPagamento(usuarioId, cartaoId, valor);

    return res.status(201).json({
      success: true,
      message: "Pagamento criado",
      pagamento
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// UPDATE STATUS
router.put("/pagamentos/:id/status", async (req, res) => {
  const { status } = req.body;
  const pagamento = await updateStatusPagamento(req.params.id, status);

  return res.json({ success: true, pagamento });
});

module.exports = router;
