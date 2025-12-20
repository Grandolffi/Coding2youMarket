export default function FooterVerde() {
  return (
    <footer style={styles.footer}>
      <span style={styles.texto}>
        © 2025 Simbloco Subscrivery
      </span>
    </footer>
  );
}

const styles = {
  footer: {
    width: "100%",
    height: "60px",
    backgroundColor: "#2F6B4F",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "fixed",
    bottom: 0,
    left: 0
  },
  texto: {
    color: "#FFFFFF",
    fontSize: "14px",
    fontWeight: "500"
  }
};

//COMO CHAMAR ESSE CODIGO 

// 1. Importe o componente (verifique se o caminho do arquivo está correto)
import FooterVerde from "../components/FooterVerde"; 
import BotaoVerde from "../components/botaoVerde";
// ... outros imports

export default function Login() {
  return (
    // Fragmento ou Div pai para envolver o conteúdo e o footer
    <> 
      <div style={styles.container}>
        {/* ... todo o seu código da esquerda e direita ... */}
      </div>

      {/* 2. Chame o componente aqui */}
      <FooterVerde />
    </>
  );
}