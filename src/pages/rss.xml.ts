import type { APIContext } from 'astro'
import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { NAVIGATOR } from '../config'

export async function GET(context: APIContext) {
  const blog = await getCollection('posts')
  return rss({
    title: NAVIGATOR.name,
    description: '',
    site: context.site ?? '',
    items: blog.map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      tags: post.data.tags,
      link: `/posts/${post.slug}/`,
    })),
  })
}
