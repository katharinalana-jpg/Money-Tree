#!/usr/bin/env python3
# Erzeugt eine Newsletter-Ausgabe (DE/EN/FR) aus der Vorlage und der Docx der Auftraggeberin.
#
# Aufruf (aus dem Projektordner):
#   python3 -I newsletter/build_issue.py --docx "PFAD/Ausgabe.docx" --date 2026-11-02 --slug was-tut-mein-geld
# schreibt newsletter/2026-11-02-was-tut-mein-geld.html. Mit --out lässt sich ein anderer Zielpfad angeben.
#
# Erwartete Docx-Struktur (Word-Formatvorlagen, siehe newsletter/UEBERGABE_Newsletter.md):
#   Überschrift 1 = Titel, direkt gefolgt von Überschrift 2 = Untertitel, dann der Text bis zum nächsten Titel.
#   Überschrift 3 = Zwischenüberschrift. Alle anderen Absätze = Fließtext. Reihenfolge der Sprachen: EN, DE, FR,
#   oder davor eine Markerzeile „EN 02.11.2026" / „DE …" / „FR …" in Überschrift 1.
#   Kursiv -> <em>, Fett -> <strong>, Hyperlinks -> <a>. Ein Leerabsatz im Word = größerer Abstand (issue-article__gap).
#   Leerabsätze nach Zwischenüberschriften werden ignoriert (einheitlicher Abstand nach Überschriften).
# Typografie: doppelte Leerzeichen entfernt, Apostroph ’, „ - " wird „ – ". Wortlaut bleibt 1:1.
# Kein Bild auf der Seite (Entscheidung 3. November 2026); das Headerbild ist nur Kachelbild im Archiv.
import sys, re, html, argparse, zipfile, io
from xml.etree import ElementTree as ET

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
R = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
MONTHS = {
    'de': ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    'en': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    'fr': ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
}

def flag(rpr, tag):
    e = rpr.find(W + tag) if rpr is not None else None
    return e is not None and e.get(W + 'val') not in ('0', 'false')

def clean(t):
    t = re.sub(r'[ \t]{2,}', ' ', t)
    t = t.replace("'", '’')
    t = re.sub(r' - ', ' – ', t)
    t = re.sub(r'(\S)– ', r'\1 – ', t)
    return html.escape(t, quote=False)

def runs_of(p, rels):
    out = []
    for el in p:
        if el.tag == W + 'r':
            t = ''.join(x.text or '' for x in el.iter(W + 't'))
            if t: out.append([t, flag(el.find(W + 'rPr'), 'b'), flag(el.find(W + 'rPr'), 'i'), None])
        elif el.tag == W + 'hyperlink':
            href = rels.get(el.get(R + 'id'))
            for r in el.iter(W + 'r'):
                t = ''.join(x.text or '' for x in r.iter(W + 't'))
                if t: out.append([t, flag(r.find(W + 'rPr'), 'b'), flag(r.find(W + 'rPr'), 'i'), href])
    return out

def render(runs):
    runs = [list(r) for r in runs]
    if runs:
        runs[0][0] = runs[0][0].lstrip(); runs[-1][0] = runs[-1][0].rstrip()
    merged = []
    for t, b, i, h in runs:
        if merged and merged[-1][1:] == [b, i, h]: merged[-1][0] += t
        else: merged.append([t, b, i, h])
    parts = []
    for t, b, i, h in merged:
        if not t: continue
        s = clean(t)
        if i: s = f'<em>{s}</em>'
        if b: s = f'<strong>{s}</strong>'
        if h: s = f'<a href="{html.escape(h)}" target="_blank" rel="noopener">{s}</a>'
        parts.append(s)
    return ''.join(parts)

def read_docx(path):
    z = zipfile.ZipFile(path)
    rels = {r.get('Id'): r.get('Target') for r in ET.fromstring(z.read('word/_rels/document.xml.rels'))}
    root = ET.fromstring(z.read('word/document.xml'))
    paras, prev_empty = [], False
    for p in root.iter(W + 'p'):
        ps = p.find(W + 'pPr/' + W + 'pStyle'); sid = ps.get(W + 'val') if ps is not None else ''
        runs = runs_of(p, rels)
        if not ''.join(r[0] for r in runs).strip():
            prev_empty = True; continue
        paras.append((sid, runs, prev_empty)); prev_empty = False
    return paras

def split_sections(paras):
    """Titel = Überschrift 1 direkt vor Überschrift 2. Sprache aus Markerzeile davor, sonst Reihenfolge EN, DE, FR."""
    text = lambda i: ''.join(r[0] for r in paras[i][1]).strip()
    starts = [i for i in range(len(paras) - 1) if paras[i][0] == 'berschrift1' and paras[i + 1][0] == 'berschrift2']
    assert len(starts) == 3, f'{len(starts)} Titel gefunden, erwartet 3 (Überschrift 1 gefolgt von Überschrift 2)'
    order, sections = ['en', 'de', 'fr'], {}
    for n, i in enumerate(starts):
        m = re.match(r'(EN|DE|FR)\b', text(i - 1)) if i > 0 and paras[i - 1][0] == 'berschrift1' else None
        lang = m.group(1).lower() if m else order[n]
        end = starts[n + 1] - 1 if n + 1 < len(starts) else len(paras)
        if n + 1 < len(starts) and paras[end][0] == 'berschrift1' and re.match(r'(EN|DE|FR)\b', text(end)): end -= 1
        body = [p for p in paras[i + 2:end + 1] if not (p[0] == 'berschrift1')]
        # Untertitel: ein führender Spiegelstrich aus Word („- Untertitel") wird entfernt
        sections[lang] = (render(paras[i][1]), re.sub(r'^[-\u2013] ?', '', render(paras[i + 1][1])), body)
    assert set(sections) == {'de', 'en', 'fr'}, sections.keys()
    return sections

def body_html(body):
    out = []
    for n, (sid, runs, gap) in enumerate(body):
        if sid == 'berschrift3':
            out.append(f'        <h2 class="issue-article__heading">{render(runs)}</h2>')
        else:
            cls = ' class="issue-article__gap"' if gap and n > 0 and body[n - 1][0] != 'berschrift3' else ''
            out.append(f'        <p{cls}>{render(runs)}</p>')
    return '\n'.join(out)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--docx', required=True); ap.add_argument('--date', required=True, help='JJJJ-MM-TT')
    ap.add_argument('--slug', required=True); ap.add_argument('--template', default='newsletter/template.html')
    ap.add_argument('--out'); ap.add_argument('--description', help='Meta-Description, sonst aus dem deutschen Untertitel')
    a = ap.parse_args()
    y, m, d = (int(x) for x in a.date.split('-'))
    dates = {'de': f'{d}. {MONTHS["de"][m-1]} {y}', 'en': f'{d} {MONTHS["en"][m-1]} {y}', 'fr': f'{d} {MONTHS["fr"][m-1]} {y}'}
    out = a.out or f'newsletter/{a.date}-{a.slug}.html'
    sections = split_sections(read_docx(a.docx))
    titles = {l: s[0] for l, s in sections.items()}; subs = {l: s[1] for l, s in sections.items()}
    desc = html.escape(a.description or f'Portemonnaie Newsletter: {html.unescape(re.sub("<[^>]+>", "", subs["de"]))}.', quote=True)
    tpl = open(a.template, encoding='utf-8').read()
    tpl = re.sub(r'<title[^>]*>.*?</title>',
        f'<title data-lang-title-de="{titles["de"]} – Portemonnaie" data-lang-title-en="{titles["en"]} – Portemonnaie" data-lang-title-fr="{titles["fr"]} – Portemonnaie">{titles["de"]} – Portemonnaie</title>', tpl, flags=re.S)
    tpl = re.sub(r'<meta name="description" content="[^"]*" />', f'<meta name="description" content="{desc}" />', tpl)
    tpl = re.sub(r'<!-- NEWSLETTER-AUSGABE \(PDF Seite 6\)[^\n]*-->', f'<!-- NEWSLETTER-AUSGABE vom {dates["de"]}, erzeugt mit newsletter/build_issue.py aus der Docx -->', tpl)
    for lang in ('de', 'en', 'fr'):
        tpl = re.sub(rf'<header class="issue-article__head" data-lang-content="{lang}">.*?</header>',
            f'<header class="issue-article__head" data-lang-content="{lang}">\n'
            f'        <h1 class="issue-article__title">{titles[lang]}</h1>\n'
            f'        <p class="issue-article__subtitle">{subs[lang]}</p>\n'
            f'        <p class="issue-article__byline">Portemonnaie · <time datetime="{a.date}">{dates[lang]}</time></p>\n'
            f'      </header>', tpl, flags=re.S)
    tpl = re.sub(r'\n      <figure class="issue-article__figure">.*?</figure>\n', '\n', tpl, flags=re.S)
    for lang in ('de', 'en', 'fr'):
        tpl = re.sub(rf'<div class="issue-article__body" data-lang-content="{lang}">.*?\n      </div>',
            f'<div class="issue-article__body" data-lang-content="{lang}">\n{body_html(sections[lang][2])}\n      </div>', tpl, flags=re.S)
    assert '[…]' not in tpl and 'hero-wolken' not in tpl, 'Platzhalter der Vorlage nicht ersetzt'
    open(out, 'w', encoding='utf-8').write(tpl)
    for lang in ('de', 'en', 'fr'):
        b = sections[lang][2]
        print(f'{lang}: {html.unescape(re.sub("<[^>]+>", "", titles[lang]))} | {sum(1 for s,_,_ in b if s != "berschrift3")} Absätze, {sum(1 for s,_,_ in b if s == "berschrift3")} Zwischenüberschriften')
    print('geschrieben:', out)

if __name__ == '__main__':
    main()
