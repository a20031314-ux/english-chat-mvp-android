"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { AiAvatar } from "@/components/AiTutorProfile";
import { RightWithChanges, SaidWithMistakes } from "@/components/RoleplayReview";
import { LineGrade } from "@/components/studyMap/LineParts";
import { QuizPlayer } from "@/components/studyMap/QuizPlayer";
import { NativeAdSlot } from "@/components/NativeAdSlot";
import { maybeShowInterstitial } from "@/lib/ads";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import { chatPartnerForLanguage, tutorVoice, type TutorGender } from "@/lib/chatPartner";
import type { UICopy } from "@/lib/copy";
import { coerceLanguageCode, learningLanguageSpeechTag, type LearningLanguageCode } from "@/lib/learningLanguages";
import type { QuizQuestion } from "@/lib/curriculum/quiz";
import { homeworkQuiz, sceneAfterQuiz } from "@/lib/roleplay/homeworkQuiz";
import { fetchPractice } from "@/lib/roleplay/listen";
import { justTalkId } from "@/lib/roleplay/justTalk";
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
 * 코치가 고친 말이 있는 통화는 처음 그려질 때 장면을 받아 두고 숙제로 — 숙제는 [퀴즈 | 대화](2026-11-08 사용자 "숙제 > 하위탭(퀴즈, 대화)"):
 * 퀴즈 = 그 통화에서 고친 말·장면 조각(homeworkQuiz.ts), 대화 = 장면. 고친 말이 없는 통화는 눌러야 장면을 받고 숙제가 아니다. 받은 장면은 이 폰에만.
 * 🎭는 Room 게임과 겹쳐 쓰지 않는다(2026-11-08).
 */
export function CallReplay({
  ui,
  language,
  locale,
  scenarioId,
  callId,
  homework,
  said,
  level,
  isPremium,
  gender,
  openFirst = false,
  justEnded = false,
}: {
  ui: UICopy;
  language: string;
  locale: LearningLanguageCode;
  scenarioId: string;
  callId: string;
  /** 코치가 하나라도 고친 통화 — 끝 화면에 숙제(transcriptMarks.ts hadFix). */
  homework: boolean;
  said: readonly TranscriptLine[];
  level: number;
  isPremium: boolean;
  gender?: TutorGender;
  /** 숙제 줄에서 열었을 때 — 숙제 화면을 바로 연다. */
  openFirst?: boolean;
  /** 방금 끝난 통화의 끝 화면 — 장면을 저절로 만들고 숙제를 주는 건 여기서만(돌아보기로 옛 통화를 열면 안 함). */
  justEnded?: boolean;
}) {
  const [stored, setStored] = useState<StoredReplay | null>(() => (callId ? replayFor(storage(), language, callId) : null));
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [sheet, setSheet] = useState(false);
  const asked = useRef(false);
  const canMake = Boolean(callId) && replayable(said);
  const quiz = useMemo(() => (stored && homework ? homeworkQuiz(language, said, stored.scenes) : []), [stored, homework, language, said]);

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
    if (homework && justEnded) giveHomework(storage(), language, { kind: "replay", callId, at: Date.now() });
    setStored(row);
  };

  // 코치가 고친 통화는 방금 끝난 끝 화면에 오면 바로 만들어 둔다(숙제). 고친 게 없거나 돌아보기면 눌러야.
  useEffect(() => {
    if (homework && justEnded && !stored && canMake) void make();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homework, callId]);

  useEffect(() => {
    if (openFirst && stored) setSheet(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openFirst, stored?.callId]);

  if (!canMake && !stored) return null;

  const body = stored ? (
    homework ? (
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
      {failed ? "↻" : "▶"} {ui.replaySim}
    </button>
  );

  return (
    <section className="shrink-0 border-b border-white/10 px-4 py-2.5" data-call-replay={stored ? "ready" : loading ? "making" : "idle"}>
      <p className="truncate text-note font-semibold text-ink">{homework ? ui.homeworkTag : ui.replayTitle}</p>
      {body}
      {sheet && stored ? (
        <HomeworkSheet ui={ui} language={language} gender={gender} onClose={() => setSheet(false)}>
          {homework ? (
            <HomeworkTabs ui={ui} language={language} locale={locale} stored={stored} quiz={quiz} gender={gender} isPremium={isPremium} onStored={setStored} sheet />
          ) : (
            <SceneChips ui={ui} language={language} locale={locale} stored={stored} hasQuiz={false} gender={gender} isPremium={isPremium} onStored={setStored} big />
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

/**
 * 숙제 = [퀴즈 | 대화]. 퀴즈가 없으면(고친 말·조각이 없음) 대화만. 처음 탭은 아직 안 한 쪽.
 * sheet(숙제 화면, 숙제 줄에서 엶): 탭 대신 큰 칸 둘을 위아래로, 열자마자 안 한 쪽을 바로 시작하고 퀴즈를 끝내면 대화로 이어 감(사용자 2026-11-22 "화면이 비어 보임").
 */
function HomeworkTabs({ quiz, sheet = false, ...shared }: Shared & { quiz: readonly QuizQuestion[]; sheet?: boolean }) {
  const { ui, language, locale, stored, onStored } = shared;
  const [tab, setTab] = useState<"quiz" | "talk">(() => (quiz.length && !stored.quiz ? "quiz" : "talk"));
  const talkDone = Object.keys(stored.results).length > 0;
  const [playing, setPlaying] = useState(() => sheet && quiz.length > 0 && !stored.quiz);
  const [startTalk, setStartTalk] = useState(() => (sheet && !(quiz.length > 0 && !stored.quiz) && !talkDone ? 1 : 0));
  const quizDoneNow = useRef(false);
  const tabClass = (on: boolean) =>
    `flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-meta ${on ? "border-white/60 bg-white/15 text-white" : "border-white/15 text-slate-300 hover:bg-white/10"}`;
  const quizPlayer = playing ? (
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
        quizDoneNow.current = true;
        const counted = results.filter((one) => !one.skipped);
        const next = noteHomeworkQuiz(storage(), language, stored.callId, { ok: counted.filter((one) => one.correct).length, of: results.length, at: Date.now() });
        if (next) onStored(next);
      }}
      onDone={() => undefined}
      // 숙제 끝 전면은 숙제 화면(sheet)에서만 — 통화 끝 화면은 통화 끝 전면과 같은 흐름.
      homeworkLast={sheet && talkDone}
      glossFirst
      scoreEnd
      onClose={() => {
        setPlaying(false);
        if (sheet && quizDoneNow.current && !talkDone) setStartTalk((n) => n + 1);
        quizDoneNow.current = false;
      }}
    />
  ) : null;
  if (sheet) {
    return (
      <div className="flex flex-col gap-3" data-homework-cards>
        {quiz.length ? (
          <button
            type="button"
            data-homework-quiz
            onClick={() => setPlaying(true)}
            className="flex w-full items-center gap-3 rounded-2xl border border-white/20 bg-white/5 px-4 py-5 text-start text-white hover:bg-white/10"
          >
            <span aria-hidden className="text-title">{stored.quiz ? "↻" : "▶"}</span>
            <span className="min-w-0 flex-1 text-body font-semibold">{ui.quizTag}</span>
            <span className="tabular-nums text-note text-slate-300">{stored.quiz ? `✓ ${stored.quiz.ok}/${stored.quiz.of}` : quiz.length}</span>
          </button>
        ) : null}
        <SceneChips {...shared} hasQuiz={quiz.length > 0} quiz={quiz} homework big startKey={startTalk} />
        {quizPlayer}
      </div>
    );
  }
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
        <SceneChips {...shared} hasQuiz={quiz.length > 0} quiz={quiz} />
      )}
      {quizPlayer}
    </div>
  );
}

/** 대화: 대화 시뮬레이션 하나(통화 흐름 그대로 → 한 걸음 더, 2026-11-19) → 장면 연습. 이 폰의 옛 기록(장면 둘)은 첫 장면만. */
function SceneChips({
  ui,
  language,
  locale,
  stored,
  gender,
  isPremium,
  onStored,
  hasQuiz,
  quiz = [],
  homework = false,
  big = false,
  startKey = 0,
}: Shared & { hasQuiz: boolean; quiz?: readonly QuizQuestion[]; homework?: boolean; big?: boolean; startKey?: number }) {
  const [playing, setPlaying] = useState<ReplayScene | null>(null);
  // 숙제 화면이 "지금 대화를 시작"하라고 하면(startKey가 바뀜) 첫 장면을 바로 연다.
  useEffect(() => {
    if (startKey > 0 && stored.scenes[0]) setPlaying(stored.scenes[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startKey]);
  // 숙제의 마지막 반쪽(퀴즈가 없거나 이미 함)인 장면을 끝까지 하고 닫으면 숙제가 끝난 자리 — 전면 한 번(homeworkEnd). 통화 끝 화면의 장면은 통화 끝 전면과 같은 흐름이라 없음.
  const finishedScene = useRef(false);
  const closeScene = () => {
    if (homework && finishedScene.current && (!hasQuiz || stored.quiz)) void maybeShowInterstitial("homeworkEnd");
    finishedScene.current = false;
    setPlaying(null);
  };
  return (
    <>
      <div className={big ? "flex flex-col gap-3" : "mt-2 flex flex-wrap gap-2"}>
        {stored.scenes.slice(0, 1).map((scene) => {
          const result = stored.results[scene.kind];
          if (big) {
            return (
              <button
                key={scene.kind}
                type="button"
                data-replay-scene={scene.kind}
                onClick={() => setPlaying(scene)}
                className="flex w-full items-center gap-3 rounded-2xl border border-white/20 bg-white/5 px-4 py-5 text-start text-white hover:bg-white/10"
              >
                <span aria-hidden className="text-title">{result ? "↻" : "▶"}</span>
                <span className="min-w-0 flex-1 text-body font-semibold">{ui.replaySim}</span>
                <span className="tabular-nums text-note text-slate-300">{result ? `✓ ${result.ok}/${result.of}` : scene.lines.filter((one) => one.who === "me").length}</span>
              </button>
            );
          }
          return (
            <button
              key={scene.kind}
              type="button"
              data-replay-scene={scene.kind}
              onClick={() => setPlaying(scene)}
              className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-meta text-white hover:bg-white/10"
            >
              <span aria-hidden>{result ? "↻" : "▶"}</span>
              <span>{ui.replaySim}</span>
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
          scene={sceneAfterQuiz(playing, quiz, language)}
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
  // note: 맞지 않은 줄의 까닭 한 줄(앱 언어, practice 판단 — 사용자 2026-11-26 "어떤 부분이 틀리고 어색한지 불분명, 설명도 없고"). null = 받는 중.
  const [answers, setAnswers] = useState<Record<string, ReplayAnswer>>({});
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
    const said = typed && target.piece && step.at !== "whole" ? fillTyped(target, heard) : heard;
    const key = answerKey;
    setAnswers((current) => ({ ...current, [key]: { heard: said, ok, typed, ...(ok ? {} : { note: null }) } }));
    void playTts(target.text, tag, voice);
    if (ok) return;
    // 틀린 줄은 무엇이 다른지·왜를 한 줄로(앱 언어). 판단이 "괜찮음"이면 ✓로 바꾼다(받아쓰기 탓·같은 뜻 다른 꼴).
    // 뜻(앱 언어)·바로 앞 튜터 말과 함께 — 맞음 / 맞지만 어색함(통과, 더 자연스러운 말) / 틀림(문법·뜻)으로(practice.ts ownWordsPrompt).
    const at = step.at === "whole" ? scene.lines.indexOf(target) : index;
    const before = [...scene.lines.slice(0, Math.max(0, at))].reverse().find((one) => one.who === "tutor")?.text ?? "";
    void fetchPractice({ scenarioId: justTalkId(code), target: target.text, heard: said, nativeLanguage: locale, isPremium, typed, meaning: target.meaning, before })
      .then((practice) =>
        setAnswers((current) => {
          const row = current[key];
          if (!row) return current;
          const better = practice?.better?.trim() ?? "";
          return {
            ...current,
            [key]: {
              ...row,
              ok: Boolean(practice?.good),
              note: practice?.note ?? "",
              ...(practice?.verdict ? { verdict: practice.verdict } : {}),
              ...(better ? { better } : {}),
            },
          };
        }),
      )
      .catch(() => setAnswers((current) => (current[key] ? { ...current, [key]: { ...current[key]!, note: "" } } : current)));
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
        <span className="min-w-0 flex-1 truncate text-note font-semibold text-white">{ui.replaySim}</span>
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
                <AnswerView ui={ui} target={one.text} answer={done} />
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
            {answer ? <AnswerView ui={ui} target={whole.text} answer={answer} /> : null}
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

type ReplayAnswer = {
  heard: string;
  ok: boolean;
  typed: boolean;
  /** 까닭 한 줄(앱 언어). null = 받는 중, "" = 없음. */
  note?: string | null;
  verdict?: "natural" | "awkward" | "wrong";
  /** 내 말을 고친(더 자연스러운) 한 줄 — 대본 줄과 다를 때 보인다. */
  better?: string;
};

/**
 * 말한(쓴) 줄의 결과(사용자 2026-11-26 "어떤 부분이 틀리고 어색한지 불분명, 설명도 없고"):
 * 대본 그대로면 ✓. 아니면 판단(뜻·앞 튜터 말과 함께)을 받아 — 맞음/어색함이면 내 말 + 수업 말하기와 같은 LineGrade(✓ 자연스러워요 · △ 어색해요 + 더 자연스러운 말),
 * 틀림이면 ① 바른 문장(놓친·바뀐 곳만 초록 굵게) ② 내가 한 말(틀린 낱말 빨간 취소선·빠진 자리 ‸ — 통화 고친 말과 같은 모양, 연결 correction-view)
 * ③ 까닭 한 줄(앱 언어). 괄호로 엇갈린 낱말 맞추기는 안 씀.
 */
function AnswerView({ ui, target, answer }: { ui: UICopy; target: string; answer: ReplayAnswer }) {
  const note =
    answer.note === null ? (
      <p aria-hidden className="mt-2 text-meta text-slate-500">…</p>
    ) : answer.note ? (
      <p className="mt-2 text-meta leading-relaxed text-slate-200" data-replay-note>{answer.note}</p>
    ) : null;
  if (answer.ok) {
    // 판단으로 통과한 내 말(대본과 다름): 내 말 + 수업 말하기와 같은 표시(✓ 자연스러워요 · △ 어색해요 + 더 자연스러운 말, 연결 say-grade).
    if (answer.verdict && answer.heard.trim()) {
      return (
        <>
          <p dir="auto" className="mt-1 text-chat text-emerald-300">{answer.heard}</p>
          <LineGrade ui={ui} exact={false} unclear={[]} typed={answer.typed} practice={{ good: true, note: answer.note ?? "", verdict: answer.verdict, ...(answer.better ? { better: answer.better } : {}) }} />
          <p dir="auto" className="mt-1 text-meta text-slate-500">{target}</p>
          {note}
        </>
      );
    }
    // 맞은 줄은 내가 한 말을 보이고, 대본과 다르면 대본은 아래 작게(체감 점검 2026-11-27 — 내 말 대신 모범 문장만 보여 맞게 말한 줄 앎).
    const mine = answer.heard.trim();
    const differs = Boolean(mine) && mine.toLocaleLowerCase() !== target.trim().toLocaleLowerCase();
    return (
      <>
        <p dir="auto" className="mt-1 text-chat text-emerald-300">✓ {differs ? mine : target}</p>
        {differs ? <p dir="auto" className="mt-1 text-meta text-slate-500">{target}</p> : null}
        {note}
      </>
    );
  }
  // 고친 말이 대본 줄과 다르면(내 말에 더 가까운 바른 꼴) 그걸 바른 문장으로.
  const right = answer.better && answer.verdict === "wrong" ? answer.better : target;
  // 취소선은 내 말을 고친 문장(better)과 맞댈 때만 — 대본 줄과 맞대면 맞는 다른 말(I am ↔ I'm)까지 빨갛고(민지 166),
  // 가나로 한 말과 한자 문장(きょう ↔ 今日)은 낱말로 맞댈 수 없어 같은 말도 빨갛다(준호 128).
  const kanaVsHan = !/\p{Script=Han}/u.test(answer.heard) && /\p{Script=Han}/u.test(right);
  const mark = right !== target && !kanaVsHan;
  return (
    <>
      <p dir="auto" className="mt-1 text-chat text-slate-100" data-replay-right>
        {mark ? <RightWithChanges said={answer.heard} right={right} /> : right}
      </p>
      <div className="mt-2 rounded-xl bg-white/5 p-3" data-replay-said>
        <p className="text-meta text-slate-500">{answer.typed ? ui.reviewMySentence : ui.roleplayPracticeHeard}</p>
        <p dir="auto" className="mt-1 text-chat text-slate-200">
          {mark ? <SaidWithMistakes said={answer.heard} right={right} /> : answer.heard}
        </p>
      </div>
      {note}
    </>
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
