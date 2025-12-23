import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BotaoVerde from "../components/botaoVerde";
import { FcGoogle } from "react-icons/fc";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { login, getUsuarioId } from "../api/auth";
import { meusEnderecos } from "../api/enderecoAPI";
export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
  const navigate = useNavigate();
  const handleLogin = async () => {
    setErro("");
    setMensagem({ tipo: "", texto: "" });
    if (!email || !senha) {
      setMensagem({
        tipo: "erro",
        texto: "Informe e-mail e senha.",
      });
      return;
    }
    try {
      setLoading(true);
      const res = await login(email, senha);
      if (res && res.token) {
        localStorage.setItem("token", res.token);
      }
      const usuarioId = getUsuarioId();
      if (!usuarioId) {
        setMensagem({ tipo: "erro", texto: "Não foi possível identificar o usuário." });
        return;
      }
      const enderecos = await meusEnderecos(usuarioId);
      if (enderecos && enderecos.length > 0) {
        setTimeout(() => navigate("/home"), 1500);
      } else {
        setTimeout(() => navigate("/novoEndereco"), 1500);
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setMensagem({
        tipo: "erro",
        texto: error.message || "E-mail ou senha incorretos."
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen font-inter">
      {/* Lado Esquerdo - Formulário */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <span className="text-lg font-semibold text-green-700">☕ Subscrivery</span>
          </div>
          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Faça Login</h1>
          <p className="text-sm text-gray-600 mb-6">
            Ainda não possui uma conta?{" "}
            <Link to="/register" className="text-green-700 font-semibold underline hover:text-green-800">
              Criar Conta
            </Link>
          </p>
          {/* Mensagem de Erro/Sucesso */}
          {(mensagem.texto || erro) && (
            <div
              className={`p-3 rounded-lg mb-4 text-sm font-semibold text-center ${mensagem.tipo === "sucesso"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-600"
                }`}
            >
              {mensagem.texto || erro}
            </div>
          )}
          {/* Email */}
          <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            className="w-full h-11 rounded-lg border border-gray-300 bg-gray-50 px-3 mb-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* Senha */}
          <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
          <div className="relative mb-4">
            <input
              type={verSenha ? "text" : "password"}
              placeholder="********"
              className="w-full h-11 rounded-lg border border-gray-300 bg-gray-50 pl-3 pr-10 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <div
              onClick={() => setVerSenha(!verSenha)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
            >
              {verSenha ? <LuEyeOff size={18} /> : <LuEye size={18} />}
            </div>
          </div>
          {/* Lembrar / Esqueceu */}
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-green-700" />
              <span>Lembre-se de mim</span>
            </label>
            <Link to="/confirmacaoEmail" className="text-xs text-green-700 font-semibold hover:underline">
              Esqueceu a senha?
            </Link>
          </div>
          {/* Botão Login */}
          <BotaoVerde
            mensagem={loading ? "Carregando..." : "Fazer Login"}
            onClick={handleLogin}
            disabled={loading}
          />
          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-gray-200"></div>
            <span className="text-xs text-gray-500 uppercase">ou</span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          {/* Google Button */}
          <button className="w-full h-12 rounded-full border border-gray-200 bg-gray-50 text-gray-700 font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition-all">
            <FcGoogle size={18} />
            Continuar com o Google
          </button>
        </div>
      </div>
      {/* Lado Direito - Hero (Escondido no mobile) */}
      <div className="hidden md:flex flex-1 relative bg-green-700 items-center justify-center p-20 overflow-hidden">
        {/* Blob Effect */}
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl"></div>
        {/* Suporte */}
        <div className="absolute top-10 right-10 flex items-center gap-2 text-white/90 text-sm">
          <span>🌐</span>
          <span>Suporte</span>
        </div>
        {/* Texto Hero */}
        <h2 className="text-6xl font-extrabold text-white leading-tight max-w-md z-10">
          O essencial,<br />sempre em dia.
        </h2>
      </div>
    </div>
  );
}