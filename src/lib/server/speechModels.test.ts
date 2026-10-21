import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server.js";

delete process.env.OPENAI_TURN_TRANSCRIBE_MODEL;
delete process.env.TTS_ENGINE;
const { turnTranscribeModel, ttsEngine, wantsTrialReport, isNextGenTranscribe } = await import("./speechModels.ts");
const { realtimeVoice, readAloudInstructions } = await import("./realtimeSpeech.ts");

const ask = (user: string, extra: Record<string, string> = {}) =>
  new NextRequest("https://example.test/api/tts", { headers: { "x-rc-user": user, ...extra } });

test("점검 사용자만 머리글로 모델을 고른다", () => {
  const trial = { "x-stt-model": "gpt-transcribe", "x-tts-engine": "realtime", "x-speech-trial-report": "1" };
  assert.equal(turnTranscribeModel(ask("simcheck-speechx-a", trial)), "gpt-transcribe");
  assert.equal(ttsEngine(ask("simcheck-speechx-a", trial)), "realtime");
  assert.equal(wantsTrialReport(ask("simcheck-speechx-a", trial)), true);
  // 실제 사용자는 같은 머리글을 보내도 기본값
  assert.equal(turnTranscribeModel(ask("real-user-1", trial)), "gpt-4o-mini-transcribe");
  assert.equal(ttsEngine(ask("real-user-1", trial)), "speech");
  assert.equal(wantsTrialReport(ask("real-user-1", trial)), false);
  // 목록 밖 모델 이름은 무시
  assert.equal(turnTranscribeModel(ask("simcheck-speechx-a", { "x-stt-model": "whatever" })), "gpt-4o-mini-transcribe");
});

test("Vercel 값이 기본값을 바꾼다", () => {
  process.env.OPENAI_TURN_TRANSCRIBE_MODEL = "gpt-transcribe";
  process.env.TTS_ENGINE = "realtime";
  assert.equal(turnTranscribeModel(), "gpt-transcribe");
  assert.equal(ttsEngine(), "realtime");
  delete process.env.OPENAI_TURN_TRANSCRIBE_MODEL;
  delete process.env.TTS_ENGINE;
});

test("새 받아쓰기 모델 구분", () => {
  assert.equal(isNextGenTranscribe("gpt-transcribe"), true);
  assert.equal(isNextGenTranscribe("gpt-live-transcribe"), true);
  assert.equal(isNextGenTranscribe("gpt-4o-mini-transcribe"), false);
});

test("Realtime에 없는 목소리는 가까운 목소리로", () => {
  assert.equal(realtimeVoice("marin"), "marin");
  assert.equal(realtimeVoice("nova"), "coral");
  assert.equal(realtimeVoice("onyx"), "ash");
  assert.equal(realtimeVoice("fable"), "ballad");
  assert.match(readAloudInstructions("Speak only in Thai."), /word for word[\s\S]*Speak only in Thai\./);
});
