import assert from "node:assert/strict";
import test from "node:test";
import {
  isNodeId,
  phrasePrompt,
  placePhrases,
  readPhrasePlaces,
  addCard,
  addPending,
  defaultPicked,
  prunePending,
  PENDING_KEEP_MS,
  applyEdit,
  cardCounts,
  emptyNotebook,
  grammarNodeId,
  isRealFix,
  parseEdit,
  placeOptions,
  readPlacement,
  skeletonFor,
  stageOrderOf,
  type FixCard,
} from "./notebook.ts";

const card = (over: Partial<FixCard> = {}): FixCard => ({
  id: "abc123def456",
  wrong: "She are my friend.",
  right: "She is my friend.",
  note: "주어가 하나면 is",
  node: "g1-be-verb",
  where: "chat",
  at: 1000,
  ...over,
});

test("뼈대: 글자·소리 + 지금 단계까지의 문법, 단계 범위가 있는 14개 언어 모두", () => {
  for (const language of ["en", "ja", "ko", "zh", "th", "ar", "hi", "ru", "es", "fr", "it", "pt", "id", "vi"]) {
    const one = skeletonFor(language, 1);
    const three = skeletonFor(language, 3);
    assert.ok(one.some((n) => n.chapter === "grammar"), `${language} 문법`);
    assert.ok(three.filter((n) => n.chapter === "grammar").length > one.filter((n) => n.chapter === "grammar").length, `${language} 단계가 오르면 칸이 는다`);
    assert.equal(new Set(three.map((n) => n.id)).size, three.length, `${language} id 겹침 없음`);
    for (const node of three) assert.match(node.id, /^(g\d-|s-|i-|d-)/);
    assert.ok(three.some((n) => n.id === "i-idiom") && three.some((n) => n.id === "d-register"), `${language} 관용·세부 고정 칸`);
  }
  assert.ok(skeletonFor("ja", 1).some((n) => n.chapter === "script"), "일본어는 가나 칸");
  // 영어 1단계 be동사는 구문 id로 이름이 붙는다.
  assert.ok(skeletonFor("en", 1).some((n) => n.id === "g1-be-verb"));
  assert.equal(grammarNodeId(2, { name: { en: "Past simple: regular -ed" } }), "g2-past-simple-regular-ed");
  // 칸 고르기 후보에는 뒤 단계 문법도(ahead).
  const withAhead = skeletonFor("en", 1, true);
  assert.ok(withAhead.some((n) => n.ahead && n.stage === 2));
  assert.ok(!skeletonFor("en", 1).some((n) => n.ahead));
  assert.match(placeOptions(withAhead, []), /grammar \(later\)/);
  assert.equal(stageOrderOf("ja-3"), 3);
  assert.equal(stageOrderOf(null), 1);
});

test("모델에게 주는 칸 목록에 내가 만든 칸도", () => {
  const options = placeOptions(skeletonFor("en", 1).slice(0, 2), [{ id: "c-mine01", name: "내 실수 모음", at: 1 }]);
  assert.match(options, /c-mine01 — the learner's own section: 내 실수 모음/);
});

test("모델 답 읽기: 모르는 칸은 자리 없음 + 제안, 설명이 없으면 튜터 설명", () => {
  const known = new Set(["g1-be-verb"]);
  assert.deepEqual(readPlacement('{"node":"g1-be-verb","note":"주어가 하나면 is"}', known, ""), { node: "g1-be-verb", note: "주어가 하나면 is" });
  assert.deepEqual(readPlacement('{"node":"g9-nope","suggest":"전치사 고르기","note":""}', known, "on 대신 at"), {
    node: null,
    suggest: "전치사 고르기",
    note: "on 대신 at",
  });
  assert.deepEqual(readPlacement("not json", known, ""), { node: null, note: "" });
});

test("카드: 고친 데가 없으면 안 넣고, 같은 실수는 한 장(시각만 새로)", () => {
  assert.equal(isRealFix("Hello.", "hello"), false);
  assert.equal(isRealFix("私は学生", "私は学生です"), true, "띄어쓰기 없는 언어");
  let book = addCard(emptyNotebook(), card());
  assert.equal(book.cards.length, 1);
  book = addCard(book, card({ id: "zzz999yyy888", at: 2000 }));
  assert.equal(book.cards.length, 1);
  assert.equal(book.cards[0]!.at, 2000);
  book = addCard(book, card({ id: "qqq111www222", wrong: "Yo tiene hambre.", right: "Yo tengo hambre.", node: null, at: 3000 }));
  assert.equal(book.cards.length, 2);
  assert.equal(addCard(book, card({ id: "rrr333", wrong: "Hi!", right: "hi" })), book);
  assert.deepEqual(cardCounts(book), { "g1-be-verb": 1, "": 1 });
});

test("편집: 옮기면 다시 안 옮기게 표시, 내가 만든 칸 지우면 카드는 자리 없음으로", () => {
  let book = addCard(emptyNotebook(), card({ suggest: "be동사 정리" }));
  book = applyEdit(book, parseEdit({ op: "addNode", id: "c-mine01", name: "  자주 틀림  " })!);
  assert.deepEqual(book.custom.map((n) => n.name), ["자주 틀림"]);
  book = applyEdit(book, parseEdit({ op: "move", card: "abc123def456", node: "c-mine01" })!);
  assert.equal(book.cards[0]!.node, "c-mine01");
  assert.equal(book.cards[0]!.moved, true);
  assert.equal(book.cards[0]!.suggest, undefined);
  book = applyEdit(book, parseEdit({ op: "memoCard", card: "abc123def456", memo: "she/he/it → is" })!);
  assert.equal(book.cards[0]!.memo, "she/he/it → is");
  book = applyEdit(book, parseEdit({ op: "renameNode", node: "g1-be-verb", name: "be동사" })!);
  assert.equal(book.renames["g1-be-verb"], "be동사");
  book = applyEdit(book, parseEdit({ op: "renameNode", node: "g1-be-verb", name: "" })!);
  assert.equal(book.renames["g1-be-verb"], undefined, "빈 이름이면 원래 이름으로");
  book = applyEdit(book, parseEdit({ op: "deleteNode", node: "c-mine01" })!);
  assert.equal(book.custom.length, 0);
  assert.equal(book.cards[0]!.node, null);
  assert.equal(parseEdit({ op: "deleteNode", node: "g1-be-verb" }), null, "뼈대 칸은 못 지움");
  book = applyEdit(book, parseEdit({ op: "deleteCard", card: "abc123def456" })!);
  assert.equal(book.cards.length, 0);
});

test("제안 칸 받기: 새 칸을 만들고 그 카드를 옮긴다", () => {
  let book = addCard(emptyNotebook(), card({ node: null, suggest: "Ser와 estar" }));
  book = applyEdit(book, parseEdit({ op: "acceptSuggest", card: "abc123def456", id: "c-new0001" })!);
  assert.deepEqual(book.custom.map((n) => [n.id, n.name]), [["c-new0001", "Ser와 estar"]]);
  assert.equal(book.cards[0]!.node, "c-new0001");
});

test("모델 답: 짚임 종류(실수/오타)", () => {
  const known = new Set(["g1-be-verb"]);
  assert.equal(readPlacement('{"node":"g1-be-verb","note":"x","kind":"typo"}', known, "").kind, "typo");
  assert.equal(readPlacement('{"node":"g1-be-verb","note":"x"}', known, "").kind, undefined);
});

test("오늘의 학습: 후보로 쌓이고, 또 틀린 것·진짜 실수는 미리 고름, 7일 뒤 빠짐", () => {
  const day = (d: string, at: number, over: Partial<FixCard> = {}) => card({ day: d, at, ...over });
  let book = addPending(emptyNotebook(), day("2026-10-23", 1000, { id: "p1aaaaaa" }), 1000);
  assert.equal(book.cards.length, 0, "바로 노트에 들어가지 않는다");
  assert.equal(book.pending.length, 1);
  assert.equal(book.pending[0]!.again, undefined);
  // 다음 날 같은 칸에 또 → again
  book = addPending(book, day("2026-10-24", 2000, { id: "p2bbbbbb", wrong: "They is late.", right: "They are late." }), 2000);
  assert.equal(book.pending[0]!.again, true);
  // 같은 줄 후보는 한 장
  book = addPending(book, day("2026-10-24", 3000, { id: "p3cccccc", wrong: "They is late.", right: "They are late." }), 3000);
  assert.equal(book.pending.length, 2);
  // 오타·뜻 짐작은 고르지 않은 채로
  assert.equal(defaultPicked({ ...book.pending[1]!, kind: "typo", again: undefined }), false);
  assert.equal(defaultPicked({ ...book.pending[1]!, kind: "meant", again: undefined }), false);
  assert.equal(defaultPicked({ ...book.pending[1]!, kind: "typo", again: true }), true);
  assert.equal(defaultPicked(book.pending[1]!), true);
  // 7일 지나면 빠짐
  assert.equal(prunePending(book, 3000 + PENDING_KEEP_MS).pending.length, 0);
});

test("오늘의 학습: 고른 것만 노트로(화면 붙인 것은 shotId), 버리기", () => {
  let book = addPending(emptyNotebook(), card({ id: "p1aaaaaa", day: "2026-10-24" }), 1000);
  book = addPending(book, card({ id: "p2bbbbbb", wrong: "私は学生じゃありますん。", right: "私は学生じゃありません。", node: null, kind: "typo", day: "2026-10-24" }), 1100);
  book = applyEdit(book, parseEdit({ op: "commit", ids: ["p1aaaaaa"], shots: ["p1aaaaaa", "zzzzzzzz"] })!, 5000);
  assert.equal(book.cards.length, 1);
  assert.equal(book.cards[0]!.shotId, "p1aaaaaa");
  assert.equal(book.cards[0]!.again, undefined);
  assert.deepEqual(book.pending.map((c) => c.id), ["p2bbbbbb"]);
  book = applyEdit(book, parseEdit({ op: "dismiss", ids: ["p2bbbbbb"] })!);
  assert.equal(book.pending.length, 0);
  assert.equal(parseEdit({ op: "commit", ids: [] }), null);
  assert.equal(parseEdit({ op: "commit", ids: ["bad id!"] }), null);
});

test("습득한 표현: 칸 고르기 답 읽기·넣기·옮긴 것은 그대로", () => {
  const known = new Set(["g1-be-verb", "i-idiom", "d-word"]);
  const raw = JSON.stringify({ places: [{ i: 0, node: "i-idiom" }, { i: 1, node: "vocab" }, { i: 2, node: "g9-nope" }, { i: 7, node: "d-word" }] });
  assert.deepEqual(readPhrasePlaces(raw, 3, known), ["i-idiom", null, undefined]);
  assert.deepEqual(readPhrasePlaces("not json", 2, known), [undefined, undefined]);
  assert.ok(isNodeId("i-together") && isNodeId("d-nuance"));
  let book = placePhrases(emptyNotebook(), [{ key: "break the ice", node: "i-idiom" }, { key: "猫", node: null }], 10);
  assert.equal(book.phrases["break the ice"]?.node, "i-idiom");
  assert.equal(book.phrases["猫"]?.node, null);
  book = applyEdit(book, parseEdit({ op: "movePhrase", phrase: "break the ice", node: "d-word" })!, 20);
  book = placePhrases(book, [{ key: "break the ice", node: "i-idiom" }], 30);
  assert.equal(book.phrases["break the ice"]?.node, "d-word", "사용자가 옮긴 것은 다시 고르지 않음");
  assert.match(phrasePrompt({ target: "Spanish", options: "i-idiom — x" }), /"vocab"/);
});

test("궁금한 장면 카드: 사람끼리 대화는 문장·화면을 남기지 않음, 같은 id는 한 번", () => {
  const chat = parseEdit({ op: "addQuestion", id: "q1aaaaaaaa", text: "break the ice", sentence: "Let's break the ice.", note: "어색함을 깨다", node: "i-idiom", where: "chat", shotId: "q1aaaaaaaa" });
  assert.ok(chat && chat.op === "addQuestion" && chat.sentence && chat.shotId);
  const dm = parseEdit({ op: "addQuestion", id: "q2aaaaaaaa", text: "no worries", sentence: "남의 문장 전체", note: "", node: null, where: "dm", shotId: "q2aaaaaaaa" });
  assert.ok(dm && dm.op === "addQuestion" && dm.sentence === "" && !("shotId" in dm && dm.shotId));
  let book = applyEdit(emptyNotebook(), chat!, 5);
  book = applyEdit(book, chat!, 6);
  assert.equal(book.cards.length, 1);
  assert.equal(book.cards[0]?.kind, "question");
  assert.equal(book.cards[0]?.right, "break the ice");
  assert.equal(parseEdit({ op: "addQuestion", id: "bad id", text: "x", node: null }), null);
});
