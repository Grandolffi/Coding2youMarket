import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ItemCarrinho from '../components/ItemCarrinho';
import SumarioOrdem from '../components/SumarioOrdem';
import FrequenciaModal from '../components/FrequenciaModal';
import EnderecoModal from '../components/EnderecoModal';
import { verMeuCarrinho, atualizarQuantidade, removerItem, limparCarrinho } from '../api/carrinhoAPI';

export default function CarrinhoPage() {
    const navigate = useNavigate();
    const [itensCarrinho, setItensCarrinho] = useState([]);
    const [resumo, setResumo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalFrequenciaAberto, setModalFrequenciaAberto] = useState(false);
    const [modalEnderecoAberto, setModalEnderecoAberto] = useState(false);
    const [dadosFrequencia, setDadosFrequencia] = useState(null);
    const [usandoMock, setUsandoMock] = useState(false);
    useEffect(() => {
        carregarCarrinho();
    }, []);
    const carregarCarrinho = async () => {
        try {
            setLoading(true);
            const carrinho = await verMeuCarrinho();
            if (carrinho && carrinho.length > 0) {
                setItensCarrinho(carrinho);
                calcularResumo(carrinho);
            } else {

                setItensCarrinho([]);
                setResumo({ subtotal: 0, descontoClub: 0, frete: 0, total: 0 });
            }
        } catch (error) {
            console.error('Erro ao carregar carrinho:', error);
            setItensCarrinho([]);
            setResumo({ subtotal: 0, descontoClub: 0, frete: 0, total: 0 });
        } finally {
            setLoading(false);
        }
    };
    // TODO: Substituir por chamada real ao backend
    // Endpoint: GET /api/carrinho/resumo
    // O backend deve calcular: subtotal, desconto Club+ (baseado no usuário), frete e total
    const calcularResumo = async (itens) => {
        // Temporário: cálculo local até integrar com backend
        const subtotal = itens.reduce((acc, item) => acc + (item.produto.preco * item.quantidade), 0);
        // TODO: Buscar do backend se usuário tem Club+ ativo
        const descontoClub = 0; // Backend calculará baseado no status do usuário
        const frete = 10.23;
        const total = subtotal - descontoClub + frete;
        setResumo({
            subtotal,
            descontoClub,
            frete,
            total
        });
        /* Exemplo de integração futura:
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/carrinho/resumo`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setResumo(data.resumo); // { subtotal, descontoClub, frete, total }
            }
        } catch (error) {
            console.error('Erro ao calcular resumo:', error);
        }
        */
    };
    const handleAtualizarQuantidade = async (itemId, novaQuantidade) => {
        try {
            await atualizarQuantidade(itemId, novaQuantidade);
            const novosItens = itensCarrinho.map(item =>
                item.id === itemId ? { ...item, quantidade: novaQuantidade } : item
            );
            setItensCarrinho(novosItens);
            calcularResumo(novosItens);
        } catch (error) {
            console.error('Erro ao atualizar quantidade:', error);
            alert('Erro ao atualizar quantidade. Tente novamente.');
        }
    };
    const handleRemoverItem = async (itemId) => {
        try {
            await removerItem(itemId);
            const novosItens = itensCarrinho.filter(item => item.id !== itemId);
            setItensCarrinho(novosItens);
            calcularResumo(novosItens);
        } catch (error) {
            console.error('Erro ao remover item:', error);
            alert('Erro ao remover item. Tente novamente.');
        }
    };
    const handleCriarAssinatura = () => {
        setModalFrequenciaAberto(true);
    };
    const handleConfirmarFrequencia = (frequencia) => {
        setDadosFrequencia(frequencia);
        setModalFrequenciaAberto(false);
        setModalEnderecoAberto(true); // Abre modal de endereço
    };
    const handleConfirmarEndereco = (endereco) => {
        setModalEnderecoAberto(false);
        // Navega para página de pagamento
        navigate('/pagamento');
    };
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <Header />
            {/* Hero com Imagem de Fundo */}
            <div className="relative h-48 md:h-56 w-full mb-8 overflow-hidden">
                {/* Imagem de Fundo */}
                <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200"
                    alt="Carrinho"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Overlay Escuro */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                {/* Conteúdo do Hero */}
                <div className="relative z-10 h-full container mx-auto px-4 md:px-8 flex items-center max-w-7xl pt-20">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors mr-4"
                    >
                        <ArrowLeft className="text-white" size={24} />
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                        Meu Carrinho
                    </h1>
                </div>
                {/* Cantos Arredondados Inferiores */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50 rounded-t-3xl"></div>
            </div>
            <main className="container mx-auto px-4 md:px-8 max-w-7xl">
                {/* Badge Modo Demo */}
                {usandoMock && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 mb-6 rounded">
                        <p className="text-sm"><strong>Modo Demo:</strong> Exibindo carrinho de exemplo. Faça login para ver seu carrinho real.</p>
                    </div>
                )}
                {itensCarrinho.length === 0 ? (
                    // Carrinho Vazio
                    <div className="text-center py-20">
                        <ShoppingBag className="mx-auto text-gray-300 mb-4" size={80} />
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">Carrinho vazio</h2>
                        <p className="text-gray-500 mb-6">Adicione produtos para começar sua assinatura</p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors"
                        >
                            Ir às compras
                        </button>
                    </div>
                ) : (
                    // Carrinho com Itens
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Lista de Itens (2 colunas no desktop) */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">
                                    Itens ({itensCarrinho.length})
                                </h2>
                                <div className="divide-y divide-gray-100">
                                    {itensCarrinho.map((item) => (
                                        <ItemCarrinho
                                            key={item.id}
                                            item={item}
                                            onAtualizarQuantidade={handleAtualizarQuantidade}
                                            onRemover={handleRemoverItem}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Sumário (1 coluna no desktop, sticky) */}
                        <div className="lg:col-span-1">
                            <SumarioOrdem
                                resumo={resumo}
                                onCriarAssinatura={handleCriarAssinatura}
                                loading={false}
                            />
                        </div>
                    </div>
                )}
            </main>
            {/* Modal de Frequência */}
            <FrequenciaModal
                isOpen={modalFrequenciaAberto}
                onClose={() => setModalFrequenciaAberto(false)}
                onConfirmar={handleConfirmarFrequencia}
            />
            {/* Modal de Endereço */}
            <EnderecoModal
                isOpen={modalEnderecoAberto}
                onClose={() => setModalEnderecoAberto(false)}
                onConfirmar={handleConfirmarEndereco}
            />
        </div>
    );
}