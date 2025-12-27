const express = require("express");
const router = express.Router();
const { insertPagamentoMercadoPago } = require("../Model/DAO/pagamentoDao");
const auth = require("../Middleware/authJWTMid");
const { MercadoPagoConfig, Payment } = require('mercadopago');

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

// ✅ PAGAMENTO DIRETO COM TOKEN (sem salvar cartão)
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

        if (!token || !transactionAmount) {
            return res.status(400).json({
                success: false,
                message: "Token e valor são obrigatórios"
            });
        }

        // 1. Log para verificar credenciais (sem expor a chave inteira)
        const tokenPrefix = process.env.MP_ACCESS_TOKEN ? process.env.MP_ACCESS_TOKEN.substring(0, 5) : 'MISSING';
        console.log(`🔑 MP Credential Prefix: ${tokenPrefix}...`);

        console.log('💳 Processando pagamento direto...');
        console.log('✅ Token:', token);
        console.log('✅ Valor:', transactionAmount);

        // 2. Email Seguro - Para evitar erro de validação de email
        // Em produção deve ser o email real, mas em teste sandbox as vezes requer email de test user
        const payerEmail = req.usuario.email || `test_user_${123456}@testuser.com`;
        console.log('✅ Payer Email:', payerEmail);

        const paymentClient = new Payment(client);

        // 3. Payload Simplificado
        const paymentData = {
            transaction_amount: Number(transactionAmount),
            token: token,
            description: description || "Coding2You Market",
            installments: Number(installments) || 1,
            payment_method_id: paymentMethodId || "master",
            payer: {
                email: payerEmail
            },
            binary_mode: true // Força aprovado ou rejeitado (sem pendente)
        };

        console.log('📦 Dados enviados ao MP:', JSON.stringify(paymentData, null, 2));

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

        // Tentar extrair mensagem útil
        let errorMessage = "Erro ao processar pagamento";
        let errorDetails = error.message;

        if (error.cause && error.cause.length > 0) {
            errorDetails = error.cause.map(e => e.description).join('; ');
        }

        return res.status(500).json({
            success: false,
            message: errorMessage,
            details: errorDetails,
            errorCode: error.status || 500,
            mpStatus: error.status
        });
    }
});

module.exports = router;
