/* =============================================================
   Portemonnaie — S8 Zusammenfassung (/summary, PRD S8, without the
   share feature → task 12). Everything renders from pm_session via
   string templates in locales/*.json: no interpretation, no
   portfolio type, no weighting preview (PRD 2.4).
   ============================================================= */
(function () {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const L = () => window.pmLocale;
  const S = () => window.pmSession;
  const t = (key, params) => L().t(key, params);
  const track = (name, payload) => { if (window.pmTrack) window.pmTrack.track(name, payload); };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  let SDGS = [];

  function phaseBlock(s) {
    const ids = (s.phase && s.phase.selected) || [];
    if (!ids.length) return esc(t("summary.phase.empty"));
    const id = ids[0]; // two phases: the first one (PRD S8)
    return esc(t("summary.phase.template", { phase: t("quiz.traps.card." + id + ".title"), core: t("summary.phase.core." + id) }));
  }

  function frameBlock(s) {
    const range = s.situation && s.situation.monthlyRange;
    const horizon = s.situation && s.situation.horizon;
    const hasAmount = range && range !== "later";
    const hasHorizon = horizon && horizon !== "open";
    if (!hasAmount && !hasHorizon) return esc(t("summary.frame.empty"));
    const parts = [];
    if (hasAmount && hasHorizon) parts.push(t("summary.frame.template", { amount: t("summary.frame.amount." + range), horizon: t("summary.frame.horizon." + horizon) }));
    else if (hasAmount) parts.push(t("summary.frame.template", { amount: t("summary.frame.amount." + range), horizon: "—" }));
    else parts.push(t("summary.frame.template", { amount: "—", horizon: t("summary.frame.horizon." + horizon) }));
    if (horizon === "over_10y") parts.push(t("summary.frame.long_horizon"));
    return esc(parts.join(" "));
  }

  function valuesBlock(s) {
    const ids = ((s.values && s.values.sdgs) || []).slice().sort((a, b) => a - b);
    if (!ids.length) return esc(t("summary.values.empty"));
    const chips = ids.map((id) => { const x = SDGS.find((y) => y.id === id); return x ? `<span class="quiz-tag">${esc(L().lang() === "de" ? x.title_de : (x.title_en || x.title_de))}</span>` : ""; }).join("");
    return esc(t("summary.values.template", { list: "" })) + `<span class="summary__chips">${chips}</span>`;
  }

  function goTo(route) {
    S().setScreen(route);
    window.location.href = S().pageFor(route) + "#" + route.split("/").pop();
  }

  function render() {
    const s = S().current();
    $("#sumHeadline").textContent = t("summary.headline");
    $("#sumLeftTitle").textContent = t("summary.left_title");
    $("#sumRightTitle").textContent = t("summary.right_title");
    $("#sumPhaseTitle").textContent = t("summary.phase.title");
    $("#sumFrameTitle").textContent = t("summary.frame.title");
    $("#sumValuesTitle").textContent = t("summary.values.title");
    $("#sumPhase").innerHTML = phaseBlock(s);
    $("#sumFrame").innerHTML = frameBlock(s);
    $("#sumValues").innerHTML = valuesBlock(s);
    const knows = t("summary.knows");
    $("#sumKnows").innerHTML = (Array.isArray(knows) ? knows : []).map((k) => `<li>${esc(k)}</li>`).join("");
    $("#sumNextTitle").textContent = t("summary.next_title");
    const steps = t("summary.next_steps");
    $("#sumNext").innerHTML = (Array.isArray(steps) ? steps : []).map((k, i) => `<li><span class="summary__stepnum" aria-hidden="true">${i + 1}</span>${esc(k)}</li>`).join("");
    $("#sumBuild").textContent = t("summary.build");
    $("#sumNote").innerHTML = window.pmInfoNote ? window.pmInfoNote.html("know", "", { bodyText: t("summary.glossary_note"), tilt: 0 }) : "";
    $("#sumCta").textContent = t("summary.cta");
    document.querySelectorAll("[data-change]").forEach((b) => { b.textContent = t("summary.change"); });
    if (window.pmGlossary) { window.pmGlossary.reset(); window.pmGlossary.mark(document.querySelector("main")); }
  }

  if (!window.pmLocale || !window.pmSession) return;
  if (!S().current()) { S().create({ locale: L().lang() }); track("session_start"); }
  S().setScreen("/summary");
  track("screen_view", { screen: "/summary" });
  track("summary_view");

  // block click → back to the matching quiz screen; values never change (PRD 5.4)
  document.querySelectorAll("[data-change]").forEach((b) => b.addEventListener("click", () => goTo(b.getAttribute("data-change"))));
  $("#sumCta").addEventListener("click", () => { track("summary_cta_click"); S().setScreen("/explore"); window.location.href = "explore.html"; });

  Promise.all([
    fetch("data/sdgs.json").then((r) => (r.ok ? r.json() : { sdgs: [] })).catch(() => ({ sdgs: [] })).then((d) => { SDGS = d.sdgs || []; }),
    window.pmGlossary ? window.pmGlossary.init() : null,
    window.pmLocale.ready
  ]).then(render);
  document.addEventListener("pm:localeready", () => { if (SDGS.length) render(); });
})();
