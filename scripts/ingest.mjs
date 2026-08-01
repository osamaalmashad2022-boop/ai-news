/**
 * ingest.mjs — نظام جلب وتحليل الأخبار والأدوات المحسّن
 * ✅ Validation صارم للتصنيفات ضد enum
 * ✅ Article-extractor للنص الكامل
 * ✅ Deduplication عبر history.json
 * ✅ Retry مع exponential backoff
 * ✅ Structured logging إلى ملفات JSON
 * ✅ Slug generation محسّن للعربية
 */

import Parser from 'rss-parser';
import { extract } from '@extractus/article-extractor';
import { GoogleGenAI } from '@google/genai';
import fs from 'node:fs/promises';
import path from 'node:path';
import { RSS_FEEDS, CATEGORIES } from './feeds.mjs';
import { SYSTEM_PROMPT } from './prompt.mjs';

// ─── Configuration ───────────────────────────────────────────────
const isDryRun = process.argv.includes('--dry-run');
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 1000;
const HISTORY_PATH = path.join(process.cwd(), 'scripts', 'history.json');
const LOGS_DIR = path.join(process.cwd(), 'logs');
const VALID_PRICING = ['free', 'freemium', 'paid'];
const LOOKBACK_HOURS = 48;

const parser = new Parser({
  timeout: 15000,
  headers: { 'User-Agent': 'AINewsArabic/2.0 (automated; +https://ai-news-arabic.vercel.app)' },
});

// ─── Logger ──────────────────────────────────────────────────────
const logEntries = [];
const startTime = Date.now();

function log(level, message, meta = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  logEntries.push(entry);

  const icons = { info: 'ℹ️', success: '✅', warn: '⚠️', error: '❌', step: '📡' };
  console.log(`${icons[level] || '•'} ${message}`);
}

async function saveLog() {
  try {
    await fs.mkdir(LOGS_DIR, { recursive: true });
    const todayStr = new Date().toISOString().split('T')[0];
    const logFile = path.join(LOGS_DIR, `ingest-${todayStr}.json`);

    const report = {
      runAt: new Date().toISOString(),
      durationMs: Date.now() - startTime,
      dryRun: isDryRun,
      entries: logEntries,
    };

    await fs.writeFile(logFile, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`📋 تم حفظ سجل التشغيل: ${logFile}`);
  } catch (err) {
    console.warn(`⚠️ تعذر حفظ السجل: ${err.message}`);
  }
}

// ─── History / Deduplication ─────────────────────────────────────
async function loadHistory() {
  try {
    const raw = await fs.readFile(HISTORY_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { processedUrls: [], processedTitles: [], lastRunAt: null };
  }
}

async function saveHistory(history) {
  // Keep only last 2000 entries to avoid unbounded growth
  history.processedUrls = history.processedUrls.slice(-2000);
  history.processedTitles = history.processedTitles.slice(-2000);
  history.lastRunAt = new Date().toISOString();
  await fs.writeFile(HISTORY_PATH, JSON.stringify(history, null, 2), 'utf-8');
}

function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isDuplicate(history, url, title) {
  if (history.processedUrls.includes(url)) return true;
  const normalized = normalizeTitle(title);
  return history.processedTitles.some(
    (t) => normalizeTitle(t) === normalized
  );
}

// ─── Retry Helper ────────────────────────────────────────────────
async function withRetry(fn, label, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) {
        log('error', `فشل ${label} بعد ${retries} محاولات: ${err.message}`);
        throw err;
      }
      const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1);
      log('warn', `محاولة ${attempt}/${retries} فشلت لـ ${label}، إعادة بعد ${delay}ms`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

// ─── Slug Generation (Arabic-aware) ─────────────────────────────
function sanitizeSlug(text) {
  return text
    .toLowerCase()
    // Transliterate common Arabic chars to latin for URL-safety
    .replace(/[\u0600-\u06FF]+/g, (match) => {
      // Use a hash-like approach: take first+last char codes
      return `ar${match.charCodeAt(0).toString(36)}${match.charCodeAt(match.length - 1).toString(36)}`;
    })
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || `item-${Date.now()}`;
}

// ─── Category Validation ─────────────────────────────────────────
function validateCategory(category, fallback) {
  if (CATEGORIES.includes(category)) return category;

  // Try fuzzy match: find closest category
  const normalized = category?.trim();
  for (const valid of CATEGORIES) {
    if (valid.includes(normalized) || normalized?.includes(valid)) {
      return valid;
    }
  }

  log('warn', `تصنيف غير صالح: "${category}" → استخدام الافتراضي: "${fallback}"`);
  return fallback || 'أدوات وتطبيقات';
}

// ─── Full Text Extraction ────────────────────────────────────────
async function extractFullText(url) {
  try {
    const article = await extract(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'AINewsArabic/2.0' },
    });
    if (article?.content) {
      // Strip HTML tags, keep text
      const text = article.content
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      return text.slice(0, 5000); // Gemini-friendly limit
    }
  } catch {
    // Silently fall back to snippet
  }
  return null;
}

// ─── Fetch Recent Articles ───────────────────────────────────────
async function fetchRecentArticles(history) {
  log('step', 'جاري قراءة خلاصات RSS وسحب الأخبار والأدوات...');
  const now = new Date();
  const cutoff = new Date(now.getTime() - LOOKBACK_HOURS * 60 * 60 * 1000);
  const items = [];
  let feedsSucceeded = 0;
  let feedsFailed = 0;

  for (const feed of RSS_FEEDS) {
    try {
      const data = await withRetry(
        () => parser.parseURL(feed.url),
        feed.name,
        2
      );

      let feedCount = 0;
      for (const entry of data.items || []) {
        const pubDate = entry.pubDate ? new Date(entry.pubDate) : new Date();
        if (pubDate < cutoff) continue;

        const link = entry.link || feed.url;
        const title = entry.title || '';

        // Skip duplicates
        if (isDuplicate(history, link, title)) {
          continue;
        }

        // Try full text extraction
        let fullText = await extractFullText(link);

        items.push({
          title,
          contentSnippet: fullText || entry.contentSnippet || entry.content || '',
          link,
          pubDate: pubDate.toISOString(),
          sourceName: feed.name,
          defaultCategory: feed.categoryDefault,
        });
        feedCount++;
      }

      log('info', `  ✓ ${feed.name}: ${feedCount} مقال جديد`);
      feedsSucceeded++;
    } catch (err) {
      log('warn', `  ✗ متعذر قراءة ${feed.name}: ${err.message}`);
      feedsFailed++;
    }
  }

  log('success', `تم جمع ${items.length} مقال حديث (${feedsSucceeded} خلاصة ناجحة، ${feedsFailed} فاشلة)`);
  return items;
}

// ─── Gemini Summarization (Batched + Model Fallbacks + Backoff) ─────
async function callGeminiBatchWithFallback(ai, articlesBatch, responseSchema) {
  const FALLBACK_MODELS = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-flash-latest'];
  const MAX_RETRIES_PER_MODEL = 3;

  const articlesPrompt = articlesBatch
    .map(
      (art, i) => `
--- مقال #${i + 1} ---
المصدر: ${art.sourceName}
العنوان الأصلي: ${art.title}
الرابط: ${art.link}
تاريخ النشر: ${art.pubDate}
النص/المقتطف:
${art.contentSnippet.slice(0, 1500)}
`
    )
    .join('\n');

  for (const model of FALLBACK_MODELS) {
    for (let attempt = 1; attempt <= MAX_RETRIES_PER_MODEL; attempt++) {
      try {
        log('info', `  🤖 محاولة التلخيص عبر ${model} (محاولة ${attempt}/${MAX_RETRIES_PER_MODEL})...`);
        const response = await ai.models.generateContent({
          model,
          contents: `إليك المقالات التالية المجلوبة حديثاً، قم بتجميع الأخبار البارزة واستخراج أي أدوات جديدة وتصدير النتائج باللغة العربية:\n\n${articlesPrompt}`,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            responseMimeType: 'application/json',
            responseSchema,
            temperature: 0.2,
          },
        });

        const rawJson = response.text;
        const parsed = JSON.parse(rawJson);
        return {
          news: parsed.news || [],
          tools: parsed.tools || [],
        };
      } catch (err) {
        const isTransient =
          err.status === 503 ||
          err.status === 429 ||
          err.status === 500 ||
          err.message?.includes('503') ||
          err.message?.includes('demand') ||
          err.message?.includes('quota') ||
          err.message?.includes('RESOURCE_EXHAUSTED') ||
          err.message?.includes('UNAVAILABLE');

        if (attempt < MAX_RETRIES_PER_MODEL && isTransient) {
          const jitter = Math.random() * 1000;
          const delay = Math.min(2000 * Math.pow(2, attempt - 1) + jitter, 15000);
          log('warn', `  ⚠️ النموذج ${model} واجه خطأ مؤقت (${err.status || err.message}). إعادة المحاولة بعد ${Math.round(delay)}ms...`);
          await new Promise((r) => setTimeout(r, delay));
        } else if (attempt === MAX_RETRIES_PER_MODEL) {
          log('warn', `  ⚠️ فشل النموذج ${model} بعد ${MAX_RETRIES_PER_MODEL} محاولات: ${err.message}. الانتقال للنموذج البديل...`);
        }
      }
    }
  }

  throw new Error('فشلت جميع نماذج Gemini المتاحة للدفعة الحالية');
}

async function summarizeWithGemini(articles) {
  if (!process.env.GEMINI_API_KEY) {
    try {
      const envContent = await fs.readFile(path.join(process.cwd(), '.env'), 'utf-8');
      const match = envContent.match(/GEMINI_API_KEY=(.+)/);
      if (match?.[1]) {
        process.env.GEMINI_API_KEY = match[1].trim();
      }
    } catch {}
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    log('warn', 'لم يتم العثور على GEMINI_API_KEY. وضع المحاكاة.');
    return {
      news: articles.slice(0, 3).map((art) => ({
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
      })),
      tools: [],
    };
  }

  const ai = new GoogleGenAI({ apiKey });

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

  const toolItemSchema = {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'اسم الأداة أو التطبيق' },
      description: { type: 'string', description: 'وصف باللغة العربية للأداة وتطبيقاتها' },
      category: { type: 'string', description: 'التصنيف الأساسي للأداة' },
      url: { type: 'string', description: 'الرابط الرسمي للأداة أو رابط المقال' },
      pricing: { type: 'string', description: 'نوع التسعير: free أو freemium أو paid' },
      tags: { type: 'array', items: { type: 'string' }, description: 'وسوم الكلمات المفتاحية' },
    },
    required: ['name', 'description', 'category', 'url', 'pricing', 'tags'],
  };

  const responseSchema = {
    type: 'object',
    properties: {
      news: { type: 'array', items: newsItemSchema },
      tools: { type: 'array', items: toolItemSchema },
    },
    required: ['news', 'tools'],
  };

  const BATCH_SIZE = 12;
  const batches = [];
  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    batches.push(articles.slice(i, i + BATCH_SIZE));
  }

  log('step', `جاري تحليل ${articles.length} مقال مقسمة على ${batches.length} دفعة عبر Gemini...`);

  const allNews = [];
  const allTools = [];

  for (let bIndex = 0; bIndex < batches.length; bIndex++) {
    const batch = batches[bIndex];
    log('info', `📦 معالجة الدفعة ${bIndex + 1}/${batches.length} (${batch.length} مقال)...`);

    try {
      const result = await callGeminiBatchWithFallback(ai, batch, responseSchema);
      allNews.push(...result.news);
      allTools.push(...result.tools);
      log('success', `  ✓ اكتملت الدفعة ${bIndex + 1}: ${result.news.length} خبر، ${result.tools.length} أداة.`);
    } catch (err) {
      log('error', `  ❌ تعذر معالجة الدفعة ${bIndex + 1}: ${err.message}`);
    }

    if (bIndex < batches.length - 1) {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  return {
    news: allNews,
    tools: allTools,
  };
}

// ─── Save Content Files ──────────────────────────────────────────
async function saveNewsFiles(newsList, history) {
  const todayStr = new Date().toISOString().split('T')[0];
  const newsDir = path.join(process.cwd(), 'src', 'content', 'news', todayStr);
  await fs.mkdir(newsDir, { recursive: true });

  let saved = 0;
  let skipped = 0;

  for (const item of newsList) {
    // Validate category
    const category = validateCategory(item.category, item.defaultCategory || 'أدوات وتطبيقات');

    // Generate unique slug
    const slug = sanitizeSlug(item.sourceName + '-' + item.title.slice(0, 40));
    const filePath = path.join(newsDir, `${slug}.md`);

    // Check if file already exists
    try {
      await fs.access(filePath);
      log('info', `  ⏭️ ملف موجود، تخطي: ${slug}`);
      skipped++;
      continue;
    } catch {
      // Good — file doesn't exist
    }

    // Validate sourceUrl
    let sourceUrl = item.sourceUrl || '';
    try {
      new URL(sourceUrl);
    } catch {
      sourceUrl = `https://www.google.com/search?q=${encodeURIComponent(item.title)}`;
      log('warn', `  رابط مصدر غير صالح لـ "${item.title}"، استخدام بحث Google`);
    }

    // Clamp importance
    const importance = Math.min(5, Math.max(1, Number(item.importance) || 3));

    const frontmatter = `---
title: ${JSON.stringify(item.title)}
summary: ${JSON.stringify(item.summary)}
category: ${JSON.stringify(category)}
tags: ${JSON.stringify(item.tags || [])}
sourceName: ${JSON.stringify(item.sourceName)}
sourceUrl: ${JSON.stringify(sourceUrl)}
publishedAt: ${JSON.stringify(item.publishedAt || new Date().toISOString())}
importance: ${importance}
toolsMentioned: ${JSON.stringify(item.toolsMentioned || [])}
---

${item.bodyMarkdown}
`;

    await fs.writeFile(filePath, frontmatter, 'utf-8');
    log('info', `  📰 تم حفظ الخبر: ${slug}`);
    saved++;

    // Track in history
    if (item.sourceUrl) history.processedUrls.push(item.sourceUrl);
    history.processedTitles.push(item.title);
  }

  return { saved, skipped };
}

async function saveToolFiles(toolsList, history) {
  const toolsDir = path.join(process.cwd(), 'src', 'content', 'tools');
  await fs.mkdir(toolsDir, { recursive: true });

  let saved = 0;
  let skipped = 0;

  for (const tool of toolsList) {
    const slug = sanitizeSlug(tool.name);
    const filePath = path.join(toolsDir, `${slug}.md`);

    // Check if tool file already exists
    try {
      await fs.access(filePath);
      log('info', `  ⏭️ الأداة موجودة مسبقاً، تم تخطي: ${slug}`);
      skipped++;
      continue;
    } catch {
      // Good — file doesn't exist
    }

    // Validate category
    const category = validateCategory(tool.category, 'أدوات وتطبيقات');

    // Validate pricing
    const pricing = VALID_PRICING.includes(tool.pricing?.toLowerCase())
      ? tool.pricing.toLowerCase()
      : 'freemium';

    // Validate URL
    let url = tool.url || '';
    try {
      new URL(url);
    } catch {
      url = `https://www.google.com/search?q=${encodeURIComponent(tool.name)}`;
      log('warn', `  رابط أداة غير صالح لـ "${tool.name}"، استخدام بحث Google`);
    }

    const toolFrontmatter = `---
name: ${JSON.stringify(tool.name)}
description: ${JSON.stringify(tool.description)}
category: ${JSON.stringify(category)}
url: ${JSON.stringify(url)}
pricing: ${JSON.stringify(pricing)}
tags: ${JSON.stringify(tool.tags || [])}
addedAt: ${JSON.stringify(new Date().toISOString())}
---

${tool.description}
`;

    await fs.writeFile(filePath, toolFrontmatter, 'utf-8');
    log('info', `  🛠️ تم حفظ أداة جديدة: ${slug}`);
    saved++;

    // Track in history
    if (tool.url) history.processedUrls.push(tool.url);
    history.processedTitles.push(tool.name);
  }

  return { saved, skipped };
}

// ─── Main ────────────────────────────────────────────────────────
async function main() {
  try {
    log('step', '🚀 بدء عملية الجلب والتحليل...');

    // Load deduplication history
    const history = await loadHistory();
    log('info', `📂 سجل التاريخ: ${history.processedUrls.length} رابط محفوظ`);

    // Fetch articles
    const articles = await fetchRecentArticles(history);

    if (articles.length === 0) {
      log('info', 'لا توجد مقالات جديدة خلال الـ 48 ساعة الماضية.');
      await saveLog();
      return;
    }

    // Summarize with Gemini
    const { news: newsList, tools: toolsList } = await summarizeWithGemini(articles);
    log('success', `تم توليد ${newsList.length} خبر ملخص و ${toolsList.length} أداة جديدة.`);

    if (isDryRun) {
      log('info', '🧪 وضع التجربة (--dry-run) — لن يتم حفظ الملفات.');
      console.log('\n' + JSON.stringify({ news: newsList, tools: toolsList }, null, 2));
      await saveLog();
      return;
    }

    // Save files
    const newsResult = await saveNewsFiles(newsList, history);
    const toolsResult = await saveToolFiles(toolsList, history);

    // Save updated history
    await saveHistory(history);

    log('success', `🎉 اكتمل! أخبار: ${newsResult.saved} جديد / ${newsResult.skipped} تخطي | أدوات: ${toolsResult.saved} جديد / ${toolsResult.skipped} تخطي`);

    // Save structured log
    await saveLog();
  } catch (err) {
    log('error', `خطأ أثناء تنفيذ عملية الجلب والتلخيص: ${err.message}`, { stack: err.stack });
    await saveLog();
    process.exit(1);
  }
}

main();
