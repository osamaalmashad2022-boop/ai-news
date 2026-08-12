---
title: "شاومي تطلق إطار PROVE ومقاييس مفتوحة المصدر لتقييم دقة إزالة العناصر من الفيديو"
summary: "أصدر فريق MiLM Plus من شركة شاومي إطار PROVE المفتوح المصدر والمخصص لتقييم جودة إزالة الكائنات والتعديلات في الفيديو، معالجةً القصور في مقاييس التقييم التقليدية من خلال قياس الاتساق المكاني والزمني بدون الحاجة لمقارنة مرجع أصلي."
category: "توليد الصور والفيديو"
tags: ["Xiaomi","PROVE","PyTorch","Video Editing"]
sourceName: "MarkTechPost"
sourceUrl: "https://www.marktechpost.com/2026/08/11/xiaomis-milm-plus-releases-prove-perception-aligned-object-removal-metrics-rc-s-and-rc-t-with-a-real-world-video-benchmark/"
publishedAt: "2026-08-12T05:05:52.000Z"
importance: 3
toolsMentioned: ["PROVE"]
---

### مقاييس تقييم جديدة
* يتضمن الإطار مقياس RC-S للاتساق المكاني ومقياس RC-T للاتساق الزمني.
* يعتمد الإطار على أوزان DINOv2 ويقيّم منطقة التعديل محلياً دون الحاجة لفيديو مرجعي.

### الجاهزية للتطوير
* يتوفر المشروع كمستودع PyTorch تحت ترخيص Apache 2.0 ويمكن تشغيله بسرعة 134.6 ميلي ثانية لكل إطار على بطاقة RTX 4090.
