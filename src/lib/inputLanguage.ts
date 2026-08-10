import type { Locale } from "@/lib/copy";

export type ChatInputMode = "chat" | "how_to_say";

function countMatches(text: string, pattern: RegExp): number {
  return (text.match(pattern) || []).length;
}

/** True when the text contains Hangul / CJK / kana (UI-language script for most locales). */
export function hasNonLatinUiScript(text: string): boolean {
  return /[\uac00-\ud7af\u3040-\u30ff\u3400-\u9fff]/.test(text);
}

/**
 * Heuristic: English conversation — including English frames with a few
 * embedded Hangul/CJK tokens (proper nouns / unknown words), e.g.
 * "how can I say 열람실 in english?" or "I went to 강남 yesterday."
 *
 * Hangul/CJK-dominant lines are NOT treated as English.
 */
export function looksLikeEnglish(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;

  const latin = countMatches(trimmed, /[A-Za-z]/g);
  const hangul = countMatches(trimmed, /[\uac00-\ud7af]/g);
  const cjkOther = countMatches(trimmed, /[\u3040-\u30ff\u3400-\u9fff]/g);
  const nonLatin = hangul + cjkOther;
  const cyrillic = countMatches(trimmed, /[\u0400-\u04ff]/g);

  if (latin === 0) return false;

  const latinWords = countMatches(trimmed, /[A-Za-z]+/g);
  const hangulWords = countMatches(trimmed, /[\uac00-\ud7af]+/g);

  // Embedded proper nouns are OK; Korean/CJK-dominant lines are not English.
  if (nonLatin > 0) {
    if (nonLatin >= latin) return false;
    // Need a clear English frame around the embedded token(s).
    if (latinWords < 3 && hangulWords >= latinWords) return false;
  }

  if (cyrillic > 0 && cyrillic >= latin * 0.25) {
    return false;
  }

  const lower = trimmed.toLowerCase();
  const englishHints = countMatches(
    lower,
    /\b(the|a|an|i|you|we|they|is|are|was|were|have|has|had|do|does|did|my|your|to|for|with|this|that|it|and|but|or|of|in|on|at|be|been|will|can|would|could|should|how|what|say|i'm|don't|doesn't)\b/g,
  );
  const romanceHints =
    countMatches(
      lower,
      /\b(el|la|los|las|de|que|y|en|un|una|es|por|para|con|esto|esta|como|hola|gracias|je|tu|nous|vous|les|des|une|est|pas|pour|avec|não|nao|sim|você|voce|uma|dengan|yang|tidak|saya|không|tôi)\b/g,
    ) + countMatches(trimmed, /[áéíóúñü¿¡àâäçèêëïîôùûüœæãõ]/gi);

  if (romanceHints >= 2 && romanceHints > englishHints) {
    return false;
  }

  // Sparse Latin with lots of Hangul already rejected above; require some
  // English signal when the line is mixed.
  if (nonLatin > 0 && englishHints === 0 && latinWords < 4) {
    return false;
  }

  return true;
}

export function resolveChatInputMode(
  text: string,
  options: {
    chatEnabled: boolean;
    askExpressionEnabled: boolean;
    locale: Locale;
  },
): ChatInputMode {
  const { chatEnabled, askExpressionEnabled } = options;

  if (chatEnabled && !askExpressionEnabled) return "chat";
  if (!chatEnabled && askExpressionEnabled) return "how_to_say";
  if (!chatEnabled && !askExpressionEnabled) return "chat";

  // Both modes on: classify by sentence frame, not by "any Hangul present".
  // English + embedded Korean noun → chat; Korean-dominant → expression.
  return looksLikeEnglish(text) ? "chat" : "how_to_say";
}
