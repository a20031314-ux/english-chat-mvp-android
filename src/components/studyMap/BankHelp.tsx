"use client";

/**
 * My 큰 칸(Stagebank · Quizbank · Logbank) 머리의 "?"(2026-10-31 사용자 "BANK류에 ? 버튼으로 설명 — 뭘 학습 가능하고, 어떻게 학습하는지,
 * 스크린샷이나 가능하면 학습 영상까지"). 시트: 배울 수 있는 것(한 줄씩, Stagebank는 그 학습 언어의 실제 분량 숫자) · 영상 · 이렇게 공부해요(그림 + 한 줄).
 * 글·그림 이름은 서버(/api/guide banks=1, lib/guide/banks.ts), 그림·영상은 /guide/<앱 언어>/ — 그 언어 것이 없으면 영어 것.
 */
import { useEffect, useState } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import { apiUrl } from "@/lib/apiBase";
import type { UICopy } from "@/lib/copy";
import { contentScope } from "@/lib/curriculum/contentScope";
import { wordsByStage } from "@/lib/curriculum/useWordBank";
import type { BankGuide, BankId } from "@/lib/guide/banks";
import { fillGuideLabels, loadGuide, readCachedGuide } from "@/lib/guide/client";

function Media({ locale, name, kind }: { locale: string; name: string; kind: "webp" | "mp4" }) {
  const [source, setSource] = useState<"own" | "en" | "none">(locale === "en" ? "en" : "own");
  if (source === "none") return null;
  const src = apiUrl(`/guide/${source === "own" ? locale : "en"}/${name}.${kind}`);
  const next = () => setSource(source === "own" ? "en" : "none");
  const style = "w-full rounded-xl border border-line";
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
        </div>
      </div>
    </BodyLayer>
  );
}
