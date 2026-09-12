/* =============================================================
   Portemonnaie — "Mein Portfolio-Plan" (PRD S10 PDF, 7 sections).

   buildPlan(input) is a pure function: session + products + glossary
   + strings → plain data with exactly the weights of the screen
   (PRD S10 acceptance). renderPdf(plan, jsPDF) writes it with the
   vendored jsPDF (client side, decision on conflict 8). Shared by
   the browser (window.pmPlan) and node --test (require).
   ============================================================= */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.pmPlan = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const pad = (n) => String(n).padStart(2, "0");
  function fileName(date) {
    const d = date instanceof Date ? date : new Date(date || Date.now());
    return `Portemonnaie_Plan_${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.pdf`;
  }

  /* whole-euro split, remainder to the largest weight (same rule as derive.js) */
  function split(amount, items) {
    if (amount == null || !(amount > 0) || !items.length) return items.map(() => null);
    const total = items.reduce((a, it) => a + it.weight, 0) || 100;
    const out = items.map((it) => Math.floor((amount * it.weight) / total));
    const rest = Math.round(amount) - out.reduce((a, b) => a + b, 0);
    if (rest) { let idx = 0; items.forEach((it, i) => { if (it.weight > items[idx].weight) idx = i; }); out[idx] += rest; }
    return out;
  }

  function weighted(items, products, key) {
    let sum = 0, covered = 0;
    items.forEach((it) => {
      const p = products.find((x) => x.id === it.productId);
      const s = p && p.scores && p.scores[key];
      if (s && typeof s.value === "number") { sum += it.weight * s.value; covered += it.weight; }
    });
    return covered ? { value: Math.round((sum / covered) * 10) / 10, coveredWeight: covered } : { value: null, coveredWeight: 0 };
  }

  /* input: { session, products, sdgs, glossary (terms[]), t (key → string), date, locale }
     t must resolve plan.* keys; missing keys return the key itself. */
  function buildPlan(input) {
    const s = input.session || {};
    const products = input.products || [];
    const sdgs = input.sdgs || [];
    const t = input.t || ((k) => k);
    const date = input.date instanceof Date ? input.date : new Date(input.date || Date.now());
    const items = ((s.portfolio && s.portfolio.items) || []).filter((it) => products.some((p) => p.id === it.productId));
    const amount = s.situation && (s.situation.monthlyAmount != null ? s.situation.monthlyAmount : null);
    const amounts = split(amount, items);
    const chosenSdgs = (s.values && s.values.sdgs) || [];
    const sdgTitle = (id) => { const x = sdgs.find((y) => y.id === id); return x ? x.title_de : String(id); };
    const phase = (s.phase && s.phase.selected && s.phase.selected[0]) || null;

    const rows = items.map((it, i) => {
      const p = products.find((x) => x.id === it.productId);
      const sc = (k) => (p.scores && p.scores[k] && typeof p.scores[k].value === "number") ? p.scores[k] : null;
      return {
        productId: p.id, name: p.name, isin: p.isin, type: p.type, provider: p.provider,
        weight: it.weight, amount: amounts[i], ter: p.ter, sri: p.sri,
        sustainability: sc("sustainability"), gender: sc("gender")
      };
    });
    const sus = weighted(items, products, "sustainability");
    const gen = weighted(items, products, "gender");
    const present = new Set(); items.forEach((it) => { const p = products.find((x) => x.id === it.productId); (p.sdgTags || []).forEach((id) => present.add(id)); });
    const covered = chosenSdgs.filter((id) => present.has(id));
    const sources = [...new Set(rows.flatMap((r) => [r.sustainability, r.gender]).filter(Boolean).map((x) => `${x.source}, ${x.asOf}`))];

    const plan = {
      fileName: fileName(date),
      date,
      title: t("plan.title"),
      cover: {
        subtitle: t("plan.cover_subtitle"),
        values: chosenSdgs.map((id) => ({ id, title: sdgTitle(id) })),
        phaseSentence: phase ? t("summary.phase.core." + phase) : null,   // "dein Satz aus S3" (conflict 7: source = S3 core sentence)
        amount, weightsSum: items.reduce((a, it) => a + it.weight, 0)
      },
      table: rows,
      goals: { sustainability: sus, gender: gen, coverage: { covered, count: covered.length, total: chosenSdgs.length, titles: covered.map(sdgTitle) }, sources },
      todo: t("plan.todo"),          // array
      questions: t("plan.questions"), // array
      glossary: [],                  // filled below
      disclaimer: t("common.disclaimer"),
      sourcesNote: t("plan.sources_note")
    };

    // glossary: every term that occurs in the plan texts (first occurrence, by term or alias)
    const text = [plan.title, plan.cover.subtitle, plan.cover.phaseSentence || "", ...(Array.isArray(plan.todo) ? plan.todo : []), ...(Array.isArray(plan.questions) ? plan.questions : []),
      t("plan.col_product"), t("plan.col_isin"), t("plan.col_type"), t("plan.col_provider"), t("plan.col_weight"), t("plan.col_amount"), t("plan.col_ter"), t("plan.col_sri"), t("plan.col_sus"), t("plan.col_gen"),
      t("plan.goals_title"), t("plan.todo_title"), t("plan.questions_title")].join(" ").toLowerCase();
    (input.glossary || []).forEach((g) => {
      const names = [g.term_de].concat(g.aliases_de || []).map((n) => n.toLowerCase());
      if (names.some((n) => n && text.includes(n))) plan.glossary.push({ id: g.id, term: g.term_de, definition: g.definition_de, why: g.why_de, example: g.example_de });
    });
    plan.glossary.sort((a, b) => a.term.localeCompare(b.term, "de"));
    return plan;
  }

  /* ---- PDF writer (jsPDF UMD, A4 portrait) --------------------- */
  function renderPdf(plan, jsPDF, fmt) {
    const f = Object.assign({ pct: (v) => `${v} %`, eur: (v) => `${v} EUR`, num: (v) => String(v), date: (d) => d.toLocaleDateString("de-AT") }, fmt || {});
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = 210, M = 18, LW = W - 2 * M;
    let y = 0;
    const ensure = (h) => { if (y + h > 280) { doc.addPage(); y = 20; } };
    const h1 = (s) => { ensure(14); doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.text(s, M, y); y += 9; };
    const h2 = (s) => { ensure(12); doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.text(s, M, y); y += 7; };
    const p = (s, size) => { doc.setFont("helvetica", "normal"); doc.setFontSize(size || 10); const lines = doc.splitTextToSize(String(s), LW); ensure(lines.length * 5); doc.text(lines, M, y); y += lines.length * 5 + 2; };
    const small = (s) => { doc.setFont("helvetica", "normal"); doc.setFontSize(8); const lines = doc.splitTextToSize(String(s), LW); ensure(lines.length * 4); doc.text(lines, M, y); y += lines.length * 4 + 2; };

    // (1) cover
    y = 40;
    h1(plan.title);
    p(plan.cover.subtitle, 12);
    p(f.date(plan.date), 10);
    if (plan.cover.values.length) p(plan.cover.values.map((v) => `${v.id} · ${v.title}`).join("   "), 10);
    if (plan.cover.phaseSentence) p(plan.cover.phaseSentence, 10);
    // (2) table
    doc.addPage(); y = 20;
    h2(plan.t2 || "Portfolio");
    const cols = [["name", 58], ["isin", 26], ["type", 12], ["weight", 16], ["amount", 18], ["ter", 14], ["sri", 10], ["sus", 10], ["gen", 10]];
    const head = { name: "Produkt", isin: "ISIN", type: "Typ", weight: "Gew.", amount: "Monat", ter: "TER", sri: "SRI", sus: "Sust.", gen: "Gender" };
    const cell = (r, k) => {
      if (k === "name") return `${r.name}${r.provider ? " (" + r.provider + ")" : ""}`;
      if (k === "isin") return r.isin || "-";
      if (k === "type") return { etf: "ETF", stock: "Aktie", bond: "Anleihe" }[r.type] || r.type;
      if (k === "weight") return f.pct(r.weight);
      if (k === "amount") return r.amount != null ? f.eur(r.amount) : "-";
      if (k === "ter") return r.ter != null ? f.pct(f.num(Math.round(r.ter * 10000) / 100)) : "-";
      if (k === "sri") return r.sri != null ? String(r.sri) : "-";
      if (k === "sus") return r.sustainability ? f.num(r.sustainability.value) : "-";
      if (k === "gen") return r.gender ? f.num(r.gender.value) : "-";
      return "";
    };
    doc.setFontSize(8); doc.setFont("helvetica", "bold");
    let x = M; cols.forEach(([k, w]) => { doc.text(head[k], x, y); x += w; }); y += 5;
    doc.setFont("helvetica", "normal");
    plan.table.forEach((r) => {
      ensure(10);
      x = M;
      const nameLines = doc.splitTextToSize(cell(r, "name"), cols[0][1] - 2);
      cols.forEach(([k, w]) => { doc.text(k === "name" ? nameLines : cell(r, k), x, y); x += w; });
      y += Math.max(5, nameLines.length * 4) + 1;
    });
    y += 4;
    // (3) goals
    h2(plan.goalsTitle || "Deine Ziele im Portfolio");
    const g = plan.goals;
    p(`Sustainability-Score: ${g.sustainability.value != null ? f.num(g.sustainability.value) + " von 10" : "Keine Einstufung vorhanden"}${g.sustainability.coveredWeight && g.sustainability.coveredWeight < 100 ? " (auf Basis von " + g.sustainability.coveredWeight + " % des Portfolios)" : ""}`);
    p(`Gender-Score: ${g.gender.value != null ? f.num(g.gender.value) + " von 10" : "Keine Einstufung vorhanden"}`);
    if (g.coverage.total) p(`Deine Ziele: ${g.coverage.count} von ${g.coverage.total} abgedeckt${g.coverage.titles.length ? " (" + g.coverage.titles.join(", ") + ")" : ""}`);
    if (g.sources.length) small(`Einstufungen laut ${g.sources.join("; ")}`);
    // (4) todo
    h2(plan.todoTitle || "So setzt du es um");
    (plan.todo || []).forEach((step, i) => p(`${i + 1}. ${step}`));
    // (5) questions
    h2(plan.questionsTitle || "Gesprächsleitfaden");
    (plan.questions || []).forEach((q, i) => p(`${i + 1}. ${q}`));
    // (6) glossary
    if (plan.glossary.length) {
      doc.addPage(); y = 20;
      h2(plan.glossaryTitle || "Glossar");
      plan.glossary.forEach((e) => { doc.setFont("helvetica", "bold"); doc.setFontSize(10); ensure(6); doc.text(e.term, M, y); y += 5; p(e.definition); if (e.example) small(e.example); });
    }
    // (7) disclaimer + sources
    y += 4;
    small(plan.disclaimer);
    small(plan.sourcesNote);
    return doc;
  }

  return { buildPlan, renderPdf, fileName, split };
});
