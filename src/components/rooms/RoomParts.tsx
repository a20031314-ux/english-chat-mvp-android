"use client";

import { MateButton } from "./MateAsk";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import type { RoomCopy } from "@/lib/rooms/copy";
import {
  fetchProfile,
  howToSay,
  reportPerson,
  setBlock,
  setFollow,
  translateLine, aiFailText, RoomApiError } from "@/lib/rooms/client";
import { byPerson, contextBefore, overlapsPrevious, timeline, type RoomLine, type RoomMember } from "@/lib/rooms/protocol";
import type { PublicProfile } from "@/lib/rooms/social";
import type { HowToSayExpression } from "@/lib/howToSay";
import { focusOf, pickTokens, questionCount } from "@/lib/rooms/quote";
import { FactsView, ThankButton } from "@/components/account/ProfileFacts";
import type { MediaRef, MediaScope } from "@/lib/rooms/media";
import { MediaError, uploadImage, type MediaUploadError } from "@/lib/rooms/mediaClient";
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
  // 이름을 안 넘긴 곳(대화 목록 등)은 프로필 닉네임의 첫 글자 — "?"는 프로필도 없을 때만(qa 2026-10-21).
  const letter = Array.from(name || profile?.nickname || "?")[0]?.toUpperCase() ?? "?";
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
    } catch {
      // 정지(SUSPENDED)면 앱 틀이 한 줄 띄운다(lib/rooms/suspended.ts). 그 밖의 실패는 버튼이 그대로인 것으로 충분.
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
          {/* 나에 대한 사실(칩)과 켠 칸(도움·꾸준함·반영 의견·목표) — 학습 상태는 서버가 보내지 않는다. */}
          {profile ? <FactsView locale={locale} facts={profile.facts} badges={profile.badges} goal={profile.goal} /> : null}
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

          {/* 러닝메이트 신청(팔로우 다음 단계 — 둘만의 워크스페이스). */}
          {profile && !profile.isMe && !profile.blockedByMe && accountId ? <MateButton accountId={accountId} locale={locale} /> : null}

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
  attach,
}: {
  t: RoomCopy;
  placeholder?: string;
  disabled: boolean;
  locale: string;
  targetLanguage: string;
  recent: () => string[];
  /** 사진을 붙였으면 image(먼저 올린 것). 글은 비어 있을 수 있다. */
  onSend: (text: string, image?: MediaRef) => Promise<void>;
  /** 사진 첨부(📷): 어디에 올릴 사진인지. 없으면 버튼을 안 보인다(말하는 방 채팅 등). */
  attach?: MediaScope | null;
  /** 집은 남의 말(묻기·답하기). 부르는 쪽은 인용이 바뀔 때 key를 바꿔 initialText를 새로 채운다. */
  quote?: { nickname: string; text: string; ask: boolean; focus?: string } | null;
  onClearQuote?: () => void;
  initialText?: string;
}) {
  const [text, setText] = useState(initialText ?? "");
  const [busy, setBusy] = useState(false);
  const [suggestion, setSuggestion] = useState<HowToSayExpression | null>(null);
  const [state, setState] = useState<"" | "loading" | "failed" | "limit">("");
  const input = useRef<HTMLInputElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  // 고른 사진(보낼 때 올린다)과 미리보기, 올리기 오류.
  const [photo, setPhoto] = useState<{ file: File; preview: string } | null>(null);
  const [photoError, setPhotoError] = useState<MediaUploadError | null>(null);
  useEffect(() => () => {
    if (photo) URL.revokeObjectURL(photo.preview);
  }, [photo]);

  const send = async (value: string) => {
    const line = value.trim();
    if ((!line && !photo) || busy) return;
    setBusy(true);
    setPhotoError(null);
    try {
      let image: MediaRef | undefined;
      if (photo && attach) {
        try {
          image = await uploadImage(attach, photo.file);
        } catch (error) {
          setPhotoError(error instanceof MediaError ? error.code : "FAILED");
          return;
        }
      }
      await onSend(line, image);
      setText("");
      setSuggestion(null);
      setPhoto(null);
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
    } catch (error) {
      setState(error instanceof RoomApiError && error.code === "AI_HELP_LIMIT" ? "limit" : "failed");
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
              <QuoteText text={quote.text} focus={quote.focus} />
            </p>
          </div>
          <button type="button" onClick={onClearQuote} aria-label={t.quoteCancel} className="shrink-0 rounded px-1.5 text-sm text-slate-400 hover:bg-white/10">
            ×
          </button>
        </div>
      ) : null}
      {state === "loading" ? <p className="text-xs text-slate-400">{t.howToSayLoading}</p> : null}
      {state === "failed" ? <p className="text-xs text-rose-300">{t.howToSayFailed}</p> : null}
      {state === "limit" ? <p className="text-xs text-rose-300">{t.aiHelpLimit}</p> : null}
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
      {photo ? (
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- 고른 사진 미리보기(blob:) */}
          <img src={photo.preview} alt="" className="h-14 w-14 rounded-lg object-cover" />
          <span className="min-w-0 flex-1 text-meta text-slate-400">{busy ? t.photoUploading : t.photoReady}</span>
          <button type="button" disabled={busy} onClick={() => setPhoto(null)} aria-label={t.photoRemove} className="shrink-0 rounded-lg px-2 text-title text-slate-400 hover:bg-white/10">
            ×
          </button>
        </div>
      ) : null}
      {photoError ? <p className="text-xs text-rose-300">{photoErrorText(t, photoError)}</p> : null}
      <div className="flex gap-1.5">
        {attach ? (
          <>
            <input
              ref={picker}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                setPhotoError(null);
                setPhoto({ file, preview: URL.createObjectURL(file) });
              }}
            />
            <button
              type="button"
              disabled={disabled || busy}
              onClick={() => picker.current?.click()}
              aria-label={t.photoAttach}
              title={t.photoAttach}
              className="shrink-0 rounded-xl border border-white/15 px-2.5 text-chat text-slate-200 disabled:opacity-40"
            >
              📷
            </button>
          </>
        ) : null}
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
          disabled={disabled || (!text.trim() && !photo) || busy}
          onClick={() => void send(text)}
          className="shrink-0 rounded-xl bg-white/90 px-3 text-sm font-medium text-black disabled:opacity-40"
        >
          {t.send}
        </button>
      </div>
    </div>
  );
}

/** 사진 올리기 오류 문구. */
/**
 * 인용 글: 고른 부분(focus)이 있으면 그 부분만 밝게. 글 자체는 서버가 방·대화 기록에서 채운 것.
 */
export function QuoteText({ text, focus }: { text: string; focus?: string | null }) {
  const at = focus ? text.indexOf(focus) : -1;
  if (!focus || at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="rounded-lg bg-amber-300/25 px-0.5 font-medium text-amber-100">{focus}</span>
      {text.slice(at + focus.length)}
    </>
  );
}

/**
 * 남의 줄을 누른 뒤: 낱말을 골라(눌러서, 이어서 누르면 구절) 그 부분만 묻거나 답한다.
 * 낱말은 기기에서 자른다(wordSegments — 띄어쓰기 없는 일본어·중국어·태국어도). 모델을 부르지 않아
 * 고르기만으로는 AI 도움·비용이 들지 않는다. 고르지 않으면 지금처럼 줄 전체.
 */
export function LineActions({
  t,
  text,
  language,
  onAsk,
  onReply,
  extra,
}: {
  t: RoomCopy;
  text: string;
  language?: string;
  onAsk: (focus?: string) => void;
  onReply?: (focus?: string) => void;
  /** 그 밖의 버튼(✉ 쪽지로 묻기 등) — 고른 부분을 받는다. */
  extra?: (focus?: string) => ReactNode;
}) {
  const tokens = useMemo(() => pickTokens(text, language), [text, language]);
  const [pick, setPick] = useState<[number, number] | null>(null);
  const tap = (index: number) =>
    setPick((have) => {
      if (!have) return [index, index];
      const [from, to] = have;
      if (index >= from && index <= to) return from === to ? null : [index, index];
      return [Math.min(from, index), Math.max(to, index)];
    });
  const focus = pick ? focusOf(text, tokens, pick[0], pick[1]) : undefined;
  return (
    <div className="mt-1 space-y-1 ps-1">
      {tokens.length > 1 ? (
        <div className="space-y-1">
          <div className="flex flex-wrap gap-1" dir="auto">
            {tokens.map((token, index) => {
              const on = pick !== null && index >= pick[0] && index <= pick[1];
              return (
                <button
                  key={`${token.start}-${token.word}`}
                  type="button"
                  aria-pressed={on}
                  onClick={() => tap(index)}
                  className={`rounded-lg border px-1.5 py-0.5 text-xs ${
                    on ? "border-amber-300/70 bg-amber-300/20 text-amber-100" : "border-white/10 text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {token.word}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => onAsk(focus)}
          className="rounded-lg border border-amber-300/40 px-2 py-0.5 text-xs text-amber-200 hover:bg-amber-300/10"
        >
          ❓ {focus ? `“${focus}” ` : ""}
          {t.askMeaning}
        </button>
        {onReply ? (
          <button
            type="button"
            onClick={() => onReply(focus)}
            className="rounded-lg border border-white/15 px-2 py-0.5 text-xs text-slate-300 hover:bg-white/10"
          >
            ↩ {t.replyTo}
          </button>
        ) : null}
        {extra?.(focus)}
      </div>
    </div>
  );
}

export function photoErrorText(t: RoomCopy, code: MediaUploadError): string {
  if (code === "LIMIT") return t.photoLimit;
  if (code === "REJECTED") return t.photoRejected;
  if (code === "TOO_BIG") return t.photoTooBig;
  if (code === "BAD_TYPE") return t.photoBadType;
  return t.photoFailed;
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
  thankRoomId,
  big,
  allLines,
  emptyText,
  fixes,
  onFixOpen,
  onFixClose,
  composing,
}: {
  t: RoomCopy;
  lines: RoomLine[];
  /** 지금 말하는 중(받아쓰는 중)인 사람 — 말을 시작하자마자 "…" 말풍선, 받아쓴 글이 오면 그 줄로 바뀐다. */
  composing?: { peerId: string; accountId: string | null; nickname: string }[];
  /** 내 줄 번호 → 본인에게만 보이는 교정(접혀 있으면 칩, 열면 고친 문장·설명). 2026-10-22. */
  fixes?: Record<number, RoomLineFix>;
  onFixOpen?: (seq: number) => void;
  onFixClose?: (seq: number) => void;
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
  onQuote?: (line: RoomLine, ask: boolean, focus?: string) => void;
  /** 쪽지로 묻기(그 줄을 말한 사람에게 1:1). 계정이 있는 줄에만. */
  onNote?: (line: RoomLine, focus?: string) => void;
  /** 있으면 내 ❓ 질문에 단 남의 답 아래 "도움됐어요"(서버가 질문한 사람인지 다시 확인). */
  thankRoomId?: string;
  /** 채팅 위주 보기: 글자를 크게. */
  big?: boolean;
}) {
  const [open, setOpen] = useState<Record<number, string | null>>({});
  const scroller = useRef<HTMLDivElement>(null);
  const ordered = useMemo(() => timeline(lines), [lines]);
  // 처음 그릴 때 이미 있던 줄 번호. 그 뒤에 생긴 줄만 글이 채워지듯 보인다(RevealText).
  const knownSeqs = useRef<Set<number>>(new Set(lines.map((line) => line.seq)));
  useEffect(() => {
    for (const line of lines) knownSeqs.current.add(line.seq);
  }, [lines]);
  const groups = useMemo(() => byPerson(lines), [lines]);

  // 💡 힌트가 오면 그 카드까지 보이게(내 마지막 줄 아래라 맨 아래로). "…" 말풍선이 생기거나 글이 이어 붙어도.
  // 교정 칩이 생기거나 열려도 보이게.
  const fixKey = Object.entries(fixes ?? {}).map(([seq, fix]) => `${seq}${fix.open ? "o" : ""}`).join(",");
  const composingKey = (composing ?? []).map((row) => row.peerId).join(",");
  const lastText = ordered.at(-1)?.text.length ?? 0;
  useEffect(() => {
    if (view !== "timeline") return;
    const node = scroller.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [ordered.length, view, fixKey, composingKey, lastText]);

  /** "…" 말풍선 한 개: 줄과 같은 자리(사진·이름)에 점 세 개가 깜박인다. */
  const composingRow = (row: { peerId: string; accountId: string | null; nickname: string }, showName: boolean) => (
    <li key={`composing-${row.peerId}`} className="flex items-start gap-2" aria-label={row.nickname}>
      {showName ? (
        <span className="mt-1 shrink-0">
          <Face accountId={row.accountId} name={row.nickname} size={28} />
        </span>
      ) : null}
      <div className={`rounded-xl px-3 py-2 ${row.peerId === selfId ? "bg-white/[0.07]" : "bg-white/[0.03]"}`}>
        {showName ? (
          <span className={`me-2 text-xs font-medium ${colorFor(row.peerId)}`} dir="auto">
            {row.nickname}
          </span>
        ) : null}
        <span className="composing-dots inline-flex gap-1 align-middle text-slate-400" aria-hidden>
          <span>•</span>
          <span>•</span>
          <span>•</span>
        </span>
      </div>
    </li>
  );

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
    } catch (error) {
      setOpen((have) => (line.seq in have ? { ...have, [line.seq]: aiFailText(t, error) } : have));
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
    // 내 ❓ 질문 줄을 집은 남의 답 — 질문한 나에게만 "도움됐어요".
    const askLine = line.quote ? (allLines ?? lines).find((item) => item.seq === line.quote?.seq) : undefined;
    const answersMe = Boolean(thankRoomId && others && line.accountId && askLine?.ask && askLine.peerId === selfId);
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
                ↪ {line.quote.nickname}: <QuoteText text={line.quote.text} focus={line.quote.focus} />
              </span>
            ) : null}
            <span className={`block leading-snug text-white ${big ? "text-title" : typed ? "text-sm" : "text-chat"}`} dir="auto">
              {typed ? line.text : <RevealText text={line.text} fresh={!knownSeqs.current.has(line.seq)} />}
              {/* 받아쓰기가 확신이 낮은 줄: 끝에 "?" 하나. 눌러 열면 아래에 한 줄 설명(따로 알림은 없음). */}
              {!typed && line.unsure ? (
                <span className="ms-1 align-middle text-meta font-semibold text-amber-300" title={t.unsureMark} aria-label={t.unsureMark}>
                  ?
                </span>
              ) : null}
            </span>
            {isOpen && !typed && line.unsure ? (
              <span className="mt-1 block text-meta text-amber-200" dir="auto">
                {t.unsureLine}
              </span>
            ) : null}
            {isOpen ? (
              <span className="mt-1 block text-sm text-slate-300" dir="auto">
                {translation ?? t.translating}
              </span>
            ) : null}
          </button>
          {answersMe && thankRoomId ? (
            <ThankButton locale={locale} target={{ kind: "room", roomId: thankRoomId, seq: line.seq }} learn={targetLanguage} />
          ) : null}
          {line.peerId === selfId && fixes?.[line.seq] ? (
            <FixCard t={t} fix={fixes[line.seq]} onOpen={() => onFixOpen?.(line.seq)} onClose={() => onFixClose?.(line.seq)} />
          ) : null}
          {isOpen && others && onQuote ? (
            <LineActions
              t={t}
              text={line.text}
              language={line.lang}
              onAsk={(focus) => onQuote(line, true, focus)}
              onReply={(focus) => onQuote(line, false, focus)}
              extra={
                onNote && line.accountId
                  ? (focus) => (
                      <button
                        type="button"
                        onClick={() => onNote(line, focus)}
                        className="rounded-lg border border-sky-300/40 px-2 py-0.5 text-xs text-sky-200 hover:bg-sky-300/10"
                      >
                        ✉ {t.noteAsk}
                      </button>
                    )
                  : undefined
              }
            />
          ) : null}
        </div>
      </li>
    );
  };

  const composingRows = composing ?? [];
  if (lines.length === 0 && composingRows.length === 0) {
    // 비어 있으면 빈칸(칸 위에 🎙 자막·💬 채팅 이름이 있다). 설명 글은 사용법(?) 창에.
    return emptyText ? <p className="min-h-0 flex-1 px-4 py-4 text-sm text-slate-500">{emptyText}</p> : <div className="min-h-0 flex-1" />;
  }

  return (
    <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
      {view === "timeline" ? (
        <ul className="space-y-1.5">
          {ordered.map((line, index) => row(line, true, line.kind !== "text" && overlapsPrevious(ordered, index)))}
          {composingRows.map((row) => composingRow(row, true))}
        </ul>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <section key={group.peerId}>
              <h3 className={`mb-1 px-1 text-sm font-semibold ${colorFor(group.peerId)}`} dir="auto">
                {group.nickname}
                {group.peerId === selfId ? <span className="ms-1 text-xs text-slate-500">({t.you})</span> : null}
              </h3>
              <ul className="space-y-1.5">
                {group.lines.map((line) => row(line, false, false))}
                {composingRows.filter((row) => row.peerId === group.peerId).map((row) => composingRow(row, false))}
              </ul>
            </section>
          ))}
          {/* 아직 줄이 없는 사람이 말을 시작했으면 맨 아래에 이름과 함께. */}
          {composingRows.some((row) => !groups.some((group) => group.peerId === row.peerId)) ? (
            <ul className="space-y-1.5">
              {composingRows.filter((row) => !groups.some((group) => group.peerId === row.peerId)).map((row) => composingRow(row, true))}
            </ul>
          ) : null}
        </div>
      )}
    </div>
  );
}

/**
 * 받아쓴 글이 오면 앞에서부터 빠르게 채워 보인다(약 0.3초). 같은 말풍선에 다음 조각이 이어 붙으면 붙은 부분만.
 * 글자를 늦추는 건 보이는 방식뿐이라(글은 이미 와 있음) 움직임 줄이기 설정이면 바로 다 보인다.
 */
function RevealText({ text, fresh }: { text: string; fresh: boolean }) {
  // 방에 들어와 받은 지난 줄은 바로 다 보이고, 새로 온 줄(fresh)만 빈칸부터 채운다.
  const [shown, setShown] = useState(fresh ? 0 : text.length);
  const fromRef = useRef(fresh ? "" : text);
  useEffect(() => {
    const before = fromRef.current;
    fromRef.current = text;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const start = text.startsWith(before) ? before.length : 0;
    if (reduce || start >= text.length) {
      const frame = requestAnimationFrame(() => setShown(text.length));
      return () => cancelAnimationFrame(frame);
    }
    const began = performance.now();
    const total = text.length - start;
    const duration = Math.min(450, 120 + total * 12);
    let frame = 0;
    const tick = (now: number) => {
      const done = Math.min(1, (now - began) / duration);
      setShown(start + Math.ceil(total * done));
      if (done < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text]);
  return <>{text.slice(0, Math.max(0, shown))}</>;
}

/** 본인에게만: 편한 말로 한 줄 아래 "💡 이렇게 말해 보세요". 살짝만이면 첫 낱말, 누르면 전체. */
/** 내 줄 교정 한 건(본인 화면에만). open이면 고친 문장·설명, 아니면 칩. */
export type RoomLineFix = {
  original: string;
  corrected: string;
  explanation: string;
  /** 두 받아쓰기가 다르게 들은 낱말 — 확인 모델도 건드리지 않게 넘긴다. */
  disputed: string[];
  open: boolean;
  checking: boolean;
  verified: boolean;
};

function FixCard({ t, fix, onOpen, onClose }: { t: RoomCopy; fix: RoomLineFix; onOpen: () => void; onClose: () => void }) {
  if (!fix.open) {
    return (
      <button
        type="button"
        onClick={onOpen}
        disabled={fix.checking}
        aria-busy={fix.checking}
        className="mt-1 inline-flex items-center gap-1 rounded-full border border-warn/50 bg-warn/15 px-2.5 py-0.5 text-caption text-amber-100 disabled:opacity-70"
      >
        <span aria-hidden="true">✎</span>
        {fix.checking ? t.fixChecking : t.fixChip}
      </button>
    );
  }
  return (
    <div className="mt-1 rounded-xl border border-warn/40 bg-warn/10 px-2.5 py-1.5">
      <div className="flex items-center gap-2">
        <p className="min-w-0 flex-1 text-meta text-amber-200">✎ {t.fixTitle}</p>
        <button type="button" onClick={onClose} aria-label={t.hintClose} className="shrink-0 rounded-lg px-1.5 text-sm text-slate-400 hover:bg-white/10">
          ×
        </button>
      </div>
      <p className="text-chat text-white" dir="auto">
        {fix.corrected}
      </p>
      {fix.explanation ? (
        <p className="mt-0.5 text-sm text-slate-300" dir="auto">
          {fix.explanation}
        </p>
      ) : null}
    </div>
  );
}



/**
 * 길게 누르면 [삭제][취소] — 보낸 줄 지우기(2026-10-23, 1:1·단체방). 지우면 상대 화면에서도 사라진다.
 * 길게 누른 뒤의 눌림(번역 열기 등)은 막는다. 끌어서 움직이면(목록 넘기기) 취소.
 */
export function Unsendable({
  t,
  enabled,
  align,
  onDelete,
  children,
}: {
  t: RoomCopy;
  enabled: boolean;
  align: "start" | "end" | "center";
  onDelete: () => Promise<void>;
  children: ReactNode;
}) {
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);
  const timer = useRef<number | null>(null);
  const fired = useRef(false);
  const origin = useRef<{ x: number; y: number } | null>(null);
  if (!enabled) return <>{children}</>;
  const stop = () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  };
  return (
    <div
      onPointerDown={(event) => {
        fired.current = false;
        origin.current = { x: event.clientX, y: event.clientY };
        stop();
        timer.current = window.setTimeout(() => {
          fired.current = true;
          setAsking(true);
          navigator.vibrate?.(15);
        }, 500);
      }}
      onPointerMove={(event) => {
        const from = origin.current;
        if (from && Math.hypot(event.clientX - from.x, event.clientY - from.y) > 10) stop();
      }}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onContextMenu={(event) => {
        event.preventDefault();
        setAsking(true);
      }}
      onClickCapture={(event) => {
        if (!fired.current) return;
        fired.current = false;
        event.stopPropagation();
        event.preventDefault();
      }}
      style={{ WebkitTouchCallout: "none" }}
    >
      {children}
      {asking ? (
        <div className={`mt-1 flex gap-1.5 ${align === "end" ? "justify-end" : align === "center" ? "justify-center" : ""}`}>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setBusy(true);
              void onDelete().finally(() => {
                setBusy(false);
                setAsking(false);
              });
            }}
            className="rounded-lg bg-rose-500/80 px-2.5 py-1 text-xs font-medium text-white disabled:opacity-40"
          >
            {t.boardDelete}
          </button>
          <button type="button" onClick={() => setAsking(false)} className="rounded-lg px-2.5 py-1 text-xs text-slate-300">
            {t.cancel}
          </button>
        </div>
      ) : null}
    </div>
  );
}
