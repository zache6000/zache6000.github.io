/* =====================================================
   RÉGLAGES DU SITE — modifie seulement cette partie
   ===================================================== */
const CONFIG = {
  whatsapp: "212614325435",   // numéro international, sans + ni 0
  paypal: "",                 // nom PayPal.me (vide = bouton "bientôt disponible")

  // Places de projets ce mois-ci
  projetsParMois: 3,
  projetsReserves: 1,         // mets à jour quand tu acceptes un projet

  // Heures où tu réponds aux messages (affichées sur le site, en direct)
  // 0 = dimanche, 1 = lundi ... 6 = samedi. null = pas de réponse ce jour-là
  reponses: {
    0: null,
    1: ["17:00", "22:00"],
    2: ["17:00", "22:00"],
    3: ["14:00", "22:00"],
    4: ["17:00", "22:00"],
    5: ["15:00", "22:00"],
    6: ["10:00", "20:00"]
  },
  email: ""                   // adresse email du studio (vide = bouton email caché)
};
/* ===================================================== */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const wa = text => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
const JOURS = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];
const JOURS_L = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const MOIS = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const iso = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

/* ---------- Titre : mots qui montent ---------- */
$$(".words").forEach(el => {
  let i = 0;
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(part); return; }
          const w = document.createElement("span"); w.className = "w";
          const inner = document.createElement("span"); inner.textContent = part;
          inner.style.setProperty("--d", (0.15 + i++ * 0.06) + "s");
          w.append(inner); frag.append(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
  };
  walk(el);
});
requestAnimationFrame(() => setTimeout(() => document.body.classList.add("loaded"), 60));

/* ---------- Apparition au défilement ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
$$(".rv, .steps, .panel").forEach(el => io.observe(el));

/* ---------- Barre de progression, en-tête, bouton WhatsApp ---------- */
const bar = $(".progress"), topEl = $(".top"), fab = $(".fab");
const onScroll = () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  if (bar) bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
  if (topEl) topEl.classList.toggle("scrolled", scrollY > 10);
  if (fab) fab.classList.toggle("show", scrollY > innerHeight * 0.7);
};
addEventListener("scroll", onScroll, { passive: true }); onScroll();
if (fab) fab.href = wa("Bonjour Babora, j'ai une question sur un site web.");

/* ---------- Aperçus des projets : défilement au survol ---------- */
const sizeViews = () => $$(".view").forEach(v => v.style.setProperty("--vh", v.clientHeight + "px"));
addEventListener("resize", sizeViews); addEventListener("load", sizeViews); sizeViews();

/* ---------- Heure de Casablanca en direct ---------- */
const clock = $("#clock");
if (clock) {
  const tick = () => clock.textContent = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Casablanca" }).format(new Date());
  tick(); setInterval(tick, 15000);
}

/* ---------- Capacité du mois ---------- */
const now = new Date();
const restantes = Math.max(0, CONFIG.projetsParMois - CONFIG.projetsReserves);
$$("[data-restantes]").forEach(el => el.textContent = restantes);
$$("[data-total]").forEach(el => el.textContent = CONFIG.projetsParMois);
const sb = $(".slots-bar");
if (sb) {
  for (let i = 0; i < CONFIG.projetsParMois; i++) {
    const s = document.createElement("i");
    if (i < CONFIG.projetsReserves) { s.className = "taken"; s.style.setProperty("--d", (0.3 + i * 0.25) + "s"); }
    sb.append(s);
  }
}
const nextStart = (() => {
  const d = new Date(now); d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7));
  if (restantes === 0) { d.setMonth(d.getMonth() + 1, 1); while (d.getDay() !== 1) d.setDate(d.getDate() + 1); }
  return d;
})();
// Le mois affiché = celui du prochain démarrage (évite "octobre" le 31 octobre)
$$("[data-mois]").forEach(el => el.textContent = MOIS[nextStart.getMonth()]);
$$("[data-demarrage]").forEach(el => el.textContent = `lundi ${nextStart.getDate()} ${MOIS[nextStart.getMonth()]}`);

/* ---------- Horaires de réponse (en direct) ---------- */
const hoursEl = $("#hours"), statusEl = $("#status");
if (hoursEl) {
  const casa = () => {               // heure actuelle à Casablanca
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Casablanca", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date()).map(x => [x.type, x.value]));
    const wd = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(p.weekday);
    return { wd, min: +p.hour * 60 + +p.minute };
  };
  const toMin = t => { const [h, m] = t.split(":"); return +h * 60 + +m; };
  const fmt = t => t.replace(":00", "h").replace(":", "h");
  const order = [1, 2, 3, 4, 5, 6, 0];
  const render = () => {
    const { wd, min } = casa();
    hoursEl.innerHTML = order.map(d => {
      const r = CONFIG.reponses[d];
      return `<li class="${d === wd ? "today" : ""}"><span>${JOURS_L[d]}${d === wd ? " · aujourd'hui" : ""}</span><span>${r ? fmt(r[0]) + " – " + fmt(r[1]) : "Repos"}</span></li>`;
    }).join("");
    const r = CONFIG.reponses[wd];
    let html;
    if (r && min >= toMin(r[0]) && min < toMin(r[1])) {
      html = `<span class="dot"></span><span><b>Disponible maintenant</b> · réponse en quelques minutes</span>`;
    } else {
      let label = "";
      if (r && min < toMin(r[0])) label = `aujourd'hui dès ${fmt(r[0])}`;
      else for (let i = 1; i <= 7; i++) {
        const d = (wd + i) % 7, x = CONFIG.reponses[d];
        if (x) { label = (i === 1 ? "demain" : JOURS_L[d]) + ` dès ${fmt(x[0])}`; break; }
      }
      html = `<span class="dot off"></span><span><b>Hors ligne</b> · réponse ${label}</span>`;
    }
    statusEl.innerHTML = html;
    $$("[data-status-short]").forEach(el => el.textContent = html.includes("Disponible") ? "En ligne" : "Hors ligne");
  };
  render(); setInterval(render, 30000);
}
const mailBtns = $$("[data-mail]");
mailBtns.forEach(a => {
  if (!CONFIG.email) { a.remove(); return; }
  a.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(a.dataset.mail || "Demande de site web")}`;
});

/* ---------- FAQ ---------- */
$$(".q button").forEach(b => b.addEventListener("click", () => {
  const q = b.closest(".q"); const open = !q.classList.contains("open");
  $$(".q.open").forEach(x => { x.classList.remove("open"); $("button", x).setAttribute("aria-expanded", "false"); });
  if (open) { q.classList.add("open"); b.setAttribute("aria-expanded", "true"); }
}));

/* ---------- Liens WhatsApp génériques ---------- */
$$("[data-wa]").forEach(a => a.href = wa(a.dataset.wa || "Bonjour Babora, je suis intéressé par un site web."));
$$("[data-year]").forEach(el => el.textContent = now.getFullYear());
