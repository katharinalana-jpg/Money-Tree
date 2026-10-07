/* =============================================================
   Portemonnaie – Internationalisierung EN / DE / FR
   Vanilla JS, keine Abhängigkeiten. Läuft am Ende von <body>.

   Regel: Markenslogans und Display-Headlines bleiben Englisch
   ("Start investing in what you support.", "A new era of investing.").
   Erklärende Texte, Navigation und Bedienelemente werden übersetzt.

   Markup:
     data-i18n="key"        -> textContent
     data-i18n-html="key"   -> innerHTML (für Inline-Markup)
     data-i18n-ph="key"     -> placeholder
     data-i18n-aria="key"   -> aria-label
     data-i18n-title="key"  -> title / document.title
     [data-lang="de"]       -> Sprachumschalter (Button oder Link)
   ============================================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "pm_lang";
  const LANGS = ["en", "de", "fr"];

  const I18N = {
    /* ---------------- English ---------------- */
    en: {
      "meta.title": "Portemonnaie",
      "meta.description": "Portemonnaie. Values-aligned investing for women. Start investing in what you support.",

      "nav.newsletter": "Newsletter",
      "nav.archive": "Archive",
      "nav.about": "About us",
      "nav.tools": "Tools",
      "nav.boutique": "Boutique",
      "nav.collabs": "Collaborations",
      "nav.contact": "Contact",
      "nav.press": "Press",
      "nav.lang_aria": "Language",
      "nav.menu_aria": "Open menu",
      "nav.home_aria": "Portemonnaie, home",

      "form.name_ph": "First name",
      "form.email_ph": "Email address",
      "form.lang_label": "Updates please in",
      "form.consent": 'I would like to receive updates from Portemonnaie and accept the <a href="privacy.html">privacy policy</a>.',
      "form.submit": "Subscribe to the newsletter",
      "form.submitting": "One moment…",
      "form.success": "Check your inbox and click the confirmation link to complete your sign-up.",
      "form.error": "That did not work. Please try again in a moment.",
      "form.invalid_email": "Please enter a valid email address.",
      "form.consent_required": "Please accept the privacy policy to continue.",
      "social.bluesky": "Portemonnaie on Bluesky",
      "social.substack": "Portemonnaie on Substack",
      "social.linkedin": "Portemonnaie on LinkedIn",
      "hero.archive": "To the archive",
      "era.eyebrow": "A new definition of growth",
      "era.text": "<p>We are the second generation allowed to own a bank account. The financial world was not built with us in mind. We are changing that.</p><p>We want products that match our values. We want our money to work. For us, and for what we stand for.</p>",
      "era.more": "Learn more",
      "tile.money_link": "Let your values work",
      "tile.collab_title": "Collaborations",
      "tile.collab_link": "Shaping finance together, by our rules",
      "tile.boutique_title": "Boutique",
      "tile.boutique_link": "All products",
      "footer.imprint": "Imprint",
      "footer.privacy": "Privacy policy",
      "footer.copyright": "© Portemonnaie 2026",
      "footer.beta": "Private beta. Your email is used only for Portemonnaie updates. You can unsubscribe at any time."
    },

    /* ---------------- Deutsch (Texte aus dem Canva-Entwurf) ---------------- */
    de: {
      "meta.title": "Portemonnaie",
      "meta.description": "Portemonnaie. Werteorientiertes Investieren für Frauen. Start investing in what you support.",

      "nav.newsletter": "Newsletter",
      "nav.archive": "Archiv",
      "nav.about": "Über uns",
      "nav.tools": "Tools",
      "nav.boutique": "Boutique",
      "nav.collabs": "Kollaborationen",
      "nav.contact": "Kontakt",
      "nav.press": "Presse",
      "nav.lang_aria": "Sprache",
      "nav.menu_aria": "Menü öffnen",
      "nav.home_aria": "Portemonnaie, Startseite",

      "form.name_ph": "Vorname",
      "form.email_ph": "E-Mail-Adresse",
      "form.lang_label": "Updates bitte auf",
      "form.consent": 'Ich möchte Updates von Portemonnaie erhalten und akzeptiere die <a href="privacy.html">Datenschutzerklärung</a>.',
      "form.submit": "Newsletter abonnieren",
      "form.submitting": "Einen Moment…",
      "form.success": "Sieh in deinem Postfach nach und klick auf den Bestätigungslink, um die Anmeldung abzuschließen.",
      "form.error": "Das hat nicht geklappt. Bitte versuch es gleich noch einmal.",
      "form.invalid_email": "Bitte gib eine gültige E-Mail-Adresse ein.",
      "form.consent_required": "Bitte akzeptiere die Datenschutzerklärung, um fortzufahren.",
      "social.bluesky": "Portemonnaie auf Bluesky",
      "social.substack": "Portemonnaie auf Substack",
      "social.linkedin": "Portemonnaie auf LinkedIn",
      "hero.archive": "Zum Archiv",
      "era.eyebrow": "Eine neue Definition von Wachstum",
      "era.text": "<p>Wir sind die zweite Generation, die ein Bankkonto besitzen darf. Die Finanzwelt hat uns nicht mitbedacht. Wir ändern das.</p><p>Wir wollen Produkte, die unseren Werten entsprechen. Wir wollen, dass unser Geld arbeitet. Für uns und wofür wir stehen.</p>",
      "era.more": "Mehr erfahren",
      "tile.money_link": "Lass deine Werte wirken",
      "tile.collab_title": "Kollaborationen",
      "tile.collab_link": "Gemeinsam nach unseren Regeln gestalten",
      "tile.boutique_title": "Boutique",
      "tile.boutique_link": "Alle Produkte",
      "footer.imprint": "Impressum",
      "footer.privacy": "Datenschutzerklärung",
      "footer.copyright": "© Portemonnaie 2026",
      "footer.beta": "Private Beta. Deine E-Mail wird nur für Portemonnaie-Updates verwendet. Du kannst dich jederzeit abmelden."
    },

    /* ---------------- Français ---------------- */
    fr: {
      "meta.title": "Portemonnaie",
      "meta.description": "Portemonnaie. Investir selon ses valeurs, pour les femmes. Start investing in what you support.",

      "nav.newsletter": "Newsletter",
      "nav.archive": "Archives",
      "nav.about": "À propos",
      "nav.tools": "Outils",
      "nav.boutique": "Boutique",
      "nav.collabs": "Collaborations",
      "nav.contact": "Contact",
      "nav.press": "Presse",
      "nav.lang_aria": "Langue",
      "nav.menu_aria": "Ouvrir le menu",
      "nav.home_aria": "Portemonnaie, accueil",

      "form.name_ph": "Prénom",
      "form.email_ph": "Adresse e-mail",
      "form.lang_label": "Actualités en",
      "form.consent": 'Je souhaite recevoir les actualités de Portemonnaie et j\'accepte la <a href="privacy.html">politique de confidentialité</a>.',
      "form.submit": "S\'abonner à la newsletter",
      "form.submitting": "Un instant…",
      "form.success": "Consulte ta boîte mail et clique sur le lien de confirmation pour finaliser ton inscription.",
      "form.error": "Cela n\'a pas fonctionné. Réessaie dans un instant.",
      "form.invalid_email": "Merci d\'indiquer une adresse e-mail valide.",
      "form.consent_required": "Merci d\'accepter la politique de confidentialité pour continuer.",
      "social.bluesky": "Portemonnaie sur Bluesky",
      "social.substack": "Portemonnaie sur Substack",
      "social.linkedin": "Portemonnaie sur LinkedIn",
      "hero.archive": "Vers les archives",
      "era.eyebrow": "Une nouvelle définition de la croissance",
      "era.text": "<p>Nous sommes la deuxième génération autorisée à posséder un compte bancaire. Le monde de la finance ne nous a pas prises en compte. Nous changeons cela.</p><p>Nous voulons des produits qui correspondent à nos valeurs. Nous voulons que notre argent travaille. Pour nous, et pour ce que nous défendons.</p>",
      "era.more": "En savoir plus",
      "tile.money_link": "Fais agir tes valeurs",
      "tile.collab_title": "Collaborations",
      "tile.collab_link": "Façonner la finance ensemble, selon nos règles",
      "tile.boutique_title": "Boutique",
      "tile.boutique_link": "Tous les produits",
      "footer.imprint": "Mentions légales",
      "footer.privacy": "Politique de confidentialité",
      "footer.copyright": "© Portemonnaie 2026",
      "footer.beta": "Bêta privée. Ton e-mail sert uniquement aux actualités de Portemonnaie. Tu peux te désabonner à tout moment."
    }
  };

  /* ---------- Hilfsfunktionen ---------- */
  function t(lang, key) {
    const dict = I18N[lang] || I18N.en;
    if (key in dict) return dict[key];
    if (key in I18N.en) return I18N.en[key];
    return null;
  }

  function detectLanguage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (LANGS.includes(stored)) return stored;
    } catch (e) { /* localStorage gesperrt */ }
    const fromQuery = new URLSearchParams(location.search).get("lang");
    if (LANGS.includes(fromQuery)) return fromQuery;
    const nav = (navigator.language || "en").toLowerCase().slice(0, 2);
    return LANGS.includes(nav) ? nav : "en";
  }

  function applyLanguage(lang) {
    if (!LANGS.includes(lang)) lang = "en";
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const v = t(lang, el.getAttribute("data-i18n"));
      if (v !== null) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const v = t(lang, el.getAttribute("data-i18n-html"));
      if (v !== null) el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      const v = t(lang, el.getAttribute("data-i18n-ph"));
      if (v !== null) el.setAttribute("placeholder", v);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const v = t(lang, el.getAttribute("data-i18n-aria"));
      if (v !== null) el.setAttribute("aria-label", v);
    });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const v = t(lang, el.getAttribute("data-i18n-title"));
      if (v === null) return;
      if (el.tagName === "TITLE") el.textContent = v; else el.setAttribute("title", v);
    });
    const metaDesc = document.querySelector('meta[name="description"][data-i18n-content]');
    if (metaDesc) {
      const v = t(lang, metaDesc.getAttribute("data-i18n-content"));
      if (v !== null) metaDesc.setAttribute("content", v);
    }

    document.querySelectorAll("[data-lang]").forEach((btn) => {
      const active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", active);
      if (active) btn.setAttribute("aria-current", "true"); else btn.removeAttribute("aria-current");
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignorieren */ }
    document.dispatchEvent(new CustomEvent("pm:langchange", { detail: { lang } }));
  }

  /* ---------- Start ---------- */
  const current = detectLanguage();
  applyLanguage(current);

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-lang]");
    if (!btn) return;
    e.preventDefault();
    applyLanguage(btn.getAttribute("data-lang"));
  });

  window.PM_I18N = {
    get lang() { return document.documentElement.lang; },
    t: (key) => t(document.documentElement.lang, key),
    set: applyLanguage,
    langs: LANGS
  };
})();
