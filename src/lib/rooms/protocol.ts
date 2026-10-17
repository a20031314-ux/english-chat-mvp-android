/**
 * 사용자끼리 말하는 방(시험 기능)의 공통 약속.
 *
 * 서버(api/rooms)와 앱(components/rooms)이 같은 모양을 쓰도록 여기에 둔다.
 * 음성은 서버를 거치지 않고 사람끼리 직접(WebRTC) 오가고, 서버는 누가 방에
 * 있는지, 연결 신호, 자막 줄만 짧게 들고 있다.
 *
 * 자막은 합치지 않는다. 각자 자기 마이크만 받아써서 줄마다 말한 사람이 이미
 * 정해져 있고, 화면이 시간 순서(대화 보기)나 사람별(사람별 보기)로 늘어놓는다.
 */

/** 말하기 자리. 음성이 사람끼리 직접 오가서(메시) 이보다 많으면 폰이 버겁다. */
export const MAX_SPEAKERS = 8;
/** 듣기만 하는 사람까지 합친 한 방의 최대 인원. */
export const MAX_MEMBERS = 16;
/** 이만큼 소식이 없으면 나간 것으로 본다(앱은 약 1.5초마다 묻는다). */
export const MEMBER_STALE_MS = 12_000;
/** 방 자체가 남는 시간. 마지막 활동 뒤로 연장된다. */
export const ROOM_TTL_SECONDS = 6 * 60 * 60;
/** 서버가 들고 있는 자막 줄 수. 그 앞은 각자 기기에만 남는다. */
export const MAX_LINES_KEPT = 300;
export const MAX_LINE_CHARS = 500;
export const MAX_NICKNAME_CHARS = 20;
export const MAX_ROOM_NAME_CHARS = 40;
/** 연결 신호(offer/answer/ice) 한 개의 크기 상한. SDP는 보통 몇 KB. */
export const MAX_SIGNAL_CHARS = 20_000;

export type RoomRole = "speaker" | "listener";

export type RoomMember = {
  peerId: string;
  nickname: string;
  role: RoomRole;
  muted: boolean;
  /** 듣는 사람이 말하기 자리를 청함(손들기). 자리에 오르면 내려간다. */
  hand: boolean;
  joinedAt: number;
  lastSeen: number;
};

export type RoomMeta = {
  id: string;
  name: string;
  /** 이 방에서 주로 쓰는 언어 두 개(언어 교환). 표시용. */
  languages: string[];
  hostPeerId: string;
  createdAt: number;
};

export type RoomSummary = RoomMeta & { speakers: number; listeners: number };

/** 말을 받아쓴 줄, 또는 손으로 쓴 댓글. */
export type LineKind = "speech" | "text";

export type RoomLine = {
  seq: number;
  /** 없으면 speech(처음 시험판 줄). */
  kind?: LineKind;
  peerId: string;
  nickname: string;
  text: string;
  /** 서버 시계 기준으로 말을 시작한 때(ms). 순서는 이것으로 정한다. */
  startedAt: number;
  /** 말이 끝난 때. 겹침 표시에 쓴다. */
  endedAt: number;
};

export type SignalKind = "offer" | "answer" | "ice" | "bye";

export type RoomSignal = {
  from: string;
  to: string;
  kind: SignalKind;
  data: string;
  at: number;
};

export type PollResponse = {
  now: number;
  room: RoomMeta;
  members: RoomMember[];
  signals: RoomSignal[];
  lines: RoomLine[];
};

const ID_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

/** 방 번호처럼 쓰는 짧은 id. 헷갈리는 글자(0/o, 1/l/i)는 뺐다. */
export function newRoomId(random: () => number = Math.random): string {
  let id = "";
  for (let i = 0; i < 6; i += 1) id += ID_ALPHABET[Math.floor(random() * ID_ALPHABET.length)];
  return id;
}

export function isRoomId(value: unknown): value is string {
  return typeof value === "string" && /^[a-z2-9]{6}$/.test(value);
}

/** 앱이 한 번 열릴 때 만드는 이 기기의 방 안 이름표. 사용자 id가 아니다. */
export function isPeerId(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{8,40}$/.test(value);
}

export function cleanText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

export function isSignalKind(value: unknown): value is SignalKind {
  return value === "offer" || value === "answer" || value === "ice" || value === "bye";
}

/**
 * 누가 먼저 연결을 청하나. 둘이 동시에 offer를 보내 엉키지 않게, id가 작은
 * 쪽만 청한다(양쪽이 같은 규칙으로 같은 답을 낸다).
 */
export function shouldInitiate(self: string, other: string): boolean {
  return self < other;
}

/**
 * 손들기 없이 바로 말하기 자리에 앉을 수 있나. 방장이거나, 방장이 지금 방에
 * 없을 때(방장이 나가도 방이 멈추지 않게).
 */
export function canSeatFreely(peerId: string, hostPeerId: string, live: RoomMember[]): boolean {
  return peerId === hostPeerId || !live.some((member) => member.peerId === hostPeerId);
}

/** 손든 사람, 먼저 든 순서(들어온 순서로 대신). */
export function raisedHands(live: RoomMember[]): RoomMember[] {
  return live.filter((member) => member.role === "listener" && member.hand).sort((a, b) => a.joinedAt - b.joinedAt);
}

/** 살아 있는 사람만. 소식이 끊긴 사람은 화면에서도 연결에서도 뺀다. */
export function liveMembers(members: RoomMember[], now: number): RoomMember[] {
  return members.filter((member) => now - member.lastSeen < MEMBER_STALE_MS);
}

/** 대화 보기: 말을 시작한 순서. 같으면 먼저 받은 줄(seq)이 위. */
export function timeline(lines: RoomLine[]): RoomLine[] {
  return [...lines].sort((a, b) => a.startedAt - b.startedAt || a.seq - b.seq);
}

/** 앞 줄과 말한 시간이 겹치는 줄. 대화 보기에서 살짝 표시한다. */
export function overlapsPrevious(ordered: RoomLine[], index: number): boolean {
  if (index <= 0) return false;
  const line = ordered[index];
  const before = ordered[index - 1];
  return line.peerId !== before.peerId && line.startedAt < before.endedAt;
}

/** 사람별 보기: 처음 말한 순서로 사람을 늘어놓고, 각자의 줄은 시간 순서. */
export function byPerson(lines: RoomLine[]): { peerId: string; nickname: string; lines: RoomLine[] }[] {
  const groups = new Map<string, { peerId: string; nickname: string; lines: RoomLine[] }>();
  for (const line of timeline(lines)) {
    let group = groups.get(line.peerId);
    if (!group) {
      group = { peerId: line.peerId, nickname: line.nickname, lines: [] };
      groups.set(line.peerId, group);
    }
    group.nickname = line.nickname;
    group.lines.push(line);
  }
  return [...groups.values()];
}

/** 새로 받은 줄을 이미 가진 줄에 더한다(같은 seq는 한 번만). */
export function mergeLines(have: RoomLine[], incoming: RoomLine[]): RoomLine[] {
  if (incoming.length === 0) return have;
  const seen = new Set(have.map((line) => line.seq));
  const added = incoming.filter((line) => !seen.has(line.seq));
  return added.length ? [...have, ...added] : have;
}

/**
 * 줄을 눌러 번역할 때 같이 보낼 앞 줄들(말한 사람 이름 포함). 어느 보기에서
 * 눌렀든 맥락은 시간 순서에서 나온다.
 */
export function contextBefore(lines: RoomLine[], seq: number, count = 4): string[] {
  const ordered = timeline(lines);
  const at = ordered.findIndex((line) => line.seq === seq);
  if (at <= 0) return [];
  return ordered.slice(Math.max(0, at - count), at).map((line) => `${line.nickname}: ${line.text}`);
}
