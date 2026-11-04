#!/usr/bin/env python3
"""Baut die Portemonnaie Double-Opt-in-Bestätigungsmail (Runde 1.26110401, Aufbau nach Canva-Vorlage vom 4. November 2026).

Ausgabe (im Ordner email/):
  doi-confirmation.html           eine Brevo-Vorlage, DE/EN/FR über {% if contact.LANGUAGE %}-Blöcke
  doi-confirmation.subject.txt    sprachabhängige Betreffzeile für Brevo
  preview-de.html / -en / -fr     statische Vorschauen (lokale Bildpfade), z. B. http://localhost:8082/email/preview-de.html

Bilder: Kopf (Logo, Linien, Headline in The Youngest Serif) und Fuß (Claim, Tänzerinnen) sind PNGs aus Canva
(email/img/head-*.png, footer.png, 1200 px breit = 2x). In Brevo liegen sie in der Mediathek; die URLs stehen in IMAGES_BREVO.
Texte: jeder Satz ist unten in TEXT markiert und lässt sich direkt in Brevo im Code-Editor überschreiben.
"""
import pathlib

OUT = pathlib.Path(__file__).resolve().parent
SITE = "https://portemonnaie.finance/"

# Bild-URLs aus der Brevo-Mediathek (Bibliothek → Medien). Leer = noch nicht hochgeladen, dann bleibt der lokale Pfad.
IMAGES_BREVO = {
    "head-en": "https://img.mailinblue.com/11224085/images/content_library/original/6aeb7deee31f4bac9aec013c.png",
    "head-de": "https://img.mailinblue.com/11224085/images/content_library/original/6aeb7dee0cff5b6235787f25.png",
    "head-fr": "https://img.mailinblue.com/11224085/images/content_library/original/6aeb7dee0cff5b6235787f24.png",
    "footer": "https://img.mailinblue.com/11224085/images/content_library/original/6aeb7dee0265291013813be3.png",
}

def img_url(key, local):
    return IMAGES_BREVO.get(key) or (f"img/{key}.png" if local else f"img/{key}.png")

# Bestätigungslink. Die Automation (Liste 5) wartet auf einen Klick auf einen beliebigen Link
# und schiebt den Kontakt dann in Liste 4. ?lang hält confirmed.html in der Sprache der Leserin.
def confirm_url(lang):
    return f"{SITE}confirmed.html?lang={lang}"

# ---------------------------------------------------------------- TEXTE
TEXT = {
    "de": dict(
        subject="Bitte bestätige deine E-Mail-Adresse",
        preheader="Ein Klick, und du bist dabei.",
        head_alt="Portemonnaie. Willkommen im Club",
        hello="Hallo",
        body1="Danke, dass du dich für den Portemonnaie-Newsletter eingetragen hast. Ab jetzt kommt er jeden Sonntag um 10 Uhr zu dir.",
        body2="Bitte bestätige deine E-Mail-Adresse mit einem Klick auf den Button.",
        button="E-Mail-Adresse bestätigen",
        note="Du hast dich nicht angemeldet? Dann ignoriere diese E-Mail einfach. Es passiert nichts weiter.",
        imprint="Impressum", privacy="Datenschutzerklärung",
    ),
    "en": dict(
        subject="Please confirm your email address",
        preheader="One click and you're in.",
        head_alt="Portemonnaie. Welcome to the club",
        hello="Hello",
        body1="Thank you for signing up for the Portemonnaie newsletter. From now on it arrives every Sunday at 10 am.",
        body2="Please confirm your email address by clicking the button below.",
        button="Confirm email address",
        note="Didn't sign up? Then simply ignore this email. Nothing else will happen.",
        imprint="Imprint", privacy="Privacy policy",
    ),
    "fr": dict(
        subject="Merci de confirmer ton adresse e-mail",
        preheader="Un clic, et tu en fais partie.",
        head_alt="Portemonnaie. Bienvenue au club",
        hello="Bonjour",
        body1="Merci pour ton inscription à la newsletter Portemonnaie. Elle arrivera désormais chaque dimanche à 10 h.",
        body2="Confirme ton adresse e-mail en cliquant sur le bouton ci-dessous.",
        button="Confirmer mon adresse e-mail",
        note="Ce n'était pas toi ? Ignore simplement cet e-mail. Il ne se passera rien de plus.",
        imprint="Mentions légales", privacy="Politique de confidentialité",
    ),
}

# Schriften (DESIGN.md): DM Sans für Fließtext, Newsreader für den Button. Webfonts zeigen nur Apple Mail, iOS Mail,
# Samsung Mail und Thunderbird; Gmail und Outlook nehmen die Ersatzschriften. Headline und Logo sind deshalb Bilder.
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

FOOT = """</body>
</html>
"""

def block(t, lang, local, firstname_expr):
    """Ein Sprachblock (alles zwischen <body> und </body>). Aufbau 1:1 nach der Canva-Vorlage."""
    greeting = f'{t["hello"]}{firstname_expr},'
    confirm = confirm_url(lang)
    head = img_url(f"head-{lang}", local)
    foot = img_url("footer", local)
    L = lang.upper()
    return f"""
  <!-- Vorschautext im Posteingang -->
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#F6F5EE;">{t["preheader"]}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F6F5EE;">
    <tr>
      <td align="center" style="padding:24px 0 40px 0;">
        <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
        <table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px;">

          <!-- KOPF (Bild aus Canva): Logo in DM Serif Display, zwei Linien, Headline in The Youngest Serif -->
          <tr>
            <td style="padding:0;">
              <a href="{SITE}" style="text-decoration:none;"><img src="{head}" width="600" height="120" alt="{t["head_alt"]}" style="width:100%; max-width:600px; height:auto; display:block;" /></a>
            </td>
          </tr>

          <!-- TEXT {L}: Anrede -->
          <tr>
            <td class="pad" style="padding:56px 44px 0 44px; font-family:{BODY}; font-size:19px; line-height:1.5; color:#000000;">{greeting}</td>
          </tr>
          <!-- TEXT {L}: Absatz 1 -->
          <tr>
            <td class="pad" style="padding:22px 44px 0 44px; font-family:{BODY}; font-size:19px; line-height:1.5; color:#000000;">{t["body1"]}</td>
          </tr>
          <!-- TEXT {L}: Absatz 2 -->
          <tr>
            <td class="pad" style="padding:22px 44px 0 44px; font-family:{BODY}; font-size:19px; line-height:1.5; color:#000000;">{t["body2"]}</td>
          </tr>

          <!-- BUTTON: Pill nur mit 1 px Rand (wie in der Canva-Vorlage), Text in Newsreader -->
          <tr>
            <td class="pad" align="center" style="padding:44px 44px 0 44px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;">
                <tr>
                  <td class="btn-td" align="center" width="372" style="width:372px; border:1px solid #000000; border-radius:999px; background-color:#F6F5EE; mso-padding-alt:0;">
                    <!--[if mso]><i style="letter-spacing:40px; mso-font-width:-100%; mso-text-raise:30pt;">&nbsp;</i><![endif]-->
                    <!-- TEXT {L}: Button -->
                    <a class="btn-a" href="{confirm}" style="display:inline-block; padding:18px 24px; font-family:{DISPLAY}; font-size:21px; line-height:1.2; color:#000000; text-decoration:none; border-radius:999px;">{t["button"]}</a>
                    <!--[if mso]><i style="letter-spacing:40px; mso-font-width:-100%;">&nbsp;</i><![endif]-->
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- TEXT {L}: Hinweis -->
          <tr>
            <td class="pad" style="padding:48px 44px 0 44px; font-family:{BODY}; font-size:14px; line-height:1.5; color:#333333;">{t["note"]}</td>
          </tr>

          <!-- FUSS (Bild aus Canva): Claim links, Tänzerinnen rechts -->
          <tr>
            <td class="pad-foot" style="padding:28px 0 0 15px;">
              <img src="{foot}" width="585" height="134" alt="Money is power. Use yours." style="width:100%; max-width:585px; height:auto; display:block;" />
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

def page(lang, title, body_html):
    return (HEAD.replace("__LANG__", lang).replace("__TITLE__", title).replace("__FONTS__", FONTS_CSS)
            + body_html + FOOT)

# 1) Statische Vorschauen, eine je Sprache (lokale Bildpfade, Beispiel-Vorname)
for lang, t in TEXT.items():
    html = page(lang, t["subject"], block(t, lang, True, " Katharina"))
    (OUT / f"preview-{lang}.html").write_text(html, encoding="utf-8")

# 2) Brevo-Vorlage: drei Blöcke, geschaltet über das Kontaktattribut LANGUAGE (EN/DE/FR, setzt api/subscribe.js).
#    EN ist der Rückfall, wenn das Attribut fehlt oder etwas anderes enthält.
fn = "{% if contact.FIRSTNAME %} {{ contact.FIRSTNAME }}{% endif %}"
parts = [
    '{% if contact.LANGUAGE == "DE" %}' + block(TEXT["de"], "de", False, fn) + '{% endif %}',
    '{% if contact.LANGUAGE == "FR" %}' + block(TEXT["fr"], "fr", False, fn) + '{% endif %}',
    '{% if contact.LANGUAGE != "DE" and contact.LANGUAGE != "FR" %}' + block(TEXT["en"], "en", False, fn) + '{% endif %}',
]
subject = ('{% if contact.LANGUAGE == "DE" %}' + TEXT["de"]["subject"] + '{% endif %}'
           '{% if contact.LANGUAGE == "FR" %}' + TEXT["fr"]["subject"] + '{% endif %}'
           '{% if contact.LANGUAGE != "DE" and contact.LANGUAGE != "FR" %}' + TEXT["en"]["subject"] + '{% endif %}')
(OUT / "doi-confirmation.html").write_text(page("en", "Portemonnaie", "\n".join(parts)), encoding="utf-8")
(OUT / "doi-confirmation.subject.txt").write_text(subject + "\n", encoding="utf-8")

missing = [k for k, v in IMAGES_BREVO.items() if not v]
print("geschrieben:", sorted(p.name for p in OUT.iterdir() if p.suffix in (".html", ".txt")))
print("Brevo-Bild-URLs fehlen noch für:", missing if missing else "keine")
