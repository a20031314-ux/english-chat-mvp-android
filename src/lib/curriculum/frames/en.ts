import type { Frame } from "../frames.ts";

/** 영어 1~5단계 틀(curriculum/frames.ts) — 기능 id(fn)는 curriculum/functions.ts. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
export const EN_FRAMES: Frame[] = [
  {
    "id": "en-f1-01",
    "stage": 1,
    "fn": "introduce",
    "pattern": "My name is ___.",
    "core": [
      "My name is",
      "my name is"
    ],
    "meaning": {
      "en": "Saying your name: My name is ___.",
      "ko": "이름 말하기: 제 이름은 ___예요."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "nice to meet you"
    ],
    "examples": [
      {
        "text": "My name is Ji-woo.",
        "slot": "Ji-woo",
        "cue": {
          "en": "Ji-woo (your name)",
          "ko": "지우(내 이름)"
        },
        "gloss": {
          "en": "My name is Ji-woo.",
          "ko": "제 이름은 지우예요."
        }
      },
      {
        "text": "Hi, my name is Daniel. Nice to meet you.",
        "slot": "Daniel",
        "cue": {
          "en": "Daniel",
          "ko": "다니엘"
        },
        "gloss": {
          "en": "Hi, my name is Daniel. Nice to meet you.",
          "ko": "안녕하세요, 저는 다니엘이에요. 만나서 반가워요."
        }
      },
      {
        "text": "My name is Maria Lopez.",
        "slot": "Maria Lopez",
        "cue": {
          "en": "Maria Lopez (full name)",
          "ko": "마리아 로페즈(성과 이름)"
        },
        "gloss": {
          "en": "My name is Maria Lopez.",
          "ko": "제 이름은 마리아 로페즈예요."
        }
      },
      {
        "text": "My name is Min-ho. And you?",
        "slot": "Min-ho",
        "cue": {
          "en": "Min-ho",
          "ko": "민호"
        },
        "gloss": {
          "en": "My name is Min-ho. And you?",
          "ko": "저는 민호예요. 당신은요?"
        }
      }
    ]
  },
  {
    "id": "en-f1-02",
    "stage": 1,
    "fn": "origin",
    "pattern": "I'm from ___.",
    "core": [
      "I'm from"
    ],
    "meaning": {
      "en": "Saying where you are from: I'm from ___.",
      "ko": "출신 말하기: 저는 ___에서 왔어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "I'm from Korea.",
        "slot": "Korea",
        "cue": {
          "en": "Korea",
          "ko": "한국"
        },
        "gloss": {
          "en": "I'm from Korea.",
          "ko": "저는 한국에서 왔어요."
        }
      },
      {
        "text": "I'm from Busan.",
        "slot": "Busan",
        "cue": {
          "en": "Busan",
          "ko": "부산"
        },
        "gloss": {
          "en": "I'm from Busan.",
          "ko": "저는 부산 출신이에요."
        }
      },
      {
        "text": "I'm from Mexico, and my husband is from Spain.",
        "slot": "Mexico",
        "cue": {
          "en": "Mexico",
          "ko": "멕시코"
        },
        "gloss": {
          "en": "I'm from Mexico, and my husband is from Spain.",
          "ko": "저는 멕시코, 남편은 스페인 출신이에요."
        }
      },
      {
        "text": "I'm from Vietnam. How about you?",
        "slot": "Vietnam",
        "cue": {
          "en": "Vietnam",
          "ko": "베트남"
        },
        "gloss": {
          "en": "I'm from Vietnam. How about you?",
          "ko": "저는 베트남에서 왔어요. 당신은요?"
        }
      }
    ]
  },
  {
    "id": "en-f1-03",
    "stage": 1,
    "fn": "job",
    "pattern": "I'm a ___.",
    "core": [
      "I'm a",
      "I'm an"
    ],
    "meaning": {
      "en": "Saying what you do: I'm a ___ (use an before a vowel sound).",
      "ko": "직업 말하기: 저는 ___예요(모음 소리 앞에서는 an)."
    },
    "grammar": [
      0,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "I'm a nurse.",
        "slot": "nurse",
        "cue": {
          "en": "nurse",
          "ko": "간호사"
        },
        "gloss": {
          "en": "I'm a nurse.",
          "ko": "저는 간호사예요."
        }
      },
      {
        "text": "I'm a student.",
        "slot": "student",
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
        "text": "I'm an engineer.",
        "slot": "engineer",
        "cue": {
          "en": "engineer (an + vowel sound)",
          "ko": "엔지니어(모음 소리 앞 an)"
        },
        "gloss": {
          "en": "I'm an engineer.",
          "ko": "저는 엔지니어예요."
        }
      },
      {
        "text": "I'm a cook at a small restaurant.",
        "slot": "cook",
        "cue": {
          "en": "cook",
          "ko": "요리사"
        },
        "gloss": {
          "en": "I'm a cook at a small restaurant.",
          "ko": "저는 작은 식당 요리사예요."
        }
      }
    ]
  },
  {
    "id": "en-f1-04",
    "stage": 1,
    "fn": "job",
    "pattern": "I work at ___.",
    "core": [
      "I work at",
      "works at"
    ],
    "meaning": {
      "en": "Saying where you work: I work at ___.",
      "ko": "일하는 곳 말하기: 저는 ___에서 일해요."
    },
    "grammar": [
      1,
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "I work at a hospital.",
        "slot": "a hospital",
        "cue": {
          "en": "a hospital",
          "ko": "병원"
        },
        "gloss": {
          "en": "I work at a hospital.",
          "ko": "저는 병원에서 일해요."
        }
      },
      {
        "text": "I work at a bank.",
        "slot": "a bank",
        "cue": {
          "en": "a bank",
          "ko": "은행"
        },
        "gloss": {
          "en": "I work at a bank.",
          "ko": "저는 은행에서 일해요."
        }
      },
      {
        "text": "My sister works at a school.",
        "slot": "a school",
        "cue": {
          "en": "a school (he/she works)",
          "ko": "학교(he/she는 works)"
        },
        "gloss": {
          "en": "My sister works at a school.",
          "ko": "제 언니는 학교에서 일해요."
        }
      },
      {
        "text": "I work at home on Fridays.",
        "slot": "home",
        "cue": {
          "en": "home",
          "ko": "집"
        },
        "gloss": {
          "en": "I work at home on Fridays.",
          "ko": "금요일에는 집에서 일해요."
        }
      }
    ]
  },
  {
    "id": "en-f1-05",
    "stage": 1,
    "fn": "ask-price",
    "pattern": "How much is ___?",
    "core": [
      "How much is",
      "how much is"
    ],
    "meaning": {
      "en": "Asking the price: How much is ___?",
      "ko": "값 묻기: ___ 얼마예요?"
    },
    "grammar": [
      0
    ],
    "expressions": [
      "how much is this"
    ],
    "examples": [
      {
        "text": "How much is this?",
        "slot": "this",
        "cue": {
          "en": "this",
          "ko": "이것"
        },
        "gloss": {
          "en": "How much is this?",
          "ko": "이거 얼마예요?"
        }
      },
      {
        "text": "How much is the blue bag?",
        "slot": "the blue bag",
        "cue": {
          "en": "the blue bag",
          "ko": "파란 가방"
        },
        "gloss": {
          "en": "How much is the blue bag?",
          "ko": "파란 가방은 얼마예요?"
        }
      },
      {
        "text": "Excuse me, how much is a coffee?",
        "slot": "a coffee",
        "cue": {
          "en": "a coffee",
          "ko": "커피 한 잔"
        },
        "gloss": {
          "en": "Excuse me, how much is a coffee?",
          "ko": "저기요, 커피 한 잔에 얼마예요?"
        }
      },
      {
        "text": "How much is the ticket to Boston?",
        "slot": "the ticket to Boston",
        "cue": {
          "en": "the ticket to Boston",
          "ko": "보스턴행 표"
        },
        "gloss": {
          "en": "How much is the ticket to Boston?",
          "ko": "보스턴행 표는 얼마예요?"
        }
      }
    ]
  },
  {
    "id": "en-f1-06",
    "stage": 1,
    "fn": "request-thing",
    "pattern": "Can I have ___, please?",
    "core": [
      "Can I have",
      "can I have"
    ],
    "meaning": {
      "en": "Asking for something: Can I have ___, please?",
      "ko": "달라고 하기: ___ 주시겠어요?"
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Can I have water, please?",
        "slot": "water",
        "cue": {
          "en": "water",
          "ko": "물"
        },
        "gloss": {
          "en": "Can I have water, please?",
          "ko": "물 좀 주시겠어요?"
        }
      },
      {
        "text": "Can I have the menu, please?",
        "slot": "the menu",
        "cue": {
          "en": "the menu",
          "ko": "메뉴판"
        },
        "gloss": {
          "en": "Can I have the menu, please?",
          "ko": "메뉴판 좀 주시겠어요?"
        }
      },
      {
        "text": "Can I have two bags, please?",
        "slot": "two bags",
        "cue": {
          "en": "two bags",
          "ko": "봉투 두 개"
        },
        "gloss": {
          "en": "Can I have two bags, please?",
          "ko": "봉투 두 개 주시겠어요?"
        }
      },
      {
        "text": "Can I have a receipt, please?",
        "slot": "a receipt",
        "cue": {
          "en": "a receipt",
          "ko": "영수증"
        },
        "gloss": {
          "en": "Can I have a receipt, please?",
          "ko": "영수증 주시겠어요?"
        }
      }
    ]
  },
  {
    "id": "en-f1-07",
    "stage": 1,
    "fn": "ask-where",
    "pattern": "Where is ___?",
    "core": [
      "Where is",
      "where is"
    ],
    "meaning": {
      "en": "Asking where something is: Where is ___?",
      "ko": "위치 묻기: ___ 어디에 있어요?"
    },
    "grammar": [
      0,
      2
    ],
    "expressions": [
      "where is the station"
    ],
    "examples": [
      {
        "text": "Excuse me, where is the station?",
        "slot": "the station",
        "cue": {
          "en": "the station",
          "ko": "역"
        },
        "gloss": {
          "en": "Excuse me, where is the station?",
          "ko": "실례지만, 역이 어디예요?"
        }
      },
      {
        "text": "Where is the bathroom?",
        "slot": "the bathroom",
        "cue": {
          "en": "the bathroom",
          "ko": "화장실"
        },
        "gloss": {
          "en": "Where is the bathroom?",
          "ko": "화장실이 어디예요?"
        }
      },
      {
        "text": "Where is the bus stop?",
        "slot": "the bus stop",
        "cue": {
          "en": "the bus stop",
          "ko": "버스 정류장"
        },
        "gloss": {
          "en": "Where is the bus stop?",
          "ko": "버스 정류장이 어디예요?"
        }
      },
      {
        "text": "Sorry, where is the bank?",
        "slot": "the bank",
        "cue": {
          "en": "the bank",
          "ko": "은행"
        },
        "gloss": {
          "en": "Sorry, where is the bank?",
          "ko": "죄송한데, 은행이 어디예요?"
        }
      }
    ]
  },
  {
    "id": "en-f1-08",
    "stage": 1,
    "fn": "directions",
    "pattern": "It's next to ___.",
    "core": [
      "next to"
    ],
    "meaning": {
      "en": "Saying where something is: It's next to ___.",
      "ko": "위치 말하기: ___ 옆에 있어요."
    },
    "grammar": [
      2
    ],
    "expressions": [
      "next to the bank"
    ],
    "examples": [
      {
        "text": "It's next to the bank.",
        "slot": "the bank",
        "cue": {
          "en": "the bank",
          "ko": "은행"
        },
        "gloss": {
          "en": "It's next to the bank.",
          "ko": "은행 옆에 있어요."
        }
      },
      {
        "text": "The cafe is next to the park.",
        "slot": "the park",
        "cue": {
          "en": "the park",
          "ko": "공원"
        },
        "gloss": {
          "en": "The cafe is next to the park.",
          "ko": "카페는 공원 옆에 있어요."
        }
      },
      {
        "text": "It's on the left, next to the post office.",
        "slot": "the post office",
        "cue": {
          "en": "the post office",
          "ko": "우체국"
        },
        "gloss": {
          "en": "It's on the left, next to the post office.",
          "ko": "왼쪽에, 우체국 옆에 있어요."
        }
      },
      {
        "text": "My house is next to a big school.",
        "slot": "a big school",
        "cue": {
          "en": "a big school",
          "ko": "큰 학교"
        },
        "gloss": {
          "en": "My house is next to a big school.",
          "ko": "우리 집은 큰 학교 옆이에요."
        }
      }
    ]
  },
  {
    "id": "en-f1-09",
    "stage": 1,
    "fn": "like",
    "pattern": "I like ___.",
    "core": [
      "I like"
    ],
    "meaning": {
      "en": "Saying what you like: I like ___.",
      "ko": "좋아하는 것 말하기: 저는 ___ 좋아해요."
    },
    "grammar": [
      1,
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "I like coffee.",
        "slot": "coffee",
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
        "text": "I like cats.",
        "slot": "cats",
        "cue": {
          "en": "cats (plural)",
          "ko": "고양이(복수)"
        },
        "gloss": {
          "en": "I like cats.",
          "ko": "저는 고양이를 좋아해요."
        }
      },
      {
        "text": "I like Korean food.",
        "slot": "Korean food",
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
        "text": "I like movies, but my brother likes books.",
        "slot": "movies",
        "cue": {
          "en": "movies",
          "ko": "영화"
        },
        "gloss": {
          "en": "I like movies, but my brother likes books.",
          "ko": "저는 영화를 좋아하는데, 동생은 책을 좋아해요."
        }
      }
    ]
  },
  {
    "id": "en-f1-10",
    "stage": 1,
    "fn": "dislike",
    "pattern": "I don't ___.",
    "core": [
      "I don't"
    ],
    "meaning": {
      "en": "Saying what you don't do or like: I don't ___.",
      "ko": "안 하는 것·싫은 것 말하기: 저는 ___ 안 해요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "I don't eat meat.",
        "slot": "eat meat",
        "cue": {
          "en": "eat meat",
          "ko": "고기를 먹다"
        },
        "gloss": {
          "en": "I don't eat meat.",
          "ko": "저는 고기를 안 먹어요."
        }
      },
      {
        "text": "I don't like the gym.",
        "slot": "like the gym",
        "cue": {
          "en": "like the gym",
          "ko": "헬스장을 좋아하다"
        },
        "gloss": {
          "en": "I don't like the gym.",
          "ko": "저는 헬스장을 안 좋아해요."
        }
      },
      {
        "text": "I don't work on Sundays.",
        "slot": "work on Sundays",
        "cue": {
          "en": "work on Sundays",
          "ko": "일요일에 일하다"
        },
        "gloss": {
          "en": "I don't work on Sundays.",
          "ko": "저는 일요일에는 일 안 해요."
        }
      },
      {
        "text": "Sorry, I don't understand.",
        "slot": "understand",
        "cue": {
          "en": "understand",
          "ko": "이해하다"
        },
        "gloss": {
          "en": "Sorry, I don't understand.",
          "ko": "죄송해요, 이해가 안 돼요."
        }
      }
    ]
  },
  {
    "id": "en-f1-11",
    "stage": 1,
    "fn": "can",
    "pattern": "I can ___.",
    "core": [
      "I can"
    ],
    "meaning": {
      "en": "Saying what you can do: I can ___.",
      "ko": "할 수 있는 것 말하기: 저는 ___ 할 수 있어요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "I can swim.",
        "slot": "swim",
        "cue": {
          "en": "swim",
          "ko": "수영하다"
        },
        "gloss": {
          "en": "I can swim.",
          "ko": "저는 수영할 수 있어요."
        }
      },
      {
        "text": "I can speak a little English.",
        "slot": "speak a little English",
        "cue": {
          "en": "speak a little English",
          "ko": "영어를 조금 하다"
        },
        "gloss": {
          "en": "I can speak a little English.",
          "ko": "저는 영어를 조금 할 수 있어요."
        }
      },
      {
        "text": "I can cook Thai food.",
        "slot": "cook Thai food",
        "cue": {
          "en": "cook Thai food",
          "ko": "태국 음식을 만들다"
        },
        "gloss": {
          "en": "I can cook Thai food.",
          "ko": "저는 태국 음식을 만들 수 있어요."
        }
      },
      {
        "text": "I can help you.",
        "slot": "help you",
        "cue": {
          "en": "help you",
          "ko": "당신을 돕다"
        },
        "gloss": {
          "en": "I can help you.",
          "ko": "제가 도와드릴 수 있어요."
        }
      }
    ]
  },
  {
    "id": "en-f1-12",
    "stage": 1,
    "fn": "cannot",
    "pattern": "I can't ___.",
    "core": [
      "I can't"
    ],
    "meaning": {
      "en": "Saying what you can't do: I can't ___.",
      "ko": "못 하는 것 말하기: 저는 ___ 못 해요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "I can't swim.",
        "slot": "swim",
        "cue": {
          "en": "swim",
          "ko": "수영하다"
        },
        "gloss": {
          "en": "I can't swim.",
          "ko": "저는 수영을 못 해요."
        }
      },
      {
        "text": "I can't run fast.",
        "slot": "run fast",
        "cue": {
          "en": "run fast",
          "ko": "빨리 달리다"
        },
        "gloss": {
          "en": "I can't run fast.",
          "ko": "저는 빨리 못 달려요."
        }
      },
      {
        "text": "Sorry, I can't hear you.",
        "slot": "hear you",
        "cue": {
          "en": "hear you",
          "ko": "당신 말을 듣다"
        },
        "gloss": {
          "en": "Sorry, I can't hear you.",
          "ko": "죄송해요, 잘 안 들려요."
        }
      },
      {
        "text": "I can't find my phone.",
        "slot": "find my phone",
        "cue": {
          "en": "find my phone",
          "ko": "내 휴대폰을 찾다"
        },
        "gloss": {
          "en": "I can't find my phone.",
          "ko": "휴대폰을 못 찾겠어요."
        }
      }
    ]
  },
  {
    "id": "en-f1-13",
    "stage": 1,
    "fn": "request-action",
    "pattern": "Can you ___, please?",
    "core": [
      "Can you",
      "can you"
    ],
    "meaning": {
      "en": "Asking someone to do something: Can you ___, please?",
      "ko": "부탁하기: ___ 해 주실 수 있어요?"
    },
    "grammar": [
      6
    ],
    "expressions": [
      "say that again"
    ],
    "examples": [
      {
        "text": "Can you say that again, please?",
        "slot": "say that again",
        "cue": {
          "en": "say that again",
          "ko": "다시 말하다"
        },
        "gloss": {
          "en": "Can you say that again, please?",
          "ko": "다시 한번 말해 주실래요?"
        }
      },
      {
        "text": "Can you speak slowly, please?",
        "slot": "speak slowly",
        "cue": {
          "en": "speak slowly",
          "ko": "천천히 말하다"
        },
        "gloss": {
          "en": "Can you speak slowly, please?",
          "ko": "천천히 말해 주실래요?"
        }
      },
      {
        "text": "Can you help me, please?",
        "slot": "help me",
        "cue": {
          "en": "help me",
          "ko": "나를 돕다"
        },
        "gloss": {
          "en": "Can you help me, please?",
          "ko": "좀 도와주실래요?"
        }
      },
      {
        "text": "Can you take a photo, please?",
        "slot": "take a photo",
        "cue": {
          "en": "take a photo",
          "ko": "사진을 찍다"
        },
        "gloss": {
          "en": "Can you take a photo, please?",
          "ko": "사진 좀 찍어 주실래요?"
        }
      }
    ]
  },
  {
    "id": "en-f1-14",
    "stage": 1,
    "fn": "routine",
    "pattern": "I get up at ___.",
    "core": [
      "get up at",
      "gets up at"
    ],
    "meaning": {
      "en": "Saying when you get up: I get up at ___.",
      "ko": "일어나는 시간 말하기: 저는 ___에 일어나요."
    },
    "grammar": [
      1,
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "I get up at six.",
        "slot": "six",
        "cue": {
          "en": "six",
          "ko": "여섯 시"
        },
        "gloss": {
          "en": "I get up at six.",
          "ko": "저는 여섯 시에 일어나요."
        }
      },
      {
        "text": "I get up at seven thirty.",
        "slot": "seven thirty",
        "cue": {
          "en": "seven thirty",
          "ko": "일곱 시 반"
        },
        "gloss": {
          "en": "I get up at seven thirty.",
          "ko": "저는 일곱 시 반에 일어나요."
        }
      },
      {
        "text": "My dad gets up at five.",
        "slot": "five",
        "cue": {
          "en": "five (he/she gets)",
          "ko": "다섯 시(he/she는 gets)"
        },
        "gloss": {
          "en": "My dad gets up at five.",
          "ko": "우리 아빠는 다섯 시에 일어나요."
        }
      },
      {
        "text": "On Sundays, I get up at ten.",
        "slot": "ten",
        "cue": {
          "en": "ten",
          "ko": "열 시"
        },
        "gloss": {
          "en": "On Sundays, I get up at ten.",
          "ko": "일요일에는 열 시에 일어나요."
        }
      }
    ]
  },
  {
    "id": "en-f1-15",
    "stage": 1,
    "fn": "ask-have",
    "pattern": "Do you have ___?",
    "core": [
      "Do you have",
      "do you have"
    ],
    "meaning": {
      "en": "Asking if they have something: Do you have ___?",
      "ko": "있는지 묻기: ___ 있어요?"
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Do you have a pen?",
        "slot": "a pen",
        "cue": {
          "en": "a pen",
          "ko": "펜"
        },
        "gloss": {
          "en": "Do you have a pen?",
          "ko": "펜 있어요?"
        }
      },
      {
        "text": "Do you have postcards?",
        "slot": "postcards",
        "cue": {
          "en": "postcards",
          "ko": "엽서"
        },
        "gloss": {
          "en": "Do you have postcards?",
          "ko": "엽서 있어요?"
        }
      },
      {
        "text": "Do you have this in blue?",
        "slot": "this in blue",
        "cue": {
          "en": "this in blue",
          "ko": "이거 파란색"
        },
        "gloss": {
          "en": "Do you have this in blue?",
          "ko": "이거 파란색 있어요?"
        }
      },
      {
        "text": "Excuse me, do you have water?",
        "slot": "water",
        "cue": {
          "en": "water",
          "ko": "물"
        },
        "gloss": {
          "en": "Excuse me, do you have water?",
          "ko": "저기요, 물 있어요?"
        }
      }
    ]
  },
  {
    "id": "en-f1-16",
    "stage": 1,
    "fn": "greet",
    "pattern": "See you ___.",
    "core": [
      "See you",
      "see you"
    ],
    "meaning": {
      "en": "Saying goodbye: See you ___.",
      "ko": "헤어질 때 인사: ___ 봐요."
    },
    "grammar": [
      5
    ],
    "expressions": [
      "see you later"
    ],
    "examples": [
      {
        "text": "See you later!",
        "slot": "later",
        "cue": {
          "en": "later",
          "ko": "나중에"
        },
        "gloss": {
          "en": "See you later!",
          "ko": "나중에 봐요!"
        }
      },
      {
        "text": "See you on Monday.",
        "slot": "on Monday",
        "cue": {
          "en": "on Monday",
          "ko": "월요일에"
        },
        "gloss": {
          "en": "See you on Monday.",
          "ko": "월요일에 봐요."
        }
      },
      {
        "text": "See you at the station.",
        "slot": "at the station",
        "cue": {
          "en": "at the station",
          "ko": "역에서"
        },
        "gloss": {
          "en": "See you at the station.",
          "ko": "역에서 봐요."
        }
      },
      {
        "text": "Bye, see you tomorrow.",
        "slot": "tomorrow",
        "cue": {
          "en": "tomorrow",
          "ko": "내일"
        },
        "gloss": {
          "en": "Bye, see you tomorrow.",
          "ko": "안녕, 내일 봐요."
        }
      }
    ]
  },
  {
    "id": "en-f1-17",
    "stage": 1,
    "fn": "want",
    "pattern": "I'd like ___, please.",
    "core": [
      "I'd like"
    ],
    "meaning": {
      "en": "Saying what you want politely: I'd like ___, please.",
      "ko": "원하는 것 공손하게 말하기: ___ 주세요."
    },
    "grammar": [
      2,
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "I'd like a coffee, please.",
        "slot": "a coffee",
        "cue": {
          "en": "a coffee",
          "ko": "커피 한 잔"
        },
        "gloss": {
          "en": "I'd like a coffee, please.",
          "ko": "커피 한 잔 주세요."
        }
      },
      {
        "text": "I'd like three apples, please.",
        "slot": "three apples",
        "cue": {
          "en": "three apples (plural -s)",
          "ko": "사과 세 개(복수 -s)"
        },
        "gloss": {
          "en": "I'd like three apples, please.",
          "ko": "사과 세 개 주세요."
        }
      },
      {
        "text": "I'd like the blue mug, please.",
        "slot": "the blue mug",
        "cue": {
          "en": "the blue mug",
          "ko": "그 파란 머그잔"
        },
        "gloss": {
          "en": "I'd like the blue mug, please.",
          "ko": "그 파란 머그잔 주세요."
        }
      },
      {
        "text": "I'd like two tickets, please.",
        "slot": "two tickets",
        "cue": {
          "en": "two tickets",
          "ko": "표 두 장"
        },
        "gloss": {
          "en": "I'd like two tickets, please.",
          "ko": "표 두 장 주세요."
        }
      }
    ]
  },
  {
    "id": "en-f1-18",
    "stage": 1,
    "fn": "have",
    "pattern": "I have ___.",
    "core": [
      "I have"
    ],
    "meaning": {
      "en": "Saying what you have: I have ___.",
      "ko": "가진 것 말하기: 저는 ___ 있어요."
    },
    "grammar": [
      1,
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "I have two brothers.",
        "slot": "two brothers",
        "cue": {
          "en": "two brothers",
          "ko": "남자 형제 둘"
        },
        "gloss": {
          "en": "I have two brothers.",
          "ko": "저는 남자 형제가 둘 있어요."
        }
      },
      {
        "text": "I have a cat.",
        "slot": "a cat",
        "cue": {
          "en": "a cat",
          "ko": "고양이 한 마리"
        },
        "gloss": {
          "en": "I have a cat.",
          "ko": "저는 고양이가 한 마리 있어요."
        }
      },
      {
        "text": "I have a class at nine.",
        "slot": "a class",
        "cue": {
          "en": "a class",
          "ko": "수업"
        },
        "gloss": {
          "en": "I have a class at nine.",
          "ko": "아홉 시에 수업이 있어요."
        }
      },
      {
        "text": "I have three kids.",
        "slot": "three kids",
        "cue": {
          "en": "three kids",
          "ko": "아이 셋"
        },
        "gloss": {
          "en": "I have three kids.",
          "ko": "저는 아이가 셋이에요."
        }
      }
    ]
  },
  {
    "id": "en-f1-19",
    "stage": 1,
    "fn": "time-when",
    "pattern": "What time is ___?",
    "core": [
      "What time is",
      "what time is"
    ],
    "meaning": {
      "en": "Asking the time: What time is ___?",
      "ko": "시간 묻기: ___ 몇 시예요?"
    },
    "grammar": [
      0
    ],
    "expressions": [
      "what time is it"
    ],
    "examples": [
      {
        "text": "What time is it?",
        "slot": "it",
        "cue": {
          "en": "it (now)",
          "ko": "지금"
        },
        "gloss": {
          "en": "What time is it?",
          "ko": "지금 몇 시예요?"
        }
      },
      {
        "text": "What time is the class?",
        "slot": "the class",
        "cue": {
          "en": "the class",
          "ko": "수업"
        },
        "gloss": {
          "en": "What time is the class?",
          "ko": "수업은 몇 시예요?"
        }
      },
      {
        "text": "What time is the next bus?",
        "slot": "the next bus",
        "cue": {
          "en": "the next bus",
          "ko": "다음 버스"
        },
        "gloss": {
          "en": "What time is the next bus?",
          "ko": "다음 버스는 몇 시예요?"
        }
      },
      {
        "text": "What time is lunch?",
        "slot": "lunch",
        "cue": {
          "en": "lunch",
          "ko": "점심"
        },
        "gloss": {
          "en": "What time is lunch?",
          "ko": "점심은 몇 시예요?"
        }
      }
    ]
  },
  {
    "id": "en-f2-01",
    "stage": 2,
    "fn": "past-did",
    "pattern": "Last night I ___.",
    "core": [
      "Last night",
      "last night"
    ],
    "meaning": {
      "en": "Saying what you did: Last night I ___.",
      "ko": "한 일 말하기: 어젯밤에 ___했어요."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "last night"
    ],
    "examples": [
      {
        "text": "Last night I watched a movie.",
        "slot": "watched a movie",
        "cue": {
          "en": "watched a movie (watch → watched)",
          "ko": "영화를 봤다(watch → watched)"
        },
        "gloss": {
          "en": "Last night I watched a movie.",
          "ko": "어젯밤에 영화를 봤어요."
        }
      },
      {
        "text": "Last night I went to bed early.",
        "slot": "went to bed early",
        "cue": {
          "en": "went to bed early (go → went)",
          "ko": "일찍 잤다(go → went)"
        },
        "gloss": {
          "en": "Last night I went to bed early.",
          "ko": "어젯밤엔 일찍 잤어요."
        }
      },
      {
        "text": "Last night I cooked pasta for my friends.",
        "slot": "cooked pasta",
        "cue": {
          "en": "cooked pasta",
          "ko": "파스타를 만들었다"
        },
        "gloss": {
          "en": "Last night I cooked pasta for my friends.",
          "ko": "어젯밤에 친구들한테 파스타를 해 줬어요."
        }
      },
      {
        "text": "I didn't sleep well last night.",
        "slot": "didn't sleep well",
        "cue": {
          "en": "didn't sleep well",
          "ko": "잘 못 잤다"
        },
        "gloss": {
          "en": "I didn't sleep well last night.",
          "ko": "어젯밤에 잠을 잘 못 잤어요."
        }
      }
    ]
  },
  {
    "id": "en-f2-02",
    "stage": 2,
    "fn": "ask-opinion-simple",
    "pattern": "How was your ___?",
    "core": [
      "How was your",
      "how was your"
    ],
    "meaning": {
      "en": "Asking how something was: How was your ___?",
      "ko": "어땠는지 묻기: ___ 어땠어요?"
    },
    "grammar": [
      0,
      5
    ],
    "expressions": [
      "how was your weekend"
    ],
    "examples": [
      {
        "text": "How was your weekend?",
        "slot": "weekend",
        "cue": {
          "en": "weekend",
          "ko": "주말"
        },
        "gloss": {
          "en": "How was your weekend?",
          "ko": "주말 어땠어요?"
        }
      },
      {
        "text": "How was your trip?",
        "slot": "trip",
        "cue": {
          "en": "trip",
          "ko": "여행"
        },
        "gloss": {
          "en": "How was your trip?",
          "ko": "여행 어땠어요?"
        }
      },
      {
        "text": "So, how was your first day?",
        "slot": "first day",
        "cue": {
          "en": "first day",
          "ko": "첫날"
        },
        "gloss": {
          "en": "So, how was your first day?",
          "ko": "그래서 첫날 어땠어요?"
        }
      },
      {
        "text": "How was your interview?",
        "slot": "interview",
        "cue": {
          "en": "interview",
          "ko": "면접"
        },
        "gloss": {
          "en": "How was your interview?",
          "ko": "면접 어땠어요?"
        }
      }
    ]
  },
  {
    "id": "en-f2-03",
    "stage": 2,
    "fn": "ask-opinion-simple",
    "pattern": "It was ___.",
    "core": [
      "It was",
      "it was"
    ],
    "meaning": {
      "en": "Saying how something was: It was ___.",
      "ko": "어땠는지 말하기: ___였어요."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "it was fun",
      "not bad at all"
    ],
    "examples": [
      {
        "text": "It was fun.",
        "slot": "fun",
        "cue": {
          "en": "fun",
          "ko": "재미있는"
        },
        "gloss": {
          "en": "It was fun.",
          "ko": "재미있었어요."
        }
      },
      {
        "text": "It was really delicious.",
        "slot": "really delicious",
        "cue": {
          "en": "really delicious",
          "ko": "정말 맛있는"
        },
        "gloss": {
          "en": "It was really delicious.",
          "ko": "정말 맛있었어요."
        }
      },
      {
        "text": "It was boring, to be honest.",
        "slot": "boring",
        "cue": {
          "en": "boring",
          "ko": "지루한"
        },
        "gloss": {
          "en": "It was boring, to be honest.",
          "ko": "솔직히 지루했어요."
        }
      },
      {
        "text": "It was not bad at all.",
        "slot": "not bad at all",
        "cue": {
          "en": "not bad at all",
          "ko": "전혀 나쁘지 않은"
        },
        "gloss": {
          "en": "It was not bad at all.",
          "ko": "전혀 나쁘지 않았어요."
        }
      }
    ]
  },
  {
    "id": "en-f2-04",
    "stage": 2,
    "fn": "ongoing",
    "pattern": "I'm ___ right now.",
    "core": [
      "right now"
    ],
    "meaning": {
      "en": "Saying what's happening now: I'm ___ right now.",
      "ko": "지금 하는 일 말하기: 지금 ___하고 있어요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "I'm cooking dinner right now.",
        "slot": "cooking dinner",
        "cue": {
          "en": "cooking dinner",
          "ko": "저녁을 하는 중"
        },
        "gloss": {
          "en": "I'm cooking dinner right now.",
          "ko": "지금 저녁 하고 있어요."
        }
      },
      {
        "text": "I'm driving right now.",
        "slot": "driving",
        "cue": {
          "en": "driving",
          "ko": "운전 중"
        },
        "gloss": {
          "en": "I'm driving right now.",
          "ko": "지금 운전 중이에요."
        }
      },
      {
        "text": "She's taking a shower right now.",
        "slot": "taking a shower",
        "cue": {
          "en": "taking a shower",
          "ko": "샤워하는 중"
        },
        "gloss": {
          "en": "She's taking a shower right now.",
          "ko": "그녀는 지금 샤워하고 있어요."
        }
      },
      {
        "text": "We're watching the game right now.",
        "slot": "watching the game",
        "cue": {
          "en": "watching the game",
          "ko": "경기를 보는 중"
        },
        "gloss": {
          "en": "We're watching the game right now.",
          "ko": "우리 지금 경기 보고 있어요."
        }
      }
    ]
  },
  {
    "id": "en-f2-05",
    "stage": 2,
    "fn": "future-plan",
    "pattern": "I'm going to ___.",
    "core": [
      "going to"
    ],
    "meaning": {
      "en": "Saying your plan: I'm going to ___.",
      "ko": "계획 말하기: ___할 거예요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "I'm going to visit my parents.",
        "slot": "visit my parents",
        "cue": {
          "en": "visit my parents",
          "ko": "부모님을 뵈러 가다"
        },
        "gloss": {
          "en": "I'm going to visit my parents.",
          "ko": "부모님 뵈러 갈 거예요."
        }
      },
      {
        "text": "We're going to try the new pizza place.",
        "slot": "try the new pizza place",
        "cue": {
          "en": "try the new pizza place",
          "ko": "새 피자집에 가 보다"
        },
        "gloss": {
          "en": "We're going to try the new pizza place.",
          "ko": "새로 생긴 피자집에 가 볼 거예요."
        }
      },
      {
        "text": "I'm going to buy a warm jacket.",
        "slot": "buy a warm jacket",
        "cue": {
          "en": "buy a warm jacket",
          "ko": "따뜻한 재킷을 사다"
        },
        "gloss": {
          "en": "I'm going to buy a warm jacket.",
          "ko": "따뜻한 재킷을 살 거예요."
        }
      },
      {
        "text": "It's going to rain tomorrow.",
        "slot": "rain tomorrow",
        "cue": {
          "en": "rain tomorrow",
          "ko": "내일 비가 오다"
        },
        "gloss": {
          "en": "It's going to rain tomorrow.",
          "ko": "내일 비가 올 거예요."
        }
      }
    ]
  },
  {
    "id": "en-f2-06",
    "stage": 2,
    "fn": "future-plan",
    "pattern": "I'm meeting ___ on Friday.",
    "core": [
      "I'm meeting"
    ],
    "meaning": {
      "en": "Saying a fixed plan: I'm meeting ___ (present continuous for plans).",
      "ko": "정해진 약속 말하기: ___를 만나기로 했어요(현재진행형으로 계획)."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "I'm meeting Jake on Friday.",
        "slot": "Jake",
        "cue": {
          "en": "Jake",
          "ko": "제이크"
        },
        "gloss": {
          "en": "I'm meeting Jake on Friday.",
          "ko": "금요일에 제이크를 만나요."
        }
      },
      {
        "text": "I'm meeting my sister for lunch.",
        "slot": "my sister",
        "cue": {
          "en": "my sister",
          "ko": "언니·누나·여동생"
        },
        "gloss": {
          "en": "I'm meeting my sister for lunch.",
          "ko": "언니랑 점심 먹기로 했어요."
        }
      },
      {
        "text": "I'm meeting a client at ten.",
        "slot": "a client",
        "cue": {
          "en": "a client",
          "ko": "고객"
        },
        "gloss": {
          "en": "I'm meeting a client at ten.",
          "ko": "열 시에 고객을 만나요."
        }
      },
      {
        "text": "Sorry, I'm meeting some friends tonight.",
        "slot": "some friends",
        "cue": {
          "en": "some friends",
          "ko": "친구들"
        },
        "gloss": {
          "en": "Sorry, I'm meeting some friends tonight.",
          "ko": "미안, 오늘 밤에 친구들 만나기로 했어."
        }
      }
    ]
  },
  {
    "id": "en-f2-07",
    "stage": 2,
    "fn": "invite",
    "pattern": "Are you free on ___?",
    "core": [
      "Are you free on",
      "are you free on"
    ],
    "meaning": {
      "en": "Asking if someone is free: Are you free on ___?",
      "ko": "시간 되는지 묻기: ___에 시간 있어요?"
    },
    "grammar": [],
    "expressions": [
      "are you free on"
    ],
    "examples": [
      {
        "text": "Are you free on Saturday?",
        "slot": "Saturday",
        "cue": {
          "en": "Saturday",
          "ko": "토요일"
        },
        "gloss": {
          "en": "Are you free on Saturday?",
          "ko": "토요일에 시간 있어?"
        }
      },
      {
        "text": "Are you free on Friday night?",
        "slot": "Friday night",
        "cue": {
          "en": "Friday night",
          "ko": "금요일 밤"
        },
        "gloss": {
          "en": "Are you free on Friday night?",
          "ko": "금요일 밤에 시간 돼?"
        }
      },
      {
        "text": "Hey, are you free on the weekend?",
        "slot": "the weekend",
        "cue": {
          "en": "the weekend",
          "ko": "주말"
        },
        "gloss": {
          "en": "Hey, are you free on the weekend?",
          "ko": "저기, 주말에 시간 있어?"
        }
      },
      {
        "text": "Are you free on Sunday afternoon?",
        "slot": "Sunday afternoon",
        "cue": {
          "en": "Sunday afternoon",
          "ko": "일요일 오후"
        },
        "gloss": {
          "en": "Are you free on Sunday afternoon?",
          "ko": "일요일 오후에 시간 돼요?"
        }
      }
    ]
  },
  {
    "id": "en-f2-08",
    "stage": 2,
    "fn": "suggest-time",
    "pattern": "Let's meet at ___.",
    "core": [
      "Let's meet at",
      "let's meet at"
    ],
    "meaning": {
      "en": "Suggesting a time or place: Let's meet at ___.",
      "ko": "시간·장소 정하기: ___에 만나요."
    },
    "grammar": [],
    "expressions": [
      "let's meet at"
    ],
    "examples": [
      {
        "text": "Let's meet at six.",
        "slot": "six",
        "cue": {
          "en": "six",
          "ko": "여섯 시"
        },
        "gloss": {
          "en": "Let's meet at six.",
          "ko": "여섯 시에 만나자."
        }
      },
      {
        "text": "Let's meet at the station.",
        "slot": "the station",
        "cue": {
          "en": "the station",
          "ko": "역"
        },
        "gloss": {
          "en": "Let's meet at the station.",
          "ko": "역에서 만나자."
        }
      },
      {
        "text": "Let's meet at the cafe near your office.",
        "slot": "the cafe near your office",
        "cue": {
          "en": "the cafe near your office",
          "ko": "네 회사 근처 카페"
        },
        "gloss": {
          "en": "Let's meet at the cafe near your office.",
          "ko": "네 회사 근처 카페에서 만나자."
        }
      },
      {
        "text": "Okay, let's meet at noon.",
        "slot": "noon",
        "cue": {
          "en": "noon",
          "ko": "정오"
        },
        "gloss": {
          "en": "Okay, let's meet at noon.",
          "ko": "좋아, 열두 시에 만나자."
        }
      }
    ]
  },
  {
    "id": "en-f2-09",
    "stage": 2,
    "fn": "compare",
    "pattern": "It's ___ than the other one.",
    "core": [
      "than"
    ],
    "meaning": {
      "en": "Comparing two things: It's ___ than the other one.",
      "ko": "둘 비교하기: 다른 것보다 더 ___해요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "It's cheaper than the other one.",
        "slot": "cheaper",
        "cue": {
          "en": "cheaper",
          "ko": "더 싼"
        },
        "gloss": {
          "en": "It's cheaper than the other one.",
          "ko": "다른 것보다 더 싸요."
        }
      },
      {
        "text": "This jacket is warmer than the blue one.",
        "slot": "warmer",
        "cue": {
          "en": "warmer",
          "ko": "더 따뜻한"
        },
        "gloss": {
          "en": "This jacket is warmer than the blue one.",
          "ko": "이 재킷이 파란 것보다 더 따뜻해요."
        }
      },
      {
        "text": "The bus is slower than the train.",
        "slot": "slower",
        "cue": {
          "en": "slower",
          "ko": "더 느린"
        },
        "gloss": {
          "en": "The bus is slower than the train.",
          "ko": "버스가 기차보다 느려요."
        }
      },
      {
        "text": "This one is more comfortable than the other one.",
        "slot": "more comfortable",
        "cue": {
          "en": "more comfortable (long word: more)",
          "ko": "더 편한(긴 단어는 more)"
        },
        "gloss": {
          "en": "This one is more comfortable than the other one.",
          "ko": "이게 다른 것보다 더 편해요."
        }
      }
    ]
  },
  {
    "id": "en-f2-10",
    "stage": 2,
    "fn": "compare",
    "pattern": "Which one is ___?",
    "core": [
      "Which one is",
      "which one is"
    ],
    "meaning": {
      "en": "Asking which is better or best: Which one is ___?",
      "ko": "어느 쪽인지 묻기: 어느 게 더 ___해요?"
    },
    "grammar": [
      3
    ],
    "expressions": [
      "which one is better"
    ],
    "examples": [
      {
        "text": "Which one is better?",
        "slot": "better",
        "cue": {
          "en": "better",
          "ko": "더 좋은"
        },
        "gloss": {
          "en": "Which one is better?",
          "ko": "어느 게 더 나아요?"
        }
      },
      {
        "text": "Which one is cheaper?",
        "slot": "cheaper",
        "cue": {
          "en": "cheaper",
          "ko": "더 싼"
        },
        "gloss": {
          "en": "Which one is cheaper?",
          "ko": "어느 게 더 싸요?"
        }
      },
      {
        "text": "Which one is the most popular?",
        "slot": "the most popular",
        "cue": {
          "en": "the most popular",
          "ko": "가장 인기 있는"
        },
        "gloss": {
          "en": "Which one is the most popular?",
          "ko": "어느 게 제일 인기 있어요?"
        }
      },
      {
        "text": "Which one is the fastest?",
        "slot": "the fastest",
        "cue": {
          "en": "the fastest",
          "ko": "가장 빠른"
        },
        "gloss": {
          "en": "Which one is the fastest?",
          "ko": "어느 게 제일 빨라요?"
        }
      }
    ]
  },
  {
    "id": "en-f2-11",
    "stage": 2,
    "fn": "order",
    "pattern": "Can I get ___?",
    "core": [
      "Can I get",
      "can I get"
    ],
    "meaning": {
      "en": "Ordering food or drinks: Can I get ___?",
      "ko": "주문하기: ___ 주실래요?"
    },
    "grammar": [],
    "expressions": [
      "with oat milk"
    ],
    "examples": [
      {
        "text": "Can I get a latte with oat milk?",
        "slot": "a latte",
        "cue": {
          "en": "a latte",
          "ko": "라테"
        },
        "gloss": {
          "en": "Can I get a latte with oat milk?",
          "ko": "귀리 우유로 라테 한 잔 주실래요?"
        }
      },
      {
        "text": "Can I get a small coffee, please?",
        "slot": "a small coffee",
        "cue": {
          "en": "a small coffee",
          "ko": "작은 커피"
        },
        "gloss": {
          "en": "Can I get a small coffee, please?",
          "ko": "작은 사이즈 커피 한 잔 주세요."
        }
      },
      {
        "text": "Can I get the chicken salad?",
        "slot": "the chicken salad",
        "cue": {
          "en": "the chicken salad",
          "ko": "치킨 샐러드"
        },
        "gloss": {
          "en": "Can I get the chicken salad?",
          "ko": "치킨 샐러드 주실래요?"
        }
      },
      {
        "text": "Can I get some water too?",
        "slot": "some water",
        "cue": {
          "en": "some water",
          "ko": "물 좀"
        },
        "gloss": {
          "en": "Can I get some water too?",
          "ko": "물도 좀 주실래요?"
        }
      }
    ]
  },
  {
    "id": "en-f2-12",
    "stage": 2,
    "fn": "reason",
    "pattern": "I stayed home because ___.",
    "core": [
      "because"
    ],
    "meaning": {
      "en": "Giving a reason: ___ because ___.",
      "ko": "이유 말하기: ___ 때문에 ___했어요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "I stayed home because I was tired.",
        "slot": "I was tired",
        "cue": {
          "en": "I was tired",
          "ko": "피곤했다"
        },
        "gloss": {
          "en": "I stayed home because I was tired.",
          "ko": "피곤해서 집에 있었어요."
        }
      },
      {
        "text": "I was late because the bus didn't come.",
        "slot": "the bus didn't come",
        "cue": {
          "en": "the bus didn't come",
          "ko": "버스가 안 왔다"
        },
        "gloss": {
          "en": "I was late because the bus didn't come.",
          "ko": "버스가 안 와서 늦었어요."
        }
      },
      {
        "text": "I like this place because it's quiet.",
        "slot": "it's quiet",
        "cue": {
          "en": "it's quiet",
          "ko": "조용하다"
        },
        "gloss": {
          "en": "I like this place because it's quiet.",
          "ko": "조용해서 이곳이 좋아요."
        }
      },
      {
        "text": "We left early because it was raining.",
        "slot": "it was raining",
        "cue": {
          "en": "it was raining",
          "ko": "비가 오고 있었다"
        },
        "gloss": {
          "en": "We left early because it was raining.",
          "ko": "비가 와서 일찍 나왔어요."
        }
      }
    ]
  },
  {
    "id": "en-f2-13",
    "stage": 2,
    "fn": "reason",
    "pattern": "It was raining, so ___.",
    "core": [
      ", so"
    ],
    "meaning": {
      "en": "Saying the result: ___, so ___.",
      "ko": "결과 말하기: ___해서 ___했어요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "It was raining, so we stayed home.",
        "slot": "we stayed home",
        "cue": {
          "en": "we stayed home",
          "ko": "우리는 집에 있었다"
        },
        "gloss": {
          "en": "It was raining, so we stayed home.",
          "ko": "비가 와서 집에 있었어요."
        }
      },
      {
        "text": "The shop was closed, so we went home.",
        "slot": "we went home",
        "cue": {
          "en": "we went home",
          "ko": "우리는 집에 갔다"
        },
        "gloss": {
          "en": "The shop was closed, so we went home.",
          "ko": "가게가 닫혀서 집에 갔어요."
        }
      },
      {
        "text": "I was hungry, so I ordered pizza.",
        "slot": "I ordered pizza",
        "cue": {
          "en": "I ordered pizza",
          "ko": "피자를 시켰다"
        },
        "gloss": {
          "en": "I was hungry, so I ordered pizza.",
          "ko": "배고파서 피자를 시켰어요."
        }
      },
      {
        "text": "My phone died, so I couldn't call you.",
        "slot": "I couldn't call you",
        "cue": {
          "en": "I couldn't call you",
          "ko": "전화를 못 했다"
        },
        "gloss": {
          "en": "My phone died, so I couldn't call you.",
          "ko": "휴대폰이 꺼져서 전화를 못 했어요."
        }
      }
    ]
  },
  {
    "id": "en-f2-14",
    "stage": 2,
    "fn": "frequency",
    "pattern": "I ___ have breakfast.",
    "core": [
      "have breakfast",
      "has breakfast"
    ],
    "meaning": {
      "en": "Saying how often: I ___ have breakfast (always / usually / never before the verb).",
      "ko": "얼마나 자주 하는지: 저는 ___ 아침을 먹어요(빈도 부사는 동사 앞)."
    },
    "grammar": [
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "I never have breakfast.",
        "slot": "never",
        "cue": {
          "en": "never",
          "ko": "절대 안"
        },
        "gloss": {
          "en": "I never have breakfast.",
          "ko": "저는 아침을 절대 안 먹어요."
        }
      },
      {
        "text": "I usually have breakfast at home.",
        "slot": "usually",
        "cue": {
          "en": "usually",
          "ko": "보통"
        },
        "gloss": {
          "en": "I usually have breakfast at home.",
          "ko": "저는 보통 집에서 아침을 먹어요."
        }
      },
      {
        "text": "He hardly ever has breakfast.",
        "slot": "hardly ever",
        "cue": {
          "en": "hardly ever",
          "ko": "거의 안"
        },
        "gloss": {
          "en": "He hardly ever has breakfast.",
          "ko": "그는 아침을 거의 안 먹어요."
        }
      },
      {
        "text": "We always have breakfast together on Sundays.",
        "slot": "always",
        "cue": {
          "en": "always",
          "ko": "항상"
        },
        "gloss": {
          "en": "We always have breakfast together on Sundays.",
          "ko": "일요일엔 항상 같이 아침을 먹어요."
        }
      }
    ]
  },
  {
    "id": "en-f2-15",
    "stage": 2,
    "fn": "ask-have",
    "pattern": "Do you have any ___?",
    "core": [
      "any"
    ],
    "meaning": {
      "en": "Asking if there are any: Do you have any ___?",
      "ko": "있는지 묻기: 혹시 ___ 있어요?"
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Do you have any cookies?",
        "slot": "cookies",
        "cue": {
          "en": "cookies",
          "ko": "쿠키"
        },
        "gloss": {
          "en": "Do you have any cookies?",
          "ko": "쿠키 있어요?"
        }
      },
      {
        "text": "Do you have any rooms for tonight?",
        "slot": "rooms",
        "cue": {
          "en": "rooms",
          "ko": "방"
        },
        "gloss": {
          "en": "Do you have any rooms for tonight?",
          "ko": "오늘 밤 묵을 방 있어요?"
        }
      },
      {
        "text": "Are there any seats left?",
        "slot": "seats",
        "cue": {
          "en": "seats",
          "ko": "자리"
        },
        "gloss": {
          "en": "Are there any seats left?",
          "ko": "남은 자리 있어요?"
        }
      },
      {
        "text": "Do you have any questions?",
        "slot": "questions",
        "cue": {
          "en": "questions",
          "ko": "질문"
        },
        "gloss": {
          "en": "Do you have any questions?",
          "ko": "질문 있으세요?"
        }
      }
    ]
  },
  {
    "id": "en-f2-16",
    "stage": 2,
    "fn": "count",
    "pattern": "We don't have much ___.",
    "core": [
      "much",
      "many"
    ],
    "meaning": {
      "en": "Talking about amounts: much (can't count) / many (can count).",
      "ko": "양 말하기: much(셀 수 없는 것) / many(셀 수 있는 것)."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "We don't have much time.",
        "slot": "time",
        "cue": {
          "en": "time",
          "ko": "시간"
        },
        "gloss": {
          "en": "We don't have much time.",
          "ko": "우리 시간이 별로 없어요."
        }
      },
      {
        "text": "I don't have much money this month.",
        "slot": "money",
        "cue": {
          "en": "money",
          "ko": "돈"
        },
        "gloss": {
          "en": "I don't have much money this month.",
          "ko": "이번 달엔 돈이 별로 없어요."
        }
      },
      {
        "text": "There aren't many people here.",
        "slot": "people",
        "cue": {
          "en": "people",
          "ko": "사람"
        },
        "gloss": {
          "en": "There aren't many people here.",
          "ko": "여기 사람이 별로 없네요."
        }
      },
      {
        "text": "How many tickets do we need?",
        "slot": "tickets",
        "cue": {
          "en": "tickets",
          "ko": "표"
        },
        "gloss": {
          "en": "How many tickets do we need?",
          "ko": "표가 몇 장 필요해요?"
        }
      }
    ]
  },
  {
    "id": "en-f2-17",
    "stage": 2,
    "fn": "possession",
    "pattern": "Is this ___?",
    "core": [
      "Is this",
      "is this"
    ],
    "meaning": {
      "en": "Asking whose something is: Is this ___?",
      "ko": "누구 것인지 묻기: 이거 ___예요?"
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Is this yours?",
        "slot": "yours",
        "cue": {
          "en": "yours",
          "ko": "네 것"
        },
        "gloss": {
          "en": "Is this yours?",
          "ko": "이거 네 거야?"
        }
      },
      {
        "text": "Is this your bag?",
        "slot": "your bag",
        "cue": {
          "en": "your bag",
          "ko": "네 가방"
        },
        "gloss": {
          "en": "Is this your bag?",
          "ko": "이거 네 가방이야?"
        }
      },
      {
        "text": "Is this her phone?",
        "slot": "her phone",
        "cue": {
          "en": "her phone",
          "ko": "그녀의 휴대폰"
        },
        "gloss": {
          "en": "Is this her phone?",
          "ko": "이거 그 여자 휴대폰이에요?"
        }
      },
      {
        "text": "Excuse me, is this your umbrella?",
        "slot": "your umbrella",
        "cue": {
          "en": "your umbrella",
          "ko": "당신 우산"
        },
        "gloss": {
          "en": "Excuse me, is this your umbrella?",
          "ko": "저기요, 이거 당신 우산이에요?"
        }
      }
    ]
  },
  {
    "id": "en-f2-18",
    "stage": 2,
    "fn": "duration",
    "pattern": "How long does it take to ___?",
    "core": [
      "How long does it take",
      "how long does it take"
    ],
    "meaning": {
      "en": "Asking how long: How long does it take to ___?",
      "ko": "걸리는 시간 묻기: ___하는 데 얼마나 걸려요?"
    },
    "grammar": [],
    "expressions": [
      "how long does it take"
    ],
    "examples": [
      {
        "text": "How long does it take to get there?",
        "slot": "get there",
        "cue": {
          "en": "get there",
          "ko": "거기 가다"
        },
        "gloss": {
          "en": "How long does it take to get there?",
          "ko": "거기까지 얼마나 걸려요?"
        }
      },
      {
        "text": "How long does it take to get to the airport?",
        "slot": "get to the airport",
        "cue": {
          "en": "get to the airport",
          "ko": "공항에 가다"
        },
        "gloss": {
          "en": "How long does it take to get to the airport?",
          "ko": "공항까지 얼마나 걸려요?"
        }
      },
      {
        "text": "How long does it take to walk to the station?",
        "slot": "walk to the station",
        "cue": {
          "en": "walk to the station",
          "ko": "역까지 걷다"
        },
        "gloss": {
          "en": "How long does it take to walk to the station?",
          "ko": "역까지 걸어서 얼마나 걸려요?"
        }
      },
      {
        "text": "How long does it take to fix it?",
        "slot": "fix it",
        "cue": {
          "en": "fix it",
          "ko": "그걸 고치다"
        },
        "gloss": {
          "en": "How long does it take to fix it?",
          "ko": "고치는 데 얼마나 걸려요?"
        }
      }
    ]
  },
  {
    "id": "en-f2-19",
    "stage": 2,
    "fn": "decline",
    "pattern": "Maybe next time. I'm ___.",
    "core": [
      "Maybe next time",
      "maybe next time"
    ],
    "meaning": {
      "en": "Declining politely: Maybe next time. I'm ___.",
      "ko": "정중히 거절하기: 다음에 하자. 나 ___해."
    },
    "grammar": [
      2
    ],
    "expressions": [
      "maybe next time"
    ],
    "examples": [
      {
        "text": "Maybe next time. I'm working that day.",
        "slot": "working that day",
        "cue": {
          "en": "working that day",
          "ko": "그날 일하다"
        },
        "gloss": {
          "en": "Maybe next time. I'm working that day.",
          "ko": "다음에 하자. 그날 일해."
        }
      },
      {
        "text": "Sorry, maybe next time. I'm visiting my grandma.",
        "slot": "visiting my grandma",
        "cue": {
          "en": "visiting my grandma",
          "ko": "할머니 댁에 가다"
        },
        "gloss": {
          "en": "Sorry, maybe next time. I'm visiting my grandma.",
          "ko": "미안, 다음에. 할머니 댁에 가기로 했어."
        }
      },
      {
        "text": "Maybe next time. I'm really busy this week.",
        "slot": "really busy this week",
        "cue": {
          "en": "really busy this week",
          "ko": "이번 주에 정말 바쁘다"
        },
        "gloss": {
          "en": "Maybe next time. I'm really busy this week.",
          "ko": "다음에 하자. 이번 주에 정말 바빠."
        }
      },
      {
        "text": "Maybe next time. I'm going to a wedding.",
        "slot": "going to a wedding",
        "cue": {
          "en": "going to a wedding",
          "ko": "결혼식에 가다"
        },
        "gloss": {
          "en": "Maybe next time. I'm going to a wedding.",
          "ko": "다음에 하자. 결혼식에 가."
        }
      }
    ]
  },
  {
    "id": "en-f3-01",
    "stage": 3,
    "fn": "experience",
    "pattern": "Have you ever ___?",
    "core": [
      "Have you ever",
      "have you ever"
    ],
    "meaning": {
      "en": "Asking about experience: Have you ever ___?",
      "ko": "경험 묻기: ___ 해 본 적 있어요?"
    },
    "grammar": [
      0
    ],
    "expressions": [
      "have you ever been"
    ],
    "examples": [
      {
        "text": "Have you ever been to Lisbon?",
        "slot": "been to Lisbon",
        "cue": {
          "en": "been to Lisbon",
          "ko": "리스본에 가 본"
        },
        "gloss": {
          "en": "Have you ever been to Lisbon?",
          "ko": "리스본에 가 본 적 있어?"
        }
      },
      {
        "text": "Have you ever tried Ethiopian food?",
        "slot": "tried Ethiopian food",
        "cue": {
          "en": "tried Ethiopian food",
          "ko": "에티오피아 음식을 먹어 본"
        },
        "gloss": {
          "en": "Have you ever tried Ethiopian food?",
          "ko": "에티오피아 음식 먹어 본 적 있어?"
        }
      },
      {
        "text": "Have you ever lost your passport?",
        "slot": "lost your passport",
        "cue": {
          "en": "lost your passport",
          "ko": "여권을 잃어버린"
        },
        "gloss": {
          "en": "Have you ever lost your passport?",
          "ko": "여권 잃어버린 적 있어?"
        }
      },
      {
        "text": "Have you ever met someone famous?",
        "slot": "met someone famous",
        "cue": {
          "en": "met someone famous",
          "ko": "유명인을 만난"
        },
        "gloss": {
          "en": "Have you ever met someone famous?",
          "ko": "유명한 사람 만나 본 적 있어?"
        }
      }
    ]
  },
  {
    "id": "en-f3-02",
    "stage": 3,
    "fn": "experience",
    "pattern": "I've never ___.",
    "core": [
      "I've never",
      "I have never"
    ],
    "meaning": {
      "en": "Saying you have never done something: I've never ___.",
      "ko": "해 본 적 없다고 말하기: ___ 해 본 적 없어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "I've never been to Japan.",
        "slot": "been to Japan",
        "cue": {
          "en": "been to Japan",
          "ko": "일본에 가 본"
        },
        "gloss": {
          "en": "I've never been to Japan.",
          "ko": "일본에 가 본 적 없어요."
        }
      },
      {
        "text": "I've never tried surfing.",
        "slot": "tried surfing",
        "cue": {
          "en": "tried surfing",
          "ko": "서핑을 해 본"
        },
        "gloss": {
          "en": "I've never tried surfing.",
          "ko": "서핑은 해 본 적 없어요."
        }
      },
      {
        "text": "I've never seen snow.",
        "slot": "seen snow",
        "cue": {
          "en": "seen snow",
          "ko": "눈을 본"
        },
        "gloss": {
          "en": "I've never seen snow.",
          "ko": "눈을 본 적이 없어요."
        }
      },
      {
        "text": "Honestly, I've never cooked a turkey.",
        "slot": "cooked a turkey",
        "cue": {
          "en": "cooked a turkey",
          "ko": "칠면조를 요리해 본"
        },
        "gloss": {
          "en": "Honestly, I've never cooked a turkey.",
          "ko": "솔직히 칠면조는 요리해 본 적 없어요."
        }
      }
    ]
  },
  {
    "id": "en-f3-03",
    "stage": 3,
    "fn": "while-when",
    "pattern": "We were ___ when it happened.",
    "core": [
      "when it happened",
      "when"
    ],
    "meaning": {
      "en": "Setting the scene: We were ___ when it happened (past continuous + when).",
      "ko": "배경 말하기: ___하고 있을 때 일이 생겼어요(과거진행 + when)."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "We were waiting at the gate when it happened.",
        "slot": "waiting at the gate",
        "cue": {
          "en": "waiting at the gate",
          "ko": "탑승구에서 기다리던"
        },
        "gloss": {
          "en": "We were waiting at the gate when it happened.",
          "ko": "탑승구에서 기다리고 있을 때 그 일이 생겼어."
        }
      },
      {
        "text": "I was driving home when it happened.",
        "slot": "driving home",
        "cue": {
          "en": "driving home",
          "ko": "집에 운전해 가던"
        },
        "gloss": {
          "en": "I was driving home when it happened.",
          "ko": "집에 운전해서 가는 중에 그 일이 생겼어."
        }
      },
      {
        "text": "She was cooking dinner when the lights went out.",
        "slot": "cooking dinner",
        "cue": {
          "en": "cooking dinner",
          "ko": "저녁을 하던"
        },
        "gloss": {
          "en": "She was cooking dinner when the lights went out.",
          "ko": "그녀가 저녁을 하고 있을 때 불이 나갔어."
        }
      },
      {
        "text": "They were sleeping when the alarm went off.",
        "slot": "sleeping",
        "cue": {
          "en": "sleeping",
          "ko": "자던"
        },
        "gloss": {
          "en": "They were sleeping when the alarm went off.",
          "ko": "그들이 자고 있을 때 알람이 울렸어."
        }
      }
    ]
  },
  {
    "id": "en-f3-04",
    "stage": 3,
    "fn": "condition",
    "pattern": "If it ___, I'll call you back.",
    "core": [
      "I'll call you back",
      "If it",
      "if it"
    ],
    "meaning": {
      "en": "Saying what you'll do if something happens: If it ___, I'll ___.",
      "ko": "조건 말하기: 만약 ___하면 다시 전화할게요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "If it doesn't arrive tomorrow, I'll call you back.",
        "slot": "doesn't arrive tomorrow",
        "cue": {
          "en": "doesn't arrive tomorrow",
          "ko": "내일 안 오다"
        },
        "gloss": {
          "en": "If it doesn't arrive tomorrow, I'll call you back.",
          "ko": "내일 안 오면 다시 전화할게요."
        }
      },
      {
        "text": "If it gets worse, I'll call you back.",
        "slot": "gets worse",
        "cue": {
          "en": "gets worse",
          "ko": "더 나빠지다"
        },
        "gloss": {
          "en": "If it gets worse, I'll call you back.",
          "ko": "더 나빠지면 다시 전화할게요."
        }
      },
      {
        "text": "If it isn't fixed by Friday, I'll call you back.",
        "slot": "isn't fixed by Friday",
        "cue": {
          "en": "isn't fixed by Friday",
          "ko": "금요일까지 안 고쳐지다"
        },
        "gloss": {
          "en": "If it isn't fixed by Friday, I'll call you back.",
          "ko": "금요일까지 안 고쳐지면 다시 전화할게요."
        }
      },
      {
        "text": "If it rains, we'll stay home.",
        "slot": "rains",
        "cue": {
          "en": "rains",
          "ko": "비가 오다"
        },
        "gloss": {
          "en": "If it rains, we'll stay home.",
          "ko": "비가 오면 집에 있을 거야."
        }
      }
    ]
  },
  {
    "id": "en-f3-05",
    "stage": 3,
    "fn": "advice-give",
    "pattern": "You should ___.",
    "core": [
      "You should",
      "you should"
    ],
    "meaning": {
      "en": "Giving advice: You should ___.",
      "ko": "조언하기: ___하는 게 좋겠어요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "You should get some rest.",
        "slot": "get some rest",
        "cue": {
          "en": "get some rest",
          "ko": "좀 쉬다"
        },
        "gloss": {
          "en": "You should get some rest.",
          "ko": "좀 쉬는 게 좋겠어."
        }
      },
      {
        "text": "You should talk to your boss.",
        "slot": "talk to your boss",
        "cue": {
          "en": "talk to your boss",
          "ko": "상사와 이야기하다"
        },
        "gloss": {
          "en": "You should talk to your boss.",
          "ko": "상사랑 얘기해 보는 게 좋겠어."
        }
      },
      {
        "text": "Maybe you should take a break.",
        "slot": "take a break",
        "cue": {
          "en": "take a break",
          "ko": "잠깐 쉬다"
        },
        "gloss": {
          "en": "Maybe you should take a break.",
          "ko": "잠깐 쉬는 게 좋을 것 같아."
        }
      },
      {
        "text": "You shouldn't work so late.",
        "slot": "work so late",
        "cue": {
          "en": "work so late (shouldn't)",
          "ko": "그렇게 늦게까지 일하다(shouldn't)"
        },
        "gloss": {
          "en": "You shouldn't work so late.",
          "ko": "그렇게 늦게까지 일하지 않는 게 좋아."
        }
      }
    ]
  },
  {
    "id": "en-f3-06",
    "stage": 3,
    "fn": "must",
    "pattern": "I have to ___.",
    "core": [
      "have to",
      "has to",
      "had to"
    ],
    "meaning": {
      "en": "Saying what you have to do: I have to ___.",
      "ko": "해야 하는 일 말하기: ___해야 해요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "I have to finish this report.",
        "slot": "finish this report",
        "cue": {
          "en": "finish this report",
          "ko": "이 보고서를 끝내다"
        },
        "gloss": {
          "en": "I have to finish this report.",
          "ko": "이 보고서 끝내야 해요."
        }
      },
      {
        "text": "Do I have to stay home?",
        "slot": "stay home",
        "cue": {
          "en": "stay home",
          "ko": "집에 있다"
        },
        "gloss": {
          "en": "Do I have to stay home?",
          "ko": "집에 있어야 하나요?"
        }
      },
      {
        "text": "You have to ask IT first.",
        "slot": "ask IT first",
        "cue": {
          "en": "ask IT first",
          "ko": "먼저 IT 팀에 묻다"
        },
        "gloss": {
          "en": "You have to ask IT first.",
          "ko": "먼저 IT 팀에 물어봐야 해요."
        }
      },
      {
        "text": "She has to work this weekend.",
        "slot": "work this weekend",
        "cue": {
          "en": "work this weekend (she has to)",
          "ko": "이번 주말에 일하다(she has to)"
        },
        "gloss": {
          "en": "She has to work this weekend.",
          "ko": "그녀는 이번 주말에 일해야 해요."
        }
      }
    ]
  },
  {
    "id": "en-f3-07",
    "stage": 3,
    "fn": "plan-intent",
    "pattern": "I decided to ___.",
    "core": [
      "decided to"
    ],
    "meaning": {
      "en": "Saying what you decided: I decided to ___.",
      "ko": "결정한 것 말하기: ___하기로 했어요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "I decided to quit my job.",
        "slot": "quit my job",
        "cue": {
          "en": "quit my job",
          "ko": "일을 그만두다"
        },
        "gloss": {
          "en": "I decided to quit my job.",
          "ko": "일을 그만두기로 했어요."
        }
      },
      {
        "text": "We decided to take the train.",
        "slot": "take the train",
        "cue": {
          "en": "take the train",
          "ko": "기차를 타다"
        },
        "gloss": {
          "en": "We decided to take the train.",
          "ko": "기차를 타기로 했어요."
        }
      },
      {
        "text": "I decided to learn Spanish.",
        "slot": "learn Spanish",
        "cue": {
          "en": "learn Spanish",
          "ko": "스페인어를 배우다"
        },
        "gloss": {
          "en": "I decided to learn Spanish.",
          "ko": "스페인어를 배우기로 했어요."
        }
      },
      {
        "text": "He decided to move to Seattle.",
        "slot": "move to Seattle",
        "cue": {
          "en": "move to Seattle",
          "ko": "시애틀로 이사하다"
        },
        "gloss": {
          "en": "He decided to move to Seattle.",
          "ko": "그는 시애틀로 이사하기로 했어요."
        }
      }
    ]
  },
  {
    "id": "en-f3-08",
    "stage": 3,
    "fn": "try-doing",
    "pattern": "It's worth trying ___.",
    "core": [
      "worth trying"
    ],
    "meaning": {
      "en": "Recommending something: It's worth trying ___.",
      "ko": "권하기: ___ 한번 해 볼 만해요."
    },
    "grammar": [
      4
    ],
    "expressions": [
      "it's worth trying"
    ],
    "examples": [
      {
        "text": "It's worth trying the soup.",
        "slot": "the soup",
        "cue": {
          "en": "the soup",
          "ko": "그 수프"
        },
        "gloss": {
          "en": "It's worth trying the soup.",
          "ko": "그 수프 한번 먹어 볼 만해요."
        }
      },
      {
        "text": "It's worth trying once.",
        "slot": "once",
        "cue": {
          "en": "once",
          "ko": "한 번"
        },
        "gloss": {
          "en": "It's worth trying once.",
          "ko": "한 번쯤 해 볼 만해요."
        }
      },
      {
        "text": "It's worth trying a different route.",
        "slot": "a different route",
        "cue": {
          "en": "a different route",
          "ko": "다른 길"
        },
        "gloss": {
          "en": "It's worth trying a different route.",
          "ko": "다른 길로 가 볼 만해요."
        }
      },
      {
        "text": "It's worth trying the new app.",
        "slot": "the new app",
        "cue": {
          "en": "the new app",
          "ko": "새 앱"
        },
        "gloss": {
          "en": "It's worth trying the new app.",
          "ko": "새 앱 한번 써 볼 만해요."
        }
      }
    ]
  },
  {
    "id": "en-f3-09",
    "stage": 3,
    "fn": "describe-person",
    "pattern": "That's the person who ___.",
    "core": [
      "who",
      "where"
    ],
    "meaning": {
      "en": "Describing with who / where: That's the person who ___.",
      "ko": "설명 붙이기: ___하는 사람이에요(who / where)."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "That's the guy who sits by the window.",
        "slot": "sits by the window",
        "cue": {
          "en": "sits by the window",
          "ko": "창가에 앉는"
        },
        "gloss": {
          "en": "That's the guy who sits by the window.",
          "ko": "창가에 앉는 저 사람이에요."
        }
      },
      {
        "text": "She's the person who helped me.",
        "slot": "helped me",
        "cue": {
          "en": "helped me",
          "ko": "나를 도와준"
        },
        "gloss": {
          "en": "She's the person who helped me.",
          "ko": "그분이 저를 도와준 사람이에요."
        }
      },
      {
        "text": "That's the restaurant where I had my birthday dinner.",
        "slot": "I had my birthday dinner",
        "cue": {
          "en": "I had my birthday dinner",
          "ko": "생일 저녁을 먹은"
        },
        "gloss": {
          "en": "That's the restaurant where I had my birthday dinner.",
          "ko": "거기가 제가 생일 저녁을 먹은 식당이에요."
        }
      },
      {
        "text": "That's the woman who runs the cafe.",
        "slot": "runs the cafe",
        "cue": {
          "en": "runs the cafe",
          "ko": "카페를 운영하는"
        },
        "gloss": {
          "en": "That's the woman who runs the cafe.",
          "ko": "저분이 카페를 운영하는 분이에요."
        }
      }
    ]
  },
  {
    "id": "en-f3-10",
    "stage": 3,
    "fn": "complain",
    "pattern": "My ___ was sent to the wrong address.",
    "core": [
      "was sent to"
    ],
    "meaning": {
      "en": "Reporting a problem with the passive: My ___ was sent to ___.",
      "ko": "수동태로 문제 알리기: 제 ___이 ___로 보내졌어요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "My package was sent to the wrong address.",
        "slot": "package",
        "cue": {
          "en": "package",
          "ko": "택배"
        },
        "gloss": {
          "en": "My package was sent to the wrong address.",
          "ko": "제 택배가 엉뚱한 주소로 갔어요."
        }
      },
      {
        "text": "My order was sent to the wrong address.",
        "slot": "order",
        "cue": {
          "en": "order",
          "ko": "주문품"
        },
        "gloss": {
          "en": "My order was sent to the wrong address.",
          "ko": "제 주문품이 다른 주소로 배송됐어요."
        }
      },
      {
        "text": "My suitcase was sent to Madrid by mistake.",
        "slot": "suitcase",
        "cue": {
          "en": "suitcase",
          "ko": "여행 가방"
        },
        "gloss": {
          "en": "My suitcase was sent to Madrid by mistake.",
          "ko": "제 여행 가방이 실수로 마드리드로 보내졌어요."
        }
      },
      {
        "text": "The invoice was sent to my old email.",
        "slot": "invoice",
        "cue": {
          "en": "invoice",
          "ko": "청구서"
        },
        "gloss": {
          "en": "The invoice was sent to my old email.",
          "ko": "청구서가 제 예전 이메일로 갔어요."
        }
      }
    ]
  },
  {
    "id": "en-f3-11",
    "stage": 3,
    "fn": "story-past",
    "pattern": "It was so ___ that I couldn't sleep.",
    "core": [
      "so",
      "such a"
    ],
    "meaning": {
      "en": "Saying a result: so + adjective / such a + noun … that ___.",
      "ko": "결과 말하기: 너무 ___해서 ~했어요(so / such a … that)."
    },
    "grammar": [
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "It was so hot that I couldn't sleep.",
        "slot": "hot",
        "cue": {
          "en": "hot",
          "ko": "더운"
        },
        "gloss": {
          "en": "It was so hot that I couldn't sleep.",
          "ko": "너무 더워서 잠을 못 잤어요."
        }
      },
      {
        "text": "It was so noisy that I couldn't hear anything.",
        "slot": "noisy",
        "cue": {
          "en": "noisy",
          "ko": "시끄러운"
        },
        "gloss": {
          "en": "It was so noisy that I couldn't hear anything.",
          "ko": "너무 시끄러워서 아무것도 안 들렸어요."
        }
      },
      {
        "text": "It was such a long meeting that I nearly fell asleep.",
        "slot": "long meeting",
        "cue": {
          "en": "long meeting (such a + noun)",
          "ko": "긴 회의(such a + 명사)"
        },
        "gloss": {
          "en": "It was such a long meeting that I nearly fell asleep.",
          "ko": "회의가 너무 길어서 거의 잠들 뻔했어요."
        }
      },
      {
        "text": "The movie was so boring that we left early.",
        "slot": "boring",
        "cue": {
          "en": "boring",
          "ko": "지루한"
        },
        "gloss": {
          "en": "The movie was so boring that we left early.",
          "ko": "영화가 너무 지루해서 일찍 나왔어요."
        }
      }
    ]
  },
  {
    "id": "en-f3-12",
    "stage": 3,
    "fn": "feel",
    "pattern": "I felt really ___.",
    "core": [
      "felt really",
      "felt so"
    ],
    "meaning": {
      "en": "Saying how you felt (-ed for feelings, -ing for things).",
      "ko": "기분 말하기: 정말 ___했어요(사람 기분은 -ed, 원인은 -ing)."
    },
    "grammar": [
      8
    ],
    "expressions": [],
    "examples": [
      {
        "text": "I felt really confused.",
        "slot": "confused",
        "cue": {
          "en": "confused (not confusing)",
          "ko": "헷갈린(confusing 아님)"
        },
        "gloss": {
          "en": "I felt really confused.",
          "ko": "정말 헷갈렸어요."
        }
      },
      {
        "text": "I felt really embarrassed.",
        "slot": "embarrassed",
        "cue": {
          "en": "embarrassed",
          "ko": "창피한"
        },
        "gloss": {
          "en": "I felt really embarrassed.",
          "ko": "정말 창피했어요."
        }
      },
      {
        "text": "I felt so relieved when it arrived.",
        "slot": "relieved",
        "cue": {
          "en": "relieved",
          "ko": "안심한"
        },
        "gloss": {
          "en": "I felt so relieved when it arrived.",
          "ko": "그게 도착했을 때 정말 안심했어요."
        }
      },
      {
        "text": "After the trip, I felt really exhausted.",
        "slot": "exhausted",
        "cue": {
          "en": "exhausted",
          "ko": "녹초가 된"
        },
        "gloss": {
          "en": "After the trip, I felt really exhausted.",
          "ko": "여행 끝나고 정말 녹초가 됐어요."
        }
      }
    ]
  },
  {
    "id": "en-f3-13",
    "stage": 3,
    "fn": "request-action",
    "pattern": "Could you ___ and get back to me?",
    "core": [
      "get back to me"
    ],
    "meaning": {
      "en": "Asking someone to check and reply: Could you ___ and get back to me?",
      "ko": "확인 후 답 달라고 하기: ___하고 저한테 다시 알려 주실래요?"
    },
    "grammar": [
      9
    ],
    "expressions": [
      "get back to me"
    ],
    "examples": [
      {
        "text": "Could you look into it and get back to me?",
        "slot": "look into it",
        "cue": {
          "en": "look into it",
          "ko": "알아보다"
        },
        "gloss": {
          "en": "Could you look into it and get back to me?",
          "ko": "알아보고 다시 연락 주실래요?"
        }
      },
      {
        "text": "Could you check with your manager and get back to me?",
        "slot": "check with your manager",
        "cue": {
          "en": "check with your manager",
          "ko": "매니저에게 확인하다"
        },
        "gloss": {
          "en": "Could you check with your manager and get back to me?",
          "ko": "매니저에게 확인하고 다시 알려 주실래요?"
        }
      },
      {
        "text": "Can you look over my notes and get back to me?",
        "slot": "look over my notes",
        "cue": {
          "en": "look over my notes",
          "ko": "내 메모를 훑어보다"
        },
        "gloss": {
          "en": "Can you look over my notes and get back to me?",
          "ko": "제 메모 좀 훑어보고 다시 알려 줄래요?"
        }
      },
      {
        "text": "Could you ask the team and get back to me?",
        "slot": "ask the team",
        "cue": {
          "en": "ask the team",
          "ko": "팀에 물어보다"
        },
        "gloss": {
          "en": "Could you ask the team and get back to me?",
          "ko": "팀에 물어보고 다시 알려 주실래요?"
        }
      }
    ]
  },
  {
    "id": "en-f3-14",
    "stage": 3,
    "fn": "hearsay",
    "pattern": "He told me ___.",
    "core": [
      "told me",
      "was told"
    ],
    "meaning": {
      "en": "Passing on what someone said: He told me ___.",
      "ko": "들은 말 전하기: 그가 ___라고 했어요."
    },
    "grammar": [
      10
    ],
    "expressions": [],
    "examples": [
      {
        "text": "He told me the order would arrive on Tuesday.",
        "slot": "the order would arrive on Tuesday",
        "cue": {
          "en": "the order would arrive on Tuesday (will → would)",
          "ko": "주문품이 화요일에 온다(will → would)"
        },
        "gloss": {
          "en": "He told me the order would arrive on Tuesday.",
          "ko": "그가 주문품이 화요일에 온다고 했어요."
        }
      },
      {
        "text": "She told me she was moving to London.",
        "slot": "she was moving to London",
        "cue": {
          "en": "she was moving to London",
          "ko": "그녀가 런던으로 이사 간다"
        },
        "gloss": {
          "en": "She told me she was moving to London.",
          "ko": "그녀가 런던으로 이사 간다고 했어요."
        }
      },
      {
        "text": "The pharmacist told me it was just a cold.",
        "slot": "it was just a cold",
        "cue": {
          "en": "it was just a cold",
          "ko": "그냥 감기다"
        },
        "gloss": {
          "en": "The pharmacist told me it was just a cold.",
          "ko": "약사가 그냥 감기라고 했어요."
        }
      },
      {
        "text": "I was told the package was on its way.",
        "slot": "the package was on its way",
        "cue": {
          "en": "the package was on its way",
          "ko": "택배가 오는 중이다"
        },
        "gloss": {
          "en": "I was told the package was on its way.",
          "ko": "택배가 오고 있다고 들었어요."
        }
      }
    ]
  },
  {
    "id": "en-f3-15",
    "stage": 3,
    "fn": "hearsay",
    "pattern": "They said it would ___.",
    "core": [
      "said it would",
      "said"
    ],
    "meaning": {
      "en": "Reporting a promise or prediction: They said it would ___.",
      "ko": "들은 약속·예측 전하기: ___할 거라고 했어요."
    },
    "grammar": [
      10
    ],
    "expressions": [],
    "examples": [
      {
        "text": "They said it would be ready by noon.",
        "slot": "be ready by noon",
        "cue": {
          "en": "be ready by noon",
          "ko": "정오까지 준비되다"
        },
        "gloss": {
          "en": "They said it would be ready by noon.",
          "ko": "정오까지 준비된다고 했어요."
        }
      },
      {
        "text": "The website said it would arrive in three days.",
        "slot": "arrive in three days",
        "cue": {
          "en": "arrive in three days",
          "ko": "사흘 뒤 도착하다"
        },
        "gloss": {
          "en": "The website said it would arrive in three days.",
          "ko": "웹사이트에선 사흘 뒤에 도착한다고 했어요."
        }
      },
      {
        "text": "He said it would only take a minute.",
        "slot": "only take a minute",
        "cue": {
          "en": "only take a minute",
          "ko": "잠깐이면 되다"
        },
        "gloss": {
          "en": "He said it would only take a minute.",
          "ko": "그가 잠깐이면 된다고 했어요."
        }
      },
      {
        "text": "My boss said it would be fine.",
        "slot": "be fine",
        "cue": {
          "en": "be fine",
          "ko": "괜찮다"
        },
        "gloss": {
          "en": "My boss said it would be fine.",
          "ko": "상사가 괜찮을 거라고 했어요."
        }
      }
    ]
  },
  {
    "id": "en-f3-16",
    "stage": 3,
    "fn": "end-conversation",
    "pattern": "Let me know if ___.",
    "core": [
      "Let me know",
      "let me know"
    ],
    "meaning": {
      "en": "Offering help as you finish: Let me know if ___.",
      "ko": "대화 마무리하며 도움 제안: ___하면 알려 줘요."
    },
    "grammar": [],
    "expressions": [
      "let me know"
    ],
    "examples": [
      {
        "text": "Let me know if you need anything.",
        "slot": "you need anything",
        "cue": {
          "en": "you need anything",
          "ko": "뭐든 필요하다"
        },
        "gloss": {
          "en": "Let me know if you need anything.",
          "ko": "필요한 거 있으면 알려 줘."
        }
      },
      {
        "text": "Let me know if you have questions.",
        "slot": "you have questions",
        "cue": {
          "en": "you have questions",
          "ko": "질문이 있다"
        },
        "gloss": {
          "en": "Let me know if you have questions.",
          "ko": "궁금한 거 있으면 알려 줘."
        }
      },
      {
        "text": "Let me know if it doesn't work.",
        "slot": "it doesn't work",
        "cue": {
          "en": "it doesn't work",
          "ko": "안 되다"
        },
        "gloss": {
          "en": "Let me know if it doesn't work.",
          "ko": "안 되면 알려 줘."
        }
      },
      {
        "text": "Let me know if you can come.",
        "slot": "you can come",
        "cue": {
          "en": "you can come",
          "ko": "올 수 있다"
        },
        "gloss": {
          "en": "Let me know if you can come.",
          "ko": "올 수 있으면 알려 줘."
        }
      }
    ]
  },
  {
    "id": "en-f3-17",
    "stage": 3,
    "fn": "clarify",
    "pattern": "What do you mean by ___?",
    "core": [
      "What do you mean",
      "what do you mean"
    ],
    "meaning": {
      "en": "Checking what someone meant: What do you mean by ___?",
      "ko": "뜻 확인하기: ___라니 무슨 뜻이에요?"
    },
    "grammar": [],
    "expressions": [
      "what do you mean"
    ],
    "examples": [
      {
        "text": "What do you mean by soon?",
        "slot": "soon",
        "cue": {
          "en": "soon",
          "ko": "곧"
        },
        "gloss": {
          "en": "What do you mean by soon?",
          "ko": "곧이라는 게 무슨 뜻이에요?"
        }
      },
      {
        "text": "What do you mean by late?",
        "slot": "late",
        "cue": {
          "en": "late",
          "ko": "늦게"
        },
        "gloss": {
          "en": "What do you mean by late?",
          "ko": "늦는다는 게 무슨 말이에요?"
        }
      },
      {
        "text": "Sorry, what do you mean by a few days?",
        "slot": "a few days",
        "cue": {
          "en": "a few days",
          "ko": "며칠"
        },
        "gloss": {
          "en": "Sorry, what do you mean by a few days?",
          "ko": "죄송한데, 며칠이라는 게 어느 정도예요?"
        }
      },
      {
        "text": "What do you mean by the system?",
        "slot": "the system",
        "cue": {
          "en": "the system",
          "ko": "그 시스템"
        },
        "gloss": {
          "en": "What do you mean by the system?",
          "ko": "그 시스템이라는 게 뭘 말하는 거예요?"
        }
      }
    ]
  },
  {
    "id": "en-f3-18",
    "stage": 3,
    "fn": "opinion",
    "pattern": "To be honest, ___.",
    "core": [
      "To be honest",
      "to be honest"
    ],
    "meaning": {
      "en": "Giving an honest opinion: To be honest, ___.",
      "ko": "솔직하게 말하기: 솔직히 ___."
    },
    "grammar": [],
    "expressions": [
      "to be honest"
    ],
    "examples": [
      {
        "text": "To be honest, I didn't like it.",
        "slot": "I didn't like it",
        "cue": {
          "en": "I didn't like it",
          "ko": "마음에 안 들었다"
        },
        "gloss": {
          "en": "To be honest, I didn't like it.",
          "ko": "솔직히 별로였어."
        }
      },
      {
        "text": "To be honest, I'm a bit tired.",
        "slot": "I'm a bit tired",
        "cue": {
          "en": "I'm a bit tired",
          "ko": "좀 피곤하다"
        },
        "gloss": {
          "en": "To be honest, I'm a bit tired.",
          "ko": "솔직히 좀 피곤해."
        }
      },
      {
        "text": "To be honest, it was too expensive.",
        "slot": "it was too expensive",
        "cue": {
          "en": "it was too expensive",
          "ko": "너무 비쌌다"
        },
        "gloss": {
          "en": "To be honest, it was too expensive.",
          "ko": "솔직히 너무 비쌌어."
        }
      },
      {
        "text": "To be honest, I forgot.",
        "slot": "I forgot",
        "cue": {
          "en": "I forgot",
          "ko": "잊어버렸다"
        },
        "gloss": {
          "en": "To be honest, I forgot.",
          "ko": "솔직히 깜빡했어."
        }
      }
    ]
  },
  {
    "id": "en-f3-19",
    "stage": 3,
    "fn": "advice-give",
    "pattern": "Make sure you ___.",
    "core": [
      "Make sure",
      "make sure"
    ],
    "meaning": {
      "en": "Reminding someone: Make sure you ___.",
      "ko": "꼭 하라고 당부하기: 꼭 ___하세요."
    },
    "grammar": [],
    "expressions": [
      "make sure"
    ],
    "examples": [
      {
        "text": "Make sure you bring your ID.",
        "slot": "bring your ID",
        "cue": {
          "en": "bring your ID",
          "ko": "신분증을 가져오다"
        },
        "gloss": {
          "en": "Make sure you bring your ID.",
          "ko": "신분증 꼭 챙겨 와."
        }
      },
      {
        "text": "Make sure you save the file.",
        "slot": "save the file",
        "cue": {
          "en": "save the file",
          "ko": "파일을 저장하다"
        },
        "gloss": {
          "en": "Make sure you save the file.",
          "ko": "파일 꼭 저장해."
        }
      },
      {
        "text": "Make sure you drink lots of water.",
        "slot": "drink lots of water",
        "cue": {
          "en": "drink lots of water",
          "ko": "물을 많이 마시다"
        },
        "gloss": {
          "en": "Make sure you drink lots of water.",
          "ko": "물 꼭 많이 마셔."
        }
      },
      {
        "text": "Make sure you lock the door.",
        "slot": "lock the door",
        "cue": {
          "en": "lock the door",
          "ko": "문을 잠그다"
        },
        "gloss": {
          "en": "Make sure you lock the door.",
          "ko": "문 꼭 잠가."
        }
      }
    ]
  },
  {
    "id": "en-f3-20",
    "stage": 3,
    "fn": "story-past",
    "pattern": "It turned out ___.",
    "core": [
      "It turned out",
      "it turned out"
    ],
    "meaning": {
      "en": "Saying how things really were: It turned out ___.",
      "ko": "알고 보니: 알고 보니 ___였어요."
    },
    "grammar": [],
    "expressions": [
      "it turned out"
    ],
    "examples": [
      {
        "text": "It turned out the shop was closed.",
        "slot": "the shop was closed",
        "cue": {
          "en": "the shop was closed",
          "ko": "가게가 닫혀 있었다"
        },
        "gloss": {
          "en": "It turned out the shop was closed.",
          "ko": "알고 보니 가게가 닫혀 있었어요."
        }
      },
      {
        "text": "It turned out she was right.",
        "slot": "she was right",
        "cue": {
          "en": "she was right",
          "ko": "그녀가 맞았다"
        },
        "gloss": {
          "en": "It turned out she was right.",
          "ko": "알고 보니 그녀 말이 맞았어요."
        }
      },
      {
        "text": "It turned out to be a great day.",
        "slot": "to be a great day",
        "cue": {
          "en": "to be a great day",
          "ko": "멋진 날이 되다"
        },
        "gloss": {
          "en": "It turned out to be a great day.",
          "ko": "결국 멋진 하루가 됐어요."
        }
      },
      {
        "text": "But it turned out the flight was full.",
        "slot": "the flight was full",
        "cue": {
          "en": "the flight was full",
          "ko": "비행기가 꽉 찼다"
        },
        "gloss": {
          "en": "But it turned out the flight was full.",
          "ko": "그런데 알고 보니 비행기가 꽉 찼더라고요."
        }
      }
    ]
  },
  {
    "id": "en-f4-01",
    "stage": 4,
    "fn": "hypothetical",
    "pattern": "If I were ___, I'd do it differently.",
    "core": [
      "If I were",
      "if I were"
    ],
    "meaning": {
      "en": "Imagining another position: If I were ___, I'd …",
      "ko": "입장 바꿔 가정하기: 내가 ___라면 …할 텐데"
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "If I were the writer, I'd add one more episode.",
        "slot": "the writer",
        "cue": {
          "en": "the writer",
          "ko": "작가"
        },
        "gloss": {
          "en": "If I were the writer, I'd add one more episode.",
          "ko": "내가 작가라면 에피소드를 하나 더 넣을 거야."
        }
      },
      {
        "text": "If I were her, I'd want some space.",
        "slot": "her",
        "cue": {
          "en": "her",
          "ko": "그녀"
        },
        "gloss": {
          "en": "If I were her, I'd want some space.",
          "ko": "내가 그녀라면 좀 혼자 있고 싶을 거야."
        }
      },
      {
        "text": "Honestly, if I were your manager, I'd give you more time.",
        "slot": "your manager",
        "cue": {
          "en": "your manager",
          "ko": "네 상사"
        },
        "gloss": {
          "en": "Honestly, if I were your manager, I'd give you more time.",
          "ko": "솔직히 내가 네 상사라면 시간을 더 줄 거야."
        }
      },
      {
        "text": "If I were in your shoes, I'd take the job.",
        "slot": "in your shoes",
        "cue": {
          "en": "in your position",
          "ko": "네 입장"
        },
        "gloss": {
          "en": "If I were in your shoes, I'd take the job.",
          "ko": "내가 네 입장이라면 그 일을 맡을 거야."
        }
      }
    ]
  },
  {
    "id": "en-f4-02",
    "stage": 4,
    "fn": "hypothetical",
    "pattern": "If we'd ___, we wouldn't have missed it.",
    "core": [
      "If I'd",
      "If we'd",
      "if he'd"
    ],
    "meaning": {
      "en": "Imagining a different past: If we'd ___, …",
      "ko": "과거를 바꿔 가정하기: 우리가 ___했더라면 …"
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "If we'd left ten minutes earlier, we wouldn't have missed the start.",
        "slot": "left ten minutes earlier",
        "cue": {
          "en": "left ten minutes earlier",
          "ko": "십 분 일찍 나서다"
        },
        "gloss": {
          "en": "If we'd left ten minutes earlier, we wouldn't have missed the start.",
          "ko": "십 분만 일찍 나왔으면 시작을 놓치지 않았을 텐데."
        }
      },
      {
        "text": "If I'd known about the party, I would have come.",
        "slot": "known about the party",
        "cue": {
          "en": "known about the party",
          "ko": "파티를 알다"
        },
        "gloss": {
          "en": "If I'd known about the party, I would have come.",
          "ko": "파티 있는 걸 알았으면 갔을 텐데."
        }
      },
      {
        "text": "It's a shame, but if he'd asked for help, we could have fixed it together.",
        "slot": "asked for help",
        "cue": {
          "en": "asked for help",
          "ko": "도움을 청하다"
        },
        "gloss": {
          "en": "It's a shame, but if he'd asked for help, we could have fixed it together.",
          "ko": "아쉽지만 그가 도움을 청했으면 같이 고칠 수 있었을 거야."
        }
      },
      {
        "text": "If we'd booked in advance, we'd have got better seats.",
        "slot": "booked in advance",
        "cue": {
          "en": "booked in advance",
          "ko": "미리 예약하다"
        },
        "gloss": {
          "en": "If we'd booked in advance, we'd have got better seats.",
          "ko": "미리 예약했으면 더 좋은 자리를 잡았을 텐데."
        }
      }
    ]
  },
  {
    "id": "en-f4-03",
    "stage": 4,
    "fn": "regret-light",
    "pattern": "If I'd known, I would have ___.",
    "core": [
      "would have",
      "wouldn't have"
    ],
    "meaning": {
      "en": "Saying what would have happened: … would have ___",
      "ko": "그랬다면 어땠을지 말하기: …했을 거예요"
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "If I'd known you were in town, I would have called you.",
        "slot": "called you",
        "cue": {
          "en": "call you",
          "ko": "너에게 전화하다"
        },
        "gloss": {
          "en": "If I'd known you were in town, I would have called you.",
          "ko": "네가 이 동네에 있는 줄 알았으면 전화했을 텐데."
        }
      },
      {
        "text": "Without your help, we wouldn't have finished on time.",
        "slot": "finished on time",
        "cue": {
          "en": "finish on time",
          "ko": "제때 끝내다"
        },
        "gloss": {
          "en": "Without your help, we wouldn't have finished on time.",
          "ko": "네 도움 없었으면 제때 못 끝냈을 거야."
        }
      },
      {
        "text": "She would have replied by now if she'd seen it.",
        "slot": "replied by now",
        "cue": {
          "en": "reply by now",
          "ko": "지금쯤 답하다"
        },
        "gloss": {
          "en": "She would have replied by now if she'd seen it.",
          "ko": "봤으면 지금쯤 답했을 거야."
        }
      },
      {
        "text": "If he'd survived, the whole story wouldn't have made sense.",
        "slot": "made sense",
        "cue": {
          "en": "make sense",
          "ko": "말이 되다"
        },
        "gloss": {
          "en": "If he'd survived, the whole story wouldn't have made sense.",
          "ko": "그가 살았으면 이야기 전체가 말이 안 됐을 거야."
        }
      }
    ]
  },
  {
    "id": "en-f4-04",
    "stage": 4,
    "fn": "story-past",
    "pattern": "By the time I ___, it had already ended.",
    "core": [
      "By the time",
      "by the time"
    ],
    "meaning": {
      "en": "Saying something was already over: By the time I ___, … had already …",
      "ko": "이미 끝나 있었다고 말하기: 내가 ___했을 때는 이미 …"
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "By the time I logged in, the meeting had already ended.",
        "slot": "logged in",
        "cue": {
          "en": "log in",
          "ko": "접속하다"
        },
        "gloss": {
          "en": "By the time I logged in, the meeting had already ended.",
          "ko": "내가 접속했을 땐 회의가 이미 끝나 있었어."
        }
      },
      {
        "text": "By the time we got to the station, the last train had left.",
        "slot": "got to the station",
        "cue": {
          "en": "get to the station",
          "ko": "역에 도착하다"
        },
        "gloss": {
          "en": "By the time we got to the station, the last train had left.",
          "ko": "우리가 역에 도착했을 땐 막차가 떠나 있었어."
        }
      },
      {
        "text": "By the time I left teaching, I'd already done some freelance work.",
        "slot": "left teaching",
        "cue": {
          "en": "leave teaching",
          "ko": "교직을 떠나다"
        },
        "gloss": {
          "en": "By the time I left teaching, I'd already done some freelance work.",
          "ko": "교직을 그만둘 때쯤엔 이미 프리랜서 일을 좀 해 둔 상태였어."
        }
      },
      {
        "text": "The food was cold by the time the waiter brought it over.",
        "slot": "the waiter brought it over",
        "cue": {
          "en": "the waiter brings it over",
          "ko": "웨이터가 가져오다"
        },
        "gloss": {
          "en": "The food was cold by the time the waiter brought it over.",
          "ko": "웨이터가 가져왔을 때쯤엔 음식이 식어 있었어."
        }
      }
    ]
  },
  {
    "id": "en-f4-05",
    "stage": 4,
    "fn": "guess",
    "pattern": "She must have ___.",
    "core": [
      "must have"
    ],
    "meaning": {
      "en": "Guessing what surely happened: … must have ___",
      "ko": "틀림없다고 추측하기: …했던 게 틀림없어요"
    },
    "grammar": [
      3
    ],
    "expressions": [
      "it must have been"
    ],
    "examples": [
      {
        "text": "He must have known he wasn't going to make it.",
        "slot": "known he wasn't going to make it",
        "cue": {
          "en": "know he won't make it",
          "ko": "살아남지 못할 걸 알다"
        },
        "gloss": {
          "en": "He must have known he wasn't going to make it.",
          "ko": "그는 자기가 살아남지 못할 걸 알았던 게 틀림없어."
        }
      },
      {
        "text": "It must have been something serious, then.",
        "slot": "been something serious",
        "cue": {
          "en": "be something serious",
          "ko": "심각한 일이다"
        },
        "gloss": {
          "en": "It must have been something serious, then.",
          "ko": "그럼 뭔가 심각한 일이었던 게 틀림없네."
        }
      },
      {
        "text": "The roads are wet. It must have rained last night.",
        "slot": "rained last night",
        "cue": {
          "en": "rain last night",
          "ko": "어젯밤 비가 오다"
        },
        "gloss": {
          "en": "The roads are wet. It must have rained last night.",
          "ko": "길이 젖었어. 어젯밤에 비가 왔나 봐."
        }
      },
      {
        "text": "You must have been exhausted after that flight.",
        "slot": "been exhausted after that flight",
        "cue": {
          "en": "be exhausted after that flight",
          "ko": "그 비행 뒤 지치다"
        },
        "gloss": {
          "en": "You must have been exhausted after that flight.",
          "ko": "그 비행 끝나고 엄청 피곤했겠다."
        }
      }
    ]
  },
  {
    "id": "en-f4-06",
    "stage": 4,
    "fn": "guess",
    "pattern": "He can't have ___.",
    "core": [
      "can't have"
    ],
    "meaning": {
      "en": "Saying something surely didn't happen: … can't have ___",
      "ko": "그럴 리 없다고 추측하기: …했을 리가 없어요"
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "She can't have seen my message, or she would have replied.",
        "slot": "seen my message",
        "cue": {
          "en": "see my message",
          "ko": "내 메시지를 보다"
        },
        "gloss": {
          "en": "She can't have seen my message, or she would have replied.",
          "ko": "그녀가 내 메시지를 봤을 리 없어, 봤으면 답했을 거야."
        }
      },
      {
        "text": "You can't have finished already. You only started an hour ago!",
        "slot": "finished already",
        "cue": {
          "en": "finish already",
          "ko": "벌써 끝내다"
        },
        "gloss": {
          "en": "You can't have finished already. You only started an hour ago!",
          "ko": "벌써 끝냈을 리가 없어. 한 시간 전에 시작했잖아!"
        }
      },
      {
        "text": "He can't have forgotten our anniversary again.",
        "slot": "forgotten our anniversary again",
        "cue": {
          "en": "forget our anniversary again",
          "ko": "또 기념일을 잊다"
        },
        "gloss": {
          "en": "He can't have forgotten our anniversary again.",
          "ko": "그가 또 기념일을 잊었을 리 없어."
        }
      },
      {
        "text": "They can't have left yet. Their coats are still here.",
        "slot": "left yet",
        "cue": {
          "en": "leave yet",
          "ko": "벌써 떠나다"
        },
        "gloss": {
          "en": "They can't have left yet. Their coats are still here.",
          "ko": "그들이 벌써 갔을 리 없어. 코트가 아직 여기 있어."
        }
      }
    ]
  },
  {
    "id": "en-f4-07",
    "stage": 4,
    "fn": "guess",
    "pattern": "She might have ___.",
    "core": [
      "might have"
    ],
    "meaning": {
      "en": "Guessing what possibly happened: … might have ___",
      "ko": "그랬을지도 모른다고 추측하기: …했을지도 몰라요"
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "She might have just gotten really busy with her new job.",
        "slot": "just gotten really busy with her new job",
        "cue": {
          "en": "get busy with a new job",
          "ko": "새 일로 바빠지다"
        },
        "gloss": {
          "en": "She might have just gotten really busy with her new job.",
          "ko": "새 일 때문에 그냥 많이 바빠졌을지도 몰라."
        }
      },
      {
        "text": "I might have left my keys at the office.",
        "slot": "left my keys at the office",
        "cue": {
          "en": "leave my keys at the office",
          "ko": "사무실에 열쇠를 두고 오다"
        },
        "gloss": {
          "en": "I might have left my keys at the office.",
          "ko": "사무실에 열쇠를 두고 왔을지도 몰라."
        }
      },
      {
        "text": "They might have changed the date without telling us.",
        "slot": "changed the date without telling us",
        "cue": {
          "en": "change the date without telling us",
          "ko": "말없이 날짜를 바꾸다"
        },
        "gloss": {
          "en": "They might have changed the date without telling us.",
          "ko": "우리한테 말 안 하고 날짜를 바꿨을지도 몰라."
        }
      },
      {
        "text": "The email might have gone to your spam folder.",
        "slot": "gone to your spam folder",
        "cue": {
          "en": "go to your spam folder",
          "ko": "스팸함으로 가다"
        },
        "gloss": {
          "en": "The email might have gone to your spam folder.",
          "ko": "메일이 스팸함으로 갔을지도 몰라."
        }
      }
    ]
  },
  {
    "id": "en-f4-08",
    "stage": 4,
    "fn": "wish",
    "pattern": "I wish I'd ___.",
    "core": [
      "I wish I'd",
      "I wish I had"
    ],
    "meaning": {
      "en": "Regretting the past: I wish I'd ___",
      "ko": "지난 일 아쉬워하기: ___했더라면 좋았을 텐데"
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "I wish I'd checked on her when she first went quiet.",
        "slot": "checked on her when she first went quiet",
        "cue": {
          "en": "check on her",
          "ko": "그녀 안부를 묻다"
        },
        "gloss": {
          "en": "I wish I'd checked on her when she first went quiet.",
          "ko": "그녀가 처음 연락이 뜸해졌을 때 챙겨 볼걸."
        }
      },
      {
        "text": "I wish I'd taken more photos of the old town.",
        "slot": "taken more photos of the old town",
        "cue": {
          "en": "take more photos",
          "ko": "사진을 더 찍다"
        },
        "gloss": {
          "en": "I wish I'd taken more photos of the old town.",
          "ko": "옛 동네 사진을 더 찍어 둘걸."
        }
      },
      {
        "text": "I wish I had kept in touch with my old team.",
        "slot": "kept in touch with my old team",
        "cue": {
          "en": "keep in touch",
          "ko": "연락하고 지내다"
        },
        "gloss": {
          "en": "I wish I had kept in touch with my old team.",
          "ko": "예전 팀이랑 연락하고 지낼걸."
        }
      },
      {
        "text": "Sometimes I wish I had studied something more practical.",
        "slot": "studied something more practical",
        "cue": {
          "en": "study something practical",
          "ko": "실용적인 걸 공부하다"
        },
        "gloss": {
          "en": "Sometimes I wish I had studied something more practical.",
          "ko": "가끔은 좀 더 실용적인 걸 공부할걸 싶어."
        }
      }
    ]
  },
  {
    "id": "en-f4-09",
    "stage": 4,
    "fn": "regret-light",
    "pattern": "I should have ___.",
    "core": [
      "should have",
      "shouldn't have"
    ],
    "meaning": {
      "en": "Saying what you should(n't) have done: I should have ___",
      "ko": "했어야 했다고 말하기: ___했어야 했는데"
    },
    "grammar": [
      4
    ],
    "expressions": [
      "should have known"
    ],
    "examples": [
      {
        "text": "I should have known to double-check.",
        "slot": "known to double-check",
        "cue": {
          "en": "know to double-check",
          "ko": "다시 확인해야 하는 걸 알다"
        },
        "gloss": {
          "en": "I should have known to double-check.",
          "ko": "다시 확인해야 한다는 걸 알았어야 했는데."
        }
      },
      {
        "text": "In hindsight, I should have brought up the heating sooner.",
        "slot": "brought up the heating sooner",
        "cue": {
          "en": "bring up the heating sooner",
          "ko": "난방 얘기를 더 일찍 꺼내다"
        },
        "gloss": {
          "en": "In hindsight, I should have brought up the heating sooner.",
          "ko": "돌이켜 보면 난방 얘기를 더 일찍 꺼냈어야 했어."
        }
      },
      {
        "text": "We shouldn't have trusted the first quote we got.",
        "slot": "trusted the first quote we got",
        "cue": {
          "en": "trust the first quote",
          "ko": "처음 받은 견적을 믿다"
        },
        "gloss": {
          "en": "We shouldn't have trusted the first quote we got.",
          "ko": "처음 받은 견적을 믿지 말았어야 했어."
        }
      },
      {
        "text": "You should have told me you were feeling unwell.",
        "slot": "told me you were feeling unwell",
        "cue": {
          "en": "tell me you feel unwell",
          "ko": "몸이 안 좋다고 말하다"
        },
        "gloss": {
          "en": "You should have told me you were feeling unwell.",
          "ko": "몸이 안 좋다고 말했어야지."
        }
      }
    ]
  },
  {
    "id": "en-f4-10",
    "stage": 4,
    "fn": "habit-past",
    "pattern": "There used to be ___ here.",
    "core": [
      "There used to be",
      "there used to be"
    ],
    "meaning": {
      "en": "Saying what was there before: There used to be ___",
      "ko": "예전에 있던 것 말하기: 예전엔 ___가 있었어요"
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "There used to be a little cinema downtown.",
        "slot": "a little cinema downtown",
        "cue": {
          "en": "a small cinema downtown",
          "ko": "시내의 작은 영화관"
        },
        "gloss": {
          "en": "There used to be a little cinema downtown.",
          "ko": "예전엔 시내에 작은 영화관이 있었어."
        }
      },
      {
        "text": "There used to be a bakery on this corner.",
        "slot": "a bakery on this corner",
        "cue": {
          "en": "a bakery on this corner",
          "ko": "이 모퉁이의 빵집"
        },
        "gloss": {
          "en": "There used to be a bakery on this corner.",
          "ko": "예전엔 이 모퉁이에 빵집이 있었어."
        }
      },
      {
        "text": "I'm sure there used to be a bus stop right here.",
        "slot": "a bus stop right here",
        "cue": {
          "en": "a bus stop right here",
          "ko": "바로 여기 버스 정류장"
        },
        "gloss": {
          "en": "I'm sure there used to be a bus stop right here.",
          "ko": "분명 바로 여기에 버스 정류장이 있었는데."
        }
      },
      {
        "text": "There used to be fields all around the village.",
        "slot": "fields all around the village",
        "cue": {
          "en": "fields around the village",
          "ko": "마을 둘레의 들판"
        },
        "gloss": {
          "en": "There used to be fields all around the village.",
          "ko": "예전엔 마을 둘레가 다 들판이었어."
        }
      }
    ]
  },
  {
    "id": "en-f4-11",
    "stage": 4,
    "fn": "habit-past",
    "pattern": "I used to ___.",
    "core": [
      "I used to",
      "We used to"
    ],
    "meaning": {
      "en": "Saying what you did before: I used to ___",
      "ko": "예전에 하던 일 말하기: 예전엔 ___했어요"
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Before that, I used to be a teacher.",
        "slot": "be a teacher",
        "cue": {
          "en": "be a teacher",
          "ko": "교사이다"
        },
        "gloss": {
          "en": "Before that, I used to be a teacher.",
          "ko": "그전에는 교사였어."
        }
      },
      {
        "text": "We used to have three weeks for testing.",
        "slot": "have three weeks for testing",
        "cue": {
          "en": "have three weeks for testing",
          "ko": "테스트에 삼 주를 두다"
        },
        "gloss": {
          "en": "We used to have three weeks for testing.",
          "ko": "예전엔 테스트에 삼 주가 있었어."
        }
      },
      {
        "text": "I used to play the piano when I was a kid.",
        "slot": "play the piano when I was a kid",
        "cue": {
          "en": "play the piano as a kid",
          "ko": "어릴 때 피아노를 치다"
        },
        "gloss": {
          "en": "I used to play the piano when I was a kid.",
          "ko": "어릴 때 피아노를 쳤었어."
        }
      },
      {
        "text": "We used to spend every summer at my grandparents' place.",
        "slot": "spend every summer at my grandparents' place",
        "cue": {
          "en": "spend summers at grandparents' place",
          "ko": "조부모님 댁에서 여름을 보내다"
        },
        "gloss": {
          "en": "We used to spend every summer at my grandparents' place.",
          "ko": "예전엔 여름마다 조부모님 댁에서 지냈어."
        }
      }
    ]
  },
  {
    "id": "en-f4-12",
    "stage": 4,
    "fn": "changed",
    "pattern": "I'm still not used to ___.",
    "core": [
      "not used to"
    ],
    "meaning": {
      "en": "Saying something still feels new: I'm still not used to ___",
      "ko": "아직 익숙하지 않다고 말하기: 아직 ___에 익숙하지 않아요"
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "But I'm still not used to all the traffic.",
        "slot": "all the traffic",
        "cue": {
          "en": "all the traffic",
          "ko": "이 많은 차들"
        },
        "gloss": {
          "en": "But I'm still not used to all the traffic.",
          "ko": "그래도 이 많은 차들엔 아직 적응이 안 돼."
        }
      },
      {
        "text": "I'm still not used to working from home.",
        "slot": "working from home",
        "cue": {
          "en": "work from home",
          "ko": "재택근무하다"
        },
        "gloss": {
          "en": "I'm still not used to working from home.",
          "ko": "아직 재택근무가 익숙하지 않아."
        }
      },
      {
        "text": "She's not used to getting up so early.",
        "slot": "getting up so early",
        "cue": {
          "en": "get up so early",
          "ko": "이렇게 일찍 일어나다"
        },
        "gloss": {
          "en": "She's not used to getting up so early.",
          "ko": "그녀는 이렇게 일찍 일어나는 데 익숙하지 않아."
        }
      },
      {
        "text": "We're not used to such cold winters.",
        "slot": "such cold winters",
        "cue": {
          "en": "such cold winters",
          "ko": "이렇게 추운 겨울"
        },
        "gloss": {
          "en": "We're not used to such cold winters.",
          "ko": "우리는 이렇게 추운 겨울에 익숙하지 않아."
        }
      }
    ]
  },
  {
    "id": "en-f4-13",
    "stage": 4,
    "fn": "opinion",
    "pattern": "Anyway, the point is ___.",
    "core": [
      "the point is"
    ],
    "meaning": {
      "en": "Getting back to the main point: Anyway, the point is ___",
      "ko": "요점으로 돌아가기: 아무튼 중요한 건 ___예요"
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Anyway, the point is she knows we care.",
        "slot": "she knows we care",
        "cue": {
          "en": "she knows we care",
          "ko": "우리가 신경 쓴다는 걸 그녀가 알다"
        },
        "gloss": {
          "en": "Anyway, the point is she knows we care.",
          "ko": "아무튼 중요한 건 우리가 신경 쓴다는 걸 그녀가 안다는 거야."
        }
      },
      {
        "text": "Anyway, the point is that we need more time.",
        "slot": "that we need more time",
        "cue": {
          "en": "we need more time",
          "ko": "시간이 더 필요하다"
        },
        "gloss": {
          "en": "Anyway, the point is that we need more time.",
          "ko": "아무튼 요점은 시간이 더 필요하다는 거야."
        }
      },
      {
        "text": "I know it's expensive, but the point is it lasts for years.",
        "slot": "it lasts for years",
        "cue": {
          "en": "it lasts for years",
          "ko": "몇 년을 가다"
        },
        "gloss": {
          "en": "I know it's expensive, but the point is it lasts for years.",
          "ko": "비싼 건 알지만 중요한 건 몇 년을 쓴다는 거야."
        }
      },
      {
        "text": "Look, the point is nobody asked the customers.",
        "slot": "nobody asked the customers",
        "cue": {
          "en": "nobody asks the customers",
          "ko": "아무도 고객에게 묻지 않다"
        },
        "gloss": {
          "en": "Look, the point is nobody asked the customers.",
          "ko": "있잖아, 요점은 아무도 고객에게 묻지 않았다는 거야."
        }
      }
    ]
  },
  {
    "id": "en-f4-14",
    "stage": 4,
    "fn": "concede",
    "pattern": "That's a good point, but ___.",
    "core": [
      "That's a good point",
      "that's a good point"
    ],
    "meaning": {
      "en": "Accepting a point before adding yours: That's a good point, but ___",
      "ko": "일부 인정하고 내 말 하기: 좋은 지적이지만 ___"
    },
    "grammar": [
      6
    ],
    "expressions": [
      "that's a good point"
    ],
    "examples": [
      {
        "text": "That's a good point, but the ending still made sense to me.",
        "slot": "the ending still made sense to me",
        "cue": {
          "en": "the ending makes sense to me",
          "ko": "결말이 나한텐 말이 되다"
        },
        "gloss": {
          "en": "That's a good point, but the ending still made sense to me.",
          "ko": "좋은 지적이야, 근데 나한텐 결말이 그래도 말이 됐어."
        }
      },
      {
        "text": "That's a good point, but who's going to pay for it?",
        "slot": "who's going to pay for it",
        "cue": {
          "en": "who will pay for it",
          "ko": "누가 돈을 내다"
        },
        "gloss": {
          "en": "That's a good point, but who's going to pay for it?",
          "ko": "좋은 지적인데, 그건 누가 내?"
        }
      },
      {
        "text": "That's a good point, but we haven't tried the cheaper option yet.",
        "slot": "we haven't tried the cheaper option yet",
        "cue": {
          "en": "we haven't tried the cheaper option",
          "ko": "더 싼 방법을 안 해 보다"
        },
        "gloss": {
          "en": "That's a good point, but we haven't tried the cheaper option yet.",
          "ko": "좋은 지적이지만 더 싼 방법은 아직 안 해 봤잖아."
        }
      },
      {
        "text": "Hmm, that's a good point, but I think the timing is wrong.",
        "slot": "I think the timing is wrong",
        "cue": {
          "en": "the timing is wrong",
          "ko": "시기가 안 맞다"
        },
        "gloss": {
          "en": "Hmm, that's a good point, but I think the timing is wrong.",
          "ko": "음, 좋은 지적인데 시기가 안 맞는 것 같아."
        }
      }
    ]
  },
  {
    "id": "en-f4-15",
    "stage": 4,
    "fn": "pros-cons",
    "pattern": "On the other hand, ___.",
    "core": [
      "On the other hand",
      "on the other hand"
    ],
    "meaning": {
      "en": "Giving the other side: On the other hand, ___",
      "ko": "반대쪽 면 말하기: 반면에 ___"
    },
    "grammar": [
      6
    ],
    "expressions": [
      "on the other hand"
    ],
    "examples": [
      {
        "text": "On the other hand, the new shopping mall has brought a lot of jobs.",
        "slot": "the new shopping mall has brought a lot of jobs",
        "cue": {
          "en": "the new mall brings jobs",
          "ko": "새 쇼핑몰이 일자리를 가져오다"
        },
        "gloss": {
          "en": "On the other hand, the new shopping mall has brought a lot of jobs.",
          "ko": "반면에 새 쇼핑몰 덕분에 일자리가 많이 생겼어."
        }
      },
      {
        "text": "The flat is small. On the other hand, it's right next to the station.",
        "slot": "it's right next to the station",
        "cue": {
          "en": "it is next to the station",
          "ko": "역 바로 옆이다"
        },
        "gloss": {
          "en": "The flat is small. On the other hand, it's right next to the station.",
          "ko": "집이 좁아. 반면에 역 바로 옆이야."
        }
      },
      {
        "text": "On the other hand, working alone can get pretty lonely.",
        "slot": "working alone can get pretty lonely",
        "cue": {
          "en": "working alone gets lonely",
          "ko": "혼자 일하면 외롭다"
        },
        "gloss": {
          "en": "On the other hand, working alone can get pretty lonely.",
          "ko": "반면에 혼자 일하면 꽤 외로워질 수 있어."
        }
      },
      {
        "text": "It's cheaper, but on the other hand the quality isn't great.",
        "slot": "the quality isn't great",
        "cue": {
          "en": "the quality isn't great",
          "ko": "품질이 별로다"
        },
        "gloss": {
          "en": "It's cheaper, but on the other hand the quality isn't great.",
          "ko": "더 싸긴 한데, 반면에 품질이 별로야."
        }
      }
    ]
  },
  {
    "id": "en-f4-16",
    "stage": 4,
    "fn": "concede",
    "pattern": "To be fair, ___.",
    "core": [
      "To be fair",
      "to be fair"
    ],
    "meaning": {
      "en": "Being fair to the other side: To be fair, ___",
      "ko": "공정하게 인정하기: 공평하게 말하면 ___"
    },
    "grammar": [
      6
    ],
    "expressions": [
      "to be fair"
    ],
    "examples": [
      {
        "text": "To be fair, they'd been hinting at it since season two.",
        "slot": "they'd been hinting at it since season two",
        "cue": {
          "en": "they hinted at it since season two",
          "ko": "시즌 이부터 암시하다"
        },
        "gloss": {
          "en": "To be fair, they'd been hinting at it since season two.",
          "ko": "공평하게 말하면 시즌 이부터 그걸 암시하긴 했어."
        }
      },
      {
        "text": "To be fair, he did apologise the next day.",
        "slot": "he did apologise the next day",
        "cue": {
          "en": "he apologised the next day",
          "ko": "다음 날 사과하다"
        },
        "gloss": {
          "en": "To be fair, he did apologise the next day.",
          "ko": "공평하게 말하면 그가 다음 날 사과하긴 했어."
        }
      },
      {
        "text": "The service was slow, but to be fair, it was really busy.",
        "slot": "it was really busy",
        "cue": {
          "en": "it was very busy",
          "ko": "정말 붐비다"
        },
        "gloss": {
          "en": "The service was slow, but to be fair, it was really busy.",
          "ko": "서비스는 느렸지만, 공평하게 말하면 정말 붐비긴 했어."
        }
      },
      {
        "text": "To be fair, nobody told her about the change.",
        "slot": "nobody told her about the change",
        "cue": {
          "en": "nobody told her about the change",
          "ko": "아무도 변경을 알려 주지 않다"
        },
        "gloss": {
          "en": "To be fair, nobody told her about the change.",
          "ko": "공평하게 말하면 아무도 그녀에게 변경을 안 알려 줬어."
        }
      }
    ]
  },
  {
    "id": "en-f4-17",
    "stage": 4,
    "fn": "concede",
    "pattern": "Having said that, ___.",
    "core": [
      "Having said that",
      "having said that"
    ],
    "meaning": {
      "en": "Adding a contrasting thought: Having said that, ___",
      "ko": "앞말을 받고 덧붙이기: 그렇긴 하지만 ___"
    },
    "grammar": [
      6
    ],
    "expressions": [
      "having said that"
    ],
    "examples": [
      {
        "text": "Having said that, I wouldn't change the ending itself.",
        "slot": "I wouldn't change the ending itself",
        "cue": {
          "en": "I wouldn't change the ending",
          "ko": "결말은 바꾸지 않다"
        },
        "gloss": {
          "en": "Having said that, I wouldn't change the ending itself.",
          "ko": "그렇긴 해도 결말 자체는 안 바꿀 거야."
        }
      },
      {
        "text": "The hotel was a bit old. Having said that, the staff were lovely.",
        "slot": "the staff were lovely",
        "cue": {
          "en": "the staff were lovely",
          "ko": "직원들이 친절하다"
        },
        "gloss": {
          "en": "The hotel was a bit old. Having said that, the staff were lovely.",
          "ko": "호텔은 좀 낡았어. 그렇긴 해도 직원들이 정말 친절했어."
        }
      },
      {
        "text": "Having said that, we still need a backup plan.",
        "slot": "we still need a backup plan",
        "cue": {
          "en": "we need a backup plan",
          "ko": "대비책이 필요하다"
        },
        "gloss": {
          "en": "Having said that, we still need a backup plan.",
          "ko": "그렇긴 해도 대비책은 여전히 필요해."
        }
      },
      {
        "text": "I love my job. Having said that, I could use a holiday.",
        "slot": "I could use a holiday",
        "cue": {
          "en": "I could use a holiday",
          "ko": "휴가가 필요하다"
        },
        "gloss": {
          "en": "I love my job. Having said that, I could use a holiday.",
          "ko": "난 내 일을 좋아해. 그렇긴 해도 휴가는 좀 필요해."
        }
      }
    ]
  },
  {
    "id": "en-f4-18",
    "stage": 4,
    "fn": "deadline",
    "pattern": "We need to make a decision ___.",
    "core": [
      "make a decision"
    ],
    "meaning": {
      "en": "Pushing for a decision: We need to make a decision ___",
      "ko": "결정을 재촉하기: ___ 결정을 내려야 해요"
    },
    "grammar": [
      7
    ],
    "expressions": [
      "make a decision"
    ],
    "examples": [
      {
        "text": "We need to make a decision by Friday, so the team can plan.",
        "slot": "by Friday, so the team can plan",
        "cue": {
          "en": "by Friday",
          "ko": "금요일까지"
        },
        "gloss": {
          "en": "We need to make a decision by Friday, so the team can plan.",
          "ko": "팀이 계획을 세울 수 있게 금요일까지 결정해야 해."
        }
      },
      {
        "text": "Let's make a decision before the end of the meeting.",
        "slot": "before the end of the meeting",
        "cue": {
          "en": "before the meeting ends",
          "ko": "회의 끝나기 전에"
        },
        "gloss": {
          "en": "Let's make a decision before the end of the meeting.",
          "ko": "회의 끝나기 전에 결정하자."
        }
      },
      {
        "text": "I can't make a decision without seeing the numbers first.",
        "slot": "without seeing the numbers first",
        "cue": {
          "en": "without seeing the numbers",
          "ko": "수치를 보지 않고"
        },
        "gloss": {
          "en": "I can't make a decision without seeing the numbers first.",
          "ko": "수치를 먼저 보지 않고는 결정 못 해."
        }
      },
      {
        "text": "It's time to make a decision about the venue.",
        "slot": "about the venue",
        "cue": {
          "en": "about the venue",
          "ko": "장소에 대해"
        },
        "gloss": {
          "en": "It's time to make a decision about the venue.",
          "ko": "이제 장소를 정할 때야."
        }
      }
    ]
  },
  {
    "id": "en-f4-19",
    "stage": 4,
    "fn": "negotiate",
    "pattern": "Could we meet halfway on ___?",
    "core": [
      "meet halfway"
    ],
    "meaning": {
      "en": "Proposing a compromise: Could we meet halfway on ___?",
      "ko": "절충안 내기: ___는 중간에서 맞출 수 있을까요?"
    },
    "grammar": [
      7
    ],
    "expressions": [
      "meet halfway"
    ],
    "examples": [
      {
        "text": "Could we meet halfway on the price?",
        "slot": "the price",
        "cue": {
          "en": "the price",
          "ko": "가격"
        },
        "gloss": {
          "en": "Could we meet halfway on the price?",
          "ko": "가격은 중간에서 맞출 수 있을까요?"
        }
      },
      {
        "text": "If you can meet halfway on the budget, we can start next week.",
        "slot": "the budget",
        "cue": {
          "en": "the budget",
          "ko": "예산"
        },
        "gloss": {
          "en": "If you can meet halfway on the budget, we can start next week.",
          "ko": "예산을 중간에서 맞춰 주시면 다음 주에 시작할 수 있어요."
        }
      },
      {
        "text": "Why don't we meet halfway on the deadline and say the twentieth?",
        "slot": "the deadline",
        "cue": {
          "en": "the deadline",
          "ko": "마감일"
        },
        "gloss": {
          "en": "Why don't we meet halfway on the deadline and say the twentieth?",
          "ko": "마감일은 중간에서 맞춰 이십 일로 하는 건 어때?"
        }
      },
      {
        "text": "I'm happy to meet halfway on the hours if you can be flexible.",
        "slot": "the hours",
        "cue": {
          "en": "the hours",
          "ko": "근무 시간"
        },
        "gloss": {
          "en": "I'm happy to meet halfway on the hours if you can be flexible.",
          "ko": "네가 유연하게 해 주면 근무 시간은 중간에서 맞출게."
        }
      }
    ]
  },
  {
    "id": "en-f4-20",
    "stage": 4,
    "fn": "opinion",
    "pattern": "When it comes to ___, I'm usually …",
    "core": [
      "When it comes to",
      "when it comes to"
    ],
    "meaning": {
      "en": "Narrowing the topic: When it comes to ___, …",
      "ko": "주제를 좁혀 말하기: ___에 관해서라면 …"
    },
    "grammar": [
      7
    ],
    "expressions": [
      "when it comes to"
    ],
    "examples": [
      {
        "text": "When it comes to spin-offs, I'm usually disappointed.",
        "slot": "spin-offs",
        "cue": {
          "en": "spin-offs",
          "ko": "스핀오프"
        },
        "gloss": {
          "en": "When it comes to spin-offs, I'm usually disappointed.",
          "ko": "스핀오프라면 난 보통 실망해."
        }
      },
      {
        "text": "When it comes to cooking, my brother is the expert.",
        "slot": "cooking",
        "cue": {
          "en": "cooking",
          "ko": "요리"
        },
        "gloss": {
          "en": "When it comes to cooking, my brother is the expert.",
          "ko": "요리라면 우리 형이 전문가야."
        }
      },
      {
        "text": "She's very patient when it comes to teaching beginners.",
        "slot": "teaching beginners",
        "cue": {
          "en": "teach beginners",
          "ko": "초보자를 가르치다"
        },
        "gloss": {
          "en": "She's very patient when it comes to teaching beginners.",
          "ko": "초보자를 가르치는 일이라면 그녀는 아주 참을성이 있어."
        }
      },
      {
        "text": "When it comes to money, I'd rather be careful.",
        "slot": "money",
        "cue": {
          "en": "money",
          "ko": "돈"
        },
        "gloss": {
          "en": "When it comes to money, I'd rather be careful.",
          "ko": "돈에 관해서라면 난 조심하는 편이 좋아."
        }
      }
    ]
  },
  {
    "id": "en-f5-01",
    "stage": 5,
    "fn": "hypothetical",
    "pattern": "If I hadn't ___, I wouldn't … today.",
    "core": [
      "If I hadn't",
      "if I hadn't"
    ],
    "meaning": {
      "en": "Linking a past change to the present: If I hadn't ___, … today",
      "ko": "과거가 지금에 미친 영향 말하기: ___하지 않았다면 지금 …않을 거예요"
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "If I hadn't grabbed his suitcase, we wouldn't be friends today.",
        "slot": "grabbed his suitcase",
        "cue": {
          "en": "grab his suitcase",
          "ko": "그의 여행 가방을 집다"
        },
        "gloss": {
          "en": "If I hadn't grabbed his suitcase, we wouldn't be friends today.",
          "ko": "그 가방을 집지 않았다면 지금 우린 친구가 아닐 거야."
        }
      },
      {
        "text": "If I hadn't moved abroad, I wouldn't speak three languages now.",
        "slot": "moved abroad",
        "cue": {
          "en": "move abroad",
          "ko": "해외로 이사하다"
        },
        "gloss": {
          "en": "If I hadn't moved abroad, I wouldn't speak three languages now.",
          "ko": "외국에 나가지 않았다면 지금 세 개 언어를 못 할 거야."
        }
      },
      {
        "text": "Honestly, if I hadn't taken that course, I wouldn't be in this job.",
        "slot": "taken that course",
        "cue": {
          "en": "take that course",
          "ko": "그 강좌를 듣다"
        },
        "gloss": {
          "en": "Honestly, if I hadn't taken that course, I wouldn't be in this job.",
          "ko": "솔직히 그 강좌를 안 들었으면 지금 이 일을 안 하고 있을 거야."
        }
      },
      {
        "text": "If I hadn't missed that flight, I'd never have met my wife.",
        "slot": "missed that flight",
        "cue": {
          "en": "miss that flight",
          "ko": "그 비행기를 놓치다"
        },
        "gloss": {
          "en": "If I hadn't missed that flight, I'd never have met my wife.",
          "ko": "그 비행기를 놓치지 않았다면 아내를 만나지 못했을 거야."
        }
      }
    ]
  },
  {
    "id": "en-f5-02",
    "stage": 5,
    "fn": "hypothetical",
    "pattern": "Had I ___, I'd probably have struggled too.",
    "core": [
      "Had I",
      "had I"
    ],
    "meaning": {
      "en": "Formal conditional by inversion: Had I ___, …",
      "ko": "도치로 격식 있게 가정하기: 내가 ___했더라면 …"
    },
    "grammar": [
      0,
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Had I started my career remotely, I'd probably have struggled too.",
        "slot": "started my career remotely",
        "cue": {
          "en": "start my career remotely",
          "ko": "원격으로 경력을 시작하다"
        },
        "gloss": {
          "en": "Had I started my career remotely, I'd probably have struggled too.",
          "ko": "내가 원격으로 일을 시작했다면 나도 아마 힘들었을 거야."
        }
      },
      {
        "text": "Had I known about the delay, I would have warned the client.",
        "slot": "known about the delay",
        "cue": {
          "en": "know about the delay",
          "ko": "지연을 알다"
        },
        "gloss": {
          "en": "Had I known about the delay, I would have warned the client.",
          "ko": "지연을 알았다면 고객에게 미리 알렸을 거야."
        }
      },
      {
        "text": "Had I listened to my mother, I'd have saved a lot of money.",
        "slot": "listened to my mother",
        "cue": {
          "en": "listen to my mother",
          "ko": "어머니 말을 듣다"
        },
        "gloss": {
          "en": "Had I listened to my mother, I'd have saved a lot of money.",
          "ko": "어머니 말을 들었다면 돈을 많이 아꼈을 거야."
        }
      },
      {
        "text": "I wouldn't have come, had I realised how far it was.",
        "slot": "realised how far it was",
        "cue": {
          "en": "realise how far it is",
          "ko": "얼마나 먼지 깨닫다"
        },
        "gloss": {
          "en": "I wouldn't have come, had I realised how far it was.",
          "ko": "얼마나 먼지 알았다면 오지 않았을 거야."
        }
      }
    ]
  },
  {
    "id": "en-f5-03",
    "stage": 5,
    "fn": "opinion",
    "pattern": "What bothers me is ___.",
    "core": [
      "What bothers me is",
      "what bothers me is"
    ],
    "meaning": {
      "en": "Emphasising what matters with a cleft: What bothers me is ___",
      "ko": "강조 구문으로 핵심 말하기: 나를 거슬리게 하는 건 ___예요"
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "What bothers me is the lack of communication.",
        "slot": "the lack of communication",
        "cue": {
          "en": "the lack of communication",
          "ko": "소통 부족"
        },
        "gloss": {
          "en": "What bothers me is the lack of communication.",
          "ko": "거슬리는 건 소통이 부족하다는 거야."
        }
      },
      {
        "text": "Honestly, what bothers me is how long it took them to reply.",
        "slot": "how long it took them to reply",
        "cue": {
          "en": "how long they took to reply",
          "ko": "그들이 답하는 데 걸린 시간"
        },
        "gloss": {
          "en": "Honestly, what bothers me is how long it took them to reply.",
          "ko": "솔직히 거슬리는 건 그들이 답하는 데 그렇게 오래 걸렸다는 거야."
        }
      },
      {
        "text": "What bothers me is that nobody asked the team first.",
        "slot": "that nobody asked the team first",
        "cue": {
          "en": "nobody asked the team first",
          "ko": "아무도 팀에게 먼저 묻지 않다"
        },
        "gloss": {
          "en": "What bothers me is that nobody asked the team first.",
          "ko": "거슬리는 건 아무도 팀에게 먼저 묻지 않았다는 거야."
        }
      },
      {
        "text": "It's not the price. What bothers me is the hidden fees.",
        "slot": "the hidden fees",
        "cue": {
          "en": "the hidden fees",
          "ko": "숨은 수수료"
        },
        "gloss": {
          "en": "It's not the price. What bothers me is the hidden fees.",
          "ko": "값이 아니라 거슬리는 건 숨은 수수료야."
        }
      }
    ]
  },
  {
    "id": "en-f5-04",
    "stage": 5,
    "fn": "storytelling",
    "pattern": "Not once did ___.",
    "core": [
      "Not once did",
      "not once did"
    ],
    "meaning": {
      "en": "Emphasising with inversion: Not once did ___",
      "ko": "도치로 강조하기: 단 한 번도 ___하지 않았어요"
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Not once did he dodge the numbers, which I respected.",
        "slot": "he dodge the numbers",
        "cue": {
          "en": "he dodges the numbers",
          "ko": "그가 숫자를 피하다"
        },
        "gloss": {
          "en": "Not once did he dodge the numbers, which I respected.",
          "ko": "그는 단 한 번도 숫자를 피하지 않았고, 난 그게 존경스러웠어."
        }
      },
      {
        "text": "Not once did she complain about the extra work.",
        "slot": "she complain about the extra work",
        "cue": {
          "en": "she complains about extra work",
          "ko": "그녀가 추가 업무에 불평하다"
        },
        "gloss": {
          "en": "Not once did she complain about the extra work.",
          "ko": "그녀는 추가 업무에 대해 단 한 번도 불평하지 않았어."
        }
      },
      {
        "text": "Not once did they ask what we actually needed.",
        "slot": "they ask what we actually needed",
        "cue": {
          "en": "they ask what we need",
          "ko": "그들이 우리에게 필요한 걸 묻다"
        },
        "gloss": {
          "en": "Not once did they ask what we actually needed.",
          "ko": "그들은 우리에게 정말 필요한 게 뭔지 단 한 번도 묻지 않았어."
        }
      },
      {
        "text": "In all those years, not once did my father miss a game.",
        "slot": "my father miss a game",
        "cue": {
          "en": "my father misses a game",
          "ko": "아버지가 경기를 놓치다"
        },
        "gloss": {
          "en": "In all those years, not once did my father miss a game.",
          "ko": "그 오랜 세월 동안 아버지는 단 한 번도 경기를 놓치지 않으셨어."
        }
      }
    ]
  },
  {
    "id": "en-f5-05",
    "stage": 5,
    "fn": "storytelling",
    "pattern": "Not knowing ___, she kept to herself at first.",
    "core": [
      "Not knowing",
      "not knowing"
    ],
    "meaning": {
      "en": "Giving the background with a participle: Not knowing ___, …",
      "ko": "분사구문으로 사정 말하기: ___를 몰라서 …"
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Not knowing what else to do, I called the number on the tag.",
        "slot": "what else to do",
        "cue": {
          "en": "what else to do",
          "ko": "달리 무엇을 할지"
        },
        "gloss": {
          "en": "Not knowing what else to do, I called the number on the tag.",
          "ko": "달리 뭘 해야 할지 몰라서 꼬리표에 있는 번호로 전화했어."
        }
      },
      {
        "text": "Not knowing anyone there, she kept to herself at first.",
        "slot": "anyone there",
        "cue": {
          "en": "anyone there",
          "ko": "그곳의 누구"
        },
        "gloss": {
          "en": "Not knowing anyone there, she kept to herself at first.",
          "ko": "거기 아는 사람이 없어서 그녀는 처음엔 혼자 지냈어."
        }
      },
      {
        "text": "Not knowing the local rules, we parked in the wrong spot.",
        "slot": "the local rules",
        "cue": {
          "en": "the local rules",
          "ko": "현지 규칙"
        },
        "gloss": {
          "en": "Not knowing the local rules, we parked in the wrong spot.",
          "ko": "현지 규칙을 몰라서 우리는 엉뚱한 곳에 주차했어."
        }
      },
      {
        "text": "He nodded politely, not knowing a single word of the language.",
        "slot": "a single word of the language",
        "cue": {
          "en": "a single word of the language",
          "ko": "그 언어의 단어 하나"
        },
        "gloss": {
          "en": "He nodded politely, not knowing a single word of the language.",
          "ko": "그는 그 언어를 한 마디도 모른 채 예의 바르게 고개를 끄덕였어."
        }
      }
    ]
  },
  {
    "id": "en-f5-06",
    "stage": 5,
    "fn": "opinion",
    "pattern": "Having ___, I think it still holds.",
    "core": [
      "Having",
      "having"
    ],
    "meaning": {
      "en": "Saying what you did first, with a participle: Having ___, …",
      "ko": "분사구문으로 먼저 한 일 말하기: ___하고 나니 …"
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Having read it twice, I think the logic would still hold.",
        "slot": "read it twice",
        "cue": {
          "en": "read it twice",
          "ko": "두 번 읽다"
        },
        "gloss": {
          "en": "Having read it twice, I think the logic would still hold.",
          "ko": "두 번 읽어 보니 논리는 그대로 성립할 것 같아."
        }
      },
      {
        "text": "Having lived here for four years, though, I've always paid on time.",
        "slot": "lived here for four years",
        "cue": {
          "en": "live here for four years",
          "ko": "사 년 동안 여기 살다"
        },
        "gloss": {
          "en": "Having lived here for four years, though, I've always paid on time.",
          "ko": "그래도 사 년 동안 여기 살면서 늘 제때 냈어요."
        }
      },
      {
        "text": "Having finished the report, she went straight home.",
        "slot": "finished the report",
        "cue": {
          "en": "finish the report",
          "ko": "보고서를 끝내다"
        },
        "gloss": {
          "en": "Having finished the report, she went straight home.",
          "ko": "보고서를 끝내고 그녀는 곧장 집에 갔어."
        }
      },
      {
        "text": "Having worked with them before, I know they keep their promises.",
        "slot": "worked with them before",
        "cue": {
          "en": "work with them before",
          "ko": "전에 그들과 일하다"
        },
        "gloss": {
          "en": "Having worked with them before, I know they keep their promises.",
          "ko": "전에 같이 일해 봐서 그들이 약속을 지킨다는 걸 알아."
        }
      }
    ]
  },
  {
    "id": "en-f5-07",
    "stage": 5,
    "fn": "nuance-soften",
    "pattern": "It seems to me that ___.",
    "core": [
      "It seems to me that",
      "it seems to me that"
    ],
    "meaning": {
      "en": "Softening your view: It seems to me that ___",
      "ko": "의견을 부드럽게 말하기: 제가 보기에는 ___인 것 같아요"
    },
    "grammar": [
      3
    ],
    "expressions": [
      "it seems to me"
    ],
    "examples": [
      {
        "text": "It seems to me that the main recommendation gets a bit lost.",
        "slot": "the main recommendation gets a bit lost",
        "cue": {
          "en": "the main point gets lost",
          "ko": "핵심 제안이 묻히다"
        },
        "gloss": {
          "en": "It seems to me that the main recommendation gets a bit lost.",
          "ko": "내가 보기엔 핵심 제안이 좀 묻히는 것 같아."
        }
      },
      {
        "text": "It seems to me that the law just hasn't caught up yet.",
        "slot": "the law just hasn't caught up yet",
        "cue": {
          "en": "the law hasn't caught up",
          "ko": "법이 아직 못 따라오다"
        },
        "gloss": {
          "en": "It seems to me that the law just hasn't caught up yet.",
          "ko": "내가 보기엔 법이 아직 못 따라온 것 같아."
        }
      },
      {
        "text": "Honestly, it seems to me that we're rushing this.",
        "slot": "we're rushing this",
        "cue": {
          "en": "we are rushing this",
          "ko": "서두르고 있다"
        },
        "gloss": {
          "en": "Honestly, it seems to me that we're rushing this.",
          "ko": "솔직히 내가 보기엔 우리가 이걸 서두르는 것 같아."
        }
      },
      {
        "text": "It seems to me that both sides want the same thing.",
        "slot": "both sides want the same thing",
        "cue": {
          "en": "both sides want the same thing",
          "ko": "양쪽이 같은 걸 원하다"
        },
        "gloss": {
          "en": "It seems to me that both sides want the same thing.",
          "ko": "내가 보기엔 양쪽이 같은 걸 원하는 것 같아."
        }
      }
    ]
  },
  {
    "id": "en-f5-08",
    "stage": 5,
    "fn": "nuance-soften",
    "pattern": "It would appear that ___.",
    "core": [
      "It would appear that",
      "it would appear that"
    ],
    "meaning": {
      "en": "Hedging a claim: It would appear that ___",
      "ko": "조심스럽게 말하기: ___인 것으로 보입니다"
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "It would appear that the figures are slightly off.",
        "slot": "the figures are slightly off",
        "cue": {
          "en": "the figures are off",
          "ko": "수치가 조금 틀리다"
        },
        "gloss": {
          "en": "It would appear that the figures are slightly off.",
          "ko": "수치가 조금 어긋나 있는 것으로 보입니다."
        }
      },
      {
        "text": "It would appear that someone forgot to lock the door.",
        "slot": "someone forgot to lock the door",
        "cue": {
          "en": "someone forgot to lock the door",
          "ko": "누가 문 잠그는 걸 잊다"
        },
        "gloss": {
          "en": "It would appear that someone forgot to lock the door.",
          "ko": "누군가 문 잠그는 걸 잊은 것 같습니다."
        }
      },
      {
        "text": "It would appear that the client has changed their mind.",
        "slot": "the client has changed their mind",
        "cue": {
          "en": "the client changed their mind",
          "ko": "고객이 마음을 바꾸다"
        },
        "gloss": {
          "en": "It would appear that the client has changed their mind.",
          "ko": "고객이 마음을 바꾼 것으로 보입니다."
        }
      },
      {
        "text": "Well, it would appear that we were both wrong.",
        "slot": "we were both wrong",
        "cue": {
          "en": "we were both wrong",
          "ko": "우리 둘 다 틀리다"
        },
        "gloss": {
          "en": "Well, it would appear that we were both wrong.",
          "ko": "음, 우리 둘 다 틀렸던 것 같네요."
        }
      }
    ]
  },
  {
    "id": "en-f5-09",
    "stage": 5,
    "fn": "feedback-give",
    "pattern": "I'd suggest ___.",
    "core": [
      "I'd suggest"
    ],
    "meaning": {
      "en": "Giving feedback gently: I'd suggest ___",
      "ko": "부드럽게 제안하기: ___를 제안하고 싶어요"
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "I'd suggest a short summary on page one.",
        "slot": "a short summary on page one",
        "cue": {
          "en": "a short summary on page one",
          "ko": "첫 페이지의 짧은 요약"
        },
        "gloss": {
          "en": "I'd suggest a short summary on page one.",
          "ko": "첫 페이지에 짧은 요약을 넣는 걸 제안하고 싶어."
        }
      },
      {
        "text": "I'd suggest cutting the introduction a little.",
        "slot": "cutting the introduction a little",
        "cue": {
          "en": "cut the introduction a little",
          "ko": "서론을 조금 줄이다"
        },
        "gloss": {
          "en": "I'd suggest cutting the introduction a little.",
          "ko": "서론을 조금 줄이는 걸 제안할게."
        }
      },
      {
        "text": "If you want my opinion, I'd suggest waiting until spring.",
        "slot": "waiting until spring",
        "cue": {
          "en": "wait until spring",
          "ko": "봄까지 기다리다"
        },
        "gloss": {
          "en": "If you want my opinion, I'd suggest waiting until spring.",
          "ko": "내 의견을 묻는다면 봄까지 기다리는 걸 권할게."
        }
      },
      {
        "text": "I'd suggest that we talk to the designers first.",
        "slot": "that we talk to the designers first",
        "cue": {
          "en": "talk to the designers first",
          "ko": "디자이너와 먼저 이야기하다"
        },
        "gloss": {
          "en": "I'd suggest that we talk to the designers first.",
          "ko": "디자이너들과 먼저 이야기해 보는 걸 제안해."
        }
      }
    ]
  },
  {
    "id": "en-f5-10",
    "stage": 5,
    "fn": "concession",
    "pattern": "Admittedly, ___. Even so, …",
    "core": [
      "Admittedly",
      "admittedly"
    ],
    "meaning": {
      "en": "Admitting a weak point: Admittedly, ___",
      "ko": "약점을 인정하기: 물론 ___이긴 해요"
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Admittedly, it costs more.",
        "slot": "it costs more",
        "cue": {
          "en": "it costs more",
          "ko": "더 비싸다"
        },
        "gloss": {
          "en": "Admittedly, it costs more.",
          "ko": "물론 더 비싸긴 해."
        }
      },
      {
        "text": "Admittedly, I could be wrong.",
        "slot": "I could be wrong",
        "cue": {
          "en": "I could be wrong",
          "ko": "내가 틀릴 수도 있다"
        },
        "gloss": {
          "en": "Admittedly, I could be wrong.",
          "ko": "물론 내가 틀릴 수도 있어."
        }
      },
      {
        "text": "Admittedly, it's harder to build trust online.",
        "slot": "it's harder to build trust online",
        "cue": {
          "en": "it is harder to build trust online",
          "ko": "온라인에서 신뢰를 쌓기가 더 어렵다"
        },
        "gloss": {
          "en": "Admittedly, it's harder to build trust online.",
          "ko": "물론 온라인에선 신뢰를 쌓기가 더 어려워."
        }
      },
      {
        "text": "The plan was, admittedly, a little rushed.",
        "slot": "a little rushed",
        "cue": {
          "en": "a little rushed",
          "ko": "조금 서두른"
        },
        "gloss": {
          "en": "The plan was, admittedly, a little rushed.",
          "ko": "그 계획은 솔직히 인정하자면 좀 급했어."
        }
      }
    ]
  },
  {
    "id": "en-f5-11",
    "stage": 5,
    "fn": "concession",
    "pattern": "Even so, ___.",
    "core": [
      "Even so",
      "even so"
    ],
    "meaning": {
      "en": "Holding your point after a concession: Even so, ___",
      "ko": "그래도 내 주장 지키기: 그렇더라도 ___"
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Even so, it's worth double-checking.",
        "slot": "it's worth double-checking",
        "cue": {
          "en": "it is worth double-checking",
          "ko": "다시 확인할 가치가 있다"
        },
        "gloss": {
          "en": "Even so, it's worth double-checking.",
          "ko": "그렇더라도 다시 확인해 볼 만해."
        }
      },
      {
        "text": "Even so, my team has never been closer.",
        "slot": "my team has never been closer",
        "cue": {
          "en": "my team has never been closer",
          "ko": "우리 팀이 이렇게 가까웠던 적이 없다"
        },
        "gloss": {
          "en": "Even so, my team has never been closer.",
          "ko": "그래도 우리 팀이 이렇게 가까웠던 적은 없어."
        }
      },
      {
        "text": "Even so, I'd rather stay.",
        "slot": "I'd rather stay",
        "cue": {
          "en": "I would rather stay",
          "ko": "남는 편이 낫다"
        },
        "gloss": {
          "en": "Even so, I'd rather stay.",
          "ko": "그래도 나는 남는 게 나아."
        }
      },
      {
        "text": "The reviews were mixed. Even so, the film made a lot of money.",
        "slot": "the film made a lot of money",
        "cue": {
          "en": "the film made a lot of money",
          "ko": "영화가 돈을 많이 벌다"
        },
        "gloss": {
          "en": "The reviews were mixed. Even so, the film made a lot of money.",
          "ko": "평은 엇갈렸어. 그래도 영화는 돈을 많이 벌었어."
        }
      }
    ]
  },
  {
    "id": "en-f5-12",
    "stage": 5,
    "fn": "concession",
    "pattern": "Although ___, she let him off the hook.",
    "core": [
      "Although",
      "although"
    ],
    "meaning": {
      "en": "Conceding inside one sentence: Although ___, …",
      "ko": "한 문장 안에서 양보하기: ___이긴 하지만 …"
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Although she asked good questions, she let him off the hook too easily.",
        "slot": "she asked good questions",
        "cue": {
          "en": "she asks good questions",
          "ko": "그녀가 좋은 질문을 하다"
        },
        "gloss": {
          "en": "Although she asked good questions, she let him off the hook too easily.",
          "ko": "그녀가 좋은 질문을 하긴 했지만 그를 너무 쉽게 놔줬어."
        }
      },
      {
        "text": "Although the hotel was old, it was spotless.",
        "slot": "the hotel was old",
        "cue": {
          "en": "the hotel is old",
          "ko": "호텔이 낡다"
        },
        "gloss": {
          "en": "Although the hotel was old, it was spotless.",
          "ko": "호텔은 낡았지만 티 하나 없이 깨끗했어."
        }
      },
      {
        "text": "I enjoyed the talk, although it went on a bit too long.",
        "slot": "it went on a bit too long",
        "cue": {
          "en": "it goes on too long",
          "ko": "좀 너무 길게 이어지다"
        },
        "gloss": {
          "en": "I enjoyed the talk, although it went on a bit too long.",
          "ko": "좀 너무 길긴 했지만 강연은 재미있었어."
        }
      },
      {
        "text": "Although we disagree on the details, we want the same result.",
        "slot": "we disagree on the details",
        "cue": {
          "en": "we disagree on the details",
          "ko": "세부 사항에서 의견이 다르다"
        },
        "gloss": {
          "en": "Although we disagree on the details, we want the same result.",
          "ko": "세부 사항에선 생각이 다르지만 우리가 원하는 결과는 같아."
        }
      }
    ]
  },
  {
    "id": "en-f5-13",
    "stage": 5,
    "fn": "report",
    "pattern": "The decision to ___ caused a lot of frustration.",
    "core": [
      "decision to"
    ],
    "meaning": {
      "en": "Making it formal with a noun: The decision to ___ …",
      "ko": "명사로 격식 있게 말하기: ___하기로 한 결정은 …"
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "The decision to delay the launch caused a lot of frustration.",
        "slot": "delay the launch",
        "cue": {
          "en": "delay the launch",
          "ko": "출시를 미루다"
        },
        "gloss": {
          "en": "The decision to delay the launch caused a lot of frustration.",
          "ko": "출시를 미루기로 한 결정이 큰 불만을 낳았어요."
        }
      },
      {
        "text": "In hindsight, his decision to cut the training budget might explain a lot.",
        "slot": "cut the training budget",
        "cue": {
          "en": "cut the training budget",
          "ko": "교육 예산을 줄이다"
        },
        "gloss": {
          "en": "In hindsight, his decision to cut the training budget might explain a lot.",
          "ko": "돌이켜 보면 교육 예산을 줄이기로 한 그의 결정이 많은 걸 설명해 줄지도 몰라."
        }
      },
      {
        "text": "Her decision to leave surprised everyone.",
        "slot": "leave",
        "cue": {
          "en": "leave",
          "ko": "떠나다"
        },
        "gloss": {
          "en": "Her decision to leave surprised everyone.",
          "ko": "그녀가 떠나기로 한 결정은 모두를 놀라게 했어."
        }
      },
      {
        "text": "The board's decision to close the branch was not an easy one.",
        "slot": "close the branch",
        "cue": {
          "en": "close the branch",
          "ko": "지점을 닫다"
        },
        "gloss": {
          "en": "The board's decision to close the branch was not an easy one.",
          "ko": "지점을 닫기로 한 이사회의 결정은 쉽지 않은 것이었어요."
        }
      }
    ]
  },
  {
    "id": "en-f5-14",
    "stage": 5,
    "fn": "complain",
    "pattern": "The delay in ___ has made things hard.",
    "core": [
      "delay in"
    ],
    "meaning": {
      "en": "Naming a problem formally: The delay in ___ …",
      "ko": "문제를 명사로 짚기: ___가 늦어진 것이 …"
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "The delay in fixing it has made the winter pretty hard.",
        "slot": "fixing it",
        "cue": {
          "en": "fix it",
          "ko": "그것을 고치다"
        },
        "gloss": {
          "en": "The delay in fixing it has made the winter pretty hard.",
          "ko": "그게 늦게 고쳐지는 바람에 겨울이 꽤 힘들었어요."
        }
      },
      {
        "text": "The delay in payment caused a few problems for us.",
        "slot": "payment",
        "cue": {
          "en": "payment",
          "ko": "지급"
        },
        "gloss": {
          "en": "The delay in payment caused a few problems for us.",
          "ko": "지급이 늦어져서 우리에게 문제가 좀 생겼어요."
        }
      },
      {
        "text": "We apologise for the delay in responding to your email.",
        "slot": "responding to your email",
        "cue": {
          "en": "respond to your email",
          "ko": "메일에 답하다"
        },
        "gloss": {
          "en": "We apologise for the delay in responding to your email.",
          "ko": "메일 답장이 늦어진 점 사과드립니다."
        }
      },
      {
        "text": "Any delay in delivery will push back the whole project.",
        "slot": "delivery",
        "cue": {
          "en": "delivery",
          "ko": "배송"
        },
        "gloss": {
          "en": "Any delay in delivery will push back the whole project.",
          "ko": "배송이 조금이라도 늦어지면 프로젝트 전체가 밀립니다."
        }
      }
    ]
  },
  {
    "id": "en-f5-15",
    "stage": 5,
    "fn": "tact-refuse",
    "pattern": "With all due respect, ___.",
    "core": [
      "With all due respect",
      "with all due respect"
    ],
    "meaning": {
      "en": "Disagreeing politely but firmly: With all due respect, ___",
      "ko": "정중하게 반박하기: 외람되지만 ___"
    },
    "grammar": [
      3
    ],
    "expressions": [
      "with all due respect"
    ],
    "examples": [
      {
        "text": "With all due respect, that's a management issue, not a remote-work issue.",
        "slot": "that's a management issue, not a remote-work issue",
        "cue": {
          "en": "it's a management issue",
          "ko": "관리의 문제이다"
        },
        "gloss": {
          "en": "With all due respect, that's a management issue, not a remote-work issue.",
          "ko": "외람되지만 그건 재택근무 문제가 아니라 관리 문제예요."
        }
      },
      {
        "text": "With all due respect, I don't think you've read the report.",
        "slot": "I don't think you've read the report",
        "cue": {
          "en": "you haven't read the report",
          "ko": "보고서를 안 읽었다"
        },
        "gloss": {
          "en": "With all due respect, I don't think you've read the report.",
          "ko": "외람되지만 보고서를 안 읽으신 것 같아요."
        }
      },
      {
        "text": "With all due respect, the customers see it differently.",
        "slot": "the customers see it differently",
        "cue": {
          "en": "the customers see it differently",
          "ko": "고객은 다르게 보다"
        },
        "gloss": {
          "en": "With all due respect, the customers see it differently.",
          "ko": "외람되지만 고객들은 다르게 봐요."
        }
      },
      {
        "text": "I understand, but with all due respect, this isn't the right time.",
        "slot": "this isn't the right time",
        "cue": {
          "en": "this isn't the right time",
          "ko": "지금은 때가 아니다"
        },
        "gloss": {
          "en": "I understand, but with all due respect, this isn't the right time.",
          "ko": "이해하지만 외람되게도 지금은 적절한 때가 아니에요."
        }
      }
    ]
  },
  {
    "id": "en-f5-16",
    "stage": 5,
    "fn": "debate",
    "pattern": "The bottom line is that ___.",
    "core": [
      "The bottom line is",
      "the bottom line is"
    ],
    "meaning": {
      "en": "Stating the essential point: The bottom line is that ___",
      "ko": "결론 짚기: 결국 핵심은 ___예요"
    },
    "grammar": [
      5
    ],
    "expressions": [
      "the bottom line"
    ],
    "examples": [
      {
        "text": "The bottom line is that people should have the choice.",
        "slot": "that people should have the choice",
        "cue": {
          "en": "people should have the choice",
          "ko": "사람들에게 선택권이 있어야 하다"
        },
        "gloss": {
          "en": "The bottom line is that people should have the choice.",
          "ko": "결국 핵심은 사람들이 선택할 수 있어야 한다는 거야."
        }
      },
      {
        "text": "The bottom line is we can't afford it this year.",
        "slot": "we can't afford it this year",
        "cue": {
          "en": "we can't afford it this year",
          "ko": "올해는 그럴 여유가 없다"
        },
        "gloss": {
          "en": "The bottom line is we can't afford it this year.",
          "ko": "결론은 올해는 그럴 여유가 없다는 거야."
        }
      },
      {
        "text": "Look, the bottom line is that the deadline won't move.",
        "slot": "that the deadline won't move",
        "cue": {
          "en": "the deadline won't move",
          "ko": "마감이 바뀌지 않다"
        },
        "gloss": {
          "en": "Look, the bottom line is that the deadline won't move.",
          "ko": "있잖아, 결국 핵심은 마감이 안 바뀐다는 거야."
        }
      },
      {
        "text": "The bottom line is she's the best person for the job.",
        "slot": "she's the best person for the job",
        "cue": {
          "en": "she is the best person for the job",
          "ko": "그녀가 그 일에 가장 적합하다"
        },
        "gloss": {
          "en": "The bottom line is she's the best person for the job.",
          "ko": "결론은 그녀가 그 일에 가장 적합하다는 거야."
        }
      }
    ]
  },
  {
    "id": "en-f5-17",
    "stage": 5,
    "fn": "advice-give",
    "pattern": "Bear in mind that ___.",
    "core": [
      "Bear in mind",
      "bear in mind"
    ],
    "meaning": {
      "en": "Reminding someone of something important: Bear in mind that ___",
      "ko": "유념하라고 말하기: ___라는 걸 염두에 두세요"
    },
    "grammar": [
      3
    ],
    "expressions": [
      "bear in mind"
    ],
    "examples": [
      {
        "text": "That said, bear in mind that the board will probably only skim the first two pages.",
        "slot": "that the board will probably only skim the first two pages",
        "cue": {
          "en": "the board will only skim the first pages",
          "ko": "이사회가 앞부분만 훑어보다"
        },
        "gloss": {
          "en": "That said, bear in mind that the board will probably only skim the first two pages.",
          "ko": "그렇긴 해도 이사회는 아마 앞의 두 쪽만 훑어볼 거라는 걸 염두에 둬."
        }
      },
      {
        "text": "Just bear in mind it's two hours long.",
        "slot": "it's two hours long",
        "cue": {
          "en": "it is two hours long",
          "ko": "두 시간짜리이다"
        },
        "gloss": {
          "en": "Just bear in mind it's two hours long.",
          "ko": "두 시간짜리라는 것만 기억해 둬."
        }
      },
      {
        "text": "Bear in mind that the shops close early on Sundays.",
        "slot": "that the shops close early on Sundays",
        "cue": {
          "en": "the shops close early on Sundays",
          "ko": "일요일엔 가게가 일찍 닫다"
        },
        "gloss": {
          "en": "Bear in mind that the shops close early on Sundays.",
          "ko": "일요일엔 가게들이 일찍 닫는다는 걸 염두에 둬."
        }
      },
      {
        "text": "Bear in mind she's new to the team.",
        "slot": "she's new to the team",
        "cue": {
          "en": "she is new to the team",
          "ko": "그녀가 팀에 새로 왔다"
        },
        "gloss": {
          "en": "Bear in mind she's new to the team.",
          "ko": "그녀가 팀에 새로 왔다는 걸 기억해 둬."
        }
      }
    ]
  },
  {
    "id": "en-f5-18",
    "stage": 5,
    "fn": "concession",
    "pattern": "Be that as it may, ___.",
    "core": [
      "Be that as it may",
      "be that as it may"
    ],
    "meaning": {
      "en": "Setting a point aside to push yours: Be that as it may, ___",
      "ko": "상대 말을 접어 두고 주장하기: 그렇다 하더라도 ___"
    },
    "grammar": [
      4
    ],
    "expressions": [
      "be that as it may"
    ],
    "examples": [
      {
        "text": "Be that as it may, two hundred is quite a jump.",
        "slot": "two hundred is quite a jump",
        "cue": {
          "en": "two hundred is a big jump",
          "ko": "이백은 큰 폭이다"
        },
        "gloss": {
          "en": "Be that as it may, two hundred is quite a jump.",
          "ko": "그렇다 하더라도 이백은 꽤 큰 폭이에요."
        }
      },
      {
        "text": "Be that as it may, the rules apply to everyone.",
        "slot": "the rules apply to everyone",
        "cue": {
          "en": "the rules apply to everyone",
          "ko": "규칙은 모두에게 적용되다"
        },
        "gloss": {
          "en": "Be that as it may, the rules apply to everyone.",
          "ko": "그렇다 하더라도 규칙은 모두에게 적용돼요."
        }
      },
      {
        "text": "I see your point. Be that as it may, we can't change the plan now.",
        "slot": "we can't change the plan now",
        "cue": {
          "en": "we can't change the plan now",
          "ko": "지금 계획을 바꿀 수 없다"
        },
        "gloss": {
          "en": "I see your point. Be that as it may, we can't change the plan now.",
          "ko": "무슨 말인지 알아요. 그렇다 하더라도 지금 계획을 바꿀 순 없어요."
        }
      },
      {
        "text": "Be that as it may, someone has to take responsibility.",
        "slot": "someone has to take responsibility",
        "cue": {
          "en": "someone must take responsibility",
          "ko": "누군가 책임져야 하다"
        },
        "gloss": {
          "en": "Be that as it may, someone has to take responsibility.",
          "ko": "그렇다 하더라도 누군가는 책임을 져야 해요."
        }
      }
    ]
  }
];
