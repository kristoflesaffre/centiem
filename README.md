# Centiem

Onafhankelijk Vlaams platform dat mensen helpt om bewuster met geld om te gaan en te besparen. Voor iedereen, en in het bijzonder voor wie het financieel moeilijker heeft.

Dit is een statische, volledig responsieve website (HTML, CSS, een beetje JavaScript). Geen build-frameworks nodig: je kan `index.html` rechtstreeks openen in een browser.

## Inhoud

- **Het stappenplan** (`aanpak.html`): grip op je geld in 5 stappen.
- **Waarop besparen?** (`gidsen.html` + themapagina's): boodschappen, abonnementen, energie en water, telecom, wonen, werk en inkomen, gezin en kinderen, gezondheid, sparen en buffer, schulden en oplichting.
- **Rechten en premies** (`rechten-premies.html`): overzicht met links naar officiële bronnen.
- **Hulp nodig?** (`hulp-nodig.html`): gratis budget- en schuldhulp en contactpunten.
- **Over** (`over.html`).

## Structuur

```
index.html, aanpak.html, gidsen.html, ...   gegenereerde pagina's
favicon.svg                                  munt-favicon
assets/styles.css                            designsysteem
assets/app.js                                navigatie en micro-interacties
generate.js                                  bouwt alle HTML-pagina's
```

## Pagina's (her)genereren

De HTML-pagina's worden gegenereerd uit één bron, `generate.js`, met gedeelde header, footer en componenten. Na een wijziging in `generate.js`:

```bash
node generate.js
```

Dat schrijft alle `*.html`-bestanden opnieuw weg. `assets/styles.css` en `assets/app.js` worden los onderhouden en hoeven niet gegenereerd te worden.

## Toegankelijkheid en privacy

- Nederlandstalig, taalniveau gericht op brede toegankelijkheid.
- Semantische HTML, skip-link, zichtbare focus, respect voor `prefers-reduced-motion`.
- Geen tracking, geen externe afbeeldingen; iconen en illustraties zijn eigen inline SVG.

## Disclaimer

De informatie is algemeen en geen persoonlijk financieel, juridisch of fiscaal advies. Bedragen en voorwaarden van premies wijzigen: controleer altijd de officiële bron. Voorbeelden zijn illustratief. Centiem is onafhankelijk en niet verbonden met de genoemde diensten, organisaties of media.
