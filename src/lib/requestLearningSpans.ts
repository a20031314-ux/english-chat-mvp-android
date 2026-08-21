import { apiUrl } from "@/lib/apiBase";
import { APP_LOCALE_STORAGE_KEY, isLocale } from "@/lib/copy";
import {
  fallbackLearningSpans,
  normalizeLearningSpans,
  peekLearningSpans,
  rememberLearningSpans,
  type LearningSpan,
} from "@/lib/learningSpans";
import {
  DEFAULT_LEARNING_LANGUAGE_CODE,
  type LearningLanguageCode,
} from "@/lib/learningLanguages";

const inflight = new Map<string, Promise<LearningSpan[]>>();

function interfaceLocale(): string {
  if (typeof window === "undefined") return "ko";
  try {
    const raw = window.localStorage.getItem(APP_LOCALE_STORAGE_KEY);
    if (raw && isLocale(raw)) return raw;
  } catch {
    // ignore
  }
  return "ko";
}

function requestKey(sentence: string, targetLanguage: LearningLanguageCode) {
  return `${targetLanguage}:${sentence.replace(/\s+/g, " ").trim()}`;
}

async function fetchLearningSpans(
  sentence: string,
  targetLanguage: LearningLanguageCode,
): Promise<LearningSpan[]> {
  const fallback = fallbackLearningSpans(sentence);
  try {
    const response = await fetch(apiUrl("/api/learning-spans"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sentence,
        targetLanguage,
        interfaceLanguage: interfaceLocale(),
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) return fallback;
    const data: unknown = await response.json();
    const spans = normalizeLearningSpans(data, sentence);
    return spans.length > 0 ? spans : fallback;
  } catch {
    return fallback;
  }
}

export function loadLearningSpans(
  sentence: string,
  targetLanguage: LearningLanguageCode = DEFAULT_LEARNING_LANGUAGE_CODE,
): Promise<LearningSpan[]> {
  const trimmed = sentence.replace(/\s+/g, " ").trim();
  if (!trimmed || targetLanguage === "en") {
    return Promise.resolve([]);
  }
  const cached = peekLearningSpans(trimmed, targetLanguage);
  if (cached) return Promise.resolve(cached);
  const key = requestKey(trimmed, targetLanguage);
  const pending = inflight.get(key);
  if (pending) return pending;

  const request = fetchLearningSpans(trimmed, targetLanguage)
    .then((spans) => {
      rememberLearningSpans(trimmed, targetLanguage, spans);
      rememberLearningSpans(sentence, targetLanguage, spans);
      return spans;
    })
    .finally(() => {
      inflight.delete(key);
    });
  inflight.set(key, request);
  return request;
}

export function prefetchLearningSpans(
  sentence: string,
  targetLanguage: LearningLanguageCode = DEFAULT_LEARNING_LANGUAGE_CODE,
) {
  if (targetLanguage === "en") return;
  void loadLearningSpans(sentence, targetLanguage);
}
