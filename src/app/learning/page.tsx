"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LearningBookPanel,
  readAppLocale,
} from "@/components/LearningBookPanel";
import { APP_LOCALE_STORAGE_KEY, type Locale } from "@/lib/copy";
import { copy } from "@/lib/copy";
import { ExpressionInsightProvider } from "@/components/ExpressionInsightProvider";
import { VocabPreviewProvider } from "@/components/VocabPreviewProvider";

/** Legacy route — redirects UX to home saved tab via link; keeps panel for deep links. */
export default function LearningPage() {
  const [locale, setLocale] = useState<Locale>("ko");
  const ui = copy[locale];

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
    <ExpressionInsightProvider locale={locale} ui={ui}>
    <VocabPreviewProvider locale={locale} ui={ui}>
    <main className="flex min-h-screen flex-col bg-slate-100">
      <div className="mx-auto w-full max-w-lg px-4 pt-4">
        <Link
          href="/?screen=saved"
          className="text-sm font-medium text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline"
        >
          {ui.learningBackToChat}
        </Link>
      </div>
      <div className="mx-auto mt-2 h-[calc(100dvh-3.5rem)] w-full max-w-lg px-2 pb-4">
        <div className="h-full overflow-hidden rounded-2xl border border-slate-200 shadow-lg">
          <LearningBookPanel
            locale={locale}
            onLocaleChange={setLocale}
            showLanguageSelector
          />
        </div>
      </div>
    </main>
    </VocabPreviewProvider>
    </ExpressionInsightProvider>
  );
}
