const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { insertCliente, getClientes } = require('../Model/DAO/clienteDAO');

// Cliente se registra sozinho
router.post("/auth/register", async (req, res) => {
    try {
        const { nome, email, cpf, telefone, senha } = req.body;

        // Verifica se email já existe
        const clientes = await getClientes();
        const emailExiste = clientes.find(c => c.email === email);

        if (emailExiste) {
            return res.status(400).json({
                success: false,
                message: "E-mail já cadastrado!"
            });
        }
        // Cadastra SEM clubMember (será false por padrão no DAO)
        const result = await insertCliente(nome, email, cpf, telefone, senha);
        if (result) {
            return res.status(201).json({
                success: true,
                message: "Cadastro realizado com sucesso! Faça login."
            });
        }
        return res.status(500).json({
            success: false,
            message: "Erro ao cadastrar"
        });
    } catch (error) {
        console.error("Erro ao cadastrar:", error);
        return res.status(500).json({
            success: false,
            message: "Erro ao cadastrar cliente",
            error: error.message
        });
    }
});

// LOGIN 
router.post("/auth/login", async (req, res) => {
    try {
        const { email, senha } = req.body;
        // Busca usuário no banco
        const clientes = await getClientes();
        const usuario = clientes.find(c => c.email === email);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: "E-mail não encontrado"
            });
        }
        // Verifica senha (sem hash no MVP)
        if (usuario.senha !== senha) {
            return res.status(401).json({
                success: false,
                message: "Senha incorreta"
            });
        }
        // Verifica se conta está ativa
        if (!usuario.ativo) {
            return res.status(403).json({
                success: false,
                message: "Conta desativada"
            });
        }
        // Gera token JWT
        const token = jwt.sign(
            {
                userId: usuario.id,
                email: usuario.email,
                clubMember: usuario.clubmember
            },
            process.env.JWT_SECRET || 'chave-secreta-subscrivery',
            { expiresIn: '24h' }
        );
        // Remove senha da resposta
        const { senha: _, ...usuarioSemSenha } = usuario;
        return res.status(200).json({
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
            message: "Erro ao fazer login",
            error: error.message
        });
    }
});

module.exports = router;