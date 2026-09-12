// node --test scripts/glossary.test.mjs — GlossaryTerm marker logic (PRD 5.2)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createRequire } from "node:module";
import { validateFile } from "./validate-data.mjs";
const require = createRequire(import.meta.url);
const { createIndex, segment } = require("../glossary.js");

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURE = resolve(HERE, "fixtures", "glossary.3.json");
const terms = JSON.parse(readFileSync(FIXTURE, "utf8")).terms;

test("the 3-entry fixture validates against the glossary schema", () => {
  assert.deepEqual(validateFile(FIXTURE, resolve(HERE, "..", "data", "glossary.schema.json")), []);
});

test("first occurrence per screen only, aliases map to the same id", () => {
  const index = createIndex(terms);
  const seen = new Set();
  const a = segment("Ein ETF ist breit gestreut. Ein zweiter ETF bleibt Text.", index, seen);
  assert.deepEqual(a, [
    { text: "Ein " }, { term: "ETF", id: "etf" }, { text: " ist " }, { term: "breit gestreut", id: "streuung" },
    { text: ". Ein zweiter ETF bleibt Text." }
  ]);
  // the same ids on a later text node of the same screen stay plain
  assert.deepEqual(segment("Die Streuung eines ETFs.", index, seen), [{ text: "Die Streuung eines ETFs." }]);
  // a new screen resets
  assert.deepEqual(segment("Die Streuung eines ETFs.", index, new Set()), [
    { text: "Die " }, { term: "Streuung", id: "streuung" }, { text: " eines " }, { term: "ETFs", id: "etf" }, { text: "." }
  ]);
});

test("word boundaries with umlauts and case-insensitive matching", () => {
  const index = createIndex(terms);
  assert.deepEqual(segment("Terrasse und Öster", index, new Set()), [{ text: "Terrasse und Öster" }], "no match inside words");
  assert.deepEqual(segment("die laufende kosten sinken", index, new Set()), [
    { text: "die " }, { term: "laufende kosten", id: "ter" }, { text: " sinken" }
  ]);
});

test("a term without an entry stays plain text", () => {
  const index = createIndex(terms);
  assert.deepEqual(segment("Ein Sparplan ohne Eintrag.", index, new Set()), [{ text: "Ein Sparplan ohne Eintrag." }]);
  assert.deepEqual(segment("Nichts", createIndex([]), new Set()), [{ text: "Nichts" }]);
});

test("definitions in the fixture respect the 20-word limit (PRD 5.2)", () => {
  for (const e of terms) {
    const words = e.definition_de.trim().split(/\s+/).length;
    assert.ok(words <= 20, `${e.id}: ${words} words`);
  }
});
