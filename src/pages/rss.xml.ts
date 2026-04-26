import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getPostSlug, getVisiblePosts } from '@/utils/posts';

export async function GET(context) {
  const posts = getVisiblePosts(await getCollection('blog')).filter((post) => !post.data.draft);

  return rss({
    title: 'Bachapin Blog',
    description: 'A quiet, technical blog about building thoughtful software.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${getPostSlug(post)}/`,
      categories: post.data.tags,
    })),
  });
}
