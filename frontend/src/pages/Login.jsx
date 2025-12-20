import BotaoVerde from "../components/botaoVerde";
import { FcGoogle } from "react-icons/fc";
export default function Login() {

  return (
    <div style={styles.container}>

      <div style={styles.left}>
        <div style={styles.form}>

          <span style={styles.logo}>☕ Subscrivery</span>

          <h1 style={styles.title}>Faça Login</h1>

          <p style={styles.subtitle}>
            Ainda não possui uma conta?{" "}
            <a href="#" style={styles.link}>Criar Conta</a>
          </p>

          <label style={styles.label}>E-mail</label>
          <input type="email" placeholder="example@gmail.com" style={styles.input} />

          <label style={styles.label}>Senha</label>
          <input type="password" placeholder="******" style={styles.input} />

          <div style={styles.row}>
            <label style={styles.checkbox}>
              <input type="checkbox" style={styles.checkboxInput} />
              Lembre-se de mim
            </label>

            <a href="#" style={styles.link}>
              Esqueceu a minha senha?
            </a>
          </div>

          <BotaoVerde mensagem="Fazer Login" />

          <div style={styles.divider}>ou</div>

          <button style={styles.googleBtn}>
            <FcGoogle size={18} />
            Continuar com o Google
          </button>

        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.blob}></div>

        <div style={styles.support}>
          🎧 <span>Suporte</span>
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
    fontFamily: "Inter, sans-serif"
  },

  checkboxInput: {
  width: "16px",
  height: "16px",
  cursor: "pointer",
  accentColor: "#2F6B4F"
},

  left: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  form: {
    width: "100%",
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  logo: {
    fontWeight: "600",
    marginBottom: "30px",
    color: "#2F6B4F"
  },

  title: {
    fontSize: "28px",
    marginBottom: "5px",
    color: "#222"
  },

  subtitle: {
    fontSize: "13px",
    color: "#777"
  },

  link: {
    color: "#2F6B4F",
    textDecoration: "none",
    fontWeight: "bold"
  },

  label: {
    fontSize: "12px",
    marginTop: "10px",
    color: "#555"
  },

  input: {
    height: "42px",
    borderRadius: "8px",
    border: "1px solid #CCC",
    backgroundColor: "#FFFFFF",
    color: "#333",
    padding: "0 12px",
    outline: "none"
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "12px",
    margin: "8px 0",
    color: "#666"
  },

  checkbox: {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "12px",
  color: "#666"
},
  divider: {
    textAlign: "center",
    margin: "15px 0",
    fontSize: "12px",
    color: "#999"
  },

  googleBtn: {
    height: "42px",
    borderRadius: "8px",
    border: "1px solid #DDD",
    background: "#FFFFFF",
    color: "#444",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontWeight: "500"
  },

right: {
  flex: 1,
  position: "relative",
  background: "linear-gradient(135deg, #2F6B4F 0%, #2B6A52 100%)",
  display: "flex",
  alignItems: "center",      
  justifyContent: "flex-start",
  padding: "60px"
},

support: {
  position: "absolute",
  top: "32px",
  left: "50%",
  transform: "translateX(-50%)",
  fontSize: "14px",
  opacity: 0.9,
  display: "flex",
  alignItems: "center",
  gap: "6px",
  zIndex: 1
},

blob: {
  position: "absolute",
  top: "-120px",
  right: "-120px",
  width: "360px",
  height: "360px",
  background: "radial-gradient(circle at center, rgba(255,255,255,0.18), transparent 60%)",
  borderRadius: "50%",
  filter: "blur(20px)"
},

heroText: {
  fontSize: "48px",
  fontWeight: "800",
  lineHeight: "1.15",
  color: "#FFFFFF",
  maxWidth: "360px",
  zIndex: 1
  
}


};
