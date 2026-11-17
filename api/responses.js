import { list } from "@vercel/blob";

// Private reader for the person building the site: /api/responses?key=ADMIN_KEY
export default async function handler(req, res) {
  const key = (req.query && req.query.key) || "";
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) return res.status(401).json({ error: "Unauthorized" });
  try {
    const blobs = [];
    let cursor;
    do {
      const page = await list({ prefix: "responses/", cursor, limit: 1000 });
      blobs.push(...page.blobs);
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    const latest = {};
    for (const b of blobs) {
      const id = b.pathname.split("/")[1];
      if (!latest[id]) latest[id] = b;
    }
    const out = [];
    for (const b of Object.values(latest)) {
      const r = await fetch(b.url, { cache: "no-store" });
      out.push(await r.json());
    }
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ count: out.length, versions: blobs.length, responses: out });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Read failed" });
  }
}
