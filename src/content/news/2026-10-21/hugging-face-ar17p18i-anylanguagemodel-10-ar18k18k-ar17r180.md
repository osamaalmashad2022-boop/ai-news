---
title: "إطلاق AnyLanguageModel 1.0 لتشغيل النماذج اللغوية محلياً وسحابياً على أجهزة آبل"
summary: "أعلنت منصة Hugging Face عن الإصدار الرسمي 1.0 من حزمة AnyLanguageModel ومكتبات Swift المرافقة، مما يتيح لمطوري تطبيقات آبل التبديل السهل بين النماذج المحلية والسحابية وتوفير مزايا متقدمة مثل استدعاء الأدوات."
category: "البرمجة"
tags: ["AnyLanguageModel","Apple","Swift","Hugging Face","تطوير التطبيقات"]
sourceName: "Hugging Face"
sourceUrl: "https://huggingface.co/blog/anylanguagemodel-1-0"
publishedAt: "2026-10-20T00:00:00.000Z"
importance: 3
toolsMentioned: ["AnyLanguageModel","swift-huggingface","swift-xet"]
---

### بديل مرن لإطار عمل Foundation Models من آبل
أطلقت منصة Hugging Face الإصدار المستقر **AnyLanguageModel 1.0**، ليكون بديلاً مباشراً ومرناً لمطوري تطبيقات macOS وiOS للربط مع مختلف النماذج وموفري الاستدلال بسهولة عبر واجهة برمجية موحدة.

### جديد الإصدار 1.0
- **دعم استدعاء الأدوات (Tool Calling)** وتوليد المخرجات الموجهة وتضمين الصور في المطالبات.
- **دعم بيئات تشغيل متعددة**: التوافق مع نماذج النظام المحلية، والنماذج مفتوحة المصدر عبر llama.cpp وMLX وCore ML، بالإضافة إلى مزودي الاستدلال السحابي.
