import { z, defineCollection } from 'astro:content'

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    layout: z.string(),
    title: z.string(),
    pubDate: z.date(),
    updatedDate: z.date(),
    description: z.string(),
    tags: z.array(z.string()).optional().nullable(),
  }),
})

export const collections = {
  posts: postsCollection,
}
