import { chatModel, getOpenAIClient } from "../videoSubtitle/openaiClient.ts";
import { parseModelJson } from "../videoSubtitle/parseModelJson.ts";
import type { JsonCompleter } from "./types.ts";

export function openAiJsonCompleter(): JsonCompleter {
  const client = getOpenAIClient();
  if (!client) {
    throw new Error("MISSING_OPENAI_KEY");
  }
  return async (system, user) => {
    const completion = await client.chat.completions.create({
      model: chatModel(),
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });
    return parseModelJson(completion.choices[0]?.message?.content);
  };
}
