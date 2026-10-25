import { GROUP_MAX_MEMBERS, type Group } from "../rooms/group.ts";
import type { BoardGroupView, BoardPost, BoardRoomView } from "../rooms/board.ts";
import { answerInvite, inviteToGroup, readGroup } from "./groupStore.ts";
import { liveCount, readMeta } from "./roomStore.ts";
import { blockedEitherWay } from "./socialStore.ts";

/**
 * 게시판 글에 붙인 보이스룸·단체방(rooms/board.ts BoardTopic, 2026-10-25).
 * 글에는 id만 남기고, 읽을 때마다 지금 상태(열렸는지·사람 수·내가 들어갔는지)를 채운다.
 */

/** 보이스룸 글에 붙일 수 있는 방: 내가 방장인, 지금 있는 공개 방. */
export async function roomForPost(me: string, roomId: string): Promise<boolean> {
  const meta = await readMeta(roomId);
  return Boolean(meta && !meta.private && meta.hostAccountId === me);
}

/** 단체방 모집 글에 붙일 수 있는 단체방: 내가 들어가 있는, 메이트(둘만의 방)가 아닌 것. */
export async function groupForPost(me: string, groupId: string): Promise<boolean> {
  const group = await readGroup(groupId);
  return Boolean(group && group.members.includes(me) && group.team?.kind !== "mate");
}

function groupView(group: Group | null, id: string, me: string, author: string): BoardGroupView {
  if (!group || !group.members.includes(author)) {
    return { id, name: group?.name ?? "", members: group?.members.length ?? 0, max: GROUP_MAX_MEMBERS, joined: false, full: false, gone: true };
  }
  return {
    id,
    name: group.name,
    members: group.members.length,
    max: GROUP_MAX_MEMBERS,
    joined: group.members.includes(me),
    full: group.members.length + group.invited.length >= GROUP_MAX_MEMBERS,
    gone: false,
  };
}

/** 글마다 붙인 방·단체방의 지금 상태를 채운다(목록·글 열기). 붙인 게 없는 글은 그대로. */
export async function withLinks(me: string, posts: BoardPost[]): Promise<BoardPost[]> {
  return Promise.all(
    posts.map(async (post) => {
      if (post.roomId) {
        const meta = await readMeta(post.roomId);
        const people = meta ? await liveCount(post.roomId) : 0;
        const room: BoardRoomView = { id: post.roomId, name: meta?.name ?? "", open: Boolean(meta && !meta.private && people > 0), people };
        return { ...post, room };
      }
      if (post.groupId) return { ...post, group: groupView(await readGroup(post.groupId), post.groupId, me, post.author) };
      return post;
    }),
  );
}

export type JoinResult = { ok: BoardGroupView } | { error: "GONE" | "FULL" | "FORBIDDEN" };

/**
 * 단체방 모집 글에서 "참여하기": 글쓴이가 올린 글이 곧 초대라서, 글쓴이 이름으로 초대하고 바로 참여한다.
 * 방장이 내보낸 사람·서로 차단한 사람은 안 되고, 글쓴이가 그 방을 나갔으면 끝난 모집으로 본다.
 */
export async function joinPostGroup(me: string, post: BoardPost): Promise<JoinResult> {
  if (!post.groupId || post.author === me) return { error: "FORBIDDEN" };
  const group = await readGroup(post.groupId);
  if (!group || !group.members.includes(post.author) || group.team?.kind === "mate") return { error: "GONE" };
  if (group.members.includes(me)) return { ok: groupView(group, group.id, me, post.author) };
  if ((group.kicked ?? []).includes(me)) return { error: "FORBIDDEN" };
  if (await blockedEitherWay(me, post.author)) return { error: "FORBIDDEN" };
  if (!group.invited.includes(me)) {
    const invited = await inviteToGroup(post.author, group.id, me);
    if (invited === "FULL") return { error: "FULL" };
    if (invited !== "ok" && invited !== "ALREADY") return { error: "GONE" };
  }
  const joined = await answerInvite(me, group.id, true);
  if (!joined) return { error: "GONE" };
  return { ok: groupView(joined, joined.id, me, post.author) };
}
