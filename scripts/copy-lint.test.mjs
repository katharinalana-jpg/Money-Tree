// node --test scripts/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { lint } from "./copy-lint.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const load = (p) => JSON.parse(readFileSync(resolve(HERE, p), "utf8"));

test("passing fixture has no findings", () => {
  assert.deepEqual(lint(load("fixtures/copy-lint.pass.json")), []);
});

test("failing fixture triggers every rule once", () => {
  const findings = lint(load("fixtures/copy-lint.fail.json"));
  const byKey = Object.fromEntries(findings.map((f) => [f.key + "|" + f.rule, f.match]));
  assert.equal(byKey["deficit.a|deficit-word"], "noch nicht");
  assert.equal(byKey["deficit.b|deficit-word"], "du musst");
  assert.equal(byKey["jargon.a|jargon"], "Robo-Advisor (glossary only)");
  assert.equal(byKey["promise.a|promise-or-superlative"], "guarantee");
  assert.equal(byKey["promise.b|promise-or-superlative"], "superlative");
  assert.equal(byKey["explore.card.a|product-recommendation-word"], "für dich");
  assert.equal(byKey["portfolio.b|product-recommendation-word"], "empfehlen");
  assert.ok(/^\d+ > 15 words$/.test(byKey["length.a|sentence-length"]));
  assert.ok(/^\d+ > 20 words$/.test(byKey["quiz.impact.long|sentence-length"]));
});

test("product family is scoped to product keys; glossary may say Robo-Advisor", () => {
  const findings = lint({
    quiz: { phase: { feedback: "Dein Geld kann trotzdem für dich arbeiten." } },
    glossary: { robo: { definition_de: "Ein Robo-Advisor ist ein automatisierter Anlagedienst." } }
  });
  assert.deepEqual(findings, []);
});

test("negated guarantee and the legal disclaimer are allowed", () => {
  const findings = lint({
    quiz: { impact: { a: "Die Vergangenheit ist aber keine Garantie." } },
    common: { disclaimer: load("../locales/de.json").common.disclaimer }
  });
  assert.deepEqual(findings, []);
});

test("the live German source passes", () => {
  assert.deepEqual(lint(load("../locales/de.json")), []);
});
