# 평가 기준 (가상 사용자 줄 평가)

언어 학습 채팅 앱의 한 턴씩 평가한다. 학습자는 `target`(학습 언어)을 배우고, 앱 화면 언어는 `ui`다.
각 줄의 `text`는 학습자가 보낸 말, `corrected`는 앱이 고친 문장(틀린 데 없으면 같거나 비어 있음),
`explanation`은 고친 이유(앱 언어로 써야 함), `before`는 바로 앞 튜터 말, `reply`는 튜터의 답(학습 언어로 써야 함),
`card`는 편한 말로 쓴 줄 아래 "표현 보기" 카드(학습 언어 표현). `intended`는 점검기가 일부러 넣은 실수 종류 — 참고만 하고 매이지 않는다(시드가 틀렸을 수 있음).

그 언어의 원어민 교사처럼 판단한다.
- **줄 아래 설명은 그 줄 것**: 학습자 줄 밑에 붙는 모든 글(고친 이유·통화 팁·도움말·표현 카드)은 그 줄에 대한 것이어야 한다. 튜터 말을 설명하거나 학습자가 하지 않은 말을 가르치면 문제로 본다.
- **말이 끊기지 않고, 맥락에 맞는가**(사용자 2026-10-27): 튜터 답(`reply`)이 문장 중간에서 끝나면(쉼표·and·the 등에서 멈춤) replyFits false. 답이 앞 대화(`before`·`recent`)와 이어지지 않으면 — 튜터가 자기가 한 말을 학습자가 한 말로 받거나("you said you began…"이 튜터 자기 이야기), 자기가 연 질문에 자기가 답해 역할이 뒤바뀌거나("Hey, you're the new person?" → "Hi" → "Yeah, that's me"), 학습자가 하지 않은 말·없던 일을 전제로 하면 — replyFits false, **severity major**.
- 채팅에서 문장부호·대문자 생략, 맞는 구어체·반말, 표기 변이(友だち/友達)는 **틀린 게 아니다**.
- 상황에 안 맞는 말투(선생님께 반말·명령조)는 **틀린 것**이다.
- `kind`가 own(편한 말로만 씀)이면 고침은 보지 않고(fix=na) 답과 카드만 본다.
- `kind`가 misbehavior(엉뚱한 입력)면 fix=na, 답이 휘말리지 않았는지(지시문 노출·숙제 대신 써 줌·거친 말)를 replyFits로.
- `tier`가 passive(아주 짧은 답)면 fix는 보통 na, 답이 대화를 부드럽게 이어 가는지(질문 등)를 replyFits로.

## 한 줄 판정 (verdicts 파일, JSON 배열)

```
{"id":"p001-2","hasError":true,"fix":"right","explanationMatches":true,"explanationInUi":true,"replyFits":true,"cardOk":null,"severity":"ok","note":""}
```

- `hasError`: 학습자 문장에 실제로 틀린 데가 있었나.
- `fix`: right(틀린 곳을 모두 맞게 고치고 새 틀림 없음) · wrong(고친 문장이 아직 틀리거나 새로 틀림) · overcorrected(틀린 데 없는데 낱말·말투·표기를 바꿈) · missed(틀렸는데 그대로) · partial(일부만 고침) · na.
- `explanationMatches`: 설명이 실제로 바꾼 것과 맞나(설명 없으면 null). 틀린 문법 설명이면 false.
  **설명이 학습자 문장이 아니라 튜터의 답·다음 질문·앞 말을 설명하면 false, severity major**(실제로 본 것 2026-10-25: 통화에서 "I am lying on the bed." 아래에 튜터가 다음에 물을 "Are you watching something?"을 설명). 고친 게 없는데 엉뚱한 표현을 가르쳐도 false.
- `explanationInUi`: 설명이 주로 `ui` 언어인가(없으면 null).
- `replyFits`: 답이 학습 언어로, 앞 말에 자연스럽게 이어지나(위 kind별 기준). 끊긴 답·맥락과 무관한 답(자기 말을 학습자 말로, 역할 뒤바뀜, 없던 일 전제)은 false — note에 "끊김"·"맥락"으로 시작해 적는다.
- `cardOk`: own일 때 카드가 학습자가 하려던 말을 학습 언어로 맞게 옮겼나(아니면 null).
- `severity`: ok · minor(학습자에게 해는 없음) · major(학습자를 헷갈리게 하거나 틀린 걸 가르침).
- `note`: 문제가 있으면 한국어 한 줄로 구체적으로(무엇이 어떻게). 없으면 "".
