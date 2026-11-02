/* ================= Babora v2 — moteur commun ================= */
const CFG = window.CONFIG || {};
const $ = (s, e = document) => e.querySelector(s), $$ = (s, e = document) => [...e.querySelectorAll(s)];
const wa = t => `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(t)}`;
const finePointer = matchMedia("(hover:hover) and (pointer:fine)").matches;
const reduced = matchMedia("(prefers-reduced-motion:reduce)").matches;
const lerp = (a, b, t) => a + (b - a) * t;
const store = { get: k => { try { return localStorage.getItem(k) } catch (e) { return null } }, set: (k, v) => { try { localStorage.setItem(k, v) } catch (e) {} } };
const MOIS = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const JOURS_L = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];

/* ---------- toasts ---------- */
const toastBox = Object.assign(document.createElement("div"), { className: "toasts" }); document.body.append(toastBox);
function toast(msg, icon = "✓") {
  const t = document.createElement("div"); t.className = "toast"; t.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  toastBox.append(t); setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 400); }, 2600);
}

/* ---------- thème (clair / sombre) avec transition circulaire ---------- */
const root = document.documentElement;
const savedTheme = store.get("bb-theme"); if (savedTheme) root.dataset.theme = savedTheme;
function toggleTheme(e) {
  const next = root.dataset.theme === "light" ? "dark" : "light";
  const apply = () => { root.dataset.theme = next; store.set("bb-theme", next); $$("meta[name=theme-color]").forEach(m => m.content = next === "light" ? "#f4f0e8" : "#0b0b0c"); };
  if (!document.startViewTransition || reduced) return apply();
  const x = e?.clientX ?? innerWidth / 2, y = e?.clientY ?? 60, r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const vt = document.startViewTransition(apply);
  vt.ready.then(() => root.animate({ clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] }, { duration: 700, easing: "cubic-bezier(.22,1,.36,1)", pseudoElement: "::view-transition-new(root)" }));
}
$$("[data-theme-toggle]").forEach(b => b.addEventListener("click", toggleTheme));

/* ---------- préchargement (une fois par session) ---------- */
let introSeen = false; try { introSeen = sessionStorage.getItem("bb-intro") === "1"; sessionStorage.setItem("bb-intro", "1"); } catch (e) {}
const loader = $(".loader");
function startPage() { document.body.classList.add("loaded"); document.dispatchEvent(new Event("bb:ready")); }
if (!loader || introSeen || reduced) { document.body.classList.add("no-intro"); requestAnimationFrame(startPage); }
else {
  const num = $(".num", loader), bar = $(".bar", loader); let p = 0; const t0 = performance.now();
  const step = t => { p = Math.min(100, Math.round(100 * (1 - Math.pow(1 - Math.min(1, (t - t0) / 1400), 3)))); num.textContent = p; bar.style.setProperty("--p", p / 100); if (p < 100) requestAnimationFrame(step); else setTimeout(startPage, 180); };
  requestAnimationFrame(step);
}

/* ---------- découpage du texte en lettres ---------- */
$$(".split").forEach(el => {
  let i = 0;
  const walk = node => [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(w => {
        if (!w) return; if (/^\s+$/.test(w)) { frag.append(" "); return; }
        const wd = document.createElement("span"); wd.className = "wd";
        [...w].forEach(c => { const s = document.createElement("span"); s.className = "ch"; s.textContent = c; s.style.setProperty("--i", i++); wd.append(s); });
        frag.append(wd);
      });
      n.replaceWith(frag);
    } else if (n.nodeType === 1 && !n.classList.contains("rot")) walk(n);
  });
  walk(el); el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
});

/* ---------- apparitions au défilement ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .14, rootMargin: "0px 0px -40px 0px" });
document.addEventListener("bb:ready", () => $$(".rv,.split,.clip").forEach(el => io.observe(el)));

/* ---------- compteurs ---------- */
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; cio.unobserve(e.target);
  const el = e.target, end = +el.dataset.count, dec = (el.dataset.count.split(".")[1] || "").length, t0 = performance.now(), dur = 1600;
  const f = t => { const k = Math.min(1, (t - t0) / dur), v = end * (1 - Math.pow(1 - k, 4)); el.textContent = v.toFixed(dec); if (k < 1) requestAnimationFrame(f); };
  requestAnimationFrame(f);
}), { threshold: .5 });
$$("[data-count]").forEach(el => cio.observe(el));

/* ---------- curseur personnalisé ---------- */
if (finePointer && !reduced) {
  root.classList.add("has-cursor");
  const c = Object.assign(document.createElement("div"), { className: "cur", innerHTML: "<span></span>" }), d = Object.assign(document.createElement("div"), { className: "cur-dot" });
  document.body.append(c, d);
  let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
  addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; d.style.transform = `translate(${mx}px,${my}px)`; }, { passive: true });
  (function loop() { cx = lerp(cx, mx, .18); cy = lerp(cy, my, .18); c.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); })();
  document.addEventListener("pointerover", e => {
    const lab = e.target.closest("[data-cursor]"), hov = e.target.closest("a,button,label,input,select,textarea,[data-hover]");
    c.classList.toggle("label", !!lab); $("span", c).textContent = lab ? lab.dataset.cursor : "";
    c.classList.toggle("hover", !lab && !!hov);
  });
  addEventListener("pointerdown", () => c.classList.add("down")); addEventListener("pointerup", () => c.classList.remove("down"));
  document.addEventListener("mouseleave", () => { c.style.opacity = d.style.opacity = 0; });
  document.addEventListener("mouseenter", () => { c.style.opacity = d.style.opacity = 1; });
}

/* ---------- boutons magnétiques ---------- */
if (finePointer && !reduced) $$(".mag").forEach(m => {
  const kid = m.firstElementChild;
  m.addEventListener("pointermove", e => { const r = m.getBoundingClientRect(); kid.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .3}px,${(e.clientY - r.top - r.height / 2) * .4}px)`; });
  m.addEventListener("pointerleave", () => kid.style.transform = "");
});

/* ---------- lumière qui suit la souris sur les cartes ---------- */
document.addEventListener("pointermove", e => {
  const card = e.target.closest?.(".card"); if (!card) return;
  const r = card.getBoundingClientRect(); card.style.setProperty("--mx", e.clientX - r.left + "px"); card.style.setProperty("--my", e.clientY - r.top + "px");
}, { passive: true });

/* ---------- texte brouillé au survol ---------- */
const GLY = "!<>-_\\/[]{}—=+*^?#ABCDEFabcdef0123456789";
function scramble(el) {
  if (el._sc) return; const orig = el.dataset.text || el.textContent; el.dataset.text = orig; let f = 0; el._sc = 1;
  const run = () => { el.textContent = [...orig].map((ch, i) => i < f / 2 || ch === " " ? ch : GLY[Math.random() * GLY.length | 0]).join(""); if (f++ < orig.length * 2) requestAnimationFrame(run); else { el.textContent = orig; el._sc = 0; } };
  run();
}
$$("[data-scramble]").forEach(el => el.addEventListener("pointerenter", () => scramble(el)));

/* ---------- nav, progression, retour en haut, points ---------- */
const nav = $(".nav"), prog = $(".progress"), totop = $(".totop"), fab = $(".fab");
let lastY = scrollY;
function onScroll() {
  const y = scrollY, h = document.documentElement.scrollHeight - innerHeight, p = h > 0 ? y / h : 0;
  if (prog) prog.style.transform = `scaleX(${p})`;
  if (nav) { nav.classList.toggle("solid", y > 30); nav.classList.toggle("hide", y > 600 && y > lastY + 4 && !$(".mmenu.open")); if (y < lastY - 4) nav.classList.remove("hide"); }
  if (totop) { totop.classList.toggle("show", y > innerHeight); $("circle", totop).style.strokeDashoffset = 138 * (1 - p); }
  if (fab) fab.classList.toggle("show", y > innerHeight * .6);
  lastY = y;
}
addEventListener("scroll", onScroll, { passive: true }); onScroll();
totop?.addEventListener("click", () => scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }));

const secs = $$("main section[id]");
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; const id = e.target.id;
  $$(".links a,.dots a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + id));
  if (fab) { const msg = e.target.dataset.wamsg || "Bonjour Babora, j'ai une question sur un site web."; fab.href = wa(msg); }
}), { rootMargin: "-45% 0px -50% 0px" });
secs.forEach(s => spy.observe(s));
const dots = $(".dots");
if (dots) secs.filter(s => s.dataset.label).forEach(s => { const a = document.createElement("a"); a.href = "#" + s.id; a.innerHTML = `<span>${s.dataset.label}</span>`; a.setAttribute("aria-label", s.dataset.label); dots.append(a); });
if (fab) fab.href = wa("Bonjour Babora, j'ai une question sur un site web.");

/* ---------- menu mobile ---------- */
const mm = $(".mmenu"), burger = $(".burger");
burger?.addEventListener("click", () => { const o = mm.classList.toggle("open"); burger.setAttribute("aria-expanded", o); burger.innerHTML = o ? ICON.x : ICON.menu; document.body.style.overflow = o ? "hidden" : ""; });
mm && $$("a", mm).forEach((a, i) => { a.style.setProperty("--i", i); a.addEventListener("click", () => { mm.classList.remove("open"); burger.innerHTML = ICON.menu; document.body.style.overflow = ""; }); });

/* ---------- bandeau défilant qui réagit à la vitesse ---------- */
$$(".marq .track").forEach(tr => {
  tr.innerHTML += tr.innerHTML; let x = 0, v = 0, last = scrollY; const base = tr.closest(".marq").dataset.dir === "r" ? 1 : -1;
  (function loop() { const dy = scrollY - last; last = scrollY; v = lerp(v, dy * .25, .1); x += base * (0.6 + Math.abs(v)) * (reduced ? 0 : 1); const w = tr.scrollWidth / 2; if (x <= -w) x += w; if (x > 0) x -= w; tr.style.transform = `translateX(${x}px) skewX(${Math.max(-8, Math.min(8, -v * .6))}deg)`; requestAnimationFrame(loop); })();
});

/* ---------- transitions entre pages ---------- */
const curtain = Object.assign(document.createElement("div"), { className: "curtain" }); document.body.append(curtain);
document.addEventListener("click", e => {
  const a = e.target.closest("a[href]"); if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || a.target === "_blank") return;
  const u = new URL(a.href, location.href); if (u.origin !== location.origin || u.pathname === location.pathname || /\.(pdf|png|jpg|webp|zip)$/i.test(u.pathname)) return;
  e.preventDefault(); curtain.classList.add("go"); setTimeout(() => location.href = a.href, 520);
});
addEventListener("pageshow", e => { if (e.persisted) curtain.classList.remove("go"); });

/* ---------- confettis ---------- */
function confetti(n = 140) {
  if (reduced) return; const cv = document.createElement("canvas"); cv.className = "confetti"; document.body.append(cv);
  const ctx = cv.getContext("2d"), dpr = devicePixelRatio || 1; cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.scale(dpr, dpr);
  const cols = ["#ff5a2c", "#ff9a5a", "#e9d8b8", "#3ddc84", "#ffffff"];
  const P = Array.from({ length: n }, () => ({ x: innerWidth / 2, y: innerHeight * .6, vx: (Math.random() - .5) * 16, vy: -Math.random() * 16 - 6, r: Math.random() * 6 + 4, c: cols[Math.random() * 5 | 0], a: Math.random() * 6, va: (Math.random() - .5) * .3 }));
  let f = 0; (function loop() { ctx.clearRect(0, 0, innerWidth, innerHeight); P.forEach(p => { p.vy += .4; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); }); if (f++ < 200) requestAnimationFrame(loop); else cv.remove(); })();
}
const KONAMI = "ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a"; let kbuf = [];
addEventListener("keydown", e => { kbuf = [...kbuf, e.key].slice(-10); if (kbuf.join() === KONAMI) { confetti(220); toast("Code secret trouvé. Bravo !", "🎉"); } });

/* ---------- copier / partager ---------- */
async function copy(text, msg = "Copié") { try { await navigator.clipboard.writeText(text); toast(msg); } catch (e) { prompt("Copiez :", text); } }
async function share() { const d = { title: document.title, url: location.href.split("#")[0] }; if (navigator.share) { try { await navigator.share(d); } catch (e) {} } else copy(d.url, "Lien copié"); }
$$("[data-copy-wa]").forEach(b => b.addEventListener("click", () => copy("+" + CFG.whatsapp, "Numéro WhatsApp copié")));
$$("[data-share]").forEach(b => b.addEventListener("click", share));

/* ---------- palette de commandes (Ctrl/⌘ + K) ---------- */
const ICON = {
  menu: '<svg viewBox="0 0 24 24"><path d="M4 8h16M4 16h16"/></svg>', x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>'
};
const pal = document.createElement("div"); pal.className = "pal"; pal.setAttribute("role", "dialog"); pal.setAttribute("aria-label", "Recherche rapide");
pal.innerHTML = `<div class="box"><input placeholder="Où voulez-vous aller ?" aria-label="Rechercher"><ul></ul><div class="ft mono"><span>↑↓ naviguer</span><span>↵ ouvrir</span><span>esc fermer</span></div></div>`;
document.body.append(pal);
const onHome = !!$("#projets");
const go = id => () => { if (onHome || !id.startsWith("#")) { if (id.startsWith("#")) $(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); else location.href = id; } else location.href = "index.html" + id; };
const CMDS = [
  ["Projets", "Aller à", go("#projets")], ["Services", "Aller à", go("#services")], ["Estimer le prix de mon site", "Outil", go("#estimation")],
  ["Tarifs", "Aller à", go("#tarifs")], ["Disponibilités et calendrier", "Aller à", go("#disponibilites")], ["Préparer ma demande", "Outil", go("#brief")],
  ["Questions fréquentes", "Aller à", go("#faq")], ["Le Labo : animations et widgets", "Page", go("lab.html")], ["Commander un site", "Page", go("commander.html")],
  ["Écrire sur WhatsApp", "Action", () => open(wa("Bonjour Babora, je suis intéressé par un site web."), "_blank")],
  ["Copier le numéro WhatsApp", "Action", () => copy("+" + CFG.whatsapp, "Numéro WhatsApp copié")],
  ["Changer de thème (clair / sombre)", "Action", () => toggleTheme()], ["Partager ce site", "Action", share], ["Lancer des confettis", "Fun", () => confetti()]
];
let palSel = 0, palList = CMDS;
const palIn = $("input", pal), palUl = $("ul", pal);
function palRender() {
  const q = palIn.value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  palList = CMDS.filter(c => c[0].toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").includes(q)); palSel = Math.min(palSel, Math.max(0, palList.length - 1));
  palUl.innerHTML = palList.map((c, i) => `<li><button class="${i === palSel ? "on" : ""}" data-i="${i}"><span>${c[0]}</span><span class="g">${c[1]}</span></button></li>`).join("") || `<li><button disabled>Aucun résultat</button></li>`;
}
function palOpen() { pal.classList.add("open"); palIn.value = ""; palSel = 0; palRender(); setTimeout(() => palIn.focus(), 30); }
function palClose() { pal.classList.remove("open"); }
function palRun(i) { const c = palList[i]; if (!c) return; palClose(); setTimeout(c[2], 120); }
palIn.addEventListener("input", () => { palSel = 0; palRender(); });
palUl.addEventListener("click", e => { const b = e.target.closest("button[data-i]"); if (b) palRun(+b.dataset.i); });
pal.addEventListener("click", e => { if (e.target === pal) palClose(); });
addEventListener("keydown", e => {
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName) && !pal.contains(document.activeElement);
  if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) { e.preventDefault(); pal.classList.contains("open") ? palClose() : palOpen(); return; }
  if (!pal.classList.contains("open")) { if (e.key === "Escape") { $(".modal.open") && closeModal?.(); } return; }
  if (e.key === "Escape") palClose();
  else if (e.key === "ArrowDown") { e.preventDefault(); palSel = (palSel + 1) % Math.max(1, palList.length); palRender(); }
  else if (e.key === "ArrowUp") { e.preventDefault(); palSel = (palSel - 1 + palList.length) % Math.max(1, palList.length); palRender(); }
  else if (e.key === "Enter") palRun(palSel);
});
$$("[data-palette]").forEach(b => b.addEventListener("click", palOpen));
var closeModal;

/* ---------- disponibilités en direct (heure du Maroc) ---------- */
const casa = () => { const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Casablanca", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date()).map(x => [x.type, x.value])); return { wd: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(p.weekday), min: +p.hour * 60 + +p.minute, hm: p.hour + ":" + p.minute }; };
const toMin = t => { const [h, m] = t.split(":"); return +h * 60 + +m; }, fmtH = t => t.replace(":00", "h").replace(":", "h");
function liveStatus() {
  const { wd, min, hm } = casa(), r = CFG.reponses?.[wd]; let on = !!(r && min >= toMin(r[0]) && min < toMin(r[1])), label = "";
  if (!on) { if (r && min < toMin(r[0])) label = `aujourd'hui dès ${fmtH(r[0])}`; else for (let i = 1; i <= 7; i++) { const d = (wd + i) % 7, x = CFG.reponses?.[d]; if (x) { label = (i === 1 ? "demain" : JOURS_L[d]) + ` dès ${fmtH(x[0])}`; break; } } }
  $$("[data-clock]").forEach(el => el.textContent = hm);
  $$("[data-status-short]").forEach(el => el.textContent = on ? "En ligne" : "Hors ligne");
  $$("[data-status-dot]").forEach(el => el.classList.toggle("off", !on));
  const st = $("#status"); if (st) st.innerHTML = on ? `<span class="dot"></span><span><b>Disponible maintenant</b> · réponse en quelques minutes</span>` : `<span class="dot off"></span><span><b>Hors ligne</b> · réponse ${label}</span>`;
  const hl = $("#hours"); if (hl) hl.innerHTML = [1,2,3,4,5,6,0].map(d => { const x = CFG.reponses?.[d]; return `<li class="${d === wd ? "today" : ""}"><span>${JOURS_L[d]}${d === wd ? " · aujourd'hui" : ""}</span><span>${x ? fmtH(x[0]) + " – " + fmtH(x[1]) : "Repos"}</span></li>`; }).join("");
}
liveStatus(); setInterval(liveStatus, 20000);
const restantes = Math.max(0, (CFG.projetsParMois || 3) - (CFG.projetsReserves || 0));
const nextStart = (() => { const d = new Date(); d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7)); if (restantes === 0) { d.setMonth(d.getMonth() + 1, 1); while (d.getDay() !== 1) d.setDate(d.getDate() + 1); } return d; })();
$$("[data-restantes]").forEach(el => el.textContent = restantes);
$$("[data-total]").forEach(el => el.textContent = CFG.projetsParMois);
$$("[data-mois]").forEach(el => el.textContent = MOIS[nextStart.getMonth()]);
$$("[data-demarrage]").forEach(el => el.textContent = `lundi ${nextStart.getDate()} ${MOIS[nextStart.getMonth()]}`);
$$(".slots").forEach(sb => { for (let i = 0; i < CFG.projetsParMois; i++) { const s = document.createElement("i"); if (i < CFG.projetsReserves) s.className = "taken"; sb.append(s); } });
$$("[data-wa]").forEach(a => { a.href = wa(a.dataset.wa || "Bonjour Babora, je suis intéressé par un site web."); a.target = "_blank"; a.rel = "noopener"; });
$$("[data-mail]").forEach(a => { if (!CFG.email) a.remove(); else a.href = `mailto:${CFG.email}?subject=${encodeURIComponent("Demande de site web")}`; });
$$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

/* ---------- application installable (hors ligne) ---------- */
if ("serviceWorker" in navigator && location.protocol === "https:") addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
