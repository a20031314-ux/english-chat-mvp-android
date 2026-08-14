export type SubtitleNaturalizationCase = {
  id: string;
  category: string;
  previous?: string[];
  original: string;
  next?: string[];
  /** Typical stiff / calque output from the old single-pass style. */
  oldTranslation: string;
  /** Target direction for the new naturalization stage (gold / reference). */
  improvedSubtitle: string;
};

/**
 * Offline adaptation comparisons (20+).
 * OLD = stiff translator calque; NEW = native-feeling caption adaptation.
 */
export const SUBTITLE_NATURALIZATION_CASES: SubtitleNaturalizationCase[] = [
  {
    id: "01",
    category: "calque-reason",
    original: "The reason I don't recommend this is because it adds complexity.",
    oldTranslation:
      "제가 이것을 추천하지 않는 이유는 이것이 복잡성을 추가하기 때문입니다.",
    improvedSubtitle: "이걸 추천하지 않는 건\n괜히 복잡해지기 때문이에요.",
  },
  {
    id: "02",
    category: "calque-what-im-saying",
    original:
      "What I'm trying to say is that this isn't necessarily a bad approach.",
    oldTranslation:
      "제가 말하려고 하는 것은 이것이 반드시 나쁜 접근 방식은 아니라는 것입니다.",
    improvedSubtitle: "제 말은,\n이 방식이 꼭 나쁘다는 건 아니에요.",
  },
  {
    id: "03c",
    category: "idiom",
    original:
      "How would you decide what parts of nature are good or bad?",
    oldTranslation: "자연에서 좋은 것과 나쁜 것을 어떻게 구분하지?",
    improvedSubtitle: "뭐가 좋고 나쁜 건지 어떻게 판단하지?",
  },
  {
    id: "03b",
    category: "idiom",
    original: "I'm losing my mind.",
    oldTranslation: "내 정신이 지금 나가고 있어.",
    improvedSubtitle: "정신 나갈 것 같아.",
  },
  {
    id: "03",
    category: "idiom",
    original: "I wouldn't go that far.",
    oldTranslation: "나는 그렇게 멀리 가지 않을 것입니다.",
    improvedSubtitle: "그렇게까지 말하긴 좀 그래요.",
  },
  {
    id: "04",
    category: "idiom",
    previous: ["They claimed the migration is risk-free."],
    original: "I don't buy that.",
    oldTranslation: "나는 그것을 사지 않습니다.",
    improvedSubtitle: "그건 좀 납득이 안 돼요.",
  },
  {
    id: "05",
    category: "idiom",
    original: "That's not really the point.",
    oldTranslation: "그것은 정말로 요점이 아닙니다.",
    improvedSubtitle: "중요한 건 그게 아니에요.",
  },
  {
    id: "06",
    category: "hedge",
    original: "You might want to rethink that.",
    oldTranslation: "당신은 그것을 다시 생각하고 싶을지도 모릅니다.",
    improvedSubtitle: "그건 다시 생각해보는 게 좋겠어요.",
  },
  {
    id: "07",
    category: "hedge-caution",
    original: "I wouldn't necessarily say that's always the case.",
    oldTranslation: "나는 그것이 항상 그렇다고 반드시 말하지는 않을 것입니다.",
    improvedSubtitle: "꼭 항상 그렇다고 보긴 어려워요.",
  },
  {
    id: "08",
    category: "casual",
    original: "Honestly, I don't really see the point.",
    oldTranslation:
      "솔직히 말해서 저는 그 요점을 실제로 이해하지 못하겠습니다.",
    improvedSubtitle: "솔직히 굳이 이럴 필요가 있나 싶어요.",
  },
  {
    id: "08b",
    category: "casual-strong",
    previous: ["Can you stay late and finish the migration tonight?"],
    original: "Dude, there's no way I'm doing that.",
    oldTranslation: "친구여, 제가 그것을 할 가능성은 없습니다.",
    improvedSubtitle: "야, 그걸 내가 어떻게 해.",
  },
  {
    id: "08c",
    category: "softener",
    original: "I'm not sure that's the best idea.",
    oldTranslation: "그건 나쁜 생각입니다.",
    improvedSubtitle: "그게 최선인지는 잘 모르겠네요.",
  },
  {
    id: "08d",
    category: "sarcasm",
    previous: ["We should just ship without tests again."],
    original: "Yeah, because that worked so well last time.",
    oldTranslation: "네, 왜냐하면 그것은 지난번에 아주 잘 작동했기 때문입니다.",
    improvedSubtitle: "그래, 지난번에도 아주 잘됐었지.",
  },
  {
    id: "08e",
    category: "thing-is",
    original: "The thing is, you're not really getting much out of it.",
    oldTranslation:
      "문제는 당신이 그것으로부터 실제로 많은 것을 얻고 있지 않다는 것입니다.",
    improvedSubtitle: "문제는 이걸 해도\n딱히 얻는 게 없다는 거예요.",
  },
  {
    id: "09",
    category: "dev-terms",
    previous: ["We're wiring React Server Components into the app."],
    original:
      "This hook runs on the server runtime, so don't put browser-only APIs here.",
    next: ["Otherwise your deployment will break in production."],
    oldTranslation:
      "이 훅은 서버 런타임에서 실행되므로 여기에 브라우저 전용 API를 두지 마십시오.",
    improvedSubtitle:
      "이 hook은 서버 runtime에서 돌아가요.\n브라우저 전용 API는 여기 넣으면 안 됩니다.",
  },
  {
    id: "10",
    category: "dev-terms",
    original:
      "Check the repository dependency tree before the next deployment.",
    oldTranslation:
      "다음 배포 전에 저장소 의존성 트리를 확인하십시오.",
    improvedSubtitle: "다음 deployment 전에\nrepository dependency 트리부터 확인해 보세요.",
  },
  {
    id: "11",
    category: "long-sentence",
    original:
      "This approach itself isn't wrong, but in most projects you're not getting enough in return for the complexity you're taking on.",
    oldTranslation:
      "이 접근 방식 자체가 잘못된 것은 아니지만 대부분의 프로젝트에서는 여러분이 감수하는 복잡성에 대해 충분히 얻는 것이 없습니다.",
    improvedSubtitle:
      "이 방식 자체가 틀렸다는 건 아니에요.\n다만 대부분의 프로젝트에선\n복잡해지는 만큼 얻는 게 별로 없어요.",
  },
  {
    id: "12",
    category: "pronoun-context",
    previous: [
      "We've been discussing whether this architecture is actually necessary.",
    ],
    original:
      "The reason I don't recommend this is because it adds another layer of complexity.",
    next: [
      "And in most projects you're really not getting much in return.",
    ],
    oldTranslation:
      "제가 이것을 추천하지 않는 이유는 그것이 또 다른 복잡성 계층을 추가하기 때문입니다.",
    improvedSubtitle:
      "이걸 추천하지 않는 이유는\n복잡도만 한 단계 더 늘리기 때문이에요.",
  },
  {
    id: "13",
    category: "softener",
    original: "Kind of feels like we're overengineering this, actually.",
    oldTranslation:
      "종류로는 우리가 이것을 실제로 과도하게 엔지니어링하고 있는 것처럼 느껴집니다.",
    improvedSubtitle: "사실 좀 오버엔지니어링하는 느낌이에요.",
  },
  {
    id: "14",
    category: "joke",
    previous: ["The build finished in four seconds."],
    original: "Yeah, and I'm the queen of England.",
    oldTranslation: "네, 그리고 저는 영국의 여왕입니다.",
    improvedSubtitle: "그래요, 그럼 난 영국 여왕이고요.",
  },
  {
    id: "15",
    category: "metaphor",
    original: "We're basically putting a band-aid on a broken leg.",
    oldTranslation: "우리는 기본적으로 부러진 다리에 반창고를 붙이고 있습니다.",
    improvedSubtitle: "부러진 다리에 반창고 붙이는 격이에요.",
  },
  {
    id: "16",
    category: "contraction-filler",
    original: "I mean, it's... you know, it's not that we can't do it.",
    oldTranslation:
      "내 말은, 그것은... 당신도 알다시피, 우리가 그것을 할 수 없다는 것이 아닙니다.",
    improvedSubtitle: "못 해서가 아니라…\n그냥 그게 문제는 아니에요.",
  },
  {
    id: "17",
    category: "polite-request",
    original: "Could you walk me through the trade-offs one more time?",
    oldTranslation:
      "당신은 나에게 트레이드오프를 한 번 더 설명해 줄 수 있습니까?",
    improvedSubtitle: "트레이드오프 한 번만 더 짚어 주실래요?",
  },
  {
    id: "18",
    category: "negation-force",
    original: "I'm not saying we should rewrite everything tomorrow.",
    oldTranslation:
      "나는 우리가 내일 모든 것을 다시 작성해야 한다고 말하는 것이 아닙니다.",
    improvedSubtitle: "내일 당장 전부 다시 짜자는 말은 아니에요.",
  },
  {
    id: "19",
    category: "conditional",
    original: "If the cache misses, users will just wait a bit longer.",
    oldTranslation:
      "만약 캐시가 미스되면 사용자들은 단지 조금 더 오래 기다릴 것입니다.",
    improvedSubtitle: "캐시 미스 나면\n사용자만 살짝 더 기다리면 돼요.",
  },
  {
    id: "20",
    category: "attitude",
    original: "I guess we could ship it, but I'm not thrilled.",
    oldTranslation:
      "나는 우리가 그것을 출시할 수 있을 것이라고 추측하지만 나는 흥분되지 않습니다.",
    improvedSubtitle: "낼 순 있긴 한데…\n솔직히 탐탁진 않아요.",
  },
  {
    id: "21",
    category: "meaning-unit-merge",
    original:
      "The reason I don't recommend this is because you're basically adding another layer of complexity without getting much in return.",
    oldTranslation:
      "내가 이것을 추천하지 않는 이유는 당신이 기본적으로 많은 것을 얻지 못한 채 또 다른 복잡성 계층을 추가하고 있기 때문입니다.",
    improvedSubtitle:
      "이걸 추천하지 않는 건\n복잡도만 늘고 얻는 게 거의 없어서예요.",
  },
  {
    id: "22",
    category: "formal-lecture",
    original:
      "In this lecture, we will examine how the framework schedules updates.",
    oldTranslation:
      "이 강의에서 우리는 프레임워크가 업데이트를 스케줄링하는 방법에 대해 이야기하겠습니다.",
    improvedSubtitle:
      "이번 강의에서는\nframework가 업데이트를 어떻게 스케줄하는지 살펴봅니다.",
  },
];
