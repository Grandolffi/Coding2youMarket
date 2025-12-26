const API_URL = 'https://coding2youmarket-production.up.railway.app';

//const API_URL= "http://localhost:3000";

// LOGIN 
export const login = async (email, senha) => {
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao fazer login');
    }

    // Salvar token e usuário
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.usuario));

    return data.data;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};


//UPDATE SENHA
export const atualizarSenha = async (email, novaSenha) => {
  try {
    const response = await fetch(`${API_URL}/api/senha`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        senha: novaSenha
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Erro ao atualizar senha"
      };
    }

    return {
      success: true,
      message: "Senha atualizada com sucesso!"
    };

  } catch (error) {
    return {
      success: false,
      message: "Erro ao conectar com o servidor"
    };
  }
};

// CADASTRO 
export const cadastrar = async (nome, email, cpf, telefone, senha) => {
  try {
    const response = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, cpf, telefone, senha })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao cadastrar');
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    throw error;
  }
};

// LOGOUT 
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Verificar se está logado
export const isAutenticado = () => {
  return !!localStorage.getItem('token');
};

// Pegar token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Pegar usuário logado
export const getUsuarioLogado = () => {
  const user = localStorage.getItem('user');

  // Validação robusta
  if (!user || user === 'undefined' || user === 'null') {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    console.error('Erro ao fazer parse do usuário:', error);
    localStorage.removeItem('user');
    return null;
  }
};

// Pegar o ID do usuário logado
export const getUsuarioId = () => {
  const usuario = getUsuarioLogado();
  return usuario ? usuario.id : null;
};

// Pegar o ID do Club Market do usuário logado
export const getClubMarketId = () => {
  const usuario = getUsuarioLogado();
  return usuario ? usuario.club_marketid : null;
};


//MANDAR EMAIL 
export const solicitarCodigoVerificacao = async (email) => {
  try {
    const response = await fetch(`${API_URL}/api/verificar-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao processar solicitação');
    }

    if (data.success) {
      return { success: true, message: data.message };
    } else {
      throw new Error(data.message || 'Erro ao solicitar código de verificação');
    }
  } catch (error) {
    console.error('Erro ao solicitar código:', error.message);
    throw error;
  }
};


//VALIDAR CODIGO NO EMAIL
export const validarCodigoVerificacao = async (email, codigo) => {
  const response = await fetch(`${API_URL}/api/validar-codigo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, codigo })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};




