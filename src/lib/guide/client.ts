import { apiUrl } from "@/lib/apiBase";
import type { UICopy } from "@/lib/copy";
import type { Guide, GuideChapter } from "@/lib/guide/content";

/**
 * 사용법 글을 받아 두는 곳(GuideSheet·WhatsNewSheet가 같이 쓴다).
 * 서버(/api/guide)가 글을 주고, 마지막으로 받은 것을 폰에 둬서 지하에서도 열린다.
 */
export type GuideData = { tabs: Guide; chapters?: GuideChapter[] };

function cacheKey(locale: string): string {
  return `guide.v2.${locale}`;
}

export function readCachedGuide(locale: string): GuideData | null {
  try {
    const raw = globalThis.localStorage?.getItem(cacheKey(locale));
    if (raw) return JSON.parse(raw) as GuideData;
    // 예전 저장(탭별 글만): 묶음 없이라도 연다.
    const old = globalThis.localStorage?.getItem(`guide.v1.${locale}`);
    return old ? { tabs: (JSON.parse(old) as { tabs: Guide }).tabs } : null;
  } catch {
    return null;
  }
}

const inFlight = new Map<string, Promise<GuideData | null>>();

/**
 * `my=1`: 2.67 이후(My 탭, 영상 번역은 문장 바). `rooms=269`: 단체방·자유 대화·참여 방식이 있는 빌드.
 * `chapters=1`: 하단 탭 대화·영상·사람·Room·My 빌드 — 같은 글을 기능별 묶음으로도 받는다.
 */
export function loadGuide(locale: string): Promise<GuideData | null> {
  const running = inFlight.get(locale);
  if (running) return running;
  const request = fetch(apiUrl(`/api/guide?lang=${encodeURIComponent(locale)}&my=1&rooms=269&chapters=1`))
    .then((response) => (response.ok ? response.json() : null))
    .then((data: Partial<GuideData> | null) => {
      if (!data?.tabs) return null;
      const kept: GuideData = { tabs: data.tabs, ...(data.chapters ? { chapters: data.chapters } : {}) };
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

/** 한 칸을 묶음에서 찾는다. */
export function findGuideSection(data: GuideData | null, id: string) {
  for (const chapter of data?.chapters ?? []) {
    const section = chapter.sections.find((row) => row.id === id);
    if (section) return { chapter, section };
  }
  return null;
}
