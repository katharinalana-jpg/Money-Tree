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
     ARCHETYPES — four nature metaphors along a calm→bold risk axis.
     Output stays at asset-class level (ETF / stocks / bonds) — a
     MODEL portfolio, never a specific instrument. Fully bilingual.
     =========================================================== */
  const ARCH_ORDER = ["gaertnerin", "architektin", "seglerin", "bergsteigerin"];
  const ARCHETYPES = {
    gaertnerin: {
      idx: 0,
      name: { de: "die Gärtnerin", en: "the Gardener" },
      alloc: { ETF: 60, Stock: 20, Bond: 20 },
      quote: {
        de: "Du lässt dein Geld ruhig gedeihen. Schritt für Schritt, mit Geduld und echter Wirkung.",
        en: "You let your money grow calmly. Step by step, with patience and real impact."
      },
      caption: { de: "Ruhig wachsend, breit gestreut, wirkungsstark.", en: "Calmly growing, broadly diversified, impactful." },
      strengths: { de: ["Geduld", "Beständigkeit", "Langfristiger Blick"], en: ["Patience", "Consistency", "A long-term view"] },
      interests: { de: ["Nachhaltigkeit", "Stetiges Wachstum", "Sicherheit"], en: ["Sustainability", "Steady growth", "Security"] },
      motives:   { de: ["Vorsorge", "Echte Wirkung", "Ruhe statt Risiko"], en: ["Provision", "Real impact", "Calm over risk"] }
    },
    architektin: {
      idx: 1,
      name: { de: "die Architektin", en: "the Architect" },
      alloc: { ETF: 60, Stock: 30, Bond: 10 },
      quote: {
        de: "Du baust dein Vermögen mit Plan. Durchdacht, strukturiert, Stein auf Stein.",
        en: "You build your wealth with a plan. Considered, structured, brick by brick."
      },
      caption: { de: "Strukturiert wachsend, klar geplant, solide.", en: "Structured growth, clearly planned, solid." },
      strengths: { de: ["Struktur", "Weitblick", "Disziplin"], en: ["Structure", "Foresight", "Discipline"] },
      interests: { de: ["Solide Werte", "Planbarkeit", "Qualität"], en: ["Solid assets", "Predictability", "Quality"] },
      motives:   { de: ["Aufbau", "Kontrolle", "Langfristige Stabilität"], en: ["Building", "Control", "Long-term stability"] }
    },
    seglerin: {
      idx: 2,
      name: { de: "die Seglerin", en: "the Sailor" },
      alloc: { ETF: 55, Stock: 40, Bond: 5 },
      quote: {
        de: "Du nutzt den Wind, wie er kommt. Beweglich, wach, mit Kurs auf Wachstum.",
        en: "You use the wind as it comes. Agile, alert, on course for growth."
      },
      caption: { de: "Wachstumsstark, beweglich, chancenorientiert.", en: "Growth-oriented, agile, opportunity-driven." },
      strengths: { de: ["Anpassungsfähigkeit", "Mut zur Bewegung", "Überblick"], en: ["Adaptability", "Courage to move", "Overview"] },
      interests: { de: ["Wachstum", "Neue Chancen", "Dynamik"], en: ["Growth", "New opportunities", "Momentum"] },
      motives:   { de: ["Vermögen mehren", "Freiheit", "Fortschritt"], en: ["Growing wealth", "Freedom", "Progress"] }
    },
    bergsteigerin: {
      idx: 3,
      name: { de: "die Bergsteigerin", en: "the Mountaineer" },
      alloc: { ETF: 45, Stock: 50, Bond: 5 },
      quote: {
        de: "Du gehst für das große Ziel auch steile Wege. Mutig, ausdauernd, weit nach oben.",
        en: "For the big goal you'll take steep paths too. Bold, enduring, reaching high."
      },
      caption: { de: "Chancenstark, ausdauernd, auf lange Sicht.", en: "High-opportunity, enduring, for the long climb." },
      strengths: { de: ["Mut", "Ausdauer", "Nervenstärke"], en: ["Courage", "Endurance", "Steady nerves"] },
      interests: { de: ["Langfristiges Wachstum", "Chancen", "Innovation"], en: ["Long-term growth", "Opportunity", "Innovation"] },
      motives:   { de: ["Maximales Potenzial", "Unabhängigkeit", "Großes Ziel"], en: ["Maximum potential", "Independence", "A big goal"] }
    }
  };
  // asset-class colours for the model-portfolio pie (match the app's type palette)
  const CLASS_COLOR = { ETF: "#4E8C6A", Stock: "#1F3A2E", Bond: "#A8D5BA" };

  /* ===========================================================
     SCORING — maps the risk-bearing answers onto one of four bands.
     risk = b2 + c1 + c2  (0..6), then c3 caps how high it may reach.
     Uncertainty never pushes the band up (unsure answers weigh low).
     =========================================================== */
  function computeArchetype(answers) {
    const optByVal = (id, val) =>
      (SCREENS.find(s => s.id === id).options || []).find(o => o.value === val);
    const w = id => { const o = optByVal(id, answers[id]); return o && o.risk != null ? o.risk : 0; };
    const capOf = () => { const o = optByVal("c3", answers.c3); return o && o.cap != null ? o.cap : R.hoch; };

    let risk = w("b2") + w("c1") + w("c2");   // 0..6
    risk = Math.min(risk, capOf() * 3);       // c3 caps the band

    const bands = [
      { max: 1, key: "gaertnerin" },
      { max: 3, key: "architektin" },
      { max: 5, key: "seglerin" },
      { max: 6, key: "bergsteigerin" }
    ];
    const band = bands.find(b => risk <= b.max) || bands[0];
    return { key: band.key, risk, tone: answers.c4, tags: answers.a2 || [] };
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

  function renderResult() {
    saveAnswers();
    const res = computeArchetype(state.answers) || { key: "gaertnerin" };
    const a = ARCHETYPES[res.key] || ARCHETYPES.gaertnerin;
    // persist for downstream pages (Portfolio review reads pm_archetype)
    try {
      localStorage.setItem("pm_archetype", JSON.stringify({
        v: 1, at: Date.now(), key: res.key, risk: res.risk,
        name: a.name, alloc: a.alloc
      }));
    } catch (e) { /* storage may be blocked; non-fatal */ }

    const de = getLang() === "de";
    const L = de
      ? { model: "Dein Musterportfolio", result: "Dein Ergebnis", you: "Du bist",
          strengths: "Stärken", interests: "Interessen", motives: "Motive",
          all: "Alle vier Typen", calm: "Ruhig", bold: "Mutig",
          discover: "Portfolio entdecken", share: "Ergebnis teilen",
          cls: { ETF: "ETFs", Stock: "Aktien", Bond: "Bonds" } }
      : { model: "Your model portfolio", result: "Your result", you: "You are",
          strengths: "Strengths", interests: "Interests", motives: "Motives",
          all: "All four types", calm: "Calm", bold: "Bold",
          discover: "Discover portfolio", share: "Share result",
          cls: { ETF: "ETFs", Stock: "Stocks", Bond: "Bonds" } };

    const card = el("div", "arch reveal-now");

    const legend = ["ETF", "Stock", "Bond"].map((k) =>
      `<li class="arch-legend__row">
        <span class="arch-legend__dot" style="background:${CLASS_COLOR[k]}"></span>
        <span class="arch-legend__name">${L.cls[k]}</span>
        <span class="arch-legend__pct">${a.alloc[k]}%</span>
      </li>`).join("");

    const dots = ARCH_ORDER.map((_, i) =>
      `<span class="arch-slider__dot ${i === a.idx ? "is-on" : ""}"></span>`).join("");

    const traitBlock = (label, items) =>
      `<div class="arch-trait">
        <p class="arch-trait__label">${label}</p>
        <ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul>
      </div>`;

    const chips = ARCH_ORDER.map((k) => {
      const on = k === res.key;
      const check = on
        ? `<svg class="arch-chip__check" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        : "";
      return `<span class="arch-chip ${on ? "is-on" : ""}">${check}${ARCHETYPES[k].name[de ? "de" : "en"]}</span>`;
    }).join("");

    card.innerHTML = `
      <div class="arch__grid">
        <section class="arch-model" aria-label="${L.model}">
          <p class="arch-eyebrow">${L.model}</p>
          <div class="arch-pie">${pieSVG(a.alloc)}</div>
          <ul class="arch-legend">${legend}</ul>
          <div class="arch-slider">
            <div class="arch-slider__scale">
              <span>${L.calm}</span><span>${L.bold}</span>
            </div>
            <div class="arch-slider__track">
              <span class="arch-slider__fill" style="width:${(a.idx / (ARCH_ORDER.length - 1)) * 100}%"></span>
              ${dots}
            </div>
          </div>
          <p class="arch-model__caption">${a.caption[de ? "de" : "en"]}</p>
        </section>

        <div class="arch-result">
          <p class="arch-eyebrow">${L.result}</p>
          <h1 class="arch-title">${L.you} <span class="arch-name">${a.name[de ? "de" : "en"]}.</span></h1>
          <p class="arch-quote">&bdquo;${a.quote[de ? "de" : "en"]}&ldquo;</p>
          <div class="arch-traits">
            ${traitBlock(L.strengths, a.strengths[de ? "de" : "en"])}
            ${traitBlock(L.interests, a.interests[de ? "de" : "en"])}
            ${traitBlock(L.motives, a.motives[de ? "de" : "en"])}
          </div>
          <p class="arch-all__label">${L.all}</p>
          <div class="arch-chips">${chips}</div>
          <div class="arch-cta">
            <a class="btn btn--primary arch-cta__go" href="explore.html">${L.discover}</a>
            <button type="button" class="btn btn--ghost arch-cta__share" id="archShare">${L.share}</button>
          </div>
        </div>
      </div>
      <p class="quiz-disclaimer">${de
        ? "Dies ist keine Anlageberatung. Die Inhalte dienen ausschließlich Bildungszwecken."
        : "This is not investment advice. Content is for educational purposes only."}</p>
      <div class="flowsteps" aria-hidden="true">${flowStepsHTML(de)}</div>`;

    stage.innerHTML = "";
    stage.appendChild(card);
    document.querySelector(".quiz-progress").style.visibility = "hidden";
    setFlowNavActive("quiz.html#result");

    const share = card.querySelector("#archShare");
    if (share) share.addEventListener("click", () => shareResult(a, de));
  }

  /* model-portfolio pie (asset-class shares) */
  function pieSVG(alloc) {
    const segs = ["ETF", "Stock", "Bond"].map((k) => ({ k, val: alloc[k] }))
      .filter((s) => s.val > 0);
    const total = segs.reduce((n, s) => n + s.val, 0) || 1;
    const cx = 90, cy = 90, r = 82;
    let a0 = -Math.PI / 2;
    const paths = segs.map((s) => {
      const frac = s.val / total;
      const a1 = a0 + frac * 2 * Math.PI;
      const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
      const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      const large = frac > 0.5 ? 1 : 0;
      a0 = a1;
      // full circle guard (single class = 100%)
      if (frac >= 0.999) return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${CLASS_COLOR[s.k]}"/>`;
      return `<path d="M${cx},${cy} L${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${large} 1 ${x1.toFixed(1)},${y1.toFixed(1)} Z" fill="${CLASS_COLOR[s.k]}"/>`;
    }).join("");
    return `<svg viewBox="0 0 180 180" role="img" aria-hidden="true">${paths}</svg>`;
  }

  function flowStepsHTML(de) {
    const steps = de
      ? ["Quiz", "Typ", "Entdecken", "Portfolio", "Checkout"]
      : ["Quiz", "Type", "Explore", "Portfolio", "Checkout"];
    return steps.map((name, i) => {
      const cls = i < 1 ? "is-done" : (i === 1 ? "is-active" : "");
      return `<div class="flowstep ${cls}">
        <span class="flowstep__dot"></span><span class="flowstep__name">${name}</span>
        ${i < steps.length - 1 ? '<span class="flowstep__line"></span>' : ""}
      </div>`;
    }).join("");
  }

  // reflect the current flow step in the (flow) nav
  function setFlowNavActive(href) {
    document.querySelectorAll(".nav__links--flow a[href], .nav__mobile a[href]").forEach((el2) => {
      el2.classList.toggle("is-active", el2.getAttribute("href") === href);
    });
  }

  function shareResult(a, de) {
    const name = a.name[de ? "de" : "en"];
    const text = de ? `Mein Portemonnaie-Typ: ${name}.` : `My Portemonnaie type: ${name}.`;
    const url = location.href;
    if (navigator.share) {
      navigator.share({ title: "Portemonnaie", text, url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(`${text} ${url}`).then(() => {
        const btn = document.getElementById("archShare");
        if (btn) btn.textContent = de ? "Link kopiert" : "Link copied";
      }).catch(() => {});
    }
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

  // Jump straight to the archetype result — powers the "Type" nav tab and
  // lets you re-see your result without re-answering. If the quiz was taken
  // before, the saved answers drive the archetype; otherwise it falls back
  // to the lowest-risk default so the downstream flow is still reachable.
  function jumpToResult() {
    if (location.hash !== "#result") return false;
    try {
      const saved = JSON.parse(localStorage.getItem("pm_quiz_answers"));
      if (saved && saved.answers) state.answers = saved.answers;
    } catch (e) { /* ignore */ }
    state.i = SCREENS.findIndex((s) => s.type === "result");
    render();
    window.scrollTo(0, 0);
    return true;
  }

  /* ---- boot ---------------------------------------------------- */
  function boot() {
    stage = document.getElementById("quizStage");
    bar = document.querySelector(".quiz-progress__bar");
    progressLabel = document.querySelector(".quiz-progress__label");
    if (!stage) return;
    // deep-link: quiz.html#result shows the archetype immediately
    if (!jumpToResult()) render();
    // re-render on language switch (i18n.js dispatches this)
    document.addEventListener("pm:langchange", render);
    // in-page nav to #result (e.g. the "Type" tab) jumps to the result
    window.addEventListener("hashchange", jumpToResult);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
