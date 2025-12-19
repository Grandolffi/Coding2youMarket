const express = require('express');
const router = express.Router();

const { insertClienteEndereco, getClientesEnderecos, getEnderecosPorUsuario, getClienteEnderecoPorId,
  setEnderecoPrincipal, desvincularEndereco, deleteClienteEndereco} = require('../Model/DAO/clienteEnderecoDao');

const auth = require('../Middleware/authJWTMid');

// READ TODOS
router.get('/cliente-enderecos', auth, async (req, res) => {
  try {
    const vinculos = await getClientesEnderecos();

    return res.status(200).json({
      success: true,
      vinculos
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar vínculos de endereço',
      error: error.message
    });
  }
});


// READ POR USER
router.get('/cliente-enderecos/meus', auth, async (req, res) => {
  try {
    const usuarioId = req.usuario.userId;

    const enderecos = await getEnderecosPorUsuario(usuarioId);

    return res.status(200).json({
      success: true,
      enderecos: enderecos || []
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar endereços do usuário',
      error: error.message
    });
  }
});


// READ POR ID 
router.get('/cliente-enderecos/:id', auth, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    const vinculo = await getClienteEnderecoPorId(id);

    if (!vinculo || vinculo.usuarioid !== req.usuario.userId) {
      return res.status(404).json({
        success: false,
        message: 'Endereço não encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      vinculo
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar vínculo',
      error: error.message
    });
  }
});


// CREATE
router.post('/cliente-enderecos', auth, async (req, res) => {
  try {
    const { enderecoId, principal } = req.body;
    const usuarioId = req.usuario.userId;

    if (!enderecoId) {
      return res.status(400).json({
        success: false,
        message: 'enderecoId é obrigatório'
      });
    }

    const vinculo = await insertClienteEndereco({
      usuarioId,
      enderecoId,
      principal
    });

    return res.status(201).json({
      success: true,
      message: 'Endereço vinculado com sucesso',
      vinculo
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao vincular endereço',
      error: error.message
    });
  }
});


// DEFINIR ENDEREÇO PRINCIPAL

router.put('/cliente-enderecos/:id/principal', auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const usuarioId = req.usuario.userId;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    const atualizado = await setEnderecoPrincipal(id, usuarioId);

    if (!atualizado) {
      return res.status(404).json({
        success: false,
        message: 'Endereço não encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Endereço definido como principal',
      endereco: atualizado
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao definir endereço principal',
      error: error.message
    });
  }
});


// SOFT DELETE
router.patch('/cliente-enderecos/:id/desvincular', auth, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    const desvinculado = await desvincularEndereco(id);

    if (!desvinculado) {
      return res.status(404).json({
        success: false,
        message: 'Endereço não encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Endereço desvinculado com sucesso'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao desvincular endereço',
      error: error.message
    });
  }
});


// HARD DELETE
router.delete('/cliente-enderecos/:id', auth, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    const deletado = await deleteClienteEndereco(id);

    if (!deletado) {
      return res.status(404).json({
        success: false,
        message: 'Vínculo não encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Vínculo removido definitivamente'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao remover vínculo',
      error: error.message
    });
  }
});

module.exports = router;
