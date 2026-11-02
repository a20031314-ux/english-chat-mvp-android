import assert from "node:assert/strict";
import { test } from "node:test";
import { checkGrammarLesson, type GrammarLesson } from "./grammar.ts";
import { fixedQuizQuestions } from "./toQuiz.ts";
import { quizSources } from "../quiz.ts";
import { allFramesFor } from "../frames.ts";

const good: GrammarLesson = {
  key: "g|2:0",
  name: "과거시제",
  rule: "지난 일은 동사 과거형으로 — 규칙 동사는 -ed, 불규칙 동사는 꼴이 바뀜.",
  forms: [
    { from: "walk", to: "walked", note: "규칙: -ed" },
    { from: "go", to: "went", note: "불규칙" },
  ],
  exceptions: "",
  usage: "yesterday, last week처럼 끝난 때와 함께.",
  mistakes: [
    { wrong: "I goed home.", right: "I went home.", why: "go는 불규칙." },
    { wrong: "I visit her yesterday.", right: "I visited her yesterday.", why: "한국어처럼 때 말만으로 과거가 되지 않음." },
  ],
  quiz: [
    { kind: "type", before: "We ", after: " pizza last night.", answer: "ate", cue: "어젯밤 피자를 먹었어요." },
    { kind: "choose", before: "She ", after: " to work by bus.", options: ["went", "goed", "go", "gone"], answer: 0, cue: "그녀는 버스로 출근했어요." },
    { kind: "fix", wrong: "They play tennis yesterday.", bad: "play", right: "played", cue: "그들은 어제 테니스를 쳤어요." },
  ],
  turns: [
    { them: "What did you do yesterday?", themGloss: "어제 뭐 했어요?", me: "I cleaned my room.", meGloss: "방을 청소했어요.", piece: "cleaned" },
    { them: "Did you see the film?", themGloss: "그 영화 봤어요?", me: "Yes, I saw it on Friday.", meGloss: "네, 금요일에 봤어요.", piece: "saw" },
    { them: "How was the trip?", themGloss: "여행 어땠어요?", me: "It was great, we swam a lot.", meGloss: "좋았어요, 수영을 많이 했어요.", piece: "swam" },
  ],
};

test("문법 한 장 검사: 잘 쓴 것은 통과, 답이 보이거나·조각이 없거나·실수를 베끼면 오류", () => {
  assert.deepEqual(checkGrammarLesson(good), []);
  const leak = { ...good, quiz: [{ ...good.quiz[0]!, before: "We ate ", answer: "ate" } as GrammarLesson["quiz"][number], good.quiz[1]!, good.quiz[2]!] };
  assert.ok(checkGrammarLesson(leak).some((one) => one.what.includes("문제 글에 보임")));
  const noPiece = { ...good, turns: [{ ...good.turns[0]!, piece: "visited" }, good.turns[1]!, good.turns[2]!] };
  assert.ok(checkGrammarLesson(noPiece).some((one) => one.what.includes("조각")));
  const copied = { ...good, quiz: [good.quiz[0]!, good.quiz[1]!, { kind: "fix", wrong: "I goed home.", bad: "goed", right: "went", cue: "집에 갔어요." } as GrammarLesson["quiz"][number]] };
  assert.ok(checkGrammarLesson(copied).some((one) => one.what.includes("흔한 실수 예와 같음")));
  assert.deepEqual(fixedQuizQuestions("en", good.quiz, good.key).map((q) => q.kind), ["type", "choose", "spot"]);
});

test("문법 칸 퀴즈 재료는 그 문법을 쓰는 문장구조가 든 줄만(en·ja·es)", () => {
  for (const [language, key] of [["en", "g|2:0"], ["ja", "g|2:0"], ["es", "g|2:0"]] as const) {
    const [stage, index] = key.slice(2).split(":").map(Number);
    const linked = allFramesFor(language).filter((frame) => frame.stage === stage && (frame.grammar ?? []).includes(index!));
    const sources = quizSources(language, key);
    assert.ok(sources.length >= 2, `${language} ${sources.length}`);
    for (const source of sources) {
      if (source.from === "qbank") continue;
      assert.ok(linked.some((frame) => frame.core.some((core) => source.text.includes(core))), `${language}: ${source.text}`);
    }
  }
  assert.ok(!quizSources("en", "g|2:0").some((source) => source.text.includes("anything a little cheaper")));
});
