const express = require("express");
const router = express.Router();
const { salvarCartaoTokenizado, salvarCustomerId, getCustomerIdPorUsuario } = require("../Model/DAO/cartaoDao");
const { insertPagamento, insertPagamentoMercadoPago, getPagamentos, getPagamentoPorId, getPagamentosPorUsuario, updateStatusPagamento } = require("../Model/DAO/pagamentoDao");
const { getClubMarketPorUsuario, updateStatusClubMarket } = require('../Model/DAO/clubMarketDao');
const { updateClubMember } = require('../Model/DAO/clienteDao');
const auth = require("../Middleware/authJWTMid");
const { MercadoPagoConfig, Payment, PreApproval, Customer, CustomerCard } = require('mercadopago');
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

let card;

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
    console.error("Webhook erro:", error);
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
      return res.status(400).json({
        success: false,
        message: "Token do cartão é obrigatório"
      });
    }
    // 1️⃣ Buscar customer_id no banco
    let customerId = await getCustomerIdPorUsuario(usuarioId);

    // 2️⃣ Criar customer se não existir
    if (!customerId) {
      const customerClient = new Customer(client);

      // Email: usar real OU fake (sandbox.local) - NUNCA @testuser.com
      const emailCustomer = req.usuario.email || `user_${usuarioId}@sandbox.local`;

      const customer = await customerClient.create({
        body: {
          email: emailCustomer,
          first_name: req.usuario.nome || "Cliente",
          last_name: "App"
        }
      });

      customerId = customer.id;
      await salvarCustomerId(usuarioId, customerId);
      console.log("✅ Customer criado:", customerId);
    }

    // 2️⃣ Salvar cartão no Customer
    console.log('Tentando criar cartão para customer:', customerId);
    console.log('Token recebido:', token ? 'Presente' : 'Ausente');

    const cardClient = new CustomerCard(client);
    let card;

    try {
      card = await cardClient.create({
        customer_id: customerId,
        body: { token }
      });
      console.log('Cartão criado com sucesso! ID:', card.id);

      // ✅ Agora sim, salvar customer_id no banco (só depois que o card foi criado)
      await salvarCustomerId(usuarioId, customerId);
      console.log('Customer_id salvo no banco:', customerId);

    } catch (error) {
      console.error('Erro ao criar cartão:', {
        message: error.message,
        status: error.status,
        cause: error.cause
      });

      // Se o customer não existe (404), deletar do banco e do MP
      if (error.status === 404) {
        console.log('Customer inválido, tentando deletar...');

        // Deletar customer do Mercado Pago
        const customerClient = new Customer(client);
        try {
          await customerClient.remove({ customerId: customerId });
          console.log('Customer deletado do MP');
        } catch (delError) {
          console.log('Não foi possível deletar customer:', delError.message);
        }

        // Limpar do banco também
        await salvarCustomerId(usuarioId, null);

        return res.status(400).json({
          success: false,
          message: 'Erro ao adicionar cartão. Tente novamente.',
          error: 'customer_not_found'
        });
      } else {
        throw error;
      }
    }


    // 3️⃣ Salvar card_id e customer_id no banco
    const cartaoSalvo = await salvarCartaoTokenizado({
      usuarioId,
      customerId: customerId,
      cardId: card.id,
      tokenCartao: null, // Não armazenar mais o token
      bandeira: card.payment_method.id,
      ultimos4Digitos: card.last_four_digits,
      nomeImpresso: card.cardholder.name,
      principal: principal || false,
      isDebito: false
    });

    return res.status(201).json({
      success: true,
      message: "Cartão salvo com sucesso",
      cartao: cartaoSalvo
    });
  } catch (error) {
    console.error('Erro ao salvar cartão:', error);
    return res.status(500).json({
      success: false,
      message: "Erro ao salvar cartão",
      error: error.message
    });
  }
});

// PROCESSAR PAGAMENTO COM SAVED CARD
router.post("/pagamentos/processar", auth, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const {
      customerId,      // ✅ NOVO
      cardId,          // ✅ NOVO
      securityCode,    // ✅ NOVO (CVV)
      transactionAmount,
      installments,
      description,
      email
    } = req.body;

    if (!customerId || !cardId || !securityCode || !transactionAmount || !email) {
      return res.status(400).json({
        success: false,
        message: "Dados incompletos"
      });
    }

    const paymentClient = new Payment(client);
    const payment = await paymentClient.create({
      body: {
        transaction_amount: parseFloat(transactionAmount),
        installments: parseInt(installments) || 1,
        description: description || "Pedido Subscrivery",
        payer: {
          id: customerId,  // ✅ ID do customer
          email: email
        },
        payment_method_id: "credit_card",
        token: cardId,         // ✅ Usar card_id como token
        security_code: securityCode  // ✅ CVV
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
    console.error('Erro ao processar pagamento:', error);
    return res.status(500).json({
      success: false,
      message: "Erro ao processar pagamento",
      error: error.message,
      details: error.cause?.[0]?.description || ""
    });
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