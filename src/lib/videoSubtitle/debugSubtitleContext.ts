import type { SceneContext } from "@/lib/videoSubtitle/sceneTypes";
import type { UtteranceTone } from "@/lib/videoSubtitle/subtitleDraft";

/** Dev-only payload so we can tell STT vs scene vs adapt failures apart. */
export type SubtitleDebugContext = {
  original: string;
  scene?: {
    setting?: string;
    situation?: string;
    interaction?: string;
    mood?: string;
    visualCues?: string[];
    confidence?: number;
    startTime: number;
    endTime: number;
  };
  previous: string[];
  next: string[];
  meaning?: string;
  toneSummary?: string;
  finalSubtitle: string;
};

export function isSubtitleDebugEnabled(): boolean {
  return process.env.NODE_ENV === "development";
}

export function sceneDebugSlice(scene?: SceneContext) {
  if (!scene) return undefined;
  return {
    setting: scene.setting,
    situation: scene.situation,
    interaction: scene.interaction,
    mood: scene.mood,
    visualCues: scene.visualCues,
    confidence: scene.confidence,
    startTime: scene.startTime,
    endTime: scene.endTime,
  };
}

export function toneSummary(tone?: UtteranceTone): string | undefined {
  if (!tone) return undefined;
  return [
    tone.emotion,
    tone.attitude,
    tone.intensity,
    tone.humor !== "none" ? tone.humor : "",
    tone.sarcasm !== "none" ? tone.sarcasm : "",
  ]
    .filter(Boolean)
    .join(" / ");
}

/** Highlight scene-dependent chants like "Speech! Speech!" in server logs. */
export function looksSceneDependent(original: string): boolean {
  const t = original.trim();
  if (t.length < 2) return false;
  if (/^(speech[!.,\s]*)+$/i.test(t)) return true;
  if (
    /^(come on|there you go|that'?s it|look at that|seriously|what the hell|you'?ve got to be kidding me)[!?.]*$/i.test(
      t,
    )
  ) {
    return true;
  }
  // Very short / deictic lines often need visuals
  const words = t.split(/\s+/).filter(Boolean);
  return words.length <= 3 && /[!?]/.test(t);
}

export function logSubtitleDebug(debug: SubtitleDebugContext): void {
  if (!isSubtitleDebugEnabled()) return;
  const mark = looksSceneDependent(debug.original) ? "★ scene-dependent" : "";
  console.error("[subtitle-debug]", mark, {
    original: debug.original,
    scene: debug.scene ?? null,
    previous: debug.previous,
    next: debug.next,
    meaning: debug.meaning,
    tone: debug.toneSummary,
    final: debug.finalSubtitle,
  });
}
