import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { buscarClienteDados } from "../api/clienteAPI";

export default function PerfilPage() {
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const carregarDados = async () => {
            const dados = await buscarClienteDados();
            // console.log("DADOS DO CLIENTE:", dados); // Removed debug log
            if (dados) { // Added condition based on user's snippet, assuming it's intended
                setCliente(dados);
            }
            setLoading(false);
        };

        carregarDados();
    }, []);

    const menuItems = [
        { label: "Dados Pessoais", path: "/dados-pessoais" },
        { label: "Segurança e Privacidade", path: "/seguranca" },
        { label: "Formas de Pagamento", path: "/meus-cartoes" },
        { label: "Suporte", path: "/suporte" },
        { label: "Configurações", path: "/configuracoes" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <Header />

            <div className="relative h-80 md:h-96 w-full mb-8 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200"
                    alt="Perfil Background"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-green-900/60 to-green-800/40" />

                <div className="relative z-10 h-full flex flex-col items-center justify-center pt-16">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl mb-4">
                        <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face"
                            alt="Foto de perfil"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-white drop-shadow-lg">Perfil</h1>
                    <p className="text-white/80 text-sm mt-1">
                        {loading ? "Carregando..." : `Olá, ${cliente?.nome || "Usuário"}!`}
                    </p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50 rounded-t-3xl"></div>
            </div>

            <main className="container mx-auto px-4 md:px-8 max-w-3xl -mt-4">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {menuItems.map((item, index) => (
                        <div
                            key={index}
                            className={`flex justify-between items-center px-5 py-4 cursor-pointer hover:bg-gray-50 transition-all ${index !== menuItems.length - 1 ? "border-b border-gray-100" : ""
                                }`}
                            onClick={() => navigate(item.path)}
                        >
                            <span className="text-gray-800 font-medium">{item.label}</span>
                            <span className="text-gray-400 text-xl">›</span>
                        </div>
                    ))}
                </div>

                <div
                    className="mt-4 bg-white rounded-2xl shadow-lg px-5 py-4 flex justify-between items-center cursor-pointer hover:bg-red-50 transition-all"
                    onClick={() => setShowModal(true)}
                >
                    <span className="text-red-600 font-medium">Deletar Conta</span>
                    <span className="text-red-400 text-xl">›</span>
                </div>
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                            <h2 className="text-xl font-semibold mb-4">Confirmar Exclusão</h2>
                            <p className="mb-6">Tem certeza que deseja deletar sua conta?</p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    onClick={() => {
                                        // Deletar conta confirmada
                                        toast.success('Conta excluída com sucesso!');
                                        setShowModal(false); // Keep modal closing behavior
                                    }}
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
