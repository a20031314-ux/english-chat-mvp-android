const BLOCKED_SCHEMES = new Set([
  "javascript",
  "data",
  "file",
  "blob",
  "intent",
  "content",
  "about",
  "mailto",
  "tel",
  "sms",
  "market",
]);

export type WebReaderUrlResult =
  | { ok: true; url: string }
  | { ok: false; error: "empty" | "invalid" | "unsupported" };

function isLocalHost(hostname: string) {
  const host = hostname.toLowerCase();
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
}

export function normalizeWebReaderUrl(raw: string): WebReaderUrlResult {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, error: "empty" };

  const withScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(withScheme);
  } catch {
    return { ok: false, error: "invalid" };
  }

  const scheme = parsed.protocol.replace(":", "").toLowerCase();
  if (BLOCKED_SCHEMES.has(scheme)) {
    return { ok: false, error: "unsupported" };
  }
  if (scheme !== "http" && scheme !== "https") {
    return { ok: false, error: "unsupported" };
  }

  if (scheme === "http" && !isLocalHost(parsed.hostname)) {
    parsed.protocol = "https:";
  }

  return { ok: true, url: parsed.toString() };
}

export type WebReaderShortcut = {
  id: string;
  url: string;
  /** Brand name in the site's own language — not UI copy. */
  label: string;
};

const SHORTCUTS_BY_LANGUAGE: Record<string, readonly WebReaderShortcut[]> = {
  en: [
    { id: "reddit", url: "https://www.reddit.com/", label: "Reddit" },
    { id: "bbc", url: "https://www.bbc.com/news", label: "BBC" },
    { id: "guardian", url: "https://www.theguardian.com/", label: "Guardian" },
  ],
  ko: [
    { id: "naver-news", url: "https://news.naver.com/", label: "네이버 뉴스" },
    { id: "daum-news", url: "https://news.daum.net/", label: "다음 뉴스" },
    { id: "dcinside", url: "https://www.dcinside.com/", label: "디시인사이드" },
  ],
  ja: [
    { id: "yahoo-jp", url: "https://news.yahoo.co.jp/", label: "Yahoo!ニュース" },
    { id: "nhk", url: "https://www3.nhk.or.jp/news/", label: "NHK" },
    { id: "note", url: "https://note.com/", label: "note" },
  ],
  zh: [
    { id: "zhihu", url: "https://www.zhihu.com/", label: "知乎" },
    { id: "zaobao", url: "https://www.zaobao.com.sg/", label: "联合早报" },
    { id: "wikipedia-zh", url: "https://zh.wikipedia.org/", label: "维基百科" },
  ],
  es: [
    { id: "elpais", url: "https://elpais.com/", label: "El País" },
    { id: "infobae", url: "https://www.infobae.com/", label: "Infobae" },
    { id: "meneame", url: "https://www.meneame.net/", label: "Menéame" },
  ],
  fr: [
    { id: "lemonde", url: "https://www.lemonde.fr/", label: "Le Monde" },
    { id: "franceinfo", url: "https://www.francetvinfo.fr/", label: "franceinfo" },
    { id: "20minutes", url: "https://www.20minutes.fr/", label: "20 Minutes" },
  ],
  it: [
    { id: "repubblica", url: "https://www.repubblica.it/", label: "la Repubblica" },
    { id: "corriere", url: "https://www.corriere.it/", label: "Corriere" },
    { id: "ilpost", url: "https://www.ilpost.it/", label: "Il Post" },
  ],
  pt: [
    { id: "publico", url: "https://www.publico.pt/", label: "Público" },
    { id: "g1", url: "https://g1.globo.com/", label: "G1" },
    { id: "sapo", url: "https://www.sapo.pt/", label: "SAPO" },
  ],
  ru: [
    { id: "pikabu", url: "https://pikabu.ru/", label: "Пикабу" },
    { id: "meduza", url: "https://meduza.io/", label: "Meduza" },
    { id: "rbc", url: "https://www.rbc.ru/", label: "РБК" },
  ],
};

export function webReaderShortcutsForLanguage(
  targetLanguage: string,
): readonly WebReaderShortcut[] {
  return SHORTCUTS_BY_LANGUAGE[targetLanguage] ?? SHORTCUTS_BY_LANGUAGE.en!;
}
