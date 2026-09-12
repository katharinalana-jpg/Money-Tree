/* =============================================================
   Portemonnaie — Explorer (S9 catalog, PRD S9). Vanilla JS.

   Three columns: filter panel (category, the 17 SDG chips with the
   S7 choice preselected and removable, minimum provider scores,
   region) · search + sort + product cards · the portfolio panel.
   Filters are pure set operations on products.json; sorting never
   depends on quiz answers (PRD 2.4): name A–Z (default), cost,
   sustainability score, gender score (user-chosen). Product detail
   opens as a drawer from the right. Mobile: filters as a bottom
   sheet, portfolio as a sticky bar.

   Portfolio items live in pm_session.portfolio.items with even 5 %
   weights until the weighting UI (task 14). Strings: locales/*.json.
   Scores are provider ratings shown with source and asOf, never
   computed here (PRD 7.7).
   ============================================================= */

(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const L = () => window.pmLocale;
  const S = () => window.pmSession;
  const D = () => window.pmDerive;
  const t = (key, params) => L().t(key, params);
  const track = (name, payload) => { if (window.pmTrack) window.pmTrack.track(name, payload); };

  const TYPES = ["etf", "stock", "bond"];
  const REGIONS = ["world", "europe", "emerging", "austria", "us"];
  const RADAR = ["climate", "social", "governance", "gender", "biodiversity", "transparency"];
  const TYPE_SWATCH = { etf: "var(--sage-deep)", stock: "var(--forest)", bond: "var(--sage)" };

  /* ── state ──────────────────────────────────────────────── */
  let DATA = [];
  let SDGS = [];
  const filters = { types: new Set(), sdgs: new Set(), minSus: 0, minGen: 0, regions: new Set(), q: "", sort: "name" };
  let drawerId = null;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }
  const score = (p, key) => (p.scores && p.scores[key] && typeof p.scores[key].value === "number") ? p.scores[key] : null;
  const sdgTitle = (id) => { const x = SDGS.find((s) => s.id === id); return x ? (L().lang() === "de" ? x.title_de : (x.title_en || x.title_de)) : String(id); };

  /* ── portfolio items in the session ─────────────────────── */
  function items() {
    const s = S() && S().current();
    return (s && s.portfolio && s.portfolio.items) ? s.portfolio.items : [];
  }
  function ids() { return items().map((it) => it.productId); }
  function saveIds(list) {
    const weights = D() ? D().evenWeights(list.length) : list.map(() => Math.round(100 / (list.length || 1)));
    S().update({ portfolio: { items: list.map((id, i) => ({ productId: id, weight: weights[i] })) } });
  }
  function toggleItem(id) {
    const list = ids();
    const i = list.indexOf(id);
    if (i >= 0) { list.splice(i, 1); track("product_remove", { product_id: id }); }
    else { list.push(id); track("product_add", { product_id: id }); }
    saveIds(list);
    renderCards();
    renderBasket();
    if (drawerId) renderDrawer(drawerId);
  }
  function addItem(id) {
    if (!ids().includes(id)) { saveIds(ids().concat(id)); track("product_add", { product_id: id }); renderCards(); renderBasket(); }
  }

  /* ── filtering + sorting (pure set operations) ──────────── */
  function visible() {
    const q = filters.q.trim().toLowerCase();
    const out = DATA.filter((p) => {
      if (filters.types.size && !filters.types.has(p.type)) return false;
      if (filters.sdgs.size && !(p.sdgTags || []).some((id) => filters.sdgs.has(id))) return false;   // OR over chosen SDGs
      if (filters.regions.size && !filters.regions.has(p.region)) return false;
      if (filters.minSus > 0) { const s = score(p, "sustainability"); if (!s || s.value < filters.minSus) return false; }
      if (filters.minGen > 0) { const g = score(p, "gender"); if (!g || g.value < filters.minGen) return false; }
      if (q) {
        const hay = [p.name, p.isin || "", (p.themes_de || []).join(" "), (p.themes_en || []).join(" "), (p.sdgTags || []).map(sdgTitle).join(" ")].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const desc = (key) => (a, b) => {
      const av = score(a, key), bv = score(b, key);
      if (!av && !bv) return a.name.localeCompare(b.name, L().lang());
      if (!av) return 1; if (!bv) return -1;
      return bv.value - av.value || a.name.localeCompare(b.name, L().lang());
    };
    const by = {
      name: (a, b) => a.name.localeCompare(b.name, L().lang()),
      cost: (a, b) => (a.ter == null ? 1 : 0) - (b.ter == null ? 1 : 0) || (a.ter || 0) - (b.ter || 0) || a.name.localeCompare(b.name, L().lang()),
      sustainability: desc("sustainability"),
      gender: desc("gender")
    };
    return out.sort(by[filters.sort] || by.name);
  }

  /* ── render: filter panel ───────────────────────────────── */
  const CHECK = `<svg class="pill__check" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const pill = (attr, value, on, label) => `<button type="button" class="pill ${on ? "is-on" : ""}" ${attr}="${esc(value)}" aria-pressed="${on}">${CHECK}${esc(label)}</button>`;

  function renderFilters() {
    const typePills = TYPES.map((ty) => pill("data-type", ty, filters.types.has(ty), t("explore.category." + ty))).join("");
    const sdgPills = SDGS.map((s) => pill("data-sdg", s.id, filters.sdgs.has(s.id), s.id + " · " + sdgTitle(s.id))).join("");
    const regionPills = REGIONS.filter((r) => DATA.some((p) => p.region === r)).map((r) => pill("data-region", r, filters.regions.has(r), t("explore.region." + r))).join("");
    const slider = (id, key, label) => `
      <label class="filters__label" for="${id}">${esc(label)} <output for="${id}">${L().fmtNumber(filters[key], { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</output></label>
      <input type="range" id="${id}" min="0" max="10" step="0.5" value="${filters[key]}" data-score="${key}" />`;

    $("#filters").innerHTML = `
      <div class="filters__top">
        <p class="filters__eyebrow">${t("explore.filter.eyebrow")}</p>
        <button type="button" class="filters__close" id="filtersClose" aria-label="${esc(t("explore.filter.close"))}">×</button>
      </div>
      <p class="filters__lede">${t("explore.filter.lede")}</p>
      <div class="filters__group"><div class="filters__label">${t("explore.filter.categories")}</div><div class="pillset">${typePills}</div></div>
      <div class="filters__group"><div class="filters__label">${t("explore.filter.goals")}</div><p class="filters__hint">${t("explore.filter.goals_hint")}</p><div class="pillset pillset--sdg">${sdgPills}</div></div>
      <div class="filters__group">${slider("minSus", "minSus", t("explore.filter.min_sus"))}</div>
      <div class="filters__group">${slider("minGen", "minGen", t("explore.filter.min_gen"))}</div>
      <div class="filters__group"><div class="filters__label">${t("explore.filter.region")}</div><div class="pillset">${regionPills}</div></div>
      <button type="button" class="btn btn--ghost filters__reset" id="filtersReset">${t("explore.filter.reset")}</button>`;

    const wire = (sel, set, key, parse) => $$(sel).forEach((b) => b.addEventListener("click", () => {
      const v = parse(b.dataset[key]);
      set.has(v) ? set.delete(v) : set.add(v);
      track("explore_filter_change", { filterType: key, value: String(v) });
      renderFilters(); renderCards();
    }));
    wire("#filters .pill[data-type]", filters.types, "type", (v) => v);
    wire("#filters .pill[data-sdg]", filters.sdgs, "sdg", (v) => parseInt(v, 10));
    wire("#filters .pill[data-region]", filters.regions, "region", (v) => v);
    $$("#filters input[data-score]").forEach((inp) => inp.addEventListener("input", () => {
      filters[inp.dataset.score] = parseFloat(inp.value);
      inp.previousElementSibling.querySelector("output").textContent = L().fmtNumber(filters[inp.dataset.score], { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      track("explore_filter_change", { filterType: inp.dataset.score, value: inp.value });
      renderCards();
    }));
    $("#filtersReset").addEventListener("click", () => {
      filters.types.clear(); filters.sdgs.clear(); filters.regions.clear(); filters.minSus = 0; filters.minGen = 0;
      track("explore_filter_change", { filterType: "reset", value: "" });
      renderFilters(); renderCards();
    });
    $("#filtersClose").addEventListener("click", () => toggleSheet("filters", false));
  }

  /* ── radar (6 provider axes, PRD S9); nothing drawn without values ── */
  function radarSVG(p) {
    const vals = RADAR.map((k) => { const s = p.scores && p.scores.radar && p.scores.radar[k]; return s && typeof s.value === "number" ? s.value : null; });
    if (vals.some((v) => v == null)) return `<span class="radar radar--empty" title="${esc(t("explore.card.radar_missing"))}" aria-label="${esc(t("explore.card.radar_missing"))}"></span>`;
    const cx = 46, cy = 46, r = 38;
    const pt = (v, i) => { const a = (Math.PI * 2 * i / 6) - Math.PI / 2; const rad = r * (v / 10); return `${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`; };
    const grid = (f) => RADAR.map((_, i) => { const a = (Math.PI * 2 * i / 6) - Math.PI / 2; return `${(cx + r * f * Math.cos(a)).toFixed(1)},${(cy + r * f * Math.sin(a)).toFixed(1)}`; }).join(" ");
    const label = RADAR.map((k, i) => `${t("explore.radar." + k)} ${L().fmtNumber(vals[i], { maximumFractionDigits: 1 })}`).join(", ");
    return `<svg class="radar" viewBox="0 0 92 92" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title>
      <polygon points="${grid(1)}" fill="none" style="stroke:var(--line)"/><polygon points="${grid(0.5)}" fill="none" style="stroke:var(--line)"/>
      <polygon points="${vals.map(pt).join(" ")}" style="fill:var(--sage);stroke:var(--sage-deep)" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
  }

  function scoreLine(p, key, labelKey) {
    const s = score(p, key);
    if (!s) return `<div class="score"><span class="score__label">${t(labelKey)}</span><span class="score__val score__val--na">${t("explore.card.score_missing")}</span></div>`;
    return `<div class="score"><span class="score__label">${t(labelKey)} <small>${esc(t("explore.card.score_source", { source: s.source, asOf: s.asOf }))}</small></span><span class="score__val">${L().fmtNumber(s.value, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span></div>`;
  }

  /* ── render: cards ──────────────────────────────────────── */
  function renderCards() {
    const t0 = performance.now();
    const list = visible();
    const chosen = ids();
    $("#resultsTitle").textContent = t("explore.results.title");
    $("#resultsCount").textContent = L().tn("explore.results.count", list.length);

    if (!list.length) {
      $("#cards").innerHTML = `<li class="empty">${t("explore.results.empty")}</li>`;
      return;
    }
    $("#cards").innerHTML = list.map((p) => {
      const inBasket = chosen.includes(p.id);
      const ter = p.ter != null ? `${t("explore.card.ter")} ${L().fmtPercent(p.ter * 100)}` : null;
      const holdings = p.holdingsCount != null ? t("explore.card.holdings", { n: L().fmtNumber(p.holdingsCount) }) : t("explore.card.holdings_na");
      const sri = p.sri != null ? t("explore.card.sri", { n: p.sri }) : t("explore.card.sri_na");
      const tags = (p.sdgTags || []).slice(0, 3).map((id) => `<span class="tag">${esc(id + " · " + sdgTitle(id))}</span>`).join("");
      const meta = [t("explore.region." + p.region) || p.region, ter, p.type !== "stock" ? holdings : null].filter(Boolean).map(esc).join(" · ");
      return `<li class="card ${inBasket ? "is-selected" : ""}" draggable="true" data-id="${esc(p.id)}">
        <div class="card__main">
          <button type="button" class="card__name" data-open="${esc(p.id)}" aria-label="${esc(t("explore.card.open", { name: p.name }))}">${esc(p.name)}</button>
          <div class="card__meta"><span class="card__type" style="--swatch:${TYPE_SWATCH[p.type]}">${t("explore.category." + p.type)}</span> ${meta}</div>
          <div class="card__sri">${esc(sri)}</div>
          <div class="card__tags">${tags}</div>
        </div>
        <div class="card__scores">${scoreLine(p, "sustainability", "explore.card.score_sus")}${scoreLine(p, "gender", "explore.card.score_gen")}</div>
        <div class="card__right">
          ${radarSVG(p)}
          <button type="button" class="addbtn ${inBasket ? "is-added" : ""}" data-add="${esc(p.id)}" aria-label="${esc(inBasket ? t("explore.card.added") : t("explore.card.add"))}" aria-pressed="${inBasket}">${inBasket ? "✓" : "+"}</button>
          <span class="card__drag" aria-hidden="true" title="${esc(t("explore.card.drag"))}">⋮⋮</span>
        </div>
      </li>`;
    }).join("");

    $$("#cards .addbtn").forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); toggleItem(b.dataset.add); }));
    $$("#cards [data-open]").forEach((b) => b.addEventListener("click", () => openDrawer(b.dataset.open)));
    wireDragSources();
    if (window.pmGlossary) { window.pmGlossary.reset(); window.pmGlossary.mark($("#cards")); }
    window.__pmRenderMs = performance.now() - t0; // PRD S9 acceptance: 60 products < 100 ms
  }

  /* ── drawer (product detail, PRD S9) ────────────────────── */
  function openDrawer(id) {
    drawerId = id;
    renderDrawer(id);
    const d = $("#pmDrawer");
    d.hidden = false;
    document.body.classList.add("has-drawer");
    $("#drawerClose").focus();
    track("product_open", { product_id: id });
  }
  function closeDrawer() {
    const d = $("#pmDrawer");
    if (d.hidden) return;
    d.hidden = true;
    document.body.classList.remove("has-drawer");
    const back = drawerId && $(`#cards [data-open="${drawerId}"]`);
    drawerId = null;
    if (back) back.focus();
  }
  function renderDrawer(id) {
    const p = DATA.find((x) => x.id === id);
    if (!p) return;
    const na = t("explore.drawer.na");
    const inBasket = ids().includes(id);
    const chosenSdgs = ((S().current() || {}).values || {}).sdgs || [];
    const hits = (p.sdgTags || []).filter((x) => chosenSdgs.includes(x));
    const goals = !chosenSdgs.length ? `<p class="drawer__muted">${t("explore.drawer.goals_unset")}</p>`
      : hits.length ? `<ul class="drawer__chips">${hits.map((x) => `<li class="tag">${esc(x + " · " + sdgTitle(x))}</li>`).join("")}</ul>`
      : `<p class="drawer__muted">${t("explore.drawer.goals_none")}</p>`;
    const row = (k, v) => `<div class="critrow"><span class="critrow__k">${esc(k)}</span><span class="critrow__v">${esc(v)}</span></div>`;
    const fmt1 = (v) => L().fmtNumber(v, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const scoreRow = (key, labelKey) => { const s = score(p, key); return row(t(labelKey), s ? `${fmt1(s.value)} / 10 · ${t("explore.card.score_source", { source: s.source, asOf: s.asOf })}` : t("explore.card.score_missing")); };

    $("#drawerBody").innerHTML = `
      <p class="card__type" style="--swatch:${TYPE_SWATCH[p.type]}">${t("explore.category." + p.type)}</p>
      <h2 class="drawer__title" id="drawerTitle">${esc(p.name)}</h2>
      <p class="drawer__meta">${[p.isin, p.provider, t("explore.region." + p.region)].filter(Boolean).map(esc).join(" · ")}</p>
      <p class="drawer__desc">${esc(p.description_de || "")}</p>
      ${(p.topHoldings && p.topHoldings.length) ? `<h3 class="drawer__h3">${t("explore.drawer.inside")}</h3><ul class="drawer__chips">${p.topHoldings.slice(0, 5).map((h) => `<li class="tag">${esc(h)}</li>`).join("")}</ul>` : ""}
      ${p.type !== "stock" ? `<h3 class="drawer__h3">${t("explore.drawer.kid")}</h3><div class="critlist">
        ${row(t("explore.drawer.kid_sri"), p.sri != null ? String(p.sri) + " / 7" : na)}
        ${row(t("explore.drawer.kid_ter"), p.ter != null ? L().fmtPercent(p.ter * 100) : na)}
        ${row(t("explore.drawer.kid_distribution"), p.distribution ? t(p.distribution === "distributing" ? "explore.drawer.kid_distribution_yes" : "explore.drawer.kid_distribution_no") : na)}
        ${row(t("explore.drawer.kid_inception"), p.inceptionDate || na)}
        ${row(t("explore.drawer.kid_size"), p.fundSizeMeur != null ? `${L().fmtNumber(p.fundSizeMeur)} Mio. ${p.fundSizeCurrency || ""}`.trim() : na)}
      </div>` : ""}
      <h3 class="drawer__h3">${t("explore.drawer.scores")}</h3>
      <p class="drawer__muted">${t("explore.drawer.scale")}</p>
      <div class="critlist">${scoreRow("sustainability", "explore.card.score_sus")}${scoreRow("gender", "explore.card.score_gen")}</div>
      <h3 class="drawer__h3">${t("explore.drawer.goals")}</h3>${goals}
      <p class="drawer__kid">${p.kidUrl ? `<a href="${esc(p.kidUrl)}" target="_blank" rel="noopener">${t("explore.drawer.kid_link")}</a>` : esc(t("explore.drawer.kid_link_na"))}</p>
      <button type="button" class="btn btn--primary drawer__add" id="drawerAdd" aria-pressed="${inBasket}">${inBasket ? t("explore.drawer.added") : t("explore.drawer.add")}</button>`;
    $("#drawerAdd").addEventListener("click", () => toggleItem(id));
    if (window.pmGlossary) window.pmGlossary.mark($("#drawerBody"));
  }

  /* ── portfolio panel (weights: task 14) ─────────────────── */
  function renderBasket() {
    const list = ids().map((id) => DATA.find((p) => p.id === id)).filter(Boolean);
    $("#basketEyebrow").textContent = t("explore.basket.eyebrow");
    $("#basketTitle").textContent = list.length ? t("explore.basket.title") : t("explore.basket.empty_title");
    $("#basketSub").textContent = list.length ? t("explore.basket.sub") : t("explore.basket.empty_sub");
    $("#basketList").innerHTML = list.map((p) =>
      `<li class="basket-item" data-id="${esc(p.id)}">
        <span class="basket-item__swatch" style="background:${TYPE_SWATCH[p.type]}"></span>
        <span class="basket-item__name">${esc(p.name)}</span>
        <button type="button" class="basket-item__remove" data-remove="${esc(p.id)}" aria-label="${esc(t("common.remove"))}">×</button>
      </li>`).join("");
    $$("#basketList .basket-item__remove").forEach((b) => b.addEventListener("click", () => toggleItem(b.dataset.remove)));
    renderPortfolio(list);
    $("#panelCount").textContent = L().tn("explore.panel.count", list.length);
  }

  function renderPortfolio(list) {
    $("#portfolioTitle").textContent = t("explore.panel.title");
    const n = list.length;
    $("#portfolioProgress").textContent = L().tn("explore.panel.count", n);
    const counts = { etf: 0, stock: 0, bond: 0 };
    list.forEach((p) => { counts[p.type] = (counts[p.type] || 0) + 1; });
    const total = n || 1;
    const seg = TYPES.map((ty) => ({ key: ty, label: t("portfolio.type_label." + ty), val: counts[ty], color: TYPE_SWATCH[ty] }));
    const R = 48, C = 60, circ = 2 * Math.PI * R;
    let acc = 0;
    const arcs = seg.filter((g) => g.val > 0).map((g) => {
      const frac = g.val / total, len = frac * circ, rot = -90 + acc * 360; acc += frac;
      return `<circle cx="${C}" cy="${C}" r="${R}" fill="none" style="stroke:${g.color}" stroke-width="12" stroke-dasharray="${len.toFixed(1)} ${(circ - len).toFixed(1)}" transform="rotate(${rot.toFixed(2)} ${C} ${C})"/>`;
    }).join("");
    $("#donut").innerHTML = `<circle cx="${C}" cy="${C}" r="${R}" fill="none" style="stroke:var(--line)" stroke-width="12"/>${arcs}<text x="${C}" y="${C + 6}" text-anchor="middle" class="donut__label">${L().fmtNumber(n)}</text>`;
    $("#portfolioLegend").innerHTML = seg.map((g) => `<li class="legend-row"><span class="legend-row__dot" style="background:${g.color}"></span><span class="legend-row__name">${g.label}</span><span class="legend-row__val">${L().fmtPercent(n ? Math.round((g.val / total) * 100) : 0, 0)}</span></li>`).join("");
    const btn = $("#checkoutBtn");
    btn.textContent = t("explore.panel.next");
    btn.disabled = n === 0;
  }

  /* ── drag & drop (+ button is the alternative) ──────────── */
  function wireDragSources() {
    $$("#cards .card").forEach((card) => {
      card.addEventListener("dragstart", (e) => { e.dataTransfer.setData("text/plain", card.dataset.id); e.dataTransfer.effectAllowed = "copy"; card.classList.add("is-dragging"); });
      card.addEventListener("dragend", () => card.classList.remove("is-dragging"));
    });
  }
  function wireDropZone() {
    const zone = $("#basket");
    const over = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; zone.classList.add("is-drop"); };
    zone.addEventListener("dragover", over);
    zone.addEventListener("dragenter", over);
    zone.addEventListener("dragleave", (e) => { if (!zone.contains(e.relatedTarget)) zone.classList.remove("is-drop"); });
    zone.addEventListener("drop", (e) => { e.preventDefault(); zone.classList.remove("is-drop"); const id = e.dataTransfer.getData("text/plain"); if (id) addItem(id); });
  }

  /* ── mobile sheets ──────────────────────────────────────── */
  function toggleSheet(which, open) {
    const el = which === "filters" ? $("#filters") : $("#basketCol");
    el.classList.toggle("is-open", open);
    document.body.classList.toggle("has-sheet", open);
  }

  /* ── chrome (search, sort, toggles) ─────────────────────── */
  function renderChrome() {
    $("#search").placeholder = t("explore.search_placeholder");
    $("#search").setAttribute("aria-label", t("explore.search_placeholder"));
    $("#sortLabel").textContent = t("explore.sort.label");
    const sort = $("#sort");
    sort.innerHTML = ["name", "cost", "sustainability", "gender"].map((v) => `<option value="${v}">${t("explore.sort." + v)}</option>`).join("");
    sort.value = filters.sort;
    $("#filtersToggle").textContent = t("explore.filter.open");
    $("#panelToggle").setAttribute("aria-label", t("explore.panel.open"));
    $("#drawerClose").setAttribute("aria-label", t("explore.drawer.close"));
  }
  function wireChrome() {
    let deb;
    $("#search").addEventListener("input", (e) => { clearTimeout(deb); deb = setTimeout(() => { filters.q = e.target.value; track("explore_filter_change", { filterType: "search", value: filters.q ? "q" : "" }); renderCards(); }, 120); });
    $("#sort").addEventListener("change", (e) => { filters.sort = e.target.value; track("explore_filter_change", { filterType: "sort", value: filters.sort }); renderCards(); });
    $("#checkoutBtn").addEventListener("click", () => { if (!ids().length) return; S().setScreen("/portfolio"); location.href = "portfolio.html"; });
    $("#filtersToggle").addEventListener("click", () => toggleSheet("filters", true));
    $("#panelToggle").addEventListener("click", () => toggleSheet("panel", !$("#basketCol").classList.contains("is-open")));
    $("#drawerClose").addEventListener("click", closeDrawer);
    $("#drawerBackdrop").addEventListener("click", closeDrawer);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeDrawer(); toggleSheet("filters", false); toggleSheet("panel", false); } });
    // deep link /explore?product=<id> opens the drawer (decision on conflict 17)
    const pid = new URLSearchParams(location.search).get("product");
    if (pid && DATA.some((p) => p.id === pid)) openDrawer(pid);
  }

  function renderAll() { renderChrome(); renderFilters(); renderCards(); renderBasket(); if (drawerId) renderDrawer(drawerId); }
  document.addEventListener("pm:localeready", () => { if (DATA.length) renderAll(); });

  /* ── boot ───────────────────────────────────────────────── */
  function showError() { $("#cards").innerHTML = `<li class="empty">${t("explore.results.load_error")}</li>`; }

  if (!window.pmLocale || !window.pmSession) return;
  if (!S().current()) { S().create({ locale: L().lang() }); track("session_start"); }
  S().setScreen("/explore");
  track("screen_view", { screen: "/explore" });

  Promise.all([
    fetch("data/products.json").then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); }),
    fetch("data/sdgs.json").then((r) => (r.ok ? r.json() : { sdgs: [] })).catch(() => ({ sdgs: [] })),
    window.pmLocale.ready,
    window.pmGlossary ? window.pmGlossary.init() : null
  ])
    .then(([doc, sd]) => {
      DATA = doc.products || [];
      SDGS = sd.sdgs || [];
      // S7 choice preselects the SDG filter: visible, removable (PRD 2.4)
      (((S().current() || {}).values || {}).sdgs || []).forEach((id) => filters.sdgs.add(id));
      const known = ids().filter((id) => DATA.some((p) => p.id === id));
      if (known.length !== ids().length) saveIds(known);
      wireDropZone();
      wireChrome();
      renderAll();
      window.__pmExplore = { visible, filters, count: () => DATA.length, setData: (list) => { DATA = list; renderCards(); } }; // test hook
    })
    .catch(showError);
})();
