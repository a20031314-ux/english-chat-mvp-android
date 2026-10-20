"use client";

import { MateAskSheet } from "./MateAsk";
import { Fragment, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { NativeAdSlot } from "@/components/NativeAdSlot";
import { maybeShowInterstitial } from "@/lib/ads";
import { BodyLayer } from "@/components/FullScreenLayer";
import { AccountCard } from "@/components/account/AccountCard";
import type { UICopy } from "@/lib/copy";
import { readCachedAccount, subscribeSession } from "@/lib/account/session";
import { roomCopy, type RoomCopy } from "@/lib/rooms/copy";
import {
  RoomApiError,
  createRoom,
  dmEndCall,
  groupCall,
  groupEndCall,
  listRooms,
  listParkedRooms,
  reopenRoom,
  type ParkedRoom,
  peekRoom,
  newPeerId,
} from "@/lib/rooms/client";
import { MAX_ROOM_NAME_CHARS, MAX_SPEAKERS, type RoomMeta, type RoomRole, type RoomSummary } from "@/lib/rooms/protocol";
import { SUPPORTED_LEARNING_LANGUAGES, isLearningLanguageCode, learningLanguageUiLabel } from "@/lib/learningLanguages";
import { ROOM_FILTER_STORAGE_KEY, filterLanguages, parseRoomFilter, type RoomFilter } from "@/lib/rooms/roomFilter";
import { setMiniRoom } from "@/lib/rooms/miniRoom";
import type { RoomNote } from "@/lib/rooms/layout";
import { Face, languagePair } from "./RoomParts";
import { RoomView } from "./RoomView";
import { DmThreadView } from "./RoomDm";
import { onDmRequest, onGroupCallRequest, onRoomRequest, requestGroup } from "@/lib/rooms/openDm";

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
  visible = true,
}: {
  ui: UICopy;
  locale: string;
  targetLanguage: string;
  /**
   * 말하는 방 탭이 보이는지. 다른 탭에서도 이 화면은 떠 있어서(AppHome) 접어 둔 방의
   * 연결·마이크가 끊기지 않는다. 안 보일 때는 로비 없이 방(접혔으면 아래 막대)만.
   */
  visible?: boolean;
}) {
  const t = roomCopy(locale);
  const [peerId] = useState(() => newPeerId());
  const [inRoom, setInRoom] = useState<{ room: RoomSummary | RoomMeta; role: RoomRole; title?: string; back?: string; backGroup?: string } | null>(null);
  /** 열려 있는 1:1 대화의 상대 계정. 방 위에도 뜬다. */
  const [dmWith, setDmWith] = useState<string | null>(null);
  /** 방 줄을 집어 연 대화(쪽지)면 그 인용 — 대화 입력창 위에 붙는다. */
  const [dmNote, setDmNote] = useState<RoomNote | null>(null);
  /** 방 화면을 접고 다른 화면을 보는 중. 방에는 그대로 있다. */
  const [minimized, setMinimized] = useState(false);
  /** 막 끝난 1:1 통화의 상대 — 메이트 신청을 묻는다. */
  const [mateAsk, setMateAsk] = useState<string | null>(null);
  const closeMateAsk = useCallback(() => setMateAsk(null), []);
  /** 방에 들어간 때 — 공개 방을 몇 분 넘게 있다 나오면 전면 광고(자연스러운 끝, lib/ads.ts "roomLeave"). */
  const joinedAt = useRef(0);
  useEffect(() => {
    if (inRoom) joinedAt.current = Date.now();
  }, [inRoom]);
  const account = useSyncExternalStore(subscribeSession, readCachedAccount, () => null);
  const nickname = account?.profile.nickname || account?.username || "";

  // 접어 둔 방은 AppHome이 탭 바 위 막대로 그린다(lib/rooms/miniRoom.ts).
  const miniTitle = inRoom && account && minimized ? inRoom.title ?? inRoom.room.name : null;
  useEffect(() => {
    setMiniRoom(miniTitle === null ? null : { title: miniTitle, back: t.miniBack, open: () => setMinimized(false) });
  }, [miniTitle, t.miniBack]);
  useEffect(() => () => setMiniRoom(null), []);
  // 사람 탭의 "메시지" → 여기서 대화를 연다(방 위에도 뜬다).
  useEffect(() => onDmRequest(setDmWith), []);
  // 초대 링크의 "방 들어가기"(InviteWelcome) → 그 방을 듣는 사람으로 연다.
  useEffect(
    () =>
      onRoomRequest((roomId) => {
        void peekRoom(roomId, peerId).then((meta) => {
          if (!meta) return;
          setMinimized(false);
          setInRoom({ room: meta, role: "listener" });
        });
      }),
    [peerId],
  );
  // 단체방의 📞 → 그 단체방 사람만 들어오는 통화 방. 나오면 그 단체방 대화로.
  useEffect(
    () =>
      onGroupCallRequest((groupId, title) => {
        void groupCall(groupId, peerId).then(
          ({ room }) => {
            setMinimized(false);
            setInRoom({ room, role: "speaker", title: `📞 ${title}`, backGroup: groupId });
          },
          () => {},
        );
      }),
    [peerId],
  );

  // 대화의 📞·받기 → 둘만의 방. 끝나면 그 대화로 돌아간다.
  const joinCall = async (room: RoomMeta | string, title: string) => {
    const meta = typeof room === "string" ? await peekRoom(room, peerId) : room;
    if (!meta) return;
    setMinimized(false);
    setInRoom({ room: meta, role: "speaker", title: `📞 ${title}`, back: dmWith ?? undefined });
    setDmWith(null);
  };

  return (
    <>
      {/* 로비(방 목록·메시지)는 탭 안에, 말하는 방 탭일 때만. */}
      {visible ? (
      <div className="tb-panel flex h-full min-h-0 flex-col overflow-hidden rounded-2xl">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <h1 className="text-base font-semibold text-white">{t.title}</h1>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {account ? (
          <Lobby
            t={t}
            peerId={peerId}
            me={{ id: account.id, nickname, photo: account.profile.photo }}
            targetLanguage={targetLanguage}
            locale={locale}
            onJoin={(room, role) => {
              setMinimized(false);
              setInRoom({ room, role });
            }}
          />
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-300">{t.loginNeeded}</p>
            {/* My 탭의 계정 카드 그대로 — 누르면 로그인 시트(z-85). */}
            <AccountCard ui={ui} locale={locale} />
          </div>
        )}
      </div>
      </div>
      ) : null}

      {/* 방 안은 화면 전체(탭 바 위, 새로워진 점 z-70보다 위). 접으면 숨기기만 하고 그대로 둔다. */}
      {inRoom && account ? (
        <BodyLayer>
          <div className={`fixed inset-0 z-[80] flex-col bg-[#050505] ${minimized ? "hidden" : "flex"}`} aria-hidden={minimized}>
            <div className="mx-auto flex h-[100dvh] w-full max-w-2xl flex-col pt-[env(safe-area-inset-top)]">
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
                  const backGroup = inRoom.backGroup;
                  // 1:1·단체방 통화는 끝나고 메이트 신청·대화로 이어지므로 광고 없음 — 공개 방만.
                  if (!inRoom.room.private && !back && !backGroup) {
                    void maybeShowInterstitial("roomLeave", (Date.now() - joinedAt.current) / 1000);
                  }
                  setMinimized(false);
                  setInRoom(null);
                  if (back) {
                    setDmWith(back);
                    // 1:1 통화가 끝나면 "공부 잘 됐나요? → 메이트 신청"을 한 번(MateAsk.tsx가 이미 메이트·최근에 물었으면 건너뜀).
                    setMateAsk(back);
                  }
                  if (backGroup) requestGroup(backGroup);
                }}
                onMinimize={() => setMinimized(true)}
                onLeft={
                  inRoom.room.private
                    ? () => {
                        const { id, groupId } = inRoom.room;
                        void (groupId ? groupEndCall(groupId, id) : dmEndCall(id)).catch(() => {});
                      }
                    : undefined
                }
                onMessage={(accountId, note) => {
                  setDmNote(note ?? null);
                  setDmWith(accountId);
                }}
              />
            </div>
          </div>
        </BodyLayer>
      ) : null}

      {dmWith && account ? (
        <DmThreadView
          key={`${dmWith}:${dmNote?.seq ?? ""}`}
          note={dmNote}
          t={t}
          me={account.id}
          other={dmWith}
          peerId={peerId}
          locale={locale}
          targetLanguage={targetLanguage}
          onClose={() => {
            setDmWith(null);
            setDmNote(null);
          }}
          onJoinCall={(room, title) => void joinCall(room, title)}
        />
      ) : null}
      {account && mateAsk ? <MateAskSheet accountId={mateAsk} me={account.id} locale={locale} onClose={closeMateAsk} /> : null}
    </>
  );
}

function Lobby({
  t,
  peerId,
  me,
  targetLanguage,
  locale,
  onJoin,
}: {
  t: RoomCopy;
  peerId: string;
  me: { id: string; nickname: string; photo: string | null };
  targetLanguage: string;
  locale: string;
  onJoin: (room: RoomSummary | RoomMeta, role: RoomRole) => void;
}) {
  // 메시지는 하단 탭 "메시지"로 따로(사람과 학습, MessagesTab.tsx). 로비는 방만.
  const tab = "rooms" as const;
  const [rooms, setRooms] = useState<RoomSummary[] | null>(null);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  // 새 방의 언어: 내 조합(보통) 또는 🌐 자유 대화(방 언어 없음).
  const [freeTalk, setFreeTalk] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // 언어 조합으로 거르기 — 이 기기에서 마지막에 고른 것을 기억(없거나 못 읽으면 전체).
  const [filter, setFilterState] = useState<RoomFilter>(() => {
    try {
      return parseRoomFilter(window.localStorage.getItem(ROOM_FILTER_STORAGE_KEY));
    } catch {
      return { kind: "all" };
    }
  });
  const setFilter = (next: RoomFilter) => {
    setFilterState(next);
    setRooms(null);
    try {
      window.localStorage.setItem(ROOM_FILTER_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // 기억 못 해도 이번에는 거른다.
    }
  };
  const wanted = filterLanguages(filter, targetLanguage, locale);
  const wantedKey = wanted.join(",");

  // 내가 잠시 닫아 둔 방(다시 열기). 못 읽으면 그냥 안 보인다.
  const [parked, setParked] = useState<ParkedRoom[]>([]);
  const refresh = useCallback(async () => {
    void listParkedRooms().then(setParked, () => {});
    try {
      setRooms(await listRooms(wantedKey ? wantedKey.split(",") : []));
      setError("");
    } catch (failure) {
      setError(failure instanceof RoomApiError ? t.error : t.error);
    }
  }, [t.error, wantedKey]);

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
      const room = await createRoom(peerId, name.trim(), freeTalk ? [] : languages, freeTalk);
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
          <div className="space-y-1.5">
            <p className="text-meta text-slate-400">{t.roomLanguages}</p>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {(
                [
                  [false, languagePair([targetLanguage, locale], locale)],
                  [true, `🌐 ${t.freeTalk}`],
                ] as const
              ).map(([free, label]) => (
                <button
                  key={String(free)}
                  type="button"
                  aria-pressed={freeTalk === free}
                  onClick={() => setFreeTalk(free)}
                  className={`rounded-full border px-2.5 py-1 ${freeTalk === free ? "border-violet-300/60 bg-violet-500/25 text-white" : "border-white/15 text-slate-300"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            {freeTalk ? <p className="text-meta text-slate-400">{t.freeTalkHint}</p> : null}
          </div>
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
        {parked.length ? (
          <div className="space-y-1.5 rounded-2xl border border-white/10 bg-white/[0.02] p-2.5">
            <p className="text-xs text-slate-400">⏸ {t.parkedRooms}</p>
            {parked.map((room) => (
              <div key={room.id} className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white" dir="auto">
                    {room.name}
                  </p>
                  <p className="text-meta text-slate-500">{room.free ? `🌐 ${t.freeTalk}` : languagePair(room.languages, locale)}</p>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setBusy(true);
                    void reopenRoom(room.id, peerId)
                      .then((meta) => onJoin(meta, "speaker"), () => setError(t.error))
                      .finally(() => setBusy(false));
                  }}
                  className="shrink-0 rounded-lg bg-violet-500 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40"
                >
                  ▶ {t.reopenRoom}
                </button>
              </div>
            ))}
          </div>
        ) : null}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {(
            [
              ["all", t.filterAll],
              ["mine", `${t.filterMine} · ${languagePair([targetLanguage, locale], locale)}`],
              ["pick", `🔍 ${t.filterPick}`],
            ] as const
          ).map(([kind, label]) => (
            <button
              key={kind}
              type="button"
              aria-pressed={filter.kind === kind}
              onClick={() => setFilter(kind === "pick" ? { kind, a: filter.kind === "pick" ? filter.a : null, b: filter.kind === "pick" ? filter.b : null } : { kind })}
              className={`rounded-full border px-2.5 py-1 ${filter.kind === kind ? "border-violet-300/60 bg-violet-500/25 text-white" : "border-white/15 text-slate-300"}`}
            >
              {label}
            </button>
          ))}
        </div>
        {filter.kind === "pick" ? (
          <div className="flex items-center gap-1.5">
            {(["a", "b"] as const).map((slot, index) => (
              <div key={slot} className="contents">
                {index === 1 ? <span className="text-slate-500">↔</span> : null}
                <select
                  value={filter[slot] ?? ""}
                  aria-label={`${t.filterPick} ${index + 1}`}
                  onChange={(event) => setFilter({ ...filter, [slot]: event.target.value || null })}
                  className="min-w-0 flex-1 rounded-xl border border-white/15 bg-surface px-2 py-2 text-sm text-white"
                >
                  <option value="">{t.anyLanguage}</option>
                  {SUPPORTED_LEARNING_LANGUAGES.map((language) => (
                    <option key={language.code} value={language.code}>
                      {learningLanguageUiLabel(language.code, locale)}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        ) : null}
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        {rooms && rooms.length === 0 ? <p className="text-sm text-slate-500">{wanted.length ? t.noRoomsFilter : t.noRooms}</p> : null}
        <ul className="space-y-2.5">
          {(rooms ?? []).map((room, index) => (
            <Fragment key={room.id}>
            {/* 두 번째 방 뒤에 네이티브 광고 하나(무료·안드로이드만). 방에 들어가면 방 화면이 덮어 멈춘다. */}
            {index === 2 ? (
              <li>
                <NativeAdSlot feedId="room-lobby" slotKey="room-lobby-after-2" />
              </li>
            ) : null}
            <li>
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/[0.12] to-white/[0.02] p-3">
                <button type="button" onClick={() => onJoin(room, "speaker")} className="block w-full text-start">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {room.free ? (
                      <span className="rounded-lg bg-sky-500/25 px-1.5 py-0.5 text-meta text-sky-100">🌐 {t.freeTalk}</span>
                    ) : room.languages.length ? (
                      <span className="rounded-lg bg-black/40 px-1.5 py-0.5 text-meta text-slate-200">{languagePair(room.languages, locale)}</span>
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
            </Fragment>
          ))}
        </ul>
      </section>
      ) : null}
    </div>
  );
}
