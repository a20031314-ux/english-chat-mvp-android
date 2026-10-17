"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import { roomCopy, type RoomCopy } from "@/lib/rooms/copy";
import {
  RoomApiError,
  createRoom,
  grantRole,
  howToSay,
  joinRoom,
  leaveRoom,
  listRooms,
  newPeerId,
  pollRoom,
  postLine,
  readInviteCode,
  readNickname,
  sendSignal,
  transcribeUtterance,
  translateLine,
  unlock,
  writeInviteCode,
  writeNickname,
} from "@/lib/rooms/client";
import { RoomMesh, type PeerState } from "@/lib/rooms/mesh";
import { startSpeechCapture, type SpeechCapture } from "@/lib/rooms/speech";
import {
  MAX_NICKNAME_CHARS,
  MAX_ROOM_NAME_CHARS,
  MAX_SPEAKERS,
  byPerson,
  canSeatFreely,
  contextBefore,
  liveMembers,
  mergeLines,
  overlapsPrevious,
  raisedHands,
  timeline,
  type RoomLine,
  type RoomMember,
  type RoomMeta,
  type RoomRole,
  type RoomSummary,
} from "@/lib/rooms/protocol";
import type { HowToSayExpression } from "@/lib/howToSay";
import { learningLanguageName, isLearningLanguageCode } from "@/lib/learningLanguages";

/**
 * 사용자끼리 말하는 방 (시험 기능, 숨은 입구).
 *
 * 입장 코드 → 방 목록·만들기 → 방. 방에서는 각자 자기 마이크만 받아써서
 * 줄마다 말한 사람이 정해져 있고, 대화 보기(시간 순서)와 사람별 보기 중
 * 고른다. 줄을 누르면 앞 줄을 맥락으로 내 앱 언어 번역.
 */
export function RoomsScreen({
  locale,
  targetLanguage,
  onClose,
}: {
  locale: string;
  targetLanguage: string;
  onClose: () => void;
}) {
  const t = roomCopy(locale);
  const [code, setCode] = useState(() => readInviteCode());
  const [peerId] = useState(() => newPeerId());
  const [inRoom, setInRoom] = useState<{ room: RoomSummary | RoomMeta; role: RoomRole } | null>(null);
  const [nickname, setNickname] = useState(() => readNickname());

  return (
    // 다른 전체 화면(새로워진 점 등, z-70)보다 위: 방은 사용자가 직접 연 화면이다.
    <BodyLayer>
      <div className="fixed inset-0 z-[80] flex flex-col bg-[#050505]">
      <div className="mx-auto flex h-[100dvh] w-full max-w-2xl flex-col pt-[env(safe-area-inset-top)]">
        {!code ? (
          <Shell title={t.title} onClose={onClose} t={t}>
            <Gate t={t} onUnlocked={(next) => setCode(next)} />
          </Shell>
        ) : inRoom ? (
          <RoomView
            key={inRoom.room.id}
            t={t}
            room={inRoom.room}
            wantRole={inRoom.role}
            peerId={peerId}
            nickname={nickname}
            locale={locale}
            targetLanguage={targetLanguage}
            onLeave={() => setInRoom(null)}
          />
        ) : (
          <Shell title={t.title} onClose={onClose} t={t}>
            <Lobby
              t={t}
              peerId={peerId}
              nickname={nickname}
              setNickname={(next) => {
                setNickname(next);
                writeNickname(next);
              }}
              targetLanguage={targetLanguage}
              locale={locale}
              onJoin={(room, role) => setInRoom({ room, role })}
              onBadCode={() => {
                writeInviteCode("");
                setCode("");
              }}
            />
          </Shell>
        )}
      </div>
      </div>
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

function languagesLabel(codes: string[]): string {
  return codes
    .filter(isLearningLanguageCode)
    .map((code) => learningLanguageName(code))
    .join(" ↔ ");
}

function Lobby({
  t,
  peerId,
  nickname,
  setNickname,
  targetLanguage,
  locale,
  onJoin,
  onBadCode,
}: {
  t: RoomCopy;
  peerId: string;
  nickname: string;
  setNickname: (value: string) => void;
  targetLanguage: string;
  locale: string;
  onJoin: (room: RoomSummary | RoomMeta, role: RoomRole) => void;
  onBadCode: () => void;
}) {
  const [rooms, setRooms] = useState<RoomSummary[] | null>(null);
  const [name, setName] = useState("");
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

  const named = nickname.trim().length > 0;
  const create = async () => {
    if (!named || !name.trim() || busy) return;
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
    <div className="space-y-5">
      <label className="block space-y-1.5">
        <span className="text-sm text-slate-400">{t.nickname}</span>
        <input
          value={nickname}
          maxLength={MAX_NICKNAME_CHARS}
          onChange={(event) => setNickname(event.target.value)}
          className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-white outline-none focus:border-white/40"
        />
      </label>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-300">{t.rooms}</h2>
          <button type="button" onClick={() => void refresh()} className="text-xs text-slate-400 hover:text-white">
            {t.refresh}
          </button>
        </div>
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        {rooms && rooms.length === 0 ? <p className="text-sm text-slate-500">{t.noRooms}</p> : null}
        <ul className="space-y-2">
          {(rooms ?? []).map((room) => (
            <li key={room.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-white" dir="auto">
                    {room.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {languagesLabel(room.languages)}
                    {room.languages.length ? " · " : ""}
                    {t.speakers} {room.speakers}/{MAX_SPEAKERS} · {t.listeners} {room.listeners}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  disabled={!named}
                  onClick={() => onJoin(room, "speaker")}
                  className="flex-1 rounded-lg bg-white/90 px-3 py-2 text-sm font-medium text-black disabled:opacity-40"
                >
                  {t.joinSpeak}
                </button>
                <button
                  type="button"
                  disabled={!named}
                  onClick={() => onJoin(room, "listener")}
                  className="flex-1 rounded-lg border border-white/20 px-3 py-2 text-sm text-slate-200 disabled:opacity-40"
                >
                  {t.joinListen}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2 border-t border-white/10 pt-4">
        <h2 className="text-sm font-semibold text-slate-300">{t.newRoom}</h2>
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
          disabled={!named || !name.trim() || busy}
          onClick={() => void create()}
          className="w-full rounded-xl bg-emerald-400/90 px-3 py-2.5 font-medium text-black disabled:opacity-40"
        >
          {t.create}
        </button>
      </section>
    </div>
  );
}

const PEER_COLORS = ["text-sky-300", "text-amber-300", "text-emerald-300", "text-fuchsia-300", "text-rose-300", "text-lime-300", "text-cyan-300", "text-orange-300"];

function colorFor(peerId: string): string {
  let hash = 0;
  for (const char of peerId) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return PEER_COLORS[hash % PEER_COLORS.length];
}

type Notice =
  | ""
  | "micDenied"
  | "joinedAsListener"
  | "roomGone"
  | "full"
  | "error"
  | "handUp"
  | "seatsFull"
  | "promoted"
  | "demoted";

function RoomView({
  t,
  room,
  wantRole,
  peerId,
  nickname,
  locale,
  targetLanguage,
  onLeave,
}: {
  t: RoomCopy;
  room: RoomMeta;
  wantRole: RoomRole;
  peerId: string;
  nickname: string;
  locale: string;
  targetLanguage: string;
  onLeave: () => void;
}) {
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [lines, setLines] = useState<RoomLine[]>([]);
  const [role, setRole] = useState<RoomRole>("listener");
  const [hand, setHand] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [pending, setPending] = useState(0);
  const [peerStates, setPeerStates] = useState<Record<string, PeerState>>({});
  const [notice, setNotice] = useState<Notice>("");
  const [view, setView] = useState<"timeline" | "people">("timeline");
  const [joined, setJoined] = useState(false);

  const roleRef = useRef<RoomRole>("listener");
  const handRef = useRef(false);
  const mutedRef = useRef(false);
  const offsetRef = useRef(0);
  const sinceRef = useRef(0);
  const meshRef = useRef<RoomMesh | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureRef = useRef<SpeechCapture | null>(null);
  const aliveRef = useRef(true);

  const isHost = peerId === room.hostPeerId;
  const free = canSeatFreely(peerId, room.hostPeerId, members);

  useEffect(() => {
    mutedRef.current = muted;
    const track = streamRef.current?.getAudioTracks()[0];
    if (track) track.enabled = !muted;
  }, [muted]);

  const raise = useCallback((next: boolean) => {
    handRef.current = next;
    setHand(next);
  }, []);

  const stopMic = useCallback(() => {
    captureRef.current?.stop();
    captureRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    meshRef.current?.setLocalTrack(null);
    setSpeaking(false);
  }, []);

  const addMine = useCallback((line: RoomLine) => setLines((have) => mergeLines(have, [line])), []);

  const onUtterance = useCallback(
    async (blob: Blob, mimeType: string, startedAt: number, endedAt: number) => {
      setPending((count) => count + 1);
      try {
        const text = await transcribeUtterance(blob, mimeType);
        if (!text || !aliveRef.current) return;
        addMine(
          await postLine({
            roomId: room.id,
            peerId,
            kind: "speech",
            text,
            startedAt: startedAt + offsetRef.current,
            endedAt: endedAt + offsetRef.current,
          }),
        );
      } catch (error) {
        console.warn("[rooms] line failed", error);
      } finally {
        setPending((count) => Math.max(0, count - 1));
      }
    },
    [addMine, peerId, room.id],
  );

  const startMic = useCallback(async (): Promise<boolean> => {
    if (streamRef.current) return true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      if (!aliveRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return false;
      }
      streamRef.current = stream;
      const track = stream.getAudioTracks()[0] ?? null;
      if (track) track.enabled = !mutedRef.current;
      meshRef.current?.setLocalTrack(track);
      captureRef.current = startSpeechCapture(stream, {
        onUtterance: (utterance) =>
          void onUtterance(utterance.blob, utterance.mimeType, utterance.startedAt, utterance.endedAt),
        onSpeaking: setSpeaking,
        isMuted: () => mutedRef.current,
      });
      return true;
    } catch (error) {
      console.warn("[rooms] mic failed", error);
      return false;
    }
  }, [onUtterance]);

  /** 서버가 정한 자리를 따른다(방장의 결정, 자리 부족). 마이크도 같이. */
  const adoptRole = useCallback(
    async (next: RoomRole, why: Notice) => {
      if (next === roleRef.current) return;
      roleRef.current = next;
      setRole(next);
      if (next === "speaker") {
        raise(false);
        if (!(await startMic())) {
          roleRef.current = "listener";
          setRole("listener");
          setNotice("micDenied");
          return;
        }
      } else {
        stopMic();
      }
      if (why) setNotice(why);
    },
    [raise, startMic, stopMic],
  );

  /** 내가 바꾸기: 앉기(방장·방장 없을 때) / 내려오기. 손님의 앉기는 손들기로. */
  const askRole = useCallback(
    async (next: RoomRole) => {
      if (next === "listener") {
        await adoptRole("listener", "");
        return;
      }
      // 서버가 다음 물음에서 허락하면 adoptRole로 이어진다. 마이크 권한은 미리.
      if (!(await startMic())) {
        setNotice("micDenied");
        return;
      }
      roleRef.current = "speaker";
      setRole("speaker");
    },
    [adoptRole, startMic],
  );

  // 들어가기 → 연결 준비 → 묻기 반복. 나가면 모두 정리.
  useEffect(() => {
    aliveRef.current = true;
    let timer = 0;
    const mesh = new RoomMesh(
      peerId,
      (to, kind, data) => void sendSignal(room.id, peerId, to, kind, data).catch(() => {}),
      (other, state) =>
        setPeerStates((have) => {
          const next = { ...have };
          if (state) next[other] = state;
          else delete next[other];
          return next;
        }),
    );
    meshRef.current = mesh;

    const tick = async () => {
      if (!aliveRef.current) return;
      const sentAt = Date.now();
      try {
        const result = await pollRoom({
          roomId: room.id,
          peerId,
          since: sinceRef.current,
          muted: mutedRef.current,
          role: roleRef.current,
          hand: handRef.current,
        });
        if (!aliveRef.current) return;
        const receivedAt = Date.now();
        offsetRef.current = result.now - (sentAt + receivedAt) / 2;
        const live = liveMembers(result.members, result.now);
        setMembers(live);
        const me = live.find((member) => member.peerId === peerId);
        if (me && me.role !== roleRef.current) {
          // 방장이 올리거나 내렸다(또는 앉으려 했는데 자리가 없었다). 마이크도 같이.
          await adoptRole(me.role, me.role === "speaker" ? "promoted" : "demoted");
        }
        mesh.sync(live.map((member) => member.peerId));
        for (const signal of result.signals) await mesh.handle(signal);
        if (result.lines.length) {
          sinceRef.current = Math.max(sinceRef.current, ...result.lines.map((line) => line.seq));
          setLines((have) => mergeLines(have, result.lines));
        }
      } catch (error) {
        if (error instanceof RoomApiError && error.status === 404) {
          setNotice("roomGone");
          return;
        }
      }
      if (aliveRef.current) timer = window.setTimeout(() => void tick(), 1_500);
    };

    void (async () => {
      try {
        const result = await joinRoom({ roomId: room.id, peerId, nickname: nickname.trim(), role: wantRole });
        if (!aliveRef.current) return;
        offsetRef.current = result.now - Date.now();
        raise(result.member.hand);
        if (result.member.role === "speaker") await adoptRole("speaker", "");
        else if (result.member.hand) setNotice("handUp");
        else if (wantRole === "speaker") setNotice("joinedAsListener");
        setJoined(true);
        void tick();
      } catch (error) {
        if (error instanceof RoomApiError) setNotice(error.code === "ROOM_FULL" ? "full" : error.status === 404 ? "roomGone" : "error");
        else setNotice("error");
      }
    })();

    const onHide = () => leaveRoom(room.id, peerId);
    window.addEventListener("pagehide", onHide);
    return () => {
      aliveRef.current = false;
      window.clearTimeout(timer);
      window.removeEventListener("pagehide", onHide);
      mesh.close();
      meshRef.current = null;
      stopMic();
      leaveRoom(room.id, peerId);
    };
    // 방 하나에 한 번. 이름·역할은 들어갈 때 값만 쓴다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.id, peerId]);

  const grant = async (target: string, next: RoomRole) => {
    try {
      await grantRole(room.id, peerId, target, next);
    } catch (error) {
      if (error instanceof RoomApiError && error.code === "SEATS_FULL") setNotice("seatsFull");
      else setNotice("error");
    }
  };

  const speakers = members.filter((member) => member.role === "speaker");
  const listenerCount = members.length - speakers.length;
  const hands = raisedHands(members);

  return (
    <>
      <header className="shrink-0 border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-white" dir="auto">
              {room.name}
            </h1>
            <p className="text-xs text-slate-400">
              {t.speakers} {speakers.length}/{MAX_SPEAKERS} · {t.listeners} {listenerCount}
            </p>
          </div>
          <button type="button" onClick={onLeave} className="shrink-0 rounded-lg bg-rose-500/80 px-3 py-1.5 text-sm font-medium text-white">
            {t.leave}
          </button>
        </div>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {members.map((member) => {
            const self = member.peerId === peerId;
            const state = peerStates[member.peerId];
            return (
              <li
                key={member.peerId}
                className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${
                  self && speaking ? "border-emerald-400 text-white" : "border-white/15 text-slate-200"
                }`}
              >
                <span aria-hidden>{member.role === "listener" ? (member.hand ? "✋" : "👂") : member.muted ? "🔇" : "🎙"}</span>
                <span className={colorFor(member.peerId)} dir="auto">
                  {member.nickname}
                </span>
                {member.peerId === room.hostPeerId ? <span className="text-amber-300">· {t.host}</span> : null}
                {self ? <span className="text-slate-500">({t.you})</span> : null}
                {!self && state ? (
                  <span
                    title={t[state]}
                    className={`ms-0.5 inline-block h-1.5 w-1.5 rounded-full ${
                      state === "connected" ? "bg-emerald-400" : state === "failed" ? "bg-rose-400" : "bg-amber-300"
                    }`}
                  />
                ) : null}
                {isHost && !self && member.role === "speaker" ? (
                  <button type="button" onClick={() => void grant(member.peerId, "listener")} className="ms-1 rounded bg-white/10 px-1.5 text-[11px] text-slate-200">
                    {t.demote}
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
        {isHost && hands.length > 0 ? (
          <div className="mt-2 rounded-lg border border-amber-300/30 bg-amber-300/5 px-2 py-1.5">
            <p className="mb-1 text-[11px] text-amber-200">✋ {t.hands}</p>
            <ul className="flex flex-wrap gap-1.5">
              {hands.map((member) => (
                <li key={member.peerId} className="flex items-center gap-1 text-xs text-slate-100">
                  <span dir="auto">{member.nickname}</span>
                  <button
                    type="button"
                    onClick={() => void grant(member.peerId, "speaker")}
                    className="rounded bg-amber-300/90 px-1.5 py-0.5 text-[11px] font-medium text-black"
                  >
                    {t.promote}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="mt-2 flex gap-1 rounded-lg bg-white/5 p-0.5 text-xs">
          {(["timeline", "people"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setView(option)}
              className={`flex-1 rounded-md px-2 py-1 ${view === option ? "bg-white/15 text-white" : "text-slate-400"}`}
            >
              {option === "timeline" ? t.viewTimeline : t.viewPeople}
            </button>
          ))}
        </div>
      </header>

      {notice ? (
        <button
          type="button"
          onClick={() => setNotice("")}
          className="shrink-0 bg-amber-400/10 px-4 py-2 text-start text-sm text-amber-200"
          dir="auto"
        >
          {t[notice]}
        </button>
      ) : null}

      <Lines t={t} lines={lines} view={view} selfId={peerId} locale={locale} targetLanguage={targetLanguage} />

      <footer className="shrink-0 space-y-2 border-t border-white/10 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2">
        <Composer
          t={t}
          disabled={!joined}
          locale={locale}
          targetLanguage={targetLanguage}
          recent={() => timeline(lines).slice(-6).map((line) => `${line.nickname}: ${line.text}`)}
          onSend={async (text) => {
            addMine(
              await postLine({
                roomId: room.id,
                peerId,
                kind: "text",
                text,
                startedAt: Date.now() + offsetRef.current,
                endedAt: Date.now() + offsetRef.current,
              }),
            );
          }}
        />
        <p className="text-xs text-slate-500" dir="auto">
          {!joined ? t.connecting : role === "listener" ? t.listenerHint : pending > 0 ? t.transcribing : t.listening}
          {role === "speaker" ? ` · ${t.earphones}` : ""}
        </p>
        <div className="flex gap-2">
          {role === "speaker" ? (
            <>
              <button
                type="button"
                onClick={() => setMuted((value) => !value)}
                className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-medium ${
                  muted ? "bg-rose-500/80 text-white" : speaking ? "bg-emerald-400 text-black" : "bg-white/90 text-black"
                }`}
              >
                {muted ? t.unmute : t.mute}
              </button>
              <button
                type="button"
                onClick={() => void askRole("listener")}
                className="flex-1 rounded-xl border border-white/20 px-3 py-2.5 text-sm text-slate-200"
              >
                {t.toListener}
              </button>
            </>
          ) : free ? (
            <button
              type="button"
              onClick={() => void askRole("speaker")}
              className="flex-1 rounded-xl bg-white/90 px-3 py-2.5 text-sm font-medium text-black"
            >
              {t.toSpeaker}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                raise(!hand);
                if (!hand) setNotice("handUp");
              }}
              className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-medium ${hand ? "border border-amber-300/60 text-amber-200" : "bg-amber-300/90 text-black"}`}
            >
              {hand ? t.lowerHand : `✋ ${t.raiseHand}`}
            </button>
          )}
        </div>
      </footer>
    </>
  );
}

/**
 * 댓글. 말하기 자리가 없어도, 말이 안 나와도 끼는 통로(헬로우톡의 댓글).
 * 편한 말로 쓰고 "학습 언어로"를 누르면 채팅의 표현 보기와 같은 문장이 나오고,
 * 그대로 보내거나 고쳐서 보낸다. 말하기 자리에 있으면 소리 내어 말해 봐도 된다.
 */
function Composer({
  t,
  disabled,
  locale,
  targetLanguage,
  recent,
  onSend,
}: {
  t: RoomCopy;
  disabled: boolean;
  locale: string;
  targetLanguage: string;
  recent: () => string[];
  onSend: (text: string) => Promise<void>;
}) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [suggestion, setSuggestion] = useState<HowToSayExpression | null>(null);
  const [state, setState] = useState<"" | "loading" | "failed">("");
  const input = useRef<HTMLInputElement>(null);

  const send = async (value: string) => {
    const line = value.trim();
    if (!line || busy) return;
    setBusy(true);
    try {
      await onSend(line);
      setText("");
      setSuggestion(null);
    } finally {
      setBusy(false);
    }
  };

  const suggest = async () => {
    const line = text.trim();
    if (!line) return;
    setState("loading");
    setSuggestion(null);
    try {
      const found = await howToSay({ message: line, recent: recent(), locale, targetLanguage });
      setSuggestion(found);
      setState(found ? "" : "failed");
    } catch {
      setState("failed");
    }
  };

  return (
    <div className="space-y-1.5">
      {state === "loading" ? <p className="text-xs text-slate-400">{t.howToSayLoading}</p> : null}
      {state === "failed" ? <p className="text-xs text-rose-300">{t.howToSayFailed}</p> : null}
      {suggestion ? (
        <div className="rounded-xl border border-emerald-300/30 bg-emerald-300/5 p-2.5">
          <p className="text-[15px] text-white" dir="auto">
            {suggestion.expression}
          </p>
          {suggestion.simpler ? (
            <p className="mt-0.5 text-xs text-slate-300" dir="auto">
              {t.simpler}: {suggestion.simpler}
            </p>
          ) : null}
          <p className="mt-1 text-[11px] text-slate-500">{t.sayIt}</p>
          <div className="mt-1.5 flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void send(suggestion.expression)}
              className="flex-1 rounded-lg bg-emerald-400/90 px-2 py-1.5 text-xs font-medium text-black disabled:opacity-50"
            >
              {t.sendThis}
            </button>
            <button
              type="button"
              onClick={() => {
                setText(suggestion.expression);
                setSuggestion(null);
                requestAnimationFrame(() => input.current?.focus());
              }}
              className="flex-1 rounded-lg border border-white/20 px-2 py-1.5 text-xs text-slate-200"
            >
              {t.editThis}
            </button>
          </div>
        </div>
      ) : null}
      <div className="flex gap-1.5">
        <input
          ref={input}
          value={text}
          disabled={disabled}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && !event.nativeEvent.isComposing && void send(text)}
          placeholder={t.commentPlaceholder}
          dir="auto"
          className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/40"
        />
        <button
          type="button"
          disabled={disabled || !text.trim() || state === "loading"}
          onClick={() => void suggest()}
          className="shrink-0 rounded-xl border border-emerald-300/40 px-2.5 text-xs text-emerald-200 disabled:opacity-40"
        >
          {t.howToSay}
        </button>
        <button
          type="button"
          disabled={disabled || !text.trim() || busy}
          onClick={() => void send(text)}
          className="shrink-0 rounded-xl bg-white/90 px-3 text-sm font-medium text-black disabled:opacity-40"
        >
          {t.send}
        </button>
      </div>
    </div>
  );
}

function Lines({
  t,
  lines,
  view,
  selfId,
  locale,
  targetLanguage,
}: {
  t: RoomCopy;
  lines: RoomLine[];
  view: "timeline" | "people";
  selfId: string;
  locale: string;
  targetLanguage: string;
}) {
  const [open, setOpen] = useState<Record<number, string | null>>({});
  const scroller = useRef<HTMLDivElement>(null);
  const ordered = useMemo(() => timeline(lines), [lines]);
  const groups = useMemo(() => byPerson(lines), [lines]);

  useEffect(() => {
    if (view !== "timeline") return;
    const node = scroller.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [ordered.length, view]);

  const toggle = async (line: RoomLine) => {
    if (line.seq in open) {
      setOpen((have) => {
        const next = { ...have };
        delete next[line.seq];
        return next;
      });
      return;
    }
    setOpen((have) => ({ ...have, [line.seq]: null }));
    try {
      const translated = await translateLine({
        text: line.text,
        context: contextBefore(lines, line.seq),
        locale,
        targetLanguage,
      });
      setOpen((have) => (line.seq in have ? { ...have, [line.seq]: translated || t.translateFailed } : have));
    } catch {
      setOpen((have) => (line.seq in have ? { ...have, [line.seq]: t.translateFailed } : have));
    }
  };

  const row = (line: RoomLine, showName: boolean, overlap: boolean) => {
    const translation = open[line.seq];
    const isOpen = line.seq in open;
    const typed = line.kind === "text";
    return (
      <li key={line.seq}>
        <button
          type="button"
          onClick={() => void toggle(line)}
          className={`w-full rounded-xl px-3 py-2 text-start ${
            typed ? "border border-dashed border-white/15" : ""
          } ${line.peerId === selfId ? "bg-white/[0.07]" : "bg-white/[0.03]"} hover:bg-white/10`}
        >
          {showName || typed ? (
            <span className={`me-2 text-xs font-medium ${colorFor(line.peerId)}`} dir="auto">
              {showName ? line.nickname : null}
              {typed ? <span className="ms-1 text-[10px] text-slate-500">💬 {t.comment}</span> : null}
              {overlap ? <span className="ms-1 text-[10px] text-slate-500">· {t.overlap}</span> : null}
            </span>
          ) : null}
          <span className={`block leading-snug text-white ${typed ? "text-sm" : "text-[15px]"}`} dir="auto">
            {line.text}
          </span>
          {isOpen ? (
            <span className="mt-1 block text-sm text-slate-300" dir="auto">
              {translation ?? t.translating}
            </span>
          ) : null}
        </button>
      </li>
    );
  };

  if (lines.length === 0) {
    return <p className="min-h-0 flex-1 px-4 py-6 text-sm text-slate-500">{t.noLines}</p>;
  }

  return (
    <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
      <p className="mb-2 px-1 text-[11px] text-slate-500">{t.tapToTranslate}</p>
      {view === "timeline" ? (
        <ul className="space-y-1.5">
          {ordered.map((line, index) => row(line, true, line.kind !== "text" && overlapsPrevious(ordered, index)))}
        </ul>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <section key={group.peerId}>
              <h3 className={`mb-1 px-1 text-sm font-semibold ${colorFor(group.peerId)}`} dir="auto">
                {group.nickname}
                {group.peerId === selfId ? <span className="ms-1 text-xs text-slate-500">({t.you})</span> : null}
              </h3>
              <ul className="space-y-1.5">{group.lines.map((line) => row(line, false, false))}</ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
