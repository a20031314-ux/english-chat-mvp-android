"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BodyLayer, FullScreenLayer } from "@/components/FullScreenLayer";
import { VocabularyPanel } from "@/components/VocabularyPanel";
import { NotebookSection } from "./NotebookSection";
import { WordLedgerLine } from "@/components/LedgerLinks";
import { apiUrl } from "@/lib/apiBase";
import { onAppIntent, sendAppIntent, takeAppIntent } from "@/lib/appIntents";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { Locale, UICopy } from "@/lib/copy";
import type { LedgerState } from "@/lib/learner/ledger";
import { useLedger } from "@/lib/learner/ledgerClient";
import { MAX_PRACTICE_PHRASES } from "@/lib/learner/practice";
import { NOTE_OUTLINE, chapterOf, noteName, topicById, type NoteChapter } from "@/lib/notes/outline";
import {
  buildNotes,
  placeKey,
  searchNotes,
  topicCount,
  topicStates,
  type NoteEntry,
  type NoteQuestion,
  type NotesBook,
  type Placements,
  type TopicNotes,
} from "@/lib/notes/notes";
import { SENTENCE_NOTES_STORAGE_KEY, deleteAskThread, parseNoteStore } from "@/lib/sentenceNotes";
import { sentenceFitsLanguage } from "@/lib/notes/sentenceFits";
import { loadVocabulary } from "@/lib/vocabulary";

/**
 * 노트(My): 모두 같은 목차(장 8 × 주제 3)에 내가 쓰고 듣고 저장한 것이 모인다 — 내 표현(장부),
 * 단어장, 문장분석에서 묻고 받은 답. 어느 주제에 들어갈지는 서버의 공유 답(/api/notes/place)을
 * 받아 기기에 기억한다. 단어장 탭은 여기로 들어왔다(전체 기능은 "단어장" 줄에서 그대로).
 *
 * 보는 방식: 목차(장 → 주제) / 모두(한 줄씩, 최근 순). 고른 것은 기기에 기억.
 * 목차 위에는 학습 언어별 뼈대(글자·소리·문법)와 내가 만든 칸, 튜터가 짚은 장면 카드(NotebookSection, 2026-10-23).
 */

type ViewMode = "outline" | "all";
const VIEW_KEY = "notesViewMode";
const PLACE_KEY = (language: string) => `notesPlace:v1:${language}`;
/** 한 번 열 때 서버에 묻는 묶음 수(묶음당 60개). 나머지는 다음에 열 때. */
const BATCHES_PER_OPEN = 4;
const BATCH = 60;

const DOT: Record<LedgerState, string> = {
  mastered: "bg-status-mastered",
  learned: "bg-status-learned",
  met: "bg-status-pending",
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Kept for this session only.
  }
}

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
  isPremium,
}: {
  ui: UICopy;
  locale: string;
  targetLanguage: string;
  isPremium: boolean;
}) {
  const ledger = useLedger(targetLanguage);
  // 이 패널은 지도를 불러온 뒤(브라우저에서만) 그려지므로 기기 저장소를 처음부터 읽는다.
  const [device, setDevice] = useState<NoteEntry[]>(() => deviceEntries(targetLanguage, locale));
  const [placements, setPlacements] = useState<Placements>(() => readJson<Placements>(PLACE_KEY(targetLanguage), {}));
  /** 서버가 더 못 받는 날(하루 한도·오류): "찾는 중" 대신 "아직 자리 없음". */
  const [stalled, setStalled] = useState(false);
  const [query, setQuery] = useState("");
  const [savedView, setView] = useState<ViewMode>(() => (readJson<ViewMode>(VIEW_KEY, "outline") === "all" ? "all" : "outline"));
  const [chapterOpen, setChapterOpen] = useState<string | null>(null);
  const [looseOpen, setLooseOpen] = useState(false);
  const [wordsOpen, setWordsOpen] = useState(() => Boolean(takeAppIntent("openNotes")));
  const asked = useRef(new Set<string>());

  const reloadDevice = useCallback(() => setDevice(deviceEntries(targetLanguage, locale)), [targetLanguage, locale]);
  useEffect(() => {
    window.addEventListener(NOTES_CHANGED, reloadDevice);
    return () => window.removeEventListener(NOTES_CHANGED, reloadDevice);
  }, [reloadDevice]);

  useEffect(() => onAppIntent("openNotes", () => setWordsOpen(true)), []);

  const entries = useMemo<NoteEntry[]>(
    () => [
      ...device,
      ...ledger.map((item) => ({ kind: "expression" as const, text: item.text, state: item.state })),
    ],
    [device, ledger],
  );
  const book = useMemo(() => buildNotes(entries, placements), [entries, placements]);
  const stateOf = useMemo(() => {
    const map = new Map(ledger.map((item) => [placeKey(item.text), item.state] as const));
    return (text: string) => map.get(placeKey(text)) ?? null;
  }, [ledger]);

  // 자리 받기: 아직 못 받은 것만, 한 번 열 때 몇 묶음까지.
  // 묻는 중에 자리가 들어오면 목록이 바뀌어 다시 돈다 — 이미 물은 것은 건너뛴다(묶음마다 표시).
  const toPlaceKey = book.toPlace.join("\n");
  useEffect(() => {
    const texts = toPlaceKey
      .split("\n")
      .filter((text) => text && !asked.current.has(placeKey(text)))
      .slice(0, BATCH * BATCHES_PER_OPEN - asked.current.size);
    if (!texts.length) return;
    let cancelled = false;
    void (async () => {
      for (let i = 0; i < texts.length && !cancelled; i += BATCH) {
        const batch = texts.slice(i, i + BATCH);
        batch.forEach((text) => asked.current.add(placeKey(text)));
        try {
          const response = await fetch(apiUrl("/api/notes/place"), {
            method: "POST",
            headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
            body: JSON.stringify({ language: targetLanguage, texts: batch }),
          });
          if (!response.ok) {
            setStalled(true);
            break;
          }
          const body = (await response.json().catch(() => null)) as { places?: Placements; limited?: boolean } | null;
          if (body?.places && Object.keys(body.places).length) {
            setPlacements((current) => {
              const next = { ...current, ...body.places };
              writeJson(PLACE_KEY(targetLanguage), next);
              return next;
            });
          }
          if (body?.limited) {
            setStalled(true);
            break;
          }
        } catch {
          setStalled(true);
          break;
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [toPlaceKey, targetLanguage, isPremium]);

  const chooseView = (mode: ViewMode) => {
    setView(mode);
    writeJson(VIEW_KEY, mode);
  };

  const hits = useMemo(() => searchNotes(book, query, locale), [book, query, locale]);
  const total = entries.length;
  // 보기 버튼은 쌓인 게 있을 때만 보이니, 비어 있으면(다른 학습 언어로 바꿨을 때 등) 기억한 "모두"에 갇히지 않게 목차로.
  const view: ViewMode = total > 0 ? savedView : "outline";
  const looseCount = topicCount(book.loose);
  const wordCount = device.filter((entry) => entry.kind === "word").length;

  return (
    <section className="mb-2 rounded-xl border border-line bg-surface p-3">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="text-body font-semibold text-ink">{ui.notesTitle}</h2>
        </div>
        {total > 0 ? (
          <div className="flex shrink-0 gap-1">
            {(["outline", "all"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                aria-pressed={view === mode}
                onClick={() => chooseView(mode)}
                className={`rounded-lg px-2 py-1 text-caption ${
                  view === mode ? "bg-white/15 text-ink" : "text-slate-400 hover:bg-white/10"
                }`}
              >
                {mode === "outline" ? ui.notesViewOutline : ui.notesViewAll}
              </button>
            ))}
          </div>
        ) : null}
      </div>

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

      {query.trim() ? (
        <SearchResults
          ui={ui}
          locale={locale}
          hits={hits}
          onOpenTopic={(topicId) => setChapterOpen(chapterOf(topicId)?.id ?? null)}
          onOpenLoose={() => setLooseOpen(true)}
        />
      ) : view === "all" ? (
        <>
        <NotebookSection ui={ui} locale={locale} language={targetLanguage} isPremium={isPremium} />
        <AllList ui={ui} locale={locale} language={targetLanguage} book={book} />
        </>
      ) : (
        <>
        <NotebookSection ui={ui} locale={locale} language={targetLanguage} isPremium={isPremium} />
        <ul className="mt-1 divide-y divide-white/5">
          {NOTE_OUTLINE.map((chapter, index) => {
            const count = chapter.topics.reduce((sum, topic) => sum + topicCount(book.byTopic[topic.id]!), 0);
            const states = chapter.topics
              .map((topic) => topicStates(book.byTopic[topic.id]!, stateOf))
              .reduce((a, b) => ({ mastered: a.mastered + b.mastered, learned: a.learned + b.learned, met: a.met + b.met }));
            return (
              <li key={chapter.id}>
                <button
                  type="button"
                  onClick={() => setChapterOpen(chapter.id)}
                  className="flex w-full items-center gap-3 py-2.5 text-start"
                >
                  <span className="w-5 shrink-0 text-caption tabular-nums text-slate-500">{index + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-note text-ink">{noteName(chapter.name, locale)}</span>
                    <span className="block truncate text-meta text-slate-500">
                      {chapter.topics.map((topic) => noteName(topic.name, locale)).join(" · ")}
                    </span>
                  </span>
                  <StateDots states={states} />
                  <span className="w-7 shrink-0 text-end text-caption tabular-nums text-slate-400">{count || ""}</span>
                </button>
              </li>
            );
          })}
          {looseCount > 0 ? (
            <li>
              <button type="button" onClick={() => setLooseOpen(true)} className="flex w-full items-center gap-3 py-2.5 text-start">
                <span className="w-5 shrink-0" />
                <span className="min-w-0 flex-1 text-note text-slate-400">
                  {book.toPlace.length && !stalled ? ui.notesFiling : ui.notesLoose}
                </span>
                <span className="w-7 shrink-0 text-end text-caption tabular-nums text-slate-500">{looseCount}</span>
              </button>
            </li>
          ) : null}
        </ul>
        </>
      )}

      {chapterOpen ? (
        <ChapterSheet
          ui={ui}
          locale={locale}
          language={targetLanguage}
          chapter={NOTE_OUTLINE.find((chapter) => chapter.id === chapterOpen)!}
          book={book}
          onClose={() => setChapterOpen(null)}
        />
      ) : null}
      {looseOpen ? (
        <NoteSheet ui={ui} title={ui.notesLoose} onClose={() => setLooseOpen(false)}>
          <TopicBody ui={ui} locale={locale} language={targetLanguage} notes={book.loose} onLeave={() => setLooseOpen(false)} />
        </NoteSheet>
      ) : null}
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

function StateDots({ states }: { states: { mastered: number; learned: number; met: number } }) {
  const total = states.mastered + states.learned + states.met;
  if (!total) return null;
  return (
    <span className="flex h-1.5 w-12 shrink-0 overflow-hidden rounded-full bg-white/5" aria-hidden>
      <span className="bg-status-mastered" style={{ width: `${(states.mastered / total) * 100}%` }} />
      <span className="bg-status-learned" style={{ width: `${(states.learned / total) * 100}%` }} />
      <span className="bg-status-pending" style={{ width: `${(states.met / total) * 100}%` }} />
    </span>
  );
}

function NoteSheet({
  ui,
  title,
  onClose,
  children,
}: {
  ui: UICopy;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <BodyLayer>
      <div className="fixed inset-0 z-[80] flex flex-col justify-end bg-black/60 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] sm:items-center sm:justify-center">
        <button type="button" className="absolute inset-0 cursor-default" aria-label={ui.billingClose} onClick={onClose} />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="relative z-10 max-h-full w-full max-w-md overflow-y-auto overscroll-contain rounded-2xl border border-line bg-surface-sunk p-4"
        >
          <div className="flex items-start gap-2">
            <h3 className="min-w-0 flex-1 text-title font-semibold text-ink">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              aria-label={ui.billingClose}
              className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10"
            >
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    </BodyLayer>
  );
}

function ChapterSheet({
  ui,
  locale,
  language,
  chapter,
  book,
  onClose,
}: {
  ui: UICopy;
  locale: string;
  language: string;
  chapter: NoteChapter;
  book: NotesBook;
  onClose: () => void;
}) {
  return (
    <NoteSheet ui={ui} title={noteName(chapter.name, locale)} onClose={onClose}>
      {chapter.topics.map((topic) => {
        const notes = book.byTopic[topic.id]!;
        const name = noteName(topic.name, locale);
        const phrases = [...notes.expressions.map((row) => row.text), ...notes.words.map((row) => row.text)].slice(
          0,
          MAX_PRACTICE_PHRASES,
        );
        return (
          <section key={topic.id} className="mt-4 border-t border-line pt-3 first-of-type:border-t-0">
            <div className="flex items-center gap-2">
              <h4 className="min-w-0 flex-1 text-body font-semibold text-ink">{name}</h4>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  sendAppIntent("practice", {
                    tab: "chat",
                    goal: { situation: `${noteName(chapter.name, locale)}: ${name}`, ...(phrases.length ? { phrases } : {}) },
                    title: name,
                  });
                }}
                className="shrink-0 rounded-lg border border-line px-2 py-1 text-caption text-slate-200 hover:bg-white/10"
              >
                {ui.notesPractice}
              </button>
            </div>
            {topicCount(notes) === 0 ? (
              <p className="mt-1 text-caption text-slate-500">{ui.notesEmptyTopic}</p>
            ) : (
              <TopicBody ui={ui} locale={locale} language={language} notes={notes} onLeave={onClose} />
            )}
          </section>
        );
      })}
    </NoteSheet>
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

function SearchResults({
  ui,
  locale,
  hits,
  onOpenTopic,
  onOpenLoose,
}: {
  ui: UICopy;
  locale: string;
  hits: ReturnType<typeof searchNotes>;
  onOpenTopic: (topicId: string) => void;
  onOpenLoose: () => void;
}) {
  if (!hits.length) return <p className="mt-3 text-caption text-slate-500">{ui.notesNoHits}</p>;
  const where = (topicId: string | null) => (topicId ? noteName(topicById(topicId)!.name, locale) : ui.notesLoose);
  return (
    <ul className="mt-2 space-y-1">
      {hits.map((hit, index) => {
        const topicId = hit.topicId;
        const label =
          hit.kind === "topic"
            ? hit.label
            : hit.kind === "question"
              ? `${hit.entry.selected} — ${hit.entry.question}`
              : hit.entry.text;
        const sub =
          hit.kind === "topic"
            ? noteName(chapterOf(hit.topicId)!.name, locale)
            : hit.kind === "word"
              ? `${hit.entry.gloss} · ${where(topicId)}`
              : where(topicId);
        return (
          <li key={`${hit.kind}:${index}`}>
            <button
              type="button"
              onClick={() => (topicId ? onOpenTopic(topicId) : onOpenLoose())}
              className="flex w-full items-start gap-2 rounded-lg bg-white/[0.04] px-3 py-2 text-start"
            >
              <span aria-hidden className="mt-0.5 w-4 shrink-0 text-caption text-slate-500">
                {hit.kind === "topic" ? "#" : hit.kind === "question" ? "?" : "·"}
              </span>
              <span className="min-w-0 flex-1">
                <span dir="auto" className="block truncate text-note text-ink">
                  {label}
                </span>
                <span className="block truncate text-meta text-slate-500">{sub}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** 모두: 주제 구분 없이 한 줄씩 — 질문은 최근 순, 표현·단어는 그 뒤. */
function AllList({ ui, locale, language, book }: { ui: UICopy; locale: string; language: string; book: NotesBook }) {
  const merged: TopicNotes = { expressions: [], words: [], questions: [] };
  for (const notes of [...Object.values(book.byTopic), book.loose]) {
    merged.expressions.push(...notes.expressions);
    merged.words.push(...notes.words);
    merged.questions.push(...notes.questions);
  }
  merged.questions.sort((a, b) => b.at - a.at);
  if (!topicCount(merged)) return <p className="mt-3 text-caption text-slate-500">{ui.ledgerEmptyShort}</p>;
  return <TopicBody ui={ui} locale={locale} language={language} notes={merged} onLeave={() => undefined} />;
}
