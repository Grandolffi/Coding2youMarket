import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Páginas existentes (Legado/Auth)
import Login from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ConfirmacaoEmailPage from "./pages/CofirmacaoEmailPage";
import ConfirmacaoEmailCode from "./pages/ConfirmacaoEmailCode";
import RedefinirSenhaPage from "./pages/RedefinirSenhaPage";
import NovoEnderecoModal from "./pages/NovoEndereco";
// Nova Página Principal
import HomePage from "./pages/HomePage";
function App() {
  return (
    <Router>
      <Routes>
        {/* Rota principal agora é a Home (Catálogo) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        {/* Rotas de Autenticação */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/confirmacaoEmail" element={<ConfirmacaoEmailPage />} />
        <Route path="/confirmacaoEmailCode" element={<ConfirmacaoEmailCode />} />
        <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />
        {/* Rotas de Funcionalidades */}
        <Route path="/novoEndereco" element={<NovoEnderecoModal />} />

        {/* Fallback 404 (Opcional, mas recomendado) */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-2xl font-bold text-gray-400">Página não encontrada</h1>
          </div>
        } />
      </Routes>
    </Router>
  );
}
export default App;