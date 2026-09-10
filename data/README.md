# Data

Static JSON for the Guidance Flow (PRD 7). Everything here is educational
content, not investment advice, and carries no buy/sell/recommendation field
by design.

## Files

| File | Purpose | Status |
|---|---|---|
| `securities.json` | Interim product list for the Explorer and Portfolio pages. Names, ISINs, types, regions, currencies, TERs and a small `profile` block from public issuer documents (KID, factsheet). | Replaced by `products.json` (PRD 7.2) in task 05. |
| `sdgs.json` | The 17 UN Sustainable Development Goals (PRD 7.4). German short titles and hover examples verbatim from PRD 8.3, English titles from the UN. | Ready. Colour tokens are named only. |
| `products.json` | Curated products with provider scores, `scoreSource`, SDG tags, KID figures (PRD 7.2). | Not yet created. |
| `glossary.json` | Glossary terms (PRD 7.3, 8.1). | Not yet created. |
| `partners.json` | Broker and wealth partners (PRD 7.5). | Out of scope while S11 is out of scope. |

## Rules (PRD 7.7)

- No own scores. Sustainability and gender scores come from a licensed provider
  and are always shown with provider and `asOf`.
- No prices, no performance charts.
- Never invent data. Placeholders use ids starting with `placeholder_` and must
  be gone before launch.
- Numeric snapshot fields (e.g. `profile.aum`) are approximate until verified
  against KID and factsheet.

## `securities.json` record (interim)

```jsonc
{
  "id": "etf-she",
  "name": "…",
  "isin": "US78468R7474",
  "type": "ETF",                    // "ETF" | "Stock" | "Fund" (PRD: etf | stock | bond, see conflict 17)
  "region": "US",
  "currency": "USD",
  "ter": 0.20,                      // percent (PRD: decimal, migrated in task 05)
  "description": "…",               // English today; PRD wants description_de
  "profile": { "aum": "USD 0.2B", "distribution": "Distributing", "inception": "2016", "topHoldings": ["…"] },
  "themes": ["gender-diversity"],
  "asOf": "2025-Q4"
}
```

Top level: `{ "meta": { "version", "generated", "disclaimer", "dataNote" }, "securities": [ … ] }`.
`meta.disclaimer` carries the PRD 2.4 text.
