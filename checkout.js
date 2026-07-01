/* =============================================================
   Portemonnaie — Checkout (Step 5 "Execute").
   Vanilla JS, no dependencies. The informational hand-off screen:
   the user chooses HOW to invest — open a depot themselves at a
   broker, or get personal guidance from a wealth manager.

   Phase 1 boundary: this places NO orders and gives NO buy/sell
   advice. It only points the way. The basket built on Explore is
   read from localStorage ("pm_basket") to show a short summary.

   Mirrors explore.js / product.js conventions: self-contained
   EN/DE copy that reacts to the shared "pm:langchange" event.
   ============================================================= */

(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const STORE_KEY = "pm_basket"; // same key Explore writes to

  /* ── copy (EN / DE) ─────────────────────────────────────── */
  const T = {
    en: {
      eyebrow: "Last step",
      title: 'You choose <em class="serif">your path</em>.',
      sub: "Portemonnaie guides — it does not advise. This is not investment advice under MiFID II or the Austrian WAG 2018.",
      summary: (n) => `Your portfolio is ready — ${n} ${n === 1 ? "position" : "positions"}.`,
      summaryEmpty: "Your basket is still empty.",
      adjust: "Adjust in Explore",
      build: "Build your portfolio",

      selfEyebrow: "More control",
      selfTitle: "Invest yourself",
      selfLede: "You open your depot directly with a broker.",
      colBroker: "Broker",
      colCost: "Cost",
      colEase: "Simplicity",
      colAvail: "Available",
      selfCta: "Invest yourself",

      guideEyebrow: "More guidance",
      guideTitle: "Get guidance",
      guideLede: "You are supported personally by experts.",
      guideCta: "Request guidance",

      note: "Portemonnaie only points the way. You open your account directly with the provider — we place no orders and give no advice.",
      foot: "No minimum capital. No licence required.",
      disclaimer: "This is not investment advice. Content is for educational purposes only.",
      advisors: {
        froots: { desc: "Digital wealth management from Vienna", price: "from €150 / month" },
        finup:  { desc: "Personal guidance for women", price: "free first consultation" },
        ginmon: { desc: "Managed ETF strategies", price: "from €1,000 one-off" }
      },
      steps: ["Quiz", "Type", "Explore", "Portfolio", "Checkout"]
    },
    de: {
      eyebrow: "Letzter Schritt",
      title: 'Du wählst <em class="serif">deinen Weg</em>.',
      sub: "Portemonnaie begleitet, statt zu beraten. Keine Anlageberatung im Sinne von MiFID II und WAG 2018.",
      summary: (n) => `Dein Portfolio ist bereit — ${n} ${n === 1 ? "Position" : "Positionen"}.`,
      summaryEmpty: "Dein Basket ist noch leer.",
      adjust: "In Entdecken anpassen",
      build: "Portfolio aufbauen",

      selfEyebrow: "Mehr Kontrolle",
      selfTitle: "Selbst investieren",
      selfLede: "Du eröffnest dein Depot direkt bei einem Broker.",
      colBroker: "Broker",
      colCost: "Kosten",
      colEase: "Einfachheit",
      colAvail: "Verfügbar",
      selfCta: "Selbst investieren",

      guideEyebrow: "Mehr Begleitung",
      guideTitle: "Beraten lassen",
      guideLede: "Du lässt dich persönlich von Expert:innen begleiten.",
      guideCta: "Beratung anfragen",

      note: "Portemonnaie zeigt nur den Weg. Dein Konto eröffnest du direkt beim Anbieter — wir platzieren keine Orders und geben keine Beratung.",
      foot: "Kein Mindestkapital. Keine Erlaubnis nötig.",
      disclaimer: "Dies ist keine Anlageberatung. Die Inhalte dienen ausschließlich Bildungszwecken.",
      advisors: {
        froots: { desc: "Digitale Vermögensverwaltung aus Wien", price: "ab 150 € / Monat" },
        finup:  { desc: "Persönliche Beratung für Frauen", price: "kostenloses Erstgespräch" },
        ginmon: { desc: "Betreute ETF-Strategien", price: "ab 1.000 € Einmalanlage" }
      },
      steps: ["Quiz", "Typ", "Entdecken", "Portfolio", "Checkout"]
    }
  };

  /* Brokers for the "Invest yourself" comparison. Ratings are a simple
     0–3 dot scale (illustrative, non-advisory) — names are proper nouns. */
  const BROKERS = [
    { name: "Trade Republic", cost: 3, ease: 3, avail: 2 },
    { name: "Scalable Capital", cost: 2, ease: 3, avail: 3 },
    { name: "flatex", cost: 2, ease: 2, avail: 3 }
  ];

  /* Wealth managers for the "Get guidance" path. desc + price are i18n'd. */
  const ADVISORS = [
    { key: "froots", name: "Froots" },
    { key: "finup", name: "FinUp" },
    { key: "ginmon", name: "Ginmon" }
  ];

  /* ── state ──────────────────────────────────────────────── */
  let lang = (document.documentElement.lang === "de" ||
              localStorage.getItem("pm_lang") === "de") ? "de" : "en";

  function t() { return T[lang]; }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function loadBasket() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
    catch (e) { return []; }
  }

  /* ── dots (rating out of 3) ─────────────────────────────── */
  function dots(val) {
    let out = "";
    for (let i = 1; i <= 3; i++) {
      out += `<span class="dot ${i <= val ? "is-on" : ""}"></span>`;
    }
    return `<span class="dots" aria-hidden="true">${out}</span>`;
  }

  /* ── render ─────────────────────────────────────────────── */
  function renderSummary() {
    const basket = loadBasket();
    const el = $("#ckSummary");
    if (basket.length) {
      el.innerHTML = `${esc(t().summary(basket.length))}
        <a class="checkout__adjust" href="explore.html#basket">${esc(t().adjust)}</a>`;
    } else {
      el.innerHTML = `${esc(t().summaryEmpty)}
        <a class="checkout__adjust" href="explore.html">${esc(t().build)}</a>`;
    }
  }

  function brokerRows() {
    return BROKERS.map((b) => `
      <div class="brokerrow">
        <span class="brokerrow__name">${esc(b.name)}</span>
        <span class="brokerrow__rate">${dots(b.cost)}</span>
        <span class="brokerrow__rate">${dots(b.ease)}</span>
        <span class="brokerrow__rate">${dots(b.avail)}</span>
      </div>`).join("");
  }

  function advisorRows() {
    return ADVISORS.map((a) => {
      const info = t().advisors[a.key] || { desc: "", price: "" };
      return `
      <div class="advisorrow">
        <span class="advisorrow__mark">${esc(a.name.charAt(0))}</span>
        <span class="advisorrow__body">
          <span class="advisorrow__name">${esc(a.name)}</span>
          <span class="advisorrow__desc">${esc(info.desc)}</span>
        </span>
        <span class="advisorrow__price">${esc(info.price)}</span>
      </div>`;
    }).join("");
  }

  function renderPaths() {
    $("#paths").innerHTML = `
      <section class="path">
        <p class="path__eyebrow">${esc(t().selfEyebrow)}</p>
        <h2 class="path__title">${esc(t().selfTitle)}</h2>
        <p class="path__lede">${esc(t().selfLede)}</p>
        <div class="brokertable">
          <div class="brokertable__head">
            <span>${esc(t().colBroker)}</span>
            <span>${esc(t().colCost)}</span>
            <span>${esc(t().colEase)}</span>
            <span>${esc(t().colAvail)}</span>
          </div>
          ${brokerRows()}
        </div>
        <button type="button" class="btn btn--primary path__cta" data-cta="self">${esc(t().selfCta)}</button>
        <p class="path__note" id="noteSelf" hidden>${esc(t().note)}</p>
      </section>

      <section class="path">
        <p class="path__eyebrow">${esc(t().guideEyebrow)}</p>
        <h2 class="path__title">${esc(t().guideTitle)}</h2>
        <p class="path__lede">${esc(t().guideLede)}</p>
        <div class="advisors">${advisorRows()}</div>
        <button type="button" class="btn btn--primary path__cta" data-cta="guide">${esc(t().guideCta)}</button>
        <p class="path__note" id="noteGuide" hidden>${esc(t().note)}</p>
      </section>`;

    // Informational hand-off only: reveal a note reaffirming no orders / no advice.
    $$("#paths .path__cta").forEach((btn) =>
      btn.addEventListener("click", () => {
        const note = btn.parentElement.querySelector(".path__note");
        if (note) note.hidden = false;
      })
    );
  }

  function renderSteps() {
    $("#flowsteps").innerHTML = t().steps.map((name, i) => {
      const cls = i < 4 ? "is-done" : (i === 4 ? "is-active" : "");
      return `<div class="flowstep ${cls}">
        <span class="flowstep__dot"></span><span class="flowstep__name">${esc(name)}</span>
        ${i < t().steps.length - 1 ? '<span class="flowstep__line"></span>' : ""}
      </div>`;
    }).join("");
  }

  function renderAll() {
    $("#ckEyebrow").textContent = t().eyebrow;
    $("#ckTitle").innerHTML = t().title;
    $("#ckSub").textContent = t().sub;
    $("#ckFoot").textContent = t().foot;
    $("#ckDisclaimer").textContent = t().disclaimer;
    renderSummary();
    renderPaths();
    renderSteps();
  }

  document.addEventListener("pm:langchange", (e) => {
    lang = (e.detail && e.detail.lang === "de") ? "de" : "en";
    renderAll();
  });

  renderAll();
})();
