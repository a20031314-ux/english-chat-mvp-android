import type { Frame } from "../frames.ts";

/** 일본어 1~3단계 틀(curriculum/frames.ts) — 기능 id(fn)는 curriculum/functions.ts. Claude가 쓰고 다시 고침, 원어민 확인 전. */
export const JA_FRAMES: Frame[] = [
  {
    "id": "ja-f1-01",
    "stage": 1,
    "fn": "introduce",
    "pattern": "わたしは___です。",
    "core": [
      "わたしは"
    ],
    "meaning": {
      "en": "Saying who or what you are: I'm ___.",
      "ko": "나를 소개하기: 저는 ___예요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "わたしはキムです。",
        "slot": "キム",
        "cue": {
          "en": "Kim (your name)",
          "ko": "김(내 이름)"
        },
        "gloss": {
          "en": "I'm Kim.",
          "ko": "저는 김이에요."
        }
      },
      {
        "text": "わたしは学生です。",
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
        "text": "わたしは会社員です。",
        "slot": "会社員",
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
        "text": "わたしは韓国人です。",
        "slot": "韓国人",
        "cue": {
          "en": "Korean (person)",
          "ko": "한국 사람"
        },
        "gloss": {
          "en": "I'm Korean.",
          "ko": "저는 한국 사람이에요."
        }
      }
    ]
  },
  {
    "id": "ja-f1-02",
    "stage": 1,
    "fn": "origin",
    "pattern": "___から来ました。",
    "core": [
      "から来ました"
    ],
    "meaning": {
      "en": "Saying where you're from: I'm from ___.",
      "ko": "어디서 왔는지 말하기: ___에서 왔어요."
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "韓国から来ました。",
        "slot": "韓国",
        "cue": {
          "en": "Korea",
          "ko": "한국"
        },
        "gloss": {
          "en": "I'm from Korea.",
          "ko": "한국에서 왔어요."
        }
      },
      {
        "text": "アメリカから来ました。",
        "slot": "アメリカ",
        "cue": {
          "en": "America",
          "ko": "미국"
        },
        "gloss": {
          "en": "I'm from the US.",
          "ko": "미국에서 왔어요."
        }
      },
      {
        "text": "ブラジルから来ました。",
        "slot": "ブラジル",
        "cue": {
          "en": "Brazil",
          "ko": "브라질"
        },
        "gloss": {
          "en": "I'm from Brazil.",
          "ko": "브라질에서 왔어요."
        }
      },
      {
        "text": "スペインから来ました。",
        "slot": "スペイン",
        "cue": {
          "en": "Spain",
          "ko": "스페인"
        },
        "gloss": {
          "en": "I'm from Spain.",
          "ko": "스페인에서 왔어요."
        }
      }
    ]
  },
  {
    "id": "ja-f1-03",
    "stage": 1,
    "fn": "ask-what",
    "pattern": "___は何ですか。",
    "core": [
      "は何ですか"
    ],
    "meaning": {
      "en": "Asking what something is: What is ___?",
      "ko": "무엇인지 묻기: ___은/는 뭐예요?"
    },
    "grammar": [
      0,
      1,
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "これは何ですか。",
        "slot": "これ",
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
        "text": "お仕事は何ですか。",
        "slot": "お仕事",
        "cue": {
          "en": "(your) job",
          "ko": "(상대의) 일"
        },
        "gloss": {
          "en": "What do you do?",
          "ko": "무슨 일 하세요?"
        }
      },
      {
        "text": "あの建物は何ですか。",
        "slot": "あの建物",
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
        "text": "この料理は何ですか。",
        "slot": "この料理",
        "cue": {
          "en": "this dish",
          "ko": "이 요리"
        },
        "gloss": {
          "en": "What is this dish?",
          "ko": "이 요리는 뭐예요?"
        }
      }
    ]
  },
  {
    "id": "ja-f1-04",
    "stage": 1,
    "fn": "ask-price",
    "pattern": "___はいくらですか。",
    "core": [
      "いくらですか"
    ],
    "meaning": {
      "en": "Asking the price: How much is ___?",
      "ko": "가격 묻기: ___은/는 얼마예요?"
    },
    "grammar": [
      1,
      4
    ],
    "expressions": [
      "いくらですか"
    ],
    "examples": [
      {
        "text": "これはいくらですか。",
        "slot": "これ",
        "cue": {
          "en": "this",
          "ko": "이것"
        },
        "gloss": {
          "en": "How much is this?",
          "ko": "이건 얼마예요?"
        }
      },
      {
        "text": "このかばんはいくらですか。",
        "slot": "このかばん",
        "cue": {
          "en": "this bag",
          "ko": "이 가방"
        },
        "gloss": {
          "en": "How much is this bag?",
          "ko": "이 가방은 얼마예요?"
        }
      },
      {
        "text": "あのTシャツはいくらですか。",
        "slot": "あのTシャツ",
        "cue": {
          "en": "that T-shirt",
          "ko": "저 티셔츠"
        },
        "gloss": {
          "en": "How much is that T-shirt?",
          "ko": "저 티셔츠는 얼마예요?"
        }
      },
      {
        "text": "コーヒーはいくらですか。",
        "slot": "コーヒー",
        "cue": {
          "en": "coffee",
          "ko": "커피"
        },
        "gloss": {
          "en": "How much is a coffee?",
          "ko": "커피는 얼마예요?"
        }
      }
    ]
  },
  {
    "id": "ja-f1-05",
    "stage": 1,
    "fn": "request-thing",
    "pattern": "___をください。",
    "core": [
      "をください"
    ],
    "meaning": {
      "en": "Asking for something: ___, please.",
      "ko": "달라고 하기: ___ 주세요."
    },
    "grammar": [
      5,
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "このパンをください。",
        "slot": "このパン",
        "cue": {
          "en": "this bread",
          "ko": "이 빵"
        },
        "gloss": {
          "en": "I'll have this bread, please.",
          "ko": "이 빵 주세요."
        }
      },
      {
        "text": "お水をください。",
        "slot": "お水",
        "cue": {
          "en": "water",
          "ko": "물"
        },
        "gloss": {
          "en": "Water, please.",
          "ko": "물 주세요."
        }
      },
      {
        "text": "それをください。",
        "slot": "それ",
        "cue": {
          "en": "that one (near you)",
          "ko": "그것"
        },
        "gloss": {
          "en": "I'll take that one, please.",
          "ko": "그거 주세요."
        }
      },
      {
        "text": "ホットコーヒーをください。",
        "slot": "ホットコーヒー",
        "cue": {
          "en": "hot coffee",
          "ko": "따뜻한 커피"
        },
        "gloss": {
          "en": "A hot coffee, please.",
          "ko": "따뜻한 커피 주세요."
        }
      }
    ]
  },
  {
    "id": "ja-f1-06",
    "stage": 1,
    "fn": "ask-where",
    "pattern": "___はどこですか。",
    "core": [
      "はどこですか"
    ],
    "meaning": {
      "en": "Asking where a place is: Where is ___?",
      "ko": "장소 묻기: ___은/는 어디예요?"
    },
    "grammar": [
      1
    ],
    "expressions": [
      "トイレはどこですか"
    ],
    "examples": [
      {
        "text": "トイレはどこですか。",
        "slot": "トイレ",
        "cue": {
          "en": "toilet",
          "ko": "화장실"
        },
        "gloss": {
          "en": "Where is the toilet?",
          "ko": "화장실은 어디예요?"
        }
      },
      {
        "text": "駅はどこですか。",
        "slot": "駅",
        "cue": {
          "en": "station",
          "ko": "역"
        },
        "gloss": {
          "en": "Where is the station?",
          "ko": "역은 어디예요?"
        }
      },
      {
        "text": "出口はどこですか。",
        "slot": "出口",
        "cue": {
          "en": "exit",
          "ko": "출구"
        },
        "gloss": {
          "en": "Where is the exit?",
          "ko": "출구는 어디예요?"
        }
      },
      {
        "text": "タクシー乗り場はどこですか。",
        "slot": "タクシー乗り場",
        "cue": {
          "en": "taxi stand",
          "ko": "택시 승강장"
        },
        "gloss": {
          "en": "Where is the taxi stand?",
          "ko": "택시 타는 곳은 어디예요?"
        }
      }
    ]
  },
  {
    "id": "ja-f1-07",
    "stage": 1,
    "fn": "future-plan",
    "pattern": "明日、___に行きます。",
    "core": [
      "に行きます"
    ],
    "meaning": {
      "en": "Saying where you're going: I'm going to ___ tomorrow.",
      "ko": "갈 곳 말하기: 내일 ___에 가요."
    },
    "grammar": [
      6,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "明日、東京に行きます。",
        "slot": "東京",
        "cue": {
          "en": "Tokyo",
          "ko": "도쿄"
        },
        "gloss": {
          "en": "I'm going to Tokyo tomorrow.",
          "ko": "내일 도쿄에 가요."
        }
      },
      {
        "text": "明日、学校に行きます。",
        "slot": "学校",
        "cue": {
          "en": "school",
          "ko": "학교"
        },
        "gloss": {
          "en": "I'm going to school tomorrow.",
          "ko": "내일 학교에 가요."
        }
      },
      {
        "text": "明日、病院に行きます。",
        "slot": "病院",
        "cue": {
          "en": "hospital / clinic",
          "ko": "병원"
        },
        "gloss": {
          "en": "I'm going to the doctor tomorrow.",
          "ko": "내일 병원에 가요."
        }
      },
      {
        "text": "明日、友だちの家に行きます。",
        "slot": "友だちの家",
        "cue": {
          "en": "a friend's house",
          "ko": "친구 집"
        },
        "gloss": {
          "en": "I'm going to a friend's place tomorrow.",
          "ko": "내일 친구 집에 가요."
        }
      }
    ]
  },
  {
    "id": "ja-f1-08",
    "stage": 1,
    "fn": "ask-have",
    "pattern": "___はありますか。",
    "core": [
      "はありますか"
    ],
    "meaning": {
      "en": "Asking if there is / they have ___: Do you have ___?",
      "ko": "있는지 묻기: ___ 있어요?"
    },
    "grammar": [
      7,
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "傘はありますか。",
        "slot": "傘",
        "cue": {
          "en": "umbrella",
          "ko": "우산"
        },
        "gloss": {
          "en": "Do you have an umbrella?",
          "ko": "우산 있어요?"
        }
      },
      {
        "text": "時間はありますか。",
        "slot": "時間",
        "cue": {
          "en": "time",
          "ko": "시간"
        },
        "gloss": {
          "en": "Do you have time?",
          "ko": "시간 있어요?"
        }
      },
      {
        "text": "英語のメニューはありますか。",
        "slot": "英語のメニュー",
        "cue": {
          "en": "an English menu",
          "ko": "영어 메뉴"
        },
        "gloss": {
          "en": "Do you have an English menu?",
          "ko": "영어 메뉴 있어요?"
        }
      },
      {
        "text": "小さいサイズはありますか。",
        "slot": "小さいサイズ",
        "cue": {
          "en": "a small size",
          "ko": "작은 사이즈"
        },
        "gloss": {
          "en": "Do you have it in a small size?",
          "ko": "작은 사이즈 있어요?"
        }
      }
    ]
  },
  {
    "id": "ja-f1-09",
    "stage": 1,
    "fn": "location-now",
    "pattern": "今、___にいます。",
    "core": [
      "にいます"
    ],
    "meaning": {
      "en": "Saying where you are: I'm at ___ now.",
      "ko": "있는 곳 말하기: 지금 ___에 있어요."
    },
    "grammar": [
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "今、駅にいます。",
        "slot": "駅",
        "cue": {
          "en": "station",
          "ko": "역"
        },
        "gloss": {
          "en": "I'm at the station now.",
          "ko": "지금 역에 있어요."
        }
      },
      {
        "text": "今、家にいます。",
        "slot": "家",
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
        "text": "今、会社にいます。",
        "slot": "会社",
        "cue": {
          "en": "office / company",
          "ko": "회사"
        },
        "gloss": {
          "en": "I'm at the office now.",
          "ko": "지금 회사에 있어요."
        }
      },
      {
        "text": "今、コンビニの前にいます。",
        "slot": "コンビニの前",
        "cue": {
          "en": "in front of the convenience store",
          "ko": "편의점 앞"
        },
        "gloss": {
          "en": "I'm in front of the convenience store now.",
          "ko": "지금 편의점 앞에 있어요."
        }
      }
    ]
  },
  {
    "id": "ja-f1-10",
    "stage": 1,
    "fn": "like",
    "pattern": "___が好きです。",
    "core": [
      "が好きです"
    ],
    "meaning": {
      "en": "Saying what you like: I like ___.",
      "ko": "좋아하는 것 말하기: ___을/를 좋아해요."
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "日本の料理が好きです。",
        "slot": "日本の料理",
        "cue": {
          "en": "Japanese food",
          "ko": "일본 요리"
        },
        "gloss": {
          "en": "I like Japanese food.",
          "ko": "일본 요리를 좋아해요."
        }
      },
      {
        "text": "音楽が好きです。",
        "slot": "音楽",
        "cue": {
          "en": "music",
          "ko": "음악"
        },
        "gloss": {
          "en": "I like music.",
          "ko": "음악을 좋아해요."
        }
      },
      {
        "text": "サッカーが好きです。",
        "slot": "サッカー",
        "cue": {
          "en": "soccer",
          "ko": "축구"
        },
        "gloss": {
          "en": "I like soccer.",
          "ko": "축구를 좋아해요."
        }
      },
      {
        "text": "ねこが好きです。",
        "slot": "ねこ",
        "cue": {
          "en": "cats",
          "ko": "고양이"
        },
        "gloss": {
          "en": "I like cats.",
          "ko": "고양이를 좋아해요."
        }
      }
    ]
  },
  {
    "id": "ja-f1-11",
    "stage": 1,
    "fn": "possession",
    "pattern": "これはわたしの___です。",
    "core": [
      "わたしの"
    ],
    "meaning": {
      "en": "Saying what's yours: This is my ___.",
      "ko": "내 것이라고 말하기: 이건 제 ___예요."
    },
    "grammar": [
      0,
      3,
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "これはわたしのかばんです。",
        "slot": "かばん",
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
        "text": "これはわたしの傘です。",
        "slot": "傘",
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
        "text": "これはわたしの席です。",
        "slot": "席",
        "cue": {
          "en": "seat",
          "ko": "자리"
        },
        "gloss": {
          "en": "This is my seat.",
          "ko": "여기는 제 자리예요."
        }
      },
      {
        "text": "これはわたしの家族の写真です。",
        "slot": "家族の写真",
        "cue": {
          "en": "family photo",
          "ko": "가족 사진"
        },
        "gloss": {
          "en": "This is a photo of my family.",
          "ko": "이건 제 가족 사진이에요."
        }
      }
    ]
  },
  {
    "id": "ja-f1-12",
    "stage": 1,
    "fn": "ask-what",
    "pattern": "___はどれですか。",
    "core": [
      "はどれですか"
    ],
    "meaning": {
      "en": "Asking which one: Which one is ___?",
      "ko": "어느 것인지 묻기: ___은/는 어느 거예요?"
    },
    "grammar": [
      4,
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "新宿行きの電車はどれですか。",
        "slot": "新宿行きの電車",
        "cue": {
          "en": "the train for Shinjuku",
          "ko": "신주쿠행 전철"
        },
        "gloss": {
          "en": "Which one is the train for Shinjuku?",
          "ko": "신주쿠행 전철은 어느 거예요?"
        }
      },
      {
        "text": "田中さんのかばんはどれですか。",
        "slot": "田中さんのかばん",
        "cue": {
          "en": "Mr./Ms. Tanaka's bag",
          "ko": "다나카 씨 가방"
        },
        "gloss": {
          "en": "Which one is Tanaka's bag?",
          "ko": "다나카 씨 가방은 어느 거예요?"
        }
      },
      {
        "text": "おすすめはどれですか。",
        "slot": "おすすめ",
        "cue": {
          "en": "the one you recommend",
          "ko": "추천하는 것"
        },
        "gloss": {
          "en": "Which one do you recommend?",
          "ko": "추천하는 건 어느 거예요?"
        }
      },
      {
        "text": "一番安いのはどれですか。",
        "slot": "一番安いの",
        "cue": {
          "en": "the cheapest one",
          "ko": "제일 싼 것"
        },
        "gloss": {
          "en": "Which one is the cheapest?",
          "ko": "제일 싼 건 어느 거예요?"
        }
      }
    ]
  },
  {
    "id": "ja-f1-13",
    "stage": 1,
    "fn": "request-thing",
    "pattern": "___でお願いします。",
    "core": [
      "でお願いします"
    ],
    "meaning": {
      "en": "Choosing how you want it: ___, please.",
      "ko": "방식 고르기: ___(으)로 부탁해요."
    },
    "grammar": [],
    "expressions": [
      "お願いします"
    ],
    "examples": [
      {
        "text": "カードでお願いします。",
        "slot": "カード",
        "cue": {
          "en": "card",
          "ko": "카드"
        },
        "gloss": {
          "en": "By card, please.",
          "ko": "카드로 할게요."
        }
      },
      {
        "text": "現金でお願いします。",
        "slot": "現金",
        "cue": {
          "en": "cash",
          "ko": "현금"
        },
        "gloss": {
          "en": "Cash, please.",
          "ko": "현금으로 할게요."
        }
      },
      {
        "text": "持ち帰りでお願いします。",
        "slot": "持ち帰り",
        "cue": {
          "en": "takeout",
          "ko": "포장"
        },
        "gloss": {
          "en": "To go, please.",
          "ko": "포장으로 해 주세요."
        }
      },
      {
        "text": "大盛りでお願いします。",
        "slot": "大盛り",
        "cue": {
          "en": "large portion",
          "ko": "곱빼기"
        },
        "gloss": {
          "en": "A large portion, please.",
          "ko": "곱빼기로 해 주세요."
        }
      }
    ]
  },
  {
    "id": "ja-f1-14",
    "stage": 1,
    "fn": "not-understand",
    "pattern": "___がわかりません。",
    "core": [
      "がわかりません"
    ],
    "meaning": {
      "en": "Saying what you don't understand or know: I don't understand ___.",
      "ko": "모르는 것 말하기: ___을/를 모르겠어요."
    },
    "grammar": [
      2
    ],
    "expressions": [
      "わかりません"
    ],
    "examples": [
      {
        "text": "この漢字がわかりません。",
        "slot": "この漢字",
        "cue": {
          "en": "this kanji",
          "ko": "이 한자"
        },
        "gloss": {
          "en": "I don't know this kanji.",
          "ko": "이 한자를 모르겠어요."
        }
      },
      {
        "text": "この言葉がわかりません。",
        "slot": "この言葉",
        "cue": {
          "en": "this word",
          "ko": "이 말"
        },
        "gloss": {
          "en": "I don't understand this word.",
          "ko": "이 말을 모르겠어요."
        }
      },
      {
        "text": "駅までの道がわかりません。",
        "slot": "駅までの道",
        "cue": {
          "en": "the way to the station",
          "ko": "역까지 가는 길"
        },
        "gloss": {
          "en": "I don't know the way to the station.",
          "ko": "역까지 가는 길을 모르겠어요."
        }
      },
      {
        "text": "使い方がわかりません。",
        "slot": "使い方",
        "cue": {
          "en": "how to use it",
          "ko": "쓰는 법"
        },
        "gloss": {
          "en": "I don't know how to use it.",
          "ko": "쓰는 법을 모르겠어요."
        }
      }
    ]
  },
  {
    "id": "ja-f1-15",
    "stage": 1,
    "fn": "dislike",
    "pattern": "___は食べません。",
    "core": [
      "は食べません"
    ],
    "meaning": {
      "en": "Saying what you don't eat: I don't eat ___.",
      "ko": "안 먹는 것 말하기: ___은/는 안 먹어요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "肉は食べません。",
        "slot": "肉",
        "cue": {
          "en": "meat",
          "ko": "고기"
        },
        "gloss": {
          "en": "I don't eat meat.",
          "ko": "고기는 안 먹어요."
        }
      },
      {
        "text": "えびは食べません。",
        "slot": "えび",
        "cue": {
          "en": "shrimp",
          "ko": "새우"
        },
        "gloss": {
          "en": "I don't eat shrimp.",
          "ko": "새우는 안 먹어요."
        }
      },
      {
        "text": "生の魚は食べません。",
        "slot": "生の魚",
        "cue": {
          "en": "raw fish",
          "ko": "날생선"
        },
        "gloss": {
          "en": "I don't eat raw fish.",
          "ko": "날생선은 안 먹어요."
        }
      },
      {
        "text": "辛いものは食べません。",
        "slot": "辛いもの",
        "cue": {
          "en": "spicy food",
          "ko": "매운 것"
        },
        "gloss": {
          "en": "I don't eat spicy food.",
          "ko": "매운 건 안 먹어요."
        }
      }
    ]
  },
  {
    "id": "ja-f1-16",
    "stage": 1,
    "fn": "thank",
    "pattern": "___をありがとうございます。",
    "core": [
      "をありがとうございます"
    ],
    "meaning": {
      "en": "Thanking for something: Thank you for ___.",
      "ko": "무엇에 대해 고마워하기: ___ 고마워요."
    },
    "grammar": [],
    "expressions": [
      "ありがとうございます"
    ],
    "examples": [
      {
        "text": "プレゼントをありがとうございます。",
        "slot": "プレゼント",
        "cue": {
          "en": "present",
          "ko": "선물"
        },
        "gloss": {
          "en": "Thank you for the present.",
          "ko": "선물 고마워요."
        }
      },
      {
        "text": "お土産をありがとうございます。",
        "slot": "お土産",
        "cue": {
          "en": "souvenir gift",
          "ko": "기념 선물"
        },
        "gloss": {
          "en": "Thank you for the souvenir.",
          "ko": "기념 선물 고마워요."
        }
      },
      {
        "text": "メールをありがとうございます。",
        "slot": "メール",
        "cue": {
          "en": "email",
          "ko": "메일"
        },
        "gloss": {
          "en": "Thank you for your email.",
          "ko": "메일 고마워요."
        }
      },
      {
        "text": "きれいなお花をありがとうございます。",
        "slot": "きれいなお花",
        "cue": {
          "en": "beautiful flowers",
          "ko": "예쁜 꽃"
        },
        "gloss": {
          "en": "Thank you for the beautiful flowers.",
          "ko": "예쁜 꽃 고마워요."
        }
      }
    ]
  },
  {
    "id": "ja-f2-01",
    "stage": 2,
    "fn": "permission",
    "pattern": "___てもいいですか。",
    "core": [
      "てもいいですか"
    ],
    "meaning": {
      "en": "Asking permission: May I ___?",
      "ko": "허락 구하기: ___해도 돼요?"
    },
    "grammar": [
      4
    ],
    "expressions": [
      "写真を撮ってもいいですか"
    ],
    "examples": [
      {
        "text": "写真を撮ってもいいですか。",
        "slot": "写真を撮って",
        "cue": {
          "en": "take a photo",
          "ko": "사진을 찍다"
        },
        "gloss": {
          "en": "May I take a photo?",
          "ko": "사진 찍어도 돼요?"
        }
      },
      {
        "text": "ここに座ってもいいですか。",
        "slot": "ここに座って",
        "cue": {
          "en": "sit here",
          "ko": "여기 앉다"
        },
        "gloss": {
          "en": "May I sit here?",
          "ko": "여기 앉아도 돼요?"
        }
      },
      {
        "text": "窓を開けてもいいですか。",
        "slot": "窓を開けて",
        "cue": {
          "en": "open the window",
          "ko": "창문을 열다"
        },
        "gloss": {
          "en": "May I open the window?",
          "ko": "창문 열어도 돼요?"
        }
      },
      {
        "text": "試着してもいいですか。",
        "slot": "試着して",
        "cue": {
          "en": "try (clothes) on",
          "ko": "입어 보다"
        },
        "gloss": {
          "en": "May I try it on?",
          "ko": "입어 봐도 돼요?"
        }
      }
    ]
  },
  {
    "id": "ja-f2-02",
    "stage": 2,
    "fn": "request-action",
    "pattern": "___てください。",
    "core": [
      "てください"
    ],
    "meaning": {
      "en": "Asking someone to do something: Please ___.",
      "ko": "부탁하기: ___해 주세요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "もう少しゆっくり話してください。",
        "slot": "もう少しゆっくり話して",
        "cue": {
          "en": "speak a little more slowly",
          "ko": "조금 더 천천히 말하다"
        },
        "gloss": {
          "en": "Please speak a little more slowly.",
          "ko": "조금 더 천천히 말해 주세요."
        }
      },
      {
        "text": "もう一度言ってください。",
        "slot": "もう一度言って",
        "cue": {
          "en": "say it once more",
          "ko": "한 번 더 말하다"
        },
        "gloss": {
          "en": "Please say that again.",
          "ko": "한 번 더 말해 주세요."
        }
      },
      {
        "text": "ここに名前を書いてください。",
        "slot": "ここに名前を書いて",
        "cue": {
          "en": "write your name here",
          "ko": "여기에 이름을 쓰다"
        },
        "gloss": {
          "en": "Please write your name here.",
          "ko": "여기에 이름을 써 주세요."
        }
      },
      {
        "text": "ちょっと手伝ってください。",
        "slot": "ちょっと手伝って",
        "cue": {
          "en": "help a little",
          "ko": "좀 돕다"
        },
        "gloss": {
          "en": "Please give me a hand.",
          "ko": "좀 도와주세요."
        }
      }
    ]
  },
  {
    "id": "ja-f2-03",
    "stage": 2,
    "fn": "want",
    "pattern": "___たいです。",
    "core": [
      "たいです"
    ],
    "meaning": {
      "en": "Saying what you want to do: I want to ___.",
      "ko": "하고 싶은 것 말하기: ___하고 싶어요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "京都に行きたいです。",
        "slot": "京都に行き",
        "cue": {
          "en": "go to Kyoto",
          "ko": "교토에 가다"
        },
        "gloss": {
          "en": "I want to go to Kyoto.",
          "ko": "교토에 가고 싶어요."
        }
      },
      {
        "text": "おすしを食べたいです。",
        "slot": "おすしを食べ",
        "cue": {
          "en": "eat sushi",
          "ko": "초밥을 먹다"
        },
        "gloss": {
          "en": "I want to eat sushi.",
          "ko": "초밥을 먹고 싶어요."
        }
      },
      {
        "text": "日本語を練習したいです。",
        "slot": "日本語を練習し",
        "cue": {
          "en": "practise Japanese",
          "ko": "일본어를 연습하다"
        },
        "gloss": {
          "en": "I want to practise Japanese.",
          "ko": "일본어를 연습하고 싶어요."
        }
      },
      {
        "text": "少し休みたいです。",
        "slot": "少し休み",
        "cue": {
          "en": "rest a little",
          "ko": "좀 쉬다"
        },
        "gloss": {
          "en": "I want to rest a bit.",
          "ko": "좀 쉬고 싶어요."
        }
      }
    ]
  },
  {
    "id": "ja-f2-04",
    "stage": 2,
    "fn": "invite",
    "pattern": "一緒に___ませんか。",
    "core": [
      "一緒に",
      "ませんか"
    ],
    "meaning": {
      "en": "Inviting someone: Would you like to ___ together?",
      "ko": "권하기: 같이 ___할래요?"
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "一緒に昼ご飯を食べませんか。",
        "slot": "昼ご飯を食べ",
        "cue": {
          "en": "eat lunch",
          "ko": "점심을 먹다"
        },
        "gloss": {
          "en": "Would you like to have lunch together?",
          "ko": "같이 점심 먹을래요?"
        }
      },
      {
        "text": "一緒にカフェに行きませんか。",
        "slot": "カフェに行き",
        "cue": {
          "en": "go to a café",
          "ko": "카페에 가다"
        },
        "gloss": {
          "en": "Shall we go to a café together?",
          "ko": "같이 카페에 갈래요?"
        }
      },
      {
        "text": "一緒に映画を見ませんか。",
        "slot": "映画を見",
        "cue": {
          "en": "watch a movie",
          "ko": "영화를 보다"
        },
        "gloss": {
          "en": "Would you like to watch a movie together?",
          "ko": "같이 영화 볼래요?"
        }
      },
      {
        "text": "一緒に日本語を勉強しませんか。",
        "slot": "日本語を勉強し",
        "cue": {
          "en": "study Japanese",
          "ko": "일본어를 공부하다"
        },
        "gloss": {
          "en": "Would you like to study Japanese together?",
          "ko": "같이 일본어 공부할래요?"
        }
      }
    ]
  },
  {
    "id": "ja-f2-05",
    "stage": 2,
    "fn": "suggest-time",
    "pattern": "___で会いましょう。",
    "core": [
      "で会いましょう"
    ],
    "meaning": {
      "en": "Setting a meeting place: Let's meet at ___.",
      "ko": "만날 곳 정하기: ___에서 만나요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "駅の北口で会いましょう。",
        "slot": "駅の北口",
        "cue": {
          "en": "the station's north exit",
          "ko": "역 북쪽 출구"
        },
        "gloss": {
          "en": "Let's meet at the north exit of the station.",
          "ko": "역 북쪽 출구에서 만나요."
        }
      },
      {
        "text": "カフェの前で会いましょう。",
        "slot": "カフェの前",
        "cue": {
          "en": "in front of the café",
          "ko": "카페 앞"
        },
        "gloss": {
          "en": "Let's meet in front of the café.",
          "ko": "카페 앞에서 만나요."
        }
      },
      {
        "text": "改札の前で会いましょう。",
        "slot": "改札の前",
        "cue": {
          "en": "in front of the ticket gates",
          "ko": "개찰구 앞"
        },
        "gloss": {
          "en": "Let's meet in front of the ticket gates.",
          "ko": "개찰구 앞에서 만나요."
        }
      },
      {
        "text": "ホテルのロビーで会いましょう。",
        "slot": "ホテルのロビー",
        "cue": {
          "en": "the hotel lobby",
          "ko": "호텔 로비"
        },
        "gloss": {
          "en": "Let's meet in the hotel lobby.",
          "ko": "호텔 로비에서 만나요."
        }
      }
    ]
  },
  {
    "id": "ja-f2-06",
    "stage": 2,
    "fn": "suggest-time",
    "pattern": "じゃあ、___にしましょう。",
    "core": [
      "にしましょう"
    ],
    "meaning": {
      "en": "Settling on a choice: Let's go with ___ then.",
      "ko": "정하기: 그럼 ___(으)로 해요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "じゃあ、三時にしましょう。",
        "slot": "三時",
        "cue": {
          "en": "three o'clock",
          "ko": "세 시"
        },
        "gloss": {
          "en": "Let's make it three o'clock, then.",
          "ko": "그럼 세 시로 해요."
        }
      },
      {
        "text": "じゃあ、木曜日にしましょう。",
        "slot": "木曜日",
        "cue": {
          "en": "Thursday",
          "ko": "목요일"
        },
        "gloss": {
          "en": "Let's make it Thursday, then.",
          "ko": "그럼 목요일로 해요."
        }
      },
      {
        "text": "じゃあ、ラーメンにしましょう。",
        "slot": "ラーメン",
        "cue": {
          "en": "ramen",
          "ko": "라멘"
        },
        "gloss": {
          "en": "Let's go with ramen, then.",
          "ko": "그럼 라멘으로 해요."
        }
      },
      {
        "text": "じゃあ、あの店にしましょう。",
        "slot": "あの店",
        "cue": {
          "en": "that shop / restaurant",
          "ko": "저 가게"
        },
        "gloss": {
          "en": "Let's go to that place, then.",
          "ko": "그럼 저 가게로 해요."
        }
      }
    ]
  },
  {
    "id": "ja-f2-07",
    "stage": 2,
    "fn": "experience",
    "pattern": "___たことがあります。",
    "core": [
      "たことがあります"
    ],
    "meaning": {
      "en": "Saying what you've done before: I've ___ before.",
      "ko": "해 본 일 말하기: ___한 적이 있어요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "北海道に行ったことがあります。",
        "slot": "北海道に行っ",
        "cue": {
          "en": "go to Hokkaido",
          "ko": "홋카이도에 가다"
        },
        "gloss": {
          "en": "I've been to Hokkaido.",
          "ko": "홋카이도에 간 적이 있어요."
        }
      },
      {
        "text": "富士山に登ったことがあります。",
        "slot": "富士山に登っ",
        "cue": {
          "en": "climb Mt. Fuji",
          "ko": "후지산에 오르다"
        },
        "gloss": {
          "en": "I've climbed Mt. Fuji.",
          "ko": "후지산에 오른 적이 있어요."
        }
      },
      {
        "text": "納豆を食べたことがあります。",
        "slot": "納豆を食べ",
        "cue": {
          "en": "eat natto",
          "ko": "낫토를 먹다"
        },
        "gloss": {
          "en": "I've eaten natto.",
          "ko": "낫토를 먹어 본 적이 있어요."
        }
      },
      {
        "text": "着物を着たことがあります。",
        "slot": "着物を着",
        "cue": {
          "en": "wear a kimono",
          "ko": "기모노를 입다"
        },
        "gloss": {
          "en": "I've worn a kimono.",
          "ko": "기모노를 입어 본 적이 있어요."
        }
      }
    ]
  },
  {
    "id": "ja-f2-08",
    "stage": 2,
    "fn": "experience",
    "pattern": "___たことがありますか。",
    "core": [
      "たことがありますか"
    ],
    "meaning": {
      "en": "Asking about experience: Have you ever ___?",
      "ko": "경험 묻기: ___한 적 있어요?"
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "日本に来たことがありますか。",
        "slot": "日本に来",
        "cue": {
          "en": "come to Japan",
          "ko": "일본에 오다"
        },
        "gloss": {
          "en": "Have you been to Japan before?",
          "ko": "일본에 온 적 있어요?"
        }
      },
      {
        "text": "温泉に入ったことがありますか。",
        "slot": "温泉に入っ",
        "cue": {
          "en": "bathe in a hot spring",
          "ko": "온천에 들어가다"
        },
        "gloss": {
          "en": "Have you ever been in a hot spring?",
          "ko": "온천에 가 본 적 있어요?"
        }
      },
      {
        "text": "新幹線に乗ったことがありますか。",
        "slot": "新幹線に乗っ",
        "cue": {
          "en": "ride the Shinkansen",
          "ko": "신칸센을 타다"
        },
        "gloss": {
          "en": "Have you ever ridden the Shinkansen?",
          "ko": "신칸센 타 본 적 있어요?"
        }
      },
      {
        "text": "おすしを作ったことがありますか。",
        "slot": "おすしを作っ",
        "cue": {
          "en": "make sushi",
          "ko": "초밥을 만들다"
        },
        "gloss": {
          "en": "Have you ever made sushi?",
          "ko": "초밥 만들어 본 적 있어요?"
        }
      }
    ]
  },
  {
    "id": "ja-f2-09",
    "stage": 2,
    "fn": "reason",
    "pattern": "___から、先に帰ります。",
    "core": [
      "から、先に帰ります"
    ],
    "meaning": {
      "en": "Giving a reason: Since ___, I'll head home first.",
      "ko": "이유 대기: ___(으)니까 먼저 갈게요."
    },
    "grammar": [
      7,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "明日は朝が早いから、先に帰ります。",
        "slot": "明日は朝が早い",
        "cue": {
          "en": "have an early start tomorrow",
          "ko": "내일 아침이 이르다"
        },
        "gloss": {
          "en": "I have an early start tomorrow, so I'll head home first.",
          "ko": "내일 아침이 일러서 먼저 갈게요."
        }
      },
      {
        "text": "雨が降っているから、先に帰ります。",
        "slot": "雨が降っている",
        "cue": {
          "en": "it is raining",
          "ko": "비가 오고 있다"
        },
        "gloss": {
          "en": "It's raining, so I'll head home first.",
          "ko": "비가 와서 먼저 갈게요."
        }
      },
      {
        "text": "少し頭が痛いから、先に帰ります。",
        "slot": "少し頭が痛い",
        "cue": {
          "en": "have a slight headache",
          "ko": "머리가 좀 아프다"
        },
        "gloss": {
          "en": "I have a bit of a headache, so I'll head home first.",
          "ko": "머리가 좀 아파서 먼저 갈게요."
        }
      },
      {
        "text": "子どもが待っているから、先に帰ります。",
        "slot": "子どもが待っている",
        "cue": {
          "en": "my child is waiting",
          "ko": "아이가 기다리고 있다"
        },
        "gloss": {
          "en": "My kid is waiting, so I'll head home first.",
          "ko": "아이가 기다리고 있어서 먼저 갈게요."
        }
      }
    ]
  },
  {
    "id": "ja-f2-10",
    "stage": 2,
    "fn": "decline",
    "pattern": "すみません、___はちょっと…。",
    "core": [
      "はちょっと"
    ],
    "meaning": {
      "en": "Softly declining: Sorry, ___ is a bit difficult…",
      "ko": "부드럽게 거절하기: 죄송한데 ___은/는 좀…."
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "すみません、土曜日はちょっと…。",
        "slot": "土曜日",
        "cue": {
          "en": "Saturday",
          "ko": "토요일"
        },
        "gloss": {
          "en": "Sorry, Saturday is a bit difficult…",
          "ko": "죄송한데 토요일은 좀…."
        }
      },
      {
        "text": "すみません、辛いものはちょっと…。",
        "slot": "辛いもの",
        "cue": {
          "en": "spicy food",
          "ko": "매운 것"
        },
        "gloss": {
          "en": "Sorry, I'm not great with spicy food…",
          "ko": "죄송한데 매운 건 좀…."
        }
      },
      {
        "text": "すみません、朝早くはちょっと…。",
        "slot": "朝早く",
        "cue": {
          "en": "early in the morning",
          "ko": "아침 일찍"
        },
        "gloss": {
          "en": "Sorry, early mornings are a bit hard for me…",
          "ko": "죄송한데 아침 일찍은 좀…."
        }
      },
      {
        "text": "すみません、その日はちょっと…。",
        "slot": "その日",
        "cue": {
          "en": "that day",
          "ko": "그날"
        },
        "gloss": {
          "en": "Sorry, that day doesn't really work…",
          "ko": "죄송한데 그날은 좀…."
        }
      }
    ]
  },
  {
    "id": "ja-f2-11",
    "stage": 2,
    "fn": "ongoing",
    "pattern": "今、___ています。",
    "core": [
      "ています"
    ],
    "meaning": {
      "en": "Saying what you're doing now: I'm ___ right now.",
      "ko": "지금 하는 일 말하기: 지금 ___하고 있어요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "今、駅で待っています。",
        "slot": "駅で待っ",
        "cue": {
          "en": "wait at the station",
          "ko": "역에서 기다리다"
        },
        "gloss": {
          "en": "I'm waiting at the station right now.",
          "ko": "지금 역에서 기다리고 있어요."
        }
      },
      {
        "text": "今、電車に乗っています。",
        "slot": "電車に乗っ",
        "cue": {
          "en": "ride the train",
          "ko": "전철을 타다"
        },
        "gloss": {
          "en": "I'm on the train right now.",
          "ko": "지금 전철 타고 있어요."
        }
      },
      {
        "text": "今、昼ご飯を食べています。",
        "slot": "昼ご飯を食べ",
        "cue": {
          "en": "eat lunch",
          "ko": "점심을 먹다"
        },
        "gloss": {
          "en": "I'm having lunch right now.",
          "ko": "지금 점심 먹고 있어요."
        }
      },
      {
        "text": "今、雨が降っています。",
        "slot": "雨が降っ",
        "cue": {
          "en": "rain falls",
          "ko": "비가 오다"
        },
        "gloss": {
          "en": "It's raining right now.",
          "ko": "지금 비가 오고 있어요."
        }
      }
    ]
  },
  {
    "id": "ja-f2-12",
    "stage": 2,
    "fn": "live-where",
    "pattern": "___に住んでいます。",
    "core": [
      "に住んでいます"
    ],
    "meaning": {
      "en": "Saying where you live: I live in ___.",
      "ko": "사는 곳 말하기: ___에 살고 있어요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ソウルに住んでいます。",
        "slot": "ソウル",
        "cue": {
          "en": "Seoul",
          "ko": "서울"
        },
        "gloss": {
          "en": "I live in Seoul.",
          "ko": "서울에 살고 있어요."
        }
      },
      {
        "text": "東京に住んでいます。",
        "slot": "東京",
        "cue": {
          "en": "Tokyo",
          "ko": "도쿄"
        },
        "gloss": {
          "en": "I live in Tokyo.",
          "ko": "도쿄에 살고 있어요."
        }
      },
      {
        "text": "大阪に住んでいます。",
        "slot": "大阪",
        "cue": {
          "en": "Osaka",
          "ko": "오사카"
        },
        "gloss": {
          "en": "I live in Osaka.",
          "ko": "오사카에 살고 있어요."
        }
      },
      {
        "text": "駅の近くに住んでいます。",
        "slot": "駅の近く",
        "cue": {
          "en": "near the station",
          "ko": "역 근처"
        },
        "gloss": {
          "en": "I live near the station.",
          "ko": "역 근처에 살고 있어요."
        }
      }
    ]
  },
  {
    "id": "ja-f2-13",
    "stage": 2,
    "fn": "past-did",
    "pattern": "昨日、___ました。",
    "core": [
      "昨日",
      "ました"
    ],
    "meaning": {
      "en": "Saying what you did: Yesterday I ___.",
      "ko": "한 일 말하기: 어제 ___했어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "昨日、友だちと買い物しました。",
        "slot": "友だちと買い物し",
        "cue": {
          "en": "go shopping with a friend",
          "ko": "친구와 쇼핑하다"
        },
        "gloss": {
          "en": "Yesterday I went shopping with a friend.",
          "ko": "어제 친구랑 쇼핑했어요."
        }
      },
      {
        "text": "昨日、映画を見ました。",
        "slot": "映画を見",
        "cue": {
          "en": "watch a movie",
          "ko": "영화를 보다"
        },
        "gloss": {
          "en": "Yesterday I watched a movie.",
          "ko": "어제 영화를 봤어요."
        }
      },
      {
        "text": "昨日、家でゆっくり休みました。",
        "slot": "家でゆっくり休み",
        "cue": {
          "en": "relax at home",
          "ko": "집에서 푹 쉬다"
        },
        "gloss": {
          "en": "Yesterday I relaxed at home.",
          "ko": "어제 집에서 푹 쉬었어요."
        }
      },
      {
        "text": "昨日、日本語を勉強しました。",
        "slot": "日本語を勉強し",
        "cue": {
          "en": "study Japanese",
          "ko": "일본어를 공부하다"
        },
        "gloss": {
          "en": "Yesterday I studied Japanese.",
          "ko": "어제 일본어를 공부했어요."
        }
      }
    ]
  },
  {
    "id": "ja-f2-14",
    "stage": 2,
    "fn": "look-forward",
    "pattern": "___が楽しみです。",
    "core": [
      "が楽しみです"
    ],
    "meaning": {
      "en": "Saying what you look forward to: I'm looking forward to ___.",
      "ko": "기대되는 것 말하기: ___이/가 기대돼요."
    },
    "grammar": [],
    "expressions": [
      "楽しみです"
    ],
    "examples": [
      {
        "text": "週末が楽しみです。",
        "slot": "週末",
        "cue": {
          "en": "the weekend",
          "ko": "주말"
        },
        "gloss": {
          "en": "I'm looking forward to the weekend.",
          "ko": "주말이 기대돼요."
        }
      },
      {
        "text": "旅行が楽しみです。",
        "slot": "旅行",
        "cue": {
          "en": "the trip",
          "ko": "여행"
        },
        "gloss": {
          "en": "I'm looking forward to the trip.",
          "ko": "여행이 기대돼요."
        }
      },
      {
        "text": "明日のパーティーが楽しみです。",
        "slot": "明日のパーティー",
        "cue": {
          "en": "tomorrow's party",
          "ko": "내일 파티"
        },
        "gloss": {
          "en": "I'm looking forward to tomorrow's party.",
          "ko": "내일 파티가 기대돼요."
        }
      },
      {
        "text": "夏休みが楽しみです。",
        "slot": "夏休み",
        "cue": {
          "en": "the summer holidays",
          "ko": "여름휴가"
        },
        "gloss": {
          "en": "I'm looking forward to the summer holidays.",
          "ko": "여름휴가가 기대돼요."
        }
      }
    ]
  },
  {
    "id": "ja-f2-15",
    "stage": 2,
    "fn": "ask-opinion-simple",
    "pattern": "___はどうでしたか。",
    "core": [
      "はどうでしたか"
    ],
    "meaning": {
      "en": "Asking how something went: How was ___?",
      "ko": "어땠는지 묻기: ___은/는 어땠어요?"
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "週末はどうでしたか。",
        "slot": "週末",
        "cue": {
          "en": "the weekend",
          "ko": "주말"
        },
        "gloss": {
          "en": "How was your weekend?",
          "ko": "주말은 어땠어요?"
        }
      },
      {
        "text": "旅行はどうでしたか。",
        "slot": "旅行",
        "cue": {
          "en": "the trip",
          "ko": "여행"
        },
        "gloss": {
          "en": "How was the trip?",
          "ko": "여행은 어땠어요?"
        }
      },
      {
        "text": "テストはどうでしたか。",
        "slot": "テスト",
        "cue": {
          "en": "the test",
          "ko": "시험"
        },
        "gloss": {
          "en": "How did the test go?",
          "ko": "시험은 어땠어요?"
        }
      },
      {
        "text": "京都はどうでしたか。",
        "slot": "京都",
        "cue": {
          "en": "Kyoto",
          "ko": "교토"
        },
        "gloss": {
          "en": "How was Kyoto?",
          "ko": "교토는 어땠어요?"
        }
      }
    ]
  },
  {
    "id": "ja-f2-16",
    "stage": 2,
    "fn": "suggest-time",
    "pattern": "___はどうですか。",
    "core": [
      "はどうですか"
    ],
    "meaning": {
      "en": "Suggesting an option: How about ___?",
      "ko": "제안하기: ___은/는 어때요?"
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "来週の金曜日はどうですか。",
        "slot": "来週の金曜日",
        "cue": {
          "en": "next Friday",
          "ko": "다음 주 금요일"
        },
        "gloss": {
          "en": "How about next Friday?",
          "ko": "다음 주 금요일은 어때요?"
        }
      },
      {
        "text": "日曜日の十一時はどうですか。",
        "slot": "日曜日の十一時",
        "cue": {
          "en": "eleven o'clock on Sunday",
          "ko": "일요일 열한 시"
        },
        "gloss": {
          "en": "How about eleven on Sunday?",
          "ko": "일요일 열한 시는 어때요?"
        }
      },
      {
        "text": "この店はどうですか。",
        "slot": "この店",
        "cue": {
          "en": "this place",
          "ko": "이 가게"
        },
        "gloss": {
          "en": "How about this place?",
          "ko": "이 가게는 어때요?"
        }
      },
      {
        "text": "駅の前のカフェはどうですか。",
        "slot": "駅の前のカフェ",
        "cue": {
          "en": "the café in front of the station",
          "ko": "역 앞 카페"
        },
        "gloss": {
          "en": "How about the café in front of the station?",
          "ko": "역 앞 카페는 어때요?"
        }
      }
    ]
  },
  {
    "id": "ja-f2-17",
    "stage": 2,
    "fn": "symptom",
    "pattern": "___が痛いです。",
    "core": [
      "が痛いです"
    ],
    "meaning": {
      "en": "Saying where it hurts: My ___ hurts.",
      "ko": "아픈 곳 말하기: ___이/가 아파요."
    },
    "grammar": [],
    "expressions": [
      "頭が痛いです"
    ],
    "examples": [
      {
        "text": "頭が痛いです。",
        "slot": "頭",
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
        "text": "のどが痛いです。",
        "slot": "のど",
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
        "text": "おなかが痛いです。",
        "slot": "おなか",
        "cue": {
          "en": "stomach",
          "ko": "배"
        },
        "gloss": {
          "en": "I have a stomachache.",
          "ko": "배가 아파요."
        }
      },
      {
        "text": "歯が痛いです。",
        "slot": "歯",
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
    "id": "ja-f2-18",
    "stage": 2,
    "fn": "lost-problem",
    "pattern": "___をなくしました。",
    "core": [
      "をなくしました"
    ],
    "meaning": {
      "en": "Reporting something lost: I lost my ___.",
      "ko": "잃어버린 것 말하기: ___을/를 잃어버렸어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "財布をなくしました。",
        "slot": "財布",
        "cue": {
          "en": "wallet",
          "ko": "지갑"
        },
        "gloss": {
          "en": "I lost my wallet.",
          "ko": "지갑을 잃어버렸어요."
        }
      },
      {
        "text": "スマホをなくしました。",
        "slot": "スマホ",
        "cue": {
          "en": "smartphone",
          "ko": "스마트폰"
        },
        "gloss": {
          "en": "I lost my phone.",
          "ko": "휴대폰을 잃어버렸어요."
        }
      },
      {
        "text": "かぎをなくしました。",
        "slot": "かぎ",
        "cue": {
          "en": "key",
          "ko": "열쇠"
        },
        "gloss": {
          "en": "I lost my key.",
          "ko": "열쇠를 잃어버렸어요."
        }
      },
      {
        "text": "切符をなくしました。",
        "slot": "切符",
        "cue": {
          "en": "ticket",
          "ko": "표"
        },
        "gloss": {
          "en": "I lost my ticket.",
          "ko": "표를 잃어버렸어요."
        }
      }
    ]
  },
  {
    "id": "ja-f2-19",
    "stage": 2,
    "fn": "past-did",
    "pattern": "もう___ましたか。",
    "core": [
      "もう",
      "ましたか"
    ],
    "meaning": {
      "en": "Asking if something is done yet: Have you ___ yet?",
      "ko": "벌써 했는지 묻기: 벌써 ___했어요?"
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "もう昼ご飯を食べましたか。",
        "slot": "昼ご飯を食べ",
        "cue": {
          "en": "eat lunch",
          "ko": "점심을 먹다"
        },
        "gloss": {
          "en": "Have you had lunch yet?",
          "ko": "점심 벌써 먹었어요?"
        }
      },
      {
        "text": "もう部長に連絡しましたか。",
        "slot": "部長に連絡し",
        "cue": {
          "en": "contact the manager",
          "ko": "부장님께 연락하다"
        },
        "gloss": {
          "en": "Have you contacted the manager yet?",
          "ko": "부장님께 벌써 연락했어요?"
        }
      },
      {
        "text": "もうチケットを買いましたか。",
        "slot": "チケットを買い",
        "cue": {
          "en": "buy the tickets",
          "ko": "표를 사다"
        },
        "gloss": {
          "en": "Have you bought the tickets yet?",
          "ko": "표 벌써 샀어요?"
        }
      },
      {
        "text": "もう薬を飲みましたか。",
        "slot": "薬を飲み",
        "cue": {
          "en": "take the medicine",
          "ko": "약을 먹다"
        },
        "gloss": {
          "en": "Have you taken your medicine yet?",
          "ko": "약 벌써 먹었어요?"
        }
      }
    ]
  },
  {
    "id": "ja-f2-20",
    "stage": 2,
    "fn": "recommend-ask",
    "pattern": "___は何がおすすめですか。",
    "core": [
      "何がおすすめですか"
    ],
    "meaning": {
      "en": "Asking for a recommendation: What do you recommend for ___?",
      "ko": "추천 묻기: ___은/는 뭐가 좋아요?"
    },
    "grammar": [],
    "expressions": [
      "何がおすすめですか"
    ],
    "examples": [
      {
        "text": "ランチは何がおすすめですか。",
        "slot": "ランチ",
        "cue": {
          "en": "lunch",
          "ko": "점심 메뉴"
        },
        "gloss": {
          "en": "What do you recommend for lunch?",
          "ko": "점심은 뭐가 좋아요?"
        }
      },
      {
        "text": "飲み物は何がおすすめですか。",
        "slot": "飲み物",
        "cue": {
          "en": "drinks",
          "ko": "음료"
        },
        "gloss": {
          "en": "What drink do you recommend?",
          "ko": "음료는 뭐가 좋아요?"
        }
      },
      {
        "text": "この店は何がおすすめですか。",
        "slot": "この店",
        "cue": {
          "en": "this place",
          "ko": "이 가게"
        },
        "gloss": {
          "en": "What's good here?",
          "ko": "이 가게는 뭐가 맛있어요?"
        }
      },
      {
        "text": "デザートは何がおすすめですか。",
        "slot": "デザート",
        "cue": {
          "en": "dessert",
          "ko": "디저트"
        },
        "gloss": {
          "en": "What dessert do you recommend?",
          "ko": "디저트는 뭐가 좋아요?"
        }
      }
    ]
  },
  {
    "id": "ja-f3-01",
    "stage": 3,
    "fn": "apologize-late",
    "pattern": "実は、___んです。",
    "core": [
      "実は"
    ],
    "meaning": {
      "en": "Explaining what happened: Actually, ___.",
      "ko": "사정 설명하기: 실은 ___거든요."
    },
    "grammar": [
      1,
      0
    ],
    "expressions": [
      "実は"
    ],
    "examples": [
      {
        "text": "実は、寝坊したんです。",
        "slot": "寝坊した",
        "cue": {
          "en": "oversleep",
          "ko": "늦잠 자다"
        },
        "gloss": {
          "en": "Actually, I overslept.",
          "ko": "실은 늦잠을 잤거든요."
        }
      },
      {
        "text": "実は、電車が止まっていたんです。",
        "slot": "電車が止まっていた",
        "cue": {
          "en": "the trains are stopped",
          "ko": "전철이 멈춰 있다"
        },
        "gloss": {
          "en": "Actually, the trains had stopped.",
          "ko": "실은 전철이 멈춰 있었거든요."
        }
      },
      {
        "text": "実は、来月引っ越すんです。",
        "slot": "来月引っ越す",
        "cue": {
          "en": "move house next month",
          "ko": "다음 달에 이사하다"
        },
        "gloss": {
          "en": "Actually, I'm moving next month.",
          "ko": "실은 다음 달에 이사하거든요."
        }
      },
      {
        "text": "実は、昨日から熱があるんです。",
        "slot": "昨日から熱がある",
        "cue": {
          "en": "have had a fever since yesterday",
          "ko": "어제부터 열이 있다"
        },
        "gloss": {
          "en": "Actually, I've had a fever since yesterday.",
          "ko": "실은 어제부터 열이 있거든요."
        }
      }
    ]
  },
  {
    "id": "ja-f3-02",
    "stage": 3,
    "fn": "complain",
    "pattern": "すみません、___ないんです。",
    "core": [
      "ないんです"
    ],
    "meaning": {
      "en": "Reporting a problem politely: Excuse me, ___ isn't working.",
      "ko": "문제 알리기: 저기요, ___이 안 돼요."
    },
    "grammar": [
      1,
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "すみません、お湯が出ないんです。",
        "slot": "お湯が出",
        "cue": {
          "en": "hot water comes out",
          "ko": "뜨거운 물이 나오다"
        },
        "gloss": {
          "en": "Excuse me, there's no hot water.",
          "ko": "저기요, 뜨거운 물이 안 나와요."
        }
      },
      {
        "text": "すみません、エアコンがつかないんです。",
        "slot": "エアコンがつか",
        "cue": {
          "en": "the air conditioner turns on",
          "ko": "에어컨이 켜지다"
        },
        "gloss": {
          "en": "Excuse me, the air conditioner won't turn on.",
          "ko": "저기요, 에어컨이 안 켜져요."
        }
      },
      {
        "text": "すみません、部屋の鍵が開かないんです。",
        "slot": "部屋の鍵が開か",
        "cue": {
          "en": "the room door unlocks",
          "ko": "방 문이 열리다"
        },
        "gloss": {
          "en": "Excuse me, my room door won't unlock.",
          "ko": "저기요, 방 문이 안 열려요."
        }
      },
      {
        "text": "すみません、Wi-Fiがつながらないんです。",
        "slot": "Wi-Fiがつながら",
        "cue": {
          "en": "the Wi-Fi connects",
          "ko": "와이파이가 연결되다"
        },
        "gloss": {
          "en": "Excuse me, the Wi-Fi won't connect.",
          "ko": "저기요, 와이파이가 연결이 안 돼요."
        }
      }
    ]
  },
  {
    "id": "ja-f3-03",
    "stage": 3,
    "fn": "condition",
    "pattern": "___たら言ってね。",
    "core": [
      "たら言って"
    ],
    "meaning": {
      "en": "Saying what to do if something happens: If ___, let me know.",
      "ko": "조건 말하기: ___(으)면 말해."
    },
    "grammar": [
      2,
      0,
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "何かあったら言ってね。",
        "slot": "何かあっ",
        "cue": {
          "en": "something comes up",
          "ko": "무슨 일이 있다"
        },
        "gloss": {
          "en": "If anything comes up, let me know.",
          "ko": "무슨 일 있으면 말해."
        }
      },
      {
        "text": "手伝えることがあったら言ってね。",
        "slot": "手伝えることがあっ",
        "cue": {
          "en": "there is something I can help with",
          "ko": "도울 일이 있다"
        },
        "gloss": {
          "en": "If there's anything I can help with, let me know.",
          "ko": "도울 일 있으면 말해."
        }
      },
      {
        "text": "駅に着いたら言ってね。",
        "slot": "駅に着い",
        "cue": {
          "en": "arrive at the station",
          "ko": "역에 도착하다"
        },
        "gloss": {
          "en": "Let me know when you get to the station.",
          "ko": "역에 도착하면 말해."
        }
      },
      {
        "text": "疲れたら言ってね。",
        "slot": "疲れ",
        "cue": {
          "en": "get tired",
          "ko": "피곤하다"
        },
        "gloss": {
          "en": "If you get tired, let me know.",
          "ko": "피곤하면 말해."
        }
      }
    ]
  },
  {
    "id": "ja-f3-04",
    "stage": 3,
    "fn": "polite-request",
    "pattern": "よかったら、___てもらえますか。",
    "core": [
      "てもらえますか"
    ],
    "meaning": {
      "en": "Asking more politely: If you don't mind, could you ___?",
      "ko": "더 공손하게 부탁하기: 괜찮으면 ___ 주실 수 있어요?"
    },
    "grammar": [
      4,
      2
    ],
    "expressions": [
      "よかったら"
    ],
    "examples": [
      {
        "text": "よかったら、見てもらえますか。",
        "slot": "見",
        "cue": {
          "en": "take a look",
          "ko": "봐 주다"
        },
        "gloss": {
          "en": "If you don't mind, could you take a look?",
          "ko": "괜찮으면 좀 봐 주실 수 있어요?"
        }
      },
      {
        "text": "よかったら、手伝ってもらえますか。",
        "slot": "手伝っ",
        "cue": {
          "en": "help",
          "ko": "돕다"
        },
        "gloss": {
          "en": "If you don't mind, could you help me?",
          "ko": "괜찮으면 좀 도와주실 수 있어요?"
        }
      },
      {
        "text": "よかったら、写真を撮ってもらえますか。",
        "slot": "写真を撮っ",
        "cue": {
          "en": "take a photo",
          "ko": "사진을 찍다"
        },
        "gloss": {
          "en": "If you don't mind, could you take a photo of us?",
          "ko": "괜찮으면 사진 좀 찍어 주실 수 있어요?"
        }
      },
      {
        "text": "よかったら、駅まで送ってもらえますか。",
        "slot": "駅まで送っ",
        "cue": {
          "en": "take me to the station",
          "ko": "역까지 데려다주다"
        },
        "gloss": {
          "en": "If you don't mind, could you take me to the station?",
          "ko": "괜찮으면 역까지 데려다주실 수 있어요?"
        }
      }
    ]
  },
  {
    "id": "ja-f3-05",
    "stage": 3,
    "fn": "opinion",
    "pattern": "___と思うよ。",
    "core": [
      "と思う"
    ],
    "meaning": {
      "en": "Giving your opinion: I think ___.",
      "ko": "내 생각 말하기: ___ 것 같아."
    },
    "grammar": [
      3,
      0,
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "それ、すごくいいと思うよ。",
        "slot": "すごくいい",
        "cue": {
          "en": "really good",
          "ko": "정말 좋다"
        },
        "gloss": {
          "en": "I think that's really good.",
          "ko": "그거 정말 좋은 것 같아."
        }
      },
      {
        "text": "明日は晴れると思うよ。",
        "slot": "明日は晴れる",
        "cue": {
          "en": "it will be sunny tomorrow",
          "ko": "내일은 맑다"
        },
        "gloss": {
          "en": "I think it'll be sunny tomorrow.",
          "ko": "내일은 맑을 것 같아."
        }
      },
      {
        "text": "あの店はまだ開いてると思うよ。",
        "slot": "まだ開いてる",
        "cue": {
          "en": "still be open",
          "ko": "아직 열려 있다"
        },
        "gloss": {
          "en": "I think that shop is still open.",
          "ko": "그 가게 아직 열려 있을 것 같아."
        }
      },
      {
        "text": "田中さんならきっと大丈夫だと思うよ。",
        "slot": "きっと大丈夫だ",
        "cue": {
          "en": "surely be fine",
          "ko": "분명 괜찮다"
        },
        "gloss": {
          "en": "I'm sure Tanaka will be fine.",
          "ko": "다나카 씨라면 분명 괜찮을 거야."
        }
      }
    ]
  },
  {
    "id": "ja-f3-06",
    "stage": 3,
    "fn": "guess",
    "pattern": "___かもしれません。",
    "core": [
      "かもしれません",
      "かも"
    ],
    "meaning": {
      "en": "Saying something may happen: ___ maybe.",
      "ko": "짐작하기: ___(으)ㄹ지도 몰라요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "明日は雨が降るかもしれません。",
        "slot": "明日は雨が降る",
        "cue": {
          "en": "it rains tomorrow",
          "ko": "내일 비가 오다"
        },
        "gloss": {
          "en": "It might rain tomorrow.",
          "ko": "내일 비가 올지도 몰라요."
        }
      },
      {
        "text": "少し遅れるかもしれません。",
        "slot": "少し遅れる",
        "cue": {
          "en": "be a little late",
          "ko": "조금 늦다"
        },
        "gloss": {
          "en": "I might be a little late.",
          "ko": "조금 늦을지도 몰라요."
        }
      },
      {
        "text": "電車が混んでいるかもしれません。",
        "slot": "電車が混んでいる",
        "cue": {
          "en": "the train is crowded",
          "ko": "전철이 붐비다"
        },
        "gloss": {
          "en": "The train might be crowded.",
          "ko": "전철이 붐빌지도 몰라요."
        }
      },
      {
        "text": "道を間違えたかもしれません。",
        "slot": "道を間違えた",
        "cue": {
          "en": "take the wrong way",
          "ko": "길을 잘못 들다"
        },
        "gloss": {
          "en": "I might have taken the wrong way.",
          "ko": "길을 잘못 든 것 같아요."
        }
      }
    ]
  },
  {
    "id": "ja-f3-07",
    "stage": 3,
    "fn": "guess",
    "pattern": "___そうだね。",
    "core": [
      "そうだね"
    ],
    "meaning": {
      "en": "Saying how something looks: It looks ___.",
      "ko": "보고 짐작하기: ___아/어 보이네."
    },
    "grammar": [
      6,
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "このケーキ、おいしそうだね。",
        "slot": "おいし",
        "cue": {
          "en": "delicious",
          "ko": "맛있다"
        },
        "gloss": {
          "en": "This cake looks delicious.",
          "ko": "이 케이크 맛있어 보이네."
        }
      },
      {
        "text": "今日は雨が降りそうだね。",
        "slot": "雨が降り",
        "cue": {
          "en": "rain",
          "ko": "비가 오다"
        },
        "gloss": {
          "en": "Looks like it's going to rain today.",
          "ko": "오늘 비가 올 것 같네."
        }
      },
      {
        "text": "その仕事、大変そうだね。",
        "slot": "大変",
        "cue": {
          "en": "tough",
          "ko": "힘들다"
        },
        "gloss": {
          "en": "That job looks tough.",
          "ko": "그 일 힘들어 보이네."
        }
      },
      {
        "text": "あの映画、面白そうだね。",
        "slot": "面白",
        "cue": {
          "en": "interesting",
          "ko": "재미있다"
        },
        "gloss": {
          "en": "That movie looks interesting.",
          "ko": "그 영화 재미있어 보이네."
        }
      }
    ]
  },
  {
    "id": "ja-f3-08",
    "stage": 3,
    "fn": "routine",
    "pattern": "___ようにしています。",
    "core": [
      "ようにして"
    ],
    "meaning": {
      "en": "Saying what you make a point of doing: I try to ___.",
      "ko": "하려고 신경 쓰는 일 말하기: ___도록 하고 있어요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "毎日少しずつ単語を覚えるようにしています。",
        "slot": "毎日少しずつ単語を覚える",
        "cue": {
          "en": "learn a few words every day",
          "ko": "매일 조금씩 단어를 외우다"
        },
        "gloss": {
          "en": "I try to learn a few words every day.",
          "ko": "매일 조금씩 단어를 외우도록 하고 있어요."
        }
      },
      {
        "text": "夜は早く寝るようにしています。",
        "slot": "夜は早く寝る",
        "cue": {
          "en": "go to bed early at night",
          "ko": "밤에 일찍 자다"
        },
        "gloss": {
          "en": "I try to go to bed early.",
          "ko": "밤에는 일찍 자도록 하고 있어요."
        }
      },
      {
        "text": "できるだけ階段を使うようにしています。",
        "slot": "できるだけ階段を使う",
        "cue": {
          "en": "take the stairs as much as possible",
          "ko": "되도록 계단을 이용하다"
        },
        "gloss": {
          "en": "I try to take the stairs as much as I can.",
          "ko": "되도록 계단을 이용하도록 하고 있어요."
        }
      },
      {
        "text": "毎朝日本語のニュースを聞くようにしています。",
        "slot": "毎朝日本語のニュースを聞く",
        "cue": {
          "en": "listen to the news in Japanese every morning",
          "ko": "매일 아침 일본어 뉴스를 듣다"
        },
        "gloss": {
          "en": "I try to listen to the news in Japanese every morning.",
          "ko": "매일 아침 일본어 뉴스를 듣도록 하고 있어요."
        }
      }
    ]
  },
  {
    "id": "ja-f3-09",
    "stage": 3,
    "fn": "plan-intent",
    "pattern": "次からは___ようにするね。",
    "core": [
      "ようにする"
    ],
    "meaning": {
      "en": "Promising to do better: From now on I'll make sure to ___.",
      "ko": "다짐하기: 다음부터는 ___도록 할게."
    },
    "grammar": [
      5,
      0,
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "次からは早めに家を出るようにするね。",
        "slot": "早めに家を出る",
        "cue": {
          "en": "leave home early",
          "ko": "일찍 집을 나서다"
        },
        "gloss": {
          "en": "From now on I'll make sure to leave home early.",
          "ko": "다음부터는 일찍 집에서 나오도록 할게."
        }
      },
      {
        "text": "次からはちゃんと連絡するようにするね。",
        "slot": "ちゃんと連絡する",
        "cue": {
          "en": "let you know properly",
          "ko": "제대로 연락하다"
        },
        "gloss": {
          "en": "From now on I'll make sure to let you know.",
          "ko": "다음부터는 꼭 연락하도록 할게."
        }
      },
      {
        "text": "次からはアラームを二つかけるようにするね。",
        "slot": "アラームを二つかける",
        "cue": {
          "en": "set two alarms",
          "ko": "알람을 두 개 맞추다"
        },
        "gloss": {
          "en": "From now on I'll set two alarms.",
          "ko": "다음부터는 알람을 두 개 맞추도록 할게."
        }
      },
      {
        "text": "次からは時間をよく確認するようにするね。",
        "slot": "時間をよく確認する",
        "cue": {
          "en": "check the time carefully",
          "ko": "시간을 잘 확인하다"
        },
        "gloss": {
          "en": "From now on I'll check the time carefully.",
          "ko": "다음부터는 시간을 잘 확인하도록 할게."
        }
      }
    ]
  },
  {
    "id": "ja-f3-10",
    "stage": 3,
    "fn": "changed",
    "pattern": "やっと___ようになったよ。",
    "core": [
      "ようになった"
    ],
    "meaning": {
      "en": "Saying you can finally do something: I can finally ___.",
      "ko": "할 수 있게 된 것 말하기: 드디어 ___ 수 있게 됐어."
    },
    "grammar": [
      4,
      0,
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "やっと日本語で電話できるようになったよ。",
        "slot": "日本語で電話できる",
        "cue": {
          "en": "make phone calls in Japanese",
          "ko": "일본어로 전화하다"
        },
        "gloss": {
          "en": "I can finally make phone calls in Japanese.",
          "ko": "드디어 일본어로 전화할 수 있게 됐어."
        }
      },
      {
        "text": "やっとパンがうまく焼けるようになったよ。",
        "slot": "パンがうまく焼ける",
        "cue": {
          "en": "bake bread well",
          "ko": "빵을 잘 굽다"
        },
        "gloss": {
          "en": "I can finally bake bread properly.",
          "ko": "드디어 빵을 잘 구울 수 있게 됐어."
        }
      },
      {
        "text": "やっと一人で料理が作れるようになったよ。",
        "slot": "一人で料理が作れる",
        "cue": {
          "en": "cook on my own",
          "ko": "혼자 요리하다"
        },
        "gloss": {
          "en": "I can finally cook on my own.",
          "ko": "드디어 혼자 요리할 수 있게 됐어."
        }
      },
      {
        "text": "やっと自転車に乗れるようになったよ。",
        "slot": "自転車に乗れる",
        "cue": {
          "en": "ride a bicycle",
          "ko": "자전거를 타다"
        },
        "gloss": {
          "en": "I can finally ride a bike.",
          "ko": "드디어 자전거를 탈 수 있게 됐어."
        }
      }
    ]
  },
  {
    "id": "ja-f3-11",
    "stage": 3,
    "fn": "cannot",
    "pattern": "ごめん、___なかったんだ。",
    "core": [
      "なかったんだ"
    ],
    "meaning": {
      "en": "Saying what you couldn't do: Sorry, I couldn't ___.",
      "ko": "못 한 일 말하기: 미안, ___ 수 없었어."
    },
    "grammar": [
      4,
      1,
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ごめん、連絡できなかったんだ。",
        "slot": "連絡でき",
        "cue": {
          "en": "get in touch",
          "ko": "연락하다"
        },
        "gloss": {
          "en": "Sorry, I couldn't get in touch.",
          "ko": "미안, 연락을 못 했어."
        }
      },
      {
        "text": "ごめん、朝起きられなかったんだ。",
        "slot": "朝起きられ",
        "cue": {
          "en": "get up in the morning",
          "ko": "아침에 일어나다"
        },
        "gloss": {
          "en": "Sorry, I couldn't get up this morning.",
          "ko": "미안, 아침에 못 일어났어."
        }
      },
      {
        "text": "ごめん、電話に出られなかったんだ。",
        "slot": "電話に出られ",
        "cue": {
          "en": "answer the phone",
          "ko": "전화를 받다"
        },
        "gloss": {
          "en": "Sorry, I couldn't answer the phone.",
          "ko": "미안, 전화를 못 받았어."
        }
      },
      {
        "text": "ごめん、チケットが取れなかったんだ。",
        "slot": "チケットが取れ",
        "cue": {
          "en": "get tickets",
          "ko": "표를 구하다"
        },
        "gloss": {
          "en": "Sorry, I couldn't get the tickets.",
          "ko": "미안, 표를 못 구했어."
        }
      }
    ]
  },
  {
    "id": "ja-f3-12",
    "stage": 3,
    "fn": "agree",
    "pattern": "確かに、___ね。",
    "core": [
      "確かに"
    ],
    "meaning": {
      "en": "Agreeing: True, ___.",
      "ko": "맞장구치기: 확실히 ___네."
    },
    "grammar": [
      7,
      0
    ],
    "expressions": [
      "確かに"
    ],
    "examples": [
      {
        "text": "確かに、ちょっと高いね。",
        "slot": "ちょっと高い",
        "cue": {
          "en": "a bit expensive",
          "ko": "좀 비싸다"
        },
        "gloss": {
          "en": "True, it's a bit expensive.",
          "ko": "확실히 좀 비싸네."
        }
      },
      {
        "text": "確かに、そのほうが便利だね。",
        "slot": "そのほうが便利だ",
        "cue": {
          "en": "that way is more convenient",
          "ko": "그게 더 편하다"
        },
        "gloss": {
          "en": "True, that's more convenient.",
          "ko": "확실히 그게 더 편하네."
        }
      },
      {
        "text": "確かに、今日は寒いね。",
        "slot": "今日は寒い",
        "cue": {
          "en": "it's cold today",
          "ko": "오늘은 춥다"
        },
        "gloss": {
          "en": "True, it's cold today.",
          "ko": "확실히 오늘은 춥네."
        }
      },
      {
        "text": "確かに、駅から遠いね。",
        "slot": "駅から遠い",
        "cue": {
          "en": "far from the station",
          "ko": "역에서 멀다"
        },
        "gloss": {
          "en": "True, it's far from the station.",
          "ko": "확실히 역에서 머네."
        }
      }
    ]
  },
  {
    "id": "ja-f3-13",
    "stage": 3,
    "fn": "clarify",
    "pattern": "___よね？",
    "core": [
      "よね？"
    ],
    "meaning": {
      "en": "Checking something: ___, right?",
      "ko": "확인하기: ___ 맞지?"
    },
    "grammar": [
      7,
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "明日の集合は駅だよね？",
        "slot": "明日の集合は駅だ",
        "cue": {
          "en": "we meet at the station tomorrow",
          "ko": "내일 모이는 곳은 역이다"
        },
        "gloss": {
          "en": "We're meeting at the station tomorrow, right?",
          "ko": "내일 모이는 곳 역 맞지?"
        }
      },
      {
        "text": "会議は三時からだよね？",
        "slot": "会議は三時からだ",
        "cue": {
          "en": "the meeting starts at three",
          "ko": "회의는 세 시부터다"
        },
        "gloss": {
          "en": "The meeting starts at three, right?",
          "ko": "회의 세 시부터 맞지?"
        }
      },
      {
        "text": "チケットはもう買ったよね？",
        "slot": "チケットはもう買った",
        "cue": {
          "en": "already bought the tickets",
          "ko": "표는 벌써 샀다"
        },
        "gloss": {
          "en": "You already bought the tickets, right?",
          "ko": "표는 벌써 샀지?"
        }
      },
      {
        "text": "今日は休みだよね？",
        "slot": "今日は休みだ",
        "cue": {
          "en": "today is a day off",
          "ko": "오늘은 쉬는 날이다"
        },
        "gloss": {
          "en": "Today's a day off, right?",
          "ko": "오늘 쉬는 날 맞지?"
        }
      }
    ]
  },
  {
    "id": "ja-f3-14",
    "stage": 3,
    "fn": "advice-ask",
    "pattern": "どうすれば___ますか。",
    "core": [
      "どうすれば"
    ],
    "meaning": {
      "en": "Asking for advice: What should I do to ___?",
      "ko": "조언 구하기: 어떻게 하면 ___(으)ㄹ 수 있어요?"
    },
    "grammar": [
      2,
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "どうすれば日本語が上手になりますか。",
        "slot": "日本語が上手になり",
        "cue": {
          "en": "get good at Japanese",
          "ko": "일본어를 잘하게 되다"
        },
        "gloss": {
          "en": "How can I get better at Japanese?",
          "ko": "어떻게 하면 일본어를 잘하게 될까요?"
        }
      },
      {
        "text": "どうすれば見やすくなりますか。",
        "slot": "見やすくなり",
        "cue": {
          "en": "become easier to read",
          "ko": "보기 쉬워지다"
        },
        "gloss": {
          "en": "How can I make it easier to read?",
          "ko": "어떻게 하면 보기 쉬워질까요?"
        }
      },
      {
        "text": "どうすれば早く覚えられますか。",
        "slot": "早く覚えられ",
        "cue": {
          "en": "remember quickly",
          "ko": "빨리 외우다"
        },
        "gloss": {
          "en": "How can I memorize things faster?",
          "ko": "어떻게 하면 빨리 외울 수 있어요?"
        }
      },
      {
        "text": "どうすれば空港まで行けますか。",
        "slot": "空港まで行け",
        "cue": {
          "en": "get to the airport",
          "ko": "공항까지 가다"
        },
        "gloss": {
          "en": "How can I get to the airport?",
          "ko": "어떻게 하면 공항까지 갈 수 있어요?"
        }
      }
    ]
  },
  {
    "id": "ja-f3-15",
    "stage": 3,
    "fn": "advice-give",
    "pattern": "___たらいいよ。",
    "core": [
      "たらいいよ"
    ],
    "meaning": {
      "en": "Giving advice: You could ___.",
      "ko": "조언하기: ___(으)면 돼."
    },
    "grammar": [
      2,
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "先生に聞いたらいいよ。",
        "slot": "先生に聞い",
        "cue": {
          "en": "ask the teacher",
          "ko": "선생님께 묻다"
        },
        "gloss": {
          "en": "You could ask the teacher.",
          "ko": "선생님께 물어보면 돼."
        }
      },
      {
        "text": "フロントに電話したらいいよ。",
        "slot": "フロントに電話し",
        "cue": {
          "en": "call the front desk",
          "ko": "프런트에 전화하다"
        },
        "gloss": {
          "en": "You could call the front desk.",
          "ko": "프런트에 전화하면 돼."
        }
      },
      {
        "text": "今日は早めに寝たらいいよ。",
        "slot": "今日は早めに寝",
        "cue": {
          "en": "go to bed early today",
          "ko": "오늘은 일찍 자다"
        },
        "gloss": {
          "en": "You should get to bed early today.",
          "ko": "오늘은 일찍 자면 돼."
        }
      },
      {
        "text": "駅の近くで探したらいいよ。",
        "slot": "駅の近くで探し",
        "cue": {
          "en": "look near the station",
          "ko": "역 근처에서 찾다"
        },
        "gloss": {
          "en": "You could look near the station.",
          "ko": "역 근처에서 찾아보면 돼."
        }
      }
    ]
  },
  {
    "id": "ja-f3-16",
    "stage": 3,
    "fn": "sympathy",
    "pattern": "___なら、仕方ないね。",
    "core": [
      "仕方ない"
    ],
    "meaning": {
      "en": "Showing understanding: If it's ___, it can't be helped.",
      "ko": "이해해 주기: ___(이)면 어쩔 수 없지."
    },
    "grammar": [
      0,
      7
    ],
    "expressions": [
      "仕方ない"
    ],
    "examples": [
      {
        "text": "仕事なら、仕方ないね。",
        "slot": "仕事",
        "cue": {
          "en": "work",
          "ko": "일"
        },
        "gloss": {
          "en": "If it's work, it can't be helped.",
          "ko": "일이면 어쩔 수 없지."
        }
      },
      {
        "text": "雨なら、仕方ないね。",
        "slot": "雨",
        "cue": {
          "en": "rain",
          "ko": "비"
        },
        "gloss": {
          "en": "If it's raining, it can't be helped.",
          "ko": "비가 오면 어쩔 수 없지."
        }
      },
      {
        "text": "熱があるなら、仕方ないね。",
        "slot": "熱がある",
        "cue": {
          "en": "have a fever",
          "ko": "열이 있다"
        },
        "gloss": {
          "en": "If you have a fever, it can't be helped.",
          "ko": "열이 있으면 어쩔 수 없지."
        }
      },
      {
        "text": "電車が止まったなら、仕方ないね。",
        "slot": "電車が止まった",
        "cue": {
          "en": "the train stopped",
          "ko": "전철이 멈췄다"
        },
        "gloss": {
          "en": "If the train stopped, there's nothing you can do.",
          "ko": "전철이 멈췄으면 어쩔 수 없지."
        }
      }
    ]
  },
  {
    "id": "ja-f3-17",
    "stage": 3,
    "fn": "wish",
    "pattern": "せっかくだから、___たいな。",
    "core": [
      "せっかくだから"
    ],
    "meaning": {
      "en": "Saying what you'd like to do while you can: Since we're here, I'd like to ___.",
      "ko": "바람 말하기: 모처럼이니까 ___고 싶다."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "せっかくだから"
    ],
    "examples": [
      {
        "text": "せっかくだから、温泉にも入りたいな。",
        "slot": "温泉にも入り",
        "cue": {
          "en": "go in the hot spring too",
          "ko": "온천에도 들어가다"
        },
        "gloss": {
          "en": "Since we're here, I'd like to try the hot spring too.",
          "ko": "모처럼이니까 온천에도 들어가고 싶다."
        }
      },
      {
        "text": "せっかくだから、地元の料理を食べたいな。",
        "slot": "地元の料理を食べ",
        "cue": {
          "en": "eat the local food",
          "ko": "그 지역 음식을 먹다"
        },
        "gloss": {
          "en": "Since we're here, I'd like to eat the local food.",
          "ko": "모처럼이니까 그 지역 음식을 먹고 싶다."
        }
      },
      {
        "text": "せっかくだから、写真をたくさん撮りたいな。",
        "slot": "写真をたくさん撮り",
        "cue": {
          "en": "take lots of photos",
          "ko": "사진을 많이 찍다"
        },
        "gloss": {
          "en": "Since we're here, I want to take lots of photos.",
          "ko": "모처럼이니까 사진을 많이 찍고 싶다."
        }
      },
      {
        "text": "せっかくだから、もう一日泊まりたいな。",
        "slot": "もう一日泊まり",
        "cue": {
          "en": "stay one more night",
          "ko": "하루 더 묵다"
        },
        "gloss": {
          "en": "Since we're here, I'd like to stay one more night.",
          "ko": "모처럼이니까 하루 더 묵고 싶다."
        }
      }
    ]
  },
  {
    "id": "ja-f3-18",
    "stage": 3,
    "fn": "invite",
    "pattern": "時間があったら、一緒に___よ。",
    "core": [
      "時間があったら"
    ],
    "meaning": {
      "en": "Inviting casually: If you have time, let's ___ together.",
      "ko": "편하게 같이 하자고 하기: 시간 있으면 같이 ___자."
    },
    "grammar": [
      2,
      0,
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "時間があったら、一緒に行こうよ。",
        "slot": "行こう",
        "cue": {
          "en": "go",
          "ko": "가다"
        },
        "gloss": {
          "en": "If you have time, let's go together.",
          "ko": "시간 있으면 같이 가자."
        }
      },
      {
        "text": "時間があったら、一緒にご飯食べようよ。",
        "slot": "ご飯食べよう",
        "cue": {
          "en": "have a meal",
          "ko": "밥을 먹다"
        },
        "gloss": {
          "en": "If you have time, let's grab a meal together.",
          "ko": "시간 있으면 같이 밥 먹자."
        }
      },
      {
        "text": "時間があったら、一緒に映画見ようよ。",
        "slot": "映画見よう",
        "cue": {
          "en": "watch a movie",
          "ko": "영화를 보다"
        },
        "gloss": {
          "en": "If you have time, let's watch a movie together.",
          "ko": "시간 있으면 같이 영화 보자."
        }
      },
      {
        "text": "時間があったら、一緒に練習しようよ。",
        "slot": "練習しよう",
        "cue": {
          "en": "practise",
          "ko": "연습하다"
        },
        "gloss": {
          "en": "If you have time, let's practise together.",
          "ko": "시간 있으면 같이 연습하자."
        }
      }
    ]
  },
  {
    "id": "ja-f3-19",
    "stage": 3,
    "fn": "try-doing",
    "pattern": "とりあえず、___てみます。",
    "core": [
      "てみます"
    ],
    "meaning": {
      "en": "Saying you'll give it a try: For now, I'll try ___.",
      "ko": "해 보겠다고 말하기: 일단 ___아/어 볼게요."
    },
    "grammar": [],
    "expressions": [
      "とりあえず"
    ],
    "examples": [
      {
        "text": "とりあえず、やってみます。",
        "slot": "やっ",
        "cue": {
          "en": "do it",
          "ko": "하다"
        },
        "gloss": {
          "en": "I'll give it a try for now.",
          "ko": "일단 해 볼게요."
        }
      },
      {
        "text": "とりあえず、店の人に聞いてみます。",
        "slot": "店の人に聞い",
        "cue": {
          "en": "ask the shop staff",
          "ko": "가게 직원에게 묻다"
        },
        "gloss": {
          "en": "For now, I'll try asking the shop staff.",
          "ko": "일단 가게 직원에게 물어볼게요."
        }
      },
      {
        "text": "とりあえず、一人で作ってみます。",
        "slot": "一人で作っ",
        "cue": {
          "en": "make it on my own",
          "ko": "혼자 만들다"
        },
        "gloss": {
          "en": "For now, I'll try making it on my own.",
          "ko": "일단 혼자 만들어 볼게요."
        }
      },
      {
        "text": "とりあえず、駅まで行ってみます。",
        "slot": "駅まで行っ",
        "cue": {
          "en": "go to the station",
          "ko": "역까지 가다"
        },
        "gloss": {
          "en": "For now, I'll try going to the station.",
          "ko": "일단 역까지 가 볼게요."
        }
      }
    ]
  },
  {
    "id": "ja-f3-20",
    "stage": 3,
    "fn": "story-past",
    "pattern": "ちょっと聞いてよ！___んだ。",
    "core": [
      "ちょっと聞いてよ"
    ],
    "meaning": {
      "en": "Sharing news: Guess what! ___.",
      "ko": "있었던 일 이야기하기: 있잖아, ___거든!"
    },
    "grammar": [
      1,
      0,
      7
    ],
    "expressions": [
      "ちょっと聞いてよ"
    ],
    "examples": [
      {
        "text": "ちょっと聞いてよ！ライブのチケットが当たったんだ。",
        "slot": "ライブのチケットが当たった",
        "cue": {
          "en": "win concert tickets",
          "ko": "공연 티켓에 당첨되다"
        },
        "gloss": {
          "en": "Guess what! I won concert tickets.",
          "ko": "있잖아, 공연 티켓에 당첨됐거든!"
        }
      },
      {
        "text": "ちょっと聞いてよ！昨日、駅で昔の先生に会ったんだ。",
        "slot": "昨日、駅で昔の先生に会った",
        "cue": {
          "en": "run into my old teacher at the station yesterday",
          "ko": "어제 역에서 옛 선생님을 만나다"
        },
        "gloss": {
          "en": "Guess what! I ran into my old teacher at the station yesterday.",
          "ko": "있잖아, 어제 역에서 옛날 선생님을 만났거든!"
        }
      },
      {
        "text": "ちょっと聞いてよ！財布を落としたんだ。",
        "slot": "財布を落とした",
        "cue": {
          "en": "drop my wallet",
          "ko": "지갑을 떨어뜨리다"
        },
        "gloss": {
          "en": "Listen to this! I lost my wallet.",
          "ko": "있잖아, 지갑을 잃어버렸어!"
        }
      },
      {
        "text": "ちょっと聞いてよ！来月、大阪に引っ越すんだ。",
        "slot": "来月、大阪に引っ越す",
        "cue": {
          "en": "move to Osaka next month",
          "ko": "다음 달에 오사카로 이사하다"
        },
        "gloss": {
          "en": "Guess what! I'm moving to Osaka next month.",
          "ko": "있잖아, 다음 달에 오사카로 이사해!"
        }
      }
    ]
  }
];
