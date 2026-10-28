import assert from "node:assert/strict";
import test from "node:test";
import {
  compareToTarget,
  parsePractice,
  practicePrompt,
  troubleWords,
  type WordOutcome,
} from "./practice.ts";

/** 비교 결과만(화면 모양 shown·space 빼고). */
const bare = ({ shown: _shown, space: _space, ...rest }: WordOutcome) => rest;

test("a sentence said as given comes back clean", () => {
  const comparison = compareToTarget("Large, please.", "large please");
  assert.equal(comparison.clean, true);
  assert.deepEqual(troubleWords(comparison), []);
});

test("punctuation and case are not something to get wrong", () => {
  assert.equal(compareToTarget("Card, please.", "Card please!").clean, true);
});

test("a word that came out as another word is located, not just noticed", () => {
  // The whole reason the target is given first: this is evidence about a sound,
  // where the same transcript in free conversation would be ambiguous.
  const comparison = compareToTarget("Large, please.", "large peace");
  assert.deepEqual(comparison.outcomes.map(bare), [
    { kind: "kept", word: "large" },
    { kind: "changed", word: "please", heardAs: "peace" },
  ]);
  assert.deepEqual(troubleWords(comparison), ['"please" came out as "peace"']);
});

test("a word that did not arrive at all is said to be missing, not changed", () => {
  const comparison = compareToTarget("Can I get a latte please", "can I get latte");
  const kinds = comparison.outcomes.map((outcome) => outcome.kind);
  assert.ok(kinds.includes("dropped"));
  assert.ok(troubleWords(comparison).some((line) => line.includes("did not come out")));
});

test("words nobody asked for are kept apart from words that changed", () => {
  const comparison = compareToTarget("Card, please.", "um card please thanks");
  assert.deepEqual(
    comparison.outcomes.map((outcome) => outcome.kind),
    ["kept", "kept"],
  );
  assert.deepEqual(comparison.added.sort(), ["thanks", "um"]);
  assert.equal(comparison.clean, false);
});

test("saying nothing is every word missing, not a crash", () => {
  const comparison = compareToTarget("Large, please.", "");
  assert.deepEqual(
    comparison.outcomes.map((outcome) => outcome.kind),
    ["dropped", "dropped"],
  );
});

test("the prompt refuses the claims a transcript cannot support", () => {
  // Text arrives with the sound already gone. Saying anything about stress or
  // vowel length would be inventing it, and a learner who catches that once
  // stops believing the rest.
  const written = practicePrompt({
    target: "Large, please.",
    heard: "large peace",
    comparison: compareToTarget("Large, please.", "large peace"),
    targetLanguage: "English",
    nativeLanguage: "Korean",
  });
  assert.match(written, /"please" came out as "peace"/);
  assert.match(written, /reading text, not listening/);
  assert.match(written, /do not mention them/);
  assert.match(written, /Never guess at an accent/);
  assert.match(written, /in Korean/);
});

test("a word that sounds the same is not a sound to fix", () => {
  // Seen from the real model: "for here" heard as "for hear" was answered with
  // "pronounce the r more clearly" — advice about a sound that had landed
  // perfectly. The recogniser had simply picked the other spelling.
  const written = practicePrompt({
    target: "For here, please.",
    heard: "for hear please",
    comparison: compareToTarget("For here, please.", "for hear please"),
    targetLanguage: "English",
    nativeLanguage: "Korean",
  });
  assert.match(written, /sounds the same as the word they were given/);
  assert.match(written, /Say that it was said correctly/);
});

test("a clean attempt is described as one", () => {
  const written = practicePrompt({
    target: "Large, please.",
    heard: "large please",
    comparison: compareToTarget("Large, please.", "large please"),
    targetLanguage: "English",
    nativeLanguage: "Korean",
  });
  assert.match(written, /Every word came through/);
});

test("an answer without a note is nothing to show", () => {
  assert.equal(parsePractice('{"good": true}'), null);
  assert.equal(parsePractice("not json"), null);
  const good = parsePractice('{"good": true, "note": "그대로 들렸어요."}');
  assert.deepEqual(good, { good: true, note: "그대로 들렸어요." });
  const bad = parsePractice('{"good": "yes", "note": "please의 l이 빠졌어요."}');
  assert.equal(bad?.good, false, "only a real true is good");
});

test("a mark is a letter, not punctuation to be stripped", () => {
  // Devanagari vowel signs and Thai tone marks are \p{M}. Dropping them does
  // not tidy a sentence up, it cuts every syllable down to its bare consonant:
  // measured on the scene's own lines, Hindi came apart into thirty pieces
  // averaging 1.4 characters and Thai into twenty-one where there are six.
  //
  // Nowhere else does that matter as much as here, because here the pieces are
  // shown to the learner as the words they said. It told them that नउम had
  // become नए — neither of which is a word.
  const hindi = compareToTarget("मुझे जाना है", "मुझे खाना है");
  assert.equal(hindi.outcomes.length, 3, "three words, not a heap of consonants");
  assert.deepEqual(
    hindi.outcomes.map((outcome) => outcome.kind),
    ["kept", "changed", "kept"],
    "and it points at the one that changed",
  );
});

test("a script with no spaces is cut into words, and the changed one located", () => {
  // Thai and Japanese write without spaces. This used to compare the whole
  // line as one piece, honestly but uselessly; the platform word segmenter
  // (wordSegments.ts) now cuts it, so the word that came out wrong is named.
  const thai = compareToTarget("ไว้เจอกันใหม่นะ", "ไว้เจอกันเก่านะ");
  assert.deepEqual(
    thai.outcomes.filter((o) => o.kind !== "kept").map(bare),
    [{ kind: "changed", word: "ใหม่", heardAs: "เก่า" }],
  );
  assert.equal(thai.outcomes.length, 5);
  const japanese = compareToTarget("そこで何したの", "そこで何時なの");
  assert.equal(japanese.clean, false);
  assert.deepEqual(bare(japanese.outcomes[0]!), { kind: "kept", word: "そこで" });
  assert.deepEqual(bare(japanese.outcomes.at(-1)!), { kind: "kept", word: "の" });
});

test("languages that do use spaces are untouched by any of this", () => {
  const english = compareToTarget("Can I get a latte please", "Can I get a latte peace");
  assert.equal(english.outcomes.length, 6);
  assert.deepEqual(bare(english.outcomes.at(-1)!), {
    kind: "changed",
    word: "please",
    heardAs: "peace",
  });
});

test("a Japanese line is compared word by word, not as one word", () => {
  const { outcomes } = compareToTarget("結局ほかの店に行った", "結局ほかの駅に行った");
  assert.ok(outcomes.length > 3);
  assert.ok(outcomes.some((o) => o.kind === "changed" && o.word === "店" && o.heardAs === "駅"));
  assert.ok(outcomes.filter((o) => o.kind === "kept").length >= 3);
});

test("a word heard in two pieces is reported as one, glued without spaces in spaceless scripts", () => {
  const ja = compareToTarget("はじめまして。キムです。", "初めまして キムです");
  const first = ja.outcomes[0]!;
  assert.equal(first.kind, "changed");
  assert.equal(first.kind === "changed" && first.heardAs, "初めまして");
  assert.deepEqual(ja.added, []);
  const es = compareToTarget("Quiero un café", "Quiero un ca fe");
  const last = es.outcomes.at(-1)!;
  assert.equal(last.kind === "changed" && last.heardAs, "ca fe");
});

test("pieces are shared out by length when several words went missing", () => {
  const ja = compareToTarget("はじめまして。민지です。", "初め まして ミンジ です");
  const changed = ja.outcomes.filter((outcome) => outcome.kind === "changed");
  assert.deepEqual(
    changed.map((outcome) => outcome.kind === "changed" && outcome.heardAs),
    ["初めまして", "ミンジ"],
  );
});

test("떠올려 말하기 세 갈래: 맞지만 어색함도 통과, 틀림은 고친 줄과 함께", () => {
  const awkward = parsePractice('{"good": false, "verdict": "awkward", "better": "I\'ll finish it on Wednesday.", "note": "n"}')!;
  assert.equal(awkward.good, true);
  assert.equal(awkward.verdict, "awkward");
  assert.equal(awkward.better, "I'll finish it on Wednesday.");
  const natural = parsePractice('{"good": true, "verdict": "natural", "better": "x", "note": "n"}')!;
  assert.equal(natural.good, true);
  assert.equal(natural.better, undefined);
  const wrong = parsePractice('{"good": true, "verdict": "wrong", "better": "y", "note": "n"}')!;
  assert.equal(wrong.good, false);
  assert.equal(wrong.better, "y");
  assert.equal(parsePractice('{"good": true, "note": "n"}')!.verdict, undefined);
});

test("what was heard is shown in the script's own case and punctuation (2026-10-29)", () => {
  const show = (target: string, heard: string) =>
    compareToTarget(target, heard)
      .outcomes.map((o) => (o.kind === "changed" ? `[${o.heardAs}]` : o.shown) + (o.space === false ? "" : " "))
      .join("")
      .trim();
  assert.equal(show("It was fun! I went to the beach.", "it was fun i went to the beach"), "It was fun! I went to the beach.");
  // 바뀐 낱말도 대본이 대문자로 시작하면 대문자로.
  assert.equal(show("Large, please.", "large peace"), "Large, [peace]");
  // 띄어쓰기 없는 언어는 붙여서, 문장부호는 그대로.
  assert.equal(show("はじめまして田中です。", "はじめまして田中です"), "はじめまして田中です。");
  assert.equal(show("สวัสดีครับ ผมชื่อทอม", "สวัสดีครับ ผมชื่อทอม"), "สวัสดีครับ ผมชื่อทอม");
  // 영어 아닌 라틴: 앞에 붙는 부호(¿)와 악센트.
  assert.equal(show("¿Dónde está el baño?", "dónde está el baño"), "¿Dónde está el baño?");
  // 비교는 예전 그대로(소문자·부호 없음).
  assert.equal(compareToTarget("¿Dónde está el baño?", "dónde está el baño").clean, true);
});

