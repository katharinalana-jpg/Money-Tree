/* =============================================================
   Portemonnaie — GlossaryTerm (PRD 5.2). Shared vanilla JS.

   Every finance term is marked on its first occurrence per screen.
   Auto marker: text nodes inside the scope are scanned for glossary
   terms and aliases (longest first, word boundaries, case-insensitive);
   manual markers <span data-term="id">…</span> win and count as the
   first occurrence. A term without a glossary entry stays plain
   text and logs a dev warning — never an empty popover.

   Markup produced: <button type="button" class="pm-term" data-term="id"
   aria-describedby="pm-gloss-id" aria-expanded="false">Term</button>
   Popover (one shared element, role="dialog"): term, definition
   (max 20 words), "Warum wichtig?", optional "Beispiel". No scroll.
   Triggers: hover (150 ms), focus + Enter/Space, tap; Esc and tap
   outside close. Event: glossary_open {term_id, screen}.

   Pure parts (index, segmenting) are exported for node --test:
   createIndex(terms), segment(text, index, seen).
   ============================================================= */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.pmGlossaryCore = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  /* Build a lookup from term_de + aliases_de → id; returns { byName, regex }.
     The regex matches the longest names first at word boundaries. */
  function createIndex(terms) {
    const byName = new Map();
    (terms || []).forEach((t) => {
      const names = [t.term_de].concat(t.aliases_de || []).filter(Boolean);
      names.forEach((n) => { const key = n.toLowerCase(); if (!byName.has(key)) byName.set(key, t.id); });
    });
    const names = [...byName.keys()].sort((a, b) => b.length - a.length);
    // German words: \b fails around umlauts, so use lookarounds on letters/digits
    const L = "[\\p{L}\\p{N}]";
    const regex = names.length ? new RegExp("(?<!" + L + ")(" + names.map(esc).join("|") + ")(?!" + L + ")", "giu") : null;
    return { byName, regex, size: byName.size };
  }

  /* Split a text into segments: { text } or { term: <as written>, id }.
     Only the first occurrence of each id (per `seen` set) becomes a term. */
  function segment(text, index, seen) {
    const out = [];
    if (!index || !index.regex || !text) return [{ text: text || "" }];
    let last = 0;
    index.regex.lastIndex = 0;
    let m;
    while ((m = index.regex.exec(text)) !== null) {
      const id = index.byName.get(m[1].toLowerCase());
      if (!id || seen.has(id)) continue;
      if (m.index > last) out.push({ text: text.slice(last, m.index) });
      out.push({ term: m[1], id });
      seen.add(id);
      last = m.index + m[1].length;
    }
    if (last < text.length) out.push({ text: text.slice(last) });
    return out.length ? out : [{ text }];
  }

  return { createIndex, segment };
});

/* ---- browser: DOM marker + popover ------------------------------- */
(function () {
  if (typeof window === "undefined" || !window.pmGlossaryCore) return;
  const core = window.pmGlossaryCore;
  const SKIP = new Set(["SCRIPT", "STYLE", "BUTTON", "INPUT", "SELECT", "TEXTAREA", "SVG", "CODE", "A", "NAV", "HEADER", "FOOTER"]);
  const HOVER_DELAY = 150;

  let terms = new Map();   // id → entry
  let index = null;
  let seen = new Set();    // ids marked on this screen
  let pop = null, openId = null, hoverTimer = null, anchor = null;
  const L = () => window.pmLocale;
  const t = (key) => (L() && L().has(key)) ? L().t(key) : key;
  const track = (name, payload) => { if (window.pmTrack) window.pmTrack.track(name, payload); };

  function warn(msg) { if (typeof console !== "undefined") console.warn("[glossary] " + msg); }

  /* ---- loading ------------------------------------------------- */
  function init(opts) {
    const url = (opts && opts.url) || "data/glossary.json";
    return fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((doc) => {
        const list = (doc && (doc.terms || doc)) || [];
        terms = new Map(Array.isArray(list) ? list.map((e) => [e.id, e]) : []);
        index = core.createIndex([...terms.values()]);
        if (!terms.size) warn("no glossary entries loaded from " + url);
        return terms.size;
      });
  }

  /* ---- marking ------------------------------------------------- */
  function reset() { seen = new Set(); }

  function mark(root) {
    const scope = root || document.querySelector("main") || document.body;
    // 1) manual markers win
    scope.querySelectorAll("[data-term]:not(.pm-term)").forEach((el) => {
      const id = el.getAttribute("data-term");
      if (!terms.has(id)) { warn("missing entry for manual marker \"" + id + "\""); el.removeAttribute("data-term"); return; }
      seen.add(id);
      el.replaceWith(makeTerm(el.textContent, id));
    });
    // 2) auto marker on text nodes
    if (!index || !index.regex) return;
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        for (let el = node.parentElement; el && el !== scope.parentElement; el = el.parentElement) {
          if (SKIP.has(el.tagName) || el.hasAttribute("data-no-glossary") || el.classList.contains("pm-term") || el.classList.contains("pm-popover")) return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const segs = core.segment(node.nodeValue, index, seen);
      if (segs.length === 1 && segs[0].text != null) return;
      const frag = document.createDocumentFragment();
      segs.forEach((s) => frag.appendChild(s.id ? makeTerm(s.term, s.id) : document.createTextNode(s.text)));
      node.replaceWith(frag);
    });
  }

  function makeTerm(text, id) {
    ensureDescription(id);
    const b = document.createElement("button");
    b.type = "button";
    b.className = "pm-term";
    b.setAttribute("data-term", id);
    b.setAttribute("aria-describedby", "pm-gloss-" + id);
    b.setAttribute("aria-expanded", "false");
    b.textContent = text;
    b.addEventListener("mouseenter", () => { clearTimeout(hoverTimer); hoverTimer = setTimeout(() => open(b), HOVER_DELAY); });
    b.addEventListener("mouseleave", () => { clearTimeout(hoverTimer); });
    b.addEventListener("focus", () => open(b));
    b.addEventListener("click", (e) => { e.preventDefault(); if (openId === id && anchor === b) close(); else open(b); });
    b.addEventListener("keydown", (e) => { if (e.key === "Escape") { close(); b.focus(); } });
    return b;
  }

  /* screen reader description: hidden definition per term (aria-describedby) */
  function ensureDescription(id) {
    if (document.getElementById("pm-gloss-" + id)) return;
    const e = terms.get(id);
    const d = document.createElement("span");
    d.id = "pm-gloss-" + id;
    d.className = "sr-only";
    d.textContent = e ? (e.term_de + ": " + e.definition_de) : "";
    document.body.appendChild(d);
  }

  /* ---- popover ------------------------------------------------- */
  function ensurePopover() {
    if (pop) return pop;
    pop = document.createElement("div");
    pop.className = "pm-popover";
    pop.setAttribute("role", "dialog");
    pop.setAttribute("aria-modal", "false");
    pop.hidden = true;
    pop.addEventListener("mouseenter", () => clearTimeout(hoverTimer));
    document.body.appendChild(pop);
    document.addEventListener("click", (e) => { if (pop.hidden) return; if (!pop.contains(e.target) && !(anchor && anchor.contains(e.target))) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !pop.hidden) { close(); if (anchor) anchor.focus(); } });
    window.addEventListener("resize", () => { if (!pop.hidden && anchor) place(anchor); });
    return pop;
  }

  function open(btn) {
    const id = btn.getAttribute("data-term");
    const e = terms.get(id);
    if (!e) { warn("missing entry for \"" + id + "\""); return; } // never an empty popover
    const p = ensurePopover();
    if (anchor && anchor !== btn) anchor.setAttribute("aria-expanded", "false");
    anchor = btn; openId = id;
    p.innerHTML = `
      <p class="pm-popover__term">${escHtml(e.term_de)}</p>
      <p class="pm-popover__def">${escHtml(e.definition_de)}</p>
      <p class="pm-popover__why"><strong>${escHtml(t("glossary.why"))}</strong> ${escHtml(e.why_de || "")}</p>
      ${e.example_de ? `<p class="pm-popover__ex"><strong>${escHtml(t("glossary.example"))}</strong> ${escHtml(e.example_de)}</p>` : ""}`;
    p.setAttribute("aria-label", e.term_de);
    p.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    place(btn);
    const screen = (window.pmSession && window.pmSession.current() && window.pmSession.current().lastScreen) || location.pathname;
    track("glossary_open", { term_id: id, screen });
  }

  function close() {
    if (!pop || pop.hidden) return;
    pop.hidden = true;
    if (anchor) anchor.setAttribute("aria-expanded", "false");
    openId = null;
  }

  function place(btn) {
    const r = btn.getBoundingClientRect();
    const w = Math.min(340, window.innerWidth - 24);
    pop.style.width = w + "px";
    let left = r.left + window.scrollX;
    if (left + w > window.scrollX + window.innerWidth - 12) left = window.scrollX + window.innerWidth - 12 - w;
    if (left < window.scrollX + 12) left = window.scrollX + 12;
    pop.style.left = left + "px";
    pop.style.top = (r.bottom + window.scrollY + 8) + "px";
  }

  function escHtml(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  window.pmGlossary = { init, mark, reset, close, get size() { return terms.size; }, has: (id) => terms.has(id) };
})();
