/* =============================================================
   Portemonnaie — analytics helper (PRD 9; decision 12.09.2026 on
   conflict 12: no-op transport).

   track(name, payload): only event names from PRD 9, only the
   payload keys listed per event. Every event carries a hash of
   the sessionId (never the id itself), screen, locale, timestamp.
   No e-mail addresses, no free text: unknown keys are dropped,
   string values are capped and anything that looks like an e-mail
   is removed. Transport is a no-op buffer; setTransport(fn) wires
   Plausible or Matomo later without touching call sites.

   window.pmTrack in the browser; factory exported for node --test.
   ============================================================= */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.pmTrackFactory = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  /* PRD 9 event names → allowed payload keys */
  const EVENTS = Object.freeze({
    session_start: [], session_resume: [], session_reset: [],
    screen_view: ["screen"],
    trap_card_flip: ["trap_id"],
    phase_selected: ["phase_ids"],
    situation_answered: ["monthlyRange", "horizon"],
    values_selected: ["sdg_ids", "count"],
    summary_view: [], summary_cta_click: [],
    share_open: [], share_action: ["channel"],
    referral_landing: ["ref"],
    explore_filter_change: ["filterType", "value"],
    product_open: ["product_id"], product_add: ["product_id"], product_remove: ["product_id"],
    weight_change: [],
    glossary_open: ["term_id", "screen"],
    portfolio_complete: ["itemCount", "mix", "sustainabilityScore", "genderScore", "sdgCoverage"],
    plan_download: [], plan_email_sent: [], newsletter_optin: ["optIn"],
    execute_view: [], partner_click: ["partner_id", "kind"]
  });
  const MAX_STRING = 64;
  const EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/;

  /* FNV-1a 32-bit, hex: a stable, non-reversible-enough token for funnels */
  function hash(str) {
    let h = 0x811c9dc5;
    const s = String(str || "");
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return ("0000000" + h.toString(16)).slice(-8);
  }

  function clean(value) {
    if (value == null) return null;
    if (typeof value === "boolean" || typeof value === "number") return value;
    if (typeof value === "string") return EMAIL.test(value) ? null : value.slice(0, MAX_STRING);
    if (Array.isArray(value)) return value.slice(0, 20).map(clean);
    if (typeof value === "object") {
      const out = {};
      Object.keys(value).slice(0, 12).forEach((k) => { out[k] = clean(value[k]); });
      return out;
    }
    return null;
  }

  return function createTracker(opts) {
    const o = opts || {};
    const getSessionId = o.getSessionId || (() => null);
    const getScreen = o.getScreen || (() => null);
    const getLocale = o.getLocale || (() => "de");
    const now = o.now || (() => new Date().toISOString());
    const buffer = [];
    let transport = o.transport || null;     // null = no-op
    let debug = !!o.debug;

    function track(name, payload) {
      const allowed = EVENTS[name];
      if (!allowed) {
        if (debug && typeof console !== "undefined") console.warn("[track] unknown event: " + name);
        return null;
      }
      const data = {};
      allowed.forEach((k) => { if (payload && payload[k] !== undefined) data[k] = clean(payload[k]); });
      const event = {
        name,
        sessionId: hash(getSessionId()),     // hash only (PRD 9)
        screen: (payload && payload.screen) || getScreen(),
        locale: getLocale(),
        timestamp: now(),
        data
      };
      buffer.push(event);
      if (buffer.length > 500) buffer.shift();
      if (debug && typeof console !== "undefined") console.debug("[track]", event.name, event);
      if (transport) { try { transport(event); } catch (e) { /* never break the UI */ } }
      return event;
    }

    return {
      EVENTS, track, hash,
      events: () => buffer.slice(),
      clear: () => { buffer.length = 0; },
      setTransport: (fn) => { transport = typeof fn === "function" ? fn : null; },
      setDebug: (on) => { debug = !!on; }
    };
  };
});

/* ---- browser singleton ------------------------------------------- */
(function () {
  if (typeof window === "undefined" || !window.pmTrackFactory) return;
  let debug = false;
  try { debug = localStorage.getItem("pm_debug") === "1" || /^(localhost|127\.0\.0\.1)$/.test(location.hostname); } catch (e) { /* ignore */ }
  window.pmTrack = window.pmTrackFactory({
    getSessionId: () => { const s = window.pmSession && window.pmSession.current(); return s ? s.sessionId : ""; },
    getScreen: () => { const s = window.pmSession && window.pmSession.current(); return s ? s.lastScreen : location.pathname; },
    getLocale: () => (window.pmLocale ? window.pmLocale.lang() : (document.documentElement.lang || "de")),
    debug
  });
})();
