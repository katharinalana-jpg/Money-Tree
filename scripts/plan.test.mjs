// node --test scripts/plan.test.mjs — PRD S10 PDF: plan data equals the screen state
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const P = require("../plan.js");
const D = require("../derive.js");

const HERE = dirname(fileURLToPath(import.meta.url));
const products = JSON.parse(readFileSync(resolve(HERE, "..", "data", "products.json"), "utf8")).products;
const sdgs = JSON.parse(readFileSync(resolve(HERE, "..", "data", "sdgs.json"), "utf8")).sdgs;
const glossary = JSON.parse(readFileSync(resolve(HERE, "..", "data", "glossary.json"), "utf8")).terms;
const de = JSON.parse(readFileSync(resolve(HERE, "..", "locales", "de.json"), "utf8"));
const flat = {}; (function f(o, p) { for (const k in o) { const v = o[k]; const key = p ? p + "." + k : k; if (v && typeof v === "object" && !Array.isArray(v)) f(v, key); else flat[key] = v; } })(de, "");
const t = (k) => (flat[k] !== undefined ? flat[k] : k);

const session = {
  schemaVersion: 1, phase: { selected: ["teilzeit"] },
  situation: { monthlyRange: "50_150", monthlyAmount: 250, horizon: "over_10y" },
  values: { sdgs: [5, 13, 4] },
  portfolio: { items: [{ productId: products[0].id, weight: 35 }, { productId: products[1].id, weight: 35 }, { productId: products[2].id, weight: 30 }] }
};

test("plan carries exactly the screen weights and the same euro split", () => {
  const plan = P.buildPlan({ session, products, sdgs, glossary, t, date: new Date("2026-09-13T10:00:00Z") });
  assert.deepEqual(plan.table.map((r) => r.weight), [35, 35, 30]);
  const screenSplit = D.splitAmount(250, session.portfolio.items).map((x) => x.amount);
  assert.deepEqual(plan.table.map((r) => r.amount), screenSplit);
  assert.equal(plan.table.reduce((a, r) => a + r.amount, 0), 250);
  assert.equal(plan.cover.weightsSum, 100);
});

test("file name and sections follow PRD S10", () => {
  const plan = P.buildPlan({ session, products, sdgs, glossary, t, date: new Date("2026-09-13T10:00:00Z") });
  assert.equal(plan.fileName, "Portemonnaie_Plan_2026-09-13.pdf");
  assert.equal(plan.cover.values.length, 3);
  assert.ok(plan.cover.phaseSentence.startsWith("27,8 %"));
  assert.equal(plan.todo.length, 6);
  assert.equal(plan.questions.length, 7);
  assert.ok(plan.disclaimer.startsWith("Die Informationen stellen keine Anlageberatung"));
  assert.ok(plan.goals.coverage.total === 3);
});

test("glossary section contains every term used in the plan", () => {
  const plan = P.buildPlan({ session, products, sdgs, glossary, t });
  const ids = plan.glossary.map((g) => g.id);
  for (const id of ["depot", "sparplan", "isin", "ausfuehrungstag", "provision"]) assert.ok(ids.includes(id), id);
  assert.ok(plan.glossary.every((g) => g.definition && g.why));
});

test("without amount the euro column is empty; missing scores stay null", () => {
  const plan = P.buildPlan({ session: Object.assign({}, session, { situation: { monthlyRange: "later", monthlyAmount: null, horizon: "open" } }), products, sdgs, glossary, t });
  assert.deepEqual(plan.table.map((r) => r.amount), [null, null, null]);
  assert.equal(plan.goals.sustainability.value, null);
});
