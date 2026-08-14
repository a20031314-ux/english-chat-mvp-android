import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import type { MeaningUnit } from "@/lib/videoSubtitle/groupMeaningUnits";
import { chatModel, getOpenAIClient } from "@/lib/videoSubtitle/openaiClient";
import { asRecord, asString, parseModelJson } from "@/lib/videoSubtitle/parseModelJson";
import type {
  EvidenceLevel,
  NativeInterpretation,
  ViewerContext,
  ViewerEntity,
} from "@/lib/videoSubtitle/viewerTypes";
import { compactViewerContext } from "@/lib/videoSubtitle/viewerTypes";

function asEvidence(value: unknown): EvidenceLevel {
  const raw = asString(value) || "";
  if (
    raw === "explicit" ||
    raw === "established" ||
    raw === "strongly_implied" ||
    raw === "speculative"
  ) {
    return raw;
  }
  return "established";
}

/**
 * Incrementally update viewer memory from new interpretations.
 * Does not rewrite the whole context from scratch.
 */
export async function updateViewerContext(input: {
  viewerContext: ViewerContext;
  units: MeaningUnit[];
  interpretations: NativeInterpretation[];
}): Promise<ViewerContext> {
  const base = compactViewerContext(input.viewerContext);
  if (input.units.length === 0) return base;

  const client = getOpenAIClient();
  if (!client) throw new VideoPipelineError("MISSING_OPENAI_KEY");

  // Soft local merge first (no API) for recent events.
  const recent = [
    ...base.recentEvents,
    ...input.units.map((unit) => unit.original.slice(0, 100)),
  ].slice(-8);

  try {
    const completion = await client.chat.completions.create({
      model: chatModel(),
      temperature: 0.2,
      response_format: { type: "json_object" },
      max_tokens: 700,
      messages: [
        {
          role: "system",
          content: `Update a native viewer's memory of a video. Only add/change what is newly established.
Do not invent plot. Do not mark speculative ideas as establishedFacts.
Prefer short factual memory that helps resolve future references (who, what entity, what situation).

Return JSON:
{
  "storySoFar": "updated short arc",
  "currentSituation": "what is happening now",
  "characters":[{"label":"A/B/name","notes":["..."]}],
  "entities":[{"name":"...","description":"...","relatedTo":"...","evidenceLevel":"established"}],
  "establishedFacts":["..."],
  "ongoingTopics":["..."],
  "conversationState":"...",
  "recentEvents":["..."]
}`,
        },
        {
          role: "user",
          content: JSON.stringify({
            previousMemory: base,
            newLines: input.units.map((unit) => ({
              text: unit.original,
              interpretation: input.interpretations.find(
                (row) => row.unitId === unit.id,
              ),
            })),
          }),
        },
      ],
    });

    const parsed = asRecord(
      parseModelJson(completion.choices[0]?.message?.content),
    );
    if (!parsed) {
      return { ...base, recentEvents: recent };
    }

    const characters = Array.isArray(parsed.characters)
      ? parsed.characters
          .map((row) => {
            const item = asRecord(row);
            const label = asString(item?.label);
            if (!label) return null;
            const notes = Array.isArray(item?.notes)
              ? item.notes
                  .map((note) => asString(note))
                  .filter((note): note is string => Boolean(note))
              : [];
            return { label, notes: notes.slice(0, 4) };
          })
          .filter((row): row is { label: string; notes: string[] } => row !== null)
          .slice(0, 8)
      : base.characters;

    const entities: ViewerEntity[] = Array.isArray(parsed.entities)
      ? parsed.entities
          .flatMap((row): ViewerEntity[] => {
            const item = asRecord(row);
            const name = asString(item?.name);
            const description = asString(item?.description);
            if (!name || !description) return [];
            const level = asEvidence(item?.evidenceLevel);
            if (level === "speculative") return [];
            const relatedTo = asString(item?.relatedTo);
            return [
              {
                name,
                description,
                ...(relatedTo ? { relatedTo } : {}),
                evidenceLevel: level,
              },
            ];
          })
          .slice(0, 10)
      : base.entities;

    const facts = Array.isArray(parsed.establishedFacts)
      ? parsed.establishedFacts
          .map((row) => asString(row))
          .filter((row): row is string => Boolean(row))
          .slice(-12)
      : base.establishedFacts;

    const topics = Array.isArray(parsed.ongoingTopics)
      ? parsed.ongoingTopics
          .map((row) => asString(row))
          .filter((row): row is string => Boolean(row))
          .slice(0, 6)
      : base.ongoingTopics;

    const events = Array.isArray(parsed.recentEvents)
      ? parsed.recentEvents
          .map((row) => asString(row))
          .filter((row): row is string => Boolean(row))
          .slice(-8)
      : recent;

    return compactViewerContext({
      storySoFar: asString(parsed.storySoFar) || base.storySoFar,
      currentSituation:
        asString(parsed.currentSituation) || base.currentSituation,
      characters: characters.length ? characters : base.characters,
      entities: entities.length ? entities : base.entities,
      establishedFacts: facts.length ? facts : base.establishedFacts,
      ongoingTopics: topics.length ? topics : base.ongoingTopics,
      conversationState:
        asString(parsed.conversationState) || base.conversationState,
      recentEvents: events,
    });
  } catch (error) {
    console.error("[viewer-context-update]", error);
    return { ...base, recentEvents: recent };
  }
}
