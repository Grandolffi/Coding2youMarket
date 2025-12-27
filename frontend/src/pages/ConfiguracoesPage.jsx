import { useState } from 'react';
import { ArrowLeft, Bell, Moon, Globe, Volume2, Eye, Smartphone, Shield, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';

export default function ConfiguracoesPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [configuracoes, setConfiguracoes] = useState({
        notificacoesPush: true,
        notificacoesEmail: true,
        notificacoesPromocoes: false,
        modoEscuro: false,
        idioma: 'pt-BR',
        som: true,
        vibrar: true,
        localizacao: true,
        dadosMoveis: false
    });

    const toggleConfig = (key) => {
        setConfiguracoes(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const ToggleSwitch = ({ value, onChange }) => (
        <button
            onClick={onChange}
            className={`relative w-12 h-7 rounded-full transition-all duration-300 ${value ? 'bg-green-500' : 'bg-gray-300'
                }`}
        >
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${value ? 'left-6' : 'left-1'
                }`} />
        </button>
    );

    const ConfigItem = ({ icon, titulo, descricao, value, onChange, type = 'toggle' }) => (
        <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                    {icon}
                </div>
                <div>
                    <p className="font-medium text-gray-800">{titulo}</p>
                    {descricao && <p className="text-xs text-gray-500 mt-0.5">{descricao}</p>}
                </div>
            </div>
            {type === 'toggle' && <ToggleSwitch value={value} onChange={onChange} />}
            {type === 'arrow' && <ChevronRight size={20} className="text-gray-400" />}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <Header />

            <div className="relative h-48 md:h-56 w-full mb-8 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200"
                    alt={t('settingsPage.title')}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-emerald-800/50" />
                <div className="relative z-10 h-full container mx-auto px-4 md:px-8 flex items-center max-w-7xl pt-20">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-full mr-4 transition-all">
                        <ArrowLeft className="text-white" size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{t('settingsPage.title')}</h1>
                        <p className="text-white/80 text-sm mt-1">{t('settingsPage.subtitle')}</p>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50 rounded-t-3xl"></div>
            </div>

            <main className="container mx-auto px-4 md:px-8 max-w-3xl">

                <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Bell size={20} className="text-green-600" />
                        {t('settingsPage.notifications.title')}
                    </h3>

                    <ConfigItem
                        icon={<Bell size={18} />}
                        titulo={t('settingsPage.notifications.push.title')}
                        descricao={t('settingsPage.notifications.push.description')}
                        value={configuracoes.notificacoesPush}
                        onChange={() => toggleConfig('notificacoesPush')}
                    />
                    <ConfigItem
                        icon={<Bell size={18} />}
                        titulo={t('settingsPage.notifications.email.title')}
                        descricao={t('settingsPage.notifications.email.description')}
                        value={configuracoes.notificacoesEmail}
                        onChange={() => toggleConfig('notificacoesEmail')}
                    />
                    <ConfigItem
                        icon={<Bell size={18} />}
                        titulo={t('settingsPage.notifications.promotions.title')}
                        descricao={t('settingsPage.notifications.promotions.description')}
                        value={configuracoes.notificacoesPromocoes}
                        onChange={() => toggleConfig('notificacoesPromocoes')}
                    />
                </div>

                <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Eye size={20} className="text-green-600" />
                        {t('settingsPage.appearance.title')}
                    </h3>

                    <ConfigItem
                        icon={<Moon size={18} />}
                        titulo={t('settingsPage.appearance.darkMode.title')}
                        descricao={t('settingsPage.appearance.darkMode.description')}
                        value={configuracoes.modoEscuro}
                        onChange={() => toggleConfig('modoEscuro')}
                    />

                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                                <Globe size={18} />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">{t('settingsPage.appearance.language.title')}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{t('settingsPage.appearance.language.description')}</p>
                            </div>
                        </div>
                        <select
                            value={configuracoes.idioma}
                            onChange={(e) => setConfiguracoes({ ...configuracoes, idioma: e.target.value })}
                            className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="pt-BR">{t('settingsPage.appearance.language.options.ptBR')}</option>
                            <option value="en-US">{t('settingsPage.appearance.language.options.enUS')}</option>
                            <option value="es-ES">{t('settingsPage.appearance.language.options.esES')}</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Smartphone size={20} className="text-green-600" />
                        {t('settingsPage.system.title')}
                    </h3>

                    <ConfigItem
                        icon={<Volume2 size={18} />}
                        titulo={t('settingsPage.system.sounds.title')}
                        descricao={t('settingsPage.system.sounds.description')}
                        value={configuracoes.som}
                        onChange={() => toggleConfig('som')}
                    />
                    <ConfigItem
                        icon={<Smartphone size={18} />}
                        titulo={t('settingsPage.system.vibration.title')}
                        descricao={t('settingsPage.system.vibration.description')}
                        value={configuracoes.vibrar}
                        onChange={() => toggleConfig('vibrar')}
                    />
                    <ConfigItem
                        icon={<Globe size={18} />}
                        titulo={t('settingsPage.system.location.title')}
                        descricao={t('settingsPage.system.location.description')}
                        value={configuracoes.localizacao}
                        onChange={() => toggleConfig('localizacao')}
                    />
                    <ConfigItem
                        icon={<Shield size={18} />}
                        titulo={t('settingsPage.system.mobileData.title')}
                        descricao={t('settingsPage.system.mobileData.description')}
                        value={configuracoes.dadosMoveis}
                        onChange={() => toggleConfig('dadosMoveis')}
                    />
                </div>

                <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-6">
                    <div
                        className="flex items-center justify-between p-5 cursor-not-allowed opacity-50 transition-all border-b border-gray-100"
                        title={t('settingsPage.other.inDevelopment')}
                    >
                        <span className="font-medium text-gray-800">{t('settingsPage.other.clearCache')}</span>
                        <ChevronRight size={20} className="text-gray-400" />
                    </div>
                    <div
                        className="flex items-center justify-between p-5 cursor-not-allowed opacity-50 transition-all border-b border-gray-100"
                        title={t('settingsPage.other.inDevelopment')}
                    >
                        <span className="font-medium text-gray-800">{t('settingsPage.other.termsOfUse')}</span>
                        <ChevronRight size={20} className="text-gray-400" />
                    </div>
                    <div
                        className="flex items-center justify-between p-5 cursor-not-allowed opacity-50 transition-all"
                        title={t('settingsPage.other.inDevelopment')}
                    >
                        <span className="font-medium text-gray-800">{t('settingsPage.other.privacyPolicy')}</span>
                        <ChevronRight size={20} className="text-gray-400" />
                    </div>
                </div>

                <div className="text-center text-gray-400 text-sm">
                    <p>{t('settingsPage.version')}</p>
                    <p className="mt-1">{t('settingsPage.copyright')}</p>
                </div>
            </main>
        </div>
    );
}
