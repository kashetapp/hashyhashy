import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PasswordHasher } from "@/components/PasswordHasher";
import { translations, type Language } from "@/lib/i18n";

function App() {
  const [lang, setLang] = useState<Language>("ar");
  const [dark, setDark] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  const t = translations[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  const resetApp = () => setResetKey((k) => k + 1);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-bold font-mono tracking-tight text-primary"
          >
            #️⃣
          </motion.span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent"
            >
              {t.language}
            </button>
            <button
              onClick={() => setDark(!dark)}
              className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent"
            >
              {dark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      <main className="py-10 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 px-4 text-center"
        >
          <h1
            onClick={resetApp}
            className="mb-2 cursor-pointer text-3xl font-extrabold tracking-tight text-foreground transition-colors hover:text-primary md:text-4xl"
          >
            {t.title}
          </h1>
          <p className="text-base text-muted-foreground">{t.subtitle}</p>
        </motion.div>

        <PasswordHasher key={resetKey} lang={lang} />
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        {lang === "ar"
          ? "تم بناء هذه الأداة بعناية لحماية خصوصيتك"
          : "Built with care to protect your privacy"}
      </footer>
    </div>
  );
}

export default App;
