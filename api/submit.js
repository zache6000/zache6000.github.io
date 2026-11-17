import { put } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!body || typeof body !== "object" || !body.answers) return res.status(400).json({ error: "Missing answers" });
    const id = String(body.id || "").replace(/[^a-zA-Z0-9-]/g, "").slice(0, 40) || crypto.randomUUID();
    const record = {
      id,
      submittedAt: new Date().toISOString(),
      lang: body.lang === "en" ? "en" : "fr",
      answers: body.answers,
      files: Array.isArray(body.files) ? body.files.slice(0, 80) : []
    };
    const json = JSON.stringify(record, null, 2);
    if (json.length > 2_000_000) return res.status(413).json({ error: "Too large" });
    await put(`responses/${id}/${Date.now()}.json`, json, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: true
    });
    return res.status(200).json({ ok: true, id });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Save failed" });
  }
}
