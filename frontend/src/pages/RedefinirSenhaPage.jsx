import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BotaoVerde from "../components/botaoVerde";
import { atualizarSenha, getUsuarioId } from "../api/auth";

export default function RedefinirSenhaPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const emailUsuario =
    location.state?.email || localStorage.getItem("email_recuperacao");

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  const handleRedefinir = async (e) => {
    e.preventDefault();

    if (!emailUsuario) {
      setMensagem({
        tipo: "erro",
        texto: "Sessão expirada. Refaça a recuperação de senha.",
      });
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMensagem({
        tipo: "erro",
        texto: "As senhas não coincidem.",
      });
      return;
    }

    if (novaSenha.length < 6) {
      setMensagem({
        tipo: "erro",
        texto: "A senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }

    try {
      setLoading(true);
      setMensagem({ tipo: "", texto: "" });

      console.log("Email usado na redefinição:", emailUsuario);

      const resultado = await atualizarSenha(emailUsuario, novaSenha);

      if (resultado.success) {
        setMensagem({
          tipo: "sucesso",
          texto: "Senha alterada com sucesso! Redirecionando...",
        });

        localStorage.removeItem("email_recuperacao");

        setTimeout(() => navigate("/login"), 2500);
      } else {
        setMensagem({
          tipo: "erro",
          texto: resultado.message,
        });
      }
    } catch (error) {
      setMensagem({
        tipo: "erro",
        texto: "Erro ao conectar com o servidor.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm">
        <span className="text-green-800 font-semibold text-lg block mb-6">
          ☕ Subscrivery
        </span>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Nova Senha
        </h2>

        <p className="text-gray-500 mb-6 text-sm">
          Crie uma nova senha para a conta{" "}
          <strong>{emailUsuario}</strong>
        </p>

        <form onSubmit={handleRedefinir} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">
              Nova Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-green-600 transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-green-600 transition-colors"
              required
            />
          </div>

          <div className="mt-2">
            <BotaoVerde
              mensagem={loading ? "Salvando..." : "Redefinir Senha"}
              type="submit"
              disabled={loading}
            />
          </div>
        </form>

        {mensagem.texto && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              mensagem.tipo === "erro"
                ? "text-red-500"
                : "text-green-700"
            }`}
          >
            {mensagem.texto}
          </p>
        )}
      </div>
    </div>
  );
}
