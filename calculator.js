/* =============================================================
   Portemonnaie. Investment calculator.
   Vanilla JS, no dependencies. Educational projection only.

   Model
   -----
   Accumulation  : future value of a monthly contribution stream,
                   compounded monthly at an assumed average return.
   Decumulation  : the level monthly amount that would draw the final
                   pot down to zero across retirement (to age 90),
                   shown as a relatable "monthly top-up" figure.

   All figures are simplified — no fees, taxes or inflation. This is
   not investment advice (see disclaimer in the markup).
   ============================================================= */

(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  const calc = $("#calculator");
  if (!calc) return;

  const LIFE_EXPECTANCY = 90; // withdrawal horizon

  // Dynamic, number-bearing copy lives here (not in i18n.js) so it can be
  // rebuilt on each recalculation and on language switch.
  const COPY = {
    en: { incomeSub: (y) => `for ${y} years of retirement` },
    de: { incomeSub: (y) => `für ${y} Jahre im Ruhestand` },
  };

  const els = {
    monthly: $("#inMonthly"),
    ageNow: $("#inAgeNow"),
    ageRetire: $("#inAgeRetire"),
    segBtns: [...document.querySelectorAll(".calc-seg__btn")],

    outMonthly: $("#outMonthly"),
    outAgeNow: $("#outAgeNow"),
    outAgeRetire: $("#outAgeRetire"),
    outResultAge: $("#outResultAge"),
    outValue: $("#outValue"),
    outInvested: $("#outInvested"),
    outGrowth: $("#outGrowth"),
    outIncome: $("#outIncome"),
    outIncomeSub: $("#outIncomeSub"),

    barInvested: $("#barInvested"),
    barGrowth: $("#barGrowth"),

    chartArea: $("#calcArea"),
    chartLine: $("#calcLine"),
    chartBase: $("#calcBase"),
  };

  let annualReturn = 0.06;

  /* ---------- helpers ---------- */
  const lang = () =>
    document.documentElement.lang === "de" ? "de" : "en";

  function money(n) {
    const v = Math.max(0, Math.round(n));
    if (lang() === "de") {
      return new Intl.NumberFormat("de-DE").format(v) + " €";
    }
    return "€" + new Intl.NumberFormat("en-US").format(v);
  }

  // colour a range track up to its current value
  function paintTrack(input) {
    const min = +input.min, max = +input.max;
    const pct = ((+input.value - min) / (max - min)) * 100;
    input.style.background =
      `linear-gradient(to right, var(--forest) 0%, var(--forest) ${pct}%,` +
      ` var(--line-strong) ${pct}%, var(--line-strong) 100%)`;
  }

  /* ---------- core maths ---------- */
  function compute() {
    const m = +els.monthly.value;
    const ageNow = +els.ageNow.value;
    const ageRetire = +els.ageRetire.value;
    const i = annualReturn / 12;

    const years = Math.max(0, ageRetire - ageNow);
    const n = years * 12;

    const fv = n > 0 ? m * ((Math.pow(1 + i, n) - 1) / i) : 0;
    const invested = m * n;
    const growth = Math.max(0, fv - invested);

    const retYears = Math.max(1, LIFE_EXPECTANCY - ageRetire);
    const mWithdraw = retYears * 12;
    const income = fv > 0 ? (fv * i) / (1 - Math.pow(1 + i, -mWithdraw)) : 0;

    // yearly series for the chart
    const series = [];
    for (let k = 0; k <= years; k++) {
      series.push(m * ((Math.pow(1 + i, 12 * k) - 1) / i || 0));
    }
    if (series.length < 2) series.push(0, 0);

    return { m, ageRetire, years, fv, invested, growth, income, retYears, series };
  }

  /* ---------- chart ---------- */
  function drawChart(series) {
    const W = 320, H = 140, padTop = 10;
    const max = Math.max(...series, 1);
    const last = series.length - 1;

    const x = (k) => (last === 0 ? 0 : (k / last) * W);
    const y = (v) => H - (v / max) * (H - padTop);

    let line = "";
    series.forEach((v, k) => {
      line += (k === 0 ? "M" : "L") + x(k).toFixed(1) + " " + y(v).toFixed(1) + " ";
    });

    els.chartLine.setAttribute("d", line.trim());
    els.chartArea.setAttribute(
      "d",
      line.trim() + `L ${W} ${H} L 0 ${H} Z`
    );
    // dashed baseline = straight line to the same endpoint (no compounding)
    els.chartBase.setAttribute(
      "d",
      `M0 ${H} L ${x(last).toFixed(1)} ${y(series[last]).toFixed(1)}`
    );
  }

  /* ---------- count-up animation ---------- */
  const animState = new WeakMap();
  function countTo(el, target) {
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

    els.outMonthly.textContent = money(r.m);
    els.outAgeNow.textContent = els.ageNow.value;
    els.outAgeRetire.textContent = els.ageRetire.value;
    els.outResultAge.textContent = r.ageRetire;

    if (animate) {
      countTo(els.outValue, r.fv);
      countTo(els.outInvested, r.invested);
      countTo(els.outGrowth, r.growth);
      countTo(els.outIncome, r.income);
    } else {
      animState.set(els.outValue, r.fv);
      animState.set(els.outInvested, r.invested);
      animState.set(els.outGrowth, r.growth);
      animState.set(els.outIncome, r.income);
      els.outValue.textContent = money(r.fv);
      els.outInvested.textContent = money(r.invested);
      els.outGrowth.textContent = money(r.growth);
      els.outIncome.textContent = money(r.income);
    }

    const total = r.invested + r.growth || 1;
    els.barInvested.style.width = (r.invested / total) * 100 + "%";
    els.barGrowth.style.width = (r.growth / total) * 100 + "%";

    els.outIncomeSub.textContent = COPY[lang()].incomeSub(r.retYears);

    drawChart(r.series);
  }

  /* ---------- wiring ---------- */
  [els.monthly, els.ageNow, els.ageRetire].forEach((input) => {
    paintTrack(input);
    input.addEventListener("input", () => {
      paintTrack(input);
      render(true);
    });
  });

  els.segBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      els.segBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      annualReturn = parseFloat(btn.dataset.return);
      render(true);
    });
  });

  // re-render numbers/copy when the language toggles (i18n.js handles the rest)
  document.addEventListener("click", (e) => {
    if (e.target.closest && e.target.closest(".nav__lang button[data-lang]")) {
      requestAnimationFrame(() => render(false));
    }
  });

  render(false);
})();
