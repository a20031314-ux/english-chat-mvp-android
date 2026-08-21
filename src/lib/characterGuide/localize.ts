import type { LocalizedText } from "./types";

export function localizedText(
  text: LocalizedText | undefined,
  locale: string,
): string {
  if (!text) return "";
  if (typeof text === "string") return text;
  if (locale === "ko" && text.ko) return text.ko;
  if (text.en) return text.en;
  return text.ko ?? "";
}
