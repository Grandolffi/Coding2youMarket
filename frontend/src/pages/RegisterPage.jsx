import BotaoVerde from "../components/botaoVerde";
import { FcGoogle } from "react-icons/fc";
import { LuEye } from "react-icons/lu"; // Ícone de olho para senha

export default function Cadastro() {
  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <div style={styles.form}>
          <span style={styles.logo}>☕ Subscrivery</span>

          <h1 style={styles.title}>Cadastre-se</h1>

          <p style={styles.subtitle}>
            Já possui uma conta?{" "}
            <a href="#" style={styles.link}>Fazer Login</a>
          </p>

          <label style={styles.label}>E-mail</label>
          <input type="email" placeholder="example@gmail.com" style={styles.input} />

          <label style={styles.label}>Celular</label>
          <input type="text" placeholder="(99) 99999-9999" style={styles.input} />

          <label style={styles.label}>Senha</label>
          <div style={styles.passwordWrapper}>
            <input type="password" placeholder="********" style={styles.inputPassword} />
            <LuEye style={styles.eyeIcon} />
          </div>

          <label style={styles.label}>Confirme a Senha</label>
          <div style={styles.passwordWrapper}>
            <input type="password" placeholder="********" style={styles.inputPassword} />
            <LuEye style={styles.eyeIcon} />
          </div>

          <div style={{ marginTop: "10px" }}>
            <BotaoVerde mensagem="Fazer Cadastro" />
          </div>

          <div style={styles.divider}>
            <div style={styles.line}></div>
            <span style={{ padding: "0 10px" }}>ou</span>
            <div style={styles.line}></div>
          </div>

          <button style={styles.googleBtn}>
            <FcGoogle size={18} />
            Cadastrar com o Google
          </button>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.blob}></div>
        <div style={styles.support}>
          🌐 <span>Suporte</span>
        </div>
        <h2 style={styles.heroText}>
          O essencial,<br /> sempre em dia.
        </h2>
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
    fontWeight: "600"
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
    fontSize: "14px"
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
    fontSize: "14px"
  },
  eyeIcon: {
    position: "absolute",
    right: "12px",
    color: "#94A3B8",
    cursor: "pointer"
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