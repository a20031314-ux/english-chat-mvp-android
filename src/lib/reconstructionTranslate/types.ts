export type ReconstructionSourceType =
  | "subtitle"
  | "conversation"
  | "web"
  | "formal"
  | "unknown";

export type TranslationContext = {
  sourceText: string;
  sourceLang: string;
  targetLang: string;
  sourceType?: ReconstructionSourceType;
  videoContext?: string;
  speakerRelationship?: string;
  previousLines?: string[];
  nextLines?: string[];
};

export type SpeechTexture = {
  /** formal_written | casual_spoken | standard */
  registerType: string;
  /** Source hedges/fillers to keep as spoken devices, not source words. */
  fillers: string[];
  hasSelfCorrection: boolean;
  repetitionForEmphasis: string[];
  /** run_on | short_choppy | standard */
  sentenceRhythm: string;
};

export const DEFAULT_SPEECH_TEXTURE: SpeechTexture = {
  registerType: "standard",
  fillers: [],
  hasSelfCorrection: false,
  repetitionForEmphasis: [],
  sentenceRhythm: "standard",
};

export type MeaningExtraction = {
  coreMeaning: string;
  speakerIntent: string;
  formalityLevel: string;
  speakerRelationship: string;
  keyEntities: string[];
  speechTexture: SpeechTexture;
};

export type ReconstructionTranslateResult = {
  meaning: MeaningExtraction;
  /** Final line: 2-pass, or 3-pass if critique ran. */
  translated: string;
  /** 2-pass draft when critique ran. */
  draft?: string;
  critiqueChanged?: boolean;
};

export type ReconstructOptions = {
  /** Extra LLM pass. Off by default (cost). */
  enableCritique?: boolean;
};

export type TranslationCompareRow = {
  sourceText: string;
  onePass: string;
  reconstructed: string;
  critiqued?: string;
  critiqueChanged?: boolean;
  meaning: MeaningExtraction;
};

export type JsonCompleter = (
  system: string,
  user: string,
) => Promise<unknown>;
