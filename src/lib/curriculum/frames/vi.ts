import type { Frame } from "../frames.ts";

/** 베트남어 1~5단계 틀(curriculum/frames.ts) — 기능 id(fn)는 curriculum/functions.ts. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
export const VI_FRAMES: Frame[] = [
  {
    "id": "vi-f1-01",
    "stage": 1,
    "fn": "introduce",
    "pattern": "Tôi là ___.",
    "core": [
      "Tôi là",
      "tôi là"
    ],
    "meaning": {
      "en": "Saying who you are: I am ___.",
      "ko": "나를 소개하기: 저는 ___예요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Tôi là Min-ho.",
        "slot": "Min-ho",
        "cue": {
          "en": "Min-ho (your name)",
          "ko": "민호(내 이름)"
        },
        "gloss": {
          "en": "I'm Min-ho.",
          "ko": "저는 민호예요."
        }
      },
      {
        "text": "Xin chào, tôi là Lan.",
        "slot": "Lan",
        "cue": {
          "en": "Lan",
          "ko": "란"
        },
        "gloss": {
          "en": "Hello, I'm Lan.",
          "ko": "안녕하세요, 저는 란이에요."
        }
      },
      {
        "text": "Tôi là sinh viên.",
        "slot": "sinh viên",
        "cue": {
          "en": "university student",
          "ko": "대학생"
        },
        "gloss": {
          "en": "I'm a student.",
          "ko": "저는 대학생이에요."
        }
      },
      {
        "text": "Tôi là giáo viên tiếng Anh.",
        "slot": "giáo viên tiếng Anh",
        "cue": {
          "en": "English teacher",
          "ko": "영어 선생님"
        },
        "gloss": {
          "en": "I'm an English teacher.",
          "ko": "저는 영어 선생님이에요."
        }
      }
    ]
  },
  {
    "id": "vi-f1-02",
    "stage": 1,
    "fn": "introduce",
    "pattern": "Tôi tên là ___.",
    "core": [
      "tên là"
    ],
    "meaning": {
      "en": "Saying your name: My name is ___.",
      "ko": "이름 말하기: 제 이름은 ___예요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Tôi tên là Min-ho.",
        "slot": "Min-ho",
        "cue": {
          "en": "Min-ho (your name)",
          "ko": "민호(내 이름)"
        },
        "gloss": {
          "en": "My name is Min-ho.",
          "ko": "제 이름은 민호예요."
        }
      },
      {
        "text": "Chào chị, tôi tên là Hoa.",
        "slot": "Hoa",
        "cue": {
          "en": "Hoa",
          "ko": "호아"
        },
        "gloss": {
          "en": "Hello, my name is Hoa.",
          "ko": "안녕하세요, 제 이름은 호아예요."
        }
      },
      {
        "text": "Em tên là Tuấn.",
        "slot": "Tuấn",
        "cue": {
          "en": "Tuấn",
          "ko": "뚜언"
        },
        "gloss": {
          "en": "My name is Tuấn.",
          "ko": "제 이름은 뚜언이에요."
        }
      },
      {
        "text": "Bạn tôi tên là Mai.",
        "slot": "Mai",
        "cue": {
          "en": "Mai (a friend)",
          "ko": "마이(친구)"
        },
        "gloss": {
          "en": "My friend's name is Mai.",
          "ko": "제 친구 이름은 마이예요."
        }
      }
    ]
  },
  {
    "id": "vi-f1-03",
    "stage": 1,
    "fn": "origin",
    "pattern": "Tôi là người ___.",
    "core": [
      "là người"
    ],
    "meaning": {
      "en": "Saying your nationality: I am ___ (from ___).",
      "ko": "국적 말하기: 저는 ___ 사람이에요."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "tôi là người Hàn Quốc"
    ],
    "examples": [
      {
        "text": "Tôi là người Hàn Quốc.",
        "slot": "Hàn Quốc",
        "cue": {
          "en": "Korea",
          "ko": "한국"
        },
        "gloss": {
          "en": "I'm Korean.",
          "ko": "저는 한국 사람이에요."
        }
      },
      {
        "text": "Tôi là người Nhật.",
        "slot": "Nhật",
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
        "text": "Chị ấy là người Việt Nam.",
        "slot": "Việt Nam",
        "cue": {
          "en": "Vietnam",
          "ko": "베트남"
        },
        "gloss": {
          "en": "She is Vietnamese.",
          "ko": "그분은 베트남 사람이에요."
        }
      },
      {
        "text": "Tôi là người Mỹ, còn bạn?",
        "slot": "Mỹ",
        "cue": {
          "en": "America",
          "ko": "미국"
        },
        "gloss": {
          "en": "I'm American, and you?",
          "ko": "저는 미국 사람이에요, 당신은요?"
        }
      }
    ]
  },
  {
    "id": "vi-f1-04",
    "stage": 1,
    "fn": "greet",
    "pattern": "Chào ___.",
    "core": [
      "Chào",
      "chào"
    ],
    "meaning": {
      "en": "Greeting someone with the right pronoun: Hello, ___.",
      "ko": "호칭에 맞게 인사하기: ___, 안녕하세요."
    },
    "grammar": [
      1
    ],
    "expressions": [
      "xin chào",
      "chào anh",
      "chào chị"
    ],
    "examples": [
      {
        "text": "Chào anh.",
        "slot": "anh",
        "cue": {
          "en": "a man a little older than you",
          "ko": "나보다 조금 나이 많은 남자"
        },
        "gloss": {
          "en": "Hello (to a man older than you).",
          "ko": "안녕하세요(나보다 나이 많은 남자에게)."
        }
      },
      {
        "text": "Chào chị ạ.",
        "slot": "chị",
        "cue": {
          "en": "a woman a little older than you",
          "ko": "나보다 조금 나이 많은 여자"
        },
        "gloss": {
          "en": "Hello (politely, to a woman older than you).",
          "ko": "안녕하세요(나보다 나이 많은 여자에게 공손하게)."
        }
      },
      {
        "text": "Chào em.",
        "slot": "em",
        "cue": {
          "en": "someone younger than you",
          "ko": "나보다 어린 사람"
        },
        "gloss": {
          "en": "Hi (to someone younger).",
          "ko": "안녕(나보다 어린 사람에게)."
        }
      },
      {
        "text": "Xin chào các bạn.",
        "slot": "các bạn",
        "cue": {
          "en": "everyone (friends, classmates)",
          "ko": "여러분(친구·같은 반)"
        },
        "gloss": {
          "en": "Hello, everyone.",
          "ko": "여러분, 안녕하세요."
        }
      }
    ]
  },
  {
    "id": "vi-f1-05",
    "stage": 1,
    "fn": "ask-what",
    "pattern": "___ tên là gì?",
    "core": [
      "tên là gì"
    ],
    "meaning": {
      "en": "Asking someone's name: What is your name?",
      "ko": "이름 묻기: 이름이 뭐예요?"
    },
    "grammar": [
      1,
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Anh tên là gì?",
        "slot": "Anh",
        "cue": {
          "en": "a man older than you",
          "ko": "나보다 나이 많은 남자"
        },
        "gloss": {
          "en": "What's your name? (to a man)",
          "ko": "이름이 뭐예요?(남자에게)"
        }
      },
      {
        "text": "Chị tên là gì?",
        "slot": "Chị",
        "cue": {
          "en": "a woman older than you",
          "ko": "나보다 나이 많은 여자"
        },
        "gloss": {
          "en": "What's your name? (to a woman)",
          "ko": "이름이 뭐예요?(여자에게)"
        }
      },
      {
        "text": "Em tên là gì?",
        "slot": "Em",
        "cue": {
          "en": "someone younger",
          "ko": "나보다 어린 사람"
        },
        "gloss": {
          "en": "What's your name? (to someone younger)",
          "ko": "이름이 뭐야?(어린 사람에게)"
        }
      },
      {
        "text": "Bạn tên là gì?",
        "slot": "Bạn",
        "cue": {
          "en": "someone your age",
          "ko": "또래"
        },
        "gloss": {
          "en": "What's your name? (to a peer)",
          "ko": "이름이 뭐야?(또래에게)"
        }
      }
    ]
  },
  {
    "id": "vi-f1-06",
    "stage": 1,
    "fn": "yes-no",
    "pattern": "… có ___ không?",
    "core": [
      "có"
    ],
    "meaning": {
      "en": "Asking a yes/no question: Are you ___?",
      "ko": "예/아니요 질문하기: ___해요?"
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Anh có khỏe không?",
        "slot": "khỏe",
        "cue": {
          "en": "well",
          "ko": "건강하다·잘 지내다"
        },
        "gloss": {
          "en": "Are you well?",
          "ko": "잘 지내세요?"
        }
      },
      {
        "text": "Chị có bận không?",
        "slot": "bận",
        "cue": {
          "en": "busy",
          "ko": "바쁘다"
        },
        "gloss": {
          "en": "Are you busy?",
          "ko": "바쁘세요?"
        }
      },
      {
        "text": "Em có hiểu không?",
        "slot": "hiểu",
        "cue": {
          "en": "understand",
          "ko": "이해하다"
        },
        "gloss": {
          "en": "Do you understand?",
          "ko": "이해했어?"
        }
      },
      {
        "text": "Bạn có mệt không?",
        "slot": "mệt",
        "cue": {
          "en": "tired",
          "ko": "피곤하다"
        },
        "gloss": {
          "en": "Are you tired?",
          "ko": "피곤해?"
        }
      }
    ]
  },
  {
    "id": "vi-f1-07",
    "stage": 1,
    "fn": "ask-have",
    "pattern": "Ở đây có ___ không?",
    "core": [
      "Ở đây có",
      "ở đây có"
    ],
    "meaning": {
      "en": "Asking if something is here: Is there ___ here?",
      "ko": "있는지 묻기: 여기 ___ 있어요?"
    },
    "grammar": [
      2,
      6,
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Ở đây có nhà vệ sinh không?",
        "slot": "nhà vệ sinh",
        "cue": {
          "en": "toilet",
          "ko": "화장실"
        },
        "gloss": {
          "en": "Is there a toilet here?",
          "ko": "여기 화장실 있어요?"
        }
      },
      {
        "text": "Ở đây có wifi không?",
        "slot": "wifi",
        "cue": {
          "en": "wifi",
          "ko": "와이파이"
        },
        "gloss": {
          "en": "Is there wifi here?",
          "ko": "여기 와이파이 있어요?"
        }
      },
      {
        "text": "Xin lỗi, ở đây có cà phê không?",
        "slot": "cà phê",
        "cue": {
          "en": "coffee",
          "ko": "커피"
        },
        "gloss": {
          "en": "Excuse me, do you have coffee here?",
          "ko": "실례지만, 여기 커피 있어요?"
        }
      },
      {
        "text": "Ở đây có máy rút tiền không?",
        "slot": "máy rút tiền",
        "cue": {
          "en": "cash machine",
          "ko": "현금인출기"
        },
        "gloss": {
          "en": "Is there a cash machine here?",
          "ko": "여기 현금인출기 있어요?"
        }
      }
    ]
  },
  {
    "id": "vi-f1-08",
    "stage": 1,
    "fn": "ask-price",
    "pattern": "___ bao nhiêu tiền?",
    "core": [
      "bao nhiêu tiền"
    ],
    "meaning": {
      "en": "Asking the price: How much is ___?",
      "ko": "값 묻기: ___ 얼마예요?"
    },
    "grammar": [
      4,
      5
    ],
    "expressions": [
      "bao nhiêu tiền"
    ],
    "examples": [
      {
        "text": "Cái này bao nhiêu tiền?",
        "slot": "Cái này",
        "cue": {
          "en": "this (thing)",
          "ko": "이것"
        },
        "gloss": {
          "en": "How much is this?",
          "ko": "이거 얼마예요?"
        }
      },
      {
        "text": "Quả xoài này bao nhiêu tiền?",
        "slot": "Quả xoài này",
        "cue": {
          "en": "this mango",
          "ko": "이 망고"
        },
        "gloss": {
          "en": "How much is this mango?",
          "ko": "이 망고 얼마예요?"
        }
      },
      {
        "text": "Một cân cam bao nhiêu tiền?",
        "slot": "Một cân cam",
        "cue": {
          "en": "a kilo of oranges",
          "ko": "오렌지 일 킬로"
        },
        "gloss": {
          "en": "How much is a kilo of oranges?",
          "ko": "오렌지 일 킬로에 얼마예요?"
        }
      },
      {
        "text": "Cái áo kia bao nhiêu tiền?",
        "slot": "Cái áo kia",
        "cue": {
          "en": "that shirt",
          "ko": "저 셔츠"
        },
        "gloss": {
          "en": "How much is that shirt?",
          "ko": "저 셔츠 얼마예요?"
        }
      }
    ]
  },
  {
    "id": "vi-f1-09",
    "stage": 1,
    "fn": "ask-where",
    "pattern": "___ ở đâu?",
    "core": [
      "ở đâu"
    ],
    "meaning": {
      "en": "Asking where something is: Where is ___?",
      "ko": "어디 있는지 묻기: ___ 어디예요?"
    },
    "grammar": [
      4,
      7
    ],
    "expressions": [
      "ở đâu",
      "xin lỗi"
    ],
    "examples": [
      {
        "text": "Nhà vệ sinh ở đâu?",
        "slot": "Nhà vệ sinh",
        "cue": {
          "en": "the toilet",
          "ko": "화장실"
        },
        "gloss": {
          "en": "Where is the toilet?",
          "ko": "화장실이 어디예요?"
        }
      },
      {
        "text": "Xin lỗi, chợ Đồng Xuân ở đâu?",
        "slot": "chợ Đồng Xuân",
        "cue": {
          "en": "Đồng Xuân market",
          "ko": "동쑤언 시장"
        },
        "gloss": {
          "en": "Excuse me, where is Đồng Xuân market?",
          "ko": "실례지만, 동쑤언 시장이 어디예요?"
        }
      },
      {
        "text": "Hồ Hoàn Kiếm ở đâu ạ?",
        "slot": "Hồ Hoàn Kiếm",
        "cue": {
          "en": "Hoàn Kiếm Lake",
          "ko": "호안끼엠 호수"
        },
        "gloss": {
          "en": "Where is Hoàn Kiếm Lake, please?",
          "ko": "호안끼엠 호수가 어디예요?"
        }
      },
      {
        "text": "Anh ở đâu?",
        "slot": "Anh",
        "cue": {
          "en": "you (a man older than you)",
          "ko": "당신(나이 많은 남자)"
        },
        "gloss": {
          "en": "Where do you live?",
          "ko": "어디 사세요?"
        }
      }
    ]
  },
  {
    "id": "vi-f1-10",
    "stage": 1,
    "fn": "request-thing",
    "pattern": "Cho tôi ___.",
    "core": [
      "Cho tôi",
      "cho tôi"
    ],
    "meaning": {
      "en": "Asking for something: Give me ___, please.",
      "ko": "달라고 하기: ___ 주세요."
    },
    "grammar": [
      5
    ],
    "expressions": [
      "cho tôi cái này"
    ],
    "examples": [
      {
        "text": "Cho tôi cái này.",
        "slot": "cái này",
        "cue": {
          "en": "this one",
          "ko": "이것"
        },
        "gloss": {
          "en": "I'll have this one.",
          "ko": "이거 주세요."
        }
      },
      {
        "text": "Cho tôi hai quả xoài.",
        "slot": "hai quả xoài",
        "cue": {
          "en": "two mangoes",
          "ko": "망고 두 개"
        },
        "gloss": {
          "en": "Two mangoes, please.",
          "ko": "망고 두 개 주세요."
        }
      },
      {
        "text": "Cho tôi một cốc trà đá.",
        "slot": "một cốc trà đá",
        "cue": {
          "en": "a glass of iced tea",
          "ko": "아이스티 한 잔"
        },
        "gloss": {
          "en": "A glass of iced tea, please.",
          "ko": "아이스티 한 잔 주세요."
        }
      },
      {
        "text": "Cho tôi quả dưa hấu kia.",
        "slot": "quả dưa hấu kia",
        "cue": {
          "en": "that watermelon",
          "ko": "저 수박"
        },
        "gloss": {
          "en": "I'll take that watermelon.",
          "ko": "저 수박 주세요."
        }
      }
    ]
  },
  {
    "id": "vi-f1-11",
    "stage": 1,
    "fn": "not-understand",
    "pattern": "Tôi không ___.",
    "core": [
      "Tôi không",
      "tôi không"
    ],
    "meaning": {
      "en": "Saying what you don't do or know: I don't ___.",
      "ko": "부정하기: 저는 ___ 않아요/못 해요."
    },
    "grammar": [
      3
    ],
    "expressions": [
      "tôi không hiểu"
    ],
    "examples": [
      {
        "text": "Tôi không hiểu.",
        "slot": "hiểu",
        "cue": {
          "en": "understand",
          "ko": "이해하다"
        },
        "gloss": {
          "en": "I don't understand.",
          "ko": "이해를 못 했어요."
        }
      },
      {
        "text": "Xin lỗi, tôi không biết.",
        "slot": "biết",
        "cue": {
          "en": "know",
          "ko": "알다"
        },
        "gloss": {
          "en": "Sorry, I don't know.",
          "ko": "죄송해요, 몰라요."
        }
      },
      {
        "text": "Tôi không có tiền lẻ.",
        "slot": "có tiền lẻ",
        "cue": {
          "en": "have small change",
          "ko": "잔돈이 있다"
        },
        "gloss": {
          "en": "I don't have small change.",
          "ko": "잔돈이 없어요."
        }
      },
      {
        "text": "Tôi không ăn thịt.",
        "slot": "ăn thịt",
        "cue": {
          "en": "eat meat",
          "ko": "고기를 먹다"
        },
        "gloss": {
          "en": "I don't eat meat.",
          "ko": "저는 고기를 안 먹어요."
        }
      }
    ]
  },
  {
    "id": "vi-f1-12",
    "stage": 1,
    "fn": "repeat-slow",
    "pattern": "___ nói chậm thôi.",
    "core": [
      "nói chậm thôi"
    ],
    "meaning": {
      "en": "Asking someone to slow down: Please speak more slowly.",
      "ko": "천천히 말해 달라고 하기: 천천히 말해 주세요."
    },
    "grammar": [
      1
    ],
    "expressions": [
      "nói chậm thôi",
      "xin lỗi"
    ],
    "examples": [
      {
        "text": "Anh nói chậm thôi.",
        "slot": "Anh",
        "cue": {
          "en": "a man older than you",
          "ko": "나보다 나이 많은 남자"
        },
        "gloss": {
          "en": "Please speak slowly. (to a man)",
          "ko": "천천히 말해 주세요.(남자에게)"
        }
      },
      {
        "text": "Chị nói chậm thôi ạ.",
        "slot": "Chị",
        "cue": {
          "en": "a woman older than you",
          "ko": "나보다 나이 많은 여자"
        },
        "gloss": {
          "en": "Please speak slowly. (politely, to a woman)",
          "ko": "천천히 말씀해 주세요.(여자에게)"
        }
      },
      {
        "text": "Xin lỗi, em nói chậm thôi.",
        "slot": "em",
        "cue": {
          "en": "someone younger",
          "ko": "나보다 어린 사람"
        },
        "gloss": {
          "en": "Sorry, speak slowly, please. (to someone younger)",
          "ko": "미안, 천천히 말해 줘.(어린 사람에게)"
        }
      },
      {
        "text": "Bạn nói chậm thôi.",
        "slot": "Bạn",
        "cue": {
          "en": "someone your age",
          "ko": "또래"
        },
        "gloss": {
          "en": "Speak slowly, please. (to a peer)",
          "ko": "천천히 말해 줘.(또래에게)"
        }
      }
    ]
  },
  {
    "id": "vi-f1-13",
    "stage": 1,
    "fn": "have",
    "pattern": "Tôi có ___.",
    "core": [
      "Tôi có",
      "tôi có"
    ],
    "meaning": {
      "en": "Saying what you have: I have ___.",
      "ko": "가진 것 말하기: 저는 ___ 있어요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Tôi có hai con mèo.",
        "slot": "hai con mèo",
        "cue": {
          "en": "two cats",
          "ko": "고양이 두 마리"
        },
        "gloss": {
          "en": "I have two cats.",
          "ko": "저는 고양이 두 마리가 있어요."
        }
      },
      {
        "text": "Tôi có một câu hỏi.",
        "slot": "một câu hỏi",
        "cue": {
          "en": "a question",
          "ko": "질문 하나"
        },
        "gloss": {
          "en": "I have a question.",
          "ko": "질문이 하나 있어요."
        }
      },
      {
        "text": "Tôi có tiền lẻ.",
        "slot": "tiền lẻ",
        "cue": {
          "en": "small change",
          "ko": "잔돈"
        },
        "gloss": {
          "en": "I have small change.",
          "ko": "잔돈 있어요."
        }
      },
      {
        "text": "Tôi có một anh trai.",
        "slot": "một anh trai",
        "cue": {
          "en": "an older brother",
          "ko": "형·오빠 한 명"
        },
        "gloss": {
          "en": "I have an older brother.",
          "ko": "저는 형(오빠)이 한 명 있어요."
        }
      }
    ]
  },
  {
    "id": "vi-f1-14",
    "stage": 1,
    "fn": "location-now",
    "pattern": "Tôi ở ___.",
    "core": [
      "Tôi ở",
      "tôi ở",
      "Em ở",
      "em ở"
    ],
    "meaning": {
      "en": "Saying where you are or live: I'm at / I live in ___.",
      "ko": "있는 곳·사는 곳 말하기: 저는 ___에 있어요/살아요."
    },
    "grammar": [
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Tôi ở Hà Nội.",
        "slot": "Hà Nội",
        "cue": {
          "en": "Hanoi",
          "ko": "하노이"
        },
        "gloss": {
          "en": "I live in Hanoi.",
          "ko": "저는 하노이에 살아요."
        }
      },
      {
        "text": "Bây giờ tôi ở chợ.",
        "slot": "chợ",
        "cue": {
          "en": "the market",
          "ko": "시장"
        },
        "gloss": {
          "en": "I'm at the market now.",
          "ko": "지금 시장에 있어요."
        }
      },
      {
        "text": "Em ở tầng năm.",
        "slot": "tầng năm",
        "cue": {
          "en": "the fifth floor",
          "ko": "오층"
        },
        "gloss": {
          "en": "I live on the fifth floor.",
          "ko": "저는 오층에 살아요."
        }
      },
      {
        "text": "Tôi ở khách sạn Hoa Sen.",
        "slot": "khách sạn Hoa Sen",
        "cue": {
          "en": "the Hoa Sen hotel",
          "ko": "호아센 호텔"
        },
        "gloss": {
          "en": "I'm staying at the Hoa Sen hotel.",
          "ko": "저는 호아센 호텔에 묵어요."
        }
      }
    ]
  },
  {
    "id": "vi-f1-15",
    "stage": 1,
    "fn": "thank",
    "pattern": "Cảm ơn ___.",
    "core": [
      "Cảm ơn",
      "cảm ơn"
    ],
    "meaning": {
      "en": "Thanking with the right pronoun: Thank you, ___.",
      "ko": "호칭에 맞게 고마워하기: 고마워요."
    },
    "grammar": [
      1
    ],
    "expressions": [
      "cảm ơn",
      "không có gì"
    ],
    "examples": [
      {
        "text": "Cảm ơn anh.",
        "slot": "anh",
        "cue": {
          "en": "a man older than you",
          "ko": "나보다 나이 많은 남자"
        },
        "gloss": {
          "en": "Thank you (to a man).",
          "ko": "고마워요(남자에게)."
        }
      },
      {
        "text": "Cảm ơn chị nhiều.",
        "slot": "chị",
        "cue": {
          "en": "a woman older than you",
          "ko": "나보다 나이 많은 여자"
        },
        "gloss": {
          "en": "Thank you very much (to a woman).",
          "ko": "정말 고마워요(여자에게)."
        }
      },
      {
        "text": "Cảm ơn bạn.",
        "slot": "bạn",
        "cue": {
          "en": "someone your age",
          "ko": "또래"
        },
        "gloss": {
          "en": "Thanks (to a peer).",
          "ko": "고마워(또래에게)."
        }
      },
      {
        "text": "Em cảm ơn cô ạ.",
        "slot": "cô",
        "cue": {
          "en": "a female teacher",
          "ko": "여자 선생님"
        },
        "gloss": {
          "en": "Thank you, teacher.",
          "ko": "선생님, 감사합니다."
        }
      }
    ]
  },
  {
    "id": "vi-f1-16",
    "stage": 1,
    "fn": "greet",
    "pattern": "Hẹn gặp lại ___.",
    "core": [
      "Hẹn gặp lại",
      "hẹn gặp lại"
    ],
    "meaning": {
      "en": "Saying goodbye: See you again, ___.",
      "ko": "헤어질 때 인사: 또 만나요."
    },
    "grammar": [
      1
    ],
    "expressions": [
      "hẹn gặp lại",
      "tạm biệt"
    ],
    "examples": [
      {
        "text": "Hẹn gặp lại anh.",
        "slot": "anh",
        "cue": {
          "en": "a man older than you",
          "ko": "나보다 나이 많은 남자"
        },
        "gloss": {
          "en": "See you again (to a man).",
          "ko": "또 만나요(남자에게)."
        }
      },
      {
        "text": "Tạm biệt, hẹn gặp lại chị.",
        "slot": "chị",
        "cue": {
          "en": "a woman older than you",
          "ko": "나보다 나이 많은 여자"
        },
        "gloss": {
          "en": "Goodbye, see you again (to a woman).",
          "ko": "안녕히 계세요, 또 만나요(여자에게)."
        }
      },
      {
        "text": "Hẹn gặp lại ngày mai.",
        "slot": "ngày mai",
        "cue": {
          "en": "tomorrow",
          "ko": "내일"
        },
        "gloss": {
          "en": "See you tomorrow.",
          "ko": "내일 봐요."
        }
      },
      {
        "text": "Hẹn gặp lại các bạn.",
        "slot": "các bạn",
        "cue": {
          "en": "everyone",
          "ko": "여러분"
        },
        "gloss": {
          "en": "See you again, everyone.",
          "ko": "여러분, 또 만나요."
        }
      }
    ]
  },
  {
    "id": "vi-f2-01",
    "stage": 2,
    "fn": "past-did",
    "pattern": "Hôm qua tôi đã ___.",
    "core": [
      "đã"
    ],
    "meaning": {
      "en": "Saying what you did: Yesterday I ___.",
      "ko": "한 일 말하기: 어제 저는 ___했어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Hôm qua tôi đã đi chợ.",
        "slot": "đi chợ",
        "cue": {
          "en": "go to the market",
          "ko": "시장에 가다"
        },
        "gloss": {
          "en": "Yesterday I went to the market.",
          "ko": "어제 시장에 갔어요."
        }
      },
      {
        "text": "Hôm qua tôi đã xem phim.",
        "slot": "xem phim",
        "cue": {
          "en": "watch a film",
          "ko": "영화를 보다"
        },
        "gloss": {
          "en": "Yesterday I watched a film.",
          "ko": "어제 영화를 봤어요."
        }
      },
      {
        "text": "Hôm qua tôi đã uống nhiều nước đá.",
        "slot": "uống nhiều nước đá",
        "cue": {
          "en": "drink a lot of iced water",
          "ko": "얼음물을 많이 마시다"
        },
        "gloss": {
          "en": "Yesterday I drank a lot of iced water.",
          "ko": "어제 얼음물을 많이 마셨어요."
        }
      },
      {
        "text": "Hôm qua tôi đã gặp bạn cũ.",
        "slot": "gặp bạn cũ",
        "cue": {
          "en": "meet an old friend",
          "ko": "옛 친구를 만나다"
        },
        "gloss": {
          "en": "Yesterday I met an old friend.",
          "ko": "어제 옛 친구를 만났어요."
        }
      }
    ]
  },
  {
    "id": "vi-f2-02",
    "stage": 2,
    "fn": "past-did",
    "pattern": "Tôi ___ rồi.",
    "core": [
      "rồi"
    ],
    "meaning": {
      "en": "Saying something is already done: I've already ___.",
      "ko": "이미 한 일 말하기: 벌써 ___했어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Tôi ăn rồi.",
        "slot": "ăn",
        "cue": {
          "en": "eat",
          "ko": "먹다"
        },
        "gloss": {
          "en": "I've already eaten.",
          "ko": "벌써 먹었어요."
        }
      },
      {
        "text": "Em đến rồi.",
        "slot": "đến",
        "cue": {
          "en": "arrive",
          "ko": "도착하다"
        },
        "gloss": {
          "en": "I'm here already.",
          "ko": "저 도착했어요."
        }
      },
      {
        "text": "Tôi uống thuốc rồi.",
        "slot": "uống thuốc",
        "cue": {
          "en": "take the medicine",
          "ko": "약을 먹다"
        },
        "gloss": {
          "en": "I've already taken the medicine.",
          "ko": "약 먹었어요."
        }
      },
      {
        "text": "Tôi đặt xe rồi.",
        "slot": "đặt xe",
        "cue": {
          "en": "book a ride",
          "ko": "차를 부르다"
        },
        "gloss": {
          "en": "I've already booked a ride.",
          "ko": "차 불렀어요."
        }
      }
    ]
  },
  {
    "id": "vi-f2-03",
    "stage": 2,
    "fn": "future-plan",
    "pattern": "Tôi sẽ ___.",
    "core": [
      "sẽ"
    ],
    "meaning": {
      "en": "Saying what you will do: I will ___.",
      "ko": "할 일 말하기: ___할 거예요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Tôi sẽ về quê.",
        "slot": "về quê",
        "cue": {
          "en": "go back to my hometown",
          "ko": "고향에 가다"
        },
        "gloss": {
          "en": "I'll go back to my hometown.",
          "ko": "고향에 갈 거예요."
        }
      },
      {
        "text": "Cuối tuần này tôi sẽ đi Hội An.",
        "slot": "đi Hội An",
        "cue": {
          "en": "go to Hội An",
          "ko": "호이안에 가다"
        },
        "gloss": {
          "en": "This weekend I'll go to Hội An.",
          "ko": "이번 주말에 호이안에 갈 거예요."
        }
      },
      {
        "text": "Mình sẽ đến sớm.",
        "slot": "đến sớm",
        "cue": {
          "en": "come early",
          "ko": "일찍 오다"
        },
        "gloss": {
          "en": "I'll come early.",
          "ko": "나 일찍 갈게."
        }
      },
      {
        "text": "Tôi sẽ gọi lại sau.",
        "slot": "gọi lại sau",
        "cue": {
          "en": "call back later",
          "ko": "나중에 다시 전화하다"
        },
        "gloss": {
          "en": "I'll call back later.",
          "ko": "나중에 다시 전화할게요."
        }
      }
    ]
  },
  {
    "id": "vi-f2-04",
    "stage": 2,
    "fn": "ongoing",
    "pattern": "Tôi đang ___.",
    "core": [
      "đang"
    ],
    "meaning": {
      "en": "Saying what you are doing now: I'm ___ing.",
      "ko": "지금 하는 일 말하기: 지금 ___하고 있어요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Tôi đang đi mua sách.",
        "slot": "đi mua sách",
        "cue": {
          "en": "go and buy books",
          "ko": "책을 사러 가다"
        },
        "gloss": {
          "en": "I'm going to buy books.",
          "ko": "책 사러 가는 중이에요."
        }
      },
      {
        "text": "Em đang đợi ở cổng trường.",
        "slot": "đợi ở cổng trường",
        "cue": {
          "en": "wait at the school gate",
          "ko": "학교 정문에서 기다리다"
        },
        "gloss": {
          "en": "I'm waiting at the school gate.",
          "ko": "학교 정문에서 기다리고 있어요."
        }
      },
      {
        "text": "Tôi đang học tiếng Việt.",
        "slot": "học tiếng Việt",
        "cue": {
          "en": "study Vietnamese",
          "ko": "베트남어를 공부하다"
        },
        "gloss": {
          "en": "I'm studying Vietnamese.",
          "ko": "베트남어를 공부하고 있어요."
        }
      },
      {
        "text": "Mình đang ăn cơm.",
        "slot": "ăn cơm",
        "cue": {
          "en": "eat (a meal)",
          "ko": "밥을 먹다"
        },
        "gloss": {
          "en": "I'm having a meal.",
          "ko": "나 밥 먹는 중이야."
        }
      }
    ]
  },
  {
    "id": "vi-f2-05",
    "stage": 2,
    "fn": "want",
    "pattern": "Tôi muốn ___.",
    "core": [
      "muốn"
    ],
    "meaning": {
      "en": "Saying what you want: I want to ___.",
      "ko": "원하는 것 말하기: ___하고 싶어요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Tôi muốn đi Hội An.",
        "slot": "đi Hội An",
        "cue": {
          "en": "go to Hội An",
          "ko": "호이안에 가다"
        },
        "gloss": {
          "en": "I want to go to Hội An.",
          "ko": "호이안에 가고 싶어요."
        }
      },
      {
        "text": "Em muốn uống trà.",
        "slot": "uống trà",
        "cue": {
          "en": "drink tea",
          "ko": "차를 마시다"
        },
        "gloss": {
          "en": "I'd like to have some tea.",
          "ko": "차 마시고 싶어요."
        }
      },
      {
        "text": "Tôi muốn đổi tiền.",
        "slot": "đổi tiền",
        "cue": {
          "en": "change money",
          "ko": "환전하다"
        },
        "gloss": {
          "en": "I want to change money.",
          "ko": "환전하고 싶어요."
        }
      },
      {
        "text": "Bạn muốn đi đâu?",
        "slot": "đi đâu",
        "cue": {
          "en": "go where",
          "ko": "어디 가다"
        },
        "gloss": {
          "en": "Where do you want to go?",
          "ko": "어디 가고 싶어?"
        }
      }
    ]
  },
  {
    "id": "vi-f2-06",
    "stage": 2,
    "fn": "like",
    "pattern": "Tôi thích ___.",
    "core": [
      "thích"
    ],
    "meaning": {
      "en": "Saying what you like: I like ___.",
      "ko": "좋아하는 것 말하기: ___ 좋아해요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Tôi thích phở bò.",
        "slot": "phở bò",
        "cue": {
          "en": "beef phở",
          "ko": "소고기 쌀국수"
        },
        "gloss": {
          "en": "I like beef phở.",
          "ko": "소고기 쌀국수를 좋아해요."
        }
      },
      {
        "text": "Tôi thích hành lắm.",
        "slot": "hành",
        "cue": {
          "en": "spring onions",
          "ko": "파"
        },
        "gloss": {
          "en": "I really like spring onions.",
          "ko": "파를 정말 좋아해요."
        }
      },
      {
        "text": "Em thích nghe nhạc.",
        "slot": "nghe nhạc",
        "cue": {
          "en": "listen to music",
          "ko": "음악을 듣다"
        },
        "gloss": {
          "en": "I like listening to music.",
          "ko": "음악 듣는 걸 좋아해요."
        }
      },
      {
        "text": "Tôi thích đi bộ quanh hồ.",
        "slot": "đi bộ quanh hồ",
        "cue": {
          "en": "walk around the lake",
          "ko": "호수 주변을 걷다"
        },
        "gloss": {
          "en": "I like walking around the lake.",
          "ko": "호수 주변을 걷는 걸 좋아해요."
        }
      }
    ]
  },
  {
    "id": "vi-f2-07",
    "stage": 2,
    "fn": "dislike",
    "pattern": "Tôi không thích ___.",
    "core": [
      "không thích"
    ],
    "meaning": {
      "en": "Saying what you don't like: I don't like ___.",
      "ko": "싫어하는 것 말하기: ___ 안 좋아해요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Tôi không thích sầu riêng.",
        "slot": "sầu riêng",
        "cue": {
          "en": "durian",
          "ko": "두리안"
        },
        "gloss": {
          "en": "I don't like durian.",
          "ko": "두리안을 안 좋아해요."
        }
      },
      {
        "text": "Tôi không thích trời nóng.",
        "slot": "trời nóng",
        "cue": {
          "en": "hot weather",
          "ko": "더운 날씨"
        },
        "gloss": {
          "en": "I don't like hot weather.",
          "ko": "더운 날씨를 안 좋아해요."
        }
      },
      {
        "text": "Em không thích đồ ngọt.",
        "slot": "đồ ngọt",
        "cue": {
          "en": "sweet things",
          "ko": "단 음식"
        },
        "gloss": {
          "en": "I don't like sweet things.",
          "ko": "단 걸 안 좋아해요."
        }
      },
      {
        "text": "Tôi không thích dậy sớm.",
        "slot": "dậy sớm",
        "cue": {
          "en": "get up early",
          "ko": "일찍 일어나다"
        },
        "gloss": {
          "en": "I don't like getting up early.",
          "ko": "일찍 일어나는 걸 싫어해요."
        }
      }
    ]
  },
  {
    "id": "vi-f2-08",
    "stage": 2,
    "fn": "request-action",
    "pattern": "Làm ơn ___.",
    "core": [
      "Làm ơn",
      "làm ơn"
    ],
    "meaning": {
      "en": "Asking someone to do something politely: Please ___.",
      "ko": "정중하게 부탁하기: ___해 주세요."
    },
    "grammar": [
      4
    ],
    "expressions": [
      "dừng ở đây"
    ],
    "examples": [
      {
        "text": "Làm ơn dừng ở đây.",
        "slot": "dừng ở đây",
        "cue": {
          "en": "stop here",
          "ko": "여기서 세우다"
        },
        "gloss": {
          "en": "Please stop here.",
          "ko": "여기서 세워 주세요."
        }
      },
      {
        "text": "Làm ơn đi chậm một chút.",
        "slot": "đi chậm một chút",
        "cue": {
          "en": "go a bit slower",
          "ko": "조금 천천히 가다"
        },
        "gloss": {
          "en": "Please go a bit slower.",
          "ko": "조금 천천히 가 주세요."
        }
      },
      {
        "text": "Anh làm ơn đợi tôi.",
        "slot": "đợi tôi",
        "cue": {
          "en": "wait for me",
          "ko": "나를 기다리다"
        },
        "gloss": {
          "en": "Please wait for me.",
          "ko": "저 좀 기다려 주세요."
        }
      },
      {
        "text": "Làm ơn gọi taxi giúp tôi.",
        "slot": "gọi taxi giúp tôi",
        "cue": {
          "en": "call a taxi for me",
          "ko": "택시를 불러 주다"
        },
        "gloss": {
          "en": "Please call a taxi for me.",
          "ko": "택시 좀 불러 주세요."
        }
      }
    ]
  },
  {
    "id": "vi-f2-09",
    "stage": 2,
    "fn": "order",
    "pattern": "Cho thêm ___.",
    "core": [
      "cho thêm",
      "Cho thêm"
    ],
    "meaning": {
      "en": "Asking for more: Some more ___, please.",
      "ko": "더 달라고 하기: ___ 더 주세요."
    },
    "grammar": [
      4
    ],
    "expressions": [
      "cho thêm"
    ],
    "examples": [
      {
        "text": "Cho thêm rau nhé.",
        "slot": "rau",
        "cue": {
          "en": "herbs",
          "ko": "채소·허브"
        },
        "gloss": {
          "en": "Some more herbs, please.",
          "ko": "채소 좀 더 주세요."
        }
      },
      {
        "text": "Em cho thêm hành được không?",
        "slot": "hành",
        "cue": {
          "en": "spring onions",
          "ko": "파"
        },
        "gloss": {
          "en": "Could you add more spring onions?",
          "ko": "파 좀 더 줄 수 있어요?"
        }
      },
      {
        "text": "Chị cho thêm đá.",
        "slot": "đá",
        "cue": {
          "en": "ice",
          "ko": "얼음"
        },
        "gloss": {
          "en": "More ice, please.",
          "ko": "얼음 더 주세요."
        }
      },
      {
        "text": "Cho thêm một bát cơm.",
        "slot": "một bát cơm",
        "cue": {
          "en": "one more bowl of rice",
          "ko": "밥 한 공기"
        },
        "gloss": {
          "en": "One more bowl of rice, please.",
          "ko": "밥 한 공기 더 주세요."
        }
      }
    ]
  },
  {
    "id": "vi-f2-10",
    "stage": 2,
    "fn": "order",
    "pattern": "Cho tôi một bát ___.",
    "core": [
      "một bát"
    ],
    "meaning": {
      "en": "Ordering a bowl of something: A bowl of ___, please.",
      "ko": "주문하기: ___ 한 그릇 주세요."
    },
    "grammar": [
      4
    ],
    "expressions": [
      "không cay"
    ],
    "examples": [
      {
        "text": "Cho tôi một bát phở bò tái, không cay.",
        "slot": "phở bò tái",
        "cue": {
          "en": "rare-beef phở",
          "ko": "덜 익힌 소고기 쌀국수"
        },
        "gloss": {
          "en": "A bowl of rare-beef phở, not spicy, please.",
          "ko": "덜 익힌 소고기 쌀국수 한 그릇, 안 맵게 주세요."
        }
      },
      {
        "text": "Cho tôi một bát phở gà.",
        "slot": "phở gà",
        "cue": {
          "en": "chicken phở",
          "ko": "닭고기 쌀국수"
        },
        "gloss": {
          "en": "A bowl of chicken phở, please.",
          "ko": "닭고기 쌀국수 한 그릇 주세요."
        }
      },
      {
        "text": "Cho tôi một bát bún bò.",
        "slot": "bún bò",
        "cue": {
          "en": "beef noodle soup",
          "ko": "소고기 국수"
        },
        "gloss": {
          "en": "A bowl of beef noodle soup, please.",
          "ko": "소고기 국수 한 그릇 주세요."
        }
      },
      {
        "text": "Cho tôi một bát cháo.",
        "slot": "cháo",
        "cue": {
          "en": "rice porridge",
          "ko": "죽"
        },
        "gloss": {
          "en": "A bowl of rice porridge, please.",
          "ko": "죽 한 그릇 주세요."
        }
      }
    ]
  },
  {
    "id": "vi-f2-11",
    "stage": 2,
    "fn": "invite",
    "pattern": "Mình ___ nhé.",
    "core": [
      "nhé"
    ],
    "meaning": {
      "en": "Suggesting doing something together: Let's ___.",
      "ko": "같이 하자고 하기: 우리 ___하자."
    },
    "grammar": [
      5
    ],
    "expressions": [
      "đi cùng nhé"
    ],
    "examples": [
      {
        "text": "Mình đi xem phim nhé.",
        "slot": "đi xem phim",
        "cue": {
          "en": "go to the cinema",
          "ko": "영화 보러 가다"
        },
        "gloss": {
          "en": "Let's go and see a film.",
          "ko": "우리 영화 보러 가자."
        }
      },
      {
        "text": "Mình đi cùng nhé.",
        "slot": "đi cùng",
        "cue": {
          "en": "go together",
          "ko": "같이 가다"
        },
        "gloss": {
          "en": "Let's go together.",
          "ko": "같이 가자."
        }
      },
      {
        "text": "Mình uống cà phê nhé.",
        "slot": "uống cà phê",
        "cue": {
          "en": "have coffee",
          "ko": "커피를 마시다"
        },
        "gloss": {
          "en": "Let's have coffee.",
          "ko": "우리 커피 마시자."
        }
      },
      {
        "text": "Thứ bảy mình gặp nhau nhé.",
        "slot": "gặp nhau",
        "cue": {
          "en": "meet up",
          "ko": "만나다"
        },
        "gloss": {
          "en": "Let's meet on Saturday.",
          "ko": "토요일에 만나자."
        }
      }
    ]
  },
  {
    "id": "vi-f2-12",
    "stage": 2,
    "fn": "experience",
    "pattern": "… ___ chưa?",
    "core": [
      "chưa"
    ],
    "meaning": {
      "en": "Asking if someone has done something yet: Have you ___ yet?",
      "ko": "벌써 했는지 묻기: ___했어요?"
    },
    "grammar": [
      6
    ],
    "expressions": [
      "ăn cơm chưa"
    ],
    "examples": [
      {
        "text": "Anh ăn cơm chưa?",
        "slot": "ăn cơm",
        "cue": {
          "en": "eat (a meal)",
          "ko": "밥을 먹다"
        },
        "gloss": {
          "en": "Have you eaten yet?",
          "ko": "식사하셨어요?"
        }
      },
      {
        "text": "Chị đến chưa?",
        "slot": "đến",
        "cue": {
          "en": "arrive",
          "ko": "도착하다"
        },
        "gloss": {
          "en": "Have you arrived yet?",
          "ko": "도착하셨어요?"
        }
      },
      {
        "text": "Em đã đi Hội An chưa?",
        "slot": "đi Hội An",
        "cue": {
          "en": "go to Hội An",
          "ko": "호이안에 가다"
        },
        "gloss": {
          "en": "Have you been to Hội An?",
          "ko": "호이안에 가 봤어?"
        }
      },
      {
        "text": "Bạn uống thuốc chưa?",
        "slot": "uống thuốc",
        "cue": {
          "en": "take the medicine",
          "ko": "약을 먹다"
        },
        "gloss": {
          "en": "Have you taken your medicine yet?",
          "ko": "약 먹었어?"
        }
      }
    ]
  },
  {
    "id": "vi-f2-13",
    "stage": 2,
    "fn": "feel",
    "pattern": "___ quá!",
    "core": [
      "quá"
    ],
    "meaning": {
      "en": "Reacting with feeling: How ___! / So ___!",
      "ko": "감정 반응하기: 정말 ___다!"
    },
    "grammar": [],
    "expressions": [
      "hay quá",
      "tiếc quá"
    ],
    "examples": [
      {
        "text": "Hay quá!",
        "slot": "Hay",
        "cue": {
          "en": "great, interesting",
          "ko": "좋다·재미있다"
        },
        "gloss": {
          "en": "That's great!",
          "ko": "좋다!"
        }
      },
      {
        "text": "Tiếc quá!",
        "slot": "Tiếc",
        "cue": {
          "en": "a pity",
          "ko": "아쉽다"
        },
        "gloss": {
          "en": "What a pity!",
          "ko": "아쉽다!"
        }
      },
      {
        "text": "Ngon quá!",
        "slot": "Ngon",
        "cue": {
          "en": "delicious",
          "ko": "맛있다"
        },
        "gloss": {
          "en": "So delicious!",
          "ko": "너무 맛있다!"
        }
      },
      {
        "text": "Hôm nay mệt quá!",
        "slot": "mệt",
        "cue": {
          "en": "tired",
          "ko": "피곤하다"
        },
        "gloss": {
          "en": "I'm so tired today!",
          "ko": "오늘 너무 피곤해!"
        }
      }
    ]
  },
  {
    "id": "vi-f2-14",
    "stage": 2,
    "fn": "reason",
    "pattern": "Vì ___ nên …",
    "core": [
      "Vì",
      "vì"
    ],
    "meaning": {
      "en": "Giving a reason: Because ___, so …",
      "ko": "이유 말하기: ___해서 …"
    },
    "grammar": [
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Vì trời mưa nên tôi ở nhà.",
        "slot": "trời mưa",
        "cue": {
          "en": "it rains",
          "ko": "비가 오다"
        },
        "gloss": {
          "en": "Because it was raining, I stayed home.",
          "ko": "비가 와서 집에 있었어요."
        }
      },
      {
        "text": "Vì mệt quá nên tôi ngủ sớm.",
        "slot": "mệt quá",
        "cue": {
          "en": "be very tired",
          "ko": "너무 피곤하다"
        },
        "gloss": {
          "en": "Because I was so tired, I went to bed early.",
          "ko": "너무 피곤해서 일찍 잤어요."
        }
      },
      {
        "text": "Vì tắc đường nên tôi đến muộn.",
        "slot": "tắc đường",
        "cue": {
          "en": "there's a traffic jam",
          "ko": "길이 막히다"
        },
        "gloss": {
          "en": "Because of the traffic jam, I was late.",
          "ko": "길이 막혀서 늦었어요."
        }
      },
      {
        "text": "Vì tôi đi sớm nên không sao.",
        "slot": "tôi đi sớm",
        "cue": {
          "en": "I left early",
          "ko": "일찍 나왔다"
        },
        "gloss": {
          "en": "Because I left early, it's fine.",
          "ko": "일찍 나와서 괜찮아요."
        }
      }
    ]
  },
  {
    "id": "vi-f2-15",
    "stage": 2,
    "fn": "symptom",
    "pattern": "Tôi bị đau ___.",
    "core": [
      "bị đau"
    ],
    "meaning": {
      "en": "Describing pain: I have a sore ___ / my ___ hurts.",
      "ko": "아픈 곳 말하기: ___가 아파요."
    },
    "grammar": [],
    "expressions": [
      "tôi bị đau họng"
    ],
    "examples": [
      {
        "text": "Tôi bị đau họng.",
        "slot": "họng",
        "cue": {
          "en": "throat",
          "ko": "목"
        },
        "gloss": {
          "en": "I have a sore throat.",
          "ko": "목이 아파요."
        }
      },
      {
        "text": "Tôi bị đau đầu.",
        "slot": "đầu",
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
        "text": "Tôi bị đau bụng.",
        "slot": "bụng",
        "cue": {
          "en": "stomach",
          "ko": "배"
        },
        "gloss": {
          "en": "I have a stomach ache.",
          "ko": "배가 아파요."
        }
      },
      {
        "text": "Em bị đau răng.",
        "slot": "răng",
        "cue": {
          "en": "tooth",
          "ko": "이"
        },
        "gloss": {
          "en": "I have a toothache.",
          "ko": "이가 아파요."
        }
      }
    ]
  },
  {
    "id": "vi-f2-16",
    "stage": 2,
    "fn": "suggest-time",
    "pattern": "___ lúc mấy giờ?",
    "core": [
      "mấy giờ"
    ],
    "meaning": {
      "en": "Asking what time: What time does ___?",
      "ko": "시간 묻기: 몇 시에 ___해요?"
    },
    "grammar": [],
    "expressions": [
      "mấy giờ"
    ],
    "examples": [
      {
        "text": "Mình gặp nhau lúc mấy giờ?",
        "slot": "Mình gặp nhau",
        "cue": {
          "en": "we meet",
          "ko": "우리가 만나다"
        },
        "gloss": {
          "en": "What time shall we meet?",
          "ko": "우리 몇 시에 만날까?"
        }
      },
      {
        "text": "Phim bắt đầu lúc mấy giờ?",
        "slot": "Phim bắt đầu",
        "cue": {
          "en": "the film starts",
          "ko": "영화가 시작하다"
        },
        "gloss": {
          "en": "What time does the film start?",
          "ko": "영화 몇 시에 시작해?"
        }
      },
      {
        "text": "Quán mở cửa lúc mấy giờ?",
        "slot": "Quán mở cửa",
        "cue": {
          "en": "the shop opens",
          "ko": "가게가 문을 열다"
        },
        "gloss": {
          "en": "What time does the place open?",
          "ko": "가게 몇 시에 열어요?"
        }
      },
      {
        "text": "Chị đóng cửa lúc mấy giờ?",
        "slot": "Chị đóng cửa",
        "cue": {
          "en": "you close",
          "ko": "문을 닫다"
        },
        "gloss": {
          "en": "What time do you close?",
          "ko": "몇 시에 문 닫으세요?"
        }
      }
    ]
  },
  {
    "id": "vi-f2-17",
    "stage": 2,
    "fn": "directions",
    "pattern": "Rẽ trái ở ___ nhé.",
    "core": [
      "rẽ trái",
      "Rẽ trái"
    ],
    "meaning": {
      "en": "Giving directions: Turn left at ___.",
      "ko": "길 알려 주기: ___에서 왼쪽으로 가요."
    },
    "grammar": [
      5
    ],
    "expressions": [
      "rẽ trái",
      "rẽ phải",
      "đi thẳng"
    ],
    "examples": [
      {
        "text": "Anh rẽ trái ở ngã tư nhé.",
        "slot": "ngã tư",
        "cue": {
          "en": "the crossroads",
          "ko": "사거리"
        },
        "gloss": {
          "en": "Turn left at the crossroads.",
          "ko": "사거리에서 좌회전해 주세요."
        }
      },
      {
        "text": "Rẽ trái ở cây xăng nhé.",
        "slot": "cây xăng",
        "cue": {
          "en": "the petrol station",
          "ko": "주유소"
        },
        "gloss": {
          "en": "Turn left at the petrol station.",
          "ko": "주유소에서 좌회전해요."
        }
      },
      {
        "text": "Đi thẳng, rồi rẽ trái ở đèn đỏ nhé.",
        "slot": "đèn đỏ",
        "cue": {
          "en": "the traffic lights",
          "ko": "신호등"
        },
        "gloss": {
          "en": "Go straight, then turn left at the lights.",
          "ko": "쭉 가다가 신호등에서 좌회전해요."
        }
      },
      {
        "text": "Em rẽ trái ở cổng chợ nhé.",
        "slot": "cổng chợ",
        "cue": {
          "en": "the market gate",
          "ko": "시장 입구"
        },
        "gloss": {
          "en": "Turn left at the market gate.",
          "ko": "시장 입구에서 좌회전해."
        }
      }
    ]
  },
  {
    "id": "vi-f2-18",
    "stage": 2,
    "fn": "recommend-ask",
    "pattern": "___ có món gì ngon?",
    "core": [
      "món gì ngon"
    ],
    "meaning": {
      "en": "Asking for a food recommendation: What's good to eat at ___?",
      "ko": "추천 묻기: ___에 뭐가 맛있어요?"
    },
    "grammar": [],
    "expressions": [
      "món gì ngon"
    ],
    "examples": [
      {
        "text": "Ở đây có món gì ngon?",
        "slot": "Ở đây",
        "cue": {
          "en": "here",
          "ko": "여기"
        },
        "gloss": {
          "en": "What's good here?",
          "ko": "여기 뭐가 맛있어요?"
        }
      },
      {
        "text": "Quán mình có món gì ngon?",
        "slot": "Quán mình",
        "cue": {
          "en": "this restaurant",
          "ko": "이 식당"
        },
        "gloss": {
          "en": "What's good at this restaurant?",
          "ko": "이 식당은 뭐가 맛있어요?"
        }
      },
      {
        "text": "Hội An có món gì ngon?",
        "slot": "Hội An",
        "cue": {
          "en": "Hội An",
          "ko": "호이안"
        },
        "gloss": {
          "en": "What's good to eat in Hội An?",
          "ko": "호이안에는 뭐가 맛있어요?"
        }
      },
      {
        "text": "Hôm nay có món gì ngon?",
        "slot": "Hôm nay",
        "cue": {
          "en": "today",
          "ko": "오늘"
        },
        "gloss": {
          "en": "What's good today?",
          "ko": "오늘은 뭐가 맛있어요?"
        }
      }
    ]
  },
  {
    "id": "vi-f2-19",
    "stage": 2,
    "fn": "greet",
    "pattern": "Dạo này ___ thế nào?",
    "core": [
      "Dạo này",
      "dạo này"
    ],
    "meaning": {
      "en": "Asking how someone has been: How have ___ been lately?",
      "ko": "근황 묻기: 요즘 ___ 어때요?"
    },
    "grammar": [],
    "expressions": [
      "dạo này thế nào",
      "lâu rồi không gặp"
    ],
    "examples": [
      {
        "text": "Dạo này anh thế nào?",
        "slot": "anh",
        "cue": {
          "en": "a man older than you",
          "ko": "나보다 나이 많은 남자"
        },
        "gloss": {
          "en": "How have you been lately?",
          "ko": "요즘 어떻게 지내세요?"
        }
      },
      {
        "text": "Dạo này công việc thế nào?",
        "slot": "công việc",
        "cue": {
          "en": "work",
          "ko": "일"
        },
        "gloss": {
          "en": "How's work been lately?",
          "ko": "요즘 일은 어때요?"
        }
      },
      {
        "text": "Lâu rồi không gặp! Dạo này chị thế nào?",
        "slot": "chị",
        "cue": {
          "en": "a woman older than you",
          "ko": "나보다 나이 많은 여자"
        },
        "gloss": {
          "en": "Long time no see! How have you been?",
          "ko": "오랜만이에요! 요즘 어떻게 지내세요?"
        }
      },
      {
        "text": "Dạo này sức khỏe bố mẹ thế nào?",
        "slot": "sức khỏe bố mẹ",
        "cue": {
          "en": "your parents' health",
          "ko": "부모님 건강"
        },
        "gloss": {
          "en": "How's your parents' health lately?",
          "ko": "요즘 부모님 건강은 어떠세요?"
        }
      }
    ]
  },
  {
    "id": "vi-f3-01",
    "stage": 3,
    "fn": "compare",
    "pattern": "… ___ hơn …",
    "core": [
      "hơn"
    ],
    "meaning": {
      "en": "Comparing two things: … is more ___ than …",
      "ko": "둘을 비교하기: …가 …보다 더 ___해요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Đà Lạt mát hơn Hà Nội.",
        "slot": "mát",
        "cue": {
          "en": "cool",
          "ko": "시원하다"
        },
        "gloss": {
          "en": "Đà Lạt is cooler than Hanoi.",
          "ko": "달랏이 하노이보다 시원해요."
        }
      },
      {
        "text": "Gói này rẻ hơn gói kia.",
        "slot": "rẻ",
        "cue": {
          "en": "cheap",
          "ko": "싸다"
        },
        "gloss": {
          "en": "This plan is cheaper than that one.",
          "ko": "이 요금제가 저것보다 싸요."
        }
      },
      {
        "text": "Đi xe máy nhanh hơn đi xe buýt.",
        "slot": "nhanh",
        "cue": {
          "en": "fast",
          "ko": "빠르다"
        },
        "gloss": {
          "en": "Going by motorbike is faster than by bus.",
          "ko": "오토바이가 버스보다 빨라요."
        }
      },
      {
        "text": "Năm nay trời nóng hơn năm ngoái.",
        "slot": "nóng",
        "cue": {
          "en": "hot",
          "ko": "덥다"
        },
        "gloss": {
          "en": "This year it's hotter than last year.",
          "ko": "올해가 작년보다 더워요."
        }
      }
    ]
  },
  {
    "id": "vi-f3-02",
    "stage": 3,
    "fn": "compare",
    "pattern": "… ___ nhất.",
    "core": [
      "nhất"
    ],
    "meaning": {
      "en": "Saying something is the most: … is the ___est.",
      "ko": "최고 말하기: …가 제일 ___해요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Gói nào nhiều dữ liệu nhất?",
        "slot": "nhiều dữ liệu",
        "cue": {
          "en": "have the most data",
          "ko": "데이터가 많다"
        },
        "gloss": {
          "en": "Which plan has the most data?",
          "ko": "어느 요금제가 데이터가 제일 많아요?"
        }
      },
      {
        "text": "Bánh căn ở đó ngon nhất.",
        "slot": "ngon",
        "cue": {
          "en": "tasty",
          "ko": "맛있다"
        },
        "gloss": {
          "en": "The bánh căn there is the best.",
          "ko": "거기 반깐이 제일 맛있어요."
        }
      },
      {
        "text": "Tháng mười một đẹp nhất.",
        "slot": "đẹp",
        "cue": {
          "en": "beautiful",
          "ko": "아름답다"
        },
        "gloss": {
          "en": "November is the most beautiful.",
          "ko": "십일월이 제일 예뻐요."
        }
      },
      {
        "text": "Quán này rẻ nhất phố.",
        "slot": "rẻ",
        "cue": {
          "en": "cheap",
          "ko": "싸다"
        },
        "gloss": {
          "en": "This place is the cheapest on the street.",
          "ko": "이 가게가 이 거리에서 제일 싸요."
        }
      }
    ]
  },
  {
    "id": "vi-f3-03",
    "stage": 3,
    "fn": "ask-opinion",
    "pattern": "___ nào tốt hơn?",
    "core": [
      "nào tốt hơn"
    ],
    "meaning": {
      "en": "Asking which is better: Which ___ is better?",
      "ko": "어느 쪽이 나은지 묻기: 어느 ___가 더 나아요?"
    },
    "grammar": [
      0
    ],
    "expressions": [
      "cái nào tốt hơn"
    ],
    "examples": [
      {
        "text": "Hai gói này, cái nào tốt hơn?",
        "slot": "cái",
        "cue": {
          "en": "one (thing)",
          "ko": "것"
        },
        "gloss": {
          "en": "Of these two plans, which one is better?",
          "ko": "이 두 요금제 중에 어느 게 더 나아요?"
        }
      },
      {
        "text": "Điện thoại nào tốt hơn?",
        "slot": "Điện thoại",
        "cue": {
          "en": "phone",
          "ko": "휴대폰"
        },
        "gloss": {
          "en": "Which phone is better?",
          "ko": "어느 휴대폰이 더 좋아요?"
        }
      },
      {
        "text": "Quán nào tốt hơn?",
        "slot": "Quán",
        "cue": {
          "en": "restaurant, café",
          "ko": "가게"
        },
        "gloss": {
          "en": "Which place is better?",
          "ko": "어느 가게가 더 나아요?"
        }
      },
      {
        "text": "Cách nào tốt hơn?",
        "slot": "Cách",
        "cue": {
          "en": "way",
          "ko": "방법"
        },
        "gloss": {
          "en": "Which way is better?",
          "ko": "어떤 방법이 더 나아요?"
        }
      }
    ]
  },
  {
    "id": "vi-f3-04",
    "stage": 3,
    "fn": "lost-problem",
    "pattern": "Tôi bị ___.",
    "core": [
      "bị"
    ],
    "meaning": {
      "en": "Saying something bad happened to you: I got ___ / I had ___.",
      "ko": "안 좋은 일 말하기: ___당했어요/___했어요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Hôm qua tôi bị mất ví.",
        "slot": "mất ví",
        "cue": {
          "en": "lose my wallet",
          "ko": "지갑을 잃어버리다"
        },
        "gloss": {
          "en": "Yesterday I lost my wallet.",
          "ko": "어제 지갑을 잃어버렸어요."
        }
      },
      {
        "text": "Tôi bị lạc đường.",
        "slot": "lạc đường",
        "cue": {
          "en": "get lost",
          "ko": "길을 잃다"
        },
        "gloss": {
          "en": "I got lost.",
          "ko": "길을 잃었어요."
        }
      },
      {
        "text": "Em bị cảm rồi.",
        "slot": "cảm",
        "cue": {
          "en": "catch a cold",
          "ko": "감기에 걸리다"
        },
        "gloss": {
          "en": "I've caught a cold.",
          "ko": "감기에 걸렸어요."
        }
      },
      {
        "text": "Tôi bị trộm điện thoại.",
        "slot": "trộm điện thoại",
        "cue": {
          "en": "have my phone stolen",
          "ko": "휴대폰을 도둑맞다"
        },
        "gloss": {
          "en": "My phone was stolen.",
          "ko": "휴대폰을 도둑맞았어요."
        }
      }
    ]
  },
  {
    "id": "vi-f3-05",
    "stage": 3,
    "fn": "complain",
    "pattern": "___ bị hỏng rồi.",
    "core": [
      "bị hỏng rồi"
    ],
    "meaning": {
      "en": "Reporting something broken: ___ is broken.",
      "ko": "고장 알리기: ___가 고장 났어요."
    },
    "grammar": [
      1
    ],
    "expressions": [
      "bị hỏng rồi",
      "có vấn đề"
    ],
    "examples": [
      {
        "text": "Điều hòa bị hỏng rồi.",
        "slot": "Điều hòa",
        "cue": {
          "en": "the air conditioner",
          "ko": "에어컨"
        },
        "gloss": {
          "en": "The air conditioner is broken.",
          "ko": "에어컨이 고장 났어요."
        }
      },
      {
        "text": "Máy giặt bị hỏng rồi.",
        "slot": "Máy giặt",
        "cue": {
          "en": "the washing machine",
          "ko": "세탁기"
        },
        "gloss": {
          "en": "The washing machine is broken.",
          "ko": "세탁기가 고장 났어요."
        }
      },
      {
        "text": "Cái vòi nước trong bếp bị hỏng rồi.",
        "slot": "Cái vòi nước trong bếp",
        "cue": {
          "en": "the kitchen tap",
          "ko": "부엌 수도꼭지"
        },
        "gloss": {
          "en": "The kitchen tap is broken.",
          "ko": "부엌 수도꼭지가 고장 났어요."
        }
      },
      {
        "text": "Xe của tôi bị hỏng rồi.",
        "slot": "Xe của tôi",
        "cue": {
          "en": "my motorbike",
          "ko": "내 오토바이"
        },
        "gloss": {
          "en": "My motorbike has broken down.",
          "ko": "제 오토바이가 고장 났어요."
        }
      }
    ]
  },
  {
    "id": "vi-f3-06",
    "stage": 3,
    "fn": "polite-request",
    "pattern": "Anh sửa giúp tôi ___ được không?",
    "core": [
      "sửa giúp tôi"
    ],
    "meaning": {
      "en": "Asking for a repair: Could you fix ___ for me?",
      "ko": "수리 부탁하기: ___ 좀 고쳐 주실 수 있어요?"
    },
    "grammar": [],
    "expressions": [
      "sửa giúp tôi"
    ],
    "examples": [
      {
        "text": "Anh sửa giúp tôi cái điều hòa được không?",
        "slot": "cái điều hòa",
        "cue": {
          "en": "the air conditioner",
          "ko": "에어컨"
        },
        "gloss": {
          "en": "Could you fix the air conditioner for me?",
          "ko": "에어컨 좀 고쳐 주실 수 있어요?"
        }
      },
      {
        "text": "Anh sửa giúp tôi cái xe được không?",
        "slot": "cái xe",
        "cue": {
          "en": "the motorbike",
          "ko": "오토바이"
        },
        "gloss": {
          "en": "Could you fix my motorbike?",
          "ko": "오토바이 좀 고쳐 주실 수 있어요?"
        }
      },
      {
        "text": "Chị sửa giúp tôi cái khóa cửa được không?",
        "slot": "cái khóa cửa",
        "cue": {
          "en": "the door lock",
          "ko": "문 자물쇠"
        },
        "gloss": {
          "en": "Could you fix the door lock for me?",
          "ko": "문 자물쇠 좀 고쳐 주실 수 있어요?"
        }
      },
      {
        "text": "Anh sửa giúp tôi cái vòi nước được không?",
        "slot": "cái vòi nước",
        "cue": {
          "en": "the tap",
          "ko": "수도꼭지"
        },
        "gloss": {
          "en": "Could you fix the tap for me?",
          "ko": "수도꼭지 좀 고쳐 주실 수 있어요?"
        }
      }
    ]
  },
  {
    "id": "vi-f3-07",
    "stage": 3,
    "fn": "condition",
    "pattern": "Nếu ___ thì …",
    "core": [
      "Nếu",
      "nếu"
    ],
    "meaning": {
      "en": "Saying what happens if: If ___, then …",
      "ko": "조건 말하기: ___하면 …"
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Nếu mai trời đẹp thì mình đi leo núi.",
        "slot": "mai trời đẹp",
        "cue": {
          "en": "the weather is nice tomorrow",
          "ko": "내일 날씨가 좋다"
        },
        "gloss": {
          "en": "If the weather's nice tomorrow, we'll go hiking.",
          "ko": "내일 날씨가 좋으면 등산 가자."
        }
      },
      {
        "text": "Nếu chị đi thì nhớ mang áo khoác nhé.",
        "slot": "chị đi",
        "cue": {
          "en": "you go",
          "ko": "언니(누나)가 가다"
        },
        "gloss": {
          "en": "If you go, remember to bring a jacket.",
          "ko": "가시면 겉옷 꼭 챙기세요."
        }
      },
      {
        "text": "Nếu bị chậm thì tôi có thể mua thêm không?",
        "slot": "bị chậm",
        "cue": {
          "en": "it gets slow",
          "ko": "느려지다"
        },
        "gloss": {
          "en": "If it gets slow, can I buy more?",
          "ko": "느려지면 더 살 수 있어요?"
        }
      },
      {
        "text": "Nếu có thời gian thì em sẽ gọi lại.",
        "slot": "có thời gian",
        "cue": {
          "en": "I have time",
          "ko": "시간이 있다"
        },
        "gloss": {
          "en": "If I have time, I'll call back.",
          "ko": "시간 있으면 다시 전화할게요."
        }
      }
    ]
  },
  {
    "id": "vi-f3-08",
    "stage": 3,
    "fn": "concession",
    "pattern": "Tuy ___ nhưng …",
    "core": [
      "Tuy",
      "tuy"
    ],
    "meaning": {
      "en": "Saying although: Although ___, …",
      "ko": "양보 말하기: ___지만 …"
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Tuy hơi xa nhưng quán này rất ngon.",
        "slot": "hơi xa",
        "cue": {
          "en": "a bit far",
          "ko": "좀 멀다"
        },
        "gloss": {
          "en": "Although it's a bit far, this place is really good.",
          "ko": "좀 멀지만 이 가게는 정말 맛있어요."
        }
      },
      {
        "text": "Tuy hơi đắt nhưng ngon lắm.",
        "slot": "hơi đắt",
        "cue": {
          "en": "a bit expensive",
          "ko": "좀 비싸다"
        },
        "gloss": {
          "en": "Although it's a bit pricey, it's delicious.",
          "ko": "좀 비싸지만 정말 맛있어요."
        }
      },
      {
        "text": "Tuy ít người xem nhưng mình vẫn vui.",
        "slot": "ít người xem",
        "cue": {
          "en": "few people watch",
          "ko": "보는 사람이 적다"
        },
        "gloss": {
          "en": "Although few people watch, we're still happy.",
          "ko": "보는 사람은 적지만 그래도 즐거워."
        }
      },
      {
        "text": "Tuy mệt nhưng tôi vẫn đi làm.",
        "slot": "mệt",
        "cue": {
          "en": "tired",
          "ko": "피곤하다"
        },
        "gloss": {
          "en": "Although I'm tired, I still go to work.",
          "ko": "피곤하지만 그래도 출근해요."
        }
      }
    ]
  },
  {
    "id": "vi-f3-09",
    "stage": 3,
    "fn": "sequence",
    "pattern": "Sau khi ___, …",
    "core": [
      "Sau khi",
      "sau khi"
    ],
    "meaning": {
      "en": "Ordering events: After ___, …",
      "ko": "순서 말하기: ___한 뒤에 …"
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Sau khi ăn tối, em ra chợ đêm.",
        "slot": "ăn tối",
        "cue": {
          "en": "have dinner",
          "ko": "저녁을 먹다"
        },
        "gloss": {
          "en": "After dinner, I went out to the night market.",
          "ko": "저녁을 먹고 야시장에 갔어요."
        }
      },
      {
        "text": "Sau khi ăn sáng, chúng tôi ra biển.",
        "slot": "ăn sáng",
        "cue": {
          "en": "have breakfast",
          "ko": "아침을 먹다"
        },
        "gloss": {
          "en": "After breakfast, we went to the beach.",
          "ko": "아침을 먹고 바다에 갔어요."
        }
      },
      {
        "text": "Sau khi tan làm, tôi đi tập thể dục.",
        "slot": "tan làm",
        "cue": {
          "en": "finish work",
          "ko": "퇴근하다"
        },
        "gloss": {
          "en": "After work, I go and exercise.",
          "ko": "퇴근하고 운동하러 가요."
        }
      },
      {
        "text": "Sau khi xem video, tôi gọi cho bạn.",
        "slot": "xem video",
        "cue": {
          "en": "watch the video",
          "ko": "영상을 보다"
        },
        "gloss": {
          "en": "After watching the video, I called my friend.",
          "ko": "영상을 보고 친구에게 전화했어요."
        }
      }
    ]
  },
  {
    "id": "vi-f3-10",
    "stage": 3,
    "fn": "sequence",
    "pattern": "Trước khi ___, …",
    "core": [
      "Trước khi",
      "trước khi"
    ],
    "meaning": {
      "en": "Ordering events: Before ___, …",
      "ko": "순서 말하기: ___하기 전에 …"
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Trước khi gọi anh, em đã kiểm tra rồi.",
        "slot": "gọi anh",
        "cue": {
          "en": "call you",
          "ko": "전화하다"
        },
        "gloss": {
          "en": "Before calling you, I checked.",
          "ko": "전화하기 전에 확인했어요."
        }
      },
      {
        "text": "Trước khi đi ngủ, tôi đọc sách.",
        "slot": "đi ngủ",
        "cue": {
          "en": "go to bed",
          "ko": "자다"
        },
        "gloss": {
          "en": "Before going to bed, I read.",
          "ko": "자기 전에 책을 읽어요."
        }
      },
      {
        "text": "Trước khi ra sân bay, nhớ kiểm tra hộ chiếu.",
        "slot": "ra sân bay",
        "cue": {
          "en": "go to the airport",
          "ko": "공항에 가다"
        },
        "gloss": {
          "en": "Before heading to the airport, remember to check your passport.",
          "ko": "공항 가기 전에 여권 꼭 확인해요."
        }
      },
      {
        "text": "Trước khi ký, tôi muốn xem lại hợp đồng.",
        "slot": "ký",
        "cue": {
          "en": "sign",
          "ko": "서명하다"
        },
        "gloss": {
          "en": "Before signing, I want to read the contract again.",
          "ko": "서명하기 전에 계약서를 다시 보고 싶어요."
        }
      }
    ]
  },
  {
    "id": "vi-f3-11",
    "stage": 3,
    "fn": "story-past",
    "pattern": "Lúc đầu ___.",
    "core": [
      "Lúc đầu",
      "lúc đầu"
    ],
    "meaning": {
      "en": "Starting a story: At first, ___.",
      "ko": "이야기 시작하기: 처음에는 ___."
    },
    "grammar": [],
    "expressions": [
      "lúc đầu",
      "sau đó"
    ],
    "examples": [
      {
        "text": "Lúc đầu em không mang áo khoác.",
        "slot": "em không mang áo khoác",
        "cue": {
          "en": "I didn't bring a jacket",
          "ko": "겉옷을 안 가져갔다"
        },
        "gloss": {
          "en": "At first I didn't bring a jacket.",
          "ko": "처음엔 겉옷을 안 가져갔어요."
        }
      },
      {
        "text": "Lúc đầu tôi không hiểu gì.",
        "slot": "tôi không hiểu gì",
        "cue": {
          "en": "I understood nothing",
          "ko": "하나도 몰랐다"
        },
        "gloss": {
          "en": "At first I didn't understand anything.",
          "ko": "처음엔 하나도 못 알아들었어요."
        }
      },
      {
        "text": "Lúc đầu mình nghĩ là video thật.",
        "slot": "mình nghĩ là video thật",
        "cue": {
          "en": "I thought the video was real",
          "ko": "영상이 진짜인 줄 알았다"
        },
        "gloss": {
          "en": "At first I thought the video was real.",
          "ko": "처음엔 영상이 진짜인 줄 알았어."
        }
      },
      {
        "text": "Lúc đầu trời đẹp, sau đó mưa to.",
        "slot": "trời đẹp",
        "cue": {
          "en": "the weather was nice",
          "ko": "날씨가 좋았다"
        },
        "gloss": {
          "en": "At first the weather was nice, then it poured.",
          "ko": "처음엔 날씨가 좋았는데 그다음에 비가 많이 왔어요."
        }
      }
    ]
  },
  {
    "id": "vi-f3-12",
    "stage": 3,
    "fn": "story-past",
    "pattern": "Cuối cùng ___.",
    "core": [
      "Cuối cùng",
      "cuối cùng"
    ],
    "meaning": {
      "en": "Ending a story: In the end, ___.",
      "ko": "이야기 끝맺기: 결국 ___."
    },
    "grammar": [],
    "expressions": [
      "cuối cùng"
    ],
    "examples": [
      {
        "text": "Cuối cùng em lại về khách sạn.",
        "slot": "em lại về khách sạn",
        "cue": {
          "en": "I went back to the hotel",
          "ko": "호텔로 돌아갔다"
        },
        "gloss": {
          "en": "In the end I went back to the hotel.",
          "ko": "결국 호텔로 돌아갔어요."
        }
      },
      {
        "text": "Cuối cùng tôi cũng tìm thấy ví.",
        "slot": "tôi cũng tìm thấy ví",
        "cue": {
          "en": "I found my wallet",
          "ko": "지갑을 찾았다"
        },
        "gloss": {
          "en": "In the end I found my wallet.",
          "ko": "결국 지갑을 찾았어요."
        }
      },
      {
        "text": "Cuối cùng chúng tôi đi taxi.",
        "slot": "chúng tôi đi taxi",
        "cue": {
          "en": "we took a taxi",
          "ko": "택시를 탔다"
        },
        "gloss": {
          "en": "In the end we took a taxi.",
          "ko": "결국 택시를 탔어요."
        }
      },
      {
        "text": "Cuối cùng mọi việc đều ổn.",
        "slot": "mọi việc đều ổn",
        "cue": {
          "en": "everything was fine",
          "ko": "다 괜찮았다"
        },
        "gloss": {
          "en": "In the end everything was fine.",
          "ko": "결국 다 잘됐어요."
        }
      }
    ]
  },
  {
    "id": "vi-f3-13",
    "stage": 3,
    "fn": "opinion",
    "pattern": "Tôi nghĩ là ___.",
    "core": [
      "nghĩ là"
    ],
    "meaning": {
      "en": "Giving your opinion: I think (that) ___.",
      "ko": "내 생각 말하기: ___라고 생각해요."
    },
    "grammar": [
      5
    ],
    "expressions": [
      "tôi cũng nghĩ vậy"
    ],
    "examples": [
      {
        "text": "Tôi nghĩ là anh ấy nói đúng.",
        "slot": "anh ấy nói đúng",
        "cue": {
          "en": "he's right",
          "ko": "그 사람 말이 맞다"
        },
        "gloss": {
          "en": "I think he's right.",
          "ko": "그 사람 말이 맞는 것 같아요."
        }
      },
      {
        "text": "Tôi nghĩ là gói nhỏ cũng đủ.",
        "slot": "gói nhỏ cũng đủ",
        "cue": {
          "en": "the small plan is enough",
          "ko": "작은 요금제로도 충분하다"
        },
        "gloss": {
          "en": "I think the small plan is enough.",
          "ko": "작은 요금제로도 충분할 것 같아요."
        }
      },
      {
        "text": "Em nghĩ là bánh căn ngon nhất.",
        "slot": "bánh căn ngon nhất",
        "cue": {
          "en": "bánh căn is the best",
          "ko": "반깐이 제일 맛있다"
        },
        "gloss": {
          "en": "I think bánh căn is the tastiest.",
          "ko": "반깐이 제일 맛있는 것 같아요."
        }
      },
      {
        "text": "Mình nghĩ là video đó là giả.",
        "slot": "video đó là giả",
        "cue": {
          "en": "that video is fake",
          "ko": "그 영상은 가짜다"
        },
        "gloss": {
          "en": "I think that video is fake.",
          "ko": "그 영상 가짜인 것 같아."
        }
      }
    ]
  },
  {
    "id": "vi-f3-14",
    "stage": 3,
    "fn": "hearsay",
    "pattern": "Anh ấy nói là ___.",
    "core": [
      "nói là"
    ],
    "meaning": {
      "en": "Passing on what someone said: He said (that) ___.",
      "ko": "들은 말 전하기: ___라고 했어요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Anh ấy nói là mai sẽ đến.",
        "slot": "mai sẽ đến",
        "cue": {
          "en": "he'll come tomorrow",
          "ko": "내일 오겠다"
        },
        "gloss": {
          "en": "He said he'll come tomorrow.",
          "ko": "그 사람이 내일 온다고 했어요."
        }
      },
      {
        "text": "Chủ nhà nói là thợ đang bận.",
        "slot": "thợ đang bận",
        "cue": {
          "en": "the repairman is busy",
          "ko": "기사가 바쁘다"
        },
        "gloss": {
          "en": "The landlord said the repairman is busy.",
          "ko": "집주인이 기사님이 바쁘다고 했어요."
        }
      },
      {
        "text": "Chị ấy nói là phim hay lắm.",
        "slot": "phim hay lắm",
        "cue": {
          "en": "the film is really good",
          "ko": "영화가 정말 재미있다"
        },
        "gloss": {
          "en": "She said the film is really good.",
          "ko": "그분이 영화가 정말 재미있다고 했어요."
        }
      },
      {
        "text": "Bạn tôi nói là quán này rẻ.",
        "slot": "quán này rẻ",
        "cue": {
          "en": "this place is cheap",
          "ko": "이 가게가 싸다"
        },
        "gloss": {
          "en": "My friend said this place is cheap.",
          "ko": "친구가 이 가게가 싸다고 했어요."
        }
      }
    ]
  },
  {
    "id": "vi-f3-15",
    "stage": 3,
    "fn": "opinion",
    "pattern": "Theo tôi, ___.",
    "core": [
      "Theo tôi",
      "theo tôi"
    ],
    "meaning": {
      "en": "Giving your view: In my opinion, ___.",
      "ko": "의견 말하기: 제 생각에는 ___."
    },
    "grammar": [],
    "expressions": [
      "theo tôi"
    ],
    "examples": [
      {
        "text": "Theo tôi, trả theo tháng thì tiện hơn.",
        "slot": "trả theo tháng thì tiện hơn",
        "cue": {
          "en": "paying monthly is easier",
          "ko": "매달 내는 게 편하다"
        },
        "gloss": {
          "en": "In my opinion, paying monthly is more convenient.",
          "ko": "제 생각에는 매달 내는 게 더 편해요."
        }
      },
      {
        "text": "Theo tôi, mình nên đi sớm.",
        "slot": "mình nên đi sớm",
        "cue": {
          "en": "we should leave early",
          "ko": "일찍 가는 게 좋다"
        },
        "gloss": {
          "en": "In my opinion, we should leave early.",
          "ko": "제 생각에는 일찍 가는 게 좋겠어요."
        }
      },
      {
        "text": "Theo tôi, quán này ngon nhất phố.",
        "slot": "quán này ngon nhất phố",
        "cue": {
          "en": "this place is the best on the street",
          "ko": "이 가게가 이 거리에서 제일 맛있다"
        },
        "gloss": {
          "en": "In my view, this place is the best on the street.",
          "ko": "제 생각에는 이 가게가 이 거리에서 제일 맛있어요."
        }
      },
      {
        "text": "Theo tôi, video đó không có gì đặc biệt.",
        "slot": "video đó không có gì đặc biệt",
        "cue": {
          "en": "that video is nothing special",
          "ko": "그 영상은 별거 없다"
        },
        "gloss": {
          "en": "In my opinion, that video is nothing special.",
          "ko": "제 생각에 그 영상은 별거 없어요."
        }
      }
    ]
  },
  {
    "id": "vi-f3-16",
    "stage": 3,
    "fn": "story-past",
    "pattern": "Tôi vừa ___.",
    "core": [
      "vừa"
    ],
    "meaning": {
      "en": "Saying something just happened: I've just ___.",
      "ko": "방금 한 일 말하기: 방금 ___했어요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Tôi vừa về đến nhà.",
        "slot": "về đến nhà",
        "cue": {
          "en": "get home",
          "ko": "집에 도착하다"
        },
        "gloss": {
          "en": "I've just got home.",
          "ko": "방금 집에 왔어요."
        }
      },
      {
        "text": "Mình vừa xem sáng nay.",
        "slot": "xem sáng nay",
        "cue": {
          "en": "watch it this morning",
          "ko": "오늘 아침에 보다"
        },
        "gloss": {
          "en": "I just watched it this morning.",
          "ko": "나 오늘 아침에 막 봤어."
        }
      },
      {
        "text": "Em vừa gọi cho chủ nhà.",
        "slot": "gọi cho chủ nhà",
        "cue": {
          "en": "call the landlord",
          "ko": "집주인에게 전화하다"
        },
        "gloss": {
          "en": "I've just called the landlord.",
          "ko": "방금 집주인에게 전화했어요."
        }
      },
      {
        "text": "Tôi vừa ăn xong.",
        "slot": "ăn xong",
        "cue": {
          "en": "finish eating",
          "ko": "다 먹다"
        },
        "gloss": {
          "en": "I've just finished eating.",
          "ko": "방금 다 먹었어요."
        }
      }
    ]
  },
  {
    "id": "vi-f3-17",
    "stage": 3,
    "fn": "plan-intent",
    "pattern": "Tôi sắp ___.",
    "core": [
      "sắp"
    ],
    "meaning": {
      "en": "Saying something is about to happen: I'm about to ___.",
      "ko": "곧 할 일 말하기: 곧 ___해요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Tôi sắp phải đi làm rồi.",
        "slot": "phải đi làm",
        "cue": {
          "en": "have to go to work",
          "ko": "출근해야 하다"
        },
        "gloss": {
          "en": "I'm about to have to go to work.",
          "ko": "곧 출근해야 해요."
        }
      },
      {
        "text": "Tôi sắp đến nơi.",
        "slot": "đến nơi",
        "cue": {
          "en": "arrive",
          "ko": "도착하다"
        },
        "gloss": {
          "en": "I'm almost there.",
          "ko": "거의 다 왔어요."
        }
      },
      {
        "text": "Em sắp về quê.",
        "slot": "về quê",
        "cue": {
          "en": "go back to my hometown",
          "ko": "고향에 가다"
        },
        "gloss": {
          "en": "I'm going back to my hometown soon.",
          "ko": "곧 고향에 가요."
        }
      },
      {
        "text": "Phim sắp bắt đầu.",
        "slot": "bắt đầu",
        "cue": {
          "en": "start",
          "ko": "시작하다"
        },
        "gloss": {
          "en": "The film is about to start.",
          "ko": "영화가 곧 시작해요."
        }
      }
    ]
  },
  {
    "id": "vi-f3-18",
    "stage": 3,
    "fn": "disagree-soft",
    "pattern": "Không hẳn, ___.",
    "core": [
      "Không hẳn",
      "không hẳn"
    ],
    "meaning": {
      "en": "Disagreeing gently: Not exactly, ___.",
      "ko": "부드럽게 반대하기: 꼭 그렇진 않아요, ___."
    },
    "grammar": [],
    "expressions": [
      "không hẳn",
      "thật ra"
    ],
    "examples": [
      {
        "text": "Không hẳn, tôi nghĩ hơi khác.",
        "slot": "tôi nghĩ hơi khác",
        "cue": {
          "en": "I see it a bit differently",
          "ko": "생각이 좀 다르다"
        },
        "gloss": {
          "en": "Not exactly, I see it a bit differently.",
          "ko": "꼭 그렇진 않아요, 저는 좀 다르게 생각해요."
        }
      },
      {
        "text": "Không hẳn, thật ra nó khá đắt.",
        "slot": "thật ra nó khá đắt",
        "cue": {
          "en": "actually it's quite expensive",
          "ko": "사실 꽤 비싸다"
        },
        "gloss": {
          "en": "Not really, actually it's quite expensive.",
          "ko": "꼭 그렇진 않아요, 사실 꽤 비싸요."
        }
      },
      {
        "text": "Không hẳn. Họ đã dạy nó rất lâu.",
        "slot": "Họ đã dạy nó rất lâu",
        "cue": {
          "en": "they trained it for a long time",
          "ko": "오랫동안 가르쳤다"
        },
        "gloss": {
          "en": "Not exactly. They trained it for a long time.",
          "ko": "꼭 그렇진 않아. 오랫동안 가르쳤대."
        }
      },
      {
        "text": "Không hẳn, còn tùy người.",
        "slot": "còn tùy người",
        "cue": {
          "en": "it depends on the person",
          "ko": "사람마다 다르다"
        },
        "gloss": {
          "en": "Not exactly, it depends on the person.",
          "ko": "꼭 그렇진 않아요, 사람마다 달라요."
        }
      }
    ]
  },
  {
    "id": "vi-f3-19",
    "stage": 3,
    "fn": "guess",
    "pattern": "Có lẽ ___.",
    "core": [
      "Có lẽ",
      "có lẽ"
    ],
    "meaning": {
      "en": "Guessing: Maybe / Probably ___.",
      "ko": "짐작하기: 아마 ___."
    },
    "grammar": [],
    "expressions": [
      "có lẽ"
    ],
    "examples": [
      {
        "text": "Có lẽ video đó là giả.",
        "slot": "video đó là giả",
        "cue": {
          "en": "that video is fake",
          "ko": "그 영상은 가짜다"
        },
        "gloss": {
          "en": "Maybe that video is fake.",
          "ko": "아마 그 영상은 가짜일 거야."
        }
      },
      {
        "text": "Có lẽ mai trời mưa.",
        "slot": "mai trời mưa",
        "cue": {
          "en": "it will rain tomorrow",
          "ko": "내일 비가 오다"
        },
        "gloss": {
          "en": "It'll probably rain tomorrow.",
          "ko": "아마 내일 비가 올 거예요."
        }
      },
      {
        "text": "Có lẽ anh ấy quên rồi.",
        "slot": "anh ấy quên rồi",
        "cue": {
          "en": "he has forgotten",
          "ko": "그 사람이 잊어버렸다"
        },
        "gloss": {
          "en": "Maybe he's forgotten.",
          "ko": "아마 그 사람이 잊어버렸나 봐요."
        }
      },
      {
        "text": "Có lẽ tôi nhầm rồi.",
        "slot": "tôi nhầm rồi",
        "cue": {
          "en": "I'm mistaken",
          "ko": "내가 착각했다"
        },
        "gloss": {
          "en": "Maybe I was wrong.",
          "ko": "아마 제가 착각했나 봐요."
        }
      }
    ]
  },
  {
    "id": "vi-f4-01",
    "stage": 4,
    "fn": "pros-cons",
    "pattern": "… không những ___ mà còn …",
    "core": [
      "không những",
      "Không những"
    ],
    "meaning": {
      "en": "Adding a second strong point: … not only ___ but also …",
      "ko": "장점을 하나 더 얹기: …는 ___할 뿐 아니라 …도 해요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Kế hoạch này không những rẻ mà còn dễ làm.",
        "slot": "rẻ",
        "cue": {
          "en": "cheap",
          "ko": "싸다"
        },
        "gloss": {
          "en": "This plan is not only cheap but also easy to carry out.",
          "ko": "이 계획은 쌀 뿐 아니라 실행하기도 쉬워요."
        }
      },
      {
        "text": "Căn hộ đó không những rộng mà còn gần trường.",
        "slot": "rộng",
        "cue": {
          "en": "spacious",
          "ko": "넓다"
        },
        "gloss": {
          "en": "That flat is not only spacious but also close to the school.",
          "ko": "그 아파트는 넓을 뿐 아니라 학교에서도 가까워요."
        }
      },
      {
        "text": "Chị ấy không những giỏi tiếng Anh mà còn biết tiếng Nhật.",
        "slot": "giỏi tiếng Anh",
        "cue": {
          "en": "be good at English",
          "ko": "영어를 잘하다"
        },
        "gloss": {
          "en": "She is not only good at English but also knows Japanese.",
          "ko": "그녀는 영어를 잘할 뿐 아니라 일본어도 알아요."
        }
      },
      {
        "text": "Đi tàu không những an toàn mà còn thoải mái.",
        "slot": "an toàn",
        "cue": {
          "en": "safe",
          "ko": "안전하다"
        },
        "gloss": {
          "en": "Going by train is not only safe but also comfortable.",
          "ko": "기차로 가는 건 안전할 뿐 아니라 편하기도 해요."
        }
      }
    ]
  },
  {
    "id": "vi-f4-02",
    "stage": 4,
    "fn": "concede",
    "pattern": "Dù ___, … vẫn …",
    "core": [
      "Dù",
      "dù"
    ],
    "meaning": {
      "en": "Saying something still holds: Even if ___, … still …",
      "ko": "그래도 변함없다고 말하기: ___하더라도 …는 여전히 …해요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Dù giá cao, nhiều người vẫn mua.",
        "slot": "giá cao",
        "cue": {
          "en": "the price is high",
          "ko": "값이 비싸다"
        },
        "gloss": {
          "en": "Even though the price is high, many people still buy it.",
          "ko": "값이 비싸도 많은 사람이 여전히 사요."
        }
      },
      {
        "text": "Dù trời mưa, chúng tôi vẫn đến họp đúng giờ.",
        "slot": "trời mưa",
        "cue": {
          "en": "it rains",
          "ko": "비가 오다"
        },
        "gloss": {
          "en": "Even though it rained, we still got to the meeting on time.",
          "ko": "비가 왔는데도 우리는 제시간에 회의에 갔어요."
        }
      },
      {
        "text": "Dù hơi mệt, em vẫn muốn làm xong báo cáo hôm nay.",
        "slot": "hơi mệt",
        "cue": {
          "en": "be a bit tired",
          "ko": "좀 피곤하다"
        },
        "gloss": {
          "en": "Even though I'm a bit tired, I still want to finish the report today.",
          "ko": "좀 피곤해도 오늘 보고서를 끝내고 싶어요."
        }
      },
      {
        "text": "Anh ấy vẫn bình tĩnh dù khách hàng rất khó tính.",
        "slot": "khách hàng rất khó tính",
        "cue": {
          "en": "the client is very demanding",
          "ko": "고객이 아주 까다롭다"
        },
        "gloss": {
          "en": "He stays calm even though the client is very demanding.",
          "ko": "고객이 아주 까다로워도 그는 침착해요."
        }
      }
    ]
  },
  {
    "id": "vi-f4-03",
    "stage": 4,
    "fn": "explain-process",
    "pattern": "… để ___.",
    "core": [
      "để"
    ],
    "meaning": {
      "en": "Saying the purpose: … in order to ___.",
      "ko": "목적 말하기: ___하기 위해 …해요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Công ty mở lớp đào tạo để nâng cao chất lượng.",
        "slot": "nâng cao chất lượng",
        "cue": {
          "en": "improve quality",
          "ko": "품질을 높이다"
        },
        "gloss": {
          "en": "The company runs training classes to improve quality.",
          "ko": "회사가 품질을 높이려고 교육 과정을 열어요."
        }
      },
      {
        "text": "Mình thuê thêm người để rút ngắn thời gian.",
        "slot": "rút ngắn thời gian",
        "cue": {
          "en": "shorten the time",
          "ko": "시간을 줄이다"
        },
        "gloss": {
          "en": "We'll hire more people to shorten the time.",
          "ko": "시간을 줄이려고 사람을 더 뽑아요."
        }
      },
      {
        "text": "Tôi dậy sớm để tránh tắc đường.",
        "slot": "tránh tắc đường",
        "cue": {
          "en": "avoid traffic jams",
          "ko": "교통 체증을 피하다"
        },
        "gloss": {
          "en": "I get up early to avoid the traffic.",
          "ko": "차 막히는 걸 피하려고 일찍 일어나요."
        }
      },
      {
        "text": "Chúng ta nên gặp nhau sớm để thống nhất kế hoạch.",
        "slot": "thống nhất kế hoạch",
        "cue": {
          "en": "agree on the plan",
          "ko": "계획을 맞추다"
        },
        "gloss": {
          "en": "We should meet early to agree on the plan.",
          "ko": "계획을 맞추기 위해 일찍 만나는 게 좋겠어요."
        }
      }
    ]
  },
  {
    "id": "vi-f4-04",
    "stage": 4,
    "fn": "the-more",
    "pattern": "… càng ___, … càng …",
    "core": [
      "càng"
    ],
    "meaning": {
      "en": "The more…, the more…: the more ___, the more …",
      "ko": "～할수록 ～하다: ___할수록 더 …해요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Thành phố càng đông, giao thông càng tắc.",
        "slot": "đông",
        "cue": {
          "en": "crowded",
          "ko": "붐비다"
        },
        "gloss": {
          "en": "The more crowded the city, the worse the traffic.",
          "ko": "도시가 붐빌수록 교통이 더 막혀요."
        }
      },
      {
        "text": "Càng luyện nói, em càng tự tin.",
        "slot": "luyện nói",
        "cue": {
          "en": "practise speaking",
          "ko": "말하기를 연습하다"
        },
        "gloss": {
          "en": "The more I practise speaking, the more confident I get.",
          "ko": "말하기를 연습할수록 자신감이 더 생겨요."
        }
      },
      {
        "text": "Dự án càng kéo dài, chi phí càng tăng.",
        "slot": "kéo dài",
        "cue": {
          "en": "drag on",
          "ko": "길어지다"
        },
        "gloss": {
          "en": "The longer the project drags on, the more the cost rises.",
          "ko": "프로젝트가 길어질수록 비용이 늘어요."
        }
      },
      {
        "text": "Món này càng để lâu càng ngon.",
        "slot": "để lâu",
        "cue": {
          "en": "leave it longer",
          "ko": "오래 두다"
        },
        "gloss": {
          "en": "The longer you leave this dish, the tastier it gets.",
          "ko": "이 음식은 오래 둘수록 맛있어져요."
        }
      }
    ]
  },
  {
    "id": "vi-f4-05",
    "stage": 4,
    "fn": "feedback-give",
    "pattern": "… hơi ___.",
    "core": [
      "hơi",
      "Hơi"
    ],
    "meaning": {
      "en": "Softening a criticism: … is a bit ___.",
      "ko": "비판 누그러뜨리기: …가 좀 ___해요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Giá này hơi cao so với khu này.",
        "slot": "cao",
        "cue": {
          "en": "high",
          "ko": "비싸다"
        },
        "gloss": {
          "en": "This price is a bit high for this area.",
          "ko": "이 값은 이 동네치고 좀 비싸요."
        }
      },
      {
        "text": "Bài thuyết trình hơi dài, nhưng nội dung tốt.",
        "slot": "dài",
        "cue": {
          "en": "long",
          "ko": "길다"
        },
        "gloss": {
          "en": "The presentation is a bit long, but the content is good.",
          "ko": "발표가 좀 길지만 내용은 좋아요."
        }
      },
      {
        "text": "Màu này hơi tối cho phòng khách.",
        "slot": "tối",
        "cue": {
          "en": "dark",
          "ko": "어둡다"
        },
        "gloss": {
          "en": "This colour is a bit dark for the living room.",
          "ko": "이 색은 거실에 좀 어두워요."
        }
      },
      {
        "text": "Hơi vội, nhưng em nghĩ là vẫn làm được.",
        "slot": "vội",
        "cue": {
          "en": "rushed",
          "ko": "촉박하다"
        },
        "gloss": {
          "en": "It's a bit rushed, but I think we can still do it.",
          "ko": "좀 촉박하지만 그래도 할 수 있을 것 같아요."
        }
      }
    ]
  },
  {
    "id": "vi-f4-06",
    "stage": 4,
    "fn": "concede",
    "pattern": "… khá ___, nhưng …",
    "core": [
      "khá"
    ],
    "meaning": {
      "en": "Granting a point before a but: … is quite ___, but …",
      "ko": "인정하고 반론하기: …가 꽤 ___하지만 …"
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Phòng khá đẹp, nhưng giá hơi cao.",
        "slot": "đẹp",
        "cue": {
          "en": "nice",
          "ko": "예쁘다"
        },
        "gloss": {
          "en": "The room is quite nice, but the price is a bit high.",
          "ko": "방은 꽤 예쁘지만 값이 좀 비싸요."
        }
      },
      {
        "text": "Ý tưởng này khá hay, nhưng khó làm.",
        "slot": "hay",
        "cue": {
          "en": "good, interesting",
          "ko": "좋다"
        },
        "gloss": {
          "en": "This idea is quite good, but hard to carry out.",
          "ko": "이 아이디어는 꽤 좋지만 실행하기 어려워요."
        }
      },
      {
        "text": "Công việc mới khá nhẹ, nhưng lương thấp.",
        "slot": "nhẹ",
        "cue": {
          "en": "light",
          "ko": "가볍다"
        },
        "gloss": {
          "en": "The new job is quite light, but the pay is low.",
          "ko": "새 일은 꽤 가볍지만 월급이 적어요."
        }
      },
      {
        "text": "Khách sạn khá xa trung tâm, nhưng rất yên tĩnh.",
        "slot": "xa trung tâm",
        "cue": {
          "en": "far from the centre",
          "ko": "시내에서 멀다"
        },
        "gloss": {
          "en": "The hotel is quite far from the centre, but very quiet.",
          "ko": "호텔은 시내에서 꽤 멀지만 아주 조용해요."
        }
      }
    ]
  },
  {
    "id": "vi-f4-07",
    "stage": 4,
    "fn": "report",
    "pattern": "Về ___ thì …",
    "core": [
      "Về",
      "về"
    ],
    "meaning": {
      "en": "Putting the topic first: As for ___, …",
      "ko": "화제 앞세우기: ___는요, …"
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Về ngân sách thì chúng ta cần bàn thêm.",
        "slot": "ngân sách",
        "cue": {
          "en": "budget",
          "ko": "예산"
        },
        "gloss": {
          "en": "As for the budget, we need to discuss it more.",
          "ko": "예산은 더 논의해야 해요."
        }
      },
      {
        "text": "Về phần thiết kế thì bọn em đã xong.",
        "slot": "phần thiết kế",
        "cue": {
          "en": "the design part",
          "ko": "디자인 부분"
        },
        "gloss": {
          "en": "As for the design, we've finished it.",
          "ko": "디자인 부분은 저희가 끝냈어요."
        }
      },
      {
        "text": "Về tiền cọc thì tôi sẽ chuyển khoản trước.",
        "slot": "tiền cọc",
        "cue": {
          "en": "deposit",
          "ko": "보증금"
        },
        "gloss": {
          "en": "As for the deposit, I'll transfer it in advance.",
          "ko": "보증금은 미리 이체할게요."
        }
      },
      {
        "text": "Về chuyện đi lại thì anh không cần lo.",
        "slot": "chuyện đi lại",
        "cue": {
          "en": "getting around",
          "ko": "이동 문제"
        },
        "gloss": {
          "en": "As for getting around, you don't need to worry.",
          "ko": "이동 문제는 걱정 안 하셔도 돼요."
        }
      }
    ]
  },
  {
    "id": "vi-f4-08",
    "stage": 4,
    "fn": "concede",
    "pattern": "Tuy nhiên, ___.",
    "core": [
      "Tuy nhiên",
      "tuy nhiên"
    ],
    "meaning": {
      "en": "Formal contrast: However, ___.",
      "ko": "격식 있게 반대 잇기: 그러나 ___."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Tuy nhiên, chúng ta chưa có đủ dữ liệu.",
        "slot": "chúng ta chưa có đủ dữ liệu",
        "cue": {
          "en": "we don't have enough data yet",
          "ko": "아직 데이터가 충분하지 않다"
        },
        "gloss": {
          "en": "However, we don't have enough data yet.",
          "ko": "그러나 아직 데이터가 충분하지 않아요."
        }
      },
      {
        "text": "Tuy nhiên, phòng bên cạnh rẻ hơn nhiều.",
        "slot": "phòng bên cạnh rẻ hơn nhiều",
        "cue": {
          "en": "the room next door is much cheaper",
          "ko": "옆방이 훨씬 싸다"
        },
        "gloss": {
          "en": "However, the room next door is much cheaper.",
          "ko": "하지만 옆방이 훨씬 싸요."
        }
      },
      {
        "text": "Kết quả khá tốt. Tuy nhiên, chi phí vẫn còn cao.",
        "slot": "chi phí vẫn còn cao",
        "cue": {
          "en": "costs are still high",
          "ko": "비용이 아직 높다"
        },
        "gloss": {
          "en": "The results are fairly good. However, costs are still high.",
          "ko": "결과는 꽤 좋아요. 그러나 비용은 아직 높아요."
        }
      },
      {
        "text": "Tuy nhiên, khách hàng muốn nhận hàng sớm hơn.",
        "slot": "khách hàng muốn nhận hàng sớm hơn",
        "cue": {
          "en": "the client wants delivery sooner",
          "ko": "고객이 물건을 더 빨리 받고 싶어 하다"
        },
        "gloss": {
          "en": "However, the client wants the goods sooner.",
          "ko": "그런데 고객은 물건을 더 빨리 받고 싶어 해요."
        }
      }
    ]
  },
  {
    "id": "vi-f4-09",
    "stage": 4,
    "fn": "explain-process",
    "pattern": "Ngoài ra, ___.",
    "core": [
      "Ngoài ra",
      "ngoài ra"
    ],
    "meaning": {
      "en": "Adding another point: In addition, ___.",
      "ko": "덧붙이기: 그 밖에 ___."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Ngoài ra, anh sửa vòi nước giúp tôi nhé.",
        "slot": "anh sửa vòi nước giúp tôi nhé",
        "cue": {
          "en": "please fix the tap for me",
          "ko": "수도꼭지를 고쳐 주다"
        },
        "gloss": {
          "en": "Also, please fix the tap for me.",
          "ko": "그리고 수도꼭지도 좀 고쳐 주세요."
        }
      },
      {
        "text": "Ngoài ra, chúng ta cần thêm một người phiên dịch.",
        "slot": "chúng ta cần thêm một người phiên dịch",
        "cue": {
          "en": "we need one more interpreter",
          "ko": "통역사가 한 명 더 필요하다"
        },
        "gloss": {
          "en": "In addition, we need one more interpreter.",
          "ko": "그 밖에 통역사가 한 명 더 필요해요."
        }
      },
      {
        "text": "Ngoài ra, phần âm nhạc rất cảm động.",
        "slot": "phần âm nhạc rất cảm động",
        "cue": {
          "en": "the music was very moving",
          "ko": "음악 부분이 아주 감동적이다"
        },
        "gloss": {
          "en": "Besides that, the music was very moving.",
          "ko": "그 밖에 음악 부분이 아주 감동적이었어요."
        }
      },
      {
        "text": "Khách sạn gần biển. Ngoài ra, giá phòng đã bao gồm bữa sáng.",
        "slot": "giá phòng đã bao gồm bữa sáng",
        "cue": {
          "en": "the price includes breakfast",
          "ko": "방값에 아침이 포함되다"
        },
        "gloss": {
          "en": "The hotel is near the sea. In addition, the price includes breakfast.",
          "ko": "호텔은 바다 근처예요. 게다가 방값에 아침이 포함돼 있어요."
        }
      }
    ]
  },
  {
    "id": "vi-f4-10",
    "stage": 4,
    "fn": "persuade",
    "pattern": "Nói thẳng ra là ___.",
    "core": [
      "Nói thẳng ra",
      "nói thẳng ra"
    ],
    "meaning": {
      "en": "Saying it plainly: To be frank, ___.",
      "ko": "솔직하게 말하기: 대놓고 말하면 ___."
    },
    "grammar": [],
    "expressions": [
      "nói thẳng ra"
    ],
    "examples": [
      {
        "text": "Nói thẳng ra là mình ủng hộ.",
        "slot": "mình ủng hộ",
        "cue": {
          "en": "I support it",
          "ko": "찬성하다"
        },
        "gloss": {
          "en": "Frankly, I'm for it.",
          "ko": "대놓고 말하면 난 찬성이야."
        }
      },
      {
        "text": "Nói thẳng ra là kế hoạch này không khả thi.",
        "slot": "kế hoạch này không khả thi",
        "cue": {
          "en": "this plan isn't feasible",
          "ko": "이 계획은 실현하기 어렵다"
        },
        "gloss": {
          "en": "To be frank, this plan isn't feasible.",
          "ko": "솔직히 말하면 이 계획은 실현이 어려워요."
        }
      },
      {
        "text": "Nói thẳng ra, tôi không thích cách làm này.",
        "slot": "tôi không thích cách làm này",
        "cue": {
          "en": "I don't like this way of doing it",
          "ko": "이 방식이 마음에 안 든다"
        },
        "gloss": {
          "en": "To put it bluntly, I don't like this approach.",
          "ko": "대놓고 말하면 이 방식이 마음에 안 들어요."
        }
      },
      {
        "text": "Nói thẳng ra là chúng ta đang thiếu người.",
        "slot": "chúng ta đang thiếu người",
        "cue": {
          "en": "we are short of people",
          "ko": "사람이 모자라다"
        },
        "gloss": {
          "en": "Frankly, we're short of people.",
          "ko": "솔직히 말하면 우리는 사람이 모자라요."
        }
      }
    ]
  },
  {
    "id": "vi-f4-11",
    "stage": 4,
    "fn": "persuade",
    "pattern": "Điều quan trọng là ___.",
    "core": [
      "Điều quan trọng là",
      "điều quan trọng là"
    ],
    "meaning": {
      "en": "Pointing to what matters most: The important thing is ___.",
      "ko": "핵심 짚기: 중요한 건 ___예요."
    },
    "grammar": [],
    "expressions": [
      "điều quan trọng là"
    ],
    "examples": [
      {
        "text": "Điều quan trọng là không khí sạch.",
        "slot": "không khí sạch",
        "cue": {
          "en": "clean air",
          "ko": "깨끗한 공기"
        },
        "gloss": {
          "en": "What matters is clean air.",
          "ko": "중요한 건 깨끗한 공기예요."
        }
      },
      {
        "text": "Điều quan trọng là khách hàng hài lòng.",
        "slot": "khách hàng hài lòng",
        "cue": {
          "en": "the customer is satisfied",
          "ko": "고객이 만족하다"
        },
        "gloss": {
          "en": "The important thing is that the customer is satisfied.",
          "ko": "중요한 건 고객이 만족하는 거예요."
        }
      },
      {
        "text": "Giá không cao, nhưng điều quan trọng là chất lượng.",
        "slot": "chất lượng",
        "cue": {
          "en": "quality",
          "ko": "품질"
        },
        "gloss": {
          "en": "The price isn't high, but what matters is quality.",
          "ko": "값은 안 비싸지만 중요한 건 품질이에요."
        }
      },
      {
        "text": "Điều quan trọng là mọi người hiểu rõ mục tiêu.",
        "slot": "mọi người hiểu rõ mục tiêu",
        "cue": {
          "en": "everyone clearly understands the goal",
          "ko": "모두가 목표를 분명히 알다"
        },
        "gloss": {
          "en": "The key thing is that everyone clearly understands the goal.",
          "ko": "중요한 건 모두가 목표를 분명히 아는 거예요."
        }
      }
    ]
  },
  {
    "id": "vi-f4-12",
    "stage": 4,
    "fn": "nuance-soften",
    "pattern": "Tôi e là ___.",
    "core": [
      "e là"
    ],
    "meaning": {
      "en": "Breaking unwelcome news gently: I'm afraid ___.",
      "ko": "아쉬운 말을 부드럽게: 아무래도 ___인 것 같아요."
    },
    "grammar": [],
    "expressions": [
      "tôi e là"
    ],
    "examples": [
      {
        "text": "Tôi e là giá vẫn hơi cao.",
        "slot": "giá vẫn hơi cao",
        "cue": {
          "en": "the price is still a bit high",
          "ko": "값이 아직 좀 비싸다"
        },
        "gloss": {
          "en": "I'm afraid the price is still a bit high.",
          "ko": "아무래도 값이 아직 좀 비싼 것 같아요."
        }
      },
      {
        "text": "Tôi e là chúng ta không kịp hạn chót.",
        "slot": "chúng ta không kịp hạn chót",
        "cue": {
          "en": "we won't make the deadline",
          "ko": "마감에 못 맞추다"
        },
        "gloss": {
          "en": "I'm afraid we won't make the deadline.",
          "ko": "아무래도 마감에 못 맞출 것 같아요."
        }
      },
      {
        "text": "Tôi e là anh ấy đã về rồi.",
        "slot": "anh ấy đã về rồi",
        "cue": {
          "en": "he has already gone home",
          "ko": "그가 벌써 집에 갔다"
        },
        "gloss": {
          "en": "I'm afraid he has already gone home.",
          "ko": "아무래도 그는 벌써 집에 간 것 같아요."
        }
      },
      {
        "text": "Tôi e là phòng này không còn trống.",
        "slot": "phòng này không còn trống",
        "cue": {
          "en": "this room is no longer free",
          "ko": "이 방은 더 이상 비어 있지 않다"
        },
        "gloss": {
          "en": "I'm afraid this room is no longer available.",
          "ko": "아무래도 이 방은 이제 비어 있지 않은 것 같아요."
        }
      }
    ]
  },
  {
    "id": "vi-f4-13",
    "stage": 4,
    "fn": "pros-cons",
    "pattern": "Mặt khác, ___.",
    "core": [
      "Mặt khác",
      "mặt khác"
    ],
    "meaning": {
      "en": "Giving the other side: On the other hand, ___.",
      "ko": "다른 면 말하기: 한편 ___."
    },
    "grammar": [
      6
    ],
    "expressions": [
      "mặt khác"
    ],
    "examples": [
      {
        "text": "Mặt khác, thành phố sẽ phải đầu tư thêm xe buýt.",
        "slot": "thành phố sẽ phải đầu tư thêm xe buýt",
        "cue": {
          "en": "the city will have to invest in more buses",
          "ko": "시가 버스에 더 투자해야 하다"
        },
        "gloss": {
          "en": "On the other hand, the city will have to invest in more buses.",
          "ko": "한편 시는 버스에 더 투자해야 할 거예요."
        }
      },
      {
        "text": "Lương cao. Mặt khác, công việc rất căng thẳng.",
        "slot": "công việc rất căng thẳng",
        "cue": {
          "en": "the work is very stressful",
          "ko": "일이 아주 스트레스가 많다"
        },
        "gloss": {
          "en": "The pay is high. On the other hand, the work is very stressful.",
          "ko": "월급은 높아요. 한편 일이 아주 스트레스가 많아요."
        }
      },
      {
        "text": "Mặt khác, sống ở ngoại ô thì yên tĩnh hơn.",
        "slot": "sống ở ngoại ô thì yên tĩnh hơn",
        "cue": {
          "en": "living in the suburbs is quieter",
          "ko": "교외에 사는 게 더 조용하다"
        },
        "gloss": {
          "en": "On the other hand, living in the suburbs is quieter.",
          "ko": "한편 교외에 사는 건 더 조용해요."
        }
      },
      {
        "text": "Mặt khác, học trực tuyến giúp tiết kiệm thời gian.",
        "slot": "học trực tuyến giúp tiết kiệm thời gian",
        "cue": {
          "en": "studying online saves time",
          "ko": "온라인 공부가 시간을 아껴 주다"
        },
        "gloss": {
          "en": "On the other hand, studying online saves time.",
          "ko": "한편 온라인으로 공부하면 시간이 절약돼요."
        }
      }
    ]
  },
  {
    "id": "vi-f4-14",
    "stage": 4,
    "fn": "concede",
    "pattern": "Tôi đồng ý một phần, nhưng ___.",
    "core": [
      "đồng ý một phần"
    ],
    "meaning": {
      "en": "Agreeing only partly: I partly agree, but ___.",
      "ko": "일부만 인정하기: 어느 정도는 동의하지만 ___."
    },
    "grammar": [],
    "expressions": [
      "đồng ý một phần"
    ],
    "examples": [
      {
        "text": "Mình đồng ý một phần, nhưng nên làm từng bước.",
        "slot": "nên làm từng bước",
        "cue": {
          "en": "should do it step by step",
          "ko": "단계적으로 해야 하다"
        },
        "gloss": {
          "en": "I partly agree, but we should do it step by step.",
          "ko": "어느 정도는 동의하지만 단계적으로 해야 해."
        }
      },
      {
        "text": "Tôi đồng ý một phần, nhưng chi phí quá lớn.",
        "slot": "chi phí quá lớn",
        "cue": {
          "en": "the cost is too big",
          "ko": "비용이 너무 크다"
        },
        "gloss": {
          "en": "I partly agree, but the cost is too big.",
          "ko": "어느 정도는 동의하지만 비용이 너무 커요."
        }
      },
      {
        "text": "Em đồng ý một phần, nhưng khách hàng chưa chắc sẽ thích.",
        "slot": "khách hàng chưa chắc sẽ thích",
        "cue": {
          "en": "the client may not like it",
          "ko": "고객이 좋아할지 모르다"
        },
        "gloss": {
          "en": "I partly agree, but the client may not like it.",
          "ko": "어느 정도는 동의하지만 고객이 좋아할지는 모르겠어요."
        }
      },
      {
        "text": "Tôi chỉ đồng ý một phần, nhưng vẫn ủng hộ anh.",
        "slot": "vẫn ủng hộ anh",
        "cue": {
          "en": "still support you",
          "ko": "그래도 당신을 지지하다"
        },
        "gloss": {
          "en": "I only partly agree, but I still support you.",
          "ko": "일부만 동의하지만 그래도 당신을 지지해요."
        }
      }
    ]
  },
  {
    "id": "vi-f4-15",
    "stage": 4,
    "fn": "report",
    "pattern": "Chốt lại là ___.",
    "core": [
      "Chốt lại",
      "chốt lại"
    ],
    "meaning": {
      "en": "Wrapping up a decision: To sum up what we've agreed, ___.",
      "ko": "결정 정리하기: 정리하면 ___예요."
    },
    "grammar": [],
    "expressions": [
      "chốt lại"
    ],
    "examples": [
      {
        "text": "Chốt lại là chúng ta thuê thêm hai người.",
        "slot": "chúng ta thuê thêm hai người",
        "cue": {
          "en": "we hire two more people",
          "ko": "두 명을 더 뽑다"
        },
        "gloss": {
          "en": "So it's settled: we hire two more people.",
          "ko": "정리하면 두 명을 더 뽑는 거예요."
        }
      },
      {
        "text": "Chốt lại là thứ sáu nộp báo cáo.",
        "slot": "thứ sáu nộp báo cáo",
        "cue": {
          "en": "hand in the report on Friday",
          "ko": "금요일에 보고서를 내다"
        },
        "gloss": {
          "en": "To wrap up: the report is due on Friday.",
          "ko": "정리하면 금요일에 보고서를 내요."
        }
      },
      {
        "text": "Vậy chốt lại là mình gặp nhau ở quán cũ nhé.",
        "slot": "mình gặp nhau ở quán cũ",
        "cue": {
          "en": "we meet at the usual café",
          "ko": "늘 가던 카페에서 만나다"
        },
        "gloss": {
          "en": "So it's settled, we meet at the usual café.",
          "ko": "그럼 정리하면 늘 가던 카페에서 만나는 거야."
        }
      },
      {
        "text": "Chốt lại là ngân sách giữ nguyên.",
        "slot": "ngân sách giữ nguyên",
        "cue": {
          "en": "the budget stays the same",
          "ko": "예산은 그대로다"
        },
        "gloss": {
          "en": "Final decision: the budget stays the same.",
          "ko": "정리하면 예산은 그대로예요."
        }
      }
    ]
  },
  {
    "id": "vi-f4-16",
    "stage": 4,
    "fn": "opinion",
    "pattern": "Tóm lại là ___.",
    "core": [
      "Tóm lại",
      "tóm lại"
    ],
    "meaning": {
      "en": "Summing up your view: In short, ___.",
      "ko": "내 생각 요약하기: 요컨대 ___."
    },
    "grammar": [],
    "expressions": [
      "tóm lại"
    ],
    "examples": [
      {
        "text": "Tóm lại là phim hơi dài, nhưng đáng xem.",
        "slot": "phim hơi dài, nhưng đáng xem",
        "cue": {
          "en": "the film is a bit long but worth watching",
          "ko": "영화가 좀 길지만 볼 만하다"
        },
        "gloss": {
          "en": "In short, the film is a bit long but worth watching.",
          "ko": "요컨대 영화가 좀 길지만 볼 만해요."
        }
      },
      {
        "text": "Tóm lại là dự án đang đúng tiến độ.",
        "slot": "dự án đang đúng tiến độ",
        "cue": {
          "en": "the project is on schedule",
          "ko": "프로젝트가 일정대로 가고 있다"
        },
        "gloss": {
          "en": "In short, the project is on schedule.",
          "ko": "요약하면 프로젝트는 일정대로 가고 있어요."
        }
      },
      {
        "text": "Tóm lại, chúng ta cần thêm thời gian.",
        "slot": "chúng ta cần thêm thời gian",
        "cue": {
          "en": "we need more time",
          "ko": "시간이 더 필요하다"
        },
        "gloss": {
          "en": "In short, we need more time.",
          "ko": "요컨대 우리는 시간이 더 필요해요."
        }
      },
      {
        "text": "Tóm lại là mình rất thích chuyến đi này.",
        "slot": "mình rất thích chuyến đi này",
        "cue": {
          "en": "I really liked this trip",
          "ko": "이번 여행이 아주 좋았다"
        },
        "gloss": {
          "en": "All in all, I really liked this trip.",
          "ko": "결국 이번 여행이 정말 좋았어."
        }
      }
    ]
  },
  {
    "id": "vi-f4-17",
    "stage": 4,
    "fn": "negotiate",
    "pattern": "___ giảm được không?",
    "core": [
      "giảm được không"
    ],
    "meaning": {
      "en": "Asking for a discount: Can you lower ___?",
      "ko": "깎아 달라고 하기: ___ 좀 깎아 줄 수 있어요?"
    },
    "grammar": [],
    "expressions": [
      "giảm được không"
    ],
    "examples": [
      {
        "text": "Giá phòng này giảm được không?",
        "slot": "Giá phòng này",
        "cue": {
          "en": "the price of this room",
          "ko": "이 방값"
        },
        "gloss": {
          "en": "Can you lower the price of this room?",
          "ko": "이 방값 좀 깎아 줄 수 있어요?"
        }
      },
      {
        "text": "Phí giao hàng giảm được không?",
        "slot": "Phí giao hàng",
        "cue": {
          "en": "delivery fee",
          "ko": "배송비"
        },
        "gloss": {
          "en": "Can the delivery fee come down?",
          "ko": "배송비 좀 깎아 줄 수 있어요?"
        }
      },
      {
        "text": "Tiền đặt cọc giảm được không?",
        "slot": "Tiền đặt cọc",
        "cue": {
          "en": "deposit",
          "ko": "보증금"
        },
        "gloss": {
          "en": "Can the deposit be reduced?",
          "ko": "보증금 좀 줄일 수 있어요?"
        }
      },
      {
        "text": "Chị ơi, cái áo này giảm được không?",
        "slot": "cái áo này",
        "cue": {
          "en": "this shirt",
          "ko": "이 옷"
        },
        "gloss": {
          "en": "Excuse me, can you take something off this shirt?",
          "ko": "저기요, 이 옷 좀 깎아 줄 수 있어요?"
        }
      }
    ]
  },
  {
    "id": "vi-f4-18",
    "stage": 4,
    "fn": "negotiate",
    "pattern": "Nếu được thì ___.",
    "core": [
      "Nếu được thì",
      "nếu được thì"
    ],
    "meaning": {
      "en": "Proposing politely: If possible, ___.",
      "ko": "조심스럽게 제안하기: 괜찮다면 ___."
    },
    "grammar": [],
    "expressions": [
      "nếu được thì"
    ],
    "examples": [
      {
        "text": "Nếu được thì tôi muốn ký hợp đồng hai năm.",
        "slot": "tôi muốn ký hợp đồng hai năm",
        "cue": {
          "en": "I'd like to sign a two-year contract",
          "ko": "이 년 계약을 하고 싶다"
        },
        "gloss": {
          "en": "If possible, I'd like to sign a two-year contract.",
          "ko": "괜찮다면 이 년 계약을 하고 싶어요."
        }
      },
      {
        "text": "Nếu được thì anh gửi lại tệp cho em nhé.",
        "slot": "anh gửi lại tệp cho em nhé",
        "cue": {
          "en": "please send me the file again",
          "ko": "파일을 다시 보내 주다"
        },
        "gloss": {
          "en": "If you can, please send me the file again.",
          "ko": "괜찮으시면 파일을 다시 보내 주세요."
        }
      },
      {
        "text": "Nếu được thì mình dời cuộc họp sang buổi chiều.",
        "slot": "mình dời cuộc họp sang buổi chiều",
        "cue": {
          "en": "we move the meeting to the afternoon",
          "ko": "회의를 오후로 미루다"
        },
        "gloss": {
          "en": "If possible, let's move the meeting to the afternoon.",
          "ko": "괜찮다면 회의를 오후로 옮기자."
        }
      },
      {
        "text": "Nếu được thì cho tôi phòng gần thang máy.",
        "slot": "cho tôi phòng gần thang máy",
        "cue": {
          "en": "give me a room near the lift",
          "ko": "엘리베이터 가까운 방을 주다"
        },
        "gloss": {
          "en": "If possible, give me a room near the lift.",
          "ko": "가능하면 엘리베이터 가까운 방으로 주세요."
        }
      }
    ]
  },
  {
    "id": "vi-f4-19",
    "stage": 4,
    "fn": "formal-request",
    "pattern": "Để em xác nhận lại ___.",
    "core": [
      "xác nhận lại"
    ],
    "meaning": {
      "en": "Offering to double-check at work: Let me confirm ___ again.",
      "ko": "업무로 다시 확인하기: ___ 다시 확인해 볼게요."
    },
    "grammar": [],
    "expressions": [
      "để em xác nhận lại"
    ],
    "examples": [
      {
        "text": "Để em xác nhận lại với đội kiểm thử.",
        "slot": "với đội kiểm thử",
        "cue": {
          "en": "with the testing team",
          "ko": "테스트 팀과"
        },
        "gloss": {
          "en": "Let me double-check with the testing team.",
          "ko": "테스트 팀과 다시 확인해 볼게요."
        }
      },
      {
        "text": "Để em xác nhận lại lịch họp ngày mai.",
        "slot": "lịch họp ngày mai",
        "cue": {
          "en": "tomorrow's meeting schedule",
          "ko": "내일 회의 일정"
        },
        "gloss": {
          "en": "Let me confirm tomorrow's meeting schedule again.",
          "ko": "내일 회의 일정을 다시 확인해 볼게요."
        }
      },
      {
        "text": "Để em xác nhận lại số lượng với kho.",
        "slot": "số lượng với kho",
        "cue": {
          "en": "the quantity with the warehouse",
          "ko": "창고와 수량"
        },
        "gloss": {
          "en": "Let me check the quantity with the warehouse again.",
          "ko": "창고와 수량을 다시 확인해 볼게요."
        }
      },
      {
        "text": "Để em xác nhận lại địa chỉ giao hàng.",
        "slot": "địa chỉ giao hàng",
        "cue": {
          "en": "the delivery address",
          "ko": "배송 주소"
        },
        "gloss": {
          "en": "Let me confirm the delivery address again.",
          "ko": "배송 주소를 다시 확인해 볼게요."
        }
      }
    ]
  },
  {
    "id": "vi-f4-20",
    "stage": 4,
    "fn": "report",
    "pattern": "… sẽ chịu trách nhiệm ___.",
    "core": [
      "chịu trách nhiệm"
    ],
    "meaning": {
      "en": "Taking ownership at work: … will be responsible for ___.",
      "ko": "책임 맡기: …가 ___을 책임질게요."
    },
    "grammar": [],
    "expressions": [
      "chịu trách nhiệm"
    ],
    "examples": [
      {
        "text": "Em sẽ chịu trách nhiệm phần kiểm thử.",
        "slot": "phần kiểm thử",
        "cue": {
          "en": "the testing part",
          "ko": "테스트 부분"
        },
        "gloss": {
          "en": "I'll be responsible for the testing.",
          "ko": "테스트 부분은 제가 책임질게요."
        }
      },
      {
        "text": "Chị Lan sẽ chịu trách nhiệm liên hệ khách hàng.",
        "slot": "liên hệ khách hàng",
        "cue": {
          "en": "contact the clients",
          "ko": "고객에게 연락하다"
        },
        "gloss": {
          "en": "Lan will be in charge of contacting the clients.",
          "ko": "란 씨가 고객 연락을 맡을 거예요."
        }
      },
      {
        "text": "Ai sẽ chịu trách nhiệm về lỗi này?",
        "slot": "về lỗi này",
        "cue": {
          "en": "for this mistake",
          "ko": "이 오류에 대해"
        },
        "gloss": {
          "en": "Who will take responsibility for this mistake?",
          "ko": "이 오류는 누가 책임질 거예요?"
        }
      },
      {
        "text": "Tôi sẽ chịu trách nhiệm toàn bộ chi phí.",
        "slot": "toàn bộ chi phí",
        "cue": {
          "en": "all the costs",
          "ko": "비용 전부"
        },
        "gloss": {
          "en": "I'll cover all the costs.",
          "ko": "비용 전부를 제가 책임질게요."
        }
      }
    ]
  },
  {
    "id": "vi-f5-01",
    "stage": 5,
    "fn": "storytelling",
    "pattern": "Chính ___ là người …",
    "core": [
      "Chính",
      "chính"
    ],
    "meaning": {
      "en": "Pointing out exactly who: It was ___ who …",
      "ko": "바로 그 사람이라고 강조하기: 바로 ___가 …한 사람이에요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Chính anh ấy là người đề xuất ý tưởng này.",
        "slot": "anh ấy",
        "cue": {
          "en": "he",
          "ko": "그"
        },
        "gloss": {
          "en": "He's the very one who proposed this idea.",
          "ko": "바로 그가 이 아이디어를 낸 사람이에요."
        }
      },
      {
        "text": "Chính chị Thu là người tìm ra lỗi.",
        "slot": "chị Thu",
        "cue": {
          "en": "Thu",
          "ko": "투 씨"
        },
        "gloss": {
          "en": "It was Thu herself who found the bug.",
          "ko": "바로 투 씨가 오류를 찾아낸 사람이에요."
        }
      },
      {
        "text": "Chính khách hàng là người muốn đổi kế hoạch.",
        "slot": "khách hàng",
        "cue": {
          "en": "the client",
          "ko": "고객"
        },
        "gloss": {
          "en": "It's the client who wanted to change the plan.",
          "ko": "계획을 바꾸자고 한 건 바로 고객이에요."
        }
      },
      {
        "text": "Chính mẹ tôi là người dạy tôi nấu ăn.",
        "slot": "mẹ tôi",
        "cue": {
          "en": "my mother",
          "ko": "우리 엄마"
        },
        "gloss": {
          "en": "It was my own mother who taught me to cook.",
          "ko": "나에게 요리를 가르쳐 준 건 바로 우리 엄마예요."
        }
      }
    ]
  },
  {
    "id": "vi-f5-02",
    "stage": 5,
    "fn": "surprise",
    "pattern": "Ngay cả ___ cũng …",
    "core": [
      "Ngay cả",
      "ngay cả"
    ],
    "meaning": {
      "en": "Stressing an unexpected case: Even ___ …",
      "ko": "뜻밖의 경우 강조하기: ___조차 …해요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Ngay cả sếp cũng bất ngờ.",
        "slot": "sếp",
        "cue": {
          "en": "the boss",
          "ko": "사장님"
        },
        "gloss": {
          "en": "Even the boss was surprised.",
          "ko": "사장님조차 놀랐어요."
        }
      },
      {
        "text": "Ngay cả trẻ con cũng biết điều đó.",
        "slot": "trẻ con",
        "cue": {
          "en": "children",
          "ko": "아이들"
        },
        "gloss": {
          "en": "Even children know that.",
          "ko": "아이들조차 그건 알아요."
        }
      },
      {
        "text": "Ngay cả người miền Nam cũng thấy anh ấy nói nhanh.",
        "slot": "người miền Nam",
        "cue": {
          "en": "southerners",
          "ko": "남부 사람"
        },
        "gloss": {
          "en": "Even southerners find he talks fast.",
          "ko": "남부 사람조차 그가 말이 빠르다고 느껴요."
        }
      },
      {
        "text": "Ngay cả cuối tuần cô ấy cũng đi làm.",
        "slot": "cuối tuần",
        "cue": {
          "en": "weekend",
          "ko": "주말"
        },
        "gloss": {
          "en": "She goes to work even at the weekend.",
          "ko": "그녀는 주말에조차 출근해요."
        }
      }
    ]
  },
  {
    "id": "vi-f5-03",
    "stage": 5,
    "fn": "storytelling",
    "pattern": "Đến cả ___ cũng …",
    "core": [
      "Đến cả",
      "đến cả"
    ],
    "meaning": {
      "en": "Stressing how far it goes: Even ___ …",
      "ko": "어디까지 미치는지 강조하기: ___까지도 …해요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Đến cả nhân vật chính cũng chưa kịp nói lời tạm biệt.",
        "slot": "nhân vật chính",
        "cue": {
          "en": "the main character",
          "ko": "주인공"
        },
        "gloss": {
          "en": "Even the main character didn't get to say goodbye.",
          "ko": "주인공까지도 작별 인사를 할 틈이 없었어요."
        }
      },
      {
        "text": "Đến cả bà tôi cũng dùng điện thoại thông minh.",
        "slot": "bà tôi",
        "cue": {
          "en": "my grandmother",
          "ko": "우리 할머니"
        },
        "gloss": {
          "en": "Even my grandmother uses a smartphone.",
          "ko": "우리 할머니까지도 스마트폰을 써요."
        }
      },
      {
        "text": "Đến cả giáo viên cũng không trả lời được câu hỏi đó.",
        "slot": "giáo viên",
        "cue": {
          "en": "the teacher",
          "ko": "선생님"
        },
        "gloss": {
          "en": "Even the teacher couldn't answer that question.",
          "ko": "선생님까지도 그 질문에 답하지 못했어요."
        }
      },
      {
        "text": "Đến cả con mèo cũng sợ tiếng sấm.",
        "slot": "con mèo",
        "cue": {
          "en": "the cat",
          "ko": "고양이"
        },
        "gloss": {
          "en": "Even the cat is scared of thunder.",
          "ko": "고양이까지도 천둥소리를 무서워해요."
        }
      }
    ]
  },
  {
    "id": "vi-f5-04",
    "stage": 5,
    "fn": "complain",
    "pattern": "… đã ___ rồi mà.",
    "core": [
      "rồi mà"
    ],
    "meaning": {
      "en": "Reminding with mild reproach: But I already ___!",
      "ko": "살짝 서운하게 일깨우기: 이미 ___했잖아요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Em đã bảo rồi mà.",
        "slot": "bảo",
        "cue": {
          "en": "tell",
          "ko": "말하다"
        },
        "gloss": {
          "en": "I told you so!",
          "ko": "내가 이미 말했잖아요."
        }
      },
      {
        "text": "Anh đã hứa rồi mà.",
        "slot": "hứa",
        "cue": {
          "en": "promise",
          "ko": "약속하다"
        },
        "gloss": {
          "en": "But you promised!",
          "ko": "이미 약속했잖아요."
        }
      },
      {
        "text": "Mình đã gửi email rồi mà.",
        "slot": "gửi email",
        "cue": {
          "en": "send an email",
          "ko": "이메일을 보내다"
        },
        "gloss": {
          "en": "But I already sent the email!",
          "ko": "이미 이메일 보냈잖아."
        }
      },
      {
        "text": "Chị đã trả tiền rồi mà.",
        "slot": "trả tiền",
        "cue": {
          "en": "pay",
          "ko": "돈을 내다"
        },
        "gloss": {
          "en": "But I've already paid!",
          "ko": "이미 돈 냈잖아요."
        }
      }
    ]
  },
  {
    "id": "vi-f5-05",
    "stage": 5,
    "fn": "agree",
    "pattern": "___ chứ!",
    "core": [
      "chứ"
    ],
    "meaning": {
      "en": "Of course, with feeling: ___, of course!",
      "ko": "당연하다는 듯 답하기: 당연히 ___죠!"
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Biết chứ ạ.",
        "slot": "Biết",
        "cue": {
          "en": "know",
          "ko": "알다"
        },
        "gloss": {
          "en": "Of course I know.",
          "ko": "당연히 알죠."
        }
      },
      {
        "text": "Em cũng tiếc lắm chứ.",
        "slot": "tiếc lắm",
        "cue": {
          "en": "feel very sorry",
          "ko": "많이 아쉽다"
        },
        "gloss": {
          "en": "Of course I'm really sorry too.",
          "ko": "저도 당연히 많이 아쉽죠."
        }
      },
      {
        "text": "Đi chứ! Mình chờ mãi rồi.",
        "slot": "Đi",
        "cue": {
          "en": "go",
          "ko": "가다"
        },
        "gloss": {
          "en": "Of course I'm going! I've been waiting ages.",
          "ko": "당연히 가지! 오래 기다렸어."
        }
      },
      {
        "text": "Nhớ chứ, sao quên được.",
        "slot": "Nhớ",
        "cue": {
          "en": "remember",
          "ko": "기억하다"
        },
        "gloss": {
          "en": "Of course I remember, how could I forget.",
          "ko": "당연히 기억하지, 어떻게 잊어."
        }
      }
    ]
  },
  {
    "id": "vi-f5-06",
    "stage": 5,
    "fn": "advice-give",
    "pattern": "… ___ đấy!",
    "core": [
      "đấy"
    ],
    "meaning": {
      "en": "Adding emphasis or a warning: … ___, you know!",
      "ko": "강조·경고 싣기: …___라고요!"
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Lần này mình không khóc đâu đấy!",
        "slot": "không khóc đâu",
        "cue": {
          "en": "not cry",
          "ko": "울지 않다"
        },
        "gloss": {
          "en": "I'm not crying this time, I'm telling you!",
          "ko": "이번엔 안 운다고!"
        }
      },
      {
        "text": "Anh ấy giỏi lắm đấy!",
        "slot": "giỏi lắm",
        "cue": {
          "en": "very good",
          "ko": "아주 잘하다"
        },
        "gloss": {
          "en": "He's really good, you know!",
          "ko": "그 사람 정말 잘한다고요!"
        }
      },
      {
        "text": "Đường trơn đấy, đi cẩn thận nhé.",
        "slot": "trơn",
        "cue": {
          "en": "slippery",
          "ko": "미끄럽다"
        },
        "gloss": {
          "en": "The road's slippery, mind how you go.",
          "ko": "길 미끄러워요, 조심해서 가요."
        }
      },
      {
        "text": "Cô ấy giận thật đấy!",
        "slot": "giận thật",
        "cue": {
          "en": "really angry",
          "ko": "정말 화나다"
        },
        "gloss": {
          "en": "She's really angry, you know!",
          "ko": "그녀 정말 화났다니까!"
        }
      }
    ]
  },
  {
    "id": "vi-f5-07",
    "stage": 5,
    "fn": "debate",
    "pattern": "Sao lại ___?",
    "core": [
      "Sao lại",
      "sao lại"
    ],
    "meaning": {
      "en": "Rhetorical why: Why on earth ___?",
      "ko": "반어로 따지기: 왜 ___해요?"
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Sao lại không nói sớm?",
        "slot": "không nói sớm",
        "cue": {
          "en": "not say earlier",
          "ko": "미리 말하지 않다"
        },
        "gloss": {
          "en": "Why on earth didn't you say so earlier?",
          "ko": "왜 미리 말 안 했어요?"
        }
      },
      {
        "text": "Sao lại trách em?",
        "slot": "trách em",
        "cue": {
          "en": "blame me",
          "ko": "나를 탓하다"
        },
        "gloss": {
          "en": "Why blame me?",
          "ko": "왜 나를 탓해요?"
        }
      },
      {
        "text": "Sao lại đổi kế hoạch vào phút cuối?",
        "slot": "đổi kế hoạch vào phút cuối",
        "cue": {
          "en": "change the plan at the last minute",
          "ko": "마지막에 계획을 바꾸다"
        },
        "gloss": {
          "en": "Why change the plan at the last minute?",
          "ko": "왜 막판에 계획을 바꿔요?"
        }
      },
      {
        "text": "Anh ấy làm tốt thế, sao lại chê?",
        "slot": "chê",
        "cue": {
          "en": "criticise",
          "ko": "흠잡다"
        },
        "gloss": {
          "en": "He did so well, why criticise him?",
          "ko": "그렇게 잘했는데 왜 흠을 잡아요?"
        }
      }
    ]
  },
  {
    "id": "vi-f5-08",
    "stage": 5,
    "fn": "disagree-soft",
    "pattern": "Có phải ___ đâu.",
    "core": [
      "Có phải",
      "có phải"
    ],
    "meaning": {
      "en": "Denying through a rhetorical question: It's not as if ___.",
      "ko": "반어로 부정하기: ___인 것도 아니잖아요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Có phải lỗi của em đâu.",
        "slot": "lỗi của em",
        "cue": {
          "en": "my fault",
          "ko": "내 잘못"
        },
        "gloss": {
          "en": "It's not my fault, is it.",
          "ko": "내 잘못도 아니잖아요."
        }
      },
      {
        "text": "Nhận rồi lại bỏ dở thì có phải giúp anh đâu.",
        "slot": "giúp anh",
        "cue": {
          "en": "help you",
          "ko": "당신을 돕다"
        },
        "gloss": {
          "en": "Taking it on and then quitting wouldn't really help you.",
          "ko": "맡았다가 중간에 그만두면 도와주는 것도 아니잖아요."
        }
      },
      {
        "text": "Có phải ai cũng giàu đâu.",
        "slot": "ai cũng giàu",
        "cue": {
          "en": "everyone is rich",
          "ko": "모두가 부자다"
        },
        "gloss": {
          "en": "It's not as if everyone is rich.",
          "ko": "모두가 부자인 것도 아니잖아요."
        }
      },
      {
        "text": "Mình có phải trẻ con đâu.",
        "slot": "trẻ con",
        "cue": {
          "en": "a child",
          "ko": "어린아이"
        },
        "gloss": {
          "en": "I'm not a child, you know.",
          "ko": "내가 어린애도 아니잖아."
        }
      }
    ]
  },
  {
    "id": "vi-f5-09",
    "stage": 5,
    "fn": "debate",
    "pattern": "Đối với ___, …",
    "core": [
      "Đối với",
      "đối với"
    ],
    "meaning": {
      "en": "Formal framing of who it concerns: For ___, …",
      "ko": "격식 있게 대상 세우기: ___에게는 …"
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Đối với doanh nghiệp nhỏ, đây là một thách thức lớn.",
        "slot": "doanh nghiệp nhỏ",
        "cue": {
          "en": "small business",
          "ko": "소기업"
        },
        "gloss": {
          "en": "For small businesses, this is a big challenge.",
          "ko": "소기업에게는 이것이 큰 도전이에요."
        }
      },
      {
        "text": "Đối với chúng tôi, anh ấy là một đồng nghiệp tận tâm.",
        "slot": "chúng tôi",
        "cue": {
          "en": "we, us",
          "ko": "우리"
        },
        "gloss": {
          "en": "To us, he is a devoted colleague.",
          "ko": "우리에게 그는 헌신적인 동료예요."
        }
      },
      {
        "text": "Đối với người học tiếng Việt, phim này rất có ích.",
        "slot": "người học tiếng Việt",
        "cue": {
          "en": "learners of Vietnamese",
          "ko": "베트남어 학습자"
        },
        "gloss": {
          "en": "For learners of Vietnamese, this film is very useful.",
          "ko": "베트남어 학습자에게 이 영화는 아주 유익해요."
        }
      },
      {
        "text": "Đối với trẻ em, ngủ đủ giấc rất quan trọng.",
        "slot": "trẻ em",
        "cue": {
          "en": "children",
          "ko": "아이들"
        },
        "gloss": {
          "en": "For children, getting enough sleep is very important.",
          "ko": "아이들에게는 충분히 자는 것이 아주 중요해요."
        }
      }
    ]
  },
  {
    "id": "vi-f5-10",
    "stage": 5,
    "fn": "debate",
    "pattern": "Trong bối cảnh ___, …",
    "core": [
      "Trong bối cảnh",
      "trong bối cảnh"
    ],
    "meaning": {
      "en": "Formal setting of context: In the context of ___, …",
      "ko": "격식 있게 배경 깔기: ___한 상황에서 …"
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Trong bối cảnh ai cũng bận rộn, tìm được người hiểu mình là điều quý.",
        "slot": "ai cũng bận rộn",
        "cue": {
          "en": "everyone is busy",
          "ko": "모두가 바쁘다"
        },
        "gloss": {
          "en": "When everyone is so busy, finding someone who understands you is precious.",
          "ko": "모두가 바쁜 상황에서 나를 이해하는 사람을 찾는 건 귀한 일이에요."
        }
      },
      {
        "text": "Trong bối cảnh kinh tế khó khăn, nhiều công ty cắt giảm chi phí.",
        "slot": "kinh tế khó khăn",
        "cue": {
          "en": "a difficult economy",
          "ko": "경제가 어렵다"
        },
        "gloss": {
          "en": "In a difficult economy, many companies cut costs.",
          "ko": "경제가 어려운 상황에서 많은 회사가 비용을 줄여요."
        }
      },
      {
        "text": "Trong bối cảnh giá nhà tăng, người trẻ khó mua nhà.",
        "slot": "giá nhà tăng",
        "cue": {
          "en": "house prices rise",
          "ko": "집값이 오르다"
        },
        "gloss": {
          "en": "With house prices rising, young people struggle to buy a home.",
          "ko": "집값이 오르는 상황에서 젊은이들은 집 사기가 어려워요."
        }
      },
      {
        "text": "Trong bối cảnh hiện nay, làm việc từ xa ngày càng phổ biến.",
        "slot": "hiện nay",
        "cue": {
          "en": "the present",
          "ko": "지금"
        },
        "gloss": {
          "en": "In the current context, remote work is increasingly common.",
          "ko": "지금 같은 상황에서 원격 근무가 점점 흔해져요."
        }
      }
    ]
  },
  {
    "id": "vi-f5-11",
    "stage": 5,
    "fn": "explain-process",
    "pattern": "… nhằm ___.",
    "core": [
      "nhằm"
    ],
    "meaning": {
      "en": "Formal statement of aim: … aimed at ___.",
      "ko": "격식 있게 목적 말하기: ___하기 위해(～를 목표로) …"
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Chương trình này nhằm hỗ trợ doanh nghiệp nhỏ.",
        "slot": "hỗ trợ doanh nghiệp nhỏ",
        "cue": {
          "en": "support small businesses",
          "ko": "소기업을 지원하다"
        },
        "gloss": {
          "en": "This programme aims to support small businesses.",
          "ko": "이 프로그램은 소기업 지원을 목표로 해요."
        }
      },
      {
        "text": "Thành phố cấm xe máy cuối tuần nhằm giảm ô nhiễm.",
        "slot": "giảm ô nhiễm",
        "cue": {
          "en": "reduce pollution",
          "ko": "오염을 줄이다"
        },
        "gloss": {
          "en": "The city bans motorbikes at weekends to reduce pollution.",
          "ko": "시는 오염을 줄이기 위해 주말에 오토바이를 금지해요."
        }
      },
      {
        "text": "Công ty tổ chức hội thảo nhằm giới thiệu sản phẩm mới.",
        "slot": "giới thiệu sản phẩm mới",
        "cue": {
          "en": "introduce a new product",
          "ko": "신제품을 소개하다"
        },
        "gloss": {
          "en": "The company is holding a seminar to introduce its new product.",
          "ko": "회사는 신제품을 소개하기 위해 세미나를 열어요."
        }
      },
      {
        "text": "Chính sách mới nhằm thu hút người tài.",
        "slot": "thu hút người tài",
        "cue": {
          "en": "attract talent",
          "ko": "인재를 끌어들이다"
        },
        "gloss": {
          "en": "The new policy aims to attract talented people.",
          "ko": "새 정책은 인재 유치를 목표로 해요."
        }
      }
    ]
  },
  {
    "id": "vi-f5-12",
    "stage": 5,
    "fn": "tact-refuse",
    "pattern": "Không phải là ___, nhưng …",
    "core": [
      "Không phải là",
      "không phải là"
    ],
    "meaning": {
      "en": "Refusing or criticising with tact: It's not that ___, but …",
      "ko": "눈치 있게 거절·비판하기: ___인 건 아니지만 …"
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Không phải là em không muốn, nhưng thời gian không cho phép.",
        "slot": "em không muốn",
        "cue": {
          "en": "I don't want to",
          "ko": "내가 원하지 않다"
        },
        "gloss": {
          "en": "It's not that I don't want to, but time doesn't allow it.",
          "ko": "원하지 않는 건 아니지만 시간이 허락하지 않아요."
        }
      },
      {
        "text": "Không phải là mình không thích giọng miền Nam, nhưng hơi khó nghe.",
        "slot": "mình không thích giọng miền Nam",
        "cue": {
          "en": "I don't like the southern accent",
          "ko": "남부 말투를 싫어하다"
        },
        "gloss": {
          "en": "It's not that I dislike the southern accent, but it's a bit hard to follow.",
          "ko": "남부 말투가 싫은 건 아니지만 좀 알아듣기 어려워."
        }
      },
      {
        "text": "Không phải là ý tưởng tồi, nhưng chi phí quá cao.",
        "slot": "ý tưởng tồi",
        "cue": {
          "en": "a bad idea",
          "ko": "나쁜 아이디어"
        },
        "gloss": {
          "en": "It's not a bad idea, but the cost is too high.",
          "ko": "나쁜 아이디어는 아니지만 비용이 너무 높아요."
        }
      },
      {
        "text": "Không phải là tôi chê, nhưng món này hơi mặn.",
        "slot": "tôi chê",
        "cue": {
          "en": "I'm criticising",
          "ko": "내가 흠잡다"
        },
        "gloss": {
          "en": "I'm not criticising, but this dish is a bit salty.",
          "ko": "흠잡는 건 아니지만 이 음식은 좀 짜요."
        }
      }
    ]
  },
  {
    "id": "vi-f5-13",
    "stage": 5,
    "fn": "nuance-soften",
    "pattern": "___ nhè nhẹ thôi.",
    "core": [
      "nhè nhẹ"
    ],
    "meaning": {
      "en": "Softening with a doubled word: ___ gently, just a little.",
      "ko": "겹말로 부드럽게: 살살 ___하세요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "Trang điểm nhè nhẹ thôi nhé.",
        "slot": "Trang điểm",
        "cue": {
          "en": "put on make-up",
          "ko": "화장하다"
        },
        "gloss": {
          "en": "Just keep the make-up light.",
          "ko": "화장은 살짝만 해."
        }
      },
      {
        "text": "Nói nhè nhẹ thôi, em bé đang ngủ.",
        "slot": "Nói",
        "cue": {
          "en": "speak",
          "ko": "말하다"
        },
        "gloss": {
          "en": "Speak softly, the baby is sleeping.",
          "ko": "살살 말해요, 아기가 자고 있어요."
        }
      },
      {
        "text": "Anh gõ cửa nhè nhẹ thôi.",
        "slot": "gõ cửa",
        "cue": {
          "en": "knock on the door",
          "ko": "노크하다"
        },
        "gloss": {
          "en": "Knock gently on the door.",
          "ko": "문을 살살 두드려요."
        }
      },
      {
        "text": "Gió thổi nhè nhẹ, rất dễ chịu.",
        "slot": "Gió thổi",
        "cue": {
          "en": "the wind blows",
          "ko": "바람이 불다"
        },
        "gloss": {
          "en": "A light breeze is blowing, very pleasant.",
          "ko": "바람이 살랑살랑 불어서 아주 기분 좋아요."
        }
      }
    ]
  },
  {
    "id": "vi-f5-14",
    "stage": 5,
    "fn": "nuance-soften",
    "pattern": "Nói thật lòng, ___.",
    "core": [
      "Nói thật lòng",
      "nói thật lòng"
    ],
    "meaning": {
      "en": "Opening up sincerely: To be honest with you, ___.",
      "ko": "진심을 꺼내기: 솔직한 마음으로는 ___."
    },
    "grammar": [],
    "expressions": [
      "nói thật lòng"
    ],
    "examples": [
      {
        "text": "Nói thật lòng, em cũng rất muốn.",
        "slot": "em cũng rất muốn",
        "cue": {
          "en": "I really want to as well",
          "ko": "나도 정말 하고 싶다"
        },
        "gloss": {
          "en": "Honestly, I really want to as well.",
          "ko": "솔직히 저도 정말 하고 싶어요."
        }
      },
      {
        "text": "Nói thật lòng, tôi chưa sẵn sàng.",
        "slot": "tôi chưa sẵn sàng",
        "cue": {
          "en": "I'm not ready yet",
          "ko": "아직 준비가 안 되다"
        },
        "gloss": {
          "en": "To be honest, I'm not ready yet.",
          "ko": "솔직히 아직 준비가 안 됐어요."
        }
      },
      {
        "text": "Nói thật lòng, bài hát này làm mình nhớ nhà.",
        "slot": "bài hát này làm mình nhớ nhà",
        "cue": {
          "en": "this song makes me homesick",
          "ko": "이 노래가 집을 그립게 하다"
        },
        "gloss": {
          "en": "Honestly, this song makes me homesick.",
          "ko": "솔직히 이 노래를 들으면 집이 그리워져."
        }
      },
      {
        "text": "Nói thật lòng, anh ấy đã giúp tôi rất nhiều.",
        "slot": "anh ấy đã giúp tôi rất nhiều",
        "cue": {
          "en": "he has helped me a lot",
          "ko": "그가 나를 많이 도와주었다"
        },
        "gloss": {
          "en": "Truly, he has helped me a great deal.",
          "ko": "진심으로 그는 나를 많이 도와줬어요."
        }
      }
    ]
  },
  {
    "id": "vi-f5-15",
    "stage": 5,
    "fn": "concession",
    "pattern": "Biết là thế, nhưng ___.",
    "core": [
      "Biết là",
      "biết là"
    ],
    "meaning": {
      "en": "Granting it yet holding your view: I know, but ___.",
      "ko": "알면서도 내 생각 지키기: 그건 알지만 ___."
    },
    "grammar": [],
    "expressions": [
      "biết là thế"
    ],
    "examples": [
      {
        "text": "Biết là thế, nhưng mình vẫn buồn.",
        "slot": "mình vẫn buồn",
        "cue": {
          "en": "I'm still sad",
          "ko": "그래도 슬프다"
        },
        "gloss": {
          "en": "I know, but I'm still sad.",
          "ko": "그건 알지만 그래도 슬퍼."
        }
      },
      {
        "text": "Em biết là thế, nhưng vẫn muốn thử.",
        "slot": "vẫn muốn thử",
        "cue": {
          "en": "still want to try",
          "ko": "그래도 해 보고 싶다"
        },
        "gloss": {
          "en": "I know that, but I still want to try.",
          "ko": "그건 알지만 그래도 해 보고 싶어요."
        }
      },
      {
        "text": "Biết là vậy, nhưng mình vẫn muốn thêm vài phút nữa.",
        "slot": "mình vẫn muốn thêm vài phút nữa",
        "cue": {
          "en": "I still want a few more minutes",
          "ko": "그래도 몇 분 더 원하다"
        },
        "gloss": {
          "en": "I know, but I still wanted a few more minutes.",
          "ko": "알긴 하지만 그래도 몇 분 더 있었으면 좋겠어."
        }
      },
      {
        "text": "Biết là khó, nhưng chúng ta phải làm.",
        "slot": "chúng ta phải làm",
        "cue": {
          "en": "we have to do it",
          "ko": "우리가 해야 하다"
        },
        "gloss": {
          "en": "I know it's hard, but we have to do it.",
          "ko": "어려운 건 알지만 우리가 해야 해요."
        }
      }
    ]
  },
  {
    "id": "vi-f5-16",
    "stage": 5,
    "fn": "concession",
    "pattern": "Nói gì thì nói, ___.",
    "core": [
      "Nói gì thì nói",
      "nói gì thì nói"
    ],
    "meaning": {
      "en": "Whatever anyone says: Be that as it may, ___.",
      "ko": "뭐라 해도 하고 싶은 말: 뭐니 뭐니 해도 ___."
    },
    "grammar": [],
    "expressions": [
      "nói gì thì nói"
    ],
    "examples": [
      {
        "text": "Nói gì thì nói, mình vẫn thấy cái kết hơi vội.",
        "slot": "mình vẫn thấy cái kết hơi vội",
        "cue": {
          "en": "I still think the ending is a bit rushed",
          "ko": "그래도 결말이 좀 급하다고 느끼다"
        },
        "gloss": {
          "en": "Be that as it may, I still think the ending is a bit rushed.",
          "ko": "뭐라 해도 난 결말이 좀 급했다고 봐."
        }
      },
      {
        "text": "Nói gì thì nói, anh ấy vẫn là bạn tốt.",
        "slot": "anh ấy vẫn là bạn tốt",
        "cue": {
          "en": "he's still a good friend",
          "ko": "그는 여전히 좋은 친구다"
        },
        "gloss": {
          "en": "Whatever you say, he's still a good friend.",
          "ko": "뭐니 뭐니 해도 그는 좋은 친구예요."
        }
      },
      {
        "text": "Nói gì thì nói, sức khỏe là quan trọng nhất.",
        "slot": "sức khỏe là quan trọng nhất",
        "cue": {
          "en": "health matters most",
          "ko": "건강이 제일 중요하다"
        },
        "gloss": {
          "en": "When all is said and done, health matters most.",
          "ko": "뭐니 뭐니 해도 건강이 제일이에요."
        }
      },
      {
        "text": "Nói gì thì nói, chúng ta đã cố gắng hết sức.",
        "slot": "chúng ta đã cố gắng hết sức",
        "cue": {
          "en": "we did our best",
          "ko": "우리는 최선을 다했다"
        },
        "gloss": {
          "en": "Whatever people say, we did our best.",
          "ko": "뭐라 해도 우리는 최선을 다했어요."
        }
      }
    ]
  },
  {
    "id": "vi-f5-17",
    "stage": 5,
    "fn": "compliment",
    "pattern": "… nhưng được cái là ___.",
    "core": [
      "được cái là",
      "Được cái là"
    ],
    "meaning": {
      "en": "Finding the redeeming point: … but the good thing is ___.",
      "ko": "좋은 점 찾아 주기: …지만 그래도 ___라는 점은 좋아요."
    },
    "grammar": [],
    "expressions": [
      "được cái là"
    ],
    "examples": [
      {
        "text": "Chị Thu hiền, nhưng được cái là rất biết cách thuyết phục.",
        "slot": "rất biết cách thuyết phục",
        "cue": {
          "en": "really know how to persuade",
          "ko": "설득하는 법을 잘 알다"
        },
        "gloss": {
          "en": "Thu is gentle, but the good thing is she really knows how to persuade.",
          "ko": "투 씨는 순하지만 설득하는 법을 잘 안다는 게 장점이에요."
        }
      },
      {
        "text": "Phòng hơi nhỏ, nhưng được cái là gần chợ.",
        "slot": "gần chợ",
        "cue": {
          "en": "close to the market",
          "ko": "시장에서 가깝다"
        },
        "gloss": {
          "en": "The room is a bit small, but at least it's close to the market.",
          "ko": "방은 좀 작지만 시장이 가깝다는 게 좋아요."
        }
      },
      {
        "text": "Quán này đông, được cái là phục vụ nhanh.",
        "slot": "phục vụ nhanh",
        "cue": {
          "en": "fast service",
          "ko": "서비스가 빠르다"
        },
        "gloss": {
          "en": "This place is crowded, but the service is fast.",
          "ko": "이 가게는 붐비지만 서빙이 빠르다는 게 좋아요."
        }
      },
      {
        "text": "Được cái là anh ấy rất đúng giờ.",
        "slot": "anh ấy rất đúng giờ",
        "cue": {
          "en": "he's very punctual",
          "ko": "그는 시간을 아주 잘 지킨다"
        },
        "gloss": {
          "en": "One good thing is that he's very punctual.",
          "ko": "그래도 그는 시간을 잘 지킨다는 장점이 있어요."
        }
      }
    ]
  },
  {
    "id": "vi-f5-18",
    "stage": 5,
    "fn": "formal-humble",
    "pattern": "Xin phép được ___.",
    "core": [
      "Xin phép được",
      "xin phép được"
    ],
    "meaning": {
      "en": "Humbly asking leave to speak or act: Allow me to ___.",
      "ko": "겸손하게 나서기: ___하도록 하겠습니다."
    },
    "grammar": [],
    "expressions": [
      "xin phép được"
    ],
    "examples": [
      {
        "text": "Xin phép được thay mặt cả phòng gửi lời chúc mừng.",
        "slot": "thay mặt cả phòng gửi lời chúc mừng",
        "cue": {
          "en": "congratulate on behalf of the team",
          "ko": "팀을 대표해 축하하다"
        },
        "gloss": {
          "en": "Allow me to offer congratulations on behalf of the whole team.",
          "ko": "팀 모두를 대표해 축하 인사를 드리겠습니다."
        }
      },
      {
        "text": "Xin phép được nói vài lời.",
        "slot": "nói vài lời",
        "cue": {
          "en": "say a few words",
          "ko": "몇 마디 하다"
        },
        "gloss": {
          "en": "Allow me to say a few words.",
          "ko": "몇 말씀 드리겠습니다."
        }
      },
      {
        "text": "Tôi xin phép được về sớm hôm nay.",
        "slot": "về sớm hôm nay",
        "cue": {
          "en": "leave early today",
          "ko": "오늘 일찍 가다"
        },
        "gloss": {
          "en": "May I be excused to leave early today?",
          "ko": "오늘은 먼저 들어가 보겠습니다."
        }
      },
      {
        "text": "Xin phép được giới thiệu khách mời của chúng ta.",
        "slot": "giới thiệu khách mời của chúng ta",
        "cue": {
          "en": "introduce our guest",
          "ko": "우리 손님을 소개하다"
        },
        "gloss": {
          "en": "Allow me to introduce our guest.",
          "ko": "오늘의 손님을 소개해 드리겠습니다."
        }
      }
    ]
  },
  {
    "id": "vi-f5-19",
    "stage": 5,
    "fn": "formal-humble",
    "pattern": "Thay mặt ___, tôi xin …",
    "core": [
      "Thay mặt",
      "thay mặt"
    ],
    "meaning": {
      "en": "Speaking for a group: On behalf of ___, I …",
      "ko": "대표해서 말하기: ___를 대표해 …드립니다."
    },
    "grammar": [],
    "expressions": [
      "thay mặt"
    ],
    "examples": [
      {
        "text": "Thay mặt công ty, tôi xin cảm ơn quý khách.",
        "slot": "công ty",
        "cue": {
          "en": "the company",
          "ko": "회사"
        },
        "gloss": {
          "en": "On behalf of the company, I thank our customers.",
          "ko": "회사를 대표해 고객 여러분께 감사드립니다."
        }
      },
      {
        "text": "Thay mặt gia đình, tôi xin chào đón mọi người.",
        "slot": "gia đình",
        "cue": {
          "en": "the family",
          "ko": "가족"
        },
        "gloss": {
          "en": "On behalf of the family, I welcome everyone.",
          "ko": "가족을 대표해 여러분을 환영합니다."
        }
      },
      {
        "text": "Thay mặt cả lớp, em xin cảm ơn cô.",
        "slot": "cả lớp",
        "cue": {
          "en": "the whole class",
          "ko": "반 전체"
        },
        "gloss": {
          "en": "On behalf of the whole class, thank you, teacher.",
          "ko": "반 모두를 대표해 선생님께 감사드려요."
        }
      },
      {
        "text": "Tôi xin phép thay mặt ban tổ chức phát biểu.",
        "slot": "ban tổ chức",
        "cue": {
          "en": "the organising committee",
          "ko": "주최 측"
        },
        "gloss": {
          "en": "Allow me to speak on behalf of the organisers.",
          "ko": "주최 측을 대표해 한 말씀 드리겠습니다."
        }
      }
    ]
  }
];
