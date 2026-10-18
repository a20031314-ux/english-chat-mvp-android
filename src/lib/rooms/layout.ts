/**
 * 말하는 방을 보는 방식(사람마다 고름, 이 기기에 기억). 화면만 바뀌고 줄·질문·쪽지는
 * 모두 같은 방 기록을 쓴다 — 보는 건 각자, 학습은 다 같이.
 *
 *   group  — 대화 보기(시간순 자막), 처음 값
 *   people — 사람별로 묶은 자막
 *   chat   — 얼굴 자리를 접고 자막·댓글을 크게(말보다 글로 끼는 사람)
 *   call   — 얼굴 자리를 크게, 자막은 마지막 몇 줄만, 댓글창은 눌러서(듣고 말하기에 집중)
 */

export const ROOM_LAYOUTS = ["group", "people", "chat", "call"] as const;
export type RoomLayout = (typeof ROOM_LAYOUTS)[number];

export const ROOM_LAYOUT_STORAGE_KEY = "roomLayout";

/** 쪽지: 방 줄 하나를 집어 그 줄을 말한 사람에게 1:1로 묻기. */
export type RoomNote = { roomId: string; seq: number; nickname: string; text: string };

export function parseRoomLayout(raw: string | null | undefined): RoomLayout {
  return (ROOM_LAYOUTS as readonly string[]).includes(raw ?? "") ? (raw as RoomLayout) : "group";
}

export function readRoomLayout(): RoomLayout {
  try {
    return parseRoomLayout(window.localStorage.getItem(ROOM_LAYOUT_STORAGE_KEY));
  } catch {
    return "group";
  }
}

export function saveRoomLayout(layout: RoomLayout): void {
  try {
    window.localStorage.setItem(ROOM_LAYOUT_STORAGE_KEY, layout);
  } catch {
    // 기억 못 해도 이번에는 그 보기로.
  }
}

/** 통화 위주 보기에 남기는 마지막 줄 수. */
export const CALL_LAYOUT_LINES = 3;

/**
 * 방 위에 띄울 쪽지 알림: 지금 이 방에 있는 사람이 보낸, 아직 안 읽은 대화.
 * 이미 닫은 것(대화 id + 마지막 번호)은 빼서 같은 알림이 다시 뜨지 않게.
 */
export function pendingNotes<T extends { other: string; unread: number; thread: { id: string; lastSeq: number } }>(
  threads: T[],
  inRoom: readonly string[],
  dismissed: readonly string[],
): T[] {
  return threads.filter(
    (row) => row.unread > 0 && inRoom.includes(row.other) && !dismissed.includes(`${row.thread.id}:${row.thread.lastSeq}`),
  );
}
