import type { Frame } from "../frames.ts";

/** 한국어 1~3단계 틀(curriculum/frames.ts) — 기능 id(fn)는 curriculum/functions.ts. Claude가 쓰고 다시 고침, 원어민 확인 전. */
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
  }
];
