"use client";

/**
 * My 큰 칸(Stagebank · Quizbank · Logbank) 머리의 "?"(2026-10-31 사용자 "BANK류에 ? 버튼으로 설명 — 뭘 학습 가능하고, 어떻게 학습하는지,
 * 스크린샷이나 가능하면 학습 영상까지"). 시트: 칸마다 정한 순서의 조각(blocks) — 맨 위 핵심 기능(큰 글 + 영상·그림), 그 아래 세부 기능(한 줄 + 작은 그림, 누르면 크게).
 * 제목("배울 수 있는 것"·"이렇게 공부해요")·번호 없이(2026-11-02 사용자 "구조를 정해 두지 말고 탭별로 핵심 > 세부, 직관적으로"). 옛 서버(blocks 없음)면 예전 모양.
 * 글·그림 이름은 서버(/api/guide banks=1, lib/guide/banks.ts), 그림·영상은 /guide/<앱 언어>/ — 그 언어 것이 없으면 영어 것.
 */
import { useEffect, useState } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import { NativeAdSlot } from "@/components/NativeAdSlot";
import { apiUrl } from "@/lib/apiBase";
import type { UICopy } from "@/lib/copy";
import { contentScope } from "@/lib/curriculum/contentScope";
import { wordsByStage } from "@/lib/curriculum/useWordBank";
import type { BankBlock, BankGuide, BankId } from "@/lib/guide/banks";
import { fillGuideLabels, loadGuide, readCachedGuide } from "@/lib/guide/client";

function Media({ locale, name, kind, className = "w-full rounded-xl border border-line" }: { locale: string; name: string; kind: "webp" | "mp4"; className?: string }) {
  const [source, setSource] = useState<"own" | "en" | "none">(locale === "en" ? "en" : "own");
  if (source === "none") return null;
  const src = apiUrl(`/guide/${source === "own" ? locale : "en"}/${name}.${kind}`);
  const next = () => setSource(source === "own" ? "en" : "none");
  const style = className;
  if (kind === "mp4") return <video key={src} src={src} autoPlay muted loop playsInline preload="metadata" onError={next} className={style} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" loading="lazy" onError={next} className={style} />;
}

export function BankHelpButton({ ui, locale, language, bank, title }: { ui: UICopy; locale: string; language: string; bank: BankId; title: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        data-bank-help={bank}
        aria-label={`${title} · ${ui.guideOpen}`}
        title={ui.guideOpen}
        onClick={(event) => {
          event.stopPropagation();
          setOpen(true);
        }}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-caption text-slate-400 hover:bg-white/10 hover:text-ink"
      >
        ?
      </button>
      {open ? <BankHelpSheet ui={ui} locale={locale} language={language} bank={bank} title={title} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function BankHelpSheet({ ui, locale, language, bank, title, onClose }: { ui: UICopy; locale: string; language: string; bank: BankId; title: string; onClose: () => void }) {
  const [guide, setGuide] = useState<BankGuide | null>(() => readCachedGuide(locale)?.banks?.[bank] ?? null);
  const [words, setWords] = useState<Record<number, number> | null>(null);
  useEffect(() => {
    let alive = true;
    void loadGuide(locale).then((data) => alive && data?.banks?.[bank] && setGuide(data.banks[bank]));
    if (bank === "stage" || bank === "keep") void wordsByStage(language).then((counts) => alive && setWords(counts));
    return () => {
      alive = false;
    };
  }, [locale, bank, language]);
  const scope = contentScope(language, words);
  // 배울 수 있는 것의 실제 분량(그 학습 언어): Stagebank = 문장구조·상황·문법, Quizbank = 낱말·표현.
  const numbers = (
    bank === "stage"
      ? [
          { label: ui.amountFrames, value: scope.total.frames },
          { label: ui.stageScriptsTitle, value: scope.total.scenes },
          { label: ui.partGrammar, value: scope.total.grammar },
        ]
      : bank === "keep"
        ? [
            { label: ui.partVocab, value: scope.total.words },
            { label: ui.partExpression, value: scope.total.expressions },
          ]
        : []
  ).filter((one) => one.value > 0);
  return (
    <BodyLayer>
      <div className="fixed inset-0 z-[95] flex items-end justify-center bg-black/60 sm:items-center" onClick={onClose}>
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          data-bank-help-sheet={bank}
          onClick={(event) => event.stopPropagation()}
          className="flex max-h-[90vh] w-full max-w-md flex-col gap-3 overflow-y-auto rounded-t-2xl border border-line bg-surface p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:rounded-2xl"
        >
          <div className="flex items-center gap-2">
            <h3 className="min-w-0 flex-1 text-title font-semibold text-ink">{title}</h3>
            <button type="button" aria-label={ui.billingClose} onClick={onClose} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
              ✕
            </button>
          </div>
          {guide?.blocks?.length ? (
            <BlockList locale={locale} ui={ui} blocks={guide.blocks} numbers={numbers} />
          ) : (
          <>
          <section className="flex flex-col gap-2">
            <h4 className="text-caption font-semibold text-slate-400">{ui.scopeTitle}</h4>
            {numbers.length ? (
              <ul data-bank-numbers className="grid grid-cols-3 gap-2">
                {numbers.map((one) => (
                  <li key={one.label} className="flex flex-col items-center rounded-xl border border-line px-2 py-2">
                    <span className="text-heading font-semibold text-ink">{one.value.toLocaleString(locale)}</span>
                    <span className="text-meta text-slate-400">{one.label}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <ul className="flex flex-col gap-1">
              {(guide?.can ?? []).map((line) => (
                <li key={line} dir="auto" className="text-note text-slate-200">
                  · {fillGuideLabels(line, ui)}
                </li>
              ))}
            </ul>
          </section>
          {guide?.clip ? <Media locale={locale} name={guide.clip} kind="mp4" /> : null}
          {guide?.how.length ? (
            <section className="flex flex-col gap-2">
              <h4 className="text-caption font-semibold text-slate-400">{ui.bankHowTitle}</h4>
              <ol className="flex flex-col gap-3">
                {guide.how.map((step, i) => (
                  <li key={step.text} data-bank-step className="flex flex-col gap-1.5">
                    <p dir="auto" className="text-note font-medium text-ink">{`${i + 1}. ${fillGuideLabels(step.text, ui)}`}</p>
                    <Media locale={locale} name={step.shot} kind="webp" />
                  </li>
                ))}
              </ol>
            </section>
          ) : guide ? null : (
            <p className="text-note text-slate-500">…</p>
          )}
          </>
          )}
          {/* 시트 맨 끝(그림·영상 아래) 네이티브 하나(2026-11-01 — 읽는 안내 시트, 시트가 맨 위 층일 때만). */}
          <NativeAdSlot feedId="sheets" slotKey={`bank-help-${bank}`} spaced />
        </div>
      </div>
    </BodyLayer>
  );
}

type Numbers = { label: string; value: number }[];

function NumberRow({ locale, numbers }: { locale: string; numbers: Numbers }) {
  if (!numbers.length) return null;
  return (
    <ul data-bank-numbers className="grid grid-cols-3 gap-2">
      {numbers.map((one) => (
        <li key={one.label} className="flex flex-col items-center rounded-xl border border-line px-2 py-2">
          <span className="text-heading font-semibold text-ink">{one.value.toLocaleString(locale)}</span>
          <span className="text-meta text-slate-400">{one.label}</span>
        </li>
      ))}
    </ul>
  );
}

/** 핵심(lead) 하나는 크게 — 글 + 영상(없으면 그림) + 분량, 나머지 세부는 한 줄 + 오른쪽 작은 그림(누르면 크게). */
function BlockList({ locale, ui, blocks, numbers }: { locale: string; ui: UICopy; blocks: BankBlock[]; numbers: Numbers }) {
  const [big, setBig] = useState<string | null>(null);
  return (
    <div data-bank-blocks className="flex flex-col gap-2">
      {blocks.map((block) =>
        block.lead ? (
          <section key={block.text} data-bank-lead className="flex flex-col gap-2 rounded-2xl border border-line bg-white/[0.03] p-3">
            <p dir="auto" className="text-body font-semibold text-ink">{fillGuideLabels(block.text, ui)}</p>
            {block.clip ? <Media locale={locale} name={block.clip} kind="mp4" /> : block.shot ? <Media locale={locale} name={block.shot} kind="webp" /> : null}
            {block.numbers ? <NumberRow locale={locale} numbers={numbers} /> : null}
          </section>
        ) : (
          <section key={block.text} data-bank-detail className="flex flex-col gap-2 rounded-xl border border-line px-3 py-2">
            <div className="flex items-center gap-3">
              <p dir="auto" className="min-w-0 flex-1 text-note text-slate-200">{fillGuideLabels(block.text, ui)}</p>
              {block.shot && big !== block.text ? (
                <button type="button" aria-label="+" onClick={() => setBig(block.text)} className="w-20 shrink-0">
                  <Media locale={locale} name={block.shot} kind="webp" className="w-full rounded-lg border border-line" />
                </button>
              ) : null}
            </div>
            {block.shot && big === block.text ? (
              <button type="button" aria-label="−" onClick={() => setBig(null)}>
                <Media locale={locale} name={block.shot} kind="webp" />
              </button>
            ) : null}
            {block.numbers ? <NumberRow locale={locale} numbers={numbers} /> : null}
          </section>
        ),
      )}
    </div>
  );
}
