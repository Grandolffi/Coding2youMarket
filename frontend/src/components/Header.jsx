import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
export default function Header() {
    const [menuAberto, setMenuAberto] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };
    return (
        <>
            <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="bg-white/40 backdrop-blur-2xl border border-white/60 shadow-xl rounded-full px-6 py-3 flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                                🛒
                            </div>
                            <span className="text-lg font-bold text-gray-800 hidden sm:block">
                                Subscrivery
                            </span>
                        </Link>
                        {/* Desktop Nav - Centro */}
                        <nav className="hidden md:flex items-center gap-8">
                            <Link to="/" className="text-gray-800 hover:text-green-600 font-semibold transition-colors border-b-2 border-green-500 pb-1">
                                Início
                            </Link>
                            <Link to="/categorias" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                                Categorias
                            </Link>
                            <Link to="/ofertas" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                                Ofertas
                            </Link>
                            <Link to="/perfil" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                                Perfil
                            </Link>
                        </nav>
                        {/* Actions - Direita */}
                        <div className="flex items-center gap-3">
                            {/* Menu Mobile (Hambúrguer) */}
                            <button
                                onClick={() => setMenuAberto(true)}
                                className="md:hidden p-2 hover:bg-white/30 rounded-full transition-colors"
                            >
                                <Menu size={20} className="text-gray-700" />
                            </button>
                            {/* Busca (Desktop) */}
                            <button className="hidden md:block p-2 hover:bg-white/30 rounded-full transition-colors">
                                <Search size={20} className="text-gray-700" />
                            </button>
                            {/* Carrinho */}
                            <Link to="/carrinho" className="p-2 hover:bg-white/30 rounded-full transition-colors relative">
                                <ShoppingCart size={20} className="text-gray-700" />
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full shadow-lg">
                                    2
                                </span>
                            </Link>
                            {/* Perfil */}
                            <div className="relative">
                                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="p-2 hover:bg-white/30 rounded-full transition-colors">
                                    <User size={20} className="text-gray-700" />
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                        <Link to="/pedidos" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>
                                            Meus Pedidos
                                        </Link>
                                        <Link to="/assinatura" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>
                                            Minha Assinatura
                                        </Link>
                                        <Link to="/perfil" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>
                                            Meu Perfil
                                        </Link>
                                        <button onClick={() => { setDropdownOpen(false); handleLogout(); }} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {/* Menu Mobile Lateral */}
            {menuAberto && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/50 z-50 md:hidden"
                        onClick={() => setMenuAberto(false)}
                    />
                    {/* Menu Drawer */}
                    <div className="fixed top-0 right-0 bottom-0 w-64 bg-white shadow-2xl z-50 md:hidden animate-slideIn">
                        <div className="p-6">
                            {/* Cabeçalho */}
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold text-gray-800">Menu</h2>
                                <button
                                    onClick={() => setMenuAberto(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            {/* Links */}
                            <nav className="space-y-4">
                                <Link
                                    to="/"
                                    className="block py-3 px-4 rounded-xl bg-green-50 text-green-700 font-semibold"
                                    onClick={() => setMenuAberto(false)}
                                >
                                    Início
                                </Link>
                                <Link
                                    to="/categorias"
                                    className="block py-3 px-4 rounded-xl hover:bg-gray-100 text-gray-700 font-medium"
                                    onClick={() => setMenuAberto(false)}
                                >
                                    Categorias
                                </Link>
                                <Link
                                    to="/ofertas"
                                    className="block py-3 px-4 rounded-xl hover:bg-gray-100 text-gray-700 font-medium"
                                    onClick={() => setMenuAberto(false)}
                                >
                                    Ofertas
                                </Link>
                                <Link
                                    to="/perfil"
                                    className="block py-3 px-4 rounded-xl hover:bg-gray-100 text-gray-700 font-medium"
                                    onClick={() => setMenuAberto(false)}
                                >
                                    Perfil
                                </Link>
                            </nav>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}