---
title: "تحديث PyTorch 2.15 يجلب تسريع FP8 ونماذج MoE لأجهزة ماك عبر واجهة MPS"
summary: "أعلن فريق PyTorch في Hugging Face عن تحسينات جذرية في دعم معالجات أبل سيليكون ضمن إصدار PyTorch 2.15، تشمل إضافة دعم دقة FP8 وزيادة سرعة فك تشفير نماذج MoE بنسبة تصل إلى 6.5 أضعاف."
category: "البرمجة"
tags: ["PyTorch","Apple Silicon","MPS","FP8","Hugging Face"]
sourceName: "Hugging Face"
sourceUrl: "https://huggingface.co/blog/mps-pytorch-2-15"
publishedAt: "2026-10-20T00:00:00.000Z"
importance: 3
toolsMentioned: []
---

### قفزة جديدة في أداء Mac الحوسبي
ركز مطورو واجهة Metal Performance Shaders (MPS) في Hugging Face على جعل أجهزة Mac منصة رائدة لتشغيل نماذج الذكاء الاصطناعي وتدريبها:

- **دعم دقة FP8:** إتاحة قيم `float8_e4m3fn` لخفض استهلاك الذاكرة إلى النصف مقارنة بـ BF16 مع تسريع ضرب المصفوفات.
- **تسريع نماذج MoE:** تسريع توليد الرموز لنماذج مثل Qwen3.6-35B-A3B من 9.4 إلى 61.3 رمزاً/ثانية على شريحة M3 Ultra بفضل مسارات النواة المخصصة وتقليل مزامنة GPU-CPU.
- **أنوية Metal متخصصة:** استبدال أجزاء من MPSGraph بأنوية مخصصة لمعالجة متطلبات الصوت والفيديو والتدريب بكفاءة أعلى.
