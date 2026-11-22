import { saveJSON, body, clean, cleanText, newId, throttled } from "./_store.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const b = body(req);
    if (b.website) return res.status(200).json({ ok: true }); // honeypot
    if (throttled(req, 4, "message")) return res.status(429).json({ error: "Too many" });
    const name = clean(b.name, 60), contact = clean(b.contact, 80), topic = clean(b.topic, 60), ref = clean(b.ref, 30), msg = cleanText(b.msg, 1500);
    if (name.length < 2 || contact.length < 3 || msg.length < 3) return res.status(400).json({ error: "Invalid" });
    const id = newId();
    await saveJSON(`messages/${id}.json`, { id, name, contact, topic, ref, msg, lang: ["fr", "en", "ar"].includes(b.lang) ? b.lang : "fr", at: new Date().toISOString() }, { random: true });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed" });
  }
}
