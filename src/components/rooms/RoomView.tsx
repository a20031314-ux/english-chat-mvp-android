"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RoomCopy } from "@/lib/rooms/copy";
import {
  RoomApiError,
  grantRole,
  joinRoom,
  leaveRoom,
  myRelations,
  pollRoom,
  postLine,
  sendSignal,
  transcribeUtterance,
} from "@/lib/rooms/client";
import { RoomMesh, type PeerState } from "@/lib/rooms/mesh";
import { startSpeechCapture, type SpeechCapture } from "@/lib/rooms/speech";
import {
  MAX_SPEAKERS,
  canSeatFreely,
  liveMembers,
  mergeLines,
  raisedHands,
  timeline,
  type RoomLine,
  type RoomMember,
  type RoomMeta,
  type RoomRole,
} from "@/lib/rooms/protocol";
import { askPhrase } from "@/lib/rooms/quote";
import { Composer, Face, Lines, ProfileSheet, languagePair } from "./RoomParts";
import { useInbox } from "./RoomDm";
import { CALL_LAYOUT_LINES, ROOM_LAYOUTS, pendingNotes, readRoomLayout, saveRoomLayout, type RoomLayout, type RoomNote } from "@/lib/rooms/layout";

/**
 * 방 안. 위는 말하기 자리 8개(사진, 말하는 중이면 초록 테두리)와 듣는 사람 줄,
 * 가운데는 자막(대화 보기/사람별 보기), 아래는 댓글과 마이크. 사람을 누르면
 * 프로필 시트(팔로우·차단·신고, 방장이면 올리기/내리기/내보내기).
 */

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
  | "demoted"
  | "kicked"
  | "banned"
  | "loginNeeded";

export function RoomView({
  t,
  room,
  wantRole,
  peerId,
  nickname,
  locale,
  targetLanguage,
  onLeave,
  title,
  onLeft,
  onMessage,
  onMinimize,
}: {
  t: RoomCopy;
  room: RoomMeta;
  wantRole: RoomRole;
  peerId: string;
  nickname: string;
  locale: string;
  targetLanguage: string;
  onLeave: () => void;
  /** 1:1 통화면 상대 이름 등, 방 이름 대신 보일 제목. */
  title?: string;
  /** 서버에서 나간 것이 확인된 뒤(1:1 통화의 기록 남기기). */
  onLeft?: () => void;
  /** 프로필 시트의 "메시지". */
  /** note가 있으면 쪽지: 그 방 줄을 인용해 대화를 연다. */
  onMessage?: (accountId: string, note?: RoomNote) => void;
  /** 방에 있는 채로 화면만 접기(연결·마이크는 그대로, RoomsScreen이 아래 막대를 띄움). */
  onMinimize?: () => void;
}) {
  const onLeftRef = useRef(onLeft);
  useEffect(() => {
    onLeftRef.current = onLeft;
  }, [onLeft]);
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [lines, setLines] = useState<RoomLine[]>([]);
  const [role, setRole] = useState<RoomRole>("listener");
  const [hand, setHand] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [pending, setPending] = useState(0);
  const [peerStates, setPeerStates] = useState<Record<string, PeerState>>({});
  const [notice, setNotice] = useState<Notice>("");
  // 보는 방식(사람마다, 이 기기에 기억). 줄·질문·쪽지는 모두 같은 방 기록을 쓴다.
  const [layout, setLayoutState] = useState<RoomLayout>(() => readRoomLayout());
  const setLayout = (next: RoomLayout) => {
    setLayoutState(next);
    saveRoomLayout(next);
  };
  const view = layout === "people" ? "people" : "timeline";
  const [composerOpen, setComposerOpen] = useState(false);
  // 같은 방 사람이 보낸 안 읽은 쪽지·메시지 → 위에 알림(누르면 대화).
  const inbox = useInbox(true, 6_000);
  const [seenNotes, setSeenNotes] = useState<string[]>([]);
  const [joined, setJoined] = useState(false);
  /** 다른 사람이 말하는 중(소리 크기). 자리 격자의 테두리. */
  const [talking, setTalking] = useState<Record<string, boolean>>({});
  const [blocked, setBlocked] = useState<string[]>([]);
  const [sheet, setSheet] = useState<{ peerId: string; accountId: string | null; nickname: string } | null>(null);

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
  // 방장이 다시 들어오면 서버가 방장 자리를 새 peerId로 옮긴다 — 버튼 이름(방 닫기)을 맞추려고 들어갈 때 받은 값으로.
  // 집은 남의 줄 — 댓글창 위에 인용으로 붙는다(묻기면 학습 언어 질문이 미리 채워짐).
  const [quoting, setQuoting] = useState<{ line: RoomLine; ask: boolean } | null>(null);
  const [closesOnLeave, setClosesOnLeave] = useState(isHost && !room.private);
  const free = Boolean(room.private) || canSeatFreely(peerId, room.hostPeerId, members);

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
        const text = await transcribeUtterance(blob, mimeType, room.languages);
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
    [addMine, peerId, room.id, room.languages],
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
      (other, on) => setTalking((have) => ({ ...have, [other]: on })),
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
        if (error instanceof RoomApiError && (error.status === 404 || error.code === "KICKED")) {
          setNotice(error.code === "KICKED" ? "kicked" : "roomGone");
          stopMic();
          mesh.close();
          return;
        }
      }
      if (aliveRef.current) timer = window.setTimeout(() => void tick(), 1_500);
    };

    void (async () => {
      try {
        const result = await joinRoom({
          roomId: room.id,
          peerId,
          nickname: nickname.trim(),
          role: wantRole,
          langs: [targetLanguage, locale],
        });
        if (!aliveRef.current) return;
        offsetRef.current = result.now - Date.now();
        setClosesOnLeave(!result.room.private && result.room.hostPeerId === peerId);
        raise(result.member.hand);
        if (result.member.role === "speaker") await adoptRole("speaker", "");
        else if (result.member.hand) setNotice("handUp");
        else if (wantRole === "speaker") setNotice("joinedAsListener");
        setJoined(true);
        void tick();
      } catch (error) {
        if (error instanceof RoomApiError) {
          setNotice(
            error.code === "ROOM_FULL" ? "full" : error.code === "BANNED" ? "banned" : error.code === "SIGNED_OUT" ? "loginNeeded" : error.status === 404 ? "roomGone" : "error",
          );
        }
        else setNotice("error");
      }
    })();

    const onHide = () => void leaveRoom(room.id, peerId);
    window.addEventListener("pagehide", onHide);
    return () => {
      aliveRef.current = false;
      window.clearTimeout(timer);
      window.removeEventListener("pagehide", onHide);
      mesh.close();
      meshRef.current = null;
      stopMic();
      void leaveRoom(room.id, peerId).then(() => onLeftRef.current?.());
    };
    // 방 하나에 한 번. 이름·역할은 들어갈 때 값만 쓴다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.id, peerId]);

  // 내가 차단한 사람(줄 가리기). 프로필 시트에서 바꾸면 다시 읽는다.
  const loadBlocked = useCallback(() => {
    void myRelations()
      .then((mine) => setBlocked(mine.blocked))
      .catch(() => {});
  }, []);
  useEffect(() => loadBlocked(), [loadBlocked]);

  const grant = async (target: string, next: RoomRole | "out") => {
    try {
      await grantRole(room.id, peerId, target, next);
    } catch (error) {
      if (error instanceof RoomApiError && error.code === "SEATS_FULL") setNotice("seatsFull");
      else setNotice("error");
    }
  };

  const hostPeer = members.find((member) => member.peerId === room.hostPeerId) ?? null;
  const isHostNow = peerId === room.hostPeerId || (hostPeer === null && isHost);
  const speakers = members
    .filter((member) => member.role === "speaker")
    .sort((a, b) => Number(b.peerId === room.hostPeerId) - Number(a.peerId === room.hostPeerId) || a.joinedAt - b.joinedAt);
  const listeners = members.filter((member) => member.role === "listener");
  const hands = raisedHands(members);
  const sheetMember = sheet ? members.find((member) => member.peerId === sheet.peerId) ?? null : null;
  const openPerson = (target: string, accountId: string | null) => {
    const member = members.find((row) => row.peerId === target);
    const nickname = member?.nickname ?? lines.find((line) => line.peerId === target)?.nickname ?? "";
    setSheet({ peerId: target, accountId: member?.accountId ?? accountId, nickname });
  };
  const memberAccounts = members.map((member) => member.accountId).filter((id): id is string => Boolean(id));
  const notes = pendingNotes(inbox.threads, memberAccounts, seenNotes);
  const isSpeaking = (member: RoomMember) =>
    member.peerId === peerId ? speaking : Boolean(talking[member.peerId]) && !member.muted;

  return (
    <>
      <header className="shrink-0 border-b border-white/10 px-4 pb-2 pt-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-white" dir="auto">
              {title ?? room.name}
            </h1>
            <p className="text-xs text-slate-400">
              {languagePair(room.languages, locale)}
              {room.languages.length ? " · " : ""}
              {t.speakers} {speakers.length}/{MAX_SPEAKERS} · {t.listeners} {listeners.length}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {onMinimize ? (
              <button
                type="button"
                onClick={onMinimize}
                className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-slate-200"
              >
                {t.minimize}
              </button>
            ) : null}
            <button type="button" onClick={onLeave} className="rounded-lg bg-rose-500/80 px-3 py-1.5 text-sm font-medium text-white">
              {/* 방장이 나가면 서버가 방을 닫는다(1:1 통화 방은 아님). */}
              {closesOnLeave ? t.closeRoom : t.leave}
            </button>
          </div>
        </div>

        {/* 채팅 위주: 자리 격자 대신 말하는 사람 얼굴 한 줄. */}
        {layout === "chat" ? (
          <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1">
            {speakers.map((member) => (
              <button
                key={member.peerId}
                type="button"
                onClick={() => openPerson(member.peerId, member.accountId ?? null)}
                aria-label={member.nickname}
                className="shrink-0"
              >
                <Face accountId={member.accountId ?? null} name={member.nickname} size={30} speaking={isSpeaking(member)} />
              </button>
            ))}
          </div>
        ) : null}
        {/* 말하기 자리: 방장 먼저, 8자리 격자(헬로우톡처럼). 누르면 프로필. 통화 위주면 크게. */}
        <ul className={`mt-3 grid grid-cols-4 gap-x-2 ${layout === "call" ? "gap-y-4" : "gap-y-2"} ${layout === "chat" ? "hidden" : ""}`}>
          {Array.from({ length: MAX_SPEAKERS }, (_, index) => speakers[index] ?? null).map((member, index) =>
            member ? (
              <li key={member.peerId}>
                <button
                  type="button"
                  onClick={() => openPerson(member.peerId, member.accountId ?? null)}
                  className="flex w-full flex-col items-center gap-1"
                >
                  <span className="relative">
                    <Face accountId={member.accountId ?? null} name={member.nickname} size={layout === "call" ? 64 : 52} speaking={isSpeaking(member)} />
                    {member.muted ? (
                      <span className="absolute -bottom-0.5 -end-0.5 rounded-full bg-black/80 px-1 text-[11px]" aria-hidden>
                        🔇
                      </span>
                    ) : null}
                    {member.peerId !== peerId && peerStates[member.peerId] === "failed" ? (
                      <span className="absolute -top-0.5 -end-0.5 h-2.5 w-2.5 rounded-full bg-rose-400" title={t.failed} />
                    ) : null}
                  </span>
                  <span className="flex max-w-full items-center gap-0.5 truncate text-[11px] text-slate-200" dir="auto">
                    {member.peerId === room.hostPeerId ? <span aria-hidden>👑</span> : null}
                    <span className="truncate">{member.peerId === peerId ? t.you2 : member.nickname}</span>
                  </span>
                </button>
              </li>
            ) : (
              <li key={`empty-${index}`} className="flex flex-col items-center gap-1">
                <span
                  className={`flex items-center justify-center rounded-full border border-dashed border-white/15 text-lg text-slate-600 ${
                    layout === "call" ? "h-16 w-16" : "h-[52px] w-[52px]"
                  }`}
                >
                  +
                </span>
                <span className="text-[11px] text-slate-600">{t.emptySeat}</span>
              </li>
            ),
          )}
        </ul>

        {/* 듣는 사람 줄: 작은 얼굴들. 손든 사람은 ✋. */}
        {listeners.length ? (
          <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="shrink-0 text-[11px] text-slate-500">
              {t.listenersRow} {listeners.length}
            </span>
            {listeners.map((member) => (
              <button
                key={member.peerId}
                type="button"
                onClick={() => openPerson(member.peerId, member.accountId ?? null)}
                className="relative shrink-0"
                aria-label={member.nickname}
              >
                <Face accountId={member.accountId ?? null} name={member.nickname} size={30} />
                {member.hand ? (
                  <span className="absolute -top-1 -end-1 text-[11px]" aria-hidden>
                    ✋
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        ) : null}

        {isHostNow && hands.length > 0 ? (
          <div className="mt-2 rounded-lg border border-amber-300/30 bg-amber-300/5 px-2 py-1.5">
            <p className="mb-1 text-[11px] text-amber-200">✋ {t.hands}</p>
            <ul className="flex flex-wrap gap-1.5">
              {hands.map((member) => (
                <li key={member.peerId} className="flex items-center gap-1 text-xs text-slate-100">
                  <Face accountId={member.accountId ?? null} name={member.nickname} size={20} />
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
          {ROOM_LAYOUTS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={layout === option}
              onClick={() => setLayout(option)}
              className={`flex-1 truncate rounded-md px-1.5 py-1 ${layout === option ? "bg-white/15 text-white" : "text-slate-400"}`}
            >
              {option === "group" ? t.viewTimeline : option === "people" ? t.viewPeople : option === "chat" ? t.layoutChat : t.layoutCall}
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

      {notes.length ? (
        <button
          type="button"
          onClick={() => {
            const note = notes[0];
            setSeenNotes((have) => [...have, `${note.thread.id}:${note.thread.lastSeq}`]);
            onMessage?.(note.other);
          }}
          className="shrink-0 bg-sky-400/10 px-4 py-2 text-start text-sm text-sky-100"
          dir="auto"
        >
          ✉ {t.noteFrom.replace("{name}", members.find((member) => member.accountId === notes[0].other)?.nickname ?? "")}
        </button>
      ) : null}

      <Lines
        big={layout === "chat"}
        onNote={
          onMessage
            ? (line) => {
                if (line.accountId) onMessage(line.accountId, { roomId: room.id, seq: line.seq, nickname: line.nickname, text: line.text });
              }
            : undefined
        }
        t={t}
        lines={layout === "call" ? timeline(lines).slice(-CALL_LAYOUT_LINES) : lines}
        view={view}
        selfId={peerId}
        locale={locale}
        targetLanguage={targetLanguage}
        blocked={blocked}
        onPerson={openPerson}
        onQuote={(line, ask) => setQuoting({ line, ask })}
      />

      <footer className="shrink-0 space-y-2 border-t border-white/10 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2">
        {layout === "call" && !composerOpen && !quoting ? (
          <button
            type="button"
            onClick={() => setComposerOpen(true)}
            className="w-full rounded-xl border border-white/15 px-3 py-2 text-start text-sm text-slate-400"
          >
            💬 {t.writeComment}
          </button>
        ) : (
        <Composer
          key={quoting ? `q${quoting.line.seq}${quoting.ask ? "a" : "r"}` : "plain"}
          quote={quoting ? { nickname: quoting.line.nickname, text: quoting.line.text, ask: quoting.ask } : null}
          onClearQuote={() => setQuoting(null)}
          initialText={quoting?.ask ? askPhrase(targetLanguage) : ""}
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
                ...(quoting ? { quoteSeq: quoting.line.seq, ask: quoting.ask } : {}),
              }),
            );
            setQuoting(null);
          }}
        />
        )}
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
              {/* 방장은 내려가지 않는다(서버도 막음). 조용히 하려면 마이크 끄기. */}
              {isHostNow ? null : (
                <button
                  type="button"
                  onClick={() => void askRole("listener")}
                  className="flex-1 rounded-xl border border-white/20 px-3 py-2.5 text-sm text-slate-200"
                >
                  {t.toListener}
                </button>
              )}
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

      {sheet ? (
        <ProfileSheet
          t={t}
          locale={locale}
          member={sheetMember}
          accountId={sheet.accountId}
          nickname={sheet.nickname}
          isHostView={isHostNow && sheet.peerId !== peerId && sheet.peerId !== room.hostPeerId && sheetMember !== null}
          roomId={room.id}
          recentLines={lines.filter((line) => line.peerId === sheet.peerId).slice(-5).map((line) => line.text)}
          onClose={() => setSheet(null)}
          onGrant={(next) => {
            void grant(sheet.peerId, next);
            setSheet(null);
          }}
          onBlockedChange={loadBlocked}
          onMessage={onMessage}
        />
      ) : null}
    </>
  );
}
