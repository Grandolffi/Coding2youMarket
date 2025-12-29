import { useTranslation } from 'react-i18next';

export default function SumarioOrdem({ resumo, onCriarAssinatura, loading }) {
    const { t } = useTranslation();
    // Valores vêm do backend via API (função fictícia por enquanto)
    const subtotal = resumo?.subtotal || 0;
    const descontoClub = resumo?.descontoClub || 0;
    const frete = resumo?.frete || 0;
    const total = resumo?.total || 0;
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6">{t('cart.orderSummary') || t('payment.orderSummary')}</h2>
            {/* Detalhes do Pedido */}
            <div className="space-y-3 mb-6">
                {/* Subtotal */}
                <div className="flex justify-between text-gray-600">
                    <span>{t('cart.subtotal')}</span>
                    <span className="font-semibold">
                        R$ {subtotal.toFixed(2).replace('.', ',')}
                    </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between text-gray-600">
                    <span>{t('cart.shipping')}</span>
                    <span className="font-semibold">
                        R$ {frete.toFixed(2).replace('.', ',')}
                    </span>
                </div>

                {/* Linha divisória leve */}
                <div className="h-px bg-gray-200 my-2"></div>

                {/* Total SEM desconto (mais apelativo!) */}
                <div className="flex justify-between text-gray-700 font-medium">
                    <span>Subtotal</span>
                    <span className={descontoClub > 0 ? 'line-through text-gray-400' : ''}>
                        R$ {(subtotal + frete).toFixed(2).replace('.', ',')}
                    </span>
                </div>

                {/* Club Discount - DESTAQUE! */}
                {descontoClub > 0 && (
                    <div className="flex justify-between items-center bg-verde-salvia-50 -mx-2 px-2 py-2 rounded-lg">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">⭐</span>
                            <span className="text-verde-petroleo font-medium">{t('cart.clubDiscount')}</span>
                        </div>
                        <span className="font-bold text-verde-petroleo">
                            - R$ {descontoClub.toFixed(2).replace('.', ',')}
                        </span>
                    </div>
                )}

                {/* Linha divisória forte */}
                <div className="h-px bg-gray-300 my-3"></div>

                {/* Total FINAL */}
                <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>{t('cart.total')}</span>
                    <span className="text-verde-petroleo">
                        R$ {total.toFixed(2).replace('.', ',')}
                    </span>
                </div>

                {/* Badge de economia */}
                {descontoClub > 0 && (
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-verde-salvia-300 rounded-lg p-3 text-center">
                        <p className="text-sm text-green-800">
                            💰 <strong>Você economizou R$ {descontoClub.toFixed(2).replace('.', ',')}</strong> com o Club+!
                        </p>
                    </div>
                )}
            </div>
            {/* Botão de Criar Assinatura */}
            <button
                onClick={onCriarAssinatura}
                disabled={loading || total === 0}
                className={`
          w-full py-3 rounded-full font-semibold text-white transition-all shadow-md
          ${loading || total === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gray-900 hover:bg-gray-800 active:scale-95'
                    }
        `}
            >
                {loading ? t('common.loading') : `${t('cart.checkout')} R$ ${total.toFixed(2).replace('.', ',')}`}
            </button>
        </div>
    );
}

