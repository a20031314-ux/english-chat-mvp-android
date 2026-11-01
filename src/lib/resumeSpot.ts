/**
 * 앱을 나갔다 다시 열면 하던 자리로(사용자 2026-11-02 "학습하다가 앱을 나갔다 다시 들어오면 첫 화면으로 가").
 *
 * 안드로이드는 뒤로 가기로 나가거나 폰이 메모리 때문에 앱을 정리하면 웹 화면을 처음부터 다시 띄운다 —
 * 그때 화면 위치(하단 탭·My 칸·전체 화면·열어 둔 수업)는 메모리에만 있어 사라졌다. 이 폰에 마지막 자리를 남기고,
 * 다시 켤 때 오래되지 않았으면(FRESH_MS) 그 자리로 돌린다. 계정·서버에는 보내지 않는다(화면 위치일 뿐).
 * 문장구조 수업·대본 안의 진행은 각 화면이 따로 남기는 것(대본 "이어서 하기")을 그대로 쓴다.
 */

export type ResumeSpot = {
  at: number;
  /** 하단 탭(AppHome AppTab). */
  tab?: string;
  /** My 큰 칸 탭과 전체 화면 여부. */
  my?: { bank: string; full: boolean };
  /** 열어 둔 문장구조 수업·대본(그 학습 언어의 단계 안). */
  item?: { language: string; stage: number; id: string };
  /** 어디서나 여는 소재 수업(LessonHost, openLesson 신호). */
  lesson?: { language: string; key: string };
};

export const RESUME_KEY = "resumeSpot.v1";
/** 이보다 오래 떠나 있었으면 첫 화면부터(하루 학습 흐름은 첫 화면이 맞음). */
export const FRESH_MS = 60 * 60 * 1000;

function readRaw(): ResumeSpot | null {
  try {
    const raw = globalThis.localStorage?.getItem(RESUME_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ResumeSpot;
    return parsed && typeof parsed.at === "number" ? parsed : null;
  } catch {
    return null;
  }
}

/** 오래되지 않은 마지막 자리(없으면 null). */
export function freshSpot(now = Date.now()): ResumeSpot | null {
  const spot = readRaw();
  if (!spot || now - spot.at > FRESH_MS || spot.at > now + 60_000) return null;
  return spot;
}

/** 자리 일부를 고친다(undefined를 주면 그 칸을 지움). */
export function noteSpot(part: Partial<Omit<ResumeSpot, "at">>, now = Date.now()): void {
  try {
    const next: ResumeSpot = { ...(readRaw() ?? {}), ...part, at: now };
    for (const key of Object.keys(part) as (keyof ResumeSpot)[]) {
      if (part[key as keyof typeof part] === undefined) delete next[key];
    }
    globalThis.localStorage?.setItem(RESUME_KEY, JSON.stringify(next));
  } catch {
    // 저장이 안 되는 기기에서는 이번에만.
  }
}

/** 화면이 숨을 때(다른 앱으로) 시각만 새로 — 오래 떠난 걸 재려고. */
export function touchSpot(now = Date.now()): void {
  const spot = readRaw();
  if (spot) noteSpot({}, now);
}

/** 앱이 켜질 때의 마지막 자리(이 파일을 처음 불러올 때 한 번 읽음 — 그 뒤 화면들이 새로 남겨도 그대로). */
const LAUNCH: ResumeSpot | null = typeof window === "undefined" ? null : freshSpot();
const taken = new Set<string>();

/**
 * 다시 켤 때 그 칸을 한 번만 돌려준다(My 탭은 볼 때만 그려져 다시 그려질 때마다 같은 수업이 또 열리지 않게).
 */
export function takeSpotPart<K extends "tab" | "my" | "item" | "lesson">(part: K): ResumeSpot[K] | undefined {
  if (taken.has(part)) return undefined;
  taken.add(part);
  return LAUNCH?.[part];
}
