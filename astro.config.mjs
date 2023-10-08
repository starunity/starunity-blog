import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import robotsTxt from 'astro-robots-txt'

// https://astro.build/config
import compress from 'astro-compress'

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.starunity.dev',
  integrations: [tailwind(), sitemap(), robotsTxt(), compress()],
})
