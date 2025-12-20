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
