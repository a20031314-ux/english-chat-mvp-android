import OpenAI from "openai";
import { OPENAI_TEXT_DEFAULTS, SPEECH_DEFAULTS } from "../aiDefaults.ts";

/** Shared OpenAI client. Returns null when the key is unset so callers can degrade. */
export function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export function chatModel(): string {
  return process.env.OPENAI_MODEL ?? OPENAI_TEXT_DEFAULTS.chat;
}

export function transcribeModel(): string {
  return process.env.OPENAI_TRANSCRIBE_MODEL ?? SPEECH_DEFAULTS.videoTranscribe;
}
