# 퀴즈 판정 표본 — 판정하는 법

`sweep.ts`가 학습 언어마다 빈칸 문제 표본(`tmp/quiz-sweep/<날>/judge/<언어>.jsonl`, 기본 30개 — 단계마다 고르게, 보기가 보이는 고르기 먼저)을 남긴다.
코드로는 못 가리는 것 — **오답이 그럴듯한가, 답이 하나뿐인가, 문장이 자연스러운가, 단계에 맞는가** — 를 그 언어를 잘 아는 판정 에이전트가 본다.
판정하는 쪽은 문제를 만든 채팅과 다른 에이전트로 한다(자기 채점 방지). 저장소 코드는 열지 않는다. 고치지 않는다.

## 한 줄(입력)

```
{"id":"es-3","learn":"es","stage":3,"key":"e|me parece que","kind":"choose","sentence":"___ eso es un poco tarde. …","options":["Mi parece que","Me parece que","Me parece de"],"answer":"Me parece que","meaning":"I think that's a bit late. …","from":"es-3-1"}
```

- `sentence`의 `___`에 `answer`가 들어간다. `kind`: choose = 보기 중 고르기, type = 보기 없이 직접 쓰기(`options`가 있으면 정답 + 채점이 틀림으로 보는 헷갈리는 꼴).
- `meaning`은 학습자가 **답한 뒤에** 보는 영어 뜻(문제 풀 때는 안 보임). `stage`: 1 = 완전 처음 … 5 = 원어민과 대화. `from`: qbank = 모델이 만든 문제은행 예문, 그 밖 = 앱 데이터.

## 보는 것 (그 언어의 원어민 교사처럼)

1. **오답이 한눈에 지워지나**(`obviousDecoys`): 그 단계 학습자가 문장을 읽고 *문법·뜻을 몰라도* 지울 수 있는 오답 — 품사·뜻이 전혀 다름, 문장에 넣으면 누가 봐도 말이 안 됨, 정답과 생김새가 너무 달라 정답만 "말 같아" 보임,
   철자 장난(실제로 아무도 안 쓰는 꼴, 예 "Holo"). 좋은 오답 = 그 단계 학습자가 실제로 하는 실수(활용·일치·조사·전치사·어순·닮은 낱말).
2. **답이 여럿인가**(`alsoCorrect`): 보기(또는 쓰기에서 학습자가 칠 만한 말) 중 그 자리에 들어가도 맞는 것 — 축약·동의어·존댓말·구어 변형 포함. 뜻이 조금 달라져도 문장이 자연스럽고 맞으면 맞는 것.
   `meaning`은 풀 때 안 보이므로, 뜻 줄을 봐야만 하나로 정해지는 경우도 여기에.
3. **문장이 자연스러운가**(`natural`): 원어민이 실제로 그렇게 말하나(어색한 조합·번역투·상황에 안 맞는 말투면 false, `fix`에 고친 문장).
4. **단계에 맞나**(`level`): ok · too-hard(그 단계에 배운 적 없을 말·문법) · too-easy(5단계인데 인사말 수준 등).

## 결과(이 형식, JSON 배열 하나 → `judge/<언어>.verdicts.json`)

```
[{"id":"es-3","obviousDecoys":["Me parece de"],"alsoCorrect":[],"natural":true,"level":"ok","note":"'de'는 전치사라 문장에서 바로 튐"}]
```

- 문제 없으면 `{"id":"…","obviousDecoys":[],"alsoCorrect":[],"natural":true,"level":"ok"}`.
- `note`는 한국어 한 줄, 무엇이 왜(그 언어를 모르는 사람이 읽어도 알게).
- 확신이 없으면 표시하지 않는다(표시는 그대로 고칠 일이 된다).

## 판정 뒤

`node scripts/quiz-sweep/report.mjs <날>` — 판정을 표시(`easy-decoy`·`hard-ambiguous`·`unnatural`·`hard-level`)로 바꿔 보고서에 넣고 고칠 자리를 붙인다.
고치는 순서는 `scripts/ux-check/FIX.md`와 같다(오답은 데이터 파일, 문제은행 예문은 도태를 기다리거나 KV에서 지움).
