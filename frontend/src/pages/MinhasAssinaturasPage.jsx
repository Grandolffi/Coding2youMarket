import { useState, useEffect } from 'react';
import { ArrowLeft, Crown, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import { minhaAssinatura, assinarPlano, cancelarAssinatura } from '../api/clubMarketAPI';
import toast from 'react-hot-toast';

export default function MinhasAssinaturasPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [assinaturaAtual, setAssinaturaAtual] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processando, setProcessando] = useState(false);
    const [showModalCancelar, setShowModalCancelar] = useState(false);

    const planos = [
        {
            id: 2,
            nome: t('mySubscriptionsPage.plans.entrada.name'),
            preco: 9.90,
            emoji: '🌱',
            desconto: 0,
            cor: 'gray',
            beneficios: t('mySubscriptionsPage.plans.entrada.benefits', { returnObjects: true })
        },
        {
            id: 1,
            nome: t('mySubscriptionsPage.plans.intermediario.name'),
            preco: 19.90,
            emoji: '🌿',
            desconto: 10,
            cor: 'green',
            popular: true,
            beneficios: t('mySubscriptionsPage.plans.intermediario.benefits', { returnObjects: true })
        },
        {
            id: 3,
            nome: t('mySubscriptionsPage.plans.premium.name'),
            preco: 39.90,
            emoji: '👑',
            desconto: 25,
            cor: 'amber',
            beneficios: t('mySubscriptionsPage.plans.premium.benefits', { returnObjects: true })
        }
    ];

    useEffect(() => {
        carregarAssinatura();
    }, []);

    const carregarAssinatura = async () => {
        try {
            const assinatura = await minhaAssinatura();
            setAssinaturaAtual(assinatura);
        } catch (error) {
            console.error('Erro ao carregar assinatura:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPlanoAtual = () => {
        if (!assinaturaAtual) return null;
        return planos.find(p => p.id === assinaturaAtual.id);
    };

    const handleAssinar = async (planoId) => {
        if (assinaturaAtual) {
            toast.error(t('mySubscriptionsPage.toast.alreadySubscribed'));
            return;
        }

        setProcessando(true);
        const loadingToast = toast.loading(t('mySubscriptionsPage.toast.processingSubscription'));

        try {
            const resultado = await assinarPlano(planoId);
            if (resultado.success) {
                toast.success(t('mySubscriptionsPage.toast.subscriptionSuccess'), { id: loadingToast });
                await carregarAssinatura();
            } else {
                toast.error(resultado.message, { id: loadingToast });
            }
        } catch (error) {
            toast.error(t('mySubscriptionsPage.toast.subscriptionError'), { id: loadingToast });
        } finally {
            setProcessando(false);
        }
    };

    const handleCancelar = async () => {
        setShowModalCancelar(false);
        setProcessando(true);
        const loadingToast = toast.loading(t('mySubscriptionsPage.toast.cancelingSubscription'));

        try {
            const resultado = await cancelarAssinatura();
            if (resultado.success) {
                toast.success(t('mySubscriptionsPage.toast.cancelSuccess'), { id: loadingToast });
                setAssinaturaAtual(null);
            } else {
                toast.error(resultado.message, { id: loadingToast });
            }
        } catch (error) {
            toast.error(t('mySubscriptionsPage.toast.cancelError'), { id: loadingToast });
        } finally {
            setProcessando(false);
        }
    };

    const planoAtual = getPlanoAtual();

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <Header />

            <div className="relative h-48 md:h-56 w-full mb-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-500 to-teal-600" />
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 h-full container mx-auto px-4 md:px-8 flex items-center max-w-7xl pt-20">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-full mr-4 transition-all">
                        <ArrowLeft className="text-white" size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{t('mySubscriptionsPage.title')}</h1>
                        <p className="text-white/80 text-sm mt-1">{t('mySubscriptionsPage.subtitle')}</p>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50 rounded-t-3xl"></div>
            </div>

            <main className="container mx-auto px-4 md:px-8 max-w-4xl">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Crown size={20} className="text-green-600" />
                                {t('mySubscriptionsPage.currentSubscription')}
                            </h2>

                            {assinaturaAtual && planoAtual ? (
                                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-6 text-white shadow-xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-4xl">{planoAtual.emoji}</span>
                                            <div>
                                                <h3 className="text-xl font-bold">{planoAtual.nome}</h3>
                                                <p className="text-white/80 text-sm">Club Market</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-bold">R$ {planoAtual.preco.toFixed(2).replace('.', ',')}</p>
                                            <p className="text-white/80 text-sm">{t('mySubscriptionsPage.perMonth')}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {planoAtual.beneficios.map((beneficio, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                                                ✓ {beneficio}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                                        <span className="text-sm text-white/80">
                                            {planoAtual.desconto > 0
                                                ? t('mySubscriptionsPage.discountOnPurchases', { percent: planoAtual.desconto })
                                                : t('mySubscriptionsPage.freeShippingAll')
                                            }
                                        </span>
                                        <button
                                            onClick={() => setShowModalCancelar(true)}
                                            disabled={processando}
                                            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-all"
                                        >
                                            {t('mySubscriptionsPage.cancelSubscription')}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-100 rounded-3xl p-8 text-center">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Crown size={32} className="text-gray-400" />
                                    </div>
                                    <h3 className="font-bold text-gray-800 mb-2">{t('mySubscriptionsPage.noSubscription')}</h3>
                                    <p className="text-gray-500 text-sm mb-4">{t('mySubscriptionsPage.noSubscriptionDesc')}</p>
                                </div>
                            )}
                        </div>

                        <div className="mb-8">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">
                                {assinaturaAtual ? t('mySubscriptionsPage.otherPlans') : t('mySubscriptionsPage.choosePlan')}
                            </h2>

                            <div className="grid md:grid-cols-3 gap-4">
                                {planos.map((plano) => {
                                    const isAtual = planoAtual?.id === plano.id;

                                    return (
                                        <div
                                            key={plano.id}
                                            className={`rounded-2xl p-5 border-2 transition-all flex flex-col ${isAtual
                                                ? 'bg-green-50 border-green-400 opacity-60'
                                                : 'bg-white border-gray-200 hover:border-green-400 hover:shadow-lg'
                                                } ${plano.popular && !isAtual ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
                                        >
                                            <div className="h-8 mb-2">
                                                {plano.popular && !isAtual && (
                                                    <span className="inline-block px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                                                        {t('mySubscriptionsPage.popular')}
                                                    </span>
                                                )}
                                                {isAtual && (
                                                    <span className="inline-block px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                                                        {t('mySubscriptionsPage.currentPlan')}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-center mb-4">
                                                <span className="text-3xl">{plano.emoji}</span>
                                                <h3 className="font-bold text-gray-800 mt-2">{plano.nome}</h3>
                                            </div>

                                            <div className="text-center mb-4">
                                                <span className="text-2xl font-bold text-gray-800">
                                                    R$ {plano.preco.toFixed(2).replace('.', ',')}
                                                </span>
                                                <span className="text-gray-500 text-sm">{t('mySubscriptionsPage.perMonth')}</span>
                                            </div>

                                            <ul className="space-y-2 mb-4 flex-grow">
                                                {plano.beneficios.map((b, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Check size={16} className="text-green-500" />
                                                        {b}
                                                    </li>
                                                ))}
                                            </ul>

                                            <button
                                                onClick={() => !isAtual && handleAssinar(plano.id)}
                                                disabled={processando || assinaturaAtual || isAtual}
                                                className={`w-full py-3 rounded-xl font-semibold transition-all mt-auto ${isAtual
                                                    ? 'bg-green-100 text-green-600 cursor-default'
                                                    : assinaturaAtual
                                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                        : 'bg-green-600 text-white hover:bg-green-700'
                                                    }`}
                                            >
                                                {isAtual ? t('mySubscriptionsPage.activePlan') : processando ? t('mySubscriptionsPage.processing') : t('mySubscriptionsPage.subscribe')}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {assinaturaAtual && (
                                <p className="text-center text-gray-500 text-sm mt-4">
                                    {t('mySubscriptionsPage.changePlanInfo')}
                                </p>
                            )}
                        </div>

                        <div className="text-center">
                            <button
                                onClick={() => navigate('/perfil')}
                                className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all shadow-md"
                            >
                                {t('mySubscriptionsPage.backToProfile')}
                            </button>
                        </div>
                    </>
                )}
            </main>

            {showModalCancelar && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="bg-red-50 p-5 flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <X className="text-red-600" size={24} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">{t('mySubscriptionsPage.cancelModal.title')}</h2>
                                <p className="text-sm text-gray-500">{t('mySubscriptionsPage.cancelModal.irreversible')}</p>
                            </div>
                        </div>

                        <div className="p-5">
                            <p className="text-gray-700 mb-4">
                                {t('mySubscriptionsPage.cancelModal.confirmMessage')}
                            </p>
                            <p className="text-gray-500 text-sm">
                                {t('mySubscriptionsPage.cancelModal.losesBenefits')}
                            </p>
                        </div>

                        <div className="p-5 pt-0 flex gap-3">
                            <button
                                onClick={() => setShowModalCancelar(false)}
                                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                            >
                                {t('mySubscriptionsPage.cancelModal.keepSubscription')}
                            </button>
                            <button
                                onClick={handleCancelar}
                                className="flex-1 py-3 px-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all"
                            >
                                {t('mySubscriptionsPage.cancelModal.cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
