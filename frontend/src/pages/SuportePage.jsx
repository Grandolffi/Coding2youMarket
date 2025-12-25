import { useState } from 'react';
import { ArrowLeft, MessageCircle, Phone, Mail, HelpCircle, ChevronDown, ChevronUp, Send, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

// FAQ Mock
const FAQ_ITEMS = [
    {
        pergunta: "Como faço para rastrear meu pedido?",
        resposta: "Você pode rastrear seu pedido acessando a seção 'Meus Pedidos' no seu perfil. Lá você encontrará todas as informações e o status atualizado da entrega."
    },
    {
        pergunta: "Qual o prazo de entrega?",
        resposta: "O prazo de entrega varia de acordo com a sua localização. Geralmente, entregas na mesma cidade são realizadas em até 24 horas. Para outras regiões, o prazo pode ser de 3 a 7 dias úteis."
    },
    {
        pergunta: "Como solicitar reembolso?",
        resposta: "Para solicitar reembolso, entre em contato conosco através do chat ou e-mail. Analisaremos sua solicitação e, se aprovada, o valor será estornado em até 7 dias úteis."
    },
    {
        pergunta: "Posso alterar meu endereço de entrega?",
        resposta: "Sim! Você pode alterar o endereço de entrega antes do pedido ser despachado. Acesse 'Meus Pedidos' e clique em 'Alterar Endereço'."
    },
    {
        pergunta: "Quais formas de pagamento são aceitas?",
        resposta: "Aceitamos cartões de crédito (Visa, Mastercard, Elo, American Express), cartões de débito, PIX e boleto bancário."
    }
];

export default function SuportePage() {
    const navigate = useNavigate();
    const [faqAberto, setFaqAberto] = useState(null);
    const [mensagem, setMensagem] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [mensagemEnviada, setMensagemEnviada] = useState(false);

    const toggleFaq = (index) => {
        setFaqAberto(faqAberto === index ? null : index);
    };

    const handleEnviarMensagem = async () => {
        if (!mensagem.trim()) return;
        setEnviando(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setEnviando(false);
        setMensagemEnviada(true);
        setMensagem('');
        setTimeout(() => setMensagemEnviada(false), 3000);
    };

    const canaisContato = [
        {
            icon: <MessageCircle size={24} />,
            titulo: "Chat ao Vivo",
            descricao: "Em desenvolvimento",
            cor: "from-gray-400 to-gray-500",
            acao: () => { },
            desabilitado: true
        },
        {
            icon: <Phone size={24} />,
            titulo: "Telefone",
            descricao: "(11) 3000-0000",
            cor: "from-blue-500 to-blue-600",
            acao: () => window.open("tel:1130000000")
        },
        {
            icon: <Mail size={24} />,
            titulo: "E-mail",
            descricao: "suporte@subscrivery.com",
            cor: "from-purple-500 to-purple-600",
            acao: () => window.open("mailto:suporte@subscrivery.com")
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <Header />

            {/* Banner */}
            <div className="relative h-48 md:h-56 w-full mb-8 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200"
                    alt="Suporte"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-emerald-800/50" />
                <div className="relative z-10 h-full container mx-auto px-4 md:px-8 flex items-center max-w-7xl pt-20">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-full mr-4 transition-all">
                        <ArrowLeft className="text-white" size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">Suporte</h1>
                        <p className="text-white/80 text-sm mt-1">Estamos aqui para ajudar</p>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50 rounded-t-3xl"></div>
            </div>

            <main className="container mx-auto px-4 md:px-8 max-w-3xl">
                {/* Canais de Contato */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                    {canaisContato.map((canal, index) => (
                        <div
                            key={index}
                            onClick={canal.acao}
                            className="bg-white rounded-2xl shadow-lg p-4 cursor-pointer hover:scale-105 transition-all text-center"
                        >
                            <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${canal.cor} flex items-center justify-center text-white mb-3`}>
                                {canal.icon}
                            </div>
                            <h3 className="font-semibold text-gray-800 text-sm">{canal.titulo}</h3>
                            <p className="text-xs text-gray-500 mt-1 truncate">{canal.descricao}</p>
                        </div>
                    ))}
                </div>

                {/* Horário de Atendimento */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Headphones size={24} className="text-green-600" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-green-800">Horário de Atendimento</h4>
                            <p className="text-sm text-green-700">Segunda a Sexta: 8h às 20h | Sábado: 9h às 14h</p>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <HelpCircle size={20} className="text-green-600" />
                        Perguntas Frequentes
                    </h3>

                    <div className="space-y-3">
                        {FAQ_ITEMS.map((item, index) => (
                            <div
                                key={index}
                                className="border border-gray-100 rounded-xl overflow-hidden"
                            >
                                <div
                                    onClick={() => toggleFaq(index)}
                                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-all"
                                >
                                    <span className="font-medium text-gray-800 text-sm pr-4">{item.pergunta}</span>
                                    {faqAberto === index ? (
                                        <ChevronUp size={20} className="text-green-600 flex-shrink-0" />
                                    ) : (
                                        <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
                                    )}
                                </div>
                                {faqAberto === index && (
                                    <div className="px-4 pb-4 text-sm text-gray-600 bg-gray-50 border-t border-gray-100">
                                        <p className="pt-3">{item.resposta}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Formulário de Contato */}
                <div className="bg-white rounded-3xl shadow-lg p-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Mail size={20} className="text-green-600" />
                        Envie sua Mensagem
                    </h3>

                    {mensagemEnviada && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                            ✅ Mensagem enviada com sucesso! Responderemos em breve.
                        </div>
                    )}

                    <textarea
                        value={mensagem}
                        onChange={(e) => setMensagem(e.target.value)}
                        placeholder="Descreva sua dúvida ou problema..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none h-32"
                    />

                    <button
                        onClick={handleEnviarMensagem}
                        disabled={!mensagem.trim() || enviando}
                        className="mt-4 w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-full hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {enviando ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Enviando...
                            </>
                        ) : (
                            <>
                                <Send size={20} />
                                Enviar Mensagem
                            </>
                        )}
                    </button>
                </div>
            </main>
        </div>
    );
}
