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
<<<<<<< Updated upstream
// Página de Perfil
import PerfilPage from "./pages/PerfilPage";
=======
>>>>>>> Stashed changes
import CarrinhoPage from "./pages/CarrinhoPage";
import PagamentoPage from './pages/PagamentoPage';
function App() {
  return (
    <Router>
      <Routes>
        {/* Rota principal agora é a Home (Catálogo) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/carrinho" element={<CarrinhoPage />} />
        <Route path="/pagamento" element={<PagamentoPage />} />
        {/* Rotas de Autenticação */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/confirmacaoEmail" element={<ConfirmacaoEmailPage />} />
        <Route path="/confirmacaoEmailCode" element={<ConfirmacaoEmailCode />} />
        <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />
        {/* Rotas de Funcionalidades */}
        <Route path="/novoEndereco" element={<NovoEnderecoModal />} />
        <Route path="/perfil" element={<PerfilPage />} />

        {/* Fallback 404 - pagina não encontrada */}
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