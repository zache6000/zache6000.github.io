/* Babora 3 : page d'accueil */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const C = window.CONFIG || {};
  const wa = t => "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(t);
  const calme = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const eur = n => (Number.isInteger(n) ? n : n.toFixed(2).replace(".", ",")) + " €";

  /* liens WhatsApp et paiement */
  $$("[data-wa]").forEach(a => a.href = wa("Bonjour Babora, je souhaite un site pour mon commerce."));
  $$("[data-wa-stop]").forEach(a => a.href = wa("Bonjour Babora, je souhaite arrêter mon abonnement Entretien."));
  $$("[data-pay]").forEach(a => { const u = (C.paiement || {})[a.dataset.pay]; if (u) a.href = u; else a.hidden = true; });
  $("#an").textContent = new Date().getFullYear();

  /* heure de Casablanca */
  const casa = () => { const p = {}; new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Casablanca", weekday: "short", year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date()).forEach(x => p[x.type] = x.value); return { d: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday), min: (+p.hour % 24) * 60 + +p.minute, date: new Date(+p.year, +p.month - 1, +p.day) }; };
  const hm = s => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
  const JOURS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

  /* état : répond en ce moment ? */
  const etat = () => {
    const n = casa(), R = C.reponses || {}, r = R[n.d], el = $("#etat");
    let on = r && n.min >= hm(r[0]) && n.min < hm(r[1]), txt;
    if (on) txt = "Répond en ce moment";
    else if (r && n.min < hm(r[0])) txt = "Répond à partir de " + r[0].replace(":", " h ").replace(" h 00", " h");
    else { let k = 1; while (k < 8 && !R[(n.d + k) % 7]) k++; const j = (n.d + k) % 7; txt = R[j] ? "Répond " + (k === 1 ? "demain" : JOURS[j].toLowerCase()) + " à " + R[j][0].replace(":00", " h").replace(":", " h ") : "Par message"; }
    el.classList.toggle("on", !!on); $("span", el).textContent = txt;
  };
  etat(); setInterval(etat, 60000);

  /* disponibilités */
  (() => {
    const n = casa(), R = C.reponses || {};
    $("#libres").textContent = Math.max(0, (C.projetsParMois || 0) - (C.projetsReserves || 0));
    $("#parmois").textContent = C.projetsParMois || 0;
    $("#mois").textContent = MOIS[n.date.getMonth()];
    const l = new Date(n.date); l.setDate(l.getDate() + ((8 - l.getDay()) % 7 || 7));
    $("#lundi").textContent = "lundi " + l.getDate() + " " + MOIS[l.getMonth()];
    $("#heures").innerHTML = [1, 2, 3, 4, 5, 6, 0].map(j => `<li${j === n.d ? ' class="auj"' : ""}><span>${JOURS[j]}</span><span class="num">${R[j] ? R[j][0].replace(":", " h ") + " à " + R[j][1].replace(":", " h ") : "Pas de réponse"}</span></li>`).join("").replace(/ h 00/g, " h");
  })();

  /* nav : claire après le héros, se cache en descendant */
  const nav = $("#nav"), hero = $("#top");
  let dernier = 0;
  const surNuit = () => { const y = nav.offsetHeight / 2; return $$(".nuit,.bleu").some(s => { const r = s.getBoundingClientRect(); return r.top <= y && r.bottom > y; }); };
  const porte = () => {
    const y = scrollY, fin = hero.offsetHeight - innerHeight;
    if (!calme) { let p = Math.min(1, Math.max(0, y / fin)); p = p * p * (3 - 2 * p); hero.style.setProperty("--p", p.toFixed(4)); }
    const hb = hero.getBoundingClientRect().bottom > nav.offsetHeight / 2;
    nav.classList.toggle("jour", hb ? (!calme && y > fin * .62) : !surNuit());
    nav.classList.toggle("cache", y > dernier && y > fin + 200 && !document.body.classList.contains("menu"));
    dernier = y;
  };
  addEventListener("scroll", porte, { passive: true }); addEventListener("resize", porte); porte();

  /* menu mobile */
  const burger = $("#burger");
  const menu = v => { document.body.classList.toggle("menu", v); burger.setAttribute("aria-expanded", v); document.body.style.overflow = v ? "hidden" : ""; };
  burger.addEventListener("click", () => menu(!document.body.classList.contains("menu")));
  $$("#tiroir a").forEach(a => a.addEventListener("click", () => menu(false)));

  /* titres de section : une seule apparition */
  if ("IntersectionObserver" in window) { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("vu"); io.unobserve(e.target); } }), { threshold: .3 }); $$(".tete").forEach(t => io.observe(t)); }
  else $$(".tete").forEach(t => t.classList.add("vu"));

  /* aperçu des projets à la vraie largeur de l'appareil */
  (() => {
    const m = $("#viewer"), fr = $("#vframe"), dev = $("#device"); let mode = "", retour = null;
    const W = { "": 1280, tab: 820, mob: 390 };
    const fit = () => {
      const st = dev.parentElement, cs = getComputedStyle(st), dispo = st.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const bord = mode ? 20 : 0, cible = W[mode], ext = Math.max(200, Math.min(dispo, cible + bord)), s = (ext - bord) / cible;
      dev.style.width = ext + "px"; fr.style.width = cible + "px"; fr.style.height = dev.clientHeight / s + "px"; fr.style.transform = s < 1 ? `scale(${s})` : "";
    };
    const fermer = () => { m.classList.remove("open"); document.body.style.overflow = ""; setTimeout(() => fr.src = "about:blank", 350); retour && retour.focus(); };
    $$(".pj[data-url]").forEach(p => p.addEventListener("click", e => {
      if (e.metaKey || e.ctrlKey) return; e.preventDefault(); retour = p;
      $("#vtitle").textContent = p.dataset.title; fr.src = p.dataset.url; $("#vopen").href = p.dataset.url;
      $("#vwa").href = wa(`Bonjour Babora, j'ai vu le projet « ${p.dataset.title} » et je voudrais un site dans ce style.`);
      m.classList.add("open"); document.body.style.overflow = "hidden"; requestAnimationFrame(fit); setTimeout(() => { fit(); $("#vclose").focus(); }, 60);
    }));
    $$(".devs button").forEach(b => b.addEventListener("click", () => { $$(".devs button").forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b); }); mode = b.dataset.dev; dev.className = "device " + mode; fit(); }));
    $("#vclose").addEventListener("click", fermer);
    m.addEventListener("click", e => { if (e.target === m) fermer(); });
    addEventListener("keydown", e => { if (e.key === "Escape") { if (m.classList.contains("open")) fermer(); else menu(false); } });
    addEventListener("resize", () => m.classList.contains("open") && fit());
  })();

  /* estimateur */
  (() => {
    const E = C.estimateur; if (!E) return;
    const f = $("#calc"), NOMS = { essentiel: "Essentiel", vitrine: "Vitrine", plateforme: "Plateforme" }, JOURS_F = { essentiel: 5, vitrine: 7, plateforme: 14 };
    const LBL = { multilingue: "plusieurs langues", reservation: "réservation", catalogue: "catalogue ou menu", animations: "animations du Labo", logo: "logo simple", express: "livraison express" };
    let pages = E.pagesIncluses.vitrine;
    $$("#opts input").forEach(i => $("span", i.parentElement).insertAdjacentHTML("beforeend", `<small>+ ${E.options[i.value]} €</small>`));
    $("#entp").textContent = E.entretienMois + " € par mois, sans engagement";
    const calc = () => {
      const t = f.f.value, inc = E.pagesIncluses[t]; pages = Math.max(1, Math.min(20, pages));
      const opts = $$("#opts input:checked").map(i => i.value);
      const prix = E.formules[t] + Math.max(0, pages - inc) * E.pageEnPlus + opts.reduce((a, o) => a + E.options[o], 0);
      let j = JOURS_F[t] + Math.max(0, pages - inc) + opts.filter(o => o !== "express" && o !== "logo").length; if (opts.includes("express")) j = Math.max(3, j - 2);
      $("#pg").textContent = pages; $("#som").textContent = prix; $("#aco").textContent = eur(prix / 2); $("#del").textContent = j + " jours";
      const ent = $("#ent").checked; $("#entl").hidden = !ent; $("#entv").textContent = E.entretienMois + " € par mois";
      $("#envoi").href = wa(`Bonjour Babora, voici mon estimation :\n- Formule : ${NOMS[t]}\n- Pages : ${pages}\n- Options : ${opts.length ? opts.map(o => LBL[o]).join(", ") : "aucune"}\n- Entretien mensuel : ${ent ? "oui" : "non"}\n- Total estimé : ${prix} €\n- Délai visé : ${j} jours`);
    };
    $$("input[name=f]", f).forEach(r => r.addEventListener("change", () => { pages = E.pagesIncluses[r.value]; calc(); }));
    $$("[data-pg]", f).forEach(b => b.addEventListener("click", () => { pages += +b.dataset.pg; calc(); }));
    f.addEventListener("change", calc); calc();
  })();

  /* partage */
  $("#partager").addEventListener("click", async e => {
    const d = { title: "Babora", text: "Studio web au Maroc", url: location.origin + "/" };
    try { if (navigator.share) await navigator.share(d); else { await navigator.clipboard.writeText(d.url); e.target.textContent = "Lien copié"; setTimeout(() => e.target.textContent = "Partager ce site", 2000); } } catch (err) {}
  });

  if ("serviceWorker" in navigator && location.protocol === "https:") addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
})();
