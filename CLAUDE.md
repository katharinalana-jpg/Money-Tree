# Money Tree – Project Context for Claude Code

## What is this?
**Money Tree** is the internal / repo codename. The public brand is **Portemonnaie Finance** (`portemonnaie.finance`) — a bilingual (EN/DE), values-aligned investment-*literacy* platform for women. It guides users from first investment steps toward a values-matched portfolio via a guided investment flow (referred to internally as the "Robo Advisor"; in **user-facing copy** use *"guided investment flow"*, never "robo-advisor").

Tagline (canonical): **"Invest in what you believe in."** Full brand voice + phrase rules live in **`brand/BRAND_GUIDELINES.md`** (the authoritative brand doc); resolve any wording questions there.

## Regulatory Boundary — CRITICAL
Financial literacy platform, NOT a licensed investment advisor.
- Never output personalized buy/sell recommendations for specific securities
- Quiz results and portfolio screens must carry: *"This is not investment advice. Content is for educational purposes only."*

## Current Status
Pre-launch, solo founder. Vanilla HTML/CSS/JS (no build step, no framework). What began as a pre-registration landing page now also includes working **Phase-1 prototype screens** of the core flow: bilingual landing page, values & risk **quiz**, **Explore** basket-builder, **product detail** pages, plus mission / calculator / legal pages. Phase 2 brings React/Next.js with a tech co-founder.

## Brand & Design
**Authoritative source: `brand/BRAND_GUIDELINES.md`** (voice, colour, type, dos/don'ts). Implemented design tokens live in `styles.css` `:root`. The palette is a warm **forest / sage / cream** system — *not* monochrome (the earlier monochrome spec is obsolete).

| Token | CSS var | Value |
|---|---|---|
| Background (cream) | `--bg` | `#FAF8F3` |
| Background warm / card | `--bg-light` / `--bg-card` | `#F7F3EB` |
| Background dark | `--bg-dark` | `#F0EAD9` |
| Ink (primary text) | `--ink` | `#1A2E24` |
| Forest (headings / accent) | `--forest`, `--ink-soft` | `#1F3A2E` |
| Muted text | `--ink-mute` | `#5A6B61` |
| Sage (accent) | `--sage` | `#A8D5BA` |
| Cream / Yellow | `--cream` / `--yellow` | `#F5EFD7` / `#F2C94C` |
| Marigold (sparingly) | `--marigold` | `#EAA221` |
| Button radius | `--radius` | `999px` (pill) |
| Card radius | `--radius-card` | `20px` |

Fonts: **Inter** (UI / body / headlines), **Instrument Serif** italic (accent words, pull quotes), **Caveat** (signature phrases only) — all via Google Fonts.

Style: minimal, editorial, warm, soft, handcrafted, premium and calm. Botanical line-art accents, generous whitespace. No emojis. No gradients / neon / dark-finance aesthetics. Marigold & lilac only inside the wallet logo, never as standalone UI colour.

## Four Capitals Framework
Core investment philosophy — every company is evaluated across:
**Financial · Environmental · Social · Network**

## Investor Archetypes (Robo Advisor output)
- **Cautious Starter** — low risk, short horizon, needs reassurance
- **Steady Grower** — balanced growth, medium risk/horizon
- **Impact Pioneer** — values-led, gender + sustainability lens first
- **Bold Builder** — high risk tolerance, long horizon, growth-maximizing

Tie-break rule: Impact score always wins (aligns with mission).

## Scoring System
- **Gender Score** (A+ to F) — % women in leadership, board diversity
- **Sustainability Score** (0–100) — ESG / environmental metrics
- **Impact** (High / Medium / Low) — composite

## 5-Step Core User Flow (guided investment flow, Phase 1)
1. **Quiz** — investing style, goals, values (`quiz.html` / `quiz.js`, bilingual). Content spec: `features/portemonnaie_quiz_content.md`.
2. **Archetype** — identity moment. NOTE: archetype scoring is a ready-to-activate **stub** (`computeArchetype()` returns null); today the result screen only confirms the profile was saved. Any computed output stays at **asset-class level**, never instrument/ISIN level.
3. **Explore** — ETFs/stocks/funds ranked by sustainability + gender score (`explore.html` / `explore.js`, data from `data/securities.json`).
4. **Basket** — drag-and-drop portfolio builder (within the Explore page).
5. **Execute** — open depot or use a wealth manager (informational hand-off; no order placement).

Each product also has a **detail page** — `product.html?id=<id>` / `product.js` — with investment criteria and a price-history chart.

## Platform Vision (Phase 2)
Dashboard · Advisor · Academy · Community · Barometer · Shop

## Folder Structure (current)
```
money-tree/
├── index.html                ← Home: "cost of waiting" calculator landing + flow (guided-flow entry)
├── calculator.js / calculator.css            ← calculator logic + styles (used by index)
├── prereg.html                               ← Pre-registration / early-access landing page (signup form)
├── quiz.html / quiz.js / quiz.css            ← Step 1–2: values & risk quiz
├── explore.html / explore.js / explore.css   ← Step 3–4: Explore + basket builder
├── product.html / product.js / product.css   ← Product detail page (?id=<id>)
├── mission.html, collabs.html, confirmed.html, impressum.html, privacy.html
├── styles.css                ← shared brand tokens + base styles
├── script.js                 ← shared: nav, mobile menu, signup form POST
├── i18n.js                   ← shared EN/DE i18n (data-i18n hooks + pm:langchange)
├── api/
│   └── subscribe.js          ← Vercel serverless fn — adds email to Brevo list
├── data/                     ← securities dataset + price snapshots (see data/README.md)
│   ├── securities.json, securities.mock.json, securities.schema.json
│   └── prices/<id>.json      ← static EOD price snapshots for the product chart
├── scripts/
│   └── fetch-prices.mjs      ← LOCAL Node tool to refresh price snapshots (not shipped)
├── brand/                    ← BRAND_GUIDELINES.md + logos / illustrations / reference
├── features/                 ← content specs (e.g. quiz copy)
├── img/                      ← logo.png, logo_tree.png, leaf-single.png
└── .claude/                  ← skills/ and agents/ for Claude Code (see Tooling below)
```

Assets are referenced with a `?v=N` cache-busting query; bump it after editing a shared file (see the `bump-cache` skill).

## Hosting & Infrastructure
- **Domain**: `portemonnaie.finance` (registered via GoDaddy)
- **Hosting**: Vercel (DNS points GoDaddy → Vercel)
- **Mailing list**: Brevo (list ID `4` = pre-registration signups)
- **Form flow**: `script.js` POSTs to `/api/subscribe` → serverless function calls Brevo `v3/contacts` with `updateEnabled: true`

## Environment Variables (Vercel)
- `BREVO_API_KEY` — Brevo API key (prefix `xkeysib-`). Must be enabled for Production. Adding/changing env vars requires a redeploy to take effect.

## Key Rules
- Vanilla HTML/CSS/JS only for the shipped site — no npm, no framework (Phase 1). (`scripts/*.mjs` are local Node maintenance tools, not part of the deployed site.)
- Bilingual **EN/DE** via `i18n.js` (`data-i18n` / `-html` / `-ph` / `-aria` hooks + the `pm:langchange` event). Brand slogans / display headlines stay English; explanatory copy & UI controls are translated. Page-specific copy (quiz/explore/product) lives in that page's own JS i18n block, not in `i18n.js`. See the `add-i18n` skill.
- Disclaimer required on every quiz-result, archetype, explore/ranking, basket and product screen: *"This is not investment advice. Content is for educational purposes only."*
- Displaying and ranking **specific named securities** by factual data / score is allowed (educational). Prohibited: personalized **buy/sell/hold** recommendations for a specific security. No recommendation field exists in the data, by design.
- Anonymous flow: no forced login before a result.
- Buttons always pill-shaped (`border-radius: 999px`); cards `20px`.
- No emojis anywhere in the UI.

## Data Layer (Explore / Product)
- `data/securities.json` — curated securities: real names / tickers / ISINs / sectors / TERs, Money Tree-derived scores (gender, sustainability, impact, four capitals) and a `profile` block of investment criteria (AUM, replication, domicile, distribution, index, holdings; or exchange, market cap, P/E, dividend yield for stocks).
- `data/securities.mock.json` — synthetic test fixtures (edge cases). `data/securities.schema.json` — JSON Schema for both. Validate after edits.
- `data/prices/<id>.json` — static end-of-day price snapshots for the product chart. Regenerate with `TWELVE_DATA_API_KEY=… node scripts/fetch-prices.mjs`. Current snapshots are `placeholder: true` synthetic data until a real fetch is run.
- All scores and the numeric `profile` fields are **estimates to verify against a licensed feed before launch** (see `data/README.md` and `meta.dataNote`).

## Tooling for Claude Code (this repo)
- **`brand/BRAND_GUIDELINES.md`** — authoritative brand voice + visual system. Read before producing copy or UI.
- **`.claude/skills/`** — `add-i18n`, `brand-ui`, `bump-cache`, `new-page` (project workflows).
- **`.claude/agents/`** — `compliance-checker`, `brand-auditor`, `securities-data-validator` (read-only review agents; they load at session start, so restart Claude Code after adding/editing them).
- **`features/`** — content specs (e.g. `portemonnaie_quiz_content.md`).

## Out of Scope for Phase 1
Academy · Community Forum · AI Chat · Native App · Broker API sync · Robo auto-invest (requires license)

## Phase 2 Tech Stack (reference only)
Next.js · Tailwind CSS · Supabase · Stripe · Vercel · Anthropic Claude API
