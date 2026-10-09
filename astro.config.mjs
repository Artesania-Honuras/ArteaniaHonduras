// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Configuración de Astro para Arteanía Honduras.
 *
 * El sitio se publica como "project site" de GitHub Pages, por lo que vive
 * bajo el subdirectorio definido en `base`. Todos los enlaces internos del
 * proyecto deben construirse con el helper `enlace()` de `src/lib/rutas.ts`
 * para que ese prefijo se aplique de forma automática.
 *
 * @see https://docs.astro.build/es/reference/configuration-reference/
 */
export default defineConfig({
  site: 'https://artesania-honuras.github.io',
  base: '/ArteaniaHonduras',
  trailingSlash: 'ignore',
  output: 'static',
  compressHTML: true,
  integrations: [
    sitemap({
      i18n: undefined,
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
