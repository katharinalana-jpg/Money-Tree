/* =============================================================
   Portemonnaie — Guidance Flow session (PRD 5.4, 7.1)

   One state object `pm_session` in localStorage. Created on S0
   "Los geht's", saved on every input by the flow pages, kept for
   30 days, reset only by the user. Exposed as window.pmSession
   so every flow page shares the same helper (no build step).

   S0 wiring (resume banner, start, restart) runs only when the
   S0 elements exist on the page.
   ============================================================= */
(function () {
  "use strict";

  const KEY = "pm_session";
  const SCHEMA_VERSION = 1;
  const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

  /* PRD route → stage label key + the HTML page that serves it
     (routes decision 10.09.2026: one page per stage, vercel.json
     rewrites the PRD paths). S11 is out of scope (decision 10.09.2026). */
  const STAGES = [
    { prefix: "/quiz",      label: "s0.stage1", page: "quiz.html" },
    { prefix: "/summary",   label: "s0.stage2", page: "summary.html" },
    { prefix: "/explore",   label: "s0.stage3", page: "explore.html" },
    { prefix: "/portfolio", label: "s0.stage4", page: "portfolio.html" }
  ];
  const FIRST_SCREEN = "/quiz/traps";

  function locale() {
    return (document.documentElement.lang || "de").toLowerCase().startsWith("en") ? "en" : "de";
  }

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  function read() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      return s && typeof s === "object" ? s : null;
    } catch (e) { return null; }
  }

  function write(session) {
    try { localStorage.setItem(KEY, JSON.stringify(session)); } catch (e) { /* storage blocked */ }
    return session;
  }

  /* Valid = current schema and started within 30 days (PRD 5.4). */
  function isValid(s) {
    if (!s || s.schemaVersion !== SCHEMA_VERSION) return false;
    const t = Date.parse(s.startedAt);
    return Number.isFinite(t) && Date.now() - t <= MAX_AGE_MS;
  }

  function create() {
    return write({
      schemaVersion: SCHEMA_VERSION,
      sessionId: uuid(),
      startedAt: new Date().toISOString(),
      lastScreen: FIRST_SCREEN,
      locale: locale(),
      traps: { viewed: [] },
      phase: { selected: [] },
      situation: { monthlyRange: null, monthlyAmount: null, horizon: null },
      portfolioEducation: { viewed: false },
      impact: { viewed: false },
      values: { sdgs: [] },
      portfolio: { items: [], completedAt: null },
      checkout: { pdfDownloaded: false, emailSent: false, newsletterOptIn: false }
    });
  }

  function reset() {
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
  }

  function stageOf(route) {
    return STAGES.find((st) => typeof route === "string" && route.startsWith(st.prefix)) || STAGES[0];
  }

  function t(key) {
    return (window.PMI18n && typeof window.PMI18n.t === "function") ? window.PMI18n.t(key) : null;
  }

  window.pmSession = { KEY, SCHEMA_VERSION, read, write, isValid, create, reset, stageOf, FIRST_SCREEN };

  /* ---- S0 wiring ---------------------------------------------- */
  const start = document.getElementById("s0Start");
  if (!start) return;

  const banner = document.getElementById("s0Resume");
  const text = document.getElementById("s0ResumeText");
  const cont = document.getElementById("s0Continue");
  const restart = document.getElementById("s0Restart");

  const FALLBACK = {
    de: { resume: "Du warst bei Schritt {step}.", confirm: "Deine bisherigen Antworten werden gelöscht.",
          stages: ["Quiz", "Zusammenfassung", "Explorer", "Portfolio"] },
    en: { resume: "You were at step {step}.", confirm: "Your previous answers will be deleted.",
          stages: ["Quiz", "Summary", "Explorer", "Portfolio"] }
  };

  function copy(key, idx) {
    const v = t(key);
    if (v) return v;
    const f = FALLBACK[locale()];
    if (key === "s0.resume") return f.resume;
    if (key === "s0.restart_confirm") return f.confirm;
    return f.stages[idx] || "";
  }

  function renderBanner() {
    const s = read();
    if (!isValid(s)) { banner.hidden = true; return; }
    const stage = stageOf(s.lastScreen);
    const idx = STAGES.indexOf(stage);
    text.textContent = copy("s0.resume").replace("{step}", copy(stage.label, idx));
    banner.hidden = false;
  }

  function begin() {
    const s = read();
    if (isValid(s) && !window.confirm(copy("s0.restart_confirm"))) return false;
    create();
    return true;
  }

  start.addEventListener("click", (e) => {
    if (!begin()) e.preventDefault();
  });

  cont.addEventListener("click", () => {
    const s = read();
    if (!isValid(s)) { renderBanner(); return; }
    window.location.href = stageOf(s.lastScreen).page;
  });

  restart.addEventListener("click", () => {
    if (!window.confirm(copy("s0.restart_confirm"))) return;
    reset();
    create();
    window.location.href = stageOf(FIRST_SCREEN).page;
  });

  renderBanner();
  document.addEventListener("pm:langchange", renderBanner);
})();
