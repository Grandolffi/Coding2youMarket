import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function ClubMarketPage() {
    const navigate = useNavigate();
    const [planoSelecionado, setPlanoSelecionado] = useState(null);

    const planos = [
        {
            id: 'entrada',
            nome: 'Entrada',
            preco: 9.90,
            emoji: '🌱',
            desconto: 0,
            freteGratis: true,
            cor: 'gray',
            beneficios: [
                { texto: 'Frete grátis em todas as compras', ativo: true },
                { texto: 'Sem desconto em produtos', ativo: false },
                { texto: 'Suporte prioritário', ativo: false },
            ]
        },
        {
            id: 'intermediario',
            nome: 'Intermediário',
            preco: 19.90,
            emoji: '🌿',
            desconto: 10,
            freteGratis: true,
            cor: 'green',
            popular: true,
            beneficios: [
                { texto: 'Frete grátis em todas as compras', ativo: true },
                { texto: '10% de desconto em produtos', ativo: true },
                { texto: 'Suporte prioritário', ativo: true },
            ]
        },
        {
            id: 'premium',
            nome: 'Premium',
            preco: 39.90,
            emoji: '👑',
            desconto: 25,
            freteGratis: true,
            cor: 'amber',
            beneficios: [
                { texto: 'Frete grátis em todas as compras', ativo: true },
                { texto: '25% de desconto em produtos', ativo: true },
                { texto: 'Suporte prioritário 24/7', ativo: true },
                { texto: 'Acesso antecipado a promoções', ativo: true },
            ]
        }
    ];

    const getCardStyles = (plano) => {
        const styles = {
            gray: {
                bg: 'bg-gray-50',
                border: planoSelecionado === plano.id ? 'border-green-500' : 'border-gray-200',
                badge: 'bg-gray-200 text-gray-700',
                preco: 'text-gray-800'
            },
            green: {
                bg: 'bg-green-50',
                border: planoSelecionado === plano.id ? 'border-green-600' : 'border-green-400',
                badge: 'bg-green-500 text-white',
                preco: 'text-green-600'
            },
            amber: {
                bg: 'bg-gradient-to-b from-amber-50 to-orange-50',
                border: planoSelecionado === plano.id ? 'border-amber-500' : 'border-amber-300',
                badge: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
                preco: 'text-amber-600'
            }
        };
        return styles[plano.cor];
    };

    const handleAssinar = () => {
        if (planoSelecionado) {
            // Aqui você pode integrar com a API de assinatura
            console.log('Assinando plano:', planoSelecionado);
            navigate('/pagamento', { state: { plano: planoSelecionado } });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <Header />

            {/* Hero Section */}
            <div className="relative h-72 md:h-96 w-full mb-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-500 to-teal-600" />
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-10 left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-300/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 h-full flex flex-col items-center justify-center pt-16">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-4 shadow-2xl">
                        <span className="text-5xl">⭐</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg text-center">Club Market</h1>
                    <p className="text-white/80 text-lg mt-3 text-center px-4 max-w-xl">
                        Economize em todas as suas compras com benefícios exclusivos
                    </p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50 rounded-t-3xl"></div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 md:px-8 max-w-5xl -mt-4">

                {/* Planos */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {planos.map((plano) => {
                        const styles = getCardStyles(plano);
                        return (
                            <div
                                key={plano.id}
                                onClick={() => setPlanoSelecionado(plano.id)}
                                className={`${styles.bg} rounded-3xl p-6 border-2 ${styles.border} cursor-pointer transition-all duration-300 hover:shadow-xl ${planoSelecionado === plano.id ? 'shadow-xl scale-[1.02]' : 'hover:scale-[1.01]'} relative`}
                            >
                                {/* Badge Popular */}
                                {plano.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                                        MAIS POPULAR
                                    </div>
                                )}

                                {/* Seleção Indicator */}
                                {planoSelecionado === plano.id && (
                                    <div className="absolute top-4 right-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm">✓</span>
                                    </div>
                                )}

                                {/* Emoji e Nome */}
                                <div className="text-center mb-6">
                                    <span className="text-5xl block mb-3">{plano.emoji}</span>
                                    <h3 className="text-xl font-bold text-gray-800">{plano.nome}</h3>
                                </div>

                                {/* Preço */}
                                <div className="text-center mb-6">
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-sm text-gray-500">R$</span>
                                        <span className={`text-4xl font-bold ${styles.preco}`}>
                                            {plano.preco.toFixed(2).replace('.', ',')}
                                        </span>
                                    </div>
                                    <span className="text-gray-500 text-sm">/mês</span>
                                </div>

                                {/* Badge Desconto */}
                                <div className="text-center mb-6">
                                    <span className={`inline-block px-4 py-2 ${styles.badge} rounded-full text-sm font-bold`}>
                                        {plano.desconto}% de desconto
                                    </span>
                                </div>

                                {/* Benefícios */}
                                <ul className="space-y-3">
                                    {plano.beneficios.map((beneficio, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <span className={`text-lg ${beneficio.ativo ? 'text-green-500' : 'text-gray-300'}`}>
                                                {beneficio.ativo ? '✓' : '○'}
                                            </span>
                                            <span className={`text-sm ${beneficio.ativo ? 'text-gray-700' : 'text-gray-400'}`}>
                                                {beneficio.texto}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                {/* CTA Section */}
                <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {planoSelecionado
                            ? `Plano ${planos.find(p => p.id === planoSelecionado)?.nome} selecionado!`
                            : 'Selecione um plano para continuar'
                        }
                    </h2>
                    <p className="text-gray-500 mb-6">
                        Cancele quando quiser, sem compromisso ou multa.
                    </p>

                    <button
                        onClick={handleAssinar}
                        disabled={!planoSelecionado}
                        className={`px-10 py-4 rounded-full font-bold text-lg transition-all ${planoSelecionado
                                ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:shadow-xl hover:scale-105 cursor-pointer'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {planoSelecionado ? 'Assinar Agora →' : 'Selecione um plano'}
                    </button>

                    <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            Pagamento seguro
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            Cancele a qualquer momento
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            Suporte dedicado
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Perguntas Frequentes</h2>
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl p-5 shadow-md">
                            <h3 className="font-semibold text-gray-800 mb-2">Como funciona o desconto?</h3>
                            <p className="text-gray-600 text-sm">O desconto é aplicado automaticamente em todos os produtos elegíveis no momento da compra.</p>
                        </div>
                        <div className="bg-white rounded-2xl p-5 shadow-md">
                            <h3 className="font-semibold text-gray-800 mb-2">Posso cancelar a qualquer momento?</h3>
                            <p className="text-gray-600 text-sm">Sim! Você pode cancelar sua assinatura a qualquer momento, sem multas ou taxas adicionais.</p>
                        </div>
                        <div className="bg-white rounded-2xl p-5 shadow-md">
                            <h3 className="font-semibold text-gray-800 mb-2">O frete grátis vale para qualquer pedido?</h3>
                            <p className="text-gray-600 text-sm">Sim, o frete grátis é válido para todos os pedidos, sem valor mínimo de compra.</p>
                        </div>
                    </div>
                </div>

                {/* Botão Voltar */}
                <div className="mt-10 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all shadow-md hover:shadow-lg"
                    >
                        ← Voltar ao Início
                    </button>
                </div>
            </main>
        </div>
    );
}
