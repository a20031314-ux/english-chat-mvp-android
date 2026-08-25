import { WebPlugin } from "@capacitor/core";
import type { WebReaderPlugin } from "./webReader";

export class WebReaderWeb extends WebPlugin implements WebReaderPlugin {
  async open(options: {
    url: string;
    apiBase: string;
    locale: string;
    analyzeLabel: string;
  }): Promise<void> {
    window.open(options.url, "_blank", "noopener,noreferrer");
  }
  async close(): Promise<void> {}
  async hide(): Promise<void> {}
  async show(): Promise<void> {}
  async takePendingText(): Promise<{ text: string }> {
    return { text: "" };
  }
}
