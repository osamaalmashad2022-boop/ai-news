/**
 * cleanup.mjs — حذف الأخبار القديمة تلقائياً
 * يحذف مجلدات الأخبار الأقدم من عدد أيام محدد
 * Usage: node scripts/cleanup.mjs [--days=90] [--dry-run]
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const daysArg = args.find((a) => a.startsWith('--days='));
const maxDays = daysArg ? parseInt(daysArg.split('=')[1]) : 90;

const NEWS_DIR = path.join(process.cwd(), 'src', 'content', 'news');

async function main() {
  console.log(`🧹 تنظيف الأخبار الأقدم من ${maxDays} يوم${isDryRun ? ' (وضع التجربة)' : ''}...\n`);

  const now = new Date();
  const cutoff = new Date(now.getTime() - maxDays * 24 * 60 * 60 * 1000);
  const cutoffStr = cutoff.toISOString().split('T')[0];

  let deletedDirs = 0;
  let deletedFiles = 0;

  try {
    const entries = await fs.readdir(NEWS_DIR, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      // Folder names are dates like "2026-07-22"
      const folderDate = entry.name;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(folderDate)) continue;

      if (folderDate < cutoffStr) {
        const folderPath = path.join(NEWS_DIR, folderDate);

        // Count files
        const files = await fs.readdir(folderPath);
        const fileCount = files.filter((f) => f.endsWith('.md')).length;

        if (isDryRun) {
          console.log(`  📁 [سيُحذف] ${folderDate}/ (${fileCount} ملف)`);
        } else {
          await fs.rm(folderPath, { recursive: true, force: true });
          console.log(`  🗑️ تم حذف: ${folderDate}/ (${fileCount} ملف)`);
        }

        deletedDirs++;
        deletedFiles += fileCount;
      }
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('ℹ️ مجلد الأخبار غير موجود.');
      return;
    }
    throw err;
  }

  if (deletedDirs === 0) {
    console.log('✅ لا توجد أخبار قديمة للحذف.');
  } else {
    console.log(`\n🎉 ${isDryRun ? 'سيتم حذف' : 'تم حذف'}: ${deletedDirs} مجلد (${deletedFiles} ملف)`);
  }
}

main().catch((err) => {
  console.error('❌ خطأ:', err);
  process.exit(1);
});
