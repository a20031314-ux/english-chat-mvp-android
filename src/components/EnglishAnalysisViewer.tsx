"use client";

import { useEffect, useRef, useState } from "react";
import type { UICopy } from "@/lib/copy";
import type {
  EnglishAnalysisSession,
  InspectTab,
} from "@/hooks/useEnglishAnalysis";
import { TTSButton } from "@/components/TTSButton";
import { VocabWordPanel } from "@/components/VocabWordPreview";
import { useEnglishAnalysisOptional } from "@/contexts/EnglishAnalysisContext";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";
import { useVocabPreviewOptional } from "@/contexts/VocabPreviewContext";
import { isSameAnalysisSpan } from "@/lib/englishAnalysis";
import { idiomUnitContaining } from "@/lib/expressionUnits";
import {
  findLearningSpan,
  listClickableSpans,
  peekLearningSpans,
  type LearningInnerUnit,
} from "@/lib/learningSpans";
import { DEFAULT_LEARNING_LANGUAGE_CODE, learningLanguageTextDir } from "@/lib/learningLanguages";
import { loadExpressionUnits } from "@/lib/requestExpressionUnits";
import { loadLearningSpans } from "@/lib/requestLearningSpans";
import { listWordSpans } from "@/lib/textTokens";
import { isSentenceVocabUnit } from "@/lib/vocabulary";

export function EnglishAnalysisViewer({
  session,
  ui,
  onTab,
  onRange,
  onAnalyzeRange,
  onClose,
}: {
  session: EnglishAnalysisSession;
  ui: UICopy;
  onTab: (tab: InspectTab) => void;
  onRange: (start: number, end: number) => void;
  onAnalyzeRange: () => void;
  onClose: () => void;
}) {
  const vocab = useVocabPreviewOptional();

  const closeAll = () => {
    vocab?.close();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center bg-slate-900/40 p-3 pt-4 sm:items-center sm:pt-3">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label={ui.insightClose}
        onClick={closeAll}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="english-analysis-title"
        className="relative z-10 mt-0 flex max-h-[86vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center gap-2 px-3 pt-3 pb-1">
          {session.tab === "word" ? (
            <>
              <button
                type="button"
                onClick={() => onTab("sentence")}
                className="rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                ← {ui.inspectTabSentence}
              </button>
              <p className="px-1 text-sm font-medium text-slate-900">
                {ui.vocabSaveFromChat}
              </p>
            </>
          ) : (
            <p className="px-1 text-sm font-medium text-slate-900">
              {ui.inspectTabSentence}
            </p>
          )}
          <h2 id="english-analysis-title" className="sr-only">
            {session.target.contextSentence}
          </h2>
          <span className="flex-1" />
          <button
            type="button"
            onClick={closeAll}
            className="shrink-0 rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            aria-label={ui.insightClose}
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-2">
          {session.tab === "word" ? (
            <WordTab session={session} ui={ui} />
          ) : (
            <SentenceTab
              session={session}
              ui={ui}
              onRange={onRange}
              onAnalyzeRange={onAnalyzeRange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function SentenceTab({
  session,
  ui,
  onRange,
  onAnalyzeRange,
}: {
  session: EnglishAnalysisSession;
  ui: UICopy;
  onRange: (start: number, end: number) => void;
  onAnalyzeRange: () => void;
}) {
  const analysisApi = useEnglishAnalysisOptional();
  const learningLanguage = useLearningLanguageOptional();
  const targetLanguage =
    learningLanguage?.targetLanguage ?? DEFAULT_LEARNING_LANGUAGE_CODE;
  const sentence =
    session.sentenceAnalysis?.input || session.target.contextSentence;
  const translation =
    session.target.translation?.replace(/\s+/g, " ").trim() ||
    session.sentenceAnalysis?.translation;
  const nuance = session.sentenceAnalysis?.nuance;
  const [spanTick, setSpanTick] = useState(0);
  const words = listClickableSpans(sentence, targetLanguage);
  const analysis = session.elementAnalysis;
  const selected = session.rangeActive ? session.focusText : "";
  const rangeIsSentence =
    Boolean(selected) && isSameAnalysisSpan(selected, sentence);
  const showRangeAnalyze =
    session.rangeActive && !rangeIsSentence && !analysis && !session.elementLoading;
  const drillIns = (session.sentenceAnalysis?.elements ?? []).filter(
    (element) => !isSameAnalysisSpan(element.text, sentence),
  );
  const useIdiomUnderline = targetLanguage === "en";
  const [unitTexts, setUnitTexts] = useState<string[]>([]);

  useEffect(() => {
    if (targetLanguage === "en") return;
    let cancelled = false;
    void loadLearningSpans(sentence, targetLanguage).then(() => {
      if (!cancelled) setSpanTick((tick) => tick + 1);
    });
    return () => {
      cancelled = true;
    };
  }, [sentence, targetLanguage]);

  useEffect(() => {
    if (!useIdiomUnderline) {
      setUnitTexts([]);
      return;
    }
    let cancelled = false;
    const extra = drillIns
      .map((element) => element.text.replace(/\s+/g, " ").trim())
      .filter((text) => listWordSpans(text).length >= 2);
    void loadExpressionUnits(sentence, targetLanguage).then((units) => {
      if (cancelled) return;
      const seen = new Set<string>();
      const merged: string[] = [];
      for (const text of [...units, ...extra]) {
        const key = text.toLowerCase();
        if (!text || seen.has(key)) continue;
        seen.add(key);
        merged.push(text);
      }
      setUnitTexts(merged);
    });
    return () => {
      cancelled = true;
    };
  }, [sentence, targetLanguage, useIdiomUnderline, drillIns.map((element) => element.text).join("|")]);

  const openSpan = (
    text: string,
    asIdiom: boolean,
    extra?: { innerUnits?: LearningInnerUnit[]; allowSave?: boolean },
  ) => {
    const cleaned = text.replace(/\s+/g, " ").trim();
    if (!cleaned) return;
    if (!asIdiom && isSameAnalysisSpan(cleaned, sentence)) return;
    analysisApi?.open({
      selectedText: cleaned,
      contextSentence: sentence,
      context: session.target.context,
      sourceType: session.target.sourceType,
      language: session.target.language,
      intent: "word",
      ...(asIdiom || extra?.allowSave ? { allowVocabSave: true } : {}),
      ...(extra?.innerUnits?.length ? { innerUnits: extra.innerUnits } : {}),
    });
  };

  const pieces: Array<{
    gap: string;
    text: string;
    idiom: boolean;
    active: boolean;
  }> = [];
  let cursor = 0;
  let index = 0;
  while (index < words.length) {
    const word = words[index];
    const idiom = useIdiomUnderline
      ? idiomUnitContaining(sentence, word.start, word.end, unitTexts)
      : null;
    const gap = sentence.slice(cursor, idiom ? idiom.start : word.start);
    if (idiom) {
      const covered = words.filter(
        (item) => item.start >= idiom.start && item.end <= idiom.end,
      );
      const active = covered.some(
        (item, wordIndex) =>
          session.rangeActive &&
          words.indexOf(item) >= session.rangeStart &&
          words.indexOf(item) <= session.rangeEnd,
      );
      pieces.push({
        gap,
        text: sentence.slice(idiom.start, idiom.end),
        idiom: true,
        active,
      });
      cursor = idiom.end;
      while (index < words.length && words[index].start < idiom.end) {
        index += 1;
      }
      continue;
    }
    const active =
      session.rangeActive &&
      index >= session.rangeStart &&
      index <= session.rangeEnd;
    pieces.push({ gap, text: word.text, idiom: false, active });
    cursor = word.end;
    index += 1;
  }

  void spanTick;
  const cachedSpans = peekLearningSpans(sentence, targetLanguage);

  return (
    <>
      <div className="flex items-start gap-2">
        <p
          className="min-w-0 flex-1 text-base font-medium leading-relaxed text-slate-900"
          dir={learningLanguageTextDir(targetLanguage)}
        >
          {pieces.map((piece, pieceIndex) => {
            const span =
              targetLanguage === "en"
                ? null
                : findLearningSpan(cachedSpans, piece.text);
            return (
            <span key={`${pieceIndex}-${piece.text}`}>
              {piece.gap}
              <button
                type="button"
                onClick={() =>
                  openSpan(piece.text, piece.idiom, {
                    innerUnits: span?.inner,
                    allowSave:
                      span?.kind === "expression" ||
                      span?.kind === "grammar_unit",
                  })
                }
                className={`cursor-pointer rounded-sm hover:bg-amber-100/70 ${
                  piece.idiom ? "underline decoration-amber-400 decoration-2 underline-offset-2" : ""
                } ${piece.active ? "bg-amber-200/80" : ""}`}
              >
                {piece.text}
              </button>
            </span>
            );
          })}
          {sentence.slice(cursor)}
        </p>
        <TTSButton text={sentence} ariaLabel={ui.listen} />
      </div>

      {translation ? (
        <p className="mt-3 text-sm font-medium leading-relaxed text-teal-800">
          {translation}
        </p>
      ) : null}
      {nuance ? (
        <section className="mt-3">
          <p className="text-[11px] font-semibold tracking-wide text-slate-500">
            {ui.exploreMeaningHere}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-800">{nuance}</p>
        </section>
      ) : null}
      {session.sentenceAnalysis?.correctionNote ? (
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          {session.sentenceAnalysis.correctionNote}
        </p>
      ) : null}

      {session.sentenceLoading && !translation ? (
        <p className="mt-4 text-sm text-slate-600">{ui.exploreLoading}</p>
      ) : session.sentenceFailed && !translation ? (
        <p className="mt-4 text-sm text-rose-700">{ui.exploreFailed}</p>
      ) : null}

      <WordRangeGauge
        count={words.length}
        start={session.rangeStart}
        end={session.rangeEnd}
        active={session.rangeActive}
        onRange={onRange}
      />

      {selected && !rangeIsSentence ? (
        <div className="mt-3 flex items-start gap-2">
          <p className="min-w-0 flex-1 text-xl font-semibold leading-snug text-slate-900">
            {selected}
          </p>
          <TTSButton text={selected} ariaLabel={ui.listen} />
        </div>
      ) : null}

      {showRangeAnalyze ? (
        <button
          type="button"
          onClick={onAnalyzeRange}
          className="mt-3 w-full rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          {ui.exploreSubmit}
        </button>
      ) : null}

      {session.elementLoading ? (
        <p className="mt-4 text-sm text-slate-600">{ui.insightLoading}</p>
      ) : session.elementFailed ? (
        <p className="mt-4 text-sm text-rose-700">{ui.insightFailed}</p>
      ) : analysis ? (
        <div className="mt-4 space-y-4 rounded-xl bg-slate-50 px-3 py-3">
          {analysis.meaningInContext ? (
            <p className="text-sm font-medium leading-relaxed text-teal-800">
              {analysis.meaningInContext}
            </p>
          ) : null}
          {analysis.grammar?.map((note) => (
            <section key={note.name}>
              <p className="text-[11px] font-semibold tracking-wide text-slate-500">
                {ui.insightPattern}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {note.name}
              </p>
              {note.why ? (
                <>
                  <p className="mt-2 text-[11px] font-semibold tracking-wide text-slate-500">
                    {ui.exploreWhy}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-800">
                    {note.why}
                  </p>
                </>
              ) : null}
              <p className="mt-2 text-[11px] font-semibold tracking-wide text-slate-500">
                {ui.exploreUsage}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-800">
                {note.general}
              </p>
              <p className="mt-2 text-[11px] font-semibold tracking-wide text-slate-500">
                {ui.exploreMeaningHere}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-800">
                {note.inThisSentence}
              </p>
              {note.inner?.length ? (
                <ul className="mt-3 space-y-2">
                  {note.inner.map((piece) => (
                    <li
                      key={`${piece.text}-${piece.name}`}
                      className="rounded-lg bg-white px-3 py-2"
                    >
                      <p className="text-sm font-medium text-slate-900">
                        {piece.text}
                      </p>
                      <p className="mt-0.5 text-[11px] font-semibold tracking-wide text-slate-500">
                        {piece.name}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-700">
                        {piece.explanation}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : null}
              {note.examples?.length ? (
                <div className="mt-3">
                  <p className="text-[11px] font-semibold tracking-wide text-slate-500">
                    {ui.insightExamples}
                  </p>
                  <ul className="mt-1.5 space-y-2">
                    {note.examples.map((example) => (
                      <li key={example.english}>
                        <div className="flex items-start gap-2">
                          <p className="min-w-0 flex-1 text-sm leading-relaxed text-slate-900">
                            {example.english}
                          </p>
                          <TTSButton
                            text={example.english}
                            ariaLabel={ui.listen}
                          />
                        </div>
                        {example.translation ? (
                          <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                            {example.translation}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ))}
        </div>
      ) : null}
    </>
  );
}

function WordTab({
  session,
  ui,
}: {
  session: EnglishAnalysisSession;
  ui: UICopy;
}) {
  const analysisApi = useEnglishAnalysisOptional();
  const vocab = useVocabPreviewOptional();
  const word = session.focusText;
  const sentence = session.target.contextSentence;
  const innerUnits = session.target.innerUnits ?? [];
  const wholeSentence = isSameAnalysisSpan(word, sentence);
  const blockedSentence =
    wholeSentence && session.target.allowVocabSave !== true;
  const allowSave =
    !blockedSentence &&
    (session.target.allowVocabSave === true ||
      session.target.intent === "word") &&
    (session.target.allowVocabSave === true ||
      !isSentenceVocabUnit(word, sentence));

  useEffect(() => {
    if (!word || blockedSentence) return;
    vocab?.open(
      word,
      isSameAnalysisSpan(word, sentence) ? undefined : sentence,
    );
    // Intentionally omit vocab.open from deps to avoid refetch loops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word, sentence, blockedSentence]);

  if (!word || blockedSentence) {
    return (
      <p className="text-sm leading-relaxed text-slate-500">
        {ui.exploreTapHint}
      </p>
    );
  }
  return (
    <VocabWordPanel
      word={vocab?.word || word}
      detail={vocab?.detail ?? null}
      isLoading={vocab?.isLoading ?? true}
      isSaving={vocab?.isSaving ?? false}
      loadFailed={vocab?.loadFailed ?? false}
      alreadySaved={vocab?.alreadySaved ?? false}
      allowSave={allowSave}
      innerUnits={innerUnits}
      ui={ui}
      onSave={() => vocab?.save()}
      onInnerClick={(text) => {
        if (!text || isSameAnalysisSpan(text, word)) return;
        analysisApi?.open({
          selectedText: text,
          contextSentence: sentence,
          context: session.target.context,
          sourceType: session.target.sourceType,
          language: session.target.language,
          intent: "word",
          translation: session.target.translation,
        });
      }}
    />
  );
}

function WordRangeGauge({
  count,
  start,
  end,
  active,
  onRange,
}: {
  count: number;
  start: number;
  end: number;
  active: boolean;
  onRange: (start: number, end: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragOrigin = useRef<number | null>(null);

  if (count <= 0) return null;

  const indexAt = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    const t = (clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(count - 1, Math.floor(t * count)));
  };

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={count - 1}
      aria-valuenow={active ? start : 0}
      className="relative mt-3 flex h-8 w-full cursor-pointer touch-none select-none items-stretch overflow-hidden rounded-full bg-slate-100"
      onPointerDown={(event) => {
        const index = indexAt(event.clientX);
        if (index == null) return;
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        dragOrigin.current = index;
        onRange(index, index);
      }}
      onPointerMove={(event) => {
        if (dragOrigin.current == null) return;
        const index = indexAt(event.clientX);
        if (index == null) return;
        onRange(dragOrigin.current, index);
      }}
      onPointerUp={() => {
        dragOrigin.current = null;
      }}
      onPointerCancel={() => {
        dragOrigin.current = null;
      }}
    >
      {active ? (
        <div
          className="pointer-events-none absolute inset-y-1 rounded-full bg-teal-500/80"
          style={{
            left: `${(start / count) * 100}%`,
            width: `${((end - start + 1) / count) * 100}%`,
          }}
        />
      ) : null}
      {Array.from({ length: count }, (_, index) => {
        const on = active && index >= start && index <= end;
        return (
          <span
            key={index}
            className="relative z-10 flex flex-1 items-center justify-center"
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                on ? "bg-teal-800" : "bg-slate-300"
              }`}
            />
          </span>
        );
      })}
    </div>
  );
}
