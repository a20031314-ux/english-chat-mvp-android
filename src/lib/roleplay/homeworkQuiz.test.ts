import { test } from "node:test";
import assert from "node:assert/strict";
import { homeworkQuiz, sceneAfterQuiz } from "./homeworkQuiz.ts";


test("대화 시뮬레이션: 퀴즈에서 쓴 조각은 빈칸 없이(뜻만 보고 한 줄) — 스페인어·일본어", () => {
  const scene = {
    kind: "sim" as const,
    lines: [
      { who: "tutor" as const, text: "¿Qué tal?" },
      { who: "me" as const, text: "Estoy muy cansada porque trabajé mucho.", meaning: "많이 일해서 피곤해요.", piece: "Estoy muy cansada" },
      { who: "tutor" as const, text: "¿Y mañana?" },
      { who: "me" as const, text: "Mañana descanso en casa.", meaning: "내일은 집에서 쉬어요.", piece: "descanso en casa" },
      { who: "me" as const, text: "昨日テレビを見ました。", meaning: "어제 TV를 봤어요.", piece: "テレビを見ました" },
    ],
  };
  const quiz = [
    { kind: "spot", text: "Yo soy muy cansada", right: "Estoy muy cansada", words: [], bad: [0], want: "estoy", from: "card" },
    { kind: "type", text: "昨日テレビを見ました。", before: "昨日", after: "。", answer: "テレビを見ました", gloss: { en: "", raw: "" }, from: "homework" },
  ] as never;
  const out = sceneAfterQuiz(scene, quiz).lines.map((line) => (line.who === "me" ? line.piece : "-"));
  assert.deepEqual(out, ["-", null, "-", "descanso en casa", null]);
  assert.equal(sceneAfterQuiz(scene, []), scene);
});

test("숙제 빈칸: 통화에서 한 말을 다듬은 줄만, 같은 줄에 조각 꼴이 또 있으면 안 비움 — 스페인어·일본어", () => {
  const said = [
    { who: "tutor" as const, text: "¿Qué tal el trabajo?" },
    { who: "learner" as const, text: "Ayer trabajo en la noche y hoy trabajo por la mañana" },
    { who: "learner" as const, text: "Mi compañera es muy simpática y trabajamos juntas" },
    { who: "learner" as const, text: "昨日 友達と ラーメン たべました" },
  ];
  const scenes = [
    {
      kind: "sim" as const,
      lines: [
        { who: "tutor" as const, text: "¿Qué tal?" },
        { who: "me" as const, text: "Ayer trabajé por la noche y hoy también trabajo por la mañana.", meaning: "어제는 밤에 일했고 오늘은 아침에 일해요.", piece: "por la noche" },
        { who: "me" as const, text: "Mi compañera es muy simpática y siempre trabajamos juntas.", meaning: "동료가 친절하고 늘 같이 일해요.", piece: "siempre trabajamos juntas" },
        { who: "me" as const, text: "Al principio me costaba, pero ahora ya me manejo bastante bien.", meaning: "처음엔 힘들었지만 지금은 꽤 잘해요.", piece: "me manejo bastante bien" },
        { who: "me" as const, text: "昨日友達とラーメンを食べました。", meaning: "어제 친구랑 라멘을 먹었어요.", piece: "ラーメンを食べました" },
      ],
    },
  ];
  const answers = homeworkQuiz("es", said, scenes).map((question) => (question.kind === "type" ? question.answer : question.kind));
  assert.ok(!answers.includes("por la noche"), "같은 줄의 por la mañana가 꼴을 보여 줌");
  assert.ok(answers.includes("siempre trabajamos juntas"), "통화 말을 다듬은 줄");
  assert.ok(!answers.includes("me manejo bastante bien"), "통화에 없던 줄");
  assert.ok(answers.includes("ラーメンを食べました"), "띄어쓰기 없는 줄도 글자로 닮음을 봄");
});

test("숙제 고치기: 코치 한마디가 있으면 답한 뒤 왜(Quizbank 틀린 곳과 같게) — es·ja", () => {
  const said = [
    { who: "tutor" as const, text: "¿Qué tal?" },
    { who: "learner" as const, text: "Yo soy muy cansada hoy", better: "Yo estoy muy cansada hoy", about: "상태는 estar" },
    { who: "learner" as const, text: "昨日映画を見ます", better: "昨日映画を見ました" },
  ];
  const quiz = homeworkQuiz("es", said, []);
  const withWhy = quiz.find((q) => q.kind === "spot" && q.right.includes("estoy"));
  assert.ok(withWhy?.kind === "spot" && withWhy.why?.ko === "상태는 estar");
  const ja = homeworkQuiz("ja", said.slice(2), []);
  assert.ok(ja[0]?.kind === "spot" && !ja[0].why, "한마디가 없으면 왜 없음");
});

test("대화 시뮬레이션: 짧은 답(la·a)은 낱말로 비교 — 다른 낱말 속 글자로는 안 지움, 태국어도 낱말로", () => {
  const scene = {
    kind: "sim" as const,
    lines: [
      { who: "me" as const, text: "Después lavo los platos.", meaning: "그다음 설거지해요.", piece: "lavo los platos" },
      { who: "me" as const, text: "Voy a la playa.", meaning: "해변에 가요.", piece: "a la playa" },
      { who: "me" as const, text: "ฉันไปตลาดเมื่อวาน", meaning: "어제 시장에 갔어요.", piece: "ไปตลาด" },
    ],
  };
  const quiz = [
    { kind: "type", text: "Voy a la playa.", before: "Voy a ", after: " playa.", answer: "la", gloss: { en: "", raw: "" }, from: "homework" },
    { kind: "type", text: "ฉันไปตลาด", before: "ฉัน", after: "", answer: "ไปตลาด", gloss: { en: "", raw: "" }, from: "homework" },
  ] as never;
  const out = sceneAfterQuiz(scene, quiz, "es").lines.map((line) => line.piece);
  assert.equal(out[0], "lavo los platos");
  assert.equal(out[1], null);
  const th = sceneAfterQuiz(scene, quiz, "th").lines.map((line) => line.piece);
  assert.equal(th[2], null);
});
