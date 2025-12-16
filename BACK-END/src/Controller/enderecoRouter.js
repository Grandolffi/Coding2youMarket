const express = require("express");
const router = express.Router();

const {insertEndereco, getEnderecos, getEnderecosPorUsuario, editEndereco, deleteEndereco} = require("../Model/DAO/enderecoDAO");


// READ - TODOS
router.get("/enderecos", async (req, res) => {
    try {
        const enderecos = await getEnderecos();
        return res.status(200).json(enderecos);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar endereços",
            error: error.message
        });
    }
});


// READ POR ID
router.get("/enderecos/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const enderecos = await getEnderecos();
        const endereco = enderecos.find(e => e.id === id);

        if (!endereco) {
            return res.status(404).json({
                success: false,
                message: "Endereço não encontrado"
            });
        }

        return res.status(200).json(endereco);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar endereço",
            error: error.message
        });
    }
});


// READ POR USUÁRIO
router.get("/enderecos/usuario/:usuarioId", async (req, res) => {
    try {
        const { usuarioId } = req.params;

        const enderecos = await getEnderecosPorUsuario(usuarioId);

        if (!enderecos || enderecos.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Nenhum endereço encontrado para este usuário"
            });
        }

        return res.status(200).json(enderecos);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar endereços do usuário",
            error: error.message
        });
    }
});


// CREATE
router.post("/enderecos", async (req, res) => {
    try {
        const {
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
        } = req.body;

        if (!usuarioId || !cep || !rua || !numero || !cidade || !estado) {
            return res.status(400).json({
                success: false,
                message: "Campos obrigatórios não informados"
            });
        }

        const result = await insertEndereco(
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
        );

        return res.status(201).json({
            success: true,
            message: "Endereço cadastrado com sucesso!",
            id_endereco: result
        });

    } catch (error) {
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

        const enderecos = await getEnderecos();
        const endereco = enderecos.find(e => e.id === id);

        if (!endereco) {
            return res.status(404).json({
                success: false,
                message: "Endereço não encontrado"
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
            message: "Endereço editado com sucesso!",
            id_endereco: id
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
        const result = await deleteEndereco(id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Endereço não encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Endereço excluído com sucesso!"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Endereço não pode ser excluído",
            error: error.message
        });
    }
});

module.exports = router;
