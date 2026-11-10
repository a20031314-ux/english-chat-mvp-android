import { NextRequest } from "next/server";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { coerceLanguageCode } from "@/lib/learningLanguages";
import { meterRequest } from "@/lib/server/meterRequest";
import { isSimRequest } from "@/lib/server/simData";
import { makeSpot, spotStored, type SpotWant } from "@/lib/server/spotMake";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

/**
 * POST { language, want: [{ ref: "w|낱말#0", type: "form"|"meaning", stage, g? }] } — 틀린 곳 고르기 문항 미리 만들기(server/spotMake.ts).
 * 모두가 같이 쓰는 저장에 있으면 그대로, 없으면 만들기(한 번에 둘까지 — 앱이 몇 문제 앞서 부름). 돌려줌 { items: { [ref:type]: SpotItem } }.
 * 모델을 부를 때마다 spotMake op로 셈. 점검 사용자(simcheck-)는 있는 것만 받는다(모두가 같이 쓰는 하루 예산을 안 씀).
 */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { language?: string; want?: Partial<SpotWant>[] };
  const language = coerceLanguageCode(body.language);
  const sim = isSimRequest(request);
  const wants = (Array.isArray(body.want) ? body.want : []).slice(0, 4).flatMap((one): SpotWant[] => {
    const ref = typeof one?.ref === "string" && /^w\|[^#]{1,40}#[01]$/.test(one.ref) ? one.ref : "";
    const type = one?.type === "form" || one?.type === "meaning" ? one.type : null;
    if (!ref || !type) return [];
    const g = typeof one.g === "string" && /^g\|\d+:\d+$/.test(one.g) ? one.g : undefined;
    return [{ ref, type, stage: Math.min(5, Math.max(1, Math.round(Number(one.stage) || 1))), ...(g ? { g } : {}) }];
  });
  const items: Record<string, unknown> = {};
  let made = 0;
  for (const want of wants) {
    const id = `${want.ref}:${want.type}`;
    if (sim || made >= 2) {
      const have = await spotStored(language, want).catch(() => null);
      if (have && "item" in have) items[id] = have.item;
      continue;
    }
    made += 1;
    const item = await makeSpot(language, want, () => void meterRequest(request, "spotMake")).catch(() => null);
    if (item) items[id] = item;
  }
  return jsonWithCors(request, { items });
}
