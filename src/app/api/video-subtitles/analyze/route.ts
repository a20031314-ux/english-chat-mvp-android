import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { analyzeAdaptedSubtitle } from "@/lib/videoSubtitle/analyzeAdaptedSubtitle";
import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { asNumber, asRecord, asString } from "@/lib/videoSubtitle/parseModelJson";
import type { SceneContext } from "@/lib/videoSubtitle/sceneTypes";
import type { UtteranceTone } from "@/lib/videoSubtitle/subtitleDraft";
import type { VideoContext, VideoContextTerm } from "@/lib/videoSubtitle/types";

export const runtime = "nodejs";
export const maxDuration = 45;

function asTone(value: unknown): UtteranceTone | undefined {
  const row = asRecord(value);
  if (!row) return undefined;
  return {
    formality: asString(row.formality) || "neutral",
    politeness: asString(row.politeness) || "neutral",
    intimacy: asString(row.intimacy) || "neutral",
    emotion: asString(row.emotion) || "neutral",
    intensity: asString(row.intensity) || "medium",
    confidence: asString(row.confidence) || "medium",
    hesitation: asString(row.hesitation) || "none",
    humor: asString(row.humor) || "none",
    sarcasm: asString(row.sarcasm) || "none",
    attitude: asString(row.attitude) || "neutral",
  };
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

function asContext(value: unknown): VideoContext | undefined {
  const row = asRecord(value);
  if (!row) return undefined;
  return {
    topic: asString(row.topic) || "video",
    domain: asString(row.domain) || "general",
    summary: asString(row.summary) || "",
    speakerStyle: asString(row.speakerStyle) || "spoken",
    terminology: asTerms(row.terminology),
  };
}

function asScene(value: unknown): SceneContext | undefined {
  const row = asRecord(value);
  if (!row) return undefined;
  const id = asString(row.id);
  const startTime = asNumber(row.startTime);
  const endTime = asNumber(row.endTime);
  if (!id || startTime == null || endTime == null) return undefined;
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

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((row) => asString(row))
    .filter((row): row is string => Boolean(row))
    .slice(0, 5);
}

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON" }, { status: 400 });
  }

  const subtitleId = asString(body.subtitleId) || "unknown";
  const original = asString(body.original);
  const naturalSubtitle =
    asString(body.naturalSubtitle) || asString(body.translation);
  if (!original || !naturalSubtitle) {
    return jsonWithCors(request, { error: "INVALID_ANALYSIS" }, { status: 400 });
  }

  try {
    const nativeRaw = asRecord(body.nativeUnderstanding);
    const analysis = await analyzeAdaptedSubtitle({
      subtitleId,
      locale: asString(body.locale) || "ko",
      original,
      naturalSubtitle,
      analysisTranslation: asString(body.analysisTranslation) || undefined,
      meaning: asString(body.meaning) || asString(body.literalMeaning) || undefined,
      tone: asTone(body.tone),
      speakerStyle: asString(body.speakerStyle) || undefined,
      context: asContext(body.context),
      sceneContext: asScene(body.sceneContext),
      previous: asStringList(body.previous),
      next: asStringList(body.next),
      nativeUnderstanding: nativeRaw
        ? {
            understoodMeaning: asString(nativeRaw.understoodMeaning) || undefined,
            intent: asString(nativeRaw.intent) || undefined,
            tone: asString(nativeRaw.tone) || undefined,
            establishedNote: asString(nativeRaw.establishedNote) || undefined,
            references: Array.isArray(nativeRaw.references)
              ? nativeRaw.references.flatMap((row) => {
                  const item = asRecord(row);
                  const expression = asString(item?.expression);
                  const refersTo = asString(item?.refersTo);
                  if (!expression || !refersTo) return [];
                  const evidenceLevel = asString(item?.evidenceLevel);
                  return [
                    {
                      expression,
                      refersTo,
                      ...(evidenceLevel ? { evidenceLevel } : {}),
                    },
                  ];
                })
              : undefined,
          }
        : undefined,
    });
    return jsonWithCors(request, analysis);
  } catch (error) {
    if (error instanceof VideoPipelineError) {
      const status = error.code === "MISSING_OPENAI_KEY" ? 503 : 500;
      return jsonWithCors(request, { error: error.code }, { status });
    }
    console.error("[video-subtitles/analyze]", error);
    return jsonWithCors(request, { error: "ANALYSIS_FAILED" }, { status: 500 });
  }
}
