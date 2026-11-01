"use client";

/**
 * 사람끼리 통화(1:1 대화·단체방의 📞 → 비공개 방) — AI 통화와 같은 화면(사용자 2026-11-01 "AI 대화와 사용자 간 대화는 연동해서 같게").
 * 맨 위 통화 시간 · 위 칸 상대(1명이면 크게, 여럿이면 격자, 말할 때 둘레, 🙉 누른 사람은 얼굴에 🙉) · 자막 한 줄(💬 켰을 때만, AI 통화와 같은 켬/끔)
 * · 가는 선 · 아래 칸 나(말할 때 초록 둘레·막대, 마이크 끄면 🔇) · 맨 아래 버튼 줄. 영상 방이면 위·아래 칸 대신 VideoStage(stage).
 * 받아쓴 자막·댓글은 그대로 쌓이고(통화가 끝나면 대화의 통화 기록으로), 통화 중에 목록으로 보이지 않을 뿐이다.
 */
import type { ReactNode } from "react";
import { CallCaption, SpeakingRing, TalkingBars, useCallClock } from "@/components/speech/CallKit";
import { MyAvatarFace } from "@/components/account/AccountCard";
import { Face } from "./RoomParts";

export type CallPerson = {
  peerId: string;
  accountId: string | null;
  nickname: string;
  speaking: boolean;
  /** 이 사람이 마지막으로 남긴 것이 🙉(못 알아들었어요)다. */
  missed?: boolean;
};

function PersonTile({ person, size, onPerson }: { person: CallPerson; size: number; onPerson: (peerId: string, accountId: string | null) => void }) {
  return (
    <button type="button" onClick={() => onPerson(person.peerId, person.accountId)} className="flex min-w-0 flex-col items-center gap-2" aria-label={person.nickname}>
      <span className="relative">
        <SpeakingRing speaking={person.speaking}>
          <Face accountId={person.accountId} name={person.nickname} size={size} />
        </SpeakingRing>
        {person.missed ? (
          <span aria-hidden className="absolute -end-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-surface text-body shadow">
            🙉
          </span>
        ) : null}
      </span>
      <bdi className="max-w-full truncate text-body font-semibold text-ink">{person.nickname}</bdi>
    </button>
  );
}

export function RoomCallStage({
  others,
  me,
  caption,
  status,
  stage,
  onPerson,
}: {
  others: CallPerson[];
  me: { speaking: boolean; muted: boolean };
  /** 자막 한 줄(상대가 마지막에 한 말) — 켰을 때만. 여럿이면 이름도. */
  caption: { text: string; name?: string } | null;
  /** 시간 옆 상태 한 줄(연결 중 등). */
  status?: string;
  /** 영상 방이면 위·아래 칸 대신 이것(VideoStage). */
  stage?: ReactNode;
  onPerson: (peerId: string, accountId: string | null) => void;
}) {
  const clock = useCallClock();
  const size = others.length <= 1 ? 96 : others.length <= 4 ? 64 : 52;
  return (
    <div className="flex min-h-0 flex-1 flex-col" data-call-stage>
      <p className="shrink-0 px-4 pt-3 text-center text-meta tabular-nums text-slate-400">
        {clock}
        {status ? <span className="text-slate-500"> · {status}</span> : null}
      </p>
      {stage ? (
        <div className="flex min-h-0 flex-1 flex-col px-4">
          {stage}
          <div className="mt-3 min-h-[4.5rem]" aria-live="polite">
            {caption ? <CallCaption text={caption.text} name={caption.name} /> : null}
          </div>
        </div>
      ) : (
        <>
          {/* 위: 상대 */}
          <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-6 text-center" data-call-others>
            {others.length <= 1 ? (
              others[0] ? <PersonTile person={others[0]} size={size} onPerson={onPerson} /> : <span className="composing-dots inline-flex gap-1 text-slate-400" aria-hidden><span>•</span><span>•</span><span>•</span></span>
            ) : (
              <div className={`grid w-full max-w-md gap-x-3 gap-y-5 ${others.length <= 4 ? "grid-cols-2" : "grid-cols-3"}`}>
                {others.map((person) => (
                  <PersonTile key={person.peerId} person={person} size={size} onPerson={onPerson} />
                ))}
              </div>
            )}
            <div className="flex min-h-[4.5rem] w-full max-w-md flex-col items-center justify-start" aria-live="polite">
              {caption ? <CallCaption text={caption.text} name={caption.name} /> : null}
            </div>
          </section>

          <div aria-hidden className="mx-6 shrink-0 border-t border-white/10" />

          {/* 아래: 나 */}
          <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-6 text-center" data-call-me>
            <span className="relative">
              <SpeakingRing speaking={me.speaking && !me.muted} waiting={!me.muted} tone="good">
                <MyAvatarFace size={96} />
              </SpeakingRing>
              {me.muted ? (
                <span aria-hidden className="absolute -end-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-surface text-body shadow">
                  🔇
                </span>
              ) : null}
            </span>
            <TalkingBars on={me.speaking && !me.muted} />
          </section>
        </>
      )}
    </div>
  );
}
