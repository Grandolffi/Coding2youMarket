import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { assinarPlano, minhaAssinatura } from "../api/clubMarketAPI";
import Header from "../components/Header";
import toast from "react-hot-toast";


export default function ClubMarketPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [planoSelecionado, setPlanoSelecionado] = useState(null);
    const [clubAtivo, setClubAtivo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [assinando, setAssinando] = useState(false);

    useEffect(() => {
        const verificarClubAtivo = async () => {
            try {
                const assinatura = await minhaAssinatura();
                setClubAtivo(assinatura);
            } catch (error) {
                console.error('Erro ao verificar club:', error);
            } finally {
                setLoading(false);
            }
        };
        verificarClubAtivo();
    }, []);

    // IDs dos planos no banco de dados
    const planos = [
        {
            id: 2, // ID no banco
            nome: t('clubMarketPage.plans.entrada.name'),
            preco: 9.90,
            emoji: '🌱',
            desconto: 0,
            freteGratis: true,
            cor: 'gray',
            beneficios: [
                { texto: t('clubMarketPage.plans.entrada.benefits.freeShipping'), ativo: true },
                { texto: t('clubMarketPage.plans.entrada.benefits.noDiscount'), ativo: false },
                { texto: t('clubMarketPage.plans.entrada.benefits.noPrioritySupport'), ativo: false },
            ]
        },
        {
            id: 1, // ID no banco
            nome: t('clubMarketPage.plans.intermediario.name'),
            preco: 19.90,
            emoji: '🌿',
            desconto: 10,
            freteGratis: true,
            cor: 'green',
            popular: true,
            beneficios: [
                { texto: t('clubMarketPage.plans.intermediario.benefits.freeShipping'), ativo: true },
                { texto: t('clubMarketPage.plans.intermediario.benefits.discount'), ativo: true },
                { texto: t('clubMarketPage.plans.intermediario.benefits.prioritySupport'), ativo: true },
            ]
        },
        {
            id: 3, // ID no banco
            nome: t('clubMarketPage.plans.premium.name'),
            preco: 39.90,
            emoji: '👑',
            desconto: 25,
            freteGratis: true,
            cor: 'amber',
            beneficios: [
                { texto: t('clubMarketPage.plans.premium.benefits.freeShipping'), ativo: true },
                { texto: t('clubMarketPage.plans.premium.benefits.discount'), ativo: true },
                { texto: t('clubMarketPage.plans.premium.benefits.prioritySupport'), ativo: true },
                { texto: t('clubMarketPage.plans.premium.benefits.earlyAccess'), ativo: true },
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

    const handleAssinar = async () => {
        if (!planoSelecionado) return;

        setAssinando(true);
        const loadingToast = toast.loading('Processando assinatura...');

        try {
            const resultado = await assinarPlano(planoSelecionado);

            if (resultado.success) {
                toast.success('Assinatura realizada com sucesso! 🎉', { id: loadingToast });
                // Atualiza o estado local
                const plano = planos.find(p => p.id === planoSelecionado);
                setClubAtivo({ id: planoSelecionado, valormensal: plano.preco });
            } else {
                toast.error(resultado.message || 'Erro ao assinar', { id: loadingToast });
            }
        } catch (error) {
            console.error('Erro ao assinar:', error);
            toast.error('Erro ao processar assinatura', { id: loadingToast });
        } finally {
            setAssinando(false);
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
                    <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg text-center">{t('clubMarketPage.title')}</h1>
                    <p className="text-white/80 text-lg mt-3 text-center px-4 max-w-xl">
                        {t('clubMarketPage.subtitle')}
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
                                className={`${styles.bg} rounded-3xl p-6 border-2 ${styles.border} cursor-pointer transition-all duration-300 hover:shadow-xl ${planoSelecionado === plano.id ? 'shadow-xl scale-[1.02]' : 'hover:scale-[1.01]'} relative flex flex-col`}
                            >
                                {/* Badge Popular */}
                                {plano.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                                        {t('clubMarketPage.mostPopular')}
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
                                    <span className="text-gray-500 text-sm">{t('clubMarketPage.perMonth')}</span>
                                </div>

                                {/* Badge Desconto */}
                                <div className="text-center mb-6">
                                    <span className={`inline-block px-4 py-2 ${styles.badge} rounded-full text-sm font-bold`}>
                                        {t('clubMarketPage.discount', { percent: plano.desconto })}
                                    </span>
                                </div>

                                {/* Benefícios - flex-grow para empurrar conteúdo abaixo para baixo */}
                                <ul className="space-y-3 flex-grow">
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
                            ? t('clubMarketPage.cta.planSelected', { name: planos.find(p => p.id === planoSelecionado)?.nome })
                            : t('clubMarketPage.cta.selectPlan')
                        }
                    </h2>
                    <p className="text-gray-500 mb-6">
                        {t('clubMarketPage.cta.cancelInfo')}
                    </p>

                    <button
                        onClick={handleAssinar}
                        disabled={!planoSelecionado || assinando || clubAtivo}
                        className={`px-10 py-4 rounded-full font-bold text-lg transition-all ${planoSelecionado && !assinando && !clubAtivo
                            ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:shadow-xl hover:scale-105 cursor-pointer'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {assinando ? t('clubMarketPage.cta.processing') : planoSelecionado ? t('clubMarketPage.cta.subscribeNow') : t('clubMarketPage.cta.selectPlanBtn')}
                    </button>

                    <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            {t('clubMarketPage.cta.securePayment')}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            {t('clubMarketPage.cta.cancelAnytime')}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            {t('clubMarketPage.cta.dedicatedSupport')}
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('clubMarketPage.faq.title')}</h2>
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl p-5 shadow-md">
                            <h3 className="font-semibold text-gray-800 mb-2">{t('clubMarketPage.faq.question1')}</h3>
                            <p className="text-gray-600 text-sm">{t('clubMarketPage.faq.answer1')}</p>
                        </div>
                        <div className="bg-white rounded-2xl p-5 shadow-md">
                            <h3 className="font-semibold text-gray-800 mb-2">{t('clubMarketPage.faq.question2')}</h3>
                            <p className="text-gray-600 text-sm">{t('clubMarketPage.faq.answer2')}</p>
                        </div>
                        <div className="bg-white rounded-2xl p-5 shadow-md">
                            <h3 className="font-semibold text-gray-800 mb-2">{t('clubMarketPage.faq.question3')}</h3>
                            <p className="text-gray-600 text-sm">{t('clubMarketPage.faq.answer3')}</p>
                        </div>
                    </div>
                </div>

                {/* Botão Voltar */}
                <div className="container mx-auto px-4 md:px-8 max-w-6xl mb-8">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
                        </div>
                    ) : clubAtivo ? (
                        <div className="bg-purple-50 border-2 border-purple-300 rounded-2xl p-6 text-center">
                            <div className="text-5xl mb-4">⭐</div>
                            <h3 className="text-2xl font-bold text-purple-900 mb-2">
                                {t('clubMarketPage.alreadyMember.title')}
                            </h3>
                            <p className="text-purple-700 mb-6">
                                {t('clubMarketPage.alreadyMember.currentPlan')} <strong>R$ {Number(clubAtivo.valormensal || 0).toFixed(2).replace('.', ',')}{t('clubMarketPage.alreadyMember.perMonth')}</strong>
                            </p>
                            <button
                                onClick={() => navigate('/perfil')}
                                className="px-8 py-4 bg-purple-600 text-white font-bold text-lg rounded-full hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                            >
                                {t('clubMarketPage.alreadyMember.manageSubscription')}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAssinar}
                            disabled={!planoSelecionado || assinando}
                            className={`w-full md:w-auto px-12 py-5 font-bold text-xl rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95 ${planoSelecionado && !assinando
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {assinando ? '⏳ ' + t('clubMarketPage.cta.processing') : planoSelecionado ? t('clubMarketPage.subscribeBtn') : t('clubMarketPage.cta.selectPlanBtn')}
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}
