"use client";

import { useSyncExternalStore, type ReactNode } from "react";
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

export function FullScreenLayer({ children }: { children: ReactNode }) {
  // False while rendering on the server, true once on the client, without a
  // state write in an effect and without a hydration mismatch.
  const onClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  if (!onClient) return null;
  return createPortal(
    <div className="fixed inset-0 z-[70] flex flex-col bg-[#050505]">{children}</div>,
    document.body,
  );
}
