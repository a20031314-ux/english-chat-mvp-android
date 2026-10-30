import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { GUIDE_CLIPS_SINCE, GUIDE_EN, GUIDE_KO, GUIDE_SECTION_IDS, GUIDE_VERSION, guideChapters, type Guide } from "@/lib/guide/content";
import translations from "@/lib/guide/translations.json";
import beforeMy from "@/lib/guide/before-my.json";
import videoBefore267 from "@/lib/guide/videoBefore267.json";
import roleplayBefore267 from "@/lib/guide/roleplayBefore267.json";
import roomsBefore269 from "@/lib/guide/roomsBefore269.json";
import roomsBefore270 from "@/lib/guide/roomsBefore270.json";
import roomsBefore272 from "@/lib/guide/roomsBefore272.json";
import mapBefore269 from "@/lib/guide/mapBefore269.json";
import chatBefore271 from "@/lib/guide/chatBefore271.json";
import notesBefore273 from "@/lib/guide/notesBefore273.json";
import mapBefore274 from "@/lib/guide/mapBefore274.json";
import iconsBefore275 from "@/lib/guide/iconsBefore275.json";
import mapBefore275 from "@/lib/guide/mapBefore275.json";
import mapBefore278 from "@/lib/guide/mapBefore278.json";
import callBefore277 from "@/lib/guide/callBefore277.json";
import callBefore279 from "@/lib/guide/callBefore279.json";
import mapBefore280 from "@/lib/guide/mapBefore280.json";
import mapBefore281 from "@/lib/guide/mapBefore281.json";
import mapBefore282 from "@/lib/guide/mapBefore282.json";
import { guideOverview } from "@/lib/guide/overview";
import { bankGuides } from "@/lib/guide/banks";

export const runtime = "nodejs";

const GAME_SECTIONS = ["room.game", "room.mafia", "room.watch"];
/** My 예전 기능(오늘 해볼 것·직접 묻기)을 뺀 빌드(`r278=1`, 2026-10-27)에는 그 두 칸을 빼고 번호를 다시 매긴다. */
const RETIRED_MY_SECTIONS = ["my.next", "my.ask"];
/** 오늘의 팩을 뺀 빌드(`r279=1`, 2.76 — 무료는 대본만·대본 플랜, 2026-10-28)에는 팩 칸을 뺀다. */
const RETIRED_PACK_SECTIONS = ["call.pack"];
/** 아이콘 묶음(2026-10-23) — 그 화면이 있는 빌드(`icons=1`)만. */
const ICON_SECTIONS = ["people.icons"];

/**
 * How to use each tab, in the language the app is read in.
 *
 * The app draws whatever this returns (GuideSheet.tsx), so the guide changes
 * with a push and not a release — the reason it lives here at all. A language
 * without a translation is answered in English, never left blank.
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

export async function GET(request: NextRequest) {
  const asked = request.nextUrl.searchParams.get("lang")?.trim().toLowerCase() ?? "";
  const translated = (translations as Partial<Record<string, Guide>>)[asked];
  const newest = asked === "ko" ? GUIDE_KO : asked === "en" ? GUIDE_EN : (translated ?? GUIDE_EN);
  // 2.72(`r272=1`)부터: 프로필 칩·도움됐어요·보낸 줄 지우기·대화 목록 ⋯·게시판 ♡가 있는 글. 그 전 빌드는 화면에 없는 것을 읽지 않게
  // 그 세 칸만 예전 글(스냅숏, 칸 id로 바꿔 끼움 — 칸 순서는 그대로).
  const before272 = request.nextUrl.searchParams.get("r272") === "1"
    ? undefined
    : (roomsBefore272 as Partial<Record<string, Record<string, Guide["rooms"]["sections"][number]>>>)[asked === "ko" || asked === "en" || translated ? asked : "en"];
  // 2.73(`r273=1`)부터: 노트 뼈대·오늘의 학습. 그 전 빌드는 노트·그 밖에·사람 찾기(언어 칩)·통화(📞 바로·🗒 카드) 칸을 예전 글로(통화 시간 칸은 요금이 서버 기준이라 모두 새 글)(스냅숏, notesBefore273.json).
  const before273 = request.nextUrl.searchParams.get("r273") === "1"
    ? undefined
    : (notesBefore273 as Partial<Record<string, Record<string, Guide["map"]["sections"][number]>>>)[asked === "ko" || asked === "en" || translated ? asked : "en"];
  // 2.74(`r274=1`)부터: My "단계" 보기(예전 지도 + 노트 틀). 그 전 빌드는 눌러서 보기·지도로 보기·노트·아이콘(기본 묶음·Room 🙂) 칸을 2.73 글로(mapBefore274.json).
  const before274 = request.nextUrl.searchParams.get("r274") === "1"
    ? undefined
    : (mapBefore274 as Partial<Record<string, Record<string, Guide["map"]["sections"][number]>>>)[asked === "ko" || asked === "en" || translated ? asked : "en"];
  // 아이콘 판매가 있는 빌드(`r275=1` — 이름과 달리 2.74(88)부터, 판매를 2.74에 같이 넣음 2026-10-25): 가격·판매 신청·사기. 그 전 빌드는 아이콘 칸을 판매 줄 없는 글로(iconsBefore275.json).
  const before275 = request.nextUrl.searchParams.get("r275") === "1"
    ? undefined
    : (iconsBefore275 as Partial<Record<string, Record<string, Guide["rooms"]["sections"][number]>>>)[asked === "ko" || asked === "en" || translated ? asked : "en"];
  // 2.75(`r276=1`)부터: My 네 갈래(어휘·문법·표현·발음). 게시판 주제 칩. 그 전 빌드는 자라는 중·그래프·눌러서 보기·단계·게시판 칸을 2.74 글로(mapBefore275.json).
  const before276 = request.nextUrl.searchParams.get("r276") === "1"
    ? undefined
    : (mapBefore275 as Partial<Record<string, Record<string, Guide["map"]["sections"][number]>>>)[asked === "ko" || asked === "en" || translated ? asked : "en"];
  // 통화 기록을 채팅과 따로(`r277=1`, CallList, 2026-10-27): AI 튜터도 사람 탭에(프로필). 그 전 빌드는 대화 목록·끝난 통화·멈추고 이어서·사람 찾기 칸을 예전 글로(callBefore277.json — 🗒 카드).
  const before277 = request.nextUrl.searchParams.get("r277") === "1"
    ? undefined
    : (callBefore277 as Partial<Record<string, Record<string, Guide["map"]["sections"][number]>>>)[asked === "ko" || asked === "en" || translated ? asked : "en"];
  // My 예전 기능을 뺀 빌드(`r278=1`, 2026-10-27 — 목표 지도·직접 묻기·My의 오늘 해볼 것·노트 목차·지도에 넣기): 그 전 빌드는
  // 단계로 보기·노트·그 밖에 칸을 예전 글로(mapBefore278.json — 목표 지도 ›·주제별 노트·지도에 넣기).
  const r278 = request.nextUrl.searchParams.get("r278") === "1";
  const before278 = r278
    ? undefined
    : (mapBefore278 as Partial<Record<string, Record<string, Guide["map"]["sections"][number]>>>)[asked === "ko" || asked === "en" || translated ? asked : "en"];
  // 팩을 뺀 빌드(`r279=1`): 그 전 빌드는 말로 대화하기(팩 띠 줄)·통화 시간(무료 체험·팩)·채팅 그 밖에(무료 7번) 칸을 예전 글로(callBefore279.json).
  const r279 = request.nextUrl.searchParams.get("r279") === "1";
  const before279 = r279
    ? undefined
    : (callBefore279 as Partial<Record<string, Record<string, Guide["roleplay"]["sections"][number]>>>)[asked === "ko" || asked === "en" || translated ? asked : "en"];
  // 망·그래프를 누르면 "무엇을 공부했나" 시트가 있는 빌드(`r280=1`, 2.78, 2026-10-29): 그 전 빌드는 자라는 중·그래프 칸을 예전 글로(mapBefore280.json — 누르면 단계 보기).
  const before280 = request.nextUrl.searchParams.get("r280") === "1"
    ? undefined
    : (mapBefore280 as Partial<Record<string, Record<string, Guide["map"]["sections"][number]>>>)[asked === "ko" || asked === "en" || translated ? asked : "en"];
  // 대본 고르기·맞추기·통과 기준이 있는 빌드(`r281=1`, 2026-10-29): 그 전 빌드는 단계로 보기 칸을 🎤만 있던 글로(mapBefore281.json).
  const before281 = request.nextUrl.searchParams.get("r281") === "1"
    ? undefined
    : (mapBefore281 as Partial<Record<string, Record<string, Guide["map"]["sections"][number]>>>)[asked === "ko" || asked === "en" || translated ? asked : "en"];
  // 지속 학습 카드·0단계가 있는 빌드(`r282=1`, 2.78, 2026-10-29): 그 전 빌드는 대화로 시작·오늘 해볼 것 칸을 예전 글로(mapBefore282.json).
  const before282 = request.nextUrl.searchParams.get("r282") === "1"
    ? undefined
    : (mapBefore282 as Partial<Record<string, Record<string, Guide["map"]["sections"][number]>>>)[asked === "ko" || asked === "en" || translated ? asked : "en"];
  const withKeep282: Guide = before282
    ? { ...newest, map: { ...newest.map, sections: newest.map.sections.map((section, index) => before282[GUIDE_SECTION_IDS.map[index]] ?? section) } }
    : newest;
  const withTap281: Guide = before281
    ? { ...withKeep282, map: { ...withKeep282.map, sections: withKeep282.map.sections.map((section, index) => before281[GUIDE_SECTION_IDS.map[index]] ?? section) } }
    : withKeep282;
  const withParts280: Guide = before280
    ? { ...withTap281, map: { ...withTap281.map, sections: withTap281.map.sections.map((section, index) => before280[GUIDE_SECTION_IDS.map[index]] ?? section) } }
    : withTap281;
  const base: Guide = before279
    ? {
        ...withParts280,
        roleplay: { ...withParts280.roleplay, sections: withParts280.roleplay.sections.map((section, index) => before279[GUIDE_SECTION_IDS.roleplay[index]] ?? section) },
        chat: { ...withParts280.chat, sections: withParts280.chat.sections.map((section, index) => before279[GUIDE_SECTION_IDS.chat[index]] ?? section) },
        // 시작(my.start): 2.76부터 단계만 고르기(체크 3질문·지도 그리기 숨김, 2026-10-28 "커리큘럼과 떨어진 예전 기능 숨기기") — 그 전 빌드는 예전 글.
        map: { ...withParts280.map, sections: withParts280.map.sections.map((section, index) => before279[GUIDE_SECTION_IDS.map[index]] ?? section) },
      }
    : withParts280;
  const withMy: Guide = before278
    ? { ...base, map: { ...base.map, sections: base.map.sections.map((section, index) => before278[GUIDE_SECTION_IDS.map[index]] ?? section) } }
    : r278
      ? { ...base, map: { ...base.map, sections: renumberMy(base.map.sections) } }
      : base;
  const withCalls: Guide = before277
    ? {
        ...withMy,
        talk: { ...withMy.talk, sections: withMy.talk.sections.map((section, index) => before277[GUIDE_SECTION_IDS.talk[index]] ?? section) },
        roleplay: { ...withMy.roleplay, sections: withMy.roleplay.sections.map((section, index) => before277[GUIDE_SECTION_IDS.roleplay[index]] ?? section) },
        rooms: { ...withMy.rooms, sections: withMy.rooms.sections.map((section, index) => before277[GUIDE_SECTION_IDS.rooms[index]] ?? section) },
      }
    : withMy;
  const withParts: Guide = before276
    ? {
        ...withCalls,
        map: { ...withCalls.map, sections: withCalls.map.sections.map((section, index) => before276[GUIDE_SECTION_IDS.map[index]] ?? section) },
        rooms: { ...withCalls.rooms, sections: withCalls.rooms.sections.map((section, index) => before276[GUIDE_SECTION_IDS.rooms[index]] ?? section) },
      }
    : withCalls;
  const withSale: Guide = before275
    ? { ...withParts, rooms: { ...withParts.rooms, sections: withParts.rooms.sections.map((section, index) => before275[GUIDE_SECTION_IDS.rooms[index]] ?? section) } }
    : withParts;
  const latest: Guide = before274
    ? {
        ...withSale,
        map: { ...withSale.map, sections: withSale.map.sections.map((section, index) => before274[GUIDE_SECTION_IDS.map[index]] ?? section) },
        rooms: { ...withSale.rooms, sections: withSale.rooms.sections.map((section, index) => before274[GUIDE_SECTION_IDS.rooms[index]] ?? section) },
      }
    : withSale;
  const withNotes: Guide = before273
    ? {
        ...latest,
        map: { ...latest.map, sections: latest.map.sections.map((section, index) => before273[GUIDE_SECTION_IDS.map[index]] ?? section) },
        rooms: { ...latest.rooms, sections: latest.rooms.sections.map((section, index) => before273[GUIDE_SECTION_IDS.rooms[index]] ?? section) },
        roleplay: { ...latest.roleplay, sections: latest.roleplay.sections.map((section, index) => before273[GUIDE_SECTION_IDS.roleplay[index]] ?? section) },
      }
    : latest;
  const full: Guide = before272
    ? {
        ...withNotes,
        rooms: {
          ...withNotes.rooms,
          sections: withNotes.rooms.sections.map((section, index) => before272[GUIDE_SECTION_IDS.rooms[index]] ?? section),
        },
      }
    : withNotes;
  // 게임 칸(라이어 게임 room.game·마피아 room.mafia, 2026-10-23)은 게임이 있는 빌드(`game=1`)만. 옛 빌드는 칸 순서로 칸 이름을 붙이므로(GUIDE_SECTION_IDS)
  // 그 칸을 빼서 돌려준다 — 넣은 채로 주면 옛 앱에서 '방장이라면' 자리에 게임 글이 보인다.
  const withGame = request.nextUrl.searchParams.get("game") === "1";
  const withIcons = request.nextUrl.searchParams.get("icons") === "1";
  const hiddenIds = [...(withGame ? [] : GAME_SECTIONS), ...(withIcons ? [] : ICON_SECTIONS)];
  // 묶음(chapters)에서만 뺀다 — `tabs`는 칸 순서가 옛 빌드와 같아야 해서 그대로 둔다.
  const chapterHidden = [...hiddenIds, ...(r278 ? RETIRED_MY_SECTIONS : []), ...(r279 ? RETIRED_PACK_SECTIONS : [])];
  const hiddenAt = hiddenIds.map((id) => GUIDE_SECTION_IDS.rooms.indexOf(id)).filter((index) => index >= 0);
  const current: Guide = hiddenAt.length
    ? { ...full, rooms: { ...full.rooms, sections: full.rooms.sections.filter((_, index) => !hiddenAt.includes(index)) } }
    : full;
  const language = asked === "ko" || asked === "en" || translated ? asked : "en";
  // 2.68 이하는 탭이 "사람·말하는 방"이고 단체방·자유 대화·참여 방식이 없다: `rooms=269`를
  // 보내지 않으면 그 빌드가 보던 말하는 방 안내(스냅숏)를 준다.
  // `seat=1`(2026-10-20부터): 손들기 대신 "참여 요청", 빈자리를 눌러 올리기. 그 전 빌드는 손들기 안내(스냅숏).
  const roomsParam = request.nextUrl.searchParams.get("rooms");
  const oldRooms =
    roomsParam !== "269"
      ? (roomsBefore269 as Partial<Record<string, Guide["rooms"]>>)[language]
      : request.nextUrl.searchParams.get("seat") !== "1"
        ? (roomsBefore270 as Partial<Record<string, Guide["rooms"]>>)[language]
        : undefined;
  // 노트(My 안)도 2.69부터: 그 전 빌드에는 노트 단계가 없는 My 안내(스냅숏).
  const oldMap =
    request.nextUrl.searchParams.get("rooms") !== "269" ? (mapBefore269 as Partial<Record<string, Guide["map"]>>)[language] : undefined;
  // 고친 문장 눌러서 보기(칩, 2026-10-21)가 없는 2.68 이하 빌드(`rooms=269`를 안 보냄): 예전 채팅 안내(스냅숏, 그림 chat-correct).
  // 2.70 빌드는 칩이 있어 새 글을 받는다.
  const oldChat =
    request.nextUrl.searchParams.get("rooms") !== "269" ? (chatBefore271 as Partial<Record<string, Guide["chat"]>>)[language] : undefined;
  const tabs = { ...current, ...(oldRooms ? { rooms: oldRooms } : {}), ...(oldMap ? { map: oldMap } : {}), ...(oldChat ? { chat: oldChat } : {}) };
  // Builds before 2.67 still have the map screen, not My, and translate every
  // video line under its subtitle instead of behind the sentence bar: they
  // ask without `my=1` and get the map, chat and video pages they can see.
  if (request.nextUrl.searchParams.get("my") !== "1") {
    const old = (beforeMy as Partial<Record<string, Pick<Guide, "map" | "chat">>>)[language];
    const video = (videoBefore267 as Partial<Record<string, Guide["video"]>>)[language];
    // Nor do they have today's pack, the plans or the pictures of either.
    const roleplay = (roleplayBefore267 as Partial<Record<string, Guide["roleplay"]>>)[language];
    if (old || video || roleplay) {
      return jsonWithCors(request, {
        version: GUIDE_VERSION,
        language,
        tabs: { ...tabs, ...(old ?? {}), ...(video ? { video } : {}), ...(roleplay ? { roleplay } : {}) },
      });
    }
  }
  // `chapters=1`(하단 탭 대화·영상·사람·Room·My 빌드부터, 2026-10-20): 같은 글을 기능별 묶음으로도.
  // 옛 빌드는 묻지 않으니 `tabs`만 받는다.
  const chapters =
    request.nextUrl.searchParams.get("chapters") === "1"
      ? guideChapters(full).map((chapter) => ({
          ...chapter,
          sections: chapter.sections
            .filter((section) => !chapterHidden.includes(section.id))
            // 새 화면을 찍은 영상은 그 화면이 있는 빌드에만(옛 빌드는 그림).
            .map((section) => {
              const since = GUIDE_CLIPS_SINCE[section.id];
              if (!section.clip || !since || request.nextUrl.searchParams.get(since) === "1") return section;
              const { clip: _clip, ...rest } = section;
              return rest;
            }),
        }))
      : undefined;
  // `overview=1`(2026-10-29): 학습 흐름(영상 + 그림 셋)과 장마다 해야 할 것·할 수 있는 것 카드 — 그리는 빌드만 묻는다.
  const overview = chapters && request.nextUrl.searchParams.get("overview") === "1" ? guideOverview(language) : undefined;
  // `banks=1`(2026-10-31): My 큰 칸 셋(Stagebank·Quizbank·Logbank)의 "?" 설명(lib/guide/banks.ts) — 그 버튼이 있는 빌드만 묻는다.
  const banks = request.nextUrl.searchParams.get("banks") === "1" ? bankGuides(language) : undefined;
  return jsonWithCors(request, { version: GUIDE_VERSION, language, tabs, ...(chapters ? { chapters } : {}), ...(overview ? { overview } : {}), ...(banks ? { banks } : {}) });
}

/** 뺀 칸(RETIRED_MY_SECTIONS)을 건너뛰고 "1. …" 번호를 다시 매긴다(숫자로 시작하는 제목만, 14개 언어 모두 "n. "). */
function renumberMy(sections: Guide["map"]["sections"]): Guide["map"]["sections"] {
  let n = 0;
  return sections.map((section, index) => {
    if (RETIRED_MY_SECTIONS.includes(GUIDE_SECTION_IDS.map[index]!)) return section;
    if (!/^\d+\.\s/.test(section.heading)) return section;
    n += 1;
    return { ...section, heading: section.heading.replace(/^\d+\./, `${n}.`) };
  });
}
