/**
 * Voices gpt-4o-mini-tts accepts, from OpenAI's text-to-speech guide.
 *
 * One list for the scenes that are recorded with them, the builder that records
 * them, and /api/tts, which speaks a generated line in the same voice so that a
 * scene does not change person the moment a line was not written in advance.
 */
export const TTS_VOICES = [
  "alloy", "ash", "ballad", "coral", "echo", "fable",
  "nova", "onyx", "sage", "shimmer", "verse", "marin", "cedar",
] as const;

export type TtsVoice = (typeof TTS_VOICES)[number];

export function isTtsVoice(value: unknown): value is TtsVoice {
  return typeof value === "string" && (TTS_VOICES as readonly string[]).includes(value);
}
