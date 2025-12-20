const express = require('express');
const router = express.Router();

const { insertClubMarket, getClubMarkets, getClubMarketPorUsuario, getClubMarketPorId, updateStatusClubMarket,
  deleteClubMarket } = require('../Model/DAO/clubMarketDao');

const { updateClubMember } = require('../Model/DAO/clienteDAO');
const auth = require('../Middleware/authJWTMid');

const { MercadoPagoConfig, PreApproval } = require('mercadopago');
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

router.use(auth);

// READ TODOS 
router.get('/club-market', async (req, res) => {
  try {
    const clubes = await getClubMarkets();

    return res.status(200).json({
      success: true,
      clubes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar Club Market',
      error: error.message
    });
  }
});


// READ DO USUÁRIO LOGADO
router.get('/club-market/meu', async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const clube = await getClubMarketPorUsuario(usuarioId);

    if (!clube) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não possui assinatura Club Market'
      });
    }

    return res.status(200).json({
      success: true,
      clube
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar assinatura do usuário',
      error: error.message
    });
  }
});


// READ POR ID 
router.get('/club-market/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    const clube = await getClubMarketPorId(id);

    if (!clube) {
      return res.status(404).json({
        success: false,
        message: 'Assinatura não encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      clube
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar assinatura',
      error: error.message
    });
  }
});


// CREATE 
router.post('/club-market', async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const email = req.usuario.email;

    const clubeExistente = await getClubMarketPorUsuario(usuarioId);

    if (clubeExistente) {
      // Se já é ativo, retornar erro
      if (clubeExistente.status === 'ativa') {
        return res.status(400).json({
          success: false,
          message: 'Você já é membro do Club Market'
        });
      }

      if (clubeExistente.status === 'cancelada') {
        // Reativar status
        const clubeReativado = await updateStatusClubMarket(clubeExistente.id, 'ativa');

        // Atualizar clubMember
        await updateClubMember(usuarioId, true);

        // Criar nova assinatura no Mercado Pago
        const preApprovalClient = new PreApproval(client);
        const preapproval = await preApprovalClient.create({
          body: {
            reason: "Club Market - Benefícios exclusivos",
            auto_recurring: {
              frequency: 1,
              frequency_type: "months",
              transaction_amount: 29.90,
              currency_id: "BRL"
            },
            payer_email: email,
            back_url: "https://seusite.com/club/confirmado",
            status: "pending"
          }
        });

        return res.status(200).json({
          success: true,
          message: 'Assinatura Club Market reativada! Aprove o pagamento.',
          clube: clubeReativado,
          mercadoPago: {
            initPoint: preapproval.init_point
          }
        });
      }
    }

    // Se NÃO existe, criar nova
    const preApprovalClient = new PreApproval(client);
    const preapproval = await preApprovalClient.create({
      body: {
        reason: "Club Market - Benefícios exclusivos",
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: 29.90,
          currency_id: "BRL"
        },
        payer_email: email,
        back_url: "https://seusite.com/club/confirmado",
        status: "pending"
      }
    });

    const clube = await insertClubMarket({
      usuarioId,
      valorMensal: 29.90
    });

    await updateClubMember(usuarioId, true);

    return res.status(201).json({
      success: true,
      message: 'Assinatura Club Market criada! Aprove o pagamento.',
      clube,
      mercadoPago: {
        initPoint: preapproval.init_point // Link para aprovar
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar assinatura',
      error: error.message
    });
  }
});


// UPDATE STATUS 
router.put('/club-market/:id/status', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const statusPermitidos = ['ativa', 'cancelada', 'suspensa'];

    if (!id || !statusPermitidos.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'ID ou status inválido'
      });
    }

    const clubeAtualizado = await updateStatusClubMarket(id, status);

    if (!clubeAtualizado) {
      return res.status(404).json({
        success: false,
        message: 'Assinatura não encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Status atualizado com sucesso',
      clube: clubeAtualizado
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar status',
      error: error.message
    });
  }
});


// DELETE 
router.delete('/club-market/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    const deletado = await deleteClubMarket(id);

    if (!deletado) {
      return res.status(404).json({
        success: false,
        message: 'Assinatura não encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Assinatura removida com sucesso'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao remover assinatura',
      error: error.message
    });
  }
});


// ATALHO PARA CANCELAR 
router.patch('/club-market/cancelar', async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const clube = await getClubMarketPorUsuario(usuarioId);

    if (!clube) {
      return res.status(404).json({
        success: false,
        message: 'Assinatura não encontrada'
      });
    }

    const atualizado = await updateStatusClubMarket(clube.id, 'cancelada');

    await updateClubMember(usuarioId, false);

    return res.status(200).json({
      success: true,
      message: 'Assinatura cancelada com sucesso',
      clube: atualizado
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao cancelar assinatura',
      error: error.message
    });
  }
});

module.exports = router;
