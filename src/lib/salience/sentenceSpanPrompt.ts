/**
 * Sentence-tab "분석하기" prompt: one call, language-profile sections.
 *
 * Replaces the generic grammar blob (why / general / inThisSentence) for a
 * learner-selected span. Does not pick spans — the user already did.
 * Word-tab dictionary lookup stays on the existing vocab path.
 */

import {
  explanationLanguageGuard,
  interfaceLanguageDisplayName,
} from "../languageLearningAnalysis.ts";
import { dimensionRole } from "./dimensionPrompts.ts";
import {
  getLanguageProfile,
  languageDisplayName,
} from "./languageProfiles.ts";
import { dropRedundantDimensions } from "./runDimensions.ts";
import type {
  AnalysisDimension,
  ExampleSentence,
  LanguageProfile,
  LearnerLevel,
} from "./types.ts";

export type SentenceSpanPromptInput = {
  sentence: string;
  spanText: string;
  language: string;
  nativeLanguage: string;
  explanationLanguage?: string;
  translation?: string;
  learnerLevel?: LearnerLevel;
  signalTags?: string[];
};

export type SentenceSpanAnalysis = {
  selectedText: string;
  contextSentence: string;
  meaningInContext: string;
  reading?: string;
  dimensionResults: Partial<Record<AnalysisDimension, string>>;
  examples: ExampleSentence[];
  calledDimensions: AnalysisDimension[];
};

function levelHint(level: LearnerLevel | undefined): string {
  if (level === "beginner") {
    return "Learner level: beginner. Prefer the one fact that unlocks this span. Skip subtle register unless missing it would misread the line.";
  }
  if (level === "advanced") {
    return "Learner level: advanced. Prefer non-obvious slot, register, or form. Skip elementary labels.";
  }
  if (level === "intermediate") {
    return "Learner level: intermediate. Prefer reusable pattern and why this wording, not a dictionary gloss.";
  }
  return "Learner level unknown. Prefer what a translation of the span does not already make obvious.";
}

function keepDimensionText(text: string): string | null {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed || /^skip$/i.test(trimmed)) return null;
  return trimmed;
}

function asLine(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function jsonFieldList(dimensions: AnalysisDimension[]): string {
  const dimensionFields = dimensions
    .map((dimension) => `  "${dimension}": "1–3 short sentences, or SKIP"`)
    .join(",\n");
  return `{
  "selectedText": "exact selected span",
  "contextSentence": "the full sentence",
  "meaningInContext": "one short line: what THIS span means HERE",
  "reading": "optional pronunciation/reading; omit if unused",
${dimensionFields},
  "examples": [
    {"sentence": "NEW sentence in the learning language", "meaning": "natural UI-language gloss"}
  ]
}`;
}

function sectionBlock(
  profile: LanguageProfile,
  explanationLanguage: string,
  explanationName: string,
): string {
  return profile.activeDimensions
    .map((dimension) => {
      const focus = profile.dimensionFocus[dimension] ?? [];
      const focusLines =
        focus.length > 0
          ? focus.map((item) => `    - ${item}`).join("\n")
          : "    - whatever is actually at issue in this span";
      return `### ${dimension}
Role: ${dimensionRole(dimension, explanationLanguage)}
Internal analyst hints (rewrite in ${explanationName}; never paste these labels into the reply):
${focusLines}`;
    })
    .join("\n\n");
}

function outputLock(options: {
  explanationLanguage: string;
  languageName: string;
  activeDimensions: AnalysisDimension[];
}): string {
  const explanationName = interfaceLanguageDisplayName(
    options.explanationLanguage,
  );
  const fewShot =
    options.explanationLanguage === "ko"
      ? `GOOD meaningInContext: 잊어버리고 말았다.
GOOD morphology: 「てしまう」의 과거형이라서 이미 끝난 일을 아쉬워합니다.
GOOD pragmatics: 실수·후회를 부드럽게 인정하는 말투입니다.
BAD: 「てしまった」は後悔を表す普通体です. SOV. te-shimau.`
      : `GOOD: every learner-facing sentence in ${explanationName}, with ${options.languageName} quoted.
BAD: switching into ${options.languageName} or English acronyms mid-paragraph.`;
  const koLock =
    options.explanationLanguage === "ko"
      ? `
마지막 규칙: 설명 문장은 전부 한국어로만 쓰세요. meaningInContext·각 차원·예문 뜻도 한국어입니다. 일본어 절(です/ます/という)과 영어(SOV, benkyou, suru)는 금지입니다. 학습 언어는 「」 안의 인용만 허용합니다.`
      : "";
  const skipBits: string[] = [];
  if (options.activeDimensions.includes("etymology")) {
    skipBits.push("etymology for a plain/irregular form");
  }
  if (options.activeDimensions.includes("phonology")) {
    skipBits.push("phonology with no sound change");
  }
  if (options.activeDimensions.includes("pragmatics")) {
    skipBits.push("neutral pragmatics");
  }
  const skipLine =
    skipBits.length > 0
      ? `Put SKIP in a dimension when you have nothing unique (${skipBits.join(", ")}).`
      : "Put SKIP in a dimension when you have nothing unique.";

  return `OUTPUT LANGUAGE LOCK (overrides everything above):
- Write EVERY learner-facing sentence in ${explanationName}.
- Quote ${options.languageName} forms only inside quotes or 「」. Do not write ${options.languageName} clauses.
- Do not paste English hint labels (SOV, SVO) or Latin romaji.
${fewShot}
- Prefer a short ${explanationName} explanation. ${skipLine} Do not SKIP only because the span is written in ${options.languageName}.
- Never SKIP meaningInContext.
- Do not translate the whole sentence. Do not invent examples unless one short one makes the pattern reusable.${koLock}`;
}

/**
 * System prompt for sentence-tab range analyze.
 * Injects that language's activeDimensions + dimensionFocus. No language if-fork.
 */
export function buildSentenceSpanPrompt(input: SentenceSpanPromptInput): string {
  const profile = getLanguageProfile(input.language);
  const explanationLanguage = input.explanationLanguage ?? input.nativeLanguage;
  const explanationName = interfaceLanguageDisplayName(explanationLanguage);
  const languageName = languageDisplayName(input.language);
  const nativeName = interfaceLanguageDisplayName(input.nativeLanguage);
  const wordOrderExample =
    explanationLanguage === "ko"
      ? " (for example 주어-목적어-동사)"
      : explanationLanguage === "en"
        ? " (for example subject-object-verb)"
        : "";
  const guard = explanationLanguageGuard({
    interfaceLanguage: explanationLanguage,
    fieldsDescription:
      "meaningInContext, every dimension string, reading labels, and example meanings",
    learningLanguage: input.language,
  });
  const siblings = profile.activeDimensions.join(", ");
  const tags =
    input.signalTags && input.signalTags.length > 0
      ? input.signalTags.join(", ")
      : "(none)";
  const fullTranslation = input.translation?.replace(/\s+/g, " ").trim();
  const translationBlock = fullTranslation
    ? `The learner already sees this translation of the FULL sentence. Do not retell it in meaningInContext:
${fullTranslation}
`
    : "";

  return `You explain ONE learner-selected span inside ONE ${languageName} sentence.

This is the sentence-analysis tab after the learner highlighted a range and tapped Analyze.
They chose the span. Do not pick a different span. Do not analyze every word in the sentence.

Write learner-facing text in ${explanationName}.
${guard}
The learner's native language is ${nativeName}. Contrast with it only when it clarifies, and still write that contrast in ${explanationName}.
${levelHint(input.learnerLevel)}

Analyze ${languageName} in its own terms. If you mention word order, say it in ${explanationName}${wordOrderExample}, not as an English acronym dump like SOV.
Language-profile hints below are for you; rewrite them in ${explanationName}. Do not paste English hint labels into the reply.

${translationBlock}Full sentence:
${input.sentence}

Span to analyze:
${input.spanText}

Salience tags from a scanner, if any (hints, not a checklist): ${tags}

1) meaningInContext
ONLY what THIS selected span means in THIS sentence. One short natural line. Not a paraphrase of the whole sentence. Not a dictionary list. No lecture. No extra senses. Analysis of why belongs in the dimension sections.

2) Language-profile sections
Fill ONLY these keys. Other analysis axes are off for ${languageName} — do not invent them.
Each section is 1–3 short sentences that THAT section alone owns. If nothing unique belongs there, set the value to SKIP.
Do not repeat the same fact in two sections. meaningInContext is the gloss; sections are the analysis.

Active sections (do not repeat their facts across keys): ${siblings}.

${sectionBlock(profile, explanationLanguage, explanationName)}

3) examples
0–2 NEW ${languageName} sentences that reuse the same pattern, each with a ${explanationName} meaning.
Omit the array (or use []) if this span has no reusable pattern.
Never copy the context sentence. Never write English example sentences unless the learning language is English.

reading: optional. Only when the script/form itself is a learning target here (kanji reading, pinyin, etc.).

${outputLock({
  explanationLanguage,
  languageName,
  activeDimensions: profile.activeDimensions,
})}

Return ONLY JSON:
${jsonFieldList(profile.activeDimensions)}

Rules:
- Omit unused optional fields. Do not pad.
- meaningInContext is the selected span only.
- Dimension values are prose, not bullet dumps, not textbook titles.
- examples[].sentence MUST be written in ${languageName}.
- examples[].meaning MUST be in ${explanationName}.`;
}

export function parseSentenceSpanAnalysis(
  raw: unknown,
  input: Pick<SentenceSpanPromptInput, "sentence" | "spanText" | "language">,
): SentenceSpanAnalysis | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const meaningInContext =
    asLine(o.meaningInContext) || asLine(o.meaning) || "";
  if (!meaningInContext) return null;

  const profile = getLanguageProfile(input.language);
  const dimensionResults: Partial<Record<AnalysisDimension, string>> = {};
  for (const dimension of profile.activeDimensions) {
    const kept = keepDimensionText(asLine(o[dimension]));
    if (kept) dimensionResults[dimension] = kept;
  }

  const examples: ExampleSentence[] = [];
  if (Array.isArray(o.examples)) {
    for (const item of o.examples) {
      if (!item || typeof item !== "object") continue;
      const row = item as Record<string, unknown>;
      const sentence =
        asLine(row.sentence) || asLine(row.english) || asLine(row.text);
      const meaning = asLine(row.meaning) || asLine(row.translation);
      if (!sentence || !meaning) continue;
      examples.push({ sentence, meaning });
      if (examples.length >= 2) break;
    }
  }

  const reading = asLine(o.reading);
  return {
    selectedText: asLine(o.selectedText) || input.spanText,
    contextSentence: asLine(o.contextSentence) || input.sentence,
    meaningInContext,
    ...(reading ? { reading } : {}),
    dimensionResults: dropRedundantDimensions(dimensionResults),
    examples,
    calledDimensions: profile.activeDimensions,
  };
}
