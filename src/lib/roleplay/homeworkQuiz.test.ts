import test from "node:test";
import assert from "node:assert/strict";
import { homeworkQuiz } from "./homeworkQuiz.ts";
import { parseReplay } from "./replay.ts";

const scenes = parseReplay({
  scenes: [
    {
      kind: "same",
      lines: [
        { who: "tutor", text: "¿Qué tal tu día?" },
        { who: "me", text: "Bien, pero estoy muy cansada.", meaning: "좋은데 많이 피곤해요.", piece: "estoy muy cansada" },
        { who: "tutor", text: "¿Trabajaste mucho?" },
        { who: "me", text: "Sí, trabajé mucho hoy.", meaning: "네, 오늘 일 많이 했어요.", piece: "trabajé mucho hoy" },
      ],
    },
  ],
});

test("숙제 퀴즈: 고친 내 줄이 먼저(틀린 곳 고치기), 그다음 장면 조각 빈칸", () => {
  const said = [
    { who: "tutor" as const, text: "¿Qué tal?" },
    { who: "learner" as const, text: "Yo soy cansada.", better: "Yo estoy cansada." },
    { who: "learner" as const, text: "…" },
  ];
  const quiz = homeworkQuiz("es", said, scenes);
  assert.equal(quiz[0]!.kind, "spot");
  assert.deepEqual(quiz.slice(1).map((q) => q.kind), ["type", "type"]);
  const blank = quiz[1] as Extract<(typeof quiz)[number], { kind: "type" }>;
  assert.equal(blank.answer, "estoy muy cansada");
  assert.equal(blank.before + blank.answer + blank.after, "Bien, pero estoy muy cansada.");
  assert.equal(blank.gloss.raw, "좋은데 많이 피곤해요.");
});

test("숙제 퀴즈: 띄어쓰기 없는 일본어도 조각 자리, 고친 게 없으면 장면만", () => {
  const ja = parseReplay({
    scenes: [
      {
        kind: "same",
        lines: [
          { who: "tutor", text: "週末はどうでしたか？" },
          { who: "me", text: "よかったです。友達に会いました。", meaning: "좋았어요. 친구를 만났어요.", piece: "友達に会いました" },
          { who: "tutor", text: "何をしましたか？" },
          { who: "me", text: "一緒にラーメンを食べました。", meaning: "같이 라멘을 먹었어요.", piece: "一緒に" },
        ],
      },
    ],
  });
  const quiz = homeworkQuiz("ja", [{ who: "learner", text: "はい" }], ja);
  assert.equal(quiz.length, 2);
  assert.ok(quiz.every((q) => q.kind === "type"));
  assert.equal(homeworkQuiz("ja", [], []).length, 0);
});
