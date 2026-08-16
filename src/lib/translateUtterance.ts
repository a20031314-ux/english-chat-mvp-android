import { apiUrl } from "@/lib/apiBase";
import type { TranslationSourceType } from "@/lib/naturalTranslation";

/** Same spoken-translation path as chat `/api/translate`. */
export async function translateUtterance(input: {
  text: string;
  locale: string;
  interfaceLanguage?: string;
  targetLanguage?: string;
  sourceType?: TranslationSourceType;
  context?: string[];
}): Promise<string | null> {
  const text = input.text.replace(/\s+/g, " ").trim();
  if (!text) return null;
  const interfaceLanguage = input.interfaceLanguage ?? input.locale;
  if (interfaceLanguage === (input.targetLanguage ?? "en")) return null;

  const response = await fetch(apiUrl("/api/translate"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      locale: input.locale,
      interfaceLanguage,
      ...(input.targetLanguage ? { targetLanguage: input.targetLanguage } : {}),
      ...(input.sourceType ? { sourceType: input.sourceType } : {}),
      ...(input.context?.length ? { context: input.context } : {}),
    }),
    signal: AbortSignal.timeout(25000),
  });
  if (!response.ok) throw new Error("translate failed");
  const data = (await response.json()) as { translated?: string };
  const translated = data.translated?.trim() || "";
  if (!translated) throw new Error("empty translation");
  return translated;
}
