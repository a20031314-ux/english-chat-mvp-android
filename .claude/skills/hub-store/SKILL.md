---
name: hub-store
description: Start or continue work in the 스토어·출시 role (store) — loads hub/roles/store.md and the inbox so a new chat picks up where the last one stopped. Use for "/hub-store" or when the request is clearly store work.
---

# 스토어·출시 역할로 시작

1. `git pull --ff-only` (main). 다른 브랜치에 있으면 그대로 두고 사용자에게 알린다.
2. `hub/STATE.md`(이미 읽혀 있음), `hub/roles/store.md`, `hub/inbox.md`에서 `→ store` 줄을 읽는다.
   inbox에서 가져간 줄은 `roles/store.md` "열린 일"로 옮기고 inbox에서 지운다.
3. 최근 `hub/log/` 마지막 두세 항목을 읽어 바로 앞 채팅이 남긴 일을 확인한다.
4. 사용자에게 한두 줄로: 이 역할의 열린 일 중 지금 이어갈 것, 넘겨받은 것. 요청이 이미 있으면 바로 그 일을 시작한다.
5. 끝낼 때는 `hub/README.md` "규칙" 3번대로 역할 파일과 로그를 같은 커밋에 남긴다.
   다른 역할에 넘길 일은 `hub/inbox.md`에 한 줄.
