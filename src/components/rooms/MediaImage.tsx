"use client";

import { useEffect, useState } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import type { RoomCopy } from "@/lib/rooms/copy";
import type { MediaRef } from "@/lib/rooms/media";
import { mediaSrc } from "@/lib/rooms/mediaClient";

/**
 * 메시지·글에 붙은 사진 한 장. 오기 전에도 칸 높이를 잡아(w·h) 목록이 튀지 않게 하고, 누르면 크게.
 * 1:1·단체방 사진은 서버가 그 방 사람인지 확인한 뒤에만 준다(mediaClient mediaSrc).
 */
export function MediaImage({ image, t, maxWidth = 240 }: { image: MediaRef; t: RoomCopy; maxWidth?: number }) {
  const [src, setSrc] = useState<string | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let alive = true;
    void mediaSrc(image.id).then((found) => alive && setSrc(found));
    return () => {
      alive = false;
    };
  }, [image.id]);
  const width = Math.min(maxWidth, image.w);
  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          if (src) setOpen(true);
        }}
        aria-label={t.photoOpen}
        className="block overflow-hidden rounded-xl bg-white/5"
        style={{ width, aspectRatio: `${image.w} / ${image.h}` }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element -- 기기 안 주소(blob:)라 next/image를 못 쓴다.
          <img src={src} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-meta text-slate-500">{src === null ? t.photoGone : "📷"}</span>
        )}
      </button>
      {open && src ? (
        <BodyLayer>
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-3" onClick={() => setOpen(false)} role="dialog" aria-label={t.photoOpen}>
            {/* eslint-disable-next-line @next/next/no-img-element -- 기기 안 주소(blob:) */}
            <img src={src} alt="" className="max-h-full max-w-full rounded-lg object-contain" />
            <button type="button" onClick={() => setOpen(false)} aria-label={t.photoClose} className="absolute end-3 top-[calc(env(safe-area-inset-top)+0.75rem)] rounded-full bg-white/15 px-3 py-1 text-title text-white">
              ×
            </button>
          </div>
        </BodyLayer>
      ) : null}
    </>
  );
}
