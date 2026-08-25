import type { VideoContext } from "@/lib/videoSubtitle/types";

/**
 * Tell caption models to match the video's speech genre
 * (commentary vs news vs chat), not a generic drama-subtitle voice.
 */
export function speechRegisterHint(
  context: VideoContext,
  interfaceLanguage: string,
): string {
  const ko = interfaceLanguage === "ko" || interfaceLanguage.startsWith("ko");
  const examples = ko
    ? `- Sports play-by-play (축구·야구 해설 등) → 현장 해설체. "때렸습니다", "들어갑니다", "골입니다". Not drama 반말, not a textbook.
- News / current affairs → 뉴스 앵커·리포트 격식체 ("했습니다", "밝혔습니다").
- Casual vlog, friends, daily chat → 구어 반말, 추임새.
- Tutorial / lecture / explainer → 강연·설명 말투(해요체). 화자가 직접 하는 말. "~에 대해 설명하고 있어요" 같은 중계는 금지.
- Interview / talk show / podcast → follow each speaker (host vs guest).
- Drama / movie / trailer → 그 배역이 실제로 할 말.`
    : `- Sports play-by-play → live commentator voice, not casual chat and not news-anchor unless it is studio talk.
- News / current affairs → news register.
- Casual vlog / friends / daily chat → spoken casual.
- Tutorial / lecture / explainer → clear explainer voice.
- Interview / talk / podcast → follow each speaker.
- Drama / movie / trailer → character speech.`;

  return `Speech genre (this WHOLE video):
domain: ${context.domain || "unknown"}
speakerStyle: ${context.speakerStyle || "spoken"}
topic: ${context.topic || ""}
summary: ${(context.summary || "").slice(0, 280)}

Write captions in THAT genre's voice. Do NOT default to movie/drama subtitles or a tutor voice.
${examples}
If THIS line is clearly a different register (a joke in a news show, a chat in the studio), follow the line.`;
}
