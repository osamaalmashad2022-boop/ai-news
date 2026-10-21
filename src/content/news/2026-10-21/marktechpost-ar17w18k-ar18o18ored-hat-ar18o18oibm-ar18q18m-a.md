---
title: "جوجل وRed Hat وIBM يطلقون حزمة llm-d 1.0 لتوزيع وتشغيل النماذج اللغوية"
summary: "أطلقت شركات Google وRed Hat وIBM مشروع llm-d 1.0 مفتوح المصدر المخصص لتوزيع وتشغيل استدلال النماذج اللغوية الكبيرة على بيئات كوبرنيتيس ومجموعات معالجات TPU وGPU."
category: "البرمجة"
tags: ["Google Cloud","IBM","Red Hat","llm-d","Kubernetes","Open Source"]
sourceName: "MarkTechPost"
sourceUrl: "https://www.marktechpost.com/2026/10/20/llm-d-1-0-open-source-distributed-inference-stack/"
publishedAt: "2026-10-21T04:33:40.000Z"
importance: 4
toolsMentioned: ["llm-d"]
---

### بنية تحتية مفتوحة المصدر للاستدلال الموزع

أصدر تحالف تقني يضم Google وRed Hat وIBM الإصدار الأول من مكدس **llm-d 1.0**، وهو إطار عمل سحابي مخصص لإدارة وتوجيه استدلال النماذج اللغوية الكبيرة.

- **إدارة الموارد المتعددة:** يوفر النظام توجيهاً ذكياً يستند إلى الذاكرة التخزينية المؤقتة (cache-aware routing) ويدعم التعددية للمستأجرين (multi-tenant flow control).
- **تكامل واسع النطاق:** يتوافق المكدس المفتوح مع أطر عمل شهيرة مثل vLLM وSGLang ويدعم أساطيل وحدات معالجة الرسومات (GPUs) ووحدات معالجة الموترات (TPUs).
- **استقرار مستمر:** يتيح النظام الترقية بدون توقف عن العمل (zero-downtime upgrades) لتسهيل تشغيل النماذج الضخمة في الإنتاج على Kubernetes.
