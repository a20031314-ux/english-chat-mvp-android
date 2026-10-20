"use client";

import { InviteButton } from "@/components/invite/InviteButton";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RoomCopy } from "@/lib/rooms/copy";
import {
  RoomApiError,
  grantRole,
  groupCreate,
  pauseRoom,
  transferHost,
  joinRoom,
  leaveRoom,
  myRelations,
  pollRoom,
  postLine,
  sendSignal,
  fetchIceServers,
  transcribeUtterance,
  howToSay,
} from "@/lib/rooms/client";
import { RoomMesh, type PeerState } from "@/lib/rooms/mesh";
import { startSpeechCapture, type SpeechCapture, type Utterance } from "@/lib/rooms/speech";
import { joinPartTexts } from "@/lib/rooms/speechParts";
import {
  MAX_SPEAKERS,
  canSeatFreely,
  directLine,
  joinParts,
  liveMembers,
  mergeLines,
  raisedHands,
  timeline,
  type RoomLine,
  type RoomMember,
  type RoomMeta,
  type RoomRole,
} from "@/lib/rooms/protocol";
import { askPhraseAbout } from "@/lib/rooms/quote";
import { cleanLanguages } from "@/lib/rooms/roomFilter";
import { leansOnOwnLanguage, whichLanguage } from "@/lib/roleplay/transcript";
import { BodyLayer } from "@/components/FullScreenLayer";
import { Composer, Face, Lines, ProfileSheet, languagePair } from "./RoomParts";
import { useInbox } from "./RoomDm";
import { VideoStage } from "./VideoStage";
import { CALL_LAYOUT_LINES, ROOM_HINT_MODES, ROOM_LAYOUTS, pendingNotes, readRoomHintMode, readRoomLayout, saveRoomHintMode, saveRoomLayout, type RoomHintMode, type RoomLayout, type RoomNote } from "@/lib/rooms/layout";

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
  | "loginNeeded"
  | "becameHost"
  | "cameraDenied"
  | "cameraPaused";

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
  minimized = false,
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
  /** 접혀 있는 동안(영상 방이면 카메라를 끈다 — 소리는 그대로). */
  minimized?: boolean;
}) {
  const onLeftRef = useRef(onLeft);
  useEffect(() => {
    onLeftRef.current = onLeft;
  }, [onLeft]);
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [lines, setLines] = useState<RoomLine[]>([]);
  // 방이 닫혔거나(방장이 닫음·잠시 닫음) 내보내졌으면 방 화면 대신 안내만 — 자리·자막·입력창이 남아 열린 방처럼 보이지 않게(qa 2026-10-20).
  const [ended, setEnded] = useState<null | "roomGone" | "kicked" | "banned">(null);
  const linesRef = useRef<RoomLine[]>([]);
  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);
  // 💡 힌트(본인만): 내 줄 번호 → 배우는 언어 문장. 화면에만 두고 저장하지 않는다.
  const [hints, setHints] = useState<Record<number, string>>({});
  const [hintMode, setHintModeState] = useState<RoomHintMode>(() => readRoomHintMode());
  const hintModeRef = useRef(hintMode);
  const setHintMode = (mode: RoomHintMode) => {
    hintModeRef.current = mode;
    setHintModeState(mode);
    saveRoomHintMode(mode);
  };
  const [role, setRole] = useState<RoomRole>("listener");
  const [hand, setHand] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [pending, setPending] = useState(0);
  // 오늘 자막 줄을 다 쓰면(서버 CAPTION_LIMIT, billing/plans.ts) 이 방에서는 받아쓰기를 멈춘다. 음성은 그대로.
  const [captionsOff, setCaptionsOff] = useState(false);
  const captionsOffRef = useRef(false);
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
  // 참여 방식(사람마다): 💬 채팅만 = 소리를 잇지 않음, 🔇 보이스만 = 채팅 칸을 숨김.
  const [textOnly, setTextOnly] = useState(false);
  const textOnlyRef = useRef(false);
  const [hideChat, setHideChat] = useState(false);
  const [seenAsk, setSeenAsk] = useState(0);
  const [toast, setToast] = useState("");
  const handRef = useRef(false);
  const mutedRef = useRef(false);
  const offsetRef = useRef(0);
  // 쉼마다 자른 조각(speechParts.ts): 말 번호마다 받아쓴 조각 글, 첫 줄 번호, 아직 받아쓰는 중인 조각 수, 끝난 말.
  const partTextRef = useRef(new Map<string, string[]>());
  const firstSeqRef = useRef(new Map<string, number>());
  const inflightRef = useRef(new Map<string, number>());
  const endedUtteranceRef = useRef(new Set<string>());
  /** 내가 말하는 중이거나 아직 받아쓰는 중인 말 — 내 "…" 말풍선. */
  const [selfComposing, setSelfComposing] = useState<string | null>(null);
  /**
   * 다른 사람이 말하는 중(소리 크기, mesh) → 그 사람 "…" 말풍선. 말이 멈추고 그 뒤 줄이 오면 지우고,
   * 줄이 안 오면(기침·받아쓸 것 없음) 잠시 뒤 지운다. 시각은 이 기기 시계.
   */
  const [composingOthers, setComposingOthers] = useState<Record<string, { talking: boolean; lastVoice: number }>>({});
  const membersRef = useRef<RoomMember[]>([]);

  // 다른 사람의 "…": 말이 멈춘 뒤 그 사람 줄이 오면 거두고, 7초 안에 안 오면(받아쓸 말이 없었음) 거둔다.
  useEffect(() => {
    setComposingOthers((have) => {
      let changed = false;
      const next: typeof have = {};
      for (const [other, row] of Object.entries(have)) {
        const since = row.lastVoice + offsetRef.current - 2_500;
        const answered = !row.talking && lines.some((line) => line.peerId === other && line.kind !== "text" && line.endedAt >= since);
        if (answered) changed = true;
        else next[other] = row;
      }
      return changed ? next : have;
    });
  }, [lines]);
  const anyComposing = Object.keys(composingOthers).length > 0;
  useEffect(() => {
    if (!anyComposing) return;
    const timer = window.setInterval(() => {
      const now = Date.now();
      setComposingOthers((have) => {
        let changed = false;
        const next: typeof have = {};
        for (const [other, row] of Object.entries(have)) {
          if (!row.talking && now - row.lastVoice > 7_000) changed = true;
          else next[other] = row;
        }
        return changed ? next : have;
      });
    }, 1_000);
    return () => window.clearInterval(timer);
  }, [anyComposing]);
  const sinceRef = useRef(0);
  const meshRef = useRef<RoomMesh | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureRef = useRef<SpeechCapture | null>(null);
  const aliveRef = useRef(true);
  // 영상 방(1:1·러닝메이트 통화): 상대 영상과 내 카메라. 카메라는 기본 꺼짐.
  const videoRoom = Boolean(room.video);
  const [remoteVideo, setRemoteVideo] = useState<Record<string, MediaStream | null>>({});
  const [camera, setCamera] = useState<MediaStream | null>(null);
  const cameraRef = useRef<MediaStream | null>(null);
  const [videoHidden, setVideoHidden] = useState(false);

  const isHost = peerId === room.hostPeerId;
  // 지금 방장(넘기기·다시 들어오기로 바뀐다 — 들어갈 때와 물을 때마다 서버 값으로).
  const [hostPeerId, setHostPeerId] = useState(room.hostPeerId);
  const hostRef = useRef(room.hostPeerId);
  const [leaving, setLeaving] = useState<"" | "choose" | "pick">("");
  // 방장이 빈자리를 눌렀을 때 올릴 사람 고르기(참여 요청한 사람 먼저, 그다음 듣는 사람).
  const [seatPick, setSeatPick] = useState(false);
  // 방장이 다시 들어오면 서버가 방장 자리를 새 peerId로 옮긴다 — 버튼 이름(방 닫기)을 맞추려고 들어갈 때 받은 값으로.
  // 집은 남의 줄 — 댓글창 위에 인용으로 붙는다(묻기면 학습 언어 질문이 미리 채워짐).
  const [quoting, setQuoting] = useState<{ line: RoomLine; ask: boolean; focus?: string } | null>(null);
  const free = Boolean(room.private) || canSeatFreely(peerId, hostPeerId, members);
  const closesOnLeave = !room.private && hostPeerId === peerId;

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

  const stopCamera = useCallback((why?: Notice) => {
    const had = cameraRef.current;
    if (!had) return;
    had.getTracks().forEach((track) => track.stop());
    cameraRef.current = null;
    setCamera(null);
    meshRef.current?.setLocalVideo(null);
    if (why) setNotice(why);
  }, []);

  const startCamera = useCallback(async () => {
    if (cameraRef.current || !videoRoom) return;
    try {
      // 1:1이라 화질은 적당히(360~480p·15fps) — 모바일 데이터·발열(mesh.ts VIDEO_MAX_BITRATE).
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 15, max: 24 } },
      });
      if (!aliveRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      cameraRef.current = stream;
      setCamera(stream);
      meshRef.current?.setLocalVideo(stream.getVideoTracks()[0] ?? null);
    } catch (error) {
      console.warn("[rooms] camera failed", error);
      setNotice("cameraDenied");
    }
  }, [videoRoom]);

  // 접거나 앱을 뒤로 보내면 카메라는 끈다(소리는 이어짐). 다시 켜는 건 사람이.
  useEffect(() => {
    if (minimized) stopCamera("cameraPaused");
  }, [minimized, stopCamera]);
  useEffect(() => {
    if (!videoRoom) return;
    const onVisibility = () => {
      if (document.visibilityState === "hidden") stopCamera("cameraPaused");
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [videoRoom, stopCamera]);

  const addMine = useCallback((line: RoomLine) => setLines((have) => mergeLines(have, [line])), []);
  const speakerLanguages = useMemo(
    () => cleanLanguages([targetLanguage, locale]),
    [targetLanguage, locale],
  );

  /** 끝난 말이고 받아쓰는 조각이 없으면 내 "…"를 거두고 조각 기록을 비운다. */
  const settleUtterance = useCallback((uid: string) => {
    if (!endedUtteranceRef.current.has(uid) || (inflightRef.current.get(uid) ?? 0) > 0) return;
    setSelfComposing((have) => (have === uid ? null : have));
    endedUtteranceRef.current.delete(uid);
    inflightRef.current.delete(uid);
    partTextRef.current.delete(uid);
    // 첫 줄 번호는 힌트가 나중 조각에서 올 수 있어 조금 더 둔다(작은 Map이라 방을 나갈 때 함께 사라짐).
  }, []);

  const onUtterance = useCallback(
    async (piece: Utterance) => {
      if (captionsOffRef.current) return;
      const uid = piece.utterance;
      setPending((count) => count + 1);
      inflightRef.current.set(uid, (inflightRef.current.get(uid) ?? 0) + 1);
      try {
        // 자유 대화방은 방 언어가 없어서 말하는 나의 두 언어(배우는 언어·앱 언어)로 받아쓴다.
        const languages = room.free ? speakerLanguages : room.languages;
        // 뒷조각이면 앞 조각에서 받아쓴 글을 맥락으로(아직 안 온 조각은 빈칸 — 기다리지 않는다).
        const previous = piece.part > 0 ? joinPartTexts(partTextRef.current.get(uid) ?? []) : "";
        const text = await transcribeUtterance(piece.blob, piece.mimeType, languages, { utterance: uid, part: piece.part, previous });
        if (!text || !aliveRef.current) return;
        const parts = partTextRef.current.get(uid) ?? [];
        parts[piece.part] = text;
        partTextRef.current.set(uid, parts);
        const lang = room.free ? whichLanguage(text, languages) : null;
        const mine = await postLine({
          roomId: room.id,
          peerId,
          kind: "speech",
          text,
          startedAt: piece.startedAt + offsetRef.current,
          endedAt: piece.endedAt + offsetRef.current,
          ...(lang ? { lang } : {}),
          uid,
          part: piece.part,
        });
        addMine(mine);
        // 서버에 올린 줄을 연결된 사람들에게도 바로(1.5초마다 묻는 서버 확인을 기다리지 않게). 서버 기록이 원본.
        meshRef.current?.broadcast(JSON.stringify({ t: "line", line: mine }));
        const firstSeq = Math.min(firstSeqRef.current.get(uid) ?? mine.seq, mine.seq);
        firstSeqRef.current.set(uid, firstSeq);
        // 편한 말이 든 줄이면 나에게만 "이렇게 말해 보세요"(앞 대화를 맥락으로). 실패·상한이면 조용히 없음.
        // 조각은 한 말풍선으로 이어져 보이니, 힌트도 그 말풍선(첫 줄 번호)에 단다.
        if (hintModeRef.current !== "off" && leansOnOwnLanguage(text, targetLanguage, locale)) {
          const recent = timeline(joinParts(linesRef.current))
            .filter((row) => row.seq !== firstSeq)
            .slice(-6)
            .map((row) => `${row.nickname}: ${row.text}`);
          void howToSay({ message: text, recent, locale, targetLanguage, purpose: "roomHint" }).then(
            (found) => {
              if (found && aliveRef.current) setHints((have) => ({ ...have, [firstSeq]: found.expression }));
            },
            () => {},
          );
        }
      } catch (error) {
        if (error instanceof RoomApiError && error.code === "CAPTION_LIMIT") {
          captionsOffRef.current = true;
          setCaptionsOff(true);
          setSelfComposing(null);
          return;
        }
        console.warn("[rooms] line failed", error);
      } finally {
        setPending((count) => Math.max(0, count - 1));
        inflightRef.current.set(uid, Math.max(0, (inflightRef.current.get(uid) ?? 1) - 1));
        settleUtterance(uid);
      }
    },
    [addMine, peerId, room.id, room.languages, room.free, speakerLanguages, targetLanguage, locale, settleUtterance],
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
        onUtterance: (utterance) => void onUtterance(utterance),
        onSpeaking: setSpeaking,
        // 말을 시작하자마자 내 "…" 말풍선, 말이 끝나고 받아쓴 조각이 다 오면 거둔다.
        onUtteranceStart: (uid) => {
          if (!captionsOffRef.current) setSelfComposing(uid);
        },
        onUtteranceEnd: (uid) => {
          endedUtteranceRef.current.add(uid);
          settleUtterance(uid);
        },
        isMuted: () => mutedRef.current,
      });
      return true;
    } catch (error) {
      console.warn("[rooms] mic failed", error);
      return false;
    }
  }, [onUtterance, settleUtterance]);

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
      (other, on) => {
        setTalking((have) => ({ ...have, [other]: on }));
        // 그 사람 "…" 말풍선: 말소리가 나면 띄우고, 멈춘 때를 적어 둔다(줄이 오거나 잠시 지나면 거둠).
        setComposingOthers((have) => {
          const row = have[other];
          if (on) return { ...have, [other]: { talking: true, lastVoice: Date.now() } };
          return row ? { ...have, [other]: { talking: false, lastVoice: Date.now() } } : have;
        });
      },
      room.video
        ? {
            onVideo: (other, stream) =>
              setRemoteVideo((have) => {
                const next = { ...have };
                if (stream) next[other] = stream;
                else delete next[other];
                return next;
              }),
          }
        : undefined,
    );
    meshRef.current = mesh;
    // 글 통로로 바로 온 자막 줄(mesh.broadcast). 보낸 사람의 이름·계정은 서버가 준 사람 목록에서 다시 채운다 —
    // 통로로 온 글이 남을 사칭하거나 차단을 피하지 못하게. 같은 줄은 나중에 서버 확인으로도 오고, 번호(seq)로 한 번만 쓴다.
    mesh.setMessageHandler((from, data) => {
      const line = directLine(from, data, membersRef.current);
      if (line && aliveRef.current) setLines((have) => mergeLines(have, [line]));
    });
    // 비공개 통화 방은 중계(TURN) 주소를 받아 둔다 — 들어가는 동안 같이 묻고, 첫 연결 전에 끼운다.
    const ice = room.private ? fetchIceServers(room.id, peerId) : Promise.resolve(null);

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
          textOnly: textOnlyRef.current,
        });
        if (!aliveRef.current) return;
        const receivedAt = Date.now();
        offsetRef.current = result.now - (sentAt + receivedAt) / 2;
        const live = liveMembers(result.members, result.now);
        setMembers(live);
        membersRef.current = live;
        if (result.room.hostPeerId !== hostRef.current) {
          // 방장이 바뀌었다(넘겨받음). 내가 받았으면 알려 준다.
          if (result.room.hostPeerId === peerId) setNotice("becameHost");
          hostRef.current = result.room.hostPeerId;
          setHostPeerId(result.room.hostPeerId);
        }
        const me = live.find((member) => member.peerId === peerId);
        if (me && me.role !== roleRef.current) {
          // 방장이 올리거나 내렸다(또는 앉으려 했는데 자리가 없었다). 마이크도 같이.
          await adoptRole(me.role, me.role === "speaker" ? "promoted" : "demoted");
        }
        // 💬 채팅만이면 아무와도 소리를 잇지 않고, 다른 사람의 채팅만 사람과도 잇지 않는다.
        mesh.sync(textOnlyRef.current ? [] : live.filter((member) => !member.textOnly).map((member) => member.peerId));
        for (const signal of result.signals) if (!textOnlyRef.current) await mesh.handle(signal);
        if (result.lines.length) {
          sinceRef.current = Math.max(sinceRef.current, ...result.lines.map((line) => line.seq));
          setLines((have) => mergeLines(have, result.lines));
        }
      } catch (error) {
        if (error instanceof RoomApiError && (error.status === 404 || error.code === "KICKED")) {
          setNotice(error.code === "KICKED" ? "kicked" : "roomGone");
          setEnded(error.code === "KICKED" ? "kicked" : "roomGone");
          stopMic();
          cameraRef.current?.getTracks().forEach((track) => track.stop());
          cameraRef.current = null;
          setCamera(null);
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
        hostRef.current = result.room.hostPeerId;
        setHostPeerId(result.room.hostPeerId);
        raise(result.member.hand);
        if (result.member.role === "speaker") await adoptRole("speaker", "");
        else if (result.member.hand) setNotice("handUp");
        else if (wantRole === "speaker") setNotice("joinedAsListener");
        const servers = await ice;
        if (servers) mesh.setIceServers(servers);
        if (!aliveRef.current) return;
        setJoined(true);
        void tick();
      } catch (error) {
        if (error instanceof RoomApiError) {
          setNotice(
            error.code === "ROOM_FULL" ? "full" : error.code === "BANNED" ? "banned" : error.code === "SIGNED_OUT" ? "loginNeeded" : error.status === 404 ? "roomGone" : "error",
          );
          if (error.code === "BANNED") setEnded("banned");
          else if (error.status === 404) setEnded("roomGone");
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
      cameraRef.current?.getTracks().forEach((track) => track.stop());
      cameraRef.current = null;
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

  const hostPeer = members.find((member) => member.peerId === hostPeerId) ?? null;
  const isHostNow = peerId === hostPeerId || (hostPeer === null && isHost && hostPeerId === room.hostPeerId);
  const speakers = members
    .filter((member) => member.role === "speaker")
    .sort((a, b) => Number(b.peerId === hostPeerId) - Number(a.peerId === hostPeerId) || a.joinedAt - b.joinedAt);
  const listeners = members.filter((member) => member.role === "listener");
  const hands = raisedHands(members);
  // 참여 요청한 사람 먼저, 그다음 듣기만 하는 사람(채팅만 하는 사람은 마이크가 없어서 뺀다).
  const seatCandidates = [...hands, ...listeners.filter((member) => !member.hand && !member.textOnly)];
  const tapEmptySeat = () => {
    if (isHostNow) {
      setSeatPick(true);
      return;
    }
    if (role === "speaker") return;
    if (free) {
      void askRole("speaker");
      return;
    }
    if (!hand) raise(true);
    setNotice("handUp");
  };
  const sheetMember = sheet ? members.find((member) => member.peerId === sheet.peerId) ?? null : null;
  const openPerson = (target: string, accountId: string | null) => {
    const member = members.find((row) => row.peerId === target);
    const nickname = member?.nickname ?? lines.find((line) => line.peerId === target)?.nickname ?? "";
    setSheet({ peerId: target, accountId: member?.accountId ?? accountId, nickname });
  };
  // 방장 넘기기(프로필 시트) / 넘기고 나가기(나가기 시트).
  const handOver = async (target: string, thenLeave: boolean) => {
    try {
      await transferHost(room.id, peerId, target);
      hostRef.current = target;
      setHostPeerId(target);
      setLeaving("");
      if (thenLeave) onLeave();
    } catch {
      setNotice("error");
    }
  };
  const pauseAndLeave = async () => {
    try {
      await pauseRoom(room.id, peerId);
      setLeaving("");
      onLeave();
    } catch {
      setNotice("error");
    }
  };
  const nextHosts = members.filter((member) => member.peerId !== peerId && member.role === "speaker" && member.accountId);
  // 자막(받아쓴 말)과 채팅(쓴 댓글)을 나눈다 — 예전 앱의 줄에는 kind가 없을 수 있다(그러면 말).
  const self = members.find((member) => member.peerId === peerId);
  // 쉼마다 자른 조각은 한 말풍선으로 잇는다(joinParts).
  const shownLines = joinParts(lines);
  const spoken = timeline(shownLines).filter((line) => line.kind !== "text");
  const typed = timeline(shownLines).filter((line) => line.kind === "text");
  // 지금 말하는 중이거나 받아쓰는 중인 사람의 "…" 말풍선(자막 칸 맨 아래). 차단한 사람·음소거한 사람은 빼고.
  const composing = [
    ...(selfComposing && !captionsOff ? [{ peerId, accountId: self?.accountId ?? null, nickname: self?.nickname ?? "" }] : []),
    ...Object.keys(composingOthers)
      .map((other) => members.find((member) => member.peerId === other))
      .filter((member): member is RoomMember => Boolean(member && !member.muted && !(member.accountId && blocked.includes(member.accountId))))
      .map((member) => ({ peerId: member.peerId, accountId: member.accountId ?? null, nickname: member.nickname })),
  ];
  const noteFor = onMessage
    ? (line: RoomLine, focus?: string) => {
        if (line.accountId) onMessage(line.accountId, { roomId: room.id, seq: line.seq, nickname: line.nickname, text: line.text, ...(focus ? { focus } : {}) });
      }
    : undefined;
  // 참여 방식 고르기. 방장은 말하기 자리에서 내려가지 않는다(듣기·채팅만은 막음).
  const participation = textOnly ? "chat" : hideChat ? "voice" : role === "speaker" ? "speak" : "listen";
  const choose = async (next: "speak" | "listen" | "chat" | "voice") => {
    textOnlyRef.current = next === "chat";
    setTextOnly(next === "chat");
    setHideChat(next === "voice");
    if (next === "speak" && role !== "speaker") {
      if (free) await askRole("speaker");
      else {
        raise(true);
        setNotice("handUp");
      }
    }
    if ((next === "listen" || next === "chat") && role === "speaker" && !isHostNow) await askRole("listener");
    // 듣기·채팅만을 고르면 들었던 손도 내린다 — 방장 "손든 사람"에 말할 생각 없는 사람이 남지 않게(qa 2026-10-20).
    if ((next === "listen" || next === "chat") && handRef.current) raise(false);
  };
  // 🔇 보이스만일 때 누가 내 말을 물으면 위에 알린다(채팅 칸이 숨어 있으니).
  const askedMe = lines.filter((line) => line.ask && line.quote?.peerId === peerId && line.peerId !== peerId && line.seq > seenAsk).at(-1);
  // 이 방 사람들과 단체방(워크스페이스 4단계): 계정 있는 사람을 모두 초대.
  const makeGroup = async () => {
    const invite = [...new Set(members.filter((member) => member.peerId !== peerId && member.accountId).map((member) => member.accountId!))];
    try {
      await groupCreate(room.name.replace(/^📞\s*/, ""), room.languages, invite);
      setToast(t.groupMade.replace("{n}", String(invite.length)));
    } catch {
      setNotice("error");
    }
  };
  const memberAccounts = members.map((member) => member.accountId).filter((id): id is string => Boolean(id));
  const notes = pendingNotes(inbox.threads, memberAccounts, seenNotes);
  const isSpeaking = (member: RoomMember) =>
    member.peerId === peerId ? speaking : Boolean(talking[member.peerId]) && !member.muted;
  // 영상 방의 상대(1:1이라 한 사람). 차단한 사람의 영상은 보이지 않는다.
  const videoOther = videoRoom ? members.find((member) => member.peerId !== peerId) ?? null : null;
  const videoOtherBlocked = Boolean(videoOther?.accountId && blocked.includes(videoOther.accountId));
  const videoOtherStream = videoOther && !videoOtherBlocked ? remoteVideo[videoOther.peerId] ?? null : null;
  const videoOtherLine = videoOther ? spoken.filter((line) => line.peerId === videoOther.peerId).at(-1) ?? null : null;


  if (ended) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-title text-white">{t[ended]}</p>
        <button type="button" onClick={onLeave} className="rounded-xl bg-white/90 px-5 py-2.5 text-chat font-medium text-black">
          {t.leave}
        </button>
      </div>
    );
  }
  return (
    <>
      <header className="shrink-0 border-b border-white/10 px-4 pb-2 pt-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-white" dir="auto">
              {title ?? room.name}
            </h1>
            <p className="text-xs text-slate-400">
              {room.free ? `🌐 ${t.freeTalk}` : languagePair(room.languages, locale)}
              {room.free || room.languages.length ? " · " : ""}
              {t.speakers} {speakers.length}/{MAX_SPEAKERS} · {t.listeners} {listeners.length}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {/* 공개 방만: 앱이 없는 친구도 링크로 이 방에(lib/invite). */}
            {!room.private && !("groupId" in room && room.groupId) ? (
              <InviteButton locale={locale} room={{ id: room.id, name: room.name }} compact />
            ) : null}
            {!room.private && members.some((member) => member.peerId !== peerId && member.accountId) ? (
              <button
                type="button"
                onClick={() => void makeGroup()}
                aria-label={t.makeGroup}
                title={t.makeGroup}
                className="rounded-lg border border-white/20 px-2.5 py-1.5 text-sm text-slate-200"
              >
                👥
              </button>
            ) : null}
            {onMinimize ? (
              <button
                type="button"
                onClick={onMinimize}
                className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-slate-200"
              >
                {t.minimize}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => (closesOnLeave ? setLeaving("choose") : onLeave())}
              className="rounded-lg bg-rose-500/80 px-3 py-1.5 text-sm font-medium text-white"
            >
              {/* 방장이 나가면 서버가 방을 닫는다(1:1 통화 방은 아님). */}
              {closesOnLeave ? t.closeRoom : t.leave}
            </button>
          </div>
        </div>

        {videoRoom ? (
          <VideoStage
            t={t}
            other={videoOther}
            remote={videoOtherStream}
            local={camera}
            hidden={videoHidden || videoOtherBlocked}
            onToggleHidden={() => setVideoHidden((value) => !value)}
            lastLine={videoOtherLine}
            otherSpeaking={videoOther ? isSpeaking(videoOther) : false}
            self={{ accountId: self?.accountId ?? null, nickname: self?.nickname ?? nickname }}
            selfSpeaking={speaking}
            size={layout === "call" ? "large" : layout === "chat" ? "small" : "medium"}
            onPerson={openPerson}
          />
        ) : null}
        {/* 채팅 위주: 자리 격자 대신 말하는 사람 얼굴 한 줄. */}
        {layout === "chat" && !videoRoom ? (
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
        <ul className={`mt-3 grid grid-cols-4 gap-x-2 ${layout === "call" ? "gap-y-4" : "gap-y-2"} ${layout === "chat" || videoRoom ? "hidden" : ""}`}>
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
                    {member.peerId === hostPeerId ? <span aria-hidden>👑</span> : null}
                    <span className="truncate">{member.peerId === peerId ? t.you2 : member.nickname}</span>
                  </span>
                </button>
              </li>
            ) : (
              <li key={`empty-${index}`}>
                <button
                  type="button"
                  onClick={tapEmptySeat}
                  disabled={!isHostNow && role === "speaker"}
                  aria-label={isHostNow ? t.seatPick : t.seatAsk}
                  className="flex w-full flex-col items-center gap-1 disabled:cursor-default"
                >
                  <span
                    className={`flex items-center justify-center rounded-full border border-dashed text-lg ${
                      !isHostNow && role === "speaker" ? "border-white/15 text-slate-600" : "border-white/30 text-slate-400"
                    } ${layout === "call" ? "h-16 w-16" : "h-[52px] w-[52px]"}`}
                  >
                    +
                  </span>
                  <span className="text-meta text-slate-600">{t.emptySeat}</span>
                </button>
              </li>
            ),
          )}
        </ul>

        {/* 듣는 사람 줄: 작은 얼굴들. 참여 요청한 사람은 🙋. */}
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
                    🙋
                  </span>
                ) : member.textOnly ? (
                  <span className="absolute -bottom-1 -end-1 text-meta" aria-hidden>
                    💬
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        ) : null}

        {isHostNow && hands.length > 0 ? (
          <div className="mt-2 rounded-lg border border-amber-300/30 bg-amber-300/5 px-2 py-1.5">
            <p className="mb-1 text-[11px] text-amber-200">🙋 {t.hands}</p>
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

      {toast ? (
        <button type="button" onClick={() => setToast("")} className="shrink-0 bg-violet-400/10 px-4 py-2 text-start text-sm text-violet-100" dir="auto">
          👥 {toast}
        </button>
      ) : null}
      {hideChat && askedMe ? (
        <button
          type="button"
          onClick={() => {
            setSeenAsk(askedMe.seq);
            setHideChat(false);
          }}
          className="shrink-0 bg-amber-400/10 px-4 py-2 text-start text-sm text-amber-100"
          dir="auto"
        >
          ❓ {t.askedYou.replace("{name}", askedMe.nickname)} · 💬 {t.chatTitle}
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

      {/* 자막(말한 것)과 채팅(쓴 것)을 나눠 그린다. 질문 수·번역 맥락은 둘을 합쳐서. */}
      <div className="flex min-h-0 flex-1 flex-col">
        <section className={`flex min-h-0 flex-col ${layout === "chat" ? "flex-[1]" : layout === "call" ? "shrink-0" : "flex-[3]"}`}>
          <p className="shrink-0 px-4 pt-2 text-meta font-medium text-slate-400">🎙 {t.captionsTitle}</p>
          {captionsOff ? <p className="shrink-0 px-4 pt-1 text-meta text-amber-200">{t.captionLimit}</p> : null}
          <Lines
            onNote={noteFor}
            t={t}
            allLines={shownLines}
            lines={layout === "call" ? spoken.slice(-CALL_LAYOUT_LINES) : spoken}
            composing={composing}
            hints={hints}
            hintMode={hintMode}
            onHintClose={(seq) => setHints((have) => withoutHint(have, seq))}
            onHintSend={async (seq, text) => {
              setHints((have) => withoutHint(have, seq));
              try {
                addMine(await postLine({ roomId: room.id, peerId, kind: "text", text, startedAt: Date.now() + offsetRef.current, endedAt: Date.now() + offsetRef.current }));
              } catch {
                // 못 보냈으면 그만(힌트는 다시 말해 보면 된다).
              }
            }}
            view={view}
            selfId={peerId}
            locale={locale}
            targetLanguage={targetLanguage}
            blocked={blocked}
            onPerson={openPerson}
            onQuote={(line, ask, focus) => setQuoting({ line, ask, focus })}
          />
        </section>
        {(!hideChat && (layout !== "call" || composerOpen)) || quoting ? (
          <section className={`flex min-h-0 flex-col border-t border-white/10 ${layout === "chat" ? "flex-[2]" : "flex-[2]"}`}>
            <p className="shrink-0 px-4 pt-2 text-meta font-medium text-slate-400">
              💬 {t.chatTitle}
              {typed.length ? ` ${typed.length}` : ""}
            </p>
            <Lines
              big={layout === "chat"}
              onNote={noteFor}
              t={t}
              allLines={shownLines}
              lines={typed}
              emptyText={t.noComments}
              view="timeline"
              selfId={peerId}
              locale={locale}
              targetLanguage={targetLanguage}
              blocked={blocked}
              onPerson={openPerson}
              onQuote={(line, ask, focus) => setQuoting({ line, ask, focus })}
            />
          </section>
        ) : null}
      </div>

      <footer className="shrink-0 space-y-2 border-t border-white/10 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2">
        {/* 참여 방식: 🎙 말하기 / 👂 듣기 / 💬 채팅만(소리 안 이음) / 🔇 보이스만(채팅 숨김). */}
        <div className="flex gap-1 rounded-lg bg-white/5 p-0.5 text-xs">
          {(
            [
              ["speak", "🎙", t.joinSpeak],
              ["listen", "👂", t.joinListen],
              ["chat", "💬", t.joinChat],
              ["voice", "🔇", t.joinVoice],
            ] as const
          ).map(([mode, icon, label]) => (
            <button
              key={mode}
              type="button"
              aria-pressed={participation === mode}
              disabled={!joined || (isHostNow && (mode === "listen" || mode === "chat"))}
              onClick={() => void choose(mode)}
              className={`flex-1 truncate rounded-lg px-1 py-1 disabled:opacity-40 ${participation === mode ? "bg-white/15 text-white" : "text-slate-400"}`}
            >
              {icon} {label}
            </button>
          ))}
        </div>
        {textOnly ? <p className="text-meta text-slate-500">{t.chatOnlyHint}</p> : null}
        {role === "speaker" ? (
          <label className="flex items-center gap-1.5 text-meta text-slate-400">
            💡 {t.hintMode}
            <select
              value={hintMode}
              onChange={(event) => setHintMode(event.target.value as RoomHintMode)}
              className="rounded-lg border border-white/15 bg-surface px-1.5 py-0.5 text-meta text-slate-200"
            >
              {ROOM_HINT_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode === "show" ? t.hintShow : mode === "peek" ? t.hintPeek : t.hintOff}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {hideChat && !quoting ? null : layout === "call" && !composerOpen && !quoting ? (
          <button
            type="button"
            onClick={() => setComposerOpen(true)}
            className="w-full rounded-xl border border-white/15 px-3 py-2 text-start text-sm text-slate-400"
          >
            💬 {t.writeComment}
          </button>
        ) : (
        <Composer
          key={quoting ? `q${quoting.line.seq}${quoting.ask ? "a" : "r"}${quoting.focus ?? ""}` : "plain"}
          quote={quoting ? { nickname: quoting.line.nickname, text: quoting.line.text, ask: quoting.ask, focus: quoting.focus } : null}
          onClearQuote={() => setQuoting(null)}
          initialText={quoting?.ask ? askPhraseAbout(targetLanguage, quoting.focus) : ""}
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
                ...(quoting ? { quoteSeq: quoting.line.seq, ask: quoting.ask, ...(quoting.focus ? { quoteFocus: quoting.focus } : {}) } : {}),
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
              {videoRoom ? (
                <button
                  type="button"
                  onClick={() => (camera ? stopCamera() : void startCamera())}
                  aria-pressed={Boolean(camera)}
                  className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-medium ${camera ? "bg-violet-400 text-black" : "border border-white/20 text-slate-200"}`}
                >
                  {camera ? `📷 ${t.cameraOff}` : `📷 ${t.cameraOn}`}
                </button>
              ) : null}
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
              {hand ? t.lowerHand : `🙋 ${t.raiseHand}`}
            </button>
          )}
        </div>
      </footer>

      {seatPick ? (
        <BodyLayer>
          <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60" onClick={() => setSeatPick(false)}>
            <div
              className="max-h-[70vh] w-full max-w-md space-y-2 overflow-y-auto rounded-t-2xl border border-white/10 bg-surface p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]"
              onClick={(event) => event.stopPropagation()}
            >
              <p className="text-sm font-semibold text-white">{t.seatPick}</p>
              {seatCandidates.length ? (
                <ul className="space-y-1.5">
                  {seatCandidates.map((member) => (
                    <li key={member.peerId}>
                      <button
                        type="button"
                        onClick={() => {
                          setSeatPick(false);
                          void grant(member.peerId, "speaker");
                        }}
                        className="flex w-full items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-start text-sm text-white hover:bg-white/5"
                      >
                        <Face accountId={member.accountId ?? null} name={member.nickname} size={30} />
                        <span className="min-w-0 flex-1 truncate" dir="auto">
                          {member.nickname}
                        </span>
                        <span className={`shrink-0 text-meta ${member.hand ? "text-amber-200" : "text-slate-500"}`}>
                          {member.hand ? `🙋 ${t.hands}` : t.listenersRow}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400">{t.seatPickNone}</p>
              )}
              <button type="button" onClick={() => setSeatPick(false)} className="w-full rounded-xl px-3 py-2 text-sm text-slate-400">
                {t.cancel}
              </button>
            </div>
          </div>
        </BodyLayer>
      ) : null}

      {leaving ? (
        <BodyLayer>
          <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60" onClick={() => setLeaving("")}>
            <div
              className="w-full max-w-md space-y-2 rounded-t-2xl border border-white/10 bg-surface p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]"
              onClick={(event) => event.stopPropagation()}
            >
              <p className="text-sm font-semibold text-white">{leaving === "pick" ? t.pickNewHost : t.leaveTitle}</p>
              {leaving === "pick" ? (
                <ul className="space-y-1.5">
                  {nextHosts.map((member) => (
                    <li key={member.peerId}>
                      <button
                        type="button"
                        onClick={() => void handOver(member.peerId, true)}
                        className="flex w-full items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-start text-sm text-white hover:bg-white/5"
                      >
                        <Face accountId={member.accountId ?? null} name={member.nickname} size={30} />
                        <span className="min-w-0 flex-1 truncate" dir="auto">
                          👑 {member.nickname}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <>
                  {nextHosts.length ? (
                    <button
                      type="button"
                      onClick={() => setLeaving("pick")}
                      className="w-full rounded-xl bg-amber-300/90 px-3 py-2.5 text-sm font-medium text-black"
                    >
                      👑 {t.leaveTransfer}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => void pauseAndLeave()}
                    className="w-full rounded-xl border border-white/20 px-3 py-2.5 text-sm text-slate-100"
                  >
                    ⏸ {t.leavePause}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLeaving("");
                      onLeave();
                    }}
                    className="w-full rounded-xl bg-rose-500/80 px-3 py-2.5 text-sm font-medium text-white"
                  >
                    {t.closeRoom}
                  </button>
                </>
              )}
              <button type="button" onClick={() => setLeaving("")} className="w-full rounded-xl px-3 py-2 text-sm text-slate-400">
                {t.cancel}
              </button>
            </div>
          </div>
        </BodyLayer>
      ) : null}

      {sheet ? (
        <ProfileSheet
          t={t}
          locale={locale}
          member={sheetMember}
          accountId={sheet.accountId}
          nickname={sheet.nickname}
          isHostView={isHostNow && sheet.peerId !== peerId && sheet.peerId !== hostPeerId && sheetMember !== null}
          onTransfer={
            isHostNow && !room.private && sheetMember?.role === "speaker" && sheetMember.accountId && sheet.peerId !== peerId
              ? () => {
                  const target = sheet.peerId;
                  setSheet(null);
                  void handOver(target, false);
                }
              : undefined
          }
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

function withoutHint(hints: Record<number, string>, seq: number): Record<number, string> {
  const next = { ...hints };
  delete next[seq];
  return next;
}
