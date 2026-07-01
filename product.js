/* =============================================================
   Portemonnaie — Product detail page.
   Vanilla JS, no dependencies. Reads ?id=<security-id> from the
   URL, loads data/securities.json + data/prices/<id>.json, and
   renders: identity header, impact/gender/sustainability scores,
   a price-history line chart, the Four Capitals breakdown,
   investment criteria, gender/ESG facts, and related products.

   Mirrors explore.js conventions (EXPLORE-style self-contained
   i18n + the shared "pm:langchange" event). All price data is a
   static snapshot — see data/README.md. No buy/sell language:
   educational, factual display only.
   ============================================================= */

(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const params = new URLSearchParams(location.search);
  const ID = params.get("id");

  /* ── copy (EN / DE) ─────────────────────────────────────── */
  const T = {
    en: {
      back: "Back to Explore",
      score: { impact: "Impact", gender: "Gender score", sus: "Sustainability" },
      impactWord: { High: "High", Medium: "Medium", Low: "Low" },
      priceTitle: "Price history",
      pricePeriod: "Last 12 months",
      previewBadge: "Preview data",
      priceSource: (src, asOf) => `Source: ${src} · as of ${asOf}`,
      priceSample: "Illustrative sample data — not live market prices.",
      noPrice: "No price history available for this security yet.",
      capitalsTitle: "Four Capitals",
      capitals: { financial: "Financial", environmental: "Environmental", social: "Social", network: "Network" },
      radarAxes: ["Environmental", "Social", "Sustainability", "Gender", "Financial", "Network"],
      criteriaTitle: "Investment criteria",
      crit: {
        ter: "Ongoing charges (TER)", aum: "Fund size (AUM)", replication: "Replication",
        domicile: "Domicile", distribution: "Use of income", inception: "Inception",
        indexTracked: "Index tracked", exchange: "Exchange", marketCap: "Market cap",
        peRatio: "P/E ratio", dividendYield: "Dividend yield", assetClass: "Asset class",
        sector: "Sector", region: "Region", currency: "Currency"
      },
      holdingsTitle: "Top holdings",
      factsTitle: "Gender & ESG facts",
      facts: {
        womenOnBoardPct: "Women on the board", womenInLeadershipPct: "Women in leadership",
        esgHighlights: "ESG highlights", controversies: "Points to watch"
      },
      relatedTitle: "More in this theme",
      disclaimer: "This is not investment advice. Content is for educational purposes only.",
      notFound: "Product not found.",
      notFoundSub: "We could not find a security with that id. Head back to Explore to browse the list.",
      loadError: "Could not load the securities dataset. Open this page through a local web server or the deployed site.",
      replication: { "Physical": "Physical", "Physical (sampling)": "Physical (sampling)", "Synthetic": "Synthetic" },
      distribution: { "Accumulating": "Accumulating", "Distributing": "Distributing" },
      na: "n/a"
    },
    de: {
      back: "Zurück zu Entdecken",
      score: { impact: "Wirkung", gender: "Gender-Score", sus: "Nachhaltigkeit" },
      impactWord: { High: "Hoch", Medium: "Mittel", Low: "Niedrig" },
      priceTitle: "Kursverlauf",
      pricePeriod: "Letzte 12 Monate",
      previewBadge: "Beispieldaten",
      priceSource: (src, asOf) => `Quelle: ${src} · Stand ${asOf}`,
      priceSample: "Illustrative Beispieldaten — keine Live-Kurse.",
      noPrice: "Für dieses Wertpapier liegt noch kein Kursverlauf vor.",
      capitalsTitle: "Vier Kapitalien",
      capitals: { financial: "Finanzen", environmental: "Umwelt", social: "Soziales", network: "Netzwerk" },
      radarAxes: ["Umwelt", "Soziales", "Nachhaltigkeit", "Gender", "Finanzen", "Netzwerk"],
      criteriaTitle: "Investmentkriterien",
      crit: {
        ter: "Laufende Kosten (TER)", aum: "Fondsvolumen (AUM)", replication: "Replikation",
        domicile: "Domizil", distribution: "Ertragsverwendung", inception: "Auflage",
        indexTracked: "Abgebildeter Index", exchange: "Börse", marketCap: "Marktkapitalisierung",
        peRatio: "KGV", dividendYield: "Dividendenrendite", assetClass: "Anlageklasse",
        sector: "Sektor", region: "Region", currency: "Währung"
      },
      holdingsTitle: "Größte Positionen",
      factsTitle: "Gender- & ESG-Fakten",
      facts: {
        womenOnBoardPct: "Frauen im Board", womenInLeadershipPct: "Frauen in Führung",
        esgHighlights: "ESG-Highlights", controversies: "Im Blick behalten"
      },
      relatedTitle: "Mehr aus diesem Thema",
      disclaimer: "Dies ist keine Anlageberatung. Die Inhalte dienen ausschließlich Bildungszwecken.",
      notFound: "Produkt nicht gefunden.",
      notFoundSub: "Wir konnten kein Wertpapier mit dieser ID finden. Geh zurück zu Entdecken, um die Liste zu durchstöbern.",
      loadError: "Der Wertpapier-Datensatz konnte nicht geladen werden. Öffne diese Seite über einen lokalen Webserver oder die veröffentlichte Seite.",
      replication: { "Physical": "Physisch", "Physical (sampling)": "Physisch (Sampling)", "Synthetic": "Synthetisch" },
      distribution: { "Accumulating": "Thesaurierend", "Distributing": "Ausschüttend" },
      na: "k. A."
    }
  };

  const THEME_LABELS = {
    en: {
      "gender-diversity": "Women in leadership", "empowerment": "Empowerment",
      "sustainability": "Sustainability", "esg": "ESG leaders", "sri": "Socially responsible",
      "climate": "Climate", "clean-energy": "Renewable energy", "water": "Water",
      "environment": "Environment", "consumer-staples": "Everyday goods",
      "technology": "Technology", "impact": "Impact"
    },
    de: {
      "gender-diversity": "Frauen in Führung", "empowerment": "Empowerment",
      "sustainability": "Nachhaltigkeit", "esg": "ESG-Vorreiter", "sri": "Sozial verantwortlich",
      "climate": "Klima", "clean-energy": "Erneuerbare Energien", "water": "Wasser",
      "environment": "Umwelt", "consumer-staples": "Alltagsgüter",
      "technology": "Technologie", "impact": "Wirkung"
    }
  };

  const GENDER_NUM = { "A+": 100, A: 90, B: 78, C: 64, D: 50, E: 35, F: 15 };
  const TYPE_SWATCH = { ETF: "#4E8C6A", Stock: "#1F3A2E", Fund: "#A8D5BA" };

  /* ── state ──────────────────────────────────────────────── */
  let DATA = [];
  let SEC = null;
  let PRICES = null;
  let lang = (document.documentElement.lang === "de" ||
              localStorage.getItem("pm_lang") === "de") ? "de" : "en";

  function t() { return T[lang]; }
  const dec = () => (lang === "de" ? "," : ".");
  function fmt(n, d = 2) {
    if (n == null) return t().na;
    return Number(n).toFixed(d).replace(".", dec());
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }
  function themeLabel(key) { return (THEME_LABELS[lang][key]) || key.replace(/-/g, " "); }

  /* ── radar (6 axes, labelled) ───────────────────────────── */
  function radarSVG(s) {
    const axes = [
      s.fourCapitals.environmental, s.fourCapitals.social, s.sustainabilityScore,
      GENDER_NUM[s.genderScore], s.fourCapitals.financial, s.fourCapitals.network
    ];
    const labels = t().radarAxes;
    const cx = 120, cy = 86, r = 58, rl = 72;   // rl = label ring radius
    const at = (i) => (Math.PI * 2 * i / axes.length) - Math.PI / 2;
    const grid = (val) => axes.map((_, i) =>
      `${(cx + r * val * Math.cos(at(i))).toFixed(1)},${(cy + r * val * Math.sin(at(i))).toFixed(1)}`).join(" ");
    const poly = axes.map((v, i) =>
      `${(cx + r * (v / 100) * Math.cos(at(i))).toFixed(1)},${(cy + r * (v / 100) * Math.sin(at(i))).toFixed(1)}`).join(" ");
    const spokes = axes.map((_, i) =>
      `<line x1="${cx}" y1="${cy}" x2="${(cx + r * Math.cos(at(i))).toFixed(1)}" y2="${(cy + r * Math.sin(at(i))).toFixed(1)}" stroke="rgba(26,46,36,0.12)" stroke-width="1"/>`).join("");
    const labelText = axes.map((_, i) => {
      const a = at(i);
      const lx = cx + rl * Math.cos(a);
      let ly = cy + rl * Math.sin(a);
      const sin = Math.sin(a);
      if (sin < -0.5) ly -= 2;          // give the top label a little clearance
      else if (sin > 0.5) ly += 4;      // and the bottom label
      return `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" class="radar__label">${esc(labels[i])}</text>`;
    }).join("");
    return `<svg class="radar radar--lg" viewBox="0 0 240 184" role="img" aria-label="${esc(t().capitalsTitle)}">
      <polygon points="${grid(1)}" fill="none" stroke="rgba(26,46,36,0.10)" stroke-width="1"/>
      <polygon points="${grid(0.66)}" fill="none" stroke="rgba(26,46,36,0.08)" stroke-width="1"/>
      <polygon points="${grid(0.33)}" fill="none" stroke="rgba(26,46,36,0.06)" stroke-width="1"/>
      ${spokes}
      <polygon points="${poly}" fill="rgba(168,213,186,0.55)" stroke="#4E8C6A" stroke-width="1.5" stroke-linejoin="round"/>
      ${labelText}
    </svg>`;
  }

  /* ── price line chart ───────────────────────────────────── */
  function lineChartSVG(series) {
    const W = 720, H = 240, padL = 6, padR = 6, padT = 14, padB = 18;
    const cs = series.map((p) => p.c);
    const min = Math.min(...cs), max = Math.max(...cs), span = (max - min) || 1;
    const n = series.length;
    const X = (i) => padL + (n === 1 ? 0 : (i / (n - 1)) * (W - padL - padR));
    const Y = (c) => padT + (1 - (c - min) / span) * (H - padT - padB);
    const line = series.map((p, i) => `${X(i).toFixed(1)},${Y(p.c).toFixed(1)}`).join(" ");
    const area = `${padL},${(H - padB).toFixed(1)} ${line} ${(W - padR).toFixed(1)},${(H - padB).toFixed(1)}`;
    const lx = X(n - 1).toFixed(1), ly = Y(cs[n - 1]).toFixed(1);
    return `<svg class="linechart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t().priceTitle)}">
      <polygon class="linechart__area" points="${area}" fill="rgba(168,213,186,0.18)"/>
      <polyline class="linechart__line" points="${line}" fill="none" stroke="#4E8C6A" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
      <circle cx="${lx}" cy="${ly}" r="4" fill="#1F3A2E"/>
    </svg>`;
  }

  function renderPrice() {
    if (!PRICES || !PRICES.series || !PRICES.series.length) {
      return `<p class="pcard__empty">${t().noPrice}</p>`;
    }
    const s = PRICES.series;
    const first = s[0].c, last = s[s.length - 1].c;
    const chg = ((last - first) / first) * 100;
    const up = chg >= 0;
    const cur = PRICES.currency || SEC.currency || "";
    const badge = PRICES.placeholder
      ? `<span class="pcard__badge">${t().previewBadge}</span>` : "";
    let caption;
    if (PRICES.placeholder) {
      caption = t().priceSample;
    } else {
      const srcName = PRICES.source || "—";
      const srcHtml = PRICES.sourceUrl
        ? `<a class="pcard__srclink" href="${esc(PRICES.sourceUrl)}" target="_blank" rel="noopener">${esc(srcName)}</a>`
        : esc(srcName);
      caption = t().priceSource(srcHtml, esc(PRICES.asOf || "—"));
    }
    return `
      <div class="pchart__head">
        <div class="pchart__now">
          <span class="pchart__price">${cur} ${fmt(last)}</span>
          <span class="pchart__chg ${up ? "is-up" : "is-down"}">${up ? "+" : ""}${fmt(chg, 1)}%</span>
        </div>
        <span class="pchart__period">${t().pricePeriod}</span>
      </div>
      ${lineChartSVG(s)}
      <p class="pcard__caption">${caption}</p>
      ${badge}`;
  }

  /* ── criteria + facts rows ──────────────────────────────── */
  function critRows() {
    const p = SEC.profile || {};
    const rows = [];
    const add = (label, val) => { if (val != null && val !== "") rows.push([label, val]); };

    add(t().crit.assetClass, SEC.assetClass);
    add(t().crit.sector, SEC.sector);
    add(t().crit.region, SEC.region);
    add(t().crit.currency, SEC.currency);
    if (SEC.ter != null) add(t().crit.ter, fmt(SEC.ter) + "%");
    add(t().crit.aum, p.aum);
    add(t().crit.marketCap, p.marketCap);
    if (p.replication) add(t().crit.replication, t().replication[p.replication] || p.replication);
    add(t().crit.domicile, p.domicile);
    if (p.distribution) add(t().crit.distribution, t().distribution[p.distribution] || p.distribution);
    add(t().crit.inception, p.inception);
    add(t().crit.indexTracked, p.indexTracked);
    add(t().crit.exchange, p.exchange);
    if (p.peRatio != null) add(t().crit.peRatio, fmt(p.peRatio, 1));
    if (p.dividendYield != null) add(t().crit.dividendYield, fmt(p.dividendYield, 2) + "%");

    return rows.map(([l, v]) =>
      `<div class="critrow"><span class="critrow__k">${esc(l)}</span><span class="critrow__v">${esc(v)}</span></div>`).join("");
  }

  function capitalBars() {
    const fc = SEC.fourCapitals;
    const order = ["financial", "environmental", "social", "network"];
    return order.map((k) => {
      const v = fc[k];
      return `<div class="capbar">
        <div class="capbar__head"><span>${esc(t().capitals[k])}</span><span class="capbar__val">${v}</span></div>
        <div class="capbar__track"><span class="capbar__fill" style="width:${v}%"></span></div>
      </div>`;
    }).join("");
  }

  function factsBlock() {
    const f = SEC.facts || {};
    const parts = [];
    if (f.womenOnBoardPct != null)
      parts.push(`<div class="critrow"><span class="critrow__k">${t().facts.womenOnBoardPct}</span><span class="critrow__v">${fmt(f.womenOnBoardPct, 0)}%</span></div>`);
    if (f.womenInLeadershipPct != null)
      parts.push(`<div class="critrow"><span class="critrow__k">${t().facts.womenInLeadershipPct}</span><span class="critrow__v">${fmt(f.womenInLeadershipPct, 0)}%</span></div>`);
    let lists = "";
    if (f.esgHighlights && f.esgHighlights.length)
      lists += `<div class="factlist"><p class="factlist__h">${t().facts.esgHighlights}</p><ul>${f.esgHighlights.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`;
    if (f.controversies && f.controversies.length)
      lists += `<div class="factlist factlist--watch"><p class="factlist__h">${t().facts.controversies}</p><ul>${f.controversies.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`;
    return parts.join("") + lists;
  }

  function relatedCards() {
    const related = DATA.filter((s) =>
      s.id !== SEC.id && s.themes.some((th) => SEC.themes.includes(th))).slice(0, 3);
    if (!related.length) return "";
    return `<section class="pcard">
      <h2 class="pcard__title">${t().relatedTitle}</h2>
      <div class="related">${related.map((s) => `
        <a class="relcard" href="product.html?id=${encodeURIComponent(s.id)}">
          <span class="relcard__swatch" style="background:${TYPE_SWATCH[s.type]}"></span>
          <span class="relcard__name">${esc(s.name)}</span>
          <span class="relcard__meta">${esc(s.type)} · ${t().score.gender} ${esc(s.genderScore)}</span>
        </a>`).join("")}</div>
    </section>`;
  }

  /* ── full render ────────────────────────────────────────── */
  function render() {
    const holdings = (SEC.profile && SEC.profile.topHoldings && SEC.profile.topHoldings.length)
      ? `<section class="pcard">
           <h2 class="pcard__title">${t().holdingsTitle}</h2>
           <div class="holdings">${SEC.profile.topHoldings.map((h) => `<span class="tag">${esc(h)}</span>`).join("")}</div>
         </section>`
      : "";

    $("#product").innerHTML = `
      <a class="product__back" href="explore.html">← ${t().back}</a>

      <header class="product__head">
        <div class="product__id">
          <span class="product__type" style="--swatch:${TYPE_SWATCH[SEC.type]}">${esc(SEC.type)}</span>
          <h1 class="product__name">${esc(SEC.name)}</h1>
          <p class="product__meta">${[SEC.ticker, SEC.isin, SEC.sector, SEC.region].filter(Boolean).map(esc).join(" · ")}</p>
          <p class="product__desc">${esc(SEC.description)}</p>
        </div>
        <div class="scoretiles">
          <div class="scoretile scoretile--impact">
            <span class="scoretile__label">${t().score.impact}</span>
            <span class="scoretile__big">${t().impactWord[SEC.impact] || SEC.impact}</span>
          </div>
          <div class="scoretile">
            <span class="scoretile__label">${t().score.gender}</span>
            <span class="scoretile__big">${esc(SEC.genderScore)}</span>
          </div>
          <div class="scoretile">
            <span class="scoretile__label">${t().score.sus}</span>
            <span class="scoretile__big">${SEC.sustainabilityScore}<small>/100</small></span>
          </div>
        </div>
      </header>

      <div class="product__grid">
        <section class="pcard pchart" aria-label="${esc(t().priceTitle)}">
          <h2 class="pcard__title">${t().priceTitle}</h2>
          ${renderPrice()}
        </section>

        <section class="pcard" aria-label="${esc(t().capitalsTitle)}">
          <h2 class="pcard__title">${t().capitalsTitle}</h2>
          <div class="capitals">
            <div class="capitals__radar">${radarSVG(SEC)}</div>
            <div class="capitals__bars">${capitalBars()}</div>
          </div>
        </section>
      </div>

      <div class="product__grid">
        <section class="pcard">
          <h2 class="pcard__title">${t().criteriaTitle}</h2>
          <div class="critlist">${critRows()}</div>
        </section>
        <section class="pcard">
          <h2 class="pcard__title">${t().factsTitle}</h2>
          <div class="critlist">${factsBlock()}</div>
        </section>
      </div>

      ${holdings}
      ${relatedCards()}

      <p class="product__disclaimer">${t().disclaimer}</p>`;
  }

  function renderError(title, sub) {
    $("#product").innerHTML = `<div class="product__error">
      <a class="product__back" href="explore.html">← ${t().back}</a>
      <h1 class="product__name">${esc(title)}</h1>
      <p class="product__desc">${esc(sub)}</p>
    </div>`;
  }

  /* ── language switch ────────────────────────────────────── */
  document.addEventListener("pm:langchange", (e) => {
    lang = (e.detail && e.detail.lang === "de") ? "de" : "en";
    if (SEC) render();
  });

  /* ── boot ───────────────────────────────────────────────── */
  fetch("data/securities.json")
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((doc) => {
      DATA = doc.securities || [];
      SEC = DATA.find((s) => s.id === ID) || null;
      if (!SEC) { renderError(t().notFound, t().notFoundSub); return null; }
      document.title = `${SEC.name} — Portemonnaie`;
      // price snapshot is optional; render even if it 404s
      return fetch(`data/prices/${encodeURIComponent(SEC.id)}.json`)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null)
        .then((prices) => { PRICES = prices; render(); });
    })
    .catch(() => renderError(t().notFound, t().loadError));
})();
