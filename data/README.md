# Securities Data

Data layer for the **Explore** and **Basket** steps of the Robo Advisor flow.

## Files

| File | Purpose |
|---|---|
| `securities.json` | Close-to-real-life dataset. Real names / tickers / ISINs / sectors. Scores are **Money Tree-derived** (see below). Use in the real UI. |
| `securities.mock.json` | Deterministic synthetic fixtures for tests & UI development. Includes edge cases (A+ and F gender, 0 and 100 sustainability). **Do not ship to production.** |
| `securities.schema.json` | JSON Schema (draft 2020-12) describing one security record. Validate both datasets against it. |
| `prices/<id>.json` | Per-security end-of-day price **snapshot** for the product-detail chart. Static — refreshed by running `scripts/fetch-prices.mjs`. See below. |

## Price snapshots (`prices/<id>.json`)

The product detail page draws its chart from a static price snapshot per security,
keyed by the security `id`. We snapshot rather than call a price API at runtime so
the shipped site stays pure vanilla, has no rate limits, and exposes no API key.

```jsonc
{
  "id": "stock-microsoft",        // matches a securities.json id
  "symbol": "MSFT",               // symbol the series was fetched for
  "exchange": "XNAS",             // MIC of the resolved listing (null if unknown)
  "currency": "USD",              // listing currency reported by the API
  "asOf": "2026-06-22",           // last close in the series
  "source": "Twelve Data (EOD, delayed)",  // attribution; "placeholder" = synthetic
  "sourceUrl": "https://twelvedata.com",   // optional — renders the source as a link
  "placeholder": false,           // true → seeded preview data, not real prices
  "series": [                     // oldest → newest
    { "d": "2025-06-23", "c": 467.12 },
    { "d": "2025-06-24", "c": 470.38 }
  ]
}
```

Regenerate the real snapshots by running, from the repo root, with a Twelve Data
key in the environment:

```bash
TWELVE_DATA_API_KEY=xxxxx node scripts/fetch-prices.mjs
```

The script reads `securities.json`, fetches an EOD series per security, and writes
`prices/<id>.json`. It records the listing **currency** and **exchange** the API
actually returned (so a non-USD share class is labelled correctly), and writes
`source` / `sourceUrl` so the product chart shows the provider as a clickable link.
Until it is run, the seeded files carry `"placeholder": true` and the UI labels the
chart as illustrative sample data. The script is a maintenance tool — it is **not**
shipped to the browser.

### Resolving non-US listings (`priceFeed`)

Twelve Data resolves US tickers from a bare symbol, but European/UCITS listings
need an exchange-qualified request. Set an optional `priceFeed` block on the
security in `securities.json` and the script passes the MIC to the API:

```jsonc
"priceFeed": { "symbol": "INRG", "micCode": "XLON" }  // ISO 10383 MIC
```

Omit `priceFeed` for US listings and for open-ended funds (no exchange listing —
the three `LU…` / tickerless funds keep placeholder snapshots). The European
symbols/MICs currently set are **best-effort**; if one is skipped at fetch time,
verify it against Twelve Data's `symbol_search` and adjust the `priceFeed`.

## Regulatory note — IMPORTANT

This is a **financial-literacy** dataset, not investment advice.
- No buy/sell recommendation field exists, by design.
- Every screen rendering this data must show: *"This is not investment advice. Content is for educational purposes only."* (carried in `meta.disclaimer`).
- Categories / archetypes / scores only — never "you should buy X".

## How scores are produced (and why this is legally clean)

We **do not** copy any third-party provider's proprietary ESG/impact ratings (e.g. MSCI, Sustainalytics, moneycare.io). Doing so would risk EU database rights and copyright.

Instead, each record stores **public underlying facts** (`facts.*`) — women in leadership/board %, sector, environmental profile, controversies — gathered from issuer disclosures and public sources. From those facts we compute **Money Tree's own scores**:

- **`genderScore`** — `A+`…`F`. Driven by `facts.womenOnBoardPct` and `facts.womenInLeadershipPct`.
- **`sustainabilityScore`** — `0`…`100`. ESG / environmental profile.
- **`impact`** — `High` / `Medium` / `Low`. Composite. **Tie-break: impact always wins** (mission alignment).
- **`fourCapitals`** — Financial · Environmental · Social · Network (0–100 each).

> ⚠️ Current scores in `securities.json` are **reasonable estimates** derived by Claude from public facts as of 2023–2025 disclosures. Before launch, replace with a documented, repeatable scoring pipeline and/or a **licensed** data feed.

## Schema (summary)

```jsonc
{
  "id": "etf-she",                 // stable kebab id
  "name": "…",                     // full official name
  "ticker": "SHE",                 // exchange ticker (null if none)
  "isin": "US78468R7474",          // ISIN
  "type": "ETF",                   // "ETF" | "Stock" | "Fund"
  "assetClass": "Equity",
  "sector": "Diversified",         // GICS-style sector
  "region": "US",                  // US | Europe | Global | <country>
  "currency": "USD",
  "ter": 0.20,                     // total expense ratio % (null for stocks)
  "description": "…",
  "fourCapitals": { "financial": 70, "environmental": 60, "social": 88, "network": 65 },
  "genderScore": "A+",
  "sustainabilityScore": 74,
  "impact": "High",
  "themes": ["gender-diversity", "us-equity"],
  "facts": {
    "womenOnBoardPct": 45,
    "womenInLeadershipPct": 38,
    "esgHighlights": ["…"],
    "controversies": []
  },
  "asOf": "2025-Q4"
}
```

Top level:

```jsonc
{
  "meta": { "version", "generated", "disclaimer", "dataNote", "scoringSystem" },
  "securities": [ /* records */ ]
}
```
