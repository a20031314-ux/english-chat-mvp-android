import {
  isSubtitleDebugEnabled,
  logSubtitleDebug,
  sceneDebugSlice,
  toneSummary,
} from "@/lib/videoSubtitle/debugSubtitleContext";
import { looksLikeLiteralOrForeignCaption } from "@/lib/videoSubtitle/calqueDetect";
import { expressForKoreanViewer } from "@/lib/videoSubtitle/expressForKoreanViewer";
import { formatSubtitleDrafts } from "@/lib/videoSubtitle/formatSubtitles";
import { groupMeaningUnits } from "@/lib/videoSubtitle/groupMeaningUnits";
import { interpretAsNativeViewer } from "@/lib/videoSubtitle/interpretAsNativeViewer";
import { sceneContextForUnit } from "@/lib/videoSubtitle/getSceneContextAtTime";
import type { SceneContext } from "@/lib/videoSubtitle/sceneTypes";
import { emptyDraftFromUnit, type SubtitleDraft } from "@/lib/videoSubtitle/subtitleDraft";
import type {
  NormalizedSegment,
  SubtitleSegment,
  VideoContext,
} from "@/lib/videoSubtitle/types";
import { updateViewerContext } from "@/lib/videoSubtitle/updateViewerContext";
import { validateAdaptedSubtitles } from "@/lib/videoSubtitle/validateSubtitleMeaning";
import type {
  NativeInterpretation,
  ViewerContext,
} from "@/lib/videoSubtitle/viewerTypes";
import {
  compactViewerContext,
  emptyViewerContext,
} from "@/lib/videoSubtitle/viewerTypes";
import type { MeaningUnit } from "@/lib/videoSubtitle/groupMeaningUnits";

export type MeaningSubtitleResult = {
  cues: SubtitleSegment[];
  viewerContext: ViewerContext;
  interpretations: NativeInterpretation[];
};

function attachInterpretations(
  cues: SubtitleSegment[],
  drafts: SubtitleDraft[],
  units: MeaningUnit[],
  interpretations: NativeInterpretation[],
  viewerContext: ViewerContext,
  sceneContexts?: SceneContext[],
): SubtitleSegment[] {
  const interpByUnit = new Map(
    interpretations.map((row) => [row.unitId, row]),
  );

  return cues.map((cue) => {
    const baseId = cue.id.replace(/-\d+$/, "");
    const draft =
      drafts.find((row) => row.id === cue.id) ??
      drafts.find((row) => row.id === baseId);
    const interp =
      (draft && interpByUnit.get(draft.id)) || interpByUnit.get(baseId);
    const unit = units.find(
      (row) => row.id === draft?.id || row.id === baseId,
    );
    const scene = draft
      ? sceneContextForUnit(sceneContexts, draft.startTime, draft.endTime)
      : undefined;

    if (isSubtitleDebugEnabled() && draft) {
      logSubtitleDebug({
        original: draft.original,
        scene: sceneDebugSlice(scene),
        previous: unit?.previousTexts ?? [],
        next: unit?.nextTexts ?? [],
        meaning: interp?.understoodMeaning || draft.meaning,
        toneSummary: toneSummary(draft.tone),
        finalSubtitle: cue.translation,
      });
      console.error("[native-viewer-debug]", {
        original: draft.original,
        references: interp?.references ?? [],
        understoodMeaning: interp?.understoodMeaning,
        intent: interp?.intent,
        tone: interp?.tone,
        korean: cue.translation,
        viewerSituation: viewerContext.currentSituation,
        entities: viewerContext.entities,
      });
    }

    return {
      ...cue,
      meaning: interp?.understoodMeaning || cue.meaning,
      ...(interp
        ? {
            nativeUnderstanding: {
              understoodMeaning: interp.understoodMeaning,
              references: interp.references,
              intent: interp.intent,
              tone: interp.tone,
              establishedNote: interp.establishedNote,
              confidence: interp.confidence,
            },
          }
        : {}),
      ...(isSubtitleDebugEnabled()
        ? {
            debug: {
              original: draft?.original || cue.original,
              scene: sceneDebugSlice(scene),
              previous: unit?.previousTexts ?? [],
              next: unit?.nextTexts ?? [],
              meaning: interp?.understoodMeaning || draft?.meaning,
              toneSummary: toneSummary(draft?.tone),
              finalSubtitle: cue.translation,
              nativeUnderstanding: interp
                ? {
                    understoodMeaning: interp.understoodMeaning,
                    references: interp.references,
                    intent: interp.intent,
                    tone: interp.tone,
                  }
                : undefined,
            },
          }
        : {}),
    };
  });
}

/**
 * Continuous native-viewer understanding → UI-language expression.
 * ViewerContext accumulates across windows (client passes it back).
 *
 * Order is tuned so caption text is produced before long-term memory update,
 * and optional native validation only runs when references/empties need it.
 */
export async function generateMeaningBasedSubtitle(input: {
  locale: string;
  context: VideoContext;
  currentSegments: NormalizedSegment[];
  previousSegments: NormalizedSegment[];
  nextSegments: NormalizedSegment[];
  sceneContexts?: SceneContext[];
  viewerContext?: ViewerContext;
}): Promise<MeaningSubtitleResult> {
  const seedContext =
    input.viewerContext ??
    emptyViewerContext({
      topic: input.context.topic,
      summary: input.context.summary,
    });

  if (input.currentSegments.length === 0) {
    return {
      cues: [],
      viewerContext: seedContext,
      interpretations: [],
    };
  }

  const units = groupMeaningUnits({
    currentSegments: input.currentSegments,
    previousSegments: input.previousSegments,
    nextSegments: input.nextSegments,
  });

  let viewerContext = compactViewerContext(seedContext);
  // prepare() already sketched context — do not re-enrich every 20s window
  // (that alone was adding an extra model call per window and caused timeouts).
  const context = input.context;

  try {
    // 1) Native viewer interpretation (English understanding only)
    const interpretations = await interpretAsNativeViewer({
      units,
      viewerContext,
      sceneContexts: input.sceneContexts,
    });

    // 2) Express understood meaning in the UI language (use prior-window memory;
    //    same-window refs already live on each interpretation).
    let drafts = await expressForKoreanViewer({
      locale: input.locale,
      speakerStyle: context.speakerStyle,
      units,
      interpretations,
      viewerContext,
      sceneContexts: input.sceneContexts,
    });

    // 3) Anti-calque only when needed.
    //    Korean keeps the Hangul-missing fast path (always-on rewrite is too slow).
    //    Other UI languages catch leftover source words / copied English.
    const needsAdapt = drafts.some((draft) => {
      const text = draft.naturalSubtitle.trim();
      if (!text) return true;
      if (input.locale === "ko" && !/[가-힣]/.test(text)) return true;
      if (
        input.locale !== "ko" &&
        looksLikeLiteralOrForeignCaption(draft.original, text, input.locale)
      ) {
        return true;
      }
      return false;
    });
    if (needsAdapt) {
      drafts = await validateAdaptedSubtitles({
        locale: input.locale,
        context,
        drafts,
      });
    }

    // 4) Long-term memory for the next window (local-first; API when refs appear)
    const hasRefs = interpretations.some(
      (row) => (row.references?.length ?? 0) > 0,
    );
    if (hasRefs) {
      viewerContext = await updateViewerContext({
        viewerContext,
        units,
        interpretations,
      });
    } else {
      viewerContext = {
        ...viewerContext,
        recentEvents: [
          ...viewerContext.recentEvents,
          ...units.map((unit) => unit.original.slice(0, 100)),
        ].slice(-8),
        conversationState:
          interpretations[interpretations.length - 1]?.intent ||
          viewerContext.conversationState,
      };
    }
    const cues = formatSubtitleDrafts(drafts);
    return {
      cues: attachInterpretations(
        cues,
        drafts,
        units,
        interpretations,
        viewerContext,
        input.sceneContexts,
      ),
      viewerContext,
      interpretations,
    };
  } catch (error) {
    console.error("[meaning-subtitle-window]", error);
    // Soft fallback: keep timed draft cues (empty Korean) so later windows can fill in.
    const interpretations: NativeInterpretation[] = units.map((unit) => ({
      unitId: unit.id,
      understoodMeaning: unit.original,
      references: [],
      confidence: 0.3,
    }));
    let drafts: SubtitleDraft[] = units.map((unit) => {
      const base = emptyDraftFromUnit(unit, context.speakerStyle);
      return {
        ...base,
        meaning: unit.original,
        literalMeaning: unit.original,
        naturalSubtitle: "",
      };
    });
    try {
      drafts = await validateAdaptedSubtitles({
        locale: input.locale,
        context,
        drafts,
      });
    } catch (adaptError) {
      console.error("[meaning-subtitle-fallback-adapt]", adaptError);
    }
    viewerContext = {
      ...viewerContext,
      recentEvents: [
        ...viewerContext.recentEvents,
        ...units.map((unit) => unit.original.slice(0, 100)),
      ].slice(-8),
    };
    return {
      cues: attachInterpretations(
        formatSubtitleDrafts(drafts),
        drafts,
        units,
        interpretations,
        viewerContext,
        input.sceneContexts,
      ),
      viewerContext,
      interpretations,
    };
  }
}
