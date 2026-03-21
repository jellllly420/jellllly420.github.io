import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { sortByDate } from '@/utils/content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const blog = await getCollection('blog');
  const shelf = await getCollection('shelf');
  const travel = await getCollection('travel');

  const allPosts = sortByDate([
    ...blog.map((p) => ({ ...p, section: 'blog' as const })),
    ...shelf.map((p) => ({ ...p, section: 'shelf' as const })),
    ...travel.map((p) => ({ ...p, section: 'travel' as const })),
  ]);

  return rss({
    title: 'Jelly',
    description: 'Technical musings, random thoughts, and other stuff.',
    site: context.site!,
    items: allPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt ?? '',
      link: `/${post.section}/${post.id}/`,
    })),
  });
}
