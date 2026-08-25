---
title: "رقاقة Jalapeño الأولى من OpenAI تتفوق على رقاقات إنفيديا في اختبارات الاستدلال"
summary: "كشفت شركة OpenAI خلال مؤتمر Hot Chips عن نتائج الأداء الأولى لرقاقة الاستدلال المخصصة Jalapeño، محققة تفوقاً ملحوظاً على رقاقات إنفيديا Blackwell وRubin من حيث كثافة العمل لكل واط وسرعة الاستجابة."
category: "الأبحاث"
tags: ["OpenAI","Jalapeño","Nvidia","Hardware","Inference"]
sourceName: "The Decoder"
sourceUrl: "https://the-decoder.com/openais-first-custom-chip-jalapeno-reportedly-beats-nvidias-blackwell-and-rubin-in-inference-benchmarks/"
publishedAt: "2026-08-25T18:00:50.000Z"
importance: 5
toolsMentioned: ["Jalapeño"]
---

### تفاصيل أداء الرقاقة الجديدة
- **كفاءة الطاقة:** سجلت الرقاقة زيادة في العمل المحقق لكل واط بنسبة تتراوح بين 1.5 إلى 1.9 مرة مقارنة بأفضل الأنظمة التجارية المتاحة.
- **إنقاص زمن الاستجابة:** حققت الرقاقة انخفاضاً في زمن الاستجابة الكلي (Latency) بمقدار 1.7 إلى 3.6 مرة.
- **مهام التفاعل المباشر:** أظهرت الاختبارات أداءً أعلى بنسبة 2.1 إلى 4.1 مرة في بيئات الاستخدام التفاعلي.

### النماذج المtested والمستهدفة
- شملت الاختبارات الموثقة بواسطة منصة SemiAnalysis نماذج مثل `GPT-OSS 120B` و`Deepseek R1 670B` و`Kimi K2.5 1T`.
- بلغت السرعة على نموذج `GPT-OSS` حوالي 1400 رمز في الثانية لكل مستخدم.
- تتميز الرقاقة بكونها مسرّع استدلال عام للنماذج اللغوية الكبيرة وليست مخصصة فقط لنماذج OpenAI.
