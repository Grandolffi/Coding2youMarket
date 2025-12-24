import { useState } from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
const API_URL = 'https://coding2youmarket-production.up.railway.app/api';
import { useCarrinho } from '../context/CarrinhoContext';
export default function ProductCard({ produto }) {
    const [quantidade, setQuantidade] = useState(1);
    const [loading, setLoading] = useState(false);
    const { incrementarContador } = useCarrinho();
    const adicionarAoCarrinho = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                alert("Faça login para adicionar ao carrinho");
                return;
            }
            const response = await fetch(`${API_URL}/carrinho`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    produtoId: produto.id,
                    quantidade
                })
            });
            const data = await response.json();
            if (data.success) {
                // Atualiza o contador no header
                incrementarContador(quantidade);

                // Feedback visual
                alert(`✅ ${quantidade}x ${produto.nome} adicionado ao carrinho!`);

                // Reseta quantidade
                setQuantidade(1);
            } else {
                alert('❌ Erro ao adicionar ao carrinho. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao adicionar:', error);
            alert('❌ Erro ao adicionar ao carrinho. Verifique sua conexão.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden">
            {/* Badge Clube+ */}
            {produto.descontoClub && (
                <div className="absolute top-3 right-3 z-10">
                    <span className="bg-black text-white px-2 py-1 rounded-lg text-xs font-bold">
                        CLUBE+
                    </span>
                </div>
            )}
            {/* Imagem - ASPECT RATIO FIXO */}
            <div className="relative w-full aspect-square bg-gray-50 p-4">
                <img
                    src={produto.imagemUrl || 'https://via.placeholder.com/300?text=Produto'}
                    alt={produto.nome}
                    className="w-full h-full object-cover rounded-lg"
                />
            </div>
            {/* Infos */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base line-clamp-2 min-h-[2.5rem]">
                    {produto.nome}
                </h3>
                <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-lg md:text-xl font-bold text-green-700">
                        R$ {produto.preco.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xs text-gray-400">/un</span>
                </div>
                {/* Controles */}
                <div className="flex items-center justify-between gap-2">
                    {/* Seletor Quantidade */}
                    <div className="flex items-center bg-gray-100 rounded-full p-1 gap-1">
                        <button
                            onClick={() => setQuantidade(q => Math.max(1, q - 1))}
                            className="w-7 h-7 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-600 hover:text-green-600 transition-colors"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-medium text-gray-700">{quantidade}</span>
                        <button
                            onClick={() => setQuantidade(q => q + 1)}
                            className="w-7 h-7 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-600 hover:text-green-600 transition-colors"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                    {/* Botão Add */}
                    <button
                        onClick={adicionarAoCarrinho}
                        disabled={loading || produto.estoque === 0}
                        className={`
                            w-10 h-10 flex items-center justify-center rounded-full shadow-md text-white transition-all
                            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:scale-95'}
                        `}
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <ShoppingCart size={18} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}