import test from "node:test";
import assert from "node:assert/strict";
import { homeworkQuiz } from "./homeworkQuiz.ts";
import { parseReplay } from "./replay.ts";

const es = parseReplay({
  scenes: [
    {
      kind: "same",
      lines: [
        { who: "tutor", text: "¿Qué tal tu día?" },
        { who: "me", text: "Bien, pero estoy muy cansada.", meaning: "좋은데 많이 피곤해요.", piece: "estoy muy cansada" },
        { who: "tutor", text: "¿Trabajaste mucho?" },
        { who: "me", text: "Sí, trabajé mucho hoy en el hospital.", meaning: "네, 오늘 병원에서 일 많이 했어요.", piece: "en el hospital" },
        { who: "tutor", text: "¿Y mañana?" },
        { who: "me", text: "Mañana descanso. Voy a pasear con mi hija.", meaning: "내일은 쉬어요. 딸이랑 산책할 거예요.", piece: "pasear con mi hija" },
      ],
    },
  ],
});

type Q = ReturnType<typeof homeworkQuiz>[number];
const blankOf = (q: Q) => (q.kind === "type" ? q.answer : "");

test("숙제 퀴즈: 고친 줄은 바뀐 문장만 틀린 곳 고치기, 맞는 앞 문장은 안 나옴", () => {
  const said = [
    { who: "tutor" as const, text: "¿Qué tal?" },
    { who: "learner" as const, text: "Sí. Yo soy cansada.", better: "Sí. Estoy cansada." },
    { who: "learner" as const, text: "…" },
  ];
  const quiz = homeworkQuiz("es", said, es);
  const spot = quiz[0]!;
  assert.equal(spot.kind, "spot");
  if (spot.kind === "spot") {
    assert.equal(spot.text, "Yo soy cansada.");
    assert.equal(spot.want.toLowerCase(), "estoy");
  }
  // 고치기의 답(estoy)이 든 조각은 빈칸으로 다시 내지 않는다.
  assert.ok(!quiz.some((q) => blankOf(q).includes("estoy")));
  assert.deepEqual(quiz.slice(1).map(blankOf), ["en el hospital", "pasear con mi hija"]);
  const blank = quiz[1]!;
  if (blank.kind === "type") assert.equal(blank.gloss.raw, "네, 오늘 병원에서 일 많이 했어요.");
});

test("숙제 퀴즈: 통화에서 그대로 말한 조각·한 문장 통째·앱 언어가 섞인 줄은 안 냄 — 일본어", () => {
  const ja = parseReplay({
    scenes: [
      {
        kind: "same",
        lines: [
          { who: "tutor", text: "週末はどうでしたか？" },
          { who: "me", text: "よかったです。友達に会いました。", meaning: "좋았어요. 친구를 만났어요.", piece: "友達に会いました" },
          { who: "tutor", text: "何をしましたか？" },
          { who: "me", text: "一緒にラーメンを食べました。", meaning: "같이 라멘을 먹었어요.", piece: "一緒に" },
          { who: "tutor", text: "どうでしたか？" },
          { who: "me", text: "とてもおいしかったです。", meaning: "정말 맛있었어요.", piece: "とても" },
        ],
      },
    ],
  });
  const said = [
    { who: "learner" as const, text: "漫画を読みました、재밌어서", better: "漫画を読みました。面白かったです。" },
    { who: "learner" as const, text: "とても好きです" },
  ];
  const quiz = homeworkQuiz("ja", said, ja);
  assert.deepEqual(quiz.map((q) => q.kind), ["type"]);
  assert.equal(blankOf(quiz[0]!), "一緒に");
  assert.equal(homeworkQuiz("ja", [], []).length, 0);
});
