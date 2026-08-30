/**
 * validate.mjs — فحص صحة جميع ملفات المحتوى (أخبار + أدوات)
 * يتحقق من مطابقة frontmatter لـ schema المعتمد
 * Usage: node scripts/validate.mjs
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { CATEGORIES } from './feeds.mjs';

const VALID_PRICING = ['free', 'freemium', 'paid'];
const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Parse JSON values (strings, arrays, numbers)
    try {
      value = JSON.parse(value);
    } catch {
      // Keep as string if not valid JSON
    }

    frontmatter[key] = value;
  }

  return frontmatter;
}

async function collectFiles(dir) {
  const results = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...(await collectFiles(fullPath)));
      } else if (entry.name.endsWith('.md')) {
        results.push(fullPath);
      }
    }
  } catch {
    // Directory doesn't exist
  }
  return results;
}

async function validateNews() {
  const newsDir = path.join(CONTENT_DIR, 'news');
  const files = await collectFiles(newsDir);
  const errors = [];

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const fm = parseFrontmatter(content);
    const rel = path.relative(CONTENT_DIR, file);

    if (!fm) {
      errors.push({ file: rel, error: 'لا يوجد frontmatter' });
      continue;
    }

    // Required fields
    for (const field of ['title', 'summary', 'category', 'sourceName', 'sourceUrl', 'publishedAt']) {
      if (!fm[field]) {
        errors.push({ file: rel, error: `الحقل المطلوب مفقود: ${field}` });
      }
    }

    // Category enum
    if (fm.category && !CATEGORIES.includes(fm.category)) {
      errors.push({ file: rel, error: `تصنيف غير صالح: "${fm.category}". القيم المتاحة: ${CATEGORIES.join(', ')}` });
    }

    // sourceUrl format
    if (fm.sourceUrl && typeof fm.sourceUrl === 'string') {
      try {
        new URL(fm.sourceUrl);
      } catch {
        errors.push({ file: rel, error: `رابط المصدر غير صالح: "${fm.sourceUrl}"` });
      }
    }

    // importance range
    if (fm.importance !== undefined) {
      const imp = Number(fm.importance);
      if (isNaN(imp) || imp < 1 || imp > 5) {
        errors.push({ file: rel, error: `معدل الأهمية خارج النطاق (1-5): ${fm.importance}` });
      }
    }
  }

  return { total: files.length, errors };
}

async function validateTools() {
  const toolsDir = path.join(CONTENT_DIR, 'tools');
  const files = await collectFiles(toolsDir);
  const errors = [];

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const fm = parseFrontmatter(content);
    const rel = path.relative(CONTENT_DIR, file);

    if (!fm) {
      errors.push({ file: rel, error: 'لا يوجد frontmatter' });
      continue;
    }

    // Required fields
    for (const field of ['name', 'description', 'category', 'url', 'pricing']) {
      if (!fm[field]) {
        errors.push({ file: rel, error: `الحقل المطلوب مفقود: ${field}` });
      }
    }

    // Category enum
    if (fm.category && !CATEGORIES.includes(fm.category)) {
      errors.push({ file: rel, error: `تصنيف غير صالح: "${fm.category}". القيم المتاحة: ${CATEGORIES.join(', ')}` });
    }

    // Pricing enum
    if (fm.pricing && !VALID_PRICING.includes(fm.pricing)) {
      errors.push({ file: rel, error: `نوع التسعير غير صالح: "${fm.pricing}". القيم المتاحة: ${VALID_PRICING.join(', ')}` });
    }

    // URL format
    if (fm.url && typeof fm.url === 'string') {
      try {
        new URL(fm.url);
      } catch {
        errors.push({ file: rel, error: `رابط الأداة غير صالح: "${fm.url}"` });
      }
    }
  }

  return { total: files.length, errors };
}

async function main() {
  console.log('🔍 جاري فحص صحة ملفات المحتوى...\n');

  const newsResult = await validateNews();
  const toolsResult = await validateTools();

  // Report News
  console.log(`📰 الأخبار: ${newsResult.total} ملف`);
  if (newsResult.errors.length === 0) {
    console.log('   ✅ جميع ملفات الأخبار صالحة\n');
  } else {
    console.log(`   ❌ ${newsResult.errors.length} خطأ:\n`);
    for (const err of newsResult.errors) {
      console.log(`   • ${err.file}: ${err.error}`);
    }
    console.log('');
  }

  // Report Tools
  console.log(`🛠️ الأدوات: ${toolsResult.total} ملف`);
  if (toolsResult.errors.length === 0) {
    console.log('   ✅ جميع ملفات الأدوات صالحة\n');
  } else {
    console.log(`   ❌ ${toolsResult.errors.length} خطأ:\n`);
    for (const err of toolsResult.errors) {
      console.log(`   • ${err.file}: ${err.error}`);
    }
    console.log('');
  }

  const totalErrors = newsResult.errors.length + toolsResult.errors.length;
  if (totalErrors > 0) {
    console.log(`\n❌ إجمالي الأخطاء: ${totalErrors}`);
    process.exit(1);
  } else {
    console.log('🎉 جميع الملفات صالحة ومتوافقة مع المخطط!');
  }
}

main().catch((err) => {
  console.error('❌ خطأ في عملية الفحص:', err);
  process.exit(1);
});
