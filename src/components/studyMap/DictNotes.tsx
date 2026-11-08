"use client";

/**
 * 사전 주석(2026-11-08 사용자 "궁금한 게 사전 안의 내용이면 그 카드를 펼쳐서 — 앱 안 모든 텍스트에" → "주석으로 달리는 식"):
 * 학습 언어 문장 아래 작은 줄 하나 — 📕 + 그 문장에 든 Languagebank 표제어 칩(curriculum/dictNotes.ts).
 * 칩 → 단어는 사전 시트 그 단어 화면(DictionarySheet), 표현은 그 수업(openLesson). New·적용이 힘듦 먼저, 알아요는 흐리게 뒤.
 * 서버 없이 폰의 단어 목록으로. 대화 줄은 줄 도구(LineTools)와 함께, 예문은 DictNotesToggle(📕)로 펼침, 문제는 답한 뒤에만(부르는 쪽이 정함).
 */
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { useLearningLanguageOptional } from "@/contexts/LearningLanguageContext";
import { useUiCopy } from "@/hooks/useUiCopy";
import { openLesson } from "@/lib/appIntents";
import { APP_LOCALE_STORAGE_KEY, isLocale, type Locale } from "@/lib/copy";
import { checkStates } from "@/lib/curriculum/checkState";
import { dictNotes, irregularForms, type DictNote } from "@/lib/curriculum/dictNotes";
import { noteLedger, readLedger } from "@/lib/curriculum/logLedger";
import { loadBank, peekBank, type BankWord } from "@/lib/curriculum/vocabBank";
import { loadWordTraits } from "@/lib/curriculum/wordTraits";
import { DictionarySheet } from "@/components/studyMap/Dictionary";

function appLocale(): Locale {
  try {
    const raw = localStorage.getItem(APP_LOCALE_STORAGE_KEY);
    if (raw && isLocale(raw)) return raw;
  } catch {
    // 이번에만.
  }
  return "ko";
}

const irregularCache = new Map<string, Record<string, string>>();

/** 그 언어의 단어 목록·불규칙 꼴(처음 한 번 불러옴). */
function useBank(language: string | undefined): { bank: readonly BankWord[] | null; irregular: Record<string, string> | undefined } {
  const [bank, setBank] = useState<readonly BankWord[] | null>(() => (language ? peekBank(language) : null));
  // 불규칙 꼴은 언어마다 한 번 불러 두고(irregularCache), 다 오면 다시 그리기만.
  const [, setLoaded] = useState(0);
  useEffect(() => {
    if (!language) return;
    let live = true;
    void loadBank(language).then((list) => live && setBank(list));
    if (!irregularCache.has(language)) {
      void loadWordTraits(language).then((book) => {
        irregularCache.set(language, irregularForms(book ?? {}));
        if (live) setLoaded((n) => n + 1);
      });
    }
    return () => {
      live = false;
    };
  }, [language]);
  return { bank: language && bank ? bank : null, irregular: language ? irregularCache.get(language) : undefined };
}

export function DictNotes({ text, language, locale, className = "", tone = "dark", skip }: { text: string; language?: string; locale?: Locale; className?: string; /** 밝은 바탕(재생 중 자막 카드·내 말풍선) 위인지. */ tone?: "dark" | "light"; /** 빼는 열쇠(그 문제의 소재 — 바로 위 카드에 이미 있음). */ skip?: string }) {
  const learning = useLearningLanguageOptional();
  const lang = language ?? learning?.targetLanguage;
  const [loc] = useState<Locale>(() => locale ?? appLocale());
  const ui = useUiCopy(loc);
  const { bank, irregular } = useBank(lang);
  const [word, setWord] = useState<string | null>(null);
  const notes = useMemo(() => (lang && bank ? dictNotes(lang, text, bank, irregular).filter((one) => one.key !== skip) : []), [lang, text, bank, irregular, skip]);
  const ordered = useMemo(() => {
    if (!lang || !notes.length) return [] as (DictNote & { known: boolean })[];
    const states = checkStates(readLedger(lang));
    const known = (note: DictNote) => states.get(note.key)?.level === "known";
    return [...notes.filter((one) => !known(one)).map((one) => ({ ...one, known: false })), ...notes.filter(known).map((one) => ({ ...one, known: true }))];
  }, [lang, notes]);
  if (!lang || !ordered.length) return null;
  const open = (event: MouseEvent, note: DictNote) => {
    event.stopPropagation();
    if (note.key.startsWith("w|")) setWord(note.key.slice(2));
    else {
      noteLedger(lang, [{ k: note.key, src: "dict", r: "look" }]);
      openLesson({ language: lang, key: note.key, above: true });
    }
  };
  return (
    <div data-dict-notes className={`flex flex-wrap items-center gap-1 ${className}`} onClick={(event) => event.stopPropagation()}>
      <span aria-hidden className="text-meta">📕</span>
      {ordered.map((note) => (
        <button
          key={note.key}
          type="button"
          data-dict-note={note.key}
          onClick={(event) => open(event, note)}
          className={`rounded-full border px-2 py-0.5 text-meta ${tone === "light" ? `border-slate-400 hover:bg-black/5 ${note.known ? "text-slate-500" : "text-slate-800"}` : `border-line hover:bg-white/10 ${note.known ? "text-slate-500" : "text-slate-200"}`}`}
        >
          <bdi dir="auto">{note.label}</bdi>
        </button>
      ))}
      {word ? <DictionarySheet ui={ui} language={lang} locale={loc} word={word} title={ui.languagebankTitle} above onClose={() => setWord(null)} /> : null}
    </div>
  );
}

/** 예문 옆 📕 — 누르면 그 예문의 주석을 펼침(카드·수업·사전 예문). */
export function DictNotesToggle({ text, language, locale, label }: { text: string; language?: string; locale?: Locale; label: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        data-dict-notes-toggle
        aria-label={label}
        title={label}
        aria-expanded={open}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((now) => !now);
        }}
        className={`shrink-0 rounded-lg px-1 text-meta ${open ? "opacity-100" : "opacity-60"} hover:opacity-100`}
      >
        📕
      </button>
      {open ? <DictNotes text={text} language={language} locale={locale} className="basis-full" /> : null}
    </>
  );
}
