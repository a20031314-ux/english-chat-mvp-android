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

test("낱말 한 모양: 보기가 셋 안 모이면 그 낱말은 퀴즈에 안 냄, 같은 품사가 모자라면 순위 가까운 비슷한 모양 뜻으로 (es·th)", () => {
  registerQuizSources("es", [card("w|grande", "Es una casa grande.", "grande", "큰", "adj"), card("w|enorme", "Un perro enorme.", "enorme", "큰", "adj")]);
  const show = cardQuiz("es", "w|grande", "show", "s");
  assert.equal(show?.kind === "type" && show.before, "Es una casa ");
  // 겹치지 않는 뜻이 셋 안 됨 → 스스로 체크 대신 안 냄(사용자 2026-11-17 "뜻 고르기로 대체").
  assert.equal(cardQuiz("es", "w|grande", "hide", "s"), null);
  // 같은 품사가 없으면 순위가 가깝고 모양이 비슷한 다른 품사 뜻으로 고르기.
  registerQuizSources("th", [card("w|ใหญ่", "บ้านใหญ่มาก", "ใหญ่", "크다", "adj"), card("w|กิน", "กินข้าว", "กิน", "먹다", "verb"), card("w|นอน", "นอนเร็ว", "นอน", "자다", "verb"), card("w|ไป", "ไปบ้าน", "ไป", "가다", "verb")]);
  const th = cardQuiz("th", "w|ใหญ่", "hide", "s");
  assert.equal(th?.kind, "meaning");
  if (th?.kind === "meaning") assert.deepEqual(th.options.map((o) => o.raw).sort(), ["가다", "먹다", "자다", "크다"]);
  assert.equal(cardQuiz("es", "g|1:2", "show", "s"), null);
});

test("기능어 뜻 고르기: 같은 품사 뜻으로만 — 모자라면 안 냄, 명사 뜻으로 채우지 않음 (fr·ja)", () => {
  // 사용자 2026-11-23: "the" 보기에 "피해자·전체의 양"(명사)이 붙어 한눈에 지워짐.
  registerQuizSources("fr", [card("w|le", "Le chat dort.", "Le", "정관사", "article"), card("w|un", "Un chien court.", "Un", "하나, 임의의 하나", "article"), card("w|victime", "La victime parle.", "victime", "피해자", "noun"), card("w|total", "Le total est bon.", "total", "전체의 양", "noun"), card("w|homme", "Un homme vient.", "homme", "남자", "noun")]);
  assert.equal(cardQuiz("fr", "w|le", "hide", "s"), null);
  // 같은 품사(조사)가 넷이면 그 뜻들로 낸다.
  registerQuizSources("ja", [card("w|が", "猫が寝る。", "が", "주어 표시", "particle"), card("w|を", "水を飲む。", "を", "목적어 표시", "particle"), card("w|に", "家に帰る。", "に", "~에, ~로", "particle"), card("w|で", "駅で会う。", "で", "~에서(장소)", "particle"), card("w|水", "水を飲む。", "水", "물", "noun")]);
  const ja = cardQuiz("ja", "w|が", "hide", "s");
  assert.equal(ja?.kind, "meaning");
  if (ja?.kind === "meaning") assert.ok(!ja.options.some((option) => option.raw === "물"), ja.options.map((o) => o.raw).join(","));
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
  // 정답 뜻이 방금 보기로 나온 낱말은 이번엔 안 냄(소거로 풀림 — 낱말은 한 모양).
  const shownWord = words.find((w, i) => w !== "casa" && prev.has(`뜻${i}`))!;
  assert.equal(cardQuiz("it", `w|${shownWord}`, "hide", "s1"), null);
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

test("낱말 보기: 같은 주제 먼저, 뜻풀이가 겹치는 보기는 안 냄 (es·ja)", () => {
  const topical = (key: string, text: string, piece: string, wordGloss: string, topic: string): { key: string; sources: QuizSource[] } => ({
    key,
    sources: [{ text, gloss: { en: "", raw: `${text} (뜻)` }, from: key, stage: 1, piece, who: "me", wordGloss, pos: "noun", topic }],
  });
  registerQuizSources("es", [
    topical("w|zzperro", "El zzperro duerme en el sofá.", "zzperro", "짐승개", "animal"),
    topical("w|zzgato", "El zzgato come.", "zzgato", "짐승고양이", "animal"),
    topical("w|zzvaca", "La zzvaca come.", "zzvaca", "짐승소", "animal"),
    topical("w|zzpato", "El zzpato nada.", "zzpato", "짐승오리", "animal"),
    topical("w|zzmesa", "La zzmesa es grande.", "zzmesa", "짐승탁자", "home"),
    topical("w|zzsilla", "La zzsilla es nueva.", "zzsilla", "짐승의자", "home"),
  ]);
  const es = cardQuiz("es", "w|zzperro", "hide", "t1");
  assert.equal(es?.kind, "meaning");
  if (es?.kind === "meaning") assert.deepEqual(es.options.map((one) => one.raw).sort(), ["짐승개", "짐승고양이", "짐승소", "짐승오리"].sort());
  registerQuizSources("ja", [
    card("w|zz自分", "zz自分で作ります。", "zz自分", "자기, 자신"),
    card("w|zz時", "zz時が来た。", "zz時", "때, 시간"),
    card("w|zz時間", "zz時間がない。", "zz時間", "시간"),
    card("w|zz日", "zz日が長い。", "zz日", "날, 하루"),
    card("w|zz人", "zz人が多い。", "zz人", "사람"),
    card("w|zz自身", "zz自身で。", "zz自身", "자신"),
  ]);
  for (const seed of ["a", "b", "c", "d"]) {
    const ja = cardQuiz("ja", "w|zz自分", "hide", seed);
    if (ja?.kind !== "meaning") continue;
    const raws = ja.options.map((one) => one.raw);
    assert.ok(!raws.includes("자신"), "정답 뜻풀이와 겹치는 보기 없음");
    assert.ok(!(raws.includes("때, 시간") && raws.includes("시간")), "보기끼리 겹치지 않음");
  }
});

test("정해 둔 뜻 오답(MEANING_DECOYS)이 먼저 — 예문 자리에 맞는 보기 (en·es, 체감 점검 2026-11-19)", () => {
  registerQuizSources("en", [
    card("w|stethoscope", "The doctor listened to my heart with a stethoscope.", "stethoscope", "청진기"),
    card("w|microphone", "Speak into the microphone.", "microphone", "마이크"),
    card("w|mirror", "Look in the mirror.", "mirror", "거울"),
    card("w|flashlight", "Bring a flashlight.", "flashlight", "손전등"),
    card("w|scar", "He has a scar.", "scar", "흉터"),
    card("w|thigh", "My thigh hurts.", "thigh", "허벅지"),
    card("w|palm", "Open your palm.", "palm", "손바닥"),
  ]);
  const q = cardQuiz("en", "w|stethoscope", "hide", "s");
  assert.equal(q?.kind, "meaning");
  const raws = q?.kind === "meaning" ? q.options.map((one) => one.raw).sort() : [];
  assert.deepEqual(raws, ["거울", "마이크", "손전등", "청진기"]);
  registerQuizSources("es", [
    card("w|clavar", "Voy a clavar un cuadro en la pared.", "clavar", "يسمّر", "verb"),
    card("w|pintar", "Voy a pintar la pared.", "pintar", "يرسم، يدهن", "verb"),
    card("w|mover", "Hay que mover la mesa.", "mover", "يحرّك", "verb"),
    card("w|limpiar", "Tengo que limpiar.", "limpiar", "ينظّف", "verb"),
    card("w|charlar", "Me gusta charlar.", "charlar", "الدردشة", "verb"),
  ]);
  const es = cardQuiz("es", "w|clavar", "hide", "s");
  const esRaws = es?.kind === "meaning" ? es.options.map((one) => one.raw) : [];
  assert.ok(!esRaws.includes("الدردشة"), "명사꼴 뜻은 정해 둔 셋에 밀림");
});
