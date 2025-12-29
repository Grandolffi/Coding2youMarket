import { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import SumarioOrdem from '../components/SumarioOrdem';
import CVVModal from '../components/cvvmodal';
import { meusCartoes, deletarCartao } from '../api/cartaoAPI';
import { verMeuCarrinho, limparCarrinho } from '../api/carrinhoAPI';
import { meusEnderecos } from '../api/enderecoAPI';
import { criarPedido } from '../api/pedidosAPI';
import { minhaAssinatura } from '../api/clubMarketAPI';
import { initMercadoPago, tokenizarCartao, detectarBandeira, formatarNumeroCartao, formatarValidade } from '../services/mercadoPagoService';

const API_URL = 'https://coding2youmarket-production.up.railway.app/api';
const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY;

export default function PagamentoPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [cartoes, setCartoes] = useState([]);
    const [cartaoAtivo, setCartaoAtivo] = useState(0);
    const [adicionandoCartao, setAdicionandoCartao] = useState(false);
    const [salvandoCartao, setSalvandoCartao] = useState(false);
    const [processandoPagamento, setProcessandoPagamento] = useState(false);
    const [loading, setLoading] = useState(true);
    const [resumo, setResumo] = useState(null);
    const [mostrarCVVModal, setMostrarCVVModal] = useState(false);
    const [enderecoSelecionado, setEnderecoSelecionado] = useState(null);
    const [novoCartao, setNovoCartao] = useState({
        numero: '',
        nome: '',
        validade: '',
        cvv: '',
        cpf: ''
    });
    const dadosCompra = location.state || {};
    useEffect(() => {
        initMercadoPago(MP_PUBLIC_KEY);
        carregarCartoes();
        carregarEnderecos();
        calcularResumo();
    }, []);
    const carregarCartoes = async () => {
        try {
            const { success, cartoes: cartoesBackend } = await meusCartoes();
            if (success && cartoesBackend.length > 0) {
                setCartoes(cartoesBackend);
            }
        } catch (error) {
            console.error('Erro ao carregar cartões:', error);
            toast.error('Erro ao carregar cartões');
        } finally {
            setLoading(false);
        }
    };

    const carregarEnderecos = async () => {
        try {
            // ✅ Se enderecoId veio do state (modal frequência), usar ele
            if (dadosCompra.enderecoId) {
                setEnderecoSelecionado(dadosCompra.enderecoId);
                console.log('📍 Endereço vindo do state:', dadosCompra.enderecoId);
                return;
            }

            // Caso contrário, buscar endereços do usuário
            const { success, enderecos } = await meusEnderecos();
            console.log('📦 Response enderecos:', { success, enderecos });

            if (success && enderecos && enderecos.length > 0) {
                // Usar o primeiro endereço como padrão
                setEnderecoSelecionado(enderecos[0].id);
                console.log('📍 Endereço selecionado:', enderecos[0].id, enderecos[0]);
            } else {
                console.warn('⚠️ Nenhum endereço encontrado');
            }
        } catch (error) {
            console.error('❌ Erro ao carregar endereços:', error);
        }
    };




    const calcularResumo = async () => {
        try {
            // ✅ Se for assinatura de club, usar valor do state
            if (dadosCompra.tipoCompra === 'club') {
                const valorClub = dadosCompra.valorClub || 0;
                setResumo({
                    subtotal: valorClub,
                    descontoClub: 0,
                    frete: 0,
                    total: valorClub
                });
                return;
            }

            // Compra normal de carrinho
            const carrinho = await verMeuCarrinho();
            if (!carrinho || carrinho.length === 0) {
                setResumo({
                    subtotal: 0,
                    descontoClub: 0,
                    frete: 0,
                    total: 0
                });
                return;
            }
            const subtotal = carrinho.reduce((acc, item) => {
                const preco = item.produto?.preco || 0;
                const quantidade = item.quantidade || 0;
                return acc + (preco * quantidade);
            }, 0);

            const valorFrete = 10.23;
            let descontoClub = 0;
            let percentualDesconto = 0;

            // ✅ Buscar assinatura Club Market do usuário (se houver)
            try {
                const assinatura = await minhaAssinatura();
                console.log('🔍 Assinatura club (PagamentoPage):', assinatura);

                if (assinatura && assinatura.id) {
                    // ✅ Desconto no FRETE (sempre frete grátis para membros Club)
                    descontoClub += valorFrete;

                    // ✅ Aplicar desconto nos produtos baseado no club_marketid
                    const clubId = assinatura.id;

                    if (clubId === 3) {
                        percentualDesconto = 0.25; // Premium: 25%
                    } else if (clubId === 1) {
                        percentualDesconto = 0.10; // Intermediário: 10%
                    } else if (clubId === 2) {
                        percentualDesconto = 0; // Entrada: só frete grátis
                    }

                    // Somar desconto dos produtos ao desconto do frete
                    descontoClub += (subtotal * percentualDesconto);
                }
            } catch (error) {
                console.log('Usuário sem assinatura Club ou erro ao buscar:', error);
            }

            const total = subtotal - descontoClub + valorFrete;
            setResumo({ subtotal, descontoClub, frete: valorFrete, total });
        } catch (error) {
            console.error('Erro ao calcular resumo:', error);
            setResumo({ subtotal: 0, descontoClub: 0, frete: 0, total: 0 });
        }
    };

    const handleProximoCartao = () => {
        setCartaoAtivo((prev) => (prev + 1) % cartoes.length);
    };


    const handleCartaoAnterior = () => {
        setCartaoAtivo((prev) => (prev - 1 + cartoes.length) % cartoes.length);
    };

    const handleDeletarCartao = async (cartaoId) => {
        // Criar toast de confirmação customizado
        toast.custom((t) => (
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm border-2 border-red-500">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Trash2 size={24} className="text-red-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-800 mb-2">Excluir cartão?</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    toast.dismiss(t.id);
                                    executarExclusao(cartaoId);
                                }}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                            >
                                Excluir
                            </button>
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ), { duration: Infinity, position: 'top-center' });
    };

    const executarExclusao = async (cartaoId) => {
        const loadingToast = toast.loading('Excluindo cartão...');
        try {
            console.log('🗑️ Deletando cartão ID:', cartaoId);
            const resultado = await deletarCartao(cartaoId);
            console.log('✅ Resultado:', resultado);

            if (resultado.success) {
                toast.success('Cartão excluído com sucesso!', { id: loadingToast });

                // Recarregar lista de cartões
                await carregarCartoes();

                // Se tinha mais de 1 cartão, voltar pro primeiro
                // Se era o último, o estado vazio já vai aparecer
                if (cartoes.length > 1) {
                    setCartaoAtivo(0);
                }
            } else {
                toast.error(resultado.message || 'Erro ao excluir cartão', { id: loadingToast });
            }
        } catch (error) {
            console.error('❌ Erro ao excluir cartão:', error);
            toast.error('Erro ao excluir cartão. Tente novamente.', { id: loadingToast });
        }
    };




    const handleAdicionarCartao = async () => {
        if (!novoCartao.numero || !novoCartao.nome || !novoCartao.validade || !novoCartao.cvv) {
            toast.error('Preencha todos os campos do cartão');
            return;
        }
        setSalvandoCartao(true);
        const loadingToast = toast.loading('Salvando cartão...');
        try {
            const tokenResult = await tokenizarCartao(novoCartao);
            if (!tokenResult.success) {
                toast.error(tokenResult.message, { id: loadingToast });
                setSalvandoCartao(false);
                return;
            }

            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/pagamentos/salvar-cartao`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: tokenResult.token,
                    bandeira: tokenResult.bandeira,
                    ultimos4digitos: tokenResult.ultimos4Digitos,
                    nomeImpresso: novoCartao.nome,
                    principal: cartoes.length === 0
                })
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Cartão adicionado com sucesso!', { id: loadingToast });
                await carregarCartoes();
                setAdicionandoCartao(false);
                setNovoCartao({ numero: '', nome: '', validade: '', cvv: '', cpf: '' });
            } else {
                toast.error(data.message || 'Erro ao adicionar cartão', { id: loadingToast });
            }
        } catch (error) {
            console.error('Erro ao adicionar cartão:', error);
            toast.error('Erro ao adicionar cartão. Tente novamente.', { id: loadingToast });
        } finally {
            setSalvandoCartao(false);
        }
    };


    const handleContinuar = () => {
        if (cartoes.length === 0) {
            toast.error('Adicione um cartão para continuar');
            return;
        }
        if (!resumo || resumo.total === 0) {
            toast.error('Carrinho vazio. Adicione produtos para continuar.');
            return;
        }
        // Abrir modal CVV
        setMostrarCVVModal(true);
    };
    const handleConfirmarCVV = async (cvv) => {
        setMostrarCVVModal(false);
        setProcessandoPagamento(true);
        const loadingToast = toast.loading('Processando pagamento...');
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const cartaoSelecionado = cartoes[cartaoAtivo];
            const dadosPagamento = {
                token: cartaoSelecionado.tokencartao,
                transactionAmount: resumo.total,
                installments: 1,
                description: `Pedido Subscrivery - ${dadosCompra.tipo || 'assinatura'}`,
                paymentMethodId: cartaoSelecionado.bandeira?.toLowerCase() || 'master',
                email: user.email || user.Email
            };
            const response = await fetch(`${API_URL}/pagamentos/processar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosPagamento)
            });
            const data = await response.json();
            if (data.success && data.pagamento.status === 'approved') {
                toast.success('Pagamento aprovado!', { id: loadingToast });

                // ✅ Se for pagamento de club, atribuir ao usuário
                if (dadosCompra.tipoCompra === 'club') {
                    try {
                        const { assinarPlano } = await import('../api/clubMarketAPI');
                        await assinarPlano(dadosCompra.planoId);
                        console.log('✅ Club atribuído ao usuário:', dadosCompra.planoId);
                    } catch (error) {
                        console.error('Erro ao atribuir club:', error);
                        toast.error('Pagamento aprovado, mas houve erro ao ativar o clube. Entre em contato com suporte.');
                    }
                } else {
                    // ✅ Criar pedido no banco (apenas para compras normais)
                    try {
                        if (!enderecoSelecionado) {
                            toast.error('Endereço não encontrado. Cadastre um endereço antes de finalizar a compra.');
                            return;
                        }

                        console.log('🛒 Criando pedido no banco...');
                        const carrinho = await verMeuCarrinho();
                        console.log('📦 Carrinho:', carrinho);

                        // ✅ Calcular próxima entrega baseado na frequência
                        const frequencia = dadosCompra.frequencia || 'unica';
                        let dataProximaEntrega = null;
                        let dataProximaCobranca = null;

                        if (frequencia !== 'unica') {
                            const hoje = new Date();
                            const proximaEntrega = new Date(hoje);

                            // Calcular baseado na frequência
                            switch (frequencia) {
                                case 'semanal':
                                    proximaEntrega.setDate(hoje.getDate() + 7);
                                    break;
                                case 'quinzenal':
                                    proximaEntrega.setDate(hoje.getDate() + 15);
                                    break;
                                case 'mensal':
                                    proximaEntrega.setMonth(hoje.getMonth() + 1);
                                    break;
                            }

                            dataProximaEntrega = proximaEntrega.toISOString();

                            // Próxima cobrança: 1 dia antes da entrega
                            const proximaCobranca = new Date(proximaEntrega);
                            proximaCobranca.setDate(proximaEntrega.getDate() - 1);
                            dataProximaCobranca = proximaCobranca.toISOString();

                            console.log('📅 Próxima entrega:', dataProximaEntrega);
                            console.log('💳 Próxima cobrança:', dataProximaCobranca);
                        }

                        const pedidoData = {
                            enderecoId: enderecoSelecionado,
                            items: carrinho,
                            valorTotal: resumo.subtotal + resumo.frete,
                            valorFinal: resumo.total,
                            descontoClub: resumo.descontoClub || 0,
                            frequencia: frequencia,
                            dataProximaEntrega,
                            dataProximaCobranca,
                            pagamentoId: data.pagamento.id
                        };


                        console.log('📋 Dados do pedido:', pedidoData);
                        const resultadoPedido = await criarPedido(pedidoData);
                        console.log('✅ Pedido criado com sucesso:', resultadoPedido);

                        if (!resultadoPedido.success) {
                            throw new Error(resultadoPedido.message || 'Erro ao criar pedido');
                        }
                    } catch (error) {
                        console.error('❌ Erro ao criar pedido:', error);
                        toast.error('Pagamento aprovado, mas houve erro ao registrar o pedido. Entre em contato com suporte.');
                    }

                    // ✅ Limpar carrinho após pagamento aprovado
                    try {
                        await limparCarrinho();
                        console.log('✅ Carrinho limpo após pagamento');
                    } catch (error) {
                        console.error('Erro ao limpar carrinho:', error);
                    }
                }

                navigate('/confirmacao', { state: { pagamento: data.pagamento } });
            } else {
                toast.error(`Pagamento ${data.pagamento?.status || 'recusado'}. ${data.pagamento?.statusDetail || ''}`, {
                    id: loadingToast,
                    duration: 5000
                });
            }
        } catch (error) {
            console.error('💥 Erro:', error);
            toast.error('Erro ao processar pagamento.', { id: loadingToast });
        } finally {
            setProcessandoPagamento(false);
        }
    };
    const formatarCartaoDisplay = (cartao) => {
        const ultimos4 = cartao.ultimos4digitos || '****';
        return `•••• •••• •••• ${ultimos4}`;
    };
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-verde-salvia-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }
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
                    <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">Pagamento</h1>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50 rounded-t-3xl"></div>
            </div>
            <main className="container mx-auto px-4 md:px-8 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        {cartoes.length > 0 ? (
                            <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
                                <div className="relative">
                                    <div className="w-full aspect-[1.586] bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
                                        <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-lg mb-6"></div>
                                        <p className="text-xl md:text-2xl font-mono tracking-wider mb-6">
                                            {formatarCartaoDisplay(cartoes[cartaoAtivo])}
                                        </p>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-xs text-gray-400 mb-1">Nome</p>
                                                <p className="font-semibold">{cartoes[cartaoAtivo].nomeimpresso}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400 mb-1">Bandeira</p>
                                                <p className="font-semibold">{cartoes[cartaoAtivo].bandeira}</p>
                                            </div>
                                        </div>
                                        <div className="absolute top-6 right-6">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                                <CreditCard size={24} />
                                            </div>
                                        </div>
                                        <div className="absolute top-6 right-20 text-2xl">📡</div>
                                    </div>
                                    {cartoes.length > 1 && (
                                        <div className="flex justify-center gap-2 mt-4">
                                            <button onClick={handleCartaoAnterior} className="p-2 hover:bg-gray-100 rounded-full">
                                                <ChevronLeft size={20} />
                                            </button>
                                            <div className="flex gap-2 items-center">
                                                {cartoes.map((_, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`h-2 rounded-full transition-all ${idx === cartaoAtivo ? 'w-8 bg-gray-900' : 'w-2 bg-gray-300'}`}
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
                        ) : (
                            <div className="bg-white rounded-3xl shadow-lg p-8 mb-6 text-center">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CreditCard size={40} className="text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Nenhum cartão cadastrado</h3>
                                <p className="text-gray-500 text-sm">Adicione um cartão para continuar com o pagamento</p>
                            </div>
                        )}
                        <button
                            onClick={() => setAdicionandoCartao(!adicionandoCartao)}
                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-verde-salvia hover:text-verde-salvia-600 transition-all flex items-center justify-center gap-2 mb-6"
                        >
                            <Plus size={20} />
                            Adicionar cartão
                        </button>
                        {adicionandoCartao && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                                <h3 className="font-bold text-gray-800 mb-4">Adicionar cartão</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Número do cartão</label>
                                    <input
                                        type="text"
                                        placeholder="1234 1234 1234 1234"
                                        maxLength="19"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-verde-salvia focus:border-transparent outline-none"
                                        value={novoCartao.numero}
                                        onChange={(e) => setNovoCartao({ ...novoCartao, numero: formatarNumeroCartao(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome (como no cartão)</label>
                                    <input
                                        type="text"
                                        placeholder="NOME COMPLETO"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-verde-salvia focus:border-transparent outline-none uppercase"
                                        value={novoCartao.nome}
                                        onChange={(e) => setNovoCartao({ ...novoCartao, nome: e.target.value.toUpperCase() })}
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Validade</label>
                                        <input
                                            type="text"
                                            placeholder="MM/AA"
                                            maxLength="5"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-verde-salvia focus:border-transparent outline-none"
                                            value={novoCartao.validade}
                                            onChange={(e) => setNovoCartao({ ...novoCartao, validade: formatarValidade(e.target.value) })}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                                        <input
                                            type="text"
                                            placeholder="123"
                                            maxLength="4"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-verde-salvia focus:border-transparent outline-none"
                                            value={novoCartao.cvv}
                                            onChange={(e) => setNovoCartao({ ...novoCartao, cvv: e.target.value.replace(/\D/g, '') })}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                                        <input
                                            type="text"
                                            placeholder="CPF"
                                            maxLength="14"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-verde-salvia focus:border-transparent outline-none text-xs"
                                            value={novoCartao.cpf}
                                            onChange={(e) => setNovoCartao({ ...novoCartao, cpf: e.target.value.replace(/\D/g, '') })}
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleAdicionarCartao}
                                    disabled={salvandoCartao}
                                    className={`w-full py-3 rounded-full font-semibold text-white transition-all shadow-lg ${salvandoCartao ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#85B693] hover:bg-[#2F6C50] active:scale-95'
                                        }`}
                                >
                                    {salvandoCartao ? 'Salvando...' : 'Salvar Cartão'}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="">
                        <SumarioOrdem
                            resumo={resumo}
                            onCriarAssinatura={handleContinuar}
                            loading={processandoPagamento}
                        />
                    </div>
                </div>
                <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg z-40">
                    <button
                        onClick={handleContinuar}
                        disabled={processandoPagamento}
                        className={`w-full py-3 rounded-full font-semibold text-white transition-all shadow-lg ${processandoPagamento ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800 active:scale-95'
                            }`}
                    >
                        {processandoPagamento ? 'Processando...' : `Continuar R$ ${resumo?.total.toFixed(2).replace('.', ',') || '0,00'}`}
                    </button>
                </div>
            </main>
            <CVVModal
                isOpen={mostrarCVVModal}
                onClose={() => setMostrarCVVModal(false)}
                onConfirm={handleConfirmarCVV}
            />
        </div>
    );
}

