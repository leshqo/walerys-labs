// @ts-check
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    slug: z.string().min(1),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    readingMinutes: z.number().int().positive(),
  }),
});

export const collections = { posts };
