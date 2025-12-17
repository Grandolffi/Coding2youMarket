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

//Listar todos os pedidos (Admin)
export const listarPedidos = async () => {
    try {
        const response = await fetch(`${BASE_URL}pedidos`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Erro ao carregar pedidos');
        const json = await response.json();
        return json.pedidos;

    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        return [];
    }
};

//Buscar pedido por ID
export const buscarPedidoPorId = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}pedidos/${id}`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Pedido não encontrado');
        const json = await response.json();
        return json.pedido;

    } catch (error) {
        console.error("Erro ao buscar pedido:", error);
        return null;
    }
};

//Meus pedidos (do usuário logado)
export const meusPedidos = async (usuarioId) => {
    try {
        const response = await fetch(`${BASE_URL}pedidos/usuario/${usuarioId}`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            if (response.status === 404) return []; // Sem pedidos
            throw new Error('Erro ao carregar pedidos');
        }

        const json = await response.json();
        return json.pedidos;

    } catch (error) {
        console.error("Erro ao buscar meus pedidos:", error);
        return [];
    }
};

//Pedidos ativos
export const pedidosAtivos = async () => {
    try {
        const response = await fetch(`${BASE_URL}pedidos/ativos`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Erro ao carregar pedidos ativos');
        const json = await response.json();
        return json.pedidos;

    } catch (error) {
        console.error("Erro ao buscar pedidos ativos:", error);
        return [];
    }
};

//Criar novo pedido
export const criarPedido = async (dadosPedido) => {
    try {
        const response = await fetch(`${BASE_URL}pedidos`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(dadosPedido)
        });

        if (!response.ok) throw new Error(await response.text());
        const json = await response.json();
        return json;

    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        return { success: false, message: error.message };
    }
};

//Atualizar status do pedido
export const atualizarStatus = async (id, status) => {
    try {
        const response = await fetch(`${BASE_URL}pedidos/${id}/status`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({ status })
        });

        const json = await response.json();

        if (!response.ok) {
            return { success: false, message: json?.message || "Erro ao atualizar status" };
        }

        return { success: true, message: json?.message, pedido: json.pedido };
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        return { success: false, message: "Erro interno ao atualizar." };
    }
};

//Atualizar datas do pedido
export const atualizarDatas = async (id, dataProximaEntrega, dataProximaCobranca) => {
    try {
        const response = await fetch(`${BASE_URL}pedidos/${id}/datas`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({ dataProximaEntrega, dataProximaCobranca })
        });

        const json = await response.json();

        if (!response.ok) {
            return { success: false, message: json?.message || "Erro ao atualizar datas" };
        }

        return { success: true, message: json?.message, pedido: json.pedido };

    } catch (error) {
        console.error("Erro ao atualizar datas:", error);
        return { success: false, message: "Erro interno ao atualizar." };
    }
};

// Cancelar pedido (soft delete)
export const cancelarPedido = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}pedidos/${id}/cancelar`, {
            method: "PATCH",
            headers: getAuthHeaders()
        });

        const json = await response.json();

        if (!response.ok) {
            return { success: false, message: json.message };
        }

        return json;
    } catch (error) {
        console.error("Erro ao cancelar pedido:", error);
        return { success: false, message: "Erro interno ao cancelar." };
    }
};

//Deletar pedido permanentemente (Admin)
export const deletarPedido = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}pedidos/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        const json = await response.json();

        if (!response.ok) {
            return { success: false, message: json.message };
        }
        return json;
    } catch (error) {
        console.error("Erro ao deletar pedido:", error);
        return { success: false, message: "Erro interno ao deletar." };
    }
};

// Funções de atalho para status específicos
export const pausarPedido = (id) => atualizarStatus(id, 'pausada');
export const reativarPedido = (id) => atualizarStatus(id, 'ativa');