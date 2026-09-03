/* Node-runnable tests for the calculator engine — no framework.
   Run:  node calc-engine.test.mjs                                */

import { CONFIG, realRate } from "./calc-config.mjs";
import { project, projectAll } from "./calc-engine.mjs";

let pass = 0, fail = 0;
const approx = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol;
function ok(name, cond, extra = "") {
  if (cond) { pass++; console.log(`  ✓ ${name}`); }
  else { fail++; console.log(`  ✗ ${name}  ${extra}`); }
}

const base = { ...CONFIG.defaults };

/* --- zero starting savings, zero contribution --- */
{
  const r = project({ ...base, startingSavings: 0, startingInvested: 0, monthlySaving: 0 });
  ok("zero savings + zero contribution -> everything 0", approx(r.cashFinal, 0) && approx(r.investedFinal, 0) && approx(r.gap, 0));
}

/* --- regular contribution, base scenario --- */
{
  const r = project({ ...base, startingSavings: 0, monthlySaving: 200 });
  ok("regular contribution -> invested > cash > 0", r.investedFinal > r.cashFinal && r.cashFinal > 0);
  ok("regular contribution -> gap > 0", r.gap > 0);
  ok("contributed = sum of contributions (no start)", r.contributed > 0 && r.contributed < r.investedFinal);
}

/* --- cash holds its value (savings ≈ inflation); investing grows --- */
{
  const r = project({ ...base, startingSavings: 10000, monthlySaving: 0 });
  ok("savings real rate ~= 0 (cash holds value, no erosion)", approx(realRate(CONFIG.savingsNominal), 0, 1e-9));
  ok("high starting savings, no contribution -> cash stays flat (not declining)", approx(r.cashFinal, 10000, 1e-6), `cashFinal=${r.cashFinal.toFixed(0)}`);
  ok("same money invested beats cash", r.investedFinal > r.cashFinal);
}

/* --- scenarios ordered --- */
{
  const all = projectAll({ ...base, startingSavings: 0, monthlySaving: 200 });
  ok("strong > base > conservative (invested)", all.strong.investedFinal > all.base.investedFinal && all.base.investedFinal > all.conservative.investedFinal);
}

/* --- longer horizon -> bigger gap --- */
{
  const shortH = project({ ...base, age: 30, horizonAge: 45, startingSavings: 0, monthlySaving: 200 });
  const longH = project({ ...base, age: 30, horizonAge: 67, startingSavings: 0, monthlySaving: 200 });
  ok("longer horizon -> larger gap", longH.gap > shortH.gap);
  ok("longer horizon -> more months", longH.months > shortH.months);
}

/* --- contribution scales the result linearly-ish (more saving -> bigger gap) --- */
{
  const low = project({ ...base, startingSavings: 0, monthlySaving: 100 });
  const high = project({ ...base, startingSavings: 0, monthlySaving: 400 });
  ok("more monthly saving -> larger gap", high.gap > low.gap);
}

/* --- starting location doesn't change the fair comparison totals --- */
{
  const inSavings = project({ ...base, startingSavings: 8000, startingInvested: 0, monthlySaving: 100 });
  const inDepot = project({ ...base, startingSavings: 0, startingInvested: 8000, monthlySaving: 100 });
  ok("comparison uses same starting total regardless of location", approx(inSavings.investedFinal, inDepot.investedFinal, 1e-6) && approx(inSavings.cashFinal, inDepot.cashFinal, 1e-6));
}

/* --- series integrity --- */
{
  const r = project({ ...base, startingSavings: 1000, monthlySaving: 150 });
  ok("series has one point per year + start", r.series.age.length === r.years + 1);
  ok("invested series monotonically >= cash series", r.series.invested.every((v, i) => v >= r.series.cash[i] - 1e-6));
  ok("final series point equals reported finals", approx(r.series.invested.at(-1), r.investedFinal, 1e-6) && approx(r.series.cash.at(-1), r.cashFinal, 1e-6));
}

/* --- edge: horizon at/below current age --- */
{
  const r = project({ ...base, age: 60, horizonAge: 55, startingSavings: 5000, monthlySaving: 100 });
  ok("non-positive horizon -> no growth, finals equal start", approx(r.cashFinal, 5000) && approx(r.investedFinal, 5000) && r.months === 0);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
