/**
 * Heuristics to drop non-dialogue STT (BGM markers, hummed lyrics, etc.).
 * Not perfect — sung-over-dialogue and clear vocal tracks can still leak.
 */

const MARKER_ONLY =
  /^\s*[\[(]\s*(music|applause|laughter|silence|inaudible|singing)\b[^\]\)]*[\])]\s*$/i;

const BARE_MUSIC_SYMBOL = /^\s*[♪♫🎵🎶]+\s*$/u;

const MUSIC_WRAPPER =
  /^\s*[♪♫🎵🎶]+\s*.+\s*[♪♫🎵🎶]+\s*$/u;

const LYRIC_META =
  /^\s*(\(?(theme|background|bgm|instrumental|chorus|outro|intro|노래|배경음악|반주)\)?[:\s-]*|lyrics?\s*:)/i;

/** Pure marker / music emoji lines Whisper sometimes emits. */
export function isNonSpeechMarker(text: string): boolean {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) return true;
  if (MARKER_ONLY.test(trimmed)) return true;
  if (BARE_MUSIC_SYMBOL.test(trimmed)) return true;
  if (MUSIC_WRAPPER.test(trimmed)) return true;
  if (LYRIC_META.test(trimmed)) return true;
  // Line is only music symbols / brackets.
  if (/^[♪♫🎵🎶\[\]()\s._\-–—]+$/u.test(trimmed)) return true;
  return false;
}

/**
 * Whisper often “hears” BGM as garbled speech with high no_speech_prob.
 * Keep clear speech; drop low-trust fragments that look like music bleed.
 */
export function looksLikeMusicBleed(input: {
  text: string;
  noSpeechProb?: number;
  confidence?: number;
  uncertain?: boolean;
}): boolean {
  const text = input.text.replace(/\s+/g, " ").trim();
  if (!text || isNonSpeechMarker(text)) return true;

  const noSpeech = input.noSpeechProb ?? 0;
  const confidence = input.confidence;
  const short = text.length <= 24;
  const veryShort = text.length <= 12;

  // Strong no-speech signal → almost never useful dialogue.
  if (noSpeech >= 0.72) return true;
  if (noSpeech >= 0.55 && short) return true;
  if (noSpeech >= 0.45 && veryShort) return true;

  if (
    typeof confidence === "number" &&
    confidence < 0.28 &&
    (short || input.uncertain)
  ) {
    return true;
  }

  // Repeated syllable hums / nonsense often from instrumental beds.
  if (
    /^(la|na|da|ba|oh|ooh|ah|mm+|hmm+|랄+|라+|너너|나나)([-\s]?(la|na|da|ba|oh|ooh|ah|mm+|랄+|라+)){2,}$/i.test(
      text,
    )
  ) {
    return true;
  }

  return false;
}

export function filterSpeechSegments<
  T extends {
    text: string;
    confidence?: number;
    uncertain?: boolean;
    noSpeechProb?: number;
  },
>(segments: T[]): T[] {
  return segments.filter(
    (segment) =>
      !looksLikeMusicBleed({
        text: segment.text,
        noSpeechProb: segment.noSpeechProb,
        confidence: segment.confidence,
        uncertain: segment.uncertain,
      }),
  );
}
