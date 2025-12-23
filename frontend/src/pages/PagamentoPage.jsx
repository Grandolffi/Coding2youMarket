import { useState } from 'react';
import { ArrowLeft, CreditCard, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
// Mock de cartões salvos
const CARTOES_MOCK = [
    {
        id: 1,
        numero: '1234 1234 1234 1234',
        nome: 'SARAH ELOISA',
        validade: '07/29',
        bandeira: 'Visa',
        cvv: '215'
    }
];
const API_URL = 'https://coding2youmarket-production.up.railway.app/api';
export default function PagamentoPage() {
    const navigate = useNavigate();
    const [cartoes, setCartoes] = useState(CARTOES_MOCK);
    const [cartaoAtivo, setCartaoAtivo] = useState(0);
    const [adicionandoCartao, setAdicionandoCartao] = useState(false);
    const [salvandoCartao, setSalvandoCartao] = useState(false);
    const [novoCartao, setNovoCartao] = useState({
        numero: '',
        nome: '',
        validade: '',
        cvv: '',
        bandeira: 'Mastercard'
    });
    const handleProximoCartao = () => {
        setCartaoAtivo((prev) => (prev + 1) % cartoes.length);
    };
    const handleCartaoAnterior = () => {
        setCartaoAtivo((prev) => (prev - 1 + cartoes.length) % cartoes.length);
    };
    const handleAdicionarCartao = async () => {
        // Validação
        if (!novoCartao.numero || !novoCartao.nome || !novoCartao.validade || !novoCartao.cvv) {
            alert('Preencha todos os campos do cartão');
            return;
        }
        setSalvandoCartao(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Você precisa estar logado para adicionar um cartão');
                setSalvandoCartao(false);
                return;
            }
            // Chamar API real do backend
            const response = await fetch(`${API_URL}/cartoes`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    numero: novoCartao.numero.replace(/\s/g, ''),
                    nome: novoCartao.nome,
                    validade: novoCartao.validade,
                    cvv: novoCartao.cvv,
                    bandeira: novoCartao.bandeira
                })
            });
            const data = await response.json();
            if (data.success) {
                alert('Cartão adicionado com sucesso!');
                // Adicionar cartão na lista local
                setCartoes([...cartoes, { ...novoCartao, id: data.cartao.id }]);
                setAdicionandoCartao(false);
                setNovoCartao({ numero: '', nome: '', validade: '', cvv: '', bandeira: 'Mastercard' });
            } else {
                alert(data.message || 'Erro ao adicionar cartão');
            }
        } catch (error) {
            console.error('Erro ao adicionar cartão:', error);
            alert('Erro ao adicionar cartão. Tente novamente.');
        } finally {
            setSalvandoCartao(false);
        }
    };
    const handleContinuar = () => {
        console.log('Processando pagamento...');
        alert('Pagamento processado! (Demo)');
        // navigate('/confirmacao');
    };
    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <Header />
            {/* Hero */}
            <div className="relative h-48 md:h-56 w-full mb-8 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200"
                    alt="Pagamento"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                <div className="relative z-10 h-full container mx-auto px-4 md:px-8 flex items-center max-w-7xl pt-20">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-full mr-4">
                        <ArrowLeft className="text-white" size={24} />
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">Pagamento</h1>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50 rounded-t-3xl"></div>
            </div>
            <main className="container mx-auto px-4 md:px-8 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Coluna Esquerda - Cartão */}
                    <div>
                        {/* Carousel de Cartões */}
                        {cartoes.length > 0 && (
                            <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
                                <div className="relative">
                                    {/* Cartão Visual 3D */}
                                    <div className="w-full aspect-[1.586] bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
                                        {/* Chip */}
                                        <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-lg mb-6"></div>
                                        {/* Número */}
                                        <p className="text-xl md:text-2xl font-mono tracking-wider mb-6">
                                            {cartoes[cartaoAtivo].numero}
                                        </p>
                                        {/* Nome e Validade */}
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-xs text-gray-400 mb-1">Nome</p>
                                                <p className="font-semibold">{cartoes[cartaoAtivo].nome}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400 mb-1">Validade</p>
                                                <p className="font-semibold">{cartoes[cartaoAtivo].validade}</p>
                                            </div>
                                        </div>
                                        {/* Logo Bandeira */}
                                        <div className="absolute top-6 right-6">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                                <CreditCard size={24} />
                                            </div>
                                        </div>
                                        {/* Contactless */}
                                        <div className="absolute top-6 right-20 text-2xl">📡</div>
                                    </div>
                                    {/* Navegação Carousel */}
                                    {cartoes.length > 1 && (
                                        <div className="flex justify-center gap-2 mt-4">
                                            <button onClick={handleCartaoAnterior} className="p-2 hover:bg-gray-100 rounded-full">
                                                <ChevronLeft size={20} />
                                            </button>
                                            <div className="flex gap-2 items-center">
                                                {cartoes.map((_, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`h-2 rounded-full transition-all ${idx === cartaoAtivo ? 'w-8 bg-gray-900' : 'w-2 bg-gray-300'
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
                            </div>
                        )}
                        {/* Adicionar Cartão */}
                        <button
                            onClick={() => setAdicionandoCartao(!adicionandoCartao)}
                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-green-500 hover:text-green-600 transition-all flex items-center justify-center gap-2 mb-6"
                        >
                            <Plus size={20} />
                            Adicionar cartão
                        </button>
                        {/* Formulário Novo Cartão */}
                        {adicionandoCartao && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                                <h3 className="font-bold text-gray-800 mb-4">Adicionar cartão</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Número do cartão
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="1234 1234 1234 1234"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        value={novoCartao.numero}
                                        onChange={(e) => setNovoCartao({ ...novoCartao, numero: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                                    <input
                                        type="text"
                                        placeholder="Sarah Eloisa"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        value={novoCartao.nome}
                                        onChange={(e) => setNovoCartao({ ...novoCartao, nome: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Data de expiração
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="07/29"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                            value={novoCartao.validade}
                                            onChange={(e) => setNovoCartao({ ...novoCartao, validade: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                                        <input
                                            type="text"
                                            placeholder="215"
                                            maxLength="3"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                            value={novoCartao.cvv}
                                            onChange={(e) => setNovoCartao({ ...novoCartao, cvv: e.target.value })}
                                        />
                                    </div>
                                </div>
                                {/* Botão Salvar */}
                                <button
                                    onClick={handleAdicionarCartao}
                                    disabled={salvandoCartao}
                                    className={`w-full py-3 rounded-full font-semibold text-white transition-all shadow-lg ${salvandoCartao
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700 active:scale-95'
                                        }`}
                                >
                                    {salvandoCartao ? 'Salvando...' : 'Salvar Cartão'}
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Coluna Direita - Resumo (Desktop) */}
                    <div className="hidden md:block">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                            <h3 className="font-bold text-gray-800 mb-4">Resumo do pedido</h3>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>R$ 43,23</span>
                                </div>
                                <div className="flex justify-between text-green-600">
                                    <span>Desconto Clube+</span>
                                    <span>- R$ 0,00</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Frete</span>
                                    <span>R$ 10,23</span>
                                </div>
                                <div className="h-px bg-gray-200"></div>
                                <div className="flex justify-between text-lg font-bold text-gray-800">
                                    <span>Total</span>
                                    <span className="text-green-700">R$ 53,46</span>
                                </div>
                            </div>
                            <button
                                onClick={handleContinuar}
                                className="w-full py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                </div>
                {/* Botão Continuar (Mobile) */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg z-40">
                    <button
                        onClick={handleContinuar}
                        className="w-full py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                    >
                        Continuar - R$ 53,46
                    </button>
                </div>
            </main>
        </div>
    );
}