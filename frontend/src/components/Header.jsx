import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search } from 'lucide-react';
export default function Header() {
    return (
        <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8">
            <div className="container mx-auto max-w-7xl">
                <div className="bg-white/40 backdrop-blur-2xl border border-white/60 shadow-xl rounded-full px-6 py-3 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                            🛒
                        </div>
                        <span className="text-lg font-bold text-gray-800 hidden md:block">
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
                        <Link to="/login" className="p-2 hover:bg-white/30 rounded-full transition-colors">
                            <User size={20} className="text-gray-700" />
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}