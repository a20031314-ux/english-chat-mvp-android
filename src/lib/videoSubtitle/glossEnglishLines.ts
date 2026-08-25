import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { chatModel, getOpenAIClient } from "@/lib/videoSubtitle/openaiClient";
import {
  asRecord,
  asString,
  parseModelJson,
} from "@/lib/videoSubtitle/parseModelJson";
import type { NormalizedSegment, VideoContext } from "@/lib/videoSubtitle/types";
import { learningLanguageName } from "@/lib/learningLanguages";
import { spokenTranslatePrinciples } from "@/lib/spokenTranslate";
import { openAiJsonCompleter } from "@/lib/reconstructionTranslate/openaiJson";
import {
  extractMeaningsForCaptions,
  firstInterpretationsForAnalysis,
} from "@/lib/reconstructionTranslate/refineCaptions";
import type { MeaningExtraction } from "@/lib/reconstructionTranslate/types";
import { distinctSpokenLine, NEUTRAL_TONE, type SubtitleDraft } from "@/lib/videoSubtitle/subtitleDraft";
import { speechRegisterHint } from "@/lib/videoSubtitle/speechRegister";
import { looksLikeNarratorGloss } from "@/lib/videoSubtitle/calqueDetect";
import { validateAdaptedSubtitles } from "@/lib/videoSubtitle/validateSubtitleMeaning";

const BATCH = 8;

export type LineGloss = {
  /** Same id as English study cue: mu-${segment.id} */
  id: string;
  /** On-screen caption (2-pass, UI-language spoken register). */
  interpretation: string;
  /** 1-pass first reading for sentence analysis. Not shown as the caption. */
  analysisTranslation?: string;
};

function cueId(segmentId: string): string {
  // Study lines already use mu-*; merge/split lines use edit-*. Keep as-is.
  if (segmentId.startsWith("mu-") || segmentId.startsWith("edit-")) {
    return segmentId;
  }
  return `mu-${segmentId}`;
}

function normalizeCompare(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function brevityHint(text: string): "short-reaction" | "brief" | "normal" {
  const n = text.trim().split(/\s+/).filter(Boolean).length;
  if (n <= 2) return "short-reaction";
  if (n <= 6) return "brief";
  return "normal";
}

/**
 * Per-line learner gloss tied to each STT segment id.
 * Captions are composed from meaning (original omitted) in the UI-language
 * spoken register. Analysis gets a 1-pass first reading of the source.
 */
export async function glossEnglishLines(input: {
  locale: string;
  targetLanguage?: string;
  interfaceLanguage?: string;
  context: VideoContext;
  segments: NormalizedSegment[];
}): Promise<LineGloss[]> {
  const client = getOpenAIClient();
  if (!client) throw new VideoPipelineError("MISSING_OPENAI_KEY");
  if (input.segments.length === 0) return [];

  const interfaceLanguage = input.interfaceLanguage || input.locale || "ko";
  const targetLanguage = input.targetLanguage || "en";
  const sourceName = learningLanguageName(targetLanguage);
  const out: LineGloss[] = [];
  const completeJson = openAiJsonCompleter();

  const lineRules = `
Video-line constraints (on top of the shared translate craft):
- You receive the MEANING of a ${sourceName} line — not the original wording — unless sourceText is present.
- Keep the same id.
- This is an ON-SCREEN caption: the line THE SPEAKER said, in the app's UI-language spoken register.
- The caption IS the utterance. Not a recap of the speaker.
- WRONG: "Someone is asking about OpenAI" / "오픈AI에 대해 질문하고 있어" / "~에 대해 이야기하고 있어요" / "~에 대해 언급하고 있어요"
- RIGHT: "오픈웨이트라는 거예요?" / "그리고 최근 뭐니뭐니 해도 화제의 문샷 AI."
- Drop source discourse frames (the reason X is / what I'm saying is). Say the point.
- short-reaction lines stay short. Never expand them into the next sentence's content.
- brief/fragment meanings: gloss ONLY that idea. Do not dump neighboring sentences onto this line.
- Keep captions short enough to read on screen (one breath). Do not unpack into commentary.
- Do not invent facts, dates, or topics that were not in the meaning.
- Do not write tutor notes, labels, or leftover source-language wording in the gloss.
- If sourceText is present (meaning was a reporter note), translate THAT line as the speaker.
`.trim();

  for (let i = 0; i < input.segments.length; i += BATCH) {
    const batch = input.segments.slice(i, i + BATCH);
    const ids = batch.map((segment) => cueId(segment.id));
    let meanings = new Map<string, MeaningExtraction>();
    try {
      meanings = await extractMeaningsForCaptions(
        {
          sourceLang: targetLanguage,
          targetLang: interfaceLanguage,
          sourceType: "subtitle",
          videoContext: [input.context.topic, input.context.summary]
            .filter(Boolean)
            .join(" — "),
        },
        batch.map((segment) => ({
          id: cueId(segment.id),
          sourceText: segment.normalizedText,
        })),
        completeJson,
      );
    } catch (error) {
      console.error("[gloss-extract-meaning]", error);
    }

    const meaningItems = batch.map((segment, index) => {
      const abs = i + index;
      const id = ids[index]!;
      const meaning = meanings.get(id);
      const prev = input.segments[abs - 1];
      const next = input.segments[abs + 1];
      const core =
        meaning?.coreMeaning && !looksLikeNarratorGloss(meaning.coreMeaning)
          ? meaning.coreMeaning
          : "";
      return {
        id,
        brevityHint: brevityHint(segment.normalizedText),
        ...(core
          ? {
              coreMeaning: core,
              speakerIntent: meaning?.speakerIntent,
              formalityLevel: meaning?.formalityLevel,
              mustKeep: meaning?.keyEntities ?? [],
              speechTexture: meaning?.speechTexture,
            }
          : { sourceText: segment.normalizedText }),
        previousMeaning: prev ? meanings.get(cueId(prev.id))?.coreMeaning : "",
        nextMeaning: next ? meanings.get(cueId(next.id))?.coreMeaning : "",
      };
    });
    const useMeaning = meaningItems.every((item) => "coreMeaning" in item && item.coreMeaning);

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

${lineRules}

${speechRegisterHint(input.context, interfaceLanguage)}

Return JSON:
{"items":[{"id":"...","interpretation":"..."}]}
Each interpretation is the on-screen caption for that meaning (same field as chat "translated").`,
          },
          {
            role: "user",
            content: JSON.stringify({
              topic: input.context.topic,
              situation: input.context.summary,
              items: useMeaning
                ? meaningItems
                : batch.map((segment, index) => {
                    const abs = i + index;
                    const prev = input.segments[abs - 1];
                    const next = input.segments[abs + 1];
                    return {
                      id: cueId(segment.id),
                      text: segment.normalizedText,
                      previous: prev?.normalizedText || "",
                      next: next?.normalizedText || "",
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
      const byId = new Map<string, string>();
      for (const row of rows) {
        const item = asRecord(row);
        const id = asString(item?.id);
        const interpretation =
          asString(item?.interpretation) ||
          asString(item?.translated) ||
          asString(item?.naturalSubtitle) ||
          asString(item?.translation) ||
          "";
        if (id && interpretation.trim()) {
          byId.set(cueId(id), interpretation.trim());
        }
      }

      const captions: LineGloss[] = [];
      for (let index = 0; index < batch.length; index += 1) {
        const segment = batch[index]!;
        const id = cueId(segment.id);
        let interpretation = byId.get(id) || "";
        if (!interpretation && rows.length === batch.length) {
          const row = asRecord(rows[index]);
          const candidate =
            asString(row?.interpretation) ||
            asString(row?.translated) ||
            asString(row?.naturalSubtitle) ||
            asString(row?.translation);
          const rowSource =
            asString(row?.text) ||
            asString(row?.english) ||
            asString(row?.original) ||
            "";
          if (
            candidate &&
            (!rowSource ||
              normalizeCompare(rowSource) ===
                normalizeCompare(segment.normalizedText))
          ) {
            interpretation = candidate.trim();
          }
        }
        if (interpretation) {
          captions.push({ id, interpretation });
        }
      }

      const recapCaptions = captions.filter((row) =>
        looksLikeNarratorGloss(row.interpretation),
      );
      if (recapCaptions.length > 0) {
        try {
          const drafts: SubtitleDraft[] = recapCaptions.map((row) => {
            const segment =
              batch.find((item) => cueId(item.id) === row.id) ?? batch[0]!;
            const meaning = meanings.get(row.id);
            return {
              id: row.id,
              segmentIds: [segment.id],
              startTime: segment.startTime,
              endTime: segment.endTime,
              original: segment.normalizedText,
              meaning: meaning?.coreMeaning || segment.normalizedText,
              tone: { ...NEUTRAL_TONE },
              speakerStyle: input.context.speakerStyle,
              naturalSubtitle: row.interpretation,
              interpretationConfidence: 0.5,
              literalMeaning: meaning?.coreMeaning || segment.normalizedText,
            };
          });
          const revised = await validateAdaptedSubtitles({
            locale: interfaceLanguage,
            context: input.context,
            drafts,
          });
          const rewritten = new Map(
            revised.map((draft) => [draft.id, draft.naturalSubtitle]),
          );
          for (const row of captions) {
            const next = rewritten.get(row.id)?.trim();
            if (next && !looksLikeNarratorGloss(next)) {
              row.interpretation = next;
            }
          }
        } catch (error) {
          console.error("[gloss-narrator-rewrite]", error);
        }
      }

      try {
        const firstReadings = await firstInterpretationsForAnalysis(
          {
            sourceLang: targetLanguage,
            targetLang: interfaceLanguage,
            sourceType: "subtitle",
            videoContext: [input.context.topic, input.context.summary]
              .filter(Boolean)
              .join(" — "),
          },
          captions.map((row, index) => {
            const segment =
              batch.find((item) => cueId(item.id) === row.id) ?? batch[index]!;
            return {
              id: row.id,
              sourceText: segment.normalizedText,
            };
          }),
          completeJson,
        );
        for (const row of captions) {
          const analysisTranslation = distinctSpokenLine(
            row.interpretation,
            firstReadings.get(row.id),
          );
          if (analysisTranslation) {
            console.error("[translate:caption-pair]", {
              id: row.id,
              caption: row.interpretation,
              firstReading: analysisTranslation,
            });
          }
          out.push(
            analysisTranslation
              ? { ...row, analysisTranslation }
              : row,
          );
        }
      } catch (error) {
        console.error("[gloss-first-reading]", error);
        out.push(...captions);
      }
    } catch (error) {
      console.error("[gloss-english-lines]", error);
    }
  }

  return out;
}
