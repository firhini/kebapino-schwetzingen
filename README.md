# Kebapino Schwetzingen – Website-Entwurf

Moderne One-Page-Website für **Kebapino Döner & Pizza**, Rudolf-Diesel-Str. 5, 68723 Schwetzingen.

- Reines HTML, CSS und JavaScript – kein Build-Schritt, keine Abhängigkeiten
- Schriften liegen lokal (`assets/fonts`), keine externen Anfragen, keine Cookies
- Google-Karte lädt erst nach Klick

## Live ansehen (GitHub Pages)

Repository → **Settings → Pages** → *Deploy from a branch* → Branch auswählen, Ordner `/ (root)` → **Save**.
Danach ist die Seite unter `https://firhini.github.io/kebapino-schwetzingen/` erreichbar.

## Inhalte anpassen

| Was | Wo |
| --- | --- |
| Texte, Speisekarte, Preise, Links | `index.html` |
| Öffnungszeiten (Status „Jetzt geöffnet“) | `assets/app.js` → `OPEN` / `CLOSE`, Tabelle in `index.html` |
| Farben, Schriftgrößen | `assets/style.css` → `:root` |

Vor dem Livegang: Preise mit der aktuellen Karte abgleichen, Impressum und Datenschutz ergänzen und in `index.html` die Zeile `<meta name="robots" content="noindex, nofollow">` entfernen.
