const express = require("express");
const router = express.Router();
const geraToken = require("../Utils/geraToken");
const { salvarCodigo } = require("../Utils/codigoMemoria");
const { enviarEmailCodigo } = require("../Services/emailService");
const { getClienteByEmail, insertCliente, getClientes,getClienteByCpf} = require("../Model/DAO/clienteDao");
const validarCPF = require("../Utils/validarCPF");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const { nome, email, cpf, telefone, senha } = req.body;

    if (!nome || !email || !cpf || !telefone || !senha) {
      return res.status(400).json({
        success: false,
        message: "Campos obrigatórios não preenchidos."
      });
    }

    if (!validarCPF(cpf)) {
      return res.status(400).json({
        success: false,
        message: "CPF inválido."
      });
    }

    if (await getClienteByEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "E-mail já cadastrado!"
      });
    }

    if (await getClienteByCpf(cpf)) {
      return res.status(400).json({
        success: false,
        message: "CPF já cadastrado."
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    await insertCliente(nome, email, cpf, telefone, senhaHash);

    return res.status(201).json({
      success: true,
      message: "Cadastro realizado com sucesso!"
    });

  } catch (error) {
    console.error("ERRO NO REGISTER:", error);

    console.error("Erro ao cadastrar:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno ao cadastrar",
      error: error.message
    });
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const clientes = await getClientes();
    const usuario = clientes.find(c => c.email === email);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "E-mail não encontrado"
      });
    }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({
        success: false,
        message: "Senha incorreta"
      });
    }

    if (!usuario.ativo) {
      return res.status(403).json({
        success: false,
        message: "Conta desativada"
      });
    }

    const token = geraToken(usuario);
    const { senha: _, ...usuarioSemSenha } = usuario;

    return res.json({
      success: true,
      message: "Login realizado com sucesso!",
      data: {
        token,
        usuario: usuarioSemSenha
      }
    });

  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao fazer login"
    });
  }
});


//VERIFICA EMAIL PARA RECUPERAR SENHA
router.post("/verificar-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "O campo e-mail é obrigatório."
      });
    }

    const cliente = await getClienteByEmail(email);

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: "E-mail não cadastrado."
      });
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    salvarCodigo(email, codigo);
    await enviarEmailCodigo(email, codigo);

    return res.json({
      success: true,
      message: "Código de verificação enviado para o e-mail."
    });

  } catch (error) {
    console.error("Erro verificar-email:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao enviar código."
    });
  }
});

//VALIDA CODIGO
const { validarCodigo } = require("../Utils/codigoMemoria");

router.post("/validar-codigo", (req, res) => {
  const { email, codigo } = req.body;

  // validação básica
  if (!email || !codigo) {
    return res.status(400).json({
      success: false,
      message: "E-mail e código são obrigatórios."
    });
  }

  const valido = validarCodigo(email, codigo);

  if (!valido) {
    return res.status(400).json({
      success: false,
      message: "Código inválido ou expirado."
    });
  }

  return res.json({
    success: true,
    message: "Código validado com sucesso."
  });
});


module.exports = router;
