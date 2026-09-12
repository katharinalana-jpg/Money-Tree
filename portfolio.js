/* =============================================================
   Portemonnaie — S10 Dein Portfolio & Plan sichern (/portfolio,
   PRD S10, screen only; PDF and e-mail come with task 16).

   Renders from pm_session.portfolio.items and data/products.json:
   composition with weight and monthly amount (derive.splitAmount:
   whole euros, remainder to the largest item), donut, goals card
   (weighted provider scores with source and asOf or "Keine
   Einstufung vorhanden", SDG coverage), amount field prefilled from
   the S4 range (decision on conflict 7: range edges), InfoNote
   "Du entscheidest. Wir begleiten." S11 is out of scope, so the
   flow ends here.
   ============================================================= */
(function () {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const L = () => window.pmLocale;
  const S = () => window.pmSession;
  const D = () => window.pmDerive;
  const t = (key, params) => L().t(key, params);
  const track = (name, payload) => { if (window.pmTrack) window.pmTrack.track(name, payload); };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const TYPE_SWATCH = { etf: "var(--sage-deep)", stock: "var(--forest)", bond: "var(--sage)" };
  const TYPES = ["etf", "stock", "bond"];

  let DATA = [];
  let ITEMS = [];   // session items with product
  let SDGS = [];

  const session = () => S().current();
  function amount() {
    const s = session();
    if (s.situation.monthlyAmount != null) return s.situation.monthlyAmount;
    return D().defaultAmount(s.situation.monthlyRange);
  }
  function setAmount(v) {
    const n = v === "" || v == null ? null : Math.max(0, Math.round(Number(v)));
    S().update({ situation: { monthlyAmount: Number.isFinite(n) ? n : null } });
    renderAll();
  }

  /* ── composition table ──────────────────────────────────── */
  function renderComposition() {
    const amt = amount();
    const split = D().splitAmount(amt, ITEMS.map((it) => ({ productId: it.productId, weight: it.weight })));
    $("#compEyebrow").textContent = t("portfolio.composition");
    $("#compHead").innerHTML = `<span>${t("portfolio.col_product")}</span><span>${t("portfolio.col_weight")}</span><span>${amt != null ? t("portfolio.col_amount") : ""}</span>`;
    $("#compList").innerHTML = ITEMS.map((it, i) => `
      <li class="pf-row">
        <span class="pf-row__name"><span class="pf-comp__swatch" style="background:${TYPE_SWATCH[it.product.type]}"></span><span>${esc(it.product.name)}<small>${esc(it.product.isin || "")}</small></span></span>
        <span class="pf-row__weight">${L().fmtPercent(it.weight, 0)}</span>
        <span class="pf-row__amount">${amt != null && split[i].amount != null ? L().fmtCurrency(split[i].amount, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : ""}</span>
      </li>`).join("");
    const byType = { etf: 0, stock: 0, bond: 0 };
    ITEMS.forEach((it) => { byType[it.product.type] += it.weight; });
    $("#compMix").textContent = t("portfolio.mix", { etf: byType.etf, stock: byType.stock, bond: byType.bond, label: t("portfolio.mix_label." + D().mixLabel(byType.stock)) });
    return byType;
  }

  /* ── donut by weight ────────────────────────────────────── */
  function renderDonut(byType) {
    const R = 92, C = 120, circ = 2 * Math.PI * R;
    let acc = 0;
    const arcs = TYPES.filter((ty) => byType[ty] > 0).map((ty) => {
      const frac = byType[ty] / 100, len = frac * circ, rot = -90 + acc * 360; acc += frac;
      return `<circle cx="${C}" cy="${C}" r="${R}" fill="none" style="stroke:${TYPE_SWATCH[ty]}" stroke-width="26" stroke-dasharray="${len.toFixed(1)} ${(circ - len).toFixed(1)}" transform="rotate(${rot.toFixed(2)} ${C} ${C})"/>`;
    }).join("");
    $("#pfDonut").innerHTML = `<circle cx="${C}" cy="${C}" r="${R}" fill="none" style="stroke:var(--line)" stroke-width="26"/>${arcs}<text x="${C}" y="${C + 8}" text-anchor="middle" class="pf-donut__pct">${L().fmtPercent(100, 0)}</text>`;
    $("#pfLegend").innerHTML = TYPES.map((ty) => `<li class="legend-row"><span class="legend-row__dot" style="background:${TYPE_SWATCH[ty]}"></span><span class="legend-row__name">${t("portfolio.type_label." + ty)}</span><span class="legend-row__val">${L().fmtPercent(byType[ty], 0)}</span></li>`).join("");
  }

  /* ── goals card: weighted provider scores + SDG coverage ─── */
  function scoreLine(labelKey, key) {
    const r = D().portfolioScore(ITEMS, DATA, key);
    if (r.value == null) return `<div class="pf-goal"><span class="pf-goal__k">${t(labelKey)}</span><span class="pf-goal__v pf-goal__v--na">${t("portfolio.goals_missing")}</span></div>`;
    const sources = [...new Set(ITEMS.map((it) => it.product.scores && it.product.scores[key]).filter((s) => s && typeof s.value === "number").map((s) => `${s.source}, ${s.asOf}`))].join("; ");
    const partial = r.coveredWeight < 100 ? ` · ${t("portfolio.goals_partial", { n: r.coveredWeight })}` : "";
    return `<div class="pf-goal"><span class="pf-goal__k">${t(labelKey)}<small>${esc(t("portfolio.goals_sources", { sources }))}${partial}</small></span><span class="pf-goal__v">${t("portfolio.goals_of10", { n: L().fmtNumber(r.value, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) })}</span></div>`;
  }
  function renderGoals() {
    $("#goalsEyebrow").textContent = t("portfolio.goals_title");
    const chosen = session().values.sdgs || [];
    const cov = D().sdgCoverage(chosen, ITEMS, DATA);
    const coverage = chosen.length
      ? `<div class="pf-goal"><span class="pf-goal__k">${t("portfolio.goals_coverage", { n: cov.count, total: cov.total })}</span><span class="pf-goal__chips">${cov.covered.map((id) => { const x = SDGS.find((y) => y.id === id); return `<span class="tag">${esc(id + " · " + (x ? x.title_de : id))}</span>`; }).join("")}</span></div>`
      : `<p class="pf-goal__muted">${t("portfolio.goals_coverage_none")}</p>`;
    $("#goalsList").innerHTML = scoreLine("portfolio.goals_score", "sustainability") + scoreLine("portfolio.goals_gender", "gender") + coverage;
  }

  /* ── amount field ───────────────────────────────────────── */
  function renderAmount() {
    const amt = amount();
    $("#amountLabel").textContent = t("portfolio.amount_label");
    $("#amountHint").textContent = amt != null ? t("portfolio.amount_hint") : t("portfolio.amount_none");
    const inp = $("#amountInput");
    if (document.activeElement !== inp) inp.value = amt != null ? amt : "";
  }

  /* ── plan block (PDF / e-mail: task 16) ─────────────────── */
  function renderPlan() {
    $("#planTitle").textContent = t("portfolio.plan_title");
    $("#planPdf").textContent = t("portfolio.plan_pdf");
    $("#planEmail").textContent = t("portfolio.plan_email");
    $("#planEmailLabel").textContent = t("portfolio.plan_email_label");
    $("#planEmailInput").placeholder = t("portfolio.plan_email_label");
    $("#planNewsletterLabel").textContent = t("portfolio.plan_newsletter");
    $("#planSoon").textContent = t("portfolio.plan_soon");
    $("#pfNote").innerHTML = window.pmInfoNote ? window.pmInfoNote.html("stance", "", { bodyText: t("portfolio.note") }) : "";
  }

  function renderEmpty(kind) {
    $("#pfStage").hidden = true;
    const e = $("#pfEmpty");
    e.hidden = false;
    e.innerHTML = `<p class="pf-empty__title">${esc(t("portfolio." + kind + ".title"))}</p>${kind === "empty" ? `<p class="pf-empty__sub">${esc(t("portfolio.empty.sub"))}</p>` : ""}<a class="btn btn--primary" href="explore.html">${esc(t("portfolio." + kind + ".cta"))}</a>`;
  }

  function renderAll() {
    $("#pfHeadline").textContent = t("portfolio.headline");
    document.querySelectorAll("[data-edit]").forEach((a) => { a.textContent = t("portfolio.edit"); });
    if (!ITEMS.length) return renderEmpty("empty");
    if (!D().weightsComplete(ITEMS)) return renderEmpty("incomplete");
    $("#pfEmpty").hidden = true;
    $("#pfStage").hidden = false;
    const byType = renderComposition();
    renderDonut(byType);
    renderGoals();
    renderAmount();
    renderPlan();
    if (window.pmGlossary) { window.pmGlossary.reset(); window.pmGlossary.mark(document.querySelector("main")); }
  }

  if (!window.pmLocale || !window.pmSession || !window.pmDerive) return;
  if (!S().current()) { S().create({ locale: L().lang() }); track("session_start"); }
  S().setScreen("/portfolio");
  track("screen_view", { screen: "/portfolio" });

  $("#amountInput").addEventListener("change", (e) => setAmount(e.target.value));
  document.addEventListener("pm:localeready", () => { if (DATA.length) renderAll(); });

  Promise.all([
    fetch("data/products.json").then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); }).catch(() => ({ products: [] })),
    fetch("data/sdgs.json").then((r) => (r.ok ? r.json() : { sdgs: [] })).catch(() => ({ sdgs: [] })),
    window.pmLocale.ready,
    window.pmGlossary ? window.pmGlossary.init() : null
  ]).then(([doc, sd]) => {
    DATA = doc.products || [];
    SDGS = sd.sdgs || [];
    const s = session();
    ITEMS = ((s.portfolio && s.portfolio.items) || []).map((it) => ({ productId: it.productId, weight: it.weight, product: DATA.find((p) => p.id === it.productId) })).filter((x) => x.product);
    renderAll();
    if (ITEMS.length && D().weightsComplete(ITEMS)) {
      const byType = { etf: 0, stock: 0, bond: 0 }; ITEMS.forEach((it) => { byType[it.product.type] += it.weight; });
      const sus = D().portfolioScore(ITEMS, DATA, "sustainability").value, gen = D().portfolioScore(ITEMS, DATA, "gender").value;
      track("portfolio_complete", { itemCount: ITEMS.length, mix: byType, sustainabilityScore: sus, genderScore: gen, sdgCoverage: D().sdgCoverage(s.values.sdgs || [], ITEMS, DATA).count });
      if (!s.portfolio.completedAt) S().update({ portfolio: { completedAt: new Date().toISOString() } });
    }
  });
})();
