import type { Frame } from "../frames.ts";

/** 베트남어 1~3단계 틀(curriculum/frames.ts) — 기능 id(fn)는 curriculum/functions.ts. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
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
  }
];
