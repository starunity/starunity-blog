import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const postsCollection = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.md',
    base: './src/content/posts',
  }),
  schema: z.object({
    title: z.string(),
    lang: z.enum(['en', 'zh-Hans']),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).optional().nullable(),
  }),
})

export const collections = {
  posts: postsCollection,
}
