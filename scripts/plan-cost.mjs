/**
 * 요금별 비용 표를 단가표에서 다시 계산해 hub/costs.md로 쓴다.
 *
 * 요금 결정(hub/drafts/pricing-2026-10.md)의 "최악 비용" 표는 손으로 계산한
 * 것이라, 기능이 늘거나 단가·한도가 바뀌어도 그대로였다. 이 스크립트는
 * 요금표(plans.ts), 기능별 단가(opCost.ts), 원가 가정(cost.ts)만 읽어 같은 표를
 * 매번 새로 만든다. KV·키가 필요 없어 GitHub Actions에서 돈다(.github/workflows/cost.yml):
 * main에 push하면 다시 계산해서 바뀐 게 있으면 hub/costs.md를 커밋한다.
 *
 * 결과에 날짜·시각을 넣지 않는다 — 입력이 같으면 파일도 같아서, 비용에
 * 영향 없는 push는 커밋을 만들지 않는다.
 *
 * 실행: node --experimental-strip-types scripts/plan-cost.mjs          (hub/costs.md 쓰기)
 *       node --experimental-strip-types scripts/plan-cost.mjs --check  (파일이 최신이 아니면 실패)
 *       node --experimental-strip-types scripts/plan-cost.mjs --stdout
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  KRW_PER_USD,
  POINT_BUNDLES,
  PRICE_SOURCE,
  ROLEPLAY_TURN,
  STORE_FEE_SHARE,
  TTS_USD_PER_MINUTE,
  bundleMargin,
  pointCostUsd,
  roleplayMinuteUsd,
} from "../src/lib/billing/cost.ts";
import { FREE_LIFETIME_ROLEPLAY_POINTS } from "../src/lib/billing/config.ts";
import { termsFor } from "../src/lib/billing/plans.ts";
import { AD_REVENUE_USD, DEFAULT_ADS_SETTINGS } from "../src/lib/billing/ads.ts";
import { MODEL_CALLS_PER_REQUEST } from "../src/lib/server/modelCalls.ts";
import {
  CHAT_MESSAGE_OPS,
  DEFAULT_CALL_TOKENS,
  OP_COST,
  PACK,
  assumedOps,
  chatMessageUsd,
  opUsd,
  packUsd,
} from "../src/lib/billing/opCost.ts";
import { UNMETERED, scanRoutes } from "./cost-coverage.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "hub/costs.md");
const DAYS = 30;

/**
 * "많이 쓰는 사용자" 하루. scripts/cost-report.mjs 실측(2026-10-16, 최근 30일,
 * 실제 사용자 50명)의 상위 10%. 실측을 다시 돌리면 여기를 고친다.
 */
export const HEAVY_DAY = { callMinutes: 7.1, chat: 3, packs: 1, source: "cost-report.mjs 실측 2026-10-16, 상위 10%" };

const krw = (usd) => usd * KRW_PER_USD.rate;
const won = (n) => `${Math.round(n).toLocaleString("ko-KR")}원`;
const won1 = (n) => `${(Math.round(n * 10) / 10).toLocaleString("ko-KR")}원`;
const pct = (n) => `${Math.round(n * 100)}%`;

/** 요금 하나의 한 달(30일) 비용. `day`는 하루 쓰는 양, null이면 한도 꽉. */
export function monthCost(terms, day = null) {
  const packs = day ? Math.min(day.packs, 1 + terms.extraPacks) : 1 + terms.extraPacks;
  const callMinutes = day ? Math.min(day.callMinutes, terms.dailyCallMinutes ?? (terms.monthlyGrantPoints ? day.callMinutes : 0)) : terms.dailyCallMinutes ?? 0;
  const chats = day ? Math.min(day.chat, terms.dailyChat ?? day.chat) : terms.dailyChat ?? 100;
  // 월 포인트(옛 프리미엄)는 한도 꽉이면 전부, 보통 사용이면 쓴 통화 분만큼만(위 callMinutes에 들어감).
  const grantUsd = day ? 0 : terms.monthlyGrantPoints * pointCostUsd();
  const parts = {
    pack: packs * packUsd() * DAYS,
    call: callMinutes * roleplayMinuteUsd() * DAYS,
    chat: chats * chatMessageUsd() * DAYS,
    grant: grantUsd,
  };
  const totalUsd = parts.pack + parts.call + parts.chat + parts.grant;
  const netKrw = terms.priceKrw ? terms.priceKrw * (1 - STORE_FEE_SHARE) : 0;
  const totalKrw = krw(totalUsd);
  return {
    parts: Object.fromEntries(Object.entries(parts).map(([k, v]) => [k, krw(v)])),
    totalKrw,
    netKrw,
    leftKrw: netKrw - totalKrw,
    leftShare: netKrw ? (netKrw - totalKrw) / netKrw : null,
    chatUnlimited: terms.dailyChat === null,
  };
}

const PLANS = [
  { name: "무료", terms: termsFor("free") },
  { name: "라이트 3,900원", terms: termsFor("lite") },
  { name: "플러스 5,500원", terms: termsFor("plus") },
  { name: "프리미엄 9,900원 (지금, 월 80포인트)", terms: termsFor("premium", Date.now(), null) },
  { name: "프리미엄 8,900원 (전환 후)", terms: termsFor("premium", Date.UTC(2100, 1, 1), "2100-01-01") },
];

function limitsLine(terms) {
  const call = terms.dailyCallMinutes !== null ? `통화 매일 ${terms.dailyCallMinutes}분` : terms.monthlyGrantPoints ? `월 ${terms.monthlyGrantPoints}포인트` : "통화 없음(처음 20포인트 별도)";
  const chat = terms.dailyChat !== null ? `채팅 ${terms.dailyChat}번` : "채팅 제한 없음(100번으로 계산)";
  return `팩 ${1 + terms.extraPacks}번 · ${call} · ${chat}`;
}

export function render() {
  const lines = [];
  const push = (...l) => lines.push(...l);
  const rows = PLANS.map((p) => ({ ...p, worst: monthCost(p.terms), heavy: monthCost(p.terms, HEAVY_DAY) }));
  const warnings = rows.filter((r) => r.terms.priceKrw && r.worst.leftKrw < 0);
  const coverage = scanRoutes();
  const missing = coverage.filter((r) => !r.metered && !r.allowed);

  push(
    "# 비용 구조 (자동 계산)",
    "",
    "> **손으로 고치지 마세요.** `scripts/plan-cost.mjs`가 요금표(`src/lib/billing/plans.ts`)·기능별 단가(`src/lib/billing/opCost.ts`)·원가 가정(`src/lib/billing/cost.ts`)에서 만듭니다.",
    "> main에 push하면 GitHub Actions(`cost.yml`)가 다시 계산해서, 바뀐 게 있으면 이 파일을 커밋합니다.",
    "> 모두 **추정**입니다. 실제 사용량 비용은 `scripts/cost-report.mjs`(KV 키 필요, 사용자 PC).",
    "",
  );

  if (warnings.length || missing.length) {
    push("## 주의", "");
    for (const r of warnings) push(`- **${r.name}**: 한도를 매일 꽉 채우면 한 달 ${won(-r.worst.leftKrw)} 손해 (수수료 뺀 ${won(r.worst.netKrw)} < 비용 ${won(r.worst.totalKrw)}).`);
    for (const r of missing) push(`- 사용량을 기록하지 않는 모델 경로: \`${r.route}\` — 이 비용은 아래 어디에도 안 잡힘.`);
    if (warnings.length) {
      const chatAssumed = CHAT_MESSAGE_OPS.filter((op) => assumedOps().includes(op));
      push(
        `- 최악은 구독자 모두가 매일 모든 한도를 다 쓰는 경우입니다. 채팅 한 통 ${won1(krw(chatMessageUsd()))}${chatAssumed.length ? `은 잰 값이 아닌 가정(${chatAssumed.join(", ")} 호출당 ${DEFAULT_CALL_TOKENS.input}/${DEFAULT_CALL_TOKENS.output} 토큰)` : ""}이라, 실측 토큰이 쌓이면 \`cost-report.mjs\`로 다시 봐야 합니다.`,
      );
    }
    push("");
  }

  push(
    "## 요금별 한 달 비용 (30일)",
    "",
    `- **최악**: 매일 한도를 꽉 채움. **많이 쓰는 사용자**: ${HEAVY_DAY.source} — 하루 통화 ${HEAVY_DAY.callMinutes}분 · 채팅 ${HEAVY_DAY.chat}번 · 팩 ${HEAVY_DAY.packs}번(요금 한도 안에서).`,
    `- 남는 돈 = 가격 − Play 수수료 ${pct(STORE_FEE_SHARE)} − 비용. 구매 포인트·포인트 묶음은 따로 팔리므로 빼고 계산.`,
    "",
    "| 요금 | 하루 한도 | 수수료 뺀 금액 | 최악 비용 | 최악 남는 돈 | 많이 쓰는 사용자 비용 | 그때 남는 돈 |",
    "|---|---|---|---|---|---|---|",
  );
  for (const r of rows) {
    const left = (c) => (c.leftShare === null ? "—" : `${c.leftKrw < 0 ? "⚠ " : ""}${won(c.leftKrw)} (${pct(c.leftShare)})`);
    push(`| ${r.name} | ${limitsLine(r.terms)} | ${r.terms.priceKrw ? won(r.worst.netKrw) : "—"} | ${won(r.worst.totalKrw)} | ${left(r.worst)} | ${won(r.heavy.totalKrw)} | ${left(r.heavy)} |`);
  }
  push(
    "",
    "최악 비용 내역:",
    "",
    "| 요금 | 팩 | 자유 통화 | 채팅 | 월 포인트 |",
    "|---|---|---|---|---|",
  );
  for (const r of rows) push(`| ${r.name} | ${won(r.worst.parts.pack)} | ${won(r.worst.parts.call)} | ${won(r.worst.parts.chat)} | ${won(r.worst.parts.grant)} |`);
  push(
    "",
    `무료는 처음 한 번 ${FREE_LIFETIME_ROLEPLAY_POINTS}포인트(통화 ${FREE_LIFETIME_ROLEPLAY_POINTS * 5}분, 약 ${won(krw(FREE_LIFETIME_ROLEPLAY_POINTS * pointCostUsd()))})를 따로 씁니다. 이달의 영상(라이브러리)은 자막이 미리 만들어져 있어 비용에 넣지 않았습니다.`,
    "",
    "## 광고 (무료·안드로이드만)",
    "",
    `\`src/lib/billing/ads.ts\` 처음 값 기준. 운영 값은 Vercel \`ADS_*\` 환경 변수가 바꿀 수 있습니다. 광고 수익은 ${AD_REVENUE_USD.source}.`,
    "",
    "| 무엇 | 원가 | 광고 수익(낮음~높음) | 남는 돈(낮음~높음) |",
    "|---|---|---|---|",
    ...(() => {
      const s = DEFAULT_ADS_SETTINGS;
      const rewardCost = krw(s.rewardChats * chatMessageUsd());
      const rw = AD_REVENUE_USD.rewarded;
      const it = AD_REVENUE_USD.interstitial;
      const chatsPerInterstitial = s.interstitialAfterChats;
      const intCost = krw(chatsPerInterstitial * chatMessageUsd());
      const fullBonusMonth = krw(s.rewardedDailyMax * s.rewardChats * chatMessageUsd() * DAYS);
      return [
        `| 보상형 1회 = 채팅 ${s.rewardChats}번 | ${won1(rewardCost)} | ${won1(krw(rw.low))} ~ ${won1(krw(rw.high))} | ${won1(krw(rw.low) - rewardCost)} ~ ${won1(krw(rw.high) - rewardCost)} |`,
        `| 전면 1회(채팅 ${chatsPerInterstitial}번마다 기준, 무료 기본 채팅을 메움) | ${won1(intCost)} | ${won1(krw(it.low))} ~ ${won1(krw(it.high))} | ${won1(krw(it.low) - intCost)} ~ ${won1(krw(it.high) - intCost)} |`,
        `| 앱 오프닝 1회(주는 것 없음) | 0원 | ${won1(krw(AD_REVENUE_USD.appOpen.low))} ~ ${won1(krw(AD_REVENUE_USD.appOpen.high))} | 같음 |`,
        `| 배너 노출 1회(약 60초마다, 주는 것 없음) | 0원 | ${won1(krw(AD_REVENUE_USD.banner.low))} ~ ${won1(krw(AD_REVENUE_USD.banner.high))} | 같음 |`,
        `| 보상형 하루 ${s.rewardedDailyMax}번을 매일(한 달) | ${won(fullBonusMonth)} | ${won(krw(rw.low) * s.rewardedDailyMax * DAYS)} ~ ${won(krw(rw.high) * s.rewardedDailyMax * DAYS)} | ${won(krw(rw.low) * s.rewardedDailyMax * DAYS - fullBonusMonth)} ~ ${won(krw(rw.high) * s.rewardedDailyMax * DAYS - fullBonusMonth)} |`,
      ];
    })(),
    "",
    "보상형으로 늘어난 채팅은 광고가 메우는 만큼만 줍니다. 무료 + 광고 최대치는 라이트 채팅 한도보다 작게(`ads.test.ts`가 지킴). 구독자는 광고가 없어 위 유료 손익과 별개입니다.",
    "",
    "## 단위 비용",
    "",
    "| 무엇 | 한 번 | 어떻게 |",
    "|---|---|---|",
    `| 자유 통화 1분 | ${won1(krw(roleplayMinuteUsd()))} | 15초 턴 4번: 캐릭터 판단(4.1-mini) + 음성 합성 ${ROLEPLAY_TURN.tutorSpeakingSeconds}초 + 받아쓰기 ${ROLEPLAY_TURN.learnerSpeakingSeconds}초 |`,
    `| 오늘의 팩 1번 | ${won1(krw(packUsd()))} | ${PACK.items}문답 × (받아쓰기 + 판단) + 합성 ${pct(PACK.synthesisedShare)}만 (가정) |`,
    `| 채팅 1통 | ${won1(krw(chatMessageUsd()))} | ${CHAT_MESSAGE_OPS.join(" + ")} |`,
    `| 포인트 1개 | ${won1(krw(pointCostUsd()))} | 통화 5분과 영상 3분 준비 중 비싼 쪽 |`,
    "",
    "## 기능별 한 번 비용 (요금 한도 밖 기능 포함)",
    "",
    "요금 표에는 통화·팩·채팅만 들어갑니다. 아래 나머지(문장 분석·질문·번역·듣기 등)는 한도 없이 쓰이므로 많이 쓰는 기능이 생기면 여기서 단가를 보고 판단합니다.",
    "",
    "| 기능(op) | 한 번 | 모델 호출 | 값 매기는 법 | 근거 |",
    "|---|---|---|---|---|",
  );
  const describe = (op) => {
    const c = OP_COST[op];
    switch (c.kind) {
      case "model": {
        const t = c.tokens ?? DEFAULT_CALL_TOKENS;
        return `${c.model === "mini" ? "gpt-4o-mini" : `gpt-${c.model}`} ${t.input}/${t.output} 토큰`;
      }
      case "subtitle": return "자막 단계 gpt-4o-mini";
      case "transcribe": return `받아쓰기 ${c.seconds}초`;
      case "tts": return `음성 합성 ${c.seconds}초`;
      case "flat": return "한 번 고정값";
      case "counter": return "돈 안 듦(비율용 기록)";
    }
  };
  const ops = Object.keys(OP_COST).sort((a, b) => opUsd(b) - opUsd(a) || a.localeCompare(b));
  for (const op of ops) {
    const c = OP_COST[op];
    const basis = c.kind === "counter" ? "—" : c.basis === "measured" ? "잰 값" : "가정";
    push(`| ${op} | ${c.kind === "counter" ? "0원" : won1(krw(opUsd(op)))} | ${MODEL_CALLS_PER_REQUEST[op]} | ${describe(op)} | ${basis} |`);
  }
  push(
    "",
    "## 포인트 묶음",
    "",
    "| 상품 | 포인트 | 가격 | 수수료 뺀 금액 | 비용 | 남는 비율 |",
    "|---|---|---|---|---|---|",
  );
  for (const b of POINT_BUNDLES) {
    const m = bundleMargin(b);
    push(`| ${b.productId} | ${b.points} | ${won(b.priceKrw)} | ${won(krw(m.netUsd))} | ${won(krw(m.costUsd))} | ${pct(m.marginShare)} |`);
  }
  push(
    "",
    "## 기록 확인",
    "",
    `모델을 쓰는 서버 경로 ${coverage.length}개 중 ${coverage.filter((r) => r.metered).length}개가 사용량을 기록합니다 (\`scripts/cost-coverage.mjs\`).`,
  );
  for (const [route, why] of Object.entries(UNMETERED)) push(`- 일부러 뺌: \`${route}\` — ${why}`);
  push(
    "",
    "## 가정 (믿기 어려운 숫자부터 확인)",
    "",
    `- 모델 단가: ${PRICE_SOURCE.url} (${PRICE_SOURCE.checkedOn} 확인). 1달러 ${KRW_PER_USD.rate}원(${KRW_PER_USD.assumedOn}).`,
    `- 음성 합성 분당 $${TTS_USD_PER_MINUTE} — 통화 비용의 대부분, \`cost.ts\`에서 가장 약한 숫자.`,
    `- 잰 적 없는 모델 호출 한 번 = ${DEFAULT_CALL_TOKENS.input}/${DEFAULT_CALL_TOKENS.output} 토큰. 실측 보고서는 서버가 잰 토큰(\`usage:tok:*\`)이 20번 넘게 쌓인 기능부터 그 값을 씁니다.`,
    `- 가정으로 값을 매기는 기능 ${assumedOps().length}개: ${assumedOps().join(", ")}.`,
    "",
    "## 새 기능을 넣을 때",
    "",
    "1. 모델을 부르는 route에 `meterRequest(request, \"<op>\")` — 빠지면 CI의 `cost-coverage`가 실패.",
    "2. op를 `src/lib/server/modelCalls.ts`(호출 횟수)와 `src/lib/billing/opCost.ts`(값 매기는 법)에 — 빠지면 `opCost.test.ts`가 실패.",
    "3. 요금 한도에 들어가는 기능이면(채팅 한 통에 따라붙는 호출 등) `opCost.ts`의 `CHAT_MESSAGE_OPS`·`PACK`이나 `scripts/plan-cost.mjs`에 반영.",
    "4. push하면 이 파일이 저절로 다시 계산됩니다.",
    "",
  );
  return lines.join("\n");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const text = render();
  if (process.argv.includes("--stdout")) {
    process.stdout.write(text);
  } else if (process.argv.includes("--check")) {
    let current = "";
    try {
      current = readFileSync(OUT, "utf8");
    } catch {
      // 없으면 최신이 아님.
    }
    if (current !== text) {
      console.error("hub/costs.md가 최신이 아니에요. node --experimental-strip-types scripts/plan-cost.mjs 로 다시 만드세요.");
      process.exitCode = 1;
    } else {
      console.log("hub/costs.md 최신");
    }
  } else {
    writeFileSync(OUT, text);
    console.log("hub/costs.md 갱신");
  }
}
