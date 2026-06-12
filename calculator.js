/* =============================================================
   Portemonnaie. Saving vs. investing calculator.
   Vanilla JS, no dependencies. Educational projection only.

   Model
   -----
   Two monthly-contribution streams over the same horizon:
     Saving    : compounded at a low savings rate (SAVE_RATE)
     Investing : compounded at an assumed average return (INVEST_RATE)
   The "gap" is how much more the invested stream is worth at the
   chosen retirement age — i.e. what only saving could leave behind.

   Simplified — no fees, taxes or inflation. Not investment advice.
   ============================================================= */

(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  const calc = $("#calculator");
  if (!calc) return;

  const SAVE_RATE = 0.01;   // 1% a year — typical savings account
  const INVEST_RATE = 0.06; // 6% a year — assumed long-term average

  const els = {
    monthly: $("#inMonthly"),
    ageNow: $("#inAgeNow"),
    ageRetire: $("#inAgeRetire"),

    outMonthly: $("#outMonthly"),
    outAgeNow: $("#outAgeNow"),
    outAgeRetire: $("#outAgeRetire"),
    outResultAge: $("#outResultAge"),
    outGap: $("#outGap"),
    outInvest: $("#outInvest"),
    outSave: $("#outSave"),

    chartGap: $("#calcGapArea"),
    chartInvest: $("#calcInvest"),
    chartSave: $("#calcSave"),

    yTop: $("#calcYTop"),
    y75: $("#calcY75"),
    yMid: $("#calcYMid"),
    y25: $("#calcY25"),
    yBot: $("#calcYBot"),
    xStart: $("#calcXStart"),
    xEnd: $("#calcXEnd"),
  };

  /* ---------- helpers ---------- */
  const lang = () => (document.documentElement.lang === "de" ? "de" : "en");

  function money(n) {
    const v = Math.max(0, Math.round(n));
    if (lang() === "de") return new Intl.NumberFormat("de-DE").format(v) + " €";
    return "€" + new Intl.NumberFormat("en-US").format(v);
  }

  // compact money for axis ticks, e.g. €120k / 120k €
  function moneyShort(n) {
    const v = Math.max(0, Math.round(n));
    let s;
    if (v >= 1000) {
      s = (v / 1000).toFixed(v >= 100000 ? 0 : 1).replace(/\.0$/, "") + "k";
    } else {
      s = String(v);
    }
    return lang() === "de" ? s + " €" : "€" + s;
  }

  // round a value up to a "nice" axis maximum (1, 2, 2.5 or 5 × 10ⁿ).
  // Keeps the y-axis on steady steps so the curve grows visibly against the
  // gridlines instead of always being re-stretched to fill the box.
  function niceCeil(v) {
    if (v <= 0) return 1000;
    const pow = Math.pow(10, Math.floor(Math.log10(v)));
    const n = v / pow;
    let step;
    if (n <= 1) step = 1;
    else if (n <= 2) step = 2;
    else if (n <= 2.5) step = 2.5;
    else if (n <= 5) step = 5;
    else step = 10;
    return step * pow;
  }

  // future value of a monthly contribution stream after `months` months
  function futureValue(monthly, annualRate, months) {
    if (months <= 0) return 0;
    const i = annualRate / 12;
    if (i === 0) return monthly * months;
    return monthly * ((Math.pow(1 + i, months) - 1) / i);
  }

  // colour a range track up to its current value
  function paintTrack(input) {
    const min = +input.min, max = +input.max;
    const pct = ((+input.value - min) / (max - min)) * 100;
    input.style.background =
      `linear-gradient(to right, var(--marigold) 0%, var(--marigold) ${pct}%,` +
      ` var(--line-strong) ${pct}%, var(--line-strong) 100%)`;
  }

  /* ---------- core maths ---------- */
  function compute() {
    const m = +els.monthly.value;
    const ageNow = +els.ageNow.value;
    const ageRetire = +els.ageRetire.value;
    const years = Math.max(0, ageRetire - ageNow);

    const saveFinal = futureValue(m, SAVE_RATE, years * 12);
    const investFinal = futureValue(m, INVEST_RATE, years * 12);
    const gap = Math.max(0, investFinal - saveFinal);

    const save = [], invest = [];
    for (let k = 0; k <= years; k++) {
      save.push(futureValue(m, SAVE_RATE, 12 * k));
      invest.push(futureValue(m, INVEST_RATE, 12 * k));
    }
    if (invest.length < 2) { save.push(0, 0); invest.push(0, 0); }

    return { ageNow, ageRetire, years, saveFinal, investFinal, gap, save, invest };
  }

  /* ---------- chart ---------- */
  // plot region inside the 360x210 viewBox (margins leave room for axes)
  const X0 = 46, X1 = 352, Y0 = 10, Y1 = 184;

  // paint the three paths for one frame of geometry
  function paintChart(invest, save, yMax) {
    const last = invest.length - 1;
    const x = (k) => (last === 0 ? X0 : X0 + (k / last) * (X1 - X0));
    const y = (v) => Y1 - (v / yMax) * (Y1 - Y0);

    const toPath = (series) =>
      series
        .map((v, k) => (k === 0 ? "M" : "L") + x(k).toFixed(1) + " " + y(v).toFixed(1))
        .join(" ");

    const investPath = toPath(invest);
    els.chartInvest.setAttribute("d", investPath);
    els.chartSave.setAttribute("d", toPath(save));

    // shaded gap = invest line forward, then back along the save line
    const saveBack = save
      .map((v, k) => "L" + x(k).toFixed(1) + " " + y(v).toFixed(1))
      .reverse()
      .join(" ");
    els.chartGap.setAttribute("d", investPath + " " + saveBack + " Z");
  }

  // current on-screen geometry, so a new drag tweens from where we are
  let shown = null;
  let chartRAF = null;

  function drawChart(r, animate) {
    const invest = r.invest, save = r.save;
    const yMax = niceCeil(invest[invest.length - 1]);

    // axis labels track the target scale immediately
    els.yTop.textContent = moneyShort(yMax);
    els.y75.textContent = moneyShort(yMax * 0.75);
    els.yMid.textContent = moneyShort(yMax * 0.5);
    els.y25.textContent = moneyShort(yMax * 0.25);
    els.yBot.textContent = moneyShort(0);
    els.xStart.textContent = r.ageNow;
    els.xEnd.textContent = r.ageRetire;

    if (chartRAF) { cancelAnimationFrame(chartRAF); chartRAF = null; }

    // can only tween when the point count matches (same horizon length)
    const canTween = animate && shown && shown.invest.length === invest.length;
    if (!canTween) {
      paintChart(invest, save, yMax);
      shown = { invest: invest.slice(), save: save.slice(), yMax };
      return;
    }

    const from = { invest: shown.invest.slice(), save: shown.save.slice(), yMax: shown.yMax };
    const start = performance.now();
    const dur = 320;
    function frame(now) {
      const t = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - t, 3); // ease-out
      const iv = invest.map((v, i) => from.invest[i] + (v - from.invest[i]) * e);
      const sv = save.map((v, i) => from.save[i] + (v - from.save[i]) * e);
      const ym = from.yMax + (yMax - from.yMax) * e;
      paintChart(iv, sv, ym);
      shown = { invest: iv, save: sv, yMax: ym };
      if (t < 1) {
        chartRAF = requestAnimationFrame(frame);
      } else {
        chartRAF = null;
        shown = { invest: invest.slice(), save: save.slice(), yMax };
      }
    }
    chartRAF = requestAnimationFrame(frame);
  }

  /* ---------- count-up animation ---------- */
  const animState = new WeakMap();
  function countTo(el, target, animate) {
    if (!animate) {
      animState.set(el, target);
      el.textContent = money(target);
      return;
    }
    const from = animState.get(el) || 0;
    animState.set(el, target);
    const start = performance.now();
    const dur = 500;
    function frame(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = money(from + (target - from) * eased);
      if (t < 1 && animState.get(el) === target) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- render ---------- */
  function render(animate) {
    const r = compute();

    els.outMonthly.textContent = money(+els.monthly.value);
    els.outAgeNow.textContent = els.ageNow.value;
    els.outAgeRetire.textContent = els.ageRetire.value;
    els.outResultAge.textContent = r.ageRetire;

    countTo(els.outGap, r.gap, animate);
    countTo(els.outInvest, r.investFinal, animate);
    countTo(els.outSave, r.saveFinal, animate);

    drawChart(r, animate);
  }

  // keep current age below retirement age — a negative horizon breaks the maths
  const MIN_GAP = 1;
  function clampAges(changed) {
    const now = +els.ageNow.value;
    const ret = +els.ageRetire.value;
    if (ret - now >= MIN_GAP) return;
    if (changed === els.ageNow) {
      els.ageNow.value = ret - MIN_GAP;   // user pushed "today" up — cap it
      paintTrack(els.ageNow);
    } else {
      els.ageRetire.value = now + MIN_GAP; // user pulled retirement down — cap it
      paintTrack(els.ageRetire);
    }
  }

  /* ---------- wiring ---------- */
  [els.monthly, els.ageNow, els.ageRetire].forEach((input) => {
    paintTrack(input);
    input.addEventListener("input", () => {
      if (input === els.ageNow || input === els.ageRetire) clampAges(input);
      paintTrack(input);
      render(true);
    });
  });

  // re-render numbers when the language toggles (i18n.js handles the rest)
  document.addEventListener("click", (e) => {
    if (e.target.closest && e.target.closest(".nav__lang button[data-lang]")) {
      requestAnimationFrame(() => render(false));
    }
  });

  render(false);
})();
