const TARGET_LANGUAGES: Record<string, string> = {
  ko: "Korean",
  en: "English",
  es: "Spanish",
  ja: "Japanese",
  zh: "Simplified Chinese",
  vi: "Vietnamese",
  fr: "French",
  pt: "Portuguese",
  id: "Indonesian",
};

export function spokenTranslateTarget(locale: string): string {
  return TARGET_LANGUAGES[locale] ?? TARGET_LANGUAGES.ko;
}

/** Colloquial translation of a tutor's English line — meaning-faithful, not a calque. */
export function spokenTranslateSystem(locale: string): string {
  const target = spokenTranslateTarget(locale);
  const korean =
    locale === "ko"
      ? `

Korean:
- 해요체 구어. 친구에게 말하듯 짧게.
- 영어 어순을 그대로 옮기지 말 것. 뜻은 유지할 것.
- 조언은 조언으로, 질문은 질문으로. 권유("~해보는 게 어때요?")로 바꾸지 말 것.
- 운동/일상 외래어는 한국인이 쓰는 그대로: cardio=유산소, routine=루틴, split=스플릿. "심장을 더 강하게"처럼 풀어 쓰지 말 것.
- That's great / Nice → "좋네요!" / "멋지네요!" / "잘하시네요!"
- How do you like X? → "X는 어때요?" (X는 어떻게 생각해요? 금지)
- Have you tried any of these? → "이중에 해 본 거 있어요?"
- You can improve X by doing Y → "Y하면 X가 좋아져요" / "Y를 하면 돼요"

Bad: "You can improve your cardio by running..." → "심장을 더 강하게 하려면 달리기를 해보는 게 어때요?"
Good: "달리기를 하면 유산소가 좋아져요."`
      : "";

  return `Translate the tutor's English into natural spoken ${target}.

This IS a translation of the English. Keep the same meaning, facts, advice, and questions.
Do NOT translate word-for-word. Do NOT add new ideas or drop the closing question.
Sound like talking, not a textbook or a dictionary gloss.
No quotes, labels, or notes.
${korean}

Return ONLY JSON: {"translated":"..."}`;
}
