/* OFFGRID — shared site logic: i18n, layout, cart, drawer, toast, lightbox, countdown, newsletter */
(function () {
  const C = window.OFFGRID_CONFIG, P = window.OFFGRID_PRODUCTS, D = window.OFFGRID_I18N;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- storage ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- language ---------- */
  const LANGS = [["fr", "FR"], ["en", "EN"], ["ar", "ع"]];
  const qLang = new URLSearchParams(location.search).get("lang");
  if (qLang && D[qLang]) store.set("offgrid_lang", qLang);
  const lang = D[store.get("offgrid_lang", C.defaultLang)] ? store.get("offgrid_lang", C.defaultLang) : C.defaultLang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  const t = (k, vars) => { let s = (D[lang] && D[lang][k]) ?? D.fr[k] ?? k; if (vars) for (const v in vars) s = s.replace("{" + v + "}", vars[v]); return s; };
  const L = o => (o && typeof o === "object") ? (o[lang] || o.fr) : o;
  function setLang(l) { store.set("offgrid_lang", l); const u = new URL(location.href); u.searchParams.delete("lang"); location.replace(u.toString()); }
  function applyI18n(root = document) {
    $$("[data-i18n]", root).forEach(el => { el.innerHTML = t(el.dataset.i18n); });
    $$("[data-i18n-ph]", root).forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    $$("[data-i18n-aria]", root).forEach(el => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
  }

  const numLocale = lang === "ar" ? "ar-MA" : "fr-MA";
  const cur = lang === "ar" ? "درهم" : C.currency;
  const money = n => Number(n).toLocaleString(numLocale, { maximumFractionDigits: 0 }) + " " + cur;
  const byId = id => P.find(p => p.id === id);
  const img = n => "/assets/img/" + n + ".webp";
  const igUrl = "https://www.instagram.com/" + C.instagram + "/";
  const igDm = "https://ig.me/m/" + C.instagram;
  const ttUrl = "https://www.tiktok.com/@" + C.tiktok;
  const waUrl = text => "https://wa.me/" + C.whatsapp + (text ? "?text=" + encodeURIComponent(text) : "");
  const deliveryFee = sub => (sub <= 0 || sub >= C.delivery.freeFrom) ? 0 : C.delivery.fee;

  const I = {
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    arrow: '<svg class="dir" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    left: '<svg class="dir" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
    right: '<svg class="dir" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    tt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.5 2.8 2.4 4.6 5 4.8"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M20 12a8 8 0 0 1-11.8 7L4 20l1.1-4A8 8 0 1 1 20 12z"/><path d="M9 9.5c.3 2 2.2 4.2 4.5 4.8l1.2-1.2 1.8.8c-.2 1.2-1.2 1.8-2.2 1.8C11 15.7 8.3 13 8.3 9.8c0-1 .6-2 1.8-2.2l.8 1.8z"/></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" fill="currentColor"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4.5" ry="10"/><path d="M2 12h20M4 7h16M4 17h16"/></svg>',
    cotton: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M7 18a4 4 0 0 1-.6-7.95A5 5 0 0 1 16 8.5a3.5 3.5 0 0 1 1 6.86"/><path d="M12 12v9"/></svg>',
    fit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C12.7 8 16 11.3 22 12C16 12.7 12.7 16 12 22C11.3 16 8 12.7 2 12C8 11.3 11.3 8 12 2Z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    gem: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 3h12l4 6-10 12L2 9l4-6z"/><path d="M2 9h20M9 3l3 18M15 3l-3 18"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 6h12v10H2zM14 10h4l3 3v3h-7"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>'
  };
  const stars = n => '<span class="stars" aria-label="' + n + '/5">' + [1, 2, 3, 4, 5].map(i => `<span class="${i <= n ? "on" : ""}">${I.star}</span>`).join("") + "</span>";

  /* ---------- price ---------- */
  const priceHTML = (p, big) => `<span class="price-wrap${big ? " big" : ""}"><span class="price">${money(p.price)}</span>${p.oldPrice ? `<s class="old">${money(p.oldPrice)}</s><span class="save">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : ""}</span>`;

  /* ---------- cart ---------- */
  const Cart = {
    items() { return store.get("offgrid_cart", []).filter(i => byId(i.id) && C.sizes.includes(i.size)); },
    save(items) { store.set("offgrid_cart", items); Cart.render(); },
    add(id, size, qty = 1) {
      const items = Cart.items();
      const hit = items.find(i => i.id === id && i.size === size);
      if (hit) hit.qty = Math.min(hit.qty + qty, 10); else items.push({ id, size, qty });
      Cart.save(items);
      const b = $(".cart-count"); if (b) { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
    },
    setQty(idx, qty) { const items = Cart.items(); if (!items[idx]) return; if (qty < 1) items.splice(idx, 1); else items[idx].qty = Math.min(qty, 10); Cart.save(items); },
    remove(idx) { const items = Cart.items(); items.splice(idx, 1); Cart.save(items); },
    clear() { Cart.save([]); },
    count() { return Cart.items().reduce((n, i) => n + i.qty, 0); },
    subtotal() { return Cart.items().reduce((n, i) => n + byId(i.id).price * i.qty, 0); },
    delivery() { return deliveryFee(Cart.subtotal()); },
    total() { return Cart.subtotal() + Cart.delivery(); },
    freeBarHTML() {
      const sub = Cart.subtotal(), left = C.delivery.freeFrom - sub, pct = Math.min(100, sub / C.delivery.freeFrom * 100);
      return `<div class="freebar"><span class="mono">${left > 0 ? t("bag.freeleft", { x: money(left) }) : t("bag.freeok")}</span><span class="freebar-track"><span style="width:${pct}%"></span></span></div>`;
    },
    totalsHTML() {
      const d = Cart.delivery();
      return `<div class="row-between"><span class="mono">${t("bag.subtotal")}</span><span>${money(Cart.subtotal())}</span></div>
        <div class="row-between"><span class="mono">${t("bag.delivery")}</span><span>${d ? money(d) : t("bag.free")}</span></div>
        <div class="row-between total"><span class="mono">${t("bag.total")}</span><b>${money(Cart.total())}</b></div>`;
    },
    linesHTML(compact) {
      return Cart.items().map((it, idx) => {
        const p = byId(it.id);
        return `<div class="line">
          <a href="/product.html?id=${p.id}" tabindex="-1"><img src="${img(p.card)}" alt="${esc(p.name)}"></a>
          <div class="line-info">
            <div class="line-top"><a href="/product.html?id=${p.id}">${esc(p.name)}</a><span class="price">${money(p.price * it.qty)}</span></div>
            <span class="mono" style="opacity:.75">${esc(L(p.color))} · ${t("bag.size")} ${it.size}${compact ? " · ×" + it.qty : ""}</span>
            <div class="line-bottom">
              ${compact ? "" : `<div class="qty" role="group" aria-label="${t("pdp.qty")}">
                <button type="button" data-q="${idx}" data-d="-1" aria-label="−">−</button><span>${it.qty}</span>
                <button type="button" data-q="${idx}" data-d="1" aria-label="+">+</button></div>`}
              <button type="button" class="remove" data-rm="${idx}">${t("bag.remove")}</button>
            </div>
          </div></div>`;
      }).join("");
    },
    render() {
      const n = Cart.count();
      $$(".cart-count").forEach(b => { b.textContent = n; b.classList.toggle("on", n > 0); });
      const body = $("#drawer-body"), foot = $("#drawer-foot");
      if (body) {
        if (!n) {
          body.innerHTML = `<div class="empty"><span style="width:44px;height:44px;color:var(--navy)">${I.star}</span>
            <p class="display h-md">${t("bag.empty")}</p><p style="margin:0;color:var(--muted)">${t("bag.emptysub")}</p>
            <a class="btn btn-dark" href="/shop.html">${t("bag.shop")} ${I.arrow}</a></div>`;
          foot.hidden = true;
        } else {
          body.innerHTML = Cart.freeBarHTML() + Cart.linesHTML(false);
          foot.hidden = false;
          $("#drawer-totals").innerHTML = Cart.totalsHTML();
        }
      }
      document.dispatchEvent(new CustomEvent("cart:change"));
    }
  };

  /* ---------- countdown ---------- */
  const dropAt = new Date(C.nextDrop).getTime();
  function cdParts() {
    const ms = dropAt - Date.now(); if (ms <= 0) return null;
    const s = Math.floor(ms / 1000);
    return { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 };
  }
  const pad = n => String(n).padStart(2, "0");
  function tickCountdowns() {
    const p = cdParts();
    $$("[data-cd-inline]").forEach(el => {
      el.innerHTML = p ? `${t("announce.drop")} · <b>${p.d}${t("cd.d")} ${pad(p.h)}${t("cd.h")} ${pad(p.m)}${t("cd.m")} ${pad(p.s)}${t("cd.s")}</b>` : t("announce.live");
    });
    $$("[data-cd-big]").forEach(el => {
      if (!p) { el.innerHTML = `<div class="cd-live display">${t("announce.live")}</div>`; return; }
      el.innerHTML = ["d", "h", "m", "s"].map(k => `<div class="cd-unit"><b>${pad(p[k])}</b><span class="mono">${t("cd." + k)}</span></div>`).join("");
    });
  }

  /* ---------- layout ---------- */
  const page = (location.pathname.split("/").pop() || "index").replace(".html", "") || "index";
  const links = [["shop", "nav.shop"], ["lookbook", "nav.lookbook"], ["reviews", "nav.reviews"], ["contact", "nav.contact"]];
  const langSwitch = cls => `<div class="lang ${cls || ""}" role="group" aria-label="Language">${LANGS.map(([k, l]) => `<button type="button" data-lang="${k}" aria-pressed="${k === lang}" lang="${k}">${l}</button>`).join("")}</div>`;
  const newsForm = id => `<form class="news-form" data-news novalidate>
      <label class="sr-only" for="${id}">${t("news.email")}</label>
      <input id="${id}" type="email" name="email" inputmode="email" autocomplete="email" placeholder="${t("news.email")}" required>
      <button class="btn btn-light" type="submit">${t("news.join")}</button>
      <p class="news-msg mono" role="status"></p></form>`;

  function layout() {
    const navHTML = links.map(([h, k]) => `<a href="/${h}.html"${page === h ? ' aria-current="page"' : ""}>${t(k)}</a>`).join("");
    document.body.insertAdjacentHTML("afterbegin", `
      <a href="#main" class="sr-only">${t("a11y.skip")}</a>
      <div class="announce"><span data-cd-inline></span><span aria-hidden="true">✦</span><span>${t("announce.cod")}</span><span aria-hidden="true">✦</span><span>${t("announce.ship")}</span></div>
      <header class="header${document.body.dataset.solid ? " solid" : ""}" id="header">
        <div class="container header-in">
          <a class="logo" href="/index.html" aria-label="OFFGRID"><span class="logo-mark" role="img" aria-label="OFFGRID Streetwear"></span></a>
          <nav class="nav" aria-label="Main">${navHTML}</nav>
          <div class="header-actions">
            ${langSwitch("lang-desktop")}
            <a class="icon-btn hide-sm" href="${igUrl}" target="_blank" rel="noopener" aria-label="Instagram">${I.ig}</a>
            <button class="icon-btn" type="button" data-open-cart aria-label="${t("a11y.bag")}">${I.bag}<span class="cart-count">0</span></button>
            <button class="icon-btn menu-btn" type="button" id="menu-open" aria-label="${t("a11y.menu")}">${I.menu}</button>
          </div>
        </div>
      </header>
      <div class="mnav" id="mnav" aria-hidden="true">
        <div class="mnav-top"><span class="logo-mark" role="img" aria-label="OFFGRID" style="height:38px;color:var(--paper)"></span>
          <button class="icon-btn" type="button" id="menu-close" aria-label="${t("a11y.close")}" style="color:var(--paper)">${I.close}</button></div>
        <nav aria-label="Mobile"><a href="/index.html">${t("nav.home")}</a>${links.map(([h, k]) => `<a href="/${h}.html">${t(k)}</a>`).join("")}<a href="/about.html">${t("nav.story")}</a></nav>
        <div class="mnav-foot">${langSwitch("lang-light")}
          <div class="social-row"><a class="icon-btn" href="${igUrl}" target="_blank" rel="noopener" aria-label="Instagram">${I.ig}</a><a class="icon-btn" href="${ttUrl}" target="_blank" rel="noopener" aria-label="TikTok">${I.tt}</a><a class="icon-btn" href="${waUrl()}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.wa}</a></div></div>
      </div>`);
    document.body.insertAdjacentHTML("beforeend", `
      <footer class="footer">
        <div class="container">
          <div class="footer-news">
            <div><h2 class="display" style="font-size:clamp(30px,3.6vw,48px)">${t("home.news.title")}</h2><p style="margin:10px 0 0;opacity:.8">${t("home.news.lede")}</p></div>
            ${newsForm("news-footer")}
          </div>
          <div class="footer-top">
            <div style="display:flex;flex-direction:column;gap:18px;max-width:360px">
              <span class="logo-mark" role="img" aria-label="OFFGRID Streetwear" style="height:94px;color:var(--paper)"></span>
              <p class="mono" style="opacity:.75;margin:0;line-height:1.8">${t("footer.tag")}</p>
            </div>
            <div class="footer-cols">
              <div><span class="mono">${t("footer.shop")}</span>${P.map(p => `<a href="/product.html?id=${p.id}">${esc(p.name)}</a>`).join("")}<a href="/shop.html">${t("footer.all")}</a></div>
              <div><span class="mono">${t("footer.brand")}</span><a href="/about.html">${t("nav.story")}</a><a href="/lookbook.html">${t("nav.lookbook")}</a><a href="/reviews.html">${t("nav.reviews")}</a><a href="/contact.html">${t("nav.contact")} & FAQ</a></div>
              <div><span class="mono">${t("footer.follow")}</span><a href="${igUrl}" target="_blank" rel="noopener">Instagram</a><a href="${ttUrl}" target="_blank" rel="noopener">TikTok</a><a href="${waUrl()}" target="_blank" rel="noopener">WhatsApp</a></div>
            </div>
          </div>
          <div class="footer-word" aria-hidden="true">OFFGRID</div>
          <div class="footer-bottom mono"><span>© ${new Date().getFullYear()} ${esc(C.legalName)} · ${esc(C.city)}</span>${langSwitch("lang-light")}<span style="display:flex;gap:10px;align-items:center"><span style="width:16px;height:16px;display:inline-flex">${I.globe}</span>Maroc</span></div>
        </div>
      </footer>
      <a class="wa-float" href="${waUrl()}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.wa}</a>
      <div class="overlay" id="overlay"></div>
      <aside class="drawer" id="drawer" aria-label="${t("bag.title")}" aria-hidden="true">
        <div class="drawer-head"><span class="display" style="font-size:28px">${t("bag.title")}</span>
          <button class="icon-btn" type="button" data-close-cart aria-label="${t("a11y.close")}">${I.close}</button></div>
        <div class="drawer-body" id="drawer-body"></div>
        <div class="drawer-foot" id="drawer-foot" hidden>
          <div id="drawer-totals" class="totals"></div>
          <a class="btn btn-dark btn-block" href="/checkout.html">${t("bag.checkout")} ${I.arrow}</a>
          <button class="btn btn-outline btn-block" type="button" data-close-cart>${t("bag.keep")}</button>
        </div>
      </aside>
      <div class="toast" id="toast" role="status" aria-live="polite"><span id="toast-msg"></span><button type="button" data-open-cart>${t("toast.view")}</button></div>
      <div class="lightbox" id="lightbox" aria-hidden="true">
        <img id="lb-img" alt="">
        <button class="icon-btn lb-close" type="button" aria-label="${t("a11y.close")}">${I.close}</button>
        <button class="icon-btn lb-prev" type="button" aria-label="←">${I.left}</button>
        <button class="icon-btn lb-next" type="button" aria-label="→">${I.right}</button>
      </div>`);

    const h = $("#header");
    const onScroll = () => h.classList.toggle("scrolled", scrollY > 10);
    onScroll(); addEventListener("scroll", onScroll, { passive: true });

    const mnav = $("#mnav");
    $("#menu-open").onclick = () => { mnav.classList.add("open"); mnav.setAttribute("aria-hidden", "false"); };
    $("#menu-close").onclick = () => { mnav.classList.remove("open"); mnav.setAttribute("aria-hidden", "true"); };

    document.addEventListener("click", e => {
      const lb = e.target.closest("[data-lang]"); if (lb) { if (lb.dataset.lang !== lang) setLang(lb.dataset.lang); return; }
      if (e.target.closest("[data-open-cart]")) { e.preventDefault(); openCart(); }
      if (e.target.closest("[data-close-cart]") || e.target.id === "overlay") closeCart();
      const q = e.target.closest("[data-q]"); if (q) { const i = +q.dataset.q; Cart.setQty(i, Cart.items()[i].qty + +q.dataset.d); }
      const rm = e.target.closest("[data-rm]"); if (rm) Cart.remove(+rm.dataset.rm);
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape") { closeCart(); Lightbox.close(); $$(".modal.on").forEach(m => m.classList.remove("on")); } });

    // newsletter forms (footer + any [data-news] on page)
    document.addEventListener("submit", async e => {
      const f = e.target.closest("[data-news]"); if (!f) return;
      e.preventDefault();
      const input = f.querySelector("input[type=email]"), msg = f.querySelector(".news-msg"), btn = f.querySelector("button");
      const email = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { msg.textContent = t("news.err"); msg.className = "news-msg mono bad"; input.focus(); return; }
      btn.disabled = true;
      try {
        const r = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, lang, source: page }) });
        if (!r.ok) throw 0;
        msg.textContent = t("news.ok"); msg.className = "news-msg mono ok"; input.value = ""; store.set("offgrid_subscribed", true);
      } catch (_) { msg.textContent = t("rev.err"); msg.className = "news-msg mono bad"; }
      btn.disabled = false;
    });
  }
  function openCart() { $("#drawer").classList.add("open"); $("#drawer").setAttribute("aria-hidden", "false"); $("#overlay").classList.add("on"); $("#toast").classList.remove("on"); }
  function closeCart() { const d = $("#drawer"); if (!d) return; d.classList.remove("open"); d.setAttribute("aria-hidden", "true"); $("#overlay").classList.remove("on"); }

  let toastT;
  function toast(msg, showBag = true) {
    const tt = $("#toast"); $("#toast-msg").textContent = msg;
    tt.querySelector("button").hidden = !showBag;
    tt.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => tt.classList.remove("on"), 3200);
  }

  /* ---------- lightbox ---------- */
  const Lightbox = {
    list: [], i: 0,
    open(list, i) {
      Lightbox.list = list; Lightbox.i = i; Lightbox.show();
      const lb = $("#lightbox"); lb.classList.add("on"); lb.setAttribute("aria-hidden", "false");
      $$(".lb-prev,.lb-next", lb).forEach(b => b.hidden = list.length < 2);
    },
    show() { $("#lb-img").src = Lightbox.list[Lightbox.i]; },
    step(d) { Lightbox.i = (Lightbox.i + d + Lightbox.list.length) % Lightbox.list.length; Lightbox.show(); },
    close() { const lb = $("#lightbox"); if (lb) { lb.classList.remove("on"); lb.setAttribute("aria-hidden", "true"); } },
    bind() {
      const lb = $("#lightbox");
      $(".lb-close", lb).onclick = Lightbox.close;
      $(".lb-prev", lb).onclick = () => Lightbox.step(-1);
      $(".lb-next", lb).onclick = () => Lightbox.step(1);
      lb.addEventListener("click", e => { if (e.target === lb) Lightbox.close(); });
      document.addEventListener("keydown", e => { if (!lb.classList.contains("on")) return; if (e.key === "ArrowLeft") Lightbox.step(-1); if (e.key === "ArrowRight") Lightbox.step(1); });
      let x0 = null;
      lb.addEventListener("touchstart", e => x0 = e.touches[0].clientX, { passive: true });
      lb.addEventListener("touchend", e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) Lightbox.step(dx < 0 ? 1 : -1); x0 = null; });
    }
  };

  /* ---------- product card ---------- */
  function cardHTML(p) {
    return `<article class="card reveal" data-color="${p.color.key}">
      <div class="card-media">
        <a href="/product.html?id=${p.id}" aria-label="${esc(p.name)}"></a>
        <img src="${img(p.card)}" alt="${esc(p.name)}" loading="lazy">
        ${p.photos ? `<img class="img-hover" src="${img(p.hover)}" alt="" loading="lazy">` : ""}
        <span class="badge">${p.photos ? t("price.save") : t("card.soon")}</span>
        <div class="quick"><p class="mono">${t("card.quick")}</p><div class="quick-sizes">
          ${C.sizes.map(s => `<button type="button" data-quick="${p.id}" data-size="${s}" aria-label="${esc(p.name)} ${s}">${s}</button>`).join("")}
        </div></div>
      </div>
      <div class="card-info">
        <a href="/product.html?id=${p.id}"><div class="card-title">${esc(p.name)}</div><div class="card-sub mono">Hoodie · ${esc(L(p.color))}</div></a>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">${priceHTML(p)}
          <span class="swatch" style="background:${p.color.hex}" title="${esc(L(p.color))}"></span></div>
      </div></article>`;
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-quick]"); if (!b) return;
    const p = byId(b.dataset.quick); Cart.add(p.id, b.dataset.size, 1);
    toast(`${p.name} · ${b.dataset.size} — ${t("toast.added")}`);
  });

  /* ---------- reveal on scroll ---------- */
  function reveal() {
    const els = $$(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: .12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(e => io.observe(e));
  }

  /* ---------- order message ---------- */
  function orderText(o) {
    const lines = o.items.map(it => { const p = byId(it.id); return `• ${p.name} — ${L(p.color)} — ${t("order.size")} ${it.size} × ${it.qty} = ${money(p.price * it.qty)}`; });
    return [`${t("order.hello")} ${o.ref}`, "", ...lines, "",
      `${t("order.subtotal")}: ${money(o.subtotal)}`, `${t("order.delivery")}: ${o.delivery ? money(o.delivery) : t("bag.free")}`, `${t("order.total")}: ${money(o.total)}`, t("order.payment"), "",
      `${t("order.name")}: ${o.name}`, `${t("order.phone")}: ${o.phone}`, `${t("order.city")}: ${o.city}`, `${t("order.address")}: ${o.address}`, o.note ? `${t("order.note")}: ${o.note}` : ""]
      .filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n").trim();
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (e) { const ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand("copy"); } catch (_) {} ta.remove(); return ok; }
  }

  function reviewHTML(r) {
    const p = byId(r.product);
    return `<article class="review reveal in">${stars(r.rating)}<p dir="auto">${esc(r.text)}</p>
      <div class="review-foot"><b>${esc(r.name)}</b><span class="mono">${p ? esc(p.name) + " · " : ""}${t("rev.verified")}</span></div></article>`;
  }

  window.OG = { reviewHTML, C, P, $, $$, esc, money, byId, img, I, L, t, lang, Cart, toast, Lightbox, cardHTML, priceHTML, stars, reveal, openCart, store, orderText, copy, igUrl, igDm, ttUrl, waUrl, newsForm, applyI18n };

  document.addEventListener("DOMContentLoaded", () => {
    applyI18n();
    layout(); Lightbox.bind(); Cart.render();
    tickCountdowns(); setInterval(tickCountdowns, 1000);
    document.dispatchEvent(new CustomEvent("og:ready"));
    reveal();
  });
})();
