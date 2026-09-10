/* =============================================================
   Portemonnaie — Explorer (S9 catalog, interim after task 02).
   Vanilla JS, no dependencies. Loads data/securities.json and
   renders: type filter + search (left/middle), a sortable list
   of product cards, and the basket panel (right).

   Removed with task 02 (PRD 2.4, 7.7): own scores, impact sort,
   theme filter, radar, product-page links, the 5-item "built"
   ring. Default sort is name A to Z; the user chooses any other
   sort. Weights and the PRD product drawer come with tasks 13/14.

   Reacts to the shared EN/DE toggle via "pm:langchange".
   ============================================================= */

(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const STORE_KEY = "pm_basket";

  /* ── copy (EN / DE) ─────────────────────────────────────── */
  const EXPLORE_I18N = {
    en: {
      filterEyebrow: "Catalog",
      filterLede: "Filters you set yourself.",
      catTitle: "Categories",
      searchPh: "Search by name, ISIN or theme…",
      resultsTitle: "ETFs, stocks & funds",
      resultsCount: (n) => `${n} ${n === 1 ? "result" : "results"}`,
      sortLabel: "Sort by",
      sortName: "Sort: Name A–Z",
      sortCost: "Sort: Cost ascending",
      basketEyebrow: "Your portfolio",
      basketEmptyTitle: "Drag products here or tap +.",
      basketEmptySub: "Your portfolio builds up below.",
      basketTitle: "Your portfolio",
      basketSub: "Drag a card here, or use the + on any product.",
      portfolioTitle: "Your portfolio",
      portfolioCount: (n) => `${n} ${n === 1 ? "product" : "products"}`,
      legendEtf: "ETFs",
      legendStock: "Stocks",
      legendFund: "Funds",
      next: "To the portfolio",
      disclaimer: "The information does not constitute investment advice, any other recommendation, or an offer to buy securities or to make specific investments.",
      remove: "Remove",
      add: "Add to portfolio",
      typeShort: { ETF: "ETF", Stock: "Stock", Fund: "Fund" },
      cat: { ETF: "ETFs", Stock: "Stocks", Fund: "Funds" },
      ter: "TER",
      steps: ["Quiz", "Summary", "Explorer", "Portfolio"]
    },
    de: {
      filterEyebrow: "Katalog",
      filterLede: "Filter, die du selbst setzt.",
      catTitle: "Kategorien",
      searchPh: "Suche nach Name, ISIN oder Thema…",
      resultsTitle: "ETFs, Aktien & Fonds",
      resultsCount: (n) => `${n} ${n === 1 ? "Ergebnis" : "Ergebnisse"}`,
      sortLabel: "Sortieren nach",
      sortName: "Sortieren: Name A–Z",
      sortCost: "Sortieren: Kosten aufsteigend",
      basketEyebrow: "Dein Portfolio",
      basketEmptyTitle: "Zieh Produkte hierher oder tipp auf „+“.",
      basketEmptySub: "Dein Portfolio baut sich unten auf.",
      basketTitle: "Dein Portfolio",
      basketSub: "Zieh eine Karte hierher oder nutze das + am Produkt.",
      portfolioTitle: "Dein Portfolio",
      portfolioCount: (n) => `${n} ${n === 1 ? "Produkt" : "Produkte"}`,
      legendEtf: "ETFs",
      legendStock: "Aktien",
      legendFund: "Fonds",
      next: "Zum Portfolio",
      disclaimer: "Die Informationen stellen keine Anlageberatung, keine sonstige Empfehlung und kein Angebot zum Kauf von Wertpapieren oder zur Vornahme bestimmter Investitionen dar.",
      remove: "Entfernen",
      add: "In mein Portfolio",
      typeShort: { ETF: "ETF", Stock: "Aktie", Fund: "Fonds" },
      cat: { ETF: "ETFs", Stock: "Aktien", Fund: "Fonds" },
      ter: "TER",
      steps: ["Quiz", "Zusammenfassung", "Explorer", "Portfolio"]
    }
  };

  const TYPE_SWATCH = { ETF: "#4E8C6A", Stock: "#2D6A4F", Fund: "#A8D5BA" };

  /* ── state ──────────────────────────────────────────────── */
  let DATA = [];
  let lang = (document.documentElement.lang === "de" ||
              localStorage.getItem("pm_lang") === "de") ? "de" : "en";
  const filters = { types: new Set(), q: "", sort: "name" }; // PRD S9: neutral default sort
  let basket = loadBasket();

  function t() { return EXPLORE_I18N[lang]; }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  /* ── persistence ────────────────────────────────────────── */
  function loadBasket() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveBasket() {
    localStorage.setItem(STORE_KEY, JSON.stringify(basket));
  }

  /* ── filtering + sorting (pure set operations, PRD S9) ─── */
  function visible() {
    const q = filters.q.trim().toLowerCase();
    const out = DATA.filter((s) => {
      if (filters.types.size && !filters.types.has(s.type)) return false;
      if (q) {
        const hay = (s.name + " " + (s.isin || "") + " " + (s.themes || []).join(" ")).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const by = {
      name: (a, b) => a.name.localeCompare(b.name),
      cost: (a, b) => (a.ter == null ? 1 : 0) - (b.ter == null ? 1 : 0) || (a.ter || 0) - (b.ter || 0)
    };
    return out.sort(by[filters.sort] || by.name);
  }

  /* ── render: filters ────────────────────────────────────── */
  function renderFilters() {
    const types = ["ETF", "Stock", "Fund"];
    const checkIcon = `<svg class="pill__check" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const typePills = types.map((ty) =>
      `<button type="button" class="pill ${filters.types.has(ty) ? "is-on" : ""}" data-type="${ty}">${checkIcon}${t().cat[ty]}</button>`
    ).join("");

    $("#filters").innerHTML = `
      <p class="filters__eyebrow">${t().filterEyebrow}</p>
      <p class="filters__lede">${t().filterLede}</p>
      <div class="filters__group">
        <div class="filters__label">${t().catTitle}</div>
        <div class="pillset">${typePills}</div>
      </div>`;

    $$("#filters .pill[data-type]").forEach((b) =>
      b.addEventListener("click", () => { toggle(filters.types, b.dataset.type); renderFilters(); renderCards(); })
    );
  }
  function toggle(set, v) { set.has(v) ? set.delete(v) : set.add(v); }

  /* ── render: cards ──────────────────────────────────────── */
  function renderCards() {
    const list = visible();
    $("#resultsTitle").textContent = t().resultsTitle;
    $("#resultsCount").textContent = t().resultsCount(list.length);

    if (!list.length) {
      $("#cards").innerHTML = `<li class="empty">—</li>`;
      return;
    }

    $("#cards").innerHTML = list.map((s) => {
      const inBasket = basket.includes(s.id);
      const terStr = s.ter != null ? ` · ${t().ter} ${s.ter.toFixed(2).replace(".", lang === "de" ? "," : ".")}%` : "";
      const addIcon = inBasket
        ? `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10.5l3.8 3.8L16 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        : `<svg viewBox="0 0 20 20" aria-hidden="true"><line x1="10" y1="4" x2="10" y2="16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><line x1="4" y1="10" x2="16" y2="10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`;

      return `<li class="card ${inBasket ? "is-selected" : ""}" draggable="true" data-id="${esc(s.id)}">
        <div class="card__main">
          <a class="card__name" href="product.html?id=${encodeURIComponent(s.id)}">${esc(s.name)}</a>
          <div class="card__meta">${t().typeShort[s.type] || esc(s.type)} · ${esc(s.region)}${terStr}${s.isin ? " · " + esc(s.isin) : ""}</div>
          <div class="card__stats">${esc(s.description || "")}</div>
        </div>
        <div class="card__right">
          <button type="button" class="addbtn ${inBasket ? "is-added" : ""}" data-add="${esc(s.id)}" aria-label="${t().add}">${addIcon}</button>
        </div>
      </li>`;
    }).join("");

    $$("#cards .addbtn").forEach((b) =>
      b.addEventListener("click", (e) => { e.stopPropagation(); toggleBasket(b.dataset.add); })
    );
    wireDragSources();
  }

  /* ── basket ─────────────────────────────────────────────── */
  function toggleBasket(id) {
    const i = basket.indexOf(id);
    if (i >= 0) basket.splice(i, 1);
    else if (!basket.includes(id)) basket.push(id);
    saveBasket();
    renderCards();
    renderBasket();
  }
  function addToBasket(id) {
    if (!basket.includes(id)) { basket.push(id); saveBasket(); renderCards(); renderBasket(); }
  }

  function renderBasket() {
    const items = basket.map((id) => DATA.find((s) => s.id === id)).filter(Boolean);
    $("#basketEyebrow").textContent = t().basketEyebrow;
    $("#basketTitle").textContent = items.length ? t().basketTitle : t().basketEmptyTitle;
    $("#basketSub").textContent = items.length ? t().basketSub : t().basketEmptySub;

    $("#basketList").innerHTML = items.map((s) =>
      `<li class="basket-item" data-id="${esc(s.id)}">
        <span class="basket-item__swatch" style="background:${TYPE_SWATCH[s.type] || TYPE_SWATCH.Fund}"></span>
        <span class="basket-item__name">${esc(s.name)}</span>
        <button type="button" class="basket-item__remove" data-remove="${esc(s.id)}" aria-label="${t().remove}">
          <svg viewBox="0 0 16 16" aria-hidden="true"><line x1="4" y1="4" x2="12" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="12" y1="4" x2="4" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </button>
      </li>`
    ).join("");

    $$("#basketList .basket-item__remove").forEach((b) =>
      b.addEventListener("click", () => toggleBasket(b.dataset.remove))
    );

    $("#autofill").innerHTML = "";
    renderPortfolio(items);
  }

  /* ── portfolio donut (share by type, descriptive only) ──── */
  function renderPortfolio(items) {
    $("#portfolioTitle").textContent = t().portfolioTitle;
    const n = items.length;
    $("#portfolioProgress").textContent = t().portfolioCount(n);

    const counts = { ETF: 0, Stock: 0, Fund: 0 };
    items.forEach((s) => { counts[s.type] = (counts[s.type] || 0) + 1; });
    const total = n || 1;
    const seg = [
      { key: "ETF", label: t().legendEtf, val: counts.ETF, color: TYPE_SWATCH.ETF },
      { key: "Stock", label: t().legendStock, val: counts.Stock, color: TYPE_SWATCH.Stock },
      { key: "Fund", label: t().legendFund, val: counts.Fund, color: TYPE_SWATCH.Fund }
    ];

    const R = 48, C = 60, circ = 2 * Math.PI * R;
    let accFrac = 0;
    const arcs = seg.filter((g) => g.val > 0).map((g) => {
      const frac = g.val / total;
      const len = frac * circ;
      const rot = -90 + accFrac * 360;
      accFrac += frac;
      return `<circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="${g.color}" stroke-width="12"
        stroke-dasharray="${len.toFixed(1)} ${(circ - len).toFixed(1)}"
        transform="rotate(${rot.toFixed(2)} ${C} ${C})"/>`;
    }).join("");
    $("#donut").innerHTML = `
      <circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="12"/>
      ${arcs}
      <text x="${C}" y="${C + 6}" text-anchor="middle" class="donut__label">${n}</text>`;

    $("#portfolioLegend").innerHTML = seg.map((g) => {
      const share = n ? Math.round((g.val / total) * 100) : 0;
      return `<li class="legend-row">
        <span class="legend-row__dot" style="background:${g.color}"></span>
        <span class="legend-row__name">${g.label}</span>
        <span class="legend-row__val">${share}%</span>
      </li>`;
    }).join("");

    const btn = $("#checkoutBtn");
    btn.textContent = t().next;
    btn.disabled = n === 0;
    $("#portfolioDisclaimer").textContent = t().disclaimer;
  }

  /* ── drag & drop (button alternative: the + on each card) ─ */
  function wireDragSources() {
    $$("#cards .card").forEach((card) => {
      card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", card.dataset.id);
        e.dataTransfer.effectAllowed = "copy";
        card.classList.add("is-dragging");
      });
      card.addEventListener("dragend", () => card.classList.remove("is-dragging"));
    });
  }
  function wireDropZone() {
    const zone = $("#basket");
    const over = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; zone.classList.add("is-drop"); };
    zone.addEventListener("dragover", over);
    zone.addEventListener("dragenter", over);
    zone.addEventListener("dragleave", (e) => { if (!zone.contains(e.relatedTarget)) zone.classList.remove("is-drop"); });
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("is-drop");
      const id = e.dataTransfer.getData("text/plain");
      if (id) addToBasket(id);
    });
  }

  /* ── chrome (search, sort, steps) ───────────────────────── */
  function renderChrome() {
    $("#search").placeholder = t().searchPh;
    $("#sortLabel").textContent = t().sortLabel;
    $("#resultsDisclaimer").textContent = t().disclaimer;
    const sort = $("#sort");
    const opts = [["name", t().sortName], ["cost", t().sortCost]];
    sort.innerHTML = opts.map(([v, l]) => `<option value="${v}">${l}</option>`).join("");
    sort.value = filters.sort;

    $("#flowsteps").innerHTML = t().steps.map((name, i) => {
      const cls = i < 2 ? "is-done" : (i === 2 ? "is-active" : "");
      return `<div class="flowstep ${cls}">
        <span class="flowstep__dot"></span><span class="flowstep__name">${name}</span>
        ${i < t().steps.length - 1 ? '<span class="flowstep__line"></span>' : ""}
      </div>`;
    }).join("");
  }

  function wireChrome() {
    let deb;
    $("#search").addEventListener("input", (e) => {
      clearTimeout(deb);
      deb = setTimeout(() => { filters.q = e.target.value; renderCards(); }, 120);
    });
    $("#sort").addEventListener("change", (e) => { filters.sort = e.target.value; renderCards(); });
    $("#checkoutBtn").addEventListener("click", () => {
      if (!basket.length) return;
      location.href = "portfolio.html";
    });
  }

  /* ── full re-render on language switch ──────────────────── */
  function renderAll() { renderChrome(); renderFilters(); renderCards(); renderBasket(); }

  document.addEventListener("pm:langchange", (e) => {
    lang = (e.detail && e.detail.lang === "de") ? "de" : "en";
    renderAll();
  });

  /* ── boot ───────────────────────────────────────────────── */
  function showError() {
    $("#cards").innerHTML =
      `<li class="empty">Could not load the securities dataset.<br>
      Open this page through a local web server or the deployed site — browsers block <code>fetch()</code> of local files.</li>`;
  }

  fetch("data/securities.json")
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((doc) => {
      DATA = doc.securities || [];
      basket = basket.filter((id) => DATA.some((s) => s.id === id));
      wireDropZone();
      wireChrome();
      renderAll();
    })
    .catch(showError);
})();
