import { test } from "node:test";
import assert from "node:assert/strict";
import { allFramesFor } from "./frames.ts";
import { bundleQuiz, dialogOf, diffSpan, fixedRight, plainMisses, quizSources, spotFromCard, spotOf, typedRight } from "./quiz.ts";
import { DECOYS } from "./frames/decoys/index.ts";
import { PLAIN_DECOYS } from "./frames/decoys/plain/index.ts";
import { romajiToHiragana } from "../romaji.ts";

const fixed = () => 0.3;

test("빈칸 쓰기 채점: 한 글자 오타는 긴 낱말 가운데만, 어미·짧은 말·헷갈리는 오답은 틀림", () => {
  assert.equal(typedRight("beautiful", "beautful", { language: "en" }), "loose");
  assert.equal(typedRight("goes", "goe", { language: "en" }), false, "짧고 끝 글자");
  assert.equal(typedRight("have", "has", { language: "en" }), false);
  assert.equal(typedRight("cansada", "cansado", { language: "es" }), false, "성수 어미는 문법");
  assert.equal(typedRight("necesito", "nesecito", { language: "es" }), false, "두 글자 차이");
  assert.equal(typedRight("necesito", "necsito", { language: "es" }), "loose");
  assert.equal(typedRight("Cuánto", "cuanto", { language: "es" }), "loose", "악센트");
  assert.equal(typedRight("restaurant", "restaurent", { language: "en", near: ["restaurent"] }), false, "알려진 틀린 꼴");
  assert.equal(typedRight("저는", "제는", { language: "ko" }), false, "한국어는 한 글자도 봐주지 않음");
  assert.equal(typedRight("ありがとう", "ありがとお", { language: "ja" }), false, "띄어쓰기 없는 말");
});

test("빈칸 쓰기 채점: 일본어 로마자(조사 wa·o·e 포함), 한자 답은 기기에서 안 맞춤", () => {
  assert.equal(romajiToHiragana("konnichiwa"), "こんにちわ");
  assert.equal(romajiToHiragana("kitte"), "きって");
  assert.equal(typedRight("ください", "kudasai", { language: "ja" }), "loose");
  assert.equal(typedRight("は", "wa", { language: "ja" }), "loose");
  assert.equal(typedRight("を", "o", { language: "ja" }), "loose");
  assert.equal(typedRight("コーヒー", "koohii", { language: "ja" }), "loose");
  assert.equal(typedRight("が", "wa", { language: "ja" }), false);
  assert.equal(typedRight("紅茶", "koucha", { language: "ja" }), false, "한자 — 서버 다시 보기로");
});

test("확실히 틀린 꼴: 원래 오답의 부분집합이고, 14개 언어 모두 있다", () => {
  for (const language of Object.keys(DECOYS)) {
    const plain = PLAIN_DECOYS[language];
    assert.ok(plain && Object.keys(plain).length > 20, `${language} 확실히 틀린 꼴`);
    for (const [key, list] of Object.entries(plain)) {
      const from = DECOYS[language]![key] ?? [];
      for (const one of list) assert.ok(from.includes(one), `${language} ${key} ${one}`);
    }
  }
  // 뜻만 다른 맞는 말은 빠짐(아랍어 "어디" 자리의 "언제").
  assert.ok(!plainMisses("ar", "ar-f1-04", "أين").includes("متى"));
});

test("틀린 곳 고치기: 일본어(띄어쓰기 없음)·스페인어 — 틀린 자리 하나, 고친 말 채점", () => {
  for (const language of ["ja", "es"]) {
    let made = 0;
    for (const frame of allFramesFor(language).slice(0, 30)) {
      for (const source of quizSources(language, `f|${frame.id}`)) {
        const spot = spotOf(language, `f|${frame.id}`, source, fixed);
        if (!spot) continue;
        made += 1;
        assert.notEqual(spot.text, spot.right);
        assert.ok(spot.bad.length >= 1 && spot.bad.length <= 3);
        assert.equal(fixedRight(spot, spot.want, language), "exact");
        const wrongPart = spot.bad.map((i) => spot.words[i]).join(language === "ja" ? "" : " ");
        assert.equal(fixedRight(spot, wrongPart, language), false, `${language}: 틀린 꼴 그대로 다시 침`);
      }
    }
    assert.ok(made >= 20, `${language} 문제 ${made}`);
  }
  const clean = spotOf("es", `f|${allFramesFor("es")[0]!.id}`, quizSources("es", `f|${allFramesFor("es")[0]!.id}`)[0]!, fixed, true);
  assert.ok(clean && clean.bad.length === 0 && clean.text === clean.right, "틀린 곳 없는 문장");
});

test("틀린 곳 고치기: 내가 고침받은 줄 — 자리가 하나면 고치기, 여러 군데면 null", () => {
  const spot = spotFromCard("en", { wrong: "Yesterday I go to school.", right: "Yesterday I went to school." });
  assert.ok(spot && spot.mine);
  assert.deepEqual(spot.bad, [2]);
  assert.equal(spot.want, "went");
  assert.equal(diffSpan("en", "I like cat and I want go home now please", "I like cats and I want to go home now please"), null);
  assert.equal(diffSpan("fr", "Je suis allé au marché.", "Je suis allée au marché.")?.want, "allée");
});

test("묶음: 문법 탭은 빈칸 쓰기 + 틀린 곳 고치기(같은 열쇠 바로 뒤가 아님) + 대화 속 틀린 줄", () => {
  const keys = allFramesFor("en").filter((frame) => frame.stage <= 2).slice(0, 8).map((frame) => `f|${frame.id}`);
  const made = bundleQuiz("en", keys, { seed: "2026-10-30-0", stage: 2, style: "type", fallback: "choose", strict: true, spots: { dialog: true } });
  const kinds = made.questions.map((q) => q.kind);
  assert.ok(kinds.includes("spot"), kinds.join(","));
  assert.ok(kinds.includes("dialog"), kinds.join(","));
  assert.ok(kinds.filter((kind) => kind !== "spot" && kind !== "dialog").every((kind) => kind === "type" || kind === "choose"));
  const at = kinds.indexOf("spot");
  assert.notEqual(made.keys[at], made.keys[at - 1]);
  assert.equal(made.keys.length, made.questions.length);
});

test("대화 속 틀린 줄: 한 줄만 바뀌고 나머지는 대본 그대로(태국어·아랍어)", () => {
  for (const language of ["th", "ar"]) {
    const dialog = dialogOf(language, 2, "seed");
    assert.ok(dialog, language);
    const q = dialog!.question;
    assert.equal(q.kind, "dialog");
    if (q.kind !== "dialog") continue;
    assert.ok(q.lines.length >= 4 && q.lines.length <= 5);
    assert.equal(q.lines[q.at]!.text, q.spot.text);
    assert.ok(dialog!.key.startsWith("f|"));
  }
});
