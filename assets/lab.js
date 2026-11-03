/* ================= Babora — Le Labo ================= */
const IMG1 = "img/etaldeco.jpg", IMG2 = "img/massira.jpg", IMG3 = "img/voxelcraft.jpg";
const D = [
/* ------------------- MOUVEMENT ------------------- */
{ id: "split", c: "motion", t: "Titre lettre par lettre", d: "Chaque lettre monte à son tour", h: `<div class="dm-split"><h4>Bienvenue chez vous</h4><button class="mini">Rejouer</button></div>`,
  i: el => { const h = $("h4", el); const txt = h.textContent; const play = () => { h.innerHTML = [...txt].map((c, i) => `<span style="--i:${i}">${c === " " ? "&nbsp;" : c}</span>`).join(""); h.classList.remove("go"); void h.offsetWidth; h.classList.add("go"); }; $("button", el).onclick = play; onSeen(el, play); } },
{ id: "scramble", c: "motion", t: "Texte brouillé", d: "Effet décodage au survol", h: `<div class="dm-scr" data-hover><b>SURVOLEZ-MOI</b><small class="mono">ou touchez</small></div>`,
  i: el => { const b = $("b", el); const go = () => scramble(b); el.addEventListener("pointerenter", go); el.addEventListener("click", go); onSeen(el, go); } },
{ id: "type", c: "motion", t: "Machine à écrire", d: "Le texte s'écrit tout seul", h: `<div class="dm-type"><span class="mono">&gt; </span><span class="tw"></span><i class="caret"></i></div>`,
  i: el => { const w = ["Menu du jour : tajine.", "Réservez en 1 clic.", "Livraison à Casablanca.", "Ouvert jusqu'à 23h."]; const s = $(".tw", el); let i = 0, j = 0, del = false;
    (function tick() { const cur = w[i]; s.textContent = cur.slice(0, j); if (!del && j++ === cur.length) { del = true; return setTimeout(tick, 1400); } if (del && j-- === 0) { del = false; i = (i + 1) % w.length; } setTimeout(tick, del ? 35 : 70); })(); } },
{ id: "gradtext", c: "motion", t: "Dégradé vivant", d: "Couleurs qui coulent dans le texte", h: `<div class="dm-grad">Atlas</div>` },
{ id: "counter", c: "motion", t: "Compteur animé", d: "Les chiffres défilent jusqu'au total", h: `<div class="dm-count"><div><b data-to="1250">0</b><span>clients servis</span></div><div><b data-to="98">0</b><span>% satisfaits</span></div><button class="mini">Rejouer</button></div>`,
  i: el => { const run = () => $$("b", el).forEach(b => { const to = +b.dataset.to, t0 = performance.now(); const f = t => { const k = Math.min(1, (t - t0) / 1500); b.textContent = Math.round(to * (1 - Math.pow(1 - k, 4))).toLocaleString("fr-FR"); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }); $("button", el).onclick = run; onSeen(el, run); } },
{ id: "blob", c: "motion", t: "Forme organique", d: "Une forme liquide qui respire", h: `<div class="dm-blob"><i></i><i></i></div>` },
{ id: "parallax", c: "motion", t: "Profondeur 3D", d: "Les calques suivent la souris ou le téléphone", h: `<div class="dm-par" data-hover><i data-z="10"></i><i data-z="25"></i><i data-z="45"></i><b data-z="60">3D</b></div>`,
  i: el => { const L = $$("[data-z]", el); const mv = (x, y) => L.forEach(l => l.style.transform = `translate(${x * l.dataset.z}px,${y * l.dataset.z}px)`);
    el.addEventListener("pointermove", e => { const r = el.getBoundingClientRect(); mv((e.clientX - r.left) / r.width - .5, (e.clientY - r.top) / r.height - .5); }); el.addEventListener("pointerleave", () => mv(0, 0));
    addEventListener("deviceorientation", e => { if (e.gamma != null) mv(Math.max(-.5, Math.min(.5, e.gamma / 60)), Math.max(-.5, Math.min(.5, (e.beta - 40) / 60))); }); } },
{ id: "ripplegrid", c: "motion", t: "Vague de grille", d: "Cliquez : l'onde se propage", h: `<div class="dm-wave"></div>`,
  i: box => { const el = $(".dm-wave", box), n = 12, m = 8; el.style.setProperty("--n", n); for (let k = 0; k < n * m; k++) el.append(document.createElement("i")); const cells = $$("i", el);
    const go = (cx, cy) => cells.forEach((c, k) => { const x = k % n, y = k / n | 0, d = Math.hypot(x - cx, y - cy); c.style.animation = "none"; void c.offsetWidth; c.style.animation = `wave .9s ${d * .05}s var(--ease)`; });
    el.addEventListener("click", e => { const c = e.target.closest("i"); if (!c) return; const k = cells.indexOf(c); go(k % n, k / n | 0); }); onSeen(el, () => go(n / 2, m / 2)); } },
{ id: "loaders", c: "motion", t: "Chargements", d: "Trois animations d'attente", h: `<div class="dm-load"><span class="l1"></span><span class="l2"><i></i><i></i><i></i></span><span class="l3"></span></div>` },
{ id: "marq", c: "motion", t: "Bandeau défilant", d: "Accélère quand on fait défiler la page", w: 1, h: `<div class="dm-marq"><div class="marq" style="border:0;padding:0"><div class="track"><span>Livraison offerte</span><span>Nouveautés</span><span>Fait main</span><span>Casablanca</span><span>-20% ce mois</span></div></div><div class="marq" data-dir="r" style="border:0;padding:0;margin-top:12px"><div class="track"><span>Sur mesure</span><span>Premium</span><span>Rapide</span><span>Mobile</span></div></div></div>`,
  i: el => { $$(".track", el).forEach(tr => { tr.innerHTML += tr.innerHTML + tr.innerHTML; let x = 0, v = 0, last = scrollY; const dir = tr.closest(".marq").dataset.dir === "r" ? 1 : -1; (function loop() { const dy = scrollY - last; last = scrollY; v = lerp(v, dy * .25, .1); x += dir * (.7 + Math.abs(v)); const w = tr.scrollWidth / 3; if (x <= -w) x += w; if (x > 0) x -= w; tr.style.transform = `translateX(${x}px)`; requestAnimationFrame(loop); })(); }); } },
{ id: "stagger", c: "motion", t: "Apparition en cascade", d: "Les éléments arrivent l'un après l'autre", h: `<div class="dm-stag"><i></i><i></i><i></i><i></i><i></i><i></i><button class="mini">Rejouer</button></div>`,
  i: el => { const g = $(".dm-stag", el); const run = () => { g.classList.remove("go"); void g.offsetWidth; g.classList.add("go"); }; $("button", el).onclick = run; onSeen(el, run); } },
{ id: "pathdraw", c: "motion", t: "Dessin au trait", d: "Une illustration qui se dessine", h: `<div class="dm-draw"><svg viewBox="0 0 200 120"><path d="M10 100 L10 50 L60 20 L110 50 L110 100 Z M40 100 V70 H80 V100 M130 100 C130 60 190 60 190 100 M150 100 V75 H170 V100" /></svg><button class="mini">Rejouer</button></div>`,
  i: el => { const p = $("path", el), L = p.getTotalLength(); p.style.strokeDasharray = L; const run = () => { p.style.transition = "none"; p.style.strokeDashoffset = L; void p.getBoundingClientRect(); p.style.transition = "stroke-dashoffset 2.4s var(--ease)"; p.style.strokeDashoffset = 0; }; $("button", el).onclick = run; onSeen(el, run); } },

/* ------------------- EFFETS ------------------- */
{ id: "tilt", c: "effet", t: "Carte 3D inclinable", d: "Reflet lumineux au survol", h: `<div class="dm-tilt" data-hover><div class="tc"><span class="mono">CARTE MEMBRE</span><b>Café Atlas</b><small class="mono">N° 0042 · GOLD</small><i class="gl"></i></div></div>`,
  i: el => { const c = $(".tc", el), g = $(".gl", el); el.addEventListener("pointermove", e => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; c.style.transform = `rotateX(${(.5 - y) * 22}deg) rotateY(${(x - .5) * 26}deg)`; g.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%,rgba(255,255,255,.45),transparent 50%)`; }); el.addEventListener("pointerleave", () => { c.style.transform = ""; g.style.background = ""; }); } },
{ id: "spot", c: "effet", t: "Grille projecteur", d: "La lumière suit votre curseur", h: `<div class="dm-spot">${"<i></i>".repeat(9)}</div>`,
  i: el => el.addEventListener("pointermove", e => $$("i", el).forEach(i => { const r = i.getBoundingClientRect(); i.style.setProperty("--x", e.clientX - r.left + "px"); i.style.setProperty("--y", e.clientY - r.top + "px"); })) },
{ id: "magnet", c: "effet", t: "Bouton magnétique", d: "Il est attiré par le curseur", h: `<div class="dm-mag"><span class="mag2"><button class="btn acc">Réserver</button></span></div>`,
  i: el => { const m = $(".mag2", el), b = $("button", el); el.addEventListener("pointermove", e => { const r = m.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .35}px,${(e.clientY - r.top - r.height / 2) * .45}px)`; }); el.addEventListener("pointerleave", () => b.style.transform = ""); b.onclick = () => toast("Réservation simulée", "📅"); } },
{ id: "trail", c: "effet", t: "Traînée lumineuse", d: "Dessinez avec la souris ou le doigt", h: `<canvas class="dm-cv"></canvas><small class="hint mono">bougez ici</small>`,
  i: el => { const cv = $("canvas", el), x = cv.getContext("2d"); let P = []; const fit = () => { cv.width = el.clientWidth * 2; cv.height = el.clientHeight * 2; x.scale(2, 2); }; fit();
    el.addEventListener("pointermove", e => { const r = cv.getBoundingClientRect(); for (let k = 0; k < 3; k++) P.push({ x: e.clientX - r.left, y: e.clientY - r.top, vx: (Math.random() - .5) * 2, vy: (Math.random() - .5) * 2, l: 1, h: 15 + Math.random() * 25 }); });
    (function loop() { x.clearRect(0, 0, cv.width, cv.height); P = P.filter(p => (p.l -= .02) > 0); P.forEach(p => { p.x += p.vx; p.y += p.vy; x.beginPath(); x.arc(p.x, p.y, 8 * p.l, 0, 7); x.fillStyle = `hsla(${p.h},100%,60%,${p.l})`; x.fill(); }); requestAnimationFrame(loop); })(); } },
{ id: "const", c: "effet", t: "Constellation", d: "Particules reliées entre elles", h: `<canvas class="dm-cv"></canvas>`,
  i: el => { const cv = $("canvas", el), x = cv.getContext("2d"); let W, H, m = { x: -99, y: -99 }; const fit = () => { W = el.clientWidth; H = el.clientHeight; cv.width = W * 2; cv.height = H * 2; x.setTransform(2, 0, 0, 2, 0, 0); }; fit();
    const P = Array.from({ length: 46 }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .6, vy: (Math.random() - .5) * .6 }));
    el.addEventListener("pointermove", e => { const r = cv.getBoundingClientRect(); m = { x: e.clientX - r.left, y: e.clientY - r.top }; }); el.addEventListener("pointerleave", () => m = { x: -99, y: -99 });
    (function loop() { x.clearRect(0, 0, W, H); const A = [...P, m]; P.forEach(p => { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; });
      for (let a = 0; a < A.length; a++) for (let b = a + 1; b < A.length; b++) { const d = Math.hypot(A[a].x - A[b].x, A[a].y - A[b].y); if (d < 90) { x.strokeStyle = `rgba(255,90,44,${1 - d / 90})`; x.lineWidth = .8; x.beginPath(); x.moveTo(A[a].x, A[a].y); x.lineTo(A[b].x, A[b].y); x.stroke(); } }
      P.forEach(p => { x.fillStyle = "#e9d8b8"; x.fillRect(p.x - 1.2, p.y - 1.2, 2.4, 2.4); }); requestAnimationFrame(loop); })(); } },
{ id: "glitch", c: "effet", t: "Glitch", d: "Effet écran numérique", h: `<div class="dm-glitch" data-text="BABORA">BABORA</div>` },
{ id: "conic", c: "effet", t: "Bordure animée", d: "Un liseré lumineux qui tourne", h: `<div class="dm-conic"><div><b>Offre Premium</b><small class="mono">bordure en rotation</small></div></div>` },
{ id: "reveal", c: "effet", t: "Révélation d'image", d: "Une seconde photo se dévoile au survol", h: `<div class="dm-rev" data-cursor="Voir"><img src="${IMG1}" alt="" loading="lazy"><img class="top" src="${IMG2}" alt="" loading="lazy"></div>`,
  i: el => { const t = $(".top", el); el.addEventListener("pointermove", e => { const r = el.getBoundingClientRect(); t.style.clipPath = `circle(90px at ${e.clientX - r.left}px ${e.clientY - r.top}px)`; }); el.addEventListener("pointerleave", () => t.style.clipPath = "circle(0 at 50% 50%)"); } },
{ id: "flip", c: "effet", t: "Carte retournable", d: "Recto, verso, en 3D", h: `<div class="dm-flip" data-hover><div class="in"><div class="f"><b>Tajine royal</b><small class="mono">touchez pour retourner</small></div><div class="b"><b>120 DH</b><small>Agneau, pruneaux, amandes</small></div></div></div>`,
  i: el => { const f = $(".dm-flip", el); f.addEventListener("click", () => f.classList.toggle("on")); } },
{ id: "ripple", c: "effet", t: "Onde au clic", d: "Le bouton réagit sous le doigt", h: `<div class="dm-rip"><button class="rb">Commander</button></div>`,
  i: el => { const b = $("button", el); b.addEventListener("pointerdown", e => { const r = b.getBoundingClientRect(), s = document.createElement("i"); s.style.left = e.clientX - r.left + "px"; s.style.top = e.clientY - r.top + "px"; b.append(s); setTimeout(() => s.remove(), 700); }); } },
{ id: "aurora", c: "effet", t: "Fond aurore", d: "Dégradés en mouvement lent", w: 1, h: `<div class="dm-aur"><i></i><i></i><i></i><b>Un fond qui vit</b></div>` },
{ id: "cursorlab", c: "effet", t: "Curseur personnalisé", d: "Cercle qui grossit sur les liens", h: `<div class="dm-curs"><div class="ring"></div><a href="#" onclick="return false">Lien</a><button>Bouton</button></div>`,
  i: el => { const r = $(".ring", el); let X = 0, Y = 0, x = 0, y = 0; el.addEventListener("pointermove", e => { const b = el.getBoundingClientRect(); X = e.clientX - b.left; Y = e.clientY - b.top; r.classList.toggle("big", !!e.target.closest("a,button")); });
    (function loop() { x = lerp(x, X, .2); y = lerp(y, Y, .2); r.style.transform = `translate(${x}px,${y}px)`; requestAnimationFrame(loop); })(); } },

/* ------------------- WIDGETS ------------------- */
{ id: "openclose", c: "widget", t: "Ouvert / fermé en direct", d: "Selon l'heure réelle au Maroc", h: `<div class="dm-open"><div class="st"><span class="dot"></span><b></b></div><small class="mono"></small><ul></ul></div>`,
  i: el => { const H = { 0: null, 1: ["09:00", "20:00"], 2: ["09:00", "20:00"], 3: ["09:00", "20:00"], 4: ["09:00", "20:00"], 5: ["09:00", "13:00"], 6: ["10:00", "18:00"] };
    const r = () => { const { wd, min, hm } = casa(), h = H[wd], on = h && min >= toMin(h[0]) && min < toMin(h[1]); $("b", el).textContent = on ? "Ouvert maintenant" : "Fermé"; $(".dot", el).classList.toggle("off", !on); $("small", el).textContent = `Il est ${hm} à Casablanca`;
      $("ul", el).innerHTML = [1, 2, 3, 4, 5, 6, 0].map(d => `<li class="${d === wd ? "t" : ""}"><span>${JOURS_L[d].slice(0, 3)}</span><span>${H[d] ? fmtH(H[d][0]) + "–" + fmtH(H[d][1]) : "fermé"}</span></li>`).join(""); }; r(); setInterval(r, 30000); } },
{ id: "chat", c: "widget", t: "Bulle WhatsApp", d: "Un message d'accueil qui s'écrit", h: `<div class="dm-chat"><div class="hd"><i></i><div><b>Café Atlas</b><small>en ligne</small></div></div><div class="msgs"></div><button class="mini">Rejouer</button></div>`,
  i: el => { const box = $(".msgs", el); const run = async () => { box.innerHTML = ""; const add = (h, me) => { const d = document.createElement("div"); d.className = "m" + (me ? " me" : ""); d.innerHTML = h; box.append(d); return d; }; const w = ms => new Promise(r => setTimeout(r, ms));
    let t = add('<span class="typing"><i></i><i></i><i></i></span>'); await w(1200); t.innerHTML = "Bonjour ! 👋 Une table pour ce soir ?"; await w(900); add("Oui, pour 4 personnes à 20h", 1); await w(700); t = add('<span class="typing"><i></i><i></i><i></i></span>'); await w(1100); t.innerHTML = "C'est réservé ✅ À ce soir !"; };
    $("button", el).onclick = run; onSeen(el, run); } },
{ id: "booking", c: "widget", t: "Réservation de créneau", d: "Choix du jour et de l'heure", h: `<div class="dm-book"><div class="days"></div><div class="slots2"></div><button class="btn acc sm" disabled>Choisissez un créneau</button></div>`,
  i: el => { const days = $(".days", el), sl = $(".slots2", el), b = $("button", el); let D0 = null, S0 = null; const now = new Date();
    for (let k = 0; k < 5; k++) { const d = new Date(now); d.setDate(d.getDate() + k + 1); const x = document.createElement("button"); x.innerHTML = `<small>${JOURS_L[d.getDay()].slice(0, 3)}</small><b>${d.getDate()}</b>`; x.onclick = () => { $$("button", days).forEach(y => y.classList.toggle("on", y === x)); D0 = d; S0 = null; slots(); }; days.append(x); }
    const slots = () => { sl.innerHTML = ["10:00", "11:30", "14:00", "15:30", "17:00", "18:30"].map((s, k) => `<button ${(k + D0.getDate()) % 4 === 0 ? "disabled" : ""}>${s}</button>`).join(""); upd(); };
    sl.addEventListener("click", e => { const x = e.target.closest("button:not(:disabled)"); if (!x) return; $$("button", sl).forEach(y => y.classList.toggle("on", y === x)); S0 = x.textContent; upd(); });
    const upd = () => { b.disabled = !S0; b.textContent = S0 ? `Confirmer ${JOURS_L[D0.getDay()]} ${D0.getDate()} à ${S0}` : "Choisissez un créneau"; };
    b.onclick = () => { confetti(60); toast("Créneau réservé (démo)", "📅"); }; days.firstChild.click(); } },
{ id: "pricetog", c: "widget", t: "Tarifs mensuel / annuel", d: "Interrupteur avec prix animés", h: `<div class="dm-pt"><div class="sw"><button class="on">Mensuel</button><button>Annuel <em>-20%</em></button><i></i></div><div class="pr"><b>199</b><span> DH / mois</span></div></div>`,
  i: el => { const bs = $$(".sw button", el), pr = $("b", el), sw = $(".sw", el); bs.forEach((b, k) => b.onclick = () => { bs.forEach(x => x.classList.toggle("on", x === b)); sw.classList.toggle("r", k === 1); const to = k ? 159 : 199, from = +pr.textContent, t0 = performance.now(); const f = t => { const q = Math.min(1, (t - t0) / 500); pr.textContent = Math.round(from + (to - from) * q); if (q < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }); } },
{ id: "beforeafter", c: "widget", t: "Avant / après", d: "Faites glisser pour comparer", w: 1, h: `<div class="dm-ba"><img src="${IMG3}" alt="" loading="lazy"><div class="af"><img src="${IMG3}" alt="" loading="lazy"></div><input type="range" min="0" max="100" value="50" aria-label="Comparer"><i class="hd"></i><span class="l mono">AVANT</span><span class="r mono">APRÈS</span></div>`,
  i: el => { const ba = $(".dm-ba", el), r = $("input", el), set = () => ba.style.setProperty("--p", r.value + "%"); r.addEventListener("input", set); set();
    let drag = false; const mv = e => { const q = ba.getBoundingClientRect(); r.value = Math.max(0, Math.min(100, (e.clientX - q.left) / q.width * 100)); set(); };
    ba.addEventListener("pointerdown", e => { drag = true; ba.setPointerCapture(e.pointerId); mv(e); e.preventDefault(); }); ba.addEventListener("pointermove", e => drag && mv(e)); ba.addEventListener("pointerup", () => drag = false); ba.addEventListener("pointercancel", () => drag = false); } },
{ id: "tabs", c: "widget", t: "Onglets fluides", d: "L'indicateur glisse d'un onglet à l'autre", h: `<div class="dm-tabs"><div class="tl"><button class="on">Entrées</button><button>Plats</button><button>Desserts</button><i></i></div><div class="tp"><p>Salade marocaine, briouates, harira.</p><p>Tajine, couscous, pastilla.</p><p>Cornes de gazelle, msemen au miel.</p></div></div>`,
  i: el => { const bs = $$(".tl button", el), ind = $(".tl i", el), ps = $$(".tp p", el); const go = k => { bs.forEach((b, j) => b.classList.toggle("on", j === k)); ps.forEach((p, j) => p.classList.toggle("on", j === k)); ind.style.left = bs[k].offsetLeft + "px"; ind.style.width = bs[k].offsetWidth + "px"; }; bs.forEach((b, k) => b.onclick = () => go(k)); requestAnimationFrame(() => go(0)); onSeen(el, () => go(bs.findIndex(b => b.classList.contains("on")))); } },
{ id: "accordion", c: "widget", t: "Accordéon", d: "Questions qui s'ouvrent en douceur", h: `<div class="dm-acc"><div class="it on"><button>Livrez-vous ?</button><div><p>Oui, partout à Casablanca en 45 minutes.</p></div></div><div class="it"><button>Paiement à la livraison ?</button><div><p>Oui, en espèces ou par carte.</p></div></div><div class="it"><button>Ouvert le dimanche ?</button><div><p>Oui, de 10h à 18h.</p></div></div></div>`,
  i: el => $$(".it button", el).forEach(b => b.onclick = () => { const it = b.parentElement, o = !it.classList.contains("on"); $$(".it", el).forEach(x => x.classList.remove("on")); if (o) it.classList.add("on"); }) },
{ id: "toasts", c: "widget", t: "Notifications", d: "Petits messages de confirmation", h: `<div class="dm-toast"><button class="btn sm">Ajouter au panier</button><button class="btn ghost sm">Copier le code promo</button></div>`,
  i: el => { const [a, b] = $$("button", el); a.onclick = () => toast("Ajouté au panier", "🛍️"); b.onclick = () => toast("Code ATLAS20 copié", "🎟️"); } },
{ id: "lang", c: "widget", t: "Changement de langue", d: "Le contenu change, l'arabe passe à droite", h: `<div class="dm-lang"><div class="sw3"><button class="on" data-l="fr">FR</button><button data-l="ar">AR</button><button data-l="en">EN</button></div><div class="tx"><b></b><p></p></div></div>`,
  i: el => { const T = { fr: ["Bienvenue", "Découvrez notre menu et réservez votre table."], ar: ["مرحبا بكم", "اكتشفوا قائمتنا واحجزوا طاولتكم."], en: ["Welcome", "Discover our menu and book your table."] }; const tx = $(".tx", el);
    const set = l => { tx.classList.add("out"); setTimeout(() => { $("b", tx).textContent = T[l][0]; $("p", tx).textContent = T[l][1]; tx.dir = l === "ar" ? "rtl" : "ltr"; tx.classList.remove("out"); }, 200); $$("button", el).forEach(b => b.classList.toggle("on", b.dataset.l === l)); };
    $$("button", el).forEach(b => b.onclick = () => set(b.dataset.l)); set("fr"); } },
{ id: "rating", c: "widget", t: "Notation par étoiles", d: "Pour recueillir l'avis des clients", h: `<div class="dm-rate"><div class="stars">${"<button>★</button>".repeat(5)}</div><small class="mono">Votre note</small></div>`,
  i: el => { const s = $$("button", el), lab = ["", "Décevant", "Moyen", "Bien", "Très bien", "Excellent !"]; let v = 0; const paint = n => s.forEach((b, k) => b.classList.toggle("on", k < n));
    s.forEach((b, k) => { b.onmouseenter = () => paint(k + 1); b.onclick = () => { v = k + 1; paint(v); $("small", el).textContent = lab[v]; if (v === 5) confetti(50); }; }); $(".stars", el).onmouseleave = () => paint(v); } },
{ id: "countdown", c: "widget", t: "Compte à rebours", d: "Pour une promotion ou une ouverture", h: `<div class="dm-cd"><small class="mono">L'offre se termine dans</small><div><span><b>0</b>j</span><span><b>0</b>h</span><span><b>0</b>min</span><span><b>0</b>s</span></div></div>`,
  i: el => { const end = new Date(); end.setMonth(end.getMonth() + 1, 1); end.setHours(0, 0, 0, 0); const b = $$("b", el);
    const t = () => { let s = Math.max(0, (end - new Date()) / 1000 | 0); const v = [s / 86400 | 0, (s % 86400) / 3600 | 0, (s % 3600) / 60 | 0, s % 60]; v.forEach((x, k) => { const n = String(x).padStart(2, "0"); if (b[k].textContent !== n) { b[k].textContent = n; b[k].classList.remove("tick"); void b[k].offsetWidth; b[k].classList.add("tick"); } }); }; t(); setInterval(t, 1000); } },
{ id: "themesw", c: "widget", t: "Interrupteur jour / nuit", d: "Soleil et lune animés", h: `<div class="dm-ts"><button class="tsw" aria-label="Jour ou nuit"><i></i></button><small class="mono">Jour</small></div>`,
  i: el => { const b = $("button", el); b.onclick = () => { el.classList.toggle("night"); $("small", el).textContent = el.classList.contains("night") ? "Nuit" : "Jour"; }; } },
{ id: "skeleton", c: "widget", t: "Chargement squelette", d: "Une silhouette avant le contenu", h: `<div class="dm-sk"><div class="c"><i class="im"></i><div><i></i><i></i><i class="s"></i></div></div><button class="mini">Rejouer</button></div>`,
  i: el => { const c = $(".c", el); const run = () => { c.classList.remove("done"); c.innerHTML = `<i class="im"></i><div><i></i><i></i><i class="s"></i></div>`; setTimeout(() => { c.classList.add("done"); c.innerHTML = `<img src="${IMG1}" alt=""><div><b>Café Atlas</b><p>Le meilleur café du quartier.</p><small class="mono">★ Ouvert</small></div>`; }, 1800); }; $("button", el).onclick = run; onSeen(el, run); } },
{ id: "stepform", c: "widget", t: "Formulaire en étapes", d: "Une question à la fois", h: `<div class="dm-sf"><div class="bar"><i></i></div><div class="q"><small class="mono">Étape <span>1</span> / 3</small><b>Votre prénom ?</b><input placeholder="Yasmine"></div><button class="btn sm">Suivant</button></div>`,
  i: el => { const Q = ["Votre prénom ?", "Votre ville ?", "Votre besoin ?"], P = ["Yasmine", "Casablanca", "Un site vitrine"]; let k = 0; const b = $("button", el);
    b.onclick = () => { if (k === 2) { confetti(60); toast("Formulaire envoyé (démo)"); k = -1; } k++; $(".q", el).classList.add("out"); setTimeout(() => { $(".q span", el).textContent = k + 1; $(".q b", el).textContent = Q[k]; $(".q input", el).placeholder = P[k]; $(".q input", el).value = ""; $(".q", el).classList.remove("out"); }, 250); $(".bar i", el).style.width = (k + 1) / 3 * 100 + "%"; b.textContent = k === 2 ? "Envoyer" : "Suivant"; }; } },

/* ------------------- COMMERCE ------------------- */
{ id: "menu", c: "commerce", t: "Menu de restaurant", d: "Filtres par catégorie", w: 1, h: `<div class="dm-menu"><div class="fl"><button class="on" data-c="all">Tout</button><button data-c="p">Plats</button><button data-c="b">Boissons</button><button data-c="d">Desserts</button></div><ul></ul></div>`,
  i: el => { const M = [["Tajine poulet citron", "p", 85], ["Couscous royal", "p", 110], ["Pastilla", "p", 95], ["Thé à la menthe", "b", 15], ["Jus d'orange frais", "b", 20], ["Café nous-nous", "b", 14], ["Cornes de gazelle", "d", 30], ["Chebakia", "d", 25]]; const ul = $("ul", el);
    const r = c => { ul.innerHTML = M.filter(m => c === "all" || m[1] === c).map((m, k) => `<li style="--i:${k}"><span>${m[0]}</span><i></i><b>${m[2]} DH</b></li>`).join(""); };
    $$(".fl button", el).forEach(b => b.onclick = () => { $$(".fl button", el).forEach(x => x.classList.toggle("on", x === b)); r(b.dataset.c); }); r("all"); } },
{ id: "config", c: "commerce", t: "Configurateur produit", d: "Changez la couleur du produit", h: `<div class="dm-cfg"><svg viewBox="0 0 120 120"><path class="cup" d="M28 38h56v44a18 18 0 0 1-18 18H46a18 18 0 0 1-18-18z"/><path d="M84 50h8a10 10 0 0 1 0 20h-8" fill="none" stroke="var(--c)" stroke-width="6"/><path d="M44 18c0 6 6 6 6 12M62 16c0 6 6 6 6 12" fill="none" stroke="var(--faint)" stroke-width="3" stroke-linecap="round"/></svg><div class="sws"><button style="--s:#ff5a2c" class="on"></button><button style="--s:#2f6fb5"></button><button style="--s:#3ddc84"></button><button style="--s:#e9d8b8"></button><button style="--s:#1b1b1e"></button></div><b>Tasse Atlas · 79 DH</b></div>`,
  i: el => { const c = $(".dm-cfg", el); $$(".sws button", el).forEach(b => b.onclick = () => { $$(".sws button", el).forEach(x => x.classList.toggle("on", x === b)); c.style.setProperty("--c", b.style.getPropertyValue("--s")); }); } },
{ id: "cartw", c: "commerce", t: "Panier animé", d: "Le produit vole jusqu'au panier", h: `<div class="dm-cartw"><div class="prod"><img src="${IMG3}" alt="" loading="lazy"><div><b>Zellige bleu</b><small>45 DH / pièce</small></div><button class="btn acc sm">Ajouter</button></div><div class="bag"><span>🛍️</span><b>0</b></div></div>`,
  i: el => { let n = 0; $("button", el).onclick = () => { const img = $("img", el), bag = $(".bag", el), a = img.getBoundingClientRect(), z = bag.getBoundingClientRect(), f = img.cloneNode(); Object.assign(f.style, { position: "fixed", left: a.left + "px", top: a.top + "px", width: a.width + "px", height: a.height + "px", zIndex: 300, borderRadius: "10px", transition: "all .8s cubic-bezier(.6,-.2,.7,1)", objectFit: "cover" }); document.body.append(f);
    requestAnimationFrame(() => Object.assign(f.style, { left: z.left + 10 + "px", top: z.top + 6 + "px", width: "20px", height: "20px", opacity: .3 })); setTimeout(() => { f.remove(); $("b", bag).textContent = ++n; bag.classList.remove("pop"); void bag.offsetWidth; bag.classList.add("pop"); }, 800); }; } },
{ id: "gallery", c: "commerce", t: "Galerie plein écran", d: "Touchez une photo pour l'agrandir", h: `<div class="dm-gal"><img src="${IMG1}" alt="" loading="lazy"><img src="${IMG2}" alt="" loading="lazy"><img src="${IMG3}" alt="" loading="lazy"></div>`,
  i: el => $$("img", el).forEach(im => im.onclick = () => { const o = document.createElement("div"); o.className = "lightbox"; o.innerHTML = `<img src="${im.src}" alt=""><button class="ib" aria-label="Fermer">✕</button>`; document.body.append(o); requestAnimationFrame(() => o.classList.add("on")); const c = () => { o.classList.remove("on"); setTimeout(() => o.remove(), 400); }; o.onclick = c; addEventListener("keydown", function k(e) { if (e.key === "Escape") { c(); removeEventListener("keydown", k); } }); }) },
{ id: "mapcard", c: "commerce", t: "Carte d'accès", d: "Adresse, itinéraire et distance", h: `<div class="dm-map"><div class="mp"><i class="pin"></i><i class="pulse"></i></div><div class="inf"><b>Café Atlas</b><small>Bd d'Anfa, Casablanca</small><button class="btn sm">Itinéraire →</button></div></div>`,
  i: el => $("button", el).onclick = () => toast("Ouvre Google Maps sur le vrai site", "📍") },
{ id: "promo", c: "commerce", t: "Bannière promo", d: "Une annonce qui attire l'œil", w: 1, h: `<div class="dm-promo"><span class="mono">NOUVEAU</span><b>-20% sur toute la collection</b><span class="mono">code : ATLAS20</span><button class="btn sm" data-c>Copier le code</button></div>`,
  i: el => $("[data-c]", el).onclick = () => copy("ATLAS20", "Code promo copié") },
{ id: "confettibtn", c: "commerce", t: "Célébration", d: "Des confettis après une commande", h: `<div class="dm-conf"><button class="btn acc">Valider ma commande</button></div>`,
  i: el => $("button", el).onclick = () => { confetti(160); toast("Merci pour votre commande !", "🎉"); } },
];

/* ---------- utilitaire : lancer quand la démo devient visible ---------- */
function onSeen(el, fn) { const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { o.disconnect(); fn(); } }, { threshold: .4 }); o.observe(el); }

/* ---------- construction de la grille ---------- */
const grid = $("#grid"), CAT = { motion: "Mouvement", effet: "Effet", widget: "Widget", commerce: "Commerce" };
grid.innerHTML = D.map((d, k) => `<article class="card demo rv${d.w ? " w2" : ""}" data-c="${d.c}" data-id="${d.id}" style="--d:${(k % 3) * .06}s"><div class="stagebox" data-dm="${d.id}">${d.h}</div><div class="info"><div><h3>${d.t}</h3><p>${CAT[d.c]} · ${d.d}</p></div><button class="add" aria-label="Ajouter « ${d.t} » à ma sélection" title="Ajouter à ma sélection">+</button></div></article>`).join("");
$("#ndemos").textContent = D.length;
D.forEach(d => { if (d.i) try { d.i($(`[data-dm="${d.id}"]`, grid)); } catch (e) { console.warn(d.id, e); } });
$$("[data-scramble]").forEach(el => el.addEventListener("pointerenter", () => scramble(el)));
document.addEventListener("bb:ready", () => $$(".demo", grid).forEach(el => io.observe(el)));
if (document.body.classList.contains("loaded")) $$(".demo", grid).forEach(el => io.observe(el));

/* ---------- filtres ---------- */
const fb = $$(".lab-tools .filters button"), pillL = $(".lab-tools .pill");
const movePillL = b => { pillL.style.left = b.offsetLeft + "px"; pillL.style.width = b.offsetWidth + "px"; };
const count = () => { const n = $$(".demo:not(.hidden)", grid).length; $("#count").textContent = `${n} démo${n > 1 ? "s" : ""}`; };
fb.forEach(b => b.addEventListener("click", () => { fb.forEach(x => x.classList.toggle("on", x === b)); movePillL(b); $$(".demo", grid).forEach(d => d.classList.toggle("hidden", b.dataset.f !== "all" && d.dataset.c !== b.dataset.f)); count(); }));
requestAnimationFrame(() => movePillL(fb[0])); addEventListener("resize", () => movePillL($(".lab-tools .filters button.on"))); count();

/* ---------- sélection (panier d'effets) ---------- */
let sel = new Set(JSON.parse(store.get("bb-lab") || "[]"));
const cart = $("#cart");
const renderCart = () => {
  $$(".demo", grid).forEach(d => { const on = sel.has(d.dataset.id); const a = $(".add", d); a.classList.toggle("on", on); a.textContent = on ? "✓" : "+"; a.setAttribute("aria-pressed", on); });
  const n = sel.size; $("#cartn").textContent = n; $("#carts").textContent = $("#carts2").textContent = n > 1 ? "s" : ""; cart.classList.toggle("show", n > 0);
  const names = D.filter(d => sel.has(d.id)).map(d => "• " + d.t);
  $("#cartsend").href = wa(`Bonjour Babora, j'ai visité le Labo. Je voudrais ces effets sur mon site :\n${names.join("\n")}`);
  store.set("bb-lab", JSON.stringify([...sel]));
};
grid.addEventListener("click", e => { const a = e.target.closest(".add"); if (!a) return; const id = a.closest(".demo").dataset.id; if (sel.has(id)) sel.delete(id); else { sel.add(id); toast("Ajouté à votre sélection", "✦"); } renderCart(); });
$("#cartclear").addEventListener("click", () => { sel.clear(); renderCart(); });
renderCart();

/* ---------- titre cinétique du Labo ---------- */
(() => {
  const k = $("#kin"); if (!k) return; const txt = k.childNodes[0].textContent; k.childNodes[0].replaceWith(...[...txt].map(c => { const s = document.createElement("span"); s.className = "kc"; s.textContent = c; return s; }));
  const L = $$(".kc", k); let mx = -1e4, my = -1e4;
  addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  (function loop() { L.forEach(s => { const r = s.getBoundingClientRect(), d = Math.hypot(r.left + r.width / 2 - mx, r.top + r.height / 2 - my), f = Math.max(0, 1 - d / 260); s.style.transform = `translateY(${-f * 18}px) scaleY(${1 + f * .18})`; s.style.color = f > .05 ? `color-mix(in srgb,var(--accent) ${f * 100}%,var(--text))` : ""; }); requestAnimationFrame(loop); })();
})();
