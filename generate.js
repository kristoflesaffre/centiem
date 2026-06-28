/* ===========================================================
   Centiem - statische site generator
   Bouwt alle pagina's met gedeelde header/footer.
   Run: node generate.js
   =========================================================== */
const fs = require("fs");
const path = require("path");
const OUT = __dirname;

/* ---------- centrale, geverifieerde links ---------- */
const L = {
  rechtenverkenner: { url: "https://www.rechtenverkenner.be/", src: "Vlaamse overheid" },
  ocmw: { url: "https://www.belgium.be/nl/familie/sociale_steun/ocmw", src: "Belgium.be" },
  socialekaart: { url: "https://www.desocialekaart.be/", src: "Sociale Kaart" },
  caw: { url: "https://www.caw.be/", src: "CAW" },
  ehbs: { url: "https://www.eerstehulpbijschulden.be/", src: "Eerste Hulp Bij Schulden" },
  budgetwijzer: { url: "https://www.budgetwijzer.be/", src: "Budgetwijzer (CAW)" },
  wikifin: { url: "https://www.wikifin.be/nl", src: "Wikifin (FSMA)" },
  teleonthaal: { url: "https://www.tele-onthaal.be/", src: "Tele-Onthaal (106)" },
  h1712: { url: "https://www.1712.be/", src: "Hulplijn 1712" },
  tabakstop: { url: "https://tabakstop.be/", src: "Tabakstop (0800 111 00)" },
  vtest: { url: "https://vtest.vreg.be/", src: "VREG" },
  socialtarief: { url: "https://economie.fgov.be/nl/themas/energie/sociale-energie/sociaal-tarief-voor-energie", src: "FOD Economie" },
  bestetarief: { url: "https://www.bestetarief.be/", src: "BIPT" },
  bipt: { url: "https://www.bipt.be/consumenten", src: "BIPT" },
  ombudsTelecom: { url: "https://www.ombudsmantelecom.be/nl/", src: "Ombudsdienst Telecom" },
  ombudsEnergie: { url: "https://www.ombudsmanenergie.be/nl", src: "Ombudsman Energie" },
  consumentenombuds: { url: "https://consumentenombudsdienst.be/", src: "Consumentenombudsdienst" },
  testaankoop: { url: "https://www.test-aankoop.be/", src: "Test-Aankoop" },
  huursubsidie: { url: "https://www.vlaanderen.be/de-vlaamse-huursubsidie-tegemoetkoming-in-de-huurprijs", src: "Wonen in Vlaanderen" },
  huurpremie: { url: "https://www.vlaanderen.be/de-vlaamse-huurpremie", src: "Wonen in Vlaanderen" },
  woningfonds: { url: "https://www.vlaamswoningfonds.be/", src: "Vlaams Woningfonds" },
  wonen: { url: "https://www.vlaanderen.be/bouwen-wonen-en-energie", src: "Vlaamse overheid" },
  groeipakket: { url: "https://www.groeipakket.be/", src: "Groeipakket" },
  schooltoeslag: { url: "https://gpedia.groeipakket.be/nl/thema/selectieve", src: "Groeipakket" },
  studietoelage: { url: "https://www.vlaanderen.be/studietoelagen", src: "Vlaamse overheid" },
  riziv_vt: { url: "https://www.riziv.fgov.be/nl/thema-s/verzorging-kosten-en-terugbetaling/financiele-toegankelijkheid/de-verhoogde-tegemoetkoming", src: "RIZIV" },
  riziv_psy: { url: "https://www.riziv.fgov.be/nl/thema-s/verzorging-kosten-en-terugbetaling/wat-het-ziekenfonds-terugbetaalt/geestelijke-gezondheidszorg/eerstelijns-psychologische-zorg-in-een-netwerk-voor-geestelijke-gezondheid", src: "RIZIV" },
  opwielekes: { url: "https://www.opwielekes.be/", src: "Op Wielekes" },
  vinted: { url: "https://www.vinted.be/", src: "Vinted" },
  febelfin: { url: "https://www.febelfin.be/nl", src: "Febelfin" },
  vdab: { url: "https://www.vdab.be/", src: "VDAB" },
  flexijob: { url: "https://www.socialsecurity.be/citizen/nl/flexi-jobs", src: "Sociale zekerheid" },
  kunstwerk: { url: "https://www.cultuurloket.be/kennisbank/kleine-vergoedingsregeling-kvr", src: "Cultuurloket" },
  jobat: { url: "https://www.jobat.be/nl/salariskompas", src: "Jobat salariskompas" },
};

/* ---------- component helpers ---------- */
function linklist(keys) {
  const items = keys.map(function (k) {
    const o = typeof k === "string" ? L[k] : k;
    const label = (typeof k === "string") ? labelFor(k) : k.label;
    return '<li><a class="ext" href="' + o.url + '" target="_blank" rel="noopener">' +
      '<span>' + label + '</span><span class="src">' + o.src + '</span></a></li>';
  }).join("");
  return '<ul class="linklist">' + items + "</ul>";
}
function labelFor(k) {
  const m = {
    rechtenverkenner: "Rechtenverkenner: alle premies en sociale rechten",
    ocmw: "Je OCMW: hulp, leefloon, voorschotten",
    socialekaart: "Sociale Kaart: hulp in jouw buurt vinden",
    caw: "CAW: gratis budget- en schuldhulp",
    ehbs: "Eerste Hulp Bij Schulden",
    budgetwijzer: "Budgetwijzer: zelf budgetteren",
    wikifin: "Wikifin: onafhankelijke financiële info (FSMA)",
    teleonthaal: "Tele-Onthaal: praten kan, dag en nacht (106)",
    h1712: "1712: hulplijn bij geweld en misbruik",
    tabakstop: "Tabakstop: gratis hulp om te stoppen met roken",
    vtest: "V-test: energieleveranciers vergelijken",
    socialtarief: "Sociaal tarief voor energie",
    bestetarief: "Bestetarief.be: telecom vergelijken",
    bipt: "BIPT: klachten en rechten telecom",
    ombudsTelecom: "Ombudsdienst voor Telecommunicatie",
    ombudsEnergie: "Ombudsman voor Energie",
    consumentenombuds: "Consumentenombudsdienst",
    testaankoop: "Test-Aankoop: producttests en advies",
    huursubsidie: "Vlaamse huursubsidie aanvragen",
    huurpremie: "Vlaamse huurpremie aanvragen",
    woningfonds: "Vlaams Woningfonds: sociale woonlening",
    wonen: "Wonen in Vlaanderen: premies en rechten",
    groeipakket: "Groeipakket: kinderbijslag en toeslagen",
    schooltoeslag: "Schooltoeslag (kleuter, lager, secundair)",
    studietoelage: "Studietoelage hoger onderwijs",
    riziv_vt: "Verhoogde tegemoetkoming (lagere medische kosten)",
    riziv_psy: "Terugbetaalde psychologische hulp",
    opwielekes: "Op Wielekes: fietsbibliotheek voor kinderen",
    vinted: "Vinted: tweedehands kleding",
    febelfin: "Febelfin: info over domiciliëringen en betalen",
    vdab: "VDAB: werk, opleiding en loopbaan",
    flexijob: "Flexi-jobs: bijverdienen",
    kunstwerk: "Kunstwerk: kleine vergoedingsregeling (KVR)",
    jobat: "Jobat salariskompas: check je loon",
  };
  return m[k] || k;
}
function callout(kind, title, html) {
  return '<div class="callout ' + kind + '"><p class="t">' + title + '</p>' + html + "</div>";
}
function example(summary, html) {
  return '<details class="example"><summary>Praktijkvoorbeeld: ' + summary +
    '</summary><div class="body">' + html + "</div></details>";
}
function stats(arr) {
  return '<div class="stats">' + arr.map(function (s) {
    return '<div class="stat"><div class="n">' + s.n + '</div><div class="l">' + s.l + "</div></div>";
  }).join("") + "</div>";
}
function disclaimer(txt) {
  return '<p class="disclaimer">' + txt + "</p>";
}

/* ---------- iconensysteem (consistente inline SVG, vervangt emoji) ---------- */
const ICONS = {
  compass: '<circle cx="12" cy="12" r="9"/><polygon points="15.6,8.4 11,11 8.4,15.6 13,13" fill="currentColor" stroke="none"/>',
  scale: '<line x1="12" y1="4" x2="12" y2="20"/><line x1="5" y1="7" x2="19" y2="7"/><circle cx="12" cy="5" r="1.1" fill="currentColor" stroke="none"/><path d="M5 7 2.6 12h4.8z"/><path d="M19 7l-2.4 5h4.8z"/><line x1="8" y1="20" x2="16" y2="20"/>',
  lifebuoy: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.6"/><line x1="5" y1="5" x2="9.5" y2="9.5"/><line x1="14.5" y1="14.5" x2="19" y2="19"/><line x1="19" y1="5" x2="14.5" y2="9.5"/><line x1="9.5" y1="14.5" x2="5" y2="19"/>',
  cart: '<circle cx="9.5" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M3 4h2l2.3 11.2a1 1 0 0 0 1 .8h8.2a1 1 0 0 0 1-.8L20 8H6"/>',
  refresh: '<path d="M4 11a8 8 0 0 1 13.6-5.2L20 8"/><polyline points="20,4 20,8 16,8"/><path d="M20 13a8 8 0 0 1-13.6 5.2L4 16"/><polyline points="4,20 4,16 8,16"/>',
  bolt: '<polygon points="13,2 4,14 11,14 10,22 20,9 13,9" fill="currentColor" stroke="none"/>',
  mobile: '<rect x="7" y="2.5" width="10" height="19" rx="2.6"/><line x1="11" y1="18.5" x2="13" y2="18.5"/>',
  home: '<path d="M4 11l8-7 8 7"/><path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9"/><path d="M10 20v-5h4v5"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2.2"/><path d="M8.5 7V5.4A2 2 0 0 1 10.5 3.4h3A2 2 0 0 1 15.5 5.4V7"/><line x1="3" y1="13" x2="21" y2="13"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 6.2a3 3 0 0 1 0 5.6"/><path d="M16.8 14.6A5.5 5.5 0 0 1 20.5 20"/>',
  health: '<path d="M12 20s-7-4.6-7-10a3.5 3.5 0 0 1 7-1 3.5 3.5 0 0 1 7 1c0 5.4-7 10-7 10z"/>',
  wallet: '<rect x="3" y="6" width="18" height="13" rx="2.6"/><path d="M21 11h-4.5a2 2 0 0 0 0 4H21"/><circle cx="16.7" cy="13" r=".9" fill="currentColor" stroke="none"/>',
  shield: '<path d="M12 3l8 3v5c0 5-3.4 8-8 10-4.6-2-8-5-8-10V6z"/>',
  clipboard: '<rect x="5" y="4.2" width="14" height="17" rx="2.2"/><rect x="9" y="2.6" width="6" height="3.6" rx="1.1"/><line x1="8.6" y1="11" x2="15.4" y2="11"/><line x1="8.6" y1="15" x2="13.4" y2="15"/>',
  bulb: '<path d="M9.2 18h5.6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.8 10.6c.7.6 1 1 1 2.4h5.6c0-1.4.3-1.8 1-2.4A6 6 0 0 0 12 3z"/>',
  info: '<circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="8" r="1" fill="currentColor" stroke="none"/>',
  calendar: '<rect x="4" y="5" width="16" height="16" rx="2.2"/><line x1="4" y1="9.5" x2="20" y2="9.5"/><line x1="8.5" y1="3" x2="8.5" y2="6"/><line x1="15.5" y1="3" x2="15.5" y2="6"/>',
  cup: '<path d="M5 8h11v4.5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/><path d="M16 9.2h2.4a2 2 0 0 1 0 4H16"/><line x1="7.5" y1="3.6" x2="7.5" y2="5.6"/><line x1="10.5" y1="3.6" x2="10.5" y2="5.6"/><line x1="13.5" y1="3.6" x2="13.5" y2="5.6"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.4l2.6 2.6 5.2-5.6"/>',
  tv: '<rect x="3" y="6.5" width="18" height="12" rx="2.2"/><line x1="8" y1="21" x2="16" y2="21"/><polyline points="9,3 12,6 15,3"/>',
  folder: '<path d="M4 6.5A2 2 0 0 1 6 4.5h3l2 2h7a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/>',
  calculator: '<rect x="5" y="3" width="14" height="18" rx="2.2"/><rect x="8" y="6" width="8" height="3" rx="1"/><circle cx="8.6" cy="13" r=".85" fill="currentColor" stroke="none"/><circle cx="12" cy="13" r=".85" fill="currentColor" stroke="none"/><circle cx="15.4" cy="13" r=".85" fill="currentColor" stroke="none"/><circle cx="8.6" cy="16.6" r=".85" fill="currentColor" stroke="none"/><circle cx="12" cy="16.6" r=".85" fill="currentColor" stroke="none"/><circle cx="15.4" cy="16.6" r=".85" fill="currentColor" stroke="none"/>',
  arrowback: '<polyline points="9,7 4,12 9,17"/><path d="M4 12h11a5 5 0 0 1 0 10h-1.5"/>',
  phone: '<path d="M5 4h3.6l1.8 4.5-2.3 1.4a11 11 0 0 0 5 5l1.4-2.3 4.5 1.8V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  lock: '<rect x="5" y="11" width="14" height="9.5" rx="2.2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  alert: '<path d="M12 4l9 16H3z"/><line x1="12" y1="10" x2="12" y2="14"/><circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/>',
  euro: '<path d="M17 7.6a6 6 0 1 0 0 8.8"/><line x1="4.6" y1="10.6" x2="13" y2="10.6"/><line x1="4.6" y1="13.4" x2="12" y2="13.4"/>',
  arrowright: '<line x1="4" y1="12" x2="19" y2="12"/><polyline points="13,6 19,12 13,18"/>',
  menu: '<line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/>',
  tag: '<path d="M11 3H5a2 2 0 0 0-2 2v6l9 9 8-8z"/><circle cx="7.6" cy="7.6" r="1.3" fill="currentColor" stroke="none"/>',
};
function svgIcon(name) {
  return '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || "") + "</svg>";
}
const EMOJI = {
  "🧭": "compass", "⚖": "scale", "🤝": "lifebuoy", "🛒": "cart", "🔁": "refresh",
  "⚡": "bolt", "📱": "mobile", "🏠": "home", "💼": "briefcase", "👨‍👩‍👧": "users",
  "🩺": "health", "🐷": "wallet", "🛡": "shield", "📋": "clipboard", "💡": "bulb",
  "ℹ": "info", "📅": "calendar", "☕": "cup", "✅": "check", "📺": "tv",
  "🗂": "folder", "🧮": "calculator", "↩": "arrowback", "📞": "phone", "🔒": "lock", "⚠": "alert",
  "🏷": "tag",
};
function replaceEmoji(html) {
  html = html.replace(/️/g, "");
  html = html.replace(/️/g, "");
  Object.keys(EMOJI).forEach(function (e) {
    html = html.split(e).join('<span class="ic-inline">' + svgIcon(EMOJI[e]) + "</span>");
  });
  return html;
}

/* ---------- chrome ---------- */
function brandMark() {
  return '<span class="mark"><img src="favicon.svg" alt="" aria-hidden="true"></span>';
}
const NAV = [
  ["index.html", "Home"],
  ["aanpak.html", "Het stappenplan"],
  ["gidsen.html", "Spaargidsen"],
  ["rechten-premies.html", "Rechten &amp; premies"],
  ["over.html", "Over"],
];
function header(active) {
  const links = NAV.map(function (n) {
    const cur = n[0] === active ? ' aria-current="page"' : "";
    return '<li><a href="' + n[0] + '"' + cur + ">" + n[1] + "</a></li>";
  }).join("");
  return '' +
  '<a class="skip" href="#main">Naar inhoud</a>' +
  '<header class="site-header"><div class="wrap nav">' +
    '<a class="brand" href="index.html">' + brandMark() + '<span class="brand-copy"><span class="brand-title">Centiem</span><span class="tag">slim met geld, voor iedereen</span></span></a>' +
    '<button class="nav-toggle" aria-expanded="false" aria-controls="nav-links" aria-label="Menu">' + svgIcon("menu") + '<span class="menu-text">Menu</span></button>' +
    '<ul class="nav-links" id="nav-links">' + links +
      '<li><a class="cta" href="hulp-nodig.html">Hulp nodig?</a></li>' +
    '</ul>' +
  '</div></header>';
}
function footer() {
  return '' +
  '<footer class="site-footer"><div class="wrap">' +
    '<div class="foot-grid">' +
      '<div><a class="brand" href="index.html">' + brandMark() + '<span class="brand-copy"><span class="brand-title">Centiem</span></span></a>' +
        '<p style="margin-top:.8rem;max-width:34ch;color:#9fc0bd">Onafhankelijk Vlaams platform dat helpt om bewuster met geld om te gaan en te besparen. Geen verkoop van financiële producten.</p></div>' +
      '<div><h4>Spaargidsen</h4><ul>' +
        '<li><a href="boodschappen.html">Boodschappen</a></li>' +
        '<li><a href="abonnementen.html">Abonnementen</a></li>' +
        '<li><a href="energie-water.html">Energie &amp; water</a></li>' +
        '<li><a href="telecom.html">Telecom</a></li>' +
        '<li><a href="wonen.html">Wonen</a></li>' +
      '</ul></div>' +
      '<div><h4>Thema&#39;s</h4><ul>' +
        '<li><a href="werk-inkomen.html">Werk &amp; inkomen</a></li>' +
        '<li><a href="gezin-kinderen.html">Gezin &amp; kinderen</a></li>' +
        '<li><a href="gezondheid.html">Gezondheid &amp; zorg</a></li>' +
        '<li><a href="sparen-buffer.html">Sparen &amp; buffer</a></li>' +
        '<li><a href="schulden-oplichting.html">Schulden &amp; oplichting</a></li>' +
      '</ul></div>' +
      '<div><h4>Hulp &amp; rechten</h4><ul>' +
        '<li><a href="hulp-nodig.html">Hulp nodig?</a></li>' +
        '<li><a href="rechten-premies.html">Rechten &amp; premies</a></li>' +
        '<li><a href="' + L.rechtenverkenner.url + '" target="_blank" rel="noopener">Rechtenverkenner ↗</a></li>' +
        '<li><a href="' + L.caw.url + '" target="_blank" rel="noopener">CAW ↗</a></li>' +
        '<li><a href="over.html">Over Centiem</a></li>' +
      '</ul></div>' +
    '</div>' +
    '<p class="foot-note">Centiem is een conceptplatform (&copy; <span data-year>2026</span>). De informatie is algemeen en geen persoonlijk financieel, juridisch of fiscaal advies. Bedragen en voorwaarden van premies wijzigen: controleer altijd de officiële bron. Bij geldzorgen is gratis hulp beschikbaar via het <a href="' + L.ocmw.url + '" target="_blank" rel="noopener">OCMW</a> en het <a href="' + L.caw.url + '" target="_blank" rel="noopener">CAW</a>.</p>' +
  '</div></footer>';
}
function page(opts) {
  const desc = (opts.desc || "Onafhankelijk Vlaams platform om slim met geld om te gaan en te besparen.").replace(/"/g, "&quot;");
  return '<!doctype html>\n<html lang="nl">\n<head>\n' +
    '<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<title>' + opts.title + ' &middot; Centiem</title>\n' +
    '<meta name="description" content="' + desc + '">\n' +
    '<link rel="icon" type="image/svg+xml" href="favicon.svg">\n' +
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
    '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">\n' +
    '<link rel="stylesheet" href="assets/styles.css">\n' +
    '</head>\n<body>\n' +
    header(opts.active) +
    '<main id="main">\n' + replaceEmoji(opts.body) + '\n</main>\n' +
    footer() +
    '\n<script src="assets/app.js"></script>\n</body>\n</html>\n';
}
function pagehead(crumbLabel, h1, intro, bg) {
  return '<div class="pagehead header-bg-' + (bg || 'guides') + '"><div class="wrap">' +
    '<nav class="crumbs" aria-label="kruimelpad"><a href="index.html">Home</a><span>›</span>' + crumbLabel + '</nav>' +
    '<h1>' + h1 + '</h1><p>' + intro + '</p>' +
  '</div></div>';
}

const PAGES = [];
function add(file, title, active, body, desc) { PAGES.push({ file: file, html: page({ title: title, active: active, body: body, desc: desc }) }); }

/* ============================================================
   HOME
   ============================================================ */
add("index.html", "Slim met geld, voor iedereen", "index.html", '' +
  '<section class="hero header-bg-home"><div class="wrap"><div class="hero-grid">' +
    '<div>' +
      '<p class="eyebrow">Onafhankelijk &middot; gratis &middot; Vlaams</p>' +
      '<h1>Grip op je <span class="hl">geld</span>, stap voor stap</h1>' +
      '<p class="lead">Centiem bundelt heldere uitleg, concrete bespaartips en je rechten en premies op één plek. Voor iedereen die bewuster met geld wil omgaan, en in het bijzonder voor wie het financieel moeilijker heeft.</p>' +
      '<div class="hero-actions">' +
        '<a class="btn btn-primary" href="aanpak.html">Begin met het stappenplan</a>' +
        '<a class="btn btn-ghost" href="gidsen.html">Waarop kan je besparen?</a>' +
        '<a class="btn btn-amber" href="hulp-nodig.html">Ik heb nu hulp nodig</a>' +
      '</div>' +
    '</div>' +
  '</div></div></section>' +

  '<section><div class="wrap">' +
    '<div class="grid cols-3">' +
      '<div class="card"><div class="ic">🧭</div><h3>Begrijpelijk</h3><p>Geen jargon. Korte uitleg, concrete voorbeelden en stappen die je vandaag kan zetten.</p></div>' +
      '<div class="card"><div class="ic">⚖️</div><h3>Onafhankelijk</h3><p>We verkopen niets. We wijzen je naar officiële bronnen en neutrale vergelijkers.</p></div>' +
      '<div class="card"><div class="ic">🤝</div><h3>Voor iedereen</h3><p>Van je eerste budget tot premies en gratis hulp wanneer het moeilijk gaat.</p></div>' +
    '</div>' +
  '</div></section>' +

  '<section class="section-alt"><div class="wrap">' +
    '<p class="eyebrow">Wat levert het op</p>' +
    '<h2>Kleine beslissingen, grote bedragen</h2>' +
    '<p class="lead measure">Veel kleine uitgaven lijken onschuldig, maar op een jaar tellen ze hard op. Een paar voorbeelden uit echte gezinsbudgetten.</p>' +
    stats([
      { n: "€ 4.000", l: "per jaar aan sigaretten in één gezin (€ 334 per maand)" },
      { n: "€ 1.368", l: "per jaar voor 5 blikjes frisdrank per dag" },
      { n: "€ 540", l: "per jaar bespaard met huismerk-luiers in plaats van een A-merk" },
    ]) +
    '<p class="muted" style="font-size:.85rem;margin-top:.8rem">Cijfers ter illustratie. Jouw situatie kan verschillen.</p>' +
  '</div></section>' +

  '<section id="gidsen"><div class="wrap">' +
    '<p class="eyebrow">Spaargidsen</p>' +
    '<h2>Waar wil je op besparen?</h2>' +
    '<div class="grid cols-3" style="margin-top:1.2rem">' +
      gcard("🛒", "Boodschappen", "Huismerken, slimmer winkelen, minder weggooien.", "boodschappen.html") +
      gcard("🔁", "Abonnementen", "Streaming, fitness, verzekeringen: wat gebruik je echt?", "abonnementen.html") +
      gcard("⚡", "Energie &amp; water", "Sociaal tarief, vergelijken en verbruik verlagen.", "energie-water.html") +
      gcard("📱", "Telecom &amp; internet", "Goedkoper bellen en surfen door te vergelijken.", "telecom.html") +
      gcard("🏠", "Wonen", "Huurpremie, sociale lening, huren of kopen.", "wonen.html") +
      gcard("💼", "Werk &amp; inkomen", "Je loon checken, bijverdienen, meer overhouden.", "werk-inkomen.html") +
      gcard("👨‍👩‍👧", "Gezin &amp; kinderen", "Studeren, zakgeld, kinderbijslag en toeslagen.", "gezin-kinderen.html") +
      gcard("🩺", "Gezondheid &amp; zorg", "Terugbetalingen, verhoogde tegemoetkoming, verzekering.", "gezondheid.html") +
      gcard("🐷", "Sparen &amp; buffer", "Een buffer opbouwen en sparen voor je doelen.", "sparen-buffer.html") +
    '</div>' +
    '<p style="margin-top:1.4rem"><a class="btn btn-ghost" href="gidsen.html">Bekijk alle thema&#39;s</a></p>' +
  '</div></section>' +

  '<section><div class="wrap"><div class="band">' +
    '<div class="grid cols-2" style="align-items:center;gap:2rem">' +
      '<div><h2>Even moeilijk? Hulp is gratis en vertrouwelijk</h2>' +
      '<p>Kom je niet rond of stapelen de rekeningen zich op? Je staat er niet alleen voor. Het OCMW en het CAW helpen je gratis met budget, schulden en je rechten.</p>' +
      '<div class="flex"><a class="btn btn-amber" href="hulp-nodig.html">Naar hulp en contactpunten</a>' +
      '<a class="btn btn-ghost" href="rechten-premies.html">Bekijk je rechten en premies</a></div></div>' +
      '<div><ul class="check" style="margin:0">' +
        '<li>Hulp bij budget en schulden via OCMW en CAW</li>' +
        '<li>Premies en sociale tarieven die je misschien misloopt</li>' +
        '<li>Praten kan dag en nacht via Tele-Onthaal (106)</li>' +
      '</ul></div>' +
    '</div>' +
  '</div></div></section>'
);
function gcard(ic, title, txt, href) {
  return '<a class="card link-card" href="' + href + '">' +
    '<div class="card-head"><div class="ic">' + ic + '</div>' +
    '<div class="card-body"><h3>' + title + '</h3><p>' + txt + '</p></div></div>' +
    '<span class="more">Bekijk gids ' + svgIcon("arrowright") + '</span></a>';
}
function calculator() {
  return '<div class="calc" id="kleintjes-calc">' +
    '<div class="calc-inputs">' +
      '<div class="calc-field"><label for="calc-amount">Bedrag</label>' +
        '<div class="calc-money"><span aria-hidden="true">€</span>' +
        '<input type="number" id="calc-amount" data-calc-amount inputmode="decimal" min="0" step="0.50" value="3.75" aria-label="Bedrag in euro"></div></div>' +
      '<div class="calc-field"><label for="calc-freq">Hoe vaak?</label>' +
        '<select id="calc-freq" data-calc-freq>' +
          '<option value="365">per dag</option>' +
          '<option value="52">per week</option>' +
          '<option value="12">per maand</option>' +
        '</select></div>' +
    '</div>' +
    '<div class="stats calc-out" aria-live="polite">' +
      '<div class="stat"><div class="n" data-calc-year>€ 0</div><div class="l">per jaar</div></div>' +
      '<div class="stat"><div class="n" data-calc-month>€ 0</div><div class="l">per maand</div></div>' +
      '<div class="stat"><div class="n" data-calc-decade>€ 0</div><div class="l">over 10 jaar</div></div>' +
    '</div>' +
  '</div>';
}
function heroArt() {
  return '<svg viewBox="0 0 440 360" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="28" y="64" width="384" height="248" rx="22" fill="#ffffff" stroke="#e8ebef"/>' +
    '<rect x="54" y="90" width="120" height="12" rx="6" fill="#eef1f3"/>' +
    '<rect x="54" y="110" width="74" height="10" rx="5" fill="#f1f4f5"/>' +
    '<line x1="54" y1="276" x2="386" y2="276" stroke="#e1e6ea" stroke-width="2"/>' +
    '<rect x="66" y="206" width="46" height="70" rx="9" fill="#cfe7e6"/>' +
    '<rect x="132" y="176" width="46" height="100" rx="9" fill="#8fcdca"/>' +
    '<rect x="198" y="141" width="46" height="135" rx="9" fill="#2f9aa0"/>' +
    '<rect x="264" y="106" width="46" height="170" rx="9" fill="#0d5b61"/>' +
    '<polyline points="89,200 155,170 221,135 287,100" fill="none" stroke="#08363b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="89" cy="200" r="4.5" fill="#08363b"/><circle cx="155" cy="170" r="4.5" fill="#08363b"/><circle cx="221" cy="135" r="4.5" fill="#08363b"/><circle cx="287" cy="100" r="4.5" fill="#08363b"/>' +
    '<g transform="translate(0,0)">' +
      '<circle cx="356" cy="92" r="46" fill="#e08527"/>' +
      '<circle cx="356" cy="92" r="35" fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="2"/>' +
      '<path d="M369 78 a16 16 0 1 0 0 28" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>' +
      '<line x1="341" y1="88" x2="362" y2="88" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>' +
      '<line x1="341" y1="98" x2="358" y2="98" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>' +
    '</g>' +
    '<g transform="translate(300,250)">' +
      '<rect x="0" y="0" width="104" height="40" rx="20" fill="#e6f6ee" stroke="#bfe6cf"/>' +
      '<circle cx="22" cy="20" r="11" fill="#1f9d63"/>' +
      '<path d="M17 20l4 4 7-8" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<rect x="40" y="13" width="50" height="6" rx="3" fill="#1f9d63" fill-opacity="0.5"/>' +
      '<rect x="40" y="24" width="34" height="6" rx="3" fill="#1f9d63" fill-opacity="0.3"/>' +
    '</g>' +
  '</svg>';
}

/* ============================================================
   AANPAK
   ============================================================ */
add("aanpak.html", "Het stappenplan in 5 stappen", "aanpak.html",
  pagehead('Het stappenplan', 'Grip op je geld in 5 stappen',
    'Dit stappenplan is gebaseerd op de methode die budgetcoaches gebruiken, hier uitgewerkt zodat iedereen het kan volgen. Je hoeft niet alles in één keer te doen: elke stap apart levert al iets op.', 'planning') +
  '<section><div class="wrap with-aside">' +
    '<nav class="toc" aria-label="Op deze pagina"><h4>Op deze pagina</h4><ul>' +
      '<li><a href="#s1">1. Uitgaven in kaart</a></li>' +
      '<li><a href="#s2">2. Bespaar op maandelijkse kosten</a></li>' +
      '<li><a href="#s3">3. Pak andere uitgaven aan</a></li>' +
      '<li><a href="#s4">4. Bouw een buffer</a></li>' +
      '<li><a href="#s5">5. Spaar voor je doelen</a></li>' +
    '</ul></nav>' +
    '<div>' +
      '<h2 id="s1">Stap 1 &middot; Breng je uitgaven in kaart</h2>' +
      '<p>Je kan pas besparen als je weet waar je geld naartoe gaat. Overloop je rekeninguittreksels van de voorbije maanden en verdeel alles in categorieën: boodschappen, vaste kosten, vervoer, vrije tijd, abonnementen, enzovoort.</p>' +
      '<ul class="check"><li>Gebruik een eenvoudige gratis budgetapp (<a class="hl-link" href="https://budgetplanner.wakosta.be/home" target="_blank" rel="noopener">Wakosta budgetplanner</a>) of een blad papier. Het hoeft niet ingewikkeld te zijn.</li>' +
      '<li>Vul niet elke dag in, maar om de paar dagen. Zo blijft het haalbaar en hou je het vol.</li>' +
      '<li>Let ook op kleine, terugkerende uitgaven. Net die tellen op een jaar hard op.</li>' +
      '<li>Begin grof. Een ruwe verdeling in 6 à 8 categorieën is genoeg om de grootste lekken te zien. Verfijnen kan later.</li></ul>' +
      example('kleine uitgaven optellen',
        '<p>Een man deed regelmatig kleine aankopen voor gaming. Apart leek dat onschuldig, maar opgeteld over een jaar werd het een fors bedrag. Door alles samen te tellen werd de echte jaarkost pas zichtbaar en bespreekbaar.</p>') +

      '<h2 id="s2">Stap 2 &middot; Bespaar op je maandelijkse kosten</h2>' +
      '<p>Vaste kosten lopen elke maand automatisch door, ook als je ze niet meer gebruikt. Dit is vaak het snelst te besparen, zonder dat je er elke dag mee bezig bent.</p>' +
      '<ul class="check"><li>Overloop al je abonnementen: streaming, fitness, kranten, verzekeringen. Gebruik je het nog?</li>' +
      '<li>Vergelijk energie (V-test) en telecom (Bestetarief.be) en stap over als het goedkoper kan.</li>' +
      '<li>Controleer of je recht hebt op het sociaal tarief of andere premies.</li></ul>' +
      '<div class="grid cols-3" style="margin-top:1.4rem">' +
        gcard("⚡", "Energie &amp; water", "Sociaal tarief, vergelijken en verbruik verlagen.", "energie-water.html") +
        gcard("📱", "Telecom &amp; internet", "Goedkoper bellen en surfen.", "telecom.html") +
        gcard("🔁", "Andere maandelijkse kosten", "Streaming, fitness, verzekeringen en goede doelen.", "abonnementen.html") +
      '</div>' +

      '<h2 id="s3">Stap 3 &middot; Pak andere uitgaven aan</h2>' +
      '<p>Naast veel kleine uitgaven zijn er soms enkele grote lekken: een dure gewoonte, een lening, of een betaling waar je geen waar voor krijgt.</p>' +
      '<ul class="cross check"><li>Persoonlijke leningen voor dagelijkse uitgaven of luxe worden afgeraden.</li>' +
      '<li>Dure gewoontes (roken, dagelijks frisdrank of takeaway) kosten vaak honderden euro&#39;s per maand.</li>' +
      '<li>Onbekende of louche domiciliëringen: controleer wat er maandelijks van je rekening gaat.</li></ul>' +
      example('een verborgen, ongewenste betaling',
        '<p>Bij een gezin ging elke maand geld naar een bedrijf waarvan ze het bestaan amper kenden: een verzekering die ongemerkt was meegekomen bij de aankoop van een toestel. Test-Aankoop en reviewsites bevestigden veel klachten. De aanpak: 1) de domiciliëring blokkeren bij de bank, 2) per aangetekende brief opzeggen bij het bedrijf.</p>') +
      '<div class="grid cols-3" style="margin-top:1.4rem">' +
        gcard("🛒", "Boodschappen", "Huismerken, slimmer winkelen en minder weggooien.", "boodschappen.html") +
        gcard("🛡️", "Schulden &amp; oplichting", "Leningen, ongewenste betalingen en oplichting.", "schulden-oplichting.html") +
        gcard("🧮", "Vele kleintjes", "Hoe kleine dagelijkse uitgaven op een jaar oplopen.", "kleine-uitgaven.html") +
      '</div>' +

      '<h2 id="s4">Stap 4 &middot; Bouw een buffer van 3 tot 6 maanden</h2>' +
      '<p>Een spaarbuffer geeft rust en vangt onverwachte kosten op. Een vaak gehanteerde vuistregel: hou drie tot zes maanden vaste lasten (of inkomen) opzij. Voor een koppel is dat de som van beide inkomens, maal de gekozen aantal maanden.</p>' +
      example('een buffer opbouwen in 3 jaar',
        '<p>Een koppel rekende uit dat zes maanden samen neerkwam op € 22.000. Door dat doel te spreiden over drie jaar (36 maanden) werd het behapbaar: € 22.000 / 36 = ongeveer € 600 per maand sparen. Een groot doel werd zo een haalbare maandelijkse stap.</p>') +
      '<p><a href="sparen-buffer.html">→ Gids: sparen en je buffer opbouwen</a></p>' +

      '<h2 id="s5">Stap 5 &middot; Spaar gericht voor je doelen</h2>' +
      '<p>Heb je een concreet doel, zoals een reis of een grote aankoop? Reken terug naar een maandbedrag, en verschuif waar nodig bestaande kosten naar je doel.</p>' +
      example('sparen voor een reis',
        '<p>Een gezin wilde op reis voor € 5.000. De rekening: € 5.000 / 12 = ongeveer € 416 per maand. Door enkele ongebruikte abonnementen op te zeggen en dat geld door te schuiven naar het reisdoel, kwam de reis in beeld zonder lening.</p>') +
      callout('tip', '📅 Maak er een gewoonte van', '<p>Zet elk jaar één dag in je agenda om je financiële gezondheid te checken: welke keuzes van vorig jaar kloppen nog, en wat pas je aan?</p>') +
      disclaimer('Dit stappenplan is algemene informatie, geen persoonlijk financieel advies. Bedragen zijn voorbeelden ter illustratie. Voor begeleiding op maat kan je gratis terecht bij het CAW of je OCMW.') +
    '</div>' +
  '</div></section>'
);

/* ============================================================
   GIDSEN (hub)
   ============================================================ */
add("gidsen.html", "Spaargidsen", "gidsen.html",
  pagehead('Spaargidsen', 'Waarop kan je besparen?',
    'Per thema leggen we uit waar je op kan besparen, met concrete voorbeelden en de juiste officiële links. Begin gerust bij het onderwerp dat voor jou nu het zwaarst weegt.', 'guides') +
  '<section><div class="wrap">' +
    '<div class="grid cols-3">' +
      gcard("🛒", "Boodschappen", "Huismerken, slimmer winkelen en minder weggooien.", "boodschappen.html") +
      gcard("🧮", "Vele kleintjes", "Hoe kleine dagelijkse uitgaven op een jaar oplopen.", "kleine-uitgaven.html") +
      gcard("🔁", "Abonnementen &amp; vaste kosten", "Streaming, fitness, verzekeringen en goede doelen.", "abonnementen.html") +
      gcard("⚡", "Energie &amp; water", "Sociaal tarief, vergelijken en verbruik verlagen.", "energie-water.html") +
      gcard("📱", "Telecom &amp; internet", "Goedkoper bellen en surfen.", "telecom.html") +
      gcard("🏠", "Wonen", "Huurpremie, sociale lening, huren of kopen, cohousing.", "wonen.html") +
      gcard("💼", "Werk &amp; inkomen", "Je loon checken, bijverdienen, meer overhouden.", "werk-inkomen.html") +
      gcard("👨‍👩‍👧", "Gezin &amp; kinderen", "Studeren, zakgeld, kinderbijslag en toeslagen.", "gezin-kinderen.html") +
      gcard("🩺", "Gezondheid &amp; zorg", "Terugbetalingen, verhoogde tegemoetkoming, verzekering.", "gezondheid.html") +
      gcard("🐷", "Sparen &amp; buffer", "Een buffer opbouwen en sparen voor je doelen.", "sparen-buffer.html") +
      gcard("🛡️", "Schulden &amp; oplichting", "Negatieve cashflow, leningen en ongewenste betalingen.", "schulden-oplichting.html") +
      gcard("📋", "Rechten &amp; premies", "Wat je misschien misloopt aan steun en toeslagen.", "rechten-premies.html") +
      gcard("🤝", "Hulp nodig?", "Gratis budget- en schuldhulp en contactpunten.", "hulp-nodig.html") +
    '</div>' +
  '</div></section>'
);

/* ---------------- VELE KLEINTJES ---------------- */
add("kleine-uitgaven.html", "Vele kleintjes maken een groot bedrag", "gidsen.html",
  pagehead('<a href="gidsen.html">Spaargidsen</a> <span>›</span> Vele kleintjes', 'Vele kleintjes maken een groot bedrag',
    'Een koffie hier, een blikje daar: apart lijkt het niets. Maar kleine, dagelijkse uitgaven tellen op een jaar verrassend hard op. Hieronder zie je hoe, met een rekenhulp om het voor jezelf uit te rekenen.', 'guides') +
  '<section><div class="wrap"><div class="measure">' +
    '<h2>Waarom kleine bedragen zo zwaar wegen</h2>' +
    '<p>Een uitgave van een paar euro voelt onschuldig aan. Het venijn zit in de herhaling: iets wat je elke dag koopt, koop je 365 keer per jaar. Net die optelsom maakt het verschil, en is meteen ook de eenvoudigste plek om te besparen zonder dat je leven er echt anders door wordt.</p>' +
    '<p>Begin daarom met je terugkerende uitgaven samen te tellen. Pas wanneer je de jaarkost ziet, wordt zichtbaar wat een gewoonte je echt kost en kan je bewust kiezen.</p>' +
  '</div></div></section>' +
  '<section class="section-alt"><div class="wrap"><div class="measure">' +
    '<p class="eyebrow">Reken het zelf uit</p>' +
    '<h2>Wat kost een gewoonte per jaar?</h2>' +
    '<p>Vul in hoeveel je aan iets uitgeeft en hoe vaak. Je ziet meteen wat het je per jaar (en op tien jaar) kost.</p>' +
    calculator() +
    '<p class="muted" style="font-size:.85rem;margin-top:.8rem">Een schatting ter illustratie. We houden geen rekening met prijsstijgingen of rente.</p>' +
  '</div></div></section>' +
  '<section><div class="wrap"><div class="measure">' +
    '<h2>Voorbeelden uit echte gezinsbudgetten</h2>' +
    '<p>Deze cijfers komen uit echte budgetten. Apart leek elke uitgave klein, maar op een jaar liep het flink op.</p>' +
    stats([
      { n: "€ 4.000", l: "per jaar aan sigaretten in één gezin (€ 334 per maand)" },
      { n: "€ 1.368", l: "per jaar voor 5 blikjes frisdrank per dag" },
      { n: "€ 540", l: "per jaar bespaard met huismerk-luiers in plaats van een A-merk" },
    ]) +
    '<p class="muted" style="font-size:.85rem;margin-top:.8rem">Cijfers ter illustratie. Jouw situatie kan verschillen.</p>' +
    example('kleine uitgaven optellen',
      '<p>Een man deed regelmatig kleine aankopen voor gaming. Apart leek dat onschuldig, maar opgeteld over een jaar werd het een fors bedrag. Door alles samen te tellen werd de echte jaarkost pas zichtbaar en bespreekbaar.</p>') +
    example('frisdrank en de blinde test',
      '<p>Een tiener dronk 5 blikjes cola per dag. Aan € 0,75 per blikje is dat € 3,75 per dag en zo&#39;n € 1.368 per jaar. In een blinde test gaf hij de cola 4/10 en een huismerk 7/10. Minder blikjes én een goedkoper merk: dubbele winst.</p>') +
    example('belegde broodjes en takeaway',
      '<p>Bij meerdere gezinnen ging een groot deel van het budget naar takeaway en horeca. Vaker zelf koken bleek telkens een van de eenvoudigste manieren om fors te besparen.</p>') +
    callout('tip', '☕ Eénmalige aankoop, jaarlijkse winst', '<p>Een volautomatische koffiemachine in plaats van cups kan ongeveer € 600 per jaar besparen. Bereken bij zo&#39;n aankoop altijd de terugverdientijd.</p>') +
    '<h2>Zo pak je het aan</h2>' +
    '<ul class="check">' +
      '<li>Overloop je rekeninguittreksels en tel je terugkerende kleine uitgaven samen per jaar.</li>' +
      '<li>Kies één of twee gewoontes om te verminderen, niet alles tegelijk. Zo hou je het vol.</li>' +
      '<li>Test goedkopere alternatieven (huismerk, zelf maken) blind. Vaak merk je het verschil niet.</li>' +
      '<li>Zet wat je bespaart meteen apart, zodat de winst zichtbaar wordt.</li>' +
    '</ul>' +
    '<p><a href="boodschappen.html">→ Gids: besparen op boodschappen</a> &nbsp;·&nbsp; <a href="aanpak.html">Het stappenplan</a></p>' +
    disclaimer('Algemene informatie, geen persoonlijk financieel advies. Bedragen zijn voorbeelden ter illustratie. Voor begeleiding op maat kan je gratis terecht bij het CAW of je OCMW.') +
  '</div></div></section>',
  'Kleine dagelijkse uitgaven tellen op een jaar hard op. Reken met onze rekenhulp uit wat een gewoonte je per jaar kost.'
);

/* helper voor gidsinhoud */
function guide(intro, blocks) { return intro + '<section><div class="wrap"><div class="measure">' + blocks + '</div></div></section>'; }

/* ---------------- BOODSCHAPPEN ---------------- */
add("boodschappen.html", "Besparen op boodschappen", "gidsen.html",
  pagehead('<a href="gidsen.html">Spaargidsen</a> <span>›</span> Boodschappen', 'Besparen op boodschappen',
    'Eten en drinken is een van de grootste posten in een gezinsbudget, en net daar valt veel te winnen zonder echt in te boeten op kwaliteit of plezier.', 'groceries') +
  '<section><div class="wrap"><div class="measure">' +
    '<h2>Huismerken: vaak even goed, soms beter</h2>' +
    '<p>Huismerken (de eigen merken van de supermarkt) zijn gemiddeld duidelijk goedkoper dan A-merken, terwijl de kwaliteit volgens onafhankelijke tests vaak gelijkwaardig of zelfs beter is. Veel huismerken rollen bovendien van dezelfde productieband als de bekende merken.</p>' +
    callout('tip', '💡 Doe de blinde test', '<p>Niet overtuigd? Test thuis een A-merk tegen een huismerk zonder het etiket te zien. Laat ook de kinderen meedoen, het is verrassend en leerrijk.</p>') +
    example('frisdrank en de blinde test',
      '<p>Een tiener dronk 5 blikjes cola per dag. Aan € 0,75 per blikje is dat € 3,75 per dag en zo&#39;n € 1.368 per jaar. In een blinde test gaf hij de cola 4/10 en een huismerk 7/10. Minder blikjes én een goedkoper merk: dubbele winst.</p>') +
    example('luiers uit de blinde test',
      '<p>Een gezin kocht enkel het duurste A-merk luiers. Een blinde test wees uit dat huismerken bovenaan eindigden. Door over te schakelen bespaarde het gezin 30 tot 45 euro per maand (ongeveer 12 tot 18 cent per luier in plaats van 30 cent), goed voor € 360 tot € 540 per jaar.</p>') +
    example('katten- en ander voer',
      '<p>Een gezin gaf € 116 per maand uit aan kattenvoer. Met een blinde smaaktest bij de katten zelf, met enkele goedkopere maar kwalitatieve alternatieven, bleek dat het ook veel voordeliger kon, zonder dat de dieren het verschil maakten.</p>') +

    '<h2>Slimmer winkelen</h2>' +
    '<ul class="check">' +
      '<li>Doe minder vaak boodschappen en kies vaker een grotere supermarkt: dat is doorgaans voordeliger dan veel kleine aankopen in de buurtwinkel.</li>' +
      '<li>Maak een lijst en ga niet met honger winkelen. Zo koop je minder impulsief.</li>' +
      '<li>Vergelijk de prijs per kilo of per liter, niet de prijs per verpakking.</li>' +
      '<li>Plan je maaltijden en gebruik restjes, zodat je minder eten weggooit.</li>' +
    '</ul>' +

    '<h2>Zelf maken in plaats van kant-en-klaar</h2>' +
    '<p>Belegde broodjes, takeaway en uit eten zijn gezellig, maar wegen zwaar door. Zelf koken en je lunch meenemen scheelt al snel honderden euro&#39;s per jaar.</p>' +
    example('belegde broodjes en takeaway',
      '<p>Bij meerdere gezinnen ging een groot deel van het budget naar takeaway en horeca. Vaker zelf koken bleek telkens een van de eenvoudigste manieren om fors te besparen.</p>') +
    callout('tip', '☕ Eénmalige aankoop, jaarlijkse winst', '<p>Een volautomatische koffiemachine in plaats van cups kan ongeveer € 600 per jaar besparen. Bereken bij zo&#39;n aankoop altijd de terugverdientijd.</p>') +

    '<h2>Handige, onafhankelijke bronnen</h2>' +
    linklist(['testaankoop', 'wikifin', 'budgetwijzer']) +
    disclaimer('Bedragen zijn illustratieve voorbeelden en algemene tests; jouw besparing hangt af van je eigen aankopen. Test-Aankoop is een onafhankelijke consumentenorganisatie (lidmaatschap kan betalend zijn).') +
  '</div></div></section>'
);

/* ---------------- ABONNEMENTEN ---------------- */
add("abonnementen.html", "Abonnementen en vaste kosten", "gidsen.html",
  pagehead('<a href="gidsen.html">Spaargidsen</a> <span>›</span> Abonnementen', 'Abonnementen en vaste kosten',
    'Vaste kosten lopen elke maand automatisch door, ook als je ze nauwelijks gebruikt. Een grondige opkuis levert vaak meteen het meeste op, en je hoeft het maar één keer te doen.', 'subscriptions') +
  '<section><div class="wrap"><div class="measure">' +
    '<h2>Maak de lijst van alles wat doorloopt</h2>' +
    '<p>Overloop je rekening van de voorbije maanden en noteer elk abonnement en elke domiciliëring: streamingdiensten, muziek, fitness, kranten en tijdschriften, verzekeringen, software, goede doelen, alarmsystemen.</p>' +
    '<p>Stel je bij elk de simpele vraag: <strong>gebruik ik dit nog, en is het de jaarprijs waard?</strong> Reken maandprijzen om naar een jaarbedrag, dan wordt de keuze makkelijker.</p>' +
    example('abonnementen onder de loep',
      '<p>Gezinnen schrapten na een overzicht onder meer een ongebruikt fitnessabonnement, een tijdschriftabonnement en een streamingdienst. Eén gezin stortte € 30 per maand aan drie goede doelen (€ 360 per jaar) en koos er bewust voor om er twee van stop te zetten en één te behouden.</p>') +
    callout('info', 'ℹ️ Goede doelen', '<p>Stoppen met een gift is een persoonlijke keuze. Wil je blijven geven maar gerichter? Eén doel kiezen dat je echt belangrijk vindt, kan even waardevol zijn als verspreid geven.</p>') +

    '<h2>Verzekeringen: dubbel of overbodig?</h2>' +
    '<p>Verzekeringen sluipen soms ongemerkt je budget binnen, bijvoorbeeld bij de aankoop van een toestel. Controleer of je niet dubbel verzekerd bent en of je elke polis echt nodig hebt.</p>' +
    example('een ongewenste verzekering opzeggen',
      '<p>Bij een gezin ging maandelijks geld naar een verzekering bij een bedrijf met veel klachten, ongemerkt afgesloten bij een toestelaankoop. De aanpak: de domiciliëring blokkeren bij de bank én per aangetekende brief opzeggen bij het bedrijf. <a href="schulden-oplichting.html">Lees hoe je dat aanpakt</a>.</p>') +

    '<h2>Opzeggen en overstappen, stap voor stap</h2>' +
    '<ol class="steps">' +
      '<li><strong>Check de opzegtermijn en -wijze</strong> in je contract of op de website van de aanbieder.</li>' +
      '<li><strong>Zeg schriftelijk op</strong>, bij voorkeur per e-mail of aangetekende brief, zodat je een bewijs hebt.</li>' +
      '<li><strong>Een domiciliëring stop je bij het bedrijf zelf</strong>, niet via de bank. De bank kan een betaling enkel blokkeren, dat is iets anders dan opzeggen.</li>' +
      '<li><strong>Blijft een probleem duren?</strong> Schakel de bevoegde ombudsdienst in (telecom, energie of consument).</li>' +
    '</ol>' +

    '<h2>Officiële en handige bronnen</h2>' +
    linklist(['febelfin', 'consumentenombuds', 'testaankoop']) +
    disclaimer('De voorbeelden zijn illustratief. Controleer altijd je eigen contractvoorwaarden voor opzegtermijnen.') +
  '</div></div></section>'
);

/* ---------------- ENERGIE & WATER ---------------- */
add("energie-water.html", "Besparen op energie en water", "gidsen.html",
  pagehead('<a href="gidsen.html">Spaargidsen</a> <span>›</span> Energie &amp; water', 'Besparen op energie en water',
    'Energie is voor veel gezinnen een zware en sterk schommelende kost. Met de juiste formule, een mogelijke korting en wat gewoonteveranderingen bespaar je vaak honderden euro&#39;s per jaar.', 'utilities') +
  '<section><div class="wrap"><div class="measure">' +
    '<h2>Vergelijk je energiecontract met de V-test</h2>' +
    '<p>De V-test van de VREG is de officiële, onafhankelijke vergelijking van alle energiecontracten in Vlaanderen. Je geeft je verbruik in en ziet meteen of je goedkoper af bent bij een ander contract of een andere leverancier.</p>' +
    example('overstappen naar een betere formule',
      '<p>Iemand gaf ongeveer € 100 per maand te veel uit aan energie. Met een vergelijking en een overstap naar een betere formule was die kost snel terug te dringen.</p>') +
    callout('tip', '💡 Doe de test 1 keer per jaar', '<p>Tarieven veranderen voortdurend. Eén keer per jaar vergelijken en eventueel overstappen kan een vast bespaarmoment worden.</p>') +

    '<h2>Sociaal tarief: een sterk verlaagd tarief</h2>' +
    '<p>Het sociaal tarief is een door de overheid vastgelegd, fors lager tarief voor elektriciteit en aardgas. Wie tot een rechthebbende categorie behoort (bijvoorbeeld via een leefloon, een tegemoetkoming of bepaalde uitkeringen) krijgt het in veel gevallen <strong>automatisch</strong> toegekend.</p>' +
    callout('help', '✅ Controleer je recht', '<p>Twijfel je of je recht hebt? Check het bij de FOD Economie of vraag het na bij je OCMW. Het verschil met het gewone tarief is groot.</p>') +

    '<h2>Minder verbruiken, structureel</h2>' +
    '<ul class="check">' +
      '<li>Verlaag je verwarming een graadje en verwarm gericht de ruimtes die je gebruikt.</li>' +
      '<li>Spoor sluipverbruik op: toestellen op stand-by, oude diepvriezers, verlichting.</li>' +
      '<li>Korter en koeler douchen scheelt zowel op water als op energie.</li>' +
      '<li>Informeer naar premies voor isolatie en zuinige toestellen via Wonen in Vlaanderen.</li>' +
    '</ul>' +

    '<h2>Officiële bronnen</h2>' +
    linklist(['vtest', 'socialtarief', 'wonen', 'ombudsEnergie']) +
    disclaimer('Voorwaarden en bedragen van het sociaal tarief en premies wijzigen regelmatig. Controleer steeds de actuele info bij de officiële instanties.') +
  '</div></div></section>'
);

/* ---------------- TELECOM ---------------- */
add("telecom.html", "Besparen op telecom en internet", "gidsen.html",
  pagehead('<a href="gidsen.html">Spaargidsen</a> <span>›</span> Telecom', 'Besparen op telecom en internet',
    'Veel mensen betalen jaar na jaar te veel voor bellen, sms&#39;en en internet, simpelweg omdat ze nooit vergelijken. Overstappen is makkelijker dan het lijkt.', 'subscriptions') +
  '<section><div class="wrap"><div class="measure">' +
    '<h2>Vergelijk met Bestetarief.be</h2>' +
    '<p>Bestetarief.be is de officiële, gratis vergelijkingstool van het BIPT (de telecomwaakhond). Je geeft je gebruik in (bellen, data, internet, tv) en ziet welk tariefplan het best bij je past, bij alle operatoren.</p>' +
    callout('tip', '💡 Tot honderden euro&#39;s per jaar', '<p>Volgens het BIPT kan je door je mobiele tariefplan te vergelijken al snel tot € 120 per jaar besparen. Voor een gezin met meerdere abonnementen loopt dat verder op.</p>') +
    example('te veel betalen voor telecom',
      '<p>Bij verschillende gezinnen bleek het telecomabonnement duurder dan nodig. Door over te stappen naar een goedkoper plan, vaak met evenveel data en belminuten, daalde de factuur direct.</p>') +

    '<h2>Overstappen zonder gedoe</h2>' +
    '<ol class="steps">' +
      '<li><strong>Breng je echte gebruik in kaart:</strong> hoeveel data, bellen en welke tv-zenders heb je nodig?</li>' +
      '<li><strong>Vergelijk</strong> via Bestetarief.be en kies het best passende plan.</li>' +
      '<li><strong>Je nummer behouden kan.</strong> De nieuwe operator regelt de overstap meestal voor jou.</li>' +
      '<li><strong>Problemen?</strong> De Ombudsdienst voor Telecommunicatie helpt gratis.</li>' +
    '</ol>' +
    callout('info', '📺 Tv apart bekijken', '<p>Veel Vlaamse zenders zijn gratis online te bekijken. Ga na of je nog een dure decoder of tv-abonnement nodig hebt.</p>') +

    '<h2>Officiële bronnen</h2>' +
    linklist(['bestetarief', 'bipt', 'ombudsTelecom']) +
    disclaimer('Besparingsbedragen zijn indicaties van het BIPT; je eigen winst hangt af van je huidige abonnement en gebruik.') +
  '</div></div></section>'
);

/* ---------------- WONEN ---------------- */
add("wonen.html", "Besparen op wonen", "gidsen.html",
  pagehead('<a href="gidsen.html">Spaargidsen</a> <span>›</span> Wonen', 'Wonen: premies, leningen en slimme keuzes',
    'Wonen is meestal de grootste kost in een budget. Er bestaan Vlaamse premies en leningen die veel mensen mislopen, en soms is een andere woonvorm een grote besparing.', 'housing') +
  '<section><div class="wrap"><div class="measure">' +
    '<h2>Huurpremie en huursubsidie</h2>' +
    '<p>De Vlaamse overheid heeft twee tegemoetkomingen voor huurders met een bescheiden inkomen. Veel mensen weten niet dat ze er recht op hebben.</p>' +
    '<ul class="check">' +
      '<li><strong>Huursubsidie</strong>: als je verhuist naar een geschikte, betaalbare huurwoning. Aanvragen tot uiterlijk 9 maanden na de start van je huurcontract.</li>' +
      '<li><strong>Huurpremie</strong>: als je al 4 jaar of langer op de wachtlijst voor een sociale woning staat en privé huurt. Je krijgt dan meestal automatisch een aanvraagformulier toegestuurd.</li>' +
    '</ul>' +
    callout('warn', '⚠️ Vraag het tijdig aan', '<p>Duizenden gezinnen lopen elke maand geld mis omdat ze deze steun niet aanvragen. Je kan huurpremie en huursubsidie niet samen ontvangen; wie op beide recht heeft, krijgt de huurpremie.</p>') +

    '<h2>Sociale woonlening via het Vlaams Woningfonds</h2>' +
    '<p>Kom je niet of moeilijk aan een lening bij de bank, dan kan een sociale woonlening van het Vlaams Woningfonds een oplossing zijn, vaak met een gunstigere rentevoet dan bij banken.</p>' +
    example('kopen zonder grote eigen inbreng',
      '<p>Iemand had € 35.000 spaargeld, maar dat bleek niet genoeg als eigen inbreng bij een bank. Via een sociale woonlening kwam aankopen toch in beeld, met een competitievere rentevoet en zonder de strikte eigen inbreng die banken vaak vragen. Voorwaarden gelden, check je situatie.</p>') +

    '<h2>Huren of kopen, en andere woonvormen</h2>' +
    '<p>Door de gestegen rente is huren in sommige situaties tijdelijk voordeliger dan kopen. Bekijk het nuchter voor jouw geval. Ook een andere woonvorm kan veel schelen.</p>' +
    example('cohousing als kostenbesparing',
      '<p>Iemand verdiende € 2.200 per maand en betaalde € 980 huur, bijna de helft van het inkomen. Cohousing (samen wonen en kosten delen) werd voorgesteld als manier om de vaste woonkost stevig te verlagen.</p>') +
    callout('info', '🏷️ Vergeet de woonpremies niet', '<p>Voor isolatie, een nieuwe ketel of renovatie bestaan er Vlaamse premies. Bekijk ze via Wonen in Vlaanderen en de Rechtenverkenner.</p>') +

    '<h2>Officiële bronnen</h2>' +
    linklist(['huurpremie', 'huursubsidie', 'woningfonds', 'wonen', 'rechtenverkenner']) +
    disclaimer('Voorwaarden, inkomensgrenzen en bedragen worden jaarlijks aangepast. Controleer je recht altijd bij Wonen in Vlaanderen of het Vlaams Woningfonds.') +
  '</div></div></section>'
);

/* ---------------- WERK & INKOMEN ---------------- */
add("werk-inkomen.html", "Werk en inkomen", "gidsen.html",
  pagehead('<a href="gidsen.html">Spaargidsen</a> <span>›</span> Werk &amp; inkomen', 'Meer overhouden: werk en inkomen',
    'Besparen is één kant. De andere kant is wat er binnenkomt. Soms levert een eerlijke check van je loon of een slimme bijverdienste meer op dan eindeloos snoeien.', 'work') +
  '<section><div class="wrap"><div class="measure">' +
    '<h2>Check of je loon klopt</h2>' +
    '<p>Weet je hoeveel je netto per gewerkt uur verdient? Reken het eens uit. Soms blijkt dat een andere job of een ander statuut financieel een wereld van verschil maakt.</p>' +
    example('van € 7 per uur naar fors meer',
      '<p>Een kleine zelfstandige (ergotherapeute) werkte 60 uur per week voor € 1.700 netto, omgerekend amper € 7 per uur. Door als bediende aan de slag te gaan en het oude werk in bijberoep te doen, hield ze € 1.300 netto méér per maand over.</p>') +
    callout('tip', '💡 Vergelijk je loon', '<p>Met een salariskompas (bijvoorbeeld via Jobat) zie je wat anderen in jouw functie en sector verdienen. Een nuttige check voor een gesprek of een nieuwe stap.</p>') +

    '<h2>Bijverdienen, eerlijk en voordelig</h2>' +
    '<ul class="check">' +
      '<li><strong>Vraag geld voor wat je doet.</strong> Wie een talent (bijvoorbeeld fotografie) gratis weggeeft, laat inkomen liggen. Betaalde opdrachten mogen.</li>' +
      '<li><strong>Flexi-jobs</strong> laten werknemers en gepensioneerden voordelig bijverdienen.</li>' +
      '<li><strong>De kleine vergoedingsregeling (KVR)</strong> bestaat voor wie af en toe een artistieke prestatie levert.</li>' +
    '</ul>' +
    example('een talent te gelde maken',
      '<p>Iemand was fotografe in bijberoep maar vroeg geen geld voor haar werk. Door wél te factureren voor opdrachten, werd haar hobby een echte bron van inkomsten.</p>') +

    '<h2>Werk, opleiding en loopbaan</h2>' +
    '<p>Denk je aan een andere job of bijscholing? De VDAB begeleidt je gratis bij werk zoeken, opleidingen en loopbaankeuzes.</p>' +

    '<h2>Officiële en handige bronnen</h2>' +
    linklist(['jobat', 'vdab', 'flexijob', 'kunstwerk']) +
    disclaimer('Een verandering van statuut of job heeft gevolgen voor je sociale rechten en belastingen. Win advies in bij een boekhouder, je ziekenfonds of de VDAB voor je situatie.') +
  '</div></div></section>'
);

/* ---------------- GEZIN & KINDEREN ---------------- */
add("gezin-kinderen.html", "Gezin en kinderen", "gidsen.html",
  pagehead('<a href="gidsen.html">Spaargidsen</a> <span>›</span> Gezin &amp; kinderen', 'Gezin en kinderen: kosten en toeslagen',
    'Kinderen brengen kosten mee, maar ook rechten. Van het Groeipakket tot studietoelagen en slimme tweedehandsoplossingen: hier zie je waar je op kan besparen en wat je kan aanvragen.', 'family') +
  '<section><div class="wrap"><div class="measure">' +
    '<h2>Studeren: ken de kosten én de steun</h2>' +
    '<p>Hoger onderwijs kost geld, maar er is meer steun dan veel ouders denken. Breng de kosten in kaart en check je recht op een studietoelage.</p>' +
    '<div class="table-wrap"><table><thead><tr><th>Situatie</th><th>Indicatieve kost per jaar</th></tr></thead><tbody>' +
      '<tr><td>Student die thuis woont</td><td>ongeveer € 10.156</td></tr>' +
      '<tr><td>Kotstudent</td><td>ongeveer € 15.346</td></tr>' +
      '<tr><td>Besparing omdat het kind niet meer thuis woont</td><td>ongeveer &minus; € 3.532</td></tr>' +
    '</tbody></table></div>' +
    '<p class="muted" style="font-size:.85rem">Indicatieve cijfers. Werkelijke kosten verschillen per opleiding en gezin.</p>' +
    example('recht op een studietoelage',
      '<p>Een alleenstaande moeder bleek recht te hebben op een studietoelage van ongeveer € 4.354. De toelage voor hoger onderwijs moet je zelf aanvragen via de Vlaamse overheid; voor kleuter-, lager en secundair onderwijs gebeurt de schooltoeslag in Vlaanderen meestal automatisch via het Groeipakket.</p>') +

    '<h2>Zakgeld met maat</h2>' +
    example('zakgeld halveren',
      '<p>Een tiener kreeg € 200 zakgeld per maand. Volgens een expert was dat het dubbele van het hoogste bedrag dat kinderen van die leeftijd gemiddeld krijgen. Het zakgeld werd gehalveerd, zonder dat de jongere echt tekortkwam.</p>') +
    callout('info', 'ℹ️ Zakgeld leert budgetteren', '<p>Een vast, redelijk bedrag helpt kinderen leren omgaan met geld. De juiste hoogte hangt af van leeftijd en wat het zakgeld moet dekken.</p>') +

    '<h2>Groeipakket, toeslagen en verhoogde kinderbijslag</h2>' +
    '<p>Het Groeipakket bundelt de Vlaamse kinderbijslag en extra toeslagen (zoals de schooltoeslag en sociale toeslagen). In bepaalde situaties, bijvoorbeeld bij een handicap of zware medische zorg, kan er een verhoogde tegemoetkoming zijn.</p>' +
    example('verhoogde kinderbijslag om medische redenen',
      '<p>Een koppel met een tweeling die te vroeg geboren was, had hoge medische kosten. Ze bleken recht te hebben op een fors hogere kinderbijslag om medische redenen. Zulke toeslagen worden vaak niet automatisch gekend, dus loont het de moeite om ze na te vragen.</p>') +

    '<h2>Slim besparen met kinderen</h2>' +
    '<ul class="check">' +
      '<li>Kinderfietsen groeien snel te klein. Via een fietsbibliotheek zoals Op Wielekes leen je voor een klein jaarbedrag een fiets en ruil je hem als hij te klein wordt.</li>' +
      '<li>Tweedehands kleding en speelgoed (bijvoorbeeld via Vinted of kringloop) scheelt aanzienlijk.</li>' +
      '<li>Goedkopere uitstappen kunnen even leuk zijn als dure pretparken.</li>' +
    '</ul>' +

    '<h2>Officiële en handige bronnen</h2>' +
    linklist(['groeipakket', 'studietoelage', 'opwielekes', 'vinted', 'rechtenverkenner']) +
    disclaimer('Bedragen en voorwaarden van toelagen wijzigen. Controleer je recht via het Groeipakket en de Vlaamse studietoelagen.') +
  '</div></div></section>'
);

/* ---------------- GEZONDHEID ---------------- */
add("gezondheid.html", "Gezondheid en zorg", "gidsen.html",
  pagehead('<a href="gidsen.html">Spaargidsen</a> <span>›</span> Gezondheid &amp; zorg', 'Gezondheid: terugbetalingen en rechten',
    'Medische kosten lopen snel op, maar je krijgt vaak meer terugbetaald dan je denkt. Het begint bij je facturen tijdig indienen en je rechten kennen.', 'health') +
  '<section><div class="wrap"><div class="measure">' +
    '<h2>Dien je medische facturen altijd in</h2>' +
    '<p>Onkostennota&#39;s en getuigschriften die je niet indient bij je ziekenfonds, leveren geen terugbetaling op. Het is geld dat zomaar blijft liggen.</p>' +
    example('vergeten facturen, € 2.235 misgelopen',
      '<p>Een vrouw was vier grote facturen vergeten in te dienen bij het ziekenfonds en liep daardoor ongeveer € 2.235 aan terugbetalingen mis. Een vast moment om alles in te dienen, voorkomt dat.</p>') +
    callout('tip', '🗂️ Maak er een routine van', '<p>Verzamel je medische bewijsstukken op één plek en dien ze maandelijks in, bijvoorbeeld via de app of het loket van je ziekenfonds.</p>') +

    '<h2>Verhoogde tegemoetkoming: lagere kosten bij de dokter</h2>' +
    '<p>Met de verhoogde tegemoetkoming betaal je minder bij de dokter, de tandarts en de apotheek. Heel wat mensen hebben er recht op, soms automatisch (bijvoorbeeld via een leefloon of bepaalde uitkeringen), soms na een inkomensonderzoek door het ziekenfonds.</p>' +
    callout('help', '✅ Vraag het na bij je ziekenfonds', '<p>Niet zeker of je in aanmerking komt? Je ziekenfonds kan je inkomen toetsen en het recht toekennen. Het scheelt structureel op al je zorgkosten.</p>') +

    '<h2>Herbekijk je hospitalisatieverzekering</h2>' +
    example('een betere polis levert meer op',
      '<p>Een koppel met hoge medische kosten ontdekte dat een hospitalisatieverzekering van ongeveer € 45 per jaar meer, het voorbije jaar zo&#39;n € 2.400 extra aan terugbetalingen zou hebben opgeleverd. Een polis vergelijken loont, zeker bij terugkerende zorgkosten.</p>') +

    '<h2>Terugbetaalde psychologische hulp</h2>' +
    '<p>Bij een psycholoog of orthopedagoog die is aangesloten bij een netwerk geestelijke gezondheid, betaal je voor eerstelijns psychologische zorg een verlaagd bedrag: de eerste individuele sessie is gratis, daarna betaal je € 11 per sessie (€ 4 met verhoogde tegemoetkoming). Voor kinderen en jongeren tot en met 23 jaar is het aanbod gratis.</p>' +

    '<h2>Officiële bronnen</h2>' +
    linklist(['riziv_vt', 'riziv_psy', 'rechtenverkenner']) +
    disclaimer('Bedragen en voorwaarden van terugbetalingen wijzigen. Je ziekenfonds is je eerste aanspreekpunt voor je persoonlijke situatie.') +
  '</div></div></section>'
);

/* ---------------- SPAREN & BUFFER ---------------- */
add("sparen-buffer.html", "Sparen en je buffer", "gidsen.html",
  pagehead('<a href="gidsen.html">Spaargidsen</a> <span>›</span> Sparen &amp; buffer', 'Sparen en je buffer opbouwen',
    'Sparen lukt het best met een doel en een plan. Met een buffer voor onverwachte kosten en gericht sparen voor je dromen krijg je rust én vooruitgang.', 'savings') +
  '<section><div class="wrap"><div class="measure">' +
    '<h2>Eerst een buffer voor onverwachte kosten</h2>' +
    '<p>Een spaarbuffer is je financiële schokdemper. Een vaak gebruikte vuistregel is drie tot zes maanden vaste lasten of inkomen opzij houden. Voor een koppel reken je met beide inkomens samen.</p>' +
    example('een groot doel haalbaar maken',
      '<p>Voor een koppel kwam zes maanden neer op € 22.000. Gespreid over drie jaar (36 maanden) werd dat ongeveer € 600 per maand. Door het doel op te delen werd sparen concreet en haalbaar.</p>') +
    '<div class="callout tip"><p class="t">🧮 Zo reken je je buffer</p><p>Tel je vaste maandlasten op (of je netto maandinkomen), kies 3 tot 6 maanden, en deel het doelbedrag door het aantal maanden waarin je het wil bereiken. Dat is je maandelijkse spaarbedrag.</p></div>' +

    '<h2>Daarna gericht sparen voor je doelen</h2>' +
    '<p>Heb je een concreet doel, reken dan terug naar een maandbedrag en geef het voorrang.</p>' +
    example('sparen voor een reis van € 5.000',
      '<p>€ 5.000 gedeeld door 12 maanden is ongeveer € 416 per maand. Door enkele ongebruikte abonnementen op te zeggen en dat geld door te schuiven naar het reisdoel, kwam de reis in beeld zonder lening. Ook op de reis zelf kan je besparen: een appartement in plaats van een hotel, een goedkoper land of zelf je reis samenstellen scheelt elk al snel honderden euro&#39;s.</p>') +
    callout('info', '🔁 Verschuif kosten naar je doel', '<p>Een krachtige techniek: zeg een kost op die je niet mist (bijvoorbeeld een ongebruikt fitnessabonnement) en laat dat bedrag automatisch naar je spaardoel gaan.</p>') +

    '<h2>Geef bewust een budget aan vrije tijd</h2>' +
    '<p>Ontspanning mag, maar zonder grens loopt het snel op. Uitstappen, cadeaus, speelgoed en hobby&#39;s samen kunnen een van je grootste posten worden.</p>' +
    example('van € 1.100 naar een bewust budget',
      '<p>Een gezin gaf gemiddeld € 839 per maand uit aan uitstapjes, en ruim € 1.100 per maand (meer dan € 13.000 per jaar) aan ontspanning in het algemeen. Met een bewust budget van € 300 per maand en goedkopere alternatieven bleef het leuk én betaalbaar.</p>') +

    '<h2>Eén keer per jaar: financiële check</h2>' +
    callout('tip', '📅 Zet het in je agenda', '<p>Plan jaarlijks een vast moment om je geldzaken te overlopen: welke keuzes van vorig jaar kloppen nog, en wat pas je aan? Pauzeer bijvoorbeeld pensioensparen tijdelijk als je nu eerst voor een woning spaart, en herneem het later.</p>') +

    '<h2>Handige, onafhankelijke bronnen</h2>' +
    linklist(['wikifin', 'budgetwijzer']) +
    disclaimer('Sparen, pensioensparen en beleggen hebben elk eigen fiscale gevolgen. Dit is algemene informatie, geen persoonlijk financieel advies.') +
  '</div></div></section>'
);

/* ---------------- SCHULDEN & OPLICHTING ---------------- */
add("schulden-oplichting.html", "Schulden en oplichting", "gidsen.html",
  pagehead('<a href="gidsen.html">Spaargidsen</a> <span>›</span> Schulden &amp; oplichting', 'Schulden, oplichting en ongewenste betalingen',
    'Wanneer er meer buitengaat dan binnenkomt, of wanneer geld verdwijnt naar wie er geen recht op heeft, is snel en gericht ingrijpen belangrijk. Je hoeft dat niet alleen te doen.', 'debt') +
  '<section><div class="wrap"><div class="measure">' +
    '<h2>Negatieve cashflow: keer het tij</h2>' +
    '<p>Geef je structureel meer uit dan er binnenkomt, dan teren je reserves op of groeien je schulden. De eerste stap is altijd: in kaart brengen waar het geld naartoe gaat.</p>' +
    example('het grootste lek vinden',
      '<p>Een gezin had een structureel tekort van € 700 per maand. Een ander gaf € 658 per maand uit aan vrije tijd die ze eigenlijk niet nodig hadden, ongeveer € 8.000 per jaar. Door de grootste posten zichtbaar te maken, werd duidelijk waar ingrijpen het meest opleverde.</p>') +
    callout('warn', '⚠️ Leningen voor dagelijkse uitgaven', '<p>Een persoonlijke lening afsluiten voor gewone uitgaven of luxe wordt sterk afgeraden. Het verschuift het probleem en maakt het duurder. Zoek liever hulp om de oorzaak aan te pakken.</p>') +

    '<h2>Ongewenste of louche betalingen stoppen</h2>' +
    '<p>Controleer je rekening op betalingen die je niet (her)kent. Soms sluip een abonnement of verzekering ongemerkt mee bij een aankoop.</p>' +
    example('geld naar een louche bedrijf',
      '<p>Bij een gezin ging maandelijks geld naar een bedrijf met veel klachten, ongemerkt afgesloten bij de aankoop van toestellen. Test-Aankoop en reviewsites bevestigden de slechte reputatie.</p>') +
    '<ol class="steps">' +
      '<li><strong>Check de reputatie</strong> van het bedrijf via Test-Aankoop en onafhankelijke reviews.</li>' +
      '<li><strong>Blokkeer de domiciliëring</strong> bij je bank, zodat er geen geld meer vertrekt.</li>' +
      '<li><strong>Zeg op per aangetekende brief</strong> bij het bedrijf zelf. Blokkeren via de bank is niet hetzelfde als opzeggen.</li>' +
      '<li><strong>Geraak je er niet uit?</strong> Schakel de Consumentenombudsdienst of de bevoegde ombudsman in.</li>' +
    '</ol>' +
    callout('info', '↩️ Onterechte domiciliëring', '<p>Een uitgevoerde Europese domiciliëring kan je via je bank in principe tot acht weken laten terugbetalen. Dat betekent niet dat een eventuele schuld vervalt; de opzeg regel je bij het bedrijf.</p>') +

    '<h2>Kom je er niet uit? Hulp is gratis</h2>' +
    '<p>Bij geldzorgen of schulden helpen het OCMW en het CAW je gratis en vertrouwelijk met budgetbegeleiding, schuldbemiddeling en je rechten. Hoe vroeger, hoe meer mogelijkheden.</p>' +
    '<p><a class="btn btn-amber" href="hulp-nodig.html">Naar hulp en contactpunten</a></p>' +

    '<h2>Officiële bronnen</h2>' +
    linklist(['testaankoop', 'consumentenombuds', 'caw', 'ehbs']) +
    disclaimer('De voorbeelden zijn illustratief. Bij juridische stappen kan je gratis eerstelijns rechtshulp en het Justitiehuis of een advocaat raadplegen.') +
  '</div></div></section>'
);

/* ---------------- RECHTEN & PREMIES ---------------- */
add("rechten-premies.html", "Rechten en premies", "rechten-premies.html",
  pagehead('Rechten &amp; premies', 'Rechten en premies die je misschien misloopt',
    'In Vlaanderen en België bestaan duizenden premies, toeslagen en sociale tarieven. Veel mensen vragen ze niet aan, gewoon omdat ze niet weten dat ze er recht op hebben. Hier vind je de belangrijkste, met de officiële weg ernaartoe.', 'rights') +
  '<section><div class="wrap"><div class="measure">' +
    '<div class="callout info"><p class="t">🧭 Begin hier: de Rechtenverkenner</p><p>De Rechtenverkenner van de Vlaamse overheid bundelt premies, toeslagen en sociale rechten van álle overheden (lokaal, Vlaams en federaal) op één plek. Je zoekt op je situatie en ziet meteen waar je recht op hebt.</p><p style="margin-bottom:0"><a class="ext" href="' + L.rechtenverkenner.url + '" target="_blank" rel="noopener"><strong>Open de Rechtenverkenner ↗</strong></a></p></div>' +

    '<h2>Energie en water</h2>' +
    linklist(['socialtarief', 'vtest']) +
    '<h2>Wonen</h2>' +
    linklist(['huurpremie', 'huursubsidie', 'woningfonds', 'wonen']) +
    '<h2>Gezin en onderwijs</h2>' +
    linklist(['groeipakket', 'schooltoeslag', 'studietoelage']) +
    '<h2>Gezondheid en zorg</h2>' +
    linklist(['riziv_vt', 'riziv_psy']) +
    '<h2>Algemeen overzicht en advies</h2>' +
    linklist(['rechtenverkenner', 'wikifin', 'caw']) +

    callout('help', '🤝 Hulp bij het aanvragen', '<p>Raak je niet wijs uit de voorwaarden of formulieren? Het OCMW, het CAW en sociale diensten helpen je gratis bij het aanvragen. <a href="hulp-nodig.html">Vind hulp in je buurt</a>.</p>') +
    disclaimer('Premies, bedragen en voorwaarden wijzigen voortdurend en verschillen soms per gemeente. Beschouw deze lijst als startpunt en controleer altijd de actuele info bij de officiële instantie.') +
  '</div></div></section>'
);

/* ---------------- HULP NODIG ---------------- */
add("hulp-nodig.html", "Hulp nodig", "hulp-nodig.html",
  '<div class="pagehead header-bg-rights"><div class="wrap">' +
    '<nav class="crumbs" aria-label="kruimelpad"><a href="index.html">Home</a><span>›</span> Hulp nodig</nav>' +
    '<h1>Hulp nodig? Je staat er niet alleen voor</h1>' +
    '<p>Kom je niet rond, stapelen de rekeningen zich op, of weet je even niet meer waar te beginnen? Hulp is gratis, vertrouwelijk en er is geen reden om je te schamen. Hoe vroeger je aanklopt, hoe meer er mogelijk is.</p>' +
  '</div></div>' +
  '<section><div class="wrap"><div class="measure">' +
    '<h2>Bij wie kan je terecht?</h2>' +
    '<div class="grid cols-2">' +
      '<div class="card"><h3>OCMW</h3><p>Elk OCMW (Openbaar Centrum voor Maatschappelijk Welzijn) in je gemeente helpt met budgetbegeleiding, schuldbemiddeling, een leefloon, voorschotten en je rechten.</p><p><a class="ext" href="' + L.ocmw.url + '" target="_blank" rel="noopener">Wat doet het OCMW ↗</a></p></div>' +
      '<div class="card"><h3>CAW</h3><p>Het Centrum Algemeen Welzijnswerk biedt gratis hulp bij geld, administratie, schulden en meer. Voor budget- en schuldhulp verwijst het CAW je vaak naar je lokale OCMW of een erkende dienst.</p><p><a class="ext" href="' + L.caw.url + '" target="_blank" rel="noopener">Naar het CAW ↗</a></p></div>' +
      '<div class="card"><h3>Eerste Hulp Bij Schulden</h3><p>Heldere uitleg over schulden, budgetbegeleiding en waar je hulp vindt.</p><p><a class="ext" href="' + L.ehbs.url + '" target="_blank" rel="noopener">eerstehulpbijschulden.be ↗</a></p></div>' +
      '<div class="card"><h3>Sociale Kaart</h3><p>Zoek hulp- en zorgdiensten in jouw buurt op naam, gemeente of thema.</p><p><a class="ext" href="' + L.socialekaart.url + '" target="_blank" rel="noopener">desocialekaart.be ↗</a></p></div>' +
    '</div>' +

    '<h2>Wat kan je verwachten?</h2>' +
    '<ol class="steps">' +
      '<li><strong>Een luisterend oor.</strong> Een hulpverlener overloopt rustig je situatie, zonder oordeel.</li>' +
      '<li><strong>Overzicht.</strong> Samen breng je je inkomsten, uitgaven en eventuele schulden in kaart.</li>' +
      '<li><strong>Een plan.</strong> Je krijgt hulp bij budget, betalingsregelingen, en het aanvragen van premies en rechten.</li>' +
      '<li><strong>Opvolging.</strong> Indien nodig is er budgetbegeleiding, schuldbemiddeling of budgetbeheer.</li>' +
    '</ol>' +

    '<div class="callout help"><p class="t">📞 Praten kan altijd</p><p><strong>Tele-Onthaal</strong> is dag en nacht bereikbaar op het gratis nummer <strong>106</strong> voor wie nood heeft aan een gesprek. Bij vragen over geweld of misbruik bel je <strong>1712</strong>.</p></div>' +

    '<h2>Specifieke hulp</h2>' +
    linklist(['teleonthaal', 'h1712', 'tabakstop', 'rechtenverkenner', 'budgetwijzer']) +

    '<div class="callout warn"><p class="t">Dringende nood?</p><p>Bij een noodsituatie of acuut gevaar bel je het Europese noodnummer <strong>112</strong>. Voel je je niet veilig, of denk je aan zelfdoding, dan kan je dag en nacht terecht bij de Zelfmoordlijn op <strong>1813</strong>.</p></div>' +
    disclaimer('Centiem biedt informatie, geen hulpverlening op maat. De diensten hierboven zijn de officiële kanalen voor persoonlijke begeleiding in Vlaanderen en België.') +
  '</div></div></section>'
);

/* ---------------- OVER ---------------- */
add("over.html", "Over Centiem", "over.html",
  pagehead('Over', 'Over Centiem',
    'Centiem is een onafhankelijk Vlaams platform dat mensen helpt om bewuster met geld om te gaan en te besparen. Voor iedereen, en in het bijzonder voor wie het financieel moeilijker heeft.', 'home') +
  '<section><div class="wrap"><div class="measure">' +
    '<h2>Waar we voor staan</h2>' +
    '<div class="grid cols-2">' +
      '<div class="card"><div class="ic">⚖️</div><h3>Onafhankelijk</h3><p>We verkopen geen financiële producten en duwen niets in je richting. We verwijzen naar officiële bronnen en neutrale vergelijkers.</p></div>' +
      '<div class="card"><div class="ic">🧭</div><h3>Begrijpelijk</h3><p>Heldere taal, concrete voorbeelden en stappen die je echt kan zetten.</p></div>' +
      '<div class="card"><div class="ic">🤝</div><h3>Voor iedereen</h3><p>Van je eerste budget tot premies, rechten en gratis hulp wanneer het moeilijk gaat.</p></div>' +
      '<div class="card"><div class="ic">🔒</div><h3>Respect voor privacy</h3><p>Informatie eerst. Je hoeft geen rekening te koppelen om iets te leren of te vinden.</p></div>' +
    '</div>' +

    '<h2>Hoe deze informatie tot stand komt</h2>' +
    '<p>De inhoud steunt op twee pijlers. Ten eerste algemene inzichten en methodes uit budgetcoaching, die budgetcoaches gebruiken om gezinnen grip te geven op hun geld. De voorbeelden en bedragen op deze site dienen ter illustratie en zijn in eigen woorden uitgewerkt. Ten tweede de officiële Vlaamse en federale instanties voor de premies, rechten en hulpverlening waarnaar we verwijzen.</p>' +
    '<p>We werken die inzichten uit tot volledige, evergreen informatie en koppelen ze aan de juiste officiële kanalen. Bedragen en voorwaarden wijzigen; we verwijzen daarom altijd door naar de actuele bron.</p>' +

    '<div class="callout info"><p class="t">ℹ️ Een conceptplatform</p><p>Centiem is momenteel een concept. Deze versie focust bewust op een zo volledig mogelijk informatieoverzicht. Interactieve tools (zoals een budget- of bufferrekenaar) komen in een latere fase.</p></div>' +

    '<h2>Belangrijke kanttekening</h2>' +
    '<p>Centiem geeft algemene informatie, geen persoonlijk financieel, juridisch of fiscaal advies. Voor begeleiding op maat verwijzen we naar het OCMW, het CAW en de bevoegde officiële diensten.</p>' +

    '<h2>Bronnen en partners</h2>' +
    linklist(['rechtenverkenner', 'wikifin', 'testaankoop', 'caw', 'ocmw']) +
    disclaimer('De voorbeelden en bedragen op deze site zijn illustratief en in eigen woorden opgesteld. Centiem is onafhankelijk en niet verbonden met of goedgekeurd door de genoemde diensten, organisaties of media.') +
  '</div></div></section>'
);

/* <<PAGES>> */

/* ============================================================
   BUILD
   ============================================================ */
PAGES.forEach(function (p) {
  fs.writeFileSync(path.join(OUT, p.file), p.html);
});
console.log("Gegenereerd: " + PAGES.length + " pagina's");
PAGES.forEach(function (p) { console.log(" - " + p.file); });
