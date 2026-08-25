import {
  isSubtitleDebugEnabled,
  logSubtitleDebug,
  sceneDebugSlice,
  toneSummary,
} from "@/lib/videoSubtitle/debugSubtitleContext";
import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import type { MeaningUnit } from "@/lib/videoSubtitle/groupMeaningUnits";
import { sceneContextForUnit } from "@/lib/videoSubtitle/getSceneContextAtTime";
import { chatModel, getOpenAIClient } from "@/lib/videoSubtitle/openaiClient";
import { asNumber, asRecord, asString, parseModelJson } from "@/lib/videoSubtitle/parseModelJson";
import type {
  ConversationContext,
  SceneContext,
} from "@/lib/videoSubtitle/sceneTypes";
import {
  contextPayload,
  conversationPayload,
  emptyDraftFromUnit,
  localeTargetName,
  NEUTRAL_TONE,
  type SubtitleDraft,
  type UtteranceTone,
  unitPromptItem,
} from "@/lib/videoSubtitle/subtitleDraft";
import type { VideoContext } from "@/lib/videoSubtitle/types";
import { spokenTranslatePrinciples } from "@/lib/spokenTranslate";
import { speechRegisterHint } from "@/lib/videoSubtitle/speechRegister";

const BATCH = 6;

function adaptSystem(
  locale: string,
  context: VideoContext,
  targetLanguage = "en",
): string {
  const interfaceLanguage = locale || "ko";
  const target = localeTargetName(interfaceLanguage);
  return `${spokenTranslatePrinciples({
    locale: interfaceLanguage,
    interfaceLanguage,
    targetLanguage,
    sourceType: "subtitle",
  })}

Caption task:
You write on-screen ${target} captions that match THIS video's speech genre — NOT dictionary translations and NOT a default movie/drama voice.

${speechRegisterHint(context, interfaceLanguage)}

Core job:
1) What does this line MEAN in this scene (intent + feeling)?
2) What would a native ${target} speaker SAY aloud with the same vibe, in this video's genre?

HARD BAN:
- word-for-word glosses / translationese / textbook wording
- mapping each source word into ${target} in the same order
- source content words left in ${target} (proper names OK)
- narrator recaps of the speaker ("someone is talking about X", "~에 대해 이야기하고 있어요", "누군가 …하고 있어")${
    interfaceLanguage === "ko" ? "\n- Korean 번역투 / 직역체" : ""
  }

You receive VIDEO CONTEXT, optional SCENE CONTEXT (soft evidence only), PREVIOUS / CURRENT / NEXT.

Keep captions SHORT (one breath). Honest meaning. No tutor notes. \\n only for a reading beat.

Also return for yourself:
- meaning: contextual intent (not a calque)
- tone: how they said it

Return JSON:
{
  "items":[{
    "id":"...",
    "meaning":"...",
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
    "naturalSubtitle":"...",
    "interpretationConfidence":0.0
  }]
}`;
}

function parseTone(value: unknown): UtteranceTone {
  const row = asRecord(value);
  if (!row) return { ...NEUTRAL_TONE };
  return {
    formality: asString(row.formality) || NEUTRAL_TONE.formality,
    politeness: asString(row.politeness) || NEUTRAL_TONE.politeness,
    intimacy: asString(row.intimacy) || NEUTRAL_TONE.intimacy,
    emotion: asString(row.emotion) || NEUTRAL_TONE.emotion,
    intensity: asString(row.intensity) || NEUTRAL_TONE.intensity,
    confidence: asString(row.confidence) || NEUTRAL_TONE.confidence,
    hesitation: asString(row.hesitation) || NEUTRAL_TONE.hesitation,
    humor: asString(row.humor) || NEUTRAL_TONE.humor,
    sarcasm: asString(row.sarcasm) || NEUTRAL_TONE.sarcasm,
    attitude: asString(row.attitude) || NEUTRAL_TONE.attitude,
  };
}

async function adaptBatch(
  locale: string,
  context: VideoContext,
  units: MeaningUnit[],
  sceneByUnitId: Map<string, SceneContext | undefined>,
  conversation?: ConversationContext,
  targetLanguage = "en",
): Promise<Map<string, SubtitleDraft>> {
  const client = getOpenAIClient();
  if (!client) throw new VideoPipelineError("MISSING_OPENAI_KEY");

  const completion = await client.chat.completions.create({
    model: chatModel(),
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: adaptSystem(locale, context, targetLanguage) },
      {
        role: "user",
        content: JSON.stringify({
          context: contextPayload(context),
          conversation: conversationPayload(conversation),
          items: units.map((unit) =>
            unitPromptItem(unit, sceneByUnitId.get(unit.id)),
          ),
        }),
      },
    ],
  });

  const parsed = asRecord(parseModelJson(completion.choices[0]?.message?.content));
  const rows = Array.isArray(parsed?.items) ? parsed.items : [];
  const map = new Map<string, SubtitleDraft>();

  for (const row of rows) {
    const item = asRecord(row);
    const id = asString(item?.id);
    if (!id) continue;
    const unit = units.find((entry) => entry.id === id);
    if (!unit) continue;
    const meaning =
      asString(item?.meaning) ||
      asString(item?.literalMeaning) ||
      unit.original;
    const natural =
      asString(item?.naturalSubtitle) ||
      asString(item?.naturalKoreanSubtitle) ||
      asString(item?.translation) ||
      "";
    const conf = asNumber(item?.interpretationConfidence);
    const base = emptyDraftFromUnit(unit, context.speakerStyle);
    const draft: SubtitleDraft = {
      ...base,
      meaning,
      tone: parseTone(item?.tone),
      naturalSubtitle: natural.trim(),
      interpretationConfidence:
        conf != null ? Math.max(0, Math.min(1, conf)) : 0.6,
      literalMeaning: meaning,
    };
    map.set(id, draft);

    if (isSubtitleDebugEnabled()) {
      logSubtitleDebug({
        original: unit.original,
        scene: sceneDebugSlice(sceneByUnitId.get(unit.id)),
        previous: unit.previousTexts,
        next: unit.nextTexts,
        meaning: draft.meaning,
        toneSummary: toneSummary(draft.tone),
        finalSubtitle: draft.naturalSubtitle,
      });
    }
  }
  return map;
}

export async function adaptSubtitleUnits(input: {
  locale: string;
  context: VideoContext;
  units: MeaningUnit[];
  sceneContexts?: SceneContext[];
  conversation?: ConversationContext;
}): Promise<SubtitleDraft[]> {
  if (input.units.length === 0) return [];
  const byId = new Map<string, SubtitleDraft>();
  const sceneByUnitId = new Map<string, SceneContext | undefined>();
  for (const unit of input.units) {
    const scene = sceneContextForUnit(
      input.sceneContexts,
      unit.startTime,
      unit.endTime,
    );
    // Only attach scenes that actually carry visual evidence.
    sceneByUnitId.set(
      unit.id,
      scene &&
        (scene.setting ||
          scene.situation ||
          scene.interaction ||
          scene.mood ||
          (scene.visualCues && scene.visualCues.length))
        ? scene
        : undefined,
    );
  }

  for (let i = 0; i < input.units.length; i += BATCH) {
    const batch = input.units.slice(i, i + BATCH);
    try {
      const map = await adaptBatch(
        input.locale,
        input.context,
        batch,
        sceneByUnitId,
        input.conversation,
      );
      map.forEach((value, key) => byId.set(key, value));
    } catch (error) {
      console.error("[video-adapt]", error);
    }
  }

  return input.units.map((unit) => {
    const draft = byId.get(unit.id);
    if (draft?.naturalSubtitle) return draft;
    return emptyDraftFromUnit(unit, input.context.speakerStyle);
  });
}
