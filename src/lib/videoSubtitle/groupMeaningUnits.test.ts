import assert from "node:assert/strict";
import test from "node:test";
import {
  groupMeaningUnits,
  meaningUnitHeuristics,
} from "./groupMeaningUnits.ts";
import type { NormalizedSegment } from "./types.ts";
import { splitReadable } from "./formatSubtitles.ts";
import { SUBTITLE_NATURALIZATION_CASES } from "./subtitleNaturalizationCases.ts";

function seg(
  id: string,
  text: string,
  start: number,
  end: number,
): NormalizedSegment {
  return {
    id,
    startTime: start,
    endTime: end,
    rawText: text,
    normalizedText: text,
  };
}

test("looksIncomplete detects mid-thought slices", () => {
  assert.equal(
    meaningUnitHeuristics.looksIncomplete("The reason I don't recommend this"),
    true,
  );
  assert.equal(
    meaningUnitHeuristics.looksIncomplete("I don't buy that."),
    false,
  );
});

test("looksContinuation detects trailing clauses", () => {
  assert.equal(
    meaningUnitHeuristics.looksContinuation(
      "is because you're basically adding",
    ),
    true,
  );
  assert.equal(
    meaningUnitHeuristics.looksContinuation("I wouldn't go that far."),
    false,
  );
});

test("groupMeaningUnits merges dangling already + orphan Colored", () => {
  const units = groupMeaningUnits({
    currentSegments: [
      seg("a", "I was getting it cut and it had been already", 30, 32),
      seg("b", "Colored.", 32.05, 32.8),
      seg("c", "And I just remember looking over", 33.1, 35),
    ],
  });
  assert.equal(units.length, 2);
  assert.deepEqual(units[0]!.segmentIds, ["a", "b"]);
  assert.match(units[0]!.original, /already Colored/i);
  assert.equal(units[1]!.segmentIds[0], "c");
});

test("groupMeaningUnits merges sentence-final noun after false period", () => {
  const units = groupMeaningUnits({
    currentSegments: [
      seg(
        "a",
        "He's French-Canadian, so he speaks French as a first.",
        5,
        8,
      ),
      seg("b", "language.", 8, 8.2),
      seg("c", "And then he switched to English.", 8.6, 10),
    ],
  });
  assert.equal(units.length, 2);
  assert.deepEqual(units[0]!.segmentIds, ["a", "b"]);
  assert.match(units[0]!.original, /first\.? language/i);
  assert.equal(units[1]!.original, "And then he switched to English.");
});

test("looksIncomplete treats open noun phrase with period as unfinished", () => {
  assert.equal(
    meaningUnitHeuristics.looksIncomplete(
      "He's French-Canadian, so he speaks French as a first.",
    ),
    true,
  );
  assert.equal(
    meaningUnitHeuristics.looksIncomplete("I don't buy that."),
    false,
  );
});

test("groupMeaningUnits merges trailing didn't with following verb phrase", () => {
  const units = groupMeaningUnits({
    currentSegments: [
      seg(
        "a",
        "Was the nicest guy in the world and he didn't",
        50,
        52,
      ),
      seg("b", "Murder us at the end of it.", 52, 54),
      seg("c", "That's the story.", 54.5, 56),
    ],
  });
  assert.equal(units.length, 2);
  assert.deepEqual(units[0]!.segmentIds, ["a", "b"]);
  assert.match(units[0]!.original, /didn't Murder/i);
  assert.equal(
    meaningUnitHeuristics.endsWithOpenFunctionWord(
      "Was the nicest guy in the world and he didn't",
    ),
    true,
  );
});

test("groupMeaningUnits merges open 'our.' with following noun phrase", () => {
  const units = groupMeaningUnits({
    currentSegments: [
      seg(
        "a",
        "And we had no idea where to go, what our.",
        19,
        22,
      ),
      seg("b", "schedule could be, and a guy out of nowhere", 22, 25),
      seg("c", "And then things changed.", 25.5, 28),
    ],
  });
  assert.equal(units.length, 2);
  assert.deepEqual(units[0]!.segmentIds, ["a", "b"]);
  assert.match(units[0]!.original, /our\.? schedule/i);
});

test("groupMeaningUnits merges open 'the.' with following complement phrase", () => {
  const units = groupMeaningUnits({
    currentSegments: [
      seg(
        "a",
        "Everyone who's talked about you just says you are the.",
        0,
        3,
      ),
      seg("b", "Nicest, kindest man in all of Hollywood.", 3, 6),
      seg("c", "How does that make you feel?", 6.5, 8),
    ],
  });
  assert.equal(units.length, 2);
  assert.deepEqual(units[0]!.segmentIds, ["a", "b"]);
  assert.match(units[0]!.original, /the\.? Nicest/i);
  assert.match(units[0]!.original, /Hollywood/i);
  assert.equal(units[1]!.original, "How does that make you feel?");
});

test("groupMeaningUnits merges lonely name crumb into previous line", () => {
  const units = groupMeaningUnits({
    currentSegments: [
      seg(
        "a",
        "You play Spider-Man's other love interest Gwen",
        23,
        25,
      ),
      seg("b", "Stacy.", 25, 27),
      seg("c", "How did that feel?", 27.4, 29),
    ],
  });
  assert.equal(units.length, 2);
  assert.deepEqual(units[0]!.segmentIds, ["a", "b"]);
  assert.match(units[0]!.original, /Gwen Stacy/i);
  assert.equal(units[1]!.original, "How did that feel?");
});

test("groupMeaningUnits keeps standalone Yeah after finished sentence", () => {
  const units = groupMeaningUnits({
    currentSegments: [
      seg("a", "I don't buy that.", 0, 1.2),
      seg("b", "Yeah.", 1.35, 1.7),
    ],
  });
  assert.equal(units.length, 2);
});

test("looksOrphanFragment catches single-word STT crumbs", () => {
  assert.equal(meaningUnitHeuristics.looksOrphanFragment("Colored."), true);
  assert.equal(meaningUnitHeuristics.looksOrphanFragment("Yeah."), true);
  assert.equal(meaningUnitHeuristics.looksOrphanFragment("language."), true);
  assert.equal(
    meaningUnitHeuristics.looksOrphanFragment(
      "And I just remember looking over and they both came running",
    ),
    false,
  );
});

test("groupMeaningUnits merges only a mid-sentence split (max 2)", () => {
  const units = groupMeaningUnits({
    previousSegments: [
      seg(
        "p0",
        "We've been discussing whether this architecture is actually necessary.",
        0,
        3,
      ),
    ],
    currentSegments: [
      seg("a", "The reason I don't recommend this", 3.1, 4.2),
      seg("b", "is because you're basically adding", 4.25, 5.4),
      seg("c", "another layer of complexity", 5.45, 6.5),
      seg("d", "without getting much in return.", 6.55, 8),
    ],
    nextSegments: [
      seg("n0", "And that brings us to the alternative.", 8.2, 10),
    ],
  });

  // a+b may join; later caption beats stay separate for A/V sync.
  assert.ok(units.length >= 3);
  assert.deepEqual(units[0]!.segmentIds, ["a", "b"]);
  assert.match(units[0]!.original, /reason I don't recommend/);
  assert.match(units[0]!.original, /basically adding/);
  assert.ok(units[0]!.previousTexts.length >= 1);
});

test("groupMeaningUnits keeps finished sentences separate", () => {
  const units = groupMeaningUnits({
    currentSegments: [
      seg("a", "I don't buy that.", 0, 1.2),
      seg("b", "That's not really the point.", 2.0, 3.5),
    ],
  });
  assert.equal(units.length, 2);
});

test("groupMeaningUnits does not glue ordinary caption lines", () => {
  const units = groupMeaningUnits({
    currentSegments: [
      seg("a", "I wasn't unconscious!", 10, 11.2),
      seg("b", "Who are you?", 11.35, 12.1),
    ],
  });
  assert.equal(units.length, 2);
  assert.equal(units[0]!.startTime, 10);
  assert.equal(units[0]!.endTime, 11.2);
  assert.equal(units[1]!.startTime, 11.35);
});

test("splitReadable honors explicit newline beats", () => {
  assert.deepEqual(splitReadable("제 말은,\n이 방식이 꼭 나쁘다는 건 아니에요."), [
    "제 말은,",
    "이 방식이 꼭 나쁘다는 건 아니에요.",
  ]);
});

test("looksLikeCalqueKorean catches 번역투", async () => {
  const { looksLikeCalqueKorean, looksLikeLiteralOrForeignCaption } =
    await import("./calqueDetect.ts");
  assert.equal(
    looksLikeCalqueKorean(
      "제가 이것을 추천하지 않는 이유는 이것이 복잡성을 추가하기 때문입니다.",
    ),
    true,
  );
  assert.equal(
    looksLikeCalqueKorean("그렇게까지 말하긴 좀 그래요."),
    false,
  );
  assert.equal(
    looksLikeLiteralOrForeignCaption(
      "I wasn't unconscious! Who are you?",
      "난 unconscious 아니었어! 너 누구야?",
      "ko",
    ),
    true,
  );
  assert.equal(
    looksLikeLiteralOrForeignCaption(
      "I'm losing my mind.",
      "내 정신이 지금 나가고있어.",
      "ko",
    ),
    true,
  );
  assert.equal(
    looksLikeCalqueKorean("정신 나갈 것 같아."),
    false,
  );
  assert.equal(
    looksLikeCalqueKorean("정신이 나갈 것 같아."),
    false,
  );
  assert.equal(
    looksLikeLiteralOrForeignCaption(
      "I'm losing my mind.",
      "정신 나갈 것 같아.",
      "ko",
    ),
    false,
  );
  assert.equal(
    looksLikeLiteralOrForeignCaption(
      "I'm losing my mind.",
      "정신이 나갈 것 같아.",
      "ko",
    ),
    false,
  );
  assert.equal(
    looksLikeLiteralOrForeignCaption(
      "How would you decide what parts of nature are good or bad?",
      "자연에서 좋은 것과 나쁜 것을 어떻게 구분하지?",
      "ko",
    ),
    true,
  );
  assert.equal(
    looksLikeLiteralOrForeignCaption(
      "How would you decide what parts of nature are good or bad?",
      "뭐가 좋고 나쁜 건지 어떻게 판단하지?",
      "ko",
    ),
    false,
  );
});

test("naturalization fixture set covers 20+ diverse cases", () => {
  assert.ok(SUBTITLE_NATURALIZATION_CASES.length >= 20);
  const categories = new Set(
    SUBTITLE_NATURALIZATION_CASES.map((item) => item.category),
  );
  for (const needed of [
    "idiom",
    "hedge",
    "dev-terms",
    "long-sentence",
    "pronoun-context",
    "joke",
    "metaphor",
    "casual",
  ]) {
    assert.ok(categories.has(needed), `missing category ${needed}`);
  }
  for (const item of SUBTITLE_NATURALIZATION_CASES) {
    assert.notEqual(item.oldTranslation, item.improvedSubtitle);
    assert.ok(item.original.length > 0);
  }
});
