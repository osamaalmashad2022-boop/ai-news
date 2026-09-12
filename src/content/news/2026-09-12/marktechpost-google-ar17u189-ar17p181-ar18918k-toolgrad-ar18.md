---
title: "Google تررع إطار عمل ToolGrad لتوليد بيانات تدريب استخدام الأدوات"
summary: "طوّر باحثون من Google وجامعات يابانية إطار العمل ToolGrad الذي يعتمد على منهجية الإجابة أولاً لتوليد بيانات التدريب الخاصة باستدعاء أدوات الذكاء الاصطناعي بنسبة نجاح 99.8%."
category: "الأبحاث"
tags: ["ToolGrad","Google Research","Function Calling","بيانات التدريب"]
sourceName: "MarkTechPost"
sourceUrl: "https://www.marktechpost.com/2026/09/10/google-research-releases-toolgrad-answer-first-framework-hits-99-8-pass-rate-for-tool-use-data-generation/"
publishedAt: "2026-09-11T06:01:25.000Z"
importance: 3
toolsMentioned: ["ToolGrad"]
---

### توليد بيانات استخدام الأدوات بنهج عكسي
يقوم إطار العمل ToolGrad بإنشاء سلاسل استخدام الأدوات والتحقق منها عملياً أولاً، ثم صياغة استعلامات المستخدم المناسبة لها لاحقاً لتجنب إهدار الطاقة الحوسبية في المحاولات الفاشلة.

### نتائج الإطار:
- **نسبة النجاح:** حقق 99.8% في إنشاء مسارات أدوات دقيقة وقابلة للتنفيذ.
- **النماذج والبيانات:** تم إطلاق الشيفرة ونماذج Gemma-3 المدربة ومجموعة البيانات عبر Hugging Face ومستودع PyPI.
