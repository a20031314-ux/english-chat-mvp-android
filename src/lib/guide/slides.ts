/**
 * 사용법 장 안의 넘겨 보기 장면(2026-11-14 사용자 "탭 → 칸 → 핵심 사용 장면, 넘기면 세부 — 기능이 보이는 부분만 잘라, 그림 안에 기능 이름·설명").
 * 장면 한 장 = 그림 한 장(/guide/<앱 언어>/<shot>.webp) — 스크린샷 위쪽에 문구 한 줄이 들어 있다(scripts/guide-slides/).
 * 첫 장이 그 칸의 핵심, 그 뒤가 세부. 🔊처럼 아이콘만으로 통하는 것은 설명하지 않는다.
 * /api/guide `slides=1`이 앱 언어에 그림이 있는 장만 준다 — 없는 언어·옛 빌드는 장의 예전 칸 글 그대로.
 * 칸 이름은 {ui:<키>} — 화면 문구 그대로. 그림을 다시 만들려면 scripts/guide-slides/(shoot → compose).
 */
import { SLIDE_TITLES } from "./slideTitles.ts";

/** title은 그림 안에 그려진 문구 한 줄(scripts/guide-slides/compose.mjs) — 기능이 주는 것을 "~하세요/~해요"로, 사용법 상세는 넣지 않는다(사용자 2026-11-16). 앱은 읽어 주기(alt)로만 쓴다. */
export type GuideSlide = { shot: string; title: string };
type Group = Omit<GuideSlideGroup, "slides"> & { slides: string[] };
/** covers: 이 칸이 대신하는 예전 칸 글 id — 새로워진 점 "자세히"(whatsNew guide)가 그 칸 id로 열면 이 칸을 고른 채 연다. */
export type GuideSlideGroup = {
  id: string;
  title: string;
  covers?: string[];
  slides: GuideSlide[];
};

/** 장 id → 칸들 → 장면(shot) — 모든 앱 언어가 같은 틀, 문구는 slideTitles.ts. */
const LAYOUT: Record<string, Group[]> = {
  "ai-chat": [
    {
      id: "chat",
      title: "{ui:talkAiTutor}",
      covers: [
        "chat.next",
        "chat.talk",
        "chat.stuck",
        "chat.meaning",
        "chat.analyse",
        "chat.words",
        "chat.menu",
        "chat.history",
      ],
      slides: ["tab-chat-1", "tab-chat-2", "tab-chat-3"],
    },
  ],
  messages: [
    {
      id: "talk",
      title: "{ui:homeTabTalk}",
      covers: ["talk.list", "messages.dm", "messages.groups"],
      slides: ["tab-talk-1", "tab-talk-2", "tab-talk-3"],
    },
  ],
  video: [
    {
      id: "video",
      title: "{ui:homeTabVideo}",
      covers: [
        "video.library",
        "video.subtitles",
        "video.bar",
        "video.ask",
        "video.import",
        "video.edit",
      ],
      slides: ["tab-video-1", "tab-video-2", "tab-video-3"],
    },
  ],
  people: [
    {
      id: "people",
      title: "{ui:homeTabPeople}",
      covers: [
        "people.find",
        "people.invite",
        "people.rewards",
        "people.board",
        "people.icons",
      ],
      slides: ["tab-people-1", "tab-people-2"],
    },
  ],
  rooms: [
    {
      id: "rooms",
      title: "{ui:homeTabRooms}",
      covers: [
        "room.find",
        "room.layouts",
        "room.quote",
        "room.stuck",
        "room.game",
        "room.mafia",
        "room.watch",
        "room.host",
      ],
      slides: ["tab-rooms-1", "tab-rooms-2"],
    },
  ],
  "ai-call": [
    {
      id: "talk",
      title: "📞 {ui:homeTabCall}",
      covers: ["call.talk", "call.coach"],
      slides: ["call-talk-1", "call-talk-2"],
    },
    {
      id: "past",
      title: "{ui:callRecordsTitle}",
      covers: ["call.review", "call.pause"],
      slides: ["call-past-1", "call-past-2"],
    },
  ],
  my: [
    {
      id: "keep",
      title: "{ui:keepTitle}",
      covers: ["my.start", "my.next", "my.map"],
      slides: ["my-keep-1", "my-keep-2", "my-keep-3"],
    },
    {
      id: "lang",
      title: "{ui:languagebankTitle}",
      slides: ["my-lang-1", "my-lang-2", "my-lang-3"],
    },
    {
      id: "log",
      title: "{ui:logbankTitle}",
      covers: ["my.growth", "my.graph", "my.element"],
      slides: ["my-log-1", "my-log-2", "my-log-3"],
    },
  ],
};

/** 이 앱 언어로 그림이 있는 장만(없으면 undefined) — 그림을 찍고(scripts/guide-slides/) 문구가 다 있는 언어만 READY에 넣는다. */
const READY = new Set(["ko", "en", "es", "ja", "zh", "vi", "fr", "it", "pt", "ru", "id", "ar", "th", "hi"]);
export function guideSlides(language: string): Record<string, GuideSlideGroup[]> | undefined {
  return READY.has(language) ? slidesFor(language) : undefined;
}

/** 그림을 만들 때(scripts/guide-slides/compose.mjs)는 READY와 상관없이 — 문구가 없는 언어면 undefined. */
export function slidesFor(language: string): Record<string, GuideSlideGroup[]> | undefined {
  const titles = SLIDE_TITLES[language];
  if (!titles) return undefined;
  return Object.fromEntries(
    Object.entries(LAYOUT).map(([chapter, groups]) => [chapter, groups.map((group) => ({ ...group, slides: group.slides.map((shot) => ({ shot, title: titles[shot] ?? shot })) }))]),
  );
}
