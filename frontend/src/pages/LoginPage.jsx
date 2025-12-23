import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BotaoVerde from "../components/botaoVerde";
import { FcGoogle } from "react-icons/fc";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { login, getUsuarioId } from "../api/auth";
import { meusEnderecos } from "../api/enderecoAPI";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  const navigate = useNavigate();

  const handleLogin = async () => {
    
    setErro("");
    setMensagem({ tipo: "", texto: "" });

    if (!email || !senha) {
      setMensagem({
        tipo: "erro",
        texto: "Informe e-mail e senha.",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await login(email, senha);

      if (res && res.token) {
        localStorage.setItem("token", res.token);
        
      }

      const usuarioId = getUsuarioId();
      
      if (!usuarioId) {
        setMensagem({ tipo: "erro", texto: "Não foi possível identificar o usuário." });
        return;
      }

      const enderecos = await meusEnderecos(usuarioId);


      if (enderecos && enderecos.length > 0) {
        setTimeout(() => navigate("/home"), 1500); 
        
      } else {
        setTimeout(() => navigate("/novoEndereco"), 1500); 
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);

      setMensagem({ 
        tipo: "erro", 
        texto: error.message || "E-mail ou senha incorretos." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <div style={styles.form}>
          <span style={styles.logo}>☕ Subscrivery</span>
          <h1 style={styles.title}>Faça Login</h1>
          <p style={styles.subtitle}>
            Ainda não possui uma conta?{" "}
            <Link to="/register" style={styles.link}>Criar Conta</Link>
          </p>

          {(mensagem.texto || erro) && (
            <p style={{ 
              color: mensagem.tipo === "sucesso" ? "#2F6B4F" : "#dc3545", 
              fontSize: "13px",
              fontWeight: "600",
              textAlign: "center",
              backgroundColor: mensagem.tipo === "sucesso" ? "#E6FFFA" : "#FFF5F5",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "10px"
            }}>
              {mensagem.texto || erro}
            </p>
          )}

          <label style={styles.label}>E-mail</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label style={styles.label}>Senha</label>
          <div style={styles.passwordWrapper}>
            <input
              type={verSenha ? "text" : "password"}
              placeholder="********"
              style={styles.inputPassword}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <div onClick={() => setVerSenha(!verSenha)} style={styles.eyeIcon}>
              {verSenha ? <LuEyeOff /> : <LuEye />}
            </div>
          </div>

          <div style={styles.row}>
            <label style={styles.checkboxContainer}>
              <input type="checkbox" style={styles.checkboxInput} />
              <span style={{ fontSize: "13px", color: "#666" }}>Lembre-se de mim</span>
            </label>
            <Link to="/confirmacaoEmail" style={styles.linkSmall}>Esqueceu a senha?</Link>
          </div>

          <div style={{ marginTop: "10px" }}>
            <BotaoVerde
              mensagem={loading ? "Carregando..." : "Fazer Login"}
              onClick={handleLogin}
              disabled={loading}
            />
          </div>

          <div style={styles.divider}>
            <div style={styles.line}></div>
            <span style={{ padding: "0 10px" }}>ou</span>
            <div style={styles.line}></div>
          </div>

          <button style={styles.googleBtn}>
            <FcGoogle size={18} /> Continuar com o Google
          </button>
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
    fontSize: "18px"
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "4px",
    color: "#1A1A1A"
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px"
  },
  link: {
    color: "#2F6B4F",
    textDecoration: "underline",
    fontWeight: "600",
    cursor: "pointer"
  },
  linkSmall: {
    color: "#2F6B4F",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "12px",
    cursor: "pointer"
  },
  label: {
    fontSize: "13px",
    marginTop: "8px",
    color: "#444",
    fontWeight: "500"
  },
  input: {
    height: "45px",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    backgroundColor: "#F8FAFC",
    padding: "0 12px",
    outline: "none",
    fontSize: "14px",
    color: "#666"
  },
  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  inputPassword: {
    width: "100%",
    height: "45px",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    backgroundColor: "#F8FAFC",
    padding: "0 40px 0 12px",
    outline: "none",
    fontSize: "14px",
    color: "#666"
  },
  eyeIcon: {
    position: "absolute",
    right: "12px",
    color: "#94A3B8",
    cursor: "pointer"
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "12px 0"
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#666",
    cursor: "pointer"
  },
  checkboxInput: {
    accentColor: "#2F6B4F",
    width: "16px",
    height: "16px"
  },
  divider: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px 0",
    fontSize: "12px",
    color: "#94A3B8",
    textTransform: "uppercase"
  },
  line: {
    flex: 1,
    height: "1px",
    backgroundColor: "#E2E8F0"
  },
  googleBtn: {
    height: "48px",
    borderRadius: "24px",
    border: "1px solid #E2E8F0",
    background: "#F8FAFC",
    color: "#475569",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    fontWeight: "500",
    fontSize: "14px"
  },
  right: {
    flex: 1,
    position: "relative",
    backgroundColor: "#2F6B4F",
    display: "flex",
    alignItems: "center",
    padding: "80px"
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
    opacity: 0.9
  },
  blob: {
    position: "absolute",
    top: "-10%",
    right: "-10%",
    width: "500px",
    height: "500px",
    background: "rgba(255, 255, 255, 0.08)",
    borderRadius: "50%",
    filter: "blur(60px)"
  },
  heroText: {
    fontSize: "64px",
    fontWeight: "800",
    lineHeight: "1.1",
    color: "#FFFFFF",
    maxWidth: "450px",
    zIndex: 1
  }
};
