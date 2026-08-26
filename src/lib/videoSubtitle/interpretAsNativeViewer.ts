import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import type { MeaningUnit } from "@/lib/videoSubtitle/groupMeaningUnits";
import { sceneContextForUnit } from "@/lib/videoSubtitle/getSceneContextAtTime";
import { chatModel, getOpenAIClient } from "@/lib/server/openai";
import { asNumber, asRecord, asString, parseModelJson } from "@/lib/videoSubtitle/parseModelJson";
import type { SceneContext } from "@/lib/videoSubtitle/sceneTypes";
import { scenePayload } from "@/lib/videoSubtitle/subtitleDraft";
import type {
  EvidenceLevel,
  NativeInterpretation,
  ResolvedReference,
  ViewerContext,
} from "@/lib/videoSubtitle/viewerTypes";
import { compactViewerContext } from "@/lib/videoSubtitle/viewerTypes";

const BATCH = 5;

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
  return "strongly_implied";
}

function parseReferences(value: unknown): ResolvedReference[] {
  if (!Array.isArray(value)) return [];
  const out: ResolvedReference[] = [];
  for (const row of value) {
    const item = asRecord(row);
    const expression = asString(item?.expression);
    const refersTo = asString(item?.refersTo);
    if (!expression || !refersTo) continue;
    out.push({
      expression,
      refersTo,
      evidenceLevel: asEvidence(item?.evidenceLevel),
      confidence: asNumber(item?.confidence) ?? undefined,
    });
  }
  return out.slice(0, 6);
}

/**
 * Interpret utterances as a continuous native English viewer.
 * Does NOT produce Korean. Resolves references using ViewerContext.
 */
export async function interpretAsNativeViewer(input: {
  units: MeaningUnit[];
  viewerContext: ViewerContext;
  sceneContexts?: SceneContext[];
  videoContext?: { topic?: string; domain?: string; summary?: string; speakerStyle?: string };
}): Promise<NativeInterpretation[]> {
  if (input.units.length === 0) return [];
  const client = getOpenAIClient();
  if (!client) throw new VideoPipelineError("MISSING_OPENAI_KEY");

  const out: NativeInterpretation[] = [];
  const memory = compactViewerContext(input.viewerContext);

  for (let i = 0; i < input.units.length; i += BATCH) {
    const batch = input.units.slice(i, i + BATCH);
    try {
      const completion = await client.chat.completions.create({
        model: chatModel(),
        temperature: 0.25,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are a native English-speaking viewer who has watched this video continuously from the start.

Do NOT translate into Korean.
Do NOT behave as a dictionary translator.

VIDEO tells you what kind of show this is (sports commentary, news, vlog, tutorial, drama…).
Understand each line as a viewer of THAT kind of show.

For each CURRENT utterance, answer:
"What would I, as a native viewer who knows everything established so far, actually understand the speaker to mean here?"

Resolve pronouns and deixis (this/that/it/he/she/they/the monster/the problem/…) using VIEWER MEMORY when established.
Mark evidenceLevel:
- explicit: said in this line
- established: clearly set earlier in the video
- strongly_implied: very likely from context
- speculative: guess — do not treat as fact in understoodMeaning

understoodMeaning is the CONTENT of this line (what was said), restated in English.
NOT a reporter note.
WRONG: "The speaker is mentioning China's DeepSeek" / "Someone is asking about OpenAI"
RIGHT: "And as for China — well, DeepSeek, which shocked the world" / "Asking: is it called open-weight?"
Keep understoodMeaning in clear English (1–2 sentences).
Keep tone short (e.g. "serious, concerned" or "sarcastic").

Return JSON:
{
  "items":[{
    "id":"...",
    "understoodMeaning":"...",
    "references":[{"expression":"...","refersTo":"...","evidenceLevel":"established","confidence":0.0}],
    "intent":"...",
    "tone":"...",
    "establishedNote":"optional short why a reference was resolved",
    "confidence":0.0
  }]
}`,
          },
          {
            role: "user",
            content: JSON.stringify({
              video: input.videoContext ?? null,
              viewerMemory: memory,
              items: batch.map((unit) => ({
                id: unit.id,
                previous: unit.previousTexts,
                current: unit.original,
                next: unit.nextTexts,
                scene: scenePayload(
                  sceneContextForUnit(
                    input.sceneContexts,
                    unit.startTime,
                    unit.endTime,
                  ),
                ),
              })),
            }),
          },
        ],
      });

      const parsed = asRecord(
        parseModelJson(completion.choices[0]?.message?.content),
      );
      const rows = Array.isArray(parsed?.items) ? parsed.items : [];
      for (const unit of batch) {
        const row = rows
          .map((entry) => asRecord(entry))
          .find((entry) => asString(entry?.id) === unit.id);
        const meaning =
          asString(row?.understoodMeaning) ||
          asString(row?.meaning) ||
          unit.original;
        out.push({
          unitId: unit.id,
          understoodMeaning: meaning.trim(),
          references: parseReferences(row?.references),
          intent: asString(row?.intent) || undefined,
          tone: asString(row?.tone) || undefined,
          confidence: asNumber(row?.confidence) ?? undefined,
          establishedNote: asString(row?.establishedNote) || undefined,
        });
      }
    } catch (error) {
      console.error("[native-interpret]", error);
      for (const unit of batch) {
        out.push({
          unitId: unit.id,
          understoodMeaning: unit.original,
          references: [],
          confidence: 0.4,
        });
      }
    }
  }

  return out;
}
