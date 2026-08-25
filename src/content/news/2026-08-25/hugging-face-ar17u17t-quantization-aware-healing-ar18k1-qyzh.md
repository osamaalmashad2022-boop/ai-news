---
title: "تقنية Quantization-Aware Healing لترميم النماذج المضغوطة بـ 4-bit متفوقة على أصلها"
summary: "ابتكر باحثون تقنية جديدة تُدعى Quantization-Aware Healing لتصحيح النماذج اللغوية بعد ضغطها وتقليل أوزانها إلى 4 بت. وأثبتت التجارب تفوق نموذج مضغوط بحجم 60B على نسخته الأصلية ذات الدقة الكاملة في عدة اختبارات benchmark."
category: "الأبحاث"
tags: ["Quantization","QAH","Model Compression","AI Research","Hugging Face"]
sourceName: "Hugging Face"
sourceUrl: "https://huggingface.co/blog/MultiverseComputingCAI/quantization-aware-healing"
publishedAt: "2026-08-25T11:39:24.000Z"
importance: 3
toolsMentioned: ["Quantization-Aware Healing"]
---

### ابتكار تقنية Quantization-Aware Healing (QAH)

قدمت شركة **Multiverse Computing** ورقة بحثية حول تقنية جديدة تهدف لتجاوز مشكلة فقدان الدقة عند ضغط النماذج الضخمة.

* **حل مشكلة الضغط:** معالجة التدهور الذي يصيب قدرات التفكير والبرمجة عند تحويل النماذج إلى 4 بت.
* **تطبيق عملي:** عُولج نموذج GPT-OSS 120B بعد ضغطه إلى 60B بتنسيق MXFP4 باستخدام تقنية QAH.
* **نتائج متقدمة:** تفوق النموذج المضغوط ذو الـ 4-bit على النسخة الأصلية ذات الدقة الكاملة (bfloat16) في 7 من أصل 9 اختبارات القياسية مع تقليل التكلفة الحسابية.
