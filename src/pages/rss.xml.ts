import rss from '@astrojs/rss'
import { NAVIGATOR } from '../config'

export const get = () =>
  rss({
    title: NAVIGATOR.name,
    description: '',
    site: import.meta.env.SITE,
    items: import.meta.glob('./**/*.md'),
    customData: `<language>en-us</language>`,
  })
