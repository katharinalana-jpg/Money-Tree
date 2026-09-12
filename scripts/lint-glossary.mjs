#!/usr/bin/env node
/* =============================================================
   Portemonnaie — glossary lint (PRD A.1 b), zero dependencies.
   Reuses the copy lint (scripts/copy-lint.mjs) for the forbidden
   word families and the glossary schema (data/glossary.schema.json)
   for structure; adds the glossary-specific rules:
     · definition_de ≤ 20 words
     · exactly one sentence in definition_de, why_de, example_de
     · a number (€ or %) in example_de
     · A.1 extras: "einfach", exclamation marks, "sicher", "ideal",
       "optimal", "empfehlen", "raten", "passt zu dir"
     · relatedIds exist, ids unique, every PRD 8.1 term covered
   Usage: node scripts/lint-glossary.mjs [file] [--review]
     --review writes docs/glossary-review.md (PRD A.1 d).
   Exit 1 on any finding.
   ============================================================= */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { lint as copyLint } from "./copy-lint.mjs";
import { validateFile } from "./validate-data.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(HERE, "..", "data", "glossary.json");
const SCHEMA = resolve(HERE, "..", "data", "glossary.schema.json");
const REVIEW = resolve(HERE, "..", "docs", "glossary-review.md");

/* PRD 8.1: required ids (51) */
export const REQUIRED_IDS = [
  "vermoegen", "investieren", "portfolio", "depot", "broker", "sparplan", "kurs", "rendite", "schwankung", "risiko", "streuung", "anlagehorizont", "zinsen", "inflation",
  "etf", "aktie", "anleihe", "green-bond", "themen-etf", "welt-etf", "fonds", "index",
  "isin", "ter", "risikoklasse", "kid", "ausschuettend-thesaurierend", "fondsvolumen", "positionen", "order", "ausfuehrungstag", "depotgebuehr", "einlagensicherung",
  "esg", "sustainability-score", "gender-score", "sdg", "divesting", "wertebasiertes-investieren", "ausschlusskriterien", "impact", "nachhaltigkeitspraeferenz", "gender-pay-gap", "gender-pension-gap", "gender-wealth-gap",
  "neobroker", "vermoegensverwaltung", "robo-advisor", "provision", "anlageberatung", "affiliate-link"
];

const EXTRA_FORBIDDEN = [
  [/\beinfach\b/i, "einfach (Beschwichtigung)"], [/!/, "Ausrufezeichen"],
  [/\bsicher(e|es|er)?\b/i, "sicher (im Sinne von garantiert)"],
  [/\bideal\b/i, "ideal"], [/\boptimal/i, "optimal"], [/\bempf(ehl|iehl|ohl)/i, "empfehlen"],
  [/\b(an)?raten\b/i, "raten"], [/passt zu dir/i, "passt zu dir"]
];
const ONE_SENTENCE = (s) => String(s || "").trim().split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ0-9„])/).filter(Boolean).length === 1 && /[.]$/.test(String(s).trim());
const words = (s) => String(s).trim().split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

export function lintGlossary(doc) {
  const findings = [];
  const add = (id, rule, detail) => findings.push({ id, rule, detail });
  const terms = doc.terms || [];
  const ids = new Set();
  terms.forEach((t) => {
    if (ids.has(t.id)) add(t.id, "duplicate-id", t.id);
    ids.add(t.id);
    const n = words(t.definition_de);
    if (n > 20) add(t.id, "definition-length", `${n} > 20 words`);
    ["definition_de", "why_de", "example_de"].forEach((f) => { if (!ONE_SENTENCE(t[f])) add(t.id, "one-sentence", f); });
    if (!/\d/.test(t.example_de || "")) add(t.id, "example-number", "no number in example_de");
    // € or % (A.1); a score scale "x von 10" / "x von 7" counts for score and risk-class entries
    if (!/(€|%|Euro|Prozent|Dollar|Millionen|Milliarden|Billionen|\d\s+von\s+(7|10)\b)/.test(t.example_de || "")) add(t.id, "example-unit", "no € or % in example_de");
    ["definition_de", "why_de", "example_de"].forEach((f) => {
      EXTRA_FORBIDDEN.forEach(([re, name]) => { if (re.test(t[f] || "")) add(t.id, "forbidden-word", `${name} in ${f}`); });
    });
    if (!t.relatedIds || !t.relatedIds.length || t.relatedIds.length > 3) add(t.id, "related-count", `${(t.relatedIds || []).length} relatedIds (1–3)`);
  });
  terms.forEach((t) => (t.relatedIds || []).forEach((r) => { if (!ids.has(r)) add(t.id, "related-missing", r); }));
  REQUIRED_IDS.forEach((r) => { if (!ids.has(r)) add(r, "missing-8.1-term", "not in glossary.json"); });
  // copy lint (forbidden families, sentence length 20 for glossary keys)
  const asLocale = {};
  terms.forEach((t) => { asLocale[t.id] = { definition_de: t.definition_de, why_de: t.why_de, example_de: t.example_de }; });
  copyLint({ glossary: asLocale }).forEach((f) => add(f.key.split(".")[1], "copy-lint:" + f.rule, f.match));
  return findings;
}

export function reviewMarkdown(doc) {
  const terms = (doc.terms || []).slice();
  const sample = ["etf", "ter", "isin", "depot", "sdg"];
  const order = (t) => (sample.includes(t.id) ? sample.indexOf(t.id) : 100);
  terms.sort((a, b) => order(a) - order(b) || a.id.localeCompare(b.id));
  const lines = ["# Glossar — Review (PRD A.1 d)", "", `Stand: ${doc.meta && doc.meta.generated}. ${terms.length} Einträge. Die ersten fünf (etf, ter, isin, depot, sdg) sind die Stichprobe aus A.1; danach alle weiteren alphabetisch nach id.`, "", "Prüffragen je Eintrag (A.2): Stimmt es fachlich? Klingt es nach uns? Würde meine Freundin ohne Finanzwissen es verstehen?", ""];
  terms.forEach((t) => {
    lines.push(`## ${t.term_de}`, "", `- **id:** \`${t.id}\` · Aliase: ${(t.aliases_de || []).join(", ") || "—"} · verwandt: ${(t.relatedIds || []).join(", ")}`,
      `- **Definition:** ${t.definition_de}`, `- **Warum wichtig:** ${t.why_de}`, `- **Beispiel:** ${t.example_de || "—"}`, "");
  });
  return lines.join("\n");
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2);
  const file = args.find((a) => !a.startsWith("--")) || FILE;
  const doc = JSON.parse(readFileSync(file, "utf8"));
  const schemaErrors = validateFile(file, SCHEMA);
  const findings = lintGlossary(doc);
  console.log(`schema: ${schemaErrors.length ? schemaErrors.length + " error(s)" : "0 errors"}`);
  schemaErrors.slice(0, 30).forEach((e) => console.log("  " + e));
  console.log("id · Wortzahl definition_de · Lint");
  (doc.terms || []).forEach((t) => {
    const f = findings.filter((x) => x.id === t.id);
    console.log(`  ${t.id} · ${words(t.definition_de)} · ${f.length ? "FAIL: " + f.map((x) => x.rule + " (" + x.detail + ")").join("; ") : "ok"}`);
  });
  const missing = findings.filter((f) => f.rule === "missing-8.1-term");
  if (missing.length) console.log("missing 8.1 terms: " + missing.map((m) => m.id).join(", "));
  const extras = (doc.terms || []).map((t) => t.id).filter((id) => !REQUIRED_IDS.includes(id));
  console.log(`terms beyond 8.1 (from screen copy): ${extras.join(", ") || "none"}`);
  console.log(`total: ${(doc.terms || []).length} terms, ${findings.length} finding(s)`);
  if (args.includes("--review")) { writeFileSync(REVIEW, reviewMarkdown(doc)); console.log("wrote " + REVIEW); }
  process.exit(findings.length || schemaErrors.length ? 1 : 0);
}
