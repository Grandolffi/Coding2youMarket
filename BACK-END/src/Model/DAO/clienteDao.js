const pool = require('../../Config/Db/db');

class Cliente {
    constructor(id, nome, email, cpf, telefone, senha, clubMember, dataCadastroClub, dataCadastro, ativo) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.cpf = cpf;
        this.telefone = telefone;
        this.senha = senha;
        this.clubMember = clubMember;
        this.dataCadastroClub = dataCadastroClub;
        this.dataCadastro = dataCadastro;
        this.ativo = ativo;
    }
}

//read
async function getClientes() {
    const { rows } = await pool.query("SELECT * FROM usuarios ORDER BY id"); //função assincrona, esperando o select no bd
    const clientes = rows;

    return clientes;
}

//create
async function insertCliente(nome, email, cpf, telefone, senha, clubMember) {
    if (nome && email && cpf && telefone && senha) {
        // clubMember padrão é false se não fornecido
        const isClubMember = clubMember || false;
        const dataCadastroClub = isClubMember ? new Date() : null;

        const result = await pool.query(`
            INSERT INTO usuarios(nome, email, cpf, telefone, senha, clubMember, dataCadastroClub, dataCadastro, ativo)
            VALUES($1, $2, $3, $4, $5, $6, $7, NOW(), true)
            RETURNING id, nome, email, cpf, telefone, senha, clubMember, dataCadastroClub, dataCadastro, ativo`,
            [nome, email, cpf, telefone, senha, isClubMember, dataCadastroClub]
        );

        console.log("Resultado do insert: ", result.rows[0]);

        if (result.rows.length > 0) {
            return true;
        }
        return false;
    }

    console.error("Falha ao inserir Cliente, faltou algum dado");
    return false;
}

//update
async function editCliente(id, nome, email, cpf, telefone, senha, clubMember, ativo) {
    console.log("Dados: ", id, nome, email, cpf, telefone, clubMember, ativo);
    if (id && nome && email && cpf && telefone) {
        // Primeiro, busca o cliente atual para verificar o clubMember
        const clienteAtual = await pool.query('SELECT clubMember FROM usuarios WHERE id = $1', [id]);

        let dataCadastroClub = null;

        // Se estava false e agora é true, atualiza a data
        if (clienteAtual.rows.length > 0 && !clienteAtual.rows[0].clubmember && clubMember) {
            dataCadastroClub = new Date();
        }

        let query, params;

        // Se forneceu senha, atualiza ela também
        if (senha) {
            if (dataCadastroClub) {
                query = `
                    UPDATE usuarios
                    SET nome = $1, email = $2, cpf = $3, telefone = $4, senha = $5, clubMember = $6, dataCadastroClub = $7, ativo = $8
                    WHERE id = $9
                    RETURNING id, nome, email, cpf, telefone, senha, clubMember, dataCadastroClub, dataCadastro, ativo`;
                params = [nome, email, cpf, telefone, senha, clubMember, dataCadastroClub, ativo, id];
            } else {
                query = `
                    UPDATE usuarios
                    SET nome = $1, email = $2, cpf = $3, telefone = $4, senha = $5, clubMember = $6, ativo = $7
                    WHERE id = $8
                    RETURNING id, nome, email, cpf, telefone, senha, clubMember, dataCadastroClub, dataCadastro, ativo`;
                params = [nome, email, cpf, telefone, senha, clubMember, ativo, id];
            }
        } else {
            // Não atualiza a senha
            if (dataCadastroClub) {
                query = `
                    UPDATE usuarios
                    SET nome = $1, email = $2, cpf = $3, telefone = $4, clubMember = $5, dataCadastroClub = $6, ativo = $7
                    WHERE id = $8
                    RETURNING id, nome, email, cpf, telefone, senha, clubMember, dataCadastroClub, dataCadastro, ativo`;
                params = [nome, email, cpf, telefone, clubMember, dataCadastroClub, ativo, id];
            } else {
                query = `
                    UPDATE usuarios
                    SET nome = $1, email = $2, cpf = $3, telefone = $4, clubMember = $5, ativo = $6
                    WHERE id = $7
                    RETURNING id, nome, email, cpf, telefone, senha, clubMember, dataCadastroClub, dataCadastro, ativo`;
                params = [nome, email, cpf, telefone, clubMember, ativo, id];
            }
        }

        const result = await pool.query(query, params);
        console.log("Resultado do edit : " + result.rows[0]);

        if (result.rows.length === 0) return false; // ele entra no if quando não acha o id no campo e n retorna linha nenhuma
        return true;
    }
    console.error("Falha ao editar Cliente, faltou algum dado");
    return false;
}

// Buscar cliente por email específico
async function getClienteByEmail(email) {
    if (!email) return null;

    try {
        const { rows } = await pool.query(
            "SELECT * FROM usuarios WHERE email = $1",
            [email]
        );

        if (rows.length > 0) {
            return rows[0]; // Retorna o objeto do cliente encontrado
        }
        return null; // Retorna null se não encontrar nada
    } catch (error) {
        console.error("Erro ao buscar cliente por email:", error);
        throw error;
    }
}

// Adicionar no clienteDAO.js
async function updateClubMember(usuarioId, clubMember) {
    const { rows } = await pool.query(
        'UPDATE usuarios SET clubMember = $1 WHERE id = $2 RETURNING *',
        [clubMember, usuarioId]
    );
    return rows[0];
}

//delete Cliente
async function deleteCliente(id) {
    if (id) {
        const result = await pool.query(`
            DELETE FROM usuarios
            WHERE id = $1
            RETURNING id`,
            [id]
        );
        if (result.rows.length === 0) return false;
        return true;
    }
    console.error("Falha ao remover o cliente, não foi passado o id");
    return false;
}

module.exports = { Cliente, getClienteByEmail, getClientes, insertCliente, editCliente, updateClubMember, deleteCliente };