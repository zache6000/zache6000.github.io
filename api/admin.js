import { listJSON, saveJSON, del, body } from "./_store.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST" && req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const b = req.method === "GET" ? { key: req.query.key, action: "list" } : body(req);
  if (!process.env.ADMIN_KEY || b.key !== process.env.ADMIN_KEY) return res.status(401).json({ error: "Unauthorized" });
  const id = String(b.id || "").replace(/[^a-z0-9]/g, "");
  try {
    if (b.action === "list") {
      const strip = arr => arr.map(({ _url, _path, ...r }) => r);
      const [pending, approved, subscribers] = await Promise.all([listJSON("reviews/pending/"), listJSON("reviews/approved/"), listJSON("subscribers/")]);
      return res.status(200).json({ pending: strip(pending), approved: strip(approved), subscribers: strip(subscribers) });
    }
    if (b.action === "approve" && id) {
      const [r] = (await listJSON(`reviews/pending/${id}.json`));
      if (!r) return res.status(404).json({ error: "Not found" });
      const { _url, _path, ...rec } = r;
      await saveJSON(`reviews/approved/${id}.json`, { ...rec, approvedAt: new Date().toISOString() });
      await del(_url);
      return res.status(200).json({ ok: true });
    }
    if (b.action === "delete" && id) {
      const from = b.from === "approved" ? "approved" : "pending";
      const [r] = await listJSON(`reviews/${from}/${id}.json`);
      if (r) await del(r._url);
      return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ error: "Bad action" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed" });
  }
}
