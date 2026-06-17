# Portemonnaie Quiz · Content Spec

Stand: Juni 2026. Dies ist Content, kein UI Code. Reihenfolge: Block A, Block B, Block C, Ergebnis. Eine Frage pro Screen. Ton: warm, direkt, aktiv, Du Form, kein Fachjargon ohne Erklärung (siehe Brand Voice Dokument).

Wichtigste Regel für die Implementierung: der berechnete Output (Archetyp, Allokation) bleibt immer auf Asset Klassen Ebene, nie auf Instrumenten oder ISIN Ebene. Block A beeinflusst nur Selbstbild und eine weiche, frei änderbare Voreinstellung im Explorer, nie eine Produktauswahl.

---

## Block A · Werte und Wirkung

Fließt NICHT in die Risiko oder Archetyp Berechnung. Speist: Selbstbild der Userin, optional eine editierbare Tag Voreinstellung im Explorer.

### A1 · id: a1

**Intro:**
Dein Geld schläft nicht. Es arbeitet schon. Nur hat bisher jemand anderes entschieden, wofür. Hier wählst du die Richtung.

**Frage:** Wofür soll dein Geld wirken?

**Typ:** multi_select, max 2

**Optionen:**
| value | label |
|---|---|
| `umwelt` | Eine lebenswerte Umwelt |
| `menschen` | Faire Chancen für Menschen |
| `gesundheit` | Gesundheit und Wohlergehen |
| `wirtschaft` | Zukunft und verantwortungsvolle Wirtschaft |
| `unentschieden` | Zeig mir erst die ganze Karte |

### A2 · id: a2

**Intro:** Das sind die 17 Ziele der Vereinten Nationen für eine bessere Welt.

**Anzeige:** Erst alle 17 SDGs als reine Namensübersicht. Danach, gefiltert nach a1, die passenden SDGs mit einer Zeile Erklärung und einem sehr kurzen Branchenbeispiel (3–5 Wörter, niemals ein konkretes Unternehmen). Wer `unentschieden` gewählt hat, sieht alle Cluster.

**Typ:** multi_select, keine Obergrenze

**Optionen nach a1 Auswahl gruppiert:**

`umwelt`
| value | label | Branchenbeispiel |
|---|---|---|
| `sdg7` | SDG 7 · Saubere Energie | Solar, Wind, Wasserkraft |
| `sdg6` | SDG 6 · Sauberes Wasser | Versorgung, Aufbereitung |
| `sdg13` | SDG 13 · Klimaschutz | CO2 Reduktion, Effizienztechnik |
| `sdg14_15` | SDG 14/15 · Leben unter Wasser und an Land | Naturschutz, nachhaltige Land und Forstwirtschaft |

`menschen`
| value | label | Branchenbeispiel |
|---|---|---|
| `sdg5` | SDG 5 · Gleichstellung | Unternehmen mit starker Geschlechtervielfalt (Gender Layer / Equileap) |
| `sdg4` | SDG 4 · Bildung | Bildungsangebote, Lerntechnologie |
| `sdg8` | SDG 8 · Gute Arbeit | faire Arbeitsbedingungen, Lieferketten |
| `sdg10` | SDG 10 · Weniger Ungleichheit | finanzielle Teilhabe |

`gesundheit`
| value | label | Branchenbeispiel |
|---|---|---|
| `sdg3` | SDG 3 · Gesundheit | Pharmaforschung, Medizintechnik, Versorgung |
| `sdg2` | SDG 2 · Kein Hunger | nachhaltige Landwirtschaft, Ernährung |

`wirtschaft`
| value | label | Branchenbeispiel |
|---|---|---|
| `sdg9` | SDG 9 · Industrie und Innovation | saubere Industrie, Infrastruktur |
| `sdg12` | SDG 12 · Verantwortungsvoller Konsum | Kreislaufwirtschaft, Recycling |
| `sdg11` | SDG 11 · Nachhaltige Städte | bezahlbarer Wohnraum, saubere Mobilität |

### Spiegelschritt (kein Eingabe Screen, nur Anzeige)

Gut. Dir ist [ausgewählte SDGs] wichtig. Das ist dein Wirkungspunkt. Was davon wirklich ins Portfolio kommt, entscheidest du später. Frei.

---

## Block B · Ziele und Zeithorizont

Fließt in die Risikoberechnung (B2 ist der stärkste Treiber für Risikokapazität).

### B1 · id: b1

**Intro:** Geld ist ein Mittel, kein Ziel. Es zu steuern fällt leichter, wenn klar ist, wofür.

**Frage:** Wofür legst du an?

**Typ:** single_select

**Optionen:**
| value | label |
|---|---|
| `alter` | Für später, fürs Alter |
| `unabhaengigkeit` | Für mehr Unabhängigkeit |
| `ziel` | Für etwas Bestimmtes, etwa Wohnen, Familie, eine Auszeit |
| `offen` | Ich lasse mein Geld arbeiten, ohne festes Ziel |

### B2 · id: b2

**Intro:** Beim Anlegen zählt nicht der richtige Moment, sondern wie lange dein Geld dabei ist. Märkte gehen rauf und runter. Je länger du dabei bist, desto mehr Zeit hat dieses Auf und Ab, sich auszugleichen. Time in the market beats timing the market.

**Frage:** Wann brauchst du dein Geld wahrscheinlich?

**Typ:** single_select

**Optionen:**
| value | label | Risikogewicht |
|---|---|---|
| `5_10` | In fünf bis zehn Jahren | mittel |
| `10_plus` | In über zehn Jahren | hoch |
| `pension` | Zum Pensionsantritt | hoch |
| `unklar` | Weiß ich noch nicht | konservativ werten (wie kurz/mittel) |

---

## Block C · Verhalten und Risiko

Fließt direkt in die Archetyp Berechnung. C4 beeinflusst nur Ton/Glossartiefe, nie den Archetyp.

### C1 · id: c1

**Intro:** Niemand legt an, um zu verlieren. Werte gehen aber rauf und runter. Wie du in einem schlechten Moment reagierst, sagt mehr als jede Selbsteinschätzung.

**Frage:** Dein Investment ist in einem schlechten Monat 15 Prozent weniger wert. Was machst du?

**Typ:** single_select

**Optionen:**
| value | label | Risikogewicht |
|---|---|---|
| `verkaufen` | Ich verkaufe, bevor mehr weg ist | niedrig |
| `abwarten` | Ich lasse es liegen und warte ab | mittel |
| `nachlegen` | Ich lege nach, jetzt ist es günstiger | hoch |
| `unsicher` | Ich bin mir nicht sicher | mittel (zählt als moderat) |

### C2 · id: c2

**Intro:** Es gibt keinen Weg nach oben ohne Auf und Ab. Die Frage ist, wie viel davon sich für dich richtig anfühlt.

**Frage:** Welcher Verlauf fühlt sich für dich richtiger an?

**Typ:** single_select, jede Option mit Mini Kurvengrafik (siehe `C2_Verlauf_Antwortoptionen.svg`)

**Optionen:**
| value | label | Farbe | Risikogewicht |
|---|---|---|---|
| `ruhig` | Ruhig und gleichmäßig, auch wenn am Ende weniger steht | Sage Green | niedrig |
| `mehr_auf_ab` | Etwas mehr Auf und Ab für mehr Wachstum | Forest Green | mittel |
| `deutliches_auf_ab` | Deutliches Auf und Ab, wenn langfristig mehr drin ist | Marigold | hoch |

Kein "weiß ich nicht" hier, jedes Gefühl hat eine Tendenz.

### C3 · id: c3

**Intro:** Geld anzulegen heißt, es eine Weile nicht anzufassen. Deshalb zählt, ob es Geld ist, das du im Alltag nicht brauchst.

**Frage:** Ist das Geld, das du anlegen willst, gerade entbehrlich?

**Typ:** single_select

**Optionen:**
| value | label | Funktion |
|---|---|---|
| `polster_da` | Ja, ein Polster für den Alltag ist da | keine Deckelung |
| `groesstenteils` | Größtenteils | leichte Deckelung |
| `eher_nicht` | Eher nicht | Band nach oben deckeln, max. mittleres Risiko |

### C4 · id: c4

Beeinflusst NICHT den Archetyp. Steuert nur Ton, Übersetzungstiefe und welche Denkfalle im Ergebnis sanft gespiegelt wird.

**Intro:** Eine letzte Sache. Es gibt keine richtige Antwort.

**Frage:** Wo stehst du gerade beim Thema Geldanlage?

**Typ:** single_select

**Optionen:**
| value | label | Ton Mapping |
|---|---|---|
| `neu` | ganz neu | warm, viel Erklärung |
| `grundlagen` | ich kenne die Grundlagen | mittlere Erklärtiefe |
| `investiert` | ich bin schon investiert, möchte aber nachhaltigere Alternativen entdecken | Augenhöhe, wenig Erklärung, Fokus Gender/Sustainability Layer |
| `unsicher_neugierig` | unsicher, aber neugierig | warm, viel Erklärung, ermutigender Ton |

---

## Scoring Logik

```
risk_score = weight(b2) + weight(c1) + weight(c2)
risk_score = cap(risk_score, max_allowed_by(c3))

archetype = band(risk_score):
  niedrig        -> die Gärtnerin
  mittel-niedrig  -> die Seglerin
  mittel-hoch     -> die Entdeckerin
  hoch            -> die Bergsteigerin

# Fallback: fehlt das Risikosignal weitgehend (z.B. mehrfach "unsicher"/"unklar"),
# Default ist immer die Gärtnerin. Niemals durch Unklarheit nach oben schieben.

tone_profile = c4  # beeinflusst NUR Copy/Glossartiefe, nicht archetype

explorer_default_tags = sdg_selections_from(a2)  # weich, vollständig vom Nutzer überschreibbar
                                                   # NIEMALS Produkt- oder Instrumentenauswahl
```

### "Ich bin mir nicht sicher" Verhalten

Faktenfragen über die eigene Lebenssituation (b2, c3): Ausweichoption ist legitim und führt ggf. in konservative Wertung.
Verhaltensfragen (c1): "unsicher" zählt als moderater Wert, kein Nullwert.
Gefühlsfrage (c2): keine Ausweichoption, jedes Gefühl hat eine Tendenz.

Nudge nach 2x "unsicher"/"unklar" Antworten: unterstützende, nicht tadelnde Einblendung, sinngemäß "nimm dir kurz Zeit, es gibt keine falsche Antwort". Kein Pflichtfeld, keine Blockade.

---

## Compliance Leitplanken (für Implementierung bindend)

1. Output ist immer Asset Klasse (z. B. Aktien/Anleihen/Liquidität als Prozentsatz), nie ein konkretes Instrument oder ISIN.
2. Block A (Werte/SDGs) darf im Explorer höchstens einen Filter vorbelegen, den die Userin selbst ändern kann. Niemals ein "für dich" Produkt-Auto-Vorschlag.
3. Keine Frage nach konkretem Vermögen oder Anlagebetrag in Euro (Geeignetheitsprüfung-Trigger). C3 fragt bewusst nur qualitativ ("entbehrlich?").
4. Keine Nennung konkreter Unternehmen im Quiz, nur Branchen/Sektoren als Beispiel.

---

## Noch offen, NICHT Teil dieses Specs

- Aktienbänder pro Archetyp (z. B. wie viel % Aktien bei "die Gärtnerin") — zurückgestellt, noch nicht final.
- Mögliche zusätzliche Frage zum Investitionsmodus (monatlicher Sparplan vs. Einmalbetrag) — vorgeschlagen, von Scheter noch nicht final bestätigt. Falls umgesetzt: gehört an den Ausführungs/Explorer-Schritt, NICHT in die Archetyp-Berechnung.
- Reveal- / Ergebnisseiten-Copy pro Archetyp — noch nicht ausformuliert (ein Beispiel "die Seglerin" existiert im Brand Voice Dokument, Abschnitt 7).
- "Für wen wird angelegt" (z. B. für ein Kind) — bewusst nicht als eigene Frage vorgeschlagen, ggf. als Variante in b1 oder als Kontotyp im Ausführungsschritt.
