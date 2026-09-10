/* =============================================================
   Portemonnaie — calculator UI (ES module).
   Reads inputs, calls the pure engine, renders results + chart.
   Contains NO financial constants — those live in calc-config.mjs.
   ============================================================= */

import { CONFIG } from "./calc-config.mjs";
import { project } from "./calc-engine.mjs";

const root = document.querySelector("#calculator");
if (root) init();

function init() {
  const $ = (s) => root.querySelector(s);
  const D = CONFIG.defaults, R = CONFIG.ranges;

  /* ---------- formatting ---------- */
  const lang = () => (document.documentElement.lang === "de" ? "de" : "en");
  const t = (en, de) => (lang() === "de" ? de : en);
  function money(n) {
    const v = Math.max(0, Math.round(n));
    return lang() === "de"
      ? new Intl.NumberFormat("de-DE").format(v) + " €"
      : "€" + new Intl.NumberFormat("en-US").format(v);
  }
  // the difference, framed as the loss from staying in cash: leading "-" (0 stays "€0")
  function moneyLoss(n) {
    return Math.round(n) > 0 ? "-" + money(n) : money(n);
  }
  function moneyShort(n) {
    const v = Math.max(0, Math.round(n));
    let s;
    if (v >= 1000000) {
      const m = (v / 1000000).toFixed(2).replace(/\.?0+$/, ""); // 1, 1.5, 2.5, 12.5 …
      s = lang() === "de" ? m + " Mio" : m + "M";
    } else if (v >= 1000) {
      s = (v / 1000).toFixed(v >= 100000 ? 0 : 1).replace(/\.0$/, "") + "k";
    } else {
      s = String(v);
    }
    return lang() === "de" ? s + " €" : "€" + s;
  }

  /* ---------- range inputs (configured from CONFIG, not markup) ---------- */
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
    // render instantly while dragging — animating on every input makes the
    // auto-rescaling chart wobble/"rotate" during fast drags
    el.addEventListener("input", () => { paintTrack(el); render(false); });
  }

  /* ---------- read state ---------- */
  const val = (id) => +$("#" + id).value;
  function readInput() {
    const startAmt = val("inStart");
    return {
      age: val("inAge"),
      horizonAge: Math.max(val("inHorizon"), val("inAge")),
      monthlySaving: val("inSaving"),
      startingSavings: startAmt,
      startingInvested: 0,
    };
  }

  /* ---------- element refs for outputs ---------- */
  const out = {
    age: $("#outAge"), saving: $("#outSaving"), start: $("#outStart"),
    horizon: $("#outHorizon"),
    gap: $("#outGap"),
    // chart
    gapArea: $("#calcGapArea"), invLine: $("#calcInvest"), cashLine: $("#calcSave"),
    yTop: $("#calcYTop"), y75: $("#calcY75"), yMid: $("#calcYMid"), y25: $("#calcY25"), yBot: $("#calcYBot"),
    xStart: $("#calcXStart"), xEnd: $("#calcXEnd"),
  };

  /* ---------- render ---------- */
  function render(animate) {
    const input = readInput();
    const r = project(input, CONFIG, CONFIG.defaultScenario); // fixed base assumption (~6% real gap)

    // input read-outs
    out.age.textContent = input.age;
    out.saving.textContent = money(val("inSaving"));
    out.start.textContent = money(val("inStart"));
    out.horizon.textContent = input.horizonAge;

    // announce the friendly (formatted) value to assistive tech
    const vt = {
      inAge: out.age, inSaving: out.saving, inStart: out.start, inHorizon: out.horizon,
    };
    for (const [sid, o] of Object.entries(vt)) {
      const el = $("#" + sid);
      if (el && o) el.setAttribute("aria-valuetext", o.textContent);
    }

    // results — the difference is shown as a loss from NOT investing: red, leading "-"
    countTo(out.gap, r.gap, animate, moneyLoss);

    drawChart(r, animate);
  }

  /* ---------- chart ---------- */
  const X0 = 46, X1 = 352, Y0 = 10, Y1 = 184;
  let shown = null, raf = null;

  // Round the axis max UP to 2 significant figures. This scales almost
  // continuously as a slider is dragged (tiny steps), so the curve tracks
  // smoothly instead of snapping/"rotating" when it crosses coarse boundaries —
  // while still giving clean labels (2.4 Mio, 590k, …).
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

  /* ---------- count-up ---------- */
  const animState = new WeakMap();
  function countTo(el, target, animate, fmt = money) {
    if (!el) return;
    if (!animate) { animState.set(el, target); el.textContent = fmt(target); return; }
    const from = animState.get(el) || 0;
    animState.set(el, target);
    const start = performance.now(), dur = 500;
    function frame(now) {
      const e = 1 - Math.pow(1 - Math.min(1, (now - start) / dur), 3);
      el.textContent = fmt(from + (target - from) * e);
      if (e < 1 && animState.get(el) === target) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- slider track paint ---------- */
  function paintTrack(input) {
    const min = +input.min, max = +input.max;
    const pct = max > min ? ((+input.value - min) / (max - min)) * 100 : 0;
    input.style.background =
      `linear-gradient(to right, var(--marigold) 0%, var(--marigold) ${pct}%,` +
      ` var(--line-strong) ${pct}%, var(--line-strong) 100%)`;
  }

  /* ---------- language toggle: reformat numbers ---------- */
  document.addEventListener("click", (e) => {
    if (e.target.closest && e.target.closest(".nav__lang button[data-lang]")) {
      requestAnimationFrame(() => render(false));
    }
  });

  render(false);
}
