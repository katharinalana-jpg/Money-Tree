#!/usr/bin/env node
/* =============================================================
   Portemonnaie — placeholder and own-score report for data/
   (CLAUDE.md "Never invent data", PRD 7.7). Zero dependencies.

   Lists, per product: placeholder_ ids, null scores, null SRI,
   null holdings count, empty sdgTags, missing KID link, empty
   description_de, missing ISIN. Fails (exit 1) when a field that
   would be an OWN score exists anywhere (genderScore,
   sustainabilityScore, impact, fourCapitals, facts, price*).

   Usage: node scripts/data-check.mjs [--strict]
     --strict also exits 1 when any placeholder remains (launch gate).
   ============================================================= */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(HERE, "..", "data", "products.json");
const OWN_SCORE_KEYS = /^(genderScore|sustainabilityScore|impact|fourCapitals|facts|price|prices|priceFeed|performance)$/;

function walkKeys(obj, path, hits) {
  if (!obj || typeof obj !== "object") return hits;
  for (const k of Object.keys(obj)) {
    if (OWN_SCORE_KEYS.test(k)) hits.push(path + "." + k);
    walkKeys(obj[k], path + "." + k, hits);
  }
  return hits;
}

export function check(doc) {
  const rows = [];
  const own = walkKeys(doc, "$", []);
  for (const p of doc.products || []) {
    const gaps = [];
    if (/^placeholder_/.test(p.id)) gaps.push("placeholder id");
    if (!p.isin) gaps.push("isin");
    if (!p.scores || p.scores.sustainability == null) gaps.push("score sustainability");
    if (!p.scores || p.scores.gender == null) gaps.push("score gender");
    const radar = (p.scores && p.scores.radar) || {};
    const radarMissing = Object.keys(radar).filter((k) => radar[k] == null).length;
    if (radarMissing) gaps.push(`radar ${radarMissing}/6`);
    if (p.sri == null) gaps.push("sri");
    if (p.holdingsCount == null && p.type !== "stock") gaps.push("holdingsCount");
    if (!p.sdgTags || !p.sdgTags.length) gaps.push("sdgTags");
    if (!p.kidUrl) gaps.push("kidUrl");
    if (!p.description_de) gaps.push("description_de");
    if (p.type !== "stock" && p.fundSizeMeur == null) gaps.push("fundSizeMeur");
    if (gaps.length) rows.push({ id: p.id, gaps });
  }
  return { own, rows, total: (doc.products || []).length };
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  if (!existsSync(FILE)) { console.error("data/products.json missing"); process.exit(1); }
  const strict = process.argv.includes("--strict");
  const { own, rows, total } = check(JSON.parse(readFileSync(FILE, "utf8")));
  console.log(`products: ${total} · with gaps: ${rows.length}`);
  rows.forEach((r) => console.log(`  ${r.id}: ${r.gaps.join(", ")}`));
  if (own.length) { console.log("OWN SCORE FIELDS (forbidden, PRD 7.7):"); own.forEach((o) => console.log("  " + o)); process.exit(1); }
  if (strict && rows.length) { console.log("strict: placeholders remain"); process.exit(1); }
}
