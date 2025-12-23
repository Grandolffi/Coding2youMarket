import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
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
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  const [usandoMock, setUsandoMock] = useState(false);
  useEffect(() => {
    carregarDados();
  }, []);

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
      {/* Hero Section */}
      <div className="relative h-[350px] md:h-[450px] w-full mb-8 pt-20">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200"
          alt="Banner Promocional"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

        <div className="relative z-10 h-full container mx-auto px-4 md:px-8 flex flex-col justify-center max-w-7xl">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white max-w-xl">
            Garanta sua ceia com desconto exclusivo no{' '}
            <span className="text-green-400">Clube+</span>
          </h1>
          <button className="bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full text-white font-semibold hover:bg-white/30 transition-all w-max shadow-lg">
            Entrar no Clube
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
            placeholder="O que você procura hoje?"
            className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-500"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <Filter size={20} className="text-gray-600" />
          </button>
        </div>
        {/* Categorias */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Categorias</h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
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
              {categoriaAtiva || 'Todos os Produtos'}
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-sm">{produtosFiltrados.length} itens</span>
              {categoriaAtiva && (
                <button
                  onClick={() => setCategoriaAtiva(null)}
                  className="text-green-600 hover:text-green-700 font-medium text-sm hover:underline"
                >
                  Ver todos
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
              <p className="text-lg">Nenhum produto encontrado.</p>
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
    </div>
  );
}