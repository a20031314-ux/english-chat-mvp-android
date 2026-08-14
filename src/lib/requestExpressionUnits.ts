import { apiUrl } from "@/lib/apiBase";
import {
  localExpressionUnits,
  normalizeUnitTexts,
} from "@/lib/expressionUnits";

const cache = new Map<string, string[]>();
const inflight = new Map<string, Promise<string[]>>();

function cacheKey(sentence: string) {
  return sentence.replace(/\s+/g, " ").trim();
}

async function fetchExpressionUnits(sentence: string): Promise<string[]> {
  const fallback = localExpressionUnits(sentence);
  try {
    const response = await fetch(apiUrl("/api/expression-units"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sentence }),
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

export function loadExpressionUnits(sentence: string): Promise<string[]> {
  const key = cacheKey(sentence);
  if (!key) return Promise.resolve([]);
  const hit = cache.get(key);
  if (hit) return Promise.resolve(hit);
  const pending = inflight.get(key);
  if (pending) return pending;

  const request = fetchExpressionUnits(key)
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

export function prefetchExpressionUnits(sentence: string) {
  void loadExpressionUnits(sentence);
}
