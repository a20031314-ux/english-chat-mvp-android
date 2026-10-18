"use client";

import { useEffect, useState } from "react";
import { FullScreenLayer } from "@/components/FullScreenLayer";
import {
  checkStoreUpdate,
  noteUpdateLevel,
  startUpdate,
  updateLevel,
  watchUpdateLevel,
  type StoreUpdate,
} from "@/lib/appUpdate";
import { apiUrl } from "@/lib/apiBase";
import { appVersion, type UpdateLevel } from "@/lib/appVersion";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { Locale, UICopy } from "@/lib/copy";

/**
 * Telling someone their build has been left behind — and, from 2.67, what the
 * new one has in it.
 *
 * A bar when there is a newer build, and a screen they cannot get past when the
 * one they have no longer works against the server. Both say the same thing;
 * only the way out differs.
 *
 * This is the app's only voice. Testers come from a reciprocal-testing service
 * with no channel back to them, so there is no mail to send and no notice to
 * post: whatever has to be said has to be said here.
 *
 * 출시마다 저절로: 안드로이드 앱은 Play에 직접 새 빌드가 있는지 묻는다
 * (appUpdate.ts checkStoreUpdate). 물어볼 수 없을 때만 서버 헤더
 * (RECOMMENDED_APP_VERSION)를 따른다. 새 빌드가 있으면 서버에서 그 버전의
 * "바뀐 점"(새로워진 점과 같은 글·캡처, 학습자 앱 언어)을 받아 버전마다 한 번
 * 시트로 보여 주고, 그 뒤로는 배너에서 다시 열 수 있다.
 */

type NoteItem = { id: string; title: string; body: string; image: string; imageFallback: string };
type Release = { version: string; items: NoteItem[] };
type Notes = { version: string | null; releases: Release[] };

const SHEET_SEEN_KEY = "updateNotesSeen";

function readSeen(): string | null {
  try {
    return window.localStorage.getItem(SHEET_SEEN_KEY);
  } catch {
    return null;
  }
}

function writeSeen(key: string) {
  try {
    window.localStorage.setItem(SHEET_SEEN_KEY, key);
  } catch {
    // 저장이 안 되면 다음 실행에 한 번 더 뜬다.
  }
}

function Shot({ item }: { item: NoteItem }) {
  const [source, setSource] = useState<"own" | "en" | "none">("own");
  if (source === "none") return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- remote, per-locale, and the app is a static export
    <img
      src={apiUrl(source === "own" ? item.image : item.imageFallback)}
      alt={item.title}
      loading="lazy"
      onError={() => setSource(source === "own" && item.image !== item.imageFallback ? "en" : "none")}
      className="mx-auto mt-3 max-h-[360px] w-full max-w-[300px] rounded-xl border border-white/10 object-cover object-top"
    />
  );
}

export function UpdateNotice({
  ui,
  locale,
  preview,
  from,
}: {
  ui: UICopy;
  locale: Locale;
  /** /dev/update-notice: Play의 답을 흉내 낸다. */
  preview?: StoreUpdate | null;
  /** /dev/update-notice: 이 버전에 있는 것처럼. */
  from?: string;
}) {
  const [level, setLevel] = useState<UpdateLevel>(() => updateLevel());
  // undefined = 아직 묻는 중, null = 물어볼 수 없음(서버 헤더로).
  const [store, setStore] = useState<StoreUpdate | null | undefined>(preview);
  const [notes, setNotes] = useState<Notes | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => watchUpdateLevel(setLevel), []);

  // One request at start, so the answer is there before anything else has
  // happened to ask for it. Every other response updates it for free.
  useEffect(() => {
    void fetch(apiUrl("/api/entitlement"), { headers: entitlementHeaders() })
      .then(noteUpdateLevel)
      .catch(() => {
        // Offline says nothing about the build; the level stays as it was.
      });
  }, []);

  useEffect(() => {
    if (preview !== undefined) return;
    let live = true;
    void checkStoreUpdate().then((answer) => {
      if (live) setStore(answer);
    });
    return () => {
      live = false;
    };
  }, [preview]);

  // Play가 답하면 그 답이 맞다(그 폰이 실제로 받을 수 있는지). 못 물으면 서버 헤더.
  const offered = store ? store.available : store === null && level === "available";
  const code = store?.available ? store.code : null;

  useEffect(() => {
    if (!offered) return;
    let live = true;
    const params = new URLSearchParams({ from: from ?? appVersion(), ui: locale });
    if (code) params.set("code", String(code));
    void fetch(apiUrl(`/api/whats-new?${params}`), { headers: entitlementHeaders() })
      .then((response) => {
        noteUpdateLevel(response);
        return response.ok ? (response.json() as Promise<Notes>) : null;
      })
      .then((body) => {
        if (!live || !body) return;
        setNotes(body);
        const seenKey = `${code ?? body.version ?? "?"}:${locale}`;
        const hasItems = body.releases.some((release) => release.items.length > 0);
        // 새 버전마다 한 번은 바뀐 점을 먼저 보여 준다.
        if (hasItems && readSeen() !== seenKey) {
          writeSeen(seenKey);
          setSheetOpen(true);
        }
      })
      .catch(() => {
        // 오프라인: 바뀐 점 없이 배너만.
      });
    return () => {
      live = false;
    };
  }, [offered, code, locale, from]);

  if (level === "required") {
    return (
      <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-4 bg-[#050505] p-6 text-center">
        <p className="text-[15px] leading-relaxed text-neutral-100">
          {ui.updateRequired}
        </p>
        <button
          type="button"
          onClick={() => void startUpdate(store ?? null)}
          className="rounded-xl bg-white/15 px-5 py-3 text-sm text-neutral-100 hover:bg-white/20"
        >
          {ui.updateAction}
        </button>
      </div>
    );
  }

  if (!offered) return null;

  const items = notes?.releases.flatMap((release) => release.items) ?? [];
  const version = notes?.version ?? notes?.releases[0]?.version ?? null;
  const update = () => void startUpdate(store ?? null);

  return (
    <>
      <div className="flex w-full shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-white/10 px-4 py-2 text-[12px] text-neutral-200">
        <span className="min-w-0 truncate">
          {ui.updateAvailable}
          {version ? <span className="ms-1.5 text-neutral-400" dir="ltr">v{version}</span> : null}
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          {items.length > 0 ? (
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="rounded-full px-2 py-0.5 text-[11px] text-neutral-300 underline underline-offset-2"
            >
              {ui.updateSeeChanges}
            </button>
          ) : null}
          <button
            type="button"
            onClick={update}
            className="rounded-full border border-white/25 px-2 py-0.5 text-[11px]"
          >
            {ui.updateAction}
          </button>
        </span>
      </div>
      {sheetOpen && items.length > 0 ? (
        <FullScreenLayer>
          <div className="flex shrink-0 items-baseline justify-between gap-3 border-b border-white/10 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top,0px))]">
            <h2 className="text-[15px] font-semibold text-neutral-100">{ui.updateSheetTitle}</h2>
            {version ? <span className="shrink-0 text-[12px] text-neutral-400" dir="ltr">v{version}</span> : null}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-4">
            <div className="mx-auto flex max-w-xl flex-col gap-8 pb-6">
              {items.map((item) => (
                <section key={item.id}>
                  <h3 className="text-[15px] font-semibold text-neutral-100">{item.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-300">{item.body}</p>
                  <Shot item={item} />
                </section>
              ))}
            </div>
          </div>
          <div className="flex shrink-0 gap-2 border-t border-white/10 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pt-3">
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="flex-1 rounded-xl border border-white/15 py-3 text-[14px] text-neutral-200"
            >
              {ui.updateLater}
            </button>
            <button
              type="button"
              onClick={() => {
                setSheetOpen(false);
                update();
              }}
              className="flex-[2] rounded-xl bg-[#e8e8e4] py-3 text-[14px] font-medium text-neutral-900"
            >
              {ui.updateAction}
            </button>
          </div>
        </FullScreenLayer>
      ) : null}
    </>
  );
}
