/**
 * 학습 언어마다 배울 수 있는 분량 표(2026-10-31 사용자 "여기서 이 정도 분량의 학습이 가능하다 — 학습 유인, 마케팅에도").
 * 화면(My n단계 칸 📖 아이콘)과 같은 셈(src/lib/curriculum/contentScope.ts). 낱말 = 빈도 목록 + 운영에서 사용자들이 찾아 더한 낱말 수.
 * 은행이 늘면 숫자도 늘므로 홍보·스토어 문구를 쓰기 전에 다시 돌린다.
 *
 * Run: node --experimental-strip-types scripts/content-scope.ts [--offline]   → hub/CONTENT.md
 */
import fs from "node:fs";
import { contentScope } from "../src/lib/curriculum/contentScope.ts";
import { loadBank, wordStage } from "../src/lib/curriculum/vocabBank.ts";
import { ladderFor } from "../src/lib/curriculum/stages/index.ts";
import { INTERFACE_LANGUAGE_LABELS } from "../src/lib/learningLanguages.ts";

const API = "https://english-chat-mvp.vercel.app";
const LANGS = ["en", "es", "ja", "ko", "zh", "fr", "it", "pt", "ru", "id", "vi", "th", "ar", "hi"];
const offline = process.argv.includes("--offline");

async function extraCount(language: string): Promise<number | null> {
  if (offline) return null;
  const body = await fetch(`${API}/api/curriculum/words?lang=${language}&extra=1`, { headers: { "x-rc-user": "simcheck-content-scope" } })
    .then((response) => (response.ok ? (response.json() as Promise<{ total?: number }>) : null))
    .catch(() => null);
  return typeof body?.total === "number" ? body.total : null;
}

const n = (value: number) => value.toLocaleString("en-US");
const rows: string[] = [];
const detail: string[] = [];
for (const language of LANGS) {
  const bank = await loadBank(language);
  const byStage: Record<number, number> = {};
  bank.forEach((word, index) => {
    const stage = wordStage(language, word, index);
    byStage[stage] = (byStage[stage] ?? 0) + 1;
  });
  const extra = await extraCount(language);
  if (extra) byStage[6] = (byStage[6] ?? 0) + extra;
  const scope = contentScope(language, byStage);
  const t = scope.total;
  const name = INTERFACE_LANGUAGE_LABELS[language] ?? language;
  rows.push(`| ${name} (${language}) | ${n(t.words)}${extra ? ` (+${n(extra)} 찾아서 더함)` : ""} | ${t.grammar} | ${t.expressions} | ${t.frames} | ${t.scenes} |`);
  const ladder = ladderFor(language)?.stages ?? [];
  detail.push(`### ${name} (${language})`, "", "| 단계 | 문법 범위 | 낱말 | 표현 | 문장구조 | 상황 |", "|---|---|---|---|---|---|");
  for (const row of scope.stages) {
    const grammar = ladder.find((one) => Number(one.id.split("-").pop()) === row.stage)?.grammar.map((one) => one.name.ko ?? one.name.en).join(" · ") ?? "";
    detail.push(`| ${row.stage} | ${grammar} | ${n(row.words)} | ${row.expressions} | ${row.frames} | ${row.scenes} |`);
  }
  detail.push("");
}

const out = `# 배울 수 있는 분량 (자동)

> \`node --experimental-strip-types scripts/content-scope.ts\`가 만든다 — 손으로 고치지 않는다. 앱 My n단계 칸 📖 "배울 수 있는 것"과 같은 셈(\`curriculum/contentScope.ts\`).
> 홍보 영상·스토어 문구에 숫자를 쓸 때 여기서 가져오고, 쓰기 직전에 다시 돌린다(낱말은 사용자들이 찾아서 더할 때마다 는다). 만든 날: ${new Date().toISOString().slice(0, 10)}.
> 낱말 = 빈도 목록(FrequencyWords CC BY-SA 4.0 정리, 원어민 확인 전) + 운영에서 더한 낱말. 4·5단계 문장구조는 아직 없음. 단계 이름·레벨(A1 등)은 화면에 쓰지 않는다(STATE).

| 학습 언어 | 낱말 | 문법 칸 | 핵심 표현 | 문장구조 | 상황(대본 + 은행 장면) |
|---|---|---|---|---|---|
${rows.join("\n")}

## 단계마다

${detail.join("\n")}`;
fs.writeFileSync("hub/CONTENT.md", out);
console.log(`hub/CONTENT.md — ${LANGS.length} languages`);
