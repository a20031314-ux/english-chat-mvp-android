# 인계 노트 — 다음 채팅이 이어받을 것

> 긴 채팅을 닫고 새 채팅으로 넘어갈 때 남기는 한 장. 가장 최근 것 하나만 둔다(덮어쓴다).
> 자세한 기록은 `hub/log/`(이번 채팅 것은 `2026-10.md` 10-31 dev 항목들 + `2026-11.md`), 역할별 할 일은 `hub/roles/`, 앱 설명은 `PRODUCT.md`, 퀴즈 규칙은 `hub/QUIZ.md`.
> 작성: 2026-11-01 07시(KST) · dev 채팅(My·Quizbank 개편) · main `5374f66` 기준. **모두 main에 push됨, 남은 변경 없음.**

## 지금 어디까지 왔나

- **Play:** 2.75(89). 다음 앱 2.78(92)은 10-29에 잘랐지만 그 뒤 My 개편이 main에 계속 쌓임 — **아래 "앱 빌드 필요"는 전부 2.78 이후 커밋**이라 빌드를 다시 만들 때 함께 들어간다(새로워진 점·출시 노트·사용법 그림은 그때 다시).
- **이번 채팅이 main에 넣은 것(모두 앱 빌드 필요, 서버 쪽은 배포됨):**
  - My 큰 칸 셋 = **Stagebank · Quizbank · Logbank**(14개 언어 같은 이름), 모두 펼친 채 시작, 위 칸 이름 줄을 누르면 그 칸 전체 화면.
  - 칸 머리 **?** 설명 시트(`studyMap/BankHelp`, `lib/guide/banks.ts`, 그림 `scripts/capture-bank-guide.mjs`, 영상 `scripts/guide-clips.mjs` bank-stage·bank-keep).
  - **Logbank** = 주·날마다 배운 것 목록(AI 없음) + 그날 결과 카드(통화 정리·문장구조 수업·꺼내 쓰기·상황·Quizbank 틀린 것 — **이 폰에만** `dayLog.v1`·`quizDays.v1`), 카드 ✕ · 날짜 🗑.
  - Quizbank 답한 뒤 예문 둘 + "다음", 빈칸 뜻 줄은 답한 뒤에만.
  - 가상 사용자 문제 표시 `/mark` → `scripts/ux-check/triage.mjs` → `FIX.md`로 **그 채팅에서 바로 고치기**(첫 회 103개 중 약 45 고침, `hub/drafts/ux-marks-2026-11-01.md`).
  - **맞힌 문제 반복 없앰:** 한 번 맞히면 익힘(`known.ts` KNOWN_DAYS 1, 확인은 1·3·7일 뒤만), 문법·표현 탭은 맞힌 열쇠를 연속 맞힘 따라 1·3·7·14·30·60일 쉼(`nextStudy.ts` REST_DAYS), 문장구조 수업 퀴즈 결과도 기록(`quizLogStore.ts`). 서버: 퀴즈 정답도 익힘을 만듦(바로 반영).
  - **Quizbank 어휘 탭 = 처음 보는 낱말만 + 📝 단어 시험**(`circle.ts` pickCircle·wordTest·wordTestDue): 새 낱말 20개마다·틀린 낱말 8개·잊을 때 된 맞힌 낱말 넷 → 10문제(틀린 것 + 맞힌 것 최소 셋). 정답률 목표·⚙ 정답률은 없앰.

## 사용자 결정 대기 (먼저 물어볼 것)

1. **틀린 낱말이 쌓임:** 어휘 탭이 새 낱말만 내서, 처음 배우는 사람이 하루 40개씩 풀면 틀린 낱말이 시험보다 빨리 쌓임(시뮬레이션 14일 약 480개). 안: ① 틀린 낱말이 30개쯤 넘으면 새 낱말을 쉬고 시험 먼저 ② 시험 문제 수 늘리기.
2. **같은 문장 반복의 남은 원인**(11-01 원인 분석, 고치는 안까지 보고함): 같은 문장을 여러 열쇠가 나눠 씀(1단계 문장 84%) · 문제은행 새 예문이 첫 문제에 안 쓰임(만든 뒤에야 받아 옴, 메모리에만) · 오늘 할 것과 Quizbank가 같은 문제를 동시에 냄 · 문제 순서에 무작위 없음. 안: 문제은행 미리 받아 폰에 저장 / 본 문장 기억해 열쇠가 달라도 뒤로 / 예문 적은 열쇠 문제은행 더 일찍 키우기(서버·비용 조금) / 날마다 순서 섞기 / 오늘 할 것에 떠 있는 문제는 Quizbank에서 빼기.
3. 문법·표현 빈칸에 답하기 전 뜻 줄을 다시 보일지(10-31 사용자가 뺌, 답이 여럿인 문제가 생김).
4. **작업 줄(lane) 설계** `hub/drafts/lanes-2026-11-01.md` — 다른 채팅이 쓴 초안, "정할 것"을 사용자가 고르기 전.

## 알려진 문제 · 다음에 할 일

- Quizbank ? 설명 영상(bank-keep)은 옛 ⚙ 정답률 화면 — `node scripts/guide-clips.mjs bank-keep`으로 다시 찍기(14개 언어, `public/guide/<언어>/bank-keep.mp4`).
- 단어 시험 확인 때 일부러 틀리게 고른 10개 중 1~2개가 맞음으로 기록됨 — 점검 스크립트가 보기를 잘못 고른 것인지 채점 문제인지 미확인(`InlineQuiz`·`QuizPlayer` 고르기 채점).
- `/mark`: 문장구조 수업 "대화" 단계는 문제 정보(data-quiz-meta)가 안 남음. 낱말 카드 예문의 단계 맞추기.
- 스페인어 어휘에서 el 다음 él처럼 철자 비슷한 낱말이 연달아 나옴(빈도 순서 그대로).
- 버전을 다시 자르기 전: 사용자 체감 점검(RULES) — 이번 개편(My 세 칸·Logbank·단어 시험) 뒤 아직 안 돌림.

## 쓰는 도구

- 브라우저 확인: `npm run build:capacitor`(도는 동안 커밋 금지) → www를 띄우고 /api·/guide는 운영으로 프록시, `x-rc-user`는 `simcheck-` id → 끝나면 `/api/simcheck/forget`.
- 어휘 시뮬레이션: `node --experimental-strip-types scripts/quiz-circle-sim.ts 14 40`.
- 허브 페이지: `node scripts/hub-page.mjs` → `tmp/hub/index.html`을 https://claude.ai/artifact/S9UCzdZQ2Ck6VGDTKkSrEo 에 다시 올림(거절되면 내 페이지가 더 새 커밋에서 만든 것인지 보고 다시).
