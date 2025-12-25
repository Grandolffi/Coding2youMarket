import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
// Páginas existentes (Legado/Auth)
import Login from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ConfirmacaoEmailPage from "./pages/CofirmacaoEmailPage";
import ConfirmacaoEmailCode from "./pages/ConfirmacaoEmailCode";
import SegurancaPage from "./pages/SegurancaPage";
import RedefinirSenhaPage from "./pages/RedefinirSenhaPage";
import NovoEnderecoModal from "./pages/NovoEndereco";
// Nova Página Principal
import HomePage from "./pages/HomePage";
// Página de Perfil
import PerfilPage from "./pages/PerfilPage";
import CarrinhoPage from "./pages/CarrinhoPage";
import PagamentoPage from './pages/PagamentoPage';
import MeusCartoesPage from './pages/meusCartoesPage';
import DadosPessoaisPage from './pages/DadosPessoaisPage';
import SuportePage from './pages/SuportePage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';
import MeusPedidosPage from './pages/MeusPedidosPage';
import ClubMarketPage from './pages/ClubMarketPage';
import ProtectedRoute from './components/ProtectedRoute';
import { CarrinhoProvider } from './context/CarrinhoContext';
function App() {
  return (
    <Router>
      <CarrinhoProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              duration: 3000,
              style: {
                background: '#10b981',
                color: '#fff',
                fontWeight: '600',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#10b981',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: '#ef4444',
                color: '#fff',
                fontWeight: '600',
              },
            },
            loading: {
              style: {
                background: '#3b82f6',
                color: '#fff',
                fontWeight: '600',
              },
            },
          }}
        />
        <Routes>
          {/* Rota principal agora é a Home (Catálogo) */}
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/carrinho" element={<ProtectedRoute><CarrinhoPage /></ProtectedRoute>} />
          <Route path="/pagamento" element={<ProtectedRoute><PagamentoPage /></ProtectedRoute>} />
          {/* Rotas de Autenticação */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/confirmacaoEmail" element={<ConfirmacaoEmailPage />} />
          <Route path="/confirmacaoEmailCode" element={<ConfirmacaoEmailCode />} />
          <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />
          {/* Rotas de Funcionalidades */}
          <Route path="/novoEndereco" element={<ProtectedRoute><NovoEnderecoModal /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><PerfilPage /></ProtectedRoute>} />
          <Route path="/dados-pessoais" element={<ProtectedRoute><DadosPessoaisPage /></ProtectedRoute>} />
          <Route path="/suporte" element={<ProtectedRoute><SuportePage /></ProtectedRoute>} />
          <Route path="/configuracoes" element={<ProtectedRoute><ConfiguracoesPage /></ProtectedRoute>} />
          <Route path="/meus-cartoes" element={<ProtectedRoute><MeusCartoesPage /></ProtectedRoute>} />
          <Route path="/pedidos" element={<ProtectedRoute><MeusPedidosPage /></ProtectedRoute>} />
          <Route path="/club-market" element={<ProtectedRoute><ClubMarketPage /></ProtectedRoute>} />
          <Route path="/seguranca" element={<SegurancaPage />} />
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <h1 className="text-2xl font-bold text-gray-400">Página não encontrada</h1>
            </div>
          } />
        </Routes>
      </CarrinhoProvider>
    </Router>
  );
}
export default App;