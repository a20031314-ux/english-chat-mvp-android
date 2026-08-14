import type {
  VideoSubtitle,
  VideoSubtitleAnalysis,
} from "@/lib/videoLearning";

export const MOCK_VIDEO_SUBTITLES: VideoSubtitle[] = [
  {
    id: "1",
    startTime: 0,
    endTime: 6,
    original: "Today I'm going to show you how I structure my React projects.",
    translation: "오늘은 React 프로젝트를 어떻게 짜는지 보여드릴게요.",
  },
  {
    id: "2",
    startTime: 6.5,
    endTime: 11,
    original: "There isn't really a right answer here.",
    translation: "사실 여기엔 꼭 정답이 있는 건 아니에요.",
  },
  {
    id: "3",
    startTime: 11.5,
    endTime: 16,
    original: "This has worked pretty well for me.",
    translation: "저한테는 이 방식이 꽤 잘 맞았어요.",
  },
  {
    id: "4",
    startTime: 16.5,
    endTime: 22.5,
    original: "I wouldn't reach for React in this situation.",
    translation: "이런 상황에서는 굳이 React를 쓰진 않을 거예요.",
  },
  {
    id: "5",
    startTime: 23,
    endTime: 29.5,
    original:
      "You're adding another layer of complexity for very little gain.",
    translation: "얻는 건 거의 없는데 복잡도만 하나 더 생기는 거예요.",
  },
  {
    id: "6",
    startTime: 30,
    endTime: 34,
    original: "That's not really the point.",
    translation: "그게 핵심은 아니에요.",
  },
  {
    id: "7",
    startTime: 34.5,
    endTime: 41,
    original: "It turns out this approach is much easier to maintain.",
    translation: "알고 보니 이 방식이 유지보수가 훨씬 수월해요.",
  },
  {
    id: "8",
    startTime: 41.5,
    endTime: 47,
    original: "You might want to keep this logic separate.",
    translation: "이 로직은 따로 빼 두는 게 나을 수도 있어요.",
  },
  {
    id: "9",
    startTime: 47.5,
    endTime: 53,
    original: "I wouldn't go that far.",
    translation: "그렇게까지 말하진 않겠어요.",
  },
  {
    id: "10",
    startTime: 53.5,
    endTime: 61,
    original: "So let's start with the folder structure and go from there.",
    translation: "그럼 폴더 구조부터 보고 이어서 가볼게요.",
  },
];

export const MOCK_VIDEO_ANALYSES: Record<string, VideoSubtitleAnalysis> = {
  "1": {
    subtitleId: "1",
    keyExpression: "how I structure",
    keyMeaning: "내가 ~를 어떻게 구성하는지",
    meaningInSentence:
      "직역하면 “내가 React 프로젝트를 어떻게 구조화하는지”지만, 여기서는 앞으로 보여줄 작업 방식을 가볍게 예고하는 오프닝입니다.",
    nuance: "강의나 튜토리얼에서 주제를 열 때 쓰는 일상적인 안내 말투입니다.",
    similar: [
      "Let me walk you through how I set this up.",
      "I'll show you the way I usually organize this.",
    ],
  },
  "2": {
    subtitleId: "2",
    keyExpression: "there isn't really a right answer",
    keyMeaning: "딱 맞는 정답은 없다",
    meaningInSentence:
      "“여기엔 정답이 없다”를 부드럽게 말한 표현입니다. really가 단정을 한 단계 낮춰 줍니다.",
    nuance: "상대 의견을 열어 두면서, 한 가지 방법만 맞다고 주장하지 않겠다는 태도입니다.",
    similar: [
      "There's no one right way to do this.",
      "It kind of depends.",
    ],
  },
  "3": {
    subtitleId: "3",
    keyExpression: "worked pretty well",
    keyMeaning: "꽤 잘 됐다 / 효과가 있었다",
    meaningInSentence:
      "완벽한 성공이 아니라, 실제 써 보니 나쁘지 않았다는 경험담입니다.",
    nuance: "pretty well은 과장 없이 만족스럽다는 정도의 온도입니다.",
    similar: [
      "It's been working well enough for me.",
      "I've had good results with this.",
    ],
  },
  "4": {
    subtitleId: "4",
    keyExpression: "reach for",
    keyMeaning: "(습관적으로) 그 도구를 집어 들다",
    meaningInSentence:
      "reach for React는 React를 만지러 간다는 뜻이 아니라, 이 상황에서 바로 React를 선택하진 않겠다는 말입니다.",
    nuance: "도구를 기본값처럼 꺼내는 습관을 살짝 말리는 개발 회화 표현입니다.",
    similar: [
      "I wouldn't jump to React here.",
      "React wouldn't be my first choice.",
    ],
  },
  "5": {
    subtitleId: "5",
    keyExpression: "another layer of complexity",
    keyMeaning: "복잡도만 한 겹 더 쌓이다",
    meaningInSentence:
      "이득은 작은데 구조만 더 복잡해진다는 경고입니다. for very little gain이 그 손익을 분명히 합니다.",
    nuance: "비난이라기보다, 과한 설계를 말리는 실무 톤입니다.",
    similar: [
      "That's a lot of extra complexity for not much benefit.",
      "You're overengineering this.",
    ],
  },
  "6": {
    subtitleId: "6",
    keyExpression: "not really the point",
    keyMeaning: "그게 핵심/요지가 아니다",
    meaningInSentence:
      "상대 말이 틀렸다기보다, 지금 논의의 초점이 거기가 아니라는 교정입니다.",
    nuance: "대화를 다시 본론으로 돌리는 짧은 제동입니다.",
    similar: [
      "That's beside the point.",
      "That's not what I'm getting at.",
    ],
  },
  "7": {
    subtitleId: "7",
    keyExpression: "it turns out",
    keyMeaning: "알고 보니 / 결과적으로",
    meaningInSentence:
      "해 보기 전에는 몰랐는데, 실제로 이 방식이 유지보수가 더 쉽다는 발견을 전합니다.",
    nuance: "경험 후에 나온 결론이라 설득력이 있습니다.",
    similar: [
      "As it turns out, this is easier to maintain.",
      "This ended up being much simpler.",
    ],
  },
  "8": {
    subtitleId: "8",
    keyExpression: "you might want to",
    keyMeaning: "~하는 게 나을 수도 있다",
    meaningInSentence:
      "명령이 아니라 부드러운 제안입니다. keep this logic separate는 그 코드를 한곳에 섞지 말라는 뜻입니다.",
    nuance: "튜토리얼에서 조언을 건넬 때 자주 쓰는 완곡한 권유입니다.",
    similar: [
      "It's probably worth keeping this separate.",
      "I'd pull this logic out.",
    ],
  },
  "9": {
    subtitleId: "9",
    keyExpression: "go that far",
    keyMeaning: "그 정도까지 주장하다 / 나아가다",
    whyThisSubtitle:
      "go that far는 여기서 물리적으로 멀리 간다는 뜻이 아니라, 상대 주장이 그 정도 수준까지 나아간다는 의미입니다. I wouldn't이 붙으며 직설적 반박보다 한발 물러선 태도가 됩니다. 그래서 「그렇게까지 말하진 않겠어요」처럼 옮기는 편이 화자 태도에 가깝습니다.",
    meaningInSentence:
      "상대 의견에 선을 긋되, 완전히 싸움을 걸지는 않는 한 박자 늦은 거절입니다.",
    nuance:
      "상대 의견을 완전히 부정하기보다 조금 선을 긋는 부드러운 표현입니다.",
    similar: [
      "그렇게까지 말하긴 좀 그래요.",
      "저도 거기까지는 동의 못 하겠어요.",
    ],
  },
  "10": {
    subtitleId: "10",
    keyExpression: "go from there",
    keyMeaning: "그걸 출발점으로 이어서 하다",
    meaningInSentence:
      "폴더 구조부터 보고, 그다음 단계는 거기서 이어가자는 진행 안내입니다.",
    nuance: "할 일을 한 번에 다 말하지 않고, 시작점만 정해 주는 가벼운 진행 표현입니다.",
    similar: [
      "Let's start here and take it from there.",
      "We'll begin with the folders and go from there.",
    ],
  },
};
