

// BANNERS
import banner1 from './Banners - Subscrivery/banner 1.jpg';
import banner2 from './Banners - Subscrivery/banner 2.jpeg';
import banner3 from './Banners - Subscrivery/banner 3.png';
import mulherPerfil from './Banners - Subscrivery/mulher do perfil.jpg';

// CATEGORIAS
import categoriaBebidas from './Categorias - Subscrivery/bebidas.jpg';
import categoriaCarnes from './Categorias - Subscrivery/carnes.jpg';
import categoriaHortfruit from './Categorias - Subscrivery/hortfruit.jpg';
import categoriaLaticinios from './Categorias - Subscrivery/laticinios.jpg';
import categoriaMercearia from './Categorias - Subscrivery/mercearia.jpg';
import categoriaPadaria from './Categorias - Subscrivery/padaria2.jpg';
import categoriaGraos from './Categorias - Subscrivery/graos.jpeg';
import categoriaLimpeza from './Categorias - Subscrivery/limpeza.jpeg';
import categoriaTodos from './Categorias - Subscrivery/todos.jpeg';

// LOGOS
import logo from './logo.jpeg';
import logoBranco from './logobranco.jpeg';
import logotipo from './logotipo.jpeg';
import logotipo1 from './logotipo1.jpg';
import iconePrincipal from './01.png';
import logoMonocromatica from './Logo Subscrivery/Logo Monocromática.png';
import logoPrincipal from './Logo Subscrivery/Logo Principal.png';
import logoPrincipal2 from './Logo Subscrivery/Logo Principal 2.png';

// FRUTAS / HORTIFRUTI
import maca from './maca.jpeg';
import banana from './bananaprata.webp';
import bananaFoto from './banana.jpg';
import laranja from './laranja.webp';
import abacate from './abacate.jpg';
import abacaxi from './abacaxi.jpg';
import limao from './limao.webp';
import morango from './morango.jpg';
import pera from './pera.jpg';
import maracuja from './maracuja.webp';

// BEBIDAS
import aguaSemGas from './agua sem gas.jpeg';
import cocaCola from './coca cola.jpeg';
import cerveja from './cerveja.jpeg';
import energetico from './energetico.jpeg';
import sucoLaranja from './suco de laranja.jpeg';
import cha from './cha.jpeg';

// MERCEARIA / GRÃOS
import arroz from './arroz.jpeg';
import acucar from './açucar.jpeg';
import cafe from './cafe.jpeg';
import bolacha from './bolacha .jpeg';
import farinhaTrigo from './farinha de trigo.jpeg';
import feijaoPreto from './feijao preto.jpeg';
import macarrao from './macarrao.jpeg';
import macarraoPng from './macarrao.png';
import molhoTomate from './molho de tomate.jpeg';
import oleo from './oleo.jpeg';
import graos from './graos.jpeg';
import sal from './sal.jpeg';

// LATICÍNIOS
import leite from './leite.jpeg';
import iogurte from './iogurte.jpeg';

// LIMPEZA
import detergente from './detergente.webp';
import amaciante from './amaciante.webp';
import aguaSanitaria from './agua sanitaria.jpeg';
import sabaoEmPo from './sabao em po .jpeg';
import limpeza from './limpeza.jpeg';
import papelHigienico from './papel higienico.jpeg';
import esponja from './esponja .jpeg';

// HIGIENE PESSOAL
import higiene from './higiene.jpeg';
import shampoo from './shampoo.jpg';
import pastaDente from './pasta de dente.jpeg';
import sabonete from './sabonete .jpeg';

// OUTROS
import todos from './todos.jpeg';

// EXPORTS - BANNERS
export const banners = [banner1, banner2, banner3];
export { mulherPerfil };

// EXPORTS - LOGOS
export const logos = {
    logo,
    logoBranco,
    logotipo,
    logotipo1,
    iconePrincipal,
    logoMonocromatica,
    logoPrincipal,
    logoPrincipal2
};

// EXPORTS - CATEGORIAS
export const categoriasImagens = {
    'Bebidas': categoriaBebidas,
    'Carnes': categoriaCarnes,
    'Hortifruti': categoriaHortfruit,
    'Laticínios': categoriaLaticinios,
    'Mercearia': categoriaMercearia,
    'Padaria': categoriaPadaria,
    'Grãos': categoriaGraos,
    'Limpeza': categoriaLimpeza,
    'Higiene': higiene,
    'Todas': categoriaTodos,
    'Todos': categoriaTodos,
    'All': categoriaTodos // English support
};

// EXPORTS - PRODUTOS POR CATEGORIA
export const produtosImagens = {
    // Frutas/Hortifruti
    'maca': maca,
    'banana': banana,
    'bananafoto': bananaFoto,
    'laranja': laranja,
    'abacate': abacate,
    'abacaxi': abacaxi,
    'limao': limao,
    'morango': morango,
    'pera': pera,
    'maracuja': maracuja,

    // Bebidas
    'agua': aguaSemGas,
    'aguasemgas': aguaSemGas,
    'cocacola': cocaCola,
    'coca': cocaCola,
    'refrigerante': cocaCola,
    'cerveja': cerveja,
    'energetico': energetico,
    'suco': sucoLaranja,
    'sucolaranja': sucoLaranja,
    'cha': cha,

    // Mercearia/Grãos
    'arroz': arroz,
    'acucar': acucar,
    'açucar': acucar,
    'cafe': cafe,
    'café': cafe,
    'bolacha': bolacha,
    'biscoito': bolacha,
    'farinha': farinhaTrigo,
    'farinhatrigo': farinhaTrigo,
    'feijao': feijaoPreto,
    'feijaopreto': feijaoPreto,
    'macarrao': macarrao,
    'massa': macarrao,
    'molho': molhoTomate,
    'molhotomate': molhoTomate,
    'oleo': oleo,
    'graos': graos,
    'sal': sal,
    'salrefinado': sal,
    'refinado': sal,

    // Laticínios
    'leite': leite,
    'iogurte': iogurte,

    // Limpeza
    'detergente': detergente,
    'amaciante': amaciante,
    'aguasanitaria': aguaSanitaria,
    'sabao': sabaoEmPo,
    'sabaoemPo': sabaoEmPo,
    'limpeza': limpeza,
    'papelhigienico': papelHigienico,
    'papel': papelHigienico,
    'esponja': esponja,

    // Higiene Pessoal
    'higiene': higiene,
    'shampoo': shampoo,
    'pastadente': pastaDente,
    'creme dental': pastaDente,
    'sabonete': sabonete
};

// EXPORTS - IMAGENS INDIVIDUAIS (para uso direto)
export {
    // Banners
    banner1,
    banner2,
    banner3,

    // Logos
    logo,
    logoBranco,
    logotipo,
    logotipo1,
    iconePrincipal,

    // Categorias
    categoriaBebidas,
    categoriaCarnes,
    categoriaHortfruit,
    categoriaLaticinios,
    categoriaMercearia,
    categoriaPadaria,
    categoriaGraos,
    categoriaLimpeza,
    categoriaTodos,

    // Frutas/Hortifruti
    maca,
    banana,
    bananaFoto,
    laranja,
    abacate,
    abacaxi,
    limao,
    morango,
    pera,
    maracuja,

    // Bebidas
    aguaSemGas,
    cocaCola,
    cerveja,
    energetico,
    sucoLaranja,
    cha,

    // Mercearia/Grãos
    arroz,
    acucar,
    cafe,
    bolacha,
    farinhaTrigo,
    feijaoPreto,
    macarrao,
    molhoTomate,
    oleo,
    graos,
    sal,

    // Laticínios
    leite,
    iogurte,

    // Limpeza
    detergente,
    amaciante,
    aguaSanitaria,
    sabaoEmPo,
    limpeza,
    papelHigienico,
    esponja,

    // Higiene
    higiene,
    shampoo,
    pastaDente,
    sabonete,

    // Logos Subscrivery
    logoMonocromatica,
    logoPrincipal,
    logoPrincipal2,

    // Outros
    todos,
    macarraoPng
};


// FUNÇÃO HELPER - BUSCAR IMAGEM DO PRODUTO

export const getProdutoImagem = (nomeProduto) => {
    if (!nomeProduto) return null;

    const nomeNormalizado = nomeProduto.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/\s+/g, ''); // Remove espaços

    // Ordena as chaves por tamanho decrescente para priorizar matches mais específicos
    // Isso evita que "maca" seja encontrado antes de "macarrao"
    const chavesOrdenadas = Object.keys(produtosImagens).sort((a, b) => b.length - a.length);

    // Tenta encontrar por palavras-chave (do mais específico para o menos)
    for (const key of chavesOrdenadas) {
        if (nomeNormalizado.includes(key)) {
            return produtosImagens[key];
        }
    }

    return null; // Retorna null se não encontrar
};


// EXPORT DEFAULT

export default {
    banners,
    logos,
    categoriasImagens,
    produtosImagens,
    getProdutoImagem,
    mulherPerfil
};
