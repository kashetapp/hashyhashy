import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { translations, getStrength, getStrengthLabel, getStrengthColor, type Language } from "@/lib/i18n";
import { hashPassword, type Algorithm } from "@/lib/hash";

interface Props {
  lang: Language;
  onReset?: () => void;
}

export function PasswordHasher({ lang, onReset }: Props) {
  const t = translations[lang];
  const [password, setPassword] = useState("");
  const [algorithm, setAlgorithm] = useState<Algorithm>("bcrypt");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const reset = useCallback(() => {
    setPassword("");
    setAlgorithm("bcrypt");
    setResult("");
    setError("");
    setCopied(false);
    onReset?.();
  }, [onReset]);

  const strength = getStrength(password);
  const strengthLabel = getStrengthLabel(strength, lang);
  const strengthColor = getStrengthColor(strength);

  const handleHash = useCallback(async () => {
    if (!password.trim()) {
      setError(t.emptyError);
      return;
    }
    setError("");
    setLoading(true);
    try {
      const hashed = await hashPassword(password, algorithm);
      setResult(hashed);
    } catch {
      setError("Hashing failed");
    } finally {
      setLoading(false);
    }
  }, [password, algorithm, t.emptyError]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const algorithms: { value: Algorithm; label: string }[] = [
    { value: "bcrypt", label: "bcrypt" },
    { value: "sha256", label: "SHA-256" },
    { value: "argon2", label: "Argon2id" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Privacy badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
          {t.privacyBadge}
        </span>
      </motion.div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-lg animate-glow-pulse"
      >
        {/* Password input */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-foreground mb-2">
            {t.passwordLabel}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder={t.passwordPlaceholder}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            dir="ltr"
          />
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-destructive"
            >
              {error}
            </motion.p>
          )}
        </div>

        {/* Strength indicator */}
        <AnimatePresence>
          {password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">{t.strengthLabel}</span>
                <span className="text-xs font-medium text-foreground">{strengthLabel}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(strength / 5) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`h-full rounded-full ${strengthColor} transition-colors`}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Algorithm selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-foreground mb-2">
            {t.algorithmLabel}
          </label>
          <div className="flex gap-2 flex-wrap">
            {algorithms.map((algo) => (
              <button
                key={algo.value}
                onClick={() => setAlgorithm(algo.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  algorithm === algo.value
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-secondary text-secondary-foreground border-border hover:border-primary/50"
                }`}
              >
                {algo.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hash button */}
        <Button
          onClick={handleHash}
          disabled={loading}
          className="w-full h-12 rounded-xl text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transition-all"
          size="lg"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t.hashing}
            </span>
          ) : (
            t.hashButton
          )}
        </Button>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6"
            >
              <label className="block text-sm font-semibold text-foreground mb-2">
                {t.resultLabel}
              </label>
              <div className="relative">
                <div className="rounded-xl border border-border bg-muted/50 p-4 font-mono text-sm text-foreground break-all select-all" dir="ltr">
                  {result}
                </div>
                <button
                  onClick={handleCopy}
                  className="absolute top-2 ltr:right-2 rtl:left-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                >
                  {copied ? t.copied : t.copyButton}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Start over button */}
        {(password || result) && (
          <div className="mt-4 text-center">
            <button
              onClick={reset}
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-secondary text-secondary-foreground hover:bg-accent border border-border transition-colors"
            >
              {t.startOver}
            </button>
          </div>
        )}
      </motion.div>

      {/* Security message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 rounded-xl border border-border bg-card/50 p-5 text-center"
      >
        <div className="flex items-start gap-3 text-start">
          <span className="text-xl mt-0.5 shrink-0">🛡️</span>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t.securityMessage}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
