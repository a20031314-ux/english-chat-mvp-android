"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import { roomCopy, type RoomCopy } from "@/lib/rooms/copy";
import {
  RoomApiError,
  createRoom,
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
  contextBefore,
  liveMembers,
  mergeLines,
  overlapsPrevious,
  timeline,
  type RoomLine,
  type RoomMember,
  type RoomMeta,
  type RoomRole,
  type RoomSummary,
} from "@/lib/rooms/protocol";
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
    <FullScreenLayer>
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
    </FullScreenLayer>
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

type Notice = "" | "micDenied" | "joinedAsListener" | "roomGone" | "full" | "error";

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
  const [role, setRole] = useState<RoomRole>(wantRole);
  const [muted, setMuted] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [pending, setPending] = useState(0);
  const [peerStates, setPeerStates] = useState<Record<string, PeerState>>({});
  const [notice, setNotice] = useState<Notice>("");
  const [view, setView] = useState<"timeline" | "people">("timeline");
  const [joined, setJoined] = useState(false);

  const roleRef = useRef<RoomRole>(wantRole);
  const mutedRef = useRef(false);
  const offsetRef = useRef(0);
  const sinceRef = useRef(0);
  const meshRef = useRef<RoomMesh | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureRef = useRef<SpeechCapture | null>(null);
  const aliveRef = useRef(true);

  useEffect(() => {
    mutedRef.current = muted;
    const track = streamRef.current?.getAudioTracks()[0];
    if (track) track.enabled = !muted;
  }, [muted]);

  const stopMic = useCallback(() => {
    captureRef.current?.stop();
    captureRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    meshRef.current?.setLocalTrack(null);
    setSpeaking(false);
  }, []);

  const onUtterance = useCallback(
    async (blob: Blob, mimeType: string, startedAt: number, endedAt: number) => {
      setPending((count) => count + 1);
      try {
        const text = await transcribeUtterance(blob, mimeType);
        if (!text || !aliveRef.current) return;
        const line = await postLine({
          roomId: room.id,
          peerId,
          text,
          startedAt: startedAt + offsetRef.current,
          endedAt: endedAt + offsetRef.current,
        });
        setLines((have) => mergeLines(have, [line]));
      } catch (error) {
        console.warn("[rooms] line failed", error);
      } finally {
        setPending((count) => Math.max(0, count - 1));
      }
    },
    [peerId, room.id],
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

  const changeRole = useCallback(
    async (next: RoomRole) => {
      if (next === "speaker") {
        const ok = await startMic();
        if (!ok) {
          setNotice("micDenied");
          return;
        }
      } else {
        stopMic();
      }
      roleRef.current = next;
      setRole(next);
    },
    [startMic, stopMic],
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
        });
        if (!aliveRef.current) return;
        const receivedAt = Date.now();
        offsetRef.current = result.now - (sentAt + receivedAt) / 2;
        const live = liveMembers(result.members, result.now);
        setMembers(live);
        const me = live.find((member) => member.peerId === peerId);
        if (me && me.role !== roleRef.current && roleRef.current === "speaker") {
          // 서버가 자리를 못 줬다(가득 참).
          stopMic();
          roleRef.current = me.role;
          setRole(me.role);
          setNotice("joinedAsListener");
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
        roleRef.current = result.member.role;
        setRole(result.member.role);
        if (wantRole === "speaker" && result.member.role === "listener") setNotice("joinedAsListener");
        if (result.member.role === "speaker") {
          const ok = await startMic();
          if (!ok) {
            roleRef.current = "listener";
            setRole("listener");
            setNotice("micDenied");
          }
        }
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

  const speakers = members.filter((member) => member.role === "speaker");
  const listenerCount = members.length - speakers.length;

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
                <span aria-hidden>{member.role === "listener" ? "👂" : member.muted ? "🔇" : "🎙"}</span>
                <span className={colorFor(member.peerId)} dir="auto">
                  {member.nickname}
                </span>
                {self ? <span className="text-slate-500">({t.you})</span> : null}
                {!self && state ? (
                  <span
                    title={t[state]}
                    className={`ms-0.5 inline-block h-1.5 w-1.5 rounded-full ${
                      state === "connected" ? "bg-emerald-400" : state === "failed" ? "bg-rose-400" : "bg-amber-300"
                    }`}
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
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
        <p className="shrink-0 bg-amber-400/10 px-4 py-2 text-sm text-amber-200">{t[notice]}</p>
      ) : null}

      <Lines
        t={t}
        lines={lines}
        view={view}
        selfId={peerId}
        locale={locale}
        targetLanguage={targetLanguage}
      />

      <footer className="shrink-0 space-y-2 border-t border-white/10 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3">
        <p className="text-xs text-slate-500">
          {!joined ? t.connecting : role === "listener" ? t.listenerHint : pending > 0 ? t.transcribing : t.listening}
          {role === "speaker" ? ` · ${t.earphones}` : ""}
        </p>
        <div className="flex gap-2">
          {role === "speaker" ? (
            <button
              type="button"
              onClick={() => setMuted((value) => !value)}
              className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-medium ${
                muted ? "bg-rose-500/80 text-white" : speaking ? "bg-emerald-400 text-black" : "bg-white/90 text-black"
              }`}
            >
              {muted ? t.unmute : t.mute}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => void changeRole(role === "speaker" ? "listener" : "speaker")}
            className="flex-1 rounded-xl border border-white/20 px-3 py-2.5 text-sm text-slate-200"
          >
            {role === "speaker" ? t.toListener : t.toSpeaker}
          </button>
        </div>
      </footer>
    </>
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
    return (
      <li key={line.seq}>
        <button
          type="button"
          onClick={() => void toggle(line)}
          className={`w-full rounded-xl px-3 py-2 text-start ${line.peerId === selfId ? "bg-white/[0.07]" : "bg-white/[0.03]"} hover:bg-white/10`}
        >
          {showName ? (
            <span className={`me-2 text-xs font-medium ${colorFor(line.peerId)}`} dir="auto">
              {line.nickname}
              {overlap ? <span className="ms-1 text-[10px] text-slate-500">· {t.overlap}</span> : null}
            </span>
          ) : null}
          <span className="block text-[15px] leading-snug text-white" dir="auto">
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
        <ul className="space-y-1.5">{ordered.map((line, index) => row(line, true, overlapsPrevious(ordered, index)))}</ul>
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
