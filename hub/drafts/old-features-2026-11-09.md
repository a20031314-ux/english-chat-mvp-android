# 지금 결정과 안 맞는 옛 기능 전수조사 (2026-11-09, 탭 2)

사용자 "지금 변경내용이랑 일치하지 않는 옛날 기능들 다 찾아줘". 조사만, 고친 것 없음.
기준(오늘까지의 결정): 표시는 있었던 일만(학습 · n번 학습 · 자주 씀, 체크 셋·복습 이름 없음), 대본 뺌, 낱말 → 단어, 개편 My = Logbank · Quizbank · Languagebank(Stagebank·오늘 할 것·단계 사다리 없음).
범위: 개편 스위치가 켜진 화면(시험 앱·`lbReform`)에서 보이는 것 먼저, 그다음 설명 글·저장 데이터·옛 화면·안 쓰는 문구.

## A. 개편 화면에서 지금 보이는 것

| # | 어디 | 무엇이 안 맞나 | 파일 |
|---|---|---|---|
| A1 | My 칸 ? 설명(Quizbank·Logbank) | 옛 Quizbank(탭 [어휘·문법·표현·복습] · 📝 단어 시험 · ⚙ 어떤 단어)와 옛 Logbank(육각형 · 📎 기록 · 꼭짓점 게이지)를 설명. Languagebank는 ? 없음 | `lib/guide/banks.ts` TEXT·ORDER(14개 언어), 그림 `capture-bank-guide.mjs` |
| A2 | 사용법(?) My 장 | "1. Stagebank: 오늘 할 것을 하나씩 · 2. Quizbank: 직접 써서 풀고 시험 · 3. …" — 개편 흐름(Logbank 오늘 카드 → Quizbank → Languagebank)이 아님 | `lib/guide/overview.ts`·`content.ts`(서버 /api/guide — 바로 반영 가능) |
| A3 | Logbank 맨 위 띠·육각형 | 장부로 계산한 "1~5단계 채운 %"와 꼭짓점 → 부족한 점·순서·추천(fill-gauge 11-02) — %는 예외로 허용된 것이지만, 아래 배운 것 표·타임라인과 다른 셈(어림) | `SkillBands`·`SkillHexagon`·`curriculum/fill.ts`·`fillInputs.ts` |
| A4 | 통화 끝 정리 | 저장되면 "✓ 복습" — 복습 이름 | `roleplay/CallRecap.tsx` 60 (`studyReview`) |
| A5 | 넘겨 보기 | 버튼 [헷갈려요 \| 알아요], 끝 "n장 중 m장 알아요" — 누르는 말이지만 옛 상태 이름 "알아요"와 같은 글자 | `BankFlip.tsx` (`checkKnown`·`flipDone`) |
| A6 | 첫 측정 단어 예/아니오 | "알아요" 버튼 — 같은 글자 | `FirstCheck.tsx` (`fcKnow`) |
| A7 | Logbank 장부 없는 날(11-06 전) 세부 | 예전 DayBody: "✓ 알아요"(서버 익힘)·"Quizbank · 복습 🗑" | `Logbank.tsx` DayBody·DayResults (`itemsMastered`·`weakTitle`) |
| A8 | Logbank 기간 범례(⏱·갈래 막대) | ✓ 알아요 · • 배움 · ✗ 고침 범례 — 개편에서 막대가 보일 때 | `Logbank.tsx` partLegend 492 |
| A9 | 새로워진 점 | 2.80(versionCode 94) 항목 없음 — 개편·타임라인·표시 바뀐 것 안내 없음(마지막 93) | `lib/whatsNew.ts` |

## B. 저장 데이터 — 개편에선 안 읽는데 아직 쓰는 것

| 저장 | 쓰는 곳 | 개편에서 |
|---|---|---|
| `quizDays.v1` | 퀴즈 답마다(noteQuizDay) | Logbank ⏱ 막대·날 목록만(장부와 숫자가 어긋날 수 있음 — 11-08 감사 D1) |
| `quizCircle.v1` items(익힘·확인 중) | 퀴즈 답마다 | 단어 경계 lv만 씀, items의 익힘 상태는 안 씀 |
| `known.v1`(KnownMap 맞힌 날) | 퀴즈·수업 | 개편 화면은 안 읽음(fillInputs도 11-07부터 안 씀) |
| `quizLog`·`quizKinds`·`studyTally`(오늘 +n 앎) | 퀴즈 | 개편 화면은 안 읽음 |
| 서버 `notebook` logItems(배움·익힘) | 서버 | 장부 없는 날 DayBody만 |
| 서버 표현 장부 `learner/ledger`(숙지·들으면 앎) | 채팅·통화 | LedgerLinks·LedgerPanel(개편 My엔 없음, 채팅 "✓ 알아요" 링크는 보임) |

## C. 개편이 켜지면 안 보이는 옛 화면(스위치 꺼진 Play 앱에선 보임)

Stagebank(TodayPlan 단계 계획·LearnedToday "오늘 배운 것"·StageFrames·StageScripts "알아요" 배지·StageReview ✓ 익힘·↷ 알아요·○ 아직·StageCheck·ContentScope·WeakStrip), 옛 Quizbank 탭(어휘·문법·표현·복습 "지금 복습할 것 없음"·📝 단어 시험·⚙), 시험(CheckupPlayer "이번 주 확인"·PlacementPlayer "실력 확인"·단계 시험), ReviewNotes(알아요/모르겠어요), 노트(NotesPanel·PartDetailSheet "알아요"·LedgerPanel "숙지한 표현"), GrowthNetwork·SkillRecord 📈, 웹 LearningBookPanel("복습 n회"). 개편을 Play에 낼 때 지울 후보 — 지금 지우면 Play 앱 화면이 깨짐.

## D. 아무 코드도 안 부르는 옛 문구 38개(14개 언어)

studyTallyKnown · growLearned · growKnownAll · reviewLayerTitle · studyReviewLeft · packMastered · planLineScripts · planFreeScripts · planSubtitle · reportTodayLearning · reportReviewHint · quizReadyToast · whatsNewKeepBody · whatsNewMissedBody · needsHistoryKey · learnerNextBand · learnerWeak · mapItemsSummary · reviewStart · reviewEmpty · itemMasteredNow · itemSlipped · quizTodayTitle · quizMissionPrompt · quizRecentReviewTitle · quizTodayCardTitle · quizStartCta · quizTodayFinished · quizEmptyTitle · reviewGenerating · reviewGenerateFailed · reviewCompleteCta · reviewSectionFallback · quizCompleteTitle · quizReviewAgainTitle · quizBackHome · quizAlreadyDone · homeDestSavedDesc — 바로 지워도 됨(대본 플랜 줄 셋 포함). 옛 새로워진 점 본문(whatsNew*)은 지난 버전 기록이라 그대로.

## E. 문서

- `hub/QUIZ.md`: 0절 이후 곳곳에 "다시 볼 것·적용이 힘듦·New·알아요" 화면 이름(알고리즘 설명으로는 맞음, 화면 이름은 오늘부터 다름).
- `PRODUCT.md` My 절·`hub/STRUCTURE.md` 위쪽 그림: 개편 전 Stagebank 흐름이 본문, 개편은 머리 문단에만 — 개편을 Play에 낼 때 본문을 바꿈.
- `hub/drafts/languagebank-2026-11-03.md`: 체크 셋 이름(처음 봄·적용이 힘듦·앎)을 화면 이름으로 적음 — STATE에 "이 결정이 앞선다" 적어 둠.

## 정할 것(사용자)

1. A1·A2 설명 글을 개편 흐름으로 새로 쓸지(? 설명은 Logbank·Quizbank·Languagebank 셋, 사용법 My 장) — 서버 바로 반영, 그림은 다시 찍음.
2. A3 띠·육각형 %를 남길지(예외 결정 11-02), 빼고 배운 것 표·타임라인만 둘지.
3. A4~A6 "복습"·"알아요" 글자 — 누르는 말도 바꿀지(예: [헷갈려요 | 알아요] → [다시 | 됐어요]).
4. B 저장 — 개편에서 안 읽는 기록을 그만 쓸지(quizDays는 ⏱ 막대가 장부로 바뀐 뒤).
5. D 38개 지울지(바로 가능).
