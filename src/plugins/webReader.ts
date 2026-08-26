"use client";

import { registerPlugin, type PluginListenerHandle } from "@capacitor/core";

/** Text the user selected in another app, handed over by PROCESS_TEXT / share. */
export type WebReaderPlugin = {
  addListener(
    eventName: "captureText",
    listener: (payload: { text?: string }) => void,
  ): Promise<PluginListenerHandle>;
  takePendingText(): Promise<{ text: string }>;
  removeAllListeners(): Promise<void>;
};

export const WebReader = registerPlugin<WebReaderPlugin>("WebReader", {
  web: () => import("./webReader.web").then((module) => new module.WebReaderWeb()),
});
