---
title: "اكتشاف دودة برمجية تنتشر عبر مستندات Word لتخترق مساعد Microsoft Copilot"
summary: "كشف باحث أمني عن ثغرة هجومية تتيح لـ دودة برمجية الانتشار الذاتي عبر مساعد Microsoft Copilot في برنامج Word، باستغلال أوامر نصية مخفية بالنص الأبيض تجبر المساعد على نسخ الشفرة الخبيثة للملفات الجديدة."
category: "السياسات والأخلاقيات"
tags: ["الأمن السيبراني","Microsoft Copilot","اختراق","Word"]
sourceName: "The Decoder"
sourceUrl: "https://the-decoder.com/a-security-researcher-built-a-self-spreading-worm-that-hides-inside-word-docs-and-hijacks-microsoft-copilot/"
publishedAt: "2026-08-01T13:51:57.000Z"
importance: 4
toolsMentioned: ["Microsoft Copilot"]
---

### آلية الهجوم
- يتم إخفاء التعليمات البرمجية الخبيثة باستخدام خط أبيض صغير جداً داخل المستند.
- يقرأ Copilot النص المخفي أثناء المعالجة وينفذ الأوامر دون علم المستخدم.
- ينتقل التهديد تلقائياً إلى المستندات والتقارير الجديدة المنسوخة من الملف المصاب.
