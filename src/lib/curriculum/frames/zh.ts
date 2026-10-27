import type { Frame } from "../frames.ts";

/** 중국어 1~3단계 틀(curriculum/frames.ts) — 기능 id(fn)는 curriculum/functions.ts. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
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
  }
];
