/* =============================================================
   Portemonnaie — Explorer (S9 catalog, interim).
   Vanilla JS, no dependencies. Loads data/products.json and
   renders: type filter + search, a sortable list of product
   cards, and the portfolio panel (right).

   Strings from locales/*.json (locale.js); the portfolio lives in
   pm_session.portfolio.items [{ productId, weight }] (PRD 7.1),
   weights distributed evenly in 5 % steps (derive.js) until the
   weighting UI of task 14; events via track.js. Default sort is
   name A to Z; the user chooses any other sort (PRD 2.4).
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
  const TYPE_SWATCH = { etf: "var(--sage-deep)", stock: "var(--forest)", bond: "var(--sage)" }; // tokens, task 03

  /* ── state ──────────────────────────────────────────────── */
  let DATA = [];
  const filters = { types: new Set(), q: "", sort: "name" }; // PRD S9: neutral default sort

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

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

  /* ── filtering + sorting (pure set operations, PRD S9) ─── */
  function visible() {
    const q = filters.q.trim().toLowerCase();
    const out = DATA.filter((s) => {
      if (filters.types.size && !filters.types.has(s.type)) return false;
      if (q) {
        const hay = (s.name + " " + (s.isin || "") + " " + (s.themes_de || []).concat(s.themes_en || []).join(" ")).toLowerCase();
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
      b.addEventListener("click", () => {
        toggle(filters.types, b.dataset.type);
        track("explore_filter_change", { filterType: "type", value: b.dataset.type });
        renderFilters(); renderCards();
      })
    );
  }
  function toggle(set, v) { set.has(v) ? set.delete(v) : set.add(v); }

  /* ── render: cards ──────────────────────────────────────── */
  function renderCards() {
    const list = visible();
    const chosen = ids();
    $("#resultsTitle").textContent = t("explore.results.title");
    $("#resultsCount").textContent = L().tn("explore.results.count", list.length);

    if (!list.length) {
      $("#cards").innerHTML = `<li class="empty">${t("explore.results.empty")}</li>`;
      return;
    }

    $("#cards").innerHTML = list.map((s) => {
      const inBasket = chosen.includes(s.id);
      const terStr = s.ter != null ? ` · ${t("explore.card.ter")} ${L().fmtPercent(s.ter * 100)}` : "";
      const addIcon = inBasket
        ? `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10.5l3.8 3.8L16 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        : `<svg viewBox="0 0 20 20" aria-hidden="true"><line x1="10" y1="4" x2="10" y2="16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><line x1="4" y1="10" x2="16" y2="10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`;

      return `<li class="card ${inBasket ? "is-selected" : ""}" draggable="true" data-id="${esc(s.id)}">
        <div class="card__main">
          <a class="card__name" href="product.html?id=${encodeURIComponent(s.id)}" data-open="${esc(s.id)}">${esc(s.name)}</a>
          <div class="card__meta">${t("explore.type." + s.type)} · ${esc(s.region)}${terStr}${s.isin ? " · " + esc(s.isin) : ""}</div>
          <div class="card__stats">${esc(s.description_de || "")}</div>
        </div>
        <div class="card__right">
          <button type="button" class="addbtn ${inBasket ? "is-added" : ""}" data-add="${esc(s.id)}" aria-label="${esc(t("explore.card.add"))}" aria-pressed="${inBasket}">${addIcon}</button>
        </div>
      </li>`;
    }).join("");

    $$("#cards .addbtn").forEach((b) =>
      b.addEventListener("click", (e) => { e.stopPropagation(); toggleItem(b.dataset.add); })
    );
    $("#cards [data-open]").forEach((a) =>
      a.addEventListener("click", () => track("product_open", { product_id: a.dataset.open }))
    );
    wireDragSources();
  }

  /* ── portfolio items: add / remove ───────────────────────── */
  function toggleItem(id) {
    const list = ids();
    const i = list.indexOf(id);
    if (i >= 0) { list.splice(i, 1); track("product_remove", { product_id: id }); }
    else { list.push(id); track("product_add", { product_id: id }); }
    saveIds(list);
    renderCards();
    renderBasket();
  }
  function addItem(id) {
    if (!ids().includes(id)) { saveIds(ids().concat(id)); track("product_add", { product_id: id }); renderCards(); renderBasket(); }
  }

  function renderBasket() {
    const items = ids().map((id) => DATA.find((s) => s.id === id)).filter(Boolean);
    $("#basketEyebrow").textContent = t("explore.basket.eyebrow");
    $("#basketTitle").textContent = items.length ? t("explore.basket.title") : t("explore.basket.empty_title");
    $("#basketSub").textContent = items.length ? t("explore.basket.sub") : t("explore.basket.empty_sub");

    $("#basketList").innerHTML = items.map((s) =>
      `<li class="basket-item" data-id="${esc(s.id)}">
        <span class="basket-item__swatch" style="background:${TYPE_SWATCH[s.type] || TYPE_SWATCH.bond}"></span>
        <span class="basket-item__name">${esc(s.name)}</span>
        <button type="button" class="basket-item__remove" data-remove="${esc(s.id)}" aria-label="${esc(t("common.remove"))}">
          <svg viewBox="0 0 16 16" aria-hidden="true"><line x1="4" y1="4" x2="12" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="12" y1="4" x2="4" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </button>
      </li>`
    ).join("");

    $$("#basketList .basket-item__remove").forEach((b) =>
      b.addEventListener("click", () => toggleItem(b.dataset.remove))
    );

    $("#autofill").innerHTML = "";
    renderPortfolio(items);
  }

  /* ── portfolio donut (share by type, descriptive only) ──── */
  function renderPortfolio(items) {
    $("#portfolioTitle").textContent = t("explore.panel.title");
    const n = items.length;
    $("#portfolioProgress").textContent = L().tn("explore.panel.count", n);

    const counts = { etf: 0, stock: 0, bond: 0 };
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
      if (id) addItem(id);
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

  }

  function wireChrome() {
    let deb;
    $("#search").addEventListener("input", (e) => {
      clearTimeout(deb);
      deb = setTimeout(() => { filters.q = e.target.value; track("explore_filter_change", { filterType: "search", value: filters.q ? "q" : "" }); renderCards(); }, 120);
    });
    $("#sort").addEventListener("change", (e) => { filters.sort = e.target.value; track("explore_filter_change", { filterType: "sort", value: filters.sort }); renderCards(); });
    $("#checkoutBtn").addEventListener("click", () => {
      if (!ids().length) return;
      S().setScreen("/portfolio");
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

  if (!window.pmLocale || !window.pmSession) return;
  if (!S().current()) { S().create({ locale: L().lang() }); track("session_start"); }
  S().setScreen("/explore");
  track("screen_view", { screen: "/explore" });

  Promise.all([
    fetch("data/products.json").then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); }),
    window.pmLocale.ready
  ])
    .then(([doc]) => {
      DATA = doc.products || [];
      const known = ids().filter((id) => DATA.some((s) => s.id === id));
      if (known.length !== ids().length) saveIds(known);
      wireDropZone();
      wireChrome();
      renderAll();
    })
    .catch(showError);
})();
