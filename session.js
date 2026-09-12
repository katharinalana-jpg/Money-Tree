/* =============================================================
   Portemonnaie — Guidance Flow session (PRD 5.4, 7.1; decisions
   on conflicts 9 and 16).

   One state object `pm_session` in localStorage: created on S0
   "Los geht's", saved on every input, valid for 30 days from
   startedAt, reset only by the user. Back navigation never
   changes stored values (nothing here deletes on navigation).

   Exposed as window.pmSession in the browser. For node --test the
   factory is exported: createSession({ storage, now }).
   ============================================================= */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.pmSessionFactory = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const KEY = "pm_session";
  const SCHEMA_VERSION = 1;
  const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
  const FIRST_SCREEN = "/quiz/traps";

  /* Stages (decision 10.09.2026: four, S11 out of scope) and the page that
     serves each PRD route (decision on conflict 16, one page per stage). */
  const STAGES = [
    { key: "quiz",      prefix: "/quiz",      page: "quiz.html",      route: "/quiz/traps" },
    { key: "summary",   prefix: "/summary",   page: "summary.html",   route: "/summary" },
    { key: "explore",   prefix: "/explore",   page: "explore.html",   route: "/explore" },
    { key: "portfolio", prefix: "/portfolio", page: "portfolio.html", route: "/portfolio" }
  ];
  const QUIZ_STEPS = ["traps", "phase", "situation", "portfolio", "impact", "values"]; // PRD 5.1: 6 sub steps

  function uuid() {
    const c = (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto : null;
    if (c) return c.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => {
      const r = (Math.random() * 16) | 0;
      return (ch === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  function isPlainObject(v) { return v && typeof v === "object" && !Array.isArray(v); }
  function merge(target, patch) {
    Object.keys(patch || {}).forEach((k) => {
      if (isPlainObject(patch[k]) && isPlainObject(target[k])) merge(target[k], patch[k]);
      else target[k] = Array.isArray(patch[k]) ? patch[k].slice() : patch[k];
    });
    return target;
  }

  return function createSession(opts) {
    const storage = (opts && opts.storage) || (typeof localStorage !== "undefined" ? localStorage : null);
    const now = (opts && opts.now) || (() => Date.now());
    const listeners = [];

    function read() {
      try {
        const s = JSON.parse(storage.getItem(KEY));
        return isPlainObject(s) ? s : null;
      } catch (e) { return null; }
    }
    function write(session) {
      try { storage.setItem(KEY, JSON.stringify(session)); } catch (e) { /* storage blocked */ }
      listeners.forEach((fn) => { try { fn(session); } catch (e) { /* listener error */ } });
      return session;
    }
    function isValid(s) {
      if (!s || s.schemaVersion !== SCHEMA_VERSION) return false;
      const t = Date.parse(s.startedAt);
      return Number.isFinite(t) && now() - t <= MAX_AGE_MS;
    }
    function create(extra) {
      const s = {
        schemaVersion: SCHEMA_VERSION,
        sessionId: uuid(),
        startedAt: new Date(now()).toISOString(),
        lastScreen: FIRST_SCREEN,
        locale: (extra && extra.locale) || "de",
        referrer: (extra && extra.referrer) || null,     // decision on conflict 9
        traps: { viewed: [] },
        phase: { selected: [] },
        situation: { monthlyRange: null, monthlyAmount: null, horizon: null },
        portfolioEducation: { viewed: false },
        impact: { viewed: false },
        values: { sdgs: [] },
        portfolio: { items: [], completedAt: null },
        checkout: { pdfDownloaded: false, emailSent: false, newsletterOptIn: false }
      };
      return write(s);
    }
    function reset() {
      try { storage.removeItem(KEY); } catch (e) { /* ignore */ }
    }
    /* Valid session or null; never creates. */
    function current() {
      const s = read();
      return isValid(s) ? s : null;
    }
    /* Merge a partial patch into the valid session and save (PRD 5.4:
       every input is persisted immediately). No-op without a valid session. */
    function update(patch) {
      const s = current();
      if (!s) return null;
      return write(merge(s, patch));
    }
    function setScreen(route) { return update({ lastScreen: route }); }

    function stageOf(route) {
      return STAGES.find((st) => typeof route === "string" && route.startsWith(st.prefix)) || STAGES[0];
    }
    function stageIndex(route) { return STAGES.indexOf(stageOf(route)); }
    function pageFor(route) { return stageOf(route).page; }
    function quizStepIndex(route) {
      const m = /^\/quiz\/([a-z]+)/.exec(route || "");
      const i = m ? QUIZ_STEPS.indexOf(m[1]) : -1;
      return i < 0 ? 0 : i;
    }
    /* Highest stage the user may navigate to (PRD 5.1: reached stages are
       clickable). Derived from data, not stored. */
    function reachedIndex(s) {
      if (!s) return 0;
      let i = stageIndex(s.lastScreen);
      if (s.values && s.values.sdgs && s.values.sdgs.length) i = Math.max(i, 1);
      if (s.portfolio && s.portfolio.items && s.portfolio.items.length) i = Math.max(i, 3);
      return i;
    }

    function onChange(fn) { listeners.push(fn); }

    return {
      KEY, SCHEMA_VERSION, MAX_AGE_MS, FIRST_SCREEN, STAGES, QUIZ_STEPS,
      read, write, isValid, create, reset, current, update, setScreen,
      stageOf, stageIndex, pageFor, quizStepIndex, reachedIndex, onChange
    };
  };
});

/* ---- browser: singleton + S0 wiring ------------------------------ */
(function () {
  if (typeof window === "undefined" || !window.pmSessionFactory) return;
  const S = window.pmSessionFactory();
  window.pmSession = S;
  const track = (name, payload) => { if (window.pmTrack) window.pmTrack.track(name, payload); };

  /* referral landing (PRD S8 / decision on conflict 9): anonymous ref only */
  const ref = new URLSearchParams(window.location.search).get("ref");
  if (ref && /^[A-Za-z0-9_-]{4,64}$/.test(ref)) {
    const s = S.current();
    if (s && !s.referrer) S.update({ referrer: ref });
    track("referral_landing", { ref });
  }

  const start = document.getElementById("s0Start");
  if (!start) return;

  const banner = document.getElementById("s0Resume");
  const text = document.getElementById("s0ResumeText");
  const cont = document.getElementById("s0Continue");
  const restart = document.getElementById("s0Restart");
  const Lc = () => window.pmLocale;
  const t = (key, params) => (Lc() && Lc().has(key)) ? Lc().t(key, params) : key;
  const locale = () => (Lc() ? Lc().lang() : "de");

  function renderBanner() {
    const s = S.current();
    if (!s) { banner.hidden = true; return; }
    const stage = S.stageOf(s.lastScreen);
    text.textContent = t("s0.resume", { step: t("common.stages." + stage.key) });
    banner.hidden = false;
  }

  function begin() {
    const existing = S.current();
    if (existing && !window.confirm(t("s0.restart_confirm"))) return false;
    if (existing) track("session_reset");
    S.reset();
    S.create({ locale: locale(), referrer: ref && /^[A-Za-z0-9_-]{4,64}$/.test(ref) ? ref : (existing && existing.referrer) || null });
    track("session_start");
    return true;
  }

  start.addEventListener("click", (e) => { if (!begin()) e.preventDefault(); });

  cont.addEventListener("click", () => {
    const s = S.current();
    if (!s) { renderBanner(); return; }
    track("session_resume");
    window.location.href = S.pageFor(s.lastScreen);
  });

  restart.addEventListener("click", () => {
    if (!window.confirm(t("s0.restart_confirm"))) return;
    track("session_reset");
    S.reset();
    S.create({ locale: locale() });
    track("session_start");
    window.location.href = S.pageFor(S.FIRST_SCREEN);
  });

  if (Lc()) Lc().ready.then(renderBanner); else renderBanner();
  document.addEventListener("pm:localeready", renderBanner);
})();
