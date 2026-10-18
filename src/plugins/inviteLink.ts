"use client";

import { registerPlugin, type PluginListenerHandle } from "@capacitor/core";

/**
 * 친구 초대(android InviteLinkPlugin.java).
 * takePending: 앱을 연 초대 링크 {code, room}, 또는 설치 후 첫 실행의 Play 설치 경로 {referrer}.
 */
export type InviteLinkPlugin = {
  addListener(
    eventName: "inviteLink",
    listener: (payload: { code?: string; room?: string }) => void,
  ): Promise<PluginListenerHandle>;
  takePending(): Promise<{ code?: string; room?: string; referrer?: string }>;
  share(options: { text: string; title?: string }): Promise<void>;
  removeAllListeners(): Promise<void>;
};

export const InviteLink = registerPlugin<InviteLinkPlugin>("InviteLink", {
  web: () => import("./inviteLink.web").then((module) => new module.InviteLinkWeb()),
});
