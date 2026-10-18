import {
  kvDelete,
  kvGetJson,
  kvGetJsonMany,
  kvIncrBy,
  kvListPush,
  kvListRange,
  kvSetJson,
  kvZAdd,
  kvZRem,
  kvZRevRange,
} from "./kv.ts";
import {
  BOARD_COMMENTS_PER_HOUR,
  BOARD_MAX_COMMENTS,
  BOARD_PAGE,
  BOARD_POSTS_PER_DAY,
  canDeleteComment,
  canEditPost,
  newBoardId,
  type BoardComment,
  type BoardPost,
} from "../rooms/board.ts";

/**
 * 게시판 저장(rooms/board.ts). KV:
 *   board:v1:post:<id>          글 JSON (쓴 사람이 지울 때까지, 기한 없음)
 *   board:v1:c:<id>             댓글 목록(JSON 줄, 고치거나 지우면 목록을 다시 씀)
 *   board:v1:all                ZSET 모든 글(점수 = 올린 시각)
 *   board:v1:lang:<언어>        ZSET 그 학습 언어 글
 *   board:v1:by:<계정>          ZSET 그 사람의 글 — 계정 삭제 때
 *   board:v1:commented:<계정>   ZSET 그 사람이 댓글 단 글 — 계정 삭제 때
 */
const postKey = (id: string) => `board:v1:post:${id}`;
const commentsKey = (id: string) => `board:v1:c:${id}`;
const ALL = "board:v1:all";
const langKey = (language: string) => `board:v1:lang:${language}`;
const byKey = (account: string) => `board:v1:by:${account}`;
const commentedKey = (account: string) => `board:v1:commented:${account}`;
/** 댓글 목록은 기한 없이(글이 지워질 때 같이 지움) — 목록 쓰기에 기한이 꼭 필요해서 10년. */
const KEEP_SECONDS = 10 * 365 * 24 * 60 * 60;
const dayKey = (account: string) => `board:v1:n:${account}:${new Date().toISOString().slice(0, 10)}`;
const hourKey = (account: string) => `board:v1:cn:${account}:${new Date().toISOString().slice(0, 13)}`;

function parseComments(rows: string[]): BoardComment[] {
  const out: BoardComment[] = [];
  for (const row of rows) {
    try {
      const comment = JSON.parse(row) as BoardComment;
      if (comment && typeof comment.id === "string" && typeof comment.text === "string") out.push(comment);
    } catch {
      // A broken line is skipped, not shown.
    }
  }
  return out;
}

export async function readPost(id: string): Promise<BoardPost | null> {
  return kvGetJson<BoardPost>(postKey(id));
}

export async function readComments(id: string): Promise<BoardComment[]> {
  return parseComments(await kvListRange(commentsKey(id), 0, -1));
}

/** 최신순 한 쪽. before를 주면 그보다 오래된 것부터(더 보기). */
export async function listPosts(input: { language?: string; offset?: number }): Promise<BoardPost[]> {
  const offset = Math.max(0, Math.floor(input.offset ?? 0));
  const rows = await kvZRevRange(input.language ? langKey(input.language) : ALL, offset, offset + BOARD_PAGE - 1);
  if (!rows.length) return [];
  const posts = await kvGetJsonMany<BoardPost>(rows.map((row) => postKey(row.member)));
  return posts.filter((post): post is BoardPost => post !== null);
}

export type WriteResult<T> = { ok: T } | { error: "LIMIT" | "NOT_FOUND" | "FORBIDDEN" | "FULL" };

export async function createPost(input: { author: string; language: string; text: string }): Promise<WriteResult<BoardPost>> {
  if ((await kvIncrBy(dayKey(input.author), 1, 2 * 24 * 60 * 60)) > BOARD_POSTS_PER_DAY) return { error: "LIMIT" };
  const post: BoardPost = { id: newBoardId(), author: input.author, language: input.language, text: input.text, at: Date.now(), comments: 0 };
  await kvSetJson(postKey(post.id), post);
  await Promise.all([
    kvZAdd(ALL, post.at, post.id),
    kvZAdd(langKey(post.language), post.at, post.id),
    kvZAdd(byKey(post.author), post.at, post.id),
  ]);
  return { ok: post };
}

export async function editPost(me: string, id: string, text: string): Promise<WriteResult<BoardPost>> {
  const post = await readPost(id);
  if (!post) return { error: "NOT_FOUND" };
  if (!canEditPost(me, post)) return { error: "FORBIDDEN" };
  const next = { ...post, text, editedAt: Date.now() };
  await kvSetJson(postKey(id), next);
  return { ok: next };
}

async function removePost(post: BoardPost): Promise<void> {
  await kvDelete([postKey(post.id), commentsKey(post.id)]);
  await Promise.all([kvZRem(ALL, post.id), kvZRem(langKey(post.language), post.id), kvZRem(byKey(post.author), post.id)]);
}

export async function deletePost(me: string, id: string): Promise<WriteResult<true>> {
  const post = await readPost(id);
  if (!post) return { error: "NOT_FOUND" };
  if (!canEditPost(me, post)) return { error: "FORBIDDEN" };
  await removePost(post);
  return { ok: true };
}

async function writeComments(post: BoardPost, comments: BoardComment[]): Promise<void> {
  await kvDelete([commentsKey(post.id)]);
  if (comments.length) await kvListPush(commentsKey(post.id), comments.map((comment) => JSON.stringify(comment)), KEEP_SECONDS);
  await kvSetJson(postKey(post.id), { ...post, comments: comments.length });
}

export async function addComment(input: { author: string; postId: string; text: string }): Promise<WriteResult<BoardComment>> {
  const post = await readPost(input.postId);
  if (!post) return { error: "NOT_FOUND" };
  if (post.comments >= BOARD_MAX_COMMENTS) return { error: "FULL" };
  if ((await kvIncrBy(hourKey(input.author), 1, 2 * 60 * 60)) > BOARD_COMMENTS_PER_HOUR) return { error: "LIMIT" };
  const comment: BoardComment = { id: newBoardId(), author: input.author, text: input.text, at: Date.now() };
  await kvListPush(commentsKey(post.id), [JSON.stringify(comment)], KEEP_SECONDS);
  // 개수는 목록 길이에서 다시 센다(동시에 둘이 달아도 맞게).
  const count = (await kvListRange(commentsKey(post.id), 0, -1)).length;
  await kvSetJson(postKey(post.id), { ...post, comments: count });
  await kvZAdd(commentedKey(input.author), comment.at, post.id);
  return { ok: comment };
}

export async function editComment(me: string, postId: string, commentId: string, text: string): Promise<WriteResult<BoardComment>> {
  const post = await readPost(postId);
  if (!post) return { error: "NOT_FOUND" };
  const comments = await readComments(postId);
  const found = comments.find((comment) => comment.id === commentId);
  if (!found) return { error: "NOT_FOUND" };
  if (found.author !== me) return { error: "FORBIDDEN" };
  const next = { ...found, text, editedAt: Date.now() };
  await writeComments(post, comments.map((comment) => (comment.id === commentId ? next : comment)));
  return { ok: next };
}

export async function deleteComment(me: string, postId: string, commentId: string): Promise<WriteResult<true>> {
  const post = await readPost(postId);
  if (!post) return { error: "NOT_FOUND" };
  const comments = await readComments(postId);
  const found = comments.find((comment) => comment.id === commentId);
  if (!found) return { error: "NOT_FOUND" };
  if (!canDeleteComment(me, post, found)) return { error: "FORBIDDEN" };
  await writeComments(post, comments.filter((comment) => comment.id !== commentId));
  return { ok: true };
}

/** 계정을 지울 때: 그 사람의 글(댓글 포함)과 다른 글에 단 댓글. */
export async function forgetBoard(account: string): Promise<void> {
  const mine = await kvZRevRange(byKey(account), 0, -1);
  const posts = await kvGetJsonMany<BoardPost>(mine.map((row) => postKey(row.member)));
  for (const post of posts) if (post) await removePost(post);
  const commented = await kvZRevRange(commentedKey(account), 0, -1);
  for (const row of commented) {
    const post = await readPost(row.member);
    if (!post) continue;
    const comments = await readComments(post.id);
    const kept = comments.filter((comment) => comment.author !== account);
    if (kept.length !== comments.length) await writeComments(post, kept);
  }
  await kvDelete([byKey(account), commentedKey(account)]);
}
