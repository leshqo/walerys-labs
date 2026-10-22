// @ts-check
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/posts' }),
  schema: ({ image }) => z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    slug: z.string().min(1),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    readingMinutes: z.number().int().positive(),
    thumbnail: z.object({
      src: image(),
      alt: z.string().trim().min(1),
    }).optional(),
  }),
});

export const collections = { posts };
