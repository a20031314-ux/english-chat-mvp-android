# 문제 지도

> **자동 생성 — 손으로 고치지 않는다.** `node --experimental-strip-types scripts/quiz-map.mts`가 지금 코드(`ladder.ts`·`vocabLevel.ts`·`preparedQuiz.ts`·`talkFill.ts`)와 문제 데이터(`problems/`·`spot-errors/`·`story-errors/`·`vocab/`)에서 만든다. main push 때 CI `quiz-map`이 다시 만든다.
> 규칙의 글은 `hub/app/QUIZ.md`, 실력이 섞인 학습자의 1년은 `scripts/sim/quiz-year.mts`. 여기 날짜는 **다 맞히는 학습자**(첫 측정 건너뛰기 = 1단계, 하루 새 묶음 3개, 날마다)를 실제 함수로 돌린 어림.

## 1. 한 판의 흐름

```svg
<svg viewBox="0 0 680 500" width="100%" style="max-width:680px;font-family:inherit" role="img">
<defs><marker id="qa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="var(--muted)" stroke-width="1.5"/></marker></defs>
<rect x="240" y="30" width="200" height="44" rx="8" fill="var(--surface)" stroke="var(--line)" stroke-width="1"/><text x="340" y="52" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">Quizbank 열기</text>
<path d="M340 74 L340 90 L200 90 L200 110" fill="none" stroke="var(--muted)" stroke-width="1.2" marker-end="url(#qa)"/>
<path d="M340 90 L480 90 L480 110" fill="none" stroke="var(--muted)" stroke-width="1.2" marker-end="url(#qa)"/>
<rect x="80" y="112" width="240" height="56" rx="8" fill="var(--surface)" stroke="var(--qa)" stroke-width="1.5"/><text x="200" y="131" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">다시 볼 것</text><text x="200" y="151" text-anchor="middle" dominant-baseline="central" font-size="12" fill="var(--muted)">틀린 것 · 대화에서 막힌 것</text>
<text x="340" y="140" text-anchor="middle" dominant-baseline="central" font-size="16" fill="var(--muted)">⇄</text>
<rect x="360" y="112" width="240" height="56" rx="8" fill="var(--surface)" stroke="var(--store)" stroke-width="1.5"/><text x="480" y="131" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">새 묶음 7문제</text><text x="480" y="151" text-anchor="middle" dominant-baseline="central" font-size="12" fill="var(--muted)">약한 종류를 더 많이</text>
<path d="M200 168 L200 200" fill="none" stroke="var(--muted)" stroke-width="1.2"/>
<path d="M480 168 L480 200" fill="none" stroke="var(--muted)" stroke-width="1.2"/>
<path d="M130 200 L550 200" fill="none" stroke="var(--muted)" stroke-width="1.2"/>
<path d="M130 200 L130 238" fill="none" stroke="var(--muted)" stroke-width="1.2" marker-end="url(#qa)"/>
<path d="M340 200 L340 238" fill="none" stroke="var(--muted)" stroke-width="1.2" marker-end="url(#qa)"/>
<path d="M550 200 L550 238" fill="none" stroke="var(--muted)" stroke-width="1.2" marker-end="url(#qa)"/>
<rect x="40" y="240" width="180" height="56" rx="8" fill="var(--surface)" stroke="var(--store)" stroke-width="1.5"/><text x="130" y="259" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">단어</text><text x="130" y="279" text-anchor="middle" dominant-baseline="central" font-size="12" fill="var(--muted)">예문 속 뜻 고르기</text>
<rect x="250" y="240" width="180" height="56" rx="8" fill="var(--surface)" stroke="var(--store)" stroke-width="1.5"/><text x="340" y="259" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">문법</text><text x="340" y="279" text-anchor="middle" dominant-baseline="central" font-size="12" fill="var(--muted)">고르기 → 빈칸 → 틀린 곳</text>
<rect x="460" y="240" width="180" height="56" rx="8" fill="var(--surface)" stroke="var(--store)" stroke-width="1.5"/><text x="550" y="259" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">표현</text><text x="550" y="279" text-anchor="middle" dominant-baseline="central" font-size="12" fill="var(--muted)">고르기 → 빈칸</text>
<path d="M130 296 L130 338" fill="none" stroke="var(--muted)" stroke-width="1.2" marker-end="url(#qa)"/>
<path d="M340 296 L340 338" fill="none" stroke="var(--muted)" stroke-width="1.2" marker-end="url(#qa)"/>
<path d="M550 296 L550 338" fill="none" stroke="var(--muted)" stroke-width="1.2" marker-end="url(#qa)"/>
<rect x="40" y="340" width="600" height="56" rx="8" fill="var(--surface)" stroke="var(--line)" stroke-width="1"/><text x="340" y="359" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">답</text><text x="340" y="379" text-anchor="middle" dominant-baseline="central" font-size="12" fill="var(--muted)">맞힘 → 다음 칸 · 틀림 → 다시 볼 것으로 ↻</text>
<rect x="40" y="420" width="600" height="56" rx="8" fill="var(--surface)" stroke="var(--accent)" stroke-width="1.5"/><text x="340" y="439" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">묶음 끝에 가끔</text><text x="340" y="459" text-anchor="middle" dominant-baseline="central" font-size="12" fill="var(--muted)">문단 틀린 곳 · 대화 채우기(내 채팅·통화 줄)</text>
</svg>
```

다시 볼 것 = 대화 채우기 ≤2 → 대화에서 막힌 것 → [다시]·틀린 것(8개까지). 새 묶음 = 대화 채우기 1 → 문법 → 표현 → 낱말 → 문단(단계에 따라). 맡긴 열쇠(넘겨 보기 남은 카드 등)가 있으면 다섯씩 먼저.

## 2. 새 묶음 7문제의 종류 수

| 단계 | 출발 비율(낱말·문법·표현) | 문제 수 | 한 종류를 10개 연달아 맞히면(48시간) |
|---|---|---|---|
| 1~2 | 50% · 30% · 20% | 낱말 4 · 문법 2 · 표현 1 | 문법이 그랬다면: 낱말 4 · 문법 1 · 표현 2 |
| 3~5 | 40% · 35% · 25% | 낱말 3 · 문법 2 · 표현 2 | 문법이 그랬다면: 낱말 4 · 문법 1 · 표현 2 |

다 맞히면 세 종류가 함께 줄어 비율은 출발과 같다. 14일 틀린 비율이 평균보다 높은 종류는 10%p마다 5%p 늘어난다(15~60%).

## 3. 문법 — 유형 먼저, 축마다 1→5단계

```svg
<svg viewBox="0 0 680 330" width="100%" style="max-width:680px;font-family:inherit" role="img">
<defs><marker id="qa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="var(--muted)" stroke-width="1.5"/></marker></defs>
<rect x="40" y="30" width="120" height="44" rx="8" fill="var(--surface)" stroke="var(--line)" stroke-width="1"/><text x="100" y="52" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">① 고르기</text>
<rect x="180" y="30" width="80" height="44" rx="8" fill="var(--surface)" stroke="var(--store)" stroke-width="1.5"/><text x="220" y="52" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">1단계</text>
<rect x="272" y="30" width="80" height="44" rx="8" fill="var(--surface)" stroke="var(--store)" stroke-width="1.5"/><text x="312" y="52" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">2단계</text>
<rect x="364" y="30" width="80" height="44" rx="8" fill="var(--surface)" stroke="var(--store)" stroke-width="1.5"/><text x="404" y="52" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">3단계</text>
<rect x="456" y="30" width="80" height="44" rx="8" fill="var(--surface)" stroke="var(--store)" stroke-width="1.5"/><text x="496" y="52" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">4단계</text>
<rect x="548" y="30" width="80" height="44" rx="8" fill="var(--surface)" stroke="var(--store)" stroke-width="1.5"/><text x="588" y="52" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">5단계</text>
<path d="M588 74 L588 87 L220 87 L220 98" fill="none" stroke="var(--muted)" stroke-width="1.2" marker-end="url(#qa)"/>
<rect x="40" y="100" width="120" height="44" rx="8" fill="var(--surface)" stroke="var(--line)" stroke-width="1"/><text x="100" y="122" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">② 빈칸 쓰기</text>
<rect x="180" y="100" width="80" height="44" rx="8" fill="var(--surface)" stroke="var(--store)" stroke-width="1.5"/><text x="220" y="122" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">1단계</text>
<rect x="272" y="100" width="80" height="44" rx="8" fill="var(--surface)" stroke="var(--store)" stroke-width="1.5"/><text x="312" y="122" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">2단계</text>
<rect x="364" y="100" width="80" height="44" rx="8" fill="var(--surface)" stroke="var(--store)" stroke-width="1.5"/><text x="404" y="122" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">3단계</text>
<rect x="456" y="100" width="80" height="44" rx="8" fill="var(--surface)" stroke="var(--store)" stroke-width="1.5"/><text x="496" y="122" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">4단계</text>
<rect x="548" y="100" width="80" height="44" rx="8" fill="var(--surface)" stroke="var(--store)" stroke-width="1.5"/><text x="588" y="122" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">5단계</text>
<path d="M588 144 L588 157 L220 157 L220 168" fill="none" stroke="var(--muted)" stroke-width="1.2" marker-end="url(#qa)"/>
<rect x="40" y="170" width="120" height="44" rx="8" fill="var(--surface)" stroke="var(--line)" stroke-width="1"/><text x="100" y="192" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">③ 틀린 곳</text>
<rect x="180" y="170" width="80" height="44" rx="8" fill="var(--surface)" stroke="var(--store)" stroke-width="1.5"/><text x="220" y="192" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">1단계</text>
<rect x="272" y="170" width="80" height="44" rx="8" fill="var(--surface)" stroke="var(--store)" stroke-width="1.5"/><text x="312" y="192" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">2단계</text>
<rect x="364" y="170" width="80" height="44" rx="8" fill="var(--surface)" stroke="var(--store)" stroke-width="1.5"/><text x="404" y="192" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">3단계</text>
<rect x="456" y="170" width="80" height="44" rx="8" fill="var(--surface)" stroke="var(--store)" stroke-width="1.5"/><text x="496" y="192" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">4단계</text>
<rect x="548" y="170" width="80" height="44" rx="8" fill="var(--surface)" stroke="var(--store)" stroke-width="1.5"/><text x="588" y="192" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">5단계</text>
<path d="M588 214 L588 248" fill="none" stroke="var(--muted)" stroke-width="1.2" marker-end="url(#qa)"/>
<rect x="180" y="250" width="448" height="56" rx="8" fill="var(--surface)" stroke="var(--accent)" stroke-width="1.5"/><text x="404" y="269" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="var(--ink)">다음 회차</text><text x="404" y="289" text-anchor="middle" dominant-baseline="central" font-size="12" fill="var(--muted)">같은 문법, 새 문장으로 ①부터 다시</text>
</svg>
```

- ① 고르기는 나올 때마다 모양이 바뀜: 맞는 꼴 → 문맥 → 대답 고르기 → 틀린 문장(문제은행에 있을 때만, 없으면 맞는 꼴).
- 틀리면 그 칸에서 다른 문장, 그 문제는 다시 볼 것으로. 틀린 곳 문항이 없는 칸·표현은 ②에서 끝. 문장 전체 쓰기는 퀴즈에 없음(통화·채팅이 맡음).

## 4. 단계와 회차

```
단계 안: 그 단계 축 칸을 다 지나면 위로, 또는 그 단계 이상 답 8개마다 80% 이상이면 위·40% 이하면 아래(첫 측정 단계 밑으로는 안 내려감, 최고 5) · 축이 바뀌면 첫 측정 단계부터
섞기: 묶음에 문법이 둘 이상이면 하나는 이 축을 이미 지난 칸에서 다음 유형으로
표현은 회차 없음(아래 단계 것도 계속 나옴) · 낱말은 끝이 없음 · 문단은 1~2단계 네 묶음에 하나, 3단계 둘에 하나, 4~5단계 묶음마다(하루 둘까지)
```

### 단계마다 넣어 둔 문제 수

문법 칸 수(괄호 = 그중 ③ 틀린 곳 데이터가 있는 칸, 모두 있으면 생략) · 표현(넣어 둔 문제, 영어 밖은 표현 카드) · 문단 P1·P2·P3·P4 · 낱말.

| 언어 | 문법 1 | 2 | 3 | 4 | 5 | 표현 1·2·3·4·5 | 문단 P1·P2·P3·P4 | 낱말 |
|---|---|---|---|---|---|---|---|---|
| en | 14 | 8(③6) | 11(③10) | 8(③4) | 6(③3) | 20·22·22·22·21 | 10·10·10·9 | 6987 |
| ko | 8(③6) | 8 | 8(③7) | 8(③4) | 8(③2) | 카드 | 10·10·10·10 | 7000 |
| ja | 8 | 8 | 8(③7) | 8(③6) | 8(③0) | 카드 | 10·10·10·10 | 7000 |
| zh | 7 | 7(③5) | 8(③7) | 7(③5) | 6(③4) | 카드 | 9·10·7·7 | 7043 |
| es | 8 | 8 | 7(③6) | 7(③4) | 7(③3) | 카드 | 9·10·7·9 | 7138 |
| fr | 8(③7) | 8(③7) | 7(③6) | 7(③5) | 7(③4) | 카드 | 10·8·8·10 | 7000 |
| it | 8(③7) | 8 | 8 | 7(③6) | 7(③2) | 카드 | 9·10·7·10 | 7000 |
| pt | 8(③5) | 7(③5) | 7(③5) | 7(③5) | 7(③3) | 카드 | 6·9·5·10 | 7042 |
| ru | 7(③6) | 8(③6) | 8(③6) | 7(③6) | 7(③3) | 카드 | 10·8·6·9 | 6983 |
| ar | 8(③5) | 8(③6) | 7(③5) | 7(③6) | 7(③1) | 카드 | 8·9·10·8 | 6978 |
| id | 8(③4) | 8(③3) | 7(③6) | 7(③3) | 6(③2) | 카드 | 10·10·8·8 | 7118 |
| vi | 8(③6) | 8(③4) | 7(③4) | 7(③3) | 6(③0) | 카드 | 9·10·10·10 | 7000 |
| th | 8 | 8(③6) | 8(③6) | 8(③4) | 8(③3) | 카드 | 8·10·9·8 | 7008 |
| hi | 8(③4) | 7(③6) | 7(③5) | 7(③2) | 7(③2) | 카드 | 7·10·9·9 | 6914 |

## 5. 다 맞히면 언제 어디에 닿나 (어림)

1회차에서 빈칸 쓰기·틀린 곳 축이 시작하는 날(고르기 1~5단계를 다 지난 뒤) · 1회차 문법을 다 끝낸 날 · 2·3회차 시작 · 표현(넣어 둔 문제)을 다 끝낸 날 · 낱말 경계가 단계 2·3·4·5·6(확장)에 닿는 날(경계는 처음 20개는 답마다, 그 뒤 10개마다 ×1.2).

| 언어 | 빈칸 시작 | 틀린 곳 시작 | 1회차 끝 | 2회차 | 3회차 | 표현 끝 | 낱말 2·3·4·5·6 |
|---|---|---|---|---|---|---|---|
| en | 13일 | 15일 | 20일 | 20일 | 39일 | 36일 | 1일 · 2일 · 2일 · 4일 · 6일 |
| ko | 13일 | 15일 | 19일 | 19일 | 38일 | 카드 | 1일 · 1일 · 1일 · 2일 · 4일 |
| ja | 13일 | 15일 | 19일 | 20일 | 39일 | 카드 | 1일 · 1일 · 2일 · 2일 · 4일 |
| zh | 11일 | 14일 | 18일 | 19일 | 37일 | 카드 | 1일 · 1일 · 1일 · 2일 · 4일 |
| es | 12일 | 14일 | 18일 | 19일 | 37일 | 카드 | 1일 · 1일 · 2일 · 2일 · 4일 |
| fr | 12일 | 14일 | 19일 | 19일 | 37일 | 카드 | 1일 · 1일 · 2일 · 2일 · 4일 |
| it | 12일 | 15일 | 19일 | 19일 | 38일 | 카드 | 1일 · 1일 · 2일 · 2일 · 4일 |
| pt | 12일 | 14일 | 18일 | 18일 | 35일 | 카드 | 1일 · 1일 · 2일 · 2일 · 4일 |
| ru | 12일 | 15일 | 18일 | 18일 | 36일 | 카드 | 1일 · 1일 · 2일 · 2일 · 4일 |
| ar | 12일 | 14일 | 18일 | 18일 | 35일 | 카드 | 1일 · 1일 · 2일 · 2일 · 4일 |
| id | 12일 | 14일 | 16일 | 17일 | 33일 | 카드 | 1일 · 1일 · 2일 · 2일 · 4일 |
| vi | 12일 | 14일 | 16일 | 16일 | 32일 | 카드 | 1일 · 1일 · 2일 · 2일 · 4일 |
| th | 13일 | 15일 | 19일 | 19일 | 38일 | 카드 | 1일 · 1일 · 2일 · 2일 · 4일 |
| hi | 12일 | 14일 | 17일 | 17일 | 33일 | 카드 | 1일 · 1일 · 2일 · 2일 · 4일 |

영어 첫 열두 문법·표현 문제 차례: `g|1:0` → `g|1:1` → `e|nice to meet you` → `e|where are you from` → `g|1:2` → `g|1:3` → `e|what do you do` → `e|how about you` → `g|2:0` → `g|2:1` → `e|how was your weekend` → `e|it was fun`

