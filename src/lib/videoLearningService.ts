import { Capacitor } from "@capacitor/core";
import { entitlementHeaders } from "@/lib/billing/billingService";
import { apiUrl } from "@/lib/apiBase";
import {
  ClientAudioError,
  transcribeYouTubeAudioOnDevice,
} from "@/lib/videoSubtitle/clientVideoAudio";
import type { VideoSubtitle } from "@/lib/videoLearning";
import { groupMeaningUnits } from "@/lib/videoSubtitle/groupMeaningUnits";
import { displaySpineFromSentences } from "@/lib/videoSubtitle/displaySpine";
import { countLetters } from "@/lib/videoSubtitle/sttTokens";
import type {
  NormalizedSegment,
  SttSegment,
  PreparedTranscript,
} from "@/lib/videoSubtitle/types";

export class VideoSubtitleClientError extends Error {
  constructor(public code: string) {
    super(code);
    this.name = "VideoSubtitleClientError";
  }
}

async function readError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { error?: string };
    if (typeof data.error === "string" && data.error) return data.error;
  } catch {
    // ignore
  }
  return response.status === 503 ? "MISSING_OPENAI_KEY" : "STT_FAILED";
}

/** English study cues follow the word-sliced sentence bounds from prepare. */
export function englishCuesFromSegments(
  segments: NormalizedSegment[],
): VideoSubtitle[] {
  return segments.map((segment) => ({
    id: `mu-${segment.id}`,
    startTime: segment.startTime,
    endTime: Math.max(segment.startTime + 0.3, segment.endTime),
    original: segment.normalizedText || segment.rawText,
    translation: "",
    rawOriginal: segment.rawText || segment.normalizedText,
    meaning: segment.normalizedText || segment.rawText,
    literalMeaning: segment.normalizedText || segment.rawText,
    confidence: segment.confidence,
    translationStatus: "english" as const,
  }));
}

function normalizeGloss(text: string): string {
  return text
    .replace(/\s+/g, "")
    .replace(/[.,!?…~"'“”‘’]/g, "")
    .toLowerCase();
}

/**
 * How much reading a gloss carries.
 *
 * This counted Hangul syllables and nothing else, from when the only interface
 * language was Korean: for a learner reading through French or Thai every
 * gloss measured zero, so the rules below that compare a stub gloss against a
 * full one could not fire at all. Letters of any script now, which for Korean
 * is the same number it always was — one syllable is one letter — so what was
 * tuned on Korean keeps its meaning.
 *
 * The thresholds themselves were chosen against Korean glosses and have not
 * been measured anywhere else. A script that writes the same sentence in more
 * letters will reach them sooner; that is worth measuring before trusting the
 * merge to behave identically across the fourteen.
 */
function glossLetters(text: string): number {
  return countLetters(text);
}

function englishWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function mergeCuePair(left: VideoSubtitle, right: VideoSubtitle): VideoSubtitle {
  const leftGloss = glossLetters(left.translation);
  const rightGloss = glossLetters(right.translation);
  const pickRight = rightGloss > leftGloss;
  const translation =
    pickRight ? right.translation : left.translation || right.translation;
  const analysisTranslation = pickRight
    ? right.analysisTranslation || left.analysisTranslation
    : left.analysisTranslation || right.analysisTranslation;
  const original = dedupeCueOriginal(left.original, right.original);
  return {
    ...left,
    original,
    rawOriginal: original,
    endTime: Math.max(left.endTime, right.endTime),
    translation,
    ...(analysisTranslation ? { analysisTranslation } : {}),
    meaning: translation || left.meaning,
    literalMeaning: translation || left.literalMeaning,
    translationStatus: translation.trim()
      ? ("final" as const)
      : left.translationStatus,
  };
}

function dedupeCueOriginal(previous: string, next: string): string {
  const prevWords = previous.split(/\s+/).filter(Boolean);
  const nextWords = next.split(/\s+/).filter(Boolean);
  const max = Math.min(6, prevWords.length, nextWords.length);
  let rest = nextWords;
  for (let count = max; count >= 1; count -= 1) {
    const left = prevWords.slice(-count).join(" ").toLowerCase();
    const right = nextWords.slice(0, count).join(" ").toLowerCase();
    if (left && left === right) {
      rest = nextWords.slice(count);
      break;
    }
  }
  return [...prevWords, ...rest].join(" ").replace(/\s+/g, " ").trim();
}

function mergeCuesWithSameGloss(cues: VideoSubtitle[]): VideoSubtitle[] {
  if (cues.length <= 1) return cues;
  const out: VideoSubtitle[] = [];
  for (const cue of cues) {
    const prev = out[out.length - 1];
    if (prev && shouldJoinStudyCues(prev, cue)) {
      out[out.length - 1] = mergeCuePair(prev, cue);
      continue;
    }
    out.push({ ...cue });
  }
  return out;
}

function shouldJoinStudyCues(left: VideoSubtitle, right: VideoSubtitle): boolean {
  // Lines split back out of one meaning unit share its reading on purpose.
  // Joining them again on that shared text would undo the split.
  const unit = left.segmentIds ?? [];
  if (unit.length > 1 && unit.join("|") === (right.segmentIds ?? []).join("|")) {
    return false;
  }
  const gap = right.startTime - left.endTime;
  if (gap > 1.5) return false;
  const leftEn = englishWordCount(left.original);
  const rightEn = englishWordCount(right.original);
  const leftGloss = glossLetters(left.translation);
  const rightGloss = glossLetters(right.translation);
  const a = normalizeGloss(left.translation);
  const b = normalizeGloss(right.translation);
  if (
    a.length >= 8 &&
    b.length >= 8 &&
    (a === b || a.includes(b) || b.includes(a))
  ) {
    return true;
  }
  const reaction =
    /^(yeah|yes|yep|ok|okay|right|sure|no|nope|wow|oh|hey|hi|hello)[.!?…]*$/i;
  if (reaction.test(left.original.trim()) || reaction.test(right.original.trim())) {
    return false;
  }
  const leftOpen =
    /(?:to|of|for|with|and|or|the|a|an|my|your|our)$/i.test(
      left.original.trim().replace(/[.!?…]+$/g, ""),
    ) ||
    (leftEn <= 5 && !/[.!?…]"?$/.test(left.original.trim()));
  if (leftOpen && rightEn <= 12) return true;
  if (leftEn >= 8 && leftGloss <= Math.max(3, leftEn * 0.45) && rightEn <= 7 && rightGloss >= 10) {
    return true;
  }
  if (rightEn >= 8 && rightGloss <= Math.max(3, rightEn * 0.45) && leftEn <= 7 && leftGloss >= 10) {
    return true;
  }
  return false;
}

function overlapSeconds(
  a: { startTime: number; endTime: number },
  b: { startTime: number; endTime: number },
): number {
  return Math.min(a.endTime, b.endTime) - Math.max(a.startTime, b.startTime);
}

/**
 * Learning-language sentence units + official UI translations by time overlap.
 * Each caption line maps to at most one study cue so the same Korean is not
 * copied onto two English fragments.
 */
export function officialUiCuesFromPrepared(
  prepared: PreparedTranscript,
): VideoSubtitle[] {
  const official =
    prepared.officialUiSegments ||
    prepared.speechSegments ||
    [];
  const base = englishCuesFromSegments(prepared.segments);
  if (official.length === 0) return base;

  const merged = [...base];
  for (const caption of official) {
    const hits: number[] = [];
    for (let i = 0; i < merged.length; i += 1) {
      const cue = merged[i]!;
      const overlap = overlapSeconds(cue, caption);
      if (overlap > 0.08) hits.push(i);
    }
    if (hits.length < 2) continue;
    const consecutive = hits.every((index, offset) =>
      offset === 0 ? true : index === hits[offset - 1]! + 1,
    );
    if (!consecutive) continue;
    const first = hits[0]!;
    const last = hits[hits.length - 1]!;
    const members = merged.slice(first, last + 1);
    merged.splice(first, members.length, {
      ...members[0]!,
      original: members
        .map((row) => row.original)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim(),
      rawOriginal: members[0]!.rawOriginal,
      startTime: members[0]!.startTime,
      endTime: members[members.length - 1]!.endTime,
    });
  }

  const used = new Set<number>();
  const assigned = new Array<string>(merged.length).fill("");
  for (const caption of [...official].sort((a, b) => a.startTime - b.startTime)) {
    let best = -1;
    let bestScore = 0;
    for (let i = 0; i < merged.length; i += 1) {
      if (used.has(i)) continue;
      const cue = merged[i]!;
      const overlap = overlapSeconds(cue, caption);
      if (overlap <= 0.05) continue;
      const capSpan = Math.max(0.2, caption.endTime - caption.startTime);
      const score = overlap / capSpan;
      if (score > bestScore) {
        bestScore = score;
        best = i;
      }
    }
    if (best >= 0 && bestScore >= 0.15) {
      assigned[best] = caption.normalizedText;
      used.add(best);
    }
  }

  return mergeCuesWithSameGloss(
    merged.map((cue, index) => {
      const translation = assigned[index] ?? "";
      if (!translation) return cue;
      return {
        ...cue,
        translation,
        meaning: translation,
        literalMeaning: translation,
        translationStatus: "final" as const,
      };
    }),
  );
}

/**
 * Re-apply merge rules to already-built study lines (e.g. older saved sessions
 * that still have "... our." / "schedule ..." splits).
 */
export function regroupStudyCues(cues: VideoSubtitle[]): VideoSubtitle[] {
  if (cues.length <= 1) return cues;
  const segments: NormalizedSegment[] = cues.map((cue, index) => ({
    id: `cue-${index}`,
    startTime: cue.startTime,
    endTime: cue.endTime,
    rawText: cue.original,
    normalizedText: cue.original,
    confidence: cue.confidence,
  }));
  const byIndex = cues;
  const units = groupMeaningUnits({ currentSegments: segments });
  const regrouped = units.map((unit) => {
    const memberIndexes = unit.segmentIds
      .map((id) => Number(String(id).replace(/^cue-/, "")))
      .filter((index) => Number.isFinite(index) && index >= 0 && index < byIndex.length);
    const members = memberIndexes.map((index) => byIndex[index]!);
    const translations = members
      .map((row) => row.translation.trim())
      .filter(Boolean);
    const sameGloss =
      translations.length > 1 &&
      translations.every(
        (text) => normalizeGloss(text) === normalizeGloss(translations[0]!),
      );
    const translation =
      translations.length <= 1 || sameGloss ? translations[0] ?? "" : "";
    return {
      id: unit.id,
      startTime: unit.startTime,
      endTime: Math.max(unit.startTime + 0.3, unit.endTime),
      original: unit.original,
      translation,
      rawOriginal: unit.original,
      meaning: unit.original,
      literalMeaning: unit.original,
      confidence: unit.confidence ?? members[0]?.confidence,
      translationStatus: translation
        ? ("final" as const)
        : ("english" as const),
    };
  });
  return mergeCuesWithSameGloss(regrouped);
}

export type SubtitleStatusStep =
  | "speech"
  | "context"
  | "translate"
  | "cleanup";

export type SubtitleProgress = {
  percent: number;
  step: SubtitleStatusStep;
  windowIndex?: number;
  windowTotal?: number;
};

/**
 * Extract speech + light context, then return English captions for first watch.
 * Korean interpretation is deferred until the video ends.
 */
function jsonHeaders(isPremium?: boolean, learningLanguage?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  Object.assign(headers, entitlementHeaders(isPremium));
  // Without this the prep gate assumes English, and a library clip in any other
  // language stops looking like one — so it is charged as a custom import.
  if (learningLanguage) headers["x-learning-language"] = learningLanguage;
  return headers;
}

export async function prepareEnglishWatch(
  videoUrl: string,
  options?: {
    locale?: string;
    interfaceLanguage?: string;
    targetLanguage?: string;
    onStatus?: (step: SubtitleStatusStep) => void;
    onProgress?: (progress: SubtitleProgress) => void;
    signal?: AbortSignal;
    isPremium?: boolean;
  },
): Promise<{ prepared: PreparedTranscript; englishCues: VideoSubtitle[] }> {
  const locale = options?.interfaceLanguage ?? options?.locale ?? "ko";
  const targetLanguage = options?.targetLanguage ?? "en";
  const skipServerAudio = Capacitor.isNativePlatform();
  options?.onStatus?.("speech");
  options?.onProgress?.({ percent: 10, step: "speech" });

  const prepareResponse = await fetch(apiUrl("/api/video-subtitles/prepare"), {
    method: "POST",
    headers: jsonHeaders(options?.isPremium, targetLanguage),
    body: JSON.stringify({
      videoUrl,
      locale,
      interfaceLanguage: locale,
      targetLanguage,
      skipServerAudio,
    }),
    signal: options?.signal,
  });
  let prepared: PreparedTranscript;
  let deviceSegments: SttSegment[] | null = null;
  const preparePayload = (await prepareResponse.json().catch(() => ({}))) as {
    error?: string;
    segments?: PreparedTranscript["segments"];
  } & Partial<PreparedTranscript>;
  const prepareError =
    typeof preparePayload.error === "string" && preparePayload.error
      ? preparePayload.error
      : prepareResponse.ok
        ? ""
        : prepareResponse.status === 503
          ? "MISSING_OPENAI_KEY"
          : "STT_FAILED";
  const needsClientAudio =
    skipServerAudio &&
    (!prepareResponse.ok || !preparePayload.segments?.length) &&
    (prepareResponse.status === 409 ||
      prepareError === "CLIENT_AUDIO_REQUIRED" ||
      prepareError === "NO_SPEECH" ||
      prepareError === "NO_AUDIO" ||
      prepareError === "STT_FAILED");

  if (prepareResponse.ok && (preparePayload.segments?.length ?? 0) > 0) {
    prepared = preparePayload as PreparedTranscript;
  } else if (needsClientAudio) {
    options?.onProgress?.({ percent: 16, step: "speech" });
    try {
      const device = await transcribeYouTubeAudioOnDevice(videoUrl, {
        targetLanguage,
        signal: options?.signal,
        onProgress: (percent) =>
          options?.onProgress?.({ percent, step: "speech" }),
      });
      const fromStt = await fetch(apiUrl("/api/video-subtitles/prepare-from-stt"), {
        method: "POST",
        headers: jsonHeaders(options?.isPremium, targetLanguage),
        body: JSON.stringify({
          videoUrl,
          locale,
          interfaceLanguage: locale,
          targetLanguage,
          segments: device.segments,
          sttSource: device.source,
        }),
        signal: options?.signal,
      });
      if (!fromStt.ok) {
        throw new VideoSubtitleClientError(await readError(fromStt));
      }
      prepared = (await fromStt.json()) as PreparedTranscript;
      deviceSegments = device.displayLines;
    } catch (error) {
      if (error instanceof VideoSubtitleClientError) throw error;
      if (error instanceof ClientAudioError) {
        throw new VideoSubtitleClientError(error.code);
      }
      // Reaching here is usually the network dropping, not silence in the
      // video. Reporting it as "no speech" sent people looking at the clip.
      console.error("[video-client-audio] prepare fallback", error);
      throw new VideoSubtitleClientError("PREPARE_FAILED");
    }
  } else if (!prepareResponse.ok) {
    throw new VideoSubtitleClientError(prepareError);
  } else {
    prepared = preparePayload as PreparedTranscript;
  }
  options?.onStatus?.("cleanup");
  options?.onProgress?.({ percent: 100, step: "cleanup" });

  const spine = deviceSegments
    ? displaySpineFromSentences(prepared.segments, deviceSegments)
    : prepared.segments;
  const englishCues =
    prepared.captionMode === "official-ui"
      ? officialUiCuesFromPrepared(prepared)
      : englishCuesFromSegments(spine);
  if (englishCues.length === 0) {
    throw new VideoSubtitleClientError("NO_SPEECH");
  }
  return { prepared, englishCues };
}

export type { NormalizedSegment, PreparedTranscript };
