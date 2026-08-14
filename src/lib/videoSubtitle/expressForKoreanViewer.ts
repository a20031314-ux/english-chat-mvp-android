import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import type { MeaningUnit } from "@/lib/videoSubtitle/groupMeaningUnits";
import { sceneContextForUnit } from "@/lib/videoSubtitle/getSceneContextAtTime";
import { chatModel, getOpenAIClient } from "@/lib/videoSubtitle/openaiClient";
import { asNumber, asRecord, asString, parseModelJson } from "@/lib/videoSubtitle/parseModelJson";
import type { SceneContext } from "@/lib/videoSubtitle/sceneTypes";
import {
  emptyDraftFromUnit,
  localeTargetName,
  NEUTRAL_TONE,
  scenePayload,
  type SubtitleDraft,
  type UtteranceTone,
} from "@/lib/videoSubtitle/subtitleDraft";
import type {
  NativeInterpretation,
  ViewerContext,
} from "@/lib/videoSubtitle/viewerTypes";
import { compactViewerContext } from "@/lib/videoSubtitle/viewerTypes";

const BATCH = 6;

function parseTone(value: unknown): UtteranceTone {
  const row = asRecord(value);
  if (!row) return { ...NEUTRAL_TONE };
  return {
    formality: asString(row.formality) || NEUTRAL_TONE.formality,
    politeness: asString(row.politeness) || NEUTRAL_TONE.politeness,
    intimacy: asString(row.intimacy) || NEUTRAL_TONE.intimacy,
    emotion: asString(row.emotion) || asString(row.emotionHint) || NEUTRAL_TONE.emotion,
    intensity: asString(row.intensity) || NEUTRAL_TONE.intensity,
    confidence: asString(row.confidence) || NEUTRAL_TONE.confidence,
    hesitation: asString(row.hesitation) || NEUTRAL_TONE.hesitation,
    humor: asString(row.humor) || NEUTRAL_TONE.humor,
    sarcasm: asString(row.sarcasm) || NEUTRAL_TONE.sarcasm,
    attitude: asString(row.attitude) || NEUTRAL_TONE.attitude,
  };
}

/**
 * Express an already-understood native meaning as a natural Korean (locale) caption.
 * Does not re-translate from English word-by-word.
 */
export async function expressForKoreanViewer(input: {
  locale: string;
  speakerStyle: string;
  units: MeaningUnit[];
  interpretations: NativeInterpretation[];
  viewerContext: ViewerContext;
  sceneContexts?: SceneContext[];
}): Promise<SubtitleDraft[]> {
  if (input.units.length === 0) return [];
  const client = getOpenAIClient();
  if (!client) throw new VideoPipelineError("MISSING_OPENAI_KEY");

  const target = localeTargetName(input.locale);
  const byId = new Map(input.interpretations.map((row) => [row.unitId, row]));
  const drafts = new Map<string, SubtitleDraft>();
  const memory = compactViewerContext(input.viewerContext);

  for (let i = 0; i < input.units.length; i += BATCH) {
    const batch = input.units.slice(i, i + BATCH);
    try {
      const completion = await client.chat.completions.create({
        model: chatModel(),
        temperature: 0.65,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You write on-screen ${target} movie/drama subtitles.

You are NOT a dictionary translator.
You receive a native English viewer's UNDERSTOOD MEANING of each line (already resolved with video context).

Your job:
Express that same understood meaning so a Korean viewer reaches the SAME understanding.

Rules:
- Prefer natural spoken ${target} (의역), not English word order.
- You MAY make established/implicit English info explicit in ${target} only when needed for equivalent understanding (evidence established or strongly_implied — never speculative).
- Do NOT over-explain. Only add what a Korean viewer needs to match the English viewer.
- Caption only — no tutor notes, no "이 말은 ~".
- Keep short (one breath).
- Examples of spirit:
  "I'm losing my mind" → "정신 나갈 것 같아" (not "내 정신이 나가고 있어")
  "Can you get rid of that monster?" + established "monster inside A"
    → "네 안에 있는 그 괴물, 없앨 수 있어?" when needed for same understanding

Return JSON:
{
  "items":[{
    "id":"...",
    "naturalSubtitle":"...",
    "tone":{
      "formality":"...",
      "politeness":"...",
      "intimacy":"...",
      "emotion":"...",
      "intensity":"...",
      "confidence":"...",
      "hesitation":"...",
      "humor":"...",
      "sarcasm":"...",
      "attitude":"..."
    },
    "interpretationConfidence":0.0
  }]
}`,
          },
          {
            role: "user",
            content: JSON.stringify({
              viewerMemory: memory,
              items: batch.map((unit) => {
                const interp = byId.get(unit.id);
                return {
                  id: unit.id,
                  original: unit.original,
                  previous: unit.previousTexts,
                  next: unit.nextTexts,
                  understoodMeaning:
                    interp?.understoodMeaning || unit.original,
                  references: interp?.references ?? [],
                  intent: interp?.intent,
                  nativeTone: interp?.tone,
                  scene: scenePayload(
                    sceneContextForUnit(
                      input.sceneContexts,
                      unit.startTime,
                      unit.endTime,
                    ),
                  ),
                };
              }),
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
        const interp = byId.get(unit.id);
        const natural =
          asString(row?.naturalSubtitle) ||
          asString(row?.translation) ||
          "";
        const conf = asNumber(row?.interpretationConfidence);
        const base = emptyDraftFromUnit(unit, input.speakerStyle);
        drafts.set(unit.id, {
          ...base,
          meaning: interp?.understoodMeaning || unit.original,
          tone: parseTone(row?.tone),
          naturalSubtitle: natural.trim(),
          interpretationConfidence:
            conf != null
              ? Math.max(0, Math.min(1, conf))
              : interp?.confidence ?? 0.6,
          literalMeaning: interp?.understoodMeaning || unit.original,
        });
      }
    } catch (error) {
      console.error("[express-korean]", error);
    }
  }

  return input.units.map((unit) => {
    const draft = drafts.get(unit.id);
    if (draft?.naturalSubtitle.trim()) return draft;
    const interp = byId.get(unit.id);
    const base = emptyDraftFromUnit(unit, input.speakerStyle);
    // Leave empty rather than echoing English onto the Korean caption line.
    return {
      ...base,
      ...draft,
      meaning: interp?.understoodMeaning || unit.original,
      literalMeaning: interp?.understoodMeaning || unit.original,
      naturalSubtitle: draft?.naturalSubtitle.trim() || "",
    };
  });
}
