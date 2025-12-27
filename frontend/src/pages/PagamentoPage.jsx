import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import { verMeuCarrinho, limparCarrinho } from '../api/carrinhoAPI';
import { criarPedido, meusPedidos } from '../api/pedidosAPI';
import { initMercadoPago, tokenizarCartao, formatarNumeroCartao, formatarValidade } from '../services/mercadoPagoService';

const API_URL = 'https://coding2youmarket-production.up.railway.app/api';
const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY;

export default function PagamentoPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [processandoPagamento, setProcessandoPagamento] = useState(false);
    const [resumo, setResumo] = useState(null);
    const [cartao, setCartao] = useState({
        numero: '',
        nome: '',
        validade: '',
        cvv: '',
        cpf: ''
    });

    const dadosCompra = location.state || {};

    useEffect(() => {
        initMercadoPago(MP_PUBLIC_KEY);
        calcularResumo();
    }, []);

    const calcularResumo = async () => {
        try {
            if (dadosCompra.tipoCompra === 'club') {
                const valorClub = dadosCompra.valorClub || 39.90;
                setResumo({
                    subtotal: valorClub,
                    descontoClub: 0,
                    frete: 0,
                    total: valorClub
                });
                return;
            }

            const carrinho = await verMeuCarrinho();
            if (!carrinho || carrinho.length === 0) {
                setResumo({ subtotal: 0, descontoClub: 0, frete: 0, total: 0 });
                return;
            }

            const subtotal = carrinho.reduce((acc, item) => {
                const preco = item.produto?.preco || 0;
                const quantidade = item.quantidade || 0;
                return acc + (preco * quantidade);
            }, 0);

            const pedidos = await meusPedidos();
            const valorFrete = 10.23;
            let descontoClub = 0;

            const clubAtivo = (pedidos || []).find(
                p => p.frequencia === 'club' && (p.status === 'ativa' || p.status === 'pausada')
            );

            if (clubAtivo) {
                descontoClub += valorFrete;
                const valorFinal = clubAtivo.valorfinal || clubAtivo.valortotal;
                let percentualDesconto = 0;

                if (valorFinal >= 39) percentualDesconto = 0.25;
                else if (valorFinal >= 19) percentualDesconto = 0.10;

                descontoClub += (subtotal * percentualDesconto);
            }

            const frete = subtotal > 0 ? valorFrete : 0;
            const total = subtotal + frete - descontoClub;

            setResumo({ subtotal, descontoClub, frete, total });
        } catch (error) {
            console.error('Erro ao calcular resumo:', error);
            setResumo({ subtotal: 0, descontoClub: 0, frete: 0, total: 0 });
        }
    };

    const handlePagar = async () => {
        if (!cartao.numero || !cartao.nome || !cartao.cvv || !cartao.validade || !cartao.cpf) {
            toast.error('Preencha todos os campos do cartão');
            return;
        }

        if (!resumo || resumo.total === 0) {
            toast.error('Carrinho vazio');
            return;
        }

        setProcessandoPagamento(true);
        const loadingToast = toast.loading('Processando pagamento...');

        try {
            // 1. Tokenizar cartão
            const resultado = await tokenizarCartao({
                numero: cartao.numero.replace(/\s/g, ''),
                nome: cartao.nome,
                validade: cartao.validade,
                cvv: cartao.cvv,
                cpf: cartao.cpf.replace(/\D/g, '')
            });

            if (!resultado.success || !resultado.token) {
                throw new Error(resultado.message || 'Erro ao gerar token do cartão');
            }

            console.log('✅ Token gerado:', resultado.token);

            // 2. Processar pagamento direto
            const response = await fetch(`${API_URL}/pagamentos/processar-direto`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    token: resultado.token,
                    transactionAmount: resumo.total,
                    installments: 1,
                    description: dadosCompra.tipoCompra === 'club' ? 'Assinatura Club Market' : 'Compra Coding2You Market',
                    paymentMethodId: resultado.bandeira || 'master'
                })
            });

            const data = await response.json();

            if (data.success && data.status === 'approved') {
                toast.success('Pagamento aprovado!', { id: loadingToast });

                // 3. Criar pedido
                await criarPedido({
                    items: dadosCompra.tipoCompra === 'club' ? [] : await verMeuCarrinho(),
                    total: resumo.total,
                    tipoCompra: dadosCompra.tipoCompra || 'normal'
                });

                // 4. Limpar carrinho se não for club
                if (dadosCompra.tipoCompra !== 'club') {
                    await limparCarrinho();
                }

                // Redirecionar para confirmação
                navigate('/confirmacao', { state: { mercadoPagoId: data.mercadoPagoId } });
            } else {
                toast.error(data.details || data.message || 'Pagamento recusado', { id: loadingToast });
            }
        } catch (error) {
            console.error('❌ Erro:', error);
            toast.error(error.message || 'Erro ao processar pagamento', { id: loadingToast });
        } finally {
            setProcessandoPagamento(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <Header />
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
                    <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">Payment</h1>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50 rounded-t-3xl"></div>
            </div>

            <main className="container mx-auto px-4 md:px-8 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                            <h3 className="font-bold text-gray-800 mb-4">Add card</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                                <input
                                    type="text"
                                    placeholder="1234 1234 1234 1234"
                                    maxLength="19"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                    value={cartao.numero}
                                    onChange={(e) => setCartao({ ...cartao, numero: formatarNumeroCartao(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name (as on card)</label>
                                <input
                                    type="text"
                                    placeholder="APRO"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none uppercase"
                                    value={cartao.nome}
                                    onChange={(e) => setCartao({ ...cartao, nome: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
                                    <input
                                        type="text"
                                        placeholder="12/25"
                                        maxLength="5"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        value={cartao.validade}
                                        onChange={(e) => setCartao({ ...cartao, validade: formatarValidade(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                                    <input
                                        type="text"
                                        placeholder="123"
                                        maxLength="4"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        value={cartao.cvv}
                                        onChange={(e) => setCartao({ ...cartao, cvv: e.target.value.replace(/\D/g, '') })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                                    <input
                                        type="text"
                                        placeholder="CPF"
                                        maxLength="14"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-xs"
                                        value={cartao.cpf}
                                        onChange={(e) => setCartao({ ...cartao, cpf: e.target.value.replace(/\D/g, '') })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                            <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
                            {resumo && (
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>R$ {resumo.subtotal.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                    {resumo.descontoClub > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Club+ Discount</span>
                                            <span>- R$ {resumo.descontoClub.toFixed(2).replace('.', ',')}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>R$ {resumo.frete.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                    <div className="h-px bg-gray-200"></div>
                                    <div className="flex justify-between text-lg font-bold text-gray-800">
                                        <span>Total</span>
                                        <span className="text-green-700">R$ {resumo.total.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                    {resumo.descontoClub > 0 && (
                                        <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-200">
                                            <p className="text-sm text-green-700">
                                                ✨ You saved R$ {resumo.descontoClub.toFixed(2).replace('.', ',')} with Club+
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                            <button
                                onClick={handlePagar}
                                disabled={processandoPagamento}
                                className={`w-full py-3 rounded-full font-semibold text-white transition-all shadow-lg ${processandoPagamento ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800 active:scale-95'
                                    }`}
                            >
                                {processandoPagamento ? 'Processing...' : 'Continue'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}