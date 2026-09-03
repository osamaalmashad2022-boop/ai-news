---
title: "بيربليكسيتي تطلق محرك التشغيل المحلي Lily مفتوح المصدر لأجهزة الماك"
summary: "أعلنت شركة Perplexity عن إطلاق محرك التشغيل المحلي Lily مفتوح المصدر، والمصمم خصيصاً لتشغيل نموذج Qwen3.6-35B-A3B على أجهزة Apple Silicon بكفاءة عالية ودون الحاجة لـ PyTorch أو MLX."
category: "أدوات وتطبيقات"
tags: ["Lily","Perplexity","Apple Silicon","Rust","Local Inference"]
sourceName: "MarkTechPost"
sourceUrl: "https://www.marktechpost.com/2026/09/02/perplexity-open-sources-lily-a-rust-metal-inference-engine-for-qwen3-6-35b-a3b-on-apple-silicon/"
publishedAt: "2026-09-03T06:57:07.000Z"
importance: 4
toolsMentioned: ["Lily"]
---

### تفاصيل الإطلاق
أطلقت شركة **Perplexity** محرك التشغيل المحلي **Lily**، وهو المحرك الذي يقف وراء ميزة الحوسبة الهجينة (Hybrid Compute) في حواسيبها. يتميز المحرك بالآتي:

* **بنية برمجية مخصصة:** يعتمد على طبقة مكتوبة بلغة **Rust** لتحميل نقاط الفحص وإدارة حلقة التوليد، مع واجهة برمجة تطبيقات متوافقة مع OpenAI لبث الرموز (Tokens).
* **أداء فائق:** يعتمد على نوى **Metal** مكتوبة يدوياً لتنفيذ النموذج مباشرة على العتاد دون الحاجة لمرور البيانات عبر PyTorch أو MLX.
* **متطلبات التشغيل:** يتطلب تشغيل النموذج (بحجم 19.4 جيجابايت لنسخة 4-bit) جهاز ماك بمعالج Apple Silicon وذاكرة موحدة لا تقل عن 24 جيجابايت (ويُفضل 32 جيجابايت).
