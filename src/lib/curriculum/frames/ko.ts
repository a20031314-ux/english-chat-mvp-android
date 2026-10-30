import type { Frame } from "../frames.ts";

/** 한국어 1~5단계 틀(curriculum/frames.ts) — 기능 id(fn)는 curriculum/functions.ts. Claude가 쓰고 다시 고침, 원어민 확인 전. */
export const KO_FRAMES: Frame[] = [
  {
    "id": "ko-f1-01",
    "stage": 1,
    "fn": "introduce",
    "pattern": "저는 ___이에요/예요.",
    "core": [
      "저는"
    ],
    "meaning": {
      "en": "Saying who or what you are: I'm ___.",
      "ko": "나를 소개하기: 저는 ___이에요/예요."
    },
    "grammar": [
      0,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "저는 루카스예요.",
        "slot": "루카스",
        "cue": {
          "en": "Lucas (your name)",
          "ko": "루카스(내 이름)"
        },
        "gloss": {
          "en": "I'm Lucas.",
          "ko": "저는 루카스예요."
        }
      },
      {
        "text": "저는 학생이에요.",
        "slot": "학생",
        "cue": {
          "en": "student",
          "ko": "학생"
        },
        "gloss": {
          "en": "I'm a student.",
          "ko": "저는 학생이에요."
        }
      },
      {
        "text": "저는 회사원이에요.",
        "slot": "회사원",
        "cue": {
          "en": "office worker",
          "ko": "회사원"
        },
        "gloss": {
          "en": "I'm an office worker.",
          "ko": "저는 회사원이에요."
        }
      },
      {
        "text": "저는 선생님이에요.",
        "slot": "선생님",
        "cue": {
          "en": "teacher",
          "ko": "선생님"
        },
        "gloss": {
          "en": "I'm a teacher.",
          "ko": "저는 선생님이에요."
        }
      }
    ]
  },
  {
    "id": "ko-f1-02",
    "stage": 1,
    "fn": "origin",
    "pattern": "저는 ___ 사람이에요.",
    "core": [
      "사람이에요"
    ],
    "meaning": {
      "en": "Saying where you're from: I'm ___ (nationality).",
      "ko": "어디서 왔는지 말하기: 저는 ___ 사람이에요."
    },
    "grammar": [
      0,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "저는 브라질 사람이에요.",
        "slot": "브라질",
        "cue": {
          "en": "Brazil",
          "ko": "브라질"
        },
        "gloss": {
          "en": "I'm Brazilian.",
          "ko": "저는 브라질 사람이에요."
        }
      },
      {
        "text": "저는 미국 사람이에요.",
        "slot": "미국",
        "cue": {
          "en": "America",
          "ko": "미국"
        },
        "gloss": {
          "en": "I'm American.",
          "ko": "저는 미국 사람이에요."
        }
      },
      {
        "text": "저는 일본 사람이에요.",
        "slot": "일본",
        "cue": {
          "en": "Japan",
          "ko": "일본"
        },
        "gloss": {
          "en": "I'm Japanese.",
          "ko": "저는 일본 사람이에요."
        }
      },
      {
        "text": "저는 베트남 사람이에요.",
        "slot": "베트남",
        "cue": {
          "en": "Vietnam",
          "ko": "베트남"
        },
        "gloss": {
          "en": "I'm Vietnamese.",
          "ko": "저는 베트남 사람이에요."
        }
      }
    ]
  },
  {
    "id": "ko-f1-03",
    "stage": 1,
    "fn": "yes-no",
    "pattern": "아니요, ___이/가 아니에요.",
    "core": [
      "이 아니에요",
      "가 아니에요"
    ],
    "meaning": {
      "en": "Saying no, it's not ___: No, I'm not / it's not ___.",
      "ko": "네·아니요로 답하기: 아니요, ___이/가 아니에요."
    },
    "grammar": [
      1
    ],
    "expressions": [
      "아니요"
    ],
    "examples": [
      {
        "text": "아니요, 학생이 아니에요.",
        "slot": "학생",
        "cue": {
          "en": "student",
          "ko": "학생"
        },
        "gloss": {
          "en": "No, I'm not a student.",
          "ko": "아니요, 학생이 아니에요."
        }
      },
      {
        "text": "아니요, 저는 선생님이 아니에요.",
        "slot": "선생님",
        "cue": {
          "en": "teacher",
          "ko": "선생님"
        },
        "gloss": {
          "en": "No, I'm not a teacher.",
          "ko": "아니요, 저는 선생님이 아니에요."
        }
      },
      {
        "text": "아니요, 제 가방이 아니에요.",
        "slot": "제 가방",
        "cue": {
          "en": "my bag",
          "ko": "제 가방"
        },
        "gloss": {
          "en": "No, it's not my bag.",
          "ko": "아니요, 제 가방이 아니에요."
        }
      },
      {
        "text": "아니요, 이건 커피가 아니에요.",
        "slot": "커피",
        "cue": {
          "en": "coffee",
          "ko": "커피"
        },
        "gloss": {
          "en": "No, this isn't coffee.",
          "ko": "아니요, 이건 커피가 아니에요."
        }
      }
    ]
  },
  {
    "id": "ko-f1-04",
    "stage": 1,
    "fn": "ask-what",
    "pattern": "___은/는 뭐예요?",
    "core": [
      "뭐예요"
    ],
    "meaning": {
      "en": "Asking what something is: What is ___?",
      "ko": "무엇인지 묻기: ___은/는 뭐예요?"
    },
    "grammar": [
      0,
      2
    ],
    "expressions": [
      "이거 뭐예요"
    ],
    "examples": [
      {
        "text": "이거 뭐예요?",
        "slot": "이거",
        "cue": {
          "en": "this (thing)",
          "ko": "이거"
        },
        "gloss": {
          "en": "What is this?",
          "ko": "이거 뭐예요?"
        }
      },
      {
        "text": "이 음식은 뭐예요?",
        "slot": "이 음식",
        "cue": {
          "en": "this food",
          "ko": "이 음식"
        },
        "gloss": {
          "en": "What is this food?",
          "ko": "이 음식은 뭐예요?"
        }
      },
      {
        "text": "저 건물은 뭐예요?",
        "slot": "저 건물",
        "cue": {
          "en": "that building",
          "ko": "저 건물"
        },
        "gloss": {
          "en": "What is that building?",
          "ko": "저 건물은 뭐예요?"
        }
      },
      {
        "text": "이 과자는 뭐예요?",
        "slot": "이 과자",
        "cue": {
          "en": "this snack",
          "ko": "이 과자"
        },
        "gloss": {
          "en": "What is this snack?",
          "ko": "이 과자는 뭐예요?"
        }
      }
    ]
  },
  {
    "id": "ko-f1-05",
    "stage": 1,
    "fn": "ask-price",
    "pattern": "___ 얼마예요?",
    "core": [
      "얼마예요"
    ],
    "meaning": {
      "en": "Asking the price: How much is ___?",
      "ko": "값 묻기: ___ 얼마예요?"
    },
    "grammar": [
      0
    ],
    "expressions": [
      "얼마예요"
    ],
    "examples": [
      {
        "text": "이거 얼마예요?",
        "slot": "이거",
        "cue": {
          "en": "this (thing)",
          "ko": "이거"
        },
        "gloss": {
          "en": "How much is this?",
          "ko": "이거 얼마예요?"
        }
      },
      {
        "text": "이 과자 얼마예요?",
        "slot": "이 과자",
        "cue": {
          "en": "this snack",
          "ko": "이 과자"
        },
        "gloss": {
          "en": "How much is this snack?",
          "ko": "이 과자 얼마예요?"
        }
      },
      {
        "text": "이 우산 얼마예요?",
        "slot": "이 우산",
        "cue": {
          "en": "this umbrella",
          "ko": "이 우산"
        },
        "gloss": {
          "en": "How much is this umbrella?",
          "ko": "이 우산 얼마예요?"
        }
      },
      {
        "text": "아이스 아메리카노 얼마예요?",
        "slot": "아이스 아메리카노",
        "cue": {
          "en": "iced americano",
          "ko": "아이스 아메리카노"
        },
        "gloss": {
          "en": "How much is an iced americano?",
          "ko": "아이스 아메리카노 얼마예요?"
        }
      }
    ]
  },
  {
    "id": "ko-f1-06",
    "stage": 1,
    "fn": "request-thing",
    "pattern": "___ 주세요.",
    "core": [
      "주세요"
    ],
    "meaning": {
      "en": "Asking for something: ___, please.",
      "ko": "달라고 하기: ___ 주세요."
    },
    "grammar": [
      6
    ],
    "expressions": [
      "이거 주세요"
    ],
    "examples": [
      {
        "text": "이거 주세요.",
        "slot": "이거",
        "cue": {
          "en": "this (thing)",
          "ko": "이거"
        },
        "gloss": {
          "en": "This one, please.",
          "ko": "이거 주세요."
        }
      },
      {
        "text": "물 한 병 주세요.",
        "slot": "물 한 병",
        "cue": {
          "en": "a bottle of water",
          "ko": "물 한 병"
        },
        "gloss": {
          "en": "A bottle of water, please.",
          "ko": "물 한 병 주세요."
        }
      },
      {
        "text": "따뜻한 라떼 하나 주세요.",
        "slot": "따뜻한 라떼 하나",
        "cue": {
          "en": "one hot latte",
          "ko": "따뜻한 라떼 하나"
        },
        "gloss": {
          "en": "One hot latte, please.",
          "ko": "따뜻한 라떼 하나 주세요."
        }
      },
      {
        "text": "영수증 주세요.",
        "slot": "영수증",
        "cue": {
          "en": "receipt",
          "ko": "영수증"
        },
        "gloss": {
          "en": "The receipt, please.",
          "ko": "영수증 주세요."
        }
      }
    ]
  },
  {
    "id": "ko-f1-07",
    "stage": 1,
    "fn": "repeat-slow",
    "pattern": "___ 말해 주세요.",
    "core": [
      "말해 주세요"
    ],
    "meaning": {
      "en": "Asking someone to say it differently: Please say it ___.",
      "ko": "다시·천천히 말해 달라고 하기: ___ 말해 주세요."
    },
    "grammar": [],
    "expressions": [
      "다시 한번 말해 주세요",
      "천천히 말해 주세요"
    ],
    "examples": [
      {
        "text": "천천히 말해 주세요.",
        "slot": "천천히",
        "cue": {
          "en": "slowly",
          "ko": "천천히"
        },
        "gloss": {
          "en": "Please speak slowly.",
          "ko": "천천히 말해 주세요."
        }
      },
      {
        "text": "다시 한번 말해 주세요.",
        "slot": "다시 한번",
        "cue": {
          "en": "once more",
          "ko": "다시 한번"
        },
        "gloss": {
          "en": "Please say it once more.",
          "ko": "다시 한번 말해 주세요."
        }
      },
      {
        "text": "조금 크게 말해 주세요.",
        "slot": "조금 크게",
        "cue": {
          "en": "a little louder",
          "ko": "조금 크게"
        },
        "gloss": {
          "en": "Please speak a little louder.",
          "ko": "조금 크게 말해 주세요."
        }
      },
      {
        "text": "영어로 말해 주세요.",
        "slot": "영어로",
        "cue": {
          "en": "in English",
          "ko": "영어로"
        },
        "gloss": {
          "en": "Please say it in English.",
          "ko": "영어로 말해 주세요."
        }
      }
    ]
  },
  {
    "id": "ko-f1-08",
    "stage": 1,
    "fn": "ask-where",
    "pattern": "___ 어디예요?",
    "core": [
      "어디예요"
    ],
    "meaning": {
      "en": "Asking where a place is: Where is ___?",
      "ko": "어디 있는지 묻기: ___ 어디예요?"
    },
    "grammar": [
      0
    ],
    "expressions": [
      "화장실 어디예요"
    ],
    "examples": [
      {
        "text": "화장실 어디예요?",
        "slot": "화장실",
        "cue": {
          "en": "restroom",
          "ko": "화장실"
        },
        "gloss": {
          "en": "Where is the restroom?",
          "ko": "화장실 어디예요?"
        }
      },
      {
        "text": "출구 어디예요?",
        "slot": "출구",
        "cue": {
          "en": "exit",
          "ko": "출구"
        },
        "gloss": {
          "en": "Where is the exit?",
          "ko": "출구 어디예요?"
        }
      },
      {
        "text": "편의점 어디예요?",
        "slot": "편의점",
        "cue": {
          "en": "convenience store",
          "ko": "편의점"
        },
        "gloss": {
          "en": "Where is the convenience store?",
          "ko": "편의점 어디예요?"
        }
      },
      {
        "text": "버스 정류장 어디예요?",
        "slot": "버스 정류장",
        "cue": {
          "en": "bus stop",
          "ko": "버스 정류장"
        },
        "gloss": {
          "en": "Where is the bus stop?",
          "ko": "버스 정류장 어디예요?"
        }
      }
    ]
  },
  {
    "id": "ko-f1-09",
    "stage": 1,
    "fn": "ask-have",
    "pattern": "___ 있어요?",
    "core": [
      "있어요?"
    ],
    "meaning": {
      "en": "Asking if there is / they have ___: Do you have ___?",
      "ko": "있는지 묻기: ___ 있어요?"
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "두유 있어요?",
        "slot": "두유",
        "cue": {
          "en": "soy milk",
          "ko": "두유"
        },
        "gloss": {
          "en": "Do you have soy milk?",
          "ko": "두유 있어요?"
        }
      },
      {
        "text": "이 근처에 편의점이 있어요?",
        "slot": "편의점",
        "cue": {
          "en": "convenience store",
          "ko": "편의점"
        },
        "gloss": {
          "en": "Is there a convenience store near here?",
          "ko": "이 근처에 편의점이 있어요?"
        }
      },
      {
        "text": "작은 사이즈 있어요?",
        "slot": "작은 사이즈",
        "cue": {
          "en": "small size",
          "ko": "작은 사이즈"
        },
        "gloss": {
          "en": "Do you have a small size?",
          "ko": "작은 사이즈 있어요?"
        }
      },
      {
        "text": "물티슈 있어요?",
        "slot": "물티슈",
        "cue": {
          "en": "wet wipes",
          "ko": "물티슈"
        },
        "gloss": {
          "en": "Do you have wet wipes?",
          "ko": "물티슈 있어요?"
        }
      }
    ]
  },
  {
    "id": "ko-f1-10",
    "stage": 1,
    "fn": "have",
    "pattern": "저는 ___이/가 있어요.",
    "core": [
      "이 있어요",
      "가 있어요"
    ],
    "meaning": {
      "en": "Saying what you have: I have ___.",
      "ko": "가진 것 말하기: 저는 ___이/가 있어요."
    },
    "grammar": [
      5,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "저는 동생이 있어요.",
        "slot": "동생",
        "cue": {
          "en": "younger sibling",
          "ko": "동생"
        },
        "gloss": {
          "en": "I have a younger sibling.",
          "ko": "저는 동생이 있어요."
        }
      },
      {
        "text": "저는 고양이가 있어요.",
        "slot": "고양이",
        "cue": {
          "en": "cat",
          "ko": "고양이"
        },
        "gloss": {
          "en": "I have a cat.",
          "ko": "저는 고양이가 있어요."
        }
      },
      {
        "text": "저는 오늘 약속이 있어요.",
        "slot": "약속",
        "cue": {
          "en": "plans, an appointment",
          "ko": "약속"
        },
        "gloss": {
          "en": "I have plans today.",
          "ko": "저는 오늘 약속이 있어요."
        }
      },
      {
        "text": "저는 한국 친구가 있어요.",
        "slot": "한국 친구",
        "cue": {
          "en": "Korean friend",
          "ko": "한국 친구"
        },
        "gloss": {
          "en": "I have a Korean friend.",
          "ko": "저는 한국 친구가 있어요."
        }
      }
    ]
  },
  {
    "id": "ko-f1-11",
    "stage": 1,
    "fn": "have",
    "pattern": "___이/가 없어요.",
    "core": [
      "없어요"
    ],
    "meaning": {
      "en": "Saying you don't have something: I don't have ___ / there's no ___.",
      "ko": "없는 것 말하기: ___이/가 없어요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "지금 시간이 없어요.",
        "slot": "시간",
        "cue": {
          "en": "time",
          "ko": "시간"
        },
        "gloss": {
          "en": "I don't have time now.",
          "ko": "지금 시간이 없어요."
        }
      },
      {
        "text": "현금이 없어요.",
        "slot": "현금",
        "cue": {
          "en": "cash",
          "ko": "현금"
        },
        "gloss": {
          "en": "I don't have cash.",
          "ko": "현금이 없어요."
        }
      },
      {
        "text": "우산이 없어요.",
        "slot": "우산",
        "cue": {
          "en": "umbrella",
          "ko": "우산"
        },
        "gloss": {
          "en": "I don't have an umbrella.",
          "ko": "우산이 없어요."
        }
      },
      {
        "text": "아직 계획이 없어요.",
        "slot": "계획",
        "cue": {
          "en": "plan",
          "ko": "계획"
        },
        "gloss": {
          "en": "I don't have plans yet.",
          "ko": "아직 계획이 없어요."
        }
      }
    ]
  },
  {
    "id": "ko-f1-12",
    "stage": 1,
    "fn": "like",
    "pattern": "저는 ___을/를 좋아해요.",
    "core": [
      "좋아해요"
    ],
    "meaning": {
      "en": "Saying what you like: I like ___.",
      "ko": "좋아하는 것 말하기: 저는 ___을/를 좋아해요."
    },
    "grammar": [
      2,
      3,
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "저는 커피를 좋아해요.",
        "slot": "커피",
        "cue": {
          "en": "coffee",
          "ko": "커피"
        },
        "gloss": {
          "en": "I like coffee.",
          "ko": "저는 커피를 좋아해요."
        }
      },
      {
        "text": "저는 한국 음식을 좋아해요.",
        "slot": "한국 음식",
        "cue": {
          "en": "Korean food",
          "ko": "한국 음식"
        },
        "gloss": {
          "en": "I like Korean food.",
          "ko": "저는 한국 음식을 좋아해요."
        }
      },
      {
        "text": "저는 케이팝을 좋아해요.",
        "slot": "케이팝",
        "cue": {
          "en": "K-pop",
          "ko": "케이팝"
        },
        "gloss": {
          "en": "I like K-pop.",
          "ko": "저는 케이팝을 좋아해요."
        }
      },
      {
        "text": "저는 영화를 좋아해요.",
        "slot": "영화",
        "cue": {
          "en": "movies",
          "ko": "영화"
        },
        "gloss": {
          "en": "I like movies.",
          "ko": "저는 영화를 좋아해요."
        }
      }
    ]
  },
  {
    "id": "ko-f1-13",
    "stage": 1,
    "fn": "dislike",
    "pattern": "저는 ___을/를 안 먹어요.",
    "core": [
      "안 먹어요"
    ],
    "meaning": {
      "en": "Saying what you don't eat: I don't eat ___.",
      "ko": "안 먹는 것 말하기: 저는 ___을/를 안 먹어요."
    },
    "grammar": [
      7,
      4,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "저는 고기를 안 먹어요.",
        "slot": "고기",
        "cue": {
          "en": "meat",
          "ko": "고기"
        },
        "gloss": {
          "en": "I don't eat meat.",
          "ko": "저는 고기를 안 먹어요."
        }
      },
      {
        "text": "저는 매운 음식을 안 먹어요.",
        "slot": "매운 음식",
        "cue": {
          "en": "spicy food",
          "ko": "매운 음식"
        },
        "gloss": {
          "en": "I don't eat spicy food.",
          "ko": "저는 매운 음식을 안 먹어요."
        }
      },
      {
        "text": "저는 생선을 안 먹어요.",
        "slot": "생선",
        "cue": {
          "en": "fish",
          "ko": "생선"
        },
        "gloss": {
          "en": "I don't eat fish.",
          "ko": "저는 생선을 안 먹어요."
        }
      },
      {
        "text": "저는 오이를 안 먹어요.",
        "slot": "오이",
        "cue": {
          "en": "cucumber",
          "ko": "오이"
        },
        "gloss": {
          "en": "I don't eat cucumber.",
          "ko": "저는 오이를 안 먹어요."
        }
      }
    ]
  },
  {
    "id": "ko-f1-14",
    "stage": 1,
    "fn": "dislike",
    "pattern": "저는 ___을/를 안 마셔요.",
    "core": [
      "안 마셔요"
    ],
    "meaning": {
      "en": "Saying what you don't drink: I don't drink ___.",
      "ko": "안 마시는 것 말하기: 저는 ___을/를 안 마셔요."
    },
    "grammar": [
      7,
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "저는 우유를 안 마셔요.",
        "slot": "우유",
        "cue": {
          "en": "milk",
          "ko": "우유"
        },
        "gloss": {
          "en": "I don't drink milk.",
          "ko": "저는 우유를 안 마셔요."
        }
      },
      {
        "text": "저는 술을 안 마셔요.",
        "slot": "술",
        "cue": {
          "en": "alcohol",
          "ko": "술"
        },
        "gloss": {
          "en": "I don't drink alcohol.",
          "ko": "저는 술을 안 마셔요."
        }
      },
      {
        "text": "저는 커피를 안 마셔요.",
        "slot": "커피",
        "cue": {
          "en": "coffee",
          "ko": "커피"
        },
        "gloss": {
          "en": "I don't drink coffee.",
          "ko": "저는 커피를 안 마셔요."
        }
      },
      {
        "text": "저는 탄산음료를 안 마셔요.",
        "slot": "탄산음료",
        "cue": {
          "en": "soda",
          "ko": "탄산음료"
        },
        "gloss": {
          "en": "I don't drink soda.",
          "ko": "저는 탄산음료를 안 마셔요."
        }
      }
    ]
  },
  {
    "id": "ko-f1-15",
    "stage": 1,
    "fn": "can",
    "pattern": "___ 조금 해요.",
    "core": [
      "조금 해요"
    ],
    "meaning": {
      "en": "Saying a language you speak a little: I speak a little ___.",
      "ko": "할 수 있는 것 말하기: ___ 조금 해요."
    },
    "grammar": [
      3
    ],
    "expressions": [
      "한국어 조금 해요"
    ],
    "examples": [
      {
        "text": "한국어 조금 해요.",
        "slot": "한국어",
        "cue": {
          "en": "Korean",
          "ko": "한국어"
        },
        "gloss": {
          "en": "I speak a little Korean.",
          "ko": "한국어 조금 해요."
        }
      },
      {
        "text": "영어 조금 해요.",
        "slot": "영어",
        "cue": {
          "en": "English",
          "ko": "영어"
        },
        "gloss": {
          "en": "I speak a little English.",
          "ko": "영어 조금 해요."
        }
      },
      {
        "text": "일본어 조금 해요.",
        "slot": "일본어",
        "cue": {
          "en": "Japanese",
          "ko": "일본어"
        },
        "gloss": {
          "en": "I speak a little Japanese.",
          "ko": "일본어 조금 해요."
        }
      },
      {
        "text": "스페인어 조금 해요.",
        "slot": "스페인어",
        "cue": {
          "en": "Spanish",
          "ko": "스페인어"
        },
        "gloss": {
          "en": "I speak a little Spanish.",
          "ko": "스페인어 조금 해요."
        }
      }
    ]
  },
  {
    "id": "ko-f1-16",
    "stage": 1,
    "fn": "not-understand",
    "pattern": "___은/는 잘 모르겠어요.",
    "core": [
      "잘 모르겠어요"
    ],
    "meaning": {
      "en": "Saying what you don't know: I'm not sure about ___.",
      "ko": "모르겠다고 말하기: ___은/는 잘 모르겠어요."
    },
    "grammar": [
      2
    ],
    "expressions": [
      "잘 모르겠어요"
    ],
    "examples": [
      {
        "text": "이 단어는 잘 모르겠어요.",
        "slot": "이 단어",
        "cue": {
          "en": "this word",
          "ko": "이 단어"
        },
        "gloss": {
          "en": "I don't really know this word.",
          "ko": "이 단어는 잘 모르겠어요."
        }
      },
      {
        "text": "그 노래는 잘 모르겠어요.",
        "slot": "그 노래",
        "cue": {
          "en": "that song",
          "ko": "그 노래"
        },
        "gloss": {
          "en": "I don't really know that song.",
          "ko": "그 노래는 잘 모르겠어요."
        }
      },
      {
        "text": "그 식당은 잘 모르겠어요.",
        "slot": "그 식당",
        "cue": {
          "en": "that restaurant",
          "ko": "그 식당"
        },
        "gloss": {
          "en": "I'm not sure about that restaurant.",
          "ko": "그 식당은 잘 모르겠어요."
        }
      },
      {
        "text": "이 길은 잘 모르겠어요.",
        "slot": "이 길",
        "cue": {
          "en": "this street",
          "ko": "이 길"
        },
        "gloss": {
          "en": "I don't really know this street.",
          "ko": "이 길은 잘 모르겠어요."
        }
      }
    ]
  },
  {
    "id": "ko-f1-17",
    "stage": 1,
    "fn": "job",
    "pattern": "저는 ___을/를 공부해요.",
    "core": [
      "공부해요"
    ],
    "meaning": {
      "en": "Saying what you study: I study ___.",
      "ko": "하는 일 말하기: 저는 ___을/를 공부해요."
    },
    "grammar": [
      4,
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "저는 한국어를 공부해요.",
        "slot": "한국어",
        "cue": {
          "en": "Korean",
          "ko": "한국어"
        },
        "gloss": {
          "en": "I study Korean.",
          "ko": "저는 한국어를 공부해요."
        }
      },
      {
        "text": "저는 경제학을 공부해요.",
        "slot": "경제학",
        "cue": {
          "en": "economics",
          "ko": "경제학"
        },
        "gloss": {
          "en": "I study economics.",
          "ko": "저는 경제학을 공부해요."
        }
      },
      {
        "text": "저는 디자인을 공부해요.",
        "slot": "디자인",
        "cue": {
          "en": "design",
          "ko": "디자인"
        },
        "gloss": {
          "en": "I study design.",
          "ko": "저는 디자인을 공부해요."
        }
      },
      {
        "text": "저는 요리를 공부해요.",
        "slot": "요리",
        "cue": {
          "en": "cooking",
          "ko": "요리"
        },
        "gloss": {
          "en": "I study cooking.",
          "ko": "저는 요리를 공부해요."
        }
      }
    ]
  },
  {
    "id": "ko-f1-18",
    "stage": 1,
    "fn": "location-now",
    "pattern": "지금 ___에 있어요.",
    "core": [
      "에 있어요"
    ],
    "meaning": {
      "en": "Saying where you are: I'm at ___ now.",
      "ko": "지금 있는 곳 말하기: 지금 ___에 있어요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "지금 카페에 있어요.",
        "slot": "카페",
        "cue": {
          "en": "café",
          "ko": "카페"
        },
        "gloss": {
          "en": "I'm at a café now.",
          "ko": "지금 카페에 있어요."
        }
      },
      {
        "text": "지금 집에 있어요.",
        "slot": "집",
        "cue": {
          "en": "home",
          "ko": "집"
        },
        "gloss": {
          "en": "I'm at home now.",
          "ko": "지금 집에 있어요."
        }
      },
      {
        "text": "지금 역 앞에 있어요.",
        "slot": "역 앞",
        "cue": {
          "en": "in front of the station",
          "ko": "역 앞"
        },
        "gloss": {
          "en": "I'm in front of the station now.",
          "ko": "지금 역 앞에 있어요."
        }
      },
      {
        "text": "지금 회사에 있어요.",
        "slot": "회사",
        "cue": {
          "en": "the office",
          "ko": "회사"
        },
        "gloss": {
          "en": "I'm at the office now.",
          "ko": "지금 회사에 있어요."
        }
      }
    ]
  },
  {
    "id": "ko-f1-19",
    "stage": 1,
    "fn": "possession",
    "pattern": "이건 제 ___이에요/예요.",
    "core": [
      "이건 제"
    ],
    "meaning": {
      "en": "Saying what's yours: This is my ___.",
      "ko": "누구 것인지 말하기: 이건 제 ___이에요/예요."
    },
    "grammar": [
      0,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "이건 제 가방이에요.",
        "slot": "가방",
        "cue": {
          "en": "bag",
          "ko": "가방"
        },
        "gloss": {
          "en": "This is my bag.",
          "ko": "이건 제 가방이에요."
        }
      },
      {
        "text": "이건 제 우산이에요.",
        "slot": "우산",
        "cue": {
          "en": "umbrella",
          "ko": "우산"
        },
        "gloss": {
          "en": "This is my umbrella.",
          "ko": "이건 제 우산이에요."
        }
      },
      {
        "text": "이건 제 자리예요.",
        "slot": "자리",
        "cue": {
          "en": "seat",
          "ko": "자리"
        },
        "gloss": {
          "en": "This is my seat.",
          "ko": "이건 제 자리예요."
        }
      },
      {
        "text": "이건 제 핸드폰이에요.",
        "slot": "핸드폰",
        "cue": {
          "en": "phone",
          "ko": "핸드폰"
        },
        "gloss": {
          "en": "This is my phone.",
          "ko": "이건 제 핸드폰이에요."
        }
      }
    ]
  },
  {
    "id": "ko-f1-20",
    "stage": 1,
    "fn": "count",
    "pattern": "___ 명이에요.",
    "core": [
      "명이에요"
    ],
    "meaning": {
      "en": "Saying how many people: We're ___ people.",
      "ko": "수와 양 말하기: ___ 명이에요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "한 명이에요.",
        "slot": "한",
        "cue": {
          "en": "one",
          "ko": "하나"
        },
        "gloss": {
          "en": "Just one person.",
          "ko": "한 명이에요."
        }
      },
      {
        "text": "두 명이에요.",
        "slot": "두",
        "cue": {
          "en": "two",
          "ko": "둘"
        },
        "gloss": {
          "en": "Two people.",
          "ko": "두 명이에요."
        }
      },
      {
        "text": "세 명이에요.",
        "slot": "세",
        "cue": {
          "en": "three",
          "ko": "셋"
        },
        "gloss": {
          "en": "Three people.",
          "ko": "세 명이에요."
        }
      },
      {
        "text": "다섯 명이에요.",
        "slot": "다섯",
        "cue": {
          "en": "five",
          "ko": "다섯"
        },
        "gloss": {
          "en": "Five people.",
          "ko": "다섯 명이에요."
        }
      }
    ]
  },
  {
    "id": "ko-f2-01",
    "stage": 2,
    "fn": "past-did",
    "pattern": "어제 ___에 갔어요.",
    "core": [
      "에 갔어요"
    ],
    "meaning": {
      "en": "Saying where you went: I went to ___ yesterday.",
      "ko": "한 일 말하기: 어제 ___에 갔어요."
    },
    "grammar": [
      0,
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "어제 한강에 갔어요.",
        "slot": "한강",
        "cue": {
          "en": "the Han River",
          "ko": "한강"
        },
        "gloss": {
          "en": "I went to the Han River yesterday.",
          "ko": "어제 한강에 갔어요."
        }
      },
      {
        "text": "어제 병원에 갔어요.",
        "slot": "병원",
        "cue": {
          "en": "hospital",
          "ko": "병원"
        },
        "gloss": {
          "en": "I went to the hospital yesterday.",
          "ko": "어제 병원에 갔어요."
        }
      },
      {
        "text": "어제 친구 집에 갔어요.",
        "slot": "친구 집",
        "cue": {
          "en": "a friend's house",
          "ko": "친구 집"
        },
        "gloss": {
          "en": "I went to a friend's place yesterday.",
          "ko": "어제 친구 집에 갔어요."
        }
      },
      {
        "text": "어제 명동에 갔어요.",
        "slot": "명동",
        "cue": {
          "en": "Myeongdong",
          "ko": "명동"
        },
        "gloss": {
          "en": "I went to Myeongdong yesterday.",
          "ko": "어제 명동에 갔어요."
        }
      }
    ]
  },
  {
    "id": "ko-f2-02",
    "stage": 2,
    "fn": "past-did",
    "pattern": "어제 ___에서 친구를 만났어요.",
    "core": [
      "친구를 만났어요"
    ],
    "meaning": {
      "en": "Saying where you met someone: I met a friend at ___ yesterday.",
      "ko": "한 일 말하기: 어제 ___에서 친구를 만났어요."
    },
    "grammar": [
      0,
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "어제 카페에서 친구를 만났어요.",
        "slot": "카페",
        "cue": {
          "en": "café",
          "ko": "카페"
        },
        "gloss": {
          "en": "I met a friend at a café yesterday.",
          "ko": "어제 카페에서 친구를 만났어요."
        }
      },
      {
        "text": "어제 홍대에서 친구를 만났어요.",
        "slot": "홍대",
        "cue": {
          "en": "Hongdae",
          "ko": "홍대"
        },
        "gloss": {
          "en": "I met a friend in Hongdae yesterday.",
          "ko": "어제 홍대에서 친구를 만났어요."
        }
      },
      {
        "text": "어제 학교 앞에서 친구를 만났어요.",
        "slot": "학교 앞",
        "cue": {
          "en": "in front of school",
          "ko": "학교 앞"
        },
        "gloss": {
          "en": "I met a friend in front of school yesterday.",
          "ko": "어제 학교 앞에서 친구를 만났어요."
        }
      },
      {
        "text": "어제 공원에서 친구를 만났어요.",
        "slot": "공원",
        "cue": {
          "en": "park",
          "ko": "공원"
        },
        "gloss": {
          "en": "I met a friend at the park yesterday.",
          "ko": "어제 공원에서 친구를 만났어요."
        }
      }
    ]
  },
  {
    "id": "ko-f2-03",
    "stage": 2,
    "fn": "past-did",
    "pattern": "___에 뭐 했어요?",
    "core": [
      "뭐 했어요"
    ],
    "meaning": {
      "en": "Asking what someone did: What did you do over/on ___?",
      "ko": "한 일 묻기: ___에 뭐 했어요?"
    },
    "grammar": [
      0,
      7
    ],
    "expressions": [
      "주말에 뭐 했어요"
    ],
    "examples": [
      {
        "text": "주말에 뭐 했어요?",
        "slot": "주말",
        "cue": {
          "en": "the weekend",
          "ko": "주말"
        },
        "gloss": {
          "en": "What did you do on the weekend?",
          "ko": "주말에 뭐 했어요?"
        }
      },
      {
        "text": "방학에 뭐 했어요?",
        "slot": "방학",
        "cue": {
          "en": "school vacation",
          "ko": "방학"
        },
        "gloss": {
          "en": "What did you do over the vacation?",
          "ko": "방학에 뭐 했어요?"
        }
      },
      {
        "text": "연휴에 뭐 했어요?",
        "slot": "연휴",
        "cue": {
          "en": "the long holiday",
          "ko": "연휴"
        },
        "gloss": {
          "en": "What did you do over the holiday?",
          "ko": "연휴에 뭐 했어요?"
        }
      },
      {
        "text": "크리스마스에 뭐 했어요?",
        "slot": "크리스마스",
        "cue": {
          "en": "Christmas",
          "ko": "크리스마스"
        },
        "gloss": {
          "en": "What did you do on Christmas?",
          "ko": "크리스마스에 뭐 했어요?"
        }
      }
    ]
  },
  {
    "id": "ko-f2-04",
    "stage": 2,
    "fn": "invite",
    "pattern": "다음에 같이 ___.",
    "core": [
      "다음에 같이"
    ],
    "meaning": {
      "en": "Suggesting doing something together another time: Let's ___ together next time.",
      "ko": "같이 하자고 하기: 다음에 같이 ___."
    },
    "grammar": [],
    "expressions": [
      "다음에 같이 가요"
    ],
    "examples": [
      {
        "text": "다음에 같이 가요.",
        "slot": "가요",
        "cue": {
          "en": "go",
          "ko": "가다"
        },
        "gloss": {
          "en": "Let's go together next time.",
          "ko": "다음에 같이 가요."
        }
      },
      {
        "text": "다음에 같이 영화 봐요.",
        "slot": "영화 봐요",
        "cue": {
          "en": "watch a movie",
          "ko": "영화 보다"
        },
        "gloss": {
          "en": "Let's watch a movie together next time.",
          "ko": "다음에 같이 영화 봐요."
        }
      },
      {
        "text": "다음에 같이 밥 먹어요.",
        "slot": "밥 먹어요",
        "cue": {
          "en": "have a meal",
          "ko": "밥 먹다"
        },
        "gloss": {
          "en": "Let's grab a meal together next time.",
          "ko": "다음에 같이 밥 먹어요."
        }
      },
      {
        "text": "다음에 같이 운동해요.",
        "slot": "운동해요",
        "cue": {
          "en": "work out",
          "ko": "운동하다"
        },
        "gloss": {
          "en": "Let's work out together next time.",
          "ko": "다음에 같이 운동해요."
        }
      }
    ]
  },
  {
    "id": "ko-f2-05",
    "stage": 2,
    "fn": "ask-opinion-simple",
    "pattern": "___이/가 진짜 재미있었어요.",
    "core": [
      "재미있었어요"
    ],
    "meaning": {
      "en": "Saying something was fun: ___ was really fun.",
      "ko": "어땠는지 말하기: ___이/가 진짜 재미있었어요."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "재미있었어요"
    ],
    "examples": [
      {
        "text": "영화가 진짜 재미있었어요.",
        "slot": "영화",
        "cue": {
          "en": "the movie",
          "ko": "영화"
        },
        "gloss": {
          "en": "The movie was really fun.",
          "ko": "영화가 진짜 재미있었어요."
        }
      },
      {
        "text": "콘서트가 진짜 재미있었어요.",
        "slot": "콘서트",
        "cue": {
          "en": "the concert",
          "ko": "콘서트"
        },
        "gloss": {
          "en": "The concert was really fun.",
          "ko": "콘서트가 진짜 재미있었어요."
        }
      },
      {
        "text": "여행이 진짜 재미있었어요.",
        "slot": "여행",
        "cue": {
          "en": "the trip",
          "ko": "여행"
        },
        "gloss": {
          "en": "The trip was really fun.",
          "ko": "여행이 진짜 재미있었어요."
        }
      },
      {
        "text": "수업이 진짜 재미있었어요.",
        "slot": "수업",
        "cue": {
          "en": "the class",
          "ko": "수업"
        },
        "gloss": {
          "en": "The class was really fun.",
          "ko": "수업이 진짜 재미있었어요."
        }
      }
    ]
  },
  {
    "id": "ko-f2-06",
    "stage": 2,
    "fn": "future-plan",
    "pattern": "내일 ___에 갈 거예요.",
    "core": [
      "에 갈 거예요"
    ],
    "meaning": {
      "en": "Saying where you'll go: I'm going to ___ tomorrow.",
      "ko": "할 일 말하기: 내일 ___에 갈 거예요."
    },
    "grammar": [
      1,
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "내일 부산에 갈 거예요.",
        "slot": "부산",
        "cue": {
          "en": "Busan",
          "ko": "부산"
        },
        "gloss": {
          "en": "I'm going to Busan tomorrow.",
          "ko": "내일 부산에 갈 거예요."
        }
      },
      {
        "text": "내일 도서관에 갈 거예요.",
        "slot": "도서관",
        "cue": {
          "en": "library",
          "ko": "도서관"
        },
        "gloss": {
          "en": "I'm going to the library tomorrow.",
          "ko": "내일 도서관에 갈 거예요."
        }
      },
      {
        "text": "내일 마트에 갈 거예요.",
        "slot": "마트",
        "cue": {
          "en": "supermarket",
          "ko": "마트"
        },
        "gloss": {
          "en": "I'm going to the supermarket tomorrow.",
          "ko": "내일 마트에 갈 거예요."
        }
      },
      {
        "text": "내일 제주도에 갈 거예요.",
        "slot": "제주도",
        "cue": {
          "en": "Jeju Island",
          "ko": "제주도"
        },
        "gloss": {
          "en": "I'm going to Jeju Island tomorrow.",
          "ko": "내일 제주도에 갈 거예요."
        }
      }
    ]
  },
  {
    "id": "ko-f2-07",
    "stage": 2,
    "fn": "want",
    "pattern": "___고 싶어요.",
    "core": [
      "고 싶어요"
    ],
    "meaning": {
      "en": "Saying what you want to do: I want to ___.",
      "ko": "원하는 것 말하기: ___고 싶어요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "한옥을 보고 싶어요.",
        "slot": "한옥을 보",
        "cue": {
          "en": "see a hanok (traditional house)",
          "ko": "한옥을 보다"
        },
        "gloss": {
          "en": "I want to see a hanok.",
          "ko": "한옥을 보고 싶어요."
        }
      },
      {
        "text": "제주도에 가고 싶어요.",
        "slot": "제주도에 가",
        "cue": {
          "en": "go to Jeju Island",
          "ko": "제주도에 가다"
        },
        "gloss": {
          "en": "I want to go to Jeju Island.",
          "ko": "제주도에 가고 싶어요."
        }
      },
      {
        "text": "떡볶이를 먹고 싶어요.",
        "slot": "떡볶이를 먹",
        "cue": {
          "en": "eat tteokbokki",
          "ko": "떡볶이를 먹다"
        },
        "gloss": {
          "en": "I want to eat tteokbokki.",
          "ko": "떡볶이를 먹고 싶어요."
        }
      },
      {
        "text": "한국 친구를 사귀고 싶어요.",
        "slot": "한국 친구를 사귀",
        "cue": {
          "en": "make Korean friends",
          "ko": "한국 친구를 사귀다"
        },
        "gloss": {
          "en": "I want to make Korean friends.",
          "ko": "한국 친구를 사귀고 싶어요."
        }
      }
    ]
  },
  {
    "id": "ko-f2-08",
    "stage": 2,
    "fn": "can",
    "pattern": "저는 ___을/를 할 수 있어요.",
    "core": [
      "할 수 있어요"
    ],
    "meaning": {
      "en": "Saying what you can do: I can ___.",
      "ko": "할 수 있는 것 말하기: 저는 ___을/를 할 수 있어요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "저는 운전을 할 수 있어요.",
        "slot": "운전",
        "cue": {
          "en": "driving",
          "ko": "운전"
        },
        "gloss": {
          "en": "I can drive.",
          "ko": "저는 운전을 할 수 있어요."
        }
      },
      {
        "text": "저는 수영을 할 수 있어요.",
        "slot": "수영",
        "cue": {
          "en": "swimming",
          "ko": "수영"
        },
        "gloss": {
          "en": "I can swim.",
          "ko": "저는 수영을 할 수 있어요."
        }
      },
      {
        "text": "저는 요리를 할 수 있어요.",
        "slot": "요리",
        "cue": {
          "en": "cooking",
          "ko": "요리"
        },
        "gloss": {
          "en": "I can cook.",
          "ko": "저는 요리를 할 수 있어요."
        }
      },
      {
        "text": "저는 일본어를 할 수 있어요.",
        "slot": "일본어",
        "cue": {
          "en": "Japanese",
          "ko": "일본어"
        },
        "gloss": {
          "en": "I can speak Japanese.",
          "ko": "저는 일본어를 할 수 있어요."
        }
      }
    ]
  },
  {
    "id": "ko-f2-09",
    "stage": 2,
    "fn": "future-plan",
    "pattern": "___(으)러 가요.",
    "core": [
      "러 가요"
    ],
    "meaning": {
      "en": "Saying why you're going: I'm going (out) to ___.",
      "ko": "할 일 말하기: ___(으)러 가요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "옷을 사러 가요.",
        "slot": "옷을 사",
        "cue": {
          "en": "buy clothes",
          "ko": "옷을 사다"
        },
        "gloss": {
          "en": "I'm going to buy clothes.",
          "ko": "옷을 사러 가요."
        }
      },
      {
        "text": "친구를 만나러 가요.",
        "slot": "친구를 만나",
        "cue": {
          "en": "meet a friend",
          "ko": "친구를 만나다"
        },
        "gloss": {
          "en": "I'm going to meet a friend.",
          "ko": "친구를 만나러 가요."
        }
      },
      {
        "text": "밥 먹으러 가요.",
        "slot": "밥 먹",
        "cue": {
          "en": "eat (a meal)",
          "ko": "밥 먹다"
        },
        "gloss": {
          "en": "I'm going to eat.",
          "ko": "밥 먹으러 가요."
        }
      },
      {
        "text": "기차 타러 가요.",
        "slot": "기차 타",
        "cue": {
          "en": "take the train",
          "ko": "기차 타다"
        },
        "gloss": {
          "en": "I'm going to catch a train.",
          "ko": "기차 타러 가요."
        }
      }
    ]
  },
  {
    "id": "ko-f2-10",
    "stage": 2,
    "fn": "invite",
    "pattern": "___하고 같이 저녁 먹을까요?",
    "core": [
      "같이 저녁 먹을까요"
    ],
    "meaning": {
      "en": "Suggesting a plan: Shall we ___ and then have dinner together?",
      "ko": "같이 하자고 하기: ___하고 같이 저녁 먹을까요?"
    },
    "grammar": [
      4,
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "구경하고 같이 저녁 먹을까요?",
        "slot": "구경",
        "cue": {
          "en": "look around",
          "ko": "구경하다"
        },
        "gloss": {
          "en": "Shall we look around and then have dinner together?",
          "ko": "구경하고 같이 저녁 먹을까요?"
        }
      },
      {
        "text": "쇼핑하고 같이 저녁 먹을까요?",
        "slot": "쇼핑",
        "cue": {
          "en": "go shopping",
          "ko": "쇼핑하다"
        },
        "gloss": {
          "en": "Shall we shop and then have dinner together?",
          "ko": "쇼핑하고 같이 저녁 먹을까요?"
        }
      },
      {
        "text": "산책하고 같이 저녁 먹을까요?",
        "slot": "산책",
        "cue": {
          "en": "take a walk",
          "ko": "산책하다"
        },
        "gloss": {
          "en": "Shall we take a walk and then have dinner together?",
          "ko": "산책하고 같이 저녁 먹을까요?"
        }
      },
      {
        "text": "운동하고 같이 저녁 먹을까요?",
        "slot": "운동",
        "cue": {
          "en": "work out",
          "ko": "운동하다"
        },
        "gloss": {
          "en": "Shall we work out and then have dinner together?",
          "ko": "운동하고 같이 저녁 먹을까요?"
        }
      }
    ]
  },
  {
    "id": "ko-f2-11",
    "stage": 2,
    "fn": "suggest-time",
    "pattern": "___에 만날까요?",
    "core": [
      "만날까요"
    ],
    "meaning": {
      "en": "Setting a time: Shall we meet at ___?",
      "ko": "시간·장소 정하기: ___에 만날까요?"
    },
    "grammar": [
      6,
      7
    ],
    "expressions": [
      "몇 시에 만날까요"
    ],
    "examples": [
      {
        "text": "몇 시에 만날까요?",
        "slot": "몇 시",
        "cue": {
          "en": "what time",
          "ko": "몇 시"
        },
        "gloss": {
          "en": "What time shall we meet?",
          "ko": "몇 시에 만날까요?"
        }
      },
      {
        "text": "토요일 오후에 만날까요?",
        "slot": "토요일 오후",
        "cue": {
          "en": "Saturday afternoon",
          "ko": "토요일 오후"
        },
        "gloss": {
          "en": "Shall we meet Saturday afternoon?",
          "ko": "토요일 오후에 만날까요?"
        }
      },
      {
        "text": "내일 저녁에 만날까요?",
        "slot": "내일 저녁",
        "cue": {
          "en": "tomorrow evening",
          "ko": "내일 저녁"
        },
        "gloss": {
          "en": "Shall we meet tomorrow evening?",
          "ko": "내일 저녁에 만날까요?"
        }
      },
      {
        "text": "세 시에 만날까요?",
        "slot": "세 시",
        "cue": {
          "en": "three o'clock",
          "ko": "세 시"
        },
        "gloss": {
          "en": "Shall we meet at three?",
          "ko": "세 시에 만날까요?"
        }
      }
    ]
  },
  {
    "id": "ko-f2-12",
    "stage": 2,
    "fn": "permission",
    "pattern": "이 ___ 입어 봐도 돼요?",
    "core": [
      "입어 봐도 돼요"
    ],
    "meaning": {
      "en": "Asking to try clothes on: Can I try on this ___?",
      "ko": "허락 구하기: 이 ___ 입어 봐도 돼요?"
    },
    "grammar": [],
    "expressions": [
      "입어 봐도 돼요"
    ],
    "examples": [
      {
        "text": "이 재킷 입어 봐도 돼요?",
        "slot": "재킷",
        "cue": {
          "en": "jacket",
          "ko": "재킷"
        },
        "gloss": {
          "en": "Can I try on this jacket?",
          "ko": "이 재킷 입어 봐도 돼요?"
        }
      },
      {
        "text": "이 바지 입어 봐도 돼요?",
        "slot": "바지",
        "cue": {
          "en": "pants",
          "ko": "바지"
        },
        "gloss": {
          "en": "Can I try on these pants?",
          "ko": "이 바지 입어 봐도 돼요?"
        }
      },
      {
        "text": "이 원피스 입어 봐도 돼요?",
        "slot": "원피스",
        "cue": {
          "en": "dress",
          "ko": "원피스"
        },
        "gloss": {
          "en": "Can I try on this dress?",
          "ko": "이 원피스 입어 봐도 돼요?"
        }
      },
      {
        "text": "이 셔츠 입어 봐도 돼요?",
        "slot": "셔츠",
        "cue": {
          "en": "shirt",
          "ko": "셔츠"
        },
        "gloss": {
          "en": "Can I try on this shirt?",
          "ko": "이 셔츠 입어 봐도 돼요?"
        }
      }
    ]
  },
  {
    "id": "ko-f2-13",
    "stage": 2,
    "fn": "ask-have",
    "pattern": "___ 돼요?",
    "core": [
      "돼요?"
    ],
    "meaning": {
      "en": "Asking if something is possible here: Is ___ OK / available?",
      "ko": "있는지 묻기: ___ 돼요?"
    },
    "grammar": [],
    "expressions": [
      "카드 돼요"
    ],
    "examples": [
      {
        "text": "카드 돼요?",
        "slot": "카드",
        "cue": {
          "en": "card (payment)",
          "ko": "카드"
        },
        "gloss": {
          "en": "Can I pay by card?",
          "ko": "카드 돼요?"
        }
      },
      {
        "text": "포장 돼요?",
        "slot": "포장",
        "cue": {
          "en": "takeout",
          "ko": "포장"
        },
        "gloss": {
          "en": "Can I get it to go?",
          "ko": "포장 돼요?"
        }
      },
      {
        "text": "교환 돼요?",
        "slot": "교환",
        "cue": {
          "en": "exchange",
          "ko": "교환"
        },
        "gloss": {
          "en": "Can I exchange it?",
          "ko": "교환 돼요?"
        }
      },
      {
        "text": "여기 와이파이 돼요?",
        "slot": "와이파이",
        "cue": {
          "en": "Wi-Fi",
          "ko": "와이파이"
        },
        "gloss": {
          "en": "Is there Wi-Fi here?",
          "ko": "여기 와이파이 돼요?"
        }
      }
    ]
  },
  {
    "id": "ko-f2-14",
    "stage": 2,
    "fn": "ask-have",
    "pattern": "다른 ___ 있어요?",
    "core": [
      "다른"
    ],
    "meaning": {
      "en": "Asking for another option: Do you have another ___?",
      "ko": "있는지 묻기: 다른 ___ 있어요?"
    },
    "grammar": [],
    "expressions": [
      "다른 색 있어요"
    ],
    "examples": [
      {
        "text": "다른 색 있어요?",
        "slot": "색",
        "cue": {
          "en": "color",
          "ko": "색"
        },
        "gloss": {
          "en": "Do you have another color?",
          "ko": "다른 색 있어요?"
        }
      },
      {
        "text": "다른 사이즈 있어요?",
        "slot": "사이즈",
        "cue": {
          "en": "size",
          "ko": "사이즈"
        },
        "gloss": {
          "en": "Do you have another size?",
          "ko": "다른 사이즈 있어요?"
        }
      },
      {
        "text": "다른 디자인 있어요?",
        "slot": "디자인",
        "cue": {
          "en": "design",
          "ko": "디자인"
        },
        "gloss": {
          "en": "Do you have another design?",
          "ko": "다른 디자인 있어요?"
        }
      },
      {
        "text": "다른 메뉴 있어요?",
        "slot": "메뉴",
        "cue": {
          "en": "menu (item)",
          "ko": "메뉴"
        },
        "gloss": {
          "en": "Do you have anything else on the menu?",
          "ko": "다른 메뉴 있어요?"
        }
      }
    ]
  },
  {
    "id": "ko-f2-15",
    "stage": 2,
    "fn": "symptom",
    "pattern": "___이/가 아파요.",
    "core": [
      "아파요"
    ],
    "meaning": {
      "en": "Saying where it hurts: My ___ hurts.",
      "ko": "아픈 곳 말하기: ___이/가 아파요."
    },
    "grammar": [],
    "expressions": [
      "머리가 아파요"
    ],
    "examples": [
      {
        "text": "머리가 아파요.",
        "slot": "머리",
        "cue": {
          "en": "head",
          "ko": "머리"
        },
        "gloss": {
          "en": "I have a headache.",
          "ko": "머리가 아파요."
        }
      },
      {
        "text": "목이 좀 아파요.",
        "slot": "목",
        "cue": {
          "en": "throat",
          "ko": "목"
        },
        "gloss": {
          "en": "My throat hurts a bit.",
          "ko": "목이 좀 아파요."
        }
      },
      {
        "text": "배가 아파요.",
        "slot": "배",
        "cue": {
          "en": "stomach",
          "ko": "배"
        },
        "gloss": {
          "en": "My stomach hurts.",
          "ko": "배가 아파요."
        }
      },
      {
        "text": "허리가 아파요.",
        "slot": "허리",
        "cue": {
          "en": "lower back",
          "ko": "허리"
        },
        "gloss": {
          "en": "My back hurts.",
          "ko": "허리가 아파요."
        }
      }
    ]
  },
  {
    "id": "ko-f2-16",
    "stage": 2,
    "fn": "request-action",
    "pattern": "___(으)로 가 주세요.",
    "core": [
      "로 가 주세요"
    ],
    "meaning": {
      "en": "Telling a driver where to go: To ___, please.",
      "ko": "해 달라고 부탁하기: ___(으)로 가 주세요."
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "수서역으로 가 주세요.",
        "slot": "수서역",
        "cue": {
          "en": "Suseo Station",
          "ko": "수서역"
        },
        "gloss": {
          "en": "To Suseo Station, please.",
          "ko": "수서역으로 가 주세요."
        }
      },
      {
        "text": "서울역으로 가 주세요.",
        "slot": "서울역",
        "cue": {
          "en": "Seoul Station",
          "ko": "서울역"
        },
        "gloss": {
          "en": "To Seoul Station, please.",
          "ko": "서울역으로 가 주세요."
        }
      },
      {
        "text": "공항으로 가 주세요.",
        "slot": "공항",
        "cue": {
          "en": "the airport",
          "ko": "공항"
        },
        "gloss": {
          "en": "To the airport, please.",
          "ko": "공항으로 가 주세요."
        }
      },
      {
        "text": "이 주소로 가 주세요.",
        "slot": "이 주소",
        "cue": {
          "en": "this address",
          "ko": "이 주소"
        },
        "gloss": {
          "en": "To this address, please.",
          "ko": "이 주소로 가 주세요."
        }
      }
    ]
  },
  {
    "id": "ko-f2-17",
    "stage": 2,
    "fn": "request-action",
    "pattern": "___에서 세워 주세요.",
    "core": [
      "서 세워 주세요"
    ],
    "meaning": {
      "en": "Telling a driver where to stop: Please stop at ___.",
      "ko": "해 달라고 부탁하기: ___에서 세워 주세요."
    },
    "grammar": [
      7
    ],
    "expressions": [
      "여기서 세워 주세요"
    ],
    "examples": [
      {
        "text": "역 입구 앞에서 세워 주세요.",
        "slot": "역 입구 앞",
        "cue": {
          "en": "in front of the station entrance",
          "ko": "역 입구 앞"
        },
        "gloss": {
          "en": "Please stop in front of the station entrance.",
          "ko": "역 입구 앞에서 세워 주세요."
        }
      },
      {
        "text": "저 편의점 앞에서 세워 주세요.",
        "slot": "저 편의점 앞",
        "cue": {
          "en": "in front of that convenience store",
          "ko": "저 편의점 앞"
        },
        "gloss": {
          "en": "Please stop in front of that convenience store.",
          "ko": "저 편의점 앞에서 세워 주세요."
        }
      },
      {
        "text": "다음 신호등에서 세워 주세요.",
        "slot": "다음 신호등",
        "cue": {
          "en": "the next traffic light",
          "ko": "다음 신호등"
        },
        "gloss": {
          "en": "Please stop at the next traffic light.",
          "ko": "다음 신호등에서 세워 주세요."
        }
      },
      {
        "text": "횡단보도 앞에서 세워 주세요.",
        "slot": "횡단보도 앞",
        "cue": {
          "en": "before the crosswalk",
          "ko": "횡단보도 앞"
        },
        "gloss": {
          "en": "Please stop before the crosswalk.",
          "ko": "횡단보도 앞에서 세워 주세요."
        }
      }
    ]
  },
  {
    "id": "ko-f2-18",
    "stage": 2,
    "fn": "directions",
    "pattern": "___은/는 어디서 내려요?",
    "core": [
      "어디서 내려요"
    ],
    "meaning": {
      "en": "Asking where to get off: Where do I get off for ___?",
      "ko": "길 묻기: ___은/는 어디서 내려요?"
    },
    "grammar": [],
    "expressions": [
      "어디서 내려요"
    ],
    "examples": [
      {
        "text": "시장은 어디서 내려요?",
        "slot": "시장",
        "cue": {
          "en": "the market",
          "ko": "시장"
        },
        "gloss": {
          "en": "Where do I get off for the market?",
          "ko": "시장은 어디서 내려요?"
        }
      },
      {
        "text": "명동은 어디서 내려요?",
        "slot": "명동",
        "cue": {
          "en": "Myeongdong",
          "ko": "명동"
        },
        "gloss": {
          "en": "Where do I get off for Myeongdong?",
          "ko": "명동은 어디서 내려요?"
        }
      },
      {
        "text": "경복궁은 어디서 내려요?",
        "slot": "경복궁",
        "cue": {
          "en": "Gyeongbokgung Palace",
          "ko": "경복궁"
        },
        "gloss": {
          "en": "Where do I get off for Gyeongbokgung?",
          "ko": "경복궁은 어디서 내려요?"
        }
      },
      {
        "text": "서울대병원은 어디서 내려요?",
        "slot": "서울대병원",
        "cue": {
          "en": "Seoul National University Hospital",
          "ko": "서울대병원"
        },
        "gloss": {
          "en": "Where do I get off for SNU Hospital?",
          "ko": "서울대병원은 어디서 내려요?"
        }
      }
    ]
  },
  {
    "id": "ko-f2-19",
    "stage": 2,
    "fn": "apologize",
    "pattern": "___서 미안해요.",
    "core": [
      "서 미안해요"
    ],
    "meaning": {
      "en": "Apologizing for something: Sorry for ___.",
      "ko": "사과하기: ___서 미안해요."
    },
    "grammar": [],
    "expressions": [
      "늦어서 미안해요"
    ],
    "examples": [
      {
        "text": "늦어서 미안해요.",
        "slot": "늦어",
        "cue": {
          "en": "be late",
          "ko": "늦다"
        },
        "gloss": {
          "en": "Sorry I'm late.",
          "ko": "늦어서 미안해요."
        }
      },
      {
        "text": "연락을 못 해서 미안해요.",
        "slot": "연락을 못 해",
        "cue": {
          "en": "not get in touch",
          "ko": "연락을 못 하다"
        },
        "gloss": {
          "en": "Sorry I couldn't get in touch.",
          "ko": "연락을 못 해서 미안해요."
        }
      },
      {
        "text": "답장이 늦어서 미안해요.",
        "slot": "답장이 늦어",
        "cue": {
          "en": "reply late",
          "ko": "답장이 늦다"
        },
        "gloss": {
          "en": "Sorry for the late reply.",
          "ko": "답장이 늦어서 미안해요."
        }
      },
      {
        "text": "기다리게 해서 미안해요.",
        "slot": "기다리게 해",
        "cue": {
          "en": "keep (someone) waiting",
          "ko": "기다리게 하다"
        },
        "gloss": {
          "en": "Sorry for keeping you waiting.",
          "ko": "기다리게 해서 미안해요."
        }
      }
    ]
  },
  {
    "id": "ko-f2-20",
    "stage": 2,
    "fn": "feel",
    "pattern": "저 진짜 ___.",
    "core": [
      "저 진짜"
    ],
    "meaning": {
      "en": "Saying how you feel: I'm really ___.",
      "ko": "기분·몸 상태 말하기: 저 진짜 ___."
    },
    "grammar": [],
    "expressions": [
      "배고파요",
      "피곤해요"
    ],
    "examples": [
      {
        "text": "저 진짜 배고파요.",
        "slot": "배고파요",
        "cue": {
          "en": "hungry",
          "ko": "배고프다"
        },
        "gloss": {
          "en": "I'm really hungry.",
          "ko": "저 진짜 배고파요."
        }
      },
      {
        "text": "저 진짜 피곤해요.",
        "slot": "피곤해요",
        "cue": {
          "en": "tired",
          "ko": "피곤하다"
        },
        "gloss": {
          "en": "I'm really tired.",
          "ko": "저 진짜 피곤해요."
        }
      },
      {
        "text": "저 진짜 졸려요.",
        "slot": "졸려요",
        "cue": {
          "en": "sleepy",
          "ko": "졸리다"
        },
        "gloss": {
          "en": "I'm really sleepy.",
          "ko": "저 진짜 졸려요."
        }
      },
      {
        "text": "저 진짜 행복해요.",
        "slot": "행복해요",
        "cue": {
          "en": "happy",
          "ko": "행복하다"
        },
        "gloss": {
          "en": "I'm really happy.",
          "ko": "저 진짜 행복해요."
        }
      }
    ]
  },
  {
    "id": "ko-f3-01",
    "stage": 3,
    "fn": "reason",
    "pattern": "___아서/어서 잠을 못 잤어요.",
    "core": [
      "잠을 못 잤어요"
    ],
    "meaning": {
      "en": "Giving a reason: I couldn't sleep because ___.",
      "ko": "이유 말하기: ___아서/어서 잠을 못 잤어요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "방이 너무 더워서 잠을 못 잤어요.",
        "slot": "방이 너무 더워",
        "cue": {
          "en": "the room is too hot",
          "ko": "방이 너무 덥다"
        },
        "gloss": {
          "en": "I couldn't sleep because the room was too hot.",
          "ko": "방이 너무 더워서 잠을 못 잤어요."
        }
      },
      {
        "text": "커피를 많이 마셔서 잠을 못 잤어요.",
        "slot": "커피를 많이 마셔",
        "cue": {
          "en": "drink a lot of coffee",
          "ko": "커피를 많이 마시다"
        },
        "gloss": {
          "en": "I couldn't sleep because I drank a lot of coffee.",
          "ko": "커피를 많이 마셔서 잠을 못 잤어요."
        }
      },
      {
        "text": "옆방이 시끄러워서 잠을 못 잤어요.",
        "slot": "옆방이 시끄러워",
        "cue": {
          "en": "the next room is noisy",
          "ko": "옆방이 시끄럽다"
        },
        "gloss": {
          "en": "I couldn't sleep because the next room was noisy.",
          "ko": "옆방이 시끄러워서 잠을 못 잤어요."
        }
      },
      {
        "text": "걱정이 많아서 잠을 못 잤어요.",
        "slot": "걱정이 많아",
        "cue": {
          "en": "have a lot of worries",
          "ko": "걱정이 많다"
        },
        "gloss": {
          "en": "I couldn't sleep because I was worried.",
          "ko": "걱정이 많아서 잠을 못 잤어요."
        }
      }
    ]
  },
  {
    "id": "ko-f3-02",
    "stage": 3,
    "fn": "sympathy",
    "pattern": "___아서/어서 다행이에요.",
    "core": [
      "서 다행이에요"
    ],
    "meaning": {
      "en": "Expressing relief: I'm glad that ___.",
      "ko": "공감·위로하기: ___아서/어서 다행이에요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "잘 끝나서 다행이에요.",
        "slot": "잘 끝나",
        "cue": {
          "en": "end well",
          "ko": "잘 끝나다"
        },
        "gloss": {
          "en": "I'm glad it went well.",
          "ko": "잘 끝나서 다행이에요."
        }
      },
      {
        "text": "안 다쳐서 다행이에요.",
        "slot": "안 다쳐",
        "cue": {
          "en": "not get hurt",
          "ko": "안 다치다"
        },
        "gloss": {
          "en": "I'm glad you didn't get hurt.",
          "ko": "안 다쳐서 다행이에요."
        }
      },
      {
        "text": "비가 그쳐서 다행이에요.",
        "slot": "비가 그쳐",
        "cue": {
          "en": "the rain stops",
          "ko": "비가 그치다"
        },
        "gloss": {
          "en": "I'm glad the rain stopped.",
          "ko": "비가 그쳐서 다행이에요."
        }
      },
      {
        "text": "자리가 있어서 다행이에요.",
        "slot": "자리가 있어",
        "cue": {
          "en": "there are seats",
          "ko": "자리가 있다"
        },
        "gloss": {
          "en": "Good thing there are seats.",
          "ko": "자리가 있어서 다행이에요."
        }
      }
    ]
  },
  {
    "id": "ko-f3-03",
    "stage": 3,
    "fn": "advice-give",
    "pattern": "___(으)니까 택시 타요.",
    "core": [
      "니까 택시 타요"
    ],
    "meaning": {
      "en": "Suggesting with a reason: Since ___, let's take a taxi.",
      "ko": "조언하기: ___(으)니까 택시 타요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "시간이 없으니까 택시 타요.",
        "slot": "시간이 없으",
        "cue": {
          "en": "there's no time",
          "ko": "시간이 없다"
        },
        "gloss": {
          "en": "We don't have time, so let's take a taxi.",
          "ko": "시간이 없으니까 택시 타요."
        }
      },
      {
        "text": "비가 오니까 택시 타요.",
        "slot": "비가 오",
        "cue": {
          "en": "it's raining",
          "ko": "비가 오다"
        },
        "gloss": {
          "en": "It's raining, so let's take a taxi.",
          "ko": "비가 오니까 택시 타요."
        }
      },
      {
        "text": "짐이 많으니까 택시 타요.",
        "slot": "짐이 많으",
        "cue": {
          "en": "have a lot of luggage",
          "ko": "짐이 많다"
        },
        "gloss": {
          "en": "We have a lot of bags, so let's take a taxi.",
          "ko": "짐이 많으니까 택시 타요."
        }
      },
      {
        "text": "너무 늦었으니까 택시 타요.",
        "slot": "너무 늦었으",
        "cue": {
          "en": "it's gotten too late",
          "ko": "너무 늦다"
        },
        "gloss": {
          "en": "It's too late, so let's take a taxi.",
          "ko": "너무 늦었으니까 택시 타요."
        }
      }
    ]
  },
  {
    "id": "ko-f3-04",
    "stage": 3,
    "fn": "polite-request",
    "pattern": "___고 싶은데요.",
    "core": [
      "고 싶은데요"
    ],
    "meaning": {
      "en": "Making a soft request: I'd like to ___ (if possible).",
      "ko": "더 공손하게 부탁하기: ___고 싶은데요."
    },
    "grammar": [
      2
    ],
    "expressions": [
      "교환하고 싶은데요"
    ],
    "examples": [
      {
        "text": "이거 교환하고 싶은데요.",
        "slot": "교환하",
        "cue": {
          "en": "exchange",
          "ko": "교환하다"
        },
        "gloss": {
          "en": "I'd like to exchange this.",
          "ko": "이거 교환하고 싶은데요."
        }
      },
      {
        "text": "환불받고 싶은데요.",
        "slot": "환불받",
        "cue": {
          "en": "get a refund",
          "ko": "환불받다"
        },
        "gloss": {
          "en": "I'd like a refund.",
          "ko": "환불받고 싶은데요."
        }
      },
      {
        "text": "오늘 저녁 예약하고 싶은데요.",
        "slot": "예약하",
        "cue": {
          "en": "make a reservation",
          "ko": "예약하다"
        },
        "gloss": {
          "en": "I'd like to book for tonight.",
          "ko": "오늘 저녁 예약하고 싶은데요."
        }
      },
      {
        "text": "자리를 바꾸고 싶은데요.",
        "slot": "자리를 바꾸",
        "cue": {
          "en": "change seats",
          "ko": "자리를 바꾸다"
        },
        "gloss": {
          "en": "I'd like to change seats.",
          "ko": "자리를 바꾸고 싶은데요."
        }
      }
    ]
  },
  {
    "id": "ko-f3-05",
    "stage": 3,
    "fn": "phone-call",
    "pattern": "안녕하세요, ___인데요.",
    "core": [
      "인데요"
    ],
    "meaning": {
      "en": "Saying who's calling or speaking: Hello, this is ___.",
      "ko": "전화로 말하기: 안녕하세요, ___인데요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "안녕하세요, 이백삼 호인데요.",
        "slot": "이백삼 호",
        "cue": {
          "en": "room two-oh-three",
          "ko": "이백삼 호"
        },
        "gloss": {
          "en": "Hello, this is room two-oh-three.",
          "ko": "안녕하세요, 이백삼 호인데요."
        }
      },
      {
        "text": "안녕하세요, 리사인데요.",
        "slot": "리사",
        "cue": {
          "en": "Lisa (your name)",
          "ko": "리사(내 이름)"
        },
        "gloss": {
          "en": "Hello, this is Lisa.",
          "ko": "안녕하세요, 리사인데요."
        }
      },
      {
        "text": "안녕하세요, 택배인데요.",
        "slot": "택배",
        "cue": {
          "en": "delivery",
          "ko": "택배"
        },
        "gloss": {
          "en": "Hello, it's the delivery.",
          "ko": "안녕하세요, 택배인데요."
        }
      },
      {
        "text": "안녕하세요, 옆집인데요.",
        "slot": "옆집",
        "cue": {
          "en": "next door",
          "ko": "옆집"
        },
        "gloss": {
          "en": "Hello, it's your neighbor next door.",
          "ko": "안녕하세요, 옆집인데요."
        }
      }
    ]
  },
  {
    "id": "ko-f3-06",
    "stage": 3,
    "fn": "invite",
    "pattern": "지금 ___에 가는데 같이 갈래요?",
    "core": [
      "가는데 같이 갈래요"
    ],
    "meaning": {
      "en": "Inviting with background: I'm heading to ___ now — want to come?",
      "ko": "같이 하자고 하기: 지금 ___에 가는데 같이 갈래요?"
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "지금 편의점에 가는데 같이 갈래요?",
        "slot": "편의점",
        "cue": {
          "en": "convenience store",
          "ko": "편의점"
        },
        "gloss": {
          "en": "I'm going to the convenience store now — want to come?",
          "ko": "지금 편의점에 가는데 같이 갈래요?"
        }
      },
      {
        "text": "지금 카페에 가는데 같이 갈래요?",
        "slot": "카페",
        "cue": {
          "en": "café",
          "ko": "카페"
        },
        "gloss": {
          "en": "I'm going to a café now — want to come?",
          "ko": "지금 카페에 가는데 같이 갈래요?"
        }
      },
      {
        "text": "지금 도서관에 가는데 같이 갈래요?",
        "slot": "도서관",
        "cue": {
          "en": "library",
          "ko": "도서관"
        },
        "gloss": {
          "en": "I'm going to the library now — want to come?",
          "ko": "지금 도서관에 가는데 같이 갈래요?"
        }
      },
      {
        "text": "지금 식당에 가는데 같이 갈래요?",
        "slot": "식당",
        "cue": {
          "en": "restaurant",
          "ko": "식당"
        },
        "gloss": {
          "en": "I'm going to eat now — want to come?",
          "ko": "지금 식당에 가는데 같이 갈래요?"
        }
      }
    ]
  },
  {
    "id": "ko-f3-07",
    "stage": 3,
    "fn": "lost-problem",
    "pattern": "___에 문제가 생겼어요.",
    "core": [
      "문제가 생겼어요"
    ],
    "meaning": {
      "en": "Reporting a problem: There's a problem with ___.",
      "ko": "문제 알리기: ___에 문제가 생겼어요."
    },
    "grammar": [],
    "expressions": [
      "문제가 생겼어요"
    ],
    "examples": [
      {
        "text": "방에 문제가 생겼어요.",
        "slot": "방",
        "cue": {
          "en": "the room",
          "ko": "방"
        },
        "gloss": {
          "en": "There's a problem with my room.",
          "ko": "방에 문제가 생겼어요."
        }
      },
      {
        "text": "주문에 문제가 생겼어요.",
        "slot": "주문",
        "cue": {
          "en": "the order",
          "ko": "주문"
        },
        "gloss": {
          "en": "There's a problem with my order.",
          "ko": "주문에 문제가 생겼어요."
        }
      },
      {
        "text": "예약에 문제가 생겼어요.",
        "slot": "예약",
        "cue": {
          "en": "the reservation",
          "ko": "예약"
        },
        "gloss": {
          "en": "There's a problem with my reservation.",
          "ko": "예약에 문제가 생겼어요."
        }
      },
      {
        "text": "컴퓨터에 문제가 생겼어요.",
        "slot": "컴퓨터",
        "cue": {
          "en": "the computer",
          "ko": "컴퓨터"
        },
        "gloss": {
          "en": "Something's wrong with the computer.",
          "ko": "컴퓨터에 문제가 생겼어요."
        }
      }
    ]
  },
  {
    "id": "ko-f3-08",
    "stage": 3,
    "fn": "condition",
    "pattern": "___(으)면 연락 주세요.",
    "core": [
      "면 연락 주세요"
    ],
    "meaning": {
      "en": "Saying what to do if/when: If/When ___, let me know.",
      "ko": "조건 말하기: ___(으)면 연락 주세요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "시간 있으면 연락 주세요.",
        "slot": "시간 있으",
        "cue": {
          "en": "have time",
          "ko": "시간(이) 있다"
        },
        "gloss": {
          "en": "Get in touch if you have time.",
          "ko": "시간 있으면 연락 주세요."
        }
      },
      {
        "text": "도착하면 연락 주세요.",
        "slot": "도착하",
        "cue": {
          "en": "arrive",
          "ko": "도착하다"
        },
        "gloss": {
          "en": "Let me know when you arrive.",
          "ko": "도착하면 연락 주세요."
        }
      },
      {
        "text": "문제가 있으면 연락 주세요.",
        "slot": "문제가 있으",
        "cue": {
          "en": "there's a problem",
          "ko": "문제가 있다"
        },
        "gloss": {
          "en": "Contact me if there's a problem.",
          "ko": "문제가 있으면 연락 주세요."
        }
      },
      {
        "text": "수업이 끝나면 연락 주세요.",
        "slot": "수업이 끝나",
        "cue": {
          "en": "class ends",
          "ko": "수업이 끝나다"
        },
        "gloss": {
          "en": "Let me know when class is over.",
          "ko": "수업이 끝나면 연락 주세요."
        }
      }
    ]
  },
  {
    "id": "ko-f3-09",
    "stage": 3,
    "fn": "exchange-return",
    "pattern": "___ 가능해요?",
    "core": [
      "가능해요"
    ],
    "meaning": {
      "en": "Asking if something is possible: Is ___ possible?",
      "ko": "교환·환불 요청하기: ___ 가능해요?"
    },
    "grammar": [],
    "expressions": [
      "환불 가능해요"
    ],
    "examples": [
      {
        "text": "환불 가능해요?",
        "slot": "환불",
        "cue": {
          "en": "refund",
          "ko": "환불"
        },
        "gloss": {
          "en": "Can I get a refund?",
          "ko": "환불 가능해요?"
        }
      },
      {
        "text": "교환 가능해요?",
        "slot": "교환",
        "cue": {
          "en": "exchange",
          "ko": "교환"
        },
        "gloss": {
          "en": "Can I exchange it?",
          "ko": "교환 가능해요?"
        }
      },
      {
        "text": "오늘 예약 가능해요?",
        "slot": "예약",
        "cue": {
          "en": "reservation",
          "ko": "예약"
        },
        "gloss": {
          "en": "Can I book for today?",
          "ko": "오늘 예약 가능해요?"
        }
      },
      {
        "text": "반품 가능해요?",
        "slot": "반품",
        "cue": {
          "en": "return (an item)",
          "ko": "반품"
        },
        "gloss": {
          "en": "Can I return it?",
          "ko": "반품 가능해요?"
        }
      }
    ]
  },
  {
    "id": "ko-f3-10",
    "stage": 3,
    "fn": "plan-intent",
    "pattern": "제가 ___할게요.",
    "core": [
      "할게요"
    ],
    "meaning": {
      "en": "Offering or promising to do something: I'll ___.",
      "ko": "하려는 것 말하기: 제가 ___할게요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "제가 연락할게요.",
        "slot": "연락",
        "cue": {
          "en": "get in touch",
          "ko": "연락하다"
        },
        "gloss": {
          "en": "I'll get in touch.",
          "ko": "제가 연락할게요."
        }
      },
      {
        "text": "제가 확인할게요.",
        "slot": "확인",
        "cue": {
          "en": "check",
          "ko": "확인하다"
        },
        "gloss": {
          "en": "I'll check.",
          "ko": "제가 확인할게요."
        }
      },
      {
        "text": "제가 예약할게요.",
        "slot": "예약",
        "cue": {
          "en": "book",
          "ko": "예약하다"
        },
        "gloss": {
          "en": "I'll make the reservation.",
          "ko": "제가 예약할게요."
        }
      },
      {
        "text": "제가 계산할게요.",
        "slot": "계산",
        "cue": {
          "en": "pay (the bill)",
          "ko": "계산하다"
        },
        "gloss": {
          "en": "I'll get the bill.",
          "ko": "제가 계산할게요."
        }
      }
    ]
  },
  {
    "id": "ko-f3-11",
    "stage": 3,
    "fn": "plan-intent",
    "pattern": "제가 ___ 드릴게요.",
    "core": [
      "드릴게요"
    ],
    "meaning": {
      "en": "Offering to do something for someone: I'll ___ for you.",
      "ko": "하려는 것 말하기: 제가 ___ 드릴게요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "제가 보내 드릴게요.",
        "slot": "보내",
        "cue": {
          "en": "send",
          "ko": "보내다"
        },
        "gloss": {
          "en": "I'll send it to you.",
          "ko": "제가 보내 드릴게요."
        }
      },
      {
        "text": "제가 도와 드릴게요.",
        "slot": "도와",
        "cue": {
          "en": "help",
          "ko": "돕다"
        },
        "gloss": {
          "en": "I'll help you.",
          "ko": "제가 도와 드릴게요."
        }
      },
      {
        "text": "제가 알려 드릴게요.",
        "slot": "알려",
        "cue": {
          "en": "let (someone) know",
          "ko": "알리다"
        },
        "gloss": {
          "en": "I'll let you know.",
          "ko": "제가 알려 드릴게요."
        }
      },
      {
        "text": "제가 찾아 드릴게요.",
        "slot": "찾아",
        "cue": {
          "en": "find",
          "ko": "찾다"
        },
        "gloss": {
          "en": "I'll find it for you.",
          "ko": "제가 찾아 드릴게요."
        }
      }
    ]
  },
  {
    "id": "ko-f3-12",
    "stage": 3,
    "fn": "try-doing",
    "pattern": "___해 보겠습니다.",
    "core": [
      "해 보겠습니다"
    ],
    "meaning": {
      "en": "Saying you'll try (formal): I'll ___ (and see).",
      "ko": "해 보겠다고 말하기: ___해 보겠습니다."
    },
    "grammar": [],
    "expressions": [
      "확인해 보겠습니다"
    ],
    "examples": [
      {
        "text": "바로 확인해 보겠습니다.",
        "slot": "확인",
        "cue": {
          "en": "check",
          "ko": "확인하다"
        },
        "gloss": {
          "en": "I'll check right away.",
          "ko": "바로 확인해 보겠습니다."
        }
      },
      {
        "text": "다시 정리해 보겠습니다.",
        "slot": "정리",
        "cue": {
          "en": "organize",
          "ko": "정리하다"
        },
        "gloss": {
          "en": "I'll try organizing it again.",
          "ko": "다시 정리해 보겠습니다."
        }
      },
      {
        "text": "한번 준비해 보겠습니다.",
        "slot": "준비",
        "cue": {
          "en": "prepare",
          "ko": "준비하다"
        },
        "gloss": {
          "en": "I'll try preparing it.",
          "ko": "한번 준비해 보겠습니다."
        }
      },
      {
        "text": "오늘 안에 수정해 보겠습니다.",
        "slot": "수정",
        "cue": {
          "en": "revise",
          "ko": "수정하다"
        },
        "gloss": {
          "en": "I'll try to revise it by today.",
          "ko": "오늘 안에 수정해 보겠습니다."
        }
      }
    ]
  },
  {
    "id": "ko-f3-13",
    "stage": 3,
    "fn": "experience",
    "pattern": "___에 가 본 적이 있어요.",
    "core": [
      "적이 있어요",
      "적 있어"
    ],
    "meaning": {
      "en": "Saying what you've done before: I've been to ___.",
      "ko": "해 본 적 있는지 말하기: ___에 가 본 적이 있어요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "제주도에 가 본 적이 있어요.",
        "slot": "제주도",
        "cue": {
          "en": "Jeju Island",
          "ko": "제주도"
        },
        "gloss": {
          "en": "I've been to Jeju Island.",
          "ko": "제주도에 가 본 적이 있어요."
        }
      },
      {
        "text": "부산에 가 본 적이 있어요.",
        "slot": "부산",
        "cue": {
          "en": "Busan",
          "ko": "부산"
        },
        "gloss": {
          "en": "I've been to Busan.",
          "ko": "부산에 가 본 적이 있어요."
        }
      },
      {
        "text": "일본에 가 본 적이 있어요.",
        "slot": "일본",
        "cue": {
          "en": "Japan",
          "ko": "일본"
        },
        "gloss": {
          "en": "I've been to Japan.",
          "ko": "일본에 가 본 적이 있어요."
        }
      },
      {
        "text": "그 식당에 가 본 적이 있어요.",
        "slot": "그 식당",
        "cue": {
          "en": "that restaurant",
          "ko": "그 식당"
        },
        "gloss": {
          "en": "I've been to that restaurant.",
          "ko": "그 식당에 가 본 적이 있어요."
        }
      }
    ]
  },
  {
    "id": "ko-f3-14",
    "stage": 3,
    "fn": "reason",
    "pattern": "내일 ___이/가 있기 때문에 못 가요.",
    "core": [
      "있기 때문에"
    ],
    "meaning": {
      "en": "Giving a firm reason: I can't go because I have ___ tomorrow.",
      "ko": "이유 말하기: 내일 ___이/가 있기 때문에 못 가요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "내일 시험이 있기 때문에 못 가요.",
        "slot": "시험",
        "cue": {
          "en": "exam",
          "ko": "시험"
        },
        "gloss": {
          "en": "I can't go because I have an exam tomorrow.",
          "ko": "내일 시험이 있기 때문에 못 가요."
        }
      },
      {
        "text": "내일 수업이 있기 때문에 못 가요.",
        "slot": "수업",
        "cue": {
          "en": "class",
          "ko": "수업"
        },
        "gloss": {
          "en": "I can't go because I have class tomorrow.",
          "ko": "내일 수업이 있기 때문에 못 가요."
        }
      },
      {
        "text": "내일 약속이 있기 때문에 못 가요.",
        "slot": "약속",
        "cue": {
          "en": "plans",
          "ko": "약속"
        },
        "gloss": {
          "en": "I can't go because I have plans tomorrow.",
          "ko": "내일 약속이 있기 때문에 못 가요."
        }
      },
      {
        "text": "내일 회의가 있기 때문에 못 가요.",
        "slot": "회의",
        "cue": {
          "en": "meeting",
          "ko": "회의"
        },
        "gloss": {
          "en": "I can't go because I have a meeting tomorrow.",
          "ko": "내일 회의가 있기 때문에 못 가요."
        }
      }
    ]
  },
  {
    "id": "ko-f3-15",
    "stage": 3,
    "fn": "ask-opinion",
    "pattern": "___은/는 어떻게 생각해요?",
    "core": [
      "어떻게 생각해"
    ],
    "meaning": {
      "en": "Asking what someone thinks: What do you think about ___?",
      "ko": "상대 생각 묻기: ___은/는 어떻게 생각해요?"
    },
    "grammar": [],
    "expressions": [
      "어떻게 생각해요"
    ],
    "examples": [
      {
        "text": "이 결말은 어떻게 생각해요?",
        "slot": "이 결말",
        "cue": {
          "en": "this ending",
          "ko": "이 결말"
        },
        "gloss": {
          "en": "What do you think of this ending?",
          "ko": "이 결말은 어떻게 생각해요?"
        }
      },
      {
        "text": "그 계획은 어떻게 생각해요?",
        "slot": "그 계획",
        "cue": {
          "en": "that plan",
          "ko": "그 계획"
        },
        "gloss": {
          "en": "What do you think of that plan?",
          "ko": "그 계획은 어떻게 생각해요?"
        }
      },
      {
        "text": "새 디자인은 어떻게 생각해요?",
        "slot": "새 디자인",
        "cue": {
          "en": "the new design",
          "ko": "새 디자인"
        },
        "gloss": {
          "en": "What do you think of the new design?",
          "ko": "새 디자인은 어떻게 생각해요?"
        }
      },
      {
        "text": "민수 씨는 어떻게 생각해요?",
        "slot": "민수 씨",
        "cue": {
          "en": "Minsu (the person you ask)",
          "ko": "민수 씨(묻는 상대)"
        },
        "gloss": {
          "en": "What do you think, Minsu?",
          "ko": "민수 씨는 어떻게 생각해요?"
        }
      }
    ]
  },
  {
    "id": "ko-f3-16",
    "stage": 3,
    "fn": "opinion",
    "pattern": "제 생각에는 ___이/가 제일 좋아요.",
    "core": [
      "제 생각에는"
    ],
    "meaning": {
      "en": "Giving your opinion: In my opinion, ___ is the best.",
      "ko": "내 생각 말하기: 제 생각에는 ___이/가 제일 좋아요."
    },
    "grammar": [],
    "expressions": [
      "제 생각에는"
    ],
    "examples": [
      {
        "text": "제 생각에는 학교 앞 고깃집이 제일 좋아요.",
        "slot": "학교 앞 고깃집",
        "cue": {
          "en": "the barbecue place by school",
          "ko": "학교 앞 고깃집"
        },
        "gloss": {
          "en": "I think the barbecue place by school is best.",
          "ko": "제 생각에는 학교 앞 고깃집이 제일 좋아요."
        }
      },
      {
        "text": "제 생각에는 이 색이 제일 좋아요.",
        "slot": "이 색",
        "cue": {
          "en": "this color",
          "ko": "이 색"
        },
        "gloss": {
          "en": "I think this color is best.",
          "ko": "제 생각에는 이 색이 제일 좋아요."
        }
      },
      {
        "text": "제 생각에는 지하철이 제일 좋아요.",
        "slot": "지하철",
        "cue": {
          "en": "the subway",
          "ko": "지하철"
        },
        "gloss": {
          "en": "I think the subway is best.",
          "ko": "제 생각에는 지하철이 제일 좋아요."
        }
      },
      {
        "text": "제 생각에는 금요일이 제일 좋아요.",
        "slot": "금요일",
        "cue": {
          "en": "Friday",
          "ko": "금요일"
        },
        "gloss": {
          "en": "I think Friday is best.",
          "ko": "제 생각에는 금요일이 제일 좋아요."
        }
      }
    ]
  },
  {
    "id": "ko-f3-17",
    "stage": 3,
    "fn": "disagree-soft",
    "pattern": "___은/는 좀…",
    "core": [
      "좀…"
    ],
    "meaning": {
      "en": "Hinting you'd rather not: ___ is a bit… (not for me).",
      "ko": "부드럽게 반대하기: ___은/는 좀…"
    },
    "grammar": [],
    "expressions": [
      "그건 좀"
    ],
    "examples": [
      {
        "text": "노래방은 좀…",
        "slot": "노래방",
        "cue": {
          "en": "karaoke",
          "ko": "노래방"
        },
        "gloss": {
          "en": "Karaoke is a bit… (not my thing).",
          "ko": "노래방은 좀…"
        }
      },
      {
        "text": "그날은 좀…",
        "slot": "그날",
        "cue": {
          "en": "that day",
          "ko": "그날"
        },
        "gloss": {
          "en": "That day is a bit… (hard for me).",
          "ko": "그날은 좀…"
        }
      },
      {
        "text": "매운 음식은 좀…",
        "slot": "매운 음식",
        "cue": {
          "en": "spicy food",
          "ko": "매운 음식"
        },
        "gloss": {
          "en": "Spicy food is a bit… (too much for me).",
          "ko": "매운 음식은 좀…"
        }
      },
      {
        "text": "공포 영화는 좀…",
        "slot": "공포 영화",
        "cue": {
          "en": "horror movies",
          "ko": "공포 영화"
        },
        "gloss": {
          "en": "Horror movies are a bit… (not for me).",
          "ko": "공포 영화는 좀…"
        }
      }
    ]
  },
  {
    "id": "ko-f3-18",
    "stage": 3,
    "fn": "plan-intent",
    "pattern": "___은/는 내가 가져갈게.",
    "core": [
      "내가 가져갈게"
    ],
    "meaning": {
      "en": "Casually promising to bring something: I'll bring the ___.",
      "ko": "하려는 것 말하기(반말): ___은/는 내가 가져갈게."
    },
    "grammar": [
      4,
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "맥주는 내가 가져갈게.",
        "slot": "맥주",
        "cue": {
          "en": "beer",
          "ko": "맥주"
        },
        "gloss": {
          "en": "I'll bring the beer.",
          "ko": "맥주는 내가 가져갈게."
        }
      },
      {
        "text": "과자는 내가 가져갈게.",
        "slot": "과자",
        "cue": {
          "en": "snacks",
          "ko": "과자"
        },
        "gloss": {
          "en": "I'll bring the snacks.",
          "ko": "과자는 내가 가져갈게."
        }
      },
      {
        "text": "음료수는 내가 가져갈게.",
        "slot": "음료수",
        "cue": {
          "en": "drinks",
          "ko": "음료수"
        },
        "gloss": {
          "en": "I'll bring the drinks.",
          "ko": "음료수는 내가 가져갈게."
        }
      },
      {
        "text": "우산은 내가 가져갈게.",
        "slot": "우산",
        "cue": {
          "en": "umbrella",
          "ko": "우산"
        },
        "gloss": {
          "en": "I'll bring an umbrella.",
          "ko": "우산은 내가 가져갈게."
        }
      }
    ]
  },
  {
    "id": "ko-f3-19",
    "stage": 3,
    "fn": "request-action",
    "pattern": "___하지 마.",
    "core": [
      "하지 마"
    ],
    "meaning": {
      "en": "Telling a friend not to do something: Don't ___.",
      "ko": "해 달라고 부탁하기(반말): ___하지 마."
    },
    "grammar": [
      7
    ],
    "expressions": [
      "스포 하지 마"
    ],
    "examples": [
      {
        "text": "스포 하지 마!",
        "slot": "스포",
        "cue": {
          "en": "give spoilers",
          "ko": "스포(일러)하다"
        },
        "gloss": {
          "en": "No spoilers!",
          "ko": "스포 하지 마!"
        }
      },
      {
        "text": "걱정하지 마.",
        "slot": "걱정",
        "cue": {
          "en": "worry",
          "ko": "걱정하다"
        },
        "gloss": {
          "en": "Don't worry.",
          "ko": "걱정하지 마."
        }
      },
      {
        "text": "무리하지 마.",
        "slot": "무리",
        "cue": {
          "en": "overdo it",
          "ko": "무리하다"
        },
        "gloss": {
          "en": "Don't overdo it.",
          "ko": "무리하지 마."
        }
      },
      {
        "text": "거짓말하지 마.",
        "slot": "거짓말",
        "cue": {
          "en": "lie",
          "ko": "거짓말하다"
        },
        "gloss": {
          "en": "Don't lie.",
          "ko": "거짓말하지 마."
        }
      }
    ]
  },
  {
    "id": "ko-f3-20",
    "stage": 3,
    "fn": "request-action",
    "pattern": "___ 말해.",
    "core": [
      "말해.",
      "말해 줘"
    ],
    "meaning": {
      "en": "Telling a friend how to talk: Just say it ___.",
      "ko": "해 달라고 부탁하기(반말): ___ 말해."
    },
    "grammar": [
      7
    ],
    "expressions": [
      "편하게 말해"
    ],
    "examples": [
      {
        "text": "편하게 말해.",
        "slot": "편하게",
        "cue": {
          "en": "comfortably (casually)",
          "ko": "편하게"
        },
        "gloss": {
          "en": "Talk casually with me.",
          "ko": "편하게 말해."
        }
      },
      {
        "text": "천천히 말해.",
        "slot": "천천히",
        "cue": {
          "en": "slowly",
          "ko": "천천히"
        },
        "gloss": {
          "en": "Speak slowly.",
          "ko": "천천히 말해."
        }
      },
      {
        "text": "솔직하게 말해.",
        "slot": "솔직하게",
        "cue": {
          "en": "honestly",
          "ko": "솔직하게"
        },
        "gloss": {
          "en": "Be honest.",
          "ko": "솔직하게 말해."
        }
      },
      {
        "text": "그냥 말해.",
        "slot": "그냥",
        "cue": {
          "en": "just (go ahead)",
          "ko": "그냥"
        },
        "gloss": {
          "en": "Just tell me.",
          "ko": "그냥 말해."
        }
      }
    ]
  },
  {
    "id": "ko-f4-01",
    "stage": 4,
    "fn": "report",
    "pattern": "___아/어 달래요.",
    "core": [
      "달래요"
    ],
    "meaning": {
      "en": "Passing on a request: They asked (me) to ___.",
      "ko": "부탁 전하기: ___아/어 달래요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "김 과장님께서 견적서를 다시 보내 달래요.",
        "slot": "김 과장님께서 견적서를 다시 보내",
        "cue": {
          "en": "send the quote again",
          "ko": "견적서를 다시 보내다"
        },
        "gloss": {
          "en": "Manager Kim asked us to send the quote again.",
          "ko": "김 과장님께서 견적서를 다시 보내 달래요."
        }
      },
      {
        "text": "팀장님이 자료를 오늘까지 정리해 달래요.",
        "slot": "팀장님이 자료를 오늘까지 정리해",
        "cue": {
          "en": "organize the materials by today",
          "ko": "자료를 오늘까지 정리하다"
        },
        "gloss": {
          "en": "The team leader asked me to organize the materials by today.",
          "ko": "팀장님이 자료를 오늘까지 정리해 달래요."
        }
      },
      {
        "text": "옆집 아주머니가 택배 좀 맡아 달래요.",
        "slot": "옆집 아주머니가 택배 좀 맡아",
        "cue": {
          "en": "keep a parcel for her",
          "ko": "택배를 맡다"
        },
        "gloss": {
          "en": "The lady next door asked me to hold on to her parcel.",
          "ko": "옆집 아주머니가 택배 좀 맡아 달래요."
        }
      },
      {
        "text": "동생이 내일 공항까지 태워 달래요.",
        "slot": "동생이 내일 공항까지 태워",
        "cue": {
          "en": "give a ride to the airport",
          "ko": "공항까지 태우다"
        },
        "gloss": {
          "en": "My younger sibling asked me to drive them to the airport tomorrow.",
          "ko": "동생이 내일 공항까지 태워 달래요."
        }
      }
    ]
  },
  {
    "id": "ko-f4-02",
    "stage": 4,
    "fn": "hearsay",
    "pattern": "___다고 하시더라고요.",
    "core": [
      "다고 하시더라고요"
    ],
    "meaning": {
      "en": "Passing on what someone (senior) said: They said that ___.",
      "ko": "들은 말 전하기: ___다고 하시더라고요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "다른 업체 견적도 받았다고 하시더라고요.",
        "slot": "다른 업체 견적도 받았",
        "cue": {
          "en": "have received another company's quote",
          "ko": "다른 업체 견적도 받다"
        },
        "gloss": {
          "en": "They said they had also received a quote from another company.",
          "ko": "다른 업체 견적도 받았다고 하시더라고요."
        }
      },
      {
        "text": "고객님이 이번 달은 예산이 없다고 하시더라고요.",
        "slot": "고객님이 이번 달은 예산이 없",
        "cue": {
          "en": "have no budget this month",
          "ko": "이번 달은 예산이 없다"
        },
        "gloss": {
          "en": "The client said there's no budget this month.",
          "ko": "고객님이 이번 달은 예산이 없다고 하시더라고요."
        }
      },
      {
        "text": "사장님이 다음 주에 출장 가신다고 하시더라고요.",
        "slot": "사장님이 다음 주에 출장 가신",
        "cue": {
          "en": "go on a business trip next week",
          "ko": "다음 주에 출장 가다"
        },
        "gloss": {
          "en": "The boss said he's going on a business trip next week.",
          "ko": "사장님이 다음 주에 출장 가신다고 하시더라고요."
        }
      },
      {
        "text": "교수님이 발표가 아주 좋았다고 하시더라고요.",
        "slot": "교수님이 발표가 아주 좋았",
        "cue": {
          "en": "the presentation was very good",
          "ko": "발표가 아주 좋았다"
        },
        "gloss": {
          "en": "The professor said the presentation was very good.",
          "ko": "교수님이 발표가 아주 좋았다고 하시더라고요."
        }
      }
    ]
  },
  {
    "id": "ko-f4-03",
    "stage": 4,
    "fn": "report",
    "pattern": "___고 싶으시대요.",
    "core": [
      "고 싶으시대요"
    ],
    "meaning": {
      "en": "Passing on what a senior wants: They say they'd like to ___.",
      "ko": "윗사람의 바람 전하기: ___고 싶으시대요."
    },
    "grammar": [
      0,
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "수량을 이백 개에서 삼백 개로 늘리고 싶으시대요.",
        "slot": "수량을 이백 개에서 삼백 개로 늘리",
        "cue": {
          "en": "increase the quantity",
          "ko": "수량을 늘리다"
        },
        "gloss": {
          "en": "They say they'd like to raise the quantity from two hundred to three hundred.",
          "ko": "수량을 이백 개에서 삼백 개로 늘리고 싶으시대요."
        }
      },
      {
        "text": "부장님이 회의를 오후로 미루고 싶으시대요.",
        "slot": "부장님이 회의를 오후로 미루",
        "cue": {
          "en": "push the meeting to the afternoon",
          "ko": "회의를 오후로 미루다"
        },
        "gloss": {
          "en": "The director says he'd like to move the meeting to the afternoon.",
          "ko": "부장님이 회의를 오후로 미루고 싶으시대요."
        }
      },
      {
        "text": "할머니께서 이번 주말에 손주들을 보고 싶으시대요.",
        "slot": "할머니께서 이번 주말에 손주들을 보",
        "cue": {
          "en": "see the grandchildren",
          "ko": "손주들을 보다"
        },
        "gloss": {
          "en": "Grandma says she'd like to see the grandchildren this weekend.",
          "ko": "할머니께서 이번 주말에 손주들을 보고 싶으시대요."
        }
      },
      {
        "text": "고객님께서 계약 조건을 한 번 더 확인하고 싶으시대요.",
        "slot": "고객님께서 계약 조건을 한 번 더 확인하",
        "cue": {
          "en": "check the contract terms once more",
          "ko": "계약 조건을 한 번 더 확인하다"
        },
        "gloss": {
          "en": "The client says she'd like to check the contract terms once more.",
          "ko": "고객님께서 계약 조건을 한 번 더 확인하고 싶으시대요."
        }
      }
    ]
  },
  {
    "id": "ko-f4-04",
    "stage": 4,
    "fn": "formal-humble",
    "pattern": "그건 제가 ___께 여쭤볼게요.",
    "core": [
      "께 여쭤볼게요"
    ],
    "meaning": {
      "en": "Humbly saying you'll ask a senior: I'll ask ___ about that.",
      "ko": "높여서 묻겠다고 하기: 그건 제가 ___께 여쭤볼게요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "그건 제가 팀장님께 여쭤볼게요.",
        "slot": "팀장님",
        "cue": {
          "en": "team leader",
          "ko": "팀장님"
        },
        "gloss": {
          "en": "I'll ask the team leader about that.",
          "ko": "그건 제가 팀장님께 여쭤볼게요."
        }
      },
      {
        "text": "일정은 제가 부장님께 여쭤볼게요.",
        "slot": "부장님",
        "cue": {
          "en": "director",
          "ko": "부장님"
        },
        "gloss": {
          "en": "I'll ask the director about the schedule.",
          "ko": "일정은 제가 부장님께 여쭤볼게요."
        }
      },
      {
        "text": "자세한 건 제가 교수님께 여쭤볼게요.",
        "slot": "교수님",
        "cue": {
          "en": "professor",
          "ko": "교수님"
        },
        "gloss": {
          "en": "I'll ask the professor for the details.",
          "ko": "자세한 건 제가 교수님께 여쭤볼게요."
        }
      },
      {
        "text": "제사 날짜는 제가 할아버지께 여쭤볼게요.",
        "slot": "할아버지",
        "cue": {
          "en": "grandfather",
          "ko": "할아버지"
        },
        "gloss": {
          "en": "I'll ask Grandpa about the date of the memorial rite.",
          "ko": "제사 날짜는 제가 할아버지께 여쭤볼게요."
        }
      }
    ]
  },
  {
    "id": "ko-f4-05",
    "stage": 4,
    "fn": "formal-request",
    "pattern": "말씀하신 대로 ___.",
    "core": [
      "말씀하신 대로"
    ],
    "meaning": {
      "en": "Confirming you'll follow instructions: As you said, ___.",
      "ko": "지시대로 하겠다고 하기: 말씀하신 대로 ___."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "말씀하신 대로"
    ],
    "examples": [
      {
        "text": "말씀하신 대로 진행하겠습니다.",
        "slot": "진행하겠습니다",
        "cue": {
          "en": "proceed",
          "ko": "진행하다"
        },
        "gloss": {
          "en": "I'll proceed as you said.",
          "ko": "말씀하신 대로 진행하겠습니다."
        }
      },
      {
        "text": "말씀하신 대로 내일까지 수정해서 보내 드릴게요.",
        "slot": "내일까지 수정해서 보내 드릴게요",
        "cue": {
          "en": "revise and send it by tomorrow",
          "ko": "내일까지 수정해서 보내다"
        },
        "gloss": {
          "en": "As you said, I'll revise it and send it by tomorrow.",
          "ko": "말씀하신 대로 내일까지 수정해서 보내 드릴게요."
        }
      },
      {
        "text": "말씀하신 대로 회의 시간을 오후 세 시로 옮겼어요.",
        "slot": "회의 시간을 오후 세 시로 옮겼어요",
        "cue": {
          "en": "move the meeting to three p.m.",
          "ko": "회의 시간을 세 시로 옮기다"
        },
        "gloss": {
          "en": "As you said, I moved the meeting to three in the afternoon.",
          "ko": "말씀하신 대로 회의 시간을 오후 세 시로 옮겼어요."
        }
      },
      {
        "text": "말씀하신 대로 고객님께 먼저 연락드렸습니다.",
        "slot": "고객님께 먼저 연락드렸습니다",
        "cue": {
          "en": "contact the client first",
          "ko": "고객님께 먼저 연락드리다"
        },
        "gloss": {
          "en": "As you said, I contacted the client first.",
          "ko": "말씀하신 대로 고객님께 먼저 연락드렸습니다."
        }
      }
    ]
  },
  {
    "id": "ko-f4-06",
    "stage": 4,
    "fn": "persuade",
    "pattern": "___다고 했잖아요.",
    "core": [
      "다고 했잖아"
    ],
    "meaning": {
      "en": "Reminding someone of what was said: I told you that ___, remember?",
      "ko": "이미 말한 것 일깨우기: ___다고 했잖아요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "제가 오늘 좀 늦는다고 했잖아요.",
        "slot": "제가 오늘 좀 늦는",
        "cue": {
          "en": "be a bit late today",
          "ko": "오늘 좀 늦다"
        },
        "gloss": {
          "en": "I told you I'd be a bit late today, remember?",
          "ko": "제가 오늘 좀 늦는다고 했잖아요."
        }
      },
      {
        "text": "너 전부터 거기 힘들다고 했잖아.",
        "slot": "너 전부터 거기 힘들",
        "cue": {
          "en": "it's hard there",
          "ko": "거기가 힘들다"
        },
        "gloss": {
          "en": "You've been saying it's hard there for a while.",
          "ko": "너 전부터 거기 힘들다고 했잖아."
        }
      },
      {
        "text": "그 가게 월요일엔 문 닫는다고 했잖아요.",
        "slot": "그 가게 월요일엔 문 닫는",
        "cue": {
          "en": "close on Mondays",
          "ko": "월요일엔 문을 닫다"
        },
        "gloss": {
          "en": "I told you that shop closes on Mondays.",
          "ko": "그 가게 월요일엔 문 닫는다고 했잖아요."
        }
      },
      {
        "text": "민수가 이번 주에 이사한다고 했잖아.",
        "slot": "민수가 이번 주에 이사한",
        "cue": {
          "en": "move this week",
          "ko": "이번 주에 이사하다"
        },
        "gloss": {
          "en": "Minsu said he's moving this week, remember?",
          "ko": "민수가 이번 주에 이사한다고 했잖아."
        }
      }
    ]
  },
  {
    "id": "ko-f4-07",
    "stage": 4,
    "fn": "reason",
    "pattern": "___아야/어야 되거든요.",
    "core": [
      "야 되거든요"
    ],
    "meaning": {
      "en": "Explaining a reason you must: You see, I have to ___.",
      "ko": "사정 설명하기: ___아야/어야 되거든요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "오늘은 좀 일찍 가야 되거든요.",
        "slot": "오늘은 좀 일찍 가",
        "cue": {
          "en": "leave a bit early today",
          "ko": "오늘 좀 일찍 가다"
        },
        "gloss": {
          "en": "I have to leave a bit early today, you see.",
          "ko": "오늘은 좀 일찍 가야 되거든요."
        }
      },
      {
        "text": "주말 전에 소파를 꼭 받아야 되거든요.",
        "slot": "주말 전에 소파를 꼭 받",
        "cue": {
          "en": "get the sofa before the weekend",
          "ko": "주말 전에 소파를 받다"
        },
        "gloss": {
          "en": "You see, I really need to get the sofa before the weekend.",
          "ko": "주말 전에 소파를 꼭 받아야 되거든요."
        }
      },
      {
        "text": "내일까지 보고서를 끝내야 되거든요.",
        "slot": "내일까지 보고서를 끝내",
        "cue": {
          "en": "finish the report by tomorrow",
          "ko": "내일까지 보고서를 끝내다"
        },
        "gloss": {
          "en": "I have to finish the report by tomorrow, you see.",
          "ko": "내일까지 보고서를 끝내야 되거든요."
        }
      },
      {
        "text": "아이를 데리러 유치원에 가야 되거든요.",
        "slot": "아이를 데리러 유치원에 가",
        "cue": {
          "en": "go to pick up my kid at kindergarten",
          "ko": "아이를 데리러 유치원에 가다"
        },
        "gloss": {
          "en": "You see, I have to go pick up my kid from kindergarten.",
          "ko": "아이를 데리러 유치원에 가야 되거든요."
        }
      }
    ]
  },
  {
    "id": "ko-f4-08",
    "stage": 4,
    "fn": "reason",
    "pattern": "어제 ___ 너무 피곤했거든.",
    "core": [
      "피곤했거든"
    ],
    "meaning": {
      "en": "Giving background casually: I was really tired because ___, you see.",
      "ko": "반말로 사정 말하기: 어제 ___ 너무 피곤했거든."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "어제 야근해서 너무 피곤했거든.",
        "slot": "야근해서",
        "cue": {
          "en": "work overtime",
          "ko": "야근하다"
        },
        "gloss": {
          "en": "I worked late yesterday, so I was really tired.",
          "ko": "어제 야근해서 너무 피곤했거든."
        }
      },
      {
        "text": "어제 이사하느라 너무 피곤했거든.",
        "slot": "이사하느라",
        "cue": {
          "en": "move house",
          "ko": "이사하다"
        },
        "gloss": {
          "en": "I was moving yesterday, so I was really tired.",
          "ko": "어제 이사하느라 너무 피곤했거든."
        }
      },
      {
        "text": "어제 밤새 아기가 울어서 너무 피곤했거든.",
        "slot": "밤새 아기가 울어서",
        "cue": {
          "en": "the baby cried all night",
          "ko": "밤새 아기가 울다"
        },
        "gloss": {
          "en": "The baby cried all night, so I was really tired.",
          "ko": "어제 밤새 아기가 울어서 너무 피곤했거든."
        }
      },
      {
        "text": "어제 하루 종일 회의해서 너무 피곤했거든.",
        "slot": "하루 종일 회의해서",
        "cue": {
          "en": "have meetings all day",
          "ko": "하루 종일 회의하다"
        },
        "gloss": {
          "en": "I had meetings all day yesterday, so I was really tired.",
          "ko": "어제 하루 종일 회의해서 너무 피곤했거든."
        }
      }
    ]
  },
  {
    "id": "ko-f4-09",
    "stage": 4,
    "fn": "story-past",
    "pattern": "하마터면 ___ 뻔했어요.",
    "core": [
      "뻔했어"
    ],
    "meaning": {
      "en": "Saying something almost happened: I almost ___.",
      "ko": "아슬아슬했던 일 말하기: 하마터면 ___ 뻔했어요."
    },
    "grammar": [
      5
    ],
    "expressions": [
      "하마터면"
    ],
    "examples": [
      {
        "text": "하마터면 핸드폰도 놓고 내릴 뻔했어.",
        "slot": "핸드폰도 놓고 내릴",
        "cue": {
          "en": "leave my phone behind",
          "ko": "핸드폰을 놓고 내리다"
        },
        "gloss": {
          "en": "I almost left my phone on the train too.",
          "ko": "하마터면 핸드폰도 놓고 내릴 뻔했어."
        }
      },
      {
        "text": "늦잠 자서 하마터면 비행기를 놓칠 뻔했어요.",
        "slot": "비행기를 놓칠",
        "cue": {
          "en": "miss the plane",
          "ko": "비행기를 놓치다"
        },
        "gloss": {
          "en": "I overslept and almost missed my flight.",
          "ko": "늦잠 자서 하마터면 비행기를 놓칠 뻔했어요."
        }
      },
      {
        "text": "계단에서 미끄러져서 하마터면 넘어질 뻔했어.",
        "slot": "넘어질",
        "cue": {
          "en": "fall down",
          "ko": "넘어지다"
        },
        "gloss": {
          "en": "I slipped on the stairs and almost fell.",
          "ko": "계단에서 미끄러져서 하마터면 넘어질 뻔했어."
        }
      },
      {
        "text": "하마터면 친구 생일을 잊어버릴 뻔했어요.",
        "slot": "친구 생일을 잊어버릴",
        "cue": {
          "en": "forget a friend's birthday",
          "ko": "친구 생일을 잊어버리다"
        },
        "gloss": {
          "en": "I almost forgot my friend's birthday.",
          "ko": "하마터면 친구 생일을 잊어버릴 뻔했어요."
        }
      }
    ]
  },
  {
    "id": "ko-f4-10",
    "stage": 4,
    "fn": "apologize-late",
    "pattern": "___는 바람에 늦었어요.",
    "core": [
      "는 바람에"
    ],
    "meaning": {
      "en": "Blaming an unexpected event: Because ___ (unexpectedly), I was late.",
      "ko": "뜻밖의 일로 사정 말하기: ___는 바람에 늦었어요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "버스가 고장 나는 바람에 늦었어요.",
        "slot": "버스가 고장 나",
        "cue": {
          "en": "the bus breaks down",
          "ko": "버스가 고장 나다"
        },
        "gloss": {
          "en": "I was late because the bus broke down.",
          "ko": "버스가 고장 나는 바람에 늦었어요."
        }
      },
      {
        "text": "알람이 안 울리는 바람에 늦었어요.",
        "slot": "알람이 안 울리",
        "cue": {
          "en": "the alarm doesn't go off",
          "ko": "알람이 안 울리다"
        },
        "gloss": {
          "en": "I was late because my alarm didn't go off.",
          "ko": "알람이 안 울리는 바람에 늦었어요."
        }
      },
      {
        "text": "급하게 내리는 바람에 우산을 두고 내렸어.",
        "slot": "급하게 내리",
        "cue": {
          "en": "get off in a hurry",
          "ko": "급하게 내리다"
        },
        "gloss": {
          "en": "I got off in a hurry and left my umbrella behind.",
          "ko": "급하게 내리는 바람에 우산을 두고 내렸어."
        }
      },
      {
        "text": "갑자기 비가 쏟아지는 바람에 길이 엄청 막혔어요.",
        "slot": "갑자기 비가 쏟아지",
        "cue": {
          "en": "rain suddenly pours",
          "ko": "갑자기 비가 쏟아지다"
        },
        "gloss": {
          "en": "It suddenly poured, so traffic was terrible.",
          "ko": "갑자기 비가 쏟아지는 바람에 길이 엄청 막혔어요."
        }
      }
    ]
  },
  {
    "id": "ko-f4-11",
    "stage": 4,
    "fn": "hypothetical",
    "pattern": "___(으)ㄹ 텐데요.",
    "core": [
      "텐데요"
    ],
    "meaning": {
      "en": "Raising a likely concern: But ___ will probably happen.",
      "ko": "걱정되는 결과 말하기: ___(으)ㄹ 텐데요."
    },
    "grammar": [
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "지금 출발하면 길이 많이 막힐 텐데요.",
        "slot": "지금 출발하면 길이 많이 막힐",
        "cue": {
          "en": "traffic will be heavy if we leave now",
          "ko": "지금 출발하면 길이 막히다"
        },
        "gloss": {
          "en": "If we leave now, traffic will probably be bad.",
          "ko": "지금 출발하면 길이 많이 막힐 텐데요."
        }
      },
      {
        "text": "일은 그대로면 나머지 나흘 동안 야근이 늘어날 텐데요.",
        "slot": "일은 그대로면 나머지 나흘 동안 야근이 늘어날",
        "cue": {
          "en": "overtime will increase",
          "ko": "야근이 늘어나다"
        },
        "gloss": {
          "en": "If the workload stays the same, overtime will go up on the other four days.",
          "ko": "일은 그대로면 나머지 나흘 동안 야근이 늘어날 텐데요."
        }
      },
      {
        "text": "그렇게 하면 비용이 꽤 들 텐데요.",
        "slot": "그렇게 하면 비용이 꽤 들",
        "cue": {
          "en": "it will cost quite a lot",
          "ko": "비용이 꽤 들다"
        },
        "gloss": {
          "en": "That would probably cost quite a bit.",
          "ko": "그렇게 하면 비용이 꽤 들 텐데요."
        }
      },
      {
        "text": "오늘 안에 끝내기는 좀 어려울 텐데요.",
        "slot": "오늘 안에 끝내기는 좀 어려울",
        "cue": {
          "en": "be hard to finish today",
          "ko": "오늘 안에 끝내기 어렵다"
        },
        "gloss": {
          "en": "It'll probably be hard to finish it today.",
          "ko": "오늘 안에 끝내기는 좀 어려울 텐데요."
        }
      }
    ]
  },
  {
    "id": "ko-f4-12",
    "stage": 4,
    "fn": "story-past",
    "pattern": "___더라고요.",
    "core": [
      "더라고요"
    ],
    "meaning": {
      "en": "Sharing what you noticed: I found that ___.",
      "ko": "보고 느낀 것 전하기: ___더라고요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "그 식당 생각보다 맛있더라고요.",
        "slot": "그 식당 생각보다 맛있",
        "cue": {
          "en": "be tastier than expected",
          "ko": "생각보다 맛있다"
        },
        "gloss": {
          "en": "That restaurant was better than I expected.",
          "ko": "그 식당 생각보다 맛있더라고요."
        }
      },
      {
        "text": "가 보니까 사람이 정말 많더라고요.",
        "slot": "가 보니까 사람이 정말 많",
        "cue": {
          "en": "there are a lot of people",
          "ko": "사람이 많다"
        },
        "gloss": {
          "en": "When I got there, it was really crowded.",
          "ko": "가 보니까 사람이 정말 많더라고요."
        }
      },
      {
        "text": "처음 몇 달은 다들 엄청 힘들어하더라고요.",
        "slot": "처음 몇 달은 다들 엄청 힘들어하",
        "cue": {
          "en": "everyone struggles",
          "ko": "다들 힘들어하다"
        },
        "gloss": {
          "en": "For the first few months, everyone was really struggling.",
          "ko": "처음 몇 달은 다들 엄청 힘들어하더라고요."
        }
      },
      {
        "text": "새로 온 팀장님이 말씀을 참 재미있게 하시더라고요.",
        "slot": "새로 온 팀장님이 말씀을 참 재미있게 하시",
        "cue": {
          "en": "talk in a fun way",
          "ko": "말을 재미있게 하다"
        },
        "gloss": {
          "en": "The new team leader turned out to be really funny.",
          "ko": "새로 온 팀장님이 말씀을 참 재미있게 하시더라고요."
        }
      }
    ]
  },
  {
    "id": "ko-f4-13",
    "stage": 4,
    "fn": "report",
    "pattern": "제가 알기로는 ___.",
    "core": [
      "제가 알기로는"
    ],
    "meaning": {
      "en": "Sharing what you understand: As far as I know, ___.",
      "ko": "아는 만큼 전하기: 제가 알기로는 ___."
    },
    "grammar": [
      1
    ],
    "expressions": [
      "제가 알기로는"
    ],
    "examples": [
      {
        "text": "제가 알기로는 일단 공공기관부터 시작한대요.",
        "slot": "일단 공공기관부터 시작한대요",
        "cue": {
          "en": "it starts with public institutions",
          "ko": "공공기관부터 시작하다"
        },
        "gloss": {
          "en": "As far as I know, they're starting with public institutions first.",
          "ko": "제가 알기로는 일단 공공기관부터 시작한대요."
        }
      },
      {
        "text": "제가 알기로는 그 회의는 다음 주로 미뤄졌대요.",
        "slot": "그 회의는 다음 주로 미뤄졌대요",
        "cue": {
          "en": "the meeting was pushed to next week",
          "ko": "회의가 다음 주로 미뤄지다"
        },
        "gloss": {
          "en": "As far as I know, that meeting was moved to next week.",
          "ko": "제가 알기로는 그 회의는 다음 주로 미뤄졌대요."
        }
      },
      {
        "text": "제가 알기로는 이번 달까지만 할인한대요.",
        "slot": "이번 달까지만 할인한대요",
        "cue": {
          "en": "the sale runs only this month",
          "ko": "이번 달까지만 할인하다"
        },
        "gloss": {
          "en": "As far as I know, the discount only lasts this month.",
          "ko": "제가 알기로는 이번 달까지만 할인한대요."
        }
      },
      {
        "text": "제가 알기로는 그분이 이 일을 제일 오래 하셨어요.",
        "slot": "그분이 이 일을 제일 오래 하셨어요",
        "cue": {
          "en": "that person has done this job the longest",
          "ko": "그분이 이 일을 제일 오래 하다"
        },
        "gloss": {
          "en": "As far as I know, he has done this job the longest.",
          "ko": "제가 알기로는 그분이 이 일을 제일 오래 하셨어요."
        }
      }
    ]
  },
  {
    "id": "ko-f4-14",
    "stage": 4,
    "fn": "formal-request",
    "pattern": "___ 확인 부탁드립니다.",
    "core": [
      "확인 부탁드립니다"
    ],
    "meaning": {
      "en": "Asking formally for a check: Please check ___.",
      "ko": "업무로 확인 부탁하기: ___ 확인 부탁드립니다."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "확인 부탁드립니다"
    ],
    "examples": [
      {
        "text": "첨부한 파일 확인 부탁드립니다.",
        "slot": "첨부한 파일",
        "cue": {
          "en": "the attached file",
          "ko": "첨부한 파일"
        },
        "gloss": {
          "en": "Please check the attached file.",
          "ko": "첨부한 파일 확인 부탁드립니다."
        }
      },
      {
        "text": "변경된 회의 일정 확인 부탁드립니다.",
        "slot": "변경된 회의 일정",
        "cue": {
          "en": "the changed meeting schedule",
          "ko": "변경된 회의 일정"
        },
        "gloss": {
          "en": "Please check the updated meeting schedule.",
          "ko": "변경된 회의 일정 확인 부탁드립니다."
        }
      },
      {
        "text": "수정한 견적서 내용 확인 부탁드립니다.",
        "slot": "수정한 견적서 내용",
        "cue": {
          "en": "the revised quote",
          "ko": "수정한 견적서 내용"
        },
        "gloss": {
          "en": "Please review the revised quote.",
          "ko": "수정한 견적서 내용 확인 부탁드립니다."
        }
      },
      {
        "text": "오늘 오전에 보낸 메일 확인 부탁드립니다.",
        "slot": "오늘 오전에 보낸 메일",
        "cue": {
          "en": "the email sent this morning",
          "ko": "오늘 오전에 보낸 메일"
        },
        "gloss": {
          "en": "Please check the email I sent this morning.",
          "ko": "오늘 오전에 보낸 메일 확인 부탁드립니다."
        }
      }
    ]
  },
  {
    "id": "ko-f4-15",
    "stage": 4,
    "fn": "negotiate",
    "pattern": "제가 ___하고 일정 조율해 볼게요.",
    "core": [
      "일정 조율해 볼게요"
    ],
    "meaning": {
      "en": "Offering to sort out a schedule: I'll coordinate the schedule with ___.",
      "ko": "일정 조율 맡기: 제가 ___하고 일정 조율해 볼게요."
    },
    "grammar": [],
    "expressions": [
      "일정 조율해 볼게요"
    ],
    "examples": [
      {
        "text": "그럼 제가 생산팀하고 일정 조율해 볼게요.",
        "slot": "생산팀",
        "cue": {
          "en": "production team",
          "ko": "생산팀"
        },
        "gloss": {
          "en": "Then I'll work out the schedule with the production team.",
          "ko": "그럼 제가 생산팀하고 일정 조율해 볼게요."
        }
      },
      {
        "text": "제가 거래처하고 일정 조율해 볼게요.",
        "slot": "거래처",
        "cue": {
          "en": "client company",
          "ko": "거래처"
        },
        "gloss": {
          "en": "I'll coordinate the schedule with the client.",
          "ko": "제가 거래처하고 일정 조율해 볼게요."
        }
      },
      {
        "text": "다음 주 회의는 제가 디자인팀하고 일정 조율해 볼게요.",
        "slot": "디자인팀",
        "cue": {
          "en": "design team",
          "ko": "디자인팀"
        },
        "gloss": {
          "en": "I'll sort out next week's meeting time with the design team.",
          "ko": "다음 주 회의는 제가 디자인팀하고 일정 조율해 볼게요."
        }
      },
      {
        "text": "출장 날짜는 제가 현지 지사하고 일정 조율해 볼게요.",
        "slot": "현지 지사",
        "cue": {
          "en": "the local branch",
          "ko": "현지 지사"
        },
        "gloss": {
          "en": "I'll work out the trip dates with the local branch.",
          "ko": "출장 날짜는 제가 현지 지사하고 일정 조율해 볼게요."
        }
      }
    ]
  },
  {
    "id": "ko-f4-16",
    "stage": 4,
    "fn": "feedback-give",
    "pattern": "___ 다시 검토해 보겠습니다.",
    "core": [
      "검토해 보겠습니다"
    ],
    "meaning": {
      "en": "Promising to review after feedback: I'll review ___ again.",
      "ko": "피드백 받고 답하기: ___ 다시 검토해 보겠습니다."
    },
    "grammar": [],
    "expressions": [
      "검토해 보겠습니다"
    ],
    "examples": [
      {
        "text": "휴대폰 화면 기준으로 다시 검토해 보겠습니다.",
        "slot": "휴대폰 화면 기준으로",
        "cue": {
          "en": "based on the phone screen",
          "ko": "휴대폰 화면 기준으로"
        },
        "gloss": {
          "en": "I'll review it again based on the phone screen.",
          "ko": "휴대폰 화면 기준으로 다시 검토해 보겠습니다."
        }
      },
      {
        "text": "예산 문제는 팀 안에서 다시 검토해 보겠습니다.",
        "slot": "예산 문제는 팀 안에서",
        "cue": {
          "en": "the budget issue within the team",
          "ko": "예산 문제는 팀 안에서"
        },
        "gloss": {
          "en": "We'll look at the budget issue again within the team.",
          "ko": "예산 문제는 팀 안에서 다시 검토해 보겠습니다."
        }
      },
      {
        "text": "계약 조건을 처음부터 다시 검토해 보겠습니다.",
        "slot": "계약 조건을 처음부터",
        "cue": {
          "en": "the contract terms from the start",
          "ko": "계약 조건을 처음부터"
        },
        "gloss": {
          "en": "I'll go over the contract terms again from the beginning.",
          "ko": "계약 조건을 처음부터 다시 검토해 보겠습니다."
        }
      },
      {
        "text": "지적해 주신 부분은 다시 검토해 보겠습니다.",
        "slot": "지적해 주신 부분은",
        "cue": {
          "en": "the points you raised",
          "ko": "지적해 주신 부분"
        },
        "gloss": {
          "en": "I'll review the points you raised again.",
          "ko": "지적해 주신 부분은 다시 검토해 보겠습니다."
        }
      }
    ]
  },
  {
    "id": "ko-f4-17",
    "stage": 4,
    "fn": "feedback-give",
    "pattern": "솔직히 말하면 ___.",
    "core": [
      "솔직히 말하면"
    ],
    "meaning": {
      "en": "Giving an honest view: To be honest, ___.",
      "ko": "솔직한 생각 말하기: 솔직히 말하면 ___."
    },
    "grammar": [
      4
    ],
    "expressions": [
      "솔직히 말하면"
    ],
    "examples": [
      {
        "text": "솔직히 말하면 저는 좀 걱정되는 부분도 있거든요.",
        "slot": "저는 좀 걱정되는 부분도 있거든요",
        "cue": {
          "en": "I have some concerns",
          "ko": "걱정되는 부분이 있다"
        },
        "gloss": {
          "en": "To be honest, there are parts I'm a little worried about.",
          "ko": "솔직히 말하면 저는 좀 걱정되는 부분도 있거든요."
        }
      },
      {
        "text": "솔직히 말하면 그 디자인은 제 취향이 아니에요.",
        "slot": "그 디자인은 제 취향이 아니에요",
        "cue": {
          "en": "that design is not my taste",
          "ko": "그 디자인은 취향이 아니다"
        },
        "gloss": {
          "en": "To be honest, that design isn't really my taste.",
          "ko": "솔직히 말하면 그 디자인은 제 취향이 아니에요."
        }
      },
      {
        "text": "솔직히 말하면 이번 계획은 너무 급한 것 같아요.",
        "slot": "이번 계획은 너무 급한 것 같아요",
        "cue": {
          "en": "this plan seems too rushed",
          "ko": "계획이 너무 급하다"
        },
        "gloss": {
          "en": "Honestly, this plan seems too rushed.",
          "ko": "솔직히 말하면 이번 계획은 너무 급한 것 같아요."
        }
      },
      {
        "text": "솔직히 말하면 저도 그 얘기는 처음 들었어요.",
        "slot": "저도 그 얘기는 처음 들었어요",
        "cue": {
          "en": "hear it for the first time",
          "ko": "그 얘기를 처음 듣다"
        },
        "gloss": {
          "en": "To be honest, that's the first I've heard of it too.",
          "ko": "솔직히 말하면 저도 그 얘기는 처음 들었어요."
        }
      }
    ]
  },
  {
    "id": "ko-f4-18",
    "stage": 4,
    "fn": "change-topic",
    "pattern": "그건 그렇고, ___?",
    "core": [
      "그건 그렇고"
    ],
    "meaning": {
      "en": "Changing the subject: Anyway, ___?",
      "ko": "화제 바꾸기: 그건 그렇고, ___?"
    },
    "grammar": [],
    "expressions": [
      "그건 그렇고"
    ],
    "examples": [
      {
        "text": "그건 그렇고, 너 번호 안 바뀌었지?",
        "slot": "너 번호 안 바뀌었지",
        "cue": {
          "en": "your number hasn't changed",
          "ko": "번호가 안 바뀌다"
        },
        "gloss": {
          "en": "Anyway, your number's still the same, right?",
          "ko": "그건 그렇고, 너 번호 안 바뀌었지?"
        }
      },
      {
        "text": "그건 그렇고, 내일 회의 몇 시였죠?",
        "slot": "내일 회의 몇 시였죠",
        "cue": {
          "en": "what time is tomorrow's meeting",
          "ko": "내일 회의가 몇 시이다"
        },
        "gloss": {
          "en": "By the way, what time was tomorrow's meeting?",
          "ko": "그건 그렇고, 내일 회의 몇 시였죠?"
        }
      },
      {
        "text": "그건 그렇고, 주말에 뭐 할 거야?",
        "slot": "주말에 뭐 할 거야",
        "cue": {
          "en": "what you'll do on the weekend",
          "ko": "주말에 뭐 하다"
        },
        "gloss": {
          "en": "Anyway, what are you doing this weekend?",
          "ko": "그건 그렇고, 주말에 뭐 할 거야?"
        }
      },
      {
        "text": "그건 그렇고, 점심은 드셨어요?",
        "slot": "점심은 드셨어요",
        "cue": {
          "en": "have lunch",
          "ko": "점심을 먹다"
        },
        "gloss": {
          "en": "By the way, have you had lunch?",
          "ko": "그건 그렇고, 점심은 드셨어요?"
        }
      }
    ]
  },
  {
    "id": "ko-f4-19",
    "stage": 4,
    "fn": "negotiate",
    "pattern": "그 부분은요, ___.",
    "core": [
      "그 부분은요"
    ],
    "meaning": {
      "en": "Addressing a specific point: About that part, ___.",
      "ko": "짚어서 답하기: 그 부분은요, ___."
    },
    "grammar": [
      4
    ],
    "expressions": [
      "그 부분은요"
    ],
    "examples": [
      {
        "text": "그 부분은요, 저도 이미 말씀드렸거든요.",
        "slot": "저도 이미 말씀드렸거든요",
        "cue": {
          "en": "I already mentioned it",
          "ko": "이미 말씀드리다"
        },
        "gloss": {
          "en": "About that, I already brought it up myself.",
          "ko": "그 부분은요, 저도 이미 말씀드렸거든요."
        }
      },
      {
        "text": "그 부분은요, 다음 회의에서 다시 이야기하면 좋겠어요.",
        "slot": "다음 회의에서 다시 이야기하면 좋겠어요",
        "cue": {
          "en": "talk about it again at the next meeting",
          "ko": "다음 회의에서 다시 이야기하다"
        },
        "gloss": {
          "en": "About that part, I'd like to discuss it again at the next meeting.",
          "ko": "그 부분은요, 다음 회의에서 다시 이야기하면 좋겠어요."
        }
      },
      {
        "text": "그 부분은요, 제가 따로 정리해서 보내 드릴게요.",
        "slot": "제가 따로 정리해서 보내 드릴게요",
        "cue": {
          "en": "write it up separately and send it",
          "ko": "따로 정리해서 보내다"
        },
        "gloss": {
          "en": "As for that part, I'll write it up separately and send it to you.",
          "ko": "그 부분은요, 제가 따로 정리해서 보내 드릴게요."
        }
      },
      {
        "text": "그 부분은요, 아직 확정된 게 아니에요.",
        "slot": "아직 확정된 게 아니에요",
        "cue": {
          "en": "it's not confirmed yet",
          "ko": "아직 확정되지 않다"
        },
        "gloss": {
          "en": "About that part, nothing's been confirmed yet.",
          "ko": "그 부분은요, 아직 확정된 게 아니에요."
        }
      }
    ]
  },
  {
    "id": "ko-f4-20",
    "stage": 4,
    "fn": "story-past",
    "pattern": "말도 마. ___.",
    "core": [
      "말도 마"
    ],
    "meaning": {
      "en": "Starting a story about a rough time: Don't even ask. ___.",
      "ko": "고생담 꺼내기: 말도 마. ___."
    },
    "grammar": [],
    "expressions": [
      "말도 마"
    ],
    "examples": [
      {
        "text": "말도 마. 나 오늘 지하철에서 완전 난리 났었어.",
        "slot": "나 오늘 지하철에서 완전 난리 났었어",
        "cue": {
          "en": "it was total chaos on the subway",
          "ko": "지하철에서 난리가 나다"
        },
        "gloss": {
          "en": "Don't even ask. It was total chaos on the subway today.",
          "ko": "말도 마. 나 오늘 지하철에서 완전 난리 났었어."
        }
      },
      {
        "text": "말도 마. 어제 회의가 밤 열 시까지 갔어.",
        "slot": "어제 회의가 밤 열 시까지 갔어",
        "cue": {
          "en": "the meeting went on until ten at night",
          "ko": "회의가 밤 열 시까지 가다"
        },
        "gloss": {
          "en": "Don't even ask. Yesterday's meeting went on until ten at night.",
          "ko": "말도 마. 어제 회의가 밤 열 시까지 갔어."
        }
      },
      {
        "text": "말도 마. 비행기가 세 시간이나 늦게 떴어.",
        "slot": "비행기가 세 시간이나 늦게 떴어",
        "cue": {
          "en": "the plane took off three hours late",
          "ko": "비행기가 늦게 뜨다"
        },
        "gloss": {
          "en": "Don't even ask. The plane took off three hours late.",
          "ko": "말도 마. 비행기가 세 시간이나 늦게 떴어."
        }
      },
      {
        "text": "말도 마. 집에 오자마자 정전이 됐어.",
        "slot": "집에 오자마자 정전이 됐어",
        "cue": {
          "en": "the power went out as soon as I got home",
          "ko": "정전이 되다"
        },
        "gloss": {
          "en": "Don't even ask. The power went out the moment I got home.",
          "ko": "말도 마. 집에 오자마자 정전이 됐어."
        }
      }
    ]
  },
  {
    "id": "ko-f5-01",
    "stage": 5,
    "fn": "changed",
    "pattern": "___다 보니까 익숙해졌어요.",
    "core": [
      "다 보니"
    ],
    "meaning": {
      "en": "Saying a result came from repeating something: As I kept ___, I got used to it.",
      "ko": "하다 보니 생긴 결과 말하기: ___다 보니까 익숙해졌어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "매일 운전하다 보니까 익숙해졌어요.",
        "slot": "매일 운전하",
        "cue": {
          "en": "drive every day",
          "ko": "매일 운전하다"
        },
        "gloss": {
          "en": "Driving every day, I got used to it.",
          "ko": "매일 운전하다 보니까 익숙해졌어요."
        }
      },
      {
        "text": "새벽에 일어나다 보니까 이제는 익숙해졌어요.",
        "slot": "새벽에 일어나",
        "cue": {
          "en": "get up at dawn",
          "ko": "새벽에 일어나다"
        },
        "gloss": {
          "en": "After getting up at dawn for a while, I'm used to it now.",
          "ko": "새벽에 일어나다 보니까 이제는 익숙해졌어요."
        }
      },
      {
        "text": "매운 음식을 자주 먹다 보니까 익숙해졌어요.",
        "slot": "매운 음식을 자주 먹",
        "cue": {
          "en": "eat spicy food often",
          "ko": "매운 음식을 자주 먹다"
        },
        "gloss": {
          "en": "Eating spicy food often, I got used to it.",
          "ko": "매운 음식을 자주 먹다 보니까 익숙해졌어요."
        }
      },
      {
        "text": "예능을 매일 보다 보니까 저절로 귀가 트이더라.",
        "slot": "예능을 매일 보",
        "cue": {
          "en": "watch variety shows every day",
          "ko": "예능을 매일 보다"
        },
        "gloss": {
          "en": "Watching variety shows every day, my ears just opened up on their own.",
          "ko": "예능을 매일 보다 보니까 저절로 귀가 트이더라."
        }
      }
    ]
  },
  {
    "id": "ko-f5-02",
    "stage": 5,
    "fn": "storytelling",
    "pattern": "이 정도면 ___ 셈이네요.",
    "core": [
      "셈이네요"
    ],
    "meaning": {
      "en": "Summing up what it amounts to: At this point, it's practically ___.",
      "ko": "결국 어떤 셈인지 말하기: 이 정도면 ___ 셈이네요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "이 정도면 거의 다 끝낸 셈이네요.",
        "slot": "거의 다 끝낸",
        "cue": {
          "en": "almost finish",
          "ko": "거의 다 끝내다"
        },
        "gloss": {
          "en": "At this point, we've practically finished.",
          "ko": "이 정도면 거의 다 끝낸 셈이네요."
        }
      },
      {
        "text": "이 정도면 공짜로 받은 셈이네요.",
        "slot": "공짜로 받은",
        "cue": {
          "en": "get it for free",
          "ko": "공짜로 받다"
        },
        "gloss": {
          "en": "At this price, it's practically free.",
          "ko": "이 정도면 공짜로 받은 셈이네요."
        }
      },
      {
        "text": "그래도 그게 지금까지 다 추억으로 남은 셈이네요.",
        "slot": "그래도 그게 지금까지 다 추억으로 남은",
        "cue": {
          "en": "remain as memories",
          "ko": "추억으로 남다"
        },
        "gloss": {
          "en": "Still, in the end it all became good memories.",
          "ko": "그래도 그게 지금까지 다 추억으로 남은 셈이네요."
        }
      },
      {
        "text": "이 정도면 처음부터 다시 만든 셈이네요.",
        "slot": "처음부터 다시 만든",
        "cue": {
          "en": "remake from scratch",
          "ko": "처음부터 다시 만들다"
        },
        "gloss": {
          "en": "At this point, we've basically rebuilt it from scratch.",
          "ko": "이 정도면 처음부터 다시 만든 셈이네요."
        }
      }
    ]
  },
  {
    "id": "ko-f5-03",
    "stage": 5,
    "fn": "regret-light",
    "pattern": "___(으)ㄹ 걸 그랬어요.",
    "core": [
      "걸 그랬어",
      "걸 그랬다"
    ],
    "meaning": {
      "en": "Expressing regret: I should have ___.",
      "ko": "아쉬움 말하기: ___(으)ㄹ 걸 그랬어요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "미리 예약할 걸 그랬어요.",
        "slot": "미리 예약할",
        "cue": {
          "en": "book in advance",
          "ko": "미리 예약하다"
        },
        "gloss": {
          "en": "I should have booked in advance.",
          "ko": "미리 예약할 걸 그랬어요."
        }
      },
      {
        "text": "알람이라도 맞춰 놓을 걸 그랬어.",
        "slot": "알람이라도 맞춰 놓을",
        "cue": {
          "en": "at least set an alarm",
          "ko": "알람을 맞춰 놓다"
        },
        "gloss": {
          "en": "I should have at least set an alarm.",
          "ko": "알람이라도 맞춰 놓을 걸 그랬어."
        }
      },
      {
        "text": "우산을 챙겨 올 걸 그랬어요.",
        "slot": "우산을 챙겨 올",
        "cue": {
          "en": "bring an umbrella",
          "ko": "우산을 챙겨 오다"
        },
        "gloss": {
          "en": "I should have brought an umbrella.",
          "ko": "우산을 챙겨 올 걸 그랬어요."
        }
      },
      {
        "text": "처음부터 너한테 같이 해 달라고 부탁할 걸 그랬다.",
        "slot": "처음부터 너한테 같이 해 달라고 부탁할",
        "cue": {
          "en": "ask you to do it together",
          "ko": "같이 해 달라고 부탁하다"
        },
        "gloss": {
          "en": "I should have asked you to do it with me from the start.",
          "ko": "처음부터 너한테 같이 해 달라고 부탁할 걸 그랬다."
        }
      }
    ]
  },
  {
    "id": "ko-f5-04",
    "stage": 5,
    "fn": "concession",
    "pattern": "___기는 한데 좀 부담스러워요.",
    "core": [
      "기는 한데",
      "기는 하는데"
    ],
    "meaning": {
      "en": "Admitting something but adding a catch: It's true that ___, but it's a bit much.",
      "ko": "인정하면서 덧붙이기: ___기는 한데 좀 부담스러워요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "가고 싶기는 한데 좀 부담스러워요.",
        "slot": "가고 싶",
        "cue": {
          "en": "want to go",
          "ko": "가고 싶다"
        },
        "gloss": {
          "en": "I do want to go, but it's a bit much for me.",
          "ko": "가고 싶기는 한데 좀 부담스러워요."
        }
      },
      {
        "text": "제안이 좋기는 한데 좀 부담스러워요.",
        "slot": "제안이 좋",
        "cue": {
          "en": "the offer is good",
          "ko": "제안이 좋다"
        },
        "gloss": {
          "en": "The offer is good, but it feels like a bit much.",
          "ko": "제안이 좋기는 한데 좀 부담스러워요."
        }
      },
      {
        "text": "디자인이 예쁘기는 한데 가격이 좀 부담스러워요.",
        "slot": "디자인이 예쁘",
        "cue": {
          "en": "the design is pretty",
          "ko": "디자인이 예쁘다"
        },
        "gloss": {
          "en": "The design is pretty, but the price is a bit steep.",
          "ko": "디자인이 예쁘기는 한데 가격이 좀 부담스러워요."
        }
      },
      {
        "text": "술을 마시기는 하는데 많이는 못 마셔요.",
        "slot": "술을 마시",
        "cue": {
          "en": "drink alcohol",
          "ko": "술을 마시다"
        },
        "gloss": {
          "en": "I do drink, but I can't drink much.",
          "ko": "술을 마시기는 하는데 많이는 못 마셔요."
        }
      }
    ]
  },
  {
    "id": "ko-f5-05",
    "stage": 5,
    "fn": "pretend",
    "pattern": "___(으)ㄴ/는 척했어요.",
    "core": [
      "척했어",
      "척하면서"
    ],
    "meaning": {
      "en": "Saying someone pretended: (They) pretended to ___.",
      "ko": "~하는 척 말하기: ___(으)ㄴ/는 척했어요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "그 사람은 못 들은 척했어요.",
        "slot": "그 사람은 못 들은",
        "cue": {
          "en": "not hear",
          "ko": "못 듣다"
        },
        "gloss": {
          "en": "That person pretended not to hear.",
          "ko": "그 사람은 못 들은 척했어요."
        }
      },
      {
        "text": "너무 피곤해서 자는 척했어요.",
        "slot": "너무 피곤해서 자는",
        "cue": {
          "en": "be asleep",
          "ko": "자다"
        },
        "gloss": {
          "en": "I was so tired I pretended to be asleep.",
          "ko": "너무 피곤해서 자는 척했어요."
        }
      },
      {
        "text": "그냥 알아듣는 척하면서 고개만 끄덕였어.",
        "slot": "그냥 알아듣는",
        "cue": {
          "en": "understand",
          "ko": "알아듣다"
        },
        "gloss": {
          "en": "I just nodded along, pretending to understand.",
          "ko": "그냥 알아듣는 척하면서 고개만 끄덕였어."
        }
      },
      {
        "text": "아는 사람이었는데 못 본 척했어.",
        "slot": "아는 사람이었는데 못 본",
        "cue": {
          "en": "not see",
          "ko": "못 보다"
        },
        "gloss": {
          "en": "It was someone I knew, but I pretended not to see them.",
          "ko": "아는 사람이었는데 못 본 척했어."
        }
      }
    ]
  },
  {
    "id": "ko-f5-06",
    "stage": 5,
    "fn": "nuance-soften",
    "pattern": "___(으)ㄹ 만하죠.",
    "core": [
      "만하죠",
      "만하지"
    ],
    "meaning": {
      "en": "Saying it's understandable or worth it: It's no wonder / it's worth ___.",
      "ko": "그럴 만하다고 말하기: ___(으)ㄹ 만하죠."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "그렇게 고생했으니 화날 만하죠.",
        "slot": "그렇게 고생했으니 화날",
        "cue": {
          "en": "get angry",
          "ko": "화나다"
        },
        "gloss": {
          "en": "After all that trouble, no wonder you're angry.",
          "ko": "그렇게 고생했으니 화날 만하죠."
        }
      },
      {
        "text": "이런 건 맥락을 알아야 웃기니까, 처음엔 못 알아들을 만하지.",
        "slot": "이런 건 맥락을 알아야 웃기니까, 처음엔 못 알아들을",
        "cue": {
          "en": "not understand",
          "ko": "못 알아듣다"
        },
        "gloss": {
          "en": "You need the context for this to be funny, so it makes sense you didn't get it at first.",
          "ko": "이런 건 맥락을 알아야 웃기니까, 처음엔 못 알아들을 만하지."
        }
      },
      {
        "text": "그 가격이면 한 번쯤 사 볼 만하죠.",
        "slot": "그 가격이면 한 번쯤 사 볼",
        "cue": {
          "en": "try buying",
          "ko": "사 보다"
        },
        "gloss": {
          "en": "At that price, it's worth buying once.",
          "ko": "그 가격이면 한 번쯤 사 볼 만하죠."
        }
      },
      {
        "text": "그 영화는 두 번 볼 만하지.",
        "slot": "그 영화는 두 번 볼",
        "cue": {
          "en": "watch twice",
          "ko": "두 번 보다"
        },
        "gloss": {
          "en": "That movie is worth seeing twice.",
          "ko": "그 영화는 두 번 볼 만하지."
        }
      }
    ]
  },
  {
    "id": "ko-f5-07",
    "stage": 5,
    "fn": "sympathy",
    "pattern": "___ 그럴 만도 하지.",
    "core": [
      "그럴 만도 하지"
    ],
    "meaning": {
      "en": "Showing understanding: (Since ___,) it's only natural.",
      "ko": "공감하기: ___ 그럴 만도 하지."
    },
    "grammar": [
      5
    ],
    "expressions": [
      "그럴 만도 하지"
    ],
    "examples": [
      {
        "text": "삼 년 넘게 다녔으니까 그럴 만도 하지.",
        "slot": "삼 년 넘게 다녔으니까",
        "cue": {
          "en": "have worked there for over three years",
          "ko": "삼 년 넘게 다니다"
        },
        "gloss": {
          "en": "You worked there for over three years, so it's only natural.",
          "ko": "삼 년 넘게 다녔으니까 그럴 만도 하지."
        }
      },
      {
        "text": "그렇게 오래 기다렸으면 그럴 만도 하지.",
        "slot": "그렇게 오래 기다렸으면",
        "cue": {
          "en": "wait that long",
          "ko": "그렇게 오래 기다리다"
        },
        "gloss": {
          "en": "If you waited that long, no wonder.",
          "ko": "그렇게 오래 기다렸으면 그럴 만도 하지."
        }
      },
      {
        "text": "밤새 일했다니 그럴 만도 하지.",
        "slot": "밤새 일했다니",
        "cue": {
          "en": "work all night",
          "ko": "밤새 일하다"
        },
        "gloss": {
          "en": "You worked all night? No wonder.",
          "ko": "밤새 일했다니 그럴 만도 하지."
        }
      },
      {
        "text": "처음 해 보는 일이니 그럴 만도 하지.",
        "slot": "처음 해 보는 일이니",
        "cue": {
          "en": "it's your first time doing it",
          "ko": "처음 해 보는 일이다"
        },
        "gloss": {
          "en": "It's your first time doing it, so that's understandable.",
          "ko": "처음 해 보는 일이니 그럴 만도 하지."
        }
      }
    ]
  },
  {
    "id": "ko-f5-08",
    "stage": 5,
    "fn": "storytelling",
    "pattern": "___더니 결국 …",
    "core": [
      "더니"
    ],
    "meaning": {
      "en": "Telling how something turned out after what you saw: (Earlier) ___, and then …",
      "ko": "본 일과 그 뒤 결과 말하기: ___더니 결국 ___."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "처음엔 힘들다고 매일 투덜대더니 요즘은 일이 재밌대.",
        "slot": "처음엔 힘들다고 매일 투덜대",
        "cue": {
          "en": "grumble every day that it's hard",
          "ko": "힘들다고 투덜대다"
        },
        "gloss": {
          "en": "He used to grumble every day that it was hard, but now he says work is fun.",
          "ko": "처음엔 힘들다고 매일 투덜대더니 요즘은 일이 재밌대."
        }
      },
      {
        "text": "아침에는 맑더니 오후에 비가 쏟아졌어요.",
        "slot": "아침에는 맑",
        "cue": {
          "en": "be clear in the morning",
          "ko": "아침에 맑다"
        },
        "gloss": {
          "en": "It was clear in the morning, but then it poured in the afternoon.",
          "ko": "아침에는 맑더니 오후에 비가 쏟아졌어요."
        }
      },
      {
        "text": "몇 달을 고민하더니 결국 회사를 옮겼어.",
        "slot": "몇 달을 고민하",
        "cue": {
          "en": "agonize for months",
          "ko": "몇 달을 고민하다"
        },
        "gloss": {
          "en": "After thinking it over for months, she finally changed jobs.",
          "ko": "몇 달을 고민하더니 결국 회사를 옮겼어."
        }
      },
      {
        "text": "동생이 운동을 시작하더니 살이 쏙 빠졌어.",
        "slot": "동생이 운동을 시작하",
        "cue": {
          "en": "start working out",
          "ko": "운동을 시작하다"
        },
        "gloss": {
          "en": "My sibling started working out and lost a lot of weight.",
          "ko": "동생이 운동을 시작하더니 살이 쏙 빠졌어."
        }
      }
    ]
  },
  {
    "id": "ko-f5-09",
    "stage": 5,
    "fn": "nuance-soften",
    "pattern": "___(으)ㄹ까 봐 …",
    "core": [
      "까 봐"
    ],
    "meaning": {
      "en": "Saying you acted out of worry: In case ___ / worried that ___.",
      "ko": "걱정돼서 한 일 말하기: ___(으)ㄹ까 봐 ___."
    },
    "grammar": [
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "늦을까 봐 택시를 탔어요.",
        "slot": "늦을",
        "cue": {
          "en": "be late",
          "ko": "늦다"
        },
        "gloss": {
          "en": "I took a taxi in case I was late.",
          "ko": "늦을까 봐 택시를 탔어요."
        }
      },
      {
        "text": "비가 올까 봐 우산을 챙겼어요.",
        "slot": "비가 올",
        "cue": {
          "en": "it rains",
          "ko": "비가 오다"
        },
        "gloss": {
          "en": "I brought an umbrella in case it rained.",
          "ko": "비가 올까 봐 우산을 챙겼어요."
        }
      },
      {
        "text": "괜히 나만 모르는 사람 될까 봐 바쁜 척했어.",
        "slot": "괜히 나만 모르는 사람 될",
        "cue": {
          "en": "be the only one who doesn't know",
          "ko": "나만 모르는 사람이 되다"
        },
        "gloss": {
          "en": "I pretended to be busy, worried I'd be the only one who didn't get it.",
          "ko": "괜히 나만 모르는 사람 될까 봐 바쁜 척했어."
        }
      },
      {
        "text": "저 때문에 일정이 꼬일까 봐 마음에 걸리네요.",
        "slot": "저 때문에 일정이 꼬일",
        "cue": {
          "en": "the schedule gets messed up",
          "ko": "일정이 꼬이다"
        },
        "gloss": {
          "en": "I'm worried the schedule will get messed up because of me.",
          "ko": "저 때문에 일정이 꼬일까 봐 마음에 걸리네요."
        }
      }
    ]
  },
  {
    "id": "ko-f5-10",
    "stage": 5,
    "fn": "regret-light",
    "pattern": "___ 게 계속 마음에 걸려요.",
    "core": [
      "마음에 걸려",
      "마음에 걸리"
    ],
    "meaning": {
      "en": "Saying something weighs on you: It keeps bothering me that ___.",
      "ko": "마음에 남은 일 말하기: ___ 게 계속 마음에 걸려요."
    },
    "grammar": [],
    "expressions": [
      "마음에 걸려요"
    ],
    "examples": [
      {
        "text": "친구한테 심하게 말한 게 계속 마음에 걸려요.",
        "slot": "친구한테 심하게 말한",
        "cue": {
          "en": "speak harshly to a friend",
          "ko": "친구한테 심하게 말하다"
        },
        "gloss": {
          "en": "It keeps bothering me that I spoke harshly to my friend.",
          "ko": "친구한테 심하게 말한 게 계속 마음에 걸려요."
        }
      },
      {
        "text": "어머니 생신에 못 간 게 계속 마음에 걸려요.",
        "slot": "어머니 생신에 못 간",
        "cue": {
          "en": "miss my mother's birthday",
          "ko": "어머니 생신에 못 가다"
        },
        "gloss": {
          "en": "It still weighs on me that I couldn't go to my mother's birthday.",
          "ko": "어머니 생신에 못 간 게 계속 마음에 걸려요."
        }
      },
      {
        "text": "후배 부탁을 거절한 게 계속 마음에 걸려.",
        "slot": "후배 부탁을 거절한",
        "cue": {
          "en": "turn down a junior's request",
          "ko": "후배 부탁을 거절하다"
        },
        "gloss": {
          "en": "It keeps bugging me that I turned down my junior's request.",
          "ko": "후배 부탁을 거절한 게 계속 마음에 걸려."
        }
      },
      {
        "text": "인사도 못 하고 나온 게 마음에 걸리네요.",
        "slot": "인사도 못 하고 나온",
        "cue": {
          "en": "leave without saying goodbye",
          "ko": "인사도 못 하고 나오다"
        },
        "gloss": {
          "en": "It bothers me that I left without saying goodbye.",
          "ko": "인사도 못 하고 나온 게 마음에 걸리네요."
        }
      }
    ]
  },
  {
    "id": "ko-f5-11",
    "stage": 5,
    "fn": "tact-refuse",
    "pattern": "___고 싶은 마음은 굴뚝같은데 …",
    "core": [
      "마음은 굴뚝같은데"
    ],
    "meaning": {
      "en": "Refusing warmly: I'd love to ___, but …",
      "ko": "따뜻하게 거절하기: ___고 싶은 마음은 굴뚝같은데 ___."
    },
    "grammar": [],
    "expressions": [
      "마음은 굴뚝같은데"
    ],
    "examples": [
      {
        "text": "도와드리고 싶은 마음은 굴뚝같은데 이번에는 정말 어려울 것 같아요.",
        "slot": "도와드리고 싶은",
        "cue": {
          "en": "want to help",
          "ko": "도와드리고 싶다"
        },
        "gloss": {
          "en": "I'd really love to help, but this time it's just too hard.",
          "ko": "도와드리고 싶은 마음은 굴뚝같은데 이번에는 정말 어려울 것 같아요."
        }
      },
      {
        "text": "같이 가고 싶은 마음은 굴뚝같은데 그날 선약이 있어서요.",
        "slot": "같이 가고 싶은",
        "cue": {
          "en": "want to go together",
          "ko": "같이 가고 싶다"
        },
        "gloss": {
          "en": "I'd love to go with you, but I already have plans that day.",
          "ko": "같이 가고 싶은 마음은 굴뚝같은데 그날 선약이 있어서요."
        }
      },
      {
        "text": "더 놀고 싶은 마음은 굴뚝같은데 내일 출근해야 돼.",
        "slot": "더 놀고 싶은",
        "cue": {
          "en": "want to hang out longer",
          "ko": "더 놀고 싶다"
        },
        "gloss": {
          "en": "I'd love to stay longer, but I have work tomorrow.",
          "ko": "더 놀고 싶은 마음은 굴뚝같은데 내일 출근해야 돼."
        }
      },
      {
        "text": "한턱내고 싶은 마음은 굴뚝같은데 이번 달은 사정이 좀 있어서요.",
        "slot": "한턱내고 싶은",
        "cue": {
          "en": "want to treat you",
          "ko": "한턱내고 싶다"
        },
        "gloss": {
          "en": "I'd love to treat you, but things are a bit tight this month.",
          "ko": "한턱내고 싶은 마음은 굴뚝같은데 이번 달은 사정이 좀 있어서요."
        }
      }
    ]
  },
  {
    "id": "ko-f5-12",
    "stage": 5,
    "fn": "tact-refuse",
    "pattern": "___ 사정이 좀 있어서요.",
    "core": [
      "사정이 좀 있어서"
    ],
    "meaning": {
      "en": "Declining vaguely: I have some circumstances ___.",
      "ko": "이유를 흐리며 거절하기: ___ 사정이 좀 있어서요."
    },
    "grammar": [],
    "expressions": [
      "사정이 좀 있어서"
    ],
    "examples": [
      {
        "text": "이번 주는 제가 사정이 좀 있어서요.",
        "slot": "이번 주는 제가",
        "cue": {
          "en": "this week, I",
          "ko": "이번 주는 내가"
        },
        "gloss": {
          "en": "This week I've got some things going on.",
          "ko": "이번 주는 제가 사정이 좀 있어서요."
        }
      },
      {
        "text": "요즘 집에 사정이 좀 있어서요.",
        "slot": "요즘 집에",
        "cue": {
          "en": "at home lately",
          "ko": "요즘 집에"
        },
        "gloss": {
          "en": "Things have been a bit complicated at home lately.",
          "ko": "요즘 집에 사정이 좀 있어서요."
        }
      },
      {
        "text": "그날은 가족 사정이 좀 있어서 못 갈 것 같아요.",
        "slot": "그날은 가족",
        "cue": {
          "en": "family, that day",
          "ko": "그날 가족"
        },
        "gloss": {
          "en": "I have a family matter that day, so I don't think I can go.",
          "ko": "그날은 가족 사정이 좀 있어서 못 갈 것 같아요."
        }
      },
      {
        "text": "회사에 사정이 좀 있어서 일정을 미뤄야 할 것 같아요.",
        "slot": "회사에",
        "cue": {
          "en": "at work",
          "ko": "회사에"
        },
        "gloss": {
          "en": "Something's come up at work, so I think we'll have to push the schedule back.",
          "ko": "회사에 사정이 좀 있어서 일정을 미뤄야 할 것 같아요."
        }
      }
    ]
  },
  {
    "id": "ko-f5-13",
    "stage": 5,
    "fn": "change-topic",
    "pattern": "말이 나온 김에 ___.",
    "core": [
      "말이 나온 김에"
    ],
    "meaning": {
      "en": "Seizing the moment: While we're on the subject, ___.",
      "ko": "말 나온 김에 제안하기: 말이 나온 김에 ___."
    },
    "grammar": [],
    "expressions": [
      "말이 나온 김에"
    ],
    "examples": [
      {
        "text": "말이 나온 김에, 오늘 저녁에 한잔할래?",
        "slot": "오늘 저녁에 한잔할래",
        "cue": {
          "en": "have a drink tonight",
          "ko": "오늘 저녁에 한잔하다"
        },
        "gloss": {
          "en": "Since we're on the subject, want to grab a drink tonight?",
          "ko": "말이 나온 김에, 오늘 저녁에 한잔할래?"
        }
      },
      {
        "text": "말이 나온 김에 이번 주말에 셋이 보자.",
        "slot": "이번 주말에 셋이 보자",
        "cue": {
          "en": "the three of us meet this weekend",
          "ko": "이번 주말에 셋이 보다"
        },
        "gloss": {
          "en": "While we're at it, let's all three meet up this weekend.",
          "ko": "말이 나온 김에 이번 주말에 셋이 보자."
        }
      },
      {
        "text": "말이 나온 김에 지금 바로 예약할게요.",
        "slot": "지금 바로 예약할게요",
        "cue": {
          "en": "book it right now",
          "ko": "지금 바로 예약하다"
        },
        "gloss": {
          "en": "Since it came up, I'll book it right now.",
          "ko": "말이 나온 김에 지금 바로 예약할게요."
        }
      },
      {
        "text": "말이 나온 김에 휴가 계획도 같이 세워 봐요.",
        "slot": "휴가 계획도 같이 세워 봐요",
        "cue": {
          "en": "make vacation plans together",
          "ko": "휴가 계획을 같이 세우다"
        },
        "gloss": {
          "en": "While we're on it, let's plan our vacation together too.",
          "ko": "말이 나온 김에 휴가 계획도 같이 세워 봐요."
        }
      }
    ]
  },
  {
    "id": "ko-f5-14",
    "stage": 5,
    "fn": "thank",
    "pattern": "선배님 덕분에 ___.",
    "core": [
      "덕분에"
    ],
    "meaning": {
      "en": "Crediting a senior politely: Thanks to you (senior), ___.",
      "ko": "윗사람 덕을 돌리기: 선배님 덕분에 ___."
    },
    "grammar": [],
    "expressions": [
      "선배님 덕분에"
    ],
    "examples": [
      {
        "text": "선배님들 덕분에 이제 조금 감이 잡히는 것 같아요.",
        "slot": "이제 조금 감이 잡히는 것 같아요",
        "cue": {
          "en": "start to get the hang of it",
          "ko": "감이 잡히다"
        },
        "gloss": {
          "en": "Thanks to my seniors, I think I'm starting to get the hang of it.",
          "ko": "선배님들 덕분에 이제 조금 감이 잡히는 것 같아요."
        }
      },
      {
        "text": "선배님 덕분에 발표를 무사히 마쳤어요.",
        "slot": "발표를 무사히 마쳤어요",
        "cue": {
          "en": "finish the presentation safely",
          "ko": "발표를 무사히 마치다"
        },
        "gloss": {
          "en": "Thanks to you, I got through the presentation without a hitch.",
          "ko": "선배님 덕분에 발표를 무사히 마쳤어요."
        }
      },
      {
        "text": "선배님 덕분에 실력이 많이 늘었어요.",
        "slot": "실력이 많이 늘었어요",
        "cue": {
          "en": "improve a lot",
          "ko": "실력이 늘다"
        },
        "gloss": {
          "en": "Thanks to you, my skills have improved a lot.",
          "ko": "선배님 덕분에 실력이 많이 늘었어요."
        }
      },
      {
        "text": "선배님 덕분에 회사 생활에 금방 적응했어요.",
        "slot": "회사 생활에 금방 적응했어요",
        "cue": {
          "en": "adapt quickly to work life",
          "ko": "회사 생활에 적응하다"
        },
        "gloss": {
          "en": "Thanks to you, I settled into work life quickly.",
          "ko": "선배님 덕분에 회사 생활에 금방 적응했어요."
        }
      }
    ]
  },
  {
    "id": "ko-f5-15",
    "stage": 5,
    "fn": "tact-refuse",
    "pattern": "___ 생각 좀 해 볼게요.",
    "core": [
      "생각 좀 해 볼게요"
    ],
    "meaning": {
      "en": "Putting off a decision politely: ___, so let me think about it.",
      "ko": "결정 미루며 거절하기: ___ 생각 좀 해 볼게요."
    },
    "grammar": [],
    "expressions": [
      "생각 좀 해 볼게요"
    ],
    "examples": [
      {
        "text": "좋긴 한데요, 금액이 커서 생각 좀 해 볼게요.",
        "slot": "좋긴 한데요, 금액이 커서",
        "cue": {
          "en": "the amount is large",
          "ko": "금액이 크다"
        },
        "gloss": {
          "en": "It's nice, but it's a lot of money, so let me think about it.",
          "ko": "좋긴 한데요, 금액이 커서 생각 좀 해 볼게요."
        }
      },
      {
        "text": "좋은 제안인데 집에 가서 생각 좀 해 볼게요.",
        "slot": "좋은 제안인데 집에 가서",
        "cue": {
          "en": "go home first",
          "ko": "집에 가다"
        },
        "gloss": {
          "en": "It's a good offer, but I'll go home and think it over.",
          "ko": "좋은 제안인데 집에 가서 생각 좀 해 볼게요."
        }
      },
      {
        "text": "당장은 결정하기 어려워서 생각 좀 해 볼게요.",
        "slot": "당장은 결정하기 어려워서",
        "cue": {
          "en": "it's hard to decide right now",
          "ko": "당장 결정하기 어렵다"
        },
        "gloss": {
          "en": "It's hard to decide right now, so let me think about it.",
          "ko": "당장은 결정하기 어려워서 생각 좀 해 볼게요."
        }
      },
      {
        "text": "가족들하고 상의하고 생각 좀 해 볼게요.",
        "slot": "가족들하고 상의하고",
        "cue": {
          "en": "talk it over with family",
          "ko": "가족들하고 상의하다"
        },
        "gloss": {
          "en": "I'll talk it over with my family and think about it.",
          "ko": "가족들하고 상의하고 생각 좀 해 볼게요."
        }
      }
    ]
  },
  {
    "id": "ko-f5-16",
    "stage": 5,
    "fn": "tact-refuse",
    "pattern": "아쉽지만 다음 기회에 ___.",
    "core": [
      "다음 기회에"
    ],
    "meaning": {
      "en": "Turning down for now: Unfortunately, maybe next time ___.",
      "ko": "다음으로 미루며 거절하기: 아쉽지만 다음 기회에 ___."
    },
    "grammar": [],
    "expressions": [
      "다음 기회에"
    ],
    "examples": [
      {
        "text": "아쉽지만 다음 기회에 같이 가요.",
        "slot": "같이 가요",
        "cue": {
          "en": "go together",
          "ko": "같이 가다"
        },
        "gloss": {
          "en": "Too bad, but let's go together next time.",
          "ko": "아쉽지만 다음 기회에 같이 가요."
        }
      },
      {
        "text": "오늘은 약속이 있어서요. 다음 기회에 할게요.",
        "slot": "할게요",
        "cue": {
          "en": "do it",
          "ko": "하다"
        },
        "gloss": {
          "en": "I have plans today. I'll do it next time.",
          "ko": "오늘은 약속이 있어서요. 다음 기회에 할게요."
        }
      },
      {
        "text": "이번 모임은 빠지고 다음 기회에 꼭 갈게요.",
        "slot": "꼭 갈게요",
        "cue": {
          "en": "definitely go",
          "ko": "꼭 가다"
        },
        "gloss": {
          "en": "I'll skip this gathering, but I'll definitely come next time.",
          "ko": "이번 모임은 빠지고 다음 기회에 꼭 갈게요."
        }
      },
      {
        "text": "그 얘기는 다음 기회에 천천히 해요.",
        "slot": "천천히 해요",
        "cue": {
          "en": "talk slowly / at leisure",
          "ko": "천천히 하다"
        },
        "gloss": {
          "en": "Let's talk about that properly another time.",
          "ko": "그 얘기는 다음 기회에 천천히 해요."
        }
      }
    ]
  },
  {
    "id": "ko-f5-17",
    "stage": 5,
    "fn": "describe-person",
    "pattern": "___는 발이 넓어서 …",
    "core": [
      "발이 넓"
    ],
    "meaning": {
      "en": "Describing someone well-connected (idiom): ___ knows a lot of people.",
      "ko": "관용 표현으로 사람 말하기: ___는 발이 넓어서 ___."
    },
    "grammar": [],
    "expressions": [
      "발이 넓다"
    ],
    "examples": [
      {
        "text": "수진이가 발이 넓잖아. 회사 사람에 동네 친구까지 다 왔더라.",
        "slot": "수진이가",
        "cue": {
          "en": "Sujin",
          "ko": "수진이"
        },
        "gloss": {
          "en": "Sujin knows everyone. Coworkers and neighborhood friends all came.",
          "ko": "수진이가 발이 넓잖아. 회사 사람에 동네 친구까지 다 왔더라."
        }
      },
      {
        "text": "우리 팀장님이 발이 넓으셔서 금방 사람을 구하셨어요.",
        "slot": "우리 팀장님이",
        "cue": {
          "en": "our team leader",
          "ko": "우리 팀장님"
        },
        "gloss": {
          "en": "Our team leader knows a lot of people, so he found someone quickly.",
          "ko": "우리 팀장님이 발이 넓으셔서 금방 사람을 구하셨어요."
        }
      },
      {
        "text": "그 친구는 발이 넓으니까 한번 물어봐.",
        "slot": "그 친구는",
        "cue": {
          "en": "that friend",
          "ko": "그 친구"
        },
        "gloss": {
          "en": "That friend knows tons of people, so ask him.",
          "ko": "그 친구는 발이 넓으니까 한번 물어봐."
        }
      },
      {
        "text": "삼촌이 발이 넓어서 동네에 모르는 사람이 없어요.",
        "slot": "삼촌이",
        "cue": {
          "en": "my uncle",
          "ko": "삼촌"
        },
        "gloss": {
          "en": "My uncle is so well-connected that he knows everyone in the neighborhood.",
          "ko": "삼촌이 발이 넓어서 동네에 모르는 사람이 없어요."
        }
      }
    ]
  },
  {
    "id": "ko-f5-18",
    "stage": 5,
    "fn": "describe-person",
    "pattern": "… 손이 커서 ___.",
    "core": [
      "손이 커"
    ],
    "meaning": {
      "en": "Describing someone generous (idiom): ___ is so generous that …",
      "ko": "관용 표현으로 사람 말하기: ___ 손이 커서 ___."
    },
    "grammar": [],
    "expressions": [
      "손이 크다"
    ],
    "examples": [
      {
        "text": "손이 커서 음식을 산더미처럼 해 놨어.",
        "slot": "음식을 산더미처럼 해 놨어",
        "cue": {
          "en": "make mountains of food",
          "ko": "음식을 산더미처럼 하다"
        },
        "gloss": {
          "en": "She's so generous she made mountains of food.",
          "ko": "손이 커서 음식을 산더미처럼 해 놨어."
        }
      },
      {
        "text": "할머니는 손이 커서 김치를 항상 많이 담그세요.",
        "slot": "할머니는",
        "cue": {
          "en": "grandma",
          "ko": "할머니"
        },
        "gloss": {
          "en": "Grandma is generous and always makes loads of kimchi.",
          "ko": "할머니는 손이 커서 김치를 항상 많이 담그세요."
        }
      },
      {
        "text": "사장님이 손이 커서 반찬을 넉넉하게 주세요.",
        "slot": "사장님이",
        "cue": {
          "en": "the owner",
          "ko": "사장님"
        },
        "gloss": {
          "en": "The owner is generous and gives plenty of side dishes.",
          "ko": "사장님이 손이 커서 반찬을 넉넉하게 주세요."
        }
      },
      {
        "text": "엄마가 손이 커서 명절마다 음식이 남아.",
        "slot": "엄마가",
        "cue": {
          "en": "mom",
          "ko": "엄마"
        },
        "gloss": {
          "en": "Mom always cooks big, so there's leftover food every holiday.",
          "ko": "엄마가 손이 커서 명절마다 음식이 남아."
        }
      }
    ]
  },
  {
    "id": "ko-f5-19",
    "stage": 5,
    "fn": "describe-person",
    "pattern": "___ 입이 무거워서 …",
    "core": [
      "입이 무거"
    ],
    "meaning": {
      "en": "Describing someone discreet (idiom): ___ can keep a secret.",
      "ko": "관용 표현으로 사람 말하기: ___ 입이 무거워서 ___."
    },
    "grammar": [],
    "expressions": [
      "입이 무겁다"
    ],
    "examples": [
      {
        "text": "걱정 마. 나 입이 무거운 거 알잖아.",
        "slot": "걱정 마. 나",
        "cue": {
          "en": "me",
          "ko": "나"
        },
        "gloss": {
          "en": "Don't worry. You know I can keep a secret.",
          "ko": "걱정 마. 나 입이 무거운 거 알잖아."
        }
      },
      {
        "text": "그 선배는 입이 무거워서 믿고 말할 수 있어요.",
        "slot": "그 선배는",
        "cue": {
          "en": "that senior",
          "ko": "그 선배"
        },
        "gloss": {
          "en": "That senior is discreet, so you can trust him with it.",
          "ko": "그 선배는 입이 무거워서 믿고 말할 수 있어요."
        }
      },
      {
        "text": "민수는 입이 무거우니까 비밀 지켜 줄 거야.",
        "slot": "민수는",
        "cue": {
          "en": "Minsu",
          "ko": "민수"
        },
        "gloss": {
          "en": "Minsu won't tell anyone, so he'll keep the secret.",
          "ko": "민수는 입이 무거우니까 비밀 지켜 줄 거야."
        }
      },
      {
        "text": "우리 언니가 입이 무거워서 고민 상담을 많이 받아.",
        "slot": "우리 언니가",
        "cue": {
          "en": "my older sister",
          "ko": "우리 언니"
        },
        "gloss": {
          "en": "My older sister is discreet, so people often come to her with their problems.",
          "ko": "우리 언니가 입이 무거워서 고민 상담을 많이 받아."
        }
      }
    ]
  },
  {
    "id": "ko-f5-20",
    "stage": 5,
    "fn": "idiom-react",
    "pattern": "___ 눈치가 빠르네.",
    "core": [
      "눈치가 빠르"
    ],
    "meaning": {
      "en": "Praising someone quick to catch on (idiom): You catch on fast.",
      "ko": "관용 표현으로 반응하기: ___ 눈치가 빠르네."
    },
    "grammar": [],
    "expressions": [
      "눈치가 빠르네"
    ],
    "examples": [
      {
        "text": "그렇지! 눈치가 빠르네.",
        "slot": "그렇지!",
        "cue": {
          "en": "that's right",
          "ko": "그렇다"
        },
        "gloss": {
          "en": "Exactly! You catch on fast.",
          "ko": "그렇지! 눈치가 빠르네."
        }
      },
      {
        "text": "벌써 알아챘어? 너 진짜 눈치가 빠르다.",
        "slot": "벌써 알아챘어? 너 진짜",
        "cue": {
          "en": "notice already",
          "ko": "벌써 알아채다"
        },
        "gloss": {
          "en": "You noticed already? You're really quick.",
          "ko": "벌써 알아챘어? 너 진짜 눈치가 빠르다."
        }
      },
      {
        "text": "역시 팀장님은 눈치가 빠르시네요.",
        "slot": "역시 팀장님은",
        "cue": {
          "en": "as expected, the team leader",
          "ko": "역시 팀장님"
        },
        "gloss": {
          "en": "As expected, you don't miss a thing, sir.",
          "ko": "역시 팀장님은 눈치가 빠르시네요."
        }
      },
      {
        "text": "말도 안 했는데 어떻게 알았어? 눈치가 빠르구나.",
        "slot": "말도 안 했는데 어떻게 알았어?",
        "cue": {
          "en": "how did you know without being told",
          "ko": "어떻게 알다"
        },
        "gloss": {
          "en": "I didn't even say anything—how did you know? You're sharp.",
          "ko": "말도 안 했는데 어떻게 알았어? 눈치가 빠르구나."
        }
      }
    ]
  }
];
