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
 * TED-Ed clips are short, captioned, speech-heavy English lessons.
 */
const PACKS: LibraryPack[] = [
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
