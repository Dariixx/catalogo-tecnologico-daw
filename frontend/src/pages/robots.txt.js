export const prerender = true;

export function GET() {
  const site = (import.meta.env.SITE_URL ?? "https://zetagadget.es").replace(/\/$/, "");
  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${site}/sitemap-index.xml
`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
}