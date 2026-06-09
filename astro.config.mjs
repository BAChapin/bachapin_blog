import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { rehypeProseLinks } from './src/utils/rehypeProseLinks.mjs';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://example.com',
  output: 'static',
  integrations: [mdx({ rehypePlugins: [rehypeProseLinks] }), sitemap()],
});
