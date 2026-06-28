/* Centiem - navigatie en subtiele micro-interacties. Geen tools/widgets. */
(function () {
  "use strict";

  /* mobiele navigatie */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && window.innerWidth <= 920) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* jaartal in footer */
  var now = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = now; });

  /* mini-rekenhulp: vele kleintjes per jaar */
  var calc = document.getElementById("kleintjes-calc");
  if (calc) {
    var amt = calc.querySelector("[data-calc-amount]");
    var freq = calc.querySelector("[data-calc-freq]");
    var outY = calc.querySelector("[data-calc-year]");
    var outM = calc.querySelector("[data-calc-month]");
    var outD = calc.querySelector("[data-calc-decade]");
    var euro = function (v) {
      if (!isFinite(v) || v < 0) v = 0;
      return "€ " + Math.round(v).toLocaleString("nl-BE");
    };
    var update = function () {
      var a = parseFloat(String(amt.value).replace(",", ".")) || 0;
      var perYear = a * (parseFloat(freq.value) || 0);
      outY.textContent = euro(perYear);
      if (outM) outM.textContent = euro(perYear / 12);
      if (outD) outD.textContent = euro(perYear * 10);
    };
    amt.addEventListener("input", update);
    freq.addEventListener("change", update);
    update();
  }

  /* actieve sectie markeren in inhoudsopgave (indien aanwezig) */
  var tocLinks = document.querySelectorAll(".toc a[href^='#']");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var map = {};
    tocLinks.forEach(function (a) {
      var sec = document.getElementById(a.getAttribute("href").slice(1));
      if (sec) map[sec.id] = a;
    });
    var tobs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          tocLinks.forEach(function (a) { a.style.borderLeftColor = "transparent"; a.style.color = ""; });
          var a = map[en.target.id];
          if (a) { a.style.borderLeftColor = "var(--teal-600)"; a.style.color = "var(--teal-900)"; }
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(map).forEach(function (id) { tobs.observe(document.getElementById(id)); });
  }

  /* scroll-reveal: respecteert 'reduce motion' */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    document.documentElement.classList.add("has-reveal");
    var selectors = ".card, .stat, .callout, .band, details.example, .table-wrap, .linklist, ol.steps, ul.check, .hero-visual";
    var nodes = Array.prototype.slice.call(document.querySelectorAll(selectors));
    nodes.forEach(function (el) {
      el.setAttribute("data-reveal", "");
      /* trapsgewijze vertraging binnen eenzelfde grid */
      var parent = el.parentElement;
      if (parent && (parent.classList.contains("grid") || parent.classList.contains("stats"))) {
        var i = Array.prototype.indexOf.call(parent.children, el) % 4;
        if (i > 0) el.setAttribute("data-reveal-d", String(Math.min(i, 3)));
      }
    });
    var robs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("reveal-in"); obs.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    nodes.forEach(function (el) { robs.observe(el); });
  }
})();
