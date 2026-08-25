import type { MeaningUnit } from "@/lib/videoSubtitle/groupMeaningUnits";
import type {
  ConversationContext,
  SceneContext,
} from "@/lib/videoSubtitle/sceneTypes";
import type { VideoContext } from "@/lib/videoSubtitle/types";
import { interfaceLanguageName } from "@/lib/learningLanguages";

/** Instantaneous tone of this utterance (not global speaker style). */
export type UtteranceTone = {
  formality: string;
  politeness: string;
  intimacy: string;
  emotion: string;
  intensity: string;
  confidence: string;
  hesitation: string;
  humor: string;
  sarcasm: string;
  attitude: string;
};

export const NEUTRAL_TONE: UtteranceTone = {
  formality: "neutral",
  politeness: "neutral",
  intimacy: "neutral",
  emotion: "neutral",
  intensity: "medium",
  confidence: "medium",
  hesitation: "none",
  humor: "none",
  sarcasm: "none",
  attitude: "neutral",
};

/**
 * Internal adaptation draft. Screen shows naturalSubtitle only.
 * meaning + tone feed learning analysis later.
 */
export type SubtitleDraft = {
  id: string;
  segmentIds: string[];
  startTime: number;
  endTime: number;
  original: string;
  /** What the speaker meant (internal; not a calque). */
  meaning: string;
  tone: UtteranceTone;
  speakerStyle: string;
  /** On-screen Korean (or locale) caption. */
  naturalSubtitle: string;
  /**
   * Critique-on rendering for sentence analysis only.
   * Screen still shows naturalSubtitle (critique off).
   */
  analysisTranslation?: string;
  interpretationConfidence: number;
  /** @deprecated alias of meaning — kept for older cue fields */
  literalMeaning?: string;
  confidence?: number;
  uncertain?: boolean;
  /** Optional STT voice/event hints — never alone decide emotion. */
  voiceHints?: string[];
};

/** Collapse caption vs analysis lines so we do not show the same Korean twice. */
export function distinctSpokenLine(
  caption: string,
  other?: string,
): string | undefined {
  const primary = caption.replace(/\s+/g, " ").trim();
  const next = (other ?? "").replace(/\s+/g, " ").trim();
  if (!next || next === primary) return undefined;
  return next;
}

export function emptyDraftFromUnit(
  unit: MeaningUnit,
  speakerStyle: string,
): SubtitleDraft {
  return {
    id: unit.id,
    segmentIds: unit.segmentIds,
    startTime: unit.startTime,
    endTime: unit.endTime,
    original: unit.original,
    meaning: unit.original,
    tone: { ...NEUTRAL_TONE },
    speakerStyle,
    naturalSubtitle: "",
    interpretationConfidence: 0.4,
    literalMeaning: unit.original,
    confidence: unit.confidence,
    uncertain: unit.uncertain,
    voiceHints: unit.voiceHints,
  };
}

export function localeTargetName(locale: string): string {
  return interfaceLanguageName(locale);
}

export function contextPayload(context: VideoContext) {
  return {
    videoTopic: context.topic,
    domain: context.domain,
    summary: context.summary,
    speakerStyle: context.speakerStyle,
    terminology: context.terminology,
  };
}

export function scenePayload(scene?: SceneContext) {
  if (!scene) return undefined;
  if (
    !scene.setting &&
    !scene.situation &&
    !scene.interaction &&
    !scene.mood &&
    !(scene.visualCues && scene.visualCues.length)
  ) {
    return undefined;
  }
  return {
    setting: scene.setting,
    situation: scene.situation,
    interaction: scene.interaction,
    mood: scene.mood,
    visualCues: scene.visualCues ?? [],
    confidence: scene.confidence,
  };
}

export function conversationPayload(conversation?: ConversationContext) {
  if (!conversation) return undefined;
  return {
    topic: conversation.topic,
    situation: conversation.situation,
    participants: conversation.participants,
    recentMeaning: conversation.recentMeaning,
  };
}

export function unitPromptItem(
  unit: MeaningUnit,
  scene?: SceneContext,
) {
  return {
    id: unit.id,
    previous: unit.previousTexts,
    current: unit.original,
    next: unit.nextTexts,
    voiceHints: unit.voiceHints ?? [],
    /** Optional visual evidence — not authoritative. */
    sceneContext: scenePayload(scene),
  };
}
