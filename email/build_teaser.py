#!/usr/bin/env python3
"""Baut die wöchentliche Teaser-Mail zu einer Newsletter-Ausgabe (Runde 1.26110803, Festlegung der Auftraggeberin vom 8. November 2026).

Aufruf:
  python3 -I email/build_teaser.py --issue newsletter/JJJJ-MM-TT-kurztitel.html [--paragraphs 1]

Das Titelbild der Ausgabe steht unter dem Untertitel (--image URL --image-size BxH, Festlegung vom 8. November 2026). Sie besteht aus Logo-Kopf, Datum, Titel, Untertitel, dem ersten Absatz der Ausgabe
(1:1 aus der Ausgabenseite, also aus der Docx der Auftraggeberin) und einem Button zur Ausgabenseite auf portemonnaie.finance.
Drei Sprachen in einer Brevo-Vorlage über {% if contact.LANGUAGE %}-Blöcke, wie bei der Bestätigungs-Mail (build_email.py).

Eigener Teaser je Sprache: --teaser-file email/teaser/JJJJ-MM-TT-teaser.txt (Blöcke [de] [en] [fr]) oder --teaser-de/-en/-fr.
Leerzeile = neuer Absatz; der Teaser ersetzt die Absätze aus der Ausgabe.
Der Ordner email/teaser/ ist in .gitignore (Teaser-Texte kommen je Ausgabe neu, erzeugte Mails bleiben lokal).

Ausgabe (im Ordner email/teaser/):
  JJJJ-MM-TT-kurztitel.html          Brevo-Vorlage (DE/EN/FR), zum Einfügen im Brevo-Code-Editor
  JJJJ-MM-TT-kurztitel.subject.txt   sprachabhängige Betreffzeile (= Titel der Ausgabe)
  preview-de.html / -en / -fr        statische Vorschauen mit lokalen Bildpfaden, z. B. http://localhost:8082/email/teaser/preview-de.html

Bilder: Logo-Kopf email/img/head-logo.png (Zuschnitt aus dem Kopf der Bestätigungs-Mail) und email/img/footer.png.
In Brevo liegen sie in der Mediathek; die URLs stehen in IMAGES_BREVO.
"""
import argparse, html, pathlib, re

HERE = pathlib.Path(__file__).resolve().parent
REPO = HERE.parent
OUT = HERE / "teaser"
SITE = "https://portemonnaie.finance/"

# Bild-URLs aus der Brevo-Mediathek. Leer = noch nicht hochgeladen, dann bleibt in der Vorlage der lokale Pfad stehen.
IMAGES_BREVO = {
    "head-logo": "https://img.mailinblue.com/11224085/images/content_library/original/6af0bb25c5534067ec72012f.png",   # Brevo-Mediathek "01_Port_Header_Bluesky_Substack_2026-10-26-7" (3000 x 1000), siehe HEAD_SIZE
    "footer": "https://img.mailinblue.com/11224085/images/content_library/original/6aeb7dee0265291013813be3.png",
}
HEAD_SIZE = (600, 200)   # Anzeigemaße des Kopfbilds in der Mail (Breite 600, Seitenverhältnis des Originals)

# Feste Texte der Mail (Vorschläge vom 8. November 2026, von der Auftraggeberin in der Testmail zu prüfen).
# Alles Inhaltliche (Titel, Untertitel, Absatz) kommt 1:1 aus der Ausgabenseite und wird hier nie verändert.
TEXT = {
    "de": dict(hello="Hallo", button="Lies mehr auf portemonnaie.finance",
               note="Du erhältst diese E-Mail, weil du den Portemonnaie-Newsletter abonniert hast.",
               unsubscribe="Abmelden", imprint="Impressum", privacy="Datenschutzerklärung"),
    "en": dict(hello="Hello", button="Read more on portemonnaie.finance",
               note="You receive this email because you subscribed to the Portemonnaie newsletter.",
               unsubscribe="Unsubscribe", imprint="Imprint", privacy="Privacy policy"),
    "fr": dict(hello="Bonjour", button="Lire la suite sur portemonnaie.finance",
               note="Tu reçois cet e-mail parce que tu es abonnée à la newsletter Portemonnaie.",
               unsubscribe="Se désabonner", imprint="Mentions légales", privacy="Politique de confidentialité"),
}

DISPLAY = "'Newsreader', Georgia, 'Times New Roman', serif"
BODY = "'DM Sans', Helvetica, Arial, sans-serif"
FONTS_CSS = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&family=Newsreader:opsz,wght@6..72,400&display=swap"

HEAD = """<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="__LANG__">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>__TITLE__</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <!--[if !mso]><!-->
  <link href="__FONTS__" rel="stylesheet" type="text/css" />
  <style type="text/css">
    @import url('__FONTS__');
  </style>
  <!--<![endif]-->
  <style type="text/css">
    html, body { margin: 0 !important; padding: 0 !important; height: 100% !important; width: 100% !important; }
    body { background-color: #F6F5EE; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; display: block; }
    a { color: #000000; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
    @media screen and (max-width: 640px) {
      .wrap { width: 100% !important; }
      .pad { padding-left: 24px !important; padding-right: 24px !important; }
      .pad-foot { padding-left: 8px !important; }
      .btn-td { display: block !important; width: auto !important; }
      .btn-a { display: block !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#F6F5EE;">
"""
FOOT = "</body>\n</html>\n"

def img_url(key):
    return IMAGES_BREVO.get(key) or f"../img/{key}.png"

def read_issue(path, paragraphs):
    """Liest Titel, Untertitel, Datum und die ersten Absätze je Sprache aus der fertigen Ausgabenseite (1:1, inklusive em/strong/a)."""
    s = path.read_text(encoding="utf-8")
    issue = {}
    for lang in ("de", "en", "fr"):
        head = re.search(r'<header class="issue-article__head" data-lang-content="%s">(.*?)</header>' % lang, s, re.S)
        body = re.search(r'<div class="issue-article__body" data-lang-content="%s">(.*?)</div>' % lang, s, re.S)
        if not (head and body):
            raise SystemExit(f"Sprachblock {lang} nicht gefunden in {path}")
        title = re.search(r'issue-article__title">(.*?)</h1>', head.group(1), re.S).group(1).strip()
        subtitle = re.search(r'issue-article__subtitle">(.*?)</p>', head.group(1), re.S).group(1).strip()
        date = re.search(r'<time datetime="[^"]+">(.*?)</time>', head.group(1), re.S).group(1).strip()
        paras = re.findall(r'<p[^>]*>(.*?)</p>', body.group(1), re.S)[:paragraphs]
        if not paras:
            raise SystemExit(f"Kein Absatz gefunden für {lang}")
        issue[lang] = dict(title=title, subtitle=subtitle, date=date, paras=[p.strip() for p in paras])
    return issue

def block(lang, t, it, url, firstname_expr, image=None):
    """Ein Sprachblock (alles zwischen <body> und </body>). Aufbau wie die Bestätigungs-Mail."""
    L = lang.upper()
    para_rows = "\n".join(
        f'''          <!-- TEXT {L}: Absatz {i+1} (1:1 aus der Ausgabe) -->
          <tr>
            <td class="pad" style="padding:{22 if i else 28}px 44px 0 44px; font-family:{BODY}; font-size:19px; line-height:1.5; color:#000000;">{p}</td>
          </tr>''' for i, p in enumerate(it["paras"]))
    preheader = html.unescape(re.sub(r"<[^>]+>", "", it["subtitle"]))
    return f"""
  <!-- Vorschautext im Posteingang -->
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#F6F5EE;">{html.escape(preheader, quote=False)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F6F5EE;">
    <tr>
      <td align="center" style="padding:24px 0 40px 0;">
        <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
        <table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px;">

          <!-- KOPF: Logo und Linie (Zuschnitt aus dem Kopf der Bestätigungs-Mail) -->
          <tr>
            <td style="padding:0;">
              <a href="{SITE}" style="text-decoration:none;"><img src="{img_url('head-logo')}" width="{HEAD_SIZE[0]}" height="{HEAD_SIZE[1]}" alt="Portemonnaie" style="width:100%; max-width:600px; height:auto; display:block;" /></a>
            </td>
          </tr>

          <!-- TEXT {L}: Anrede -->
          <tr>
            <td class="pad" style="padding:48px 44px 0 44px; font-family:{BODY}; font-size:19px; line-height:1.5; color:#000000;">{t["hello"]}{firstname_expr},</td>
          </tr>
          <!-- Datum -->
          <tr>
            <td class="pad" style="padding:32px 44px 0 44px; font-family:{BODY}; font-size:14px; line-height:1.5; letter-spacing:0.04em; color:#333333;">Portemonnaie &#183; {it["date"]}</td>
          </tr>
          <!-- TEXT {L}: Titel (1:1 aus der Ausgabe) -->
          <tr>
            <td class="pad" style="padding:8px 44px 0 44px; font-family:{DISPLAY}; font-size:32px; line-height:1.15; color:#000000;">{it["title"]}</td>
          </tr>
          <!-- TEXT {L}: Untertitel (1:1 aus der Ausgabe) -->
          <tr>
            <td class="pad" style="padding:12px 44px 0 44px; font-family:{DISPLAY}; font-size:22px; line-height:1.3; color:#000000;">{it["subtitle"]}</td>
          </tr>
{image_row(image)}{para_rows}

          <!-- BUTTON: Pill mit 1 px Rand, Text in Newsreader -->
          <tr>
            <td class="pad" align="center" style="padding:40px 44px 0 44px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;">
                <tr>
                  <td class="btn-td" align="center" width="420" style="width:420px; border:1px solid #000000; border-radius:999px; background-color:#F6F5EE; mso-padding-alt:0;">
                    <!--[if mso]><i style="letter-spacing:40px; mso-font-width:-100%; mso-text-raise:30pt;">&nbsp;</i><![endif]-->
                    <!-- TEXT {L}: Button -->
                    <a class="btn-a" href="{url}" style="display:inline-block; padding:18px 24px; font-family:{DISPLAY}; font-size:21px; line-height:1.2; color:#000000; text-decoration:none; border-radius:999px;">{t["button"]}</a>
                    <!--[if mso]><i style="letter-spacing:40px; mso-font-width:-100%;">&nbsp;</i><![endif]-->
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- TEXT {L}: Hinweis und Abmeldelink (Brevo setzt {{{{ unsubscribe }}}} ein) -->
          <tr>
            <td class="pad" style="padding:48px 44px 0 44px; font-family:{BODY}; font-size:14px; line-height:1.5; color:#333333;">{t["note"]} <a href="{{{{ unsubscribe }}}}" style="color:#333333; text-decoration:underline;">{t["unsubscribe"]}</a></td>
          </tr>

          <!-- FUSS (Bild aus Canva): Claim links, Tänzerinnen rechts -->
          <tr>
            <td class="pad-foot" style="padding:28px 0 0 15px;">
              <img src="{img_url('footer')}" width="585" height="134" alt="Money is power. Use yours." style="width:100%; max-width:585px; height:auto; display:block;" />
            </td>
          </tr>
          <tr>
            <td class="pad" style="padding:8px 44px 0 44px;">
              <div style="height:1px; line-height:1px; font-size:1px; background-color:#000000;">&nbsp;</div>
            </td>
          </tr>
          <!-- TEXT {L}: Fußzeile -->
          <tr>
            <td class="pad" style="padding:16px 44px 0 44px; font-family:{BODY}; font-size:11px; line-height:1.4; letter-spacing:0.06em; text-transform:uppercase; color:#000000;">
              <span style="white-space:nowrap;">&#169; Portemonnaie 2026</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="{SITE}impressum.html" style="color:#000000; text-decoration:underline;">{t["imprint"]}</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="{SITE}privacy.html" style="color:#000000; text-decoration:underline;">{t["privacy"]}</a>
            </td>
          </tr>

        </table>
        <!--[if mso]></td></tr></table><![endif]-->
      </td>
    </tr>
  </table>
"""

def image_row(image):
    """Titelbild der Ausgabe unter dem Untertitel: (url, breite, hoehe) in Originalpixeln, Anzeige 512 px breit zwischen den Texträndern."""
    if not image:
        return ""
    url, w, h = image
    disp_w = 512
    disp_h = round(h * disp_w / w)
    return f"""          <!-- TITELBILD der Ausgabe (Brevo-Mediathek) -->
          <tr>
            <td class="pad" style="padding:28px 44px 0 44px;">
              <img src="{url}" width="{disp_w}" height="{disp_h}" alt="" style="width:100%; max-width:{disp_w}px; height:auto; display:block;" />
            </td>
          </tr>
"""

def page(lang, title, body_html):
    return HEAD.replace("__LANG__", lang).replace("__TITLE__", title).replace("__FONTS__", FONTS_CSS) + body_html + FOOT

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--issue", required=True, help="Pfad zur fertigen Ausgabenseite, z. B. newsletter/2026-11-02-was-tut-mein-geld.html")
    ap.add_argument("--paragraphs", type=int, default=1, help="Zahl der Absätze aus der Ausgabe (Standard 1)")
    for lang in ("de", "en", "fr"):
        ap.add_argument(f"--teaser-{lang}", help=f"Eigener Teaser ({lang}), ersetzt die Absätze aus der Ausgabe 1:1")
    ap.add_argument("--image", help="URL des Titelbilds in der Brevo-Mediathek (kommt unter den Untertitel)")
    ap.add_argument("--image-size", help="Originalmaße des Titelbilds als BREITExHOEHE, z. B. 2000x1125")
    ap.add_argument("--teaser-file", help="Textdatei mit Blöcken [de] [en] [fr] (wie email/teaser/2026-11-02-teaser.txt); Zeilen mit # sind Kommentare")
    a = ap.parse_args()
    if a.teaser_file:
        raw = "\n".join(l for l in pathlib.Path(a.teaser_file).read_text(encoding="utf-8").splitlines() if not l.startswith("#"))
        for m in re.finditer(r"\[(de|en|fr)\]\n(.*?)(?=\n\[(?:de|en|fr)\]|\Z)", raw, re.S):
            if not getattr(a, f"teaser_{m.group(1)}"):
                setattr(a, f"teaser_{m.group(1)}", m.group(2).strip())
    issue_path = pathlib.Path(a.issue).resolve()
    stem = issue_path.stem
    it = read_issue(issue_path, a.paragraphs)
    for lang in ("de", "en", "fr"):
        own = getattr(a, f"teaser_{lang}")
        if own:
            # Eigener Teaser (Leerzeile = neuer Absatz), Text 1:1 wie geliefert
            it[lang]["paras"] = [html.escape(x.strip(), quote=False) for x in own.split("\n\n") if x.strip()]
    OUT.mkdir(exist_ok=True)
    image = None
    if a.image:
        if not a.image_size:
            raise SystemExit("--image braucht --image-size BREITExHOEHE (im Browser messen, nicht raten)")
        w, h = (int(x) for x in a.image_size.lower().split("x"))
        image = (a.image, w, h)

    def url(lang):
        return f"{SITE}newsletter/{issue_path.name}?lang={lang}"

    # 1) Statische Vorschauen je Sprache (lokale Bilder, Beispiel-Vorname, Abmeldelink bleibt Platzhalter)
    for lang in ("de", "en", "fr"):
        (OUT / f"preview-{lang}.html").write_text(
            page(lang, html.unescape(it[lang]["title"]), block(lang, TEXT[lang], it[lang], url(lang), " Katharina", image)), encoding="utf-8")

    # 2) Brevo-Vorlage: drei Blöcke über das Kontaktattribut LANGUAGE (EN ist der Rückfall)
    fn = "{% if contact.FIRSTNAME %} {{ contact.FIRSTNAME }}{% endif %}"
    parts = [
        '{% if contact.LANGUAGE == "DE" %}' + block("de", TEXT["de"], it["de"], url("de"), fn, image) + '{% endif %}',
        '{% if contact.LANGUAGE == "FR" %}' + block("fr", TEXT["fr"], it["fr"], url("fr"), fn, image) + '{% endif %}',
        '{% if contact.LANGUAGE != "DE" and contact.LANGUAGE != "FR" %}' + block("en", TEXT["en"], it["en"], url("en"), fn, image) + '{% endif %}',
    ]
    (OUT / f"{stem}.html").write_text(page("en", "Portemonnaie", "\n".join(parts)), encoding="utf-8")
    subject = "".join([
        '{% if contact.LANGUAGE == "DE" %}' + html.unescape(it["de"]["title"]) + '{% endif %}',
        '{% if contact.LANGUAGE == "FR" %}' + html.unescape(it["fr"]["title"]) + '{% endif %}',
        '{% if contact.LANGUAGE != "DE" and contact.LANGUAGE != "FR" %}' + html.unescape(it["en"]["title"]) + '{% endif %}',
    ])
    (OUT / f"{stem}.subject.txt").write_text(subject + "\n", encoding="utf-8")

    for lang in ("de", "en", "fr"):
        print(f'{lang}: {html.unescape(it[lang]["title"])} | {html.unescape(it[lang]["subtitle"])} | {len(it[lang]["paras"])} Absatz/Absätze | Link {url(lang)}')
    missing = [k for k, v in IMAGES_BREVO.items() if not v]
    print("geschrieben:", OUT / f"{stem}.html", "+ subject.txt + preview-de/en/fr.html")
    print("Brevo-Bild-URLs fehlen noch für:", missing if missing else "keine")

if __name__ == "__main__":
    main()
