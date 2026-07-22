import Parser from 'rss-parser';
import { GoogleGenAI } from '@google/genai';
import fs from 'node:fs/promises';
import path from 'node:path';
import { RSS_FEEDS } from './feeds.mjs';
import { SYSTEM_PROMPT } from './prompt.mjs';

const isDryRun = process.argv.includes('--dry-run');
const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'AINewsArabic/1.0' },
});

function sanitizeSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || `news-${Date.now()}`;
}

async function fetchRecentArticles() {
  console.log('📡 جاري قراءة خلاصات RSS...');
  const now = new Date();
  const yesterday = new Date(now.getTime() - 48 * 60 * 60 * 1000); // last 48 hours for buffer
  const items = [];

  for (const feed of RSS_FEEDS) {
    try {
      console.log(`  🔍 فحص: ${feed.name}`);
      const data = await parser.parseURL(feed.url);
      
      for (const entry of data.items || []) {
        const pubDate = entry.pubDate ? new Date(entry.pubDate) : new Date();
        if (pubDate >= yesterday) {
          items.push({
            title: entry.title || '',
            contentSnippet: entry.contentSnippet || entry.content || '',
            link: entry.link || feed.url,
            pubDate: pubDate.toISOString(),
            sourceName: feed.name,
            defaultCategory: feed.categoryDefault,
          });
        }
      }
    } catch (err) {
      console.warn(`  ⚠️ متعذر قراءة ${feed.name}: ${err.message}`);
    }
  }

  console.log(`✅ تم جمع ${items.length} مقال حديث.`);
  return items;
}

async function summarizeWithGemini(articles) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ لم يتم العثور على GEMINI_API_KEY. سيتم استخدام وضع التجربة المحاكاة (Mocking).');
    return articles.slice(0, 3).map((art, idx) => ({
      title: `ملخص: ${art.title}`,
      summary: art.contentSnippet.slice(0, 250) + '...',
      bodyMarkdown: `تم جلب هذا الخبر من **${art.sourceName}**.\n\n### التفاصيل:\n${art.contentSnippet.slice(0, 500)}`,
      category: art.defaultCategory,
      tags: ['AI', art.sourceName],
      sourceName: art.sourceName,
      sourceUrl: art.link,
      publishedAt: art.pubDate,
      importance: 4,
      toolsMentioned: [],
    }));
  }

  const ai = new GoogleGenAI({ apiKey });

  const articlesPrompt = articles.map((art, i) => `
--- مقال #${i + 1} ---
المصدر: ${art.sourceName}
العنوان الأصلي: ${art.title}
الرابط: ${art.link}
تاريخ النشر: ${art.pubDate}
النص/المقتطف:
${art.contentSnippet.slice(0, 1000)}
`).join('\n');

  console.log('🤖 جاري إرسال المقالات إلى Gemini 2.5 Flash للتلخيص والتدقيق بالعربية...');

  const newsItemSchema = {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'عنوان صحفي جذاب ومختصر باللغة العربية' },
      summary: { type: 'string', description: 'ملخص للخبر من 2 إلى 4 جمل باللغة العربية' },
      bodyMarkdown: { type: 'string', description: 'تفاصيل الخبر بتنسيق ماركداون مقسم بنقاط وعناوين جانبية فرعية' },
      category: { type: 'string', description: 'التصنيف الأساسي للخبر' },
      tags: { type: 'array', items: { type: 'string' }, description: 'وسوم الكلمات المفتاحية باللغة الإنجليزية والعربية' },
      sourceName: { type: 'string', description: 'اسم المصدر الأصلي' },
      sourceUrl: { type: 'string', description: 'رابط المقال الأصلي' },
      publishedAt: { type: 'string', description: 'تاريخ النشر بصيغة ISO' },
      importance: { type: 'integer', description: 'معدل الأهمية من 1 إلى 5' },
      toolsMentioned: { type: 'array', items: { type: 'string' }, description: 'أسماء أي أدوات جديدة مذكورة' },
    },
    required: ['title', 'summary', 'bodyMarkdown', 'category', 'tags', 'sourceName', 'sourceUrl', 'publishedAt', 'importance'],
  };

  const responseSchema = {
    type: 'object',
    properties: {
      news: { type: 'array', items: newsItemSchema },
    },
    required: ['news'],
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `إليك المقالات التالية المجلوبة حديثاً، قم بتجميعها وتلخيص أهم 10 إلى 15 خبر وتصدير النتائج باللغة العربية:\n\n${articlesPrompt}`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      responseSchema,
      temperature: 0.2,
    },
  });

  const rawJson = response.text;
  const parsed = JSON.parse(rawJson);
  return parsed.news || [];
}

async function main() {
  try {
    const articles = await fetchRecentArticles();

    if (articles.length === 0) {
      console.log('ℹ️ لا توجد مقالات جديدة خلال الـ 48 ساعة الماضية.');
      return;
    }

    const newsList = await summarizeWithGemini(articles);
    console.log(`✨ تم توليد ${newsList.length} خبر ملخص باحترافية.`);

    if (isDryRun) {
      console.log('\n--- 🧪 وضع الاختيار والتجربة (--dry-run) ---');
      console.log(JSON.stringify(newsList, null, 2));
      return;
    }

    // Save Markdown files
    const todayStr = new Date().toISOString().split('T')[0];
    const newsDir = path.join(process.cwd(), 'src', 'content', 'news', todayStr);
    await fs.mkdir(newsDir, { recursive: true });

    for (const item of newsList) {
      const slug = sanitizeSlug(item.sourceName + '-' + item.title.slice(0, 30));
      const filePath = path.join(newsDir, `${slug}.md`);

      const frontmatter = `---
title: ${JSON.stringify(item.title)}
summary: ${JSON.stringify(item.summary)}
category: ${JSON.stringify(item.category)}
tags: ${JSON.stringify(item.tags || [])}
sourceName: ${JSON.stringify(item.sourceName)}
sourceUrl: ${JSON.stringify(item.sourceUrl)}
publishedAt: ${JSON.stringify(item.publishedAt || new Date().toISOString())}
importance: ${item.importance || 3}
toolsMentioned: ${JSON.stringify(item.toolsMentioned || [])}
---

${item.bodyMarkdown}
`;

      await fs.writeFile(filePath, frontmatter, 'utf-8');
      console.log(`  💾 تم حفظ الخبر: ${filePath}`);
    }

    console.log('🎉 اكتملت عملية الجلب والتلخيص بنجاح!');
  } catch (err) {
    console.error('❌ خطأ أثناء تنفيذ عملية الجلب والتلخيص:', err);
    process.exit(1);
  }
}

main();
