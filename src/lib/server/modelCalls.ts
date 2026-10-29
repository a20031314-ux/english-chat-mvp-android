/**
 * What each metered route costs in model calls, and the names of the routes
 * that are metered at all.
 *
 * Split out from meterRequest so that a script can read it. The metering
 * function reaches for request objects and the entitlement store through the
 * "@/" alias, which Node cannot resolve when a file under scripts/ is run
 * directly — and a reporting script that hardcoded its own copy of these
 * multipliers would be wrong the first time a route changed shape.
 *
 * Nothing here imports anything, deliberately.
 */

/**
 * Roughly how many model calls one request of each kind sets off, so the counts
 * can be read as spending rather than as clicks.
 *
 * A sentence analysis is the outlier: an overview call plus one per dimension
 * the language profile declares active, which is three or four. The rest ask
 * the model once. Keep these honest when a route's shape changes — they are the
 * multiplier anyone will reach for when turning counts into cost.
 */
export const MODEL_CALLS_PER_REQUEST = {
  // The oldest route in the app and the last one counted, which is why the
  // ledger had a hole exactly where most of the traffic is: chat was counted by
  // the free tier's daily limiter, which answers "how many messages" and not
  // "how much did they cost". One call, or two when a correction rewrote the
  // line enough that the reply had to be written again — that second call is
  // counted on its own below, so the pair says how often it happens.
  chat: 1,
  chatReread: 1,
  // 새 앱 스트림: 답만 쓰는 호출(교정 호출과 나란히, 2026-10-22). 이때는 chatReread가 없다.
  chatReply: 1,
  // A "how do I say this" turn. One call, and the same model.
  howToSay: 1,
  // The same expression opened as a card under a line written in the
  // learner's own language — one call, no chat turn, not a counted chat.
  howToSayCard: 1,
  // 사람 사이 사진 한 장: 자동 검사 한 번(omni-moderation, 무료) + 저장.
  mediaUpload: 1,
  /** 아이콘 하나 올리기: 검사 모델 프레임 1~3장(무료 모델, 호출 수만). */
  iconUpload: 3,
  // 랜덤 영상(창구 Spin) 화면 한 장 검사(omni-moderation, 무료) — 3초에 한 번까지.
  randomFrame: 1,
  // The opening line of a conversation nobody has spoken in yet.
  chatStart: 1,
  // A question about their own progress, answered from what is kept (learner/ask).
  learnerAsk: 1,
  analysisInput: 5,
  analysisElement: 1,
  expressionInsight: 1,
  // 채팅 고친 문장을 확인 모델에 한 번 더(위험한 줄만, 열 때 또는 바로 보기의 뒤에서) — /api/chat/verify.
  chatVerify: 1,
  // A question the learner typed about a part of a sentence. One call, and a
  // second only when the answer came back in the language being learned and
  // had to be asked for again — counted on its own so the pair says how often.
  expressionAsk: 1,
  expressionAskRetry: 1,
  // A one-tap question from the sentence sheet (meaning / form / alternatives).
  expressionAskQuick: 1,
  // A study map drawn from a goal (curriculum/generate.ts). One call, larger
  // than most — it writes the whole map at once.
  curriculumGenerate: 1,
  // 나눠 그리기의 채우기 한 묶음(주제 3개 안팎, 2026-10-23) — 지도 하나에 보통 3묶음.
  curriculumMapFill: 1,
  // 단계 범위 화면 글을 앱 언어로 한 번 옮김(server/stageCopy.ts) — 학습 언어 × 앱 언어마다 한 번, 저장된 뒤엔 0.
  stageCopy: 1,
  // 빈도 단어 카드(server/wordCards.ts) — 50개 묶음 × 앱 언어마다 한 번(만들기 1 + 옮기기 1), 저장된 뒤엔 0.
  wordCards: 2,
  // 단계 학습 줄 읽는 법(server/stageReadings.ts) — 학습 언어 × 단계마다 한 번(줄 60개 묶음 몇 개), 저장된 뒤엔 0.
  stageReadings: 3,
  // One chat sentence read for the constructions in it (learner/classify.ts),
  // after the reply has gone out. Small model, ids in and out.
  learnerObserve: 1,
  // A topic's missions, written once the first time it is practised.
  curriculumMissions: 1,
  // A phrase the learner put on their map from the sentence sheet, written as a task.
  learnerPick: 1,
  // 노트: 처음 보는 표현·단어·문장 묶음을 고정 목차의 주제로(/api/notes/place). 학습 언어별 공유 캐시라 대부분은 안 부름.
  notesPlace: 1,
  // 노트: 튜터가 고친 한 줄을 어느 칸에 넣을지 + 한 줄 설명(server/notebookStore.ts), 답이 나간 뒤.
  notebookFix: 1,
  // 노트: 습득한 표현(장부 배움·숙지) 최대 30개를 틀의 칸에 한 번에(/api/notebook GET 뒤, 하루 6번까지).
  notebookPhrases: 1,
  // 노트: 문장분석 시트 "My에서 찾기" — 궁금한 부분 하나의 칸 + 한 줄 설명(이미 칸이 있으면 안 부름, 하루 40번).
  notebookLocate: 1,
  // One mission answer checked: verdict, correction and the other person's reply.
  missionCheck: 1,
  // A corrected chat or call line read for the kind of mistake it was
  // (curriculum/weakPoints.ts), after the reply. Small model, keys in and out.
  weakRead: 1,
  // A mistake seen twice, written as one mission on the map. Rare by design.
  weakMission: 1,
  vocabGloss: 1,
  learningSpans: 1,
  translate: 1,
  tts: 1,
  // The video routes, which were the remaining gap. An import point is charged
  // once when a video is prepared, and then every twenty seconds of watching is
  // its own window costing three passes — so the charge lands on the small half
  // and the rest went by uncounted. Counting it does not charge for it; it makes
  // the shape of the spending visible before anyone prices against it.
  videoPrepare: 3,
  videoWindow: 3,
  // Two calls a batch: the meaning of each line, then the line in the UI
  // language (glossEnglishLines). Only builds before 2.67 send these.
  videoGloss: 2,
  videoAnalyze: 1,
  // Answered from translations kept from an earlier viewer of the same video
  // (server/subtitleGlossStore.ts). No model call; counted so the ratio to
  // videoGloss / translate says how much of video translation the store
  // carries.
  videoGlossKept: 0,
  translateKept: 0,
  // The roleplay's only model call. Its tutor speaks from files, so a scripted
  // scene costs one transcription per learner turn and nothing else — which is
  // the claim the whole mode rests on, and therefore the one worth counting.
  roleplayListen: 1,
  // A spoken line in a person-to-person room (test feature): one
  // transcription per utterance, by whoever spoke it.
  roomListen: 1,
  // 방 내 줄 교정(2026-10-22): 믿을 만하게 받아쓴 내 말 한 마디를 고치는 호출 하나(/api/rooms/fix).
  roomFix: 1,
  // 그 교정 전에, 확신이 어중간한 조각만 다른 받아쓰기 모델로 한 번 더(두 번째 의견, rooms/agreement.ts).
  roomFixListen: 1,
  // 방 라이어 게임(2026-10-23): 한 판 시작에 제시어 고르기 한 번, 라이어가 답했는데 글자로 안 맞으면 판정 한 번.
  roomGameWord: 1,
  roomGameJudge: 1,
  // 마피아(사회자 AI): 시작에 배경 이야기 한 번.
  roomGameStory: 1,
  // A correction the scenario did not have written. Rarer than listening by
  // design — most misses at a turn are the same miss and were recorded — so a
  // count that climbs towards the listen count means the scripts are missing
  // the trouble they were supposed to anticipate.
  roleplayCorrect: 1,
  // The director: a turn the script could not take. What the watching tutor
  // costs is this count, plus a tts for each line it wrote rather than picked
  // from the recordings — so its ratio to roleplayListen is how much of the
  // conversation the script is actually carrying.
  roleplayTurn: 1,
  // Folding lines the tutor no longer reads verbatim into its notes. Once per
  // ten lines past the thirtieth, so only long conversations make any.
  roleplayContext: 1,
  // Looking back at a turn the learner got stuck on. Only ever from a button
  // they pressed, so this counts the ones who wanted to know why.
  roleplayReview: 1,
  // One attempt at saying a line the review handed them. Counts how many go on
  // from reading the explanation to using it, which is the harder step.
  roleplayPractice: 1,
  // 대본 줄을 떠올려(첫 글자만·가리기)·내 말로·문장구조로 말한 한 번의 판단(뜻끼리 맞춤, Sonnet — 2026-10-29).
  scriptJudge: 1,
  // 그 판단이 "틀림"일 때만 더 좋은 모델로 한 번 더(2026-10-29) — scriptJudge 대비 비율이 Haiku가 틀림이라 한 몫.
  scriptRecheck: 1,
  // 대본 고르기 오답 — 대본마다 한 번(공유 저장), 사용자 수와 상관없음. 만들기 + 확인 = 2.
  scriptChoices: 2,
  // Not model calls — both are zero — but counted here so the ledger can answer
  // what the bank is for. A turn where the character reached for a line that
  // already exists costs no synthesis and plays a read somebody checked; one
  // where it invented a line costs both. Their ratio is the bank's hit rate,
  // and it is the number that says whether growing the bank did anything.
  roleplayBankLine: 0,
  roleplayInventedLine: 0,
  // A turn that came back as two lines rather than one: a reaction from the
  // bank and the question after it, both played from their own recordings.
  // Counted because it cannot be seen from outside — two clips in a row sound
  // like one turn, and the first person to use the build could not tell whether
  // it had ever happened. Its ratio to roleplayTurn is how often the bank
  // carries a whole turn rather than half of one.
  roleplaySplitTurn: 0,
  // A turn whose opening reaction was spoken in the bank's words rather than
  // synthesised as written (roleplay/reactions.ts). Its ratio to
  // roleplayInventedLine is how much of what the character writes the
  // reaction table answers for.
  roleplayReactionLine: 0,
  // The first director call of a conversation, so per-session figures have a
  // denominator. Stateless: it is the turn that reports no directed turns yet.
  roleplaySession: 0,
  // Splitting a sentence into expression units for the sentence sheet, and a
  // vocabulary search. Both called the model without being counted, so the
  // cost report could not see them.
  expressionUnits: 1,
  vocabSearch: 1,
  // Finding a video or reading by topic: the search intent, the query in the
  // learning language, and the ranking of candidates — up to three calls.
  // Uncounted until 2026-10-18 (scripts/cost-coverage.mjs found it).
  contentDiscovery: 3,
} as const;

export type MeteredOp = keyof typeof MODEL_CALLS_PER_REQUEST;
