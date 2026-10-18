import { WebPlugin } from "@capacitor/core";
import type { InviteLinkPlugin } from "./inviteLink";

/**
 * 브라우저: 앱으로 넘어오는 링크·설치 경로가 없다(웹에서는 /?invite=… 주소를 client.ts가 읽음).
 * 공유는 navigator.share, 없으면 클립보드 — 복사했으면 "copied" 오류 대신 결과로 알린다.
 */
export class InviteLinkWeb extends WebPlugin implements InviteLinkPlugin {
  async takePending(): Promise<{ code?: string; room?: string; referrer?: string }> {
    return {};
  }

  async share(options: { text: string; title?: string }): Promise<void> {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ text: options.text, title: options.title });
        return;
      } catch (error) {
        if ((error as { name?: string })?.name === "AbortError") return;
      }
    }
    await navigator.clipboard.writeText(options.text);
    throw new Error("COPIED");
  }
}
