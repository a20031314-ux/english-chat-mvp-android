/**
 * 게시판 묶음(사람 탭 안) — 임시 계정 둘(A 글쓴이, B 읽는 사람).
 *
 *   로그인 없이 막힘 → 빈 글·없는 언어 막힘 → A 글쓰기(학습 언어) → B 목록(그 언어로 거르면 보이고, 다른 언어로 거르면 안 보임)
 *   → B 열기·댓글 → B가 A의 글 고치기·삭제 막힘 → A 고치기 → B 내 댓글 고치기 → B 차단하면 A의 글이 목록·열기에서 사라짐 → 풀기
 *   → A(글쓴이)가 B 댓글 지우기 → A 글 삭제 → 열기 NOT_FOUND
 *
 * 게시판은 실제 사용자와 같이 쓰는 곳이라 글은 [test]로 시작하고 묶음이 끝나기 전에(오류가 나도) 지운다.
 * 학습자 문장 대신 시드의 맞는 문장만 쓴다. 모델 호출 없음. 14명 중 1명.
 */
import { checkHttp, issue } from "../detect.mjs";
import { expectError, makeAccounts } from "../accounts.mjs";

export default {
  id: "board",
  label: "게시판",
  every: 14,
  note: "임시 계정 2개 — 숨김·끝에 삭제, 글은 [test]·끝에 삭제",
  estimate() {
    return { requests: 26, usd: 0 };
  },
  async run({ persona, userId, call, bank, step }) {
    const P = "board";
    const acc = makeAccounts({ call, userId, step, prefix: P, persona });
    const board = (person, action, extra = {}, force = false) => acc.as(person, "/api/board", { body: { action, ...extra }, force });
    const lines = (bank.learner[persona.target] ?? []).filter((l) => l.ok).map((l) => l.text);
    const other = persona.target === "en" ? "es" : "en";
    let postId = null;
    let A = null;

    try {
      A = await acc.signup("a", { nickname: bank.nickname[persona.target] });
      const B = await acc.signup("b", { nickname: bank.nickname[persona.ui] });
      if (!A || !B) return;

      // ── 막혀야 하는 것 ──
      const anon = await call(`${userId}-anon`, "/api/board", { body: { action: "list" } });
      const gIssues = expectError(P, anon, "SIGNED_OUT", "로그인 없이 목록");
      gIssues.push(...expectError(P, await board(A, "post", { language: persona.target, text: "   " }), "EMPTY", "빈 글"));
      gIssues.push(...expectError(P, await board(A, "post", { language: "xx", text: "[test] x" }), "BAD_LANGUAGE", "없는 언어"));
      step({ title: "게시판 막힘 (로그인·빈 글·언어)", status: anon.status, ms: anon.ms, issues: gIssues });

      // ── 글쓰기 ──
      const text = `[test] ${lines[0] ?? "hello"}`;
      const made = await board(A, "post", { language: persona.target, text });
      const wIssues = checkHttp(P, made);
      postId = made.body?.post?.id ?? null;
      if (made.status === 200 && made.body?.post?.text !== text) wIssues.push(issue("error", "board_logic", `저장된 글이 다름: ${made.body?.post?.text}`));
      step({ title: "A 글쓰기", input: text, status: made.status, ms: made.ms, outputs: [{ label: "언어", text: made.body?.post?.language }], issues: wIssues });
      if (!postId) return;

      // ── 목록·거르기 ──
      const mineLang = await board(B, "list", { language: persona.target });
      const otherLang = await board(B, "list", { language: other });
      const lIssues = checkHttp(P, mineLang);
      const seen = (res) => (res.body?.posts ?? []).some((p) => p.id === postId);
      if (mineLang.status === 200) {
        if (!seen(mineLang)) lIssues.push(issue("error", "board_logic", "그 언어로 거른 목록에 방금 쓴 글이 없음"));
        if (!(mineLang.body?.authors ?? []).some((a) => a.id === A.id)) lIssues.push(issue("error", "board_logic", "목록에 글쓴이 이름이 없음"));
      }
      if (otherLang.status === 200 && seen(otherLang)) lIssues.push(issue("error", "board_logic", `다른 언어(${other})로 걸렀는데 글이 보임`));
      step({ title: "B 목록 (언어로 거르기)", status: mineLang.status, ms: mineLang.ms, outputs: [{ label: "글", text: `${persona.target} ${(mineLang.body?.posts ?? []).length} · ${other} ${(otherLang.body?.posts ?? []).length}` }], issues: lIssues });

      // ── 열기·댓글 ──
      const opened = await board(B, "open", { postId });
      const comment = await board(B, "comment", { postId, text: `[test] ${bank.askMeaning[persona.ui]}` });
      const cIssues = [...checkHttp(P, opened), ...checkHttp(P, comment)];
      const commentId = comment.body?.comment?.id ?? null;
      if (comment.status === 200 && !commentId) cIssues.push(issue("error", "board_shape", "댓글 id 없음"));
      step({ title: "B 열기·댓글", input: bank.askMeaning[persona.ui], status: comment.status, ms: comment.ms, outputs: [{ label: "댓글", text: comment.body?.comment?.text }], issues: cIssues });

      // ── 답글(한 단계, 2026-10-20): 답글에 답해도 같은 맨 위 댓글 아래로, 맨 위를 지우면 답글도 ──
      if (commentId) {
        const rIssues = [];
        const reply = await board(A, "comment", { postId, text: "[test] ↳", replyTo: commentId });
        rIssues.push(...checkHttp(P, reply));
        const replyId = reply.body?.comment?.id ?? null;
        if (reply.status === 200 && reply.body?.comment?.parent !== commentId) rIssues.push(issue("error", "board_logic", "답글의 parent가 맨 위 댓글이 아님"));
        const nested = replyId ? await board(B, "comment", { postId, text: "[test] ↳↳", replyTo: replyId }) : null;
        if (nested) rIssues.push(...checkHttp(P, nested));
        if (nested?.status === 200 && nested.body?.comment?.parent !== commentId) rIssues.push(issue("error", "board_logic", "답글의 답글이 맨 위 댓글 아래로 안 감(깊어짐)"));
        rIssues.push(...expectError(P, await board(B, "comment", { postId, text: "[test] x", replyTo: "b_nothere000" }), "NOT_FOUND", "없는 댓글에 답글"));
        const after = await board(B, "open", { postId });
        const ids = (after.body?.comments ?? []).map((row) => row.id);
        if (replyId && !ids.includes(replyId)) rIssues.push(issue("error", "board_logic", "답글이 열기에 안 보임"));
        // 답글만 지우고, 남은 답글은 맨 위 댓글을 지울 때(아래 '댓글·글 지우기') 같이 지워진다.
        if (replyId) rIssues.push(...checkHttp(P, await board(A, "deleteComment", { postId, commentId: replyId })));
        step({ title: "답글·답글의 답글", status: reply.status, ms: reply.ms, issues: rIssues });
      }

      // ── 권한 ──
      const pIssues = [
        ...expectError(P, await board(B, "edit", { postId, text: "[test] hacked" }), "FORBIDDEN", "남의 글 고치기"),
        ...expectError(P, await board(B, "delete", { postId }), "FORBIDDEN", "남의 글 삭제"),
      ];
      const edited = await board(A, "edit", { postId, text: `${text} ✓` });
      pIssues.push(...checkHttp(P, edited));
      if (edited.status === 200 && edited.body?.post?.text !== `${text} ✓`) pIssues.push(issue("error", "board_logic", "고친 글이 반영 안 됨"));
      if (commentId) {
        const cEdit = await board(B, "editComment", { postId, commentId, text: "[test] ✓" });
        pIssues.push(...checkHttp(P, cEdit));
        pIssues.push(...expectError(P, await board(A, "editComment", { postId, commentId, text: "[test] x" }), "FORBIDDEN", "남의 댓글 고치기(글쓴이라도)"));
      }
      step({ title: "고치기·삭제 권한", status: edited.status, ms: edited.ms, issues: pIssues });

      // ── 차단 ──
      await acc.social(B, "block", { target: A.id });
      const hiddenList = await board(B, "list", { language: persona.target });
      const hiddenOpen = await board(B, "open", { postId });
      const bIssues = [];
      if (hiddenList.status === 200 && seen(hiddenList)) bIssues.push(issue("error", "board_logic", "차단한 사람의 글이 목록에 보임"));
      bIssues.push(...expectError(P, hiddenOpen, "NOT_FOUND", "차단한 사람의 글 열기"));
      await acc.social(B, "unblock", { target: A.id });
      const back = await board(B, "list", { language: persona.target });
      if (back.status === 200 && !seen(back)) bIssues.push(issue("warn", "board_logic", "차단을 풀었는데 글이 다시 안 보임"));
      step({ title: "B가 A 차단 → 글 숨김 → 풀기", status: hiddenList.status, ms: hiddenList.ms, issues: bIssues });

      // ── 글쓴이가 댓글 지우기 → 글 삭제 ──
      const dIssues = [];
      if (commentId) {
        dIssues.push(...checkHttp(P, await board(A, "deleteComment", { postId, commentId })));
        const left = await board(A, "open", { postId });
        if (left.status === 200 && (left.body?.comments ?? []).some((row) => row.parent === commentId)) dIssues.push(issue("error", "board_logic", "맨 위 댓글을 지웠는데 답글이 남음"));
      }
      const removed = await board(A, "delete", { postId });
      dIssues.push(...checkHttp(P, removed));
      if (removed.status === 200) postId = null;
      dIssues.push(...expectError(P, await board(B, "open", { postId: made.body.post.id }), "NOT_FOUND", "지운 글 열기"));
      step({ title: "댓글·글 지우기", status: removed.status, ms: removed.ms, issues: dIssues });
    } finally {
      if (postId && A) await board(A, "delete", { postId }, true);
      await acc.cleanup();
    }
  },
};
