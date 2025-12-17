const express = require("express");
const router = express.Router();

const {insertProduto, getProdutos, getProdutosByCategoria, editProduto, deleteProduto, getCategorias} = require("../Model/DAO/produtoDAO");


// READ - TODOS
router.get("/produtos", async (req, res) => {
    try {
        const produtos = await getProdutos();
        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar produtos",
            error: error.message
        });
    }
});


// READ POR CATEGORIA 
router.get("/produtos/categoria/:categoria", async (req, res) => {
    try {
        const { categoria } = req.params;

        const produtos = await getProdutosByCategoria(categoria);

        if (!produtos || produtos.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Nenhum produto encontrado para esta categoria"
            });
        }

        return res.status(200).json(produtos);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar produtos por categoria",
            error: error.message
        });
    }
});


// READ POR ID
router.get("/produtos/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const produtos = await getProdutos();
        const produto = produtos.find(p => p.id === id);

        if (!produto) {
            return res.status(404).json({
                success: false,
                message: "Produto não encontrado"
            });
        }

        return res.status(200).json(produto);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar produto",
            error: error.message
        });
    }
});

//GET CATEGORIAS
router.get("/categorias", async (req, res) => {
  try {
    const categorias = await getCategorias();

    if (!categorias || categorias.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nenhuma categoria encontrada"
      });
    }

    return res.status(200).json({
      success: true,
      categorias
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar categorias",
      error: error.message
    });
  }
});


// CREATE
router.post("/produtos", async (req, res) => {
    try {
        const { nome, descricao, categoria, preco, unidade, imagem } = req.body;

        if (!nome || !categoria || !preco) {
            return res.status(400).json({
                success: false,
                message: "Campos obrigatórios não informados"
            });
        }

        const result = await insertProduto(
            nome,
            descricao,
            categoria,
            preco,
            unidade,
            imagem
        );

        return res.status(201).json({
            success: true,
            message: "Produto cadastrado com sucesso!",
            id_produto: result
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro ao cadastrar produto",
            error: error.message
        });
    }
});


// UPDATE
router.put("/produtos/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { nome, descricao, categoria, preco, unidade, imagem, ativo } = req.body;

        const produtos = await getProdutos();
        const produto = produtos.find(p => p.id === id);

        if (!produto) {
            return res.status(404).json({
                success: false,
                message: "Produto não encontrado"
            });
        }

        await editProduto(
            id, nome, descricao, categoria, preco, unidade, imagem, ativo
        );

        return res.status(200).json({
            success: true,
            message: "Produto editado com sucesso!",
            id_produto: id
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erro interno ao editar produto",
            error: error.message
        });
    }
});


// DELETE
router.delete("/produtos/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const result = await deleteProduto(id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Produto não encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Produto excluído com sucesso!"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Produto não pode ser excluído",
            error: error.message
        });
    }
});

module.exports = router;
