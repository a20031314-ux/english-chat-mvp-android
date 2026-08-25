import assert from "node:assert/strict";
import { test } from "node:test";
import { compareTranslationPasses } from "./pipeline.ts";
import { parseMeaningExtraction } from "./parse.ts";
import {
  critiqueTranslationSystem,
  critiqueTranslationUser,
  extractMeaningSystem,
  extractMeaningUser,
  firstInterpretationSystem,
  generateTranslationSystem,
  generateTranslationUser,
  onePassUser,
} from "./prompts.ts";
import type { MeaningExtraction, TranslationContext } from "./types.ts";
import { DEFAULT_SPEECH_TEXTURE } from "./types.ts";

const texture = {
  ...DEFAULT_SPEECH_TEXTURE,
};

function asMeaning(
  partial: Omit<MeaningExtraction, "speechTexture"> &
    Partial<Pick<MeaningExtraction, "speechTexture">>,
): MeaningExtraction {
  return { speechTexture: texture, ...partial };
}

const ctx: TranslationContext = {
  sourceText: "The reason I don't recommend this is because it adds complexity.",
  sourceLang: "en",
  targetLang: "ko",
  sourceType: "subtitle",
  videoContext: "A developer explaining architecture choices on a tutorial video.",
};

test("generate prompt does not include the source sentence (anti-calque)", () => {
  const extracted = asMeaning({
    coreMeaning: "Speaker advises against this option because it makes things more complex.",
    speakerIntent: "advise",
    formalityLevel: "polite",
    speakerRelationship: "public explainer",
    keyEntities: [],
  });
  const generateUser = generateTranslationUser(ctx, extracted);
  assert.equal(generateUser.includes(ctx.sourceText), false);
  assert.match(generateTranslationSystem(ctx), /not mapping words/i);
  assert.match(generateTranslationSystem(ctx), /Split or merge/i);
  assert.match(generateTranslationSystem(ctx), /casual_spoken/);
  assert.match(generateTranslationSystem(ctx), /ON-SCREEN/);
  assert.match(generateTranslationSystem(ctx), /Do not invent facts/);
  assert.match(generateTranslationSystem(ctx), /tidy written sentence/);
  assert.ok(generateUser.includes("speechTexture"));
  assert.doesNotMatch(generateTranslationSystem(ctx), /잖아|것 같아|말 끝/);
});

test("extract prompt forbids producing a target caption", () => {
  assert.match(extractMeaningSystem(ctx), /do not translate/i);
  assert.match(extractMeaningSystem(ctx), /Do NOT write a sentence that could be used as a Korean/);
  assert.match(extractMeaningSystem(ctx), /speechTexture/);
  assert.ok(extractMeaningUser(ctx).includes(ctx.sourceText));
});

test("1-pass still receives the source sentence as the object to translate", () => {
  assert.ok(onePassUser(ctx).includes(ctx.sourceText));
});

test("parseMeaningExtraction fills speechTexture defaults and keeps fillers", () => {
  const fallback = parseMeaningExtraction({
    coreMeaning: "Speaker hedges about starting late.",
  });
  assert.equal(fallback?.speechTexture.registerType, "standard");
  assert.deepEqual(fallback?.speechTexture.fillers, []);
  const parsed = parseMeaningExtraction({
    coreMeaning: "Speaker hedges about starting before the idea is ready.",
    speechTexture: {
      registerType: "casual_spoken",
      fillers: ["I know", "kind of", "I feel like"],
      hasSelfCorrection: true,
      repetitionForEmphasis: ["start"],
      sentenceRhythm: "run_on",
    },
  });
  assert.equal(parsed?.speechTexture.registerType, "casual_spoken");
  assert.deepEqual(parsed?.speechTexture.fillers, [
    "I know",
    "kind of",
    "I feel like",
  ]);
  assert.equal(parsed?.speechTexture.hasSelfCorrection, true);
  assert.equal(parsed?.speechTexture.sentenceRhythm, "run_on");
});

test("compare pipeline logs 1-pass vs reconstructed using injected JSON", async () => {
  let calls = 0;
  const row = await compareTranslationPasses(ctx, async (system) => {
    calls += 1;
    if (system.includes("extract WHAT")) {
      return {
        coreMeaning: "Speaker advises against this option; it would add extra complexity.",
        speakerIntent: "advise",
        formalityLevel: "polite",
        speakerRelationship: "public explainer",
        keyEntities: [],
      };
    }
    if (system.includes("MEANING of something")) {
      return { translated: "이건 괜히 복잡해져서 비추예요." };
    }
    return { translated: "제가 이것을 추천하지 않는 이유는 복잡성을 추가하기 때문입니다." };
  });
  assert.equal(calls, 3);
  assert.match(row.onePass, /추천하지 않는 이유/);
  assert.match(row.reconstructed, /비추/);
  assert.equal(row.critiqued, undefined);
});

test("critique is optional and can rewrite the 2-pass draft", async () => {
  let calls = 0;
  const row = await compareTranslationPasses(
    ctx,
    async (system) => {
      calls += 1;
      if (system.includes("extract WHAT")) {
        return {
          coreMeaning: "Speaker advises against this option.",
          speakerIntent: "advise",
          formalityLevel: "casual",
          speakerRelationship: "public explainer",
          keyEntities: [],
        };
      }
      if (system.includes("MEANING of something")) {
        return { translated: "제가 이것을 추천하지 않는 이유는 복잡성 때문입니다." };
      }
      if (system.includes("review a Korean line")) {
        return { translated: "이건 괜히 복잡해져서 비추예요.", changed: true };
      }
      return { translated: "1-pass" };
    },
    { enableCritique: true },
  );
  assert.equal(calls, 4);
  assert.equal(row.reconstructed, "제가 이것을 추천하지 않는 이유는 복잡성 때문입니다.");
  assert.equal(row.critiqued, "이건 괜히 복잡해져서 비추예요.");
  assert.equal(row.critiqueChanged, true);
});

test("critique prompt may see the source but generate prompt must not", () => {
  const extracted = asMeaning({
    coreMeaning: "Speaker advises against this option.",
    speakerIntent: "advise",
    formalityLevel: "casual",
    speakerRelationship: "public explainer",
    keyEntities: [],
  });
  assert.equal(generateTranslationUser(ctx, extracted).includes(ctx.sourceText), false);
  assert.ok(critiqueTranslationUser(ctx, extracted, "draft").includes(ctx.sourceText));
  assert.match(critiqueTranslationSystem(ctx), /sarcasm was explained/);
  assert.match(critiqueTranslationSystem(ctx), /tidy written prose/);
});

test("first-reading prompt is for analysis, not a caption", () => {
  assert.match(firstInterpretationSystem(ctx), /FIRST READING/i);
  assert.match(firstInterpretationSystem(ctx), /NOT an on-screen caption/);
  assert.ok(firstInterpretationSystem(ctx).includes("discourse frames"));
});

test("batch first reading uses the source line, not the caption", async () => {
  const { firstInterpretationsForAnalysis } = await import("./refineCaptions.ts");
  const readings = await firstInterpretationsForAnalysis(
    { sourceLang: "en", targetLang: "ko", sourceType: "subtitle" },
    [{ id: "a", sourceText: ctx.sourceText }],
    async (_system, user) => {
      assert.ok(user.includes(ctx.sourceText));
      assert.equal(user.includes("괜히 복잡해져"), false);
      return {
        items: [
          {
            id: "a",
            translated: "내가 하고 싶은 말은 이게 꼭 나쁜 접근법은 아니라는 거야.",
          },
        ],
      };
    },
  );
  assert.equal(
    readings.get("a"),
    "내가 하고 싶은 말은 이게 꼭 나쁜 접근법은 아니라는 거야.",
  );
});

test("batch refine returns analysis lines without replacing the caption draft", async () => {
  const { refineCaptionsForAnalysis } = await import("./refineCaptions.ts");
  const refined = await refineCaptionsForAnalysis(
    { sourceLang: "en", targetLang: "ko" },
    [
      {
        id: "a",
        sourceText: ctx.sourceText,
        caption: "괜히 복잡해져서 비추예요.",
        meaning: asMeaning({
          coreMeaning: "Speaker advises against this option.",
          speakerIntent: "advise",
          formalityLevel: "casual",
          speakerRelationship: "public explainer",
          keyEntities: [],
        }),
      },
    ],
    async () => ({
      items: [
        {
          id: "a",
          translated: "제가 이걸 추천하지 않는 이유는 복잡해서예요.",
          changed: true,
        },
      ],
    }),
  );
  assert.equal(
    refined.get("a")?.analysisTranslation,
    "제가 이걸 추천하지 않는 이유는 복잡해서예요.",
  );
  assert.equal(refined.get("a")?.changed, true);
});
