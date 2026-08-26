import type { Locale } from "@/lib/copy";

const LOCALE_TAGS: Partial<Record<Locale, string>> = {
  ko: "ko-KR",
  en: "en-US",
  es: "es-ES",
  ja: "ja-JP",
  zh: "zh-CN",
  vi: "vi-VN",
  fr: "fr-FR",
  pt: "pt-BR",
  id: "id-ID",
};

/** Short "month day" label used in the chat history list. */
export function formatShortDate(ts: number, locale: Locale): string {
  const d = new Date(ts);
  const tag = LOCALE_TAGS[locale] ?? "en-US";
  if (locale === "ko") {
    return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  }
  if (locale === "ja" || locale === "zh") {
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  }
  return d.toLocaleDateString(tag, { month: "short", day: "numeric" });
}
