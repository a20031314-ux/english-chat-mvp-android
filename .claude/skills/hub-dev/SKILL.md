---
name: hub-dev
description: Start or continue work in the 기능 개발 role (dev) — loads hub/work/roles/dev.md and the inbox so a new chat picks up where the last one stopped. Use for "/hub-dev" or when the request is clearly dev work.
---

# 기능 개발 역할로 시작

1. `git pull --ff-only` (main). 다른 브랜치에 있으면 그대로 두고 사용자에게 알린다.
2. `hub/STATE.md`(이미 읽혀 있음), `hub/work/roles/dev.md`, `hub/work/inbox.md`에서 `→ dev` 줄을 읽는다.
   inbox에서 가져간 줄은 `hub/work/roles/dev.md` "열린 일"로 옮기고 inbox에서 지운다.
3. 최근 `hub/chat/log/` 마지막 두세 항목을 읽어 바로 앞 채팅이 남긴 일을 확인한다.
4. 사용자에게 한두 줄로: 이 역할의 열린 일 중 지금 이어갈 것, 넘겨받은 것. 요청이 이미 있으면 바로 그 일을 시작한다.
5. 끝낼 때는 `hub/README.md` "규칙" 3번대로 역할 파일과 로그를 같은 커밋에 남긴다.
   다른 역할에 넘길 일은 `hub/work/inbox.md`에 한 줄.
6. 기능을 고칠 때(RULES "기능·이름·옛 것" 6~8): 고치기 전 `node scripts/scope.mjs <파일|기능 id>`로 닿는 탭을 보고,
   끝낼 때 `node scripts/asks.mjs apply --from <탭> --base <시작 커밋> --what "…"`(다른 탭 확인 요청)·log `- 옛 것: …`·`node scripts/leftovers.mjs --check`.
