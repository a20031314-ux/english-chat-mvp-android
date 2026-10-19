/**
 * "보내주신 의견이 반영됐어요" — 의견함 카드가 반영·완료되면 그 카드에 묶인 의견을
 * 보낸 사람마다 한 번, 앱을 열 때 고치기 전·후 그림과 함께 알린다.
 *
 * 보낸 사람은 되돌릴 수 없는 해시(`senderTag`)로만 알고 있다. 그래서 서버는 해시 앞으로
 * 소식을 쌓아 두고, 앱이 자기 id로 물으면 같은 해시를 만들어 찾아 준다 — 원래 id는
 * 어디에도 새로 남지 않는다.
 *
 * 그림은 `public/feedback-fix/<카드>/<UI 언어>/{before,after}.webp`(웹사이트가 내주고
 * 앱 묶음에서는 뺀다). 만드는 법: scripts/capture-feedback-fix.mjs, 절차: hub/feedback/README.md.
 *
 * 서버(라우트·저장소)와 앱(시트)이 같이 쓴다.
 */

export const FIX_LOCALES = ["ko", "en", "es", "ja", "zh", "vi", "fr", "it", "pt", "ru", "id", "ar", "th", "hi"] as const;
export type FixLocale = (typeof FIX_LOCALES)[number];

/** 카드 하나의 반영 내용. 소식은 이걸 가리킨다. */
export type FeedbackFix = {
  card: string;
  at: number;
  /** 고친 것이 들어간 앱 버전("2.70"). 서버만 고쳤으면 "" — 누구나 바로 본다. */
  appVersion: string;
  /** UI 언어별 한 줄: 무엇이 어떻게 바뀌었나. */
  texts: Partial<Record<FixLocale, string>>;
  /** 전·후 그림이 있는 UI 언어. */
  shots: FixLocale[];
};

/** 앱이 받는 소식 하나. */
export type FeedbackNews = {
  card: string;
  text: string;
  /** 그림 경로(apiUrl로 감싸서 씀). 그림이 없으면 null. */
  before: string | null;
  after: string | null;
  /** 이 앱 빌드에는 아직 없음 — 업데이트하면 보인다. */
  needsUpdate: boolean;
  appVersion: string;
};

export const FIX_TEXT_MAX = 240;
export const CARD_ID = /^[a-z0-9][a-z0-9_-]{0,47}$/;
export const SENDER_TAG = /^[a-f0-9]{16}$/;

export function isFixLocale(value: unknown): value is FixLocale {
  return typeof value === "string" && (FIX_LOCALES as readonly string[]).includes(value);
}

/** "ja-JP" → "ja", 모르는 말이면 null. */
export function fixLocaleOf(value: string): FixLocale | null {
  const base = (value || "").toLowerCase().split(/[-_]/)[0];
  return isFixLocale(base) ? base : null;
}

export function shotUrl(card: string, locale: FixLocale, which: "before" | "after"): string {
  return `/feedback-fix/${card}/${locale}/${which}.webp`;
}

/** 그 사람 UI 언어 → 영어 → 한국어 → 있는 아무거나. */
export function pickLocale(want: string, have: readonly FixLocale[]): FixLocale | null {
  const own = fixLocaleOf(want);
  if (own && have.includes(own)) return own;
  for (const fallback of ["en", "ko"] as const) if (have.includes(fallback)) return fallback;
  return have[0] ?? null;
}

/** 저장된 반영 내용을 이 사람에게 보여 줄 소식으로. */
export function newsFor(fix: FeedbackFix, uiLocale: string, needsUpdate: boolean): FeedbackNews {
  const textLocales = FIX_LOCALES.filter((locale) => fix.texts[locale]?.trim());
  const textLocale = pickLocale(uiLocale, textLocales);
  const shotLocale = pickLocale(uiLocale, fix.shots);
  return {
    card: fix.card,
    text: textLocale ? (fix.texts[textLocale] ?? "") : "",
    before: shotLocale ? shotUrl(fix.card, shotLocale, "before") : null,
    after: shotLocale ? shotUrl(fix.card, shotLocale, "after") : null,
    needsUpdate,
    appVersion: fix.appVersion,
  };
}
