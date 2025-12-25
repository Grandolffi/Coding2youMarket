import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Package } from 'lucide-react';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
export default function ConfirmacaoPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const pagamento = location.state?.pagamento;
    useEffect(() => {
        // Confetti ao carregar
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, []);
    if (!pagamento) {
        navigate('/');
        return null;
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Card Principal */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 text-center relative overflow-hidden">
                    {/* Elementos decorativos */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-green-200 rounded-full -translate-x-16 -translate-y-16 opacity-50"></div>
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-200 rounded-full translate-x-20 translate-y-20 opacity-50"></div>
                    <div className="absolute top-1/2 right-0 w-20 h-20 bg-purple-200 rounded-full translate-x-10 opacity-50"></div>
                    {/* Ícone de Sucesso */}
                    <div className="relative mb-6 inline-block">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow">
                            <CheckCircle className="text-white" size={56} strokeWidth={2.5} />
                        </div>
                        {/* Elementos decorativos ao redor */}
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                        <div className="absolute top-0 -left-4 w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Assinatura Criada!
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Tudo certo. A gente cuida do resto.
                    </p>
                    {/* Detalhes do Pagamento */}
                    <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-left">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600 text-sm">ID do Pedido</span>
                            <span className="text-gray-800 font-mono text-sm">#{pagamento.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 text-sm">Status</span>
                            <span className="text-green-600 font-semibold text-sm uppercase">{pagamento.status}</span>
                        </div>
                    </div>
                    {/* Botões de Ação */}
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/pedidos')}
                            className="w-full py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Package size={20} />
                            Ver Dashboard
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Home size={20} />
                            Voltar à Loja
                        </button>
                    </div>
                </div>
                {/* Texto extra */}
                <p className="text-center text-gray-600 text-sm mt-4">
                    Enviamos uma confirmação por email 📧
                </p>
            </div>
            <style>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 2s infinite;
                }
            `}</style>
        </div>
    );
}