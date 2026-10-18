"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { BodyLayer } from "@/components/FullScreenLayer";
import { readCachedAccount, subscribeSession } from "@/lib/account/session";
import { BOARD_COMMENT_MAX_CHARS, BOARD_POST_MAX_CHARS, type BoardAuthor, type BoardComment, type BoardPost } from "@/lib/rooms/board";
import {
  RoomApiError,
  boardComment,
  boardDelete,
  boardDeleteComment,
  boardEdit,
  boardEditComment,
  boardList,
  boardOpen,
  boardWrite,
  translateLine,
} from "@/lib/rooms/client";
import type { RoomCopy } from "@/lib/rooms/copy";
import { requestDm } from "@/lib/rooms/openDm";
import { Face, ProfileSheet } from "./RoomParts";

/**
 * 게시판(사람 탭의 "게시판" 보기, rooms/board.ts): 최신순 글, 전체 / 내 학습 언어,
 * 글쓰기, 글을 누르면 시트(전체 글·내 언어로 보기·댓글). 고치기·지우기는 쓴 사람에게만 보인다
 * (서버도 같은 규칙). 글쓴이 이름을 누르면 프로필 시트 — 팔로우·메시지·차단·신고(글이 근거로 같이 감).
 */

type Names = Record<string, string>;

const FILTER_KEY = "boardFilter";

function readFilter(): "all" | "mine" {
  try {
    return localStorage.getItem(FILTER_KEY) === "mine" ? "mine" : "all";
  } catch {
    return "all";
  }
}

function when(at: number, locale: string): string {
  try {
    const sameDay = new Date(at).toDateString() === new Date().toDateString();
    return new Intl.DateTimeFormat(locale, sameDay ? { hour: "numeric", minute: "2-digit" } : { month: "short", day: "numeric" }).format(at);
  } catch {
    return "";
  }
}

const merge = (names: Names, authors: BoardAuthor[]): Names => ({
  ...names,
  ...Object.fromEntries(authors.map((author) => [author.id, author.nickname])),
});

export function BoardView({ t, locale, targetLanguage }: { t: RoomCopy; locale: string; targetLanguage: string }) {
  const me = useSyncExternalStore(subscribeSession, () => readCachedAccount()?.id ?? null, () => null);
  const [filter, setFilter] = useState<"all" | "mine">(readFilter);
  const [posts, setPosts] = useState<BoardPost[] | null>(null);
  const [names, setNames] = useState<Names>({});
  const [next, setNext] = useState(0);
  const [more, setMore] = useState(false);
  const [writing, setWriting] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const language = filter === "mine" ? targetLanguage : undefined;
  const load = useCallback(
    async (offset: number) => {
      const body = await boardList({ language, offset });
      setNames((current) => merge(current, body.authors));
      setPosts((current) => (offset === 0 ? body.posts : [...(current ?? []), ...body.posts]));
      setNext(body.next);
      setMore(body.next - offset >= 20);
    },
    [language],
  );

  useEffect(() => {
    let cancelled = false;
    void boardList({ language, offset: 0 })
      .then((body) => {
        if (cancelled) return;
        setNames((current) => merge(current, body.authors));
        setPosts(body.posts);
        setNext(body.next);
        setMore(body.next >= 20);
      })
      .catch(() => {
        if (!cancelled) setPosts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [language]);

  const choose = (value: "all" | "mine") => {
    setFilter(value);
    try {
      localStorage.setItem(FILTER_KEY, value);
    } catch {
      // Kept for this session only.
    }
  };

  return (
    <div>
      <div className="flex items-center gap-1">
        {(["all", "mine"] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => choose(value)}
            className={`rounded-lg px-2.5 py-1 text-caption ${filter === value ? "bg-white/15 text-ink" : "text-slate-400 hover:bg-white/10"}`}
          >
            {value === "all" ? t.filterAll : t.boardMine}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setWriting(true)}
          className="tb-btn ms-auto rounded-lg px-3 py-1.5 text-caption font-semibold"
        >
          {t.boardWrite}
        </button>
      </div>
      <p className="mt-2 text-meta text-slate-500">{t.boardKept}</p>

      {posts === null ? null : posts.length === 0 ? (
        <p className="mt-6 text-center text-note text-slate-400">{t.boardEmpty}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {posts.map((post) => (
            <li key={post.id}>
              <button
                type="button"
                onClick={() => setOpenId(post.id)}
                className="block w-full rounded-xl border border-line bg-surface p-3 text-start"
              >
                <span className="flex items-center gap-2">
                  <Face accountId={post.author} name={names[post.author] ?? ""} size={24} />
                  <span className="min-w-0 flex-1 truncate text-caption text-slate-200">{names[post.author] || "?"}</span>
                  <span className="shrink-0 text-meta text-slate-500">{when(post.at, locale)}</span>
                </span>
                <span dir="auto" className="mt-2 line-clamp-4 block whitespace-pre-wrap text-chat text-ink">
                  {post.text}
                </span>
                <span className="mt-2 block text-meta text-slate-500">
                  {t.boardComments.replace("{n}", String(post.comments))}
                  {post.editedAt ? ` · ${t.boardEdited}` : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {more ? (
        <button
          type="button"
          onClick={() => void load(next)}
          className="mt-3 w-full rounded-lg border border-line py-2 text-caption text-slate-300 hover:bg-white/10"
        >
          {t.boardMore}
        </button>
      ) : null}

      {writing ? (
        <Composer
          t={t}
          title={t.boardWrite}
          initial=""
          max={BOARD_POST_MAX_CHARS}
          submitLabel={t.boardPost}
          onClose={() => setWriting(false)}
          onSubmit={async (text) => {
            const { post } = await boardWrite(targetLanguage, text);
            if (me) setNames((current) => ({ ...current, [me]: current[me] ?? readCachedAccount()?.profile?.nickname ?? "" }));
            setPosts((current) => [post, ...(current ?? [])]);
            setWriting(false);
          }}
        />
      ) : null}

      {openId ? (
        <PostSheet
          t={t}
          locale={locale}
          targetLanguage={targetLanguage}
          me={me}
          postId={openId}
          onClose={() => setOpenId(null)}
          onChanged={(post) =>
            setPosts((current) =>
              (current ?? []).flatMap((row) => (row.id !== openId ? [row] : post ? [post] : [])),
            )
          }
        />
      ) : null}
    </div>
  );
}

function errorText(t: RoomCopy, error: unknown): string {
  if (error instanceof RoomApiError) {
    if (error.code === "LIMIT" || error.code === "FULL") return t.boardLimit;
    if (error.code === "NOT_FOUND") return t.boardGone;
    if (error.code === "SIGNED_OUT") return t.loginNeeded;
  }
  return t.translateFailed;
}

function Sheet({ t, label, onClose, children }: { t: RoomCopy; label: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <BodyLayer>
      <div className="fixed inset-0 z-[80] flex flex-col justify-end bg-black/60 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] sm:items-center sm:justify-center">
        <button type="button" className="absolute inset-0 cursor-default" aria-label={t.back} onClick={onClose} />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className="relative z-10 flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-2xl border border-line bg-surface-sunk"
        >
          {children}
        </div>
      </div>
    </BodyLayer>
  );
}

function Composer({
  t,
  title,
  initial,
  max,
  submitLabel,
  onClose,
  onSubmit,
}: {
  t: RoomCopy;
  title: string;
  initial: string;
  max: number;
  submitLabel: string;
  onClose: () => void;
  onSubmit: (text: string) => Promise<void>;
}) {
  const [text, setText] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async () => {
    if (!text.trim() || busy) return;
    setBusy(true);
    setError("");
    try {
      await onSubmit(text.trim());
    } catch (caught) {
      setError(errorText(t, caught));
      setBusy(false);
    }
  };
  return (
    <Sheet t={t} label={title} onClose={onClose}>
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <h3 className="min-w-0 flex-1 text-title font-semibold text-ink">{title}</h3>
        <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
          {t.cancel}
        </button>
      </div>
      <div className="p-4">
        <textarea
          dir="auto"
          value={text}
          maxLength={max}
          onChange={(event) => setText(event.target.value)}
          placeholder={t.boardPlaceholder}
          rows={7}
          autoFocus
          className="w-full resize-none rounded-lg border border-line bg-surface px-3 py-2 text-chat text-ink placeholder:text-slate-500"
        />
        <div className="mt-2 flex items-center gap-2">
          <span className="text-meta tabular-nums text-slate-500">
            {Array.from(text).length}/{max}
          </span>
          {error ? <span className="min-w-0 flex-1 text-caption text-bad">{error}</span> : <span className="flex-1" />}
          <button
            type="button"
            disabled={!text.trim() || busy}
            onClick={() => void submit()}
            className="tb-btn rounded-lg px-4 py-2 text-note font-semibold disabled:opacity-40"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </Sheet>
  );
}

function PostSheet({
  t,
  locale,
  targetLanguage,
  me,
  postId,
  onClose,
  onChanged,
}: {
  t: RoomCopy;
  locale: string;
  targetLanguage: string;
  me: string | null;
  postId: string;
  onClose: () => void;
  /** 고쳤으면 새 글, 지웠으면 null. */
  onChanged: (post: BoardPost | null) => void;
}) {
  const [post, setPost] = useState<BoardPost | null>(null);
  const [comments, setComments] = useState<BoardComment[]>([]);
  const [names, setNames] = useState<Names>({});
  const [gone, setGone] = useState(false);
  const [translated, setTranslated] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<{ kind: "post" } | { kind: "comment"; id: string; text: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [profile, setProfile] = useState<{ id: string; lines: string[] } | null>(null);

  useEffect(() => {
    let cancelled = false;
    void boardOpen(postId)
      .then((body) => {
        if (cancelled) return;
        setPost(body.post);
        setComments(body.comments);
        setNames(merge({}, body.authors));
      })
      .catch(() => {
        if (!cancelled) setGone(true);
      });
    return () => {
      cancelled = true;
    };
  }, [postId]);

  const translate = async (key: string, text: string) => {
    if (translated[key]) {
      setTranslated((current) => Object.fromEntries(Object.entries(current).filter(([id]) => id !== key)));
      return;
    }
    setTranslated((current) => ({ ...current, [key]: t.translating }));
    const value = await translateLine({ text, context: post && key !== post.id ? [post.text] : [], locale, targetLanguage }).catch(() => "");
    setTranslated((current) => ({ ...current, [key]: value || t.translateFailed }));
  };

  const send = async () => {
    if (!post || !draft.trim() || busy) return;
    setBusy(true);
    setError("");
    try {
      const { comment } = await boardComment(post.id, draft.trim());
      if (me) setNames((current) => ({ ...current, [me]: current[me] ?? readCachedAccount()?.profile?.nickname ?? "" }));
      setComments((current) => [...current, comment]);
      const next = { ...post, comments: post.comments + 1 };
      setPost(next);
      onChanged(next);
      setDraft("");
    } catch (caught) {
      setError(errorText(t, caught));
    } finally {
      setBusy(false);
    }
  };

  const removeComment = async (comment: BoardComment) => {
    if (!post) return;
    try {
      await boardDeleteComment(post.id, comment.id);
      setComments((current) => current.filter((row) => row.id !== comment.id));
      const next = { ...post, comments: Math.max(0, post.comments - 1) };
      setPost(next);
      onChanged(next);
    } catch (caught) {
      setError(errorText(t, caught));
    }
  };

  const mine = Boolean(post && me && post.author === me);

  return (
    <Sheet t={t} label={t.boardTab} onClose={onClose}>
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <h3 className="min-w-0 flex-1 text-title font-semibold text-ink">{t.boardTab}</h3>
        <button type="button" onClick={onClose} aria-label={t.back} className="rounded-lg px-2 py-1 text-note text-slate-400 hover:bg-white/10">
          ✕
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
        {gone ? <p className="text-note text-slate-400">{t.boardGone}</p> : null}
        {post ? (
          <>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={mine}
                onClick={() => setProfile({ id: post.author, lines: [post.text] })}
                className="flex min-w-0 flex-1 items-center gap-2 text-start"
              >
                <Face accountId={post.author} name={names[post.author] ?? ""} size={32} />
                <span className="min-w-0">
                  <span className="block truncate text-note font-semibold text-ink">{names[post.author] || "?"}</span>
                  <span className="block text-meta text-slate-500">
                    {when(post.at, locale)}
                    {post.editedAt ? ` · ${t.boardEdited}` : ""}
                  </span>
                </span>
              </button>
              {mine ? (
                <>
                  <button type="button" onClick={() => setEditing({ kind: "post" })} className="rounded-lg px-2 py-1 text-caption text-slate-300 hover:bg-white/10">
                    {t.boardEdit}
                  </button>
                  <button type="button" onClick={() => setConfirmDelete(true)} className="rounded-lg px-2 py-1 text-caption text-bad hover:bg-bad/15">
                    {t.boardDelete}
                  </button>
                </>
              ) : null}
            </div>
            {confirmDelete ? (
              <div className="mt-3 rounded-lg border border-bad/30 bg-bad/15 p-3">
                <p className="text-note text-ink">{t.boardDeleteConfirm}</p>
                <div className="mt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setConfirmDelete(false)} className="rounded-lg px-3 py-1.5 text-caption text-slate-300 hover:bg-white/10">
                    {t.cancel}
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await boardDelete(post.id);
                        onChanged(null);
                        onClose();
                      } catch (caught) {
                        setError(errorText(t, caught));
                      }
                    }}
                    className="rounded-lg bg-bad/30 px-3 py-1.5 text-caption font-semibold text-ink"
                  >
                    {t.boardDelete}
                  </button>
                </div>
              </div>
            ) : null}
            <p dir="auto" className="mt-3 whitespace-pre-wrap text-chat leading-relaxed text-ink">
              {post.text}
            </p>
            <button type="button" onClick={() => void translate(post.id, post.text)} className="mt-2 text-caption text-info">
              {t.boardTranslate}
            </button>
            {translated[post.id] ? <p className="mt-1 whitespace-pre-wrap text-note text-slate-300">{translated[post.id]}</p> : null}

            <p className="mt-5 text-meta font-semibold tracking-wide text-slate-500">
              {t.boardComments.replace("{n}", String(comments.length))}
            </p>
            <ul className="mt-2 space-y-2">
              {comments.map((comment) => {
                const own = me === comment.author;
                return (
                  <li key={comment.id} className="rounded-lg bg-white/[0.04] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={own}
                        onClick={() => setProfile({ id: comment.author, lines: [comment.text] })}
                        className="flex min-w-0 flex-1 items-center gap-2 text-start"
                      >
                        <Face accountId={comment.author} name={names[comment.author] ?? ""} size={20} />
                        <span className="truncate text-caption text-slate-200">{names[comment.author] || "?"}</span>
                        <span className="shrink-0 text-meta text-slate-500">
                          {when(comment.at, locale)}
                          {comment.editedAt ? ` · ${t.boardEdited}` : ""}
                        </span>
                      </button>
                      {own ? (
                        <button
                          type="button"
                          onClick={() => setEditing({ kind: "comment", id: comment.id, text: comment.text })}
                          className="text-meta text-slate-400"
                        >
                          {t.boardEdit}
                        </button>
                      ) : null}
                      {own || mine ? (
                        <button type="button" onClick={() => void removeComment(comment)} className="text-meta text-bad">
                          {t.boardDelete}
                        </button>
                      ) : null}
                    </div>
                    <button type="button" onClick={() => void translate(comment.id, comment.text)} className="mt-1 block w-full text-start">
                      <span dir="auto" className="block whitespace-pre-wrap text-note text-ink">
                        {comment.text}
                      </span>
                      {translated[comment.id] ? (
                        <span className="mt-1 block whitespace-pre-wrap text-caption text-slate-400">{translated[comment.id]}</span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        ) : null}
      </div>
      {post ? (
        <div className="border-t border-line p-3">
          {error ? <p className="mb-2 text-caption text-bad">{error}</p> : null}
          <div className="flex items-end gap-2">
            <textarea
              dir="auto"
              value={draft}
              maxLength={BOARD_COMMENT_MAX_CHARS}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={t.writeComment}
              rows={1}
              className="min-h-10 flex-1 resize-none rounded-lg border border-line bg-surface px-3 py-2 text-note text-ink placeholder:text-slate-500"
            />
            <button
              type="button"
              disabled={!draft.trim() || busy}
              onClick={() => void send()}
              className="tb-btn rounded-lg px-3 py-2 text-caption font-semibold disabled:opacity-40"
            >
              {t.send}
            </button>
          </div>
        </div>
      ) : null}

      {editing && post ? (
        <Composer
          t={t}
          title={t.boardEdit}
          initial={editing.kind === "post" ? post.text : editing.text}
          max={editing.kind === "post" ? BOARD_POST_MAX_CHARS : BOARD_COMMENT_MAX_CHARS}
          submitLabel={t.boardSave}
          onClose={() => setEditing(null)}
          onSubmit={async (text) => {
            if (editing.kind === "post") {
              const { post: next } = await boardEdit(post.id, text);
              const kept = { ...next, comments: post.comments };
              setPost(kept);
              onChanged(kept);
            } else {
              const { comment } = await boardEditComment(post.id, editing.id, text);
              setComments((current) => current.map((row) => (row.id === comment.id ? comment : row)));
            }
            setTranslated({});
            setEditing(null);
          }}
        />
      ) : null}

      {profile ? (
        <ProfileSheet
          t={t}
          locale={locale}
          member={null}
          accountId={profile.id}
          nickname={names[profile.id] ?? ""}
          isHostView={false}
          roomId=""
          recentLines={profile.lines}
          onClose={() => setProfile(null)}
          onGrant={() => {}}
          onBlockedChange={() => {
            setProfile(null);
            onClose();
          }}
          onMessage={(id) => {
            setProfile(null);
            onClose();
            requestDm(id);
          }}
        />
      ) : null}
    </Sheet>
  );
}
