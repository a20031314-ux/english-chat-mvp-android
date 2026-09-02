"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LearningBookPanel,
  readAppLocale,
} from "@/components/LearningBookPanel";
import { EnglishAnalysisProvider } from "@/components/EnglishAnalysisProvider";
import { ExpressionInsightProvider } from "@/components/ExpressionInsightProvider";
import { LearningLanguageProvider } from "@/contexts/LearningLanguageContext";
import { useUiCopy } from "@/hooks/useUiCopy";
import { APP_LOCALE_STORAGE_KEY, type Locale } from "@/lib/copy";

function LearningPageInner({
  locale,
  setLocale,
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}) {
  const ui = useUiCopy(locale);

  return (
    <ExpressionInsightProvider locale={locale} ui={ui}>
      <EnglishAnalysisProvider locale={locale} ui={ui}>
        <main className="flex min-h-screen flex-col bg-[#000000]">
          <div className="mx-auto w-full max-w-lg px-4 pt-4">
            <Link
              href="/?screen=saved"
              className="text-sm font-medium text-slate-300 underline-offset-4 hover:text-white hover:underline"
            >
              {ui.learningBackToChat}
            </Link>
          </div>
          <LearningBookPanel
            locale={locale}
            onLocaleChange={setLocale}
            showLanguageSelector
          />
        </main>
      </EnglishAnalysisProvider>
    </ExpressionInsightProvider>
  );
}

/** Legacy route — redirects UX to home saved tab via link; keeps panel for deep links. */
export default function LearningPage() {
  const [locale, setLocale] = useState<Locale>("ko");

  useEffect(() => {
    setLocale(readAppLocale());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(APP_LOCALE_STORAGE_KEY, locale);
    } catch {
      // ignore
    }
  }, [locale]);

  return (
    <LearningLanguageProvider>
      <LearningPageInner locale={locale} setLocale={setLocale} />
    </LearningLanguageProvider>
  );
}
