# Data

Static JSON for the Guidance Flow (PRD 7). Everything here is educational
content, not investment advice, and carries no buy/sell/recommendation field
by design. Every `<name>.json` has a `<name>.schema.json`; validation runs with
`node scripts/validate-data.mjs` (zero dependencies) and must pass before a
commit (PRD 10 "Content-Pflege": errors break the build).

## Files

| File | Purpose | Status |
|---|---|---|
| `products.json` | Curated products (PRD 7.2): master data from KID and factsheet, provider scores as `{ value, source, method, asOf }` per score (decision on conflict 2), SDG tags, exclusions, KID link. | 22 entries migrated from the former securities list. Scores, SRI, holdings count, exclusions and KID links are still null — listed by `node scripts/data-check.mjs`. Target 30 to 60 entries. |
| `sdgs.json` | The 17 UN Sustainable Development Goals (PRD 7.4). German short titles and hover examples verbatim from PRD 8.3, English titles from the UN. | Complete. `colorToken` names only; the muted tokens are defined in CSS (task 11). |
| `glossary.json` | Glossary terms (PRD 7.3, 8.1). | Created in task 08. |
| `partners.json` | Broker and wealth partners (PRD 7.5). | Not created: S11 is out of scope (decision 10.09.2026). Schema kept. |

## Rules (PRD 7.7, CLAUDE.md)

- No own scores. Sustainability and gender scores come from a licensed provider
  and are always shown with provider and `asOf`. A score without a provider is
  `null`, never a guess. `scripts/data-check.mjs` fails on any own-score field.
- No prices, no performance charts.
- Never invent data. Placeholders use ids starting with `placeholder_` and must
  be gone before launch (`node scripts/data-check.mjs --strict` is the gate).
- `fundSizeMeur` is the published figure in `fundSizeCurrency`, not converted;
  verify against KID and factsheet before launch.
- `sdgTags` in the migrated entries derive from the stated fund or company
  theme; verify against the European ESG Template (EET) before launch.

## Product record (PRD 7.2 plus `fundSizeCurrency` and `notes`)

```jsonc
{
  "id": "etf-ishares-world-sri",
  "isin": "IE00BYX2JD69",
  "name": "iShares MSCI World SRI UCITS ETF (Acc)",
  "provider": "iShares (BlackRock)",
  "type": "etf",                      // etf | stock | bond
  "subtype": "equity_world",          // equity_world | equity_theme | green_bond | single_stock
  "region": "world",                  // world | europe | emerging | austria | us
  "currency": "USD",
  "ter": 0.002,                       // ongoing charges p.a. as a decimal
  "sri": null,                        // 1–7 from the KID
  "distribution": "accumulating",
  "inceptionDate": "2017",            // YYYY or YYYY-MM-DD
  "fundSizeMeur": 6000, "fundSizeCurrency": "USD",
  "holdingsCount": null,
  "topHoldings": ["…"],
  "scores": {
    "sustainability": null,           // { "value": 8.7, "source": "Money:Care", "method": "ManualEET", "asOf": "2026-08" }
    "gender": null,
    "radar": { "climate": null, "social": null, "governance": null, "gender": null, "biodiversity": null, "transparency": null }
  },
  "sdgTags": [13],
  "exclusions": [],
  "description_de": "Zwei Sätze, jargonfrei.",
  "description_en": "",
  "kidUrl": null,
  "themes_de": [], "themes_en": ["sri", "esg"],
  "asOf": "2025-Q4",
  "notes": null
}
```

## Scripts

| Command | Does |
|---|---|
| `node scripts/validate-data.mjs` | Validates every `data/<name>.json` against `data/<name>.schema.json`. Exit 1 on errors. |
| `node scripts/data-check.mjs [--strict]` | Lists placeholders and missing sourced fields per product; fails on own-score fields (and on any placeholder with `--strict`). |
| `node scripts/migrate-products.mjs` | One-time migration from the former `securities.json` (kept for reference; the source file is gone). |
| `node --test scripts/*.test.mjs` | Tests for the validator, the derivations (`derive.js`, PRD 7.6) and the copy lint. |
