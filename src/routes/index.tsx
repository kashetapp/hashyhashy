import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PasswordHasher } from "@/components/PasswordHasher";
import { translations, type Language } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Secure Password Hasher — تشفير كلمات المرور" },
      {
        name: "description",
        content:
          "Hash passwords securely in your browser using bcrypt, SHA-256, or Argon2. Fully client-side, no data sent anywhere.",
      },
    ],
  }),
});

function Index() {
  const [lang, setLang] = useState<Language>("ar");
  const [dark, setDark] = useState(true);
  const t = translations[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-bold text-primary font-mono tracking-tight"
          >
            #️⃣
          </motion.span>
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
            >
              {t.language}
            </button>
            {/* Theme toggle */}
            <button
              onClick={() => setDark(!dark)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
            >
              {dark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="py-10 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 px-4"
        >
          <h1
            onClick={resetApp}
            className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2 cursor-pointer hover:text-primary transition-colors"
          >
            {t.title}
          </h1>
          <p className="text-muted-foreground text-base">{t.subtitle}</p>
        </motion.div>
        <PasswordHasher lang={lang} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        {lang === "ar"
          ? "تم بناء هذه الأداة بعناية لحماية خصوصيتك"
          : "Built with care to protect your privacy"}
      </footer>
    </div>
  );
}
