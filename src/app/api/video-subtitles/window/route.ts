import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { meterRequest } from "@/lib/server/meterRequest";
import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { asNumber, asRecord, asString } from "@/lib/videoSubtitle/parseModelJson";
import { translateSubtitleWindow } from "@/lib/videoSubtitle/pipeline";
import type { SceneContext } from "@/lib/videoSubtitle/sceneTypes";
import type {
  NormalizedSegment,
  VideoContext,
  VideoContextTerm,
} from "@/lib/videoSubtitle/types";
import {
  emptyViewerContext,
  type ViewerContext,
  type ViewerEntity,
  type EvidenceLevel,
} from "@/lib/videoSubtitle/viewerTypes";

export const runtime = "nodejs";
/** Native-viewer path uses several model calls; keep headroom for dense windows. */
export const maxDuration = 180;

function asSegment(value: unknown): NormalizedSegment | null {
  const row = asRecord(value);
  if (!row) return null;
  const id = asString(row.id);
  const normalizedText = asString(row.normalizedText);
  const startTime = asNumber(row.startTime);
  const endTime = asNumber(row.endTime);
  if (!id || !normalizedText || startTime == null || endTime == null) return null;
  return {
    id,
    startTime,
    endTime,
    rawText: asString(row.rawText) || normalizedText,
    normalizedText,
    confidence: asNumber(row.confidence) ?? undefined,
    uncertain: row.uncertain === true,
  };
}

function asSegments(value: unknown): NormalizedSegment[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(asSegment)
    .filter((row): row is NormalizedSegment => row !== null)
    .slice(0, 120);
}

function asTerms(value: unknown): VideoContextTerm[] {
  if (!Array.isArray(value)) return [];
  const terms: VideoContextTerm[] = [];
  for (const item of value) {
    const row = asRecord(item);
    const term = asString(row?.term);
    if (!term) continue;
    terms.push({
      term,
      meaning: asString(row?.meaning) ?? undefined,
      preferredTranslation: asString(row?.preferredTranslation) ?? undefined,
    });
  }
  return terms.slice(0, 40);
}

function asContext(value: unknown): VideoContext | null {
  const row = asRecord(value);
  if (!row) return null;
  return {
    topic: asString(row.topic) || "video",
    domain: asString(row.domain) || "general",
    summary: asString(row.summary) || "",
    speakerStyle: asString(row.speakerStyle) || "spoken",
    terminology: asTerms(row.terminology),
  };
}

function asScene(value: unknown): SceneContext | null {
  const row = asRecord(value);
  if (!row) return null;
  const id = asString(row.id);
  const startTime = asNumber(row.startTime);
  const endTime = asNumber(row.endTime);
  if (!id || startTime == null || endTime == null) return null;
  const visualCues = Array.isArray(row.visualCues)
    ? row.visualCues
        .map((cue) => asString(cue))
        .filter((cue): cue is string => Boolean(cue))
        .slice(0, 8)
    : undefined;
  return {
    id,
    startTime,
    endTime,
    setting: asString(row.setting) || undefined,
    situation: asString(row.situation) || undefined,
    interaction: asString(row.interaction) || undefined,
    mood: asString(row.mood) || undefined,
    ...(visualCues?.length ? { visualCues } : {}),
    confidence: asNumber(row.confidence) ?? undefined,
  };
}

function asScenes(value: unknown): SceneContext[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const scenes = value
    .map(asScene)
    .filter((row): row is SceneContext => row !== null)
    .slice(0, 40);
  return scenes.length ? scenes : undefined;
}

function asEvidence(value: unknown): EvidenceLevel {
  const raw = asString(value) || "";
  if (
    raw === "explicit" ||
    raw === "established" ||
    raw === "strongly_implied" ||
    raw === "speculative"
  ) {
    return raw;
  }
  return "established";
}

function asViewerContext(
  value: unknown,
  fallback: VideoContext,
): ViewerContext {
  const row = asRecord(value);
  if (!row) {
    return emptyViewerContext({
      topic: fallback.topic,
      summary: fallback.summary,
    });
  }
  const characters = Array.isArray(row.characters)
    ? row.characters
        .map((entry) => {
          const item = asRecord(entry);
          const label = asString(item?.label);
          if (!label) return null;
          const notes = Array.isArray(item?.notes)
            ? item.notes
                .map((note) => asString(note))
                .filter((note): note is string => Boolean(note))
            : [];
          return { label, notes: notes.slice(0, 4) };
        })
        .filter((entry): entry is { label: string; notes: string[] } => entry !== null)
        .slice(0, 8)
    : [];
  const entities: ViewerEntity[] = Array.isArray(row.entities)
    ? row.entities
        .flatMap((entry): ViewerEntity[] => {
          const item = asRecord(entry);
          const name = asString(item?.name);
          const description = asString(item?.description);
          if (!name || !description) return [];
          const relatedTo = asString(item?.relatedTo);
          return [
            {
              name,
              description,
              ...(relatedTo ? { relatedTo } : {}),
              evidenceLevel: asEvidence(item?.evidenceLevel),
            },
          ];
        })
        .slice(0, 10)
    : [];
  const list = (key: string, max: number) =>
    Array.isArray(row[key])
      ? row[key]
          .map((entry) => asString(entry))
          .filter((entry): entry is string => Boolean(entry))
          .slice(0, max)
      : [];

  return {
    storySoFar: asString(row.storySoFar) || fallback.summary.slice(0, 400),
    currentSituation: asString(row.currentSituation) || "",
    characters,
    entities,
    establishedFacts: list("establishedFacts", 12),
    ongoingTopics: list("ongoingTopics", 6),
    conversationState: asString(row.conversationState) || "",
    recentEvents: list("recentEvents", 8),
  };
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  void meterRequest(request, "videoWindow");
  let body: {
    locale?: unknown;
    context?: unknown;
    currentSegments?: unknown;
    previousSegments?: unknown;
    nextSegments?: unknown;
    sceneContexts?: unknown;
    viewerContext?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const context = asContext(body.context);
  const currentSegments = asSegments(body.currentSegments);
  if (!context || currentSegments.length === 0) {
    return jsonWithCors(request, { error: "INVALID_WINDOW" }, { status: 400 });
  }

  const locale = asString(body.locale) || "ko";
  const viewerContext = asViewerContext(body.viewerContext, context);

  try {
    const result = await translateSubtitleWindow({
      locale,
      context,
      currentSegments,
      previousSegments: asSegments(body.previousSegments),
      nextSegments: asSegments(body.nextSegments),
      sceneContexts: asScenes(body.sceneContexts),
      viewerContext,
    });
    return jsonWithCors(request, {
      cues: result.cues,
      viewerContext: result.viewerContext,
    });
  } catch (error) {
    if (error instanceof VideoPipelineError) {
      const status = error.code === "MISSING_OPENAI_KEY" ? 503 : 500;
      return jsonWithCors(request, { error: error.code }, { status });
    }
    console.error("[video-subtitles/window]", error);
    return jsonWithCors(
      request,
      { error: "TRANSLATION_FAILED" },
      { status: 500 },
    );
  }
}
