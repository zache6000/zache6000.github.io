import { saveJSON, body, clean, cleanText, throttled } from "./_store.js";

const PRODUCTS = ["new-future", "radio-dreams", "static-frequency", "lost-souls"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const num = (v, max) => { const n = Math.round(Number(v)); return Number.isFinite(n) && n >= 0 ? Math.min(n, max) : 0; };

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const b = body(req);
    if (throttled(req, 6, "order")) return res.status(429).json({ error: "Too many" });
    const items = (Array.isArray(b.items) ? b.items : []).slice(0, 20)
      .map(i => ({ id: String(i.id), name: clean(i.name, 40), size: String(i.size).toUpperCase(), qty: num(i.qty, 10), price: num(i.price, 5000) }))
      .filter(i => PRODUCTS.includes(i.id) && SIZES.includes(i.size) && i.qty > 0);
    const name = clean(b.name, 60), phone = clean(b.phone, 30).replace(/[^\d+ ]/g, ""), city = clean(b.city, 60), address = clean(b.address, 200);
    if (!items.length || name.length < 2 || phone.replace(/\D/g, "").length < 9 || city.length < 2 || address.length < 4) return res.status(400).json({ error: "Invalid" });
    let ref = String(b.ref || "");
    if (!/^OG-\d{6}-[A-Z0-9]{4}$/.test(ref)) ref = "OG-" + new Date().toISOString().slice(2, 10).replace(/-/g, "") + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    const order = {
      ref, items,
      subtotal: num(b.subtotal, 100000), discount: num(b.discount, 100000), delivery: num(b.delivery, 1000), total: num(b.total, 100000),
      name, phone, city, address, note: cleanText(b.note, 400),
      lang: ["fr", "en", "ar"].includes(b.lang) ? b.lang : "fr",
      consentAt: b.consent === true ? new Date().toISOString() : null,
      at: new Date().toISOString()
    };
    await saveJSON(`orders/${ref}.json`, order, { random: true });
    return res.status(200).json({ ok: true, ref });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed" });
  }
}
