#!/usr/bin/env node
/* =============================================================
   One-time migration data/securities.json → data/products.json
   (PRD 7.2 shape, decision 12.09.2026 on conflict 17). Zero deps.

   What it does NOT do: invent data. Scores, SRI, holdings count,
   exclusions and KID links are null / empty until sourced from
   KID, factsheet, EET or a licensed provider (PRD 7.7). Fund size
   is the published figure in the fund's own currency, not
   converted (approximate; see meta.dataNote). sdgTags derive from
   the stated fund theme and must be verified against the EET.

   Usage: node scripts/migrate-products.mjs   (idempotent)
   ============================================================= */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(HERE, "..", "data", "securities.json");
const DST = resolve(HERE, "..", "data", "products.json");

const REGION = { Global: "world", Europe: "europe", Denmark: "europe", US: "us" };
const PROVIDER = [
  ["State Street SPDR", "State Street Global Advisors"], ["UBS", "UBS Asset Management"],
  ["Impact Shares", "Impact Shares"], ["Fidelity", "Fidelity"], ["iShares", "iShares (BlackRock)"],
  ["Amundi", "Amundi"], ["Nordea", "Nordea Asset Management"], ["Pictet", "Pictet Asset Management"],
  ["Triodos", "Triodos Investment Management"]
];
const WORLD_CORE = new Set(["etf-amundi-world-esg", "etf-ishares-world-sri"]);
// stated fund / company theme → SDG (verify against EET before launch)
const THEME_SDG = {
  "gender-diversity": 5, "empowerment": 5,
  "clean-energy": 7, "wind": 7, "offshore-wind": 7, "electric-vehicles": 7,
  "climate": 13, "climate-commitments": 13, "environment": 13, "resource-efficiency": 12,
  "planetary-boundaries": 13, "water": 6, "technology": 9, "semiconductors": 9, "ai": 9
};
const DESCRIPTION_DE = {
  "etf-she": "US-Großunternehmen, die in ihrer Branche bei der Geschlechtervielfalt in Führung und Aufsichtsrat vorne liegen. Ein ETF auf den SSGA Gender Diversity Index.",
  "etf-ubs-gender-equality": "Bildet den Solactive Equileap Global Gender Equality 100 Leaders Index ab. 100 Unternehmen weltweit mit guten Werten bei Geschlechtervielfalt und Nachhaltigkeit.",
  "etf-womn-ywca": "US-Unternehmen, die die YWCA-Standards zu Gleichstellung und Stärkung von Frauen erfüllen. Ein Themen-ETF aus den USA.",
  "etf-fdwm-fidelity-women": "Aktiv verwalteter ETF, der Unternehmen bevorzugt, die Frauen in Führung fördern. Aufgelegt in den USA.",
  "etf-inrg-clean-energy-ucits": "Bildet den S&P Global Clean Energy Transition Index führender Unternehmen für saubere Energie ab. Kohle, Ölsande, Schiefer und arktisches Öl und Gas sind ausgeschlossen.",
  "etf-icln-clean-energy-us": "US-notierte Variante mit weltweiten Aktien aus Solar, Wind und verwandten Technologien. Ein Themen-ETF für saubere Energie.",
  "etf-amundi-world-esg": "Große und mittlere Unternehmen aus Industrieländern mit hoher ESG-Bewertung im Branchenvergleich. Ein breiter, günstiger Baustein.",
  "etf-ishares-world-sri": "Sozial verantwortliche Variante des MSCI World. Kontroverse Branchen sind ausgeschlossen, die Unternehmen mit den höchsten ESG-Bewertungen bleiben.",
  "etf-ishares-global-water": "Unternehmen weltweit aus Wasserversorgung, Infrastruktur und Aufbereitung. Ein Themen-ETF rund um Wasser.",
  "stock-unilever": "Konsumgüterkonzern mit langjährigen Zielen zu Geschlechterbalance und nachhaltigem Konsum. Sitz in Großbritannien.",
  "stock-orsted": "Entwickler von Offshore-Windparks, weltweit führend. Vom fossilen Energieversorger zum Anbieter erneuerbarer Energie gewandelt.",
  "stock-vestas": "Größter Hersteller von Windturbinen weltweit. Ein zentraler Lieferant der Energiewende.",
  "stock-accenture": "Beratungs- und Dienstleistungsunternehmen mit dem öffentlichen Ziel einer geschlechterausgewogenen Belegschaft. Weltweit tätig.",
  "stock-loreal": "Kosmetikkonzern mit hohem Frauenanteil in Belegschaft und Management. Sitz in Frankreich.",
  "stock-microsoft": "Software- und Cloud-Anbieter mit dem Ziel, bis 2030 CO₂-negativ zu sein. Sitz in den USA.",
  "stock-nvidia": "Entwickler von Grafikprozessoren und Plattformen für KI-Berechnungen. Sitz in den USA.",
  "stock-adidas": "Sportartikelhersteller mit Programmen für recycelte Materialien und nachhaltige Lieferketten. Sitz in Deutschland.",
  "stock-tesla": "Hersteller von Elektroautos und Energiespeichern. Sitz in den USA.",
  "stock-intel": "Halbleiterhersteller mit etablierter Diversitätsberichterstattung und Zielen für Wasser und Emissionen. Sitz in den USA.",
  "fund-nordea-climate-environment": "Aktiv verwalteter Fonds mit Unternehmen, die Lösungen für Klima und Ressourceneffizienz anbieten. Kein ETF, nicht börsengehandelt.",
  "fund-pictet-global-environmental": "Investiert in Unternehmen entlang der Umwelt-Wertschöpfungskette innerhalb der planetaren Grenzen. Kein ETF, nicht börsengehandelt.",
  "fund-triodos-global-equities-impact": "Impact-Fonds, der nur in Unternehmen investiert, die die Nachhaltigkeits-Mindeststandards von Triodos erfüllen. Kein ETF, nicht börsengehandelt."
};

const nullScore = () => null; // { value, source, method, asOf } once a licensed provider exists
const emptyScores = () => ({
  sustainability: nullScore(), gender: nullScore(),
  radar: { climate: nullScore(), social: nullScore(), governance: nullScore(), gender: nullScore(), biodiversity: nullScore(), transparency: nullScore() }
});

function fundSizeMeur(aum) {
  if (!aum) return null;
  const m = String(aum).match(/([\d.]+)\s*B/i);
  return m ? Math.round(parseFloat(m[1]) * 1000) : null;
}
function provider(s) {
  if (s.type === "Stock") return s.name;
  const hit = PROVIDER.find(([p]) => s.name.startsWith(p));
  return hit ? hit[1] : null;
}
function sdgTags(themes) {
  return [...new Set((themes || []).map((th) => THEME_SDG[th]).filter(Boolean))].sort((a, b) => a - b);
}

if (!existsSync(SRC)) { console.log("securities.json not present — nothing to migrate"); process.exit(0); }
const src = JSON.parse(readFileSync(SRC, "utf8"));

const products = src.securities.map((s) => {
  const isFund = s.type === "Fund";
  const isStock = s.type === "Stock";
  const p = s.profile || {};
  return {
    id: s.id,
    isin: s.isin,
    name: s.name,
    provider: provider(s),
    type: isStock ? "stock" : "etf",
    subtype: isStock ? "single_stock" : (WORLD_CORE.has(s.id) ? "equity_world" : "equity_theme"),
    region: REGION[s.region] || "world",
    currency: s.currency,
    ter: s.ter == null ? null : Math.round(s.ter * 100) / 10000,   // percent → decimal
    sri: null,
    distribution: p.distribution ? p.distribution.toLowerCase() : null,
    inceptionDate: p.inception || null,
    fundSizeMeur: fundSizeMeur(p.aum),
    fundSizeCurrency: p.aum ? String(p.aum).split(" ")[0] : null,
    holdingsCount: null,
    topHoldings: p.topHoldings || [],
    scores: emptyScores(),
    sdgTags: sdgTags(s.themes),
    exclusions: [],
    description_de: DESCRIPTION_DE[s.id] || "",
    description_en: s.description || "",
    kidUrl: null,
    themes_de: [],
    themes_en: s.themes || [],
    asOf: s.asOf || null,
    notes: isFund ? "Offener Investmentfonds, nicht börsengehandelt (Typ etf per Entscheidung 12.09.2026, Konflikt 17)." : null
  };
});

const out = {
  meta: {
    version: "1.0.0",
    generated: new Date().toISOString().slice(0, 10),
    disclaimer: src.meta.disclaimer,
    dataNote: "Migrated once from securities.json (scripts/migrate-products.mjs). Master data from public issuer documents. scores, sri, holdingsCount, exclusions and kidUrl are null or empty until sourced from KID, factsheet, EET or a licensed provider (PRD 7.7) and are listed by scripts/data-check.mjs. fundSizeMeur is the published figure in fundSizeCurrency, not converted. sdgTags derive from the stated fund or company theme; verify against the EET before launch."
  },
  products
};
writeFileSync(DST, JSON.stringify(out, null, 2) + "\n");
console.log(`products.json written: ${products.length} products`);
