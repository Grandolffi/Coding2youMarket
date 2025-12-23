const pool = require('../../Config/Db/db');

class Carrinho {
  constructor(id, usuarioId, produtoId, quantidade, observacao) {
    this.id = id;
    this.usuarioId = usuarioId; 9
    this.produtoId = produtoId; 26
    this.quantidade = quantidade; 3
    this.observacao = observacao;
  }
}

// CREATE
async function insertCarrinho(
  usuarioId,
  produtoId,
  quantidade,
  observacao
) {
  if (!usuarioId || !produtoId || quantidade == null) {
    console.error("Falha ao inserir no carrinho: usuarioId, produtoId e quantidade são obrigatórios.");
    return false;
  }

  const result = await pool.query(
    `
    INSERT INTO carrinho_itens (
      usuarioId,
      produtoId,
      quantidade,
      observacao
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [usuarioId, produtoId, quantidade, observacao]
  );

  return result.rows[0];
}

// READ 
async function getCarrinho() {
  const { rows } = await pool.query("SELECT * FROM carrinho_itens");
  return rows;
}

// READ POR PEDIDO
async function getCarrinhoPorUsuario(usuarioId) {
  if (!usuarioId) {
    console.error("usuarioId não informado.");
    return false;
  }

  const { rows } = await pool.query(
    `
    SELECT 
      ci.id,
      ci.quantidade,
      ci.observacao,
      p.id_produto as "produtoId",
      p.nome as "produtoNome",
      p.descricao as "produtoDescricao",
      p.preco as "produtoPreco",
      p.imagem as "produtoImagemUrl",
      p.estoque as "produtoEstoque",
      p.ativo as "produtoAtivo"
    FROM carrinho_itens ci
    INNER JOIN produtos p ON ci.produtoId = p.id_produto
    WHERE ci.usuarioId = $1
    `,
    [usuarioId]
  );

  // Formatar os dados para o frontend
  const carrinhoFormatado = rows.map(row => ({
    id: row.id,
    quantidade: row.quantidade,
    observacao: row.observacao,
    produto: {
      id: row.produtoId,
      nome: row.produtoNome,
      descricao: row.produtoDescricao,
      preco: parseFloat(row.produtoPreco),
      imagemUrl: row.produtoImagemUrl,
      estoque: row.produtoEstoque || 0,
      ativo: row.produtoAtivo
    }
  }));

  return carrinhoFormatado;
}

// UPDATE
async function editCarrinho(id, quantidade, observacao) {
  if (!id || quantidade == null) {
    console.error("Falha ao editar carrinho: id e quantidade são obrigatórios.");
    return false;
  }

  const result = await pool.query(
    `
    UPDATE carrinho_itens
    SET quantidade = $1,
        observacao = $2
    WHERE id = $3
    RETURNING *
    `,
    [quantidade, observacao, id]
  );

  if (result.rows.length === 0) return false;
  return result.rows[0];
}

// LIMPAR CARRINHO - Remove todos os itens do usuário
async function limparCarrinho(usuarioId) {
  if (!usuarioId) {
    console.error("usuarioId não informado.");
    return false;
  }
  const result = await pool.query(
    `
    DELETE FROM carrinho_itens
    WHERE usuarioId = $1
    RETURNING id
    `,
    [usuarioId]
  );
  return result.rows.length > 0;
}

// DELETE
async function deleteCarrinho(id) {
  if (!id) {
    console.error("ID do carrinho não informado.");
    return false;
  }

  const result = await pool.query(
    `
    DELETE FROM carrinho_itens
    WHERE id = $1
    RETURNING id
    `,
    [id]
  );

  return result.rows.length > 0;
}

// EXPORTS
module.exports = {
  Carrinho, insertCarrinho, getCarrinho, getCarrinhoPorUsuario, editCarrinho, deleteCarrinho, limparCarrinho
};
