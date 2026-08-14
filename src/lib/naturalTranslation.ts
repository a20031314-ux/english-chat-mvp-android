export const TRANSLATION_SOURCE_TYPES = [
  "conversation",
  "report",
  "example",
  "web",
  "community",
  "social",
  "subtitle",
  "formal",
  "unknown",
] as const;

export type TranslationSourceType = (typeof TRANSLATION_SOURCE_TYPES)[number];

export function asTranslationSourceType(value: unknown): TranslationSourceType {
  return typeof value === "string" &&
    (TRANSLATION_SOURCE_TYPES as readonly string[]).includes(value)
    ? (value as TranslationSourceType)
    : "unknown";
}

export function inferTranslationSourceType(url?: string | null): TranslationSourceType {
  if (!url) return "web";
  const lower = url.toLowerCase();
  if (lower.includes("reddit")) return "community";
  if (
    lower.includes("twitter.com") ||
    lower.includes("://x.com") ||
    lower.includes("instagram.com") ||
    lower.includes("tiktok.com") ||
    lower.includes("threads.net")
  ) {
    return "social";
  }
  return "web";
}

export type TranslationRole =
  | "utterance"
  | "gloss"
  | "example"
  | "meaning-in-context";

const SOURCE_HINT: Record<TranslationSourceType, string> = {
  conversation: "Spoken chat. Match the English register. Casual → 반말/구어, not a polite tutor.",
  report: "Learner English from a session. Keep their intent; do not polish them into a different person.",
  example: "A teaching example. Still sound like a real person would say it.",
  web: "Web/article English. Register may be newsy or casual.",
  community: "Forum/comment English. Slang, sarcasm, memes, and emoji are possible — never assumed.",
  social: "Social/SNS English. Abbreviations and tone markers are possible — never assumed.",
  subtitle: "Theatrical / streaming subtitle. Sense-for-sense, short enough to read on screen, spoken register — not a textbook gloss of each word.",
  formal: "More careful English. Keep a natural formal register; do not make it slangy.",
  unknown: "Register unknown. Infer only from the line and nearby context.",
};

/**
 * Shared English → learner-language translation principles.
 * Output schema stays with each caller; this only governs how meaning is rendered.
 */
export function naturalTranslationPrinciples(options: {
  locale: string;
  role: TranslationRole;
  sourceType?: TranslationSourceType;
}): string {
  const sourceType = options.sourceType ?? "unknown";
  const sourceHint = SOURCE_HINT[sourceType];
  const korean =
    options.locale === "ko"
      ? `

Korean rendering:
- Prefer Korean a speaker would actually say. Drop repeated subjects when natural.
- Casual English → 구어. Formal English → 자연스러운 격식체. Internet comments → 필요할 때만 커뮤니티 말투.
- 해요체 vs 반말: match the English register, not a tutor voice. Casual chat ("That sucks", "Dude", "gonna") → 반말. Polite/professional English → 해요체/격식체.
- Keep loanwords Koreans actually use (루틴, 스플릿, 유산소). Do not unpack them into textbook paraphrases.
- Emoji: 💀 in jokes/comments may be 황당/웃김, not death. Render the reaction (ㅋㅋ) only when that is clearly the use.
- Profanity: keep force. "That's fucking amazing" → "와 그거 진짜 미쳤다". "Damn, I totally screwed that up." → "아, 나 그거 완전 망쳤네." Do not invent harsher Korean swearing, and do not sanitize a real insult into textbook Korean ("그것은 형편없다").
- Humor: keep the joke. Do not add a new joke that was not in the English.
`
      : "";

  const roleHint =
    options.role === "gloss"
      ? `This is a SHORT gloss of a word/phrase as a unit. Not a full sentence. Not a word-by-word gloss of each piece ("look forward to" ≠ look + forward + to). If slang is the usual learner lookup, say that meaning; do not invent a meme reading without a sentence.`
      : options.role === "meaning-in-context"
        ? `This is ONE short natural rendering of THIS use in THIS sentence. No lecture. No extra senses. Analysis of why belongs in other fields.`
        : options.role === "example"
          ? `Translate the example as a standalone spoken line. Same tone as the English example.`
          : `This is a full-line translation for quick understanding. No translator notes.`;

  return `Translation goal: render what the speaker is actually doing with this English — meaning, intent, tone, and force — as a natural ${options.locale === "ko" ? "Korean" : "target-language"} line. Not English words mapped onto target words.

Order of thought: context → intent/speech-act → idiom/phrasal/slang? → tone/emotion → natural line.
${roleHint}
Source hint (auxiliary only, never a rule that "everything is slang"): ${sourceHint}

Do:
- Prefer natural paraphrase that a native would say in the same situation.
- Keep speech-act: request stays a request ("Could you open the window?" → ask them to open it, not "are you able to").
- Treat idioms, phrasal verbs, and collocations as units (end up, come across, last straw, wrap my head around).
- Judge slang/memes from THIS sentence + neighbors. "I'm cooked" vs "The chicken is cooked" vs "Let him cook" are different.
- Keep hedges, certainty, polarity, and attitude. Do not add or drop the closing question.
- If context is too thin to claim sarcasm or a brand-new meme, stay with the reading the sentence itself supports. Do not guess trendy slang.

Do not:
- Calque English word order ("그것은 정말 나의 것이 아니다").
- Add meaning, soften or amp emotion, or flip positive/negative to "sound nicer".
- Split a phrasal/idiom into dictionary parts.
- Put explanations, labels, or quotes in the translation itself. Translation = quick understanding. Why it means that = analysis fields.

Self-check before returning: same core meaning and attitude; right reading for this context; no leftover English syntax; natural spoken target language; no invented extra idea.
${korean}`;
}
