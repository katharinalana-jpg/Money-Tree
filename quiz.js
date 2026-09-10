/* =============================================================
   Portemonnaie — Quiz stage (S2 to S7 will live here, PRD 6).
   Vanilla JS, no dependencies. One screen at a time.

   State of this file after task 02: the screen engine is kept
   (render / mount / progress / language switch). The archetype,
   risk scoring and their screens are removed (PRD 2.4). The
   remaining screens are placeholders for the PRD rebuild:
     · values (SDGs from data/sdgs.json)  → S7
     · mirror                             → S8 preview
     · horizon                            → S4b
   Copy here is interim and gets replaced by PRD 6 strings.

   Language: reads <html lang> set by i18n.js (pm_lang).
   Regulatory: quiz answers never map to products, weights or
   portfolio types (PRD 2.4).
   ============================================================= */

(function () {
  "use strict";

  /* ---- language ------------------------------------------------ */
  const LANG_KEY = "pm_lang";
  function getLang() {
    const l = (document.documentElement.lang || localStorage.getItem(LANG_KEY) || "").toLowerCase();
    return l === "de" ? "de" : "en";
  }
  function t(node) {
    if (node == null) return "";
    if (typeof node === "string") return node;
    return node[getLang()] || node.en || node.de || "";
  }

  const DISCLAIMER = {
    de: "Die Informationen stellen keine Anlageberatung, keine sonstige Empfehlung und kein Angebot zum Kauf von Wertpapieren oder zur Vornahme bestimmter Investitionen dar.",
    en: "The information does not constitute investment advice, any other recommendation, or an offer to buy securities or to make specific investments."
  };

  /* ---- SDG options (data/sdgs.json, PRD 7.4) ------------------- */
  let SDGS = [];
  function sdgOptions() {
    return SDGS.map((s) => ({
      value: s.id,
      label: { de: `SDG ${s.id} · ${s.title_de}`, en: `SDG ${s.id} · ${s.title_en || s.title_de}` },
      hint: { de: s.hover_de, en: s.hover_de }
    }));
  }

  /* ---- screens (ordered) --------------------------------------- */
  // type: "multi" | "single" | "mirror" | "result"
  const SCREENS = [
    {
      id: "values", type: "multi", dynamic: "sdg", max: 5,
      intro: { de: "Das sind die 17 Ziele der Vereinten Nationen für eine bessere Welt.", en: "These are the United Nations' 17 goals for a better world." },
      question: { de: "Was ist dir persönlich wichtig?", en: "What matters to you personally?" },
      help: { de: "Wähle 1 bis 5.", en: "Choose 1 to 5." }
    },
    {
      id: "mirror", type: "mirror",
      title: { de: "Das ist dir wichtig.", en: "This is what matters to you." },
      body: {
        de: "Was davon wirklich ins Portfolio kommt, entscheidest du später. Frei.",
        en: "What actually makes it into your portfolio, you decide later. Freely."
      }
    },
    {
      id: "horizon", type: "single",
      question: { de: "Wann möchtest du voraussichtlich auf das Geld zugreifen?", en: "When do you expect to access the money?" },
      options: [
        { value: "under_3y", label: { de: "in unter 3 Jahren", en: "in under 3 years" } },
        { value: "3_10y",    label: { de: "in 3–10 Jahren", en: "in 3 to 10 years" } },
        { value: "over_10y", label: { de: "in mehr als 10 Jahren", en: "in more than 10 years" } },
        { value: "open",     label: { de: "Das ist offen", en: "That is open" } }
      ]
    },
    { id: "result", type: "result" }
  ];

  /* ---- state --------------------------------------------------- */
  const state = { i: 0, answers: {} };
  let stage, bar, progressLabel;

  function questionScreens() {
    return SCREENS.filter((s) => s.type === "single" || s.type === "multi");
  }
  function answeredCount() {
    return questionScreens().filter((s) => hasAnswer(s)).length;
  }

  /* ---- rendering ----------------------------------------------- */
  function render() {
    const screen = SCREENS[state.i];
    updateProgress();
    if (screen.type === "result") return renderResult(screen);
    if (screen.type === "mirror") return renderMirror(screen);
    return renderQuestion(screen);
  }

  function updateProgress() {
    const total = questionScreens().length;
    const done = answeredCount();
    const pct = Math.round((done / total) * 100);
    bar.style.width = pct + "%";
    const word = getLang() === "de" ? "Frage" : "Question";
    const screen = SCREENS[state.i];
    const isQ = screen.type === "single" || screen.type === "multi";
    const idx = isQ ? questionScreens().indexOf(screen) + 1 : Math.min(done + 1, total);
    progressLabel.textContent = word + " " + idx + " / " + total;
  }

  function optionList(screen) {
    return screen.dynamic === "sdg" ? sdgOptions() : screen.options;
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
      txt.appendChild(el("span", "quiz-opt__label", t(o.label)));
      if (o.hint) txt.appendChild(el("span", "quiz-opt__hint", t(o.hint)));
      btn.appendChild(txt);
      if (isMulti) btn.appendChild(el("span", "quiz-opt__check", ""));
      btn.addEventListener("click", () => toggle(screen, o));
      list.appendChild(btn);
    });
    card.appendChild(list);
    if (screen.note) card.appendChild(el("p", "quiz-note", t(screen.note)));

    mount(card, screen, { canNext: screen.optional ? true : hasAnswer(screen) });
  }

  function hasAnswer(screen) {
    const a = state.answers[screen.id];
    return Array.isArray(a) ? a.length > 0 : a != null;
  }

  function toggle(screen, opt) {
    if (screen.type === "single") {
      state.answers[screen.id] = opt.value;
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
    render();
  }

  function renderMirror(screen) {
    const card = el("div", "quiz-mirror reveal-now");
    const chosen = (state.answers.values || []).slice().sort((a, b) => a - b)
      .map((id) => SDGS.find((s) => s.id === id)).filter(Boolean);

    card.appendChild(el("p", "quiz-intro", getLang() === "de" ? "Gut." : "Good."));
    card.appendChild(el("h1", "quiz-question", t(screen.title)));
    if (chosen.length) {
      const tags = el("div", "quiz-tags");
      chosen.forEach((s) => tags.appendChild(el("span", "quiz-tag", getLang() === "de" ? s.title_de : (s.title_en || s.title_de))));
      card.appendChild(tags);
    }
    card.appendChild(el("p", "quiz-mirror__body", t(screen.body)));
    mount(card, screen, { canNext: true });
  }

  /* Interim end of the quiz stage: no archetype, no allocation (PRD 2.4).
     S8 (summary.html) replaces this screen. */
  function renderResult() {
    saveAnswers();
    const de = getLang() === "de";
    const card = el("div", "quiz-result reveal-now");
    card.appendChild(el("p", "quiz-eyebrow", de ? "Gespeichert" : "Saved"));
    card.appendChild(el("h1", "quiz-result__title", de ? "Deine Antworten sind gespeichert." : "Your answers are saved."));
    card.appendChild(el("p", "quiz-result__lede",
      de ? "Weiter geht es mit der Zusammenfassung und dem Explorer."
         : "Next comes the summary and the Explorer."));
    const cta = el("a", "btn btn--primary", de ? "Zur Zusammenfassung" : "To the summary");
    cta.href = "summary.html";
    card.appendChild(cta);
    card.appendChild(el("p", "quiz-disclaimer", DISCLAIMER[de ? "de" : "en"]));

    const steps = el("div", "flowsteps");
    steps.setAttribute("aria-hidden", "true");
    steps.innerHTML = flowStepsHTML(de);
    card.appendChild(steps);

    stage.innerHTML = "";
    stage.appendChild(card);
    document.querySelector(".quiz-progress").style.visibility = "hidden";
  }

  /* Interim stage strip (PRD 5.1 ProgressBar replaces it in task 06). */
  function flowStepsHTML(de) {
    const steps = de
      ? ["Quiz", "Zusammenfassung", "Explorer", "Portfolio"]
      : ["Quiz", "Summary", "Explorer", "Portfolio"];
    return steps.map((name, i) => {
      const cls = i === 0 ? "is-active" : "";
      return `<div class="flowstep ${cls}">
        <span class="flowstep__dot"></span><span class="flowstep__name">${name}</span>
        ${i < steps.length - 1 ? '<span class="flowstep__line"></span>' : ""}
      </div>`;
    }).join("");
  }

  /* ---- navigation chrome --------------------------------------- */
  function mount(card, screen, { canNext }) {
    stage.innerHTML = "";
    stage.appendChild(card);

    const nav = el("div", "quiz-nav");
    const de = getLang() === "de";

    const back = el("button", "quiz-nav__back");
    back.type = "button";
    back.textContent = de ? "Zurück" : "Back";
    back.disabled = state.i === 0;
    back.addEventListener("click", prev);
    nav.appendChild(back);

    if (screen.type !== "single") {
      const fwd = el("button", "btn btn--primary quiz-nav__next");
      fwd.type = "button";
      fwd.textContent = de ? "Weiter" : "Continue";
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
    if (state.i > 0) { state.i -= 1; render(); window.scrollTo(0, 0); }
  }

  /* Persist into pm_session (PRD 7.1) when session.js is present;
     back navigation never changes stored values (PRD 5.4). */
  function saveAnswers() {
    const S = window.pmSession;
    if (!S) return;
    const s = S.read() || S.create();
    s.values = { sdgs: (state.answers.values || []).slice() };
    s.situation = Object.assign({}, s.situation, { horizon: state.answers.horizon || null });
    s.lastScreen = "/quiz/values";
    S.write(s);
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
    bar = document.querySelector(".quiz-progress__bar");
    progressLabel = document.querySelector(".quiz-progress__label");
    if (!stage) return;

    // restore saved answers from pm_session (resume, PRD 5.4)
    const S = window.pmSession;
    const saved = S && S.read();
    if (saved && S.isValid(saved)) {
      if (saved.values && saved.values.sdgs && saved.values.sdgs.length) state.answers.values = saved.values.sdgs.slice();
      if (saved.situation && saved.situation.horizon) state.answers.horizon = saved.situation.horizon;
    }

    fetch("data/sdgs.json")
      .then((r) => (r.ok ? r.json() : { sdgs: [] }))
      .catch(() => ({ sdgs: [] }))
      .then((doc) => { SDGS = doc.sdgs || []; render(); });

    document.addEventListener("pm:langchange", render);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
