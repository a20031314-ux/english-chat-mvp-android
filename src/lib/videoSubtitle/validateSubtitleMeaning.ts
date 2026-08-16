import {
  looksIdiomaticEnglish,
  looksLikeLiteralOrForeignCaption,
  leftoverEnglishContentWords,
} from "@/lib/videoSubtitle/calqueDetect";
import { VideoPipelineError } from "@/lib/videoSubtitle/errors";
import { chatModel, getOpenAIClient } from "@/lib/videoSubtitle/openaiClient";
import { asRecord, asString, parseModelJson } from "@/lib/videoSubtitle/parseModelJson";
import {
  contextPayload,
  localeTargetName,
  type SubtitleDraft,
} from "@/lib/videoSubtitle/subtitleDraft";
import type { VideoContext } from "@/lib/videoSubtitle/types";

const BATCH = 10;

function rewriteEmergencySystem(target: string, locale: string): string {
  const koExamples =
    locale === "ko"
      ? `"I'm losing my mind" → "정신 나갈 것 같아" or "미치겠어"
"How would you decide what parts of nature are good or bad?" → "뭐가 좋고 나쁜 건지 어떻게 판단하지?"
`
      : "";
  return `Emergency: write ONE short natural spoken ${target} caption per id.
NEVER leave naturalSubtitle empty.
NEVER use dictionary/word-order calques.
${koExamples}Return a JSON object:
{"revisions":[{"id":"...","naturalSubtitle":"..."}]} — every id required, non-empty.`;
}

function rewritePoliceSystem(target: string, locale: string): string {
  const koCraft =
    locale === "ko"
      ? `HARD RULES — prefer 의역 (what a native would say) over 직역 (word mapping):
- WRONG: "I'm losing my mind" → "내 정신이 지금 나가고 있어"
  RIGHT: "정신 나갈 것 같아" / "미치겠어"
- WRONG: "How would you decide what parts of nature are good or bad?"
  → "자연에서 좋은 것과 나쁜 것을 어떻게 구분하지?"
  RIGHT: "뭐가 좋고 나쁜 건지 어떻게 판단하지?"
- WRONG: "I don't buy that" → "나는 그걸 사지 않아"
  RIGHT: "그건 말도 안 돼"
- Never keep English phrase scaffolding in Korean order.
- Compress into short spoken Korean. Never leave English content words inside Korean captions.
`
      : `HARD RULES — prefer sense-for-sense (what a native would say) over word mapping:
- Never keep source phrase scaffolding in ${target} word order.
- Compress into short spoken ${target}. Never leave source-language content words inside captions.
`;
  return `You police on-screen ${target} video captions for movies/drama.

${koCraft}- Proper names may remain; ordinary vocabulary must not.
- If naturalSubtitle is stiff, literal, textbook, or calque — rewrite it.
- NEVER return an empty caption. Always produce a natural spoken line.
- Sound like spoken ${target} on screen. No tutor notes.

Return a JSON object:
{"revisions":[{"id":"...","naturalSubtitle":"..."}]}
You MUST include every forceRewriteIds entry with a NON-EMPTY naturalSubtitle.
Also revise any other item that still sounds like a dictionary gloss.`;
}

async function rewriteLines(input: {
  client: NonNullable<ReturnType<typeof getOpenAIClient>>;
  locale: string;
  target: string;
  context: VideoContext;
  drafts: SubtitleDraft[];
  revised: Map<string, string>;
  forceIds: string[];
  emergency?: boolean;
}): Promise<void> {
  if (input.drafts.length === 0) return;
  const system = input.emergency
    ? rewriteEmergencySystem(input.target, input.locale)
    : rewritePoliceSystem(input.target, input.locale);

  const completion = await input.client.chat.completions.create({
    model: chatModel(),
    temperature: input.emergency ? 0.75 : 0.55,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      {
        role: "user",
        content: JSON.stringify({
          context: contextPayload(input.context),
          forceRewriteIds: input.forceIds,
          items: input.drafts.map((draft) => ({
            id: draft.id,
            original: draft.original,
            meaning: draft.meaning,
            naturalSubtitle: input.revised.get(draft.id) || draft.naturalSubtitle,
            idiomaticEnglish: looksIdiomaticEnglish(draft.original),
            flaggedLiteral: looksLikeLiteralOrForeignCaption(
              draft.original,
              input.revised.get(draft.id) || draft.naturalSubtitle,
              input.locale,
            ),
            leftoverEnglish: leftoverEnglishContentWords(
              draft.original,
              input.revised.get(draft.id) || draft.naturalSubtitle,
              input.locale,
            ),
          })),
        }),
      },
    ],
  });

  const parsed = asRecord(
    parseModelJson(completion.choices[0]?.message?.content),
  );
  const rows = Array.isArray(parsed?.revisions) ? parsed.revisions : [];
  for (const row of rows) {
    const item = asRecord(row);
    const id = asString(item?.id);
    const natural =
      asString(item?.naturalSubtitle) ?? asString(item?.translation);
    if (id && natural?.trim() && input.revised.has(id)) {
      input.revised.set(id, natural.trim());
    }
  }
}

/**
 * Meaning check + hard ban on 직역체 / literal captions.
 * Calque lines are rewritten — never dropped (empty cues break sync).
 */
export async function validateAdaptedSubtitles(input: {
  locale: string;
  context: VideoContext;
  drafts: SubtitleDraft[];
}): Promise<SubtitleDraft[]> {
  const client = getOpenAIClient();
  if (!client) throw new VideoPipelineError("MISSING_OPENAI_KEY");
  if (input.drafts.length === 0) return [];

  const revised = new Map(
    input.drafts.map((draft) => [draft.id, draft.naturalSubtitle]),
  );
  const target = localeTargetName(input.locale);

  for (let i = 0; i < input.drafts.length; i += BATCH) {
    const batch = input.drafts.slice(i, i + BATCH);
    const forceIds = batch
      .filter((draft) => {
        const text = revised.get(draft.id) || draft.naturalSubtitle;
        return (
          !text.trim() ||
          looksLikeLiteralOrForeignCaption(draft.original, text, input.locale) ||
          looksIdiomaticEnglish(draft.original)
        );
      })
      .map((draft) => draft.id);

    try {
      await rewriteLines({
        client,
        locale: input.locale,
        target,
        context: input.context,
        drafts: batch,
        revised,
        forceIds,
      });
    } catch (error) {
      console.error("[video-adapt-validate]", error);
    }
  }

  // Second pass: still-calque or empty.
  const stillBad = input.drafts.filter((draft) => {
    const text = (revised.get(draft.id) || "").trim();
    return (
      !text ||
      looksLikeLiteralOrForeignCaption(draft.original, text, input.locale)
    );
  });
  if (stillBad.length > 0) {
    for (let i = 0; i < stillBad.length; i += BATCH) {
      const batch = stillBad.slice(i, i + BATCH);
      try {
        await rewriteLines({
          client,
          locale: input.locale,
          target,
          context: input.context,
          drafts: batch,
          revised,
          forceIds: batch.map((draft) => draft.id),
          emergency: true,
        });
      } catch (error) {
        console.error("[video-adapt-calque-rewrite]", error);
      }
    }
  }

  // Per-line emergency: never ship empty. Prefer natural rewrite over silence.
  for (const draft of input.drafts) {
    let natural = (revised.get(draft.id) || draft.naturalSubtitle).trim();
    const bad =
      !natural ||
      looksLikeLiteralOrForeignCaption(draft.original, natural, input.locale);
    if (!bad) continue;
    try {
      await rewriteLines({
        client,
        locale: input.locale,
        target,
        context: input.context,
        drafts: [draft],
        revised,
        forceIds: [draft.id],
        emergency: true,
      });
      natural = (revised.get(draft.id) || "").trim();
    } catch (error) {
      console.error("[video-adapt-calque-emergency]", error);
    }
    // Last resort: keep meaning if it's already in the UI language; else a short spoken fallback.
    if (!natural) {
      const meaning = (draft.meaning || "").trim();
      if (input.locale === "ko" && /[가-힣]/.test(meaning)) {
        natural = meaning;
      } else if (input.locale === "ko" && looksIdiomaticEnglish(draft.original)) {
        // Safe spoken fallback for the known failure case — better than blank.
        if (/\blosing my mind|lose my mind|lost my mind\b/i.test(draft.original)) {
          natural = "정신 나갈 것 같아.";
        } else {
          natural = draft.original;
        }
      } else if (meaning) {
        natural = meaning;
      } else {
        natural = draft.original;
      }
      console.error("[video-adapt-calque-fallback]", {
        id: draft.id,
        original: draft.original,
        fallback: natural,
      });
      revised.set(draft.id, natural);
    } else if (
      looksLikeLiteralOrForeignCaption(draft.original, natural, input.locale)
    ) {
      // Still calque but non-empty — keep it rather than dropping the cue.
      console.error("[video-adapt-calque-kept]", {
        id: draft.id,
        original: draft.original,
        kept: natural,
      });
    }
  }

  return input.drafts.map((draft) => ({
    ...draft,
    naturalSubtitle: (revised.get(draft.id) || draft.naturalSubtitle).trim(),
  }));
}
