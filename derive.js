/* =============================================================
   Portemonnaie — derivations (PRD 7.6), pure functions, no state.
   Shared by the browser (window.pmDerive) and node --test
   (require). No dependencies.

   All results are descriptive. Nothing here recommends, judges
   or maps quiz answers to products (PRD 2.4).
   ============================================================= */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.pmDerive = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  /* Mix thresholds by stock share in percent (PRD 7.6): constants, not judgement */
  const MIX = Object.freeze({ RUHIG_MAX: 10, AUSGEWOGEN_MAX: 30 });

  /* S10 default monthly amount per S4 range (decision 12.09.2026, conflict 7: range edges) */
  const DEFAULT_AMOUNT = Object.freeze({ under_50: 50, "50_150": 100, "150_300": 225, over_300: 300, later: null });

  const byId = (products) => {
    const m = new Map();
    (products || []).forEach((p) => m.set(p.id, p));
    return m;
  };
  const scoreValue = (product, key) => {
    const s = product && product.scores && product.scores[key];
    return s && typeof s.value === "number" ? s.value : null;
  };

  /* Σ(weight × score) / 100 over items that have a score.
     Returns { value, coveredWeight } — value null when no item has a score.
     coveredWeight = sum of weights that carried a score (so the UI can say
     "based on 60 % of the portfolio"). */
  function portfolioScore(items, products, key) {
    const map = byId(products);
    let sum = 0, covered = 0;
    (items || []).forEach((it) => {
      const v = scoreValue(map.get(it.productId), key);
      if (v == null) return;
      sum += it.weight * v;
      covered += it.weight;
    });
    if (!covered) return { value: null, coveredWeight: 0 };
    return { value: Math.round((sum / covered) * 10) / 10, coveredWeight: covered };
  }

  /* Share of weight in a given type (default "stock"), in percent. */
  function typeShare(items, products, type) {
    const map = byId(products);
    const ty = type || "stock";
    return (items || []).reduce((acc, it) => {
      const p = map.get(it.productId);
      return acc + (p && p.type === ty ? it.weight : 0);
    }, 0);
  }

  /* "ruhig" | "ausgewogen" | "mutig" from the stock share (percent). */
  function mixLabel(stockSharePct) {
    if (stockSharePct < MIX.RUHIG_MAX) return "ruhig";
    if (stockSharePct <= MIX.AUSGEWOGEN_MAX) return "ausgewogen";
    return "mutig";
  }

  /* Whole-euro split of a monthly amount by weight; the rounding
     remainder goes to the item with the largest weight (first on ties).
     Returns [{ productId, weight, amount }]. amount null when no amount. */
  function splitAmount(amount, items) {
    const list = (items || []).map((it) => ({ productId: it.productId, weight: it.weight, amount: null }));
    if (amount == null || !(amount > 0) || !list.length) return list;
    const totalWeight = list.reduce((a, it) => a + it.weight, 0) || 100;
    let assigned = 0;
    list.forEach((it) => { it.amount = Math.floor((amount * it.weight) / totalWeight); assigned += it.amount; });
    const remainder = Math.round(amount) - assigned;
    if (remainder !== 0) {
      const largest = list.reduce((best, it) => (it.weight > best.weight ? it : best), list[0]);
      largest.amount += remainder;
    }
    return list;
  }

  /* Chosen SDGs that appear in at least one portfolio product.
     Returns { covered: [ids], count, total }. */
  function sdgCoverage(chosenSdgs, items, products) {
    const map = byId(products);
    const present = new Set();
    (items || []).forEach((it) => {
      const p = map.get(it.productId);
      ((p && p.sdgTags) || []).forEach((id) => present.add(id));
    });
    const chosen = (chosenSdgs || []).slice();
    const covered = chosen.filter((id) => present.has(id));
    return { covered, count: covered.length, total: chosen.length };
  }

  /* Weights must sum to exactly 100 to continue (PRD S9). */
  function weightsComplete(items) {
    const sum = (items || []).reduce((a, it) => a + (it.weight || 0), 0);
    return (items || []).length > 0 && sum === 100;
  }

  /* Even distribution in 5 % steps for n items (PRD S9 "Rest gleichmäßig verteilen");
     the first items take the extra 5 % steps when 100 is not divisible. */
  function evenWeights(n) {
    if (!n) return [];
    const step = 5;
    const base = Math.floor(100 / n / step) * step;
    let rest = 100 - base * n;
    return Array.from({ length: n }, () => { const w = base + (rest > 0 ? step : 0); if (rest > 0) rest -= step; return w; });
  }

  function defaultAmount(monthlyRange) {
    return Object.prototype.hasOwnProperty.call(DEFAULT_AMOUNT, monthlyRange) ? DEFAULT_AMOUNT[monthlyRange] : null;
  }

  return { MIX, DEFAULT_AMOUNT, portfolioScore, typeShare, mixLabel, splitAmount, sdgCoverage, weightsComplete, evenWeights, defaultAmount };
});
