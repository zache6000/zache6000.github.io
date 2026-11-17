import { list, del } from "@vercel/blob";

// Admin only: /api/clear?key=ADMIN_KEY deletes every saved response and uploaded file.
export default async function handler(req, res) {
  const key = (req.query && req.query.key) || "";
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) return res.status(401).json({ error: "Unauthorized" });
  try {
    let deleted = 0, cursor;
    do {
      const page = await list({ cursor, limit: 1000 });
      if (page.blobs.length) { await del(page.blobs.map(b => b.url)); deleted += page.blobs.length; }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ ok: true, deleted });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Clear failed" });
  }
}
