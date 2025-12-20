export default function BotaoVerde({ mensagem, onClick, type = "button" }) {
  return (
    <button type={type} onClick={onClick} style={styles.botao}>
      {mensagem}
    </button>
  );
}

const styles = {
  botao: {
    width: "100%",
    height: "48px",
    backgroundColor: "#2F6B4F",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer"
  }
};

//COMO CHAMAR A FUNÇÃO
/*
import React from "react";
import BotaoVerde from "../components/BotaoVerde";

export default function Login() {
  return (
    <div style={{ maxWidth: "300px" }}>
      <BotaoVerde
        mensagem="Fazer Login"
        onClick={() => alert("Login clicado")}
      />
    </div>
  );
} */ 