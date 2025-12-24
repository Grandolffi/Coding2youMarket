import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { verMeuCarrinho } from '../api/carrinhoAPI';
import { useCarrinho } from '../context/CarrinhoContext';
export default function Header() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { contadorCarrinho, atualizarContador } = useCarrinho();
    const navigate = useNavigate();
    useEffect(() => {
        carregarQuantidadeCarrinho();
    }, []);
    const carregarQuantidadeCarrinho = async () => {
        try {
            const carrinho = await verMeuCarrinho();
            if (carrinho && Array.isArray(carrinho)) {
                const total = carrinho.reduce((acc, item) => acc + (item.quantidade || 0), 0);
                atualizarContador(total);
            }
        } catch (error) {
            console.error('Erro ao carregar carrinho:', error);
            atualizarContador(0);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setDropdownOpen(false);
        navigate('/login');
    };
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownOpen && !e.target.closest('.dropdown-container')) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [dropdownOpen]);
    return (
        <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8">
            <div className="container mx-auto max-w-7xl">
                <div className="bg-white/40 backdrop-blur-2xl border border-white/60 shadow-xl rounded-full px-4 md:px-6 py-3">

                    {/* Layout Mobile */}
                    <div className="flex md:hidden items-center justify-between">
                        <Link to="/" className="flex items-center">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                                🛒
                            </div>
                        </Link>
                        <span className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-gray-800">
                            Subscrivery
                        </span>
                        <div className="flex items-center gap-2">
                            <Link to="/carrinho" className="p-2 hover:bg-white/30 rounded-full transition-colors relative">
                                <ShoppingCart size={20} className="text-gray-700" />
                                {contadorCarrinho > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full shadow-lg px-1">
                                        {contadorCarrinho}
                                    </span>
                                )}
                            </Link>
                            <div className="relative dropdown-container">
                                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="p-2 hover:bg-white/30 rounded-full transition-colors">
                                    <User size={20} className="text-gray-700" />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                        <Link to="/pedidos" className="block px-4 py-3 text-gray-800 hover:bg-green-50 transition-colors" onClick={() => setDropdownOpen(false)}>
                                            📦 Meus Pedidos
                                        </Link>
                                        <Link to="/club" className="block px-4 py-3 text-gray-800 hover:bg-green-50 transition-colors" onClick={() => setDropdownOpen(false)}>
                                            ⭐ Club Market
                                        </Link>
                                        <Link to="/perfil" className="block px-4 py-3 text-gray-800 hover:bg-green-50 transition-colors" onClick={() => setDropdownOpen(false)}>
                                            👤 Meu Perfil
                                        </Link>
                                        <hr className="border-gray-200" />
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium">
                                            🚪 Sair
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Layout Desktop */}
                    <div className="hidden md:flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                                🛒
                            </div>
                            <span className="text-lg font-bold text-gray-800">
                                Subscrivery
                            </span>
                        </Link>
                        <nav className="flex items-center gap-8">
                            <Link to="/" className="text-gray-800 hover:text-green-600 font-semibold transition-colors border-b-2 border-green-500 pb-1">
                                Início
                            </Link>
                            <Link to="/pedidos" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                                Meus Pedidos
                            </Link>
                            <Link to="/club" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                                Club Market
                            </Link>
                        </nav>
                        <div className="flex items-center gap-3">
                            <Link to="/carrinho" className="p-2 hover:bg-white/30 rounded-full transition-colors relative">
                                <ShoppingCart size={20} className="text-gray-700" />
                                {contadorCarrinho > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full shadow-lg px-1">
                                        {contadorCarrinho}
                                    </span>
                                )}
                            </Link>
                            <div className="relative dropdown-container">
                                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="p-2 hover:bg-white/30 rounded-full transition-colors">
                                    <User size={20} className="text-gray-700" />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                        <Link to="/pedidos" className="block px-4 py-3 text-gray-800 hover:bg-green-50 transition-colors" onClick={() => setDropdownOpen(false)}>
                                            Meus Pedidos
                                        </Link>
                                        <Link to="/club" className="block px-4 py-3 text-gray-800 hover:bg-green-50 transition-colors" onClick={() => setDropdownOpen(false)}>
                                            Club Market
                                        </Link>
                                        <Link to="/perfil" className="block px-4 py-3 text-gray-800 hover:bg-green-50 transition-colors" onClick={() => setDropdownOpen(false)}>
                                            Meu Perfil
                                        </Link>
                                        <hr className="border-gray-200" />
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium">
                                            Sair
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}