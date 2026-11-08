import { test } from "node:test";
import assert from "node:assert/strict";
import { cardQuiz, registerQuizSources, typedRight, type QuizSource } from "./quiz.ts";
import { registerReadings } from "./readings/index.ts";

const card = (key: string, text: string, piece: string, wordGloss: string, pos = "noun"): { key: string; sources: QuizSource[] } => ({
  key,
  sources: [{ text, gloss: { en: "", raw: `${text} (뜻)` }, from: key, stage: 1, piece, who: "me", wordGloss, pos }],
});

test("카드 변형: 뜻 가리기 = 밑줄 낱말 + 뜻 넷 중 하나, 뜻만 보여 주기 = 뜻 보고 쓰기 (ja)", () => {
  registerQuizSources("ja", [
    card("w|水", "水を飲みたい。", "水", "물"),
    card("w|山", "山に登った。", "山", "산"),
    card("w|川", "川で泳ぐ。", "川", "강"),
    card("w|空", "空が青い。", "空", "하늘"),
    card("w|食べる", "パンを食べた。", "食べ", "먹다", "verb"),
  ]);
  const hide = cardQuiz("ja", "w|水", "hide", "s");
  assert.equal(hide?.kind, "meaning");
  if (hide?.kind !== "meaning") return;
  assert.equal(hide.mark, "水");
  assert.equal(hide.options.length, 4);
  assert.equal(hide.options[hide.answer]!.raw, "물");
  // 같은 품사(명사) 뜻으로 오답, 정답이 문장에 그대로 보이지 않음(보기는 앱 언어).
  assert.ok(!hide.options.some((option) => option.raw === "먹다"));
  const show = cardQuiz("ja", "w|食べる", "show", "s");
  assert.equal(show?.kind, "type");
  if (show?.kind !== "type") return;
  // 카드 그대로: 뜻은 보이고 예문 속 그 말만 빈칸(답 = 예문 속 꼴).
  assert.equal(show.answer, "食べ");
  assert.equal(show.before + "＿" + show.after, "パンを＿た。");
  assert.deepEqual(show.card, { word: "食べる", meaning: "먹다" });
  assert.deepEqual(hide.card, { word: "水", meaning: "물" });
  // 일본어는 읽기(가나)로 쳐도 맞음 — 채점은 예전 typedRight 그대로(읽기는 빈도 목록이 넣음).
  registerReadings("ja", [["食べる", "たべる"]]);
  assert.ok(typedRight("食べる", "たべる", { language: "ja" }));
});

test("카드 변형: 낱말 가림은 예문 빈칸, 오답이 모자라면 뜻 가림은 null (es)", () => {
  registerQuizSources("es", [card("w|grande", "Es una casa grande.", "grande", "큰", "adj"), card("w|enorme", "Un perro enorme.", "enorme", "큰", "adj")]);
  const show = cardQuiz("es", "w|grande", "show", "s");
  assert.equal(show?.kind === "type" && show.before, "Es una casa ");
  assert.equal(cardQuiz("es", "w|grande", "hide", "s"), null);
  assert.equal(cardQuiz("es", "g|1:2", "show", "s"), null);
});

test("카드 뜻 가림 오답: 빈도 순위가 가까운 같은 품사 먼저, 바로 앞 문제 보기는 다시 안 씀 (th·it)", () => {
  const many = (lang: string, words: string[]) =>
    words.map((w, i) => card(`w|${w}`, `${w} ${w}.`, w, `뜻${i}`));
  // 앞 다섯은 순위가 가깝고, 뒤 다섯은 300개 넘게 떨어진 자리(사이를 빈 카드로 채움).
  const filler = Array.from({ length: 300 }, (_, i) => card(`w|x${i}`, `x${i} x${i}.`, `x${i}`, `먼${i}`, "verb"));
  registerQuizSources("th", [...many("th", ["น้ำ", "ข้าว", "บ้าน", "รถ", "แมว"]), ...filler, ...many("th", ["ภูเขา", "ทะเล", "ฟ้า"])]);
  const first = cardQuiz("th", "w|น้ำ", "hide", "a");
  assert.equal(first?.kind, "meaning");
  if (first?.kind !== "meaning") return;
  const raws = first.options.map((o) => o.raw);
  assert.ok(raws.every((r) => /^뜻[0-4]$/.test(r!)), raws.join(","));
  registerQuizSources("it", [...many("it", ["casa", "cane", "gatto", "libro", "mare", "sole", "luna", "pane"])]);
  const a = cardQuiz("it", "w|casa", "hide", "s1");
  const b = cardQuiz("it", "w|libro", "hide", "s1");
  if (a?.kind !== "meaning" || b?.kind !== "meaning") return assert.fail("meaning");
  const prev = new Set(a.options.map((o) => o.raw));
  assert.ok(b.options.filter((o) => o.raw !== "뜻3").every((o) => !prev.has(o.raw)), "앞 문제 보기 다시");
});

test("맞나 틀리나: 맞는 문장이 섞이고, 틀린 꼴은 바른 꼴과 다르며 문장은 그대로, 철자 틀림은 실제 낱말이 아님, ja는 철자 틀림 없음 (es·ja)", async () => {
  const { judgeQuiz, misspellings } = await import("./quiz.ts");
  registerQuizSources("es", [
    { key: "w|comer", sources: [...card("w|comer", "Ayer comimos paella.", "comimos", "먹다", "verb").sources, ...card("w|comer", "Yo como pan.", "como", "먹다", "verb").sources] },
    card("w|beber", "Bebo agua.", "Bebo", "마시다", "verb"),
    card("w|vivir", "Vivo aquí.", "Vivo", "살다", "verb"),
  ]);
  registerQuizSources("ja", [
    card("w|食べる", "パンを食べた。", "食べ", "먹다", "verb"),
    card("w|飲む", "水を飲んだ。", "飲ん", "마시다", "verb"),
    card("w|見る", "映画を見た。", "見", "보다", "verb"),
    // 빈도 목록 맨 앞 40개는 다른 낱말로 안 끼우니, 그 뒤 동사도 몇 개.
    ...Array.from({ length: 45 }, (_, i) => card(`w|動詞${i}`, `毎日動詞${i}た。`, `動詞${i}`, `동사${i}`, "verb")),
  ]);
  for (const [language, key] of [["es", "w|comer"], ["ja", "w|食べる"]] as const) {
    let right = 0;
    let made = 0;
    const kinds = new Set<string>();
    for (let s = 0; s < 90; s += 1) {
      const q = judgeQuiz(language, key, `seed${s}`);
      if (!q || q.kind !== "judge") continue;
      made += 1;
      assert.equal(q.before + q.answer + q.after, q.text);
      if (q.wrong === null) {
        right += 1;
        assert.equal(q.shown, q.answer);
      } else {
        kinds.add(q.wrong);
        assert.notEqual(q.shown.toLocaleLowerCase(), q.answer.toLocaleLowerCase(), `${language} ${q.shown}`);
      }
    }
    assert.ok(made >= 80, `${language} ${made}`);
    assert.ok(right > made * 0.15 && right < made * 0.6, `${language} 맞는 문장 ${right}/${made}`);
    if (language === "ja") assert.ok(!kinds.has("spell"), "ja는 철자 틀림 없음");
    if (language === "es") assert.ok(kinds.has("form") && kinds.has("spell"), [...kinds].join());
  }
  registerQuizSources("hi", [card("w|पानी", "मैं पानी पीता हूँ", "पानी", "물")]);
  assert.equal(judgeQuiz("hi", "w|पानी", "s"), null, "끼울 틀린 꼴이 없으면 안 냄");
  registerQuizSources("en", [
    card("w|take", "Can you take this bag?", "take", "가져가다", "verb"),
    ...Array.from({ length: 45 }, (_, i) => card(i % 2 ? "w|would" : `w|verb${i}`, i % 2 ? "I would go." : `I verb${i} it.`, i % 2 ? "would" : `verb${i}`, "동사", "verb")),
  ]);
  for (let i = 0; i < 40; i += 1) {
    const q = judgeQuiz("en", "w|take", `aux${i}`);
    if (q?.kind === "judge") assert.notEqual(q.shown.toLowerCase(), "would", "조동사는 다른 낱말로 안 끼움");
  }
  assert.ok(!misspellings("form", new Set(["from"])).includes("from"));
  assert.ok(misspellings("believe", new Set()).includes("beleive"));
  assert.ok(misspellings("más", new Set()).includes("mas"));
  assert.equal(misspellings("más", new Set(["mas"])).includes("mas"), false);
  // cardQuiz는 judge를 켰을 때만, 맞힌 말(show)에서 반쯤.
  const judged = Array.from({ length: 40 }, (_, i) => cardQuiz("es", "w|comer", "show", `x${i}`, { judge: true })?.kind);
  assert.ok(judged.includes("judge") && judged.includes("type"), judged.join());
  assert.ok(Array.from({ length: 20 }, (_, i) => cardQuiz("es", "w|comer", "show", `x${i}`)?.kind).every((kind) => kind === "type"));
});
