"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/apiBase";
import type { ItemStats } from "@/lib/curriculum/itemStats";

/** 모든 사용자의 시험 문제 통계(curriculum/itemStats.ts)를 언어마다 한 번 받는다(앱을 켠 동안 같은 값). 못 받으면 null — 시험은 통계 없이 짠다. */
const cache = new Map<string, Promise<ItemStats | null>>();
const ready = new Map<string, ItemStats | null>();

/** 이미 받아 둔 값(없으면 null) — 시험 첫 문제를 짤 때(화면을 열기 전에 받아 둠). */
export function peekItemStats(language: string): ItemStats | null {
  return ready.get(language) ?? null;
}

function load(language: string): Promise<ItemStats | null> {
  let pending = cache.get(language);
  if (!pending) {
    pending = fetch(apiUrl(`/api/curriculum/scripts?lang=${encodeURIComponent(language)}&itemStats=1`))
      .then((response) => (response.ok ? response.json() : null))
      .then((body: { stats?: ItemStats } | null) => (body?.stats && typeof body.stats === "object" ? body.stats : null))
      .catch(() => null)
      .then((value) => {
        ready.set(language, value);
        return value;
      });
    cache.set(language, pending);
  }
  return pending;
}

export function useItemStats(language: string): ItemStats | null {
  const [stats, setStats] = useState<{ language: string; stats: ItemStats | null } | null>(null);
  useEffect(() => {
    let alive = true;
    void load(language).then((value) => {
      if (alive) setStats({ language, stats: value });
    });
    return () => {
      alive = false;
    };
  }, [language]);
  return stats?.language === language ? stats.stats : null;
}
