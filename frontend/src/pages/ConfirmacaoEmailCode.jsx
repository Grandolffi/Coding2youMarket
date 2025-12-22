import BotaoVerde from "../components/botaoVerde";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { validarCodigoVerificacao } from "../api/auth";
import { useState } from 'react';

export default function ConfirmacaoEmailCode() {
  const location = useLocation();
  const navigate = useNavigate();

 
  const emailUsuario = location.state?.email || localStorage.getItem('email_recuperacao');

  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  const handleConfirmarClick = async () => {
    
    if (!emailUsuario) {
      setMensagem({ tipo: 'erro', texto: 'E-mail não encontrado. Volte ao início.' });
      return;
    }

    if (!codigo) {
      setMensagem({ tipo: 'erro', texto: 'Por favor, insira o código.' });
      return;
    }

    setLoading(true);
    try {

      const resultado = await validarCodigoVerificacao(emailUsuario, codigo);

      if (resultado.success) {
       setMensagem({
          tipo: "sucesso",
          texto: "Validação aprovada! Redirecionando..."
        });

          setTimeout(() => {
            navigate("/redefinir-senha", {
              state: { email: emailUsuario }
            });
            }, 800);
      } else {
        setMensagem({ tipo: 'erro', texto: 'Código não validado' });
      }
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: 'Código não validado' });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <div style={styles.form}>
          <span style={styles.logo}>☕ Subscrivery</span>

          <h1 style={styles.title}>Verifique seu e-mail</h1>

          <p style={styles.subtitle}>
            Enviamos um código de confirmação para o seu e-mail <strong>{emailUsuario}</strong>.
            Por favor, insira-o abaixo para ativar sua conta.
          </p>

          <label style={styles.label}>Código de Verificação</label>
          <input
            type="text"
            placeholder="000000"
            style={styles.input}
            maxLength={6}
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            disabled={loading}
          />

          {mensagem.texto && (
            <p style={{ 
              fontSize: '12px', 
              color: mensagem.tipo === 'erro' ? '#E53E3E' : '#2F6B4F',
              textAlign: 'center',
              marginTop: '8px'
            }}>
              {mensagem.texto}
            </p>
          )}

          <div style={{ marginTop: "16px" }}>
            <BotaoVerde 
              mensagem={loading ? "Validando..." : "Confirmar Código"} 
              onClick={handleConfirmarClick} 
              disabled={loading}
            />
          </div>

          <p style={styles.resendText}>
            Não recebeu o código?{" "}
            <Link to="/login" style={styles.link}>
              ← Voltar para o Login
            </Link>
          </p>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.blob}></div>
        <div style={styles.support}>🌐 <span>Suporte</span></div>
        <h2 style={styles.heroText}>O essencial,<br /> sempre em dia.</h2>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    fontFamily: "Inter, sans-serif",
  },

  left: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  form: {
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  logo: {
    fontWeight: "600",
    marginBottom: "20px",
    color: "#2F6B4F",
    fontSize: "18px",
  },

  title: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "8px",
    color: "#1A1A1A",
  },

  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "24px",
    lineHeight: "1.5",
  },

  label: {
    fontSize: "13px",
    marginTop: "8px",
    color: "#444",
    fontWeight: "500",
  },

  input: {
    height: "45px",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    backgroundColor: "#F8FAFC",
    padding: "0 12px",
    outline: "none",
    fontSize: "16px",
    color: "#1A1A1A",
    textAlign: "center",
    letterSpacing: "4px",
  },

  resendText: {
    fontSize: "13px",
    color: "#666",
    marginTop: "20px",
    textAlign: "center",
  },

  link: {
    color: "#2F6B4F",
    textDecoration: "underline",
    fontWeight: "600",
    cursor: "pointer",
  },

  linkSmall: {
    color: "#64748B",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "13px",
    cursor: "pointer",
  },

  backToLogin: {
    marginTop: "40px",
    textAlign: "center",
  },

  right: {
    flex: 1,
    position: "relative",
    backgroundColor: "#2F6B4F",
    display: "flex",
    alignItems: "center",
    padding: "80px",
  },

  support: {
    position: "absolute",
    top: "40px",
    right: "40px",
    color: "#FFFFFF",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    opacity: 0.9,
  },

  blob: {
    position: "absolute",
    top: "-10%",
    right: "-10%",
    width: "500px",
    height: "500px",
    background: "rgba(255, 255, 255, 0.08)",
    borderRadius: "50%",
    filter: "blur(60px)",
  },

  heroText: {
    fontSize: "64px",
    fontWeight: "800",
    lineHeight: "1.1",
    color: "#FFFFFF",
    maxWidth: "450px",
    zIndex: 1,
  },
};
