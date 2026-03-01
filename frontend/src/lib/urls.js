// src/lib/urls.js

export const SITE_URL =
  import.meta.env.SITE_URL ||
  import.meta.env.PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://zetagadget.es";

export const STRAPI_URL =
  import.meta.env.STRAPI_URL ||
  process.env.STRAPI_URL ||
  "https://api.zetagadget.es";

// Solo para código que vaya al cliente (React/islands)
export const PUBLIC_STRAPI_URL =
  import.meta.env.PUBLIC_STRAPI_URL ||
  process.env.PUBLIC_STRAPI_URL ||
  STRAPI_URL;