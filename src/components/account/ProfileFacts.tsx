"use client";

import { useMemo, useState } from "react";
import {
  INTEREST_IDS,
  INTERESTS_MAX,
  MEET_MODES,
  MEET_TIMES,
  SPEAKS_MAX,
  WORK_IDS,
  type ProfileFacts,
  type ProfileShow,
  type ShowKey,
} from "@/lib/account/profileFacts";
import { chipLabel, fillCount, profileCopy, type ProfileCopy } from "@/lib/account/profileCopy";
import type { ProfileBadges } from "@/lib/rooms/contribution";
import { SUPPORTED_LEARNING_LANGUAGES, getLearningLanguage, isLearningLanguageCode, learningLanguageUiLabel } from "@/lib/learningLanguages";
import { COUNTRY_CODES, countryFlag, countryName } from "@/lib/account/countries";
import { LearningLanguageFlag } from "@/components/LearningLanguageFlag";
import { RoomApiError, sendThank, type ThankTarget } from "@/lib/rooms/client";

/**
 * 프로필 사실·칸·도움됐어요 화면 부품(hub/drafts/profile-2026-10-23.md, 서버는 1단계에 들어감).
 * 칸 이름·칩·스위치·상태만 보이고, 쓰는 법 설명은 사용법(?) 칸에만(hub/DESIGN.md "안내 글").
 */

function Chip({ label, on, disabled, onClick }: { label: string; on: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={disabled && !on}
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-caption disabled:opacity-40 ${
        on ? "bg-violet-500 text-white" : "border border-line text-slate-200 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

function Section({ title, aside, children }: { title: string; aside?: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <p className="flex justify-between text-caption text-slate-400">
        {title}
        {aside ? <span className="text-slate-500">{aside}</span> : null}
      </p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function toggle<T extends string>(list: readonly T[], id: T, max: number): T[] {
  if (list.includes(id)) return list.filter((item) => item !== id);
  return list.length >= max ? [...list] : [...list, id];
}

/** 나에 대한 사실 고르기. `compact`면 로그인 직후 화면용(모국어·관심사·대화 방식만). */
export function FactsEditor({
  locale,
  facts,
  onChange,
  compact = false,
}: {
  locale: string;
  facts: ProfileFacts;
  onChange: (next: ProfileFacts) => void;
  compact?: boolean;
}) {
  const t = profileCopy(locale);
  const langs = SUPPORTED_LEARNING_LANGUAGES.map((language) => language.code);
  // 나라 이름은 앱 언어로, 그 언어의 가나다(알파벳) 순.
  const countries = useMemo(() => {
    const collator = new Intl.Collator(locale);
    return COUNTRY_CODES.map((code) => ({ code, name: countryName(code, locale) })).sort((a, b) => collator.compare(a.name, b.name));
  }, [locale]);
  return (
    <div>
      <Section title={t.country}>
        <select
          value={facts.country ?? ""}
          onChange={(event) => onChange({ ...facts, country: event.target.value || null })}
          aria-label={t.country}
          className="w-full rounded-lg border border-line bg-surface-sunk px-3 py-2 text-body text-ink"
        >
          <option value="">{t.countryNone}</option>
          {countries.map(({ code, name }) => (
            <option key={code} value={code}>
              {countryFlag(code)} {name}
            </option>
          ))}
        </select>
      </Section>
      <Section title={t.native}>
        {langs.map((code) => (
          <Chip
            key={code}
            label={learningLanguageUiLabel(code, locale)}
            on={facts.native === code}
            onClick={() =>
              onChange({
                ...facts,
                native: facts.native === code ? null : code,
                speaks: facts.speaks.filter((item) => item !== code),
              })
            }
          />
        ))}
      </Section>
      {!compact ? (
        <Section title={t.speaks} aside={fillCount(t.interestsLimit, SPEAKS_MAX)}>
          {langs
            .filter((code) => code !== facts.native)
            .map((code) => (
              <Chip
                key={code}
                label={learningLanguageUiLabel(code, locale)}
                on={facts.speaks.includes(code)}
                disabled={facts.speaks.length >= SPEAKS_MAX}
                onClick={() => onChange({ ...facts, speaks: toggle(facts.speaks, code, SPEAKS_MAX) })}
              />
            ))}
        </Section>
      ) : null}
      <Section title={t.interests} aside={fillCount(t.interestsLimit, INTERESTS_MAX)}>
        {INTEREST_IDS.map((id) => (
          <Chip
            key={id}
            label={chipLabel(t, "i", id)}
            on={facts.interests.includes(id)}
            disabled={facts.interests.length >= INTERESTS_MAX}
            onClick={() => onChange({ ...facts, interests: toggle(facts.interests, id, INTERESTS_MAX) })}
          />
        ))}
      </Section>
      {!compact ? (
        <Section title={t.work}>
          {WORK_IDS.map((id) => (
            <Chip
              key={id}
              label={chipLabel(t, "w", id)}
              on={facts.work === id}
              onClick={() => onChange({ ...facts, work: facts.work === id ? null : id })}
            />
          ))}
        </Section>
      ) : null}
      <Section title={t.meet}>
        {MEET_MODES.map((id) => (
          <Chip
            key={id}
            label={chipLabel(t, "m", id)}
            on={facts.meetModes.includes(id)}
            onClick={() => onChange({ ...facts, meetModes: toggle(facts.meetModes, id, MEET_MODES.length) })}
          />
        ))}
      </Section>
      {!compact ? (
        <Section title={t.times}>
          {MEET_TIMES.map((id) => (
            <Chip
              key={id}
              label={chipLabel(t, "t", id)}
              on={facts.meetTimes.includes(id)}
              onClick={() => onChange({ ...facts, meetTimes: toggle(facts.meetTimes, id, MEET_TIMES.length) })}
            />
          ))}
        </Section>
      ) : null}
    </div>
  );
}

/** 프로필에 보일 칸 켬/끔. 사람 목록에서 숨기기도 같은 묶음에(있던 스위치를 옮김). 주제·표현 칸은 아직 화면이 없어 스위치도 없다. */
export function ShowToggles({
  locale,
  show,
  onShow,
  hidden,
  onHidden,
  hiddenLabel,
}: {
  locale: string;
  show: ProfileShow;
  onShow: (next: ProfileShow) => void;
  hidden?: boolean;
  onHidden?: (next: boolean) => void;
  hiddenLabel?: string;
}) {
  const t = profileCopy(locale);
  const rows: [ShowKey, string][] = [
    ["help", t.showHelp],
    ["streak", t.showStreak],
    ["goal", t.showGoal],
    ["maker", t.showMaker],
    ["tutor", t.showTutor],
  ];
  return (
    <div className="mt-5">
      <p className="text-caption text-slate-400">{t.showTitle}</p>
      <div className="mt-1.5 divide-y divide-white/[0.06] rounded-xl border border-line">
        {rows.map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 px-3 py-2.5 text-note text-slate-200">
            <span className="min-w-0 flex-1">{label}</span>
            <input
              type="checkbox"
              checked={show[key]}
              onChange={(event) => onShow({ ...show, [key]: event.target.checked })}
              className="accent-white"
            />
          </label>
        ))}
        {onHidden && hiddenLabel ? (
          <label className="flex items-center gap-2 px-3 py-2.5 text-note text-slate-200">
            <span className="min-w-0 flex-1">{hiddenLabel}</span>
            <input type="checkbox" checked={hidden === true} onChange={(event) => onHidden(event.target.checked)} className="accent-white" />
          </label>
        ) : null}
      </div>
    </div>
  );
}

function goalText(t: ProfileCopy, goal: { use: string | null; focus: string[] }): string {
  const parts = [goal.use ? chipLabel(t, "u", goal.use) : null, ...goal.focus.map((id) => chipLabel(t, "f", id))].filter(Boolean);
  return parts.length ? `🎯 ${parts.join(" · ")}` : "";
}

/** 언어 이름 앞에 그 언어의 국기(사람 카드의 언어 칩과 같은 그림). */
function LangFlagChip({ code, locale }: { code: string; locale: string }) {
  if (!isLearningLanguageCode(code)) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-white/[0.06] px-1.5 py-0.5 text-slate-200">
      <LearningLanguageFlag language={getLearningLanguage(code)} className="h-3 w-4" />
      {learningLanguageUiLabel(code, locale)}
    </span>
  );
}

/** 남의 프로필 시트에 붙는 사실·칸(켠 것만 서버가 보냄). 아무것도 없으면 그리지 않는다. */
export function FactsView({
  locale,
  facts,
  badges,
  goal,
}: {
  locale: string;
  facts?: ProfileFacts;
  badges?: ProfileBadges;
  goal?: { use: string | null; focus: string[] };
}) {
  const t = profileCopy(locale);
  const lines: string[] = [];
  if (badges?.help) lines.push(fillCount(t.badgeHelp, badges.help.count) + (badges.help.lang ? ` · ${learningLanguageUiLabel(badges.help.lang, locale)}` : ""));
  if (badges?.streak) lines.push(fillCount(t.badgeWeek, badges.streak.week) + (badges.streak.run > 1 ? ` · ${fillCount(t.badgeRun, badges.streak.run)}` : ""));
  if (badges?.maker) lines.push(fillCount(t.badgeMaker, badges.maker.count));
  const goalLine = goal ? goalText(t, goal) : "";
  if (goalLine) lines.push(goalLine);
  const langs = facts ? [facts.native, ...facts.speaks].filter((code): code is string => Boolean(code)) : [];
  const hasCountry = Boolean(facts?.country);
  const chips = facts ? [...facts.interests.map((id) => chipLabel(t, "i", id)), ...(facts.work ? [chipLabel(t, "w", facts.work)] : [])] : [];
  const meet = facts ? [...facts.meetModes.map((id) => chipLabel(t, "m", id)), ...facts.meetTimes.map((id) => chipLabel(t, "t", id))] : [];
  if (!lines.length && !langs.length && !chips.length && !meet.length && !hasCountry) return null;
  return (
    <div className="mt-3 space-y-2">
      {facts?.country ? (
        <p className="text-caption text-slate-300">
          <span className="text-slate-500">{t.country}</span>{" "}
          <span className="text-body" aria-hidden>
            {countryFlag(facts.country)}
          </span>{" "}
          {countryName(facts.country, locale)}
        </p>
      ) : null}
      {langs.length ? (
        <div className="flex flex-wrap items-center gap-1.5 text-caption text-slate-300">
          {facts?.native ? (
            <>
              <span className="text-slate-500">{t.native}</span>
              <LangFlagChip code={facts.native} locale={locale} />
            </>
          ) : null}
          {facts && facts.speaks.length ? (
            <>
              <span className="ms-1 text-slate-500">{t.speaks}</span>
              {facts.speaks.map((code) => (
                <LangFlagChip key={code} code={code} locale={locale} />
              ))}
            </>
          ) : null}
        </div>
      ) : null}
      {chips.length ? (
        <div className="flex flex-wrap gap-1.5">
          {chips.map((label) => (
            <span key={label} className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-caption text-slate-200">
              {label}
            </span>
          ))}
        </div>
      ) : null}
      {meet.length ? <p className="text-caption text-slate-400">{t.meet} · {meet.join(", ")}</p> : null}
      {lines.length ? (
        <div className="flex flex-wrap gap-1.5">
          {lines.map((line) => (
            <span key={line} className="rounded-lg border border-line px-2 py-0.5 text-caption text-slate-200">
              {line}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* 이 실행 동안 누른 답(같은 화면에 다시 그려도 "전했어요"로). 서버가 진짜 중복을 막는다. */
const thankedHere = new Set<string>();
const keyOf = (target: ThankTarget) =>
  target.kind === "board" ? `b:${target.postId}:${target.commentId}` : `${target.kind}:${target.kind === "room" ? target.roomId : target.threadId}:${target.seq}`;

/** 답 아래 "도움됐어요" — 질문한 사람에게만 그린다(부르는 쪽이 정함). */
export function ThankButton({ locale, target, learn }: { locale: string; target: ThankTarget; learn: string }) {
  const t = profileCopy(locale);
  const key = keyOf(target);
  const [state, setState] = useState<"idle" | "busy" | "sent" | "today" | "failed">(() => (thankedHere.has(key) ? "sent" : "idle"));
  const send = async () => {
    if (state === "busy" || state === "sent") return;
    setState("busy");
    try {
      await sendThank(target, learn);
      thankedHere.add(key);
      setState("sent");
    } catch (error) {
      const code = error instanceof RoomApiError ? error.code : "";
      if (code === "ALREADY") {
        thankedHere.add(key);
        setState("sent");
      } else setState(code === "TODAY" ? "today" : "failed");
    }
  };
  if (state === "sent") return <span className="mt-1 inline-block text-meta text-emerald-300">{t.thanked}</span>;
  return (
    <span className="mt-1 inline-flex items-center gap-2">
      <button
        type="button"
        onClick={() => void send()}
        disabled={state === "busy" || state === "today"}
        className="rounded-full border border-amber-300/50 px-2.5 py-0.5 text-meta text-amber-100 hover:bg-amber-300/10 disabled:opacity-50"
      >
        {t.thank}
      </button>
      {state === "today" ? <span className="text-meta text-slate-500">{t.thankToday}</span> : null}
      {state === "failed" ? <span className="text-meta text-rose-300">{t.thankFailed}</span> : null}
    </span>
  );
}
