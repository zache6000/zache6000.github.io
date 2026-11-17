/* OFFGRID — shared site logic: layout, cart, drawer, toast, lightbox */
(function () {
  const C = window.OFFGRID_CONFIG, P = window.OFFGRID_PRODUCTS;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = n => n.toLocaleString("fr-MA") + " " + C.currency;
  const byId = id => P.find(p => p.id === id);
  const igUrl = "https://www.instagram.com/" + C.instagram + "/";
  const igDm = "https://ig.me/m/" + C.instagram;

  const I = {
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M20 12a8 8 0 0 1-11.8 7L4 20l1.1-4A8 8 0 1 1 20 12z"/><path d="M9 9.5c.3 2 2.2 4.2 4.5 4.8l1.2-1.2 1.8.8c-.2 1.2-1.2 1.8-2.2 1.8C11 15.7 8.3 13 8.3 9.8c0-1 .6-2 1.8-2.2l.8 1.8z"/></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" fill="currentColor"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4.5" ry="10"/><path d="M2 12h20M4 7h16M4 17h16"/></svg>',
    cotton: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M7 18a4 4 0 0 1-.6-7.95A5 5 0 0 1 16 8.5a3.5 3.5 0 0 1 1 6.86"/><path d="M12 12v9"/></svg>',
    fit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C12.7 8 16 11.3 22 12C16 12.7 12.7 16 12 22C11.3 16 8 12.7 2 12C8 11.3 11.3 8 12 2Z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    gem: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 3h12l4 6-10 12L2 9l4-6z"/><path d="M2 9h20M9 3l3 18M15 3l-3 18"/></svg>'
  };

  /* ---------- storage ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- cart ---------- */
  const Cart = {
    items() { return store.get("offgrid_cart", []).filter(i => byId(i.id)); },
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
    total() { return Cart.items().reduce((n, i) => n + byId(i.id).price * i.qty, 0); },
    linesHTML(compact) {
      return Cart.items().map((it, idx) => {
        const p = byId(it.id);
        return `<div class="line">
          <a href="/product.html?id=${p.id}" tabindex="-1"><img src="${p.card}" alt="${esc(p.name)}"></a>
          <div class="line-info">
            <div class="line-top"><a href="/product.html?id=${p.id}">${esc(p.name)}</a><span class="price">${money(p.price * it.qty)}</span></div>
            <span class="mono" style="opacity:.75">${esc(p.color.name)} · Size ${it.size}${compact ? " · ×" + it.qty : ""}</span>
            <div class="line-bottom">
              ${compact ? "" : `<div class="qty" role="group" aria-label="Quantity">
                <button type="button" data-q="${idx}" data-d="-1" aria-label="Decrease quantity">−</button><span>${it.qty}</span>
                <button type="button" data-q="${idx}" data-d="1" aria-label="Increase quantity">+</button></div>`}
              <button type="button" class="remove" data-rm="${idx}">Remove</button>
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
            <p class="display h-md">Your bag is empty</p><p style="margin:0;color:var(--muted)">The drop won't wait forever.</p>
            <a class="btn btn-dark" href="/shop.html">Shop the drop ${I.arrow}</a></div>`;
          foot.hidden = true;
        } else {
          body.innerHTML = Cart.linesHTML(false);
          foot.hidden = false;
          $("#drawer-total").textContent = money(Cart.total());
        }
      }
      document.dispatchEvent(new CustomEvent("cart:change"));
    }
  };

  /* ---------- layout ---------- */
  const page = (location.pathname.split("/").pop() || "index").replace(".html", "") || "index";
  const links = [["shop", "Shop"], ["lookbook", "Lookbook"], ["about", "Story"], ["contact", "Contact"]];
  function layout() {
    const navHTML = links.map(([h, l]) => `<a href="/${h}.html"${page === h ? ' aria-current="page"' : ""}>${l}</a>`).join("");
    document.body.insertAdjacentHTML("afterbegin", `
      <a href="#main" class="sr-only">Skip to content</a>
      <div class="announce"><span>Drop 02 — now live</span><span aria-hidden="true">✦</span><span>Limited pieces</span><span aria-hidden="true">✦</span><span>Morocco</span></div>
      <header class="header${document.body.dataset.solid ? " solid" : ""}" id="header">
        <div class="container header-in">
          <a class="logo" href="/index.html" aria-label="OFFGRID Streetwear home"><span class="logo-mark" role="img" aria-label="OFFGRID Streetwear"></span></a>
          <nav class="nav" aria-label="Main">${navHTML}</nav>
          <div class="header-actions">
            <a class="icon-btn" href="${igUrl}" target="_blank" rel="noopener" aria-label="OFFGRID on Instagram">${I.ig}</a>
            <button class="icon-btn" type="button" data-open-cart aria-label="Open bag">${I.bag}<span class="cart-count">0</span></button>
            <button class="icon-btn menu-btn" type="button" id="menu-open" aria-label="Open menu">${I.menu}</button>
          </div>
        </div>
      </header>
      <div class="mnav" id="mnav" aria-hidden="true">
        <div class="mnav-top"><span class="logo-mark" role="img" aria-label="OFFGRID" style="height:38px;color:var(--paper)"></span>
          <button class="icon-btn" type="button" id="menu-close" aria-label="Close menu" style="color:var(--paper)">${I.close}</button></div>
        <nav aria-label="Mobile"><a href="/index.html">Home</a>${links.map(([h, l]) => `<a href="/${h}.html">${l}</a>`).join("")}</nav>
        <a class="mono" href="${igUrl}" target="_blank" rel="noopener">@${C.instagram}</a>
      </div>`);
    document.body.insertAdjacentHTML("beforeend", `
      <footer class="footer">
        <div class="container">
          <div class="footer-top">
            <div style="display:flex;flex-direction:column;gap:18px;max-width:360px">
              <span class="logo-mark" role="img" aria-label="OFFGRID Streetwear" style="height:94px;color:var(--paper)"></span>
              <p class="mono" style="opacity:.75;margin:0;line-height:1.8">Your streetwear brand.<br>More than just clothing.</p>
            </div>
            <div class="footer-cols">
              <div><span class="mono">Shop</span>${P.map(p => `<a href="/product.html?id=${p.id}">${esc(p.short)}</a>`).join("")}<a href="/shop.html">All products</a></div>
              <div><span class="mono">Brand</span><a href="/about.html">Our story</a><a href="/lookbook.html">Lookbook</a><a href="/contact.html">Contact & FAQ</a></div>
              <div><span class="mono">Follow</span><a href="${igUrl}" target="_blank" rel="noopener">Instagram</a>${C.whatsapp ? `<a href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>` : ""}${C.email ? `<a href="mailto:${C.email}">${esc(C.email)}</a>` : ""}</div>
            </div>
          </div>
          <div class="footer-word" aria-hidden="true">OFFGRID</div>
          <div class="footer-bottom mono"><span>© ${new Date().getFullYear()} OFFGRID Streetwear</span><span style="display:flex;gap:10px;align-items:center"><span style="width:16px;height:16px;display:inline-flex">${I.globe}</span>Morocco</span></div>
        </div>
      </footer>
      <div class="overlay" id="overlay"></div>
      <aside class="drawer" id="drawer" aria-label="Shopping bag" aria-hidden="true">
        <div class="drawer-head"><span class="display" style="font-size:28px">Your bag</span>
          <button class="icon-btn" type="button" data-close-cart aria-label="Close bag">${I.close}</button></div>
        <div class="drawer-body" id="drawer-body"></div>
        <div class="drawer-foot" id="drawer-foot" hidden>
          <div class="row-between total"><span class="mono">Subtotal</span><b id="drawer-total"></b></div>
          <p style="margin:0;font-size:14px;color:var(--muted)">Delivery fee and payment are confirmed with you when you send your order.</p>
          <a class="btn btn-dark btn-block" href="/checkout.html">Checkout ${I.arrow}</a>
          <button class="btn btn-outline btn-block" type="button" data-close-cart>Keep shopping</button>
        </div>
      </aside>
      <div class="toast" id="toast" role="status" aria-live="polite"><span id="toast-msg"></span><button type="button" data-open-cart>View bag</button></div>
      <div class="lightbox" id="lightbox" aria-hidden="true">
        <img id="lb-img" alt="">
        <button class="icon-btn lb-close" type="button" aria-label="Close">${I.close}</button>
        <button class="icon-btn lb-prev" type="button" aria-label="Previous image">${I.left}</button>
        <button class="icon-btn lb-next" type="button" aria-label="Next image">${I.right}</button>
      </div>`);

    // header scroll state
    const h = $("#header");
    const onScroll = () => h.classList.toggle("scrolled", scrollY > 10);
    onScroll(); addEventListener("scroll", onScroll, { passive: true });

    // mobile menu
    const mnav = $("#mnav");
    $("#menu-open").onclick = () => { mnav.classList.add("open"); mnav.setAttribute("aria-hidden", "false"); };
    $("#menu-close").onclick = () => { mnav.classList.remove("open"); mnav.setAttribute("aria-hidden", "true"); };

    // drawer
    document.addEventListener("click", e => {
      if (e.target.closest("[data-open-cart]")) { e.preventDefault(); openCart(); }
      if (e.target.closest("[data-close-cart]") || e.target.id === "overlay") closeCart();
      const q = e.target.closest("[data-q]"); if (q) { const i = +q.dataset.q; Cart.setQty(i, Cart.items()[i].qty + +q.dataset.d); }
      const rm = e.target.closest("[data-rm]"); if (rm) Cart.remove(+rm.dataset.rm);
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape") { closeCart(); Lightbox.close(); $$(".modal.on").forEach(m => m.classList.remove("on")); } });
  }
  function openCart() { $("#drawer").classList.add("open"); $("#drawer").setAttribute("aria-hidden", "false"); $("#overlay").classList.add("on"); $("#toast").classList.remove("on"); }
  function closeCart() { const d = $("#drawer"); if (!d) return; d.classList.remove("open"); d.setAttribute("aria-hidden", "true"); $("#overlay").classList.remove("on"); }

  let toastT;
  function toast(msg, showBag = true) {
    const t = $("#toast"); $("#toast-msg").textContent = msg;
    t.querySelector("button").hidden = !showBag;
    t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 3200);
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
        <img src="${p.card}" alt="${esc(p.name)} — front" loading="lazy">
        <img class="img-hover" src="${p.hover}" alt="" loading="lazy">
        <span class="badge">${esc(p.badge)}</span>
        <div class="quick"><p class="mono">Quick add</p><div class="quick-sizes">
          ${C.sizes.map(s => `<button type="button" data-quick="${p.id}" data-size="${s}" aria-label="Add ${esc(p.name)} size ${s} to bag">${s}</button>`).join("")}
        </div></div>
      </div>
      <div class="card-info">
        <a href="/product.html?id=${p.id}"><div class="card-title">${esc(p.short)}</div><div class="card-sub mono">${esc(p.tagline)}</div></a>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px"><span class="price">${money(p.price)}</span>
          <span class="swatch" style="background:${p.color.hex}" title="${esc(p.color.name)}"></span></div>
      </div></article>`;
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-quick]"); if (!b) return;
    const p = byId(b.dataset.quick); Cart.add(p.id, b.dataset.size, 1);
    toast(`${p.short} — size ${b.dataset.size} added`);
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
    const lines = o.items.map(it => { const p = byId(it.id); return `• ${p.name} — ${p.color.name} — Size ${it.size} × ${it.qty} = ${money(p.price * it.qty)}`; });
    return [`Hello ${C.brand}! New order ${o.ref}`, "", ...lines, "", `Subtotal: ${money(o.total)}`, "",
      `Name: ${o.name}`, `Phone: ${o.phone}`, `City: ${o.city}`, `Address: ${o.address}`, o.note ? `Note: ${o.note}` : ""].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n").trim();
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (e) { const t = document.createElement("textarea"); t.value = text; t.style.position = "fixed"; t.style.opacity = "0"; document.body.appendChild(t); t.select(); let ok = false; try { ok = document.execCommand("copy"); } catch (_) {} t.remove(); return ok; }
  }

  window.OG = { C, P, $, $$, esc, money, byId, I, Cart, toast, Lightbox, cardHTML, reveal, openCart, store, orderText, copy, igUrl, igDm };

  document.addEventListener("DOMContentLoaded", () => {
    layout(); Lightbox.bind(); Cart.render();
    document.dispatchEvent(new CustomEvent("og:ready"));
    reveal();
  });
})();
