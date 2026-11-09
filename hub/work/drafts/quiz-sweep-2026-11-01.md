# 퀴즈 전수 점검 — 2026-11-01

> `scripts/quiz-sweep/sweep.ts`(규칙 검사, 모델 없음) + 판정 표본(`JUDGE.md`) → `report.mjs`. 앱이 쓰는 코드(buildQuiz·bundleQuiz·nextStudy)로 문제를 만들어 검사 — 화면은 거치지 않음.
> 학습 언어 14 × 앱 언어 14 = 196 조합 · 단계 1~5 · 열쇠 4638개 · 문제 30594개(열쇠마다 씨앗 둘 × 모양 셋) · 문제를 못 만드는 열쇠 50개 · 하루 흐름 7일 × 하루 6묶음.
> 운영 데이터 포함(--net): 앱 언어별 뜻풀이 옮김·낱말 카드(앞 100개)·문제은행 묶음.
> 고치는 법: 이유마다 "고칠 자리" → `scripts/ux-check/FIX.md`와 같은 순서. 표시 전체: `tmp/quiz-sweep/2026-11-01/marks.jsonl`(채팅이 끝나면 사라짐).

## 원인별 요약

| 원인 | 문제 수 | 학습 언어 | 무엇을 고치면 되나 |
|---|---|---|---|
| 같은 날 같은 문장 | 258 | en ko ja zh es fr it pt ru ar id vi th hi | 다른 열쇠가 같은 대본 줄을 재료로 나눠 씀(같은 문장 여러 열쇠) — 묶음·하루 단위로 문장 겹침 빼기. |
| 며칠 안 다른 열쇠로 같은 문장 | 366 | en ko ja zh es fr it pt ru ar id vi th hi |  |
| 맞혀서 쉬는 열쇠가 다시 | 366 | en ko ja zh es fr it pt ru ar id vi th hi | 대화 속 틀린 줄(quiz.ts dialogOf)이 쉬는 중인 열쇠를 가리지 않고 고름. |
| 같은 열쇠 연달아 | 104 | en ko ja zh es fr it pt ru ar id vi th hi |  |
| 뜻 줄이 비어 무엇을 말할지 모름 | 52 | en | src/lib/curriculum/stageScripts.ts quizGloss · 뜻풀이 옮기기 server/stageCopy.ts |
| 조각이 낱말 중간에서 잘림 | 17 | ja | src/lib/curriculum/quiz.ts tilesOf·orderTiles · src/lib/wordSegments.ts |
| 답이 여럿 | 14 | ar en es ja ko pt vi zh | src/lib/curriculum/quiz.ts decoys() |
| 문장이 어색함 | 12 | ar en es fr hi ja ko | 그 문장의 데이터 파일(frames·stageScripts·대본 은행) |
| 배운 적 없음 | 6 | ja | 그 열쇠의 단계(frames·stageScripts stage) · quiz.ts near() |
| 오답이 한눈에 지워짐 | 4 | en ja | src/lib/curriculum/frames/decoys/en.ts "en-f3-03|when" |
| 수준보다 쉬움 | 2 | ar | 그 열쇠의 단계(frames·stageScripts stage) · quiz.ts near() |

## 이유 × 학습 언어 (문제 수, 앱 언어만 다른 같은 표시는 하나로)

| 이유 | en | ko | ja | zh | es | fr | it | pt | ru | ar | id | vi | th | hi | 합 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 같은 문제 또 `easy-repeat` | 95 | 129 | 114 | 74 | 58 | 81 | 79 | 50 | 68 | 87 | 70 | 57 | 77 | 55 | 1094 |
| 뜻 줄이 비어 무엇을 말할지 모름 `no-meaning` | 52 | · | · | · | · | · | · | · | · | · | · | · | · | · | 52 |
| 조각이 낱말 중간에서 잘림 `split-word` | · | · | 17 | · | · | · | · | · | · | · | · | · | · | · | 17 |
| 답이 여럿 `hard-ambiguous` | 1 | 2 | 3 | 1 | 4 | · | · | 1 | · | 1 | · | 1 | · | · | 14 |
| 문장이 어색함 `unnatural` | 3 | 1 | 3 | · | 2 | 1 | · | · | · | 1 | · | · | · | 1 | 12 |
| 배운 적 없음 `hard-level` | · | · | 6 | · | · | · | · | · | · | · | · | · | · | · | 6 |
| 오답이 한눈에 지워짐 `easy-decoy` | 2 | · | 2 | · | · | · | · | · | · | · | · | · | · | · | 4 |
| 수준보다 쉬움 `easy-level` | · | · | · | · | · | · | · | · | · | 2 | · | · | · | · | 2 |

## 하루 흐름 (Quizbank 문법·표현 탭, 정답률 80% 학습자, 문제 100개당)

| 학습 언어 | 탭 | 문제 | 같은 날 같은 문장 | 3일 안 다른 열쇠로 같은 문장 | 맞혀서 쉬는 열쇠가 다시 | 같은 열쇠 연달아 | 같은 열쇠 떨어져서(설계) | 빈 묶음 |
|---|---|---|---|---|---|---|---|---|
| en | 문법 | 1052 | 2.5 | 5.4 | 2.4 | 0.4 | 15.2 | 11/210 |
| en | 표현 | 831 | 0 | 0 | 0 | 0 | 0 | 2/210 |
| ko | 문법 | 538 | 3.9 | 9.1 | 3.9 | 9.3 | 16 | 68/210 |
| ko | 표현 | 296 | 0 | 0 | 0 | 0 | 0 | 133/210 |
| ja | 문법 | 1062 | 3 | 5.4 | 3.4 | 0.3 | 14.5 | 9/210 |
| ja | 표현 | 718 | 0 | 0.4 | 0 | 0 | 0 | 29/210 |
| zh | 문법 | 904 | 2.8 | 5.1 | 2.4 | 0.9 | 13.6 | 34/210 |
| zh | 표현 | 399 | 0 | 0 | 0 | 0 | 0 | 107/210 |
| es | 문법 | 1004 | 1 | 1.5 | 3.5 | 0.2 | 15.6 | 21/210 |
| es | 표현 | 506 | 0 | 0 | 0 | 0 | 0 | 79/210 |
| fr | 문법 | 945 | 1 | 3 | 3.8 | 0.5 | 14 | 28/210 |
| fr | 표현 | 646 | 1.4 | 2.3 | 0 | 0 | 0 | 45/210 |
| it | 문법 | 965 | 1.6 | 3.4 | 3.5 | 0.6 | 15 | 25/210 |
| it | 표현 | 421 | 0 | 0 | 0 | 0 | 0 | 101/210 |
| pt | 문법 | 960 | 0.8 | 1.7 | 2.6 | 0.4 | 15.2 | 27/210 |
| pt | 표현 | 557 | 0 | 0 | 0 | 0 | 0 | 65/210 |
| ru | 문법 | 984 | 1.7 | 3.6 | 2.5 | 0.3 | 14.5 | 22/210 |
| ru | 표현 | 445 | 0 | 0 | 0 | 0 | 0 | 94/210 |
| ar | 문법 | 912 | 2.9 | 4.4 | 3.3 | 0.8 | 14 | 36/210 |
| ar | 표현 | 411 | 0 | 0 | 0 | 0 | 0 | 102/210 |
| id | 문법 | 976 | 1.9 | 3.7 | 2.6 | 0.5 | 15.2 | 23/210 |
| id | 표현 | 322 | 0 | 0 | 0 | 0 | 0 | 125/210 |
| vi | 문법 | 996 | 0.8 | 2.4 | 2.6 | 0.5 | 14.5 | 20/210 |
| vi | 표현 | 595 | 0 | 0 | 0 | 0 | 0 | 56/210 |
| th | 문법 | 996 | 1.7 | 3.4 | 2.6 | 0.3 | 15.3 | 20/210 |
| th | 표현 | 667 | 0.6 | 1 | 0 | 0 | 0 | 40/210 |
| hi | 문법 | 844 | 1.4 | 3.6 | 2 | 0.4 | 14.3 | 47/210 |
| hi | 표현 | 666 | 0.2 | 1.1 | 0 | 0 | 0 | 40/210 |

## 판정 표본 (판정 에이전트, 420문제)

| 학습 언어 | 본 문제 | 문제 없음 | 오답이 한눈에 | 답이 여럿 | 어색함 | 단계에 안 맞음 |
|---|---|---|---|---|---|---|
| ar | 30 | 26 | 0 | 1 | 1 | 2 |
| en | 30 | 24 | 2 | 1 | 3 | 0 |
| es | 30 | 24 | 0 | 4 | 2 | 0 |
| fr | 30 | 29 | 0 | 0 | 1 | 0 |
| hi | 30 | 29 | 0 | 0 | 1 | 0 |
| id | 30 | 30 | 0 | 0 | 0 | 0 |
| it | 30 | 30 | 0 | 0 | 0 | 0 |
| ja | 30 | 23 | 2 | 3 | 3 | 0 |
| ko | 30 | 27 | 0 | 2 | 1 | 0 |
| pt | 30 | 29 | 0 | 1 | 0 | 0 |
| ru | 30 | 30 | 0 | 0 | 0 | 0 |
| th | 30 | 30 | 0 | 0 | 0 | 0 |
| vi | 30 | 29 | 0 | 1 | 0 | 0 |
| zh | 30 | 29 | 0 | 1 | 0 | 0 |

## 이유마다 예와 고칠 자리

### 같은 문제 또 (`easy-repeat`) — 1094

- en 1단계 · `g|1:6` type — Yes, please. Excuse me, where is the station? · 답 where is
  - 왜: grammar 탭 1일째 2번째 묶음: 같은 날 같은 문장이 또
  - 고칠 자리: src/lib/curriculum/circle.ts·nextStudy.ts(간격) · TodayPlan 첫 문제
- ko 1단계 · `f|ko-f1-02` dialog — 브라질 사람을이에요. 만나서 반가워요. · 답 사람이에요
  - 왜: grammar 탭 1일째 3번째 묶음: 같은 날 같은 문장이 또
  - 고칠 자리: src/lib/curriculum/circle.ts·nextStudy.ts(간격) · TodayPlan 첫 문제
- ja 1단계 · `f|ja-f1-07` type — 明日、学校に行きます。 · 보기 を行きます / に行くます / で行きます
  - 왜: grammar 탭 1일째 3번째 묶음: 같은 날 같은 문장이 또
  - 고칠 자리: src/lib/curriculum/circle.ts·nextStudy.ts(간격) · TodayPlan 첫 문제
- zh 1단계 · `f|zh-f1-12` type — 我要一杯水。 · 보기 要我 / 我是
  - 왜: grammar 탭 1일째 6번째 묶음: 같은 날 같은 문장이 또
  - 고칠 자리: src/lib/curriculum/circle.ts·nextStudy.ts(간격) · TodayPlan 첫 문제
- es 1단계 · `f|es-f1-09` type — ¿Dónde está la estación de tren? · 보기 Dónde son / Dónde hay / Dónde estoy
  - 왜: grammar 탭 1일째 3번째 묶음: 같은 날 같은 문장이 또
  - 고칠 자리: src/lib/curriculum/circle.ts·nextStudy.ts(간격) · TodayPlan 첫 문제

### 뜻 줄이 비어 무엇을 말할지 모름 (`no-meaning`) — 52

- en 1단계 · 앱 ja,zh,es,fr,it,pt,ru,ar,id,vi,th,hi · `e|me too` say — Oh, you like cats? Me too!
  - 왜: Japanese (日本語) 앱: 뜻 줄이 비어 있음
  - 고칠 자리: src/lib/curriculum/stageScripts.ts quizGloss · 뜻풀이 옮기기 server/stageCopy.ts
- en 1단계 · 앱 vi · `f|en-f1-01` order — My name is Min-ho. And you?
  - 왜: Vietnamese (Tiếng Việt) 앱: 뜻 줄이 비어 있음
  - 고칠 자리: src/lib/curriculum/stageScripts.ts quizGloss · 뜻풀이 옮기기 server/stageCopy.ts
- en 1단계 · 앱 ja,zh,es,fr,it,pt,ru,ar,id,vi,th,hi · `f|en-f1-02` order — I'm from Brazil, but I live in Seoul now.
  - 왜: Japanese (日本語) 앱: 뜻 줄이 비어 있음
  - 고칠 자리: src/lib/curriculum/stageScripts.ts quizGloss · 뜻풀이 옮기기 server/stageCopy.ts
- en 1단계 · 앱 vi · `g|1:0` order — I'm from Mexico, and my husband is from Spain.
  - 왜: Vietnamese (Tiếng Việt) 앱: 뜻 줄이 비어 있음
  - 고칠 자리: src/lib/curriculum/stageScripts.ts quizGloss · 뜻풀이 옮기기 server/stageCopy.ts
- en 1단계 · 앱 ja,zh,es,fr,it,pt,ru,ar,id,vi,th,hi · `e|excuse me` say — Excuse me, is this seat free?
  - 왜: Japanese (日本語) 앱: 뜻 줄이 비어 있음
  - 고칠 자리: src/lib/curriculum/stageScripts.ts quizGloss · 뜻풀이 옮기기 server/stageCopy.ts

### 조각이 낱말 중간에서 잘림 (`split-word`) — 17

- ja 2단계 · `f|ja-f2-01` order — 試着してもいいですか。
  - 왜: 한자가 이어진 자리에서 잘림: 試 | 着して (試 | 着して | も | いいです | か)
  - 고칠 자리: src/lib/curriculum/quiz.ts tilesOf·orderTiles · src/lib/wordSegments.ts
- ja 2단계 · `e|頑張ってください` order — 来年は頑張ってください。応援しています。
  - 왜: 한자가 이어진 자리에서 잘림: 頑 | 張って (来年 | は | 頑 | 張って | くだ | さい | 応援し | ています)
  - 고칠 자리: src/lib/curriculum/quiz.ts tilesOf·orderTiles · src/lib/wordSegments.ts
- ja 3단계 · `e|どうしよう` order — 十一時四十五分！どうしよう、走らないと。
  - 왜: 한자가 이어진 자리에서 잘림: 十一 | 時 (十一 | 時 | 四十 | 五分 | どう | しよう | 走らない | と)
  - 고칠 자리: src/lib/curriculum/quiz.ts tilesOf·orderTiles · src/lib/wordSegments.ts
- ja 3단계 · `f|ja-f3-06` order — 道を間違えたかもしれません。
  - 왜: 한자가 이어진 자리에서 잘림: 間 | 違えた (道 | を | 間 | 違えた | かもしれま | せん)
  - 고칠 자리: src/lib/curriculum/quiz.ts tilesOf·orderTiles · src/lib/wordSegments.ts
- ja 3단계 · `f|ja-f3-18` order — 時間があったら、一緒に映画見ようよ。
  - 왜: 한자가 이어진 자리에서 잘림: 映画 | 見 (時間 | が | あったら | 一緒 | に | 映画 | 見 | よう | よ)
  - 고칠 자리: src/lib/curriculum/quiz.ts tilesOf·orderTiles · src/lib/wordSegments.ts

### 답이 여럿 (`hard-ambiguous`) — 14

- ar 2단계 · `g|2:3` choose — لا أحب القهوة بالسكر. · 보기 لا يحب / لا حب / **لا أحب**
  - 왜: 이것도 맞음: لا يحب — 'لا يحب القهوة بالسكر'(그는 설탕 커피를 안 좋아함)도 문법·뜻 모두 자연스러워 뜻 줄을 봐야만 '나'로 정해짐
  - 고칠 자리: src/lib/curriculum/quiz.ts decoys()
- en 2단계 · `f|en-f2-02` choose — How was your lunch? · 보기 How did your / How was her / **How was your**
  - 왜: 이것도 맞음: How was her — 'How was her lunch?'도 문법·뜻 모두 맞음 — 풀 때 뜻이 안 보여 답이 둘
  - 고칠 자리: 문제은행 KV qbank:v1:en:f|en-f2-02 오답·예문(서버 server/qbank.ts — 도태 기다리거나 직접 지움)
- es 1단계 · `e|hola` choose — Hola, perro bonito. · 보기 Hora / Adiós / **Hola**
  - 왜: 이것도 맞음: Adiós — 'Adiós, perro bonito.'(잘 가, 예쁜 개야)도 문장이 맞아 답이 둘
  - 고칠 자리: 문제은행 KV qbank:v1:es:e|hola 오답·예문(서버 server/qbank.ts — 도태 기다리거나 직접 지움)
- ja 2단계 · `e|いいですね` choose — 今日は天気がいいですね。 · 보기 よくないですね / **いいですね** / いいますね
  - 왜: 이것도 맞음: よくないですね — '今日は天気がよくないですね'도 완전히 맞는 문장 — 뜻이 안 보여 답이 둘
  - 고칠 자리: 문제은행 KV qbank:v1:ja:e|いいですね 오답·예문(서버 server/qbank.ts — 도태 기다리거나 직접 지움)
- ko 4단계 · `f|ko-f4-19` choose — 그 부분은요, 제가 따로 정리해서 보내 드릴게요. · 보기 그 부분는요 / **그 부분은요** / 그 부분을요
  - 왜: 이것도 맞음: 그 부분을요 — '그 부분을요, 제가 따로 정리해서…'도 자연스러운 구어(목적어 + 요)라 답이 둘
  - 고칠 자리: src/lib/curriculum/frames/decoys/ko.ts "ko-f4-19|그 부분은요" (맞는 대안이면 빼고 plain/에서도)

### 문장이 어색함 (`unnatural`) — 12

- ar 1단계 · `f|ar-f1-01` choose — اسمي مين هو. · 보기 **اسمي** / اسم أنا / أنا اسم
  - 왜: 어색한 문장 → اسمي مينهو. — 'مين هو'는 구어로 '그가 누구냐'로 읽혀 이름 Min-ho 표기로 어색함, 보통 'مينهو'로 붙여 씀
  - 고칠 자리: 그 문장의 데이터 파일(frames·stageScripts·대본 은행)
- en 1단계 · `e|nice to meet you` choose — You are my new boss. Hi, nice to meet you. · 보기 nice meet to you / **nice to meet you** / nice for meet you
  - 왜: 어색한 문장 → You must be my new boss. Hi, nice to meet you. — 'You are my new boss.'라고 상대에게 단정하는 말은 어색함 — 보통 'You must be…'
  - 고칠 자리: 문제은행 KV qbank:v1:en:e|nice to meet you 예문
- es 2단계 · `e|me viene bien` choose — Esta silla me viene bien. · 보기 **me viene bien** / me viene bueno / me viene buen
  - 왜: 어색한 문장 → El martes me viene bien. — 'me viene bien'은 시간·일정이 편하다는 말이라 의자에는 어색함
  - 고칠 자리: 문제은행 KV qbank:v1:es:e|me viene bien 예문
- fr 5단계 · `e|À vrai dire` choose — À vrai dire, les personnages aussi caricaturaux, ce n'est pas mon truc. · 보기 **À vrai dire** / À vraie dire / Au vrai dire
  - 왜: 어색한 문장 → À vrai dire, des personnages aussi caricaturaux, ce n'est pas mon truc. — 비교 대상 없이 'les personnages aussi caricaturaux'는 어색, 'des ~ aussi'가 자연스러움
  - 고칠 자리: 그 문장의 데이터 파일(frames·stageScripts·대본 은행)
- hi 2단계 · `e|बड़ा भाई` choose — मेरा बड़ा भाई अभी दिल्ली में रहता है, उसके साथ गया। · 보기 बड़ो भाई / **बड़ा भाई** / बड़ी भाई
  - 왜: 어색한 문장 → मेरा बड़ा भाई अभी दिल्ली में रहता है, मैं उसके पास गया था। — 'उसके साथ गया'는 주어가 빠지고 '델리에 사는 형과 함께 갔다'가 앞뒤가 안 맞아 어색함 — '형에게(उसके पास) 갔다'로
  - 고칠 자리: 그 문장의 데이터 파일(frames·stageScripts·대본 은행)

### 배운 적 없음 (`hard-level`) — 6

- ja 3단계 · `e|助かる` type — え、いいの？助かる。 · 보기 助ける / 助かれる / 助けかる
  - 왜: 3단계 학습자에게 5단계 문장
  - 고칠 자리: 그 열쇠의 단계(frames·stageScripts stage) · quiz.ts near()
- ja 3단계 · `e|助かる` choose — ありがとう。来週中に返事をもらえると助かるよ。 · 보기 助ける / **助かる** / 助かれる
  - 왜: 3단계 학습자에게 5단계 문장
  - 고칠 자리: 그 열쇠의 단계(frames·stageScripts stage) · quiz.ts near()
- ja 3단계 · `e|助かる` order — え、いいの？それだけでもめちゃくちゃ助かる。
  - 왜: 3단계 학습자에게 5단계 문장
  - 고칠 자리: 그 열쇠의 단계(frames·stageScripts stage) · quiz.ts near()
- ja 3단계 · `e|助かる` type — え、いいの？それだけでもめちゃくちゃ助かる。 · 보기 助ける / 助かれる / 助けかる
  - 왜: 3단계 학습자에게 5단계 문장
  - 고칠 자리: 그 열쇠의 단계(frames·stageScripts stage) · quiz.ts near()
- ja 3단계 · `e|助かる` choose — え、いいの？それだけでもめちゃくちゃ助かる。 · 보기 助かれる / 助ける / **助かる**
  - 왜: 3단계 학습자에게 5단계 문장
  - 고칠 자리: 그 열쇠의 단계(frames·stageScripts stage) · quiz.ts near()

### 오답이 한눈에 지워짐 (`easy-decoy`) — 4

- en 3단계 · `f|en-f3-03` choose — They were sleeping when the alarm went off. · 보기 if / what / **when**
  - 왜: 한눈에 지워지는 오답: what — 'what'은 접속사 자리에 올 수 없는 대명사라 바로 지워짐 — while/before 같은 닮은 접속사가 나음
  - 고칠 자리: src/lib/curriculum/frames/decoys/en.ts "en-f3-03|when"
- ja 3단계 · `f|ja-f3-02` choose — すみません、今日は行けないんです。 · 보기 **ないんです** / を / に
  - 왜: 한눈에 지워지는 오답: を, に — '行け' 뒤에 조사 を・に는 붙을 수 없어 문법을 몰라도 지워짐, 길이도 정답만 다름
  - 고칠 자리: 문제은행 KV qbank:v1:ja:f|ja-f3-02 오답·예문(서버 server/qbank.ts — 도태 기다리거나 직접 지움)
- en 3단계 · `f|en-f3-03` choose — She was cooking dinner when the lights went out. · 보기 if / **when** / what
  - 왜: 한눈에 지워지는 오답: what — 'what'은 접속사 자리에 올 수 없어 바로 지워짐
  - 고칠 자리: src/lib/curriculum/frames/decoys/en.ts "en-f3-03|when"
- ja 1단계 · `e|はじめまして` choose — 電話で、はじめまして。 · 보기 **はじめまして** / ありがとうございました / はじまりまして
  - 왜: 한눈에 지워지는 오답: ありがとうございました — '電話で、はじめまして'는 어색하고, 'ありがとうございました'는 뜻이 전혀 다른 인사라 바로 지워짐
  - 고칠 자리: 문제은행 KV qbank:v1:ja:e|はじめまして 오답·예문(서버 server/qbank.ts — 도태 기다리거나 직접 지움)

### 수준보다 쉬움 (`easy-level`) — 2

- ar 5단계 · `f|ar-f5-01` choose — لقد فقدت مفتاح البيت مرة أخرى. · 보기 لم / لن / **لقد**
  - 왜: 5단계에 너무 쉬움 — 'لقد'는 초급에 배우는 완료 강조 조사라 5단계로는 너무 쉬움
  - 고칠 자리: 그 열쇠의 단계(frames·stageScripts stage) · quiz.ts near()
- ar 5단계 · `f|ar-f5-01` choose — لقد كان لي شرف العمل معكم. · 보기 لم / لن / **لقد**
  - 왜: 5단계에 너무 쉬움 — 'لقد'는 초급 조사라 5단계(원어민과 대화)로는 너무 쉬움
  - 고칠 자리: 그 열쇠의 단계(frames·stageScripts stage) · quiz.ts near()

## 이 점검이 못 보는 것

- 화면: 버튼 이름·제목·카드에 답이 보이는지, 눌렀는데 안 뜨는지 — 화면 점검(`scripts/ux-check/`) 몫.
- 체감: 할 일이 명확한지·계속할 이유 — 화면 점검의 인물 몫.
- 오답이 그럴듯한지·문장이 자연스러운지는 코드로 못 가려서 판정 표본(학습 언어마다 일부)만 본다(`JUDGE.md`).
- 어휘 탭의 넓어지는 원(circle.ts)은 `scripts/quiz-circle-sim.ts`가 따로 본다. 중국어 낱말 조각 잘림은 이 규칙으로 못 가린다(한 글자 낱말이 흔해서).
