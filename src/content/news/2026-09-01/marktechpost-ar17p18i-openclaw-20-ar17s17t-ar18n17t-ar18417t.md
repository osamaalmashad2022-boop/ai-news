---
title: "إطلاق OpenClaw 2.0 بإعادة هيكلة شاملة للمستعرض وواجهة التحكم"
summary: "أطلق فريق OpenClaw التحديث الرئيسي 2.0 الذي يعيد كتابة عملية الإعداد ويسرع واجهة التحكم إلى 575 ميلي ثانية، مع نقل الجلسات والتفريغات النصية إلى قاعدة بيانات SQLite ودعم الجلسات السحابية المشتركة."
category: "البرمجة"
tags: ["OpenClaw","OpenClaw 2.0","البرمجة","أدوات المطورين","LLM Local Setup"]
sourceName: "MarkTechPost"
sourceUrl: "https://www.marktechpost.com/2026/08/30/openclaw-releases-openclaw-2-0-guided-model-setup-575-ms-control-ui-startup-and-one-trust-boundary-per-gateway/"
publishedAt: "2026-08-31T05:04:10.000Z"
importance: 4
toolsMentioned: ["OpenClaw 2.0"]
---

### تحديثات شاسعة في OpenClaw 2.0

أصدر فريق OpenClaw إصداره الجديد OpenClaw 2.0 بعد فترة تطوير مكثفة تضمنت إعادة تشكيل النظام البنائي للأداة.

* **إعداد موجه وذكي:** يتعرف نظام الإعداد الجديد آلياً على مفاتيح البرمجة وتطبيقات الذكاء الاصطناعي المتاحة في الجهاز مثل Ollama وLM Studio وClaude CLI.
* **واجهة تحكم أسرع:** انخفض زمن تشغيل واجهة التحكم بالمتصفح إلى 575 ميلي ثانية، مع إدراج المحرر ولوحة التغييرات Git والمستعرض المدمج بجانب المحادثة.
* **دعم التشغيل المحلي:** تم استبدال node-llama-cpp بخادم llama-server وتعيين Gemma 4 كنموذج افتراضي محلي.
