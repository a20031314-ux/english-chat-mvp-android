import assert from "node:assert/strict";
import test from "node:test";
import { ladderFor, stageById, stageProgress, stageScopeForPrompt, nextStage, STAGE_DONE_SHARE } from "./index.ts";
import { emptyLedger, ledgerKey, type Ledger, type LedgerItem } from "../../learner/ledger.ts";
import { findConstruction } from "../../learner/constructions.ts";
import { parseSelfCheck, pitchFor } from "../../learner/selfCheck.ts";
import { buildBrief } from "../../learner/brief.ts";
import { mapSystemPrompt } from "../prompt.ts";
import { textsOf, viewsFrom, withTexts } from "../../server/stageCopy.ts";

const BANDS = ["A1", "A2", "B1", "B2", "C1"];

const ALL = ["en", "ja", "ko", "es", "zh", "vi", "fr", "it", "pt", "ru", "id", "ar", "th", "hi"];
for (const language of ALL) {
  test(`${language}: 다섯 단계, 대화 둘, 겹치지 않는 표현`, () => {
    const ladder = ladderFor(language);
    assert.ok(ladder);
    assert.equal(ladder.stages.length, 5);
    const seen = new Set<string>();
    ladder.stages.forEach((stage, index) => {
      assert.equal(stage.id, `${language}-${index + 1}`);
      assert.equal(stage.order, index + 1);
      assert.equal(stage.band, BANDS[index]);
      assert.ok(stage.canDo.length >= 5 && stage.canDo.length <= 7, stage.id);
      assert.ok(stage.expressions.length >= 15 && stage.expressions.length <= 25, stage.id);
      assert.equal(stage.dialogues.length, 2);
      for (const dialogue of stage.dialogues) {
        assert.ok(dialogue.lines.length >= 4 && dialogue.lines.length <= 6, stage.id);
        dialogue.lines.forEach((line, i) => {
          assert.ok(line.text.trim() && line.en.trim(), stage.id);
          if (i > 0) assert.notEqual(line.who, dialogue.lines[i - 1]!.who, `${stage.id} 번갈아`);
        });
      }
      for (const expression of stage.expressions) {
        const key = ledgerKey(expression);
        assert.ok(key, `${stage.id} ${expression}`);
        assert.ok(!seen.has(key), `${expression} 두 번`);
        seen.add(key);
      }
      for (const grammar of stage.grammar) {
        if (grammar.constructionId) assert.equal(findConstruction(grammar.constructionId)?.band, stage.band, grammar.constructionId);
      }
      // 레벨 이름이 화면 글에 보이지 않게
      for (const g of stage.grammar) assert.ok(g.name.en.trim() && g.example.trim(), stage.id);
      assert.doesNotMatch(`${stage.title.en} ${stage.title.ko ?? ""}`, /\b(A1|A2|B1|B2|C1|N[1-5]|TOPIK|beginner)\b|초급|중급|고급/);
    });
  });
}

test("범위가 없는 학습 언어는 null, 단계 id는 그 언어 것만", () => {
  assert.equal(ladderFor("xx"), null);
  assert.equal(stageById("xx-1"), null);
  assert.equal(stageById("ja-9"), null);
  assert.equal(stageById("ja-2")?.order, 2);
  assert.equal(nextStage(stageById("ko-5")!), null);
  assert.equal(nextStage(stageById("ko-4")!)?.id, "ko-5");
});

function ledgerWith(language: string, entries: Array<[string, LedgerItem["state"]]>): Ledger {
  const ledger = emptyLedger(language);
  for (const [text, state] of entries) {
    ledger.items[ledgerKey(text)] = {
      text, state, firstMet: { tab: "chat", at: 0 }, met: [], outputs: [], helpAt: 0, slips: 0, heard: 0,
    } as unknown as LedgerItem;
  }
  return ledger;
}

test("진행: 띄어쓰기 없는 일본어는 더 긴 장부 표현 안에서도 찾는다", () => {
  const stage = stageById("ja-1")!;
  const [first, second, third] = stage.expressions;
  const ledger = ledgerWith("ja", [[first!, "mastered"], [`これ${second}`, "mastered"], [third!, "learned"]]);
  const progress = stageProgress(stage, ledger);
  // 짧은 표현이 긴 표현 안에 들어 있으면(お願いします ⊂ よろしくお願いします) 같이 숙지로 친다 — 그래서 "2개 이상".
  assert.ok(progress.mastered >= 2);
  assert.ok(!progress.open.includes(first!) && !progress.open.includes(second!));
  assert.equal(progress.open.length, stage.expressions.length - progress.mastered);
  assert.ok(progress.share < STAGE_DONE_SHARE);
});

test("진행: 영어 표현을 다 숙지하면 다음 단계 문턱을 넘는다", () => {
  const stage = stageById("en-2")!;
  const ledger = ledgerWith("en", stage.expressions.map((text) => [text.toUpperCase(), "mastered"] as [string, "mastered"]));
  const progress = stageProgress(stage, ledger);
  assert.equal(progress.mastered, stage.expressions.length);
  assert.equal(progress.open.length, 0);
  assert.ok(progress.share >= STAGE_DONE_SHARE);
});

test("체크: 단계 id를 받고 시작 수준을 정한다", () => {
  const check = parseSelfCheck({ stage: "ko-4" }, 1);
  assert.equal(check?.stage, "ko-4");
  assert.equal(pitchFor(check!), "intermediate");
  assert.equal(pitchFor(parseSelfCheck({ stage: "en-1", gaps: ["natural"] }, 1)!), "beginner");
  assert.equal(parseSelfCheck({ stage: "en-1; drop" }, 1), null);
});

test("지시문: 단계 범위가 들어가고 베낄 예시는 없다", () => {
  const stage = stageById("ja-3")!;
  const base = { goal: "x", level: "beginner" as const, target: "Japanese", uiName: "Korean", library: [] };
  const withStage = mapSystemPrompt({ ...base, stageScope: stageScopeForPrompt(stage, "Japanese") });
  assert.ok(withStage.includes(stage.expressions[0]!));
  assert.match(withStage, /Never split one situation/);
  const plain = mapSystemPrompt(base);
  assert.doesNotMatch(plain, /café|Ordering|introducing yourself|polite request/i);
});

test("튜터 요약: 고른 단계의 아직 못 쓴 표현을 두 개까지", () => {
  const brief = buildBrief({
    ledger: emptyLedger("en"),
    weak: { patterns: {} } as never,
    stats: { turns: 0, correctionRate: null, medianLatencyMs: null, retryRate: null },
    stage: { aim: "Talk about plans", open: ["sounds good", "what are you up to", "how about"] },
    now: 1,
  });
  const note = brief.notes.find((n) => n.kind === "stage");
  assert.deepEqual(note, { kind: "stage", aim: "Talk about plans", phrases: ["sounds good", "what are you up to"] });
  assert.match(brief.prompt, /working towards: Talk about plans/);
});

test("화면 글: 앱 언어 = 학습 언어면 뜻풀이 없음, 옮긴 글은 같은 순서로 돌아간다", () => {
  const ladder = ladderFor("ko")!;
  const own = viewsFrom(ladder.stages, "ko", "ko");
  assert.equal(own[0]!.dialogues[0]!.lines[0]!.gloss, "");
  const english = viewsFrom(ladder.stages, "ko", "en");
  const texts = textsOf(english);
  const back = withTexts(english, texts.map((t) => `#${t}`));
  assert.ok(back);
  assert.equal(back![0]!.title, `#${english[0]!.title}`);
  assert.equal(back![4]!.dialogues[1]!.lines.at(-1)!.gloss, `#${english[4]!.dialogues[1]!.lines.at(-1)!.gloss}`);
  assert.equal(withTexts(english, texts.slice(1)), null);
});

test("영어 학습·다른 앱 언어: 옮길 원문에 뜻풀이가 비지 않는다", () => {
  const english = viewsFrom(ladderFor("en")!.stages, "en", "en", true);
  assert.ok(textsOf(english).every((text) => text.trim()));
  assert.equal(viewsFrom(ladderFor("en")!.stages, "en", "en")[0]!.dialogues[0]!.lines[0]!.gloss, "");
});

import { scriptFor, scriptProgress } from "../scripts/index.ts";
import { scriptTextsOf, scriptViewFrom, withScriptTexts } from "../../server/stageCopy.ts";

for (const language of ALL) {
  test(`${language}: 글자·소리 기초 묶음`, () => {
    const course = scriptFor(language);
    assert.ok(course, language);
    assert.ok(course.groups.length >= 6 && course.groups.length <= 14, `${language} ${course.groups.length}`);
    const ids = new Set<string>();
    for (const group of course.groups) {
      assert.ok(group.id.startsWith(`${language}-`), group.id);
      assert.ok(!ids.has(group.id), group.id);
      ids.add(group.id);
      assert.ok(group.items.length >= 4 && group.items.length <= 12, `${group.id} ${group.items.length}`);
      for (const item of group.items) assert.ok(item.char.trim() && item.reading.trim() && item.say.trim(), group.id);
    }
    // 문제 보기는 읽는 법이 다른 것만 고르므로(같은 소리 b·v 같은 묶음이 있어서), 강좌 전체에 다른 읽는 법이 넉넉해야 한다.
    const readings = new Set(course.groups.flatMap((group) => group.items.map((item) => item.reading.trim().toLowerCase())));
    assert.ok(readings.size >= 8, language);
    {
    }
  });
}

test("글자 기초 진행과 옮긴 글 순서", () => {
  const course = scriptFor("ja")!;
  const first = course.groups[0]!.id;
  const progress = scriptProgress(course, { [first]: 1 });
  assert.equal(progress.done, 1);
  assert.equal(progress.next, course.groups[1]!.id);
  assert.ok(!progress.finished);
  const view = scriptViewFrom(course, "en");
  const texts = scriptTextsOf(view);
  const back = withScriptTexts(view, texts.map((t) => `#${t}`));
  assert.equal(back!.groups[0]!.title, `#${view.groups[0]!.title}`);
  assert.equal(withScriptTexts(view, texts.slice(1)), null);
});
