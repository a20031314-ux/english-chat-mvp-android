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
import { readMyLanguages, saveMyLanguages, toggleMyLanguage } from "@/lib/myLanguages";
import { AiAvatar } from "@/components/AiTutorProfile";
import { chatPartnerForLanguage, type TutorGender } from "@/lib/chatPartner";
import { readTutorGender, writeTutorGender } from "@/lib/tutorGender";

/**
 * 배울 언어·앱 언어 고르기(사용자 2026-10-31).
 * - 처음 설치: 배울 언어 국기만(`FirstLanguagePick`) — 여러 개 눌러 고르고 "시작"(2026-11-02 여러 개). 앱 언어는 묻지 않고 기기 언어로(lib/firstLanguage.ts).
 *   그다음 고른 언어마다 튜터 둘 얼굴에서 하나(2026-11-06 사용자 "앱 설치했을 때 프로필로 선택하게 해서 쭉") — tutorGender.v1, 바꾸기는 ⋮ 튜터 목소리·사람 탭 튜터 프로필.
 * - 그 뒤: 상단바의 지금 배우는 언어 국기 하나 → 언어 설정 시트(`LanguageSettingsButton`).
 *   맨 위 줄 = 내 언어(누르면 그 언어로 바로), 아래 국기 모음 = 내 언어에 더하기·빼기(✓), 앱 언어는 바로.
 *   목록은 lib/myLanguages.ts(이 폰). 학습 기록은 언어마다 따로 남아 돌아오면 이어진다.
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
  checked,
  onPick,
}: {
  locale: string;
  codes: LearningLanguageCode[];
  current: string | null;
  /** 여러 개 고르기: 고른 언어에 ✓. */
  checked?: readonly string[];
  onPick: (code: LearningLanguageCode) => void;
}) {
  return (
    <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {codes.map((code) => {
        const lang = getLearningLanguage(code);
        const local = learningLanguageUiLabel(code, locale);
        const ticked = checked?.includes(code) ?? false;
        const on = current === code || ticked;
        return (
          <li key={code}>
            <button
              type="button"
              onClick={() => onPick(code)}
              aria-pressed={on}
              data-lang-pick={code}
              className={`relative flex w-full flex-col items-center gap-1.5 rounded-xl border px-1 py-3 transition ${
                on ? "border-platinum bg-white/10" : "border-line bg-surface hover:bg-white/5"
              }`}
            >
              {ticked ? (
                <span aria-hidden className="absolute end-1.5 top-1.5 rounded-full bg-platinum px-1.5 text-meta font-semibold text-canvas">
                  ✓
                </span>
              ) : null}
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

/** 처음 설치에 한 번: 배울 언어 국기를 여러 개 눌러 고르고 시작 — 처음 누른 언어로 시작. */
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
  const [picked, setPicked] = useState<LearningLanguageCode[]>([]);
  const [tutorStep, setTutorStep] = useState(false);
  if (tutorStep) {
    return (
      <FirstTutorPick
        ui={ui}
        locale={locale}
        languages={picked}
        onDone={() => {
          const [first] = picked;
          if (!first) return;
          saveMyLanguages(picked);
          setTargetLanguage(first);
          onPicked();
        }}
      />
    );
  }
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
        <div className="mx-auto w-full max-w-md px-4 pb-28 pt-12">
          <h1 id="first-language-title" className="mb-6 text-center text-heading font-semibold text-ink">
            {ui.learnPickTitle}
          </h1>
          <LanguageGrid
            locale={locale}
            codes={ordered(locale)}
            current={null}
            checked={picked}
            onPick={(code) =>
              setPicked((list) => (list.includes(code) ? list.filter((item) => item !== code) : [...list, code]))
            }
          />
        </div>
        <div className="fixed inset-x-0 bottom-0 border-t border-line bg-canvas px-4 py-3">
          <button
            type="button"
            disabled={!picked.length}
            data-first-language-start
            onClick={() => {
              if (picked.length) setTutorStep(true);
            }}
            className="mx-auto flex w-full max-w-md items-center justify-center gap-1.5 rounded-xl bg-platinum px-3 py-3 text-body font-semibold text-canvas hover:bg-platinum-hover disabled:opacity-40"
          >
            {picked.map((code) => (
              <LearningLanguageFlag key={code} language={getLearningLanguage(code)} />
            ))}
            <span className="ms-1">{ui.packStart}</span>
          </button>
        </div>
      </div>
    </BodyLayer>
  );
}

/** 처음 설치 둘째 장: 고른 언어마다 튜터 둘 — 처음엔 그 언어 기본 튜터가 골라진 채, 누르면 그 튜터로. */
function FirstTutorPick({
  ui,
  locale,
  languages,
  onDone,
}: {
  ui: UICopy;
  locale: Locale;
  languages: LearningLanguageCode[];
  onDone: () => void;
}) {
  const [chosen, setChosen] = useState<Record<string, TutorGender>>(() =>
    Object.fromEntries(languages.map((code) => [code, readTutorGender(code)])),
  );
  return (
    <BodyLayer>
      <div
        dir={learningLanguageTextDir(locale)}
        className="fixed inset-0 z-[85] overflow-y-auto bg-canvas"
        role="dialog"
        aria-modal="true"
        aria-labelledby="first-tutor-title"
        data-first-tutor
      >
        <div className="mx-auto w-full max-w-md px-4 pb-28 pt-12">
          <h1 id="first-tutor-title" className="mb-6 text-center text-heading font-semibold text-ink">
            {ui.talkAiTutor}
          </h1>
          <ul className="flex flex-col gap-4">
            {languages.map((code) => (
              <li key={code} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3" data-first-tutor-language={code}>
                <LearningLanguageFlag language={getLearningLanguage(code)} />
                <div className="flex flex-1 justify-around gap-2">
                  {(["f", "m"] as const).map((gender) => {
                    const person = chatPartnerForLanguage(code, gender);
                    const on = (chosen[code] ?? readTutorGender(code)) === person.gender;
                    return (
                      <button
                        key={gender}
                        type="button"
                        aria-pressed={on}
                        data-first-tutor-choice={gender}
                        onClick={() => setChosen((all) => ({ ...all, [code]: person.gender }))}
                        className={`flex flex-col items-center gap-1.5 rounded-xl p-2 ${on ? "bg-white/10 ring-2 ring-platinum" : "opacity-50"}`}
                      >
                        <AiAvatar size={72} language={code} gender={person.gender} />
                        <bdi className="text-note font-semibold text-ink">{person.givenName}</bdi>
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="fixed inset-x-0 bottom-0 border-t border-line bg-canvas px-4 py-3">
          <button
            type="button"
            data-first-tutor-start
            onClick={() => {
              for (const code of languages) writeTutorGender(code, chosen[code] ?? readTutorGender(code));
              onDone();
            }}
            className="mx-auto flex w-full max-w-md items-center justify-center rounded-xl bg-platinum px-3 py-3 text-body font-semibold text-canvas hover:bg-platinum-hover"
          >
            {ui.packStart}
          </button>
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
  const [mine, setMine] = useState<LearningLanguageCode[]>([]);
  const close = () => setOpen(false);
  const toggle = (code: LearningLanguageCode) => {
    const next = toggleMyLanguage(mine, code, targetLanguage);
    setMine(next);
    saveMyLanguages(next);
  };
  return (
    <>
      <button
        type="button"
        onClick={() => {
          setMine(readMyLanguages(targetLanguage));
          setOpen(true);
        }}
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
              <ul className="mb-4 flex flex-wrap gap-2" data-my-languages>
                {mine.map((code) => {
                  const active = code === targetLanguage;
                  return (
                    <li key={code}>
                      <button
                        type="button"
                        aria-pressed={active}
                        data-my-language={code}
                        onClick={() => {
                          if (!active) setTargetLanguage(code);
                          close();
                        }}
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-body ${
                          active ? "border-platinum bg-white/10 font-semibold text-ink" : "border-line text-slate-300 hover:bg-white/5"
                        }`}
                      >
                        <LearningLanguageFlag language={getLearningLanguage(code)} />
                        <span dir={learningLanguageTextDir(code)}>{getLearningLanguage(code).nativeLabel}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <LanguageGrid locale={locale} codes={ordered(locale)} current={null} checked={mine} onPick={toggle} />
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
