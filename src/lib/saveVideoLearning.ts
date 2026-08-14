import {
  isVideoSubtitleSaved,
  loadVideoLearningSaves,
  persistVideoLearningSaves,
  type VideoLearningSave,
} from "@/lib/videoLearning";
import {
  loadLearningCards,
  persistLearningCards,
  type LearningCard,
} from "@/lib/learningCards";

export function saveVideoLearningItem(input: {
  original: string;
  translation: string;
  explanation: string;
  videoUrl: string;
  timestamp: number;
}): { save: VideoLearningSave; alreadySaved: boolean } {
  const existing = loadVideoLearningSaves();
  if (
    isVideoSubtitleSaved(existing, {
      videoUrl: input.videoUrl,
      original: input.original,
      timestamp: input.timestamp,
    })
  ) {
    const found = existing.find(
      (item) =>
        item.videoUrl === input.videoUrl &&
        item.original === input.original &&
        Math.floor(item.timestamp) === Math.floor(input.timestamp),
    );
    return { save: found ?? existing[0]!, alreadySaved: true };
  }

  const createdAt = Date.now();
  const save: VideoLearningSave = {
    id: `video-${createdAt}`,
    sourceType: "video",
    original: input.original,
    translation: input.translation,
    explanation: input.explanation,
    videoUrl: input.videoUrl,
    timestamp: input.timestamp,
    createdAt,
  };
  persistVideoLearningSaves([save, ...existing].slice(0, 200));

  const card: LearningCard = {
    id: createdAt,
    original: input.original,
    corrected: input.original,
    explanation: input.explanation || input.translation,
    natural: input.translation,
    createdAt,
    savedAt: createdAt,
    status: "new",
    reviewCount: 0,
    lastReviewedAt: null,
  };
  const cards = loadLearningCards();
  persistLearningCards([card, ...cards]);

  return { save, alreadySaved: false };
}
