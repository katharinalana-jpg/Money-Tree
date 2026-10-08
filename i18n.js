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
      "tile.collab_link": "Shaping finance together,<br>by our rules",
      "tile.boutique_title": "Boutique",
      "tile.boutique_link": "All products",
      "about.meta_title": "About us – Portemonnaie",
      "about.title": "At Portemonnaie we fight to close the gender wealth gap.",
      "about.intro": "<p>Our grandmothers needed a signature to open an account of their own. We are the second generation that manages its own money. Yet it often sits idle. Money that sits idle still works. Just not for us, and not for what we stand for. In the account, in the savings book, in the life insurance it co-finances things we would never buy.</p><p><strong>Those who do not manage their own money let others decide.</strong></p><p>Today's money changes tomorrow's world. A fairer economy only emerges if we take part. That is why we demand a financial world that takes our lives into account, respects our values and closes the gender pension gap step by step.</p>",
      "about.what_title": "What Portemonnaie does",
      "about.what": "<p>Portemonnaie is an independent platform that shows where your money flows, what it works for and how you can put it to work yourself: by your values, step by step, without anyone trying to sell you something, without finance-bro attitude. We recommend nothing. We make things visible so that you decide.</p>",
      "about.era": "<p>Financial independence is the highest form of self-care, the greatest act of emancipation.</p><p>As we grow, we also want the world around us to grow: people, community, nature, and resources handled with care. We are convinced that growth has to be measured across four dimensions, because every company needs financial capital, environmental capital, social capital and network capital.</p><p>For a long time only financial profit counted as success. We invest in companies that see the success of the environment and society as their own.</p>",
      "about.claim": "Money is power.<br>Use yours.",
      "soon.meta_title": "Coming soon – Portemonnaie",
      "soon.text": "<p>Something is taking shape here. We are building Portemonnaie step by step and taking the time to do it right.</p><p>Get a message as soon as we go live.</p>",
      "footer.imprint": "Imprint",
      "footer.privacy": "Privacy policy",
      "footer.copyright": "© Portemonnaie 2026",
      "footer.beta": "Your email is used only for Portemonnaie updates. You can unsubscribe at any time."
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
      "tile.collab_link": "Gemeinsam nach unseren<br>Regeln gestalten",
      "tile.boutique_title": "Boutique",
      "tile.boutique_link": "Alle Produkte",
      "about.meta_title": "Über uns – Portemonnaie",
      "about.title": "Bei Portemonnaie kämpfen wir dafür, den Gender Wealth Gap zu schließen.",
      "about.intro": "<p>Unsere Großmütter brauchten eine Unterschrift, um ein eigenes Konto zu eröffnen. Wir sind die zweite Generation, die ihr Geld selbst verwaltet. Dennoch liegt es oft still. Geld, das liegt, arbeitet trotzdem. Nur nicht für uns und nicht für das, wofür wir stehen. Am Konto, am Sparbuch, in der Lebensversicherung finanziert es mit, was man nicht kaufen würde.</p><p><strong>Wer sein Geld nicht selbst verwaltet, lässt andere entscheiden.</strong></p><p>Geld von heute verändert die Welt von morgen. Eine gerechtere Wirtschaft entsteht nur, wenn wir uns beteiligen. Deshalb fordern wir eine Finanzwelt, die unsere Lebenslagen mitdenkt, unsere Werte respektiert und den Gender Pension Gap Stück für Stück schließt.</p>",
      "about.what_title": "Was Portemonnaie tut",
      "about.what": "<p>Portemonnaie ist eine unabhängige Plattform, die zeigt, wohin dein Geld fließt, wofür es arbeitet und wie du es selbst arbeiten lässt: nach deinen Werten, Schritt für Schritt, ohne jemanden, der dir etwas verkaufen will, ohne Finance-Bro-Attitude. Wir empfehlen nichts. Wir machen sichtbar, damit du entscheidest.</p>",
      "about.era": "<p>Finanzielle Unabhängigkeit ist die höchste Form von Self Care – der größte Akt der Emanzipation.</p><p>Während wir wachsen, wollen wir auch, dass die Welt um uns wächst: Menschen, Gemeinschaft, Natur, und dass mit Ressourcen vernünftig umgegangen wird. Wir sind überzeugt: Wachstum muss über vier Dimensionen gemessen werden, denn jedes Unternehmen braucht finanzielles Kapital, ökologisches Kapital, soziales Kapital, Netzwerkkapital.</p><p>Lange galt nur finanzieller Gewinn als Erfolg. Wir investieren in Unternehmen, die den Erfolg von Umwelt und Gesellschaft als ihren eigenen verstehen.</p>",
      "about.claim": "Money is power.<br>Use yours.",
      "soon.meta_title": "Coming soon – Portemonnaie",
      "soon.text": "<p>Hier entsteht gerade etwas. Wir bauen Portemonnaie Schritt für Schritt und nehmen uns die Zeit, es richtig zu machen.</p><p>Erhalte eine Nachricht, sobald wir live gehen.</p>",
      "footer.imprint": "Impressum",
      "footer.privacy": "Datenschutzerklärung",
      "footer.copyright": "© Portemonnaie 2026",
      "footer.beta": "Deine E-Mail wird nur für Portemonnaie-Updates verwendet. Du kannst dich jederzeit abmelden."
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
      "tile.collab_link": "Façonner la finance ensemble,<br>selon nos règles",
      "tile.boutique_title": "Boutique",
      "tile.boutique_link": "Tous les produits",
      "about.meta_title": "À propos – Portemonnaie",
      "about.title": "Chez Portemonnaie, nous nous battons pour combler l'écart de richesse entre les genres.",
      "about.intro": "<p>Nos grands-mères avaient besoin d'une signature pour ouvrir leur propre compte. Nous sommes la deuxième génération qui gère son argent elle-même. Pourtant, il dort souvent. L'argent qui dort travaille quand même. Simplement pas pour nous, ni pour ce que nous défendons. Sur le compte, sur le livret, dans l'assurance-vie, il cofinance ce que l'on n'achèterait jamais.</p><p><strong>Qui ne gère pas son argent laisse les autres décider.</strong></p><p>L'argent d'aujourd'hui change le monde de demain. Une économie plus juste ne naît que si nous y participons. C'est pourquoi nous exigeons un monde financier qui tient compte de nos réalités, respecte nos valeurs et comble pas à pas l'écart de retraite entre les genres.</p>",
      "about.what_title": "Ce que fait Portemonnaie",
      "about.what": "<p>Portemonnaie est une plateforme indépendante qui montre où va ton argent, pour quoi il travaille et comment le faire travailler toi-même : selon tes valeurs, pas à pas, sans personne qui cherche à te vendre quelque chose, sans attitude de finance bro. Nous ne recommandons rien. Nous rendons visible, pour que tu décides.</p>",
      "about.era": "<p>L'indépendance financière est la plus haute forme de self-care, le plus grand acte d'émancipation.</p><p>En grandissant, nous voulons aussi que le monde autour de nous grandisse : les personnes, la communauté, la nature, et que les ressources soient gérées avec bon sens. Nous en sommes convaincues : la croissance doit se mesurer selon quatre dimensions, car chaque entreprise a besoin de capital financier, de capital écologique, de capital social et de capital relationnel.</p><p>Longtemps, seul le profit financier comptait comme réussite. Nous investissons dans des entreprises qui considèrent la réussite de l'environnement et de la société comme la leur.</p>",
      "about.claim": "Money is power.<br>Use yours.",
      "soon.meta_title": "Bientôt – Portemonnaie",
      "soon.text": "<p>Quelque chose se construit ici. Nous bâtissons Portemonnaie pas à pas et prenons le temps de bien faire.</p><p>Reçois un message dès que nous serons en ligne.</p>",
      "footer.imprint": "Mentions légales",
      "footer.privacy": "Politique de confidentialité",
      "footer.copyright": "© Portemonnaie 2026",
      "footer.beta": "Ton e-mail sert uniquement aux actualités de Portemonnaie. Tu peux te désabonner à tout moment."
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
