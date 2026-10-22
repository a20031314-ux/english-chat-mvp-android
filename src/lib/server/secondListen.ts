import type OpenAI from "openai";
import { toFile } from "openai";
import { isNextGenTranscribe } from "./speechModels.ts";
import { externalSttReady, isExternalStt, transcribeExternal } from "./sttProviders.ts";
import { SPEECH_DEFAULTS } from "../aiDefaults.ts";

/**
 * 두 번째 의견 받아쓰기 — 방 내 줄 교정에서 확신이 어중간한 조각만(2026-10-22, 사용자 결정 (나)).
 *
 * 화면에 뜬 받아쓰기와 다른 모델이어야 의미가 있다. 실제 학습자 영어 발음에 가장 강했던 Scribe v2를 먼저
 * (`hub/drafts/speech-models-2026-10-21.md` — 낱말 오류 17% vs 지금 모델 25%), 키가 없으면 다른 OpenAI 모델.
 * 지시는 화면 받아쓰기와 같다: 들린 그대로, 실수도 그대로.
 */

const LEARNER_PROMPT =
  "A language learner speaking one short turn in a casual conversation. Write exactly what they say, mistakes included: wrong verb forms, missing words, words from another language. Do not correct it. If nobody speaks, or there is only noise, write nothing.";

export function secondModelFor(primary: string): string {
  const preferred = SPEECH_DEFAULTS.secondTranscribe;
  if (primary !== preferred && isExternalStt(preferred) && externalSttReady(preferred)) return preferred;
  return primary === "gpt-transcribe" ? "gpt-4o-mini-transcribe" : "gpt-transcribe";
}

export async function transcribeOnce(
  client: OpenAI,
  model: string,
  input: { bytes: Buffer; mimeType: string; filename: string; languages: string[] },
): Promise<string> {
  if (isExternalStt(model)) {
    const heard = await transcribeExternal(model, { ...input });
    return heard.text;
  }
  const nextGen = isNextGenTranscribe(model);
  const hint = input.languages.filter((code) => code.length === 2);
  const languageHint = nextGen
    ? (hint.length ? { languages: hint } : {})
    : hint.length === 1
      ? { language: hint[0] }
      : {};
  const result = (await client.audio.transcriptions.create({
    model,
    ...(nextGen ? {} : { temperature: 0 }),
    ...languageHint,
    prompt: LEARNER_PROMPT,
    response_format: "json",
    file: await toFile(input.bytes, input.filename, { type: input.mimeType }),
  } as unknown as Parameters<typeof client.audio.transcriptions.create>[0])) as unknown;
  return typeof result === "string" ? result : String((result as { text?: unknown })?.text ?? "");
}
