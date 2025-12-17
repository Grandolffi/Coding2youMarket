import { getToken } from './auth';
const BASE_URL = "http://localhost:3000/";

// Headers com autenticação
const getAuthHeaders = () => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

// Listar todos os endereços (Admin)
export const listarEnderecos = async () => {
    try {
        const response = await fetch(`${BASE_URL}enderecos`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Erro ao carregar endereços');
        const json = await response.json();
        return json;

    } catch (error) {
        console.error("Erro ao buscar endereços:", error);
        return [];
    }
};

//Buscar endereço por ID
export const buscarEnderecoPorId = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}enderecos/${id}`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Endereço não encontrado');
        const json = await response.json();
        return json;

    } catch (error) {
        console.error("Erro ao buscar endereço:", error);
        return null;
    }
};

//Meus endereços (do usuário logado)
export const meusEnderecos = async (usuarioId) => {
    try {
        const response = await fetch(`${BASE_URL}enderecos/usuario/${usuarioId}`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            if (response.status === 404) return []; // Sem endereços
            throw new Error('Erro ao carregar endereços');
        }

        const json = await response.json();

        return json;
    } catch (error) {
        console.error("Erro ao buscar meus endereços:", error);
        return [];
    }
};

// POST - Criar novo endereço
export const criarEndereco = async (dadosEndereco) => {
    try {
        const response = await fetch(`${BASE_URL}enderecos`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(dadosEndereco)
        });

        if (!response.ok) throw new Error(await response.text());
        const json = await response.json();
        return json;

    } catch (error) {
        console.error("Erro ao criar endereço:", error);
        return { success: false, message: error.message };
    }
};

// PUT - Editar endereço
export const editarEndereco = async (id, dadosEndereco) => {
    try {
        const response = await fetch(`${BASE_URL}enderecos/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(dadosEndereco)
        });

        const json = await response.json();

        if (!response.ok) {
            return { success: false, message: json?.message || "Erro ao editar" };
        }

        return { success: true, message: json?.message || "Endereço editado!" };
    } catch (error) {
        console.error("Erro ao editar endereço:", error);
        return { success: false, message: "Erro interno ao editar." };
    }
};

// DELETE - Deletar endereço
export const deletarEndereco = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}enderecos/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        const json = await response.json();
        if (!response.ok) {
            return { success: false, message: json.message };
        }

        return json;
    } catch (error) {
        console.error("Erro ao deletar endereço:", error);
        return { success: false, message: "Erro interno ao deletar." };
    }
};