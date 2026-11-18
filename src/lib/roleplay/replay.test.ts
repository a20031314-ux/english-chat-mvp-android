import test from "node:test";
import assert from "node:assert/strict";
import { blanked, freshPieces, giveHomework, homeworkForToday, keepReplay, noteReplayResult, parseReplay, pieceSaid, readHomework, replayable, replayFor, replayPrompt, wholeLineOf, wholeSaid } from "./replay.ts";

const es = {
  scenes: [
    {
      kind: "sim",
      lines: [
        { who: "tutor", text: "¿Qué hiciste el fin de semana?" },
        { who: "me", text: "Fui a la playa con mi amiga y comimos mariscos.", meaning: "친구랑 바닷가에 가서 해산물을 먹었어요.", piece: "y comimos mariscos" },
        { who: "tutor", text: "¡Qué bien! ¿Te gustó?" },
        { who: "me", text: "Sí, me encantó porque hacía sol.", meaning: "네, 해가 나서 정말 좋았어요.", piece: "porque hacía sol" },
        { who: "tutor", text: "¿Vas a volver pronto?" },
        { who: "me", text: "Con mi familia, si tienen tiempo.", meaning: "가족이랑요, 시간이 되면요.", piece: "no está en la frase" },
      ],
    },
  ],
};

test("대화 시뮬레이션 하나: 조각이 줄에 없으면 빈칸 없이, 이름이 달라도 첫 쓸 만한 장면 하나", () => {
  const scenes = parseReplay(JSON.stringify(es));
  assert.equal(scenes.length, 1);
  assert.equal(scenes[0]!.kind, "sim");
  const last = scenes[0]!.lines[5]!;
  assert.equal(last.who === "me" ? last.piece : "x", null);
  assert.equal(blanked(scenes[0]!.lines[1] as never), "Fui a la playa con mi amiga ___.");
  const two = parseReplay({ scenes: [{ ...es.scenes[0]!, kind: "same" }, es.scenes[0]] });
  assert.equal(two.length, 1, "장면 둘이 와도 하나");
  assert.equal(two[0]!.kind, "sim");
});

test("장면 읽기: 내 줄이 셋보다 적으면 버림, 코드 울타리도 봐줌", () => {
  const short = { scenes: [{ kind: "sim", lines: es.scenes[0]!.lines.slice(0, 4) }] };
  assert.deepEqual(parseReplay(short), []);
  assert.equal(parseReplay("```json\n" + JSON.stringify(es) + "\n```").length, 1);
  assert.deepEqual(parseReplay("not json"), []);
  assert.equal(parseReplay(JSON.stringify({ scenes: JSON.stringify(es.scenes) })).length, 1);
  assert.equal(parseReplay(JSON.stringify({ scenes: JSON.stringify(es.scenes) + "}" })).length, 1);
  assert.equal(parseReplay("Here you go: " + JSON.stringify(es)).length, 1);
});

test("빈칸 맞음: 조각 낱말이 다 들리면 — 앞뒤는 봐줌, 띄어쓰기 없는 일본어도", () => {
  assert.equal(pieceSaid("y comimos mariscos", "fui a la playa y comimos mariscos"), true);
  assert.equal(pieceSaid("y comimos mariscos", "fui a la playa y comí mariscos"), false);
  assert.equal(pieceSaid("友達に会いました", "昨日は友達に会いました"), true);
  assert.equal(pieceSaid("友達に会いました", "昨日は友達を会いました"), false);
  assert.equal(pieceSaid("x", ""), false);
});

test("한 줄 전체: 쓴 것은 다 같아야, 말한 긴 줄은 80%", () => {
  const line = "Quiero volver el mes que viene con mi familia.";
  assert.equal(wholeSaid(line, "quiero volver el mes que viene con mi familia", true), true);
  assert.equal(wholeSaid(line, "quiero volver el mes que viene con familia", true), false);
  assert.equal(wholeSaid(line, "quiero volver el mes que viene con la familia", false), true);
  const scene = parseReplay(es)[0]!;
  assert.equal(wholeLineOf(scene)?.text, "Fui a la playa con mi amiga y comimos mariscos.");
});

test("연습할 통화: 내 말 둘 이상, 말없는 차례는 안 셈", () => {
  assert.equal(replayable([{ who: "learner", text: "Hola" }, { who: "learner", text: "…" }]), false);
  assert.equal(replayable([{ who: "learner", text: "Hola" }, { who: "tutor", text: "¿Qué tal?" }, { who: "learner", text: "Bien" }]), true);
});

test("지시: 대본·고친 말·앱 언어가 들어가고 베낄 예문은 없음", () => {
  const prompt = replayPrompt({ target: "Spanish", native: "Arabic", level: 2, lines: [{ who: "tutor", text: "¿Qué tal?" }, { who: "learner", text: "Yo ir playa", better: "Fui a la playa" }] });
  assert.match(prompt, /LEARNER: Yo ir playa {3}\(put right: Fui a la playa\)/);
  assert.match(prompt, /in Arabic/);
  assert.doesNotMatch(prompt, /level \d/);
  assert.match(prompt, /fluent speaker would naturally/);
});

class Memory {
  rows = new Map<string, string>();
  getItem(key: string) { return this.rows.get(key) ?? null; }
  setItem(key: string, value: string) { this.rows.set(key, value); }
}

test("저장: 이 폰에 통화마다, 결과를 남기면 그 통화 숙제가 끝남", () => {
  const store = new Memory() as unknown as Storage;
  const scenes = parseReplay(es);
  keepReplay(store, "es", { callId: "c1", scenes, results: {}, at: 1 });
  giveHomework(store, "es", { kind: "replay", callId: "c1", at: 1 });
  assert.equal(replayFor(store, "es", "c1")?.scenes.length, 1);
  assert.equal(replayFor(store, "ja", "c1"), null);
  noteReplayResult(store, "es", "c1", "sim", { ok: 2, of: 2, whole: true, at: 5 });
  assert.equal(replayFor(store, "es", "c1")?.results.sim?.ok, 2);
  assert.equal(readHomework(store, "es")?.done, 5);
});

test("빈칸: 통화에서 그대로 말한 조각은 비우지 않음(줄 전체로) — 스페인어·일본어", () => {
  const scenes = parseReplay(es);
  const fresh = freshPieces(scenes, [{ who: "learner", text: "Sí, porque hacía sol." }, { who: "tutor", text: "y comimos mariscos" }]);
  const pieces = fresh[0]!.lines.filter((line) => line.who === "me").map((line) => (line.who === "me" ? line.piece : ""));
  assert.deepEqual(pieces, ["y comimos mariscos", null, null]);
  const ja = parseReplay({ scenes: [{ kind: "sim", lines: [{ who: "tutor", text: "何を？" }, { who: "me", text: "一緒にラーメンを食べました。", meaning: "같이 라멘", piece: "ラーメンを食べました" }, { who: "tutor", text: "どう？" }, { who: "me", text: "おいしかったです。", meaning: "맛있었어요", piece: "おいしかった" }, { who: "tutor", text: "また行く？" }, { who: "me", text: "来週また行きたいです。", meaning: "다음 주에 또 가고 싶어요", piece: "また行きたい" }] }] });
  const jaFresh = freshPieces(ja, [{ who: "learner", text: "昨日、ラーメンを食べましたよ" }]);
  assert.equal(jaFresh[0]!.lines[1]!.who === "me" && jaFresh[0]!.lines[1]!.piece, null);
  assert.equal(jaFresh[0]!.lines[3]!.who === "me" && jaFresh[0]!.lines[3]!.piece, "おいしかった");
});

test("오늘의 학습 숙제: 안 끝냈거나 오늘 끝낸 것만 — 지난날 끝낸 숙제는 안 보임", () => {
  const day = 24 * 60 * 60 * 1000;
  const sameDay = (a: number, b: number) => Math.floor(a / day) === Math.floor(b / day);
  const now = 10 * day + 5000;
  assert.equal(homeworkForToday(null, sameDay, now), null);
  const open = { kind: "replay" as const, callId: "c1", at: 3 * day };
  assert.equal(homeworkForToday(open, sameDay, now), open);
  assert.equal(homeworkForToday({ ...open, done: 10 * day + 10 }, sameDay, now)?.callId, "c1");
  assert.equal(homeworkForToday({ ...open, done: 4 * day }, sameDay, now), null);
});
