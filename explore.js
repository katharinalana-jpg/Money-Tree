/* =============================================================
   Portemonnaie — Explorer (S9 catalog, interim).
   Vanilla JS, no dependencies. Loads data/securities.json and
   renders: type filter + search, a sortable list of product
   cards, and the portfolio panel (right).

   Strings come from locales/*.json through locale.js (task 04);
   numbers are formatted with pmLocale (de-AT). Default sort is
   name A to Z; the user chooses any other sort (PRD 2.4).
   Weights and the PRD product drawer come with tasks 13/14.
   ============================================================= */

(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const L = () => window.pmLocale;
  const t = (key, params) => L().t(key, params);

  const STORE_KEY = "pm_basket";
  const TYPES = ["ETF", "Stock", "Fund"];
  const TYPE_SWATCH = { ETF: "var(--sage-deep)", Stock: "var(--forest)", Fund: "var(--sage)" }; // tokens, task 03

  /* ── state ──────────────────────────────────────────────── */
  let DATA = [];
  const filters = { types: new Set(), q: "", sort: "name" }; // PRD S9: neutral default sort
  let basket = loadBasket();

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  /* ── persistence ────────────────────────────────────────── */
  function loadBasket() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveBasket() {
    localStorage.setItem(STORE_KEY, JSON.stringify(basket));
  }

  /* ── filtering + sorting (pure set operations, PRD S9) ─── */
  function visible() {
    const q = filters.q.trim().toLowerCase();
    const out = DATA.filter((s) => {
      if (filters.types.size && !filters.types.has(s.type)) return false;
      if (q) {
        const hay = (s.name + " " + (s.isin || "") + " " + (s.themes || []).join(" ")).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const by = {
      name: (a, b) => a.name.localeCompare(b.name, L().lang()),
      cost: (a, b) => (a.ter == null ? 1 : 0) - (b.ter == null ? 1 : 0) || (a.ter || 0) - (b.ter || 0)
    };
    return out.sort(by[filters.sort] || by.name);
  }

  /* ── render: filters ────────────────────────────────────── */
  function renderFilters() {
    const checkIcon = `<svg class="pill__check" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const typePills = TYPES.map((ty) =>
      `<button type="button" class="pill ${filters.types.has(ty) ? "is-on" : ""}" data-type="${ty}" aria-pressed="${filters.types.has(ty)}">${checkIcon}${t("explore.category." + ty)}</button>`
    ).join("");

    $("#filters").innerHTML = `
      <p class="filters__eyebrow">${t("explore.filter.eyebrow")}</p>
      <p class="filters__lede">${t("explore.filter.lede")}</p>
      <div class="filters__group">
        <div class="filters__label">${t("explore.filter.categories")}</div>
        <div class="pillset">${typePills}</div>
      </div>`;

    $$("#filters .pill[data-type]").forEach((b) =>
      b.addEventListener("click", () => { toggle(filters.types, b.dataset.type); renderFilters(); renderCards(); })
    );
  }
  function toggle(set, v) { set.has(v) ? set.delete(v) : set.add(v); }

  /* ── render: cards ──────────────────────────────────────── */
  function renderCards() {
    const list = visible();
    $("#resultsTitle").textContent = t("explore.results.title");
    $("#resultsCount").textContent = L().tn("explore.results.count", list.length);

    if (!list.length) {
      $("#cards").innerHTML = `<li class="empty">${t("explore.results.empty")}</li>`;
      return;
    }

    $("#cards").innerHTML = list.map((s) => {
      const inBasket = basket.includes(s.id);
      const terStr = s.ter != null ? ` · ${t("explore.card.ter")} ${L().fmtPercent(s.ter)}` : "";
      const addIcon = inBasket
        ? `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10.5l3.8 3.8L16 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        : `<svg viewBox="0 0 20 20" aria-hidden="true"><line x1="10" y1="4" x2="10" y2="16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><line x1="4" y1="10" x2="16" y2="10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`;

      return `<li class="card ${inBasket ? "is-selected" : ""}" draggable="true" data-id="${esc(s.id)}">
        <div class="card__main">
          <a class="card__name" href="product.html?id=${encodeURIComponent(s.id)}">${esc(s.name)}</a>
          <div class="card__meta">${t("explore.type." + s.type)} · ${esc(s.region)}${terStr}${s.isin ? " · " + esc(s.isin) : ""}</div>
          <div class="card__stats">${esc(s.description || "")}</div>
        </div>
        <div class="card__right">
          <button type="button" class="addbtn ${inBasket ? "is-added" : ""}" data-add="${esc(s.id)}" aria-label="${esc(t("explore.card.add"))}" aria-pressed="${inBasket}">${addIcon}</button>
        </div>
      </li>`;
    }).join("");

    $$("#cards .addbtn").forEach((b) =>
      b.addEventListener("click", (e) => { e.stopPropagation(); toggleBasket(b.dataset.add); })
    );
    wireDragSources();
  }

  /* ── basket ─────────────────────────────────────────────── */
  function toggleBasket(id) {
    const i = basket.indexOf(id);
    if (i >= 0) basket.splice(i, 1);
    else if (!basket.includes(id)) basket.push(id);
    saveBasket();
    renderCards();
    renderBasket();
  }
  function addToBasket(id) {
    if (!basket.includes(id)) { basket.push(id); saveBasket(); renderCards(); renderBasket(); }
  }

  function renderBasket() {
    const items = basket.map((id) => DATA.find((s) => s.id === id)).filter(Boolean);
    $("#basketEyebrow").textContent = t("explore.basket.eyebrow");
    $("#basketTitle").textContent = items.length ? t("explore.basket.title") : t("explore.basket.empty_title");
    $("#basketSub").textContent = items.length ? t("explore.basket.sub") : t("explore.basket.empty_sub");

    $("#basketList").innerHTML = items.map((s) =>
      `<li class="basket-item" data-id="${esc(s.id)}">
        <span class="basket-item__swatch" style="background:${TYPE_SWATCH[s.type] || TYPE_SWATCH.Fund}"></span>
        <span class="basket-item__name">${esc(s.name)}</span>
        <button type="button" class="basket-item__remove" data-remove="${esc(s.id)}" aria-label="${esc(t("common.remove"))}">
          <svg viewBox="0 0 16 16" aria-hidden="true"><line x1="4" y1="4" x2="12" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="12" y1="4" x2="4" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </button>
      </li>`
    ).join("");

    $$("#basketList .basket-item__remove").forEach((b) =>
      b.addEventListener("click", () => toggleBasket(b.dataset.remove))
    );

    $("#autofill").innerHTML = "";
    renderPortfolio(items);
  }

  /* ── portfolio donut (share by type, descriptive only) ──── */
  function renderPortfolio(items) {
    $("#portfolioTitle").textContent = t("explore.panel.title");
    const n = items.length;
    $("#portfolioProgress").textContent = L().tn("explore.panel.count", n);

    const counts = { ETF: 0, Stock: 0, Fund: 0 };
    items.forEach((s) => { counts[s.type] = (counts[s.type] || 0) + 1; });
    const total = n || 1;
    const seg = TYPES.map((ty) => ({ key: ty, label: t("portfolio.type_label." + ty), val: counts[ty], color: TYPE_SWATCH[ty] }));

    const R = 48, C = 60, circ = 2 * Math.PI * R;
    let accFrac = 0;
    const arcs = seg.filter((g) => g.val > 0).map((g) => {
      const frac = g.val / total;
      const len = frac * circ;
      const rot = -90 + accFrac * 360;
      accFrac += frac;
      return `<circle cx="${C}" cy="${C}" r="${R}" fill="none" style="stroke:${g.color}" stroke-width="12"
        stroke-dasharray="${len.toFixed(1)} ${(circ - len).toFixed(1)}"
        transform="rotate(${rot.toFixed(2)} ${C} ${C})"/>`;
    }).join("");
    $("#donut").innerHTML = `
      <circle cx="${C}" cy="${C}" r="${R}" fill="none" style="stroke:var(--line)" stroke-width="12"/>
      ${arcs}
      <text x="${C}" y="${C + 6}" text-anchor="middle" class="donut__label">${L().fmtNumber(n)}</text>`;

    $("#portfolioLegend").innerHTML = seg.map((g) => {
      const share = n ? Math.round((g.val / total) * 100) : 0;
      return `<li class="legend-row">
        <span class="legend-row__dot" style="background:${g.color}"></span>
        <span class="legend-row__name">${g.label}</span>
        <span class="legend-row__val">${L().fmtPercent(share, 0)}</span>
      </li>`;
    }).join("");

    const btn = $("#checkoutBtn");
    btn.textContent = t("explore.panel.next");
    btn.disabled = n === 0;
    $("#portfolioDisclaimer").textContent = t("common.disclaimer");
  }

  /* ── drag & drop (button alternative: the + on each card) ─ */
  function wireDragSources() {
    $$("#cards .card").forEach((card) => {
      card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", card.dataset.id);
        e.dataTransfer.effectAllowed = "copy";
        card.classList.add("is-dragging");
      });
      card.addEventListener("dragend", () => card.classList.remove("is-dragging"));
    });
  }
  function wireDropZone() {
    const zone = $("#basket");
    const over = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; zone.classList.add("is-drop"); };
    zone.addEventListener("dragover", over);
    zone.addEventListener("dragenter", over);
    zone.addEventListener("dragleave", (e) => { if (!zone.contains(e.relatedTarget)) zone.classList.remove("is-drop"); });
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("is-drop");
      const id = e.dataTransfer.getData("text/plain");
      if (id) addToBasket(id);
    });
  }

  /* ── chrome (search, sort, steps) ───────────────────────── */
  function renderChrome() {
    $("#search").placeholder = t("explore.search_placeholder");
    $("#sortLabel").textContent = t("explore.sort.label");
    $("#resultsDisclaimer").textContent = t("common.disclaimer");
    const sort = $("#sort");
    sort.innerHTML = [["name", t("explore.sort.name")], ["cost", t("explore.sort.cost")]]
      .map(([v, l]) => `<option value="${v}">${l}</option>`).join("");
    sort.value = filters.sort;

    const steps = ["quiz", "summary", "explore", "portfolio"].map((k) => t("common.stages." + k));
    $("#flowsteps").innerHTML = steps.map((name, i) => {
      const cls = i < 2 ? "is-done" : (i === 2 ? "is-active" : "");
      return `<div class="flowstep ${cls}">
        <span class="flowstep__dot"></span><span class="flowstep__name">${name}</span>
        ${i < steps.length - 1 ? '<span class="flowstep__line"></span>' : ""}
      </div>`;
    }).join("");
  }

  function wireChrome() {
    let deb;
    $("#search").addEventListener("input", (e) => {
      clearTimeout(deb);
      deb = setTimeout(() => { filters.q = e.target.value; renderCards(); }, 120);
    });
    $("#sort").addEventListener("change", (e) => { filters.sort = e.target.value; renderCards(); });
    $("#checkoutBtn").addEventListener("click", () => {
      if (!basket.length) return;
      location.href = "portfolio.html";
    });
  }

  /* ── full re-render on language switch ──────────────────── */
  function renderAll() { renderChrome(); renderFilters(); renderCards(); renderBasket(); }
  document.addEventListener("pm:localeready", () => { if (DATA.length) renderAll(); });

  /* ── boot ───────────────────────────────────────────────── */
  function showError() {
    $("#cards").innerHTML = `<li class="empty">${t("explore.results.load_error")}</li>`;
  }

  if (!window.pmLocale) return;
  Promise.all([
    fetch("data/securities.json").then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); }),
    window.pmLocale.ready
  ])
    .then(([doc]) => {
      DATA = doc.securities || [];
      basket = basket.filter((id) => DATA.some((s) => s.id === id));
      wireDropZone();
      wireChrome();
      renderAll();
    })
    .catch(showError);
})();
