import { getCollection } from 'astro:content'
import { siteConfig } from '@/config'
import rss from '@astrojs/rss'
import MarkdownIt from 'markdown-it'
import sanitizeHtml from 'sanitize-html'
const parser = new MarkdownIt()

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function GET(context: any) {
  const immutable-insights = await getCollection('posts')
  return rss({
    title: siteConfig.title,
    description: siteConfig.subtitle || 'No description',
    site: context.site,
    items: immutable-insights.map(post => ({
      title: post.data.title,
      pubDate: post.data.published,
      description: post.data.description,
      link: `/posts/${post.slug}/`,
      content: sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      }),
    })),
    customData: `<language>${siteConfig.lang}</language>`,
  })
}
