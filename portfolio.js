/* =============================================================
   Portemonnaie — Portfolio review (Step "Portfolio").
   Vanilla JS, no dependencies. The full-page review that sits
   between Explore (basket building) and Checkout (Execute).

   Reads the basket from localStorage ("pm_basket"), loads
   data/securities.json, and renders:
     · composition (share by type, with counts)
     · a big donut — the whole basket = 100% invested
     · "Your impact" — aggregate Sustainability, Gender and
       Environmental scores (factual aggregates, educational
       only — never a buy/sell signal)

   Impact note: the licensed carbon feed is not wired yet, so the
   third metric uses the Environmental pillar of the Four Capitals
   (a real field) rather than a fabricated CO2-vs-benchmark figure.

   Mirrors explore.js / product.js conventions: self-contained
   EN/DE copy reacting to the shared "pm:langchange" event.
   ============================================================= */

(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);

  const STORE_KEY = "pm_basket"; // same key Explore writes to

  /* ── copy (EN / DE) ─────────────────────────────────────── */
  const T = {
    en: {
      eyebrow: "Your portfolio is ready",
      title: 'Your <em class="serif">Portfolio</em>.',
      sub: "Fully built. Ready when you are.",
      compEyebrow: "Composition",
      impactEyebrow: "Your impact",
      invested: "invested",
      noteStrong: "You decide.",
      noteSoft: "We guide you.",
      checkout: "Checkout",
      disclaimer: "This is not investment advice. Content is for educational purposes only.",
      emptyTitle: "Your basket is empty.",
      emptySub: "Build your portfolio in Explore first.",
      emptyCta: "Go to Explore",
      typeLabel: { ETF: "ETFs", Stock: "Stocks", Fund: "Funds" },
      typeSub: {
        ETF: (n) => `${n} ${n === 1 ? "ETF" : "ETFs"}`,
        Stock: (n) => `${n} ${n === 1 ? "single stock" : "single stocks"}`,
        Fund: (n) => `${n} ${n === 1 ? "fund" : "funds"}`
      },
      susLabel: "Sustainability score",
      genLabel: "Gender score",
      envLabel: "Environmental score",
      steps: ["Quiz", "Type", "Explore", "Portfolio", "Checkout"]
    },
    de: {
      eyebrow: "Dein Portfolio ist bereit",
      title: 'Dein <em class="serif">Portfolio</em>.',
      sub: "Vollständig aufgebaut. Bereit, wenn du es bist.",
      compEyebrow: "Zusammensetzung",
      impactEyebrow: "Deine Wirkung",
      invested: "investiert",
      noteStrong: "Du entscheidest.",
      noteSoft: "Wir begleiten.",
      checkout: "Checkout",
      disclaimer: "Dies ist keine Anlageberatung. Die Inhalte dienen ausschließlich Bildungszwecken.",
      emptyTitle: "Dein Basket ist leer.",
      emptySub: "Bau zuerst dein Portfolio in Entdecken auf.",
      emptyCta: "Zu Entdecken",
      typeLabel: { ETF: "ETFs", Stock: "Aktien", Fund: "Fonds" },
      typeSub: {
        ETF: (n) => `${n} ${n === 1 ? "ETF" : "ETFs"}`,
        Stock: (n) => `${n} ${n === 1 ? "Einzeltitel" : "Einzeltitel"}`,
        Fund: (n) => `${n} Fonds`
      },
      susLabel: "Nachhaltigkeits-Score",
      genLabel: "Gender-Score",
      envLabel: "Umwelt-Score",
      steps: ["Quiz", "Typ", "Entdecken", "Portfolio", "Checkout"]
    }
  };

  const GENDER_NUM = { "A+": 100, A: 90, B: 78, C: 64, D: 50, E: 35, F: 15 };
  // Type colours (hex, not CSS vars — these feed SVG stroke presentation
  // attributes, which do not resolve var()). Stock = --forest so "Aktien"
  // reads as the darkest slice on the light page, matching the mockup.
  const TYPE_SWATCH = { ETF: "#4E8C6A", Stock: "#1F3A2E", Fund: "#A8D5BA" };
  const TRACK_STROKE = "rgba(26,46,36,0.10)"; // = --line, as a literal for SVG
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
  const num = (v) => (v / 10).toFixed(1).replace(".", lang === "de" ? "," : ".");

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

  /* ── donut (whole basket = 100% invested) ───────────────── */
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

  /* ── impact / ESG (aggregate, educational only) ─────────── */
  function renderImpact() {
    $("#impactEyebrow").textContent = t().impactEyebrow;
    const n = ITEMS.length || 1;
    const susAvg = ITEMS.reduce((a, s) => a + s.sustainabilityScore, 0) / n;
    const genAvg = ITEMS.reduce((a, s) => a + GENDER_NUM[s.genderScore], 0) / n;
    const envAvg = ITEMS.reduce((a, s) => a + (s.fourCapitals ? s.fourCapitals.environmental : 0), 0) / n;

    const bar = (label, pct, val) => `
      <div class="pf-bar">
        <div class="pf-bar__head"><span>${esc(label)}</span><span class="pf-bar__val">${val}</span></div>
        <div class="pf-bar__track"><span class="pf-bar__fill" style="width:${pct.toFixed(0)}%"></span></div>
      </div>`;

    $("#impactList").innerHTML =
      bar(t().susLabel, susAvg, num(susAvg)) +
      bar(t().genLabel, genAvg, num(genAvg)) +
      bar(t().envLabel, envAvg, num(envAvg));
  }

  /* ── flow steps ─────────────────────────────────────────── */
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
    const btn = $("#pfCheckout");
    btn.textContent = t().checkout;

    renderComposition();
    renderDonut();
    renderImpact();
  }

  document.addEventListener("pm:langchange", (e) => {
    lang = (e.detail && e.detail.lang === "de") ? "de" : "en";
    renderAll();
  });

  /* ── boot ───────────────────────────────────────────────── */
  // wire the checkout button once (survives re-renders — it is not
  // replaced unless the basket is empty)
  document.addEventListener("click", (e) => {
    if (e.target.closest && e.target.closest("#pfCheckout")) {
      location.href = "checkout.html";
    }
  });

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
