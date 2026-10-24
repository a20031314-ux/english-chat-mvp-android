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
  listPostsBy,
  readComments,
  readPost,
  setLike,
  withLikes,
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

test("좋아요: 한 사람 한 번, 끄면 줄고, 보는 사람마다 내 상태, 글을 지우거나 계정을 지우면 정리", async () => {
  const post = ok(await createPost({ author: "acc_likeauthor", language: "th", text: "ไปเที่ยวทะเลมา" }));
  assert.deepEqual(ok(await setLike("acc_liker1", post.id, true)), { likes: 1, liked: true });
  assert.deepEqual(ok(await setLike("acc_liker1", post.id, true)), { likes: 1, liked: true });
  assert.deepEqual(ok(await setLike("acc_liker2", post.id, true)), { likes: 2, liked: true });
  assert.deepEqual(ok(await setLike("acc_liker1", post.id, false)), { likes: 1, liked: false });
  assert.deepEqual(ok(await setLike("acc_liker1", post.id, false)), { likes: 1, liked: false });
  const [forTwo] = await withLikes("acc_liker2", [post]);
  const [forOne] = await withLikes("acc_liker1", [post]);
  assert.equal(forTwo?.likes, 1);
  assert.equal(forTwo?.liked, true);
  assert.equal(forOne?.liked, false);
  assert.deepEqual(await setLike("acc_liker1", "b_nothing", true), { error: "NOT_FOUND" });

  // 누른 사람이 계정을 지우면 수가 돌아간다.
  await forgetBoard("acc_liker2");
  assert.equal((await withLikes(null, [post]))[0]?.likes, 0);

  // 글을 지우면 그 글의 좋아요도 없어진다.
  ok(await setLike("acc_liker3", post.id, true));
  ok(await deletePost("acc_likeauthor", post.id));
  assert.equal((await withLikes("acc_liker3", [post]))[0]?.likes, 0);
});

test("한 사람의 최근 글은 최신 순으로 정한 수만", async () => {
  const author = "acc_profileposts";
  for (const text of ["primera", "segunda", "tercera"]) {
    ok(await createPost({ author, language: "es", text }));
    await new Promise((resolve) => setTimeout(resolve, 3)); // 같은 밀리초면 순서가 정해지지 않는다.
  }
  const posts = await listPostsBy(author, 2);
  assert.deepEqual(posts.map((post) => post.text), ["tercera", "segunda"]);
});

test("posts split by topic inside each learning language; old posts count as free", async () => {
  // 주제 칸이 생기기 전 글(주제 없음) — 그 언어를 처음 주제로 열 때 "자유"에 들어간다.
  const old = ok(await createPost({ author: "acc_topic1", language: "th", text: "สวัสดีครับ ผมเรียนภาษาไทย" }));
  const mate = ok(await createPost({ author: "acc_topic2", language: "th", text: "หาเพื่อนเรียนตอนเย็น", topic: "mate" }));
  const question = ok(await createPost({ author: "acc_topic2", language: "th", text: "¿Cómo se dice 'gracias'?", topic: "question" }));
  const other = ok(await createPost({ author: "acc_topic2", language: "es", text: "Busco compañero", topic: "mate" }));
  assert.equal(mate.topic, "mate");
  assert.equal(old.topic, undefined);

  const ids = async (topic: Parameters<typeof listPosts>[0]["topic"], language = "th") =>
    (await listPosts({ language, topic })).map((post) => post.id);
  assert.deepEqual(await ids("mate"), [mate.id]);
  assert.deepEqual(await ids("question"), [question.id]);
  assert.ok((await ids("free")).includes(old.id));
  assert.ok(!(await ids("free")).includes(mate.id));
  assert.deepEqual(await ids("mate", "es"), [other.id]);
  // 주제 없이 열면 그 언어 전부.
  assert.ok((await ids(undefined)).includes(mate.id) && (await ids(undefined)).includes(old.id));

  // 붙일 것은 그 주제일 때만 남는다.
  const room = ok(await createPost({ author: "acc_topic2", language: "th", text: "x", topic: "room", roomId: "r_abc", groupId: "g_nope" }));
  assert.equal(room.roomId, "r_abc");
  assert.equal(room.groupId, undefined);

  ok(await deletePost("acc_topic2", mate.id));
  assert.deepEqual(await ids("mate"), []);
});
