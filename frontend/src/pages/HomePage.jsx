
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { useTranslation } from 'react-i18next';
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import ClubMarketModal from "../components/ClubMarketModal";
import { listarProdutos } from '../api/produtoAPI';

// Dados mockados para testar (remover depois que a API funcionar)
const MOCK_CATEGORIAS = ['Hortifruti', 'Carnes', 'Laticínios', 'Padaria', 'Bebidas', 'Mercearia'];

const MOCK_PRODUTOS = [
  { id: 1, nome: 'Maçã Gala', categoria: 'Hortifruti', preco: 8.90, estoque: 50, imagemUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300' },
  { id: 2, nome: 'Banana Prata', categoria: 'Hortifruti', preco: 5.50, estoque: 30, descontoClub: true, imagemUrl: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300' },
  { id: 3, nome: 'Leite Integral', categoria: 'Laticínios', preco: 4.99, estoque: 20, imagemUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300' },
  { id: 4, nome: 'Pão Francês', categoria: 'Padaria', preco: 12.00, estoque: 15, imagemUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300' },
];

export default function HomePage() {
  const { t } = useTranslation();
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  const [usandoMock, setUsandoMock] = useState(false);
  const [showClubModal, setShowClubModal] = useState(false);
  const navigate = useNavigate();
  const modalChecked = useRef(false); // Usar ref ao invés de window

  useEffect(() => {
    carregarDados();
    verificarExibicaoModal();
  }, []);

  const verificarExibicaoModal = () => {
    // Prevenir execução duplicada usando ref
    if (modalChecked.current) return;
    modalChecked.current = true;

    const jaViu = localStorage.getItem('clubModalVisto');

    if (!jaViu) {
      // Primeiro login - sempre mostra
      setTimeout(() => setShowClubModal(true), 2000);
      localStorage.setItem('clubModalVisto', 'true');
    } else {
      // Chance de 30% de mostrar novamente  
      const chance = Math.random();
      if (chance < 0.8) {
        setTimeout(() => setShowClubModal(true), 3000);
      }
    }
  };

  const carregarDados = async () => {
    try {
      const data = await listarProdutos();
      if (data?.success && data.produtos?.length > 0) {
        setProdutos(data.produtos);
        const cats = [...new Set(data.produtos.map(p => p.categoria))];
        setCategorias(cats);
      } else {
        // Se a API não retornar dados, usa mock
        console.warn('API não retornou produtos, usando dados mockados');
        setProdutos(MOCK_PRODUTOS);
        setCategorias(MOCK_CATEGORIAS);
        setUsandoMock(true);
      }
    } catch (error) {
      console.error("Erro ao carregar da API, usando dados mockados:", error);
      setProdutos(MOCK_PRODUTOS);
      setCategorias(MOCK_CATEGORIAS);
      setUsandoMock(true);
    } finally {
      setLoading(false);
    }
  };

  const produtosFiltrados = produtos.filter(p => {
    const matchNome = p.nome.toLowerCase().includes(filtro.toLowerCase());
    const matchCategoria = categoriaAtiva ? p.categoria === categoriaAtiva : true;
    return matchNome && matchCategoria;
  });
  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      <Header />
      {/* Hero Section - Club Market */}
      <div className="relative h-[350px] md:h-[450px] w-full mb-8 pt-20 rounded-b-3xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200"
          alt="Banner Promocional"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

        <div className="relative z-10 h-full container mx-auto px-4 md:px-8 flex flex-col justify-center max-w-7xl">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white max-w-xl">
            {t('home.clubBanner.title')}{' '}
            <span className="text-green-400">{t('home.clubBanner.subtitle')}</span>
          </h1>
          <button
            onClick={() => setShowClubModal(true)}
            className="bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full text-white font-semibold hover:bg-white/30 transition-all w-max shadow-lg"
          >
            {t('home.clubBanner.cta')}
          </button>
        </div>
      </div>
      <main className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Badge de Modo Demo */}
        {usandoMock && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 mb-6 rounded">
            <p className="text-sm"><strong>Modo Demo:</strong> Exibindo dados de exemplo. Faça login para ver produtos reais da API.</p>
          </div>
        )}
        {/* Barra de Busca */}
        <div className="glass rounded-2xl p-3 mb-10 flex items-center gap-4 max-w-2xl mx-auto -mt-16 relative z-20">
          <Search className="text-gray-500 ml-2" size={20} />
          <input
            type="text"
            placeholder={t('home.search')}
            className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-500"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <Filter size={20} className="text-gray-600" />
          </button>
        </div>
        {/* Seção de Categorias */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">{t('home.categories')}</h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            <CategoryCard
              key="all"
              nome={t('home.allCategories')}
              ativo={categoriaAtiva === null}
              onClick={() => setCategoriaAtiva(null)}
            />
            {categorias.map(cat => (
              <CategoryCard
                key={cat}
                nome={cat}
                ativo={categoriaAtiva === cat}
                onClick={() => setCategoriaAtiva(categoriaAtiva === cat ? null : cat)}
              />
            ))}
          </div>
        </section>

        {/* Grid de Produtos */}
        <section>
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-3">
            <h2 className="text-2xl font-bold text-gray-800">
              {categoriaAtiva || t('home.allProducts')}
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-sm">{t('home.itemsCount', { count: produtosFiltrados.length })}</span>
              {categoriaAtiva && (
                <button
                  onClick={() => setCategoriaAtiva(null)}
                  className="text-green-600 hover:text-green-700 font-medium text-sm hover:underline"
                >
                  {t('home.viewAll')}
                </button>
              )}
            </div>
          </div>
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {produtosFiltrados.map(produto => (
                <ProductCard key={produto.id} produto={produto} />
              ))}
            </div>
          )}
          {!loading && produtosFiltrados.length === 0 && (
            <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-100">
              <p className="text-lg">{t('home.noProducts')}</p>
              <button
                onClick={() => { setFiltro(''); setCategoriaAtiva(null) }}
                className="mt-4 text-green-600 font-medium hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </section>

      </main>

      {/* Club Modal */}
      {showClubModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-green-600 to-emerald-500 p-6 rounded-t-3xl">
              <button
                onClick={() => setShowClubModal(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all"
              >
                ✕
              </button>
              <div className="text-center">
                <span className="text-4xl mb-2 block">⭐</span>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Club Market</h2>
                <p className="text-white/80 mt-2">Escolha o plano ideal para você</p>
              </div>
            </div>

            {/* Subscription Cards */}
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                {/* Plano Entrada */}
                <div className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-200 hover:border-green-300 transition-all">
                  <div className="text-center mb-4">
                    <span className="text-3xl">🌱</span>
                    <h3 className="text-lg font-bold text-gray-800 mt-2">Entrada</h3>
                  </div>
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-gray-800">R$ 9,90</span>
                    <span className="text-gray-500 text-sm">/mês</span>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 mb-4">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Frete grátis
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-gray-400">○</span> Sem desconto
                    </li>
                  </ul>
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                      0% desconto
                    </span>
                  </div>
                </div>

                {/* Plano Intermediário */}
                <div className="bg-green-50 rounded-2xl p-5 border-2 border-green-400 shadow-lg relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                    POPULAR
                  </div>
                  <div className="text-center mb-4">
                    <span className="text-3xl">🌿</span>
                    <h3 className="text-lg font-bold text-gray-800 mt-2">Intermediário</h3>
                  </div>
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-green-600">R$ 19,90</span>
                    <span className="text-gray-500 text-sm">/mês</span>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 mb-4">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Frete grátis
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> 10% de desconto
                    </li>
                  </ul>
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                      10% desconto
                    </span>
                  </div>
                </div>

                {/* Plano Premium */}
                <div className="bg-gradient-to-b from-amber-50 to-orange-50 rounded-2xl p-5 border-2 border-amber-300 hover:border-amber-400 transition-all">
                  <div className="text-center mb-4">
                    <span className="text-3xl">👑</span>
                    <h3 className="text-lg font-bold text-gray-800 mt-2">Premium</h3>
                  </div>
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-amber-600">R$ 39,90</span>
                    <span className="text-gray-500 text-sm">/mês</span>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 mb-4">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Frete grátis
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> 25% de desconto
                    </li>
                  </ul>
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-medium">
                      25% desconto
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setShowClubModal(false);
                    navigate('/club-market');
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold rounded-full hover:shadow-lg hover:scale-105 transition-all"
                >
                  Ver Todos os Planos →
                </button>
                <p className="text-gray-500 text-sm mt-3">
                  Cancele quando quiser, sem compromisso.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Promocional Club Market */}
      <ClubMarketModal
        isOpen={showClubModal}
        onClose={() => setShowClubModal(false)}
      />
    </div>
  );
}