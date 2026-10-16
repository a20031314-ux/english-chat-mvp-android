"use client";

import { useEffect, useState } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import { elementNames } from "@/components/studyMap/GrowthNetwork";
import { sendAppIntent } from "@/lib/appIntents";
import type { UICopy } from "@/lib/copy";
import { learningLanguageTextDir } from "@/lib/learningLanguages";
import { usePremium } from "@/contexts/PremiumContext";
import { fetchPackToday, finishPack, type PackToday } from "@/lib/pack/client";
import type { Retro } from "@/lib/pack/pack";
import type { PracticeRequest } from "@/components/NextStepCard";

/**
 * Today's pack on the call tab's door: seven minutes made from what the
 * learner needs most (pack/pack.ts), free once a day. Tapping it opens the
 * call already playing the pack; once it is done, the card offers the retro.
 * Renders nothing where packs are not made yet, or while it loads.
 */
export function PackCard({
  ui,
  targetLanguage,
  onStart,
  refreshKey,
}: {
  ui: UICopy;
  targetLanguage: string;
  onStart: (request: PracticeRequest) => void;
  /** Changes when a call closes, so the card shows how far the pack got. */
  refreshKey?: unknown;
}) {
  const { isPremium } = usePremium();
  const [pack, setPack] = useState<PackToday | null>(null);
  const [showRetro, setShowRetro] = useState(false);
  const [retro, setRetro] = useState<Retro | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchPackToday(targetLanguage, isPremium).then((loaded) => {
      if (cancelled) return;
      setPack(loaded);
      setRetro(loaded?.retro ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [targetLanguage, isPremium, refreshKey]);

  if (!pack) return null;
  const names = elementNames(ui);
  const done = pack.status === "done";
  // A plan with extra packs (billing/plans.ts) offers the next once this one is over.
  const n = pack.n ?? 1;
  const total = pack.packsToday ?? 1;
  const another = done && n < total;
  const startAnother = async () => {
    // The next pack opens once this one is closed on the server.
    if (!retro) await finishPack(targetLanguage, pack.day, isPremium);
    const next = await fetchPackToday(targetLanguage, isPremium, n + 1);
    if (!next) return;
    setPack(next);
    setRetro(next.retro ?? null);
  };
  const start = () =>
    onStart({ tab: "roleplay", goal: pack.practice, title: ui.packTitle, packAnswered: pack.answered });

  return (
    <div className="w-full rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.06] px-4 py-3 text-start">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[13px] font-semibold text-emerald-200">{ui.packTitle}</p>
        <p className="text-[11px] text-emerald-200/70">{ui.packFree}</p>
      </div>
      <p className="mt-1 text-[13px] leading-snug text-slate-200">
        {ui.packFocus.replace("{element}", names[pack.centre]).replace("{side}", names[pack.side])}
      </p>
      <p className="mt-0.5 text-[12px] text-slate-400">{ui.packHint.replace("{minutes}", String(pack.minutes))}</p>
      {pack.phrases.length && !done ? (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400">{ui.packTry}</span>
          {pack.phrases.map((phrase) => (
            <span
              key={phrase}
              dir={learningLanguageTextDir(targetLanguage)}
              className="rounded-full bg-white/10 px-2 py-0.5 text-[12px] text-slate-100"
            >
              {phrase}
            </span>
          ))}
        </div>
      ) : null}
      {done ? (
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-[12px] text-emerald-200">{another ? null : ui.packDoneToday}</p>
          <div className="flex items-center gap-2">
            {another ? (
              <button
                type="button"
                onClick={() => void startAnother()}
                className="rounded-lg bg-emerald-400/20 px-3 py-1.5 text-[12px] text-emerald-100 hover:bg-emerald-400/30"
              >
                {ui.packOneMore.replace("{n}", String(n + 1)).replace("{total}", String(total))}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setShowRetro(true);
                // Every question answered but never closed (the call was put
                // down on its last line): closing it here is what makes the retro.
                if (!retro) void finishPack(targetLanguage, pack.day, isPremium).then(setRetro);
              }}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-[12px] text-slate-100 hover:bg-white/15"
            >
              {ui.packSeeRetro}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={start}
          className="mt-3 w-full rounded-xl bg-[#e8e8e4] px-4 py-2.5 text-[14px] font-semibold text-neutral-900 hover:bg-white"
        >
          {pack.status === "doing"
            ? ui.packContinue.replace("{n}", String(pack.answered)).replace("{total}", String(pack.questions))
            : ui.packStart}
        </button>
      )}
      {showRetro ? (
        <PackRetroSheet ui={ui} retro={retro} targetLanguage={targetLanguage} onClose={() => setShowRetro(false)} />
      ) : null}
    </div>
  );
}

/**
 * What today's pack did, and what was added to My. Facts only: the record's
 * own numbers, and nothing claimed that did not move.
 */
export function PackRetroSheet({
  ui,
  retro,
  targetLanguage,
  onClose,
}: {
  ui: UICopy;
  retro: Retro | null;
  targetLanguage: string;
  onClose: () => void;
}) {
  const names = elementNames(ui);
  const fill = (template: string, values: Record<string, string | number>) =>
    Object.entries(values).reduce((text, [key, value]) => text.replace(`{${key}}`, String(value)), template);
  const openMy = () => {
    sendAppIntent("openTab", { tab: "map" });
    onClose();
  };
  return (
    <BodyLayer>
      <div className="fixed inset-0 z-[90] flex flex-col justify-end bg-black/60 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] sm:items-center sm:justify-center">
        <button type="button" className="absolute inset-0 cursor-default" aria-label={ui.billingClose} onClick={onClose} />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={ui.packRetroTitle}
          className="relative z-10 max-h-full w-full max-w-md overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-[#0e0e0e] p-4"
        >
          <div className="flex items-start gap-2">
            <h3 className="min-w-0 flex-1 text-base font-semibold text-white">{ui.packRetroTitle}</h3>
            <button
              type="button"
              onClick={onClose}
              aria-label={ui.billingClose}
              className="shrink-0 rounded-lg px-2 py-1 text-sm text-slate-400 hover:bg-white/10"
            >
              ✕
            </button>
          </div>
          {retro ? (
            <>
              <ul className="mt-3 flex flex-col gap-1.5 text-[13px] leading-snug text-slate-200">
                <li>{fill(ui.packRetroAnswered, { n: retro.answered, total: retro.planned })}</li>
                {retro.quick ? <li>{fill(ui.packRetroQuick, { n: retro.quick.done, total: retro.quick.of })}</li> : null}
                {retro.clean ? <li>{fill(ui.packRetroClean, { n: retro.clean.done, total: retro.clean.of })}</li> : null}
                {retro.stuck ? <li className="text-amber-200">{fill(ui.packRetroStuck, { n: retro.stuck })}</li> : null}
                {retro.phrases.map((phrase) => (
                  <li key={phrase.text}>
                    {phrase.used ? ui.packRetroPhraseUsed : ui.packRetroPhraseNot}{" "}
                    <span dir={learningLanguageTextDir(targetLanguage)} className="rounded bg-white/10 px-1.5 text-slate-100">
                      {phrase.text}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] p-3">
                <p className="text-[12px] font-semibold text-emerald-200">{ui.packAddedTitle}</p>
                {retro.changed.length ? (
                  <ul className="mt-1.5 flex flex-col gap-1 text-[13px] text-slate-100">
                    {retro.changed.map((change) =>
                      change.kind === "grew" ? (
                        <li key={`grew-${change.element}`}>
                          {names[change.element]} <span className="text-emerald-300">+{change.points}</span>
                          {change.stageUp ? <span className="ms-1.5 text-[12px] text-emerald-300">· {ui.packStageUp}</span> : null}
                        </li>
                      ) : (
                        <li key={`mastered-${change.phrase}`}>
                          <span dir={learningLanguageTextDir(targetLanguage)}>{change.phrase}</span>{" "}
                          <span className="text-emerald-300">· {ui.packMastered}</span>
                        </li>
                      ),
                    )}
                  </ul>
                ) : (
                  <p className="mt-1 text-[12px] leading-relaxed text-slate-300">{ui.packNothing}</p>
                )}
                <p className="mt-2 text-[11px] text-slate-400">{ui.packTomorrow}</p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={openMy}
                  className="flex-1 rounded-xl border border-white/15 px-4 py-2.5 text-[13px] text-slate-100 hover:bg-white/10"
                >
                  {ui.packMyLink}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-[#e8e8e4] px-4 py-2.5 text-[13px] font-semibold text-neutral-900 hover:bg-white"
                >
                  {ui.billingClose}
                </button>
              </div>
            </>
          ) : (
            <p className="mt-3 text-[13px] text-slate-400">…</p>
          )}
        </div>
      </div>
    </BodyLayer>
  );
}
