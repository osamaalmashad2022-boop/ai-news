/**
 * dedupe-tools.mjs — فحص وتنظيف الأدوات المكررة في دليل الأدوات
 * يقوم بحذف الملفات المكررة وضمان بقاء نسخة واحدة فريدة ونظيفة لكل أداة
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const toolsDir = path.join(process.cwd(), 'src', 'content', 'tools');

function normalizeName(name) {
  return (name || '')
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF]/g, '')
    .replace(/\s+/g, '');
}

// Known aliases / semantic equivalents
const ALIASES = {
  'cursoride': 'cursor',
  'chatgptdesktopappforlinux': 'chatgptdesktopforlinux',
  'modelhardwarestandard': 'modelhardwarestandardmhs',
  'mhsmodelhardwarestandard': 'modelhardwarestandardmhs',
  'ciscoantares': 'antares',
  'sunoai': 'suno',
  'seedance': 'seedance',
  'wan30': 'wan30',
};

async function parseToolFile(file) {
  const filePath = path.join(toolsDir, file);
  const content = await fs.readFile(filePath, 'utf-8');

  const nameMatch = content.match(/^name:\s*(.+)$/m);
  const urlMatch = content.match(/^url:\s*(.+)$/m);
  const descMatch = content.match(/^description:\s*(.+)$/m);
  const addedAtMatch = content.match(/^addedAt:\s*(.+)$/m);
  const pricingMatch = content.match(/^pricing:\s*(.+)$/m);
  const categoryMatch = content.match(/^category:\s*(.+)$/m);
  const tagsMatch = content.match(/^tags:\s*(.+)$/m);

  let name = '';
  let url = '';
  let description = '';
  let addedAt = '';
  let pricing = 'freemium';
  let category = 'أدوات وتطبيقات';
  let tags = [];

  try { if (nameMatch) name = JSON.parse(nameMatch[1]); } catch { name = nameMatch?.[1] || ''; }
  try { if (urlMatch) url = JSON.parse(urlMatch[1]); } catch { url = urlMatch?.[1] || ''; }
  try { if (descMatch) description = JSON.parse(descMatch[1]); } catch { description = descMatch?.[1] || ''; }
  try { if (addedAtMatch) addedAt = JSON.parse(addedAtMatch[1]); } catch { addedAt = addedAtMatch?.[1] || ''; }
  try { if (pricingMatch) pricing = JSON.parse(pricingMatch[1]); } catch { pricing = pricingMatch?.[1] || ''; }
  try { if (categoryMatch) category = JSON.parse(categoryMatch[1]); } catch { category = categoryMatch?.[1] || ''; }
  try { if (tagsMatch) tags = JSON.parse(tagsMatch[1]); } catch { tags = []; }

  return {
    file,
    filePath,
    name: name.trim(),
    normName: normalizeName(name),
    url: url.trim(),
    description: description.trim(),
    addedAt: addedAt || new Date().toISOString(),
    pricing,
    category,
    tags,
    content,
  };
}

function isOfficialUrl(url) {
  if (!url) return false;
  const newsDomains = [
    'techcrunch.com',
    'theverge.com',
    'the-decoder.com',
    'marktechpost.com',
    'arstechnica.com',
    'wired.com',
    'venturebeat.com',
    'technologyreview.com',
    'bensbites.com',
    'news.ycombinator.com',
    'google.com/search',
  ];
  try {
    const parsed = new URL(url);
    return !newsDomains.some((domain) => parsed.hostname.includes(domain));
  } catch {
    return false;
  }
}

function selectBestTool(group) {
  // Sort candidates:
  // 1. Prefer tools with official website URLs over news article URLs
  // 2. Prefer clean canonical filename without random hash suffix
  // 3. Fallback to earliest added date or richest description
  return [...group].sort((a, b) => {
    const aOfficial = isOfficialUrl(a.url);
    const bOfficial = isOfficialUrl(b.url);
    if (aOfficial && !bOfficial) return -1;
    if (!aOfficial && bOfficial) return 1;

    // Check if filename has 4-char random hash like -7glu.md or -vvpa.md
    const aHasHash = /-[a-z0-9]{4}\.md$/.test(a.file);
    const bHasHash = /-[a-z0-9]{4}\.md$/.test(b.file);
    if (!aHasHash && bHasHash) return -1;
    if (aHasHash && !bHasHash) return 1;

    // Prefer older timestamp
    const aTime = new Date(a.addedAt).getTime() || 0;
    const bTime = new Date(b.addedAt).getTime() || 0;
    return aTime - bTime;
  })[0];
}

async function main() {
  console.log('🔍 بدء عملية فحص وإزالة التكرارات من مجلد الأدوات...');
  const files = await fs.readdir(toolsDir);
  const tools = [];

  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    tools.push(await parseToolFile(file));
  }

  console.log(`📁 إجمالي ملفات الأدوات الحالية: ${tools.length} ملف`);

  const groups = new Map();
  for (const tool of tools) {
    let key = tool.normName;
    if (ALIASES[key]) key = ALIASES[key];

    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(tool);
  }

  let removedCount = 0;
  let duplicateGroupsCount = 0;

  for (const group of groups.values()) {
    if (group.length > 1) {
      duplicateGroupsCount++;
      const best = selectBestTool(group);
      console.log(`\n🔹 معالجة تكرار [${group[0].name}] (${group.length} ملفات):`);
      console.log(`   ✅ الإبقاء على: ${best.file} (الرابط: ${best.url})`);

      for (const candidate of group) {
        if (candidate.file !== best.file) {
          await fs.unlink(candidate.filePath);
          console.log(`   🗑️ حذف المكرر: ${candidate.file}`);
          removedCount++;
        }
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`✅ اكتمل التنظيف!`);
  console.log(`   - مجموعات التكرار المعالجة: ${duplicateGroupsCount}`);
  console.log(`   - الملفات المكررة المحذوفة: ${removedCount}`);
  console.log(`   - الأدوات الفريدة المتبقية: ${tools.length - removedCount}`);
  console.log(`========================================\n`);
}

main().catch((err) => {
  console.error('❌ خطأ أثناء إزالة التكرارات:', err);
  process.exit(1);
});
