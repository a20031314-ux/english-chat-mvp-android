// 홍보 쇼츠의 언어판과 학습 조합(사용자 결정 2026-10-24, hub/drafts/marketing-videos.md).
// 사용자가 많은 언어(영어·스페인어·아랍어·동남아 3개)는 기본으로, 교류가 많은 한국어↔일본어는 서로를 배우는 조합으로.
// 프랑스어·이탈리아어 등은 일단 뺀다. 옛 이야기(chat·people·room·invite·talk)는 예전 조합(en → es, 나머지 → en)을 그대로 쓴다.

/** 이번에 만드는 앱 언어(UI) 8개. */
export const PROMO_LOCALES = ["en", "es", "ar", "id", "vi", "th", "ko", "ja"];

/** 앱 언어 → 그 판에서 배우는 언어. 영어판은 해외 수요가 큰 한국어 배우기. */
export const LEARN = { en: "ko", es: "en", ar: "en", id: "en", vi: "en", th: "en", ko: "ja", ja: "ko" };

/** 운영 /api/tts에 넘기는 말 코드. */
export const SPEECH = {
  en: "en-US", ko: "ko-KR", ja: "ja-JP", es: "es-ES", ar: "ar-SA", id: "id-ID", vi: "vi-VN", th: "th-TH", zh: "zh-CN", hi: "hi-IN",
};

/** 자막·끝 화면 글꼴(없는 글자는 Noto Sans로). */
export const FONT = {
  ko: "'Noto Sans CJK KR', sans-serif",
  ja: "'Noto Sans CJK JP', sans-serif",
  zh: "'Noto Sans CJK SC', sans-serif",
  hi: "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
  ar: "'Noto Sans Arabic', 'Noto Naskh Arabic', 'Noto Sans', sans-serif",
  th: "'Noto Sans Thai', 'Noto Sans', sans-serif",
};

export const RTL = new Set(["ar"]);

export const STORE_LINE = {
  ko: "Google Play에서 만나요", en: "Get it on Google Play", ja: "Google Playで配信中", zh: "在 Google Play 下载",
  es: "Disponible en Google Play", hi: "Google Play पर पाएँ", ar: "احصل عليه من Google Play", id: "Dapatkan di Google Play",
  vi: "Tải trên Google Play", th: "ดาวน์โหลดบน Google Play",
};
