import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeMap } from "../map.ts";
import { normalizeCurriculum } from "./normalize.ts";
import { buildCurriculumPrompt } from "./prompt.ts";
import { generateCurriculum, readJsonReply } from "./generate.ts";
import { connectionsOf, nextTopic, progressOf, topicsForActivity, topicsForPage } from "./graph.ts";
import { fromStudyMap, toStudyMap } from "./adapters/studyMap.ts";
import { languagePack } from "./packs/language.ts";
import { knowledgePack } from "./packs/knowledge.ts";
import { coursePack } from "./packs/course.ts";
import { projectPack } from "./packs/project.ts";
import type { CurriculumInput } from "./types.ts";

const base = { id: "c1", createdAt: "2026-10-09T00:00:00.000Z" };

function topic(id: string, order: number, extra: Record<string, unknown> = {}) {
  return { id, sector: id[0], title: `Topic ${id}`, summary: "s", order, activities: [], links: [], ...extra };
}

/* ------------------------------ language: same map as before ------------------------------ */

const langInput: CurriculumInput = {
  goal: "여행 가서 현지인과 대화하기",
  level: "beginner",
  writeIn: "Korean",
  subject: "Spanish",
  refs: { library: [{ id: "vid1", title: "Café order" }, { id: "vid2", title: "Opinions" }] },
};
const langSectors = ["A", "B", "C", "D"].map((id) => ({ id, title: `Sector ${id}`, description: "d" }));
const langRaw = {
  title: "Travel talk",
  summary: "two sentences",
  sectors: langSectors,
  topics: [
    topic("A1", 1, {
      activities: [
        { tab: "chat", task: "Order a coffee", starter: "Hola, ¿me pone…" },
        { tab: "video", task: "vid2: watch it and note the opinions", videoId: "vid2" },
        { tab: "video", task: "Watch another", videoId: "not-ours" },
      ],
      links: [{ to: "B1", why: "uses it" }, { to: "Z9", why: "?" }],
    }),
    topic("B1", 3), topic("C1", 5), topic("D1", 9), topic("A2", 2), topic("B2", 4),
  ],
};

test("the language pack draws the map the app already stores, field for field", () => {
  const legacy = normalizeMap(langRaw, {
    id: "c1", language: "es", uiLanguage: "ko", goal: langInput.goal, level: "beginner",
    createdAt: base.createdAt, libraryVideoIds: ["vid1", "vid2"],
  });
  const engine = normalizeCurriculum(langRaw, languagePack, langInput, base);
  assert.ok(legacy && engine);
  assert.deepEqual(toStudyMap(engine.curriculum, { language: "es", uiLanguage: "ko" }), legacy.map);
});

test("a saved study map reads back through the engine and out again unchanged", () => {
  const legacy = normalizeMap(langRaw, {
    id: "c1", language: "es", uiLanguage: "ko", goal: langInput.goal, level: "beginner",
    createdAt: base.createdAt, libraryVideoIds: ["vid1", "vid2"],
  })!.map;
  assert.deepEqual(toStudyMap(fromStudyMap(legacy), { language: "es", uiLanguage: "ko" }), legacy);
});

test("references only to what was offered, and the raw id taken out of the sentence", () => {
  const a1 = normalizeCurriculum(langRaw, languagePack, langInput, base)!.curriculum.topics[0];
  assert.equal(a1.activities[1].videoId, "vid2");
  assert.equal(a1.activities[1].task, "watch it and note the opinions");
  assert.equal(a1.activities[2].videoId, undefined);
});

test("a fixed-sector pack refuses topics outside its sectors", () => {
  const raw = { sectors: langSectors, topics: [topic("A1", 1), topic("E1", 2), { ...topic("B1", 3), sector: "C" }] };
  const result = normalizeCurriculum(raw, { ...languagePack, topics: { ...languagePack.topics, min: 1 } }, langInput, base)!;
  assert.deepEqual(result.curriculum.topics.map((t) => t.id), ["A1"]);
});

/* -------------------------------- free sectors -------------------------------- */

const knowInput: CurriculumInput = { goal: "소프트웨어와 하드웨어의 연결 이해", level: "beginner", writeIn: "Korean" };

test("free sectors are lettered by position, and topics follow the model's own ids", () => {
  const raw = {
    sectors: [{ id: "X", title: "디지털 논리" }, { id: "Y", title: "컴퓨터 구조" }, { id: "Z", title: "운영체제" }],
    topics: [
      topic("X1", 1, { sector: "X", links: [{ to: "Y1", why: "주소 디코딩" }] }), topic("X2", 2, { sector: "X" }),
      topic("Y1", 3, { sector: "Y" }), topic("Y2", 4, { sector: "Y" }),
      topic("Z1", 5, { sector: "Z" }), topic("Z2", 6, { sector: "Z", activities: [{ kind: "practice", task: "run it", runner: "python" }] }),
    ],
  };
  const r = normalizeCurriculum(raw, knowledgePack, knowInput, base)!;
  assert.deepEqual(r.curriculum.sectors.map((s) => [s.id, s.title]), [["A", "디지털 논리"], ["B", "컴퓨터 구조"], ["C", "운영체제"]]);
  assert.deepEqual(r.curriculum.topics.map((t) => t.id), ["A1", "A2", "B1", "B2", "C1", "C2"]);
  assert.deepEqual(r.curriculum.topics[0].links, [{ to: "B1", why: "주소 디코딩" }]);
  assert.equal(r.curriculum.topics[5].activities[0].runner, "python");
});

test("too few sectors or topics is no map", () => {
  const raw = { sectors: [{ id: "A", title: "only one" }], topics: [topic("A1", 1), topic("A2", 2), topic("A3", 3), topic("A4", 4), topic("A5", 5), topic("A6", 6)] };
  assert.equal(normalizeCurriculum(raw, knowledgePack, knowInput, base), null);
});

/* ------------------------------ course: pages of materials ------------------------------ */

const courseInput: CurriculumInput = {
  goal: "전자회로 1 중간고사", level: "intermediate", writeIn: "Korean", subject: "전자회로 1",
  materials: [{ id: "deck-7", title: "3주차", pages: ["표지", "KVL", "KCL", "예제", "옴", "직렬", "병렬", "부록"] }],
};

test("sources are kept only inside the materials, and uncovered pages are reported", () => {
  const raw = {
    sectors: [{ id: "A", title: "기본 법칙" }, { id: "B", title: "저항 회로" }, { id: "C", title: "해석" }],
    topics: [
      topic("A1", 1, { sources: [{ material: "M1", from: 1, to: 3 }] }),
      topic("A2", 2, { sources: [{ material: "M1", from: 4, to: 4 }, { material: "M2", from: 1, to: 2 }] }),
      topic("B1", 3, { sources: [{ material: "M1", from: 5, to: 7 }, { material: "M1", from: 20, to: 22 }] }),
      topic("B2", 4), topic("C1", 5),
    ],
  };
  const r = normalizeCurriculum(raw, coursePack, courseInput, base)!;
  assert.deepEqual(r.curriculum.topics[0].sources, [{ material: "deck-7", from: 1, to: 3 }]);
  assert.deepEqual(r.curriculum.topics[1].sources, [{ material: "deck-7", from: 4, to: 4 }]);
  assert.deepEqual(r.uncovered, { "deck-7": [8] });
  assert.deepEqual(topicsForPage(r.curriculum, "deck-7", 6).map((t) => t.id), ["B1"]);
});

test("the course prompt carries the scope, the pages and the sources shape", () => {
  const p = buildCurriculumPrompt(coursePack, { ...courseInput, scope: "1주차 KVL, KCL\n2주차 옴의 법칙" });
  assert.match(p.system, /1주차 KVL, KCL/);
  assert.match(p.system, /\[M1\] 3주차 \(8 pages\)/);
  assert.match(p.system, /p\.2: KVL/);
  assert.match(p.system, /"sources":\[\{"material":"M1"/);
  assert.equal(p.maxTokens, 6000);
});

test("the language prompt lists only the clips offered, and none when there are none", () => {
  assert.match(buildCurriculumPrompt(languagePack, langInput).system, /vid2: Opinions/);
  assert.match(buildCurriculumPrompt(languagePack, { ...langInput, refs: {} }).system, /none — do not use this field/);
});

/* -------------------------------- generation -------------------------------- */

const projectRaw = {
  title: "할 일 목록",
  sectors: [{ id: "A", title: "할 일 추가" }, { id: "B", title: "완료 체크" }, { id: "C", title: "저장" }],
  topics: [
    topic("A1", 1, { activities: [{ kind: "build", task: "추가 버튼", request: "할 일을 추가하는 버튼을 만들고 싶어" }] }),
    topic("A2", 2), topic("B1", 3), topic("C1", 4),
  ],
};

test("a reply with a sentence around the json is still read", () => {
  assert.deepEqual(readJsonReply('Here you go:\n```json\n{"a":1}\n```'), { a: 1 });
  assert.deepEqual(readJsonReply('Sure. {"a":{"b":2}} Hope it helps.'), { a: { b: 2 } });
  assert.equal(readJsonReply("no json here"), undefined);
});

test("a thin first answer is retried once with what was wrong", async () => {
  const prompts: string[] = [];
  const replies = [JSON.stringify({ sectors: projectRaw.sectors, topics: [topic("Q1", 1)] }), JSON.stringify(projectRaw)];
  const result = await generateCurriculum({
    pack: projectPack,
    input: { goal: "할 일 목록 앱", level: "beginner", writeIn: "Korean", subject: "HTML, CSS and JavaScript" },
    model: async (p) => { prompts.push(p.user); return replies.shift()!; },
    id: "p1",
    now: () => new Date(base.createdAt),
  });
  assert.equal(result.ok, true);
  assert.equal(result.attempts, 2);
  assert.match(prompts[1], /could not be used.*Q1/s);
  if (result.ok) assert.equal(result.curriculum.topics[0].activities[0].request, "할 일을 추가하는 버튼을 만들고 싶어");
});

test("a model that throws is reported, not retried", async () => {
  const result = await generateCurriculum({
    pack: projectPack, input: { goal: "x", level: "beginner", writeIn: "Korean" },
    model: async () => { throw new Error("429"); }, id: "p2",
  });
  assert.deepEqual([result.ok, result.attempts, !result.ok && result.error], [false, 1, "MODEL_FAILED"]);
});

/* ---------------------------------- reading ---------------------------------- */

test("connections, next, progress and activity lookups", () => {
  const c = normalizeCurriculum(langRaw, languagePack, langInput, base)!.curriculum;
  assert.deepEqual(connectionsOf(c, "B1").map((x) => x.topic.id), ["A1"]);
  assert.equal(nextTopic(c, { A1: "done" })?.id, "A2");
  const p = progressOf(c, { A1: "done", A2: "doing" });
  assert.deepEqual([p.total, p.done, p.doing, p.sectors.A.done], [6, 1, 1, 1]);
  assert.deepEqual(topicsForActivity(c, "video", { field: "videoId", value: "vid2" }).map((t) => t.id), ["A1"]);
});
