import { put } from "@vercel/blob";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "application/pdf"];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { id, field, name, type, data } = body || {};
    if (!data || !ALLOWED.includes(type)) return res.status(400).json({ error: "Unsupported file" });
    const buf = Buffer.from(String(data), "base64");
    if (buf.length > 3_800_000) return res.status(413).json({ error: "File too large" });
    const safeId = String(id || "anon").replace(/[^a-zA-Z0-9-]/g, "").slice(0, 40);
    const safeField = String(field || "file").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
    const safeName = String(name || "file").replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
    const blob = await put(`files/${safeId}/${safeField}/${safeName}`, buf, {
      access: "public",
      contentType: type,
      addRandomSuffix: true
    });
    return res.status(200).json({ ok: true, url: blob.url, name: safeName, field: safeField });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Upload failed" });
  }
}
