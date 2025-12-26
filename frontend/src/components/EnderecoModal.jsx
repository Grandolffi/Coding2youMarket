import { X, MapPin, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { meusEnderecos } from '../api/enderecoAPI';
export default function EnderecoModal({ isOpen, onClose, onConfirmar }) {
    const { t } = useTranslation();
    const [enderecoSelecionado, setEnderecoSelecionado] = useState(null);
    const [enderecos, setEnderecos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load user addresses
    useEffect(() => {
        if (isOpen) {
            carregarEnderecos();
        }
    }, [isOpen]);

    const carregarEnderecos = async () => {
        try {
            setLoading(true);
            const response = await meusEnderecos();
            if (response.success) {
                setEnderecos(response.enderecos || []);
            } else {
                toast.error('Erro ao carregar endereços');
            }
        } catch (error) {
            console.error('Erro ao carregar endereços:', error);
            toast.error('Erro ao carregar endereços');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmar = () => {
        if (!enderecoSelecionado) {
            toast.error(t('address.selectAddress'), { duration: 2000 });
            return;
        }
        onConfirmar(enderecoSelecionado);
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
                {/* Botão Fechar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={20} className="text-gray-500" />
                </button>
                {/* Título */}
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('address.title')}</h2>
                <p className="text-gray-600 text-sm mb-6">
                    {t('address.subtitle')}
                </p>
                {/* Lista de Endereços */}
                <div className="space-y-3 mb-6">
                    {enderecos.map((endereco) => (
                        <label
                            key={endereco.id}
                            className={`
                flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                ${enderecoSelecionado?.id === endereco.id
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 hover:border-green-300'
                                }
              `}
                        >
                            <input
                                type="radio"
                                name="endereco"
                                value={endereco.id}
                                checked={enderecoSelecionado?.id === endereco.id}
                                onChange={() => setEnderecoSelecionado(endereco)}
                                className="w-5 h-5 text-green-600 focus:ring-green-500 mt-1"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <MapPin size={16} className="text-gray-500" />
                                    <p className="font-semibold text-gray-800">{endereco.tipo}</p>
                                </div>
                                <p className="text-sm text-gray-600">{endereco.rua}</p>
                                <p className="text-sm text-gray-500">{endereco.cidade}</p>
                                <p className="text-xs text-gray-400 mt-1">CEP: {endereco.cep}</p>
                            </div>
                        </label>
                    ))}
                </div>
                {/* Botão Novo Endereço */}
                <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-green-500 hover:text-green-600 transition-all flex items-center justify-center gap-2 mb-6">
                    <Plus size={20} />
                    {t('address.addNew') || 'Novo endereço'}
                </button>
                {/* Botão Confirmar */}
                <button
                    onClick={handleConfirmar}
                    disabled={!enderecoSelecionado}
                    className={`
            w-full py-3 rounded-full font-semibold text-white transition-all shadow-lg
            ${enderecoSelecionado
                            ? 'bg-gray-900 hover:bg-gray-800 active:scale-95'
                            : 'bg-gray-400 cursor-not-allowed'
                        }
          `}
                >
                    {t('address.confirmButton')}
                </button>
            </div>
        </div>
    );
}