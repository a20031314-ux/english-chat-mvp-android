import type { MeaningUnit } from "@/lib/videoSubtitle/groupMeaningUnits";
import type { VideoContext } from "@/lib/videoSubtitle/types";
import type { ConversationContext } from "@/lib/videoSubtitle/sceneTypes";

export function buildConversationContext(input: {
  videoContext: VideoContext;
  units: MeaningUnit[];
}): ConversationContext {
  const recent = input.units
    .slice(0, 4)
    .map((unit) => unit.original)
    .join(" / ")
    .slice(0, 280);
  return {
    topic: input.videoContext.topic || input.videoContext.summary.slice(0, 80),
    situation: input.videoContext.summary.slice(0, 200) || undefined,
    recentMeaning: recent || undefined,
  };
}
