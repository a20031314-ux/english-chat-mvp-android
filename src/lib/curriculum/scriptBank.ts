/**
 * 대본 은행에서 오늘의 장면 하나(2026-10-30 사용자 "여러 개 만들어 두고 추천" → A: 3단계면 1~3단계 범위에서).
 *
 * 모델을 부르지 않는다. 고르는 순서:
 * 1) 아직 안 한(통과 안 한) 장면 — 지금 단계에 가까울수록 먼저(한 단계 아래마다 1점 덜).
 * 2) 익힌 틀(통과한 틀 id)이 내 줄에 든 장면 — 익힌 틀을 장면에서 바로 꺼내 쓰게(장면마다 3까지).
 * 3) 아직 안 익힌 지금 단계 틀이 든 장면은 덜 — 수업에서 배운 뒤에 나오게.
 * 4) 다 했으면 가장 오래전에 한 것(없으면 처음 것)부터 다시.
 * 같은 날 같은 사용자에게는 같은 장면(seed) — 오늘 할 것 목록이 하루 동안 바뀌지 않게.
 */
import { framesOfScript } from "./frames.ts";
import { bankScriptsUpTo, type StageScript } from "./stageScripts.ts";

export type BankInput = {
  language: string;
  stage: number;
  /** 통과한 대본·틀 id. */
  passed: ReadonlySet<string>;
  /** 오늘(그날 같은 장면). */
  seed?: string;
};

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function scoreBankScript(script: StageScript, input: BankInput): number {
  const frames = framesOfScript(script);
  const learned = frames.filter((id) => input.passed.has(id)).length;
  const unlearnedHere = script.stage === input.stage ? frames.length - learned : 0;
  let score = input.passed.has(script.id) ? -10 : 5;
  score -= Math.max(0, input.stage - script.stage);
  score += Math.min(3, learned);
  score -= unlearnedHere * 0.5;
  return score;
}

/** 오늘의 은행 장면(없으면 null — 은행이 없는 학습 언어). */
export function pickBankScript(input: BankInput): StageScript | null {
  const pool = bankScriptsUpTo(input.language, input.stage);
  if (!pool.length) return null;
  const seed = input.seed ?? "";
  let best: { script: StageScript; score: number; tie: number } | null = null;
  for (const script of pool) {
    const scored = { script, score: scoreBankScript(script, input), tie: hash(`${seed}|${script.id}`) };
    if (!best || scored.score > best.score || (scored.score === best.score && scored.tie > best.tie)) best = scored;
  }
  return best?.script ?? null;
}

/** 이 장면에서 쓰는 틀이 학습자 말에 실제로 들었는지(위쪽 틀 칩의 불) — 빈칸 앞뒤 고정 부분이 모두 들었으면. */
export function frameUsed(pattern: string, heard: string): boolean {
  const clean = pattern.replace(/…/g, " ");
  // 틀 전체가 둘 이상("Привет, ___! / Здравствуйте, ___!")이면 그중 하나.
  const whole = clean.split(/\s+\/\s+/);
  if (whole.length > 1 && whole.every((one) => one.includes("___"))) return whole.some((one) => frameUsed(one, heard));
  const norm = (text: string) => text.toLowerCase().replace(/[’']/g, "'").replace(/[^\p{L}\p{M}\p{N}' ]+/gu, " ").replace(/\s+/g, " ").trim();
  const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const said = norm(heard);
  // 띄어쓰기 없는 글자(일본어·중국어·태국어)는 문장 안 어디든.
  const spaceless = (text: string) => /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Thai}]/u.test(text);
  const raw = clean.split("___");
  const parts = raw.map((piece, i) => {
    // 고를 수 있는 꼴: "이에요/예요"·"мой / моя" → 그중 하나, "아서/어서"처럼 끝이 같으면 줄어든 꼴("더워서")도 그 끝으로. "(으)" → 있어도 없어도.
    const units: string[] = [];
    const re = /([^\s/()]+(?:\s*\/\s*[^\s/()]+)+)|\(([^)]+)\)|(\s+)|([^\s/()]+)/gu;
    for (const m of piece.matchAll(re)) {
      if (m[1]) {
        const alts = m[1].split(/\s*\/\s*/).map(norm).filter(Boolean);
        let tail = alts[0] ?? "";
        for (const alt of alts) while (tail && !alt.endsWith(tail)) tail = tail.slice(1);
        const options = [...alts, ...(tail && /\p{Script=Hangul}/u.test(tail) && !alts.includes(tail) ? [tail] : [])];
        // 한국어 조사(은/는·이/가·을/를)는 말할 때 빠지거나 "도"로 바뀐다("이거 뭐예요?", "중국어도 할 수 있어요").
        const particle = alts.every((alt) => ["은", "는", "이", "가", "을", "를"].includes(alt));
        units.push(particle ? `(?:${[...options, "도"].map(escape).join("|")})?` : `(?:${options.map(escape).join("|")})`);
      } else if (m[2]) units.push(`(?:${escape(norm(m[2]))})?`);
      else if (m[3]) units.push(" ");
      else if (m[4]) {
        const text = norm(m[4]);
        // 문장부호만인 조각("!", ",")은 띄어 쓴 것과 같다.
        units.push(text ? escape(text) : " ");
      }
    }
    let body = units.join("").replace(/ +/g, " ").trim();
    const flat = spaceless(piece);
    if (flat) body = body.replace(/ \??/g, "");
    if (!body) return null;
    // 빈칸에 바로 붙은 쪽(한국어 "___은", 일본어 "___を")은 낱말 경계를 따지지 않는다.
    const left = !flat && (i === 0 || /^\s/.test(piece)) ? "(?:^| )" : "";
    const right = !flat && (i === raw.length - 1 || /\s$/.test(piece)) ? "(?: |$)" : "";
    return { body: `${left}${body}${right}`, flat };
  });
  const real = parts.filter((one): one is { body: string; flat: boolean } => Boolean(one));
  return real.length > 0 && real.every(({ body, flat }) => new RegExp(body, "u").test(flat ? said.replace(/\s+/g, "") : said));
}
