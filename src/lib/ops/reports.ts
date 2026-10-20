/**
 * 운영자 신고함(/ops ↔ api/ops/reports)이 주고받는 모양과, 신고 줄을 읽는 규칙.
 * 신고는 두 갈래: 사람이 프로필·방에서 보낸 것, AI 영상 검사(랜덤 영상)가 남긴 것.
 */

export type ReportKind = "user" | "ai";

export type OpsReport = {
  id: string;
  at: string;
  kind: ReportKind;
  /** 신고한 계정. AI가 스스로 남긴 것은 "ai". */
  reporter: string;
  target: string;
  /** 사람이 쓴 이유(그대로) 또는 AI 코드(ai_video_self · ai_video_self_off · ai_video_other). */
  reason: string;
  roomId: string | null;
  lines: string[];
  done: { at: number; note: string } | null;
};

export type OpsPerson = {
  id: string;
  name: string;
  /** 계정이 지워졌으면 false. */
  exists: boolean;
  ban: { at: number; until: number | null; note: string } | null;
  random: { verified: boolean; adult: boolean; foreigner: boolean; pausedUntil: number | null; strikes: number; off: boolean };
  /** 이 목록 안에서 이 사람이 신고된 수(처리 안 한 것). */
  openReports: number;
};

export type OpsList = { reports: OpsReport[]; people: Record<string, OpsPerson>; now: number };

export type OpsAction =
  | { action: "list" }
  | { action: "suspend"; target: string; days: number | null; note?: string }
  | { action: "unsuspend"; target: string }
  | { action: "randomPause"; target: string; hours: number }
  | { action: "randomUnpause"; target: string }
  | { action: "randomOff"; target: string }
  | { action: "randomOn"; target: string }
  | { action: "done"; id: string; done: boolean; note?: string };

export const SUSPEND_DAYS = [1, 7, 30] as const;
export const RANDOM_PAUSE_HOURS = [24, 168] as const;

export function reportKind(reporter: string, reason: string): ReportKind {
  return reporter === "ai" || reason.startsWith("ai_video") ? "ai" : "user";
}

type RawReport = { at?: unknown; reporter?: unknown; target?: unknown; reason?: unknown; roomId?: unknown; lines?: unknown };

/**
 * 저장된 줄(JSON, 오래된 것부터)을 최신순 신고로. 깨진 줄은 버린다.
 * `id`는 그 줄의 해시(서버가 계산해 넘김) — 같은 신고는 늘 같은 id.
 */
export function parseReports(
  rows: { id: string; raw: string }[],
  done: Record<string, { at: number; note: string }>,
): OpsReport[] {
  const out: OpsReport[] = [];
  for (const { id, raw } of rows) {
    let row: RawReport;
    try {
      row = JSON.parse(raw) as RawReport;
    } catch {
      continue;
    }
    if (typeof row.target !== "string" || typeof row.reporter !== "string") continue;
    const reason = typeof row.reason === "string" ? row.reason : "";
    out.push({
      id,
      at: typeof row.at === "string" ? row.at : "",
      kind: reportKind(row.reporter, reason),
      reporter: row.reporter,
      target: row.target,
      reason,
      roomId: typeof row.roomId === "string" ? row.roomId : null,
      lines: Array.isArray(row.lines) ? row.lines.filter((line): line is string => typeof line === "string") : [],
      done: done[id] ?? null,
    });
  }
  return out.reverse();
}

/** 처리 안 한 신고 수(사람별). */
export function openCounts(reports: OpsReport[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const report of reports) if (!report.done) counts.set(report.target, (counts.get(report.target) ?? 0) + 1);
  return counts;
}
