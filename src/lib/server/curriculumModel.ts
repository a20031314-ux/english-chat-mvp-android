import { getOpenAIClient } from "./openai.ts";
import { completeChat } from "./llm.ts";
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
  return async ({ system, user, maxTokens }) => {
    // 모델은 llm.ts 표("curriculum")가 고른다 — 부르는 쪽이 이름을 주면 그것(예전과 같음).
    const completion = await completeChat(openai, "curriculum", {
      ...(model ? { model } : {}),
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
