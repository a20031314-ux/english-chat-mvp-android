/**
 * Map app UI locale → YouTube caption language codes to try.
 */
export function localeCaptionLanguageCodes(locale: string): string[] {
  const base = locale.trim().toLowerCase().split(/[-_]/)[0] || "ko";
  switch (base) {
    case "ko":
      return ["ko", "ko-KR"];
    case "en":
      return ["en", "en-US", "en-GB"];
    case "ja":
      return ["ja", "ja-JP"];
    case "zh":
      return ["zh", "zh-CN", "zh-Hans", "zh-TW", "zh-Hant", "zh-HK"];
    case "es":
      return ["es", "es-ES", "es-419", "es-MX"];
    case "fr":
      return ["fr", "fr-FR"];
    case "pt":
      return ["pt", "pt-BR", "pt-PT"];
    case "vi":
      return ["vi", "vi-VN"];
    case "id":
      return ["id", "id-ID"];
    case "ru":
      return ["ru", "ru-RU"];
    case "it":
      return ["it", "it-IT"];
    default:
      return [base];
  }
}

export function captionLanguageMatches(
  trackLanguageCode: string,
  localeOrLang: string,
): boolean {
  const track = trackLanguageCode.trim().toLowerCase().replace(/_/g, "-");
  if (!track) return false;
  const wanted = localeCaptionLanguageCodes(localeOrLang).map((code) =>
    code.toLowerCase().replace(/_/g, "-"),
  );
  const trackBase = track.split("-")[0]!;
  return wanted.some((code) => {
    const wantBase = code.split("-")[0]!;
    return (
      track === code ||
      track.startsWith(`${code}-`) ||
      code.startsWith(`${track}-`) ||
      trackBase === wantBase
    );
  });
}

export function isManualCaptionTrack(kind: string | undefined): boolean {
  // YouTube marks auto-generated tracks with kind=asr.
  return !kind || kind.toLowerCase() !== "asr";
}
