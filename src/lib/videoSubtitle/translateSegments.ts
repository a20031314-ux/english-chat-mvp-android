import { generateMeaningBasedSubtitle } from "@/lib/videoSubtitle/generateMeaningBasedSubtitle";
import type {
  NormalizedSegment,
  SubtitleSegment,
  TranslateWindowInput,
  TranslateWindowResult,
} from "@/lib/videoSubtitle/types";
import { emptyViewerContext } from "@/lib/videoSubtitle/viewerTypes";

/**
 * STT window → native viewer interpret → Korean express → cues + updated memory.
 */
export async function translateSubtitleWindowPipeline(
  input: TranslateWindowInput,
): Promise<TranslateWindowResult> {
  const result = await generateMeaningBasedSubtitle(input);
  return {
    cues: result.cues,
    viewerContext:
      result.viewerContext ??
      input.viewerContext ??
      emptyViewerContext({
        topic: input.context.topic,
        summary: input.context.summary,
      }),
  };
}

/** @deprecated Prefer translateSubtitleWindowPipeline */
export async function translateSegments(
  input: TranslateWindowInput,
): Promise<Map<string, string>> {
  const { cues } = await translateSubtitleWindowPipeline(input);
  const map = new Map<string, string>();
  for (const cue of cues) {
    const existing = map.get(cue.id);
    map.set(
      cue.id,
      existing ? `${existing} ${cue.translation}`.trim() : cue.translation,
    );
  }
  return map;
}

export function retryMissingTranslations(
  segments: NormalizedSegment[],
  translations: Map<string, string>,
): NormalizedSegment[] {
  return segments.filter((segment) => !translations.get(segment.id));
}

export type { SubtitleSegment };
