import { useNavigate } from "react-router-dom";

export default function PerfilPage() {
    const navigate = useNavigate();

    const menuItems = [
        { label: "Dados Pessoais", path: "/dados-pessoais" },
        { label: "Segurança e Privacidade", path: "/seguranca" },
        { label: "Formas de Pagamento", path: "/pagamento" },
        { label: "Suporte", path: "/suporte" },
        { label: "Configurações", path: "/configuracoes" },
    ];

    return (
        <div style={styles.container}>
            {/* Header com foto de perfil */}
            <div style={styles.header}>
                <div style={styles.profileImageContainer}>
                    <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face"
                        alt="Foto de perfil"
                        style={styles.profileImage}
                    />
                </div>
                <h1 style={styles.title}>Perfil</h1>
                <p style={styles.greeting}>Olá, Mariana!</p>
            </div>

            {/* Menu de opções */}
            <div style={styles.menuContainer}>
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        style={styles.menuItem}
                        onClick={() => navigate(item.path)}
                    >
                        <span style={styles.menuLabel}>{item.label}</span>
                        <span style={styles.arrow}>›</span>
                    </div>
                ))}

                {/* Deletar Conta */}
                <div style={styles.deleteItem}>
                    <span style={styles.deleteLabel}>Deletar Conta</span>
                    <span style={styles.deleteArrow}>›</span>
                </div>
            </div>

            {/* Footer Navigation */}
            <nav style={styles.bottomNav}>
                <div style={styles.navItem} onClick={() => navigate("/home")}>
                    <svg style={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9,22 9,12 15,12 15,22" />
                    </svg>
                    <span style={styles.navLabel}>Início</span>
                </div>
                <div style={styles.navItem}>
                    <svg style={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    <span style={styles.navLabel}>Carrinho</span>
                </div>
                <div style={styles.navItem}>
                    <svg style={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="3" y1="9" x2="21" y2="9" />
                        <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                    <span style={styles.navLabel}>Dashboard</span>
                </div>
                <div style={{ ...styles.navItem, ...styles.navItemActive }}>
                    <svg style={{ ...styles.navIcon, color: "#2F6B4F" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span style={{ ...styles.navLabel, color: "#2F6B4F", fontWeight: "600" }}>Perfil</span>
                </div>
            </nav>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        paddingBottom: "70px",
    },
    header: {
        position: "relative",
        height: "280px",
        background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    profileImageContainer: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
    },
    profileImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        filter: "brightness(0.85)",
    },
    title: {
        position: "relative",
        zIndex: 1,
        color: "#FFFFFF",
        fontSize: "28px",
        fontWeight: "700",
        margin: 0,
        textShadow: "0 2px 4px rgba(0,0,0,0.3)",
    },
    greeting: {
        position: "relative",
        zIndex: 1,
        color: "#FFFFFF",
        fontSize: "16px",
        fontWeight: "400",
        margin: "4px 0 0 0",
        opacity: 0.95,
        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
    },
    menuContainer: {
        flex: 1,
        padding: "24px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "0",
    },
    menuItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 4px",
        borderBottom: "1px solid #F0F0F0",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
    },
    menuLabel: {
        fontSize: "16px",
        fontWeight: "400",
        color: "#333333",
    },
    arrow: {
        fontSize: "24px",
        color: "#CCCCCC",
        fontWeight: "300",
    },
    deleteItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 4px",
        cursor: "pointer",
        marginTop: "8px",
    },
    deleteLabel: {
        fontSize: "16px",
        fontWeight: "500",
        color: "#E74C3C",
    },
    deleteArrow: {
        fontSize: "24px",
        color: "#E74C3C",
        fontWeight: "300",
    },
    bottomNav: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "65px",
        backgroundColor: "#FFFFFF",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.08)",
        borderTop: "1px solid #F0F0F0",
    },
    navItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        cursor: "pointer",
        padding: "8px 16px",
    },
    navItemActive: {},
    navIcon: {
        width: "22px",
        height: "22px",
        color: "#999999",
    },
    navLabel: {
        fontSize: "11px",
        fontWeight: "500",
        color: "#999999",
    },
};
