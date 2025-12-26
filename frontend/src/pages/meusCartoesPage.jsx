import { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Plus, ChevronLeft, ChevronRight, Trash2, Edit2, Check, X } from 'lucide-react';
import { meusCartoes, adicionarCartao, deletarCartao } from '../api/cartaoAPI';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import toast from 'react-hot-toast';

// Helper to mask card number, showing only last 4 digits
const maskNumber = (numero, ultimos4) => {
    // Se tem ultimos4digitos do backend, usa esse
    if (ultimos4) return `•••• •••• •••• ${ultimos4}`;
    if (!numero) return '•••• •••• •••• ••••';
    // Remove espaços e pega últimos 4
    const limpo = numero.replace(/\s/g, '');
    if (limpo.length >= 4) {
        return `•••• •••• •••• ${limpo.slice(-4)}`;
    }
    const parts = numero.split(' ');
    return parts
        .map((p, i) => (i === parts.length - 1 ? p : '****'))
        .join(' ');
};

// Helper para obter nome do cartão (compatível com backend e frontend)
const getNome = (cartao) => cartao.nome || cartao.nomeimpresso || cartao.nomeImpresso || '';
const getNumeroDisplay = (cartao) => cartao.numero || (cartao.ultimos4digitos ? `•••• •••• •••• ${cartao.ultimos4digitos}` : '');
const getValidade = (cartao) => cartao.validade || '--/--';

export default function MeusCartoesPage() {
    const navigate = useNavigate();
    const [cartoes, setCartoes] = useState([]);
    const [cartaoAtivo, setCartaoAtivo] = useState(0);
    const [adicionandoCartao, setAdicionandoCartao] = useState(false);
    const [novoCartao, setNovoCartao] = useState({
        numero: '',
        nome: '',
        validade: '',
        cvv: '',
        bandeira: 'Mastercard'
    });
    const [loading, setLoading] = useState(true);

    const handleProximoCartao = () => {
        setCartaoAtivo((prev) => (prev + 1) % cartoes.length);
    };

    const handleCartaoAnterior = () => {
        setCartaoAtivo((prev) => (prev - 1 + cartoes.length) % cartoes.length);
    };

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await meusCartoes();
                if (response && response.success) {
                    setCartoes(response.cartoes || []);
                } else {
                    setCartoes([]);
                }
            } catch (error) {
                console.error('Erro ao buscar cartões:', error);
                setCartoes([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCards();
    }, []);


    const handleAdicionarCartao = async () => {
        if (novoCartao.numero && novoCartao.nome && novoCartao.validade && novoCartao.cvv) {
            const loadingToast = toast.loading('Salvando cartão...');
            try {
                // Prepara dados no formato esperado pelo backend
                const numeroLimpo = novoCartao.numero.replace(/\s/g, '');
                const dadosParaEnviar = {
                    tokenCartao: `tok_${Date.now()}`, // Token simulado (em produção seria do gateway de pagamento)
                    bandeira: novoCartao.bandeira,
                    ultimos4Digitos: numeroLimpo.slice(-4),
                    nomeImpresso: novoCartao.nome,
                    principal: cartoes.length === 0, // Primeiro cartão é principal
                    isDebito: false
                };

                const response = await adicionarCartao(dadosParaEnviar);
                if (response.success) {
                    // Adiciona o cartão retornado ou cria um objeto para exibição
                    const cartaoCriado = response.cartao || {
                        id: response.id || Date.now(),
                        numero: `**** **** **** ${numeroLimpo.slice(-4)}`,
                        nome: novoCartao.nome,
                        validade: novoCartao.validade,
                        bandeira: novoCartao.bandeira,
                        ultimos4digitos: numeroLimpo.slice(-4)
                    };
                    setCartoes([...cartoes, cartaoCriado]);
                    setNovoCartao({ numero: '', nome: '', validade: '', cvv: '', bandeira: 'Mastercard' });
                    setAdicionandoCartao(false);
                    setCartaoAtivo(cartoes.length);
                    toast.success('Cartão adicionado com sucesso!', { id: loadingToast });
                } else {
                    toast.error(response.message || 'Erro ao adicionar cartão', { id: loadingToast });
                }
            } catch (error) {
                console.error('Erro ao adicionar cartão:', error);
                toast.error('Erro ao adicionar cartão', { id: loadingToast });
            }
        }
    };


    const handleRemoverCartao = async (id) => {
        if (!confirm('Tem certeza que deseja remover este cartão?')) return;

        const loadingToast = toast.loading('Removendo cartão...');
        try {
            const response = await deletarCartao(id);
            if (response.success) {
                const novosCartoes = cartoes.filter(c => c.id !== id);
                setCartoes(novosCartoes);
                if (cartaoAtivo >= novosCartoes.length) {
                    setCartaoAtivo(Math.max(0, novosCartoes.length - 1));
                }
                toast.success('Cartão removido com sucesso!', { id: loadingToast });
            } else {
                toast.error(response.message || 'Erro ao remover cartão', { id: loadingToast });
            }
        } catch (error) {
            console.error('Erro ao remover cartão:', error);
            toast.error('Erro ao remover cartão', { id: loadingToast });
        }
    };

    const formatarNumeroCartao = (valor) => {
        const numeros = valor.replace(/\D/g, '');
        const grupos = numeros.match(/.{1,4}/g) || [];
        return grupos.join(' ').substring(0, 19);
    };

    const formatarValidade = (valor) => {
        const numeros = valor.replace(/\D/g, '');
        if (numeros.length >= 2) {
            return numeros.substring(0, 2) + '/' + numeros.substring(2, 4);
        }
        return numeros;
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <Header />
            {loading && <p className="text-center py-4">Carregando cartões...</p>}

            <div className="relative h-48 md:h-56 w-full mb-8 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200"
                    alt="Meus Cartões"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                <div className="relative z-10 h-full container mx-auto px-4 md:px-8 flex items-center max-w-7xl pt-20">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-full mr-4">
                        <ArrowLeft className="text-white" size={24} />
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">Meus Cartões</h1>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50 rounded-t-3xl"></div>
            </div>

            <main className="container mx-auto px-4 md:px-8 max-w-3xl">

                {cartoes.length > 0 && (
                    <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
                        <div className="relative">

                            <div className="w-full h-40 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl p-4 text-white shadow-2xl relative overflow-hidden">

                                <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-lg mb-6"></div>

                                <p className="text-xl md:text-2xl font-mono tracking-wider mb-6">
                                    {maskNumber(cartoes[cartaoAtivo].numero, cartoes[cartaoAtivo].ultimos4digitos)}
                                </p>

                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Nome</p>
                                        <p className="font-semibold">{getNome(cartoes[cartaoAtivo])}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 mb-1">Validade</p>
                                        <p className="font-semibold">{getValidade(cartoes[cartaoAtivo])}</p>
                                    </div>
                                </div>

                                <div className="absolute top-6 right-6">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                        <CreditCard size={24} />
                                    </div>
                                </div>

                                <div className="absolute top-6 right-20 text-2xl">📡</div>
                            </div>

                            {cartoes.length > 1 && (
                                <div className="flex justify-center gap-2 mt-4">
                                    <button onClick={handleCartaoAnterior} className="p-2 hover:bg-gray-100 rounded-full">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <div className="flex gap-2 items-center">
                                        {cartoes.map((_, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => setCartaoAtivo(idx)}
                                                className={`h-2 rounded-full transition-all cursor-pointer ${idx === cartaoAtivo ? 'w-8 bg-gray-900' : 'w-2 bg-gray-300 hover:bg-gray-400'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <button onClick={handleProximoCartao} className="p-2 hover:bg-gray-100 rounded-full">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-800">Detalhes do Cartão</h3>
                                <button
                                    onClick={() => handleRemoverCartao(cartoes[cartaoAtivo].id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all"
                                    title="Remover cartão"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 mb-1">Bandeira</p>
                                    <p className="font-medium text-gray-800 uppercase">{cartoes[cartaoAtivo].bandeira || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">Final</p>
                                    <p className="font-medium text-gray-800">**** {cartoes[cartaoAtivo].ultimos4digitos || (cartoes[cartaoAtivo].numero ? cartoes[cartaoAtivo].numero.slice(-4) : '----')}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-gray-500 mb-1">Nome no Cartão</p>
                                    <p className="font-medium text-gray-800">{getNome(cartoes[cartaoAtivo])}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">Validade</p>
                                    <p className="font-medium text-gray-800">{getValidade(cartoes[cartaoAtivo])}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {cartoes.length === 0 && (
                    <div className="bg-white rounded-3xl shadow-lg p-8 mb-6 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CreditCard size={40} className="text-gray-400" />
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">Nenhum cartão cadastrado</h3>
                        <p className="text-gray-500 text-sm">Adicione um cartão para facilitar seus pagamentos</p>
                    </div>
                )}

                <button
                    onClick={() => setAdicionandoCartao(!adicionandoCartao)}
                    className={`w-full py-4 border-2 border-dashed rounded-xl font-medium transition-all flex items-center justify-center gap-2 mb-6 ${adicionandoCartao
                        ? 'border-red-300 text-red-600 hover:border-red-400'
                        : 'border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600'
                        }`}
                >
                    {adicionandoCartao ? (
                        <>
                            <X size={20} />
                            Cancelar
                        </>
                    ) : (
                        <>
                            <Plus size={20} />
                            Adicionar novo cartão
                        </>
                    )}
                </button>

                {adicionandoCartao && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 mb-6">
                        <h3 className="font-bold text-gray-800 mb-4">Novo Cartão</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Número do cartão
                            </label>
                            <input
                                type="text"
                                placeholder="1234 1234 1234 1234"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                value={novoCartao.numero}
                                onChange={(e) => setNovoCartao({ ...novoCartao, numero: formatarNumeroCartao(e.target.value) })}
                                maxLength={19}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nome no cartão</label>
                            <input
                                type="text"
                                placeholder="NOME COMO NO CARTÃO"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none uppercase"
                                value={novoCartao.nome}
                                onChange={(e) => setNovoCartao({ ...novoCartao, nome: e.target.value.toUpperCase() })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Data de expiração
                                </label>
                                <input
                                    type="text"
                                    placeholder="MM/AA"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                    value={novoCartao.validade}
                                    onChange={(e) => setNovoCartao({ ...novoCartao, validade: formatarValidade(e.target.value) })}
                                    maxLength={5}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                                <input
                                    type="text"
                                    placeholder="123"
                                    maxLength={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                    value={novoCartao.cvv}
                                    onChange={(e) => setNovoCartao({ ...novoCartao, cvv: e.target.value.replace(/\D/g, '') })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bandeira</label>
                            <select
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white"
                                value={novoCartao.bandeira}
                                onChange={(e) => setNovoCartao({ ...novoCartao, bandeira: e.target.value })}
                            >
                                <option value="Visa">Visa</option>
                                <option value="Mastercard">Mastercard</option>
                                <option value="Elo">Elo</option>
                                <option value="American Express">American Express</option>
                                <option value="Hipercard">Hipercard</option>
                            </select>
                        </div>

                        <button
                            onClick={handleAdicionarCartao}
                            disabled={!novoCartao.numero || !novoCartao.nome || !novoCartao.validade || !novoCartao.cvv}
                            className="w-full py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Check size={20} />
                            Salvar Cartão
                        </button>
                    </div>
                )}

                {cartoes.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="font-bold text-gray-800 mb-4">Todos os Cartões ({cartoes.length})</h3>
                        <div className="space-y-3">
                            {cartoes.map((cartao, idx) => (
                                <div
                                    key={cartao.id}
                                    onClick={() => setCartaoAtivo(idx)}
                                    className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${idx === cartaoAtivo
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-50 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${idx === cartaoAtivo ? 'bg-white/20' : 'bg-gray-200'
                                            }`}>
                                            <CreditCard size={20} className={idx === cartaoAtivo ? 'text-white' : 'text-gray-600'} />
                                        </div>
                                        <div>
                                            <p className="font-medium">•••• {cartao.ultimos4digitos || (cartao.numero ? cartao.numero.slice(-4) : '----')}</p>
                                            <p className={`text-sm ${idx === cartaoAtivo ? 'text-gray-300' : 'text-gray-500'}`}>
                                                {cartao.bandeira} • {getValidade(cartao)}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoverCartao(cartao.id);
                                        }}
                                        className={`p-2 rounded-full transition-all ${idx === cartaoAtivo
                                            ? 'hover:bg-white/20 text-white'
                                            : 'hover:bg-red-50 text-red-500'
                                            }`}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
