const IMAGENS_CATEGORIAS = {
    'Hortifruti': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&h=200&fit=crop',
    'Carnes': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=200&h=200&fit=crop',
    'Laticínios': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&h=200&fit=crop',
    'Padaria': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop',
    'Bebidas': 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=200&h=200&fit=crop',
    'Mercearia': 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200&h=200&fit=crop'
};

export default function CategoryCard({ nome, ativo, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex-shrink-0 flex flex-col items-center gap-2 transition-transform hover:scale-105 ${ativo ? 'scale-110' : ''
                }`}
        >
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 transition-all ${ativo ? 'border-green-500 shadow-lg' : 'border-white shadow-md hover:border-green-200'
                }`}>
                <img
                    src={IMAGENS_CATEGORIAS[nome] || 'https://via.placeholder.com/100?text=' + nome}
                    alt={nome}
                    className="w-full h-full object-cover"
                />
            </div>
            <span className={`font-semibold text-sm ${ativo ? 'text-green-700' : 'text-gray-700'
                }`}>
                {nome}
            </span>
        </button>
    );
}