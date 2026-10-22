/**
 * 공개 프로필에 붙는 "나에 대한 사실"과 "프로필에 보일 것"(설계: hub/drafts/profile-2026-10-23.md).
 *
 * 모두 고정 칩 id로만 저장한다 — 화면 이름은 앱의 틀 문구(14개 언어)가 맡고, 서버는 id만 본다.
 * 자유 글은 자기소개 하나뿐이다. 학습 상태(실수·약점·교정 비율·레벨·문장)는 여기에 없고,
 * 켜는 스위치도 만들지 않는다 — 남에게 해 준 것만 공개, 내 학습 상태는 숨김.
 *
 * 다른 모듈은 상대 경로로만 가져온다(account/shared.ts와 같은 이유 — 테스트가 상대 경로만 푼다). 순수.
 */
import { isCountryCode } from "./countries.ts";

/** 관심사 칩. 순서가 화면 순서. 새 칩은 끝에 더하고, 있던 id는 바꾸지 않는다(저장된 값). */
export const INTEREST_IDS = [
  "music",
  "travel",
  "games",
  "cooking",
  "sports",
  "movies",
  "dramas",
  "books",
  "tech",
  "fashion",
  "pets",
  "photo",
  "art",
  "anime",
  "kpop",
  "food",
  "nature",
  "fitness",
  "science",
  "business",
  "history",
  "languages",
  "cafe",
  "volunteering",
] as const;
export const WORK_IDS = ["student", "worker", "freelance", "break", "other"] as const;
export const MEET_MODES = ["text", "call", "video"] as const;
export const MEET_TIMES = ["morning", "day", "evening", "night"] as const;

export type InterestId = (typeof INTEREST_IDS)[number];
export type WorkId = (typeof WORK_IDS)[number];
export type MeetMode = (typeof MEET_MODES)[number];
export type MeetTime = (typeof MEET_TIMES)[number];

export const INTERESTS_MAX = 5;
export const SPEAKS_MAX = 3;

export type ProfileFacts = {
  /** 국적(ISO 3166-1 두 글자, 화면은 국기로). 안 정했으면 null. */
  country: string | null;
  /** 모국어(앱 언어와 따로). 모르면 null — 그때 화면은 예전처럼 앱 언어를 쓴다. */
  native: string | null;
  /** 할 수 있는 언어(수준 없음), 모국어 빼고 최대 3. */
  speaks: string[];
  interests: InterestId[];
  work: WorkId | null;
  meetModes: MeetMode[];
  meetTimes: MeetTime[];
};

export const EMPTY_FACTS: ProfileFacts = {
  country: null,
  native: null,
  speaks: [],
  interests: [],
  work: null,
  meetModes: [],
  meetTimes: [],
};

/**
 * 공개 프로필의 학습 칸과 튜터 사용, 칸마다 켬/끔. 처음 값은 남이 보고 말을 걸 이유가 되는
 * 칸(도움·꾸준함·목표·함께 만든 사람)은 켬, 내 학습 내용이 드러나는 칸(주제·표현)은 끔.
 * `tutor`는 공개 칸이 아니라 "튜터가 내 관심사를 대화 소재로 써도 되는지"(본인만 보는 스위치).
 */
export const SHOW_KEYS = ["help", "streak", "goal", "maker", "topics", "phrases", "tutor"] as const;
export type ShowKey = (typeof SHOW_KEYS)[number];
export type ProfileShow = Record<ShowKey, boolean>;

export const DEFAULT_SHOW: ProfileShow = {
  help: true,
  streak: true,
  goal: true,
  maker: true,
  topics: false,
  phrases: false,
  tutor: true,
};

const LANG = /^[a-z]{2}$/;

function pickIds<T extends string>(value: unknown, allowed: readonly T[], max: number): T[] {
  const out: T[] = [];
  for (const entry of Array.isArray(value) ? value : []) {
    if (out.length >= max) break;
    if (typeof entry === "string" && (allowed as readonly string[]).includes(entry) && !out.includes(entry as T)) {
      out.push(entry as T);
    }
  }
  return out;
}

function pickLangs(value: unknown, max: number, except: string | null): string[] {
  const out: string[] = [];
  for (const entry of Array.isArray(value) ? value : []) {
    if (out.length >= max) break;
    if (typeof entry === "string" && LANG.test(entry) && entry !== except && !out.includes(entry)) out.push(entry);
  }
  return out;
}

/** 앱이 보낸 사실을 정리한다. 모르는 칩·중복·한도를 넘는 것은 버린다(오류로 막지 않음). */
export function cleanFacts(value: unknown): ProfileFacts {
  const raw = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const native = typeof raw.native === "string" && LANG.test(raw.native) ? raw.native : null;
  const country = typeof raw.country === "string" ? raw.country.toUpperCase() : null;
  return {
    country: isCountryCode(country) ? country : null,
    native,
    speaks: pickLangs(raw.speaks, SPEAKS_MAX, native),
    interests: pickIds(raw.interests, INTEREST_IDS, INTERESTS_MAX),
    work: typeof raw.work === "string" && (WORK_IDS as readonly string[]).includes(raw.work) ? (raw.work as WorkId) : null,
    meetModes: pickIds(raw.meetModes, MEET_MODES, MEET_MODES.length),
    meetTimes: pickIds(raw.meetTimes, MEET_TIMES, MEET_TIMES.length),
  };
}

/** 칸 켬/끔. 보낸 칸만 바꾸고 나머지는 지금 값(없으면 처음 값). */
export function cleanShow(value: unknown, current: Partial<ProfileShow> | undefined): ProfileShow {
  const raw = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const out = { ...DEFAULT_SHOW, ...(current ?? {}) };
  for (const key of SHOW_KEYS) {
    if (typeof raw[key] === "boolean") out[key] = raw[key] as boolean;
  }
  return out;
}

/** 저장된 값(예전 계정은 없음)을 읽는 쪽에서 쓰는 모양으로. */
export function factsOf(stored: Partial<ProfileFacts> | undefined): ProfileFacts {
  return stored ? cleanFacts(stored) : EMPTY_FACTS;
}

export function showOf(stored: Partial<ProfileShow> | undefined): ProfileShow {
  return cleanShow({}, stored);
}

/** 두 사람의 관심사 겹침 수(사람 목록 정렬·"겹치는 관심사 n"). */
export function sharedInterests(a: readonly string[], b: readonly string[]): number {
  const set = new Set(a);
  return b.filter((id) => set.has(id)).length;
}

/**
 * 튜터에게 붙이는 한 줄(영어, 모델이 읽음). 관심사·하는 일이 없거나 튜터 사용을 끄면 빈 문자열.
 * 묻거나 나열하지 말고 자연스러울 때 소재로만 — 학습 요약과 같은 "선생님이 되지 않는다" 원칙.
 * 칩 id만 넣는다(그대로 베낄 만한 예문을 넣지 않는다, hub/RULES.md).
 */
export function factsPrompt(facts: ProfileFacts, show: ProfileShow): string {
  if (!show.tutor) return "";
  const parts: string[] = [];
  if (facts.interests.length) parts.push(`interests: ${facts.interests.join(", ")}`);
  if (facts.work) parts.push(`occupation: ${facts.work}`);
  if (!parts.length) return "";
  return `About the learner (${parts.join("; ")}). Draw on these as conversation topics when it fits naturally; do not ask about them directly, list them, or mention that you know them.`;
}
