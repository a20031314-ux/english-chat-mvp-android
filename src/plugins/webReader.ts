"use client";

import { registerPlugin, type PluginListenerHandle } from "@capacitor/core";

export type WebReaderPlugin = {
  open(options: {
    url: string;
    apiBase: string;
    locale: string;
    analyzeLabel: string;
  }): Promise<void>;
  close(): Promise<void>;
  hide(): Promise<void>;
  show(): Promise<void>;
  addListener(
    eventName: "captureText",
    listener: (payload: { text?: string }) => void,
  ): Promise<PluginListenerHandle>;
  addListener(
    eventName: "closed",
    listener: () => void,
  ): Promise<PluginListenerHandle>;
  takePendingText(): Promise<{ text: string }>;
  removeAllListeners(): Promise<void>;
};

export const WebReader = registerPlugin<WebReaderPlugin>("WebReader", {
  web: () => import("./webReader.web").then((module) => new module.WebReaderWeb()),
});
