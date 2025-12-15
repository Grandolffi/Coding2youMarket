const express = require("express");
const router = express.Router();
const { auth } = require('./login');

const { insertCliente, getClientes, editCliente, deleteCliente } = require("../Model/DAO/clienteDAO");

// READ 
router.get("/clientes", async (req, res) => {
    // if(!auth){
    //    console.error("não temos auth");
    // }
    try {
        const clientes = await getClientes(); // SELECT * FROM usuarios
        console.log("clientes: ", clientes);
        res.json(clientes);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar clientes",
            error: error.message
        });
    }
});

// CREATE 
router.post("/clientes", async (req, res) => {
    try {
        const { nome, email, cpf, telefone, senha, clubMember } = req.body;
        console.log(`nome: ${nome}, email: ${email}, cpf: ${cpf}, telefone: ${telefone}, clubMember: ${clubMember}`);

        // dataCadastro e ativo serão definidos automaticamente no DAO
        const result = await insertCliente(nome, email, cpf, telefone, senha, clubMember);

        if (result) {
            return res.status(201).json({
                success: true,
                message: "Cliente cadastrado com sucesso!"
            });
        }
        return res.status(404).json({ success: false });
    } catch (error) {
        console.error("Erro ao cadastrar cliente:", error);
        return res.status(500).json({
            success: false,
            message: "Erro ao cadastrar cliente",
            error: error.message
        });
    }
});

// UPDATE 
router.put("/editarclientes/:idcliente", async (req, res) => {
    try {
        const { nome, email, cpf, telefone, senha, clubMember, ativo } = req.body;
        const id = parseInt(req.params.idcliente);
        const clientes = await getClientes();
        const cliente = clientes.find(c => c.id === id);

        if (!cliente) {
            return res.status(404).send("Cliente não encontrado");
        }

        // dataCadastroClub será atualizado no DAO se clubMember mudar de false para true
        const result = await editCliente(id, nome, email, cpf, telefone, senha, clubMember, ativo);
        console.log("Editando cliente: ", id, nome, email, cpf, telefone, clubMember, ativo);

        if (result) {
            return res.status(200).json({
                success: true,
                message: "Cliente editado com sucesso!",
                id_cliente: id
            });
        }
        return res.status(500).json({
            success: false,
            message: "Erro ao atualizar cliente"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro interno ao editar cliente",
            error: error.message
        });
    }
});

// DELETE 
router.delete("/clientes/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await deleteCliente(id);

        if (result) {
            return res.status(200).json({
                success: true,
                message: "Cliente excluído com sucesso!"
            });
        }
        return res.status(404).json({
            success: false,
            message: "Cliente não encontrado."
        });

    } catch (error) {
        console.error("Erro ao excluir cliente:", error);
        return res.status(400).json({
            success: false,
            message: "Este cliente possui pedidos vinculados e não pode ser excluído.",
            error: error.message
        });
    }
});

// Buscar cliente por ID
router.get('/clientes/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const clientes = await getClientes();
        const cliente = clientes.find(c => c.id === id);

        if (!cliente) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }

        res.json(cliente);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar cliente",
            error: error.message
        });
    }
});

module.exports = router;