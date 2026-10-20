import { test } from "node:test";
import assert from "node:assert/strict";
import { BOARD_POSTS_PER_DAY, cleanBoardText, isBoardId, threadComments } from "../rooms/board.ts";
import {
  addComment,
  createPost,
  deleteComment,
  deletePost,
  editComment,
  editPost,
  forgetBoard,
  listPosts,
  readComments,
  readPost,
} from "./boardStore.ts";

// KV 접속 정보 없이 메모리로(kv.ts).
const ok = <T>(result: { ok: T } | { error: string }): T => {
  assert.ok("ok" in result, JSON.stringify(result));
  return (result as { ok: T }).ok;
};

test("only the writer edits or deletes a post; others read and comment", async () => {
  const post = ok(await createPost({ author: "acc_writer1", language: "ja", text: "今日は駅で道を聞きました。" }));
  assert.ok(isBoardId(post.id));
  assert.deepEqual(await editPost("acc_reader1", post.id, "x"), { error: "FORBIDDEN" });
  assert.deepEqual(await deletePost("acc_reader1", post.id), { error: "FORBIDDEN" });
  const edited = ok(await editPost("acc_writer1", post.id, "今日は駅で道を聞いた。"));
  assert.ok(edited.editedAt);

  const comment = ok(await addComment({ author: "acc_reader1", postId: post.id, text: "¡Muy bien escrito!" }));
  assert.equal((await readPost(post.id))!.comments, 1);
  assert.deepEqual(await editComment("acc_writer1", post.id, comment.id, "x"), { error: "FORBIDDEN" });
  ok(await editComment("acc_reader1", post.id, comment.id, "¡Muy bien!"));
  assert.equal((await readComments(post.id))[0]!.text, "¡Muy bien!");
  // 글쓴이는 내 글의 댓글을 지울 수 있다.
  ok(await deleteComment("acc_writer1", post.id, comment.id));
  assert.equal((await readPost(post.id))!.comments, 0);

  assert.ok((await listPosts({ language: "ja" })).some((row) => row.id === post.id));
  assert.ok(!(await listPosts({ language: "es" })).some((row) => row.id === post.id));
  ok(await deletePost("acc_writer1", post.id));
  assert.equal(await readPost(post.id), null);
  assert.ok(!(await listPosts({})).some((row) => row.id === post.id));
});

test("a day's posts are limited, and deleting an account takes its posts and comments", async () => {
  for (let i = 0; i < BOARD_POSTS_PER_DAY; i += 1) ok(await createPost({ author: "acc_busy01", language: "th", text: `โพสต์ ${i}` }));
  assert.deepEqual(await createPost({ author: "acc_busy01", language: "th", text: "เกิน" }), { error: "LIMIT" });

  const other = ok(await createPost({ author: "acc_other1", language: "es", text: "Hola a todos" }));
  ok(await addComment({ author: "acc_busy01", postId: other.id, text: "สวัสดี" }));
  ok(await addComment({ author: "acc_other1", postId: other.id, text: "Gracias" }));
  await forgetBoard("acc_busy01");
  assert.ok(!(await listPosts({ language: "th" })).some((row) => row.author === "acc_busy01"));
  const left = await readComments(other.id);
  assert.deepEqual(left.map((row) => row.author), ["acc_other1"]);
  assert.equal((await readPost(other.id))!.comments, 1);
});

test("text keeps its line breaks but not control characters or long gaps", () => {
  assert.equal(cleanBoardText("  a\r\n\n\n\nb\u0007 ", 100), "a\n\nb");
  assert.equal(cleanBoardText("가".repeat(10), 3), "가가가");
  assert.equal(cleanBoardText(42, 10), "");
});

test("답글은 한 단계: 답글에 답해도 같은 맨 위 댓글 아래로, 사진도 붙고, 맨 위를 지우면 답글도", async () => {
  const post = ok(await createPost({ author: "acc_rwriter", language: "ja", text: "週末に京都へ行きました。" }));
  const top = ok(await addComment({ author: "acc_rreader", postId: post.id, text: "いいですね！" }));
  const photo = { id: "m_reply01", w: 320, h: 240 };
  const reply = ok(await addComment({ author: "acc_rwriter", postId: post.id, text: "ありがとう！", image: photo, replyTo: top.id }));
  assert.equal(reply.parent, top.id);
  assert.deepEqual(reply.image, photo);
  // 답글에 답하면 맨 위 댓글 아래로(깊어지지 않음).
  const nested = ok(await addComment({ author: "acc_rthird", postId: post.id, text: "¿Qué templo visitaste?", replyTo: reply.id }));
  assert.equal(nested.parent, top.id);
  // 없는 댓글에는 못 단다.
  assert.deepEqual(await addComment({ author: "acc_rthird", postId: post.id, text: "x", replyTo: "b_nothere000" }), { error: "NOT_FOUND" });

  const other = ok(await addComment({ author: "acc_rthird", postId: post.id, text: "สวยมาก" }));
  const threads = threadComments(await readComments(post.id));
  assert.deepEqual(threads.map((row) => [row.comment.id, row.replies.map((r) => r.id)]), [
    [top.id, [reply.id, nested.id]],
    [other.id, []],
  ]);
  assert.equal((await readPost(post.id))!.comments, 4);

  // 맨 위 댓글을 지우면 답글 둘도 같이, 개수도 맞게.
  ok(await deleteComment("acc_rreader", post.id, top.id));
  assert.deepEqual((await readComments(post.id)).map((row) => row.id), [other.id]);
  assert.equal((await readPost(post.id))!.comments, 1);

  // 답글만 지우면 맨 위는 남는다.
  const top2 = ok(await addComment({ author: "acc_rreader", postId: post.id, text: "また行きたい" }));
  const reply2 = ok(await addComment({ author: "acc_rthird", postId: post.id, text: "Yo también", replyTo: top2.id }));
  ok(await deleteComment("acc_rthird", post.id, reply2.id));
  assert.ok((await readComments(post.id)).some((row) => row.id === top2.id));

  // 계정을 지우면 그 사람의 맨 위 댓글 아래 답글도 같이.
  ok(await addComment({ author: "acc_rthird", postId: post.id, text: "Otra vez", replyTo: top2.id }));
  await forgetBoard("acc_rreader");
  assert.deepEqual((await readComments(post.id)).map((row) => row.id), [other.id]);
});

test("부모가 안 보이는 답글(차단 등)은 맨 위로 보인다", () => {
  const rows = threadComments([
    { id: "b_a00000", author: "x", text: "a", at: 1 },
    { id: "b_b00000", author: "y", text: "b", at: 2, parent: "b_hidden0" },
  ]);
  assert.deepEqual(rows.map((row) => row.comment.id), ["b_a00000", "b_b00000"]);
});
