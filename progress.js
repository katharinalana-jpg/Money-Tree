/* =============================================================
   Portemonnaie — ProgressBar (PRD 5.1). Four stages (decision on
   conflict 1), label per stage, active stage highlighted, a fill
   bar for sub progress inside a stage (quiz: 6 sub steps).
   Reached stages are buttons that navigate back; stages not yet
   reached are not clickable (disabled). Keyboard reachable.

   Markup: <nav class="pm-progress" id="pmProgress" data-stage="quiz">
   API:    window.pmProgress.setSub(index, total)  (0-based index)
           window.pmProgress.render()
   Renders on pm:localeready and on every session write.
   ============================================================= */
(function () {
  "use strict";
  const nav = document.getElementById("pmProgress");
  if (!nav || !window.pmSession) return;

  const S = window.pmSession;
  const L = () => window.pmLocale;
  const t = (key, params) => (L() && L().has(key)) ? L().t(key, params) : key;

  const state = { stage: nav.getAttribute("data-stage") || "quiz", sub: 0, subTotal: 0 };

  function render() {
    const session = S.current();
    const reached = S.reachedIndex(session);
    const activeIdx = S.STAGES.findIndex((st) => st.key === state.stage);
    nav.setAttribute("aria-label", t("progress.label"));

    nav.innerHTML = `<ol class="pm-progress__list">${S.STAGES.map((st, i) => {
      const isActive = i === activeIdx;
      const isDone = i < activeIdx;
      const canGo = i <= Math.max(reached, activeIdx) && !isActive;
      const fill = isActive && state.subTotal ? Math.round(((state.sub + 1) / state.subTotal) * 100) : (isDone ? 100 : 0);
      const label = t("common.stages." + st.key);
      const subText = isActive && state.subTotal ? ` <span class="pm-progress__sub">${t("progress.step_of", { n: state.sub + 1, total: state.subTotal })}</span>` : "";
      return `<li class="pm-progress__item ${isActive ? "is-active" : ""} ${isDone ? "is-done" : ""}">
        <button type="button" class="pm-progress__stage" data-route="${st.route}" ${canGo ? "" : 'disabled aria-disabled="true"'} ${isActive ? 'aria-current="step"' : ""}>
          <span class="pm-progress__name">${label}</span>${subText}
          <span class="pm-progress__track" aria-hidden="true"><span class="pm-progress__fill" style="width:${fill}%"></span></span>
        </button>
      </li>`;
    }).join("")}</ol>`;

    nav.querySelectorAll(".pm-progress__stage:not([disabled])").forEach((btn) => {
      btn.addEventListener("click", () => {
        const route = btn.getAttribute("data-route");
        S.setScreen(route);
        window.location.href = S.pageFor(route);
      });
    });
  }

  window.pmProgress = {
    setSub(index, total) { state.sub = index; state.subTotal = total; render(); },
    setStage(key) { state.stage = key; render(); },
    render
  };

  if (L()) L().ready.then(render); else render();
  document.addEventListener("pm:localeready", render);
  S.onChange(render);
})();
