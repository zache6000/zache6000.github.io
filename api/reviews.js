import { saveJSON, body, clean, cleanText, newId, readJSON, listAll, writeReviewsSnapshot, REVIEWS_SNAPSHOT, throttled } from "./_store.js";

const PRODUCTS = ["new-future", "radio-dreams", "static-frequency", "lost-souls"];
let mem = null; // { t, reviews }

async function approvedReviews() {
  if (mem && Date.now() - mem.t < 120000) return mem.reviews;
  const snap = await readJSON(REVIEWS_SNAPSHOT);
  let reviews;
  if (snap && Array.isArray(snap.data.reviews)) reviews = snap.data.reviews;
  else reviews = await writeReviewsSnapshot((await listAll()).approved); // first run only
  mem = { t: Date.now(), reviews };
  return reviews;
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const reviews = await approvedReviews();
      res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=86400");
      return res.status(200).json({ reviews });
    }
    if (req.method === "POST") {
      const b = body(req);
      if (b.website) return res.status(200).json({ ok: true }); // honeypot
      if (throttled(req, 4, "review")) return res.status(429).json({ error: "Too many" });
      const name = clean(b.name, 40), text = cleanText(b.text, 600);
      const rating = Math.max(1, Math.min(5, parseInt(b.rating, 10) || 5));
      const product = PRODUCTS.includes(b.product) ? b.product : "";
      if (name.length < 2 || text.length < 5) return res.status(400).json({ error: "Invalid" });
      const id = newId();
      await saveJSON(`reviews/pending/${id}.json`, { id, name, product, rating, text, lang: ["fr", "en", "ar"].includes(b.lang) ? b.lang : "fr", at: new Date().toISOString() });
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed" });
  }
}
