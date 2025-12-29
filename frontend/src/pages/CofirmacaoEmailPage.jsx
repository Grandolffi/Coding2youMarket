import React, { useState, useEffect } from "react";
import BotaoVerde from "../components/botaoVerde";
import { Link, useNavigate } from "react-router-dom";
import { solicitarCodigoVerificacao } from "../api/auth";
import logoPrincipal2 from "../assets/Logo Subscrivery/Logo Principal 2.png";

export default function ConfirmacaoEmailPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload && payload.email) {
          setEmail(payload.email);
        }
      } catch (e) {

      }
    }
  }, []);


  const handleEnviarCodigo = async () => {
    if (!email) {
      setMensagem({ tipo: "erro", texto: "Campo de email vazio." });
      return;
    }

    try {
      setLoading(true);
      setMensagem({ tipo: "", texto: "" });

      const res = await solicitarCodigoVerificacao(email);

      if (res.success) {
        localStorage.setItem("email_recuperacao", email);
        setMensagem({ tipo: "sucesso", texto: "Email enviado com sucesso." });

        setTimeout(() => {
          navigate("/confirmacaoEmailCode", { state: { email } });
        }, 800);
      } else {
        setMensagem({ tipo: "erro", texto: "Erro ao enviar o código." });
      }
    } catch (error) {
      setMensagem({
        tipo: "erro",
        texto: "E-mail não encontrado. Digite novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <div style={styles.form}>
          <img src={logoPrincipal2} alt="Logo Subscrivery" style={{ height: '40px', width: 'auto', objectFit: 'contain', mixBlendMode: 'multiply', marginBottom: '20px' }} />
          <h1 style={styles.title}>Recuperar Senha</h1>
          <p style={styles.subtitle}>
            Enviaremos um código para validar seu acesso.
          </p>

          <label style={styles.label}>E-mail cadastrado</label>
          <input
            type="email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {mensagem.texto && (
            <p
              style={{
                fontSize: "13px",
                marginTop: "6px",
                color:
                  mensagem.tipo === "sucesso" ? "#2F6B4F" : "#DC2626",
              }}
            >
              {mensagem.texto}
            </p>
          )}

          <div style={{ marginTop: "16px" }}>
            <BotaoVerde
              mensagem={loading ? "Enviando..." : "Enviar Código"}
              onClick={handleEnviarCodigo}
              disabled={loading}
            />
          </div>

          <div style={styles.backToLogin}>
            <Link to="/" style={styles.linkSmall}>
              ← Voltar para o Login
            </Link>
          </div>
        </div>
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
    padding: "32px",
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    border: "1px solid #E5E7EB",
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
    fontSize: "15px",
    color: "#1A1A1A",
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
};

