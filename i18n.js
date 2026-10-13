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
      "nav.home_aria": "Portemonnaie, home",

      "form.name_ph": "First name",
      "form.email_ph": "Email address",
      "form.lang_label": "Updates please in",
      "form.consent": 'I would like to receive updates from Portemonnaie and accept the <a href="/privacy.html">privacy policy</a>.',
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
      "era.text": "<p>We are the second generation allowed to have a bank account. The financial industry has overlooked us for decades. We’re changing that.</p><p>We want products that align with our values. We want our money to work for us – and for what we stand for.</p>",
      "era.more": "Learn more",
      "tile.money_link": "Let your values work",
      "tile.collab_title": "Collaborations",
      "tile.collab_link": "Shaping things together,<br>on our terms",
      "tile.boutique_title": "Boutique",
      "tile.boutique_link": "All products",
      "about.meta_title": "About us – Portemonnaie",
      "about.title": "At Portemonnaie, we're fighting to close the gender wealth gap.",
      "about.intro": "<p>Our grandmothers needed a signature to open their own bank account. <strong>We are the second generation to manage our own money.</strong> Yet it often lies dormant. Money that lies dormant still works – just not for us and not for what we stand for. Whether in a bank account, a savings account, or a life insurance account, it helps finance things we wouldn’t buy.</p><p class=\"about__pull\"><strong>“Those who do not manage their own finances let others decide.”</strong></p><p>Today’s money shapes tomorrow’s world. <strong>A fairer economy can only be created if we get engaged.</strong> That’s why we’re calling for a financial system that takes our life stages into account, respects our values, and closes the gender pension gap step by step.</p>",
      "about.what_title": "What Portemonnaie does",
      "about.what": "<p>Portemonnaie is an <strong>independent platform</strong> that shows where your money flows, what it’s doing, and how you can make it work for you: according to your values, step by step, without anyone trying to sell you anything, and without finance bro attitude. We don’t recommend anything. We make things transparent so you can decide.</p><p><strong>Portemonnaie serves as a creative space and think factory to determine what we need today to shape the financial world of tomorrow.</strong></p>",
      "about.era": "<p>Financial independence is the highest form of self-care – <strong>the greatest act of emancipation</strong>.</p><p>As we grow, we also want the world around us to grow: people, community, nature, and the responsible use of resources. We are convinced that growth must be measured across four dimensions, because <strong>every company needs financial capital, ecological capital, social capital, and network capital</strong>.</p><p>For a long time, only financial profits were considered a measure of success. We want to invest in companies that view the success of the environment and society as their own.</p>",
      "about.claim": "Money is power.<br>Use yours.",
      "soon.meta_title": "Coming soon – Portemonnaie",
      "soon.text": "<p>Something is taking shape here. We are building Portemonnaie step by step and taking the time to do it right.</p><p>Get a message as soon as we go live.</p>",
      "archive.meta_title": "Archive – Portemonnaie",
      "archive.title": "Archive",
      "archive.back": "To the archive",
      "soon_archive.meta_title": "Archive – Coming soon – Portemonnaie",
      "soon_archive.title": "Portemonnaie Magazine<br>is coming!",
      "soon.register": "Register now",
      "soon_archive.note": "Every Sunday at 10 am: get the latest on values based investing and smart step-by-step guides.",
      "collab.meta_title": "Collaborations – Portemonnaie",
      "collab.title": "Collaborations",
      "collab.intro": "Portemonnaie is under construction. As a studio for thinking and doing, we are looking for partners who carry Portemonnaie from the very beginning.",
      "collab.media_title": "Media partnerships",
      "collab.media_text": "Magazines, newsletters, podcasts and networks that carry our content and tools in German, English and French, and shape campaigns with us.",
      "collab.founding_title": "Founding partnerships",
      "collab.founding_text": "Companies and foundations that support the starting phase as sponsors, help shape its development, and thereby become a visible part from the very beginning.",
      "collab.inst_title": "Institutional partnerships",
      "collab.inst_text": "Associations, universities, and organizations for seminars, roundtables, and collaborative research projects. We’ll take care of the planning and execution.",
      "collab.closing": "Together, we are exploring what we need today to shape the financial world of tomorrow and achieve economic equality.",
      "collab.cta": "Get in touch",
      "legal.imprint_title": "Legal notice – Portemonnaie",
      "legal.privacy_title": "Privacy policy – Portemonnaie",
      "confirmed.meta_title": "Confirmed – Portemonnaie",
      "confirmed.title": "Thank you, you're in.",
      "confirmed.text": "<p>Your email address is confirmed. From now on the Portemonnaie newsletter arrives every Sunday at 10 am.</p>",
      "confirmed.back": "Back to the start page",
      "footer.imprint": "Imprint",
      "footer.privacy": "Privacy policy",
      "footer.copyright": "© Portemonnaie 2026"
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
      "nav.home_aria": "Portemonnaie, Startseite",

      "form.name_ph": "Vorname",
      "form.email_ph": "E-Mail-Adresse",
      "form.lang_label": "Updates bitte auf",
      "form.consent": 'Ich möchte Updates von Portemonnaie erhalten und akzeptiere die <a href="/privacy.html">Datenschutzerklärung</a>.',
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
      "about.intro": "<p>Unsere Großmütter brauchten eine Unterschrift, um ein eigenes Konto zu eröffnen. <strong>Wir sind die zweite Generation, die ihr Geld selbst verwaltet.</strong> Dennoch liegt es oft still. Geld, das liegt, arbeitet trotzdem. Nur nicht für uns und nicht für das, wofür wir stehen. Am Konto, am Sparbuch, in der Lebensversicherung finanziert es mit, was man nicht kaufen würde.</p><p class=\"about__pull\"><strong>„Wer sein Geld nicht selbst verwaltet, lässt andere entscheiden.“</strong></p><p>Geld von heute verändert die Welt von morgen. <strong>Eine gerechtere Wirtschaft entsteht nur, wenn wir uns beteiligen.</strong> Deshalb fordern wir eine Finanzwelt, die unsere Lebenslagen mitdenkt, unsere Werte respektiert und den Gender Pension Gap Stück für Stück schließt.</p>",
      "about.what_title": "Was Portemonnaie tut",
      "about.what": "<p>Portemonnaie ist eine <strong>unabhängige Plattform</strong>, die zeigt, wohin dein Geld fließt, wofür es arbeitet und wie du es selbst arbeiten lässt: nach deinen Werten, Schritt für Schritt, ohne jemanden, der dir etwas verkaufen will, ohne Finance-Bro-Attitude. Wir empfehlen nichts. Wir machen sichtbar, damit du entscheidest.</p><p><strong>Portemonnaie fungiert als Atelier und Denkwerkstatt, um zu verstehen, was wir heute brauchen, um die Finanzwelt von morgen zu gestalten.</strong></p>",
      "about.era": "<p>Finanzielle Unabhängigkeit ist die höchste Form von Self Care – <strong>der größte Akt der Emanzipation</strong>.</p><p>Während wir wachsen, wollen wir auch, dass die Welt um uns wächst: Menschen, Gemeinschaft, Natur, und dass mit Ressourcen vernünftig umgegangen wird. Wir sind überzeugt: Wachstum muss über vier Dimensionen gemessen werden, denn <strong>jedes Unternehmen braucht finanzielles Kapital, ökologisches Kapital, soziales Kapital, Netzwerkkapital</strong>.</p><p>Lange galt nur finanzieller Gewinn als Erfolg. Wir investieren in Unternehmen, die den Erfolg von Umwelt und Gesellschaft als ihren eigenen verstehen.</p>",
      "about.claim": "Money is power.<br>Use yours.",
      "soon.meta_title": "Coming soon – Portemonnaie",
      "soon.text": "<p>Hier entsteht gerade etwas. Wir bauen Portemonnaie Schritt für Schritt und nehmen uns die Zeit, es richtig zu machen.</p><p>Erhalte eine Nachricht, sobald wir live gehen.</p>",
      "archive.meta_title": "Archiv – Portemonnaie",
      "archive.title": "Archiv",
      "archive.back": "Zum Archiv",
      "soon_archive.meta_title": "Archiv – Coming soon – Portemonnaie",
      "soon_archive.title": "Das Portemonnaie-Magazin<br>kommt!",
      "soon.register": "Registrier dich jetzt",
      "soon_archive.note": "Jeden Sonntag um 10 Uhr: das Neueste zu werteorientiertem Investieren und kluge Step-by-Step-Guides.",
      "collab.meta_title": "Kollaborationen – Portemonnaie",
      "collab.title": "Kollaborationen",
      "collab.intro": "Portemonnaie befindet sich im Aufbau. Als Denk- und Tu-Atelier suchen wir Partnerschaften, die Portemonnaie von Anfang an mittragen.",
      "collab.media_title": "Medienpartnerschaften",
      "collab.media_text": "Magazine, Newsletter, Podcasts und Netzwerke, die Inhalte und Tools auf Deutsch, Englisch und Französisch weitertragen und mit uns Kampagnen gestalten.",
      "collab.founding_title": "Gründungspartnerschaften",
      "collab.founding_text": "Unternehmen und Stiftungen, die die Startphase als Sponsor begleiten, den Aufbau mitgestalten und damit sichtbar Teil des Anfangs werden.",
      "collab.inst_title": "Institutionelle Partnerschaften",
      "collab.inst_text": "Verbände, Hochschulen und Organisationen für Seminare, Round Tables und gemeinsame Forschungsfragen. Konzept und Durchführung liegen bei uns.",
      "collab.closing": "Gemeinsam untersuchen wir, was wir heute brauchen, um die Finanzwelt von morgen zu gestalten und ökonomische Gleichstellung zu erreichen.",
      "collab.cta": "Partnerschaft anfragen",
      "legal.imprint_title": "Impressum – Portemonnaie",
      "legal.privacy_title": "Datenschutzerklärung – Portemonnaie",
      "confirmed.meta_title": "Bestätigt – Portemonnaie",
      "confirmed.title": "Danke, du bist dabei.",
      "confirmed.text": "<p>Deine E-Mail-Adresse ist bestätigt. Der Portemonnaie-Newsletter kommt ab jetzt jeden Sonntag um 10 Uhr.</p>",
      "confirmed.back": "Zur Startseite",
      "footer.imprint": "Impressum",
      "footer.privacy": "Datenschutzerklärung",
      "footer.copyright": "© Portemonnaie 2026"
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
      "nav.home_aria": "Portemonnaie, accueil",

      "form.name_ph": "Prénom",
      "form.email_ph": "e-mail",
      "form.lang_label": "Actualités en",
      "form.consent": 'Je veux recevoir les news de Portemonnaie et j\'accepte la <a href="/privacy.html">politique de confidentialité</a>.',
      "form.submit": "S\'abonner à la newsletter",
      "form.submitting": "Un instant…",
      "form.success": "Consulte ta boîte mail et clique sur le lien de confirmation pour finaliser ton inscription.",
      "form.error": "Cela n\'a pas fonctionné. Réessaie dans un instant.",
      "form.invalid_email": "Merci d\'indiquer une adresse e-mail valide.",
      "form.consent_required": "Merci d\'accepter la politique de confidentialité pour continuer.",
      "social.bluesky": "Portemonnaie sur Bluesky",
      "social.substack": "Portemonnaie sur Substack",
      "social.linkedin": "Portemonnaie sur LinkedIn",
      "hero.archive": "Bibliothèque",
      "era.eyebrow": "Redéfinir la croissance",
      "era.text": "<p>Nous sommes la deuxième génération de femmes à pouvoir ouvrir un compte bancaire sans le consentement de leur mari. Le monde de la finance n’a pas pensé à nous. Nous allons changer ça.</p><p>Nous voulons des solutions qui correspondent à nos valeurs. On veut que notre argent travaille. Pour nous, et pour ce qu'on défend.</p>",
      "era.more": "En savoir plus",
      "tile.money_link": "Faites travailler vos valeurs",
      "tile.collab_title": "Collaborations",
      "tile.collab_link": "Façonnons l’avenir ensemble,<br>selon nos propres règles",
      "tile.boutique_title": "Boutique",
      "tile.boutique_link": "Tous les produits",
      "about.meta_title": "À propos – Portemonnaie",
      "about.title": "Chez Portemonnaie, nous nous battons pour réduire les inégalités de patrimoine.",
      "about.intro": "<p>Nos grand-mères avaient besoin d’une signature pour ouvrir leur propre compte bancaire. <strong>Nous sommes la deuxième génération de femmes à pouvoir gérer notre argent nous-mêmes.</strong> Pourtant, souvent, cet argent reste dormant. L’argent qui dort travaille malgré tout. Seulement, il ne travaille pas pour nous, ni pour ce que nous défendons. Sur un compte bancaire, un livret d’épargne ou dans une assurance-vie, notre argent contribue à financer des activités que nous ne choisirions pas d’encourager.</p><p class=\"about__pull\"><strong>« Ne pas gérer son argent soi-même, c’est laisser les autres décider à sa place. »</strong></p><p>L’argent d’aujourd’hui change le monde de demain. <strong>Une économie juste n'émerge que si nous y prenons part.</strong> C’est pourquoi nous revendiquons un monde de la finance qui tienne compte de nos réalités, respecte nos valeurs et contribue, pas à pas, à réduire les inégalités financières entre les femmes et les hommes.</p>",
      "about.what_title": "Ce que fait Portemonnaie",
      "about.what": "<p>Portemonnaie est une <strong>plateforme indépendante</strong> qui te permet de comprendre où va ton argent, ce qu’il finance et comment le faire travailler pour toi : en accord avec tes valeurs, pas à pas, sans personne qui cherche à te vendre quoi que ce soit, sans attitude de finance bro. Nous ne recommandons rien. Nous rendons les choses visibles pour que tu puisses décider.</p><p><strong>Portemonnaie sert d'atelier et de laboratoire d'idées pour comprendre ce dont nous avons besoin aujourd'hui afin de façonner le monde de la finance de demain.</strong></p>",
      "about.era": "<p>L’indépendance financière est la forme la plus élevée de « self-care » – <strong>le plus grand acte d’émancipation</strong>.</p><p>À mesure que nous grandissons, nous souhaitons également que le monde qui nous entoure grandisse : les individus, la communauté, la nature, et que les ressources soient gérées de manière responsable. Nous en sommes convaincus : la croissance doit être mesurée selon quatre dimensions, car <strong>chaque entreprise a besoin de capital financier, de capital écologique, de capital social et de capital relationnel</strong>.</p><p>Pendant longtemps, seul le profit financier comptait comme réussite. Nous voulons investir dans des entreprises qui considèrent le succès de l’environnement et de la société comme le leur.</p>",
      "about.claim": "Money is power.<br>Use yours.",
      "soon.meta_title": "Bientôt – Portemonnaie",
      "soon.text": "<p>Quelque chose se construit ici. Nous bâtissons Portemonnaie pas à pas et prenons le temps de bien faire.</p><p>Reçois un message dès que nous serons en ligne.</p>",
      "archive.meta_title": "Archives – Portemonnaie",
      "archive.title": "Archives",
      "archive.back": "Vers les archives",
      "soon_archive.meta_title": "Archives – Bientôt – Portemonnaie",
      "soon_archive.title": "Le magazine Portemonnaie<br>arrive !",
      "soon.register": "Inscris-toi maintenant",
      "soon_archive.note": "Chaque dimanche à 10 h : les dernières infos sur l'investissement selon ses valeurs et des guides pas à pas malins.",
      "collab.meta_title": "Collaborations – Portemonnaie",
      "collab.title": "Collaborations",
      "collab.intro": "Portemonnaie est en construction. Atelier de réflexion et d'action, nous cherchons des partenariats qui portent Portemonnaie dès le début.",
      "collab.media_title": "Partenariats médias",
      "collab.media_text": "Magazines, newsletters, podcasts et réseaux qui relaient nos contenus et outils en allemand, anglais et français, et conçoivent des campagnes avec nous.",
      "collab.founding_title": "Partenariats fondateurs",
      "collab.founding_text": "Entreprises et fondations qui accompagnent la phase de lancement en tant que sponsors, participent à la construction et deviennent ainsi une partie visible du commencement.",
      "collab.inst_title": "Partenariats institutionnels",
      "collab.inst_text": "Associations, universités et organisations pour des séminaires, des tables rondes et des questions de recherche communes. Concept et réalisation sont assurés par nous.",
      "collab.closing": "Ensemble, nous examinons ce dont nous avons besoin aujourd'hui pour façonner le monde financier de demain et atteindre l'égalité économique.",
      "collab.cta": "Proposer un partenariat",
      "legal.imprint_title": "Mentions légales – Portemonnaie",
      "legal.privacy_title": "Politique de confidentialité – Portemonnaie",
      "confirmed.meta_title": "Confirmé – Portemonnaie",
      "confirmed.title": "Merci, tu en fais partie.",
      "confirmed.text": "<p>Ton adresse e-mail est confirmée. La newsletter Portemonnaie arrive désormais chaque dimanche à 10 h.</p>",
      "confirmed.back": "Retour à l'accueil",
      "footer.imprint": "Mentions légales",
      "footer.privacy": "Politique de confidentialité",
      "footer.copyright": "© Portemonnaie 2026"
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
    const fromQuery = new URLSearchParams(location.search).get("lang");   /* ?lang=fr hat Vorrang (Links aus Newsletter/Socials) */
    if (LANGS.includes(fromQuery)) return fromQuery;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (LANGS.includes(stored)) return stored;
    } catch (e) { /* localStorage gesperrt */ }
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
    document.querySelectorAll("title[data-lang-title-de]").forEach((el) => {
      const v = el.getAttribute("data-lang-title-" + lang) || el.getAttribute("data-lang-title-de");
      if (v) el.textContent = v;
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
