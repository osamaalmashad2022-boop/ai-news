---
title: "إنفيديا تطلق مبادرة 'CUDA Rust' لتطوير برمجيات المعالجة الرسومية بلغة رستم"
summary: "كشفت إنفيديا عن مبادرة CUDA Rust لتكون لغة Rust خياراً رئيسياً في كتابة نوى المعالجة الرسومية (GPU Kernels)، وذلك من خلال مشروعي cutile-rs وcuda-oxide مفتوحي المصدر."
category: "البرمجة"
tags: ["NVIDIA","CUDA","Rust","GPU"]
sourceName: "MarkTechPost"
sourceUrl: "https://www.marktechpost.com/2026/09/08/nvidia-announces-cuda-rust-with-cuda-oxide-simt-and-cutile-rs-tile-for-compile-time-safe-gpu-kernels/"
publishedAt: "2026-09-08T19:51:54.000Z"
importance: 4
toolsMentioned: ["CUDA Rust","cutile-rs","cuda-oxide"]
---

### بيئة تطوير آمنة وعالية الأداء
تهدف إنفيديا عبر هذه الخطوة إلى الاستفادة من قواعد الملكية وإدارة الذاكرة الصارمة في لغة Rust للقضاء على أخطاء الذاكرة والوصول المزدوج (Aliasing) أثناء مرحلة التجميع البرمجي.

### المساران البرمجيان
- **cutile-rs:** يعتمد على نموذج Tile البرمجي لإدارة الذاكرة والصفائف، وهو متاح حالياً عبر crates.io ويعمل على نسخة Rust 1.89+.
- **cuda-oxide:** يعتمد على نموذج SIMT التقليدي المتبع في CUDA C++ لبناء النوى البرمجية بالتحكم المباشر في خيوط المعالجة.
