---
title: "ميتا تطلق نموذج Muse Voice Transcribe للتعرف الفوري على الصوت وتحديد هوية المتحدثين"
summary: "أطلقت مختبرات الذكاء الاصطناعي الفائق في ميتا نموذج Muse Voice Transcribe، وهو نموذج موحد لمعالجة الصوت في الوقت الفعلي يقوم بالنسخ النصي، وتحديد هوية المتحدثين، واكتشاف نهاية الكلام في ممر واحد."
category: "الصوت"
tags: ["Muse Voice Transcribe","Meta AI","Speech-to-Text","Diarization","Real-time Audio"]
sourceName: "MarkTechPost"
sourceUrl: "https://www.marktechpost.com/2026/09/01/meta-superintelligence-labs-releases-muse-voice-transcribe-one-real-time-model-for-streaming-asr-diarization-and-endpointing/"
publishedAt: "2026-09-02T05:37:12.000Z"
importance: 4
toolsMentioned: ["Muse Voice Transcribe"]
---

### دمج المهام لتقليل زمن الاستجابة
بدلاً من الأنظمة التقليدية التي تدمج ثلاثة نماذج منفصلة لمعالجة الصوت، نجحت ميتا في دمج هذه المهام في نموذج واحد ذاتي الارتباط (Autoregressive):

* **المهام الثلاثة:** يقوم النموذج بالنسخ النصي الفوري (Streaming ASR)، وتحديد هوية المتحدثين لأكثر من 20 متحدثاً (Diarization)، واكتشاف توقف المستخدم عن الكلام (Endpointing).
* **آلية العمل:** يعالج النموذج الصوت في قطع صغيرة تبلغ مدتها 80 مللي ثانية، ويقرر إما الاستمرار في الاستماع أو إصدار رمز نصي.
* **التوفر والأسعار:** يتوفر النموذج كواجهة برمجة تطبيقات سحابية بسعر 3 دولارات لكل 1000 دقيقة صوتية، وهو يشغل حالياً ميزات الإملاء في تطبيق Meta AI على الماك.
