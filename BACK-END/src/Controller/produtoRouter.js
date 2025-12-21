const express = require("express");
const router = express.Router();

const { insertProduto, getProdutos, getProdutosByCategoria, editProduto, deleteProduto, getCategorias
} = require("../Model/DAO/produtoDao");

const auth = require("../Middleware/authJWTMid");

// ROTAS PÚBLICAS
router.get("/produtos", async (req, res) => {
  try {
    const produtos = await getProdutos();
    return res.status(200).json(produtos);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar produtos" });
  }
});

router.get("/produtos/categoria/:categoria", async (req, res) => {
  const produtos = await getProdutosByCategoria(req.params.categoria);
  return res.json(produtos);
});

router.get("/produtos/:id", async (req, res) => {
  const produtos = await getProdutos();
  const produto = produtos.find(p => p.id === Number(req.params.id));

  if (!produto) {
    return res.status(404).json({ message: "Produto não encontrado" });
  }

  res.json(produto);
});

router.get("/categorias", async (req, res) => {
  const categorias = await getCategorias();
  res.json(categorias);
});

// ROTAS PROTEGIDAS
router.post("/produtos", auth, async (req, res) => {
  const { nome, categoria, preco } = req.body;

  if (!nome || !categoria || preco == null) {
    return res.status(400).json({ message: "Campos obrigatórios" });
  }

  const id = await insertProduto(
    nome,
    req.body.descricao,
    categoria,
    preco,
    req.body.unidade,
    req.body.imagem
  );

  res.status(201).json({ message: "Produto criado", id });
});

router.put("/produtos/:id", auth, async (req, res) => {
  await editProduto(
    req.params.id,
    req.body.nome,
    req.body.descricao,
    req.body.categoria,
    req.body.preco,
    req.body.unidade,
    req.body.imagem,
    req.body.ativo
  );

  res.json({ message: "Produto atualizado" });
});

router.delete("/produtos/:id", auth, async (req, res) => {
  await deleteProduto(req.params.id);
  res.json({ message: "Produto deletado" });
});

module.exports = router;
