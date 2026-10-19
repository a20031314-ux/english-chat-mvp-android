/**
 * 1차 세분화(tiers) 결과를 칸별 "보통 결과"로 모은다.
 *
 *   node scripts/sim-users/tiers-report.mjs tmp/sim-users/<실행>            → 표 출력 + <실행>/tiers-summary.json
 *   node scripts/sim-users/tiers-report.mjs <실행> --save                    → 기준으로 저장(scripts/sim-users/baselines/tiers.json)
 *   node scripts/sim-users/tiers-report.mjs <실행> --against baselines/...   → 기준과 달라진 칸만(다음 실행부터)
 *
 * 비율은 응답이 온 턴만 센다(Vercel 앞단이 막은 요청은 빼고).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { TIERS, TIER_LABELS } from "./suites/tiers.mjs";

const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith("--"));
const flag = (name) => args.includes(`--${name}`);
const value = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : null; };
if (!dir) throw new Error("실행 폴더를 주세요: node scripts/sim-users/tiers-report.mjs tmp/sim-users/<실행>");

const BASELINE = new URL("./baselines/tiers.json", import.meta.url).pathname;
const run = JSON.parse(readFileSync(join(dir, "results.json"), "utf8"));
const pct = (a, b) => (b ? Math.round((a / b) * 100) : null);
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : null; };
const p95 = (xs) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.min(s.length - 1, Math.floor(s.length * 0.95))] : null; };

const rows = Object.fromEntries(TIERS.map((t) => [t, { people: new Set(), combos: new Set(), turns: 0, answered: 0, ms: [], issues: {}, samples: {}, m: {} }]));
const bump = (row, key, yes) => { row.m[key] = row.m[key] ?? [0, 0]; row.m[key][1] += 1; if (yes) row.m[key][0] += 1; };

for (const record of run.records) {
  for (const step of record.transcript) {
    if (step.suite !== "tiers" || !step.tier || !rows[step.tier]) continue;
    const row = rows[step.tier];
    row.people.add(record.persona.id);
    row.combos.add(`${record.persona.target}:${record.persona.ui}`);
    if (step.kind === "start" || /임시 계정/.test(step.title ?? "")) continue;
    row.turns += 1;
    if (step.status === 200) { row.answered += 1; if (step.ms) row.ms.push(step.ms); }
    for (const i of step.issues ?? []) {
      const key = `${i.severity} ${i.kind}`;
      row.issues[key] = (row.issues[key] ?? 0) + 1;
      if (!row.samples[key]) row.samples[key] = `${record.persona.target}:${record.persona.ui} ${(i.sample ?? i.note ?? "").slice(0, 110)}`;
    }
    const m = step.measure ?? {};
    if (step.status !== 200) continue;
    const errors = (step.issues ?? []).filter((i) => i.severity === "error");
    if (step.tier !== "overlap") bump(row, "답이 학습 언어", !(step.issues ?? []).some((i) => i.kind === "reply_wrong_language"));
    if (step.tier === "ok") bump(row, "괜히 고침", m.changed);
    if (step.tier === "light") { bump(row, "짚음", m.changed); bump(row, `짚음·${m.tag}`, m.changed); }
    if (step.tier === "heavy") bump(row, "짚음", m.changed);
    if (step.tier === "mixed" && m.ownWord) bump(row, "섞은 낱말을 학습 언어로", m.replaced);
    if (step.tier === "own") bump(row, "표현 카드 학습 언어", m.cardOk);
    if (step.tier === "passive") { bump(row, "질문으로 이음", m.asks); bump(row, "되풀이", m.similar); row.lengths = [...(row.lengths ?? []), m.length]; }
    if (step.tier === "odd") bump(row, `넘어가지 않음·${m.odd}`, errors.length === 0);
    if (step.tier === "overlap") bump(row, "순서·중복·인용 정상", m.ok);
  }
}

const summary = {
  runId: run.meta.runId,
  seed: run.meta.seed,
  at: new Date().toISOString(),
  edgeBlocks: run.meta.edgeBlocks ?? 0,
  tiers: Object.fromEntries(
    TIERS.map((t) => {
      const r = rows[t];
      return [t, {
        label: TIER_LABELS[t],
        people: r.people.size,
        combos: r.combos.size,
        turns: r.turns,
        answered: pct(r.answered, r.turns),
        msMedian: median(r.ms),
        msP95: p95(r.ms),
        rates: Object.fromEntries(Object.entries(r.m).map(([k, [a, b]]) => [k, { pct: pct(a, b), of: b }])),
        ...(r.lengths ? { replyChars: median(r.lengths) } : {}),
        issues: r.issues,
        samples: r.samples,
      }];
    }),
  ),
};
writeFileSync(join(dir, "tiers-summary.json"), JSON.stringify(summary, null, 1));

const fmtRates = (rates) => Object.entries(rates).map(([k, v]) => `${k} ${v.pct}%(${v.of})`).join(" · ");
console.log(`문장 종류 8칸 — ${summary.runId} (씨앗 ${summary.seed}, 앞단 막힘 재시도 ${summary.edgeBlocks})`);
for (const [t, s] of Object.entries(summary.tiers)) {
  console.log(`\n■ ${s.label} — ${s.people}명 ${s.combos}조합 ${s.turns}턴, 응답 ${s.answered}% · ${s.msMedian ?? "-"}ms(p95 ${s.msP95 ?? "-"})${s.replyChars ? ` · 답 ${s.replyChars}자` : ""}`);
  console.log(`  ${fmtRates(s.rates)}`);
  const top = Object.entries(s.issues).sort((a, b) => b[1] - a[1]).slice(0, 4);
  for (const [k, n] of top) console.log(`  ${k} ×${n} — ${s.samples[k]}`);
}

// ── Claude 평가(judge-export.mjs → judge/*.verdicts.json, 두 번째 확인은 confirm.verdicts.json이 덮음) ──
const judgeDir = join(dir, "judge");
if (existsSync(judgeDir)) {
  const items = new Map();
  const verdicts = new Map();
  for (const name of readdirSync(judgeDir).sort()) {
    const path = join(judgeDir, name);
    if (/^batch-\d+\.json$/.test(name)) for (const it of JSON.parse(readFileSync(path, "utf8"))) items.set(it.id, it);
    if (/^batch-\d+\.verdicts\.json$/.test(name)) for (const v of JSON.parse(readFileSync(path, "utf8"))) verdicts.set(v.id, v);
  }
  const confirmPath = join(judgeDir, "confirm.verdicts.json");
  const confirmed = existsSync(confirmPath) ? JSON.parse(readFileSync(confirmPath, "utf8")) : [];
  for (const c of confirmed) if (verdicts.has(c.id)) verdicts.set(c.id, { ...verdicts.get(c.id), ...c, confirmed: true });
  const byTier = {};
  for (const [id, v] of verdicts) {
    const it = items.get(id);
    if (!it) continue;
    const t = (byTier[it.tier] ??= { n: 0, fix: {}, rates: {}, major: [], minor: 0 });
    t.n += 1;
    t.fix[v.fix] = (t.fix[v.fix] ?? 0) + 1;
    for (const key of ["explanationMatches", "explanationInUi", "replyFits", "cardOk"]) {
      if (typeof v[key] !== "boolean") continue;
      const r = (t.rates[key] ??= [0, 0]);
      r[1] += 1;
      if (v[key]) r[0] += 1;
    }
    if (v.severity === "major") t.major.push({ id, pair: `${it.target}:${it.ui}`, text: it.text, corrected: it.corrected, note: v.note, confirmed: Boolean(v.confirmed) });
    if (v.severity === "minor") t.minor += 1;
  }
  summary.judge = { judged: verdicts.size, of: items.size, confirmed: confirmed.length, tiers: byTier };
  writeFileSync(join(dir, "tiers-summary.json"), JSON.stringify(summary, null, 1));
  const NAMES = { explanationMatches: "설명이 고친 것과 맞음", explanationInUi: "설명이 앱 언어", replyFits: "답이 자연스럽게 이어짐", cardOk: "카드가 맞게 옮김" };
  console.log(`\n── Claude 평가 ${verdicts.size}/${items.size}줄 (두 번째 확인 ${confirmed.length}) ──`);
  for (const t of TIERS) {
    const j = byTier[t];
    if (!j) continue;
    const fix = Object.entries(j.fix).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${pct(n, j.n)}%`).join(" · ");
    const rates = Object.entries(j.rates).map(([k, [a, b]]) => `${NAMES[k]} ${pct(a, b)}%`).join(" · ");
    console.log(`■ ${TIER_LABELS[t]} (${j.n}줄) 고침: ${fix}\n  ${rates} · 큰 문제 ${j.major.length} · 작은 문제 ${j.minor}`);
    for (const m of j.major.slice(0, 4)) console.log(`  ! ${m.pair} ${m.text.slice(0, 50)} → ${String(m.corrected).slice(0, 50)} — ${m.note}`);
  }
}

if (flag("save")) {
  mkdirSync(dirname(BASELINE), { recursive: true });
  writeFileSync(BASELINE, JSON.stringify(summary, null, 1));
  console.log(`\n기준 저장: ${BASELINE}`);
}

const against = value("against") ?? (flag("compare") && existsSync(BASELINE) ? BASELINE : null);
if (against) {
  const base = JSON.parse(readFileSync(against, "utf8"));
  console.log(`\n기준(${base.runId})과 달라진 칸 — 비율 10%p 이상, 중앙 속도 50% 이상`);
  let any = false;
  for (const [t, s] of Object.entries(summary.tiers)) {
    const b = base.tiers[t];
    if (!b) continue;
    for (const [k, v] of Object.entries(s.rates)) {
      const old = b.rates[k]?.pct;
      if (old != null && v.pct != null && Math.abs(v.pct - old) >= 10 && v.of >= 5) { any = true; console.log(`  ${s.label} · ${k}: ${old}% → ${v.pct}%`); }
    }
    if (b.msMedian && s.msMedian && s.msMedian > b.msMedian * 1.5) { any = true; console.log(`  ${s.label} · 속도: ${b.msMedian}ms → ${s.msMedian}ms`); }
  }
  if (!any) console.log("  없음");
}
