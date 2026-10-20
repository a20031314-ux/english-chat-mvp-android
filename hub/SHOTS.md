# 스크린샷 모음 (모든 역할)

> 기능을 만들거나 점검하며 찍은 화면은 작업 공간(`tmp/verify/`·`tmp/sim-users/`, git 제외)에만 있으면 채팅이 끝날 때 사라진다.
> 그래서 **스크린샷 모음 페이지**에 올려 둔다: https://claude.ai/artifact/VP562k9QhrFiybAYv4ggbW (사용자 소유, 비공개).
> 사용자는 거기서 기능별로 보고, 사용법 칸에 넣을 그림을 고른다(2026-10-20 사용자 요청).

## 올리기 (커밋 전 브라우저 확인·가상 사용자 점검·기능 추가 뒤 찍은 화면)
1. Artifact 도구 `asset: true`, `url` = 위 주소, `file_paths`(25장씩) → 결과의 id·url.
2. ArtifactData `batch`로 `shots/<파일이름>-<YYYYMMDD>` 한 줄씩:
   `{url, assetId, file, title(한국어, "기능 — 장면"), area, lang, date, source, order}`
   - `area`: room·talk·people·web·billing·chat·call·video·my·shell (STRUCTURE 영역)
   - `lang`: ko(ja 학습·ko 앱)·ja(en 학습·ja 앱)·ar(es 학습·ar 앱), 다른 조합이면 그대로 적는다(`th-ko` 등)
   - `source`: "커밋 전 확인" / "가상 사용자" / "기능 점검" / "사용법 캡처"
   - `order`: `YYYYMMDD*1000 + 번호`(최근 것이 위로)
3. 사람 얼굴·실제 사용자 글이 보이는 화면, 의견함 스크린샷은 올리지 않는다(테스트 계정 화면만).

## 고른 그림 반영하기 (버전 자를 때, 사용법을 손볼 때)
- ArtifactData `list` `picks` → 문서 id = 사용법 칸 id(`room.host` 등, `other.*`는 새로워진 점·스토어·창구), `{shotId, url, file, applied}`.
- `applied: false`인 것만: 그 화면을 UI 언어별로 다시 찍을지(`capture-whats-new.mjs guide`의 장면) 또는 그 그림을 그대로 쓸지 정해 넣고, 넣은 뒤 `update applied: true`.
- 고른 그림은 한 언어 조합의 화면이다. 사용법 그림은 14개 UI 언어로 필요하니 보통 **같은 장면을 캡처 스크립트로 다시 찍는 근거**로 쓴다.
