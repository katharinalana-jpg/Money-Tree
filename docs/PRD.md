# Product Requirements: Quiz, Zusammenfassung, Explorer, Checkout, Weg wählen

Source: Quizz_Product Requirements_09092026.docx (converted 1:1, content unchanged; JSON and CSS blocks reformatted as code).

*Quiz · Zusammenfassung · Explorer · Checkout · Weg wählen — in unter 15 Minuten zum ersten wertebasierten Portfolio.*

Lesehinweis: Jeder Screen ist nach demselben Muster beschrieben (Zweck → Lernmoment → Layout → Copy → Interaktion & Logik → Akzeptanzkriterien). Copy-Blöcke sind final formuliert und können als i18n-Strings übernommen werden. Alles in \[eckigen Klammern\] ist bewusst offen und in Abschnitt 11 gelistet.

# 1. Zielbild & Erfolgskriterien

## 1.1 Zielbild

Eine Frau ohne Vorwissen kommt in unter 15 Minuten von der ersten Frage zu einem selbst gebauten, wertebasierten Portfolio – und verlässt die Plattform mit einer konkreten To-do für Broker oder Beratung. Jeder Schritt hat einen Lernmoment. Kein Finanzbegriff erscheint, bevor er erklärt ist. Am Ende steht Zuversicht: „Ich weiß, was ich will, und ich weiß, wie ich es umsetze.“

## 1.2 Erfolgskriterien (Phase 1)

- Completion Rate Quiz → Zusammenfassung: ≥ 70 % der gestarteten Sessions.

- Completion Rate Zusammenfassung → Checkout (Portfolio fertig): ≥ 40 %.

- Median Time-to-Portfolio: ≤ 15 Minuten (Start Quiz bis Checkout-Download).

- Depot-Conversion (Klick auf Broker- oder Wealth-Link): ≥ 6 % (Planwert Businessplan 5.1).

- Glossar-Nutzung: ≥ 60 % der Sessions öffnen mindestens einen Glossar-Eintrag – Indikator, dass „Lernen im Flow“ funktioniert.

- Qualitativ (MVP-Test Sept. 2026, 30 Frauen): Aussage „Ich fühle mich sicher genug für den nächsten Schritt“ im Schnitt ≥ 4 von 5.

# 2. Zielgruppe, Designprinzipien & rechtliche Leitplanken

## 2.1 Zielgruppe

Primär: Frauen 20–45, digital affin, hohes Wertebewusstsein, niedrige Komplexitätstoleranz. Sekundär: Frauen in Lebensphasen mit hohem Vorsorgebedarf (Berufseinstieg, Mutterschaft, Teilzeit, Trennung, Pflege, Pensionsvorbereitung). Typische Ausgangslage: „Jeder ETF-Vergleich endet in zwanzig offenen Tabs.“ Kein Vorwissen wird vorausgesetzt.

Zentrale emotionale Anforderung: Die Userin soll sich in jedem Schritt kompetent fühlen. Das Produkt gibt ihr Wissen genau dann, wenn sie es braucht, und lässt sie jede Entscheidung selbst treffen.

## 2.2 UX-Prinzipien (verbindlich für alle Screens)

- Eine Aktion pro Screen. Jeder Screen hat genau einen primären CTA. Sekundäre Aktionen (Zurück, Überspringen) sind visuell leiser.

- Lernen vor Entscheiden. Jeder Screen beginnt mit einer sehr kurzen Erklärung (max. 2 Sätze), dann folgt die Interaktion. Erst verstehen, dann wählen.

- Kein Begriff ohne Erklärung. Jeder Finanzbegriff ist beim ersten Auftreten ein Glossar-Term (Abschnitt 5.2). Gilt für alle Screens, nicht nur den Explorer.

- Fortschritt sichtbar. Globale Fortschrittsleiste mit fünf Etappen und Restzeit-Hinweis („noch ca. 8 Minuten“).

- Ruhig und klar. Viel Freiraum auf Background \#FAF8F3 (nie reines Weiß), großzügige Klickflächen (min. 44 × 44 px), handgemalte botanische Illustrationen, keine Countdowns, keine Scarcity, kein Rosa, keine Gradienten, keine Schatten (Tokens in 5.6).

- Kontrolle bleibt bei ihr. Jede Auswahl ist jederzeit änderbar; Zurück-Navigation verliert keine Eingaben.

- Desktop first, responsiv bis 375 px. Drag & Drop hat auf Touch immer eine Button-Alternative (+ / –).

## 2.3 Copy-Regeln (Brand Voice, UI-Texte)

- Ansprache „du“, Singular. Warm, direkt, wie eine informierte Freundin – nie wie eine Bank, ein Startup oder eine Kampagne.

- Kurze, aktive Sätze (max. 15 Wörter). Konkrete Zahlen statt Abstraktion. Wert zuerst, Feature danach.

- Problem im System verorten, nie in der Frau. Verboten: „noch nicht“, „endlich“, „du musst/solltest“, „du hast verpasst“, „fehlt“. Aufbaurhetorik statt Defizit.

- Kein Fintech-Jargon in der Oberfläche (kein seamless, frictionless, intuitive, Robo-Advisor). Keine Renditeversprechen, keine Garantien, keine Superlative.

- Leitphrasen: „Von Frauen. Für Frauen.“ · „Invest in what you believe in.“ Produkttexte Deutsch, Taglines Englisch. CTA Phrasen: CTA: - „Activate your wealth for positive change.“ – „Put your capital behind the innovative companies that you want to see in the world, alongside a community of women who show up for each other.“- „If we want new innovations and companies in the world that specifically address our needs, the only way to do this is for us to get active, to become the investors.“

- Alle UI-Strings liegen als i18n-Keys vor (de als Quelle, en vorbereitet). Keine hart codierten Texte in Komponenten.

## 2.4 Rechtliche Leitplanken (MiFID II / WAG 2018) – für Copy UND Logik

Portemonnaie erbringt keine konzessionspflichtige Wertpapierdienstleistung. Folgende Regeln sind harte Anforderungen:

- Keine Zuordnung von Nutzereingaben zu Produkten oder Gewichtungen. Antworten aus dem Quiz (Lebensphase, Betrag, Horizont, Werte) werden gespiegelt und erklärt, aber nie in einen Portfoliovorschlag „für dich“ übersetzt.

- Musterportfolios sind Bildungsbeispiele. Sie tragen immer das Label „Beispiel, keine Empfehlung“ und erscheinen unabhängig von den Antworten der Userin (alle drei Beispiele werden immer gezeigt).

- Der Explorer ist ein Katalog mit Filtern, die die Userin selbst setzt. Sortierungen sind neutral (alphabetisch, Kosten, Score des Datenanbieters) und nie „passend für dich“. SDG-Auswahl wirkt als von ihr gesetzter Filter, der jederzeit sichtbar und abwählbar ist.

- Kein Wort aus der Familie „empfehlen“, „raten“, „solltest“, „passt zu dir“, „optimal“, „ideal für dich“ in Bezug auf Produkte oder Gewichtungen. Erlaubt: „so kann ein Portfolio aussehen“, „viele Anlegerinnen“, „typischerweise“.

- Beschreibende Rückmeldung zum eigenen Portfolio ist zulässig („Dein Mix liegt im Spektrum eher bei ruhig“), bewertende nicht („zu riskant“, „gut gewählt“).

- Disclaimer auf jedem Screen ab S5 im Footer sichtbar, auf S9–S11 zusätzlich als Info-Box: „Die Informationen stellen keine Anlageberatung, keine sonstige Empfehlung und kein Angebot zum Kauf von Wertpapieren oder zur Vornahme bestimmter Investitionen dar.“

- Keine Orderweiterleitung: Der Übergang zu Broker/Wealth Manager ist ein getrackter externer Link. Produkt- und Gewichtungsdaten werden nicht an Partner übertragen (nur als PDF an die Userin).

- Externer Legal-Review vor Launch (Meilenstein 15.11.2026). Alle Copy-Blöcke in diesem Dokument sind Vorschläge und stehen unter diesem Vorbehalt.

# 3. Scope MVP

## 3.1 In Scope

- Alle Screens S0–S10 (Abschnitt 6) inkl. Hover-Glossar, Fortschrittsleiste, Session-State im Browser.

- Kuratierte Produktliste: 30–60 Produkte (ETFs, Aktien, Green Bonds) als JSON, inkl. Sustainability-Score, Gender-Score, SDG-Tags, KID-Kennzahlen.

- Checkout-Output: PDF „Mein Portfolio-Plan“ (Download) und Versand per E-Mail mit DSGVO-Opt-in für den Newsletter.

- Broker-Vergleich (3 Partner) und Beratungsoptionen (1 Partner pro Land) mit getrackten Affiliate-Links.

- Analytics-Events (Abschnitt 9), i18n-Struktur de/en, Desktop-first responsives Layout.

## 3.2 Out of Scope (Phase 1)

- Login, Nutzerkonto, Paywall/Payment. Der gesamte Flow ist anonym; State lebt in LocalStorage.

- Live-Kursdaten, Live-ESG-API, Portfolio-Tracker, Community, Academy, Shop (Phase 2).

- Automatisierte Depoteröffnung oder Orderübertragung an Broker.

- Native Apps. Englische Übersetzung der Inhalte (Struktur ja, Texte später).

# 4. Journey-Übersicht & Zeitbudget

Fünf Etappen in der Fortschrittsleiste (Quiz · Zusammenfassung · Explorer · Portfolio · Weg wählen), zwölf Screens. Zeitbudget insgesamt ≤ 15 Minuten. Die Spalte „Lernmoment“ ist verbindlich: kein Screen ohne Lerninhalt.

|                           | Route           | Ziel der Userin                                 | Lernmoment                                                                  | Zeit |
|---------------------------|-----------------|-------------------------------------------------|-----------------------------------------------------------------------------|------|
| S0 Start                  | /               | Verstehen, was passiert, und starten            | Was Guidance heißt; 15 Minuten, kein Vorwissen, keine Beratung, kein Jargon | 0:30 |
| S2 Lifetime Traps         | /quiz/traps     | Acht Lebensphasen kennenlernen                  | Flashcards: wo und warum Vermögen verloren geht (mit Quellen)               | 2:00 |
| S3 Deine Phase            | /quiz/phase     | Eigene Lebensphase wählen                       | Einordnung: du bist nicht allein, das System ist der Hebel                  | 0:30 |
| S4 Deine Situation        | /quiz/situation | Betrag & Horizont angeben                       | Sparplan, Anlagehorizont, warum Zeit Schwankungen glättet                   | 1:00 |
| S5 Portfolio-Bausteine    | /quiz/portfolio | Verstehen, wie Portfolios aufgebaut sein können | ETF, Aktie, Anleihe, Streuung, Risiko-Spektrum (Beispiele)                  | 1:30 |
| S6 Dein Geld bewegt etwas | /quiz/impact    | Übergang zu wertebasiertem Investieren          | Divesting vs. wertebasiertes Investieren, Kapital hat Richtung              | 1:00 |
| S7 Deine Werte            | /quiz/values    | SDGs auswählen                                  | Was die 17 SDGs sind und wie sie zu Produkten führen                        | 1:00 |
| S8 Zusammenfassung        | /summary        | Klarheit + Motivation, in den Explorer zu gehen | Spiegel der eigenen Antworten, Vorschau Explorer, Glossar-Einführung        | 1:00 |
| S9 Explorer               | /explore        | Portfolio selbst bauen                          | Scores, KID-Kennzahlen, jeder Begriff per Hover                             | 4:30 |
| S10 Dein Portfolio        | /portfolio      | Prüfen, Plan sichern (PDF/E-Mail)               | Ziele-Karte, Sparplan-Aufteilung, To-do-Logik                               | 1:00 |
| S11 Weg wählen            | /execute        | Broker oder Beratung wählen und weitergehen     | Was ein Depot ist, worauf beim Broker zu achten ist                         | 0:30 |

# 5. Globale Komponenten

## 5.1 Fortschrittsleiste (ProgressBar)

- Fünf Etappen mit Label; aktive Etappe hervorgehoben; innerhalb einer Etappe Sub-Fortschritt als Füllbalken (z. B. Quiz: 6 Sub-Schritte).

- Klick auf eine bereits erreichte Etappe navigiert zurück; nicht erreichte Etappen sind nicht klickbar.

- Akzeptanz: Leiste ist auf allen Screens S2–S11 sichtbar, aktualisiert sich ohne Reload, ist per Tastatur erreichbar.

## 5.2 Hover-Glossar (GlossaryTerm) – zentrale Lernkomponente

Jeder Finanzbegriff wird beim ersten Auftreten auf einem Screen als GlossaryTerm gerendert. Das gilt für Quiz, Zusammenfassung, Explorer, Portfolio und Checkout gleichermaßen.

- Markup: \<Term id="etf"\>ETF\</Term\>. Darstellung: gepunktete Unterstreichung in Sage Deep \#7FB995 (nie Yellow – das ist der reservierten Textunterstreichung vorbehalten), Cursor „help“. Popover: Cream \#F5EFD7, Text Ink, Rahmen 1 px Sage Soft, kein Schatten, Begriff in Inter SemiBold, Definition Inter Regular 15 px. Kein Icon, um den Lesefluss nicht zu stören.

- Trigger: Desktop Hover (Delay 150 ms) und Fokus per Tab; Touch: Tap öffnet, Tap außerhalb schließt. Immer auch per Tastatur (Enter/Esc) bedienbar.

- Popover-Inhalt in fester Reihenfolge: (1) Begriff, (2) Kurzdefinition – ein Satz, max. 20 Wörter, (3) „Warum wichtig?:“ – ein Satz, (4) optional „Beispiel“ – ein Satz mit konkreter Zahl. Kein Scrollen im Popover.

- Datenquelle: glossary.json (Abschnitt 7.3). Fehlt ein Eintrag, rendert der Begriff ohne Unterstreichung und loggt einen Dev-Warning – nie ein leeres Popover.

- Auto-Erkennung: Ein Helfer markiert in Copy-Strings den ersten Treffer jedes Glossar-Begriffs pro Screen automatisch; manuelle Marker überschreiben das.

- Tracking: glossary_open {term_id, screen} bei jedem Öffnen.

- Akzeptanz: Jeder Begriff aus der Glossar-Liste (Abschnitt 8.1), der auf einem Screen sichtbar ist, hat ein funktionierendes Popover. Screenreader liest Definition über aria-describedby.

## 5.3 Disclaimer & Info-Boxen

- Footer-Disclaimer ab S5 (Text in 2.4), 12 px, immer sichtbar ohne Scroll auf Desktop.

- Info-Box-Komponente (InfoNote) mit drei Varianten: „Gut zu wissen“ (Lernen), „Beispiel, keine Empfehlung“ (Rechtslabel), „Du entscheidest. Wir begleiten.“ (Haltung). Farbe: Cream \#F5EFD7 als Karte (Sticky-Note-Logik aus den Brand Guidelines: leichter Tilt ±2,5° nur bei „Gut zu wissen“, kein Schatten, kein Rahmen), Text Ink, Label in Inter SemiBold 600 als Section-Tag. Rechtslabel „Beispiel, keine Empfehlung“ ohne Tilt, damit es als Hinweis und nicht als Deko gelesen wird. Max. zwei Cream-Karten pro Screen.

## 5.4 Session-State (kein Login)

- Ein einzelnes State-Objekt UserSession (Abschnitt 7.1) in LocalStorage, versioniert (schemaVersion). Jede Eingabe wird sofort persistiert.

- Rückkehr innerhalb von 30 Tagen: Start-Screen bietet „Weitermachen bei Schritt X“ oder „Neu starten“. Danach wird der State verworfen.

- Reset nur explizit durch die Userin. Zurück-Navigation ändert nie gespeicherte Werte.

- Kein Tracking personenbezogener Daten ohne Opt-in; die E-Mail-Adresse wird nur bei S10 erhoben und nur an das E-Mail-System übergeben (Brevo), nicht im Analytics-Stream.

## 5.5 Internationalisierung

- Alle Texte in locales/de.json (Quelle) und locales/en.json (Struktur identisch, Werte vorerst leer bzw. de-Fallback). Keys sprechen nach Screen: quiz.traps.card.berufseinstieg.title.

- Zahlen- und Währungsformat locale-abhängig (de-AT: 1.500,00 €).

- Glossar und Produktdaten enthalten je Sprache eigene Felder (name_de, name_en, description_de …).

## 5.6 Visuelle Sprache

Verbindliche Quelle: Portemonnaie Brand Guidelines v1.2, Abschnitte 04 (Color palette), 05 (Typography), 06 (Visual elements), 08 (Layout). Was hier steht, ist die Übersetzung in Design-Tokens für den Code. Bei Widerspruch gelten die Brand Guidelines.

Farben (nur diese 14 Kernfarben; Illustrationsfarben nie in UI, Text oder Hintergrund):

- Canvas: Background \#FAF8F3 ist der Standard-Seitenhintergrund aller Screens. Nie reines Weiß (#FFFFFF). Background Warm \#F7F3EB für rechte Panels (z. B. „Dein Portfolio“ im Explorer).

- Text: Ink \#1A2E24 für Fließtext. Ink Soft \#4A5C52 nur für Captions und Sekundärtext ab 18 px – darunter Ink. Forest \#1F3A2E für Headlines und Labels.

- Primärer CTA: Fläche Forest \#1F3A2E, Text Off-White \#FAF8F3, Hover Forest Deep \#14271F. Sekundärer CTA: Outline Forest auf Background. Yellow ist nie Button- oder Füllfarbe.

- Akzente: Sage \#A8D5BA nur als Brush-Highlight hinter einem kursiven Wort (65 % Opazität, −1° Rotation, −3° Skew). Sage Deep \#7FB995 für Listenmarker, Section-Tags, Glossar-Unterstreichung. Sage Soft \#D4EAD8 für Pills, Chips, Hover-Flächen.

- Callouts: Cream \#F5EFD7 für InfoNote-Karten und Sticky Notes (Tilt ±2,5°, kein Schatten, kein Rahmen, max. zwei pro Screen). Cream Soft \#FAF4DC für Trenner und Footer-Bänder.

- Yellow \#F2C94C (85 %) ausschließlich als Unterstreichung unter ein bis zwei Worten im Fließtext, maximal einmal pro Screen. Lilac und Marigold nur im Logo.

- Verboten: Gradienten, Drop-Shadows, Glows, reines Weiß als Fläche, Forest als Vollflächen-Hintergrund (Ausnahme: ein reservierter Moment, z. B. Ziele-Karte auf S10). Neunzig Prozent jeder Fläche bleiben hell.

Typografie (alle drei Fonts Google Fonts, per @import laden, keine Fallbacks auf Arial/Helvetica/Calibri):

- Inter für alles: Headlines, UI, Body, Zahlen, Buttons. H1 ExtraBold 800 (Web: 40–56 px, Zeilenhöhe 1.0), H2 ExtraBold 800 (28–36 px, 1.05), H3 Bold 700 (18–22 px, 1.15), Lead Regular 400 (16–18 px, 1.5), Body Regular 400 (15–16 px, 1.5–1.6), Caption Regular 400 (12–13 px, 1.4), Button SemiBold 600, Section-Tag SemiBold 600 mit Tracking.

- Instrument Serif Italic ausschließlich für: ein Akzentwort in einer Headline (z. B. „yours“, „bewegt“), Persona-/Pull-Quotes, Flashcard-Zitate (S2), Betonung in Cream-Callouts. Nie die Regular-Schnitt, nie für Fließtext oder UI.

- Caveat Bold nur für die Script-Zeile „Learn. Invest. Grow. On your terms.“ (S0 unten rechts, S11 Abschluss). Nie in Body, Headlines oder UI. Maximal einmal pro Screen.

- Brand-Phrasen exakt wie in Guidelines 07: Tagline „Investing, but make it yours.“ – „Investing, but make it“ Inter ExtraBold, „yours.“ Instrument Serif Italic mit Sage-Brush-Highlight. Signatur „Von Frauen. Für Frauen.“ Instrument Serif Italic in Forest, zwei Sätze mit Punkt.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Instrument+Serif:ital@0;1&family=Caveat:wght@500;700&display=swap');
:root { --bg:#FAF8F3; --bg-warm:#F7F3EB; --ink:#1A2E24; --ink-soft:#4A5C52; --forest:#1F3A2E; --forest-deep:#14271F;
--sage:#A8D5BA; --sage-deep:#7FB995; --sage-soft:#D4EAD8; --cream:#F5EFD7; --cream-soft:#FAF4DC; --yellow:#F2C94C;
--font-sans:'Inter',sans-serif; --font-serif:'Instrument Serif',serif; --font-script:'Caveat',cursive; }
```

# 6. Screens im Detail

Jeder Screen folgt dem Muster Zweck → Lernmoment → Layout → Copy → Interaktion & Logik → Akzeptanzkriterien. Copy-Blöcke sind eingerückt und kursiv; sie sind final formulierte Vorschläge für die i18n-Datei und stehen unter Legal-Vorbehalt (2.4).

## S0 · Start (/)

**Zweck.** Erwartung setzen, Angst nehmen, starten. Ein Screen, ein Versprechen: 15 Minuten, kein Vorwissen, keine Beratung, kein Jargon.

**Lernmoment.** Was „Guidance“ bei Portemonnaie heißt: Du lernst, du entscheidest, wir begleiten – bis zur Tür des Brokers.

**Layout. Hero links: Tagline (Inter ExtraBold, „yours.“ in Instrument Serif Italic mit Sage-Brush-Highlight) + Subline (Inter Regular Lead) + primärer CTA (Forest). Rechts: handgemalte Pflanzenillustration. Unten rechts Script-Zeile „Learn. Invest. Grow. On your terms.“ in Caveat.** Darunter drei Häkchen-Punkte. Sekundär: ausklappbare Übersicht der fünf Etappen. Resume-Banner oben, wenn ein gespeicherter State existiert.

> *Tagline: Investing, but make it yours.*
>
> *Subline: In 15 Minuten zu deinem ersten Portfolio – nach deinen Werten. Kein Vorwissen, kein Mindestkapital, Kein Jargon.*
>
> *Häkchen: Jeder Fachbegriff wird erklärt · Du entscheidest, wir begleiten · Keine Anlageberatung, kein Verkauf*
>
> *CTA: Los geht’s*
>
> *Resume-Banner: Du warst bei Schritt \[X\]. Weitermachen · Neu starten*

**Interaktion & Logik.** „Los geht’s“ legt eine neue UserSession an (sessionId, startedAt) und navigiert zu S2. „Weitermachen“ springt zum letzten gespeicherten Screen. „Neu starten“ fragt einmal nach („Deine bisherigen Antworten werden gelöscht.“).

**Akzeptanz.** LCP \< 2 s. CTA ist erstes fokussierbares Element nach dem Logo. Resume-Banner erscheint nur bei State mit schemaVersion = aktuell.

## S2 · Lifetime Traps – Flashcards (/quiz/traps)

**Zweck. Erster Quiz-Screen. Eine Zahl, eine Headline, acht Karten – keine Subline. Zeigt sofort die acht Lebensphasen, in denen Frauen strukturell Vermögen verlieren. Erkennen statt erschrecken.**

**Lernmoment. Der Gender-Wealth-Gap entsteht nicht in einem Moment, sondern an acht konkreten Stationen. Pro Karte ein Mechanismus + eine belegte Zahl (Euroraum/EU/OECD). Der Text verortet die Ursache immer im System, nie in der Frau.**

**Layout.** Grid 4 × 2 (Desktop) bzw. 2 × 4 (Mobile). Jede Karte zeigt vorne Titel + Icon. Klick/Tap dreht die Karte (3D-Flip, 400 ms) und zeigt hinten den Erklärungstext mit Zitat und Quelle. Gedrehte Karten erhalten einen Häkchen-Badge. Über dem Grid: Zähler „3 von 8 angesehen“. CTA unten immer sichtbar.

> *Headline: Männer besitzen weltweit 105 Billionen Dollar mehr als Frauen. Acht Fallen, machen diese Lücke jedes Jahr größer.*

**Inhalte.** Die acht Kartentexte stehen 1:1 in Abschnitt 8.2 (Berufseinstieg, Zusammenziehen und Heiraten, Mutterschaft, Teilzeit, Pflege von Angehörigen, Trennung und Scheidung, Menopause, Pension/Langlebigkeit/Verwitwung).

**Interaktion & Logik.** Fortschrittsleiste: Etappe Quiz, Sub-Schritt 1/6. Quelle der Headline-Zahl als Fußnoten-Tooltip an der Zahl (105 Bio. \$: Oxfam, Time to Care, 2020 – bzw. 100.000 €: Credit Suisse, N26; Businessplan 2.1, je nach gewählter Headline). Flip per Klick, Enter oder Leertaste. Rückseite hat „Zurückdrehen“ und Pfeile zur nächsten Karte. Alle Karten können, keine muss gedreht werden. State: traps.viewed\[\] (Karten-IDs). Event trap_card_flip {trap_id}.

**Akzeptanz.** Rückseitentext passt ohne Scrollen auf die Karte (Desktop ≥ 1280 px: Karte 280 × 360 px, Inter Regular 14 px). Zitat in Instrument Serif Italic 16 px, Quelle Inter 12 px in Ink Soft. Kartenvorderseite Cream \#F5EFD7, Rückseite Background Warm \#F7F3EB. Flip ist mit prefers-reduced-motion ein Fade.

## S3 · Deine Phase (/quiz/phase)

**Zweck.** Die Userin ordnet sich ein. Das schafft Relevanz für alles Weitere und ist die emotionale Brücke zu „mein Geld“.

**Lernmoment.** Direkt nach der Wahl erscheint die passende Kernzahl noch einmal – plus die Botschaft: Millionen Frauen im Euroraum stehen an derselben Stelle. Der Hebel liegt im System, ein Stück davon in der eigenen Hand.

**Layout.** Frage oben, acht Auswahl-Karten (gleiche Titel wie S2, kleiner), Mehrfachauswahl bis 2. Nach der Auswahl erscheint unter dem Grid eine Feedback-Karte (fade-in).

> *Frage: Wo stehst du gerade?*
>
> *Hilfetext: Wähle bis zu zwei. Es gibt keine falsche Antwort.*
>
> *Feedback (Beispiel Teilzeit): 27,9 % der Frauen in der EU arbeiten Teilzeit – meist wegen Care-Arbeit. Du bist in guter Gesellschaft. Und dein Geld kann trotzdem für dich UND deine Werte arbeiten.*
>
> *CTA: Weiter*

**Interaktion & Logik.** State: phase.selected\[\] (max 2). Feedback-Texte pro Phase in i18n (quiz.phase.feedback.\[id\]). Bei zwei Phasen wird das Feedback der zuerst gewählten angezeigt. Kein Skip; Auswahl ist Pflicht (min 1).

**Akzeptanz.** Feedback erscheint \< 200 ms nach Klick. Kein Wort aus der Defizit-Liste (2.3) in Feedback-Texten – automatisierter Lint-Check auf die i18n-Datei.

## S4 · Deine Situation (/quiz/situation)

**Zweck.** Zwei Rahmenbedingungen erfassen, die später den Plan konkret machen: monatlicher Betrag und Zeithorizont. Nicht mehr.

**Lernmoment.** Was ein Sparplan ist (automatisch, jederzeit stoppbar), was ein Neobroker ist, und dass die Einstiegsschwelle vom Weg abhängt: bei Neobrokern ab 1 € pro Monat, bei einer Vermögensverwaltung meist ab einem dreistelligen Monatsbetrag oder einer Einmalanlage und warum der Zeithorizont zählt: Time in the Market beats timing the market. Das heißt umso länger du dabei bist umso wahrscheinlicher gleicht dein Portfolio Schwankungen aus. Das ist Statistik, aber natürlich keine Garantie.

**Layout.** Zwei Fragen nacheinander (Sub-Schritte 4a und 4b), je eine Frage pro Ansicht, große Auswahl-Karten. Darunter eine „Gut zu wissen“-InfoNote mit dem Lernmoment.

> *4a Frage: Welchen Betrag könntest du dir vorstellen, monatlich anzulegen?*
>
> *4a Optionen: bis 50 € · 50–150 € · 150–300 € · über 300 € · Sage ich später*
>
> *4a Gut zu wissen: Ein Sparplan legt jeden Monat automatisch einen festen Betrag an. Bei Neobrokern ab 1 €. Bei einer Vermögensverwaltung gibt es Mindestbeträge. Du kannst ihn jederzeit ändern oder stoppen. Dein Betrag hier rechnet am Ende deinen Plan in Euro aus – und zeigt dir, welche Wege dir offenstehen.*
>
> *4b Frage: Wann möchtest du voraussichtlich auf das Geld zugreifen?*
>
> *4b Optionen: in unter 3 Jahren · in 3–10 Jahren · in mehr als 10 Jahren · Das ist offen*
>
> *4b Gut zu wissen: Kurse schwanken. Über längere Zeiträume haben sich Schwankungen historisch häufig ausgeglichen – time in the market beats timing the market. Die Vergangenheit ist aber keine Garantie. Geld, das du bald brauchst, wäre am Konto gut aufgehoben. Geld für dein Zukunfts-Ich könnte am Konto durch Inflation an Kaufkraft verlieren.*
>
> *CTA: Alles klar!*

**Interaktion & Logik.** State: situation.monthlyRange (enum), situation.horizon (enum). Beide Fragen dürfen mit „Sage ich später“/„Das ist offen“ beantwortet werden; dann rechnet S10 ohne Betrag bzw. blendet den Horizont in der Zusammenfassung aus. Keine der beiden Antworten beeinflusst Explorer-Inhalte oder -Sortierung (2.4).

**Akzeptanz.** Glossar-Terms auf diesem Screen: Sparplan, Kurs, Schwankung (Volatilität), Broker, Neobroker, Vermögensverwaltung, Inflation. Der Text unter 4b wird vom Legal-Review freigegeben, bevor er live geht (Abschnitt 11).

## S5 · Portfolio-Bausteine (/quiz/portfolio)

**Zweck.** Verstehen, wie ein Portfolio aufgebaut sein kann – bevor sie eines baut. Reiner Lernscreen, keine Eingabe.

**Lernmoment.** Drei Bausteine (ETF, Aktie, Anleihe), das Prinzip Streuung und das Spektrum ruhig ↔ mutig. Kernsatz: Schwankung und Rendite gehören zusammen. Historisch wurde mehr Schwankung im Schnitt mit mehr Rendite bezahlt – und umgekehrt. Einzelne Aktien schwanken stärker als ETFs, deshalb steigt ihr Anteil, je mehr Schwankung jemand aushalten will. Immer mit dem Zusatz: Vergangenheit, keine Garantie.

**Layout.** Oben drei Baustein-Karten (nebeneinander, klickbar → kurze Erklärung + Beispiel). Darunter „So unterschiedlich können Portfolios aussehen“: drei Beispiel-Donuts nebeneinander auf einer Achse ruhig → mutig, jeder mit dem Label „Beispiel, keine Empfehlung“. Alle drei Beispiele werden immer gezeigt, unabhängig von vorherigen Antworten.

> *Headline: So kann ein Portfolio aufgebaut sein.*
>
> *Intro: Ein Portfolio ist die Summe deiner Anlagen.*
>
> *Karte ETF: ETF bündelt viele Aktien oder Anleihen in einem Produkt. Ein Welt-ETF enthält z. B. über 1.500 Unternehmen. Du kaufst mit einem Klick eine breite Streuung*
>
> *Karte Aktie: Ein Anteil an einem einzelnen Unternehmen. Alles hängt an diesem einen. Große Rendite Chance aber auch größeres Risiko.*
>
> *Karte Anleihe: Du leihst einem Staat oder Unternehmen Geld und bekommst dafür Zinsen. Davon gibt es unterschiedliche Arten – ein Green Bond zum Beispiel finanziert Umweltprojekte. Welche das sind, legt der Emittent offen.*
>
> *Spektrum-Text: Grundsätzlich gilt Time in the market beats timing the markte – heißt je länger dein Anlagehorziont desto besser kann dein Portfolio Schwankungen am Markt ausgleichen – das sagt die Historie aber ist natürlich keine Garantie. Heißt konkret: mehr Aktien, wenn du Schwankung aushalten kannst. Mehr ETFs und Anleihen, wenn du ruhiger schlafen willst. Beides ist legitim.*
>
> *Beispiele als Pie-Chart ruhig: 70 % ETFs · 0 % Aktien · 30 % Anleihen · Beispiel ausgewogen: 60 % ETFs · 20 % Aktien · 20 % Anleihen · Beispiel mutig: 50 % ETFs · 40 % Aktien · 10 % Anleihen*
>
> *CTA: Verstanden, weiter*

**Interaktion & Logik.** Baustein-Karten öffnen ein Accordion (kein Flip, um S2 nicht zu kopieren). Hover über Donut-Segmente zeigt Prozent + Baustein. Keine Auswahl möglich, kein State außer viewed = true. Glossar-Terms: ETF, Aktie, Anleihe, Green Bond, Streuung (Diversifikation), Schwankung (Volatilität), Zinsen.

**Akzeptanz.** Label „Beispiel, keine Empfehlung“ ist Teil der Donut-Komponente und nicht abschaltbar. Kein Text nutzt „für dich“, „passend“, „empfehlen“ – Lint-Check.

## S6 · Dein Geld bewegt etwas (/quiz/impact)

**Zweck.** Der Übergang: Von „Vorsorge gegen die Lücke“ zu „Geld als Hebel für das, woran ich glaube“. Dieser Screen erklärt, warum sie selbst entscheiden soll, wohin ihr Geld fließt.

**Lernmoment.** Kapital hat immer eine Richtung. Zwei Hebel stehen jeder Anlegerin offen: ausschließen (Divesting) und gezielt stärken (wertebasiertes Investieren).

**Layout.** Volltext-Screen mit Illustration (Wurzeln → Baum). Darunter zwei Flip-Karten wie in S2: „Ausschließen“ und „Gezielt stärken“. Unten CTA.

> *Headline: Dein Geld arbeitet – egal ob du anlegst oder nicht. Die Frage ist: wofür?*
>
> *Body: Die acht Falltüren von vorhin zeigen, wo das System Frauen Geld kostet. Das betrifft uns individuell, aber eigentlich betrifft unser Geld uns alle, denn auch wenn wir nichts tun, landet unser Geld im Geldkreislauf. Es finanziert dann entweder Ein Windrad oder ein Kohlekraftwerk. Ein Unternehmen mit Frauen im Vorstand oder eines ohne. Wer das eigene Geld anderen überlässt, überlässt auch diese Entscheidung. Sobald du selbst anlegst, entscheidest du.*
>
> *Karte Ausschließen (Rückseite): Divesting heißt: Du nimmst Branchen oder Unternehmen bewusst aus deinem Portfolio heraus – etwa Waffen, Kohle oder Tabak. Viele ETFs machen das über Ausschlusskriterien.*
>
> *Karte Gezielt stärken (Rückseite): Wertebasiertes Investieren heißt: Du lenkst dein Geld gezielt dorthin, was du stärken willst – erneuerbare Energien, Bildung, Unternehmen mit fairer Bezahlung. Dafür gibt es Themen-ETFs, Green Bonds und einzelne Aktien.*
>
> *Abschluss: Beides zusammen macht aus Vorsorge eine Haltung. Invest in what you believe in.*
>
> *CTA: Meine Werte wählen*

**Interaktion & Logik.** Beide Karten optional. State: impact.viewed. Glossar-Terms: Divesting, wertebasiertes Investieren, Ausschlusskriterien, Themen-ETF.

**Akzeptanz.** Kein Satz über 20 Wörter. Body wird im MVP-Test auf Verständnis und Ton geprüft (Frage: „Hast du das Gefühl, dass es um dich geht?“).

## S7 · Deine Werte (/quiz/values)

**Zweck.** Die Userin wählt die UN-Nachhaltigkeitsziele (SDGs), die ihr wichtig sind. Diese Auswahl wird später zu ihrem selbst gesetzten Filter im Explorer.

**Lernmoment.** Was die 17 SDGs sind (UN, 2015, 193 Staaten) und dass Finanzprodukte über Themen und Ausschlüsse an sie anknüpfen. Hover auf jedem Ziel zeigt Beispielthemen aus dem Explorer.

**Layout.** Grid 6 × 3 (17 Kacheln + eine Info-Kachel „Was sind SDGs?“). Kachel: SDG-Nummer (Inter ExtraBold), Kurztitel, Farbe aus den gedämpften Tokens sdg-01…sdg-17 (abgeleitet aus Sage/Cream/Peach Soft/Sage Soft, nicht das UN-Original-Bunt; Ink-Text ≥ 4,5:1 auf jeder Kachel), Zähler „X Produkte“ aus dem Katalog. Ausgewählte Kacheln bekommen einen Häkchen-Rand. Rechts (Desktop) eine Zusammenfassungsleiste „Deine Auswahl (3/5)“.

> *Headline: Was ist dir persönlich wichtig?*
>
> *Hilfetext: Wähle 1 bis 5. Die 17 Ziele sind die Nachhaltigkeitsziele der Vereinten Nationen entlang denen man seine Werte-Haltung ausrichten kann.*
>
> *Hover Beispiel SDG 7: Bezahlbare und saubere Energie – Wind, Solar, Netze, Speicher. Im Explorer: 9 Produkte.*
>
> *CTA: Zusammenfassung ansehen*

**Interaktion & Logik.** Mehrfachauswahl, min 1, max 5 (bei 5 werden weitere Kacheln inaktiv mit Hinweis „Bis zu 5 – tausche eine aus“). Produktzähler = Anzahl Produkte mit diesem SDG in sdgTags. SDGs mit 0 Produkten sind wählbar, zeigen aber den Hinweis „Aktuell keine Produkte in unserer Liste“. State: values.sdgs\[\]. Event values_selected {sdg_ids}.

**Akzeptanz.** Alle 17 Titel und Hover-Texte aus Abschnitt 8.3. Kacheln mind. 140 × 120 px, Fokus-Ring sichtbar, Auswahl per Leertaste möglich.

## S8 · Zusammenfassung & CTA (/summary)

**Zweck.** Der Moment der Klarheit. Die Userin sieht in einem Blick, was ihr wichtig ist, was sie jetzt weiß, und was im Explorer passiert. Danach will sie bauen – und kann ihre Werte teilen. Der Screen ist der Referral-Hebel des Flows: Die Werte-Karte ist als Bild für Social Media exportierbar.

**Lernmoment.** (1) Spiegel der eigenen Antworten – keine Interpretation. (2) Allgemeine Wiederholung der Bausteine. (3) Einführung des Hover-Glossars als Werkzeug: Ab jetzt erklärt sich jeder unterstrichene Begriff beim Darüberfahren.

**Layout.** Zwei Spalten. Links Karte „Das ist dir wichtig“ mit drei Blöcken (Deine Phase · Deine Rahmenbedingungen · Deine Werte als Chips). Rechts Karte „Das weißt du jetzt“ mit fünf Häkchen und darunter „So geht es weiter“ (drei Schritte mit Mini-Icons). An der linken Karte ein sekundärer Button „Teilen“ (Icon Share, Outline Forest). Unten zentriert der stärkste CTA des gesamten Flows. Botanische Illustration als Hintergrund-Akzent.

> *Headline: Hier stehst du, das ist dir wichtig, so baust du.*
>
> *Block Phase (Beispiel): Du bist in der Phase Mutterschaft. Das erste Kind ist statistisch der größte Einkommensbruch – im deutschsprachigen Raum bis zu 61 %. Genau hier lohnt sich Vermögensaufbau am Meisten – für dich, für dein Kind und für eine gerechtere Zukunft.*
>
> *Block Rahmen (Beispiel): Du denkst an 50–150 € im Monat, für mehr als 10 Jahre. Das ist ein Sparplan mit langem Horizont.*
>
> *Block Rahmen (ohne Angaben): Betrag und Horizont hast du offen gelassen. Beides kannst du am Ende ergänzen.*
>
> *Block Werte: Deine Ziele: Geschlechtergleichheit · Klimaschutz · Hochwertige Bildung*
>
> *Das weißt du jetzt: ✓ Portfolios können aus ETFs, Aktien und Anleihen bestehen. ✓ Mehr Aktien heißt natürlich mehr Schwankung, mehr ETFs und Anleihen heißt mehr Ruhe. ✓ Acht Lebensphasen kosten Frauen systematisch Vermögen – eigenes Investieren heißt vorbeugen. ✓ Zeit investiert schlägt Timing – historisch, ohne Garantie.*
>
> *Now Let´s go build it yourslef. Stell dir dein Portfolio zusammen! (Du bekommst deinen Plan auch als PDF – für den Broker oder ein Beratungsgespräch.*
>
> *Glossar-Hinweis (InfoNote): Ab hier ist jeder unterstrichene Begriff erklärbar. Fahr einfach darüber. No shame in not knowing.*
>
> *CTA: I AM READY.*
>
> *Share-Karte (Bild, 1080 × 1350 px und 1080 × 1920 px): Drei kurze Zeilen übereinander, Inter ExtraBold, jede mit einem Instrument-Serif-Italic-Wort: „Sie sagten, Geld sei Männersache.“ · „Wir sagen: Geld ist Haltung.“ · „Ich investiere in das, wofür ich stehe.“ · darunter die gewählten SDGs als Chips (max. 5, Icon + Kurztitel) · Abschluss (Cream-Sticky-Note): „105 Billionen Dollar Unterschied. Jede von uns zählt. Du auch.“ · unten links Wallet-Mark + „portemonnaie.finance“ · unten rechts Signatur „Von Frauen. Für Frauen.“ (Instrument Serif Italic, Forest) · Hintergrund Background \#FAF8F3, eine Pflanzen-Illustration. Kein Name, keine Phase, kein Betrag, kein Portfolio.*
>
> *Share-Text (vorbelegt, editierbar): Männer besitzen 105 Billionen Dollar mehr als Frauen. Ich hab heute angefangen, das zu ändern – mit meinem Geld, nach meinen Werten. 10 Minuten. Kein Vorwissen. Mach mit: \[Link\] \#InvestInWhatYouBelieveIn \#VonFrauenFürFrauen*
>
> *Share-Sheet: Vorschau der Karte (Feed und Story umschaltbar) · Bild speichern · Link kopieren · Teilen (System-Dialog) · Toast: „Gespeichert. Jede geteilte Karte holt eine Frau mehr an den Tisch.“ · Kleingedruckt auf der Karte (Ink Soft, 8 pt): „Quelle: Oxfam 2020“. Regeln: keine wörtlichen Zitate lebender Autorinnen oder urheberrechtlich geschützter Werke auf der Karte – nur eigene Formulierungen und gemeinfreie Anspielungen; Slogan-Zeilen liegen als i18n-Keys vor (de/en), damit die Karte in der Sprache der Userin exportiert.*

**Interaktion & Logik.** Alle Texte werden aus dem State gerendert (Templates in i18n mit Platzhaltern). Der Phasen-Text nutzt den Kernsatz der jeweiligen Flashcard (8.2) – bei zwei Phasen die erste. Keine Ableitung eines Portfoliotyps, keine Gewichtungsvorschau (2.4). Klick auf einen Block navigiert zum entsprechenden Quiz-Screen. Event summary_view, summary_cta_click. Teilen: Die Share-Karte wird client-seitig aus einem versteckten DOM-Template gerendert (z. B. html-to-image → PNG), beide Formate in einem Schritt; keine Serverkomponente, keine Speicherung. Teilen-Aktion nutzt navigator.share({ files, text, url }) mit Fallback Download + Link kopieren. Der Link trägt einen anonymen Referral-Parameter (?ref=\<zufällige Session-ID\>), der bei Klick auf S0 als referrer im State gespeichert wird – kein Personenbezug. Ohne gewählte SDGs zeigt die Karte den Text „Ich fang an.“ statt Chips. Events: share_open, share_action {channel: save \| copy \| native}.

**Akzeptanz.** Screen passt auf 1280 × 800 ohne Scrollen bis inkl. CTA. „Antworten ändern“ verliert keine Werte. Legal-Review bestätigt: keine personalisierte Produkt- oder Gewichtungsaussage. Share-Karte enthält ausschließlich SDG-Chips, Headline, Marke, Signatur und Link – keine Phase, keinen Betrag, keinen Horizont, kein Produkt. Bild wird in unter 2 s erzeugt, Schriften sind eingebettet (kein Fallback-Font im Export). Auf iOS Safari funktioniert der System-Share-Dialog mit Bild.

## S9 · Explorer – das Herzstück (/explore)

**Zweck.** Die Userin baut ihr Portfolio selbst: suchen, verstehen, ablegen, gewichten. Wie Online-Shopping, nur nach deinen Werten.

**Lernmoment.** Jeder Begriff auf dem Screen ist ein Glossar-Term. Jede Produktkarte lehrt beim Lesen: Was ist TER, was ist eine Risikoklasse, was bedeutet ein Gender-Score von 8,9.

**Layout (Desktop, 3 Spalten).** Links (240 px) Filterpanel: Kategorie (ETF · Aktie · Anleihe/Green Bond), Deine Ziele (17 SDG-Chips, die aus S7 gewählten sind aktiv), Mindest-Score Sustainability und Gender (Slider 0–10), Region. Mitte: Suchleiste (Name, ISIN, Thema) + Sortierung (Name A–Z · Kosten aufsteigend · Sustainability-Score · Gender-Score) + Ergebnisliste als Produktkarten. Rechts (320 px) sticky: Drop-Zone „Dein Portfolio“ oben, Donut + Gewichtungsliste unten, CTA „Zum Portfolio“.

**Produktkarte.** Name · Typ-Badge · Region · TER · Anzahl Positionen · Risikoklasse (SRI 1–7 aus dem KID) · Sustainability-Score · Gender-Score (beide mit Label „laut \[Anbieter\], Stand \[MM/JJJJ\]“) · Spinnennetz (6 Achsen: Klima, Soziales, Governance, Gender, Biodiversität, Transparenz) · SDG-Tags (max 3 sichtbar) · Button „+“ und Drag-Handle. Klick auf den Namen öffnet das Produkt-Detail (Drawer von rechts).

**Produkt-Detail (Drawer).** Kurzbeschreibung (2 Sätze), „Was ist drin“ (Top-5-Positionen, wenn vorhanden), KID-Kennzahlen (Risikoklasse, laufende Kosten, Ausschüttung ja/nein, Auflagedatum, Fondsvolumen), Scores mit Erklärung der Skala sowie Anbieter, Kriterium und Stand der Einstufung, Beiträge zu den gewählten SDGs, Link zum KID-PDF des Anbieters, Button „In mein Portfolio“.

**Dein Portfolio (rechts).** Nach dem ersten Ablegen: Liste der Produkte mit Gewichtungs-Slider (Schritt 5 %) und Prozentfeld, Summe muss 100 % ergeben (Fortschrittsring zeigt „60 % aufgebaut“). Standard beim Hinzufügen: Rest gleichmäßig verteilen. Darunter beschreibende Rückmeldung zum Mix (kein Urteil).

> *Leerzustand rechts: Zieh Produkte hierher oder tipp auf „+“. Dein Portfolio baut sich unten auf.*
>
> *Mix-Rückmeldung (beschreibend): Dein Mix: 60 % ETFs · 20 % Aktien · 20 % Anleihen. Im Spektrum aus Schritt 5 liegt das bei „ausgewogen“.*
>
> *Hinweis bei nur 1 Produkt: Streuung heißt: nicht alles auf ein Produkt. Das ist ein Prinzip, keine Vorgabe. Und: auch wenn verlockend: nicht übertreiben, für jeden Kauf und Verkauf von Wertpapieren wie Aktien, ETFs oder Anleihen über eine Bank oder einen Online-Broker zahlt man üblich Ordergebühren.*
>
> *Leerzustand Liste: Für diese Kombination gibt es in unserer Liste aktuell keine Produkte. Nimm einen Filter heraus oder suche nach einem Thema.*
>
> *CTA rechts: Zum Portfolio (aktiv bei Summe = 100 % und ≥ 1 Produkt)*

**Interaktion & Logik.** Drag & Drop (HTML5 DnD oder Pointer Events) mit Button-Alternative „+“. Filter sind reine Mengenoperationen auf products.json; SDG-Filter = OR über gewählte SDGs; Score-Slider = Mindestwert. Sortierung nie nach Nutzerantworten. Voreinstellung beim Betreten: SDG-Chips aus S7 aktiv, alle anderen Filter neutral, Sortierung „Name A–Z“. State: portfolio.items\[{productId, weight}\]. Events: explore_filter_change, product_open, product_add, product_remove, weight_change, glossary_open.

**Mobile.** Filter als Bottom Sheet, Liste vollbreit, „Dein Portfolio“ als sticky Leiste unten mit Donut-Mini und Anzahl; Tap öffnet Vollansicht. Kein Drag & Drop.

**Akzeptanz.** Liste rendert 60 Produkte \< 100 ms nach Filterwechsel. Jede Karte hat mind. 6 Glossar-Terms (TER, Risikoklasse, ISIN, Sustainability-Score, Gender-Score, Positionen). Summe der Gewichte kann nie ≠ 100 % beim Weitergehen sein. Kein Text mit „empfohlen“/„passt zu dir“ (Lint).

## S10 · Dein Portfolio & Plan sichern (/portfolio)

**Zweck.** Das Gefühl „bereit“. Die Userin prüft, sieht ihre Ziele im Portfolio, und nimmt einen konkreten Plan mit – als PDF und per E-Mail.

**Lernmoment.** Wie sich ein monatlicher Betrag auf Produkte verteilt; was die Einstufungen des Gesamtportfolios bedeuten und wer sie vergibt; welche To-dos beim Broker warten.

**Layout.** Zentrum: Donut 100 % mit Legende. Links Karte „Zusammensetzung“ (Produkte, Gewichtung, monatlicher Betrag in €). Rechts Karte „Deine Ziele“ (gewichteter Sustainability-Score, gewichteter Gender-Score, abgedeckte SDGs von deinen gewählten, optional CO₂ vs. Benchmark falls Daten vorhanden). Darunter Betragsfeld (vorbelegt mit Mitte der Range aus S4, editierbar). Unten Block „Plan sichern“ mit zwei gleichwertigen Buttons. Danach CTA „Weg wählen“.

> *Headline: Dein Portfolio.*
>
> *Ziele: Ziele-Score 8,6 von 10 · Gender-Score 8,0 von 10 · Deine Ziele: 3 von 3 abgedeckt*
>
> *Betrag: Monatlicher Betrag: \[100\] € → Global Equality ETF 60 € · Climate Leaders ETF 20 € · EU Green Bond 20 €*
>
> *Plan sichern: Als PDF herunterladen · Per E-Mail schicken (Feld: deine E-Mail; Checkbox separat: „Ja, ich möchte den Portemonnaie-Newsletter“ – nicht vorausgewählt)*
>
> *InfoNote: Du entscheidest. Wir begleiten. Dieser Plan ist deine To-do-Liste – für den Broker oder das Gespräch mit deiner Beraterin.*
>
> *CTA: Weg wählen*

**PDF „Mein Portfolio-Plan“ (A4, 4–6 Seiten).** (1) Deckblatt: Name des Plans, Datum, deine Werte als Chips, dein Satz aus S3. (2) Portfolio-Tabelle: Produkt · ISIN · Typ · Anbieter · Gewichtung · monatlicher Betrag · TER · Risikoklasse · Sustainability · Gender. (3) Deine Ziele im Portfolio (wie Screen, inkl. Anbieter und Stand der Scores). (4) So setzt du es um – Broker-To-do: Depot eröffnen (Ausweis, 10–20 Min.) → Sparplan anlegen → ISIN in die Suche kopieren → Betrag und Ausführungstag wählen → für jedes Produkt wiederholen → fertig. (5) Gesprächsleitfaden für Bankberater:in oder Wealth Manager: 7 Fragen (Gesamtkosten pro Jahr in €? Bekommen Sie Provisionen für dieses Produkt? Gibt es eine günstigere ETF-Alternative? Wie wird meine Nachhaltigkeitspräferenz umgesetzt? Wie komme ich wieder heraus, was kostet das? Wer trägt das Risiko? Kann ich mir das drei Tage überlegen?). (6) Glossar aller Begriffe, die in diesem Plan vorkommen. (7) Disclaimer (2.4) und Quellen der Scores.

**Interaktion & Logik.** PDF wird clientseitig oder serverseitig aus dem State erzeugt (Peters Wahl); Dateiname Portemonnaie_Plan_JJJJ-MM-TT.pdf. E-Mail-Versand über Brevo Transactional Template mit PDF-Anhang; Newsletter-Opt-in nur bei gesetzter Checkbox (Double-Opt-in). Betragsverteilung = Betrag × Gewichtung, gerundet auf ganze Euro, Rundungsdifferenz auf das größte Produkt. Ohne Betrag entfallen €-Spalten. Events: plan_download, plan_email_sent, newsletter_optin.

**Akzeptanz.** PDF enthält exakt dieselben Gewichtungen wie der Screen. Kein Produkt ohne ISIN. E-Mail-Adresse landet nicht im Analytics-Stream. Glossar im PDF enthält jeden auf dem Screen verwendeten Begriff.

## S11 · Weg wählen (/execute)

**Zweck.** Der Übergang zum lizenzierten Partner. Zwei gleichwertige Wege, transparent verglichen, ohne Druck.

**Lernmoment.** Was ein Depot ist, was Einlagensicherung bedeutet, worauf beim Broker zu achten ist, und was eine Vermögensverwaltung anders macht als ein Broker.

**Layout.** Headline, Subline mit Disclaimer, zwei gleich große Karten. Links „Selbst investieren“ mit Vergleichstabelle (3 Broker, alphabetisch): Sparplan-Kosten · Order-Kosten · Depotgebühr · Sparplan ab · Nachhaltigkeitsfilter · Sitz & Einlagensicherung · Einrichtungsdauer · Button „Zu \[Broker\]“. Rechts „Begleiten lassen“ mit 2–3 Anbietern (alphabetisch): Art (digitale Vermögensverwaltung / persönliche Beratung) · Mindestanlage · Kosten p. a. · Button „Erstgespräch anfragen“. Unter jeder Karte eine InfoNote „Worauf du achten kannst“. Ganz unten: „Beide Wege stehen dir offen. Investiere nach deinen Werten.“

> *Headline: Du wählst deinen Weg.*
>
> *Karte links Intro: Set it and forget it: Du eröffnest dein Depot bei einem Broker und gibst deinen Plan selbst ein. Dein PDF ist die Anleitung.*
>
> *Karte rechts Intro: Minimal mental load: lass dich persönlich begleiten und dir ein maßgeschneidertes Portfolio anpassen. Dein Plan ist die Gesprächsgrundlage.*
>
> *InfoNote links: Achte auf die Sparplan-Kosten, nicht nur auf die Order-Kosten. Und auf den Sitz: In der EU sind bis zu 100.000 € Einlagen pro Bank gesichert; Wertpapiere gehören ohnehin dir.*
>
> *Kennzeichnung an jedem Link: Werbung · Portemonnaie erhält eine Provision. Für dich entstehen dadurch keine zusätzlichen Kosten.*

**Interaktion & Logik.** Partnerdaten aus partners.json (7.5). Links öffnen in neuem Tab mit rel="sponsored noopener" und getracktem Affiliate-Parameter. Keine Übergabe von Portfolio-Daten an Partner. Reihenfolge alphabetisch, kein Highlight, kein „Beliebt“. Events: execute_view, partner_click {partner_id, path}. Nach Klick: Screen bleibt offen, Toast „Dein Plan liegt als PDF bereit – falls du ihn noch einmal brauchst.“

**Akzeptanz.** Beide Karten optisch gleichwertig (gleiche Breite, gleiche CTA-Größe, beide CTAs Forest \#1F3A2E – kein farblicher Vorzug für einen Weg). Kennzeichnung gemäß § 26 MedienG bei jedem Affiliate-Link. Vergleichswerte tragen Stand-Datum (z. B. „Stand 09/2026“). Mindestbeträge (Sparplan ab, Einmalanlage ab) sind vor Launch vom jeweiligen Partner schriftlich bestätigt – öffentliche Angaben widersprechen sich teils. Anbieternamen erscheinen ausschließlich auf S11, nie in Quiz oder Explorer.

# 7. Datenmodell (JSON-Schemata)

Alle Daten liegen im MVP als statische JSON-Dateien im Repo (data/). Feldnamen sind verbindlich, damit Screens, PDF und Analytics dieselbe Sprache sprechen. Mehrsprachige Felder tragen das Suffix \_de / \_en.

## 7.1 UserSession (LocalStorage, Key: pm_session)

```jsonc
{
  "schemaVersion": 1,
  "sessionId": "uuid",
  "startedAt": "2026-09-09T10:00:00Z",
  "lastScreen": "/quiz/values",
  "locale": "de",
  "traps": { "viewed": ["berufseinstieg", "teilzeit"] },
  "phase": { "selected": ["mutterschaft"] },
  "situation": { "monthlyRange": "50_150" | "under_50" | "150_300" | "over_300" | "later",
  "monthlyAmount": 100,
  "horizon": "under_3y" | "3_10y" | "over_10y" | "open" },
  "portfolioEducation": { "viewed": true },
  "impact": { "viewed": true },
  "values": { "sdgs": [5, 13, 4] },
  "portfolio": { "items": [ { "productId": "ie00b_global_equality", "weight": 60 } ],
  "completedAt": null },
  "checkout": { "pdfDownloaded": false, "emailSent": false, "newsletterOptIn": false }
}
```

## 7.2 Product (data/products.json, 30–60 Einträge)

```jsonc
{
  "id": "ie00b_global_equality",
  "isin": "IE00B........",
  "name": "Global Equality ETF",
  "provider": "Anbieter GmbH",
  "type": "etf" | "stock" | "bond",
  "subtype": "equity_world" | "equity_theme" | "green_bond" | "single_stock",
  "region": "world" | "europe" | "emerging" | "austria",
  "currency": "EUR",
  "ter": 0.0020, // laufende Kosten p.a. als Dezimalzahl
  "sri": 4, // Risikoklasse 1–7 aus dem KID
  "distribution": "accumulating" | "distributing",
  "inceptionDate": "2019-03-01",
  "fundSizeMeur": 412,
  "holdingsCount": 248,
  "topHoldings": ["...", "...", "...", "...", "..."],
  "scores": { "sustainability": 8.7, "gender": 8.9,
  "radar": { "climate": 8.2, "social": 8.5, "governance": 7.9,
  "gender": 8.9, "biodiversity": 6.1, "transparency": 8.0 } },
  "scoreSource": { "provider": "Money:Care", "asOf": "2026-08" },
  "sdgTags": [5, 8, 10],
  "exclusions": ["weapons", "coal", "tobacco"],
  "description_de": "Zwei Sätze, jargonfrei.",
  "description_en": "",
  "kidUrl": "https://...",
  "themes_de": ["Frauen in Führung", "Governance"],
  "themes_en": []
}
```

## 7.3 GlossaryTerm (data/glossary.json)

```jsonc
{
  "id": "ter",
  "term_de": "TER (laufende Kosten)",
  "term_en": "TER (ongoing charges)",
  "aliases_de": ["Gesamtkostenquote", "laufende Kosten"],
  "definition_de": "Die TER zeigt, wie viel Prozent deiner Anlage pro Jahr als Kosten abgehen.",
  "why_de": "Kosten wirken jedes Jahr – 0,2 % statt 1,5 % machen über 20 Jahre tausende Euro aus.",
  "example_de": "Bei 1.000 € und 0,2 % TER zahlst du 2 € im Jahr.",
  "definition_en": "", "why_en": "", "example_en": "",
  "relatedIds": ["etf", "depotgebuehr"]
}
```

## 7.4 SDG (data/sdgs.json, 17 Einträge)

```jsonc
{
  "id": 7,
  "title_de": "Bezahlbare und saubere Energie",
  "title_en": "Affordable and Clean Energy",
  "hover_de": "Wind, Solar, Netze, Speicher.",
  "colorToken": "sdg-07",
  "themes_de": ["Erneuerbare Energien", "Energieeffizienz"]
}
```

## 7.5 Partner (data/partners.json)

```jsonc
{
  "id": "broker_x",
  "kind": "broker" | "wealth",
  "name": "Broker X",
  "country": "DE",
  "depositProtection_de": "EU-Einlagensicherung bis 100.000 €",
  "fees": { "savingsPlan_de": "0 €", "order_de": "1 €", "custody_de": "0 €", "minSavingsPlanEur": 1 },
  "sustainabilityFilter": true,
  "setupMinutes": 15,
  "minInvestmentEur": null, // nur wealth
  "feePaText_de": null, // nur wealth, z. B. "ab 0,9 % p.a."
  "affiliateUrl": "https://...?ref=portemonnaie",
  "asOf": "2026-09"
}
```

## 7.6 Ableitungen (berechnet, nicht gespeichert)

Portfolio-Scores = Σ (weight_i × score_i) / 100. Mix-Beschreibung: Anteil Aktien (type = stock) \< 10 % → „ruhig“, 10–30 % → „ausgewogen“, \> 30 % → „mutig“ – rein beschreibend, Schwellen als Konstanten. Betragsverteilung siehe S10. SDG-Abdeckung = Anzahl gewählter SDGs, die in mindestens einem Portfolio-Produkt vorkommen.

## 7.7 Datenquellen & Lizenzen (MVP)

Grundsatz: Phase 1 braucht keine Live-Daten. Nichts wird gehandelt, nichts wird bewertet. Alle Felder in products.json kommen aus öffentlichen Pflichtdokumenten oder eigener Erhebung und werden quartalsweise manuell aktualisiert. Jeder Wert trägt source und asOf. Eine Kurs- oder ESG-API ist erst mit Umsatz (ab Q1 2027) und nur mit schriftlich geklärten Display-Rechten vorgesehen.

Quelle je Feld:

- Stammdaten (Name, ISIN, Typ, Emittent, Domizil, Ausschüttung, Replikation): Factsheet und Basisinformationsblatt (PRIIPs-KID) des Emittenten. Gesetzlich verpflichtend öffentlich, pro ISIN abrufbar, Wiedergabe regulatorischer Pflichtangaben ist lizenzfrei.

- Kosten (TER) und Risikoindikator (SRI 1–7): PRIIPs-KID. Im Explorer wird der SRI als „Risikoklasse laut Basisinformationsblatt“ gezeigt, nicht als eigene Bewertung.

- Nachhaltigkeit auf Fondsebene: SFDR-Einstufung (Art. 6/8/9), Mindestanteil nachhaltiger Investments, PAI-Berücksichtigung – aus dem vorvertraglichen SFDR-Anhang und dem European ESG Template (EET, FinDatEx). Das EET ist frei von Urheber- und Schutzrechten und liegt bei den meisten Fondsgesellschaften pro ISIN als CSV/Excel vor. Ausschlusskriterien (exclusions) aus EET-Feldern zu Waffen, Kohle, Tabak etc.

- Sustainability-Score (0–10): Einstufung eines lizenzierten Datenanbieters (Money:Care, alternativ Matter), keine eigene Berechnung durch Portemonnaie. Anzeige immer mit Anbieter, Kriterium und Stand aus scoreSource, etwa „Sustainability-Score laut Money:Care, Stand 08/2026“. Methodik des Anbieters im Glossar verlinkt („Wie der Score entsteht“).

- Gender-Score (0–10): Einstufung eines lizenzierten Datenanbieters (Money:Care oder ein anderer Anbieter, der Genderdaten erhebt), keine eigene Erhebung durch Portemonnaie. Anzeige wie beim Sustainability-Score mit Anbieter, Kriterium und Stand. Methodik des Anbieters im Glossar verlinkt.

- Kurse und Wertentwicklung: Nicht im MVP. Keine Kursanzeige, keine Renditegrafik. Für Rechenbeispiele (S10) gilt eine feste, als Beispiel gekennzeichnete Annahme.

Was ausdrücklich nicht in den Produktionsbuild darf:

- Free-Tiers von Finnhub, Twelve Data, Alpha Vantage: nur für persönliche bzw. nicht-kommerzielle Nutzung lizenziert; Twelve Data verlangt für Nicht-US-Kurse und jede Weitergabe eine gesonderte Freigabe. Finnhub Free darf lokal in der Entwicklung zur ISIN-/Namensvalidierung dienen, nie im Deployment.

- Yahoo Finance / yfinance: ausschließlich für persönliche Nutzung – gilt auch für die dort angezeigten Sustainalytics-Scores. Kein Scraping.

- LSEG-/Refinitiv-ESG-Scores: Einzelabfrage online gratis, kommerzielle Wiedergabe nur mit Lizenz.

- Fairer Finance (UK): Verbraucherorganisation mit Produkt-Ratings für britische Finanzanbieter, keine ESG-Daten auf Wertpapiere, keine API. Bleibt Referenz für Verhaltensdesign, nicht für Daten.

Ausblick:

- Ab Umsatz (Q1 2027): EODHD Basic (ca. 20 €/Monat) für End-of-Day-Kurse, Display-Rechte vorab schriftlich bestätigen. ESG-Partner per Lizenzvertrag (Money:Care präferiert, Matter als Alternative).

- Ab Juli 2027: European Single Access Point (ESAP, ESMA) – kostenloser zentraler Zugang zu Finanz- und Nachhaltigkeitsberichten europäischer Unternehmen und Produkte. Datensammlung läuft seit 10.07.2026. Zielquelle für den Gender-Score in Phase 2.

- Technische Vorbereitung jetzt: products.json bekommt pro Score ein Objekt { value, source, method, asOf }. Ein Adapter-Interface (ScoreProvider) mit der MVP-Implementierung „ManualEET“ erlaubt späteren Tausch ohne UI-Änderung.

# 8. Content-Inventar

## 8.1 Glossar – Startliste (mind. diese Begriffe in glossary.json)

Grundlagen: Vermögen · Investieren/Anlegen · Portfolio · Depot · Broker · Sparplan · Kurs · Rendite · Schwankung (Volatilität) · Risiko · Streuung (Diversifikation) · Anlagehorizont · Zinsen · Inflation.

Bausteine: ETF · Aktie · Anleihe · Green Bond · Themen-ETF · Welt-ETF · Fonds · Index.

Kennzahlen & Dokumente: ISIN · TER (laufende Kosten) · Risikoklasse (SRI) · KID/Basisinformationsblatt · Ausschüttend/Thesaurierend · Fondsvolumen · Positionen (Holdings) · Order · Ausführungstag · Depotgebühr · Einlagensicherung.

Wirkung: ESG · Sustainability-Score · Gender-Score · SDG · Divesting · Wertebasiertes Investieren · Ausschlusskriterien · Impact · Nachhaltigkeitspräferenz (MiFID II) · Gender Pay Gap · Gender Pension Gap · Gender Wealth Gap.

Wege: Neobroker (App-basierter Broker ohne Filialen, Sparpläne meist ab 1 €, kein Mindestkapital) · Vermögensverwaltung · Robo-Advisor (nur im Glossar, nie in der UI-Copy) · Provision · Anlageberatung · Affiliate/Werbelink.

Regel für jeden Eintrag: Definition max. 20 Wörter, „Warum wichtig:“ ein Satz, Beispiel mit konkreter Zahl. Ton wie eine informierte Freundin.

## 8.2 Flashcard-Texte S2 (final, mit Quellen)

Design: Aufgebaut wie Flashcards – vorne ein Begriff wie „Berufseinstieg“, Klick dreht die Karte, hinten steht der Erklärungstext.

**Berufseinstieg.** Die erste Vermögenslücke entsteht mit dem ersten Gehalt. Im Euroraum verdienen Frauen pro Stunde 11,4 % weniger als Männer (Eurostat 2024, sdg_05_20). Der Abstand beginnt früh: In Deutschland lag er in den ersten drei Berufsjahren bei 18,7 % (WSI-Lohnspiegel, zitiert nach Eurofound 2010). Diese Basis übertragt sich auf jede spätere Gehaltserhöhung in Prozent.

**Zusammenziehen und Heiraten.** Mit dem gemeinsamen Haushalt beginnt die unsichtbare Umverteilung. Frauen übernehmen mehr unbezahlte Arbeit und teilen die Kosten trotzdem oft zur Hälfte. Rechnet man Job und Haushalt zusammen, arbeiten Frauen in der EU pro Jahr acht Vollzeitwochen mehr als Männer (Europäisches Parlament, A10-0021/2026, Erwägung H).

**Mutterschaft.** Das erste Kind ist einer der schönsten Momente im Leben. Finanziell ist es zugleich der größte Einbruch, den das System für Frauen bereithält. Langfristig verdienen Mütter in Österreich und Deutschland 51–61 % weniger als vor der Geburt – der Wert der Väter bleibt fast unverändert. In Skandinavien sind es 21–26 %, in englischsprachigen Ländern 31–44 % (Kleven et al. 2019, NBER Working Paper 25524; Registerdaten u. a. aus AT und DE).

**Teilzeit.** Nach der Karenz bleibt Teilzeit für viele dauerhaft. Jede Teilzeitstunde fehlt doppelt: heute im Gehalt, später in der Pension. 2024 arbeiteten in der EU 27,8 % der Frauen in Teilzeit, aber nur 7,7 % der Männer (Eurostat, lfsi_pt_a). Häufigster Grund bei Frauen ist die Betreuung von Kindern oder pflegebedürftigen Erwachsenen: 29,6 % nennen ihn, gegenüber 8,7 % der Männer (Eurostat, lfsa_epgar).

**Pflege von Angehörigen**. In der Lebensmitte kommt die zweite Care-Welle, meist Eltern oder Schwiegereltern. Sie trifft Frauen genau in den Jahren, in denen Männer ihre höchsten Gehälter und Vorsorgebeiträge erreichen. Betreuungspflichten halten rund 7,7 Millionen Frauen in Europa vom Arbeitsmarkt fern, gegenüber 450.000 Männern (EIGE, zitiert in Europäische Kommission, COM(2022) 442).

**Trennung und Scheidung.** Die Scheidung macht die stille Umverteilung früherer Phasen auf einen Schlag sichtbar. In Großbritannien fällt das Haushaltseinkommen von Frauen im Jahr danach um 41 %, das von Männern um 21 % (Legal & General 2024). Deutsche Paneldaten zeigen dasselbe Muster für den Euroraum: Frauen verlieren dauerhaft Haushaltseinkommen, bei Männern ist die Belastung vorübergehend (Leopold 2018, Demography; SOEP 1984–2015).

**Menopause.** Die Wechseljahre wirken wie ein zweiter Karriereknick, der in keiner Finanzplanung vorkommt. Vier Jahre nach einer Menopause-Diagnose liegt das Einkommen betroffener Frauen um rund 10 % niedriger. Beschäftigung und Arbeitsstunden sinken dauerhaft (Conti, Ginja, Persson & Willage 2025, NBER Working Paper 33621; Registerdaten Norwegen und Schweden). Euroraum-Zahl: noch offen**.**

**Pension, höhere Lebenserwartung und Verwitwung.** Für die höhere Lebenserwartung gibt es am Ende dann auch noch Einbußen: Frauen ab 65 erhalten in der EU im Schnitt 24,5 % weniger Pension als Männer (Eurostat 2024, ilc_pnp13). Gleichzeitig leben sie nach dem Erwerbsaustritt 22,8 Jahre, Männer 18,6 Jahre – also rund vier Jahre länger (OECD, Pensions at a Glance 2025). Nach dem Tod des Partners bleiben oft dessen Fixkosten, aber nur ein Einkommen.

Hinweis Brand Voice: Alle Karten sind einsprachig Deutsch. Zahlen sind ins Deutsche übertragen; die Originalquellen mit Link stehen in Abschnitt 12. Stand 10.09.2026 sind alle Sätze ≤ 20 Wörter und jede Karte hat eine Euroraum- oder EU-Hauptzahl, außer Menopause. UK-Quelle (Legal & General) und Nicht-Euroraum-Register (Kleven: u. a. AT/DE; Conti et al.: NO/SE) bleiben als Beleg stehen. Offen: Euroraum-Zahl zur Menopause und eine bezifferte Euroraum-Zahl zur Scheidung.

## 8.3 Die 17 SDGs (Kurztitel DE, Hover-Beispielthemen)

- 1 Keine Armut – Mikrofinanz, Grundversorgung, faire Löhne

- 2 Kein Hunger – nachhaltige Landwirtschaft, Lebensmittelversorgung

- 3 Gesundheit und Wohlergehen – Medizin, Prävention, Pflege

- 4 Hochwertige Bildung – Bildungsanbieter, EdTech, Ausbildung

- 5 Geschlechtergleichheit – Frauen in Führung, Gender Pay Gap, faire Karrierewege

- 6 Sauberes Wasser und Sanitärversorgung – Wasseraufbereitung, Infrastruktur

- 7 Bezahlbare und saubere Energie – Wind, Solar, Netze, Speicher

- 8 Menschenwürdige Arbeit und Wirtschaftswachstum – faire Lieferketten, Arbeitsrechte

- 9 Industrie, Innovation und Infrastruktur – grüne Technologie, Kreislaufwirtschaft

- 10 Weniger Ungleichheiten – Inklusion, Zugang zu Kapital

- 11 Nachhaltige Städte und Gemeinden – Wohnbau, Mobilität, Stadtgrün

- 12 Nachhaltiger Konsum und Produktion – Recycling, Kreislaufwirtschaft, Transparenz

- 13 Maßnahmen zum Klimaschutz – CO₂-Reduktion, Klimaanpassung

- 14 Leben unter Wasser – Meeresschutz, nachhaltige Fischerei

- 15 Leben an Land – Biodiversität, Wald, Boden

- 16 Frieden, Gerechtigkeit und starke Institutionen – Governance, Anti-Korruption, Ausschluss Waffen

- 17 Partnerschaften zur Erreichung der Ziele – Entwicklungsfinanzierung, Kooperationen

Darstellung: eigene, gedämpfte Farbtokens (sdg-01 … sdg-17) statt der UN-Originalfarben; Nummer und Titel gemäß offizieller deutscher Übersetzung der UN.

# 9. Analytics-Events

Anonym, ohne Cookies-Banner-Pflicht (z. B. Plausible/Matomo self-hosted, EU-Hosting). Jedes Event trägt sessionId (Hash), screen, locale, timestamp. Keine E-Mail-Adressen, keine Freitexte.

- session_start · session_resume · session_reset

- screen_view {screen} – Basis für Completion-Funnel und Time-to-Portfolio (Differenz session_start → plan_download/partner_click).

- trap_card_flip {trap_id} · phase_selected {phase_ids} · situation_answered {monthlyRange, horizon}

- values_selected {sdg_ids, count} · summary_view · summary_cta_click · share_open · share_action {channel} · referral_landing {ref}

- explore_filter_change {filterType, value} · product_open {product_id} · product_add {product_id} · product_remove {product_id} · weight_change

- glossary_open {term_id, screen} – Kern-KPI „Lernen im Flow“.

- portfolio_complete {itemCount, mix: {etf, stock, bond}, sustainabilityScore, genderScore, sdgCoverage} – aggregierte Wirkungsmessung (Businessplan 3.2), keine Produkt-IDs nötig.

- plan_download · plan_email_sent · newsletter_optin (nur boolean)

- execute_view · partner_click {partner_id, kind}

Dashboards: Funnel S0→S11, Median Time-to-Portfolio, Glossar-Top-10, SDG-Verteilung, Partner-Klicks. Ziel-Schwellen in 1.4.

# 10. Nicht-funktionale Anforderungen

- Performance: LCP \< 2 s auf S0, Interaktionen \< 100 ms, Explorer-Filter clientseitig ohne Netzwerk. Gesamt-Bundle \< 300 kB gzipped (ohne PDF-Lib, die lazy geladen wird).

- Barrierefreiheit: WCAG 2.1 AA. Alle Interaktionen per Tastatur; Fokus sichtbar (2 px Forest-Outline); Kontrast ≥ 4,5:1 auch auf Cream und Sage Soft (Referenz: Forest auf Background 9,4:1; Ink Soft nur ≥ 18 px); Glossar per Screenreader; prefers-reduced-motion respektiert; Drag & Drop hat immer Button-Alternative.

- Responsiv: Desktop first ≥ 1280 px, Tablet 768–1279 px, Mobile ≥ 375 px. Kein horizontales Scrollen.

- Datenschutz (DSGVO): keine personenbezogenen Daten bis S10; E-Mail nur für Versand (Brevo, EU) und optional Newsletter (Double-Opt-in); LocalStorage-Hinweis in der Datenschutzerklärung; Löschung des State jederzeit durch die Userin.

- Hosting in der EU (österreichisch/europäisch bevorzugt, Businessplan 2.1). HTTPS, CSP, keine Third-Party-Tracker.

- Content-Pflege: products.json, glossary.json, partners.json, sdgs.json sind ohne Deployment-Wissen editierbar (Validierung per JSON-Schema im CI; Fehler brechen den Build).

- Qualität: Lint-Regel für i18n-Strings (verbotene Wörter aus 2.3 und 2.4), Snapshot-Tests für PDF-Inhalt = Screen-State, E2E-Test für den kompletten Flow in \< 15 Minuten simulierter Nutzung.

- Browser: letzte zwei Versionen Chrome, Safari, Firefox, Edge; iOS Safari ≥ 16.

# 11. Offene Fragen & Entscheidungen

Zur Klärung vor bzw. während der Umsetzung. Vorschlag jeweils kursiv.

- Legal-Review der Lerntexte S4b (Zeit glättet Schwankungen) und S5 (Spektrum-Beispiele): Sind Aussagen wie „historisch häufig“ und drei feste Beispiel-Gewichtungen als Bildungsinhalt freigegeben? Vorschlag: **Texte an externe Anwältin, Freigabe vor MVP-Test**.

- Betragsverteilung im PDF (Betrag × Gewichtung): Rein rechnerisch auf Basis eigener Eingaben – **Legal bestätigen lassen, dass das keine Empfehlung darstellt**.

- SDG-Vorfilter im Explorer: Von der Userin gesetzt, sichtbar, abwählbar – **Legal bestätigen lassen (Vorschlag: ja, wie ein Shop-Filter).**

- Mix-Rückmeldung „ruhig/ausgewogen/mutig“ im Explorer: beschreibend zulässig? Falls nein: Feature-Flag, Rückmeldung nur als Prozentwerte.

- Quelle der Scores: ausschließlich Einstufungen lizenzierter Datenanbieter (Money:Care präferiert), angezeigt mit Anbieter und Stand, keine eigene Berechnung (Abschnitt 7.7). Offen: Lizenz- und Display-Rechte mit Money:Care vor dem MVP-Test schriftlich klären (bisher für Q1 2027 geplant – Zeitplan anpassen); Verantwortung für Methodik und Richtigkeit vertraglich beim Anbieter verankern; Display-Rechte EODHD vor Vertrag schriftlich klären.

- Kuratierte Produktliste: Wer stellt die 30–60 Produkte zusammen und nach welchen Kriterien (z. B. UCITS, Sparplan-fähig bei allen drei Brokern, TER ≤ 0,5 % bei ETFs, mind. Artikel 8 SFDR)? Vorschlag: Kriterienliste als Anhang, Auswahl durch Katharina mit externer Zweitmeinung.

- PDF-Erzeugung: clientseitig (kein Server, keine Daten verlassen den Browser) oder serverseitig (bessere Typografie, nötig für E-Mail-Anhang)? Vorschlag: serverseitig, da E-Mail-Versand ohnehin einen Endpoint braucht.

- Zwei Lebensphasen gewählt: Feedback und Zusammenfassung beide kurz.

- Englische Texte: Zeitpunkt der Übersetzung und ob EN-Glossar eigene Beispiele braucht.

# 12. Quellen & Referenzen

- Portemonnaie Brand Guidelines v1.2 (Mai 2026) – Abschnitte 04 Color palette, 05 Typography, 06 Visual elements, 07 Brand phrases, 08 Layout principles. Verbindlich für alle Design-Tokens in 5.6.

- Portemonnaie Finance, Businessplan v16, 24.08.2026 – insbesondere 2.1 (Fünf-Schritte-Flow), 2.4 (USP), 3.2 (Wirkungsmessung), 4.4 (Regulatorischer Rahmen), 5.2 (Partner), 5.3 (Erlösmodell).

- Anlage A, Portemonnaie Finance Prototyp (Juni 2026) – Screens Quiz, Archetyp, Explore, Basket, Execute; UX-Entscheidungen.

- Brand Voice & Corporate Identity v1.1 – Tonalität, Copy-Regeln, verbotene Formulierungen.

- Product Requirements: Quiz – 09-08-2026 (Vorgängerdokument, Flashcard-Texte und Seitenlogik übernommen).

- WAG 2018 § 1 Z 3 lit. e, § 3 Abs. 2; Delegierte Verordnung (EU) 2017/565 Art. 9; MiFID II; § 26 MedienG (Kennzeichnung Werbung); Art 20 MAR; Richtlinie (EU) 2024/825 (Empowering Consumers) i. V. m. UWG, anwendbar ab 27.09.2026. Verbindlich für alle Copy-Blöcke: Portemonnaie Leitlinien Finanzwerbung v2.0 (08.09.2026), insbesondere Begriffsampel G.6 und Regeln H.8, H.10–H.12.

- Statistikquellen der Flashcards (Primärquellen, Stand 10.09.2026; PDF/Download jeweils unter dem Link):

- Eurostat, Gender pay gap statistics (sdg_05_20, earn_gr_gpgr2ag), Euroraum 11,4 % (2024) – <https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Gender_pay_gap_statistics>

- WSI/Hans-Böckler-Stiftung, Lohnspiegel Berufseinstieg (18,7 %, DE), zitiert nach Eurofound, 17.01.2010 – <https://www.eurofound.europa.eu/en/publications/all/gender-pay-gap-shown-exist-even-start-career>

- Europäisches Parlament, Bericht A10-0021/2026 (Erwägung H), angenommen als P10_TA(2026)0074, PDF – <https://www.europarl.europa.eu/doceo/document/TA-10-2026-0074_EN.pdf>

- Kleven, Landais, Posch, Steinhauer, Zweimüller (2019), Child Penalties Across Countries, NBER WP 25524, PDF – <https://www.nber.org/system/files/working_papers/w25524/w25524.pdf>

- Eurostat, Part-time and full-time employment (lfsi_pt_a, lfsa_epgar), 2024 – <https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Part-time_and_full-time_employment_-_statistics>

- Europäische Kommission, COM(2022) 442 (EIGE: 7,7 Mio. Frauen) – <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:52022DC0442>

- Legal & General, The Divorce Gap, 07.02.2024 (UK-Umfrage, Sekundärquelle) – <https://group.legalandgeneral.com/newsroom/press-releases/2024/2/the-divorce-gap-women-see-their-household-income-drop-twice-as-much-as-men-following-divorce/>

- Leopold, T. (2018), Gender Differences in the Consequences of Divorce, Demography 55(3), SOEP – <https://link.springer.com/article/10.1007/s13524-018-0667-6>

- Conti, Ginja, Persson, Willage (2025), The Menopause "Penalty", NBER WP 33621 (SIEPR-Fassung) – <https://www.nber.org/papers/w33621> · PDF: <https://humcap.uchicago.edu/RePEc/hka/wpaper/Conti_Ginja_Persson_etal_2025_menopause_penalty.pdf>

- Eurostat, Gender pension gap 2024 (ilc_pnp13: 24,5 %; ilc_pnp13m: 24,9 %) – <https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20260225-1>

- OECD (2025), Pensions at a Glance 2025, Kap. Gender pension gap (22,8 vs. 18,6 Jahre), PDF – <https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/11/pensions-at-a-glance-2025_76510fe4/e40274c1-en.pdf>

# Anhang A · Prompt für Claude Code: glossary.json erzeugen

So verwenden: Repository öffnen, dieses PRD als Datei ablegen (z. B. docs/PRD.md oder .docx), dann den Prompt unten in Claude Code einfügen. Der Prompt referenziert die Abschnitte 2.3, 2.4, 5.2, 7.3 und 8.1 dieses Dokuments. Danach den Review-Schritt in A.2 durchführen – die Datei geht nicht ohne fachliche Prüfung durch Katharina und den Legal-Review (2.4) in den Produktionsbuild.

## A.1 Prompt (kopierfertig)

> Du bist Content-Engineer für Portemonnaie, eine Investment-Guidance-Plattform von Frauen für Frauen (Wien). Erzeuge die Datei data/glossary.json für das Hover-Glossar.
>
> KONTEXT (zuerst lesen, dann arbeiten):
>
> \- docs/PRD: Abschnitt 2.3 (Copy-Regeln), 2.4 (rechtliche Leitplanken), 5.2 (Popover-Struktur), 7.3 (JSON-Schema GlossaryTerm), 8.1 (Begriffsliste).
>
> AUFGABE:
>
> 1\. Erzeuge für JEDEN Begriff aus Abschnitt 8.1 (alle fünf Gruppen: Grundlagen, Bausteine, Kennzahlen & Dokumente, Wirkung, Wege) genau einen Eintrag nach dem Schema in 7.3. Fehlt ein Begriff, ist die Aufgabe nicht erledigt.
>
> 2\. Ergänze Begriffe, die in den Copy-Blöcken der Screens S2–S11 (Abschnitt 6) vorkommen und nicht in 8.1 stehen. Liste sie am Ende separat auf.
>
> 3\. Ausgabe: ein valides JSON-Array, UTF-8, alphabetisch nach id sortiert, Datei data/glossary.json. Zusätzlich data/glossary.schema.json (JSON Schema Draft 2020-12) zur Validierung.
>
> SCHEMA JE EINTRAG (aus 7.3, alle Felder Pflicht):
>
> id (kebab-case, ASCII, ohne Umlaute), term_de, term_en, aliases_de (Array, alle Schreibweisen, die im UI-Text vorkommen können, inkl. Plural und Abkürzung), definition_de, why_de, example_de, definition_en, why_en, example_en (englische Felder für den MVP als leerer String ""), relatedIds (1–3 ids, die existieren müssen).
>
> INHALTSREGELN (hart):
>
> \- definition_de: EIN Satz, max. 20 Wörter, beantwortet „Was ist das?“. Kein Fachwort im Satz, das selbst erklärungsbedürftig ist – oder es steht in relatedIds.
>
> \- why_de: EIN Satz, beginnt inhaltlich mit „Warum das für dich zählt“, nennt den konkreten Effekt, keine Moral.
>
> \- example_de: EIN Satz mit einer konkreten Zahl in Euro oder Prozent, Beträge realistisch für Anfängerinnen (25–500 € monatlich, 500–10.000 € einmalig). Rechenbeispiele als Beispiel gekennzeichnet; Renditeannahmen nur mit Zusatz „Annahme, keine Garantie“ und nie über 5 % p. a.
>
> \- Ton: warm, direkt, „du“, wie eine informierte Freundin, die Jura und Finanzen versteht. Nie wie eine Bank, ein Startup oder eine Kampagne.
>
> \- Verboten: „noch nicht“, „endlich“, „du musst“, „du solltest“, „du hast verpasst“, „fehlt“, „seamless“, „frictionless“, „intuitiv“, „einfach“ als Beschwichtigung, Superlative, Ausrufezeichen.
>
> \- Verboten (Recht, siehe 2.4): „empfehlen“, „raten“, „passt zu dir“, „optimal“, „ideal für dich“, „sicher“ im Sinne von garantiert, jede Aussage über künftige Rendite, jede Bewertung eines konkreten Produkts oder Anbieters. Erlaubt: „so funktioniert“, „typischerweise“, „viele Anlegerinnen“.
>
> \- Problem im System verorten, nie in der Frau. Statt „Frauen investieren zu wenig“ → „Das System macht Frauen den Einstieg schwer“.
>
> \- Bei Begriffen der Gruppe „Wirkung“: keine ESG-Floskeln ohne Substanz. Sag, was gemessen wird und woher die Daten kommen (Abschnitt 7.7).
>
> \- „Robo-Advisor“ bekommt einen Eintrag, term_de bleibt „Robo-Advisor“, in definition_de wird der Begriff „geführter Anlageprozess“ als unser Wort eingeführt.
>
> \- Rechtschreibung: österreichisches Deutsch (Pension statt Rente, Karenz statt Elternzeit, Depot statt Wertpapierkonto).
>
> QUALITÄTSSICHERUNG (selbst ausführen, Ergebnis berichten):
>
> a\) Schema-Validierung gegen glossary.schema.json – 0 Fehler.
>
> b\) Lint-Skript scripts/lint-glossary.mjs schreiben und laufen lassen: prüft Wortzahl ≤ 20 in definition_de, genau ein Satz in definition_de/why_de/example_de, Zahl vorhanden in example_de, keine verbotenen Wörter (Liste oben als Konstante), alle relatedIds existieren, ids eindeutig, alle 8.1-Begriffe abgedeckt.
>
> c\) Gib eine Tabelle aus: id · Wortzahl definition_de · Lint-Status. Danach die Liste der Begriffe aus Schritt 2.
>
> d\) Erzeuge docs/glossary-review.md: alle Einträge lesbar untereinander (Term, Definition, Warum, Beispiel), damit Katharina ohne JSON-Kenntnis reviewen kann.
>
> ARBEITSWEISE: Erst 5 Einträge (etf, ter, isin, depot, sdg) ausgeben und auf Freigabe warten. Dann alle weiteren. Keine Erklärungen zwischendurch, keine Rückfragen zu Dingen, die im PRD stehen.

## A.2 Review-Schritte nach der Generierung

- Katharina liest docs/glossary-review.md vollständig (ca. 20 Minuten für 45 Einträge). Prüffragen je Eintrag: Stimmt es fachlich? Klingt es nach uns? Würde meine Freundin ohne Finanzwissen es verstehen?

- Korrekturen direkt in glossary.json, danach Lint erneut laufen lassen. Änderungen per Git-Commit, damit der Legal-Review auf einem festen Stand arbeitet.

- Legal-Review (externe Anwältin, Meilenstein 15.11.2026) bekommt glossary-review.md, nicht das JSON. Fokus: Einträge der Gruppen „Wirkung“ und „Wege“ sowie alle Beispiele mit Zahlen.

- Englische Felder bleiben im MVP leer. Übersetzung erst nach Freigabe der deutschen Fassung, dann mit gleichem Prompt und Zusatz „übersetze in britisches Englisch, behalte Zahlen und Ton“.

- Nach Freigabe: Kommentar an 5.2 („noch zu erstellen“) auflösen und in Abschnitt 11 den Punkt Glossar als erledigt markieren.

## A.3 Erwarteter Umfang

Aus 8.1 ergeben sich 48 Pflichtbegriffe; mit Ergänzungen aus den Screen-Texten realistisch 50–60 Einträge. Aufwand Claude Code: unter 10 Minuten. Aufwand Review: 20–30 Minuten Katharina, ca. 1 Stunde Legal.
