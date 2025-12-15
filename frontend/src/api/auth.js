const API_URL = 'http://localhost:3000';

// LOGIN 
export const login = async (email, senha) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao fazer login');
        }

        const data = await response.json();

        // Salvar token no localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.usuario));

        console.log('Login realizado com sucesso!');
        return data.data;
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        throw error;
    }
};

// CADASTRO 
export const cadastrar = async (nome, email, cpf, telefone, senha) => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
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

// Pegar usuário logado
export const getUsuarioLogado = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Pegar token
export const getToken = () => {
    return localStorage.getItem('token');
};
