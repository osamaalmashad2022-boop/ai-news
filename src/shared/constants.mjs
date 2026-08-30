/**
 * constants.mjs — مصدر موحد للثوابت المشتركة (التصنيفات، نماذج التسعير، إلخ)
 * يُستخدم في كل من Astro components و scripts و content schema
 */

export const CATEGORIES = [
  'نماذج لغوية',
  'توليد الصور والفيديو',
  'الصوت',
  'البرمجة',
  'الأبحاث',
  'الأعمال والتمويل',
  'السياسات والأخلاقيات',
  'أدوات وتطبيقات',
];

export const VALID_PRICING = ['free', 'freemium', 'paid'];
