import type { Frame } from "../frames.ts";

/** 일본어 1~5단계 틀(curriculum/frames.ts) — 기능 id(fn)는 curriculum/functions.ts. Claude가 쓰고 다시 고침, 원어민 확인 전. */
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
  },
  {
    "id": "ja-f4-01",
    "stage": 4,
    "fn": "formal-humble",
    "pattern": "___と申します。",
    "core": [
      "と申します"
    ],
    "meaning": {
      "en": "Giving your name humbly: My name is ___.",
      "ko": "겸양으로 이름 대기: ___라고 합니다."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "営業部の田中と申します。",
        "slot": "営業部の田中",
        "cue": {
          "en": "Tanaka from Sales",
          "ko": "영업부의 다나카"
        },
        "gloss": {
          "en": "I'm Tanaka from the sales department.",
          "ko": "영업부의 다나카라고 합니다."
        }
      },
      {
        "text": "本日担当いたします、山口と申します。",
        "slot": "本日担当いたします、山口",
        "cue": {
          "en": "Yamaguchi, in charge today",
          "ko": "오늘 담당하는 야마구치"
        },
        "gloss": {
          "en": "I'm Yamaguchi, and I'll be helping you today.",
          "ko": "오늘 담당할 야마구치라고 합니다."
        }
      },
      {
        "text": "はじめまして、留学生のリーと申します。",
        "slot": "はじめまして、留学生のリー",
        "cue": {
          "en": "Lee, an exchange student",
          "ko": "유학생 리"
        },
        "gloss": {
          "en": "Nice to meet you, I'm Lee, an international student.",
          "ko": "처음 뵙겠습니다, 유학생 리라고 합니다."
        }
      },
      {
        "text": "先日お電話した森と申します。",
        "slot": "先日お電話した森",
        "cue": {
          "en": "Mori, who called the other day",
          "ko": "며칠 전 전화한 모리"
        },
        "gloss": {
          "en": "I'm Mori, who called you the other day.",
          "ko": "며칠 전에 전화드린 모리라고 합니다."
        }
      }
    ]
  },
  {
    "id": "ja-f4-02",
    "stage": 4,
    "fn": "formal-humble",
    "pattern": "___はいらっしゃいますか。",
    "core": [
      "いらっしゃいますか"
    ],
    "meaning": {
      "en": "Asking for someone politely: Is ___ there?",
      "ko": "높여서 사람 찾기: ___ 계십니까?"
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "部長は何時ごろいらっしゃいますか。",
        "slot": "部長は何時ごろ",
        "cue": {
          "en": "the manager, around what time",
          "ko": "부장님, 몇 시쯤"
        },
        "gloss": {
          "en": "Around what time will the manager be in?",
          "ko": "부장님은 몇 시쯤 오십니까?"
        }
      },
      {
        "text": "経理部の佐藤様はいらっしゃいますか。",
        "slot": "経理部の佐藤様は",
        "cue": {
          "en": "Ms. Sato in Accounting",
          "ko": "경리부의 사토 님"
        },
        "gloss": {
          "en": "Is Ms. Sato from Accounting available?",
          "ko": "경리부의 사토 님 계십니까?"
        }
      },
      {
        "text": "先生は今、研究室にいらっしゃいますか。",
        "slot": "先生は今、研究室に",
        "cue": {
          "en": "the professor, in the office now",
          "ko": "교수님, 지금 연구실에"
        },
        "gloss": {
          "en": "Is the professor in the office now?",
          "ko": "교수님은 지금 연구실에 계십니까?"
        }
      },
      {
        "text": "ご家族の方は、どなたかいらっしゃいますか。",
        "slot": "ご家族の方は、どなたか",
        "cue": {
          "en": "anyone from the family",
          "ko": "가족분 중 누군가"
        },
        "gloss": {
          "en": "Is anyone from your family here?",
          "ko": "가족분 중에 누군가 계십니까?"
        }
      }
    ]
  },
  {
    "id": "ja-f4-03",
    "stage": 4,
    "fn": "formal-humble",
    "pattern": "___に伺います。",
    "core": [
      "伺います"
    ],
    "meaning": {
      "en": "Saying you will visit, humbly: I'll come to ___.",
      "ko": "겸양으로 찾아간다고 하기: ___에 찾아뵙겠습니다."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "明日の午後、そちらに伺います。",
        "slot": "明日の午後、そちらに",
        "cue": {
          "en": "your place tomorrow afternoon",
          "ko": "내일 오후 그쪽"
        },
        "gloss": {
          "en": "I'll come to your office tomorrow afternoon.",
          "ko": "내일 오후에 그쪽으로 찾아뵙겠습니다."
        }
      },
      {
        "text": "会議が終わったら、すぐに伺います。",
        "slot": "会議が終わったら、すぐに",
        "cue": {
          "en": "right after the meeting",
          "ko": "회의가 끝나면 바로"
        },
        "gloss": {
          "en": "I'll come over as soon as the meeting ends.",
          "ko": "회의가 끝나면 바로 찾아뵙겠습니다."
        }
      },
      {
        "text": "来週の月曜日に、ご自宅へ伺います。",
        "slot": "来週の月曜日に、ご自宅へ",
        "cue": {
          "en": "your home next Monday",
          "ko": "다음 주 월요일 댁"
        },
        "gloss": {
          "en": "I'll visit your home next Monday.",
          "ko": "다음 주 월요일에 댁으로 찾아뵙겠습니다."
        }
      },
      {
        "text": "では、受付の前で伺います。",
        "slot": "では、受付の前で",
        "cue": {
          "en": "in front of reception",
          "ko": "접수처 앞"
        },
        "gloss": {
          "en": "Then I'll come by the reception desk.",
          "ko": "그럼 접수처 앞으로 찾아뵙겠습니다."
        }
      }
    ]
  },
  {
    "id": "ja-f4-04",
    "stage": 4,
    "fn": "formal-request",
    "pattern": "恐れ入りますが、___。",
    "core": [
      "恐れ入りますが"
    ],
    "meaning": {
      "en": "Making a very polite request: I'm sorry to trouble you, but ___.",
      "ko": "아주 정중하게 부탁하기: 죄송합니다만 ___."
    },
    "grammar": [
      1
    ],
    "expressions": [
      "恐れ入りますが"
    ],
    "examples": [
      {
        "text": "恐れ入りますが、お名前をもう一度伺えますか。",
        "slot": "お名前をもう一度伺えますか",
        "cue": {
          "en": "may I ask your name again",
          "ko": "성함을 한 번 더 여쭤봐도 될까요"
        },
        "gloss": {
          "en": "Excuse me, could I have your name once more?",
          "ko": "죄송합니다만 성함을 한 번 더 여쭤봐도 될까요?"
        }
      },
      {
        "text": "恐れ入りますが、こちらでは写真をご遠慮ください。",
        "slot": "こちらでは写真をご遠慮ください",
        "cue": {
          "en": "please refrain from photos here",
          "ko": "여기서는 사진을 삼가 주세요"
        },
        "gloss": {
          "en": "I'm sorry, but please refrain from taking photos here.",
          "ko": "죄송합니다만 여기서는 사진 촬영을 삼가 주세요."
        }
      },
      {
        "text": "恐れ入りますが、少々声が遠いようです。",
        "slot": "少々声が遠いようです",
        "cue": {
          "en": "your voice is a little faint",
          "ko": "목소리가 조금 멀게 들린다"
        },
        "gloss": {
          "en": "I'm sorry, but your voice sounds a little faint.",
          "ko": "죄송합니다만 목소리가 조금 작게 들립니다."
        }
      },
      {
        "text": "恐れ入りますが、明日までにお返事いただけますか。",
        "slot": "明日までにお返事いただけますか",
        "cue": {
          "en": "could you reply by tomorrow",
          "ko": "내일까지 답을 주실 수 있을까요"
        },
        "gloss": {
          "en": "Sorry to trouble you, but could you reply by tomorrow?",
          "ko": "죄송합니다만 내일까지 답변 주실 수 있을까요?"
        }
      }
    ]
  },
  {
    "id": "ja-f4-05",
    "stage": 4,
    "fn": "formal-humble",
    "pattern": "___させていただきます。",
    "core": [
      "させていただきます"
    ],
    "meaning": {
      "en": "Saying what you'll do, humbly: Allow me to ___.",
      "ko": "삼가 하겠다고 말하기: ___하겠습니다."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "本日はこれで失礼させていただきます。",
        "slot": "本日はこれで失礼",
        "cue": {
          "en": "leave for today",
          "ko": "오늘은 이만 실례하다"
        },
        "gloss": {
          "en": "I'll take my leave for today.",
          "ko": "오늘은 이만 실례하겠습니다."
        }
      },
      {
        "text": "内容を確認させていただきます。",
        "slot": "内容を確認",
        "cue": {
          "en": "check the contents",
          "ko": "내용을 확인하다"
        },
        "gloss": {
          "en": "Allow me to check the contents.",
          "ko": "내용을 확인하겠습니다."
        }
      },
      {
        "text": "最初に私から説明させていただきます。",
        "slot": "最初に私から説明",
        "cue": {
          "en": "explain first",
          "ko": "먼저 설명하다"
        },
        "gloss": {
          "en": "Let me start by explaining.",
          "ko": "먼저 제가 설명드리겠습니다."
        }
      },
      {
        "text": "次の打ち合わせで、改めてご説明させていただきます。",
        "slot": "次の打ち合わせで、改めてご説明",
        "cue": {
          "en": "explain again at the next meeting",
          "ko": "다음 회의에서 다시 설명하다"
        },
        "gloss": {
          "en": "Allow me to explain again at our next meeting.",
          "ko": "다음 회의에서 다시 설명드리겠습니다."
        }
      }
    ]
  },
  {
    "id": "ja-f4-06",
    "stage": 4,
    "fn": "report",
    "pattern": "___ことになりました。",
    "core": [
      "ことになりました"
    ],
    "meaning": {
      "en": "Reporting a decision made for you: It's been decided that ___.",
      "ko": "정해진 일 알리기: ___하게 되었습니다."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "来月から大阪支社で働くことになりました。",
        "slot": "来月から大阪支社で働く",
        "cue": {
          "en": "work at the Osaka branch from next month",
          "ko": "다음 달부터 오사카 지사에서 일하다"
        },
        "gloss": {
          "en": "I'll be working at the Osaka branch from next month.",
          "ko": "다음 달부터 오사카 지사에서 일하게 되었습니다."
        }
      },
      {
        "text": "会議は来週に延期することになりました。",
        "slot": "会議は来週に延期する",
        "cue": {
          "en": "postpone the meeting to next week",
          "ko": "회의를 다음 주로 미루다"
        },
        "gloss": {
          "en": "The meeting has been postponed to next week.",
          "ko": "회의는 다음 주로 연기하게 되었습니다."
        }
      },
      {
        "text": "春から新しいプロジェクトを担当することになりました。",
        "slot": "春から新しいプロジェクトを担当する",
        "cue": {
          "en": "handle a new project from spring",
          "ko": "봄부터 새 프로젝트를 맡다"
        },
        "gloss": {
          "en": "I'll be in charge of a new project from spring.",
          "ko": "봄부터 새 프로젝트를 맡게 되었습니다."
        }
      },
      {
        "text": "工場のトラブルで、納品が遅れることになりました。",
        "slot": "工場のトラブルで、納品が遅れる",
        "cue": {
          "en": "delivery is delayed due to factory trouble",
          "ko": "공장 문제로 납품이 늦어지다"
        },
        "gloss": {
          "en": "Due to trouble at the factory, the delivery will be delayed.",
          "ko": "공장 문제로 납품이 늦어지게 되었습니다."
        }
      }
    ]
  },
  {
    "id": "ja-f4-07",
    "stage": 4,
    "fn": "plan-intent",
    "pattern": "___ことにしました。",
    "core": [
      "ことにしました"
    ],
    "meaning": {
      "en": "Saying what you decided: I've decided to ___.",
      "ko": "내가 정한 것 말하기: ___하기로 했습니다."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "今年は毎朝早く起きることにしました。",
        "slot": "今年は毎朝早く起きる",
        "cue": {
          "en": "get up early every morning this year",
          "ko": "올해는 매일 아침 일찍 일어나다"
        },
        "gloss": {
          "en": "I've decided to get up early every morning this year.",
          "ko": "올해는 매일 아침 일찍 일어나기로 했습니다."
        }
      },
      {
        "text": "よく考えて、転職することにしました。",
        "slot": "よく考えて、転職する",
        "cue": {
          "en": "change jobs after thinking it over",
          "ko": "잘 생각해서 이직하다"
        },
        "gloss": {
          "en": "After thinking it over, I've decided to change jobs.",
          "ko": "잘 생각해 보고 이직하기로 했습니다."
        }
      },
      {
        "text": "週末は家でゆっくり休むことにしました。",
        "slot": "週末は家でゆっくり休む",
        "cue": {
          "en": "rest at home on the weekend",
          "ko": "주말엔 집에서 푹 쉬다"
        },
        "gloss": {
          "en": "I've decided to take it easy at home this weekend.",
          "ko": "주말에는 집에서 푹 쉬기로 했습니다."
        }
      },
      {
        "text": "健康のために、お酒をやめることにしました。",
        "slot": "健康のために、お酒をやめる",
        "cue": {
          "en": "quit drinking for my health",
          "ko": "건강을 위해 술을 끊다"
        },
        "gloss": {
          "en": "I've decided to quit drinking for my health.",
          "ko": "건강을 위해 술을 끊기로 했습니다."
        }
      }
    ]
  },
  {
    "id": "ja-f4-08",
    "stage": 4,
    "fn": "not-necessarily",
    "pattern": "___わけではないのですが、…",
    "core": [
      "わけではない"
    ],
    "meaning": {
      "en": "Softening a stance: It's not that ___, but ….",
      "ko": "입장 누그러뜨리기: ___인 건 아니지만 …."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "反対しているわけではないのですが、もう少し時間がほしいです。",
        "slot": "反対している",
        "cue": {
          "en": "be against it",
          "ko": "반대하다"
        },
        "gloss": {
          "en": "It's not that I'm against it, but I'd like a little more time.",
          "ko": "반대하는 건 아니지만 시간이 조금 더 필요합니다."
        }
      },
      {
        "text": "嫌いなわけではないのですが、辛いものは少し苦手です。",
        "slot": "嫌いな",
        "cue": {
          "en": "dislike",
          "ko": "싫어하다"
        },
        "gloss": {
          "en": "It's not that I dislike it, but I'm not great with spicy food.",
          "ko": "싫어하는 건 아니지만 매운 건 좀 잘 못 먹어요."
        }
      },
      {
        "text": "急いでいるわけではないのですが、いつごろ届きますか。",
        "slot": "急いでいる",
        "cue": {
          "en": "be in a hurry",
          "ko": "서두르다"
        },
        "gloss": {
          "en": "I'm not in a rush, but around when will it arrive?",
          "ko": "급한 건 아니지만 언제쯤 도착하나요?"
        }
      },
      {
        "text": "広ければいいというわけではないので、場所も大事です。",
        "slot": "広ければいいという",
        "cue": {
          "en": "bigger is just better",
          "ko": "넓으면 그만이다"
        },
        "gloss": {
          "en": "Bigger isn't automatically better, so location matters too.",
          "ko": "넓으면 좋은 것만은 아니니까 위치도 중요해요."
        }
      }
    ]
  },
  {
    "id": "ja-f4-09",
    "stage": 4,
    "fn": "the-more",
    "pattern": "___ほど、…",
    "core": [
      "ほど"
    ],
    "meaning": {
      "en": "Saying one thing grows with another: The more ___, the more ___.",
      "ko": "비례해서 말하기: ___할수록 ___."
    },
    "grammar": [
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "考えれば考えるほど、分からなくなります。",
        "slot": "考えれば考える",
        "cue": {
          "en": "think about it",
          "ko": "생각하다"
        },
        "gloss": {
          "en": "The more I think about it, the less I understand.",
          "ko": "생각하면 생각할수록 모르겠어요."
        }
      },
      {
        "text": "駅に近ければ近いほど、家賃は高くなります。",
        "slot": "駅に近ければ近い",
        "cue": {
          "en": "be close to the station",
          "ko": "역에 가깝다"
        },
        "gloss": {
          "en": "The closer to the station, the higher the rent.",
          "ko": "역에 가까우면 가까울수록 집세가 비싸져요."
        }
      },
      {
        "text": "練習すればするほど、上手になりますよ。",
        "slot": "練習すればする",
        "cue": {
          "en": "practice",
          "ko": "연습하다"
        },
        "gloss": {
          "en": "The more you practice, the better you'll get.",
          "ko": "연습하면 할수록 실력이 늘어요."
        }
      },
      {
        "text": "見れば見るほど、どれにするか迷ってしまいます。",
        "slot": "見れば見る",
        "cue": {
          "en": "look at them",
          "ko": "보다"
        },
        "gloss": {
          "en": "The more I look, the harder it is to choose.",
          "ko": "보면 볼수록 뭘 고를지 망설여져요."
        }
      }
    ]
  },
  {
    "id": "ja-f4-10",
    "stage": 4,
    "fn": "negotiate",
    "pattern": "___のはいかがでしょうか。",
    "core": [
      "はいかがでしょうか"
    ],
    "meaning": {
      "en": "Proposing an alternative politely: How about ___?",
      "ko": "정중하게 다른 안 내기: ___하는 건 어떠실까요?"
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "リリースを一週間遅らせるのはいかがでしょうか。",
        "slot": "リリースを一週間遅らせる",
        "cue": {
          "en": "push the release back a week",
          "ko": "출시를 일주일 미루다"
        },
        "gloss": {
          "en": "How about pushing the release back a week?",
          "ko": "출시를 일주일 미루는 건 어떠실까요?"
        }
      },
      {
        "text": "費用を二回に分けてお支払いいただくのはいかがでしょうか。",
        "slot": "費用を二回に分けてお支払いいただく",
        "cue": {
          "en": "pay the cost in two parts",
          "ko": "비용을 두 번에 나눠 내다"
        },
        "gloss": {
          "en": "How about paying the cost in two installments?",
          "ko": "비용을 두 번에 나눠 지불하시는 건 어떠실까요?"
        }
      },
      {
        "text": "打ち合わせをオンラインにするのはいかがでしょうか。",
        "slot": "打ち合わせをオンラインにする",
        "cue": {
          "en": "hold the meeting online",
          "ko": "회의를 온라인으로 하다"
        },
        "gloss": {
          "en": "How about holding the meeting online?",
          "ko": "회의를 온라인으로 하는 건 어떠실까요?"
        }
      },
      {
        "text": "まずは小さい規模で試してみるのはいかがでしょうか。",
        "slot": "まずは小さい規模で試してみる",
        "cue": {
          "en": "try it on a small scale first",
          "ko": "먼저 작은 규모로 해 보다"
        },
        "gloss": {
          "en": "How about trying it on a small scale first?",
          "ko": "우선 작은 규모로 시험해 보는 건 어떠실까요?"
        }
      }
    ]
  },
  {
    "id": "ja-f4-11",
    "stage": 4,
    "fn": "concede",
    "pattern": "おっしゃる通りです。___。",
    "core": [
      "おっしゃる通りです"
    ],
    "meaning": {
      "en": "Conceding then moving on: You're quite right. ___.",
      "ko": "인정하고 넘어가기: 말씀하신 대로입니다. ___."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "おっしゃる通りです"
    ],
    "examples": [
      {
        "text": "おっしゃる通りです。では、別の方法を考えましょう。",
        "slot": "では、別の方法を考えましょう",
        "cue": {
          "en": "let's think of another way",
          "ko": "다른 방법을 생각하자"
        },
        "gloss": {
          "en": "You're quite right. Then let's think of another way.",
          "ko": "말씀하신 대로입니다. 그럼 다른 방법을 생각해 보죠."
        }
      },
      {
        "text": "おっしゃる通りです。私の確認が足りませんでした。",
        "slot": "私の確認が足りませんでした",
        "cue": {
          "en": "I didn't check enough",
          "ko": "제 확인이 부족했다"
        },
        "gloss": {
          "en": "You're right. I didn't check carefully enough.",
          "ko": "말씀하신 대로입니다. 제 확인이 부족했습니다."
        }
      },
      {
        "text": "おっしゃる通りです。ただ、予算にも限りがありまして。",
        "slot": "ただ、予算にも限りがありまして",
        "cue": {
          "en": "but the budget is limited",
          "ko": "다만 예산에도 한계가 있다"
        },
        "gloss": {
          "en": "You're right. That said, our budget is limited.",
          "ko": "말씀하신 대로입니다. 다만 예산에도 한계가 있어서요."
        }
      },
      {
        "text": "おっしゃる通りです。すぐに資料を直します。",
        "slot": "すぐに資料を直します",
        "cue": {
          "en": "fix the materials right away",
          "ko": "바로 자료를 고치다"
        },
        "gloss": {
          "en": "You're absolutely right. I'll fix the materials right away.",
          "ko": "말씀하신 대로입니다. 바로 자료를 고치겠습니다."
        }
      }
    ]
  },
  {
    "id": "ja-f4-12",
    "stage": 4,
    "fn": "formal-request",
    "pattern": "___させてください。",
    "core": [
      "させてください"
    ],
    "meaning": {
      "en": "Asking to be allowed to do something: Please let me ___.",
      "ko": "하게 해 달라고 하기: 제가 ___하게 해 주세요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "その件は私に担当させてください。",
        "slot": "その件は私に担当",
        "cue": {
          "en": "handle that matter",
          "ko": "그 건을 맡다"
        },
        "gloss": {
          "en": "Please let me handle that matter.",
          "ko": "그 건은 제가 맡게 해 주세요."
        }
      },
      {
        "text": "少し考えさせてください。",
        "slot": "少し考え",
        "cue": {
          "en": "think it over a little",
          "ko": "조금 생각하다"
        },
        "gloss": {
          "en": "Please let me think about it a little.",
          "ko": "조금 생각하게 해 주세요."
        }
      },
      {
        "text": "一度、上司に相談させてください。",
        "slot": "一度、上司に相談",
        "cue": {
          "en": "consult my boss once",
          "ko": "상사와 한 번 상의하다"
        },
        "gloss": {
          "en": "Please let me talk it over with my boss first.",
          "ko": "한 번 상사와 상의하게 해 주세요."
        }
      },
      {
        "text": "次の発表は、ぜひ私にさせてください。",
        "slot": "次の発表は、ぜひ私に",
        "cue": {
          "en": "me, for the next presentation",
          "ko": "다음 발표는 꼭 저에게"
        },
        "gloss": {
          "en": "Please let me do the next presentation.",
          "ko": "다음 발표는 꼭 제가 하게 해 주세요."
        }
      }
    ]
  },
  {
    "id": "ja-f4-13",
    "stage": 4,
    "fn": "complain",
    "pattern": "___て、困っているんです。",
    "core": [
      "困っているんです"
    ],
    "meaning": {
      "en": "Complaining about being troubled by something: I've been ___ and it's a problem.",
      "ko": "당해서 곤란하다고 하기: ___해서 곤란해요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "隣の人に夜遅くまで騒がれて、困っているんです。",
        "slot": "隣の人に夜遅くまで騒がれ",
        "cue": {
          "en": "neighbors are noisy late at night",
          "ko": "옆집 사람이 밤늦게까지 떠들다"
        },
        "gloss": {
          "en": "My neighbors make noise late into the night, and it's a real problem.",
          "ko": "옆집 사람이 밤늦게까지 떠들어서 곤란해요."
        }
      },
      {
        "text": "先輩に仕事を全部押しつけられて、困っているんです。",
        "slot": "先輩に仕事を全部押しつけられ",
        "cue": {
          "en": "a senior dumps all the work on me",
          "ko": "선배가 일을 전부 떠넘기다"
        },
        "gloss": {
          "en": "My senior keeps dumping all the work on me, and I'm stuck.",
          "ko": "선배가 일을 전부 떠넘겨서 곤란해요."
        }
      },
      {
        "text": "駅で傘を盗まれて、困っているんです。",
        "slot": "駅で傘を盗まれ",
        "cue": {
          "en": "someone steals my umbrella at the station",
          "ko": "역에서 우산을 도둑맞다"
        },
        "gloss": {
          "en": "My umbrella was stolen at the station, and now I'm stuck.",
          "ko": "역에서 우산을 도둑맞아서 곤란해요."
        }
      },
      {
        "text": "猫に夜中に起こされて、困っているんです。",
        "slot": "猫に夜中に起こされ",
        "cue": {
          "en": "the cat wakes me at night",
          "ko": "고양이가 한밤중에 깨우다"
        },
        "gloss": {
          "en": "My cat keeps waking me up at night, and it's a problem.",
          "ko": "고양이가 한밤중에 깨워서 곤란해요."
        }
      }
    ]
  },
  {
    "id": "ja-f4-14",
    "stage": 4,
    "fn": "apologize",
    "pattern": "___、ご迷惑をおかけしました。",
    "core": [
      "ご迷惑をおかけし"
    ],
    "meaning": {
      "en": "Apologizing formally for trouble: ___, and I'm sorry for the trouble.",
      "ko": "정식으로 사과하기: ___, 폐를 끼쳤습니다."
    },
    "grammar": [
      1
    ],
    "expressions": [
      "ご迷惑をおかけしました"
    ],
    "examples": [
      {
        "text": "昨日は会議に遅れてしまい、ご迷惑をおかけしました。",
        "slot": "昨日は会議に遅れてしまい",
        "cue": {
          "en": "I was late to the meeting yesterday",
          "ko": "어제 회의에 늦다"
        },
        "gloss": {
          "en": "I'm sorry for the trouble I caused by being late to yesterday's meeting.",
          "ko": "어제는 회의에 늦어서 폐를 끼쳤습니다."
        }
      },
      {
        "text": "私の確認ミスで、ご迷惑をおかけしました。",
        "slot": "私の確認ミスで",
        "cue": {
          "en": "my checking mistake",
          "ko": "제 확인 실수로"
        },
        "gloss": {
          "en": "I'm sorry for the trouble caused by my oversight.",
          "ko": "제 확인 실수로 폐를 끼쳤습니다."
        }
      },
      {
        "text": "返信が遅くなり、ご迷惑をおかけしました。",
        "slot": "返信が遅くなり",
        "cue": {
          "en": "my reply was late",
          "ko": "답장이 늦어지다"
        },
        "gloss": {
          "en": "I apologize for the inconvenience of my late reply.",
          "ko": "답장이 늦어져 폐를 끼쳤습니다."
        }
      },
      {
        "text": "このたびは配送の手違いで、ご迷惑をおかけして申し訳ございません。",
        "slot": "このたびは配送の手違いで",
        "cue": {
          "en": "a delivery mix-up this time",
          "ko": "이번 배송 착오로"
        },
        "gloss": {
          "en": "We're very sorry for the trouble caused by the delivery mix-up.",
          "ko": "이번에 배송 착오로 폐를 끼쳐 죄송합니다."
        }
      }
    ]
  },
  {
    "id": "ja-f4-15",
    "stage": 4,
    "fn": "formal-request",
    "pattern": "お手数ですが、___ください。",
    "core": [
      "お手数ですが"
    ],
    "meaning": {
      "en": "Asking someone to take the trouble: Sorry for the trouble, but please ___.",
      "ko": "수고를 부탁하기: 번거로우시겠지만 ___해 주세요."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "お手数ですが"
    ],
    "examples": [
      {
        "text": "お手数ですが、こちらの用紙にご記入ください。",
        "slot": "こちらの用紙にご記入",
        "cue": {
          "en": "fill in this form",
          "ko": "이 용지에 기입하다"
        },
        "gloss": {
          "en": "Sorry for the trouble, but please fill in this form.",
          "ko": "번거로우시겠지만 이 용지에 기입해 주세요."
        }
      },
      {
        "text": "お手数ですが、もう一度お送りください。",
        "slot": "もう一度お送り",
        "cue": {
          "en": "send it again",
          "ko": "한 번 더 보내다"
        },
        "gloss": {
          "en": "Sorry to trouble you, but please send it again.",
          "ko": "번거로우시겠지만 한 번 더 보내 주세요."
        }
      },
      {
        "text": "お手数ですが、受付で番号札をお取りください。",
        "slot": "受付で番号札をお取り",
        "cue": {
          "en": "take a number ticket at reception",
          "ko": "접수처에서 번호표를 뽑다"
        },
        "gloss": {
          "en": "Sorry for the trouble, but please take a number at reception.",
          "ko": "번거로우시겠지만 접수처에서 번호표를 뽑아 주세요."
        }
      },
      {
        "text": "お手数ですが、ご都合のいい日をお知らせください。",
        "slot": "ご都合のいい日をお知らせ",
        "cue": {
          "en": "let me know a convenient day",
          "ko": "편하신 날을 알려 주다"
        },
        "gloss": {
          "en": "Sorry for the trouble, but please let me know which day suits you.",
          "ko": "번거로우시겠지만 편하신 날을 알려 주세요."
        }
      }
    ]
  },
  {
    "id": "ja-f4-16",
    "stage": 4,
    "fn": "clarify",
    "pattern": "とおっしゃいますと、___でしょうか。",
    "core": [
      "とおっしゃいますと"
    ],
    "meaning": {
      "en": "Asking what someone means, politely: By that, do you mean ___?",
      "ko": "정중하게 뜻 확인하기: 말씀하시는 건 ___라는 뜻일까요?"
    },
    "grammar": [
      0
    ],
    "expressions": [
      "とおっしゃいますと"
    ],
    "examples": [
      {
        "text": "とおっしゃいますと、費用の面でしょうか。",
        "slot": "費用の面",
        "cue": {
          "en": "the cost side",
          "ko": "비용 면"
        },
        "gloss": {
          "en": "By that, do you mean in terms of cost?",
          "ko": "말씀하시는 건 비용 면일까요?"
        }
      },
      {
        "text": "とおっしゃいますと、日程を変えるということでしょうか。",
        "slot": "日程を変えるということ",
        "cue": {
          "en": "changing the schedule",
          "ko": "일정을 바꾸다"
        },
        "gloss": {
          "en": "Do you mean changing the schedule?",
          "ko": "말씀하시는 건 일정을 바꾼다는 뜻일까요?"
        }
      },
      {
        "text": "とおっしゃいますと、どの部分が問題でしょうか。",
        "slot": "どの部分が問題",
        "cue": {
          "en": "which part is the problem",
          "ko": "어느 부분이 문제"
        },
        "gloss": {
          "en": "Then which part, exactly, is the problem?",
          "ko": "말씀하시는 건 어느 부분이 문제라는 걸까요?"
        }
      },
      {
        "text": "とおっしゃいますと、今回は見送りということでしょうか。",
        "slot": "今回は見送りということ",
        "cue": {
          "en": "passing this time",
          "ko": "이번엔 보류"
        },
        "gloss": {
          "en": "So you mean you'll pass on it this time?",
          "ko": "말씀하시는 건 이번엔 보류라는 뜻일까요?"
        }
      }
    ]
  },
  {
    "id": "ja-f4-17",
    "stage": 4,
    "fn": "formal-humble",
    "pattern": "念のため伺いますが、___でしょうか。",
    "core": [
      "念のため"
    ],
    "meaning": {
      "en": "Checking just to be sure: Just to be sure, may I ask if ___?",
      "ko": "확실히 하려고 묻기: 혹시 몰라 여쭤봅니다만 ___일까요?"
    },
    "grammar": [
      1
    ],
    "expressions": [
      "念のため"
    ],
    "examples": [
      {
        "text": "念のため伺いますが、楽器の演奏は可能でしょうか。",
        "slot": "楽器の演奏は可能",
        "cue": {
          "en": "playing instruments is allowed",
          "ko": "악기 연주가 가능하다"
        },
        "gloss": {
          "en": "Just to be sure, may I ask if playing instruments is allowed?",
          "ko": "혹시 몰라 여쭤봅니다만 악기 연주는 가능할까요?"
        }
      },
      {
        "text": "念のため伺いますが、駐車場はございますでしょうか。",
        "slot": "駐車場はございます",
        "cue": {
          "en": "there is a parking lot",
          "ko": "주차장이 있다"
        },
        "gloss": {
          "en": "Just to check, is there parking?",
          "ko": "혹시 몰라 여쭤봅니다만 주차장이 있을까요?"
        }
      },
      {
        "text": "念のため伺いますが、締め切りは金曜日でよろしいでしょうか。",
        "slot": "締め切りは金曜日でよろしい",
        "cue": {
          "en": "the deadline is Friday",
          "ko": "마감이 금요일이다"
        },
        "gloss": {
          "en": "Just to confirm, the deadline is Friday, correct?",
          "ko": "혹시 몰라 여쭤봅니다만 마감은 금요일이 맞을까요?"
        }
      },
      {
        "text": "念のため伺いますが、ペットを飼っても問題ないでしょうか。",
        "slot": "ペットを飼っても問題ない",
        "cue": {
          "en": "keeping a pet is fine",
          "ko": "반려동물을 길러도 된다"
        },
        "gloss": {
          "en": "Just to be sure, is it all right to keep a pet?",
          "ko": "혹시 몰라 여쭤봅니다만 반려동물을 길러도 괜찮을까요?"
        }
      }
    ]
  },
  {
    "id": "ja-f4-18",
    "stage": 4,
    "fn": "deadline",
    "pattern": "___、後ほどご連絡いたします。",
    "core": [
      "後ほどご連絡"
    ],
    "meaning": {
      "en": "Promising to get back to someone: ___, and I'll contact you later.",
      "ko": "나중에 연락하겠다고 하기: ___, 나중에 연락드리겠습니다."
    },
    "grammar": [
      1
    ],
    "expressions": [
      "後ほどご連絡します"
    ],
    "examples": [
      {
        "text": "本日中に確認いたしまして、後ほどご連絡いたします。",
        "slot": "本日中に確認いたしまして",
        "cue": {
          "en": "check it today",
          "ko": "오늘 중으로 확인하다"
        },
        "gloss": {
          "en": "I'll check it today and get back to you later.",
          "ko": "오늘 중으로 확인해서 나중에 연락드리겠습니다."
        }
      },
      {
        "text": "担当者が戻りましたら、後ほどご連絡いたします。",
        "slot": "担当者が戻りましたら",
        "cue": {
          "en": "when the person in charge returns",
          "ko": "담당자가 돌아오면"
        },
        "gloss": {
          "en": "When the person in charge returns, we'll contact you.",
          "ko": "담당자가 돌아오면 나중에 연락드리겠습니다."
        }
      },
      {
        "text": "在庫を調べまして、後ほどご連絡いたします。",
        "slot": "在庫を調べまして",
        "cue": {
          "en": "look into the stock",
          "ko": "재고를 알아보다"
        },
        "gloss": {
          "en": "I'll check our stock and get back to you.",
          "ko": "재고를 알아보고 나중에 연락드리겠습니다."
        }
      },
      {
        "text": "詳しい日程が決まり次第、後ほどご連絡いたします。",
        "slot": "詳しい日程が決まり次第",
        "cue": {
          "en": "as soon as the details are set",
          "ko": "자세한 일정이 정해지는 대로"
        },
        "gloss": {
          "en": "I'll contact you as soon as the details are decided.",
          "ko": "자세한 일정이 정해지는 대로 나중에 연락드리겠습니다."
        }
      }
    ]
  },
  {
    "id": "ja-f4-19",
    "stage": 4,
    "fn": "formal-request",
    "pattern": "差し支えなければ、___てもよろしいでしょうか。",
    "core": [
      "差し支えなければ"
    ],
    "meaning": {
      "en": "Asking carefully for permission: If you don't mind, may I ___?",
      "ko": "조심스럽게 허락 구하기: 괜찮으시다면 ___해도 될까요?"
    },
    "grammar": [
      1
    ],
    "expressions": [
      "差し支えなければ"
    ],
    "examples": [
      {
        "text": "差し支えなければ、ご用件を伺ってもよろしいでしょうか。",
        "slot": "ご用件を伺っ",
        "cue": {
          "en": "ask what it's about",
          "ko": "용건을 여쭙다"
        },
        "gloss": {
          "en": "If you don't mind, may I ask what it's regarding?",
          "ko": "괜찮으시다면 용건을 여쭤봐도 될까요?"
        }
      },
      {
        "text": "差し支えなければ、お電話番号を教えていただけますか。",
        "slot": "お電話番号を教えていただけますか",
        "cue": {
          "en": "tell me your phone number",
          "ko": "전화번호를 알려 주다"
        },
        "gloss": {
          "en": "If you don't mind, could you give me your phone number?",
          "ko": "괜찮으시다면 전화번호를 알려 주시겠습니까?"
        }
      },
      {
        "text": "差し支えなければ、理由をお聞きしてもよろしいでしょうか。",
        "slot": "理由をお聞きし",
        "cue": {
          "en": "ask the reason",
          "ko": "이유를 여쭙다"
        },
        "gloss": {
          "en": "If you don't mind, may I ask the reason?",
          "ko": "괜찮으시다면 이유를 여쭤봐도 될까요?"
        }
      },
      {
        "text": "差し支えなければ、こちらの資料をお借りしてもよろしいでしょうか。",
        "slot": "こちらの資料をお借りし",
        "cue": {
          "en": "borrow these documents",
          "ko": "이 자료를 빌리다"
        },
        "gloss": {
          "en": "If it's all right, may I borrow these documents?",
          "ko": "괜찮으시다면 이 자료를 빌려도 될까요?"
        }
      }
    ]
  },
  {
    "id": "ja-f4-20",
    "stage": 4,
    "fn": "report",
    "pattern": "___確認してまいります。",
    "core": [
      "確認してまいります"
    ],
    "meaning": {
      "en": "Saying you'll go and check, humbly: I'll go and check ___.",
      "ko": "겸양으로 확인하러 간다고 하기: ___ 확인하고 오겠습니다."
    },
    "grammar": [
      1
    ],
    "expressions": [
      "確認してまいります"
    ],
    "examples": [
      {
        "text": "在庫があるかどうか、確認してまいります。",
        "slot": "在庫があるかどうか、",
        "cue": {
          "en": "whether it's in stock",
          "ko": "재고가 있는지"
        },
        "gloss": {
          "en": "I'll go and check whether we have it in stock.",
          "ko": "재고가 있는지 확인하고 오겠습니다."
        }
      },
      {
        "text": "担当者に確認してまいります。",
        "slot": "担当者に",
        "cue": {
          "en": "with the person in charge",
          "ko": "담당자에게"
        },
        "gloss": {
          "en": "I'll go and check with the person in charge.",
          "ko": "담당자에게 확인하고 오겠습니다."
        }
      },
      {
        "text": "少々お待ちください、席が空いているか確認してまいります。",
        "slot": "少々お待ちください、席が空いているか",
        "cue": {
          "en": "whether a seat is free",
          "ko": "자리가 비었는지"
        },
        "gloss": {
          "en": "One moment please, I'll check whether a table is free.",
          "ko": "잠시만 기다려 주세요, 자리가 비었는지 확인하고 오겠습니다."
        }
      },
      {
        "text": "半分だけでも先に送れるよう、工場に確認してまいります。",
        "slot": "半分だけでも先に送れるよう、工場に",
        "cue": {
          "en": "with the factory about sending half first",
          "ko": "절반이라도 먼저 보낼 수 있게 공장에"
        },
        "gloss": {
          "en": "I'll check with the factory so we can send at least half first.",
          "ko": "절반이라도 먼저 보낼 수 있도록 공장에 확인하고 오겠습니다."
        }
      }
    ]
  },
  {
    "id": "ja-f5-01",
    "stage": 5,
    "fn": "tact-refuse",
    "pattern": "___わけにはいかない。",
    "core": [
      "わけにはいかない"
    ],
    "meaning": {
      "en": "Saying you can't very well do something: I can't very well ___.",
      "ko": "사정상 못 한다고 하기: ___할 수는 없다."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "せっかく誘ってもらったのに、断るわけにはいかないよ。",
        "slot": "せっかく誘ってもらったのに、断る",
        "cue": {
          "en": "turn it down after being invited",
          "ko": "모처럼 초대받았는데 거절하다"
        },
        "gloss": {
          "en": "They went out of their way to invite me, so I can't very well say no.",
          "ko": "모처럼 초대받았는데 거절할 수는 없지."
        }
      },
      {
        "text": "明日は大事な会議だから、休むわけにはいかない。",
        "slot": "明日は大事な会議だから、休む",
        "cue": {
          "en": "take the day off before a big meeting",
          "ko": "중요한 회의라 쉬다"
        },
        "gloss": {
          "en": "There's an important meeting tomorrow, so I can't take the day off.",
          "ko": "내일은 중요한 회의라 쉴 수는 없어."
        }
      },
      {
        "text": "お客さんの前で、笑うわけにはいかないですよね。",
        "slot": "お客さんの前で、笑う",
        "cue": {
          "en": "laugh in front of customers",
          "ko": "손님 앞에서 웃다"
        },
        "gloss": {
          "en": "I can't very well laugh in front of a customer, can I?",
          "ko": "손님 앞에서 웃을 수는 없잖아요."
        }
      },
      {
        "text": "親の法事だから、行かないわけにはいかないんです。",
        "slot": "親の法事だから、行かない",
        "cue": {
          "en": "not go to a parent's memorial",
          "ko": "부모님 제사에 안 가다"
        },
        "gloss": {
          "en": "It's my parent's memorial service, so I can't not go.",
          "ko": "부모님 제사니까 안 갈 수는 없어요."
        }
      }
    ]
  },
  {
    "id": "ja-f5-02",
    "stage": 5,
    "fn": "concession",
    "pattern": "___ざるを得ない。",
    "core": [
      "ざるを得ない"
    ],
    "meaning": {
      "en": "Saying you have no choice: I have no choice but to ___.",
      "ko": "어쩔 수 없다고 하기: ___하지 않을 수 없다."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "予算が足りない以上、計画を見直さざるを得ない。",
        "slot": "予算が足りない以上、計画を見直さ",
        "cue": {
          "en": "review the plan",
          "ko": "계획을 재검토하다"
        },
        "gloss": {
          "en": "Since the budget is short, we have no choice but to review the plan.",
          "ko": "예산이 부족한 이상 계획을 재검토하지 않을 수 없다."
        }
      },
      {
        "text": "雨がこれだけ強いと、試合は中止せざるを得ないね。",
        "slot": "雨がこれだけ強いと、試合は中止せ",
        "cue": {
          "en": "call off the game",
          "ko": "경기를 취소하다"
        },
        "gloss": {
          "en": "With rain this heavy, they'll have to call off the game.",
          "ko": "비가 이렇게 세면 경기는 취소하지 않을 수 없겠네."
        }
      },
      {
        "text": "部長に頼まれたら、引き受けざるを得ないでしょう。",
        "slot": "部長に頼まれたら、引き受け",
        "cue": {
          "en": "take it on",
          "ko": "맡다"
        },
        "gloss": {
          "en": "If the manager asks, you'd have no choice but to take it on.",
          "ko": "부장님이 부탁하면 맡지 않을 수 없겠죠."
        }
      },
      {
        "text": "ここまで証拠があると、認めざるを得ないな。",
        "slot": "ここまで証拠があると、認め",
        "cue": {
          "en": "admit it",
          "ko": "인정하다"
        },
        "gloss": {
          "en": "With this much evidence, I have to admit it.",
          "ko": "증거가 이 정도면 인정하지 않을 수 없네."
        }
      }
    ]
  },
  {
    "id": "ja-f5-03",
    "stage": 5,
    "fn": "concession",
    "pattern": "___とはいえ、…",
    "core": [
      "とはいえ"
    ],
    "meaning": {
      "en": "Granting a point then qualifying it: Even though ___, ….",
      "ko": "인정하고 단서 달기: ___라고는 해도 …."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "春とはいえ、朝晩はまだ冷えますね。",
        "slot": "春",
        "cue": {
          "en": "it's spring",
          "ko": "봄이다"
        },
        "gloss": {
          "en": "It may be spring, but mornings and evenings are still cold.",
          "ko": "봄이라고는 해도 아침저녁은 아직 쌀쌀하네요."
        }
      },
      {
        "text": "休みが増えるとはいえ、一日の勤務は長くなるらしいよ。",
        "slot": "休みが増える",
        "cue": {
          "en": "have more days off",
          "ko": "휴일이 늘다"
        },
        "gloss": {
          "en": "We may get more days off, but apparently each workday gets longer.",
          "ko": "휴일이 는다고는 해도 하루 근무는 길어진대."
        }
      },
      {
        "text": "慣れた仕事とはいえ、油断は禁物です。",
        "slot": "慣れた仕事",
        "cue": {
          "en": "a job I'm used to",
          "ko": "익숙한 일"
        },
        "gloss": {
          "en": "Even if it's work I'm used to, I can't let my guard down.",
          "ko": "익숙한 일이라고는 해도 방심은 금물입니다."
        }
      },
      {
        "text": "制度ができたとはいえ、使いやすい雰囲気かは別の話だよね。",
        "slot": "制度ができた",
        "cue": {
          "en": "the system was set up",
          "ko": "제도가 생기다"
        },
        "gloss": {
          "en": "The system may exist now, but whether people feel free to use it is another story.",
          "ko": "제도가 생겼다고는 해도 쓰기 편한 분위기인지는 다른 얘기지."
        }
      }
    ]
  },
  {
    "id": "ja-f5-04",
    "stage": 5,
    "fn": "nuance-soften",
    "pattern": "___かねない。",
    "core": [
      "かねない",
      "かねません"
    ],
    "meaning": {
      "en": "Warning of a bad outcome: That could well ___.",
      "ko": "나쁜 결과 우려하기: ___할 수도 있다."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "そんな言い方をしたら、誤解されかねないよ。",
        "slot": "そんな言い方をしたら、誤解され",
        "cue": {
          "en": "be misunderstood",
          "ko": "오해받다"
        },
        "gloss": {
          "en": "If you put it that way, you could well be misunderstood.",
          "ko": "그런 식으로 말하면 오해받을 수도 있어."
        }
      },
      {
        "text": "このまま無理を続けると、体を壊しかねません。",
        "slot": "このまま無理を続けると、体を壊し",
        "cue": {
          "en": "ruin your health",
          "ko": "몸을 해치다"
        },
        "gloss": {
          "en": "If you keep pushing yourself like this, you could ruin your health.",
          "ko": "이대로 무리를 계속하면 몸을 상할 수도 있습니다."
        }
      },
      {
        "text": "確認しないで送ると、大きなミスになりかねない。",
        "slot": "確認しないで送ると、大きなミスになり",
        "cue": {
          "en": "become a big mistake",
          "ko": "큰 실수가 되다"
        },
        "gloss": {
          "en": "Sending it without checking could turn into a big mistake.",
          "ko": "확인하지 않고 보내면 큰 실수가 될 수도 있다."
        }
      },
      {
        "text": "バスをなくしたら、病院に行けない人が出かねないと思う。",
        "slot": "バスをなくしたら、病院に行けない人が出",
        "cue": {
          "en": "some people can't get to hospital",
          "ko": "병원에 못 가는 사람이 생기다"
        },
        "gloss": {
          "en": "If they cut the buses, some people might not be able to get to the hospital.",
          "ko": "버스를 없애면 병원에 못 가는 사람이 생길 수도 있다고 생각해."
        }
      }
    ]
  },
  {
    "id": "ja-f5-05",
    "stage": 5,
    "fn": "concession",
    "pattern": "___ものの、…",
    "core": [
      "ものの"
    ],
    "meaning": {
      "en": "Admitting a fact with a catch: Although ___, ….",
      "ko": "사실을 인정하며 반전: ___하긴 했지만 …."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "引き受けたものの、正直自信がない。",
        "slot": "引き受けた",
        "cue": {
          "en": "have accepted the job",
          "ko": "맡았다"
        },
        "gloss": {
          "en": "I said yes, but honestly I'm not confident.",
          "ko": "맡긴 했지만 솔직히 자신이 없다."
        }
      },
      {
        "text": "転職したものの、まだ前の会社のやり方が抜けない。",
        "slot": "転職した",
        "cue": {
          "en": "have changed jobs",
          "ko": "이직했다"
        },
        "gloss": {
          "en": "I've changed jobs, but I still do things the old company's way.",
          "ko": "이직은 했지만 아직 전 회사 방식이 안 빠진다."
        }
      },
      {
        "text": "聞こうとは思うものの、みんな忙しそうで声をかけにくい。",
        "slot": "聞こうとは思う",
        "cue": {
          "en": "mean to ask",
          "ko": "물어보려고는 생각하다"
        },
        "gloss": {
          "en": "I mean to ask, but everyone looks busy so it's hard to approach them.",
          "ko": "물어보려고는 하지만 다들 바빠 보여서 말 걸기가 어렵다."
        }
      },
      {
        "text": "チケットは買ったものの、当日行けるか分からない。",
        "slot": "チケットは買った",
        "cue": {
          "en": "have bought the ticket",
          "ko": "표는 샀다"
        },
        "gloss": {
          "en": "I bought the ticket, but I don't know if I can go on the day.",
          "ko": "표는 샀지만 당일에 갈 수 있을지 모르겠다."
        }
      }
    ]
  },
  {
    "id": "ja-f5-06",
    "stage": 5,
    "fn": "persuade",
    "pattern": "___からこそ、…",
    "core": [
      "からこそ"
    ],
    "meaning": {
      "en": "Stressing the real reason: It's precisely because ___ that ….",
      "ko": "진짜 이유 강조하기: ___이기 때문에야말로 …."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "大切な友だちだからこそ、本当のことを言いたい。",
        "slot": "大切な友だちだ",
        "cue": {
          "en": "you are a dear friend",
          "ko": "소중한 친구다"
        },
        "gloss": {
          "en": "Precisely because you're a dear friend, I want to tell you the truth.",
          "ko": "소중한 친구이기 때문에 더욱 사실을 말하고 싶어."
        }
      },
      {
        "text": "賛否が分かれるからこそ、みんな語りたくなるんだよね。",
        "slot": "賛否が分かれる",
        "cue": {
          "en": "opinions are split",
          "ko": "찬반이 갈리다"
        },
        "gloss": {
          "en": "It's exactly because opinions are split that everyone wants to talk about it.",
          "ko": "찬반이 갈리니까 더욱 다들 이야기하고 싶어지는 거지."
        }
      },
      {
        "text": "忙しいからこそ、休みをきちんと取るべきだよ。",
        "slot": "忙しい",
        "cue": {
          "en": "be busy",
          "ko": "바쁘다"
        },
        "gloss": {
          "en": "It's precisely because you're busy that you should take proper breaks.",
          "ko": "바쁘니까 더욱 휴식을 제대로 챙겨야 해."
        }
      },
      {
        "text": "失敗したからこそ、学べたこともある。",
        "slot": "失敗した",
        "cue": {
          "en": "have failed",
          "ko": "실패했다"
        },
        "gloss": {
          "en": "There are things I could learn precisely because I failed.",
          "ko": "실패했기 때문에 배울 수 있었던 것도 있다."
        }
      }
    ]
  },
  {
    "id": "ja-f5-07",
    "stage": 5,
    "fn": "best-to",
    "pattern": "___に越したことはない。",
    "core": [
      "に越したことはない"
    ],
    "meaning": {
      "en": "Saying something is best: Nothing beats ___.",
      "ko": "그게 제일이라고 하기: ___하는 게 제일 낫다."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "準備は早いに越したことはない。",
        "slot": "準備は早い",
        "cue": {
          "en": "prepare early",
          "ko": "준비가 이르다"
        },
        "gloss": {
          "en": "When it comes to preparing, the earlier the better.",
          "ko": "준비는 빠를수록 좋다."
        }
      },
      {
        "text": "何も起きないに越したことはないけど、保険は入っておこう。",
        "slot": "何も起きない",
        "cue": {
          "en": "nothing happens",
          "ko": "아무 일도 없다"
        },
        "gloss": {
          "en": "Best if nothing happens, but let's get insurance anyway.",
          "ko": "아무 일도 없는 게 제일이지만 보험은 들어 두자."
        }
      },
      {
        "text": "お金は少しでも替えておくに越したことはないよ。",
        "slot": "お金は少しでも替えておく",
        "cue": {
          "en": "exchange a little money in advance",
          "ko": "돈을 조금이라도 환전해 두다"
        },
        "gloss": {
          "en": "It's best to exchange at least a little money beforehand.",
          "ko": "돈은 조금이라도 환전해 두는 게 제일 나아."
        }
      },
      {
        "text": "体のためには、よく寝るに越したことはないですね。",
        "slot": "体のためには、よく寝る",
        "cue": {
          "en": "sleep well",
          "ko": "잘 자다"
        },
        "gloss": {
          "en": "For your health, nothing beats a good night's sleep.",
          "ko": "몸을 위해서는 잘 자는 게 제일이네요."
        }
      }
    ]
  },
  {
    "id": "ja-f5-08",
    "stage": 5,
    "fn": "debate",
    "pattern": "___ないことには、…",
    "core": [
      "ないことには"
    ],
    "meaning": {
      "en": "Stating a must-have condition: Unless ___, ….",
      "ko": "필수 조건 말하기: ___하지 않고서는 …."
    },
    "grammar": [
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "実際に会ってみないことには、何とも言えない。",
        "slot": "実際に会ってみ",
        "cue": {
          "en": "actually meet them",
          "ko": "실제로 만나 보다"
        },
        "gloss": {
          "en": "I can't say anything until I actually meet them.",
          "ko": "실제로 만나 보지 않고서는 뭐라고 말할 수 없다."
        }
      },
      {
        "text": "電話でも予約できるようにしないことには、結局使われないと思う。",
        "slot": "電話でも予約できるようにし",
        "cue": {
          "en": "let people book by phone too",
          "ko": "전화로도 예약할 수 있게 하다"
        },
        "gloss": {
          "en": "Unless they let people book by phone too, I don't think anyone will use it.",
          "ko": "전화로도 예약할 수 있게 하지 않고서는 결국 안 쓰일 거라고 봐."
        }
      },
      {
        "text": "やってみないことには、向いているか分からないよ。",
        "slot": "やってみ",
        "cue": {
          "en": "try it",
          "ko": "해 보다"
        },
        "gloss": {
          "en": "You won't know if it suits you until you try it.",
          "ko": "해 보지 않고서는 맞는지 모르지."
        }
      },
      {
        "text": "予算が決まらないことには、計画も立てられません。",
        "slot": "予算が決まら",
        "cue": {
          "en": "the budget gets decided",
          "ko": "예산이 정해지다"
        },
        "gloss": {
          "en": "Unless the budget is decided, we can't make a plan either.",
          "ko": "예산이 정해지지 않고서는 계획도 세울 수 없습니다."
        }
      }
    ]
  },
  {
    "id": "ja-f5-09",
    "stage": 5,
    "fn": "nuance-soften",
    "pattern": "正直なところ、___。",
    "core": [
      "正直なところ"
    ],
    "meaning": {
      "en": "Admitting your honest view softly: To be honest, ___.",
      "ko": "솔직한 생각 털어놓기: 솔직히 말하면 ___."
    },
    "grammar": [],
    "expressions": [
      "正直なところ"
    ],
    "examples": [
      {
        "text": "正直なところ、あの終わり方は納得できなかった。",
        "slot": "あの終わり方は納得できなかった",
        "cue": {
          "en": "not buy that ending",
          "ko": "그 결말이 납득되지 않다"
        },
        "gloss": {
          "en": "To be honest, I couldn't accept that ending.",
          "ko": "솔직히 말하면 그 결말은 납득이 안 됐어."
        }
      },
      {
        "text": "正直なところ、まだ迷っているんです。",
        "slot": "まだ迷っているんです",
        "cue": {
          "en": "still be undecided",
          "ko": "아직 망설이다"
        },
        "gloss": {
          "en": "Honestly, I'm still undecided.",
          "ko": "솔직히 아직 망설이고 있어요."
        }
      },
      {
        "text": "正直なところ、そこが一番難しいんだろうな。",
        "slot": "そこが一番難しいんだろうな",
        "cue": {
          "en": "that's the hardest part",
          "ko": "그게 제일 어렵다"
        },
        "gloss": {
          "en": "Honestly, that's probably the hardest part.",
          "ko": "솔직히 거기가 제일 어려운 부분이겠지."
        }
      },
      {
        "text": "正直なところ、予算的にはかなり厳しいです。",
        "slot": "予算的にはかなり厳しいです",
        "cue": {
          "en": "the budget is very tight",
          "ko": "예산상 꽤 빠듯하다"
        },
        "gloss": {
          "en": "To be frank, the budget is very tight.",
          "ko": "솔직히 예산 면에서는 꽤 빠듯합니다."
        }
      }
    ]
  },
  {
    "id": "ja-f5-10",
    "stage": 5,
    "fn": "disagree-soft",
    "pattern": "水を差すようで悪いけど、___。",
    "core": [
      "水を差すようで悪いけど"
    ],
    "meaning": {
      "en": "Raising a concern when others are excited: Sorry to rain on the parade, but ___.",
      "ko": "들뜬 분위기에 우려 꺼내기: 찬물 끼얹는 것 같아 미안하지만 ___."
    },
    "grammar": [],
    "expressions": [
      "水を差すようで悪いけど"
    ],
    "examples": [
      {
        "text": "水を差すようで悪いけど、その日は雨の予報だよ。",
        "slot": "その日は雨の予報だよ",
        "cue": {
          "en": "rain is forecast that day",
          "ko": "그날 비 예보가 있다"
        },
        "gloss": {
          "en": "Sorry to rain on your parade, but rain is forecast that day.",
          "ko": "찬물 끼얹는 것 같아 미안하지만 그날 비 온대."
        }
      },
      {
        "text": "水を差すようで悪いけど、予算が足りないと思う。",
        "slot": "予算が足りないと思う",
        "cue": {
          "en": "the budget isn't enough",
          "ko": "예산이 모자라다"
        },
        "gloss": {
          "en": "Sorry to be a downer, but I don't think the budget is enough.",
          "ko": "찬물 끼얹는 것 같아 미안하지만 예산이 모자랄 것 같아."
        }
      },
      {
        "text": "水を差すようで悪いけど、田中さんってサプライズ苦手じゃなかった？",
        "slot": "田中さんってサプライズ苦手じゃなかった？",
        "cue": {
          "en": "Tanaka doesn't like surprises",
          "ko": "다나카 씨가 서프라이즈를 싫어하다"
        },
        "gloss": {
          "en": "Sorry to spoil it, but doesn't Tanaka hate surprises?",
          "ko": "찬물 끼얹는 것 같아 미안하지만 다나카 씨 서프라이즈 싫어하지 않았어?"
        }
      },
      {
        "text": "水を差すようで悪いけど、そのお店、先月閉店したらしいよ。",
        "slot": "そのお店、先月閉店したらしいよ",
        "cue": {
          "en": "that shop closed last month",
          "ko": "그 가게가 지난달 문을 닫았다"
        },
        "gloss": {
          "en": "Sorry to burst your bubble, but I heard that shop closed last month.",
          "ko": "찬물 끼얹는 것 같아 미안하지만 그 가게 지난달에 문 닫았대."
        }
      }
    ]
  },
  {
    "id": "ja-f5-11",
    "stage": 5,
    "fn": "concede",
    "pattern": "言われてみれば、___。",
    "core": [
      "言われてみれば"
    ],
    "meaning": {
      "en": "Seeing someone's point after they say it: Now that you mention it, ___.",
      "ko": "듣고 보니 인정하기: 듣고 보니 ___."
    },
    "grammar": [],
    "expressions": [
      "言われてみれば"
    ],
    "examples": [
      {
        "text": "言われてみれば、あのとき彼女、何か言いかけてたね。",
        "slot": "あのとき彼女、何か言いかけてたね",
        "cue": {
          "en": "she was about to say something then",
          "ko": "그때 그녀가 뭔가 말하려 했다"
        },
        "gloss": {
          "en": "Now that you mention it, she was about to say something back then.",
          "ko": "듣고 보니 그때 그녀가 뭔가 말하려고 했었네."
        }
      },
      {
        "text": "言われてみれば、最近あまり寝ていないかも。",
        "slot": "最近あまり寝ていないかも",
        "cue": {
          "en": "I haven't slept much lately",
          "ko": "요즘 잠을 잘 못 잤다"
        },
        "gloss": {
          "en": "Now that you say it, maybe I haven't been sleeping much lately.",
          "ko": "듣고 보니 요즘 잠을 별로 못 잔 것 같아."
        }
      },
      {
        "text": "言われてみれば、そうだね。明日、先輩に聞いてみる。",
        "slot": "そうだね。明日、先輩に聞いてみる",
        "cue": {
          "en": "you're right; I'll ask my senior tomorrow",
          "ko": "그렇다, 내일 선배에게 물어보다"
        },
        "gloss": {
          "en": "Now that you put it that way, you're right. I'll ask my senior tomorrow.",
          "ko": "듣고 보니 그렇네. 내일 선배한테 물어볼게."
        }
      },
      {
        "text": "言われてみれば、この部屋ちょっと暗いですね。",
        "slot": "この部屋ちょっと暗いですね",
        "cue": {
          "en": "this room is a bit dark",
          "ko": "이 방이 좀 어둡다"
        },
        "gloss": {
          "en": "Now that you mention it, this room is a bit dark.",
          "ko": "듣고 보니 이 방 좀 어둡네요."
        }
      }
    ]
  },
  {
    "id": "ja-f5-12",
    "stage": 5,
    "fn": "concede",
    "pattern": "___にも一理あるね。",
    "core": [
      "一理ある"
    ],
    "meaning": {
      "en": "Granting part of the other view: There's some truth to ___.",
      "ko": "상대 의견 일부 인정하기: ___에도 일리가 있네."
    },
    "grammar": [],
    "expressions": [
      "一理ある"
    ],
    "examples": [
      {
        "text": "その意見にも一理あるね。",
        "slot": "その意見に",
        "cue": {
          "en": "that opinion",
          "ko": "그 의견"
        },
        "gloss": {
          "en": "There's something to that opinion.",
          "ko": "그 의견에도 일리가 있네."
        }
      },
      {
        "text": "費用がかかるって話にも一理あると思う。",
        "slot": "費用がかかるって話に",
        "cue": {
          "en": "the point that it's costly",
          "ko": "비용이 든다는 얘기"
        },
        "gloss": {
          "en": "I think there's some truth to the point about the cost.",
          "ko": "비용이 든다는 얘기에도 일리가 있다고 생각해."
        }
      },
      {
        "text": "そう考えると、彼の言い分にも一理あるかも。",
        "slot": "そう考えると、彼の言い分に",
        "cue": {
          "en": "his side of the story",
          "ko": "그의 주장"
        },
        "gloss": {
          "en": "Thinking about it that way, he might have a point.",
          "ko": "그렇게 생각하면 그의 말에도 일리가 있을지도."
        }
      },
      {
        "text": "早く始めるべきだという意見にも、一理あるとは思います。",
        "slot": "早く始めるべきだという意見にも、",
        "cue": {
          "en": "the view that we should start early",
          "ko": "빨리 시작해야 한다는 의견"
        },
        "gloss": {
          "en": "I do think the view that we should start early has a point.",
          "ko": "빨리 시작해야 한다는 의견에도 일리가 있다고는 생각합니다."
        }
      }
    ]
  },
  {
    "id": "ja-f5-13",
    "stage": 5,
    "fn": "disagree-soft",
    "pattern": "___のは、ちょっと腑に落ちない。",
    "core": [
      "腑に落ちない"
    ],
    "meaning": {
      "en": "Saying something doesn't sit right: ___ doesn't quite sit right with me.",
      "ko": "납득이 안 된다고 하기: ___는 좀 납득이 안 간다."
    },
    "grammar": [],
    "expressions": [
      "腑に落ちない"
    ],
    "examples": [
      {
        "text": "急にルールが変わったのは、ちょっと腑に落ちない。",
        "slot": "急にルールが変わった",
        "cue": {
          "en": "the rules suddenly changed",
          "ko": "규칙이 갑자기 바뀌다"
        },
        "gloss": {
          "en": "The sudden change in the rules doesn't quite sit right with me.",
          "ko": "갑자기 규칙이 바뀐 건 좀 납득이 안 간다."
        }
      },
      {
        "text": "説明は聞いたけど、まだ腑に落ちないところがある。",
        "slot": "説明は聞いたけど、まだ",
        "cue": {
          "en": "I heard the explanation, but still",
          "ko": "설명은 들었지만 아직"
        },
        "gloss": {
          "en": "I heard the explanation, but something still doesn't add up.",
          "ko": "설명은 들었지만 아직 납득이 안 가는 부분이 있다."
        }
      },
      {
        "text": "彼だけ怒られたのは、どうも腑に落ちないな。",
        "slot": "彼だけ怒られた",
        "cue": {
          "en": "only he got scolded",
          "ko": "그 사람만 혼나다"
        },
        "gloss": {
          "en": "It doesn't sit right that only he got told off.",
          "ko": "그 사람만 혼난 건 아무래도 납득이 안 가네."
        }
      },
      {
        "text": "値段が倍になったのは、正直腑に落ちないです。",
        "slot": "値段が倍になった",
        "cue": {
          "en": "the price doubled",
          "ko": "가격이 두 배가 되다"
        },
        "gloss": {
          "en": "Honestly, the price doubling doesn't make sense to me.",
          "ko": "가격이 두 배가 된 건 솔직히 납득이 안 갑니다."
        }
      }
    ]
  },
  {
    "id": "ja-f5-14",
    "stage": 5,
    "fn": "tact-refuse",
    "pattern": "___のは、正直あまり気が進まない。",
    "core": [
      "気が進まない"
    ],
    "meaning": {
      "en": "Saying you're reluctant: I'm honestly not keen on ___.",
      "ko": "내키지 않는다고 하기: ___는 솔직히 별로 내키지 않는다."
    },
    "grammar": [],
    "expressions": [
      "気が進まない"
    ],
    "examples": [
      {
        "text": "一応行くけど、正直あんまり気が進まないんだよね。",
        "slot": "一応行くけど、正直あんまり",
        "cue": {
          "en": "I'll go anyway, but honestly not very",
          "ko": "일단 가긴 하지만 솔직히 별로"
        },
        "gloss": {
          "en": "I'll go, but honestly I'm not very keen.",
          "ko": "일단 가긴 하는데 솔직히 별로 안 내켜."
        }
      },
      {
        "text": "みんな忙しそうで、声をかけるのは気が進まない。",
        "slot": "みんな忙しそうで、声をかけるのは",
        "cue": {
          "en": "speak up when everyone is busy",
          "ko": "다들 바빠 보여 말을 걸다"
        },
        "gloss": {
          "en": "Everyone looks busy, so I don't feel like bothering them.",
          "ko": "다들 바빠 보여서 말 거는 게 내키지 않아."
        }
      },
      {
        "text": "夜遅くに電話するのは、ちょっと気が進まないな。",
        "slot": "夜遅くに電話するのは、ちょっと",
        "cue": {
          "en": "call late at night",
          "ko": "밤늦게 전화하다"
        },
        "gloss": {
          "en": "I'm not too keen on calling late at night.",
          "ko": "밤늦게 전화하는 건 좀 내키지 않네."
        }
      },
      {
        "text": "知らない人ばかりの集まりは、どうも気が進まないです。",
        "slot": "知らない人ばかりの集まりは、どうも",
        "cue": {
          "en": "a gathering of strangers",
          "ko": "모르는 사람뿐인 모임"
        },
        "gloss": {
          "en": "I'm just not keen on gatherings full of strangers.",
          "ko": "모르는 사람만 있는 모임은 아무래도 내키지 않아요."
        }
      }
    ]
  },
  {
    "id": "ja-f5-15",
    "stage": 5,
    "fn": "sympathy",
    "pattern": "考えすぎだよ。___。",
    "core": [
      "考えすぎだよ"
    ],
    "meaning": {
      "en": "Reassuring a worried friend: You're overthinking it. ___.",
      "ko": "걱정하는 친구 안심시키기: 너무 깊게 생각하는 거야. ___."
    },
    "grammar": [],
    "expressions": [
      "考えすぎだよ"
    ],
    "examples": [
      {
        "text": "考えすぎだよ。それだけ準備しておけば大丈夫だって。",
        "slot": "それだけ準備しておけば大丈夫だって",
        "cue": {
          "en": "with that much prep you'll be fine",
          "ko": "그만큼 준비했으면 괜찮다"
        },
        "gloss": {
          "en": "You're overthinking it. With that much preparation, you'll be fine.",
          "ko": "너무 생각이 많아. 그만큼 준비했으면 괜찮다니까."
        }
      },
      {
        "text": "考えすぎだよ。誰も気にしてないって。",
        "slot": "誰も気にしてないって",
        "cue": {
          "en": "nobody cares",
          "ko": "아무도 신경 안 쓴다"
        },
        "gloss": {
          "en": "You're overthinking it. Nobody minds.",
          "ko": "너무 깊게 생각하는 거야. 아무도 신경 안 써."
        }
      },
      {
        "text": "考えすぎだよ。一回の失敗で嫌われたりしないよ。",
        "slot": "一回の失敗で嫌われたりしないよ",
        "cue": {
          "en": "no one will dislike you for one mistake",
          "ko": "한 번 실수로 미움받지 않는다"
        },
        "gloss": {
          "en": "You're overthinking it. Nobody will dislike you over one mistake.",
          "ko": "너무 생각이 많아. 한 번 실수했다고 미움받지 않아."
        }
      },
      {
        "text": "考えすぎだよ。返事が遅いのは忙しいだけだと思う。",
        "slot": "返事が遅いのは忙しいだけだと思う",
        "cue": {
          "en": "they're slow to reply because they're busy",
          "ko": "답이 늦는 건 바빠서다"
        },
        "gloss": {
          "en": "You're overthinking it. I think they're just busy and slow to reply.",
          "ko": "너무 생각이 많아. 답장이 늦은 건 바빠서일 거야."
        }
      }
    ]
  },
  {
    "id": "ja-f5-16",
    "stage": 5,
    "fn": "tact-refuse",
    "pattern": "___のは、ちょっと難しいかもです。",
    "core": [
      "ちょっと難しいかもです"
    ],
    "meaning": {
      "en": "Refusing without saying no: ___ might be a bit difficult.",
      "ko": "싫다고 하지 않고 거절하기: ___는 좀 어려울 수도 있어요."
    },
    "grammar": [],
    "expressions": [
      "ちょっと難しいかもです"
    ],
    "examples": [
      {
        "text": "ずらすのはちょっと難しいかもです。",
        "slot": "ずらすのは",
        "cue": {
          "en": "shift the date",
          "ko": "날짜를 옮기다"
        },
        "gloss": {
          "en": "Moving it might be a bit difficult.",
          "ko": "옮기는 건 좀 어려울 수도 있어요."
        }
      },
      {
        "text": "今週中に終わらせるのは、ちょっと難しいかもです。",
        "slot": "今週中に終わらせるのは、",
        "cue": {
          "en": "finish it this week",
          "ko": "이번 주 안에 끝내다"
        },
        "gloss": {
          "en": "Finishing it this week might be a bit tough.",
          "ko": "이번 주 안에 끝내는 건 좀 어려울 수도 있어요."
        }
      },
      {
        "text": "その日は先約があって、ちょっと難しいかもです。",
        "slot": "その日は先約があって、",
        "cue": {
          "en": "have a prior engagement that day",
          "ko": "그날 선약이 있다"
        },
        "gloss": {
          "en": "I have plans that day, so it might be a bit difficult.",
          "ko": "그날은 선약이 있어서 좀 어려울 수도 있어요."
        }
      },
      {
        "text": "一人で全部やるのは、ちょっと難しいかもです。",
        "slot": "一人で全部やるのは、",
        "cue": {
          "en": "do it all alone",
          "ko": "혼자 다 하다"
        },
        "gloss": {
          "en": "Doing it all on my own might be a bit hard.",
          "ko": "혼자 전부 하는 건 좀 어려울 수도 있어요."
        }
      }
    ]
  },
  {
    "id": "ja-f5-17",
    "stage": 5,
    "fn": "read-between",
    "pattern": "___て、本当にありがたいんですけど…",
    "core": [
      "ありがたいんですけど"
    ],
    "meaning": {
      "en": "Thanking before a soft refusal: It's really kind that ___, but….",
      "ko": "거절 전에 고마움 말하기: ___해 주셔서 정말 감사한데요…."
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "声をかけていただいて、本当にありがたいんですけど…。",
        "slot": "声をかけていただい",
        "cue": {
          "en": "be invited",
          "ko": "말을 걸어 주시다"
        },
        "gloss": {
          "en": "It's really kind of you to ask me, but…",
          "ko": "말씀해 주셔서 정말 감사한데요…"
        }
      },
      {
        "text": "誘ってくれて、本当にありがたいんですけど…。",
        "slot": "誘ってくれ",
        "cue": {
          "en": "be asked along",
          "ko": "불러 주다"
        },
        "gloss": {
          "en": "Thanks so much for inviting me, but…",
          "ko": "불러 줘서 정말 고마운데요…"
        }
      },
      {
        "text": "気にかけていただいて、ありがたいんですけど、今は大丈夫です。",
        "slot": "気にかけていただい",
        "cue": {
          "en": "be looked out for",
          "ko": "신경 써 주시다"
        },
        "gloss": {
          "en": "I appreciate your concern, but I'm fine for now.",
          "ko": "신경 써 주셔서 감사한데 지금은 괜찮아요."
        }
      },
      {
        "text": "そう言ってもらえて、ありがたいんですけど、まだ自信がなくて。",
        "slot": "そう言ってもらえ",
        "cue": {
          "en": "be told that",
          "ko": "그렇게 말해 주다"
        },
        "gloss": {
          "en": "It's kind of you to say so, but I'm not confident yet.",
          "ko": "그렇게 말해 줘서 고마운데 아직 자신이 없어서요."
        }
      }
    ]
  },
  {
    "id": "ja-f5-18",
    "stage": 5,
    "fn": "change-topic",
    "pattern": "それはそれとして、___。",
    "core": [
      "それはそれとして"
    ],
    "meaning": {
      "en": "Setting a point aside to move on: That aside, ___.",
      "ko": "한 얘기를 두고 넘어가기: 그건 그렇다 치고 ___."
    },
    "grammar": [],
    "expressions": [
      "それはそれとして"
    ],
    "examples": [
      {
        "text": "それはそれとして、動画はいいアイデアだから、当日みんなで見ようよ。",
        "slot": "動画はいいアイデアだから、当日みんなで見ようよ",
        "cue": {
          "en": "let's all watch the video on the day",
          "ko": "그날 다 같이 영상을 보자"
        },
        "gloss": {
          "en": "That aside, the video's a great idea, so let's all watch it on the day.",
          "ko": "그건 그렇다 치고 영상은 좋은 아이디어니까 당일에 다 같이 보자."
        }
      },
      {
        "text": "それはそれとして、お昼はどうする？",
        "slot": "お昼はどうする？",
        "cue": {
          "en": "what about lunch",
          "ko": "점심은 어떻게 하다"
        },
        "gloss": {
          "en": "Anyway, what are we doing for lunch?",
          "ko": "그건 그렇고 점심은 어떻게 할래?"
        }
      },
      {
        "text": "それはそれとして、来週の予定を決めましょう。",
        "slot": "来週の予定を決めましょう",
        "cue": {
          "en": "let's set next week's plan",
          "ko": "다음 주 일정을 정하자"
        },
        "gloss": {
          "en": "Setting that aside, let's decide next week's schedule.",
          "ko": "그건 그렇다 치고 다음 주 일정을 정합시다."
        }
      },
      {
        "text": "それはそれとして、彼の努力は認めるべきだと思う。",
        "slot": "彼の努力は認めるべきだと思う",
        "cue": {
          "en": "we should recognize his effort",
          "ko": "그의 노력은 인정해야 한다"
        },
        "gloss": {
          "en": "That aside, I think we should give him credit for his effort.",
          "ko": "그건 그렇다 치고 그의 노력은 인정해야 한다고 생각해."
        }
      }
    ]
  },
  {
    "id": "ja-f5-19",
    "stage": 5,
    "fn": "nuance-soften",
    "pattern": "___は悪くはないけど、…",
    "core": [
      "悪くはないけど"
    ],
    "meaning": {
      "en": "Faint praise before a complaint: ___ isn't bad, but ….",
      "ko": "좋게 말한 뒤 아쉬움 말하기: ___는 나쁘진 않은데 …."
    },
    "grammar": [],
    "expressions": [
      "悪くはないけど"
    ],
    "examples": [
      {
        "text": "温泉は悪くはないけど、宴会がつらくて。",
        "slot": "温泉は",
        "cue": {
          "en": "the hot spring",
          "ko": "온천"
        },
        "gloss": {
          "en": "The hot spring isn't bad, but the party is hard on me.",
          "ko": "온천은 나쁘진 않은데 연회가 힘들어서."
        }
      },
      {
        "text": "味は悪くはないけど、ちょっと高いかな。",
        "slot": "味は",
        "cue": {
          "en": "the taste",
          "ko": "맛"
        },
        "gloss": {
          "en": "It doesn't taste bad, but it's a bit pricey.",
          "ko": "맛은 나쁘진 않은데 좀 비싼 것 같아."
        }
      },
      {
        "text": "デザインは悪くはないけど、使いにくいんだよね。",
        "slot": "デザインは",
        "cue": {
          "en": "the design",
          "ko": "디자인"
        },
        "gloss": {
          "en": "The design isn't bad, but it's hard to use.",
          "ko": "디자인은 나쁘진 않은데 쓰기 불편하거든."
        }
      },
      {
        "text": "その案も悪くはないけど、もう少し考えたいな。",
        "slot": "その案も",
        "cue": {
          "en": "that idea too",
          "ko": "그 안도"
        },
        "gloss": {
          "en": "That idea isn't bad either, but I'd like to think a bit more.",
          "ko": "그 안도 나쁘진 않은데 조금 더 생각해 보고 싶어."
        }
      }
    ]
  },
  {
    "id": "ja-f5-20",
    "stage": 5,
    "fn": "not-necessarily",
    "pattern": "___とは限らないと思う。",
    "core": [
      "とは限らない"
    ],
    "meaning": {
      "en": "Saying it's not always so: I don't think ___ is necessarily so.",
      "ko": "꼭 그런 건 아니라고 하기: 꼭 ___라고는 할 수 없다."
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "それだけで決まるとは限らないと思う。",
        "slot": "それだけで決まる",
        "cue": {
          "en": "be decided by that alone",
          "ko": "그것만으로 정해지다"
        },
        "gloss": {
          "en": "I don't think it's necessarily decided by that alone.",
          "ko": "그것만으로 정해진다고는 할 수 없을 것 같아."
        }
      },
      {
        "text": "高い物がいい物とは限らないよ。",
        "slot": "高い物がいい物",
        "cue": {
          "en": "expensive things are good things",
          "ko": "비싼 물건이 좋은 물건"
        },
        "gloss": {
          "en": "Expensive things aren't always good things.",
          "ko": "비싼 물건이 꼭 좋은 물건이라고는 할 수 없어."
        }
      },
      {
        "text": "専門家の意見が正しいとは限らない。",
        "slot": "専門家の意見が正しい",
        "cue": {
          "en": "experts are right",
          "ko": "전문가 의견이 옳다"
        },
        "gloss": {
          "en": "The experts' opinion isn't necessarily right.",
          "ko": "전문가의 의견이 꼭 옳다고는 할 수 없다."
        }
      },
      {
        "text": "早く始めた人が上手になるとは限らないですよ。",
        "slot": "早く始めた人が上手になる",
        "cue": {
          "en": "those who start early get good",
          "ko": "일찍 시작한 사람이 잘하게 되다"
        },
        "gloss": {
          "en": "Starting early doesn't necessarily make you better.",
          "ko": "일찍 시작한 사람이 꼭 잘하게 된다고는 할 수 없어요."
        }
      }
    ]
  }
];
