/* =========================================================
   BF CASA & CONFORTO — funcionamento da página
   Páginas no estilo Buddemeyer:
     #/cama                       blocos das peças de cama
     #/cama/lencois-de-cama-queen      blocos dos produtos dessa peça
     #/produto/jogo-cama-colecao  página do produto
   Mais: filtro por tamanho, sacola e pedido pelo WhatsApp.
   ========================================================= */
(() => {
  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];

  const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const comPix = (v) => Math.round(v * (100 - LOJA.descontoPix)) / 100;
  const parcela = (v) => v / LOJA.parcelasSemJuros;
  const linkWhats = (msg) => `https://wa.me/${LOJA.whatsapp}?text=${encodeURIComponent(msg)}`;
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const produto = (id) => PRODUTOS.find((p) => p.id === id);
  const categoria = (id) => CATEGORIAS.find((c) => c.id === id);
  const depto = (id) => DEPARTAMENTOS.find((d) => d.id === id);
  const linkCat = (c) => `#/${c.depto}/${c.id}`;
  const linkProduto = (p) => `#/produto/${p.id}`;
  const daCategoria = (c) => PRODUTOS.filter((p) => p.categoria === c.id);
  /* seções ainda sem produto ficam fora do início, só aparecem na aba com "Em breve" */
  const categoriasComProduto = CATEGORIAS.filter((c) => daCategoria(c).length);

  const rotulo = (p) => p.rotulo || "Estampa";
  const qtdOpcoes = (p) => (p.modelos || []).length;
  const textoOpcoes = (p) => `${qtdOpcoes(p)} ${rotulo(p) === "Cor" ? "cores" : "estampas"}`;
  const metros = (v) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " m";
  const irmaos = (p) => (p.colecao ? PRODUTOS.filter((o) => o.colecao === p.colecao) : []);
  const menorPreco = (p) => (p.precos ? Math.min(...Object.values(p.precos)) : null);

  /* tamanhos do produto: os do preço, se houver preço; senão a lista informada */
  const tamanhosDe = (p) => (p.precos ? Object.keys(p.precos) : p.tamanhos || []);
  const precoDe = (p, tam) => (p.precos ? p.precos[tam] ?? null : null);
  /* "Queen" -> "cama queen"; "Mesa de 6 cadeiras" fica como está; "Único" some */
  const textoTam = (tam) => (!tam || tam === "Único" ? "" : TAMANHOS[tam] ? `cama ${tam.toLowerCase()}` : tam);

  const estado = {
    cat: "todos",
    tam: null,
    escolha: {}, // { [id]: { tam, modelo } }
    sacola: carregarSacola(),
  };
  const escolha = (id) => (estado.escolha[id] ||= { tam: null, modelo: "" });

  /* ---------- Dados fixos da página ---------- */
  $$("[data-whats]").forEach((a) => (a.href = linkWhats(`Olá! Vim pelo site da ${LOJA.nome} e queria tirar uma dúvida.`)));
  $$("[data-insta]").forEach((a) => (a.href = `https://instagram.com/${LOJA.instagram}`));
  $$("[data-foto]").forEach((img) => (img.src = FOTOS_SITE[img.dataset.foto]));
  $("[data-ano]").textContent = new Date().getFullYear();
  $("[data-cnpj]").textContent = LOJA.cnpj;

  /* Etiqueta da capa: mostra o lençol de cama Queen com o preço atual */
  if (typeof COLECAO_QUEEN_RENDA !== "undefined") {
    const c = COLECAO_QUEEN_RENDA;
    $(".etiqueta__nome").textContent = "Lençol de cama Queen";
    $(".etiqueta__det").textContent = `Com renda, ${c.estampas.length} estampas`;
    $(".etiqueta__preco").textContent = brl(c.preco);
    $(".etiqueta__pix").textContent = `${brl(comPix(c.preco))} no PIX`;
  }

  /* ---------- Início: blocos das peças ---------- */
  $("[data-categorias]").innerHTML = categoriasComProduto.map((c) => {
    const opcoes = daCategoria(c).reduce((s, p) => s + (qtdOpcoes(p) || 1), 0);
    return `
      <a class="categoria" href="${linkCat(c)}">
        <img src="${c.foto}" alt="" loading="lazy" width="600" height="450">
        <span class="categoria__nome">${c.nome}
          <span class="categoria__qtd">${opcoes} ${opcoes === 1 ? "opção" : "opções"}</span>
        </span>
      </a>`;
  }).join("");

  /* ---------- Camas desenhadas em escala ---------- */
  function desenhoCama(t) {
    const W = t.largura, L = t.comprimento;
    const y0 = 6, dobraY = y0 + Math.round(L * 0.34);
    const ns = 'vector-effect="non-scaling-stroke" stroke-width="1.2"';
    const travesseiros = W < 110
      ? `<rect class="cama__travesseiro" ${ns} x="10" y="${y0 + 10}" width="${W - 20}" height="28" rx="6"/>`
      : (() => {
          const pw = (W - 30) / 2;
          return `<rect class="cama__travesseiro" ${ns} x="10" y="${y0 + 10}" width="${pw}" height="28" rx="6"/>
                  <rect class="cama__travesseiro" ${ns} x="${20 + pw}" y="${y0 + 10}" width="${pw}" height="28" rx="6"/>`;
        })();
    return `
      <svg viewBox="-4 0 ${W + 8} ${L + y0 + 2}" aria-hidden="true">
        <rect class="cama__cabeceira" ${ns} x="-4" y="0" width="${W + 8}" height="10" rx="2"/>
        <rect class="cama__colchao" ${ns} x="0" y="${y0}" width="${W}" height="${L}" rx="5"/>
        <rect class="cama__edredom" x="1" y="${dobraY}" width="${W - 2}" height="${L - (dobraY - y0) - 1}" rx="4"/>
        <rect class="cama__dobra" ${ns} x="0" y="${dobraY}" width="${W}" height="16"/>
        <rect class="cama__pesponto" ${ns} x="5" y="${dobraY + 24}" width="${W - 10}" height="${L - (dobraY - y0) - 30}" rx="3"/>
        ${travesseiros}
      </svg>`;
  }

  $("[data-camas]").innerHTML = Object.entries(TAMANHOS).map(([nome, t]) => `
    <button class="cama" type="button" data-tam="${nome}" aria-pressed="false" style="--l:${t.largura}">
      ${desenhoCama(t)}
      <span class="cama__rotulo">
        <span class="cama__nome">${nome}</span>
        <span class="cama__medida">${t.largura} x ${t.comprimento}<span class="cama__cm"> cm</span></span>
      </span>
    </button>`).join("");

  /* ---------- Filtros da lista do início ---------- */
  $("[data-filtro-cat]").innerHTML =
    `<button class="chip" type="button" data-cat="todos">Todas as peças</button>` +
    categoriasComProduto.map((c) => `<button class="chip" type="button" data-cat="${c.id}">${c.nome}</button>`).join("");

  const filtroTam = $("[data-filtro-tam]");
  filtroTam.classList.add("filtros__grupo--tam");
  filtroTam.innerHTML =
    `<button class="chip" type="button" data-tam="">Todos os tamanhos</button>` +
    Object.keys(TAMANHOS).map((t) => `<button class="chip" type="button" data-tam="${t}">${t}</button>`).join("");

  /* Sem tamanho informado = aparece em qualquer cama até a loja confirmar.
     Tamanho único (toalha, tapete) também serve em qualquer filtro. */
  const serve = (p, tam) => {
    const tams = tamanhosDe(p);
    return !tam || tams.length === 0 || tams.includes(tam) || tams.includes("Único");
  };

  const filtrados = () =>
    PRODUTOS.filter((p) => (estado.cat === "todos" || p.categoria === estado.cat) && serve(p, estado.tam));

  function tamanhoEscolhido(p) {
    const tams = tamanhosDe(p);
    const e = escolha(p.id);
    if (e.tam && tams.includes(e.tam)) return e.tam;
    if (estado.tam && tams.includes(estado.tam)) return estado.tam;
    return tams[0] || null;
  }

  /* ---------- Pedaços reaproveitados no card e na página do produto ---------- */
  function blocoPreco(p, tam) {
    const preco = precoDe(p, tam);
    if (preco == null) return `<p class="produto__consulta">${tamanhosDe(p).length ? "Preço" : "Preço e tamanho"} pelo WhatsApp</p>`;
    return `
      <p class="produto__preco">
        <span class="produto__valor">${brl(preco)}</span>
        ${LOJA.parcelasSemJuros > 1 ? `<span class="produto__parcela">ou ${LOJA.parcelasSemJuros}x de ${brl(parcela(preco))}</span>` : ""}
      </p>
      <p class="produto__pix">${brl(comPix(preco))} no PIX</p>`;
  }

  function blocoTamanho(p, tam) {
    const tams = tamanhosDe(p);
    if (tams.length > 1) {
      return `<div class="produto__tamanhos" role="group" aria-label="Tamanho de ${esc(p.nome)}">
        ${tams.map((t) => `<button type="button" class="chip" data-escolher="${t}" aria-pressed="${t === tam}">${t}</button>`).join("")}
      </div>`;
    }
    if (tams.length === 1) {
      const t = tams[0];
      return `<p class="produto__unico">${t === "Único" ? "Tamanho único" : TAMANHOS[t] ? "Tamanho " + t.toLowerCase() : "Tamanho: " + t}</p>`;
    }
    return "";
  }

  function blocoModelo(p) {
    if (!qtdOpcoes(p)) return "";
    const atual = escolha(p.id).modelo;
    const r = rotulo(p);
    return `
      <label class="produto__modelo">
        <span>${r}</span>
        <select data-modelo>
          <option value="">Escolha ${r === "Cor" ? "a cor" : "a estampa"}</option>
          ${p.modelos.map((m) => `<option ${m === atual ? "selected" : ""}>${esc(m)}</option>`).join("")}
        </select>
      </label>`;
  }

  /* ---------- Card da lista do início ---------- */
  function cartao(p) {
    const tam = tamanhoEscolhido(p);
    return `
      <li class="produto" data-produto="${p.id}" data-tipo="cartao">
        <a class="produto__foto" href="${linkProduto(p)}">
          <img src="${p.foto}" alt="${esc(p.nome)}, ${esc(p.detalhe)}" loading="lazy" width="900" height="1125" style="object-position:${p.pos || "50% 50%"}">
          ${qtdOpcoes(p) ? `<span class="produto__ver">Ver as ${textoOpcoes(p)}</span>` : ""}
        </a>
        <h3 class="produto__nome"><a href="${linkProduto(p)}">${p.nome}</a></h3>
        <p class="produto__detalhe">${p.detalhe}</p>
        ${blocoPreco(p, tam)}
        ${blocoTamanho(p, tam)}
        <div class="produto__acoes">
          ${blocoModelo(p)}
          <button type="button" class="botao botao--linha botao--largo produto__add" data-adicionar>Adicionar à sacola</button>
        </div>
      </li>`;
  }

  function renderizar() {
    const lista = filtrados();
    $("[data-grade]").innerHTML = lista.map(cartao).join("");
    $("[data-vazio]").hidden = lista.length > 0;

    let resumo = `${lista.length} ${lista.length === 1 ? "produto" : "produtos"}`;
    if (estado.cat !== "todos") resumo += ` em ${categoria(estado.cat).nome.toLowerCase()}`;
    if (estado.tam) resumo += ` para cama ${estado.tam.toLowerCase()}`;
    $("[data-resumo]").textContent = resumo;

    $$("[data-filtro-cat] .chip").forEach((b) => b.setAttribute("aria-pressed", b.dataset.cat === estado.cat));
    $$("[data-filtro-tam] .chip").forEach((b) => b.setAttribute("aria-pressed", b.dataset.tam === (estado.tam || "")));
    $$(".cama").forEach((b) => b.setAttribute("aria-pressed", b.dataset.tam === estado.tam));
    renderizarInfoCama();
  }

  function renderizarInfoCama() {
    const caixa = $("[data-camas-info]");
    if (!estado.tam) {
      caixa.innerHTML = `<p>Escolha uma cama acima para ver a medida e filtrar os produtos.</p>`;
      return;
    }
    const t = TAMANHOS[estado.tam];
    const qtd = PRODUTOS.filter((p) => serve(p, estado.tam)).length;
    caixa.innerHTML = `
      <h3>${estado.tam}</h3>
      <dl>
        <div><dt>Colchão</dt><dd>${t.largura} x ${t.comprimento} cm</dd></div>
        <div><dt>Lençol com elástico</dt><dd>colchão de até 30 cm de altura</dd></div>
      </dl>
      <div class="camas__acoes">
        <a class="botao botao--cheio" href="#produtos">Ver ${qtd} produtos para ${estado.tam.toLowerCase()}</a>
        <button type="button" class="link" data-limpar-tam>Limpar</button>
      </div>`;
  }

  /* =========================================================
     PÁGINAS (Cama, Banho, peça, produto)
     ========================================================= */
  const vistaInicio = $('[data-vista="inicio"]');
  const vistaPagina = $('[data-vista="pagina"]');

  const migalhas = (itens) => `
    <nav class="migalhas" aria-label="Você está em">
      ${itens.map((it, i) => i < itens.length - 1
        ? `<a href="${it.href}">${it.nome}</a><span aria-hidden="true">›</span>`
        : `<span aria-current="page">${it.nome}</span>`).join("")}
    </nav>`;

  const blocos = (itens, { retrato = false } = {}) => {
    const colunas = itens.length === 2 || itens.length === 4 ? "blocos--2" : "";
    return `
      <ul class="blocos ${colunas} ${retrato ? "blocos--retrato" : ""}">
        ${itens.map((it) => `
          <li>
            <a class="bloco" href="${it.href}">
              ${it.desenho
                ? `<span class="bloco__desenho">${it.desenho}</span>`
                : `<img src="${it.foto}" alt="" loading="lazy" style="object-position:${it.pos || "50% 50%"}">`}
              <h2 class="bloco__nome">${it.nome}</h2>
              ${it.extra ? `<p class="bloco__extra">${it.extra}</p>` : ""}
              <p class="bloco__desc">${it.descricao}</p>
            </a>
          </li>`).join("")}
      </ul>`;
  };

  const blocosDeProdutos = (lista) => blocos(lista.map((p) => ({
    href: linkProduto(p), foto: p.foto, pos: p.pos, nome: p.nome, descricao: p.detalhe,
    extra: menorPreco(p) != null ? brl(menorPreco(p)) : qtdOpcoes(p) ? textoOpcoes(p) : "",
  })), { retrato: true });

  function blocoMedidas(p, tam) {
    if (!p.medidas) return "";
    const m = p.medidas;
    return `
      <div class="medidas">
        <p class="medidas__titulo">${p.medidasTitulo || "Medidas"}</p>
        <dl>
          <div><dt>Largura</dt><dd>${metros(m.largura)}</dd></div>
          <div><dt>Comprimento</dt><dd>${metros(m.comprimento)}</dd></div>
          ${m.altura != null ? `<div><dt>Altura</dt><dd>${metros(m.altura)}</dd></div>` : ""}
        </dl>
      </div>`;
  }

  function blocoAmostras(p) {
    const lista = irmaos(p);
    if (lista.length < 2) return "";
    return `
      <div class="amostras">
        <p class="amostras__titulo">${rotulo(p)}: <strong>${p.numero ? p.numero + " " : ""}${esc(p.variante)}</strong></p>
        <ul class="amostras__grade">
          ${lista.map((o) => `
            <li>
              <a class="amostra" href="${linkProduto(o)}" title="${o.numero ? o.numero + " " : ""}${esc(o.variante)}" ${o.id === p.id ? 'aria-current="page"' : ""}>
                <img src="${o.foto}" alt="${rotulo(o)} ${o.numero ? o.numero + " " : ""}${esc(o.variante)}" loading="lazy" style="object-position:${o.pos || "50% 50%"}">
                ${o.numero ? `<span aria-hidden="true">${o.numero}</span>` : ""}
              </a>
            </li>`).join("")}
        </ul>
      </div>`;
  }

  const caixaVazia = ({ titulo, texto, msg, link }) => `
    <div class="pagina__vazia">
      <p class="pagina__vazia-titulo">${titulo}</p>
      <p>${texto}</p>
      <a class="botao botao--cheio" href="${linkWhats(msg)}" target="_blank" rel="noopener">Perguntar no WhatsApp</a>
      <a class="link" href="${link.href}">${link.nome}</a>
    </div>`;

  function paginaDepto(d) {
    const cats = CATEGORIAS.filter((c) => c.depto === d.id);
    return {
      titulo: d.nome,
      depto: d.id,
      html: `
        ${migalhas([{ nome: "Início", href: "#/" }, { nome: d.nome }])}
        <h1 class="pagina__titulo" tabindex="-1">${d.nome}</h1>
        ${cats.length
          ? blocos(cats.map((c) => {
              const emBreve = !daCategoria(c).length;
              return {
                href: linkCat(c), foto: c.foto, nome: c.nome, descricao: c.descricao,
                desenho: emBreve && TAMANHOS[c.tamanho] ? desenhoCama(TAMANHOS[c.tamanho]) : "",
                extra: emBreve ? "Em breve" : "",
              };
            }))
          : caixaVazia({
              titulo: `Os produtos de ${d.nome.toLowerCase()} estão chegando.`,
              texto: "Enquanto isso, fale com a gente no WhatsApp para saber o que já temos.",
              msg: `Olá! Queria saber dos produtos de ${d.nome.toLowerCase()} da ${LOJA.nome}.`,
              link: { href: "#/cama", nome: "Ver produtos de cama" },
            })}`,
    };
  }

  function paginaCategoria(c) {
    const d = depto(c.depto);
    const lista = daCategoria(c);
    const nomeMinusculo = c.nome.charAt(0).toLowerCase() + c.nome.slice(1);
    return {
      titulo: c.nome,
      depto: d.id,
      html: `
        ${migalhas([{ nome: "Início", href: "#/" }, { nome: d.nome, href: `#/${d.id}` }, { nome: c.nome }])}
        <h1 class="pagina__titulo" tabindex="-1">${c.nome}</h1>
        ${!lista.length
          ? caixaVazia({
              titulo: `Os ${nomeMinusculo} estão chegando.`,
              texto: "As fotos ainda não estão no site. Pergunte no WhatsApp as cores e estampas que já temos.",
              msg: `Olá! Queria saber dos ${nomeMinusculo} da ${LOJA.nome}.`,
              link: { href: `#/${d.id}`, nome: `Ver tudo de ${d.nome.toLowerCase()}` },
            })
          : lista.some((p) => p.grupo)
          ? [...new Set(lista.map((p) => p.grupo))].map((g) => {
              const doGrupo = lista.filter((p) => p.grupo === g);
              return `<h2 class="pagina__grupo">${g} <span>${doGrupo.length}</span></h2>${blocosDeProdutos(doGrupo)}`;
            }).join("")
          : blocosDeProdutos(lista)}`,
    };
  }

  function paginaProduto(p) {
    const c = categoria(p.categoria);
    const d = depto(c.depto);
    const tam = tamanhoEscolhido(p);
    const outros = PRODUTOS.filter((o) => o.categoria === p.categoria && o.id !== p.id && (!p.colecao || o.colecao !== p.colecao));
    const duvida = linkWhats(`Olá! Tenho uma dúvida sobre o produto: ${p.nome} (${p.detalhe}).`);
    const recorte = Boolean(p.catalogo);
    return {
      titulo: p.nome,
      depto: d.id,
      html: `
        ${migalhas([{ nome: "Início", href: "#/" }, { nome: d.nome, href: `#/${d.id}` }, { nome: c.nome, href: linkCat(c) }, { nome: p.nome }])}
        <div class="produto-pg" data-produto="${p.id}" data-tipo="pagina">
          <div class="produto-pg__galeria ${recorte ? "produto-pg__galeria--recorte" : ""}">
            <button type="button" class="produto-pg__foto" data-ampliar aria-label="Ampliar a foto de ${esc(p.nome)}">
              <img src="${p.foto}" alt="${esc(p.nome)}${recorte || p.colecao ? "" : ": todas as opções"}">
              <span class="produto__ver">Toque para ampliar</span>
            </button>
            ${recorte ? `<button type="button" class="link produto-pg__catalogo" data-ampliar-catalogo>Ver o catálogo com todas as estampas</button>` : ""}
          </div>
          <div class="produto-pg__info">
            <h1 class="pagina__titulo produto-pg__nome" tabindex="-1">${p.nome}</h1>
            <p class="produto-pg__det">${p.detalhe}</p>
            <p class="produto-pg__desc">${p.descricao}</p>
            ${blocoPreco(p, tam)}
            ${blocoTamanho(p, tam)}
            ${blocoMedidas(p, tam)}
            ${blocoAmostras(p)}
            ${qtdOpcoes(p) ? `<p class="produto-pg__dica">São ${textoOpcoes(p)}. Veja o número e o nome de cada uma na foto.</p>` : ""}
            <div class="produto__acoes">
              ${blocoModelo(p)}
              <button type="button" class="botao botao--cheio botao--largo produto__add" data-adicionar>Adicionar à sacola</button>
            </div>
            <a class="link produto-pg__duvida" href="${duvida}" target="_blank" rel="noopener">Tirar uma dúvida sobre este produto no WhatsApp</a>
          </div>
        </div>
        ${outros.length ? `
          <section class="pagina__mais" aria-labelledby="t-mais">
            <h2 id="t-mais" class="secao__titulo">Mais em ${c.nome.toLowerCase()}</h2>
            ${blocosDeProdutos(outros)}
          </section>` : ""}`,
    };
  }

  function mostrarPagina(pg, { rolar = true } = {}) {
    vistaPagina.innerHTML = pg.html;
    vistaPagina.hidden = false;
    vistaInicio.hidden = true;
    document.title = `${pg.titulo} | ${LOJA.nome}`;
    marcarMenu(pg.depto);
    if (rolar) {
      window.scrollTo(0, 0);
      const h1 = $(".pagina__titulo", vistaPagina);
      if (h1) h1.focus({ preventScroll: true });
    }
  }

  function mostrarInicio(ancora) {
    const vinhaDePagina = !vistaPagina.hidden;
    vistaPagina.hidden = true;
    vistaPagina.innerHTML = "";
    vistaInicio.hidden = false;
    document.title = LOJA.nome;
    marcarMenu(null);
    const alvo = ancora && document.getElementById(ancora);
    if (alvo) alvo.scrollIntoView();
    else if (vinhaDePagina || !ancora) window.scrollTo(0, 0);
  }

  function marcarMenu(id) {
    $$("[data-menu] a").forEach((a) => {
      if (a.dataset.depto && a.dataset.depto === id) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  function rota() {
    const hash = decodeURIComponent(location.hash);
    if (hash.startsWith("#/") && hash.length > 2) {
      const [a, b] = hash.slice(2).split("/").filter(Boolean);
      if (a === "produto" && produto(b)) return mostrarPagina(paginaProduto(produto(b)));
      if (depto(a) && !b) return mostrarPagina(paginaDepto(depto(a)));
      const c = b && categoria(b);
      if (depto(a) && c && c.depto === a) return mostrarPagina(paginaCategoria(c));
      return mostrarInicio();
    }
    const ancora = hash.slice(1);
    const alvo = ancora && document.getElementById(ancora);
    if (alvo && !vistaInicio.contains(alvo)) return; // ex.: "Pular para o conteúdo"
    mostrarInicio(ancora);
  }
  window.addEventListener("hashchange", rota);

  /* ---------- Foto ampliada ---------- */
  const janela = $("[data-janela]");
  function ampliar(p, { catalogo = false } = {}) {
    const img = $("[data-janela-img]");
    img.src = catalogo ? p.catalogo : p.foto;
    img.alt = catalogo ? "Catálogo com todas as estampas" : p.nome;
    $("[data-janela-titulo]").textContent = catalogo ? "Todas as estampas da coleção" : p.nome;
    $("[data-janela-dica]").textContent = catalogo
      ? "Cada estampa tem sua página. Escolha pelo número nas miniaturas ao lado da foto."
      : qtdOpcoes(p)
        ? `Anote o número ou o nome ${rotulo(p) === "Cor" ? "da cor" : "da estampa"} e escolha na lista do produto.`
        : "";
    if (typeof janela.showModal === "function") janela.showModal();
    else janela.setAttribute("open", "");
  }
  janela.addEventListener("click", (e) => {
    if (e.target === janela || e.target.closest("[data-janela-fechar]")) janela.close();
  });
  janela.addEventListener("close", () => {
    const btn = $("[data-ampliar]", vistaPagina);
    if (btn) btn.focus();
  });

  /* ---------- Cliques ---------- */
  function redesenharProduto(caixa) {
    const p = produto(caixa.dataset.produto);
    if (caixa.dataset.tipo === "pagina") mostrarPagina(paginaProduto(p), { rolar: false });
    else caixa.outerHTML = cartao(p);
  }

  document.addEventListener("click", (e) => {
    const alvo = e.target.closest("[data-cat], [data-tam], [data-escolher], [data-adicionar], [data-ampliar], [data-ampliar-catalogo], [data-limpar], [data-limpar-tam]");
    if (!alvo) return;

    if (alvo.matches("[data-ampliar-catalogo]")) {
      ampliar(produto(alvo.closest("[data-produto]").dataset.produto), { catalogo: true });
      return;
    }

    if (alvo.matches("[data-cat]")) {
      estado.cat = alvo.dataset.cat;
      renderizar();
      return;
    }
    if (alvo.matches("[data-tam]")) {
      const t = alvo.dataset.tam || null;
      estado.tam = alvo.classList.contains("cama") && estado.tam === t ? null : t;
      renderizar();
      return;
    }
    if (alvo.matches("[data-escolher]")) {
      const caixa = alvo.closest("[data-produto]");
      const id = caixa.dataset.produto;
      escolha(id).tam = alvo.dataset.escolher;
      redesenharProduto(caixa);
      const novo = $(`[data-produto="${id}"] [data-escolher="${escolha(id).tam}"]`);
      if (novo) novo.focus();
      return;
    }
    if (alvo.matches("[data-ampliar]")) {
      ampliar(produto(alvo.closest("[data-produto]").dataset.produto));
      return;
    }
    if (alvo.matches("[data-adicionar]")) {
      const caixa = alvo.closest("[data-produto]");
      const p = produto(caixa.dataset.produto);
      const modelo = escolha(p.id).modelo;
      if (qtdOpcoes(p) && !modelo) {
        const sel = $("[data-modelo]", caixa);
        sel.classList.add("erro");
        sel.focus();
        avisar(`Escolha ${rotulo(p) === "Cor" ? "a cor" : "a estampa"} antes de adicionar`, false);
        return;
      }
      adicionar(p, tamanhoEscolhido(p), modelo);
      return;
    }
    if (alvo.matches("[data-limpar]")) {
      estado.cat = "todos";
      estado.tam = null;
      renderizar();
      return;
    }
    if (alvo.matches("[data-limpar-tam]")) {
      estado.tam = null;
      renderizar();
    }
  });

  document.addEventListener("change", (e) => {
    const sel = e.target.closest("[data-modelo]");
    if (!sel) return;
    escolha(sel.closest("[data-produto]").dataset.produto).modelo = sel.value;
    sel.classList.toggle("erro", !sel.value);
  });

  /* ---------- Sacola ---------- */
  const CHAVE = "bf-sacola";
  function carregarSacola() {
    try {
      const salvo = JSON.parse(localStorage.getItem(CHAVE) || "[]");
      return Array.isArray(salvo) ? salvo.filter((i) => produto(i.id)) : [];
    } catch { return []; }
  }
  function salvarSacola() {
    try { localStorage.setItem(CHAVE, JSON.stringify(estado.sacola)); } catch { /* sem armazenamento: segue sem salvar */ }
  }

  function adicionar(p, tam, modelo) {
    const item = estado.sacola.find((i) => i.id === p.id && i.tam === tam && i.modelo === modelo);
    if (item) item.qtd += 1;
    else estado.sacola.push({ id: p.id, tam, modelo, qtd: 1 });
    salvarSacola();
    renderizarSacola();
    const qtd = $("[data-qtd]");
    qtd.classList.remove("pulo"); void qtd.offsetWidth; qtd.classList.add("pulo");
    avisar(`Adicionado à sacola: ${p.nome}${modelo ? ", " + modelo : ""}`);
  }

  const totalItem = (i) => {
    const preco = precoDe(produto(i.id), i.tam);
    return preco == null ? null : preco * i.qtd;
  };
  const descricaoTam = (i) => {
    const t = textoTam(i.tam);
    return i.tam === "Único" ? "Tamanho único" : t ? t.charAt(0).toUpperCase() + t.slice(1) : "";
  };

  function renderizarSacola() {
    const itens = estado.sacola;
    const qtdTotal = itens.reduce((s, i) => s + i.qtd, 0);
    const todosComPreco = itens.every((i) => totalItem(i) != null);
    const total = todosComPreco ? itens.reduce((s, i) => s + totalItem(i), 0) : null;

    const badge = $("[data-qtd]");
    badge.hidden = qtdTotal === 0;
    badge.textContent = qtdTotal;

    $("[data-itens]").innerHTML = itens.map((i, idx) => {
      const p = produto(i.id);
      const valor = totalItem(i);
      return `
        <li class="item">
          <img src="${p.foto}" alt="" width="64" height="80" style="object-position:${p.pos || "50% 50%"}">
          <div>
            <p class="item__nome"><a href="${linkProduto(p)}" data-fechar-sacola>${p.nome}</a></p>
            ${i.modelo ? `<p class="item__det">${rotulo(p)}: ${esc(i.modelo)}</p>` : ""}
            ${descricaoTam(i) ? `<p class="item__det">${descricaoTam(i)}</p>` : ""}
            <div class="item__qtd">
              <button type="button" data-menos="${idx}" aria-label="Diminuir quantidade">−</button>
              <span aria-label="Quantidade">${i.qtd}</span>
              <button type="button" data-mais="${idx}" aria-label="Aumentar quantidade">+</button>
            </div>
          </div>
          <div class="item__direita">
            <span class="item__valor">${valor == null ? "" : brl(valor)}</span>
            <button type="button" class="item__remover" data-remover="${idx}">Remover</button>
          </div>
        </li>`;
    }).join("");

    $("[data-sacola-vazia]").hidden = itens.length > 0;
    $("[data-sacola-rodape]").hidden = itens.length === 0;
    if (!itens.length) return;

    const frete = $("[data-frete]");
    const totais = $("[data-totais]");
    frete.hidden = totais.hidden = !todosComPreco;
    $("[data-nota]").textContent = todosComPreco
      ? "Confirmamos o frete e o prazo na conversa."
      : "Confirmamos o preço, o frete e o prazo na conversa.";

    if (todosComPreco) {
      $("[data-total]").textContent = brl(total);
      $("[data-total-pix]").textContent = brl(comPix(total));
      const falta = LOJA.freteGratisAcima - total;
      frete.classList.toggle("gratis", falta <= 0);
      frete.textContent = falta <= 0 ? "Seu pedido tem frete grátis." : `Faltam ${brl(falta)} para o frete grátis.`;
    }

    const linhas = itens.map((i) => {
      const p = produto(i.id);
      const partes = [`${i.qtd}x ${p.nome}`];
      if (p.numero) partes.push(`estampa ${p.numero}`);
      if (i.modelo) partes.push(`${rotulo(p).toLowerCase()} ${i.modelo}`);
      if (textoTam(i.tam)) partes.push(textoTam(i.tam).toLowerCase());
      const valor = totalItem(i);
      return `• ${partes.join(", ")}${valor == null ? "" : `: ${brl(valor)}`}`;
    });
    const msg = [
      "Olá! Quero fazer este pedido pelo site:",
      "",
      ...linhas,
      "",
      ...(todosComPreco
        ? [`Total no cartão: ${brl(total)}${LOJA.parcelasSemJuros > 1 ? ` (até ${LOJA.parcelasSemJuros}x sem juros)` : ""}`, `Total no PIX: ${brl(comPix(total))}`, ""]
        : []),
      ...(itens.some((i) => !i.tam) ? ["Tamanho da minha cama: "] : []),
      "Meu CEP é: ",
    ].join("\n");
    $("[data-enviar]").href = linkWhats(msg);
  }

  $("[data-itens]").addEventListener("click", (e) => {
    if (e.target.closest("[data-fechar-sacola]")) { fecharSacola(false); return; }
    const b = e.target.closest("button");
    if (!b) return;
    const idx = Number(b.dataset.mais ?? b.dataset.menos ?? b.dataset.remover);
    const item = estado.sacola[idx];
    if (!item) return;
    if ("mais" in b.dataset) item.qtd += 1;
    if ("menos" in b.dataset) item.qtd -= 1;
    if ("remover" in b.dataset || item.qtd < 1) estado.sacola.splice(idx, 1);
    salvarSacola();
    renderizarSacola();
  });

  const painel = $("#sacola");
  const fundo = $("[data-sacola-fundo]");
  const botaoSacola = $(".botao-sacola");

  function abrirSacola() {
    painel.classList.add("aberta");
    painel.setAttribute("aria-hidden", "false");
    botaoSacola.setAttribute("aria-expanded", "true");
    fundo.hidden = false;
    document.body.classList.add("sacola-aberta");
    painel.focus();
  }
  function fecharSacola(devolverFoco = true) {
    painel.classList.remove("aberta");
    painel.setAttribute("aria-hidden", "true");
    botaoSacola.setAttribute("aria-expanded", "false");
    fundo.hidden = true;
    document.body.classList.remove("sacola-aberta");
    if (devolverFoco) botaoSacola.focus();
  }
  botaoSacola.addEventListener("click", abrirSacola);
  fundo.addEventListener("click", () => fecharSacola());
  $("[data-fechar]").addEventListener("click", () => fecharSacola());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && painel.classList.contains("aberta")) fecharSacola();
  });

  /* ---------- Aviso rápido ---------- */
  let timerAviso;
  function avisar(texto, comLink = true) {
    const t = $("[data-toast]");
    t.innerHTML = `${esc(texto)}.${comLink ? ` <button type="button" class="link" style="color:inherit" data-ver-sacola>Ver sacola</button>` : ""}`;
    t.classList.add("visivel");
    t.style.pointerEvents = "auto";
    clearTimeout(timerAviso);
    timerAviso = setTimeout(() => { t.classList.remove("visivel"); t.style.pointerEvents = "none"; }, 3200);
  }
  $("[data-toast]").addEventListener("click", (e) => {
    if (e.target.closest("[data-ver-sacola]")) {
      $("[data-toast]").classList.remove("visivel");
      abrirSacola();
    }
  });

  renderizar();
  renderizarSacola();
  rota();
})();
