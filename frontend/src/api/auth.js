const API_URL = 'http://localhost:3000';

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

    console.log('Login realizado com sucesso!');
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
    console.log('Cadastro realizado com sucesso!');
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
  console.log('Logout realizado!');
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
  return user ? JSON.parse(user) : null;
};

// Pegar o ID do usuário logado
export const getUsuarioId = () => {
  const usuario = getUsuarioLogado();
  return usuario ? usuario.id : null;
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

    console.log('✅ Solicitação enviada com sucesso:', data.message);
    return data;
  } catch (error) {
    console.error('❌ Erro ao solicitar código:', error.message);
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




