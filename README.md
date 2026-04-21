# Portfolio Vanilla

Dieses Repository enthält mein persönliches Portfolio als statische Webanwendung. Die Seite bündelt ausgewählte Projekte, zeigt meinen gestalterischen und technischen Ansatz im Frontend und bietet einen direkten Weg zur Kontaktaufnahme. Visuell arbeitet das Portfolio mit gezeichneten Linien, Sticker Elementen, Polaroid Motiven und einer bewusst eigenständigen Oberfläche.

## Projektüberblick

Die Startseite führt durch die Bereiche Hero, Über mich, Skills, Projekte, Testimonials und Kontakt. Ergänzt wird sie durch eigene Detailseiten für einzelne Projekte sowie separate Seiten für Legal Notice und Privacy Policy. Die gesamte Anwendung ist ohne Frameworks umgesetzt und setzt auf eine klare Trennung von Struktur, Styling, Assets und Verhalten.

## Funktionen

1. Zweisprachige Oberfläche in Deutsch und Englisch
2. Gespeicherte Sprachwahl über localStorage
3. Dynamische Projektdetailseiten auf Basis zentral gepflegter Projektdaten
4. Interaktive Oberflächendetails wie Letter Hover, Badge Animation, Floating Card und Peel Effekt
5. Responsives Navigationskonzept mit mobilem Menü
6. Kontaktformular mit Validierung im Frontend, Toast Rückmeldungen und PHP Mailversand
7. Eigene Unterseiten für rechtliche Inhalte

## Technologien

1. HTML5
2. CSS3
3. Vanilla JavaScript
4. PHP für den Versand der Kontaktanfragen
5. WebP Assets für Bilder und grafische Elemente

## Projektstruktur

```text
index.html
src/
  assets/
  pages/
  scripts/
  styles/
```

## Enthaltene Projektseiten

1. Join
2. El Pollo Loco
3. Pokedex
4. Leeferando
5. Magic Momo

## Lokal starten

1. Repository klonen oder herunterladen.
2. Den Projektordner in VS Code oder einem anderen Editor öffnen.
3. Die Startseite über einen lokalen Webserver ausliefern oder direkt die index.html im Browser öffnen.
4. Für vollständige Tests des Kontaktformulars die Backend Konfiguration an die eigene Umgebung anpassen.

## Hinweis zum Kontaktformular

Das Frontend sendet Formularanfragen aktuell an den produktiven Endpoint auf lee-roy.ch. Gleichzeitig erlaubt das PHP Skript nur Anfragen von dieser Domain. Wer das Projekt lokal oder auf einer anderen Domain testen will, muss deshalb sowohl den Endpoint in src/scripts/email.js als auch die CORS Freigabe in src/scripts/email_script.php anpassen.

## Ziel dieses Projekts

Dieses Portfolio soll nicht nur Inhalte zeigen, sondern auch Arbeitsweise sichtbar machen. Der Fokus liegt auf sauberer Frontend Umsetzung, einer klaren Benutzerführung, einer wiedererkennbaren visuellen Sprache und kleinen Interaktionen, die die Seite lebendig machen, ohne sie zu überladen.

## Kontakt

Bei Fragen oder Interesse an einer Zusammenarbeit bin ich unter info@lee-roy.ch erreichbar.