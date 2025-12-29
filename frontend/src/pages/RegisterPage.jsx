import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BotaoVerde from "../components/botaoVerde";
import { FcGoogle } from "react-icons/fc";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { cadastrar } from "../api/auth";
import { validarCPF } from "../utils/validarCPF";
import logoPrincipal2 from "../assets/Logo Subscrivery/Logo Principal 2.png";


export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [verSenha, setVerSenha] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
  const navigate = useNavigate();

  const handleCadastro = async () => {
    setErro("");
    setMensagem({ tipo: "", texto: "" });
    if (!nome || !email || !cpf || !telefone || !senha || !confirmarSenha) {
      setMensagem({ tipo: "erro", texto: "Preencha todos os campos." });
      return;
    }

    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) {
      setMensagem({ tipo: "erro", texto: "Nome não pode conter números ou caracteres especiais." });
      return;
    }

    if (!/^[0-9\-()]+$/.test(telefone)) {
      setMensagem({ tipo: "erro", texto: "Telefone deve conter apenas números, hífen e parênteses." });
      return;
    }

    const digitsOnly = telefone.replace(/\D/g, "");
    if (digitsOnly.length > 15) {
      setMensagem({ tipo: "erro", texto: "Telefone não pode ter mais que 11 dígitos." });
      return;
    }
    if (!validarCPF(cpf)) {
      setMensagem({ tipo: "erro", texto: "CPF inválido." });
      return;
    }

    if (senha !== confirmarSenha) {
      setMensagem({ tipo: "erro", texto: "As senhas não conferem." });
      return;
    }

    if (!/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(senha)) {
      setMensagem({ tipo: "erro", texto: "Senha deve conter letra maiúscula, número e caractere especial." });
      return;
    }
    try {
      setLoading(true);
      const res = await cadastrar(nome, email, cpf, telefone, senha);
      if (res.success) {
        setMensagem({ tipo: "sucesso", texto: "Usuário cadastrado com sucesso!" });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMensagem({ tipo: "erro", texto: res.message || "Erro ao realizar cadastro." });
      }
    } catch (error) {
      setErro(error?.message || "Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-inter">
      {/* Lado Esquerdo - Formulário */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-8 bg-gradient-to-br from-white via-white to-green-50/30 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Card com borda verde sutil */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100">
            {/* Logo */}
            <div className="mb-6">
              <img src={logoPrincipal2} alt="Logo Subscrivery" className="h-10 w-auto object-contain mix-blend-multiply" />
            </div>
            {/* Título */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Cadastre-se</h1>
            <p className="text-sm text-gray-600 mb-6">
              Já possui uma conta?{" "}
              <Link to="/" className="text-verde-petroleo font-semibold underline hover:text-green-800">
                Fazer Login
              </Link>
            </p>
            {/* Mensagem de Erro/Sucesso */}
            {(mensagem.texto || erro) && (
              <div
                className={`p-3 rounded-lg mb-4 text-sm font-semibold text-center ${mensagem.tipo === "sucesso"
                  ? "bg-verde-salvia-50 text-verde-petroleo border border-verde-salvia-200"
                  : "bg-red-50 text-red-600 border border-red-200"
                  }`}
              >
                {mensagem.texto || erro}
              </div>
            )}
            {/* Nome */}
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
            <input
              type="text"
              className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 mb-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-verde-salvia focus:border-transparent transition-all"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            {/* CPF */}
            <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
            <input
              type="text"
              placeholder="000.000.000-00"
              maxLength={14}
              className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 mb-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-verde-salvia focus:border-transparent transition-all"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
            {/* Email */}
            <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
            <input
              type="email"
              className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 mb-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-verde-salvia focus:border-transparent transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* Celular */}
            <label className="block text-sm font-medium text-gray-700 mb-2">Celular</label>
            <input
              type="text"
              placeholder="(DDD) 00000-0000" maxLength={15}
              className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 mb-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-verde-salvia focus:border-transparent transition-all"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
            {/* Senha */}
            <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
            <div className="relative mb-3">
              <input
                type={verSenha ? "text" : "password"}
                className="w-full h-10 rounded-lg border border-gray-300 bg-white pl-3 pr-10 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-verde-salvia focus:border-transparent transition-all"
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
            {/* Confirmar Senha */}
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirme a Senha</label>
            <div className="relative mb-4">
              <input
                type={verSenha ? "text" : "password"}
                className="w-full h-10 rounded-lg border border-gray-300 bg-white pl-3 pr-10 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-verde-salvia focus:border-transparent transition-all"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
              <div
                onClick={() => setVerSenha(!verSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {verSenha ? <LuEyeOff size={18} /> : <LuEye size={18} />}
              </div>
            </div>
            {/* Botão Cadastrar */}
            <BotaoVerde
              mensagem={loading ? "Cadastrando..." : "Fazer Cadastro"}
              onClick={handleCadastro}
              disabled={loading}
            />
            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="h-px flex-1 bg-gray-200"></div>
              <span className="text-xs text-gray-500 uppercase">ou</span>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            {/* Google Button */}
            <button className="w-full h-12 rounded-full border border-gray-200 bg-white text-gray-700 font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
              <FcGoogle size={18} />
              Cadastrar com o Google
            </button>
          </div>
          {/* Detalhe verde sutil no rodapé */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Ao criar uma conta, você concorda com nossos{" "}
              <span className="text-verde-petroleo font-semibold cursor-pointer hover:underline">
                Termos de Uso
              </span>
            </p>
          </div>
        </div>
      </div>
      {/* Lado Direito - Hero (Escondido no mobile) */}
      <div className="hidden md:flex flex-1 relative items-center justify-center p-20 overflow-hidden" style={{ backgroundColor: '#2F6C50' }}>
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
