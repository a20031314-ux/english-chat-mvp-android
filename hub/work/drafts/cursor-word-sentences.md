# Cursor 프롬프트 — 낱말 예문 이어 채우기 (2026-11-09)

> 사용자 PC(`C:\dev\english-chat-mvp`)의 Cursor 에이전트에 아래 "붙일 프롬프트"를 그대로 붙인다. API는 쓰지 않는다(구독 에이전트가 직접 씀).
> 지금 채워진 비율: 전체 45%(44,542/98,211 낱말). zh 28% · ja·it·pt·ru·hi·id·th·vi 35~36% · fr 45% · ar 47% · es 49% · ko 51% · en 100%.

## 붙일 프롬프트

```
너는 언어 학습 앱의 사전 예문을 채운다. API·외부 모델은 쓰지 말고 네가 직접 문장을 쓴다.

[준비]
- 저장소: C:\dev\english-chat-mvp (PowerShell). 시작할 때 git pull --ff-only.
- 지금 상태: node --experimental-strip-types scripts/word-sentences.ts --check
  (언어마다 "낱말 채움/전체 · 모자람 N")

[할 일 — 이 순서로, 언어 하나씩]
zh → ja → it → pt → ru → hi → id → th → vi → fr → ar → es → ko
1. 모자란 낱말 200개 받기(빈도 순, 1~5단계가 앞, 확장 6단계가 뒤):
   node --experimental-strip-types scripts/word-sentences.ts --todo <언어> --limit 200
   한 줄 = 순위 · 낱말 · 품사 · 단계
2. 낱말마다 문장 2개를 tmp/ws/<언어>-<첫순위>.json 에 쓴다:
   {"sentences":[{"w":"낱말","text":"문장","en":"영어 번역","ko":"한국어 번역","blank":"문장 속 그 낱말 꼴"}, ...]}
3. 넣기(같은 검사로 걸러서 word-sentences/<언어>.json 에 들어감):
   node --experimental-strip-types scripts/word-sentences.ts --merge <언어> tmp/ws/<언어>-<첫순위>.json
   "뺌 …" 줄이 나오면 그 낱말만 고쳐 다시 merge(이미 둘 찬 낱말은 알아서 건너뜀).
4. 1~3을 반복. 1,000낱말마다 커밋·push:
   npm run test:curriculum (전부 통과 확인)
   git add src/lib/curriculum/word-sentences; git commit -m "낱말 예문 <언어> +N (Cursor)"; git pull --rebase; git push
5. 한도에 걸려 멈추면 거기까지 커밋·push. 다음에 같은 프롬프트로 다시 시작하면 --todo가 남은 곳부터 준다.

[문장 규칙 — merge가 검사하는 것 + 사람이 보는 것]
- 그 언어 원어민이 실제로 하는 말. 영어 문장을 옮겨 쓰지 말고 그 언어로 먼저 쓴다. 낱말 뜻풀이·설명문 금지("이 단어는…").
- 숫자(0-9) 금지. 길이: 1단계 80자 이하, 그 밖 140자 이하. 1~2단계는 짧고 쉬운 말만.
- blank = 문장 안에 그대로 한 번만 나오는 그 낱말의 꼴(활용·조사 붙은 꼴 가능, 대소문자 그대로). 띄어 쓰는 언어는 낱말 하나 통째로(다른 낱말의 일부 금지 — 예: vi "bí ẩn" 속 "ẩn" 안 됨).
- 한국어(ko) 학습: 동사·형용사는 말하는 꼴(가요·갔어요·가벼워요). 사전형(가다·가볍다) 금지. 해요체·반말 섞어도 됨.
- 두 문장은 서로 다른 상황·다른 꼴(예: 하나는 현재, 하나는 과거). 같은 문장 반복 금지(다른 낱말 문장과도).
- 뜻이 여럿인 낱말은 가장 흔한 뜻 하나로 두 문장.
- 기능어(조사·관사·대명사 등)도 그 낱말이 자연스럽게 들어간 평범한 문장.
- 특정 실존 인물·브랜드·정치·종교·폭력·성적인 내용 금지. 사람 이름은 흔한 이름만.
- en = 그 문장의 자연스러운 영어 번역. ko = 그 문장의 자연스러운 한국어 번역(해요체). 둘 다 꼭 채운다(영어 학습이면 en이 문장과 같아도 됨).
- 글자: zh 간체, ja 가나·한자, ar 아랍 글자, ru 키릴, th 타이, hi 데바나가리.

[하지 말 것]
- word-sentences/*.json 을 직접 고치지 말 것(항상 --merge로). 다른 파일·코드 수정 금지.
- 이미 2개 있는 낱말을 다시 쓰지 말 것.
```

## 확인(채팅 쪽)

- push가 오면: `--check` 수치, 언어마다 표본 20줄을 보고 어색한 것·답이 새는 것(blank가 너무 흔한 꼴) 확인 → `hub/chat/log`에 수치, 이 파일 맨 위 비율 갱신.
- 출처: Cursor가 쓴 줄은 `src: "cursor"`(예전 Cursor 작업은 출처 칸 없음). 출처 목록(`credits-sentences.mjs`)은 Tatoeba만 싣는다.
