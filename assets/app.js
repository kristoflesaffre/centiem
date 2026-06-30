/* Centiem - navigatie, rekenhulpen en subtiele micro-interacties. */
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
    var freqGroup = calc.querySelector("[data-calc-freq]");
    var outY = calc.querySelector("[data-calc-year]");
    var outM = calc.querySelector("[data-calc-month]");
    var outD = calc.querySelector("[data-calc-decade]");
    var euro = function (v) {
      if (!isFinite(v) || v < 0) v = 0;
      return "€ " + Math.round(v).toLocaleString("nl-BE");
    };
    var getFreq = function () {
      var checked = freqGroup.querySelector("input[type=radio]:checked");
      return checked ? parseFloat(checked.value) : 365;
    };
    var update = function () {
      var a = parseFloat(String(amt.value).replace(",", ".")) || 0;
      var perYear = a * getFreq();
      outY.textContent = euro(perYear);
      if (outM) outM.textContent = euro(perYear / 12);
      if (outD) outD.textContent = euro(perYear * 10);
    };
    amt.addEventListener("input", update);
    freqGroup.addEventListener("change", update);
    update();
  }

  /* zwevende rekenhulp: maandelijkse besparing naar jaarbasis */
  document.querySelectorAll("[data-savings-widget]").forEach(function (widget) {
    var id = widget.getAttribute("data-savings-widget");
    var btn = widget.querySelector("[data-savings-open]");
    var overlay = widget.querySelector("[data-savings-overlay='" + id + "']");
    var modal = widget.querySelector("#savings-modal-" + id);
    var input = widget.querySelector("[data-savings-amount]");
    var output = widget.querySelector("[data-savings-year]");
    var closeBtn = widget.querySelector("[data-savings-close]");
    if (!btn || !overlay || !modal || !input || !output) return;

    var syncSideRail = function () {
      var viewport = window.innerWidth || document.documentElement.clientWidth;
      var gap = 24;
      var edge = 24;
      var minWidth = 180;
      var microWidth = 220;
      var tightWidth = 280;
      var compactWidth = 340;
      var maxWidth = 440;
      var contentRight = 0;
      var selectors = [
        "main .measure",
        "main .table-wrap",
        "main .band",
        "main .grid",
        "main .pagehead .ph-inner"
      ];

      document.querySelectorAll(selectors.join(",")).forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.right > contentRight) contentRight = rect.right;
      });
      if (!contentRight) {
        var main = document.querySelector("main");
        if (main) contentRight = main.getBoundingClientRect().right;
      }

      var available = viewport - contentRight - gap - edge;
      var sideRail = viewport >= 1180 && available >= minWidth;
      var panelWidth = Math.max(minWidth, Math.min(maxWidth, Math.floor(available)));
      widget.classList.toggle("is-side-rail", sideRail);
      widget.classList.toggle("is-side-rail-compact", sideRail && panelWidth < compactWidth);
      widget.classList.toggle("is-side-rail-tight", sideRail && panelWidth < tightWidth);
      widget.classList.toggle("is-side-rail-micro", sideRail && panelWidth < microWidth);
      if (sideRail) {
        widget.style.setProperty("--savings-side-left", Math.round(contentRight + gap) + "px");
        widget.style.setProperty("--savings-side-width", panelWidth + "px");
      } else {
        widget.classList.remove("is-side-rail-compact");
        widget.classList.remove("is-side-rail-tight");
        widget.classList.remove("is-side-rail-micro");
        widget.style.removeProperty("--savings-side-left");
        widget.style.removeProperty("--savings-side-width");
      }
      return sideRail;
    };
    var parseAmount = function (raw) {
      var value = String(raw || "").trim().replace(/\s/g, "");
      var lastComma = value.lastIndexOf(",");
      var lastDot = value.lastIndexOf(".");
      if (lastComma > -1 && lastDot > -1) {
        value = lastComma > lastDot
          ? value.replace(/\./g, "").replace(",", ".")
          : value.replace(/,/g, "");
      } else if (lastComma > -1) {
        value = value.replace(/\./g, "").replace(",", ".");
      }
      value = value.replace(/[^0-9.-]/g, "");
      var parsed = parseFloat(value);
      return isFinite(parsed) && parsed > 0 ? parsed : 0;
    };
    var euro = function (v) {
      if (!isFinite(v) || v < 0) v = 0;
      var rounded = Math.round((v + Number.EPSILON) * 100) / 100;
      var decimals = Number.isInteger(rounded) ? 0 : 2;
      return "€ " + rounded.toLocaleString("nl-BE", { minimumFractionDigits: decimals, maximumFractionDigits: 2 });
    };
    var update = function () {
      var monthly = parseAmount(input.value);
      output.textContent = euro(monthly * 12);
    };
    var open = function () {
      var sideRail = syncSideRail();
      overlay.hidden = false;
      modal.hidden = false;
      modal.setAttribute("aria-modal", sideRail ? "false" : "true");
      requestAnimationFrame(function () {
        overlay.classList.add("is-open");
        modal.classList.add("is-open");
      });
      btn.setAttribute("aria-expanded", "true");
      if (!sideRail) document.body.style.overflow = "hidden";
      update();
      setTimeout(function () {
        input.focus();
        input.select();
      }, 120);
    };
    var close = function () {
      modal.classList.remove("is-open");
      overlay.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      modal.setAttribute("aria-modal", "true");
      document.body.style.overflow = "";
      setTimeout(function () {
        modal.hidden = true;
        overlay.hidden = true;
      }, 300);
      btn.focus();
    };

    input.addEventListener("input", update);
    btn.addEventListener("click", function () {
      if (modal.classList.contains("is-open")) close();
      else open();
    });
    overlay.addEventListener("click", close);
    if (closeBtn) closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) close();
    });
    window.addEventListener("resize", function () {
      var sideRail = syncSideRail();
      if (modal.classList.contains("is-open")) {
        modal.setAttribute("aria-modal", sideRail ? "false" : "true");
        document.body.style.overflow = sideRail ? "" : "hidden";
      }
    });
    syncSideRail();
    update();
  });

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

  /* Drawer (slide-in paneel) */
  document.querySelectorAll('.drawer-trigger').forEach(function (btn) {
    var id = btn.getAttribute('data-drawer');
    var drawer = document.getElementById('drawer-' + id);
    var overlay = document.querySelector('[data-drawer-overlay="' + id + '"]');
    if (!drawer || !overlay) return;

    function open() {
      drawer.hidden = false;
      requestAnimationFrame(function () {
        drawer.classList.add('is-open');
        overlay.classList.add('is-open');
      });
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      var closeBtn = drawer.querySelector('.drawer-close');
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      setTimeout(function () { drawer.hidden = true; }, 380);
      btn.focus();
    }

    btn.addEventListener('click', open);
    overlay.addEventListener('click', close);
    var closeBtn = drawer.querySelector('.drawer-close');
    if (closeBtn) closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
    });
  });
})();
