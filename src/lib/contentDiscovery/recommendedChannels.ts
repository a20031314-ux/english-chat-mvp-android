import type { LearningLanguageCode } from "@/lib/learningLanguages";

export type RecommendedChannelSeed = {
  /** Stable app id (not a YouTube id). */
  id: string;
  name: string;
  /** YouTube @handle without @. For people reading this file; not used to look the channel up. */
  handle: string;
  /**
   * The channel, by id. Looked up by this and nothing else: a handle can
   * belong to someone else ("JTBCNews" was a small business channel,
   * "Will_ita" a Canadian fitness one, "moscow24" an empty one), and a search
   * by name returns whatever ranks first. Check a new entry by opening
   * youtube.com/channel/<id> before adding it.
   */
  channelId: string;
};

/**
 * Channels whose uploads can be studied here: speech in the language, mostly
 * one to fifteen minutes. Checked 2026-10-15 by listing each channel's latest
 * uploads; dropped then were NHK (Shorts and trailers), Aaj Tak and 澎湃新闻
 * (mostly under a minute), 14F (no regular uploads), and 中田敦彦, 슈카월드 and
 * вДудь (nearly everything past the fifteen-minute limit).
 */
const CHANNELS: Record<LearningLanguageCode, RecommendedChannelSeed[]> = {
  en: [
    { id: "bbc-news", name: "BBC News", handle: "BBCNews", channelId: "UC16niRr50-MSBwiO3YDb3RA" },
    { id: "ted", name: "TED", handle: "TED", channelId: "UCAuUUnT6oDeKwE6v1NGQxug" },
    { id: "natgeo", name: "National Geographic", handle: "NatGeo", channelId: "UCpVm7bg6pXKo1Pr6k5kxG9A" },
    { id: "vox", name: "Vox", handle: "Vox", channelId: "UCLXo7UDZvByw2ixzpQCufnA" },
    { id: "cnn", name: "CNN", handle: "CNN", channelId: "UCupvZG-5ko_eiXAupbDfxWw" },
  ],
  ko: [
    { id: "jtbc-news", name: "JTBC 뉴스", handle: "jtbc_news", channelId: "UCsU-I-vHLiaMfV_ceaYz5rQ" },
    { id: "ytn", name: "YTN", handle: "YTN", channelId: "UChlgI3UHCOnwUGzWzbJ3H5w" },
    { id: "sbs-news", name: "SBS 뉴스", handle: "SBSNews8", channelId: "UCkinYTS9IHqOEwR1Sze2JTw" },
    { id: "kbs-news", name: "KBS News", handle: "newskbs", channelId: "UCcQTRi69dsVYHN3exePtZ1A" },
    { id: "mbc-news", name: "MBCNEWS", handle: "MBCNEWS11", channelId: "UCF4Wxdo3inmxP-Y59wXDsFw" },
  ],
  ja: [
    { id: "ted-ed-ja", name: "好奇心を持ち続けよう — TED-Ed", handle: "TEDEdJapanese", channelId: "UCwFlWUGyXPHdsRAgmFxG_jw" },
    { id: "tbs-news", name: "TBS NEWS DIG", handle: "tbsnewsdig", channelId: "UC6AG81pAkf6Lbi_1VC5NmPA" },
    { id: "ntv-news", name: "日テレNEWS", handle: "ntv_news", channelId: "UCuTAXTexrhetbOe3zgskJBQ" },
    { id: "ann-news", name: "ANNニュース", handle: "ANNnewsCH", channelId: "UCGCZAYq5Xxojl_tSXcVJhiQ" },
    { id: "tvtokyo-biz", name: "テレ東BIZ", handle: "tvtokyobiz", channelId: "UCkKVQ_GNjd8FbAuT6xDcWgg" },
  ],
  zh: [
    { id: "cctv-news", name: "央视新闻", handle: "cctv", channelId: "UCcLK3j-XWdGBnt5bR9NJHaQ" },
    { id: "bbc-chinese", name: "BBC News 中文", handle: "BBCNewsChinese", channelId: "UCb3TZ4SD_Ys3j4z0-8o6auA" },
    { id: "dw-chinese", name: "DW 中文", handle: "dwchinese", channelId: "UC99XkAM3Y82ONvdpwUYmOZg" },
    { id: "guokr", name: "果壳", handle: "Guokr42", channelId: "UCUKNGDdsU63YxsKO7c7bzGA" },
  ],
  es: [
    { id: "bbc-mundo", name: "BBC Mundo", handle: "BBCMundo", channelId: "UCUBIrDsIVzRpKsClMlSlTpQ" },
    { id: "rtve", name: "RTVE", handle: "rtve", channelId: "UC7QZIf0dta-XPXsp9Hv4dTw" },
    { id: "el-pais", name: "EL PAÍS", handle: "elpais", channelId: "UCnsvJeZO4RigQ898WdDNoBw" },
    { id: "cnn-ee", name: "CNN en Español", handle: "CNNEE", channelId: "UC_lEiu6917IJz03TnntWUaQ" },
  ],
  fr: [
    { id: "france24", name: "France 24", handle: "France24", channelId: "UCCCPCZNChQdGa9EkATeye4g" },
    { id: "hugo", name: "HugoDécrypte", handle: "hugodecrypte", channelId: "UCAcAnMF0OrCtUep3Y4M-ZPw" },
    { id: "brut", name: "Brut", handle: "BrutOfficiel", channelId: "UCSKdvgqdnj72_SLggp7BDTg" },
    { id: "le-monde", name: "Le Monde", handle: "lemondefr", channelId: "UCYpRDnhk5H8h16jpS84uqsA" },
  ],
  it: [
    { id: "rai-news", name: "RaiNews", handle: "rainews", channelId: "UCxqR9g_1XlnfrqwHK9viwCw" },
    { id: "fanpage", name: "Fanpage.it", handle: "fanpageit", channelId: "UCWJhBqnyVdHAuxexgjghNFw" },
    { id: "will", name: "Will Media", handle: "willmedia", channelId: "UCZM5aON36Iw0o0ngTaQSWVA" },
  ],
  pt: [
    { id: "g1", name: "g1", handle: "g1", channelId: "UCaGmdJSSiR7fkh2A-c6emsA" },
    { id: "globo-news", name: "GloboNews", handle: "globonews", channelId: "UCp6RRaz93Pt2xYZoEye_rLA" },
    { id: "bbc-brasil", name: "BBC News Brasil", handle: "BBCNewsBrasil", channelId: "UCthbIFAxbXTTQEC7EcQvP1Q" },
  ],
  ru: [
    { id: "bbc-russian", name: "BBC News - Русская служба", handle: "bbcnewsrussian", channelId: "UC8zQiuT0m1TELequJ5sp5zw" },
    { id: "tvrain", name: "Дождь", handle: "tvrain", channelId: "UCdubelOloxR3wzwJG9x8YqQ" },
    { id: "postnauka", name: "ПостНаука", handle: "postnauka", channelId: "UCSPd93is2UQsd_jZ6yHBfqQ" },
  ],
  ar: [
    { id: "aljazeera", name: "الجزيرة", handle: "aljazeera", channelId: "UCfiwzLy-8yKzIbsmZTzxDgw" },
    { id: "bbc-arabic", name: "BBC News عربي", handle: "BBCNewsArabic", channelId: "UCelk6aHijZq-GJBBB9YpReA" },
  ],
  id: [
    { id: "narasi", name: "Narasi", handle: "NarasiTV", channelId: "UCnOf30K0d0e8M7mc4FUzR0A" },
    { id: "kompas-tv", name: "KompasTV", handle: "KompasTV", channelId: "UC5BMIWZe9isJXLZZWPWvBlg" },
  ],
  vi: [
    { id: "vtv24", name: "VTV24", handle: "vtv24", channelId: "UCabsTV34JwALXKGMqHpvUiA" },
    { id: "vnexpress", name: "VnExpress", handle: "VnExpressOnline", channelId: "UCpK5nl5llhUL4QKq03qan8g" },
  ],
  th: [
    { id: "thai-pbs", name: "Thai PBS", handle: "ThaiPBS", channelId: "UC5TOFhyb_LxL2VG_Zenhpzw" },
    { id: "workpoint", name: "Workpoint", handle: "workpointofficial", channelId: "UC3ZkCd7XtUREnjjt3cyY_gg" },
  ],
  hi: [
    { id: "dw-hindi", name: "DW हिन्दी", handle: "dwhindi", channelId: "UCc7pPNFBvIhI4iV7m8plJuA" },
    { id: "lallantop", name: "The Lallantop", handle: "thelallantop", channelId: "UCx8Z14PpntdaxCt2hakbQLQ" },
    { id: "bbc-hindi", name: "BBC News हिंदी", handle: "bbchindi", channelId: "UCN7B-QD0Qgn2boVH5Q0pOWg" },
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
