import {
  isLearningLanguageCode,
  learningLanguageScript,
  type LearningLanguageCode,
} from "../learningLanguages";
import { AR_GUIDE } from "./ar";
import { JA_GUIDE } from "./ja";
import { KO_GUIDE } from "./ko";
import { RU_GUIDE } from "./ru";
import type { CharacterGuide, CharacterItem } from "./types";
import { ZH_GUIDE } from "./zh";

const GUIDES: Partial<Record<LearningLanguageCode, CharacterGuide>> = {
  ja: JA_GUIDE,
  zh: ZH_GUIDE,
  ko: KO_GUIDE,
  ru: RU_GUIDE,
  ar: AR_GUIDE,
};

export function getCharacterGuide(
  language: LearningLanguageCode | string,
): CharacterGuide | null {
  if (!isLearningLanguageCode(language)) return null;
  return GUIDES[language] ?? null;
}

/**
 * Show the alphabet tab only when the learning language uses a script
 * the UI language does not already use — and only if we have a pack.
 */
export function shouldShowCharacterGuide(
  targetLanguage: LearningLanguageCode | string,
  interfaceLocale: string,
): boolean {
  const guide = getCharacterGuide(targetLanguage);
  if (!guide) return false;
  const targetScript = learningLanguageScript(targetLanguage);
  if (targetScript === "latin") return false;
  const uiScript = isLearningLanguageCode(interfaceLocale)
    ? learningLanguageScript(interfaceLocale)
    : learningLanguageScript("en");
  return targetScript !== uiScript;
}

function itemMatches(item: CharacterItem, raw: string): boolean {
  const needle = raw.trim();
  if (!needle) return false;
  if (item.character === needle) return true;
  if (item.reading && item.reading === needle) return true;
  if (item.speak && item.speak === needle) return true;
  const forms = item.forms;
  if (forms) {
    return (
      forms.isolated === needle ||
      forms.initial === needle ||
      forms.medial === needle ||
      forms.final === needle
    );
  }
  if (item.character.toLowerCase() === needle.toLowerCase()) return true;
  return false;
}

/** Look up one written unit. Ready for analysis/vocab inner-character links. */
export function findCharacterItem(
  language: LearningLanguageCode | string,
  character: string,
): CharacterItem | null {
  const guide = getCharacterGuide(language);
  if (!guide) return null;
  const needle = character.trim();
  if (!needle) return null;
  return guide.items.find((item) => itemMatches(item, needle)) ?? null;
}

/**
 * Collect known characters inside a word/span.
 * Analysis and vocab sheets can call this later to link 学习 → 学, 习
 * without changing the tokenizer.
 */
export function findCharactersInText(
  language: LearningLanguageCode | string,
  text: string,
): CharacterItem[] {
  const guide = getCharacterGuide(language);
  if (!guide || !text) return [];
  const seen = new Set<string>();
  const out: CharacterItem[] = [];
  for (const ch of Array.from(text)) {
    const hit = findCharacterItem(language, ch);
    if (hit && !seen.has(hit.id)) {
      seen.add(hit.id);
      out.push(hit);
    }
  }
  return out;
}

export type {
  CharacterCategory,
  CharacterExample,
  CharacterGuide,
  CharacterItem,
  CharacterNote,
  LocalizedText,
} from "./types";
