/** Stiff “번역투” fingerprints — must never ship as on-screen captions. */
export function looksLikeCalqueKorean(text: string): boolean {
  const t = text.replace(/\s+/g, " ").trim();
  if (!t) return true;
  return (
    /하는 것입니다|라는 것입니다|라고 할 수 있습니다|할 수 있을 것입니다/.test(t) ||
    /제가 말하고자 하는 것은|제가 말하려고 하는 것은|제가 이것을|저는 그것을|당신은 /.test(
      t,
    ) ||
    /그것은 |이것은 |그것에 대해 |이것에 대해 /.test(t) ||
    /하기 때문입니다\.?$|의 경우에는|에 대해 이야기하겠습니다/.test(t) ||
    /을\/를 가지고 있|을 가지고 있지 않|로부터 실제로/.test(t) ||
    /가능성이 없습니다|이해하지 못하겠습니다/.test(t) ||
    /나는 그것을 |나는 이것을 |나는 그렇게 |당신은 그것을 |당신은 이것을 /.test(t) ||
    /정말로 요점이 아닙니다|멀리 가지 않을 것입니다|사지 않습니다/.test(t) ||
    /복잡성을 추가하기 때문|반드시 나쁜 접근|다시 생각하고 싶을지도/.test(t) ||
    /요점을 실제로 이해하지|항상 그렇다고 반드시/.test(t) ||
    // Idiom calque only: "losing my mind" → 정신이 *나가고 있어* (not 나갈 것 같아)
    /내\s*정신(이|을)/.test(t) ||
    /정신(이|을)\s*(지금\s*)?(나가|떠나|빠져)\s*(고\s*있|고있어|고\s*있어|고\s*있는)/.test(
      t,
    ) ||
    /마음을\s*잃|머리를\s*잃|정신을\s*잃(고\s*있|어\s*있|었)/.test(t) ||
    /그걸\s*사지\s*않|그것을\s*사지\s*않|멀리\s*가지\s*않을/.test(t) ||
    // English scaffolding kept in Korean: "A와 B를 어떻게 구분"
    /좋은\s*것과\s*나쁜\s*것을\s*어떻게/.test(t) ||
    /자연에서\s*좋은\s*것과\s*나쁜\s*것/.test(t) ||
    /무엇을\s*좋은\s*것|어떤\s*부분이\s*좋은지/.test(t)
  );
}

/**
 * Reporter recap of the speech act instead of the utterance itself.
 * "중국 AI에 대해 언급하고 있어요" / "Someone is asking about OpenAI"
 */
export function looksLikeNarratorGloss(text: string): boolean {
  const t = text.replace(/\s+/g, " ").trim();
  if (!t) return false;
  if (
    /^(the speaker|someone|the host|the narrator|a speaker|the guest)\b/i.test(t)
  ) {
    return true;
  }
  if (
    /\b(is|are)\s+(now\s+)?(talking|mentioning|asking|explaining|discussing|describing)\b/i.test(
      t,
    )
  ) {
    return true;
  }
  if (/^누군가\s/.test(t)) return true;
  if (/(화자|진행자|사회자|출연자)[는가]\s/.test(t)) return true;
  if (/에\s*대해\s*(이야기|언급|설명|질문|말)하고\s*있/.test(t)) return true;
  if (/(언급|질문)하고\s*있(어|어요|습니다|는)/.test(t)) return true;
  if (/(다|라)고\s*(설명|이야기|언급)하고\s*있/.test(t)) return true;
  return false;
}

/** English lines that almost always need 의역, not word mapping. */
export function looksIdiomaticEnglish(original: string): boolean {
  const t = original.replace(/\s+/g, " ").trim();
  if (!t) return false;
  return (
    /\b(losing my mind|lose my mind|lost my mind|out of my mind)\b/i.test(t) ||
    /\b(don't buy that|wouldn't buy that|i don't buy)\b/i.test(t) ||
    /\b(wouldn't go that far|piece of cake|break a leg|hit the road)\b/i.test(
      t,
    ) ||
    /\b(give me a break|you're kidding|you've got to be kidding|no way)\b/i.test(
      t,
    ) ||
    /\b(what the hell|what the fuck|shut up|come on|seriously)\b/i.test(t) ||
    /\b(hang in there|get out of here|beat it|take it easy)\b/i.test(t) ||
    /\b(i wasn't unconscious|speech!|there you go|that's it)\b/i.test(t)
  );
}

const LATIN_STOP = new Set([
  "that",
  "this",
  "with",
  "from",
  "have",
  "been",
  "were",
  "what",
  "when",
  "where",
  "which",
  "while",
  "your",
  "their",
  "about",
  "into",
  "just",
  "like",
  "them",
  "then",
  "than",
  "also",
  "only",
  "over",
  "such",
  "very",
  "will",
  "would",
  "could",
  "should",
  "there",
  "here",
  "okay",
]);

/** Allowlist: brand / tech / onomatopoeia often kept as-is in Korean captions. */
const LATIN_ALLOW = new Set([
  "ok",
  "okay",
  "wow",
  "omg",
  "lol",
  "ai",
  "api",
  "url",
  "app",
  "web",
  "ios",
  "tv",
  "dna",
  "gps",
]);

/**
 * Content English words (lowercase in original) left inside a caption.
 * e.g. "난 unconscious 아니었어" / "Estoy losing my mind" — must be rewritten.
 * Title-case names (Wade, Deadpool) are allowed to stay.
 */
export function leftoverEnglishContentWords(
  original: string,
  subtitle: string,
  locale = "ko",
): string[] {
  const sub = subtitle.replace(/\s+/g, " ").trim();
  if (!sub) return [];
  if (locale === "en") return [];
  if (locale === "ko" && !/[가-힣]/.test(sub)) return [];
  if (locale === "ja" && !/[\u3040-\u30ff\u3400-\u9fff]/.test(sub)) return [];
  if (locale === "zh" && !/[\u3400-\u9fff]/.test(sub)) return [];

  const leftovers: string[] = [];
  const seen = new Set<string>();
  // Lowercase tokens in the English line ≈ content words, not proper names.
  const matches = original.match(/\b[a-z][a-z']{3,}\b/g) ?? [];
  for (const raw of matches) {
    const word = raw.toLowerCase().replace(/'/g, "");
    if (word.length < 4 || LATIN_STOP.has(word) || LATIN_ALLOW.has(word)) {
      continue;
    }
    if (seen.has(word)) continue;
    if (new RegExp(`\\b${word}\\b`, "i").test(sub)) {
      seen.add(word);
      leftovers.push(word);
    }
  }
  return leftovers;
}

/** Locale captions that are still mostly English / gloss mirrors / mixed leftovers. */
export function looksLikeLiteralOrForeignCaption(
  original: string,
  subtitle: string,
  locale: string,
): boolean {
  const sub = subtitle.replace(/\s+/g, " ").trim();
  if (!sub) return true;
  if (locale === "en") return false;
  if (leftoverEnglishContentWords(original, sub, locale).length > 0) return true;

  const orig = original.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim();
  const subLatin = sub.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim();
  if (orig.length > 8 && subLatin.length > 8 && orig === subLatin) return true;

  if (locale === "ko") {
    if (looksLikeNarratorGloss(sub)) return true;
    if (looksLikeCalqueKorean(sub)) return true;
    // Idioms must not keep a word-mapped calque shape.
    if (
      looksIdiomaticEnglish(original) &&
      (/정신|사지\s*않|멀리\s*가|의식/.test(sub) ||
        /내\s*정신|그것을|나는\s*그/.test(sub))
    ) {
      // Allow already-natural idiom renders.
      if (
        !/정신\s*(이\s*)?나갈|미치겠|말도\s*안|믿기\s*(가\s*)?힘든|기절한\s*거|정신\s*나가겠/.test(
          sub,
        )
      ) {
        return true;
      }
    }
    const hasHangul = /[가-힣]/.test(sub);
    const latinHeavy =
      (sub.match(/[A-Za-z]/g)?.length ?? 0) > Math.max(8, sub.length * 0.45);
    if (!hasHangul && latinHeavy) return true;
  }
  return false;
}
