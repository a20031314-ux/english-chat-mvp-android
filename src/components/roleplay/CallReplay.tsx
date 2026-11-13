"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { AiAvatar } from "@/components/AiTutorProfile";
import { Attempt } from "@/components/speech/Attempt";
import { QuizPlayer } from "@/components/studyMap/QuizPlayer";
import { NativeAdSlot } from "@/components/NativeAdSlot";
import { maybeShowInterstitial } from "@/lib/ads";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import { chatPartnerForLanguage, tutorVoice, type TutorGender } from "@/lib/chatPartner";
import type { UICopy } from "@/lib/copy";
import { coerceLanguageCode, learningLanguageSpeechTag, type LearningLanguageCode } from "@/lib/learningLanguages";
import type { QuizQuestion } from "@/lib/curriculum/quiz";
import { homeworkQuiz, type HomeworkQuiz } from "@/lib/roleplay/homeworkQuiz";
import { readCalls } from "@/lib/roleplay/callStore";
import { noteLedger } from "@/lib/curriculum/logLedger";
import { compareToTarget } from "@/lib/roleplay/practice";
import {
  blanked,
  freshPieces,
  giveHomework,
  keepReplay,
  noteHomeworkQuiz,
  noteReplayResult,
  parseReplay,
  pieceSaid,
  replayable,
  replayFor,
  wholeLineOf,
  wholeSaid,
  type ReplayKind,
  type ReplayLine,
  type ReplayScene,
  type StoredReplay,
} from "@/lib/roleplay/replay";
import type { TranscriptLine } from "@/lib/roleplay/review";
import { sayLine } from "@/lib/speech/sayLine";
import { playTts } from "@/lib/ttsPlayer";
import { useTutorGender } from "@/lib/tutorGender";

function storage(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

const KIND_ICON: Record<ReplayKind, string> = { same: "🔁", further: "➡️", branch: "🔀" };
function kindName(ui: UICopy, kind: ReplayKind) {
  return kind === "same" ? ui.replaySame : kind === "further" ? ui.replayFurther : ui.replayBranch;
}

async function fetchScenes(input: {
  scenarioId: string;
  said: readonly TranscriptLine[];
  nativeLanguage: string;
  level: number;
  isPremium: boolean;
}): Promise<ReplayScene[]> {
  try {
    const response = await fetch(apiUrl("/api/roleplay/replay"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders(input.isPremium) },
      body: JSON.stringify({
        scenarioId: input.scenarioId,
        nativeLanguage: input.nativeLanguage,
        level: input.level,
        lines: input.said
          .filter((line) => line.text.trim() && line.text.trim() !== "…")
          .map((line) => ({ who: line.who, text: line.text, ...(line.who === "learner" && (line.better || line.meant) ? { better: line.better || line.meant } : {}) })),
      }),
    });
    if (!response.ok) return [];
    const body = (await response.json()) as { scenes?: unknown };
    return parseReplay(body);
  } catch {
    return [];
  }
}

/**
 * 끝난 통화 화면·돌아보기의 이렇게도 말할 수 있었어요(lib/roleplay/replay.ts, 2026-11-08).
 * 수업 통화는 처음 그려질 때 장면을 받아 두고 그 통화를 숙제로 — 숙제는 [퀴즈 | 대화](2026-11-08 사용자 "숙제 > 하위탭(퀴즈, 대화)"):
 * 퀴즈 = 그 통화에서 고친 말·장면 조각(homeworkQuiz.ts), 대화 = 장면. 자유대화는 줄을 눌러야 장면을 받고 숙제가 아니다. 받은 장면은 이 폰에만.
 * 🎭는 Room 게임과 겹쳐 쓰지 않는다(2026-11-08).
 */
export function CallReplay({
  ui,
  language,
  locale,
  scenarioId,
  callId,
  lesson,
  said,
  level,
  isPremium,
  gender,
  openFirst = false,
}: {
  ui: UICopy;
  language: string;
  locale: LearningLanguageCode;
  scenarioId: string;
  callId: string;
  lesson: boolean;
  said: readonly TranscriptLine[];
  level: number;
  isPremium: boolean;
  gender?: TutorGender;
  /** 숙제 줄에서 열었을 때 — 숙제 화면을 바로 연다. */
  openFirst?: boolean;
}) {
  const [stored, setStored] = useState<StoredReplay | null>(() => (callId ? replayFor(storage(), language, callId) : null));
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [sheet, setSheet] = useState(false);
  const asked = useRef(false);
  const canMake = Boolean(callId) && replayable(said);
  // 수업 계획이 다룬 틀·다음 틀(통화 기록 lesson) — 틀 문제·예습(homeworkQuiz.ts).
  const quiz = useMemo<HomeworkQuiz>(
    () => (stored && lesson ? homeworkQuiz(language, said, stored.scenes, readCalls().find((call) => call.id === callId)?.lesson, callId) : { questions: [], keys: [] }),
    [stored, lesson, language, said, callId],
  );

  const make = async () => {
    if (asked.current || !canMake) return;
    asked.current = true;
    setLoading(true);
    const scenes = freshPieces(await fetchScenes({ scenarioId, said, nativeLanguage: locale, level, isPremium }), said);
    setLoading(false);
    if (!scenes.length) {
      setFailed(true);
      asked.current = false;
      return;
    }
    const row: StoredReplay = { callId, scenes, results: {}, at: Date.now() };
    keepReplay(storage(), language, row);
    if (lesson) giveHomework(storage(), language, { kind: "replay", callId, at: Date.now() });
    setStored(row);
  };

  // 수업 통화는 끝 화면에 오면 바로 만들어 둔다(숙제). 자유대화는 눌러야.
  useEffect(() => {
    if (lesson && !stored && canMake) void make();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson, callId]);

  useEffect(() => {
    if (openFirst && stored) setSheet(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openFirst, stored?.callId]);

  if (!canMake && !stored) return null;

  const body = stored ? (
    lesson ? (
      <HomeworkTabs ui={ui} language={language} locale={locale} stored={stored} quiz={quiz} gender={gender} isPremium={isPremium} onStored={setStored} />
    ) : (
      <SceneChips ui={ui} language={language} locale={locale} stored={stored} hasQuiz={false} gender={gender} isPremium={isPremium} onStored={setStored} />
    )
  ) : loading ? (
    <p className="mt-2 text-meta text-slate-400">{ui.replayMaking}</p>
  ) : (
    <button
      type="button"
      data-replay-make
      onClick={() => void make()}
      className="mt-2 rounded-full border border-white/20 px-3 py-1.5 text-meta text-white hover:bg-white/10"
    >
      {failed ? "↻" : "▶"} {ui.replaySame} · {ui.replayFurther}
    </button>
  );

  return (
    <section className="shrink-0 border-b border-white/10 px-4 py-2.5" data-call-replay={stored ? "ready" : loading ? "making" : "idle"}>
      <p className="truncate text-note font-semibold text-ink">{lesson ? ui.homeworkTag : ui.replayTitle}</p>
      {body}
      {sheet && stored ? (
        <HomeworkSheet ui={ui} language={language} gender={gender} onClose={() => setSheet(false)}>
          {lesson ? (
            <HomeworkTabs ui={ui} language={language} locale={locale} stored={stored} quiz={quiz} gender={gender} isPremium={isPremium} onStored={setStored} />
          ) : (
            <SceneChips ui={ui} language={language} locale={locale} stored={stored} hasQuiz={false} gender={gender} isPremium={isPremium} onStored={setStored} />
          )}
        </HomeworkSheet>
      ) : null}
    </section>
  );
}

/** 숙제 줄(Logbank)에서 연 숙제 화면: 튜터 얼굴 · 숙제 · ✕, 아래 [퀴즈 | 대화]. */
function HomeworkSheet({ ui, language, gender, onClose, children }: { ui: UICopy; language: string; gender?: TutorGender; onClose: () => void; children: ReactNode }) {
  const chosen = useTutorGender(language);
  return (
    <FullScreenLayer>
      <div className="flex shrink-0 items-center gap-3 border-b border-white/10 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]" data-homework-sheet>
        <AiAvatar size={28} language={language} gender={gender ?? chosen} />
        <p className="min-w-0 flex-1 truncate text-body font-semibold text-ink">{ui.homeworkTag}</p>
        <button type="button" onClick={onClose} aria-label={ui.guideClose} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
          ✕
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {children}
        {/* 숙제 화면 아래 빈 곳 네이티브 하나(읽는 화면 끝 — 버튼과 한 줄 넘게 띄움, 위에 장면·퀴즈가 덮이면 뗌). */}
        <NativeAdSlot feedId="sheets" slotKey="homework-sheet" spaced />
      </div>
    </FullScreenLayer>
  );
}

type Shared = {
  ui: UICopy;
  language: string;
  locale: LearningLanguageCode;
  stored: StoredReplay;
  gender?: TutorGender;
  isPremium: boolean;
  onStored: (row: StoredReplay) => void;
};

/** 숙제 = [퀴즈 | 대화]. 퀴즈가 없으면(고친 말·조각이 없음) 대화만. 처음 탭은 아직 안 한 쪽. */
function HomeworkTabs({ quiz: homework, ...shared }: Shared & { quiz: HomeworkQuiz }) {
  const quiz: readonly QuizQuestion[] = homework.questions;
  const { ui, language, locale, stored, onStored } = shared;
  const [tab, setTab] = useState<"quiz" | "talk">(() => (quiz.length && !stored.quiz ? "quiz" : "talk"));
  const [playing, setPlaying] = useState(false);
  const talkDone = Object.keys(stored.results).length > 0;
  const tabClass = (on: boolean) =>
    `flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-meta ${on ? "border-white/60 bg-white/15 text-white" : "border-white/15 text-slate-300 hover:bg-white/10"}`;
  return (
    <div className="mt-2">
      {quiz.length ? (
        <div role="tablist" className="flex gap-2">
          <button type="button" role="tab" aria-selected={tab === "quiz"} data-homework-tab="quiz" onClick={() => setTab("quiz")} className={tabClass(tab === "quiz")}>
            {ui.quizTag}
            {stored.quiz ? <span className="tabular-nums">✓ {stored.quiz.ok}/{stored.quiz.of}</span> : null}
          </button>
          <button type="button" role="tab" aria-selected={tab === "talk"} data-homework-tab="talk" onClick={() => setTab("talk")} className={tabClass(tab === "talk")}>
            {ui.homeworkTalk}
            {talkDone ? <span>✓</span> : null}
          </button>
        </div>
      ) : null}
      {tab === "quiz" && quiz.length ? (
        <button
          type="button"
          data-homework-quiz
          onClick={() => setPlaying(true)}
          className="mt-2 flex w-full items-center gap-2 rounded-2xl border border-white/20 px-3 py-2.5 text-start text-note text-white hover:bg-white/10"
        >
          <span aria-hidden>{stored.quiz ? "↻" : "▶"}</span>
          <span className="min-w-0 flex-1">{ui.quizTag}</span>
          <span className="tabular-nums text-slate-300">{stored.quiz ? `${stored.quiz.ok}/${stored.quiz.of}` : quiz.length}</span>
        </button>
      ) : (
        <SceneChips {...shared} hasQuiz={quiz.length > 0} homework />
      )}
      {playing ? (
        <QuizPlayer
          ui={ui}
          locale={locale}
          language={language}
          quizKey={`hw|${stored.callId}`}
          title={ui.homeworkTag}
          seed={stored.callId}
          unit={quiz}
          bundleKeys={quiz.map((_, at) => `hw|${stored.callId}|${at}`)}
          onBundle={(results) => {
            const counted = results.filter((one) => !one.skipped);
            // 틀 문제는 틀마다 — 하나라도 틀리면 miss(다음 수업 숙제 리뷰), 그리고 퀴즈 답이라 장부에도(체크 셋).
            const frames: Record<string, "ok" | "miss"> = {};
            results.forEach((one, at) => {
              const key = homework.keys[at];
              if (!key || one.skipped) return;
              frames[key] = frames[key] === "miss" || !one.correct ? "miss" : "ok";
            });
            if (Object.keys(frames).length) noteLedger(language, Object.entries(frames).map(([k, r]) => ({ k, src: "quiz" as const, r })));
            const next = noteHomeworkQuiz(storage(), language, stored.callId, {
              ok: counted.filter((one) => one.correct).length,
              of: results.length,
              at: Date.now(),
              ...(Object.keys(frames).length ? { frames } : {}),
            });
            if (next) onStored(next);
          }}
          onDone={() => undefined}
          homeworkLast={talkDone}
          glossFirst
          scoreEnd
          onClose={() => setPlaying(false)}
        />
      ) : null}
    </div>
  );
}

/** 대화: 장면 칩(같은 흐름 · 한 걸음 더/다른 갈래) → 장면 연습. */
function SceneChips({ ui, language, locale, stored, gender, isPremium, onStored, hasQuiz, homework = false }: Shared & { hasQuiz: boolean; homework?: boolean }) {
  const [playing, setPlaying] = useState<ReplayScene | null>(null);
  // 숙제의 마지막 반쪽(퀴즈가 없거나 이미 함)인 장면을 끝까지 하고 닫으면 숙제가 끝난 자리 — 전면 한 번(homeworkEnd). 통화 끝 화면의 장면은 통화 끝 전면과 같은 흐름이라 없음.
  const finishedScene = useRef(false);
  const closeScene = () => {
    if (homework && finishedScene.current && (!hasQuiz || stored.quiz)) void maybeShowInterstitial("homeworkEnd");
    finishedScene.current = false;
    setPlaying(null);
  };
  return (
    <>
      <div className="mt-2 flex flex-wrap gap-2">
        {stored.scenes.map((scene) => {
          const result = stored.results[scene.kind];
          return (
            <button
              key={scene.kind}
              type="button"
              data-replay-scene={scene.kind}
              onClick={() => setPlaying(scene)}
              className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-meta text-white hover:bg-white/10"
            >
              <span aria-hidden>{KIND_ICON[scene.kind]}</span>
              <span>{kindName(ui, scene.kind)}</span>
              {result ? <span className="tabular-nums text-slate-300">✓ {result.ok}/{result.of}</span> : null}
            </button>
          );
        })}
      </div>
      {playing ? (
        <ReplayPlayer
          ui={ui}
          language={language}
          locale={locale}
          scene={playing}
          gender={gender}
          isPremium={isPremium}
          onDone={(result) => {
            finishedScene.current = true;
            const next = noteReplayResult(storage(), language, stored.callId, playing.kind, { ...result, at: Date.now() }, hasQuiz);
            if (next) onStored(next);
          }}
          onClose={closeScene}
        />
      ) : null}
    </>
  );
}

type Step = { at: number } | { at: "whole" } | { at: "end" };

/**
 * 장면 하나: 튜터 줄을 듣고, 내 차례엔 앱 언어 뜻 + 바뀐 조각만 빈칸 → 🎙 말하면 받아쓰기(모델 판단 없음) → 맞음/정답 줄 소리 →
 * 다 끝나면 마지막에 뜻만 보고 한 줄 전체. 차례마다 한 번(다시 쓰기 없음, 대본과 같은 규칙). 마이크가 없으면 ⌨ 쓰기.
 */
function ReplayPlayer({
  ui,
  language,
  locale,
  scene,
  gender,
  isPremium,
  onDone,
  onClose,
}: {
  ui: UICopy;
  language: string;
  locale: LearningLanguageCode;
  scene: ReplayScene;
  gender?: TutorGender;
  isPremium: boolean;
  onDone: (result: { ok: number; of: number; whole: boolean }) => void;
  onClose: () => void;
}) {
  const code = coerceLanguageCode(language);
  const tag = learningLanguageSpeechTag(code);
  const chosen = useTutorGender(language);
  const partner = chatPartnerForLanguage(language, gender ?? chosen);
  const voice = tutorVoice(language, partner.gender);
  const whole = wholeLineOf(scene);
  const [step, setStep] = useState<Step>({ at: 0 });
  const [answers, setAnswers] = useState<Record<string, { heard: string; ok: boolean; typed: boolean }>>({});
  const [listening, setListening] = useState(false);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const reported = useRef(false);

  const index = typeof step.at === "number" ? step.at : -1;
  const line: ReplayLine | null = index >= 0 ? scene.lines[index] ?? null : null;
  const shown = index >= 0 ? scene.lines.slice(0, index + 1) : scene.lines;
  const answerKey = step.at === "whole" ? "whole" : String(index);
  const answer = answers[answerKey];

  // 튜터 줄은 나오면 소리로, 그다음 내 차례로.
  useEffect(() => {
    if (!line || line.who !== "tutor") return;
    let alive = true;
    void playTts(line.text, tag, voice).finally(() => {
      if (alive) setStep(index + 1 < scene.lines.length ? { at: index + 1 } : whole ? { at: "whole" } : { at: "end" });
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    if (step.at !== "end" || reported.current) return;
    reported.current = true;
    const mine = scene.lines.map((one, at) => (one.who === "me" ? answers[String(at)] : null)).filter(Boolean);
    onDone({ ok: mine.filter((one) => one!.ok).length, of: mine.length, whole: Boolean(answers.whole?.ok) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.at]);

  const target = step.at === "whole" ? whole : line?.who === "me" ? line : null;
  const judge = (heard: string, typed: boolean) => {
    if (!target) return;
    const ok = step.at === "whole" || !target.piece ? wholeSaid(target.text, heard, typed) : typed ? wholeSaid(target.text, fillTyped(target, heard), true) : pieceSaid(target.piece, heard);
    setAnswers((current) => ({ ...current, [answerKey]: { heard: typed && target.piece && step.at !== "whole" ? fillTyped(target, heard) : heard, ok, typed } }));
    void playTts(target.text, tag, voice);
  };

  const speak = async () => {
    if (!target || listening) return;
    setListening(true);
    const { heard } = await sayLine(target.text, { targetLanguage: code, nativeLanguage: locale, isPremium, compareOnly: true });
    setListening(false);
    if (!heard.trim()) {
      setTyping(true);
      return;
    }
    judge(heard, false);
  };

  const next = () => {
    setDraft("");
    setTyping(false);
    if (step.at === "whole") return setStep({ at: "end" });
    const after = index + 1;
    if (after < scene.lines.length) return setStep({ at: after });
    setStep(whole ? { at: "whole" } : { at: "end" });
  };

  const results = scene.lines.map((one, at) => (one.who === "me" ? answers[String(at)] : null)).filter(Boolean);

  return (
    <FullScreenLayer>
      <div className="flex shrink-0 items-center gap-3 border-b border-white/10 px-4 py-3" data-replay-player={scene.kind}>
        <AiAvatar size={28} language={language} gender={partner.gender} />
        <span aria-hidden>{KIND_ICON[scene.kind]}</span>
        <span className="min-w-0 flex-1 truncate text-note font-semibold text-white">{kindName(ui, scene.kind)}</span>
        <button type="button" onClick={onClose} aria-label={ui.guideClose} title={ui.guideClose} className="px-2 text-title text-slate-300">
          ✕
        </button>
      </div>
      <ol className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {shown.map((one, at) => {
          if (one.who === "tutor") {
            return (
              <li key={at} className="flex items-start gap-2">
                <AiAvatar size={28} language={language} gender={partner.gender} />
                <p dir="auto" className="rounded-2xl bg-white/10 px-3 py-2 text-chat text-white">{one.text}</p>
              </li>
            );
          }
          const done = answers[String(at)];
          // 한 줄 전체로 차례엔 그 줄의 답을 위에서 가린다(바로 위 초록 줄을 읽으면 끝 — 2026-11-08 점검 easy-leak).
          const hide = step.at === "whole" && !answers.whole && whole === one;
          return (
            <li key={at} className="ms-8 rounded-2xl border border-white/15 px-3 py-2">
              <p className="text-meta text-slate-400">{one.meaning}</p>
              {hide ? (
                <p className="mt-1 text-chat text-slate-500">…</p>
              ) : done ? (
                <>
                  <p dir="auto" className={`mt-1 text-chat ${done.ok ? "text-emerald-300" : "text-amber-200"}`}>{done.ok ? "✓ " : ""}{one.text}</p>
                  {!done.ok ? <Attempt outcomes={compareToTarget(one.text, done.heard).outcomes} ui={ui} /> : null}
                </>
              ) : (
                <p dir="auto" className="mt-1 text-chat text-white">{blanked(one) ?? "…"}</p>
              )}
            </li>
          );
        })}
        {step.at === "whole" && whole ? (
          <li className="rounded-2xl border border-white/30 px-3 py-2" data-replay-whole>
            <p className="text-meta font-semibold text-slate-200">{ui.replayWhole}</p>
            <p className="mt-1 text-chat text-slate-200">{whole.meaning}</p>
            {answer ? (
              <>
                <p dir="auto" className={`mt-1 text-chat ${answer.ok ? "text-emerald-300" : "text-amber-200"}`}>{answer.ok ? "✓ " : ""}{whole.text}</p>
                {!answer.ok ? <Attempt outcomes={compareToTarget(whole.text, answer.heard).outcomes} ui={ui} /> : null}
              </>
            ) : null}
          </li>
        ) : null}
        {step.at === "end" ? (
          <li className="py-4 text-center" data-replay-end>
            <p className="text-title font-semibold tabular-nums text-white">
              ✓ {results.filter((one) => one!.ok).length}/{results.length}
              {whole ? ` · ${ui.replayWhole} ${answers.whole?.ok ? "✓" : "✗"}` : ""}
            </p>
            {/* 장면 끝 점수 아래 네이티브 하나(끝 화면 — 아래 닫기 버튼과 한 줄 넘게 띄움). */}
            <div className="mt-4">
              <NativeAdSlot feedId="results" slotKey={`replay-end-${scene.kind}`} spaced />
            </div>
          </li>
        ) : null}
      </ol>
      <div className="shrink-0 border-t border-white/10 px-4 py-3">
        {step.at === "end" ? (
          <button type="button" onClick={onClose} className="w-full rounded-xl bg-white/15 px-4 py-2.5 text-note font-semibold text-white">
            {ui.guideClose}
          </button>
        ) : target && !answer ? (
          typing ? (
            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (draft.trim()) judge(draft, true);
              }}
            >
              <input
                dir="auto"
                autoFocus
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                aria-label={ui.replayType}
                className="min-w-0 flex-1 rounded-xl border border-white/20 bg-transparent px-3 py-2 text-chat text-white"
              />
              <button type="submit" className="rounded-xl bg-white/15 px-4 text-note font-semibold text-white">
                ›
              </button>
            </form>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                data-replay-say
                onClick={() => void speak()}
                disabled={listening}
                className="flex-1 rounded-xl bg-white/15 px-4 py-2.5 text-note font-semibold text-white disabled:opacity-60"
              >
                🎙 {listening ? ui.roleplayPracticeListening : ui.quizKindSay}
              </button>
              <button
                type="button"
                data-replay-type
                onClick={() => setTyping(true)}
                aria-label={ui.replayType}
                title={ui.replayType}
                className="rounded-xl border border-white/20 px-3 text-note text-slate-200"
              >
                ⌨
              </button>
            </div>
          )
        ) : answer ? (
          <button type="button" data-replay-next onClick={next} className="w-full rounded-xl bg-white/15 px-4 py-2.5 text-note font-semibold text-white">
            {ui.scriptNext}
          </button>
        ) : null}
      </div>
    </FullScreenLayer>
  );
}

/** 빈칸에 쓴 말을 줄에 넣는다(쓰기로 답할 때 — 빈칸만 써도, 줄 전체를 써도). */
function fillTyped(line: Extract<ReplayLine, { who: "me" }>, typed: string): string {
  if (!line.piece) return typed;
  const word = typed.trim();
  if ([...word].length >= [...line.text].length * 0.8) return word;
  const at = line.text.indexOf(line.piece);
  return `${line.text.slice(0, at)}${word}${line.text.slice(at + line.piece.length)}`;
}
