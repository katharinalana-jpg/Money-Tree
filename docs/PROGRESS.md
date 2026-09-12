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

## Task 02 · Cleanup and routes (10.09.2026)

Decisions taken first (CLAUDE.md Decisions): conflict 1 S11 out of scope · 16 option B one page per stage · 17 product.html stays trimmed · 19 Four Capitals content idea only.

Removed
- Files: `data/prices/` (22), `scripts/fetch-prices.mjs`, `checkout.html/js/css` (S11), `features/portemonnaie_quiz_content.md`, `data/securities.mock.json`, `data/securities.schema.json`, `img/mockups/typ.png`, `.claude/launch.json`.
- `quiz.js` rewritten: engine kept; archetypes, risk weights, `computeArchetype`, `jumpToResult`, share, pie, curves, nudge, screens a1/b1/c1–c4 and `SDG_GROUPS` removed. Interim screens: values (17 SDGs from `data/sdgs.json`, max 5), mirror, horizon (PRD S4b enums), saved-result. Answers persist into `pm_session` (`values.sdgs`, `situation.horizon`).
- `explore.js` rewritten: own scores, impact sort, theme filter, radar, 5-item ring removed; default sort name A–Z, second sort cost; product links kept (conflict 17). `explore.html`: impact panel and "Type" tab removed.
- `portfolio.js` rewritten: archetype badge, score averages, checkout hand-off removed. `portfolio.html`: impact column, type badge, checkout button removed.
- `product.js` rewritten: price chart, prices fetch, Four Capitals, score tiles, facts block, removed profile fields gone; key facts from public documents only.
- `data/securities.json`: fields `ticker`, `assetClass`, `sector`, `genderScore`, `sustainabilityScore`, `impact`, `fourCapitals`, `facts`, `meta.scoringSystem` and `profile.{replication,domicile,indexTracked,exchange,marketCap,peRatio,dividendYield}` removed; `meta.disclaimer` = PRD 2.4 text. `data/README.md` rewritten.
- `i18n.js`: `nav.type`, orphaned landing flow keys (`flow.eyebrow/h2/lede`, `step1–5.*`, `quiz.q1–4`, `pie.*`, `search.ph`, `basket.*`, `exec.*`), `s0.stage5` removed; "Robo Advisor" wording in `platform.lede` / `pill1` replaced by "guided investment flow" / "geführter Anlageprozess".
- Old disclaimer string replaced by the PRD 2.4 text (DE, EN equivalent) in quiz, explore, portfolio, product, `securities.json`, `compliance-checker`, `new-page`.
- CSS: archetype block, curves, nudge (`quiz.css`); score rows, radar, impact bars (`explore.css`); impact card, type badge, right column (`portfolio.css`); chart, capitals, score tiles, facts lists (`product.css`); the dead landing "five steps" section with its hover mock-ups and archetype pie (`styles.css`, FLOW, STEP INTERACTIVE HOVER, RESPONSIVE STEP HOVER and the warm-bg overrides, about 370 lines; no page uses `.step`).
- `.claude`: `compliance-checker` (PRD 2.4 rules), `brand-auditor` (palette, PRD 5.6 flow rules, mockups marked superseded), `brand-ui` and `new-page` (palette, tokens, no shadows, PRD disclaimer). `securities-data-validator` rewritten for the interim dataset. `add-i18n` untouched (conflict 14 open).

Added
- `data/sdgs.json` (17 entries, PRD 7.4 shape; DE verbatim from 8.3, EN = UN titles; colour tokens named only).
- `summary.html` (S8, title only). `vercel.json` with `cleanUrls` and rewrites for `/quiz/:step`, `/summary`, `/explore`, `/portfolio`.
- Nav on flow pages: Quiz · Explore · Portfolio (Type tab gone). Progress strip on all flow pages: Quiz · Zusammenfassung · Explorer · Portfolio. `session.js` stages reduced to four, summary points to `summary.html`. S0 stage list on index reduced to four ("Die vier Etappen").
- Cache bumped on quiz, explore, portfolio, product pages (styles v25, i18n v33, script v8, page assets +1). `session.js?v=2`.

Verification
- `node --check` on all JS: pass. `JSON.parse` on `sdgs.json`, `securities.json`, `vercel.json`: pass.
- Grep for `archetype`, `GENDER_NUM`, `fourCapitals`, `data/prices`, `checkout.html`, `nav.type`, `pm_archetype`, the old disclaimer string and "Robo" in shipped HTML/JS/CSS/JSON: no hits except explanatory comments in `quiz.js` / `portfolio.js` headers and the calculator's own `calc.disclaimer` copy.
- Brace balance of all five stylesheets after pruning: balanced. Every element id used by quiz, explore and portfolio scripts exists in its page.
- Not run in a browser.

Copy typo fixes
- None. Interim quiz/explore/portfolio strings are placeholders, not PRD copy.

## Task 03 · Design tokens and fonts (10.09.2026)

Decisions taken first (CLAUDE.md Decisions): conflict 18 repo names kept, PRD tokens added alongside · surface rules apply to flow pages only.

Done
- `styles.css :root`: `--bg-warm`, `--ink-caption` (PRD Ink Soft), `--forest-deep`, `--sage-deep`, `--sage-soft`, `--cream-soft`, `--font-sans/serif/script` (aliases of `--ff*`). `--marigold` marked logo-only. The `.s0` fallbacks `var(--x, #hex)` removed.
- `styles.css`: new `body.flow-body` block — primary CTA Forest fill / `--bg` text / hover Forest Deep, secondary Forest outline / hover Sage Soft, focus 2 px Forest outline on every focusable element, min-height 44 px, no transform or shadow. Class set on quiz, summary, explore, portfolio, product.
- `quiz.css`: progress bar gradient → Forest; option hover/selected shadows → Sage Soft surface; check pip marigold → Forest; `#fff` → `--bg`.
- `explore.css`: local `--green*` become aliases of `--sage-deep` / `--sage-soft` / `--sage`; selected pill and add button on tokens; card hover shadow → Background Warm surface; the "Dein Portfolio" panel changes from a Forest full surface with white text to Background Warm with Ink text (PRD 5.6 and S9 layout); focus rule removed in favour of the shared one.
- `portfolio.css` and `product.css` rewritten on tokens: white card → `--bg-warm`, shadows gone, dead impact-bar and CTA rules gone, product type badge Sage Soft / Forest, page title Forest.
- `explore.js`, `portfolio.js`, `product.js`: type swatches and SVG strokes are `var(--token)` strings applied through inline `style`, so no hex remains in scripts.
- Cache bumped: `styles.css?v=26` on all twelve pages; quiz.css v9, explore.css v7, portfolio.css v4, product.css v3, explore.js v8, portfolio.js v4, product.js v7.

Verification
- Search for `#fff`, `#ffffff`, `white`, `box-shadow`, `gradient`, raw hex and `rgba(` in quiz.css, explore.css, portfolio.css, product.css and the flow scripts: no hits except `white-space` and header comments. Allowed exception: the select arrow data URI in `explore.css` (`%235A6B61`, the `--ink-mute` value; data URIs cannot use `var()`).
- `styles.css` `.s0` and `.flow-body` blocks: only `box-shadow: none` resets. The rest of `styles.css` and `calculator.css` still contain shadows and gradients by the scope decision (O15).
- Token values in `:root` match PRD 5.6. Brace balance of all five stylesheets after the edits: balanced. `node --check` on flow scripts: pass.
- brand-auditor on the changed files: PASS, no BLOCKER / WARNING / NIT. It confirmed tokens-only colour in the flow files, the documented data-URI exception, the CTA / focus rules, no Yellow or Marigold in flow UI, the `:root` values, the inline-style SVG strokes, and no emojis. Side note from the audit: the global `.btn--primary:hover` in `styles.css` still carries a raw hex and a shadow for the landing; `.flow-body` overrides it on flow pages (covered by O15).
- Not run in a browser.

Copy typo fixes
- None.

## Task 04 · i18n and copy lint (10.09.2026)

Decisions taken first (CLAUDE.md Decisions): conflict 14 `locales/*.json` + `locale.js`, `i18n.js` hooks kept · conflict 3 product family on product keys only · conflict 15 zero-dependency Node scripts and `node --test`.

Done
- `locales/de.json` (German source, 106 keys, screen-based dotted keys: `common.*`, `s0.*`, `quiz.*`, `explore.*`, `portfolio.*`, `product.*`) and `locales/en.json` (identical structure, all values empty → German fallback). `scripts/locales-sync.mjs` regenerates en.json and has a `--check` mode.
- `locale.js` (shared loader): fetches de.json plus the active language, reuses the `data-i18n / -html / -ph / -aria` hooks after `i18n.js`, `t(key, params)` with `{name}` placeholders, `tn(key, n)` plural (`_one` / `_other`), `fmtNumber` / `fmtCurrency` / `fmtPercent` via `Intl.NumberFormat("de-AT")` (`1.500,00 €`, `0,20 %`), reloads on `pm:langchange` and fires `pm:localeready`. Missing key → console warning, key shown.
- `quiz.js`, `explore.js`, `portfolio.js`, `product.js`, `session.js`: all inline EN/DE dictionaries removed; copy by key only; TER and percentages through `fmtPercent`; pages render after `pmLocale.ready`. S0 keys moved from `i18n.js` to `locales/de.json` (`index.html` loads `locale.js`).
- `scripts/copy-lint.mjs` (zero dependencies, exported `lint()` + CLI, exit 1 on findings): deficit words, jargon (Robo-Advisor outside `glossary.*`), guarantees (negated "keine Garantie" allowed), return promises, superlatives, product family on product keys, sentence length 15 / 20 (`quiz.impact.*`, `glossary.*`) with disclaimer keys exempt. `scripts/copy-lint.test.mjs` with fixtures `scripts/fixtures/copy-lint.pass.json` and `copy-lint.fail.json`.
- Cache: `i18n.js?v=34` on all pages, `locale.js?v=1`, `session.js?v=3`, quiz.js v7, explore.js v9, portfolio.js v5, product.js v8.

Verification
- `node scripts/copy-lint.mjs` on `locales/de.json`: 0 findings, exit 0. On the fail fixture: 9 findings (every rule at least once), exit 1.
- `node --test scripts/*.test.mjs`: 5 tests, 5 pass.
- `node scripts/locales-sync.mjs --check`: in sync. Every literal key used in the flow scripts exists in de.json (dynamic keys checked by prefix).
- `node --check` on all scripts: pass. Not run in a browser.

Copy typo fixes
- None (interim strings moved verbatim).

## Task 05 · Data layer (12.09.2026)

Decisions taken first (CLAUDE.md Decisions): conflict 2 per-score objects · conflict 17 migrate 22, scores null, funds as `etf` with note · partners.json not created (S11 out of scope), schema only.

Done
- Schemas: `data/products.schema.json` (PRD 7.2 + `fundSizeCurrency`, `notes`; region enum extended by `us`, see O17), `glossary.schema.json`, `sdgs.schema.json`, `partners.schema.json`.
- `scripts/validate-data.mjs`: zero-dependency validator for the schema subset used (types, required, enum, pattern, ranges, items, additionalProperties, `$ref`, duplicate ids); CLI validates every `data/<name>.json` with a schema. `scripts/validate-data.test.mjs` covers the live files, seven error classes and a valid score object.
- `scripts/migrate-products.mjs` ran once: 22 products in `data/products.json`; `securities.json` deleted. German two-sentence descriptions written for all 22 (translations of the former English texts, no judgements); `sdgTags` derived from stated themes (verify against EET); provider from the fund name; subtype `equity_world` for the two broad ETFs, otherwise `equity_theme` / `single_stock`.
- `scripts/data-check.mjs`: lists placeholders and unsourced fields per product; exit 1 on any own-score field; `--strict` as launch gate.
- `derive.js` (PRD 7.6): `portfolioScore`, `typeShare`, `mixLabel` (constants 10 / 30), `splitAmount` (whole euros, remainder to the largest weight), `sdgCoverage`, `weightsComplete`, `evenWeights` (5 % steps), `defaultAmount` (range edges). `scripts/derive.test.mjs` with 6 tests.
- Pages on the PRD shape: `explore.js`, `portfolio.js` (types `etf / stock / bond`, `ter` decimal, `description_de`), `product.js` key facts (provider, TER, SRI from KID, fund size, holdings, distribution, inception) plus a scores block that shows "Keine Einstufung vorhanden." until a provider score exists and otherwise provider + asOf. Locale keys added; en.json synced.
- `data/README.md` rewritten; CLAUDE.md data layer and folder structure; `securities-data-validator` agent pointed at the new files and tools.

Verification
- `node scripts/validate-data.mjs`: products.json valid, sdgs.json valid.
- `node scripts/data-check.mjs`: 22 products, 22 with gaps (scores, SRI, holdings, KID link everywhere; ISIN missing on 3; sdgTags empty on 5), no own-score field.
- `node --test scripts/*.test.mjs`: 14 tests, 14 pass. Copy lint 0 findings, en.json in sync, `node --check` pass. Not run in a browser.

Copy typo fixes
- None.

## Task 06 · Session state, progress bar, tracking (12.09.2026)

Decision taken first: conflict 9, `referrer` added to the 7.1 schema.

Done
- `session.js` rewritten as a factory (`createSession({ storage, now })`, `window.pmSession` in the browser): `create` (schema 7.1 incl. `referrer`), `current` (valid only: `schemaVersion` = 1 and `startedAt` within 30 days), `update` (deep merge, saved immediately = every input), `setScreen`, explicit `reset`, `pageFor / stageOf / quizStepIndex / reachedIndex`, `onChange`. S0 wiring: start creates a fresh session (`session_start`), continue resumes to `lastScreen` (`session_resume`), restart confirms and resets (`session_reset`); `?ref=` is stored as `referrer` and fires `referral_landing`.
- `track.js` (`createTracker`, `window.pmTrack`): PRD 9 event names with per-event payload whitelist; every event carries an FNV-1a hash of the session id, screen, locale, timestamp; e-mail-shaped values and unknown keys are dropped, strings capped at 64 chars; no-op buffer transport, `setTransport(fn)` for Plausible or Matomo later; console output only on localhost or `pm_debug=1`.
- `progress.js` (PRD 5.1): shared ProgressBar on quiz, summary, explore, portfolio, product (`<nav id="pmProgress" data-stage>`); four stages, active highlighted, sub fill (quiz 6 sub steps), reached stages are buttons that navigate back, unreached disabled; re-renders on locale change and on every session write without reload; keyboard reachable (native buttons). Old `flowsteps` strips and the quiz-only bar removed from markup, CSS and scripts.
- `quiz.js`: every answer persists into `pm_session` at once; screen route per sub step via `history.replaceState` (PRD path on clean URLs, hash on plain files) with `screen_view`; `situation_answered`, `values_selected` events; resume lands on the last quiz screen; back only moves the index.
- `explore.js` / `portfolio.js`: `pm_basket` gone; the portfolio is `pm_session.portfolio.items [{ productId, weight }]` with even 5 % weights from `derive.js` until task 14; portfolio page renders shares by weight; events `explore_filter_change`, `product_open`, `product_add`, `product_remove`, `screen_view`.
- Locale keys `progress.*`; en.json synced; `styles.css` ProgressBar rules (tokens only); cache bumps (`styles.css?v=27`, `session.js?v=4`, quiz.js v8, explore.js v11, portfolio.js v7, explore.css v8, quiz.css v10, `track.js`, `derive.js`, `progress.js` v1).

Verification
- `node --test scripts/*.test.mjs`: 24 tests, 24 pass — incl. session expiry (valid on day 30, discarded after), schema mismatch (invalid and replaced on create), back navigation keeps values, explicit reset, reached index; tracker event whitelist, hashed session id, payload hygiene, transport swap.
- PRD 5.1 acceptance: bar present on all flow pages (markup check), updates without reload (session `onChange`), keyboard reachable (buttons). Not run in a browser.
- Copy lint 0 findings, en.json in sync, `node --check` pass, no `pm_basket` / `flowsteps` left in shipped code.

Copy typo fixes
- None.

## Task 07 · Glossary popover, InfoNote, disclaimer (12.09.2026)

Done
- `glossary.js` (PRD 5.2): pure core (`createIndex`, `segment`) exported for node; browser `pmGlossary.init({ url })`, `mark(root)`, `reset()`. Auto marker on text nodes (first occurrence per screen, aliases, longest match first, umlaut-safe boundaries, case-insensitive), manual `<span data-term>` markers win; term rendered as `<button class="pm-term" aria-describedby aria-expanded>` with a hidden per-term description for screen readers; one shared popover (`role="dialog"`, cream, 1 px Sage Soft border, no shadow, no icon, no scroll) with term · definition · "Warum wichtig?:" · optional "Beispiel:"; hover 150 ms, focus, tap toggle, Enter, Esc and tap outside close; missing entry stays plain text and logs a dev warning; `glossary_open {term_id, screen}`.
- `flow-ui.js` (PRD 5.3): `pmInfoNote.html(variant, body)` with the three fixed labels from the locale (`note.know`, `note.example`, `note.stance`), tilt only for "Gut zu wissen", `check()` warns above two cream cards; `pmDisclaimer` fills `<footer id="pmDisclaimer">` with the PRD 2.4 text, 12 px, sticky at the bottom (visible without scrolling). Footer on quiz, summary, explore, portfolio, product; the per-page disclaimer paragraphs are gone.
- `styles.css`: `.pm-term`, `.pm-popover`, `.pm-note*`, `.pm-disclaimer` (tokens only, no shadows). Pages call the glossary marker after every render. Fixture `scripts/fixtures/glossary.3.json` (validates against `glossary.schema.json`); `scripts/glossary.test.mjs` (5 tests).
- Fix found in the browser run: a lost `$` in `explore.js` (`$$("#cards [data-open]")`) had broken the card list after task 06; corrected, `explore.js?v=13`.

Verification
- `node --test scripts/*.test.mjs`: 29 tests, 29 pass (marker: first occurrence, aliases, boundaries, missing entry, 20-word limit; fixture schema-valid).
- Browser (Playwright, local server, glossary loaded from the 3-entry fixture on explore.html): term marked once ("ETFs" → etf), `aria-describedby` target exists with "ETF: Ein ETF bündelt …", focus opens the popover (`aria-expanded="true"`), Esc closes and returns focus, tap toggles, a manual marker for an unknown id stays plain and warns. Disclaimer footer at 12 px on every flow page.
- Browser regression of tasks 05/06: Explorer lists 22 products sorted name A–Z, add writes `portfolio.items` with weight 100, events `screen_view`, `product_add`; Portfolio page shows composition by weight and the ProgressBar with the active stage disabled and earlier stages clickable; Quiz shows "Schritt 3 von 6" / 50 % fill, an answer persists `situation.horizon` and moves to the 17 SDG tiles at `#values`, "Schritt 6 von 6".

Copy typo fixes
- None.

## Task 08 · Glossary content (12.09.2026)

Decision taken first: conflict 11, all 51 terms of PRD 8.1.

Done
- `data/glossary.json`: 56 entries, sorted by id — all 51 terms of 8.1 plus five from the screen copy of PRD 6: `care-arbeit`, `einmalanlage`, `emittent`, `kaufkraft`, `ordergebuehr`. Austrian German, "du", one sentence each for definition (≤ 20 words), "Warum wichtig" and example with a € or % figure; return figures only as "Annahme, keine Garantie" and ≤ 5 %; "Robo-Advisor" introduces "geführter Anlageprozess"; scores name the data provider and asOf pattern. English fields empty (PRD A.2).
- `scripts/lint-glossary.mjs` (PRD A.1 b): reuses the copy lint and the glossary schema; adds word count, one-sentence, number-and-unit, A.1 extra words (einfach, !, sicher, ideal, optimal, empfehlen, raten, passt zu dir), relatedIds exist, ids unique, 8.1 coverage; prints the id · word count · status table; `--review` writes `docs/glossary-review.md` (A.1 d) with the five sample entries first.
- Copy lint refined: "ohne Garantie" counts as a negated guarantee; a return figure is allowed only with "Annahme" and "keine/ohne Garantie" in the same string. Glossary unit rule accepts "x von 10" / "x von 7" scales for score and risk-class examples.
- The flow pages already load `data/glossary.json`; terms now render as popovers.

Verification
- `node scripts/lint-glossary.mjs`: schema 0 errors, 56 terms, 0 findings. `node scripts/validate-data.mjs`: glossary, products, sdgs valid. `node --test`: 29 pass. Copy lint on locales: 0.
- Browser (quiz.html, real glossary): 56 entries loaded, "Portfolio" in the mirror body rendered once as a term, focus opens the popover with the definition, `glossary_open {term_id: "portfolio", screen: "/quiz/values"}` recorded.

Process note
- The A.1 gate "first 5 entries, wait for approval" was skipped on the instruction to work through the tasks unattended; the review file lists the five samples first. Katharina's content review and the legal review (A.2) remain open (O20).

Copy typo fixes
- None.

## Task 09 · Screens S0, S2, S3 (12.09.2026)

Decisions taken first: conflict 4 (Menopause note dropped), conflict 6 (8.2 figures, 105 Bio. $, 15 Minuten). S0 was built in task 01b (index.html); unchanged here.

Done
- `quiz.js`: S2 `/quiz/traps` — headline with the figure as a tooltip button (source "Oxfam, Time to Care, 2020", also as visible caption), counter "{n} von 8 angesehen", 4 × 2 grid (2 × 4 on mobile), 3D flip 400 ms (fade with `prefers-reduced-motion`), front Cream with line icon and title, back Background Warm with the first sentence as serif quote (16 px), text 14 px, source 12 px in Ink Caption, "Zurückdrehen" and arrows to the neighbouring cards, checkmark badge on viewed cards, Enter / Space / Esc; a flipped card grows to its text (min 360 px) so the back never scrolls. State `traps.viewed[]`, event `trap_card_flip {trap_id}`. All cards optional, CTA always visible.
- S3 `/quiz/phase` — question and help text verbatim, eight cards with the S2 titles, multi-select up to 2 (further cards inactive), min 1 to continue, feedback of the first chosen phase as "Gut zu wissen" InfoNote with fade-in; State `phase.selected[]`, event `phase_selected {phase_ids}`. Resume lands on the last quiz screen.
- Strings `quiz.traps.*`, `quiz.phase.*` in `locales/de.json`: the eight 8.2 texts verbatim (Menopause without the internal note), a `source` line per card (short form of the citations), S3 feedback per phase = the card's core figure sentence + the two fixed sentences of the PRD example. Cache: quiz.js v11, quiz.css v12.
- Copy lint: citations in parentheses no longer count towards sentence length and a colon clause counts as its own sentence (how 8.2 counts); 20-word limit also for `quiz.traps.card.*` and `quiz.phase.feedback.*`; per-key exemption list `KEY_EXEMPT` with one entry: "fehlt" in the Teilzeit card (verbatim PRD copy, conflict 3).

Verification
- Browser (1280 px): headline and tooltip, 8 cards, counter 0 → 1 → 8, Enter flips, Esc closes and focuses the front, badge set, `traps.viewed` persisted, `trap_card_flip` event; every back fits (`scrollHeight ≤ clientHeight`), card width 280 px; S3: 8 cards, CTA disabled until one is chosen, third choice inactive, feedback InfoNote rendered, `phase.selected` persisted, `phase_selected` event; glossary marks "Care-Arbeit" in the feedback.
- compliance-checker on the new copy and logic: PASS, no findings (no answer-to-product mapping, no forbidden words, no derived type, disclaimer present, no personal data).
- Copy lint 0 findings, tests 29 pass, `node --check` pass.

Copy typo fixes
- S2 headline: "Acht Fallen, machen diese Lücke" → "Acht Fallen machen diese Lücke" (comma).
- 8.2 Berufseinstieg: "übertragt sich" → "überträgt sich".

## Task 10 · Screens S4, S5, S6 (12.09.2026)

Done
- S4 `/quiz/situation` (two views): 4a amount with the five options (`monthlyRange` enum `under_50 / 50_150 / 150_300 / over_300 / later`) and a "Gut zu wissen" InfoNote, auto-advance; 4b horizon with its InfoNote, explicit CTA "Alles klar!"; both persisted at once; event `situation_answered {monthlyRange, horizon}`; resume lands on 4b when 4a is answered. Neither answer touches Explorer content or sorting (PRD 2.4).
- S5 `/quiz/portfolio` (pure learning screen): headline, intro, three building-block cards as accordions (ETF, Aktie, Anleihe), spectrum text and ruhig → mutig axis, three example donuts (70/0/30, 60/20/20, 50/40/10) always shown regardless of answers, hover and focus on a segment shows block + percent, the label "Beispiel, keine Empfehlung" is part of the donut component; `portfolioEducation.viewed`; CTA "Verstanden, weiter". No cream card on this screen (the legal label is a section tag, so the two-card limit holds).
- S6 `/quiz/impact`: illustration, headline, body, two flip cards "Ausschließen" / "Gezielt stärken" (reuse of the S2 card component), closing line, CTA "Meine Werte wählen"; `impact.viewed`.
- Strings `quiz.situation.*`, `quiz.portfolio.*`, `quiz.impact.*` verbatim; `quiz.css` blocks for S4 note, S5 blocks / spectrum / donuts, S6. Cache quiz.js v12, quiz.css v13.
- Copy lint: 20-word limit also for the two S4 "Gut zu wissen" notes (learning text); per-key exemptions for the S5 spectrum text (30 words) and the S6 body sentence (24 words), both verbatim PRD copy (O24).

Verification
- Browser (1280 px): 4a options and note, auto-advance to 4b, `monthlyRange` = `50_150`, 4b note marks Kurs, Schwankung, Inflation, Kaufkraft, CTA "Alles klar!" after a choice, `situation_answered {50_150, over_10y}`; S5 three blocks (accordion opens), three donuts each with the legal label, legend "ETFs 70 % · Aktien 0 % · Anleihen 30 %", `portfolioEducation.viewed` true, 12 glossary terms incl. ETF, Aktie, Anleihe, Green Bond, Streuung, Schwankung, Zinsen (PRD S5 list); S6 two cards flip and fit, closing line, `impact.viewed` true, glossary marks Divesting, wertebasiertes Investieren, Ausschlusskriterien, Themen-ETF (PRD S6 list); sub steps 3 → 6 of 6.
- compliance-checker on S4–S6 copy and logic: PASS (all three examples always shown with the baked-in label; no forbidden words in `quiz.portfolio.*`; `monthlyRange` / `horizon` stored raw only; no archetype; disclaimer footer; no personal data). Copy lint 0 findings, tests 29 pass.

Copy typo fixes
- S5 ETF card: closing period added after "eine breite Streuung".
- S5 Aktie card: "Große Rendite Chance aber auch größeres Risiko." → "Große Renditechance, aber auch größeres Risiko."
- S5 spectrum: "timing the markte" → "timing the market", "Anlagehorziont" → "Anlagehorizont".
- S6 body: "entweder Ein Windrad" → "entweder ein Windrad".

## Task 11 · Screens S7 and S8 without sharing (12.09.2026)

Decisions taken first: conflict 5 (English lines stay, spelling fixed), conflict 10 (SDG tile tokens from Sage / Cream only).

Done
- S7 `/quiz/values` in `quiz.js`: 17 tiles from `data/sdgs.json` plus an info tile "Was sind SDGs?"; tile = number (ExtraBold), short title, product counter from `products.json` `sdgTags` ("{n} Produkte" or "Aktuell keine Produkte in unserer Liste"), hover text "{title} – {hover}. Im Explorer: {n} Produkte."; background cycles `--sage-soft`, `--cream`, `--bg-warm`, `--cream-soft`, `--sage` with Ink text; selected tiles get a check badge; min 1, max 5, at 5 the others turn inactive with "Bis zu 5 – tausche eine aus"; right side "Deine Auswahl ({n}/5)" with chips; `values.sdgs`, `values_selected {sdg_ids, count}`; CTA "Zusammenfassung ansehen" → `summary.html`. The interim mirror/result screens are gone.
- S8 `summary.html` + `summary.js` + `summary.css`: two columns — "Das ist dir wichtig" (Deine Phase · Deine Rahmenbedingungen · Deine Werte as chips, each with "Antworten ändern" back to its quiz screen) and "Das weißt du jetzt" (four checkmarks, "So geht es weiter" with three steps); below the build line, the glossary InfoNote and the CTA "I AM READY." → Explorer. Every text renders from `pm_session` through templates (`summary.phase.template` with the 8.2 core sentence of the first chosen phase, `summary.frame.template` with amount and horizon, "Das ist ein Sparplan mit langem Horizont." only for > 10 years, the "offen gelassen" fallback), no interpretation, no portfolio type, no weights. Events `summary_view`, `summary_cta_click`. Share card: task 12.
- Strings `quiz.values.*`, `summary.*`; copy lint: `summary.phase.core.*` under the 20-word rule (8.2 content), exemption for the verbatim S7 help text (16 words). Cache quiz.js v13, quiz.css v14, summary.css v2.

Verification
- Browser S7 (1280 px): 17 tiles + info tile, tile 145 × 146 px (≥ 140 × 120), counters e.g. SDG 5 "7 Produkte", SDG 7 "5 Produkte", hover text for SDG 7 per 8.3, five muted backgrounds, five selections → "Deine Auswahl (5/5)", 12 inactive tiles with the hint, `values.sdgs` [5, 13, 4, 7, 1], `values_selected` count 5, glossary marks SDG and Ausschlusskriterien, "Schritt 6 von 6".
- Browser S8: headline; phase block "Du bist in der Phase Teilzeit. 27,8 % …"; frame block "Du denkst an 50–150 € im Monat, für mehr als 10 Jahre. Das ist ein Sparplan mit langem Horizont."; five value chips; four checkmarks; three next steps; build line; glossary InfoNote (one cream card); CTA "I AM READY." ends at 698 px (< 800); `summary_view` event; 11 glossary terms marked; disclaimer footer; ProgressBar with Quiz clickable.
- compliance-checker on S7/S8: PASS, no blocker. Two warnings, both known: `common.disclaimer` in en.json is empty (German fallback by decision on conflict 14, EN text before an EN launch) and the English lines on S8 (decision on conflict 5). Copy lint 0, tests 29 pass.

Copy typo fixes
- S8: "Now Let´s go build it yourslef" → "Now let's go build it yourself."; closing parenthesis added after "Beratungsgespräch".

## Task 13 · S9 Explorer, catalog (12.09.2026)

Decision taken first: build on the migrated `products.json` with placeholders (scores null).

Done
- `explore.js` rewritten (PRD S9 catalog): filter panel with category (ETF · Aktie · Anleihe / Green Bond), the 17 SDG chips (the S7 choice preselected, every chip removable, OR filter), minimum Sustainability and Gender score sliders 0–10 (a product without a provider score cannot pass a minimum > 0), region chips; search over name, ISIN and themes; sorts Name A–Z (default), Kosten aufsteigend, Sustainability-Score, Gender-Score (never by quiz answers); reset. Filters are pure set operations.
- Product card: name (opens the drawer), type badge, region, TER, Positionen, "Risikoklasse laut Basisinformationsblatt: n / keine Angabe", Sustainability- and Gender-Score each with "laut {source}, Stand {asOf}" or "Keine Einstufung vorhanden", six-axis radar (drawn only when all six provider axes exist, otherwise a dashed placeholder with the hint), up to three SDG tags, "+" button and drag handle. Glossary marks each card.
- Drawer from the right (`role="dialog"`, backdrop, Esc, focus to close and back to the card): description, "Was ist drin" (top 5), KID figures (Risikoklasse, laufende Kosten, Ausschüttung ja/nein, Auflagedatum, Fondsvolumen), scores with the scale note and provider + asOf, contributions to the chosen SDGs, KID link or "Link folgt", "In mein Portfolio". Deep link `/explore?product=<id>` opens it (conflict 17). `product_open` event.
- Empty states with the PRD texts; mobile: filters as a bottom sheet (`Filter` button, close, Esc), portfolio as a sticky bar with mini donut and count that opens the full panel; no drag and drop needed on mobile (the + button remains).
- `explore.html` rewritten (drawer, toggles), `explore.css` extended (tokens only), strings `explore.*` reorganised (filter, region, card, radar, drawer, panel). Cache explore.js v15, explore.css v9. en.json re-synced (the sync had been skipped by the aborted task 11 patch).

Verification
- Browser (1280 px): 22 products, default sort name, four sort options; S7 choice preselects 5 SDG chips → 16 products; reset → 22; cost sort puts the two 0,18 % / 0,20 % ETFs first; min-score 5 → empty state with the PRD text (no provider scores yet); ISIN search finds exactly one product; drawer opens with the four sections, "Link folgt" for the missing KID, add from the drawer writes `portfolio.items`, Esc closes; events `explore_filter_change`, `product_open`, `product_add`.
- Performance (PRD S9): 60 products re-rendered after a filter change in 9 to 17 ms (five runs, `window.__pmRenderMs`).
- Glossary: an ETF card carries TER, Risikoklasse, ISIN, Sustainability-Score, Gender-Score, Positionen as terms; a stock card has 5 (no TER, no Positionen by data), see O29.
- Copy lint 0, tests 29 pass, `node --check` pass.

Copy typo fixes
- None.

## Task 14 · S9 Explorer, portfolio panel (12.09.2026)

Done
- "Dein Portfolio" panel in `explore.js`: add by drag and drop or "+" (also from the drawer); on add the weights are redistributed evenly in 5 % steps (`derive.evenWeights`); per product a slider (step 5), − / + buttons (44 px targets, the drag-and-drop alternative) and a number field, every change rounded to 5 % and saved to `pm_session.portfolio.items` at once (`weight_change` event); donut and legend by weight; "{n} % aufgebaut", "Summe {n} %" with the hint until the sum is 100 %; CTA "Zum Portfolio" active only at sum = 100 % and ≥ 1 product (`derive.weightsComplete`).
- Descriptive mix feedback (PRD S9 text, `derive.mixLabel` with the 7.6 thresholds as constants) behind the feature flag `window.PM_FLAGS.mixFeedback` (default on, PRD 11); single-product hint verbatim. Mobile sticky bar shows the count and opens the panel.
- Strings `explore.panel.*` (PRD S9 verbatim; the single-product hint is exempt from the 15-word rule, O24). `explore.css` weight rules. Cache explore.js v17, explore.css v10.
- Fix: the patch tooling turned `$$(` into `$(` in four list handlers (String.replace treats `$$` as `$`); corrected. The same root cause explains the task 06 defect found in task 07.

Verification
- Browser: 1 product → weight 100, "Summe 100 %", single-product hint, CTA enabled; 3 products → 35 / 35 / 30, "Dein Mix: 30 % ETFs · 70 % Aktien · 0 % Anleihen. Im Spektrum aus Schritt 5 liegt das bei „mutig“." (descriptive), CTA enabled; − on one item → 95 %, hint shown, CTA disabled, feedback hidden; number field 37 → rounded to 35, sum 100 %, CTA enabled; donut label 100 %; 2 `weight_change` events; 6 step buttons, 3 sliders, 3 number fields; mobile bar "3 Produkte".
- compliance-checker on the mix feedback copy and weight logic: PASS, no findings (descriptive only and behind the flag; weights user-driven in 5 % steps with even default; CTA gated on 100 %; no forbidden words). Copy lint 0 findings, tests 29 pass.

Copy typo fixes
- None.

## Task 15 · S10 Portfolio screen (12.09.2026)

Decision taken first: conflict 7 (default amount = range edges: 50 / 100 / 225 / 300 €, "Sage ich später" → empty).

Done
- `portfolio.html`, `portfolio.js`, `portfolio.css` rebuilt (PRD S10, screen only): headline "Dein Portfolio."; left "Zusammensetzung" table with product, ISIN, weight and monthly amount (`derive.splitAmount`: whole euros, remainder to the largest weight), the descriptive mix line, link back to the Explorer; centre donut by weight with legend; right "Deine Ziele" card on the one reserved Forest surface: weighted Sustainability- and Gender-Score via `derive.portfolioScore` with provider and asOf (and "auf Basis von n % deines Portfolios" when not every item carries a score) or "Keine Einstufung vorhanden.", SDG coverage "{n} von {total} abgedeckt" with chips; monthly amount field prefilled from the S4 range and editable (`situation.monthlyAmount`, split recalculates at once; without amount the € column is hidden); "Plan sichern" block with the two equal buttons "Als PDF herunterladen" · "Per E-Mail schicken", e-mail field and the unticked newsletter checkbox, all disabled until task 16; InfoNote "Du entscheidest. Wir begleiten." with the PRD text; empty and "not yet 100 %" states with a link to the Explorer. `portfolio_complete` event with aggregated mix, scores and coverage (no product ids); `portfolio.completedAt` set once. S11 is out of scope, so no "Weg wählen" CTA (O31).
- Strings `portfolio.*` (PRD S10 verbatim). Cache portfolio.js v9, portfolio.css v5, explore.css v10 link.

Verification
- Browser: 3 products 35 / 35 / 30 → default 100 € → € 35 · € 35 · € 30 (sum 100); amount 250 → 88 · 87 · 75 (sum 250, remainder to the first largest weight), `situation.monthlyAmount` 250; mix line "… bei „mutig“"; donut 100 %; goals card Forest `rgb(31, 58, 46)`, both scores "Keine Einstufung vorhanden.", "Deine Ziele: 1 von 5 abgedeckt" with the SDG 5 chip; plan buttons disabled, newsletter unticked; one cream card; `portfolio_complete {itemCount 3, mix, null scores, sdgCoverage 1}`; 8 glossary terms; ProgressBar with the earlier stages clickable.
- `node --test`: `splitAmount` rounding and remainder, `defaultAmount` range edges (scripts/derive.test.mjs) — 29 tests pass. Copy lint 0.

Copy typo fixes
- None.

## Task 16 · PDF plan and e-mail (13.09.2026)

Decision taken first: conflict 8 (client-side PDF with a vendored library, e-mail deferred behind a serverless stub).

Done
- `plan.js` (shared, testable): `buildPlan()` turns session + products + SDGs + glossary + strings into the seven PRD sections — cover (title, date, value chips, the S3 core sentence as "dein Satz aus S3"), portfolio table (Produkt · ISIN · Typ · Anbieter · Gewichtung · monatlicher Betrag · TER · Risikoklasse · Sustainability · Gender), goals (weighted provider scores with source and asOf, SDG coverage), broker to-do (6 steps), the 7 questions, glossary of every term used in the plan, disclaimer plus score sources. `renderPdf()` writes A4 pages with the vendored jsPDF 2.5.1 (`vendor/jspdf.umd.min.js`, 356 kB, lazy loaded on click). File name `Portemonnaie_Plan_JJJJ-MM-TT.pdf`. Without an amount the € column is empty.
- `portfolio.js`: "Als PDF herunterladen" (`plan_download`, `checkout.pdfDownloaded`) and "Per E-Mail schicken" (POST `/api/plan-email` with the PDF as base64; `plan_email_sent`, `newsletter_optin {optIn}`, `checkout.emailSent / newsletterOptIn`); status line for sending, sent, double opt-in, not configured, invalid address, failure. Newsletter checkbox unticked.
- `api/plan-email.js`: Brevo transactional template with attachment; newsletter via Brevo double opt-in only when the checkbox was ticked; answers `501 not_configured` until `BREVO_PLAN_TEMPLATE_ID` (and for the newsletter `BREVO_NEWSLETTER_LIST_ID`, `BREVO_DOI_TEMPLATE_ID`, `BREVO_DOI_REDIRECT_URL`) exist; validates address and size; never logs the address. Strings `plan.*` (PRD S10 PDF texts verbatim) and `portfolio.plan_*`.

Verification
- `scripts/plan.test.mjs` (4 tests): plan weights equal the session weights and the euro split equals `derive.splitAmount`; file name; 6 to-do steps, 7 questions, disclaimer; glossary contains Depot, Sparplan, ISIN, Ausführungstag, Provision; empty amount and null scores. 33 tests pass.
- Browser: buttons enabled; plan weights 35 / 35 / 30 and amounts 88 / 87 / 75 identical to the screen; 16 glossary entries; PDF 4 pages, 18 kB, rendered in 41 ms; simulated API 501 → "wird gerade eingerichtet" status; simulated 200 → "Dein Plan ist unterwegs.", `checkout.emailSent` true, events `plan_email_sent {}` and `newsletter_optin {optIn: false}`; the address appears nowhere in the analytics buffer.
- Not verified: a real Brevo send (no template ids yet, O32); the PDF was not opened in a viewer (O33). Copy lint 0 (one own status string reworded away from "noch nicht").

Copy typo fixes
- None.

## Task 12 · S8 share card (13.09.2026)

Done
- `share.js`: the Werte-Karte is drawn on a `<canvas>` in both formats (1080 × 1350 feed, 1080 × 1920 story) with the page's web fonts (`document.fonts.load` before drawing, so the PNG carries Inter ExtraBold and Instrument Serif Italic as pixels — no fallback font, no image library needed and none vendored). Content: the three slogan lines from i18n keys, each with one serif accent word on a sage brush highlight; the chosen SDGs as chips (max 5) or "Ich fang an."; the cream sticky note "105 Billionen Dollar Unterschied. Jede von uns zählt. Du auch."; wallet mark + portemonnaie.finance; signature "Von Frauen. Für Frauen."; small print "Quelle: Oxfam 2020"; faint plant illustration on Background. No name, phase, amount or portfolio on the card.
- Share sheet on `summary.html` (secondary "Teilen" button with share icon at the left card): preview with Feed / Story toggle, editable prefilled text (PRD text, 15 Minuten per decision 6, link with `?ref=<session id>`), "Bild speichern" (download), "Link kopieren", "Teilen" (`navigator.share` with the PNG file, fallback download + copy; shown only when the API exists), toast "Gespeichert. Jede geteilte Karte holt eine Frau mehr an den Tisch.", Esc / backdrop close. Events `share_open`, `share_action {channel: save | copy | native}`. The `?ref=` landing was built in task 06 (`referrer`, `referral_landing`).
- Strings `share.*`; `summary.css` sheet styles (tokens only). Cache summary.css v3, share.js v1.

Verification
- Browser: sheet opens, both PNGs generated in 297 ms (< 2 s) at 1080 × 1350 (264 kB) and 1080 × 1920 (284 kB); fonts reported loaded; pixel sampling finds the Sage Soft chips and Forest text; text prefilled with the ref link; Story toggle; copy → toast "Link kopiert."; events `share_open`, `share_action {copy}`; Esc closes.
- Manual checks (PRD S8 acceptance, listed for the launch-blocker list): iOS Safari system share dialog with the image; visual review of the card in both formats; `navigator.share` on Android Chrome.

Copy typo fixes
- None.

### Open issues (appended by task)

- O1 · Resolved 10.09.2026: `PRD.md` moved from repo root to `docs/PRD.md`.
- O2 · Resolved 10.09.2026: landing keeps signup, calculator and mission; S0 elements added to the hero (task 02). Headline stays "Start investing in what you support." rather than the PRD tagline; revisit if the tagline should lead.
- O6 · S0 acceptance "CTA first focusable after logo" cannot be met while the nav links precede the hero. Options: move the language toggle and links after the hero in DOM order, or accept the nav as part of the header.
- O7 · LCP and the resume/restart flow are untested in a browser; run once the quiz page exists at the PRD route.
- O8 · `?ref=` referral on S0 (PRD S8) not stored: `referrer` is missing from the 7.1 schema (conflict 9).
- O9 · "Weitermachen" for `/summary` points to `quiz.html` because no summary page exists yet; fix with conflict 16.
- O10 · The PRD gives no label for the collapsible stage overview; "Die vier Etappen" / "The four stages" used (four after the S11 decision).
- O11 · `securities.json` keeps three `Fund` entries and an English `description`; PRD 7.2 knows etf / stock / bond and `description_de`. Settle with conflict 17 in task 05.
- O12 · PRD S0 copy says "15 Minuten" and PRD 4 lists five stages; with S11 out of scope the time budget is 14:30 and the progress bar has four stages. PRD text not changed.
- O13 · The interim quiz screens carry placeholder copy (not PRD 6 strings) until tasks 09 to 11; the interim result screen links to `summary.html`, which is empty.
- O14 · `.claude/settings.local.json` still allows commands referencing `product.html`, `data/prices` and `securities.schema.json` (local file, not tracked).
- O15 · Pre-registration pages (landing incl. calculator, mission, library, legal) keep shadows, gradients, `#fff` surfaces and marigold by the scope decision of task 03. `styles.css` outside the `.s0` / `.flow-body` blocks and `calculator.css` are not on PRD 5.6. Revisit before launch or when the landing becomes S0 in full.
- O16 · Fonts: PRD 5.6 wants no Arial/Helvetica/Calibri fallbacks; repo stacks fall back to system-ui / Times New Roman / Inter. Left unchanged (fallback only shows while Google Fonts load).
- O17 · PRD 7.2 region enum (world, europe, emerging, austria) has no value for the eight US-listed products; `us` added to the schema enum. Confirm or re-key.
- O18 · `products.json` has 22 entries, below the PRD minimum of 30; three lack an ISIN (PRD S10: no product without ISIN). Data work, not code.
- O32 · E-mail sending needs the Brevo transactional template with attachment, the newsletter list id, the double-opt-in template and redirect URL as Vercel env vars (`BREVO_PLAN_TEMPLATE_ID`, `BREVO_NEWSLETTER_LIST_ID`, `BREVO_DOI_TEMPLATE_ID`, `BREVO_DOI_REDIRECT_URL`); until then the button reports "wird gerade eingerichtet". Redeploy after adding them.
- O33 · PDF typography is jsPDF Helvetica (no Inter embedding); manual check of the PDF in a viewer and on iOS still open. PRD 11 asks legal to confirm that the amount split (Betrag × Gewichtung) is not a recommendation.
- O31 · S10 ends the flow (S11 out of scope): the PRD CTA "Weg wählen" is not rendered. PDF and e-mail buttons are visible but disabled until task 16.
- O29 · PRD S9 acceptance "every card has at least 6 glossary terms" holds for ETFs; single stocks show 5 because TER and Positionen do not apply. Accept or add a term to stock cards.
- O30 · The six radar axes have no data source yet (conflict 2); cards show a dashed placeholder until a provider delivers them. The score sliders currently exclude every product above 0 for the same reason.
- O27 · S8 "So geht es weiter": the PRD names three steps with mini icons but gives no texts; the stage names Explorer · Portfolio · Plan sichern are used. S8 frame block: the PRD example sentence "Das ist ein Sparplan mit langem Horizont." is shown only for > 10 years; no sentence exists for the other horizons.
- O28 · S8 Mutterschaft block carries the PRD sentence "Genau hier lohnt sich Vermögensaufbau am Meisten …" (legal review, conflict 13; "am Meisten" left as written).
- O24 · Sentence length: the S5 spectrum text (30 words in one sentence) and one S6 body sentence (24 words) exceed the PRD's own limits (15 / 20). Shipped verbatim under lint exemptions; the S6 acceptance "Kein Satz über 20 Wörter" therefore fails on PRD copy. Wording decision needed.
- O25 · S6 illustration "Wurzeln → Baum" does not exist; the landing plant illustration is used as a placeholder.
- O26 · S4b note contains "wäre am Konto gut aufgehoben" (legal review, conflict 13); shipped verbatim, must be released before launch.
- O21 · S2 card size: PRD says 280 × 360 px at ≥ 1280 px; with the verbatim 8.2 text at 14 px the Trennung card needs 379 px, so a flipped card grows to its text. Either accept or shorten that card.
- O22 · S2 "Zitat" on the back: the PRD asks for a serif quote and a separate source; the 8.2 texts carry their citations inline, so the first sentence is shown as the quote and a short-form citation line was added per card (derived, not PRD copy).
- O23 · Copy lint exemption for "fehlt" in `quiz.traps.card.teilzeit.body` (verbatim PRD 8.2); wording decision still open (conflict 3).
- O20 · Glossary content review (Katharina, `docs/glossary-review.md`) and legal review (PRD A.2, focus "Wirkung" and "Wege" plus all figures) are open; the figures in the examples (e.g. Gender Pay Gap 18 %, Pension Gap 40 %, Care-Arbeit 66 %) need their sources confirmed before launch.
- O19 · `fundSizeMeur` is not converted to EUR (`fundSizeCurrency` carries USD for most ETFs); `sdgTags` derived from themes need EET confirmation. Both flagged in `meta.dataNote`.
- O3 · `explore.js` radar uses 6 axes from Four Capitals + own scores; PRD radar axes (climate, social, governance, gender, biodiversity, transparency) have no data source (conflict 2, 19).
- O4 · Shadows: `--shadow-*` tokens are used by the prereg site too; the no-shadow rule applies to the flow screens, keep the tokens for the landing unless the brand doc says otherwise.
- O5 · Landing copy `platform.lede` / `pill1` use "Robo Advisor" in user-facing text on the live site; outside this task's scope but violates the copy lint.

### Copy typo fixes

None (no copy touched in task 01).
