"use client";

import type { UICopy } from "@/lib/copy";
import { chatPartnerForLanguage, type TutorGender } from "@/lib/chatPartner";
import { CONVERSATION_SESSIONS_KEY, lastLineFor, normalizeConversationSession, type ConversationSession } from "@/lib/chatArchive";
import { getLearningLanguage } from "@/lib/learningLanguages";
import { useTutorGender } from "@/lib/tutorGender";
import { tutorChatRows, useFollowedTutors } from "@/lib/tutorFollows";
import { AiAvatar, CallDoors, HomeworkDot, TutorHomework, useTutorDesk, type CallKind } from "@/components/AiTutorProfile";

function savedSessions(): ConversationSession[] {
  try {
    const parsed = JSON.parse(globalThis.localStorage?.getItem(CONVERSATION_SESSIONS_KEY) ?? "[]") as unknown;
    return Array.isArray(parsed) ? parsed.map(normalizeConversationSession).filter((item): item is ConversationSession => item !== null) : [];
  } catch {
    return [];
  }
}

/**
 * 대화 목록 맨 위의 AI 튜터 줄들(사용자 2026-11-02 "튜터프로필도 아예 사람처럼 팔로우, 채팅걸기까지"):
 * 지금 고른 튜터 + 팔로우한 튜터(lib/tutorFollows.ts)마다 한 줄 — 사람 대화처럼 그 튜터와의 마지막 말, 누르면 그 튜터와의 대화(튜터별 대화방).
 */
export function AiTutorRows({
  ui,
  targetLanguage,
  canCall,
  onChat,
  onCall,
}: {
  ui: UICopy;
  targetLanguage: string;
  canCall: boolean;
  onChat: (gender: TutorGender) => void;
  onCall: (gender: TutorGender, kind: CallKind) => void;
}) {
  const chosen = useTutorGender(targetLanguage);
  const followed = useFollowedTutors(targetLanguage);
  const sessions = savedSessions();
  const code = getLearningLanguage(targetLanguage).code;
  return (
    <div className="flex flex-col gap-2">
      {tutorChatRows(chosen, followed, (["f", "m"] as const).filter((gender) => lastLineFor(sessions, code, gender, chosen))).map((gender) => (
        <AiTutorRow
          key={gender}
          ui={ui}
          targetLanguage={targetLanguage}
          gender={gender}
          last={lastLineFor(sessions, code, gender, chosen)}
          canCall={canCall}
          main={gender === chosen}
          onChat={() => onChat(gender)}
          onCall={(kind) => onCall(gender, kind)}
        />
      ))}
    </div>
  );
}

/**
 * 대화 목록의 AI 튜터 한 줄(2026-10-20, `hub/drafts/one-list-tabs.md`).
 * 2026-10-27 사용자 "AI 튜터를 아예 사람들과 통합": 사람 탭에 프로필(AiTutorProfile)이 있고, 대화 목록에는 다른 대화처럼
 * 그 사람(이름·국기)과의 대화 한 줄 — 줄을 누르면 채팅. 통화 기록 목록은 사람 탭 프로필 시트(CallList). 사람 탭이 없을 때만 채팅 ⋮.
 * 2026-11-09(시안 "튜터 화면"): 문 셋 📞 자유대화 · 🎓 수업 · 🎲 게임(같은 층, CallDoors) — 지금 고른 튜터(main)는 이름 붙은 같은 크기 버튼 + 그 튜터 숙제 줄, 다른 튜터는 아이콘 셋.
 * 숙제가 남았으면 얼굴 모서리에 점. 숫자(통화 수·고친 말)는 Logbank 몫이라 없다.
 */
export function AiTutorRow({
  ui,
  targetLanguage,
  gender,
  last,
  canCall,
  main,
  onChat,
  onCall,
}: {
  ui: UICopy;
  targetLanguage: string;
  gender: TutorGender;
  /** 그 튜터와의 마지막 말(없으면 "AI 튜터" 칩 글). */
  last: string;
  /** 이 학습 언어에 통화가 있는지. 없으면 통화 문을 두지 않는다. */
  canCall: boolean;
  /** 지금 고른 튜터 — 넓은 문 + 숙제 줄. */
  main: boolean;
  onChat: () => void;
  onCall: (kind: CallKind) => void;
}) {
  const partner = chatPartnerForLanguage(targetLanguage, gender);
  const { homework } = useTutorDesk(targetLanguage, gender);
  const open = Boolean(homework && !homework.done);
  return (
    <div data-tutor-row={main ? "main" : "other"} className="rounded-xl border border-line bg-surface p-2">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={onChat} className="flex min-w-0 flex-1 items-center gap-3 rounded-lg p-1 text-start hover:bg-white/5">
          <span className="relative shrink-0">
            <AiAvatar size={main ? 48 : 44} language={targetLanguage} gender={gender} />
            {open ? <HomeworkDot /> : null}
          </span>
          <span className="min-w-0">
            <span className="flex items-center gap-1.5 text-body font-semibold text-ink">
              <bdi className="truncate">{partner.givenName}</bdi>
              {partner.flagCountry ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`/flags/${partner.flagCountry}.png`} alt="" className="h-3.5 w-5 shrink-0 object-cover" />
              ) : null}
            </span>
            {last ? (
              <span className="block truncate text-meta text-slate-400" dir="auto">
                {last}
              </span>
            ) : (
              <span className="block truncate text-meta text-info">{ui.talkAiTutor}</span>
            )}
          </span>
        </button>
        {canCall && !main ? <CallDoors ui={ui} look="icons" onPick={onCall} /> : null}
      </div>
      {canCall && main ? <CallDoors ui={ui} className="mt-2 px-1" onPick={onCall} /> : null}
      {main && homework ? <TutorHomework ui={ui} homework={homework} className="mt-2" /> : null}
    </div>
  );
}
