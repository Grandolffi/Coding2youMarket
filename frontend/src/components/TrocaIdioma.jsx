import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TrocaIdioma() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'pt' ? 'en' : 'pt';
        i18n.changeLanguage(newLang);
        localStorage.setItem('language', newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-colors"
            title={i18n.language === 'pt' ? 'Switch to English' : 'Mudar para Português'}
        >
            <Globe size={18} className="text-emerald-600" />
            <span className="text-sm font-medium text-gray-700">
                {i18n.language === 'pt' ? 'EN' : 'PT'}
            </span>
        </button>
    );
}
