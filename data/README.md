# Securities Data

Data layer for the **Explore** and **Basket** steps of the Robo Advisor flow.

## Files

| File | Purpose |
|---|---|
| `securities.json` | Close-to-real-life dataset. Real names / tickers / ISINs / sectors. Scores are **Money Tree-derived** (see below). Use in the real UI. |
| `securities.mock.json` | Deterministic synthetic fixtures for tests & UI development. Includes edge cases (A+ and F gender, 0 and 100 sustainability). **Do not ship to production.** |
| `securities.schema.json` | JSON Schema (draft 2020-12) describing one security record. Validate both datasets against it. |

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
