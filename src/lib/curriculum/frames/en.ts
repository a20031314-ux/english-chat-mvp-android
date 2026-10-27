import type { Frame } from "../frames.ts";

/** 영어 1~3단계 틀(curriculum/frames.ts) — 기능 id(fn)는 curriculum/functions.ts. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
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
  }
];
