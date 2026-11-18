import { test } from "node:test";
import assert from "node:assert/strict";
import { gradeRedo, gradedCoachCard, hadFix, markAboutTheirLine, markMissed, markStuck, nextCoachCard, nextShownRedo, tallyCall, tipOnLastTutorLine, withTranslation } from "./transcriptMarks.ts";
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

test("코치 띠: 따라 말해 맞힌 줄을 세고, 맨 마지막 내 줄에 맞힘/아직을 붙인다(일본어·스페인어)", () => {
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

test("코치 띠 채점: 다 같으면·줄임말만 다르면 맞힘, 다른 꼴이면 아직(영어·스페인어·일본어)", () => {
  assert.equal(gradeRedo("I went to a café yesterday.", "I went to a café yesterday"), "pass");
  assert.equal(gradeRedo("I am going to the park.", "I'm going to the park"), "pass");
  assert.equal(gradeRedo("Ayer fui a la playa con mis amigos.", "Ayer fui a la playa con mis amigo"), "miss", "같은 낱말의 다른 꼴");
  assert.equal(gradeRedo("Ayer fui a la playa con mis amigos.", "Ayer fui la playa con mis amigos"), "pass", "긴 문장에서 한 낱말 빠짐");
  assert.equal(gradeRedo("Fui al parque.", "Fui parque"), "miss", "짧은 문장은 다 맞아야");
  assert.equal(gradeRedo("昨日友達に会いました。", "昨日友達に会いました"), "pass");
});

test("코치 띠 기다림: 아직이면 한 번 더, 두 번째면 끝, 다른 말이면 띠가 떠 있는 한 차례만", () => {
  const none = { line: "", tries: 0 };
  const wait = { line: "Ayer fui a la playa.", tries: 0 };
  assert.deepEqual(nextShownRedo(wait, { repeated: true, graded: "miss", cardUp: true }), { line: wait.line, tries: 1 });
  assert.deepEqual(nextShownRedo({ ...wait, tries: 1 }, { repeated: true, graded: "miss", cardUp: true }), none);
  assert.deepEqual(nextShownRedo(wait, { repeated: true, graded: "pass", cardUp: true }), none);
  assert.deepEqual(nextShownRedo(wait, { repeated: false, cardUp: true }), wait);
  assert.deepEqual(nextShownRedo(wait, { repeated: false, cardUp: false }), none);
  assert.deepEqual(nextShownRedo(none, { repeated: false, cardUp: true }), none);
});

test("코치 띠: 고친 말·더 자연스러운 말을 바로, 맞히면 ✓, 한 차례 흐리게 남겼다 사라짐(스페인어·일본어)", () => {
  const heard = "Ayer yo voy a la playa";
  const fix = nextCoachCard(null, { better: "Ayer fui a la playa.", note: "어제 일이라 과거형", heard });
  assert.deepEqual(fix, { kind: "fix", said: heard, right: "Ayer fui a la playa.", why: "어제 일이라 과거형" });
  const passed = gradedCoachCard(fix!, "pass", true);
  assert.equal(passed.passed, true);
  assert.equal(gradedCoachCard(fix!, "miss", true).old, true, "더 기다리지 않으면 흐림");
  const dim = nextCoachCard(fix, { heard: "Me gustó mucho" });
  assert.equal(dim?.old, true);
  assert.equal(nextCoachCard(dim, { heard: "Sí" }), null);
  const meant = nextCoachCard(null, { meant: "Vi una película el fin de semana.", heard: "vi película 주말에" });
  assert.equal(meant?.kind, "meant");
  const smooth = nextCoachCard(null, { smoother: "週末は海に行ってきました。", heard: "週末は海に行きました。" });
  assert.equal(smooth?.kind, "offer");
  assert.equal(nextCoachCard(null, { heard: "", better: "x" }), null, "들은 말 없으면 띠 없음");
});

test("숙제는 코치가 하나라도 고친 통화에만", () => {
  assert.equal(hadFix(ja), false);
  assert.equal(hadFix([...ja.slice(0, 1), { ...ja[1]!, better: "昨日友達に会いました。" }]), true);
  assert.equal(hadFix([{ who: "learner", text: "vi película", meant: "Vi una película." }]), true);
});
