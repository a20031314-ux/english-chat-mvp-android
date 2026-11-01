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
| 오답이 한눈에 지워짐 | 45 | en es fr hi id it ja ko pt ru th vi | src/lib/curriculum/expressions/decoys/en.ts "no way" |
| 조각이 낱말 중간에서 잘림 | 19 | ja | src/lib/curriculum/quiz.ts tilesOf·orderTiles · src/lib/wordSegments.ts |
| 답이 여럿 | 18 | en es hi id ja ko th vi | 문제은행 KV qbank:v1:en:f|en-f2-02 오답·예문(서버 server/qbank.ts — 도태 기다리거나 직접 지움) |
| 문장이 어색함 | 12 | ar en es ja ko vi | 그 문장의 데이터 파일(frames·stageScripts·대본 은행) |
| 배운 적 없음 | 3 | ja | 그 열쇠의 단계(frames·stageScripts stage) · quiz.ts near() |

## 이유 × 학습 언어 (문제 수, 앱 언어만 다른 같은 표시는 하나로)

| 이유 | en | ko | ja | zh | es | fr | it | pt | ru | ar | id | vi | th | hi | 합 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 답이 화면에 보임 `easy-leak` | 726 | 276 | 173 | 303 | 387 | 410 | 391 | 309 | 317 | 229 | 295 | 284 | 116 | 309 | 4525 |
| 같은 문제 또 `easy-repeat` | 184 | 144 | 168 | 146 | 119 | 176 | 86 | 88 | 116 | 118 | 131 | 92 | 168 | 140 | 1876 |
| 오답이 한눈에 지워짐 `easy-decoy` | 1 | 13 | 2 | · | 3 | 4 | 3 | 1 | 3 | · | 5 | 2 | 1 | 7 | 45 |
| 조각이 낱말 중간에서 잘림 `split-word` | · | · | 19 | · | · | · | · | · | · | · | · | · | · | · | 19 |
| 답이 여럿 `hard-ambiguous` | 1 | 6 | 1 | · | 3 | · | · | · | · | · | 2 | 1 | 3 | 1 | 18 |
| 문장이 어색함 `unnatural` | 3 | 1 | 4 | · | 1 | · | · | · | · | 2 | · | 1 | · | · | 12 |
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
| ar | 30 | 28 | 0 | 0 | 2 | 0 |
| en | 30 | 25 | 1 | 1 | 3 | 0 |
| es | 30 | 23 | 3 | 3 | 1 | 0 |
| fr | 30 | 26 | 4 | 0 | 0 | 0 |
| hi | 30 | 22 | 7 | 1 | 0 | 0 |
| id | 30 | 24 | 5 | 2 | 0 | 0 |
| it | 30 | 27 | 3 | 0 | 0 | 0 |
| ja | 30 | 23 | 2 | 1 | 4 | 0 |
| ko | 30 | 15 | 13 | 6 | 1 | 0 |
| pt | 30 | 29 | 1 | 0 | 0 | 0 |
| ru | 30 | 27 | 3 | 0 | 0 | 0 |
| th | 30 | 26 | 1 | 3 | 0 | 0 |
| vi | 30 | 26 | 2 | 1 | 1 | 0 |
| zh | 30 | 30 | 0 | 0 | 0 | 0 |

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

### 오답이 한눈에 지워짐 (`easy-decoy`) — 45

- en 4단계 · `e|no way` choose — No way! A clown costume? · 보기 None way / No road / **No way**
  - 왜: 한눈에 지워지는 오답: None way, No road — 'None way'·'No road'는 아무도 안 쓰는 꼴이라 정답만 말처럼 보임
  - 고칠 자리: src/lib/curriculum/expressions/decoys/en.ts "no way"
- es 5단계 · `e|o sea` choose — Sí, pero entre los que me han escrito no hay ni uno que pueda pagar a tiempo. O sea, un de · 보기 **O sea** / O fuera / U sea
  - 왜: 한눈에 지워지는 오답: O fuera, U sea — 'O fuera'는 없는 표현, 'U sea'는 아무도 안 쓰는 철자 장난이라 5단계 학습자가 바로 지움
  - 고칠 자리: src/lib/curriculum/expressions/decoys/es.ts "o sea"
- fr 3단계 · `f|fr-f3-04` choose — Je cuisinais quand le téléphone a sonné. · 보기 quoi / **quand** / pendant
  - 왜: 한눈에 지워지는 오답: quoi — 'quoi'(무엇)는 접속사 자리에 넣으면 누가 봐도 말이 안 됨 — 'pendant'만 그럴듯한 오답
  - 고칠 자리: src/lib/curriculum/frames/decoys/fr.ts "fr-f3-04|quand"
- hi 1단계 · `e|नमस्ते` choose — नमस्ते! मैं प्रिया हूँ। आपका नाम क्या है? · 보기 **नमस्ते** / नमस्तो / नमस्ता
  - 왜: 한눈에 지워지는 오답: नमस्तो, नमस्ता — 'नमस्तो·नमस्ता'는 실제로 안 쓰는 철자 장난(Holo류)이라 바로 지워짐
  - 고칠 자리: src/lib/curriculum/expressions/decoys/hi.ts "नमस्ते"
- id 4단계 · `g|4:0` choose — Betul. Waktu saya baru masuk, saya sungkan banget bertanya. Tapi Bu Ratna selalu bilang, t · 보기 Satu-satu / **Waktu** / Meskipun
  - 왜: 한눈에 지워지는 오답: Satu-satu — 'Satu-satu'(하나씩)는 절을 이끌 수 없어 '___ saya baru masuk' 자리에 넣으면 바로 말이 안 됨
  - 고칠 자리: src/lib/curriculum/quiz.ts decoys()

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

- en 2단계 · `f|en-f2-02` choose — How was your lunch? · 보기 How did your / How was her / **How was your**
  - 왜: 이것도 맞음: How was her — 'How was her lunch?'도 문법·뜻 모두 맞는 문장이라 답이 둘
  - 고칠 자리: 문제은행 KV qbank:v1:en:f|en-f2-02 오답·예문(서버 server/qbank.ts — 도태 기다리거나 직접 지움)
- es 1단계 · `e|hola` choose — Hola, perro bonito. · 보기 **Hola** / Olá / Adiós
  - 왜: 이것도 맞음: Adiós — 'Adiós, perro bonito.'도 자연스러운 문장이라 뜻 줄 없이는 답이 하나로 안 정해짐
  - 고칠 자리: 문제은행 KV qbank:v1:es:e|hola 오답·예문(서버 server/qbank.ts — 도태 기다리거나 직접 지움)
- hi 4단계 · `g|4:1` choose — मेरा सुझाव है कि हम यह काम अगले हफ़्ते तक पूरा करें। · 보기 मेरा निवेदन है कि / **मेरा सुझाव है कि** / मुझे लगता है कि
  - 왜: 이것도 맞음: मेरा निवेदन है कि — 'मेरा निवेदन है कि हम … पूरा करें(제 요청은 …)'도 문법·뜻 모두 자연스러워 답이 둘
  - 고칠 자리: src/lib/curriculum/quiz.ts decoys()
- id 2단계 · `e|besok` choose — Belum, nanti aja. Eh, besok kamu ada acara? · 보기 kemarin / **besok** / tadi
  - 왜: 이것도 맞음: kemarin, tadi — 'Eh, kemarin/tadi kamu ada acara?'(어제/아까 일 있었어?)도 자연스러운 질문이라 뜻 줄을 봐야만 'besok'로 정해짐
  - 고칠 자리: src/lib/curriculum/expressions/decoys/id.ts "besok"
- ja 2단계 · `e|いいですね` choose — 今日は天気がいいですね。 · 보기 よくないですね / **いいですね** / いいますね
  - 왜: 이것도 맞음: よくないですね — '今日は天気がよくないですね'도 맞는 문장이라 뜻 줄 없이는 답이 둘
  - 고칠 자리: 문제은행 KV qbank:v1:ja:e|いいですね 오답·예문(서버 server/qbank.ts — 도태 기다리거나 직접 지움)

### 문장이 어색함 (`unnatural`) — 12

- ar 2단계 · `e|إن شاء الله` choose — إن شاء الله. نشوفك بكرة، لن أتأخر! · 보기 **إن شاء الله** / إن شاءت الله / إن شاء لله
  - 왜: 어색한 문장 → إن شاء الله. أشوفك بكرة، ما راح أتأخر! — 구어 'نشوفك بكرة'와 문어 'لن أتأخر'가 한 줄에 섞여 어색함 — 한쪽 말투로 맞춰야 함
  - 고칠 자리: 그 문장의 데이터 파일(frames·stageScripts·대본 은행)
- en 1단계 · `e|nice to meet you` choose — You are my new boss. Hi, nice to meet you. · 보기 nice meet to you / **nice to meet you** / nice for meet you
  - 왜: 어색한 문장 → You must be my new boss. Hi, nice to meet you. — 상대에게 'You are my new boss'라고 단정하는 건 어색함 — 'You must be…'가 자연스러움
  - 고칠 자리: 문제은행 KV qbank:v1:en:e|nice to meet you 예문
- es 3단계 · `e|lo que pasa es que` choose — No puedo cenar contigo porque lo que pasa es que estoy cansado. · 보기 el que pasa es que / **lo que pasa es que** / lo qué pasa es que
  - 왜: 어색한 문장 → No puedo cenar contigo; lo que pasa es que estoy cansado. — 'porque lo que pasa es que'는 이유 표현이 겹쳐 어색함 — porque를 빼야 자연스러움
  - 고칠 자리: 문제은행 KV qbank:v1:es:e|lo que pasa es que 예문
- ja 1단계 · `e|はじめまして` choose — 友だちのママ、はじめまして。 · 보기 はじめましょう / **はじめまして** / はじまりまして
  - 왜: 어색한 문장 → ゆうたくんのお母さん、はじめまして。 — 相手を直接「友だちのママ」と呼ぶのは不自然 — 「〇〇くんのお母さん」이 자연스러움
  - 고칠 자리: 문제은행 KV qbank:v1:ja:e|はじめまして 예문
- ko 4단계 · `f|ko-f4-01` choose — 김 과장님께서 견적서를 다시 보내 달래요. · 보기 **달래요** / 달대요 / 다래요
  - 왜: 어색한 문장 → 김 과장님께서 견적서를 다시 보내 달라고 하셨어요. — '께서'로 높인 주어에 '달래요'(낮춤 전달)가 붙어 높임이 어긋남
  - 고칠 자리: 그 문장의 데이터 파일(frames·stageScripts·대본 은행)

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
