"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { nextAdLayerId, noteLayerOpened } from "@/lib/ads";
import { createPortal } from "react-dom";

/**
 * A layer that really does cover the screen.
 *
 * `position: fixed` is measured against the viewport only until an ancestor
 * creates a containing block, and the chat composer has `backdrop-filter` on it
 * — which does exactly that. An overlay rendered inside it came out trapped in
 * the composer, correctly sized to the wrong box.
 *
 * Rather than pick backdrop-filter apart wherever it appears, anything meant to
 * be full-screen goes through here and is rendered on document.body, where
 * nothing is between it and the viewport.
 *
 * Above the app header, which sits at 60 and otherwise shows through a layer
 * that is supposed to have replaced the screen.
 *
 * Mounted on the client only: there is no body to portal into while rendering
 * on the server, and this app also builds as a static export.
 */
/** Never fires: this store's value is fixed per environment. */
const subscribe = () => () => {};

/**
 * 이 자리가 든 층 id(바닥 화면 0) — 네이티브 광고 자리(NativeAdSlot)는 자기 층이 맨 위일 때만 보인다(lib/ads.ts).
 */
const AdLayerContext = createContext(0);

export function useAdLayer(): number {
  return useContext(AdLayerContext);
}

/** 층 하나: id를 한 번 받아 열린 동안 맨 위 층 목록에 올린다(배너·앱 오프닝은 층이 하나라도 있으면 숨김). */
function useLayer(): number {
  const [id] = useState(nextAdLayerId);
  useEffect(() => noteLayerOpened(id), [id]);
  return id;
}

/** 대화·통화(z-[95]) 위에서 연 층이면 true — 그 위로 띄운다(LessonHost가 openLesson above로 감쌈, 2026-11-08 사전 주석). */
export const LayerAboveContext = createContext(false);

/**
 * How many full-screen layers this one sits inside. A layer opened from inside another (the homework quiz inside the
 * homework sheet) must draw above it; with the same z the order on body decided, and a layer mounted in the same commit
 * as its parent could land underneath and never be seen (2026-11-22 homework sheet).
 */
const LayerDepthContext = createContext(0);

export function FullScreenLayer({ children }: { children: ReactNode; /** PeekLayer와 같은 자리에서 바꿔 쓰려고 받음(전체 화면은 바깥이 없어 안 씀). */ onClose?: () => void }) {
  const above = useContext(LayerAboveContext);
  const depth = useContext(LayerDepthContext);
  // False while rendering on the server, true once on the client, without a
  // state write in an effect and without a hydration mismatch.
  const onClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  // 광고 배너(네이티브라 웹 화면 위에 뜸)가 이 층을 가리지 않게, 열려 있는 동안 숨긴다(lib/ads.ts).
  const layer = useLayer();
  if (!onClient) return null;
  return createPortal(
    <AdLayerContext.Provider value={layer}>
      <LayerDepthContext.Provider value={depth + 1}>
        <div className="fixed inset-0 flex flex-col bg-[#050505]" style={{ zIndex: (above ? 130 : 70) + depth }}>
          {children}
        </div>
      </LayerDepthContext.Provider>
    </AdLayerContext.Provider>,
    document.body,
  );
}

/**
 * The same escape for a sheet that brings its own backdrop: its children go to
 * document.body as they are. A topic sheet drawn inside the map tab was sized
 * against the screen (88vh) but placed against the tab, which is shorter, and
 * lost its top under the header and its bottom under the tab bar.
 */
export function BodyLayer({ children }: { children: ReactNode }) {
  const onClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const layer = useLayer();
  if (!onClient) return null;
  return createPortal(<AdLayerContext.Provider value={layer}>{children}</AdLayerContext.Provider>, document.body);
}

/**
 * 작은 창(아래에서 올라오는 시트) — 수업·표현 카드를 Logbank 블록·칩에서 열 때(사용자 2026-11-28 "작은 창으로 뜨게 해 줘").
 * FullScreenLayer와 같은 자리(children = 머리 + 본문)를 받아 화면 높이 80%까지, 바깥을 누르면 닫음. 대화·통화 위(above)면 그 위로.
 */
export function PeekLayer({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  const above = useContext(LayerAboveContext);
  const onClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const layer = useLayer();
  if (!onClient) return null;
  return createPortal(
    <AdLayerContext.Provider value={layer}>
      <div className={`fixed inset-0 ${above ? "z-[130]" : "z-[90]"} flex items-end justify-center bg-black/60 sm:items-center`} onClick={onClose}>
        <div
          data-peek-layer
          className="flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-line bg-surface pb-[env(safe-area-inset-bottom)] sm:rounded-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </AdLayerContext.Provider>,
    document.body,
  );
}
