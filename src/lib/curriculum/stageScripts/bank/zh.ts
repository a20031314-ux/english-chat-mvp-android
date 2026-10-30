import type { StageScript } from "../../stageScripts.ts";

/**
 * zh 대본 은행(2026-10-30 사용자 "여러 개 만들어 두고 추천" → A: 지금 단계 이하에서) — 단계 조건·상황 목록과 따로, 오늘 할 것 끝의 대화 한 칸으로 추천(curriculum/scriptBank.ts).
 * 1~3단계 20개씩, 줄 8개, 내 줄에 그 단계 이하 틀 태그. Claude가 쓰고 scripts/script-bank.ts로 검사, 원어민 확인 전.
 */
export const ZH_BANK: StageScript[] = [
  {
    "id": "zh-1-b01",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a fruit stall",
      "ko": "과일 가게에서"
    },
    "expressions": [
      "你好",
      "多少钱",
      "太贵了",
      "我要这个",
      "好的",
      "再见"
    ],
    "grammar": [
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好！你要什么？",
        "gloss": {
          "en": "Hello! What would you like?",
          "ko": "안녕하세요! 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "你好！苹果多少钱？",
        "gloss": {
          "en": "Hello! How much are the apples?",
          "ko": "안녕하세요! 사과 얼마예요?"
        },
        "frames": [
          "zh-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "五块一斤。",
        "gloss": {
          "en": "Five yuan for half a kilo.",
          "ko": "한 근에 오 위안이에요."
        }
      },
      {
        "who": "me",
        "text": "太贵了。这个多少钱？",
        "gloss": {
          "en": "That's too expensive. How much is this one?",
          "ko": "너무 비싸요. 이건 얼마예요?"
        },
        "frames": [
          "zh-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "这个三块。",
        "gloss": {
          "en": "This one is three yuan.",
          "ko": "이건 삼 위안이에요."
        }
      },
      {
        "who": "me",
        "text": "好的，我要这个。",
        "gloss": {
          "en": "OK, I'll take this one.",
          "ko": "좋아요, 이걸로 할게요."
        },
        "frames": [
          "zh-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "谢谢！再见！",
        "gloss": {
          "en": "Thank you! Goodbye!",
          "ko": "고마워요! 안녕히 가세요!"
        }
      },
      {
        "who": "me",
        "text": "再见！明天见。",
        "gloss": {
          "en": "Bye! See you tomorrow.",
          "ko": "안녕히 계세요! 내일 봐요."
        },
        "frames": [
          "zh-f1-20"
        ]
      }
    ]
  },
  {
    "id": "zh-1-b02",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "First day in a new class",
      "ko": "새 반 첫날"
    },
    "expressions": [
      "你呢",
      "认识你很高兴"
    ],
    "grammar": [
      0
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好！你是新同学吗？",
        "gloss": {
          "en": "Hi! Are you a new student?",
          "ko": "안녕하세요! 새로 온 학생이에요?"
        }
      },
      {
        "who": "me",
        "text": "是，我是新同学。",
        "gloss": {
          "en": "Yes, I'm a new student.",
          "ko": "네, 새로 온 학생이에요."
        },
        "frames": [
          "zh-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "你从哪儿来？",
        "gloss": {
          "en": "Where are you from?",
          "ko": "어디에서 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "我从韩国来。你呢？",
        "gloss": {
          "en": "I'm from Korea. And you?",
          "ko": "한국에서 왔어요. 당신은요?"
        },
        "frames": [
          "zh-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "我从日本来。我也是新同学，认识你很高兴！",
        "gloss": {
          "en": "I'm from Japan. I'm new too. Nice to meet you!",
          "ko": "저는 일본에서 왔어요. 저도 새로 왔어요. 만나서 반가워요!"
        }
      },
      {
        "who": "me",
        "text": "认识你很高兴！",
        "gloss": {
          "en": "Nice to meet you too!",
          "ko": "만나서 반가워요!"
        }
      },
      {
        "who": "them",
        "text": "今天的课很好。",
        "gloss": {
          "en": "Today's class was good.",
          "ko": "오늘 수업 좋았어요."
        }
      },
      {
        "who": "me",
        "text": "是，很好。明天见。",
        "gloss": {
          "en": "Yes, it was. See you tomorrow.",
          "ko": "네, 좋았어요. 내일 봐요."
        },
        "frames": [
          "zh-f1-20"
        ]
      }
    ]
  },
  {
    "id": "zh-1-b03",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Looking for the restroom in a mall",
      "ko": "쇼핑몰에서 화장실 찾기"
    },
    "expressions": [
      "谢谢",
      "对不起",
      "请问",
      "洗手间在哪儿",
      "我听不懂",
      "请再说一遍",
      "好的"
    ],
    "grammar": [
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好，有什么事？",
        "gloss": {
          "en": "Hello, can I help you?",
          "ko": "안녕하세요, 무슨 일이세요?"
        }
      },
      {
        "who": "me",
        "text": "请问，洗手间在哪儿？",
        "gloss": {
          "en": "Excuse me, where is the restroom?",
          "ko": "실례지만, 화장실이 어디예요?"
        },
        "frames": [
          "zh-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "在二楼。",
        "gloss": {
          "en": "It's on the second floor.",
          "ko": "이 층에 있어요."
        }
      },
      {
        "who": "me",
        "text": "对不起，我听不懂。请再说一遍。",
        "gloss": {
          "en": "Sorry, I don't understand. Please say it again.",
          "ko": "죄송해요, 못 알아들었어요. 다시 한번 말해 주세요."
        },
        "frames": [
          "zh-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "二楼，在楼上。",
        "gloss": {
          "en": "The second floor, upstairs.",
          "ko": "이 층이요, 위층에 있어요."
        }
      },
      {
        "who": "me",
        "text": "这儿有电梯吗？",
        "gloss": {
          "en": "Is there an elevator here?",
          "ko": "여기 엘리베이터 있어요?"
        },
        "frames": [
          "zh-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "有，在那儿。",
        "gloss": {
          "en": "Yes, it's over there.",
          "ko": "있어요, 저기요."
        }
      },
      {
        "who": "me",
        "text": "好的，谢谢！",
        "gloss": {
          "en": "OK, thank you!",
          "ko": "네, 고마워요!"
        }
      }
    ]
  },
  {
    "id": "zh-1-b04",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Ordering at a café",
      "ko": "카페에서 주문하기"
    },
    "expressions": [
      "谢谢",
      "我要这个"
    ],
    "grammar": [
      2,
      3,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好！你要什么？",
        "gloss": {
          "en": "Hi! What would you like?",
          "ko": "안녕하세요! 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "我要一杯茶。",
        "gloss": {
          "en": "I'd like a cup of tea.",
          "ko": "차 한 잔 주세요."
        },
        "frames": [
          "zh-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "你要咖啡吗？我们的咖啡很好喝。",
        "gloss": {
          "en": "Would you like coffee? Our coffee is very good.",
          "ko": "커피는요? 저희 커피 아주 맛있어요."
        }
      },
      {
        "who": "me",
        "text": "不要，我不喜欢咖啡。",
        "gloss": {
          "en": "No, I don't like coffee.",
          "ko": "괜찮아요, 저는 커피를 안 좋아해요."
        },
        "frames": [
          "zh-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "好的。你要蛋糕吗？",
        "gloss": {
          "en": "OK. Would you like some cake?",
          "ko": "네. 케이크도 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "要。这个是什么？",
        "gloss": {
          "en": "Yes. What is this?",
          "ko": "네. 이건 뭐예요?"
        },
        "frames": [
          "zh-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "这是巧克力蛋糕，很好吃。",
        "gloss": {
          "en": "It's chocolate cake. It's delicious.",
          "ko": "초콜릿 케이크예요. 아주 맛있어요."
        }
      },
      {
        "who": "me",
        "text": "好，我要这个。谢谢！",
        "gloss": {
          "en": "OK, I'll have this one. Thanks!",
          "ko": "좋아요, 이걸로 할게요. 고마워요!"
        },
        "frames": [
          "zh-f1-12"
        ]
      }
    ]
  },
  {
    "id": "zh-1-b05",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "A bag left on a library seat",
      "ko": "도서관 자리에 둔 가방"
    },
    "expressions": [
      "谢谢",
      "不是",
      "再见"
    ],
    "grammar": [
      0,
      1,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "请问，这个包是你的吗？",
        "gloss": {
          "en": "Excuse me, is this bag yours?",
          "ko": "실례지만, 이 가방 당신 거예요?"
        }
      },
      {
        "who": "me",
        "text": "是，这是我的。谢谢！",
        "gloss": {
          "en": "Yes, it's mine. Thank you!",
          "ko": "네, 제 거예요. 고마워요!"
        },
        "frames": [
          "zh-f1-18"
        ]
      },
      {
        "who": "them",
        "text": "不客气。这本书也是你的吗？",
        "gloss": {
          "en": "You're welcome. Is this book yours too?",
          "ko": "천만에요. 이 책도 당신 거예요?"
        }
      },
      {
        "who": "me",
        "text": "不是，这是我朋友的。",
        "gloss": {
          "en": "No, it's my friend's.",
          "ko": "아니요, 제 친구 거예요."
        },
        "frames": [
          "zh-f1-18"
        ]
      },
      {
        "who": "them",
        "text": "你朋友在哪儿？",
        "gloss": {
          "en": "Where's your friend?",
          "ko": "친구는 어디 있어요?"
        }
      },
      {
        "who": "me",
        "text": "她在洗手间。我在这儿等她。",
        "gloss": {
          "en": "She's in the restroom. I'm waiting for her here.",
          "ko": "화장실에 있어요. 저는 여기서 기다려요."
        },
        "frames": [
          "zh-f1-19"
        ]
      },
      {
        "who": "them",
        "text": "好的，再见！",
        "gloss": {
          "en": "OK, bye!",
          "ko": "네, 안녕히 계세요!"
        }
      },
      {
        "who": "me",
        "text": "再见！谢谢你。",
        "gloss": {
          "en": "Bye! Thank you.",
          "ko": "안녕히 가세요! 고마워요."
        }
      }
    ]
  },
  {
    "id": "zh-1-b06",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Dinner at a friend's home",
      "ko": "친구 집에서 저녁 먹기"
    },
    "expressions": [
      "谢谢",
      "好的"
    ],
    "grammar": [
      3,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "请吃饭！这是我做的。",
        "gloss": {
          "en": "Please eat! I made this.",
          "ko": "드세요! 제가 만들었어요."
        }
      },
      {
        "who": "me",
        "text": "谢谢！这个是什么？",
        "gloss": {
          "en": "Thank you! What is this?",
          "ko": "고마워요! 이건 뭐예요?"
        },
        "frames": [
          "zh-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "这是饺子。你喜欢饺子吗？",
        "gloss": {
          "en": "These are dumplings. Do you like dumplings?",
          "ko": "만두예요. 만두 좋아해요?"
        }
      },
      {
        "who": "me",
        "text": "我喜欢饺子。",
        "gloss": {
          "en": "I like dumplings.",
          "ko": "저 만두 좋아해요."
        },
        "frames": [
          "zh-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "你吃吧。好吃吗？",
        "gloss": {
          "en": "Go ahead and eat. Is it good?",
          "ko": "드세요. 맛있어요?"
        }
      },
      {
        "who": "me",
        "text": "很好吃！这个饺子很好吃。",
        "gloss": {
          "en": "Very good! These dumplings are delicious.",
          "ko": "아주 맛있어요! 이 만두 정말 맛있어요."
        },
        "frames": [
          "zh-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "你还要吗？",
        "gloss": {
          "en": "Would you like some more?",
          "ko": "더 줄까요?"
        }
      },
      {
        "who": "me",
        "text": "好的，谢谢！",
        "gloss": {
          "en": "Yes, thank you!",
          "ko": "네, 고마워요!"
        }
      }
    ]
  },
  {
    "id": "zh-1-b07",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "A phone call to meet up",
      "ko": "만나려고 전화하기"
    },
    "expressions": [
      "等一下",
      "好的"
    ],
    "grammar": [
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "喂，你在哪儿？",
        "gloss": {
          "en": "Hello, where are you?",
          "ko": "여보세요, 어디예요?"
        }
      },
      {
        "who": "me",
        "text": "我在地铁站。",
        "gloss": {
          "en": "I'm at the subway station.",
          "ko": "지하철역에 있어요."
        },
        "frames": [
          "zh-f1-19"
        ]
      },
      {
        "who": "them",
        "text": "我在咖啡店。你来吗？",
        "gloss": {
          "en": "I'm at the coffee shop. Are you coming?",
          "ko": "저는 커피숍에 있어요. 올래요?"
        }
      },
      {
        "who": "me",
        "text": "好的。咖啡店在哪儿？",
        "gloss": {
          "en": "OK. Where is the coffee shop?",
          "ko": "좋아요. 커피숍이 어디예요?"
        },
        "frames": [
          "zh-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "在地铁站旁边。",
        "gloss": {
          "en": "It's next to the subway station.",
          "ko": "지하철역 옆에 있어요."
        }
      },
      {
        "who": "me",
        "text": "好，等一下。",
        "gloss": {
          "en": "OK, wait a moment.",
          "ko": "네, 잠깐만요."
        }
      },
      {
        "who": "them",
        "text": "好的，一会儿见！",
        "gloss": {
          "en": "OK, see you soon!",
          "ko": "네, 이따 봐요!"
        }
      },
      {
        "who": "me",
        "text": "一会儿见。",
        "gloss": {
          "en": "See you soon.",
          "ko": "이따 봐요."
        },
        "frames": [
          "zh-f1-20"
        ]
      }
    ]
  },
  {
    "id": "zh-1-b08",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Bargaining at a clothes stall",
      "ko": "옷 가게에서 흥정하기"
    },
    "expressions": [
      "多少钱",
      "太贵了",
      "我要这个",
      "好的"
    ],
    "grammar": [
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好！你喜欢这件衣服吗？",
        "gloss": {
          "en": "Hi! Do you like this top?",
          "ko": "안녕하세요! 이 옷 마음에 들어요?"
        }
      },
      {
        "who": "me",
        "text": "喜欢。这件多少钱？",
        "gloss": {
          "en": "I do. How much is this one?",
          "ko": "네. 이거 얼마예요?"
        },
        "frames": [
          "zh-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "两百块。",
        "gloss": {
          "en": "Two hundred yuan.",
          "ko": "이백 위안이에요."
        }
      },
      {
        "who": "me",
        "text": "太贵了！我没有那么多钱。",
        "gloss": {
          "en": "That's too expensive! I don't have that much money.",
          "ko": "너무 비싸요! 그렇게 많은 돈은 없어요."
        },
        "frames": [
          "zh-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "那一百五，好吗？",
        "gloss": {
          "en": "How about one hundred fifty, then?",
          "ko": "그럼 백오십 위안, 어때요?"
        }
      },
      {
        "who": "me",
        "text": "好的。这儿有大号的吗？",
        "gloss": {
          "en": "OK. Is there a large size here?",
          "ko": "좋아요. 여기 큰 사이즈 있어요?"
        },
        "frames": [
          "zh-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "有，这个是大号的。",
        "gloss": {
          "en": "Yes, this one is large.",
          "ko": "있어요, 이게 큰 사이즈예요."
        }
      },
      {
        "who": "me",
        "text": "好，我要这个。",
        "gloss": {
          "en": "Good, I'll take this one.",
          "ko": "좋아요, 이걸로 할게요."
        },
        "frames": [
          "zh-f1-12"
        ]
      }
    ]
  },
  {
    "id": "zh-1-b09",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a hotel front desk",
      "ko": "호텔 프런트에서"
    },
    "expressions": [
      "你好",
      "谢谢",
      "请问",
      "好的"
    ],
    "grammar": [
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好！有什么事吗？",
        "gloss": {
          "en": "Hello! Can I help you?",
          "ko": "안녕하세요! 무슨 일이세요?"
        }
      },
      {
        "who": "me",
        "text": "你好！请问，这儿有无线网吗？",
        "gloss": {
          "en": "Hello! Excuse me, is there Wi-Fi here?",
          "ko": "안녕하세요! 실례지만, 여기 와이파이 있어요?"
        },
        "frames": [
          "zh-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "有。密码在这儿。",
        "gloss": {
          "en": "Yes. The password is here.",
          "ko": "있어요. 비밀번호는 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "谢谢。早饭在哪儿？",
        "gloss": {
          "en": "Thanks. Where is breakfast?",
          "ko": "고마워요. 아침 식사는 어디서 해요?"
        },
        "frames": [
          "zh-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "在一楼，早上七点。",
        "gloss": {
          "en": "On the first floor, at seven in the morning.",
          "ko": "일 층에서요, 아침 일곱 시예요."
        }
      },
      {
        "who": "me",
        "text": "好的。请给我一瓶水。",
        "gloss": {
          "en": "OK. Please give me a bottle of water.",
          "ko": "알겠어요. 물 한 병 주세요."
        },
        "frames": [
          "zh-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "好的，给你。",
        "gloss": {
          "en": "Sure, here you go.",
          "ko": "네, 여기요."
        }
      },
      {
        "who": "me",
        "text": "谢谢！晚安。",
        "gloss": {
          "en": "Thank you! Good night.",
          "ko": "고마워요! 안녕히 주무세요."
        }
      }
    ]
  },
  {
    "id": "zh-1-b10",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Meeting people at a party",
      "ko": "파티에서 사람 만나기"
    },
    "expressions": [
      "不客气",
      "不是",
      "我是韩国人"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好！你是小王的朋友吗？",
        "gloss": {
          "en": "Hi! Are you Xiao Wang's friend?",
          "ko": "안녕하세요! 샤오왕 친구예요?"
        }
      },
      {
        "who": "me",
        "text": "是，我是他的同学。",
        "gloss": {
          "en": "Yes, I'm his classmate.",
          "ko": "네, 같은 반 친구예요."
        },
        "frames": [
          "zh-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "你是中国人吗？",
        "gloss": {
          "en": "Are you Chinese?",
          "ko": "중국 사람이에요?"
        }
      },
      {
        "who": "me",
        "text": "我不是中国人。我是韩国人。",
        "gloss": {
          "en": "I'm not Chinese. I'm Korean.",
          "ko": "중국 사람 아니에요. 한국 사람이에요."
        },
        "frames": [
          "zh-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "谢谢你来！",
        "gloss": {
          "en": "Thanks for coming!",
          "ko": "와 줘서 고마워요!"
        }
      },
      {
        "who": "me",
        "text": "不客气。那个人是谁？",
        "gloss": {
          "en": "No problem. Who is that person?",
          "ko": "천만에요. 저 사람은 누구예요?"
        },
        "frames": [
          "zh-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "他是小王的哥哥。",
        "gloss": {
          "en": "He's Xiao Wang's older brother.",
          "ko": "샤오왕의 형이에요."
        }
      },
      {
        "who": "me",
        "text": "哦，他很高！",
        "gloss": {
          "en": "Oh, he's very tall!",
          "ko": "아, 키가 정말 크네요!"
        }
      }
    ]
  },
  {
    "id": "zh-1-b11",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying a book at a bookstore",
      "ko": "서점에서 책 사기"
    },
    "expressions": [
      "你好",
      "谢谢",
      "多少钱",
      "好的"
    ],
    "grammar": [
      1,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好，你要买什么？",
        "gloss": {
          "en": "Hello, what would you like to buy?",
          "ko": "안녕하세요, 뭘 사시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "你好！你是这儿的老板吗？",
        "gloss": {
          "en": "Hello! Are you the owner here?",
          "ko": "안녕하세요! 여기 사장님이세요?"
        },
        "frames": [
          "zh-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "是，我是。",
        "gloss": {
          "en": "Yes, I am.",
          "ko": "네, 맞아요."
        }
      },
      {
        "who": "me",
        "text": "我要一本简单的中文书。",
        "gloss": {
          "en": "I'd like an easy Chinese book.",
          "ko": "쉬운 중국어 책 한 권 주세요."
        },
        "frames": [
          "zh-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "这本很好，很简单。",
        "gloss": {
          "en": "This one is good. It's very easy.",
          "ko": "이 책 좋아요. 아주 쉬워요."
        }
      },
      {
        "who": "me",
        "text": "这本多少钱？",
        "gloss": {
          "en": "How much is this one?",
          "ko": "이 책은 얼마예요?"
        },
        "frames": [
          "zh-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "三十块。",
        "gloss": {
          "en": "Thirty yuan.",
          "ko": "삼십 위안이에요."
        }
      },
      {
        "who": "me",
        "text": "好的。谢谢！",
        "gloss": {
          "en": "OK. Thank you!",
          "ko": "네. 고마워요!"
        }
      }
    ]
  },
  {
    "id": "zh-1-b12",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Asking the way to the train station",
      "ko": "기차역 가는 길 묻기"
    },
    "expressions": [
      "谢谢",
      "对不起",
      "我听不懂",
      "请再说一遍",
      "好的"
    ],
    "grammar": [
      3,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "侬好！侬去哪里？",
        "gloss": {
          "en": "Hi! Where are you going? (in Shanghainese)",
          "ko": "안녕하세요! 어디 가요? (상하이 말)"
        }
      },
      {
        "who": "me",
        "text": "对不起，我听不懂上海话。",
        "gloss": {
          "en": "Sorry, I don't understand Shanghainese.",
          "ko": "죄송해요, 상하이 말은 못 알아들어요."
        },
        "frames": [
          "zh-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "哦，你好！你去哪儿？",
        "gloss": {
          "en": "Oh, hello! Where are you going?",
          "ko": "아, 안녕하세요! 어디 가요?"
        }
      },
      {
        "who": "me",
        "text": "我去火车站。火车站在哪儿？",
        "gloss": {
          "en": "I'm going to the train station. Where is the train station?",
          "ko": "기차역에 가요. 기차역이 어디예요?"
        },
        "frames": [
          "zh-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "在前面，很近。",
        "gloss": {
          "en": "It's up ahead, very close.",
          "ko": "앞쪽에 있어요, 아주 가까워요."
        }
      },
      {
        "who": "me",
        "text": "很近？请再说一遍。",
        "gloss": {
          "en": "Very close? Please say it again.",
          "ko": "가깝다고요? 다시 한번 말해 주세요."
        },
        "frames": [
          "zh-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "很近，就在前面。",
        "gloss": {
          "en": "Very close, just up ahead.",
          "ko": "아주 가까워요, 바로 앞이에요."
        }
      },
      {
        "who": "me",
        "text": "好的，谢谢！",
        "gloss": {
          "en": "OK, thank you!",
          "ko": "네, 고마워요!"
        }
      }
    ]
  },
  {
    "id": "zh-1-b13",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Sending a letter at the post office",
      "ko": "우체국에서 편지 보내기"
    },
    "expressions": [
      "谢谢",
      "对不起",
      "多少钱",
      "好的"
    ],
    "grammar": [
      3,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好，请写这个。",
        "gloss": {
          "en": "Hello, please fill this in.",
          "ko": "안녕하세요, 이걸 써 주세요."
        }
      },
      {
        "who": "me",
        "text": "好的。对不起，我没有笔。",
        "gloss": {
          "en": "OK. Sorry, I don't have a pen.",
          "ko": "네. 죄송한데, 펜이 없어요."
        },
        "frames": [
          "zh-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "没关系，给你。",
        "gloss": {
          "en": "No problem, here you go.",
          "ko": "괜찮아요, 여기요."
        }
      },
      {
        "who": "me",
        "text": "谢谢。这个是什么？",
        "gloss": {
          "en": "Thanks. What is this?",
          "ko": "고마워요. 이건 뭐예요?"
        },
        "frames": [
          "zh-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "这是你的电话。",
        "gloss": {
          "en": "That's for your phone number.",
          "ko": "전화번호 쓰는 칸이에요."
        }
      },
      {
        "who": "me",
        "text": "好的。邮票多少钱？",
        "gloss": {
          "en": "OK. How much are stamps?",
          "ko": "알겠어요. 우표는 얼마예요?"
        },
        "frames": [
          "zh-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "一张五块。",
        "gloss": {
          "en": "Five yuan each.",
          "ko": "한 장에 오 위안이에요."
        }
      },
      {
        "who": "me",
        "text": "我要两张。",
        "gloss": {
          "en": "I'd like two.",
          "ko": "두 장 주세요."
        },
        "frames": [
          "zh-f1-12"
        ]
      }
    ]
  },
  {
    "id": "zh-1-b14",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Morning chat with a neighbor in the park",
      "ko": "공원에서 이웃과 아침 인사"
    },
    "expressions": [
      "早上好",
      "再见"
    ],
    "grammar": [
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "早上好！",
        "gloss": {
          "en": "Good morning!",
          "ko": "좋은 아침이에요!"
        }
      },
      {
        "who": "me",
        "text": "早上好！今天很热。",
        "gloss": {
          "en": "Good morning! It's very hot today.",
          "ko": "좋은 아침이에요! 오늘 아주 덥네요."
        },
        "frames": [
          "zh-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "是，很热。你喜欢夏天吗？",
        "gloss": {
          "en": "Yes, very hot. Do you like summer?",
          "ko": "네, 덥네요. 여름 좋아해요?"
        }
      },
      {
        "who": "me",
        "text": "我不喜欢夏天。",
        "gloss": {
          "en": "I don't like summer.",
          "ko": "저는 여름을 안 좋아해요."
        },
        "frames": [
          "zh-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "我也不喜欢。你喜欢什么季节？",
        "gloss": {
          "en": "I don't either. Which season do you like?",
          "ko": "저도요. 어떤 계절을 좋아해요?"
        }
      },
      {
        "who": "me",
        "text": "我喜欢冬天。",
        "gloss": {
          "en": "I like winter.",
          "ko": "저는 겨울을 좋아해요."
        },
        "frames": [
          "zh-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "冬天很好！再见！",
        "gloss": {
          "en": "Winter is nice! Bye!",
          "ko": "겨울 좋죠! 안녕히 가세요!"
        }
      },
      {
        "who": "me",
        "text": "再见！明天见。",
        "gloss": {
          "en": "Bye! See you tomorrow.",
          "ko": "안녕히 가세요! 내일 봐요."
        },
        "frames": [
          "zh-f1-20"
        ]
      }
    ]
  },
  {
    "id": "zh-1-b15",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Looking for a teacher at the school office",
      "ko": "학교 사무실에서 선생님 찾기"
    },
    "expressions": [
      "你好",
      "谢谢",
      "好的",
      "再见"
    ],
    "grammar": [
      0,
      1,
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好，你找谁？",
        "gloss": {
          "en": "Hello, who are you looking for?",
          "ko": "안녕하세요, 누구를 찾아요?"
        }
      },
      {
        "who": "me",
        "text": "你好！你是李老师吗？",
        "gloss": {
          "en": "Hello! Are you Teacher Li?",
          "ko": "안녕하세요! 리 선생님이세요?"
        },
        "frames": [
          "zh-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "不是，我不是李老师。",
        "gloss": {
          "en": "No, I'm not Teacher Li.",
          "ko": "아니요, 저는 리 선생님이 아니에요."
        }
      },
      {
        "who": "me",
        "text": "李老师在哪儿？",
        "gloss": {
          "en": "Where is Teacher Li?",
          "ko": "리 선생님은 어디 계세요?"
        },
        "frames": [
          "zh-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "他在教室。你是？",
        "gloss": {
          "en": "He's in the classroom. And you are?",
          "ko": "교실에 계세요. 누구세요?"
        }
      },
      {
        "who": "me",
        "text": "我是他的学生。教室在几楼？",
        "gloss": {
          "en": "I'm his student. Which floor is the classroom on?",
          "ko": "선생님 학생이에요. 교실은 몇 층이에요?"
        },
        "frames": [
          "zh-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "在三楼。",
        "gloss": {
          "en": "On the third floor.",
          "ko": "삼 층이에요."
        }
      },
      {
        "who": "me",
        "text": "好的，谢谢！再见。",
        "gloss": {
          "en": "OK, thank you! Goodbye.",
          "ko": "네, 고마워요! 안녕히 계세요."
        }
      }
    ]
  },
  {
    "id": "zh-1-b16",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Looking at a friend's family photo",
      "ko": "친구의 가족사진 보기"
    },
    "expressions": [
      "不是"
    ],
    "grammar": [
      0,
      1,
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "你看，这是我的家。",
        "gloss": {
          "en": "Look, this is my family.",
          "ko": "봐요, 우리 가족이에요."
        }
      },
      {
        "who": "me",
        "text": "很好！这个人是谁？",
        "gloss": {
          "en": "Nice! Who is this person?",
          "ko": "좋네요! 이 사람은 누구예요?"
        },
        "frames": [
          "zh-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "她是我妈妈。她是医生。",
        "gloss": {
          "en": "She's my mom. She's a doctor.",
          "ko": "우리 엄마예요. 의사예요."
        }
      },
      {
        "who": "me",
        "text": "你妈妈很漂亮！你是医生吗？",
        "gloss": {
          "en": "Your mom is very pretty! Are you a doctor?",
          "ko": "어머니가 정말 예쁘시네요! 당신도 의사예요?"
        },
        "frames": [
          "zh-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "不是，我是老师。你呢？",
        "gloss": {
          "en": "No, I'm a teacher. And you?",
          "ko": "아니요, 저는 선생님이에요. 당신은요?"
        }
      },
      {
        "who": "me",
        "text": "我不是老师。我是学生。",
        "gloss": {
          "en": "I'm not a teacher. I'm a student.",
          "ko": "저는 선생님이 아니에요. 학생이에요."
        },
        "frames": [
          "zh-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "你学什么？",
        "gloss": {
          "en": "What do you study?",
          "ko": "뭘 공부해요?"
        }
      },
      {
        "who": "me",
        "text": "我学中文。我喜欢中文。",
        "gloss": {
          "en": "I study Chinese. I like Chinese.",
          "ko": "중국어를 공부해요. 중국어가 좋아요."
        },
        "frames": [
          "zh-f1-15"
        ]
      }
    ]
  },
  {
    "id": "zh-1-b17",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a convenience store",
      "ko": "편의점에서"
    },
    "expressions": [
      "你好",
      "谢谢",
      "没关系",
      "我要这个"
    ],
    "grammar": [
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "欢迎！",
        "gloss": {
          "en": "Welcome!",
          "ko": "어서 오세요!"
        }
      },
      {
        "who": "me",
        "text": "你好！这儿有牛奶吗？",
        "gloss": {
          "en": "Hi! Is there milk here?",
          "ko": "안녕하세요! 여기 우유 있어요?"
        },
        "frames": [
          "zh-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "有，在那儿。",
        "gloss": {
          "en": "Yes, over there.",
          "ko": "있어요, 저기요."
        }
      },
      {
        "who": "me",
        "text": "谢谢。面包在哪儿？",
        "gloss": {
          "en": "Thanks. Where is the bread?",
          "ko": "고마워요. 빵은 어디 있어요?"
        },
        "frames": [
          "zh-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "对不起，我们没有面包。",
        "gloss": {
          "en": "Sorry, we don't have bread.",
          "ko": "죄송해요, 빵은 없어요."
        }
      },
      {
        "who": "me",
        "text": "没关系。我要这个。",
        "gloss": {
          "en": "That's OK. I'll take this.",
          "ko": "괜찮아요. 이거 주세요."
        },
        "frames": [
          "zh-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "好的，八块。你有袋子吗？",
        "gloss": {
          "en": "OK, eight yuan. Do you have a bag?",
          "ko": "네, 팔 위안이에요. 봉투 있어요?"
        }
      },
      {
        "who": "me",
        "text": "我没有袋子。",
        "gloss": {
          "en": "I don't have a bag.",
          "ko": "봉투 없어요."
        },
        "frames": [
          "zh-f1-11"
        ]
      }
    ]
  },
  {
    "id": "zh-1-b18",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Ordering at a small restaurant",
      "ko": "작은 식당에서 주문하기"
    },
    "expressions": [
      "我要这个",
      "等一下"
    ],
    "grammar": [
      2,
      3,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好！你要什么？",
        "gloss": {
          "en": "Hello! What would you like?",
          "ko": "안녕하세요! 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "请等一下。这个是什么？",
        "gloss": {
          "en": "Just a moment, please. What is this?",
          "ko": "잠깐만요. 이건 뭐예요?"
        },
        "frames": [
          "zh-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "这是麻婆豆腐，很辣。",
        "gloss": {
          "en": "That's mapo tofu. It's very spicy.",
          "ko": "마파두부예요. 아주 매워요."
        }
      },
      {
        "who": "me",
        "text": "我不喜欢辣的。",
        "gloss": {
          "en": "I don't like spicy food.",
          "ko": "저는 매운 거 안 좋아해요."
        },
        "frames": [
          "zh-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "那这个呢？不辣，很好吃。",
        "gloss": {
          "en": "How about this one? It's not spicy, and it's very good.",
          "ko": "그럼 이건요? 안 맵고 아주 맛있어요."
        }
      },
      {
        "who": "me",
        "text": "好，我要这个。",
        "gloss": {
          "en": "OK, I'll have this one.",
          "ko": "좋아요, 이걸로 할게요."
        },
        "frames": [
          "zh-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "好吃吗？",
        "gloss": {
          "en": "Is it good?",
          "ko": "맛있어요?"
        }
      },
      {
        "who": "me",
        "text": "很好吃！这个菜很好吃。",
        "gloss": {
          "en": "Very good! This dish is delicious.",
          "ko": "아주 맛있어요! 이 요리 정말 맛있어요."
        },
        "frames": [
          "zh-f1-14"
        ]
      }
    ]
  },
  {
    "id": "zh-1-b19",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Picking up a guest at the airport",
      "ko": "공항에서 손님 마중하기"
    },
    "expressions": [
      "你好",
      "等一下",
      "好的",
      "认识你很高兴"
    ],
    "grammar": [
      0,
      1,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好！",
        "gloss": {
          "en": "Hello!",
          "ko": "안녕하세요!"
        }
      },
      {
        "who": "me",
        "text": "你好！你是张老师吗？",
        "gloss": {
          "en": "Hello! Are you Teacher Zhang?",
          "ko": "안녕하세요! 장 선생님이세요?"
        },
        "frames": [
          "zh-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "是，我是。你是？",
        "gloss": {
          "en": "Yes, I am. And you are?",
          "ko": "네, 맞아요. 누구세요?"
        }
      },
      {
        "who": "me",
        "text": "我是学校的学生。认识你很高兴。",
        "gloss": {
          "en": "I'm a student from the school. Nice to meet you.",
          "ko": "학교 학생이에요. 만나서 반가워요."
        },
        "frames": [
          "zh-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "认识你很高兴！你从哪儿来？",
        "gloss": {
          "en": "Nice to meet you! Where are you from?",
          "ko": "만나서 반가워요! 어디에서 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "我从韩国来。",
        "gloss": {
          "en": "I'm from Korea.",
          "ko": "한국에서 왔어요."
        },
        "frames": [
          "zh-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "好，我们走吧。",
        "gloss": {
          "en": "Good, let's go.",
          "ko": "좋아요, 가요."
        }
      },
      {
        "who": "me",
        "text": "好的，请等一下。",
        "gloss": {
          "en": "OK, please wait a moment.",
          "ko": "네, 잠깐만 기다려 주세요."
        },
        "frames": [
          "zh-f1-13"
        ]
      }
    ]
  },
  {
    "id": "zh-1-b20",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "A friend's birthday",
      "ko": "친구 생일"
    },
    "expressions": [
      "谢谢"
    ],
    "grammar": [
      0,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "你来了！请进。",
        "gloss": {
          "en": "You're here! Come in.",
          "ko": "왔구나! 들어와요."
        }
      },
      {
        "who": "me",
        "text": "生日快乐！这是给你的。",
        "gloss": {
          "en": "Happy birthday! This is for you.",
          "ko": "생일 축하해요! 이거 선물이에요."
        },
        "frames": [
          "zh-f1-18"
        ]
      },
      {
        "who": "them",
        "text": "谢谢！这是什么？",
        "gloss": {
          "en": "Thank you! What is it?",
          "ko": "고마워요! 이게 뭐예요?"
        }
      },
      {
        "who": "me",
        "text": "是一本书。你喜欢书吗？",
        "gloss": {
          "en": "It's a book. Do you like books?",
          "ko": "책이에요. 책 좋아해요?"
        }
      },
      {
        "who": "them",
        "text": "我很喜欢！你要喝什么？",
        "gloss": {
          "en": "I love them! What would you like to drink?",
          "ko": "정말 좋아해요! 뭐 마실래요?"
        }
      },
      {
        "who": "me",
        "text": "我要一杯水。",
        "gloss": {
          "en": "I'd like a glass of water.",
          "ko": "물 한 잔 주세요."
        },
        "frames": [
          "zh-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "好的。蛋糕也很好吃，你吃吧。",
        "gloss": {
          "en": "Sure. The cake is good too, have some.",
          "ko": "네. 케이크도 맛있어요, 먹어요."
        }
      },
      {
        "who": "me",
        "text": "谢谢！这个蛋糕很好吃。",
        "gloss": {
          "en": "Thanks! This cake is delicious.",
          "ko": "고마워요! 이 케이크 정말 맛있어요."
        },
        "frames": [
          "zh-f1-14"
        ]
      }
    ]
  },
  {
    "id": "zh-2-b01",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Planning a weekend hike",
      "ko": "주말 등산 계획"
    },
    "expressions": [
      "几点见",
      "太好了"
    ],
    "grammar": [
      0,
      1,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "我想周末去爬山，你呢？",
        "gloss": {
          "en": "I want to go hiking this weekend. How about you?",
          "ko": "주말에 등산 가고 싶은데, 당신은요?"
        }
      },
      {
        "who": "me",
        "text": "太好了！周末一起去爬山吧。",
        "gloss": {
          "en": "Great! Let's go hiking together this weekend.",
          "ko": "좋아요! 주말에 같이 등산 가요."
        },
        "frames": [
          "zh-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "好啊！星期六怎么样？",
        "gloss": {
          "en": "Sure! How about Saturday?",
          "ko": "좋아요! 토요일 어때요?"
        }
      },
      {
        "who": "me",
        "text": "星期六可以。几点见？",
        "gloss": {
          "en": "Saturday works. What time shall we meet?",
          "ko": "토요일 괜찮아요. 몇 시에 만나요?"
        }
      },
      {
        "who": "them",
        "text": "早上八点，在地铁站见。",
        "gloss": {
          "en": "Eight in the morning, at the subway station.",
          "ko": "아침 여덟 시에 지하철역에서 만나요."
        }
      },
      {
        "who": "me",
        "text": "好的，我们坐地铁去吧。",
        "gloss": {
          "en": "OK, let's take the subway.",
          "ko": "좋아요, 지하철 타고 가요."
        },
        "frames": [
          "zh-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "对，那儿很近。别忘了带水。",
        "gloss": {
          "en": "Right, it's close. Don't forget to bring water.",
          "ko": "맞아요, 가까워요. 물 챙기는 거 잊지 마요."
        }
      },
      {
        "who": "me",
        "text": "好的，我已经买水了。",
        "gloss": {
          "en": "Sure, I've already bought water.",
          "ko": "네, 물은 벌써 샀어요."
        },
        "frames": [
          "zh-f2-02"
        ]
      }
    ]
  },
  {
    "id": "zh-2-b02",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "At a noodle shop",
      "ko": "국숫집에서"
    },
    "expressions": [
      "不要辣",
      "打包"
    ],
    "grammar": [
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好，吃点儿什么？",
        "gloss": {
          "en": "Hi, what would you like to eat?",
          "ko": "안녕하세요, 뭐 드시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "我要一碗牛肉面。",
        "gloss": {
          "en": "I'd like a bowl of beef noodles.",
          "ko": "우육면 한 그릇 주세요."
        },
        "frames": [
          "zh-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "要辣吗？",
        "gloss": {
          "en": "Do you want it spicy?",
          "ko": "맵게 해 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "不要辣。请不要放香菜。",
        "gloss": {
          "en": "Not spicy. Please don't add coriander.",
          "ko": "안 맵게요. 고수는 넣지 말아 주세요."
        },
        "frames": [
          "zh-f2-20"
        ]
      },
      {
        "who": "them",
        "text": "好的。还要别的吗？",
        "gloss": {
          "en": "OK. Anything else?",
          "ko": "네. 다른 건요?"
        }
      },
      {
        "who": "me",
        "text": "有饺子吗？我想吃饺子。",
        "gloss": {
          "en": "Do you have dumplings? I want to eat some dumplings.",
          "ko": "만두 있어요? 만두 먹고 싶어요."
        },
        "frames": [
          "zh-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "有，猪肉的和白菜的。",
        "gloss": {
          "en": "Yes, pork or cabbage.",
          "ko": "있어요, 돼지고기랑 배추 만두요."
        }
      },
      {
        "who": "me",
        "text": "白菜的吧。在这儿吃，不打包。",
        "gloss": {
          "en": "Cabbage, please. I'll eat here, not take away.",
          "ko": "배추 만두로요. 여기서 먹을게요, 포장 말고요."
        }
      }
    ]
  },
  {
    "id": "zh-2-b03",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Asking for directions on the street",
      "ko": "길에서 길 묻기"
    },
    "expressions": [
      "怎么走"
    ],
    "grammar": [
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好，有什么事吗？",
        "gloss": {
          "en": "Hello, can I help you?",
          "ko": "안녕하세요, 무슨 일이세요?"
        }
      },
      {
        "who": "me",
        "text": "请问，去地铁站怎么走？",
        "gloss": {
          "en": "Excuse me, how do I get to the subway station?",
          "ko": "실례지만, 지하철역에 어떻게 가요?"
        },
        "frames": [
          "zh-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "一直往前走，到路口往左走。",
        "gloss": {
          "en": "Go straight, then turn left at the intersection.",
          "ko": "쭉 가다가 사거리에서 왼쪽으로 가세요."
        }
      },
      {
        "who": "me",
        "text": "远吗？走路要多长时间？",
        "gloss": {
          "en": "Is it far? How long does it take on foot?",
          "ko": "멀어요? 걸어서 얼마나 걸려요?"
        }
      },
      {
        "who": "them",
        "text": "走路要二十分钟，有点儿远。",
        "gloss": {
          "en": "About twenty minutes on foot. It's a bit far.",
          "ko": "걸어서 이십 분이요. 좀 멀어요."
        }
      },
      {
        "who": "me",
        "text": "有点儿远啊。那我打车去地铁站。",
        "gloss": {
          "en": "That's a bit far. Then I'll take a taxi to the subway station.",
          "ko": "좀 머네요. 그럼 택시 타고 지하철역에 갈게요."
        },
        "frames": [
          "zh-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "也可以坐公交车，五路车。",
        "gloss": {
          "en": "You can also take the bus, number five.",
          "ko": "버스도 돼요, 오 번 버스요."
        }
      },
      {
        "who": "me",
        "text": "公交车站在哪儿？",
        "gloss": {
          "en": "Where's the bus stop?",
          "ko": "버스 정류장은 어디예요?"
        },
        "frames": [
          "zh-f1-08"
        ]
      }
    ]
  },
  {
    "id": "zh-2-b04",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Seeing a doctor at a clinic",
      "ko": "병원 진료"
    },
    "expressions": [
      "我头疼"
    ],
    "grammar": [
      0,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好，你哪儿不舒服？",
        "gloss": {
          "en": "Hello, what seems to be the problem?",
          "ko": "안녕하세요, 어디가 불편하세요?"
        }
      },
      {
        "who": "me",
        "text": "我头疼。还有点儿发烧。",
        "gloss": {
          "en": "I have a headache. I also have a slight fever.",
          "ko": "머리가 아파요. 열도 좀 있어요."
        },
        "frames": [
          "zh-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "从什么时候开始的？",
        "gloss": {
          "en": "When did it start?",
          "ko": "언제부터 그랬어요?"
        }
      },
      {
        "who": "me",
        "text": "昨天晚上开始的。我已经吃药了。",
        "gloss": {
          "en": "It started last night. I've already taken medicine.",
          "ko": "어젯밤부터요. 약은 벌써 먹었어요."
        },
        "frames": [
          "zh-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "我看看……你感冒了，多喝水，多休息。",
        "gloss": {
          "en": "Let me see... You have a cold. Drink lots of water and rest.",
          "ko": "어디 볼게요… 감기예요. 물 많이 마시고 푹 쉬세요."
        }
      },
      {
        "who": "me",
        "text": "我能明天上班吗？",
        "gloss": {
          "en": "Can I go to work tomorrow?",
          "ko": "내일 출근해도 돼요?"
        },
        "frames": [
          "zh-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "最好休息两天。",
        "gloss": {
          "en": "It's best to rest for two days.",
          "ko": "이틀 쉬는 게 좋아요."
        }
      },
      {
        "who": "me",
        "text": "好的，谢谢医生。",
        "gloss": {
          "en": "OK, thank you, doctor.",
          "ko": "네, 감사합니다, 선생님."
        }
      }
    ]
  },
  {
    "id": "zh-2-b05",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "At a museum entrance",
      "ko": "박물관 입구에서"
    },
    "expressions": [
      "怎么走",
      "可以拍照吗",
      "太好了"
    ],
    "grammar": [
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "欢迎！请给我看一下票。",
        "gloss": {
          "en": "Welcome! Please show me your ticket.",
          "ko": "어서 오세요! 표 좀 보여 주세요."
        }
      },
      {
        "who": "me",
        "text": "好的，给你。这儿可以拍照吗？",
        "gloss": {
          "en": "Sure, here. Can I take photos here?",
          "ko": "네, 여기요. 여기서 사진 찍어도 돼요?"
        },
        "frames": [
          "zh-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "可以，但是不要用闪光灯。",
        "gloss": {
          "en": "Yes, but don't use the flash.",
          "ko": "돼요, 그런데 플래시는 쓰지 마세요."
        }
      },
      {
        "who": "me",
        "text": "好的。我能在这儿放包吗？",
        "gloss": {
          "en": "OK. Can I leave my bag here?",
          "ko": "알겠어요. 여기에 가방 둬도 돼요?"
        },
        "frames": [
          "zh-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "可以，那边有柜子。",
        "gloss": {
          "en": "Yes, there are lockers over there.",
          "ko": "네, 저쪽에 보관함이 있어요."
        }
      },
      {
        "who": "me",
        "text": "太好了。去咖啡厅怎么走？",
        "gloss": {
          "en": "Great. How do I get to the café?",
          "ko": "잘됐네요. 카페는 어떻게 가요?"
        },
        "frames": [
          "zh-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "在二楼，坐电梯上去。",
        "gloss": {
          "en": "It's on the second floor. Take the elevator up.",
          "ko": "이 층이에요. 엘리베이터 타고 올라가세요."
        }
      },
      {
        "who": "me",
        "text": "好的，谢谢！",
        "gloss": {
          "en": "OK, thank you!",
          "ko": "네, 고마워요!"
        }
      }
    ]
  },
  {
    "id": "zh-2-b06",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Morning chat with a neighbor in the elevator",
      "ko": "엘리베이터에서 이웃과 아침 대화"
    },
    "expressions": [],
    "grammar": [
      0,
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "早上好！你每天都这么早啊。",
        "gloss": {
          "en": "Good morning! You're always so early.",
          "ko": "좋은 아침이에요! 매일 이렇게 일찍 나가네요."
        }
      },
      {
        "who": "me",
        "text": "是啊，我每天六点起床。",
        "gloss": {
          "en": "Yes, I get up at six every day.",
          "ko": "네, 매일 여섯 시에 일어나요."
        },
        "frames": [
          "zh-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "这么早！你在哪儿上班？",
        "gloss": {
          "en": "So early! Where do you work?",
          "ko": "그렇게 일찍요! 어디서 일해요?"
        }
      },
      {
        "who": "me",
        "text": "我在银行上班。",
        "gloss": {
          "en": "I work at a bank.",
          "ko": "은행에서 일해요."
        },
        "frames": [
          "zh-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "银行远吗？",
        "gloss": {
          "en": "Is the bank far?",
          "ko": "은행은 멀어요?"
        }
      },
      {
        "who": "me",
        "text": "有点儿远，我每天坐地铁。",
        "gloss": {
          "en": "A bit far. I take the subway every day.",
          "ko": "좀 멀어요. 매일 지하철 타요."
        }
      },
      {
        "who": "them",
        "text": "你吃早饭了吗？",
        "gloss": {
          "en": "Have you had breakfast?",
          "ko": "아침은 먹었어요?"
        }
      },
      {
        "who": "me",
        "text": "我已经吃了。",
        "gloss": {
          "en": "I've already eaten.",
          "ko": "벌써 먹었어요."
        },
        "frames": [
          "zh-f2-02"
        ]
      }
    ]
  },
  {
    "id": "zh-2-b07",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Deciding when to see a new film",
      "ko": "새 영화 언제 볼지 정하기"
    },
    "expressions": [
      "几点见"
    ],
    "grammar": [
      1,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "有一个新电影很好看，你想看吗？",
        "gloss": {
          "en": "There's a new film that's really good. Do you want to see it?",
          "ko": "새 영화가 정말 재밌대요. 볼래요?"
        }
      },
      {
        "who": "me",
        "text": "想看！我们什么时候去？今天还是明天？",
        "gloss": {
          "en": "Yes! When shall we go? Today or tomorrow?",
          "ko": "보고 싶어요! 언제 갈까요? 오늘이요, 내일이요?"
        },
        "frames": [
          "zh-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "今天我没空，明天吧。",
        "gloss": {
          "en": "I'm not free today. Let's go tomorrow.",
          "ko": "오늘은 시간이 없어요. 내일 가요."
        }
      },
      {
        "who": "me",
        "text": "好的，几点见？",
        "gloss": {
          "en": "OK, what time shall we meet?",
          "ko": "좋아요, 몇 시에 만나요?"
        }
      },
      {
        "who": "them",
        "text": "晚上七点在电影院见。",
        "gloss": {
          "en": "Seven in the evening at the cinema.",
          "ko": "저녁 일곱 시에 영화관에서 만나요."
        }
      },
      {
        "who": "me",
        "text": "我们坐公交车去吧。",
        "gloss": {
          "en": "Let's take the bus.",
          "ko": "버스 타고 가요."
        },
        "frames": [
          "zh-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "好，我买票。",
        "gloss": {
          "en": "OK, I'll buy the tickets.",
          "ko": "좋아요, 표는 제가 살게요."
        }
      },
      {
        "who": "me",
        "text": "谢谢！我想吃爆米花。",
        "gloss": {
          "en": "Thanks! I want to eat popcorn.",
          "ko": "고마워요! 팝콘 먹고 싶어요."
        },
        "frames": [
          "zh-f2-04"
        ]
      }
    ]
  },
  {
    "id": "zh-2-b08",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "A friend visits my home",
      "ko": "친구가 우리 집에 놀러 옴"
    },
    "expressions": [
      "有点儿累"
    ],
    "grammar": [
      0,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "你家很漂亮！",
        "gloss": {
          "en": "Your home is lovely!",
          "ko": "집이 정말 예뻐요!"
        }
      },
      {
        "who": "me",
        "text": "谢谢！你喝茶还是喝咖啡？",
        "gloss": {
          "en": "Thanks! Will you have tea or coffee?",
          "ko": "고마워요! 차 마실래요, 커피 마실래요?"
        },
        "frames": [
          "zh-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "我喝茶吧。",
        "gloss": {
          "en": "I'll have tea.",
          "ko": "차 마실게요."
        }
      },
      {
        "who": "me",
        "text": "好的。我昨天去了超市，买了很多水果。",
        "gloss": {
          "en": "OK. I went to the supermarket yesterday and bought lots of fruit.",
          "ko": "좋아요. 어제 마트에 가서 과일을 많이 샀어요."
        },
        "frames": [
          "zh-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "太好了，谢谢。你周末做什么了？",
        "gloss": {
          "en": "Great, thanks. What did you do at the weekend?",
          "ko": "좋네요, 고마워요. 주말에 뭐 했어요?"
        }
      },
      {
        "who": "me",
        "text": "我在家看书。我有点儿累。",
        "gloss": {
          "en": "I read at home. I'm a bit tired.",
          "ko": "집에서 책 읽었어요. 좀 피곤해요."
        },
        "frames": [
          "zh-f2-19"
        ]
      },
      {
        "who": "them",
        "text": "下周一起去公园走走吧？",
        "gloss": {
          "en": "Shall we go for a walk in the park next week?",
          "ko": "다음 주에 같이 공원 산책할래요?"
        }
      },
      {
        "who": "me",
        "text": "好啊！我想去公园。",
        "gloss": {
          "en": "Sure! I want to go to the park.",
          "ko": "좋아요! 공원에 가고 싶어요."
        },
        "frames": [
          "zh-f2-03"
        ]
      }
    ]
  },
  {
    "id": "zh-2-b09",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Talking about learning Chinese at a party",
      "ko": "파티에서 중국어 공부 이야기"
    },
    "expressions": [],
    "grammar": [
      1,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "你的中文不错！你在哪儿学中文？",
        "gloss": {
          "en": "Your Chinese is good! Where do you study Chinese?",
          "ko": "중국어 잘하네요! 어디서 중국어 배워요?"
        }
      },
      {
        "who": "me",
        "text": "谢谢！我在大学学中文。",
        "gloss": {
          "en": "Thanks! I study Chinese at university.",
          "ko": "고마워요! 대학교에서 중국어 배워요."
        },
        "frames": [
          "zh-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "学了多长时间了？",
        "gloss": {
          "en": "How long have you been studying?",
          "ko": "얼마나 배웠어요?"
        }
      },
      {
        "who": "me",
        "text": "一年了。我想去北京学习。",
        "gloss": {
          "en": "For a year. I want to go to Beijing to study.",
          "ko": "일 년 됐어요. 베이징에 가서 공부하고 싶어요."
        },
        "frames": [
          "zh-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "北京很好！你什么时候去？",
        "gloss": {
          "en": "Beijing is great! When are you going?",
          "ko": "베이징 좋죠! 언제 가요?"
        }
      },
      {
        "who": "me",
        "text": "我想明年去。现在我有点儿忙。",
        "gloss": {
          "en": "I'd like to go next year. I'm a bit busy now.",
          "ko": "내년에 가고 싶어요. 지금은 좀 바빠요."
        },
        "frames": [
          "zh-f2-19"
        ]
      },
      {
        "who": "them",
        "text": "加油！",
        "gloss": {
          "en": "Keep it up!",
          "ko": "파이팅!"
        }
      },
      {
        "who": "me",
        "text": "谢谢！下次一起吃饭吧。",
        "gloss": {
          "en": "Thanks! Let's have a meal together next time.",
          "ko": "고마워요! 다음에 같이 밥 먹어요."
        }
      }
    ]
  },
  {
    "id": "zh-2-b10",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Arranging a ride to the airport at a hotel",
      "ko": "호텔에서 공항 가는 차 묻기"
    },
    "expressions": [
      "太好了"
    ],
    "grammar": [
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好，有什么需要帮忙的吗？",
        "gloss": {
          "en": "Hello, how can I help you?",
          "ko": "안녕하세요, 뭘 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "我明天要去机场。我能在这儿叫车吗？",
        "gloss": {
          "en": "I need to go to the airport tomorrow. Can I call a car here?",
          "ko": "내일 공항에 가야 해요. 여기서 차를 부를 수 있어요?"
        },
        "frames": [
          "zh-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "可以。你几点出发？",
        "gloss": {
          "en": "Yes. What time are you leaving?",
          "ko": "네. 몇 시에 출발해요?"
        }
      },
      {
        "who": "me",
        "text": "早上六点。我打车去机场。要多长时间？",
        "gloss": {
          "en": "Six in the morning. I'll take a taxi to the airport. How long does it take?",
          "ko": "아침 여섯 시요. 택시 타고 공항에 갈 거예요. 얼마나 걸려요?"
        },
        "frames": [
          "zh-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "四十分钟左右。",
        "gloss": {
          "en": "About forty minutes.",
          "ko": "사십 분쯤 걸려요."
        }
      },
      {
        "who": "me",
        "text": "好的。这儿可以放行李吗？",
        "gloss": {
          "en": "OK. Can I leave my luggage here?",
          "ko": "알겠어요. 여기에 짐 맡겨도 돼요?"
        },
        "frames": [
          "zh-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "可以，放在这儿吧。",
        "gloss": {
          "en": "Yes, just leave it here.",
          "ko": "네, 여기 두세요."
        }
      },
      {
        "who": "me",
        "text": "太好了，谢谢！",
        "gloss": {
          "en": "Great, thanks!",
          "ko": "잘됐네요, 고마워요!"
        }
      }
    ]
  },
  {
    "id": "zh-2-b11",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Paying the bill at a restaurant",
      "ko": "식당에서 계산하기"
    },
    "expressions": [
      "打包"
    ],
    "grammar": [
      1,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "菜好吃吗？",
        "gloss": {
          "en": "Was the food good?",
          "ko": "음식 맛있었어요?"
        }
      },
      {
        "who": "me",
        "text": "很好吃！这个鱼很好吃。",
        "gloss": {
          "en": "Very good! This fish is delicious.",
          "ko": "아주 맛있었어요! 이 생선 정말 맛있어요."
        },
        "frames": [
          "zh-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "谢谢。一共一百二十块。",
        "gloss": {
          "en": "Thank you. That's one hundred twenty yuan in total.",
          "ko": "고마워요. 모두 백이십 위안이에요."
        }
      },
      {
        "who": "me",
        "text": "菜太多了，我能打包吗？",
        "gloss": {
          "en": "There's too much food. Can I take it away?",
          "ko": "음식이 너무 많아요. 포장해도 돼요?"
        },
        "frames": [
          "zh-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "可以，我给你拿盒子。",
        "gloss": {
          "en": "Sure, I'll get you a box.",
          "ko": "네, 용기 갖다 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "谢谢。这儿可以用手机付钱吗？",
        "gloss": {
          "en": "Thanks. Can I pay by phone here?",
          "ko": "고마워요. 여기서 휴대폰으로 결제해도 돼요?"
        },
        "frames": [
          "zh-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "可以，扫这个。",
        "gloss": {
          "en": "Yes, scan this.",
          "ko": "네, 이거 스캔하세요."
        }
      },
      {
        "who": "me",
        "text": "好了。下次我想吃烤鸭。",
        "gloss": {
          "en": "Done. Next time I want to eat roast duck.",
          "ko": "됐어요. 다음엔 오리구이 먹고 싶어요."
        },
        "frames": [
          "zh-f2-04"
        ]
      }
    ]
  },
  {
    "id": "zh-2-b12",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Buying a train ticket",
      "ko": "기차표 사기"
    },
    "expressions": [],
    "grammar": [
      1,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好，你要去哪儿？",
        "gloss": {
          "en": "Hello, where would you like to go?",
          "ko": "안녕하세요, 어디 가세요?"
        }
      },
      {
        "who": "me",
        "text": "你好。我想去上海。",
        "gloss": {
          "en": "Hello. I want to go to Shanghai.",
          "ko": "안녕하세요. 상하이에 가고 싶어요."
        },
        "frames": [
          "zh-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "你要哪天的票？",
        "gloss": {
          "en": "Which day's ticket do you want?",
          "ko": "며칠 표를 원하세요?"
        }
      },
      {
        "who": "me",
        "text": "今天还是明天？我都可以。",
        "gloss": {
          "en": "Today or tomorrow? Either is fine for me.",
          "ko": "오늘이요, 내일이요? 저는 둘 다 괜찮아요."
        },
        "frames": [
          "zh-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "今天没有票了，明天上午有。",
        "gloss": {
          "en": "Today is sold out. There are tickets tomorrow morning.",
          "ko": "오늘은 표가 없어요. 내일 오전에는 있어요."
        }
      },
      {
        "who": "me",
        "text": "好的，我要一张。",
        "gloss": {
          "en": "OK, I'd like one.",
          "ko": "좋아요, 한 장 주세요."
        },
        "frames": [
          "zh-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "一共五百五十块。",
        "gloss": {
          "en": "That's five hundred fifty yuan.",
          "ko": "모두 오백오십 위안이에요."
        }
      },
      {
        "who": "me",
        "text": "有点儿贵。好吧，给你。",
        "gloss": {
          "en": "It's a bit expensive. Well, here you go.",
          "ko": "좀 비싸네요. 그래요, 여기요."
        }
      }
    ]
  },
  {
    "id": "zh-2-b13",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Monday morning with a classmate",
      "ko": "월요일 아침 같은 반 친구와"
    },
    "expressions": [
      "有点儿累"
    ],
    "grammar": [
      0,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "你周末做什么了？",
        "gloss": {
          "en": "What did you do at the weekend?",
          "ko": "주말에 뭐 했어요?"
        }
      },
      {
        "who": "me",
        "text": "我昨天去了长城。",
        "gloss": {
          "en": "I went to the Great Wall yesterday.",
          "ko": "어제 만리장성에 갔어요."
        },
        "frames": [
          "zh-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "真的吗？怎么样？",
        "gloss": {
          "en": "Really? How was it?",
          "ko": "정말요? 어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "很好看，可是我有点儿累。",
        "gloss": {
          "en": "It was beautiful, but I'm a bit tired.",
          "ko": "정말 멋있었는데, 좀 피곤해요."
        },
        "frames": [
          "zh-f2-19"
        ]
      },
      {
        "who": "them",
        "text": "你们怎么去的？",
        "gloss": {
          "en": "How did you get there?",
          "ko": "어떻게 갔어요?"
        }
      },
      {
        "who": "me",
        "text": "我们坐大巴去的。",
        "gloss": {
          "en": "We went by coach.",
          "ko": "관광버스 타고 갔어요."
        }
      },
      {
        "who": "them",
        "text": "我也想去长城。",
        "gloss": {
          "en": "I want to go to the Great Wall too.",
          "ko": "저도 만리장성에 가고 싶어요."
        }
      },
      {
        "who": "me",
        "text": "下次周末一起去长城吧。",
        "gloss": {
          "en": "Let's go to the Great Wall together some weekend.",
          "ko": "다음에 주말에 같이 만리장성 가요."
        },
        "frames": [
          "zh-f2-16"
        ]
      }
    ]
  },
  {
    "id": "zh-2-b14",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "At a pharmacy",
      "ko": "약국에서"
    },
    "expressions": [],
    "grammar": [
      0,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好，你要买什么药？",
        "gloss": {
          "en": "Hello, what medicine do you need?",
          "ko": "안녕하세요, 무슨 약 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "我肚子疼。",
        "gloss": {
          "en": "My stomach hurts.",
          "ko": "배가 아파요."
        },
        "frames": [
          "zh-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "吃了什么东西吗？",
        "gloss": {
          "en": "Did you eat something?",
          "ko": "뭘 드셨어요?"
        }
      },
      {
        "who": "me",
        "text": "我昨天去了火锅店，吃了很多辣的。",
        "gloss": {
          "en": "Yesterday I went to a hotpot place and ate a lot of spicy food.",
          "ko": "어제 훠궈집에 가서 매운 걸 많이 먹었어요."
        },
        "frames": [
          "zh-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "吃这个药吧，一天三次。",
        "gloss": {
          "en": "Take this medicine, three times a day.",
          "ko": "이 약 드세요, 하루 세 번이요."
        }
      },
      {
        "who": "me",
        "text": "我能现在吃吗？",
        "gloss": {
          "en": "Can I take it now?",
          "ko": "지금 먹어도 돼요?"
        },
        "frames": [
          "zh-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "可以，饭后吃更好。",
        "gloss": {
          "en": "Yes, but after a meal is better.",
          "ko": "돼요, 식후에 드시면 더 좋아요."
        }
      },
      {
        "who": "me",
        "text": "好的，我已经吃饭了。",
        "gloss": {
          "en": "OK, I've already eaten.",
          "ko": "네, 밥은 벌써 먹었어요."
        },
        "frames": [
          "zh-f2-02"
        ]
      }
    ]
  },
  {
    "id": "zh-2-b15",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "At a bubble tea shop",
      "ko": "버블티 가게에서"
    },
    "expressions": [
      "太好了"
    ],
    "grammar": [
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好，要什么？",
        "gloss": {
          "en": "Hi, what would you like?",
          "ko": "안녕하세요, 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "我要一杯奶茶。",
        "gloss": {
          "en": "I'd like a milk tea.",
          "ko": "밀크티 한 잔 주세요."
        },
        "frames": [
          "zh-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "要冰的还是热的？",
        "gloss": {
          "en": "Iced or hot?",
          "ko": "아이스요, 따뜻한 거요?"
        }
      },
      {
        "who": "me",
        "text": "冰的。请不要放糖。",
        "gloss": {
          "en": "Iced. Please don't add sugar.",
          "ko": "아이스요. 설탕은 넣지 말아 주세요."
        },
        "frames": [
          "zh-f2-20"
        ]
      },
      {
        "who": "them",
        "text": "好的。要珍珠吗？",
        "gloss": {
          "en": "OK. Would you like pearls?",
          "ko": "네. 펄 넣어 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "要。这儿可以坐吗？",
        "gloss": {
          "en": "Yes. Can I sit here?",
          "ko": "네. 여기 앉아도 돼요?"
        },
        "frames": [
          "zh-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "可以，那边有座位。",
        "gloss": {
          "en": "Sure, there are seats over there.",
          "ko": "네, 저쪽에 자리 있어요."
        }
      },
      {
        "who": "me",
        "text": "太好了，谢谢。",
        "gloss": {
          "en": "Great, thanks.",
          "ko": "잘됐네요, 고마워요."
        }
      }
    ]
  },
  {
    "id": "zh-2-b16",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "A phone call about evening plans",
      "ko": "저녁 약속 전화"
    },
    "expressions": [
      "没空"
    ],
    "grammar": [
      2,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "喂，你今天晚上有空吗？",
        "gloss": {
          "en": "Hello, are you free this evening?",
          "ko": "여보세요, 오늘 저녁에 시간 있어요?"
        }
      },
      {
        "who": "me",
        "text": "对不起，没空。我今天晚上去看电影。",
        "gloss": {
          "en": "Sorry, I'm not free. I'm going to see a film this evening.",
          "ko": "미안해요, 시간이 없어요. 오늘 저녁에 영화 보러 가요."
        },
        "frames": [
          "zh-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "跟谁去？",
        "gloss": {
          "en": "Who are you going with?",
          "ko": "누구랑 가요?"
        }
      },
      {
        "who": "me",
        "text": "跟我的同事。",
        "gloss": {
          "en": "With my colleague.",
          "ko": "회사 동료랑요."
        }
      },
      {
        "who": "them",
        "text": "那下次吧。周末呢？",
        "gloss": {
          "en": "Next time then. What about the weekend?",
          "ko": "그럼 다음에요. 주말은요?"
        }
      },
      {
        "who": "me",
        "text": "周末有空。周末一起去吃火锅吧。",
        "gloss": {
          "en": "I'm free at the weekend. Let's go have hotpot together at the weekend.",
          "ko": "주말엔 시간 있어요. 주말에 같이 훠궈 먹으러 가요."
        },
        "frames": [
          "zh-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "好啊！星期六还是星期天？",
        "gloss": {
          "en": "Sure! Saturday or Sunday?",
          "ko": "좋아요! 토요일이요, 일요일이요?"
        }
      },
      {
        "who": "me",
        "text": "星期六吧。我们坐地铁去吧。",
        "gloss": {
          "en": "Saturday. Let's take the subway.",
          "ko": "토요일요. 지하철 타고 가요."
        },
        "frames": [
          "zh-f2-14"
        ]
      }
    ]
  },
  {
    "id": "zh-2-b17",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Opening an account at a bank",
      "ko": "은행에서 계좌 만들기"
    },
    "expressions": [],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好，你要办卡吗？",
        "gloss": {
          "en": "Hello, would you like to open an account?",
          "ko": "안녕하세요, 카드 만드시게요?"
        }
      },
      {
        "who": "me",
        "text": "对。我能用护照办卡吗？",
        "gloss": {
          "en": "Yes. Can I use my passport to open one?",
          "ko": "네. 여권으로 만들 수 있어요?"
        },
        "frames": [
          "zh-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "可以。你在哪儿工作？",
        "gloss": {
          "en": "Yes. Where do you work?",
          "ko": "네. 어디서 일하세요?"
        }
      },
      {
        "who": "me",
        "text": "我在一家韩国公司上班。",
        "gloss": {
          "en": "I work at a Korean company.",
          "ko": "한국 회사에서 일해요."
        },
        "frames": [
          "zh-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "好的，请在这儿写你的电话。",
        "gloss": {
          "en": "OK, please write your phone number here.",
          "ko": "네, 여기에 전화번호를 써 주세요."
        }
      },
      {
        "who": "me",
        "text": "我没有中国的电话。",
        "gloss": {
          "en": "I don't have a Chinese phone number.",
          "ko": "중국 전화번호가 없어요."
        },
        "frames": [
          "zh-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "没关系，写韩国的也可以。",
        "gloss": {
          "en": "That's fine, a Korean one is OK too.",
          "ko": "괜찮아요, 한국 번호도 돼요."
        }
      },
      {
        "who": "me",
        "text": "好的，谢谢。",
        "gloss": {
          "en": "OK, thanks.",
          "ko": "네, 고마워요."
        }
      }
    ]
  },
  {
    "id": "zh-2-b18",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Planning a holiday trip with a friend",
      "ko": "친구와 휴가 여행 계획"
    },
    "expressions": [],
    "grammar": [
      1,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "放假你想去哪儿玩儿？",
        "gloss": {
          "en": "Where do you want to go for the holiday?",
          "ko": "방학에 어디 놀러 가고 싶어요?"
        }
      },
      {
        "who": "me",
        "text": "我想去西安。",
        "gloss": {
          "en": "I want to go to Xi'an.",
          "ko": "시안에 가고 싶어요."
        },
        "frames": [
          "zh-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "西安很好！怎么去？",
        "gloss": {
          "en": "Xi'an is great! How shall we get there?",
          "ko": "시안 좋죠! 어떻게 가요?"
        }
      },
      {
        "who": "me",
        "text": "我们坐高铁去吧。",
        "gloss": {
          "en": "Let's take the high-speed train.",
          "ko": "고속철도 타고 가요."
        },
        "frames": [
          "zh-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "好，坐飞机太贵了。到了西安吃什么？",
        "gloss": {
          "en": "OK, flying is too expensive. What shall we eat in Xi'an?",
          "ko": "좋아요, 비행기는 너무 비싸요. 시안에 가면 뭐 먹을까요?"
        }
      },
      {
        "who": "me",
        "text": "我想吃羊肉泡馍。",
        "gloss": {
          "en": "I want to eat lamb soup with bread.",
          "ko": "양고기 빵 수프 먹고 싶어요."
        },
        "frames": [
          "zh-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "我也是！我们什么时候买票？",
        "gloss": {
          "en": "Me too! When shall we buy tickets?",
          "ko": "저도요! 표는 언제 살까요?"
        }
      },
      {
        "who": "me",
        "text": "今天还是明天？",
        "gloss": {
          "en": "Today or tomorrow?",
          "ko": "오늘이요, 내일이요?"
        },
        "frames": [
          "zh-f2-13"
        ]
      }
    ]
  },
  {
    "id": "zh-2-b19",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Talking with a homestay host",
      "ko": "홈스테이 주인과 대화"
    },
    "expressions": [],
    "grammar": [
      1,
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "你明天几点起床？我做早饭。",
        "gloss": {
          "en": "What time will you get up tomorrow? I'll make breakfast.",
          "ko": "내일 몇 시에 일어나요? 아침 해 줄게요."
        }
      },
      {
        "who": "me",
        "text": "我每天七点起床。",
        "gloss": {
          "en": "I get up at seven every day.",
          "ko": "매일 일곱 시에 일어나요."
        },
        "frames": [
          "zh-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "好。你喝牛奶还是喝豆浆？",
        "gloss": {
          "en": "OK. Will you have milk or soy milk?",
          "ko": "좋아요. 우유 마실래요, 두유 마실래요?"
        }
      },
      {
        "who": "me",
        "text": "我喝豆浆。我想吃包子。",
        "gloss": {
          "en": "Soy milk. I'd like to eat steamed buns.",
          "ko": "두유요. 찐빵 먹고 싶어요."
        },
        "frames": [
          "zh-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "没问题。你明天去哪儿？",
        "gloss": {
          "en": "No problem. Where are you going tomorrow?",
          "ko": "문제없어요. 내일 어디 가요?"
        }
      },
      {
        "who": "me",
        "text": "我在语言学校学中文。九点上课。",
        "gloss": {
          "en": "I study Chinese at a language school. Class starts at nine.",
          "ko": "어학원에서 중국어 배워요. 아홉 시에 수업 시작해요."
        },
        "frames": [
          "zh-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "那你八点出门吧。",
        "gloss": {
          "en": "Then leave home at eight.",
          "ko": "그럼 여덟 시에 나가요."
        }
      },
      {
        "who": "me",
        "text": "好的，谢谢阿姨！",
        "gloss": {
          "en": "OK, thank you!",
          "ko": "네, 고마워요, 아주머니!"
        }
      }
    ]
  },
  {
    "id": "zh-2-b20",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Tired in the office break room",
      "ko": "사무실 휴게실에서 피곤할 때"
    },
    "expressions": [
      "有点儿累"
    ],
    "grammar": [
      0,
      1,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "你怎么了？",
        "gloss": {
          "en": "What's wrong?",
          "ko": "무슨 일 있어요?"
        }
      },
      {
        "who": "me",
        "text": "我有点儿累。昨天工作到很晚。",
        "gloss": {
          "en": "I'm a bit tired. I worked late yesterday.",
          "ko": "좀 피곤해요. 어제 늦게까지 일했어요."
        },
        "frames": [
          "zh-f2-19"
        ]
      },
      {
        "who": "them",
        "text": "喝杯咖啡吧。",
        "gloss": {
          "en": "Have a cup of coffee.",
          "ko": "커피 한 잔 마셔요."
        }
      },
      {
        "who": "me",
        "text": "我已经喝了两杯了。",
        "gloss": {
          "en": "I've already had two cups.",
          "ko": "벌써 두 잔 마셨어요."
        },
        "frames": [
          "zh-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "那你休息一下吧。",
        "gloss": {
          "en": "Then take a short break.",
          "ko": "그럼 좀 쉬어요."
        }
      },
      {
        "who": "me",
        "text": "好。你喝茶还是喝咖啡？我去买。",
        "gloss": {
          "en": "OK. Will you have tea or coffee? I'll go get it.",
          "ko": "네. 차 마실래요, 커피 마실래요? 제가 사 올게요."
        },
        "frames": [
          "zh-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "茶吧，谢谢。",
        "gloss": {
          "en": "Tea, thanks.",
          "ko": "차요, 고마워요."
        }
      },
      {
        "who": "me",
        "text": "不客气。",
        "gloss": {
          "en": "You're welcome.",
          "ko": "천만에요."
        }
      }
    ]
  },
  {
    "id": "zh-3-b01",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Chatting with a colleague about holiday travel",
      "ko": "동료와 휴가 여행 이야기"
    },
    "expressions": [
      "说实话",
      "我去过",
      "你说得对"
    ],
    "grammar": [
      0,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "你这个假期打算去哪儿？",
        "gloss": {
          "en": "Where are you planning to go this holiday?",
          "ko": "이번 휴가에 어디 갈 생각이에요?"
        }
      },
      {
        "who": "me",
        "text": "还没想好。我去过西安和成都。这次想去南方看看。",
        "gloss": {
          "en": "I haven't decided. I've been to Xi'an and Chengdu. This time I'd like to see the south.",
          "ko": "아직 못 정했어요. 시안이랑 청두는 가 봤어요. 이번엔 남쪽에 가 보고 싶어요."
        },
        "frames": [
          "zh-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "那去广州吧，那儿的早茶特别有名。",
        "gloss": {
          "en": "Then go to Guangzhou. Their dim sum breakfast is famous.",
          "ko": "그럼 광저우 가요. 거기 딤섬 아침이 아주 유명해요."
        }
      },
      {
        "who": "me",
        "text": "早茶？你吃过虾饺吗？",
        "gloss": {
          "en": "Dim sum? Have you ever eaten shrimp dumplings?",
          "ko": "딤섬요? 새우 만두 먹어 봤어요?"
        },
        "frames": [
          "zh-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "吃过，非常好吃。而且广州比北京暖和多了。",
        "gloss": {
          "en": "Yes, they're delicious. And Guangzhou is much warmer than Beijing.",
          "ko": "먹어 봤어요, 정말 맛있어요. 게다가 광저우가 베이징보다 훨씬 따뜻해요."
        }
      },
      {
        "who": "me",
        "text": "说实话，我觉得冬天去南方最好。",
        "gloss": {
          "en": "To be honest, I think winter is the best time to go south.",
          "ko": "솔직히 겨울엔 남쪽에 가는 게 제일 좋은 것 같아요."
        },
        "frames": [
          "zh-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "对，北方现在越来越冷了。",
        "gloss": {
          "en": "Right, it's getting colder and colder in the north.",
          "ko": "맞아요, 북쪽은 요즘 점점 추워져요."
        }
      },
      {
        "who": "me",
        "text": "你说得对，我下个月就去。",
        "gloss": {
          "en": "You're right. I'll go next month.",
          "ko": "맞아요, 다음 달에 바로 갈게요."
        },
        "frames": [
          "zh-f3-16"
        ]
      }
    ]
  },
  {
    "id": "zh-3-b02",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Choosing a phone plan at a phone shop",
      "ko": "휴대폰 매장에서 요금제 고르기"
    },
    "expressions": [
      "我的意思是"
    ],
    "grammar": [
      1,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "这两个套餐你看看，都不错。",
        "gloss": {
          "en": "Have a look at these two plans. Both are good.",
          "ko": "이 두 요금제 보세요, 둘 다 괜찮아요."
        }
      },
      {
        "who": "me",
        "text": "这个比那个便宜。流量呢？",
        "gloss": {
          "en": "This one is cheaper than that one. What about data?",
          "ko": "이게 저것보다 싸네요. 데이터는요?"
        },
        "frames": [
          "zh-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "对，可是流量没有那么多。",
        "gloss": {
          "en": "Yes, but it doesn't have as much data.",
          "ko": "네, 그런데 데이터가 그만큼 많진 않아요."
        }
      },
      {
        "who": "me",
        "text": "我每天看视频，那这个没有那个那么合适。",
        "gloss": {
          "en": "I watch videos every day, so this one isn't as suitable as that one.",
          "ko": "매일 동영상을 보니까, 이건 저것만큼 맞지 않겠네요."
        },
        "frames": [
          "zh-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "那你选贵一点儿的吧，每个月多三十块。",
        "gloss": {
          "en": "Then pick the pricier one. It's thirty yuan more a month.",
          "ko": "그럼 조금 비싼 걸로 하세요. 한 달에 삼십 위안 더예요."
        }
      },
      {
        "who": "me",
        "text": "我的意思是，有没有中间的。",
        "gloss": {
          "en": "What I mean is, is there one in between?",
          "ko": "제 말은, 중간 정도 되는 건 없냐는 거예요."
        },
        "frames": [
          "zh-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "有，这个刚好，流量够，也不太贵。",
        "gloss": {
          "en": "Yes, this one is just right: enough data and not too expensive.",
          "ko": "있어요, 이게 딱 맞아요. 데이터도 넉넉하고 그렇게 비싸지도 않아요."
        }
      },
      {
        "who": "me",
        "text": "好，就要这个。请把合同给我。",
        "gloss": {
          "en": "Great, I'll take this one. Please give me the contract.",
          "ko": "좋아요, 이걸로 할게요. 계약서 주세요."
        },
        "frames": [
          "zh-f3-10"
        ]
      }
    ]
  },
  {
    "id": "zh-3-b03",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Dinner at a friend's parents' home",
      "ko": "친구 부모님 댁에서 저녁 식사"
    },
    "expressions": [
      "说实话",
      "第一次"
    ],
    "grammar": [
      0,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "多吃点儿，别客气！",
        "gloss": {
          "en": "Eat more, don't be shy!",
          "ko": "많이 먹어요, 사양하지 말고!"
        }
      },
      {
        "who": "me",
        "text": "谢谢阿姨，我已经吃了很多了。我吃不了这么多。",
        "gloss": {
          "en": "Thank you, I've already eaten a lot. I can't eat this much.",
          "ko": "고맙습니다, 벌써 많이 먹었어요. 이렇게 많이는 못 먹어요."
        },
        "frames": [
          "zh-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "再尝尝这个鱼吧。你吃过这种鱼吗？",
        "gloss": {
          "en": "Try this fish, then. Have you had this kind of fish before?",
          "ko": "이 생선도 먹어 봐요. 이런 생선 먹어 봤어요?"
        }
      },
      {
        "who": "me",
        "text": "第一次吃。说实话，我觉得比饭馆的还好吃。",
        "gloss": {
          "en": "It's my first time. To be honest, I think it's even better than at a restaurant.",
          "ko": "처음 먹어요. 솔직히 식당 것보다 더 맛있는 것 같아요."
        },
        "frames": [
          "zh-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "哈哈，你真会说话！",
        "gloss": {
          "en": "Ha ha, you know just what to say!",
          "ko": "하하, 말도 참 잘하네요!"
        }
      },
      {
        "who": "me",
        "text": "是真的。我正在学做中国菜呢。",
        "gloss": {
          "en": "I mean it. I'm learning to cook Chinese food these days.",
          "ko": "진짜예요. 요즘 중국 요리 배우는 중이에요."
        },
        "frames": [
          "zh-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "真的吗？下次我教你做这个鱼。",
        "gloss": {
          "en": "Really? Next time I'll teach you how to make this fish.",
          "ko": "정말요? 다음에 이 생선 요리 가르쳐 줄게요."
        }
      },
      {
        "who": "me",
        "text": "太好了，麻烦您了！",
        "gloss": {
          "en": "Wonderful, thank you so much!",
          "ko": "좋아요, 감사합니다!"
        }
      }
    ]
  },
  {
    "id": "zh-3-b04",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Arriving late to a work meeting",
      "ko": "회의에 늦게 도착함"
    },
    "expressions": [
      "麻烦你了"
    ],
    "grammar": [
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "你怎么才来？会议已经开始了。",
        "gloss": {
          "en": "Why are you only arriving now? The meeting has already started.",
          "ko": "왜 이제 와요? 회의 벌써 시작했어요."
        }
      },
      {
        "who": "me",
        "text": "对不起，因为堵车，所以我来晚了。",
        "gloss": {
          "en": "Sorry, I'm late because of the traffic.",
          "ko": "죄송해요, 차가 막혀서 늦었어요."
        },
        "frames": [
          "zh-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "没关系。他们正在讨论新的计划。",
        "gloss": {
          "en": "It's OK. They're discussing the new plan.",
          "ko": "괜찮아요. 지금 새 계획을 이야기하고 있어요."
        }
      },
      {
        "who": "me",
        "text": "现在看资料还来得及吗？",
        "gloss": {
          "en": "Is there still time to read the documents now?",
          "ko": "지금 자료 봐도 늦지 않을까요?"
        },
        "frames": [
          "zh-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "来得及。你先看看这份资料。",
        "gloss": {
          "en": "There's time. Have a look at this document first.",
          "ko": "괜찮아요. 우선 이 자료부터 봐요."
        }
      },
      {
        "who": "me",
        "text": "好的。可是我看不清屏幕上的字。",
        "gloss": {
          "en": "OK. But I can't see the writing on the screen clearly.",
          "ko": "알겠어요. 그런데 화면 글자가 잘 안 보여요."
        },
        "frames": [
          "zh-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "那你坐到前面来吧。",
        "gloss": {
          "en": "Then come and sit at the front.",
          "ko": "그럼 앞쪽으로 와서 앉아요."
        }
      },
      {
        "who": "me",
        "text": "好，谢谢。麻烦你了。",
        "gloss": {
          "en": "OK, thanks. Sorry for the trouble.",
          "ko": "네, 고마워요. 번거롭게 해서 미안해요."
        }
      }
    ]
  },
  {
    "id": "zh-3-b05",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Lost room key card at a hotel",
      "ko": "호텔에서 방 카드키 잃어버림"
    },
    "expressions": [
      "怎么办",
      "麻烦你了",
      "不好意思",
      "听说"
    ],
    "grammar": [
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "您好，有什么可以帮您？",
        "gloss": {
          "en": "Hello, how can I help you?",
          "ko": "안녕하세요, 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "不好意思，我把房卡弄丢了。",
        "gloss": {
          "en": "Sorry, I've lost my room card.",
          "ko": "죄송해요, 방 카드키를 잃어버렸어요."
        },
        "frames": [
          "zh-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "没关系，请问您的房间号是多少？",
        "gloss": {
          "en": "No problem. What's your room number?",
          "ko": "괜찮아요. 방 번호가 어떻게 되세요?"
        }
      },
      {
        "who": "me",
        "text": "八零六。请把新的房卡给我。",
        "gloss": {
          "en": "Eight-oh-six. Please give me a new room card.",
          "ko": "팔백육 호요. 새 카드키 주세요."
        },
        "frames": [
          "zh-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "好的，请给我看一下您的护照。",
        "gloss": {
          "en": "Sure, please show me your passport.",
          "ko": "네, 여권 좀 보여 주세요."
        }
      },
      {
        "who": "me",
        "text": "护照在房间里……听说没有护照不能办。怎么办？",
        "gloss": {
          "en": "My passport is in the room... I heard you can't do it without a passport. What should I do?",
          "ko": "여권이 방에 있는데… 여권 없으면 안 된다고 들었어요. 어떡하죠?"
        },
        "frames": [
          "zh-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "别担心，我让服务员带您上去拿。",
        "gloss": {
          "en": "Don't worry, I'll have a staff member take you up to get it.",
          "ko": "걱정 마세요, 직원이 같이 올라가서 가져오게 할게요."
        }
      },
      {
        "who": "me",
        "text": "好的，麻烦你了。",
        "gloss": {
          "en": "OK, thank you for your trouble.",
          "ko": "네, 번거롭게 해서 죄송해요."
        }
      }
    ]
  },
  {
    "id": "zh-3-b06",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Language exchange at a café",
      "ko": "카페에서 언어 교환"
    },
    "expressions": [
      "听说"
    ],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好！我们今天先说中文还是韩语？",
        "gloss": {
          "en": "Hi! Shall we speak Chinese or Korean first today?",
          "ko": "안녕하세요! 오늘은 중국어부터 할까요, 한국어부터 할까요?"
        }
      },
      {
        "who": "me",
        "text": "先说中文吧。你韩语说得真好。",
        "gloss": {
          "en": "Chinese first. You speak Korean really well.",
          "ko": "중국어부터 해요. 한국어 정말 잘하시네요."
        },
        "frames": [
          "zh-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "哪里哪里，我学了三年了。你呢？",
        "gloss": {
          "en": "Not really, I've been learning for three years. And you?",
          "ko": "별말씀을요, 삼 년 배웠어요. 당신은요?"
        }
      },
      {
        "who": "me",
        "text": "一年多。我们老师人很好，可是他说得很快。",
        "gloss": {
          "en": "A bit over a year. Our teacher is very nice, but he speaks very fast.",
          "ko": "일 년 좀 넘었어요. 선생님은 좋으신데 말이 너무 빨라요."
        },
        "frames": [
          "zh-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "慢慢来。你最近忙吗？",
        "gloss": {
          "en": "Take your time. Are you busy these days?",
          "ko": "천천히 하면 돼요. 요즘 바빠요?"
        }
      },
      {
        "who": "me",
        "text": "很忙，我正在准备考试呢。",
        "gloss": {
          "en": "Very busy. I'm preparing for an exam right now.",
          "ko": "많이 바빠요. 지금 시험 준비 중이에요."
        },
        "frames": [
          "zh-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "什么考试？汉语水平考试吗？",
        "gloss": {
          "en": "What exam? The Chinese proficiency test?",
          "ko": "무슨 시험요? 중국어 능력 시험이요?"
        }
      },
      {
        "who": "me",
        "text": "对。听说今年的考试比去年难。",
        "gloss": {
          "en": "Yes. I heard this year's exam is harder than last year's.",
          "ko": "네. 올해 시험이 작년보다 어렵다고 들었어요."
        },
        "frames": [
          "zh-f3-17"
        ]
      }
    ]
  },
  {
    "id": "zh-3-b07",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Choosing a winter coat at a store",
      "ko": "가게에서 겨울 코트 고르기"
    },
    "expressions": [
      "说实话",
      "越来越"
    ],
    "grammar": [
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "这两件大衣都是新到的，你喜欢哪件？",
        "gloss": {
          "en": "Both of these coats just came in. Which one do you like?",
          "ko": "이 코트 둘 다 새로 들어왔어요. 어느 게 마음에 들어요?"
        }
      },
      {
        "who": "me",
        "text": "我摸了一下，这个比那个厚。",
        "gloss": {
          "en": "I felt them. This one is thicker than that one.",
          "ko": "만져 보니까 이게 저것보다 두껍네요."
        },
        "frames": [
          "zh-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "对，可是厚的这件贵两百块。",
        "gloss": {
          "en": "Right, but the thick one costs two hundred more.",
          "ko": "맞아요, 그런데 두꺼운 건 이백 위안 더 비싸요."
        }
      },
      {
        "who": "me",
        "text": "说实话，我觉得有点儿贵。",
        "gloss": {
          "en": "To be honest, I think it's a bit expensive.",
          "ko": "솔직히 좀 비싼 것 같아요."
        },
        "frames": [
          "zh-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "那件薄的也很暖和，而且便宜。",
        "gloss": {
          "en": "The thin one is warm too, and it's cheaper.",
          "ko": "얇은 것도 따뜻하고 더 싸요."
        }
      },
      {
        "who": "me",
        "text": "现在越来越冷了。我还是买厚的吧。",
        "gloss": {
          "en": "It's getting colder and colder. I'll go with the thick one.",
          "ko": "요즘 점점 추워지네요. 그래도 두꺼운 걸로 살게요."
        },
        "frames": [
          "zh-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "好的，我帮您包起来。",
        "gloss": {
          "en": "OK, I'll wrap it up for you.",
          "ko": "네, 포장해 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "谢谢。能便宜一点儿吗？",
        "gloss": {
          "en": "Thanks. Could you make it a bit cheaper?",
          "ko": "고마워요. 조금 깎아 줄 수 있어요?"
        }
      }
    ]
  },
  {
    "id": "zh-3-b08",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Skipping lunch to finish a report",
      "ko": "보고서 때문에 점심 미루기"
    },
    "expressions": [
      "随便",
      "你说得对"
    ],
    "grammar": [
      2,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "走吧，一起去吃午饭！",
        "gloss": {
          "en": "Come on, let's go to lunch!",
          "ko": "가요, 같이 점심 먹으러!"
        }
      },
      {
        "who": "me",
        "text": "你们先去吧，我还没做完。",
        "gloss": {
          "en": "You go ahead. I haven't finished yet.",
          "ko": "먼저 가요, 저는 아직 다 못 했어요."
        },
        "frames": [
          "zh-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "什么还没做完？报告吗？",
        "gloss": {
          "en": "What haven't you finished? The report?",
          "ko": "뭘 아직 못 끝냈어요? 보고서요?"
        }
      },
      {
        "who": "me",
        "text": "对，经理下午要看。我正在写最后一部分呢。",
        "gloss": {
          "en": "Yes, the manager wants to see it this afternoon. I'm writing the last part right now.",
          "ko": "네, 팀장님이 오후에 보신대요. 지금 마지막 부분 쓰는 중이에요."
        },
        "frames": [
          "zh-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "那我给你带点儿吃的回来吧？",
        "gloss": {
          "en": "Shall I bring you back something to eat?",
          "ko": "그럼 먹을 거 좀 사다 줄까요?"
        }
      },
      {
        "who": "me",
        "text": "太好了！随便，什么都可以。",
        "gloss": {
          "en": "Great! Anything's fine.",
          "ko": "좋아요! 아무거나 괜찮아요."
        }
      },
      {
        "who": "them",
        "text": "好。对了，听说经理今天心情不好，你最好早点儿交。",
        "gloss": {
          "en": "OK. Oh, and I heard the manager's in a bad mood today, so you'd better hand it in early.",
          "ko": "알겠어요. 참, 팀장님 오늘 기분 안 좋으시대요. 일찍 내는 게 좋겠어요."
        }
      },
      {
        "who": "me",
        "text": "你说得对，我现在就继续写。",
        "gloss": {
          "en": "You're right. I'll keep writing right now.",
          "ko": "맞아요, 지금 바로 계속 쓸게요."
        },
        "frames": [
          "zh-f3-16"
        ]
      }
    ]
  },
  {
    "id": "zh-3-b09",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Subway lost and found",
      "ko": "지하철 분실물 센터"
    },
    "expressions": [
      "说实话"
    ],
    "grammar": [
      1,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "您好，丢了什么东西？",
        "gloss": {
          "en": "Hello, what did you lose?",
          "ko": "안녕하세요, 뭘 잃어버리셨어요?"
        }
      },
      {
        "who": "me",
        "text": "我把钱包弄丢了。可能在地铁上。",
        "gloss": {
          "en": "I've lost my wallet. It might be on the subway.",
          "ko": "지갑을 잃어버렸어요. 지하철에 두고 내린 것 같아요."
        },
        "frames": [
          "zh-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "是什么样的钱包？",
        "gloss": {
          "en": "What does the wallet look like?",
          "ko": "어떤 지갑이에요?"
        }
      },
      {
        "who": "me",
        "text": "黑色的，里面有我的银行卡。",
        "gloss": {
          "en": "It's black, and my bank card is in it.",
          "ko": "검은색이고, 안에 은행 카드가 있어요."
        }
      },
      {
        "who": "them",
        "text": "我们这儿有两个黑色的，请看一下。",
        "gloss": {
          "en": "We have two black ones here. Please take a look.",
          "ko": "여기 검은색이 두 개 있어요. 한번 보세요."
        }
      },
      {
        "who": "me",
        "text": "这个比那个大。我的是小的那个。",
        "gloss": {
          "en": "This one is bigger than that one. Mine is the small one.",
          "ko": "이게 저것보다 크네요. 제 건 작은 거예요."
        },
        "frames": [
          "zh-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "好，请检查一下里面的东西。",
        "gloss": {
          "en": "OK, please check what's inside.",
          "ko": "네, 안에 있는 거 확인해 보세요."
        }
      },
      {
        "who": "me",
        "text": "都在！说实话，我觉得今天运气真好。",
        "gloss": {
          "en": "Everything's here! To be honest, I think I'm really lucky today.",
          "ko": "다 있어요! 솔직히 오늘 운이 정말 좋은 것 같아요."
        },
        "frames": [
          "zh-f3-15"
        ]
      }
    ]
  },
  {
    "id": "zh-3-b10",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Flight delay at the check-in counter",
      "ko": "체크인 카운터에서 항공편 지연"
    },
    "expressions": [
      "怎么办",
      "麻烦你了",
      "听说"
    ],
    "grammar": [
      5,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "您好，请出示护照。",
        "gloss": {
          "en": "Hello, please show your passport.",
          "ko": "안녕하세요, 여권 보여 주세요."
        }
      },
      {
        "who": "me",
        "text": "给你。听说今天的航班推迟了。",
        "gloss": {
          "en": "Here you are. I heard today's flight is delayed.",
          "ko": "여기요. 오늘 비행기가 지연됐다고 들었어요."
        },
        "frames": [
          "zh-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "是的，因为天气不好，推迟了两个小时。",
        "gloss": {
          "en": "Yes, it's delayed by two hours because of bad weather.",
          "ko": "네, 날씨가 안 좋아서 두 시간 지연됐어요."
        }
      },
      {
        "who": "me",
        "text": "那我转机怎么办？现在改航班还来得及吗？",
        "gloss": {
          "en": "Then what about my connection? Is there still time to change flights now?",
          "ko": "그럼 환승은 어떡해요? 지금 항공편 바꿔도 늦지 않을까요?"
        },
        "frames": [
          "zh-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "还来得及。我帮您改到晚上的航班吧。",
        "gloss": {
          "en": "There's still time. I'll change you to the evening flight.",
          "ko": "아직 괜찮아요. 저녁 비행기로 바꿔 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "太好了。请把新的登机牌给我。",
        "gloss": {
          "en": "Great. Please give me the new boarding pass.",
          "ko": "잘됐네요. 새 탑승권 주세요."
        },
        "frames": [
          "zh-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "好的，这是您的登机牌，十八号登机口。",
        "gloss": {
          "en": "Here's your boarding pass. Gate eighteen.",
          "ko": "네, 탑승권 여기 있어요. 십팔 번 게이트예요."
        }
      },
      {
        "who": "me",
        "text": "谢谢，麻烦你了。",
        "gloss": {
          "en": "Thanks, sorry for the trouble.",
          "ko": "고마워요, 수고하셨어요."
        }
      }
    ]
  },
  {
    "id": "zh-3-b11",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A taxi ride in Shanghai",
      "ko": "상하이에서 택시 타기"
    },
    "expressions": [
      "我的意思是",
      "不好意思",
      "我去过"
    ],
    "grammar": [
      0,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "去哪儿？",
        "gloss": {
          "en": "Where to?",
          "ko": "어디 가세요?"
        }
      },
      {
        "who": "me",
        "text": "去人民公园。不好意思，我的意思是人民广场。",
        "gloss": {
          "en": "To People's Park. Sorry, what I mean is People's Square.",
          "ko": "인민공원요. 아, 죄송해요, 제 말은 인민광장이요."
        },
        "frames": [
          "zh-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "好嘞。你是第一次来上海吗？",
        "gloss": {
          "en": "Got it. Is this your first time in Shanghai?",
          "ko": "네. 상하이는 처음이에요?"
        }
      },
      {
        "who": "me",
        "text": "不是，我去过两次了。",
        "gloss": {
          "en": "No, I've been here twice.",
          "ko": "아니요, 두 번 와 봤어요."
        },
        "frames": [
          "zh-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "现在上海变化很大，新路越来越多，地铁也越来越方便……",
        "gloss": {
          "en": "Shanghai's changing a lot. More and more new roads, and the subway keeps getting more convenient...",
          "ko": "요즘 상하이가 많이 변했어요. 새 길도 점점 많아지고 지하철도 점점 편해지고…"
        }
      },
      {
        "who": "me",
        "text": "不好意思，您说得太快了，请慢点儿说。",
        "gloss": {
          "en": "Sorry, you're speaking too fast. Please speak more slowly.",
          "ko": "죄송해요, 너무 빨리 말씀하세요. 천천히 말해 주세요."
        }
      },
      {
        "who": "them",
        "text": "好，我慢点儿说。你看，前面就是人民广场。",
        "gloss": {
          "en": "OK, I'll slow down. Look, People's Square is just ahead.",
          "ko": "네, 천천히 할게요. 보세요, 앞이 바로 인민광장이에요."
        }
      },
      {
        "who": "me",
        "text": "好的。请把发票给我。",
        "gloss": {
          "en": "OK. Please give me the receipt.",
          "ko": "네. 영수증 주세요."
        },
        "frames": [
          "zh-f3-10"
        ]
      }
    ]
  },
  {
    "id": "zh-3-b12",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Weather small talk with a neighbor",
      "ko": "이웃과 날씨 이야기"
    },
    "expressions": [
      "听说",
      "越来越",
      "你说得对"
    ],
    "grammar": [
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "今天真冷啊！",
        "gloss": {
          "en": "It's really cold today!",
          "ko": "오늘 정말 춥네요!"
        }
      },
      {
        "who": "me",
        "text": "是啊，现在越来越冷了。",
        "gloss": {
          "en": "Yes, it's getting colder and colder.",
          "ko": "그러게요, 요즘 점점 추워져요."
        },
        "frames": [
          "zh-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "听说明天会下雪。",
        "gloss": {
          "en": "I heard it's going to snow tomorrow.",
          "ko": "내일 눈 온대요."
        }
      },
      {
        "who": "me",
        "text": "真的吗？我还没见过这儿下雪。",
        "gloss": {
          "en": "Really? I've never seen it snow here.",
          "ko": "정말요? 여기서 눈 오는 건 아직 못 봤어요."
        }
      },
      {
        "who": "them",
        "text": "下雪的时候路很滑，你要小心。",
        "gloss": {
          "en": "The roads get slippery when it snows, so be careful.",
          "ko": "눈 오면 길이 미끄러우니까 조심해요."
        }
      },
      {
        "who": "me",
        "text": "你说得对，我明天坐地铁去上班。",
        "gloss": {
          "en": "You're right. I'll take the subway to work tomorrow.",
          "ko": "맞아요, 내일은 지하철 타고 출근할게요."
        },
        "frames": [
          "zh-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "对了，你有厚衣服吗？",
        "gloss": {
          "en": "Oh, do you have warm clothes?",
          "ko": "참, 두꺼운 옷 있어요?"
        }
      },
      {
        "who": "me",
        "text": "有。听说商场正在打折。我想再买一件。",
        "gloss": {
          "en": "I do. I heard the mall is having a sale. I'd like to buy another one.",
          "ko": "있어요. 쇼핑몰에서 세일한다고 들었어요. 하나 더 사고 싶어요."
        },
        "frames": [
          "zh-f3-17"
        ]
      }
    ]
  },
  {
    "id": "zh-3-b13",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Trying snacks on a food street",
      "ko": "먹자골목에서 간식 먹기"
    },
    "expressions": [
      "说实话",
      "没想到"
    ],
    "grammar": [
      0,
      2,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "这条街的小吃特别有名。你吃过臭豆腐吗？",
        "gloss": {
          "en": "The snacks on this street are famous. Have you ever had stinky tofu?",
          "ko": "이 거리 간식이 아주 유명해요. 취두부 먹어 봤어요?"
        }
      },
      {
        "who": "me",
        "text": "没吃过。你吃过煎饼吗？",
        "gloss": {
          "en": "No. Have you ever had jianbing?",
          "ko": "안 먹어 봤어요. 젠빙은 먹어 봤어요?"
        },
        "frames": [
          "zh-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "吃过，我早饭常常吃。我们先吃臭豆腐吧！",
        "gloss": {
          "en": "Yes, I often have it for breakfast. Let's try stinky tofu first!",
          "ko": "먹어 봤죠, 아침으로 자주 먹어요. 우리 취두부부터 먹어요!"
        }
      },
      {
        "who": "me",
        "text": "说实话，我觉得它的味道有点儿奇怪。",
        "gloss": {
          "en": "To be honest, I think it smells a bit strange.",
          "ko": "솔직히 냄새가 좀 이상한 것 같아요."
        },
        "frames": [
          "zh-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "闻着臭，吃着香。你试试！",
        "gloss": {
          "en": "It smells bad but tastes great. Try it!",
          "ko": "냄새는 고약해도 맛은 좋아요. 먹어 봐요!"
        }
      },
      {
        "who": "me",
        "text": "嗯……没想到这么好吃！",
        "gloss": {
          "en": "Hmm... I didn't expect it to be this good!",
          "ko": "음… 이렇게 맛있을 줄 몰랐어요!"
        }
      },
      {
        "who": "them",
        "text": "我说得对吧？再来一份？",
        "gloss": {
          "en": "Told you! Another portion?",
          "ko": "제 말이 맞죠? 하나 더 시킬까요?"
        }
      },
      {
        "who": "me",
        "text": "不用了，我吃不了这么多。",
        "gloss": {
          "en": "No thanks, I can't eat this much.",
          "ko": "괜찮아요, 이렇게 많이는 못 먹어요."
        },
        "frames": [
          "zh-f3-13"
        ]
      }
    ]
  },
  {
    "id": "zh-3-b14",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A phone call during a meeting",
      "ko": "회의 중에 걸려 온 전화"
    },
    "expressions": [
      "不好意思",
      "听说"
    ],
    "grammar": [
      2,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "喂，你现在方便说话吗？",
        "gloss": {
          "en": "Hello, is now a good time to talk?",
          "ko": "여보세요, 지금 통화 괜찮아요?"
        }
      },
      {
        "who": "me",
        "text": "不好意思，我正在开会呢。",
        "gloss": {
          "en": "Sorry, I'm in a meeting right now.",
          "ko": "죄송해요, 지금 회의 중이에요."
        },
        "frames": [
          "zh-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "好，那你什么时候有空？",
        "gloss": {
          "en": "OK, when will you be free?",
          "ko": "알겠어요, 그럼 언제 시간 돼요?"
        }
      },
      {
        "who": "me",
        "text": "一个小时以后吧。报告我还没写完。",
        "gloss": {
          "en": "In about an hour. I haven't finished writing the report yet.",
          "ko": "한 시간 뒤쯤요. 보고서를 아직 다 못 썼어요."
        },
        "frames": [
          "zh-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "好。对了，明天的饭局你能来吗？",
        "gloss": {
          "en": "OK. By the way, can you come to the dinner tomorrow?",
          "ko": "알겠어요. 참, 내일 회식 올 수 있어요?"
        }
      },
      {
        "who": "me",
        "text": "能去。听说那家餐厅很有名。",
        "gloss": {
          "en": "Yes, I can. I heard that restaurant is famous.",
          "ko": "갈 수 있어요. 그 식당 유명하다고 들었어요."
        },
        "frames": [
          "zh-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "对，菜特别好吃。那我们明天见。",
        "gloss": {
          "en": "Yes, the food is great. See you tomorrow, then.",
          "ko": "네, 음식이 정말 맛있어요. 그럼 내일 봐요."
        }
      },
      {
        "who": "me",
        "text": "好，明天见。",
        "gloss": {
          "en": "OK, see you tomorrow.",
          "ko": "네, 내일 봐요."
        },
        "frames": [
          "zh-f1-20"
        ]
      }
    ]
  },
  {
    "id": "zh-3-b15",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Ordering from a wall menu",
      "ko": "벽에 걸린 메뉴로 주문하기"
    },
    "expressions": [
      "我的意思是",
      "不好意思",
      "对了"
    ],
    "grammar": [
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "您好，菜单在墙上，想吃什么？",
        "gloss": {
          "en": "Hello, the menu is on the wall. What would you like?",
          "ko": "안녕하세요, 메뉴는 벽에 있어요. 뭐 드시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "不好意思，我看不清上面的字。",
        "gloss": {
          "en": "Sorry, I can't see the writing up there clearly.",
          "ko": "죄송해요, 위에 있는 글자가 잘 안 보여요."
        },
        "frames": [
          "zh-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "没关系，我给您拿一份纸的菜单。",
        "gloss": {
          "en": "No problem, I'll get you a paper menu.",
          "ko": "괜찮아요, 종이 메뉴 갖다 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "谢谢。你推荐什么？",
        "gloss": {
          "en": "Thanks. What do you recommend?",
          "ko": "고마워요. 뭐가 맛있어요?"
        }
      },
      {
        "who": "them",
        "text": "我们的红烧肉最有名，而且比别的店便宜。",
        "gloss": {
          "en": "Our braised pork is the most famous, and it's cheaper than elsewhere.",
          "ko": "저희 홍소육이 제일 유명하고 다른 가게보다 싸요."
        }
      },
      {
        "who": "me",
        "text": "好，就要红烧肉。请把筷子给我。",
        "gloss": {
          "en": "OK, I'll have the braised pork. Please give me some chopsticks.",
          "ko": "좋아요, 홍소육으로 할게요. 젓가락 주세요."
        },
        "frames": [
          "zh-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "好的，马上来。",
        "gloss": {
          "en": "Sure, coming right up.",
          "ko": "네, 바로 나와요."
        }
      },
      {
        "who": "me",
        "text": "对了，我的意思是要一小份。",
        "gloss": {
          "en": "Oh, what I mean is a small portion.",
          "ko": "아, 제 말은 작은 걸로 달라는 거예요."
        },
        "frames": [
          "zh-f3-19"
        ]
      }
    ]
  },
  {
    "id": "zh-3-b16",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Rushing to catch a train with a friend",
      "ko": "친구와 기차 시간 맞추기"
    },
    "expressions": [
      "你说得对"
    ],
    "grammar": [
      2,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "我们去杭州，坐高铁比坐飞机方便。",
        "gloss": {
          "en": "We're going to Hangzhou. The high-speed train is more convenient than flying.",
          "ko": "항저우 가는 거면 비행기보다 고속철도가 편해요."
        }
      },
      {
        "who": "me",
        "text": "你说得对，高铁站离我们家很近。",
        "gloss": {
          "en": "You're right. The station is close to our place.",
          "ko": "맞아요, 고속철도역이 우리 집에서 가까워요."
        },
        "frames": [
          "zh-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "下午三点的车，现在已经两点了。",
        "gloss": {
          "en": "The train is at three, and it's already two.",
          "ko": "기차가 오후 세 시인데 벌써 두 시예요."
        }
      },
      {
        "who": "me",
        "text": "现在出发还来得及吗？",
        "gloss": {
          "en": "Is there still time if we leave now?",
          "ko": "지금 출발해도 늦지 않을까요?"
        },
        "frames": [
          "zh-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "打车的话来得及，坐地铁可能来不及了。",
        "gloss": {
          "en": "By taxi we'll make it; by subway we might not.",
          "ko": "택시 타면 괜찮은데, 지하철은 늦을 수도 있어요."
        }
      },
      {
        "who": "me",
        "text": "那我们打车吧。等一下，我还没收拾完。",
        "gloss": {
          "en": "Then let's take a taxi. Wait, I haven't finished packing.",
          "ko": "그럼 택시 타요. 잠깐만요, 아직 짐 다 못 쌌어요."
        },
        "frames": [
          "zh-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "快点儿！我在楼下等你。",
        "gloss": {
          "en": "Hurry up! I'll wait for you downstairs.",
          "ko": "빨리요! 아래층에서 기다릴게요."
        }
      },
      {
        "who": "me",
        "text": "好，马上下来！",
        "gloss": {
          "en": "OK, coming right down!",
          "ko": "네, 금방 내려갈게요!"
        }
      }
    ]
  },
  {
    "id": "zh-3-b17",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Talking about a TV drama with a classmate",
      "ko": "같은 반 친구와 드라마 이야기"
    },
    "expressions": [
      "说实话",
      "我的意思是",
      "你说得对"
    ],
    "grammar": [
      1,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "你看了那个新电视剧吗？大家都说很好看。",
        "gloss": {
          "en": "Have you watched that new drama? Everyone says it's great.",
          "ko": "그 새 드라마 봤어요? 다들 재밌대요."
        }
      },
      {
        "who": "me",
        "text": "看了。说实话，我觉得没有那么好看。",
        "gloss": {
          "en": "I did. To be honest, I don't think it's that good.",
          "ko": "봤어요. 솔직히 그렇게 재밌진 않은 것 같아요."
        },
        "frames": [
          "zh-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "为什么？我觉得故事很有意思。",
        "gloss": {
          "en": "Why? I think the story is really interesting.",
          "ko": "왜요? 저는 이야기가 재밌던데요."
        }
      },
      {
        "who": "me",
        "text": "故事不错。我的意思是演员演得不太好。",
        "gloss": {
          "en": "The story is fine. What I mean is the acting isn't great.",
          "ko": "이야기는 괜찮아요. 제 말은 배우들 연기가 별로라는 거예요."
        },
        "frames": [
          "zh-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "那倒也是。男主角说话太快了。",
        "gloss": {
          "en": "That's true. The male lead talks too fast.",
          "ko": "그건 그래요. 남자 주인공이 말을 너무 빨리 해요."
        }
      },
      {
        "who": "me",
        "text": "对，他说得很快。我常常听不清。",
        "gloss": {
          "en": "Yes, he speaks very fast. I often can't catch what he says.",
          "ko": "맞아요, 말이 너무 빨라요. 자주 잘 못 알아들어요."
        },
        "frames": [
          "zh-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "你可以开中文字幕。",
        "gloss": {
          "en": "You could turn on Chinese subtitles.",
          "ko": "중국어 자막 켜면 돼요."
        }
      },
      {
        "who": "me",
        "text": "你说得对，下次我开字幕看。",
        "gloss": {
          "en": "You're right. Next time I'll watch with subtitles.",
          "ko": "맞아요, 다음엔 자막 켜고 볼게요."
        },
        "frames": [
          "zh-f3-16"
        ]
      }
    ]
  },
  {
    "id": "zh-3-b18",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A school sports day",
      "ko": "학교 운동회"
    },
    "expressions": [
      "听说",
      "怪不得"
    ],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "你看，那个穿红衣服的是我儿子。",
        "gloss": {
          "en": "Look, the one in red is my son.",
          "ko": "보세요, 빨간 옷 입은 애가 우리 아들이에요."
        }
      },
      {
        "who": "me",
        "text": "哇，他跑得很快。",
        "gloss": {
          "en": "Wow, he runs really fast.",
          "ko": "와, 정말 빨리 달리네요."
        },
        "frames": [
          "zh-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "是啊，他每天早上都跑步。",
        "gloss": {
          "en": "Yes, he runs every morning.",
          "ko": "네, 매일 아침 달리기를 해요."
        }
      },
      {
        "who": "me",
        "text": "怪不得。我上学的时候也常常跑步。",
        "gloss": {
          "en": "No wonder. I used to run a lot when I was at school too.",
          "ko": "어쩐지요. 저도 학교 다닐 때 자주 달렸어요."
        }
      },
      {
        "who": "them",
        "text": "你现在还跑吗？",
        "gloss": {
          "en": "Do you still run now?",
          "ko": "지금도 달려요?"
        }
      },
      {
        "who": "me",
        "text": "很少了。我正在学游泳呢。",
        "gloss": {
          "en": "Not much. I'm learning to swim these days.",
          "ko": "거의 안 해요. 요즘은 수영 배우는 중이에요."
        },
        "frames": [
          "zh-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "游泳也很好。我也想学。",
        "gloss": {
          "en": "Swimming is great too. I want to learn as well.",
          "ko": "수영도 좋죠. 저도 배우고 싶어요."
        }
      },
      {
        "who": "me",
        "text": "那我们一起去吧！听说附近新开了一个游泳馆。",
        "gloss": {
          "en": "Then let's go together! I heard a new swimming pool opened nearby.",
          "ko": "그럼 같이 가요! 근처에 수영장이 새로 생겼대요."
        },
        "frames": [
          "zh-f3-17"
        ]
      }
    ]
  },
  {
    "id": "zh-3-b19",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Viewing an apartment with an agent",
      "ko": "중개인과 집 보기"
    },
    "expressions": [
      "说实话",
      "看情况"
    ],
    "grammar": [
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "这套房子怎么样？离地铁站很近。",
        "gloss": {
          "en": "How about this apartment? It's close to the subway station.",
          "ko": "이 집 어때요? 지하철역에서 가까워요."
        }
      },
      {
        "who": "me",
        "text": "不错。可是这个没有那个那么大。",
        "gloss": {
          "en": "Not bad. But this one isn't as big as that one.",
          "ko": "괜찮네요. 그런데 이건 아까 그것만큼 넓지 않아요."
        },
        "frames": [
          "zh-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "对，刚才那套大一点儿，可是贵一千块。",
        "gloss": {
          "en": "Right, the last one was a bit bigger, but a thousand yuan more.",
          "ko": "맞아요, 아까 집이 좀 더 넓지만 천 위안 더 비싸요."
        }
      },
      {
        "who": "me",
        "text": "那这个比那个便宜很多。",
        "gloss": {
          "en": "So this one is a lot cheaper than that one.",
          "ko": "그럼 이게 그것보다 훨씬 싸네요."
        },
        "frames": [
          "zh-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "是啊，而且这儿很安静。",
        "gloss": {
          "en": "Yes, and it's very quiet here.",
          "ko": "네, 게다가 여긴 아주 조용해요."
        }
      },
      {
        "who": "me",
        "text": "说实话，我觉得安静最重要。",
        "gloss": {
          "en": "To be honest, I think quiet matters most.",
          "ko": "솔직히 조용한 게 제일 중요한 것 같아요."
        },
        "frames": [
          "zh-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "那您今天就决定吗？",
        "gloss": {
          "en": "Will you decide today, then?",
          "ko": "그럼 오늘 바로 결정하시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "看情况吧，我想再想一想。",
        "gloss": {
          "en": "We'll see. I'd like to think it over.",
          "ko": "상황 봐서요, 좀 더 생각해 볼게요."
        }
      }
    ]
  },
  {
    "id": "zh-3-b20",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Arriving late to a friend's dinner party",
      "ko": "친구 저녁 모임에 늦게 도착함"
    },
    "expressions": [
      "不好意思",
      "我去过"
    ],
    "grammar": [
      0,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "你终于来了！大家都在等你。",
        "gloss": {
          "en": "You're finally here! Everyone's been waiting for you.",
          "ko": "드디어 왔네요! 다들 기다리고 있었어요."
        }
      },
      {
        "who": "me",
        "text": "不好意思，因为下雨，所以我来晚了。",
        "gloss": {
          "en": "Sorry, I'm late because of the rain.",
          "ko": "미안해요, 비가 와서 늦었어요."
        },
        "frames": [
          "zh-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "没事。来，这是我的朋友小林，她是日本人。",
        "gloss": {
          "en": "No worries. Come, this is my friend Xiao Lin. She's Japanese.",
          "ko": "괜찮아요. 이리 와요, 제 친구 샤오린이에요. 일본 사람이에요."
        }
      },
      {
        "who": "me",
        "text": "你好！你中文说得真好。",
        "gloss": {
          "en": "Hi! You speak Chinese really well.",
          "ko": "안녕하세요! 중국어 정말 잘하시네요."
        },
        "frames": [
          "zh-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "谢谢，我在中国住了五年了。你去过日本吗？",
        "gloss": {
          "en": "Thanks, I've lived in China for five years. Have you been to Japan?",
          "ko": "고마워요, 중국에서 오 년 살았어요. 일본에 가 봤어요?"
        }
      },
      {
        "who": "me",
        "text": "我去过东京。很喜欢那儿。",
        "gloss": {
          "en": "I've been to Tokyo. I really liked it.",
          "ko": "도쿄에 가 봤어요. 거기 정말 좋았어요."
        },
        "frames": [
          "zh-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "下次你来日本，我带你玩儿！",
        "gloss": {
          "en": "Next time you come to Japan, I'll show you around!",
          "ko": "다음에 일본 오면 제가 구경시켜 줄게요!"
        }
      },
      {
        "who": "me",
        "text": "太好了，我们说定了！",
        "gloss": {
          "en": "Great, it's a deal!",
          "ko": "좋아요, 약속한 거예요!"
        }
      }
    ]
  }
];
