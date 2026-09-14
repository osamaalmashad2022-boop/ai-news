---
title: "باحثو Sakana AI يقدمون تقنية PC-ALM لتحديث الشبكات العصبية العميقة بديلة عن Backprop"
summary: "طوّر باحثون في Sakana AI طريقة خوارزمية جديدة تُدعى PC-ALM كبديل محلي لخوارزمية التمرير العكسي (Backpropagation). تتيح هذه التقنية تدريب شبكات عصبية عميقة تصل إلى 1000 طبقة بكفاءة عالية وبأداء قريب جداً من الطرق التقليدية."
category: "الأبحاث"
tags: ["Sakana AI","PC-ALM","Backpropagation","JAX","تعلم عميق"]
sourceName: "MarkTechPost"
sourceUrl: "https://www.marktechpost.com/2026/09/14/sakana-ai-researchers-introduce-pc-alm-a-layer-local-alternative-to-backpropagation-that-trains-1000-layer-networks/"
publishedAt: "2026-09-14T20:46:16.000Z"
importance: 3
toolsMentioned: ["PC-ALM"]
---

### آلية عمل PC-ALM
- تعتمد التقنية على **Augmented Lagrangian Predictive Coding** لتحديث أوزان كل طبقة بشكل محلي دون الحاجة لتجميد الشبكة والتمرير العكسي الشامل.
- تمكنت من تدريب شبكات عصبية متعددة الطبقات (MLPs) حتى **1000 طبقة** بفارق أداء لا يتعدى 2% عن التمرير العكسي التقليدي.
- أتاحت الشركة مرجعًا برمجياً مفتوح المصدر بلغة **JAX** وتحت رخصة MIT للباحثين.
