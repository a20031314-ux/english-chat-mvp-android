"use client";

import { useEffect, useSyncExternalStore } from "react";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import { sendAppIntent } from "@/lib/appIntents";
import { normalizeYouTubeWatchUrl } from "@/lib/videoLearning";
import { findExpression } from "@/lib/videoIndex/match";
import type { LedgerState, Place } from "@/lib/learner/ledger";

/**
 * The expression ledger as the device holds it, for connecting the tabs
 * (hub/drafts/tab-connections.md): fetched once per language when a screen
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

/** Phrases from the ledger found in a line. Spaceless scripts and Korean particles are handled by findExpression. */
export function ledgerIn(items: CompactItem[], line: string, language: string): CompactItem[] {
  if (!line.trim() || items.length === 0) return [];
  const lines = [{ start: 0, end: 0, text: line }];
  const found = items.filter((item) => findExpression(lines, item.text, language).length > 0);
  // A shorter phrase inside a longer one found too is the same finding.
  return found.filter(
    (item) => !found.some((other) => other !== item && other.text.length > item.text.length && other.text.toLowerCase().includes(item.text.toLowerCase())),
  );
}

/**
 * Only a video can be gone back to: it opens at that scene. A chat or a call
 * would only open the tab, with nothing there to do, so those have no "go
 * back" (user, 2026-10-29: buttons that just move to a feature are removed —
 * "채팅에서 써 보기" went the same way).
 */
export function canGoToFirstMet(place: Place): boolean {
  return place.tab === "video" && Boolean(place.videoId);
}

/** Take the learner back to the video scene where a phrase was first met. */
export function goToFirstMet(place: Place) {
  if (!canGoToFirstMet(place)) return;
  sendAppIntent("openTab", { tab: "video" });
  sendAppIntent("openVideo", {
    url: normalizeYouTubeWatchUrl(place.videoId!),
    ...(typeof place.t === "number" ? { startSeconds: place.t } : {}),
  });
}

const SHOW_KEY = "ledgerLinksShown";
export function linksShown(): boolean {
  try {
    return localStorage.getItem(SHOW_KEY) !== "0";
  } catch {
    return true;
  }
}
export function setLinksShown(on: boolean) {
  try {
    localStorage.setItem(SHOW_KEY, on ? "1" : "0");
  } catch {
    // Kept for this session only.
  }
  emit();
}
export function useLinksShown(): boolean {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    linksShown,
    () => true,
  );
}
