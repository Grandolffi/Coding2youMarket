import { getToken } from './auth';

const BASE_URL = "https://coding2youmarket-production.up.railway.app/api";

const getAuthHeaders = () => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

// Listar MEUS endereços (do usuário logado)
export const meusEnderecos = async () => {
    try {
        const response = await fetch(`${BASE_URL}/enderecos/meus`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            return { success: false, enderecos: [] };
        }

        const json = await response.json();
        return { success: true, enderecos: json.enderecos || [] };
    } catch (error) {
        console.error("Erro ao buscar meus endereços:", error);
        return { success: false, enderecos: [] };
    }
};

// Criar novo endereço
export const criarEndereco = async (dados) => {
    try {
        const response = await fetch(`${BASE_URL}/enderecos`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(dados)
        });

        const json = await response.json();

        if (!response.ok) {
            return { success: false, message: json.message || "Erro ao cadastrar endereço" };
        }

        return { success: true, endereco: json.endereco, message: json.message };
    } catch (error) {
        console.error("Erro ao criar endereço:", error);
        return { success: false, message: "Erro interno ao criar endereço" };
    }
};

// Editar endereço
export const editarEndereco = async (id, dados) => {
    try {
        const response = await fetch(`${BASE_URL}/enderecos/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(dados)
        });

        const json = await response.json();

        if (!response.ok) {
            return { success: false, message: json.message || "Erro ao editar endereço" };
        }

        return { success: true, message: json.message };
    } catch (error) {
        console.error("Erro ao editar endereço:", error);
        return { success: false, message: "Erro interno ao editar endereço" };
    }
};

// Deletar endereço
export const deletarEndereco = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/enderecos/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        const json = await response.json();

        if (!response.ok) {
            return { success: false, message: json.message || "Erro ao deletar endereço" };
        }

        return { success: true, message: json.message };
    } catch (error) {
        console.error("Erro ao deletar endereço:", error);
        return { success: false, message: "Erro interno ao deletar endereço" };
    }
};

// Buscar CEP (via ViaCEP API)
export const buscarCep = async (cep) => {
    try {
        const cepLimpo = cep.replace(/\D/g, '');

        if (cepLimpo.length !== 8) {
            return { success: false, message: "CEP inválido" };
        }

        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const json = await response.json();

        if (json.erro) {
            return { success: false, message: "CEP não encontrado" };
        }

        return {
            success: true,
            endereco: {
                cep: json.cep,
                rua: json.logradouro,
                bairro: json.bairro,
                cidade: json.localidade,
                estado: json.uf
            }
        };
    } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        return { success: false, message: "Erro ao buscar CEP" };
    }
};
