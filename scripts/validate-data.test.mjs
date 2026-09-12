// node --test scripts/validate-data.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { validate, validateFile } from "./validate-data.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const data = (f) => resolve(HERE, "..", "data", f);
const schema = JSON.parse(readFileSync(data("products.schema.json"), "utf8"));

test("live data files validate against their schemas", () => {
  assert.deepEqual(validateFile(data("products.json"), data("products.schema.json")), []);
  assert.deepEqual(validateFile(data("sdgs.json"), data("sdgs.schema.json")), []);
});

test("validator catches type, enum, pattern, range, required, additional and duplicate errors", () => {
  const doc = JSON.parse(readFileSync(data("products.json"), "utf8"));
  const bad = JSON.parse(JSON.stringify(doc));
  const p = bad.products[0];
  p.type = "fund";                 // enum
  p.isin = "XX123";                // pattern
  p.ter = 5;                       // maximum (decimal, not percent)
  p.sri = 9;                       // maximum
  delete p.scores;                 // required
  p.genderScore = "A+";            // additionalProperties (own score field)
  bad.products[1].scores.sustainability = { value: 11, source: "X", asOf: "2026-08" }; // score range
  const errors = validate(bad, schema);
  const text = errors.join("\n");
  for (const needle of ['"fund" not in enum', "does not match", "5 > 0.1", "9 > 7", 'missing required "scores"', 'unexpected property "genderScore"', "11 > 10"]) {
    assert.ok(text.includes(needle), "expected error containing: " + needle + "\n" + text);
  }
});

test("a valid per-score object passes", () => {
  const doc = JSON.parse(readFileSync(data("products.json"), "utf8"));
  doc.products[0].scores.sustainability = { value: 8.7, source: "Money:Care", method: "ManualEET", asOf: "2026-08" };
  assert.deepEqual(validate(doc, schema), []);
});
