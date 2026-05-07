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
| Token | Value |
|---|---|
| Background | `#EBEBEB` |
| Card bg | `#F5F5F5` |
| Primary text | `#1A1A1A` |
| Secondary text | `#4A4A4A` |
| Muted text | `#7A7A7A` |
| Font | Inter (Google Fonts) |
| Button radius | `999px` (pill) |
| Card radius | `20px` |

Style: minimalist, monochrome, editorial, clean. Botanical line art accents.
No emojis. No heavy color palettes. Professional look only.

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
└── img/              ← logo.png, logo_tree.png, leaf-single.png
```

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
