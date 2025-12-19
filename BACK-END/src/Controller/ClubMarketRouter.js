const express = require('express');
const router = express.Router();

const {insertClubMarket, getClubMarkets, getClubMarketPorUsuario, getClubMarketPorId, updateStatusClubMarket,
  deleteClubMarket} = require('../Model/DAO/clubMarketDao');
  
const auth = require('../Middleware/authJWTMid');

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
    const usuarioId = req.usuario.userId;

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
    const usuarioId = req.usuario.userId;
    const { valorMensal } = req.body;

    const clube = await insertClubMarket({
      usuarioId,
      valorMensal
    });

    if (!clube) {
      return res.status(400).json({
        success: false,
        message: 'Erro ao criar assinatura'
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Assinatura Club Market criada com sucesso',
      clube
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
    const usuarioId = req.usuario.userId;

    const clube = await getClubMarketPorUsuario(usuarioId);

    if (!clube) {
      return res.status(404).json({
        success: false,
        message: 'Assinatura não encontrada'
      });
    }

    const atualizado = await updateStatusClubMarket(clube.id, 'cancelada');

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
