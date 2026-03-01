
import { STRAPI_URL, PUBLIC_STRAPI_URL } from "./urls.js";

export function absoluteUrl(path) {
  if (!path || typeof path !== "string") return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const base =
    (import.meta.env.SSR ? import.meta.env.STRAPI_URL : import.meta.env.PUBLIC_STRAPI_URL) ||
    STRAPI_URL ||
    PUBLIC_STRAPI_URL ||
    "";

  const clean = base.replace(/\/$/, "");
  return `${clean}${path.startsWith("/") ? "" : "/"}${path}`;
}

export async function strapiFetch(path, options = {}) {
  const base = (import.meta.env.SSR ? import.meta.env.STRAPI_URL : import.meta.env.PUBLIC_STRAPI_URL) || STRAPI_URL || PUBLIC_STRAPI_URL;
  if (!base) throw new Error("Falta STRAPI_URL / PUBLIC_STRAPI_URL");

  let p = path.startsWith("/") ? path : `/${path}`;

  // fuerza /api
  if (!p.startsWith("/api/")) p = `/api${p}`;

  const url = `${base.replace(/\/$/, "")}${p}`;

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Strapi error ${res.status} on ${p} ${text.slice(0, 200)}`);
  }
  return res.json();
}

export function unwrapEntity(entity) {
  if (!entity) return null;
  // Strapi v4: { id, attributes: {...} }
  if (entity.attributes) return { id: entity.id, ...entity.attributes };
  // Tu API actual: { id, slug, ... }
  return entity;
}

export function unwrapCollection(json) {
  const data = json?.data;
  if (Array.isArray(data)) return data.map(unwrapEntity).filter(Boolean);
  if (data) return [unwrapEntity(data)].filter(Boolean);
  return [];
}
export function pickMediaUrl(media) {
  const m =
    media?.data?.attributes ??
    media?.data ??
    media?.attributes ??
    media ??
    null;

  const rel =
    m?.url ??
    m?.formats?.large?.url ??
    m?.formats?.medium?.url ??
    m?.formats?.small?.url ??
    m?.formats?.thumbnail?.url ??
    null;

  return absoluteUrl(rel);
}