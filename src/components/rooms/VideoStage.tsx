"use client";

import { useEffect, useRef } from "react";
import type { RoomCopy } from "@/lib/rooms/copy";
import type { RoomLine, RoomMember } from "@/lib/rooms/protocol";
import { Face } from "./RoomParts";

/**
 * 영상통화 방(1:1·러닝메이트 통화, RoomMeta.video)의 위쪽. 보는 방식 두 가지(사람마다, 기기에 기억 — RoomView `videoSelfBig`):
 * - 작게(기본): 상대를 크게, 나는 구석에 작게.
 * - 크게: 상대 위·나 아래 같은 크기로(위아래 대칭). 이때 RoomView는 자막을 마지막 몇 줄만 작게 둔다.
 * 상대 카메라가 꺼져 있으면 사진(말하는 중 테두리), 상대 칸 아래에는 그 사람의 마지막 자막 한 줄.
 * 영상은 사람끼리 직접 오가고(lib/rooms/mesh.ts) 어디에도 남지 않는다.
 */
export function VideoStage({
  t,
  other,
  remote,
  local,
  hidden,
  onToggleHidden,
  lastLine,
  otherSpeaking,
  self,
  selfSpeaking,
  selfBig,
  onToggleSelfBig,
  onPerson,
}: {
  t: RoomCopy;
  /** 상대(아직 안 들어왔으면 null). */
  other: RoomMember | null;
  /** 상대가 켠 영상. 카메라를 껐거나 아직 안 왔으면 null. */
  remote: MediaStream | null;
  /** 내 카메라(끄면 null). */
  local: MediaStream | null;
  /** 내가 상대 영상을 가렸다(이 기기에서만). */
  hidden: boolean;
  onToggleHidden: () => void;
  lastLine: RoomLine | null;
  otherSpeaking: boolean;
  self: { accountId: string | null; nickname: string };
  selfSpeaking: boolean;
  /** 내 화면을 상대와 같은 크기로(위아래). */
  selfBig: boolean;
  onToggleSelfBig: () => void;
  onPerson: (peerId: string, accountId: string | null) => void;
}) {
  const remoteTile = (
    <RemoteTile
      t={t}
      other={other}
      remote={remote}
      hidden={hidden}
      onToggleHidden={onToggleHidden}
      lastLine={lastLine}
      otherSpeaking={otherSpeaking}
      onPerson={onPerson}
      compact={selfBig}
    />
  );

  if (selfBig) {
    return (
      <div className="mt-3 flex w-full flex-col gap-2">
        <div className="relative h-[25vh] overflow-hidden rounded-2xl border border-line bg-surface-sunk">{remoteTile}</div>
        <div className="relative h-[25vh] overflow-hidden rounded-2xl border border-line bg-surface-sunk">
          <SelfView t={t} local={local} self={self} selfSpeaking={selfSpeaking} faceSize={64} />
          <button
            type="button"
            onClick={onToggleSelfBig}
            className="absolute end-2 top-2 rounded-full bg-black/60 px-2.5 py-1 text-meta text-slate-200"
          >
            ↘ {t.videoSelfSmall}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mt-3 h-[30vh] w-full overflow-hidden rounded-2xl border border-line bg-surface-sunk">
      {remoteTile}
      {/* 나: 구석에 작게. 누르면 크게(위아래 대칭). */}
      <button
        type="button"
        onClick={onToggleSelfBig}
        aria-label={t.videoSelfBig}
        title={t.videoSelfBig}
        className="absolute bottom-2 end-2 h-28 w-20 overflow-hidden rounded-xl border border-line bg-surface shadow-lg"
      >
        <SelfView t={t} local={local} self={self} selfSpeaking={selfSpeaking} faceSize={44} />
        <span className="absolute end-1 top-1 rounded-full bg-black/60 px-1 text-meta text-slate-200" aria-hidden>
          ↖
        </span>
      </button>
    </div>
  );
}

function RemoteTile({
  t,
  other,
  remote,
  hidden,
  onToggleHidden,
  lastLine,
  otherSpeaking,
  onPerson,
  compact,
}: {
  t: RoomCopy;
  other: RoomMember | null;
  remote: MediaStream | null;
  hidden: boolean;
  onToggleHidden: () => void;
  lastLine: RoomLine | null;
  otherSpeaking: boolean;
  onPerson: (peerId: string, accountId: string | null) => void;
  /** 위아래로 나눌 때: 자막 한 줄이 내 칸 자리를 비워 둘 필요 없음. */
  compact: boolean;
}) {
  const showRemote = Boolean(remote) && !hidden;
  return (
    <>
      {showRemote ? (
        <VideoBox stream={remote} className="h-full w-full object-cover" label={other?.nickname ?? ""} />
      ) : (
        <button
          type="button"
          onClick={() => other && onPerson(other.peerId, other.accountId ?? null)}
          disabled={!other}
          className="flex h-full w-full flex-col items-center justify-center gap-2"
        >
          {other ? (
            <>
              <Face accountId={other.accountId ?? null} name={other.nickname} size={compact ? 64 : 88} speaking={otherSpeaking} />
              <span className="max-w-full truncate px-4 text-sm text-slate-200" dir="auto">
                {other.nickname}
              </span>
              <span className="text-meta text-slate-500">{remote && hidden ? t.videoHidden : t.cameraOffLabel}</span>
            </>
          ) : (
            <span className="text-sm text-slate-400">{t.videoWaiting}</span>
          )}
        </button>
      )}

      {/* 상대 영상 가리기(이 기기에서만, 상대에게 알리지 않음). */}
      {remote ? (
        <button
          type="button"
          onClick={onToggleHidden}
          aria-pressed={hidden}
          className="absolute start-2 top-2 rounded-full bg-black/60 px-2.5 py-1 text-meta text-slate-200"
        >
          {hidden ? `👁 ${t.showVideo}` : `🙈 ${t.hideVideo}`}
        </button>
      ) : null}

      {/* 상대의 마지막 자막 한 줄. */}
      {lastLine ? (
        <p
          className={`absolute inset-x-2 bottom-2 line-clamp-2 rounded-xl bg-black/65 px-3 py-1.5 text-chat text-ink ${compact ? "" : "me-24"}`}
          dir="auto"
        >
          {lastLine.text}
        </p>
      ) : null}
    </>
  );
}

function SelfView({
  t,
  local,
  self,
  selfSpeaking,
  faceSize,
}: {
  t: RoomCopy;
  local: MediaStream | null;
  self: { accountId: string | null; nickname: string };
  selfSpeaking: boolean;
  faceSize: number;
}) {
  // 거울처럼 좌우 뒤집어 보임 — 상대에게는 그대로 간다.
  return local ? (
    <VideoBox stream={local} mirrored className="h-full w-full object-cover" label={t.you2} />
  ) : (
    <div className="flex h-full w-full items-center justify-center">
      <Face accountId={self.accountId} name={self.nickname} size={faceSize} speaking={selfSpeaking} />
    </div>
  );
}

function VideoBox({
  stream,
  mirrored = false,
  className,
  label,
}: {
  stream: MediaStream | null;
  mirrored?: boolean;
  className: string;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (video.srcObject !== stream) video.srcObject = stream;
    if (stream) void video.play().catch(() => {});
  }, [stream]);
  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      // 소리는 메시의 audio 요소가 낸다 — 영상 요소는 늘 음소거(두 번 들리지 않게).
      muted
      aria-label={label}
      className={`${className} ${mirrored ? "-scale-x-100" : ""}`}
    />
  );
}
