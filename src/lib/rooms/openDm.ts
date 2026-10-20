/**
 * 다른 탭(사람 탭 등)에서 1:1 대화를 연다. 대화 화면은 RoomsScreen이 그린다 —
 * 그 화면은 다른 탭에서도 떠 있으므로(AppHome) 여기에 적으면 그 위에 대화가 뜬다.
 */
type Listener = (accountId: string) => void;
const listeners = new Set<Listener>();

export function requestDm(accountId: string): void {
  for (const listener of listeners) listener(accountId);
}

export function onDmRequest(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * 단체방(메시지 탭)에서 📞 → RoomsScreen이 통화 방을 연다(그 화면이 peerId를 가지고 있다).
 * 통화에서 나오면 RoomsScreen이 requestGroup으로 그 단체방 대화를 다시 연다.
 */
type CallListener = (groupId: string, title: string) => void;
const callListeners = new Set<CallListener>();

export function requestGroupCall(groupId: string, title: string): void {
  for (const listener of callListeners) listener(groupId, title);
}

export function onGroupCallRequest(listener: CallListener): () => void {
  callListeners.add(listener);
  return () => callListeners.delete(listener);
}

const groupListeners = new Set<Listener>();
/** 메시지 탭이 아직 안 열려 있을 때(다른 탭에서 팀·메이트를 누름) — 열리면 그때 연다. */
let pendingGroup: string | null = null;

export function requestGroup(groupId: string): void {
  if (groupListeners.size === 0) {
    pendingGroup = groupId;
    return;
  }
  for (const listener of groupListeners) listener(groupId);
}

export function onGroupRequest(listener: Listener): () => void {
  groupListeners.add(listener);
  if (pendingGroup) {
    const id = pendingGroup;
    pendingGroup = null;
    queueMicrotask(() => listener(id));
  }
  return () => groupListeners.delete(listener);
}

/** 초대 링크로 받은 방 초대 → RoomsScreen이 그 방을 연다(듣는 사람으로, 손 들고 올라가기). */
const roomListeners = new Set<Listener>();

export function requestRoom(roomId: string): void {
  for (const listener of roomListeners) listener(roomId);
}

export function onRoomRequest(listener: Listener): () => void {
  roomListeners.add(listener);
  return () => roomListeners.delete(listener);
}

/**
 * 랜덤으로 만난 영상 방(api/random) → RoomsScreen이 둘만의 방에 말하는 사람으로 들어간다.
 * 끝나면 그 사람과의 1:1 대화로 돌아간다(자막·채팅은 통화 기록으로 남음).
 */
type PrivateCallListener = (roomId: string, title: string, back: string) => void;
const privateCallListeners = new Set<PrivateCallListener>();

export function requestPrivateCall(roomId: string, title: string, back: string): void {
  for (const listener of privateCallListeners) listener(roomId, title, back);
}

export function onPrivateCallRequest(listener: PrivateCallListener): () => void {
  privateCallListeners.add(listener);
  return () => privateCallListeners.delete(listener);
}
