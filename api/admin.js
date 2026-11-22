import { saveJSON, body, readJSON, removePath, listAll, bust, writeReviewsSnapshot, REVIEWS_SNAPSHOT } from "./_store.js";

const ORDER_STATUS = ["new", "confirmed", "shipped", "delivered", "cancelled"];
const MSG_STATUS = ["new", "done"];
const strip = arr => arr.map(({ _url, ...r }) => r);
const safeId = s => String(s || "").replace(/[^A-Za-z0-9-]/g, "").slice(0, 40);

async function statusDoc() {
  const s = await readJSON("db/status.json");
  return { orders: {}, messages: {}, ...(s ? s.data : {}) };
}
async function snapshotApproved(mutate) {
  const snap = await readJSON(REVIEWS_SNAPSHOT);
  let list = snap && Array.isArray(snap.data.reviews) ? snap.data.reviews : (await listAll(0)).approved;
  list = mutate(list);
  await writeReviewsSnapshot(list);
}

/* Visitor stats from Vercel Web Analytics (needs a VERCEL_ANALYTICS_TOKEN env var; otherwise the admin shows a link) */
async function visitStats() {
  const token = process.env.VERCEL_ANALYTICS_TOKEN, projectId = process.env.VERCEL_PROJECT_ID;
  if (!token || !projectId) return { ok: false, reason: "no-token" };
  const TZ = "Africa/Casablanca", dayKey = d => new Date(d).toLocaleDateString("en-CA", { timeZone: TZ });
  const until = new Date(), since = new Date(until - 13 * 864e5);
  const base = "https://api.vercel.com/v1/query/web-analytics/visits/aggregate";
  const q = (by, limit) => {
    const u = new URL(base);
    Object.entries({ projectId, teamId: process.env.VERCEL_TEAM_ID || "team_RYcef3obwozMj61o6jqITmy8", since: since.toISOString().slice(0, 10), until: until.toISOString(), by, ...(limit ? { limit } : {}) })
      .forEach(([k, v]) => u.searchParams.set(k, v));
    return fetch(u, { headers: { Authorization: "Bearer " + token } }).then(r => r.ok ? r.json() : Promise.reject(new Error("va " + r.status)));
  };
  const rowsOf = j => Array.isArray(j && j.data) ? j.data : [];
  const n = r => Number(r.visitors ?? r.devices ?? r.count ?? r.total ?? 0) || 0;
  const v = r => Number(r.pageviews ?? r.views ?? r.count ?? r.total ?? 0) || 0;
  const [days, refs, pages, countries, devices] = await Promise.allSettled([q("day"), q("referrerHostname", 8), q("requestPath", 8), q("country", 8), q("deviceType", 5)]);
  if (days.status !== "fulfilled") return { ok: false, reason: String(days.reason && days.reason.message || "error") };
  const map = {};
  rowsOf(days.value).forEach(r => { const k = dayKey(r.timestamp || r.day || r.date || r.key); map[k] = { visitors: n(r), views: v(r) }; });
  const out = Array.from({ length: 14 }, (_, i) => { const k = dayKey(new Date(since.getTime() + i * 864e5)); return { day: k, ...(map[k] || { visitors: 0, views: 0 }) }; });
  const top = (res, field) => res.status === "fulfilled" ? rowsOf(res.value).map(r => ({ k: String(r[field] ?? r.key ?? ""), n: n(r) })).filter(r => r.n).slice(0, 8) : [];
  return { ok: true, days: out, referrers: top(refs, "referrerHostname"), pages: top(pages, "requestPath"), countries: top(countries, "country"), devices: top(devices, "deviceType") };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST" && req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  let b;
  try { b = req.method === "GET" ? { key: req.query.key, action: "list" } : body(req); } catch (e) { return res.status(400).json({ error: "Bad JSON" }); }
  if (!process.env.ADMIN_KEY || b.key !== process.env.ADMIN_KEY) return res.status(401).json({ error: "Unauthorized" });
  const id = safeId(b.id);
  try {
    if (b.action === "list") {
      const d = await listAll(b.fresh ? 0 : 20000);
      return res.status(200).json({
        pending: strip(d.pending), approved: strip(d.approved), subscribers: strip(d.subscribers),
        orders: strip(d.orders), messages: strip(d.messages), status: d.status, at: new Date().toISOString()
      });
    }
    if (b.action === "visits") {
      try { return res.status(200).json(await visitStats()); } catch (e) { return res.status(200).json({ ok: false, reason: "error" }); }
    }
    if (b.action === "approve" && id) {
      const r = await readJSON(`reviews/pending/${id}.json`);
      if (!r) return res.status(404).json({ error: "Not found" });
      const rec = { ...r.data, approvedAt: new Date().toISOString() };
      await saveJSON(`reviews/approved/${id}.json`, rec);
      await removePath(`reviews/pending/${id}.json`);
      await snapshotApproved(list => [rec, ...list.filter(x => x.id !== id)]);
      bust(); return res.status(200).json({ ok: true });
    }
    if (b.action === "delete" && id) {
      const from = b.from === "approved" ? "approved" : "pending";
      await removePath(`reviews/${from}/${id}.json`);
      if (from === "approved") await snapshotApproved(list => list.filter(x => x.id !== id));
      bust(); return res.status(200).json({ ok: true });
    }
    if (b.action === "status" && id) {
      const kind = b.kind === "message" ? "messages" : "orders";
      const allowed = kind === "orders" ? ORDER_STATUS : MSG_STATUS;
      if (!allowed.includes(b.status)) return res.status(400).json({ error: "Bad status" });
      const s = await statusDoc();
      s[kind] = { ...s[kind], [id]: { s: b.status, at: new Date().toISOString() } };
      await saveJSON("db/status.json", s, { mutable: true });
      bust(); return res.status(200).json({ ok: true, status: s });
    }
    if (b.action === "remove") {
      const path = String(b.path || "");
      if (!/^(orders|messages|subscribers)\/[A-Za-z0-9._-]+\.json$/.test(path)) return res.status(400).json({ error: "Bad path" });
      await removePath(path);
      bust(); return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ error: "Bad action" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed" });
  }
}
