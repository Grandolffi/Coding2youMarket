import { getToken } from './auth';

const BASE_URL = "https://coding2youmarket-production.up.railway.app/api";

// Headers com autenticação 
const getAuthHeaders = () => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ''
    };
};


// Listar todos os produtos
export const listarProdutos = async () => {
    try {
        const response = await fetch(`${BASE_URL}produtos`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Erro ao carregar produtos');
        const json = await response.json();
        return json;

    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        return null;
    }
};

// Buscar produto por ID

export const buscarProdutoPorId = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}produtos/${id}`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Produto não encontrado');
        const json = await response.json();
        return json;

    } catch (error) {
        console.error("Erro ao buscar produto:", error);
        return null;
    }
};

// Buscar produtos por categoria
export const buscarPorCategoria = async (categoria) => {
    try {
        const response = await fetch(`${BASE_URL}produtos/categoria/${categoria}`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Nenhum produto encontrado');
        const json = await response.json();
        return json;

    } catch (error) {
        console.error("Erro ao buscar produtos por categoria:", error);
        return [];
    }
};

// Rota para admin criar produto
export const criarProduto = async (produto) => {
    try {
        const response = await fetch(`${BASE_URL}produtos`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(produto)
        });

        if (!response.ok) throw new Error(await response.text());
        const json = await response.json();
        return json;

    } catch (error) {
        console.error("Erro ao criar produto:", error);
        return { success: false, message: error.message };
    }
};

// Rota para admin editar produto
export const editarProduto = async (id, dados) => {
    try {
        const response = await fetch(`${BASE_URL}produtos/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(dados)
        });

        const json = await response.json();

        if (!response.ok) {
            return { success: false, message: json?.message || "Erro ao editar" };
        }

        return { success: true, message: json?.message || "Produto editado!" };
    } catch (error) {
        console.error("Erro ao editar produto:", error);
        return { success: false, message: "Erro interno ao editar." };
    }
};

// Rota para admin deletar produto
export const deletarProduto = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}produtos/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        const json = await response.json();

        if (!response.ok) {
            return { success: false, message: json.message };
        }

        return json;
    } catch (error) {
        console.error("Erro ao deletar produto:", error);
        return { success: false, message: "Erro interno ao excluir." };
    }
};