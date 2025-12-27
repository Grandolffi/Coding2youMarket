import { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, Edit2, Check, X, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import { buscarClienteDados, editarCliente } from '../api/clienteAPI';
import toast from 'react-hot-toast';

export default function DadosPessoaisPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [usuario, setUsuario] = useState(null);
    const [editando, setEditando] = useState(false);
    const [dadosTemp, setDadosTemp] = useState(null);
    const [salvando, setSalvando] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const dados = await buscarClienteDados();
                if (dados) {
                    const usuarioFormatado = {
                        id: dados.id,
                        nome: dados.nome || '',
                        email: dados.email || '',
                        telefone: dados.telefone || '',
                        cpf: dados.cpf || '',
                        genero: dados.genero || 'Não informado',
                        foto: dados.foto || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face'
                    };
                    setUsuario(usuarioFormatado);
                    setDadosTemp(usuarioFormatado);
                }
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        };

        carregarDados();
    }, []);

    const handleEditar = () => {
        setDadosTemp(usuario);
        setEditando(true);
    };

    const handleCancelar = () => {
        setDadosTemp(usuario);
        setEditando(false);
    };

    const handleSalvar = async () => {
        setSalvando(true);

        try {
            const dadosParaEnviar = {
                nome: dadosTemp.nome,
                email: dadosTemp.email,
                telefone: dadosTemp.telefone.replace(/\D/g, ''),
                cpf: dadosTemp.cpf.replace(/\D/g, '')
            };

            const resultado = await editarCliente(dadosParaEnviar);

            if (resultado.success) {
                setUsuario(dadosTemp);
                setEditando(false);
                toast.success(t('personalDataPage.toast.success'));
            } else {
                toast.error(resultado.message || t('personalDataPage.toast.error'));
            }
        } catch (error) {
            console.error("Erro ao salvar:", error);
            toast.error(t('personalDataPage.toast.saveError'));
        } finally {
            setSalvando(false);
        }
    };

    const formatarTelefone = (valor) => {
        const numeros = valor.replace(/\D/g, '');
        if (numeros.length <= 2) return `(${numeros}`;
        if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
    };

    const formatarCPF = (valor) => {
        const numeros = valor.replace(/\D/g, '');
        if (numeros.length <= 3) return numeros;
        if (numeros.length <= 6) return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
        if (numeros.length <= 9) return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
        return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9, 11)}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <Header />

            <div className="relative h-48 md:h-56 w-full mb-8 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200"
                    alt={t('personalDataPage.title')}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-emerald-800/50" />
                <div className="relative z-10 h-full container mx-auto px-4 md:px-8 flex items-center max-w-7xl pt-20">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-full mr-4 transition-all">
                        <ArrowLeft className="text-white" size={24} />
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{t('personalDataPage.title')}</h1>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50 rounded-t-3xl"></div>
            </div>

            <main className="container mx-auto px-4 md:px-8 max-w-3xl">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : !usuario ? (
                    <div className="bg-white rounded-3xl shadow-lg p-6 text-center">
                        <p className="text-gray-600">{t('personalDataPage.errorLoading')}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all"
                        >
                            {t('personalDataPage.tryAgain')}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6 relative">
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl">
                                        <img
                                            src={usuario.foto}
                                            alt="Foto de perfil"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {editando && (
                                        <button className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                            <Camera size={18} className="text-white" />
                                        </button>
                                    )}
                                </div>
                                <h2 className="mt-4 text-xl font-bold text-gray-800">{usuario.nome}</h2>
                                <p className="text-gray-500 text-sm">{usuario.email}</p>
                            </div>

                            {!editando && (
                                <button
                                    onClick={handleEditar}
                                    className="absolute top-6 right-6 p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-all"
                                >
                                    <Edit2 size={18} className="text-gray-600" />
                                </button>
                            )}
                        </div>

                        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
                            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <User size={20} className="text-green-600" />
                                {t('personalDataPage.personalInfo')}
                            </h3>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        {t('personalDataPage.fullName')}
                                    </label>
                                    {editando ? (
                                        <input
                                            type="text"
                                            value={dadosTemp.nome}
                                            onChange={(e) => setDadosTemp({ ...dadosTemp, nome: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                                            <User size={18} className="text-gray-400" />
                                            <span className="text-gray-800">{usuario.nome}</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        {t('personalDataPage.email')}
                                        {editando && (
                                            <span className="ml-2 text-xs text-gray-400 font-normal">{t('personalDataPage.notEditable')}</span>
                                        )}
                                    </label>
                                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-xl">
                                        <Mail size={18} className="text-gray-400" />
                                        <span className="text-gray-600">{usuario.email}</span>
                                        <svg className="w-4 h-4 text-gray-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        {t('personalDataPage.phone')}
                                    </label>
                                    {editando ? (
                                        <input
                                            type="text"
                                            value={dadosTemp.telefone}
                                            onChange={(e) => setDadosTemp({ ...dadosTemp, telefone: formatarTelefone(e.target.value) })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                            maxLength={15}
                                        />
                                    ) : (
                                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                                            <Phone size={18} className="text-gray-400" />
                                            <span className="text-gray-800">{usuario.telefone}</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        {t('personalDataPage.cpf')}
                                    </label>
                                    {editando ? (
                                        <input
                                            type="text"
                                            value={dadosTemp.cpf}
                                            onChange={(e) => setDadosTemp({ ...dadosTemp, cpf: formatarCPF(e.target.value) })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                            maxLength={14}
                                        />
                                    ) : (
                                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                                            <span className="text-gray-400 text-sm font-medium">{t('personalDataPage.cpf')}</span>
                                            <span className="text-gray-800">{usuario.cpf}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {editando && (
                            <div className="flex gap-4 mb-6">
                                <button
                                    onClick={handleCancelar}
                                    className="flex-1 py-4 bg-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                                >
                                    <X size={20} />
                                    {t('personalDataPage.cancel')}
                                </button>
                                <button
                                    onClick={handleSalvar}
                                    disabled={salvando}
                                    className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-full hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {salvando ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            {t('personalDataPage.saving')}
                                        </>
                                    ) : (
                                        <>
                                            <Check size={20} />
                                            {t('personalDataPage.saveChanges')}
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-xl">🔒</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-amber-800 mb-1">{t('personalDataPage.securityTip.title')}</h4>
                                    <p className="text-sm text-amber-700">
                                        {t('personalDataPage.securityTip.description')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
