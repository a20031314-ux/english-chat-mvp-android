# 퀴즈 전수 점검 — 2026-11-01

> `scripts/quiz-sweep/sweep.ts`(규칙 검사, 모델 없음) + 판정 표본(`JUDGE.md`) → `report.mjs`. 앱이 쓰는 코드(buildQuiz·bundleQuiz·nextStudy)로 문제를 만들어 검사 — 화면은 거치지 않음.
> 학습 언어 14 × 앱 언어 14 = 196 조합 · 단계 1~5 · 열쇠 4638개 · 문제 30796개(열쇠마다 씨앗 둘 × 모양 셋) · 문제를 못 만드는 열쇠 46개 · 하루 흐름 7일 × 하루 6묶음.
> 운영 데이터 포함(--net): 앱 언어별 뜻풀이 옮김·낱말 카드(앞 100개)·문제은행 묶음.
> 고치는 법: 이유마다 "고칠 자리" → `scripts/ux-check/FIX.md`와 같은 순서. 표시 전체: `tmp/quiz-sweep/2026-11-01/marks.jsonl`(채팅이 끝나면 사라짐).

## 원인별 요약

| 원인 | 문제 수 | 학습 언어 | 무엇을 고치면 되나 |
|---|---|---|---|
| 뜻 줄에 답 — 앱 언어 = 학습 언어 | 4517 | en ko ja zh es fr it pt ru ar id vi th hi | 답하기 전 뜻 줄이 학습 언어 그대로라 문장이 보임. 한 곳(뜻 줄 고르는 quizGloss)에서 앱 언어 = 학습 언어면 뜻 줄을 답한 뒤로. |
| 뜻 줄에 답 — 다른 앱 언어 | 8 | en | 그 앱 언어 뜻풀이 옮김이 학습 언어(영어) 그대로 저장됐거나 옮김이 없어 영어로 나옴 — 서버 옮긴 표(server/stageCopy.ts) 다시 옮기기·quizGloss가 영어 학습에 영어 뜻을 안 보이게. |
| 같은 날 같은 문장 | 637 | en ko ja zh es fr it pt ru ar id vi th hi | 다른 열쇠가 같은 대본 줄을 재료로 나눠 씀(같은 문장 여러 열쇠) — 묶음·하루 단위로 문장 겹침 빼기. |
| 며칠 안 다른 열쇠로 같은 문장 | 760 | en ko ja zh es fr it pt ru ar id vi th hi |  |
| 맞혀서 쉬는 열쇠가 다시 | 376 | en ko ja zh es fr it pt ru ar id vi th hi | 대화 속 틀린 줄(quiz.ts dialogOf)이 쉬는 중인 열쇠를 가리지 않고 고름. |
| 같은 열쇠 연달아 | 103 | en ko ja zh es fr it pt ru ar id th hi |  |
| 오답이 한눈에 지워짐 | 35 | ar en es hi id ja ko ru th vi zh | src/lib/curriculum/expressions/decoys/ar.ts "نعم" |
| 조각이 낱말 중간에서 잘림 | 19 | ja | src/lib/curriculum/quiz.ts tilesOf·orderTiles · src/lib/wordSegments.ts |
| 답이 여럿 | 18 | es id ja ko pt th vi | 문제은행 KV qbank:v1:es:e|hola 오답·예문(서버 server/qbank.ts — 도태 기다리거나 직접 지움) |
| 문장이 어색함 | 9 | en es ja | 문제은행 KV qbank:v1:en:e|nice to meet you 예문 |
| 수준보다 쉬움 | 3 | hi it | 그 열쇠의 단계(frames·stageScripts stage) · quiz.ts near() |
| 배운 적 없음 | 3 | ja | 그 열쇠의 단계(frames·stageScripts stage) · quiz.ts near() |

## 이유 × 학습 언어 (문제 수, 앱 언어만 다른 같은 표시는 하나로)

| 이유 | en | ko | ja | zh | es | fr | it | pt | ru | ar | id | vi | th | hi | 합 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 답이 화면에 보임 `easy-leak` | 726 | 276 | 173 | 303 | 387 | 410 | 391 | 309 | 317 | 229 | 295 | 284 | 116 | 309 | 4525 |
| 같은 문제 또 `easy-repeat` | 184 | 144 | 168 | 146 | 119 | 176 | 86 | 88 | 116 | 118 | 131 | 92 | 168 | 140 | 1876 |
| 오답이 한눈에 지워짐 `easy-decoy` | 5 | 2 | 3 | 4 | 1 | · | · | · | 3 | 6 | 1 | 1 | 3 | 6 | 35 |
| 조각이 낱말 중간에서 잘림 `split-word` | · | · | 19 | · | · | · | · | · | · | · | · | · | · | · | 19 |
| 답이 여럿 `hard-ambiguous` | · | 1 | 5 | · | 2 | · | · | 1 | · | · | 4 | 3 | 2 | · | 18 |
| 문장이 어색함 `unnatural` | 5 | · | 2 | · | 2 | · | · | · | · | · | · | · | · | · | 9 |
| 수준보다 쉬움 `easy-level` | · | · | · | · | · | · | 1 | · | · | · | · | · | · | 2 | 3 |
| 배운 적 없음 `hard-level` | · | · | 3 | · | · | · | · | · | · | · | · | · | · | · | 3 |

## 뜻 줄로 답이 새는 조합 (학습 언어 / 앱 언어 → 문제 수)

`en / en` 726 · `fr / fr` 410 · `it / it` 391 · `es / es` 387 · `ru / ru` 317 · `pt / pt` 309 · `hi / hi` 309 · `zh / zh` 303 · `id / id` 295 · `vi / vi` 284 · `ko / ko` 276 · `ar / ar` 229 · `ja / ja` 173 · `th / th` 116 · `en / vi` 4 · `en / es` 4

앱 언어가 학습 언어와 같으면 답하기 전에 보이는 뜻 줄(순서 맞추기·말하기·틀린 곳 고치기)이 문장 그 자체가 된다.

## 하루 흐름 (Quizbank 문법·표현 탭, 정답률 80% 학습자, 문제 100개당)

| 학습 언어 | 탭 | 문제 | 같은 날 같은 문장 | 3일 안 다른 열쇠로 같은 문장 | 맞혀서 쉬는 열쇠가 다시 | 같은 열쇠 연달아 | 같은 열쇠 떨어져서(설계) | 빈 묶음 |
|---|---|---|---|---|---|---|---|---|
| en | 문법 | 1052 | 2.6 | 5.9 | 2.4 | 0.4 | 15.2 | 11/210 |
| en | 표현 | 831 | 5.5 | 10.1 | 0 | 0 | 0 | 2/210 |
| ko | 문법 | 532 | 4.3 | 9.6 | 3.9 | 11.3 | 14.7 | 66/210 |
| ko | 표현 | 296 | 0 | 0 | 0 | 0 | 0 | 133/210 |
| ja | 문법 | 1066 | 3.7 | 7.3 | 3.3 | 0.3 | 14.6 | 8/210 |
| ja | 표현 | 718 | 2.2 | 4.9 | 0 | 0 | 0 | 29/210 |
| zh | 문법 | 907 | 2.6 | 7.1 | 2.8 | 0.4 | 14.3 | 34/210 |
| zh | 표현 | 399 | 5.3 | 10 | 0 | 0 | 0 | 107/210 |
| es | 문법 | 1004 | 2 | 4.6 | 3.5 | 0.2 | 15.6 | 21/210 |
| es | 표현 | 516 | 4.5 | 7.8 | 0 | 0 | 0 | 77/210 |
| fr | 문법 | 945 | 1.7 | 4.6 | 3.8 | 0.5 | 14 | 28/210 |
| fr | 표현 | 646 | 9.1 | 15 | 0 | 0 | 0 | 45/210 |
| it | 문법 | 964 | 1.9 | 4.1 | 3.5 | 0.6 | 14.9 | 25/210 |
| it | 표현 | 421 | 0 | 0 | 0 | 0 | 0 | 101/210 |
| pt | 문법 | 959 | 1 | 2.8 | 2.6 | 0.3 | 15.3 | 27/210 |
| pt | 표현 | 557 | 3.9 | 7.2 | 0 | 0 | 0 | 65/210 |
| ru | 문법 | 989 | 2.4 | 5.1 | 2.5 | 0.5 | 14.3 | 21/210 |
| ru | 표현 | 445 | 4.5 | 8.3 | 0 | 0 | 0 | 94/210 |
| ar | 문법 | 913 | 2.2 | 4.8 | 3.2 | 0.4 | 14.3 | 33/210 |
| ar | 표현 | 411 | 5.4 | 10.5 | 0 | 0 | 0 | 102/210 |
| id | 문법 | 978 | 3.3 | 7.5 | 2.7 | 0.6 | 14.9 | 23/210 |
| id | 표현 | 322 | 6.2 | 9.9 | 0 | 0 | 0 | 125/210 |
| vi | 문법 | 996 | 1.8 | 4.5 | 2.5 | 0 | 14.6 | 22/210 |
| vi | 표현 | 595 | 1.2 | 2.2 | 0 | 0 | 0 | 56/210 |
| th | 문법 | 995 | 3.2 | 6.4 | 3.1 | 0.2 | 14.6 | 21/210 |
| th | 표현 | 674 | 5.6 | 10.7 | 0 | 0 | 0 | 39/210 |
| hi | 문법 | 844 | 1.4 | 3.7 | 2 | 0.4 | 14.3 | 47/210 |
| hi | 표현 | 666 | 8.1 | 14.9 | 0 | 0 | 0 | 40/210 |

## 판정 표본 (판정 에이전트, 420문제)

| 학습 언어 | 본 문제 | 문제 없음 | 오답이 한눈에 | 답이 여럿 | 어색함 | 단계에 안 맞음 |
|---|---|---|---|---|---|---|
| ar | 30 | 24 | 6 | 0 | 0 | 0 |
| en | 30 | 21 | 5 | 0 | 5 | 0 |
| es | 30 | 26 | 1 | 2 | 2 | 0 |
| fr | 30 | 30 | 0 | 0 | 0 | 0 |
| hi | 30 | 20 | 7 | 0 | 0 | 3 |
| id | 30 | 24 | 1 | 5 | 0 | 0 |
| it | 30 | 28 | 0 | 0 | 0 | 2 |
| ja | 30 | 20 | 3 | 5 | 2 | 0 |
| ko | 30 | 27 | 2 | 1 | 0 | 0 |
| pt | 30 | 29 | 0 | 1 | 0 | 0 |
| ru | 30 | 27 | 3 | 0 | 0 | 0 |
| th | 30 | 24 | 4 | 2 | 0 | 0 |
| vi | 30 | 26 | 1 | 3 | 0 | 0 |
| zh | 30 | 26 | 4 | 0 | 0 | 0 |

## 이유마다 예와 고칠 자리

### 답이 화면에 보임 (`easy-leak`) — 4525

- en 1단계 · 앱 en,vi · `f|en-f1-01` order — My name is Min-ho. And you?
  - 왜: English 앱: 답하기 전 뜻 줄 "My name is Min-ho. And you?"에 문장이 그대로
  - 고칠 자리: src/components/studyMap/QuizPlayer.tsx(뜻 줄·예문) · stageScripts.ts quizGloss · FrameLesson 제목 · quiz.ts 재료(pieceTwice)
- ko 1단계 · 앱 ko · `f|ko-f1-02` order — 저는 일본 사람이에요.
  - 왜: Korean (한국어) 앱: 답하기 전 뜻 줄 "저는 일본 사람이에요."에 문장이 그대로
  - 고칠 자리: src/components/studyMap/QuizPlayer.tsx(뜻 줄·예문) · stageScripts.ts quizGloss · FrameLesson 제목 · quiz.ts 재료(pieceTwice)
- ja 1단계 · 앱 ja · `e|よろしくお願いします` order — はじめまして。マリアです。よろしくお願いします。
  - 왜: Japanese (日本語) 앱: 답하기 전 뜻 줄 "はじめまして。マリアです。よろしくお願いします。"에 문장이 그대로
  - 고칠 자리: src/components/studyMap/QuizPlayer.tsx(뜻 줄·예문) · stageScripts.ts quizGloss · FrameLesson 제목 · quiz.ts 재료(pieceTwice)
- zh 1단계 · 앱 zh · `e|不是` order — 不是，我是韩国人。你呢？
  - 왜: Simplified Chinese 앱: 답하기 전 뜻 줄 "不是，我是韩国人。你呢？"에 문장이 그대로
  - 고칠 자리: src/components/studyMap/QuizPlayer.tsx(뜻 줄·예문) · stageScripts.ts quizGloss · FrameLesson 제목 · quiz.ts 재료(pieceTwice)
- es 1단계 · 앱 es · `e|sí, claro` say — Sí, claro. Aquí está.
  - 왜: Spanish (Español) 앱: 답하기 전 뜻 줄 "Sí, claro. Aquí está."에 문장이 그대로
  - 고칠 자리: src/components/studyMap/QuizPlayer.tsx(뜻 줄·예문) · stageScripts.ts quizGloss · FrameLesson 제목 · quiz.ts 재료(pieceTwice)

### 같은 문제 또 (`easy-repeat`) — 1876

- en 1단계 · `g|1:6` type — Yes, please. Excuse me, where is the station? · 답 where is
  - 왜: grammar 탭 1일째 2번째 묶음: 같은 날 같은 문장이 또
  - 고칠 자리: src/lib/curriculum/circle.ts·nextStudy.ts(간격) · TodayPlan 첫 문제
- ko 1단계 · `f|ko-f1-02` dialog — 브라질 사람을이에요. 만나서 반가워요. · 답 사람이에요
  - 왜: grammar 탭 1일째 3번째 묶음: 같은 날 같은 문장이 또
  - 고칠 자리: src/lib/curriculum/circle.ts·nextStudy.ts(간격) · TodayPlan 첫 문제
- ja 1단계 · `f|ja-f1-11` type — これはわたしの傘です。 · 보기 わたしは / わたしが / わたしに / わたしを / わたしと
  - 왜: grammar 탭 1일째 4번째 묶음: 같은 날 같은 문장이 또
  - 고칠 자리: src/lib/curriculum/circle.ts·nextStudy.ts(간격) · TodayPlan 첫 문제
- zh 1단계 · `f|zh-f1-18` dialog — 对，是这我的。谢谢！ · 답 这是
  - 왜: grammar 탭 1일째: 맞혀서 쉬어야 할 열쇠가 다시
  - 고칠 자리: src/lib/curriculum/circle.ts·nextStudy.ts(간격) · TodayPlan 첫 문제
- es 1단계 · `f|es-f1-09` type — ¿Dónde está la estación de tren? · 보기 Dónde son / Dónde hay / Dónde estoy
  - 왜: grammar 탭 1일째 3번째 묶음: 같은 날 같은 문장이 또
  - 고칠 자리: src/lib/curriculum/circle.ts·nextStudy.ts(간격) · TodayPlan 첫 문제

### 오답이 한눈에 지워짐 (`easy-decoy`) — 35

- ar 1단계 · `e|نعم` choose — لحظة... نعم. ما اسم العائلة؟ · 보기 نعيم / ناعم / **نعم**
  - 왜: 한눈에 지워지는 오답: نعيم, ناعم — 'نعيم'(낙원·이름)·'ناعم'(부드러운)은 '예'와 뜻이 전혀 다른 낱말, 글자만 닮음
  - 고칠 자리: src/lib/curriculum/expressions/decoys/ar.ts "نعم"
- en 1단계 · `e|nice to meet you` choose — You are my new boss. Hi, nice to meet you. · 보기 nice meet to you / **nice to meet you** / nice for meet you
  - 왜: 한눈에 지워지는 오답: nice meet to you — 상대에게 'You are my new boss'라고 단정하는 건 어색함(보통 'You must be…'); 'meet to' 어순 뒤섞기는 아무도 안 쓰는 꼴
  - 고칠 자리: 문제은행 KV qbank:v1:en:e|nice to meet you 오답·예문(서버 server/qbank.ts — 도태 기다리거나 직접 지움)
- es 1단계 · `e|hola` choose — Hola, perro bonito. · 보기 Adiós / Hole / **Hola**
  - 왜: 한눈에 지워지는 오답: Hole — Adiós도 맞음(작별 인사로 자연스러움), 'Hole'은 아무도 안 쓰는 철자 장난
  - 고칠 자리: 문제은행 KV qbank:v1:es:e|hola 오답·예문(서버 server/qbank.ts — 도태 기다리거나 직접 지움)
- hi 1단계 · `e|नमस्ते` choose — नमस्ते! मैं प्रिया हूँ। आपका नाम क्या है? · 보기 **नमस्ते** / नमस्तो / नमस्ता
  - 왜: 한눈에 지워지는 오답: नमस्तो, नमस्ता — 끝모음만 바꾼 꼴은 아무도 안 쓰는 철자 장난
  - 고칠 자리: src/lib/curriculum/expressions/decoys/hi.ts "नमस्ते"
- id 3단계 · `e|pokoknya` choose — Jadi! Pokoknya seru banget, kamu harus ke sana. · 보기 Pokokan / Kepokokan / **Pokoknya**
  - 왜: 한눈에 지워지는 오답: Kepokokan — 'Kepokokan'은 아무도 안 쓰는 지어낸 꼴
  - 고칠 자리: src/lib/curriculum/expressions/decoys/id.ts "pokoknya"

### 조각이 낱말 중간에서 잘림 (`split-word`) — 19

- ja 2단계 · `f|ja-f2-01` order — 試着してもいいですか。
  - 왜: 한자가 이어진 자리에서 잘림: 試 | 着して (試 | 着して | も | いいです | か)
  - 고칠 자리: src/lib/curriculum/quiz.ts tilesOf·orderTiles · src/lib/wordSegments.ts
- ja 2단계 · `f|ja-f2-02` order — 来年は頑張ってください。応援しています。
  - 왜: 한자가 이어진 자리에서 잘림: 頑 | 張って (来年 | は | 頑 | 張って | くだ | さい | 応援し | ています)
  - 고칠 자리: src/lib/curriculum/quiz.ts tilesOf·orderTiles · src/lib/wordSegments.ts
- ja 2단계 · `e|頑張ってください` order — 来年は頑張ってください。応援しています。
  - 왜: 한자가 이어진 자리에서 잘림: 頑 | 張って (来年 | は | 頑 | 張って | くだ | さい | 応援し | ています)
  - 고칠 자리: src/lib/curriculum/quiz.ts tilesOf·orderTiles · src/lib/wordSegments.ts
- ja 2단계 · `f|ja-f2-11` order — 来年は頑張ってください。応援しています。
  - 왜: 한자가 이어진 자리에서 잘림: 頑 | 張って (来年 | は | 頑 | 張って | くだ | さい | 応援し | ています)
  - 고칠 자리: src/lib/curriculum/quiz.ts tilesOf·orderTiles · src/lib/wordSegments.ts
- ja 3단계 · `e|助かる` order — ありがとう。来週中に返事をもらえると助かるよ。
  - 왜: 한자가 이어진 자리에서 잘림: 来週 | 中 (ありがとう | 来週 | 中 | に | 返事 | を | もらえる | と | 助かる | よ)
  - 고칠 자리: src/lib/curriculum/quiz.ts tilesOf·orderTiles · src/lib/wordSegments.ts

### 답이 여럿 (`hard-ambiguous`) — 18

- es 1단계 · `e|hola` choose — Hola, perro bonito. · 보기 **Hola** / Olá / Adiós
  - 왜: 이것도 맞음: Adiós — 개에게 '잘 가, 예쁜 개야'(Adiós)도 자연스럽게 맞음 — 뜻 줄을 봐야만 Hola로 정해짐
  - 고칠 자리: 문제은행 KV qbank:v1:es:e|hola 오답·예문(서버 server/qbank.ts — 도태 기다리거나 직접 지움)
- id 2단계 · `e|lagi apa` choose — Wah, kasihan. Sekarang lagi apa? · 보기 **lagi apa** / apa lagi / lagi siapa
  - 왜: 이것도 맞음: apa lagi — 'Sekarang apa lagi?'(이제 또 뭐?)도 문장으로 자연스러워 뜻 줄 없이는 답이 하나로 안 정해짐
  - 고칠 자리: src/lib/curriculum/expressions/decoys/id.ts "lagi apa"
- ja 2단계 · `e|いいですね` choose — 今日は天気がいいですね。 · 보기 よくないですね / **いいですね** / いいますね
  - 왜: 이것도 맞음: よくないですね — '今日は天気がよくないですね'도 완전히 맞는 문장 — 뜻 줄 없이 하나로 안 정해짐
  - 고칠 자리: 문제은행 KV qbank:v1:ja:e|いいですね 오답·예문(서버 server/qbank.ts — 도태 기다리거나 직접 지움)
- ko 4단계 · `e|그 부분은요` choose — 네, 그 부분은요, 저도 말씀드렸거든요. 그런데 이번에 다른 업체 견적도 받았다고 하시더라고요. · 보기 그 부분이는요 / **그 부분은요** / 그 부분을요
  - 왜: 이것도 맞음: 그 부분을요 — '그 부분을 저도 말씀드렸다'로 목적어가 되므로 '그 부분을요'도 구어에서 자연스럽게 맞음
  - 고칠 자리: src/lib/curriculum/expressions/decoys/ko.ts "그 부분은요"
- pt 2단계 · `e|beleza` choose — E aí, beleza? Como foi o fim de semana? · 보기 **beleza** / bonito / lindo
  - 왜: 이것도 맞음: lindo — 'E aí, lindo?'는 상대를 부르는 말(잘생긴 친구야)로 브라질에서 실제로 씀 — 문법·뜻 모두 성립
  - 고칠 자리: src/lib/curriculum/expressions/decoys/pt.ts "beleza"

### 문장이 어색함 (`unnatural`) — 9

- en 1단계 · `e|nice to meet you` choose — You are my new boss. Hi, nice to meet you. · 보기 nice meet to you / **nice to meet you** / nice for meet you
  - 왜: 어색한 문장 → You must be my new boss. Hi, nice to meet you. — 상대에게 'You are my new boss'라고 단정하는 건 어색함(보통 'You must be…'); 'meet to' 어순 뒤섞기는 아무도 안 쓰는 꼴
  - 고칠 자리: 문제은행 KV qbank:v1:en:e|nice to meet you 예문
- es 2단계 · `e|qué buena idea` choose — Tengo mucha hambre. Qué buena idea, comemos pizza. · 보기 **Qué buena idea** / Qué bueno idea / Qué buen idea
  - 왜: 어색한 문장 → —Tengo mucha hambre. ¿Comemos pizza? —¡Qué buena idea! — 같은 사람이 '배고파'라고 한 뒤 '좋은 생각이야'라고 해서 말이 안 이어짐 — 제안·대답 두 사람으로 나눠야 함
  - 고칠 자리: 문제은행 KV qbank:v1:es:e|qué buena idea 예문
- ja 1단계 · `e|はじめまして` choose — 友だちのママ、はじめまして。 · 보기 はじめましょう / **はじめまして** / はじまりまして
  - 왜: 어색한 문장 → （友だちのお母さんに）はじめまして。〇〇です。 — 상대를 직접 '友だちのママ'라고 부르는 일은 없음 — 호칭으로 부자연스러움
  - 고칠 자리: 문제은행 KV qbank:v1:ja:e|はじめまして 예문
- en 2단계 · `e|how was your weekend` choose — I am at the coffee shop. How was your weekend? · 보기 **How was your weekend** / How was you weekend / How did your weekend
  - 왜: 어색한 문장 → Hi, Sam! ___? — '커피숍에 있다'는 말 뒤에 바로 주말 안부를 묻는 흐름이 끊김, meaning 줄도 'How'에서 잘려 있음
  - 고칠 자리: 문제은행 KV qbank:v1:en:e|how was your weekend 예문
- en 2단계 · `e|how was your weekend` choose — I am at the coffee shop. How was your weekend? · 보기 How did your weekend / **How was your weekend** / How were your weekend
  - 왜: 어색한 문장 → Hi, Sam! ___? — en-2와 같은 문장 — 앞 문장과 질문이 이어지지 않고 meaning 줄이 잘림
  - 고칠 자리: 문제은행 KV qbank:v1:en:e|how was your weekend 예문

### 수준보다 쉬움 (`easy-level`) — 3

- hi 5단계 · `e|अरे यार` choose — अरे यार, मुझे लगता है कि कहानी बहुत लंबी थी। · 보기 **अरे यार** / अरे यर / अरी यार
  - 왜: 5단계에 너무 쉬움 — 'अरे यार'(아이고 참)는 입문 수준 감탄사라 5단계에 너무 쉬움
  - 고칠 자리: 그 열쇠의 단계(frames·stageScripts stage) · quiz.ts near()
- it 4단계 · `e|hai ragione` choose — È vero, hai ragione. · 보기 sei ragione / hai ragioni / **hai ragione**
  - 왜: 4단계에 너무 쉬움 — 'È vero, hai ragione'는 기초 인사 수준의 짧은 문장 — 4단계에는 너무 쉬움
  - 고칠 자리: 그 열쇠의 단계(frames·stageScripts stage) · quiz.ts near()
- hi 5단계 · `e|अरे यार` choose — अरे यार, मुँह में पानी आ गया! चल, पहले जलेबी-वलेबी खाते हैं। · 보기 **अरे यार** / अरे यर / अरा यार
  - 왜: 5단계에 너무 쉬움 — 'अरे यार'는 입문 수준 감탄사라 5단계에 너무 쉬움
  - 고칠 자리: 그 열쇠의 단계(frames·stageScripts stage) · quiz.ts near()

### 배운 적 없음 (`hard-level`) — 3

- ja 3단계 · `e|助かる` choose — え、いいの？助かる。 · 보기 助ける / **助かる** / 助かれる
  - 왜: 3단계 학습자에게 5단계 문장
  - 고칠 자리: 그 열쇠의 단계(frames·stageScripts stage) · quiz.ts near()
- ja 3단계 · `e|助かる` order — ありがとう。来週中に返事をもらえると助かるよ。
  - 왜: 3단계 학습자에게 5단계 문장
  - 고칠 자리: 그 열쇠의 단계(frames·stageScripts stage) · quiz.ts near()
- ja 3단계 · `e|助かる` choose — え、いいの？それだけでもめちゃくちゃ助かる。 · 보기 助かれる / 助ける / **助かる**
  - 왜: 3단계 학습자에게 5단계 문장
  - 고칠 자리: 그 열쇠의 단계(frames·stageScripts stage) · quiz.ts near()

## 이 점검이 못 보는 것

- 화면: 버튼 이름·제목·카드에 답이 보이는지, 눌렀는데 안 뜨는지 — 화면 점검(`scripts/ux-check/`) 몫.
- 체감: 할 일이 명확한지·계속할 이유 — 화면 점검의 인물 몫.
- 오답이 그럴듯한지·문장이 자연스러운지는 코드로 못 가려서 판정 표본(학습 언어마다 일부)만 본다(`JUDGE.md`).
- 어휘 탭의 넓어지는 원(circle.ts)은 `scripts/quiz-circle-sim.ts`가 따로 본다. 중국어 낱말 조각 잘림은 이 규칙으로 못 가린다(한 글자 낱말이 흔해서).
