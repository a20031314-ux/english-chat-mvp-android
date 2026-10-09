import { getOpenAIClient } from "./openai.ts";
import type { CurriculumModel } from "../curriculum/engine/generate.ts";

/**
 * The curriculum engine's model, on OpenAI.
 *
 * The engine takes any function from prompt to reply text; this is the one the
 * API routes use. The model name is a setting (OPENAI_CURRICULUM_MODEL, as the
 * generate route already reads), so moving the map to another model or
 * provider is a change here and nowhere else.
 *
 * Returns null without a key, so a route can answer MISSING_OPENAI_KEY the way
 * the others do.
 */
export function openAICurriculumModel(model?: string): CurriculumModel | null {
  const openai = getOpenAIClient();
  if (!openai) return null;
  const name = model ?? (process.env.OPENAI_CURRICULUM_MODEL?.trim() || "gpt-4.1");
  return async ({ system, user, maxTokens }) => {
    const completion = await openai.chat.completions.create({
      model: name,
      temperature: 0.4,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });
    return completion.choices[0]?.message?.content ?? "";
  };
}
