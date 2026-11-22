# 가상 사용자 문제 표시 — 2026-11-22

> scripts/ux-check/triage.mjs가 tmp/ux/marks에서 만듦. 고치는 법: scripts/ux-check/FIX.md. 표시 59개, 인물 3명.

| 이유 | 수 | 인물 |
|---|---|---|
| 그 밖에 `other` | 26 | junho, layla, minji |
| 채점이 이상함 `wrong-judge` | 26 | junho, layla, minji |
| 배운 적 없음 `hard-level` | 4 | junho, layla, minji |
| 답이 화면에 보임 `easy-leak` | 2 | junho, minji |
| 답이 여럿 `hard-ambiguous` | 1 | layla |

## 그 밖에 (`other`)

- junho ja/ko 0일째 010.png · `?`  — (문제 없음)
  - 왜: 코치 카드가 する→した만 고치고 같은 말의 たのしいでした(→たのしかった)·조사 を 빠짐은 안 짚음 — 카드가 첫 문장만 보는 듯
- junho ja/ko 0일째 037.png · `?`  — (문제 없음)
  - 왜: 통화 대본 📕 칩에 おる — 문장(今日は仕事や学校がありましたか…お休み)에 おる가 없음, 사전 주석 낱말 잘못 뽑음
- junho ja/ko 0일째 046.png · `?`  — (문제 없음)
  - 왜: 통화 끝 화면 숙제 [↻ 대화 시뮬레이션]과 "왜 막혔는지 보기"를 여러 번 눌러도 반응 없음(15초 기다림) — 숙제 시작 불가
- junho ja/ko 0일째 055.png · `?`  — (문제 없음)
  - 왜: 통화에서 쓴 단어 목록에 こう·せい·どう — がっこう·だいがくせい·どうとんぼり를 잘못 잘라 낸 조각. 머리 이름 ただ話す가 한국어 앱에서 일본어로 나옴
- junho ja/ko 3일째 063.png · `?`  — (문제 없음)
  - 왜: 3일째도 숙제 [↻ 대화 시뮬레이션] 누르면 "장면 만드는 중…" 뒤 버튼만 돌아오고 시뮬레이션이 안 열림. 고친 게 4개인데 [퀴즈|대화] 중 퀴즈 숙제는 없음
- junho ja/ko 3일째 083.png · `?`  — (문제 없음)
  - 왜: 통화 시작 첫 인사 뒤 몇 초 만에 튜터가 다음 질문을 해서 첫 내 차례가 늘 "…" 막힘으로 기록됨(1일째·3일째 둘 다). 또 "오늘 무료 통화 10분 남음"이 두 번 통화(약 8분) 뒤에도 그대로
- junho ja/ko 3일째 086.png · `?`  — (문제 없음)
  - 왜: 숙제 대화 시뮬레이션: 장면 만드는 중… 뒤 오류 안내 없이 버튼으로 되돌아감 — 1일째 2번·3일째 2번 모두 실패
- junho ja/ko 3일째 094.png · `hw|2f2f6aee-c770-4a0a-a807-2b8d62425209|0` spot — きょう えいご べんきょう する。 · 답 きょう えいご べんきょう した。
  - 왜: 틀린 곳 고르기 낱말 자르기가 깨짐: えいご→えい|ご, べんきょう→べ|ん|きょう — 낱말이 아닌 조각을 고르게 함
- junho ja/ko 3일째 100.png · `hw|2f2f6aee-c770-4a0a-a807-2b8d62425209|1` type — 単語を勉強しました。でも、文法は難しかったです。冬休みは大阪に行って、たこ焼きを食べたいです。 · 답 文法は難しかったです
  - 왜: 숙제 1/3 틀린 곳 고르기에서 확인 누르자 맞음/틀림 결과 없이 바로 2/3으로 넘어감
- junho ja/ko 3일째 114.png · `?`  — (문제 없음)
  - 왜: 숙제 ▶ 대화 시뮬레이션 첫 누름은 반응 없고 두 번째 누름 뒤 ~20초 걸려 열림 — 만드는 중 표시가 없어 고장처럼 보임
- junho ja/ko 3일째 118.png · `?`  — (문제 없음)
  - 왜: 대화 시뮬레이션 2번째: 튜터 질문은 たこ焼きのほかに何を食べたい(먹을 것)인데 내 칸 답은 道頓堀に行きたい・大阪城も見たい(갈 곳) — 질문과 답이 안 맞음
- layla es/ar 0일째 010.png · `?`  — (문제 없음)
  - 왜: 코치 카드 고친 것 두 개(a la→al, es→está) 중 es→está는 ser/estar 문제인데 이유 꼬리표가 하나뿐 "명사·형용사의 성"이라 까닭이 반만 맞음
- layla es/ar 0일째 046.png · `?`  — (문제 없음)
  - 왜: 끝 화면 숙제 "↻ محاكاة المحادثة"를 글자·좌표로 세 번 눌렀는데 25초가 지나도 아무 변화 없음 — 숙제를 시작할 수 없음
- layla es/ar 0일째 053.png · `?`  — (문제 없음)
  - 왜: 아랍어 화면 통화 세부: 내 말 → 고친 말 줄이 오른쪽→왼쪽으로 섞여 "…Ella está muy ← también. cansada también."처럼 낱말 순서가 뒤엉킴, 통화 이름이 스페인어 "Solo charlar"로 나옴
- layla es/ar 3일째 061.png · `?`  — (문제 없음)
  - 왜: 3일째 통화 기록 돌아보기에서도 숙제 "↻ محاكاة المحادثة" 눌러도 10초 넘게 반응 없음(1일째와 같음). 날짜가 아랍어 화면에 영어 꼴 "PM 1:54:53 ,11/22/2026"
- layla es/ar 3일째 082.png · `?`  — (문제 없음)
  - 왜: 서버 고쳤다는 뒤에도 22일 통화 돌아보기의 숙제 "↻ محاكاة المحادثة" 좌표·글자로 눌러 30초 기다려도 화면 그대로, 숙제 칸에 퀴즈 버튼은 없음
- layla es/ar 3일째 090.png · `hw|386842f5-bd79-47e0-a652-cbd2fea63f6c|1` type — Hola, Mateo. Estoy bien, pero cansada. Ayer trabajé de noche en el hospital y hoy solo he dormido cuatro horas. · 답 solo he dormido
  - 왜: 1/2에서 simpáticas 쓰고 확인을 누르니 맞았는지 틀렸는지 한 번도 안 보이고 바로 2/2로 넘어감. 2/2 빈칸 답은 dormí인데 입력칸 자리표가 "s…"(1/2와 같음) — 첫 글자 힌트라면 틀린 힌트
- minji en/ko 0일째 011.png · `?`  — (문제 없음)
  - 왜: 코치 카드 까닭이 "현재형과 장소 표현" — 실제로 고친 건 the 빼기(관사)와 mom→mom's(소유격). 현재형은 원래 맞았음
- minji en/ko 0일째 017.png · `?`  — (문제 없음)
  - 왜: 까닭이 "물음표와 아포스트로피" — 물음표는 없고, 실제로 중요한 건 worry about(전치사)과 what I say→what to say. 말로 한 통화에서 아포스트로피를 까닭으로 드는 것도 이상
- minji en/ko 0일째 019.png · `?`  — (문제 없음)
  - 왜: What I can ask to client? → What can I ask the client? 고친 건 맞는데 까닭이 "간접의문문 어순" — 직접 의문문 어순(조동사 앞으로)+to 빼기+관사. 카드가 처음부터 흐릿하게 뜸
- minji en/ko 0일째 037.png · `?`  — (문제 없음)
  - 왜: 통화 끝 화면 숙제 "↻ 대화 시뮬레이션"을 글자·좌표로 두 번 눌렀는데 10초 넘게 아무것도 안 열림(뒤에 숨었거나 안 먹음). 숙제에 퀴즈 칸도 없음
- minji en/ko 0일째 043.png · `?`  — (문제 없음)
  - 왜: 한국어 앱인데 통화 카드 이름이 영어 "Just talk". 또 세 문장 말한 줄은 통째로 줄긋고 → "My mother made it yesterday." 한 문장만 남겨, 나머지 두 문장이 지운 것처럼 보임
- minji en/ko 3일째 056.png · `?`  — (문제 없음)
  - 왜: It use → It uses 고침인데 까닭이 "동사 형태와 관사" — 관사는 바뀐 게 없음(3인칭 단수 -s)
- minji en/ko 3일째 110.png · `?`  — (문제 없음)
  - 왜: 숙제 퀴즈 끝 화면이 "6개 중 4개 맞음"과 닫기뿐 — 틀린 것 다시 보기도, 다음 숙제 "대화"로 가는 문도 없어 텅 빈 느낌
- minji en/ko 3일째 134.png · `?`  — (문제 없음)
  - 왜: 대화 시뮬레이션 끝 표시가 "✓ 1/4 · 한 줄 전체로 ✓" 한 줄뿐 — 1/4가 무엇인지(네 차례 중 하나만 맞음?) 알 수 없음. 그런데 첫 차례·한 줄 전체로 둘 다 ✓였음
- minji en/ko 3일째 149.png · `hw|80a5cb77-5746-44ca-9462-69626987e438|2` spot — I like that questions. · 답 I like those questions.
  - 왜: 맞힌 뒤 결과(✓ 맞았어요·고친 문장·🔊·📕 칩)가 1~2초 만에 저절로 다음 문제로 넘어감 — 다음 버튼이 있는데도. 1/6·1/5 결과를 못 읽음

## 채점이 이상함 (`wrong-judge`)

- junho ja/ko 0일째 013.png · `?`  — (문제 없음)
  - 왜: 코치 카드 문장(きょう えいご べんきょう した)을 그대로 따라 말했는데 ✓도 한 번 더도 안 뜨고 카드만 흐려짐
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge
- junho ja/ko 0일째 016.png · `?`  — (문제 없음)
  - 왜: 세 문장 묶음 중 たこやき たべる たい です(→たべたい) 활용 틀림인데 코치 카드 없음 — 틀린 걸 놓침
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge
- junho ja/ko 0일째 024.png · `?`  — (문제 없음)
  - 왜: 코치 카드가 말로 한 みせ/いい/ことば/おし를 店/言い/言葉/教 한자로 바꾼 것을 빨간 줄(틀림)로 표시 — 표기 차이일 뿐. 실제 틀린 건 を·と 빠짐인데 까닭은 "문장 끝의 동사 형태"
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge
- junho ja/ko 0일째 028.png · `?`  — (문제 없음)
  - 왜: 고친 줄(お店で「これをください」と言いますか…)을 그대로 소리 내 따라 말했는데 ✓ 안 뜸
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge
- junho ja/ko 0일째 031.png · `?`  — (문제 없음)
  - 왜: 코치 카드(三つ食べる…トイレはどこですか)를 소리대로 정확히 따라 말했는데 ✓ 안 뜸 — 한자 섞인 카드는 매번 ✓ 없음
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge
- junho ja/ko 0일째 054.png · `?`  — (문제 없음)
  - 왜: 통화 세부에서 店·言葉가 ✗(틀림) — 히라가나 みせ·ことば로 말했을 뿐. 한자 표기 차이를 틀림으로 기록
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge
- junho ja/ko 3일째 073.png · `?`  — (문제 없음)
  - 왜: 3일째에도 한자 든 코치 카드(コンビニで働いた…)를 소리대로 따라 말했는데 ✓ 없음 — 한자 없는 카드만 ✓
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge
- junho ja/ko 3일째 080.png · `?`  — (문제 없음)
  - 왜: 한자 없는 카드(どこがおいしいですか？)를 그대로 따라 말했는데 ✓ 없이 카드만 흐려짐
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge
- junho ja/ko 3일째 121.png · `?`  — (문제 없음)
  - 왜: 대화 시뮬레이션: 빈칸 おおさかじょう も みたい です를 맞게 말했는데 "이렇게 들렸어요"가 앞 문장 道頓堀に行きたいです와 억지로 짝지어 おおさか(道頓堀) じ(に) ょ(行き)… 빨간 줄 — 틀린 것처럼 보임
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge
- junho ja/ko 3일째 135.png · `?`  — (문제 없음)
  - 왜: 대화 시뮬레이션 "이렇게 들렸어요": おこのみやき たのしみ(が 빠짐)를 おこのみや(お好み焼)き(が)로 짝지어, が를 빠뜨린 게 아니라 き를 が로 말한 것처럼 표시
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge
- junho ja/ko 3일째 142.png · `?`  — (문제 없음)
  - 왜: 한 줄 전체로: いく(→行って) 틀림을 いく(行)た(って)こやき ~~たこ焼き~~로 짝지어 たこやき를 빠뜨린 것처럼 표시 — 무엇이 틀렸는지 알 수 없음, 까닭 없음
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge
- junho ja/ko 3일째 144.png · `?`  — (문제 없음)
  - 왜: 대화 시뮬레이션 결과 0/4 — 1번째(たんごをべんきょうしました…たべたいです)·2번째(おおさかじょうもみたいです)는 정답과 소리까지 같게 말했는데 모두 틀림. 히라가나/한자 차이나 빈칸만 말한 걸 틀림으로 셈
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge
- layla es/ar 0일째 014.png · `?`  — (문제 없음)
  - 왜: "Compré merluza. Era muy fresco y barato" — merluza는 여성이라 fresca·barata인데 코치 카드가 안 뜸(성 일치 실수를 놓침), 앞 카드도 따라 말 안 했는데 사라짐
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge
- layla es/ar 0일째 018.png · `?`  — (문제 없음)
  - 왜: 따라 말하기를 반쯤 틀리게 했더니 "한 번 더"가 아니라 새 카드로 바뀜 — 새 카드는 "La película última"를 그대로 둠(바로 앞 카드는 La última película로 고쳤음), 두 카드가 서로 다름
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge
- layla es/ar 0일째 040.png · `?`  — (문제 없음)
  - 왜: 끝 화면 고쳐 씀 카드: 맞게 말한 "Prefiero las comedias."와 "No veo una película desde hace mucho tiempo."가 빨간 취소선 — 틀린 말처럼 보임(고친 문장에서 빠졌을 뿐)
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge
- layla es/ar 3일째 069.png · `?`  — (문제 없음)
  - 왜: "Fue un día muy bonita" (día는 남성 → bonito)인데 코치 카드 없음 — 1일째 "merluza… fresco"에 이어 성 일치 실수를 또 놓침
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge
- layla es/ar 3일째 073.png · `?`  — (문제 없음)
  - 왜: 끝 화면 "고쳐 씀 ✓": 22일 영화 문장(última·aburrida) 짝으로 25일 "Mi día está bien… hoy duermo solo cuatro horas"를 ✓로 보여 줌 — 고친 부분과 상관없는 문장이고 duermo(→dormí) 실수가 그대로 남아 있음
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge
- layla es/ar 3일째 095.png · `hw|386842f5-bd79-47e0-a652-cbd2fea63f6c|1` type — Hola, Mateo. Estoy bien, pero cansada. Ayer trabajé de noche en el hospital y hoy solo he dormido cuatro horas. · 답 solo he dormido
  - 왜: "hoy … dormí cuatro horas"는 맞는 과거형인데 틀림 처리 — 현재완료(he dormido)만 정답
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge
- layla es/ar 3일째 104.png · `?`  — (문제 없음)
  - 왜: 대화 시뮬레이션: "Mañana tengo un turno largo. Las enfermeras…"(두 문장으로 나눔)을 "y"가 빠졌다고 표시 — 문장을 나눈 것은 틀린 게 아님(simpáticos→simpáticas 짚은 건 맞음)
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge
- minji en/ko 0일째 015.png · `?`  — (문제 없음)
  - 왜: 코치 카드대로 "Next month I am going on a business trip to Singapore." 따라 말했는데 ✓도 한 번 더도 안 뜨고 카드만 흐려짐 — 맞았는지 알 수 없음(1차 따라 말하기 008도 같음)
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge
- minji en/ko 0일째 034.png · `?`  — (문제 없음)
  - 왜: 대본 3/20: 코치 카드를 따라 "I finished work and I am eating dinner now."라고 말한 차례가 "…" + 왜 막혔는지 보기(막힘)로 남음. 또 자막엔 What are you eating for dinner?였는데 대본엔 What did you make for dinner?
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge
- minji en/ko 3일째 063.png · `?`  — (문제 없음)
  - 왜: 끝 화면 ✎✓ 1: 1일째 "I like that questions"→those 를 3일째 "About one year. I like it. OK, I need to go..."로 고쳐 쓴 것처럼 ✓ — 같은 실수를 다시 쓴 게 아니라 I like만 겹침. 잘못된 성장 표시
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge
- minji en/ko 3일째 068.png · `?`  — (문제 없음)
  - 왜: 대본 2/10: 내가 맞게 말한 "It was busy. I had a long meeting."이 빨간 줄로 그어져 틀린 것처럼 보임 — 고친 문장엔 그 두 문장이 빠졌을 뿐. 1일째 042 세 문장 줄도 같은 모양
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge
- minji en/ko 3일째 096.png · `hw|f9335a18-8cb8-47c1-ace4-9f66a5b4e9d8|2` type — It was busy. I had a long meeting, and I’m preparing a presentation for a business trip to Singapore next week. · 답 preparing a presentation
  - 왜: 빈칸이 짧은 밑줄 하나(자리표시 p…)라 한 낱말 preparing을 썼는데 정답은 세 낱말 preparing a presentation이라 틀림. 빈칸 뒤가 for a business trip이라 preparing만 넣어도 말은 됨(I am preparing for a business trip)
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge
- minji en/ko 3일째 118.png · `?`  — (문제 없음)
  - 왜: "이렇게 들렸어요" 비교가 축약을 안 한 것(It is/I will/is not)까지 노란색+(s)(ll)(isn)(t)로 틀린 것처럼 표시 — 퀴즈에선 why it is good이 맞다고 했는데. 정작 내 실수 why is it(어순)은 "why it s good"처럼 깨져 보여 무엇이 틀렸는지 모름
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge
- minji en/ko 3일째 164.png · `hw|80a5cb77-5746-44ca-9462-69626987e438|4` type — It was six hours, so I was really tired. I hope I’ll have more energy this time and enjoy dinner with the clients. · 답 more energy
  - 왜: "I hope I will have more power this time" — 사람 기운에 power는 어색(콩글리시)한데 "이 답도 맞아요"로 통과. 또 이 문제는 내가 통화에서 안 한 말(more energy, enjoy dinner with the clients)을 지어 넣은 빈칸
  - 고칠 자리: src/lib/curriculum/quiz.ts typedRight·decoys · src/app/api/curriculum/typed-check(open) · server scriptJudge

## 배운 적 없음 (`hard-level`)

- junho ja/ko 0일째 025.png · `?`  — (문제 없음)
  - 왜: 한자 못 읽는 초보에게 고친 줄을 한자(店·言います·言葉·教えて)로 보여 줘서 따라 말하기 어려움
  - 고칠 자리: 그 열쇠의 단계(frames·stageScripts stage) · quiz.ts near()
- junho ja/ko 3일째 070.png · `?`  — (문제 없음)
  - 왜: 코치 카드 고친 줄이 한자(働いた·忙しかった·楽しい) — 한자 못 읽는 초보는 따라 말할 수 없음, 위 줄 빨간 표시도 히라가나→한자 바꿈이 섞여 뒤죽박죽
  - 고칠 자리: 그 열쇠의 단계(frames·stageScripts stage) · quiz.ts near()
- layla es/ar 3일째 123.png · `?`  — (문제 없음)
  - 왜: 대화 시뮬레이션 "한 걸음 더" 빈칸 "Me gusta que ___" 답이 접속법 haya — 통화에 없던 새 문법(A2가 배운 적 없음), 왜 haya인지 설명 없이 노랑만
  - 고칠 자리: 그 열쇠의 단계(frames·stageScripts stage) · quiz.ts near()
- minji en/ko 3일째 106.png · `hw|f9335a18-8cb8-47c1-ace4-9f66a5b4e9d8|5` type — About a year. I like it because I get to understand what customers need and help explain how our products can meet those needs. · 답 meet those needs
  - 왜: 6/6은 내가 통화에서 한 말(About one year. I like it.)을 훨씬 길게 지어낸 문장 — "I get to understand what customers need... how our products can m___"(meet those needs). 통화에서 들은 적 없는 말이고 내 수준보다 어려움
  - 고칠 자리: 그 열쇠의 단계(frames·stageScripts stage) · quiz.ts near()

## 답이 화면에 보임 (`easy-leak`)

- junho ja/ko 3일째 125.png · `?`  — (문제 없음)
  - 왜: 대화 시뮬레이션 3번째: 바로 위 튜터 줄에 「これをください」가 있어 빈칸(これをくださいと言いますか)이 거의 베끼기, 튜터가 이미 답한 걸 다시 묻는 순서
  - 고칠 자리: src/components/studyMap/QuizPlayer.tsx(뜻 줄·예문) · stageScripts.ts quizGloss · FrameLesson 제목 · quiz.ts 재료(pieceTwice)
- minji en/ko 3일째 090.png · `hw|f9335a18-8cb8-47c1-ace4-9f66a5b4e9d8|2` type — It was busy. I had a long meeting, and I’m preparing a presentation for a business trip to Singapore next week. · 답 preparing a presentation
  - 왜: 틀린 곳 고르고 나면 입력칸 자리표시에 정답 첫 글자(u…, 1번은 a…)가 보임 — 게다가 내 통화에서 방금 코치 카드로 본 문장
  - 고칠 자리: src/components/studyMap/QuizPlayer.tsx(뜻 줄·예문) · stageScripts.ts quizGloss · FrameLesson 제목 · quiz.ts 재료(pieceTwice)

## 답이 여럿 (`hard-ambiguous`)

- layla es/ar 3일째 094.png · `hw|386842f5-bd79-47e0-a652-cbd2fea63f6c|1` type — Hola, Mateo. Estoy bien, pero cansada. Ayer trabajé de noche en el hospital y hoy solo he dormido cuatro horas. · 답 solo he dormido
  - 왜: 빈칸 답이 "solo he dormido"(세 낱말)인데 빈칸은 한 칸처럼 보임 — "dormí"(hoy dormí cuatro horas도 맞는 말)를 "خطأ 틀림"으로 채점, solo가 빈칸에 든다는 걸 알 수 없음
  - 고칠 자리: src/lib/curriculum/quiz.ts decoys()
