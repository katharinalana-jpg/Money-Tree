---
name: new-page
description: Scaffold a new vanilla HTML page for the Money Tree / Portemonnaie
  site. Use when the user asks to create a new page, new site, or new screen
  (e.g. "add an about page", "create a new landing page"). Copies the shared
  brand <head>, nav and footer, wires i18n and shared scripts, and sets
  cache-bust versions. Vanilla HTML/CSS/JS only — no framework.
tools: Read, Glob, Grep, Edit, Write
---

# New Page

Scaffold a new page that matches the existing Money Tree pages exactly. This is
a vanilla HTML/CSS/JS site (Phase 1) — **no npm, no framework**.

## Steps

1. **Model on an existing page.** Read `index.html` as the template
   — it has the canonical `<head>`, `.nav` (desktop + mobile), `<main>`, and
   `.footer`. Copy that structure; do not invent new nav/footer markup.

2. **`<head>` essentials** (copy verbatim, then adjust title/description):
   - Google Fonts preconnect + the Inter / Instrument Serif / Caveat link
   - `<link rel="icon" ... MAIN_logomark_wallet_color.png>`
   - `styles.css?v=N` (shared) + any page-specific stylesheet
   - Unique `<title>` and `<meta name="description">`

3. **Brand rules** (see `CLAUDE.md` and the `brand-ui` skill):
   - Use brand tokens only: `--bg`, `--ink`, `--forest`, `--sage`, `--cream`,
     `--yellow` (defined in `styles.css :root`, PRD 5.6). No new palette, no
     marigold in UI.
   - Pill buttons (`.btn`, radius `999px`), `20px` card radius.
   - **No emojis anywhere.** Minimal, editorial, warm forest / sage / cream +
     botanical. No shadows, gradients or `#fff` surfaces.

4. **i18n.** All user-facing copy needs a `data-i18n="key"` hook and matching
   `en` + `de` entries in `i18n.js`. Use the `add-i18n` skill. Brand slogans /
   display headlines stay English; explanatory copy is translated.

5. **Scripts** at end of `<body>`, in this order:
   `i18n.js?v=N`, `script.js?v=N`, then any page-specific JS.

6. **Cache-busting.** Set `?v=` on every local CSS/JS link. When you change a
   shared file later, use the `bump-cache` skill to update all pages together.

7. **Compliance.** Every flow screen from S5 on MUST carry the PRD 2.4
   disclaimer in the footer: *"Die Informationen stellen keine Anlageberatung,
   keine sonstige Empfehlung und kein Angebot zum Kauf von Wertpapieren oder zur
   Vornahme bestimmter Investitionen dar."* (EN equivalent in the en locale).
   Anonymous flow — no login, account or personal data before S10.

8. **Link it in.** Add the page to the nav and/or footer of the relevant pages,
   and to any flow/CTA that should point to it.

## Checklist before done
- [ ] `<head>`, nav, footer match the other pages
- [ ] Brand tokens only, pill buttons, no emojis
- [ ] EN + DE i18n keys added for all copy
- [ ] `?v=` set on all local assets
- [ ] PRD 2.4 disclaimer present if it's a flow screen from S5 on
- [ ] Linked from nav/footer/CTAs where appropriate
