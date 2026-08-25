import { asRecord, asString } from "../videoSubtitle/parseModelJson.ts";
import {
  DEFAULT_SPEECH_TEXTURE,
  type MeaningExtraction,
  type SpeechTexture,
} from "./types.ts";

function asStringList(value: unknown, max = 12): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, max);
}

function parseSpeechTexture(raw: unknown): SpeechTexture {
  const row = asRecord(raw);
  if (!row) return { ...DEFAULT_SPEECH_TEXTURE };
  const registerType = asString(row.registerType) || DEFAULT_SPEECH_TEXTURE.registerType;
  const sentenceRhythm =
    asString(row.sentenceRhythm) || DEFAULT_SPEECH_TEXTURE.sentenceRhythm;
  return {
    registerType,
    fillers: asStringList(row.fillers),
    hasSelfCorrection: row.hasSelfCorrection === true,
    repetitionForEmphasis: asStringList(row.repetitionForEmphasis, 8),
    sentenceRhythm,
  };
}

export function parseMeaningExtraction(raw: unknown): MeaningExtraction | null {
  const row = asRecord(raw);
  if (!row) return null;
  const coreMeaning = asString(row.coreMeaning);
  if (!coreMeaning) return null;
  const keyEntities = asStringList(row.keyEntities);
  return {
    coreMeaning,
    speakerIntent: asString(row.speakerIntent) || "other",
    formalityLevel: asString(row.formalityLevel) || "casual",
    speakerRelationship: asString(row.speakerRelationship) || "unknown",
    keyEntities,
    speechTexture: parseSpeechTexture(row.speechTexture),
  };
}

export function parseTranslated(raw: unknown): string | null {
  const row = asRecord(raw);
  if (!row) return asString(raw);
  return (
    asString(row.translated) ||
    asString(row.naturalSubtitle) ||
    asString(row.interpretation)
  );
}

export function parseCritique(
  raw: unknown,
  draft: string,
): { translated: string; changed: boolean } {
  const translated = parseTranslated(raw) || draft;
  const changed =
    translated.replace(/\s+/g, " ").trim() !== draft.replace(/\s+/g, " ").trim();
  return { translated, changed };
}
