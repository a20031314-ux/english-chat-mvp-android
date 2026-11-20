"use client";

import { useEffect, useSyncExternalStore } from "react";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { LedgerState, Place } from "@/lib/learner/ledger";

/**
 * The expression ledger as the device holds it, for connecting the tabs
 * (hub/work/drafts/tab-connections.md): fetched once per language when a screen
 * that needs it opens, refreshed a moment after a turn has been read on the
 * server, and matched against lines here — no request per line.
 */

export type CompactItem = {
  text: string;
  state: LedgerState;
  firstMet: Place;
  masteredAt?: number;
  lastOutput: { at: number; where: string; unaided: boolean } | null;
};

type Entry = { items: CompactItem[]; at: number; loading: boolean };

const cache = new Map<string, Entry>();
const listeners = new Set<() => void>();
const EMPTY: CompactItem[] = [];
const FRESH_MS = 60_000;

function emit() {
  for (const listener of listeners) listener();
}

export async function refreshLedger(language: string, force = false): Promise<void> {
  const entry = cache.get(language);
  if (entry?.loading) return;
  if (!force && entry && Date.now() - entry.at < FRESH_MS) return;
  cache.set(language, { items: entry?.items ?? EMPTY, at: entry?.at ?? 0, loading: true });
  try {
    const response = await fetch(apiUrl(`/api/learner/ledger?lang=${encodeURIComponent(language)}&compact=1`), {
      headers: entitlementHeaders(),
    });
    const data = (await response.json().catch(() => null)) as { items?: CompactItem[] } | null;
    cache.set(language, {
      items: response.ok && Array.isArray(data?.items) ? data!.items : (entry?.items ?? EMPTY),
      at: Date.now(),
      loading: false,
    });
  } catch {
    cache.set(language, { items: entry?.items ?? EMPTY, at: entry?.at ?? 0, loading: false });
  }
  emit();
}

/** After a turn: the server reads it once the reply is out, so ask again a little later. */
export function refreshLedgerSoon(language: string, delayMs = 3500) {
  if (typeof window === "undefined") return;
  window.setTimeout(() => void refreshLedger(language, true), delayMs);
}

export function useLedger(language: string): CompactItem[] {
  const items = useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => cache.get(language)?.items ?? EMPTY,
    () => EMPTY,
  );
  useEffect(() => {
    void refreshLedger(language);
  }, [language]);
  return items;
}
