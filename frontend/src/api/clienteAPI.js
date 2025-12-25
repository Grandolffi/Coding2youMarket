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
