import type OpenAI from "openai";
import { learningLanguageName } from "@/lib/learningLanguages";
import type {
  ContentCandidate,
  ContentSearchIntent,
} from "@/lib/contentDiscovery/types";

import { chatModel } from "@/lib/server/openai";

type RankRow = {
  id?: string;
  score?: number;
  reason?: string;
};

/**
 * Rank filtered candidates using metadata only.
 * Never invents new candidates — only scores/reorders provided ids.
 */
export async function rankCandidates(
  client: OpenAI | null,
  intent: ContentSearchIntent,
  candidates: ContentCandidate[],
  interfaceLanguage = "ko",
): Promise<ContentCandidate[]> {
  if (candidates.length === 0) return [];
  if (!client) {
    return candidates.slice(0, 10).map((item, index) => ({
      ...item,
      learningScore: 70 - index,
    }));
  }

  const payload = candidates.slice(0, 16).map((item) => ({
    id: item.id,
    type: item.type,
    source: item.source,
    title: item.title,
    description: (item.description || item.preview || "").slice(0, 240),
    channel: item.authorOrChannel || "",
    durationSeconds: item.durationSeconds ?? null,
    estimatedReadingMinutes: item.estimatedReadingMinutes ?? null,
    languageHint: item.language || null,
    publishedAt: item.publishedAt || null,
  }));

  try {
    const completion = await client.chat.completions.create({
      model: chatModel(),
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You rank REAL content candidates for language learning.
You MUST only use the given candidate ids. Do NOT invent titles, URLs, or new items.

Target learning language: ${learningLanguageName(intent.language)}
Topic: ${intent.topic}
Content type: ${intent.contentType}
Preferred duration: ${JSON.stringify(intent.duration)}
Learner level: ${intent.level || "unknown"}

Score each item 0–100 on learning suitability using ONLY metadata:
- language match (soft; title/description may be incomplete)
- topic match
- level match (heuristic, not CEFR certainty)
- learning value (speech-heavy video / useful reading)
- duration / length match
- content quality signals

Write reason in ${interfaceLanguage === "en" ? "English" : interfaceLanguage === "es" ? "Spanish" : "Korean"}:
- one short sentence
- do not state unverifiable facts as certain
- prefer cautious phrasing ("~하기 좋아 보여요")

Return JSON:
{"items":[{"id":"...","score":0,"reason":"..."}]}
Return at most 10 items, best first.`,
        },
        {
          role: "user",
          content: JSON.stringify({ candidates: payload }),
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return candidates.slice(0, 10);

    const parsed = JSON.parse(raw) as { items?: RankRow[] };
    const rows = Array.isArray(parsed.items) ? parsed.items : [];
    const byId = new Map(candidates.map((c) => [c.id, c]));
    const ranked: ContentCandidate[] = [];
    const used = new Set<string>();

    for (const row of rows) {
      const id = typeof row.id === "string" ? row.id : "";
      const base = byId.get(id);
      if (!base || used.has(id)) continue;
      used.add(id);
      ranked.push({
        ...base,
        learningScore:
          typeof row.score === "number"
            ? Math.max(0, Math.min(100, row.score))
            : undefined,
        learningReason:
          typeof row.reason === "string" && row.reason.trim()
            ? row.reason.trim().slice(0, 120)
            : undefined,
      });
      if (ranked.length >= 10) break;
    }

    if (ranked.length === 0) {
      return candidates.slice(0, 10);
    }
    return ranked;
  } catch (error) {
    console.error("[content-discovery/rank]", error);
    return candidates.slice(0, 10);
  }
}
