#!/usr/bin/env node
/* =============================================================
   Portemonnaie — copy lint for i18n strings (PRD 2.3, 2.4, 10;
   rules as listed in CLAUDE.md "Copy rules"). Zero dependencies.

   Usage:
     node scripts/copy-lint.mjs                 # lints locales/de.json
     node scripts/copy-lint.mjs file.json ...   # lints the given files
     node scripts/copy-lint.mjs --json          # machine readable
   Exit code 1 when any finding exists.

   Scope decision 10.09.2026 (conflict 3): the product / weight
   word family ("für dich", "passend", "empfehlen" ...) applies to
   product related keys only (PRODUCT_KEYS below); the deficit and
   jargon words, promises, guarantees and superlatives apply to
   every key. Sentence length: 15 words, 20 for S6 (quiz.impact.*)
   and glossary definitions. Legal text keys are exempt from the
   length rule (LENGTH_EXEMPT).
   ============================================================= */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const DEFAULT_FILE = resolve(HERE, "..", "locales", "de.json");

/* ---- rules --------------------------------------------------- */
export const PRODUCT_KEYS = /^(explore|portfolio|summary\.products|quiz\.portfolio)(\.|$)/;
export const LENGTH_EXEMPT = [/^common\.disclaimer$/, /\.disclaimer$/];
/* 20-word limit: S6 (PRD 2.3), glossary definitions (5.2), the S2 flashcards
   (8.2 states "alle Sätze ≤ 20 Wörter") and the S3 feedback built from them */
const LONG_SENTENCE_KEYS = /^(quiz\.impact|quiz\.traps\.card|quiz\.phase\.feedback|glossary)(\.|$)/;
/* Per-key exemptions for verbatim PRD copy that the lint would flag; each one is
   an open conflict in CLAUDE.md, never a silent change of the copy. */
export const KEY_EXEMPT = [
  { key: /^quiz\.traps\.card\.teilzeit\.body$/, rule: "deficit-word", match: "fehlt", why: "PRD 8.2 verbatim, conflict 3" }
];
const GLOSSARY_KEYS = /^glossary(\.|$)/;

const DEFICIT = [
  [/\bnoch nicht\b/i, "noch nicht"],
  [/\bendlich\b/i, "endlich"],
  [/\bdu musst\b/i, "du musst"],
  [/\bdu solltest\b/i, "du solltest"],
  [/\bdu hast verpasst\b/i, "du hast verpasst"],
  [/\bfehlt\b/i, "fehlt"],
  [/\bseamless\b/i, "seamless"],
  [/\bfrictionless\b/i, "frictionless"],
  [/\bintuitiv/i, "intuitiv"]
];
const JARGON_ROBO = [/robo[- ]?advisor/i, "Robo-Advisor (glossary only)"];
const PROMISES = [
  // third element: "allowed" predicate — a negated guarantee ("keine Garantie") is fine
  [/\bgarantier|\bgarantie\b/i, "guarantee", (s) => /\b(keine?|ohne)\s+garantie/i.test(s)],
  // a return figure is allowed only when marked as an assumption ("Annahme, keine Garantie")
  [/\bsichere?\s+rendite|\brendite\s+von\s+\d|\d\s?%\s+(rendite|gewinn)|\bgewinn\s+garantiert/i, "return promise", (s) => /\bannahme\b/i.test(s) && /\b(keine?|ohne)\s+garantie/i.test(s)],
  [/\b(die|der|das|am)\s+beste[nrs]?\b|\beinzigartig|\brevolutionär|\bperfekt\b|\bbeste[nrs]?\s+(wahl|weg|lösung)\b/i, "superlative"]
];
const PRODUCT_FAMILY = [
  [/\bempf(ehlen|iehlt|ohlen|ehlung)/i, "empfehlen"],
  [/\b(an)?raten\b|\bgeraten\b/i, "raten"],
  [/\bsolltest\b/i, "solltest"],
  [/passt zu dir/i, "passt zu dir"],
  [/\boptimal/i, "optimal"],
  [/ideal für dich/i, "ideal für dich"],
  [/\bfür dich\b/i, "für dich"],
  [/\bpassend/i, "passend"],
  [/\brecommend/i, "recommend"],
  [/\bfits you\b|\bfor you\b/i, "for you"]
];

function stripTags(s) { return String(s).replace(/<[^>]+>/g, " "); }

/* Sentences for the length rule: source citations in parentheses do not count
   (PRD 8.2 counts "alle Sätze ≤ 20 Wörter" without them) and a colon clause
   counts as its own sentence. */
function sentences(s) {
  let text = stripTags(s);
  for (let i = 0; i < 3; i++) text = text.replace(/\([^()]*\)/g, " ");
  return text.split(/(?<=[.!?…])\s+|:\s+/).map((x) => x.trim()).filter(Boolean);
}
function wordCount(s) {
  return s.replace(/[„“"‚‘’()·]/g, " ").trim().split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

export function flatten(obj, prefix = "", out = {}) {
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    const key = prefix ? prefix + "." + k : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, key, out);
    else if (Array.isArray(v)) v.forEach((x, i) => { out[key + "." + i] = x; });
    else out[key] = v;
  }
  return out;
}

/* Returns [{ key, rule, match, text }] */
export function lint(doc) {
  const flat = flatten(doc);
  const findings = [];
  const add = (key, rule, match, text) => {
    if (KEY_EXEMPT.some((x) => x.key.test(key) && x.rule === rule && x.match === match)) return;
    findings.push({ key, rule, match, text: String(text).slice(0, 90) });
  };

  for (const [key, val] of Object.entries(flat)) {
    if (typeof val !== "string" || !val.trim()) continue;
    const text = stripTags(val);

    for (const [re, name] of DEFICIT) if (re.test(text)) add(key, "deficit-word", name, text);
    if (!GLOSSARY_KEYS.test(key) && JARGON_ROBO[0].test(text)) add(key, "jargon", JARGON_ROBO[1], text);
    for (const [re, name, ok] of PROMISES) {
      if (re.test(text) && !(ok && ok(text))) add(key, "promise-or-superlative", name, text);
    }
    if (PRODUCT_KEYS.test(key)) {
      for (const [re, name] of PRODUCT_FAMILY) if (re.test(text)) add(key, "product-recommendation-word", name, text);
    }
    if (!LENGTH_EXEMPT.some((re) => re.test(key))) {
      const max = LONG_SENTENCE_KEYS.test(key) ? 20 : 15;
      for (const s of sentences(val)) {
        const n = wordCount(s);
        if (n > max) add(key, "sentence-length", `${n} > ${max} words`, s);
      }
    }
  }
  return findings;
}

/* ---- CLI ----------------------------------------------------- */
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const files = args.filter((a) => !a.startsWith("--"));
  const targets = files.length ? files.map((f) => resolve(f)) : [DEFAULT_FILE];
  let total = 0;
  const report = {};
  for (const file of targets) {
    const doc = JSON.parse(readFileSync(file, "utf8"));
    const findings = lint(doc);
    report[file] = findings;
    total += findings.length;
    if (!json) {
      console.log(`${file}: ${findings.length} finding${findings.length === 1 ? "" : "s"}`);
      for (const f of findings) console.log(`  ${f.key} · ${f.rule} · ${f.match} · "${f.text}"`);
    }
  }
  if (json) console.log(JSON.stringify(report, null, 2));
  process.exit(total ? 1 : 0);
}
