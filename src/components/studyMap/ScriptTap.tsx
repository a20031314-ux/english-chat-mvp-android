"use client";

import { useMemo, useState } from "react";
import type { UICopy } from "@/lib/copy";
import { joinWords, orderCorrect, orderOf, orderTiles } from "@/lib/curriculum/quiz";
import { choiceForLine, type ChoiceOption, type ScriptChoices } from "@/lib/curriculum/scriptChoice";
import type { StageScript } from "@/lib/curriculum/stageScripts";

/**
 * 대본 내 줄을 마이크 없이(2026-10-29 사용자 "녹음>평가 외에 객관식 같은 방식"):
 * - 고르기: 그 줄의 빈칸(핵심 표현·문장구조 조각)을 넷 중에서 — 오답은 문법으로·어휘로 헷갈리는 것(curriculum/scriptChoice.ts, 서버가 대본마다 한 번 만든 것 → 없으면 기기 규칙).
 *   답한 뒤 오답마다 "문법"·"어휘" 꼬리표.
 * - 맞추기: 그 줄을 낱말 조각으로 섞어 차례대로(curriculum/quiz.ts orderOf — 띄어쓰기 없는 언어는 낱말 단위).
 * 줄로 문제를 못 만들면(짧은 줄 등) 다른 쪽으로, 둘 다 안 되면 null → 부르는 쪽이 🎤로.
 */

function seeded(seed: string): () => number {
  let a = 0;
  for (let i = 0; i < seed.length; i += 1) a = (Math.imul(a ^ seed.charCodeAt(i), 2654435761) + 1) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type TapKind = "choose" | "order";

/** 이 줄에서 고르기·맞추기를 낼 수 있는지(낼 수 있는 쪽 — 원하는 쪽이 안 되면 다른 쪽). */
export function tapKindFor(language: string, script: StageScript, index: number, want: TapKind, server: ScriptChoices | null): TapKind | null {
  const line = script.lines[index];
  if (!line) return null;
  const canChoose = Boolean(choiceForLine(language, script, index, server));
  // orderOf와 같은 기준(조각 3~10개) — 섞기 결과로 판단하면 섞어도 그대로인 경우를 "못 냄"으로 잘못 봄.
  const tiles = orderTiles(line.text, language);
  const canOrder = tiles.length >= 3 && tiles.length <= 10 && new Set(tiles).size > 1;
  if (want === "choose") return canChoose ? "choose" : canOrder ? "order" : null;
  return canOrder ? "order" : canChoose ? "choose" : null;
}

export function ScriptTap({
  ui,
  language,
  script,
  index,
  kind,
  server,
  attempt,
  onAnswer,
}: {
  ui: UICopy;
  language: string;
  script: StageScript;
  index: number;
  kind: TapKind;
  server: ScriptChoices | null;
  /** 다시 할 때마다 늘어 보기 차례가 바뀐다. */
  attempt: number;
  onAnswer: (correct: boolean) => void;
}) {
  const line = script.lines[index]!;
  const seed = `${script.id}:${index}:${attempt}`;
  const choice = useMemo(() => (kind === "choose" ? choiceForLine(language, script, index, server) : null), [kind, language, script, index, server]);
  const options = useMemo(() => {
    if (!choice) return [] as (ChoiceOption | { text: string; type: "answer" })[];
    const random = seeded(seed);
    const all: (ChoiceOption | { text: string; type: "answer" })[] = [{ text: choice.blank, type: "answer" }, ...choice.wrong];
    for (let i = all.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [all[i], all[j]] = [all[j]!, all[i]!];
    }
    return all;
  }, [choice, seed]);
  const order = useMemo(() => {
    const question = kind === "order" ? orderOf(language, { text: line.text, gloss: line.gloss, from: script.id, stage: script.stage }, seeded(seed)) : null;
    return question && question.kind === "order" ? question : null;
  },
  [kind, language, line.text, line.gloss, script.id, script.stage, seed]);
  const [picked, setPicked] = useState<number | null>(null);
  const [placed, setPlaced] = useState<number[]>([]);

  if (choice) {
    const at = line.text.indexOf(choice.blank);
    const answered = picked !== null;
    return (
      <div data-tap="choose" className="mt-1 flex flex-col gap-2">
        <p dir="auto" className="text-chat text-slate-100">
          {line.text.slice(0, at)}
          <strong className={`font-semibold ${answered ? "text-status-learned" : "text-amber-200"}`}>{answered ? choice.blank : "＿＿＿"}</strong>
          {line.text.slice(at + choice.blank.length)}
        </p>
        <div className="flex flex-col gap-1.5">
          {options.map((option, i) => {
            const right = option.type === "answer";
            const style = !answered
              ? "border-line text-slate-100 hover:bg-white/5"
              : right
                ? "border-good bg-good/10 text-ink"
                : picked === i
                  ? "border-warn text-warn"
                  : "border-line text-slate-500";
            return (
              <button
                key={`${option.text}-${i}`}
                type="button"
                disabled={answered}
                onClick={() => {
                  setPicked(i);
                  onAnswer(right);
                }}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-start ${style}`}
              >
                <span dir="auto" className={`min-w-0 flex-1 text-chat ${answered && !right && picked === i ? "line-through" : ""}`}>
                  {option.text}
                </span>
                {answered && !right ? (
                  <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-meta text-slate-400">
                    {option.type === "grammar" ? ui.choiceGrammar : ui.choiceVocab}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (order) {
    const left = order.tiles.filter((tile) => !placed.includes(tile));
    const full = placed.length === order.words.length;
    return (
      <div data-tap="order" className="mt-1 flex flex-col gap-2">
        <div dir="auto" className="flex min-h-11 flex-wrap gap-1.5 rounded-xl border border-dashed border-line px-2 py-2">
          {placed.map((tile, i) => (
            <button key={`${tile}-${i}`} type="button" onClick={() => setPlaced((current) => current.filter((_, k) => k !== i))} className="rounded-lg bg-white/10 px-2 py-1 text-chat text-ink">
              {order.words[tile]}
            </button>
          ))}
        </div>
        <div dir="auto" className="flex flex-wrap gap-1.5">
          {left.map((tile) => (
            <button key={tile} type="button" onClick={() => setPlaced((current) => [...current, tile])} className="rounded-lg border border-line px-2 py-1 text-chat text-slate-100 hover:bg-white/10">
              {order.words[tile]}
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={!full}
          onClick={() =>
            onAnswer(
              orderCorrect(order.words, placed) ||
                joinWords(placed.map((tile) => order.words[tile]!), order.spaced) === joinWords(order.words, order.spaced),
            )
          }
          className="self-end rounded-full bg-white/90 px-4 py-1.5 text-caption font-semibold text-slate-900 disabled:opacity-50"
        >
          {ui.quizCheck}
        </button>
      </div>
    );
  }
  return null;
}
