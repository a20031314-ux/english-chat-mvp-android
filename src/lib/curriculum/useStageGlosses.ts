"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/apiBase";
import { rememberGlosses } from "@/lib/curriculum/stageScripts";

/**
 * 단계 대본·틀 뜻풀이를 앱 언어로(영어·한국어 밖, 2026-10-28). 서버의 옮긴 표를 받아 glossFor가 쓰게 두고,
 * 받으면 한 번 다시 그린다. 같은 학습 언어·단계·앱 언어는 앱이 켜져 있는 동안 한 번만, 폰에도 남겨 다음에 바로 쓴다.
 */
const loaded = new Set<string>();
const STORE = "stageGlosses.v1";

function readStored(key: string): Record<string, string> | null {
  try {
    const raw = localStorage.getItem(`${STORE}:${key}`);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    return parsed && typeof parsed === "object" ? (parsed as Record<string, string>) : null;
  } catch {
    return null;
  }
}

function writeStored(key: string, glosses: Record<string, string>): void {
  try {
    localStorage.setItem(`${STORE}:${key}`, JSON.stringify(glosses));
  } catch {
    // 저장이 안 되면 다음에 다시 받는다.
  }
}

export function useStageGlosses(language: string, stage: number, ui: string): number {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    if (ui === "en" || ui === "ko" || !stage) return;
    const key = `${language}:${stage}:${ui}`;
    if (loaded.has(key)) return;
    let cancelled = false;
    const stored = readStored(key);
    if (stored) {
      rememberGlosses(ui, stored);
      queueMicrotask(() => {
        if (!cancelled) setVersion((n) => n + 1);
      });
    }
    void fetch(apiUrl(`/api/curriculum/scripts?glosses=1&lang=${encodeURIComponent(language)}&stage=${stage}&ui=${encodeURIComponent(ui)}`))
      .then((response) => (response.ok ? response.json() : null))
      .then((body: { glosses?: Record<string, string> } | null) => {
        const glosses = body?.glosses;
        if (!glosses || !Object.keys(glosses).length) return;
        loaded.add(key);
        rememberGlosses(ui, glosses);
        writeStored(key, glosses);
        if (!cancelled) setVersion((n) => n + 1);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [language, stage, ui]);
  return version;
}

/** 모든 단계(1~5) 뜻풀이 — 시험·퀴즈는 여러 단계 문장을 섞어 내서(2026-10-29 가상 사용자: 아랍어 앱에서 처음 시험 뜻 줄이 영어 정답 그대로). */
export function useAllStageGlosses(language: string, ui: string): number {
  return useStageGlosses(language, 1, ui) + useStageGlosses(language, 2, ui) + useStageGlosses(language, 3, ui) + useStageGlosses(language, 4, ui) + useStageGlosses(language, 5, ui);
}
