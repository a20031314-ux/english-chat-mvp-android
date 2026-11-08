/**
 * 튜터와 통화로 하는 게임(2026-11-08 사용자 "튜터의 퀴즈, 게임 이런 것도" · "튜터 프로필에 자유대화, 수업, 게임으로 나눠줘").
 * 통화 화면·목소리·받아쓰기는 자유대화 그대로고, 감독(director.ts)에게 이번 통화가 어떤 게임인지만 더 알린다.
 *
 * - quiz 퀴즈는 뺌(사용자 2026-11-08 "퀴즈 모드는 일단 삭제").
 * - twenty 스무고개: 앱이 정한 것(secret, 영어로 — 튜터가 학습 언어로 옮김)을 튜터만 알고, 학습자가 예/아니오 질문으로 맞힌다.
 *   튜터가 맞혔다고(또는 스무 번) 판을 끝내면 "round": "over" → 앱이 다음 것을 고른다. 앱이 들고 있어야 판 가운데 답이 바뀌지 않는다.
 *
 * - teach 가르치기(상급, 2026-11-08 사용자 "튜터한테 사용 언어 가르쳐 주기 — 한국어가 어눌한 미국인을 튜터가 연기"):
 *   튜터는 학습 언어 원어민인데 학습자의 모국어(앱 언어)도 대화는 되는 사람(원어민급 아님 — 그 나라 사람이 흔히 하는 실수, 사용자 2026-11-08).
 *   차례마다 앱 언어 문장 하나에 실수 하나 → 학습자가 학습 언어로 고쳐 주고 설명("you can say …"), 가끔 앱 언어에 대해 묻기.
 *   누구나 열 수 있고 이름 옆에 "상급"만(잠그지 않음).
 *
 * 예문은 지시에 넣지 않는다(RULES — 모델이 그대로 베낀 적이 있음).
 */

export type CallGame = "twenty" | "teach";
export const CALL_GAMES: readonly CallGame[] = ["twenty", "teach"];

export function isCallGame(value: unknown): value is CallGame {
  return typeof value === "string" && (CALL_GAMES as readonly string[]).includes(value);
}

/** 가르치기에서 튜터가 앱 언어 문장에 넣을 실수 — 차례마다 돌려서(모델은 그냥 두면 맞는 문장을 말한다, 2026-11-08 운영 확인). */
export const SLIPS: readonly string[] = [
  "use the wrong particle, case or preposition",
  "use the wrong ending or form of the verb",
  "use the wrong tense",
  "put a word in the wrong place",
  "use a word that is close in meaning but wrong here",
  "use the wrong level of politeness for the situation",
];

/** 스무고개 한 판 질문 수. */
export const TWENTY_ROUND = 20;

/**
 * 스무고개 답 후보 — 1~2단계 학습자도 아는 흔한 것, 나라·문화에 덜 묶인 것.
 * 먹을 것·마실 것은 일부러 적게(자유대화에서 커피·차만 나오던 일, 2026-11-08).
 */
export const TWENTY_THINGS: readonly string[] = [
  "a cat", "a dog", "an elephant", "a fish", "a bird", "a horse", "a rabbit",
  "a bicycle", "a bus", "a train", "an airplane", "a car", "a boat",
  "a chair", "a bed", "a table", "a window", "a door", "a clock", "a lamp",
  "a phone", "a computer", "a television", "a camera", "an umbrella", "a key", "a bag",
  "a book", "a pen", "a shoe", "a hat", "a glove",
  "the sun", "the moon", "a tree", "a flower", "the sea", "a mountain", "rain", "snow",
  "a school", "a hospital", "a library", "a park", "a beach", "a kitchen",
  "an apple", "a banana", "bread", "an egg", "ice cream",
];

/** 다음 스무고개 답 — 이번 통화에서 이미 낸 것은 빼고. `random`은 0 이상 1 미만(테스트에서 고정). */
export function pickSecret(used: readonly string[], random: () => number = Math.random): string {
  const left = TWENTY_THINGS.filter((thing) => !used.includes(thing));
  const pool = left.length ? left : TWENTY_THINGS;
  return pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))]!;
}

/**
 * 감독에게 줄 게임 규칙(차례마다). `count` = 이번 판에서 학습자가 지금까지 한 차례 수, `start` = 통화 첫 마디(튜터가 먼저).
 * 자유대화의 다른 지시(어디로 이끌지 등)보다 앞선다.
 */
export function gameRules(input: {
  game: CallGame;
  target: string;
  native: string;
  count: number;
  start?: boolean;
  secret?: string;
}): string {
  const { game, target, native, count } = input;
  const common = `This call is a game the learner chose, and the game comes first: play it rather than steering the talk anywhere else. Stay warm and quick, speak ${target}, short turns, words at their level. If they ask to stop or to just talk, stop the game and talk normally.`;
  if (game === "teach") {
    return [
      `This call is a role-play the learner chose for advanced practice, and it comes first: keep it going rather than steering the talk anywhere else. If they ask to stop or to just talk, drop the role and talk normally.`,
      `Your role: you are a native speaker of ${target} who also speaks ${native} — well enough to hold a conversation, but not like a native: you make the mistakes a real ${target} speaker makes in ${native} (a wrong particle or ending, a wrong form of the verb, a word in the wrong place, a word that is close but not right). The learner speaks ${native} as their first language, so here they are your teacher. Talk with them in ${target}, natural and at an everyday adult pace (do not simplify your ${target} for them).`,
      `Most turns, say one short sentence in ${native} that carries the talk on — about your own day, work, plans, places or what they told you; not about food or drinks — written in ${native} script, with exactly one such mistake in it, then ask in ${target} whether you said it right. Build it like this: write the correct sentence in "slip_right", then break one thing in it — this turn, ${SLIPS[input.count % SLIPS.length]} — so the sentence you say is really wrong; the ${native} sentence in "say" must differ from "slip_right"; a sentence with no mistake is a wasted turn. Say only the wrong one. They correct you and explain in ${target}; take the correction, say the right sentence once, and use it. Other turns ask a question about ${native} instead (below).`,
      input.start
        ? `This is your first line: greet them in a few words of ${target}, say you speak some ${native} and want to get better with their help, then say one short ${native} sentence with one mistake in it and ask whether it was right.`
        : "",
      `Questions about ${native}, to make them explain in ${target}: often simply how to say something: give a word or a short everyday sentence in ${target} and ask how to say it in ${native}, then ask them to say it slowly or explain a part of it. Other times: what a word or saying means, how two similar words differ, when people say a set phrase, why it is said that way, how polite something is, what to say in a situation. Pick things a learner of ${native} really trips on, and vary them; do not ask about the same thing twice.`,
      `Make them explain properly: if their answer is short or vague, ask a follow-up (an example, when exactly, what if I said it to my boss). Then use what they taught you in your next ${native} line, and thank them like a learner would. Do not make the same mistake twice once they fixed it.`,
      `You are the student here: do not correct their ${target} out loud and do not teach them anything. Put a correction of their ${target} only in "better" as usual, when there is a real mistake.`,
    ]
      .filter(Boolean)
      .join("\n");
  }
  const secret = input.secret?.trim() || TWENTY_THINGS[0]!;
  return [
    common,
    `The game is twenty questions. The thing you are thinking of this round is ${secret} — say it in ${target} only when they guess it or when the round is over, never before, and never hint at its name.`,
    input.start
      ? `This is your first line: greet them in a few words and explain in easy ${target}: you are thinking of one everyday thing (an animal, an object, a place or something in nature) and they ask yes-or-no questions to find it, up to ${TWENTY_ROUND}. Then invite their first question.`
      : `They have asked ${count} question${count === 1 ? "" : "s"} this round, so ${Math.max(0, TWENTY_ROUND - count)} are left — say that number, do not count again yourself.`,
    start(input)
      ? ""
      : `Each turn: if their line is a yes-or-no question, answer it truly for ${secret} — yes or no, with at most one short extra sentence — and say how many questions are left (the number above). If it is a guess, say whether it is right. If it is not a question, help them ask one by giving the first words of a question they could ask. When they guess it, or after ${TWENTY_ROUND} questions, say what it was, a few warm words, and ask whether they want another round; that turn set "round" to "over". On every other turn leave "round" empty.`,
    `Their question may have small mistakes: answer what they meant; correct them only in "better" as usual.`,
  ]
    .filter(Boolean)
    .join("\n");
}

function start(input: { start?: boolean }): boolean {
  return Boolean(input.start);
}

/** 감독 답의 "round" — 스무고개에서만 "over"를 받는다. */
export function roundOverOf(record: { round?: unknown }, game: CallGame | undefined): boolean {
  return game === "twenty" && typeof record.round === "string" && record.round.trim().toLowerCase() === "over";
}

/** 이번 판에서 학습자가 말한 차례 수(말없는 차례 "…"는 안 셈). */
export function learnerTurns(lines: readonly { who: string; text: string }[]): number {
  return lines.filter((line) => line.who === "learner" && line.text.trim() && line.text.trim() !== "…").length;
}
