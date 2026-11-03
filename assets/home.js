/* ================= Babora v2 — page d'accueil ================= */

/* ---------- champ de particules interactif (hero) ---------- */
(() => {
  const cv = $("#field"); if (!cv) return; const ctx = cv.getContext("2d");
  let W, H, dpr, pts = [], mx = -999, my = -999, run = true;
  const size = () => { dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const gap = W < 640 ? 34 : 42; pts = []; for (let y = gap / 2; y < H; y += gap) for (let x = gap / 2; x < W; x += gap) pts.push({ ox: x, oy: y, x, y, vx: 0, vy: 0 }); };
  size(); addEventListener("resize", size);
  cv.closest(".hero").addEventListener("pointermove", e => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
  cv.closest(".hero").addEventListener("pointerleave", () => { mx = my = -999; });
  new IntersectionObserver(([e]) => run = e.isIntersecting).observe(cv);
  let t = 0;
  (function loop() {
    requestAnimationFrame(loop); if (!run) return; t += .012;
    const light = document.documentElement.dataset.theme === "light";
    ctx.clearRect(0, 0, W, H);
    for (const p of pts) {
      const wave = reduced ? 0 : Math.sin(p.ox * .012 + t) * Math.cos(p.oy * .014 + t * .8) * 6;
      const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy), R = 140;
      if (d < R) { const f = (1 - d / R) * 2.2; p.vx += dx / d * f; p.vy += dy / d * f; }
      p.vx += (p.ox - p.x) * .05; p.vy += (p.oy + wave - p.y) * .05; p.vx *= .82; p.vy *= .82; p.x += p.vx; p.y += p.vy;
      const near = Math.max(0, 1 - d / 220);
      ctx.fillStyle = near > 0 ? `rgba(255,${90 + 60 * (1 - near) | 0},44,${.25 + near * .75})` : (light ? "rgba(0,0,0,.18)" : "rgba(255,255,255,.14)");
      const s = 1.2 + near * 2.6; ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
    }
  })();
})();

/* ---------- mot qui tourne dans le titre ---------- */
(() => {
  const rot = $("#rot"); if (!rot) return; const w = $$("span", rot); let i = 0;
  setInterval(() => { if (document.hidden) return; const cur = w[i]; cur.classList.remove("on"); cur.classList.add("out"); i = (i + 1) % w.length; const nx = w[i]; nx.classList.remove("out"); void nx.offsetWidth; nx.classList.add("on"); setTimeout(() => cur.classList.remove("out"), 900); }, 2400);
})();

/* ---------- projets : filtres, inclinaison 3D, aperçu au survol ---------- */
const filters = $(".filters"), pill = $(".filters .pill");
const movePill = b => { pill.style.left = b.offsetLeft + "px"; pill.style.width = b.offsetWidth + "px"; };
if (filters) {
  const btns = $$("button", filters); requestAnimationFrame(() => movePill($("button.on", filters))); addEventListener("resize", () => movePill($("button.on", filters)));
  btns.forEach(b => b.addEventListener("click", () => {
    btns.forEach(x => x.classList.toggle("on", x === b)); movePill(b); const f = b.dataset.f;
    $$(".proj").forEach(p => { const show = f === "all" || p.dataset.cat === f; p.classList.toggle("hidden", !show); if (show) { p.classList.remove("in"); requestAnimationFrame(() => p.classList.add("in")); } });
  }));
}
const sizeViews = () => $$(".view").forEach(v => v.style.setProperty("--vh", v.clientHeight + "px"));
addEventListener("load", sizeViews); addEventListener("resize", sizeViews); sizeViews();
if (finePointer && !reduced) $$(".proj").forEach(p => {
  const fr = $(".frame", p), gl = $(".glare", p);
  p.addEventListener("pointermove", e => { const r = fr.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; fr.style.transform = `perspective(1200px) rotateX(${(.5 - y) * 6}deg) rotateY(${(x - .5) * 8}deg)`; if (gl) { gl.style.setProperty("--gx", x * 100 + "%"); gl.style.setProperty("--gy", y * 100 + "%"); } });
  p.addEventListener("pointerleave", () => fr.style.transform = "");
});

/* ---------- visionneuse : ordinateur / tablette / téléphone ---------- */
(() => {
  const m = $("#viewer"); if (!m) return; const fr = $("#vframe"), dev = $("#device");
  const open = p => {
    $("#vtitle").textContent = p.dataset.title; fr.src = p.dataset.url; $("#vopen").href = p.dataset.url;
    $("#vwa").href = wa(`Bonjour Babora, j'ai vu le projet « ${p.dataset.title} » et je voudrais un site dans ce style.`);
    m.classList.add("open"); document.body.style.overflow = "hidden"; setTimeout(() => $("#vclose").focus(), 50);
  };
  closeModal = () => { m.classList.remove("open"); document.body.style.overflow = ""; setTimeout(() => fr.src = "about:blank", 400); };
  $$(".proj[data-url]").forEach(p => p.addEventListener("click", e => { if (e.metaKey || e.ctrlKey) return; e.preventDefault(); open(p); }));
  $("#vclose").addEventListener("click", closeModal);
  m.addEventListener("click", e => { if (e.target === m) closeModal(); });
  $$(".devs button", m).forEach(b => b.addEventListener("click", () => { $$(".devs button", m).forEach(x => x.classList.toggle("on", x === b)); dev.className = "device " + b.dataset.dev; }));
})();

/* ---------- méthode : ligne qui se dessine au défilement ---------- */
(() => {
  const st = $("#steps"); if (!st) return; const line = $(".line i", st), steps = $$(".step", st);
  const f = () => { const r = st.getBoundingClientRect(), p = Math.max(0, Math.min(1, (innerHeight * .75 - r.top) / (r.height + innerHeight * .25))); line.style.setProperty("--p", p); steps.forEach((s, i) => s.classList.toggle("on", p > i / steps.length + .05)); };
  addEventListener("scroll", f, { passive: true }); f();
})();

/* ---------- anneaux de qualité ---------- */
const rio = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; rio.unobserve(e.target); $(".fg", e.target).style.strokeDashoffset = 327 * (1 - e.target.dataset.score / 100); }), { threshold: .5 });
$$(".ring").forEach(r => rio.observe(r));

/* ---------- estimateur de prix ---------- */
(() => {
  const c = $("#calc"); if (!c) return; const E = CFG.estimateur, f$ = n => n.toLocaleString("fr-FR").replace(/ | /g, " ");
  $$("[data-p]").forEach(el => el.textContent = "+" + f$(E.options[el.dataset.p]));
  $("#entp").textContent = "+" + E.entretienMois + " € / mois";
  const pages = $("#pages"), NAMES = { multilingue: "Multilingue", reservation: "Réservation", catalogue: "Catalogue / menu", animations: "Animations premium", logo: "Logo simple", express: "Livraison express" };
  let shown = 0;
  const animateTo = v => { const from = shown, t0 = performance.now(); shown = v; const el = $("#tot"); const s = t => { const k = Math.min(1, (t - t0) / 600), x = from + (v - from) * (1 - Math.pow(1 - k, 3)); el.textContent = f$(Math.round(x)); if (k < 1) requestAnimationFrame(s); }; requestAnimationFrame(s); };
  const calc = () => {
    const ty = $("input[name=f]:checked", c).value, inc = E.pagesIncluses[ty];
    if (ty === "essentiel") { pages.value = 1; pages.disabled = true; } else pages.disabled = false;
    const n = +pages.value; $("#pagesv").textContent = n;
    const extra = Math.max(0, n - inc), opts = $$("input[name=o]:checked", c).map(x => x.value), ent = $("#ent").checked;
    const lines = [[`Formule ${ty[0].toUpperCase() + ty.slice(1)}`, E.formules[ty]]];
    if (extra) lines.push([`${extra} page${extra > 1 ? "s" : ""} en plus`, extra * E.pageEnPlus]);
    opts.forEach(o => lines.push([NAMES[o], E.options[o]]));
    const total = lines.reduce((s, l) => s + l[1], 0); animateTo(total);
    $("#pagesinfo").textContent = ty === "essentiel" ? "La formule Essentiel tient sur une page." : `${inc} page${inc > 1 ? "s" : ""} incluse${inc > 1 ? "s" : ""}, puis ${E.pageEnPlus} € par page.`;
    $("#lines").innerHTML = lines.map(l => `<li><span>${l[0]}</span><b>${f$(l[1])} €</b></li>`).join("") + (ent ? `<li><span>Entretien</span><b>${E.entretienMois} € / mois</b></li>` : "");
    $("#totm").textContent = ent ? `+ ${E.entretienMois} € / mois d'entretien` : "paiement unique, en deux fois";
    let days = ty === "essentiel" ? 5 : ty === "vitrine" ? 8 : 21; days += extra + (opts.includes("reservation") ? 3 : 0) + (opts.includes("multilingue") ? 2 : 0);
    if (opts.includes("express")) days = Math.ceil(days * .6);
    $("#delay").textContent = `environ ${days} jours`;
    const msg = `Bonjour Babora, voici mon estimation :\n${lines.map(l => `• ${l[0]} : ${f$(l[1])} €`).join("\n")}${ent ? `\n• Entretien : ${E.entretienMois} € / mois` : ""}\nTotal : ${f$(total)} € (délai environ ${days} jours)\nPouvez-vous me confirmer ?`;
    $("#calcwa").href = wa(msg);
  };
  c.addEventListener("input", calc); calc();
})();

/* ---------- calendrier de démarrage ---------- */
(() => {
  const cal = $("#cal"); if (!cal) return; let view = new Date(); view.setDate(1); let sel = null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const minStart = new Date(today); minStart.setDate(minStart.getDate() + 3);
  const render = () => {
    $("#calm").textContent = MOIS[view.getMonth()] + " " + view.getFullYear();
    const first = (view.getDay() + 6) % 7, days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    let h = ["L","M","M","J","V","S","D"].map(d => `<b>${d}</b>`).join("") + "<span></span>".repeat(first);
    for (let d = 1; d <= days; d++) {
      const dt = new Date(view.getFullYear(), view.getMonth(), d), ok = dt.getDay() === 1 && dt >= minStart && !(restantes === 0 && dt < nextStart);
      const cls = [ok ? "ok" : "", sel && +dt === +sel ? "sel" : "", +dt === +today ? "today" : ""].join(" ");
      h += `<button class="${cls}" ${ok ? "" : "disabled"} data-d="${+dt}" aria-label="${d} ${MOIS[view.getMonth()]}">${d}</button>`;
    }
    cal.innerHTML = h;
    $("#calprev").disabled = view.getFullYear() === today.getFullYear() && view.getMonth() === today.getMonth();
  };
  cal.addEventListener("click", e => {
    const b = e.target.closest("button.ok"); if (!b) return; sel = new Date(+b.dataset.d); render();
    const label = `lundi ${sel.getDate()} ${MOIS[sel.getMonth()]}`, a = $("#calwa");
    a.textContent = `Réserver la semaine du ${label}`; a.href = wa(`Bonjour Babora, je voudrais démarrer mon projet la semaine du ${label}. Est-ce possible ?`);
  });
  $("#calprev").addEventListener("click", () => { view.setMonth(view.getMonth() - 1); render(); });
  $("#calnext").addEventListener("click", () => { view.setMonth(view.getMonth() + 1); render(); });
  $("#calwa").addEventListener("click", e => { if (!sel) { e.preventDefault(); toast("Choisissez d'abord un lundi dans le calendrier", "📅"); } });
  render();
})();

/* ---------- assistant de demande ---------- */
(() => {
  const st = $("#bstage"); if (!st) return; const qs = $$(".bq", st), bars = $$("#stepper i"); let i = 0;
  const data = () => {
    const nom = $("[data-k=nom] input", st).value.trim(), type = $("input[name=bt]:checked", st)?.value, but = $$("input[name=bb]:checked", st).map(x => x.value),
      style = $("input[name=bs]:checked", st)?.value, quand = $("input[name=bw]:checked", st)?.value, plus = $("[data-k=quand] textarea", st).value.trim();
    let m = "Bonjour Babora,\n\nJe voudrais un site web" + (nom ? ` pour ${nom}` : "") + (type ? ` (${type.toLowerCase()})` : "") + ".";
    if (but.length) m += `\nLe site doit : ${but.join(", ")}.`;
    if (style) m += `\nStyle souhaité : ${style}.`;
    if (quand) m += `\nDélai : ${quand}.`;
    if (plus) m += `\n\n${plus}`;
    return m + "\n\nMerci !";
  };
  const upd = () => { const m = data(); $("#bprev").textContent = m; $("#bsend").href = wa(m); };
  const show = n => { i = Math.max(0, Math.min(qs.length - 1, n)); qs.forEach((q, k) => q.classList.toggle("on", k === i)); bars.forEach((b, k) => b.classList.toggle("on", k <= i)); $("#bprevb").style.visibility = i ? "visible" : "hidden"; $("#bnext").textContent = i === qs.length - 1 ? "Terminer ✓" : "Suivant →"; };
  $("#bnext").addEventListener("click", () => { if (i === qs.length - 1) { upd(); confetti(90); toast("Votre message est prêt !", "✨"); $("#bsend").focus(); } else show(i + 1); });
  $("#bprevb").addEventListener("click", () => show(i - 1));
  st.addEventListener("input", upd); st.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.tagName === "INPUT") { e.preventDefault(); show(i + 1); } });
  $("#bcopy").addEventListener("click", () => copy(data(), "Message copié"));
  show(0); upd();
})();

/* ---------- FAQ : accordéon + recherche ---------- */
(() => {
  const list = $("#faql"); if (!list) return;
  $$(".q button", list).forEach(b => b.addEventListener("click", () => {
    const q = b.closest(".q"), o = !q.classList.contains("open");
    $$(".q.open", list).forEach(x => { x.classList.remove("open"); $("button", x).setAttribute("aria-expanded", "false"); });
    if (o) { q.classList.add("open"); b.setAttribute("aria-expanded", "true"); }
  }));
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  $$(".q", list).forEach(q => { q._q = $("button", q).firstChild.textContent; q._a = $(".a p", q).textContent; });
  $("#fsearch").addEventListener("input", e => {
    const v = norm(e.target.value.trim()); let n = 0;
    $$(".q", list).forEach(q => {
      const hit = !v || norm(q._q + " " + q._a).includes(v); q.classList.toggle("hide", !hit); if (hit) n++;
      const hl = s => { if (!v) return s; const i = norm(s).indexOf(v); return i < 0 ? s : s.slice(0, i) + "<mark>" + s.slice(i, i + v.length) + "</mark>" + s.slice(i + v.length); };
      $("button", q).firstChild.replaceWith(document.createRange().createContextualFragment(`<span>${hl(q._q)}</span>`));
      $(".a p", q).innerHTML = hl(q._a);
      if (v && hit && norm(q._a).includes(v)) q.classList.add("open"); else if (!v) q.classList.remove("open");
    });
    let empty = $("#fempty", list); if (!n) { if (!empty) { empty = document.createElement("p"); empty.id = "fempty"; empty.className = "muted"; empty.style.padding = "24px 0"; list.append(empty); } empty.innerHTML = `Pas de réponse ici. <a data-wa href="${wa("Bonjour Babora, j'ai une question : " + e.target.value)}" target="_blank" rel="noopener" style="color:var(--accent)">Posez-la sur WhatsApp →</a>`; } else empty?.remove();
  });
})();
