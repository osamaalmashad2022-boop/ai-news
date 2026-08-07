---
title: "كلودفلير تقدم متصفح الويب Kitesurf المخصص لوكلاء الذكاء الاصطناعي"
summary: "أطلقت شركة Cloudflare متصفح Kitesurf المصمم خصيصاً لوكلاء الذكاء الاصطناعي، والذي يعمل بالكامل في عزلات V8 على سحابتها دون الحاجة لمحرك كروميوم. يتخلص المتصفح من العناصر التقليدية الموجهة للبشر مثل علامات التبويب والإضافات لصالح ميزات تخدم الوكلاء."
category: "أدوات وتطبيقات"
tags: ["Cloudflare","Kitesurf","متصفح","وكلاء الذكاء الاصطناعي"]
sourceName: "MarkTechPost"
sourceUrl: "https://www.marktechpost.com/2026/08/06/cloudflare-introduces-kitesurf-an-agent-first-web-browser-that-runs-entirely-in-v8-isolates-on-cloudflare-workers/"
publishedAt: "2026-08-06T19:35:32.000Z"
importance: 4
toolsMentioned: ["Kitesurf"]
---

### خصائص متصفح Kitesurf
- **البنية التقنية:** يعمل بالكامل داخل عزلات V8 على Cloudflare Workers باستخدام مكونات لغة رست (Rust).
- **الكفاءة:** يستهلك طاقة معالجة أقل بـ 3.1 إلى 3.8 مرة وذاكرة أقل بـ 4.7 إلى 7 مرات مقارنة بمتصفح كروميوم.
- **التوافق:** يتوافق مع أدوات مثل Puppeteer و Playwright و MCP عبر إضافة وسيط بسيط.
