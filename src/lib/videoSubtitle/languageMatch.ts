import type { LearningLanguageCode } from "@/lib/learningLanguages";

function countScripts(text: string) {
  const sample = text.slice(0, 1200);
  return {
    hangul: (sample.match(/[\uac00-\ud7af]/g) || []).length,
    latin: (sample.match(/[A-Za-zÀ-ÿ]/g) || []).length,
    cyrillic: (sample.match(/[\u0400-\u04FF]/g) || []).length,
    cjk: (sample.match(/[\u3040-\u30ff\u3400-\u9fff]/g) || []).length,
  };
}

/**
 * True when transcript/title text is clearly dominated by a script that does
 * not match the learning language (e.g. Hangul while learning English).
 */
export function speechLooksWrongLanguage(
  text: string,
  target: LearningLanguageCode,
): boolean {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) return false;
  const { hangul, latin, cyrillic, cjk } = countScripts(trimmed);
  const total = hangul + latin + cyrillic + cjk;
  if (total < 4) return false;

  const h = hangul / total;
  const l = latin / total;
  const c = cyrillic / total;
  const j = cjk / total;

  switch (target) {
    case "ko":
      return hangul < 3 && (l > 0.55 || c > 0.4 || j > 0.4);
    case "ru":
      return cyrillic < 3 && (l > 0.55 || h > 0.2 || j > 0.35);
    case "ja":
      return cjk < 3 && (l > 0.55 || h > 0.25 || c > 0.35);
    case "zh":
      return cjk < 3 && (l > 0.55 || h > 0.25 || c > 0.35);
    case "en":
    case "es":
    case "fr":
    case "it":
    case "pt":
      // Short Hangul-only cues like "김영희 여사!" must still count as wrong.
      if (hangul >= 3 && hangul >= latin + cyrillic + Math.floor(cjk * 0.5)) {
        return true;
      }
      if (cyrillic >= 4 && cyrillic > latin) return true;
      if (cjk >= 4 && cjk > latin && hangul < 2) return true;
      return total >= 10 && (h > 0.18 || c > 0.25 || (j > 0.28 && h < 0.05));
    default:
      return false;
  }
}

/** YouTube defaultAudioLanguage / defaultLanguage vs learning language. */
export function youtubeLanguageMatchesTarget(
  languageCode: string | undefined,
  target: LearningLanguageCode,
): boolean {
  if (!languageCode?.trim()) return true; // unknown → keep, rank later
  const base = languageCode.trim().toLowerCase().replace(/_/g, "-").split("-")[0]!;
  const targetBase = target.toLowerCase().split("-")[0]!;
  if (targetBase === "zh") {
    return base === "zh" || base.startsWith("zh");
  }
  return base === targetBase;
}

/** Title/description script mismatch for discovery filtering. */
export function discoveryTextLooksWrongLanguage(
  text: string,
  target: LearningLanguageCode,
): boolean {
  return speechLooksWrongLanguage(text, target);
}
