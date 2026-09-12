/* =============================================================
   Portemonnaie — Quiz stage (S2 to S7 live here, PRD 6).
   Vanilla JS, no dependencies. One screen at a time.

   Strings from locales/*.json (locale.js); state in pm_session
   (session.js, saved on every input); progress via progress.js;
   events via track.js. Screens are interim placeholders until
   tasks 09 to 11 build S2 to S7 from PRD 6:
     · values  (SDGs from data/sdgs.json)  → S7  route /quiz/values
     · horizon                             → S4b route /quiz/situation
   Regulatory: quiz answers never map to products, weights or
   portfolio types (PRD 2.4).
   ============================================================= */

(function () {
  "use strict";

  const L = () => window.pmLocale;
  const S = () => window.pmSession;
  const t = (key, params) => L().t(key, params);
  const track = (name, payload) => { if (window.pmTrack) window.pmTrack.track(name, payload); };
  const isDe = () => L().lang() === "de";

  /* ---- SDG options (data/sdgs.json, PRD 7.4) ------------------- */
  let SDGS = [];
  function sdgTitle(s) { return isDe() ? s.title_de : (s.title_en || s.title_de); }
  function sdgOptions() {
    return SDGS.map((s) => ({
      value: s.id,
      label: t("quiz.values.sdg", { id: s.id, title: sdgTitle(s) }),
      hint: s.hover_de
    }));
  }

  /* ---- screens (ordered); route = PRD path, step = quiz sub step ---- */
  const SCREENS = [
    { id: "horizon", route: "/quiz/situation", type: "single", question: "quiz.situation.horizon.question",
      options: ["under_3y", "3_10y", "over_10y", "open"].map((v) => ({ value: v, label: "quiz.situation.horizon.options." + v })) },
    { id: "values", route: "/quiz/values", type: "multi", dynamic: "sdg", max: 5,
      intro: "quiz.values.intro", question: "quiz.values.question", help: "quiz.values.help" },
    { id: "mirror", route: "/quiz/values", type: "mirror",
      intro: "quiz.mirror.intro", title: "quiz.mirror.title", body: "quiz.mirror.body" },
    { id: "result", route: "/quiz/values", type: "result" }
  ];

  /* ---- state --------------------------------------------------- */
  const state = { i: 0, answers: {} };
  let stage;

  function hasAnswer(screen) {
    const a = state.answers[screen.id];
    return Array.isArray(a) ? a.length > 0 : a != null;
  }

  /* ---- persistence: every input into pm_session (PRD 5.4) ------ */
  function persist() {
    const Sx = S();
    if (!Sx || !Sx.current()) return;
    Sx.update({
      values: { sdgs: (state.answers.values || []).slice() },
      situation: { horizon: state.answers.horizon || null }
    });
  }
  function setRoute(route) {
    const Sx = S();
    if (Sx && Sx.current()) Sx.setScreen(route);
    // PRD path per sub step (conflict 16): pushState on clean URLs, hash on plain files
    try {
      if (/\.html$/.test(window.location.pathname)) window.history.replaceState(null, "", "#" + route.split("/").pop());
      else window.history.replaceState(null, "", route);
    } catch (e) { /* ignore */ }
    track("screen_view", { screen: route });
  }

  /* ---- rendering ----------------------------------------------- */
  function render() {
    const screen = SCREENS[state.i];
    setRoute(screen.route);
    if (window.pmProgress && S()) window.pmProgress.setSub(S().quizStepIndex(screen.route), S().QUIZ_STEPS.length);
    if (screen.type === "result") return renderResult(screen);
    if (screen.type === "mirror") return renderMirror(screen);
    return renderQuestion(screen);
  }

  function optionList(screen) {
    if (screen.dynamic === "sdg") return sdgOptions();
    return screen.options.map((o) => ({ value: o.value, label: t(o.label) }));
  }

  function renderQuestion(screen) {
    const isMulti = screen.type === "multi";
    const opts = optionList(screen);
    const sel = state.answers[screen.id] || (isMulti ? [] : null);

    const card = el("div", "quiz-card-screen reveal-now");
    if (screen.intro) card.appendChild(el("p", "quiz-intro", t(screen.intro)));
    card.appendChild(el("h1", "quiz-question", t(screen.question)));
    if (screen.help) card.appendChild(el("p", "quiz-help", t(screen.help)));

    const list = el("div", "quiz-options" + (isMulti ? " quiz-options--multi" : ""));
    opts.forEach((o) => {
      const active = isMulti ? sel.indexOf(o.value) !== -1 : sel === o.value;
      const btn = el("button", "quiz-opt" + (active ? " is-selected" : ""));
      btn.type = "button";
      btn.setAttribute("role", isMulti ? "checkbox" : "radio");
      btn.setAttribute("aria-checked", active ? "true" : "false");
      const txt = el("span", "quiz-opt__text");
      txt.appendChild(el("span", "quiz-opt__label", o.label));
      if (o.hint) txt.appendChild(el("span", "quiz-opt__hint", o.hint));
      btn.appendChild(txt);
      if (isMulti) btn.appendChild(el("span", "quiz-opt__check", ""));
      btn.addEventListener("click", () => toggle(screen, o));
      list.appendChild(btn);
    });
    card.appendChild(list);

    mount(card, screen, { canNext: screen.optional ? true : hasAnswer(screen) });
  }

  function toggle(screen, opt) {
    if (screen.type === "single") {
      state.answers[screen.id] = opt.value;
      persist();
      if (screen.id === "horizon") track("situation_answered", { horizon: opt.value });
      next();
      return;
    }
    let arr = state.answers[screen.id] ? state.answers[screen.id].slice() : [];
    if (arr.indexOf(opt.value) !== -1) {
      arr = arr.filter((v) => v !== opt.value);
    } else {
      if (screen.max && arr.length >= screen.max) return; // PRD S7: at 5, further tiles inactive
      arr.push(opt.value);
    }
    state.answers[screen.id] = arr;
    persist();
    render();
  }

  function renderMirror(screen) {
    const card = el("div", "quiz-mirror reveal-now");
    const chosen = (state.answers.values || []).slice().sort((a, b) => a - b)
      .map((id) => SDGS.find((s) => s.id === id)).filter(Boolean);

    card.appendChild(el("p", "quiz-intro", t(screen.intro)));
    card.appendChild(el("h1", "quiz-question", t(screen.title)));
    if (chosen.length) {
      const tags = el("div", "quiz-tags");
      chosen.forEach((s) => tags.appendChild(el("span", "quiz-tag", sdgTitle(s))));
      card.appendChild(tags);
    }
    card.appendChild(el("p", "quiz-mirror__body", t(screen.body)));
    mount(card, screen, { canNext: true });
  }

  /* Interim end of the quiz stage: no archetype, no allocation (PRD 2.4).
     S8 (summary.html) replaces this screen. */
  function renderResult() {
    persist();
    const sdgs = state.answers.values || [];
    track("values_selected", { sdg_ids: sdgs, count: sdgs.length });
    const card = el("div", "quiz-result reveal-now");
    card.appendChild(el("p", "quiz-eyebrow", t("quiz.result.eyebrow")));
    card.appendChild(el("h1", "quiz-result__title", t("quiz.result.title")));
    card.appendChild(el("p", "quiz-result__lede", t("quiz.result.lede")));
    const cta = el("a", "btn btn--primary", t("quiz.result.cta"));
    cta.href = "summary.html";
    cta.addEventListener("click", () => { if (S() && S().current()) S().setScreen("/summary"); });
    card.appendChild(cta);
    card.appendChild(el("p", "quiz-disclaimer", t("common.disclaimer")));
    stage.innerHTML = "";
    stage.appendChild(card);
  }

  /* ---- navigation chrome --------------------------------------- */
  function mount(card, screen, { canNext }) {
    stage.innerHTML = "";
    stage.appendChild(card);

    const nav = el("div", "quiz-nav");
    const back = el("button", "quiz-nav__back");
    back.type = "button";
    back.textContent = t("common.back");
    back.disabled = state.i === 0;
    back.addEventListener("click", prev);
    nav.appendChild(back);

    if (screen.type !== "single") {
      const fwd = el("button", "btn btn--primary quiz-nav__next");
      fwd.type = "button";
      fwd.textContent = t("common.continue");
      fwd.disabled = !canNext;
      fwd.addEventListener("click", next);
      nav.appendChild(fwd);
    }
    card.appendChild(nav);
  }

  function next() {
    if (state.i < SCREENS.length - 1) { state.i += 1; render(); window.scrollTo(0, 0); }
  }
  function prev() {
    // back never changes stored values (PRD 5.4): only the index moves
    if (state.i > 0) { state.i -= 1; render(); window.scrollTo(0, 0); }
  }

  /* ---- tiny DOM helper ----------------------------------------- */
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ---- boot ---------------------------------------------------- */
  function boot() {
    stage = document.getElementById("quizStage");
    if (!stage || !window.pmLocale) return;

    // a quiz page without a session (deep link) gets one; resume restores answers (PRD 5.4)
    const Sx = S();
    let saved = Sx && Sx.current();
    if (Sx && !saved) { saved = Sx.create({ locale: L().lang() }); track("session_start"); }
    if (saved) {
      if (saved.values && saved.values.sdgs && saved.values.sdgs.length) state.answers.values = saved.values.sdgs.slice();
      if (saved.situation && saved.situation.horizon) state.answers.horizon = saved.situation.horizon;
      // resume at the last quiz screen when the user comes back
      const idx = SCREENS.findIndex((sc) => sc.route === saved.lastScreen && sc.type !== "result" && sc.type !== "mirror");
      if (idx > 0) state.i = idx;
    }

    const sdgs = fetch("data/sdgs.json")
      .then((r) => (r.ok ? r.json() : { sdgs: [] }))
      .catch(() => ({ sdgs: [] }))
      .then((doc) => { SDGS = doc.sdgs || []; });

    Promise.all([sdgs, window.pmLocale.ready]).then(render);
    document.addEventListener("pm:localeready", () => { if (SDGS.length) render(); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
