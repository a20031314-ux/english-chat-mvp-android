"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useEnglishAnalysisOptional } from "@/contexts/EnglishAnalysisContext";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";
import { getApiBase } from "@/lib/apiBase";
import type { Locale, UICopy } from "@/lib/copy";
import { rememberEnglishAnalysis } from "@/lib/englishAnalysisRecent";
import { resolveWebReaderAnalysis } from "@/lib/genericWebReader";
import { DEFAULT_LEARNING_LANGUAGE_CODE } from "@/lib/learningLanguages";
import {
  normalizeWebReaderUrl,
  webReaderShortcutsForLanguage,
} from "@/lib/webReaderUrl";
import { WebReader } from "@/plugins/webReader";
import { ContentDiscoveryPanel } from "@/components/contentDiscovery/ContentDiscoveryPanel";

export function WebReadingTab({
  locale,
  ui,
}: {
  locale: Locale;
  ui: UICopy;
  active?: boolean;
}) {
  const analysis = useEnglishAnalysisOptional();
  const openAnalysis = analysis?.open;
  const learningLanguage = useLearningLanguageOptional();
  const targetLanguage =
    learningLanguage?.targetLanguage ?? DEFAULT_LEARNING_LANGUAGE_CODE;
  const [draftUrl, setDraftUrl] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [sessionUrl, setSessionUrl] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const analyzePayload = useCallback(
    (raw: unknown) => {
      const request = resolveWebReaderAnalysis(raw);
      if (request.kind === "invalid") {
        setNotice(ui.webReadNoSelection);
        return;
      }
      setNotice(null);
      rememberEnglishAnalysis({ input: request.target.contextSentence });
      openAnalysis?.({
        ...request.target,
        language: targetLanguage,
        intent: "sentence",
      });
    },
    [openAnalysis, targetLanguage, ui.webReadNoSelection],
  );

  useEffect(() => {
    let cancelled = false;
    let handle: { remove: () => Promise<void> } | null = null;
    void WebReader.addListener("closed", () => {
      if (!cancelled) setSessionUrl(null);
    }).then((next) => {
      if (cancelled) {
        void next.remove();
        return;
      }
      handle = next;
    });
    return () => {
      cancelled = true;
      if (handle) void handle.remove();
    };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    return () => {
      void WebReader.close();
    };
  }, []);

  const openUrl = useCallback(
    async (raw: string) => {
      const parsed = normalizeWebReaderUrl(raw);
      if (!parsed.ok) {
        setUrlError(
          parsed.error === "unsupported"
            ? ui.webReadUnsupported
            : ui.webReadInvalidUrl,
        );
        return;
      }
      setUrlError(null);
      setNotice(null);
      setDraftUrl(parsed.url);
      setSessionUrl(parsed.url);
      try {
        await WebReader.open({
          url: parsed.url,
          apiBase: getApiBase() || "https://english-chat-mvp.vercel.app",
          locale,
          analyzeLabel: ui.insightAnalyze,
        });
      } catch {
        setNotice(ui.webReadNeedOverlay);
      }
    },
    [locale, ui],
  );

  const closeSession = useCallback(() => {
    setSessionUrl(null);
    setPasteText("");
    setNotice(null);
    void WebReader.close();
  }, []);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void openUrl(draftUrl);
  };

  const onPasteAnalyze = (event: FormEvent) => {
    event.preventDefault();
    analyzePayload({
      selectedText: pasteText,
      contextSentence: pasteText,
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl tb-panel">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <h1 className="text-base font-semibold text-white">
          {ui.homeTabRead}
        </h1>
      </header>

      <div className="relative min-h-0 flex-1 overflow-y-auto px-4 py-8">
        <div className="mx-auto flex w-full max-w-lg flex-col">
          <p className="whitespace-pre-line text-center text-lg font-semibold text-white">
            {ui.webReadHeadline}
          </p>
          <p className="mt-2 whitespace-pre-line text-center text-sm leading-relaxed text-slate-400">
            {ui.webReadHowTo}
          </p>
          <form onSubmit={onSubmit} className="mt-6 flex items-center gap-2">
            <input
              value={draftUrl}
              onChange={(event) => {
                setDraftUrl(event.target.value);
                setUrlError(null);
              }}
              placeholder={ui.webReadUrlPlaceholder}
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              className="min-w-0 flex-1 rounded-xl border border-white/15 bg-[#101010] px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-white/40"
            />
            <button
              type="submit"
              disabled={!draftUrl.trim()}
              className="shrink-0 rounded-xl bg-[#e8e8e4] px-4 py-2.5 text-sm font-medium text-neutral-900 shadow-[0_0_14px_rgba(255,255,255,0.28)] hover:bg-[#f5f5f3] disabled:cursor-default disabled:opacity-50 disabled:shadow-none"
            >
              {ui.webReadOpen}
            </button>
          </form>
          {urlError ? (
            <p className="mt-3 text-center text-sm text-rose-300">{urlError}</p>
          ) : null}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {webReaderShortcutsForLanguage(targetLanguage).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => void openUrl(item.url)}
                className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/10"
              >
                {item.label}
              </button>
            ))}
          </div>

          <ContentDiscoveryPanel
            ui={ui}
            locale={locale}
            targetLanguage={targetLanguage}
            fixedContentType="reading"
            compact
            onSelect={(candidate) => {
              void openUrl(candidate.url);
            }}
          />

          {sessionUrl ? (
            <div className="mt-8 rounded-xl bg-white/5 px-3 py-3 text-center">
              <p className="whitespace-pre-line text-sm text-slate-300">
                {ui.webReadSelectionHint}
              </p>
              <button
                type="button"
                onClick={closeSession}
                className="mt-3 text-sm text-slate-500 underline-offset-2 hover:underline"
              >
                {ui.webReadHome}
              </button>
            </div>
          ) : null}

          <form onSubmit={onPasteAnalyze} className="mt-10">
            <textarea
              value={pasteText}
              onChange={(event) => setPasteText(event.target.value)}
              rows={3}
              placeholder={ui.webReadPastePlaceholder}
              className="w-full resize-none rounded-xl border border-white/15 bg-[#121212] px-3 py-2 text-sm text-slate-100 outline-none focus:border-white/40"
            />
            <button
              type="submit"
              disabled={!pasteText.trim()}
              className="mt-2 w-full rounded-xl border border-white/10 py-2.5 text-sm font-medium text-slate-100 hover:bg-white/10 disabled:cursor-default disabled:opacity-50"
            >
              {ui.exploreSubmit}
            </button>
          </form>
        </div>
      </div>

      {notice ? (
        <p className="pointer-events-none absolute bottom-20 left-1/2 z-10 max-w-[90%] -translate-x-1/2 rounded-full bg-white/90 px-3 py-1.5 text-center text-xs text-white">
          {notice}
        </p>
      ) : null}
    </div>
  );
}
