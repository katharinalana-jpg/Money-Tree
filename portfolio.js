/* =============================================================
   Portemonnaie — Portfolio (S10, interim).
   Vanilla JS, no dependencies. Reads the basket from
   localStorage ("pm_basket"), loads data/securities.json, and
   renders composition by type and a donut. S10 per PRD (weights,
   goals card, amount split, PDF, email) comes with tasks 15/16.

   Strings come from locales/*.json through locale.js (task 04);
   numbers are formatted with pmLocale (de-AT).
   ============================================================= */

(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const L = () => window.pmLocale;
  const t = (key, params) => L().t(key, params);

  const STORE_KEY = "pm_basket";
  // CSS variables: applied through inline style so SVG resolves them
  const TYPE_SWATCH = { ETF: "var(--sage-deep)", Stock: "var(--forest)", Fund: "var(--sage)" }; // tokens, task 03
  const TRACK_STROKE = "var(--line)";
  const TYPE_ORDER = ["ETF", "Stock", "Fund"];

  /* ── state ──────────────────────────────────────────────── */
  let DATA = [];
  let ITEMS = [];

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
    $("#compEyebrow").textContent = t("portfolio.composition");
    const c = counts();
    const total = ITEMS.length || 1;
    $("#compList").innerHTML = TYPE_ORDER.filter((ty) => c[ty] > 0).map((ty) => {
      const share = Math.round((c[ty] / total) * 100);
      return `<li class="pf-comp__row">
        <span class="pf-comp__swatch" style="background:${TYPE_SWATCH[ty]}"></span>
        <span class="pf-comp__body">
          <span class="pf-comp__name">${esc(t("portfolio.type_label." + ty))}</span>
          <span class="pf-comp__sub">${esc(L().tn("portfolio.type_count." + ty, c[ty]))}</span>
        </span>
        <span class="pf-comp__pct">${L().fmtPercent(share, 0)}</span>
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

  /* ── flow steps (interim; PRD 5.1 ProgressBar in task 06) ─ */
  function renderSteps() {
    const steps = ["quiz", "summary", "explore", "portfolio"].map((k) => t("common.stages." + k));
    $("#flowsteps").innerHTML = steps.map((name, i) => {
      const cls = i < 3 ? "is-done" : (i === 3 ? "is-active" : "");
      return `<div class="flowstep ${cls}">
        <span class="flowstep__dot"></span><span class="flowstep__name">${esc(name)}</span>
        ${i < steps.length - 1 ? '<span class="flowstep__line"></span>' : ""}
      </div>`;
    }).join("");
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
    renderSteps();

    if (!ITEMS.length) { renderEmpty(); return; }

    $("#noteStrong").textContent = t("portfolio.note_strong");
    $("#noteSoft").textContent = t("portfolio.note_soft");
    renderComposition();
    renderDonut();
  }

  document.addEventListener("pm:localeready", () => { if (DATA.length) renderAll(); });

  /* ── boot ───────────────────────────────────────────────── */
  if (!window.pmLocale) return;
  Promise.all([
    fetch("data/securities.json").then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); }).catch(() => ({ securities: [] })),
    window.pmLocale.ready
  ]).then(([doc]) => {
    DATA = doc.securities || [];
    const basket = loadBasket().filter((id) => DATA.some((s) => s.id === id));
    ITEMS = basket.map((id) => DATA.find((s) => s.id === id)).filter(Boolean);
    renderAll();
  });
})();
