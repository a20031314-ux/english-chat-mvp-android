# 스크린샷 모음 (모든 역할)

> 기능을 만들거나 점검하며 찍은 화면은 작업 공간(`tmp/verify/`·`tmp/sim-users/`, git 제외)에만 있으면 채팅이 끝날 때 사라진다.
> 그래서 **스크린샷 모음 페이지**에 올려 둔다: https://claude.ai/artifact/VP562k9QhrFiybAYv4ggbW (사용자 소유, 비공개).
> 사용자는 거기서 기능별로 보고, 사용법 칸에 넣을 그림을 고른다(2026-10-20 사용자 요청).

테스트: `node --test scripts/shots-rules.test.mjs`.

## 고르는 순서 (사용자 결정 2026-10-20, 규칙 코드 `scripts/shots-rules.mjs`)
1. 사용자가 고른 그림(`picks/<사용법 칸 id>` 또는 `picks/node.<지도 칸>`) — 언제나 먼저.
2. 사용법 캡처(`public/guide/ko/*.webp`) — 버전마다 14개 언어로 다시 찍는 공식 그림.
3. 모음에서 자동: 그 칸(`node`)·정상(`state: ok`)·최신(찍은 뒤 그 영역 화면·API 파일이 git에서 안 바뀜)만.
   **한국어 앱 화면(ja 학습·ko 앱)이 대표, 다른 언어 조합은 같은 장면의 보조(지도에서 눌러 바꿔 봄).**
   출처 순서 사용법 캡처 > 커밋 전 확인 > 기능 점검 > 가상 사용자, 같으면 최근. 칸 하나에 장면 4개까지.
4. 없으면 "그림이 필요한 칸"(모음 페이지 탭) — 다음 점검 때 찍을 목록.

## 정리 (지우기 전 7일 "정리 예정")
| 정리 예정이 되는 것 | 언제 |
|---|---|
| 빈 화면(10KB 미만·`state: blank`) | 바로 |
| 바뀐 옛 화면(`state: old`) | 바로 |
| 같은 칸·장면·언어 중복 | 최신 1장만 남기고 바로 |
| 찍은 뒤 그 영역 화면이 바뀜 | 바뀐 지 30일 뒤 |
| 오류 화면(`state: error`)·가상 사용자 화면 | 14일 뒤 |
안 지우는 것: 고른 그림, 지금 지도에 쓰는 그림, "남기기"(`keep: true`). 정리 예정은 페이지 "정리 예정" 탭에서 보고 남길 수 있다.

## 갱신 순서 (예약 작업 "서비스 지도 갱신" 06:52 매일, 월요일엔 3번 정리까지 · "가상 사용자 일일 보고"가 그날 캡처를 올림)
1. ArtifactData `list` `shots`(limit 1000)·`picks`를 `out_dir: tmp/shots/db`로 내려받는다(결과 목록의 version을 쓰기에 쓴다).
2. `node scripts/shots-plan.mjs` → `tmp/shots/plan.json`(marks·unmarks·deletes·nodes·sections·downloads).
3. (정리 작업만) marks → `update trash: {at, reason}`, unmarks → `update trash: null`, deletes → Artifact `delete`(url + path=assetId) 뒤 ArtifactData `delete` 행. 한 번에 batch.
4. downloads 중 `tmp/shots/img/`에 없는 것은 Artifact `read`(url, `path`=assetId, `out_dir: tmp/shots/img`) 한 장씩.
5. `npm run service-map` → 지도 올리기(hub/README.md "서비스 지도"). 모음 그림은 `shots/m-<assetId>`로 같이 올라간다.
6. `node scripts/shots-meta.mjs` → ArtifactData `set meta/plan`(file_path tmp/shots/meta-plan.json, if_version은 읽은 값).
페이지 소스는 `scripts/shots-page.html`(바꾸면 Artifact로 위 주소에 다시 올린다).

## 올리기 (커밋 전 브라우저 확인·가상 사용자 점검·기능 추가 뒤 찍은 화면)
1. Artifact 도구 `asset: true`, `url` = 위 주소, `file_paths`(25장씩) → 결과의 id·url.
2. ArtifactData `batch`로 `shots/<파일이름>-<YYYYMMDD>` 한 줄씩:
   `{url, assetId, file, title(한국어, "기능 — 장면"), area, node, scene, state, bytes, lang, date, source, order, keep: false}`
   - `node`: 지도 칸 id(`scripts/service-map.mjs` nodes — room·dm·groups·people·moyeo·pingo·webapp·billing 등), `scene`: 그 칸 안의 장면(같은 장면은 같은 이름 — 언어 조합끼리 묶임), `state`: ok·blank·error·old
   - `area`: room·talk·people·web·billing·chat·call·video·my·shell (STRUCTURE 영역)
   - `lang`: ko(ja 학습·ko 앱)·ja(en 학습·ja 앱)·ar(es 학습·ar 앱), 다른 조합이면 그대로 적는다(`th-ko` 등)
   - `source`: "커밋 전 확인" / "가상 사용자" / "기능 점검" / "사용법 캡처"
   - `order`: `YYYYMMDD*1000 + 번호`(최근 것이 위로)
3. 사람 얼굴·실제 사용자 글이 보이는 화면, 의견함 스크린샷은 올리지 않는다(테스트 계정 화면만).

## 고른 그림 반영하기 (버전 자를 때, 사용법을 손볼 때)
- ArtifactData `list` `picks` → 문서 id = 사용법 칸 id(`room.host` 등, `other.*`는 새로워진 점·스토어·창구), `{shotId, url, file, applied}`.
- `applied: false`인 것만: 그 화면을 UI 언어별로 다시 찍을지(`capture-whats-new.mjs guide`의 장면) 또는 그 그림을 그대로 쓸지 정해 넣고, 넣은 뒤 `update applied: true`.
- 고른 그림은 한 언어 조합의 화면이다. 사용법 그림은 14개 UI 언어로 필요하니 보통 **같은 장면을 캡처 스크립트로 다시 찍는 근거**로 쓴다.
