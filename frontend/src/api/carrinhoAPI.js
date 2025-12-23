import { getToken } from './auth';
const BASE_URL = "https://coding2youmarket-production.up.railway.app/api/";

// Autenticação
const getAuthHeaders = () => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

//Ver carrinho do usuário logado
export const verMeuCarrinho = async () => {
    try {
        const response = await fetch(`${BASE_URL}carrinho`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Erro ao carregar carrinho');
        const json = await response.json();
        return json;
    } catch (error) {
        console.error("Erro ao buscar carrinho:", error);
        return [];
    }
};

//Adicionar produto ao carrinho
export const adicionarItem = async (produtoId, quantidade, observacao = '') => {
    try {
        const response = await fetch(`${BASE_URL}carrinho`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ produtoId, quantidade, observacao })
        });
        if (!response.ok) throw new Error(await response.text());
        const json = await response.json();
        return json;
    } catch (error) {
        console.error("Erro ao adicionar ao carrinho:", error);
        return { success: false, message: error.message };
    }
};

//Atualizar quantidade de um item
export const atualizarQuantidade = async (itemId, quantidade, observacao = '') => {
    try {
        const response = await fetch(`${BASE_URL}carrinho/${itemId}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({ quantidade, observacao })
        });
        const json = await response.json();
        if (!response.ok) {
            return { success: false, message: json?.message || "Erro ao atualizar" };
        }
        return { success: true, message: json?.message || "Quantidade atualizada!" };
    } catch (error) {
        console.error("Erro ao atualizar carrinho:", error);
        return { success: false, message: "Erro interno ao atualizar." };
    }
};

//Remover um item do carrinho
export const removerItem = async (itemId) => {
    try {
        const response = await fetch(`${BASE_URL}carrinho/${itemId}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        const json = await response.json();
        if (!response.ok) {
            return { success: false, message: json.message };
        }
        return json;
    } catch (error) {
        console.error("Erro ao remover item:", error);
        return { success: false, message: "Erro interno ao remover." };
    }
};

//Limpar todo o carrinho
export const limparCarrinho = async () => {
    try {
        const response = await fetch(`${BASE_URL}carrinho/limpar`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        const json = await response.json();
        if (!response.ok) {
            return { success: false, message: json.message };
        }
        return json;
    } catch (error) {
        console.error("Erro ao limpar carrinho:", error);
        return { success: false, message: "Erro interno ao limpar." };
    }
};