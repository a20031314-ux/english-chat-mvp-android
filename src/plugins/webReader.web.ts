import { WebPlugin } from "@capacitor/core";
import type { WebReaderPlugin } from "./webReader";

/** The browser has no PROCESS_TEXT hand-off, so there is never pending text. */
export class WebReaderWeb extends WebPlugin implements WebReaderPlugin {
  async takePendingText(): Promise<{ text: string }> {
    return { text: "" };
  }
}
