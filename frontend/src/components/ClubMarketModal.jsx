import { X, Crown, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ClubMarketModal({ isOpen, onClose }) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    if (!isOpen) return null;

    const handleAssinar = () => {
        onClose();
        navigate('/club-market');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            {/* Modal compacto e chamativo */}
            <div className="relative w-full max-w-sm bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 rounded-3xl shadow-2xl overflow-hidden">
                {/* Badge "NOVO" piscante */}
                <div className="absolute top-3 right-3 z-10">
                    <div className="bg-yellow-400 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        {t('club.newBadge')}
                    </div>
                </div>

                {/* Header impactante */}
                <div className="relative p-6 pb-4 text-white text-center">
                    <div className="flex justify-center mb-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-50"></div>
                            <Crown size={48} className="relative text-yellow-300 drop-shadow-lg" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-black mb-1 drop-shadow-md">
                        {t('club.modalTitle')}
                    </h2>
                    <p className="text-sm text-emerald-50 font-medium">
                        {t('club.modalSubtitle')}
                    </p>
                </div>

                {/* Benefícios destacados */}
                <div className="bg-white/95 backdrop-blur-sm rounded-t-3xl p-5 space-y-3">
                    {/* Benefit 1 */}
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border-2 border-emerald-200">
                        <Zap size={20} className="text-emerald-600 flex-shrink-0" />
                        <p className="text-sm font-bold text-emerald-900">
                            {t('club.benefit1')}
                        </p>
                    </div>

                    {/* Benefit 2 */}
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border-2 border-emerald-200">
                        <Sparkles size={20} className="text-emerald-600 flex-shrink-0" />
                        <p className="text-sm font-bold text-emerald-900">
                            {t('club.benefit2')}
                        </p>
                    </div>

                    {/* Pricing */}
                    <div className="pt-2 text-center">
                        <p className="text-xs text-gray-500 mb-2">{t('club.fromPrice')}</p>
                        <div className="flex justify-center gap-2">
                            <span className="px-3 py-1.5 bg-emerald-100 rounded-lg text-sm font-bold text-emerald-700">
                                R$ 9,90
                            </span>
                            <span className="px-3 py-1.5 bg-emerald-500 rounded-lg text-sm font-bold text-white shadow-md">
                                R$ 19,90
                            </span>
                            <span className="px-3 py-1.5 bg-emerald-100 rounded-lg text-sm font-bold text-emerald-700">
                                R$ 39,90
                            </span>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            {t('club.btnLater')}
                        </button>
                        <button
                            onClick={handleAssinar}
                            className="flex-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                        >
                            {t('club.btnSee')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
