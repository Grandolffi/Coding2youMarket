import { getToken } from './auth';


const BASE_URL = "https://coding2youmarket-production.up.railway.app";


const getAuthHeaders = () => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

/**
 * Fetch the logged‑in user's cards.
 * Returns an object { success: boolean, cartoes: Array }.
 */
export const meusCartoes = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/cartoes/meus`, {
            headers: getAuthHeaders(),
        });
        const json = await response.json();
        if (!response.ok) {
            return { success: false, cartoes: [] };
        }
        // API may return { cartoes: [...] } or directly an array
        return { success: true, cartoes: json.cartoes ?? json };
    } catch (error) {
        console.error('Erro ao buscar cartões:', error);
        return { success: false, cartoes: [] };
    }
};


export const adicionarCartao = async (dadosCartao) => {
    try {
        // ✅ Usar o endpoint correto do Mercado Pago
        const response = await fetch(`${BASE_URL}/api/pagamentos/salvar-cartao`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(dadosCartao),
        });
        const json = await response.json();
        if (!response.ok) {
            return { success: false, message: json.message || 'Erro ao salvar cartão' };
        }
        return { success: true, ...json };
    } catch (error) {
        console.error('Erro ao adicionar cartão:', error);
        return { success: false, message: error.message || 'Erro interno ao adicionar cartão.' };
    }
};


export const editarCartao = async (id, nomeImpresso, principal) => {
    try {
        const response = await fetch(`${BASE_URL}/api/cartoes/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({ nomeImpresso, principal }),
        });
        const json = await response.json();
        if (!response.ok) {
            return { success: false, message: json.message };
        }
        return { success: true, ...json };
    } catch (error) {
        console.error('Erro ao editar cartão:', error);
        return { success: false, message: 'Erro interno ao editar cartão.' };
    }
};


export const deletarCartao = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/api/cartoes/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });
        const json = await response.json();
        if (!response.ok) {
            return { success: false, message: json.message };
        }
        return { success: true, ...json };
    } catch (error) {
        console.error('Erro ao deletar cartão:', error);
        return { success: false, message: 'Erro interno ao deletar cartão.' };
    }
};

export const buscarCartoes = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/cartoes`, {
            headers: getAuthHeaders(),
        });
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar cartões (legacy):', error);
        return { success: false, cartoes: [] };
    }
};
