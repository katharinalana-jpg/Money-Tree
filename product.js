/* =============================================================
   Portemonnaie — Product detail page (kept for now, decision
   10.09.2026 on conflict 17). Reads ?id=<security-id> from the
   URL, loads data/products.json and renders identity, key
   facts from public documents, top holdings and related products.

   Strings come from locales/*.json through locale.js (task 04);
   numbers are formatted with pmLocale (de-AT). No prices, no own
   scores (PRD 7.7); provider scores arrive with products.json.
   ============================================================= */

(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const L = () => window.pmLocale;
  const t = (key, params) => L().t(key, params);
  const query = new URLSearchParams(location.search);
  const ID = query.get("id");

  const TYPE_SWATCH = { etf: "var(--sage-deep)", stock: "var(--forest)", bond: "var(--sage)" }; // tokens, task 03

  /* ── state ──────────────────────────────────────────────── */
  let DATA = [];
  let SEC = null;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  /* ── key facts rows (public issuer documents only) ──────── */
  function critRows() {
    const p = SEC.profile || {};
    const rows = [];
    const add = (label, val) => { if (val != null && val !== "") rows.push([label, val]); };

    const na = t("product.na");
    add(t("product.facts.isin"), SEC.isin || na);
    add(t("product.facts.type"), t("explore.type." + SEC.type));
    add(t("product.facts.provider"), SEC.provider || na);
    add(t("product.facts.region"), SEC.region);
    add(t("product.facts.currency"), SEC.currency);
    if (SEC.type !== "stock") {
      add(t("product.facts.ter"), SEC.ter != null ? L().fmtPercent(SEC.ter * 100) : na);
      add(t("product.facts.sri"), SEC.sri != null ? L().fmtNumber(SEC.sri) : na); // from the KID, never own (PRD 7.7)
      add(t("product.facts.fund_size"), SEC.fundSizeMeur != null
        ? t("product.fund_size_value", { n: L().fmtNumber(SEC.fundSizeMeur), currency: SEC.fundSizeCurrency || "" }).trim() : na);
      add(t("product.facts.holdings"), SEC.holdingsCount != null ? L().fmtNumber(SEC.holdingsCount) : na);
      if (SEC.distribution) {
        const key = "product.distribution." + SEC.distribution;
        add(t("product.facts.distribution"), L().has(key) ? t(key) : SEC.distribution);
      }
      add(t("product.facts.inception"), SEC.inceptionDate || na);
    }
    add(t("product.facts.as_of"), SEC.asOf || na);

    return rows.map(([l, v]) =>
      `<div class="critrow"><span class="critrow__k">${esc(l)}</span><span class="critrow__v">${esc(v)}</span></div>`).join("");
  }

  /* Provider scores (PRD 7.7): always with provider and asOf; a missing
     score is stated, never estimated. */
  function scoreRow(labelKey, score) {
    const label = esc(t(labelKey));
    if (!score || typeof score.value !== "number") {
      return `<div class="critrow"><span class="critrow__k">${label}</span><span class="critrow__v">${esc(t("product.score_missing"))}</span></div>`;
    }
    const val = L().fmtNumber(score.value, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " / 10";
    const src = esc(t("product.score_source", { source: score.source, asOf: score.asOf }));
    return `<div class="critrow"><span class="critrow__k">${label}<br><small>${src}</small></span><span class="critrow__v">${esc(val)}</span></div>`;
  }
  function scoresBlock() {
    const s = SEC.scores || {};
    return `<section class="pcard">
      <h2 class="pcard__title">${t("product.scores_title")}</h2>
      <div class="critlist">${scoreRow("product.score_sustainability", s.sustainability)}${scoreRow("product.score_gender", s.gender)}</div>
    </section>`;
  }

  function relatedCards() {
    const related = DATA.filter((s) =>
      s.id !== SEC.id && (s.sdgTags || []).some((id) => (SEC.sdgTags || []).includes(id))).slice(0, 3);
    if (!related.length) return "";
    return `<section class="pcard">
      <h2 class="pcard__title">${t("product.related_title")}</h2>
      <div class="related">${related.map((s) => `
        <a class="relcard" href="product.html?id=${encodeURIComponent(s.id)}">
          <span class="relcard__swatch" style="background:${TYPE_SWATCH[s.type] || TYPE_SWATCH.bond}"></span>
          <span class="relcard__name">${esc(s.name)}</span>
          <span class="relcard__meta">${t("explore.type." + s.type)} · ${esc(s.region)}</span>
        </a>`).join("")}</div>
    </section>`;
  }

  /* ── full render ────────────────────────────────────────── */
  function render() {
    const holdings = (SEC.topHoldings && SEC.topHoldings.length)
      ? `<section class="pcard">
           <h2 class="pcard__title">${t("product.holdings_title")}</h2>
           <div class="holdings">${SEC.topHoldings.map((h) => `<span class="tag">${esc(h)}</span>`).join("")}</div>
         </section>`
      : "";

    $("#product").innerHTML = `
      <a class="product__back" href="explore.html">← ${t("product.back")}</a>

      <header class="product__head">
        <div class="product__id">
          <span class="product__type">${t("explore.type." + SEC.type)}</span>
          <h1 class="product__name">${esc(SEC.name)}</h1>
          <p class="product__meta">${[SEC.isin, SEC.region].filter(Boolean).map(esc).join(" · ")}</p>
          <p class="product__desc">${esc(SEC.description_de || "")}</p>
        </div>
      </header>

      <div class="product__grid">
        <section class="pcard">
          <h2 class="pcard__title">${t("product.facts_title")}</h2>
          <div class="critlist">${critRows()}</div>
        </section>
        ${scoresBlock()}
      </div>
      ${holdings}

      ${relatedCards()}

      <p class="product__disclaimer">${t("common.disclaimer")}</p>`;
  }

  function renderError(title, sub) {
    $("#product").innerHTML = `<div class="product__error">
      <a class="product__back" href="explore.html">← ${t("product.back")}</a>
      <h1 class="product__name">${esc(title)}</h1>
      <p class="product__desc">${esc(sub)}</p>
    </div>`;
  }

  /* ── language switch ────────────────────────────────────── */
  document.addEventListener("pm:localeready", () => { if (SEC) render(); });

  /* ── boot ───────────────────────────────────────────────── */
  if (!window.pmLocale) return;
  Promise.all([
    fetch("data/products.json").then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); }),
    window.pmLocale.ready
  ])
    .then(([doc]) => {
      DATA = doc.products || [];
      SEC = DATA.find((s) => s.id === ID) || null;
      if (!SEC) { renderError(t("product.not_found"), t("product.not_found_sub")); return; }
      document.title = `${SEC.name} — Portemonnaie`;
      render();
    })
    .catch(() => renderError(t("product.not_found"), t("product.load_error")));
})();
