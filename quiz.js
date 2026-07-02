/* =============================================================
   Portemonnaie. Values & risk quiz.
   Vanilla JS, no dependencies. One question per screen.

   Source content: features/portemonnaie_quiz_content.md (DE = source
   of truth). English added so the page works under the EN/DE toggle.

   Language: reads the same `pm_lang` key written by i18n.js.

   --------------------------------------------------------------
   COMPLIANCE GUARDRAILS (binding — see content spec):
   - Output stays at asset-class level. Never an instrument / ISIN.
   - Block A (values/SDGs) may only pre-fill an editable Explorer
     filter later. Never a "for you" product suggestion.
   - No question about concrete wealth or € amounts (C3 is qualitative).
   - No concrete company names — sectors/branches only.
   - Result screens must carry the not-investment-advice disclaimer.

   --------------------------------------------------------------
   ARCHETYPE — DEFERRED ON PURPOSE.
   Every risk-bearing option already carries a numeric `risk` weight,
   and the scoring formula lives in computeArchetype() below as a
   ready-to-activate stub. Today the result screen only confirms the
   profile was saved. To switch the archetype on later:
     1. finish computeArchetype() (uncomment the body),
     2. render the returned archetype in renderResult().
   ============================================================= */

(function () {
  "use strict";

  /* ---- language ------------------------------------------------ */
  const LANG_KEY = "pm_lang";
  function getLang() {
    // Mirror i18n.js: it sets <html lang> from its own detection (which can
    // come from navigator and is NOT persisted to localStorage). Reading the
    // resolved <html lang> first keeps the quiz in sync with the nav/site;
    // fall back to the stored preference, then English.
    const l = (document.documentElement.lang || localStorage.getItem(LANG_KEY) || "").toLowerCase();
    return l === "de" ? "de" : "en";
  }
  function t(node) {
    if (node == null) return "";
    if (typeof node === "string") return node;
    return node[getLang()] || node.en || node.de || "";
  }

  /* ---- risk weights (numeric, for later scoring) --------------- */
  // konservativ/niedrig = 0 · mittel = 1 · hoch = 2
  const R = { konservativ: 0, niedrig: 0, mittel: 1, hoch: 2 };

  /* ---- SDG options for A2, grouped by the A1 value ------------- */
  const SDG_GROUPS = {
    umwelt: [
      { value: "sdg7",     label: { de: "SDG 7 · Saubere Energie",                   en: "SDG 7 · Clean energy" },                       hint: { de: "Solar, Wind, Wasserkraft",            en: "Solar, wind, hydro power" } },
      { value: "sdg6",     label: { de: "SDG 6 · Sauberes Wasser",                   en: "SDG 6 · Clean water" },                        hint: { de: "Versorgung, Aufbereitung",            en: "Supply, treatment" } },
      { value: "sdg13",    label: { de: "SDG 13 · Klimaschutz",                      en: "SDG 13 · Climate action" },                    hint: { de: "CO2 Reduktion, Effizienztechnik",     en: "CO2 reduction, efficiency tech" } },
      { value: "sdg14_15", label: { de: "SDG 14/15 · Leben unter Wasser und an Land", en: "SDG 14/15 · Life below water & on land" },     hint: { de: "Naturschutz, nachhaltige Land- und Forstwirtschaft", en: "Conservation, sustainable land & forestry" } }
    ],
    menschen: [
      { value: "sdg5",  label: { de: "SDG 5 · Gleichstellung",      en: "SDG 5 · Gender equality" },     hint: { de: "Unternehmen mit starker Geschlechtervielfalt", en: "Companies with strong gender diversity" } },
      { value: "sdg4",  label: { de: "SDG 4 · Bildung",             en: "SDG 4 · Education" },            hint: { de: "Bildungsangebote, Lerntechnologie",   en: "Education, learning technology" } },
      { value: "sdg8",  label: { de: "SDG 8 · Gute Arbeit",         en: "SDG 8 · Decent work" },          hint: { de: "Faire Arbeitsbedingungen, Lieferketten", en: "Fair working conditions, supply chains" } },
      { value: "sdg10", label: { de: "SDG 10 · Weniger Ungleichheit", en: "SDG 10 · Reduced inequality" }, hint: { de: "Finanzielle Teilhabe",               en: "Financial inclusion" } }
    ],
    gesundheit: [
      { value: "sdg3", label: { de: "SDG 3 · Gesundheit",  en: "SDG 3 · Good health" }, hint: { de: "Pharmaforschung, Medizintechnik, Versorgung", en: "Pharma research, medtech, care" } },
      { value: "sdg2", label: { de: "SDG 2 · Kein Hunger", en: "SDG 2 · Zero hunger" }, hint: { de: "Nachhaltige Landwirtschaft, Ernährung",      en: "Sustainable agriculture, nutrition" } }
    ],
    wirtschaft: [
      { value: "sdg9",  label: { de: "SDG 9 · Industrie und Innovation",  en: "SDG 9 · Industry & innovation" },  hint: { de: "Saubere Industrie, Infrastruktur",  en: "Clean industry, infrastructure" } },
      { value: "sdg12", label: { de: "SDG 12 · Verantwortungsvoller Konsum", en: "SDG 12 · Responsible consumption" }, hint: { de: "Kreislaufwirtschaft, Recycling", en: "Circular economy, recycling" } },
      { value: "sdg11", label: { de: "SDG 11 · Nachhaltige Städte",       en: "SDG 11 · Sustainable cities" },     hint: { de: "Bezahlbarer Wohnraum, saubere Mobilität", en: "Affordable housing, clean mobility" } }
    ]
  };

  /* ---- screens (ordered) --------------------------------------- */
  // type: "multi" | "single" | "mirror" | "result"
  // risk: numeric weight (only on options that feed the risk score)
  // unsure: true marks the "I'm not sure / don't know" escape options
  const SCREENS = [
    /* ---------- BLOCK A · Values & impact (no risk weight) ------- */
    {
      id: "a1", block: "A", type: "multi", max: 2,
      intro: {
        de: "Dein Geld schläft nicht. Es arbeitet schon. Nur hat bisher jemand anderes entschieden, wofür. Hier wählst du die Richtung.",
        en: "Your money isn't asleep. It's already working — someone else just decided what for, until now. Here you choose the direction."
      },
      question: { de: "Wofür soll dein Geld wirken?", en: "What should your money work for?" },
      help: { de: "Wähle bis zu zwei.", en: "Pick up to two." },
      options: [
        { value: "umwelt",        label: { de: "Eine lebenswerte Umwelt",                     en: "A liveable environment" } },
        { value: "menschen",      label: { de: "Faire Chancen für Menschen",                  en: "Fair chances for people" } },
        { value: "gesundheit",    label: { de: "Gesundheit und Wohlergehen",                  en: "Health and wellbeing" } },
        { value: "wirtschaft",    label: { de: "Zukunft und verantwortungsvolle Wirtschaft",  en: "A future-fit, responsible economy" } },
        { value: "unentschieden", label: { de: "Zeig mir erst die ganze Karte",               en: "Show me the whole map first" }, solo: true }
      ]
    },
    {
      id: "a2", block: "A", type: "multi", dynamic: "sdg", optional: true,
      intro: { de: "Das sind die 17 Ziele der Vereinten Nationen für eine bessere Welt.", en: "These are the United Nations' 17 goals for a better world." },
      question: { de: "Welche Ziele sprechen dich an?", en: "Which goals speak to you?" },
      help: { de: "So viele du möchtest — oder überspringe diesen Schritt.", en: "As many as you like — or skip this step." }
    },
    {
      id: "mirror_a", block: "A", type: "mirror",
      // body filled dynamically from a1/a2 in renderMirror()
      title: { de: "Das ist dein Wirkungspunkt.", en: "That's your point of impact." },
      body: {
        de: "Was davon wirklich ins Portfolio kommt, entscheidest du später. Frei.",
        en: "What actually makes it into your portfolio, you decide later. Freely."
      }
    },

    /* ---------- BLOCK B · Goals & horizon ----------------------- */
    {
      id: "b1", block: "B", type: "single",
      intro: { de: "Geld ist ein Mittel, kein Ziel. Es zu steuern fällt leichter, wenn klar ist, wofür.", en: "Money is a means, not an end. Steering it is easier when you know what for." },
      question: { de: "Wofür legst du an?", en: "What are you investing for?" },
      options: [
        { value: "alter",            label: { de: "Für später, fürs Alter",                                en: "For later, for retirement" } },
        { value: "unabhaengigkeit",  label: { de: "Für mehr Unabhängigkeit",                               en: "For more independence" } },
        { value: "ziel",             label: { de: "Für etwas Bestimmtes, etwa Wohnen, Familie, eine Auszeit", en: "For something specific — a home, family, a break" } },
        { value: "offen",            label: { de: "Ich lasse mein Geld arbeiten, ohne festes Ziel",        en: "I just want my money working, with no fixed goal" } }
      ]
    },
    {
      id: "b2", block: "B", type: "single",
      intro: {
        de: "Beim Anlegen zählt nicht der richtige Moment, sondern wie lange dein Geld dabei ist. Märkte gehen rauf und runter. Je länger du dabei bist, desto mehr Zeit hat dieses Auf und Ab, sich auszugleichen. Time in the market beats timing the market.",
        en: "What matters isn't the right moment, but how long your money stays in. Markets rise and fall. The longer you're in, the more time that up and down has to even out. Time in the market beats timing the market."
      },
      question: { de: "Wann brauchst du dein Geld wahrscheinlich?", en: "When will you probably need your money?" },
      options: [
        { value: "5_10",    label: { de: "In fünf bis zehn Jahren", en: "In five to ten years" },  risk: R.mittel },
        { value: "10_plus", label: { de: "In über zehn Jahren",     en: "In more than ten years" }, risk: R.hoch },
        { value: "pension", label: { de: "Zum Pensionsantritt",     en: "At retirement" },          risk: R.hoch },
        { value: "unklar",  label: { de: "Weiß ich noch nicht",     en: "I don't know yet" },       risk: R.konservativ, unsure: true }
      ]
    },

    /* ---------- BLOCK C · Behaviour & risk ---------------------- */
    {
      id: "c1", block: "C", type: "single",
      intro: {
        de: "Niemand legt an, um zu verlieren. Werte gehen aber rauf und runter. Wie du in einem schlechten Moment reagierst, sagt mehr als jede Selbsteinschätzung.",
        en: "Nobody invests to lose. But values rise and fall. How you react in a bad moment says more than any self-assessment."
      },
      question: { de: "Dein Investment ist in einem schlechten Monat 15 Prozent weniger wert. Was machst du?", en: "In a bad month your investment is worth 15 percent less. What do you do?" },
      options: [
        { value: "verkaufen", label: { de: "Ich verkaufe, bevor mehr weg ist",     en: "I sell before more is gone" },      risk: R.niedrig },
        { value: "abwarten",  label: { de: "Ich lasse es liegen und warte ab",      en: "I leave it and wait it out" },       risk: R.mittel },
        { value: "nachlegen", label: { de: "Ich lege nach, jetzt ist es günstiger", en: "I add more — it's cheaper now" },    risk: R.hoch },
        { value: "unsicher",  label: { de: "Ich bin mir nicht sicher",              en: "I'm not sure" },                     risk: R.mittel, unsure: true }
      ]
    },
    {
      id: "c2", block: "C", type: "single",
      intro: { de: "Es gibt keinen Weg nach oben ohne Auf und Ab. Die Frage ist, wie viel davon sich für dich richtig anfühlt.", en: "There's no way up without ups and downs. The question is how much of it feels right for you." },
      question: { de: "Welcher Verlauf fühlt sich für dich richtiger an?", en: "Which path feels more right to you?" },
      note: { de: "Hier gibt es kein „weiß ich nicht“ — jedes Gefühl hat eine Tendenz.", en: "No “I don't know” here — every feeling has a leaning." },
      options: [
        { value: "ruhig",            label: { de: "Ruhig und gleichmäßig, auch wenn am Ende weniger steht", en: "Calm and steady, even if there's less at the end" }, risk: R.niedrig, curve: "calm",     color: "var(--sage)" },
        { value: "mehr_auf_ab",      label: { de: "Etwas mehr Auf und Ab für mehr Wachstum",                en: "A bit more up and down for more growth" },           risk: R.mittel,  curve: "medium",   color: "var(--forest)" },
        { value: "deutliches_auf_ab", label: { de: "Deutliches Auf und Ab, wenn langfristig mehr drin ist",  en: "Clear ups and downs, if there's more in the long run" }, risk: R.hoch,   curve: "volatile", color: "var(--marigold)" }
      ]
    },
    {
      id: "c3", block: "C", type: "single",
      intro: { de: "Geld anzulegen heißt, es eine Weile nicht anzufassen. Deshalb zählt, ob es Geld ist, das du im Alltag nicht brauchst.", en: "Investing means not touching the money for a while. So what counts is whether it's money you don't need day to day." },
      question: { de: "Ist das Geld, das du anlegen willst, gerade entbehrlich?", en: "Is the money you want to invest currently spare?" },
      options: [
        // cap: stored for later scoring (max risk this answer allows)
        { value: "polster_da",    label: { de: "Ja, ein Polster für den Alltag ist da", en: "Yes, I have a cushion for everyday life" }, cap: R.hoch },
        { value: "groesstenteils", label: { de: "Größtenteils",                          en: "Mostly" },                                  cap: R.mittel },
        { value: "eher_nicht",    label: { de: "Eher nicht",                            en: "Not really" },                              cap: R.mittel }
      ]
    },
    {
      id: "c4", block: "C", type: "single",
      // tone only — never feeds the archetype
      intro: { de: "Eine letzte Sache. Es gibt keine richtige Antwort.", en: "One last thing. There's no right answer." },
      question: { de: "Wo stehst du gerade beim Thema Geldanlage?", en: "Where are you right now with investing?" },
      options: [
        { value: "neu",                label: { de: "Ganz neu",                                                              en: "Completely new" },                          tone: "warm" },
        { value: "grundlagen",         label: { de: "Ich kenne die Grundlagen",                                              en: "I know the basics" },                       tone: "mid" },
        { value: "investiert",         label: { de: "Ich bin schon investiert, möchte aber nachhaltigere Alternativen entdecken", en: "I already invest, but want greener alternatives" }, tone: "peer" },
        { value: "unsicher_neugierig", label: { de: "Unsicher, aber neugierig",                                              en: "Unsure, but curious" },                     tone: "warm" }
      ]
    },

    { id: "result", block: "R", type: "result" }
  ];

  /* ===========================================================
     SCORING — DEFERRED. Wired but not activated. See spec.
     =========================================================== */
  function computeArchetype(answers) {
    // TODO: ARCHETYPE — activate when the result copy per archetype is final.
    //
    // const optByVal = (id, val) =>
    //   (SCREENS.find(s => s.id === id).options || []).find(o => o.value === val);
    // const w = id => { const o = optByVal(id, answers[id]); return o && o.risk != null ? o.risk : 0; };
    // const capOf = () => { const o = optByVal("c3", answers.c3); return o && o.cap != null ? o.cap : R.hoch; };
    //
    // let risk = w("b2") + w("c1") + w("c2");      // 0..6
    // risk = Math.min(risk, capOf() * 3);          // c3 caps the band
    //
    // // Fallback: if the risk signal is largely missing (multiple unsure),
    // // default to the lowest archetype. Never push up through uncertainty.
    // const bands = [
    //   { max: 1, key: "gaertnerin"  },   // die Gärtnerin
    //   { max: 3, key: "seglerin"    },   // die Seglerin
    //   { max: 5, key: "entdeckerin" },   // die Entdeckerin
    //   { max: 6, key: "bergsteigerin" }  // die Bergsteigerin
    // ];
    // const band = bands.find(b => risk <= b.max) || bands[0];
    // return { key: band.key, risk, tone: answers.c4, tags: answers.a2 || [] };
    return null; // archetype intentionally not shown yet
  }

  /* ---- state --------------------------------------------------- */
  const state = {
    i: 0,                 // current screen index
    answers: {},          // id -> value | [values]
    unsureCount: 0,       // for the supportive nudge
    nudged: false
  };

  let stage, bar, progressLabel;

  /* ---- helpers ------------------------------------------------- */
  function questionScreens() {
    return SCREENS.filter(s => s.type === "single" || s.type === "multi");
  }
  function answeredCount() {
    return questionScreens().filter(s => {
      const a = state.answers[s.id];
      return Array.isArray(a) ? a.length > 0 : a != null;
    }).length;
  }

  // numeric SDG order (e.g. "sdg7" -> 7, "sdg14_15" -> 14)
  function sdgNum(o) {
    const m = String(o.value).match(/\d+/);
    return m ? parseInt(m[0], 10) : 999;
  }

  function a2Options() {
    const a1 = state.answers.a1 || [];
    let list;
    if (!a1.length || a1.indexOf("unentschieden") !== -1) {
      // show every cluster
      list = Object.keys(SDG_GROUPS).reduce((acc, k) => acc.concat(SDG_GROUPS[k]), []);
    } else {
      list = a1.reduce((acc, k) => acc.concat(SDG_GROUPS[k] || []), []);
    }
    // always present the goals in SDG order, 1 to 17
    return list.slice().sort((a, b) => sdgNum(a) - sdgNum(b));
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
    return screen.dynamic === "sdg" ? a2Options() : screen.options;
  }

  function renderQuestion(screen) {
    const isMulti = screen.type === "multi";
    const opts = optionList(screen);
    const sel = state.answers[screen.id] || (isMulti ? [] : null);

    const card = el("div", "quiz-card-screen reveal-now");

    if (screen.intro) card.appendChild(el("p", "quiz-intro", t(screen.intro)));
    card.appendChild(el("h1", "quiz-question", t(screen.question)));
    if (screen.help) card.appendChild(el("p", "quiz-help", t(screen.help)));

    let listCls = "quiz-options";
    if (opts.some(o => o.curve)) listCls += " quiz-options--curves";
    else if (isMulti) listCls += " quiz-options--multi";
    const list = el("div", listCls);
    opts.forEach(o => {
      const active = isMulti ? sel.indexOf(o.value) !== -1 : sel === o.value;
      const btn = el("button", "quiz-opt" + (active ? " is-selected" : ""));
      btn.type = "button";
      btn.setAttribute("role", isMulti ? "checkbox" : "radio");
      btn.setAttribute("aria-checked", active ? "true" : "false");

      if (o.curve) btn.appendChild(curveSvg(o.curve, o.color));

      const txt = el("span", "quiz-opt__text");
      txt.appendChild(el("span", "quiz-opt__label", t(o.label)));
      if (o.hint) txt.appendChild(el("span", "quiz-opt__hint", t(o.hint)));
      btn.appendChild(txt);

      if (isMulti) btn.appendChild(el("span", "quiz-opt__check", ""));

      btn.addEventListener("click", () => toggle(screen, o, opts));
      list.appendChild(btn);
    });
    card.appendChild(list);

    if (screen.note) card.appendChild(el("p", "quiz-note", t(screen.note)));

    // supportive nudge after repeated uncertainty
    if (state.nudged) {
      const nudge = el("p", "quiz-nudge",
        getLang() === "de"
          ? "Nimm dir kurz Zeit. Es gibt keine falsche Antwort."
          : "Take a moment. There's no wrong answer.");
      card.appendChild(nudge);
    }

    mount(card, screen, { canNext: screen.optional ? true : hasAnswer(screen) });
  }

  function hasAnswer(screen) {
    const a = state.answers[screen.id];
    return Array.isArray(a) ? a.length > 0 : a != null;
  }

  function toggle(screen, opt, opts) {
    if (screen.type === "single") {
      state.answers[screen.id] = opt.value;
      trackUnsure(opt);
      // single-select auto-advances for a snappy, one-tap feel
      next();
      return;
    }
    // multi
    let arr = state.answers[screen.id] ? state.answers[screen.id].slice() : [];
    const solo = opt.solo;
    if (arr.indexOf(opt.value) !== -1) {
      arr = arr.filter(v => v !== opt.value);
    } else {
      if (solo) arr = [opt.value];
      else {
        arr = arr.filter(v => {
          const o = opts.find(x => x.value === v);
          return !(o && o.solo);
        });
        if (screen.max && arr.length >= screen.max) arr.shift();
        arr.push(opt.value);
      }
    }
    state.answers[screen.id] = arr;
    render(); // re-render to reflect selection state + enable Next
  }

  function trackUnsure(opt) {
    if (opt && opt.unsure) {
      state.unsureCount += 1;
      if (state.unsureCount >= 2 && !state.nudged) state.nudged = true;
    }
  }

  function renderMirror(screen) {
    const card = el("div", "quiz-mirror reveal-now");
    const a2 = state.answers.a2 || [];
    const allSdg = Object.keys(SDG_GROUPS).reduce((acc, k) => acc.concat(SDG_GROUPS[k]), []);
    const chosen = allSdg
      .filter(s => a2.indexOf(s.value) !== -1)
      .sort((a, b) => sdgNum(a) - sdgNum(b));

    card.appendChild(el("p", "quiz-intro",
      getLang() === "de" ? "Gut." : "Good."));
    card.appendChild(el("h1", "quiz-question", t(screen.title)));

    if (chosen.length) {
      const tags = el("div", "quiz-tags");
      chosen.forEach(s => tags.appendChild(el("span", "quiz-tag", t(s.label))));
      card.appendChild(tags);
    }
    card.appendChild(el("p", "quiz-mirror__body", t(screen.body)));

    mount(card, screen, { canNext: true });
  }

  function renderResult(screen) {
    saveAnswers();
    computeArchetype(state.answers); // deferred: returns null today

    const de = getLang() === "de";
    const card = el("div", "quiz-result reveal-now");
    card.appendChild(el("p", "quiz-eyebrow", de ? "Geschafft" : "All done"));
    card.appendChild(el("h1", "quiz-result__title",
      de ? "Dein Profil ist gespeichert." : "Your profile is saved."));
    card.appendChild(el("p", "quiz-result__lede",
      de
        ? "Wir bereiten gerade deinen persönlichen Anlage-Archetyp und eine dazu passende Aufteilung auf Asset-Klassen-Ebene vor. Du bist auf dem Weg."
        : "We're preparing your personal investor archetype and a matching split at the asset-class level. You're on your way."));

    const cta = el("a", "btn btn--primary",
      de ? "Zur Early-Access-Liste" : "Join the Early Access list");
    cta.href = "prereg.html#signup";
    card.appendChild(cta);

    card.appendChild(el("p", "quiz-disclaimer",
      de
        ? "Dies ist keine Anlageberatung. Die Inhalte dienen ausschließlich Bildungszwecken."
        : "This is not investment advice. Content is for educational purposes only."));

    stage.innerHTML = "";
    stage.appendChild(card);
    document.querySelector(".quiz-progress").style.visibility = "hidden";
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

    // single-select auto-advances, so only multi/mirror need an explicit Next
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

  function saveAnswers() {
    try {
      localStorage.setItem("pm_quiz_answers", JSON.stringify({
        v: 1, at: Date.now(), answers: state.answers
      }));
    } catch (e) { /* storage may be blocked; non-fatal */ }
  }

  /* ---- tiny DOM + SVG helpers ---------------------------------- */
  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  // mini path of the three C2 feeling-curves
  function curveSvg(kind, color) {
    const paths = {
      calm:     "M2 30 C 18 27, 34 24, 50 21 S 82 15, 98 12",
      medium:   "M2 32 C 16 22, 24 34, 38 24 S 60 14, 74 20 S 90 8, 98 10",
      volatile: "M2 34 C 12 14, 20 36, 30 20 S 44 38, 54 16 S 66 34, 76 12 S 90 24, 98 6"
    };
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "quiz-curve");
    svg.setAttribute("viewBox", "0 0 100 40");
    svg.setAttribute("aria-hidden", "true");
    const p = document.createElementNS(ns, "path");
    p.setAttribute("d", paths[kind] || paths.medium);
    p.setAttribute("fill", "none");
    p.setAttribute("stroke", color || "var(--forest)");
    p.setAttribute("stroke-width", "2.5");
    p.setAttribute("stroke-linecap", "round");
    svg.appendChild(p);
    return svg;
  }

  /* ---- boot ---------------------------------------------------- */
  function boot() {
    stage = document.getElementById("quizStage");
    bar = document.querySelector(".quiz-progress__bar");
    progressLabel = document.querySelector(".quiz-progress__label");
    if (!stage) return;
    render();
    // re-render on language switch (i18n.js dispatches this)
    document.addEventListener("pm:langchange", render);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
