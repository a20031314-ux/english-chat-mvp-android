/**
 * 튜터와 통화로 하는 게임(2026-11-08 사용자 "튜터의 퀴즈, 게임 이런 것도" · "튜터 프로필에 자유대화, 수업, 게임으로 나눠줘").
 * 통화 화면·목소리·받아쓰기는 자유대화 그대로고, 감독(director.ts)에게 이번 통화가 어떤 게임인지만 더 알린다.
 *
 * - quiz 퀴즈: 튜터가 한 차례에 한 문제 — 지난 통화에서 고친 말(fixes)이 있으면 그것부터, 없으면 그 수준의 일상 낱말·꼴.
 *   다섯 문제마다 점수를 말하고 한 판 더 할지 묻는다.
 * - twenty 스무고개: 앱이 정한 것(secret, 영어로 — 튜터가 학습 언어로 옮김)을 튜터만 알고, 학습자가 예/아니오 질문으로 맞힌다.
 *   튜터가 맞혔다고(또는 스무 번) 판을 끝내면 "round": "over" → 앱이 다음 것을 고른다. 앱이 들고 있어야 판 가운데 답이 바뀌지 않는다.
 *
 * 예문은 지시에 넣지 않는다(RULES — 모델이 그대로 베낀 적이 있음).
 */

export type CallGame = "quiz" | "twenty";
export const CALL_GAMES: readonly CallGame[] = ["quiz", "twenty"];

export function isCallGame(value: unknown): value is CallGame {
  return typeof value === "string" && (CALL_GAMES as readonly string[]).includes(value);
}

/** 퀴즈 한 판 문제 수. */
export const QUIZ_ROUND = 5;
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
  hasFixes?: boolean;
}): string {
  const { game, target, native, count } = input;
  const common = `This call is a game the learner chose, and the game comes first: play it rather than steering the talk anywhere else. Stay warm and quick, speak ${target}, short turns, words at their level. If they ask to stop or to just talk, stop the game and talk normally.`;
  if (game === "quiz") {
    const asked = Math.min(count, QUIZ_ROUND);
    return [
      common,
      `The game is a spoken quiz: you are the quizmaster and ask one short question a turn, ${QUIZ_ROUND} questions to a round.`,
      input.start
        ? `This is your first line: greet them in a few words, say in easy ${target} that you will play a quiz of ${QUIZ_ROUND} questions, and ask question 1.`
        : `They have answered ${asked} of this round's questions; their last line is their answer to question ${asked}.`,
      `Kinds of question, mixed: give a word or a short phrase written in ${native} — in ${native} words and script, never in ${target}, in quotation marks; it is the only ${native} in your line — and ask how to say it in ${target}; ask something whose natural answer needs a particular form (a past action, a plan, a comparison) and check the form; give a short sentence with one mistake and ask them to say it right. ${
        input.hasFixes
          ? "Draw the questions from the corrections from earlier calls first — the sentences said right are what they need to practise — then from everyday words."
          : "Use everyday words and forms at their level."
      } Never ask something whose answer is already in your question.`,
      start(input)
        ? ""
        : `Each turn: first say plainly whether their answer was right — start with a clear "right" or "not quite" in ${target}; an answer that does not answer the question is not right, and you do not rephrase it as if it were; if it was not right, say the right answer once, short. Then ${
            asked >= QUIZ_ROUND
              ? `the round is over: tell them how many of the ${QUIZ_ROUND} they got right (count from the conversation) and ask whether they want another round. If they want another, start again with question 1.`
              : `ask question ${asked + 1}, and say its number.`
          }`,
      `Leave "better", "meant" and "smoother" empty when their line was only an answer to a quiz question — the quiz itself says what was right.`,
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
