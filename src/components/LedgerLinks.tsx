"use client";

import { useState } from "react";
import type { UICopy } from "@/lib/copy";
import { ledgerKey, type LedgerState, type LedgerTab, type Place } from "@/lib/learner/ledger";
import { sendAppIntent } from "@/lib/appIntents";
import { findScenes } from "@/lib/studyMapClient";
import { normalizeYouTubeWatchUrl } from "@/lib/videoLearning";
import {
  goToFirstMet,
  ledgerIn,
  tryInChat,
  useLedger,
  useLinksShown,
  type CompactItem,
} from "@/lib/learner/ledgerClient";

/**
 * A line, connected to the rest of what the learner has met
 * (hub/drafts/tab-connections.md).
 *
 * Under their own sentence ("mine"): a phrase in it they first met in another
 * tab — "met in Video · 0:42", which takes them back to the scene — or one
 * that has just become mastered. Under what they heard or read ("heard": a
 * tutor's line, a subtitle): phrases they already know from elsewhere, with
 * where, how far along, and a way to use one.
 *
 * Quiet on purpose: nothing for phrases first met right here, a few chips at
 * most, and the "heard" kind can be switched off from My phrases.
 */

const DOT: Record<LedgerState, string> = {
  mastered: "bg-status-mastered",
  learned: "bg-status-learned",
  met: "bg-white/40",
};
const JUST_NOW_MS = 15 * 60 * 1000;

export function tabLabel(ui: UICopy, tab: LedgerTab): string {
  return { chat: ui.homeTabChat, call: ui.homeTabCall, video: ui.homeTabVideo, vocab: ui.homeTabVocab, map: ui.homeTabMap }[tab];
}

export function placeLabel(ui: UICopy, place: Place): string {
  const at =
    place.tab === "video" && typeof place.t === "number"
      ? ` · ${Math.floor(place.t / 60)}:${String(Math.round(place.t) % 60).padStart(2, "0")}`
      : "";
  return `${tabLabel(ui, place.tab)}${at}`;
}

export function stateLabel(ui: UICopy, state: LedgerState): string {
  return { mastered: ui.itemsMastered, learned: ui.itemsLearned, met: ui.ledgerMet }[state];
}

export function LedgerLinks({
  ui,
  line,
  language,
  here,
  kind,
  className = "",
  masteredOnly = false,
}: {
  ui: UICopy;
  line: string;
  language: string;
  here: LedgerTab;
  kind: "mine" | "heard";
  className?: string;
  /**
   * 대화 줄 아래에는 "숙지로 올라갔어요"(그 순간의 상태)만(2026-10-23, conversation-unify) — 다른 탭에서 만난 표현·아는 표현 칩은
   * 줄마다 쌓여 화면을 덮어서 뺐다. 그 기록은 My(내 표현)에 그대로.
   */
  masteredOnly?: boolean;
}) {
  const items = useLedger(language);
  const shown = useLinksShown();
  const [open, setOpen] = useState<string | null>(null);
  // When this line was drawn: "just mastered" means since then, give or take.
  const [now] = useState(() => Date.now());
  if (kind === "heard" && !shown) return null;
  const found = ledgerIn(items, line, language);
  const chips = masteredOnly
    ? kind === "mine"
      ? found.filter((item) => item.masteredAt && now - item.masteredAt < JUST_NOW_MS).slice(0, 2)
      : []
    : kind === "mine"
      ? found.filter((item) => (item.masteredAt && now - item.masteredAt < JUST_NOW_MS) || item.firstMet.tab !== here).slice(0, 2)
      : found.filter((item) => item.firstMet.tab !== here || item.state !== "met").slice(0, 3);
  if (chips.length === 0) return null;
  const openItem = chips.find((item) => item.text === open) ?? null;

  return (
    <div className={`mt-1.5 ${className}`}>
      <div className="flex flex-wrap gap-1.5">
        {chips.map((item) => {
          const justMastered = kind === "mine" && item.masteredAt && now - item.masteredAt < JUST_NOW_MS;
          // Heard or read: "you know this" only once it is learned or
          // mastered; only looked up, it is "seen before" — a second chance
          // to notice it, not a claim that it is known.
          const seenOnly = kind === "heard" && item.state === "met";
          const label = justMastered
            ? ui.linkMasteredNow
            : kind === "mine"
              ? ui.linkMetIn.replace("{place}", placeLabel(ui, item.firstMet))
              : seenOnly
                ? ui.linkSeen
                : ui.linkKnown;
          return (
            <button
              key={item.text}
              type="button"
              onClick={() => (kind === "mine" && !justMastered ? goToFirstMet(item.firstMet) : setOpen(open === item.text ? null : item.text))}
              className={`flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] ${
                justMastered
                  ? "border-emerald-400/40 bg-emerald-950/80 text-emerald-100"
                  : seenOnly
                    ? "border-white/20 bg-neutral-900/90 text-slate-300"
                    : "border-sky-300/30 bg-sky-950/80 text-sky-100"
              }`}
            >
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT[item.state]}`} />
              <span className="truncate">{label}</span>
              <span dir="auto" className="truncate font-medium">
                {item.text}
              </span>
            </button>
          );
        })}
      </div>
      {openItem ? <LinkCard ui={ui} item={openItem} onClose={() => setOpen(null)} /> : null}
    </div>
  );
}

function LinkCard({ ui, item, onClose }: { ui: UICopy; item: CompactItem; onClose: () => void }) {
  return (
    <div className="mt-1.5 rounded-xl border border-white/10 bg-neutral-900/95 p-2.5 text-start">
      <div className="flex items-start gap-2">
        <p dir="auto" className="min-w-0 flex-1 text-[13px] font-medium text-slate-100">
          {item.text}
        </p>
        <button type="button" onClick={onClose} aria-label={ui.billingClose} className="text-[12px] text-slate-500">
          ✕
        </button>
      </div>
      <p className="mt-0.5 text-[11px] text-slate-400">
        {stateLabel(ui, item.state)} · {ui.linkFirstMet.replace("{place}", placeLabel(ui, item.firstMet))}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => goToFirstMet(item.firstMet)}
          className="rounded-lg border border-white/15 px-2.5 py-1 text-[12px] text-slate-200 hover:bg-white/10"
        >
          {ui.linkGoBack}
        </button>
        <button
          type="button"
          onClick={() => tryInChat(item.text)}
          className="rounded-lg border border-white/15 px-2.5 py-1 text-[12px] text-slate-200 hover:bg-white/10"
        >
          {ui.linkTry}
        </button>
      </div>
    </div>
  );
}

/** How long ago, in the interface language. */
export function agoLabel(locale: string, at: number, now = Date.now()): string {
  const minutes = Math.round((at - now) / 60000);
  const fmt = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  // Under a minute is "now" — as zero minutes some languages say "this minute".
  if (Math.abs(minutes) < 1) return fmt.format(0, "second");
  if (Math.abs(minutes) < 60) return fmt.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return fmt.format(hours, "hour");
  return fmt.format(Math.round(hours / 24), "day");
}

/**
 * A saved word, connected: how far along it is and where it was last
 * produced, with a way to use it and a way to hear it said (the word list, D).
 */
export function WordLedgerLine({
  ui,
  locale,
  word,
  language,
  onLeave,
}: {
  ui: UICopy;
  locale: string;
  word: string;
  language: string;
  /** Called before going to another tab — a sheet this sits in closes. */
  onLeave?: () => void;
}) {
  const items = useLedger(language);
  const [searching, setSearching] = useState(false);
  const [noScene, setNoScene] = useState(false);
  const key = ledgerKey(word);
  const item = items.find((row) => ledgerKey(row.text) === key);
  const used = item?.lastOutput;
  const where = used
    ? used.where === "call"
      ? ui.homeTabCall
      : used.where === "chat"
        ? ui.homeTabChat
        : ui.homeTabMap
    : "";
  const findScene = async () => {
    setSearching(true);
    const matches = await findScenes(language, [word]);
    setSearching(false);
    const hit = matches?.[0]?.found?.[0]?.hits?.[0];
    if (!matches?.[0] || !hit) {
      setNoScene(true);
      return;
    }
    onLeave?.();
    sendAppIntent("openTab", { tab: "video" });
    sendAppIntent("openVideo", { url: normalizeYouTubeWatchUrl(matches[0].videoId), startSeconds: hit.start });
  };
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[11px] text-slate-400">
      {item ? (
        <span className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${DOT[item.state]}`} />
          {stateLabel(ui, item.state)}
        </span>
      ) : null}
      <span>
        {used ? ui.linkUsedIn.replace("{place}", where).replace("{ago}", agoLabel(locale, used.at)) : ui.linkNotUsed}
      </span>
      <span className="ms-auto flex gap-1.5">
        <button
          type="button"
          onClick={() => {
            onLeave?.();
            tryInChat(word);
          }}
          className="rounded-lg border border-white/15 px-2 py-0.5 text-[11px] text-slate-200 hover:bg-white/10"
        >
          {ui.linkTry}
        </button>
        <button
          type="button"
          onClick={() => void findScene()}
          disabled={searching || noScene}
          className="rounded-lg border border-white/15 px-2 py-0.5 text-[11px] text-slate-200 hover:bg-white/10 disabled:opacity-40"
        >
          {ui.linkFindScenes}
        </button>
      </span>
    </div>
  );
}
