---
name: take
description: 받기 — 새 채팅이 탭 N의 인계 노트(hub/chat/handoff/<번호>.md)를 읽고 끊긴 채팅의 일을 이어받는다. "3번 받기", "/take 3", "탭 3 이어서", "3번 이어받아".
---

# 받기 (탭 N)

1. `git pull --ff-only`(main). 번호가 없으면 `hub/chat/tabs.md` 표를 보여 주고 묻는다.
2. 읽기: `hub/chat/handoff/N.md` → `hub/chat/tabs.md` 표의 그 번호 역할 파일(`hub/work/roles/<역할>.md` 열린 일) → `hub/work/inbox.md`에서 그 역할 앞으로 온 줄 → 노트 "먼저 읽을 것". `hub/chat/log/` 최근 항목 중 노트 양도 시각 뒤에 들어온 다른 채팅의 일도 훑는다(그사이 바뀐 것).
   노트가 비었거나("아직 없음") 오래됐으면(7일 넘음) 역할 파일·log로 시작하고 그렇다고 말한다.
   그 탭에 온 확인 요청: `node scripts/asks.mjs list --to N`(+ 사용자 삭제 질문 `--to user`).
3. 노트 머리의 "받음:"을 `YYYY-MM-DD HH시(KST)`로 고쳐 `hub/chat/handoff/N.md`만 커밋("N번 받음")·push — 같은 노트를 두 채팅이 받았는지 알 수 있게. 이미 "받음"이 적혀 있으면(다른 채팅이 받음) 사용자에게 먼저 알린다.
4. 사용자에게 세 줄 이내: **N번 <이름> 받음** · 어디까지 왔나 한 줄 · 바로 이어갈 것(노트 "하던 일") · 결정 대기가 있으면 그 질문. 사용자 삭제 질문(`--to user`)이 열려 있으면 AskUserQuestion으로 같이 묻고 답을 `asks.mjs answer <id> --by user --status 지움|남김 [--until …]`로 적는다.
   사용자가 받기와 함께 할 일을 말했으면 바로 그 일을 시작한다 — 단 그 탭 확인 요청은 같이 처리한다: 요청마다 "볼 곳" 화면 코드에서 새 동작이 맞는지·옛 동작이 남았는지 보고, 필요하면 고친 뒤 `node scripts/asks.mjs answer <id> --by N --status 맞음|고침|해당없음 --note "…"` → 커밋.
5. 이 채팅은 이제 N번이다. 끝내거나 다시 길어지면 `/pass N`.
