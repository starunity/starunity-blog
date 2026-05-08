import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
import compress from 'astro-compress'

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.starunity.dev',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap(), compress()],
})
