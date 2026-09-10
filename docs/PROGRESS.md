# PROGRESS — Guidance Flow update

Branch: `feature/quiz-product-update` (from `develop`, which mirrors `main` as of 10.09.2026).
Spec: `docs/PRD.md` (PRD of 09.09.2026).

## Task 01 · Audit (10.09.2026)

Scope audited: PRD 3, 4, 5, 7 and the "Superseded" list in CLAUDE.md, against every tracked file. No code changed.

Status legend: **keep** = meets the PRD as is · **change** = exists, must be reworked · **missing** = nothing usable exists · **remove** = superseded, delete.

### Screens S0 to S11

| ID | Route | Status | Today in repo | Gap to PRD |
|---|---|---|---|---|
| S0 | `/` | change | `index.html` is the pre-registration landing (signup form, calculator, Mission). | No "Los geht's" CTA creating `pm_session`, no resume banner, no five-stage overview, no three checkmarks, no Caveat script line. Landing step copy `step2.*` ("Find your archetype") and `step3.desc` ("ranked by … score") encode superseded rules. Decide whether S0 replaces the prereg landing or is a section of it (O2). |
| S2 | `/quiz/traps` | missing | No flashcards anywhere. | Eight cards (8.2), flip, counter, headline figure with source tooltip, `traps.viewed`. |
| S3 | `/quiz/phase` | missing | `quiz.js` screen `c4` asks knowledge level, not life phase. | Eight phase cards, max 2, feedback card, `phase.selected`. |
| S4 | `/quiz/situation` | change | `quiz.js` `b2` asks horizon with enums `5_10 / 10_plus / pension / unklar`. Screen engine (`SCREENS`, `render`, `mount`, `updateProgress`) is reusable. | 4a amount view missing entirely; 4b enums differ (`under_3y / 3_10y / over_10y / open`); no InfoNote; `b2` options carry `risk` weights that must go. |
| S5 | `/quiz/portfolio` | change | `pieSVG(alloc)` in `quiz.js` draws asset-class pies for archetypes. | Three fixed example donuts with non-removable label "Beispiel, keine Empfehlung", three building-block accordion cards, spectrum text; no state beyond `viewed`. |
| S6 | `/quiz/impact` | missing | Only the `a1` intro sentence touches the theme. | Full-text screen, two flip cards, `impact.viewed`. |
| S7 | `/quiz/values` | change | `quiz.js` `a2` SDG multi-select from `SDG_GROUPS` (13 values, grouped by `a1`, SDG 14/15 merged, unlimited, skippable). | 17 tiles + info tile from `data/sdgs.json`, min 1 max 5, product counter, hover examples (8.3), muted `sdg-01…17` tokens. |
| S8 | `/summary` | change | `mirror_a` + `result` screens in `quiz.js`; result renders an archetype, model pie, share of the archetype. | Two-column mirror of state, "Das weißt du jetzt", glossary intro InfoNote, share card 1080×1350 / 1080×1920 with `?ref=`, no archetype, no allocation. |
| S9 | `/explore` | change | `explore.html/js/css`: type + theme filters, search, sort (default `impact`), cards with 6-axis radar from Four Capitals, basket by id list (no weights, "built" at 5 items), links to `product.html`. | Default sort name A–Z; SDG chips preselected from S7; score sliders 0–10; region filter; card fields TER/SRI/positions/provider+asOf; product drawer instead of page; weights in 5 % steps summing to 100 %; descriptive mix feedback; mobile bottom sheet. |
| S10 | `/portfolio` | change | `portfolio.html/js/css`: donut by item count, average scores, archetype badge, static next steps. | Weighted scores Σ(w×s)/100, SDG coverage, monthly amount split (whole euros, remainder to largest), PDF "Mein Portfolio-Plan", e-mail via Brevo template, newsletter opt-in unticked, InfoNote "Du entscheidest. Wir begleiten." |
| S11 | `/execute` | change | `checkout.html/js/css`: 3 brokers + 3 advisors hard-coded with dot ratings (cost/ease/avail), no links. | `data/partners.json`, alphabetical order (today Trade Republic, Scalable, flatex), comparison fields with asOf, "Werbung" label at each link, `rel="sponsored noopener"`, tracked links, toast after click, Caveat line. Route rename `checkout` → `execute`. |

Progress bar, glossary, disclaimer and session state apply to every screen; see components.

### Global components 5.1 to 5.6

| ID | Component | Status | Today in repo | Gap to PRD |
|---|---|---|---|---|
| 5.1 | ProgressBar | change | `flowsteps` in `quiz.js`, `explore.js`, `portfolio.js`, `checkout.js` + CSS in each page: five static labels (Quiz · Typ · Entdecken · Portfolio · Checkout), not clickable, no sub-progress. | Stage names Quiz · Zusammenfassung · Explorer · Portfolio · Weg wählen; sub-fill (Quiz 6 steps); reached stages clickable; keyboard reachable; one shared implementation. |
| 5.2 | GlossaryTerm | missing | No glossary data, no popover, no auto marker. | `data/glossary.json` (8.1, ≥ 48 terms), popover with fixed content order, hover/focus/tap, aria-describedby, dev warning on missing id, `glossary_open` event. |
| 5.3 | Disclaimer + InfoNote | change | Disclaimer present on quiz result, explore, product, portfolio, checkout, but with the superseded text ("This is not investment advice…" / "Dies ist keine Anlageberatung…"). No InfoNote component. | PRD 2.4 text, footer from S5 on, 12 px, visible without scroll; InfoNote with three variants, cream, no border, tilt only "Gut zu wissen", max two per screen. |
| 5.4 | Session state | change | Four keys: `pm_quiz_answers`, `pm_archetype`, `pm_basket`, `pm_lang`. No version, no expiry, no resume. | Single `pm_session` (7.1) with `schemaVersion`, saved on every input, 30-day expiry, resume/restart on S0, back navigation never mutates. |
| 5.5 | i18n | change | `i18n.js` (shared, EN + DE filled) plus per-page `*_I18N` / `T` blocks in quiz, explore, product, portfolio, checkout with filled EN. Number formatting by string replace of "." with ",". | `locales/de.json` source, `en.json` same structure and empty; screen-named keys; `Intl` formatting `de-AT`; `_de/_en` fields in data. Decision: conflict 14. |
| 5.6 | Visual language | change | `styles.css :root` has `--bg`, `--bg-light`, `--ink`, `--forest`, `--sage`, `--cream`, `--yellow`. | Missing tokens `--forest-deep`, `--sage-deep`, `--sage-soft`, `--cream-soft`, `--bg-warm` (exists as `--bg-light`), `--font-*` names (repo uses `--ff*`). `--ink-soft` is Forest, PRD says `#4A5C52` (conflict 18). `--shadow-sm/md/lg` exist and are used in styles, quiz, explore, product, portfolio CSS; PRD forbids shadows in the flow. Serif and script fonts carry Times New Roman / system fallbacks. Extra tokens `--marigold`, `--bg-dark`, `--ink-mute`, `--sage-brand`. |

### Remove list (superseded by PRD 09.09.2026)

Files
- `data/prices/*.json` (22 files) — price snapshots, PRD 7.7.
- `scripts/fetch-prices.mjs` — price tooling; also the "Price snapshots" section of `data/README.md`.
- `product.html`, `product.js`, `product.css` — price chart, Four Capitals, letter scores; drawer replaces the page (pending conflict 17).
- `features/portemonnaie_quiz_content.md` — superseded quiz spec (Block A/B/C, archetypes, risk scoring).
- `data/securities.mock.json` — fixtures built on A+/F and 0/100 edge cases; replace with fixtures for `products.json`.
- `data/securities.schema.json` — schema of the superseded shape; replace with schemas for products, glossary, sdgs, partners.
- `img/mockups/typ.png` — archetype screen mockup; unused by any page. (`quiz/explore/portfolio/execute.png` are also unused today.)
- `.claude/launch.json` — not superseded, but stale: points to a Mac path and ruby; harmless, optional cleanup.

Functions and constants
- `quiz.js`: `computeArchetype`, `ARCHETYPES`, `ARCH_ORDER`, `R` risk weights and every `risk:` / `cap:` on options, `jumpToResult`, `shareResult` (archetype share), archetype branch of `renderResult`, `CLASS_COLOR`, `SDG_GROUPS` (moves to `data/sdgs.json`), write of `pm_archetype`; screens `a1`, `b1`, `c1`, `c2`, `c3`, `c4` (no PRD counterpart).
- `explore.js`: `GENDER_NUM`, `IMPACT_NUM`, sort `impact` as default and the `sortImpact` option, `TARGET_SIZE` (5-item "built" ring), radar fed from `fourCapitals`, `THEME_LABELS` (SDG chips replace themes).
- `product.js`: `lineChartSVG`, `PRICES` loading, Four Capitals block, `GENDER_NUM`.
- `portfolio.js`: `loadArchetype`, `renderType`, `GENDER_NUM`, environmental average in `renderImpact`, `TYPE_ORDER` with `Fund`.
- `checkout.js`: `BROKERS`, `ADVISORS`, `dots()` rating rows (replace by `partners.json` fields).
- `quiz.html`, `explore.html`, `portfolio.html`, `checkout.html`: nav tab "Type" (`quiz.html#result`).

Data fields (in `data/securities.json`, until migration per conflict 17)
- `genderScore` (A+ … F), `sustainabilityScore` (0–100), `impact` (High/Medium/Low), `fourCapitals`, `facts.*`, `meta.scoringSystem`, `meta.disclaimer` (old text), `profile.exchange`, `profile.marketCap`, `profile.peRatio`, `profile.dividendYield`, `profile.indexTracked`, `profile.replication`, `profile.domicile`, `assetClass`, `sector`, `ticker`; type value `Fund`.

Strings
- "This is not investment advice. Content is for educational purposes only." and "Dies ist keine Anlageberatung. Die Inhalte dienen ausschließlich Bildungszwecken." in `quiz.js`, `explore.js`, `product.js`, `portfolio.js`, `checkout.js`, `data/securities.json` (meta), `.claude/agents/compliance-checker.md`, `.claude/skills/new-page/SKILL.md`.
- `i18n.js`: `nav.type`, `step2.title`, `step2.desc` (archetype), `step3.desc` ("ranked by a sustainability score and a gender score"); `flow.lede` "5 easy steps" describes the old flow. Landing copy `platform.lede` and `pill1` say "Robo Advisor" in user-facing text (copy lint: glossary only).
- Explore/portfolio labels "Impact", "Wirkung", "Sort: Impact", steps arrays `["Quiz","Type","Explore","Portfolio","Checkout"]`.

`.claude` agents, skills and specs encoding superseded rules
- `agents/securities-data-validator.md` — whole agent: A+ … F, 0–100, Four Capitals bounds, Impact tie-break, mock file. Rewrite for products/glossary/sdgs/partners schemas and the placeholder_ rule.
- `agents/compliance-checker.md` — old disclaimer text (line 19), "archetypes and categories" rule (line 25), no checks for the PRD 2.4 forbidden words, Werbung label, provider + asOf on scores.
- `agents/brand-auditor.md` — "monochrome" in description and line 9, mockup fidelity for "quiz/archetype/explore/basket/execute" (line 60); no check for the no-shadow, one-yellow-underline, one-CTA rules.
- `skills/brand-ui/SKILL.md` — "monochrome" (line 13), token table with `--ink-soft = forest` and `--marigold`, "Shadows: --shadow-sm/md/lg" as allowed.
- `skills/new-page/SKILL.md` — `--marigold` in allowed tokens, "monochrome" (line 32), old disclaimer text (line 45).
- `skills/add-i18n/SKILL.md` — assumes all strings in `i18n.js` with filled EN; update after conflict 14.
- `features/portemonnaie_quiz_content.md` — see files.
- `CLAUDE.md` still lists "Investor Archetypes" only inside the Superseded block (fine); `data/README.md` line 3 calls the flow "Robo Advisor" and documents Money Tree-derived scores.

### Conflicts 14, 16, 17 — options, cost in this repo, proposal

**14 · i18n.** Option A, PRD literal: move every string to `locales/de.json` and an empty `en.json`, retire `i18n.js`. Cost: rewriting the 509-line `i18n.js` loader and re-hooking eight prereg pages that are live and already bilingual, plus a fetch before first paint on every page (LCP budget on S0). Option B: keep `i18n.js` and its `data-i18n` hooks for the prereg site; the Guidance Flow pages load `locales/de.json` (source) and `en.json` (same keys, empty, de fallback) through a small shared loader that reuses the same hooks and adds `t(key, params)` for the S8 templates. Cost: one loader of roughly 40 lines, migrating the five per-page `*_I18N` blocks (their EN copy is out of scope per PRD 3.2 anyway), and the copy lint can run on one JSON file. Option C: keep per-page JS blocks and only rename keys. Cost lowest, but verbatim copy, lint and the S8 placeholder templates all become harder to verify. Proposal: B.

**16 · Routes.** Option A, one HTML page per screen: eleven pages plus `vercel.json` with `cleanUrls` and rewrites for `/quiz/traps` … `/execute`. Cost: nine new pages via `new-page`, progress bar, glossary and state loaded on each, full page loads between quiz steps, and the local dev server must mirror the rewrites. Option B, one page per stage: `quiz.html` keeps its screen engine (S2 to S7 as internal steps), plus `summary.html`, `explore.html`, `portfolio.html`, `execute.html` (renamed from `checkout.html`); `vercel.json` rewrites the six `/quiz/*` paths to `quiz.html` and `history.pushState` sets the PRD path per step so back button, resume and the analytics `screen` field see PRD routes. Cost: two new pages, one rename, about 30 lines of routing in `quiz.js`, one `vercel.json` (no npm). Proposal: B. `vercel.json` is new to the repo; check the deploy once before relying on it.

**17 · Data.** Option A: write `products.json` fresh from KID, factsheet and EET for 30 to 60 products and delete `securities.json`. Cost: pure data work, no code, but S9 has nothing to render until the first 30 entries exist. Option B: a zero-dependency `scripts/migrate-products.mjs` maps the 22 entries once, then curation continues by hand. Field map: keep `id`, `isin`, `name`, `type` (three `Fund` entries need a decision: `etf` or drop), `region` (re-key to PRD enum), `currency`, `ter` (percent → decimal), `description` → `description_de` (today the text is English, so it must be rewritten in German), `profile.distribution` → `distribution`, `profile.inception` → `inceptionDate`, `profile.aum` → `fundSizeMeur` (parse "USD 0.2B"), `profile.topHoldings` → `topHoldings`, `themes` → `themes_de`. Fields with no source today: `provider`, `subtype`, `sri`, `holdingsCount`, `sdgTags`, `exclusions`, `kidUrl`, and both scores with `scoreSource`, which must be `null` or `placeholder_` until a licensed provider exists (PRD 7.7, never invent). Drop everything in the remove list above. Cost: about 100 lines, S9 works immediately, but 22 is below the PRD minimum of 30 and three entries lack an ISIN. On `product.html`: PRD S9 specifies a drawer, and the page's chart and Four Capitals are superseded, so keeping it means maintaining two renderers. Proposal: B, then build the drawer in `explore.js` from the same render function, delete `product.*`, and support `/explore?product=<id>` so existing deep links open the drawer. Score object shape (flat vs `{value, source, method, asOf}`) stays with conflict 2; the migration script can emit either.

## Task 02 · S0 entry on index.html (10.09.2026)

Decision: `index.html` stays the pre-registration landing and becomes the flow entry (O2 resolved, see CLAUDE.md Decisions).

Done
- `index.html`: hero signup form replaced by the S0 block: primary CTA "Los geht's" (`#s0Start` → `quiz.html`), three checkmarks, collapsible five-stage overview, resume banner (`#s0Resume`, hidden until a valid session exists). Subline is the PRD S0 subline. Headline, calculator, mission and the lower signup section are unchanged.
- `session.js` (new, shared): `window.pmSession` with `read / write / create / reset / isValid / stageOf`; creates `pm_session` per PRD 7.1 with `schemaVersion: 1`; valid = current schema and `startedAt` within 30 days; S0 wiring for start, continue and restart with the confirm text from the PRD. Route → page map is provisional (conflict 16).
- `i18n.js`: `s0.*` keys EN/DE, new `PMI18n.t(key)`; `styles.css`: `.s0*` rules, tokens with fallbacks for `--forest-deep`, `--sage-deep`, `--sage-soft` (conflict 18). Cache bumped: `styles.css?v=25`, `i18n.js?v=33` on the seven landing-site pages.

Verification (PRD S0 Akzeptanz)
- Resume banner only with `schemaVersion` = 1 and within 30 days: pass (logic), no browser run yet.
- CTA first focusable element after the logo: fail. The nav links (Intro, Library, Sign Up, EN/DE) sit between logo and CTA in DOM order (O6).
- LCP < 2 s: not measured (O7).
- `node --check` on `session.js` and `i18n.js`: pass.

Copy typo fixes
- S0 subline: "Kein Jargon" → "kein Jargon" (capitalisation mid-sentence).

### Open issues (appended by task)

- O1 · Resolved 10.09.2026: `PRD.md` moved from repo root to `docs/PRD.md`.
- O2 · Resolved 10.09.2026: landing keeps signup, calculator and mission; S0 elements added to the hero (task 02). Headline stays "Start investing in what you support." rather than the PRD tagline; revisit if the tagline should lead.
- O6 · S0 acceptance "CTA first focusable after logo" cannot be met while the nav links precede the hero. Options: move the language toggle and links after the hero in DOM order, or accept the nav as part of the header.
- O7 · LCP and the resume/restart flow are untested in a browser; run once the quiz page exists at the PRD route.
- O8 · `?ref=` referral on S0 (PRD S8) not stored: `referrer` is missing from the 7.1 schema (conflict 9).
- O9 · "Weitermachen" for `/summary` points to `quiz.html` because no summary page exists yet; fix with conflict 16.
- O10 · The PRD gives no label for the collapsible stage overview; "Die fünf Etappen" / "The five stages" used.
- O3 · `explore.js` radar uses 6 axes from Four Capitals + own scores; PRD radar axes (climate, social, governance, gender, biodiversity, transparency) have no data source (conflict 2, 19).
- O4 · Shadows: `--shadow-*` tokens are used by the prereg site too; the no-shadow rule applies to the flow screens, keep the tokens for the landing unless the brand doc says otherwise.
- O5 · Landing copy `platform.lede` / `pill1` use "Robo Advisor" in user-facing text on the live site; outside this task's scope but violates the copy lint.

### Copy typo fixes

None (no copy touched in task 01).
