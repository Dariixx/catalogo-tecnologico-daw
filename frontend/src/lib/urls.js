// src/lib/urls.js
export const SITE_URL = (import.meta.env.SITE_URL ?? "https://zetagadget.es").replace(/\/$/, "");

export const STRAPI_URL = (
  import.meta.env.PUBLIC_STRAPI_URL ??
  import.meta.env.PUBLIC_API_URL ?? // compat si lo tuviste antes
  "https://api.zetagadget.es"
).replace(/\/$/, "");

// Aunque no lo uses en producción, debe existir si strapi.js lo importa
export const STRAPI_TOKEN = import.meta.env.STRAPI_TOKEN;