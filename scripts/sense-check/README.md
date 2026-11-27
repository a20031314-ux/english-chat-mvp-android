# 예문 뜻 맞춤 점검 (Cursor 구독 에이전트용)

> 사용자 2026-11-28: Quizbank 뜻 고르기 "hack" — 정답은 카드 뜻 "컴퓨터에 침입하다"인데 예문은 "I need to hack this branch off the tree"(잘라 내다).
> 뜻이 여럿인 낱말에서 **사전 예문이 카드 뜻과 다른 뜻으로 쓰인 것**을 언어마다 찾아 고친다. 모델 크레딧 API는 쓰지 않는다(이 에이전트가 직접 읽고 판단).

## 왜 생기나

- 낱말 카드 뜻(`gloss`)은 서버가 만들어 저장한 것 — 저장소에 없다. `GET https://www.languagebank.net/api/curriculum/words?lang=<언어>&ui=en&chunk=<n>`(헤더 `x-app-version: 2.80.0`)의 `cards[].gloss`(영어 뜻), `ui=ko`면 한국어 뜻.
- 뜻 고르기는 이 카드 뜻을 정답으로 두고, 예문은 `src/lib/curriculum/word-sentences/<언어>.json`의 사전 예문(낱말마다 둘)에서 고른다. 예문이 다른 뜻이면 "이 문장에서 뜻은?"의 정답이 문장과 어긋난다.

## 순서 (한 번에 한 언어 — en부터, 다음은 사람이 정함. 언어: ar · en · es · fr · hi · id · it · ja · ko · pt · ru · th · vi · zh)

1. **카드 받기**: `scripts/sense-check/fetch.mjs <언어>`를 만들어 돌린다 — `src/lib/curriculum/vocab/<언어>.ts`의 `WORDS` 길이 ÷ 50 묶음을 `ui=en`으로 받아 `tmp/sense-check/<언어>.cards.json`에 `{ w, gloss }`로(동시 4개, 실패하면 1.5초 쉬고 세 번까지). `scripts/sentence-index/fetch.mjs`가 같은 꼴이니 참고. 받은 카드 수를 적는다.
2. **쓰는 세션**: 낱말마다 카드 뜻과 그 낱말의 예문 둘(`word-sentences/<언어>.json` 키 `w|<낱말>`)을 맞대, 예문에서 그 낱말이 **카드 뜻과 다른 뜻**으로 쓰였으면 목록에 올린다. 같은 뜻의 다른 쓰임(비유·관용이라도 같은 뜻)은 올리지 않는다. 낱말 뜻이 하나뿐인 것은 빠르게 넘긴다.
   올린 것마다 하나를 고른다:
   - **예문 바꾸기**(기본): 카드 뜻으로 쓰인 새 예문 하나 — `{"text", "en", "ko", "blank", "src": "made"}`. text는 학습 언어 한 문장(짧게, 그 낱말 단계에 맞는 쉬운 말), en은 영어 번역, ko는 자연스러운 한국어(반말 또는 해요체, 옆 예문과 같은 말투), blank는 text 안에 그대로 있는 그 낱말 꼴(활용된 꼴이면 그 꼴). 다른 예문과 같은 문장 금지.
   - **카드 뜻 바꾸기**(예문 둘 다 카드 뜻과 다르고, 그 예문 뜻이 그 낱말의 더 흔한 뜻일 때만): `src/lib/server/wordCards.ts`의 `GLOSS_FIX[<언어>][<낱말>]`에 영어 뜻 한 줄(예: `seat: "seat, place to sit"`). 두 예문은 그대로.
   결과를 `tmp/sense-check/<언어>.proposed.json`에 `[{ w, gloss, example, sense_in_example, fix: "example"|"gloss", new }]`로.
3. **판정 세션(새 채팅 — 쓰는 세션의 판단을 보지 않고)**: `proposed.json`만 읽고 하나씩 — (a) 정말 다른 뜻인가 (b) 새 예문이 카드 뜻으로 쓰였나, 학습 언어로 자연스러운가, en·ko 번역이 맞나, blank가 text에 그대로 있나 (c) GLOSS_FIX가 더 흔한 뜻인가. 통과만 `tmp/sense-check/<언어>.passed.json`.
4. **반영**: 통과분만 `word-sentences/<언어>.json`(그 예문 자리 하나만 바꿈 — 키 순서·들여쓰기·줄 끝(CRLF 여부)을 그대로, 파일 전체를 다시 쓰지 않고 그 항목만 문자열 치환)과 `wordCards.ts` GLOSS_FIX에. 출처가 바뀐 예문은 `src: "made"`.
5. **확인**: `npm run test:curriculum` 통과, `node -e "JSON.parse(require('fs').readFileSync('src/lib/curriculum/word-sentences/<언어>.json','utf8'))"` 통과, `git diff --stat`에 그 두 파일(+보고서)만.
6. **보고·PR**: `hub/work/drafts/sense-check-<언어>-YYYY-MM-DD.md` — 받은 카드 수 · 살펴본 낱말 수 · 올린 수 · 통과 수(예문 바꿈 n · 뜻 바꿈 n) · 판정에서 떨어진 것 몇 줄(왜) · 바꾼 것 표(낱말 · 카드 뜻 · 옛 예문 → 새 예문). 브랜치 `sense-check-<언어>`로 커밋(한국어 메시지)하고 PR — main에 바로 올리지 않는다. 사람이 합친다.

## 지킬 것

- 크레딧 드는 모델 API(OpenAI·Anthropic 키)를 부르지 않는다. 운영 API는 위 `words` 읽기만.
- 예문 외의 데이터·코드는 건드리지 않는다(`wordCards.ts`는 GLOSS_FIX 줄만).
- 한 언어씩 PR 하나. 다음 언어는 그 PR과 따로.
- 판단이 서지 않는 것은 바꾸지 않고 보고서 "보류"에.
