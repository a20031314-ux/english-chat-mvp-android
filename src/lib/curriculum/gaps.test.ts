import assert from "node:assert/strict";
import test from "node:test";
import { addedPiece, gapKey, gapSources, gapsFromCards, mergeGaps, type GapItem } from "./gaps.ts";
import { buildQuiz, canQuiz, registerQuizSources } from "./quiz.ts";
import { nextStudy } from "./nextStudy.ts";
import { allScriptsFor } from "./stageScripts.ts";

test("고친 줄에 새로 들어간 말(스페인어·영어·일본어), 너무 길면 없음", () => {
  assert.equal(addedPiece("es", "Yo soy cansado hoy", "Yo estoy cansado hoy"), "estoy");
  assert.equal(addedPiece("en", "I go to school yesterday", "I went to school yesterday"), "went");
  assert.equal(addedPiece("ja", "私は学校に行きます昨日", "私は昨日学校に行きました"), addedPiece("ja", "私は学校に行きます昨日", "私は昨日学校に行きました"));
  const ja = addedPiece("ja", "駅はどこ", "駅はどこですか");
  assert.ok(ja && "駅はどこですか".includes(ja), String(ja));
  assert.equal(addedPiece("en", "hi", "hello there my good old friend"), null);
});

test("열쇠: 뼈대 표현이면 e|, 아니면 u| — 카드에서 최근 것 하나씩", () => {
  const expression = allScriptsFor("es").find((s) => s.stage === 1)!.expressions[0]!;
  assert.equal(gapKey("es", expression), `e|${expression}`);
  assert.equal(gapKey("es", "¡Estoy agotado!"), "u|estoy agotado");
  const gaps = gapsFromCards("es", [
    { wrong: "Yo soy cansado", right: "Yo estoy cansado", note: "estar", at: 2 },
    { wrong: "Ella es cansada", right: "Ella estoy cansada", note: "x", at: 1 },
    { wrong: "hola", right: "hola", note: "", at: 3, kind: "typo" },
  ]);
  assert.deepEqual(gaps.map((gap) => gap.key), ["u|estoy"]);
  assert.equal(gaps[0]!.card?.wrong, "Yo soy cansado");
});

test("뼈대 밖 막힌 것도 퀴즈가 되고(고르기·맞추기, 뜻이 있으면 말하기), 계속 공부에서 틀렸던 것 다음에(태국어·영어)", () => {
  const list: GapItem[] = [
    { key: "u|exhausted", text: "exhausted", sample: "I am really exhausted today.", meaning: "오늘 정말 녹초야", from: "howToSay", at: 3 },
    { key: "u|worn out", text: "worn out", sample: "She looks worn out after work.", from: "fix", at: 2 },
    { key: "u|starving", text: "starving", sample: "We were starving by noon.", from: "fix", at: 1 },
  ];
  registerQuizSources("en", list.map((gap) => ({ key: gap.key, sources: gapSources(gap) })));
  assert.ok(canQuiz("en", "u|exhausted"));
  const quiz = buildQuiz("en", "u|exhausted", { round: 0 })!;
  assert.ok(quiz.questions.some((q) => q.kind === "say"), "뜻이 있으면 말하기");
  const plain = buildQuiz("en", "u|worn out")!;
  assert.ok(plain && plain.questions.every((q) => q.kind !== "say"), "뜻 없으면 말하기 없음");
  const queue = nextStudy({ language: "en", stage: 1, passed: new Set(), review: {}, log: {}, weakest: null, gaps: list.map((gap) => gap.key), now: 1 });
  assert.equal(queue[0]?.reason, "gap");
  assert.equal(mergeGaps(list, [{ ...list[0]!, at: 9 }]).length, 3);
  const th: GapItem = { key: "u|เหนื่อยมาก", text: "เหนื่อยมาก", sample: "วันนี้เหนื่อยมากเลย", meaning: "오늘 너무 피곤해", from: "howToSay", at: 1 };
  registerQuizSources("th", [{ key: th.key, sources: gapSources(th) }]);
  assert.ok(buildQuiz("th", th.key) !== null);
});

test("서버: 퀴즈에서 한 번 맞히면 막힌 것도 뼈대 열쇠도 익힘(2026-11-01)", async () => {
  const { saveChecks, readKnown } = await import("../server/stageScriptStore.ts");
  const user = "rc:gap-test";
  await saveChecks(user, "en", { "u|exhausted": true, "e|thank you": true }, 1_000, true);
  const known = await readKnown(user, "en");
  assert.ok(known["u|exhausted"]);
  assert.ok(known["e|thank you"]);
});

test("찾아본 낱말·펼친 고친 줄도 막힌 것으로(이 폰) — 영어·일본어", async () => {
  const store = new Map<string, string>();
  (globalThis as { localStorage?: unknown }).localStorage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v), removeItem: (k: string) => void store.delete(k) };
  const { rememberLookup, rememberFix, readLocalGaps } = await import("./gaps.ts");
  rememberLookup("en", { word: "reluctant", example: "She was Reluctant to leave." });
  rememberLookup("en", { word: "nowhere", context: "hello" });
  rememberFix("ja", { wrong: "駅に行きました。", right: "駅まで歩いて行きました。" });
  const en = readLocalGaps("en");
  assert.equal(en.length, 1, "예문에 없는 낱말은 안 남김");
  assert.equal(en[0]!.from, "lookup");
  assert.equal(en[0]!.text, "Reluctant", "문장 속 모양 그대로");
  const ja = readLocalGaps("ja");
  assert.equal(ja.length, 1);
  assert.ok(ja[0]!.sample.includes(ja[0]!.text));
  delete (globalThis as { localStorage?: unknown }).localStorage;
});
