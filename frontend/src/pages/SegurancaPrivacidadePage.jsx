import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Header from "../components/Header";
import { buscarClienteDados } from "../api/clienteAPI";

export default function SegurancaPrivacidadePage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            const dados = await buscarClienteDados();
            setCliente(dados);
            setLoading(false);
        };
        carregarDados();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>{t('securityPrivacyPage.loading')}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('securityPrivacyPage.title')}</h1>
                <p className="text-gray-600 mb-2">{t('securityPrivacyPage.registeredEmail')}</p>
                <div className="bg-gray-100 rounded p-3 mb-4 text-center text-gray-800 font-mono">
                    {cliente?.email}
                </div>
                <p className="text-gray-600 mb-2">{t('securityPrivacyPage.password')}</p>
                <div className="bg-gray-100 rounded p-3 mb-6 text-center text-gray-800 font-mono">
                    ••••••••
                </div>
                <button
                    onClick={() => navigate("/confirmacaoEmail")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
                >
                    {t('securityPrivacyPage.sendCode')}
                </button>
            </div>
        </div>
    );
}
