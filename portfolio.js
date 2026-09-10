/* =============================================================
   Portemonnaie — Portfolio (S10, interim after task 02).
   Vanilla JS, no dependencies. Reads the basket from
   localStorage ("pm_basket"), loads data/securities.json, and
   renders composition by type and a donut. S10 per PRD (weights,
   goals card, amount split, PDF, email) comes with tasks 15/16.

   Removed with task 02: archetype badge, own-score averages,
   the Checkout hand-off (S11 is out of scope, decision 10.09.2026).
   ============================================================= */

(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);

  const STORE_KEY = "pm_basket";

  /* ── copy (EN / DE) ─────────────────────────────────────── */
  const T = {
    en: {
      eyebrow: "Your portfolio",
      title: 'Your <em class="serif">Portfolio</em>.',
      sub: "Here is what you built. You decide, we guide.",
      compEyebrow: "Composition",
      invested: "of your portfolio",
      noteStrong: "You decide.",
      noteSoft: "We guide you.",
      disclaimer: "The information does not constitute investment advice, any other recommendation, or an offer to buy securities or to make specific investments.",
      emptyTitle: "Your portfolio is empty.",
      emptySub: "Build it in the Explorer first.",
      emptyCta: "Go to the Explorer",
      typeLabel: { ETF: "ETFs", Stock: "Stocks", Fund: "Funds" },
      typeSub: {
        ETF: (n) => `${n} ${n === 1 ? "ETF" : "ETFs"}`,
        Stock: (n) => `${n} ${n === 1 ? "single stock" : "single stocks"}`,
        Fund: (n) => `${n} ${n === 1 ? "fund" : "funds"}`
      },
      steps: ["Quiz", "Summary", "Explorer", "Portfolio"]
    },
    de: {
      eyebrow: "Dein Portfolio",
      title: 'Dein <em class="serif">Portfolio</em>.',
      sub: "Das hast du gebaut. Du entscheidest, wir begleiten.",
      compEyebrow: "Zusammensetzung",
      invested: "deines Portfolios",
      noteStrong: "Du entscheidest.",
      noteSoft: "Wir begleiten.",
      disclaimer: "Die Informationen stellen keine Anlageberatung, keine sonstige Empfehlung und kein Angebot zum Kauf von Wertpapieren oder zur Vornahme bestimmter Investitionen dar.",
      emptyTitle: "Dein Portfolio ist leer.",
      emptySub: "Bau es zuerst im Explorer auf.",
      emptyCta: "Zum Explorer",
      typeLabel: { ETF: "ETFs", Stock: "Aktien", Fund: "Fonds" },
      typeSub: {
        ETF: (n) => `${n} ${n === 1 ? "ETF" : "ETFs"}`,
        Stock: (n) => `${n} Einzeltitel`,
        Fund: (n) => `${n} Fonds`
      },
      steps: ["Quiz", "Zusammenfassung", "Explorer", "Portfolio"]
    }
  };

  // hex, not CSS vars: these feed SVG presentation attributes
  const TYPE_SWATCH = { ETF: "#4E8C6A", Stock: "#1F3A2E", Fund: "#A8D5BA" };
  const TRACK_STROKE = "rgba(26,46,36,0.10)";
  const TYPE_ORDER = ["ETF", "Stock", "Fund"];

  /* ── state ──────────────────────────────────────────────── */
  let DATA = [];
  let ITEMS = [];
  let lang = (document.documentElement.lang === "de" ||
              localStorage.getItem("pm_lang") === "de") ? "de" : "en";

  function t() { return T[lang]; }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function loadBasket() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
    catch (e) { return []; }
  }

  /* ── composition ────────────────────────────────────────── */
  function counts() {
    const c = { ETF: 0, Stock: 0, Fund: 0 };
    ITEMS.forEach((s) => { c[s.type] = (c[s.type] || 0) + 1; });
    return c;
  }

  function renderComposition() {
    $("#compEyebrow").textContent = t().compEyebrow;
    const c = counts();
    const total = ITEMS.length || 1;
    $("#compList").innerHTML = TYPE_ORDER.filter((ty) => c[ty] > 0).map((ty) => {
      const share = Math.round((c[ty] / total) * 100);
      return `<li class="pf-comp__row">
        <span class="pf-comp__swatch" style="background:${TYPE_SWATCH[ty]}"></span>
        <span class="pf-comp__body">
          <span class="pf-comp__name">${esc(t().typeLabel[ty])}</span>
          <span class="pf-comp__sub">${esc(t().typeSub[ty](c[ty]))}</span>
        </span>
        <span class="pf-comp__pct">${share}%</span>
      </li>`;
    }).join("");
  }

  /* ── donut (whole basket = 100 %) ───────────────────────── */
  function renderDonut() {
    const c = counts();
    const total = ITEMS.length || 1;
    const R = 92, C = 120, circ = 2 * Math.PI * R;
    let acc = 0;
    const arcs = TYPE_ORDER.filter((ty) => c[ty] > 0).map((ty) => {
      const frac = c[ty] / total;
      const len = frac * circ;
      const rot = -90 + acc * 360;
      acc += frac;
      return `<circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="${TYPE_SWATCH[ty]}" stroke-width="26"
        stroke-dasharray="${len.toFixed(1)} ${(circ - len).toFixed(1)}"
        transform="rotate(${rot.toFixed(2)} ${C} ${C})"/>`;
    }).join("");
    $("#pfDonut").innerHTML = `
      <circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="${TRACK_STROKE}" stroke-width="26"/>
      ${arcs}
      <text x="${C}" y="${C - 4}" text-anchor="middle" class="pf-donut__pct">100%</text>
      <text x="${C}" y="${C + 30}" text-anchor="middle" class="pf-donut__word">${esc(t().invested)}</text>`;
  }

  /* ── flow steps (interim; PRD 5.1 ProgressBar in task 06) ─ */
  function renderSteps() {
    $("#flowsteps").innerHTML = t().steps.map((name, i) => {
      const cls = i < 3 ? "is-done" : (i === 3 ? "is-active" : "");
      return `<div class="flowstep ${cls}">
        <span class="flowstep__dot"></span><span class="flowstep__name">${esc(name)}</span>
        ${i < t().steps.length - 1 ? '<span class="flowstep__line"></span>' : ""}
      </div>`;
    }).join("");
  }

  /* ── empty state ────────────────────────────────────────── */
  function renderEmpty() {
    $("#pfStage").innerHTML = `
      <div class="pf-empty">
        <p class="pf-empty__title">${esc(t().emptyTitle)}</p>
        <p class="pf-empty__sub">${esc(t().emptySub)}</p>
        <a class="btn btn--primary pf-empty__cta" href="explore.html">${esc(t().emptyCta)}</a>
      </div>`;
  }

  /* ── full render ────────────────────────────────────────── */
  function renderAll() {
    $("#pfEyebrow").textContent = t().eyebrow;
    $("#pfTitle").innerHTML = t().title;
    $("#pfSub").textContent = t().sub;
    $("#pfDisclaimer").textContent = t().disclaimer;
    renderSteps();

    if (!ITEMS.length) { renderEmpty(); return; }

    $("#noteStrong").textContent = t().noteStrong;
    $("#noteSoft").textContent = t().noteSoft;
    renderComposition();
    renderDonut();
  }

  document.addEventListener("pm:langchange", (e) => {
    lang = (e.detail && e.detail.lang === "de") ? "de" : "en";
    renderAll();
  });

  /* ── boot ───────────────────────────────────────────────── */
  fetch("data/securities.json")
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((doc) => {
      DATA = doc.securities || [];
      const basket = loadBasket().filter((id) => DATA.some((s) => s.id === id));
      ITEMS = basket.map((id) => DATA.find((s) => s.id === id)).filter(Boolean);
      renderAll();
    })
    .catch(() => { ITEMS = []; renderAll(); });
})();
