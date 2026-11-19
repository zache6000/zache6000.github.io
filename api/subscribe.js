import { createHash } from "node:crypto";
import { saveJSON, body, clean } from "./_store.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const b = body(req);
    const email = clean(b.email, 120).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return res.status(400).json({ error: "Invalid email" });
    const id = createHash("sha256").update(email).digest("hex").slice(0, 24);
    await saveJSON(`subscribers/${id}.json`, { email, lang: ["fr", "en", "ar"].includes(b.lang) ? b.lang : "fr", source: clean(b.source, 30), at: new Date().toISOString() });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed" });
  }
}
