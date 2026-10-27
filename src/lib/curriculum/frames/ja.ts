import type { Frame } from "../frames.ts";

/** 일본어 1~2단계 틀(curriculum/frames.ts) — Claude가 쓰고 다시 고침, 원어민 확인 전. */
export const JA_FRAMES: Frame[] = [
  {
    "id": "ja-f1-01",
    "stage": 1,
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
  }
];
