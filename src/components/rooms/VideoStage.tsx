"use client";

import { useEffect, useRef } from "react";
import type { RoomCopy } from "@/lib/rooms/copy";
import type { RoomLine, RoomMember } from "@/lib/rooms/protocol";
import { Face } from "./RoomParts";

/**
 * 영상통화 방(1:1·러닝메이트 통화, RoomMeta.video)의 위쪽: 상대를 크게, 나는 구석에 작게.
 * 상대 카메라가 꺼져 있으면 사진(말하는 중 테두리), 상대 얼굴 칸 아래에는 그 사람의 마지막 자막 한 줄 —
 * 누가 무슨 말을 했는지가 얼굴과 붙어 보이게(hub/drafts/video-workspace.md).
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
  size,
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
  /** 통화 위주면 크게, 채팅 위주면 작게. */
  size: "large" | "medium" | "small";
  onPerson: (peerId: string, accountId: string | null) => void;
}) {
  const height = size === "large" ? "h-[46vh]" : size === "medium" ? "h-[30vh]" : "h-32";
  const showRemote = Boolean(remote) && !hidden;
  return (
    <div className={`relative mt-3 w-full overflow-hidden rounded-2xl border border-line bg-surface-sunk ${height}`}>
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
              <Face accountId={other.accountId ?? null} name={other.nickname} size={size === "small" ? 48 : 88} speaking={otherSpeaking} />
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

      {/* 나: 구석에 작게(거울처럼 좌우 뒤집어 보임 — 상대에게는 그대로 간다). */}
      <div className="absolute bottom-2 end-2 overflow-hidden rounded-xl border border-line bg-surface shadow-lg">
        {local ? (
          <VideoBox stream={local} mirrored className={size === "small" ? "h-20 w-14 object-cover" : "h-28 w-20 object-cover"} label={t.you2} />
        ) : (
          <div className={`flex items-center justify-center ${size === "small" ? "h-20 w-14" : "h-28 w-20"}`}>
            <Face accountId={self.accountId} name={self.nickname} size={size === "small" ? 32 : 44} speaking={selfSpeaking} />
          </div>
        )}
      </div>

      {/* 상대의 마지막 자막 한 줄. */}
      {lastLine && size !== "small" ? (
        <p
          className="absolute inset-x-2 bottom-2 me-24 line-clamp-2 rounded-xl bg-black/65 px-3 py-1.5 text-chat text-ink"
          dir="auto"
        >
          {lastLine.text}
        </p>
      ) : null}
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
