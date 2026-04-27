import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getPostSlug, getVisiblePosts } from '@/utils/posts';

export const GET: APIRoute = async (context) => {
  const posts = getVisiblePosts(await getCollection('blog')).filter((post) => !post.data.draft);

  return rss({
    title: 'Bachapin Blog',
    description: 'A quiet, technical blog about building thoughtful software.',
    site: context.site ?? new URL(import.meta.env.SITE_URL ?? 'https://example.com'),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${getPostSlug(post)}/`,
      categories: post.data.tags,
    })),
  });
};
