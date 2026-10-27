"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/apiBase";
import { registerFrames } from "@/lib/curriculum/frames";
import { hasScripts, registerScripts } from "@/lib/curriculum/stageScripts";

/**
 * 앱에 든 대본·틀이 없는 학습 언어는 서버에서 받는다(2026-10-28, 2.76부터 — 이 앱이 나간 뒤 더한 언어도 빌드 없이 보이게).
 * 받으면 stageScripts·frames에 넣고 다시 그린다. 폰에도 남겨 다음에 바로 쓰고, 열 때마다 서버 것으로 새로 고친다(고친 대본이 들어오게).
 * 돌려주는 값: 이 언어에 대본이 있는지.
 */
const STORE = "scriptPack.v1";
const fetched = new Set<string>();

type Pack = { scripts?: unknown; frames?: unknown };

function readStored(language: string): Pack | null {
  try {
    const raw = localStorage.getItem(`${STORE}:${language}`);
    return raw ? (JSON.parse(raw) as Pack) : null;
  } catch {
    return null;
  }
}

function writeStored(language: string, pack: Pack): void {
  try {
    localStorage.setItem(`${STORE}:${language}`, JSON.stringify(pack));
  } catch {
    // 저장이 안 되면 다음에 다시 받는다.
  }
}

function register(language: string, pack: Pack | null): boolean {
  if (!pack) return false;
  const scripts = registerScripts(language, pack.scripts);
  registerFrames(language, pack.frames);
  return scripts;
}

export function useScriptPack(language: string): boolean {
  const [, setVersion] = useState(0);
  const bundled = hasScripts(language);
  useEffect(() => {
    // 앱에 든 언어이거나 이번에 이미 받으러 갔으면 그대로.
    if (hasScripts(language) || fetched.has(language)) return;
    let cancelled = false;
    if (register(language, readStored(language))) {
      queueMicrotask(() => {
        if (!cancelled) setVersion((n) => n + 1);
      });
    }
    fetched.add(language);
    void fetch(apiUrl(`/api/curriculum/scripts?pack=1&lang=${encodeURIComponent(language)}`))
      .then((response) => (response.ok ? (response.json() as Promise<Pack>) : null))
      .then((pack) => {
        if (!pack || !Array.isArray(pack.scripts) || !pack.scripts.length) return;
        writeStored(language, pack);
        if (register(language, pack) && !cancelled) setVersion((n) => n + 1);
      })
      .catch(() => {
        fetched.delete(language);
      });
    return () => {
      cancelled = true;
    };
  }, [language]);
  return bundled || hasScripts(language);
}
