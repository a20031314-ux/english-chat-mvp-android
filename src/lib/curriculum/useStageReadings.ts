"use client";

/**
 * 단계 학습 줄의 읽는 법(2026-10-29, server/stageReadings.ts): 받아서 폰에 남기고, 줄 글 → 읽는 법 표를 돌려준다.
 * 켜고 끄기는 학습 언어마다 이 폰에(기본: 1·2단계는 켬, 그 뒤는 끔).
 */
import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/apiBase";
import { needsLetters } from "@/lib/curriculum/letterLangs";

const STORE = "stageReadings.v1";
const SHOW = "showReading.v1";

export function useStageReadings(language: string, stage: number): Record<string, string> {
  const [map, setMap] = useState<Record<string, string>>({});
  useEffect(() => {
    if (!needsLetters(language) || !stage) return;
    let alive = true;
    const key = `${STORE}:${language}:${stage}`;
    try {
      const raw = localStorage.getItem(key);
      if (raw) queueMicrotask(() => alive && setMap(JSON.parse(raw) as Record<string, string>));
    } catch {
      // 받아서 쓴다.
    }
    void fetch(apiUrl(`/api/curriculum/scripts?readings=1&lang=${encodeURIComponent(language)}&stage=${stage}`))
      .then((response) => (response.ok ? (response.json() as Promise<{ readings?: Record<string, string> }>) : null))
      .then((body) => {
        const readings = body?.readings;
        if (!alive || !readings || !Object.keys(readings).length) return;
        setMap(readings);
        try {
          localStorage.setItem(key, JSON.stringify(readings));
        } catch {
          // 이번에만.
        }
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [language, stage]);
  return map;
}

export function useShowReading(language: string, stage: number): [boolean, (on: boolean) => void] {
  const [on, setOn] = useState(false);
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(`${SHOW}.${language}`);
    } catch {
      saved = null;
    }
    queueMicrotask(() => setOn(needsLetters(language) && (saved === null ? stage <= 2 : saved === "1")));
  }, [language, stage]);
  return [
    on,
    (next) => {
      setOn(next);
      try {
        localStorage.setItem(`${SHOW}.${language}`, next ? "1" : "0");
      } catch {
        // 이번에만.
      }
    },
  ];
}
