
import qs from "qs";
import { STRAPI_URL, STRAPI_TOKEN } from "./urls.js";

export async function strapiFetch(path, { query, options } = {}) {
  const q = query ? `?${qs.stringify(query, { encodeValuesOnly: true })}` : "";
  const url = `${STRAPI_URL}${path}${q}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      ...(options?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Strapi error ${res.status} on ${path} ${text}`);
  }
  return res.json();
}


export function getStrapiPagination(meta) {
  return meta?.pagination ?? { page: 1, pageSize: 10, pageCount: 1, total: 0 };
}
export function absoluteUrl(path) {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const base = (import.meta.env.STRAPI_URL || "").replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
