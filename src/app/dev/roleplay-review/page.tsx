"use client";

/**
 * A look at the looking-back panel without speaking a word.
 *
 * The panel only appears on a turn the tutor judged a struggle, which means a
 * microphone, a scene, and getting stuck in it on purpose — so the one thing
 * nobody could easily do was look at the panel. This page renders the real
 * `RoleplayLine` and `RoleplayReviewPanel` over reviews in the shape the
 * model actually returns, taken from real answers to the live route. Only the
 * conversation and the request are fake.
 *
 * The cases are the ones worth seeing: the ordinary review, a long one with no
 * example sentence (someone who understood and was merely slow), and the two
 * states where there is nothing to read yet.
 *
 * Dev-only: reachable at /dev/roleplay-review in `next dev`. It is not linked
 * from anywhere in the app, and it stays out of the APK because
 * `scripts/build-capacitor.mjs` moves this whole folder aside for the static
 * export.
 */

import { useState } from "react";
import {
  RoleplayLine,
  RoleplayReviewPanel,
  type TranscriptLine,
} from "@/components/RoleplayReview";
import { copy } from "@/lib/copy";
import type { Review, StuckTurn } from "@/lib/roleplay/review";

const SIZE_TURN: StuckTurn = {
  asked: "Sure. What size — small or large?",
  heard: "um... the, the big one?",
  attempts: 2,
  hesitationMs: 5200,
  history: [],
};

const SLOW_TURN: StuckTurn = {
  asked: "Hey! Good to see you. How is your day going?",
  heard: "my day is, uh, it is okay I think",
  attempts: 1,
  hesitationMs: 6500,
  history: [],
};

/** Answers the live route actually gave, so the lengths are real lengths. */
const CASES: { label: string; turn: StuckTurn; review: Review | null; failed: boolean }[] = [
  {
    label: "보통",
    turn: SIZE_TURN,
    review: {
      why: "바리스타가 'What size? small or large?'라고 물어보셨고, 크기를 고르라는 질문이었어요. 질문은 이해했지만 'large'라는 단어가 바로 떠오르지 않아 잠시 머뭇거리며 'the big one'이라고 답했어요.",
      say: "Large, please.",
      meaning: "라지로 주세요.",
    },
    failed: false,
  },
  {
    label: "길고, 예문 없음",
    turn: SLOW_TURN,
    review: {
      why: "친구가 'How is your day going?'이라고 물었고, 하루가 어떤지 묻는 질문이었어요. 질문은 알아들으셨고 뜻도 정확히 이해하셨어요. 다만 대답할 한 문장을 고르는 데 시간이 걸려서 'uh'로 한 번 끊기고 같은 말을 두 번 시작하셨어요. 문법이나 단어가 막힌 자리가 아니라, 이미 아는 표현 중에서 무엇을 쓸지 정하는 데 걸린 시간이었어요. 이런 자리에서는 가장 먼저 떠오른 것을 그대로 말해도 괜찮아요.",
      say: "",
      meaning: "",
    },
    failed: false,
  },
  { label: "만드는 중", turn: SIZE_TURN, review: null, failed: false },
  { label: "실패", turn: SIZE_TURN, review: null, failed: true },
];

const TRANSCRIPT: TranscriptLine[] = [
  { who: "tutor", text: "Hi there! What can I get you?", translation: "안녕하세요! 뭐 드릴까요?" },
  {
    who: "learner",
    text: "I go to gym yesterday",
    better: "I went to the gym yesterday",
  },
  // No gloss: a line the character wrote just now, which is tappable for one.
  { who: "tutor", text: "Nice! Was it busy?" },
  {
    who: "learner",
    text: "I very like this coffee",
    about: "'I very like' 대신 'I really like'라고 해요.",
  },
  { who: "learner", text: "Can I get a latte please" },
  { who: "tutor", text: "Sure. What size — small or large?", translation: "네. 사이즈는 스몰이요, 라지요?" },
  { who: "learner", text: "um... the, the big one?", stuck: SIZE_TURN },
  {
    who: "tutor",
    text: "Large it is. For here, or to go?",
    translation: "라지로 드릴게요. 드시고 가세요, 가져가세요?",
  },
];

/**
 * Saying the line back, with the microphone and the model both stood in for.
 *
 * A fixed mishearing, so the marked-up attempt can be looked at: the recogniser
 * "hears" please as peace, which is the case the whole comparison exists for.
 */
async function sayItBack(target: string) {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return {
    heard: target.toLowerCase().replace("please", "peace"),
    practice: {
      good: false,
      note: "'please'가 'peace'로 들렸어요. p 다음에 l 소리를 붙여서 '플리즈'처럼 이어 보세요.",
    },
  };
}

export default function RoleplayReviewPreview() {
  const ui = copy.ko;
  const [shown, setShown] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#050505] p-4 text-neutral-200">
      <h1 className="text-sm font-semibold text-white">/dev/roleplay-review</h1>
      <p className="mt-1 text-[12px] text-neutral-500">
        진짜 컴포넌트, 가짜 대화. 말풍선의 버튼을 누르거나 아래에서 상태를 고르세요.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {CASES.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setShown(index)}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-[12px] hover:bg-white/10"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* The scene is a fixed layer in the app, so the panel positions against
          its nearest positioned ancestor. This stands in for it. */}
      <div className="relative mt-4 h-[600px] max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#050505]">
        <ol className="h-full overflow-y-auto p-3">
          {TRANSCRIPT.map((line, index) => (
            <RoleplayLine
              key={index}
              line={line}
              ui={ui}
              onReview={() => setShown(0)}
            onTranslate={(text) => console.log("[dev] translate asked for:", text)}
            />
          ))}
        </ol>

        {shown !== null ? (
          <RoleplayReviewPanel
            turn={CASES[shown]!.turn}
            review={CASES[shown]!.review}
            failed={CASES[shown]!.failed}
            ui={ui}
            onClose={() => setShown(null)}
            onSayItBack={sayItBack}
          />
        ) : null}
      </div>
    </main>
  );
}
