import { X, Calendar, ShoppingBag, RefreshCw, MapPin, Home, Briefcase, Building, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { meusEnderecos } from '../api/enderecoAPI';

export default function FrequenciaModal({ isOpen, onClose, onConfirmar }) {
    const { t } = useTranslation();
    const [tipoCompra, setTipoCompra] = useState('assinatura');
    const [frequenciaSelecionada, setFrequenciaSelecionada] = useState('quinzenal');
    const [diaPreferencial, setDiaPreferencial] = useState('');
    const [erroData, setErroData] = useState('');
    const [enderecos, setEnderecos] = useState([]);
    const [enderecoSelecionado, setEnderecoSelecionado] = useState(null);
    const [loadingEnderecos, setLoadingEnderecos] = useState(true);
    const [showEnderecoModal, setShowEnderecoModal] = useState(false);

    const opcoesFrequencia = [
        { value: 'semanal', label: t('frequency.weekly'), descricao: t('frequency.weeklyDesc') },
        { value: 'quinzenal', label: t('frequency.biweekly'), descricao: t('frequency.biweeklyDesc') },
        { value: 'mensal', label: t('frequency.monthly'), descricao: t('frequency.monthlyDesc') }
    ];

    // Buscar endereços do usuário e pré-selecionar o principal
    useEffect(() => {
        if (isOpen) {
            const fetchEnderecos = async () => {
                setLoadingEnderecos(true);
                try {
                    const response = await meusEnderecos();
                    if (response.success && response.enderecos) {
                        setEnderecos(response.enderecos);
                        // Pré-selecionar o endereço principal ou o primeiro
                        const principal = response.enderecos.find(e => e.principal);
                        if (principal) {
                            setEnderecoSelecionado(principal);
                        } else if (response.enderecos.length > 0) {
                            setEnderecoSelecionado(response.enderecos[0]);
                        }
                    }
                } catch (error) {
                    console.error('Erro ao buscar endereços:', error);
                } finally {
                    setLoadingEnderecos(false);
                }
            };
            fetchEnderecos();
        }
    }, [isOpen]);

    // Bloquear scroll do body quando modal aberto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const getIconeApelido = (apelido) => {
        const apelidoLower = (apelido || '').toLowerCase();
        if (apelidoLower.includes('casa') || apelidoLower.includes('home')) {
            return <Home size={18} className="text-verde-salvia-600" />;
        }
        if (apelidoLower.includes('trabalho') || apelidoLower.includes('work') || apelidoLower.includes('empresa')) {
            return <Briefcase size={18} className="text-blue-600" />;
        }
        if (apelidoLower.includes('apartamento') || apelidoLower.includes('apto')) {
            return <Building size={18} className="text-purple-600" />;
        }
        return <MapPin size={18} className="text-gray-600" />;
    };

    const handleConfirmar = () => {
        if (tipoCompra === 'unica') {
            onConfirmar({
                tipo: 'unica',
                frequencia: null,
                diaPreferencial: null,
                endereco: enderecoSelecionado || null
            });
        } else {
            onConfirmar({
                tipo: 'assinatura',
                frequencia: frequenciaSelecionada,
                diaPreferencial: diaPreferencial || null,
                endereco: enderecoSelecionado || null
            });
        }
    };

    const handleSelecionarEndereco = (endereco) => {
        setEnderecoSelecionado(endereco);
        setShowEnderecoModal(false);
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative animate-fadeIn">
                    <div className="sticky top-0 bg-white rounded-t-3xl p-6 pb-4 border-b border-gray-100 z-10">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>

                        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">{t('frequency.title')}</h2>
                        <p className="text-gray-600 text-xs md:text-sm">
                            {t('frequency.subtitle')}
                        </p>
                    </div>
                    <div className="p-6 pt-4">
                        <div className="grid grid-cols-2 gap-2 md:gap-3 mb-6">
                            <button
                                onClick={() => setTipoCompra('assinatura')}
                                className={`
                                    p-3 md:p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 md:gap-2
                                    ${tipoCompra === 'assinatura'
                                        ? 'border-verde-salvia bg-verde-salvia-50 text-verde-petroleo'
                                        : 'border-gray-200 text-gray-600 hover:border-verde-salvia-300'
                                    }
                                `}
                            >
                                <RefreshCw size={20} className="md:w-6 md:h-6" />
                                <span className="font-semibold text-xs md:text-sm">{t('frequency.subscription')}</span>
                                <span className="text-[10px] md:text-xs opacity-75">{t('frequency.recurring')}</span>
                            </button>
                            <button
                                onClick={() => setTipoCompra('unica')}
                                className={`
                                    p-3 md:p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 md:gap-2
                                    ${tipoCompra === 'unica'
                                        ? 'border-verde-salvia bg-verde-salvia-50 text-verde-petroleo'
                                        : 'border-gray-200 text-gray-600 hover:border-verde-salvia-300'
                                    }
                                `}
                            >
                                <ShoppingBag size={20} className="md:w-6 md:h-6" />
                                <span className="font-semibold text-xs md:text-sm">{t('frequency.oneTimePurchase')}</span>
                                <span className="text-[10px] md:text-xs opacity-75">{t('frequency.noRecurring')}</span>
                            </button>
                        </div>

                        {/* Botão para escolher endereço */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-sm md:text-base text-gray-700 mb-3 flex items-center gap-2">
                                <MapPin size={18} className="text-verde-salvia-600" />
                                {t('frequency.deliveryAddress')}
                            </h3>

                            {loadingEnderecos ? (
                                <div className="p-4 text-center text-gray-500 text-sm">
                                    <div className="animate-spin w-6 h-6 border-2 border-verde-salvia border-t-transparent rounded-full mx-auto mb-2"></div>
                                    {t('frequency.loadingAddresses')}
                                </div>
                            ) : enderecos.length === 0 ? (
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
                                    <p className="text-sm text-yellow-800">{t('frequency.noAddresses')}</p>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowEnderecoModal(true)}
                                    className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-verde-salvia-300 transition-all flex items-center gap-3 text-left"
                                >
                                    {enderecoSelecionado ? (
                                        <>
                                            <div className="w-10 h-10 bg-verde-salvia-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                {getIconeApelido(enderecoSelecionado.apelido)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {enderecoSelecionado.apelido && (
                                                        <span className="text-xs font-semibold text-verde-petroleo bg-verde-salvia-100 px-2 py-0.5 rounded-full">
                                                            {enderecoSelecionado.apelido}
                                                        </span>
                                                    )}
                                                    {enderecoSelecionado.principal && (
                                                        <span className="text-[10px] font-medium text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                                                            {t('frequency.primaryAddress')}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-800 font-medium truncate">
                                                    {enderecoSelecionado.rua}, {enderecoSelecionado.numero}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {enderecoSelecionado.bairro} - {enderecoSelecionado.cidade}/{enderecoSelecionado.estado}
                                                </p>
                                            </div>
                                            <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <MapPin size={18} className="text-gray-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600">{t('frequency.chooseAddress')}</p>
                                            </div>
                                            <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {tipoCompra === 'assinatura' && (
                            <>
                                <div className="space-y-2 md:space-y-3 mb-6">
                                    <h3 className="font-semibold text-sm md:text-base text-gray-700 mb-2">{t('frequency.deliveryFrequency')}</h3>
                                    {opcoesFrequencia.map((opcao) => (
                                        <label
                                            key={opcao.value}
                                            className={`
                                                flex items-center gap-3 p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all
                                                ${frequenciaSelecionada === opcao.value
                                                    ? 'border-verde-salvia bg-verde-salvia-50'
                                                    : 'border-gray-200 hover:border-verde-salvia-300'
                                                }
                                            `}
                                        >
                                            <input
                                                type="radio"
                                                name="frequencia"
                                                value={opcao.value}
                                                checked={frequenciaSelecionada === opcao.value}
                                                onChange={(e) => setFrequenciaSelecionada(e.target.value)}
                                                className="w-4 h-4 md:w-5 md:h-5 text-verde-salvia-600 focus:ring-verde-salvia"
                                            />
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm md:text-base text-gray-800">{opcao.label}</p>
                                                <p className="text-[10px] md:text-xs text-gray-500">{opcao.descricao}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                                        {t('frequency.preferredDay')} <span className="text-gray-400 font-normal">{t('frequency.optional')}</span>
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="date"
                                            value={diaPreferencial}
                                            onChange={(e) => {
                                                const dataSelecionada = e.target.value;
                                                const hoje = new Date().toISOString().split('T')[0];
                                                if (dataSelecionada && dataSelecionada < hoje) {
                                                    setErroData('A data não pode ser anterior à data atual.');
                                                    setDiaPreferencial('');
                                                } else {
                                                    setErroData('');
                                                    setDiaPreferencial(dataSelecionada);
                                                }
                                            }}
                                            min={new Date().toISOString().split('T')[0]}
                                            className={`w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 text-xs md:text-sm border rounded-xl focus:ring-2 focus:ring-verde-salvia focus:border-transparent outline-none ${erroData ? 'border-red-400' : 'border-gray-300'}`}
                                        />
                                    </div>
                                    {erroData ? (
                                        <p className="text-[10px] md:text-xs text-red-500 mt-2">
                                            ⚠️ {erroData}
                                        </p>
                                    ) : (
                                        <p className="text-[10px] md:text-xs text-gray-500 mt-2">
                                            {t('frequency.preferredDayDesc')}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                        {tipoCompra === 'unica' && (
                            <div className="mb-6 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                <p className="text-xs md:text-sm text-blue-800" dangerouslySetInnerHTML={{ __html: t('frequency.oneTimeInfo') }}></p>
                            </div>
                        )}

                        <button
                            onClick={handleConfirmar}
                            disabled={enderecos.length > 0 && !enderecoSelecionado}
                            className="w-full py-3 bg-gray-900 text-white text-sm md:text-base font-semibold rounded-full hover:bg-gray-800 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {tipoCompra === 'unica' ? t('payment.confirmPayment') : t('common.next')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de seleção de endereço */}
            {showEnderecoModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[80vh] overflow-hidden animate-fadeIn">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800">{t('frequency.selectAddress')}</h3>
                            <button
                                onClick={() => setShowEnderecoModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={18} className="text-gray-500" />
                            </button>
                        </div>
                        <div className="p-4 space-y-2 overflow-y-auto max-h-[60vh]">
                            {enderecos.map((endereco) => (
                                <button
                                    key={endereco.id}
                                    onClick={() => handleSelecionarEndereco(endereco)}
                                    className={`
                                        w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 text-left
                                        ${enderecoSelecionado?.id === endereco.id
                                            ? 'border-verde-salvia bg-verde-salvia-50'
                                            : 'border-gray-200 hover:border-verde-salvia-300'
                                        }
                                    `}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${enderecoSelecionado?.id === endereco.id ? 'bg-green-200' : 'bg-gray-100'
                                        }`}>
                                        {getIconeApelido(endereco.apelido)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {endereco.apelido && (
                                                <span className="text-xs font-semibold text-verde-petroleo bg-verde-salvia-100 px-2 py-0.5 rounded-full">
                                                    {endereco.apelido}
                                                </span>
                                            )}
                                            {endereco.principal && (
                                                <span className="text-[10px] font-medium text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                                                    {t('frequency.primaryAddress')}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-800 font-medium truncate">
                                            {endereco.rua}, {endereco.numero}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {endereco.bairro} - {endereco.cidade}/{endereco.estado}
                                        </p>
                                    </div>
                                    {enderecoSelecionado?.id === endereco.id && (
                                        <div className="w-6 h-6 bg-verde-salvia rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
