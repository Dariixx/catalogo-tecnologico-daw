// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // Astro usa esta propiedad para sitemap/canonical
  site: process.env.SITE_URL || "https://zetagadget.es",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), sitemap()],
});