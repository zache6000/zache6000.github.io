import { listJSON, saveJSON, body, clean } from "./_store.js";

const PRODUCTS = ["new-future", "radio-dreams", "static-frequency", "lost-souls"];

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const all = await listJSON("reviews/approved/");
      const reviews = all.map(({ id, name, product, rating, text, at, lang }) => ({ id, name, product, rating, text, at, lang }));
      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
      return res.status(200).json({ reviews });
    }
    if (req.method === "POST") {
      const b = body(req);
      if (b.website) return res.status(200).json({ ok: true }); // honeypot
      const name = clean(b.name, 40), text = clean(b.text, 600);
      const rating = Math.max(1, Math.min(5, parseInt(b.rating, 10) || 5));
      const product = PRODUCTS.includes(b.product) ? b.product : "";
      if (name.length < 2 || text.length < 5) return res.status(400).json({ error: "Invalid" });
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      await saveJSON(`reviews/pending/${id}.json`, { id, name, product, rating, text, lang: ["fr", "en", "ar"].includes(b.lang) ? b.lang : "fr", at: new Date().toISOString() });
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed" });
  }
}
