// src/lib/site-settings.js
import { STRAPI_URL } from "./urls.js";

export async function getSiteSettings() {
  // Si no hay STRAPI_URL, no rompemos
  if (!STRAPI_URL) return null;

  const url = new URL(`${STRAPI_URL}/api/site-setting`);
  url.searchParams.set("populate[logo]", "*");
  url.searchParams.set("populate[favicon]", "*");

  const res = await fetch(url.toString());
  if (!res.ok) return null;

  const json = await res.json().catch(() => null);
  const data = json?.data ?? null;

  // Strapi v5/v4: media puede venir en data.attributes.logo.data.attributes
  const attrs = data?.attributes ?? data ?? null;

  const pickMedia = (m) => {
    const a = m?.data?.attributes ?? m?.attributes ?? m ?? null;
    const url = a?.url;
    if (!url) return null;
    return {
      url, // puede ser relativo, BaseLayout lo resolverá si quieres
      alternativeText: a?.alternativeText ?? "",
    };
  };

  return {
    name: attrs?.name ?? null,
    tagline: attrs?.tagline ?? null,
    logo: pickMedia(attrs?.logo),
    favicon: pickMedia(attrs?.favicon),
  };
}