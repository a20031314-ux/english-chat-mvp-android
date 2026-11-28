import { test } from "node:test";
import assert from "node:assert/strict";
import { codeOf, grammarList, readTags, tagPrompt, type OpeningLine } from "./talkTags.ts";
import { answerGain, applyTalkTags, markPieces, readAnswers, readFirstUses } from "./talkMemory.ts";
import { saveCallNote } from "./callNotes.ts";
import type { TranscriptLine } from "./review.ts";

function memoryStore() {
  const map = new Map<string, string>();
  return { getItem: (k: string) => map.get(k) ?? null, setItem: (k: string, v: string) => void map.set(k, v), removeItem: (k: string) => void map.delete(k) };
}

test("표시 읽기: 목록 안 문법 id만 내 줄에, 질문 종류는 튜터 줄에 (es·ja)", () => {
  for (const language of ["es", "ja"]) {
    const list = grammarList(language);
    assert.ok(list.length >= 20, `${language} ${list.length}`);
    const opening: OpeningLine[] = [{ who: "tutor", text: "q?" }, { who: "learner", text: "a" }];
    const tags = readTags(language, opening, { uses: { "1": [codeOf(list[0]!.id), "G99-99"], "0": [codeOf(list[1]!.id)] }, asks: { "0": "weekend", "1": "food", "5": "day" } });
    assert.deepEqual(tags.uses, { 1: [`g|${list[0]!.id}`] });
    assert.deepEqual(tags.asks, { 0: "weekend" });
    assert.ok(tagPrompt(language, opening).includes(codeOf(list[0]!.id)));
    // 앱이 서버 답(이미 g|단계:번호)을 다시 걸러도 그대로.
    assert.deepEqual(readTags(language, opening, { uses: tags.uses as never, asks: {} }).uses, tags.uses);
    assert.equal(tagPrompt(language, [{ who: "tutor", text: "q?" }]), "");
  }
});

test("표시 적용: 문형 칸 숫자·처음 쓴 것·같은 질문 대답(처음·마지막), 고쳐진 줄은 안 셈", () => {
  const store = memoryStore();
  const language = "es";
  const g = grammarList(language);
  const day1 = Date.UTC(2026, 10, 1, 3);
  const day9 = Date.UTC(2026, 10, 9, 3);
  const call = (id: string, at: number, said: TranscriptLine[], uses: Record<number, string[]>) => {
    saveCallNote(language, { id, at, secs: 300, title: "t", fixed: 0, hints: 0, redone: 0 } as never, store);
    applyTalkTags({ language, callId: id, said, tags: { uses, asks: { 0: "weekend" } }, at }, store);
  };
  call("a", day1, [{ who: "tutor", text: "¿Qué hiciste el fin de semana?" }, { who: "learner", text: "Playa" }, { who: "learner", text: "Yo ir playa", better: "Fui a la playa" }], { 2: [`g|${g[5]!.id}`] });
  call("b", day9, [{ who: "tutor", text: "¿Y este fin de semana?" }, { who: "learner", text: "Fui a la playa con mi hermana y comimos paella" }], { 1: [`g|${g[5]!.id}`] });
  assert.equal(readFirstUses(language, store)[`g|${g[5]!.id}`]!.at, day9);
  const gain = answerGain(language, readAnswers(language, store), readFirstUses(language, store), (ms) => new Date(ms).toISOString().slice(0, 10))!;
  assert.equal(gain.first.a, "Playa");
  assert.ok(gain.after - gain.before >= 3);
  assert.deepEqual(gain.keys, [`g|${g[5]!.id}`], "처음 맞게 쓴 문법");
  // 밑줄은 칩이 가리키는 조각만 — 새 낱말 전부가 아니라(사용자 2026-11-28)
  const line = "Nothing but it is just packed so I can make it easily";
  assert.deepEqual(markPieces(line, ["I can ", "can"]).map(([a, b]) => line.slice(a, b)), ["I can"]);
  assert.deepEqual(markPieces("Candy can help", ["can"]).map(([a, b]) => "Candy can help".slice(a, b)), ["can"], "낱말 안의 can은 아님");
  assert.deepEqual(markPieces("友達とカフェに行きました", ["行き"]), [[7, 9]], "띄어쓰기 없는 말은 그대로 찾음");
});

test("그날 지우기: 그날 대답·처음 쓴 것을 지움, 고쳐진 대답은 짝에 안 들어감", async () => {
  const { forgetTalkDay } = await import("./talkMemory.ts");
  const store = memoryStore();
  const language = "es";
  const g = grammarList(language);
  const day1 = Date.UTC(2026, 10, 1, 3);
  saveCallNote(language, { id: "x", at: day1, secs: 300, title: "t", fixed: 0, hints: 0, redone: 0 } as never, store);
  applyTalkTags({ language, callId: "x", said: [{ who: "tutor", text: "¿Qué tal el día?" }, { who: "learner", text: "Yo estar bien", better: "Estoy bien" }, { who: "tutor", text: "¿Y el fin de semana?" }, { who: "learner", text: "Fui a la playa" }], tags: { uses: { 3: [`g|${g[8]!.id}`] }, asks: { 0: "day", 2: "weekend" } }, at: day1 }, store);
  const answers = readAnswers(language, store);
  assert.equal(answers.day, undefined, "고쳐진 대답은 안 셈");
  assert.ok(answers.weekend);
  const iso = (ms: number) => new Date(ms).toISOString().slice(0, 10);
  forgetTalkDay(language, iso(day1), iso, store);
  assert.deepEqual(readAnswers(language, store), {});
  assert.deepEqual(readFirstUses(language, store), {});
});

test("answerGain: 되묻는 말·질문 되풀이로만 길어진 대답은 장면 없음, ja 낱말 세기", () => {
  const dayOf = (ms: number) => new Date(ms).toISOString().slice(0, 10);
  const d1 = Date.UTC(2026, 10, 26), d2 = Date.UTC(2026, 10, 27);
  const echo = { asks: { first: { at: d1, q: "Were you doing live coding there?", a: "I am doing live coding", n: 5 }, last: { at: d2, q: "Were you doing live coding there?", a: "Yeah, that's right. And what will you do today?", n: 9 } } };
  assert.equal(answerGain("en", echo as never, {}, dayOf), null);
  const ja = { weekend: { first: { at: d1, q: "週末は何をしましたか？", a: "カフェ", n: 1 }, last: { at: d2, q: "週末はどうでしたか？", a: "友達とカフェに行って、ケーキを食べました", n: 8 } } };
  const gain = answerGain("ja", ja as never, {}, dayOf)!;
  assert.ok(gain && gain.after - gain.before >= 3);
});
