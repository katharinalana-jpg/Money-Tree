/* =============================================================
   Portemonnaie — Quiz stage (S2 to S7 live here, PRD 6).
   Vanilla JS, no dependencies. One screen at a time.

   Screens (route = PRD path, sub step of the ProgressBar):
     S2 traps      /quiz/traps      eight flashcards (8.2)
     S3 phase      /quiz/phase      choose up to two phases
     S4b horizon   /quiz/situation  interim until task 10
     S7 values     /quiz/values     SDGs from data/sdgs.json
     mirror/result /quiz/values     interim until task 11 (S8)
   Strings from locales/*.json (locale.js); state in pm_session
   (session.js, saved on every input); progress via progress.js;
   glossary via glossary.js; events via track.js.
   Regulatory: quiz answers never map to products, weights or
   portfolio types (PRD 2.4).
   ============================================================= */

(function () {
  "use strict";

  const L = () => window.pmLocale;
  const S = () => window.pmSession;
  const t = (key, params) => L().t(key, params);
  const track = (name, payload) => { if (window.pmTrack) window.pmTrack.track(name, payload); };
  const glossary = () => { if (window.pmGlossary) { window.pmGlossary.reset(); window.pmGlossary.mark(stage); } };
  const isDe = () => L().lang() === "de";
  const reducedMotion = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- content ids ---------------------------------------------- */
  const TRAPS = ["berufseinstieg", "zusammenziehen", "mutterschaft", "teilzeit", "pflege", "trennung", "menopause", "pension"];

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

  /* ---- screens (ordered) ---------------------------------------- */
  const SCREENS = [
    { id: "traps", route: "/quiz/traps", type: "traps" },
    { id: "phase", route: "/quiz/phase", type: "phase", max: 2, min: 1 },
    { id: "horizon", route: "/quiz/situation", type: "single", question: "quiz.situation.horizon.question",
      options: ["under_3y", "3_10y", "over_10y", "open"].map((v) => ({ value: v, label: "quiz.situation.horizon.options." + v })) },
    { id: "values", route: "/quiz/values", type: "multi", dynamic: "sdg", max: 5,
      intro: "quiz.values.intro", question: "quiz.values.question", help: "quiz.values.help" },
    { id: "mirror", route: "/quiz/values", type: "mirror",
      intro: "quiz.mirror.intro", title: "quiz.mirror.title", body: "quiz.mirror.body" },
    { id: "result", route: "/quiz/values", type: "result" }
  ];

  /* ---- state --------------------------------------------------- */
  const state = { i: 0, answers: {}, traps: { viewed: [], flipped: null } };
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
      traps: { viewed: state.traps.viewed.slice() },
      phase: { selected: (state.answers.phase || []).slice() },
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
    if (screen.type === "traps") renderTraps(screen);
    else if (screen.type === "phase") renderPhase(screen);
    else if (screen.type === "result") renderResult(screen);
    else if (screen.type === "mirror") renderMirror(screen);
    else renderQuestion(screen);
    glossary(); // first occurrence per screen (PRD 5.2)
  }

  /* ---- S2 · Lifetime Traps (flashcards) ------------------------- */
  function renderTraps(screen) {
    const card = el("div", "quiz-traps reveal-now");
    const head = el("div", "traps__head");
    const h1 = el("h1", "quiz-question traps__headline");
    // headline figure carries its source as a tooltip (PRD S2)
    const text = t("quiz.traps.headline");
    const figure = t("quiz.traps.headline_figure");
    const idx = text.indexOf(figure);
    if (idx >= 0) {
      h1.appendChild(document.createTextNode(text.slice(0, idx)));
      const fig = el("button", "traps__figure", figure);
      fig.type = "button";
      fig.setAttribute("aria-describedby", "trapsSource");
      fig.title = t("quiz.traps.headline_source");
      h1.appendChild(fig);
      h1.appendChild(document.createTextNode(text.slice(idx + figure.length)));
    } else h1.textContent = text;
    head.appendChild(h1);
    const src = el("p", "traps__source", t("quiz.traps.source_prefix") + " " + t("quiz.traps.headline_source"));
    src.id = "trapsSource";
    head.appendChild(src);
    const counter = el("p", "traps__counter");
    counter.setAttribute("aria-live", "polite");
    head.appendChild(counter);
    card.appendChild(head);

    const grid = el("ul", "traps__grid");
    grid.setAttribute("role", "list");
    TRAPS.forEach((id, i) => grid.appendChild(trapCard(id, i, counter)));
    card.appendChild(grid);
    updateCounter(counter);
    mount(card, screen, { canNext: true, nextLabel: t("common.continue") });
  }

  function updateCounter(counter) {
    counter.textContent = t("quiz.traps.counter", { n: state.traps.viewed.length, total: TRAPS.length });
  }

  function trapCard(id, i, counter) {
    const li = el("li", "trap" + (state.traps.viewed.includes(id) ? " is-viewed" : ""));
    li.dataset.trap = id;
    const inner = el("div", "trap__inner" + (reducedMotion() ? " trap__inner--fade" : ""));
    // front
    const front = el("button", "trap__face trap__front");
    front.type = "button";
    front.setAttribute("aria-expanded", "false");
    front.setAttribute("aria-label", t("quiz.traps.card." + id + ".title") + " – " + t("quiz.traps.flip_aria"));
    front.appendChild(trapIcon(i));
    front.appendChild(el("span", "trap__title", t("quiz.traps.card." + id + ".title")));
    const badge = el("span", "trap__badge");
    badge.setAttribute("aria-hidden", "true");
    badge.innerHTML = `<svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    front.appendChild(badge);
    // back
    const back = el("div", "trap__face trap__back");
    back.hidden = true;
    const body = t("quiz.traps.card." + id + ".body");
    const firstEnd = body.indexOf(". ");
    const quote = firstEnd > 0 ? body.slice(0, firstEnd + 1) : body;
    const rest = firstEnd > 0 ? body.slice(firstEnd + 2) : "";
    back.appendChild(el("p", "trap__back-title", t("quiz.traps.card." + id + ".title")));
    back.appendChild(el("p", "trap__quote", quote));
    if (rest) back.appendChild(el("p", "trap__text", rest));
    back.appendChild(el("p", "trap__src", t("quiz.traps.card." + id + ".source")));
    const nav = el("div", "trap__nav");
    const prevBtn = el("button", "trap__arrow", "‹"); prevBtn.type = "button"; prevBtn.setAttribute("aria-label", t("quiz.traps.prev_aria"));
    const closeBtn = el("button", "trap__close", t("quiz.traps.flip_back")); closeBtn.type = "button";
    const nextBtn = el("button", "trap__arrow", "›"); nextBtn.type = "button"; nextBtn.setAttribute("aria-label", t("quiz.traps.next_aria"));
    nav.appendChild(prevBtn); nav.appendChild(closeBtn); nav.appendChild(nextBtn);
    back.appendChild(nav);
    inner.appendChild(front); inner.appendChild(back);
    li.appendChild(inner);

    const flip = (open) => {
      li.classList.toggle("is-flipped", open);
      front.setAttribute("aria-expanded", String(open));
      back.hidden = !open;
      // never scroll inside the card: grow the flipped card to its back text (min 360 px)
      li.style.height = open ? Math.max(360, back.scrollHeight) + "px" : "";
      if (open) {
        if (!state.traps.viewed.includes(id)) { state.traps.viewed.push(id); li.classList.add("is-viewed"); persist(); updateCounter(counter); }
        track("trap_card_flip", { trap_id: id });
        closeBtn.focus();
      } else front.focus();
    };
    front.addEventListener("click", () => flip(true));
    front.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(true); } });
    closeBtn.addEventListener("click", () => flip(false));
    back.addEventListener("keydown", (e) => { if (e.key === "Escape") flip(false); });
    const go = (delta) => {
      flip(false);
      const target = li.parentElement.children[(i + delta + TRAPS.length) % TRAPS.length];
      target.querySelector(".trap__front").click();
    };
    prevBtn.addEventListener("click", () => go(-1));
    nextBtn.addEventListener("click", () => go(1));
    return li;
  }

  /* simple line icons (no emoji): eight botanical/abstract marks */
  function trapIcon(i) {
    const marks = [
      "M4 20 L12 4 L20 20", "M4 12 A8 8 0 1 0 20 12 A8 8 0 1 0 4 12", "M12 4 C6 10 6 16 12 20 C18 16 18 10 12 4",
      "M4 12 H20 M12 4 V20", "M4 18 C8 6 16 6 20 18", "M6 4 L18 20 M18 4 L6 20", "M4 16 Q12 4 20 16", "M12 4 L20 12 L12 20 L4 12 Z"
    ];
    const wrap = el("span", "trap__icon");
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML = `<svg viewBox="0 0 24 24"><path d="${marks[i % marks.length]}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    return wrap;
  }

  /* ---- S3 · Deine Phase ----------------------------------------- */
  function renderPhase(screen) {
    const sel = state.answers.phase || [];
    const card = el("div", "quiz-card-screen quiz-phase reveal-now");
    card.appendChild(el("h1", "quiz-question", t("quiz.phase.question")));
    card.appendChild(el("p", "quiz-help", t("quiz.phase.help")));

    const grid = el("div", "phase__grid");
    grid.setAttribute("role", "group");
    grid.setAttribute("aria-label", t("quiz.phase.question"));
    TRAPS.forEach((id) => {
      const active = sel.includes(id);
      const full = !active && sel.length >= screen.max;
      const btn = el("button", "phase__card" + (active ? " is-selected" : "") + (full ? " is-inactive" : ""));
      btn.type = "button";
      btn.setAttribute("role", "checkbox");
      btn.setAttribute("aria-checked", String(active));
      if (full) btn.setAttribute("aria-disabled", "true");
      btn.appendChild(el("span", "phase__title", t("quiz.traps.card." + id + ".title")));
      btn.appendChild(el("span", "quiz-opt__check", ""));
      btn.addEventListener("click", () => {
        if (full) return;
        let arr = sel.slice();
        if (arr.includes(id)) arr = arr.filter((x) => x !== id); else arr.push(id);
        state.answers.phase = arr;
        persist();
        track("phase_selected", { phase_ids: arr });
        render();
      });
      grid.appendChild(btn);
    });
    card.appendChild(grid);

    // feedback of the first chosen phase (PRD S3), fade-in
    if (sel.length) {
      const fb = el("div", "phase__feedback reveal-now");
      fb.setAttribute("role", "status");
      fb.innerHTML = window.pmInfoNote
        ? window.pmInfoNote.html("know", "", { bodyText: t("quiz.phase.feedback." + sel[0]) })
        : "";
      card.appendChild(fb);
    }
    mount(card, screen, { canNext: sel.length >= screen.min, nextLabel: t("quiz.phase.cta") });
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
    stage.innerHTML = "";
    stage.appendChild(card);
  }

  /* ---- navigation chrome --------------------------------------- */
  function mount(card, screen, { canNext, nextLabel }) {
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
      fwd.textContent = nextLabel || t("common.continue");
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
      if (saved.traps && Array.isArray(saved.traps.viewed)) state.traps.viewed = saved.traps.viewed.slice();
      if (saved.phase && saved.phase.selected && saved.phase.selected.length) state.answers.phase = saved.phase.selected.slice();
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

    const gl = window.pmGlossary ? window.pmGlossary.init() : Promise.resolve(0);
    Promise.all([sdgs, gl, window.pmLocale.ready]).then(render);
    document.addEventListener("pm:localeready", () => { if (SDGS.length) render(); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
