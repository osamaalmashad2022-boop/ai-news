---
title: "ثغرة في العلامة المائية لنماذج Claude الأقدم تتيح تجاوز التتبع عبر معلمات المعاينة"
summary: "وسعت Anthropic تضمين علامتها المائية في أربعة نماذج لغوية إضافية، إلا أن تعديل معلمات أخذ العينات يسمح لمطوري واجهات البرمجة بتفادي العلامة في نموذجين قديمين."
category: "السياسات والأخلاقيات"
tags: ["Anthropic","Claude","Watermarking","AI Safety","API"]
sourceName: "The Decoder"
sourceUrl: "https://the-decoder.com/anthropics-watermark-rollout-leaves-a-loophole-on-two-older-claude-models/"
publishedAt: "2026-10-31T19:20:55.000Z"
importance: 3
toolsMentioned: []
---

### توسيع نطاق العلامات المائية
أرسلت شركة Anthropic إشعاراً لعملاء واجهة البرمجة (API) يفيد بإضافة العلامة المائية إلى نماذج Claude Mythos 5 وClaude Opus 4.7 وClaude Opus 4.6 وClaude Sonnet 4.6 لتأكيد أصالة النصوص المكتوبة بالذكاء الاصطناعي دون التأثير على المعنى أو السرعة.

### تفاصيل الثغرة في النماذج السابقة
- **النماذج المتأثرة:** تنطبق العلامة المائية على نموذجي Claude Opus 4.6 وClaude Sonnet 4.6 فقط في حال بقاء إعدادات أخذ العينات الافتراضية كما هي دون تعديل.
- **تجاوز العلامة:** يمكن للمطورين تجاوز تضمين العلامة بمجرد تعديل بسيط على إحدى معلمات: درجة الحرارة (temperature) أو top_p أو top_k.
- **النماذج الحديثة:** يبدو أن التجاوز لا ينطبق على Claude Mythos 5 أو Claude Opus 4.7 حيث تبقى العلامة مفعلة بصورة مستمرة.
