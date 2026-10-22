"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { NativeAdSlot } from "@/components/NativeAdSlot";
import type { RoomCopy } from "@/lib/rooms/copy";
import { listPeople, setFollow } from "@/lib/rooms/client";
import { ONLINE_WINDOW_MS, type PersonCard } from "@/lib/rooms/social";
import { readEntryDoor } from "@/lib/doors";
import { getLearningLanguage, isLearningLanguageCode, learningLanguageUiLabel } from "@/lib/learningLanguages";
import { LearningLanguageFlag } from "@/components/LearningLanguageFlag";
import { Face, ProfileSheet, loadProfile } from "./RoomParts";
import { chipLabel, fillCount, profileCopy } from "@/lib/account/profileCopy";
import { countryFlag, countryName } from "@/lib/account/countries";

/**
 * 사람 목록 (말하는 방 → 사람). 최근 2주 안에 앱을 쓴 사람이 최근 순으로 쭉 뜨고,
 * 카드에서 바로 팔로우·메시지, 누르면 프로필 시트(차단·신고도 거기서).
 *
 * 언어는 그 사람의 앱 설정 그대로: 앱 언어 = 할 줄 아는 말, 학습 언어 = 배우는 말.
 * 거르기는 화면에서만(서버는 최대 60명을 준다).
 */

type Filter = "all" | "online" | "partners" | "same" | "shared" | "call";

/** 그 사람이 할 줄 아는 말: 정한 모국어, 없으면 예전처럼 앱 언어. */
const speaksOf = (person: PersonCard) => person.native ?? person.ui;

function activity(t: RoomCopy, lastSeen: number, now: number): { text: string; online: boolean } {
  if (now - lastSeen < ONLINE_WINDOW_MS) return { text: t.onlineNow, online: true };
  const days = Math.floor((now - lastSeen) / (24 * 60 * 60 * 1000));
  return { text: days < 1 ? t.activeToday : t.activeDaysAgo.replace("{n}", String(days)), online: false };
}

function LangChip({ code, locale, learning }: { code: string | null; locale: string; learning: boolean }) {
  if (!code || !isLearningLanguageCode(code)) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] ${
        learning ? "bg-violet-500/20 text-violet-100" : "bg-emerald-500/15 text-emerald-100"
      }`}
    >
      <LearningLanguageFlag language={getLearningLanguage(code)} className="h-3 w-4" />
      {learningLanguageUiLabel(code, locale)}
    </span>
  );
}

export function PeopleList({
  t,
  locale,
  targetLanguage,
  onMessage,
}: {
  t: RoomCopy;
  locale: string;
  targetLanguage: string;
  onMessage: (accountId: string) => void;
}) {
  const [people, setPeople] = useState<PersonCard[] | null>(null);
  const [error, setError] = useState(false);
  // 창구 Pingo(lib/doors.ts)로 오면 "지금 접속 중"으로 연다.
  const [filter, setFilter] = useState<Filter>(() => readEntryDoor()?.peopleFilter ?? "all");
  const [open, setOpen] = useState<PersonCard | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const refresh = useCallback(async () => {
    try {
      setPeople(await listPeople({ learn: targetLanguage, ui: locale }));
      setNow(Date.now());
      setError(false);
    } catch {
      setError(true);
    }
  }, [targetLanguage, locale]);

  useEffect(() => {
    void refresh();
    // 목록을 보고 있는 동안 1분마다: 나도 "접속 중"으로 남고, 새로 들어온 사람이 보인다.
    const timer = window.setInterval(() => void refresh(), 60_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const shown = useMemo(() => {
    const list = people ?? [];
    if (filter === "online") {
      // 지금 접속한 사람 중 내 말을 배우는 사람(언어 교환 짝)이 먼저.
      return list
        .filter((person) => now - person.lastSeen < ONLINE_WINDOW_MS)
        .sort((a, b) => Number(b.learn === locale) - Number(a.learn === locale));
    }
    if (filter === "partners") return list.filter((person) => person.learn === locale);
    if (filter === "same") return list.filter((person) => person.learn === targetLanguage);
    if (filter === "shared") return list.filter((person) => (person.sharedInterests ?? 0) > 0).sort((a, b) => (b.sharedInterests ?? 0) - (a.sharedInterests ?? 0));
    if (filter === "call") return list.filter((person) => person.meetModes?.includes("call") || person.meetModes?.includes("video"));
    return list;
  }, [people, filter, locale, targetLanguage, now]);

  const pc = profileCopy(locale);

  const toggleFollow = async (person: PersonCard) => {
    if (busy) return;
    setBusy(person.id);
    try {
      await setFollow(person.id, !person.isFollowing);
      setPeople((list) => (list ?? []).map((item) => (item.id === person.id ? { ...item, isFollowing: !person.isFollowing } : item)));
      loadProfile(person.id, true);
    } catch {
      // 정지(SUSPENDED)면 앱 틀이 한 줄 띄운다(lib/rooms/suspended.ts).
    } finally {
      setBusy(null);
    }
  };

  const filters: [Filter, string][] = [
    ["all", t.peopleAll],
    ["online", t.peopleOnline],
    ["partners", t.peoplePartners],
    ["same", t.peopleSame],
    ["shared", pc.filterShared],
    ["call", pc.filterCall],
  ];

  return (
    <section className="space-y-3">
      <div className="flex gap-1.5 overflow-x-auto pb-0.5">
        {filters.map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] ${
              filter === value ? "bg-white/90 font-medium text-black" : "bg-white/[0.06] text-slate-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {error ? <p className="text-sm text-rose-300">{t.error}</p> : null}
      {people && shown.length === 0 ? <p className="py-6 text-center text-sm text-slate-500">{t.peopleEmpty}</p> : null}

      <ul className="divide-y divide-white/[0.07]">
        {shown.map((person, index) => {
          const seen = activity(t, person.lastSeen, now);
          return (
            <Fragment key={person.id}>
            {/* 네 번째 사람 뒤에 네이티브 광고 하나(무료·안드로이드만). 프로필을 열면 시트가 덮어 멈춘다. */}
            {index === 4 ? (
              <li className="py-3">
                <NativeAdSlot feedId="people-tab" slotKey="people-after-4" />
              </li>
            ) : null}
            <li className="flex gap-3 py-3">
              <button type="button" onClick={() => setOpen(person)} className="relative shrink-0 self-start" aria-label={person.nickname}>
                <Face accountId={person.id} name={person.nickname} size={60} speaking={false} photo={person.hasPhoto ? undefined : null} />
                {seen.online ? (
                  <span className="absolute bottom-0.5 end-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#0b0b0b] bg-emerald-400" aria-hidden />
                ) : null}
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-2">
                  <button type="button" onClick={() => setOpen(person)} className="min-w-0 flex-1 text-start">
                    <p className="truncate text-[16px] font-semibold text-white" dir="auto">
                      {/* 이름은 따로 방향을 잡아(섞인 글자·아랍어) 국기가 이름 사이에 끼지 않게. */}
                      <bdi>{person.nickname}</bdi>
                      {person.country ? (
                        <span className="ms-1.5 text-chat" title={countryName(person.country, locale)} aria-label={countryName(person.country, locale)}>
                          {countryFlag(person.country)}
                        </span>
                      ) : null}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      <LangChip code={speaksOf(person)} locale={locale} learning={false} />
                      {speaksOf(person) && person.learn && speaksOf(person) !== person.learn ? <span className="text-meta text-slate-500">⇄</span> : null}
                      {person.learn !== speaksOf(person) ? <LangChip code={person.learn} locale={locale} learning /> : null}
                      {person.help ? <span className="ms-1 text-meta text-amber-200">🙌 {person.help}</span> : null}
                    </div>
                    {person.interests?.length ? (
                      <p className="mt-1 truncate text-caption text-slate-400">
                        {person.interests.map((id) => chipLabel(pc, "i", id)).join(" · ")}
                        {person.sharedInterests ? <span className="ms-1.5 text-violet-200">{fillCount(pc.shared, person.sharedInterests)}</span> : null}
                      </p>
                    ) : null}
                  </button>
                  <button
                    type="button"
                    disabled={busy === person.id}
                    onClick={() => void toggleFollow(person)}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium disabled:opacity-50 ${
                      person.isFollowing ? "border border-white/25 text-slate-200" : "bg-violet-500 text-white"
                    }`}
                  >
                    {person.isFollowing ? `✓ ${t.following}` : `+ ${t.follow}`}
                  </button>
                </div>
                <button type="button" onClick={() => setOpen(person)} className="mt-1.5 block w-full text-start">
                  <p className="line-clamp-2 whitespace-pre-line text-[13px] leading-relaxed text-slate-300" dir="auto">
                    {person.bio || t.noBio}
                  </p>
                </button>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className={`text-[11px] ${seen.online ? "text-emerald-300" : "text-slate-500"}`}>{seen.text}</span>
                  <button
                    type="button"
                    onClick={() => onMessage(person.id)}
                    className="ms-auto rounded-full border border-violet-400/50 px-3 py-1 text-[12px] text-violet-100"
                  >
                    💬 {t.message}
                  </button>
                </div>
              </div>
            </li>
            </Fragment>
          );
        })}
      </ul>

      {open ? (
        <ProfileSheet
          t={t}
          locale={locale}
          member={null}
          accountId={open.id}
          nickname={open.nickname}
          isHostView={false}
          roomId=""
          recentLines={[]}
          onClose={() => {
            setOpen(null);
            void refresh();
          }}
          onGrant={() => {}}
          onBlockedChange={() => void refresh()}
          onMessage={(id) => {
            setOpen(null);
            onMessage(id);
          }}
        />
      ) : null}
    </section>
  );
}
