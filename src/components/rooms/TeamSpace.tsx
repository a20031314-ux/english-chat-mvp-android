"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLedger } from "@/lib/learner/ledgerClient";
import { teamGoal, teamSchedule, teamShare, teamSpace, teamUnshare } from "@/lib/rooms/client";
import { daysThisWeek, teamStreak, type Group, type SpaceItem, type TeamSchedule } from "@/lib/rooms/group";
import { fillTeam, type TeamCopy } from "@/lib/rooms/teamCopy";
import { useProfile } from "./RoomParts";

/**
 * 팀·러닝메이트 워크스페이스(hub/drafts/team-workspace.md): 이번 주 목표, 같이 한 날, 정기 모임,
 * 쌓인 것(물은 표현·통화 기록·공유). 보는 방식은 모두 / 표현 / 통화 기록 / 공유(DESIGN.md "보는 방식 고르기").
 */

type View = "all" | "phrase" | "session" | "share";
const VIEW_KEY = "teamSpaceViewMode";

function readView(): View {
  try {
    const value = localStorage.getItem(VIEW_KEY);
    return value === "phrase" || value === "session" || value === "share" ? value : "all";
  } catch {
    return "all";
  }
}

function ByLine({ template, id }: { template: string; id: string }) {
  const profile = useProfile(id || null);
  // 이름은 <bdi>로 — 아랍어 이름이 한국어 문장의 방향을 뒤집지 않게.
  const [before, after = ""] = template.split("{name}");
  return (
    <span>
      {before}
      <bdi>{profile?.nickname || "…"}</bdi>
      {after}
    </span>
  );
}

function weekdayNames(locale: string): string[] {
  // 2026-10-18은 일요일 — 0=일…6=토.
  const format = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
  return Array.from({ length: 7 }, (_, day) => format.format(new Date(Date.UTC(2026, 9, 18 + day))));
}

function localTz(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

function scheduleText(schedule: TeamSchedule, locale: string): string {
  const names = weekdayNames(locale);
  const days = schedule.days.map((day) => names[day]).join(" · ");
  const tz = schedule.tz !== localTz() ? ` (${schedule.tz})` : "";
  return `${days} ${schedule.time}${tz}`;
}

function ScheduleEditor({ tt, locale, initial, onSave, onCancel }: {
  tt: TeamCopy;
  locale: string;
  initial: TeamSchedule | null;
  onSave: (schedule: TeamSchedule | null) => void;
  onCancel: () => void;
}) {
  const [days, setDays] = useState<number[]>(initial?.days ?? []);
  const [time, setTime] = useState(initial?.time ?? "21:00");
  const names = weekdayNames(locale);
  return (
    <div className="mt-2 space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {names.map((name, day) => (
          <button
            key={name}
            type="button"
            aria-pressed={days.includes(day)}
            onClick={() => setDays((have) => (have.includes(day) ? have.filter((row) => row !== day) : [...have, day].sort()))}
            className={`rounded-lg px-2.5 py-1 text-caption ${days.includes(day) ? "bg-violet-500 text-white" : "border border-line text-slate-300"}`}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="time"
          value={time}
          onChange={(event) => setTime(event.target.value)}
          className="rounded-lg border border-line bg-surface-sunk px-2 py-1.5 text-body text-ink"
        />
        <button
          type="button"
          disabled={days.length === 0 || !time}
          onClick={() => onSave({ days, time, tz: localTz() })}
          className="rounded-lg bg-violet-500 px-3 py-1.5 text-caption font-medium text-white disabled:opacity-40"
        >
          {tt.save}
        </button>
        {initial ? (
          <button type="button" onClick={() => onSave(null)} className="rounded-lg border border-line px-3 py-1.5 text-caption text-slate-300">
            {tt.scheduleClear}
          </button>
        ) : null}
        <button type="button" onClick={onCancel} className="ms-auto rounded-lg px-2 py-1.5 text-caption text-slate-400">
          {tt.cancel}
        </button>
      </div>
    </div>
  );
}

function ShareForm({ tt, groupId, targetLanguage, onShared, onCancel }: {
  tt: TeamCopy;
  groupId: string;
  targetLanguage: string;
  onShared: (item: SpaceItem) => void;
  onCancel: () => void;
}) {
  const ledger = useLedger(targetLanguage);
  const [text, setText] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const picks = ledger.slice(0, 24);
  return (
    <div className="space-y-2 rounded-xl border border-line bg-surface-sunk p-3">
      <input
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={tt.shareText}
        dir="auto"
        className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-chat text-ink"
      />
      <input
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder={tt.shareNote}
        dir="auto"
        className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-body text-ink"
      />
      {picks.length ? (
        <div>
          <p className="mb-1 text-caption text-slate-400">{tt.sharePick}</p>
          <div className="flex max-h-28 flex-wrap gap-1.5 overflow-y-auto">
            {picks.map((item) => (
              <button
                key={item.text}
                type="button"
                onClick={() => setText(item.text)}
                dir="auto"
                className="rounded-lg border border-line px-2 py-1 text-caption text-slate-200 hover:bg-white/5"
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={busy || !text.trim()}
          onClick={async () => {
            setBusy(true);
            try {
              onShared((await teamShare(groupId, text, note)).item);
            } catch {
              // 다음에 다시.
            } finally {
              setBusy(false);
            }
          }}
          className="rounded-lg bg-violet-500 px-3 py-1.5 text-caption font-medium text-white disabled:opacity-40"
        >
          {tt.shareSend}
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg px-2 py-1.5 text-caption text-slate-400">
          {tt.cancel}
        </button>
      </div>
    </div>
  );
}

function ItemCard({ tt, me, item, locale, onRemove }: { tt: TeamCopy; me: string; item: SpaceItem; locale: string; onRemove: () => void }) {
  const [open, setOpen] = useState(false);
  const when = new Date(item.at).toLocaleDateString(locale, { month: "short", day: "numeric" });
  if (item.kind === "session") {
    return (
      <li className="rounded-xl border border-line bg-white/[0.02] px-3 py-2">
        <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between gap-2 text-start">
          <span className="text-note text-slate-200">🎙 {fillTeam(tt.sessionLines, { n: item.lines?.length ?? 0 })}</span>
          <span className="text-meta text-slate-500">{when} {open ? "▲" : "▼"}</span>
        </button>
        {open ? (
          <ol className="mt-2 space-y-1">
            {(item.lines ?? []).map((line, index) => (
              <li key={index} className="text-note text-slate-200" dir="auto">
                <span className="me-1.5 text-meta text-slate-500">{line.nickname}</span>
                {line.text}
              </li>
            ))}
          </ol>
        ) : null}
      </li>
    );
  }
  return (
    <li className="rounded-xl border border-line bg-white/[0.02] px-3 py-2">
      <p className="text-chat text-ink" dir="auto">
        {item.kind === "phrase" ? "❓ " : "📌 "}
        {item.text}
      </p>
      {item.note ? (
        <p className="mt-0.5 text-note text-slate-300" dir="auto">
          {item.note}
        </p>
      ) : null}
      <p className="mt-1 flex items-center gap-2 text-meta text-slate-500">
        <ByLine template={item.kind === "phrase" ? tt.askedBy : tt.sharedBy} id={item.by} />
        <span>· {when}</span>
        {item.kind === "share" && item.by === me ? (
          <button type="button" onClick={onRemove} className="ms-auto text-bad">
            {tt.remove}
          </button>
        ) : null}
      </p>
    </li>
  );
}

export function TeamSpace({
  tt,
  me,
  group,
  locale,
  targetLanguage,
  onGroup,
  onGather,
}: {
  tt: TeamCopy;
  me: string;
  group: Group;
  locale: string;
  targetLanguage: string;
  onGroup: (group: Group) => void;
  onGather: () => void;
}) {
  const [items, setItems] = useState<SpaceItem[] | null>(null);
  const [days, setDays] = useState<string[]>([]);
  const [view, setView] = useState<View>(readView);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState("");
  const [editingSchedule, setEditingSchedule] = useState(false);
  const [sharing, setSharing] = useState(false);

  const load = useCallback(() => {
    void teamSpace(group.id).then(
      (body) => {
        setItems(body.space.items);
        setDays(body.space.days);
        onGroup(body.group);
      },
      () => setItems([]),
    );
  }, [group.id, onGroup]);

  useEffect(() => {
    load();
  }, [load]);

  const pick = (next: View) => {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      // 기억 못 해도 이번엔 바뀐다.
    }
  };

  const shown = useMemo(() => (items ?? []).filter((item) => view === "all" || item.kind === view), [items, view]);
  const team = group.team;
  if (!team) return null;
  const streak = teamStreak(days);
  const week = daysThisWeek(days);

  return (
    <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-3">
      <section className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-good/10 px-3 py-2">
          <p className="text-title font-semibold text-good">{fillTeam(tt.streak, { n: streak })}</p>
          <p className="text-caption text-slate-400">{fillTeam(tt.week, { n: week })}</p>
        </div>
        <div className="rounded-xl border border-line px-3 py-2">
          <p className="text-caption text-slate-400">{tt.schedule}</p>
          <p className="text-note text-ink">{team.schedule ? scheduleText(team.schedule, locale) : tt.scheduleNone}</p>
          {!editingSchedule ? (
            <button type="button" onClick={() => setEditingSchedule(true)} className="mt-1 text-caption text-violet-200">
              {tt.scheduleEdit}
            </button>
          ) : null}
        </div>
      </section>
      {editingSchedule ? (
        <ScheduleEditor
          tt={tt}
          locale={locale}
          initial={team.schedule ?? null}
          onCancel={() => setEditingSchedule(false)}
          onSave={(schedule) => {
            setEditingSchedule(false);
            void teamSchedule(group.id, schedule).then((body) => onGroup(body.group), () => {});
          }}
        />
      ) : null}
      <button type="button" onClick={onGather} className="w-full rounded-xl border border-good/40 px-3 py-2 text-sm font-medium text-good">
        {tt.gatherNow}
      </button>

      <section className="rounded-xl border border-line px-3 py-2">
        <p className="text-caption text-slate-400">🎯 {tt.goal}</p>
        {editingGoal ? (
          <div className="mt-1 flex gap-2">
            <input
              value={goalDraft}
              onChange={(event) => setGoalDraft(event.target.value)}
              maxLength={80}
              dir="auto"
              autoFocus
              className="min-w-0 flex-1 rounded-lg border border-line bg-surface-sunk px-2 py-1.5 text-body text-ink"
            />
            <button
              type="button"
              onClick={() => {
                setEditingGoal(false);
                void teamGoal(group.id, goalDraft).then((body) => onGroup(body.group), () => {});
              }}
              className="rounded-lg bg-violet-500 px-3 py-1.5 text-caption font-medium text-white"
            >
              {tt.save}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setGoalDraft(team.goal ?? "");
              setEditingGoal(true);
            }}
            className="mt-0.5 w-full text-start"
          >
            {team.goal ? (
              <span className="text-chat text-ink" dir="auto">
                {team.goal}
              </span>
            ) : (
              <span className="text-note text-slate-500">{tt.goalEmpty}</span>
            )}
          </button>
        )}
      </section>

      <section className="space-y-2">
        <div className="flex items-center gap-1.5">
          {(
            [
              ["all", tt.viewAll],
              ["phrase", tt.viewPhrases],
              ["session", tt.viewSessions],
              ["share", tt.viewShares],
            ] as const
          ).map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              aria-pressed={view === mode}
              onClick={() => pick(mode)}
              className={`rounded-lg px-2.5 py-1 text-caption ${view === mode ? "bg-white/15 text-ink" : "text-slate-400"}`}
            >
              {label}
            </button>
          ))}
          <button type="button" onClick={() => setSharing(true)} className="ms-auto rounded-lg bg-violet-500 px-2.5 py-1 text-caption font-medium text-white">
            {tt.share}
          </button>
        </div>
        {sharing ? (
          <ShareForm
            tt={tt}
            groupId={group.id}
            targetLanguage={targetLanguage}
            onCancel={() => setSharing(false)}
            onShared={(item) => {
              setSharing(false);
              setItems((have) => [item, ...(have ?? [])]);
              load();
            }}
          />
        ) : null}
        {items === null ? null : shown.length === 0 ? (
          <p className="text-note text-slate-500">{tt.spaceEmpty}</p>
        ) : (
          <ul className="space-y-2">
            {shown.map((item) => (
              <ItemCard
                key={item.id}
                tt={tt}
                me={me}
                item={item}
                locale={locale}
                onRemove={() => {
                  setItems((have) => (have ?? []).filter((row) => row.id !== item.id));
                  void teamUnshare(group.id, item.id).catch(() => load());
                }}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
