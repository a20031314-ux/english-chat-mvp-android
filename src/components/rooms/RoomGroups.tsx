"use client";

import { enterScene } from "@/lib/notes/sceneShots";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import type { RoomCopy } from "@/lib/rooms/copy";
import {
  RoomApiError,
  groupAnswer,
  groupCreate,
  groupInvite,
  groupKick,
  groupLeave,
  groupUnsend,
  groupMakeTeam,
  groupMine,
  groupOpen,
  groupPoll,
  groupSend,
  groupTransfer,
  myRelations,
  translateLine, aiFailText } from "@/lib/rooms/client";
import { GROUP_MAX_MEMBERS, GROUP_MAX_NAME_CHARS, groupSeen, type Group, type GroupCall, type GroupMessage, type GroupSummary } from "@/lib/rooms/group";
import { requestDm, requestGroupCall } from "@/lib/rooms/openDm";
import { askPhraseAbout, questionCount } from "@/lib/rooms/quote";
import { isLearningLanguageCode } from "@/lib/learningLanguages";
import { Composer, Face, LineActions, MyLinePolish, ProfileSheet, QuoteText, Unsendable, languagePair, useProfile } from "./RoomParts";
import { MediaImage } from "./MediaImage";
import { IconImage } from "./IconPacks";
import { teamCopy, type TeamCopy } from "@/lib/rooms/teamCopy";
import { TeamSpace } from "./TeamSpace";

/**
 * 단체방(워크스페이스 1단계): 메시지 탭의 목록·만들기와 대화 화면.
 * 초대로만 들어오고(최대 20명), 줄은 1:1 메시지처럼 번역·묻기·답하기.
 */

export function useGroups(enabled: boolean, everyMs = 8_000): { groups: GroupSummary[]; unread: number; refresh: () => void } {
  const [groups, setGroups] = useState<GroupSummary[]>([]);
  const refresh = useCallback(() => {
    void groupMine()
      .then((body) => setGroups(body.groups))
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (!enabled) return;
    refresh();
    const timer = window.setInterval(refresh, everyMs);
    return () => window.clearInterval(timer);
  }, [enabled, refresh, everyMs]);
  const unread = groups.reduce((sum, row) => sum + (row.invite || row.unread > 0 ? 1 : 0), 0);
  return { groups, unread, refresh };
}

/** 사진이 없을 때 첫 글자가 보이게 이름도 같이(빈 이름이면 "?"). */
function PersonFace({ id, size }: { id: string; size: number }) {
  const profile = useProfile(id);
  return <Face accountId={id} name={profile?.nickname || ""} size={size} />;
}

function Name({ id }: { id: string }) {
  const profile = useProfile(id);
  return <>{profile?.nickname || "…"}</>;
}

/** 러닝메이트는 이름 대신 상대 이름, 팀·단체방은 방 이름. */
export function GroupTitle({ group, me }: { group: Group; me: string }) {
  const other = group.team?.kind === "mate" ? [...group.members, ...group.invited].find((id) => id !== me) ?? null : null;
  const profile = useProfile(other);
  return <>{other ? profile?.nickname || "…" : group.name}</>;
}

export function groupIcon(group: Group): string {
  return group.team ? "🤝" : "👥";
}

export function GroupList({
  t,
  me,
  locale,
  groups,
  onOpen,
  onCreate,
  onChanged,
}: {
  t: RoomCopy;
  me: string;
  locale: string;
  groups: GroupSummary[];
  onOpen: (groupId: string) => void;
  onCreate: () => void;
  onChanged: () => void;
}) {
  const [busy, setBusy] = useState("");
  // ⋯를 누른 단체방: 그 줄 끝에 [나가기][취소](2026-10-23, 목록에서 바로 지우기).
  const [confirming, setConfirming] = useState<string | null>(null);
  const tt = teamCopy(locale);
  const leave = async (groupId: string) => {
    setBusy(groupId);
    try {
      await groupLeave(groupId);
      onChanged();
    } catch {
      // 다음 새로고침에서 다시.
    } finally {
      setBusy("");
      setConfirming(null);
    }
  };
  const answer = async (groupId: string, accept: boolean) => {
    setBusy(groupId);
    try {
      await groupAnswer(groupId, accept);
      onChanged();
      if (accept) onOpen(groupId);
    } catch {
      // 다음 새로고침에서 다시.
    } finally {
      setBusy("");
    }
  };
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300">👥 {t.groupsTitle}</h3>
        <button type="button" onClick={onCreate} className="rounded-lg bg-violet-500 px-2.5 py-1 text-xs font-medium text-white">
          + {t.newGroup}
        </button>
      </div>
      {groups.length === 0 ? <p className="text-xs text-slate-500">{t.groupNone}</p> : null}
      <ul className="space-y-2">
        {groups.map(({ group, unread, invite }) => (
          <li key={group.id}>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
              <button type="button" disabled={invite} onClick={() => onOpen(group.id)} className="flex min-w-0 flex-1 items-center gap-3 text-start">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-500/25 text-lg">{groupIcon(group)}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-chat font-semibold text-white" dir="auto">
                    <GroupTitle group={group} me={me} />
                    {group.team ? <span className="ms-1.5 rounded-lg bg-violet-500/25 px-1.5 text-meta font-normal text-violet-100">{group.team.kind === "mate" ? tt.mate : tt.team}</span> : null}
                  </span>
                  <span className="block truncate text-note text-slate-400" dir="auto">
                    {invite ? (
                      <span className="text-amber-200">{group.team?.kind === "mate" ? tt.mateInvite : `✉️ ${t.groupInviteFrom}`}</span>
                    ) : (
                      <>
                        {languagePair(group.languages, locale)}
                        {group.languages.length ? " · " : ""}
                        {t.groupMembers.replace("{n}", String(group.members.length))}
                        {group.lastText ? ` · ${group.lastText === "📷" ? `📷 ${t.photoLabel}` : group.lastText}` : ""}
                      </>
                    )}
                  </span>
                </span>
              </button>
              {invite ? (
                <span className="flex shrink-0 gap-1.5">
                  <button
                    type="button"
                    disabled={busy === group.id}
                    onClick={() => void answer(group.id, true)}
                    className="rounded-lg bg-violet-500 px-2.5 py-1 text-xs font-medium text-white disabled:opacity-40"
                  >
                    {group.team?.kind === "mate" ? tt.accept : t.groupJoin}
                  </button>
                  <button
                    type="button"
                    disabled={busy === group.id}
                    onClick={() => void answer(group.id, false)}
                    className="rounded-lg border border-white/20 px-2.5 py-1 text-xs text-slate-200 disabled:opacity-40"
                  >
                    {t.declineRequest}
                  </button>
                </span>
              ) : confirming === group.id ? (
                <span className="flex shrink-0 flex-col gap-1">
                  <button
                    type="button"
                    disabled={busy === group.id}
                    onClick={() => void leave(group.id)}
                    className="rounded-lg bg-rose-500/80 px-2.5 py-1 text-xs font-medium text-white disabled:opacity-40"
                  >
                    {t.groupLeave}
                  </button>
                  <button type="button" onClick={() => setConfirming(null)} className="rounded-lg px-2.5 py-1 text-xs text-slate-300">
                    {t.cancel}
                  </button>
                </span>
              ) : (
                <span className="flex shrink-0 items-center gap-1">
                  {unread > 0 ? (
                    <span className="rounded-full bg-violet-500 px-2 py-0.5 text-xs font-semibold text-white">{Math.min(unread, 99)}</span>
                  ) : null}
                  <button
                    type="button"
                    aria-label={t.groupLeave}
                    title={t.groupLeave}
                    onClick={() => setConfirming(group.id)}
                    className="rounded-lg px-2 py-2 text-lg leading-none text-slate-500 hover:bg-white/10"
                  >
                    ⋯
                  </button>
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** 팔로우한 사람 중에서 고르기(이미 있는 사람은 뺀다). */
function FollowingPicker({
  t,
  exclude,
  picked,
  onToggle,
}: {
  t: RoomCopy;
  exclude: string[];
  picked: string[];
  onToggle: (id: string) => void;
}) {
  const [following, setFollowing] = useState<string[] | null>(null);
  useEffect(() => {
    void myRelations()
      .then((body) => setFollowing(body.following))
      .catch(() => setFollowing([]));
  }, []);
  const candidates = (following ?? []).filter((id) => !exclude.includes(id));
  if (following !== null && candidates.length === 0) return <p className="text-xs text-slate-500">{t.groupNoFollowing}</p>;
  return (
    <ul className="max-h-60 space-y-1 overflow-y-auto">
      {candidates.map((id) => (
        <li key={id}>
          <button
            type="button"
            aria-pressed={picked.includes(id)}
            onClick={() => onToggle(id)}
            className={`flex w-full items-center gap-2 rounded-xl border px-2.5 py-1.5 text-start text-sm ${
              picked.includes(id) ? "border-violet-300/60 bg-violet-500/20 text-white" : "border-white/10 text-slate-200"
            }`}
          >
            <PersonFace id={id} size={28} />
            <span className="min-w-0 flex-1 truncate" dir="auto">
              <Name id={id} />
            </span>
            <span aria-hidden>{picked.includes(id) ? "✓" : "+"}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export function GroupCreateSheet({
  t,
  locale,
  targetLanguage,
  me,
  onClose,
  onCreated,
}: {
  t: RoomCopy;
  locale: string;
  targetLanguage: string;
  me: string;
  onClose: () => void;
  onCreated: (groupId: string) => void;
}) {
  const [name, setName] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const languages = [targetLanguage, locale].filter((code, index, all) => isLearningLanguageCode(code) && all.indexOf(code) === index);
  const create = async () => {
    if (!name.trim() || busy) return;
    setBusy(true);
    try {
      const body = await groupCreate(name.trim(), languages, picked);
      onCreated(body.group.id);
    } catch {
      setError(t.error);
      setBusy(false);
    }
  };
  return (
    <BodyLayer>
      <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60" onClick={onClose}>
        <div
          className="w-full max-w-md space-y-3 rounded-t-2xl border border-white/10 bg-surface p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]"
          onClick={(event) => event.stopPropagation()}
        >
          <p className="text-sm font-semibold text-white">👥 {t.newGroup}</p>
          <input
            value={name}
            maxLength={GROUP_MAX_NAME_CHARS}
            onChange={(event) => setName(event.target.value)}
            placeholder={t.groupName}
            dir="auto"
            className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-white outline-none focus:border-white/40"
          />
          <p className="text-xs text-slate-400">
            {languagePair(languages, locale)} · {t.groupInvitePick} ({picked.length}/{GROUP_MAX_MEMBERS - 1})
          </p>
          <FollowingPicker
            t={t}
            exclude={[me]}
            picked={picked}
            onToggle={(id) =>
              setPicked((have) => (have.includes(id) ? have.filter((row) => row !== id) : have.length < GROUP_MAX_MEMBERS - 1 ? [...have, id] : have))
            }
          />
          {error ? <p className="text-xs text-rose-300">{error}</p> : null}
          <button
            type="button"
            disabled={!name.trim() || busy}
            onClick={() => void create()}
            className="w-full rounded-xl bg-violet-500 px-3 py-2.5 font-medium text-white disabled:opacity-40"
          >
            {t.create}
          </button>
          <button type="button" onClick={onClose} className="w-full rounded-xl px-3 py-2 text-sm text-slate-400">
            {t.cancel}
          </button>
        </div>
      </div>
    </BodyLayer>
  );
}

function systemText(t: RoomCopy, message: GroupMessage, name: string, tt?: TeamCopy): string {
  if (message.text === "team" && tt) return `🤝 ${tt.teamMade}`;
  const template =
    message.text === "join"
      ? t.sysJoin
      : message.text === "leave"
        ? t.sysLeave
        : message.text === "kick"
          ? t.sysKick
          : message.text === "call"
            ? `📞 ${t.sysCall}`
            : t.sysHost;
  return template.replace("{name}", name);
}

function SystemLine({ t, tt, message, liveCall, onJoin }: { t: RoomCopy; tt: TeamCopy; message: GroupMessage; liveCall: boolean; onJoin: () => void }) {
  const profile = useProfile(message.from);
  return (
    <p className={`text-center text-meta ${message.text === "call" ? "text-emerald-200" : message.text === "team" ? "text-violet-200" : "text-slate-500"}`} dir="auto">
      {systemText(t, message, profile?.nickname || "…", tt)}
      {liveCall ? (
        <button type="button" onClick={onJoin} className="ms-2 rounded-lg bg-emerald-500 px-2 py-0.5 text-meta font-medium text-black">
          {t.callRejoin}
        </button>
      ) : null}
    </p>
  );
}

/** 끝난 통화의 자막 기록: 접어 두고, 펼치면 줄마다 눌러 번역. */
function CallLogLine({
  t,
  me,
  message,
  locale,
  targetLanguage,
}: {
  t: RoomCopy;
  me: string;
  message: GroupMessage;
  locale: string;
  targetLanguage: string;
}) {
  const [open, setOpen] = useState(false);
  const [translated, setTranslated] = useState<Record<number, string>>({});
  const lines = message.lines ?? [];
  const time = new Date(message.at).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2.5">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center gap-2 text-start text-sm text-slate-200">
        <span>🗒 {t.callEnded}</span>
        <span className="text-meta text-slate-500">
          {lines.length} {t.callLines} · {time}
        </span>
        <span className="ms-auto text-xs text-slate-500">{open ? "▲" : "▼"}</span>
      </button>
      {open ? (
        <ul className="mt-2 space-y-1.5">
          {lines.map((line, index) => (
            <li key={index}>
              <button
                type="button"
                onClick={() => {
                  if (index in translated) return;
                  setTranslated((have) => ({ ...have, [index]: t.translating }));
                  void translateLine({
                    text: line.text,
                    context: lines.slice(Math.max(0, index - 4), index).map((row) => `${row.nickname}: ${row.text}`),
                    locale,
                    targetLanguage,
                  }).then(
                    (value) => setTranslated((have) => ({ ...have, [index]: value || t.translateFailed })),
                    (error: unknown) => setTranslated((have) => ({ ...have, [index]: aiFailText(t, error) })),
                  );
                }}
                className="w-full rounded-lg px-2 py-1 text-start hover:bg-white/5"
              >
                <span className={`me-1 text-meta ${line.from === me ? "text-violet-300" : "text-sky-300"}`} dir="auto">
                  {line.nickname}
                </span>
                <span className="text-sm text-slate-100" dir="auto">
                  {line.text}
                </span>
                {index in translated ? (
                  <span className="mt-0.5 block text-xs text-slate-400" dir="auto">
                    {translated[index]}
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function GroupBubble({
  t,
  me,
  message,
  locale,
  targetLanguage,
  context,
  asked,
  onQuote,
  seenBy = 0,
  onProfile,
}: {
  t: RoomCopy;
  me: string;
  message: GroupMessage;
  /** 남의 줄 얼굴을 누르면 그 사람 프로필. */
  onProfile?: (accountId: string) => void;
  /** 내 마지막 줄이면 그 줄까지 읽은 사람 수 — 시간 앞에 "n명 읽음". */
  seenBy?: number;
  locale: string;
  targetLanguage: string;
  context: string[];
  asked: number;
  onQuote: (ask: boolean, focus: string | undefined, nickname: string) => void;
}) {
  const mine = message.from === me;
  const profile = useProfile(message.from);
  const quoted = useProfile(message.quote?.accountId ?? null);
  const name = profile?.nickname || "…";
  const [open, setOpen] = useState(false);
  const [translation, setTranslation] = useState<string | null>(null);
  const toggle = () => {
    setOpen((value) => !value);
    // 내 줄은 다듬은 문장(MyLinePolish, 열 때 한 번) — 1:1과 같다.
    if (mine) return;
    if (translation === null) {
      void translateLine({ text: message.text, context, locale, targetLanguage }).then(
        (value) => setTranslation(value || t.translateFailed),
        (error: unknown) => setTranslation(aiFailText(t, error)),
      );
    }
  };
  const time = new Date(message.at).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  return (
    <div className={`flex gap-2 ${mine ? "justify-end" : "justify-start"}`}>
      {mine ? null : (
        <button type="button" onClick={() => onProfile?.(message.from)} aria-label={name} className="shrink-0 self-start rounded-full">
          <Face accountId={message.from} name={name} size={30} />
        </button>
      )}
      <div className="max-w-[78%]">
        {mine ? null : (
          <p className="mb-0.5 px-1 text-meta text-slate-400" dir="auto">
            {name}
          </p>
        )}
        {!mine && message.ask && message.quote?.accountId === me ? (
          <p className="mb-0.5 px-1 text-meta text-amber-200" dir="auto">
            {t.askedYou.replace("{name}", name)}
          </p>
        ) : null}
        {message.icon ? (
          <div className={`mb-1 flex ${mine ? "justify-end" : ""}`}>
            <IconImage icon={message.icon} />
          </div>
        ) : null}
        {message.image ? (
          <div className={`mb-1 flex ${mine ? "justify-end" : ""}`}>
            <MediaImage image={message.image} t={t} />
          </div>
        ) : null}
        {message.text || message.quote ? (
        <button
          type="button"
          onClick={toggle}
          className={`block w-full rounded-2xl px-3 py-2 text-start text-chat leading-snug text-white ${
            mine ? "rounded-br-md bg-violet-600/80" : "rounded-bl-md bg-white/[0.08]"
          } ${!mine && message.ask && message.quote?.accountId === me ? "ring-1 ring-amber-300/60" : ""}`}
        >
          {message.quote ? (
            <span className="mb-1 block border-s-2 border-white/30 ps-2 text-xs text-slate-300/80">
              ↪ <bdi>{message.quote.accountId === me ? t.you : quoted?.nickname || "…"}</bdi>: <bdi><QuoteText text={message.quote.text} focus={message.quote.focus} /></bdi>
            </span>
          ) : null}
          {/* 인용 머리(이름)가 아랍어면 말풍선 전체가 오른쪽→왼쪽으로 잡혀 학습 언어 문장부호가 뒤집혔다(점검 10-23) — 본문은 따로 방향을 잡는다. */}
          <span className="block" dir="auto">
            {message.text}
          </span>
        </button>
        ) : null}
        {open && mine && message.text ? (
          <MyLinePolish t={t} text={message.text} context={context} locale={locale} targetLanguage={targetLanguage} />
        ) : null}
        {open && !mine ? (
          <p className="mt-1 px-1 text-note text-slate-300" dir="auto">
            {translation ?? t.translating}
          </p>
        ) : null}
        {open && !mine ? (
          <LineActions
            t={t}
            text={message.text}
            onAsk={(focus) => onQuote(true, focus, name)}
            onReply={(focus) => onQuote(false, focus, name)}
            study={{ locale, targetLanguage }}
          />
        ) : null}
        <p className={`mt-0.5 px-1 text-meta text-slate-600 ${mine ? "text-end" : ""}`}>
          {mine && seenBy > 0 ? <span className="text-sky-300/80">{t.seenBy.replace("{n}", String(seenBy))} · </span> : null}
          {time}
          {asked > 0 ? ` · ❓ ${asked}` : ""}
        </p>
      </div>
    </div>
  );
}

function MembersSheet({
  t,
  tt,
  me,
  group,
  onClose,
  onChanged,
  onLeft,
  onProfile,
}: {
  t: RoomCopy;
  tt: TeamCopy;
  me: string;
  group: Group;
  onClose: () => void;
  onChanged: () => void;
  onLeft: () => void;
  /** 다른 멤버를 누르면 그 사람 프로필(멤버 목록은 닫힘). */
  onProfile: (accountId: string) => void;
}) {
  const [inviting, setInviting] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const owner = group.owner === me;
  const act = async (work: () => Promise<unknown>) => {
    try {
      await work();
      onChanged();
    } catch (error) {
      setNotice(error instanceof RoomApiError && error.code === "FULL" ? `${GROUP_MAX_MEMBERS}/${GROUP_MAX_MEMBERS}` : t.error);
    }
  };
  return (
    <BodyLayer>
      <div className="fixed inset-0 z-[96] flex items-end justify-center bg-black/60" onClick={onClose}>
        <div
          className="max-h-[85dvh] w-full max-w-md space-y-3 overflow-y-auto rounded-t-2xl border border-white/10 bg-surface p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]"
          onClick={(event) => event.stopPropagation()}
        >
          <p className="text-sm font-semibold text-white">
            👥 {t.groupMembers.replace("{n}", String(group.members.length))}
          </p>
          <ul className="space-y-1.5">
            {group.members.map((id) => (
              <li key={id} className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={id === me}
                  onClick={() => onProfile(id)}
                  className="flex min-w-0 flex-1 items-center gap-2 rounded-lg text-start enabled:hover:bg-white/5"
                >
                  <PersonFace id={id} size={30} />
                  <span className="min-w-0 flex-1 truncate text-sm text-white" dir="auto">
                    {id === group.owner ? "👑 " : ""}
                    {id === me ? t.you : <Name id={id} />}
                  </span>
                </button>
                {owner && id !== me ? (
                  <>
                    <button type="button" onClick={() => void act(() => groupTransfer(group.id, id))} className="rounded-lg border border-amber-300/40 px-2 py-0.5 text-xs text-amber-200">
                      👑 {t.transferHost}
                    </button>
                    <button type="button" onClick={() => void act(() => groupKick(group.id, id))} className="rounded-lg bg-rose-500/70 px-2 py-0.5 text-xs text-white">
                      {t.kick}
                    </button>
                  </>
                ) : null}
              </li>
            ))}
            {group.invited.map((id) => (
              <li key={id} className="flex items-center gap-2 opacity-60">
                <PersonFace id={id} size={30} />
                <span className="min-w-0 flex-1 truncate text-sm text-slate-300" dir="auto">
                  <Name id={id} /> · ✉️
                </span>
              </li>
            ))}
          </ul>
          {inviting ? (
            <>
              <FollowingPicker
                t={t}
                exclude={[...group.members, ...group.invited]}
                picked={picked}
                onToggle={(id) => setPicked((have) => (have.includes(id) ? have.filter((row) => row !== id) : [...have, id]))}
              />
              <button
                type="button"
                disabled={!picked.length}
                onClick={() =>
                  void act(async () => {
                    for (const id of picked) await groupInvite(group.id, id);
                    setPicked([]);
                    setInviting(false);
                  })
                }
                className="w-full rounded-xl bg-violet-500 px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
              >
                {t.groupInviteMore} ({picked.length})
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setInviting(true)} className="w-full rounded-xl border border-violet-300/40 px-3 py-2 text-sm text-violet-100">
              + {t.groupInviteMore}
            </button>
          )}
          {owner && !group.team ? (
            <div className="space-y-1 rounded-xl border border-violet-300/30 p-2.5">
              <button
                type="button"
                onClick={() => void act(() => groupMakeTeam(group.id))}
                className="w-full rounded-lg bg-violet-500 px-3 py-2 text-sm font-medium text-white"
              >
                🤝 {tt.makeTeam}
              </button>
            </div>
          ) : null}
          {notice ? <p className="text-xs text-rose-300">{notice}</p> : null}
          <button
            type="button"
            onClick={() => void groupLeave(group.id).then(onLeft, () => setNotice(t.error))}
            className="w-full rounded-xl bg-rose-500/80 px-3 py-2 text-sm text-white"
          >
            {t.groupLeave}
          </button>
          <button type="button" onClick={onClose} className="w-full rounded-xl px-3 py-2 text-sm text-slate-400">
            {t.close2}
          </button>
        </div>
      </div>
    </BodyLayer>
  );
}

export function GroupThreadView({
  t,
  me,
  groupId,
  locale,
  targetLanguage,
  onClose,
}: {
  t: RoomCopy;
  me: string;
  groupId: string;
  locale: string;
  targetLanguage: string;
  onClose: () => void;
}) {
  // "My에서 찾기"가 화면을 찍어도 되는 곳인지(lib/notes/sceneShots.ts — 사람끼리 대화는 안 찍음).
  useEffect(() => enterScene("dm"), []);
  const [group, setGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [members, setMembers] = useState(false);
  const [quoting, setQuoting] = useState<{ seq: number; nickname: string; text: string; ask: boolean; focus?: string } | null>(null);
  // 내보내졌거나(removed) 방이 없어졌으면(gone) 입력을 막고 안내.
  const [gone, setGone] = useState<"" | "removed" | "gone">("");
  const [call, setCall] = useState<GroupCall>(null);
  // 다른 사람들이 읽은 줄 번호(서버 reads, 2.76~) — 내 마지막 줄 아래 "n명 읽음".
  const [reads, setReads] = useState<number[]>([]);
  // 얼굴·멤버를 누르면 그 사람 프로필(사람 탭·게시판·Room과 같은 시트).
  const [profileOf, setProfileOf] = useState<string | null>(null);
  // 팀·메이트면 대화 / 워크스페이스 전환.
  const [pane, setPane] = useState<"chat" | "space">("chat");
  const tt = teamCopy(locale);
  const since = useRef(0);
  const scroller = useRef<HTMLDivElement>(null);

  const add = useCallback((incoming: GroupMessage[]) => {
    if (!incoming.length) return;
    since.current = Math.max(since.current, ...incoming.map((row) => row.seq));
    setMessages((have) => {
      const known = new Set(have.map((row) => row.seq));
      return [...have, ...incoming.filter((row) => !known.has(row.seq))].sort((a, b) => a.seq - b.seq);
    });
  }, []);

  // 모두에게서 지운 줄(내가 지웠거나 다른 사람이 지움)을 화면에서 뺀다.
  const drop = useCallback((goneSeqs: number[] | undefined) => {
    if (!goneSeqs?.length) return;
    const set = new Set(goneSeqs);
    setMessages((have) => (have.some((row) => set.has(row.seq)) ? have.filter((row) => !set.has(row.seq)) : have));
  }, []);
  const unsendRow = async (seq: number) => {
    try {
      await groupUnsend(groupId, seq);
      drop([seq]);
    } catch {
      // 다음 새로고침에서 다시.
    }
  };

  const reload = useCallback(() => {
    void groupOpen(groupId).then(
      (body) => {
        setGroup(body.group);
        add(body.messages);
      },
      (error) => setGone(error instanceof RoomApiError && error.code === "REMOVED" ? "removed" : "gone"),
    );
  }, [groupId, add]);

  useEffect(() => {
    let alive = true;
    let timer = 0;
    const tick = async () => {
      try {
        const body = since.current === 0 ? await groupOpen(groupId) : await groupPoll(groupId, since.current);
        if (!alive) return;
        setGroup(body.group);
        setCall(body.call ?? null);
        add(body.messages);
        drop(body.gone);
        if (Array.isArray(body.reads)) setReads(body.reads);
      } catch (error) {
        if (error instanceof RoomApiError && (error.status === 403 || error.status === 404)) {
          if (alive) setGone(error.code === "REMOVED" ? "removed" : "gone");
          return;
        }
      }
      if (alive) timer = window.setTimeout(() => void tick(), 3_000);
    };
    void tick();
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [groupId, add]);

  useEffect(() => {
    const node = scroller.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages.length]);

  const texts = useMemo(() => messages.filter((row) => row.kind === "text"), [messages]);
  const seen = useMemo(() => groupSeen(messages, me, reads), [messages, me, reads]);
  // 📞: 말하는 방 화면(RoomsScreen)이 통화 방을 연다. 대화는 닫았다가 통화가 끝나면 다시 열린다.
  const startCall = () => {
    if (!group || gone) return;
    requestGroupCall(group.id, group.name || tt.mate);
    onClose();
  };
  const contextFor = (seq: number) => texts.filter((row) => row.seq < seq).slice(-4).map((row) => row.text);

  return (
    <BodyLayer>
      <div className="fixed inset-0 z-[95] flex flex-col bg-surface-sunk">
        <div className="mx-auto flex h-[100dvh] w-full max-w-2xl flex-col pt-[env(safe-area-inset-top)]">
          <header className="flex shrink-0 items-center gap-3 border-b border-white/10 px-3 py-2.5">
            <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-sm text-slate-300 hover:bg-white/10">
              ← {t.back}
            </button>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/25">{group ? groupIcon(group) : "👥"}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-chat font-semibold text-white" dir="auto">
                {group ? <GroupTitle group={group} me={me} /> : ""}
              </p>
              <p className="truncate text-meta text-slate-400">
                {group?.team ? `${group.team.kind === "mate" ? tt.mate : tt.team}${group.languages.length ? " · " : ""}` : ""}
                {group ? languagePair(group.languages, locale) : ""}
              </p>
            </div>
            <button
              type="button"
              disabled={!group || Boolean(gone)}
              onClick={startCall}
              aria-label={t.call}
              className={`shrink-0 rounded-xl px-3 py-1.5 text-sm font-medium disabled:opacity-40 ${
                call && call.live > 0 ? "bg-emerald-500 text-black" : "border border-white/15 text-slate-200"
              }`}
            >
              📞
            </button>
            <button
              type="button"
              disabled={!group}
              onClick={() => setMembers(true)}
              className="shrink-0 rounded-xl border border-white/15 px-3 py-1.5 text-sm text-slate-200"
            >
              👥 {group?.members.length ?? ""}
            </button>
          </header>

          {group?.team && !gone ? (
            <div className="flex shrink-0 gap-1 border-b border-white/10 px-3 py-1.5" role="tablist">
              {(
                [
                  ["chat", tt.tabChat],
                  ["space", tt.tabSpace],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={pane === id}
                  onClick={() => setPane(id)}
                  className={`flex-1 rounded-lg px-3 py-1.5 text-sm ${pane === id ? "bg-white/15 font-semibold text-ink" : "text-slate-400"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}

          {group?.team && pane === "space" && !gone ? (
            <TeamSpace tt={tt} me={me} group={group} locale={locale} targetLanguage={targetLanguage} onGroup={setGroup} onGather={startCall} />
          ) : (
          <>
          {gone ? (
            <p className="shrink-0 bg-amber-400/10 px-4 py-2 text-sm text-amber-200" dir="auto">
              {gone === "removed" ? t.groupRemoved : t.groupGone}
            </p>
          ) : call && call.live > 0 ? (
            <button type="button" onClick={startCall} className="shrink-0 bg-emerald-400/10 px-4 py-2 text-start text-sm text-emerald-100">
              🎙 {t.groupCallLive.replace("{n}", String(call.live))} · {t.callRejoin}
            </button>
          ) : null}

          <div ref={scroller} className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3">
            {messages.map((message) =>
              message.kind === "system" ? (
                <SystemLine
                  key={message.seq}
                  t={t}
                  tt={tt}
                  message={message}
                  liveCall={message.text === "call" && Boolean(call && call.live > 0 && call.roomId === message.roomId) && !gone}
                  onJoin={startCall}
                />
              ) : message.kind === "callLog" ? (
                <Unsendable
                  key={message.seq}
                  t={t}
                  enabled={message.from === me || group?.owner === me}
                  align="center"
                  onDelete={() => unsendRow(message.seq)}
                >
                  <CallLogLine t={t} me={me} message={message} locale={locale} targetLanguage={targetLanguage} />
                </Unsendable>
              ) : (
                <Unsendable
                  key={message.seq}
                  t={t}
                  enabled={message.from === me}
                  align="end"
                  onDelete={() => unsendRow(message.seq)}
                >
                <GroupBubble
                  t={t}
                  me={me}
                  onProfile={setProfileOf}
                  seenBy={message.seq === seen.seq ? seen.count : 0}
                  message={message}
                  locale={locale}
                  targetLanguage={targetLanguage}
                  context={contextFor(message.seq)}
                  asked={questionCount(texts, message.seq)}
                  onQuote={(ask, focus, nickname) => setQuoting({ seq: message.seq, nickname, text: message.text, ask, focus })}
                />
                </Unsendable>
              ),
            )}
          </div>

          <footer className="shrink-0 space-y-2 border-t border-white/10 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2">
            <Composer
              key={quoting ? `q${quoting.seq}${quoting.ask ? "a" : "r"}${quoting.focus ?? ""}` : "plain"}
              quote={quoting ? { nickname: quoting.nickname, text: quoting.text, ask: quoting.ask, focus: quoting.focus } : null}
              onClearQuote={() => setQuoting(null)}
              initialText={quoting?.ask ? askPhraseAbout(targetLanguage, quoting.focus) : ""}
              t={t}
              placeholder={t.messagePlaceholder}
              disabled={!group || Boolean(gone)}
              locale={locale}
              targetLanguage={targetLanguage}
              recent={() => texts.slice(-6).map((row) => row.text)}
              attach={{ kind: "group", id: groupId }}
              onSend={async (text, image) => {
                const body = await groupSend(groupId, text, quoting ? { seq: quoting.seq, ask: quoting.ask, focus: quoting.focus } : undefined, image?.id);
                setGroup(body.group);
                add([body.message]);
                setQuoting(null);
              }}
              onSendIcon={async (icon) => {
                const body = await groupSend(groupId, "", undefined, undefined, icon);
                setGroup(body.group);
                add([body.message]);
              }}
            />
          </footer>
          </>
          )}
        </div>
      </div>
      {members && group ? (
        <MembersSheet
          t={t}
          tt={tt}
          me={me}
          group={group}
          onClose={() => setMembers(false)}
          onChanged={reload}
          onLeft={() => {
            setMembers(false);
            onClose();
          }}
          onProfile={(id) => {
            setMembers(false);
            setProfileOf(id);
          }}
        />
      ) : null}
      {profileOf ? (
        <ProfileSheet
          t={t}
          locale={locale}
          member={null}
          accountId={profileOf}
          nickname=""
          above
          isHostView={false}
          roomId=""
          recentLines={texts.filter((row) => row.from === profileOf).slice(-3).map((row) => row.text)}
          onClose={() => setProfileOf(null)}
          onGrant={() => {}}
          onBlockedChange={() => setProfileOf(null)}
          onMessage={(id) => {
            setProfileOf(null);
            onClose();
            requestDm(id);
          }}
        />
      ) : null}
    </BodyLayer>
  );
}
