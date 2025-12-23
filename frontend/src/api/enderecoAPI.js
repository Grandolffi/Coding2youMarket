import { getToken } from './auth';
const BASE_URL = "http://localhost:3000/api"; // ajustado

export const buscarCep = async (cep) => {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) return null;

    return {
      cep: data.cep,
      logradouro: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      uf: data.uf
    };
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    return null;
  }
};

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
        const response = await fetch(`${BASE_URL}/enderecos`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Erro ao carregar endereços');
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar endereços:", error);
        return [];
    }
};

// Buscar endereço por ID
export const buscarEnderecoPorId = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/enderecos/${id}`, {
            method: "GET",
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Endereço não encontrado');
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar endereço:", error);
        return null;
    }
};

// Meus endereços (usuário logado)
export const meusEnderecos = async () => { 
    try {
        
        const response = await fetch(`${BASE_URL}/enderecos/meus`, {
            method: "GET",
            headers: getAuthHeaders() 
        });

        if (!response.ok) {
            if (response.status === 404) return [];
            throw new Error('Erro ao carregar endereços');
        }

        const dados = await response.json();

        return dados.enderecos || []; 

    } catch (error) {
        console.error("Erro ao buscar meus endereços:", error);
        return [];
    }
};

// Criar endereço
export const criarEndereco = async (dadosEndereco) => {
    try {
        const response = await fetch(`${BASE_URL}/enderecos`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(dadosEndereco)
        });

        if (!response.ok) throw new Error(await response.text());
        return await response.json();

    } catch (error) {
        console.error("Erro ao criar endereço:", error);
        return { success: false, message: error.message };
    }
};

// Editar endereço
export const editarEndereco = async (id, dadosEndereco) => {
    try {
        const response = await fetch(`${BASE_URL}/enderecos/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(dadosEndereco)
        });

        const json = await response.json();

        if (!response.ok) return { success: false, message: json?.message || "Erro ao editar" };
        return { success: true, message: json?.message || "Endereço editado!" };

    } catch (error) {
        console.error("Erro ao editar endereço:", error);
        return { success: false, message: "Erro interno ao editar." };
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
        if (!response.ok) return { success: false, message: json.message };
        return json;

    } catch (error) {
        console.error("Erro ao deletar endereço:", error);
        return { success: false, message: "Erro interno ao deletar." };
    }
};
