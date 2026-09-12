/* =============================================================
   Portemonnaie — S8 share card (PRD S8, share part; task 12).

   Renders the "Werte-Karte" client side on a <canvas> in both
   formats (1080 × 1350 feed, 1080 × 1920 story) with the page's
   web fonts (document.fonts, embedded into the PNG as pixels); no
   server, no storage. Card content: three slogan lines (i18n keys,
   one serif accent word each), the chosen SDGs as chips (max 5) or
   "Ich fang an.", the cream note, wallet mark + domain, signature,
   the source line. Never name, phase, amount or portfolio.

   Share sheet: preview (feed/story), Bild speichern, Link kopieren,
   Teilen (navigator.share with files, fallback download + copy).
   Link carries an anonymous ?ref=<session id> (decision on
   conflict 9). Events: share_open, share_action {channel}.
   ============================================================= */
(function () {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const L = () => window.pmLocale;
  const S = () => window.pmSession;
  const t = (key, params) => L().t(key, params);
  const track = (name, payload) => { if (window.pmTrack) window.pmTrack.track(name, payload); };

  const FORMATS = { feed: [1080, 1350], story: [1080, 1920] };
  const C = { bg: "#FAF8F3", ink: "#1A2E24", forest: "#1F3A2E", sage: "#A8D5BA", sageSoft: "#D4EAD8", cream: "#F5EFD7", caption: "#4A5C52" };

  let SDGS = [];
  let format = "feed";
  let blobCache = {};

  function shareLink() {
    const s = S().current();
    const id = s && s.sessionId ? s.sessionId.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 32) : "";
    const base = location.origin + "/";
    return id ? base + "?ref=" + id : base;
  }
  function chosenSdgs() {
    const s = S().current();
    return ((s && s.values && s.values.sdgs) || []).slice(0, 5).map((id) => SDGS.find((x) => x.id === id)).filter(Boolean);
  }

  /* ---- canvas rendering ---------------------------------------- */
  async function fonts() {
    if (!document.fonts) return;
    await Promise.all([
      document.fonts.load("800 60px Inter"), document.fonts.load("600 32px Inter"), document.fonts.load("400 28px Inter"),
      document.fonts.load("italic 400 60px 'Instrument Serif'")
    ]);
  }

  /* draws a line with one serif-italic accent word, wrapping by words */
  function drawLine(ctx, text, accent, x, y, maxW, size) {
    const words = text.split(" ");
    const sans = `800 ${size}px Inter`, serif = `italic 400 ${size * 1.08}px 'Instrument Serif'`;
    let line = [], lines = [];
    const width = (arr) => arr.reduce((w, wd) => { ctx.font = wd.replace(/[.,:!]/g, "") === accent ? serif : sans; return w + ctx.measureText(wd + " ").width; }, 0);
    words.forEach((wd) => { if (width(line.concat(wd)) > maxW && line.length) { lines.push(line); line = [wd]; } else line.push(wd); });
    if (line.length) lines.push(line);
    lines.forEach((ln) => {
      let cx = x;
      ln.forEach((wd) => {
        const isAccent = wd.replace(/[.,:!]/g, "") === accent;
        ctx.font = isAccent ? serif : sans;
        ctx.fillStyle = C.forest;
        if (isAccent) { // sage brush highlight behind the accent word
          const w = ctx.measureText(wd).width;
          ctx.save(); ctx.globalAlpha = 0.65; ctx.fillStyle = C.sage; ctx.translate(cx + w / 2, y - size * 0.3); ctx.rotate(-1 * Math.PI / 180);
          ctx.fillRect(-w / 2 - 6, -size * 0.36, w + 12, size * 0.62); ctx.restore(); ctx.fillStyle = C.forest;
        }
        ctx.fillText(wd, cx, y);
        cx += ctx.measureText(wd + " ").width;
      });
      y += size * 1.18;
    });
    return y;
  }

  function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  async function render(fmt) {
    await fonts();
    const [W, H] = FORMATS[fmt];
    const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    const ctx = cv.getContext("2d");
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    // plant illustration, faint, bottom right
    try {
      const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = "brand/illustrations/plant_full.svg"; });
      ctx.save(); ctx.globalAlpha = 0.14; const ih = H * 0.55, iw = ih * (img.width / img.height || 0.5); ctx.drawImage(img, W - iw * 0.8, H - ih - 120, iw, ih); ctx.restore();
    } catch (e) { /* illustration optional */ }
    const M = 96, maxW = W - 2 * M;
    let y = fmt === "story" ? 360 : 220;
    ctx.textBaseline = "alphabetic";
    y = drawLine(ctx, t("share.line1"), t("share.line1_accent"), M, y, maxW, 64) + 20;
    y = drawLine(ctx, t("share.line2"), t("share.line2_accent"), M, y, maxW, 64) + 20;
    y = drawLine(ctx, t("share.line3"), t("share.line3_accent"), M, y, maxW, 64) + 40;
    // chips or "Ich fang an."
    const chosen = chosenSdgs();
    ctx.font = "600 30px Inter";
    if (chosen.length) {
      let cx = M, rowH = 72;
      chosen.forEach((s) => {
        const label = `${s.id} · ${L().lang() === "de" ? s.title_de : (s.title_en || s.title_de)}`;
        const w = ctx.measureText(label).width + 56;
        if (cx + w > W - M) { cx = M; y += rowH + 12; }
        ctx.fillStyle = C.sageSoft; roundRect(ctx, cx, y, w, rowH, 36); ctx.fill();
        ctx.fillStyle = C.ink; ctx.fillText(label, cx + 28, y + 46);
        cx += w + 14;
      });
      y += rowH + 60;
    } else { ctx.fillStyle = C.forest; ctx.font = "italic 400 56px 'Instrument Serif'"; ctx.fillText(t("share.start"), M, y + 40); y += 120; }
    // cream sticky note
    const noteH = 210, noteW = maxW * 0.86;
    ctx.save(); ctx.translate(M + noteW / 2, y + noteH / 2); ctx.rotate(-2 * Math.PI / 180);
    ctx.fillStyle = C.cream; roundRect(ctx, -noteW / 2, -noteH / 2, noteW, noteH, 24); ctx.fill();
    ctx.fillStyle = C.ink; ctx.font = "italic 400 44px 'Instrument Serif'";
    const noteLines = wrap(ctx, t("share.note"), noteW - 80);
    noteLines.forEach((ln, i) => ctx.fillText(ln, -noteW / 2 + 40, -noteH / 2 + 80 + i * 54));
    ctx.restore();
    // footer: mark + domain (left), signature (right), source (small)
    const fy = H - 110;
    ctx.fillStyle = C.forest; ctx.font = "600 34px Inter"; ctx.fillText(t("share.brand"), M + 70, fy);
    ctx.save(); ctx.fillStyle = C.forest; roundRect(ctx, M, fy - 40, 52, 52, 14); ctx.fill(); ctx.fillStyle = C.bg; ctx.font = "800 30px Inter"; ctx.fillText("P", M + 15, fy - 3); ctx.restore();
    ctx.font = "italic 400 40px 'Instrument Serif'"; ctx.textAlign = "right"; ctx.fillStyle = C.forest; ctx.fillText(t("share.signature"), W - M, fy);
    ctx.font = "400 22px Inter"; ctx.fillStyle = C.caption; ctx.fillText(t("share.source"), W - M, fy + 44); ctx.textAlign = "left";
    return new Promise((res) => cv.toBlob((b) => res({ blob: b, dataUrl: cv.toDataURL("image/png") }), "image/png"));
  }
  function wrap(ctx, text, maxW) {
    const out = []; let line = "";
    text.split(" ").forEach((w) => { const test = line ? line + " " + w : w; if (ctx.measureText(test).width > maxW && line) { out.push(line); line = w; } else line = test; });
    if (line) out.push(line); return out;
  }

  /* ---- sheet ---------------------------------------------------- */
  async function buildBoth() {
    const t0 = performance.now();
    const [feed, story] = await Promise.all([render("feed"), render("story")]);
    blobCache = { feed, story, ms: performance.now() - t0 };
    return blobCache;
  }
  function fileName(fmt) { return `Portemonnaie_Werte-Karte_${fmt}.png`; }

  async function open() {
    const sheet = $("#shareSheet");
    sheet.hidden = false; document.body.classList.add("has-drawer");
    $("#shareTitle").textContent = t("share.sheet_title");
    $("#shareText").value = t("share.text", { link: shareLink() });
    $("#shareTextLabel").textContent = t("share.text_label");
    $("#shareSave").textContent = t("share.save"); $("#shareCopy").textContent = t("share.copy"); $("#shareNative").textContent = t("share.native");
    $("#shareClose").setAttribute("aria-label", t("share.close"));
    $("#shareFeed").textContent = t("share.format_feed"); $("#shareStory").textContent = t("share.format_story");
    $("#shareNative").hidden = !(navigator.share);
    track("share_open");
    $("#shareClose").focus();
    await buildBoth();
    showPreview();
  }
  function showPreview() {
    const img = $("#sharePreview");
    if (blobCache[format]) { img.src = blobCache[format].dataUrl; img.alt = t("share.alt"); }
    $("#shareFeed").setAttribute("aria-pressed", String(format === "feed"));
    $("#shareStory").setAttribute("aria-pressed", String(format === "story"));
  }
  function close() { $("#shareSheet").hidden = true; document.body.classList.remove("has-drawer"); $("#shareBtn").focus(); }
  function toast(msg) { const el = $("#shareToast"); el.textContent = msg; el.hidden = false; clearTimeout(toast.tm); toast.tm = setTimeout(() => { el.hidden = true; }, 3500); }

  function save() {
    const a = document.createElement("a"); a.href = blobCache[format].dataUrl; a.download = fileName(format); document.body.appendChild(a); a.click(); a.remove();
    track("share_action", { channel: "save" }); toast(t("share.toast"));
  }
  function copy() {
    const text = $("#shareText").value;
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(() => toast(t("share.toast_copied"))).catch(() => { $("#shareText").select(); });
    track("share_action", { channel: "copy" });
  }
  async function native() {
    const file = new File([blobCache[format].blob], fileName(format), { type: "image/png" });
    const data = { text: $("#shareText").value, url: shareLink() };
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) await navigator.share(Object.assign({ files: [file] }, data));
      else await navigator.share(data);
      track("share_action", { channel: "native" }); toast(t("share.toast"));
    } catch (e) { if (e && e.name !== "AbortError") { save(); copy(); } }
  }

  window.pmShare = { open, close, render, buildBoth, shareLink, get cache() { return blobCache; } };

  document.addEventListener("DOMContentLoaded", () => {
    const btn = $("#shareBtn"); if (!btn) return;
    btn.addEventListener("click", open);
    $("#shareClose").addEventListener("click", close);
    $("#shareBackdrop").addEventListener("click", close);
    $("#shareFeed").addEventListener("click", () => { format = "feed"; showPreview(); });
    $("#shareStory").addEventListener("click", () => { format = "story"; showPreview(); });
    $("#shareSave").addEventListener("click", save);
    $("#shareCopy").addEventListener("click", copy);
    $("#shareNative").addEventListener("click", native);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#shareSheet").hidden) close(); });
    fetch("data/sdgs.json").then((r) => (r.ok ? r.json() : { sdgs: [] })).catch(() => ({ sdgs: [] })).then((d) => { SDGS = d.sdgs || []; });
    if (L()) L().ready.then(() => { btn.textContent = t("share.button"); });
    document.addEventListener("pm:localeready", () => { btn.textContent = t("share.button"); });
  });
})();
