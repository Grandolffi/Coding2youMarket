import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Calendar, DollarSign, ChevronRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import Header from "../components/Header";
import { meusPedidos, cancelarPedido, pausarPedido } from "../api/pedidosAPI";
import { getUsuarioId } from "../api/auth";

export default function MeusPedidosPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processando, setProcessando] = useState(false);

    useEffect(() => {
        const carregarPedidos = async () => {
            const usuarioId = getUsuarioId();
            if (!usuarioId) {
                navigate('/login');
                return;
            }
            const dados = await meusPedidos();
            setPedidos(dados || []);
            setLoading(false);
        };

        carregarPedidos();
    }, [navigate]);

    const getStatusColor = (status) => {
        const colors = {
            'ativa': 'bg-green-100 text-green-700 border-green-200',
            'pausada': 'bg-yellow-100 text-yellow-700 border-yellow-200',
            'cancelada': 'bg-red-100 text-red-700 border-red-200',
            'entregue': 'bg-blue-100 text-blue-700 border-blue-200',
            'pendente': 'bg-orange-100 text-orange-700 border-orange-200',
        };
        return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const getStatusLabel = (status) => {
        const labels = {
            'ativa': t('orders.statusActive') || 'Ativa',
            'pausada': t('orders.statusPaused') || 'Pausada',
            'cancelada': t('orders.statusCancelled') || 'Cancelada',
            'entregue': t('orders.statusDelivered') || 'Entregue',
            'pendente': t('orders.statusPending') || 'Pendente',
        };
        return labels[status?.toLowerCase()] || status || t('orders.statusUnknown') || 'Desconhecido';
    };

    // Separar pedidos Club Market dos normais
    const pedidosClub = pedidos.filter(p => p.frequencia === 'club' && p.status !== 'cancelada');
    const pedidosNormais = pedidos.filter(p => p.frequencia !== 'club' && p.status !== 'cancelada');

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatCurrency = (value) => {
        if (!value && value !== 0) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const handleCancelarPedido = async (pedidoId) => {
        if (!confirm('Tem certeza que deseja cancelar este pedido?')) {
            return;
        }

        setProcessando(true);
        const loadingToast = toast.loading('Cancelando pedido...');

        try {
            const response = await cancelarPedido(pedidoId);

            if (response.success) {
                toast.success('Pedido cancelado com sucesso!', { id: loadingToast });
                // Recarregar pedidos
                const dados = await meusPedidos();
                setPedidos(dados || []);
            } else {
                toast.error(response.message || 'Erro ao cancelar pedido', { id: loadingToast });
            }
        } catch (error) {
            console.error('Erro ao cancelar:', error);
            toast.error('Erro ao cancelar pedido', { id: loadingToast });
        } finally {
            setProcessando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <Header />

            {/* Hero Section */}
            <div className="relative h-64 md:h-80 w-full mb-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-500 to-emerald-600" />
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 h-full flex flex-col items-center justify-center pt-16">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                        <span className="text-4xl">📦</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white drop-shadow-lg">{t('orders.title')}</h1>
                    <p className="text-white/80 text-sm mt-2">
                        {loading ? t('common.loading') : `${pedidos.length} ${pedidos.length === 1 ? t('orders.orderSingular') || 'pedido' : t('orders.ordersPlural') || 'pedidos'}`}
                    </p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50 rounded-t-3xl"></div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 md:px-8 max-w-4xl -mt-4">
                {loading ? (
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-500">Carregando seus pedidos...</p>
                    </div>
                ) : pedidos.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-5xl">🛒</span>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">{t('orders.empty')}</h2>
                        <p className="text-gray-500 mb-6">{t('orders.emptyDesc')}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl"
                        >
                            {t('home.continueShopping') || t('cart.continueShopping')}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Seção Club Market */}
                        {pedidosClub.length > 0 && (
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">⭐</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-purple-900">{t('nav.clubMarket')}</h2>
                                        <p className="text-sm text-purple-700">{t('orders.yourPremiumSubscription')}</p>
                                    </div>
                                </div>
                                {pedidosClub.map((club) => (
                                    <div key={club.id} className="bg-white rounded-xl p-5 mt-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-sm text-gray-500">{t('orders.plan')}</p>
                                                <p className="font-bold text-gray-900 text-lg">
                                                    {formatCurrency(club.valorfinal)} {t('orders.perMonth')}
                                                </p>
                                            </div>
                                            <span className={`px - 4 py - 1.5 rounded - full text - sm font - semibold border ${getStatusColor(club.status)} `}>
                                                {getStatusLabel(club.status)}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-gray-500">{t('orders.start')}</p>
                                                <p className="font-medium text-gray-900">{formatDate(club.datainicio)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">{t('orders.nextCharge')}</p>
                                                <p className="font-medium text-gray-900">{formatDate(club.dataproximacobranca)}</p>
                                            </div>
                                        </div>
                                        {club.status === 'ativa' && (
                                            <button
                                                onClick={() => handleCancelarPedido(club.id)}
                                                disabled={processando}
                                                className="w-full py-2.5 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border border-red-200"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                {t('orders.cancelClub')}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Pedidos Normais */}
                        {pedidosNormais.length > 0 && (
                            <>
                                <h2 className="text-xl font-bold text-gray-800">{t('orders.title')}</h2>
                                <div className="space-y-6">
                                    {pedidosNormais.map((pedido, index) => (
                                        <div
                                            key={pedido.id || index}
                                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                                        >
                                            {/* Header do Card */}
                                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-4 border-b border-gray-200">
                                                <div className="flex flex-wrap justify-between items-center gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                                            <span className="text-lg">📋</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">{t('orders.order')}</p>
                                                            <p className="font-bold text-gray-800">#{pedido.id}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`px - 4 py - 1.5 rounded - full text - sm font - semibold border ${getStatusColor(pedido.status)} `}>
                                                        {getStatusLabel(pedido.status)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Body do Card */}
                                            <div className="p-5">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('orders.orderDate')}</p>
                                                        <p className="font-semibold text-gray-800">{formatDate(pedido.datainicio || pedido.createdat)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('orders.nextDelivery')}</p>
                                                        <p className="font-semibold text-gray-800">{formatDate(pedido.dataproximaentrega)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('orders.nextCharge')}</p>
                                                        <p className="font-semibold text-gray-800">{formatDate(pedido.dataproximacobranca)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('orders.totalValue')}</p>
                                                        <p className="font-bold text-green-600 text-lg">{formatCurrency(pedido.valorfinal || pedido.valortotal || 0)}</p>
                                                    </div>
                                                </div>

                                                {/* Itens do Pedido */}
                                                {pedido.itens && pedido.itens.length > 0 && (
                                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Itens do Pedido</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {pedido.itens.slice(0, 5).map((item, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700"
                                                                >
                                                                    {item.quantidade}x {item.nome || item.produto?.nome || `Item ${idx + 1} `}
                                                                </span>
                                                            ))}
                                                            {pedido.itens.length > 5 && (
                                                                <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                                                                    +{pedido.itens.length - 5} itens
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Botão Cancelar - Só para assinaturas recorrentes */}
                                            {(pedido.status === 'ativa' || pedido.status === 'pausada') &&
                                                (pedido.frequencia === 'semanal' || pedido.frequencia === 'mensal') && (
                                                    <div className="px-5 pb-5">
                                                        <button
                                                            onClick={() => handleCancelarPedido(pedido.id)}
                                                            disabled={processando}
                                                            className="w-full py-2.5 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                            {processando ? 'Cancelando...' : 'Cancelar Assinatura'}
                                                        </button>
                                                    </div>
                                                )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Botão Voltar */}
                <div className="mt-8 text-center">
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
