---
title: "إنفيديا تطلق موجه الذكاء الاصطناعي الشخصي (PAIR) لمشاركة معالجة النماذج عبر أجهزة الشبكة المحلية"
summary: "أطلقت شركة إنفيديا أداة PAIR البرمجية مفتوحة المصدر، والتي تعمل كموجه استنتاج افتراضي يوزع طلبات نماذج الذكاء الاصطناعي المحلية عبر الأجهزة المتصلة بالشبكة مثل بطاقات RTX وأجهزة Mac ومحطات DGX Spark."
category: "البرمجة"
tags: ["NVIDIA","PAIR","Inference Router","Local AI","Open Source"]
sourceName: "MarkTechPost"
sourceUrl: "https://www.marktechpost.com/2026/09/04/nvidia-releases-personal-ai-router-pair-an-open-source-virtual-inference-router-that-distributes-local-ai-requests-across-rtx-dgx-spark-and-mac-nodes/"
publishedAt: "2026-09-05T03:52:23.000Z"
importance: 4
toolsMentioned: ["NVIDIA Personal AI Router (PAIR)"]
---

### حل اختناقات الاستنتاج المحلي

تستهدف أداة NVIDIA Personal AI Router (PAIR) حل مشكلة ازدحام طلبات الاستنتاج الناتجة عن تدفقات العمل متعددة الوكلاء، حيث تقوم بتوزيع الأحمال البرمجية الذاتية على الأجهزة الخاملة والمتصلة بالشبكة المحلية نفسها.

### المزايا التقنية

- **توافق كامل:** تعمل كوكيل (Proxy) للواجهات البرمجية المتوافقة مع Ollama وLM Studio وOpenAI بدون الحاجة لتعديل كود التطبيقات.
- **ترخيص مفتوح المصدر:** تتوفر برخصة Apache 2.0 وتدعم أنظمة Windows وmacOS وLinux.
- **خصوصية فائقة:** تتم عمليات التوجيه والمعالجة بالكامل داخل الشبكة المحلية دون الحاجة لاتصال بالإنترنت إلا لتنزيل النماذج.
