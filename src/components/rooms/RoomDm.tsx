"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import type { RoomCopy } from "@/lib/rooms/copy";
import {
  RoomApiError,
  dmCall,
  dmDecline,
  dmInbox,
  dmOpen,
  dmPoll,
  dmSend,
  dmUnsend,
  howToSay,
  translateLine, aiFailText } from "@/lib/rooms/client";
import { DM_PENDING_LIMIT, type DmMessage, type DmSummary, type DmThread } from "@/lib/rooms/dm";
import type { RoomMeta } from "@/lib/rooms/protocol";
import { askPhraseAbout, questionCount } from "@/lib/rooms/quote";
import { ThankButton } from "@/components/account/ProfileFacts";
import type { RoomNote } from "@/lib/rooms/layout";
import { Composer, Face, LineActions, QuoteText, Unsendable, useProfile } from "./RoomParts";
import { MediaImage } from "./MediaImage";
import { IconImage } from "./IconPacks";

/*
 * 1:1 메시지(rooms/dm.ts). 목록(DmList)과 대화(DmThreadView).
 *
 * 대화는 채팅탭처럼 학습이 붙는다: 상대 말을 누르면 앞 줄 맥락으로 내 앱 언어 번역,
 * 내가 쓴 말은 "다듬어 보기"(나에게만), 편한 말로 쓰면 "학습 언어로".
 * 📞은 둘만의 통화 방을 열고, 끝나면 그 통화의 자막이 대화에 "통화 기록"으로 남는다.
 */

export function useInbox(enabled: boolean, everyMs = 8_000): { threads: DmSummary[]; unread: number; refresh: () => void } {
  const [threads, setThreads] = useState<DmSummary[]>([]);
  const refresh = useCallback(() => {
    void dmInbox()
      .then((body) => setThreads(body.threads))
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (!enabled) return;
    refresh();
    const timer = window.setInterval(refresh, everyMs);
    return () => window.clearInterval(timer);
  }, [enabled, refresh, everyMs]);
  const unread = threads.reduce((sum, row) => sum + (row.unread > 0 ? 1 : 0), 0);
  return { threads, unread, refresh };
}

function Name({ id }: { id: string }) {
  const profile = useProfile(id);
  return <>{profile?.nickname || "…"}</>;
}

function preview(t: RoomCopy, thread: DmThread): string {
  // 사진만 보낸 줄은 서버가 "📷"로 남긴다 — 그 언어의 "사진"을 붙여 보인다.
  if (thread.lastText === "📷") return `📷 ${t.photoLabel}`;
  return thread.lastText || t.callStarted;
}

export function DmList({
  t,
  threads,
  onOpen,
  onHide,
}: {
  t: RoomCopy;
  threads: DmSummary[];
  onOpen: (other: string) => void;
  /** 내 목록에서 지우기(⋯ → 삭제). */
  onHide?: (threadId: string) => Promise<void>;
}) {
  // ⋯를 누른 대화: 그 줄 끝에 [삭제][취소].
  const [confirming, setConfirming] = useState<string | null>(null);
  const [busy, setBusy] = useState("");
  const requests = threads.filter((row) => row.request);
  const rest = threads.filter((row) => !row.request);
  if (threads.length === 0) return <p className="text-sm text-slate-500">{t.noThreads}</p>;
  const row = (summary: DmSummary) => (
    <li key={summary.thread.id} className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onOpen(summary.other)}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-start hover:bg-white/[0.06]"
      >
        <Face accountId={summary.other} name="" size={44} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-semibold text-white" dir="auto">
            <Name id={summary.other} />
          </span>
          <span className="block truncate text-[13px] text-slate-400" dir="auto">
            {summary.thread.lastFrom !== summary.other ? `${t.you3}: ` : ""}
            {preview(t, summary.thread)}
          </span>
        </span>
        {summary.unread > 0 ? (
          <span className="shrink-0 rounded-full bg-violet-500 px-2 py-0.5 text-xs font-semibold text-white">{Math.min(summary.unread, 99)}</span>
        ) : null}
      </button>
      {onHide ? (
        confirming === summary.thread.id ? (
          <span className="flex shrink-0 flex-col gap-1">
            <button
              type="button"
              disabled={busy === summary.thread.id}
              onClick={() => {
                setBusy(summary.thread.id);
                void onHide(summary.thread.id).finally(() => {
                  setBusy("");
                  setConfirming(null);
                });
              }}
              className="rounded-lg bg-rose-500/80 px-2.5 py-1 text-xs font-medium text-white disabled:opacity-40"
            >
              {t.boardDelete}
            </button>
            <button type="button" onClick={() => setConfirming(null)} className="rounded-lg px-2.5 py-1 text-xs text-slate-300">
              {t.cancel}
            </button>
          </span>
        ) : (
          <button
            type="button"
            aria-label={t.boardDelete}
            title={t.boardDelete}
            onClick={() => setConfirming(summary.thread.id)}
            className="shrink-0 rounded-lg px-2 py-2 text-lg leading-none text-slate-500 hover:bg-white/10"
          >
            ⋯
          </button>
        )
      ) : null}
    </li>
  );
  return (
    <div className="space-y-4">
      {requests.length ? (
        <section className="space-y-2">
          <h3 className="text-xs font-semibold text-amber-200">✉️ {t.requests}</h3>
          <ul className="space-y-2">{requests.map(row)}</ul>
        </section>
      ) : null}
      <ul className="space-y-2">{rest.map(row)}</ul>
    </div>
  );
}

export function DmThreadView({
  t,
  me,
  other,
  peerId,
  locale,
  targetLanguage,
  onClose,
  onJoinCall,
  note,
}: {
  t: RoomCopy;
  /** 쪽지로 열렸으면 방 줄 인용(입력창 위에 붙고 학습 언어 질문이 채워짐). */
  note?: RoomNote | null;
  me: string;
  other: string;
  peerId: string;
  locale: string;
  targetLanguage: string;
  onClose: () => void;
  onJoinCall: (room: RoomMeta | string, title: string) => void;
}) {
  const profile = useProfile(other);
  const name = profile?.nickname || "";
  const [thread, setThread] = useState<DmThread | null>(null);
  const [messages, setMessages] = useState<DmMessage[]>([]);
  const [blocked, setBlocked] = useState(false);
  const [notice, setNotice] = useState("");
  const [loaded, setLoaded] = useState(false);
  const since = useRef(0);
  const scroller = useRef<HTMLDivElement>(null);

  const add = useCallback((incoming: DmMessage[]) => {
    if (!incoming.length) return;
    since.current = Math.max(since.current, ...incoming.map((message) => message.seq));
    setMessages((have) => {
      const seen = new Set(have.map((message) => message.seq));
      const added = incoming.filter((message) => !seen.has(message.seq));
      return added.length ? [...have, ...added].sort((a, b) => a.seq - b.seq) : have;
    });
  }, []);

  // 모두에게서 지운 줄(내가 지웠거나 상대가 지움)을 화면에서 뺀다.
  const drop = useCallback((gone: number[] | undefined) => {
    if (!gone?.length) return;
    const set = new Set(gone);
    setMessages((have) => (have.some((message) => set.has(message.seq)) ? have.filter((message) => !set.has(message.seq)) : have));
  }, []);

  useEffect(() => {
    let alive = true;
    let timer = 0;
    let threadId: string | null = null;
    const tick = async () => {
      if (!alive) return;
      try {
        if (!threadId) {
          const body = await dmOpen(other);
          if (!alive) return;
          setBlocked(body.blocked);
          setThread(body.thread);
          threadId = body.thread?.id ?? null;
          add(body.messages);
          setLoaded(true);
        } else {
          const body = await dmPoll(threadId, since.current);
          if (!alive) return;
          setThread(body.thread);
          add(body.messages);
          drop(body.gone);
        }
      } catch {
        // 다음 물음에서 다시.
      }
      if (alive) timer = window.setTimeout(() => void tick(), 3_000);
    };
    void tick();
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [other, add]);

  useEffect(() => {
    const node = scroller.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages.length]);

  // 기록이 남은 통화는 끝난 것 — "받기"를 숨긴다.
  const endedRooms = new Set(messages.filter((message) => message.kind === "callLog" && message.roomId).map((message) => message.roomId!));
  const isRequestToMe = thread?.status === "pending" && thread.starter !== me;
  const pendingMine = thread?.status === "pending" && thread.starter === me;
  const mineSent = messages.filter((message) => message.from === me && message.kind === "text").length;
  const contextFor = (seq: number) =>
    messages
      .filter((message) => message.seq < seq && message.kind === "text")
      .slice(-4)
      .map((message) => `${message.from === me ? "me" : name}: ${message.text}`);

  // 집은 말(상대 메시지나 통화 기록의 한 줄) — 입력창 위에 인용으로 붙는다.
  const [quoting, setQuoting] = useState<{ seq: number; index?: number; nickname: string; text: string; ask: boolean; roomId?: string; focus?: string } | null>(
    note ? { seq: note.seq, nickname: note.nickname, text: note.text, ask: true, roomId: note.roomId, focus: note.focus } : null,
  );
  const quoteName = (accountId: string | null | undefined, fallback: string) => (accountId === me ? t.you : fallback || name);

  const startCall = async () => {
    if (!thread || thread.status !== "open") {
      setNotice(t.callOnlyOpen);
      return;
    }
    try {
      const body = await dmCall(thread.id, peerId);
      add([body.message]);
      onJoinCall(body.room, name);
    } catch {
      setNotice(t.error);
    }
  };

  return (
    <BodyLayer>
      <div className="fixed inset-0 z-[95] flex flex-col bg-[#050505]">
        <div className="mx-auto flex h-[100dvh] w-full max-w-2xl flex-col pt-[env(safe-area-inset-top)]">
          <header className="flex shrink-0 items-center gap-3 border-b border-white/10 px-3 py-2.5">
            <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-sm text-slate-300 hover:bg-white/10">
              ← {t.back}
            </button>
            <Face accountId={other} name={name} size={36} />
            <p className="min-w-0 flex-1 truncate text-[15px] font-semibold text-white" dir="auto">
              {name}
            </p>
            <button
              type="button"
              onClick={() => void startCall()}
              disabled={blocked}
              aria-label={t.call}
              className={`shrink-0 rounded-xl px-3 py-1.5 text-sm font-medium disabled:opacity-40 ${
                thread?.status === "open" ? "bg-emerald-500 text-black" : "border border-white/15 text-slate-400"
              }`}
            >
              📞 {t.call}
            </button>
          </header>

          {notice ? (
            <button type="button" onClick={() => setNotice("")} className="shrink-0 bg-amber-400/10 px-4 py-2 text-start text-sm text-amber-200">
              {notice}
            </button>
          ) : null}

          <div ref={scroller} className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3">
            {messages.map((message) => (
              <Unsendable
                key={message.seq}
                t={t}
                enabled={Boolean(thread) && (message.kind === "callLog" || message.from === me)}
                align={message.kind === "text" ? (message.from === me ? "end" : "start") : "center"}
                onDelete={async () => {
                  if (!thread) return;
                  try {
                    await dmUnsend(thread.id, message.seq);
                    drop([message.seq]);
                  } catch {
                    setNotice(t.error);
                  }
                }}
              >
              <Bubble
                t={t}
                message={message}
                mine={message.from === me}
                me={me}
                locale={locale}
                targetLanguage={targetLanguage}
                context={contextFor(message.seq)}
                ended={Boolean(message.roomId && endedRooms.has(message.roomId))}
                onJoinCall={(roomId) => onJoinCall(roomId, name)}
                quoteName={quoteName}
                asked={questionCount(messages, message.seq)}
                onQuote={(index, nickname, text, ask, focus) => setQuoting({ seq: message.seq, index, nickname, text, ask, focus })}
                thankThreadId={
                  // 내 질문 메시지를 집은 상대의 답 — 질문한 나에게만 "도움됐어요"(서버가 다시 확인).
                  thread &&
                  message.from !== me &&
                  message.quote &&
                  message.quote.index === undefined &&
                  messages.some((item) => item.seq === message.quote?.seq && item.ask === true && item.from === me)
                    ? thread.id
                    : undefined
                }
              />
              </Unsendable>
            ))}
          </div>

          <footer className="shrink-0 space-y-2 border-t border-white/10 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2">
            {blocked ? <p className="text-xs text-rose-300">{t.blockedThread}</p> : null}
            {isRequestToMe ? (
              <div className="flex items-center gap-2 rounded-xl border border-amber-300/30 bg-amber-300/5 px-3 py-2 text-xs text-amber-100">
                <span className="min-w-0 flex-1" dir="auto">
                  {name}
                  {t.requestFrom}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (thread) void dmDecline(thread.id).then(onClose, () => setNotice(t.error));
                  }}
                  className="shrink-0 rounded-lg border border-white/20 px-2 py-1 text-slate-200"
                >
                  {t.declineRequest}
                </button>
              </div>
            ) : null}
            {pendingMine ? (
              <p className="text-xs text-slate-400">
                {mineSent >= DM_PENDING_LIMIT ? t.pendingLimit : t.pendingMine.replace("{n}", String(DM_PENDING_LIMIT))}
              </p>
            ) : null}
            {thread?.status === "declined" && thread.starter === me ? <p className="text-xs text-slate-400">{t.declinedMine}</p> : null}
            <Composer
              key={quoting ? `q${quoting.seq}.${quoting.index ?? "-"}${quoting.ask ? "a" : "r"}${quoting.focus ?? ""}` : "plain"}
              quote={quoting ? { nickname: quoting.nickname, text: quoting.text, ask: quoting.ask, focus: quoting.focus } : null}
              onClearQuote={() => setQuoting(null)}
              initialText={quoting?.ask ? askPhraseAbout(targetLanguage, quoting.focus) : ""}
              t={t}
              placeholder={t.messagePlaceholder}
              disabled={!loaded || blocked || (pendingMine && mineSent >= DM_PENDING_LIMIT) || (thread?.status === "declined" && thread.starter === me)}
              locale={locale}
              targetLanguage={targetLanguage}
              recent={() => messages.filter((message) => message.kind === "text").slice(-6).map((message) => `${message.from === me ? "me" : name}: ${message.text}`)}
              attach={{ kind: "dm", target: other }}
              onSend={async (text, image) => {
                try {
                  const body = await dmSend(other, text, quoting ? { seq: quoting.seq, index: quoting.index, ask: quoting.ask, roomId: quoting.roomId, focus: quoting.focus } : undefined, image?.id);
                  setThread(body.thread);
                  add([body.message]);
                  setQuoting(null);
                } catch (error) {
                  setNotice(error instanceof RoomApiError && error.code === "PENDING_LIMIT" ? t.pendingLimit : t.error);
                  throw error; // 입력창은 글을 남겨 둔다(Composer).
                }
              }}
              onSendIcon={async (icon) => {
                try {
                  const body = await dmSend(other, "", undefined, undefined, icon);
                  setThread(body.thread);
                  add([body.message]);
                } catch (error) {
                  setNotice(error instanceof RoomApiError && error.code === "PENDING_LIMIT" ? t.pendingLimit : t.error);
                }
              }}
            />
          </footer>
        </div>
      </div>
    </BodyLayer>
  );
}

function Bubble({
  t,
  message,
  mine,
  me,
  locale,
  targetLanguage,
  context,
  ended,
  onJoinCall,
  quoteName,
  asked,
  onQuote,
  thankThreadId,
}: {
  t: RoomCopy;
  ended: boolean;
  /** 있으면 이 메시지 아래 "도움됐어요"(내 질문에 단 답). */
  thankThreadId?: string;
  quoteName: (accountId: string | null | undefined, fallback: string) => string;
  /** 이 메시지를 집어 물은 질문 수. */
  asked: number;
  /** 집기: 글 메시지는 index 없이, 통화 기록의 줄은 index와 함께. */
  onQuote: (index: number | undefined, nickname: string, text: string, ask: boolean, focus?: string) => void;
  message: DmMessage;
  mine: boolean;
  me: string;
  locale: string;
  targetLanguage: string;
  context: string[];
  onJoinCall: (roomId: string) => void;
}) {
  const [extra, setExtra] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const time = useMemo(() => new Date(message.at).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }), [message.at, locale]);

  // 상대 말은 번역, 내 말은 "다듬어 보기"(나에게만).
  const toggle = async () => {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    if (extra !== null) return;
    try {
      if (mine) {
        const found = await howToSay({ message: message.text, recent: context, locale, targetLanguage });
        const better = found?.expression?.trim();
        setExtra(better && better !== message.text.trim() ? `${t.polished}: ${better}` : "✓");
      } else {
        setExtra((await translateLine({ text: message.text, context, locale, targetLanguage })) || t.translateFailed);
      }
    } catch (error) {
      setExtra(aiFailText({ ...t, translateFailed: mine ? t.howToSayFailed : t.translateFailed }, error));
    }
  };

  if (message.kind === "call") {
    return (
      <div className="flex justify-center">
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-400/5 px-3 py-2 text-sm text-emerald-100">
          <span>📞 {mine ? t.callStarted : t.callIncoming}</span>
          <span className="text-[11px] text-slate-500">{time}</span>
          {message.roomId && !ended ? (
            <button
              type="button"
              onClick={() => onJoinCall(message.roomId!)}
              className="rounded-lg bg-emerald-500 px-2.5 py-1 text-xs font-medium text-black"
            >
              {mine ? t.callRejoin : t.callJoin}
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  if (message.kind === "callLog") {
    const lines = message.lines ?? [];
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2.5">
        <button type="button" onClick={() => setLogOpen((value) => !value)} className="flex w-full items-center gap-2 text-start text-sm text-slate-200">
          <span>🗒 {t.callEnded}</span>
          <span className="text-[11px] text-slate-500">
            {lines.length} {t.callLines} · {time}
          </span>
          <span className="ms-auto text-xs text-slate-500">{logOpen ? "▲" : "▼"}</span>
        </button>
        {logOpen ? (
          <ul className="mt-2 space-y-1.5">
            {lines.map((line, index) => (
              <LogLine
                key={index}
                t={t}
                line={line}
                mine={line.from === me}
                locale={locale}
                targetLanguage={targetLanguage}
                context={lines.slice(Math.max(0, index - 4), index).map((row) => `${row.nickname}: ${row.text}`)}
                onAsk={line.from === me ? undefined : (focus) => onQuote(index, line.nickname, line.text, true, focus)}
              />
            ))}
          </ul>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[80%]">
        {!mine && message.ask && message.quote?.accountId === me ? (
          <p className="mb-0.5 px-1 text-[11px] text-amber-200" dir="auto">
            {t.askedYou.replace("{name}", quoteName(null, ""))}
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
          onClick={() => void toggle()}
          className={`block w-full rounded-2xl px-3 py-2 text-start text-[15px] leading-snug text-white ${
            mine ? "rounded-br-md bg-violet-600/80" : "rounded-bl-md bg-white/[0.08]"
          }`}
          dir="auto"
        >
          {message.quote ? (
            <span className="mb-1 block border-s-2 border-white/30 ps-2 text-xs text-slate-300/80">
              {message.quote.roomId ? <span className="block text-meta text-sky-200">🎙 {t.fromRoom}</span> : null}
              ↪ {quoteName(message.quote.accountId, message.quote.nickname)}: <QuoteText text={message.quote.text} focus={message.quote.focus} />
            </span>
          ) : null}
          {message.text}
        </button>
        ) : null}
        {open ? (
          <p className={`mt-1 px-1 text-[13px] ${mine ? "text-end text-emerald-200" : "text-slate-300"}`} dir="auto">
            {extra ?? (mine ? t.howToSayLoading : t.translating)}
          </p>
        ) : null}
        {open && !mine ? (
          <LineActions
            t={t}
            text={message.text}
            onAsk={(focus) => onQuote(undefined, "", message.text, true, focus)}
            onReply={(focus) => onQuote(undefined, "", message.text, false, focus)}
          />
        ) : null}
        {thankThreadId ? (
          <ThankButton locale={locale} target={{ kind: "dm", threadId: thankThreadId, seq: message.seq }} learn={targetLanguage} />
        ) : null}
        <p className={`mt-0.5 px-1 text-[10px] text-slate-600 ${mine ? "text-end" : ""}`}>
          {time}
          {asked > 0 ? ` · ❓ ${asked}` : ""}
        </p>
      </div>
    </div>
  );
}

function LogLine({
  t,
  line,
  mine,
  locale,
  targetLanguage,
  context,
  onAsk,
}: {
  t: RoomCopy;
  onAsk?: (focus?: string) => void;
  line: { from: string | null; nickname: string; text: string };
  mine: boolean;
  locale: string;
  targetLanguage: string;
  context: string[];
}) {
  const [translation, setTranslation] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <li>
      <button
        type="button"
        onClick={() => {
          setOpen((value) => !value);
          if (translation === null) {
            void translateLine({ text: line.text, context, locale, targetLanguage }).then(
              (value) => setTranslation(value || t.translateFailed),
              (error: unknown) => setTranslation(aiFailText(t, error)),
            );
          }
        }}
        className="w-full rounded-lg px-2 py-1 text-start hover:bg-white/5"
      >
        <span className={`me-1 text-[11px] ${mine ? "text-violet-300" : "text-sky-300"}`} dir="auto">
          {line.nickname}
        </span>
        <span className="text-sm text-slate-100" dir="auto">
          {line.text}
        </span>
        {open ? (
          <span className="mt-0.5 block text-xs text-slate-400" dir="auto">
            {translation ?? t.translating}
          </span>
        ) : null}
      </button>
      {open && onAsk ? <LineActions t={t} text={line.text} onAsk={onAsk} /> : null}
    </li>
  );
}
