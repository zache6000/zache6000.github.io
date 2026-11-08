/* Babora · choix de stockage (aucun cookie, aucune mesure d'audience)
   - "bb-consent" garde votre choix : nécessaire, sans données personnelles.
   - Si vous refusez, aucune préférence n'est enregistrée sur votre appareil. */
(function () {
  "use strict";
  var KEY = "bb-consent", MAX = 1000 * 60 * 60 * 24 * 365; // redemander après 12 mois
  var OPTIONAL = /^(bb-theme|bb-lab|arena-.*)$/;
  var ROOT = (document.currentScript && document.currentScript.src.replace(/assets\/consent\.js.*$/, "")) || "/";

  function read() {
    try { var v = JSON.parse(localStorage.getItem(KEY) || "null"); if (v && Date.now() - v.t < MAX) return v.c; } catch (e) {}
    return null;
  }
  function write(c) { try { localStorage.setItem(KEY, JSON.stringify({ c: c, t: Date.now() })); } catch (e) {} }
  function purge() {
    try { Object.keys(localStorage).forEach(function (k) { if (OPTIONAL.test(k)) localStorage.removeItem(k); }); } catch (e) {}
  }

  window.BBConsent = {
    allowed: function () { return read() === "yes"; },
    get: read,
    open: show,
    clearDevice: function () {
      try { Object.keys(localStorage).forEach(function (k) { if (/^(bb-|arena-)/.test(k)) localStorage.removeItem(k); }); } catch (e) {}
      try { sessionStorage.clear(); } catch (e) {}
      var jobs = [];
      if (window.caches && caches.keys) jobs.push(caches.keys().then(function (ks) { return Promise.all(ks.map(function (k) { return caches.delete(k); })); }));
      if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) jobs.push(navigator.serviceWorker.getRegistrations().then(function (rs) { return Promise.all(rs.map(function (r) { return r.unregister(); })); }));
      return Promise.all(jobs).catch(function () {});
    }
  };

  var css = ".bbc{position:fixed;z-index:2147483000;left:16px;bottom:16px;width:min(420px,calc(100% - 32px));padding:20px;border-radius:18px;background:var(--card,#151517);color:var(--text,#f3efe7);border:1px solid var(--line2,rgba(255,255,255,.16));box-shadow:0 24px 60px -12px rgba(0,0,0,.55);font:400 14px/1.55 'Inter Tight',IT,system-ui,sans-serif;transform:translateY(20px);opacity:0;transition:transform .45s cubic-bezier(.22,1,.36,1),opacity .45s}" +
    ".bbc.on{transform:none;opacity:1}" +
    ".bbc h2{font:600 17px/1.3 'Inter Tight',IT,system-ui,sans-serif;margin:0 0 6px;letter-spacing:-.01em;color:inherit;text-transform:none}" +
    ".bbc p{margin:0 0 14px;color:var(--soft,#bdb8af)}" +
    ".bbc a{color:inherit;text-decoration:underline;text-underline-offset:2px}" +
    ".bbc .r{display:flex;gap:8px}" +
    ".bbc button{flex:1;height:44px;border-radius:999px;font:600 14px/1 'Inter Tight',IT,system-ui,sans-serif;cursor:pointer;border:1px solid var(--line2,rgba(255,255,255,.2));background:transparent;color:inherit}" +
    ".bbc button:hover{background:rgba(127,127,127,.12)}" +
    ".bbc button:focus-visible{outline:2px solid var(--accent,#ff5a2c);outline-offset:2px}" +
    "@media (prefers-reduced-motion:reduce){.bbc{transition:none}}";
  var box;
  function show() {
    if (!box) {
      var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
      box = document.createElement("section");
      box.className = "bbc"; box.setAttribute("role", "region"); box.setAttribute("aria-label", "Choix de stockage");
      box.innerHTML = '<h2>Vos préférences, votre choix</h2>' +
        '<p>Ce site n\'utilise <b>aucun cookie</b>, aucune publicité et aucune mesure d\'audience. Il peut seulement garder vos préférences (thème clair ou sombre, votre sélection d\'animations) sur votre appareil. <a href="' + ROOT + 'cookies.html">En savoir plus</a></p>' +
        '<div class="r"><button type="button" data-c="no">Refuser</button><button type="button" data-c="yes">Accepter</button></div>';
      box.addEventListener("click", function (e) {
        var b = e.target.closest("[data-c]"); if (!b) return;
        write(b.dataset.c); if (b.dataset.c === "no") purge();
        box.classList.remove("on"); setTimeout(function () { box.hidden = true; }, 450);
        document.dispatchEvent(new CustomEvent("bb:consent", { detail: b.dataset.c }));
      });
      var sk = document.querySelector(".skip"); if (sk && sk.nextSibling) document.body.insertBefore(box, sk.nextSibling); else document.body.insertBefore(box, document.body.firstChild);
    }
    box.hidden = false;
    requestAnimationFrame(function () { requestAnimationFrame(function () { box.classList.add("on"); }); });
  }
  function init() {
    document.addEventListener("click", function (e) { var o = e.target.closest("[data-consent-open]"); if (o) { e.preventDefault(); show(); } });
    if (read() === null) setTimeout(show, 900);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
