/* =============================================================
   Portemonnaie — calculator assumptions (central config).

   EU-broad, € . ALL financial constants live here — the engine
   and the UI must never hardcode a rate.

   The engine runs in REAL terms (today's purchasing power), so
   the cash-vs-invest comparison already reflects purchasing power.

   Sources (Phase 3 report): UBS/DMS Global Investment Returns
   Yearbook (equity real returns), ECB (savings & inflation).
   ============================================================= */

export const CONFIG = {
  /* --- macro --- */
  inflation: 0.02,          // ECB medium-term target
  // We assume a savings account roughly keeps pace with inflation, i.e. a ~0%
  // REAL return: cash holds its value in today's money rather than eroding.
  savingsNominal: 0.02,

  /* --- investment scenarios (REAL annual return) ---
     Base is set so investing beats cash by ~6% a year (the researched
     long-run equity-vs-cash gap cited in the source link). */
  scenarios: {
    conservative: 0.040,
    base:         0.060,
    strong:       0.075,
  },
  defaultScenario: "base",

  /* --- input defaults (today's € / years) --- */
  defaults: {
    age: 30,
    horizonAge: 67,
    monthlySaving: 200,       // what you set aside each month, today's €
    startingSavings: 5000,
    startingInvested: 0,
    moneyLocation: "savings", // "savings" | "invested"
  },

  /* --- slider ranges (kept out of the markup) --- */
  ranges: {
    age:             { min: 18, max: 60, step: 1 },
    horizonAge:      { min: 55, max: 80, step: 1 },
    monthlySaving:   { min: 0, max: 2000, step: 10 },
    startingSavings: { min: 0, max: 200000, step: 500 },
  },
};

/* Convert a nominal annual rate to a real one given inflation. */
export function realRate(nominal, inflation = CONFIG.inflation) {
  return (1 + nominal) / (1 + inflation) - 1;
}

/* Monthly compounding rate from an annual rate. */
export function monthlyRate(annual) {
  return Math.pow(1 + annual, 1 / 12) - 1;
}
