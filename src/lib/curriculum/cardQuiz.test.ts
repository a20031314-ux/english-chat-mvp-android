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
  const words = ["casa", "cane", "gatto", "libro", "mare", "sole", "luna", "pane"];
  const a = cardQuiz("it", "w|casa", "hide", "s1");
  if (a?.kind !== "meaning") return assert.fail("meaning");
  const prev = new Set(a.options.map((o) => o.raw));
  // 정답 뜻이 방금 보기로 나온 낱말은 고르기 대신 쓰기(소거로 풀림, 2026-11-10 구성 고치기).
  const shownWord = words.find((w, i) => w !== "casa" && prev.has(`뜻${i}`))!;
  assert.equal(cardQuiz("it", `w|${shownWord}`, "hide", "s1")?.kind, "type");
  const freshWord = words.find((w, i) => w !== "casa" && !prev.has(`뜻${i}`))!;
  const b = cardQuiz("it", `w|${freshWord}`, "hide", "s1");
  if (b?.kind !== "meaning") return assert.fail("meaning b");
  assert.ok(b.options.every((o) => !prev.has(o.raw)), "앞 문제 보기 다시");
});

test("카드 예문: 최근에 이 열쇠로 낸 문장(noteAsked)은 뒤로 — 안 낸 예문부터, 다 냈으면 가장 오래전 것 (es·th)", async () => {
  const { noteAsked } = await import("./quiz.ts");
  for (const [lang, key, texts, piece] of [
    ["es", "w|tamaño", ["El tamaño es grande.", "¿Qué tamaño usas?"], "tamaño"],
    ["th", "w|ทะเลสาบ", ["ทะเลสาบสวยมาก", "เราไปทะเลสาบกัน"], "ทะเลสาบ"],
  ] as const) {
    registerQuizSources(lang, [
      { key, sources: texts.map((text) => ({ text, gloss: { en: "", raw: "뜻" }, from: key, stage: 1, piece, who: "me" as const, wordGloss: "크기", pos: "noun" })) },
      ...Array.from({ length: 6 }, (_, i) => card(`w|${lang}o${i}`, `${lang}o${i} ok.`, `${lang}o${i}`, `다른${i}`)),
    ]);
    for (let i = 0; i < 6; i += 1) {
      noteAsked(lang, key, texts[0]);
      assert.equal(cardQuiz(lang, key, "show", `seed${i}`)?.text, texts[1], `${lang} 안 낸 예문`);
    }
    noteAsked(lang, key, texts[1]);
    assert.equal(cardQuiz(lang, key, "show", "x")?.text, texts[0], `${lang} 가장 오래전 것`);
  }
});

test("첫 글자 도움: 자소 묶음 첫 글자 + …, 셋보다 짧은 답·한자는 없음 (es·th·hi·ko·zh)", async () => {
  const { firstCue } = await import("./quiz.ts");
  assert.equal(firstCue("quiero"), "q…");
  assert.equal(firstCue("ทะเล"), "ท…");
  // 힌디: 자음 + 모음 기호를 한 글자로(\p{M}를 떼지 않음).
  assert.equal(firstCue("किताब"), "कि…");
  assert.equal(firstCue("먹었어요"), "먹…");
  assert.equal(firstCue("es"), "");
  assert.equal(firstCue("我们"), "");
  assert.equal(firstCue("食べたい"), "");
});

test("맞나 틀리나: 낱말은 그대로, 앞에 문법 실수 하나(조동사+to · be+원형 · 자음 앞 an), 맞는 문장이 섞임, 영어만 (en·es·ja)", async () => {
  const { judgeQuiz, grammarSlip } = await import("./quiz.ts");
  // 규칙마다: 틀린 문장 = lead + bad + tail, 낱말(piece)은 tail에 그대로.
  const to = grammarSlip("en", "I will do my homework later.", "do", "do", "verb");
  assert.deepEqual(to && [to.rule, `${to.lead}${to.bad}${to.tail}`, to.key, to.fix], ["modalTo", "I will to do my homework later.", "g|2:2", ""]);
  const be = grammarSlip("en", "Do you know her name?", "know", "know", "verb");
  assert.deepEqual(be && [be.rule, `${be.lead}${be.bad}${be.tail}`, be.key], ["beBase", "Do you are know her name?", "g|1:0"]);
  const an = grammarSlip("en", "The car is red.", "car", "car", "noun");
  assert.deepEqual(an && [an.rule, `${an.lead}${an.bad}${an.tail}`, an.fix], ["an", "An car is red.", "The"]);
  // 맞는 문장이 되는 자리는 안 씀: be 뒤에 와도 되는 말 · 원형이 아닌 꼴 · 소리 안 나는 h · 앞말에 문장부호.
  assert.equal(grammarSlip("en", "I like watching movies.", "like", "like", "verb"), null, "I am like … = 맞을 수 있음");
  assert.equal(grammarSlip("en", "I will took it.", "took", "take", "verb"), null, "원형이 아니면 안 씀");
  assert.equal(grammarSlip("en", "Wait a hour.", "hour", "hour", "noun"), null, "an hour");
  assert.equal(grammarSlip("en", "Yes, I need it.", "need", "need", "verb")?.rule, "beBase");
  assert.equal(grammarSlip("en", "Well, need it.", "need", "need", "verb"), null);
  assert.equal(grammarSlip("es", "Yo como pan.", "como", "comer", "verb"), null, "영어만");
  registerQuizSources("en", [
    { key: "w|need", sources: [...card("w|need", "I need a new pair of shoes.", "need", "필요하다", "verb").sources, ...card("w|need", "Needs are many.", "Needs", "필요하다", "verb").sources] },
    card("w|car", "Is that your car?", "car", "자동차", "noun"),
  ]);
  let right = 0;
  let made = 0;
  for (let s = 0; s < 90; s += 1) {
    const q = judgeQuiz("en", "w|need", `seed${s}`);
    if (!q || q.kind !== "judge") continue;
    made += 1;
    assert.equal(q.before + q.answer + q.after, q.text);
    assert.equal(q.text, "I need a new pair of shoes.", "실수를 끼울 수 있는 예문만");
    if (q.wrong === null) right += 1;
    else assert.equal(`${q.slip.lead}${q.slip.bad}${q.slip.tail}`, "I am need a new pair of shoes.");
  }
  assert.equal(made, 90);
  assert.ok(right > 15 && right < 50, `맞는 문장 ${right}/90`);
  assert.equal(judgeQuiz("en", "w|car", "s"), null, "your 앞은 안 바꿈 → 끼울 실수 없으면 안 냄");
  registerQuizSources("ja", [card("w|食べる", "パンを食べた。", "食べ", "먹다", "verb")]);
  assert.equal(judgeQuiz("ja", "w|食べる", "s"), null);
  // cardQuiz는 judge를 켰을 때만, 맞힌 말(show)에서 반쯤.
  const judged = Array.from({ length: 40 }, (_, i) => cardQuiz("en", "w|need", "show", `x${i}`, { judge: true })?.kind);
  assert.ok(judged.includes("judge") && judged.includes("type"), judged.join());
  assert.ok(Array.from({ length: 20 }, (_, i) => cardQuiz("en", "w|need", "show", `x${i}`)?.kind).every((kind) => kind === "type"));
});

test("맞나 틀리나: 한국어 조사 받침 · 스페인어·프랑스어·이탈리아어·포르투갈어 관사 성 (맞는 관사일 때만 바꿈)", async () => {
  const { grammarSlip, slipBadIndex } = await import("./quiz.ts");
  const ko = grammarSlip("ko", "새 가구를 들여서 방이 달라져.", "가구를", "가구", "noun");
  assert.deepEqual(ko && [ko.rule, `${ko.lead}${ko.bad}${ko.tail}`, ko.fix, ko.key, ko.attached], ["particle", "새 가구을 들여서 방이 달라져.", "를", "g|1:4", true]);
  assert.equal(slipBadIndex(ko!), 1, "붙은 조사 = 앞말 자리");
  assert.equal(grammarSlip("ko", "가능성이 높아.", "가능성이", "가능성", "noun")?.bad, "가");
  assert.equal(grammarSlip("ko", "저는 학생이에요.", "학생이에요", "학생", "noun"), null, "이에요의 이는 조사가 아님");
  assert.equal(grammarSlip("ko", "그럴 가능성도 있어.", "가능성도", "가능성", "noun"), null, "받침과 상관없는 조사");
  assert.equal(grammarSlip("ko", "밥을 먹어.", "먹어", "먹다", "verb"), null, "명사만");
  const es = grammarSlip("es", "La casa es grande.", "casa", "casa", "noun", "f");
  assert.deepEqual(es && [`${es.lead}${es.bad}${es.tail}`, es.fix, es.key, es.gender], ["El casa es grande.", "La", "g|1:4", "f"]);
  assert.equal(slipBadIndex(es!), 0);
  assert.equal(grammarSlip("es", "Bebo el agua fría.", "agua", "agua", "noun", "f"), null, "el agua — 성과 다른 관사는 안 바꿈");
  assert.equal(grammarSlip("es", "Es un artista.", "artista", "artista", "noun", "mf"), null, "두 성 낱말");
  assert.equal(`${grammarSlip("fr", "J'aime le café.", "café", "café", "noun", "m")!.bad}`, "la");
  assert.equal(grammarSlip("pt", "Vou a praia.", "praia", "praia", "noun", "m"), null, "a가 전치사(성과 안 맞음)");
  assert.equal(grammarSlip("it", "Ho comprato una macchina.", "macchina", "macchina", "noun", "f")!.bad, "un");
});

test("맞나 틀리나 관사 성: 두 성이 맞거나 성에 따라 뜻이 바뀌는 낱말은 word-traits에 mf → 관사를 안 바꿈 (es·fr·it·pt)", async () => {
  const { readFileSync } = await import("node:fs");
  const { grammarSlip } = await import("./quiz.ts");
  // el/la azúcar · el final(끝)/la final(결승) · el cura(신부)/la cura(치료) · il/la radio · o/a personagem …
  const both: Record<string, string[]> = {
    es: ["azúcar", "final", "cura", "radio", "mar", "papa", "coma", "margen", "lente", "comandante", "pariente"],
    fr: ["radio", "guide", "finale", "dentiste"],
    it: ["radio", "fonte", "assistente", "tenente"],
    pt: ["cura", "grama", "cabeça", "rádio", "caixa", "personagem", "parente"],
  };
  for (const [language, words] of Object.entries(both)) {
    const book = JSON.parse(readFileSync(new URL(`./word-traits/${language}.json`, import.meta.url), "utf8")) as Record<string, { g?: string }>;
    for (const word of words) assert.equal(book[word]?.g, "mf", `${language} ${word}`);
  }
  assert.equal(grammarSlip("es", "Me gusta el azúcar.", "azúcar", "azúcar", "noun", "mf"), null);
  assert.equal(grammarSlip("pt", "A personagem principal é forte.", "personagem", "personagem", "noun", "mf"), null);
});
