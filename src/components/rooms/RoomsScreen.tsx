"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import { AccountCard } from "@/components/account/AccountCard";
import type { UICopy } from "@/lib/copy";
import { readCachedAccount, subscribeSession } from "@/lib/account/session";
import { roomCopy, type RoomCopy } from "@/lib/rooms/copy";
import {
  RoomApiError,
  createRoom,
  dmEndCall,
  listRooms,
  peekRoom,
  newPeerId,
  readInviteCode,
  unlock,
  writeInviteCode,
} from "@/lib/rooms/client";
import { MAX_ROOM_NAME_CHARS, MAX_SPEAKERS, type RoomMeta, type RoomRole, type RoomSummary } from "@/lib/rooms/protocol";
import { isLearningLanguageCode } from "@/lib/learningLanguages";
import { Face, languagePair } from "./RoomParts";
import { RoomView } from "./RoomView";
import { DmList, DmThreadView, useInbox } from "./RoomDm";

/**
 * 사용자끼리 말하는 방 (시험 기능, 숨은 입구).
 *
 * 입장 코드 → 로그인(프로필) → 방 목록·만들기 → 방. 방에서 사람은 프로필
 * 사진·닉네임으로 보이고, 누르면 프로필(팔로우·차단·신고). 각자 자기 마이크만
 * 받아써서 줄마다 말한 사람이 정해져 있다(RoomView.tsx).
 */
export function RoomsScreen({
  ui,
  locale,
  targetLanguage,
  onClose,
}: {
  ui: UICopy;
  locale: string;
  targetLanguage: string;
  onClose: () => void;
}) {
  const t = roomCopy(locale);
  const [code, setCode] = useState(() => readInviteCode());
  const [peerId] = useState(() => newPeerId());
  const [inRoom, setInRoom] = useState<{ room: RoomSummary | RoomMeta; role: RoomRole; title?: string; back?: string } | null>(null);
  /** 열려 있는 1:1 대화의 상대 계정. 방 위에도 뜬다. */
  const [dmWith, setDmWith] = useState<string | null>(null);
  const account = useSyncExternalStore(subscribeSession, readCachedAccount, () => null);
  const nickname = account?.profile.nickname || account?.username || "";

  // 대화의 📞·받기 → 둘만의 방. 끝나면 그 대화로 돌아간다.
  const joinCall = async (room: RoomMeta | string, title: string) => {
    const meta = typeof room === "string" ? await peekRoom(room, peerId) : room;
    if (!meta) return;
    setInRoom({ room: meta, role: "speaker", title: `📞 ${title}`, back: dmWith ?? undefined });
    setDmWith(null);
  };

  return (
    // 다른 전체 화면(새로워진 점 등, z-70)보다 위: 방은 사용자가 직접 연 화면이다.
    <BodyLayer>
      <div className="fixed inset-0 z-[80] flex flex-col bg-[#050505]">
        <div className="mx-auto flex h-[100dvh] w-full max-w-2xl flex-col pt-[env(safe-area-inset-top)]">
          {!code ? (
            <Shell title={t.title} onClose={onClose} t={t}>
              <Gate t={t} onUnlocked={(next) => setCode(next)} />
            </Shell>
          ) : inRoom && account ? (
            <RoomView
              key={inRoom.room.id}
              t={t}
              room={inRoom.room}
              wantRole={inRoom.role}
              peerId={peerId}
              nickname={nickname}
              locale={locale}
              targetLanguage={targetLanguage}
              title={inRoom.title}
              onLeave={() => {
                const back = inRoom.back;
                setInRoom(null);
                if (back) setDmWith(back);
              }}
              onLeft={inRoom.room.private ? () => void dmEndCall(inRoom.room.id).catch(() => {}) : undefined}
              onMessage={setDmWith}
            />
          ) : (
            <Shell title={t.title} onClose={onClose} t={t}>
              {account ? (
                <Lobby
                  t={t}
                  peerId={peerId}
                  me={{ id: account.id, nickname, photo: account.profile.photo }}
                  targetLanguage={targetLanguage}
                  locale={locale}
                  onJoin={(room, role) => setInRoom({ room, role })}
                  onMessage={setDmWith}
                  onBadCode={() => {
                    writeInviteCode("");
                    setCode("");
                  }}
                />
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-slate-300">{t.loginNeeded}</p>
                  {/* My 탭의 계정 카드 그대로 — 누르면 로그인 시트(이 화면 위, z-85). */}
                  <AccountCard ui={ui} locale={locale} />
                </div>
              )}
            </Shell>
          )}
        </div>
      </div>
      {dmWith && account ? (
        <DmThreadView
          key={dmWith}
          t={t}
          me={account.id}
          other={dmWith}
          peerId={peerId}
          locale={locale}
          targetLanguage={targetLanguage}
          onClose={() => setDmWith(null)}
          onJoinCall={(room, title) => void joinCall(room, title)}
        />
      ) : null}
    </BodyLayer>
  );
}

function Shell({ title, onClose, t, children }: { title: string; onClose: () => void; t: RoomCopy; children: React.ReactNode }) {
  return (
    <>
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <h1 className="text-base font-semibold text-white">{title}</h1>
        <button type="button" onClick={onClose} className="rounded-lg px-3 py-1.5 text-sm text-slate-300 hover:bg-white/10">
          {t.close}
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">{children}</div>
    </>
  );
}

function Gate({ t, onUnlocked }: { t: RoomCopy; onUnlocked: (code: string) => void }) {
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    const code = value.trim();
    if (!code || busy) return;
    setBusy(true);
    const ok = await unlock(code);
    setBusy(false);
    if (!ok) {
      setWrong(true);
      return;
    }
    writeInviteCode(code);
    onUnlocked(code);
  };
  return (
    <div className="mx-auto mt-8 max-w-sm space-y-3">
      <h2 className="text-lg font-semibold text-white">{t.codeTitle}</h2>
      <p className="text-sm text-slate-400">{t.codeHint}</p>
      <input
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          setWrong(false);
        }}
        onKeyDown={(event) => event.key === "Enter" && void submit()}
        placeholder={t.codePlaceholder}
        autoCapitalize="characters"
        className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-white outline-none focus:border-white/40"
      />
      {wrong ? <p className="text-sm text-rose-300">{t.codeWrong}</p> : null}
      <button
        type="button"
        onClick={() => void submit()}
        disabled={busy}
        className="w-full rounded-xl bg-white/90 px-3 py-2.5 font-medium text-black disabled:opacity-50"
      >
        {t.codeSubmit}
      </button>
    </div>
  );
}


function Lobby({
  t,
  peerId,
  me,
  targetLanguage,
  locale,
  onJoin,
  onBadCode,
  onMessage,
}: {
  t: RoomCopy;
  peerId: string;
  me: { id: string; nickname: string; photo: string | null };
  targetLanguage: string;
  locale: string;
  onJoin: (room: RoomSummary | RoomMeta, role: RoomRole) => void;
  onBadCode: () => void;
  onMessage: (accountId: string) => void;
}) {
  const [tab, setTab] = useState<"rooms" | "messages">("rooms");
  const inbox = useInbox(true);
  const [rooms, setRooms] = useState<RoomSummary[] | null>(null);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setRooms(await listRooms());
      setError("");
    } catch (failure) {
      if (failure instanceof RoomApiError && failure.code === "BAD_CODE") onBadCode();
      else setError(t.error);
    }
  }, [onBadCode, t.error]);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 8_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const create = async () => {
    if (!name.trim() || busy) return;
    setBusy(true);
    try {
      const languages = [targetLanguage, locale].filter((code, index, all) => isLearningLanguageCode(code) && all.indexOf(code) === index);
      const room = await createRoom(peerId, name.trim(), languages);
      onJoin(room, "speaker");
    } catch {
      setError(t.error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 내 프로필: 방에서 이 사진과 이름으로 보인다. */}
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
        <Face accountId={me.id} name={me.nickname} size={40} photo={me.photo} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-white" dir="auto">
            {me.nickname}
          </p>
          <p className="text-[11px] text-slate-400">{languagePair([targetLanguage, locale], locale)}</p>
        </div>
        <button
          type="button"
          onClick={() => setCreating((value) => !value)}
          className="shrink-0 rounded-xl bg-violet-500 px-3 py-2 text-sm font-medium text-white"
        >
          + {t.newRoom}
        </button>
      </div>

      <div className="flex gap-1 rounded-xl bg-white/5 p-1 text-sm">
        {(["rooms", "messages"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              setTab(option);
              if (option === "messages") inbox.refresh();
            }}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 ${tab === option ? "bg-white/15 font-medium text-white" : "text-slate-400"}`}
          >
            {option === "rooms" ? `🎙 ${t.tabRooms}` : `💬 ${t.tabMessages}`}
            {option === "messages" && inbox.unread > 0 ? (
              <span className="rounded-full bg-violet-500 px-1.5 text-[11px] font-semibold text-white">{inbox.unread}</span>
            ) : null}
          </button>
        ))}
      </div>

      {tab === "messages" ? <DmList t={t} threads={inbox.threads} onOpen={onMessage} /> : null}

      {tab === "rooms" && creating ? (
        <section className="space-y-2 rounded-2xl border border-violet-400/30 p-3">
          <input
            value={name}
            maxLength={MAX_ROOM_NAME_CHARS}
            onChange={(event) => setName(event.target.value)}
            placeholder={t.roomName}
            dir="auto"
            className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-white outline-none focus:border-white/40"
          />
          <button
            type="button"
            disabled={!name.trim() || busy}
            onClick={() => void create()}
            className="w-full rounded-xl bg-violet-500 px-3 py-2.5 font-medium text-white disabled:opacity-40"
          >
            {t.create}
          </button>
        </section>
      ) : null}

      {tab === "rooms" ? (
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-300">{t.rooms}</h2>
          <button type="button" onClick={() => void refresh()} className="text-xs text-slate-400 hover:text-white">
            {t.refresh}
          </button>
        </div>
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        {rooms && rooms.length === 0 ? <p className="text-sm text-slate-500">{t.noRooms}</p> : null}
        <ul className="space-y-2.5">
          {(rooms ?? []).map((room) => (
            <li key={room.id}>
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/[0.12] to-white/[0.02] p-3">
                <button type="button" onClick={() => onJoin(room, "speaker")} className="block w-full text-start">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {room.languages.length ? (
                      <span className="rounded-md bg-black/40 px-1.5 py-0.5 text-[11px] text-slate-200">{languagePair(room.languages, locale)}</span>
                    ) : null}
                    {room.followed ? (
                      <span className="rounded-md bg-violet-500/30 px-1.5 py-0.5 text-[11px] text-violet-100">✓ {t.followedRoom}</span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 truncate text-[16px] font-semibold text-white" dir="auto">
                    {room.name}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Face accountId={room.hostAccountId ?? null} name={room.hostNickname || "?"} size={36} />
                    <span className="min-w-0 flex-1 truncate text-sm text-slate-200" dir="auto">
                      👑 {room.hostNickname}
                    </span>
                    <span className="flex -space-x-2 rtl:space-x-reverse">
                      {room.faces.slice(1, 5).map((face, index) => (
                        <Face key={`${face.accountId ?? face.nickname}-${index}`} accountId={face.accountId} name={face.nickname} size={26} />
                      ))}
                    </span>
                    <span className="shrink-0 rounded-full bg-black/40 px-2 py-0.5 text-xs text-slate-200">
                      {room.speakers + room.listeners}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-400">
                    {t.speakers} {room.speakers}/{MAX_SPEAKERS} · {t.listeners} {room.listeners} · {t.tapToJoin}
                  </p>
                </button>
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onJoin(room, "listener")}
                    className="rounded-lg border border-white/20 px-3 py-1 text-xs text-slate-200"
                  >
                    {t.justListen}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
      ) : null}
    </div>
  );
}
