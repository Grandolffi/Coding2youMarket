import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Package } from 'lucide-react';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
export default function ConfirmacaoPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { pagamento, pedido, isClub } = location.state || {};

    // Detectar se é assinatura recorrente ou compra única
    const isAssinatura = pedido?.frequencia &&
        pedido.frequencia !== 'unica' &&
        (pedido.frequencia === 'semanal' || pedido.frequencia === 'mensal');
    const titulo = isClub ? 'Bem-vindo ao Club!' :
        isAssinatura ? 'Assinatura Criada!' :
            'Pedido Criado!';
    useEffect(() => {
        // Confetti ao carregar
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, []);
    if (!pagamento && !pedido) { // Adjusted condition to check for both
        navigate('/');
        return null;
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Animação de Confetti */}
                <div className="relative h-48 bg-gradient-to-br from-[#2F6C50] to-[#1a4d33] flex items-center justify-center overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

                    {/* Ícone de Sucesso */}
                    <div className="relative z-10 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                        <svg className="w-12 h-12 text-verde-salvia-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                {/* Conteúdo */}
                <div className="p-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{titulo}</h1>
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
                            <span className="text-verde-salvia-600 font-semibold text-sm uppercase">{pagamento.status}</span>
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
                <p className="text-center text-gray-500 text-xs md:text-sm px-2 pb-4">
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

