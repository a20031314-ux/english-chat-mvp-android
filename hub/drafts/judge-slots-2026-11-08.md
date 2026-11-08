# 맞나 틀리나 — 언어별 문법 칸 나누기 (2026-11-08)

> 사용자 "언어별로 변형 가능한 요소, 문법적으로 중요한 요소가 다 다르잖아. 다 같이 적용할 시 특정 언어는 학습이 많이 축소될 텐데" → "만들고 데이터 규모가 얼마인지".
> 단위 = 그 학습 언어의 문법 사다리 칸(`curriculum` 단계 문법, `talkTags.ts grammarList`, 열쇠 `g|단계:번호`). 칸마다 틀린 꼴을 어떻게 만들지 셋 중 하나. 나눈 것은 Claude 판단(원어민 확인 전) — 사용자가 고침.

- **R 규칙** — 늘 틀리게 바꾸는 법이 분명(받침 조사, 관사 성, 주어-동사 일치, 시간 말 + 시제, 조동사 뒤 꼴, 맞춤법). 사전 예문(`word-sentences/<언어>.json`)에서 바로 만듦, 새 데이터 없음.
- **P 짝 데이터** — 틀린 꼴은 분명하지만 규칙으로 못 만듦(활용 선택, 구문 짝, 격·상, 양사). 칸마다 "원문 · 틀린 꼴(바꾼 곳 한 군데)" 짝을 Cursor가 만들고 다른 세션이 "늘 틀림"만 남김.
- **N 안 맞음** — 여러 꼴이 다 맞거나 말투·뉘앙스 칸(반말, 완곡, 담화 표지, 관용어). 맞나 틀리나 대신 쓰기·고르기.
- 답한 뒤 까닭 = 그 칸의 문법 카드 팝업(📐, `openLesson g|…`) → 짝마다 앱 언어 까닭을 쓰지 않아도 됨.

## 합계

| 학습 언어 | 칸 | R 규칙 | P 짝 데이터 | N 안 맞음 | P 중 1~2단계 |
|---|---|---|---|---|---|
| 한국어 ko | 40 | 14 | 23 | 3 | 5 |
| 일본어 ja | 40 | 10 | 28 | 2 | 8 |
| 중국어 zh | 35 | 5 | 20 | 10 | 8 |
| 태국어 th | 40 | 2 | 26 | 12 | 12 |
| 베트남어 vi | 36 | 0 | 19 | 17 | 11 |
| 인도네시아어 id | 36 | 6 | 13 | 17 | 6 |
| 힌디어 hi | 36 | 5 | 19 | 12 | 8 |
| 아랍어 ar | 37 | 6 | 18 | 13 | 9 |
| 러시아어 ru | 37 | 7 | 21 | 9 | 8 |
| 스페인어 es | 37 | 12 | 18 | 7 | 7 |
| 프랑스어 fr | 37 | 12 | 16 | 9 | 5 |
| 이탈리아어 it | 38 | 13 | 18 | 7 | 3 |
| 포르투갈어 pt | 36 | 11 | 17 | 8 | 7 |
| 영어 en | 40 | 12 | 21 | 7 | 4 |
| **합** | **525** | **115** | **277** | **133** | 101 |

## 데이터 규모

- **짝 데이터:** P 277칸 × 12짝 = **약 3,300짝**(언어마다 160~340짝). 한 짝 = 학습 언어 원문 한 줄 + 바꾼 곳(시작·끝·틀린 말) + 열쇠, 약 150~200바이트 → 전체 약 0.6MB(언어마다 약 45KB). 앱 언어마다 다르게 만들 것 없음(까닭은 문법 카드).
- **검사:** 만든 세션과 따로 판정 세션이 3,300짝을 한 번씩(늘 틀림인가 · 다른 뜻으로 읽으면 맞지 않나 · 학습자가 하는 실수인가). 검사기 스크립트가 원문 복원·바꾼 곳 한 군데·열쇠 존재를 기계로 확인.
- **R 칸:** 새 데이터 없음(사전 예문 약 5,000~14,000줄). 예문에 그 문법이 드문 칸은 나중에 짝 5개씩 보탬(최대 115 × 5 ≈ 600짝).
- **문법 카드:** 525칸 × 앱 언어 14 = 최대 7,350장, 지금처럼 처음 열 때 만들어 모두가 같이 씀(이미 있는 길). 미리 채우려면 고정 수업처럼 Cursor로.
- **한 학습자가 보는 양:** 단계마다 칸 약 8개 → 1단계에서 P 칸 짝만 약 50~100문제 + R 칸은 사전 예문만큼.

## 한국어 (ko)

- **R 규칙 14:** 1:0 N이에요/예요 (to be) · 1:1 N이/가 아니에요 (not to be) · 1:2 Topic particle 은/는 · 1:3 Present tense -아요/어요 · 1:4 Object particle 을/를 · 1:7 Negation with 안 · 2:0 Past tense -았/었어요 · 2:1 Future -(으)ㄹ 거예요 · 2:3 -(으)ㄹ 수 있어요/없어요 (can, cannot) · 2:5 -(으)러 가요 (go to do) · 2:6 -(으)ㄹ까요? (shall we) · 3:1 -아서/어서 (because, then) · 3:3 -(으)면 (if, when) · 3:4 -(으)ㄹ게요 (I will, promise)
- **P 짝 데이터 23:** 1:5 있어요/없어요 (have, there is) · 1:6 N 주세요 (please give me) · 2:2 -고 싶어요 (want to) · 2:4 -고 (and then) · 2:7 Place particles 에 and 에서 · 3:0 -(으)니까 (because, so — with suggestions) · 3:2 -는데 (background, contrast) · 3:5 -(으)ㄴ 적이 있다 (have done before) · 3:6 -기 때문에 (because of) · 4:0 Honorific -(으)시- with 께서, 드리다, 여쭤보다 · 4:1 Reported speech -대요/-래요 · 4:2 -더라고요 (what I noticed) · 4:3 -잖아요 (you know) · 4:5 -(으)ㄹ 뻔했다 (almost) · 4:6 -는 바람에 (because of an unexpected event) · 4:7 -(으)ㄹ 텐데 (probably, I'm concerned that) · 5:0 -다 보니 (as I kept doing, it turned out) · 5:1 -는 셈이다 (it amounts to) · 5:2 -(으)ㄹ 걸 그랬다 (I should have) · 5:4 -(으)ㄴ/는 척하다 (pretend) · 5:5 -(으)ㄹ 만하다 (it's understandable, worth it) · 5:6 -더니 (contrast or result from what you saw) · 5:7 -(으)ㄹ까 봐 (in case, worried that)
- **N 안 맞음 3:** 3:7 Casual speech 반말 -아/어 · 4:4 -거든요 (giving the reason) · 5:3 -기는 하는데 (it is true, but)

## 일본어 (ja)

- **R 규칙 10:** 1:2 Polite verbs ～ます / ～ません · 2:0 Past ～ました / ～ませんでした · 2:1 ～てください (please do ～) · 2:2 ～ている (ongoing action or state) · 2:3 ～たい (want to) · 2:4 ～てもいいですか (may I ～?) · 2:6 ～たことがあります (have done before) · 3:0 Casual plain forms (だ, ～ない, ～た) · 3:2 Conditionals ～たら / ～ば · 3:4 Potential form ～られる / ～える
- **P 짝 데이터 28:** 1:0 A は B です (A is B) · 1:1 Questions with か · 1:3 の for possession and belonging · 1:5 ～をください (please give me ～) · 1:6 Place に / へ 行きます (go to) · 1:7 あります / います (there is) · 2:5 ～ませんか / ～ましょう (invitations) · 2:7 ～から (because) · 3:1 Explaining with ～んです / ～んだ · 3:3 ～と思う / ～かもしれない (opinion, maybe) · 3:5 ～ようにする (make a point of doing) · 3:6 ～そう (looks like) · 4:0 尊敬語 (respectful verbs: いらっしゃる, おっしゃる) · 4:1 謙譲語 (humble verbs: 伺う, 申す, 参る) · 4:2 ～させていただく · 4:3 Passive ～られる (including suffering passive) · 4:4 Causative ～させる / ～させてください · 4:5 ～ことになる / ～ことにする · 4:6 ～わけではない (it's not that ～) · 4:7 ～ば～ほど (the more ～, the more ～) · 5:0 ～わけにはいかない (can't very well ～) · 5:1 ～ざるを得ない (have no choice but to) · 5:2 ～とはいえ (even so, that said) · 5:3 ～かねない (could well lead to) · 5:4 ～ものの (although) · 5:5 ～からこそ (precisely because) · 5:6 ～に越したことはない (it's best to) · 5:7 ～ないことには (unless ～)
- **N 안 맞음 2:** 1:4 これ・それ・あれ・どれ · 3:7 Sentence-final よ and ね

## 중국어 (zh)

- **R 규칙 5:** 1:1 Yes/no questions with 吗 · 1:5 有 / 没有 (have, there is) · 2:2 Time words before the verb · 2:3 在 + place + verb · 3:1 Comparisons with 比 / 没有…那么
- **P 짝 데이터 20:** 1:0 A 是 B (A is B) · 1:2 Negation with 不 · 1:3 Question words 什么 / 哪儿 / 谁 · 1:4 Measure word 个 with 这 / 那 · 1:6 Adjectives with 很 · 2:0 了 for completed actions · 2:5 Choice questions with 还是 · 2:6 坐 / 打车 for transport · 3:0 过 for past experience · 3:2 Result complements (听懂, 做完) · 3:3 Degree complements with 得 · 3:4 Ongoing actions with 正在…呢 · 3:6 把 to say what is done to something · 3:7 Potential complements (来得及, 听不清) · 4:2 Passive with 被 · 4:3 只要…就… / 只有…才… · 4:5 Directional complements in abstract use (说下去, 想起来) · 4:6 既然…就… (since… then…) · 5:1 Concession with 即使…也… / 哪怕…也… · 5:2 Emphasis with 连…都… / 是…的
- **N 안 맞음 10:** 2:1 想 / 要 (want to) · 2:4 可以 / 能 (may, can) · 3:5 因为…所以… (because… so…) · 4:0 虽然…但是… (although… but…) · 4:1 不但…而且… (not only… but also…) · 4:4 Rhetorical questions with 难道…吗 · 5:0 Formal connectors 鉴于 / 从而 / 以便 · 5:3 Softening with 恐怕 / 未必 / 不妨 · 5:4 Four-character idioms as sentence parts · 5:5 Verb reduplication for a casual, light tone

## 태국어 (th)

- **R 규칙 2:** 1:2 Polite particles ครับ / ค่ะ / คะ · 1:4 Negation with ไม่
- **P 짝 데이터 26:** 1:0 เป็น to link a person and a role (A is B) · 1:3 Yes/no questions with ไหม · 1:5 Question words at the end: อะไร / ที่ไหน · 1:6 อยู่ for where something is · 1:7 ขอ + thing (may I have) · 2:0 แล้ว for something already done · 2:1 จะ for the future · 2:2 กำลัง…อยู่ for an action in progress · 2:3 อยาก + verb (want to) · 2:4 ช่วย…หน่อย for requests · 2:5 …กันไหม for invitations · 2:6 เคย for past experience · 3:1 หลังจากที่ / ก่อนที่ to order events · 3:2 ที่ to describe a noun (relative clause) · 3:4 Comparison with กว่า / ที่สุด · 3:5 Verb + ได้ for ability · 3:6 ให้ to have someone do something · 3:7 …มา…แล้ว for how long so far · 4:1 ถูก for an unpleasant passive · 4:2 โดย for the way something is done · 4:3 จนกว่า (until) · 4:5 ไม่ว่า…ก็… (no matter) · 4:6 เท่าที่ (as far as) · 4:7 ยิ่ง…ยิ่ง… (the more … the more) · 5:3 …เสียจน… (so … that …) · 5:6 Abstract nouns with การ / ความ
- **N 안 맞음 12:** 1:1 ชื่อ for names · 2:7 เพราะ (because) · 3:0 ถ้า…ก็… (if … then …) · 3:3 คิดว่า for opinions · 4:0 ถึงแม้ว่า…แต่… (although) · 4:4 Degrees of certainty: คง / น่าจะ / อาจจะ · 5:0 Formal register: ดิฉัน / ท่าน / ขอบพระคุณ · 5:1 ถือว่า / นับว่า to evaluate · 5:2 Softeners ออกจะ / ค่อนข้าง · 5:4 Idioms (สำนวน) in everyday talk · 5:5 Attitude particles หรอก / ล่ะ / สิ / นะ · 5:7 Discourse markers อันที่จริง / ทั้งนี้ทั้งนั้น

## 베트남어 (vi)

- **R 규칙 0:** 
- **P 짝 데이터 19:** 1:0 A là B (A is B) · 1:2 Yes/no questions with … không? · 1:3 Negation with không · 1:5 Classifiers cái, con, quả with này / kia · 1:6 Có (to have / there is) · 1:7 Ở + place (to be at, to live in) · 2:0 Past with đã and finished with rồi · 2:1 Future with sẽ · 2:2 Ongoing action with đang · 2:4 Polite requests with cho + person / làm ơn · 2:6 Have you … yet? — … chưa? · 3:0 Comparison: hơn, bằng, nhất · 3:1 Passive with bị (bad) and được (good) · 3:4 Sequence: trước khi, sau khi, rồi · 3:6 Just happened / about to: vừa, sắp · 4:1 Even if: dù … vẫn … · 4:2 Purpose: để … / nhằm … · 4:3 The more …, the more …: càng … càng … · 5:5 Reduplication for nuance: xinh xinh, đo đỏ, nhè nhẹ
- **N 안 맞음 17:** 1:1 Pronouns by age and relation: anh, chị, em, bạn · 1:4 Question words gì, đâu, bao nhiêu · 2:3 Want and like: muốn, thích · 2:5 Suggestions with … nhé / … đi · 2:7 Because … so …: vì … nên … · 3:2 If … then …: nếu … thì … · 3:3 Although …: tuy … nhưng … · 3:5 Reported thought: nghĩ là, nói là · 4:0 Not only … but also: không những … mà còn … · 4:4 Softening with hơi, khá, cũng · 4:5 Topic fronting with thì · 4:6 Formal connectors: do đó, tuy nhiên, ngoài ra · 5:0 Emphatic chính / ngay / đến cả · 5:1 Sentence-final particles for attitude: chứ, mà, cơ, đấy · 5:2 Rhetorical questions: sao lại …, có phải … đâu · 5:3 Formal written style: nhằm, đối với, trong bối cảnh · 5:4 Concession for tact: không phải là … nhưng …

## 인도네시아어 (id)

- **R 규칙 6:** 1:2 Possession: noun + owner · 1:5 Negation: bukan for nouns, tidak for verbs and adjectives · 2:0 Time words for past and future: sudah, sedang, akan, belum · 2:1 Verbs with me- prefix · 3:0 Passive di- verbs · 5:3 Reduplication for variety and intensity
- **P 짝 데이터 13:** 1:0 No verb 'to be': Saya + noun · 1:6 Place with di / ke / dari · 1:7 Ada (there is / have) · 2:2 Ber- verbs (do, have, be in a state) · 2:4 Boleh (may) and tolong (please do) · 2:7 Pernah (have ever done) · 3:1 Ter- for accidental or 'most' · 3:2 Comparisons lebih … daripada, paling · 3:3 -kan and -i verb suffixes · 3:4 Yang to describe and pick out · 4:0 Per-/-an and ke-/-an nouns · 4:1 Memper- verbs (make more) · 4:4 Seharusnya (should have)
- **N 안 맞음 17:** 1:1 Pronouns saya, Anda, kamu, dia · 1:3 Ini / itu (this / that) · 1:4 Question words apa, siapa, di mana, berapa · 2:3 Mau / ingin (want to) · 2:5 Yuk / ayo (let's) · 2:6 Karena (because) · 3:5 Kalau (if / when) and waktu (when, past) · 3:6 Menurut saya (in my opinion) · 4:2 Concession: meskipun, walaupun · 4:3 Purpose and result: agar, supaya, sehingga · 4:5 Reported speech with bahwa · 4:6 Softening with agak, kurang, mungkin · 5:0 Formal written forms: adalah, merupakan, ialah · 5:1 Jakarta slang verbs with -in and ng- · 5:2 Particles kok, sih, deh, dong, kan · 5:4 Indirect refusals with sepertinya, agak sulit · 5:5 Ellipsis and topic-first sentences in speech

## 힌디어 (hi)

- **R 규칙 5:** 1:0 होना: मैं ... हूँ / आप ... हैं (to be) · 1:6 चाहिए (I need / I want) · 2:2 Future: -ऊँगा / -ऊँगी · 2:4 को with पसंद है (I like) · 3:0 Ergative ने with transitive past
- **P 짝 데이터 19:** 1:2 Possessives मेरा / मेरी / मेरे · 1:4 Postpositions में / पर / से · 1:7 Polite requests with आप and -इए · 2:0 Habitual present: करता हूँ / करती हूँ · 2:1 Present continuous: रहा हूँ / रही हूँ · 2:3 Simple past of intransitive verbs: गया / गई · 2:5 Compound postpositions: के पास / के बाद / से पहले · 2:6 Telling the time with बजे · 3:1 सकना (can / be able to) · 3:2 चाहिए with infinitive (should) · 3:3 Past continuous: रहा था / रही थी · 3:6 Compound verbs with लेना / देना / जाना · 4:0 Counterfactual: अगर ... होता तो ... होता · 4:1 Subjunctive for suggestions: ... कि हम ... करें · 4:2 Passive with जाना · 4:4 Perfect participle: -कर (having done) · 4:5 Presumptive: होगा (must be / probably) · 5:0 Honorific registers: तू / तुम / आप and matching verbs · 5:3 Continuative -ते रहना / -ता जाना
- **N 안 맞음 12:** 1:1 Yes/no questions with क्या · 1:3 यह / वह (this / that) · 1:5 Question words कहाँ / क्या / कौन / कितना · 3:4 Conditional अगर ... तो · 3:5 Reported thought with कि · 4:3 Relative clauses: जो ... वह · 4:6 Contrast with जबकि / फिर भी · 5:1 Formal (शुद्ध) vs everyday vocabulary · 5:2 Compound verbs for nuance: बैठना / पड़ना / डालना · 5:4 Emphatic particles ही / भी / तो · 5:5 Softening with ज़रा / शायद / -इएगा · 5:6 Echo words and reduplication: चाय-वाय, धीरे-धीरे

## 아랍어 (ar)

- **R 규칙 6:** 2:0 Past tense of regular verbs (ذهبتُ، شربتُ) · 2:1 Present tense prefixes أ، ت، ي، ن · 2:2 Future with سـ / سوف · 2:3 Negation: لا (present), لم (past), لن (future) · 2:6 The idafa construction (بيت صديقي) · 5:0 Emphasis with إنّ and لقد
- **P 짝 데이터 18:** 1:0 Nominal sentence without 'is' (أنا طالب) · 1:1 Personal pronouns أنا، أنتَ، أنتِ، هو، هي · 1:2 Masculine and feminine with ة · 1:3 Possessive endings ـي، ـك (my, your) · 1:5 هذا / هذه (this, masculine / feminine) · 1:6 عندي (I have) · 1:7 أريد + noun (I want) · 2:4 أحب + verbal noun (I like doing) · 2:5 ممكن + verb (could I / could you) · 3:0 كان + present verb (used to / was doing) · 3:1 Comparative أفعل من (bigger than) · 3:2 Relative pronouns الذي / التي · 3:3 أن + subjunctive after يجب، أريد، أستطيع · 4:0 Passive voice (تم + verbal noun, يُقال) · 4:1 Hypothetical لو ... لـ (if ... would) · 4:3 Verbal nouns as subjects (التأخير، العمل عن بعد) · 4:4 كلما (the more ..., whenever) · 5:1 Exception with إلا and غير
- **N 안 맞음 13:** 1:4 Question words ما، من، أين، كم · 2:7 لأن (because) · 3:4 Conditional إذا (if) · 3:5 Sequencing: أولا، ثم، بعد ذلك، في النهاية · 3:6 Opinion: أظن أن / في رأيي · 4:2 رغم أن / مع أن (although) · 4:5 Softening with قد and ربما · 4:6 Linking ideas: بالإضافة إلى، أما ... فـ · 5:2 Cognate object for intensity (مفعول مطلق) · 5:3 Formal wishes and prayers (رحمه الله، بارك الله فيك) · 5:4 Hedging and distancing (يبدو أن، لا يخفى على أحد) · 5:5 Rhetorical questions (أليس كذلك؟، ومن لا يحب ...؟) · 5:6 Mixing registers on purpose for effect

## 러시아어 (ru)

- **R 규칙 7:** 1:0 No "to be" in the present: Я студент · 1:1 Меня зовут… (my name is…) · 1:3 Noun gender: он, она, оно and мой, моя, моё · 1:4 Present tense of -ать verbs (я работаю, ты работаешь) · 2:0 Past tense by gender (ходил / ходила) · 3:1 Dative for feelings and opinions (мне кажется, мне нравится) · 3:5 Надо / нужно (have to)
- **P 짝 데이터 21:** 1:5 У меня есть (I have) · 1:6 Можно…? (may I / can I have…?) · 2:1 Future with буду + infinitive · 2:2 Polite requests with the imperative (покажите, скажите) · 2:3 Хочу + infinitive (I want to) · 2:4 в / на + place: where something is · 2:5 Going somewhere: идти / ехать в + accusative · 2:6 Давай(те) + verb (let's) · 3:0 Aspect in the past: process vs result (читал / прочитал) · 3:2 Conditional with бы · 3:3 Relative clauses with который · 3:4 Motion verbs with prefixes (пришёл, ушёл, зашёл) · 3:6 Чтобы (in order to) · 3:7 Reflexive verbs in -ся · 4:0 Active participles (сидящий, работавший) · 4:1 Verbal adverbs (вернувшись, читая) · 4:2 Passive with short participles (было принято) · 4:4 Indirect questions with ли · 4:5 Comparatives with гораздо / намного · 4:6 Чем…, тем… (the more…, the more…) · 5:3 Impersonal "can't seem to" (мне не спится)
- **N 안 맞음 9:** 1:2 Questions with question words and rising intonation · 2:7 Потому что (because) · 4:3 Concession: хотя, несмотря на · 5:0 Word order for emphasis · 5:1 Particles же and ведь · 5:2 Softening with -ка · 5:4 Wishes with хорошо бы / вот бы · 5:5 Official style: в связи с, в целях, осуществлять · 5:6 Diminutives for warmth (чаёк, минутка)

## 스페인어 (es)

- **R 규칙 12:** 1:2 Present tense of regular -ar verbs · 1:3 Questions with ¿…? and question words · 1:4 Gender and number: el/la, un/una · 1:6 hay (there is / there are) · 1:7 tener for age and having · 2:0 Preterite of regular verbs (what you did) · 2:2 ir a + infinitive (future plans) · 2:3 gustar and encantar · 2:5 tener que + infinitive (have to) · 3:6 Double object pronouns: se lo, me la · 4:1 si + imperfect subjunctive + conditional · 4:4 Subjunctive in time clauses: cuando + subjunctive
- **P 짝 데이터 18:** 1:0 ser for name, origin and job · 1:1 llamarse (my name is) · 1:5 estar for location · 2:1 Common irregular preterites: fui, hice, tuve · 2:4 Stem-changing verbs: querer, poder, preferir · 2:6 doler (it hurts) · 2:7 Object pronouns lo, la, los, las · 3:0 Preterite vs imperfect (events vs background) · 3:1 Present perfect (have you ever…) · 3:2 Reflexive verbs in daily routines · 3:3 Opinions: creo que / no creo que + subjunctive · 3:5 Comparisons: más/menos… que, tan… como · 4:0 Present subjunctive after wishes and feelings · 4:3 Reported speech: dijo que… · 4:5 Passive se and impersonal se · 5:0 Pluperfect subjunctive for regrets (si hubiera…) · 5:3 Subjunctive with indefinite antecedents · 5:4 Formal register: usted, le agradecería que…
- **N 안 맞음 7:** 3:4 Conditional for polite requests (podría, me gustaría) · 4:2 Concessions: aunque + indicative or subjunctive · 4:6 Connectors for arguing: por un lado, en cambio, por lo tanto · 5:1 Softening with the imperfect and conditional (quería, diría) · 5:2 Emphatic structures: lo que…, es… quien · 5:5 Diminutives and augmentatives for tone · 5:6 Discourse markers: o sea, es decir, en definitiva

## 프랑스어 (fr)

- **R 규칙 12:** 1:2 Articles un / une / le / la / les · 1:3 Negation ne … pas · 1:4 Present tense of -er verbs · 2:0 Passé composé with avoir · 2:1 Passé composé with être (aller, venir, partir) · 2:3 pouvoir / vouloir + infinitive · 2:5 Object pronouns le / la / les · 2:7 on for 'we' in everyday speech · 3:3 Simple future · 4:0 Subjunctive after il faut que / je veux que · 4:2 si + imparfait, conditional (hypothesis) · 5:3 Concession: bien que, quoique, avoir beau
- **P 짝 데이터 16:** 1:0 être and s'appeler to introduce yourself · 1:1 Questions with est-ce que and rising intonation · 1:5 il y a (there is / there are) · 2:2 Near future aller + infinitive · 2:4 Reflexive verbs in daily routine · 3:0 Imparfait vs passé composé · 3:1 Pronouns y and en · 3:2 Relative pronouns qui / que / où · 3:6 Opinion with je pense que / je trouve que · 4:1 Subjunctive after emotions and doubt · 4:3 Plus-que-parfait for an earlier past · 4:5 Double object pronouns · 4:6 Gerund en + -ant · 5:0 Past conditional for regrets and reproaches · 5:1 Past subjunctive · 5:4 Passive and impersonal structures in formal speech
- **N 안 맞음 9:** 1:6 Polite request je voudrais · 1:7 Question words où / combien / comment · 2:6 parce que (because) · 3:4 Present conditional for polite requests · 3:5 Casual speech: dropping ne · 4:4 Connectors of contrast: pourtant, alors que, en revanche · 5:2 Cleft sentences c'est … qui / ce que … c'est · 5:5 Recognizing the passé simple in written stories · 5:6 Nuanced hedging with conditional

## 이탈리아어 (it)

- **R 규칙 13:** 1:0 essere: io sono, tu sei, Lei è · 1:2 Articles il / la / un / una · 1:3 Regular -are verbs in the present · 1:4 avere (to have) and c'è / ci sono · 1:6 Negation with non · 2:0 Passato prossimo with avere · 2:1 Passato prossimo with essere · 2:3 piacere: mi piace / mi piacciono · 2:5 posso / puoi + infinitive (permission, requests) · 2:7 Prepositions with articles (al, alla, nel) · 3:7 Informal imperative with tu · 4:1 Hypothetical se + imperfect subjunctive + conditional · 4:4 Connectors: benché, a meno che, purché
- **P 짝 데이터 18:** 1:1 Introducing yourself with chiamarsi · 2:2 Reflexive verbs in daily routines · 2:4 stare + gerund (ongoing action) · 3:0 Imperfetto for background and habits · 3:1 Imperfetto vs passato prossimo · 3:2 Simple future (and guessing) · 3:3 Direct and indirect object pronouns · 3:4 Pronouns ci and ne · 3:6 Opinions with penso che + subjunctive · 4:0 Present and past subjunctive after verbs of doubt and wish · 4:2 Past conditional (would have) · 4:3 Reported speech with tense changes · 4:5 Passive with venire and si passivante · 4:6 Relative pronouns cui and il quale · 5:0 Mixed conditionals (past condition, present result) · 5:1 Subjunctive in relative and concessive clauses · 5:2 Pronominal verbs: farcela, prendersela, cavarsela · 5:4 Gerund and past participle clauses
- **N 안 맞음 7:** 1:5 Question words: dove, quanto, che cosa, come · 1:7 Vorrei (I would like) to ask politely · 2:6 Near future with the present tense · 3:5 Present conditional for polite requests · 5:3 Conditional for hearsay and distancing · 5:5 Softening with the imperfect: volevo chiederle · 5:6 Emphatic word order and dislocation

## 포르투갈어 (pt)

- **R 규칙 11:** 1:2 Articles o / a and noun gender · 1:3 Present tense of -ar verbs · 1:6 ter (to have) · 1:7 não before the verb · 2:0 Simple past of regular verbs (pretérito perfeito) · 2:2 ir + infinitive for plans · 2:4 gostar de + noun or verb · 3:5 a gente for nós (we) · 4:0 Past subjunctive + conditional (if I had...) · 4:2 embora + subjunctive (although) · 5:1 Subjunctive after caso, a não ser que, contanto que
- **P 짝 데이터 17:** 1:0 ser for identity and origin · 1:1 estar for how you are and where things are · 1:5 querer + noun (I want) · 2:1 Irregular past: fui, fiz, tive · 2:3 estar + gerund (-ndo) for what is happening now · 2:5 Comparisons with mais ... do que · 2:6 faz / há + time (for, ago) · 3:0 Imperfect for background and habits (imperfeito) · 3:1 Imperfect vs simple past in one story · 3:2 Present subjunctive after espero que, é importante que · 3:6 Relative que and onde · 4:1 Future subjunctive after quando, se, assim que · 4:3 Personal infinitive · 4:4 Present perfect for repeated recent actions (tenho feito) · 4:5 Reported speech · 4:6 Impersonal se · 5:0 Pluperfect (tinha feito)
- **N 안 맞음 8:** 1:4 Questions with onde, quanto, como, o que · 3:3 Conditional for polite requests (poderia, seria) · 3:4 Spoken object pronouns te, me, lhe before the verb · 5:2 Diminutives to soften a request · 5:3 Cleft sentences (o que ... é) · 5:4 Formal written register · 5:5 Regional tu, often with the você verb form in speech · 5:6 Discourse markers pelo contrário, aliás, inclusive

## 영어 (en)

- **R 규칙 12:** 1:0 be: am / is / are · 1:1 Present simple and he/she -s · 1:2 a / an / the · 1:3 Plural nouns · 1:4 Questions and negatives with do · 1:6 can for ability and requests · 2:0 Past simple: regular and irregular · 2:1 Present continuous for now · 2:3 Comparatives and superlatives · 3:0 Present perfect for experience and unfinished time · 3:2 First conditional · 3:3 should / have to / must
- **P 짝 데이터 21:** 1:5 in / on / at for place and time · 2:4 much / many / some / any · 2:5 Pronouns and possessives · 2:7 Frequency adverbs and word order · 3:1 Past continuous for background · 3:4 Gerunds and infinitives · 3:5 Relative clauses · 3:6 Passive voice · 3:7 so / such … that · 3:8 Word form: noun, adjective, adverb · 3:9 Phrasal verbs · 3:10 Reported speech · 4:0 Second conditional · 4:1 Third conditional · 4:2 Past perfect · 4:3 must / might / can't have for guesses · 4:4 wish and should have · 4:5 used to / be used to / get used to · 4:7 Collocations · 5:0 Mixed conditionals · 5:2 Participle clauses
- **N 안 맞음 7:** 2:2 going to / will / present continuous for plans · 2:6 Linking with because, so, but · 4:6 Discourse markers · 5:1 Inversion and cleft sentences for emphasis · 5:3 Hedging and softening · 5:4 Concession: although, even so, admittedly · 5:5 Nominalisation for a more formal tone
