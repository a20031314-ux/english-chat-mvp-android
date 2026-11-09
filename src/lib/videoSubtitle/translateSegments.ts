import { generateMeaningBasedSubtitle } from "@/lib/videoSubtitle/generateMeaningBasedSubtitle";
import type { SubtitleSegment, TranslateWindowInput, TranslateWindowResult } from "@/lib/videoSubtitle/types";
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

export type { SubtitleSegment };
