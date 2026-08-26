import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import type { MeaningUnit } from "@/lib/videoSubtitle/groupMeaningUnits";
import { sceneContextForUnit } from "@/lib/videoSubtitle/getSceneContextAtTime";
import { chatModel, getOpenAIClient } from "@/lib/server/openai";
import { asNumber, asRecord, asString, parseModelJson } from "@/lib/videoSubtitle/parseModelJson";
import type { SceneContext } from "@/lib/videoSubtitle/sceneTypes";
import {
  contextPayload,
  emptyDraftFromUnit,
  localeTargetName,
  NEUTRAL_TONE,
  scenePayload,
  type SubtitleDraft,
  type UtteranceTone,
} from "@/lib/videoSubtitle/subtitleDraft";
import type { VideoContext } from "@/lib/videoSubtitle/types";
import type {
  NativeInterpretation,
  ViewerContext,
} from "@/lib/videoSubtitle/viewerTypes";
import { compactViewerContext } from "@/lib/videoSubtitle/viewerTypes";
import { spokenTranslatePrinciples } from "@/lib/spokenTranslate";
import { speechRegisterHint } from "@/lib/videoSubtitle/speechRegister";
import { looksLikeNarratorGloss } from "@/lib/videoSubtitle/calqueDetect";

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
 * Express an already-understood native meaning as a natural locale caption.
 * Uses the same spoken-translate craft as chat `/api/translate`.
 */
export async function expressForKoreanViewer(input: {
  locale: string;
  /** Learning / source language of the video (defaults to English). */
  targetLanguage?: string;
  context: VideoContext;
  units: MeaningUnit[];
  interpretations: NativeInterpretation[];
  viewerContext: ViewerContext;
  sceneContexts?: SceneContext[];
}): Promise<SubtitleDraft[]> {
  if (input.units.length === 0) return [];
  const client = getOpenAIClient();
  if (!client) throw new VideoPipelineError("MISSING_OPENAI_KEY");

  const interfaceLanguage = input.locale || "ko";
  const targetLanguage = input.targetLanguage || "en";
  const target = localeTargetName(interfaceLanguage);
  const byId = new Map(input.interpretations.map((row) => [row.unitId, row]));
  const drafts = new Map<string, SubtitleDraft>();
  const memory = compactViewerContext(input.viewerContext);

  for (let i = 0; i < input.units.length; i += BATCH) {
    const batch = input.units.slice(i, i + BATCH);
    try {
      const completion = await client.chat.completions.create({
        model: chatModel(),
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `${spokenTranslatePrinciples({
              locale: interfaceLanguage,
              interfaceLanguage,
              targetLanguage,
              sourceType: "subtitle",
            })}

Caption task:
You write on-screen ${target} captions for THIS video's speech genre — not generic movie/drama subtitles.
You receive a native viewer's UNDERSTOOD MEANING of each line (already resolved with video context).
Express that same understood meaning so a ${target} viewer reaches the SAME understanding, in the same kind of voice.

${speechRegisterHint(input.context, interfaceLanguage)}

Extra caption rules:
- Write the caption AS THE SPEAKER's line. The output IS the utterance, not a recap of it.
- Prefer natural spoken ${target} in this app's UI register (의역), not source-language word order.
- Drop source discourse frames (the reason X is / what I'm saying is). Say the point.
- You MAY make established/implicit info explicit in ${target} only when needed for equivalent understanding (evidence established or strongly_implied — never speculative).
- Do NOT over-explain. Caption only — no tutor notes.
- Keep short (one breath). Do not unpack into extra commentary.
- Do not invent facts, dates, or topics that were not in the understood meaning.
- HARD BAN narrator recaps: "someone is talking about X" / "~에 대해 이야기하고 있어요" / "~에 대해 언급하고 있어요" / "누군가 …하고 있어" / "~라고 설명하고 있어".

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
              video: contextPayload(input.context),
              viewerMemory: memory,
              items: batch.map((unit) => {
                const interp = byId.get(unit.id);
                const understood =
                  interp?.understoodMeaning || unit.original;
                const meaningIsRecap = looksLikeNarratorGloss(understood);
                return {
                  id: unit.id,
                  ...(meaningIsRecap ? { original: unit.original } : {}),
                  previous: unit.previousTexts,
                  next: unit.nextTexts,
                  understoodMeaning: understood,
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
          asString(row?.translated) ||
          asString(row?.translation) ||
          "";
        const conf = asNumber(row?.interpretationConfidence);
        const base = emptyDraftFromUnit(unit, input.context.speakerStyle);
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
    const base = emptyDraftFromUnit(unit, input.context.speakerStyle);
    return {
      ...base,
      ...draft,
      meaning: interp?.understoodMeaning || unit.original,
      literalMeaning: interp?.understoodMeaning || unit.original,
      naturalSubtitle: draft?.naturalSubtitle.trim() || "",
    };
  });
}
