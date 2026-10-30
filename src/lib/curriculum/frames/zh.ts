import type { Frame } from "../frames.ts";

/** 중국어 1~5단계 틀(curriculum/frames.ts) — 기능 id(fn)는 curriculum/functions.ts. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
export const ZH_FRAMES: Frame[] = [
  {
    "id": "zh-f1-01",
    "stage": 1,
    "fn": "greet",
    "pattern": "___好！",
    "core": [
      "好"
    ],
    "meaning": {
      "en": "Greeting someone: Hello, ___!",
      "ko": "인사하기: ___ 안녕하세요!"
    },
    "grammar": [],
    "expressions": [
      "你好",
      "早上好"
    ],
    "examples": [
      {
        "text": "你好！",
        "slot": "你",
        "cue": {
          "en": "you",
          "ko": "너"
        },
        "gloss": {
          "en": "Hello!",
          "ko": "안녕하세요!"
        }
      },
      {
        "text": "早上好！",
        "slot": "早上",
        "cue": {
          "en": "morning",
          "ko": "아침"
        },
        "gloss": {
          "en": "Good morning!",
          "ko": "좋은 아침이에요!"
        }
      },
      {
        "text": "大家好！",
        "slot": "大家",
        "cue": {
          "en": "everyone",
          "ko": "여러분"
        },
        "gloss": {
          "en": "Hello, everyone!",
          "ko": "여러분, 안녕하세요!"
        }
      },
      {
        "text": "老师好！",
        "slot": "老师",
        "cue": {
          "en": "teacher",
          "ko": "선생님"
        },
        "gloss": {
          "en": "Hello, teacher!",
          "ko": "선생님, 안녕하세요!"
        }
      }
    ]
  },
  {
    "id": "zh-f1-02",
    "stage": 1,
    "fn": "introduce",
    "pattern": "我是___。",
    "core": [
      "我是"
    ],
    "meaning": {
      "en": "Saying who or what you are: I'm ___.",
      "ko": "나를 소개하기: 저는 ___예요."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "我是韩国人"
    ],
    "examples": [
      {
        "text": "我是智宇。",
        "slot": "智宇",
        "cue": {
          "en": "Ji-woo (your name)",
          "ko": "지우(내 이름)"
        },
        "gloss": {
          "en": "I'm Ji-woo.",
          "ko": "저는 지우예요."
        }
      },
      {
        "text": "我是学生。",
        "slot": "学生",
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
        "text": "我是韩国人。",
        "slot": "韩国人",
        "cue": {
          "en": "Korean (person)",
          "ko": "한국 사람"
        },
        "gloss": {
          "en": "I'm Korean.",
          "ko": "저는 한국 사람이에요."
        }
      },
      {
        "text": "我是老师。",
        "slot": "老师",
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
    "id": "zh-f1-03",
    "stage": 1,
    "fn": "origin",
    "pattern": "我从___来。",
    "core": [
      "我从",
      "来"
    ],
    "meaning": {
      "en": "Saying where you're from: I come from ___.",
      "ko": "어디서 왔는지 말하기: ___에서 왔어요."
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "我从韩国来。",
        "slot": "韩国",
        "cue": {
          "en": "Korea",
          "ko": "한국"
        },
        "gloss": {
          "en": "I come from Korea.",
          "ko": "한국에서 왔어요."
        }
      },
      {
        "text": "我从首尔来。",
        "slot": "首尔",
        "cue": {
          "en": "Seoul",
          "ko": "서울"
        },
        "gloss": {
          "en": "I come from Seoul.",
          "ko": "서울에서 왔어요."
        }
      },
      {
        "text": "我从美国来。",
        "slot": "美国",
        "cue": {
          "en": "the US",
          "ko": "미국"
        },
        "gloss": {
          "en": "I come from the US.",
          "ko": "미국에서 왔어요."
        }
      },
      {
        "text": "我从釜山来。",
        "slot": "釜山",
        "cue": {
          "en": "Busan",
          "ko": "부산"
        },
        "gloss": {
          "en": "I come from Busan.",
          "ko": "부산에서 왔어요."
        }
      }
    ]
  },
  {
    "id": "zh-f1-04",
    "stage": 1,
    "fn": "yes-no",
    "pattern": "你是___吗？",
    "core": [
      "你是",
      "吗"
    ],
    "meaning": {
      "en": "Asking a yes/no question: Are you ___?",
      "ko": "예/아니요로 묻기: ___예요?"
    },
    "grammar": [
      0,
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "你是学生吗？",
        "slot": "学生",
        "cue": {
          "en": "student",
          "ko": "학생"
        },
        "gloss": {
          "en": "Are you a student?",
          "ko": "학생이에요?"
        }
      },
      {
        "text": "你是老师吗？",
        "slot": "老师",
        "cue": {
          "en": "teacher",
          "ko": "선생님"
        },
        "gloss": {
          "en": "Are you a teacher?",
          "ko": "선생님이세요?"
        }
      },
      {
        "text": "你是中国人吗？",
        "slot": "中国人",
        "cue": {
          "en": "Chinese (person)",
          "ko": "중국 사람"
        },
        "gloss": {
          "en": "Are you Chinese?",
          "ko": "중국 사람이에요?"
        }
      },
      {
        "text": "你是新同学吗？",
        "slot": "新同学",
        "cue": {
          "en": "new classmate",
          "ko": "새 반 친구"
        },
        "gloss": {
          "en": "Are you a new classmate?",
          "ko": "새로 온 반 친구예요?"
        }
      }
    ]
  },
  {
    "id": "zh-f1-05",
    "stage": 1,
    "fn": "yes-no",
    "pattern": "我不是___。",
    "core": [
      "我不是"
    ],
    "meaning": {
      "en": "Saying no: I'm not ___.",
      "ko": "아니라고 말하기: 저는 ___가 아니에요."
    },
    "grammar": [
      0,
      2
    ],
    "expressions": [
      "不是"
    ],
    "examples": [
      {
        "text": "我不是老师。",
        "slot": "老师",
        "cue": {
          "en": "teacher",
          "ko": "선생님"
        },
        "gloss": {
          "en": "I'm not a teacher.",
          "ko": "저는 선생님이 아니에요."
        }
      },
      {
        "text": "我不是日本人。",
        "slot": "日本人",
        "cue": {
          "en": "Japanese (person)",
          "ko": "일본 사람"
        },
        "gloss": {
          "en": "I'm not Japanese.",
          "ko": "저는 일본 사람이 아니에요."
        }
      },
      {
        "text": "我不是学生。",
        "slot": "学生",
        "cue": {
          "en": "student",
          "ko": "학생"
        },
        "gloss": {
          "en": "I'm not a student.",
          "ko": "저는 학생이 아니에요."
        }
      },
      {
        "text": "我不是中国人。",
        "slot": "中国人",
        "cue": {
          "en": "Chinese (person)",
          "ko": "중국 사람"
        },
        "gloss": {
          "en": "I'm not Chinese.",
          "ko": "저는 중국 사람이 아니에요."
        }
      }
    ]
  },
  {
    "id": "zh-f1-06",
    "stage": 1,
    "fn": "ask-what",
    "pattern": "___是什么？",
    "core": [
      "是什么"
    ],
    "meaning": {
      "en": "Asking what something is: What is ___?",
      "ko": "무엇인지 묻기: ___는 뭐예요?"
    },
    "grammar": [
      0,
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "这个是什么？",
        "slot": "这个",
        "cue": {
          "en": "this",
          "ko": "이것"
        },
        "gloss": {
          "en": "What is this?",
          "ko": "이건 뭐예요?"
        }
      },
      {
        "text": "那个是什么？",
        "slot": "那个",
        "cue": {
          "en": "that",
          "ko": "저것"
        },
        "gloss": {
          "en": "What is that?",
          "ko": "저건 뭐예요?"
        }
      },
      {
        "text": "这个菜是什么？",
        "slot": "这个菜",
        "cue": {
          "en": "this dish",
          "ko": "이 요리"
        },
        "gloss": {
          "en": "What is this dish?",
          "ko": "이 요리는 뭐예요?"
        }
      },
      {
        "text": "这个字是什么？",
        "slot": "这个字",
        "cue": {
          "en": "this character",
          "ko": "이 글자"
        },
        "gloss": {
          "en": "What is this character?",
          "ko": "이 글자는 뭐예요?"
        }
      }
    ]
  },
  {
    "id": "zh-f1-07",
    "stage": 1,
    "fn": "ask-what",
    "pattern": "___是谁？",
    "core": [
      "是谁"
    ],
    "meaning": {
      "en": "Asking who someone is: Who is ___?",
      "ko": "누구인지 묻기: ___는 누구예요?"
    },
    "grammar": [
      0,
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "他是谁？",
        "slot": "他",
        "cue": {
          "en": "he",
          "ko": "그 남자"
        },
        "gloss": {
          "en": "Who is he?",
          "ko": "그 사람은 누구예요?"
        }
      },
      {
        "text": "她是谁？",
        "slot": "她",
        "cue": {
          "en": "she",
          "ko": "그 여자"
        },
        "gloss": {
          "en": "Who is she?",
          "ko": "그 여자는 누구예요?"
        }
      },
      {
        "text": "那个人是谁？",
        "slot": "那个人",
        "cue": {
          "en": "that person",
          "ko": "저 사람"
        },
        "gloss": {
          "en": "Who is that person?",
          "ko": "저 사람은 누구예요?"
        }
      },
      {
        "text": "你的老师是谁？",
        "slot": "你的老师",
        "cue": {
          "en": "your teacher",
          "ko": "네 선생님"
        },
        "gloss": {
          "en": "Who is your teacher?",
          "ko": "너희 선생님은 누구야?"
        }
      }
    ]
  },
  {
    "id": "zh-f1-08",
    "stage": 1,
    "fn": "ask-where",
    "pattern": "___在哪儿？",
    "core": [
      "在哪儿"
    ],
    "meaning": {
      "en": "Asking where something is: Where is ___?",
      "ko": "어디 있는지 묻기: ___는 어디 있어요?"
    },
    "grammar": [
      3
    ],
    "expressions": [
      "洗手间在哪儿"
    ],
    "examples": [
      {
        "text": "洗手间在哪儿？",
        "slot": "洗手间",
        "cue": {
          "en": "restroom",
          "ko": "화장실"
        },
        "gloss": {
          "en": "Where is the restroom?",
          "ko": "화장실은 어디 있어요?"
        }
      },
      {
        "text": "地铁站在哪儿？",
        "slot": "地铁站",
        "cue": {
          "en": "subway station",
          "ko": "지하철역"
        },
        "gloss": {
          "en": "Where is the subway station?",
          "ko": "지하철역은 어디 있어요?"
        }
      },
      {
        "text": "电梯在哪儿？",
        "slot": "电梯",
        "cue": {
          "en": "elevator",
          "ko": "엘리베이터"
        },
        "gloss": {
          "en": "Where is the elevator?",
          "ko": "엘리베이터는 어디 있어요?"
        }
      },
      {
        "text": "出口在哪儿？",
        "slot": "出口",
        "cue": {
          "en": "exit",
          "ko": "출구"
        },
        "gloss": {
          "en": "Where is the exit?",
          "ko": "출구는 어디 있어요?"
        }
      }
    ]
  },
  {
    "id": "zh-f1-09",
    "stage": 1,
    "fn": "ask-price",
    "pattern": "___多少钱？",
    "core": [
      "多少钱"
    ],
    "meaning": {
      "en": "Asking the price: How much is ___?",
      "ko": "값 묻기: ___ 얼마예요?"
    },
    "grammar": [
      4
    ],
    "expressions": [
      "多少钱"
    ],
    "examples": [
      {
        "text": "这个多少钱？",
        "slot": "这个",
        "cue": {
          "en": "this one",
          "ko": "이거"
        },
        "gloss": {
          "en": "How much is this one?",
          "ko": "이거 얼마예요?"
        }
      },
      {
        "text": "那个多少钱？",
        "slot": "那个",
        "cue": {
          "en": "that one",
          "ko": "저거"
        },
        "gloss": {
          "en": "How much is that one?",
          "ko": "저거 얼마예요?"
        }
      },
      {
        "text": "这个西瓜多少钱？",
        "slot": "这个西瓜",
        "cue": {
          "en": "this watermelon",
          "ko": "이 수박"
        },
        "gloss": {
          "en": "How much is this watermelon?",
          "ko": "이 수박 얼마예요?"
        }
      },
      {
        "text": "一斤苹果多少钱？",
        "slot": "一斤苹果",
        "cue": {
          "en": "half a kilo of apples",
          "ko": "사과 한 근"
        },
        "gloss": {
          "en": "How much for half a kilo of apples?",
          "ko": "사과 한 근에 얼마예요?"
        }
      }
    ]
  },
  {
    "id": "zh-f1-10",
    "stage": 1,
    "fn": "ask-have",
    "pattern": "这儿有___吗？",
    "core": [
      "这儿有",
      "吗"
    ],
    "meaning": {
      "en": "Asking if there is something here: Is there a ___ here?",
      "ko": "있는지 묻기: 여기 ___ 있어요?"
    },
    "grammar": [
      1,
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "这儿有洗手间吗？",
        "slot": "洗手间",
        "cue": {
          "en": "restroom",
          "ko": "화장실"
        },
        "gloss": {
          "en": "Is there a restroom here?",
          "ko": "여기 화장실 있어요?"
        }
      },
      {
        "text": "这儿有咖啡店吗？",
        "slot": "咖啡店",
        "cue": {
          "en": "café",
          "ko": "카페"
        },
        "gloss": {
          "en": "Is there a café here?",
          "ko": "여기 카페 있어요?"
        }
      },
      {
        "text": "这儿有地铁站吗？",
        "slot": "地铁站",
        "cue": {
          "en": "subway station",
          "ko": "지하철역"
        },
        "gloss": {
          "en": "Is there a subway station here?",
          "ko": "여기 지하철역 있어요?"
        }
      },
      {
        "text": "这儿有银行吗？",
        "slot": "银行",
        "cue": {
          "en": "bank",
          "ko": "은행"
        },
        "gloss": {
          "en": "Is there a bank here?",
          "ko": "여기 은행 있어요?"
        }
      }
    ]
  },
  {
    "id": "zh-f1-11",
    "stage": 1,
    "fn": "have",
    "pattern": "我没有___。",
    "core": [
      "我没有"
    ],
    "meaning": {
      "en": "Saying what you don't have: I don't have ___.",
      "ko": "없는 것 말하기: 저는 ___가 없어요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "我没有笔。",
        "slot": "笔",
        "cue": {
          "en": "pen",
          "ko": "펜"
        },
        "gloss": {
          "en": "I don't have a pen.",
          "ko": "저는 펜이 없어요."
        }
      },
      {
        "text": "我没有零钱。",
        "slot": "零钱",
        "cue": {
          "en": "small change",
          "ko": "잔돈"
        },
        "gloss": {
          "en": "I don't have any change.",
          "ko": "저는 잔돈이 없어요."
        }
      },
      {
        "text": "我没有现金。",
        "slot": "现金",
        "cue": {
          "en": "cash",
          "ko": "현금"
        },
        "gloss": {
          "en": "I don't have cash.",
          "ko": "저는 현금이 없어요."
        }
      },
      {
        "text": "我没有时间。",
        "slot": "时间",
        "cue": {
          "en": "time",
          "ko": "시간"
        },
        "gloss": {
          "en": "I don't have time.",
          "ko": "저는 시간이 없어요."
        }
      }
    ]
  },
  {
    "id": "zh-f1-12",
    "stage": 1,
    "fn": "request-thing",
    "pattern": "我要___。",
    "core": [
      "我要"
    ],
    "meaning": {
      "en": "Asking for something: I'd like ___.",
      "ko": "달라고 하기: ___ 주세요."
    },
    "grammar": [
      4
    ],
    "expressions": [
      "我要这个"
    ],
    "examples": [
      {
        "text": "我要这个。",
        "slot": "这个",
        "cue": {
          "en": "this one",
          "ko": "이거"
        },
        "gloss": {
          "en": "I'd like this one.",
          "ko": "이거 주세요."
        }
      },
      {
        "text": "我要那个。",
        "slot": "那个",
        "cue": {
          "en": "that one",
          "ko": "저거"
        },
        "gloss": {
          "en": "I'd like that one.",
          "ko": "저거 주세요."
        }
      },
      {
        "text": "我要两个苹果。",
        "slot": "两个苹果",
        "cue": {
          "en": "two apples",
          "ko": "사과 두 개"
        },
        "gloss": {
          "en": "I'd like two apples.",
          "ko": "사과 두 개 주세요."
        }
      },
      {
        "text": "我要一杯水。",
        "slot": "一杯水",
        "cue": {
          "en": "a glass of water",
          "ko": "물 한 잔"
        },
        "gloss": {
          "en": "I'd like a glass of water.",
          "ko": "물 한 잔 주세요."
        }
      }
    ]
  },
  {
    "id": "zh-f1-13",
    "stage": 1,
    "fn": "request-action",
    "pattern": "请___。",
    "core": [
      "请"
    ],
    "meaning": {
      "en": "Asking someone politely to do something: Please ___.",
      "ko": "해 달라고 부탁하기: ___ 주세요."
    },
    "grammar": [],
    "expressions": [
      "请再说一遍"
    ],
    "examples": [
      {
        "text": "请再说一遍。",
        "slot": "再说一遍",
        "cue": {
          "en": "say it again",
          "ko": "다시 말하다"
        },
        "gloss": {
          "en": "Please say it again.",
          "ko": "다시 한번 말해 주세요."
        }
      },
      {
        "text": "请等一下。",
        "slot": "等一下",
        "cue": {
          "en": "wait a moment",
          "ko": "잠깐 기다리다"
        },
        "gloss": {
          "en": "Please wait a moment.",
          "ko": "잠깐만 기다려 주세요."
        }
      },
      {
        "text": "请坐。",
        "slot": "坐",
        "cue": {
          "en": "sit down",
          "ko": "앉다"
        },
        "gloss": {
          "en": "Please sit down.",
          "ko": "앉으세요."
        }
      },
      {
        "text": "请进。",
        "slot": "进",
        "cue": {
          "en": "come in",
          "ko": "들어오다"
        },
        "gloss": {
          "en": "Please come in.",
          "ko": "들어오세요."
        }
      }
    ]
  },
  {
    "id": "zh-f1-14",
    "stage": 1,
    "fn": "like",
    "pattern": "___很好吃。",
    "core": [
      "很好吃"
    ],
    "meaning": {
      "en": "Saying something tastes good: ___ is delicious.",
      "ko": "맛있다고 말하기: ___ 정말 맛있어요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "这个很好吃。",
        "slot": "这个",
        "cue": {
          "en": "this",
          "ko": "이거"
        },
        "gloss": {
          "en": "This is delicious.",
          "ko": "이거 정말 맛있어요."
        }
      },
      {
        "text": "苹果很好吃。",
        "slot": "苹果",
        "cue": {
          "en": "apple",
          "ko": "사과"
        },
        "gloss": {
          "en": "The apples are delicious.",
          "ko": "사과가 정말 맛있어요."
        }
      },
      {
        "text": "芒果很好吃。",
        "slot": "芒果",
        "cue": {
          "en": "mango",
          "ko": "망고"
        },
        "gloss": {
          "en": "The mango is delicious.",
          "ko": "망고가 정말 맛있어요."
        }
      },
      {
        "text": "这儿的面很好吃。",
        "slot": "这儿的面",
        "cue": {
          "en": "the noodles here",
          "ko": "여기 국수"
        },
        "gloss": {
          "en": "The noodles here are delicious.",
          "ko": "여기 국수 정말 맛있어요."
        }
      }
    ]
  },
  {
    "id": "zh-f1-15",
    "stage": 1,
    "fn": "like",
    "pattern": "我喜欢___。",
    "core": [
      "我喜欢"
    ],
    "meaning": {
      "en": "Saying what you like: I like ___.",
      "ko": "좋아하는 것 말하기: 저는 ___를 좋아해요."
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "我喜欢苹果。",
        "slot": "苹果",
        "cue": {
          "en": "apples",
          "ko": "사과"
        },
        "gloss": {
          "en": "I like apples.",
          "ko": "저는 사과를 좋아해요."
        }
      },
      {
        "text": "我喜欢喝茶。",
        "slot": "喝茶",
        "cue": {
          "en": "drinking tea",
          "ko": "차 마시기"
        },
        "gloss": {
          "en": "I like drinking tea.",
          "ko": "저는 차 마시는 걸 좋아해요."
        }
      },
      {
        "text": "我喜欢中国菜。",
        "slot": "中国菜",
        "cue": {
          "en": "Chinese food",
          "ko": "중국 음식"
        },
        "gloss": {
          "en": "I like Chinese food.",
          "ko": "저는 중국 음식을 좋아해요."
        }
      },
      {
        "text": "我喜欢音乐。",
        "slot": "音乐",
        "cue": {
          "en": "music",
          "ko": "음악"
        },
        "gloss": {
          "en": "I like music.",
          "ko": "저는 음악을 좋아해요."
        }
      }
    ]
  },
  {
    "id": "zh-f1-16",
    "stage": 1,
    "fn": "dislike",
    "pattern": "我不喜欢___。",
    "core": [
      "我不喜欢"
    ],
    "meaning": {
      "en": "Saying what you don't like: I don't like ___.",
      "ko": "싫어하는 것 말하기: 저는 ___를 안 좋아해요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "我不喜欢咖啡。",
        "slot": "咖啡",
        "cue": {
          "en": "coffee",
          "ko": "커피"
        },
        "gloss": {
          "en": "I don't like coffee.",
          "ko": "저는 커피를 안 좋아해요."
        }
      },
      {
        "text": "我不喜欢下雨。",
        "slot": "下雨",
        "cue": {
          "en": "rain",
          "ko": "비 오는 것"
        },
        "gloss": {
          "en": "I don't like rain.",
          "ko": "저는 비 오는 걸 안 좋아해요."
        }
      },
      {
        "text": "我不喜欢吃辣的。",
        "slot": "吃辣的",
        "cue": {
          "en": "eating spicy food",
          "ko": "매운 것 먹기"
        },
        "gloss": {
          "en": "I don't like eating spicy food.",
          "ko": "저는 매운 걸 안 좋아해요."
        }
      },
      {
        "text": "我不喜欢这个颜色。",
        "slot": "这个颜色",
        "cue": {
          "en": "this colour",
          "ko": "이 색"
        },
        "gloss": {
          "en": "I don't like this colour.",
          "ko": "저는 이 색이 별로예요."
        }
      }
    ]
  },
  {
    "id": "zh-f1-17",
    "stage": 1,
    "fn": "not-understand",
    "pattern": "我听不懂___。",
    "core": [
      "听不懂"
    ],
    "meaning": {
      "en": "Saying you don't understand what you hear: I don't understand ___.",
      "ko": "못 알아듣는다고 말하기: ___를 못 알아들어요."
    },
    "grammar": [],
    "expressions": [
      "我听不懂"
    ],
    "examples": [
      {
        "text": "我听不懂上海话。",
        "slot": "上海话",
        "cue": {
          "en": "Shanghainese",
          "ko": "상하이 말"
        },
        "gloss": {
          "en": "I don't understand Shanghainese.",
          "ko": "상하이 말은 못 알아들어요."
        }
      },
      {
        "text": "我听不懂这个词。",
        "slot": "这个词",
        "cue": {
          "en": "this word",
          "ko": "이 단어"
        },
        "gloss": {
          "en": "I don't understand this word.",
          "ko": "이 단어를 못 알아들어요."
        }
      },
      {
        "text": "我听不懂英语。",
        "slot": "英语",
        "cue": {
          "en": "English",
          "ko": "영어"
        },
        "gloss": {
          "en": "I don't understand English.",
          "ko": "영어는 못 알아들어요."
        }
      },
      {
        "text": "我听不懂广东话。",
        "slot": "广东话",
        "cue": {
          "en": "Cantonese",
          "ko": "광둥어"
        },
        "gloss": {
          "en": "I don't understand Cantonese.",
          "ko": "광둥어는 못 알아들어요."
        }
      }
    ]
  },
  {
    "id": "zh-f1-18",
    "stage": 1,
    "fn": "possession",
    "pattern": "这是___的。",
    "core": [
      "这是",
      "的"
    ],
    "meaning": {
      "en": "Saying whose something is: This is ___'s.",
      "ko": "누구 것인지 말하기: 이건 ___ 거예요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "这是我的。",
        "slot": "我",
        "cue": {
          "en": "me",
          "ko": "나"
        },
        "gloss": {
          "en": "This is mine.",
          "ko": "이건 제 거예요."
        }
      },
      {
        "text": "这是你的。",
        "slot": "你",
        "cue": {
          "en": "you",
          "ko": "너"
        },
        "gloss": {
          "en": "This is yours.",
          "ko": "이건 네 거야."
        }
      },
      {
        "text": "这是老师的。",
        "slot": "老师",
        "cue": {
          "en": "the teacher",
          "ko": "선생님"
        },
        "gloss": {
          "en": "This is the teacher's.",
          "ko": "이건 선생님 거예요."
        }
      },
      {
        "text": "这是我朋友的。",
        "slot": "我朋友",
        "cue": {
          "en": "my friend",
          "ko": "내 친구"
        },
        "gloss": {
          "en": "This is my friend's.",
          "ko": "이건 제 친구 거예요."
        }
      }
    ]
  },
  {
    "id": "zh-f1-19",
    "stage": 1,
    "fn": "location-now",
    "pattern": "我在___。",
    "core": [
      "我在"
    ],
    "meaning": {
      "en": "Saying where you are now: I'm at ___.",
      "ko": "지금 있는 곳 말하기: 저는 ___에 있어요."
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "我在学校。",
        "slot": "学校",
        "cue": {
          "en": "school",
          "ko": "학교"
        },
        "gloss": {
          "en": "I'm at school.",
          "ko": "저는 학교에 있어요."
        }
      },
      {
        "text": "我在家。",
        "slot": "家",
        "cue": {
          "en": "home",
          "ko": "집"
        },
        "gloss": {
          "en": "I'm at home.",
          "ko": "저는 집에 있어요."
        }
      },
      {
        "text": "我在商场。",
        "slot": "商场",
        "cue": {
          "en": "the mall",
          "ko": "쇼핑몰"
        },
        "gloss": {
          "en": "I'm at the mall.",
          "ko": "저는 쇼핑몰에 있어요."
        }
      },
      {
        "text": "我在门口。",
        "slot": "门口",
        "cue": {
          "en": "the entrance",
          "ko": "입구"
        },
        "gloss": {
          "en": "I'm at the entrance.",
          "ko": "저는 입구에 있어요."
        }
      }
    ]
  },
  {
    "id": "zh-f1-20",
    "stage": 1,
    "fn": "greet",
    "pattern": "___见。",
    "core": [
      "见"
    ],
    "meaning": {
      "en": "Saying goodbye until a time: See you ___.",
      "ko": "헤어질 때 인사하기: ___ 봐요."
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "明天见。",
        "slot": "明天",
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
        "text": "下午见。",
        "slot": "下午",
        "cue": {
          "en": "this afternoon",
          "ko": "오후"
        },
        "gloss": {
          "en": "See you this afternoon.",
          "ko": "오후에 봐요."
        }
      },
      {
        "text": "周末见。",
        "slot": "周末",
        "cue": {
          "en": "at the weekend",
          "ko": "주말"
        },
        "gloss": {
          "en": "See you at the weekend.",
          "ko": "주말에 봐요."
        }
      },
      {
        "text": "一会儿见。",
        "slot": "一会儿",
        "cue": {
          "en": "in a bit",
          "ko": "조금 이따"
        },
        "gloss": {
          "en": "See you in a bit.",
          "ko": "이따 봐요."
        }
      }
    ]
  },
  {
    "id": "zh-f2-01",
    "stage": 2,
    "fn": "past-did",
    "pattern": "我昨天去了___。",
    "core": [
      "去了"
    ],
    "meaning": {
      "en": "Saying where you went: Yesterday I went to ___.",
      "ko": "한 일 말하기: 어제 ___에 갔어요."
    },
    "grammar": [
      0,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "我昨天去了超市。",
        "slot": "超市",
        "cue": {
          "en": "the supermarket",
          "ko": "슈퍼마켓"
        },
        "gloss": {
          "en": "Yesterday I went to the supermarket.",
          "ko": "어제 슈퍼마켓에 갔어요."
        }
      },
      {
        "text": "我昨天去了公园。",
        "slot": "公园",
        "cue": {
          "en": "the park",
          "ko": "공원"
        },
        "gloss": {
          "en": "Yesterday I went to the park.",
          "ko": "어제 공원에 갔어요."
        }
      },
      {
        "text": "我昨天去了博物馆。",
        "slot": "博物馆",
        "cue": {
          "en": "the museum",
          "ko": "박물관"
        },
        "gloss": {
          "en": "Yesterday I went to the museum.",
          "ko": "어제 박물관에 갔어요."
        }
      },
      {
        "text": "我昨天去了医院。",
        "slot": "医院",
        "cue": {
          "en": "the hospital",
          "ko": "병원"
        },
        "gloss": {
          "en": "Yesterday I went to the hospital.",
          "ko": "어제 병원에 갔어요."
        }
      }
    ]
  },
  {
    "id": "zh-f2-02",
    "stage": 2,
    "fn": "past-did",
    "pattern": "我已经___了。",
    "core": [
      "已经"
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
        "text": "我已经吃饭了。",
        "slot": "吃饭",
        "cue": {
          "en": "eat",
          "ko": "밥 먹다"
        },
        "gloss": {
          "en": "I've already eaten.",
          "ko": "벌써 밥 먹었어요."
        }
      },
      {
        "text": "我已经到家了。",
        "slot": "到家",
        "cue": {
          "en": "get home",
          "ko": "집에 도착하다"
        },
        "gloss": {
          "en": "I've already got home.",
          "ko": "벌써 집에 왔어요."
        }
      },
      {
        "text": "我已经买票了。",
        "slot": "买票",
        "cue": {
          "en": "buy the tickets",
          "ko": "표를 사다"
        },
        "gloss": {
          "en": "I've already bought the tickets.",
          "ko": "벌써 표 샀어요."
        }
      },
      {
        "text": "我已经下班了。",
        "slot": "下班",
        "cue": {
          "en": "finish work",
          "ko": "퇴근하다"
        },
        "gloss": {
          "en": "I've already finished work.",
          "ko": "벌써 퇴근했어요."
        }
      }
    ]
  },
  {
    "id": "zh-f2-03",
    "stage": 2,
    "fn": "want",
    "pattern": "我想去___。",
    "core": [
      "我想去"
    ],
    "meaning": {
      "en": "Saying where or what you want to go do: I want to go to ___.",
      "ko": "원하는 것 말하기: ___에 가고 싶어요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "我想去上海。",
        "slot": "上海",
        "cue": {
          "en": "Shanghai",
          "ko": "상하이"
        },
        "gloss": {
          "en": "I want to go to Shanghai.",
          "ko": "상하이에 가고 싶어요."
        }
      },
      {
        "text": "我想去长城。",
        "slot": "长城",
        "cue": {
          "en": "the Great Wall",
          "ko": "만리장성"
        },
        "gloss": {
          "en": "I want to go to the Great Wall.",
          "ko": "만리장성에 가고 싶어요."
        }
      },
      {
        "text": "我想去看电影。",
        "slot": "看电影",
        "cue": {
          "en": "see a film",
          "ko": "영화 보러"
        },
        "gloss": {
          "en": "I want to go and see a film.",
          "ko": "영화 보러 가고 싶어요."
        }
      },
      {
        "text": "我想去海边。",
        "slot": "海边",
        "cue": {
          "en": "the seaside",
          "ko": "바닷가"
        },
        "gloss": {
          "en": "I want to go to the seaside.",
          "ko": "바닷가에 가고 싶어요."
        }
      }
    ]
  },
  {
    "id": "zh-f2-04",
    "stage": 2,
    "fn": "want",
    "pattern": "我想吃___。",
    "core": [
      "我想吃"
    ],
    "meaning": {
      "en": "Saying what you want to eat: I want to eat ___.",
      "ko": "먹고 싶은 것 말하기: ___ 먹고 싶어요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "我想吃牛肉面。",
        "slot": "牛肉面",
        "cue": {
          "en": "beef noodles",
          "ko": "소고기 국수"
        },
        "gloss": {
          "en": "I want to eat beef noodles.",
          "ko": "소고기 국수 먹고 싶어요."
        }
      },
      {
        "text": "我想吃饺子。",
        "slot": "饺子",
        "cue": {
          "en": "dumplings",
          "ko": "만두"
        },
        "gloss": {
          "en": "I want to eat dumplings.",
          "ko": "만두 먹고 싶어요."
        }
      },
      {
        "text": "我想吃火锅。",
        "slot": "火锅",
        "cue": {
          "en": "hot pot",
          "ko": "훠궈"
        },
        "gloss": {
          "en": "I want to eat hot pot.",
          "ko": "훠궈 먹고 싶어요."
        }
      },
      {
        "text": "我想吃包子。",
        "slot": "包子",
        "cue": {
          "en": "steamed buns",
          "ko": "찐빵"
        },
        "gloss": {
          "en": "I want to eat steamed buns.",
          "ko": "바오쯔 먹고 싶어요."
        }
      }
    ]
  },
  {
    "id": "zh-f2-05",
    "stage": 2,
    "fn": "order",
    "pattern": "我要一碗___。",
    "core": [
      "一碗"
    ],
    "meaning": {
      "en": "Ordering a bowl of something: I'd like a bowl of ___.",
      "ko": "주문하기: ___ 한 그릇 주세요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "我要一碗牛肉面。",
        "slot": "牛肉面",
        "cue": {
          "en": "beef noodles",
          "ko": "소고기 국수"
        },
        "gloss": {
          "en": "I'd like a bowl of beef noodles.",
          "ko": "소고기 국수 한 그릇 주세요."
        }
      },
      {
        "text": "我要一碗米饭。",
        "slot": "米饭",
        "cue": {
          "en": "rice",
          "ko": "밥"
        },
        "gloss": {
          "en": "I'd like a bowl of rice.",
          "ko": "밥 한 공기 주세요."
        }
      },
      {
        "text": "我要一碗汤。",
        "slot": "汤",
        "cue": {
          "en": "soup",
          "ko": "국"
        },
        "gloss": {
          "en": "I'd like a bowl of soup.",
          "ko": "국 한 그릇 주세요."
        }
      },
      {
        "text": "我要一碗炸酱面。",
        "slot": "炸酱面",
        "cue": {
          "en": "zhajiang noodles",
          "ko": "짜장면"
        },
        "gloss": {
          "en": "I'd like a bowl of zhajiang noodles.",
          "ko": "짜장면 한 그릇 주세요."
        }
      }
    ]
  },
  {
    "id": "zh-f2-06",
    "stage": 2,
    "fn": "routine",
    "pattern": "我每天___起床。",
    "core": [
      "每天",
      "起床"
    ],
    "meaning": {
      "en": "Saying when you get up every day: I get up ___ every day.",
      "ko": "하루 일과 말하기: 매일 ___ 일어나요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "我每天七点起床。",
        "slot": "七点",
        "cue": {
          "en": "at seven",
          "ko": "일곱 시에"
        },
        "gloss": {
          "en": "I get up at seven every day.",
          "ko": "매일 일곱 시에 일어나요."
        }
      },
      {
        "text": "我每天六点半起床。",
        "slot": "六点半",
        "cue": {
          "en": "at half past six",
          "ko": "여섯 시 반에"
        },
        "gloss": {
          "en": "I get up at half past six every day.",
          "ko": "매일 여섯 시 반에 일어나요."
        }
      },
      {
        "text": "我每天八点起床。",
        "slot": "八点",
        "cue": {
          "en": "at eight",
          "ko": "여덟 시에"
        },
        "gloss": {
          "en": "I get up at eight every day.",
          "ko": "매일 여덟 시에 일어나요."
        }
      },
      {
        "text": "我每天很早起床。",
        "slot": "很早",
        "cue": {
          "en": "very early",
          "ko": "아주 일찍"
        },
        "gloss": {
          "en": "I get up very early every day.",
          "ko": "매일 아주 일찍 일어나요."
        }
      }
    ]
  },
  {
    "id": "zh-f2-07",
    "stage": 2,
    "fn": "future-plan",
    "pattern": "我___去看电影。",
    "core": [
      "去看电影"
    ],
    "meaning": {
      "en": "Saying when you'll do something: I'm going to see a film ___.",
      "ko": "할 일 말하기: ___ 영화 보러 가요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "我明天去看电影。",
        "slot": "明天",
        "cue": {
          "en": "tomorrow",
          "ko": "내일"
        },
        "gloss": {
          "en": "I'm going to see a film tomorrow.",
          "ko": "내일 영화 보러 가요."
        }
      },
      {
        "text": "我周末去看电影。",
        "slot": "周末",
        "cue": {
          "en": "at the weekend",
          "ko": "주말에"
        },
        "gloss": {
          "en": "I'm going to see a film at the weekend.",
          "ko": "주말에 영화 보러 가요."
        }
      },
      {
        "text": "我晚上去看电影。",
        "slot": "晚上",
        "cue": {
          "en": "this evening",
          "ko": "저녁에"
        },
        "gloss": {
          "en": "I'm going to see a film this evening.",
          "ko": "저녁에 영화 보러 가요."
        }
      },
      {
        "text": "我下午去看电影。",
        "slot": "下午",
        "cue": {
          "en": "this afternoon",
          "ko": "오후에"
        },
        "gloss": {
          "en": "I'm going to see a film this afternoon.",
          "ko": "오후에 영화 보러 가요."
        }
      }
    ]
  },
  {
    "id": "zh-f2-08",
    "stage": 2,
    "fn": "live-where",
    "pattern": "我在___上班。",
    "core": [
      "上班"
    ],
    "meaning": {
      "en": "Saying where you work: I work at ___.",
      "ko": "일하는 곳 말하기: ___에서 일해요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "我在公司上班。",
        "slot": "公司",
        "cue": {
          "en": "a company",
          "ko": "회사"
        },
        "gloss": {
          "en": "I work at a company.",
          "ko": "회사에서 일해요."
        }
      },
      {
        "text": "我在银行上班。",
        "slot": "银行",
        "cue": {
          "en": "a bank",
          "ko": "은행"
        },
        "gloss": {
          "en": "I work at a bank.",
          "ko": "은행에서 일해요."
        }
      },
      {
        "text": "我在医院上班。",
        "slot": "医院",
        "cue": {
          "en": "a hospital",
          "ko": "병원"
        },
        "gloss": {
          "en": "I work at a hospital.",
          "ko": "병원에서 일해요."
        }
      },
      {
        "text": "我在学校上班。",
        "slot": "学校",
        "cue": {
          "en": "a school",
          "ko": "학교"
        },
        "gloss": {
          "en": "I work at a school.",
          "ko": "학교에서 일해요."
        }
      }
    ]
  },
  {
    "id": "zh-f2-09",
    "stage": 2,
    "fn": "live-where",
    "pattern": "我在___学中文。",
    "core": [
      "学中文"
    ],
    "meaning": {
      "en": "Saying where you study: I study Chinese at ___.",
      "ko": "공부하는 곳 말하기: ___에서 중국어를 배워요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "我在大学学中文。",
        "slot": "大学",
        "cue": {
          "en": "university",
          "ko": "대학교"
        },
        "gloss": {
          "en": "I study Chinese at university.",
          "ko": "대학교에서 중국어를 배워요."
        }
      },
      {
        "text": "我在家学中文。",
        "slot": "家",
        "cue": {
          "en": "home",
          "ko": "집"
        },
        "gloss": {
          "en": "I study Chinese at home.",
          "ko": "집에서 중국어를 배워요."
        }
      },
      {
        "text": "我在网上学中文。",
        "slot": "网上",
        "cue": {
          "en": "online",
          "ko": "온라인"
        },
        "gloss": {
          "en": "I study Chinese online.",
          "ko": "온라인으로 중국어를 배워요."
        }
      },
      {
        "text": "我在语言学校学中文。",
        "slot": "语言学校",
        "cue": {
          "en": "a language school",
          "ko": "어학원"
        },
        "gloss": {
          "en": "I study Chinese at a language school.",
          "ko": "어학원에서 중국어를 배워요."
        }
      }
    ]
  },
  {
    "id": "zh-f2-10",
    "stage": 2,
    "fn": "permission",
    "pattern": "这儿可以___吗？",
    "core": [
      "可以",
      "吗"
    ],
    "meaning": {
      "en": "Asking permission: Can I ___ here?",
      "ko": "허락 구하기: 여기서 ___해도 돼요?"
    },
    "grammar": [
      4
    ],
    "expressions": [
      "可以拍照吗"
    ],
    "examples": [
      {
        "text": "这儿可以拍照吗？",
        "slot": "拍照",
        "cue": {
          "en": "take photos",
          "ko": "사진 찍다"
        },
        "gloss": {
          "en": "Can I take photos here?",
          "ko": "여기서 사진 찍어도 돼요?"
        }
      },
      {
        "text": "这儿可以抽烟吗？",
        "slot": "抽烟",
        "cue": {
          "en": "smoke",
          "ko": "담배 피우다"
        },
        "gloss": {
          "en": "Can I smoke here?",
          "ko": "여기서 담배 피워도 돼요?"
        }
      },
      {
        "text": "这儿可以付现金吗？",
        "slot": "付现金",
        "cue": {
          "en": "pay in cash",
          "ko": "현금으로 내다"
        },
        "gloss": {
          "en": "Can I pay in cash here?",
          "ko": "여기 현금으로 내도 돼요?"
        }
      },
      {
        "text": "这儿可以停车吗？",
        "slot": "停车",
        "cue": {
          "en": "park",
          "ko": "주차하다"
        },
        "gloss": {
          "en": "Can I park here?",
          "ko": "여기 주차해도 돼요?"
        }
      }
    ]
  },
  {
    "id": "zh-f2-11",
    "stage": 2,
    "fn": "can",
    "pattern": "我能___吗？",
    "core": [
      "我能"
    ],
    "meaning": {
      "en": "Asking if you can do something: Can I ___?",
      "ko": "할 수 있는지 묻기: ___해도 될까요?"
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "我能坐这儿吗？",
        "slot": "坐这儿",
        "cue": {
          "en": "sit here",
          "ko": "여기 앉다"
        },
        "gloss": {
          "en": "Can I sit here?",
          "ko": "여기 앉아도 될까요?"
        }
      },
      {
        "text": "我能试试吗？",
        "slot": "试试",
        "cue": {
          "en": "try it",
          "ko": "해 보다"
        },
        "gloss": {
          "en": "Can I try it?",
          "ko": "해 봐도 될까요?"
        }
      },
      {
        "text": "我能刷卡吗？",
        "slot": "刷卡",
        "cue": {
          "en": "pay by card",
          "ko": "카드로 내다"
        },
        "gloss": {
          "en": "Can I pay by card?",
          "ko": "카드로 내도 될까요?"
        }
      },
      {
        "text": "我能用一下洗手间吗？",
        "slot": "用一下洗手间",
        "cue": {
          "en": "use the restroom",
          "ko": "화장실을 쓰다"
        },
        "gloss": {
          "en": "Can I use the restroom?",
          "ko": "화장실 좀 써도 될까요?"
        }
      }
    ]
  },
  {
    "id": "zh-f2-12",
    "stage": 2,
    "fn": "order",
    "pattern": "你喝___还是喝咖啡？",
    "core": [
      "还是"
    ],
    "meaning": {
      "en": "Offering a choice: Will you have ___ or coffee?",
      "ko": "고르게 묻기: ___ 마실래, 커피 마실래?"
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "你喝茶还是喝咖啡？",
        "slot": "茶",
        "cue": {
          "en": "tea",
          "ko": "차"
        },
        "gloss": {
          "en": "Will you have tea or coffee?",
          "ko": "차 마실래, 커피 마실래?"
        }
      },
      {
        "text": "你喝果汁还是喝咖啡？",
        "slot": "果汁",
        "cue": {
          "en": "juice",
          "ko": "주스"
        },
        "gloss": {
          "en": "Will you have juice or coffee?",
          "ko": "주스 마실래, 커피 마실래?"
        }
      },
      {
        "text": "你喝水还是喝咖啡？",
        "slot": "水",
        "cue": {
          "en": "water",
          "ko": "물"
        },
        "gloss": {
          "en": "Will you have water or coffee?",
          "ko": "물 마실래, 커피 마실래?"
        }
      },
      {
        "text": "你喝可乐还是喝咖啡？",
        "slot": "可乐",
        "cue": {
          "en": "cola",
          "ko": "콜라"
        },
        "gloss": {
          "en": "Will you have cola or coffee?",
          "ko": "콜라 마실래, 커피 마실래?"
        }
      }
    ]
  },
  {
    "id": "zh-f2-13",
    "stage": 2,
    "fn": "suggest-time",
    "pattern": "___还是明天？",
    "core": [
      "还是明天"
    ],
    "meaning": {
      "en": "Choosing a day: ___ or tomorrow?",
      "ko": "시간 정하기: ___, 아니면 내일?"
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "今天还是明天？",
        "slot": "今天",
        "cue": {
          "en": "today",
          "ko": "오늘"
        },
        "gloss": {
          "en": "Today or tomorrow?",
          "ko": "오늘, 아니면 내일?"
        }
      },
      {
        "text": "今天晚上还是明天？",
        "slot": "今天晚上",
        "cue": {
          "en": "tonight",
          "ko": "오늘 저녁"
        },
        "gloss": {
          "en": "Tonight or tomorrow?",
          "ko": "오늘 저녁, 아니면 내일?"
        }
      },
      {
        "text": "现在还是明天？",
        "slot": "现在",
        "cue": {
          "en": "now",
          "ko": "지금"
        },
        "gloss": {
          "en": "Now or tomorrow?",
          "ko": "지금, 아니면 내일?"
        }
      },
      {
        "text": "下午还是明天？",
        "slot": "下午",
        "cue": {
          "en": "this afternoon",
          "ko": "오후"
        },
        "gloss": {
          "en": "This afternoon or tomorrow?",
          "ko": "오후, 아니면 내일?"
        }
      }
    ]
  },
  {
    "id": "zh-f2-14",
    "stage": 2,
    "fn": "suggest-time",
    "pattern": "我们坐___去吧。",
    "core": [
      "我们坐",
      "去吧"
    ],
    "meaning": {
      "en": "Suggesting how to go: Let's take the ___.",
      "ko": "가는 방법 정하기: ___ 타고 가자."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "我们坐地铁去吧。",
        "slot": "地铁",
        "cue": {
          "en": "subway",
          "ko": "지하철"
        },
        "gloss": {
          "en": "Let's take the subway.",
          "ko": "지하철 타고 가자."
        }
      },
      {
        "text": "我们坐公交车去吧。",
        "slot": "公交车",
        "cue": {
          "en": "bus",
          "ko": "버스"
        },
        "gloss": {
          "en": "Let's take the bus.",
          "ko": "버스 타고 가자."
        }
      },
      {
        "text": "我们坐出租车去吧。",
        "slot": "出租车",
        "cue": {
          "en": "taxi",
          "ko": "택시"
        },
        "gloss": {
          "en": "Let's take a taxi.",
          "ko": "택시 타고 가자."
        }
      },
      {
        "text": "我们坐高铁去吧。",
        "slot": "高铁",
        "cue": {
          "en": "high-speed train",
          "ko": "고속철"
        },
        "gloss": {
          "en": "Let's take the high-speed train.",
          "ko": "고속철 타고 가자."
        }
      }
    ]
  },
  {
    "id": "zh-f2-15",
    "stage": 2,
    "fn": "directions",
    "pattern": "我打车去___。",
    "core": [
      "打车"
    ],
    "meaning": {
      "en": "Saying you'll take a taxi somewhere: I'll take a taxi to ___.",
      "ko": "택시로 간다고 말하기: ___까지 택시 타고 가요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "我打车去酒店。",
        "slot": "酒店",
        "cue": {
          "en": "the hotel",
          "ko": "호텔"
        },
        "gloss": {
          "en": "I'll take a taxi to the hotel.",
          "ko": "호텔까지 택시 타고 가요."
        }
      },
      {
        "text": "我打车去机场。",
        "slot": "机场",
        "cue": {
          "en": "the airport",
          "ko": "공항"
        },
        "gloss": {
          "en": "I'll take a taxi to the airport.",
          "ko": "공항까지 택시 타고 가요."
        }
      },
      {
        "text": "我打车去火车站。",
        "slot": "火车站",
        "cue": {
          "en": "the train station",
          "ko": "기차역"
        },
        "gloss": {
          "en": "I'll take a taxi to the train station.",
          "ko": "기차역까지 택시 타고 가요."
        }
      },
      {
        "text": "我打车去公司。",
        "slot": "公司",
        "cue": {
          "en": "the office",
          "ko": "회사"
        },
        "gloss": {
          "en": "I'll take a taxi to the office.",
          "ko": "회사까지 택시 타고 가요."
        }
      }
    ]
  },
  {
    "id": "zh-f2-16",
    "stage": 2,
    "fn": "invite",
    "pattern": "周末一起去___吧。",
    "core": [
      "一起去"
    ],
    "meaning": {
      "en": "Inviting someone: Let's go ___ together at the weekend.",
      "ko": "같이 하자고 하기: 주말에 같이 ___ 가자."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "周末一起去爬山吧。",
        "slot": "爬山",
        "cue": {
          "en": "hiking",
          "ko": "등산"
        },
        "gloss": {
          "en": "Let's go hiking together at the weekend.",
          "ko": "주말에 같이 등산 가자."
        }
      },
      {
        "text": "周末一起去看电影吧。",
        "slot": "看电影",
        "cue": {
          "en": "to a film",
          "ko": "영화 보러"
        },
        "gloss": {
          "en": "Let's go to a film together at the weekend.",
          "ko": "주말에 같이 영화 보러 가자."
        }
      },
      {
        "text": "周末一起去吃火锅吧。",
        "slot": "吃火锅",
        "cue": {
          "en": "for hot pot",
          "ko": "훠궈 먹으러"
        },
        "gloss": {
          "en": "Let's go for hot pot together at the weekend.",
          "ko": "주말에 같이 훠궈 먹으러 가자."
        }
      },
      {
        "text": "周末一起去逛街吧。",
        "slot": "逛街",
        "cue": {
          "en": "shopping",
          "ko": "쇼핑하러"
        },
        "gloss": {
          "en": "Let's go shopping together at the weekend.",
          "ko": "주말에 같이 쇼핑하러 가자."
        }
      }
    ]
  },
  {
    "id": "zh-f2-17",
    "stage": 2,
    "fn": "directions",
    "pattern": "去___怎么走？",
    "core": [
      "怎么走"
    ],
    "meaning": {
      "en": "Asking the way: How do I get to ___?",
      "ko": "길 묻기: ___에 어떻게 가요?"
    },
    "grammar": [],
    "expressions": [
      "怎么走"
    ],
    "examples": [
      {
        "text": "去地铁站怎么走？",
        "slot": "地铁站",
        "cue": {
          "en": "the subway station",
          "ko": "지하철역"
        },
        "gloss": {
          "en": "How do I get to the subway station?",
          "ko": "지하철역에 어떻게 가요?"
        }
      },
      {
        "text": "去火车站怎么走？",
        "slot": "火车站",
        "cue": {
          "en": "the train station",
          "ko": "기차역"
        },
        "gloss": {
          "en": "How do I get to the train station?",
          "ko": "기차역에 어떻게 가요?"
        }
      },
      {
        "text": "去医院怎么走？",
        "slot": "医院",
        "cue": {
          "en": "the hospital",
          "ko": "병원"
        },
        "gloss": {
          "en": "How do I get to the hospital?",
          "ko": "병원에 어떻게 가요?"
        }
      },
      {
        "text": "去酒店怎么走？",
        "slot": "酒店",
        "cue": {
          "en": "the hotel",
          "ko": "호텔"
        },
        "gloss": {
          "en": "How do I get to the hotel?",
          "ko": "호텔에 어떻게 가요?"
        }
      }
    ]
  },
  {
    "id": "zh-f2-18",
    "stage": 2,
    "fn": "symptom",
    "pattern": "我___疼。",
    "core": [
      "疼"
    ],
    "meaning": {
      "en": "Saying where it hurts: My ___ hurts.",
      "ko": "아픈 곳 말하기: ___가 아파요."
    },
    "grammar": [],
    "expressions": [
      "我头疼"
    ],
    "examples": [
      {
        "text": "我头疼。",
        "slot": "头",
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
        "text": "我肚子疼。",
        "slot": "肚子",
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
        "text": "我牙疼。",
        "slot": "牙",
        "cue": {
          "en": "tooth",
          "ko": "이"
        },
        "gloss": {
          "en": "I have a toothache.",
          "ko": "이가 아파요."
        }
      },
      {
        "text": "我嗓子疼。",
        "slot": "嗓子",
        "cue": {
          "en": "throat",
          "ko": "목"
        },
        "gloss": {
          "en": "My throat hurts.",
          "ko": "목이 아파요."
        }
      }
    ]
  },
  {
    "id": "zh-f2-19",
    "stage": 2,
    "fn": "feel",
    "pattern": "我有点儿___。",
    "core": [
      "有点儿"
    ],
    "meaning": {
      "en": "Saying how you feel: I'm a bit ___.",
      "ko": "기분·몸 상태 말하기: 좀 ___요."
    },
    "grammar": [],
    "expressions": [
      "有点儿累"
    ],
    "examples": [
      {
        "text": "我有点儿累。",
        "slot": "累",
        "cue": {
          "en": "tired",
          "ko": "피곤하다"
        },
        "gloss": {
          "en": "I'm a bit tired.",
          "ko": "좀 피곤해요."
        }
      },
      {
        "text": "我有点儿饿。",
        "slot": "饿",
        "cue": {
          "en": "hungry",
          "ko": "배고프다"
        },
        "gloss": {
          "en": "I'm a bit hungry.",
          "ko": "좀 배고파요."
        }
      },
      {
        "text": "我有点儿冷。",
        "slot": "冷",
        "cue": {
          "en": "cold",
          "ko": "춥다"
        },
        "gloss": {
          "en": "I'm a bit cold.",
          "ko": "좀 추워요."
        }
      },
      {
        "text": "我有点儿不舒服。",
        "slot": "不舒服",
        "cue": {
          "en": "unwell",
          "ko": "몸이 안 좋다"
        },
        "gloss": {
          "en": "I'm feeling a bit unwell.",
          "ko": "몸이 좀 안 좋아요."
        }
      }
    ]
  },
  {
    "id": "zh-f2-20",
    "stage": 2,
    "fn": "order",
    "pattern": "请不要放___。",
    "core": [
      "不要放"
    ],
    "meaning": {
      "en": "Asking them to leave something out: Please don't add ___.",
      "ko": "빼 달라고 주문하기: ___는 넣지 마세요."
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "请不要放辣椒。",
        "slot": "辣椒",
        "cue": {
          "en": "chilli",
          "ko": "고추"
        },
        "gloss": {
          "en": "Please don't add chilli.",
          "ko": "고추는 넣지 마세요."
        }
      },
      {
        "text": "请不要放香菜。",
        "slot": "香菜",
        "cue": {
          "en": "coriander",
          "ko": "고수"
        },
        "gloss": {
          "en": "Please don't add coriander.",
          "ko": "고수는 넣지 마세요."
        }
      },
      {
        "text": "请不要放葱。",
        "slot": "葱",
        "cue": {
          "en": "spring onion",
          "ko": "파"
        },
        "gloss": {
          "en": "Please don't add spring onion.",
          "ko": "파는 넣지 마세요."
        }
      },
      {
        "text": "请不要放糖。",
        "slot": "糖",
        "cue": {
          "en": "sugar",
          "ko": "설탕"
        },
        "gloss": {
          "en": "Please don't add sugar.",
          "ko": "설탕은 넣지 마세요."
        }
      }
    ]
  },
  {
    "id": "zh-f3-01",
    "stage": 3,
    "fn": "experience",
    "pattern": "我去过___。",
    "core": [
      "我去过"
    ],
    "meaning": {
      "en": "Saying where you've been: I've been to ___.",
      "ko": "가 본 곳 말하기: ___에 가 봤어요."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "我去过"
    ],
    "examples": [
      {
        "text": "我去过西安。",
        "slot": "西安",
        "cue": {
          "en": "Xi'an",
          "ko": "시안"
        },
        "gloss": {
          "en": "I've been to Xi'an.",
          "ko": "시안에 가 봤어요."
        }
      },
      {
        "text": "我去过成都。",
        "slot": "成都",
        "cue": {
          "en": "Chengdu",
          "ko": "청두"
        },
        "gloss": {
          "en": "I've been to Chengdu.",
          "ko": "청두에 가 봤어요."
        }
      },
      {
        "text": "我去过云南。",
        "slot": "云南",
        "cue": {
          "en": "Yunnan",
          "ko": "윈난"
        },
        "gloss": {
          "en": "I've been to Yunnan.",
          "ko": "윈난에 가 봤어요."
        }
      },
      {
        "text": "我去过香港。",
        "slot": "香港",
        "cue": {
          "en": "Hong Kong",
          "ko": "홍콩"
        },
        "gloss": {
          "en": "I've been to Hong Kong.",
          "ko": "홍콩에 가 봤어요."
        }
      }
    ]
  },
  {
    "id": "zh-f3-02",
    "stage": 3,
    "fn": "experience",
    "pattern": "你吃过___吗？",
    "core": [
      "吃过"
    ],
    "meaning": {
      "en": "Asking about experience: Have you ever eaten ___?",
      "ko": "해 본 적 묻기: ___ 먹어 봤어요?"
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "你吃过北京烤鸭吗？",
        "slot": "北京烤鸭",
        "cue": {
          "en": "Peking duck",
          "ko": "베이징 오리구이"
        },
        "gloss": {
          "en": "Have you ever had Peking duck?",
          "ko": "베이징 오리구이 먹어 봤어요?"
        }
      },
      {
        "text": "你吃过火锅吗？",
        "slot": "火锅",
        "cue": {
          "en": "hot pot",
          "ko": "훠궈"
        },
        "gloss": {
          "en": "Have you ever had hot pot?",
          "ko": "훠궈 먹어 봤어요?"
        }
      },
      {
        "text": "你吃过小笼包吗？",
        "slot": "小笼包",
        "cue": {
          "en": "soup dumplings",
          "ko": "샤오룽바오"
        },
        "gloss": {
          "en": "Have you ever had soup dumplings?",
          "ko": "샤오룽바오 먹어 봤어요?"
        }
      },
      {
        "text": "你吃过臭豆腐吗？",
        "slot": "臭豆腐",
        "cue": {
          "en": "stinky tofu",
          "ko": "취두부"
        },
        "gloss": {
          "en": "Have you ever had stinky tofu?",
          "ko": "취두부 먹어 봤어요?"
        }
      }
    ]
  },
  {
    "id": "zh-f3-03",
    "stage": 3,
    "fn": "compare",
    "pattern": "这个比那个___。",
    "core": [
      "比"
    ],
    "meaning": {
      "en": "Comparing two things: This one is more ___ than that one.",
      "ko": "둘을 비교하기: 이게 저것보다 ___."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "这个比那个便宜。",
        "slot": "便宜",
        "cue": {
          "en": "cheap",
          "ko": "싸다"
        },
        "gloss": {
          "en": "This one is cheaper than that one.",
          "ko": "이게 저것보다 싸요."
        }
      },
      {
        "text": "这个比那个好看。",
        "slot": "好看",
        "cue": {
          "en": "nice-looking",
          "ko": "예쁘다"
        },
        "gloss": {
          "en": "This one looks nicer than that one.",
          "ko": "이게 저것보다 예뻐요."
        }
      },
      {
        "text": "这个比那个方便。",
        "slot": "方便",
        "cue": {
          "en": "convenient",
          "ko": "편하다"
        },
        "gloss": {
          "en": "This one is more convenient than that one.",
          "ko": "이게 저것보다 편해요."
        }
      },
      {
        "text": "这个比那个贵一点儿。",
        "slot": "贵一点儿",
        "cue": {
          "en": "a bit pricier",
          "ko": "조금 비싸다"
        },
        "gloss": {
          "en": "This one is a bit pricier than that one.",
          "ko": "이게 저것보다 조금 비싸요."
        }
      }
    ]
  },
  {
    "id": "zh-f3-04",
    "stage": 3,
    "fn": "compare",
    "pattern": "这个没有那个那么___。",
    "core": [
      "没有",
      "那么"
    ],
    "meaning": {
      "en": "Saying something is less so: This one isn't as ___ as that one.",
      "ko": "덜하다고 비교하기: 이건 저것만큼 ___지 않아요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "这个没有那个那么贵。",
        "slot": "贵",
        "cue": {
          "en": "expensive",
          "ko": "비싸다"
        },
        "gloss": {
          "en": "This one isn't as expensive as that one.",
          "ko": "이건 저것만큼 비싸지 않아요."
        }
      },
      {
        "text": "这个没有那个那么好用。",
        "slot": "好用",
        "cue": {
          "en": "easy to use",
          "ko": "쓰기 좋다"
        },
        "gloss": {
          "en": "This one isn't as easy to use as that one.",
          "ko": "이건 저것만큼 쓰기 좋지 않아요."
        }
      },
      {
        "text": "这个没有那个那么难。",
        "slot": "难",
        "cue": {
          "en": "difficult",
          "ko": "어렵다"
        },
        "gloss": {
          "en": "This one isn't as hard as that one.",
          "ko": "이건 저것만큼 어렵지 않아요."
        }
      },
      {
        "text": "这个没有那个那么大。",
        "slot": "大",
        "cue": {
          "en": "big",
          "ko": "크다"
        },
        "gloss": {
          "en": "This one isn't as big as that one.",
          "ko": "이건 저것만큼 크지 않아요."
        }
      }
    ]
  },
  {
    "id": "zh-f3-05",
    "stage": 3,
    "fn": "past-did",
    "pattern": "我还没___完。",
    "core": [
      "还没",
      "完"
    ],
    "meaning": {
      "en": "Saying you haven't finished: I haven't finished ___ yet.",
      "ko": "아직 다 못 했다고 말하기: 아직 다 ___지 못했어요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "我还没做完。",
        "slot": "做",
        "cue": {
          "en": "doing it",
          "ko": "하다"
        },
        "gloss": {
          "en": "I haven't finished doing it yet.",
          "ko": "아직 다 못 했어요."
        }
      },
      {
        "text": "我还没看完。",
        "slot": "看",
        "cue": {
          "en": "watching / reading it",
          "ko": "보다"
        },
        "gloss": {
          "en": "I haven't finished watching it yet.",
          "ko": "아직 다 못 봤어요."
        }
      },
      {
        "text": "我还没吃完。",
        "slot": "吃",
        "cue": {
          "en": "eating",
          "ko": "먹다"
        },
        "gloss": {
          "en": "I haven't finished eating yet.",
          "ko": "아직 다 못 먹었어요."
        }
      },
      {
        "text": "我还没写完。",
        "slot": "写",
        "cue": {
          "en": "writing it",
          "ko": "쓰다"
        },
        "gloss": {
          "en": "I haven't finished writing it yet.",
          "ko": "아직 다 못 썼어요."
        }
      }
    ]
  },
  {
    "id": "zh-f3-06",
    "stage": 3,
    "fn": "compliment",
    "pattern": "你___说得真好。",
    "core": [
      "说得真好"
    ],
    "meaning": {
      "en": "Complimenting someone's language: You speak ___ really well.",
      "ko": "칭찬하기: ___ 정말 잘하시네요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "你中文说得真好。",
        "slot": "中文",
        "cue": {
          "en": "Chinese",
          "ko": "중국어"
        },
        "gloss": {
          "en": "You speak Chinese really well.",
          "ko": "중국어 정말 잘하시네요."
        }
      },
      {
        "text": "你英语说得真好。",
        "slot": "英语",
        "cue": {
          "en": "English",
          "ko": "영어"
        },
        "gloss": {
          "en": "You speak English really well.",
          "ko": "영어 정말 잘하시네요."
        }
      },
      {
        "text": "你韩语说得真好。",
        "slot": "韩语",
        "cue": {
          "en": "Korean",
          "ko": "한국어"
        },
        "gloss": {
          "en": "You speak Korean really well.",
          "ko": "한국어 정말 잘하시네요."
        }
      },
      {
        "text": "你日语说得真好。",
        "slot": "日语",
        "cue": {
          "en": "Japanese",
          "ko": "일본어"
        },
        "gloss": {
          "en": "You speak Japanese really well.",
          "ko": "일본어 정말 잘하시네요."
        }
      }
    ]
  },
  {
    "id": "zh-f3-07",
    "stage": 3,
    "fn": "describe-person",
    "pattern": "他___得很快。",
    "core": [
      "得很快"
    ],
    "meaning": {
      "en": "Describing how someone does something: He ___ very fast.",
      "ko": "사람 묘사하기: 그는 ___ 아주 빨라요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "他说得很快。",
        "slot": "说",
        "cue": {
          "en": "speaks",
          "ko": "말하다"
        },
        "gloss": {
          "en": "He speaks very fast.",
          "ko": "그는 말이 아주 빨라요."
        }
      },
      {
        "text": "他跑得很快。",
        "slot": "跑",
        "cue": {
          "en": "runs",
          "ko": "뛰다"
        },
        "gloss": {
          "en": "He runs very fast.",
          "ko": "그는 아주 빨리 뛰어요."
        }
      },
      {
        "text": "他走得很快。",
        "slot": "走",
        "cue": {
          "en": "walks",
          "ko": "걷다"
        },
        "gloss": {
          "en": "He walks very fast.",
          "ko": "그는 아주 빨리 걸어요."
        }
      },
      {
        "text": "他学得很快。",
        "slot": "学",
        "cue": {
          "en": "learns",
          "ko": "배우다"
        },
        "gloss": {
          "en": "He learns very fast.",
          "ko": "그는 아주 빨리 배워요."
        }
      }
    ]
  },
  {
    "id": "zh-f3-08",
    "stage": 3,
    "fn": "ongoing",
    "pattern": "我正在___呢。",
    "core": [
      "正在",
      "呢"
    ],
    "meaning": {
      "en": "Saying what you're doing right now: I'm ___ right now.",
      "ko": "지금 하는 일 말하기: 지금 ___ 중이에요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "我正在开会呢。",
        "slot": "开会",
        "cue": {
          "en": "in a meeting",
          "ko": "회의하다"
        },
        "gloss": {
          "en": "I'm in a meeting right now.",
          "ko": "지금 회의 중이에요."
        }
      },
      {
        "text": "我正在吃饭呢。",
        "slot": "吃饭",
        "cue": {
          "en": "eating",
          "ko": "밥 먹다"
        },
        "gloss": {
          "en": "I'm eating right now.",
          "ko": "지금 밥 먹는 중이에요."
        }
      },
      {
        "text": "我正在开车呢。",
        "slot": "开车",
        "cue": {
          "en": "driving",
          "ko": "운전하다"
        },
        "gloss": {
          "en": "I'm driving right now.",
          "ko": "지금 운전 중이에요."
        }
      },
      {
        "text": "我正在上课呢。",
        "slot": "上课",
        "cue": {
          "en": "in class",
          "ko": "수업하다"
        },
        "gloss": {
          "en": "I'm in class right now.",
          "ko": "지금 수업 중이에요."
        }
      }
    ]
  },
  {
    "id": "zh-f3-09",
    "stage": 3,
    "fn": "apologize-late",
    "pattern": "因为___，所以我来晚了。",
    "core": [
      "因为",
      "所以"
    ],
    "meaning": {
      "en": "Explaining why: Because ___, I'm late.",
      "ko": "사정 말하기: ___ 때문에 늦었어요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "因为堵车，所以我来晚了。",
        "slot": "堵车",
        "cue": {
          "en": "of traffic",
          "ko": "차가 막히다"
        },
        "gloss": {
          "en": "I'm late because of the traffic.",
          "ko": "차가 막혀서 늦었어요."
        }
      },
      {
        "text": "因为下雨，所以我来晚了。",
        "slot": "下雨",
        "cue": {
          "en": "it rained",
          "ko": "비가 오다"
        },
        "gloss": {
          "en": "I'm late because it rained.",
          "ko": "비가 와서 늦었어요."
        }
      },
      {
        "text": "因为起晚了，所以我来晚了。",
        "slot": "起晚了",
        "cue": {
          "en": "I overslept",
          "ko": "늦잠을 자다"
        },
        "gloss": {
          "en": "I'm late because I overslept.",
          "ko": "늦잠을 자서 늦었어요."
        }
      },
      {
        "text": "因为地铁出了问题，所以我来晚了。",
        "slot": "地铁出了问题",
        "cue": {
          "en": "the subway had a problem",
          "ko": "지하철에 문제가 생기다"
        },
        "gloss": {
          "en": "I'm late because the subway had a problem.",
          "ko": "지하철에 문제가 생겨서 늦었어요."
        }
      }
    ]
  },
  {
    "id": "zh-f3-10",
    "stage": 3,
    "fn": "polite-request",
    "pattern": "请把___给我。",
    "core": [
      "请把",
      "给我"
    ],
    "meaning": {
      "en": "Asking for something to be handed over: Please give me the ___.",
      "ko": "공손하게 부탁하기: ___ 좀 주세요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "请把房卡给我。",
        "slot": "房卡",
        "cue": {
          "en": "room card",
          "ko": "방 카드"
        },
        "gloss": {
          "en": "Please give me the room card.",
          "ko": "방 카드 좀 주세요."
        }
      },
      {
        "text": "请把菜单给我。",
        "slot": "菜单",
        "cue": {
          "en": "menu",
          "ko": "메뉴판"
        },
        "gloss": {
          "en": "Please give me the menu.",
          "ko": "메뉴판 좀 주세요."
        }
      },
      {
        "text": "请把账单给我。",
        "slot": "账单",
        "cue": {
          "en": "bill",
          "ko": "계산서"
        },
        "gloss": {
          "en": "Please give me the bill.",
          "ko": "계산서 좀 주세요."
        }
      },
      {
        "text": "请把遥控器给我。",
        "slot": "遥控器",
        "cue": {
          "en": "remote control",
          "ko": "리모컨"
        },
        "gloss": {
          "en": "Please give me the remote control.",
          "ko": "리모컨 좀 주세요."
        }
      }
    ]
  },
  {
    "id": "zh-f3-11",
    "stage": 3,
    "fn": "lost-problem",
    "pattern": "我把___弄丢了。",
    "core": [
      "弄丢了"
    ],
    "meaning": {
      "en": "Reporting something lost: I've lost my ___.",
      "ko": "잃어버린 것 알리기: ___를 잃어버렸어요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "我把钥匙弄丢了。",
        "slot": "钥匙",
        "cue": {
          "en": "keys",
          "ko": "열쇠"
        },
        "gloss": {
          "en": "I've lost my keys.",
          "ko": "열쇠를 잃어버렸어요."
        }
      },
      {
        "text": "我把手机弄丢了。",
        "slot": "手机",
        "cue": {
          "en": "phone",
          "ko": "휴대폰"
        },
        "gloss": {
          "en": "I've lost my phone.",
          "ko": "휴대폰을 잃어버렸어요."
        }
      },
      {
        "text": "我把护照弄丢了。",
        "slot": "护照",
        "cue": {
          "en": "passport",
          "ko": "여권"
        },
        "gloss": {
          "en": "I've lost my passport.",
          "ko": "여권을 잃어버렸어요."
        }
      },
      {
        "text": "我把钱包弄丢了。",
        "slot": "钱包",
        "cue": {
          "en": "wallet",
          "ko": "지갑"
        },
        "gloss": {
          "en": "I've lost my wallet.",
          "ko": "지갑을 잃어버렸어요."
        }
      }
    ]
  },
  {
    "id": "zh-f3-12",
    "stage": 3,
    "fn": "time-when",
    "pattern": "现在___还来得及吗？",
    "core": [
      "来得及"
    ],
    "meaning": {
      "en": "Asking if there's still time: Is there still time to ___ now?",
      "ko": "시간 되는지 묻기: 지금 ___해도 늦지 않아요?"
    },
    "grammar": [
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "现在出发还来得及吗？",
        "slot": "出发",
        "cue": {
          "en": "set off",
          "ko": "출발하다"
        },
        "gloss": {
          "en": "Is there still time if we set off now?",
          "ko": "지금 출발해도 늦지 않아요?"
        }
      },
      {
        "text": "现在去还来得及吗？",
        "slot": "去",
        "cue": {
          "en": "go",
          "ko": "가다"
        },
        "gloss": {
          "en": "Is there still time to go now?",
          "ko": "지금 가도 늦지 않아요?"
        }
      },
      {
        "text": "现在买票还来得及吗？",
        "slot": "买票",
        "cue": {
          "en": "buy tickets",
          "ko": "표를 사다"
        },
        "gloss": {
          "en": "Is there still time to buy tickets now?",
          "ko": "지금 표 사도 늦지 않아요?"
        }
      },
      {
        "text": "现在报名还来得及吗？",
        "slot": "报名",
        "cue": {
          "en": "sign up",
          "ko": "신청하다"
        },
        "gloss": {
          "en": "Is there still time to sign up now?",
          "ko": "지금 신청해도 늦지 않아요?"
        }
      }
    ]
  },
  {
    "id": "zh-f3-13",
    "stage": 3,
    "fn": "cannot",
    "pattern": "我___不了这么多。",
    "core": [
      "不了这么多"
    ],
    "meaning": {
      "en": "Saying it's too much for you: I can't ___ this much.",
      "ko": "못 한다고 말하기: 이렇게 많이는 못 ___요."
    },
    "grammar": [
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "我吃不了这么多。",
        "slot": "吃",
        "cue": {
          "en": "eat",
          "ko": "먹다"
        },
        "gloss": {
          "en": "I can't eat this much.",
          "ko": "이렇게 많이는 못 먹어요."
        }
      },
      {
        "text": "我喝不了这么多。",
        "slot": "喝",
        "cue": {
          "en": "drink",
          "ko": "마시다"
        },
        "gloss": {
          "en": "I can't drink this much.",
          "ko": "이렇게 많이는 못 마셔요."
        }
      },
      {
        "text": "我拿不了这么多。",
        "slot": "拿",
        "cue": {
          "en": "carry",
          "ko": "들다"
        },
        "gloss": {
          "en": "I can't carry this much.",
          "ko": "이렇게 많이는 못 들어요."
        }
      },
      {
        "text": "我记不了这么多。",
        "slot": "记",
        "cue": {
          "en": "remember",
          "ko": "외우다"
        },
        "gloss": {
          "en": "I can't remember this much.",
          "ko": "이렇게 많이는 못 외워요."
        }
      }
    ]
  },
  {
    "id": "zh-f3-14",
    "stage": 3,
    "fn": "not-understand",
    "pattern": "我看不清___。",
    "core": [
      "看不清"
    ],
    "meaning": {
      "en": "Saying you can't see clearly: I can't see ___ clearly.",
      "ko": "잘 안 보인다고 말하기: ___가 잘 안 보여요."
    },
    "grammar": [
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "我看不清上面的字。",
        "slot": "上面的字",
        "cue": {
          "en": "the writing on it",
          "ko": "위에 있는 글자"
        },
        "gloss": {
          "en": "I can't read the writing on it clearly.",
          "ko": "위에 있는 글자가 잘 안 보여요."
        }
      },
      {
        "text": "我看不清屏幕。",
        "slot": "屏幕",
        "cue": {
          "en": "the screen",
          "ko": "화면"
        },
        "gloss": {
          "en": "I can't see the screen clearly.",
          "ko": "화면이 잘 안 보여요."
        }
      },
      {
        "text": "我看不清那个牌子。",
        "slot": "那个牌子",
        "cue": {
          "en": "that sign",
          "ko": "저 간판"
        },
        "gloss": {
          "en": "I can't see that sign clearly.",
          "ko": "저 간판이 잘 안 보여요."
        }
      },
      {
        "text": "我看不清菜单。",
        "slot": "菜单",
        "cue": {
          "en": "the menu",
          "ko": "메뉴판"
        },
        "gloss": {
          "en": "I can't see the menu clearly.",
          "ko": "메뉴판이 잘 안 보여요."
        }
      }
    ]
  },
  {
    "id": "zh-f3-15",
    "stage": 3,
    "fn": "opinion",
    "pattern": "说实话，我觉得___。",
    "core": [
      "说实话"
    ],
    "meaning": {
      "en": "Giving an honest opinion: To be honest, I think ___.",
      "ko": "솔직한 생각 말하기: 솔직히 ___ 것 같아요."
    },
    "grammar": [],
    "expressions": [
      "说实话"
    ],
    "examples": [
      {
        "text": "说实话，我觉得有点儿贵。",
        "slot": "有点儿贵",
        "cue": {
          "en": "it's a bit expensive",
          "ko": "좀 비싸다"
        },
        "gloss": {
          "en": "To be honest, I think it's a bit expensive.",
          "ko": "솔직히 좀 비싼 것 같아요."
        }
      },
      {
        "text": "说实话，我觉得太长了。",
        "slot": "太长了",
        "cue": {
          "en": "it's too long",
          "ko": "너무 길다"
        },
        "gloss": {
          "en": "To be honest, I think it's too long.",
          "ko": "솔직히 너무 긴 것 같아요."
        }
      },
      {
        "text": "说实话，我觉得挺好看的。",
        "slot": "挺好看的",
        "cue": {
          "en": "it looks pretty good",
          "ko": "꽤 예쁘다"
        },
        "gloss": {
          "en": "To be honest, I think it looks pretty good.",
          "ko": "솔직히 꽤 예쁜 것 같아요."
        }
      },
      {
        "text": "说实话，我觉得没那么好。",
        "slot": "没那么好",
        "cue": {
          "en": "it's not that good",
          "ko": "그렇게 좋지 않다"
        },
        "gloss": {
          "en": "To be honest, I don't think it's that good.",
          "ko": "솔직히 그렇게 좋지는 않은 것 같아요."
        }
      }
    ]
  },
  {
    "id": "zh-f3-16",
    "stage": 3,
    "fn": "agree",
    "pattern": "你说得对，___。",
    "core": [
      "你说得对"
    ],
    "meaning": {
      "en": "Agreeing and adding: You're right, ___.",
      "ko": "동의하기: 네 말이 맞아, ___."
    },
    "grammar": [
      3
    ],
    "expressions": [
      "你说得对"
    ],
    "examples": [
      {
        "text": "你说得对，我们先走吧。",
        "slot": "我们先走吧",
        "cue": {
          "en": "let's go first",
          "ko": "우리 먼저 가자"
        },
        "gloss": {
          "en": "You're right, let's head off first.",
          "ko": "네 말이 맞아, 우리 먼저 가자."
        }
      },
      {
        "text": "你说得对，是我的错。",
        "slot": "是我的错",
        "cue": {
          "en": "it's my fault",
          "ko": "내 잘못이다"
        },
        "gloss": {
          "en": "You're right, it's my fault.",
          "ko": "네 말이 맞아, 내 잘못이야."
        }
      },
      {
        "text": "你说得对，太贵了。",
        "slot": "太贵了",
        "cue": {
          "en": "it's too expensive",
          "ko": "너무 비싸다"
        },
        "gloss": {
          "en": "You're right, it's too expensive.",
          "ko": "네 말이 맞아, 너무 비싸."
        }
      },
      {
        "text": "你说得对，应该早点儿订票。",
        "slot": "应该早点儿订票",
        "cue": {
          "en": "we should book early",
          "ko": "일찍 예매해야 한다"
        },
        "gloss": {
          "en": "You're right, we should book tickets early.",
          "ko": "네 말이 맞아, 표는 일찍 예매해야 해."
        }
      }
    ]
  },
  {
    "id": "zh-f3-17",
    "stage": 3,
    "fn": "hearsay",
    "pattern": "听说___。",
    "core": [
      "听说"
    ],
    "meaning": {
      "en": "Passing on what you heard: I heard ___.",
      "ko": "들은 말 전하기: ___래요."
    },
    "grammar": [],
    "expressions": [
      "听说"
    ],
    "examples": [
      {
        "text": "听说明天会下雨。",
        "slot": "明天会下雨",
        "cue": {
          "en": "it'll rain tomorrow",
          "ko": "내일 비가 온다"
        },
        "gloss": {
          "en": "I heard it'll rain tomorrow.",
          "ko": "내일 비가 온대요."
        }
      },
      {
        "text": "听说那家店很好吃。",
        "slot": "那家店很好吃",
        "cue": {
          "en": "that place is really good",
          "ko": "그 가게가 맛있다"
        },
        "gloss": {
          "en": "I heard that place is really good.",
          "ko": "그 가게 맛있대요."
        }
      },
      {
        "text": "听说他回国了。",
        "slot": "他回国了",
        "cue": {
          "en": "he went back to his country",
          "ko": "그가 귀국했다"
        },
        "gloss": {
          "en": "I heard he went back home.",
          "ko": "그 사람 귀국했대요."
        }
      },
      {
        "text": "听说这部剧很火。",
        "slot": "这部剧很火",
        "cue": {
          "en": "this drama is really popular",
          "ko": "이 드라마가 인기다"
        },
        "gloss": {
          "en": "I heard this drama is really popular.",
          "ko": "이 드라마 인기 많대요."
        }
      }
    ]
  },
  {
    "id": "zh-f3-18",
    "stage": 3,
    "fn": "changed",
    "pattern": "现在越来越___了。",
    "core": [
      "越来越"
    ],
    "meaning": {
      "en": "Saying something keeps changing: It's getting more and more ___ now.",
      "ko": "변했다고 말하기: 요즘 점점 ___져요."
    },
    "grammar": [],
    "expressions": [
      "越来越"
    ],
    "examples": [
      {
        "text": "现在越来越冷了。",
        "slot": "冷",
        "cue": {
          "en": "cold",
          "ko": "춥다"
        },
        "gloss": {
          "en": "It's getting colder and colder.",
          "ko": "요즘 점점 추워져요."
        }
      },
      {
        "text": "现在越来越贵了。",
        "slot": "贵",
        "cue": {
          "en": "expensive",
          "ko": "비싸다"
        },
        "gloss": {
          "en": "Things are getting more and more expensive.",
          "ko": "요즘 점점 비싸져요."
        }
      },
      {
        "text": "现在越来越方便了。",
        "slot": "方便",
        "cue": {
          "en": "convenient",
          "ko": "편리하다"
        },
        "gloss": {
          "en": "It's getting more and more convenient.",
          "ko": "요즘 점점 편리해져요."
        }
      },
      {
        "text": "现在越来越忙了。",
        "slot": "忙",
        "cue": {
          "en": "busy",
          "ko": "바쁘다"
        },
        "gloss": {
          "en": "I'm getting busier and busier.",
          "ko": "요즘 점점 바빠져요."
        }
      }
    ]
  },
  {
    "id": "zh-f3-19",
    "stage": 3,
    "fn": "rephrase",
    "pattern": "我的意思是___。",
    "core": [
      "我的意思是"
    ],
    "meaning": {
      "en": "Saying it another way: What I mean is ___.",
      "ko": "다르게 말하기: 제 말은 ___라는 거예요."
    },
    "grammar": [],
    "expressions": [
      "我的意思是"
    ],
    "examples": [
      {
        "text": "我的意思是先别买。",
        "slot": "先别买",
        "cue": {
          "en": "don't buy it yet",
          "ko": "아직 사지 말자"
        },
        "gloss": {
          "en": "What I mean is, don't buy it yet.",
          "ko": "제 말은 아직 사지 말자는 거예요."
        }
      },
      {
        "text": "我的意思是我们换个时间。",
        "slot": "我们换个时间",
        "cue": {
          "en": "let's pick another time",
          "ko": "시간을 바꾸자"
        },
        "gloss": {
          "en": "What I mean is, let's pick another time.",
          "ko": "제 말은 시간을 바꾸자는 거예요."
        }
      },
      {
        "text": "我的意思是价格有点儿高。",
        "slot": "价格有点儿高",
        "cue": {
          "en": "the price is a bit high",
          "ko": "가격이 좀 높다"
        },
        "gloss": {
          "en": "What I mean is, the price is a bit high.",
          "ko": "제 말은 가격이 좀 높다는 거예요."
        }
      },
      {
        "text": "我的意思是不用那么着急。",
        "slot": "不用那么着急",
        "cue": {
          "en": "there's no need to rush",
          "ko": "그렇게 서두를 필요 없다"
        },
        "gloss": {
          "en": "What I mean is, there's no need to rush.",
          "ko": "제 말은 그렇게 서두를 필요 없다는 거예요."
        }
      }
    ]
  },
  {
    "id": "zh-f4-01",
    "stage": 4,
    "fn": "concede",
    "pattern": "虽然___，但是我还是想试试。",
    "core": [
      "虽然",
      "但是"
    ],
    "meaning": {
      "en": "Admitting a downside but going on: Although ___, I still want to try.",
      "ko": "단점을 인정하고 밀고 나가기: 비록 ___지만, 그래도 해 보고 싶어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "虽然有点儿贵，但是我还是想试试。",
        "slot": "有点儿贵",
        "cue": {
          "en": "a bit expensive",
          "ko": "좀 비싸다"
        },
        "gloss": {
          "en": "Although it's a bit expensive, I still want to try it.",
          "ko": "좀 비싸긴 하지만 그래도 해 보고 싶어요."
        }
      },
      {
        "text": "虽然时间很紧，但是我还是想试试。",
        "slot": "时间很紧",
        "cue": {
          "en": "time is tight",
          "ko": "시간이 빠듯하다"
        },
        "gloss": {
          "en": "Although time is tight, I still want to give it a go.",
          "ko": "시간이 빠듯하지만 그래도 해 보고 싶어요."
        }
      },
      {
        "text": "虽然我没有经验，但是我还是想试试。",
        "slot": "我没有经验",
        "cue": {
          "en": "I have no experience",
          "ko": "경험이 없다"
        },
        "gloss": {
          "en": "Although I have no experience, I still want to try.",
          "ko": "경험은 없지만 그래도 해 보고 싶어요."
        }
      },
      {
        "text": "虽然大家都说很难，但是我还是想试试。",
        "slot": "大家都说很难",
        "cue": {
          "en": "everyone says it's hard",
          "ko": "다들 어렵다고 하다"
        },
        "gloss": {
          "en": "Although everyone says it's hard, I still want to try.",
          "ko": "다들 어렵다고 하지만 그래도 해 보고 싶어요."
        }
      }
    ]
  },
  {
    "id": "zh-f4-02",
    "stage": 4,
    "fn": "pros-cons",
    "pattern": "这个办法不但___，而且很省时间。",
    "core": [
      "不但",
      "而且"
    ],
    "meaning": {
      "en": "Stacking up advantages: This approach is not only ___, but also saves time.",
      "ko": "장점 더하기: 이 방법은 ___할 뿐만 아니라 시간도 아껴요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "这个办法不但省钱，而且很省时间。",
        "slot": "省钱",
        "cue": {
          "en": "save money",
          "ko": "돈을 아끼다"
        },
        "gloss": {
          "en": "This approach not only saves money but also saves time.",
          "ko": "이 방법은 돈도 아낄 뿐만 아니라 시간도 아껴요."
        }
      },
      {
        "text": "这个办法不但简单，而且很省时间。",
        "slot": "简单",
        "cue": {
          "en": "simple",
          "ko": "간단하다"
        },
        "gloss": {
          "en": "This approach is not only simple but also saves time.",
          "ko": "이 방법은 간단할 뿐만 아니라 시간도 아껴요."
        }
      },
      {
        "text": "这个办法不但更安全，而且很省时间。",
        "slot": "更安全",
        "cue": {
          "en": "safer",
          "ko": "더 안전하다"
        },
        "gloss": {
          "en": "This approach is not only safer but also saves time.",
          "ko": "이 방법은 더 안전할 뿐만 아니라 시간도 아껴요."
        }
      },
      {
        "text": "这个办法不但对环境好，而且很省时间。",
        "slot": "对环境好",
        "cue": {
          "en": "good for the environment",
          "ko": "환경에 좋다"
        },
        "gloss": {
          "en": "This approach is not only good for the environment but also saves time.",
          "ko": "이 방법은 환경에 좋을 뿐만 아니라 시간도 아껴요."
        }
      }
    ]
  },
  {
    "id": "zh-f4-03",
    "stage": 4,
    "fn": "report",
    "pattern": "我们的提议被___否决了。",
    "core": [
      "被",
      "否决了"
    ],
    "meaning": {
      "en": "Reporting a rejection: Our proposal was turned down by ___.",
      "ko": "거절당한 것 보고하기: 우리 제안이 ___에게 거절됐어요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "我们的提议被老板否决了。",
        "slot": "老板",
        "cue": {
          "en": "the boss",
          "ko": "사장님"
        },
        "gloss": {
          "en": "Our proposal was turned down by the boss.",
          "ko": "우리 제안이 사장님한테 거절됐어요."
        }
      },
      {
        "text": "我们的提议被客户否决了。",
        "slot": "客户",
        "cue": {
          "en": "the client",
          "ko": "고객"
        },
        "gloss": {
          "en": "Our proposal was turned down by the client.",
          "ko": "우리 제안이 고객한테 거절됐어요."
        }
      },
      {
        "text": "我们的提议被财务部否决了。",
        "slot": "财务部",
        "cue": {
          "en": "the finance department",
          "ko": "재무팀"
        },
        "gloss": {
          "en": "Our proposal was turned down by the finance department.",
          "ko": "우리 제안이 재무팀에서 거절됐어요."
        }
      },
      {
        "text": "我们的提议被董事会否决了。",
        "slot": "董事会",
        "cue": {
          "en": "the board",
          "ko": "이사회"
        },
        "gloss": {
          "en": "Our proposal was turned down by the board.",
          "ko": "우리 제안이 이사회에서 거절됐어요."
        }
      }
    ]
  },
  {
    "id": "zh-f4-04",
    "stage": 4,
    "fn": "condition",
    "pattern": "只要___，就能看出效果。",
    "core": [
      "只要",
      "就"
    ],
    "meaning": {
      "en": "Stating a sufficient condition: As long as ___, you'll see results.",
      "ko": "조건 하나면 된다고 말하기: ___기만 하면 효과가 보일 거예요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "只要大家都习惯了，就能看出效果。",
        "slot": "大家都习惯了",
        "cue": {
          "en": "everyone gets used to it",
          "ko": "다들 익숙해지다"
        },
        "gloss": {
          "en": "As long as everyone gets used to it, we'll see results.",
          "ko": "다들 익숙해지기만 하면 효과가 보일 거예요."
        }
      },
      {
        "text": "只要每天坚持练习，就能看出效果。",
        "slot": "每天坚持练习",
        "cue": {
          "en": "keep practising every day",
          "ko": "매일 꾸준히 연습하다"
        },
        "gloss": {
          "en": "As long as you keep practising every day, you'll see results.",
          "ko": "매일 꾸준히 연습하기만 하면 효과가 보일 거예요."
        }
      },
      {
        "text": "只要按时吃药，就能看出效果。",
        "slot": "按时吃药",
        "cue": {
          "en": "take the medicine on time",
          "ko": "약을 제때 먹다"
        },
        "gloss": {
          "en": "As long as you take the medicine on time, you'll see results.",
          "ko": "약을 제때 먹기만 하면 효과가 보일 거예요."
        }
      },
      {
        "text": "只要少喝点儿饮料，就能看出效果。",
        "slot": "少喝点儿饮料",
        "cue": {
          "en": "drink fewer soft drinks",
          "ko": "음료를 덜 마시다"
        },
        "gloss": {
          "en": "As long as you drink fewer soft drinks, you'll see results.",
          "ko": "음료만 덜 마셔도 효과가 보일 거예요."
        }
      }
    ]
  },
  {
    "id": "zh-f4-05",
    "stage": 4,
    "fn": "negotiate",
    "pattern": "只有___，我们才能按时完成。",
    "core": [
      "只有",
      "才能"
    ],
    "meaning": {
      "en": "Naming the only condition: Only if ___ can we finish on time.",
      "ko": "유일한 조건 말하기: ___해야만 제때 끝낼 수 있어요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "只有再加两个人，我们才能按时完成。",
        "slot": "再加两个人",
        "cue": {
          "en": "add two more people",
          "ko": "두 사람을 더 넣다"
        },
        "gloss": {
          "en": "Only if we add two more people can we finish on time.",
          "ko": "두 사람을 더 넣어야만 제때 끝낼 수 있어요."
        }
      },
      {
        "text": "只有客户早点儿确认，我们才能按时完成。",
        "slot": "客户早点儿确认",
        "cue": {
          "en": "the client confirms earlier",
          "ko": "고객이 일찍 확인해 주다"
        },
        "gloss": {
          "en": "Only if the client confirms earlier can we finish on time.",
          "ko": "고객이 일찍 확인해 줘야만 제때 끝낼 수 있어요."
        }
      },
      {
        "text": "只有周末也加班，我们才能按时完成。",
        "slot": "周末也加班",
        "cue": {
          "en": "work weekends too",
          "ko": "주말에도 일하다"
        },
        "gloss": {
          "en": "Only if we work weekends too can we finish on time.",
          "ko": "주말에도 일해야만 제때 끝낼 수 있어요."
        }
      },
      {
        "text": "只有先把需求定下来，我们才能按时完成。",
        "slot": "先把需求定下来",
        "cue": {
          "en": "settle the requirements first",
          "ko": "요구 사항을 먼저 정하다"
        },
        "gloss": {
          "en": "Only if we settle the requirements first can we finish on time.",
          "ko": "요구 사항을 먼저 정해야만 제때 끝낼 수 있어요."
        }
      }
    ]
  },
  {
    "id": "zh-f4-06",
    "stage": 4,
    "fn": "persuade",
    "pattern": "难道你没___吗？",
    "core": [
      "难道",
      "吗"
    ],
    "meaning": {
      "en": "Pushing back with a rhetorical question: Don't tell me you haven't ___?",
      "ko": "반어로 되묻기: 설마 ___ 안 했다는 거예요?"
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "难道你没看过那条新闻吗？",
        "slot": "看过那条新闻",
        "cue": {
          "en": "see that news story",
          "ko": "그 뉴스를 보다"
        },
        "gloss": {
          "en": "Don't tell me you haven't seen that news story?",
          "ko": "설마 그 뉴스 못 봤어요?"
        }
      },
      {
        "text": "难道你没收到我的邮件吗？",
        "slot": "收到我的邮件",
        "cue": {
          "en": "get my email",
          "ko": "내 메일을 받다"
        },
        "gloss": {
          "en": "Don't tell me you didn't get my email?",
          "ko": "설마 제 메일 못 받았어요?"
        }
      },
      {
        "text": "难道你没检查地址吗？",
        "slot": "检查地址",
        "cue": {
          "en": "check the address",
          "ko": "주소를 확인하다"
        },
        "gloss": {
          "en": "Don't tell me you didn't check the address?",
          "ko": "설마 주소를 확인 안 했어요?"
        }
      },
      {
        "text": "难道你没听说他要走了吗？",
        "slot": "听说他要走了",
        "cue": {
          "en": "hear that he's leaving",
          "ko": "그가 떠난다는 말을 듣다"
        },
        "gloss": {
          "en": "Don't tell me you haven't heard he's leaving?",
          "ko": "설마 그 사람 떠난다는 얘기 못 들었어요?"
        }
      }
    ]
  },
  {
    "id": "zh-f4-07",
    "stage": 4,
    "fn": "story-past",
    "pattern": "我突然想起来，___。",
    "core": [
      "想起来"
    ],
    "meaning": {
      "en": "Suddenly remembering something: I just remembered — ___.",
      "ko": "갑자기 떠올리기: 갑자기 생각났는데, ___."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "我突然想起来，合同还没签。",
        "slot": "合同还没签",
        "cue": {
          "en": "the contract isn't signed yet",
          "ko": "계약서에 아직 서명 안 하다"
        },
        "gloss": {
          "en": "I just remembered, the contract hasn't been signed yet.",
          "ko": "갑자기 생각났는데, 계약서에 아직 서명을 안 했어요."
        }
      },
      {
        "text": "我突然想起来，今天是她的生日。",
        "slot": "今天是她的生日",
        "cue": {
          "en": "today is her birthday",
          "ko": "오늘이 그녀 생일이다"
        },
        "gloss": {
          "en": "I just remembered, today is her birthday.",
          "ko": "갑자기 생각났는데, 오늘이 그 사람 생일이에요."
        }
      },
      {
        "text": "我突然想起来，钥匙放在办公室了。",
        "slot": "钥匙放在办公室了",
        "cue": {
          "en": "the keys are at the office",
          "ko": "열쇠를 사무실에 두다"
        },
        "gloss": {
          "en": "I just remembered, I left the keys at the office.",
          "ko": "갑자기 생각났는데, 열쇠를 사무실에 두고 왔어요."
        }
      },
      {
        "text": "我突然想起来，我们去年也遇到过这种事。",
        "slot": "我们去年也遇到过这种事",
        "cue": {
          "en": "we ran into this last year too",
          "ko": "작년에도 이런 일을 겪다"
        },
        "gloss": {
          "en": "I just remembered, we ran into the same thing last year.",
          "ko": "갑자기 생각났는데, 작년에도 이런 일이 있었어요."
        }
      }
    ]
  },
  {
    "id": "zh-f4-08",
    "stage": 4,
    "fn": "opinion",
    "pattern": "___，我实在看不下去了。",
    "core": [
      "看不下去"
    ],
    "meaning": {
      "en": "Saying you can't bear to watch any more: ___ — I really can't stand watching it.",
      "ko": "더는 못 봐주겠다고 말하기: ___, 정말 더는 못 보겠어요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "评论里全是骂人的话，我实在看不下去了。",
        "slot": "评论里全是骂人的话",
        "cue": {
          "en": "the comments are all insults",
          "ko": "댓글이 다 욕이다"
        },
        "gloss": {
          "en": "The comments are nothing but insults — I really can't keep reading.",
          "ko": "댓글이 다 욕이라 정말 더는 못 보겠어요."
        }
      },
      {
        "text": "他这样对待员工，我实在看不下去了。",
        "slot": "他这样对待员工",
        "cue": {
          "en": "he treats staff like this",
          "ko": "그가 직원을 이렇게 대하다"
        },
        "gloss": {
          "en": "The way he treats his staff — I really can't stand watching it.",
          "ko": "그 사람이 직원을 저렇게 대하니 정말 더는 못 보겠어요."
        }
      },
      {
        "text": "这部剧越拍越乱，我实在看不下去了。",
        "slot": "这部剧越拍越乱",
        "cue": {
          "en": "the show keeps getting messier",
          "ko": "이 드라마가 갈수록 엉망이다"
        },
        "gloss": {
          "en": "This show keeps getting messier — I really can't keep watching.",
          "ko": "이 드라마가 갈수록 엉망이라 정말 더는 못 보겠어요."
        }
      },
      {
        "text": "你们俩天天吵架，我实在看不下去了。",
        "slot": "你们俩天天吵架",
        "cue": {
          "en": "you two argue every day",
          "ko": "너희 둘이 매일 싸우다"
        },
        "gloss": {
          "en": "You two argue every single day — I really can't stand watching it.",
          "ko": "너희 둘이 매일 싸우니 정말 더는 못 보겠어."
        }
      }
    ]
  },
  {
    "id": "zh-f4-09",
    "stage": 4,
    "fn": "advice-give",
    "pattern": "既然___，就别着急了。",
    "core": [
      "既然",
      "就别"
    ],
    "meaning": {
      "en": "Reasoning from a given fact: Since ___, there's no point rushing.",
      "ko": "이미 그렇다면 하고 권하기: 기왕 ___니까 서두르지 마세요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "既然已经晚了，就别着急了。",
        "slot": "已经晚了",
        "cue": {
          "en": "it's already late",
          "ko": "이미 늦다"
        },
        "gloss": {
          "en": "Since we're already late, there's no point rushing.",
          "ko": "이미 늦었으니까 서두르지 마세요."
        }
      },
      {
        "text": "既然飞机延误了，就别着急了。",
        "slot": "飞机延误了",
        "cue": {
          "en": "the flight is delayed",
          "ko": "비행기가 지연되다"
        },
        "gloss": {
          "en": "Since the flight is delayed, there's no need to rush.",
          "ko": "비행기가 지연됐으니까 서두르지 마세요."
        }
      },
      {
        "text": "既然结果还没出来，就别着急了。",
        "slot": "结果还没出来",
        "cue": {
          "en": "the results aren't out yet",
          "ko": "결과가 아직 안 나오다"
        },
        "gloss": {
          "en": "Since the results aren't out yet, don't get worked up.",
          "ko": "결과가 아직 안 나왔으니까 조급해하지 마세요."
        }
      },
      {
        "text": "既然老板说下周再交，就别着急了。",
        "slot": "老板说下周再交",
        "cue": {
          "en": "the boss said hand it in next week",
          "ko": "사장님이 다음 주에 내라고 하다"
        },
        "gloss": {
          "en": "Since the boss said to hand it in next week, there's no rush.",
          "ko": "사장님이 다음 주에 내라고 했으니까 서두르지 마세요."
        }
      }
    ]
  },
  {
    "id": "zh-f4-10",
    "stage": 4,
    "fn": "disagree-soft",
    "pattern": "我不太同意，___。",
    "core": [
      "我不太同意"
    ],
    "meaning": {
      "en": "Disagreeing politely: I don't quite agree — ___.",
      "ko": "정중하게 반대하기: 저는 좀 생각이 달라요, ___."
    },
    "grammar": [],
    "expressions": [
      "我不太同意"
    ],
    "examples": [
      {
        "text": "我不太同意，在家工作不见得更好。",
        "slot": "在家工作不见得更好",
        "cue": {
          "en": "working from home isn't necessarily better",
          "ko": "재택근무가 꼭 더 낫진 않다"
        },
        "gloss": {
          "en": "I don't quite agree — working from home isn't necessarily better.",
          "ko": "저는 좀 생각이 달라요, 재택근무가 꼭 더 나은 건 아니에요."
        }
      },
      {
        "text": "我不太同意，价格不是最重要的。",
        "slot": "价格不是最重要的",
        "cue": {
          "en": "price isn't the most important thing",
          "ko": "가격이 제일 중요한 건 아니다"
        },
        "gloss": {
          "en": "I don't quite agree — price isn't the most important thing.",
          "ko": "저는 좀 생각이 달라요, 가격이 제일 중요한 건 아니에요."
        }
      },
      {
        "text": "我不太同意，这个问题没那么简单。",
        "slot": "这个问题没那么简单",
        "cue": {
          "en": "this problem isn't that simple",
          "ko": "이 문제는 그렇게 간단하지 않다"
        },
        "gloss": {
          "en": "I don't quite agree — this problem isn't that simple.",
          "ko": "저는 좀 생각이 달라요, 이 문제는 그렇게 간단하지 않아요."
        }
      },
      {
        "text": "我不太同意，我们应该先听听用户的意见。",
        "slot": "我们应该先听听用户的意见",
        "cue": {
          "en": "we should hear from users first",
          "ko": "사용자 의견을 먼저 들어야 하다"
        },
        "gloss": {
          "en": "I don't quite agree — we should hear what users think first.",
          "ko": "저는 좀 생각이 달라요, 사용자 의견부터 들어 봐야 해요."
        }
      }
    ]
  },
  {
    "id": "zh-f4-11",
    "stage": 4,
    "fn": "concede",
    "pattern": "话虽如此，___。",
    "core": [
      "话虽如此"
    ],
    "meaning": {
      "en": "Granting a point, then turning: That said, ___.",
      "ko": "인정하고 돌리기: 그렇긴 하지만, ___."
    },
    "grammar": [],
    "expressions": [
      "话虽如此"
    ],
    "examples": [
      {
        "text": "话虽如此，在家很容易分心。",
        "slot": "在家很容易分心",
        "cue": {
          "en": "it's easy to get distracted at home",
          "ko": "집에서는 쉽게 산만해지다"
        },
        "gloss": {
          "en": "That said, it's easy to get distracted at home.",
          "ko": "그렇긴 하지만 집에서는 쉽게 산만해져요."
        }
      },
      {
        "text": "话虽如此，那个小哥还是真了不起。",
        "slot": "那个小哥还是真了不起",
        "cue": {
          "en": "that young guy is still amazing",
          "ko": "그 청년은 그래도 정말 대단하다"
        },
        "gloss": {
          "en": "That said, that young guy is still really amazing.",
          "ko": "그렇긴 해도 그 청년은 정말 대단해요."
        }
      },
      {
        "text": "话虽如此，我们还是得按规定来。",
        "slot": "我们还是得按规定来",
        "cue": {
          "en": "we still have to follow the rules",
          "ko": "그래도 규정대로 해야 하다"
        },
        "gloss": {
          "en": "That said, we still have to go by the rules.",
          "ko": "그렇긴 하지만 그래도 규정대로 해야 해요."
        }
      },
      {
        "text": "话虽如此，这次的机会确实难得。",
        "slot": "这次的机会确实难得",
        "cue": {
          "en": "this chance really is rare",
          "ko": "이번 기회는 정말 흔치 않다"
        },
        "gloss": {
          "en": "That said, this opportunity really is a rare one.",
          "ko": "그렇긴 하지만 이번 기회는 정말 흔치 않아요."
        }
      }
    ]
  },
  {
    "id": "zh-f4-12",
    "stage": 4,
    "fn": "report",
    "pattern": "问题在于___。",
    "core": [
      "问题在于"
    ],
    "meaning": {
      "en": "Pinpointing the real problem: The problem is that ___.",
      "ko": "문제의 핵심 짚기: 문제는 ___는 거예요."
    },
    "grammar": [],
    "expressions": [
      "问题在于"
    ],
    "examples": [
      {
        "text": "问题在于测试的时候发现了很多错误。",
        "slot": "测试的时候发现了很多错误",
        "cue": {
          "en": "many bugs were found in testing",
          "ko": "테스트에서 오류가 많이 나오다"
        },
        "gloss": {
          "en": "The problem is that a lot of bugs turned up in testing.",
          "ko": "문제는 테스트에서 오류가 많이 나왔다는 거예요."
        }
      },
      {
        "text": "问题在于我们没有足够的预算。",
        "slot": "我们没有足够的预算",
        "cue": {
          "en": "we don't have enough budget",
          "ko": "예산이 부족하다"
        },
        "gloss": {
          "en": "The problem is that we don't have enough budget.",
          "ko": "문제는 예산이 부족하다는 거예요."
        }
      },
      {
        "text": "问题在于没有人愿意负责。",
        "slot": "没有人愿意负责",
        "cue": {
          "en": "nobody wants to take responsibility",
          "ko": "아무도 책임지려 하지 않다"
        },
        "gloss": {
          "en": "The problem is that nobody wants to take responsibility.",
          "ko": "문제는 아무도 책임지려 하지 않는다는 거예요."
        }
      },
      {
        "text": "问题在于客户一直在改需求。",
        "slot": "客户一直在改需求",
        "cue": {
          "en": "the client keeps changing requirements",
          "ko": "고객이 계속 요구를 바꾸다"
        },
        "gloss": {
          "en": "The problem is that the client keeps changing the requirements.",
          "ko": "문제는 고객이 계속 요구 사항을 바꾼다는 거예요."
        }
      }
    ]
  },
  {
    "id": "zh-f4-13",
    "stage": 4,
    "fn": "not-necessarily",
    "pattern": "___不见得更好。",
    "core": [
      "不见得"
    ],
    "meaning": {
      "en": "Saying it's not necessarily so: ___ isn't necessarily better.",
      "ko": "꼭 그렇진 않다고 말하기: ___가 꼭 더 낫진 않아요."
    },
    "grammar": [],
    "expressions": [
      "不见得"
    ],
    "examples": [
      {
        "text": "在家工作不见得更好。",
        "slot": "在家工作",
        "cue": {
          "en": "working from home",
          "ko": "재택근무"
        },
        "gloss": {
          "en": "Working from home isn't necessarily better.",
          "ko": "재택근무가 꼭 더 낫진 않아요."
        }
      },
      {
        "text": "贵的东西不见得更好。",
        "slot": "贵的东西",
        "cue": {
          "en": "expensive things",
          "ko": "비싼 물건"
        },
        "gloss": {
          "en": "Expensive things aren't necessarily better.",
          "ko": "비싼 게 꼭 더 좋은 건 아니에요."
        }
      },
      {
        "text": "大公司不见得更好。",
        "slot": "大公司",
        "cue": {
          "en": "big companies",
          "ko": "대기업"
        },
        "gloss": {
          "en": "A big company isn't necessarily better.",
          "ko": "대기업이 꼭 더 낫진 않아요."
        }
      },
      {
        "text": "新版本不见得更好。",
        "slot": "新版本",
        "cue": {
          "en": "the new version",
          "ko": "새 버전"
        },
        "gloss": {
          "en": "The new version isn't necessarily better.",
          "ko": "새 버전이 꼭 더 좋은 건 아니에요."
        }
      }
    ]
  },
  {
    "id": "zh-f4-14",
    "stage": 4,
    "fn": "report",
    "pattern": "据我所知，___。",
    "core": [
      "据我所知"
    ],
    "meaning": {
      "en": "Sharing what you know with caution: As far as I know, ___.",
      "ko": "아는 범위에서 말하기: 제가 알기로는 ___."
    },
    "grammar": [],
    "expressions": [
      "据我所知"
    ],
    "examples": [
      {
        "text": "据我所知，隔壁组下个月有两个人空出来。",
        "slot": "隔壁组下个月有两个人空出来",
        "cue": {
          "en": "two people next door free up next month",
          "ko": "옆 팀에 다음 달 두 사람이 비다"
        },
        "gloss": {
          "en": "As far as I know, two people on the next team free up next month.",
          "ko": "제가 알기로는 옆 팀에서 다음 달에 두 사람이 비어요."
        }
      },
      {
        "text": "据我所知，当地警察已经证实了。",
        "slot": "当地警察已经证实了",
        "cue": {
          "en": "the local police have confirmed it",
          "ko": "현지 경찰이 이미 확인하다"
        },
        "gloss": {
          "en": "As far as I know, the local police have already confirmed it.",
          "ko": "제가 알기로는 현지 경찰이 이미 확인했어요."
        }
      },
      {
        "text": "据我所知，这家店下周就关门了。",
        "slot": "这家店下周就关门了",
        "cue": {
          "en": "this shop closes next week",
          "ko": "이 가게가 다음 주에 문을 닫다"
        },
        "gloss": {
          "en": "As far as I know, this shop is closing next week.",
          "ko": "제가 알기로는 이 가게가 다음 주에 문을 닫아요."
        }
      },
      {
        "text": "据我所知，他已经辞职了。",
        "slot": "他已经辞职了",
        "cue": {
          "en": "he has already resigned",
          "ko": "그가 이미 그만두다"
        },
        "gloss": {
          "en": "As far as I know, he has already resigned.",
          "ko": "제가 알기로는 그 사람 이미 그만뒀어요."
        }
      }
    ]
  },
  {
    "id": "zh-f4-15",
    "stage": 4,
    "fn": "negotiate",
    "pattern": "___，你看怎么样？",
    "core": [
      "你看怎么样"
    ],
    "meaning": {
      "en": "Putting a proposal on the table: ___ — how does that sound to you?",
      "ko": "제안하고 의견 묻기: ___, 어떻게 생각하세요?"
    },
    "grammar": [],
    "expressions": [
      "你看怎么样"
    ],
    "examples": [
      {
        "text": "我们再加两个测试人员，你看怎么样？",
        "slot": "我们再加两个测试人员",
        "cue": {
          "en": "we add two more testers",
          "ko": "테스터를 두 명 더 넣다"
        },
        "gloss": {
          "en": "We add two more testers — how does that sound?",
          "ko": "테스터를 두 명 더 넣는 건 어떻게 생각하세요?"
        }
      },
      {
        "text": "下周三再开一次会，你看怎么样？",
        "slot": "下周三再开一次会",
        "cue": {
          "en": "meet again next Wednesday",
          "ko": "다음 주 수요일에 다시 회의하다"
        },
        "gloss": {
          "en": "Let's meet again next Wednesday — how does that sound?",
          "ko": "다음 주 수요일에 한 번 더 회의하는 건 어떠세요?"
        }
      },
      {
        "text": "价格降一点，订单多一点，你看怎么样？",
        "slot": "价格降一点，订单多一点",
        "cue": {
          "en": "lower the price a bit, order a bit more",
          "ko": "가격은 좀 내리고 주문은 좀 늘리다"
        },
        "gloss": {
          "en": "A slightly lower price for a slightly bigger order — what do you think?",
          "ko": "가격을 좀 내리고 주문을 좀 늘리는 건 어떠세요?"
        }
      },
      {
        "text": "先做一个小范围的试点，你看怎么样？",
        "slot": "先做一个小范围的试点",
        "cue": {
          "en": "run a small pilot first",
          "ko": "먼저 작은 범위로 시범 운영하다"
        },
        "gloss": {
          "en": "Let's run a small pilot first — how does that sound?",
          "ko": "먼저 작게 시범 운영해 보는 건 어떠세요?"
        }
      }
    ]
  },
  {
    "id": "zh-f4-16",
    "stage": 4,
    "fn": "persuade",
    "pattern": "关键是___。",
    "core": [
      "关键是"
    ],
    "meaning": {
      "en": "Naming what really matters: The key is ___.",
      "ko": "핵심 짚기: 중요한 건 ___라는 거예요."
    },
    "grammar": [],
    "expressions": [
      "关键是"
    ],
    "examples": [
      {
        "text": "关键是公司要有好的管理制度。",
        "slot": "公司要有好的管理制度",
        "cue": {
          "en": "the company needs a good management system",
          "ko": "회사에 좋은 관리 제도가 있어야 하다"
        },
        "gloss": {
          "en": "The key is that the company needs a good management system.",
          "ko": "중요한 건 회사에 좋은 관리 제도가 있어야 한다는 거예요."
        }
      },
      {
        "text": "关键是大家要互相信任。",
        "slot": "大家要互相信任",
        "cue": {
          "en": "everyone has to trust each other",
          "ko": "서로 믿어야 하다"
        },
        "gloss": {
          "en": "The key is that everyone has to trust each other.",
          "ko": "중요한 건 서로 믿어야 한다는 거예요."
        }
      },
      {
        "text": "关键是你自己想不想去。",
        "slot": "你自己想不想去",
        "cue": {
          "en": "whether you yourself want to go",
          "ko": "네가 가고 싶은지"
        },
        "gloss": {
          "en": "The key is whether you actually want to go.",
          "ko": "중요한 건 네가 가고 싶은지야."
        }
      },
      {
        "text": "关键是要先找到问题的原因。",
        "slot": "要先找到问题的原因",
        "cue": {
          "en": "find the cause of the problem first",
          "ko": "문제의 원인부터 찾다"
        },
        "gloss": {
          "en": "The key is to find the cause of the problem first.",
          "ko": "중요한 건 문제의 원인부터 찾는 거예요."
        }
      }
    ]
  },
  {
    "id": "zh-f4-17",
    "stage": 4,
    "fn": "report",
    "pattern": "总的来说，___。",
    "core": [
      "总的来说"
    ],
    "meaning": {
      "en": "Summing up: All in all, ___.",
      "ko": "정리해 말하기: 전체적으로 보면 ___."
    },
    "grammar": [],
    "expressions": [
      "总的来说"
    ],
    "examples": [
      {
        "text": "总的来说，我希望以后不再发生这种事。",
        "slot": "我希望以后不再发生这种事",
        "cue": {
          "en": "I hope this never happens again",
          "ko": "앞으로 이런 일이 없길 바라다"
        },
        "gloss": {
          "en": "All in all, I hope this never happens again.",
          "ko": "전체적으로 말하면, 앞으로 이런 일이 다시 없었으면 해요."
        }
      },
      {
        "text": "总的来说，这次活动办得很成功。",
        "slot": "这次活动办得很成功",
        "cue": {
          "en": "the event went very well",
          "ko": "이번 행사가 성공적이다"
        },
        "gloss": {
          "en": "All in all, the event was a great success.",
          "ko": "전체적으로 보면 이번 행사는 아주 성공적이었어요."
        }
      },
      {
        "text": "总的来说，这篇文章讲的是年轻人的压力。",
        "slot": "这篇文章讲的是年轻人的压力",
        "cue": {
          "en": "the article is about young people's stress",
          "ko": "이 글은 젊은이들의 스트레스 이야기다"
        },
        "gloss": {
          "en": "All in all, the article is about the pressure young people face.",
          "ko": "전체적으로 보면 이 글은 젊은 사람들의 스트레스를 다뤄요."
        }
      },
      {
        "text": "总的来说，优点比缺点多。",
        "slot": "优点比缺点多",
        "cue": {
          "en": "there are more pros than cons",
          "ko": "장점이 단점보다 많다"
        },
        "gloss": {
          "en": "All in all, the pros outweigh the cons.",
          "ko": "전체적으로 보면 장점이 단점보다 많아요."
        }
      }
    ]
  },
  {
    "id": "zh-f4-18",
    "stage": 4,
    "fn": "complain",
    "pattern": "按理说，___。",
    "core": [
      "按理说"
    ],
    "meaning": {
      "en": "Saying what should have happened: By rights, ___.",
      "ko": "원래대로라면 하고 따지기: 원래대로라면 ___."
    },
    "grammar": [],
    "expressions": [
      "按理说"
    ],
    "examples": [
      {
        "text": "按理说，三天就应该到了。",
        "slot": "三天就应该到了",
        "cue": {
          "en": "it should have arrived in three days",
          "ko": "사흘이면 도착했어야 하다"
        },
        "gloss": {
          "en": "By rights, it should have arrived within three days.",
          "ko": "원래대로라면 사흘이면 도착했어야 해요."
        }
      },
      {
        "text": "按理说，房东应该提前通知我们。",
        "slot": "房东应该提前通知我们",
        "cue": {
          "en": "the landlord should tell us in advance",
          "ko": "집주인이 미리 알려 줘야 하다"
        },
        "gloss": {
          "en": "By rights, the landlord should have told us in advance.",
          "ko": "원래대로라면 집주인이 미리 알려 줬어야 해요."
        }
      },
      {
        "text": "按理说，这种问题保修期内是免费的。",
        "slot": "这种问题保修期内是免费的",
        "cue": {
          "en": "this kind of problem is free under warranty",
          "ko": "보증 기간에는 무료다"
        },
        "gloss": {
          "en": "By rights, this kind of problem is free while under warranty.",
          "ko": "원래대로라면 이런 문제는 보증 기간 안에는 무료예요."
        }
      },
      {
        "text": "按理说，他今天应该来上班。",
        "slot": "他今天应该来上班",
        "cue": {
          "en": "he should be at work today",
          "ko": "그가 오늘 출근해야 하다"
        },
        "gloss": {
          "en": "By rights, he should be at work today.",
          "ko": "원래대로라면 그 사람 오늘 출근해야 해요."
        }
      }
    ]
  },
  {
    "id": "zh-f4-19",
    "stage": 4,
    "fn": "rephrase",
    "pattern": "换句话说，___。",
    "core": [
      "换句话说"
    ],
    "meaning": {
      "en": "Restating more clearly: In other words, ___.",
      "ko": "다르게 정리해 말하기: 다시 말해 ___."
    },
    "grammar": [],
    "expressions": [
      "换句话说"
    ],
    "examples": [
      {
        "text": "换句话说，问题不在地点，而在管理。",
        "slot": "问题不在地点，而在管理",
        "cue": {
          "en": "the problem is management, not location",
          "ko": "문제는 장소가 아니라 관리다"
        },
        "gloss": {
          "en": "In other words, the problem isn't where we work but how we're managed.",
          "ko": "다시 말해 문제는 장소가 아니라 관리예요."
        }
      },
      {
        "text": "换句话说，我们得重新开始。",
        "slot": "我们得重新开始",
        "cue": {
          "en": "we have to start over",
          "ko": "처음부터 다시 해야 하다"
        },
        "gloss": {
          "en": "In other words, we have to start over.",
          "ko": "다시 말해 처음부터 다시 해야 해요."
        }
      },
      {
        "text": "换句话说，这个月不会有奖金了。",
        "slot": "这个月不会有奖金了",
        "cue": {
          "en": "there'll be no bonus this month",
          "ko": "이번 달은 보너스가 없다"
        },
        "gloss": {
          "en": "In other words, there won't be a bonus this month.",
          "ko": "다시 말해 이번 달엔 보너스가 없어요."
        }
      },
      {
        "text": "换句话说，他根本没打算帮忙。",
        "slot": "他根本没打算帮忙",
        "cue": {
          "en": "he never meant to help",
          "ko": "그는 도울 생각이 전혀 없다"
        },
        "gloss": {
          "en": "In other words, he never intended to help at all.",
          "ko": "다시 말해 그 사람은 애초에 도울 생각이 없었어요."
        }
      }
    ]
  },
  {
    "id": "zh-f4-20",
    "stage": 4,
    "fn": "persuade",
    "pattern": "说到底，___。",
    "core": [
      "说到底"
    ],
    "meaning": {
      "en": "Getting to the bottom line: When it comes down to it, ___.",
      "ko": "결국 핵심 말하기: 결국 따지고 보면 ___."
    },
    "grammar": [],
    "expressions": [
      "说到底"
    ],
    "examples": [
      {
        "text": "说到底，我要的是我的东西。",
        "slot": "我要的是我的东西",
        "cue": {
          "en": "what I want is my item",
          "ko": "내가 원하는 건 내 물건이다"
        },
        "gloss": {
          "en": "When it comes down to it, what I want is my order.",
          "ko": "결국 제가 원하는 건 제 물건이에요."
        }
      },
      {
        "text": "说到底，还是钱的问题。",
        "slot": "还是钱的问题",
        "cue": {
          "en": "it's still about money",
          "ko": "결국 돈 문제다"
        },
        "gloss": {
          "en": "When it comes down to it, it's about money.",
          "ko": "결국 따지고 보면 돈 문제예요."
        }
      },
      {
        "text": "说到底，这是你自己的选择。",
        "slot": "这是你自己的选择",
        "cue": {
          "en": "it's your own choice",
          "ko": "네 선택이다"
        },
        "gloss": {
          "en": "At the end of the day, it's your own choice.",
          "ko": "결국 따지고 보면 이건 네 선택이야."
        }
      },
      {
        "text": "说到底，大家都是为了公司好。",
        "slot": "大家都是为了公司好",
        "cue": {
          "en": "everyone wants what's best for the company",
          "ko": "다들 회사를 위해서다"
        },
        "gloss": {
          "en": "When it comes down to it, everyone wants what's best for the company.",
          "ko": "결국 따지고 보면 다들 회사 잘되라고 하는 거예요."
        }
      }
    ]
  },
  {
    "id": "zh-f5-01",
    "stage": 5,
    "fn": "negotiate",
    "pattern": "鉴于___，我们建议推迟签约。",
    "core": [
      "鉴于"
    ],
    "meaning": {
      "en": "Giving a formal reason: In view of ___, we suggest postponing the signing.",
      "ko": "격식 있게 근거 대기: ___을 고려해 계약을 미룰 것을 제안합니다."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "鉴于目前的情况，我们建议推迟签约。",
        "slot": "目前的情况",
        "cue": {
          "en": "the current situation",
          "ko": "현재 상황"
        },
        "gloss": {
          "en": "In view of the current situation, we suggest postponing the signing.",
          "ko": "현재 상황을 고려해 계약을 미룰 것을 제안합니다."
        }
      },
      {
        "text": "鉴于双方还有分歧，我们建议推迟签约。",
        "slot": "双方还有分歧",
        "cue": {
          "en": "the two sides still disagree",
          "ko": "양측에 아직 이견이 있다"
        },
        "gloss": {
          "en": "Given that the two sides still disagree, we suggest postponing the signing.",
          "ko": "양측에 아직 이견이 있는 만큼 계약을 미룰 것을 제안합니다."
        }
      },
      {
        "text": "鉴于市场变化太快，我们建议推迟签约。",
        "slot": "市场变化太快",
        "cue": {
          "en": "the market is changing too fast",
          "ko": "시장이 너무 빨리 변하다"
        },
        "gloss": {
          "en": "Given how fast the market is changing, we suggest postponing the signing.",
          "ko": "시장이 너무 빨리 변하는 점을 고려해 계약을 미룰 것을 제안합니다."
        }
      },
      {
        "text": "鉴于法务还没审核完，我们建议推迟签约。",
        "slot": "法务还没审核完",
        "cue": {
          "en": "legal hasn't finished reviewing",
          "ko": "법무팀 검토가 안 끝나다"
        },
        "gloss": {
          "en": "Since legal hasn't finished its review, we suggest postponing the signing.",
          "ko": "법무팀 검토가 끝나지 않은 만큼 계약을 미룰 것을 제안합니다."
        }
      }
    ]
  },
  {
    "id": "zh-f5-02",
    "stage": 5,
    "fn": "explain-process",
    "pattern": "请提前___，以便我们安排。",
    "core": [
      "以便"
    ],
    "meaning": {
      "en": "Stating a purpose formally: Please ___ in advance so that we can make arrangements.",
      "ko": "목적을 격식 있게 말하기: 준비할 수 있도록 미리 ___ 주세요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "请提前告诉我们人数，以便我们安排。",
        "slot": "告诉我们人数",
        "cue": {
          "en": "tell us the number of people",
          "ko": "인원을 알려 주다"
        },
        "gloss": {
          "en": "Please tell us the number of people in advance so we can make arrangements.",
          "ko": "준비할 수 있도록 미리 인원을 알려 주세요."
        }
      },
      {
        "text": "请提前把材料发过来，以便我们安排。",
        "slot": "把材料发过来",
        "cue": {
          "en": "send the documents over",
          "ko": "자료를 보내 주다"
        },
        "gloss": {
          "en": "Please send the documents over in advance so we can make arrangements.",
          "ko": "준비할 수 있도록 미리 자료를 보내 주세요."
        }
      },
      {
        "text": "请提前确认到达时间，以便我们安排。",
        "slot": "确认到达时间",
        "cue": {
          "en": "confirm your arrival time",
          "ko": "도착 시간을 확인해 주다"
        },
        "gloss": {
          "en": "Please confirm your arrival time in advance so we can make arrangements.",
          "ko": "준비할 수 있도록 미리 도착 시간을 확인해 주세요."
        }
      },
      {
        "text": "请提前说明有没有忌口，以便我们安排。",
        "slot": "说明有没有忌口",
        "cue": {
          "en": "say whether you avoid any foods",
          "ko": "못 먹는 음식이 있는지 말하다"
        },
        "gloss": {
          "en": "Please let us know in advance about any dietary restrictions so we can make arrangements.",
          "ko": "준비할 수 있도록 못 드시는 음식이 있는지 미리 알려 주세요."
        }
      }
    ]
  },
  {
    "id": "zh-f5-03",
    "stage": 5,
    "fn": "pros-cons",
    "pattern": "___，从而降低双方的风险。",
    "core": [
      "从而"
    ],
    "meaning": {
      "en": "Linking a step to its result: ___, thereby lowering the risk for both sides.",
      "ko": "조치와 결과 잇기: ___해서 양쪽의 위험을 줄이는 거죠."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "先签一年，从而降低双方的风险。",
        "slot": "先签一年",
        "cue": {
          "en": "sign for one year first",
          "ko": "먼저 일 년만 계약하다"
        },
        "gloss": {
          "en": "Sign for one year first, thereby lowering the risk for both sides.",
          "ko": "먼저 일 년만 계약해서 양쪽의 위험을 줄이는 거죠."
        }
      },
      {
        "text": "分三次付款，从而降低双方的风险。",
        "slot": "分三次付款",
        "cue": {
          "en": "pay in three instalments",
          "ko": "세 번에 나눠 지불하다"
        },
        "gloss": {
          "en": "Pay in three instalments, thereby lowering the risk for both sides.",
          "ko": "세 번에 나눠 지불해서 양쪽의 위험을 줄이는 거죠."
        }
      },
      {
        "text": "先做一批样品，从而降低双方的风险。",
        "slot": "先做一批样品",
        "cue": {
          "en": "make a batch of samples first",
          "ko": "먼저 샘플을 한 번 만들다"
        },
        "gloss": {
          "en": "Make a batch of samples first, thereby lowering the risk for both sides.",
          "ko": "먼저 샘플을 만들어서 양쪽의 위험을 줄이는 거죠."
        }
      },
      {
        "text": "请第三方来检查质量，从而降低双方的风险。",
        "slot": "请第三方来检查质量",
        "cue": {
          "en": "have a third party check quality",
          "ko": "제삼자에게 품질 검사를 맡기다"
        },
        "gloss": {
          "en": "Have a third party check the quality, thereby lowering the risk for both sides.",
          "ko": "제삼자에게 품질 검사를 맡겨서 양쪽의 위험을 줄이는 거죠."
        }
      }
    ]
  },
  {
    "id": "zh-f5-04",
    "stage": 5,
    "fn": "concession",
    "pattern": "即使___，也未必能做完。",
    "core": [
      "即使",
      "也"
    ],
    "meaning": {
      "en": "Conceding even the extreme case: Even if ___, I may not be able to finish.",
      "ko": "극단을 가정해도 안 된다고 말하기: ___더라도 다 끝낼 수 있을지 모르겠어요."
    },
    "grammar": [
      1,
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "即使我每天熬夜，也未必能做完。",
        "slot": "我每天熬夜",
        "cue": {
          "en": "I stay up late every night",
          "ko": "매일 밤새우다"
        },
        "gloss": {
          "en": "Even if I stay up every night, I may not be able to finish.",
          "ko": "매일 밤을 새운다 해도 다 끝낼 수 있을지 모르겠어요."
        }
      },
      {
        "text": "即使再给我一周，也未必能做完。",
        "slot": "再给我一周",
        "cue": {
          "en": "give me another week",
          "ko": "일주일 더 주다"
        },
        "gloss": {
          "en": "Even if you give me another week, I may not finish.",
          "ko": "일주일을 더 준다 해도 다 끝낼 수 있을지 모르겠어요."
        }
      },
      {
        "text": "即使大家一起帮忙，也未必能做完。",
        "slot": "大家一起帮忙",
        "cue": {
          "en": "everyone helps together",
          "ko": "다 같이 돕다"
        },
        "gloss": {
          "en": "Even if everyone pitches in, we may not be able to finish.",
          "ko": "다 같이 돕는다 해도 다 끝낼 수 있을지 모르겠어요."
        }
      },
      {
        "text": "即使周末也加班，也未必能做完。",
        "slot": "周末也加班",
        "cue": {
          "en": "work over the weekend too",
          "ko": "주말에도 일하다"
        },
        "gloss": {
          "en": "Even if we work weekends too, we may not finish.",
          "ko": "주말에도 일한다 해도 다 끝낼 수 있을지 모르겠어요."
        }
      }
    ]
  },
  {
    "id": "zh-f5-05",
    "stage": 5,
    "fn": "concession",
    "pattern": "哪怕___，我们也要试试。",
    "core": [
      "哪怕",
      "也要"
    ],
    "meaning": {
      "en": "Holding firm whatever it takes: Even if ___, we still have to try.",
      "ko": "무슨 일이 있어도 하겠다고 말하기: ___더라도 해 봐야죠."
    },
    "grammar": [
      1,
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "哪怕只有一点希望，我们也要试试。",
        "slot": "只有一点希望",
        "cue": {
          "en": "there's only a little hope",
          "ko": "희망이 조금밖에 없다"
        },
        "gloss": {
          "en": "Even if there's only a sliver of hope, we have to try.",
          "ko": "희망이 조금밖에 없더라도 해 봐야죠."
        }
      },
      {
        "text": "哪怕只有三个人，我们也要试试。",
        "slot": "只有三个人",
        "cue": {
          "en": "there are only three of us",
          "ko": "세 명뿐이다"
        },
        "gloss": {
          "en": "Even if there are only three of us, we have to give it a go.",
          "ko": "세 명뿐이라도 해 봐야죠."
        }
      },
      {
        "text": "哪怕失败了，我们也要试试。",
        "slot": "失败了",
        "cue": {
          "en": "we fail",
          "ko": "실패하다"
        },
        "gloss": {
          "en": "Even if we fail, we still have to try.",
          "ko": "실패하더라도 해 봐야죠."
        }
      },
      {
        "text": "哪怕被别人笑话，我们也要试试。",
        "slot": "被别人笑话",
        "cue": {
          "en": "others laugh at us",
          "ko": "남들이 비웃다"
        },
        "gloss": {
          "en": "Even if people laugh at us, we still have to try.",
          "ko": "남들이 비웃더라도 해 봐야죠."
        }
      }
    ]
  },
  {
    "id": "zh-f5-06",
    "stage": 5,
    "fn": "surprise",
    "pattern": "连___都不知道这件事。",
    "core": [
      "连",
      "都"
    ],
    "meaning": {
      "en": "Emphasising with 'even': Even ___ didn't know about this.",
      "ko": "'~조차' 강조하기: ___조차 이 일을 몰랐어요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "连他自己都不知道这件事。",
        "slot": "他自己",
        "cue": {
          "en": "he himself",
          "ko": "그 사람 본인"
        },
        "gloss": {
          "en": "Even he himself didn't know about this.",
          "ko": "그 사람 본인조차 이 일을 몰랐어요."
        }
      },
      {
        "text": "连老板都不知道这件事。",
        "slot": "老板",
        "cue": {
          "en": "the boss",
          "ko": "사장님"
        },
        "gloss": {
          "en": "Even the boss didn't know about this.",
          "ko": "사장님조차 이 일을 몰랐어요."
        }
      },
      {
        "text": "连他最好的朋友都不知道这件事。",
        "slot": "他最好的朋友",
        "cue": {
          "en": "his best friend",
          "ko": "그의 가장 친한 친구"
        },
        "gloss": {
          "en": "Even his best friend didn't know about this.",
          "ko": "그의 가장 친한 친구조차 이 일을 몰랐어요."
        }
      },
      {
        "text": "连住在隔壁的邻居都不知道这件事。",
        "slot": "住在隔壁的邻居",
        "cue": {
          "en": "the next-door neighbour",
          "ko": "옆집 이웃"
        },
        "gloss": {
          "en": "Even the next-door neighbour didn't know about this.",
          "ko": "옆집 사람조차 이 일을 몰랐어요."
        }
      }
    ]
  },
  {
    "id": "zh-f5-07",
    "stage": 5,
    "fn": "compliment",
    "pattern": "这是___做出来的。",
    "core": [
      "做出来的"
    ],
    "meaning": {
      "en": "Emphasising who or how with 是…的: This was made by ___.",
      "ko": "是…的로 강조하기: 이건 ___ 만든 거예요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "这是整个团队一起做出来的。",
        "slot": "整个团队一起",
        "cue": {
          "en": "the whole team together",
          "ko": "팀 전체가 함께"
        },
        "gloss": {
          "en": "This was made by the whole team together.",
          "ko": "이건 팀 전체가 함께 만든 거예요."
        }
      },
      {
        "text": "这是我们熬了好几个通宵才做出来的。",
        "slot": "我们熬了好几个通宵才",
        "cue": {
          "en": "we pulled several all-nighters",
          "ko": "며칠 밤을 새워서야"
        },
        "gloss": {
          "en": "We only got this done after several all-nighters.",
          "ko": "이건 저희가 며칠 밤을 새워서 겨우 만든 거예요."
        }
      },
      {
        "text": "这是我奶奶亲手做出来的。",
        "slot": "我奶奶亲手",
        "cue": {
          "en": "my grandma, by hand",
          "ko": "할머니가 손수"
        },
        "gloss": {
          "en": "My grandma made this by hand.",
          "ko": "이건 할머니가 손수 만든 거예요."
        }
      },
      {
        "text": "这是用旧木头做出来的。",
        "slot": "用旧木头",
        "cue": {
          "en": "out of old wood",
          "ko": "오래된 나무로"
        },
        "gloss": {
          "en": "This was made out of old wood.",
          "ko": "이건 오래된 나무로 만든 거예요."
        }
      }
    ]
  },
  {
    "id": "zh-f5-08",
    "stage": 5,
    "fn": "tact-refuse",
    "pattern": "我恐怕不能再___了。",
    "core": [
      "恐怕不能"
    ],
    "meaning": {
      "en": "Declining softly: I'm afraid I can't ___ any more.",
      "ko": "부드럽게 거절하기: 아무래도 더는 ___ 못 할 것 같아요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "我恐怕不能再喝了。",
        "slot": "喝",
        "cue": {
          "en": "drink",
          "ko": "마시다"
        },
        "gloss": {
          "en": "I'm afraid I can't drink any more.",
          "ko": "아무래도 더는 못 마실 것 같아요."
        }
      },
      {
        "text": "我恐怕不能再等了。",
        "slot": "等",
        "cue": {
          "en": "wait",
          "ko": "기다리다"
        },
        "gloss": {
          "en": "I'm afraid I can't wait any longer.",
          "ko": "아무래도 더는 못 기다릴 것 같아요."
        }
      },
      {
        "text": "我恐怕不能再降价了。",
        "slot": "降价",
        "cue": {
          "en": "lower the price",
          "ko": "값을 내리다"
        },
        "gloss": {
          "en": "I'm afraid I can't lower the price any further.",
          "ko": "아무래도 더는 값을 못 내릴 것 같아요."
        }
      },
      {
        "text": "我恐怕不能再陪你聊了。",
        "slot": "陪你聊",
        "cue": {
          "en": "keep chatting with you",
          "ko": "너랑 계속 이야기하다"
        },
        "gloss": {
          "en": "I'm afraid I can't keep chatting with you.",
          "ko": "아무래도 더는 얘기 못 할 것 같아요."
        }
      }
    ]
  },
  {
    "id": "zh-f5-09",
    "stage": 5,
    "fn": "advice-give",
    "pattern": "你不妨___。",
    "core": [
      "不妨"
    ],
    "meaning": {
      "en": "Suggesting lightly: You might as well ___.",
      "ko": "가볍게 권하기: ___해 보는 것도 괜찮아요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "你不妨找个专业的翻译公司。",
        "slot": "找个专业的翻译公司",
        "cue": {
          "en": "find a professional translation agency",
          "ko": "전문 번역 회사를 찾다"
        },
        "gloss": {
          "en": "You might as well find a professional translation agency.",
          "ko": "전문 번역 회사를 찾아보는 것도 괜찮아요."
        }
      },
      {
        "text": "你不妨直接问问他。",
        "slot": "直接问问他",
        "cue": {
          "en": "just ask him directly",
          "ko": "그에게 직접 물어보다"
        },
        "gloss": {
          "en": "You might as well just ask him directly.",
          "ko": "그 사람한테 직접 물어보는 것도 괜찮아요."
        }
      },
      {
        "text": "你不妨换个角度想想。",
        "slot": "换个角度想想",
        "cue": {
          "en": "look at it from another angle",
          "ko": "다른 각도에서 생각해 보다"
        },
        "gloss": {
          "en": "You might try looking at it from another angle.",
          "ko": "다른 각도에서 생각해 보는 것도 괜찮아요."
        }
      },
      {
        "text": "你不妨先休息几天。",
        "slot": "先休息几天",
        "cue": {
          "en": "rest for a few days first",
          "ko": "먼저 며칠 쉬다"
        },
        "gloss": {
          "en": "You might as well take a few days off first.",
          "ko": "먼저 며칠 쉬어 보는 것도 괜찮아요."
        }
      }
    ]
  },
  {
    "id": "zh-f5-10",
    "stage": 5,
    "fn": "nuance-soften",
    "pattern": "___未必是坏事。",
    "core": [
      "未必"
    ],
    "meaning": {
      "en": "Softening a judgement: ___ isn't necessarily a bad thing.",
      "ko": "단정 누그러뜨리기: ___가 꼭 나쁜 일은 아니에요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "换工作未必是坏事。",
        "slot": "换工作",
        "cue": {
          "en": "changing jobs",
          "ko": "이직"
        },
        "gloss": {
          "en": "Changing jobs isn't necessarily a bad thing.",
          "ko": "이직이 꼭 나쁜 일은 아니에요."
        }
      },
      {
        "text": "失败一次未必是坏事。",
        "slot": "失败一次",
        "cue": {
          "en": "failing once",
          "ko": "한 번 실패하는 것"
        },
        "gloss": {
          "en": "Failing once isn't necessarily a bad thing.",
          "ko": "한 번 실패하는 게 꼭 나쁜 일은 아니에요."
        }
      },
      {
        "text": "慢一点未必是坏事。",
        "slot": "慢一点",
        "cue": {
          "en": "going a bit slower",
          "ko": "조금 느린 것"
        },
        "gloss": {
          "en": "Going a bit slower isn't necessarily a bad thing.",
          "ko": "조금 느린 게 꼭 나쁜 일은 아니에요."
        }
      },
      {
        "text": "被拒绝未必是坏事。",
        "slot": "被拒绝",
        "cue": {
          "en": "being turned down",
          "ko": "거절당하는 것"
        },
        "gloss": {
          "en": "Being turned down isn't necessarily a bad thing.",
          "ko": "거절당하는 게 꼭 나쁜 일은 아니에요."
        }
      }
    ]
  },
  {
    "id": "zh-f5-11",
    "stage": 5,
    "fn": "describe-person",
    "pattern": "他做事一向___。",
    "core": [
      "一向"
    ],
    "meaning": {
      "en": "Describing someone with an idiom: He has always been ___ in how he works.",
      "ko": "사자성어로 사람 묘사하기: 그는 일할 때 늘 ___해요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "他做事一向半途而废。",
        "slot": "半途而废",
        "cue": {
          "en": "give up halfway",
          "ko": "중도에 그만두다"
        },
        "gloss": {
          "en": "He always gives up halfway through things.",
          "ko": "그는 일을 늘 중간에 그만둬요."
        }
      },
      {
        "text": "他做事一向一丝不苟。",
        "slot": "一丝不苟",
        "cue": {
          "en": "meticulous",
          "ko": "빈틈없이 꼼꼼하다"
        },
        "gloss": {
          "en": "He has always been meticulous in his work.",
          "ko": "그는 일할 때 늘 빈틈없이 꼼꼼해요."
        }
      },
      {
        "text": "他做事一向雷厉风行。",
        "slot": "雷厉风行",
        "cue": {
          "en": "swift and decisive",
          "ko": "신속하고 과감하다"
        },
        "gloss": {
          "en": "He has always been swift and decisive.",
          "ko": "그는 일할 때 늘 신속하고 과감해요."
        }
      },
      {
        "text": "他做事一向拖泥带水。",
        "slot": "拖泥带水",
        "cue": {
          "en": "sloppy and slow",
          "ko": "질질 끌다"
        },
        "gloss": {
          "en": "He's always slow and sloppy about things.",
          "ko": "그는 일할 때 늘 질질 끌어요."
        }
      }
    ]
  },
  {
    "id": "zh-f5-12",
    "stage": 5,
    "fn": "compliment",
    "pattern": "___，真是名不虚传。",
    "core": [
      "名不虚传"
    ],
    "meaning": {
      "en": "Praising with an idiom: ___ — it really lives up to its name.",
      "ko": "사자성어로 칭찬하기: ___, 정말 소문대로네요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "色香味俱全，真是名不虚传。",
        "slot": "色香味俱全",
        "cue": {
          "en": "perfect in colour, aroma and taste",
          "ko": "색·향·맛을 다 갖추다"
        },
        "gloss": {
          "en": "Perfect in colour, aroma and taste — it really lives up to its name.",
          "ko": "색도 향도 맛도 다 좋네요, 정말 소문대로예요."
        }
      },
      {
        "text": "这里的风景太美了，真是名不虚传。",
        "slot": "这里的风景太美了",
        "cue": {
          "en": "the scenery here is beautiful",
          "ko": "이곳 경치가 아름답다"
        },
        "gloss": {
          "en": "The scenery here is stunning — it really lives up to its reputation.",
          "ko": "여기 경치가 정말 아름답네요, 정말 소문대로예요."
        }
      },
      {
        "text": "您这手字写得真漂亮，真是名不虚传。",
        "slot": "您这手字写得真漂亮",
        "cue": {
          "en": "your handwriting is beautiful",
          "ko": "글씨가 아주 예쁘다"
        },
        "gloss": {
          "en": "Your handwriting is beautiful — you really live up to your reputation.",
          "ko": "글씨가 정말 예쁘시네요, 정말 소문대로세요."
        }
      },
      {
        "text": "服务这么周到，真是名不虚传。",
        "slot": "服务这么周到",
        "cue": {
          "en": "the service is so attentive",
          "ko": "서비스가 이렇게 세심하다"
        },
        "gloss": {
          "en": "Such attentive service — it really lives up to its name.",
          "ko": "서비스가 이렇게 세심하다니, 정말 소문대로네요."
        }
      }
    ]
  },
  {
    "id": "zh-f5-13",
    "stage": 5,
    "fn": "advice-give",
    "pattern": "你先___，不行再说。",
    "core": [
      "你先",
      "再说"
    ],
    "meaning": {
      "en": "Suggesting a light first try with a doubled verb: Just ___ first, and we'll see if it doesn't work.",
      "ko": "동사 중첩으로 가볍게 권하기: 일단 ___ 봐요, 안 되면 그때 봐요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "你先试试，不行再说。",
        "slot": "试试",
        "cue": {
          "en": "give it a try",
          "ko": "한번 해 보다"
        },
        "gloss": {
          "en": "Just give it a try first, and we'll see if it doesn't work.",
          "ko": "일단 해 봐요, 안 되면 그때 봐요."
        }
      },
      {
        "text": "你先尝尝，不行再说。",
        "slot": "尝尝",
        "cue": {
          "en": "have a taste",
          "ko": "맛보다"
        },
        "gloss": {
          "en": "Just have a taste first, and we'll see.",
          "ko": "일단 맛봐요, 별로면 그때 봐요."
        }
      },
      {
        "text": "你先问问，不行再说。",
        "slot": "问问",
        "cue": {
          "en": "ask around",
          "ko": "물어보다"
        },
        "gloss": {
          "en": "Just ask around first, and if that fails we'll think again.",
          "ko": "일단 물어봐요, 안 되면 그때 봐요."
        }
      },
      {
        "text": "你先等等，不行再说。",
        "slot": "等等",
        "cue": {
          "en": "wait a bit",
          "ko": "좀 기다리다"
        },
        "gloss": {
          "en": "Just wait a bit first, and we'll see if it doesn't work.",
          "ko": "일단 좀 기다려 봐요, 안 되면 그때 봐요."
        }
      }
    ]
  },
  {
    "id": "zh-f5-14",
    "stage": 5,
    "fn": "try-doing",
    "pattern": "我帮你___吧。",
    "core": [
      "我帮你"
    ],
    "meaning": {
      "en": "Offering casual help with a doubled verb: Let me ___ for you.",
      "ko": "동사 중첩으로 가볍게 도와주겠다고 하기: 내가 ___ 줄게요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "我帮你看看吧。",
        "slot": "看看",
        "cue": {
          "en": "take a look",
          "ko": "한번 보다"
        },
        "gloss": {
          "en": "Let me take a look for you.",
          "ko": "제가 한번 봐 줄게요."
        }
      },
      {
        "text": "我帮你问问吧。",
        "slot": "问问",
        "cue": {
          "en": "ask around",
          "ko": "물어보다"
        },
        "gloss": {
          "en": "Let me ask around for you.",
          "ko": "제가 한번 물어봐 줄게요."
        }
      },
      {
        "text": "我帮你查查吧。",
        "slot": "查查",
        "cue": {
          "en": "look it up",
          "ko": "찾아보다"
        },
        "gloss": {
          "en": "Let me look it up for you.",
          "ko": "제가 한번 찾아봐 줄게요."
        }
      },
      {
        "text": "我帮你改改吧。",
        "slot": "改改",
        "cue": {
          "en": "touch it up",
          "ko": "좀 고치다"
        },
        "gloss": {
          "en": "Let me touch it up for you.",
          "ko": "제가 좀 고쳐 줄게요."
        }
      }
    ]
  },
  {
    "id": "zh-f5-15",
    "stage": 5,
    "fn": "tact-refuse",
    "pattern": "说白了，___。",
    "core": [
      "说白了"
    ],
    "meaning": {
      "en": "Putting it plainly: To put it bluntly, ___.",
      "ko": "대놓고 말하기: 솔직히 까놓고 말하면 ___."
    },
    "grammar": [],
    "expressions": [
      "说白了"
    ],
    "examples": [
      {
        "text": "说白了，这事儿我做不了。",
        "slot": "这事儿我做不了",
        "cue": {
          "en": "I can't do this",
          "ko": "이 일은 내가 못 하다"
        },
        "gloss": {
          "en": "To put it bluntly, I can't do this.",
          "ko": "까놓고 말하면 이 일은 제가 못 해요."
        }
      },
      {
        "text": "说白了，他就是不想负责。",
        "slot": "他就是不想负责",
        "cue": {
          "en": "he just doesn't want responsibility",
          "ko": "그는 그냥 책임지기 싫다"
        },
        "gloss": {
          "en": "To put it bluntly, he just doesn't want to take responsibility.",
          "ko": "까놓고 말하면 그 사람은 그냥 책임지기 싫은 거예요."
        }
      },
      {
        "text": "说白了，大家都是为了钱。",
        "slot": "大家都是为了钱",
        "cue": {
          "en": "everyone is in it for the money",
          "ko": "다들 돈 때문이다"
        },
        "gloss": {
          "en": "To put it bluntly, everyone's in it for the money.",
          "ko": "까놓고 말하면 다들 돈 때문이에요."
        }
      },
      {
        "text": "说白了，这个计划根本不现实。",
        "slot": "这个计划根本不现实",
        "cue": {
          "en": "this plan isn't realistic at all",
          "ko": "이 계획은 전혀 현실적이지 않다"
        },
        "gloss": {
          "en": "To put it bluntly, this plan isn't realistic at all.",
          "ko": "까놓고 말하면 이 계획은 전혀 현실적이지 않아요."
        }
      }
    ]
  },
  {
    "id": "zh-f5-16",
    "stage": 5,
    "fn": "tact-refuse",
    "pattern": "___，这事儿不好办。",
    "core": [
      "这事儿不好办"
    ],
    "meaning": {
      "en": "Hinting at a refusal: ___ — this is a tricky one.",
      "ko": "돌려서 거절 비치기: ___, 이건 좀 곤란해요."
    },
    "grammar": [],
    "expressions": [
      "这事儿不好办"
    ],
    "examples": [
      {
        "text": "五十页周五前要，这事儿不好办。",
        "slot": "五十页周五前要",
        "cue": {
          "en": "fifty pages needed by Friday",
          "ko": "오십 쪽을 금요일까지"
        },
        "gloss": {
          "en": "Fifty pages by Friday — that's a tricky one.",
          "ko": "오십 쪽을 금요일까지라니, 이건 좀 곤란해요."
        }
      },
      {
        "text": "你要的颜色已经停产了，这事儿不好办。",
        "slot": "你要的颜色已经停产了",
        "cue": {
          "en": "the colour you want is discontinued",
          "ko": "원하는 색이 단종되다"
        },
        "gloss": {
          "en": "The colour you want has been discontinued — that's tricky.",
          "ko": "원하시는 색이 단종돼서 이건 좀 곤란해요."
        }
      },
      {
        "text": "房东不同意，这事儿不好办。",
        "slot": "房东不同意",
        "cue": {
          "en": "the landlord doesn't agree",
          "ko": "집주인이 동의하지 않다"
        },
        "gloss": {
          "en": "The landlord won't agree — that makes it tricky.",
          "ko": "집주인이 동의를 안 해서 이건 좀 곤란해요."
        }
      },
      {
        "text": "手续还没办完，这事儿不好办。",
        "slot": "手续还没办完",
        "cue": {
          "en": "the paperwork isn't done yet",
          "ko": "수속이 아직 안 끝나다"
        },
        "gloss": {
          "en": "The paperwork isn't done yet — this is a tricky one.",
          "ko": "수속이 아직 안 끝나서 이건 좀 곤란해요."
        }
      }
    ]
  },
  {
    "id": "zh-f5-17",
    "stage": 5,
    "fn": "nuance-soften",
    "pattern": "___，我心里没底。",
    "core": [
      "心里没底"
    ],
    "meaning": {
      "en": "Admitting you're unsure: When it comes to ___, I don't feel confident.",
      "ko": "자신 없다고 말하기: ___는 저도 자신이 없어요."
    },
    "grammar": [],
    "expressions": [
      "心里没底"
    ],
    "examples": [
      {
        "text": "法律合同，我心里没底。",
        "slot": "法律合同",
        "cue": {
          "en": "legal contracts",
          "ko": "법률 계약서"
        },
        "gloss": {
          "en": "When it comes to legal contracts, I don't feel confident.",
          "ko": "법률 계약서는 저도 자신이 없어요."
        }
      },
      {
        "text": "签三年的话，我心里没底。",
        "slot": "签三年的话",
        "cue": {
          "en": "signing for three years",
          "ko": "삼 년 계약하면"
        },
        "gloss": {
          "en": "Signing for three years — I'm not confident about that.",
          "ko": "삼 년 계약이라면 저도 자신이 없어요."
        }
      },
      {
        "text": "明天的面试，我心里没底。",
        "slot": "明天的面试",
        "cue": {
          "en": "tomorrow's interview",
          "ko": "내일 면접"
        },
        "gloss": {
          "en": "I'm not feeling confident about tomorrow's interview.",
          "ko": "내일 면접은 저도 자신이 없어요."
        }
      },
      {
        "text": "第一次上台演讲，我心里没底。",
        "slot": "第一次上台演讲",
        "cue": {
          "en": "giving a speech on stage for the first time",
          "ko": "처음 무대에서 발표하다"
        },
        "gloss": {
          "en": "Giving my first speech on stage — I'm not confident.",
          "ko": "처음으로 무대에서 발표하는 거라 자신이 없어요."
        }
      }
    ]
  },
  {
    "id": "zh-f5-18",
    "stage": 5,
    "fn": "plan-intent",
    "pattern": "___，走一步看一步吧。",
    "core": [
      "走一步看一步"
    ],
    "meaning": {
      "en": "Taking it one step at a time: ___ — let's take it one step at a time.",
      "ko": "상황 보며 하자고 하기: ___, 일단 한 걸음씩 가 보죠."
    },
    "grammar": [],
    "expressions": [
      "走一步看一步"
    ],
    "examples": [
      {
        "text": "先签一年，走一步看一步吧。",
        "slot": "先签一年",
        "cue": {
          "en": "sign for one year first",
          "ko": "먼저 일 년 계약하다"
        },
        "gloss": {
          "en": "Let's sign for one year first and take it one step at a time.",
          "ko": "먼저 일 년 계약하고 상황 보면서 가죠."
        }
      },
      {
        "text": "周五再定，走一步看一步吧。",
        "slot": "周五再定",
        "cue": {
          "en": "decide on Friday",
          "ko": "금요일에 정하다"
        },
        "gloss": {
          "en": "Let's decide on Friday — one step at a time.",
          "ko": "금요일에 다시 정하죠, 일단 상황 보면서요."
        }
      },
      {
        "text": "现在说什么都太早，走一步看一步吧。",
        "slot": "现在说什么都太早",
        "cue": {
          "en": "it's too early to say anything",
          "ko": "지금은 뭐라 하기 이르다"
        },
        "gloss": {
          "en": "It's too early to say anything now — let's take it step by step.",
          "ko": "지금 뭐라 하기엔 너무 이르니까 상황 보면서 가죠."
        }
      },
      {
        "text": "天气说不准，走一步看一步吧。",
        "slot": "天气说不准",
        "cue": {
          "en": "the weather is unpredictable",
          "ko": "날씨를 장담할 수 없다"
        },
        "gloss": {
          "en": "The weather's unpredictable — let's play it by ear.",
          "ko": "날씨는 장담 못 하니까 상황 보면서 가죠."
        }
      }
    ]
  },
  {
    "id": "zh-f5-19",
    "stage": 5,
    "fn": "explain-process",
    "pattern": "打个比方，___。",
    "core": [
      "打个比方"
    ],
    "meaning": {
      "en": "Explaining with a comparison: To give an analogy, ___.",
      "ko": "비유로 설명하기: 예를 들자면 ___."
    },
    "grammar": [],
    "expressions": [
      "打个比方"
    ],
    "examples": [
      {
        "text": "打个比方，这就像让新手开长途。",
        "slot": "这就像让新手开长途",
        "cue": {
          "en": "it's like letting a beginner drive a long way",
          "ko": "초보에게 장거리 운전을 맡기는 것 같다"
        },
        "gloss": {
          "en": "To give an analogy, it's like asking a new driver to do a long-distance trip.",
          "ko": "비유하자면 초보 운전자한테 장거리 운전을 맡기는 거랑 같아요."
        }
      },
      {
        "text": "打个比方，学语言就像爬山。",
        "slot": "学语言就像爬山",
        "cue": {
          "en": "learning a language is like climbing a mountain",
          "ko": "언어 배우기는 등산과 같다"
        },
        "gloss": {
          "en": "To give an analogy, learning a language is like climbing a mountain.",
          "ko": "비유하자면 언어 배우기는 등산 같은 거예요."
        }
      },
      {
        "text": "打个比方，数据就像公司的地图。",
        "slot": "数据就像公司的地图",
        "cue": {
          "en": "data is like a company's map",
          "ko": "데이터는 회사의 지도다"
        },
        "gloss": {
          "en": "To give an analogy, data is like a map for the company.",
          "ko": "비유하자면 데이터는 회사의 지도 같은 거예요."
        }
      },
      {
        "text": "打个比方，你不会让陌生人帮你管钱吧？",
        "slot": "你不会让陌生人帮你管钱吧",
        "cue": {
          "en": "you wouldn't let a stranger handle your money",
          "ko": "낯선 사람에게 돈 관리를 맡기지 않다"
        },
        "gloss": {
          "en": "To give an analogy, you wouldn't let a stranger manage your money, would you?",
          "ko": "예를 들어, 낯선 사람한테 돈 관리를 맡기진 않잖아요?"
        }
      }
    ]
  },
  {
    "id": "zh-f5-20",
    "stage": 5,
    "fn": "sympathy",
    "pattern": "___也没什么大不了的。",
    "core": [
      "没什么大不了"
    ],
    "meaning": {
      "en": "Playing something down: ___ is no big deal.",
      "ko": "별일 아니라고 하기: ___도 별거 아니에요."
    },
    "grammar": [],
    "expressions": [
      "没什么大不了"
    ],
    "examples": [
      {
        "text": "吃坏了肚子也没什么大不了的。",
        "slot": "吃坏了肚子",
        "cue": {
          "en": "getting an upset stomach",
          "ko": "배탈이 나다"
        },
        "gloss": {
          "en": "Getting an upset stomach is no big deal.",
          "ko": "배탈 좀 나는 것도 별거 아니에요."
        }
      },
      {
        "text": "考砸一次也没什么大不了的。",
        "slot": "考砸一次",
        "cue": {
          "en": "bombing one exam",
          "ko": "시험을 한 번 망치다"
        },
        "gloss": {
          "en": "Bombing one exam is no big deal.",
          "ko": "시험 한 번 망친 것도 별거 아니에요."
        }
      },
      {
        "text": "迟到几分钟也没什么大不了的。",
        "slot": "迟到几分钟",
        "cue": {
          "en": "being a few minutes late",
          "ko": "몇 분 늦다"
        },
        "gloss": {
          "en": "Being a few minutes late is no big deal.",
          "ko": "몇 분 늦는 것도 별거 아니에요."
        }
      },
      {
        "text": "说错一句话也没什么大不了的。",
        "slot": "说错一句话",
        "cue": {
          "en": "saying one wrong thing",
          "ko": "말 한마디 실수하다"
        },
        "gloss": {
          "en": "Saying one wrong thing is no big deal.",
          "ko": "말 한마디 실수한 것도 별거 아니에요."
        }
      }
    ]
  }
];
