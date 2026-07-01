/* =============================================================
   Portemonnaie — Explore (basket builder).
   Vanilla JS, no dependencies. Loads data/securities.json and
   renders the three-column explore experience:
     · left   — category + impact/gender filters
     · middle — searchable, sortable product cards w/ radar charts
     · right  — drag-and-drop basket + portfolio donut

   Reacts to the shared EN/DE toggle via the "pm:langchange" event
   dispatched by i18n.js. All explore copy lives in EXPLORE_I18N so
   this page stays self-contained.
   ============================================================= */

(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const STORE_KEY = "pm_basket";
  const TARGET_SIZE = 5; // portfolio is "built" at 5 positions (mirrors the flow)

  /* ── copy (EN / DE) ─────────────────────────────────────── */
  const EXPLORE_I18N = {
    en: {
      filterEyebrow: "Sustainability & Gender",
      filterLede: "Your filter for impact.",
      catTitle: "Categories",
      impactTitle: "Impact & Gender",
      searchPh: "Search companies, ETFs and funds…",
      resultsTitle: "ETFs, stocks & funds",
      resultsCount: (n) => `${n} ${n === 1 ? "result" : "results"}`,
      sortLabel: "Sort by",
      sortImpact: "Sort: Impact",
      sortSustainability: "Sort: Sustainability",
      sortGender: "Sort: Gender",
      sortName: "Sort: Name",
      basketEyebrow: "Your basket",
      basketEmptyTitle: "Drag ETFs here.",
      basketEmptySub: "Drag & drop. Your portfolio builds itself.",
      basketTitle: "Your basket",
      basketSub: "Drag a card here, or use the + on any product.",
      autofill: "fills automatically",
      portfolioTitle: "Your portfolio",
      portfolioProgress: (pct, n) => `${pct}% built · ${n} of ${TARGET_SIZE}`,
      legendEtf: "ETFs",
      legendStock: "Stocks",
      legendFund: "Funds",
      impactHead: "Your impact",
      susLabel: "Sustainability score",
      genLabel: "Gender score",
      checkout: "Checkout",
      disclaimer: "This is not investment advice. Content is for educational purposes only.",
      remove: "Remove",
      add: "Add to basket",
      risk: { low: "lower risk", medium: "medium risk", high: "higher risk" },
      typeShort: { ETF: "ETF", Stock: "Stock", Fund: "Fund" },
      cat: { ETF: "ETFs", Stock: "Stocks", Fund: "Funds" },
      positions: "positions",
      ter: "TER",
      sus: "Sustainability",
      gen: "Gender",
      steps: ["Quiz", "Type", "Explore", "Portfolio", "Checkout"]
    },
    de: {
      filterEyebrow: "Nachhaltigkeit & Gender",
      filterLede: "Dein Filter für Wirkung.",
      catTitle: "Kategorien",
      impactTitle: "Wirkung & Gender",
      searchPh: "Suche nach Unternehmen, ETFs und Fonds…",
      resultsTitle: "ETFs, Aktien & Fonds",
      resultsCount: (n) => `${n} ${n === 1 ? "Ergebnis" : "Ergebnisse"}`,
      sortLabel: "Sortieren nach",
      sortImpact: "Sortieren: Wirkung",
      sortSustainability: "Sortieren: Nachhaltigkeit",
      sortGender: "Sortieren: Gender",
      sortName: "Sortieren: Name",
      basketEyebrow: "Dein Basket",
      basketEmptyTitle: "Zieh ETFs hierher.",
      basketEmptySub: "Drag & Drop. Dein Portfolio baut sich auf.",
      basketTitle: "Dein Basket",
      basketSub: "Zieh eine Karte hierher oder nutze das + am Produkt.",
      autofill: "füllt sich automatisch",
      portfolioTitle: "Dein Portfolio",
      portfolioProgress: (pct, n) => `${pct}% aufgebaut · ${n} von ${TARGET_SIZE}`,
      legendEtf: "ETFs",
      legendStock: "Aktien",
      legendFund: "Fonds",
      impactHead: "Deine Wirkung",
      susLabel: "Nachhaltigkeits-Score",
      genLabel: "Gender-Score",
      checkout: "Checkout",
      disclaimer: "Dies ist keine Anlageberatung. Die Inhalte dienen ausschließlich Bildungszwecken.",
      remove: "Entfernen",
      add: "Zum Basket hinzufügen",
      risk: { low: "Risiko niedrig", medium: "Risiko mittel", high: "Risiko höher" },
      typeShort: { ETF: "ETF", Stock: "Aktie", Fund: "Fonds" },
      cat: { ETF: "ETFs", Stock: "Aktien", Fund: "Fonds" },
      positions: "Positionen",
      ter: "TER",
      sus: "Nachhaltigkeit",
      gen: "Gender",
      steps: ["Quiz", "Typ", "Entdecken", "Portfolio", "Checkout"]
    }
  };

  /* friendly labels for the kebab themes found in the data */
  const THEME_LABELS = {
    en: {
      "gender-diversity": "Women in leadership",
      "empowerment": "Empowerment",
      "sustainability": "Sustainability",
      "esg": "ESG leaders",
      "sri": "Socially responsible",
      "climate": "Climate",
      "clean-energy": "Renewable energy",
      "water": "Water",
      "environment": "Environment",
      "consumer-staples": "Everyday goods",
      "technology": "Technology",
      "impact": "Impact"
    },
    de: {
      "gender-diversity": "Frauen in Führung",
      "empowerment": "Empowerment",
      "sustainability": "Nachhaltigkeit",
      "esg": "ESG-Vorreiter",
      "sri": "Sozial verantwortlich",
      "climate": "Klima",
      "clean-energy": "Erneuerbare Energien",
      "water": "Wasser",
      "environment": "Umwelt",
      "consumer-staples": "Alltagsgüter",
      "technology": "Technologie",
      "impact": "Wirkung"
    }
  };

  /* gender letter grade → 0-100 (radar + sorting only) */
  const GENDER_NUM = { "A+": 100, A: 90, B: 78, C: 64, D: 50, E: 35, F: 15 };
  const IMPACT_NUM = { High: 3, Medium: 2, Low: 1 };
  // Stock was --forest (#1F3A2E) — invisible against the forest portfolio panel.
  // Lifted to a brighter emerald that reads on both the cream basket and dark panel.
  const TYPE_SWATCH = { ETF: "#4E8C6A", Stock: "#2D6A4F", Fund: "#A8D5BA" };

  /* ── state ──────────────────────────────────────────────── */
  let DATA = [];
  // i18n.js runs first and sets <html lang> + may store pm_lang; mirror it so
  // the explore content boots in the same language as the nav (avoids desync).
  let lang = (document.documentElement.lang === "de" ||
              localStorage.getItem("pm_lang") === "de") ? "de" : "en";
  const filters = { types: new Set(), themes: new Set(), q: "", sort: "impact" };
  let basket = loadBasket();
  let availableThemes = [];

  function t() { return EXPLORE_I18N[lang]; }
  function themeLabel(key) {
    return (THEME_LABELS[lang][key]) || key.replace(/-/g, " ");
  }

  /* ── persistence ────────────────────────────────────────── */
  function loadBasket() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveBasket() {
    localStorage.setItem(STORE_KEY, JSON.stringify(basket));
  }

  /* ── radar (6 axes) ─────────────────────────────────────── */
  function radarSVG(s) {
    const axes = [
      s.fourCapitals.environmental,
      s.fourCapitals.social,
      s.sustainabilityScore,
      GENDER_NUM[s.genderScore],
      s.fourCapitals.financial,
      s.fourCapitals.network
    ];
    const cx = 46, cy = 46, r = 38;
    const pt = (val, i) => {
      const a = (Math.PI * 2 * i / axes.length) - Math.PI / 2;
      const rad = r * (val / 100);
      return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
    };
    const grid = (val) => axes.map((_, i) => {
      const a = (Math.PI * 2 * i / axes.length) - Math.PI / 2;
      return `${(cx + r * val * Math.cos(a)).toFixed(1)},${(cy + r * val * Math.sin(a)).toFixed(1)}`;
    }).join(" ");
    const poly = axes.map((v, i) => pt(v, i).map((n) => n.toFixed(1)).join(",")).join(" ");
    const spokes = axes.map((_, i) => {
      const a = (Math.PI * 2 * i / axes.length) - Math.PI / 2;
      return `<line x1="${cx}" y1="${cy}" x2="${(cx + r * Math.cos(a)).toFixed(1)}" y2="${(cy + r * Math.sin(a)).toFixed(1)}" stroke="rgba(26,46,36,0.12)" stroke-width="1"/>`;
    }).join("");
    return `<svg class="radar" viewBox="0 0 92 92" aria-hidden="true">
      <polygon points="${grid(1)}" fill="none" stroke="rgba(26,46,36,0.10)" stroke-width="1"/>
      <polygon points="${grid(0.66)}" fill="none" stroke="rgba(26,46,36,0.08)" stroke-width="1"/>
      <polygon points="${grid(0.33)}" fill="none" stroke="rgba(26,46,36,0.06)" stroke-width="1"/>
      ${spokes}
      <polygon points="${poly}" fill="rgba(168,213,186,0.55)" stroke="#4E8C6A" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`;
  }

  /* ── filtering + sorting ────────────────────────────────── */
  function visible() {
    const q = filters.q.trim().toLowerCase();
    let out = DATA.filter((s) => {
      if (filters.types.size && !filters.types.has(s.type)) return false;
      if (filters.themes.size && !s.themes.some((th) => filters.themes.has(th))) return false;
      if (q) {
        const hay = (s.name + " " + (s.ticker || "") + " " + s.themes.join(" ") + " " + s.sector).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const by = {
      impact: (a, b) => (IMPACT_NUM[b.impact] - IMPACT_NUM[a.impact]) || (b.sustainabilityScore - a.sustainabilityScore),
      sustainability: (a, b) => b.sustainabilityScore - a.sustainabilityScore,
      gender: (a, b) => GENDER_NUM[b.genderScore] - GENDER_NUM[a.genderScore],
      name: (a, b) => a.name.localeCompare(b.name)
    };
    return out.sort(by[filters.sort] || by.impact);
  }

  /* ── render: filters ────────────────────────────────────── */
  function renderFilters() {
    const types = ["ETF", "Stock", "Fund"];
    const checkIcon = `<svg class="pill__check" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    const typePills = types.map((ty) =>
      `<button type="button" class="pill ${filters.types.has(ty) ? "is-on" : ""}" data-type="${ty}">${checkIcon}${t().cat[ty]}</button>`
    ).join("");

    const themePills = availableThemes.map((th) =>
      `<button type="button" class="pill ${filters.themes.has(th) ? "is-on" : ""}" data-theme="${th}">${checkIcon}${themeLabel(th)}</button>`
    ).join("");

    $("#filters").innerHTML = `
      <p class="filters__eyebrow">${t().filterEyebrow}</p>
      <p class="filters__lede">${t().filterLede}</p>
      <div class="filters__group">
        <div class="filters__label">${t().catTitle}</div>
        <div class="pillset">${typePills}</div>
      </div>
      <div class="filters__group">
        <div class="filters__label">${t().impactTitle}</div>
        <div class="pillset">${themePills}</div>
      </div>`;

    $$("#filters .pill[data-type]").forEach((b) =>
      b.addEventListener("click", () => { toggle(filters.types, b.dataset.type); renderFilters(); renderCards(); })
    );
    $$("#filters .pill[data-theme]").forEach((b) =>
      b.addEventListener("click", () => { toggle(filters.themes, b.dataset.theme); renderFilters(); renderCards(); })
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
      const sus = (s.sustainabilityScore / 10).toFixed(1).replace(".", lang === "de" ? "," : ".");
      const tags = s.themes.slice(0, 2).map((th) => `<span class="tag">${themeLabel(th)}</span>`).join("");
      const addIcon = inBasket
        ? `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10.5l3.8 3.8L16 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        : `<svg viewBox="0 0 20 20" aria-hidden="true"><line x1="10" y1="4" x2="10" y2="16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><line x1="4" y1="10" x2="16" y2="10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`;

      return `<li class="card ${inBasket ? "is-selected" : ""}" draggable="true" data-id="${s.id}">
        <div class="card__main">
          <a class="card__name" href="product.html?id=${encodeURIComponent(s.id)}">${s.name}</a>
          <div class="card__meta">${t().typeShort[s.type]} · ${s.region}${terStr}</div>
          <div class="card__stats">${s.facts && s.facts.esgHighlights && s.facts.esgHighlights[0] ? s.facts.esgHighlights[0] : s.description}</div>
          <div class="card__tags">${tags}</div>
        </div>
        <div class="card__scores">
          <div class="score"><span class="score__dot score__dot--sus"></span><span class="score__label">${t().sus}</span><span class="score__val">${sus}</span></div>
          <div class="score"><span class="score__dot score__dot--gen"></span><span class="score__label">${t().gen}</span><span class="score__val">${s.genderScore}</span></div>
        </div>
        <div class="card__right">
          ${radarSVG(s)}
          <button type="button" class="addbtn ${inBasket ? "is-added" : ""}" data-add="${s.id}" aria-label="${t().add}">${addIcon}</button>
        </div>
      </li>`;
    }).join("");

    $$("#cards .addbtn").forEach((b) =>
      b.addEventListener("click", (e) => { e.stopPropagation(); toggleBasket(b.dataset.add); })
    );
    // clicking the card body opens its detail page; the + button and the
    // name link handle their own clicks, and drags never fire a click.
    $$("#cards .card").forEach((card) =>
      card.addEventListener("click", (e) => {
        if (e.target.closest(".addbtn") || e.target.closest(".card__name")) return;
        location.href = "product.html?id=" + encodeURIComponent(card.dataset.id);
      })
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

    if (!items.length) {
      $("#basketTitle").textContent = t().basketEmptyTitle;
      $("#basketSub").textContent = t().basketEmptySub;
    } else {
      $("#basketTitle").textContent = t().basketTitle;
      $("#basketSub").textContent = t().basketSub;
    }

    $("#basketList").innerHTML = items.map((s) =>
      `<li class="basket-item" data-id="${s.id}">
        <span class="basket-item__swatch" style="background:${TYPE_SWATCH[s.type]}"></span>
        <span class="basket-item__name">${s.name}</span>
        <button type="button" class="basket-item__remove" data-remove="${s.id}" aria-label="${t().remove}">
          <svg viewBox="0 0 16 16" aria-hidden="true"><line x1="4" y1="4" x2="12" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="12" y1="4" x2="4" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </button>
      </li>`
    ).join("");

    $$("#basketList .basket-item__remove").forEach((b) =>
      b.addEventListener("click", () => toggleBasket(b.dataset.remove))
    );

    $("#autofill").innerHTML = `${t().autofill}<span>↓</span>`;
    renderPortfolio(items);
  }

  /* ── portfolio donut ────────────────────────────────────── */
  function renderPortfolio(items) {
    $("#portfolioTitle").textContent = t().portfolioTitle;
    const n = items.length;
    const pct = Math.min(100, Math.round((n / TARGET_SIZE) * 100));
    $("#portfolioProgress").textContent = t().portfolioProgress(pct, n);

    const counts = { ETF: 0, Stock: 0, Fund: 0 };
    items.forEach((s) => { counts[s.type] = (counts[s.type] || 0) + 1; });
    const total = n || 1;
    const seg = [
      { key: "ETF", label: t().legendEtf, val: counts.ETF, color: TYPE_SWATCH.ETF },
      { key: "Stock", label: t().legendStock, val: counts.Stock, color: TYPE_SWATCH.Stock },
      { key: "Fund", label: t().legendFund, val: counts.Fund, color: TYPE_SWATCH.Fund }
    ];

    // donut: one equal slice per holding, coloured by type so the segments
    // match the legend dots below. The filled portion = build progress; the
    // remainder stays as the faint track (denominator caps at TARGET_SIZE).
    const R = 48, C = 60, circ = 2 * Math.PI * R;
    const denom = Math.max(n, TARGET_SIZE);
    let accFrac = 0;
    const arcs = seg.filter((g) => g.val > 0).map((g) => {
      const frac = g.val / denom;
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
      <text x="${C}" y="${C + 6}" text-anchor="middle" class="donut__label">${pct}%</text>`;

    $("#portfolioLegend").innerHTML = seg.map((g) => {
      const share = n ? Math.round((g.val / total) * 100) : 0;
      return `<li class="legend-row">
        <span class="legend-row__dot" style="background:${g.color}"></span>
        <span class="legend-row__name">${g.label}</span>
        <span class="legend-row__val">${share}%</span>
      </li>`;
    }).join("");

    renderImpact(items);

    const btn = $("#checkoutBtn");
    btn.textContent = t().checkout;
    btn.disabled = n === 0;
    $("#portfolioDisclaimer").textContent = t().disclaimer;
  }

  /* ── portfolio impact (aggregate scores) ────────────────── */
  // Averages the basket's factual sustainability + gender scores onto a 0–10
  // scale. Educational aggregate only — never a buy/sell signal.
  function renderImpact(items) {
    const box = $("#portfolioImpact");
    if (!box) return;
    const n = items.length;
    if (!n) { box.innerHTML = ""; return; }

    const susAvg = items.reduce((a, s) => a + s.sustainabilityScore, 0) / n; // 0–100
    const genAvg = items.reduce((a, s) => a + GENDER_NUM[s.genderScore], 0) / n; // 0–100
    const num = (v) => (v / 10).toFixed(1).replace(".", lang === "de" ? "," : ".");

    const bar = (label, pct, val) => `
      <div class="impactbar">
        <div class="impactbar__head"><span>${label}</span><span class="impactbar__val">${val}</span></div>
        <div class="impactbar__track"><span class="impactbar__fill" style="width:${pct.toFixed(0)}%"></span></div>
      </div>`;

    box.innerHTML = `
      <p class="portfolio__impacthead">${t().impactHead}</p>
      ${bar(t().susLabel, susAvg, num(susAvg))}
      ${bar(t().genLabel, genAvg, num(genAvg))}`;
  }

  /* ── drag & drop ────────────────────────────────────────── */
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
    const opts = [
      ["impact", t().sortImpact], ["sustainability", t().sortSustainability],
      ["gender", t().sortGender], ["name", t().sortName]
    ];
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
      // Phase 1: checkout is the informational hand-off step. The basket is
      // already persisted in localStorage (pm_basket); checkout.js reads it.
      if (!basket.length) return;
      location.href = "checkout.html";
    });
  }

  /* ── full re-render on language switch ──────────────────── */
  function renderAll() { renderChrome(); renderFilters(); renderCards(); renderBasket(); }

  document.addEventListener("pm:langchange", (e) => {
    lang = (e.detail && e.detail.lang === "de") ? "de" : "en";
    renderAll();
  });

  /* ── boot ───────────────────────────────────────────────── */
  function deriveThemes() {
    const seen = new Map();
    DATA.forEach((s) => s.themes.forEach((th) => seen.set(th, (seen.get(th) || 0) + 1)));
    // keep themes that appear on 2+ products so filters are meaningful
    availableThemes = [...seen.entries()]
      .filter(([, c]) => c >= 2)
      .sort((a, b) => b[1] - a[1])
      .map(([k]) => k)
      .slice(0, 12);
  }

  function showError() {
    $("#cards").innerHTML =
      `<li class="empty">Could not load the securities dataset.<br>
      Open this page through a local web server (e.g. <code>python -m http.server</code>) or the deployed site — browsers block <code>fetch()</code> of local files.</li>`;
  }

  fetch("data/securities.json")
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((doc) => {
      DATA = (doc.securities || []).filter((s) => GENDER_NUM[s.genderScore] != null);
      // drop any basket ids no longer in the dataset
      basket = basket.filter((id) => DATA.some((s) => s.id === id));
      deriveThemes();
      wireDropZone();
      wireChrome();
      renderAll();
    })
    .catch(showError);
})();
