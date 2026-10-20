/**
 * 게시판(사람 탭 안, 2026-10-19): 로그인한 사람이 글을 올리고, 다른 사람은 읽고 댓글만.
 * 글·댓글을 고치고 지우는 것은 쓴 사람만(댓글은 글쓴이도 지울 수 있음).
 * 글은 쓴 사람이 지울 때까지 남고, 계정을 지우면 그 사람의 글·댓글도 같이 지운다(server/boardStore.ts).
 */

import type { MediaRef } from "./media.ts";

export const BOARD_POST_MAX_CHARS = 2000;
export const BOARD_COMMENT_MAX_CHARS = 500;
export const BOARD_MAX_COMMENTS = 200;
/** 한 사람이 하루에 올리는 글 / 한 시간에 쓰는 댓글. */
export const BOARD_POSTS_PER_DAY = 10;
export const BOARD_COMMENTS_PER_HOUR = 60;
export const BOARD_PAGE = 20;

export type BoardPost = {
  id: string;
  author: string;
  /** 글을 올릴 때의 학습 언어 — 목록 거르기("내 학습 언어"). */
  language: string;
  text: string;
  at: number;
  editedAt?: number;
  comments: number;
  /** 붙인 사진(최대 MEDIA_PER_POST장, rooms/media.ts). 글을 지우면 같이 지운다. */
  images?: MediaRef[];
};

export type BoardComment = {
  id: string;
  author: string;
  text: string;
  at: number;
  editedAt?: number;
  /** 사진 한 장. */
  image?: MediaRef;
  /** 답글이면 맨 위 댓글 id(한 단계만 — 답글의 답글도 같은 맨 위 댓글 아래로, 2026-10-20). */
  parent?: string;
};

/** 화면용: 맨 위 댓글마다 그 아래 답글. 부모가 안 보이는(지워졌거나 차단한 사람) 답글은 맨 위로. */
export function threadComments(comments: BoardComment[]): { comment: BoardComment; replies: BoardComment[] }[] {
  const top = new Set(comments.filter((comment) => !comment.parent).map((comment) => comment.id));
  const replies = new Map<string, BoardComment[]>();
  const out: { comment: BoardComment; replies: BoardComment[] }[] = [];
  for (const comment of comments) {
    if (comment.parent && top.has(comment.parent)) {
      const list = replies.get(comment.parent) ?? [];
      list.push(comment);
      replies.set(comment.parent, list);
    } else {
      out.push({ comment, replies: [] });
    }
  }
  for (const row of out) row.replies = replies.get(row.comment.id) ?? [];
  return out;
}

/** 답글을 달 맨 위 댓글: 답글에 답하면 그 답글의 맨 위 댓글. 없는 댓글이면 null. */
export function replyRoot(comments: Pick<BoardComment, "id" | "parent">[], targetId: string): string | null {
  const target = comments.find((comment) => comment.id === targetId);
  if (!target) return null;
  if (!target.parent) return target.id;
  return comments.some((comment) => comment.id === target.parent) ? target.parent : null;
}

/** 지울 댓글과 함께 지울 것: 맨 위 댓글이면 그 답글까지. */
export function withReplies(comments: BoardComment[], ids: Set<string>): Set<string> {
  const out = new Set(ids);
  for (const comment of comments) if (comment.parent && ids.has(comment.parent)) out.add(comment.id);
  return out;
}

/** 화면에 보낼 때 붙이는 이름(닉네임 없으면 빈 칸, 화면이 "?"로). */
export type BoardAuthor = { id: string; nickname: string };

const ID = /^b_[a-z0-9]{6,32}$/;
export function isBoardId(value: unknown): value is string {
  return typeof value === "string" && ID.test(value);
}

export function newBoardId(): string {
  return `b_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/** 쓴 사람만 고치고 지운다. 댓글은 그 글을 쓴 사람도 지울 수 있다. */
export function canEditPost(me: string, post: Pick<BoardPost, "author">): boolean {
  return me === post.author;
}
export function canDeleteComment(me: string, post: Pick<BoardPost, "author">, comment: Pick<BoardComment, "author">): boolean {
  return me === comment.author || me === post.author;
}

/** 줄바꿈은 두고(최대 2줄 빈 줄), 앞뒤 공백·제어 문자를 지운다. */
export function cleanBoardText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}
