import { apiUrl } from "@/lib/apiBase";
import {
  localExpressionUnits,
  normalizeUnitTexts,
} from "@/lib/expressionUnits";
import {
  DEFAULT_LEARNING_LANGUAGE_CODE,
  type LearningLanguageCode,
} from "@/lib/learningLanguages";

const cache = new Map<string, string[]>();
const inflight = new Map<string, Promise<string[]>>();

function cacheKey(sentence: string, targetLanguage: LearningLanguageCode) {
  return `${targetLanguage}:${sentence.replace(/\s+/g, " ").trim()}`;
}

async function fetchExpressionUnits(
  sentence: string,
  targetLanguage: LearningLanguageCode,
): Promise<string[]> {
  const fallback =
    targetLanguage === "en" ? localExpressionUnits(sentence) : [];
  try {
    const response = await fetch(apiUrl("/api/expression-units"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sentence, targetLanguage }),
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) return fallback;
    const data: unknown = await response.json();
    const units = normalizeUnitTexts(data, sentence);
    return units.length > 0 ? units : fallback;
  } catch {
    return fallback;
  }
}

export function loadExpressionUnits(
  sentence: string,
  targetLanguage: LearningLanguageCode = DEFAULT_LEARNING_LANGUAGE_CODE,
): Promise<string[]> {
  const trimmed = sentence.replace(/\s+/g, " ").trim();
  if (!trimmed) return Promise.resolve([]);
  const key = cacheKey(trimmed, targetLanguage);
  const hit = cache.get(key);
  if (hit) return Promise.resolve(hit);
  const pending = inflight.get(key);
  if (pending) return pending;

  const request = fetchExpressionUnits(trimmed, targetLanguage)
    .then((units) => {
      cache.set(key, units);
      return units;
    })
    .finally(() => {
      inflight.delete(key);
    });
  inflight.set(key, request);
  return request;
}

export function prefetchExpressionUnits(
  sentence: string,
  targetLanguage: LearningLanguageCode = DEFAULT_LEARNING_LANGUAGE_CODE,
) {
  void loadExpressionUnits(sentence, targetLanguage);
}
