import { NextRequest } from "next/server";
import { setPackHidden, setSaleStatus } from "@/lib/server/iconStore";
import { isPackId } from "@/lib/rooms/icons";
import { jsonWithCors } from "@/lib/server/cors";
import { readAccounts } from "@/lib/server/accountStore";
import { readReportRows, isAccountId } from "@/lib/server/socialStore";
import { canOperate, liftBan, markDone, readBans, readDone, reportId, setBan } from "@/lib/server/opsStore";
import { randomOpsView, setRandomOff, setRandomPause } from "@/lib/server/randomStore";
import { RANDOM_PAUSE_HOURS, SUSPEND_DAYS, openCounts, parseReports, type OpsList, type OpsPerson } from "@/lib/ops/reports";

export const dynamic = "force-dynamic";

/**
 * 운영자 신고함(페이지 /ops). 헤더 `x-ops-key`(Vercel `OPS_KEY`, 없으면 의견함 읽기 키).
 * 모델을 부르지 않는다. 판단은 사람이 — 여기 동작은 버튼을 누른 그대로만.
 *
 * - list: 최근 신고(사람 신고 + AI 영상 검사) 최신순, 신고된 사람·신고한 사람의 이름·정지 상태·랜덤 상태
 * - suspend {target, days: 1|7|30|null(풀 때까지), note} / unsuspend {target}: 사람 기능 정지(학습 기능은 그대로)
 * - randomPause {target, hours: 24|168} / randomUnpause, randomOff / randomOn {target}: 랜덤(Spin)만
 * - done {id, done, note}: 처리함 표시
 * - hideIconPack / showIconPack {packId}: 아이콘 묶음 내리기(판매 묶음이면 산 사람에게 포인트 돌려줌)·되돌리기
 * - approveIconSale / rejectIconSale {packId}: 판매 신청(줄 "icon-sale:<id>") 승인 → 목록에 뜸 · 거절
 */
const bad = (request: NextRequest, error: string, status = 400) => jsonWithCors(request, { error }, { status });

async function list(): Promise<OpsList> {
  const now = Date.now();
  const [rows, done] = await Promise.all([readReportRows(500), readDone()]);
  const reports = parseReports(
    rows.map((raw) => ({ id: reportId(raw), raw })),
    done,
  );
  const ids = [...new Set(reports.flatMap((report) => [report.target, report.reporter]).filter((id) => isAccountId(id)))];
  const targets = new Set(reports.map((report) => report.target));
  const [accounts, bans, randoms] = await Promise.all([
    readAccounts(ids),
    readBans(ids, now),
    Promise.all(ids.map((id) => (targets.has(id) ? randomOpsView(id, now) : Promise.resolve(null)))),
  ]);
  const counts = openCounts(reports);
  const people: Record<string, OpsPerson> = {};
  ids.forEach((id, index) => {
    const account = accounts[index];
    people[id] = {
      id,
      name: account ? account.profile.nickname || account.username || "" : "",
      exists: Boolean(account),
      ban: bans[index],
      random: randoms[index] ?? { verified: false, adult: false, foreigner: false, pausedUntil: null, strikes: 0, off: false },
      openReports: counts.get(id) ?? 0,
    };
  });
  return { reports, people, now };
}

export async function POST(request: NextRequest) {
  if (!canOperate(request.headers.get("x-ops-key"))) return bad(request, "NO_KEY", 403);
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return bad(request, "Invalid JSON");
  }
  const action = body.action;
  if (action === "list") return jsonWithCors(request, await list());

  if (action === "done") {
    if (typeof body.id !== "string" || !/^[0-9a-f]{12}$/.test(body.id)) return bad(request, "BAD_ID");
    await markDone(body.id, body.done !== false, typeof body.note === "string" ? body.note : "");
    return jsonWithCors(request, { ok: true });
  }

  // 아이콘 묶음 내리기·되돌리기(저작권 등 신고, 줄에 "icon-pack:<id>"). 내리면 목록·보내기·그림 모두 막힌다.
  if (action === "hideIconPack" || action === "showIconPack") {
    if (!isPackId(body.packId)) return bad(request, "BAD_ID");
    const found = await setPackHidden(body.packId, action === "hideIconPack");
    return found ? jsonWithCors(request, { ok: true }) : bad(request, "NOT_FOUND", 404);
  }

  // 아이콘 판매 신청 승인·거절(줄에 "icon-sale:<id>").
  if (action === "approveIconSale" || action === "rejectIconSale") {
    if (!isPackId(body.packId)) return bad(request, "BAD_ID");
    const found = await setSaleStatus(body.packId, action === "approveIconSale" ? "approved" : "rejected");
    return found ? jsonWithCors(request, { ok: true }) : bad(request, "NOT_FOUND", 404);
  }

  const target = body.target;
  if (!isAccountId(target)) return bad(request, "BAD_TARGET");
  const now = Date.now();
  const note = typeof body.note === "string" ? body.note : "";

  if (action === "suspend") {
    const days = body.days === null ? null : Number(body.days);
    if (days !== null && !(SUSPEND_DAYS as readonly number[]).includes(days)) return bad(request, "BAD_DAYS");
    const ban = await setBan(target, days === null ? null : now + days * 24 * 60 * 60 * 1000, note, now);
    return jsonWithCors(request, { ok: true, ban });
  }
  if (action === "unsuspend") {
    await liftBan(target);
    return jsonWithCors(request, { ok: true });
  }
  if (action === "randomPause") {
    const hours = Number(body.hours);
    if (!(RANDOM_PAUSE_HOURS as readonly number[]).includes(hours)) return bad(request, "BAD_HOURS");
    await setRandomPause(target, now + hours * 60 * 60 * 1000, now);
    return jsonWithCors(request, { ok: true });
  }
  if (action === "randomUnpause") {
    await setRandomPause(target, null, now);
    return jsonWithCors(request, { ok: true });
  }
  if (action === "randomOff" || action === "randomOn") {
    const result = await setRandomOff(target, action === "randomOff", now);
    return result === "ok" ? jsonWithCors(request, { ok: true }) : bad(request, result, 409);
  }
  return bad(request, "UNKNOWN_ACTION");
}
