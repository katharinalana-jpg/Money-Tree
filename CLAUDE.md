# Money Tree – Project Context for Claude Code

## What is this?
**Money Tree** is the internal / repo codename. The public brand is **Portemonnaie Finance** (`portemonnaie.finance`) — a bilingual (EN/DE), values-aligned investment-*literacy* platform for women. It guides users from first investment steps toward a values-matched portfolio via a guided investment flow (referred to internally as the "Robo Advisor"; in **user-facing copy** use *"guided investment flow"* / *"geführter Anlageprozess"*, never "robo-advisor").

Tagline (canonical): **"Invest in what you believe in."** Full brand voice + phrase rules live in **`brand/BRAND_GUIDELINES.md`** (the authoritative brand doc); resolve any wording questions there.

**Current work: Guidance Flow update.** Binding spec: `docs/PRD.md` (German, PRD of 09.09.2026). Progress log: `docs/PROGRESS.md`. Precedence: a line under "Decisions" > PRD > the rest of this file. For visual questions `brand/BRAND_GUIDELINES.md` overrides PRD 5.6.

## How to work (every task)
1. Read this file and `docs/PROGRESS.md`. Then read ONLY the PRD sections the task names: `grep -n '^#' docs/PRD.md`, then read by line range. Never load the whole PRD.
2. Write the minimum code that meets the acceptance criteria ("Akzeptanz") of those sections. No speculative features, no refactors outside the task, no new dependency without a one line reason. Use the repo skills where they fit (`new-page`, `add-i18n`, `brand-ui`, `bump-cache`).
3. PRD silent or contradictory and no line under "Decisions": stop and ask. Do not guess.
4. Verify: schema validation, copy lint, tests for the change. For screens, check every "Akzeptanz" criterion. Loop until green; after two failed attempts on the same problem, stop and report. Bump `?v=N` after editing a shared file.
5. Update `docs/PROGRESS.md`: one line per finished item, new open issues appended, copy typo fixes listed.
6. Report in max 10 lines: files changed, verification result (criteria pass/fail), open issues. No code echo. Then stop.

## Regulatory Boundary — CRITICAL (PRD 2.4, a violation is a bug)
Financial literacy platform, NOT a licensed investment advisor. Portemonnaie is not a robo advisor and gives no financial advice.
- Quiz answers (phase, amount, horizon, SDGs) never map to products, weights, portfolio types or sort order. No archetypes.
- S5 example portfolios: always all three, label "Beispiel, keine Empfehlung" is part of the component and cannot be turned off.
- Explorer is a catalog. Sorts: name A to Z (default), cost, sustainability score, gender score. S7 SDGs preselect a visible, removable filter only.
- Forbidden for products or weights: empfehlen, raten, solltest, passt zu dir, optimal, ideal für dich. Allowed: so kann ein Portfolio aussehen, viele Anlegerinnen, typischerweise.
- Portfolio feedback describes, never judges.
- Disclaimer: text from PRD 2.4, footer on every screen from S5 on; S9 to S11 also as InfoNote.
- Partner links: new tab, `rel="sponsored noopener"`, tracked, label "Werbung" directly at each link (§ 26 MedienG). No portfolio data to partners. Broker and wealth partner names appear only on S11, alphabetical, no highlight.
- No personal data before S10. Email goes only to Brevo, never into analytics. Newsletter checkbox unticked, double opt in.
- Scores are third party ratings: always show provider and asOf. Never compute or estimate own scores. No prices, no performance charts (PRD 7.7).
- Never invent data: no invented ISINs, scores, fees or statistics. Placeholders use ids starting with `placeholder_` and must be gone before launch.

## Current Status
Pre-launch, solo founder. Vanilla HTML/CSS/JS (no build step, no framework). What began as a pre-registration landing page now also includes working **Phase-1 prototype screens** of the core flow: bilingual landing page, values & risk **quiz**, **Explore** basket-builder, **product detail** pages, plus mission / calculator / legal pages. These prototype screens are now being rebuilt to `docs/PRD.md`. Phase 2 brings React/Next.js with a tech co-founder.

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

PRD 5.6 tokens, implemented in `:root` (task 03): `--bg-warm` `#F7F3EB`, `--ink-caption` `#4A5C52` (PRD "Ink Soft", captions and secondary text at ≥ 18 px only), `--forest-deep` `#14271F` (primary CTA hover), `--sage-deep` `#7FB995` (list markers, section tags, glossary underline), `--sage-soft` `#D4EAD8` (pills, chips, hover), `--cream-soft` `#FAF4DC` (dividers, footer bands). Flow pages carry `body.flow-body`, which scopes the PRD button and focus styles. Colour in flow files only via `var(--token)`.

Fonts: **Inter** (UI / body / headlines), **Instrument Serif** italic (accent words, pull quotes), **Caveat** (signature phrases only) — all via Google Fonts.

Style: minimal, editorial, warm, soft, handcrafted, premium and calm. Botanical line-art accents, generous whitespace. No emojis. No gradients / neon / dark-finance aesthetics. Marigold & lilac only inside the wallet logo, never as standalone UI colour.

Flow rules (PRD 2.2, 5.6):
- Page background `--bg`, never #FFFFFF. No shadows, glows, pink. Forest as full surface only for one reserved moment (e.g. S10 goals card). 90 % of every surface stays light.
- One primary CTA per screen: Forest fill, #FAF8F3 text, hover Forest Deep. Secondary: Forest outline. Yellow is never a fill, only an underline, once per screen.
- Instrument Serif, italic only: one accent word per headline, quotes, flashcard quotes, cream callouts. Caveat only for "Learn. Invest. Grow. On your terms." on S0 and S11.
- Glossary underline dotted Sage Deep. InfoNote cream, no border, max two per screen, tilt ±2.5° only for "Gut zu wissen".
- WCAG 2.1 AA, contrast ≥ 4.5:1, Ink Soft only at ≥ 18 px, focus 2 px Forest outline, targets ≥ 44×44 px, `prefers-reduced-motion` respected, drag and drop always has + and − buttons. Desktop first, no horizontal scroll from 375 px.

## Copy rules (PRD 2.3, 5.5)
- Copy from PRD 6 and 8 is taken verbatim. Allowed: pure spelling and punctuation fixes, each logged in PROGRESS.md. Not allowed: wording changes. Conflicts go to open issues.
- Copy lint: noch nicht, endlich, du musst, du solltest, du hast verpasst, fehlt, seamless, frictionless, intuitiv, Robo-Advisor (glossary only), return promises, guarantees, superlatives.
- Du, singular. UI sentences max 15 words; S6 and glossary definitions max 20.
- Numbers and currency by locale (`de-AT`: 1.500,00 €).
- Every finance term renders as GlossaryTerm on its first occurrence per screen (auto marker, manual override). Missing entry: plain text plus dev warning, never an empty popover.
- Where strings live: `locales/de.json` for the flow (decision on conflict 14); lint with `node scripts/copy-lint.mjs` after every copy change.

## Guidance Flow (PRD 4 to 7, replaces the former 5-step flow)
Journey: Quiz → Zusammenfassung → Explorer → Portfolio → Weg wählen. Under 15 minutes, every screen teaches before it asks.

| ID | PRD route | PRD heading | Progress stage |
|---|---|---|---|
| S0 | `/` | `## S0` | none |
| S2 | `/quiz/traps` | `## S2`, 8.2 | Quiz |
| S3 | `/quiz/phase` | `## S3` | Quiz |
| S4 | `/quiz/situation` | `## S4` | Quiz |
| S5 | `/quiz/portfolio` | `## S5` | Quiz |
| S6 | `/quiz/impact` | `## S6` | Quiz |
| S7 | `/quiz/values` | `## S7`, 8.3 | Quiz |
| S8 | `/summary` | `## S8` | Zusammenfassung |
| S9 | `/explore` | `## S9` | Explorer |
| S10 | `/portfolio` | `## S10` | Portfolio |
| S11 | `/execute` | `## S11` | Weg wählen |

How PRD routes map to HTML pages: see conflict 16.

- State: one object `pm_session` in localStorage (schema PRD 7.1, `schemaVersion`), saved on every input, discarded after 30 days, reset only by the user. Back navigation never changes values.
- Data (target, PRD 7): `data/products.json`, `glossary.json`, `sdgs.json`, `partners.json`, each with a JSON Schema. Migration from `securities.json`: conflict 17.
- Derived, never stored (PRD 7.6): portfolio score = Σ(weight × score) / 100. Mix by stock share: < 10 ruhig, 10 to 30 ausgewogen, > 30 mutig (constants). Amount split rounded to whole euros, remainder to the largest item. SDG coverage = chosen SDGs present in at least one item.
- Analytics: one shared `track()` helper, only events from PRD 9, payload sessionId hash, screen, locale, timestamp. No emails, no free text.
- Budgets: LCP < 2 s on S0, interactions < 100 ms, JS and CSS < 300 kB gzip per page without the lazy loaded PDF library.

## Superseded by PRD 09.09.2026 (do not rebuild)
- Investor archetypes (Cautious Starter, Steady Grower, Impact Pioneer, Bold Builder), the Impact tie-break rule and the `computeArchetype()` stub.
- Own scores: Gender Score A+ to F, Sustainability Score 0 to 100, Impact High/Medium/Low. PRD: provider scores 0 to 10.
- Explore ranked by score by default. PRD: neutral default sort, name A to Z.
- Price history chart, `data/prices/`, and price data in the UI (PRD 7.7).
- Disclaimer text "This is not investment advice. Content is for educational purposes only." PRD 2.4 text replaces it (EN version in the en locale).
- `features/portemonnaie_quiz_content.md` as quiz spec. PRD 6 and 8 replace it.

## Platform Vision (Phase 2)
Dashboard · Advisor · Academy · Community · Barometer · Shop

## Folder Structure (current)
```
money-tree/
├── index.html                ← Home: pre-registration landing page (mirrors main) with signup form + cash-vs-investing calculator
├── calculator.js / calculator.css            ← calculator logic + styles (used by index; engine in calc-engine.mjs / calc-config.mjs)
├── library.html                              ← Library coming-soon page
├── session.js                ← pm_session factory + singleton (PRD 5.4 / 7.1) + S0 wiring; testable via require
├── track.js                  ← track() with PRD 9 event whitelist, hashed session id, no-op transport
├── progress.js               ← ProgressBar (PRD 5.1) for <nav id="pmProgress" data-stage>
├── glossary.js               ← GlossaryTerm (PRD 5.2): auto marker + popover; core exported for tests
├── flow-ui.js                ← InfoNote (3 variants) + footer Disclaimer (PRD 5.3)
├── quiz.html / quiz.js / quiz.css            ← Quiz stage: S2 to S7 as internal steps (interim placeholder screens)
├── summary.html                              ← S8 (empty until task 11)
├── explore.html / explore.js / explore.css   ← S9 Explorer catalog + portfolio panel (interim)
├── portfolio.html / portfolio.js / portfolio.css ← S10 (interim)
├── product.html / product.js / product.css   ← Product detail page (?id=<id>), kept for now (conflict 17)
├── vercel.json               ← cleanUrls + rewrites of the PRD routes to the stage pages
├── mission.html, collabs.html, confirmed.html, impressum.html, privacy.html
├── styles.css                ← shared brand tokens + base styles
├── script.js                 ← shared: nav, mobile menu, signup form POST
├── i18n.js                   ← shared EN/DE i18n (data-i18n hooks + pm:langchange)
├── api/
│   └── subscribe.js          ← Vercel serverless fn — adds email to Brevo list
├── derive.js                 ← PRD 7.6 derivations (pure functions, browser + node)
├── locale.js / locales/      ← flow strings (de.json source, en.json empty) + de-AT formatting
├── scripts/                  ← zero-dependency Node tools: copy-lint, validate-data, data-check, locales-sync, migrate-products, *.test.mjs
├── data/                     ← static JSON + schemas (see data/README.md)
│   ├── products.json         ← 22 products (PRD 7.2), scores null until sourced
│   ├── sdgs.json             ← 17 SDGs (PRD 7.4 / 8.3)
│   └── *.schema.json         ← products, glossary, sdgs, partners
├── docs/
│   ├── PRD.md                ← binding spec for the Guidance Flow update
│   └── PROGRESS.md           ← task log, open issues, typo fixes
├── brand/                    ← BRAND_GUIDELINES.md + logos / illustrations / reference
├── img/                      ← logo.png, logo_tree.png, leaf-single.png, mockups/ (June 2026, partly superseded)
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
- Vanilla HTML/CSS/JS only for the shipped site — no npm, no framework (Phase 1). (`scripts/*.mjs` are local Node maintenance tools, not part of the deployed site.) Dev tooling for PRD 10 checks: see conflict 15.
- Bilingual **EN/DE**. Landing pages: `i18n.js` (`data-i18n` / `-html` / `-ph` / `-aria` hooks + the `pm:langchange` event), brand slogans stay English, explanatory copy is translated. Guidance Flow pages and S0: `locales/de.json` (source, verbatim PRD copy) and `locales/en.json` (same keys, empty until EN content exists), loaded by `locale.js`; no copy in flow JS. Copy lint: `node scripts/copy-lint.mjs`; structure check: `node scripts/locales-sync.mjs --check`; tests: `node --test scripts/*.test.mjs`. See the `add-i18n` skill.
- Disclaimer: PRD 2.4 text and placement (see Regulatory Boundary).
- Displaying and sorting **specific named securities** by factual data / provider score is allowed (educational), when the user chooses the sort. Prohibited: personalized **buy/sell/hold** recommendations for a specific security. No recommendation field exists in the data, by design.
- Anonymous flow: no login, no account, no payment in Phase 1.
- Buttons always pill-shaped (`border-radius: 999px`); cards `20px`.
- No emojis anywhere in the UI.

## Data Layer — current state
- `data/products.json` (PRD 7.2, schema `products.schema.json`): 22 migrated products; type `etf | stock | bond`, `ter` as decimal, per-score objects `{ value, source, method, asOf }` or `null`. Scores, `sri`, `holdingsCount`, `exclusions`, `kidUrl` are still null → `node scripts/data-check.mjs` lists them; `--strict` is the launch gate.
- `data/sdgs.json` (PRD 7.4, schema): the 17 SDGs, German texts verbatim from 8.3. `data/glossary.schema.json` and `data/partners.schema.json` exist; the data files come with task 08 (glossary) and never for partners (S11 out of scope).
- Validation: `node scripts/validate-data.mjs` (zero-dependency validator for the schema subset used). Derivations of PRD 7.6 live in `derive.js` (`window.pmDerive`, also `require`-able), tested in `scripts/derive.test.mjs`.
- Numeric snapshot fields are **approximate until verified against KID and factsheet** (see `data/README.md`). Never add an own score; the data check fails on it.

## Tooling for Claude Code (this repo)
- **`brand/BRAND_GUIDELINES.md`** — authoritative brand voice + visual system. Read before producing copy or UI.
- **`.claude/skills/`** — `add-i18n`, `brand-ui`, `bump-cache`, `new-page` (project workflows).
- **`.claude/agents/`** — `compliance-checker`, `brand-auditor`, `securities-data-validator` (read-only review agents; they load at session start, so restart Claude Code after adding/editing them). Updated to the PRD rules in task 02; the data validator targets the interim `securities.json` until the task 05 schemas exist.

## Out of Scope for Phase 1
Academy · Community Forum · AI Chat · Native App · Broker API sync · Robo auto-invest (requires license) · Login, account, payment · Live prices, live ESG API, portfolio tracker, shop · Automated depot opening or order transfer · English content (structure yes, texts later)

## Phase 2 Tech Stack (reference only)
Next.js · Tailwind CSS · Supabase · Stripe · Vercel · Anthropic Claude API

## Decisions
<!-- One line per decision, date first. Move items here from "Open PRD conflicts" once Katharina decides. -->
- 10.09.2026: The existing prototype is updated, the vanilla stack is kept. Archetypes and any answer to portfolio logic are removed (PRD 2.4).
- 10.09.2026: Copy: typo fixes allowed and logged; wording and legal conflicts are flagged, not changed.
- 10.09.2026: S0 lives on `index.html`. The pre-registration landing keeps signup, calculator and mission; the hero carries the S0 elements (CTA "Los geht's", checkmarks, stage overview, resume banner). Session helper: `session.js` (`window.pmSession`, key `pm_session`).
- 10.09.2026: Conflict 1: Phase 1 stops at S10. S11 (Weg wählen, `/execute`) is out of scope; `checkout.*` removed, four stages in the progress bar (Quiz · Zusammenfassung · Explorer · Portfolio), `partners.json` not created.
- 10.09.2026: Conflict 16: option B, one HTML page per stage. `quiz.html` hosts S2 to S7 as internal steps, `summary.html` is S8, `explore.html` S9, `portfolio.html` S10. `vercel.json` (`cleanUrls` + rewrites) maps the PRD paths; `history.pushState` sets the PRD path per quiz step (task 06).
- 10.09.2026: Conflict 17: `product.html` stays for now, trimmed to public key facts (no chart, no own scores, no Four Capitals). Field migration `securities.json` → `products.json` in task 05 (see PROGRESS.md task 01 proposal for the field map).
- 10.09.2026: Conflict 19: Four Capitals stays a content idea only (landing "A new definition of growth" section, this file). Removed from data and code; never an evaluation of products.
- 10.09.2026: Conflict 18: repo token names stay (`--ink-soft` remains Forest, `--ink-mute`, `--bg-light`, `--bg-card` unchanged). PRD 5.6 tokens added alongside in `styles.css :root`: `--bg-warm`, `--ink-caption` (PRD "Ink Soft" #4A5C52), `--forest-deep`, `--sage-deep`, `--sage-soft`, `--cream-soft`, `--font-sans/serif/script` (aliases of `--ff*`). `--marigold` stays defined for the landing only, never in flow UI.
- 10.09.2026: Scope of PRD 5.6 surface rules (no shadows, gradients, #fff): flow pages only — quiz, summary, explore, portfolio, product (`body.flow-body`) and the S0 hero block. The pre-registration pages keep their current shadows and gradients (open issue O15).
- 10.09.2026: Conflict 14: Guidance Flow strings (incl. S0) live in `locales/de.json` (source) and `locales/en.json` (identical keys, empty values fall back to German; `scripts/locales-sync.mjs` keeps them in sync). `locale.js` loads them, reuses the `data-i18n*` hooks, offers `pmLocale.t / tn / fmtNumber / fmtCurrency / fmtPercent` (Intl, de-AT) and fires `pm:localeready`. The landing keeps `i18n.js` for its own copy. No copy in flow JS.
- 10.09.2026: Conflict 3: the product / weight word family (empfehlen, raten, solltest, passt zu dir, optimal, ideal für dich, für dich, passend) is linted on product related keys only (`explore.*`, `portfolio.*`, `summary.products.*`, `quiz.portfolio.*`). Deficit words, jargon, promises, guarantees, superlatives and sentence length apply to every key; legal disclaimer keys are exempt from the length rule.
- 10.09.2026: Conflict 15: option A, zero-dependency Node scripts and `node --test` (`scripts/*.test.mjs`). No npm, no package.json. E2E and accessibility audits are manual checks listed in PROGRESS.md.
- 12.09.2026: Conflict 2: per-score objects `{ value, source, method, asOf }` for `scores.sustainability`, `scores.gender` and each of the six radar axes (PRD 7.7). A score without a licensed provider is `null` and counts as a placeholder.
- 12.09.2026: Conflict 17 (rest): the 22 `securities.json` entries are migrated once by `scripts/migrate-products.mjs` into `data/products.json` (PRD 7.2 shape: `ter` as decimal, region re-keyed, `description_de`). Scores, `sri`, `sdgTags`, `exclusions`, `kidUrl` are null or empty until sourced and are listed by `scripts/data-check.mjs`. The three open-ended funds become `type: "etf"` with a `notes` field saying they are not exchange traded. `securities.json` is deleted.
- 12.09.2026: Conflict 9: `referrer` (optional string, anonymous session id from `?ref=`) is added to the 7.1 schema; `schemaVersion` stays 1.
- 12.09.2026: Conflict 11: all 51 terms of PRD 8.1 go into `glossary.json`; A.3's 48 is a minimum.
- 12.09.2026: Conflict 4: the Menopause card ships without the internal note "Euroraum-Zahl: noch offen"; the missing Euro-area figure is an open issue.
- 12.09.2026: Conflict 6: figures from 8.2 win (part time 27,8 %), S2 headline uses 105 Billionen Dollar (Oxfam 2020) with the source tooltip, share text says 15 Minuten.
- 12.09.2026: Conflict 5: the English lines on S8 stay English taglines with spelling fixed ("I AM READY.", "Now let's go build it yourself.", "No shame in not knowing."), logged as typo fixes.
- 12.09.2026: Conflict 10: SDG tile tokens `sdg-01` … `sdg-17` are built only from `--sage`, `--sage-soft`, `--cream`, `--cream-soft`, `--bg-warm`; Ink text on every tile. No Peach Soft.
- 12.09.2026: Task 13: Explorer and Portfolio are built on the migrated `products.json` with placeholders; missing scores render as "Keine Einstufung vorhanden" with no provider line.
- 12.09.2026: Conflict 7: S10 default amount = range edges: bis 50 € → 50, 50–150 € → 100, 150–300 € → 225, über 300 € → 300, "Sage ich später" → empty. Constants in `derive.js`.
- 12.09.2026: Conflict 8: PDF client-side with a vendored single-file library, lazy loaded. Email via a serverless stub in `api/` that answers "not configured" until the Brevo transactional template id and newsletter list id exist.
- 12.09.2026: Conflict 12: `track()` uses a no-op transport (in-memory buffer, console in dev). Plausible or Matomo is wired later without changing call sites.

## Open PRD conflicts (ask before touching)
1. Decided 10.09.2026 (S11 out of scope), see Decisions. Still open: no S1 exists; section 4 says twelve screens, eleven are listed. Quiz has 6 sub steps (5.1) but S4 has two views.
2. Score shape: 7.2 flat `scores` plus `scoreSource` vs 7.7 per score `{ value, source, method, asOf }` plus a ScoreProvider adapter "ManualEET". Source of the six radar axes unclear.
3. Decided 10.09.2026 (product related keys only), see Decisions. Still open: "fehlt" in the Teilzeit card (8.2) is shipped verbatim under a per-key lint exemption (`KEY_EXEMPT` in `scripts/copy-lint.mjs`, task 09); a wording decision would remove the exemption.
4. Menopause card (8.2) contains the internal note "Euroraum-Zahl: noch offen". Must not ship.
5. English lines in German UI: S8 "I AM READY.", "Now Let´s go build it yourslef", "No shame in not knowing"; S11 "Set it and forget it", "Minimal mental load". PRD 2.3: product copy German, taglines English.
6. Figures: part time 27,9 % (S3) vs 27,8 % (8.2); share text "10 Minuten" vs 15; S2 headline figure 105 Bio. $ (Oxfam) or 100.000 € not chosen.
7. S10: "Mitte der Range" undefined for "bis 50 €" and "über 300 €". PDF cover "dein Satz aus S3" has no source in S3.
8. PDF client or server side (PRD 11). Server side in `api/` likely needs an npm package; client side needs a vendored library. Brevo transactional template and the newsletter list ID are not defined.
9. Referral `ref` is stored as `referrer` (S8) but missing in the 7.1 schema.
10. SDG tile tokens (S7) derive from "Peach Soft", which is not in the 5.6 palette.
11. Glossary: A.3 says 48 required terms, 8.1 lists 51.
12. Analytics tool not chosen (Plausible or Matomo, EU self hosted).
13. Legal review, do not edit: S4b "wäre am Konto gut aufgehoben", S8 "Genau hier lohnt sich Vermögensaufbau am Meisten".
14. Decided 10.09.2026 (`locales/*.json` + `locale.js`, `i18n.js` hooks kept), see Decisions.
15. Decided 10.09.2026 (option A, zero dependencies), see Decisions.
16. Decided 10.09.2026 (option B, one page per stage), see Decisions.
17. Partly decided 10.09.2026 (`product.html` stays for now), see Decisions. Still open: which `securities.json` fields move into `products.json` and the `Fund` type (PRD knows etf, stock, bond).
18. Decided 10.09.2026 (repo names kept, PRD tokens added), see Decisions.
19. Decided 10.09.2026 (content idea only, removed from data and code), see Decisions.
