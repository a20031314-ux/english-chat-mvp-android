import { explanationLooksMixedLanguage, interfaceLanguageDisplayName } from "../languageLearningAnalysis.ts";
import { chatModel, getOpenAIClient } from "../videoSubtitle/openaiClient.ts";
import { languageDisplayName } from "./languageProfiles.ts";
import type { DimensionCall } from "./types.ts";

function extractJsonObject(raw: string): unknown {
  const trimmed = raw.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(trimmed.slice(start, end + 1));
  } catch {
    return null;
  }
}

export async function completeJsonPrompt(prompt: string): Promise<unknown> {
  const openai = getOpenAIClient();
  if (!openai) throw new Error("MISSING_OPENAI_KEY");
  const completion = await openai.chat.completions.create({
    model: chatModel(),
    messages: [
      {
        role: "system",
        content: "Return ONLY valid JSON. No markdown.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });
  const raw = completion.choices[0]?.message?.content ?? "";
  return extractJsonObject(raw);
}

function dimensionSystemMessage(call: DimensionCall): string {
  const explanationName = interfaceLanguageDisplayName(call.explanationLanguage);
  const learningName = languageDisplayName(call.learningLanguage);
  return `You write learner-facing explanations in ${explanationName} only. Quote ${learningName} forms inside 「」 or quotes. No English acronyms, no Latin romaji, no ${learningName} sentences. Always analyze the span in the user message — do not reply SKIP just because the span is in ${learningName}.`;
}

function dimensionRetrySuffix(call: DimensionCall): string {
  const explanationName = interfaceLanguageDisplayName(call.explanationLanguage);
  return `The previous draft mixed languages. Rewrite EVERY sentence in ${explanationName} only. Keep source forms inside quotes. Delete learning-language clauses, English acronyms (SOV), and Latin romaji. Do not reply SKIP; rewrite the explanation.`;
}

function isSkipReply(text: string): boolean {
  return !text.trim() || /^skip\b/i.test(text.trim());
}

async function runDimensionCompletion(
  openai: NonNullable<ReturnType<typeof getOpenAIClient>>,
  system: string,
  user: string,
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: chatModel(),
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.3,
  });
  return (completion.choices[0]?.message?.content ?? "").trim();
}

export async function completeDimensionPrompt(call: DimensionCall): Promise<string> {
  const openai = getOpenAIClient();
  if (!openai) throw new Error("MISSING_OPENAI_KEY");
  const system = dimensionSystemMessage(call);
  const first = await runDimensionCompletion(openai, system, call.prompt);
  if (
    !explanationLooksMixedLanguage(
      first,
      call.explanationLanguage,
      call.learningLanguage,
    )
  ) {
    return first;
  }
  const retry = await runDimensionCompletion(
    openai,
    system,
    `${call.prompt}\n\n${dimensionRetrySuffix(call)}`,
  );
  if (isSkipReply(retry) && !isSkipReply(first)) return first;
  return retry;
}
