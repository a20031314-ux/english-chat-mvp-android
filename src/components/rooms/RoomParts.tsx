"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import type { RoomCopy } from "@/lib/rooms/copy";
import {
  fetchProfile,
  howToSay,
  reportPerson,
  setBlock,
  setFollow,
  translateLine,
} from "@/lib/rooms/client";
import { byPerson, contextBefore, overlapsPrevious, timeline, type RoomLine, type RoomMember } from "@/lib/rooms/protocol";
import type { PublicProfile } from "@/lib/rooms/social";
import type { HowToSayExpression } from "@/lib/howToSay";
import { questionCount } from "@/lib/rooms/quote";
import { peekHint, type RoomHintMode } from "@/lib/rooms/layout";
import { isLearningLanguageCode, learningLanguageUiLabel } from "@/lib/learningLanguages";

/*
 * 말하는 방에서 여러 화면이 함께 쓰는 조각: 얼굴(프로필 사진), 프로필 시트,
 * 댓글 입력, 자막 줄 목록. 사람은 계정(프로필)으로 보이고, 누르면 프로필.
 */

const PEER_COLORS = ["text-sky-300", "text-amber-300", "text-emerald-300", "text-fuchsia-300", "text-rose-300", "text-lime-300", "text-cyan-300", "text-orange-300"];

export function colorFor(key: string): string {
  let hash = 0;
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return PEER_COLORS[hash % PEER_COLORS.length];
}

const BG_COLORS = ["bg-sky-500/30", "bg-amber-500/30", "bg-emerald-500/30", "bg-fuchsia-500/30", "bg-rose-500/30", "bg-lime-500/30", "bg-cyan-500/30", "bg-orange-500/30"];

function bgFor(key: string): string {
  let hash = 0;
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return BG_COLORS[hash % BG_COLORS.length];
}

/* 프로필은 사진 때문에 크다. 한 번 받은 것은 이 실행 동안 같이 쓴다(client.fetchProfile). */
const known = new Map<string, PublicProfile | null>();
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
function emit() {
  for (const listener of listeners) listener();
}

export function loadProfile(id: string, fresh = false): void {
  if (!fresh && known.has(id)) return;
  void fetchProfile(id, fresh).then((profile) => {
    known.set(id, profile);
    emit();
  });
}

export function useProfile(id: string | null): PublicProfile | null {
  useEffect(() => {
    if (id) loadProfile(id);
  }, [id]);
  return useSyncExternalStore(
    subscribe,
    () => (id ? known.get(id) ?? null : null),
    () => null,
  );
}

/** 사진이 있으면 사진, 없으면 첫 글자. 말하는 중이면 초록 테두리. */
export function Face({
  accountId,
  name,
  size,
  speaking = false,
  photo,
}: {
  accountId: string | null;
  name: string;
  size: number;
  speaking?: boolean;
  /** 이미 가진 사진(내 계정 등). 없으면 프로필에서. */
  photo?: string | null;
}) {
  const profile = useProfile(photo === undefined ? accountId : null);
  const src = photo ?? profile?.photo ?? null;
  const letter = Array.from(name || "?")[0]?.toUpperCase() ?? "?";
  const ring = speaking ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#050505]" : "";
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={`shrink-0 rounded-full border border-white/15 object-cover transition ${ring}`}
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full border border-white/15 font-semibold text-white transition ${bgFor(accountId ?? name)} ${ring}`}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {letter}
    </span>
  );
}

/** 언어 조합을 앱 언어로(일본어 ↔ 한국어). */
export function languagePair(codes: string[] | undefined, locale: string): string {
  return (codes ?? []).filter(isLearningLanguageCode).map((code) => learningLanguageUiLabel(code, locale)).join(" ↔ ");
}

/**
 * 사람을 누르면 뜨는 프로필 시트. 사진·닉네임·자기소개·언어·숫자, 팔로우,
 * 차단·신고. 내가 방장이면 그 사람을 올리기/내리기/내보내기.
 */
export function ProfileSheet({
  t,
  locale,
  member,
  accountId,
  nickname,
  isHostView,
  roomId,
  recentLines,
  onClose,
  onGrant,
  onTransfer,
  onBlockedChange,
  onMessage,
}: {
  t: RoomCopy;
  locale: string;
  member: RoomMember | null;
  accountId: string | null;
  nickname: string;
  /** 내가 방장이고 상대가 나·방장이 아님. */
  isHostView: boolean;
  roomId: string;
  recentLines: string[];
  onClose: () => void;
  onGrant: (role: "speaker" | "listener" | "out") => void;
  /** 방장 넘기기(내가 방장이고 그 사람이 말하기 자리에 있을 때만). 한 번 더 눌러 확인. */
  onTransfer?: () => void;
  onBlockedChange: () => void;
  /** 있으면 "메시지" 버튼(1:1 대화 열기). */
  onMessage?: (accountId: string) => void;
}) {
  const profile = useProfile(accountId);
  const [busy, setBusy] = useState(false);
  const [confirmTransfer, setConfirmTransfer] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [notice, setNotice] = useState("");
  const name = profile?.nickname || nickname;

  const refresh = () => {
    if (accountId) loadProfile(accountId, true);
  };

  const toggleFollow = async () => {
    if (!accountId || !profile || busy) return;
    setBusy(true);
    try {
      await setFollow(accountId, !profile.isFollowing);
      refresh();
    } finally {
      setBusy(false);
    }
  };

  const toggleBlock = async () => {
    if (!accountId || !profile || busy) return;
    setBusy(true);
    try {
      await setBlock(accountId, !profile.blockedByMe);
      refresh();
      onBlockedChange();
    } finally {
      setBusy(false);
    }
  };

  const report = async (reason: string) => {
    if (!accountId) return;
    setBusy(true);
    try {
      await reportPerson({ target: accountId, reason, roomId, lines: recentLines });
      setNotice(t.reportSent);
      setReporting(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <BodyLayer>
      <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 p-3 sm:items-center" onClick={onClose}>
        <div
          role="dialog"
          aria-modal="true"
          aria-label={name}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121212] p-4 shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start gap-3">
            <Face accountId={accountId} name={name} size={64} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-semibold text-white" dir="auto">
                {name}
              </p>
              {member?.langs?.length ? (
                <p className="text-xs text-slate-400">
                  {t.languagesOf}: {languagePair(member.langs, locale)}
                </p>
              ) : null}
              {profile ? (
                <p className="text-[11px] text-slate-500">
                  {t.since} {profile.since}
                </p>
              ) : null}
            </div>
            <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-sm text-slate-400 hover:bg-white/10">
              {t.close2}
            </button>
          </div>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-200" dir="auto">
            {profile?.bio || t.noBio}
          </p>
          {profile ? (
            <dl className="mt-3 grid grid-cols-4 gap-1 text-center">
              {(
                [
                  [t.followers, profile.followers],
                  [t.followingCount, profile.following],
                  [t.hosted, profile.hosted],
                  [t.helped, profile.helped],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="rounded-lg bg-white/[0.04] py-1.5">
                  <dd className="text-base font-semibold text-white">{value}</dd>
                  <dt className="text-[10px] text-slate-400">{label}</dt>
                </div>
              ))}
            </dl>
          ) : null}
          {profile?.blockedByMe ? <p className="mt-3 text-xs text-rose-300">{t.blockedNote}</p> : null}
          {notice ? <p className="mt-3 text-xs text-emerald-300">{notice}</p> : null}

          {profile && !profile.isMe ? (
            <div className="mt-3 flex gap-2">
              {!profile.blockedByMe ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void toggleFollow()}
                  className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium disabled:opacity-50 ${
                    profile.isFollowing ? "border border-white/25 text-slate-100" : "bg-violet-500 text-white"
                  }`}
                >
                  {profile.isFollowing ? `✓ ${t.following}` : `+ ${t.follow}`}
                </button>
              ) : null}
              <button
                type="button"
                disabled={busy}
                onClick={() => void toggleBlock()}
                className="rounded-xl border border-white/15 px-3 py-2 text-xs text-slate-300 disabled:opacity-50"
              >
                {profile.blockedByMe ? t.unblock : t.block}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setReporting((value) => !value)}
                className="rounded-xl border border-rose-400/40 px-3 py-2 text-xs text-rose-200 disabled:opacity-50"
              >
                {t.report}
              </button>
            </div>
          ) : null}

          {profile && !profile.isMe && !profile.blockedByMe && onMessage && accountId ? (
            <button
              type="button"
              onClick={() => onMessage(accountId)}
              className="mt-2 w-full rounded-xl border border-violet-400/50 px-3 py-2 text-sm font-medium text-violet-100"
            >
              💬 {t.message}
            </button>
          ) : null}

          {reporting ? (
            <div className="mt-2 space-y-1.5 rounded-xl border border-rose-400/30 p-2">
              <p className="text-xs text-rose-200">{t.reportTitle}</p>
              {t.reportReasons.split("|").map((reason) => (
                <button
                  key={reason}
                  type="button"
                  disabled={busy}
                  onClick={() => void report(reason)}
                  className="block w-full rounded-lg bg-white/[0.04] px-2 py-1.5 text-start text-xs text-slate-200"
                >
                  {reason}
                </button>
              ))}
            </div>
          ) : null}

          {isHostView && member ? (
            <div className="mt-3 flex gap-2 border-t border-white/10 pt-3">
              {member.role === "listener" ? (
                <button type="button" onClick={() => onGrant("speaker")} className="flex-1 rounded-xl bg-amber-300/90 px-3 py-2 text-sm font-medium text-black">
                  {t.promote}
                </button>
              ) : (
                <button type="button" onClick={() => onGrant("listener")} className="flex-1 rounded-xl border border-white/20 px-3 py-2 text-sm text-slate-100">
                  {t.demote}
                </button>
              )}
              <button type="button" onClick={() => onGrant("out")} className="rounded-xl bg-rose-500/80 px-3 py-2 text-sm text-white">
                {t.kick}
              </button>
            </div>
          ) : null}
          {onTransfer ? (
            confirmTransfer ? (
              <button
                type="button"
                onClick={onTransfer}
                className="mt-2 w-full rounded-xl bg-amber-300/90 px-3 py-2 text-sm font-medium text-black"
                dir="auto"
              >
                👑 {t.transferConfirm.replace("{name}", name)}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmTransfer(true)}
                className="mt-2 w-full rounded-xl border border-amber-300/40 px-3 py-2 text-sm text-amber-200"
              >
                👑 {t.transferHost}
              </button>
            )
          ) : null}
        </div>
      </div>
    </BodyLayer>
  );
}

/**
 * 댓글. 말하기 자리가 없어도, 말이 안 나와도 끼는 통로(헬로우톡의 댓글).
 * 편한 말로 쓰고 "학습 언어로"를 누르면 채팅의 표현 보기와 같은 문장이 나오고,
 * 그대로 보내거나 고쳐서 보낸다. 말하기 자리에 있으면 소리 내어 말해 봐도 된다.
 */
export function Composer({
  t,
  disabled,
  locale,
  targetLanguage,
  recent,
  onSend,
  placeholder,
  quote,
  onClearQuote,
  initialText,
}: {
  t: RoomCopy;
  placeholder?: string;
  disabled: boolean;
  locale: string;
  targetLanguage: string;
  recent: () => string[];
  onSend: (text: string) => Promise<void>;
  /** 집은 남의 말(묻기·답하기). 부르는 쪽은 인용이 바뀔 때 key를 바꿔 initialText를 새로 채운다. */
  quote?: { nickname: string; text: string; ask: boolean } | null;
  onClearQuote?: () => void;
  initialText?: string;
}) {
  const [text, setText] = useState(initialText ?? "");
  const [busy, setBusy] = useState(false);
  const [suggestion, setSuggestion] = useState<HowToSayExpression | null>(null);
  const [state, setState] = useState<"" | "loading" | "failed">("");
  const input = useRef<HTMLInputElement>(null);

  const send = async (value: string) => {
    const line = value.trim();
    if (!line || busy) return;
    setBusy(true);
    try {
      await onSend(line);
      setText("");
      setSuggestion(null);
    } catch {
      // 못 보냈으면 글을 그대로 둔다(알림은 부르는 쪽).
    } finally {
      setBusy(false);
    }
  };

  const suggest = async () => {
    const line = text.trim();
    if (!line) return;
    setState("loading");
    setSuggestion(null);
    try {
      const found = await howToSay({ message: line, recent: recent(), locale, targetLanguage });
      setSuggestion(found);
      setState(found ? "" : "failed");
    } catch {
      setState("failed");
    }
  };

  return (
    <div className="space-y-1.5">
      {quote ? (
        <div className="flex items-start gap-2 rounded-xl border-s-2 border-amber-300/70 bg-amber-300/5 px-2.5 py-1.5">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] text-amber-200" dir="auto">
              ↪ {quote.nickname}
            </p>
            <p className="line-clamp-2 text-xs text-slate-300" dir="auto">
              {quote.text}
            </p>
            {quote.ask ? <p className="mt-0.5 text-[10px] text-slate-500">{t.askHint}</p> : null}
          </div>
          <button type="button" onClick={onClearQuote} aria-label={t.quoteCancel} className="shrink-0 rounded px-1.5 text-sm text-slate-400 hover:bg-white/10">
            ×
          </button>
        </div>
      ) : null}
      {state === "loading" ? <p className="text-xs text-slate-400">{t.howToSayLoading}</p> : null}
      {state === "failed" ? <p className="text-xs text-rose-300">{t.howToSayFailed}</p> : null}
      {suggestion ? (
        <div className="rounded-xl border border-emerald-300/30 bg-emerald-300/5 p-2.5">
          <p className="text-[15px] text-white" dir="auto">
            {suggestion.expression}
          </p>
          {suggestion.simpler ? (
            <p className="mt-0.5 text-xs text-slate-300" dir="auto">
              {t.simpler}: {suggestion.simpler}
            </p>
          ) : null}
          <p className="mt-1 text-[11px] text-slate-500">{t.sayIt}</p>
          <div className="mt-1.5 flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void send(suggestion.expression)}
              className="flex-1 rounded-lg bg-emerald-400/90 px-2 py-1.5 text-xs font-medium text-black disabled:opacity-50"
            >
              {t.sendThis}
            </button>
            <button
              type="button"
              onClick={() => {
                setText(suggestion.expression);
                setSuggestion(null);
                requestAnimationFrame(() => input.current?.focus());
              }}
              className="flex-1 rounded-lg border border-white/20 px-2 py-1.5 text-xs text-slate-200"
            >
              {t.editThis}
            </button>
          </div>
        </div>
      ) : null}
      <div className="flex gap-1.5">
        <input
          ref={input}
          autoFocus={Boolean(quote)}
          value={text}
          disabled={disabled}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && !event.nativeEvent.isComposing && void send(text)}
          placeholder={placeholder ?? t.commentPlaceholder}
          dir="auto"
          className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/40"
        />
        <button
          type="button"
          disabled={disabled || !text.trim() || state === "loading"}
          onClick={() => void suggest()}
          className="shrink-0 rounded-xl border border-emerald-300/40 px-2.5 text-xs text-emerald-200 disabled:opacity-40"
        >
          {t.howToSay}
        </button>
        <button
          type="button"
          disabled={disabled || !text.trim() || busy}
          onClick={() => void send(text)}
          className="shrink-0 rounded-xl bg-white/90 px-3 text-sm font-medium text-black disabled:opacity-40"
        >
          {t.send}
        </button>
      </div>
    </div>
  );
}

export function Lines({
  t,
  lines,
  view,
  selfId,
  locale,
  targetLanguage,
  blocked,
  onPerson,
  onQuote,
  onNote,
  big,
  allLines,
  emptyText,
  hints,
  hintMode,
  onHintSend,
  onHintClose,
}: {
  t: RoomCopy;
  lines: RoomLine[];
  /** 내 줄 번호 → 본인에게만 보이는 "이렇게 말해 보세요"(배우는 언어 문장). */
  hints?: Record<number, string>;
  hintMode?: RoomHintMode;
  onHintSend?: (seq: number, text: string) => void;
  onHintClose?: (seq: number) => void;
  /** 자막·채팅을 나눠 그릴 때 방의 모든 줄(질문 수·번역 맥락은 둘을 합쳐서 본다). */
  allLines?: RoomLine[];
  /** 줄이 없을 때 문구(채팅 칸은 "아직 댓글이 없어요"). */
  emptyText?: string;
  view: "timeline" | "people";
  selfId: string;
  locale: string;
  targetLanguage: string;
  /** 내가 차단한 계정. 그 사람의 줄은 접어 둔다. */
  blocked: string[];
  /** 이름(사진)을 누르면 그 사람 프로필. */
  onPerson: (peerId: string, accountId: string | null) => void;
  /** 남의 줄을 집어 묻기(ask) 또는 답하기. 없으면 버튼을 안 보인다. */
  onQuote?: (line: RoomLine, ask: boolean) => void;
  /** 쪽지로 묻기(그 줄을 말한 사람에게 1:1). 계정이 있는 줄에만. */
  onNote?: (line: RoomLine) => void;
  /** 채팅 위주 보기: 글자를 크게. */
  big?: boolean;
}) {
  const [open, setOpen] = useState<Record<number, string | null>>({});
  const scroller = useRef<HTMLDivElement>(null);
  const ordered = useMemo(() => timeline(lines), [lines]);
  const groups = useMemo(() => byPerson(lines), [lines]);

  useEffect(() => {
    if (view !== "timeline") return;
    const node = scroller.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [ordered.length, view]);

  const toggle = async (line: RoomLine) => {
    if (line.seq in open) {
      setOpen((have) => {
        const next = { ...have };
        delete next[line.seq];
        return next;
      });
      return;
    }
    setOpen((have) => ({ ...have, [line.seq]: null }));
    try {
      const translated = await translateLine({
        text: line.text,
        context: contextBefore(allLines ?? lines, line.seq),
        locale,
        targetLanguage,
      });
      setOpen((have) => (line.seq in have ? { ...have, [line.seq]: translated || t.translateFailed } : have));
    } catch {
      setOpen((have) => (line.seq in have ? { ...have, [line.seq]: t.translateFailed } : have));
    }
  };

  const row = (line: RoomLine, showName: boolean, overlap: boolean) => {
    if (line.accountId && blocked.includes(line.accountId)) {
      return (
        <li key={line.seq} className="px-3 py-1 text-[11px] text-slate-600">
          {t.hiddenLine}
        </li>
      );
    }
    const translation = open[line.seq];
    const isOpen = line.seq in open;
    const typed = line.kind === "text";
    const others = line.peerId !== selfId;
    // 누가 내 말을 물었으면 그 질문 줄을 눈에 띄게.
    const askedMe = Boolean(line.ask && line.quote?.peerId === selfId && others);
    const asked = questionCount(allLines ?? lines, line.seq);
    return (
      <li key={line.seq} className="flex items-start gap-2">
        {showName ? (
          <button
            type="button"
            onClick={() => onPerson(line.peerId, line.accountId ?? null)}
            aria-label={line.nickname}
            className="mt-1 shrink-0"
          >
            <Face accountId={line.accountId ?? null} name={line.nickname} size={28} />
          </button>
        ) : null}
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => void toggle(line)}
            className={`w-full rounded-xl px-3 py-2 text-start ${
              askedMe ? "border border-amber-300/60" : typed ? "border border-dashed border-white/15" : ""
            } ${line.peerId === selfId ? "bg-white/[0.07]" : "bg-white/[0.03]"} hover:bg-white/10`}
          >
            {showName || typed || asked > 0 || line.lang ? (
              <span className={`me-2 text-xs font-medium ${colorFor(line.peerId)}`} dir="auto">
                {showName ? line.nickname : null}
                {/* 자유 대화방: 이 줄이 어느 언어인지(글자로 가를 수 있을 때만). */}
                {line.lang && isLearningLanguageCode(line.lang) ? (
                  <span className="ms-1 rounded-full bg-white/10 px-1.5 text-meta font-normal text-slate-300">{learningLanguageUiLabel(line.lang, locale)}</span>
                ) : null}
                {typed ? <span className="ms-1 text-[10px] text-slate-500">💬 {t.comment}</span> : null}
                {overlap ? <span className="ms-1 text-[10px] text-slate-500">· {t.overlap}</span> : null}
                {asked > 0 ? <span className="ms-1 text-[10px] text-amber-300">❓ {asked}</span> : null}
              </span>
            ) : null}
            {askedMe ? (
              <span className="block text-[11px] text-amber-200" dir="auto">
                {t.askedYou.replace("{name}", line.nickname)}
              </span>
            ) : null}
            {line.quote ? (
              <span className="my-1 block border-s-2 border-white/25 ps-2 text-xs text-slate-400" dir="auto">
                ↪ {line.quote.nickname}: {line.quote.text}
              </span>
            ) : null}
            <span className={`block leading-snug text-white ${big ? "text-title" : typed ? "text-sm" : "text-chat"}`} dir="auto">
              {line.text}
            </span>
            {isOpen ? (
              <span className="mt-1 block text-sm text-slate-300" dir="auto">
                {translation ?? t.translating}
              </span>
            ) : null}
          </button>
          {line.peerId === selfId && hints?.[line.seq] && hintMode !== "off" ? (
            <HintCard
              t={t}
              text={hints[line.seq]}
              language={targetLanguage}
              peek={hintMode === "peek"}
              onSend={onHintSend ? () => onHintSend(line.seq, hints[line.seq]) : undefined}
              onClose={() => onHintClose?.(line.seq)}
            />
          ) : null}
          {isOpen && others && onQuote ? (
            <div className="mt-1 flex gap-1.5 ps-1">
              <button
                type="button"
                onClick={() => onQuote(line, true)}
                className="rounded-lg border border-amber-300/40 px-2 py-0.5 text-xs text-amber-200 hover:bg-amber-300/10"
              >
                ❓ {t.askMeaning}
              </button>
              <button
                type="button"
                onClick={() => onQuote(line, false)}
                className="rounded-lg border border-white/15 px-2 py-0.5 text-xs text-slate-300 hover:bg-white/10"
              >
                ↩ {t.replyTo}
              </button>
              {onNote && line.accountId ? (
                <button
                  type="button"
                  onClick={() => onNote(line)}
                  className="rounded-lg border border-sky-300/40 px-2 py-0.5 text-xs text-sky-200 hover:bg-sky-300/10"
                >
                  ✉ {t.noteAsk}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </li>
    );
  };

  if (lines.length === 0) {
    return <p className="min-h-0 flex-1 px-4 py-4 text-sm text-slate-500">{emptyText ?? t.noLines}</p>;
  }

  return (
    <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
      <p className="mb-2 px-1 text-[11px] text-slate-500">{t.tapToTranslate}</p>
      {view === "timeline" ? (
        <ul className="space-y-1.5">
          {ordered.map((line, index) => row(line, true, line.kind !== "text" && overlapsPrevious(ordered, index)))}
        </ul>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <section key={group.peerId}>
              <h3 className={`mb-1 px-1 text-sm font-semibold ${colorFor(group.peerId)}`} dir="auto">
                {group.nickname}
                {group.peerId === selfId ? <span className="ms-1 text-xs text-slate-500">({t.you})</span> : null}
              </h3>
              <ul className="space-y-1.5">{group.lines.map((line) => row(line, false, false))}</ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

/** 본인에게만: 편한 말로 한 줄 아래 "💡 이렇게 말해 보세요". 살짝만이면 첫 낱말, 누르면 전체. */
function HintCard({ t, text, language, peek, onSend, onClose }: { t: RoomCopy; text: string; language: string; peek: boolean; onSend?: () => void; onClose: () => void }) {
  const [shown, setShown] = useState(!peek);
  return (
    <div className="mt-1 rounded-xl border border-emerald-300/30 bg-emerald-300/5 px-2.5 py-1.5">
      <div className="flex items-center gap-2">
        <p className="min-w-0 flex-1 text-meta text-emerald-200">💡 {t.hintTry}</p>
        <button type="button" onClick={onClose} aria-label={t.hintClose} className="shrink-0 rounded-lg px-1.5 text-sm text-slate-400 hover:bg-white/10">
          ×
        </button>
      </div>
      {shown ? (
        <p className="text-chat text-white" dir="auto">
          {text}
        </p>
      ) : (
        <button type="button" onClick={() => setShown(true)} className="block text-start text-chat text-white" dir="auto">
          {peekHint(text, language)} <span className="text-meta text-emerald-200">· {t.hintReveal}</span>
        </button>
      )}
      {shown && onSend ? (
        <button type="button" onClick={onSend} className="mt-1 rounded-lg border border-emerald-300/40 px-2 py-0.5 text-xs text-emerald-100 hover:bg-emerald-300/10">
          {t.sendThis}
        </button>
      ) : null}
    </div>
  );
}
