import { BLOG_POSTS } from '@/data/blogs.generated';
import { DEFAULT_LOCALE } from '@/i18n/routing';
import { BlogPost } from '@/types/blog';

// Posts are inlined at build time by scripts/build-blogs.mjs. Reading blogs/
// with fs here used to return nothing on Cloudflare Workers — no filesystem at
// request time — which silently 404'd every article.
export async function getPosts(locale: string = DEFAULT_LOCALE): Promise<{ posts: BlogPost[] }> {
  const raw = BLOG_POSTS[locale] ?? BLOG_POSTS[DEFAULT_LOCALE] ?? [];

  const posts: BlogPost[] = raw
    .filter(post => post.visible === 'published')
    .map(post => ({ ...post, date: new Date(post.date) }))
    .sort((a, b) => {
      if (a.pin !== b.pin) {
        return (b.pin ? 1 : 0) - (a.pin ? 1 : 0);
      }
      return b.date.getTime() - a.date.getTime();
    });

  return { posts };
}
