/**
 * 손익 계산 블록 — 가상 사용자(행동 유형)를 요금별(무료+광고 / 라이트 / 플러스 / 프리미엄)로 한 달 돌려
 * 한 사람당 원가·수입·남는 돈을 내고, 손익분기점 세 가지를 찾는다.
 *
 *   1. 유료 요금마다: 한도의 몇 %까지 매일 써도 본전인지, 채팅 1통 원가가 얼마 이하여야 "한도 꽉"도 본전인지
 *   2. 무료마다: 광고 단가(eCPM)가 지금 가정의 몇 배여야 본전인지
 *   3. 서비스 전체: 결제 전환율 × 광고 단가 격자에서 가입자 1,000명당 한 달 손익, 본전 전환율, 고정비를 메우는 데 필요한 가입자 수
 *
 * 숫자의 출처: 요금 한도 plans.ts, 기능별 단가 opCost.ts·cost.ts, 광고 규칙·eCPM ads.ts(ADS_* 환경 변수도 읽음),
 * 행동·비율 가정 economics.json. 앱·서버를 부르지 않는다(네트워크 없음, 결과가 늘 같음).
 *
 *   npm run sim:economics                         (표준 출력)
 *   npm run sim:economics -- --write              (hub/economics.md 쓰기)
 *   npm run sim:economics -- --ecpm low --conv 0.05 --chat-won 1.5 --vat 0 --fixed 60000 --ads-reward-chats 3
 *   ADS_REWARDED_DAILY_MAX=5 npm run sim:economics   (광고 설정을 바꿔 보기 — 운영과 같은 환경 변수)
 *   npm run sim:economics -- --assume my.json     (가정 파일 바꿔 끼우기)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { KRW_PER_USD, STORE_FEE_SHARE, roleplayMinuteUsd } from "../../src/lib/billing/cost.ts";
import { termsFor } from "../../src/lib/billing/plans.ts";
import { AD_REVENUE_USD, adsApply, adsSettings } from "../../src/lib/billing/ads.ts";
import { chatMessageUsd, opUsd, packUsd } from "../../src/lib/billing/opCost.ts";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const DAYS = 30;
const krw = (usd) => usd * KRW_PER_USD.rate;
const won = (n) => `${n < 0 ? "−" : ""}${Math.round(Math.abs(n)).toLocaleString("ko-KR")}원`;
const signed = (n) => `${n < 0 ? "−" : "+"}${Math.round(Math.abs(n)).toLocaleString("ko-KR")}원`;
const pct = (n) => `${Math.round(n * 1000) / 10}%`;

/** 하루 한도(plans.ts dailyAiHelp)에 들어가는 기능(server/aiHelp.ts를 거치는 것). */
const AI_HELP_OPS = ["translate", "howToSay", "howToSayCard", "analysisInput", "analysisElement", "expressionInsight", "vocabGloss"];

export const PLANS = [
  { id: "free", name: "무료(+광고)", terms: termsFor("free") },
  { id: "lite", name: "라이트 3,900원", terms: termsFor("lite") },
  { id: "plus", name: "플러스 5,500원", terms: termsFor("plus") },
  { id: "premium", name: "프리미엄 9,900원(지금)", terms: termsFor("premium", Date.now(), null) },
  { id: "premiumNew", name: "프리미엄 8,900원(전환 후)", terms: termsFor("premium", Date.UTC(2100, 1, 1), "2100-01-01") },
];

/** 실행 옵션: 가정 파일 + 명령줄로 덮어쓰기. */
export function options(argv = [], env = process.env) {
  const arg = (name) => {
    const i = argv.indexOf(`--${name}`);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const assume = JSON.parse(readFileSync(arg("assume") ? resolve(arg("assume")) : join(here, "economics.json"), "utf8"));
  const num = (name, fallback) => (arg(name) !== undefined && Number.isFinite(Number(arg(name))) ? Number(arg(name)) : fallback);
  // 광고 설정: 운영과 같은 ADS_* 환경 변수, 그 위에 --ads-reward-chats 같은 옵션.
  const adEnv = { ...env };
  for (const [flag, key] of [["ads-native", "ADS_NATIVE"], ["ads-reward-chats", "ADS_REWARD_CHATS"], ["ads-rewarded-max", "ADS_REWARDED_DAILY_MAX"], ["ads-gap", "ADS_INTERSTITIAL_GAP_SECONDS"], ["ads-after-chats", "ADS_INTERSTITIAL_AFTER_CHATS"], ["ads-banner", "ADS_BANNER"], ["ads-app-open", "ADS_APP_OPEN"]]) {
    if (arg(flag) !== undefined) adEnv[key] = arg(flag);
  }
  return {
    assume,
    ads: adsSettings(adEnv),
    ecpm: arg("ecpm") ?? "mid",
    vat: num("vat", assume.storeVat.rate),
    fill: num("fill", assume.adFillRate.rate),
    conv: num("conv", assume.conversion.rate),
    fixed: num("fixed", assume.fixedMonthlyKrw.value),
    chatWon: num("chat-won", krw(chatMessageUsd())),
    write: argv.includes("--write"),
  };
}

/** 광고 1회 수익(원), 시나리오 low / mid / high. */
export function adWon(kind, scenario) {
  const r = AD_REVENUE_USD[kind];
  const usd = scenario === "low" ? r.low : scenario === "high" ? r.high : (r.low + r.high) / 2;
  return krw(usd);
}

/** 이 날이 쓰는 날인가 — 고르게 퍼뜨리거나(front면) 앞쪽 며칠만. */
function active(type, d) {
  if (type.front) return d < type.days;
  return Math.floor(((d + 1) * type.days) / DAYS) > Math.floor((d * type.days) / DAYS);
}

/**
 * 한 사람 한 달. 요금 한도로 자르고, 무료면 ads.ts 규칙(간격·채팅 몇 번 뒤·설치 며칠 뒤·하루 상한)으로 광고를 센다.
 * 확률은 기대값으로 쌓아(rewardWill 누적) 결과가 늘 같다.
 */
export function simulate(type, terms, o) {
  const ads = adsApply(terms.tier, o.ads);
  const n = { chats: 0, callMinutes: 0, packs: 0, roomMinutes: 0, ops: {}, interstitial: 0, appOpen: 0, banner: 0, native: 0, rewarded: 0, blockedChats: 0 };
  let callPool = terms.monthlyGrantPoints ? terms.monthlyGrantPoints * 5 : Infinity; // 옛 프리미엄: 포인트 1개 = 통화 5분
  let lastAppOpen = -1e9;
  let lastInter = -1e9;
  let will = 0;
  for (let d = 0; d < DAYS; d += 1) {
    if (!active(type, d)) continue;
    const chatCap = terms.dailyChat ?? 100; // 제한 없음은 비용 표처럼 100번
    const callCap = terms.dailyCallMinutes ?? (terms.monthlyGrantPoints ? callPool : 0);
    const call = Math.min(type.callMinutes, callCap);
    callPool -= terms.monthlyGrantPoints ? call : 0;
    n.callMinutes += call;
    // 무료 팩은 주 N번(plans.ts packDaysPerWeek): 쓰는 날마다 그 비율만큼.
    const packCap = terms.packDaysPerWeek ? terms.packDaysPerWeek / 7 : 1 + terms.extraPacks;
    n.packs += Math.min(type.packs, packCap);
    // 방 자막은 하루 줄 수 한도(한 줄 ≈ 6초 → 분당 10줄).
    n.roomMinutes += terms.dailyCaptionLines ? Math.min(type.roomMinutes, terms.dailyCaptionLines / 10) : type.roomMinutes;
    // 누를 때만 도는 AI 도움은 하루 한도(plans.ts dailyAiHelp)까지 — 넘는 만큼은 같은 비율로 줄인다.
    const extras = Object.entries(type.extras ?? {});
    const helpSum = extras.filter(([op]) => AI_HELP_OPS.includes(op)).reduce((sum, [, times]) => sum + times, 0);
    const helpScale = terms.dailyAiHelp && helpSum > terms.dailyAiHelp ? terms.dailyAiHelp / helpSum : 1;
    for (const [op, times] of extras) n.ops[op] = (n.ops[op] ?? 0) + times * (AI_HELP_OPS.includes(op) ? helpScale : 1);

    let clock = d * 1440 + 9 * 60;
    let today = 0;
    let rewardsToday = 0;
    let limit = chatCap;
    const perSession = Math.ceil(type.chats / type.sessions);
    for (let s = 0; s < type.sessions; s += 1) {
      if (ads && o.ads.appOpenEnabled && d >= o.ads.appOpenAfterDays && clock - lastAppOpen >= o.ads.appOpenGapHours * 60) {
        n.appOpen += 1;
        lastAppOpen = clock;
      }
      const browse = type.browseMinutes / type.sessions;
      if (ads && o.ads.bannerEnabled) n.banner += browse; // 배너 새로고침 약 60초
      // 네이티브는 목록(대화·영상)을 열 때 한 번씩, 자동 새로고침 없음(lib/ads.ts).
      if (ads && o.ads.nativeEnabled) n.native += o.assume.native.perSession;
      let sent = 0;
      while (sent < perSession && today < type.chats) {
        if (today >= limit) {
          if (ads && rewardsToday < o.ads.rewardedDailyMax) {
            will += type.rewardWill * o.fill;
            if (will >= 1) {
              will -= 1;
              rewardsToday += 1;
              n.rewarded += 1;
              limit += o.ads.rewardChats;
              continue;
            }
          }
          n.blockedChats += Math.min(perSession - sent, type.chats - today) > 900 ? 0 : Math.min(perSession - sent, type.chats - today);
          break;
        }
        today += 1;
        sent += 1;
        n.chats += 1;
        clock += 1.5;
      }
      if (ads && sent >= o.ads.interstitialAfterChats && clock - lastInter >= o.ads.interstitialMinGapSeconds / 60) {
        n.interstitial += 1;
        lastInter = clock;
      }
      if (s === 0 && Math.min(type.packs, 1) > 0) {
        clock += 7;
        // 팩을 마치고 나올 때도 전면(간격만 지키면) — 팩을 일부 날만 하면 그 비율만큼.
        if (ads && clock - lastInter >= o.ads.interstitialMinGapSeconds / 60) {
          n.interstitial += Math.min(type.packs, 1);
          lastInter = clock;
        }
      }
      clock += browse + 31;
    }
  }
  const cost = {
    chat: n.chats * o.chatWon,
    call: krw(n.callMinutes * roleplayMinuteUsd()),
    pack: krw(n.packs * packUsd()),
    room: krw(n.roomMinutes * (o.assume.room.roomListen * opUsd("roomListen") + o.assume.room.translate * opUsd("translate"))),
    other: krw(Object.entries(n.ops).reduce((sum, [op, times]) => sum + times * opUsd(op), 0)),
  };
  const costKrw = Object.values(cost).reduce((a, b) => a + b, 0);
  const shown = (k) => (k === "rewarded" ? n.rewarded : n[k] * o.fill); // 보상형은 채워진 것만 셌음
  const adKrw = (scenario) => ["interstitial", "appOpen", "banner", "native", "rewarded"].reduce((sum, k) => sum + shown(k) * adWon(k, scenario), 0);
  const subKrw = terms.priceKrw ? (terms.priceKrw / (1 + o.vat)) * (1 - STORE_FEE_SHARE) : 0;
  return { n, cost, costKrw, subKrw, adKrw, net: (scenario = o.ecpm) => subKrw + adKrw(scenario) - costKrw };
}

/** 요금 안에서 유형 비율대로 섞은 한 사람 평균. */
export function blended(plan, mix, o) {
  const total = Object.values(mix).reduce((a, b) => a + b, 0);
  const acc = { costKrw: 0, subKrw: 0, ad: { low: 0, mid: 0, high: 0 } };
  for (const [id, share] of Object.entries(mix)) {
    const r = simulate(o.assume.types[id], plan.terms, o);
    const w = share / total;
    acc.costKrw += w * r.costKrw;
    acc.subKrw += w * r.subKrw;
    for (const s of ["low", "mid", "high"]) acc.ad[s] += w * r.adKrw(s);
  }
  acc.net = (s = o.ecpm) => acc.subKrw + acc.ad[s] - acc.costKrw;
  return acc;
}

/** 서비스 전체 한 사람 평균(가입자 기준) — 전환율 c, 결제자는 planShare대로. */
export function perSignup(o, c = o.conv, scenario = o.ecpm) {
  const free = blended(PLANS[0], o.assume.mix.free, o).net(scenario);
  const shares = o.assume.planShare;
  const totalShare = shares.lite + shares.plus + shares.premium;
  const paid = ["lite", "plus", "premium"].reduce((sum, id) => sum + (shares[id] / totalShare) * blended(PLANS.find((p) => p.id === id), o.assume.mix.paid, o).net(scenario), 0);
  return { free, paid, net: (1 - c) * free + c * paid, breakEvenConv: free >= 0 ? 0 : paid <= free ? null : -free / (paid - free) };
}

export function render(o) {
  const lines = [];
  const push = (...l) => lines.push(...l);
  const typeIds = Object.keys(o.assume.types).filter((k) => !k.startsWith("_"));
  const label = { low: "낮음", mid: "중간", high: "높음" }[o.ecpm] ?? o.ecpm;

  push(
    "# 손익 계산 (가상 사용자, 자동 계산)",
    "",
    "> **손으로 고치지 마세요.** `npm run sim:economics -- --write`가 요금 한도(`plans.ts`)·단가(`opCost.ts`·`cost.ts`)·광고 규칙과 eCPM(`ads.ts`)·행동 가정(`scripts/sim-users/economics.json`)에서 만듭니다.",
    "> 모두 **추정**입니다. 행동 유형과 비율, 광고 단가, 채움률은 가정입니다. 실측이 생기면 `economics.json`과 `ads.ts`의 숫자를 고치고 다시 돌립니다.",
    "",
    `이번 계산: 광고 단가 **${label}** · 채움률 ${pct(o.fill)} · 결제 전환율 ${pct(o.conv)} · 채팅 1통 ${Math.round(o.chatWon * 100) / 100}원 · Play 수수료 ${pct(STORE_FEE_SHARE)} · 부가세 ${pct(o.vat)}` +
      ` · 광고 설정: ${o.ads.rewardedDailyMax > 0 ? `보상형 1회 = 채팅 ${o.ads.rewardChats}번·하루 ${o.ads.rewardedDailyMax}번` : "보상형 끔"}, 무료 채팅 하루 ${PLANS[0].terms.dailyChat}번, 전면 ${o.ads.interstitialMinGapSeconds / 60}분 간격·채팅 ${o.ads.interstitialAfterChats}번 뒤, 앱 오프닝 설치 ${o.ads.appOpenAfterDays}일 뒤·${o.ads.appOpenGapHours}시간 간격${o.ads.bannerEnabled ? ", 배너 켬" : ", 배너 끔"}${o.ads.nativeEnabled ? `, 네이티브 켬(세션당 ${o.assume.native.perSession}번)` : ", 네이티브 끔"}.`,
    "",
  );

  // 1. 요금 × 유형
  push("## 1. 요금 × 사용자 유형 — 한 사람 한 달 남는 돈", "", `| 유형 | ${PLANS.map((p) => p.name).join(" | ")} |`, `|---|${PLANS.map(() => "---").join("|")}|`);
  for (const id of typeIds) {
    const cells = PLANS.map((p) => {
      const r = simulate(o.assume.types[id], p.terms, o);
      return `${r.net() < 0 ? "⚠ " : ""}${signed(r.net())}`;
    });
    push(`| ${id} | ${cells.join(" | ")} |`);
  }
  push("", "유료 = 구독 수입(부가세·수수료 뺌) − 원가. 무료 = 광고 수입 − 원가. 구매 포인트는 따로 팔리므로 넣지 않았습니다.", "");

  push("원가 내역(한도 꽉 유형):", "", "| 요금 | 채팅 | 자유 통화 | 팩 | 말하는 방 | 그 밖의 기능 | 원가 합 | 수입 |", "|---|---|---|---|---|---|---|---|");
  for (const p of PLANS) {
    const r = simulate(o.assume.types["한도 꽉"], p.terms, o);
    push(`| ${p.name} | ${won(r.cost.chat)} | ${won(r.cost.call)} | ${won(r.cost.pack)} | ${won(r.cost.room)} | ${won(r.cost.other)} | ${won(r.costKrw)} | ${won(r.subKrw + r.adKrw())} |`);
  }
  push("");

  // 2. 유료 손익분기
  push("## 2. 유료 요금 손익분기점", "", "| 요금 | 한 사람 수입 | 한도 꽉 원가 | 본전이 되는 사용률 | 한도 꽉도 본전인 채팅 1통 원가 | 유형 비율대로 섞으면 |", "|---|---|---|---|---|---|");
  for (const p of PLANS.slice(1)) {
    const full = simulate(o.assume.types["한도 꽉"], p.terms, o);
    const share = full.subKrw / full.costKrw;
    const chatBreak = (full.subKrw - (full.costKrw - full.cost.chat)) / full.n.chats;
    const mix = blended(p, o.assume.mix.paid, o);
    push(`| ${p.name} | ${won(full.subKrw)} | ${won(full.costKrw)} | ${share >= 1 ? "한도까지 다 써도 남음" : `한도의 **${pct(share)}**까지`} | ${chatBreak <= 0 ? "채팅 빼고도 손해" : `${Math.round(chatBreak * 100) / 100}원 이하`} | ${signed(mix.net())} |`);
  }
  push("", "사용률 = 매일 모든 한도(채팅·통화·팩·그 밖의 기능)를 같은 비율로 쓴다고 볼 때. 평균 사용자가 이 비율 아래면 그 요금은 남습니다.", "");

  // 3. 무료 + 광고
  push("## 3. 무료 + 광고 손익분기점", "", "| 유형 | 원가 | 광고 수입 낮음 / 중간 / 높음 | 본전에 필요한 광고 단가 | 광고 노출(전면·앱 오프닝·배너·네이티브·보상형) |", "|---|---|---|---|---|");
  const freePlan = PLANS[0];
  for (const id of typeIds) {
    const r = simulate(o.assume.types[id], freePlan.terms, o);
    const need = r.adKrw("mid") > 0 ? r.costKrw / r.adKrw("mid") : Infinity;
    push(`| ${id} | ${won(r.costKrw)} | ${won(r.adKrw("low"))} / ${won(r.adKrw("mid"))} / ${won(r.adKrw("high"))} | ${need === Infinity ? "광고 없음" : need <= 1 ? `중간의 ${Math.round(need * 100)}%면 됨` : `중간의 **${Math.round(need * 10) / 10}배**`} | ${Math.round(r.n.interstitial * o.fill)} · ${Math.round(r.n.appOpen * o.fill)} · ${Math.round(r.n.banner * o.fill)} · ${Math.round(r.n.native * o.fill)} · ${r.n.rewarded} |`);
  }
  const fm = blended(freePlan, o.assume.mix.free, o);
  push("", `무료 사용자 평균(유형 비율대로): 원가 ${won(fm.costKrw)}, 광고 ${won(fm.ad.low)} / ${won(fm.ad.mid)} / ${won(fm.ad.high)} → 남는 돈 ${signed(fm.net("low"))} / ${signed(fm.net("mid"))} / ${signed(fm.net("high"))}.`, "");

  // 4. 전체
  const convs = [0, 0.01, 0.02, 0.03, 0.05, 0.1];
  push("## 4. 서비스 전체 — 가입자 1,000명당 한 달 손익", "", `결제한 사람의 요금 비율: 라이트 ${o.assume.planShare.lite}% · 플러스 ${o.assume.planShare.plus}% · 프리미엄 ${o.assume.planShare.premium}%.`, "", `| 결제 전환율 | ${convs.map(pct).join(" | ")} | 본전 전환율 |`, `|---|${convs.map(() => "---").join("|")}|---|`);
  for (const s of ["low", "mid", "high"]) {
    const row = convs.map((c) => signed(perSignup(o, c, s).net * 1000));
    const be = perSignup(o, o.conv, s).breakEvenConv;
    push(`| 광고 단가 ${({ low: "낮음", mid: "중간", high: "높음" })[s]} | ${row.join(" | ")} | ${be === null ? "없음" : be === 0 ? "0%(무료도 남음)" : `**${pct(be)}**`} |`);
  }
  push("", `고정비를 메우는 데 필요한 가입자 수(전환율 ${pct(o.conv)}):`, "", "| 고정비 한 달 | 광고 단가 낮음 | 중간 | 높음 |", "|---|---|---|---|");
  const fixedList = o.fixed > 0 ? [o.fixed] : [30_000, 100_000, 300_000];
  for (const f of fixedList) {
    const cells = ["low", "mid", "high"].map((s) => {
      const per = perSignup(o, o.conv, s).net;
      return per <= 0 ? "못 메움(한 사람당 손해)" : `${Math.ceil(f / per).toLocaleString("ko-KR")}명`;
    });
    push(`| ${won(f)} | ${cells.join(" | ")} |`);
  }
  push("");

  // 5. 민감도
  push("## 5. 어떤 가정이 가장 크게 흔드나 (가입자 1,000명당, 지금 설정 기준)", "", "| 바꾼 것 | 1,000명당 손익 | 본전 전환율 |", "|---|---|---|");
  const variants = [
    ["지금 설정", {}],
    ["채팅 1통 원가 절반", { chatWon: o.chatWon / 2 }],
    ["채팅 1통 원가 두 배", { chatWon: o.chatWon * 2 }],
    ["광고 채움률 60%", { fill: 0.6 }],
    ["부가세 없음(비용 표 기준)", { vat: 0 }],
    ["보상형 켬(1회 = 채팅 3번, 하루 3번)", { ads: { ...o.ads, rewardChats: 3, rewardedDailyMax: 3 } }],
    ["전면 채팅 3번 뒤", { ads: { ...o.ads, interstitialAfterChats: 3 } }],
    ["네이티브 끔", { ads: { ...o.ads, nativeEnabled: false } }],
    ["배너 끔", { ads: { ...o.ads, bannerEnabled: false } }],
  ];
  for (const [name, change] of variants) {
    const r = perSignup({ ...o, ...change });
    push(`| ${name} | ${signed(r.net * 1000)} | ${r.breakEvenConv === null ? "없음" : r.breakEvenConv === 0 ? "0%" : pct(r.breakEvenConv)} |`);
  }
  push(
    "",
    "## 빠진 것·믿기 어려운 것",
    "",
    "- 행동 유형과 비율(`economics.json`)은 가정입니다. 서버의 사용자별 사용량(`scripts/cost-report.mjs`, KV 키 필요)으로 유형을 맞추면 가장 크게 좋아집니다.",
    "- 광고 단가·채움률은 AdMob 보고서가 쌓이기 전까지 가정입니다(`ads.ts` `AD_REVENUE_USD`).",
    "- 무료 첫 달의 처음 20포인트(통화 100분)는 한 번뿐이라 뺐습니다. 구매 포인트 수입, 환불, 무료 체험도 넣지 않았습니다.",
    "- 광고는 안드로이드만입니다. iOS 무료 사용자는 광고 수입 0으로 봐야 합니다(아직 iOS 사용자 없음).",
    "- 부가세 10%는 Play가 한국 부가세를 떼고 정산한다고 본 값으로, Play 정산 보고서로 확인이 필요합니다.",
    "",
  );
  return lines.join("\n");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const o = options(process.argv.slice(2));
  const text = render(o);
  if (o.write) {
    writeFileSync(join(root, "hub/economics.md"), text);
    console.log("hub/economics.md 갱신");
  } else {
    process.stdout.write(text);
  }
}
