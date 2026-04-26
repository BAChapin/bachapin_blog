import type { CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export function getPostSlug(post: BlogPost) {
  return post.id.replace(/\.(md|mdx)$/i, '');
}

export function isPostVisible(post: BlogPost) {
  return !post.data.draft || !import.meta.env.PROD;
}

export function sortPostsByDate(posts: BlogPost[]) {
  return [...posts].sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

export function getVisiblePosts(posts: BlogPost[]) {
  return sortPostsByDate(posts.filter(isPostVisible));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function estimateReadingTime(text = '') {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 225));

  return `${minutes} min read`;
}
