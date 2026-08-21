import type { LearningLanguageCode } from "../learningLanguages";

/** Korean + English, with English/Korean fallback for other UI locales. */
export type LocalizedText = string | { ko?: string; en?: string };

export type CharacterExample = {
  text: string;
  reading?: string;
  meaning?: LocalizedText;
  /** Spoken form for TTS when different from `text`. */
  speak?: string;
};

export type CharacterForms = {
  isolated?: string;
  initial?: string;
  medial?: string;
  final?: string;
};

export type CharacterItem = {
  id: string;
  character: string;
  /** Isolated spoken form for TTS (defaults to `character`). */
  speak?: string;
  reading?: string;
  pronunciation?: string;
  category: string;
  tone?: number;
  meaning?: LocalizedText;
  usage?: LocalizedText;
  forms?: CharacterForms;
  examples?: CharacterExample[];
};

export type CharacterCategory = {
  id: string;
  label: LocalizedText;
};

export type CharacterNote = {
  title: LocalizedText;
  body: LocalizedText;
};

export type CharacterGuide = {
  language: LearningLanguageCode;
  categories: CharacterCategory[];
  notes?: CharacterNote[];
  items: CharacterItem[];
};
