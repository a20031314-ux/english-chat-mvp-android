"use client";

import { useEffect, useState } from "react";
import type { UICopy } from "@/lib/copy";
import { isRemoteShell } from "@/lib/platform";

/**
 * 시험 앱 껍데기에서만(lib/platform.ts isRemoteShell — 운영 웹을 불러 쓰는 디버그 APK, 2026-11-02 사용자 "내가 말할 때마다
 * 이 앱에만 업데이트를 해서 배너를 띄워주고"): main이 새로 배포되면 맨 위에 "새 버전이 나왔어요 · 업데이트" 한 줄,
 * 누르면 다시 불러온다. 앱을 다시 열 때·5분마다 /api/build와 이 화면의 배포(NEXT_PUBLIC_BUILD_SHA)를 견줌.
 * Play 앱·웹에는 안 뜬다.
 */
const BUILT = process.env.NEXT_PUBLIC_BUILD_SHA ?? "";
const EVERY_MS = 5 * 60 * 1000;

export function ShellUpdate({ ui }: { ui: UICopy }) {
  const [newer, setNewer] = useState(false);
  useEffect(() => {
    if (!isRemoteShell() || !BUILT) return;
    let stopped = false;
    const check = async () => {
      try {
        const response = await fetch(`${window.location.origin}/api/build`, { cache: "no-store" });
        const { sha } = (await response.json()) as { sha?: string };
        if (!stopped && sha && sha !== BUILT) setNewer(true);
      } catch {
        // 오프라인이면 다음에.
      }
    };
    void check();
    const timer = window.setInterval(check, EVERY_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") void check();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      stopped = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
  if (!newer) return null;
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-info/15 px-4 py-2 text-note text-slate-100" role="status">
      <span>{ui.updateAvailable}</span>
      <button type="button" onClick={() => window.location.reload()} className="rounded-full bg-info px-3 py-1 text-meta font-semibold text-black">
        {ui.updateAction}
      </button>
    </div>
  );
}
