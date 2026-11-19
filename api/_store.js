import { put, list, del } from "@vercel/blob";

export async function listJSON(prefix) {
  const blobs = [];
  let cursor;
  do {
    const page = await list({ prefix, cursor, limit: 1000 });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  const out = await Promise.all(blobs.map(async b => {
    try { const r = await fetch(b.url, { cache: "no-store" }); const j = await r.json(); return { ...j, _url: b.url, _path: b.pathname }; }
    catch (e) { return null; }
  }));
  return out.filter(Boolean).sort((a, b) => new Date(b.at) - new Date(a.at));
}

export const saveJSON = (path, obj) =>
  put(path, JSON.stringify(obj), { access: "public", contentType: "application/json", addRandomSuffix: false, allowOverwrite: true });

export { del };

export const body = req => (typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {});
export const clean = (s, n) => String(s || "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, n);
