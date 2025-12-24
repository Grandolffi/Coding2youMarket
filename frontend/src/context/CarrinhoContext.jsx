import { createContext, useState, useContext, useCallback } from 'react';
const CarrinhoContext = createContext();
export function CarrinhoProvider({ children }) {
    const [contadorCarrinho, setContadorCarrinho] = useState(0);
    const atualizarContador = useCallback((quantidade) => {
        setContadorCarrinho(quantidade);
    }, []);
    const incrementarContador = useCallback((quantidade = 1) => {
        setContadorCarrinho(prev => prev + quantidade);
    }, []);
    return (
        <CarrinhoContext.Provider value={{ contadorCarrinho, atualizarContador, incrementarContador }}>
            {children}
        </CarrinhoContext.Provider>
    );
}
export function useCarrinho() {
    const context = useContext(CarrinhoContext);
    if (!context) {
        throw new Error('useCarrinho deve ser usado dentro de CarrinhoProvider');
    }
    return context;
}