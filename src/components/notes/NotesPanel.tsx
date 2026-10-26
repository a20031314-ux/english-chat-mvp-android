"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { VocabularyPanel } from "@/components/VocabularyPanel";
import { WordLedgerLine } from "@/components/LedgerLinks";
import { onAppIntent, takeAppIntent } from "@/lib/appIntents";
import type { Locale, UICopy } from "@/lib/copy";
import type { LedgerState } from "@/lib/learner/ledger";
import { useLedger } from "@/lib/learner/ledgerClient";
import type { NoteEntry, NoteQuestion, TopicNotes } from "@/lib/notes/notes";
import { SENTENCE_NOTES_STORAGE_KEY, deleteAskThread, parseNoteStore } from "@/lib/sentenceNotes";
import { sentenceFitsLanguage } from "@/lib/notes/sentenceFits";
import { loadVocabulary } from "@/lib/vocabulary";

/**
 * 노트(My): 내가 쓰고 듣고 저장한 것을 한 줄씩 — 내 표현(장부), 단어장 단어, 문장분석에서 묻고 받은 답(최근 순).
 * 검색칸 하나(기기 안). 단어장 탭은 여기로 들어왔다(전체 기능은 "단어장" 줄에서 그대로).
 * 예전 목차(장 8 × 주제 3, /api/notes/place로 자리 받기)와 목차/모두 보기는 2026-10-27에 뺐다(사용자 "예전 기능은 다 지워줘") —
 * 서버 API는 2.74 이하 앱이 쓴다. 학습 언어별 틀(글자·소리·문법)·짚은 장면 카드는 My "자라는 중"의 "단계" 보기(NotebookSection).
 */

const DOT: Record<LedgerState, string> = {
  mastered: "bg-status-mastered",
  learned: "bg-status-learned",
  met: "bg-status-pending",
};

/** 질문을 지우면 노트가 다시 읽게 알리는 신호(질문 줄이 패널 깊은 곳에 있어서). */
const NOTES_CHANGED = "notes:changed";

function deviceEntries(language: string, uiLanguage: string): NoteEntry[] {
  const words: NoteEntry[] = loadVocabulary()
    .filter((entry) => entry.languageCode === language)
    .map((entry) => ({
      kind: "word",
      id: entry.id,
      text: entry.word,
      gloss: entry.gloss,
      ...(entry.reading ? { reading: entry.reading } : {}),
    }));
  let store: ReturnType<typeof parseNoteStore> = {};
  try {
    store = parseNoteStore(localStorage.getItem(SENTENCE_NOTES_STORAGE_KEY));
  } catch {
    store = {};
  }
  const questions: NoteEntry[] = [];
  for (const note of Object.values(store)) {
    if (note.language !== language) continue;
    // 답은 물을 때의 앱 언어로 적혀 있다 — 지금 앱 언어로 물은 것만(다른 언어로 물은 건 그 언어로 바꾸면 다시 보인다).
    if (note.uiLanguage !== uiLanguage) continue;
    // 학습 언어가 아닌 문장(일본어 노트에 들어온 중국어 자막 등)은 보이지 않는다.
    if (!sentenceFitsLanguage(note.sentence, language)) continue;
    for (const thread of note.threads) {
      for (const turn of thread.turns) {
        questions.push({
          kind: "question",
          text: note.sentence,
          selected: thread.selected,
          question: turn.question,
          answer: turn.answer,
          at: turn.at,
          threadId: thread.id,
          language: note.language,
          uiLanguage: note.uiLanguage,
        });
      }
    }
  }
  (questions as NoteQuestion[]).sort((a, b) => b.at - a.at);
  return [...words, ...questions];
}

export function NotesPanel({
  ui,
  locale,
  targetLanguage,
}: {
  ui: UICopy;
  locale: string;
  targetLanguage: string;
}) {
  const ledger = useLedger(targetLanguage);
  // 이 패널은 브라우저에서만 그려지므로 기기 저장소를 처음부터 읽는다.
  const [device, setDevice] = useState<NoteEntry[]>(() => deviceEntries(targetLanguage, locale));
  const [query, setQuery] = useState("");
  const [wordsOpen, setWordsOpen] = useState(() => Boolean(takeAppIntent("openNotes")));

  const reloadDevice = useCallback(() => setDevice(deviceEntries(targetLanguage, locale)), [targetLanguage, locale]);
  useEffect(() => {
    window.addEventListener(NOTES_CHANGED, reloadDevice);
    return () => window.removeEventListener(NOTES_CHANGED, reloadDevice);
  }, [reloadDevice]);

  useEffect(() => onAppIntent("openNotes", () => setWordsOpen(true)), []);

  const notes = useMemo<TopicNotes>(() => {
    const q = query.trim().toLocaleLowerCase(locale);
    const hit = (...texts: Array<string | undefined>) =>
      !q || texts.some((text) => text?.toLocaleLowerCase(locale).includes(q));
    const all: TopicNotes = { expressions: [], words: [], questions: [] };
    for (const item of ledger) {
      if (hit(item.text)) all.expressions.push({ kind: "expression", text: item.text, state: item.state });
    }
    for (const entry of device) {
      if (entry.kind === "word" && hit(entry.text, entry.gloss, entry.reading)) all.words.push(entry);
      if (entry.kind === "question" && hit(entry.text, entry.selected, entry.question, entry.answer)) all.questions.push(entry);
    }
    all.questions.sort((a, b) => b.at - a.at);
    return all;
  }, [ledger, device, query, locale]);
  const wordCount = device.filter((entry) => entry.kind === "word").length;
  const shown = notes.expressions.length + notes.words.length + notes.questions.length;

  return (
    <section className="mb-2 rounded-xl border border-line bg-surface p-3">
      <h2 className="text-body font-semibold text-ink">{ui.notesTitle}</h2>

      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={ui.notesSearch}
        aria-label={ui.notesSearch}
        className="mt-2 w-full rounded-lg border border-line bg-surface-sunk px-3 py-2 text-note text-ink placeholder:text-slate-500"
      />

      <button
        type="button"
        onClick={() => setWordsOpen(true)}
        className="mt-2 flex w-full items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 text-start"
      >
        <span className="min-w-0 flex-1 text-note text-slate-200">{ui.homeTabVocab}</span>
        <span className="text-caption tabular-nums text-slate-400">{wordCount}</span>
        <span aria-hidden className="text-caption text-slate-500">›</span>
      </button>

      {shown ? (
        <TopicBody ui={ui} locale={locale} language={targetLanguage} notes={notes} onLeave={() => undefined} />
      ) : (
        <p className="mt-3 text-caption text-slate-500">{query.trim() ? ui.notesNoHits : ui.ledgerEmptyShort}</p>
      )}

      {wordsOpen ? (
        <FullScreenLayer>
          <header className="flex shrink-0 items-center gap-2 border-b border-line px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <h1 className="min-w-0 flex-1 text-base font-semibold text-ink">{ui.homeTabVocab}</h1>
            <button
              type="button"
              onClick={() => {
                setWordsOpen(false);
                reloadDevice();
              }}
              aria-label={ui.billingClose}
              className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10"
            >
              ✕
            </button>
          </header>
          <div className="min-h-0 flex-1 overflow-hidden pb-[env(safe-area-inset-bottom)]">
            <VocabularyPanel locale={locale as Locale} ui={ui} />
          </div>
        </FullScreenLayer>
      ) : null}
    </section>
  );
}

function TopicBody({
  ui,
  locale,
  language,
  notes,
  onLeave,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  notes: TopicNotes;
  onLeave: () => void;
}) {
  return (
    <div className="mt-2 space-y-3">
      {notes.expressions.length ? (
        <Group label={ui.notesPhrases}>
          {notes.expressions.map((row) => (
            <PhraseRow key={`e:${row.text}`} ui={ui} locale={locale} language={language} text={row.text} state={row.state} onLeave={onLeave} />
          ))}
        </Group>
      ) : null}
      {notes.words.length ? (
        <Group label={ui.notesWords}>
          {notes.words.map((row) => (
            <PhraseRow
              key={`w:${row.id}`}
              ui={ui}
              locale={locale}
              language={language}
              text={row.text}
              reading={row.reading}
              gloss={row.gloss}
              onLeave={onLeave}
            />
          ))}
        </Group>
      ) : null}
      {notes.questions.length ? (
        <Group label={ui.notesQuestions}>
          {notes.questions.map((row) => (
            <QuestionRow key={`q:${row.text}:${row.at}`} ui={ui} entry={row} />
          ))}
        </Group>
      ) : null}
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-meta font-semibold tracking-wide text-slate-500">{label}</p>
      <ul className="mt-1 space-y-1">{children}</ul>
    </div>
  );
}

function PhraseRow({
  ui,
  locale,
  language,
  text,
  state,
  reading,
  gloss,
  onLeave,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  text: string;
  state?: LedgerState;
  reading?: string;
  gloss?: string;
  onLeave: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <li className="rounded-lg bg-white/[0.04]">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-start gap-2 px-3 py-2 text-start">
        {state ? <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${DOT[state]}`} /> : null}
        <span className="min-w-0 flex-1">
          <span dir="auto" className="block text-chat text-ink">
            {text}
            {reading ? <span className="ms-2 text-caption text-slate-500">{reading}</span> : null}
          </span>
          {gloss ? <span className="block text-caption text-slate-400">{gloss}</span> : null}
        </span>
      </button>
      {open ? (
        <div className="px-3 pb-2">
          <WordLedgerLine ui={ui} locale={locale} word={text} language={language} onLeave={onLeave} />
        </div>
      ) : null}
    </li>
  );
}

function QuestionRow({ ui, entry }: { ui: UICopy; entry: NoteQuestion }) {
  const [open, setOpen] = useState(false);
  const remove = () => {
    if (!entry.threadId || !entry.language || !entry.uiLanguage) return;
    deleteAskThread({ sentence: entry.text, language: entry.language, uiLanguage: entry.uiLanguage }, entry.threadId);
    window.dispatchEvent(new Event(NOTES_CHANGED));
  };
  return (
    <li className="relative rounded-lg bg-white/[0.04] px-3 py-2">
      {entry.threadId ? (
        <button
          type="button"
          onClick={remove}
          aria-label={ui.delete}
          className="absolute end-1.5 top-1.5 rounded-lg px-1.5 text-caption text-slate-500 hover:bg-white/10 hover:text-slate-300"
        >
          ×
        </button>
      ) : null}
      <button type="button" onClick={() => setOpen((v) => !v)} className="block w-full pe-6 text-start">
        <span dir="auto" className="block text-note text-slate-400">
          {entry.text}
        </span>
        <span dir="auto" className="mt-1 block text-note text-ink">
          <span className="me-1 rounded-lg bg-info/15 px-1 text-info">{entry.selected}</span>
          {entry.question}
        </span>
      </button>
      <p dir="auto" className={`mt-1 whitespace-pre-wrap text-note text-slate-200 ${open ? "" : "line-clamp-3"}`}>
        {entry.answer}
      </p>
    </li>
  );
}
