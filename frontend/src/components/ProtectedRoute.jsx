import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
export default function ProtectedRoute({ children }) {
    const [showModal, setShowModal] = useState(false);
    const token = localStorage.getItem('token');
    useEffect(() => {
        if (!token) {
            setShowModal(true);
            // Redireciona após 3 segundos
            const timer = setTimeout(() => {
                window.location.href = '/login';
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [token]);
    if (!token) {
        return (
            <>
                {showModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-fadeIn">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">🔒</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Faça Login para continuar
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Você precisa estar logado para acessar esta página.
                            </p>
                            <div className="space-y-3">
                                <a
                                    href="/login"
                                    className="block w-full py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-all"
                                >
                                    Fazer Login
                                </a>
                                <a
                                    href="/register"
                                    className="block w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-all"
                                >
                                    Criar Conta
                                </a>
                            </div>
                            <p className="text-sm text-gray-500 mt-4">
                                Redirecionando automaticamente...
                            </p>
                        </div>
                    </div>
                )}
            </>
        );
    }
    return children;
}