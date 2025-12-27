import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, ShoppingCart, Star, Package, TrendingUp, DollarSign, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'https://coding2youmarket-production.up.railway.app/api';

export default function AdminPanel() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);

    // Dashboard State
    const [metrics, setMetrics] = useState(null);
    const [vendas, setVendas] = useState([]);
    const [topProdutos, setTopProdutos] = useState([]);
    const [showClubDetails, setShowClubDetails] = useState(false);

    // Products State
    const [produtos, setProdutos] = useState([]);
    const [editandoEstoque, setEditandoEstoque] = useState(null);

    // Orders State
    const [pedidos, setPedidos] = useState([]);

    // Users State
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        carregarDados();
    }, [activeTab]);

    const carregarDados = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                toast.error('Você precisa estar logado como admin');
                navigate('/login');
                return;
            }

            if (activeTab === 'dashboard') {
                // Dashboard metrics
                const metricsRes = await fetch(`${API_URL}/admin/dashboard`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const metricsData = await metricsRes.json();
                if (metricsData.success) setMetrics(metricsData.data);

                // Sales
                const vendasRes = await fetch(`${API_URL}/admin/vendas-ultimos-dias?dias=7`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const vendasData = await vendasRes.json();
                if (vendasData.success) setVendas(vendasData.data);

                // Top products
                const produtosRes = await fetch(`${API_URL}/admin/top-produtos?limit=5`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const produtosData = await produtosRes.json();
                if (produtosData.success) setTopProdutos(produtosData.data);
            }

            if (activeTab === 'produtos') {
                const res = await fetch(`${API_URL}/admin/produtos`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) setProdutos(data.data);
            }

            if (activeTab === 'pedidos') {
                const res = await fetch(`${API_URL}/admin/pedidos`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) setPedidos(data.data);
            }

            if (activeTab === 'usuarios') {
                const res = await fetch(`${API_URL}/admin/usuarios`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) setUsuarios(data.data);
            }

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            toast.error('Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    };

    const atualizarEstoque = async (produtoId, quantidade) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/produtos/${produtoId}/estoque`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantidade: parseInt(quantidade) })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Estoque atualizado!');
                setEditandoEstoque(null);
                carregarDados();
            }
        } catch (error) {
            toast.error('Erro ao atualizar estoque');
        }
    };

    const atualizarStatusPedido = async (pedidoId, novoStatus) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/pedidos/${pedidoId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: novoStatus })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Status atualizado!');
                carregarDados();
            }
        } catch (error) {
            toast.error('Erro ao atualizar status');
        }
    };

    // Calcular distribuição de membros por nível
    const getClubDistribuicao = () => {
        if (!metrics?.club?.distribuicao) return [];

        const niveis = { 1: 'Intermedi', 2: 'Entrada', 3: 'Premium' };
        return metrics.club.distribuicao.map(d => ({
            nivel: niveis[d.plano_id] || `Nível ${d.plano_id}`,
            quantidade: parseInt(d.quantidade)
        }));
    };

    if (loading && !metrics) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Header - Verde */}
            <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-8 px-4 shadow-lg">
                <div className="container mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">🔐</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold">Admin Panel</h1>
                        </div>
                        <p className="text-green-100 text-sm">Gestão completa do e-commerce</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={() => navigate('/home')}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition text-sm font-medium"
                        >
                            🏠 Ir para Site
                        </button>
                        <button
                            onClick={() => {
                                localStorage.removeItem('token');
                                navigate('/login');
                            }}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition text-sm font-medium"
                        >
                            <LogOut size={18} />
                            Sair
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                            { id: 'produtos', label: 'Produtos', icon: Package },
                            { id: 'pedidos', label: 'Pedidos', icon: ShoppingCart },
                            { id: 'usuarios', label: 'Usuários', icon: Users },
                        ].map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-3 font-medium transition border-b-2 whitespace-nowrap text-sm ${activeTab === tab.id
                                        ? 'border-green-600 text-green-600 bg-green-50'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="container mx-auto px-4 md:px-8 max-w-7xl py-6 md:py-8">
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <div>
                        {/* Metric Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <DollarSign className="text-green-600" size={24} />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">
                                    R$ {metrics?.receita?.mes.toFixed(2).replace('.', ',')}
                                </h3>
                                <p className="text-sm text-gray-500">Receita do Mês</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <ShoppingCart className="text-blue-600" size={24} />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">{metrics?.pedidos?.hoje || 0}</h3>
                                <p className="text-sm text-gray-500">Pedidos Hoje</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Users className="text-purple-600" size={24} />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">{metrics?.usuarios?.ativos || 0}</h3>
                                <p className="text-sm text-gray-500">Usuários Ativos</p>
                            </div>

                            {/* Club Members Card - Clicável */}
                            <div
                                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500 cursor-pointer hover:shadow-lg transition"
                                onClick={() => setShowClubDetails(!showClubDetails)}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <Star className="text-yellow-600" size={24} />
                                    </div>
                                    {showClubDetails ? '▼' : '▶'}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">{metrics?.club?.total || 0}</h3>
                                <p className="text-sm text-gray-500">Club Members</p>

                                {/* Detalhes expandidos */}
                                {showClubDetails && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                                        {getClubDistribuicao().map((dist, idx) => (
                                            <div key={idx} className="flex justify-between text-xs">
                                                <span className="text-gray-600">{dist.nivel}:</span>
                                                <span className="font-semibold text-yellow-700">{dist.quantidade}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <TrendingUp className="text-green-600" size={20} />
                                    Vendas (7 dias)
                                </h3>
                                <div className="space-y-2">
                                    {vendas.length > 0 ? vendas.map((v, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm text-gray-600">
                                                {new Date(v.data).toLocaleDateString('pt-BR')}
                                            </span>
                                            <div className="text-right">
                                                <div className="text-sm font-semibold">R$ {parseFloat(v.receita).toFixed(2)}</div>
                                                <div className="text-xs text-gray-500">{v.total_pedidos} pedido(s)</div>
                                            </div>
                                        </div>
                                    )) : <p className="text-center text-gray-400 py-4">Sem vendas</p>}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-bold mb-4">Top 5 Produtos</h3>
                                <div className="space-y-2">
                                    {topProdutos.length > 0 ? topProdutos.map((p, idx) => (
                                        <div key={idx} className="flex justify-between py-2 border-b">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-gray-400">#{idx + 1}</span>
                                                <span className="text-sm">{p.nome}</span>
                                            </div>
                                            <span className="text-sm font-semibold text-green-600">{p.quantidade_vendida} un.</span>
                                        </div>
                                    )) : <p className="text-center text-gray-400 py-4">Sem dados</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === 'produtos' && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold">Gestão de Produtos</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estoque</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {produtos.map(p => (
                                        <tr key={p.id}>
                                            <td className="px-6 py-4 text-sm font-medium">{p.nome}</td>
                                            <td className="px-6 py-4 text-sm">R$ {parseFloat(p.preco).toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                {editandoEstoque === p.id ? (
                                                    <input
                                                        type="number"
                                                        defaultValue={p.estoque}
                                                        className="w-20 px-2 py-1 border rounded"
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                atualizarEstoque(p.id, e.target.value);
                                                            }
                                                        }}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${p.estoque < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {p.estoque}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setEditandoEstoque(editandoEstoque === p.id ? null : p.id)}
                                                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                                                >
                                                    {editandoEstoque === p.id ? 'Cancelar' : 'Editar'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'pedidos' && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold">Gestão de Pedidos</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Final</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Desconto</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {pedidos.map(p => {
                                        const desconto = parseFloat(p.valortotal || 0) - parseFloat(p.valorfinal || 0);
                                        return (
                                            <tr key={p.id}>
                                                <td className="px-6 py-4 text-sm font-medium">#{p.id}</td>
                                                <td className="px-6 py-4 text-sm">{p.usuario_nome}</td>
                                                <td className="px-6 py-4 text-sm">R$ {parseFloat(p.valortotal).toFixed(2)}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-green-600">R$ {parseFloat(p.valorfinal || p.valortotal).toFixed(2)}</td>
                                                <td className="px-6 py-4 text-sm text-red-600">
                                                    {desconto > 0 ? `- R$ ${desconto.toFixed(2)}` : 'R$ 0.00'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={p.status}
                                                        onChange={(e) => atualizarStatusPedido(p.id, e.target.value)}
                                                        className="text-sm border rounded px-2 py-1"
                                                    >
                                                        <option value="ativa">Ativa</option>
                                                        <option value="pausada">Pausada</option>
                                                        <option value="cancelada">Cancelada</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {new Date(p.datacriacao).toLocaleDateString('pt-BR')}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'usuarios' && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-bold">Gestão de Usuários</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Club</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {usuarios.map(u => (
                                        <tr key={u.id}>
                                            <td className="px-6 py-4 text-sm font-medium">{u.nome}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                                            <td className="px-6 py-4">
                                                {u.club_marketid ? (
                                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                                                        ⭐ Nível {u.club_marketid}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${u.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {u.ativo ? 'Ativo' : 'Inativo'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
