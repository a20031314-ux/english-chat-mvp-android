import type { NextRequest } from "next/server";
import { SIM_USER_MARK } from "./simData.ts";

/**
 * 음성 모델(받아쓰기·읽어 주기)을 한곳에서 고른다.
 *
 * OpenAI가 지금 쓰는 음성 모델을 모두 끝낸다(공식 종료 표, 2026-10-21 확인):
 * - gpt-4o-mini-tts·tts-1 → 2027-01-06, 대체는 Realtime API의 gpt-realtime-2.1-mini(같은 /v1/audio/speech로는 안 됨)
 * - gpt-4o-mini-transcribe·gpt-4o-transcribe·whisper-1 → 2027-02-26, 대체는 gpt-transcribe(파일)·gpt-live-transcribe(실시간)
 * 기본값은 아직 예전 모델 — 운영 비교(`scripts/speech-trial.mjs`)가 끝나면 여기서 바꾼다. Vercel 값이 있으면 그것이 먼저.
 *
 * 점검 사용자(x-rc-user: simcheck-…)만 머리글로 다른 모델을 골라 볼 수 있다 — 실제 사용자는 언제나 기본값.
 */

/** 점검에서 골라 볼 수 있는 받아쓰기 모델. 목록 밖의 이름은 무시한다. */
export const TRANSCRIBE_TRIAL_MODELS = ["gpt-4o-mini-transcribe", "gpt-4o-transcribe", "gpt-transcribe", "scribe_v2", "assemblyai-sync"] as const;
/** 읽어 주기 방식: speech = /v1/audio/speech(gpt-4o-mini-tts), realtime = Realtime API로 그대로 읽게. */
export const TTS_ENGINES = ["speech", "realtime"] as const;
export type TtsEngine = (typeof TTS_ENGINES)[number];

function trialHeader(request: NextRequest | undefined, name: string): string {
  if (!request) return "";
  const value = request.headers.get(name)?.trim() ?? "";
  if (!value) return "";
  // requestUserId와 같은 판단(로그인 토큰이 있으면 그 계정 — 점검 사용자가 아님), 의존을 줄이려고 머리글을 직접 본다.
  const simUser = !request.headers.get("x-auth-token") && (request.headers.get("x-rc-user") ?? "").startsWith(SIM_USER_MARK);
  return simUser ? value : "";
}

/** 점검이 결과 자세히(시간·확신도·원문)를 달라고 했나. */
export function wantsTrialReport(request: NextRequest): boolean {
  return trialHeader(request, "x-speech-trial-report") === "1";
}

/** 통화 학습·Room 자막의 한 마디 받아쓰기. */
export function turnTranscribeModel(request?: NextRequest): string {
  const trial = trialHeader(request, "x-stt-model");
  if ((TRANSCRIBE_TRIAL_MODELS as readonly string[]).includes(trial)) return trial;
  return process.env.OPENAI_TURN_TRANSCRIBE_MODEL?.trim() || "gpt-4o-mini-transcribe";
}

/**
 * gpt-transcribe 계열은 묻는 법이 다르다: `language` 대신 `languages`(배열), temperature·logprobs는 문서에 없음.
 * 대답에 알아들은 언어(`languages`)가 같이 온다.
 */
export function isNextGenTranscribe(model: string): boolean {
  return /^gpt-(live-)?transcribe/.test(model);
}

export function ttsEngine(request?: NextRequest): TtsEngine {
  const trial = trialHeader(request, "x-tts-engine");
  if ((TTS_ENGINES as readonly string[]).includes(trial)) return trial as TtsEngine;
  const set = process.env.TTS_ENGINE?.trim();
  return set === "realtime" ? "realtime" : "speech";
}

export function speechTtsModel(): string {
  return process.env.OPENAI_TTS_MODEL?.trim() || "gpt-4o-mini-tts";
}

export function realtimeTtsModel(): string {
  return process.env.OPENAI_REALTIME_TTS_MODEL?.trim() || "gpt-realtime-2.1-mini";
}
