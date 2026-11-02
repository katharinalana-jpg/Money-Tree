# Übergabeprotokoll: Wöchentliche Newsletter-Ausgaben im Archiv

Version 1.26110201, Stand 2. November 2026. Für die nächste Session, in der jede Woche eine neue Ausgabe auf die Website kommt.

Reihenfolge zum Einlesen:
1. `CLAUDE.md` im Drive-Ordner `01_Portemonnaie Website_15.10.2026` (harte Arbeitsregeln, gelten immer).
2. Dieses Protokoll.
3. `newsletter/template.html` und `archive.html` im Projekt.
4. Memory: `arbeitsregeln-ks`, `newsletter-weekly-workflow`, `redesign-canva-project`, `preview-server-workaround`.

## 1. Arbeitsregeln (gelten immer, Wortlaut der Auftraggeberin vom 2. November 2026)

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
14. Mit der Auftraggeberin Deutsch, Code-Kommentare Deutsch. Alles, was Nutzer sehen (App, Website, TestFlight): immer Englisch.
15. Keine Gedankenstriche (em dashes). Sätze umstellen.
16. Keine Tageszeiten oder Dauern („seit Wochen", „heute Abend"), nur datierte Fakten.
17. Kurz und konkret antworten. Bei Entscheidungen eine Empfehlung geben, nicht alle Optionen aufzählen.

GEDÄCHTNIS
18. Eine Projektdatei (CLAUDE.md) mit den harten Regeln liegt im Ordner `01_Portemonnaie Website_15.10.2026`. Wichtige Befunde und Entscheidungen hält Claude in seinem Memory fest, mit Datum.
19. Wenn Claude einen Fehler gemacht hat: als Regel ins Memory, damit er nicht wieder passiert.

Ergänzung für die Website (aus den Sessions seit 7. Oktober 2026, weiterhin gültig): Vorschau zeigen, auf OK warten, dann pushen. Push auf `main` ist live. Ein „OK zum Push" nach dem Launch bedeutet: Branch pushen und `main` nachziehen. Texte 1:1 übernehmen, Bilder 1:1 (nur verkleinern, WebP). Keine Emojis. Farben und Schriften nur über die CSS-Variablen in `styles.css`. Hinweis zu Regel 14: Die Website ist dreisprachig DE/EN/FR, alle drei Fassungen werden 1:1 von der Auftraggeberin geliefert.

## 2. Wo wir stehen (Stand 2. November 2026)

- Projekt `/Users/ks/Documents/FemTech/Money-Tree`, live auf portemonnaie.finance über Vercel.
- `main` = `67eeb59` (14. Oktober 2026) = `cosmetics-desktop` plus ein lokaler Commit mit diesem Protokoll. `redesign-canva` ist veraltet. Cache-Version in allen HTML-Dateien: `?v=120`.
- Die erste Newsletter-Ausgabe ist fertig geschrieben (liegt bei der Auftraggeberin), noch nicht auf der Website.
- `archive.html` existiert fertig im Design, ist unverlinkt und `noindex`. Die drei Kacheln darin sind Platzhalter und zeigen auf `newsletter/template.html`. Alle „Archiv"-Links der Website und „Zum Archiv" auf der Startseite zeigen auf `archive-soon.html`.
- Erscheinungstermin der Ausgaben: Sonntag, 10:00 Uhr (Angabe auf archive-soon.html in drei Sprachen).
- Quellen außerhalb des Repos: Drive-Ordner `/Users/ks/Library/CloudStorage/GoogleDrive-office@portemonnaie.finance/Meine Ablage/Portemonnaie_Finance/04_CMO_Portemonnaie/04A_Portemonnaie_CMO_Design_Corporate Identity/01_Portemonnaie Website_15.10.2026/` mit `DESIGN.md`, `PROMPT_Website-Neuaufbau.md`, `BILDER_UEBERSICHT.md`, Bildordnern und den Übergaben.

## 3. Was die Auftraggeberin pro Ausgabe liefert

Als Text in der Nachricht oder als Datei (docx, pdf, md) je Sprache:
1. Erscheinungsdatum.
2. Rubrikzeile für die Kachel in drei Sprachen (z. B. „Newsletter / Werte", „Newsletter / Values", „Newsletter / Valeurs").
3. Titel in drei Sprachen.
4. Fließtext in drei Sprachen, Zwischenüberschriften markiert.
5. Headerbild im Original (Querformat, Breite ab 1700 px). Dasselbe Bild wird Kachelbild im Archiv.
6. Optional ein Kurztitel für den Dateinamen, sonst aus dem deutschen Titel gebildet.

Fehlt etwas: fragen, nichts erfinden, nichts übersetzen (Regel 2).

## 4. Ablauf pro Ausgabe

Jede Ausgabe ist eine Runde mit eigener Versionsnummer (Regel 6). Arbeitsbranch `content`, von `main` abgezweigt.

1. **Bild messen und wandeln.** Maße des Originals mit `sips -g pixelWidth -g pixelHeight` lesen. Dann nach `img/newsletter/JJJJ-MM-TT-kurztitel.webp`:
   `cwebp -q 82 -resize 1700 0 ORIGINAL -o img/newsletter/JJJJ-MM-TT-kurztitel.webp`. Ergebnismaße wieder messen und in `width`/`height` eintragen.
2. **Seite anlegen:** `cp newsletter/template.html newsletter/JJJJ-MM-TT-kurztitel.html`. Ersetzen:
   - `<title data-lang-title-de/en/fr>`: drei Titel plus „ – Portemonnaie".
   - `<meta name="description">`: ein Satz.
   - Drei `<header class="issue-article__head" data-lang-content="de|en|fr">`: Titel und Datumszeile mit `<time datetime="JJJJ-MM-TT">`, Datum ausgeschrieben („12. Oktober 2026", „12 October 2026", „12 octobre 2026").
   - `<figure class="issue-article__figure">`: `src="../img/newsletter/….webp"`, `width`, `height`, kurzer `alt`.
   - Drei `<div class="issue-article__body" data-lang-content="de|en|fr">`: Absätze als `<p>`, Zwischenüberschriften als `<h2 class="issue-article__heading">`. Typografische Anführungszeichen („…" / “…” / « … »), Halbgeviertstrich mit Leerzeichen, keine doppelten Leerzeichen.
   - Pfade `../styles.css?v=NNN` und `../fonts/fonts.css?v=1` wie in der Vorlage lassen.
3. **Kachel im Archiv:** in `archive.html` oben in `<ul class="archive__grid">` einfügen (neueste zuerst):
   ```html
   <li class="issue">
     <a class="issue__media" href="newsletter/JJJJ-MM-TT-kurztitel.html" tabindex="-1" aria-hidden="true"><img src="img/newsletter/JJJJ-MM-TT-kurztitel.webp" alt="" width="…" height="…" loading="lazy" /></a>
     <p class="issue__label"><span data-lang-content="de">Newsletter / Rubrik</span><span data-lang-content="en">Newsletter / Topic</span><span data-lang-content="fr">Newsletter / Rubrique</span></p>
     <h2 class="issue__title"><a href="newsletter/JJJJ-MM-TT-kurztitel.html"><span data-lang-content="de">Titel DE</span><span data-lang-content="en">Titel EN</span><span data-lang-content="fr">Titel FR</span></a></h2>
   </li>
   ```
   Kachel 424 × 224 mit `object-fit: cover`, Querformat wird mittig beschnitten.
4. **Prüfen (Regel 7, nicht raten):** Server starten (Abschnitt 6). `http://localhost:8082/archive.html` und die neue Seite jeweils mit `?lang=de`, `?lang=en`, `?lang=fr`: sichtbarer Block passt zur Sprache, Tab-Titel, Bild lädt (naturalWidth > 0), Datum, Umbrüche, Breite 375 px ohne horizontalen Überlauf (`document.documentElement.scrollWidth` = 375). Screenshots an die Auftraggeberin.
5. **Commit** auf `content`, Nachricht z. B. `Newsletter 2026-11-09: Titel (DE/EN/FR), v1.26110901`. Bericht: gebaut, getestet, offen. Auf Go warten.
6. **Live nach Go:** Branch pushen, `main` fast-forwarden, pushen. Deploy-Status: `gh api "repos/{owner}/{repo}/deployments?environment=Production&per_page=1"` und `/deployments/ID/statuses`. Dann die Live-Seite im App-Browser öffnen (curl wird von Vercel blockiert) und die Ausgabe in drei Sprachen aufrufen.

## 5. Nur bei der ersten Ausgabe: Archiv freischalten

Das ist eine eigene Runde mit eigenem Go (Regel 4), getrennt vom Einstellen der Ausgabe.
1. Die drei Platzhalter-Kacheln in `archive.html` löschen, die echte Kachel einsetzen.
2. `<meta name="robots" content="noindex" />` in `archive.html` entfernen.
3. Links von `archive-soon.html` auf `archive.html` umstellen. Fundstellen (Stand 2. November 2026): `index.html` (Menü und „Zum Archiv" unter dem Formular), `about.html`, `collabs.html`, `coming-soon.html`, `impressum.html`, `privacy.html`, `confirmed.html`, `archive.html` (Footer-Menü), `newsletter/template.html` (zweimal, mit `../`). Kontrolle: `grep -rn 'archive-soon.html' --include='*.html' .` darf danach nur noch `archive-soon.html` selbst treffen.
4. `archive-soon.html` behalten, mit `noindex` versehen, deren eigene Navigation auf `archive.html` zeigen lassen.
5. Vor dem Löschen von Dateien warnen (Regel 10). Hier wird nichts gelöscht.

## 6. Technik

- **Vorschau-Server:** Der eingebaute Vorschau-Server der App darf nicht auf „Documents" zugreifen. Per Bash im Hintergrund:
  `python3 -m http.server 8082 --directory /Users/ks/Documents/FemTech/Money-Tree`
  oder das `serve.py` aus dem Scratchpad (liefert ohne Cache). Dann im App-Browser `http://localhost:8082/…`. Höchstens vier bis fünf Screenshots pro Aufruf, sonst werden Bilder verworfen. Handy-Ansicht über `resize_window` Preset `mobile`, danach `desktop` zurücksetzen. Die Auftraggeberin sieht die Seite in ihrem Browser unter derselben Adresse.
- **Sprachen:** `i18n.js` setzt `<html lang>` aus `?lang=`, sonst aus `localStorage` (`pm_lang`), sonst Browser. Blöcke mit `data-lang-content="de|en|fr"` zeigt das CSS nur für die passende Sprache (Abschnitt 15 in `styles.css`). Seitentitel pro Sprache über `data-lang-title-de/en/fr`. Menü, Footer, Formulare aus den Wörterbüchern in `i18n.js` (`data-i18n`).
- **Cache:** Nur wenn `styles.css`, `i18n.js` oder `script.js` geändert werden, `?v=` in allen HTML-Dateien erhöhen (Skill `bump-cache` oder `find . -name '*.html' -exec sed -i '' 's/?v=120/?v=121/g' {} +`). Neue Ausgaben allein brauchen keinen Bump.
- **Bild-Pipeline (kritisch, Regel 5):** `cwebp`/`dwebp` installiert, ImageMagick und Pillow nicht. `sips` skaliert und schreibt PNG. Bestehende Bilder in `img/` nie überschreiben oder neu komprimieren; neue Ausgabenbilder nur in `img/newsletter/`. Papierhintergrund der Ausgaben: `body.paper` mit `img/papier.webp`.
- **Vercel:** Attack Challenge Mode blockt curl; Preview-URLs brauchen Vercel-Login (nur die Auftraggeberin kann sie öffnen). Deploy-Status über `gh api`, nicht raten.
- **Brevo:** Der Newsletter wird in Brevo versendet (nicht Teil des Repos). Empfehlung: im Brevo-Newsletter einen Link „Im Browser lesen" auf die Ausgabenseite mit `?lang=de|en|fr` passend zur Kontaktsprache setzen. Das ist ein Vorschlag, kein Auftrag.

## 7. Offene Punkte außerhalb des Newsletters (Stand 2. November 2026)

- Social-Links (Bluesky, Substack, LinkedIn) sind Platzhalter auf die Plattform-Startseiten.
- Rechtstexte: FR zeigt EN; juristische Prüfung steht aus.
- Hero-Foto in Originalauflösung, Wikimedia-Lizenzen prüfen.
- Zustimmungs-Checkbox im Footer-Formular: Entscheidung offen.
- Danach: Rechner, Quiz und Explorer im neuen Design neu bauen (alter Code auf `develop` und Tag `landing-v1`).
- Veralteten Branch `redesign-canva` löschen (lokal und GitHub), `CLAUDE.md` im Repo: Ordnerstruktur aktualisieren und auf die Regeldatei im Drive-Ordner verweisen. Beides nur mit Go.
