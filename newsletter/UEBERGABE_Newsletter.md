# Übergabeprotokoll: Wöchentliche Newsletter-Ausgaben im Archiv

Stand 1. November 2026. Für die nächste Session, in der jede Woche eine neue Ausgabe auf die Website kommt.
Lies zuerst dieses Protokoll, dann `newsletter/template.html` und `archive.html`. Memory-Dateien: `newsletter-weekly-workflow`, `redesign-canva-project`, `redesign-workflow-gates`, `preview-server-workaround`.

## 1. Wo wir stehen

- Projekt `/Users/ks/Documents/FemTech/Money-Tree`, live auf portemonnaie.finance über Vercel (Push auf `main` = live, alle anderen Branches = nur Vorschau hinter Vercel-Login).
- `main` = `67eeb59` (14. Oktober 2026), identisch mit `cosmetics-desktop`. `redesign-canva` ist veraltet und kann gelöscht werden. Cache-Version in allen HTML-Dateien: `?v=120`.
- Die erste Newsletter-Ausgabe ist fertig geschrieben (liegt bei der Auftraggeberin), aber noch nicht auf der Website.
- `archive.html` existiert fertig im Design, ist aber unverlinkt und `noindex`. Die drei Kacheln darin sind **Platzhalter** und zeigen auf `newsletter/template.html`. Alle "Archiv"-Links der Website und "Zum Archiv" auf der Startseite zeigen noch auf `archive-soon.html` (Coming-soon-Seite mit Magazin-Hinweis).
- Erscheinungsrhythmus: jeden Sonntag 10 Uhr. Die Ausgabe sollte also spätestens Sonntagvormittag live sein.

## 2. Arbeitsregeln (von der Auftraggeberin festgelegt)

- Vorschau zeigen, auf OK warten, dann pushen. Kein Push, Merge oder Deploy ohne ausdrückliches OK. Ein "OK zum Push" nach dem Launch bedeutet: Branch pushen **und** `main` nachziehen (fast-forward), damit es live geht.
- Texte 1:1 übernehmen, nichts umformulieren. Bilder 1:1, nur verkleinern und als WebP speichern.
- Dreisprachig DE/EN/FR, alle drei Fassungen in einer Datei. Keine Emojis. Farben und Schriften nur aus den CSS-Variablen in `styles.css`.
- Arbeitsbranch für Ausgaben: `content` (von `main` abzweigen, falls noch nicht vorhanden). Nach OK: `git checkout main && git merge --ff-only content && git push origin main`.

## 3. Was die Auftraggeberin pro Ausgabe liefert

Am besten als Text in der Nachricht oder als Datei (docx/pdf/md) für jede Sprache:

1. Erscheinungsdatum.
2. Rubrik-Zeile für die Kachel, in drei Sprachen (z. B. "Newsletter / Werte", "Newsletter / Values", "Newsletter / Valeurs").
3. Titel in drei Sprachen.
4. Fließtext in drei Sprachen, mit Zwischenüberschriften markiert.
5. Headerbild (Original aus Canva, möglichst mindestens 1700 px breit, Querformat). Dasselbe Bild dient als Kachelbild im Archiv.
6. Optional: ein Kurztitel für den Dateinamen (sonst aus dem deutschen Titel bilden).

Fehlt eine Sprache, nachfragen, nicht selbst übersetzen, außer die Auftraggeberin sagt es ausdrücklich.

## 4. Ablauf pro Ausgabe (Checkliste)

1. **Bild vorbereiten:** Original nach `img/newsletter/JJJJ-MM-TT-kurztitel.webp` (Ordner anlegen, falls nicht vorhanden). Breite 1700 px reicht für die 816 px breite Textspalte auf Retina. Befehl: `cwebp -q 82 -resize 1700 0 original.png -o img/newsletter/….webp`. Breite und Höhe für `width`/`height` im `<img>` ablesen.
2. **Seite anlegen:** `cp newsletter/template.html newsletter/JJJJ-MM-TT-kurztitel.html`. Darin ersetzen:
   - `<title data-lang-title-de/en/fr>` mit den drei Titeln plus " – Portemonnaie".
   - `<meta name="description">` mit einem Satz (DE reicht).
   - Die drei `<header class="issue-article__head" data-lang-content="de|en|fr">`: Titel, Datumszeile (`<time datetime="JJJJ-MM-TT">`, Datum ausgeschrieben in der jeweiligen Sprache: "12. Oktober 2026", "12 October 2026", "12 octobre 2026").
   - `<figure class="issue-article__figure">`: `src="../img/newsletter/….webp"`, `width`, `height`, `alt` kurz beschreibend.
   - Die drei `<div class="issue-article__body" data-lang-content="de|en|fr">`: Absätze als `<p>`, Zwischenüberschriften als `<h2 class="issue-article__heading">`. Anführungszeichen typografisch („…“ / “…” / « … »), Gedankenstrich –, keine doppelten Leerzeichen.
   - Die Pfade `../styles.css?v=NNN` und `../fonts/fonts.css?v=1` bleiben wie in der Vorlage; die Vorlage trägt immer die aktuelle Cache-Version.
3. **Kachel im Archiv:** In `archive.html` oben in `<ul class="archive__grid">` ein neues `<li class="issue">` einfügen (neueste Ausgabe zuerst):
   ```html
   <li class="issue">
     <a class="issue__media" href="newsletter/JJJJ-MM-TT-kurztitel.html" tabindex="-1" aria-hidden="true"><img src="img/newsletter/JJJJ-MM-TT-kurztitel.webp" alt="" width="…" height="…" loading="lazy" /></a>
     <p class="issue__label"><span data-lang-content="de">Newsletter / Rubrik</span><span data-lang-content="en">Newsletter / Topic</span><span data-lang-content="fr">Newsletter / Rubrique</span></p>
     <h2 class="issue__title"><a href="newsletter/JJJJ-MM-TT-kurztitel.html"><span data-lang-content="de">Titel DE</span><span data-lang-content="en">Titel EN</span><span data-lang-content="fr">Titel FR</span></a></h2>
   </li>
   ```
   Die Kachel ist 424 × 224 (`object-fit: cover`), ein Querformat-Bild wird mittig beschnitten.
4. **Vorschau:** Server starten (siehe Abschnitt 6), dann `http://localhost:8082/archive.html` und `http://localhost:8082/newsletter/JJJJ-MM-TT-kurztitel.html` jeweils mit `?lang=de`, `?lang=en`, `?lang=fr` prüfen: richtiger Block sichtbar, Titel im Tab, Bild lädt, Datum stimmt, Umbrüche, Handy-Breite (375 px). Screenshots an die Auftraggeberin schicken.
5. **Commit** auf `content`, Nachricht z. B. `Newsletter 2026-11-02: Titel (DE/EN/FR)`. Auf OK warten.
6. **Live:** Branch pushen, `main` fast-forwarden, pushen. Deploy-Status: `gh api repos/{owner}/{repo}/deployments?environment=Production&per_page=1` plus `/statuses`. Danach die Live-Seite im App-Browser öffnen (curl wird von Vercel blockiert) und die neue Ausgabe in drei Sprachen aufrufen.

## 5. Nur bei der ersten Ausgabe: Archiv freischalten

1. Die drei Platzhalter-Kacheln in `archive.html` löschen, die echte Kachel einsetzen.
2. `<meta name="robots" content="noindex" />` in `archive.html` entfernen.
3. Alle Links von `archive-soon.html` auf `archive.html` umstellen. Betroffen sind die Navigation in `index.html` (zwei Stellen: Menü und "Zum Archiv" unter dem Formular), `about.html`, `collabs.html`, `coming-soon.html`, `impressum.html`, `privacy.html`, `confirmed.html`, `archive.html` (Footer-Menü) und `newsletter/template.html` (zweimal, mit `../`). Prüfen: `grep -rn 'archive-soon.html' --include='*.html' .` soll danach nur noch `archive-soon.html` selbst finden.
4. `archive-soon.html` behalten (schadet nicht, falls alte Links kursieren), aber mit `<meta name="robots" content="noindex" />` versehen und die eigene Navigation auf `archive.html` zeigen lassen.
5. Prüfen, ob der Text auf `archive-soon.html` ("Das Portemonnaie-Magazin kommt!") noch irgendwo verlinkt ist.

## 6. Technik, die man wissen muss

- **Vorschau-Server:** Der eingebaute Vorschau-Server der App darf nicht auf "Documents" zugreifen. Stattdessen per Bash `python3 -m http.server 8082 --directory /Users/ks/Documents/FemTech/Money-Tree` (im Hintergrund) oder das `serve.py` aus dem Scratchpad (liefert ohne Cache), dann im App-Browser `http://localhost:8082/…` öffnen. Für Screenshots höchstens vier bis fünf pro Aufruf, sonst werden Bilder verworfen. Handy-Ansicht über `resize_window` Preset `mobile`, danach `desktop` zurücksetzen.
- **Sprachen:** `i18n.js` setzt `<html lang>` aus `?lang=`, sonst aus `localStorage` (`pm_lang`), sonst Browser. Blöcke mit `data-lang-content="de|en|fr"` werden per CSS nur für die passende Sprache angezeigt (Abschnitt 15 in `styles.css`). Seitentitel pro Sprache über `data-lang-title-de/en/fr`. Menü, Footer, Formulare kommen aus den Wörterbüchern in `i18n.js` (`data-i18n`).
- **Cache:** Nur wenn `styles.css`, `i18n.js` oder `script.js` geändert werden, die `?v=`-Nummer in allen HTML-Dateien erhöhen (Skill `bump-cache` oder `find . -name '*.html' -exec sed -i '' 's/?v=120/?v=121/g' {} +`). Neue Ausgaben allein brauchen keinen Bump.
- **Bilder:** `cwebp`/`dwebp` sind installiert, ImageMagick und Pillow nicht. `sips` kann skalieren und PNG schreiben. Papierhintergrund der Ausgaben: `body.paper` mit `img/papier.webp`.
- **Vercel:** Attack Challenge Mode blockt curl; Preview-URLs brauchen Vercel-Login (nur die Auftraggeberin kann sie öffnen). Deploy dauert ein bis zwei Minuten.
- **Brevo:** Der Newsletter selbst wird in Brevo versendet (nicht Teil dieses Repos). Sinnvoll: im Brevo-Newsletter unten einen Link "Im Browser lesen" auf die Ausgabenseite der Website setzen, mit `?lang=de|en|fr` passend zur Sprache des Kontakts.

## 7. Offene Punkte außerhalb des Newsletters

- Social-Links (Bluesky, Substack, LinkedIn) sind noch Platzhalter auf die Plattform-Startseiten.
- Rechtstexte: FR zeigt EN; juristische Prüfung steht aus.
- Hero-Foto in Originalauflösung, Wikimedia-Lizenzen prüfen.
- Zustimmungs-Checkbox im Footer-Formular: Entscheidung offen.
- Danach: Rechner, Quiz und Explorer im neuen Design neu bauen (alter Code auf `develop` und Tag `landing-v1`).
- Veralteten Branch `redesign-canva` löschen (lokal und auf GitHub), `CLAUDE.md` Ordnerstruktur aktualisieren.
