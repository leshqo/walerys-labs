// @ts-check
import { getCollection } from 'astro:content';

/** Newest first; entry id breaks ties deterministically. */
export async function sortedPosts() {
  const posts = await getCollection('posts');
  return posts.sort(
    (a, b) =>
      b.data.pubDate.getTime() - a.data.pubDate.getTime() ||
      (a.id < b.id ? 1 : a.id > b.id ? -1 : 0),
  );
}

export const PAGE_SIZE = 10;
