import type { LearningLanguageCode } from "@/lib/learningLanguages";

export type RecommendedChannelSeed = {
  /** Stable app id (not a YouTube id). */
  id: string;
  name: string;
  /** YouTube @handle without @ */
  handle: string;
};

const CHANNELS: Record<LearningLanguageCode, RecommendedChannelSeed[]> = {
  en: [
    { id: "bbc-news", name: "BBC News", handle: "BBCNews" },
    { id: "ted", name: "TED", handle: "TED" },
    { id: "natgeo", name: "National Geographic", handle: "NatGeo" },
    { id: "vox", name: "Vox", handle: "Vox" },
    { id: "cnn", name: "CNN", handle: "CNN" },
  ],
  ko: [
    { id: "jtbc-news", name: "JTBC 뉴스", handle: "JTBCNews" },
    { id: "ytn", name: "YTN", handle: "YTN" },
    { id: "sbs-news", name: "SBS 뉴스", handle: "SBSNews8" },
    { id: "14f", name: "14F", handle: "14F" },
    { id: "syuka", name: "슈카월드", handle: "syukaworld" },
  ],
  ja: [
    { id: "nhk", name: "NHK", handle: "NHK" },
    { id: "tvtokyo-biz", name: "テレ東BIZ", handle: "tvtokyobiz" },
    { id: "nakata", name: "中田敦彦", handle: "NAKATAUNIVERSITY" },
    { id: "ann-news", name: "ANNニュース", handle: "ANNnewsCH" },
  ],
  zh: [
    { id: "cctv-news", name: "央视新闻", handle: "cctv" },
    { id: "the-paper", name: "澎湃新闻", handle: "thepaper" },
    { id: "guokr", name: "果壳", handle: "Guokr42" },
  ],
  es: [
    { id: "bbc-mundo", name: "BBC Mundo", handle: "BBCMundo" },
    { id: "rtve", name: "RTVE", handle: "rtve" },
    { id: "el-pais", name: "EL PAÍS", handle: "elpais" },
    { id: "cnn-ee", name: "CNN en Español", handle: "CNNEE" },
  ],
  fr: [
    { id: "france24", name: "France 24", handle: "France24" },
    { id: "hugo", name: "HugoDécrypte", handle: "hugodecrypte" },
    { id: "brut", name: "Brut", handle: "BrutOfficiel" },
    { id: "le-monde", name: "Le Monde", handle: "lemondefr" },
  ],
  it: [
    { id: "rai-news", name: "RaiNews", handle: "rainews" },
    { id: "fanpage", name: "Fanpage.it", handle: "fanpageit" },
    { id: "will", name: "Will", handle: "Will_ita" },
  ],
  pt: [
    { id: "g1", name: "g1", handle: "g1" },
    { id: "globo-news", name: "GloboNews", handle: "globonews" },
    { id: "bbc-brasil", name: "BBC News Brasil", handle: "BBCNewsBrasil" },
  ],
  ru: [
    { id: "vdud", name: "вДудь", handle: "vdud" },
    { id: "tvrain", name: "Дождь", handle: "tvrain" },
    { id: "moscow24", name: "Москва 24", handle: "moscow24" },
  ],
};

export function recommendedChannelSeeds(
  language: LearningLanguageCode,
): RecommendedChannelSeed[] {
  return CHANNELS[language] ?? CHANNELS.en;
}

export function recommendedChannelSeed(
  language: LearningLanguageCode,
  id: string,
): RecommendedChannelSeed | null {
  return recommendedChannelSeeds(language).find((row) => row.id === id) ?? null;
}
