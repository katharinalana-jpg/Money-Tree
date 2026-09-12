// node --test scripts/derive.test.mjs — PRD 7.6 derivations
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const D = require("../derive.js");

const score = (v) => (v == null ? null : { value: v, source: "Test", method: null, asOf: "2026-08" });
const products = [
  { id: "a", type: "etf", sdgTags: [5, 13], scores: { sustainability: score(8), gender: score(9), radar: {} } },
  { id: "b", type: "stock", sdgTags: [7], scores: { sustainability: score(6), gender: null, radar: {} } },
  { id: "c", type: "bond", sdgTags: [], scores: { sustainability: null, gender: null, radar: {} } }
];
const items = [{ productId: "a", weight: 60 }, { productId: "b", weight: 20 }, { productId: "c", weight: 20 }];

test("portfolioScore is Σ(weight × score) over covered weight, 1 decimal", () => {
  // sustainability: (60×8 + 20×6) / 80 = 7.5 ; bond has no score
  assert.deepEqual(D.portfolioScore(items, products, "sustainability"), { value: 7.5, coveredWeight: 80 });
  assert.deepEqual(D.portfolioScore(items, products, "gender"), { value: 9, coveredWeight: 60 });
  assert.deepEqual(D.portfolioScore([{ productId: "c", weight: 100 }], products, "gender"), { value: null, coveredWeight: 0 });
});

test("mixLabel uses the PRD thresholds as constants", () => {
  assert.equal(D.mixLabel(0), "ruhig");
  assert.equal(D.mixLabel(9.9), "ruhig");
  assert.equal(D.mixLabel(10), "ausgewogen");
  assert.equal(D.mixLabel(30), "ausgewogen");
  assert.equal(D.mixLabel(30.1), "mutig");
  assert.equal(D.typeShare(items, products, "stock"), 20);
});

test("splitAmount rounds to whole euros and gives the remainder to the largest item", () => {
  const split = D.splitAmount(100, [{ productId: "a", weight: 33 }, { productId: "b", weight: 33 }, { productId: "c", weight: 34 }]);
  assert.deepEqual(split.map((s) => s.amount), [33, 33, 34]);
  assert.equal(split.reduce((s, x) => s + x.amount, 0), 100);
  const split2 = D.splitAmount(50, [{ productId: "a", weight: 45 }, { productId: "b", weight: 55 }]);
  assert.deepEqual(split2.map((s) => s.amount), [22, 28]); // 22.5 → 22, 27.5 → 27 + remainder 1 to largest
  assert.deepEqual(D.splitAmount(null, items).map((s) => s.amount), [null, null, null]);
});

test("sdgCoverage counts chosen SDGs present in at least one item", () => {
  assert.deepEqual(D.sdgCoverage([5, 13, 4], items, products), { covered: [5, 13], count: 2, total: 3 });
  assert.deepEqual(D.sdgCoverage([], items, products), { covered: [], count: 0, total: 0 });
});

test("weights: completeness and even 5 % distribution", () => {
  assert.equal(D.weightsComplete(items), true);
  assert.equal(D.weightsComplete([{ productId: "a", weight: 95 }]), false);
  assert.equal(D.weightsComplete([]), false);
  assert.deepEqual(D.evenWeights(3), [35, 35, 30]);
  assert.deepEqual(D.evenWeights(4), [25, 25, 25, 25]);
  assert.deepEqual(D.evenWeights(1), [100]);
  for (const n of [1, 2, 3, 5, 6, 7]) assert.equal(D.evenWeights(n).reduce((a, b) => a + b, 0), 100);
});

test("defaultAmount follows the range-edge decision", () => {
  assert.equal(D.defaultAmount("under_50"), 50);
  assert.equal(D.defaultAmount("50_150"), 100);
  assert.equal(D.defaultAmount("150_300"), 225);
  assert.equal(D.defaultAmount("over_300"), 300);
  assert.equal(D.defaultAmount("later"), null);
  assert.equal(D.defaultAmount("nope"), null);
});
