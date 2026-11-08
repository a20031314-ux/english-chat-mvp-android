import { test } from "node:test";
import assert from "node:assert/strict";
import { baseCandidates, dictNotes, irregularForms, MAX_NOTES } from "./dictNotes.ts";
import { loadBank } from "./vocabBank.ts";
import { readFileSync } from "node:fs";

const keys = (notes: { key: string }[]) => notes.map((one) => one.key);

test("영어: 불규칙·-ed·-s 꼴을 원래 단어로, 기능어·아주 흔한 말은 뺌", async () => {
  const bank = await loadBank("en");
  const traits = JSON.parse(readFileSync("src/lib/curriculum/word-traits/en.json", "utf8"));
  const notes = dictNotes("en", "She bought two chairs and painted the kitchen.", bank, irregularForms(traits));
  const got = keys(notes);
  assert.ok(got.includes("w|buy"), got.join(","));
  assert.ok(got.includes("w|chair"), got.join(","));
  assert.ok(got.includes("w|paint"), got.join(","));
  assert.ok(!got.includes("w|the") && !got.includes("w|she") && !got.includes("w|and"));
});

test("한국어: 조사·어미를 떼고 원래 꼴", async () => {
  const bank = await loadBank("ko");
  const got = keys(dictNotes("ko", "어제 영화관에서 친구를 만났어요.", bank));
  assert.ok(got.includes("w|영화관"), got.join(","));
  assert.ok(got.includes("w|친구"), got.join(","));
  assert.ok(got.includes("w|만나다"), got.join(","));
});

test("일본어(띄어쓰기 없음): 잘라서 찾기", async () => {
  const bank = await loadBank("ja");
  const got = keys(dictNotes("ja", "駅で友達に会いました。", bank));
  assert.ok(got.some((one) => one === "w|駅" || one === "w|友達"), got.join(","));
});

test("스페인어: 복수·생략 없이 원래 꼴, 최대 다섯", async () => {
  const bank = await loadBank("es");
  const notes = dictNotes("es", "Compré tres libros y dos camisas en la tienda del centro con mi hermana mayor.", bank);
  assert.ok(notes.length <= MAX_NOTES);
  assert.ok(keys(notes).includes("w|libro"), keys(notes).join(","));
});

test("베트남어: 두 음절 단어를 한 단어로", async () => {
  const bank = await loadBank("vi");
  const got = keys(dictNotes("vi", "Tòa nhà này rất cao.", bank));
  assert.ok(got.includes("w|tòa nhà"), got.join(","));
});

test("규칙 후보: 영어 -ing·-ies, 아랍어 ال", () => {
  assert.ok(baseCandidates("en", "making").includes("make"));
  assert.ok(baseCandidates("en", "cities").includes("city"));
  assert.ok(baseCandidates("ar", "الكتاب").includes("كتاب"));
});

test("한국어 줄어든 꼴: 했어요 → 하다 아님(흔한 말), 봤어 → 보다, 공부했어요 → 공부하다", async () => {
  const bank = await loadBank("ko");
  const got = keys(dictNotes("ko", "도서관에서 공부했어요.", bank));
  assert.ok(got.includes("w|도서관"), got.join(","));
  assert.ok(got.some((one) => one === "w|공부하다" || one === "w|공부"), got.join(","));
});
