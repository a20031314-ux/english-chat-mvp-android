import { NextRequest } from "next/server";
import { pickIcon } from "@/lib/server/iconPick";
import { isMediaId, MEDIA_PER_POST, type MediaRef } from "@/lib/rooms/media";
import { claimMedia } from "@/lib/server/mediaStore";
import { corsPreflightResponse, jsonWithCors } from "@/lib/server/cors";
import { requestAuth } from "@/lib/server/premiumRequest";
import { readAccount, readAccounts } from "@/lib/server/accountStore";
import { readBlocked, readBlockedMany } from "@/lib/server/socialStore";
import { readContrib } from "@/lib/server/contribStore";
import { boardBoostMs, contribScore } from "@/lib/rooms/contribution";
import {
  addComment,
  createPost,
  deleteComment,
  deletePost,
  editComment,
  editPost,
  listPosts,
  readComments,
  setLike,
  withLikes,
  readPost,
  type WriteResult,
} from "@/lib/server/boardStore";
import {
  BOARD_COMMENT_MAX_CHARS,
  BOARD_POST_MAX_CHARS,
  cleanBoardText,
  isBoardId,
  type BoardAuthor,
} from "@/lib/rooms/board";
import { isLearningLanguageCode } from "@/lib/learningLanguages";
import { suspendedResponse } from "@/lib/server/suspension";

export const dynamic = "force-dynamic";

/**
 * 게시판(rooms/board.ts). 로그인한 사람만 읽고 쓴다. 모델 호출 없음(번역은 /api/translate).
 *
 *   list { language?, offset? }                → { posts, authors }   서로 차단한 사람의 글은 뺀다
 *   open { postId }                            → { post, comments, authors }
 *   post { language, text }                    → { post }             하루 10개
 *   edit { postId, text } · delete { postId }  → 쓴 사람만
 *   comment { postId, text, imageId?, replyTo? } → { comment }        한 시간 60개, 글마다 200개(답글 포함), 답글은 한 단계
 *   editComment { postId, commentId, text }    → 쓴 사람만
 *   deleteComment { postId, commentId }        → 쓴 사람 또는 글쓴이
 */
export async function OPTIONS(request: NextRequest) {
  return corsPreflightResponse(request);
}

const bad = (request: NextRequest, error: string, status = 400) => jsonWithCors(request, { error }, { status });

const STATUS = { LIMIT: 429, NOT_FOUND: 404, FORBIDDEN: 403, FULL: 409 } as const;

function answer<T>(request: NextRequest, result: WriteResult<T>, key: string) {
  if ("error" in result) return bad(request, result.error, STATUS[result.error]);
  return jsonWithCors(request, { [key]: result.ok });
}

/** 글쓴이·댓글 단 사람의 이름. 계정이 없어진 사람은 빼고, 서로 차단한 사람도 뺀다. */
async function authorsOf(me: string, ids: string[]): Promise<{ authors: BoardAuthor[]; hidden: Set<string> }> {
  const unique = [...new Set(ids)];
  const [mine, accounts, theirs] = await Promise.all([readBlocked(me), readAccounts(unique), readBlockedMany(unique)]);
  const hidden = new Set<string>();
  const authors: BoardAuthor[] = [];
  unique.forEach((id, index) => {
    const account = accounts.at(index);
    if (!account || mine.includes(id) || theirs.at(index)?.includes(me)) {
      hidden.add(id);
      return;
    }
    authors.push({ id, nickname: account.profile.nickname || account.username || "" });
  });
  return { authors, hidden };
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return bad(request, "Invalid JSON");
  }
  const auth = requestAuth(request);
  if (!auth) return bad(request, "SIGNED_OUT", 401);
  const me = auth.accountId;
  const action = body.action;

  // 운영자가 사람 기능을 정지한 계정은 쓰기만 막는다(opsStore.ts).
  if (typeof action === "string" && ["post", "edit", "comment", "editComment", "like"].includes(action)) {
    const stop = await suspendedResponse(request, me);
    if (stop) return stop;
  }
  if (action === "list") {
    const language = isLearningLanguageCode(body.language) ? body.language : undefined;
    const offset = typeof body.offset === "number" && Number.isFinite(body.offset) ? body.offset : 0;
    const posts = await listPosts({ language, offset });
    const { authors, hidden } = await authorsOf(me, posts.map((post) => post.author));
    // 다음 쪽은 거르기 전 개수로 넘긴다(차단으로 빠진 글이 있어도 같은 자리부터).
    return jsonWithCors(request, {
      posts: await withLikes(me, posts.filter((post) => !hidden.has(post.author))),
      authors,
      next: offset + posts.length,
    });
  }

  if (action === "post") {
    const text = cleanBoardText(body.text, BOARD_POST_MAX_CHARS);
    if (!isLearningLanguageCode(body.language)) return bad(request, "BAD_LANGUAGE");
    if (!(await readAccount(me))) return bad(request, "SIGNED_OUT", 401);
    // 사진(최대 MEDIA_PER_POST장): 게시판에 올린 내 사진만, 한 번.
    const wanted = Array.isArray(body.imageIds) ? body.imageIds.filter(isMediaId).slice(0, MEDIA_PER_POST) : [];
    const images = (await Promise.all(wanted.map((id) => claimMedia(id, me, { kind: "board" })))).filter((ref): ref is MediaRef => ref !== null);
    if (images.length !== wanted.length) return bad(request, "BAD_IMAGE");
    if (!text && !images.length) return bad(request, "EMPTY");
    // 기여한 사람의 새 글은 처음 몇 시간 위쪽에(hub/drafts/profile-2026-10-23.md, 정렬만 — 비용 없음).
    const boostMs = boardBoostMs(contribScore(await readContrib(me), Date.now()));
    return answer(request, await createPost({ author: me, language: body.language, text, images, boostMs }), "post");
  }

  if (!isBoardId(body.postId)) return bad(request, "BAD_POST");
  const postId = body.postId;

  if (action === "open") {
    const post = await readPost(postId);
    if (!post) return bad(request, "NOT_FOUND", 404);
    const comments = await readComments(postId);
    const { authors, hidden } = await authorsOf(me, [post.author, ...comments.map((comment) => comment.author)]);
    if (hidden.has(post.author) && post.author !== me) return bad(request, "NOT_FOUND", 404);
    const [withCount] = await withLikes(me, [post]);
    return jsonWithCors(request, {
      post: withCount,
      comments: comments.filter((comment) => !hidden.has(comment.author)),
      authors,
    });
  }

  if (action === "edit") {
    const text = cleanBoardText(body.text, BOARD_POST_MAX_CHARS);
    if (!text) return bad(request, "EMPTY");
    return answer(request, await editPost(me, postId, text), "post");
  }
  if (action === "delete") return answer(request, await deletePost(me, postId), "ok");

  // 좋아요 켜기·끄기(2026-10-23). 서로 차단한 사람의 글은 목록·열기에서 안 보이니 따로 막지 않는다.
  if (action === "like") {
    return answer(request, await setLike(me, postId, body.on !== false), "like");
  }

  if (action === "comment") {
    const text = cleanBoardText(body.text, BOARD_COMMENT_MAX_CHARS);
    const image = isMediaId(body.imageId) ? await claimMedia(body.imageId, me, { kind: "board" }) : null;
    if (isMediaId(body.imageId) && !image) return bad(request, "BAD_IMAGE");
    const icon = await pickIcon(me, body.icon);
    if (body.icon && !icon) return bad(request, "BAD_ICON");
    if (!text && !image && !icon) return bad(request, "EMPTY");
    const replyTo = isBoardId(body.replyTo) ? body.replyTo : undefined;
    return answer(
      request,
      await addComment({ author: me, postId, text, ...(image ? { image } : {}), ...(icon ? { icon } : {}), ...(replyTo ? { replyTo } : {}) }),
      "comment",
    );
  }

  if (!isBoardId(body.commentId)) return bad(request, "BAD_COMMENT");
  if (action === "editComment") {
    const text = cleanBoardText(body.text, BOARD_COMMENT_MAX_CHARS);
    if (!text) return bad(request, "EMPTY");
    return answer(request, await editComment(me, postId, body.commentId, text), "comment");
  }
  if (action === "deleteComment") return answer(request, await deleteComment(me, postId, body.commentId), "ok");

  return bad(request, "UNKNOWN_ACTION");
}
