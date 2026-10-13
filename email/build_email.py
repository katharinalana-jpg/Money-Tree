#!/usr/bin/env python3
"""Builds the Portemonnaie double-opt-in confirmation email.

Outputs (in the repo folder email/):
  doi-confirmation.html   one Brevo template, DE/EN/FR via {% if contact.LANGUAGE %} blocks
  preview-de.html / preview-en.html / preview-fr.html   static previews (local image path)
"""
import sys, pathlib

OUT = pathlib.Path("/Users/ks/Documents/FemTech/Money-Tree/email")
# Brevo-Mediathek (hochgeladen 13.10.2026): das Tänzerinnen-Bild liegt dort als vollständige URL.
IMG_DANCERS_BREVO = sys.argv[1] if len(sys.argv) > 1 else "https://img.mailinblue.com/11224085/images/content_library/original/6ace17ace58328a282730e11.png"
FONT_BASE = "https://portemonnaie.finance/fonts/"
SITE = "https://portemonnaie.finance/"

# Brevo confirmation link. The Automation on list 5 tracks the click on this
# link and moves the contact to list 4 (confirmed). ?lang keeps confirmed.html
# in the reader's language.
def confirm_url(lang):
    return f"{SITE}confirmed.html?lang={lang}"

TEXT = {
    "de": dict(
        lang="de",
        subject="Bitte bestätige deine E-Mail-Adresse",
        preheader="Ein Klick, und du bist dabei.",
        hello="Hallo",
        headline="Fast geschafft.",
        body=("Danke, dass du dich für den Portemonnaie-Newsletter eingetragen hast. "
              "Bitte bestätige deine E-Mail-Adresse mit einem Klick auf den Button. "
              "Danach kommt der Newsletter jeden Sonntag um 10 Uhr zu dir."),
        button="E-Mail-Adresse bestätigen",
        note="Du hast dich nicht angemeldet? Dann ignoriere diese E-Mail einfach. Es passiert nichts weiter.",
        fallback="Der Button funktioniert nicht? Kopiere diesen Link in deinen Browser:",
        imprint="Impressum", privacy="Datenschutzerklärung",
        why="Du erhältst diese E-Mail, weil du dich auf portemonnaie.finance für den Newsletter eingetragen hast.",
        alt_dancers="",
    ),
    "en": dict(
        lang="en",
        subject="Please confirm your email address",
        preheader="One click and you're in.",
        hello="Hello",
        headline="Almost there.",
        body=("Thank you for signing up for the Portemonnaie newsletter. "
              "Please confirm your email address by clicking the button below. "
              "From then on, the newsletter arrives every Sunday at 10 am."),
        button="Confirm email address",
        note="Didn't sign up? Then simply ignore this email. Nothing else will happen.",
        fallback="Button not working? Copy this link into your browser:",
        imprint="Imprint", privacy="Privacy policy",
        why="You are receiving this email because you signed up for the newsletter on portemonnaie.finance.",
        alt_dancers="",
    ),
    "fr": dict(
        lang="fr",
        subject="Merci de confirmer ton adresse e-mail",
        preheader="Un clic, et tu en fais partie.",
        hello="Bonjour",
        headline="On y est presque.",
        body=("Merci pour ton inscription à la newsletter Portemonnaie. "
              "Confirme ton adresse e-mail en cliquant sur le bouton ci-dessous. "
              "Ensuite, la newsletter arrivera chaque dimanche à 10 h."),
        button="Confirmer mon adresse e-mail",
        note="Ce n'était pas toi ? Ignore simplement cet e-mail. Il ne se passera rien de plus.",
        fallback="Le bouton ne fonctionne pas ? Copie ce lien dans ton navigateur :",
        imprint="Mentions légales", privacy="Politique de confidentialité",
        why="Tu reçois cet e-mail parce que cette adresse a été inscrite à la newsletter sur portemonnaie.finance.",
        alt_dancers="",
    ),
}

LOGO = "'DM Serif Display', Georgia, 'Times New Roman', serif"
DISPLAY = "'Newsreader', Georgia, 'Times New Roman', serif"
BODY = "'DM Sans', Helvetica, Arial, sans-serif"

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
  <style type="text/css">
    /* Markenschriften (selbst gehostet, DESIGN.md). Clients ohne Webfont-Unterstützung zeigen Georgia / Helvetica. */
    @font-face { font-family: 'DM Serif Display'; font-style: normal; font-weight: 400; src: url(__FONT__dm-serif-display-2.woff2) format('woff2'); }
    @font-face { font-family: 'Newsreader'; font-style: normal; font-weight: 400; src: url(__FONT__newsreader-1.woff2) format('woff2'); }
    @font-face { font-family: 'DM Sans'; font-style: normal; font-weight: 400 700; src: url(__FONT__dm-sans-1.woff2) format('woff2'); }
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
      .pad { padding-left: 20px !important; padding-right: 20px !important; }
      .headline { font-size: 36px !important; line-height: 1.1 !important; }
      .stack { display: block !important; width: 100% !important; }
      .stack-img { padding-top: 18px !important; }
      .btn-td { display: block !important; }
      .btn-a { display: block !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#F6F5EE;">
"""

FOOT = """</body>
</html>
"""

def block(t, img_dancers, confirm):
    """One language block (everything between <body> and </body>)."""
    first = t.get("firstname_expr")
    greeting = f'{t["hello"]}{first},' if first else f'{t["hello"]},'
    return f"""
  <!-- Vorschautext im Posteingang -->
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#F6F5EE;">{t["preheader"]}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F6F5EE;">
    <tr>
      <td align="center" style="padding:32px 16px 40px 16px;">
        <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
        <table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px;">

          <!-- KOPF: Logo-Schriftzug, dünne Linie darunter (wie Website-Header) -->
          <tr>
            <td class="pad" style="padding:0 24px 14px 24px; border-bottom:1px solid #000000;">
              <a href="{SITE}" style="font-family:{LOGO}; font-size:24px; line-height:1.2; color:#000000; text-decoration:none;">Portemonnaie</a>
            </td>
          </tr>

          <!-- ANREDE + HEADLINE -->
          <tr>
            <td class="pad" style="padding:56px 24px 0 24px; font-family:{BODY}; font-size:17px; line-height:1.6; color:#000000;">{greeting}</td>
          </tr>
          <tr>
            <td class="pad headline" style="padding:10px 24px 0 24px; font-family:{DISPLAY}; font-size:44px; line-height:1.1; font-weight:400; color:#000000;">{t["headline"]}</td>
          </tr>

          <!-- TEXT -->
          <tr>
            <td class="pad" style="padding:24px 24px 0 24px; font-family:{BODY}; font-size:17px; line-height:1.6; color:#000000;">{t["body"]}</td>
          </tr>

          <!-- BUTTON: Pill, Creme gefüllt, 1 px schwarzer Rand (wie "Newsletter abonnieren" im Footer) -->
          <tr>
            <td class="pad" style="padding:36px 24px 0 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;">
                <tr>
                  <td class="btn-td" align="center" style="border:1px solid #000000; border-radius:999px; background-color:#EEECDE; mso-padding-alt:0;">
                    <!--[if mso]><i style="letter-spacing:40px; mso-font-width:-100%; mso-text-raise:28pt;">&nbsp;</i><![endif]-->
                    <a class="btn-a" href="{confirm}" style="display:inline-block; padding:15px 40px; font-family:{DISPLAY}; font-size:19px; line-height:1.2; letter-spacing:0.02em; text-transform:uppercase; color:#000000; text-decoration:none; border-radius:999px;">{t["button"]}</a>
                    <!--[if mso]><i style="letter-spacing:40px; mso-font-width:-100%;">&nbsp;</i><![endif]-->
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- HINWEISE -->
          <tr>
            <td class="pad" style="padding:32px 24px 0 24px; font-family:{BODY}; font-size:13px; line-height:1.5; color:#000000;">{t["note"]}</td>
          </tr>
          <tr>
            <td class="pad" style="padding:12px 24px 0 24px; font-family:{BODY}; font-size:13px; line-height:1.5; color:#000000;">{t["fallback"]}<br /><a href="{confirm}" style="color:#000000; text-decoration:underline; word-break:break-all;">{confirm}</a></td>
          </tr>

          <!-- FUSS: Claim links, Tänzerinnen rechts (Startseiten-Footer) -->
          <tr>
            <td class="pad" style="padding:64px 24px 0 24px; border-bottom:1px solid #000000;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="stack" width="50%" valign="bottom" style="padding:0 0 18px 0; font-family:{DISPLAY}; font-size:28px; line-height:1.1; letter-spacing:0.01em; text-transform:uppercase; color:#000000;">Money is power.<br />Use yours.</td>
                  <td class="stack stack-img" width="50%" align="right" valign="bottom" style="padding:0;">
                    <img src="{img_dancers}" width="260" height="195" alt="" style="width:260px; height:auto; max-width:100%; display:block; margin-left:auto;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="pad" style="padding:16px 24px 0 24px; font-family:{BODY}; font-size:10px; line-height:1.4; letter-spacing:0.04em; text-transform:uppercase; color:#000000;">
              <span style="white-space:nowrap;">&#169; Portemonnaie 2026</span>&nbsp;&nbsp;&nbsp;&nbsp;<a href="{SITE}impressum.html" style="color:#000000; text-decoration:underline;">{t["imprint"]}</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="{SITE}privacy.html" style="color:#000000; text-decoration:underline;">{t["privacy"]}</a>
            </td>
          </tr>
          <tr>
            <td class="pad" style="padding:14px 24px 0 24px; font-family:{BODY}; font-size:11px; line-height:1.5; color:#000000;">{t["why"]}</td>
          </tr>

        </table>
        <!--[if mso]></td></tr></table><![endif]-->
      </td>
    </tr>
  </table>
"""

def page(lang, title, body_html, font_base):
    return (HEAD.replace("__LANG__", lang).replace("__TITLE__", title).replace("__FONT__", font_base)
            + body_html + FOOT)

OUT.mkdir(parents=True, exist_ok=True)

# 1) Static previews, one per language (local paths, example first name)
for lang, t in TEXT.items():
    tt = dict(t, firstname_expr=" Katharina")
    html = page(lang, t["subject"], block(tt, "img/taenzerinnen.png", confirm_url(lang)), "../fonts/")
    (OUT / f"preview-{lang}.html").write_text(html, encoding="utf-8")

# 2) Brevo template: three blocks switched by the contact attribute LANGUAGE (EN/DE/FR, set by api/subscribe.js).
#    EN is the fallback when the attribute is missing or anything else.
fn = "{% if contact.FIRSTNAME %} {{ contact.FIRSTNAME }}{% endif %}"
parts = []
parts.append('{% if contact.LANGUAGE == "DE" %}' + block(dict(TEXT["de"], firstname_expr=fn), IMG_DANCERS_BREVO, confirm_url("de")) + '{% endif %}')
parts.append('{% if contact.LANGUAGE == "FR" %}' + block(dict(TEXT["fr"], firstname_expr=fn), IMG_DANCERS_BREVO, confirm_url("fr")) + '{% endif %}')
parts.append('{% if contact.LANGUAGE != "DE" and contact.LANGUAGE != "FR" %}' + block(dict(TEXT["en"], firstname_expr=fn), IMG_DANCERS_BREVO, confirm_url("en")) + '{% endif %}')
subject = ('{% if contact.LANGUAGE == "DE" %}' + TEXT["de"]["subject"] + '{% endif %}'
           '{% if contact.LANGUAGE == "FR" %}' + TEXT["fr"]["subject"] + '{% endif %}'
           '{% if contact.LANGUAGE != "DE" and contact.LANGUAGE != "FR" %}' + TEXT["en"]["subject"] + '{% endif %}')
brevo = page("en", "Portemonnaie", "\n".join(parts), FONT_BASE)
(OUT / "doi-confirmation.html").write_text(brevo, encoding="utf-8")
(OUT / "doi-confirmation.subject.txt").write_text(subject + "\n", encoding="utf-8")

print("written:", sorted(p.name for p in OUT.iterdir()))
print("subject line for Brevo:\n", subject)
