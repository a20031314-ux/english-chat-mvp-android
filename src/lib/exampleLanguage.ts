import { languageEvidence } from "./inputLanguage.ts";
import { learningLanguageScript } from "./learningLanguages.ts";

/**
 * Whether an example sentence has words of the app's language mixed into it.
 *
 * Examples under a picked phrase are meant to be all learning language, but the
 * model sometimes finishes them in the language of the app: "Akhir-akhir ini saya
 * sering đi tập thể dục." for Indonesian with the app in Vietnamese, "ช่วงนี้ฉัน
 * đang học tiếng Thái" for Thai (sim-users 2026-10-18, three in ninety-eight).
 *
 * Different scripts: a few letters of the app's script is the tell, after names in
 * capitals are set aside ("我叫Marco。" is fine). Two Latin languages: the app's
 * language has to outweigh the learning language's own small words and letters.
 */
export function exampleMixesInterfaceLanguage(
  sentence: string,
  targetLanguage: string | undefined,
  interfaceLanguage: string | undefined,
): boolean {
  if (!sentence || !targetLanguage || !interfaceLanguage || targetLanguage === interfaceLanguage) return false;
  const targetScript = learningLanguageScript(targetLanguage);
  const uiScript = learningLanguageScript(interfaceLanguage);
  if (targetScript !== uiScript) {
    const body = uiScript === "latin" ? sentence.replace(/\b\p{Lu}\p{Ll}+\b/gu, " ") : sentence;
    return languageEvidence(body, targetLanguage, interfaceLanguage).ui >= 3;
  }
  if (targetScript === "latin") {
    const evidence = languageEvidence(sentence, targetLanguage, interfaceLanguage);
    return evidence.ui > evidence.learning;
  }
  return false;
}
