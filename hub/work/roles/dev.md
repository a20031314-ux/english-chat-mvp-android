# 기능 개발

## 맡는 일
- 앱 화면·흐름·서버 API 기능을 만들고 고친다. main에 push하면 서버가 바로 배포된다.
- 새 화면 문구는 14개 언어로 넣는다 (AGENTS.md "Language combinations" 1번).
- 기능이 앱에 들어가는 출시면 `src/lib/whatsNew.ts`에 안내 항목을 추가하고 `scripts/capture-whats-new.mjs <버전>`으로 캡처를 만든다.

## 하지 않는 일
- Play 등록정보·출시 노트 (→ store), 버전 올리기와 배너 기준 (→ store, 요청받으면 같이).
- 점검에서 나온 문제를 혼자 판단해 고치기 시작하지 않는다. inbox로 받은 것만, 또는 사용자가 고르라고 한 것만.

## 시작할 때
1. `git pull`, `inbox.md`에서 `→ dev` 항목 확인.
2. 만들 기능이 `hub/app/FEATURES.md`에 이미 있는지 본다 — 있으면 그 기능을 넓히고 이름·문구 키를 그대로(RULES 맨 위 절). `PRODUCT.md` 핵심 가치에 맞는지 본다.
3. 아래 "열린 일"과 사용자의 요청을 맞춰 본다.
4. 고정 문장·기능 생성, 사용자 체감 점검은 Cursor 구독 에이전트를 먼저(STATE).

## 끝낼 때
- 커밋에 이 파일(열린 일 갱신)과 `hub/chat/log/YYYY-MM.md` 한 항목을 같이 넣는다. 끝난 일은 열린 일에서 지운다(세부는 log에만).
- 기능이 생기거나 빠지면 `scripts/features.json` → `node scripts/features.mjs`, 바꾼 기능의 옛 화면·문구·문서 줄은 같은 커밋에서 지운다(`npm run check:features`).
- 화면·기능·한도가 바뀌었으면 `PRODUCT.md`·`hub/app/STRUCTURE.md` 위쪽의 그 줄을 새로 쓴다.
- 출시가 필요한 변경이면 `inbox.md`에 `dev → store` 한 줄, 화면이 바뀌었으면 `dev → qa` 한 줄(무엇을 어떤 언어 조합으로 볼지).

## 열린 일

> 남은 것만 한 줄씩(2026-11-09 다시 씀). 그 전 열린 일 원문은 `hub/archive/roles-dev-2026-11-09.md` — 거기서 아직 남은 일을 찾으면 여기로 한 줄 옮긴다.
> 사용자 결정 대기는 `hub/STATE.md` "결정 대기", 점검·리뷰가 넘긴 버그는 `hub/work/inbox.md`의 `→ dev` 줄.

- **사용법 넘겨 보기 장면 다듬기:** 14개 앱 언어 모두 들어감(`lib/guide/slides.ts`·`slideTitles.ts`·`scripts/guide-slides/`). 남은 것: 몇 언어는 흐름 첫 그림이 고르기 문제가 아님(pt·ar·ru 등 — 이름표만 고르기), 문장 쓰기 문제가 안 나와 흐름이 두 단계인 언어, 수업 숙제 화면 장면, 친구 초대 장면, 칸 머리 ?(BankHelp — 예전 글)를 사용법 그 칸으로 열지, 예전 칸 글·학습 흐름(`overview.ts`·`content.ts` 칸 글)은 옛 앱 2.79만 받게 된 뒤 정리. `whatsNew.ts` 94 항목도 없음.
- **Logbank 쌓기·Quizbank 게이지 장면:** 사용법 `log-core`(쌓기 기둥 전)·Quizbank 장면(게이지 이름표·막대 전)이 옛 화면 — 버전 자를 때 `scripts/guide-slides/shoot.mjs` 다시(14개 앱 언어). 남은 숫자 어긋남 둘은 inbox `qa → dev` 2026-11-21 줄.
- **이름 정리 56묶음:** `hub/app/FEATURES.md` 끝 목록 — 같은 기능이면 한 키로, 다른 기능이면 이름을 바꾼다. 먼저 "알아요"(checkKnown·itemsMastered·knownTag·markKnown)·"복습"·"이어서 하기". 고치면 `node scripts/check-copy-keys.mjs --write`.
- **지울 것 1:** `hub/app/FEATURES.md` "지울 것" — 아침 알림(`morningNotify.ts` — 되살릴지 사용자 결정 뒤).
- **옛 앱 전용 서버·lib:** 최소 지원 버전을 2.81 이상으로 올리면 오늘 해볼 것 서버(`/api/learner/next`·`learner/next.ts`·`learner/practice.ts`, chat·turn의 practice 받기, 가상 사용자 `next` 묶음)도 지운다. 2.80 이상으로 올리면 `hub/app/FEATURES.md` "옛 앱 전용"과 그 서버만 쓰는 lib(`checkup.ts`·`recall.ts`·`stageScripts` 대본 쪽 등)를 지운다.
- **My에서 찾기:** 문법·표현 열쇠가 없는 말은 사전 시트로 바뀜(2026-11-09) — 서버 `/api/notebook` locate가 고른 노트 칸(관용·세부)은 새 앱에서 안 씀. 옛 앱이 안 부르게 되면 locate 응답을 줄인다.
- **퀴즈 사다리 남은 것:** 넣어 둔 40칸에 고르기 다른 모양(문맥·대답·틀린 문장) 재료(Cursor 에이전트), 틀린 곳 다양화("없음" 문항·헷갈리는 맞는 칸), 표현에 회차 없음, 13개 언어 문장 색인, 게이지 +2 위 단계 화면 확인 — 3번 인계 노트.
- **퀴즈 다시 짜기 남은 것:** 앱 → `/api/curriculum/spots` 미리 만들기 연결(한 문장 새로 쓰기 칸), `qstat:v1` 한 달 쌓이면 사다리·게이지 값 고치기(Elo식 추정 여부) — 설계안 `hub/work/drafts/quiz-redesign-2026-11-10.md` §10.
- **사전 예문 오류 고치기:** `hub/work/drafts/dict-errors-2026-11-10.txt`(ar 110 · fr 3) — word-sentences 고치고 `--check`.
- **앱 언어별 짧은 뜻 미리 채우기:** 사전 예문은 14개 언어 다 채움(2026-11-10) — 짧은 뜻은 사용자 결정 대기(Haiku 묶음 API로 수십 달러 추정).
- **같이 배우기 남은 것:** 문법 이름이 ko·en 밖 앱 언어에서 영어(stageScripts TRANSLATED에 문법 이름 옮기기 — Cursor 에이전트), 반말·구어 표현은 틀이 안 잡힘(framesInLine 넓히기), 유의어(데이터 없음 — 만들면 Cursor 에이전트로 고정 데이터), 활용형 맞추기(es comer처럼 틀 예문에 그 꼴이 없으면 칸이 안 보임), 사람 대화에서 맞게 쓴 말은 장부에 안 남아 대화 수에 안 듦(4번 탭과).
- **통화 하나(코치 띠) 남은 것:** 실제 기기 한 번 — 띠가 말하는 중에 방해되지 않나·따라 말하기 채점이 받아쓰기 탓으로 너무 짠가·요즘 배운 말이 대화에 나오나. 감독 `coach`·`study`·`studyOpen` 길은 Play 2.79용(FEATURES 옛 앱 전용) — 최소 지원 2.80이면 지움.
- **섞어 말하기 통화(설계만):** `hub/work/drafts/call-mix-2026-11-08.md` — 정할 것 셋 사용자 대기.
- **체감 점검 2026-11-09 남은 지적:** 쉬운 단어(`presumedWords` 순위 0부터·카드 없을 때 묶음 퀴즈로 빠짐), 뜻 없는 빈칸(`glossFirst`), U11 숙제 끝 화면 — 보고서 `hub/work/drafts/ux-check-2026-11-09.md`, 순서는 사용자.

## 참고
- 로컬 확인: `npm run build:capacitor` 후 www를 띄우고 /api는 운영 서버로 프록시(`scripts/browser-language-pass.mjs`가 같은 방식).
- 웹에서는 YouTube 음성 추출이 막혀 영상 준비가 NO_AUDIO로 실패한다. 영상은 기기에서만 확인 가능.
- 화면 흐름 `hub/app/STRUCTURE.md`, 기능 장부 `hub/app/FEATURES.md`, 퀴즈 `hub/app/QUIZ.md`, 광고 `hub/app/ADS.md`, 비용 `hub/app/costs.md`, 저장 `hub/app/data-map.md`.
- **Quizbank 고급자 아래쪽 공백:** 경계 한참 아래 낱말은 `presumedWords`가 새 낱말 묶음에 하나씩만 끼워서, 경계 위 낱말이 떨어지면 끝까지 안 나옴(시뮬레이션 고급자 약 2,550개) — 새 낱말이 떨어지면 아래쪽 확인을 묶음으로 낼지 사용자 방향 대기(log 2026-11-09 "맞힌 것 저절로 다시 안 냄").
