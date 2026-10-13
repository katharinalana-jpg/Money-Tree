# Brevo: Domain portemonnaie.finance authentifizieren (Stand 13.10.2026)

Domain in Brevo angelegt (Absender, Domains & dedizierte IPs → Domains). Diese Einträge bei GoDaddy
unter „Domain → DNS → Einträge“ anlegen. Bei GoDaddy im Feld „Name“ nur den Hostteil eintragen
(ohne `.portemonnaie.finance`), TTL kann auf Standard (1 Stunde) bleiben.

| Zweck      | Typ   | Name (Host)          | Wert                                           |
|------------|-------|----------------------|------------------------------------------------|
| Brevo-Code | TXT   | `@`                  | `brevo-code:dc865e8a3d4bb8e2822e93674113652b`  |
| DKIM 1     | CNAME | `brevo1._domainkey`  | `b1.portemonnaie-finance.dkim.brevo.com`       |
| DKIM 2     | CNAME | `brevo2._domainkey`  | `b2.portemonnaie-finance.dkim.brevo.com`       |

## DMARC: nichts ändern

Es gibt bereits einen DMARC-Eintrag (`_dmarc`, TXT):
`v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;`

Brevo schlägt `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` vor. Zwei DMARC-Einträge sind
ungültig, also den bestehenden behalten. Er ist strenger (quarantine) und wird mit den DKIM-Einträgen
oben erfüllt. Optional kann die Brevo-Adresse als zweiter Report-Empfänger ergänzt werden:
`rua=mailto:dmarc_rua@onsecureserver.net,mailto:rua@dmarc.brevo.com`

## Danach

In Brevo auf der Domain-Seite „Diese E-Mail-Domain authentifizieren“ klicken (oder Claude Bescheid
sagen). Prüfung dauert meist Minuten, laut Brevo bis zu 48 Stunden. Kontrolle im Terminal:

```bash
dig +short TXT portemonnaie.finance; dig +short CNAME brevo1._domainkey.portemonnaie.finance; dig +short CNAME brevo2._domainkey.portemonnaie.finance
```
