/* =============================================================
   Portemonnaie — Product detail page (kept for now, decision
   10.09.2026 on conflict 17). Reads ?id=<security-id> from the
   URL, loads data/securities.json and renders identity, key
   facts from public documents, top holdings and related products.

   Removed with task 02 (PRD 7.7): price chart and price data,
   Four Capitals, own gender / sustainability / impact scores,
   gender and ESG "facts". Provider scores with source and asOf
   arrive with products.json (task 05).
   ============================================================= */

(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const params = new URLSearchParams(location.search);
  const ID = params.get("id");

  /* ── copy (EN / DE) ─────────────────────────────────────── */
  const T = {
    en: {
      back: "Back to the Explorer",
      criteriaTitle: "Key facts",
      crit: {
        isin: "ISIN", type: "Type", ter: "Ongoing charges (TER)", aum: "Fund size (AUM)",
        distribution: "Use of income", inception: "Inception", region: "Region", currency: "Currency", asOf: "As of"
      },
      holdingsTitle: "Top holdings",
      relatedTitle: "More in this theme",
      disclaimer: "The information does not constitute investment advice, any other recommendation, or an offer to buy securities or to make specific investments.",
      notFound: "Product not found.",
      notFoundSub: "We could not find a security with that id. Head back to the Explorer to browse the list.",
      loadError: "Could not load the securities dataset. Open this page through a local web server or the deployed site.",
      distribution: { "Accumulating": "Accumulating", "Distributing": "Distributing" },
      na: "n/a"
    },
    de: {
      back: "Zurück zum Explorer",
      criteriaTitle: "Kennzahlen",
      crit: {
        isin: "ISIN", type: "Typ", ter: "Laufende Kosten (TER)", aum: "Fondsvolumen (AUM)",
        distribution: "Ertragsverwendung", inception: "Auflage", region: "Region", currency: "Währung", asOf: "Stand"
      },
      holdingsTitle: "Größte Positionen",
      relatedTitle: "Mehr aus diesem Thema",
      disclaimer: "Die Informationen stellen keine Anlageberatung, keine sonstige Empfehlung und kein Angebot zum Kauf von Wertpapieren oder zur Vornahme bestimmter Investitionen dar.",
      notFound: "Produkt nicht gefunden.",
      notFoundSub: "Wir konnten kein Wertpapier mit dieser ID finden. Geh zurück zum Explorer, um die Liste zu durchstöbern.",
      loadError: "Der Wertpapier-Datensatz konnte nicht geladen werden. Öffne diese Seite über einen lokalen Webserver oder die veröffentlichte Seite.",
      distribution: { "Accumulating": "Thesaurierend", "Distributing": "Ausschüttend" },
      na: "k. A."
    }
  };

  const TYPE_SWATCH = { ETF: "var(--sage-deep)", Stock: "var(--forest)", Fund: "var(--sage)" }; // tokens, task 03

  /* ── state ──────────────────────────────────────────────── */
  let DATA = [];
  let SEC = null;
  let lang = (document.documentElement.lang === "de" ||
              localStorage.getItem("pm_lang") === "de") ? "de" : "en";

  function t() { return T[lang]; }
  const dec = () => (lang === "de" ? "," : ".");
  function fmt(n, d = 2) {
    if (n == null) return t().na;
    return Number(n).toFixed(d).replace(".", dec());
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  /* ── key facts rows (public issuer documents only) ──────── */
  function critRows() {
    const p = SEC.profile || {};
    const rows = [];
    const add = (label, val) => { if (val != null && val !== "") rows.push([label, val]); };

    add(t().crit.isin, SEC.isin);
    add(t().crit.type, SEC.type);
    add(t().crit.region, SEC.region);
    add(t().crit.currency, SEC.currency);
    if (SEC.ter != null) add(t().crit.ter, fmt(SEC.ter) + "%");
    add(t().crit.aum, p.aum);
    if (p.distribution) add(t().crit.distribution, t().distribution[p.distribution] || p.distribution);
    add(t().crit.inception, p.inception);
    add(t().crit.asOf, SEC.asOf);

    return rows.map(([l, v]) =>
      `<div class="critrow"><span class="critrow__k">${esc(l)}</span><span class="critrow__v">${esc(v)}</span></div>`).join("");
  }

  function relatedCards() {
    const related = DATA.filter((s) =>
      s.id !== SEC.id && (s.themes || []).some((th) => (SEC.themes || []).includes(th))).slice(0, 3);
    if (!related.length) return "";
    return `<section class="pcard">
      <h2 class="pcard__title">${t().relatedTitle}</h2>
      <div class="related">${related.map((s) => `
        <a class="relcard" href="product.html?id=${encodeURIComponent(s.id)}">
          <span class="relcard__swatch" style="background:${TYPE_SWATCH[s.type] || TYPE_SWATCH.Fund}"></span>
          <span class="relcard__name">${esc(s.name)}</span>
          <span class="relcard__meta">${esc(s.type)} · ${esc(s.region)}</span>
        </a>`).join("")}</div>
    </section>`;
  }

  /* ── full render ────────────────────────────────────────── */
  function render() {
    const holdings = (SEC.profile && SEC.profile.topHoldings && SEC.profile.topHoldings.length)
      ? `<section class="pcard">
           <h2 class="pcard__title">${t().holdingsTitle}</h2>
           <div class="holdings">${SEC.profile.topHoldings.map((h) => `<span class="tag">${esc(h)}</span>`).join("")}</div>
         </section>`
      : "";

    $("#product").innerHTML = `
      <a class="product__back" href="explore.html">← ${t().back}</a>

      <header class="product__head">
        <div class="product__id">
          <span class="product__type">${esc(SEC.type)}</span>
          <h1 class="product__name">${esc(SEC.name)}</h1>
          <p class="product__meta">${[SEC.isin, SEC.region].filter(Boolean).map(esc).join(" · ")}</p>
          <p class="product__desc">${esc(SEC.description || "")}</p>
        </div>
      </header>

      <div class="product__grid">
        <section class="pcard">
          <h2 class="pcard__title">${t().criteriaTitle}</h2>
          <div class="critlist">${critRows()}</div>
        </section>
        ${holdings}
      </div>

      ${relatedCards()}

      <p class="product__disclaimer">${t().disclaimer}</p>`;
  }

  function renderError(title, sub) {
    $("#product").innerHTML = `<div class="product__error">
      <a class="product__back" href="explore.html">← ${t().back}</a>
      <h1 class="product__name">${esc(title)}</h1>
      <p class="product__desc">${esc(sub)}</p>
    </div>`;
  }

  /* ── language switch ────────────────────────────────────── */
  document.addEventListener("pm:langchange", (e) => {
    lang = (e.detail && e.detail.lang === "de") ? "de" : "en";
    if (SEC) render();
  });

  /* ── boot ───────────────────────────────────────────────── */
  fetch("data/securities.json")
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((doc) => {
      DATA = doc.securities || [];
      SEC = DATA.find((s) => s.id === ID) || null;
      if (!SEC) { renderError(t().notFound, t().notFoundSub); return; }
      document.title = `${SEC.name} — Portemonnaie`;
      render();
    })
    .catch(() => renderError(t().notFound, t().loadError));
})();
