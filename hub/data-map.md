# 데이터 지도 (자동 생성)

> **손으로 고치지 마세요.** `node scripts/data-map.mjs`가 서버 코드(`src/lib/server`·`src/app/api`)의 키 문자열과 저장 호출에서 만들고,
> 키 묶음마다의 설명만 `scripts/data-map.json`에서 가져옵니다. 설명 없는 새 키가 생기거나 코드에서 키가 사라지면 CI(`data-map`)가 실패합니다.
> 운영 저장소를 이 지도와 맞춰 보고 정리하는 것은 `scripts/data-sweep.mjs`(KV 키 필요, PC). 점검 데이터는 점검이 끝날 때 저절로 지워집니다(`/api/simcheck/forget`).

## 저장하는 것

| 기능 | 키 | 누구 것 | 보관 | 계정 지울 때 | 무엇 | 코드 |
|---|---|---|---|---|---|---|
| 게시판 | `board:v1` | 모두 함께 | 2시간 · 2일 · 3650일 · 영구 | 지움 | 글(주제·붙인 방/단체방 id)·언어×주제 목록·댓글·글쓴이별 하루/시간 횟수, 좋아요 수·누른 사람·내가 누른 글(계정 지우면 내 좋아요를 되돌림) | `boardStore.ts` |
| 계정 | `account:v1` | 계정 | 10분 · 1시간 · 400일 · 영구 | 지움 | 계정 줄·아이디/이메일/Google 연결·사진·이메일 코드·로그인 실패 수, 읽음 표시 끔(rroff), 지울 학습 id 목록(purge) | `accountStore.ts` |
| 광고 | `ads:tx` | 운영 | 7일 | 해당 없음 | 보상형 광고 거래 번호(같은 보상 두 번 막기) | `entitlementStore.ts` |
| 광고 | `usage:adreward` | 학습자 한 명 | 3일 | 지움(주 1회 정리) | 오늘 본 보상형 광고 수 | `entitlementStore.ts` |
| 구독 | `rc:plan` | 학습자 한 명 | 5분 | 해당 없음 | RevenueCat 요금 확인 캐시(5분) | `revenueCat.ts` |
| 내 표현 | `learnerLedger:v1` | 학습자 한 명 | 400일 | 지움(주 1회 정리) | 표현 장부(쓴 표현·횟수, 언어별) | `ledgerStore.ts` |
| 노트 | `notePlace:v1` | 모두 함께 | 영구 | 해당 없음 | 노트 자리 찾기 결과(언어별 공유, 재사용) | `api/notes/place/route.ts` |
| 노트(짚은 장면) | `notebook:v1` | 학습자 한 명 | 400일 | 지움(주 1회 정리) | 튜터가 고친 줄(내가 쓴 줄·고친 줄·한 줄 설명·칸·어디서·언제) — 사용자가 고른 카드와 오늘의 학습 후보(안 고르면 7일 뒤 빠짐), 내가 만든 칸·칸 이름 바꾸기·메모(언어별). 학습자 문장이 남는 유일한 곳(2026-10-23 사용자 결정) | `notebookStore.ts` |
| 노트(짚은 장면) | `notebookShot:v1` | 학습자 한 명 | 400일 | 지움(주 1회 정리) | 노트 카드에 "화면 함께"로 붙인 그 순간 화면(기기에서 찍은 JPEG, 20만 바이트까지) — 카드를 지우면 함께 | `notebookStore.ts` |
| 단계 학습 읽는 법 | `readings:v1` | 모두 함께 | 400일 | 해당 없음 | 글자가 다른 학습 언어의 단계 학습 줄 읽는 법(가나·병음·로마자), 단계마다 한 번 모델이 만든 것 — 학습자 글 없음 | `stageReadings.ts` |
| 단체방·팀 | `grp:v1` | 방·대화 | 400일 · 5초 · 7일 · 계산(group ? groupTtl(group) : GROU) · 계산(groupTtl(group)) · 계산(ttl) | 지움(나가기) | 단체방·팀·초대·줄·잠금 | `api/groups/route.ts` `groupStore.ts` |
| 랜덤 연결(Spin) | `random:v1` | 계정 | 1095일 · 10초 · 1시간 · 1일 · 20초 · 2분 · 30일 · 3초 · 계산(Math.ceil((until - now) / 1000) | 지움(막힌 사람의 ci 해시 자리만 남김) | 성인인증 결과(성인 여부·날짜·ci 해시, 이름·번호·생년월일 없음)·쓴 인증 번호·대기 표·짝·최근 만난 사람·AI 검사 정지(24시간)·걸린 시각(30일)·검사 간격(3초) — 화면 자체는 저장 안 함 | `randomStore.ts` |
| 말하는 방 | `room:ban` | 방·대화 | 6시간 | 해당 없음 | 방에서 내보낸 사람 | `roomStore.ts` |
| 말하는 방 | `room:grant` | 방·대화 | 1분 | 해당 없음 | 말하기 자리 올리기 신호 | `roomStore.ts` |
| 말하는 방 | `room:index` | 방·대화 | 6시간 | 해당 없음 | 열린 방 목록 | `roomStore.ts` |
| 말하는 방 | `room:lines` | 방·대화 | 6시간 | 해당 없음 | 방 자막 줄(최근 300) | `roomStore.ts` |
| 말하는 방 | `room:m` | 방·대화 | 10분 · 5초 | 해당 없음 | 방에 있는 사람(30초마다 갱신) | `roomStore.ts` |
| 말하는 방 | `room:meta` | 방·대화 | 6시간 | 해당 없음 | 방 정보 | `roomStore.ts` |
| 말하는 방 | `room:parked` | 방·대화 | 30일 | 해당 없음 | 잠시 닫은 방(다시 열기용) | `roomStore.ts` |
| 말하는 방 | `room:peers` | 방·대화 | 6시간 | 해당 없음 | 방 연결 목록 | `roomStore.ts` |
| 말하는 방 | `room:seq` | 방·대화 | 6시간 | 해당 없음 | 줄 차례 번호 | `roomStore.ts` |
| 말하는 방 | `room:sig` | 방·대화 | 2분 | 해당 없음 | 소리 연결 신호 | `roomStore.ts` |
| 말하는 방 게임 | `room:game` | 방·대화 | 2시간 | 해당 없음 | 지금 게임 판(라이어: 참가자·제시어·라이어·라이어의 답 / 마피아: 역할·남은 사람·밤 소식·경찰 확인·배경 이야기, 2시간) | `roomGameStore.ts` |
| 말하는 방 게임 | `room:gboard` | 방·대화 | 6시간 | 해당 없음 | 그 방의 관전자 추리 순위(맞힌 횟수, 방이 열린 동안) | `roomGameStore.ts` |
| 말하는 방 게임 | `room:gguess` | 방·대화 | 2시간 | 해당 없음 | 관전자 한 사람의 추리(라운드마다, 2시간) | `roomGameStore.ts` |
| 말하는 방 게임 | `room:glock` | 방·대화 | 2시간 | 해당 없음 | 판 단계를 한 번만 넘기는 잠금(2시간) | `roomGameStore.ts` |
| 말하는 방 게임 | `room:gspec` | 방·대화 | 2시간 | 해당 없음 | 판에서 추리한 관전자(이름표·이름, 2시간) | `roomGameStore.ts` |
| 말하는 방 게임 | `room:gvote` | 방·대화 | ?(코드에서 못 읽음) | 해당 없음 | 게임 한 사람의 표·마피아 밤 행동(단계마다, 2시간) | `roomGameStore.ts` |
| 말하는 방 게임 | `room:gwords` | 방·대화 | 6시간 | 해당 없음 | 그 방에서 최근 나온 제시어 20개(6시간) | `roomGameStore.ts` |
| 말하는 방 게임 | `roomgame:v1` | 학습자 한 명 | 2일 | 해당 없음 | 방장이 오늘 시작한 게임 판 수(하루 30) | `roomGameStore.ts` |
| 메시지(1:1) | `dm:v1` | 방·대화 | 30일 | 남음(30일 뒤 만료) | 1:1 대화·요청·차례 번호 | `dmStore.ts` |
| 비용 | `usage:op` | 학습자 한 명 | 45일 | 지움(주 1회 정리) | 기능별 사용 횟수(비용 보고, 일별) | `entitlementStore.ts` |
| 비용 | `usage:tok` | 운영 | 45일 | 해당 없음 | 기능별 잰 토큰(일별, 사람 없음) | `meterRequest.ts` |
| 사람 사이 사진(1:1·단체방·게시판) | `media:v1` | 방·대화 | 2일 · 365일 · 37일 · 40일 · 계산(board ? BOARD_META_TTL : MEDIA) | 지움 | 사진 정보(올린 사람·붙인 곳·Blob 경로·크기·지울 때)·하루 올린 수·올린 사람별 id·날짜별 지울 목록 — 파일은 Vercel Blob(private) media/<id>, 1:1·단체방 30일·안 보낸 사진 하루·게시판은 글과 함께 | `mediaStore.ts` |
| 사람·팔로우 | `social:v1` | 계정 | 60일 · 90일 · 영구 | 지움(일부: 접속 기록) | 팔로우·팔로워 목록(followerset)·차단·관계·신고·접속·도운 수 | `opsStore.ts` `presenceStore.ts` `socialStore.ts` |
| 사용자 아이콘·짤 묶음 | `icon:v1` | 계정 | 2일 · 30초 · 3650일 · 영구 | 지움(만든 묶음·그림·받아 둔 목록·산 목록, 판매 묶음을 지우면 산 사람에게 포인트를 돌려줌, 쓰인 날 표시는 2일 기한) | 묶음(만든 사람·이름·라이선스 CC BY 4.0/CC0/앱 안 판매·가격·판매 상태·아이콘 크기·붙인 한 마디)·새/인기 목록·만든 사람별 목록·받아 둔 묶음·산 묶음·판매 묶음을 산 사람(계정·포인트 id·낸 포인트·만든 사람 몫)·쓰인 수·하루 올린 수 — 그림은 Vercel Blob(private) icons/<묶음>/<아이콘>.webp, 모두에게 공개 | `iconStore.ts` |
| 영상 | `usage:trial` | 학습자 한 명 | 영구 | 지움(주 1회 정리) | 영상 체험 쓴 것 | `entitlementStore.ts` |
| 영상 | `usage:video` | 학습자 한 명 | 70일 | 지움(주 1회 정리) | 영상 준비 사용(월별) | `entitlementStore.ts` |
| 영상 | `videoLine:v1` | 모두 함께 | ?(코드에서 못 읽음) | 해당 없음 | 자막 줄 풀이(영상·언어별 공유) | `subtitleGlossStore.ts` |
| 영상 | `videoTranscript:v1` | 모두 함께 | 400일 | 해당 없음 | 영상 자막(언어별 공유) | `videoTranscriptStore.ts` |
| 영상 | `videoTranscripts:v1` | 모두 함께 | 400일 | 해당 없음 | 자막 있는 영상 목록 | `videoTranscriptStore.ts` |
| 오늘의 팩 | `pack:days` | 학습자 한 명 | 15일 | 해당 없음 | 무료 사용자가 팩을 연 날짜(주 2번 한도, 15일 뒤 저절로 사라짐) | `packStore.ts` |
| 오늘의 팩 | `pack:v1` | 학습자 한 명 | 4일 | 남음(4일 뒤 만료) | 오늘의 팩 진행 | `packStore.ts` |
| 요금 한도 | `usage:aihelp` | 학습자 한 명 | 10분 · 2분 · 3일 | 해당 없음 | 오늘 쓴 AI 도움·방 자막 줄 수(사흘 뒤 저절로 사라짐), 방 내 줄 교정 표(글 지문·믿음 정도만, 10분) | `entitlementStore.ts` |
| 운영자 신고함(정지) | `ops:v1` | 계정 | 90일 · 계산(ttl) | 지움(정지 표시), 처리 표시는 90일 뒤 저절로 | 운영자가 누른 사람 기능 정지(기한·메모)와 처리한 신고 표시 | `opsStore.ts` |
| 의견 보내기 | `feedback:v1` | 운영 | 120일 · 2일 · 40일 · 90일 | 남음(90일) | 사용자가 보낸 의견·그림·반영 카드 | `api/feedback/news/route.ts` `feedbackFixStore.ts` `feedbackStore.ts` |
| 자라는 중 | `growth:v1` | 학습자 한 명 | 400일 | 지움(주 1회 정리) | 표현별 자라는 기록(언어별) | `growthStore.ts` |
| 자라는 중 | `selfcheck:v1` | 학습자 한 명 | 400일 | 지움(주 1회 정리) | 스스로 확인 기록(언어별) | `selfCheckStore.ts` |
| 자유 통화 | `rp:daily` | 학습자 한 명 | 계산((terms.callWindowDays + 1) * 2) | 해당 없음 | 오늘 쓴 자유 통화 분 | `entitlementStore.ts` |
| 자유 통화 | `usage:calls` | 학습자 한 명 | 영구 | 지움(주 1회 정리) | 통화 횟수(평생) | `entitlementStore.ts` |
| 자유 통화 | `usage:callsec` | 학습자 한 명 | 70일 | 지움(주 1회 정리) | 통화 초(월별) | `entitlementStore.ts` |
| 자유 통화 | `usage:rptrial` | 학습자 한 명 | 영구 | 지움(주 1회 정리) | 처음 20포인트 체험 쓴 양 | `entitlementStore.ts` |
| 점검 | `simforget:v1` | 점검 | 2일 | 해당 없음 | 점검 데이터 지우기 하루 횟수 | `simData.ts` |
| 지도 단계 | `scriptprog:v1` | 학습자 한 명 | 400일 | 지움(주 1회 정리) | 글자·소리 기초에서 통과한 묶음(언어별) | `scriptProgressStore.ts` |
| 지도 단계 | `stagecopy:v1` | 모두 함께 | 400일 | 해당 없음 | 단계 범위 화면 글·단계 대본과 틀의 뜻풀이를 앱 언어로 옮긴 것(학습 언어 × 앱 언어마다 하나, 대본·틀은 단계마다) | `stageCopy.ts` |
| 지도·미션 | `curriculum:` | 학습자 한 명 | 400일 | 지움(주 1회 정리) | 학습 지도·이전 지도·미션·약점(언어별) | `curriculumStore.ts` `weakPointStore.ts` |
| 지속 학습 빈도 단어 | `words:v1` | 모두 함께 | 400일 | 해당 없음 | 빈도 단어 50개 묶음마다 모델이 만든 예문·쓴 꼴·뜻·예문 뜻(학습 언어마다), 앱 언어로 옮긴 뜻 — 학습자 글 없음 | `wordCards.ts` |
| 지속 학습 빈도 단어 | `words:v2` | 모두 함께 | ?(코드에서 못 읽음) | 해당 없음 | 빈도 단어 묶음 카드의 앱 언어 뜻 — 원문 줄 지문까지 열쇠에 넣어 카드가 바뀌면 다시 옮김(2026-10-31), 학습자 글 없음 | `wordCards.ts` |
| 채팅 | `brief:v1` | 학습자 한 명 | 계산(brief.notes.length ? BRIEF_TTL) | 지움(주 1회 정리) | 튜터에게 주는 학습자 요약(짧게 캐시) | `learnerBrief.ts` |
| 채팅 | `usage:chat` | 학습자 한 명 | 3일 | 해당 없음 | 오늘 보낸 채팅 수 | `entitlementStore.ts` |
| 친구 초대 | `invite:v1` | 계정 | 400일 · 40일 · 60일 · 영구 | 지움 | 초대 코드·받은 사람·보상·월 횟수 | `inviteLinkStore.ts` `inviteRewardStore.ts` |
| 통화·오늘의 팩(문장 은행) | `bank:last` | 모두 함께 | 70일 | 해당 없음 | 은행 문장이 마지막으로 쓰인 날(언어별) | `entitlementStore.ts` |
| 통화·오늘의 팩(문장 은행) | `bank:said` | 모두 함께 | 영구 | 해당 없음 | 은행 문장이 쓰인 횟수(언어별, 평생) | `entitlementStore.ts` |
| 통화·오늘의 팩(문장 은행) | `bank:written` | 모두 함께 | 90일 | 해당 없음 | 모델이 새로 쓴 대사 모음(나중에 은행 후보) | `entitlementStore.ts` |
| 포인트 | `points:bought` | 학습자 한 명 | 영구 | 지움(주 1회 정리) | 산 포인트 | `entitlementStore.ts` |
| 포인트 | `points:credited` | 학습자 한 명 | ?(코드에서 못 읽음) | 지움(주 1회 정리) | 이미 넣은 구매 거래(두 번 막기) | `entitlementStore.ts` |
| 포인트 | `points:hold` | 학습자 한 명 | 6시간 | 해당 없음 | 통화 중 잡아 둔 포인트 | `entitlementStore.ts` |
| 포인트 | `points:part` | 학습자 한 명 | 영구 | 지움(주 1회 정리) | 꺼내 두고 남은 포인트 조각(1/1000, 쓴 만큼 깎기) | `entitlementStore.ts` |
| 포인트 | `points:rpcarry` | 학습자 한 명 | ?(코드에서 못 읽음) | 지움(주 1회 정리) | 통화 남은 초 이월(월별) | `entitlementStore.ts` |
| 포인트 | `points:rplast` | 학습자 한 명 | ?(코드에서 못 읽음) | 지움(주 1회 정리) | 마지막 통화 차감 | `entitlementStore.ts` |
| 포인트 | `points:rpsession` | 학습자 한 명 | ?(코드에서 못 읽음) | 지움(주 1회 정리) | 통화 세션별 차감 | `entitlementStore.ts` |
| 프로필 기여·꾸준함 | `contrib:v1` | 계정 | 120일 · 2일 · 400일 | 지움(요약, 나머지 중복 막기 표시는 2~120일 기한) | 받은 도움됐어요 수·언어별 수·반영된 의견 수·최근 30일 기록(시각·무게)·도움됐어요를 준 계정과 시각·공부한 날 — 문장·질문 내용 없음·공부 기록 숫자(통과한 대본·문장구조·말한 문장, n:) | `contribStore.ts` |
| 학습 지표 | `lm:asr` | 학습자 한 명 | 5분 | 지움(주 1회 정리) | 받아쓰기 확신도를 턴과 잇는 잠깐의 기록 | `learnerMetrics.ts` |
| 학습 지표 | `lm:events` | 학습자 한 명 | 400일 | 지움(주 1회 정리) | 턴마다 잰 값(말 없이, 월별) | `learnerMetrics.ts` |
| 학습 지표 | `lm:lastturn` | 학습자 한 명 | 1시간 | 해당 없음 | 세션의 마지막 턴 시각 | `learnerMetrics.ts` |
| 학습 지표 | `lm:optout` | 학습자 한 명 | ?(코드에서 못 읽음) | 지움(주 1회 정리) | 지표 기록 거부 | `learnerMetrics.ts` |
| 학습 지표 | `lm:session` | 학습자 한 명 | 400일 | 해당 없음 | 세션 요약 | `learnerMetrics.ts` |
| 학습 지표 | `lm:text` | 학습자 한 명 | 365일 | 지움(주 1회 정리) | 문장 원문 — LEARNER_TEXT_STORE=on일 때만(지금 꺼짐) | `learnerMetrics.ts` |
| 학습자 프로필 | `learnerComprehension:v1` | 학습자 한 명 | 400일 | 지움(주 1회 정리) | 이해한 표현 기록(언어별) | `learnerProfileStore.ts` |
| 학습자 프로필 | `learnerProfile:v1` | 학습자 한 명 | 400일 | 지움(주 1회 정리) | 실수 경향·턴 결과(언어별) | `learnerProfileStore.ts` |
| My 꺼내 쓰기 | `recall:v1` | 모두 함께 | 400일 | 해당 없음 | 문장구조 하나·둘마다 모델이 만든 말할 문장과 뜻(학습 언어마다), 앱 언어로 옮긴 뜻 — 학습자 글 없음 | `recallPrompts.ts` |
| My 단계 대본 | `script:daily` | 학습자 한 명 | 3일 · 6시간 · 90일 · 영구 | 그대로(사흘 뒤 저절로 사라짐) | 오늘 대본에서 확인받은 내 줄 수(요금별 하루 한도) — 숫자 하나 | `entitlementStore.ts` |
| My 단계 대본 | `stageScripts:v1` | 학습자 한 명 | ?(코드에서 못 읽음) | 지움(주 1회 정리) | 통과한 단계 대본·틀 id와 통과한 때, 틀 다시 연습을 끝낸 때, 다시 볼 표현·문장구조·문법과 날짜(학습 끝 체크·직접 묻기·대본에서 두 번 틀린 줄의 문장구조, 언어별), 직접 물어본 곳 열쇠별 횟수·때, 시험 결과(처음 시험·단계 시험·단계 미리 확인·이번 주 확인 — 갈래·단계·배운 때별 맞힌 수와 틀린 열쇠, 최근 30번), 시험에서 맞힌 열쇠와 맞힌 날(확인 중·이미 앎, 600개 — 대화에서 막혀 퀴즈로 맞힌 말 u|도, 말 한 덩어리만) — 말한 문장·질문·답 글은 남기지 않음 | `stageScriptStore.ts` |
| My 단계 대본 고르기 | `scriptChoices:v2` | 모두 함께 | ?(코드에서 못 읽음) | 해당 없음 | 대본 내 줄마다 빈칸과 오답(문법·어휘로 헷갈리는 것), 대본마다 한 번 모델이 만들고 정답처럼 받아들여질 오답은 확인해 뺀 것 — 학습자 글 없음 | `api/curriculum/choices/route.ts` |
| My 단어장 찾아서 늘어나는 단어 은행 | `wordsextra:v1` | 모두 함께 | 2일 · 800일 · 영구 | 해당 없음(누가 찾았는지 없음) | 사용자가 찾은 낱말 중 빈도 목록에 없던 것 — 사전형·품사·주제·읽기·예문·뜻(모델이 만듦) 50개 묶음과 개수·찾은 꼴 → 묶음 번호, 앱 언어로 옮긴 뜻(gloss), 하루 더하기 한도 셈(rate, 사용자 id로 하루 뒤 사라짐) | `wordExtras.ts` |
| My 문장구조 수업 | `framelesson:v5` | 모두 함께 | 400일 | 해당 없음 | 문장구조마다 모델이 만든 뜻·구조(조각마다 하는 일)·쓰임 설명과 주고받기 세 번(학습 언어 줄과 뜻), 앱 언어로 옮긴 설명·뜻 — 학습자 글 없음 | `frameLesson.ts` |
| My 시험(문제 난이도) | `itemStats:v1` | 모두 함께 | ?(코드에서 못 읽음) | 해당 없음(누구 것인지 남기지 않음) | 학습 언어마다 시험 문제 열쇠별 낸 수·맞힌 수(모든 사용자 합, 말하기 빼고) — 시험을 짤 때 가르는 문제 먼저, 막힌 문제 뒤로 | `itemStatsStore.ts` |
| My 퀴즈 자라는 문제은행 | `qbank:v1` | 모두 함께 | 2일 | 해당 없음 | 열쇠(표현·문장구조·낱말)마다 모델이 만든 새 예문(학습 언어 + 영어 뜻)과 헷갈리는 오답, 예문·오답마다 풀린 수·맞힌 수·고른 수, 하루 성장 예산(budget), 앱 언어로 옮긴 뜻(gloss) — 학습자가 친 글·누가 풀었는지 없음 | `qbank.ts` |

## 읽는 법

- **누구 것**: 학습자 한 명(익명 id `rc:…` 또는 계정의 학습 id) · 계정 · 모두 함께(언어별 공유 통계) · 방·대화 · 운영 · 점검.
- **보관**: 저장 호출에 적힌 만료. `영구`는 만료 없이 남는다는 뜻 — 지울 길(계정 삭제·정리)이 있는지 확인할 곳.
- **계정 지울 때**: 지움(바로) / 지움(주 1회 정리 — `/api/account/purge` 예약 실행이 학습 id의 키를 훑어 지움) / 남음(기한 뒤 만료) / 해당 없음.
- 점검 데이터는 키 이름에 `simcheck-`가 든 것(가상 사용자). 실제 사용자 id에는 이 글자가 없다.
