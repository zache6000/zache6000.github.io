import { put, list, del, head } from "@vercel/blob";

/* Storage notes (Vercel Blob, Hobby plan):
   put() and list() are "advanced operations" (2,000 / month included), so:
   - public pages never call list(); reviews are served from one snapshot file;
   - the admin uses a single list() per refresh and caches it briefly. */

export const body = req => (typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {});
export const clean = (s, n) => String(s || "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, n);
export const cleanText = (s, n) => String(s || "").replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, " ").replace(/\n{3,}/g, "\n\n").trim().slice(0, n);
export const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const saveJSON = (path, obj, opts = {}) =>
  put(path, JSON.stringify(obj), {
    access: "public", contentType: "application/json",
    addRandomSuffix: !!opts.random, allowOverwrite: !opts.random,
    ...(opts.mutable ? { cacheControlMaxAge: 60 } : {})
  });

async function fetchJSON(url, ver) {
  const r = await fetch(url + (ver ? (url.includes("?") ? "&" : "?") + "v=" + ver : ""), { cache: "no-store" });
  if (!r.ok) throw new Error("fetch " + r.status);
  return r.json();
}

/* read one blob by pathname (simple operations only) */
export async function readJSON(pathname) {
  try {
    const h = await head(pathname);
    return { data: await fetchJSON(h.url, new Date(h.uploadedAt).getTime()), url: h.url };
  } catch (e) { return null; }
}

/* remove one blob by pathname (delete is free) */
export async function removePath(pathname) {
  const h = await head(pathname).catch(() => null);
  if (h) await del(h.url);
  return !!h;
}

/* everything in the store, grouped by top-level folder (admin only) */
let cache = null;
export const bust = () => { cache = null; };
export async function listAll(maxAgeMs = 20000) {
  if (cache && Date.now() - cache.t < maxAgeMs) return cache.v;
  const blobs = [];
  let cursor;
  do {
    const page = await list({ cursor, limit: 1000 });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  const rows = await Promise.all(blobs.map(async b => {
    try { const j = await fetchJSON(b.url, new Date(b.uploadedAt).getTime()); return { ...j, _path: b.pathname }; }
    catch (e) { return null; }
  }));
  const pick = pre => rows.filter(r => r && r._path.startsWith(pre)).sort((a, b) => new Date(b.at || 0) - new Date(a.at || 0));
  const statusDoc = rows.find(r => r && r._path === "db/status.json") || {};
  const v = {
    pending: pick("reviews/pending/"), approved: pick("reviews/approved/"),
    subscribers: pick("subscribers/"), orders: pick("orders/"), messages: pick("messages/"),
    status: { orders: statusDoc.orders || {}, messages: statusDoc.messages || {} }
  };
  cache = { t: Date.now(), v };
  return v;
}

/* public snapshot of approved reviews, rebuilt only when the admin moderates */
export const REVIEWS_SNAPSHOT = "public/reviews.json";
const pubReview = ({ id, name, product, rating, text, at, lang }) => ({ id, name, product, rating, text, at, lang });
export async function writeReviewsSnapshot(approved) {
  const reviews = approved.map(pubReview).sort((a, b) => new Date(b.at) - new Date(a.at));
  await saveJSON(REVIEWS_SNAPSHOT, { reviews, at: new Date().toISOString() }, { mutable: true });
  return reviews;
}

/* tiny per-instance throttle for public forms */
const hits = new Map();
export function throttled(req, limit = 6, scope = "", windowMs = 10 * 60 * 1000) {
  const ip = String(req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || "?").split(",")[0].trim();
  const now = Date.now();
  const id = scope + "|" + ip;
  const arr = (hits.get(id) || []).filter(t => now - t < windowMs);
  arr.push(now); hits.set(id, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > limit;
}

export { del };
