"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useEnglishAnalysisOptional } from "@/contexts/EnglishAnalysisContext";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";
import { getApiBase } from "@/lib/apiBase";
import type { Locale, UICopy } from "@/lib/copy";
import type { EnglishInputAnalysis } from "@/lib/englishAnalysis";
import { rememberEnglishAnalysis } from "@/lib/englishAnalysisRecent";
import { analyzeEnglishInput } from "@/lib/englishAnalysisService";
import { resolveWebReaderAnalysis } from "@/lib/genericWebReader";
import { DEFAULT_LEARNING_LANGUAGE_CODE } from "@/lib/learningLanguages";
import { inferTranslationSourceType } from "@/lib/naturalTranslation";
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
  const [sentenceOpen, setSentenceOpen] = useState(false);
  const [sentenceText, setSentenceText] = useState("");
  const [sentenceResult, setSentenceResult] =
    useState<EnglishInputAnalysis | null>(null);
  const [sentenceLoading, setSentenceLoading] = useState(false);
  const [sentenceFailed, setSentenceFailed] = useState(false);

  const analyzePayload = useCallback(
    (raw: unknown) => {
      const request = resolveWebReaderAnalysis(raw);
      if (request.kind === "invalid") {
        setNotice(ui.webReadNoSelection);
        return;
      }
      setNotice(null);
      if (request.kind === "element") {
        rememberEnglishAnalysis({ input: request.target.contextSentence });
        openAnalysis?.(request.target);
        return;
      }
      setSentenceText(request.text);
      setSentenceResult(null);
      setSentenceFailed(false);
      setSentenceLoading(true);
      setSentenceOpen(true);
      void (async () => {
        try {
          const result = await analyzeEnglishInput({
            text: request.text,
            locale,
            interfaceLanguage: locale,
            targetLanguage,
            sourceType: inferTranslationSourceType(sessionUrl),
          });
          if (!result) {
            setSentenceFailed(true);
            return;
          }
          setSentenceResult(result);
          rememberEnglishAnalysis({
            input: result.input,
            translation: result.translation,
          });
        } catch {
          setSentenceFailed(true);
        } finally {
          setSentenceLoading(false);
        }
      })();
    },
    [locale, openAnalysis, sessionUrl, targetLanguage, ui.webReadNoSelection],
  );

  useEffect(() => {
    let cancelled = false;
    const handles: Array<{ remove: () => Promise<void> }> = [];
    const bind = async () => {
      handles.push(
        await WebReader.addListener("captureText", (payload) => {
          if (cancelled) return;
          const text = payload.text?.replace(/\s+/g, " ").trim() || "";
          analyzePayload({
            selectedText: text,
            contextSentence: text,
            sourceUrl: sessionUrl,
          });
        }),
      );
      handles.push(
        await WebReader.addListener("closed", () => {
          if (!cancelled) setSessionUrl(null);
        }),
      );
    };
    void bind();
    return () => {
      cancelled = true;
      for (const handle of handles) void handle.remove();
      void WebReader.removeAllListeners();
    };
  }, [analyzePayload]);

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
    setSentenceOpen(false);
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
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
        <h1 className="text-base font-semibold text-slate-900">
          {ui.homeTabRead}
        </h1>
      </header>

      <div className="relative min-h-0 flex-1 overflow-y-auto px-4 py-8">
        <div className="mx-auto flex w-full max-w-lg flex-col">
          <p className="whitespace-pre-line text-center text-lg font-semibold text-slate-900">
            {ui.webReadHeadline}
          </p>
          <p className="mt-2 whitespace-pre-line text-center text-sm leading-relaxed text-slate-600">
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
              className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500"
            />
            <button
              type="submit"
              disabled={!draftUrl.trim()}
              className="shrink-0 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-default disabled:opacity-50"
            >
              {ui.webReadOpen}
            </button>
          </form>
          {urlError ? (
            <p className="mt-3 text-center text-sm text-rose-700">{urlError}</p>
          ) : null}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {webReaderShortcutsForLanguage(targetLanguage).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => void openUrl(item.url)}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
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
            <div className="mt-8 rounded-xl bg-slate-50 px-3 py-3 text-center">
              <p className="whitespace-pre-line text-sm text-slate-600">
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
              className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
            />
            <button
              type="submit"
              disabled={!pasteText.trim()}
              className="mt-2 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:cursor-default disabled:opacity-50"
            >
              {ui.exploreSubmit}
            </button>
          </form>
        </div>
      </div>

      {notice ? (
        <p className="pointer-events-none absolute bottom-20 left-1/2 z-10 max-w-[90%] -translate-x-1/2 rounded-full bg-slate-900/90 px-3 py-1.5 text-center text-xs text-white">
          {notice}
        </p>
      ) : null}

      {sentenceOpen ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-900/40 sm:items-center sm:p-3">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label={ui.insightClose}
            onClick={() => setSentenceOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 flex max-h-[86vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-xl sm:rounded-2xl"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-end px-3 pt-3">
              <button
                type="button"
                onClick={() => setSentenceOpen(false)}
                className="rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                aria-label={ui.insightClose}
              >
                ✕
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-1">
              <p
                translate="no"
                className="text-base font-medium leading-relaxed text-slate-900"
              >
                {sentenceResult?.input || sentenceText}
              </p>
              {sentenceResult?.translation ? (
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {sentenceResult.translation}
                </p>
              ) : null}
              {sentenceResult?.correctionNote ? (
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {sentenceResult.correctionNote}
                </p>
              ) : null}
              {sentenceLoading ? (
                <p className="mt-4 text-sm text-slate-600">{ui.exploreLoading}</p>
              ) : sentenceFailed ? (
                <p className="mt-4 text-sm text-rose-700">{ui.exploreFailed}</p>
              ) : sentenceResult && sentenceResult.elements.length > 0 ? (
                <div className="mt-4">
                  <p className="text-[11px] font-semibold tracking-wide text-slate-500">
                    {ui.analysisKeyElements}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {sentenceResult.elements.map((element) => (
                      <li key={`${element.text}-${element.label}`}>
                        <button
                          type="button"
                          onClick={() =>
                            openAnalysis?.({
                              selectedText: element.text,
                              contextSentence: sentenceResult.input,
                              sourceType: inferTranslationSourceType(sessionUrl),
                              ...(sentenceResult.language
                                ? { language: sentenceResult.language }
                                : {}),
                            })
                          }
                          className="w-full rounded-lg px-2 py-2 text-left transition hover:bg-slate-50"
                        >
                          <p className="text-sm font-medium text-slate-900">
                            [{element.label}]
                          </p>
                          {element.reading ? (
                            <p className="text-xs text-slate-500">
                              {element.reading}
                            </p>
                          ) : null}
                          <p className="mt-0.5 text-sm leading-relaxed text-slate-600">
                            {element.gloss}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
