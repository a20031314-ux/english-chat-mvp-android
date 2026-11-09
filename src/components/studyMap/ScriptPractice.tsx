"use client";

/**
 * 글자·소리 기초(2026-10-22) — 대화 단계 앞의 "글자부터". 묶음마다 카드(글자·읽는 법·소리·낱말) → 문제
 * (들은 소리의 글자 고르기 / 글자의 읽는 법 고르기). 80% 넘으면 통과로 서버에 남긴다(/api/curriculum/script).
 */
import { useEffect, useMemo, useState } from "react";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import { learningLanguageSpeechTag } from "@/lib/learningLanguages";
import { playTts } from "@/lib/ttsPlayer";
import type { UICopy } from "@/lib/copy";
import { BodyLayer } from "@/components/FullScreenLayer";
import { TTSButton } from "@/components/TTSButton";

type ItemView = { char: string; reading: string; say: string; word?: string; meaning?: string };
type GroupView = { id: string; title: string; note?: string; items: ItemView[] };
type CourseView = { title: string; groups: GroupView[] };
type Progress = { done: number; total: number; next: string | null; finished: boolean };
export type ScriptData = { course: CourseView | null; passed: string[]; progress: Progress | null };

const PASS_SHARE = 0.8;

export function useScript(targetLanguage: string, locale: string, isPremium: boolean) {
  const [data, setData] = useState<ScriptData | null>(null);
  useEffect(() => {
    let cancelled = false;
    void fetch(apiUrl(`/api/curriculum/script?lang=${encodeURIComponent(targetLanguage)}&ui=${encodeURIComponent(locale)}`), {
      headers: entitlementHeaders(isPremium),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: ScriptData | null) => {
        if (!cancelled) setData(body ?? { course: null, passed: [], progress: null });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [targetLanguage, locale, isPremium]);
  return [data, setData] as const;
}

function shuffle<T>(list: T[]): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

type Question = { kind: "listen" | "read"; item: ItemView; options: ItemView[] };

/**
 * 보기 3개는 읽는 법이 답과도 서로도 다른 것만 — b·v처럼 같은 소리를 묶은 묶음이 있어 그대로 고르면 맞는 답이 둘이 된다.
 * 묶음 안에서 모자라면 다른 묶음에서 채운다.
 */
export function questionsFor(group: GroupView, all: GroupView[]): Question[] {
  const key = (item: ItemView) => item.reading.trim().toLowerCase();
  const pool = [...group.items, ...all.filter((other) => other.id !== group.id).flatMap((other) => other.items)];
  return shuffle(group.items).map((item, index) => {
    const others: ItemView[] = [];
    const seen = new Set([key(item)]);
    for (const candidate of [...shuffle(group.items), ...shuffle(pool)]) {
      if (others.length === 3) break;
      if (seen.has(key(candidate)) || candidate.char === item.char) continue;
      seen.add(key(candidate));
      others.push(candidate);
    }
    return { kind: index % 2 === 0 ? "listen" : "read", item, options: shuffle([item, ...others]) };
  });
}

export function ScriptSheet({
  ui,
  targetLanguage,
  isPremium,
  data,
  onPassed,
  onClose,
  initialGroup = null,
}: {
  ui: UICopy;
  targetLanguage: string;
  isPremium: boolean;
  data: ScriptData;
  onPassed: (next: ScriptData) => void;
  onClose: () => void;
  /** 이 묶음 카드부터 바로(0단계 일일 학습에서 누른 묶음). */
  initialGroup?: string | null;
}) {
  const course = data.course!;
  const speech = learningLanguageSpeechTag(targetLanguage as never);
  const [groupId, setGroupId] = useState<string | null>(initialGroup);
  const [phase, setPhase] = useState<"cards" | "quiz" | "result">("cards");
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [at, setAt] = useState(0);
  const [right, setRight] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  // 틀린 글자(끝 화면에 읽는 법과 함께 — 가상 사용자 2026-11-01 "n/10 아직이에요만, 기준·틀린 글자 없음").
  const [missed, setMissed] = useState<ItemView[]>([]);
  const group = course.groups.find((entry) => entry.id === groupId) ?? null;
  const passed = useMemo(() => new Set(data.passed), [data.passed]);

  const say = (text: string) => void playTts(text, speech).catch(() => undefined);

  const start = () => {
    if (!group) return;
    const list = questionsFor(group, course.groups);
    setQuiz(list);
    setAt(0);
    setRight(0);
    setPicked(null);
    setMissed([]);
    setPhase("quiz");
    if (list[0]?.kind === "listen") say(list[0].item.say);
  };

  const answer = (index: number) => {
    const question = quiz[at];
    if (!question || picked !== null) return;
    setPicked(index);
    const ok = question.options[index] === question.item;
    const nextRight = right + (ok ? 1 : 0);
    if (ok) setRight(nextRight);
    else setMissed((current) => (current.includes(question.item) ? current : [...current, question.item]));
    // 맞으면 잠깐 ✓ 뒤 다음, 틀리면 바른 답을 보고 "다음"을 눌러 넘어간다.
    if (ok) window.setTimeout(() => advance(nextRight), 700);
  };

  const advance = (nextRight: number) => {
    if (at + 1 < quiz.length) {
        setAt(at + 1);
        setPicked(null);
        if (quiz[at + 1]?.kind === "listen") say(quiz[at + 1]!.item.say);
      } else {
        setPhase("result");
        if (group && nextRight / quiz.length >= PASS_SHARE) {
          void fetch(apiUrl("/api/curriculum/script"), {
            method: "POST",
            headers: { ...entitlementHeaders(isPremium), "Content-Type": "application/json" },
            body: JSON.stringify({ lang: targetLanguage, groupId: group.id }),
          })
            .then((response) => (response.ok ? response.json() : null))
            .then((body: { passed?: string[]; progress?: Progress } | null) => {
              if (body?.passed && body.progress) onPassed({ ...data, passed: body.passed, progress: body.progress });
            })
            .catch(() => undefined);
      }
    }
  };

  const question = quiz[at];
  const share = quiz.length ? right / quiz.length : 0;

  return (
    <BodyLayer>
      <div className="fixed inset-0 z-[80] flex flex-col justify-end bg-black/60 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] sm:items-center sm:justify-center">
        <button type="button" className="absolute inset-0 cursor-default" aria-label={ui.billingClose} onClick={onClose} />
        <div role="dialog" aria-modal="true" className="relative z-10 max-h-full w-full max-w-md overflow-y-auto overscroll-contain rounded-2xl border border-line bg-surface-sunk p-4">
          <div className="flex items-start gap-2">
            <h3 className="min-w-0 flex-1 text-title font-semibold text-ink">{group ? group.title : course.title}</h3>
            <button type="button" onClick={group ? () => { setGroupId(null); setPhase("cards"); } : onClose} aria-label={ui.billingClose} className="shrink-0 rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
              {group ? "‹" : "✕"}
            </button>
          </div>

          {!group ? (
            <ol className="mt-3 flex flex-col gap-2">
              {course.groups.map((entry) => (
                <li key={entry.id}>
                  <button type="button" onClick={() => { setGroupId(entry.id); setPhase("cards"); }} className="flex w-full items-center justify-between gap-2 rounded-xl border border-line px-3 py-2.5 text-start hover:bg-white/5">
                    <span className="min-w-0">
                      <span className="block truncate text-note text-slate-100">{entry.title}</span>
                      <span dir="auto" className="block truncate text-caption text-slate-400">{entry.items.map((item) => item.char).join(" ")}</span>
                    </span>
                    <span className="shrink-0 text-note text-good">{passed.has(entry.id) ? "✓" : ""}</span>
                  </button>
                </li>
              ))}
            </ol>
          ) : phase === "cards" ? (
            <div className="mt-3 flex flex-col gap-2">
              {group.note ? <p className="text-note text-slate-300">{group.note}</p> : null}
              <ul className="grid grid-cols-2 gap-2">
                {group.items.map((item, index) => (
                  <li key={index} className="flex flex-col gap-1 rounded-xl border border-line bg-white/5 px-3 py-2">
                    <div className="flex items-center justify-between gap-1">
                      <span dir="auto" className="text-heading font-semibold text-ink">{item.char}</span>
                      <TTSButton text={item.say} lang={speech} />
                    </div>
                    <span dir="ltr" className="text-caption text-slate-300">{item.reading}</span>
                    {item.word ? (
                      <span className="text-caption text-slate-400">
                        <span dir="auto">{item.word}</span>
                        {item.meaning ? ` · ${item.meaning}` : ""}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
              <button type="button" onClick={start} className="mt-1 rounded-xl bg-white/15 px-4 py-2.5 text-body text-ink hover:bg-white/20">
                {ui.scriptStart}
              </button>
            </div>
          ) : phase === "quiz" && question ? (
            <div className="mt-3 flex flex-col gap-3">
              <p className="text-caption text-slate-400" dir="ltr">
                {at + 1} / {quiz.length}
              </p>
              {question.kind === "listen" ? (
                <button type="button" onClick={() => say(question.item.say)} className="self-center rounded-full bg-white/10 px-5 py-3 text-title text-ink hover:bg-white/15" aria-label={ui.scriptListen}>
                  🔊
                </button>
              ) : (
                <p dir="auto" className="self-center text-heading font-semibold text-ink">{question.item.char}</p>
              )}
              <div className="grid grid-cols-2 gap-2">
                {question.options.map((option, index) => {
                  const isAnswer = option === question.item;
                  const state = picked === null ? "border-line" : isAnswer ? "border-good bg-good/15" : picked === index ? "border-bad bg-bad/15 line-through" : "border-line opacity-60";
                  return (
                    <button key={index} type="button" disabled={picked !== null} onClick={() => answer(index)} className={`rounded-xl border px-3 py-3 text-body text-ink ${state}`}>
                      <span dir={question.kind === "listen" ? "auto" : "ltr"}>{question.kind === "listen" ? option.char : option.reading}</span>
                    </button>
                  );
                })}
              </div>
              {picked !== null ? (
                <div data-letters-feedback className="flex items-center justify-between gap-2">
                  {question.options[picked] === question.item ? (
                    <span className="text-note font-semibold text-good">✓ {ui.quizRight}</span>
                  ) : (
                    <>
                      <span className="min-w-0 text-note font-semibold text-bad">
                        {ui.quizWrong} · <bdi dir="auto">{question.item.char}</bdi> = <bdi dir="ltr">{question.item.reading}</bdi>
                      </span>
                      <button type="button" data-letters-next onClick={() => advance(right)} className="shrink-0 rounded-full bg-white/90 px-4 py-1.5 text-caption font-semibold text-slate-900">
                        {ui.scriptNext}
                      </button>
                    </>
                  )}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-3">
              <p className="text-body text-ink" dir="ltr">
                {right} / {quiz.length}
              </p>
              <p className="text-note text-slate-300">{share >= PASS_SHARE ? ui.scriptPassed : ui.scriptAgain}</p>
              <p data-letters-pass className="text-caption text-slate-400">
                {ui.letterPassNeed.replace("{n}", String(Math.ceil(quiz.length * PASS_SHARE))).replace("{m}", String(quiz.length))}
              </p>
              {missed.length ? (
                <ul data-letters-missed className="flex flex-wrap gap-2">
                  {missed.map((item, index) => (
                    <li key={index} className="flex items-center gap-1.5 rounded-xl border border-bad/50 px-2.5 py-1.5">
                      <span dir="auto" className="text-body font-semibold text-ink">{item.char}</span>
                      <span dir="ltr" className="text-caption text-slate-300">{item.reading}</span>
                      <TTSButton text={item.say} lang={speech} />
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="flex gap-2">
                <button type="button" onClick={start} className="rounded-lg border border-line px-3 py-2 text-note text-slate-200 hover:bg-white/5">
                  {ui.scriptRetry}
                </button>
                <button type="button" onClick={() => { setGroupId(null); setPhase("cards"); }} className="rounded-lg bg-white/15 px-3 py-2 text-note text-ink hover:bg-white/20">
                  {ui.scriptBackToList}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </BodyLayer>
  );
}

/**
 * Languagebank의 글자·소리 칸(개편, 2026-11-07 사용자 "0단계 … 사전 중 하나로 편입"): 개관 줄 — 이름 · 묶음 수 · 지난 묶음/전체 + 묶음마다 칸(지난 것 채움).
 */
export function LettersRow({ ui, targetLanguage, locale, isPremium, onOpen }: { ui: UICopy; targetLanguage: string; locale: string; isPremium: boolean; onOpen: () => void }) {
  const [data] = useScript(targetLanguage, locale, isPremium);
  if (!data?.course) return null;
  const passed = new Set(data.passed);
  const groups = data.course.groups;
  const done = groups.filter((group) => passed.has(group.id)).length;
  return (
    <section data-lb-kind="letters" className="rounded-2xl border border-line bg-surface p-3">
      <button type="button" onClick={onOpen} className="flex w-full items-baseline gap-2 text-start">
        <span className="text-note font-semibold text-status-learned">{ui.notebookScript}</span>
        <span className="text-meta text-slate-500">{groups.length.toLocaleString()}</span>
        <span className="flex-1" />
        <span className="text-title font-semibold tabular-nums text-ink">
          {done}/{groups.length}
        </span>
        <span aria-hidden className="text-slate-500 rtl:rotate-180">›</span>
      </button>
      <div className="mt-2 flex gap-0.5" aria-hidden>
        {groups.map((group) => (
          <span key={group.id} className={`block h-3 flex-1 rounded-full ${passed.has(group.id) ? "bg-status-learned" : "bg-white/10"}`} />
        ))}
      </div>
    </section>
  );
}

/**
 * 글자·소리 칸 안: 모든 묶음을 칩으로(지난 묶음 ✓, 다음 묶음은 테두리) — 누르면 그 묶음 연습(ScriptSheet).
 * 0단계(글자부터)에서 다 지나면 "1단계 ›"(onDone, 예전 LettersPlan과 같음).
 */
export function LettersBank({ ui, targetLanguage, locale, isPremium, onDone }: { ui: UICopy; targetLanguage: string; locale: string; isPremium: boolean; onDone?: () => void }) {
  const [data, setData] = useScript(targetLanguage, locale, isPremium);
  const [open, setOpen] = useState<string | null>(null);
  if (!data?.course || !data.progress) return <p className="py-6 text-center text-meta text-slate-500">…</p>;
  const passed = new Set(data.passed);
  const next = data.course.groups.find((group) => !passed.has(group.id))?.id ?? null;
  return (
    <section data-letters-bank className="flex flex-col gap-2">
      <p className="text-caption text-slate-400">{data.course.title}</p>
      <div className="grid grid-cols-2 gap-1.5">
        {data.course.groups.map((group) => {
          const isPassed = passed.has(group.id);
          return (
            <button
              key={group.id}
              type="button"
              data-letters-group={group.id}
              data-passed={isPassed ? "1" : undefined}
              onClick={() => setOpen(group.id)}
              className={`flex min-w-0 flex-col rounded-xl border px-3 py-2 text-start hover:bg-white/5 ${group.id === next ? "border-status-learned" : "border-line"}`}
            >
              <span className="flex items-center gap-1.5">
                <span className="min-w-0 flex-1 truncate text-note text-ink">{group.title}</span>
                {isPassed ? <span aria-hidden className="text-caption text-status-learned">✓</span> : null}
              </span>
              <span dir="auto" className="truncate text-caption text-slate-400">
                {group.items.map((item) => item.char).join(" ")}
              </span>
            </button>
          );
        })}
      </div>
      {onDone && data.progress.finished ? (
        <button type="button" onClick={onDone} className="mt-1 w-full rounded-xl bg-status-learned py-2.5 text-note font-semibold text-black">
          {ui.stageNumber.replace("{n}", "1")} ›
        </button>
      ) : null}
      {open ? (
        <ScriptSheet
          ui={ui}
          targetLanguage={targetLanguage}
          isPremium={isPremium}
          data={data}
          initialGroup={open}
          onPassed={(next2) => setData(next2)}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </section>
  );
}
