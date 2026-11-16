/* =========================================================
   BF CASA & CONFORTO — dados da loja
   Tudo que muda com frequência fica aqui: contato, produtos,
   estampas, tamanhos, preços e fotos.

   Cada produto:
     foto      arquivo na pasta /fotos
     pos       que parte da foto aparece no card ("50% 0%" = topo)
     descricao frase que aparece no bloco do produto (igual à Buddemeyer)
     modelos   estampas/cores, na ordem e com o número do catálogo
     tamanhos  ex.: ["Solteiro", "Casal"]   (vazio = a confirmar)
     precos    ex.: { Solteiro: 59.9, Casal: 79.9 } ou { "Único": 39.9 }
               (null = preço combinado no WhatsApp)
     medidas   { largura, comprimento, altura } em metros (opcional)
     catalogo  foto do catálogo inteiro, quando a foto do produto é um recorte
   ========================================================= */

const LOJA = {
  nome: "BF Casa & Conforto",
  whatsapp: "5521993758542",        // 55 + DDD + número, só dígitos: (21) 99375-8542
  instagram: "bf_casa",             // @ da loja, sem o @
  descontoPix: 5,                   // % de desconto no PIX
  parcelasSemJuros: 0,              // 0 = não mostra parcelamento no site
  freteGratisAcima: 299,            // R$
  cnpj: "21.860.697/0001-60",
};

/* Tamanhos de colchão (cm). Confira com as medidas do seu fornecedor. */
const TAMANHOS = {
  Solteiro: { largura: 88,  comprimento: 188 },
  Casal:    { largura: 138, comprimento: 188 },
  Queen:    { largura: 158, comprimento: 198 },
  King:     { largura: 193, comprimento: 203 },
};

/* Abas do menu (como Cama / Banho na Buddemeyer) */
const DEPARTAMENTOS = [
  { id: "cama",  nome: "Cama" },
  { id: "banho", nome: "Banho" },
  { id: "mesa",  nome: "Mesa" },
];

/* Blocos dentro de cada aba, na ordem em que aparecem.
   "foto" = recorte de ambiente em fotos/ambiente.
   "tamanho" = seção de um tamanho de cama: enquanto não tiver produto,
   o bloco mostra o desenho da cama e "Em breve". */
const CATEGORIAS = [
  { id: "lencois-elastico-solteiro", depto: "cama", tamanho: "Solteiro", nome: "Lençóis de elástico Solteiro",
    foto: "fotos/ambiente/lencois-de-solteiro.jpg",
    descricao: "42 opções para cama de solteiro: personagens, bichinhos, florais e cores lisas." },
  { id: "lencois-elastico-casal", depto: "cama", tamanho: "Casal", nome: "Lençóis de elástico Casal",
    descricao: "Lençol com elástico para cama de casal." },
  { id: "lencois-de-cama-queen", depto: "cama", nome: "Lençóis de cama Queen", foto: "fotos/ambiente/jogos-de-cama.jpg",
    descricao: "Para cama Queen: 47 estampas em malha 100% algodão e com barra de renda." },
  { id: "lencois-elastico-king", depto: "cama", tamanho: "King", nome: "Lençóis de elástico King",
    descricao: "Lençol com elástico para cama King." },
  { id: "lencois", depto: "cama", nome: "Lençóis", foto: "fotos/ambiente/lencois.jpg",
    descricao: "Lençol 100% algodão em 30 cores, estampados com fronha e conjunto para solteiro." },
  { id: "coberdrom", depto: "cama", nome: "Coberdrom de sherpa", foto: "fotos/ambiente/coberdrom-de-sherpa.jpg",
    descricao: "Coberdrom de sherpa para cama Queen em 8 cores: macio por fora e quentinho por dentro." },
  { id: "colchas", depto: "cama", nome: "Colchas", foto: "fotos/ambiente/colchas.jpg",
    descricao: "Kit colcha dupla face em 10 modelos de patchwork, xadrez e floral." },
  { id: "cobertores", depto: "cama", nome: "Cobertores", foto: "fotos/ambiente/cobertores.jpg",
    descricao: "Cobertor jacquard macio e quentinho para os dias frios." },
  { id: "passadeiras", depto: "cama", nome: "Passadeiras", foto: "fotos/ambiente/passadeiras.jpg",
    descricao: "Passadeira para o lado da cama em 9 estampas: geométricas, xadrez, clássicas e florais." },
  { id: "toalhas", depto: "banho", nome: "Toalhas", foto: "fotos/ambiente/toalhas.jpg",
    descricao: "Felpa macia em cores lisas, com barra listrada ou em alto relevo." },
  { id: "tapetes", depto: "banho", nome: "Tapetes", foto: "fotos/ambiente/tapetes.jpg",
    descricao: "Jogo de tapetes para banheiro com base antiderrapante, em 5 cores." },
  { id: "toalhas-de-mesa", depto: "mesa", nome: "Toalhas de mesa", foto: "fotos/ambiente/toalhas-de-mesa.jpg",
    descricao: "Toalhas de mesa estampadas para mesa de 6 cadeiras: frutas, café e xadrez." },
  { id: "panos-de-prato", depto: "mesa", nome: "Panos de prato", foto: "fotos/ambiente/panos-de-prato.jpg",
    descricao: "Panos de prato felpudos com barra estampada, em 5 cores." },
];

const n = (lista) => lista.map((m, i) => `${String(i + 1).padStart(2, "0")} ${m}`);
const semAcento = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/* ---------------------------------------------------------
   JOGO DE CAMA QUEEN COM RENDA — 19 estampas, cada uma é um produto.
   Fotos recortadas do catálogo em fotos/jogo-cama-queen-renda.
   Para mudar preço ou medida das 19 de uma vez, mude aqui.
   --------------------------------------------------------- */
const COLECAO_QUEEN_RENDA = {
  id: "queen-renda",
  nome: "Lençol de cama Queen com renda",
  catalogo: "fotos/jogos-de-cama-19-estampas.jpeg",
  preco: 140.0,
  medidas: { largura: 1.58, comprimento: 1.90, altura: 0.30 },   // metros
  estampas: ["Bordô floral", "Cinza corações", "Rosa floral", "Verde borboleta", "Listras florais",
    "Amarelo delicado", "Rosa borboletas", "Animal print", "Folhas verdes", "Folhas pretas",
    "Marrom floral", "Azul floral", "Azul folhas", "Azul palmeiras", "Amarelo liso",
    "Vermelho folhas", "Vinho rosas", "Bege animal print", "Branco liso"],
};

const JOGOS_QUEEN_RENDA = COLECAO_QUEEN_RENDA.estampas.map((estampa, i) => {
  const num = String(i + 1).padStart(2, "0");
  return {
    id: `jogo-cama-queen-${num}-${semAcento(estampa)}`,
    nome: `Lençol de cama Queen ${estampa}`,
    detalhe: `Estampa ${num}, com barra de renda`,
    descricao: "Lençol para cama Queen, com barra de renda. Tem elástico e serve em colchão de 1,58 x 1,90 m e até 0,30 m de altura.",
    categoria: "lencois-de-cama-queen",
    colecao: COLECAO_QUEEN_RENDA.id,
    numero: num,
    estampa,
    variante: estampa,
    medidasTitulo: "Medidas para cama Queen",
    foto: `fotos/jogo-cama-queen-renda/${num}-${semAcento(estampa)}.jpg`,
    catalogo: COLECAO_QUEEN_RENDA.catalogo,
    medidas: COLECAO_QUEEN_RENDA.medidas,
    tamanhos: ["Queen"],
    precos: { Queen: COLECAO_QUEEN_RENDA.preco },
  };
});

/* ---------------------------------------------------------
   COBERDROM DE SHERPA QUEEN — 8 cores, cada uma é um produto.
   Fotos em fotos/coberdrom-de-sherpa (originais/ guarda as fotos como vieram).
   --------------------------------------------------------- */
const COLECAO_COBERDROM = {
  id: "coberdrom-sherpa",
  preco: 250.0,
  medidas: { largura: 2.20, comprimento: 2.40 },   // metros, tamanho da peça
  cores: [
    { cor: "Vermelho vivo", arquivo: "01-vermelho-vivo", sherpa: "Sherpa vermelha" },
    { cor: "Verde",         arquivo: "02-verde",         sherpa: "Sherpa branca" },
    { cor: "Terracota",     arquivo: "03-terracota",     sherpa: "Sherpa branca" },
    { cor: "Bege",          arquivo: "04-bege",          sherpa: "Sherpa na mesma cor" },
    { cor: "Azul petróleo", arquivo: "05-azul-petroleo", sherpa: "Sherpa na mesma cor" },
    { cor: "Rosé",          arquivo: "06-rose",          sherpa: "Sherpa na mesma cor" },
    { cor: "Lilás",         arquivo: "07-lilas",         sherpa: "Sherpa branca" },
    { cor: "Areia",         arquivo: "08-areia",         sherpa: "Sherpa branca" },
  ],
};

const COBERDROMS = COLECAO_COBERDROM.cores.map((c) => ({
  id: `coberdrom-sherpa-queen-${c.arquivo}`,
  nome: `Coberdrom de sherpa Queen ${c.cor}`,
  detalhe: `${c.sherpa}, 2,20 x 2,40 m`,
  descricao: "Coberdrom de sherpa para cama Queen: macio por fora e quentinho por dentro, com sherpa felpuda. A peça mede 2,20 x 2,40 m.",
  categoria: "coberdrom",
  colecao: COLECAO_COBERDROM.id,
  rotulo: "Cor",
  variante: c.cor,
  foto: `fotos/coberdrom-de-sherpa/coberdrom-de-sherpa-${c.arquivo}.jpg`,
  medidas: COLECAO_COBERDROM.medidas,
  medidasTitulo: "Tamanho da peça",
  tamanhos: ["Queen"],
  precos: { Queen: COLECAO_COBERDROM.preco },
}));

/* ---------------------------------------------------------
   TOALHA DE MESA 6 CADEIRAS — 6 estampas, cada uma é um produto.
   Fotos em fotos/mesa.
   --------------------------------------------------------- */
const COLECAO_TOALHA_MESA = {
  id: "toalha-mesa-6",
  preco: 50.0,
  tamanho: "Mesa de 6 cadeiras",
  estampas: [
    { nome: "Xadrez com maçãs",        arquivo: "01-xadrez-com-macas" },
    { nome: "Frutas fundo amarelo",    arquivo: "02-frutas-fundo-amarelo" },
    { nome: "Café verde",              arquivo: "03-cafe-verde" },
    { nome: "Frutas com poá vermelho", arquivo: "04-frutas-com-poa-vermelho" },
    { nome: "Café azul marinho",       arquivo: "05-cafe-azul-marinho" },
    { nome: "Xícaras xadrez verde",    arquivo: "06-xicaras-xadrez-verde" },
  ],
};

const TOALHAS_MESA = COLECAO_TOALHA_MESA.estampas.map((e) => ({
  id: `toalha-de-mesa-6-cadeiras-${e.arquivo}`,
  nome: `Toalha de mesa ${e.nome}`,
  detalhe: "Para mesa de 6 cadeiras",
  descricao: "Toalha de mesa estampada para mesa de 6 cadeiras, com a borda costurada.",
  categoria: "toalhas-de-mesa",
  colecao: COLECAO_TOALHA_MESA.id,
  variante: e.nome,
  foto: `fotos/mesa/toalha-de-mesa-6-cadeiras-${e.arquivo}.jpeg`,
  tamanhos: [COLECAO_TOALHA_MESA.tamanho],
  precos: { [COLECAO_TOALHA_MESA.tamanho]: COLECAO_TOALHA_MESA.preco },
}));

/* ---------------------------------------------------------
   LENÇOL DE SOLTEIRO — 42 opções (30 estampados + 12 lisos), cada uma é um produto.
   Fotos em fotos/lencol-solteiro (originais/ guarda as fotos do celular como vieram).
   --------------------------------------------------------- */
const COLECAO_SOLTEIRO = {
  id: "lencol-solteiro",
  preco: 100.0,
  medidas: { largura: 0.88, comprimento: 1.88, altura: 0.30 },   // metros
  opcoes: [
    { nome: "Homem-Aranha", arquivo: "01-homem-aranha", grupo: "Estampados" },
    { nome: "Batman", arquivo: "02-batman", grupo: "Estampados" },
    { nome: "Cachorrinhos", arquivo: "03-cachorrinhos", grupo: "Estampados" },
    { nome: "Barbie corações azuis com renda", arquivo: "04-barbie-coracoes-azuis-com-renda", grupo: "Estampados" },
    { nome: "Guitarras", arquivo: "05-guitarras", grupo: "Estampados" },
    { nome: "Naruto", arquivo: "06-naruto", grupo: "Estampados" },
    { nome: "Vaquinhas e arco-íris", arquivo: "07-vaquinhas-e-arco-iris", grupo: "Estampados" },
    { nome: "Stitch e Angel", arquivo: "08-stitch-e-angel", grupo: "Estampados" },
    { nome: "Barbie rosa com renda", arquivo: "09-barbie-rosa-com-renda", grupo: "Estampados" },
    { nome: "Ursinhos rosa", arquivo: "10-ursinhos-rosa", grupo: "Estampados" },
    { nome: "Labubu", arquivo: "11-labubu", grupo: "Estampados" },
    { nome: "Barbie desenho", arquivo: "12-barbie-desenho", grupo: "Estampados" },
    { nome: "Marinheiro", arquivo: "13-marinheiro", grupo: "Estampados" },
    { nome: "Florzinhas", arquivo: "14-florzinhas", grupo: "Estampados" },
    { nome: "Simpsons", arquivo: "15-simpsons", grupo: "Estampados" },
    { nome: "Super-heróis", arquivo: "16-super-herois", grupo: "Estampados" },
    { nome: "Cachorrinhos marrom", arquivo: "17-cachorrinhos-marrom", grupo: "Estampados" },
    { nome: "Doces e coroas", arquivo: "18-doces-e-coroas", grupo: "Estampados" },
    { nome: "Floral com renda rosa", arquivo: "19-floral-com-renda-rosa", grupo: "Estampados" },
    { nome: "Barbie rosa", arquivo: "20-barbie-rosa", grupo: "Estampados" },
    { nome: "Harry Potter", arquivo: "21-harry-potter", grupo: "Estampados" },
    { nome: "Onça com renda", arquivo: "22-onca-com-renda", grupo: "Estampados" },
    { nome: "Hulk", arquivo: "23-hulk", grupo: "Estampados" },
    { nome: "Rosas vermelhas", arquivo: "24-rosas-vermelhas", grupo: "Estampados" },
    { nome: "Stitch", arquivo: "25-stitch", grupo: "Estampados" },
    { nome: "Capivaras", arquivo: "26-capivaras", grupo: "Estampados" },
    { nome: "Sonic", arquivo: "27-sonic", grupo: "Estampados" },
    { nome: "Morangos", arquivo: "28-morangos", grupo: "Estampados" },
    { nome: "Ursinhos laranja", arquivo: "29-ursinhos-laranja", grupo: "Estampados" },
    { nome: "Mandala", arquivo: "30-mandala", grupo: "Estampados" },
    { nome: "Azul claro", arquivo: "31-azul-claro", grupo: "Lisos" },
    { nome: "Bege", arquivo: "32-bege", grupo: "Lisos" },
    { nome: "Cinza claro", arquivo: "33-cinza-claro", grupo: "Lisos" },
    { nome: "Azul marinho", arquivo: "34-azul-marinho", grupo: "Lisos" },
    { nome: "Pink", arquivo: "35-pink", grupo: "Lisos" },
    { nome: "Lavanda", arquivo: "36-lavanda", grupo: "Lisos" },
    { nome: "Rosa claro", arquivo: "37-rosa-claro", grupo: "Lisos" },
    { nome: "Amarelo claro", arquivo: "38-amarelo-claro", grupo: "Lisos" },
    { nome: "Verde escuro", arquivo: "39-verde-escuro", grupo: "Lisos" },
    { nome: "Rosé", arquivo: "40-rose", grupo: "Lisos" },
    { nome: "Lilás claro", arquivo: "41-lilas-claro", grupo: "Lisos" },
    { nome: "Cinza", arquivo: "42-cinza", grupo: "Lisos" },
  ],
};

const LENCOIS_SOLTEIRO = COLECAO_SOLTEIRO.opcoes.map((o) => ({
  id: `lencol-solteiro-${o.arquivo}`,
  nome: `Lençol de solteiro ${o.nome}`,
  detalhe: o.grupo === "Lisos" ? "Liso, para cama de solteiro" : "Estampado, para cama de solteiro",
  descricao: "Lençol para cama de solteiro. O lençol com elástico serve em colchão de 0,88 x 1,88 m e até 0,30 m de altura.",
  categoria: "lencois-elastico-solteiro",
  colecao: COLECAO_SOLTEIRO.id,
  grupo: o.grupo,
  rotulo: o.grupo === "Lisos" ? "Cor" : "Estampa",
  variante: o.nome,
  foto: `fotos/lencol-solteiro/lencol-solteiro-${o.arquivo}.jpg`,
  medidas: COLECAO_SOLTEIRO.medidas,
  medidasTitulo: "Medidas para cama Solteiro",
  tamanhos: ["Solteiro"],
  precos: { Solteiro: COLECAO_SOLTEIRO.preco },
}));

/* ---------------------------------------------------------
   PASSADEIRA — 9 estampas, cada uma é um produto.
   Fotos em fotos/passadeiras (originais/ guarda as fotos como vieram).
   preco: null = "pelo WhatsApp". Quando tiver o preço, troque aqui (ex.: 79.9).
   medidas: { largura, comprimento } em metros, quando tiver.
   --------------------------------------------------------- */
const COLECAO_PASSADEIRA = {
  id: "passadeira",
  preco: null,
  medidas: null,
  estampas: [
    { nome: "Madeira com orquídeas",    arquivo: "01-madeira-com-orquideas" },
    { nome: "Vinho com treliça dourada", arquivo: "02-vinho-com-trelica-dourada" },
    { nome: "Blocos azuis",             arquivo: "03-blocos-azuis" },
    { nome: "Quadrados bege e cinza",   arquivo: "04-quadrados-bege-e-cinza" },
    { nome: "Preto com borda dourada",  arquivo: "05-preto-com-borda-dourada" },
    { nome: "Chevron cinza e azul",     arquivo: "06-chevron-cinza-e-azul" },
    { nome: "Losangos coloridos",       arquivo: "07-losangos-coloridos" },
    { nome: "Xadrez preto e branco",    arquivo: "08-xadrez-preto-e-branco" },
    { nome: "Mosaico laranja",          arquivo: "09-mosaico-laranja" },
  ],
};

const PASSADEIRAS = COLECAO_PASSADEIRA.estampas.map((e) => ({
  id: `passadeira-${e.arquivo}`,
  nome: `Passadeira ${e.nome}`,
  detalhe: "Para o lado da cama",
  descricao: "Passadeira estampada para o lado da cama: deixa o quarto mais aconchegante e o chão menos frio ao levantar.",
  categoria: "passadeiras",
  colecao: COLECAO_PASSADEIRA.id,
  variante: e.nome,
  foto: `fotos/passadeiras/passadeira-${e.arquivo}.jpg`,
  pos: "50% 85%",
  ...(COLECAO_PASSADEIRA.medidas ? { medidas: COLECAO_PASSADEIRA.medidas, medidasTitulo: "Tamanho da peça" } : {}),
  tamanhos: ["Único"],
  precos: COLECAO_PASSADEIRA.preco != null ? { "Único": COLECAO_PASSADEIRA.preco } : null,
}));

const PRODUTOS = [
  ...JOGOS_QUEEN_RENDA,
  ...LENCOIS_SOLTEIRO,
  ...COBERDROMS,
  ...PASSADEIRAS,
  ...TOALHAS_MESA,
  {
    id: "jogo-cama-malha-28",
    nome: "Lençol de cama Queen malha 100% algodão",
    detalhe: "Coleção com 28 estampas, com ou sem renda",
    descricao: "Lençol para cama Queen em malha 100% algodão, macia como camiseta, em 28 estampas com ou sem renda.",
    categoria: "lencois-de-cama-queen",
    foto: "fotos/jogos-de-cama-malha-28-estampas.jpeg", pos: "40% 50%",
    modelos: n(["Folhas verde com renda", "Círculos azul com renda", "Liso pink", "Bolinhas azul com renda",
      "Onça com renda", "Estampa rosa com estampinhas", "Floral rosa", "Floral lilás com renda",
      "Corações rosa com renda", "Floral laranja com renda", "Floral bege com renda", "Cerejas com renda",
      "Corações preto com renda", "Folhas verde escuro com renda", "Poá rosa com renda", "Motos sem renda",
      "Floral vermelho sem renda", "Liso preto sem renda", "Borboletas com renda",
      "Floral amarelo escuro com renda", "Floral laranja sem renda", "Folhas azul com renda",
      "Animais verde com renda", "Floral lilás sem renda", "Floral branco com girassol com renda",
      "Poá azul com renda", "Onça bege com renda", "Folhas verde claro com renda"]),
    tamanhos: ["Queen"],
    precos: null,
  },
  {
    id: "lencol-30-cores",
    nome: "Lençol 100% algodão",
    detalhe: "30 cores e estampas, com renda",
    descricao: "Lençol 100% algodão com acabamento em renda, em 30 cores lisas e estampadas.",
    categoria: "lencois",
    foto: "fotos/lencois-30-cores.jpeg", pos: "50% 0%",
    modelos: n(["Branco", "Bege", "Bege animal print", "Creme", "Marsala", "Vermelho", "Cinza",
      "Verde água", "Verde folhas", "Vinho", "Verde escuro", "Preto folhas", "Rosa floral",
      "Rosa estampado", "Verde claro", "Azul borboleta", "Listrado floral", "Rosa flores", "Rosa liso",
      "Azul marinho", "Marrom floral", "Amarelo", "Off white", "Nude", "Verde militar", "Azul folhas",
      "Branco floral", "Vinho floral", "Verde sálvia", "Estampado flor"]),
    tamanhos: [],
    precos: null,
  },
  {
    id: "lencol-estampado-fronha",
    nome: "Lençol estampado com fronha",
    detalhe: "100% algodão, barra de renda",
    descricao: "Lençol 100% algodão com fronha e barra de renda bordada, em estampas de borboletas e folhas.",
    categoria: "lencois",
    foto: "fotos/lencois-estampados-com-fronha.jpeg", pos: "50% 30%",
    modelos: ["Borboletas azul", "Borboletas coloridas", "Folhas azul claro", "Folhas azul marinho", "Folhas preto"],
    tamanhos: [],
    precos: null,
  },
  {
    id: "lencol-solteiro",
    rotulo: "Cor",
    nome: "Conjunto lençol solteiro",
    detalhe: "Lençol de elástico + fronha, 100% algodão",
    descricao: "Lençol de elástico com fronha para colchão de solteiro, 100% algodão, em 8 cores lisas.",
    categoria: "lencois",
    foto: "fotos/lencol-solteiro-8-cores.jpeg", pos: "50% 0%",
    modelos: ["Bege", "Verde escuro", "Preto", "Azul jeans", "Azul claro", "Amarelo", "Cinza", "Branco"],
    tamanhos: ["Solteiro"],
    precos: null,
  },
  {
    id: "kit-colcha-dupla-face",
    nome: "Kit colcha dupla face",
    detalhe: "Dupla face, 10 modelos",
    descricao: "Dupla face: vire a colcha e mude o quarto. 10 modelos em patchwork, xadrez e floral.",
    categoria: "colchas",
    foto: "fotos/kit-colcha-dupla-face.jpeg", pos: "50% 25%",
    modelos: n(["Patchwork azul marrom", "Patchwork vermelho", "Floral roxo", "Xadrez azul", "Floral lilás",
      "Patchwork marrom", "Patchwork rosa", "Floral verde", "Folhagem azul", "Azul coração"]),
    tamanhos: [],
    precos: null,
  },
  {
    id: "cobertor-jacquard",
    rotulo: "Cor",
    nome: "Cobertor jacquard",
    detalhe: "2,10 x 1,90 m, quentinho e macio",
    descricao: "Cobertor jacquard de 2,10 x 1,90 m, macio e quentinho, em 5 cores.",
    categoria: "cobertores",
    foto: "fotos/cobertor-jacquard.jpeg", pos: "50% 0%",
    modelos: ["Cinza claro", "Cinza escuro", "Azul", "Rosa pink", "Amarelo"],
    tamanhos: [],
    precos: null,
  },
  {
    id: "toalhas-premium",
    rotulo: "Cor",
    nome: "Toalhas premium",
    detalhe: "Felpa macia, barra em alto relevo",
    descricao: "Felpa macia e super absorvente com barra decorativa em alto relevo, em 8 cores.",
    categoria: "toalhas",
    foto: "fotos/toalhas-premium.jpeg", pos: "50% 0%",
    modelos: ["Coral", "Azul", "Lilás", "Bordô", "Rosa", "Amarelo", "Verde", "Cinza"],
    tamanhos: [],
    precos: null,
  },
  {
    id: "toalha-banho-colorida",
    rotulo: "Cor",
    nome: "Toalha de banho",
    detalhe: "Cores lisas com barra listrada",
    descricao: "Toalha de banho em cores vivas com barra listrada.",
    categoria: "toalhas",
    foto: "fotos/toalhas-de-banho-coloridas.jpeg", pos: "30% 60%",
    modelos: ["Pink", "Verde", "Roxo", "Amarelo", "Chumbo", "Coral", "Azul", "Vermelho"],
    tamanhos: [],
    precos: null,
  },
  {
    id: "pano-de-prato-barra-estampada",
    rotulo: "Cor",
    nome: "Pano de prato com barra estampada",
    detalhe: "Felpudo, 5 cores",
    descricao: "Pano de prato felpudo com barra estampada, em 5 cores.",
    categoria: "panos-de-prato",
    foto: "fotos/panos-de-prato-barra-estampada.jpeg", pos: "45% 50%",
    modelos: ["Verde", "Amarelo", "Rosa", "Branco", "Azul"],
    tamanhos: [],
    precos: null,
  },
  {
    id: "jogo-tapetes-banheiro",
    rotulo: "Cor",
    nome: "Jogo de tapetes para banheiro",
    detalhe: "3 peças: tapete, tampa e contorno do vaso",
    descricao: "Kit 3 peças com base antiderrapante: tapete principal, tampa e contorno do vaso.",
    categoria: "tapetes",
    foto: "fotos/jogo-de-tapetes-banheiro.jpeg", pos: "0% 30%",
    modelos: ["Vinho", "Bege", "Verde", "Azul", "Preto"],
    tamanhos: [],
    precos: null,
  },
];

/* Fotos fixas das seções. Capa e "Sobre" ainda são ilustrativas (Unsplash). */
const FOTOS_SITE = {
  capa:  "https://images.unsplash.com/photo-1601276174812-63280a55656e?auto=format&fit=crop&w=1400&q=75",
  sobre: "https://images.unsplash.com/photo-1606796913825-2b02883605e9?auto=format&fit=crop&w=1000&q=75",
};
