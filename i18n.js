/* =============================================================
   Portemonnaie. Lightweight EN/DE internationalisation.
   No dependencies. Runs at end of <body>.

   Rule: brand slogans / display headlines stay English.
   Explanatory copy and UI controls are translated.

   Markup hooks:
     data-i18n="key"        -> element.textContent
     data-i18n-html="key"   -> element.innerHTML (use for inline markup)
     data-i18n-ph="key"     -> placeholder attribute
     data-i18n-aria="key"   -> aria-label attribute
   ============================================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "pm_lang";

  const I18N = {
    en: {
      /* nav + footer (shared) */
      "nav.intro": "Intro",
      "nav.home": "Home",
      "nav.platform": "Platform",
      "nav.mission": "Our Mission",
      "nav.calculator": "Calculator",
      "nav.signup": "Sign Up",
      "nav.start": "Start investing",
      "nav.menu_aria": "Open menu",
      "footer.imprint": "Imprint",
      "footer.privacy": "Privacy",

      /* hero */
      "hero.eyebrow": "Pre-Launch Early Access",
      "hero.sticky": '<strong>For women</strong><em>who build</em><em>their future.</em>',
      "hero.sub": "Portemonnaie is an investment platform by women for women.<br>We help you with your first investment, so you can invest according to your values, secure your future, and put your money to work for what matters to you.",
      "hero.scroll": "Discover how it works",
      "hero.scroll_aria": "Scroll to learn more",

      /* forms (shared) */
      "form.email_label": "Email address",
      "form.consent": 'I agree to receive updates from Portemonnaie and accept the <a href="/privacy.html" target="_blank" rel="noopener">privacy policy</a>.',
      "form.cta_early": "Get Early Access",
      "form.success_hero": "Check your inbox. Click the confirmation link to finish signing up.",

      /* flow */
      "flow.eyebrow": "The Product",
      "flow.h2": 'Start investing according to your <span class="brush"><em class="serif">values</em></span> in only five steps.',
      "flow.lede": "We guide you in 5 easy steps.",
      "flow.cta": "Join the Access List",
      "step1.title": "Take the quiz",
      "step1.desc": "Answer a few questions about your investing style, your goals, and the causes you care about.",
      "quiz.q1": "What is your risk tolerance?",
      "quiz.q2": "Which causes matter to you?",
      "quiz.q3": "What is your investment horizon?",
      "quiz.q4": "How much can you invest monthly?",
      "step2.title": "Find your archetype",
      "pie.etf": "60% ETFs",
      "pie.stocks": "30% Stocks",
      "pie.bonds": "10% Bonds",
      "step3.title": "Explore",
      "step3.desc": "Browse ETFs, stocks and bonds ranked by a sustainability score and a gender score.",
      "search.ph": "Search ETFs, Stocks...",
      "step4.title": "Fill your basket",
      "step4.desc": "Drag and drop to build your portfolio. Investing will feel like online shopping.",
      "basket.stocks": "Stocks",
      "basket.esg": "ESG",
      "basket.etf": "ETF",
      "basket.bonds": "Green Bonds",
      "basket.drop": "Drop here",
      "step5.title": "Execute",
      "step5.desc": "Open your first depot with a trusted Wealth Manager or the Broker of your choice.",
      "exec.wealth": "Wealth Manager",
      "exec.or": "or",
      "exec.broker": "Broker of Your Choice",

      /* platform */
      "platform.eyebrow": "Phase 2. The ecosystem.",
      "platform.h2": 'All in <span class="brush"><em class="serif">One</em></span> Platform',
      "platform.lede": "Beyond the Robo Advisor, Portemonnaie grows into a full ecosystem where learning about Finances, Investing and Community live in one place.",
      "pill1": "Gender Lens and Sustainability Robo Advisor",
      "pill2": "Financial Literacy Academy",
      "pill3": "Community Forum",
      "pill4": "Investment Barometer",
      "pill5": "Shop",

      /* signup (shared) */
      "signup.eyebrow": "Pre register",
      "signup.h2": 'Register <em class="serif">Now</em>',
      "signup.lede": 'Get notified when we <span class="pencil">go live</span>.',
      "signup.cta": "Reserve my place",
      "signup.micro": "Private beta. Your email is only used for Portemonnaie updates. Unsubscribe anytime.",
      "success.almost_title": "Almost there.",
      "success.almost_body": "We just sent you a confirmation email. Click the link inside to finalize your spot on the early access list.",
      "success.welcome_title": "Welcome to Portemonnaie.",
      "success.welcome_body": "You are officially on the early access list. We will be in touch soon with your first product letter.",

      /* calculator page */
      "calc.eyebrow": "The cost of waiting",
      "calc.h1": 'See what your money could <span class="brush"><em class="serif">grow</em></span> into.',
      "calc.sub": "Investing does not have to be complicated or expensive. Move the sliders to see how a small amount each month could build your future — and help close the gender pension gap.",
      "calc.monthly": "Monthly investment",
      "calc.age_now": "Your age today",
      "calc.age_retire": "Retirement age",
      "calc.style": "Investing style",
      "calc.style.cautious": "Cautious",
      "calc.style.balanced": "Balanced",
      "calc.style.ambitious": "Ambitious",
      "calc.style.hint": "Assumed average annual return. Real returns vary year to year.",
      "calc.result.label": "Projected value at age",
      "calc.invested": "You invest",
      "calc.growth": "Growth earned",
      "calc.income.label": "Roughly equal to a monthly top-up of",
      "calc.cta": "Start my plan",
      "calc.disclaimer": "This is a simplified projection for educational purposes only. It assumes a constant average return and does not account for fees, taxes or inflation. This is not investment advice.",
      "cta.eyebrow": "Your future, your terms",
      "cta.h2": 'Ready to start <em class="serif">investing</em>?',
      "cta.lede": "Build a values-matched portfolio in minutes — guided every step of the way.",

      /* mission */
      "problem.eyebrow": "Why we exist",
      "problem.c1.title": "EU gender pension gap",
      "problem.c1.desc": "Women aged 65 and older receive one quarter less in retirement income than men.",
      "problem.c2.title": "Less invested monthly",
      "problem.c2.desc": "European women invest 29% less of their monthly income than men on average.",
      "problem.c3.title": "Lifetime wealth deficit",
      "problem.c3.desc": "Women accumulate an estimated €100,000 less in wealth over their lifetime.",
      "problem.h2": 'At Portemonnaie, it is our mission to <em class="serif underline-marigold">fight</em>:',
      "mission.quote": '<span class="mission__word">Portemonnaie </span> <span class="mission__word">exists </span> <span class="mission__word">to </span> <span class="mission__word">close </span> <span class="mission__word">the </span> <span class="mission__word">gender </span> <span class="mission__word">wealth </span> <span class="mission__word">gap. </span> <span class="mission__word">Because </span> <span class="mission__word">every </span> <span class="mission__word">investment </span> <span class="mission__word">is </span> <span class="mission__word">a </span> <span class="mission__word">vote. </span> <span class="mission__word">We </span> <span class="mission__word">build </span> <span class="mission__word">a </span> <span class="mission__word">platform </span> <span class="mission__word">that </span> <span class="mission__word">lets </span> <span class="mission__word">you </span> <span class="mission__word">align </span> <span class="mission__word">your </span> <span class="mission__word">values, </span> <span class="mission__word">makes </span> <span class="mission__word">investment </span> <span class="mission__word">easy, </span> <span class="mission__word">and </span> <span class="mission__word">is </span> <span class="mission__word">designed </span> <span class="mission__word">from </span> <span class="mission__word">the </span> <span class="mission__word">ground </span> <span class="mission__word">up </span> <span class="mission__word">so </span> <span class="mission__word">everyone </span> <span class="mission__word">can </span> <span class="mission__word">make </span> <span class="mission__word">their </span> <span class="mission__word">money </span> <span class="mission__word">speak </span> <span class="mission__word">and </span> <span class="mission__word">secure </span> <span class="mission__word">their </span> <span class="mission__word">future.</span>',
      "capitals.eyebrow": "A new definition of growth",
      "capitals.body": 'At Portemonnaie, we believe that growth must be measured across four dimensions. Every company relies on <span class="capital-word" data-color="gold">financial capital</span>, <span class="capital-word" data-color="green">environmental capital</span>, <span class="capital-word" data-color="rose">social capital</span>, and <span class="capital-word" data-color="lavender">network capital</span>. For decades, only the growth of financial capital has counted as success. We believe that must change.',

      /* collabs */
      "collabs.eyebrow": "Get involved",
      "tab.news_btn": "We are building in the open",
      "tab.partner_btn": "Partner with Portemonnaie",
      "news.h3": "We are building in the open.",
      "news.p": "Follow our journey from prototype to launch. Early supporters receive monthly product letters and invitations to private demos.",
      "partner.h3": "Partner with Portemonnaie.",
      "partner.p": "We collaborate with wealth managers, sustainability researchers, creators, and community builders who share our values.",
      "partner.cta": "Reach out",

      /* confirmed */
      "confirmed.eyebrow": "You are in",
      "confirmed.body": "Your email is confirmed. We will be in touch with your first product letter as we get closer to launch.",
      "confirmed.back": "Back to home",

      /* privacy */
      "privacy.back": "← Back",
      "privacy.title": 'Privacy <em class="serif">Policy</em>',
      "privacy.info.h": "Information obligation statement",
      "privacy.info.p1": "In the following privacy policy, we inform you about the most important aspects of data processing within our website. We collect and process personal data only on the basis of the statutory provisions (General Data Protection Regulation, Telecommunications Act 2003).",
      "privacy.info.p2": "As soon as you access or visit our website as a user, your IP address as well as the beginning and end of the session are recorded. This is technically necessary and therefore constitutes a legitimate interest within the meaning of Art. 6(1)(f) GDPR.",
      "privacy.contact.h": "Contacting us",
      "privacy.contact.p": "If you contact us either via the contact form on our website or by email, the data you provide will be stored by us for six months for the purpose of processing your request or in case of follow-up questions. We do not share your data without your consent.",
      "privacy.logs.h": "Server log files",
      "privacy.logs.p1": 'This website and the associated provider automatically collect information in the course of website use in the form of so-called "server log files". This concerns in particular:',
      "privacy.logs.li1": "IP address or hostname",
      "privacy.logs.li2": "Browser used",
      "privacy.logs.li3": "Time spent on the website, as well as date and time",
      "privacy.logs.li4": "Pages of the website accessed",
      "privacy.logs.li5": "Language settings and operating system",
      "privacy.logs.li6": '"Leaving page" (the URL from which the user left the website)',
      "privacy.logs.li7": "ISP (Internet Service Provider)",
      "privacy.logs.p2": "This collected information is not processed in a personally identifiable manner or linked to personal data.",
      "privacy.logs.p3": "The website operator reserves the right to evaluate or review this data in the event that unlawful activity becomes known.",
      "privacy.news.h": "Newsletter",
      "privacy.news.p": "You have the option of subscribing to our newsletter via our website. For this we need your email address and your declaration that you agree to receive the newsletter.",
      "privacy.rights.h": "Your rights as a data subject",
      "privacy.rights.p1": "In principle, you have the following rights with regard to the data we store about you:",
      "privacy.rights.li1": "Information",
      "privacy.rights.li2": "Deletion of the data",
      "privacy.rights.li3": "Rectification of the data",
      "privacy.rights.li4": "Portability of the data",
      "privacy.rights.li5": "Revocation and objection to data processing",
      "privacy.rights.li6": "Restriction of processing",
      "privacy.rights.p2": "If you suspect that violations of data protection law have occurred during the processing of your data, you can lodge a complaint with us (office@portemonnaie.finance) or with the data protection authority.",
      "privacy.contact2.h": "Contact",
      "privacy.contact2.body": 'Website operator: Portemonnaie<br>Email: <a href="mailto:office@portemonnaie.finance">office@portemonnaie.finance</a>',

      /* impressum (German is the canonical legal version) */
      "imp.back": "← Back",
      "imp.subtitle": "Disclosure under §5 ECG and §25 MedienG",
      "imp.h_provider": "Service provider",
      "imp.h_contact": "Contact",
      "imp.h_jurisdiction": "Place of jurisdiction",
      "imp.jurisdiction_p": "The place of jurisdiction for all legal disputes is the competent court in Vienna.",
      "imp.h_liability": "Disclaimer",
      "imp.liability_p": "The contents of our website were created with the greatest care. However, we cannot guarantee the accuracy, completeness or timeliness of the content. As a service provider, we are responsible for our own content on this website in accordance with general law.",
      "imp.h_links": "Liability for links",
      "imp.links_p": "Our offering contains links to external third-party websites whose content we have no influence over. We therefore cannot accept any liability for this external content. The respective provider or operator of the linked pages is always responsible for their content.",
      "imp.h_copyright": "Copyright",
      "imp.copyright_p": "The content and works created by the site operators on these pages are subject to Austrian copyright law. Reproduction, editing, distribution and any kind of use outside the limits of copyright require the written consent of the respective author or creator."
    },

    de: {
      /* nav + footer (shared) */
      "nav.intro": "Intro",
      "nav.home": "Start",
      "nav.platform": "Plattform",
      "nav.mission": "Unsere Mission",
      "nav.calculator": "Rechner",
      "nav.signup": "Anmelden",
      "nav.start": "Jetzt investieren",
      "nav.menu_aria": "Menü öffnen",
      "footer.imprint": "Impressum",
      "footer.privacy": "Datenschutz",

      /* hero */
      "hero.eyebrow": "Pre-Launch Early Access",
      "hero.sticky": '<strong>Für Frauen,</strong><em>die ihre Zukunft</em><em>gestalten.</em>',
      "hero.sub": "Portemonnaie ist eine Investment-Plattform von Frauen für Frauen.<br>Wir helfen dir bei deinem ersten Investment, damit du nach deinen Werten investieren, deine Zukunft sichern und dein Geld für das einsetzen kannst, was dir wichtig ist.",
      "hero.scroll": "So funktioniert's",
      "hero.scroll_aria": "Scrollen für mehr",

      /* forms (shared) */
      "form.email_label": "E-Mail-Adresse",
      "form.consent": 'Ich möchte Updates von Portemonnaie erhalten und akzeptiere die <a href="/privacy.html" target="_blank" rel="noopener">Datenschutzerklärung</a>.',
      "form.cta_early": "Get Early Access",
      "form.success_hero": "Sieh in deinem Postfach nach. Klick auf den Bestätigungslink, um die Anmeldung abzuschließen.",

      /* flow */
      "flow.eyebrow": "Das Produkt",
      "flow.h2": 'Investiere nach deinen <span class="brush"><em class="serif">Werten</em></span><br>– in nur fünf Schritten.',
      "flow.lede": "Wir begleiten dich in 5 einfachen Schritten.",
      "flow.cta": "Get Early Access",
      "step1.title": "Mach das Quiz",
      "step1.desc": "Beantworte ein paar Fragen zu deinem Anlagestil, deinen Zielen und den Themen, die dir am Herzen liegen.",
      "quiz.q1": "Wie hoch ist deine Risikobereitschaft?",
      "quiz.q2": "Welche Themen sind dir wichtig?",
      "quiz.q3": "Wie lang ist dein Anlagehorizont?",
      "quiz.q4": "Wie viel kannst du monatlich investieren?",
      "step2.title": "Finde deinen Archetyp",
      "pie.etf": "60 % ETFs",
      "pie.stocks": "30 % Aktien",
      "pie.bonds": "10 % Anleihen",
      "step3.title": "Entdecken",
      "step3.desc": "Durchstöbere ETFs, Aktien und Anleihen, sortiert nach Nachhaltigkeits- und Gender-Score.",
      "search.ph": "ETFs, Aktien suchen …",
      "step4.title": "Füll deinen Warenkorb",
      "step4.desc": "Per Drag-and-drop baust du dein Portfolio. Investieren fühlt sich an wie Online-Shopping.",
      "basket.stocks": "Aktien",
      "basket.esg": "ESG",
      "basket.etf": "ETF",
      "basket.bonds": "Grüne Anleihen",
      "basket.drop": "Hier ablegen",
      "step5.title": "Umsetzen",
      "step5.desc": "Eröffne dein erstes Depot bei einem vertrauenswürdigen Vermögensverwalter oder dem Broker deiner Wahl.",
      "exec.wealth": "Vermögensverwalter",
      "exec.or": "oder",
      "exec.broker": "Broker deiner Wahl",

      /* platform */
      "platform.eyebrow": "Phase 2. Das Ökosystem.",
      "platform.h2": 'Alles auf <span class="brush"><em class="serif">einer</em></span> Plattform',
      "platform.lede": "Über den Robo-Advisor hinaus wächst Portemonnaie zu einem ganzen Ökosystem, in dem Finanzwissen, Investieren und Community an einem Ort zusammenkommen.",
      "pill1": "Robo-Advisor mit Gender- und Nachhaltigkeitsfokus",
      "pill2": "Academy für Finanzwissen",
      "pill3": "Community-Forum",
      "pill4": "Investment-Barometer",
      "pill5": "Shop",

      /* signup (shared) */
      "signup.eyebrow": "Vorab registrieren",
      "signup.h2": 'Registrier dich <em class="serif">jetzt</em>',
      "signup.lede": 'Erhalte eine Nachricht, sobald wir <span class="pencil">live gehen</span>.',
      "signup.cta": "Get Early Access",
      "signup.micro": "Private Beta. Deine E-Mail wird nur für Portemonnaie-Updates verwendet. Du kannst dich jederzeit abmelden.",
      "success.almost_title": "Fast geschafft.",
      "success.almost_body": "Wir haben dir gerade eine Bestätigungs-E-Mail geschickt. Klick auf den Link darin, um deinen Platz auf der Early-Access-Liste zu sichern.",
      "success.welcome_title": "Willkommen bei Portemonnaie.",
      "success.welcome_body": "Du stehst offiziell auf der Early-Access-Liste. Wir melden uns bald mit deinem ersten Produkt-Newsletter.",

      /* calculator page */
      "calc.eyebrow": "Was Warten kostet",
      "calc.h1": 'Sieh, woraus dein Geld <span class="brush"><em class="serif">wachsen</em></span> kann.',
      "calc.sub": "Investieren muss weder kompliziert noch teuer sein. Bewege die Regler und sieh, wie ein kleiner Betrag im Monat deine Zukunft aufbauen kann – und hilft, die Gender-Pension-Gap zu schließen.",
      "calc.monthly": "Monatliche Investition",
      "calc.age_now": "Dein Alter heute",
      "calc.age_retire": "Renteneintrittsalter",
      "calc.style": "Anlagestil",
      "calc.style.cautious": "Vorsichtig",
      "calc.style.balanced": "Ausgewogen",
      "calc.style.ambitious": "Ambitioniert",
      "calc.style.hint": "Angenommene durchschnittliche Jahresrendite. Tatsächliche Renditen schwanken von Jahr zu Jahr.",
      "calc.result.label": "Voraussichtlicher Wert mit Alter",
      "calc.invested": "Du investierst",
      "calc.growth": "Erwirtschaftetes Wachstum",
      "calc.income.label": "Entspricht etwa einer monatlichen Zusatzrente von",
      "calc.cta": "Meinen Plan starten",
      "calc.disclaimer": "Dies ist eine vereinfachte Hochrechnung zu Bildungszwecken. Sie geht von einer konstanten Durchschnittsrendite aus und berücksichtigt weder Gebühren noch Steuern oder Inflation. Dies ist keine Anlageberatung.",
      "cta.eyebrow": "Deine Zukunft, deine Regeln",
      "cta.h2": 'Bereit, mit dem <em class="serif">Investieren</em> zu beginnen?',
      "cta.lede": "Bau dir in wenigen Minuten ein werteorientiertes Portfolio – Schritt für Schritt begleitet.",

      /* mission */
      "problem.eyebrow": "Warum es uns gibt",
      "problem.c1.title": "Gender-Pension-Gap in der EU",
      "problem.c1.desc": "Frauen ab 65 erhalten ein Viertel weniger Alterseinkommen als Männer.",
      "problem.c2.title": "Weniger investiert pro Monat",
      "problem.c2.desc": "Europäische Frauen investieren im Schnitt 29 % weniger ihres Monatseinkommens als Männer.",
      "problem.c3.title": "Vermögenslücke im Lebensverlauf",
      "problem.c3.desc": "Frauen bauen über ihr Leben schätzungsweise 100.000 € weniger Vermögen auf.",
      "problem.h2": 'Bei Portemonnaie <em class="serif underline-marigold">kämpfen</em> wir gegen:',
      "mission.quote": '<span class="mission__word">Das </span> <span class="mission__word">Finanzsystem </span> <span class="mission__word">wurde </span> <span class="mission__word">nicht </span> <span class="mission__word">für </span> <span class="mission__word">Frauen </span> <span class="mission__word">geschaffen. </span> <span class="mission__word">Wir </span> <span class="mission__word">entwickeln </span> <span class="mission__word">eine </span> <span class="mission__word">Plattform, </span> <span class="mission__word">die </span> <span class="mission__word">selbstbewusstes </span> <span class="mission__word">Investieren </span> <span class="mission__word">ermöglicht, </span> <span class="mission__word">finanzielle </span> <span class="mission__word">Entscheidungen </span> <span class="mission__word">mit </span> <span class="mission__word">persönlichen </span> <span class="mission__word">Werten </span> <span class="mission__word">verbindet </span> <span class="mission__word">und </span> <span class="mission__word">die </span> <span class="mission__word">Gender </span> <span class="mission__word">Wealth </span> <span class="mission__word">Gap </span> <span class="mission__word">schließt. </span> <span class="mission__word">Denn </span> <span class="mission__word">eine </span> <span class="mission__word">gerechtere </span> <span class="mission__word">Gesellschaft </span> <span class="mission__word">beginnt </span> <span class="mission__word">mit </span> <span class="mission__word">einem </span> <span class="mission__word">gerechteren </span> <span class="mission__word">Zugang </span> <span class="mission__word">zu </span> <span class="mission__word">Kapital.</span>',
      "capitals.eyebrow": "Eine neue Definition von Wachstum",
      "capitals.body": 'Bei Portemonnaie glauben wir, dass Wachstum über vier Dimensionen gemessen werden muss. Jedes Unternehmen bedarf <span class="capital-word" data-color="gold">finanzielles Kapital</span>, <span class="capital-word" data-color="green">ökologisches Kapital</span>, <span class="capital-word" data-color="rose">soziales Kapital</span> und <span class="capital-word" data-color="lavender">Netzwerkkapital</span>. Jahrzehntelang galt nur das Wachstum des finanziellen Kapitals als Erfolg. Wir glauben, das muss sich ändern.',

      /* collabs */
      "collabs.eyebrow": "Mach mit",
      "tab.news_btn": "Wir bauen transparent",
      "tab.partner_btn": "Werde Partner von Portemonnaie",
      "news.h3": "Wir bauen transparent.",
      "news.p": "Begleite unseren Weg vom Prototyp bis zum Launch. Frühe Unterstützerinnen erhalten monatliche Produkt-Newsletter und Einladungen zu privaten Demos.",
      "partner.h3": "Werde Partner von Portemonnaie.",
      "partner.p": "Wir arbeiten mit Vermögensverwaltern, Nachhaltigkeitsforscherinnen, Creators und Community-Builderinnen zusammen, die unsere Werte teilen.",
      "partner.cta": "Kontakt aufnehmen",

      /* confirmed */
      "confirmed.eyebrow": "Du bist dabei",
      "confirmed.body": "Deine E-Mail ist bestätigt. Wir melden uns mit deinem ersten Produkt-Newsletter, sobald der Launch näher rückt.",
      "confirmed.back": "Zurück zur Startseite",

      /* privacy */
      "privacy.back": "← Zurück",
      "privacy.title": 'Datenschutz<em class="serif">erklärung</em>',
      "privacy.info.h": "Erklärung zur Informationspflicht",
      "privacy.info.p1": "In folgender Datenschutzerklärung informieren wir Sie über die wichtigsten Aspekte der Datenverarbeitung im Rahmen unserer Webseite. Wir erheben und verarbeiten personenbezogene Daten nur auf Grundlage der gesetzlichen Bestimmungen (Datenschutzgrundverordnung, Telekommunikationsgesetz 2003).",
      "privacy.info.p2": "Sobald Sie als Benutzer auf unsere Webseite zugreifen oder diese besuchen, wird Ihre IP-Adresse sowie Beginn und Ende der Sitzung erfasst. Dies ist technisch bedingt und stellt somit ein berechtigtes Interesse iSv Art. 6 Abs. 1 lit. f DSGVO dar.",
      "privacy.contact.h": "Kontakt mit uns",
      "privacy.contact.p": "Wenn Sie uns entweder über unser Kontaktformular auf unserer Webseite oder per E-Mail kontaktieren, werden die von Ihnen übermittelten Daten zwecks Bearbeitung Ihrer Anfrage oder für den Fall von Anschlussfragen für sechs Monate bei uns gespeichert. Es erfolgt ohne Ihre Einwilligung keine Weitergabe Ihrer Daten.",
      "privacy.logs.h": "Server-Log Files",
      "privacy.logs.p1": "Diese Webseite und der damit verbundene Provider erhebt im Zuge der Webseitennutzung automatisch Informationen im Rahmen sogenannter „Server-Log Files“. Dies betrifft insbesondere:",
      "privacy.logs.li1": "IP-Adresse oder Hostname",
      "privacy.logs.li2": "verwendeter Browser",
      "privacy.logs.li3": "Aufenthaltsdauer auf der Webseite sowie Datum und Uhrzeit",
      "privacy.logs.li4": "aufgerufene Seiten der Webseite",
      "privacy.logs.li5": "Spracheinstellungen und Betriebssystem",
      "privacy.logs.li6": "„Leaving-Page“ (auf welcher URL der Benutzer die Webseite verlassen hat)",
      "privacy.logs.li7": "ISP (Internet Service Provider)",
      "privacy.logs.p2": "Diese erhobenen Informationen werden nicht personenbezogen verarbeitet oder mit personenbezogenen Daten in Verbindung gebracht.",
      "privacy.logs.p3": "Der Webseitenbetreiber behält sich vor, im Falle von Bekanntwerden rechtswidriger Tätigkeiten, diese Daten auszuwerten oder zu überprüfen.",
      "privacy.news.h": "Newsletter",
      "privacy.news.p": "Sie haben die Möglichkeit, über unsere Website unseren Newsletter zu abonnieren. Hierfür benötigen wir Ihre E-Mail-Adresse und Ihre Erklärung, dass Sie mit dem Bezug des Newsletters einverstanden sind.",
      "privacy.rights.h": "Ihre Rechte als Betroffener",
      "privacy.rights.p1": "Sie haben bezüglich Ihrer bei uns gespeicherten Daten grundsätzlich folgende Rechte:",
      "privacy.rights.li1": "Auskunft",
      "privacy.rights.li2": "Löschung der Daten",
      "privacy.rights.li3": "Berichtigung der Daten",
      "privacy.rights.li4": "Übertragbarkeit der Daten",
      "privacy.rights.li5": "Widerruf und Widerspruch gegen die Datenverarbeitung",
      "privacy.rights.li6": "Einschränkung der Verarbeitung",
      "privacy.rights.p2": "Wenn Sie vermuten, dass im Zuge der Verarbeitung Ihrer Daten Verstöße gegen das Datenschutzrecht passiert sind, können Sie sich bei uns (office@portemonnaie.finance) oder der Datenschutzbehörde beschweren.",
      "privacy.contact2.h": "Kontakt",
      "privacy.contact2.body": 'Webseitenbetreiber: Portemonnaie<br>E-Mail: <a href="mailto:office@portemonnaie.finance">office@portemonnaie.finance</a>',

      /* impressum (canonical German) */
      "imp.back": "← Zurück",
      "imp.subtitle": "Offenlegung nach §5 ECG und §25 MedienG",
      "imp.h_provider": "Diensteanbieterin",
      "imp.h_contact": "Kontakt",
      "imp.h_jurisdiction": "Gerichtsstand",
      "imp.jurisdiction_p": "Gerichtsstand für alle Rechtsstreitigkeiten ist das sachlich zuständige Gericht in Wien.",
      "imp.h_liability": "Haftungsausschluss",
      "imp.liability_p": "Die Inhalte unserer Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir für eigene Inhalte auf dieser Website nach den allgemeinen Gesetzen verantwortlich.",
      "imp.h_links": "Haftung für Links",
      "imp.links_p": "Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.",
      "imp.h_copyright": "Urheberrecht",
      "imp.copyright_p": "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem österreichischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors beziehungsweise Erstellers."
    }
  };

  function detectLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "de") return saved;
    const nav = (navigator.language || navigator.userLanguage || "en").toLowerCase();
    return nav.indexOf("de") === 0 ? "de" : "en";
  }

  function apply(lang) {
    const dict = I18N[lang] || I18N.en;
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const v = dict[el.getAttribute("data-i18n")];
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const v = dict[el.getAttribute("data-i18n-html")];
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      const v = dict[el.getAttribute("data-i18n-ph")];
      if (v != null) el.setAttribute("placeholder", v);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const v = dict[el.getAttribute("data-i18n-aria")];
      if (v != null) el.setAttribute("aria-label", v);
    });

    document.querySelectorAll(".nav__lang button[data-lang]").forEach((b) => {
      const active = b.getAttribute("data-lang") === lang;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", String(active));
    });
  }

  function setLang(lang) {
    if (lang !== "en" && lang !== "de") return;
    localStorage.setItem(STORAGE_KEY, lang);
    apply(lang);
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest && e.target.closest(".nav__lang button[data-lang]");
    if (!btn) return;
    setLang(btn.getAttribute("data-lang"));
  });

  apply(detectLang());

  window.PMI18n = { setLang: setLang, apply: apply };
})();
