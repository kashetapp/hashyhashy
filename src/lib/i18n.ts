export type Language = "ar" | "en";

export const translations = {
  ar: {
    title: "تشفير كلمات المرور",
    subtitle: "أداة آمنة لتشفير كلمات المرور",
    passwordLabel: "كلمة المرور",
    passwordPlaceholder: "أدخل كلمة المرور هنا...",
    algorithmLabel: "خوارزمية التشفير",
    hashButton: "تشفير كلمة المرور",
    hashing: "جاري التشفير...",
    resultLabel: "النتيجة المشفرة",
    copyButton: "نسخ",
    copied: "تم النسخ!",
    securityMessage:
      "يتم تشفير كلمة المرور الخاصة بك باستخدام خوارزميات معيارية صناعية. تتم جميع العمليات محلياً في متصفحك، لذلك لا يتم نقل بياناتك أو تخزينها في أي مكان. لا يمكن لأحد رؤية أو نسخ كلمة المرور الخاصة بك إلا إذا اخترت مشاركة النتيجة.",
    emptyError: "يرجى إدخال كلمة المرور",
    strengthLabel: "قوة كلمة المرور",
    strengthWeak: "ضعيفة",
    strengthFair: "مقبولة",
    strengthGood: "جيدة",
    strengthStrong: "قوية",
    strengthExcellent: "ممتازة",
    language: "English",
    theme: "المظهر",
    light: "فاتح",
    dark: "داكن",
    privacyBadge: "🔒 معالجة محلية بالكامل",
    startOver: "ابدأ من جديد",
  },
  en: {
    title: "Secure Password Hasher",
    subtitle: "Hash passwords securely in your browser",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password here...",
    algorithmLabel: "Hashing Algorithm",
    hashButton: "Hash Password",
    hashing: "Hashing...",
    resultLabel: "Hashed Result",
    copyButton: "Copy",
    copied: "Copied!",
    securityMessage:
      "Your password is hashed securely using industry-standard algorithms. All processing happens locally in your browser, so your data is never transmitted or stored anywhere. No one can see or copy your password unless you choose to share the result.",
    emptyError: "Please enter a password",
    strengthLabel: "Password Strength",
    strengthWeak: "Weak",
    strengthFair: "Fair",
    strengthGood: "Good",
    strengthStrong: "Strong",
    strengthExcellent: "Excellent",
    language: "العربية",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    privacyBadge: "🔒 Fully Local Processing",
  },
} as const;

export function getStrength(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return Math.min(score, 5);
}

export function getStrengthLabel(strength: number, lang: Language): string {
  const t = translations[lang];
  const labels = [t.strengthWeak, t.strengthWeak, t.strengthFair, t.strengthGood, t.strengthStrong, t.strengthExcellent];
  return labels[strength] || t.strengthWeak;
}

export function getStrengthColor(strength: number): string {
  const colors = [
    "bg-destructive",
    "bg-destructive",
    "bg-warning",
    "bg-warning",
    "bg-success",
    "bg-success",
  ];
  return colors[strength] || "bg-destructive";
}
