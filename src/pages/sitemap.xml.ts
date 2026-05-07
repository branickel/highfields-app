import type { APIRoute } from 'astro';

/** Site-relative paths (trailing slash matches prerendered routes). Add a segment when you add a page. */
const PATHS = ['/', '/about/', '/contact/', '/gallery/', '/services/'];

export const prerender = true;

export const GET: APIRoute = () => {
  const site = import.meta.env.SITE;
  if (!site) {
    throw new Error('Set `site` in astro.config.');
  }

  const locs = PATHS.map((path) => new URL(path, site).href);
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    locs.map((loc) => `<url><loc>${loc}</loc></url>`).join('') +
    `</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
