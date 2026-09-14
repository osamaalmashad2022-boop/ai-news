---
title: "بحث جديد من جامعة برينستون يقترح معمارية RLT لتحسين ذاكرة استجابة النماذج اللغوية"
summary: "نشر باحث من جامعة برينستون ورقة تقنية تستعرض معمارية Recurrent Looped Transformer (RLT)، والتي تقوم بربط الحالة الأخيرة للمفكك عبر الكلمات المتتالية لتجاوز مشكلة انقطاع السياق بين الرموز اللغوية."
category: "الأبحاث"
tags: ["Princeton","RLT","Transformers","LLM","AI Research"]
sourceName: "MarkTechPost"
sourceUrl: "https://www.marktechpost.com/2026/09/13/a-princeton-researcher-proposes-recurrent-looped-transformer-rlt/"
publishedAt: "2026-09-13T17:02:26.000Z"
importance: 3
toolsMentioned: []
---

### نظرة عامة على البحث

اقترح الباحث **يفان تشانغ** من جامعة برينستون معمارية جديدة تُدعى **Recurrent Looped Transformer (RLT)** تهدف إلى معالجة طريقة نقل المعلومات بين الطبقات المختلفة في النماذج اللغوية القائمة على المفكك (Decoder-only).

### تفاصيل المعمارية المقترحة

- **ربط الحالات:** بدلاً من الاعتماد فقط على ذاكرة التنبيه (Attention Cache)، تقوم المعمارية بنقل الحالة المخفية الأخيرة للمفكك إلى الرمز التالي بشكل متكرر.
- **دمج الترميز والتكرار:** تجمع بين ترميز سببي (Causal Encoder) ومفكك تكراري (Recurrent Decoder) لضمان استمرارية السياق في المهام الطويلة.
