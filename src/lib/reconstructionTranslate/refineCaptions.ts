import { asRecord, asString } from "../videoSubtitle/parseModelJson.ts";
import { parseMeaningExtraction, parseTranslated } from "./parse.ts";
import {
  critiqueTranslationSystem,
  extractMeaningSystem,
  firstInterpretationSystem,
} from "./prompts.ts";
import type {
  JsonCompleter,
  MeaningExtraction,
  TranslationContext,
} from "./types.ts";

export type CaptionRefineItem = {
  id: string;
  sourceText: string;
  caption: string;
  meaning: MeaningExtraction;
};

const BATCH = 6;

/**
 * Step 1 of 2-pass captions: meaning only. Original is allowed here.
 */
export async function extractMeaningsForCaptions(
  ctx: Pick<
    TranslationContext,
    "sourceLang" | "targetLang" | "sourceType" | "videoContext"
  >,
  items: Array<{ id: string; sourceText: string }>,
  completeJson: JsonCompleter,
): Promise<Map<string, MeaningExtraction>> {
  const out = new Map<string, MeaningExtraction>();
  if (items.length === 0) return out;

  const system = `${extractMeaningSystem({
    sourceText: "",
    sourceLang: ctx.sourceLang,
    targetLang: ctx.targetLang,
    sourceType: ctx.sourceType,
    videoContext: ctx.videoContext,
  })}

You extract several utterances. Keep each id.
Return ONLY JSON:
{"items":[{"id":"...","coreMeaning":"...","speakerIntent":"...","formalityLevel":"...","speakerRelationship":"...","keyEntities":[],"speechTexture":{"registerType":"formal_written|casual_spoken|standard","fillers":[],"hasSelfCorrection":false,"repetitionForEmphasis":[],"sentenceRhythm":"run_on|short_choppy|standard"}}]}`;

  for (let i = 0; i < items.length; i += BATCH) {
    const batch = items.slice(i, i + BATCH);
    const raw = await completeJson(
      system,
      JSON.stringify({
        extra: ctx.videoContext ? `Situation / video context: ${ctx.videoContext}` : "",
        items: batch.map((item) => ({
          id: item.id,
          sourceText: item.sourceText,
        })),
      }),
    );
    const row = asRecord(raw);
    const rows = Array.isArray(row?.items) ? row.items : [];
    for (const entry of rows) {
      const rec = asRecord(entry);
      const id = asString(rec?.id);
      if (!id) continue;
      const meaning = parseMeaningExtraction(rec);
      if (meaning) out.set(id, meaning);
    }
  }
  return out;
}

/**
 * 1-pass first reading for the analysis panel. Does not change captions.
 */
export async function firstInterpretationsForAnalysis(
  ctx: Pick<
    TranslationContext,
    "sourceLang" | "targetLang" | "sourceType" | "videoContext"
  >,
  items: Array<{ id: string; sourceText: string }>,
  completeJson: JsonCompleter,
): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  if (items.length === 0) return out;

  const system = `${firstInterpretationSystem({
    sourceText: "",
    sourceLang: ctx.sourceLang,
    targetLang: ctx.targetLang,
    sourceType: ctx.sourceType ?? "subtitle",
    videoContext: ctx.videoContext,
  })}

You read several lines. Keep each id.
Return ONLY JSON:
{"items":[{"id":"...","translated":"..."}]}`;

  for (let i = 0; i < items.length; i += BATCH) {
    const batch = items.slice(i, i + BATCH);
    const raw = await completeJson(
      system,
      JSON.stringify({
        extra: ctx.videoContext
          ? `Situation / video context: ${ctx.videoContext}`
          : "",
        items: batch.map((item) => ({
          id: item.id,
          text: item.sourceText,
        })),
      }),
    );
    const row = asRecord(raw);
    const rows = Array.isArray(row?.items) ? row.items : [];
    for (const entry of rows) {
      const rec = asRecord(entry);
      const id = asString(rec?.id);
      if (!id) continue;
      const translated = parseTranslated(rec);
      if (translated) out.set(id, translated);
    }
  }
  return out;
}

/**
 * Critique-on pass for already-composed captions (2-pass / off).
 * Optional A/B only — production analysis uses firstInterpretationsForAnalysis.
 */
export async function refineCaptionsForAnalysis(
  ctx: Pick<TranslationContext, "sourceLang" | "targetLang">,
  items: CaptionRefineItem[],
  completeJson: JsonCompleter,
): Promise<Map<string, { analysisTranslation: string; changed: boolean }>> {
  const out = new Map<string, { analysisTranslation: string; changed: boolean }>();
  if (items.length === 0) return out;

  const system = `${critiqueTranslationSystem({
    sourceText: "",
    sourceLang: ctx.sourceLang,
    targetLang: ctx.targetLang,
    sourceType: "subtitle",
  })}

The on-screen caption already exists. You write a second rendering for LEARNING analysis only.
Source wording is allowed here so you can restore joke, sarcasm, or force the caption softened.
Do not treat the caption as a mistake. Do not write tutor notes.

You review several captions. Keep each id.
Return ONLY JSON:
{"items":[{"id":"...","translated":"...","changed":false}]}`;

  for (let i = 0; i < items.length; i += BATCH) {
    const batch = items.slice(i, i + BATCH);
    const raw = await completeJson(
      system,
      JSON.stringify({
        items: batch.map((item) => ({
          id: item.id,
          sourceText: item.sourceText,
          draft: item.caption,
          coreMeaning: item.meaning.coreMeaning,
          speakerIntent: item.meaning.speakerIntent,
          formalityLevel: item.meaning.formalityLevel,
          mustKeep: item.meaning.keyEntities,
          speechTexture: item.meaning.speechTexture,
        })),
      }),
    );
    const row = asRecord(raw);
    const rows = Array.isArray(row?.items) ? row.items : [];
    for (const entry of rows) {
      const rec = asRecord(entry);
      const id = asString(rec?.id);
      if (!id) continue;
      const src = batch.find((item) => item.id === id);
      const draft = src?.caption ?? "";
      const translated = asString(rec?.translated) || draft;
      const changed =
        translated.replace(/\s+/g, " ").trim() !==
        draft.replace(/\s+/g, " ").trim();
      out.set(id, { analysisTranslation: translated, changed });
    }
  }
  return out;
}
