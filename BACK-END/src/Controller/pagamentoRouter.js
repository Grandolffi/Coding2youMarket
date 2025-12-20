const express = require("express");
const router = express.Router();

const { salvarCartaoTokenizado } = require("../Model/DAO/cartaoDAO");
const { insertPagamento, insertPagamentoMercadoPago, getPagamentos, getPagamentoPorId, getPagamentosPorUsuario, updateStatusPagamento } = require("../Model/DAO/pagamentoDAO");

const auth = require("../Middleware/authJWTMid");

const { MercadoPagoConfig, Payment, PreApproval } = require('mercadopago');
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

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

router.post("/pagamentos/salvar-cartao", async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { token, bandeira, ultimos4digitos, nomeImpresso, principal } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token do cartão é obrigatório"
      });
    }

    const cartaoSalvo = await salvarCartaoTokenizado({
      usuarioId,
      tokenCartao: token,
      bandeira: bandeira || "Desconhecida",
      ultimos4Digitos: ultimos4digitos || "****",
      nomeImpresso: nomeImpresso || "",
      principal: principal || false,
      isDebito: false
    });

    return res.status(201).json({
      success: true,
      message: "Cartão salvo com sucesso",
      cartao: cartaoSalvo
    });

  } catch (error) {
    console.error("Erro ao salvar cartão:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao salvar cartão",
      error: error.message
    });
  }
});

router.post("/pagamentos/processar", async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const {
      token,
      transactionAmount,
      installments,
      description,
      paymentMethodId,
      email
    } = req.body;

    if (!token || !transactionAmount || !email) {
      return res.status(400).json({
        success: false,
        message: "Dados incompletos"
      });
    }

    const paymentClient = new Payment(client);

    const payment = await paymentClient.create({
      body: {
        transaction_amount: parseFloat(transactionAmount),
        token: token,
        description: description || "Pedido Subscrivery",
        installments: parseInt(installments) || 1,
        payment_method_id: paymentMethodId || "visa",
        payer: {
          email: email
        }
      }
    });

    const pagamentoSalvo = await insertPagamentoMercadoPago({
      usuarioId,
      cartaoId: null,
      valor: transactionAmount,
      status: payment.status,
      transacaoId: payment.id.toString()
    });

    return res.status(201).json({
      success: true,
      message: "Pagamento processado",
      pagamento: {
        id: pagamentoSalvo.id,
        status: payment.status,
        statusDetail: payment.status_detail,
        mercadoPagoId: payment.id
      }
    });

  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao processar pagamento",
      error: error.message
    });
  }
});

router.post("/pagamentos/criar-assinatura", async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { email, autoRecurringAmount, frequency, frequencyType, reason, backUrl } = req.body;

    if (!email || !autoRecurringAmount || !frequency || !frequencyType) {
      return res.status(400).json({
        success: false,
        message: "Dados incompletos"
      });
    }
    const preApprovalClient = new PreApproval(client);
    const preapproval = await preApprovalClient.create({
      body: {
        reason: reason || "Assinatura Subscrivery",
        auto_recurring: {
          frequency: parseInt(frequency),
          frequency_type: frequencyType,
          transaction_amount: parseFloat(autoRecurringAmount),
          currency_id: "BRL"
        },
        payer_email: email,
        back_url: backUrl || "https://seusite.com/assinatura/confirmada",
        status: "pending"
      }
    });

    return res.status(201).json({
      success: true,
      message: "Assinatura criada com sucesso",
      assinatura: {
        id: preapproval.id,
        initPoint: preapproval.init_point,
        status: preapproval.status
      }
    });
  } catch (error) {
    console.error("Erro ao criar assinatura:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao criar assinatura",
      error: error.message
    });
  }
});

module.exports = router;
