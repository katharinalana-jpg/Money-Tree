# Übergabeprotokoll: Wöchentliche Newsletter-Ausgaben im Archiv

Version 1.26110803, Stand 8. November 2026. Für jede Session, in der eine neue Ausgabe auf die Website kommt und als Teaser-Mail über Brevo hinausgeht. Ersetzt die Fassung 1.26110309 vom 3. November 2026.

Reihenfolge zum Einlesen:
1. `CLAUDE.md` im Drive-Ordner `01_Portemonnaie Website_15.10.2026` (harte Arbeitsregeln, gelten immer).
2. Dieses Protokoll.
3. `AENDERUNGEN Website.md` im selben Drive-Ordner (jede Runde mit Version, Datum, Änderung, Commit).
4. `newsletter/template.html`, `newsletter/build_issue.py`, `email/build_teaser.py`, `archive.html` und die Live-Ausgabe `newsletter/2026-11-02-was-tut-mein-geld.html` im Projekt.
5. Memory: `arbeitsregeln-ks`, `newsletter-weekly-workflow`, `aenderungen-website-log`, `branch-from-main-only`, `preview-server-workaround`.

## 1. Arbeitsregeln (gelten immer, Wortlaut der Auftraggeberin vom 2. November 2026, Regel 20 vom 3. November 2026)

GRUNDSATZ
1. Erst messen, dann bauen. Keine geratenen Zahlen. Bei „geht nicht" zuerst die eigene Rechnung prüfen.
2. Nichts ungefragt bauen. Fehlendes Go heißt: fragen, nichts anfassen. „Mach bei X weiter" ist kein Go für Änderungen an Y.
3. Funktionierenden Code nie auf Verdacht umbauen oder zurückbauen. Gerätetests schlagen Vermutungen.
4. Riskante Änderungen einzeln und nur mit Go. Vorher einen getesteten Stand committen, damit ein Rückweg ein Befehl ist.
5. Was kritisch ist (z. B. Bild-Pipeline), explizit warnen, bevor etwas daran gefährdet wird.

ABLAUF
6. Jede Runde bekommt eine neue Versionsnummer (Schema 1.JJMMTTnn) und Claude nennt sie.
7. Nach jeder Runde: bauen, Erfolg wirklich prüfen (nicht raten), committen, kurz berichten: was gebaut, was getestet, was offen ist.
8. Apps nie selbst starten oder aufs Gerät installieren. Das macht die Auftraggeberin. Nie auf ihr Gerät schreiben, nur lesen.
9. Tests nie gegen echte Daten oder Einstellungen laufen lassen, nur auf Kopien.
10. Vor allem, was Daten löschen könnte (App neu installieren, Dateien entfernen): vorher warnen.
11. Befehle für die Auftraggeberin immer als eigenen Code-Block mit vollem Pfad, damit sie sie mit einem Klick ausführen kann.

PLATTFORMEN
12. Das iPhone ist der Maßstab. Mac und iPad passen sich an, das iPhone bleibt unberührt.
13. Jede Mac-Neuerung aufs iPad mitdenken, aber vorher fragen.

SPRACHE UND STIL
14. Mit der Auftraggeberin Deutsch, Code-Kommentare Deutsch. Alles, was Nutzer sehen (App, Website, TestFlight): immer Englisch. Website-Texte liegen zusätzlich in DE und FR vor und werden 1:1 von der Auftraggeberin geliefert.
15. Keine Gedankenstriche (em dashes). Sätze umstellen.
16. Keine Tageszeiten oder Dauern („seit Wochen", „heute Abend"), nur datierte Fakten.
17. Kurz und konkret antworten. Bei Entscheidungen eine Empfehlung geben, nicht alle Optionen aufzählen.

GEDÄCHTNIS
18. Die Projektdatei `CLAUDE.md` mit den harten Regeln liegt im Drive-Ordner `01_Portemonnaie Website_15.10.2026`. Wichtige Befunde und Entscheidungen hält Claude in seinem Memory fest, mit Datum.
19. Wenn Claude einen Fehler gemacht hat: als Regel ins Memory, damit er nicht wieder passiert.
20. Jede Runde wird in `AENDERUNGEN Website.md` im Drive-Ordner eingetragen: Runde, Version, Datum, Session/Thema, was geändert, Commit, Stand. Neueste Runde oben, Eintrag vor dem Bericht.

Ergänzung für die Website (weiterhin gültig): Vorschau zeigen, auf OK warten, dann pushen. Push auf `main` ist live. „OK zum Push" bedeutet: Branch pushen und `main` per Fast-Forward nachziehen. Texte 1:1 übernehmen, Bilder 1:1 (nur verkleinern, WebP). Keine Emojis. Farben und Schriften nur über die CSS-Variablen in `styles.css`. Arbeitsbranches immer von `main` abzweigen, nie von einem anderen Branch (Korrektur vom 3. November 2026). Die Website ist fertig: keine kosmetischen Änderungen ohne ausdrücklichen Auftrag.

## 2. Wo wir stehen (Stand 8. November 2026)

- Projekt `/Users/ks/Documents/FemTech/Money-Tree`, live auf portemonnaie.finance über Vercel. `main` = `232d494` (8. November 2026, Runde 1.26110802). Cache-Version in allen HTML-Dateien: `?v=126`.
- Arbeitsbranch `content` existiert lokal und auf GitHub, steht auf `main`.
- **Ausgabe 01 ist live:** `newsletter/2026-11-02-was-tut-mein-geld.html` (DE/EN/FR, Datum 2. November 2026), Bild `img/newsletter/2026-11-02-was-tut-mein-geld.webp` (1700 × 957).
- **Archiv ist freigeschaltet:** `archive.html` ist überall verlinkt (Menü, Footer, „Zum Archiv" auf der Startseite) und indexierbar. `archive-soon.html` bleibt bestehen, hat `noindex`, ihre Navigation zeigt auf `archive.html`.
- Archiv-Kacheln: Kachel 1 = Ausgabe 01 mit Bild und Link. Kacheln 2 und 3 sind Platzhalter mit Bild, aber ohne Link (seit 8. November 2026): „Up Next: Was ist Impact Investing" / „Up Next: What Is Impact Investing" (Rubrik „Newsletter / Impact", Bild `img/newsletter/was-ist-impact-investing.webp`) und „Up Next: 4 finanzielle Fallen für Frauen" / „Up Next: 4 Financial Pitfalls for Women" (Rubrik „Newsletter / Inklusion", Bild `img/newsletter/4-finanzielle-fallen-fuer-frauen.webp`). Englische Kacheltitel in Title Case. Wenn die Ausgabe erscheint: Bild auf `JJJJ-MM-TT-kurztitel.webp` umbenennen (`git mv`), Kachel verlinken, „Up Next: " entfernen.
- Teaser-Mail: `email/build_teaser.py` baut pro Ausgabe die Brevo-Vorlage (Abschnitt 5, Schritt 7). Ausgabe 01: Mail am 8. November 2026 eingerichtet.
- Footer im Archiv = Footer der Startseite (`footer4`: Claim, Tänzerinnen, Social, Formular). Footer der Ausgabenseiten = schlichter Footer mit Menü (bleibt so, Entscheidung 3. November 2026).
- Quellen außerhalb des Repos: Drive-Ordner `/Users/ks/Library/CloudStorage/GoogleDrive-office@portemonnaie.finance/Meine Ablage/Portemonnaie_Finance/04_CMO_Portemonnaie/04A_Portemonnaie_CMO_Design_Corporate Identity/01_Portemonnaie Website_15.10.2026/` (`CLAUDE.md`, `AENDERUNGEN Website.md`, `DESIGN.md`, `PROMPT_Website-Neuaufbau.md`, `BILDER_UEBERSICHT.md`, Übergaben, Bildordner). Die Ausgaben liegen in `…/04B_Portemonnaie_CMO_Content/01_Newsletter/01_Newsleter Editions/01_FINAL/` als Docx.

## 3. Gestaltung der Ausgabenseite (Entscheidungen der Auftraggeberin vom 3. November 2026)

Alles in `styles.css`, Abschnitt `.issue-article`. Nicht ohne Go ändern.
- Kein Bild auf der Ausgabenseite. Das Headerbild ist nur Kachelbild im Archiv.
- Titel 56 px Newsreader, zentriert. Untertitel (`.issue-article__subtitle`) 30 px Newsreader, zentriert.
- Datumszeile: „Portemonnaie · 2. November 2026" (EN „2 November 2026", FR „2 novembre 2026"), Versalien, ohne „Von".
- Zwischenüberschriften (`.issue-article__heading`): Newsreader 24 px, nicht fett, keine Versalien, linksbündig.
- Fließtext linksbündig, keine Silbentrennung, keine Blocksatz. Absätze direkt hintereinander: 8 px Abstand. Wo im Word eine Leerzeile steht: 28 px (`.issue-article__gap`). Nach einer Zwischenüberschrift einheitlich 12 px.
- Kursiv aus dem Word als `<em>`, Fett als `<strong>`, Hyperlinks als `<a target="_blank" rel="noopener">`.
- Papierhintergrund `body.paper` mit `img/papier.webp` (2000 × 2800, seit 13. Oktober 2026 im Repo).

## 4. Was die Auftraggeberin pro Ausgabe liefert

1. Die Docx mit Word-Formatvorlagen, so wie Ausgabe 01: **Überschrift 1** = Titel, direkt danach **Überschrift 2** = Untertitel, **Überschrift 3** = Zwischenüberschriften, alles andere = Fließtext. Reihenfolge der Sprachen EN, DE, FR; optional davor eine Markerzeile („EN 02.11.2026") in Überschrift 1. Kursiv, Fett und Hyperlinks im Word werden übernommen. Leerzeilen im Word steuern die Absatzabstände.
2. Erscheinungsdatum.
3. Rubrikzeile für die Kachel (z. B. „Newsletter / Impact"), bei Bedarf je Sprache.
4. Headerbild im Original (Querformat, Breite ab 1700 px) als Dateipfad. Nur für die Kachel.
5. Optional ein Kurztitel für den Dateinamen, sonst aus dem deutschen Titel gebildet.
6. Optional die Titel der nächsten „Up Next"-Kacheln.

7. Für die Teaser-Mail nichts Zusätzliches: Betreff = Titel der Ausgabe, Teaser = Untertitel und erster Absatz der Ausgabe, 1:1. Will sie einen eigenen Teaser, schickt sie ihn in der Nachricht in drei Sprachen; er ersetzt dann den ersten Absatz (`--teaser-de/-en/-fr`).

Fehlt etwas: fragen, nichts erfinden, nichts übersetzen (Regel 2). Ausnahme: Die Auftraggeberin hat am 3. November 2026 ausdrücklich Übersetzungen der „Up Next"-Kacheltitel beauftragt. Tippfehler im Text bleiben 1:1 und werden im Bericht genannt.

**Der Generator verändert den Text nie, er baut ihn nur nach** (Festlegung vom 8. November 2026). Erlaubt sind genau zwei typografische Korrekturen: doppelte Leerzeichen zu einem und gerades Apostroph `'` zu `’`. Sonst nichts, auch keine Gedankenstriche (bis 8. November 2026 wurde „ - " zu „ – " gemacht; in Ausgabe 01 live steht das an drei Stellen so). Änderungen am Text macht ausschließlich die Auftraggeberin in der Docx.

## 5. Ablauf pro Ausgabe

Jede Ausgabe ist eine Runde mit eigener Versionsnummer (Regel 6). Arbeitsbranch `content`: vorher `git fetch`, prüfen, dass `content` auf `origin/main` steht, sonst `content` von `main` neu abzweigen.

1. **Bild messen und wandeln.** `sips -g pixelWidth -g pixelHeight ORIGINAL`, dann
   `cwebp -q 82 -resize 1700 0 ORIGINAL -o img/newsletter/JJJJ-MM-TT-kurztitel.webp`. Ergebnismaße messen, sie kommen in `width`/`height` der Kachel.
2. **Seite erzeugen:**
   `python3 -I newsletter/build_issue.py --docx "PFAD/Ausgabe.docx" --date JJJJ-MM-TT --slug kurztitel`
   schreibt `newsletter/JJJJ-MM-TT-kurztitel.html` aus `newsletter/template.html`. Ausgabe des Skripts lesen: Titel, Zahl der Absätze und Zwischenüberschriften je Sprache müssen zur Docx passen. Danach die Seite mit der Docx vergleichen: alle Zwischenüberschriften, alle Kursiv- und Fett-Stellen, alle Links (`grep -o '<em>[^<]*</em>' …`). Bricht das Skript ab, hat die Docx eine andere Struktur: zuerst die Absätze mit Stil und Runs ausgeben (Skript `read_docx`), nichts raten.
   Meta-Description: Standard ist „Portemonnaie Newsletter: {deutscher Untertitel}.", sonst `--description`.
3. **Kachel im Archiv:** in `archive.html` oben in `<ul class="archive__grid">` einfügen, neueste zuerst. Vorlage ist Kachel 1. Wenn die Ausgabe eine bestehende „Up Next"-Kachel einlöst: diese Kachel ersetzen, Titel und Rubrik der echten Ausgabe setzen, Bild und Links (`<a class="issue__media" …>` und `<a>` um den Titel) hinzufügen. Platzhalter-Kacheln bleiben ohne `<a>` (nicht anklickbar), mit `<div class="issue__media" aria-hidden="true"></div>` als leerer Fläche.
   ```html
   <li class="issue">
     <a class="issue__media" href="newsletter/JJJJ-MM-TT-kurztitel.html" tabindex="-1" aria-hidden="true"><img src="img/newsletter/JJJJ-MM-TT-kurztitel.webp" alt="" width="…" height="…" loading="lazy" /></a>
     <p class="issue__label"><span data-lang-content="de">Newsletter / Rubrik</span><span data-lang-content="en">Newsletter / Topic</span><span data-lang-content="fr">Newsletter / Rubrique</span></p>
     <h2 class="issue__title"><a href="newsletter/JJJJ-MM-TT-kurztitel.html"><span data-lang-content="de">Titel DE</span><span data-lang-content="en">Titel EN</span><span data-lang-content="fr">Titel FR</span></a></h2>
   </li>
   ```
   Kachel 424 × 224 mit `object-fit: cover`, Querformat wird mittig beschnitten. Drei Kacheln pro Reihe; am Handy untereinander.
4. **Prüfen (Regel 7, nicht raten):** Server starten (Abschnitt 7). `http://localhost:8082/archive.html` und die neue Seite jeweils mit `?lang=de`, `?lang=en`, `?lang=fr`: sichtbarer Block passt zur Sprache, Tab-Titel, Kachelbild lädt (naturalWidth > 0), Datum, Zwischenüberschriften, Kursiv, Links, Breite 375 px ohne horizontalen Überlauf (`document.documentElement.scrollWidth` = 375). Screenshots an die Auftraggeberin, Adresse nennen (sie sieht dieselbe Adresse in ihrem Browser).
5. **Commit** auf `content`, Nachricht z. B. `Newsletter 2026-11-09: Titel (DE/EN/FR), v1.26110901`. Vorher prüfen, dass der Branch `content` ist. Eintrag in `AENDERUNGEN Website.md` (Regel 20). Bericht: gebaut, getestet, offen. Auf Go warten.
6. **Live nach Go:** `git push origin content`, dann `git checkout main && git merge --ff-only content && git push origin main`, zurück auf `content`. Deploy-Status: `gh api "repos/{owner}/{repo}/deployments?environment=Production&per_page=3" --jq '.[] | "\(.id) \(.sha[0:7]) \(.created_at)"'`, dann `gh api "repos/{owner}/{repo}/deployments/ID/statuses" --jq '.[0].state'`. Das Deploy erscheint wenige Sekunden nach dem Push. Dann die Live-Seite im App-Browser öffnen (curl wird von Vercel blockiert) und Archiv und Ausgabe in drei Sprachen aufrufen. Danach in `AENDERUNGEN Website.md` die Spalte „Stand" der Runden auf „main, live seit …" setzen.

7. **Teaser-Mail in Brevo (nach dem Go-live der Seite, Festlegung vom 8. November 2026):** keine API, kein Schlüssel. Die Auftraggeberin ist im App-Browser bei Brevo angemeldet (Claude tippt nie Zugangsdaten).
   a. `python3 -I email/build_teaser.py --issue newsletter/JJJJ-MM-TT-kurztitel.html` schreibt `email/teaser/JJJJ-MM-TT-kurztitel.html` (eine Vorlage, DE/EN/FR über `contact.LANGUAGE`), `.subject.txt` und `preview-de/en/fr.html`. Vorschau unter `http://localhost:8082/email/teaser/preview-de.html` prüfen (Bilder laden, Button-Link zeigt auf die Live-Ausgabe mit `?lang=`, 375 px ohne Überlauf).
   b. In Brevo: Kampagnen → E-Mail → neue Kampagne (oder letzte Teaser-Kampagne duplizieren). Name `Newsletter JJJJ-MM-TT Kurztitel`. Betreff aus `.subject.txt` (Brevo-Sprachlogik), Absender wie die Bestätigungs-Mail. Design: Code-Editor, Inhalt von `email/teaser/JJJJ-MM-TT-kurztitel.html` einfügen. Empfänger: Liste 4 (bestätigte Anmeldungen).
   c. Testmail an die Auftraggeberin. Sie prüft am iPhone (Regel 12) und klickt selbst „Planen": Sonntag 10:00 Europe/Vienna. Brevo versendet dann automatisch.
   d. Eintrag in `AENDERUNGEN Website.md` (Kampagnenname, Termin). Vorplanen mehrerer Ausgaben geht genauso, Bedingung: Die Ausgabenseite ist zum Versandtermin live.

Nur bei Änderungen an `styles.css`, `i18n.js` oder `script.js`: `?v=` in allen HTML-Dateien erhöhen (`find . -name '*.html' -exec sed -i '' 's/?v=124/?v=125/g' {} +`). Eine neue Ausgabe allein braucht keinen Bump.

## 6. Ausgabe 01, Besonderheiten

- Die PS-Zeile wurde am 3. November 2026 nach einer Nachricht der Auftraggeberin manuell ersetzt (Aufzählung ohne „zu der unter anderem … gehören", Satz in allen drei Sprachen kursiv, EN ohne Punkt am Ende). Die Docx im FINAL-Ordner hat noch den alten Wortlaut. Wird Ausgabe 01 je aus der Docx neu erzeugt, die PS-Zeile aus der Live-Seite übernehmen oder die Docx vorher korrigieren lassen.
- Der englische Untertitel steht in der Docx mit führendem Spiegelstrich („- What a bank …"); der Generator entfernt ihn.
- Datum 2. November 2026 (ein Montag) wie in der Docx. Der Hinweis „sonntags 10:00" steht nur auf `archive-soon.html`.
- Bekannte Tippfehler im gelieferten Text, 1:1 belassen: DE „bpsw", „Websiten", „wo anders"; FR „entreprises européenne", „ONGs".

## 7. Technik

- **Vorschau-Server:** Der eingebaute Vorschau-Server der App darf nicht auf „Documents" zugreifen. Per Bash im Hintergrund:
  `python3 -m http.server 8082 --bind 127.0.0.1 --directory /Users/ks/Documents/FemTech/Money-Tree`
  oder ein kleiner Server mit `Cache-Control: no-store` im Scratchpad. Dann `preview_start` mit `landing-attach` und im App-Browser `http://localhost:8082/…`. Höchstens vier bis fünf Screenshots pro Aufruf. Handy-Ansicht über `resize_window` Preset `mobile`, Desktop über `width 1440, height 900`, danach `desktop` zurücksetzen. Scrollen zum Prüfen per `scrollTo({top, behavior: 'instant'})`, die Seite hat `scroll-behavior: smooth`.
- **Sprachen:** `i18n.js` setzt `<html lang>` aus `?lang=`, sonst aus `localStorage` (`pm_lang`), sonst Browser. Blöcke mit `data-lang-content="de|en|fr"` zeigt das CSS nur für die passende Sprache. Seitentitel pro Sprache über `data-lang-title-de/en/fr`. Menü, Footer, Formulare aus den Wörterbüchern in `i18n.js`. Sichtbarkeit im Test über `getClientRects().length > 0` prüfen, nicht über `display` des Kindelements.
- **Bild-Pipeline (kritisch, Regel 5):** `cwebp`/`dwebp` installiert, ImageMagick und Pillow nicht. `sips` misst und skaliert. Bestehende Bilder in `img/` nie überschreiben oder neu komprimieren; neue Ausgabenbilder nur in `img/newsletter/`.
- **Docx lesen:** `textutil -convert txt` zeigt nur den Text. Formatvorlagen, Kursiv, Fett und Links stehen in `word/document.xml` (Runs `w:r` mit `w:rPr/w:b`, `w:i`, Hyperlinks `w:hyperlink` mit `r:id` auf `word/_rels/document.xml.rels`). `newsletter/build_issue.py` liest genau das; Python ohne Zusatzpakete.
- **Vercel:** Attack Challenge Mode blockt curl; Preview-URLs brauchen Vercel-Login. Deploy-Status über `gh api`, nicht raten.
- **Brevo:** Versand als normale Brevo-Kampagne pro Ausgabe, im Voraus planbar, ohne API. Kontakte tragen das Attribut LANGUAGE (EN/DE/FR, setzt `api/subscribe.js`), die Vorlage schaltet drei Blöcke darüber, EN ist der Rückfall. Abmeldelink über den Brevo-Platzhalter `{{ unsubscribe }}`. Bilder liegen in der Brevo-Mediathek (URLs in `IMAGES_BREVO` in `email/build_teaser.py`; Logo-Kopf `email/img/head-logo.png` = obere 116 px des Kopfs der Bestätigungs-Mail). Kein Titelbild in der Mail. Die Bestätigungs-Mail (Double Opt-in) baut `email/build_email.py`, Brevo-Vorlage #5.

## 8. Offene Punkte (Stand 8. November 2026)

- Datumssperre für vorgeplante Ausgaben (Kachel und Seite erst ab Erscheinungsdatum sichtbar): nur bauen, wenn die Auftraggeberin Ausgaben im Voraus plant und das wünscht.
- Ausgabe 01 live: an drei Stellen „ – " statt „ - " wie in der Docx (alte Generator-Regel). Angleichen nur mit Go.

- Social-Links (Bluesky, Substack, LinkedIn) sind Platzhalter auf die Plattform-Startseiten.
- Rechtstexte: FR zeigt EN; juristische Prüfung steht aus.
- Hero-Foto in Originalauflösung, Wikimedia-Lizenzen prüfen.
- Zustimmungs-Checkbox im Footer-Formular: Entscheidung offen.
- Veralteten Branch `redesign-canva` löschen (lokal und GitHub), nur mit Go.
- `CLAUDE.md` im Repo: Ordnerstruktur ist veraltet (kein `newsletter/`, `fonts/`, `email/`), nur mit Go.
- Danach: Rechner, Quiz und Explorer im neuen Design neu bauen (alter Code auf `develop` und Tag `landing-v1`).
