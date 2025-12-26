const BASE_URL = "https://coding2youmarket-production.up.railway.app";

export const buscarClientePorId = async (clienteId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/api/clientes/${clienteId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao buscar cliente");
    }

    return data.usuario;

  } catch (error) {
    console.error("Erro ao buscar cliente:", error.message);
    return null;
  }
};

export const buscarClienteDados = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/api/clientes/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao buscar dados do cliente");
    }

    return data.cliente;

  } catch (error) {
    console.error("Erro ao buscar dados do cliente:", error.message);
    return null;
  }
};

// Editar dados do cliente logado
export const editarCliente = async (dados) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/api/clientes/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(dados)
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || "Erro ao atualizar cliente" };
    }

    return { success: true, message: data.message };

  } catch (error) {
    console.error("Erro ao editar cliente:", error.message);
    return { success: false, message: "Erro ao conectar com o servidor" };
  }
};
