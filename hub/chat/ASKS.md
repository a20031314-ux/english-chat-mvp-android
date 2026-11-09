# 확인 요청

> **자동 생성 — 손으로 고치지 않는다.** 원본 `hub/chat/asks.json` → `node scripts/asks.mjs`(머리 주석에 쓰는 법).
> 기능을 바꾼 채팅이 그 코드가 닿는 **다른 탭마다** "거기서도 이렇게 되나" 요청을 만들고(`apply`), 받는 탭이 확인해 답한다(`answer`). 옛 코드를 지울지는 **사용자에게** 묻는다(`delete`).
> 시작 훅이 열린 요청을 채팅에 넣고, `/take N`은 그 탭 요청부터 처리한다. 끝내기 훅은 다른 탭에 닿는 변경에 요청이 없으면 막는다.

## 사용자에게 물을 것 — 옛 코드 지우기 (0)

없음

## 탭이 확인할 것 (5)

### 탭 1 메인

- **a261109-2-3** (2026-11-09 15:33, 탭 2 · 0d26174) Languagebank 자주 쓴 말·단어 화면 학습/대화 수 따로·같이 배우기 칩(사전 시트에서도 — Dictionary.tsx)
  - 기능: 이렇게도 말할 수 있었어요 · 첫 측정 · 실력 확인 · Logbank · Quizbank · Languagebank · 넘겨 보기 · 소재 수업 · 사전 주석 · My에서 찾기
  - 볼 곳: `components/FindInMy.tsx`
  - 볼 것: 이 화면들에서도 새 동작이 나오나 · 옛 동작(같은 일을 따로 하는 코드)이 남았나 · 문구 14개 언어

### 탭 3 AI

- **a261109-2** (2026-11-09 14:35, 탭 2 · 1b63757) 실력 확인: firstCheck.ts startClimb에 시작 단계 인자(선택)를 더함 — studyPicture가 읽는 readFirstCheck·firstCheck.v1은 그대로. 통화 감독이 첫 측정 값만 보는데, 이제 실력 확인(skillCheck.v1)이 더 새 값을 가지니 그걸 쓸지 확인
  - 기능: 처음 언어·튜터 고르기 · AI 튜터 줄 · 튜터 프로필 · AI 채팅 · 자유대화 · 통화 끝 화면 · 이렇게도 말할 수 있었어요 · 사람 · Room · 첫 측정 · 실력 확인 · Logbank · 오늘 카드 · Quizbank · Languagebank · 넘겨 보기 · 소재 수업 · 사전 주석 · 문장분석 · My에서 찾기
  - 볼 곳: `components/ChatWindow.tsx` · `components/roleplay/CallParts.tsx` · `components/roleplay/CallReplay.tsx` · `components/conversation/LineTools.tsx` · `components/videoLearning/CurrentSubtitleCard.tsx` · `components/RoleplayScreen.tsx` · `components/MessageBubble.tsx` · `components/videoLearning/StudyMaterialsList.tsx` · `components/CallHost.tsx` · `lib/pack/pack.ts` … 1개 더
  - 볼 것: 이 화면들에서도 새 동작이 나오나 · 옛 동작(같은 일을 따로 하는 코드)이 남았나 · 문구 14개 언어
- **a261109-2-2** (2026-11-09 15:09, 탭 2 · cf72967) Logbank 오늘을 ▶ Quizbank 하나로 합침(막힌 것·다시 학습·새로 학습·써 보기 카드 없음), todayCards.ts pickCards·doneOf 지움 → stuckKeys·answeredToday, Quizbank 다시 볼 것은 막힌 것 먼저, 표현 시작 단계 = 최근 실력 확인. 오늘 카드·써 보기를 가리키던 화면·글이 있으면 확인
  - 기능: 자유대화 · 이렇게도 말할 수 있었어요 · 첫 측정 · 실력 확인 · Logbank · 오늘 · Quizbank · Languagebank · 넘겨 보기 · 소재 수업 · 사전 주석 · My에서 찾기
  - 볼 곳: `components/RoleplayScreen.tsx` · `components/roleplay/CallReplay.tsx` · `components/conversation/LineTools.tsx` · `components/videoLearning/CurrentSubtitleCard.tsx`
  - 볼 것: 이 화면들에서도 새 동작이 나오나 · 옛 동작(같은 일을 따로 하는 코드)이 남았나 · 문구 14개 언어
- **a261109-2-4** (2026-11-09 15:33, 탭 2 · 0d26174) Languagebank 자주 쓴 말·단어 화면 학습/대화 수 따로·같이 배우기 칩(사전 시트에서도 — Dictionary.tsx)
  - 기능: 이렇게도 말할 수 있었어요 · 첫 측정 · 실력 확인 · Logbank · Quizbank · Languagebank · 넘겨 보기 · 소재 수업 · 사전 주석 · My에서 찾기
  - 볼 곳: `components/conversation/LineTools.tsx` · `components/videoLearning/CurrentSubtitleCard.tsx` · `components/roleplay/CallReplay.tsx`
  - 볼 것: 이 화면들에서도 새 동작이 나오나 · 옛 동작(같은 일을 따로 하는 코드)이 남았나 · 문구 14개 언어

### 탭 4 사람

- **a261109-3** (2026-11-09 14:35, 탭 2 · 1b63757) 실력 확인: firstCheck.ts startClimb에 시작 단계 인자(선택)를 더함 — studyPicture가 읽는 readFirstCheck·firstCheck.v1은 그대로. 통화 감독이 첫 측정 값만 보는데, 이제 실력 확인(skillCheck.v1)이 더 새 값을 가지니 그걸 쓸지 확인
  - 기능: 처음 언어·튜터 고르기 · AI 튜터 줄 · 튜터 프로필 · AI 채팅 · 자유대화 · 통화 끝 화면 · 이렇게도 말할 수 있었어요 · 사람 · Room · 첫 측정 · 실력 확인 · Logbank · 오늘 카드 · Quizbank · Languagebank · 넘겨 보기 · 소재 수업 · 사전 주석 · 문장분석 · My에서 찾기
  - 볼 곳: `components/AiTutorProfile.tsx` · `components/rooms/RoomView.tsx` · `components/AiTutorRow.tsx` · `components/rooms/PeopleTab.tsx` · `components/rooms/RoomsScreen.tsx`
  - 볼 것: 이 화면들에서도 새 동작이 나오나 · 옛 동작(같은 일을 따로 하는 코드)이 남았나 · 문구 14개 언어

## 최근 답 (8, 14일 뒤 저절로 빠짐 — 경위는 git 기록)

- a261109-2-1 → 1 메인: **해당없음** — FindInMy·사용법·새로워진 점에 오늘 카드·써 보기를 가리키는 곳 없음 · Logbank 오늘을 ▶ Quizbank 하나로 합침(막힌 것·다시 학습·새로 학습·써 보기 카드 없음), todayCards.ts pickCards·doneOf 지움 → stuckKeys·answeredToday, Quizbank 다시 볼 것은 막힌 것 먼저, 표현 시작 단계 = 최근 실력 확인. 오늘 카드·써 보기를 가리키던 화면·글이 있으면 확인 (2026-11-09 15:25)
- a261109-9 → 사용자: **지움** — 사용자 2026-11-09 네 묶음 모두 지움 — 같은 커밋에서 지움 · AI 통화 옛 조각(callLines·realtimeCallSession) — 테스트만 씀 (2026-11-09 14:56)
- a261109-8 → 사용자: **지움** — 사용자 2026-11-09 네 묶음 모두 지움 — 같은 커밋에서 지움 · 글자 안내 패널 데이터(characterGuide) — 패널은 지웠고 테스트만 씀 (2026-11-09 14:56)
- a261109-7 → 사용자: **지움** — 사용자 2026-11-09 네 묶음 모두 지움 — 같은 커밋에서 지움 · 옛 단계 만들기 엔진(curriculum/engine) — 테스트만 씀 (2026-11-09 14:56)
- a261109-6 → 사용자: **지움** — 사용자 2026-11-09 네 묶음 모두 지움 — 같은 커밋에서 지움 · 옛 My 계산(단계 시험·배치·정기 시험·대본 양·추천 등) — 화면은 지웠고 테스트만 씀 (2026-11-09 14:56)
- a261109-5 → 2 My: **고침** — 확인함. 표현 시작 단계를 첫 측정만이 아니라 가장 최근 확인(실력 확인 포함, skillCheck.ts latestCheck)에서 읽게 고침. 같은 커밋에서 55c16ce가 package.json에서 빠뜨린 check:features 스크립트·skillCheck.test도 되살림. · Quizbank 표현은 첫 측정 표현 단계부터, 넣어 둔 문법은 바로 아래 단계부터 (2026-11-09 15:05)
- a261109-4 → 1 메인: **해당없음** — FindInMy는 수업·사전만 엶 — Quizbank 순서(expressionDeck·preparedQuiz)를 안 씀 · Quizbank 표현은 첫 측정 표현 단계부터, 넣어 둔 문법은 바로 아래 단계부터 (2026-11-09 15:06)
- a261109-1 → 1 메인: **해당없음** — 탭 1 화면은 startClimb를 부르지 않음(인자는 선택이라 기존 호출 그대로) — 통화 감독(studyPicture) 쪽은 탭 3 요청 a261109-2에서 · 실력 확인: firstCheck.ts startClimb에 시작 단계 인자(선택)를 더함 — studyPicture가 읽는 readFirstCheck·firstCheck.v1은 그대로. 통화 감독이 첫 측정 값만 보는데, 이제 실력 확인(skillCheck.v1)이 더 새 값을 가지니 그걸 쓸지 확인 (2026-11-09 15:06)
