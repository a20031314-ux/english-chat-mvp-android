import type { VideoContext } from "@/lib/videoSubtitle/types";

/** A news report keeps one register throughout, whoever is speaking. */
function isNewsGenre(context: VideoContext): boolean {
  const haystack = `${context.domain ?? ""} ${context.speakerStyle ?? ""}`.toLowerCase();
  return /\bnews\b|current affairs|broadcast|anchor|newsroom|bulletin|reporter|correspondent/.test(
    haystack,
  );
}

/**
 * Tell caption models to match the video's speech genre
 * (commentary vs news vs chat), not a generic drama-subtitle voice.
 */
export function speechRegisterHint(
  context: VideoContext,
  interfaceLanguage: string,
): string {
  const ko = interfaceLanguage === "ko" || interfaceLanguage.startsWith("ko");
  const news = isNewsGenre(context);
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

  /**
   * What a news programme does with the people it interviews.
   *
   * Reported from the app: a news video's Korean came out 반말. Run end to
   * end, the anchor's lines were 격식체 and every quoted speaker's line was
   * not — "일자리는 항상 진화해 왔어요", "예전에는 그렇게 했었죠" — because two
   * of the rules above both apply to a news programme carrying interviews,
   * and the one telling it to follow each speaker won the line.
   *
   * Broadcast subtitling does not do that. A guest speaking loosely is still
   * subtitled in the programme's register, so the report reads as one piece.
   * Said here only for news, so a talk show or a podcast still follows the
   * people in it, and the line below that tells a caption to follow its own
   * register is withdrawn for news for the same reason.
   */
  const newsLock = news
    ? ko
      ? `

This video is a news programme. One register for the whole of it: 앵커, 리포트,
인터뷰, 현장 발언 전부 격식체("했습니다", "말했습니다")로 씁니다. 인터뷰 대상이
편하게 말해도 자막은 격식체입니다 — 방송 자막이 그렇게 합니다. 반말과 해요체는
쓰지 마세요. 말의 세기나 농담은 어휘로 살리고, 말투를 낮춰서 살리지 마세요.`
      : `

This video is a news programme. Keep ONE register across the whole of it —
anchor, report, interview and soundbite alike — the way a broadcaster
subtitles. A guest speaking loosely is still subtitled in the programme's
register. Keep the force and the humour in the wording, not by dropping the
register.`
    : "";

  const followLine = news
    ? "Everything in this report keeps the register above, including lines that were said casually."
    : "If THIS line is clearly a different register (a joke in a news show, a chat in the studio), follow the line.";

  return `Speech genre (this WHOLE video):
domain: ${context.domain || "unknown"}
speakerStyle: ${context.speakerStyle || "spoken"}
topic: ${context.topic || ""}
summary: ${(context.summary || "").slice(0, 280)}

Write captions in THAT genre's voice. Do NOT default to movie/drama subtitles or a tutor voice.
${examples}${newsLock}
${followLine}`;
}
