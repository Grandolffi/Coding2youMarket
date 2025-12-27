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

        console.log('💳 Processando pagamento direto...');
        console.log('✅ Token:', token);
        console.log('✅ Valor:', transactionAmount);
        console.log('✅ Payment Method:', paymentMethodId);
        console.log('✅ Email:', req.usuario.email);

        const paymentClient = new Payment(client);

        const paymentData = {
            transaction_amount: Number(transactionAmount),
            token: token,
            description: description || "Pedido Subscrivery",
            installments: Number(installments) || 1,
            payment_method_id: paymentMethodId || "master",
            payer: {
                email: req.usuario.email || req.usuario.Email || `user${usuarioId}@test.com`
            }
        };

        console.log('📦 Dados do pagamento:', JSON.stringify(paymentData, null, 2));

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
            message: payment.status === 'approved' ? 'Pagamento aprovado!' : 'Pagamento em processamento'
        });

    } catch (error) {
        console.error("❌ Erro ao processar pagamento:");
        console.error("Error completo:", JSON.stringify(error, null, 2));
        console.error("Message:", error.message);
        console.error("Status:", error.status);
        console.error("Cause:", error.cause);

        return res.status(500).json({
            success: false,
            message: "Erro ao processar pagamento",
            details: error.cause?.[0]?.description || error.message,
            errorCode: error.cause?.[0]?.code,
            status: error.status
        });
    }
});

module.exports = router;
