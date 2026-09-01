import { ALL_ANALYSIS_DIMENSIONS } from "./languageProfiles.ts";
import type { AnalysisDimension } from "./types.ts";

const LABELS: Record<string, Record<AnalysisDimension, string>> = {
  ko: {
    syntax: "통사",
    usageInContext: "쓰임",
    phonology: "발음",
    morphology: "형태",
    pragmatics: "말투",
    etymology: "유래",
  },
  en: {
    syntax: "Syntax",
    usageInContext: "Usage",
    phonology: "Sound",
    morphology: "Form",
    pragmatics: "Tone",
    etymology: "Origin",
  },
  es: {
    syntax: "Sintaxis",
    usageInContext: "Uso",
    phonology: "Pronunciación",
    morphology: "Forma",
    pragmatics: "Matiz",
    etymology: "Origen",
  },
  ja: {
    syntax: "統語",
    usageInContext: "使い方",
    phonology: "発音",
    morphology: "形",
    pragmatics: "話し方",
    etymology: "由来",
  },
  zh: {
    syntax: "句法",
    usageInContext: "用法",
    phonology: "发音",
    morphology: "形态",
    pragmatics: "语气",
    etymology: "词源",
  },
  vi: {
    syntax: "Cú pháp",
    usageInContext: "Cách dùng",
    phonology: "Phát âm",
    morphology: "Hình thái",
    pragmatics: "Ngữ khí",
    etymology: "Nguồn gốc",
  },
  fr: {
    syntax: "Syntaxe",
    usageInContext: "Emploi",
    phonology: "Prononciation",
    morphology: "Forme",
    pragmatics: "Registre",
    etymology: "Origine",
  },
  it: {
    syntax: "Sintassi",
    usageInContext: "Uso",
    phonology: "Pronuncia",
    morphology: "Forma",
    pragmatics: "Registro",
    etymology: "Origine",
  },
  pt: {
    syntax: "Sintaxe",
    usageInContext: "Uso",
    phonology: "Pronúncia",
    morphology: "Forma",
    pragmatics: "Registro",
    etymology: "Origem",
  },
  ru: {
    syntax: "Синтаксис",
    usageInContext: "Употребление",
    phonology: "Произношение",
    morphology: "Форма",
    pragmatics: "Оттенок",
    etymology: "Происхождение",
  },
  id: {
    syntax: "Sintaksis",
    usageInContext: "Pemakaian",
    phonology: "Pelafalan",
    morphology: "Bentuk",
    pragmatics: "Nada",
    etymology: "Asal",
  },
  ar: {
    syntax: "التركيب",
    usageInContext: "الاستعمال",
    phonology: "النطق",
    morphology: "الشكل",
    pragmatics: "الأسلوب",
    etymology: "الأصل",
  },
  th: {
    syntax: "โครงสร้าง",
    usageInContext: "การใช้",
    phonology: "การออกเสียง",
    morphology: "รูป",
    pragmatics: "น้ำเสียง",
    etymology: "ที่มา",
  },
  hi: {
    syntax: "वाक्य रचना",
    usageInContext: "प्रयोग",
    phonology: "उच्चारण",
    morphology: "रूप",
    pragmatics: "लहजा",
    etymology: "व्युत्पत्ति",
  },
};

export function analysisDimensionLabel(
  locale: string,
  dimension: AnalysisDimension,
): string {
  const code = locale.trim().toLowerCase().split(/[-_]/)[0] ?? "en";
  return LABELS[code]?.[dimension] ?? LABELS.en[dimension];
}

/**
 * The dimension notes as one paragraph, each prefixed with its label.
 *
 * Only for app builds older than the dimension-aware viewers, which read a
 * single prose field and would otherwise show a bare meaning line. Delete
 * this and its callers once those builds are gone.
 */
export function legacyDimensionProse(
  locale: string,
  results: Partial<Record<AnalysisDimension, string>> | undefined,
): string {
  return orderedDimensionEntries(results)
    .map(
      (entry) =>
        analysisDimensionLabel(locale, entry.dimension) + ": " + entry.text,
    )
    .join(" ");
}

export function orderedDimensionEntries(
  results: Partial<Record<AnalysisDimension, string>> | undefined,
): Array<{ dimension: AnalysisDimension; text: string }> {
  if (!results) return [];
  return ALL_ANALYSIS_DIMENSIONS.flatMap((dimension) => {
    const text = results[dimension]?.replace(/\s+/g, " ").trim();
    return text ? [{ dimension, text }] : [];
  });
}
