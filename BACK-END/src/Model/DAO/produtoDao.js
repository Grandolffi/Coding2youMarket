const pool = require('../../Config/Db/db');

class Produto {
  constructor(id_produto, nome, descricao, categoria, preco, unidade, imagem, ativo, estoque, estoqueMinimo) {
    this.id_produto = id_produto;
    this.nome = nome;
    this.descricao = descricao;
    this.categoria = categoria;
    this.preco = preco;
    this.unidade = unidade;
    this.imagem = imagem;
    this.estoque = estoque;
    this.estoqueMinimo = estoqueMinimo;
    this.ativo = ativo;
  }
}


//CREATE

async function insertProduto(nome, descricao, categoria, preco, unidade, imagem) {
  if (!nome || !categoria || preco == null || !unidade) {
    console.error("Falha ao inserir produto: campos obrigatórios ausentes.");
    return false;
  }

  const result = await pool.query(
    `
    INSERT INTO produtos (
      nome, descricao, categoria, preco, unidade, imagem, ativo
    )
    VALUES ($1, $2, $3, $4, $5, $6, true)
    RETURNING *
    `,
    [nome, descricao, categoria, preco, unidade, imagem]
  );

  return result.rows[0];
}

//READ TODOS

async function getProdutos() {
  const { rows } = await pool.query("SELECT * FROM produtos");
  return rows;
}

//READ POR CATEGORIA 

async function getProdutosByCategoria(categoria) {
  if (!categoria) {
    console.error("Categoria não informada.");
    return false;
  }

  const { rows } = await pool.query(
    "SELECT * FROM produtos WHERE categoria = $1",
    [categoria]
  );

  return rows; // retorna TODOS da categoria
}

//LISTA CATEGORIAS

async function getCategorias() {
  const { rows } = await pool.query(
    "SELECT DISTINCT categoria FROM produtos WHERE ativo = true ORDER BY categoria"
  );
  return rows.map(row => row.categoria);
}

// UPDATE

async function editProduto(id_produto, nome, descricao, categoria, preco, unidade, imagem, ativo) {
  if (!id_produto || !nome || !categoria || preco == null || !unidade) {
    console.error("Falha ao editar produto: campos obrigatórios ausentes.");
    return false;
  }

  const result = await pool.query(
    `
    UPDATE produtos
    SET nome = $1, descricao = $2, categoria = $3, preco = $4, unidade = $5, imagem = $6, ativo = $7
    WHERE id_produto = $8
    RETURNING *
    `,
    [nome, descricao, categoria, preco, unidade, imagem, ativo, id_produto]
  );

  if (result.rows.length === 0) return false;
  return result.rows[0];
}

//DELETE 

async function deleteProduto(id_produto) {
  if (!id_produto) {
    console.error("ID do produto não informado.");
    return false;
  }

  const result = await pool.query(
    `
    DELETE FROM produtos
    WHERE id_produto = $1
    RETURNING id_produto
    `,
    [id_produto]
  );

  return result.rows.length > 0;
}

//EXPORTS 

module.exports = {
  Produto, insertProduto, getProdutos, getProdutosByCategoria, editProduto, deleteProduto, getCategorias
};
