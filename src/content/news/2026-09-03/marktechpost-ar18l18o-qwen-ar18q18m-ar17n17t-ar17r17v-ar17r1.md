---
title: "مطورو Qwen يطلقون أداة البحث المحلي الموحد zg (zvec-grep) مفتوحة المصدر"
summary: "أعلن فريق تطوير Qwen عن إطلاق أداة zg المفتوحة المصدر، وهي طبقة بحث محلي تجمع بين البحث الدلالي، وخوارزمية BM25، وأداة ripgrep في واجهة واحدة لتسهيل عمل المبرمجين والوكلاء البرمجيين."
category: "البرمجة"
tags: ["zg","zvec-grep","Qwen","Semantic Search","Coding Agents"]
sourceName: "MarkTechPost"
sourceUrl: "https://www.marktechpost.com/2026/09/02/qwen-developers-open-sources-zg-zvec-grep-a-local-first-search-layer-unifying-ripgrep-bm25-and-vector-search/"
publishedAt: "2026-09-02T23:48:47.000Z"
importance: 4
toolsMentioned: ["zg (zvec-grep)"]
---

### ثورة في أدوات البحث للمطورين
أطلق فريق مطوري Qwen أداة **zg (zvec-grep)** لحل مشكلة استهلاك الوكلاء البرمجيين لميزانياتهم في عمليات البحث المتكررة. وتتميز الأداة بالخصائص التالية:

* **واجهة موحدة:** تدمج الأداة البحث الدلالي (Semantic Search)، والبحث النصي الدقيق (BM25)، والبحث باستخدام التعبيرات النمطية (ripgrep) تحت واجهة واحدة.
* **أربعة مسارات للاسترجاع:** توفر الأداة خيارات متعددة تشمل البحث الهجين، والبحث النصي الصرف (--fts)، والبحث المتجهي الصرف (--vector)، والبحث المطابق (--rg) الذي لا يتطلب فهرسة مسبقة.
* **سهولة التثبيت:** تتوفر الأداة عبر مدير الحزم npm وتعمل على أنظمة macOS وLinux وWindows دون الحاجة لوجود وحدة معالجة رسومية (GPU).
