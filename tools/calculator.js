/* =============================================================
   Portemonnaie – Rechner "Was aus deinem Geld werden kann" (ES-Modul).
   Liest die vier Regler, ruft die reine Rechenlogik (calc-engine.mjs)
   und zeichnet Ergebnis und Kurve. Keine Finanzkonstanten hier,
   die stehen in calc-config.mjs. Läuft nach i18n.js und script.js.
   Runde 1.26111401: aus dem Stand vom 15. September 2026 übernommen,
   Sprachwechsel über pm:langchange, Farben über CSS-Variablen, FR-Format.
   ============================================================= */

import { CONFIG } from "./calc-config.mjs";
import { project } from "./calc-engine.mjs";

const root = document.querySelector("#calculator");
if (root) init();

function init() {
  const $ = (s) => root.querySelector(s);
  const D = CONFIG.defaults, R = CONFIG.ranges;

  /* ---------- Zahlenformat je Sprache ---------- */
  const LOCALE = { en: "en-GB", de: "de-DE", fr: "fr-FR" };
  const lang = () => {
    const l = (document.documentElement.lang || "en").slice(0, 2);
    return LOCALE[l] ? l : "en";
  };
  function money(n) {
    const v = Math.max(0, Math.round(n));
    const s = new Intl.NumberFormat(LOCALE[lang()]).format(v);
    return lang() === "en" ? "€" + s : s + " €";
  }
  function moneyShort(n) {
    const v = Math.max(0, Math.round(n));
    let s;
    if (v >= 1000000) {
      const m = (v / 1000000).toFixed(2).replace(/\.?0+$/, "");
      s = lang() === "en" ? m + "M" : m.replace(".", ",") + " Mio";
    } else if (v >= 1000) {
      s = (v / 1000).toFixed(v >= 100000 ? 0 : 1).replace(/\.0$/, "") + "k";
      if (lang() !== "en") s = s.replace(".", ",");
    } else {
      s = String(v);
    }
    return lang() === "en" ? "€" + s : s + " €";
  }

  /* ---------- Regler: Bereiche aus CONFIG, nicht aus dem Markup ---------- */
  const sliders = {
    inAge:     { r: R.age,             def: D.age },
    inSaving:  { r: R.monthlySaving,   def: D.monthlySaving },
    inStart:   { r: R.startingSavings, def: D.startingSavings },
    inHorizon: { r: R.horizonAge,      def: D.horizonAge },
  };
  for (const [id, { r, def }] of Object.entries(sliders)) {
    const el = $("#" + id);
    if (!el) continue;
    el.min = r.min; el.max = r.max; el.step = r.step; el.value = def;
    paintTrack(el);
    /* beim Ziehen sofort zeichnen, ohne Animation: sonst wackelt die Kurve */
    el.addEventListener("input", () => { paintTrack(el); render(false); });
  }

  const val = (id) => +$("#" + id).value;
  function readInput() {
    return {
      age: val("inAge"),
      horizonAge: Math.max(val("inHorizon"), val("inAge")),
      monthlySaving: val("inSaving"),
      startingSavings: val("inStart"),
      startingInvested: 0,
    };
  }

  const out = {
    age: $("#outAge"), saving: $("#outSaving"), start: $("#outStart"), horizon: $("#outHorizon"),
    gap: $("#outGap"), invest: $("#outInvest"), cash: $("#outCash"),
    gapArea: $("#calcGapArea"), invLine: $("#calcInvest"), cashLine: $("#calcSave"),
    yTop: $("#calcYTop"), y75: $("#calcY75"), yMid: $("#calcYMid"), y25: $("#calcY25"), yBot: $("#calcYBot"),
    xStart: $("#calcXStart"), xEnd: $("#calcXEnd"),
  };

  /* ---------- Ausgabe ---------- */
  function render(animate) {
    const input = readInput();
    const r = project(input, CONFIG, CONFIG.defaultScenario);   /* Basisszenario, siehe calc-config.mjs */

    out.age.textContent = input.age;
    out.saving.textContent = money(val("inSaving"));
    out.start.textContent = money(val("inStart"));
    out.horizon.textContent = input.horizonAge;
    const vt = { inAge: out.age, inSaving: out.saving, inStart: out.start, inHorizon: out.horizon };
    for (const [sid, o] of Object.entries(vt)) $("#" + sid).setAttribute("aria-valuetext", o.textContent);

    countTo(out.gap, r.gap, animate);
    if (out.invest) out.invest.textContent = money(r.investedFinal);
    if (out.cash) out.cash.textContent = money(r.cashFinal);
    drawChart(r, animate);
  }

  /* ---------- Kurve ---------- */
  const X0 = 46, X1 = 352, Y0 = 10, Y1 = 184;
  let shown = null, raf = null;

  /* Achsenmaximum auf zwei gültige Stellen aufrunden: skaliert beim Ziehen fast stufenlos */
  function niceCeil(v) {
    if (v <= 0) return 1000;
    const pow = Math.pow(10, Math.floor(Math.log10(v)) - 1);
    return Math.ceil(v / pow) * pow;
  }
  function paint(invest, cash, yMax) {
    const last = invest.length - 1;
    const x = (k) => (last === 0 ? X0 : X0 + (k / last) * (X1 - X0));
    const y = (v) => Y1 - (v / yMax) * (Y1 - Y0);
    const toPath = (s) => s.map((v, k) => (k === 0 ? "M" : "L") + x(k).toFixed(1) + " " + y(v).toFixed(1)).join(" ");
    const invPath = toPath(invest);
    out.invLine.setAttribute("d", invPath);
    out.cashLine.setAttribute("d", toPath(cash));
    const back = cash.map((v, k) => "L" + x(k).toFixed(1) + " " + y(v).toFixed(1)).reverse().join(" ");
    out.gapArea.setAttribute("d", invPath + " " + back + " Z");
  }
  function drawChart(r, animate) {
    const invest = r.series.invested, cash = r.series.cash;
    const yMax = niceCeil(invest[invest.length - 1] || 1000);

    out.yTop.textContent = moneyShort(yMax);
    out.y75.textContent = moneyShort(yMax * 0.75);
    out.yMid.textContent = moneyShort(yMax * 0.5);
    out.y25.textContent = moneyShort(yMax * 0.25);
    out.yBot.textContent = moneyShort(0);
    out.xStart.textContent = Math.round(r.series.age[0]);
    out.xEnd.textContent = Math.round(r.series.age.at(-1));

    if (raf) { cancelAnimationFrame(raf); raf = null; }
    const canTween = animate && shown && shown.invest.length === invest.length;
    if (!canTween) { paint(invest, cash, yMax); shown = { invest: invest.slice(), cash: cash.slice(), yMax }; return; }

    const from = { invest: shown.invest.slice(), cash: shown.cash.slice(), yMax: shown.yMax };
    const start = performance.now(), dur = 320;
    function frame(now) {
      const e = 1 - Math.pow(1 - Math.min(1, (now - start) / dur), 3);
      const iv = invest.map((v, i) => from.invest[i] + (v - from.invest[i]) * e);
      const cv = cash.map((v, i) => from.cash[i] + (v - from.cash[i]) * e);
      const ym = from.yMax + (yMax - from.yMax) * e;
      paint(iv, cv, ym);
      shown = { invest: iv, cash: cv, yMax: ym };
      if (e < 1) raf = requestAnimationFrame(frame); else { raf = null; shown = { invest: invest.slice(), cash: cash.slice(), yMax }; }
    }
    raf = requestAnimationFrame(frame);
  }

  /* ---------- Zahl hochzählen ---------- */
  const animState = new WeakMap();
  function countTo(el, target, animate) {
    if (!el) return;
    if (!animate) { animState.set(el, target); el.textContent = money(target); return; }
    const from = animState.get(el) || 0;
    animState.set(el, target);
    const start = performance.now(), dur = 500;
    function frame(now) {
      const e = 1 - Math.pow(1 - Math.min(1, (now - start) / dur), 3);
      el.textContent = money(from + (target - from) * e);
      if (e < 1 && animState.get(el) === target) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- Reglerspur: Gelb bis zum Wert, Sand danach ---------- */
  function paintTrack(input) {
    const min = +input.min, max = +input.max;
    const pct = max > min ? ((+input.value - min) / (max - min)) * 100 : 0;
    input.style.background =
      `linear-gradient(to right, var(--color-gelb) 0%, var(--color-gelb) ${pct}%,` +
      ` var(--color-sand) ${pct}%, var(--color-sand) 100%)`;
  }

  /* Sprachwechsel: Zahlen neu formatieren */
  document.addEventListener("pm:langchange", () => render(false));

  render(false);
}
