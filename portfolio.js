/* =============================================================
   Portemonnaie — Portfolio (S10, interim).
   Vanilla JS, no dependencies. Reads pm_session.portfolio.items,
   loads data/products.json, and renders composition by weight
   and a donut. S10 per PRD (weights,
   goals card, amount split, PDF, email) comes with tasks 15/16.

   Strings come from locales/*.json through locale.js (task 04);
   numbers are formatted with pmLocale (de-AT).
   ============================================================= */

(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const L = () => window.pmLocale;
  const S = () => window.pmSession;
  const t = (key, params) => L().t(key, params);
  const track = (name, payload) => { if (window.pmTrack) window.pmTrack.track(name, payload); };
  // CSS variables: applied through inline style so SVG resolves them
  const TYPE_SWATCH = { etf: "var(--sage-deep)", stock: "var(--forest)", bond: "var(--sage)" }; // tokens, task 03
  const TRACK_STROKE = "var(--line)";
  const TYPE_ORDER = ["etf", "stock", "bond"];

  /* ── state ──────────────────────────────────────────────── */
  let DATA = [];
  let ITEMS = []; // [{ product, weight }]

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  /* ── composition by weight ──────────────────────────────── */
  function shares() {
    const c = { etf: 0, stock: 0, bond: 0 }, n = { etf: 0, stock: 0, bond: 0 };
    ITEMS.forEach(({ product, weight }) => { c[product.type] = (c[product.type] || 0) + weight; n[product.type] = (n[product.type] || 0) + 1; });
    return { weight: c, count: n };
  }

  function renderComposition() {
    $("#compEyebrow").textContent = t("portfolio.composition");
    const { weight, count } = shares();
    $("#compList").innerHTML = TYPE_ORDER.filter((ty) => count[ty] > 0).map((ty) => `
      <li class="pf-comp__row">
        <span class="pf-comp__swatch" style="background:${TYPE_SWATCH[ty]}"></span>
        <span class="pf-comp__body">
          <span class="pf-comp__name">${esc(t("portfolio.type_label." + ty))}</span>
          <span class="pf-comp__sub">${esc(L().tn("portfolio.type_count." + ty, count[ty]))}</span>
        </span>
        <span class="pf-comp__pct">${L().fmtPercent(weight[ty], 0)}</span>
      </li>`).join("");
  }

  /* ── donut (weights sum to 100 %) ───────────────────────── */
  function renderDonut() {
    const { weight } = shares();
    const R = 92, C = 120, circ = 2 * Math.PI * R;
    let acc = 0;
    const arcs = TYPE_ORDER.filter((ty) => weight[ty] > 0).map((ty) => {
      const frac = weight[ty] / 100;
      const len = frac * circ;
      const rot = -90 + acc * 360;
      acc += frac;
      return `<circle cx="${C}" cy="${C}" r="${R}" fill="none" style="stroke:${TYPE_SWATCH[ty]}" stroke-width="26"
        stroke-dasharray="${len.toFixed(1)} ${(circ - len).toFixed(1)}"
        transform="rotate(${rot.toFixed(2)} ${C} ${C})"/>`;
    }).join("");
    $("#pfDonut").innerHTML = `
      <circle cx="${C}" cy="${C}" r="${R}" fill="none" style="stroke:${TRACK_STROKE}" stroke-width="26"/>
      ${arcs}
      <text x="${C}" y="${C - 4}" text-anchor="middle" class="pf-donut__pct">${L().fmtPercent(100, 0)}</text>
      <text x="${C}" y="${C + 30}" text-anchor="middle" class="pf-donut__word">${esc(t("portfolio.invested"))}</text>`;
  }

  /* ── empty state ────────────────────────────────────────── */
  function renderEmpty() {
    $("#pfStage").innerHTML = `
      <div class="pf-empty">
        <p class="pf-empty__title">${esc(t("portfolio.empty.title"))}</p>
        <p class="pf-empty__sub">${esc(t("portfolio.empty.sub"))}</p>
        <a class="btn btn--primary pf-empty__cta" href="explore.html">${esc(t("portfolio.empty.cta"))}</a>
      </div>`;
  }

  /* ── full render ────────────────────────────────────────── */
  function renderAll() {
    $("#pfEyebrow").textContent = t("portfolio.eyebrow");
    $("#pfTitle").innerHTML = t("portfolio.title");
    $("#pfSub").textContent = t("portfolio.sub");
    $("#pfDisclaimer").textContent = t("common.disclaimer");

    if (!ITEMS.length) { renderEmpty(); return; }

    $("#noteStrong").textContent = t("portfolio.note_strong");
    $("#noteSoft").textContent = t("portfolio.note_soft");
    renderComposition();
    renderDonut();
  }

  document.addEventListener("pm:localeready", () => { if (DATA.length) renderAll(); });

  /* ── boot ───────────────────────────────────────────────── */
  if (!window.pmLocale || !window.pmSession) return;
  if (!S().current()) { S().create({ locale: L().lang() }); track("session_start"); }
  S().setScreen("/portfolio");
  track("screen_view", { screen: "/portfolio" });

  Promise.all([
    fetch("data/products.json").then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); }).catch(() => ({ products: [] })),
    window.pmLocale.ready
  ]).then(([doc]) => {
    DATA = doc.products || [];
    const s = S().current();
    const list = (s && s.portfolio && s.portfolio.items) ? s.portfolio.items : [];
    ITEMS = list.map((it) => ({ product: DATA.find((x) => x.id === it.productId), weight: it.weight })).filter((x) => x.product);
    renderAll();
  });
})();
