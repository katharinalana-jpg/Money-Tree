---
name: add-i18n
description: Add or update EN/DE strings for the Money Tree / Portemonnaie site —
  locales/de.json + en.json for Guidance Flow pages and S0, i18n.js for the
  pre-registration pages. Use when the user adds user-facing copy, asks to
  translate text, mentions i18n / the EN-DE toggle / German, or when a new
  data-i18n key is needed. Runs the copy lint and keeps de/en in sync.
tools: Read, Grep, Edit, Bash
---

# Add i18n

Two string stores (decision 10.09.2026 on conflict 14):

- **Guidance Flow pages and S0** (quiz, summary, explore, portfolio, product,
  the S0 hero block): `locales/de.json` is the source (PRD copy verbatim),
  `locales/en.json` has identical keys with empty values (German fallback) until
  English content exists. `locale.js` loads them, applies the same `data-i18n*`
  hooks, and exposes `pmLocale.t(key, params)`, `tn(key, n)` (`key_one` /
  `key_other`), `fmtNumber`, `fmtCurrency`, `fmtPercent` (Intl, `de-AT`).
  Pages render on the `pm:localeready` event. **No copy in flow JS.**
  After every change: `node scripts/locales-sync.mjs` (regenerates en.json
  structure), `node scripts/copy-lint.mjs` (must exit 0), `node --test scripts/*.test.mjs`.
  Keys are screen-based and dotted: `quiz.traps.card.berufseinstieg.title`.
  Placeholders use `{name}`.

- **Pre-registration pages** (index apart from S0, mission, library, collabs,
  legal): `i18n.js` — a dependency-free IIFE holding one dictionary:
  `const I18N = { en: { ... }, de: { ... } }`. Language is stored in
  `localStorage` under `pm_lang` and applied at end of `<body>`. The rules
  below apply to this store.

## Markup hooks
| Attribute | Effect |
|---|---|
| `data-i18n="key"` | sets `textContent` |
| `data-i18n-html="key"` | sets `innerHTML` (use for inline markup) |
| `data-i18n-ph="key"` | sets `placeholder` |
| `data-i18n-aria="key"` | sets `aria-label` |

JS-rendered widgets (e.g. the quiz) listen for the `pm:langchange`
`CustomEvent` that `apply()` dispatches, and re-render.

## Rules
1. **Every key exists in BOTH `en` and `de`.** Never add to one only — a missing
   key falls back to the markup's default text and looks broken on toggle.
2. Add the key near related keys (the dictionaries are grouped by
   section: nav/footer, hero, flow, calc, quiz, etc.). Mirror the exact same
   key in the same spot in the `de` block.
3. **Brand slogans and display headlines stay English** in both dictionaries
   (per the rule at the top of `i18n.js`). Translate explanatory copy and UI
   controls only.
4. German uses the warm, direct **"du" form**. No untranslated jargon.
5. Keep keys lowercase dot-namespaced: `section.element`, e.g. `calc.cta`,
   `step1.go`.

## Workflow
1. `grep` `i18n.js` for a nearby existing key to find both the `en` and `de`
   insertion points.
2. Add the new key in `en`, then the same key with the German value in `de`.
3. Add the `data-i18n*` attribute to the markup, keeping a sensible default as
   the element's inline text.
4. If you added the key for a JS-rendered widget rather than markup, make sure
   that widget reads the value for the current `pm_lang`.
5. Bump `i18n.js?v=N` on the pages that use the new key (use `bump-cache`).

## Self-check
- [ ] Key present in BOTH en and de
- [ ] Placed beside related keys, same order in both blocks
- [ ] "du" form, no jargon; slogans left English
- [ ] Markup has the matching `data-i18n*` hook + default text
