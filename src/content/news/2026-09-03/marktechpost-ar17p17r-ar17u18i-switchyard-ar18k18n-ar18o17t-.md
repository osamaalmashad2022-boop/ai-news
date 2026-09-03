---
title: "إنفيديا تطلق Switchyard لتوجيه وترجمة حركة مرور نماذج اللغة الكبيرة"
summary: "كشفت شركة إنفيديا عن أداة Switchyard، وهي عبارة عن بروكسي ومكتبة برمجية بلغة Rust تتيح توجيه الطلبات وترجمتها بين واجهات برمجة التطبيقات الخاصة بـ OpenAI وAnthropic بسلاسة."
category: "البرمجة"
tags: ["Switchyard","NVIDIA","API Translation","LLM Proxy","Rust"]
sourceName: "MarkTechPost"
sourceUrl: "https://www.marktechpost.com/2026/09/02/nvidia-releases-switchyard-rust-proxy-llm-traffic-openai-anthropic-api-translation/"
publishedAt: "2026-09-02T18:05:52.000Z"
importance: 4
toolsMentioned: ["Switchyard"]
---

### حل مشكلة توافق واجهات برمجة التطبيقات
تواجه الفرق التي تقوم بتشغيل الوكلاء البرمجيين عقبة اختلاف واجهات برمجة التطبيقات (APIs) بين الشركات المزودة للخدمة. تقدم إنفيديا أداة **Switchyard** كحل لهذه المشكلة:

* **ترجمة فورية:** يقوم البروكسي بفك تشفير الطلبات الواردة وتحويلها إلى صيغ محايدة، ثم إعادة ترميزها لتتوافق مع الواجهة المستهدفة (مثل تحويل طلبات Anthropic Messages إلى OpenAI Chat Completions والعكس).
* **دعم منصات متعددة:** يتيح توجيه الطلبات عبر vLLM أو NVIDIA NIM أو Ollama دون الحاجة لإعادة كتابة كود الوكيل البرمجي.
* **حالة المشروع:** تم إصدار الأداة تحت رخصة Apache 2.0 وهي متاحة للتقييم والتجربة، مع تنبيه إنفيديا بأنها لا تزال في مرحلة تجريبية مبكرة (pre-alpha).
