import { X, Calendar, ShoppingBag, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
export default function FrequenciaModal({ isOpen, onClose, onConfirmar }) {
    const [tipoCompra, setTipoCompra] = useState('assinatura');
    const [frequenciaSelecionada, setFrequenciaSelecionada] = useState('quinzenal');
    const [diaPreferencial, setDiaPreferencial] = useState('');
    const opcoesFrequencia = [
        { value: 'semanal', label: 'Semanal', descricao: 'Entrega toda semana' },
        { value: 'quinzenal', label: 'Quinzenal', descricao: 'Entrega a cada 15 dias' },
        { value: 'mensal', label: 'Mensal', descricao: 'Entrega uma vez por mês' }
    ];
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
    const handleConfirmar = () => {
        if (tipoCompra === 'unica') {
            onConfirmar({
                tipo: 'unica',
                frequencia: null,
                diaPreferencial: null
            });
        } else {
            onConfirmar({
                tipo: 'assinatura',
                frequencia: frequenciaSelecionada,
                diaPreferencial: diaPreferencial || null
            });
        }
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative animate-fadeIn">
                <div className="sticky top-0 bg-white rounded-t-3xl p-6 pb-4 border-b border-gray-100 z-10">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>

                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">Finalizar Compra</h2>
                    <p className="text-gray-600 text-xs md:text-sm">
                        Escolha como você deseja receber seus produtos
                    </p>
                </div>
                <div className="p-6 pt-4">
                    <div className="grid grid-cols-2 gap-2 md:gap-3 mb-6">
                        <button
                            onClick={() => setTipoCompra('assinatura')}
                            className={`
                                p-3 md:p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 md:gap-2
                                ${tipoCompra === 'assinatura'
                                    ? 'border-green-500 bg-green-50 text-green-700'
                                    : 'border-gray-200 text-gray-600 hover:border-green-300'
                                }
                            `}
                        >
                            <RefreshCw size={20} className="md:w-6 md:h-6" />
                            <span className="font-semibold text-xs md:text-sm">Assinatura</span>
                            <span className="text-[10px] md:text-xs opacity-75">Recorrente</span>
                        </button>
                        <button
                            onClick={() => setTipoCompra('unica')}
                            className={`
                                p-3 md:p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 md:gap-2
                                ${tipoCompra === 'unica'
                                    ? 'border-green-500 bg-green-50 text-green-700'
                                    : 'border-gray-200 text-gray-600 hover:border-green-300'
                                }
                            `}
                        >
                            <ShoppingBag size={20} className="md:w-6 md:h-6" />
                            <span className="font-semibold text-xs md:text-sm">Compra Única</span>
                            <span className="text-[10px] md:text-xs opacity-75">Sem recorrência</span>
                        </button>
                    </div>
                    {tipoCompra === 'assinatura' && (
                        <>
                            <div className="space-y-2 md:space-y-3 mb-6">
                                <h3 className="font-semibold text-sm md:text-base text-gray-700 mb-2">Frequência de entrega</h3>
                                {opcoesFrequencia.map((opcao) => (
                                    <label
                                        key={opcao.value}
                                        className={`
                                            flex items-center gap-3 p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all
                                            ${frequenciaSelecionada === opcao.value
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-green-300'
                                            }
                                        `}
                                    >
                                        <input
                                            type="radio"
                                            name="frequencia"
                                            value={opcao.value}
                                            checked={frequenciaSelecionada === opcao.value}
                                            onChange={(e) => setFrequenciaSelecionada(e.target.value)}
                                            className="w-4 h-4 md:w-5 md:h-5 text-green-600 focus:ring-green-500"
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
                                    Dia preferencial <span className="text-gray-400 font-normal">(opcional)</span>
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="date"
                                        value={diaPreferencial}
                                        onChange={(e) => setDiaPreferencial(e.target.value)}
                                        className="w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                    />
                                </div>
                                <p className="text-[10px] md:text-xs text-gray-500 mt-2">
                                    Selecione o dia que você prefere receber suas entregas
                                </p>
                            </div>
                        </>
                    )}
                    {tipoCompra === 'unica' && (
                        <div className="mb-6 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-xl">
                            <p className="text-xs md:text-sm text-blue-800">
                                ✨ Você receberá seus produtos <strong>uma única vez</strong>. Sem cobranças recorrentes.
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handleConfirmar}
                        className="w-full py-3 bg-gray-900 text-white text-sm md:text-base font-semibold rounded-full hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                    >
                        {tipoCompra === 'unica' ? 'Ir para Pagamento' : 'Continuar'}
                    </button>
                </div>
            </div>
        </div>
    );
}