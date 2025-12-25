const express = require("express");
const router = express.Router();
const { salvarCartaoTokenizado, getCustomerIdPorUsuario } = require("../Model/DAO/cartaoDao");
const { insertPagamento, insertPagamentoMercadoPago, getPagamentos, getPagamentoPorId, getPagamentosPorUsuario, updateStatusPagamento } = require("../Model/DAO/pagamentoDao");
const { getClubMarketPorUsuario, updateStatusClubMarket } = require('../Model/DAO/clubMarketDao');
const { updateClubMember } = require('../Model/DAO/clienteDao');
const auth = require("../Middleware/authJWTMid");
const { MercadoPagoConfig, Payment, PreApproval, Customer, CustomerCard } = require('mercadopago');
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

router.post("/pagamentos/webhook", async (req, res) => {
  try {
    const { action, data } = req.body;

    if (!action || !data?.id) {
      return res.status(400).send("Evento inválido");
    }

    // PAGAMENTO ÚNICO
    if (action === "payment.updated") {
      const paymentClient = new Payment(client);
      const payment = await paymentClient.get({ id: data.id });

      if (payment.status === "approved") {
        await updateStatusPagamentoPorTransacao(payment.id.toString(), "aprovado");
      }
    }

    // ASSINATURA
    if (
      action === "subscription_preapproval.updated" ||
      action === "subscription_authorized_payment"
    ) {
      const preApprovalClient = new PreApproval(client);
      const preapproval = await preApprovalClient.get({ id: data.id });

      if (preapproval.status === "authorized" && preapproval.external_reference) {
        const usuarioId = parseInt(
          preapproval.external_reference.replace("club_", "")
        );

        if (!isNaN(usuarioId)) {
          const clube = await getClubMarketPorUsuario(usuarioId);
          if (clube) {
            await updateStatusClubMarket(clube.id, "ativa");
            await updateClubMember(usuarioId, true);
          }
        }
      }
    }

    return res.status(200).send("OK");
  } catch (error) {
    console.error("❌ Webhook erro:", error);
    return res.status(500).send("Erro");
  }
});

// READ TODOS
router.get("/pagamentos", auth, async (req, res) => {
  try {
    const pagamentos = await getPagamentos();
    return res.json({ success: true, pagamentos });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/pagamentos/meus", auth, async (req, res) => {
  try {
    const pagamentos = await getPagamentosPorUsuario(req.usuario.id);
    return res.json({ success: true, pagamentos: pagamentos || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// READ MEUS
router.get("/pagamentos/meus", auth, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const pagamentos = await getPagamentosPorUsuario(usuarioId);
    return res.json({ success: true, pagamentos: pagamentos || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});
// READ POR ID
router.get("/pagamentos/:id", auth, async (req, res) => {
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
router.post("/pagamentos", auth, async (req, res) => {
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
router.put("/pagamentos/:id/status", auth, async (req, res) => {
  const { status } = req.body;
  const pagamento = await updateStatusPagamento(req.params.id, status);
  return res.json({ success: true, pagamento });
});

// SALVAR CARTÃO COM CUSTOMER (SAVED CARD)
router.post("/pagamentos/salvar-cartao", auth, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { token, bandeira, ultimos4digitos, nomeImpresso, principal } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token obrigatório" });
    }

    const customerClient = new Customer(client);
    const cardClient = new CustomerCard(client);

    let customerId = await getCustomerIdPorUsuario(usuarioId);

    // Criar customer se não existir
    if (!customerId) {
      const customer = await customerClient.create({
        body: { email: req.usuario.email }
      });
      customerId = customer.id;
    }

    // Criar cartão
    const card = await cardClient.create({
      customer_id: customerId,
      body: { token }
    });

    // Salvar SOMENTE card_id (não salvar token)
    const cartaoSalvo = await salvarCartaoTokenizado({
      usuarioId,
      customerId,
      cardId: card.id,
      bandeira,
      ultimos4Digitos: ultimos4digitos,
      nomeImpresso,
      principal: principal || false,
      isDebito: false
    });

    return res.status(201).json({
      success: true,
      message: "Cartão salvo com sucesso",
      cartao: cartaoSalvo
    });
  } catch (error) {
    console.error("Erro salvar cartão:", error);
    return res.status(500).json({ message: "Erro ao salvar cartão" });
  }
});

// PROCESSAR PAGAMENTO COM SAVED CARD
router.post("/pagamentos/processar", auth, async (req, res) => {
  try {
    const {
      cartaoId,
      customerId,
      cardId,
      transactionAmount,
      installments,
      description,
      paymentMethodId
    } = req.body;

    if (!customerId || !cardId || !transactionAmount) {
      return res.status(400).json({ message: "Dados incompletos" });
    }

    const paymentClient = new Payment(client);

    const payment = await paymentClient.create({
      body: {
        transaction_amount: parseFloat(transactionAmount),
        installments: installments || 1,
        description: description || "Pagamento Subscrivery",
        payment_method_id: paymentMethodId,
        card_id: cardId,
        payer: { id: customerId }
      }
    });

    const pagamentoSalvo = await insertPagamentoMercadoPago({
      usuarioId: req.usuario.id,
      cartaoId,
      valor: transactionAmount,
      status: payment.status,
      transacaoId: payment.id.toString()
    });

    return res.status(201).json({
      success: true,
      pagamento: pagamentoSalvo
    });
  } catch (error) {
    console.error("Erro pagamento:", error);
    return res.status(500).json({ message: "Erro ao processar pagamento" });
  }
});

// CRIAR ASSINATURA
router.post("/pagamentos/criar-assinatura", auth, async (req, res) => {
  try {
    const { email, valor, frequency, frequencyType } = req.body;

    const preApprovalClient = new PreApproval(client);

    const preapproval = await preApprovalClient.create({
      body: {
        reason: "Assinatura Subscrivery",
        payer_email: email,
        external_reference: `club_${req.usuario.id}`,
        auto_recurring: {
          frequency,
          frequency_type: frequencyType,
          transaction_amount: parseFloat(valor),
          currency_id: "BRL"
        },
        back_url: "https://seusite.com/assinatura/confirmada",
        status: "pending"
      }
    });

    return res.status(201).json({
      success: true,
      initPoint: preapproval.init_point
    });
  } catch (error) {
    console.error("Erro assinatura:", error);
    return res.status(500).json({ message: "Erro ao criar assinatura" });
  }
});

module.exports = router;