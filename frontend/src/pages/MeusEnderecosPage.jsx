import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Plus, Trash2, Home, Briefcase, Building, X } from 'lucide-react';
import { meusEnderecos, deletarEndereco } from '../api/enderecoAPI';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import toast from 'react-hot-toast';

export default function MeusEnderecosPage() {
    const navigate = useNavigate();
    const [enderecos, setEnderecos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletando, setDeletando] = useState(null);
    const [showModalExcluir, setShowModalExcluir] = useState(false);
    const [enderecoParaExcluir, setEnderecoParaExcluir] = useState(null);

    useEffect(() => {
        const fetchEnderecos = async () => {
            try {
                const response = await meusEnderecos();
                if (response && response.success) {
                    setEnderecos(response.enderecos || []);
                } else {
                    setEnderecos([]);
                }
            } catch (error) {
                console.error('Erro ao buscar endereços:', error);
                setEnderecos([]);
            } finally {
                setLoading(false);
            }
        };
        fetchEnderecos();
    }, []);

    const abrirModalExcluir = (endereco) => {
        setEnderecoParaExcluir(endereco);
        setShowModalExcluir(true);
    };

    const fecharModalExcluir = () => {
        setShowModalExcluir(false);
        setEnderecoParaExcluir(null);
    };

    const confirmarExclusao = async () => {
        if (!enderecoParaExcluir) return;

        const id = enderecoParaExcluir.id;
        setDeletando(id);
        setShowModalExcluir(false);
        const loadingToast = toast.loading('Excluindo endereço...');

        try {
            const response = await deletarEndereco(id);
            if (response.success) {
                setEnderecos(enderecos.filter(e => e.id !== id));
                toast.success('Endereço excluído com sucesso!', { id: loadingToast });
            } else {
                toast.error(response.message || 'Erro ao excluir endereço', { id: loadingToast });
            }
        } catch (error) {
            console.error('Erro ao excluir:', error);
            toast.error('Erro ao excluir endereço', { id: loadingToast });
        } finally {
            setDeletando(null);
            setEnderecoParaExcluir(null);
        }
    };

    const getIconeApelido = (apelido) => {
        const apelidoLower = (apelido || '').toLowerCase();
        if (apelidoLower.includes('casa') || apelidoLower.includes('home')) {
            return <Home size={20} className="text-green-600" />;
        }
        if (apelidoLower.includes('trabalho') || apelidoLower.includes('work') || apelidoLower.includes('empresa')) {
            return <Briefcase size={20} className="text-blue-600" />;
        }
        if (apelidoLower.includes('apartamento') || apelidoLower.includes('apto')) {
            return <Building size={20} className="text-purple-600" />;
        }
        return <MapPin size={20} className="text-gray-600" />;
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <Header />

            {/* Hero Section */}
            <div className="relative h-48 md:h-56 w-full mb-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-500 to-emerald-600" />
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 h-full container mx-auto px-4 md:px-8 flex items-center max-w-7xl pt-20">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-full mr-4 transition-all">
                        <ArrowLeft className="text-white" size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">Meus Endereços</h1>
                        <p className="text-white/80 text-sm mt-1">
                            {loading ? "Carregando..." : `${enderecos.length} endereço(s) cadastrado(s)`}
                        </p>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50 rounded-t-3xl"></div>
            </div>

            <main className="container mx-auto px-4 md:px-8 max-w-3xl">
                {loading ? (
                    <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
                        <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-500">Carregando seus endereços...</p>
                    </div>
                ) : enderecos.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-lg p-8 mb-6 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin size={40} className="text-gray-400" />
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">Nenhum endereço cadastrado</h3>
                        <p className="text-gray-500 text-sm">Adicione um endereço para facilitar suas entregas</p>
                    </div>
                ) : (
                    <div className="space-y-4 mb-6">
                        {enderecos.map((endereco) => (
                            <div
                                key={endereco.id}
                                className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            {getIconeApelido(endereco.apelido)}
                                        </div>
                                        <div className="flex-1">
                                            {endereco.apelido && (
                                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full mb-2">
                                                    {endereco.apelido}
                                                </span>
                                            )}
                                            <p className="font-semibold text-gray-800">
                                                {endereco.rua}, {endereco.numero}
                                            </p>
                                            {endereco.complemento && (
                                                <p className="text-gray-500 text-sm">{endereco.complemento}</p>
                                            )}
                                            <p className="text-gray-500 text-sm">
                                                {endereco.bairro} - {endereco.cidade}/{endereco.estado}
                                            </p>
                                            <p className="text-gray-400 text-xs mt-1">CEP: {endereco.cep}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => abrirModalExcluir(endereco)}
                                        disabled={deletando === endereco.id}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all disabled:opacity-50"
                                        title="Excluir endereço"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                {endereco.principal && (
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Endereço principal
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Botão Adicionar */}
                <button
                    onClick={() => navigate('/novoEndereco', { state: { from: 'meus-enderecos' } })}
                    className="w-full py-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl font-medium transition-all flex items-center justify-center gap-2 hover:border-green-500 hover:text-green-600 mb-6"
                >
                    <Plus size={20} />
                    Adicionar novo endereço
                </button>

                {/* Botão Voltar */}
                <div className="text-center">
                    <button
                        onClick={() => navigate('/perfil')}
                        className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all shadow-md hover:shadow-lg"
                    >
                        ← Voltar ao Perfil
                    </button>
                </div>
            </main>

            {/* Modal de Confirmação de Exclusão */}
            {showModalExcluir && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Header do Modal */}
                        <div className="bg-red-50 p-5 flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <Trash2 className="text-red-600" size={24} />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-bold text-gray-900">Excluir Endereço</h2>
                                <p className="text-sm text-gray-500">Esta ação não pode ser desfeita</p>
                            </div>
                            <button
                                onClick={fecharModalExcluir}
                                className="p-2 hover:bg-red-100 rounded-full transition-all"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Corpo do Modal */}
                        <div className="p-5">
                            <p className="text-gray-700 mb-4">
                                Tem certeza que deseja excluir este endereço?
                            </p>

                            {enderecoParaExcluir && (
                                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                            {getIconeApelido(enderecoParaExcluir.apelido)}
                                        </div>
                                        <div>
                                            {enderecoParaExcluir.apelido && (
                                                <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full mb-1">
                                                    {enderecoParaExcluir.apelido}
                                                </span>
                                            )}
                                            <p className="font-medium text-gray-800 text-sm">
                                                {enderecoParaExcluir.rua}, {enderecoParaExcluir.numero}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                {enderecoParaExcluir.bairro} - {enderecoParaExcluir.cidade}/{enderecoParaExcluir.estado}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer do Modal */}
                        <div className="p-5 pt-0 flex gap-3">
                            <button
                                onClick={fecharModalExcluir}
                                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarExclusao}
                                className="flex-1 py-3 px-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                            >
                                <Trash2 size={18} />
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
