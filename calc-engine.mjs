/* =============================================================
   Portemonnaie — calculator engine (pure, UI-independent).

   Real terms (today's € ). One contribution stream over the
   horizon, projected two ways — kept in cash vs invested — to
   show the opportunity cost of not investing.

   project(input, cfg, scenarioKey) -> {
     years, months, cashFinal, investedFinal, contributed,
     gap, pctGap, series:{age[],cash[],invested[],contributed[]},
   }

   No DOM, no globals, no side effects — unit-testable in Node.
   ============================================================= */

import { CONFIG, realRate, monthlyRate } from "./calc-config.mjs";

/* Monthly contribution (today's € ). */
export function contributionAt(mo, input, cfg = CONFIG) {
  return Math.max(0, input.monthlySaving ?? 0);
}

/* Core projection. */
export function project(input, cfg = CONFIG, scenarioKey = cfg.defaultScenario) {
  const years = Math.max(0, (input.horizonAge ?? cfg.defaults.horizonAge) - (input.age ?? cfg.defaults.age));
  const months = Math.round(years * 12);

  const invAnnual = cfg.scenarios[scenarioKey] ?? cfg.scenarios[cfg.defaultScenario];
  const saveAnnual = realRate(cfg.savingsNominal);
  const mInv = monthlyRate(invAnnual);
  const mSave = monthlyRate(saveAnnual);

  const startingTotal = Math.max(0, (input.startingSavings ?? 0) + (input.startingInvested ?? 0));

  let cash = startingTotal;
  let invested = startingTotal;
  let contributed = startingTotal;

  const series = { age: [], cash: [], invested: [], contributed: [] };
  const push = (mo) => {
    series.age.push((input.age ?? cfg.defaults.age) + mo / 12);
    series.cash.push(cash);
    series.invested.push(invested);
    series.contributed.push(contributed);
  };
  push(0);

  for (let mo = 1; mo <= months; mo++) {
    const c = contributionAt(mo - 1, input, cfg); // contribute at start of month
    cash = cash * (1 + mSave) + c;
    invested = invested * (1 + mInv) + c;
    contributed += c;
    if (mo % 12 === 0 || mo === months) push(mo);
  }

  const gap = invested - cash;
  const pctGap = cash > 0 ? gap / cash : 0;

  return {
    years, months, scenario: scenarioKey,
    cashFinal: cash, investedFinal: invested, contributed,
    gap, pctGap, series,
  };
}

/* Run every scenario at once (for scenario ranges). */
export function projectAll(input, cfg = CONFIG) {
  const out = {};
  for (const key of Object.keys(cfg.scenarios)) out[key] = project(input, cfg, key);
  return out;
}
