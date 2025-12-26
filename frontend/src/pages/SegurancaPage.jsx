import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Mail, Lock, ChevronRight, KeyRound } from "lucide-react";
import Header from "../components/Header";
import { buscarClienteDados } from "../api/clienteAPI";

export default function SegurancaPage() {
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            const dados = await buscarClienteDados();
            setCliente(dados);
            setLoading(false);
        };

        carregarDados();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <Header />

            {/* Hero Section - Mesmo estilo da PerfilPage */}
            <div className="relative h-64 md:h-80 w-full mb-8 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200"
                    alt="Segurança Background"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-green-900/60 to-green-800/40" />

                <div className="relative z-10 h-full flex flex-col items-center justify-center pt-16">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                        <Shield className="text-white" size={40} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">Segurança e Privacidade</h1>
                    <p className="text-white/80 text-sm mt-1">Gerencie suas credenciais</p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50 rounded-t-3xl"></div>
            </div>

            <main className="container mx-auto px-4 md:px-8 max-w-3xl -mt-4">
                {loading ? (
                    <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
                        <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-500">Carregando suas informações...</p>
                    </div>
                ) : (
                    <>
                        {/* Card de Email */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Mail className="text-green-700" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">Email Cadastrado</h3>
                                    <p className="text-gray-500 text-sm">Seu email de acesso à conta</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                                    <p className="font-medium text-gray-800">{cliente?.email || "Não informado"}</p>
                                </div>
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Card de Senha */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Lock className="text-green-700" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">Senha</h3>
                                    <p className="text-gray-500 text-sm">Sua senha de acesso</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Senha atual</p>
                                    <p className="font-medium text-gray-800 tracking-widest">••••••••</p>
                                </div>
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                    <KeyRound className="w-5 h-5 text-gray-500" />
                                </div>
                            </div>
                        </div>

                        {/* Botão de Alterar Senha */}
                        <button
                            onClick={() => navigate("/confirmacaoEmail")}
                            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 mb-4"
                        >
                            <Lock size={20} />
                            Alterar Senha
                            <ChevronRight size={20} />
                        </button>

                        {/* Info de Segurança */}
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Shield className="text-green-700" size={16} />
                            </div>
                            <div>
                                <p className="text-green-800 font-medium text-sm">Dica de Segurança</p>
                                <p className="text-green-700 text-sm mt-1">
                                    Recomendamos alterar sua senha periodicamente para manter sua conta segura.
                                </p>
                            </div>
                        </div>

                        {/* Botão Voltar */}
                        <div className="mt-8 text-center">
                            <button
                                onClick={() => navigate('/perfil')}
                                className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all shadow-md hover:shadow-lg"
                            >
                                ← Voltar ao Perfil
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
