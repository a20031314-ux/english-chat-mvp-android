import type { MediaRef } from "../rooms/media.ts";
import { deleteMedia } from "./mediaStore.ts";
import {
  kvDelete,
  kvGetJson,
  kvGetJsonMany,
  kvGetNumbers,
  kvIncrBy,
  kvSetJsonIfAbsent,
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
  replyRoot,
  topicOf,
  type BoardTopic,
  withReplies,
  type BoardComment,
  type BoardPost,
} from "../rooms/board.ts";
import { BOARD_BOOST_MAX_MS } from "../rooms/contribution.ts";

/**
 * 게시판 저장(rooms/board.ts). KV:
 *   board:v1:post:<id>          글 JSON (쓴 사람이 지울 때까지, 기한 없음)
 *   board:v1:c:<id>             댓글 목록(JSON 줄, 고치거나 지우면 목록을 다시 씀)
 *   board:v1:all                ZSET 모든 글(점수 = 올린 시각)
 *   board:v1:lang:<언어>        ZSET 그 학습 언어 글
 *   board:v1:lang:<언어>:t:<주제> ZSET 그 언어·주제 글(2026-10-25). 옛 글(주제 없음)은 그 언어를 처음 주제로 열 때 "free"에 넣는다
 *   board:v1:tidx:<언어>        그 언어의 옛 글을 주제 목록에 넣었는지(있으면 넣음)
 *   board:v1:by:<계정>          ZSET 그 사람의 글 — 계정 삭제 때
 *   board:v1:commented:<계정>   ZSET 그 사람이 댓글 단 글 — 계정 삭제 때
 *   board:v1:likes:<id>         좋아요 수(숫자)
 *   board:v1:liked:<id>:<계정>  그 사람이 눌렀는지(있으면 누름)
 *   board:v1:likers:<id>        ZSET 누른 사람 — 글을 지울 때 표시를 같이 지우려고
 *   board:v1:likedby:<계정>     ZSET 내가 누른 글 — 계정 삭제 때 수를 되돌리려고
 */
const postKey = (id: string) => `board:v1:post:${id}`;
const commentsKey = (id: string) => `board:v1:c:${id}`;
const ALL = "board:v1:all";
const langKey = (language: string) => `board:v1:lang:${language}`;
const topicKey = (language: string, topic: BoardTopic) => `board:v1:lang:${language}:t:${topic}`;
const topicIndexedKey = (language: string) => `board:v1:tidx:${language}`;
const byKey = (account: string) => `board:v1:by:${account}`;
const commentedKey = (account: string) => `board:v1:commented:${account}`;
const likesKey = (id: string) => `board:v1:likes:${id}`;
const likedKey = (id: string, account: string) => `board:v1:liked:${id}:${account}`;
const likersKey = (id: string) => `board:v1:likers:${id}`;
const likedByKey = (account: string) => `board:v1:likedby:${account}`;
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

/**
 * 주제 목록이 생기기 전(2026-10-25) 글은 주제 목록에 없다 — 그 언어를 처음 주제로 열 때 한 번 "free"에 넣는다
 * (새 글은 올릴 때 바로 들어간다. 겹쳐 넣어도 ZSET이라 하나).
 */
async function ensureTopicIndex(language: string): Promise<void> {
  if (!(await kvSetJsonIfAbsent(topicIndexedKey(language), 1, KEEP_SECONDS))) return;
  const rows = await kvZRevRange(langKey(language), 0, -1);
  if (!rows.length) return;
  const posts = await kvGetJsonMany<BoardPost>(rows.map((row) => postKey(row.member)));
  await Promise.all(
    posts.map((post, index) => (post ? kvZAdd(topicKey(language, topicOf(post)), rows[index]!.score, post.id) : Promise.resolve())),
  );
}

/** 최신순 한 쪽(offset부터 BOARD_PAGE개). 주제는 언어와 같이 줄 때만(언어마다 게시판 하나). */
export async function listPosts(input: { language?: string; topic?: BoardTopic; offset?: number }): Promise<BoardPost[]> {
  const offset = Math.max(0, Math.floor(input.offset ?? 0));
  let key = input.language ? langKey(input.language) : ALL;
  if (input.language && input.topic) {
    await ensureTopicIndex(input.language);
    key = topicKey(input.language, input.topic);
  }
  const rows = await kvZRevRange(key, offset, offset + BOARD_PAGE - 1);
  if (!rows.length) return [];
  const posts = await kvGetJsonMany<BoardPost>(rows.map((row) => postKey(row.member)));
  return posts.filter((post): post is BoardPost => post !== null);
}

export type WriteResult<T> = { ok: T } | { error: "LIMIT" | "NOT_FOUND" | "FORBIDDEN" | "FULL" };

/**
 * 새 글. `boostMs`는 쓴 사람의 기여 가산(rooms/contribution.ts boardBoostMs, 최대 3시간) — 목록 점수만
 * 그만큼 앞으로 두어 처음 몇 시간 위쪽에 보이고, 시간이 지나면 다른 새 글에 밀린다. 글의 at은 그대로.
 */
export async function createPost(input: {
  author: string;
  language: string;
  text: string;
  images?: MediaRef[];
  boostMs?: number;
  /** 주제(없으면 자유). 보이스룸·단체방은 붙일 것을 라우트가 확인한 뒤 넘긴다. */
  topic?: BoardTopic;
  roomId?: string;
  groupId?: string;
}): Promise<WriteResult<BoardPost>> {
  if ((await kvIncrBy(dayKey(input.author), 1, 2 * 24 * 60 * 60)) > BOARD_POSTS_PER_DAY) return { error: "LIMIT" };
  const post: BoardPost = {
    id: newBoardId(),
    author: input.author,
    language: input.language,
    text: input.text,
    at: Date.now(),
    comments: 0,
    ...(input.images?.length ? { images: input.images } : {}),
    ...(input.topic && input.topic !== "free" ? { topic: input.topic } : {}),
    ...(input.topic === "room" && input.roomId ? { roomId: input.roomId } : {}),
    ...(input.topic === "group" && input.groupId ? { groupId: input.groupId } : {}),
  };
  await kvSetJson(postKey(post.id), post);
  const rank = post.at + Math.max(0, Math.min(input.boostMs ?? 0, BOARD_BOOST_MAX_MS));
  await Promise.all([
    kvZAdd(ALL, rank, post.id),
    kvZAdd(langKey(post.language), rank, post.id),
    kvZAdd(topicKey(post.language, topicOf(post)), rank, post.id),
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
  // 글과 댓글에 붙은 사진도 같이(server/mediaStore.ts).
  const comments = await readComments(post.id);
  const media = [...(post.images ?? []).map((image) => image.id), ...comments.flatMap((comment) => (comment.image ? [comment.image.id] : []))];
  if (media.length) await deleteMedia(media);
  await kvDelete([postKey(post.id), commentsKey(post.id)]);
  await Promise.all([
    kvZRem(ALL, post.id),
    kvZRem(langKey(post.language), post.id),
    kvZRem(topicKey(post.language, topicOf(post)), post.id),
    kvZRem(byKey(post.author), post.id),
  ]);
  // 좋아요: 누른 사람마다 표시와 "내가 누른 글"에서 빼고, 수·목록을 지운다.
  const likers = await kvZRevRange(likersKey(post.id), 0, -1);
  if (likers.length) {
    await kvDelete(likers.map((row) => likedKey(post.id, row.member)));
    await Promise.all(likers.map((row) => kvZRem(likedByKey(row.member), post.id)));
  }
  await kvDelete([likesKey(post.id), likersKey(post.id)]);
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

export async function addComment(input: {
  author: string;
  postId: string;
  text: string;
  image?: MediaRef;
  icon?: BoardComment["icon"];
  /** 답글이면 답하는 댓글(맨 위든 답글이든 — 맨 위 댓글 아래로 붙는다). */
  replyTo?: string;
}): Promise<WriteResult<BoardComment>> {
  const post = await readPost(input.postId);
  if (!post) return { error: "NOT_FOUND" };
  if (post.comments >= BOARD_MAX_COMMENTS) return { error: "FULL" };
  let parent: string | null = null;
  if (input.replyTo) {
    parent = replyRoot(await readComments(post.id), input.replyTo);
    if (!parent) return { error: "NOT_FOUND" };
  }
  if ((await kvIncrBy(hourKey(input.author), 1, 2 * 60 * 60)) > BOARD_COMMENTS_PER_HOUR) return { error: "LIMIT" };
  const comment: BoardComment = {
    id: newBoardId(),
    author: input.author,
    text: input.text,
    at: Date.now(),
    ...(input.image ? { image: input.image } : {}),
    ...(input.icon ? { icon: input.icon } : {}),
    ...(parent ? { parent } : {}),
  };
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
  // 맨 위 댓글을 지우면 그 답글도(사진까지) 같이.
  const gone = withReplies(comments, new Set([commentId]));
  const media = comments.flatMap((comment) => (gone.has(comment.id) && comment.image ? [comment.image.id] : []));
  if (media.length) await deleteMedia(media);
  await writeComments(post, comments.filter((comment) => !gone.has(comment.id)));
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
    const gone = withReplies(comments, new Set(comments.filter((comment) => comment.author === account).map((comment) => comment.id)));
    if (!gone.size) continue;
    const media = comments.flatMap((comment) => (gone.has(comment.id) && comment.image ? [comment.image.id] : []));
    if (media.length) await deleteMedia(media);
    await writeComments(post, comments.filter((comment) => !gone.has(comment.id)));
  }
  // 내가 누른 좋아요는 수를 되돌리고 표시를 지운다.
  const liked = await kvZRevRange(likedByKey(account), 0, -1);
  for (const row of liked) await setLike(account, row.member, false);
  await kvDelete([byKey(account), commentedKey(account), likedByKey(account)]);
}

/**
 * 좋아요 켜기·끄기(같은 값을 다시 보내도 수가 두 번 바뀌지 않음). 글이 없으면 NOT_FOUND.
 * 내 글에도 누를 수 있게 막지 않는다(흔한 앱들과 같음) — 노출 가산(contribution)에는 넣지 않는다.
 */
export async function setLike(me: string, id: string, on: boolean): Promise<WriteResult<{ likes: number; liked: boolean }>> {
  const post = await readPost(id);
  if (!post && on) return { error: "NOT_FOUND" };
  if (on) {
    if (await kvSetJsonIfAbsent(likedKey(id, me), 1, KEEP_SECONDS)) {
      await kvIncrBy(likesKey(id), 1, KEEP_SECONDS);
      await Promise.all([kvZAdd(likersKey(id), Date.now(), me), kvZAdd(likedByKey(me), Date.now(), id)]);
    }
  } else if ((await kvGetJson<number>(likedKey(id, me))) !== null) {
    await kvDelete([likedKey(id, me)]);
    const left = await kvIncrBy(likesKey(id), -1, KEEP_SECONDS);
    if (left < 0) await kvIncrBy(likesKey(id), -left, KEEP_SECONDS);
    await Promise.all([kvZRem(likersKey(id), me), kvZRem(likedByKey(me), id)]);
  }
  const [likes] = await kvGetNumbers([likesKey(id)]);
  return { ok: { likes: Math.max(0, likes ?? 0), liked: on } };
}

/** 보는 사람 기준으로 글마다 좋아요 수와 내가 눌렀는지를 채운다(목록·글 열기·프로필). */
export async function withLikes(me: string | null, posts: BoardPost[]): Promise<BoardPost[]> {
  if (!posts.length) return posts;
  const [counts, mine] = await Promise.all([
    kvGetNumbers(posts.map((post) => likesKey(post.id))),
    me ? kvGetJsonMany<number>(posts.map((post) => likedKey(post.id, me))) : Promise.resolve(posts.map(() => null)),
  ]);
  return posts.map((post, index) => ({ ...post, likes: Math.max(0, counts.at(index) ?? 0), liked: mine.at(index) !== null }));
}

/** 한 사람의 최근 글(프로필에 보일 것, 최신 순). */
export async function listPostsBy(author: string, limit: number): Promise<BoardPost[]> {
  const rows = await kvZRevRange(byKey(author), 0, Math.max(0, limit - 1));
  if (!rows.length) return [];
  const posts = await kvGetJsonMany<BoardPost>(rows.map((row) => postKey(row.member)));
  return posts.filter((post): post is BoardPost => post !== null);
}
