"use client";

import { useEffect, useState } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import type { UICopy } from "@/lib/copy";
import type { PlanTier } from "@/lib/billing/plans";
import { fillInvite, inviteCopy } from "@/lib/invite/copy";
import { inviteStatus } from "@/lib/invite/client";
import { nextMilestone, type InviteNews, type InviteStatus } from "@/lib/invite/rewards";

/**
 * 친구 초대 보상(lib/invite/rewards.ts): My 탭 위 카드와, 앱을 열 때 한 번 뜨는 소식.
 * 숫자는 서버(/api/invite status)가 정한다 — 초기 혜택은 전체 보상 횟수로 끝난다.
 */

function planName(ui: UICopy, tier: PlanTier): string {
  return tier === "plus" ? ui.planPlusName : tier === "premium" ? ui.billingPremiumLabel : tier;
}

function dateLabel(at: number, locale: string): string {
  return new Date(at).toLocaleDateString(locale, { month: "short", day: "numeric" });
}

export function InviteRewardsCard({ ui, locale }: { ui: UICopy; locale: string }) {
  const t = inviteCopy(locale);
  const [status, setStatus] = useState<InviteStatus | null>(null);

  useEffect(() => {
    let alive = true;
    void inviteStatus(false).then(
      (found) => {
        if (alive) setStatus(found);
      },
      () => {},
    );
    return () => {
      alive = false;
    };
  }, []);

  if (!status) return null;
  const next = nextMilestone(status.friends);
  const progress = next ? Math.min(1, status.friends / next.friends) : 1;
  return (
    <section className="mb-4 rounded-xl border border-good/30 bg-good/10 p-3">
      {/* 초대 버튼은 바로 위 머리(➕ 친구 초대)에 있다. */}
      <p className="text-sm font-semibold text-ink">🎁 {t.rewardTitle}</p>
      <p className="mt-0.5 text-note text-slate-200">{fillInvite(t.rewardRule, { a: status.reward.inviter, b: status.reward.invitee })}</p>
      {status.reward.early && status.earlyLeft > 0 ? (
        <p className="mt-1.5 inline-block rounded-lg bg-warn/15 px-2 py-0.5 text-caption text-warn">⏳ {fillInvite(t.rewardEarly, { n: status.earlyLeft })}</p>
      ) : null}
      <p className="mt-2 text-caption text-slate-300">
        {fillInvite(t.rewardMilestones, { plus: ui.planPlusName, premium: ui.billingPremiumLabel })}
      </p>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden>
        <div className="h-full rounded-full bg-good" style={{ width: `${Math.round(progress * 100)}%` }} />
      </div>
      <p className="mt-1 flex flex-wrap justify-between gap-x-2 text-meta text-slate-400">
        <span>{fillInvite(t.rewardStats, { n: status.friends, p: status.points })}</span>
        {next ? <span>{fillInvite(t.rewardNext, { n: next.friends - status.friends })}</span> : null}
      </p>
      {status.pass ? (
        <p className="mt-1.5 text-caption font-medium text-good">
          ✨ {fillInvite(t.passActive, { plan: planName(ui, status.pass.tier), date: dateLabel(status.pass.until, locale) })}
        </p>
      ) : null}
    </section>
  );
}

function newsLine(ui: UICopy, locale: string, news: InviteNews): string {
  const t = inviteCopy(locale);
  if (news.kind === "invitee") return `🎁 ${fillInvite(t.newsInvitee, { p: news.points })}`;
  if (news.kind === "pass") return `✨ ${fillInvite(t.newsPass, { n: news.friends, plan: planName(ui, news.tier), days: news.days })}`;
  return news.points > 0
    ? `🎁 ${fillInvite(t.newsInviter, { name: news.friend || "…", p: news.points })}`
    : `🙌 ${fillInvite(t.newsInviterCap, { name: news.friend || "…" })}`;
}

/** 앱을 열 때 한 번: 쌓인 초대 소식(보상 지급·단계 보상). 서버는 보여 준 소식을 지운다. */
export function InviteNewsSheet({ ui, locale }: { ui: UICopy; locale: string }) {
  const t = inviteCopy(locale);
  const [news, setNews] = useState<InviteNews[]>([]);

  useEffect(() => {
    let alive = true;
    void inviteStatus(true).then(
      (status) => {
        if (alive && status.news.length) setNews(status.news);
      },
      () => {},
    );
    return () => {
      alive = false;
    };
  }, []);

  if (!news.length) return null;
  return (
    <BodyLayer>
      <div className="fixed inset-0 z-[82] flex items-end justify-center bg-black/60 p-3 sm:items-center" onClick={() => setNews([])}>
        <div role="dialog" aria-modal="true" aria-label={t.newsTitle} className="w-full max-w-md rounded-2xl border border-line bg-surface p-4" onClick={(event) => event.stopPropagation()}>
          <p className="text-title font-semibold text-ink">{t.newsTitle}</p>
          <ul className="mt-2 space-y-1.5">
            {news.map((row, index) => (
              <li key={index} className="text-body text-slate-200">
                {newsLine(ui, locale, row)}
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => setNews([])} className="tb-btn mt-4 w-full rounded-lg px-4 py-2.5 text-sm font-semibold">
            {t.ok}
          </button>
        </div>
      </div>
    </BodyLayer>
  );
}
