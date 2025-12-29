

// =============================================
// BANNERS
// =============================================
import banner1 from './Banners - Subscrivery/banner 1.jpg';
import banner2 from './Banners - Subscrivery/banner 2.jpeg';
import banner3 from './Banners - Subscrivery/banner 3.png';
import mulherPerfil from './Banners - Subscrivery/mulher do perfil.jpg';

// =============================================
// CATEGORIAS
// =============================================
import categoriaBebidas from './Categorias - Subscrivery/bebidas.jpg';
import categoriaCarnes from './Categorias - Subscrivery/carnes.jpg';
import categoriaHortfruit from './Categorias - Subscrivery/hortfruit.jpg';
import categoriaLaticinios from './Categorias - Subscrivery/laticinios.jpg';
import categoriaMercearia from './Categorias - Subscrivery/mercearia.jpg';
import categoriaPadaria from './Categorias - Subscrivery/padaria2.jpg';
import categoriaGraos from './Categorias - Subscrivery/graos.jpeg';
import categoriaLimpeza from './Categorias - Subscrivery/limpeza.jpeg';
import categoriaTodos from './Categorias - Subscrivery/todos.jpeg';

// =============================================
// LOGOS
// =============================================
import logo from './logo.jpeg';
import logoBranco from './logobranco.jpeg';
import logotipo from './logotipo.jpeg';
import logotipo1 from './logotipo1.jpg';
import iconePrincipal from './01.png';

// =============================================
// FRUTAS / HORTIFRUTI
// =============================================
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

// =============================================
// BEBIDAS
// =============================================
import aguaSemGas from './agua sem gas.jpeg';
import cocaCola from './coca cola.jpeg';
import cerveja from './cerveja.jpeg';
import energetico from './energetico.jpeg';
import sucoLaranja from './suco de laranja.jpeg';
import cha from './cha.jpeg';

// =============================================
// MERCEARIA / GRÃOS
// =============================================
import arroz from './arroz.jpeg';
import acucar from './açucar.jpeg';
import cafe from './cafe.jpeg';
import bolacha from './bolacha .jpeg';
import farinhaTrigo from './farinha de trigo.jpeg';
import feijaoPreto from './feijao preto.jpeg';
import macarrao from './macarrao.jpeg';
import molhoTomate from './molho de tomate.jpeg';
import oleo from './oleo.jpeg';
import graos from './graos.jpeg';

// =============================================
// LATICÍNIOS
// =============================================
import leite from './leite.jpeg';
import iogurte from './iogurte.jpeg';

// =============================================
// LIMPEZA
// =============================================
import detergente from './detergente.webp';
import amaciante from './amaciante.webp';
import aguaSanitaria from './agua sanitaria.jpeg';
import sabaoEmPo from './sabao em po .jpeg';
import limpeza from './limpeza.jpeg';
import papelHigienico from './papel higienico.jpeg';

// =============================================
// HIGIENE PESSOAL
// =============================================
import higiene from './higiene.jpeg';
import shampoo from './shampoo.jpeg';
import pastaDente from './pasta de dente.jpeg';

// =============================================
// OUTROS
// =============================================
import todos from './todos.jpeg';

// =============================================
// EXPORTS - BANNERS
// =============================================
export const banners = [banner1, banner2, banner3];
export { mulherPerfil };

// =============================================
// EXPORTS - LOGOS
// =============================================
export const logos = {
    logo,
    logoBranco,
    logotipo,
    logotipo1,
    iconePrincipal
};

// =============================================
// EXPORTS - CATEGORIAS
// =============================================
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
    'Todos': categoriaTodos
};

// =============================================
// EXPORTS - PRODUTOS POR CATEGORIA
// =============================================
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

    // Higiene Pessoal
    'higiene': higiene,
    'shampoo': shampoo,
    'pastadente': pastaDente,
    'creme dental': pastaDente
};

// =============================================
// EXPORTS - IMAGENS INDIVIDUAIS (para uso direto)
// =============================================
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

    // Higiene
    higiene,
    shampoo,
    pastaDente,

    // Outros
    todos
};

// =============================================
// FUNÇÃO HELPER - BUSCAR IMAGEM DO PRODUTO
// =============================================
export const getProdutoImagem = (nomeProduto) => {
    if (!nomeProduto) return null;

    const nomeNormalizado = nomeProduto.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/\s+/g, ''); // Remove espaços

    // Tenta encontrar por palavras-chave
    for (const [key, imagem] of Object.entries(produtosImagens)) {
        if (nomeNormalizado.includes(key)) {
            return imagem;
        }
    }

    return null; // Retorna null se não encontrar
};

// =============================================
// EXPORT DEFAULT
// =============================================
export default {
    banners,
    logos,
    categoriasImagens,
    produtosImagens,
    getProdutoImagem,
    mulherPerfil
};
