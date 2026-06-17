---
name: bump-cache
description: Bump the ?v= cache-busting query on a CSS/JS asset across every
  HTML page that references it, after the asset's contents change. Use when the
  user changes a shared file (styles.css, i18n.js, script.js) or a page asset
  (calculator.*, quiz.*) and wants browsers to pick up the new version, or asks
  to "bump the cache" / "bust the cache" / fix stale styles.
tools: Read, Glob, Grep, Edit
---

# Bump Cache

Local assets are loaded with a `?v=N` query (e.g. `styles.css?v=8`,
`i18n.js?v=13`). Browsers cache by full URL, so **whenever an asset's contents
change, its `?v=` must be incremented on every page that links it** — otherwise
returning visitors keep the stale file.

## When to run
After editing any of:
- **Shared**: `styles.css`, `i18n.js`, `script.js` — referenced by *most* pages.
- **Page assets**: `calculator.css` / `calculator.js` (index, landing_calculator),
  `quiz.css` / `quiz.js` (quiz.html).

## Workflow
1. **Find every reference** to the changed file and its current versions:
   ```
   grep -rn "<file>?v=" --include=*.html .
   ```
   (e.g. `styles.css?v=`). Note all distinct versions in play — they can drift
   (some pages were historically left behind).

2. **Pick the new version**: highest current version across all pages, **+1**.
   Use that single number everywhere so every page converges to the same value.

3. **Edit each page** to `<file>?v=<new>`. Do not miss a page — a missed page
   keeps serving the old asset. Check both `<link>` (CSS) and `<script>` (JS).

4. **Verify** none are left behind:
   ```
   grep -rn "<file>?v=" --include=*.html .
   ```
   All occurrences should now show the new version.

## Notes
- Bump **only** the files whose contents actually changed. Don't churn versions
  on untouched assets.
- If a page links a page-specific asset only it uses (e.g. `quiz.css` on
  `quiz.html`), bumping that one page is enough.
- Keep the number monotonically increasing; never reuse or lower a version.

## Self-check
- [ ] Every page referencing the changed asset updated to the same new `?v=`
- [ ] Both CSS `<link>` and JS `<script>` references covered
- [ ] Untouched assets left alone
- [ ] Final grep shows no stale versions
