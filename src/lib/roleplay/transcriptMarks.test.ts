import { test } from "node:test";
import assert from "node:assert/strict";
import { markAboutTheirLine, markMissed, markStuck, tallyCall, tipOnLastTutorLine, withTranslation } from "./transcriptMarks.ts";
import type { TranscriptLine } from "./review.ts";

const ja: TranscriptLine[] = [
  { who: "tutor", text: "週末は何をしましたか？" },
  { who: "learner", text: "昨日友達を会いました" },
];
const es: TranscriptLine[] = [
  { who: "tutor", text: "¿Qué hiciste ayer?" },
  { who: "learner", text: "Yo ir al parque." },
  { who: "tutor", text: "¿Con quién fuiste?" },
];

test("고친 말은 마지막 내 줄 아래에(일본어)", () => {
  const out = markAboutTheirLine(ja, { better: "昨日友達に会いました" });
  assert.equal(out[1]!.better, "昨日友達に会いました");
  assert.equal(ja[1]!.better, undefined, "받은 배열은 그대로");
});

test("막힌 차례는 바로 앞 튜터 줄을 질문으로(스페인어 — 마지막 튜터 줄이 아니라 내 줄 앞)", () => {
  const out = markStuck(es, { heard: "Yo ir al parque.", attempts: 2, hesitationMs: 900, history: [] });
  assert.equal(out[1]!.stuck?.asked, "¿Qué hiciste ayer?");
  assert.equal(out[1]!.stuck?.attempts, 2);
});

test("내 줄이 없으면 그대로", () => {
  const only: TranscriptLine[] = [{ who: "tutor", text: "Hello" }];
  assert.equal(markAboutTheirLine(only, { meant: "x" }), only);
  assert.equal(markStuck(only, { heard: "", attempts: 1, hesitationMs: 0, history: [] }), only);
});

test("힌트 문장은 마지막 튜터 줄에 한 번만", () => {
  const once = tipOnLastTutorLine(es, "Fui con mi hermana — 여동생이랑 갔어");
  assert.equal(once[2]!.tip, "Fui con mi hermana — 여동생이랑 갔어");
  assert.equal(tipOnLastTutorLine(once, "다른 것"), once);
});

test("번역은 같은 글의 번역 없는 튜터 줄에만", () => {
  const lines: TranscriptLine[] = [...ja, { who: "tutor", text: "週末は何をしましたか？", translation: "이미 있음" }];
  const out = withTranslation(lines, "週末は何をしましたか？", "주말에 뭐 했어요?");
  assert.equal(out[0]!.translation, "주말에 뭐 했어요?");
  assert.equal(out[2]!.translation, "이미 있음");
  assert.equal(out[1]!.translation, undefined);
});

test("못 알아들은 표시는 튜터 줄에만, 한 번만", () => {
  const out = markMissed(es, 2);
  assert.equal(out[2]!.missed, true);
  assert.equal(markMissed(out, 2), out);
  assert.equal(markMissed(es, 1), es, "내 줄에는 안 붙임");
});

test("통화 요약 수: 고친 말·힌트·못 알아들은 말(일본어·스페인어 섞어)", () => {
  const lines: TranscriptLine[] = [
    { who: "tutor", text: "週末は何をしましたか？", missed: true },
    { who: "tutor", text: "週末、何した？", again: true, tip: "映画を見ました — 영화 봤어요" },
    { who: "learner", text: "昨日友達を会いました", better: "昨日友達に会いました" },
    { who: "learner", text: "Yo ir al parque", meant: "Fui al parque" },
    { who: "learner", text: "Sí." },
  ];
  assert.deepEqual(tallyCall(lines), { fixed: 2, hints: 1, missed: 1, redone: 0 });
});

test("튜터 수업: 다시 말해 맞힌 줄(🔁)을 세고, 맨 마지막 내 줄에 맞힘/아직을 붙인다(일본어·스페인어)", () => {
  const lines: TranscriptLine[] = [
    { who: "tutor", text: "昨日友達に会いました。もう一回言ってみて？" },
    { who: "learner", text: "昨日友達に会いました" },
  ];
  const marked = markAboutTheirLine(lines, { redo: "pass" });
  assert.equal(marked[1]!.redo, "pass");
  const es: TranscriptLine[] = [
    ...marked,
    { who: "tutor", text: "Casi. Fui al parque. ¿Otra vez?" },
    { who: "learner", text: "Yo fui parque", redo: "miss" },
  ];
  assert.deepEqual(tallyCall(es), { fixed: 0, hints: 0, missed: 0, redone: 1 });
});
