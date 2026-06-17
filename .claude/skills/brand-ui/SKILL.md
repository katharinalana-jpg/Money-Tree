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

Money Tree's look is **minimalist, monochrome, editorial, clean, with botanical
line-art accents.** Professional only. **No emojis. No heavy colour palettes.**

## Tokens — use these, never hard-coded hex

Defined in `styles.css :root`:

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FAF8F3` | page background (cream) |
| `--bg-card` | `#F7F3EB` | card background |
| `--ink` | `#1A2E24` | primary text |
| `--ink-soft` | `#1F3A2E` | = forest |
| `--ink-mute` | `#5A6B61` | secondary / muted text |
| `--forest` | `#1F3A2E` | primary green accent, headings |
| `--sage` | `#A8D5BA` | soft accent / brushstroke / tags |
| `--marigold` | `#EAA221` | warm accent (use sparingly) |
| `--cream` | `#F5EFD7` | soft highlight backgrounds |
| `--line` / `--line-strong` | translucent ink | borders |

Radii: `--radius: 999px` (pills), `--radius-card: 20px`, `--radius-sm: 12px`.
Fonts: `--ff` Inter (body/headings), `--ff-serif` Instrument Serif (`em.serif`
accents), `--ff-script` Caveat. Shadows: `--shadow-sm/md/lg`.

## Rules
- **Buttons are always pills** — reuse `.btn` + `.btn--primary` / `.btn--ghost`.
  Do not create new button shapes.
- **Cards** use `--radius-card` and `--bg-card`.
- Headings use Inter `font-weight: 300`, `letter-spacing: -0.03em`; an accented
  word can use `<em class="serif">` or the `.brush` sage highlight (one per
  headline).
- Marigold and sage are **accents** — small doses (a selected state, a pill, a
  progress bar), never large fills.
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
- [ ] Accents (marigold/sage) used sparingly
- [ ] Reused existing classes where possible
