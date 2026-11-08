import test from "node:test";
import assert from "node:assert/strict";
import { blanked, giveHomework, keepReplay, noteReplayResult, parseReplay, pieceSaid, readHomework, replayable, replayFor, replayPrompt, wholeLineOf, wholeSaid } from "./replay.ts";

const es = {
  scenes: [
    {
      kind: "same",
      lines: [
        { who: "tutor", text: "¿Qué hiciste el fin de semana?" },
        { who: "me", text: "Fui a la playa con mi amiga y comimos mariscos.", meaning: "친구랑 바닷가에 가서 해산물을 먹었어요.", piece: "y comimos mariscos" },
        { who: "tutor", text: "¡Qué bien! ¿Te gustó?" },
        { who: "me", text: "Sí, me encantó porque hacía sol.", meaning: "네, 해가 나서 정말 좋았어요.", piece: "porque hacía sol" },
      ],
    },
    {
      kind: "further",
      lines: [
        { who: "tutor", text: "¿Vas a volver pronto?" },
        { who: "me", text: "Quiero volver el mes que viene.", meaning: "다음 달에 다시 가고 싶어요.", piece: "el mes que viene" },
        { who: "tutor", text: "¿Con quién?" },
        { who: "me", text: "Con mi familia, si tienen tiempo.", meaning: "가족이랑요, 시간이 되면요.", piece: "no está en la frase" },
      ],
    },
  ],
};

test("장면 읽기: same이 먼저, 조각이 줄에 없으면 빈칸 없이", () => {
  const scenes = parseReplay(JSON.stringify(es));
  assert.equal(scenes.length, 2);
  assert.equal(scenes[0]!.kind, "same");
  const last = scenes[1]!.lines[3]!;
  assert.equal(last.who === "me" ? last.piece : "x", null);
  assert.equal(blanked(scenes[0]!.lines[1] as never), "Fui a la playa con mi amiga ___.");
});

test("장면 읽기: same이 없거나 내 줄이 하나뿐이면 버림, 코드 울타리도 봐줌", () => {
  assert.deepEqual(parseReplay({ scenes: [es.scenes[1]] }), []);
  const one = { scenes: [{ kind: "same", lines: [es.scenes[0]!.lines[0], es.scenes[0]!.lines[1]] }] };
  assert.deepEqual(parseReplay(one), []);
  assert.equal(parseReplay("```json\n" + JSON.stringify(es) + "\n```").length, 2);
  assert.deepEqual(parseReplay("not json"), []);
  assert.equal(parseReplay(JSON.stringify({ scenes: JSON.stringify(es.scenes) })).length, 2);
  assert.equal(parseReplay(JSON.stringify({ scenes: JSON.stringify(es.scenes) + "}" })).length, 2);
  assert.equal(parseReplay("Here you go: " + JSON.stringify(es)).length, 2);
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
  assert.equal(replayFor(store, "es", "c1")?.scenes.length, 2);
  assert.equal(replayFor(store, "ja", "c1"), null);
  noteReplayResult(store, "es", "c1", "same", { ok: 2, of: 2, whole: true, at: 5 });
  assert.equal(replayFor(store, "es", "c1")?.results.same?.ok, 2);
  assert.equal(readHomework(store, "es")?.done, 5);
});
