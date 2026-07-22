import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const news = await getCollection('news');
  const sortedNews = news.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());

  return rss({
    title: 'نبض الذكاء - أخبار الذكاء الاصطناعي اليومية',
    description: 'أهم أخبار وابتكارات الذكاء الاصطناعي ملخصة باللغة العربية وموثقة يومياً من المصادر العالمية',
    site: context.site || 'https://ai-news-arabic.vercel.app',
    items: sortedNews.map((item) => ({
      title: item.data.title,
      pubDate: item.data.publishedAt,
      description: item.data.summary,
      link: `/news/${item.slug}/`,
      customData: `<sourceUrl>${item.data.sourceUrl}</sourceUrl><sourceName>${item.data.sourceName}</sourceName><category>${item.data.category}</category>`,
    })),
    customData: `<language>ar</language>`,
  });
}
