/* =============================================================
   Portemonnaie — Product detail page (kept for now, decision
   10.09.2026 on conflict 17). Reads ?id=<security-id> from the
   URL, loads data/securities.json and renders identity, key
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

  const TYPE_SWATCH = { ETF: "var(--sage-deep)", Stock: "var(--forest)", Fund: "var(--sage)" }; // tokens, task 03

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

    add(t("product.facts.isin"), SEC.isin);
    add(t("product.facts.type"), t("explore.type." + SEC.type));
    add(t("product.facts.region"), SEC.region);
    add(t("product.facts.currency"), SEC.currency);
    if (SEC.ter != null) add(t("product.facts.ter"), L().fmtPercent(SEC.ter));
    add(t("product.facts.aum"), p.aum);
    if (p.distribution) {
      const key = "product.distribution." + p.distribution;
      add(t("product.facts.distribution"), L().has(key) ? t(key) : p.distribution);
    }
    add(t("product.facts.inception"), p.inception);
    add(t("product.facts.as_of"), SEC.asOf);

    return rows.map(([l, v]) =>
      `<div class="critrow"><span class="critrow__k">${esc(l)}</span><span class="critrow__v">${esc(v)}</span></div>`).join("");
  }

  function relatedCards() {
    const related = DATA.filter((s) =>
      s.id !== SEC.id && (s.themes || []).some((th) => (SEC.themes || []).includes(th))).slice(0, 3);
    if (!related.length) return "";
    return `<section class="pcard">
      <h2 class="pcard__title">${t("product.related_title")}</h2>
      <div class="related">${related.map((s) => `
        <a class="relcard" href="product.html?id=${encodeURIComponent(s.id)}">
          <span class="relcard__swatch" style="background:${TYPE_SWATCH[s.type] || TYPE_SWATCH.Fund}"></span>
          <span class="relcard__name">${esc(s.name)}</span>
          <span class="relcard__meta">${t("explore.type." + s.type)} · ${esc(s.region)}</span>
        </a>`).join("")}</div>
    </section>`;
  }

  /* ── full render ────────────────────────────────────────── */
  function render() {
    const holdings = (SEC.profile && SEC.profile.topHoldings && SEC.profile.topHoldings.length)
      ? `<section class="pcard">
           <h2 class="pcard__title">${t("product.holdings_title")}</h2>
           <div class="holdings">${SEC.profile.topHoldings.map((h) => `<span class="tag">${esc(h)}</span>`).join("")}</div>
         </section>`
      : "";

    $("#product").innerHTML = `
      <a class="product__back" href="explore.html">← ${t("product.back")}</a>

      <header class="product__head">
        <div class="product__id">
          <span class="product__type">${t("explore.type." + SEC.type)}</span>
          <h1 class="product__name">${esc(SEC.name)}</h1>
          <p class="product__meta">${[SEC.isin, SEC.region].filter(Boolean).map(esc).join(" · ")}</p>
          <p class="product__desc">${esc(SEC.description || "")}</p>
        </div>
      </header>

      <div class="product__grid">
        <section class="pcard">
          <h2 class="pcard__title">${t("product.facts_title")}</h2>
          <div class="critlist">${critRows()}</div>
        </section>
        ${holdings}
      </div>

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
    fetch("data/securities.json").then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); }),
    window.pmLocale.ready
  ])
    .then(([doc]) => {
      DATA = doc.securities || [];
      SEC = DATA.find((s) => s.id === ID) || null;
      if (!SEC) { renderError(t("product.not_found"), t("product.not_found_sub")); return; }
      document.title = `${SEC.name} — Portemonnaie`;
      render();
    })
    .catch(() => renderError(t("product.not_found"), t("product.load_error")));
})();
