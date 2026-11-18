import { apiUrl } from "@/lib/apiBase";
import type { UICopy } from "@/lib/copy";
import type { GuideChapter } from "@/lib/guide/content";
import type { GuideSlideGroup } from "@/lib/guide/slides";

/**
 * 사용법(GuideSheet)이 받아 두는 것: 장 목록과 장마다 넘겨 보기 장면. 서버(/api/guide)가 주고,
 * 마지막으로 받은 것을 폰에 둬서 지하에서도 열린다.
 */
export type GuideData = { chapters: GuideChapter[]; slides: Record<string, GuideSlideGroup[]> };

function cacheKey(locale: string): string {
  // v5: 장면만 쓰는 사용법(2026-11-19) — 예전 저장은 다시 받는다.
  return `guide.v5.${locale}`;
}

export function readCachedGuide(locale: string): GuideData | null {
  try {
    const raw = globalThis.localStorage?.getItem(cacheKey(locale));
    return raw ? (JSON.parse(raw) as GuideData) : null;
  } catch {
    return null;
  }
}

const inFlight = new Map<string, Promise<GuideData | null>>();

/**
 * `my=1`: 2.67 이후(My 탭, 영상 번역은 문장 바). `rooms=269`: 단체방·자유 대화·참여 방식이 있는 빌드. `seat=1`: 참여 요청·빈자리 올리기.
 * `game=1`: 방 라이어 게임(2026-10-23)이 있는 빌드 — 없으면 서버가 room.game 칸을 뺀다.
 * `icons=1`: 아이콘 묶음(2026-10-23, 지금은 1:1·단체방 🙂)이 있는 빌드 — 없으면 people.icons 칸을 뺀다.
 * `r272=1`: 2.72 화면(프로필 칩·도움됐어요·줄 지우기·게시판 ♡) — 없으면 그 세 칸은 예전 글(roomsBefore272.json).
 * `slides=1`: 장 안의 넘겨 보기 장면(lib/guide/slides.ts) — 그림이 있는 앱 언어만 온다.
 * `chapters=1`: 하단 탭 대화·영상·사람·Room·My 빌드 — 같은 글을 기능별 묶음으로도 받는다.
 */
export function loadGuide(locale: string): Promise<GuideData | null> {
  const running = inFlight.get(locale);
  if (running) return running;
  const request = fetch(apiUrl(`/api/guide?lang=${encodeURIComponent(locale)}&my=1&rooms=269&seat=1&chapters=1&game=1&icons=1&r272=1&r273=1&r274=1&r275=1&r276=1&r277=1&r278=1&r279=1&r280=1&r281=1&r282=1&r283=1&slides=1`))
    .then((response) => (response.ok ? response.json() : null))
    .then((data: Partial<GuideData> | null) => {
      if (!data?.chapters || !data.slides) return null;
      const kept: GuideData = { chapters: data.chapters, slides: data.slides };
      try {
        globalThis.localStorage?.setItem(cacheKey(locale), JSON.stringify(kept));
      } catch {
        // Fetched again next time.
      }
      return kept;
    })
    .catch(() => null)
    .finally(() => {
      inFlight.delete(locale);
    });
  inFlight.set(locale, request);
  return request;
}

/** 글 속 버튼 이름 {ui:<키>}를 이 사람의 화면 문구로. */
export function fillGuideLabels(text: string, ui: UICopy): string {
  const labels = ui as unknown as Record<string, unknown>;
  return text.replace(/\{ui:([a-zA-Z0-9]+)\}/g, (_, key: string) =>
    typeof labels[key] === "string" ? (labels[key] as string) : "",
  );
}
