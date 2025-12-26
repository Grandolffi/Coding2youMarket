import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { buscarCep, criarEndereco } from '../api/enderecoAPI';
import { getUsuarioId } from '../api/auth';
import fotoFundo from '../assets/01.png';

export default function NovoEnderecoModal() {
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [complemento, setComplemento] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [apelido, setApelido] = useState("");
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detecta de onde o usuário veio
  const veioDeEnderecos = location.state?.from === 'meus-enderecos';

  const handleCepChange = (e) => setCep(e.target.value.replace(/\D/g, ""));

  const fetchCep = async () => {
    setMensagem({ tipo: "", texto: "" }); // Limpa mensagens anteriores
    if (cep.length !== 8) {
      setMensagem({ tipo: "erro", texto: "CEP inválido" });
      return;
    }

    try {
      setErro("");
      setBuscandoCep(true);
      const response = await buscarCep(cep);

      if (response.success && response.endereco) {
        setRua(response.endereco.rua || "");
        setBairro(response.endereco.bairro || "");
        setCidade(response.endereco.cidade || "");
        setEstado(response.endereco.estado || "");
      } else {
        setMensagem({ tipo: "erro", texto: response.message || "CEP não encontrado" });
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      setMensagem({ tipo: "erro", texto: "Erro ao buscar o CEP" });
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleSubmit = async () => {
    setErro("");
    setMensagem({ tipo: "", texto: "" });

    if (!cep || !rua || !numero || !bairro || !cidade || !estado) {
      setMensagem({ tipo: "erro", texto: "Por favor, preencha todos os campos obrigatórios" });
      return;
    }

    try {
      setLoading(true);
      const usuarioId = getUsuarioId();
      if (!usuarioId) {
        setMensagem({ tipo: "erro", texto: "Não foi possível identificar o usuário." });
        return;
      }

      const novoEndereco = {
        usuarioId, cep, rua, numero, bairro, complemento, cidade, estado, apelido, principal: true
      };

      const resultado = await criarEndereco(novoEndereco);
      if (!resultado.success) {
        setMensagem({ tipo: "erro", texto: "Erro ao salvar o endereço" });
        return;
      }

      setMensagem({ tipo: "sucesso", texto: "Endereço cadastrado com sucesso" });
      // Redireciona baseado na origem
      const destino = veioDeEnderecos ? "/meus-enderecos" : "/home";
      setTimeout(() => navigate(destino), 1500);
    } catch (error) {
      setMensagem({ tipo: "erro", texto: error?.message || "Erro ao salvar endereço." });
    } finally {
      setLoading(false);
    }
  };

  const estiloOverlayComFundo = {
    ...styles.overlay,
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${fotoFundo})`,
  };

  return (
    <div style={estiloOverlayComFundo}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <button onClick={() => navigate(veioDeEnderecos ? "/meus-enderecos" : "/home")} style={styles.backButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h2 style={styles.headerTitle}>Novo endereço</h2>
          <div style={{ width: 20 }}></div>
        </div>

        <div style={styles.formContent}>

          {/* RENDERIZAÇÃO DA MENSAGEM */}
          {mensagem.texto && (
            <p style={{
              ...styles.errorText,
              color: mensagem.tipo === "erro" ? "red" : "green",
              textAlign: 'center',
              marginBottom: '15px'
            }}>
              {mensagem.texto}
            </p>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>CEP</label>
            <div style={styles.row}>
              <input
                style={{ ...styles.input, flex: 1, marginRight: '10px' }}
                type="text"
                placeholder="00000000"
                value={cep}
                onChange={handleCepChange}
                maxLength={8}
              />
              <button
                onClick={fetchCep}
                disabled={buscandoCep}
                style={styles.searchButton}
              >
                {buscandoCep ? "..." : "Buscar"}
              </button>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Rua</label>
            <input
              style={styles.input}
              type="text"
              value={rua}
              onChange={(e) => setRua(e.target.value)}
            />
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.inputGroup, flex: 1, marginRight: '10px' }}>
              <label style={styles.label}>Número</label>
              <input
                style={styles.input}
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
              />
            </div>
            <div style={{ ...styles.inputGroup, flex: 2 }}>
              <label style={styles.label}>Bairro</label>
              <input
                style={styles.input}
                type="text"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Complemento</label>
            <input
              style={styles.input}
              type="text"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Cidade</label>
            <input
              style={styles.input}
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.inputGroup, flex: 1, marginRight: '10px' }}>
              <label style={styles.label}>UF</label>
              <input
                style={styles.input}
                type="text"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              />
            </div>
            <div style={{ ...styles.inputGroup, flex: 3 }}>
              <label style={styles.label}>Apelido</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Casa, Trabalho..."
                value={apelido}
                onChange={(e) => setApelido(e.target.value)}
              />
            </div>
          </div>

          <button
            style={{ ...styles.submitButton, opacity: loading ? 0.7 : 1 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Adicionar endereço"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    width: '100%',
    minHeight: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'sans-serif',
    padding: '20px',
  },

  modal: {
    backgroundColor: '#F8F9FA',
    width: '100%',
    maxWidth: '450px',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    borderBottom: '1px solid #E0E0E0',
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  backButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#333',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
  },
  formContent: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#444',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #FFF',
    backgroundColor: '#FFF',
    fontSize: '14px',
    color: '#666',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  row: {
    display: 'flex',
    width: '100%',
    alignItems: 'flex-end',
  },
  searchButton: {
    backgroundColor: '#2F6B4F',
    color: '#FFF',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 20px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  submitButton: {
    backgroundColor: '#2F6B4F',
    color: '#FFF',
    border: 'none',
    padding: '16px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
  },
  errorText: {
    color: '#D9534F',
    fontSize: '13px',
    fontWeight: '500',
    backgroundColor: '#FADBD8',
    padding: '10px',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #EBCCD1',
  },
};