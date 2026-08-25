import {
  explanationLanguageGuard,
  interfaceLanguageDisplayName,
} from "../languageLearningAnalysis.ts";
import type {
  AnalysisDimension,
  DimensionCall,
  DimensionPromptContext,
} from "./types.ts";

const DIMENSION_ROLE: Record<AnalysisDimension, string> = {
  syntax:
    "Only THIS span's slot in THIS sentence (complements, auxiliary chain, what it attaches to). Do not define the word, conjugate it, or give extra examples.",
  usageInContext:
    "Only typical situations vs why this wording was chosen HERE. Do not recap inflection, word-origin, or a dictionary gloss.",
  phonology:
    "Only a pronunciation change in this span. If nothing actually changes, reply SKIP.",
  morphology:
    "Only the shape: stem vs ending / irregular form. One form fact. No usage lecture, no extra example sentence, no origin story.",
  pragmatics:
    "Only register, politeness, or interpersonal nuance. If the span is socially neutral, reply SKIP.",
  etymology:
    "Only a memorable origin of an idiom or frozen chunk. Irregular verb forms, participles, and plain vocabulary have no origin note — reply SKIP.",
};

const DIMENSION_ROLE_KO: Record<AnalysisDimension, string> = {
  syntax:
    "이 문장 안에서 이 표현이 어디에 붙는지(보어, 조동사 연쇄)만 한국어로. 뜻을 풀거나 활용을 설명하거나 예문을 만들지 마세요.",
  usageInContext:
    "이런 말을 언제 쓰는지, 이 문장에서 왜 이 형태인지만 한국어로. 불규칙 활용이나 어원을 반복하지 마세요.",
  phonology:
    "이 구에서 실제로 일어나는 발음 변화만. 없으면 SKIP.",
  morphology:
    "형태만: 어간/어미, 불규칙 모양. 한 가지 형태 사실만. 쓰임 설명, 예문, 유래는 쓰지 마세요.",
  pragmatics:
    "말투·높임·친소 관계만. 평범한 표현이면 SKIP.",
  etymology:
    "관용구나 덩어리의 유래가 기억에 도움이 될 때만. 불규칙 동사·분사·평범한 단어는 SKIP.",
};

function dimensionRole(
  dimension: AnalysisDimension,
  explanationLanguage: string,
): string {
  if (explanationLanguage === "ko") return DIMENSION_ROLE_KO[dimension];
  return DIMENSION_ROLE[dimension];
}

function outputLock(ctx: DimensionPromptContext): string {
  const explanationName = interfaceLanguageDisplayName(ctx.explanationLanguage);
  const fewShot =
    ctx.explanationLanguage === "ko"
      ? `GOOD: 「勉強する」는 '공부하다'라는 뜻입니다. 친구에게 쓰는 편한 말투입니다.
BAD: 「勉強する」は普通体です。SOV. 勉強 (benkyou) + する (suru).`
      : `GOOD: a short explanation entirely in ${explanationName}, with ${ctx.languageName} quoted.
BAD: switching into ${ctx.languageName} or English acronyms mid-paragraph.`;
  const koLock =
    ctx.explanationLanguage === "ko"
      ? `
마지막 규칙: 설명 문장은 전부 한국어로만 쓰세요. 일본어 절(です/ます/という)과 영어(SOV, benkyou, suru)는 금지입니다. 학습 언어는 「」 안의 인용만 허용합니다.`
      : "";

  return `OUTPUT LANGUAGE LOCK (overrides everything above):
- Write EVERY sentence in ${explanationName}.
- Quote ${ctx.languageName} forms only inside quotes or 「」. Do not write ${ctx.languageName} clauses.
- Do not paste English hint labels (SOV, SVO) or Latin romaji.
${fewShot}
- Prefer a short ${explanationName} explanation. SKIP this dimension when you have nothing unique (etymology for a plain/irregular form, phonology with no sound change, neutral pragmatics). Do not SKIP only because the span is written in ${ctx.languageName}.
- Do not translate the whole sentence. Do not invent examples unless one short one makes the pattern reusable.${koLock}`;
}

export function buildDimensionPrompt(
  dimension: AnalysisDimension,
  ctx: DimensionPromptContext,
): string {
  const focus =
    ctx.focus.length > 0
      ? ctx.focus.map((item) => `- ${item}`).join("\n")
      : "- whatever is actually at issue in this span";
  const tags = ctx.signalTags.length > 0 ? ctx.signalTags.join(", ") : "(none)";
  const explanationName = interfaceLanguageDisplayName(ctx.explanationLanguage);
  const nativeName = interfaceLanguageDisplayName(ctx.nativeLanguage);
  const wordOrderExample =
    ctx.explanationLanguage === "ko"
      ? " (for example 주어-목적어-동사)"
      : ctx.explanationLanguage === "en"
        ? " (for example subject-object-verb)"
        : "";
  const guard = explanationLanguageGuard({
    interfaceLanguage: ctx.explanationLanguage,
    fieldsDescription: "every sentence of this reply",
    learningLanguage: ctx.language,
  });
  const siblings = (ctx.siblingDimensions ?? []).filter((item) => item !== dimension);
  const siblingLine =
    siblings.length > 0
      ? `Other sections being written separately (do not repeat their facts): ${siblings.join(", ")}.`
      : "";

  return `You are a ${ctx.languageName} learning assistant.
${guard}
The learner's native language is ${nativeName}. Contrast with it only when it clarifies, and still write that contrast in ${explanationName}.

Dimension: ${dimension}
${dimensionRole(dimension, ctx.explanationLanguage)}
${siblingLine}

Language-profile focus for this dimension (internal analyst hints — rewrite in ${explanationName}; never paste these labels):
${focus}

Full sentence:
${ctx.sentence}

Span to analyze:
${ctx.spanText}

Salience tags from the scanner (hints, not a checklist): ${tags}

Rules:
- 1–3 short sentences in ${explanationName} that only this dimension owns. No bullet dump.
- Quote ${ctx.languageName} forms in quotes or 「」. Do not write explanation sentences in ${ctx.languageName}.
- Analyze ${ctx.languageName} in its own terms. If you mention word order, say it in ${explanationName}${wordOrderExample}, not as an English acronym dump like SOV.
- Language-profile focus items above are hints for you; rewrite them in ${explanationName}. Do not paste English hint labels into the reply.

${outputLock(ctx)}`;
}

export function buildAllDimensionPrompts(
  dimensions: AnalysisDimension[],
  ctx: Omit<DimensionPromptContext, "focus"> & {
    focusByDimension: Partial<Record<AnalysisDimension, string[]>>;
  },
): DimensionCall[] {
  return dimensions.map((dimension) => ({
    dimension,
    explanationLanguage: ctx.explanationLanguage,
    learningLanguage: ctx.language,
    prompt: buildDimensionPrompt(dimension, {
      ...ctx,
      siblingDimensions: dimensions,
      focus: ctx.focusByDimension[dimension] ?? [],
    }),
  }));
}
