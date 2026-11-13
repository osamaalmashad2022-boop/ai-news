---
title: "جوجل تطلق مكتبة TPU Sync مفتوحة المصدر لتسريع نقل ذاكرة الكاش في وحدات TPU"
summary: "أطلقت جوجل مكتبة TPU Sync المكتوبة بلغة C++ والمخصصة لنقل ذاكرة KV Cache والأوزان بين ذاكرة HBM والذاكرة الرئيسية والتخزين، مما يقلل وقت التأخير بنسبة تتجاوز 90%."
category: "البرمجة"
tags: ["Google","TPU Sync","مفتوح المصدر","TPU","C++"]
sourceName: "MarkTechPost"
sourceUrl: "https://www.marktechpost.com/2026/11/13/google-tpu-sync-kv-cache-transfer-library/"
publishedAt: "2026-11-13T10:32:26.000Z"
importance: 3
toolsMentioned: ["TPU Sync"]
---

### مميزات مكتبة TPU Sync
* **كفاءة النقل:** خفض زمن انتقال KV cache بنسبة تزيد عن 90% لنماذج MoE الضخمة.
* **دعم متعدد:** تعمل على الربط بين ذاكرة TPU HBM، وذاكرة النظام DRAM، ووسائط التخزين والشبكة.
