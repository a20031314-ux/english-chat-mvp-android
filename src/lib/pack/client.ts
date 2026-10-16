/**
 * The app's side of the daily pack (pack/pack.ts): ask for today's, and say
 * when it is over to get the retro back.
 */
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { PracticeGoal } from "@/lib/learner/practice";
import type { GapId } from "@/lib/learner/selfCheck";
import type { Retro } from "./pack";

export type PackToday = {
  available: true;
  day: string;
  centre: GapId;
  side: GapId;
  questions: number;
  answered: number;
  minutes: number;
  phrases: string[];
  status: "new" | "doing" | "done";
  practice: PracticeGoal;
  retro?: Retro;
};

/** The learner's own date: a pack turns over at their midnight, not the server's. */
export function localDay(now = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export async function fetchPackToday(language: string, isPremium: boolean): Promise<PackToday | null> {
  try {
    const response = await fetch(
      apiUrl(`/api/pack/today?lang=${encodeURIComponent(language)}&day=${localDay()}`),
      { headers: entitlementHeaders(isPremium) },
    );
    if (!response.ok) return null;
    const data = (await response.json()) as { available?: boolean } & Partial<PackToday>;
    return data.available && typeof data.day === "string" && data.practice ? (data as PackToday) : null;
  } catch {
    return null;
  }
}

export async function finishPack(language: string, day: string, isPremium: boolean): Promise<Retro | null> {
  try {
    const response = await fetch(apiUrl("/api/pack/finish"), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...entitlementHeaders(isPremium) },
      body: JSON.stringify({ lang: language, day }),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { retro?: Retro };
    return data.retro ?? null;
  } catch {
    return null;
  }
}
