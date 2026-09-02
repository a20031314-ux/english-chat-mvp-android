import type { LearningLanguageCode } from "../learningLanguages.ts";
import { FREE_CATALOG_TRIAL_COUNT } from "../billing/config.ts";

export type LibraryClip = {
  videoId: string;
  title: string;
  durationSeconds: number;
};

export type LibraryPack = {
  id: string;
  month: string;
  language: LearningLanguageCode;
  clips: LibraryClip[];
};

/**
 * Monthly curated packs. Add a new `{month}` entry when swapping the library;
 * lookup uses the latest pack whose month is <= the current calendar month.
 * Prefer short, speech-heavy, captioned lessons in the learning language
 * (official TED-Ed dubs where they exist; native educational series otherwise).
 */
/** Exported so scripts/verify-video-library.mjs can check every clip. */
export const PACKS: LibraryPack[] = [
  {
    id: "en-2026-08",
    month: "2026-08",
    language: "en",
    clips: [
      {
        videoId: "e7S8jWh6AEs",
        title: "The paradox of value",
        durationSeconds: 225,
      },
      {
        videoId: "U0EySK4T2aY",
        title: "How Chinese characters work",
        durationSeconds: 288,
      },
      {
        videoId: "yqUFy-t4MlQ",
        title: "How we conquered smallpox",
        durationSeconds: 274,
      },
      {
        videoId: "_Z_FOtfKyfo",
        title: "What makes a language a language?",
        durationSeconds: 296,
      },
      {
        videoId: "nZP7pb_t4oA",
        title: "How brains process speech",
        durationSeconds: 293,
      },
      {
        videoId: "fPnwBITSmgU",
        title: "Mendeleev’s periodic table",
        durationSeconds: 264,
      },
      {
        videoId: "GyN2RhbhiEU",
        title: "Scientific law vs theory",
        durationSeconds: 312,
      },
    ],
  },
  {
    id: "ja-2026-08",
    month: "2026-08",
    language: "ja",
    clips: [
      {
        videoId: "cS8oEgJ9CXU",
        title: "悪い癖をやめるのが大変な理由",
        durationSeconds: 301,
      },
      {
        videoId: "cSIX6prPwRk",
        title: "気になっても先延ばしにしてしまう理由",
        durationSeconds: 344,
      },
      {
        videoId: "W6_WtpCmFJc",
        title: "言語を言語たらしめるのは何か",
        durationSeconds: 304,
      },
      {
        videoId: "59vUyl-Ussg",
        title: "囚人と箱の問題",
        durationSeconds: 292,
      },
      {
        videoId: "9rJtbQ0JrZM",
        title: "量子コンピューターの開発競争",
        durationSeconds: 323,
      },
      {
        videoId: "neHSDiHfzRo",
        title: "2500年前の沈没船が残った理由",
        durationSeconds: 284,
      },
      {
        videoId: "U25x97NB1io",
        title: "『華氏451度』を読むべき理由",
        durationSeconds: 283,
      },
    ],
  },
  {
    id: "zh-2026-08",
    month: "2026-08",
    language: "zh",
    clips: [
      {
        videoId: "aaEyJU_ftDI",
        title: "孔子是谁？",
        durationSeconds: 275,
      },
      {
        videoId: "4A2yuVp2cUg",
        title: "饺子简史",
        durationSeconds: 281,
      },
      {
        videoId: "iVp3i8clAFs",
        title: "火山爆发的原因是什么？",
        durationSeconds: 327,
      },
      {
        videoId: "g9yjdDVZZwU",
        title: "是什么使肌肉增长？",
        durationSeconds: 258,
      },
      {
        videoId: "pamsHFJzKvo",
        title: "为什么很难改掉坏习惯？",
        durationSeconds: 298,
      },
      {
        videoId: "BibFkFgJuHw",
        title: "如何应对拒绝",
        durationSeconds: 309,
      },
      {
        videoId: "_FFen6V-PCM",
        title: "自然界中最稀有的颜色是什么？",
        durationSeconds: 304,
      },
    ],
  },
  {
    id: "ko-2026-08",
    month: "2026-08",
    language: "ko",
    clips: [
      {
        videoId: "xkGCgVqAwSo",
        title: "베어링은 어떻게 마찰을 줄일까",
        durationSeconds: 259,
      },
      {
        videoId: "TDQLx-zNNAE",
        title: "에어컨이 시원한 이유",
        durationSeconds: 259,
      },
      {
        videoId: "cAvnqlRbJsI",
        title: "고체도 액체도 아닌 플라즈마",
        durationSeconds: 273,
      },
      {
        videoId: "azhQOJ4zceg",
        title: "원자들이 결합하는 원리",
        durationSeconds: 311,
      },
      {
        videoId: "Rd0qwdQtZzI",
        title: "렌즈가 상을 만드는 원리",
        durationSeconds: 255,
      },
      {
        videoId: "rW9s5_SIfcg",
        title: "명량해전, 이순신의 열두 척",
        durationSeconds: 241,
      },
      {
        videoId: "VMYJlThin3w",
        title: "인지주의 심리학 입문",
        durationSeconds: 301,
      },
    ],
  },
  {
    id: "es-2026-08",
    month: "2026-08",
    language: "es",
    clips: [
      {
        videoId: "GLkkwbsPWEA",
        title: "¿Por qué es tan difícil dejar un mal hábito?",
        durationSeconds: 299,
      },
      {
        videoId: "bcOaW-qMc0s",
        title: "Por qué procrastinas aún cuando no se siente bien",
        durationSeconds: 344,
      },
      {
        videoId: "Zmqi-d9UH2s",
        title: "Cómo controlar las emociones",
        durationSeconds: 287,
      },
      {
        videoId: "gWgU-83bx9c",
        title: "¿Qué hace que un idioma sea un idioma?",
        durationSeconds: 301,
      },
      {
        videoId: "cM6akU8p9U8",
        title: "La paradoja del hotel infinito",
        durationSeconds: 364,
      },
      {
        videoId: "YO4pwpaH8Fo",
        title: "5 consejos para mejorar su pensamiento crítico",
        durationSeconds: 277,
      },
      {
        videoId: "lagowvVjzNY",
        title: "Cómo el azúcar afecta el cerebro",
        durationSeconds: 303,
      },
    ],
  },
  {
    id: "fr-2026-08",
    month: "2026-08",
    language: "fr",
    clips: [
      {
        videoId: "TsHS0SVaIlY",
        title: "Que se passe-t-il si on ne dort pas ?",
        durationSeconds: 273,
      },
      {
        videoId: "XIBUrNtzbh4",
        title: "Pourquoi rêvons-nous ?",
        durationSeconds: 340,
      },
      {
        videoId: "Vv2hGTqRo2A",
        title: "Pourquoi vous remettez les choses à plus tard",
        durationSeconds: 343,
      },
      {
        videoId: "87lDLRZwSIo",
        title: "Les avantages d'un cerveau bilingue",
        durationSeconds: 306,
      },
      {
        videoId: "ojA-nrk7e5U",
        title: "3 conseils pour étudier efficacement",
        durationSeconds: 304,
      },
      {
        videoId: "-0SSMOxhRuE",
        title: "À quel âge est-on le plus intelligent ?",
        durationSeconds: 288,
      },
      {
        videoId: "iJrHpIhi8Vo",
        title: "Le mythe de la boîte de Pandore",
        durationSeconds: 243,
      },
    ],
  },
  {
    id: "it-2026-08",
    month: "2026-08",
    language: "it",
    clips: [
      {
        videoId: "LEDJk1ofFQw",
        title: "Come trovare la tua passione in 10 minuti",
        durationSeconds: 549,
      },
      {
        videoId: "e0wN-baPVb0",
        title: "Disintossicarsi dai social network si può",
        durationSeconds: 669,
      },
      {
        videoId: "L34pwZTEFTQ",
        title: "Salute mentale e la ricerca dell'equilibrio",
        durationSeconds: 638,
      },
      {
        videoId: "dJ0H1KALPFw",
        title: "Il vero pericolo non è morire. È vivere spenti",
        durationSeconds: 641,
      },
      {
        videoId: "Q-GtvK7FXzc",
        title: "Il tuo cervello è pigro! Ma non è colpa tua",
        durationSeconds: 686,
      },
      {
        videoId: "7YXpBhXxGKs",
        title: "Rinascimento Bio",
        durationSeconds: 679,
      },
      {
        videoId: "wifrsVbrkAE",
        title: "Biodiversità di cervelli: la storia evolutiva dell'ADHD",
        durationSeconds: 900,
      },
    ],
  },
  {
    id: "pt-2026-08",
    month: "2026-08",
    language: "pt",
    clips: [
      {
        videoId: "mO14fl-TYCo",
        title: "Por que você procrastina mesmo sabendo que isso é ruim",
        durationSeconds: 345,
      },
      {
        videoId: "_KlZ2EOtQ6M",
        title: "É normal falar sozinho?",
        durationSeconds: 315,
      },
      {
        videoId: "ztlxoS6pbRE",
        title: "Qual é a idade mais inteligente?",
        durationSeconds: 288,
      },
      {
        videoId: "4QpurUxYPLQ",
        title: "O mito de Sísifo",
        durationSeconds: 295,
      },
      {
        videoId: "jER8oAUQGcw",
        title: "Por que é tão difícil matar baratas?",
        durationSeconds: 306,
      },
      {
        videoId: "yVnfm7gJF4k",
        title: "O passado, presente e futuro da peste bubônica",
        durationSeconds: 256,
      },
      {
        videoId: "hQ6mmoZ0zCc",
        title: "Por que você deveria ler O Senhor das Moscas",
        durationSeconds: 286,
      },
    ],
  },
  {
    id: "ru-2026-08",
    month: "2026-08",
    language: "ru",
    clips: [
      {
        videoId: "gnacjBiP9PU",
        title: "Как сахар влияет на мозг?",
        durationSeconds: 346,
      },
      {
        videoId: "Iwxie2zexkU",
        title: "Реальны ли наши воспоминания?",
        durationSeconds: 291,
      },
      {
        videoId: "XZR7KUxsPSY",
        title: "Почему мы спим?",
        durationSeconds: 254,
      },
      {
        videoId: "opzRfHYdbDY",
        title: "История шоколада",
        durationSeconds: 247,
      },
      {
        videoId: "CUNdWmoIE8E",
        title: "Почему нельзя сварить лягушку?",
        durationSeconds: 260,
      },
      {
        videoId: "jgM9DfnMj8c",
        title: "Что такое депрессия?",
        durationSeconds: 276,
      },
      {
        videoId: "lYFECoKiqNw",
        title: "На сколько быстра сила мысли?",
        durationSeconds: 312,
      },
    ],
  },
  {
    id: "ar-2026-08",
    month: "2026-08",
    language: "ar",
    clips: [
      {
        videoId: "XYaUlnKpEt0",
        title: "ماذا يحدث إن لم تنم؟",
        durationSeconds: 276,
      },
      {
        videoId: "ZXfhxq-0fgE",
        title: "لماذا تماطل حتى عندما تشعر بالسوء",
        durationSeconds: 347,
      },
      {
        videoId: "4PRvJE596Xg",
        title: "فوائد الدماغ ثنائي اللغة",
        durationSeconds: 310,
      },
      {
        videoId: "CwE6K9KFJLE",
        title: "ما المرحلة العمرية الأكثر ذكاءً؟",
        durationSeconds: 291,
      },
      {
        videoId: "rLbFE5qO95k",
        title: "هل التحدث مع نفسك أمر طبيعي؟",
        durationSeconds: 317,
      },
      {
        videoId: "RJbHD0rRmDw",
        title: "3 نصائح حول كيفية الدراسة بفعالية",
        durationSeconds: 305,
      },
      {
        videoId: "AeOClfi4t-I",
        title: "لماذا نحلم؟",
        durationSeconds: 339,
      },
    ],
  },
  {
    id: "id-2026-08",
    month: "2026-08",
    language: "id",
    clips: [
      {
        videoId: "cqGE1ATVOsg",
        title: "Alasan Kenapa Kekuatan Super Itu Gak Berguna",
        durationSeconds: 256,
      },
      {
        videoId: "mfjRsAbs6Ms",
        title: "Apa Jadinya Jika Kita Cuma Makan Mi Instan?",
        durationSeconds: 250,
      },
      {
        videoId: "xKI-RKCp0k4",
        title: "Apa Jadinya Kalau Seluruh Energi Fosil Kita Musnahkan?",
        durationSeconds: 265,
      },
      {
        videoId: "tILGAq24Jqs",
        title: "Kenapa Sampai Sekarang Belum Ada Obat HIV/Aids?",
        durationSeconds: 316,
      },
      {
        videoId: "2xWpbjWp1Qc",
        title: "Teknologi Makin Canggih, Kenapa Lingkungan Makin Parah?",
        durationSeconds: 492,
      },
      {
        videoId: "j9vqa4K4h90",
        title: "Apa Itu Ilmu Psikologi Sebenarnya?",
        durationSeconds: 587,
      },
      {
        videoId: "FjFsx6iQE3Y",
        title: "Apakah Ada Kehidupan Lain di Luar Bumi?",
        durationSeconds: 283,
      },
    ],
  },
  {
    id: "vi-2026-08",
    month: "2026-08",
    language: "vi",
    clips: [
      {
        videoId: "XilY5HkU6aQ",
        title: "Chuyện gì sẽ xảy ra nếu bạn không uống nước?",
        durationSeconds: 270,
      },
      {
        videoId: "6EYU2uQG_t4",
        title: "Muỗi có yêu bạn không?",
        durationSeconds: 268,
      },
      {
        videoId: "yw1cPqit_Ns",
        title: "Tại sao cá thở tốt hơn chúng ta?",
        durationSeconds: 306,
      },
      {
        videoId: "PgETymKfkPs",
        title: "Tại sao Tháp nghiêng Pisa không đổ?",
        durationSeconds: 292,
      },
      {
        videoId: "7akBPfy9ecA",
        title: "Gạo: Lương thực chính toàn cầu",
        durationSeconds: 266,
      },
      {
        videoId: "hyMwvFbd58U",
        title: "Trái đất năm 2050 sẽ như thế nào?",
        durationSeconds: 274,
      },
      {
        videoId: "TZ3xeLrptd0",
        title: "Nấm độc nguy hiểm nhất thế giới",
        durationSeconds: 322,
      },
    ],
  },
  {
    id: "th-2026-08",
    month: "2026-08",
    language: "th",
    clips: [
      {
        videoId: "XVwa8jpNx-U",
        title: "จักรวาลประกอบขึ้นจากอะไร?",
        durationSeconds: 245,
      },
      {
        videoId: "gTgJYgRWuLs",
        title: "จะเกิดอะไรขึ้นถ้าคุณไม่ดื่มน้ำ",
        durationSeconds: 292,
      },
      {
        videoId: "OG9eq8xqW6A",
        title: "ทำไมเรายังต้องผัดวันประกันพรุ่ง",
        durationSeconds: 345,
      },
      {
        videoId: "DohgvjkN_y8",
        title: "ทำไมเราจึงรัก",
        durationSeconds: 351,
      },
      {
        videoId: "gtJ9Px7x548",
        title: "เหตุผลของฤดูกาล",
        durationSeconds: 318,
      },
      {
        videoId: "54BGvN7N4-4",
        title: "อะไรทำให้ปากเหม็น",
        durationSeconds: 254,
      },
      {
        videoId: "JSHrFJSLsFQ",
        title: "ความทรงจำของคุณทั้งหมดเป็นเรื่องจริงหรือไม่",
        durationSeconds: 313,
      },
    ],
  },
  {
    id: "hi-2026-08",
    month: "2026-08",
    language: "hi",
    clips: [
      {
        videoId: "S4uqnKE31OA",
        title: "अगर आप पानी नहीं पीते हैं, तो क्या होगा?",
        durationSeconds: 292,
      },
      {
        videoId: "VzDBvdzXIQg",
        title: "हाथी कभी क्यों नहीं भूलते",
        durationSeconds: 324,
      },
      {
        videoId: "RiLaPLyn4SA",
        title: "शतरंज का संक्षिप्त इतिहास",
        durationSeconds: 336,
      },
      {
        videoId: "tobE1j8B89A",
        title: "आर्किमिडीज़ के ‘यूरेका!’ के पीछे की कहानी",
        durationSeconds: 284,
      },
    ],
  },
];

export function calendarMonthKey(now = new Date()) {
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

function packsForLanguage(language: LearningLanguageCode) {
  return PACKS.filter((pack) => pack.language === language).sort((a, b) =>
    a.month.localeCompare(b.month),
  );
}

export function currentLibraryPack(
  language: LearningLanguageCode,
  now = new Date(),
): LibraryPack | null {
  const month = calendarMonthKey(now);
  const packs = packsForLanguage(language).filter((pack) => pack.month <= month);
  return packs.at(-1) ?? packsForLanguage(language).at(-1) ?? null;
}

export function libraryClipByVideoId(videoId: string): LibraryClip | null {
  for (const pack of PACKS) {
    const clip = pack.clips.find((item) => item.videoId === videoId);
    if (clip) return clip;
  }
  return null;
}

export function isLibraryVideoId(videoId: string) {
  return libraryClipByVideoId(videoId) !== null;
}

export function trialEligibleVideoIds(pack: LibraryPack | null) {
  if (!pack) return [];
  return pack.clips.slice(0, FREE_CATALOG_TRIAL_COUNT).map((clip) => clip.videoId);
}

export function isTrialEligibleClip(
  videoId: string,
  language: LearningLanguageCode,
  now = new Date(),
) {
  const pack = currentLibraryPack(language, now);
  return trialEligibleVideoIds(pack).includes(videoId);
}

export function libraryWatchUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
