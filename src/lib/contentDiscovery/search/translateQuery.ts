import type OpenAI from "openai";
import {
  learningLanguageName,
  type LearningLanguageCode,
} from "@/lib/learningLanguages";

import { chatModel } from "@/lib/server/openai";

/**
 * Turn whatever the user typed into a YouTube query in the learning language.
 * Does not invent topics or extra keywords.
 */
export async function translateYoutubeQuery(
  client: OpenAI | null,
  rawQuery: string,
  language: LearningLanguageCode,
): Promise<string> {
  const query = rawQuery.replace(/\s+/g, " ").trim();
  if (!query) return query;
  if (!client) return query;

  const languageName = learningLanguageName(language);
  try {
    const completion = await client.chat.completions.create({
      model: chatModel(),
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `You convert a learner's search box text into a YouTube search query in ${languageName}.

Return ONLY the query string. No quotes. No explanation.

Rules:
- Write it the way a native ${languageName} speaker would type into YouTube.
- Keep the same meaning and specificity.
- If it is already in ${languageName}, return it unchanged.
- Do NOT add the language name (no "English", "Korean", "in Spanish").
- Do NOT add extra words like "video", "learn", "for beginners" unless the user wrote them.
- Keep it short enough to search: a phrase, not a paragraph.`,
        },
        { role: "user", content: query },
      ],
    });
    const translated = completion.choices[0]?.message?.content
      ?.replace(/^["'\s]+|["'\s]+$/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return translated || query;
  } catch (error) {
    console.error("[content-discovery/translate-query]", error);
    return query;
  }
}
