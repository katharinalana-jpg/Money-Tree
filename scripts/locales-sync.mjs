#!/usr/bin/env node
/* =============================================================
   Keeps locales/en.json structurally identical to locales/de.json
   (PRD 5.5): every key of de.json exists in en.json, new keys get
   "" (German fallback at runtime), keys missing from de.json are
   dropped, existing English values are kept. Zero dependencies.

   Usage: node scripts/locales-sync.mjs [--check]
   --check exits 1 when en.json would change (for a pre-commit run).
   ============================================================= */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const DE = resolve(HERE, "..", "locales", "de.json");
const EN = resolve(HERE, "..", "locales", "en.json");

function sync(src, dst) {
  const out = {};
  for (const k of Object.keys(src)) {
    const v = src[k];
    if (v && typeof v === "object" && !Array.isArray(v)) out[k] = sync(v, (dst && typeof dst[k] === "object" && dst[k]) || {});
    else out[k] = dst && typeof dst[k] === "string" ? dst[k] : "";
  }
  return out;
}

const de = JSON.parse(readFileSync(DE, "utf8"));
const en = existsSync(EN) ? JSON.parse(readFileSync(EN, "utf8")) : {};
const next = JSON.stringify(sync(de, en), null, 2) + "\n";
const current = existsSync(EN) ? readFileSync(EN, "utf8") : "";

if (process.argv.includes("--check")) {
  if (next !== current) { console.error("locales/en.json is out of sync with de.json — run node scripts/locales-sync.mjs"); process.exit(1); }
  console.log("locales/en.json in sync");
} else {
  writeFileSync(EN, next);
  console.log("locales/en.json written");
}
