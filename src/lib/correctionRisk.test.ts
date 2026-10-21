import assert from "node:assert/strict";
import test from "node:test";
import { correctionRisk, keptShare } from "./correctionRisk.ts";
import { CORRECTION_VIEW_KEY, DEFAULT_CORRECTION_VIEW, readCorrectionView, writeCorrectionView } from "./correctionView.ts";

const risky = (original: string, corrected: string, target: string, explanation?: string) =>
  correctionRisk({ original, corrected, target, explanation }).risky;

test("실수 하나짜리 짧은 영어 줄은 확인하지 않는다", () => {
  assert.equal(risky("She don't like spicy food.", "She doesn't like spicy food.", "en", "does not"), false);
  assert.equal(risky("I went to there last weekend.", "I went there last weekend.", "en", "to 빼기"), false);
});

test("많이 틀린 긴 줄은 확인한다(영어도)", () => {
  assert.equal(
    risky(
      "I am not understand what teacher say in the class, it was very fast",
      "I didn't understand what the teacher said in class; it was very fast.",
      "en",
      "시제",
    ),
    true,
  );
});

test("한국어: 윗사람께 반말, 불규칙 틀린 꼴이 남은 고침, 긴 줄", () => {
  assert.equal(risky("선생님, 내일 시간 있어?", "선생님, 내일 시간 있어요?", "ko", "요"), true);
  assert.equal(risky("이 음식이 너무 맵어요.", "이 음식이 너무 맵아요.", "ko", "x"), true);
  assert.equal(
    risky("선생님 숙제 내일 내다 괜찮아? 나 바쁘다 오늘", "선생님, 숙제를 내일 내도 괜찮으세요? 나 오늘 바빠요.", "ko", "x"),
    true,
  );
  assert.equal(risky("저는 커피을 마셔요.", "저는 커피를 마셔요.", "ko", "를"), false);
});

test("고친 게 없으면(부호만) 위험 아님, 설명이 비면 위험", () => {
  assert.equal(risky("hello", "Hello.", "en", ""), false);
  assert.equal(risky("저는 사과을 좋아해요.", "저는 사과를 좋아해요.", "ko", ""), true);
});

test("띄어쓰기 없는 언어는 두 글자씩 비교", () => {
  assert.ok(keptShare("私は学生です", "私は学生です", "ja") === 1);
  assert.ok(keptShare("我昨天去商店买东西", "我昨天去商店买了东西", "zh") > 0.6);
  assert.equal(risky("ฉันไปตลาดเมื่อวาน", "เมื่อวานฉันไปตลาดมาครับ", "th", "x"), false);
});

test("고친 문장 보기: 기본은 눌러서, 기억하고 되읽기", () => {
  const store = new Map<string, string>();
  const fake = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
  };
  const saved = (globalThis as { localStorage?: unknown }).localStorage;
  (globalThis as { localStorage?: unknown }).localStorage = fake;
  try {
    assert.equal(DEFAULT_CORRECTION_VIEW, "tap");
    assert.equal(readCorrectionView(), "tap");
    writeCorrectionView("auto");
    assert.equal(store.get(CORRECTION_VIEW_KEY), "auto");
    assert.equal(readCorrectionView(), "auto");
    store.set(CORRECTION_VIEW_KEY, "weird");
    assert.equal(readCorrectionView(), "tap");
  } finally {
    (globalThis as { localStorage?: unknown }).localStorage = saved;
  }
});
