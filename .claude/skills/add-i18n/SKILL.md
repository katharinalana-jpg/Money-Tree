---
name: add-i18n
description: Add or update EN/DE translation keys in i18n.js for the Money Tree
  / Portemonnaie site. Use when the user adds user-facing copy, asks to
  translate text, mentions i18n / the EN-DE toggle / German, or when a new
  data-i18n key is needed. Keeps the en and de dictionaries in sync.
tools: Read, Grep, Edit
---

# Add i18n

The site is bilingual EN/DE via `i18n.js` — a dependency-free IIFE holding one
dictionary: `const I18N = { en: { ... }, de: { ... } }`. Language is stored in
`localStorage` under `pm_lang` and applied at end of `<body>`.

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
