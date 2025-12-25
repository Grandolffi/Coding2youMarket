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
console.log("Webhook endpoint registrado SEM autenticação!");
console.log("DEBUG: pagamentoRouter.js carregado - VERSÃO: 2025-12-24-22:00 (Saved Cards)");
router.post("/pagamentos/webhook", async (req, res) => {
  res.status(200).send("OK");
  try {
    const { type, data } = req.body;
    console.log("Webhook recebido:", type, data);
    if (type === "payment") {
      try {
        const paymentClient = new Payment(client);
        const payment = await paymentClient.get({ id: data.id });
        console.log(`Status do pagamento ${payment.id}: ${payment.status}`);
        if (payment.status === "approved") {
          console.log("Pagamento aprovado!");
        }
      } catch (error) {
        console.warn("Pagamento ainda não disponível:", data.id);
      }
    } else if (type === "subscription_preapproval" || type === "subscription_authorized_payment") {
      try {
        const preApprovalClient = new PreApproval(client);
        const preapproval = await preApprovalClient.get({ id: data.id });
        console.log(`Status da assinatura ${data.id}: ${preapproval.status}`);
        if (preapproval.status === "authorized") {
          console.log("Assinatura aprovada!");
          if (preapproval.external_reference) {
            const usuarioId = parseInt(preapproval.external_reference.replace("club_", ""));
            if (!isNaN(usuarioId)) {
              const clube = await getClubMarketPorUsuario(usuarioId);
              if (clube) {
                await updateStatusClubMarket(clube.id, "ativa");
                await updateClubMember(usuarioId, true);
                console.log(`Club Market ativado para usuário ${usuarioId}`);
              }
            }
          }
        }
      } catch (error) {
        console.warn("Assinatura ainda não disponível:", data.id);
      }
    } else {
      console.log(`Tipo de notificação não tratado: ${type}`);
    }
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
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
    const user = req.usuario;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token do cartão é obrigatório"
      });
    }
    console.log('📝 Salvando cartão para usuário:', usuarioId);
    const customerClient = new Customer(client);
    let customerId = await getCustomerIdPorUsuario(usuarioId);
    // ✅ BUSCAR/CRIAR CUSTOMER
    if (!customerId) {
      console.log('🔍 Buscando customer no MP pelo email:', user.email);

      try {
        const { results } = await customerClient.search({
          options: {
            filters: {
              email: user.email
            }
          }
        });
        if (results && results.length > 0) {
          customerId = results[0].id;
          console.log('♻️ Customer encontrado:', customerId);
        } else {
          console.log('🆕 Criando novo customer...');
          const customer = await customerClient.create({
            body: {
              email: user.email,
              first_name: user.nome?.split(' ')[0] || 'Cliente',
              last_name: user.nome?.split(' ').slice(1).join(' ') || '',
              phone: {
                area_code: user.telefone?.substring(0, 2) || '00',
                number: user.telefone?.substring(2) || '000000000'
              },
              identification: {
                type: 'CPF',
                number: user.cpf || '00000000000'
              }
            }
          });
          customerId = customer.id;
          console.log('✅ Customer criado:', customerId);
        }
      } catch (error) {
        if (error.cause?.[0]?.code === '101') {
          console.log('🔄 Customer existe, buscando...');
          const { results } = await customerClient.search({
            options: { filters: { email: user.email } }
          });
          if (results && results.length > 0) {
            customerId = results[0].id;
            console.log('✅ Customer recuperado:', customerId);
          }
        } else {
          throw error;
        }
      }
    } else {
      console.log('✅ Customer do banco:', customerId);
    }
    // ✅ SALVAR CARTÃO (AQUI ESTAVA O ERRO!)
    console.log('💳 Salvando cartão...');
    const cardClient = new CustomerCard(client);

    const card = await cardClient.create({
      customer_id: customerId,
      body: { token }
    });
    console.log('✅ Card criado:', card.id);
    // ✅ SALVAR NO BANCO
    const cartaoSalvo = await salvarCartaoTokenizado({
      usuarioId,
      customerId,
      cardId: card.id,
      tokenCartao: token,
      bandeira: bandeira || "master",
      ultimos4Digitos: ultimos4digitos || "****",
      nomeImpresso: nomeImpresso || "",
      principal: principal || false,
      isDebito: false
    });
    console.log('✅ Salvo no banco:', cartaoSalvo.id);
    return res.status(201).json({
      success: true,
      message: "Cartão salvo com sucesso",
      cartao: cartaoSalvo
    });
  } catch (error) {
    console.error("❌ Erro:", error);
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
      cartaoId,
      customerId,
      cardId,
      transactionAmount,
      installments,
      description,
      paymentMethodId,
      email
    } = req.body;
    if ((!customerId || !cardId) || !transactionAmount || !email) {
      return res.status(400).json({
        success: false,
        message: "Dados incompletos (precisa de customerId e cardId)"
      });
    }
    console.log('💰 Processando pagamento com saved card...');
    console.log('Customer:', customerId);
    console.log('Card:', cardId);
    const paymentClient = new Payment(client);
    const payment = await paymentClient.create({
      body: {
        transaction_amount: parseFloat(transactionAmount),
        description: description || "Pedido Subscrivery",
        installments: parseInt(installments) || 1,
        payment_method_id: paymentMethodId || "master",
        payer: {
          id: customerId,
          email: email
        }
      }
    });
    console.log('✅ Pagamento processado:', payment.id, payment.status);
    const pagamentoSalvo = await insertPagamentoMercadoPago({
      usuarioId,
      cartaoId: cartaoId || null,
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
    console.error("❌ Erro ao processar pagamento:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao processar pagamento",
      error: error.message
    });
  }
});
// CRIAR ASSINATURA
router.post("/pagamentos/criar-assinatura", auth, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { email, autoRecurringAmount, frequency, frequencyType, reason, backUrl, cardId, customerId } = req.body;
    if (!email || !autoRecurringAmount || !frequency || !frequencyType) {
      return res.status(400).json({
        success: false,
        message: "Dados incompletos"
      });
    }
    const preApprovalClient = new PreApproval(client);
    const body = {
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
    };
    // ✅ SE TEM CARD ID, ADICIONAR
    if (cardId && customerId) {
      body.card_token_id = cardId;
      body.payer_id = customerId;
      console.log('✅ Assinatura com saved card');
    }
    const preapproval = await preApprovalClient.create({ body });
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