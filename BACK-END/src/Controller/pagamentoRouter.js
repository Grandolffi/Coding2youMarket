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

// ✅ PAGAMENTO DIRETO COM TOKEN (SEM SALVAR CARTÃO)
router.post("/pagamentos/processar-direto", auth, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const {
      token,
      transactionAmount,
      installments,
      description,
      paymentMethodId
    } = req.body;

    // Validação
    if (!token || !transactionAmount) {
      return res.status(400).json({
        success: false,
        message: "Token e valor são obrigatórios"
      });
    }

    console.log('💳 Processando pagamento direto...');
    console.log('✅ Token:', token);
    console.log('✅ Valor:', transactionAmount);

    const paymentClient = new Payment(client);

    // Criar pagamento com token - PAYLOAD CORRIGIDO
    const paymentData = {
      transaction_amount: Number(Number(transactionAmount).toFixed(2)),
      token: token,
      description: description || "Compra Coding2You Market",
      installments: Number(installments) || 1,
      payment_method_id: paymentMethodId || "master",
      payer: {
        // ⚠️ EM SANDBOX, USAR EMAIL DE TEST USER VÁLIDO
        email: "test_user_123456789@testuser.com",
        first_name: "Test",
        last_name: "User",
        identification: {
          type: "CPF",
          number: "19119119100"
        }
      },
      binary_mode: true // ✅ IMPORTANTE: Retorna approved ou rejected direto
    };

    console.log('📦 Enviando ao Mercado Pago...');

    const payment = await paymentClient.create({
      body: paymentData
    });

    console.log('✅ Pagamento criado:', payment.id, 'Status:', payment.status);

    // Salvar no banco
    await insertPagamentoMercadoPago({
      usuarioId,
      cartaoId: null, // Sem cartão salvo
      valor: transactionAmount,
      status: payment.status,
      transacaoId: payment.id.toString()
    });

    return res.status(201).json({
      success: true,
      status: payment.status,
      statusDetail: payment.status_detail,
      mercadoPagoId: payment.id,
      message: payment.status === 'approved' ? 'Pagamento aprovado!' : 'Pagamento processado'
    });

  } catch (error) {
    console.error("❌ Erro ao processar pagamento:");
    console.error("Error completo:", JSON.stringify(error, null, 2));

    let errorMessage = "Erro ao processar pagamento";
    let errorDetails = error.message;

    if (error.cause && error.cause.length > 0) {
      errorDetails = error.cause.map(e => e.description).join('; ');
    }

    return res.status(500).json({
      success: false,
      message: errorMessage,
      details: errorDetails,
      mpStatus: error.status
    });
  }
});


// SALVAR CARTÃO - VERSÃO SIMPLES (SÓ TOKEN)
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
    console.log('📝 Salvando token do cartão...');
    // SALVAR APENAS O TOKEN (modo antigo que funcionava)
    const cartaoSalvo = await salvarCartaoTokenizado({
      usuarioId,
      customerId: null,
      cardId: null,
      tokenCartao: token,
      bandeira: bandeira || "master",
      ultimos4Digitos: ultimos4digitos || "****",
      nomeImpresso: nomeImpresso || "",
      principal: principal || false,
      isDebito: false
    });
    console.log('✅ Token salvo no banco:', cartaoSalvo.id);
    return res.status(201).json({
      success: true,
      message: "Cartão salvo com sucesso",
      cartao: cartaoSalvo
    });
  } catch (error) {
    console.error('❌ Erro:', error);
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
      token,
      transactionAmount,
      installments,
      description,
      paymentMethodId,
      email
    } = req.body;

    // Validação e debug
    console.log('📊 Dados recebidos:', { token, transactionAmount, email, installments });

    if (!token || !transactionAmount || !email) {
      return res.status(400).json({
        success: false,
        message: "Dados incompletos"
      });
    }

    // Converter vírgula para ponto (formato brasileiro → americano)
    const valorLimpo = String(transactionAmount).replace(',', '.');
    let valorNumerico = Number(valorLimpo);

    // Arredondar para 2 casas decimais (MP exige exatamente 2 casas)
    valorNumerico = Math.round(valorNumerico * 100) / 100;

    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      console.error('❌ Valor inválido:', transactionAmount, '→', valorNumerico);
      return res.status(400).json({
        success: false,
        message: "Valor de transação inválido"
      });
    }

    console.log('💳 Processando pagamento...');
    console.log('Token:', token);
    console.log('Valor original:', transactionAmount, '→ Convertido:', valorNumerico);
    const paymentClient = new Payment(client);
    const payment = await paymentClient.create({
      body: {
        transaction_amount: valorNumerico,
        token: token,
        description: description || "Pedido Subscrivery",
        installments: parseInt(installments) || 1,
        payment_method_id: paymentMethodId || "master",
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
    console.error('❌ Erro:', error);
    return res.status(500).json({
      success: false,
      message: "Erro ao processar pagamento",
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