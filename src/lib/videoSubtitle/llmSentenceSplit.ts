import { chatModel, getOpenAIClient } from "@/lib/server/openai";
import {
  refineSpansWithLlm,
  splitSentencesFromWords,
} from "@/lib/videoSubtitle/sentenceFromWords";
import {
  flattenSttToTimedWords,
  segmentsFromSentenceSpans,
} from "@/lib/videoSubtitle/timedWords";
import type { SttSegment } from "@/lib/videoSubtitle/types";

const LLM_PROMPT = `다음 텍스트를 자연스러운 문장 단위로 나눠줘.
원문의 단어를 절대 바꾸거나 삭제하지 말고, 문장 사이에만 구분자 ||| 를 삽입해서 반환해줘.
다른 설명, 따옴표, 마크다운은 넣지 마.`;

export async function markSentencesWithLlm(text: string): Promise<string | null> {
  const client = getOpenAIClient();
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!client || !trimmed) return null;
  const completion = await client.chat.completions.create({
    model: chatModel(),
    temperature: 0,
    messages: [
      { role: "system", content: LLM_PROMPT },
      { role: "user", content: trimmed },
    ],
  });
  const marked = completion.choices[0]?.message?.content?.replace(/\s+/g, " ").trim();
  return marked || null;
}

/** Re-slice a regularized transcript with LLM only where punctuation is missing. */
export async function refineSttSentencesWithLlm(
  segments: SttSegment[],
): Promise<SttSegment[]> {
  const words = flattenSttToTimedWords(segments);
  if (words.length === 0) return segments;
  const spans = await refineSpansWithLlm(
    words,
    splitSentencesFromWords(words),
    markSentencesWithLlm,
  );
  return segmentsFromSentenceSpans(words, spans);
}
