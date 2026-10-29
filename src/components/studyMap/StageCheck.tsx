"use client";

/**
 * 대화 예시로 시작 단계 고르기, 지도 위 "목표 대화"(2026-10-22, hub/drafts/map-premium-2026-10-22.md).
 * 레벨 이름·숫자는 보이지 않는다 — 대화와 "할 수 있게 되는 것"만.
 * 단계 데이터: /api/curriculum/stages (영어·일본어·한국어. 다른 학습 언어는 null이라 이 화면이 안 나옴).
 */
import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/apiBase";
import { entitlementHeaders } from "@/lib/billing/billingService";
import type { UICopy } from "@/lib/copy";
import { TTSButton } from "@/components/TTSButton";
import { ScriptEntry } from "@/components/studyMap/ScriptPractice";

export type StageLineView = { who: "A" | "B"; text: string; gloss: string };
export type StageDialogueView = { setting: string; lines: StageLineView[] };
export type StageGrammarView = { name: string; example: string; constructionId?: string };
export type StageView = { id: string; order: number; title: string; canDo: string[]; grammar?: StageGrammarView[]; dialogues: StageDialogueView[] };
export type StageCurrent = {
  stageId: string;
  mastered: number;
  learned: number;
  total: number;
  share: number;
  done: boolean;
  /** 영어만: 채팅 문장으로 숙지한 문법(구문 id). */
  grammarMastered?: string[];
};

/** 단계 목록과 내 진행. 범위가 없는 언어는 stages null. */
export function useStages(targetLanguage: string, locale: string, isPremium: boolean, refresh: string | number = 0) {
  const [data, setData] = useState<{ stages: StageView[] | null; current: StageCurrent | null } | null>(null);
  useEffect(() => {
    let cancelled = false;
    void fetch(apiUrl(`/api/curriculum/stages?lang=${encodeURIComponent(targetLanguage)}&ui=${encodeURIComponent(locale)}`), {
      headers: entitlementHeaders(isPremium),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: { stages?: StageView[] | null; current?: StageCurrent | null } | null) => {
        if (!cancelled) setData({ stages: body?.stages ?? null, current: body?.current ?? null });
      })
      .catch(() => {
        if (!cancelled) setData({ stages: null, current: null });
      });
    return () => {
      cancelled = true;
    };
  }, [targetLanguage, locale, isPremium, refresh]);
  return data;
}

export function DialogueCard({ dialogue }: { dialogue: StageDialogueView }) {
  return (
    <div className="rounded-xl border border-line bg-white/5 px-3 py-3">
      {dialogue.setting ? <p className="text-caption text-slate-400">{dialogue.setting}</p> : null}
      <ol className="mt-2 flex flex-col gap-2">
        {dialogue.lines.map((line, index) => (
          <li key={index} className={`flex flex-col ${line.who === "B" ? "items-end text-end" : "items-start text-start"}`}>
            <span dir="auto" className={`max-w-[88%] rounded-xl px-3 py-1.5 text-chat leading-snug text-ink ${line.who === "B" ? "bg-white/15" : "bg-white/10"}`}>
              {line.text}
            </span>
            {line.gloss ? <span className="mt-0.5 max-w-[88%] text-caption leading-snug text-slate-400">{line.gloss}</span> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * 쉬운 단계부터 대화 한 토막씩: "할 수 있어요"면 다음 단계, "비슷해요"·"아직 어려워요"면 그 단계에서 시작.
 * 마지막 단계도 할 수 있으면 마지막 단계.
 */
export function StagePicker({
  ui,
  stages,
  chosen,
  onChoose,
  disabled,
  script,
}: {
  ui: UICopy;
  stages: StageView[];
  chosen: string | null;
  onChoose: (stageId: string | null) => void;
  disabled?: boolean;
  /** 첫 단계에서 시작하면 "글자·소리부터"를 같이 보인다. */
  script?: { targetLanguage: string; locale: string; isPremium: boolean };
}) {
  const [index, setIndex] = useState(0);
  const picked = stages.find((stage) => stage.id === chosen) ?? null;

  if (picked) {
    return (
      <section className="flex flex-col gap-2">
        <h3 className="text-chat font-semibold text-slate-100">{ui.stageStartTitle}</h3>
        <p className="text-note text-slate-200">{picked.title}</p>
        <DialogueCard dialogue={picked.dialogues[1] ?? picked.dialogues[0]!} />
        {picked.order === 1 && script ? <ScriptEntry ui={ui} {...script} /> : null}
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            setIndex(0);
            onChoose(null);
          }}
          className="self-start text-caption text-slate-400 underline-offset-4 hover:underline"
        >
          {ui.stageRechoose}
        </button>
      </section>
    );
  }

  const stage = stages[Math.min(index, stages.length - 1)]!;
  const answer = (can: boolean) => {
    if (can && index < stages.length - 1) setIndex(index + 1);
    else onChoose(stage.id);
  };
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-chat font-semibold text-slate-100">{ui.stageCheckTitle}</h3>
      <DialogueCard dialogue={stage.dialogues[0]!} />
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={disabled} onClick={() => answer(true)} className="rounded-lg bg-white/15 px-3 py-1.5 text-note text-ink hover:bg-white/20">
          {ui.stageCan}
        </button>
        <button type="button" disabled={disabled} onClick={() => answer(false)} className="rounded-lg border border-line px-3 py-1.5 text-note text-slate-200 hover:bg-white/5">
          {ui.stageAlmost}
        </button>
        <button type="button" disabled={disabled} onClick={() => answer(false)} className="rounded-lg border border-line px-3 py-1.5 text-note text-slate-200 hover:bg-white/5">
          {ui.stageHard}
        </button>
      </div>
      {/* 숫자 쪽수는 아랍어 화면에서도 1 / 5 순서로(뒤집혀 5 / 1로 보였음). */}
      <p dir="ltr" className="self-start text-meta text-slate-500 rtl:self-end">
        {index + 1} / {stages.length}
      </p>
    </section>
  );
}

/**
 * My "단계" 보기: 이 단계에선 이런 대화가 된다 — 대화 예시 몇 개(사용자 2026-10-25 "상황은 이 단계에선 이 정도 대화가 가능하다 정도의 예시").
 * 단계는 말하는 힘(어휘·문법·표현·발음), 상황은 그 힘으로 되는 대화의 예. 예시마다 "써 보기" = 그 장면으로 채팅. 할 수 있게 되는 것은 접어 둔다.
 */
export function StageExamples({ ui, stage }: { ui: UICopy; stage: StageView }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="mt-3 flex flex-col gap-2">
      <h3 className="text-caption font-semibold text-slate-400">{ui.stageExamplesTitle}</h3>
      {stage.dialogues.map((dialogue, index) => (
        <div key={index} className="flex flex-col gap-1.5">
          <DialogueCard dialogue={dialogue} />
        </div>
      ))}
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="self-start text-caption text-slate-400 underline-offset-4 hover:underline">
        {ui.stageCanDo}
      </button>
      {open ? (
        <ul className="flex flex-col gap-1 ps-4 text-note text-slate-200">
          {stage.canDo.map((line, index) => (
            <li key={index} className="list-disc">
              {line}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

/** 지도 위: 이 단계를 마치면 할 수 있는 대화 + 표현 숙지 막대. 다 오면 다음 단계로 새 지도. */
export function StageGoal({
  ui,
  stage,
  current,
  onNext,
  script,
  bare = false,
}: {
  ui: UICopy;
  stage: StageView;
  current: StageCurrent | null;
  onNext?: () => void;
  script?: { targetLanguage: string; locale: string; isPremium: boolean };
  /** My "단계" 보기 안(NotebookSection 틀): 제목·문법 목록은 틀이 그리니 목표 대화·할 수 있는 것·진행만. */
  bare?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const share = current ? Math.max(0, Math.min(1, current.share)) : 0;
  return (
    <section className={bare ? "mt-2 flex flex-col gap-2" : "mt-3 flex flex-col gap-2 rounded-2xl border border-line px-3 py-3"}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-caption font-semibold text-slate-400">{ui.stageGoalTitle}</h3>
        {current ? (
          <span className="text-meta text-slate-400">
            {ui.stageProgress.replace("{n}", String(current.mastered)).replace("{total}", String(current.total))}
          </span>
        ) : null}
      </div>
      {bare ? null : <p className="text-note text-slate-200">{stage.title}</p>}
      {current ? (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10" aria-hidden>
          <div className="h-full rounded-full bg-white/60" style={{ width: `${Math.round(share * 100)}%` }} />
        </div>
      ) : null}
      <DialogueCard dialogue={stage.dialogues[1] ?? stage.dialogues[0]!} />
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="self-start text-caption text-slate-400 underline-offset-4 hover:underline">
        {ui.stageCanDo}
      </button>
      {open ? (
        <ul className="flex flex-col gap-1 ps-4 text-note text-slate-200">
          {stage.canDo.map((line, index) => (
            <li key={index} className="list-disc">
              {line}
            </li>
          ))}
        </ul>
      ) : null}
      {stage.grammar?.length && !bare ? (
        <div className="flex flex-col gap-1.5">
          <h4 className="text-caption font-semibold text-slate-400">{ui.stageGrammarTitle}</h4>
          <ul className="flex flex-col gap-1.5">
            {stage.grammar.map((grammar, index) => {
              const done = Boolean(grammar.constructionId && current?.grammarMastered?.includes(grammar.constructionId));
              return (
                <li key={index} className="rounded-xl border border-line px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-note text-slate-100">
                      {done ? <span className="me-1 text-good">✓</span> : null}
                      {grammar.name}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    <span dir="auto" className="min-w-0 flex-1 text-note text-slate-300">{grammar.example}</span>
                    <TTSButton text={grammar.example} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
      {script ? <ScriptEntry ui={ui} {...script} /> : null}
      {current?.done && onNext ? (
        <button type="button" onClick={onNext} className="rounded-lg bg-white/15 px-3 py-2 text-note text-ink hover:bg-white/20">
          {ui.stageNext}
        </button>
      ) : null}
    </section>
  );
}
