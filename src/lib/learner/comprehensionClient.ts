import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { ComprehensionEvent } from "@/lib/learner/comprehension";
import type { LedgerTab } from "@/lib/learner/ledger";

/**
 * Tell the server what the learner just did with a line they read — looked a
 * word up, had a span analysed, saved a word — for their comprehension record
 * (learner/comprehension.ts). Batched for a moment so a burst of taps is one
 * request; failures are dropped, since a missed tap costs one data point.
 */

type Sent = ComprehensionEvent & { tab?: LedgerTab; videoId?: string; t?: number };

/**
 * The video scene on screen, kept by the video tab, so a phrase looked up
 * there is filed under the scene it came from and can be gone back to.
 */
let videoPlace: { videoId: string; t?: number } | null = null;
export function setLedgerVideoPlace(place: { videoId: string; t?: number } | null) {
  videoPlace = place;
}
export function ledgerPlace(): { tab: LedgerTab; videoId?: string; t?: number } {
  const tab = currentLedgerTab();
  return tab === "video" && videoPlace ? { tab, ...videoPlace } : { tab };
}

const pending = new Map<string, Sent[]>();

/**
 * Which tab the learner is on, for the ledger's "where was it met" — read from
 * the address the app keeps in step with the tab bar (AppHome.syncUrl).
 */
export function currentLedgerTab(): LedgerTab {
  try {
    const screen = new URLSearchParams(window.location.search).get("screen");
    if (screen === "roleplay") return "call";
    if (screen === "video" || screen === "vocab" || screen === "map") return screen;
  } catch {
    // fall through
  }
  return "chat";
}
let timer: ReturnType<typeof setTimeout> | null = null;

function flush() {
  timer = null;
  for (const [language, events] of pending) {
    pending.delete(language);
    void fetch(apiUrl("/api/learner/comprehension"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders() },
      body: JSON.stringify({ language, events }),
      keepalive: true,
    }).catch(() => undefined);
  }
}

export function noteComprehension(language: string, event: ComprehensionEvent) {
  if (typeof window === "undefined") return;
  if (event.kind !== "translate" && !event.text.trim()) return;
  const list = pending.get(language) ?? [];
  list.push({ ...event, ...ledgerPlace() });
  pending.set(language, list.slice(-20));
  if (!timer) timer = setTimeout(flush, 1500);
}
