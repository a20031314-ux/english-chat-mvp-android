"use client";

import { useState } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import { LearningLanguageFlag } from "@/components/LearningLanguageFlag";
import { useLearningLanguage } from "@/contexts/LearningLanguageContext";
import type { Locale, UICopy } from "@/lib/copy";
import {
  getLearningLanguage,
  learningLanguageTextDir,
  learningLanguageUiLabel,
  SUPPORTED_LEARNING_LANGUAGES,
  type LearningLanguageCode,
} from "@/lib/learningLanguages";

/**
 * 배울 언어·앱 언어 고르기(사용자 2026-10-31).
 * - 처음 설치: 배울 언어 국기만(`FirstLanguagePick`). 앱 언어는 묻지 않고 기기 언어로(lib/firstLanguage.ts).
 * - 그 뒤: 상단바의 지금 배우는 언어 국기 하나 → 언어 설정 시트(`LanguageSettingsButton`).
 *   배울 언어는 바꾸기 전에 한 번 확인, 앱 언어는 바로. 바꾸는 횟수 제한 없음, 학습 기록은 언어마다 따로 남아 돌아오면 이어진다.
 */

/** 앱 언어와 같은 언어는 맨 뒤로(배울 언어로 고르는 일이 드묾). */
function ordered(last: string | null): LearningLanguageCode[] {
  const codes = SUPPORTED_LEARNING_LANGUAGES.map((lang) => lang.code);
  return last ? [...codes.filter((code) => code !== last), ...codes.filter((code) => code === last)] : codes;
}

function LanguageGrid({
  locale,
  codes,
  current,
  onPick,
}: {
  locale: string;
  codes: LearningLanguageCode[];
  current: string | null;
  onPick: (code: LearningLanguageCode) => void;
}) {
  return (
    <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {codes.map((code) => {
        const lang = getLearningLanguage(code);
        const local = learningLanguageUiLabel(code, locale);
        const on = current === code;
        return (
          <li key={code}>
            <button
              type="button"
              onClick={() => onPick(code)}
              aria-pressed={on}
              data-lang-pick={code}
              className={`flex w-full flex-col items-center gap-1.5 rounded-xl border px-1 py-3 transition ${
                on ? "border-platinum bg-white/10" : "border-line bg-surface hover:bg-white/5"
              }`}
            >
              <LearningLanguageFlag language={lang} big />
              <span className="text-note font-medium text-ink" dir={learningLanguageTextDir(code)}>
                {lang.nativeLabel}
              </span>
              {local !== lang.nativeLabel ? <span className="text-meta text-slate-400">{local}</span> : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** 처음 설치에 한 번: 배울 언어 국기를 누르면 바로 그 언어로 시작. */
export function FirstLanguagePick({
  ui,
  locale,
  onPicked,
}: {
  ui: UICopy;
  locale: Locale;
  onPicked: () => void;
}) {
  const { setTargetLanguage } = useLearningLanguage();
  return (
    <BodyLayer>
      <div
        dir={learningLanguageTextDir(locale)}
        className="fixed inset-0 z-[85] overflow-y-auto bg-canvas"
        role="dialog"
        aria-modal="true"
        aria-labelledby="first-language-title"
        data-first-language
      >
        <div className="mx-auto w-full max-w-md px-4 pb-10 pt-12">
          <h1 id="first-language-title" className="mb-6 text-center text-heading font-semibold text-ink">
            {ui.learnPickTitle}
          </h1>
          <LanguageGrid
            locale={locale}
            codes={ordered(locale)}
            current={null}
            onPick={(code) => {
              setTargetLanguage(code);
              onPicked();
            }}
          />
        </div>
      </div>
    </BodyLayer>
  );
}

/** 상단바: 지금 배우는 언어 국기 하나 → 언어 설정(배울 언어 · 앱 언어). */
export function LanguageSettingsButton({
  ui,
  locale,
  onLocale,
}: {
  ui: UICopy;
  locale: Locale;
  onLocale: (next: Locale) => void;
}) {
  const { targetLanguage, targetLanguageInfo, setTargetLanguage } = useLearningLanguage();
  const [open, setOpen] = useState(false);
  const [asking, setAsking] = useState<LearningLanguageCode | null>(null);
  const close = () => {
    setOpen(false);
    setAsking(null);
  };
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={ui.languageSettings}
        title={ui.languageSettings}
        data-language-settings
        className="inline-flex items-center rounded-lg border border-line bg-white/5 p-1.5 hover:bg-white/10"
      >
        <LearningLanguageFlag language={targetLanguageInfo} />
      </button>
      {open ? (
        <BodyLayer>
          <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/60 p-3 sm:items-center" onClick={close}>
            <div
              role="dialog"
              aria-modal="true"
              aria-label={ui.languageSettings}
              dir={learningLanguageTextDir(locale)}
              className="max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-line bg-surface p-4 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-title font-semibold text-ink">{ui.learningLanguageLabel}</h2>
                <button type="button" onClick={close} className="rounded-lg px-2 py-1 text-body text-slate-400 hover:bg-white/10">
                  {ui.accountClose}
                </button>
              </div>
              {asking ? (
                <div className="mb-3 rounded-xl border border-line bg-surface-sunk p-3" data-language-confirm>
                  <p className="flex items-center gap-2 text-body text-ink">
                    <LearningLanguageFlag language={getLearningLanguage(asking)} />
                    {ui.learnSwitchAsk.replace("{lang}", learningLanguageUiLabel(asking, locale))}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTargetLanguage(asking);
                        close();
                      }}
                      className="flex-1 rounded-xl bg-platinum px-3 py-2 text-body font-medium text-canvas hover:bg-platinum-hover"
                    >
                      {ui.learnSwitchYes}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAsking(null)}
                      className="flex-1 rounded-xl border border-line px-3 py-2 text-body text-slate-200 hover:bg-white/5"
                    >
                      {ui.accountCancel}
                    </button>
                  </div>
                </div>
              ) : null}
              <LanguageGrid
                locale={locale}
                codes={ordered(locale)}
                current={asking ?? targetLanguage}
                onPick={(code) => setAsking(code === targetLanguage ? null : code)}
              />
              <h2 className="mb-3 mt-6 text-title font-semibold text-ink">{ui.uiLanguageLabel}</h2>
              <LanguageGrid
                locale={locale}
                codes={SUPPORTED_LEARNING_LANGUAGES.map((lang) => lang.code)}
                current={locale}
                onPick={(code) => onLocale(code)}
              />
            </div>
          </div>
        </BodyLayer>
      ) : null}
    </>
  );
}
