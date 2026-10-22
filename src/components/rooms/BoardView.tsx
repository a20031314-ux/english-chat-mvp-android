"use client";

import { Fragment, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { NativeAdSlot } from "@/components/NativeAdSlot";
import { MediaImage, MediaThumb } from "./MediaImage";
import { MEDIA_PER_POST, type MediaRef, type MediaScope } from "@/lib/rooms/media";
import { MediaError, uploadImage } from "@/lib/rooms/mediaClient";
import { BodyLayer } from "@/components/FullScreenLayer";
import { readCachedAccount, subscribeSession } from "@/lib/account/session";
import { LikeButton, ThankButton } from "@/components/account/ProfileFacts";
import { seeInLanguage } from "@/lib/account/profileCopy";
import { BOARD_COMMENT_MAX_CHARS, BOARD_POST_MAX_CHARS, threadComments, withReplies, type BoardAuthor, type BoardComment, type BoardPost } from "@/lib/rooms/board";
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
  translateLine, aiFailText } from "@/lib/rooms/client";
import type { RoomCopy } from "@/lib/rooms/copy";
import { requestDm } from "@/lib/rooms/openDm";
import { Face, ProfileSheet, photoErrorText } from "./RoomParts";

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

      {posts === null ? null : posts.length === 0 ? (
        <p className="mt-6 text-center text-note text-slate-400">{t.boardEmpty}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {posts.map((post, index) => (
            <Fragment key={post.id}>
            {/* 세 번째 글 뒤에 네이티브 광고 하나(무료·안드로이드만, lib/ads.ts). 글을 열면 시트가 덮어 멈춘다. */}
            {index === 3 ? (
              <li>
                <NativeAdSlot feedId="people-tab" slotKey="board-after-3" />
              </li>
            ) : null}
            <li className="rounded-xl border border-line bg-surface">
              <button
                type="button"
                onClick={() => setOpenId(post.id)}
                className="block w-full p-3 pb-1 text-start"
              >
                <span className="flex items-center gap-2">
                  <Face accountId={post.author} name={names[post.author] ?? ""} size={24} />
                  <span className="min-w-0 flex-1 truncate text-caption text-slate-200">{names[post.author] || "?"}</span>
                  <span className="shrink-0 text-meta text-slate-500">{when(post.at, locale)}</span>
                </span>
                <span dir="auto" className="mt-2 line-clamp-4 block whitespace-pre-wrap text-chat text-ink">
                  {post.text}
                </span>
                {/* 사진이 있으면 작게 세 장까지(누르면 글이 열리고 크게 볼 수 있다). */}
                {post.images?.length ? (
                  <span className="mt-2 flex gap-1.5">
                    {post.images.slice(0, 3).map((image) => (
                      <MediaThumb key={image.id} image={image} size={post.images!.length === 1 ? 160 : 88} />
                    ))}
                  </span>
                ) : null}
              </button>
              {/* 좋아요는 글 열기 버튼 밖에(버튼 안에 버튼을 두지 않게). */}
              <div className="flex items-center gap-2 px-3 pb-2 text-meta text-slate-500">
                <LikeButton
                  key={`${post.id}:${post.likes ?? 0}:${post.liked ? 1 : 0}`}
                  locale={locale}
                  postId={post.id}
                  likes={post.likes ?? 0}
                  liked={post.liked === true}
                  onChange={(like) => setPosts((list) => (list ?? []).map((item) => (item.id === post.id ? { ...item, ...like } : item)))}
                />
                <span>
                  {post.images?.length ? `📷 ${post.images.length} · ` : ""}
                  {t.boardComments.replace("{n}", String(post.comments))}
                  {post.editedAt ? ` · ${t.boardEdited}` : ""}
                </span>
              </div>
            </li>
            </Fragment>
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
          maxPhotos={MEDIA_PER_POST}
          onClose={() => setWriting(false)}
          onSubmit={async (text, images) => {
            const { post } = await boardWrite(targetLanguage, text, images.map((image) => image.id));
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
    if (error.code === "AI_HELP_LIMIT") return t.aiHelpLimit;
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
  maxPhotos = 0,
}: {
  t: RoomCopy;
  title: string;
  initial: string;
  max: number;
  submitLabel: string;
  onClose: () => void;
  /** images: 붙인 사진(올린 뒤). 고치기 창은 사진을 안 받는다(maxPhotos 0). */
  onSubmit: (text: string, images: MediaRef[]) => Promise<void>;
  maxPhotos?: number;
}) {
  const [text, setText] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const photos = usePhotoPicks(maxPhotos);
  const submit = async () => {
    if ((!text.trim() && !photos.picks.length) || busy) return;
    setBusy(true);
    setError("");
    let images: MediaRef[] = [];
    try {
      images = await photos.upload({ kind: "board" });
    } catch (caught) {
      setError(caught instanceof MediaError ? photoErrorText(t, caught.code) : t.photoFailed);
      setBusy(false);
      return;
    }
    try {
      await onSubmit(text.trim(), images);
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
          rows={7}
          autoFocus
          className="w-full resize-none rounded-lg border border-line bg-surface px-3 py-2 text-chat text-ink placeholder:text-slate-500"
        />
        {maxPhotos ? <PhotoPicks t={t} photos={photos} busy={busy} /> : null}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-meta tabular-nums text-slate-500">
            {Array.from(text).length}/{max}
          </span>
          {error ? <span className="min-w-0 flex-1 text-caption text-bad">{error}</span> : <span className="flex-1" />}
          <button
            type="button"
            disabled={(!text.trim() && !photos.picks.length) || busy}
            onClick={() => void submit()}
            className="tb-btn rounded-lg px-4 py-2 text-note font-semibold disabled:opacity-40"
          >
            {busy && photos.picks.length ? t.photoUploading : submitLabel}
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
  // 댓글 사진 한 장.
  const commentPhoto = usePhotoPicks(1);
  // 답글을 다는 중이면 답하는 댓글(답글에 답해도 맨 위 댓글 아래로 — 서버가 정함).
  const [replying, setReplying] = useState<{ id: string; name: string } | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
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
    const value = await translateLine({ text, context: post && key !== post.id ? [post.text] : [], locale, targetLanguage }).catch((error: unknown) => aiFailText(t, error));
    setTranslated((current) => ({ ...current, [key]: value || t.translateFailed }));
  };

  const send = async () => {
    if (!post || (!draft.trim() && !commentPhoto.picks.length) || busy) return;
    setBusy(true);
    setError("");
    try {
      let image: MediaRef | undefined;
      try {
        image = (await commentPhoto.upload({ kind: "board" }))[0];
      } catch (caught) {
        setError(caught instanceof MediaError ? photoErrorText(t, caught.code) : t.photoFailed);
        return;
      }
      const { comment } = await boardComment(post.id, draft.trim(), image?.id, replying?.id);
      if (me) setNames((current) => ({ ...current, [me]: current[me] ?? readCachedAccount()?.profile?.nickname ?? "" }));
      setComments((current) => [...current, comment]);
      const next = { ...post, comments: post.comments + 1 };
      setPost(next);
      onChanged(next);
      setDraft("");
      setReplying(null);
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
      // 맨 위 댓글이면 답글도 같이 지워진다(서버와 같게).
      const gone = withReplies(comments, new Set([comment.id]));
      setComments((current) => current.filter((row) => !gone.has(row.id)));
      if (replying && gone.has(replying.id)) setReplying(null);
      const next = { ...post, comments: Math.max(0, post.comments - gone.size) };
      setPost(next);
      onChanged(next);
    } catch (caught) {
      setError(errorText(t, caught));
    }
  };

  const mine = Boolean(post && me && post.author === me);

  const renderComment = (comment: BoardComment, isReply: boolean) => {
    const own = me === comment.author;
    // 내 글의 댓글, 또는 내 댓글 아래 답글이면 질문한 나에게 "도움됐어요"(서버가 다시 확인).
    const parentAuthor = comment.parent ? comments.find((row) => row.id === comment.parent)?.author : undefined;
    const canThank = Boolean(post && me && !own && (mine || parentAuthor === me));
    return (
      <li key={comment.id} className={`rounded-lg bg-white/[0.04] px-3 py-2 ${isReply ? "ms-6" : ""}`}>
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
          <button
            type="button"
            onClick={() => {
              const name = names[comment.author] || "?";
              setReplying({ id: comment.id, name });
              // 답글에 답할 때는 누구에게 하는 말인지 앞에 붙여 둔다(한 단계라 같은 줄 아래로 모임).
              if (isReply && !own) setDraft((current) => (current.trim() ? current : `@${name} `));
              inputRef.current?.focus();
            }}
            className="text-meta text-slate-400"
          >
            {t.boardReply}
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
        {comment.image ? (
          <div className="mt-1">
            <MediaImage image={comment.image} t={t} maxWidth={200} />
          </div>
        ) : null}
        {comment.text ? (
        <button type="button" onClick={() => void translate(comment.id, comment.text)} className="mt-1 block w-full text-start">
          <span dir="auto" className="block whitespace-pre-wrap text-note text-ink">
            {comment.text}
          </span>
          {translated[comment.id] ? (
            <span className="mt-1 block whitespace-pre-wrap text-caption text-slate-400">{translated[comment.id]}</span>
          ) : null}
        </button>
        ) : null}
        {canThank && post ? (
          <ThankButton locale={locale} target={{ kind: "board", postId: post.id, commentId: comment.id }} learn={targetLanguage} />
        ) : null}
      </li>
    );
  };


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
            {post.text ? (
              <p dir="auto" className="mt-3 whitespace-pre-wrap text-chat leading-relaxed text-ink">
                {post.text}
              </p>
            ) : null}
            {post.images?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {post.images.map((image) => (
                  <MediaImage key={image.id} image={image} t={t} maxWidth={post.images!.length > 1 ? 150 : 320} />
                ))}
              </div>
            ) : null}
            {/* 앱 언어로 쓴 글을 같은 언어로 번역하면 말투만 바뀌어 나온다 — 그때는 버튼을 숨긴다. */}
            {post.language !== locale ? (
              <button type="button" onClick={() => void translate(post.id, post.text)} className="mt-2 text-caption text-info">
                {seeInLanguage(locale)}
              </button>
            ) : null}
            {translated[post.id] ? <p className="mt-1 whitespace-pre-wrap text-note text-slate-300">{translated[post.id]}</p> : null}
            <div className="mt-3">
              <LikeButton
                key={`${post.id}:${post.likes ?? 0}:${post.liked ? 1 : 0}`}
                locale={locale}
                postId={post.id}
                likes={post.likes ?? 0}
                liked={post.liked === true}
                onChange={(like) => {
                  const next = { ...post, ...like };
                  setPost(next);
                  onChanged(next);
                }}
              />
            </div>

            <p className="mt-5 text-meta font-semibold tracking-wide text-slate-500">
              {t.boardComments.replace("{n}", String(comments.length))}
            </p>
            <ul className="mt-2 space-y-2">
              {threadComments(comments).flatMap(({ comment, replies }) => [
                renderComment(comment, false),
                ...replies.map((reply) => renderComment(reply, true)),
              ])}
            </ul>
          </>
        ) : null}
      </div>
      {post ? (
        <div className="border-t border-line p-3">
          {error ? <p className="mb-2 text-caption text-bad">{error}</p> : null}
          {replying ? (
            <div className="mb-2 flex items-center gap-2 rounded-lg bg-info/15 px-3 py-1.5 text-caption text-info">
              <span className="min-w-0 flex-1 truncate">↳ {t.boardReplyingTo.replace("{name}", replying.name)}</span>
              <button type="button" onClick={() => setReplying(null)} className="shrink-0 text-slate-300">
                {t.cancel}
              </button>
            </div>
          ) : null}
          <PhotoPicks t={t} photos={commentPhoto} busy={busy} compact />
          <div className="flex items-end gap-2">
            <PhotoButton t={t} photos={commentPhoto} disabled={busy} />
            <textarea
              ref={inputRef}
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
              disabled={(!draft.trim() && !commentPhoto.picks.length) || busy}
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
              const kept = { ...next, comments: post.comments, likes: post.likes, liked: post.liked };
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

type PhotoPickState = ReturnType<typeof usePhotoPicks>;

/** 고른 사진(아직 안 올림). 보낼 때 upload()로 올려 MediaRef로. */
function usePhotoPicks(max: number) {
  const [picks, setPicks] = useState<{ file: File; preview: string }[]>([]);
  useEffect(() => () => picks.forEach((pick) => URL.revokeObjectURL(pick.preview)), [picks]);
  return {
    max,
    picks,
    add(files: FileList | null) {
      const chosen = Array.from(files ?? []).filter((file) => file.type.startsWith("image/"));
      setPicks((current) => [...current, ...chosen.map((file) => ({ file, preview: URL.createObjectURL(file) }))].slice(0, max));
    },
    remove(index: number) {
      setPicks((current) => current.filter((_, i) => i !== index));
    },
    async upload(scope: MediaScope): Promise<MediaRef[]> {
      const refs: MediaRef[] = [];
      for (const pick of picks) refs.push(await uploadImage(scope, pick.file));
      setPicks([]);
      return refs;
    },
  };
}

function PhotoButton({ t, photos, disabled }: { t: RoomCopy; photos: PhotoPickState; disabled?: boolean }) {
  const picker = useRef<HTMLInputElement>(null);
  if (!photos.max) return null;
  return (
    <>
      <input
        ref={picker}
        type="file"
        accept="image/*"
        multiple={photos.max > 1}
        className="hidden"
        onChange={(event) => {
          photos.add(event.target.files);
          event.target.value = "";
        }}
      />
      <button
        type="button"
        disabled={disabled || photos.picks.length >= photos.max}
        onClick={() => picker.current?.click()}
        aria-label={t.photoAttach}
        title={t.photoAttach}
        className="shrink-0 rounded-lg border border-line px-2.5 py-2 text-chat disabled:opacity-40"
      >
        📷
      </button>
    </>
  );
}

function PhotoPicks({ t, photos, busy, compact = false }: { t: RoomCopy; photos: PhotoPickState; busy: boolean; compact?: boolean }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${compact ? (photos.picks.length ? "mb-2" : "") : "mt-2"}`}>
      {compact ? null : <PhotoButton t={t} photos={photos} disabled={busy} />}
      {photos.picks.map((pick, index) => (
        <span key={pick.preview} className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element -- 고른 사진 미리보기(blob:) */}
          <img src={pick.preview} alt="" className="h-14 w-14 rounded-lg object-cover" />
          <button
            type="button"
            disabled={busy}
            onClick={() => photos.remove(index)}
            aria-label={t.photoRemove}
            className="absolute -end-1.5 -top-1.5 rounded-full bg-black/80 px-1.5 text-meta text-white"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}
