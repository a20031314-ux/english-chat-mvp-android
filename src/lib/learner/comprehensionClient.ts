import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { ComprehensionEvent } from "@/lib/learner/comprehension";

/**
 * Tell the server what the learner just did with a line they read — looked a
 * word up, had a span analysed, saved a word — for their comprehension record
 * (learner/comprehension.ts). Batched for a moment so a burst of taps is one
 * request; failures are dropped, since a missed tap costs one data point.
 */

const pending = new Map<string, ComprehensionEvent[]>();
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
  list.push(event);
  pending.set(language, list.slice(-20));
  if (!timer) timer = setTimeout(flush, 1500);
}
