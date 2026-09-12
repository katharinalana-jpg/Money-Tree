/* =============================================================
   Portemonnaie — Guidance Flow strings and locale formatting
   (PRD 5.5, decision 10.09.2026 on conflict 14).

   Strings live in locales/de.json (source) and locales/en.json
   (same keys, empty values fall back to German). This loader
   reuses the data-i18n / -html / -ph / -aria hooks of i18n.js
   and adds:
     pmLocale.t(key, params)      "{name}" placeholders
     pmLocale.tn(key, n, params)  picks key_one / key_other
     pmLocale.fmtNumber(n, opts)  Intl, de-AT: 1.500,00
     pmLocale.fmtCurrency(n)      de-AT: 1.500,00 €
     pmLocale.fmtPercent(n, d)    de-AT: 0,20 %
     pmLocale.ready               promise, resolves after first apply
   Dispatches "pm:localeready" after every apply (initial load and
   each language change). Pages render on that event.
   ============================================================= */
(function () {
  "use strict";

  const BASE = "de";
  const INTL = { de: "de-AT", en: "en-GB" };
  const dicts = {};      // lang → flat { "a.b.c": "..." }
  let current = BASE;
  let flat = {};

  function lang() {
    const l = (document.documentElement.lang || localStorage.getItem("pm_lang") || BASE).toLowerCase();
    return l.startsWith("en") ? "en" : "de";
  }

  function flatten(obj, prefix, out) {
    Object.keys(obj).forEach((k) => {
      const v = obj[k];
      const key = prefix ? prefix + "." + k : k;
      if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, key, out);
      else out[key] = v;
    });
    return out;
  }

  function fetchDict(l) {
    if (dicts[l]) return Promise.resolve(dicts[l]);
    return fetch("locales/" + l + ".json")
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({}))
      .then((doc) => { dicts[l] = flatten(doc, "", {}); return dicts[l]; });
  }

  function has(key) { return flat[key] != null && flat[key] !== ""; }

  function raw(key) {
    if (has(key)) return flat[key];
    const base = dicts[BASE] || {};
    if (base[key] != null && base[key] !== "") return base[key];
    if (typeof console !== "undefined") console.warn("[locale] missing key: " + key);
    return key;
  }

  function fill(s, params) {
    if (!params) return s;
    return String(s).replace(/\{(\w+)\}/g, (m, k) => (params[k] != null ? params[k] : m));
  }

  function t(key, params) { return fill(raw(key), params); }

  function tn(key, n, params) {
    const suffix = n === 1 ? "_one" : "_other";
    return fill(raw(key + suffix), Object.assign({ n: fmtNumber(n, { maximumFractionDigits: 0 }) }, params || {}));
  }

  function nf(opts) { return new Intl.NumberFormat(INTL[current] || INTL[BASE], opts); }
  function fmtNumber(n, opts) { return nf(opts || {}).format(n); }
  function fmtCurrency(n, opts) {
    return nf(Object.assign({ style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }, opts || {})).format(n);
  }
  function fmtPercent(n, digits) {
    // n is the percentage value (0.2 → "0,20 %"), not a fraction
    const d = digits == null ? 2 : digits;
    return nf({ minimumFractionDigits: d, maximumFractionDigits: d }).format(n) + " %";
  }

  function apply() {
    const each = (attr, fn) => document.querySelectorAll("[" + attr + "]").forEach((el) => {
      const key = el.getAttribute(attr);
      if (has(key) || (dicts[BASE] && dicts[BASE][key])) fn(el, t(key));
    });
    each("data-i18n", (el, v) => { el.textContent = v; });
    each("data-i18n-html", (el, v) => { el.innerHTML = v; });
    each("data-i18n-ph", (el, v) => { el.setAttribute("placeholder", v); });
    each("data-i18n-aria", (el, v) => { el.setAttribute("aria-label", v); });
    document.dispatchEvent(new CustomEvent("pm:localeready", { detail: { lang: current } }));
  }

  function load() {
    current = lang();
    const wanted = current === BASE ? [BASE] : [BASE, current];
    return Promise.all(wanted.map(fetchDict)).then(() => {
      flat = dicts[current] || dicts[BASE] || {};
      apply();
    });
  }

  const ready = load();
  document.addEventListener("pm:langchange", () => { load(); });

  window.pmLocale = { t, tn, has, lang: () => current, fmtNumber, fmtCurrency, fmtPercent, apply, ready };
})();
