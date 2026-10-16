import assert from "node:assert/strict";
import test from "node:test";
import {
  glossBatchKey,
  isVideoId,
  keepGlossBatch,
  keepVideoLine,
  readGlossBatch,
  readVideoLine,
  videoLineKey,
} from "./subtitleGlossStore.ts";

// No KV credentials are set here, so these exercise the in-memory fallback.

test("a tapped line is kept per video and language pair", async () => {
  const key = videoLineKey({
    targetLanguage: "ja",
    interfaceLanguage: "ko",
    videoId: "abcdefghijk",
    text: "今日はいい天気ですね。",
  });
  assert.equal(await readVideoLine(key), null);
  await keepVideoLine(key, "오늘 날씨 좋네요.");
  assert.equal(await readVideoLine(key), "오늘 날씨 좋네요.");

  // Same words, another UI language or another video: not the same entry.
  const otherUi = videoLineKey({
    targetLanguage: "ja",
    interfaceLanguage: "en",
    videoId: "abcdefghijk",
    text: "今日はいい天気ですね。",
  });
  const otherVideo = videoLineKey({
    targetLanguage: "ja",
    interfaceLanguage: "ko",
    videoId: "zzzzzzzzzzz",
    text: "今日はいい天気ですね。",
  });
  assert.equal(await readVideoLine(otherUi), null);
  assert.equal(await readVideoLine(otherVideo), null);
});

test("line keys ignore spacing differences, not wording", () => {
  const base = {
    targetLanguage: "es",
    interfaceLanguage: "ar",
    videoId: "abcdefghijk",
  };
  assert.equal(
    videoLineKey({ ...base, text: "¿Qué  tal estás?" }),
    videoLineKey({ ...base, text: " ¿Qué tal estás? " }),
  );
  assert.notEqual(
    videoLineKey({ ...base, text: "¿Qué tal estás?" }),
    videoLineKey({ ...base, text: "¿Qué tal están?" }),
  );
});

test("a batch is found again by its lines, whoever sends it", async () => {
  const lines = ["¿Qué tal estás?", "Muy bien, gracias."];
  const key = glossBatchKey({ targetLanguage: "es", interfaceLanguage: "ko", lines });
  await keepGlossBatch(key, [
    { interpretation: "잘 지내?" },
    { interpretation: "잘 지내, 고마워.", analysisTranslation: "아주 좋아, 고마워." },
  ]);
  const again = glossBatchKey({ targetLanguage: "es", interfaceLanguage: "ko", lines: [...lines] });
  assert.deepEqual(await readGlossBatch(again), [
    { interpretation: "잘 지내?" },
    { interpretation: "잘 지내, 고마워.", analysisTranslation: "아주 좋아, 고마워." },
  ]);
});

test("a batch with a missing line is not kept", async () => {
  const key = glossBatchKey({
    targetLanguage: "th",
    interfaceLanguage: "ko",
    lines: ["สวัสดีครับ", "ไปไหนมา"],
  });
  await keepGlossBatch(key, [{ interpretation: "안녕하세요" }, { interpretation: "" }]);
  assert.equal(await readGlossBatch(key), null);
});

test("only YouTube-shaped ids are accepted", () => {
  assert.equal(isVideoId("abcdefghijk"), true);
  assert.equal(isVideoId("a-b_c123XYZ"), true);
  assert.equal(isVideoId("short"), false);
  assert.equal(isVideoId("abcdefghijk:extra"), false);
  assert.equal(isVideoId(42), false);
});
