// @ts-check
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { sortedPosts } from '../lib/posts';

export const GET: APIRoute = async ({ site }) => {
  const posts = await sortedPosts();

  return rss({
    title: 'labs.walerys.app',
    description: 'Eksperymenty, automatyzacja i techniczne notatki.',
    site: site ?? 'https://labs.walerys.app',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/${post.data.slug}/`,
    })),
    customData: '<language>pl</language>',
  });
};
