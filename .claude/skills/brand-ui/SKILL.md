---
name: brand-ui
description: Build or restyle a UI component for the Money Tree / Portemonnaie
  site strictly on the brand design system. Use when the user asks to add or
  style a component, section, card, or button, or mentions brand colours,
  brand styling, or "stick to the brand". Enforces brand tokens, pill buttons,
  card radius, typography, and the no-emoji rule.
tools: Read, Glob, Grep, Edit, Write
---

# Brand UI

Money Tree's look is **minimal, editorial, warm, soft, handcrafted, premium and
calm, with botanical line-art accents** — a forest / sage / cream palette, not
monochrome. **No emojis. No gradients, shadows, glows or pure white surfaces.**
Authoritative source: `brand/BRAND_GUIDELINES.md`, tokens in PRD 5.6.

## Tokens — use these, never hard-coded hex

Defined in `styles.css :root`:

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FAF8F3` | page background (cream) |
| `--bg-card` | `#F7F3EB` | card background |
| `--ink` | `#1A2E24` | primary text |
| `--ink-soft` | see conflict 18 | repo value is Forest today; PRD Ink Soft is `#4A5C52` (captions ≥ 18 px only) |
| `--ink-mute` | `#5A6B61` | secondary / muted text |
| `--forest` | `#1F3A2E` | primary green accent, headings, primary CTA fill |
| `--sage` | `#A8D5BA` | brush highlight behind one italic word |
| `--cream` | `#F5EFD7` | InfoNote and sticky-note cards |
| `--yellow` | `#F2C94C` | underline only, once per screen; never a fill |
| `--line` / `--line-strong` | translucent ink | borders |

PRD 5.6 adds `--forest-deep`, `--sage-deep`, `--sage-soft`, `--cream-soft`
(added to `:root` in task 03; until then use `var(--token, #hex)` fallbacks).
Marigold and lilac live only inside the logo, never as a UI colour.

Radii: `--radius: 999px` (pills), `--radius-card: 20px`, `--radius-sm: 12px`.
Fonts: `--ff` Inter (body/headings), `--ff-serif` Instrument Serif (`em.serif`
accents), `--ff-script` Caveat. No shadows in flow screens (PRD 5.6); the
`--shadow-*` tokens remain for the prereg pages only.

## Rules
- **Buttons are always pills** — reuse `.btn` + `.btn--primary` / `.btn--ghost`.
  Do not create new button shapes.
- **Cards** use `--radius-card` and `--bg-card`.
- Headings use Inter `font-weight: 300`, `letter-spacing: -0.03em`; an accented
  word can use `<em class="serif">` or the `.brush` sage highlight (one per
  headline).
- Sage is an **accent** — small doses (a brush highlight, a chip, a progress
  fill), never large fills. Forest as a full surface only for one reserved
  moment per flow.
- **No emojis.** Use inline SVG line-icons (see existing `stroke="currentColor"`
  icons) for iconography.
- Respect `prefers-reduced-motion` for any animation.

## Workflow
1. Check `styles.css` for an existing class/pattern before writing new CSS —
   reuse `.btn`, `.section`, `.container`, `.eyebrow`, `.h-section`, etc.
2. Put page-specific styles in that page's own stylesheet (e.g. `quiz.css`),
   shared styles in `styles.css`.
3. Reference tokens via `var(--token)` only.
4. If you touched a shared CSS/JS file, run the `bump-cache` skill.

## Quick self-check
- [ ] Only `var(--token)` colours, no raw hex
- [ ] Buttons are pills via `.btn*`
- [ ] No emojis; icons are inline SVG
- [ ] Sage used sparingly, no shadows or gradients, no `#fff` surfaces
- [ ] Reused existing classes where possible
