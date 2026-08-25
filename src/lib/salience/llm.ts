import { chatModel, getOpenAIClient } from "../videoSubtitle/openaiClient.ts";
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

export async function completeDimensionPrompt(call: DimensionCall): Promise<string> {
  const openai = getOpenAIClient();
  if (!openai) throw new Error("MISSING_OPENAI_KEY");
  const completion = await openai.chat.completions.create({
    model: chatModel(),
    messages: [{ role: "system", content: call.prompt }],
    temperature: 0.4,
  });
  return (completion.choices[0]?.message?.content ?? "").trim();
}
