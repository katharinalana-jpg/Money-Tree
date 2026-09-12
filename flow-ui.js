/* =============================================================
   Portemonnaie — InfoNote and footer Disclaimer (PRD 5.3).
   Shared vanilla JS; styles in styles.css (flow section).

   InfoNote: three variants with fixed labels from the locale —
     know    „Gut zu wissen“            (learning; light tilt ±2.5°)
     example „Beispiel, keine Empfehlung“ (legal label; no tilt)
     stance  „Du entscheidest. Wir begleiten.“ (attitude; no tilt)
   Cream card, no border, no shadow, label as section tag.
   Max two cream cards per screen: pmInfoNote.check() warns.

   Disclaimer: <footer class="pm-disclaimer" id="pmDisclaimer"> gets
   the PRD 2.4 text (common.disclaimer), 12 px, sticky at the
   bottom so it stays visible without scrolling on desktop.
   ============================================================= */
(function () {
  "use strict";
  if (typeof window === "undefined") return;
  const L = () => window.pmLocale;
  const t = (key) => (L() && L().has(key)) ? L().t(key) : key;
  const VARIANTS = { know: "note.know", example: "note.example", stance: "note.stance" };

  function escHtml(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  /* Returns the InfoNote markup. `body` is trusted HTML from the locale
     file (use bodyText for plain text). The legal label of the "example"
     variant is part of the component and cannot be turned off. */
  function html(variant, body, opts) {
    const v = VARIANTS[variant] ? variant : "know";
    const tilt = v === "know" ? ((opts && opts.tilt) || -2) : 0;   // degrees, only "Gut zu wissen"
    const content = opts && opts.bodyText ? escHtml(opts.bodyText) : (body || "");
    return `<aside class="pm-note pm-note--${v}" style="--tilt:${tilt}deg" data-note="${v}">
      <span class="pm-note__label">${escHtml(t(VARIANTS[v]))}</span>
      <div class="pm-note__body">${content}</div>
    </aside>`;
  }

  /* Fill every <aside class="pm-note" data-note="…"> already in the markup
     with its label (called after locale ready). */
  function apply(root) {
    (root || document).querySelectorAll(".pm-note[data-note]").forEach((el) => {
      const v = el.getAttribute("data-note");
      const label = el.querySelector(".pm-note__label");
      if (label && VARIANTS[v]) label.textContent = t(VARIANTS[v]);
    });
  }

  /* PRD 5.3: max two cream cards per screen */
  function check(root) {
    const n = (root || document).querySelectorAll(".pm-note").length;
    if (n > 2 && typeof console !== "undefined") console.warn("[InfoNote] " + n + " cream cards on this screen, PRD 5.3 allows two");
    return n;
  }

  function disclaimer() {
    const f = document.getElementById("pmDisclaimer");
    if (f) f.textContent = t("common.disclaimer");
  }

  function renderAll() { apply(); disclaimer(); }
  if (L()) L().ready.then(renderAll); else renderAll();
  document.addEventListener("pm:localeready", renderAll);

  window.pmInfoNote = { html, apply, check, VARIANTS };
  window.pmDisclaimer = { render: disclaimer };
})();
