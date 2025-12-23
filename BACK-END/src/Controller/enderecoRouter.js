const express = require("express");
const router = express.Router();

const { insertEndereco, getEnderecos, getEnderecosPorUsuario, editEndereco, deleteEndereco }
  = require("../Model/DAO/enderecoDao");

const auth = require("../Middleware/authJWTMid");

router.use(auth);


// READ TODOS
router.get("/enderecos", async (req, res) => {
  try {
   
    const enderecos = await getEnderecos();
    return res.status(200).json({
      success: true,
      enderecos
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar endereços",
      error: error.message
    });
  }
});


// READ MEUS 
router.get("/enderecos/meus", async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const enderecos = await getEnderecosPorUsuario(usuarioId);

    return res.status(200).json({
      success: true,
      enderecos: enderecos || []
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar endereços do usuário",
      error: error.message
    });
  }
});


// READ POR ID
router.get("/enderecos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const enderecos = await getEnderecosPorUsuario(req.usuario.id);
    const endereco = enderecos.find(e => e.id === id);

    if (!endereco) {
      return res.status(404).json({
        success: false,
        message: "Endereço não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      endereco
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar endereço",
      error: error.message
    });
  }
});


// CREATE
router.post("/enderecos", async (req, res) => {
  try {
    const usuarioId = req.usuario.id; 

    
    const { 
      cep, 
      rua, 
      numero, 
      complemento, 
      bairro, 
      cidade, 
      estado, 
      apelido, 
      principal 
    } = req.body;

    
    const novoEndereco = await insertEndereco({
      usuarioId,
      cep,
      rua,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      apelido,
      principal
    });

    return res.status(201).json({
      success: true,
      message: "Endereço cadastrado com sucesso",
      endereco: novoEndereco
    });

  } catch (error) {
    console.error("Erro na Router ao chamar DAO:", error.message);
    return res.status(500).json({
      success: false,
      message: "Erro ao cadastrar endereço",
      error: error.message
    });
  }
});

// UPDATE
router.put("/enderecos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      cep,
      rua,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      apelido,
      principal
    } = req.body;

    const enderecos = await getEnderecosPorUsuario(req.usuario.id);
    const endereco = enderecos.find(e => e.id === id);

    if (!endereco) {
      return res.status(404).json({
        success: false,
        message: "Endereço não encontrado ou acesso negado"
      });
    }

    await editEndereco(
      id,
      cep,
      rua,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      apelido,
      principal
    );

    return res.status(200).json({
      success: true,
      message: "Endereço atualizado com sucesso"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao editar endereço",
      error: error.message
    });
  }
});


// DELETE
router.delete("/enderecos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const enderecos = await getEnderecosPorUsuario(req.usuario.id);
    const endereco = enderecos.find(e => e.id === id);

    if (!endereco) {
      return res.status(404).json({
        success: false,
        message: "Endereço não encontrado ou acesso negado"
      });
    }

    await deleteEndereco(id);

    return res.status(200).json({
      success: true,
      message: "Endereço removido com sucesso"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao excluir endereço",
      error: error.message
    });
  }
});

module.exports = router;
