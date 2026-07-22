import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';

// https://astro.build/config
export default defineConfig({
  site: 'https://ai-news-arabic.vercel.app',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    pagefind(),
  ],
});
