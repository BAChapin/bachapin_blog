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
    timeZone: 'UTC',
    year: 'numeric',
  }).format(date);
}

export function estimateReadingTime(text = '') {
  const words = countWords(text);
  const minutes = Math.max(1, Math.ceil(words / 225));

  return `${minutes} min read`;
}

export function countWords(text = '') {
  const readableText = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#{}`*_~>|-]/g, ' ');

  return readableText.match(/[A-Za-z0-9]+(?:['.-][A-Za-z0-9]+)*/g)?.length ?? 0;
}

export function estimateReadingMinutes(wordCount: number) {
  return Math.max(1, Math.ceil(wordCount / 225));
}

export function getPostWordCount(post: BlogPost) {
  return countWords(post.body);
}
