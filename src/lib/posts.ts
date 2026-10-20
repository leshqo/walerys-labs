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

export function paginate<T>(items: T[], { pageSize }: { pageSize: number }): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += pageSize) {
    pages.push(items.slice(i, i + pageSize));
  }
  return pages.length > 0 ? pages : [[]];
}

export const PAGE_SIZE = 10;
