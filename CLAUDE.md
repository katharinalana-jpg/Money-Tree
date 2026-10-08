# Money Tree – Project Context for Claude Code

## What is this?
**Money Tree** (moneytree.com) — English-language, values-aligned investment platform for women. Guides users from first investment steps to a values-matched portfolio via a Robo Advisor.

Tagline: "Invest in what you believe in."

## Regulatory Boundary — CRITICAL
Financial literacy platform, NOT a licensed investment advisor.
- Never output personalized buy/sell recommendations for specific securities
- Quiz results and portfolio screens must carry: *"This is not investment advice. Content is for educational purposes only."*

## Current Status
Pre-launch. Pre-registration landing page only. Solo founder. Vanilla HTML/CSS/JS.
Phase 2 brings React/Next.js with a tech co-founder.

## Brand & Design
Verbindlich ist `DESIGN.md` im Ordner `/Users/ks/Desktop/Portemonnaie Website_NEU/` (Redesign nach Canva-Entwurf, Okt 2026). Werte im Code als CSS-Variablen in `styles.css`, keine Hex-Codes in Komponenten.

| Token | Value | Use |
|---|---|---|
| `--color-creme` | `#F6F5EE` | Page background |
| `--color-text` | `#000000` | Text, rules, button borders on light ground |
| `--color-text-light` | `#D8D5C6` | Text on dark ground (green, red, blue) |
| `--color-sand` | `#D8D5C6` | Placeholder tiles |
| `--color-gruen` | `#285A4E` | "A new era of investing" section |
| `--color-gelb` | `#FAD247` | Collaborations tile, accent |
| `--color-rot` | `#691700` | Reserve |
| `--color-blau` | `#23408E` | Reserve, not in use yet |
| `--color-hellblau` | `#BCD5E3` | About page background |
| `--color-text-soft` | `#333333` | Text on light blue |
| `--color-button` | `#EEECDE` | Filled newsletter button |
| Fonts | DM Serif Display (logo), Newsreader (display, nav, buttons), DM Sans (body) | Google Fonts |
| Button radius | `999px` (pill), 1 px border | |

Style: editorial, calm, collage imagery from the Canva draft used 1:1. No emojis.

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

## 5-Step Core User Flow (Robo Advisor, Phase 1)
1. **Quiz** — investing style, goals, values
2. **Archetype** — identity moment, clear portfolio direction
3. **Explore** — ETFs/stocks ranked by gender + sustainability score
4. **Basket** — drag-and-drop portfolio builder
5. **Execute** — open depot or use a wealth manager

## Platform Vision (Phase 2)
Dashboard · Advisor · Academy · Community · Barometer · Shop

## Folder Structure (current)
```
money-tree/
├── index.html        ← Pre-registration landing page
├── styles.css
├── script.js
├── api/
│   └── subscribe.js  ← Vercel serverless function — adds email to Brevo list
└── img/              ← logo.png, logo_tree.png, leaf-single.png
```

## Hosting & Infrastructure
- **Domain**: `portemonnaie.finance` (registered via GoDaddy)
- **Hosting**: Vercel (DNS points GoDaddy → Vercel)
- **Mailing list**: Brevo (list ID `4` = pre-registration signups)
- **Form flow**: `script.js` POSTs to `/api/subscribe` → serverless function calls Brevo `v3/contacts` with `updateEnabled: true`

## Environment Variables (Vercel)
- `BREVO_API_KEY` — Brevo API key (prefix `xkeysib-`). Must be enabled for Production. Adding/changing env vars requires a redeploy to take effect.

## Key Rules
- Vanilla HTML/CSS/JS only — no npm, no framework (Phase 1)
- English for all user-facing content
- Disclaimer required on quiz result and portfolio screens
- Anonymous flow: no forced login before result
- Buttons always pill-shaped (`border-radius: 999px`)
- Never recommend specific securities — archetypes and categories only
- No emojis anywhere in the UI

## Out of Scope for Phase 1
Academy · Community Forum · AI Chat · Native App · Broker API sync · Robo auto-invest (requires license)

## Phase 2 Tech Stack (reference only)
Next.js · Tailwind CSS · Supabase · Stripe · Vercel · Anthropic Claude API
