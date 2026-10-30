import type { StageScript } from "../stageScripts.ts";

/** vi 단계 대본(curriculum/stageScripts.ts) — 상황 대본 + 표현·문법 대본(x), 1~5단계 내 줄에 틀 태그. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
export const VI: StageScript[] = [
  {
    "id": "vi-1-1",
    "name": {
      "text": [
        "Min-ho"
      ],
      "en": [
        "Min-ho"
      ],
      "ko": [
        "민호"
      ]
    },
    "stage": 1,
    "situation": 0,
    "setting": {
      "en": "First day at a language centre: meeting Linh, a new classmate",
      "ko": "어학원 첫날, 새 반 친구 린을 만나다"
    },
    "expressions": [
      "xin chào",
      "rất vui được gặp",
      "tôi là người Hàn Quốc",
      "vâng",
      "tôi không hiểu"
    ],
    "grammar": [
      0,
      1,
      3,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Xin chào! Tôi là Linh. Bạn tên là gì?",
        "gloss": {
          "en": "Hello! I'm Linh. What's your name?",
          "ko": "안녕하세요! 저는 린이에요. 이름이 뭐예요?"
        }
      },
      {
        "who": "me",
        "text": "Xin chào. Tôi là Min-ho. Rất vui được gặp bạn.",
        "gloss": {
          "en": "Hello. I'm Min-ho. Nice to meet you.",
          "ko": "안녕하세요. 저는 민호예요. 만나서 반가워요."
        },
        "frames": [
          "vi-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "Rất vui được gặp bạn. Bạn là người nước nào?",
        "gloss": {
          "en": "Nice to meet you. Where are you from?",
          "ko": "만나서 반가워요. 어느 나라 사람이에요?"
        }
      },
      {
        "who": "me",
        "text": "Tôi là người Hàn Quốc. Còn bạn?",
        "gloss": {
          "en": "I'm Korean. And you?",
          "ko": "저는 한국 사람이에요. 당신은요?"
        },
        "frames": [
          "vi-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "Tôi là người Việt Nam. Bạn ở đâu?",
        "gloss": {
          "en": "I'm Vietnamese. Where do you live?",
          "ko": "저는 베트남 사람이에요. 어디 살아요?"
        }
      },
      {
        "who": "me",
        "text": "Tôi ở Hà Nội, gần đây.",
        "gloss": {
          "en": "I live in Hanoi, near here.",
          "ko": "하노이에 살아요, 이 근처예요."
        },
        "frames": [
          "vi-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "Bạn có sách tiếng Việt không?",
        "gloss": {
          "en": "Do you have a Vietnamese textbook?",
          "ko": "베트남어 책 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Vâng, tôi có. Nhưng tôi không hiểu nhiều.",
        "gloss": {
          "en": "Yes, I do. But I don't understand much.",
          "ko": "네, 있어요. 그런데 많이 이해하지는 못해요."
        },
        "frames": [
          "vi-f1-13",
          "vi-f1-11"
        ]
      }
    ]
  },
  {
    "id": "vi-1-2",
    "stage": 1,
    "situation": 1,
    "setting": {
      "en": "Buying mangoes from a woman at a market fruit stall",
      "ko": "시장 과일 노점에서 아주머니에게 망고 사기"
    },
    "expressions": [
      "chào chị",
      "bao nhiêu tiền",
      "đắt quá",
      "cảm ơn",
      "tạm biệt"
    ],
    "grammar": [
      1,
      2,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Chào bạn! Bạn mua gì?",
        "gloss": {
          "en": "Hello! What would you like?",
          "ko": "안녕하세요! 뭐 사실래요?"
        }
      },
      {
        "who": "me",
        "text": "Chào chị. Quả xoài này bao nhiêu tiền?",
        "gloss": {
          "en": "Hello. How much is this mango?",
          "ko": "안녕하세요. 이 망고 얼마예요?"
        },
        "frames": [
          "vi-f1-08",
          "vi-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "Năm mươi nghìn một cân.",
        "gloss": {
          "en": "Fifty thousand a kilo.",
          "ko": "일 킬로에 오만 동이에요."
        }
      },
      {
        "who": "me",
        "text": "Đắt quá! Bốn mươi nghìn, được không?",
        "gloss": {
          "en": "That's too expensive! Forty thousand, is that OK?",
          "ko": "너무 비싸요! 사만 동, 안 될까요?"
        }
      },
      {
        "who": "them",
        "text": "Được. Bạn lấy mấy quả?",
        "gloss": {
          "en": "OK. How many do you want?",
          "ko": "좋아요. 몇 개 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Cho tôi ba quả này. Chị có túi không?",
        "gloss": {
          "en": "I'll take these three. Do you have a bag?",
          "ko": "이거 세 개 주세요. 봉지 있어요?"
        },
        "frames": [
          "vi-f1-10",
          "vi-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Có. Của bạn đây.",
        "gloss": {
          "en": "Yes. Here you go.",
          "ko": "있어요. 여기요."
        }
      },
      {
        "who": "me",
        "text": "Cảm ơn chị. Tạm biệt!",
        "gloss": {
          "en": "Thank you. Goodbye!",
          "ko": "고마워요. 안녕히 계세요!"
        },
        "frames": [
          "vi-f1-15"
        ]
      }
    ]
  },
  {
    "id": "vi-1-3",
    "stage": 1,
    "situation": 2,
    "setting": {
      "en": "Asking a man the way to Hoàn Kiếm Lake in the Old Quarter",
      "ko": "구시가지에서 남자에게 호안끼엠 호수 가는 길 묻기"
    },
    "expressions": [
      "chào anh",
      "xin lỗi",
      "ở đâu",
      "tôi không hiểu",
      "nói chậm thôi",
      "vâng",
      "cảm ơn"
    ],
    "grammar": [
      1,
      2,
      3,
      4,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bạn cần giúp gì không?",
        "gloss": {
          "en": "Do you need any help?",
          "ko": "도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Chào anh. Xin lỗi, Hồ Hoàn Kiếm ở đâu?",
        "gloss": {
          "en": "Hello. Excuse me, where is Hoàn Kiếm Lake?",
          "ko": "안녕하세요. 실례지만, 호안끼엠 호수가 어디예요?"
        },
        "frames": [
          "vi-f1-09",
          "vi-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "Bạn đi thẳng phố Hàng Đào, rồi rẽ phải ở cuối phố.",
        "gloss": {
          "en": "Go straight along Hàng Đào street, then turn right at the end.",
          "ko": "항다오 거리로 쭉 가다가 끝에서 오른쪽으로 가세요."
        }
      },
      {
        "who": "me",
        "text": "Xin lỗi, tôi không hiểu. Anh nói chậm thôi.",
        "gloss": {
          "en": "Sorry, I don't understand. Please speak slowly.",
          "ko": "죄송해요, 못 알아들었어요. 천천히 말해 주세요."
        },
        "frames": [
          "vi-f1-11",
          "vi-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "À, xin lỗi. Đi thẳng... rồi rẽ phải. Khoảng mười phút.",
        "gloss": {
          "en": "Oh, sorry. Go straight... then turn right. About ten minutes.",
          "ko": "아, 미안해요. 쭉 가서... 오른쪽이요. 십 분쯤 걸려요."
        }
      },
      {
        "who": "me",
        "text": "Vâng, cảm ơn anh. Ở đây có nhà vệ sinh không?",
        "gloss": {
          "en": "OK, thank you. Is there a toilet around here?",
          "ko": "네, 고마워요. 여기 화장실 있어요?"
        },
        "frames": [
          "vi-f1-07",
          "vi-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Có, ở kia, cạnh quán cà phê.",
        "gloss": {
          "en": "Yes, over there, next to the café.",
          "ko": "있어요, 저기 카페 옆이에요."
        }
      },
      {
        "who": "me",
        "text": "Cảm ơn anh nhiều.",
        "gloss": {
          "en": "Thank you very much.",
          "ko": "정말 고마워요."
        },
        "frames": [
          "vi-f1-15"
        ]
      }
    ]
  },
  {
    "id": "vi-1-4",
    "stage": 1,
    "situation": 3,
    "setting": {
      "en": "Morning in your apartment block: meeting Hoa, an older neighbour",
      "ko": "아침에 아파트에서 이웃 언니(누나) 호아와 인사하기"
    },
    "expressions": [
      "chào chị",
      "vâng",
      "cảm ơn",
      "hẹn gặp lại"
    ],
    "grammar": [
      1,
      2,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Chào em! Em đi đâu thế?",
        "gloss": {
          "en": "Morning! Where are you off to?",
          "ko": "안녕! 어디 가?"
        }
      },
      {
        "who": "me",
        "text": "Chào chị. Em đi làm ạ. Chị có khỏe không?",
        "gloss": {
          "en": "Morning. I'm going to work. How are you?",
          "ko": "안녕하세요. 출근해요. 잘 지내세요?"
        },
        "frames": [
          "vi-f1-04",
          "vi-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Chị khỏe, cảm ơn em. Đây là con mèo của chị.",
        "gloss": {
          "en": "I'm well, thanks. This is my cat.",
          "ko": "잘 지내, 고마워. 이건 우리 고양이야."
        }
      },
      {
        "who": "me",
        "text": "Ồ, con mèo này đẹp quá!",
        "gloss": {
          "en": "Oh, this cat is so pretty!",
          "ko": "와, 이 고양이 정말 예뻐요!"
        }
      },
      {
        "who": "them",
        "text": "Cảm ơn em. Mà em ở tầng mấy?",
        "gloss": {
          "en": "Thanks. By the way, which floor do you live on?",
          "ko": "고마워. 그런데 몇 층에 살아?"
        }
      },
      {
        "who": "me",
        "text": "Em ở tầng năm.",
        "gloss": {
          "en": "I live on the fifth floor.",
          "ko": "오층에 살아요."
        },
        "frames": [
          "vi-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "Thế à. Hôm nào sang nhà chị uống trà nhé.",
        "gloss": {
          "en": "Oh really. Come over for tea some day.",
          "ko": "그렇구나. 언제 우리 집에 차 마시러 와."
        }
      },
      {
        "who": "me",
        "text": "Vâng, cảm ơn chị. Hẹn gặp lại chị!",
        "gloss": {
          "en": "Yes, thank you. See you again!",
          "ko": "네, 고마워요. 또 봬요!"
        },
        "frames": [
          "vi-f1-16"
        ]
      }
    ]
  },
  {
    "id": "vi-1-x1",
    "stage": 1,
    "setting": {
      "en": "Buying a hat at a souvenir stall",
      "ko": "기념품 노점에서 모자 사기"
    },
    "expressions": [
      "chào anh",
      "cho tôi cái này",
      "không sao",
      "đợi một chút",
      "không có gì",
      "tạm biệt"
    ],
    "grammar": [
      1,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Chào bạn! Bạn cần gì?",
        "gloss": {
          "en": "Hello! What do you need?",
          "ko": "안녕하세요! 뭐 필요하세요?"
        }
      },
      {
        "who": "me",
        "text": "Chào anh. Cho tôi cái này.",
        "gloss": {
          "en": "Hello. I'll have this one.",
          "ko": "안녕하세요. 이거 주세요."
        },
        "frames": [
          "vi-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Cái mũ này à? Một trăm nghìn. Xin lỗi, tôi không có túi.",
        "gloss": {
          "en": "This hat? A hundred thousand. Sorry, I don't have a bag.",
          "ko": "이 모자요? 십만 동이에요. 미안해요, 봉지가 없어요."
        }
      },
      {
        "who": "me",
        "text": "Không sao. Đợi một chút... Đây, một trăm nghìn.",
        "gloss": {
          "en": "That's fine. Wait a moment... Here, a hundred thousand.",
          "ko": "괜찮아요. 잠깐만요... 여기 십만 동이요."
        }
      },
      {
        "who": "them",
        "text": "Cảm ơn bạn nhiều!",
        "gloss": {
          "en": "Thank you very much!",
          "ko": "정말 고마워요!"
        }
      },
      {
        "who": "me",
        "text": "Không có gì. Tạm biệt anh!",
        "gloss": {
          "en": "You're welcome. Goodbye!",
          "ko": "천만에요. 안녕히 계세요!"
        }
      }
    ]
  },
  {
    "id": "vi-2-1",
    "stage": 2,
    "situation": 0,
    "setting": {
      "en": "Bumping into your friend Hà and making weekend plans",
      "ko": "친구 하를 우연히 만나 주말 약속 잡기"
    },
    "expressions": [
      "lâu rồi không gặp",
      "hay quá",
      "mấy giờ",
      "ở đâu cũng được",
      "đi cùng nhé"
    ],
    "grammar": [
      1,
      2,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ơ, chào bạn! Bạn làm gì ở đây thế?",
        "gloss": {
          "en": "Oh, hi! What are you doing here?",
          "ko": "어, 안녕! 여기서 뭐 해?"
        }
      },
      {
        "who": "me",
        "text": "Chào Hà! Lâu rồi không gặp. Mình đang đi mua sách.",
        "gloss": {
          "en": "Hi Hà! Long time no see. I'm on my way to buy books.",
          "ko": "안녕, 하! 오랜만이야. 나 책 사러 가는 중이야."
        },
        "frames": [
          "vi-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Dạo này bạn thế nào? Cuối tuần này bạn có rảnh không?",
        "gloss": {
          "en": "How have you been? Are you free this weekend?",
          "ko": "요즘 어떻게 지내? 이번 주말에 시간 있어?"
        }
      },
      {
        "who": "me",
        "text": "Mình khỏe. Cuối tuần này mình rảnh. Bạn muốn đi đâu?",
        "gloss": {
          "en": "I'm good. I'm free this weekend. Where do you want to go?",
          "ko": "잘 지내. 이번 주말에 한가해. 어디 가고 싶어?"
        },
        "frames": [
          "vi-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Thứ bảy mình đi xem phim nhé? Có phim mới hay lắm.",
        "gloss": {
          "en": "Shall we see a film on Saturday? There's a really good new one.",
          "ko": "토요일에 영화 보러 갈래? 재미있는 새 영화가 있어."
        }
      },
      {
        "who": "me",
        "text": "Hay quá! Phim bắt đầu lúc mấy giờ?",
        "gloss": {
          "en": "Great! What time does the film start?",
          "ko": "좋다! 영화 몇 시에 시작해?"
        },
        "frames": [
          "vi-f2-13",
          "vi-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "Bảy giờ tối. Mình gặp nhau ở rạp hay ở quán cà phê trước?",
        "gloss": {
          "en": "Seven in the evening. Shall we meet at the cinema or at a café first?",
          "ko": "저녁 일곱 시. 극장에서 만날까, 아니면 카페에서 먼저 만날까?"
        }
      },
      {
        "who": "me",
        "text": "Ở đâu cũng được. Mình sẽ đến sớm.",
        "gloss": {
          "en": "Anywhere is fine. I'll come early.",
          "ko": "어디든 좋아. 나 일찍 갈게."
        },
        "frames": [
          "vi-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Thế gặp ở quán cà phê lúc sáu rưỡi nhé. Gọi cả Tuấn đi.",
        "gloss": {
          "en": "Then let's meet at the café at half past six. Call Tuấn too.",
          "ko": "그럼 여섯 시 반에 카페에서 만나자. 뚜언도 불러."
        }
      },
      {
        "who": "me",
        "text": "Ừ, mình sẽ gọi Tuấn. Ba đứa mình đi cùng nhé!",
        "gloss": {
          "en": "Sure, I'll call Tuấn. Let's go together, the three of us!",
          "ko": "응, 뚜언한테 전화할게. 우리 셋이 같이 가자!"
        },
        "frames": [
          "vi-f2-11",
          "vi-f2-03"
        ]
      }
    ]
  },
  {
    "id": "vi-2-2",
    "stage": 2,
    "situation": 1,
    "setting": {
      "en": "Ordering phở from a young waiter at a street eatery",
      "ko": "길거리 식당에서 젊은 종업원에게 쌀국수 주문하기"
    },
    "expressions": [
      "món gì ngon",
      "không cay",
      "ít đường",
      "cho thêm",
      "tính tiền"
    ],
    "grammar": [
      3,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Mời vào ạ! Hôm nay ăn gì ạ?",
        "gloss": {
          "en": "Come in! What will you have today?",
          "ko": "어서 오세요! 오늘 뭐 드실래요?"
        }
      },
      {
        "who": "me",
        "text": "Em ơi, ở đây có món gì ngon?",
        "gloss": {
          "en": "Excuse me, what's good here?",
          "ko": "저기요, 여기 뭐가 맛있어요?"
        },
        "frames": [
          "vi-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "Phở bò tái ngon nhất ạ. Phở gà cũng ngon.",
        "gloss": {
          "en": "The rare-beef phở is the best. The chicken phở is good too.",
          "ko": "덜 익힌 소고기 쌀국수가 제일 맛있어요. 닭고기 쌀국수도 맛있고요."
        }
      },
      {
        "who": "me",
        "text": "Cho tôi một bát phở bò tái, không cay.",
        "gloss": {
          "en": "A bowl of rare-beef phở, not spicy, please.",
          "ko": "덜 익힌 소고기 쌀국수 한 그릇, 안 맵게 주세요."
        },
        "frames": [
          "vi-f2-10",
          "vi-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Vâng. Uống gì không ạ?",
        "gloss": {
          "en": "Sure. Anything to drink?",
          "ko": "네. 음료는요?"
        }
      },
      {
        "who": "me",
        "text": "Cho tôi một cốc cà phê sữa, ít đường.",
        "gloss": {
          "en": "A glass of milk coffee with little sugar, please.",
          "ko": "연유 커피 한 잔, 설탕 조금만 넣어 주세요."
        },
        "frames": [
          "vi-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Phở đây ạ. Rau với chanh ở trên bàn.",
        "gloss": {
          "en": "Here's your phở. Herbs and lime are on the table.",
          "ko": "쌀국수 나왔습니다. 채소랑 라임은 테이블 위에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Em cho thêm hành được không? Tôi thích hành lắm.",
        "gloss": {
          "en": "Could you add more spring onions? I really like them.",
          "ko": "파 좀 더 줄 수 있어요? 파를 정말 좋아해서요."
        },
        "frames": [
          "vi-f2-09",
          "vi-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Được ạ. Ăn có ngon không ạ?",
        "gloss": {
          "en": "Of course. Is it good?",
          "ko": "물론이죠. 맛있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Ngon lắm! Em ơi, tính tiền nhé.",
        "gloss": {
          "en": "Very good! Excuse me, the bill, please.",
          "ko": "정말 맛있어요! 저기요, 계산해 주세요."
        }
      }
    ]
  },
  {
    "id": "vi-2-3",
    "stage": 2,
    "situation": 2,
    "setting": {
      "en": "Riding a Grab motorbike to the Temple of Literature",
      "ko": "그랩 오토바이를 타고 문묘에 가기"
    },
    "expressions": [
      "rẽ trái",
      "rẽ phải",
      "đi thẳng",
      "dừng ở đây"
    ],
    "grammar": [
      0,
      4,
      5,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bạn đặt xe đi Văn Miếu phải không?",
        "gloss": {
          "en": "You booked a ride to the Temple of Literature, right?",
          "ko": "문묘 가는 차 부르셨죠?"
        }
      },
      {
        "who": "me",
        "text": "Vâng. Anh đến lâu chưa?",
        "gloss": {
          "en": "Yes. Have you been waiting long?",
          "ko": "네. 오래 기다리셨어요?"
        },
        "frames": [
          "vi-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "Chưa, tôi vừa đến. Bạn đội mũ bảo hiểm vào nhé.",
        "gloss": {
          "en": "No, I just got here. Put your helmet on, please.",
          "ko": "아니요, 방금 왔어요. 헬멧 쓰세요."
        }
      },
      {
        "who": "me",
        "text": "Vâng, tôi đội rồi. Mình đi thôi.",
        "gloss": {
          "en": "OK, I've got it on. Let's go.",
          "ko": "네, 썼어요. 가요."
        },
        "frames": [
          "vi-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Bạn có biết đường không? Tôi đi theo bản đồ nhé.",
        "gloss": {
          "en": "Do you know the way? I'll follow the map.",
          "ko": "길 아세요? 저는 지도 보고 갈게요."
        }
      },
      {
        "who": "me",
        "text": "Anh đi thẳng, rồi rẽ trái ở ngã tư nhé.",
        "gloss": {
          "en": "Go straight, then turn left at the crossroads.",
          "ko": "쭉 가다가 사거리에서 좌회전해 주세요."
        },
        "frames": [
          "vi-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "Đường đông quá. Bạn có vội không?",
        "gloss": {
          "en": "The roads are so busy. Are you in a hurry?",
          "ko": "길이 너무 막히네요. 급하세요?"
        }
      },
      {
        "who": "me",
        "text": "Không vội lắm. Vì tôi đi sớm nên không sao.",
        "gloss": {
          "en": "Not really. I left early, so it's fine.",
          "ko": "별로 안 급해요. 일찍 나와서 괜찮아요."
        },
        "frames": [
          "vi-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Sắp đến rồi. Rẽ phải ở đây à?",
        "gloss": {
          "en": "We're almost there. Turn right here?",
          "ko": "거의 다 왔어요. 여기서 우회전이에요?"
        }
      },
      {
        "who": "me",
        "text": "Vâng, rẽ phải. Làm ơn dừng ở đây. Cảm ơn anh!",
        "gloss": {
          "en": "Yes, turn right. Please stop here. Thank you!",
          "ko": "네, 우회전이요. 여기서 세워 주세요. 고마워요!"
        },
        "frames": [
          "vi-f2-08",
          "vi-f1-15"
        ]
      }
    ]
  },
  {
    "id": "vi-2-4",
    "stage": 2,
    "situation": 3,
    "setting": {
      "en": "At a pharmacy, telling the pharmacist about your sore throat",
      "ko": "약국에서 약사에게 목이 아프다고 말하기"
    },
    "expressions": [
      "tôi bị đau họng",
      "thật à",
      "tiếc quá"
    ],
    "grammar": [
      0,
      1,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Chào bạn. Bạn cần mua thuốc gì?",
        "gloss": {
          "en": "Hello. What medicine do you need?",
          "ko": "안녕하세요. 무슨 약 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Chào chị. Tôi bị đau họng.",
        "gloss": {
          "en": "Hello. I have a sore throat.",
          "ko": "안녕하세요. 목이 아파요."
        },
        "frames": [
          "vi-f2-15",
          "vi-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "Bạn bị đau từ bao giờ? Có sốt không?",
        "gloss": {
          "en": "Since when? Do you have a fever?",
          "ko": "언제부터 아프셨어요? 열은 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Không sốt. Hôm qua tôi đã uống nhiều nước đá quá.",
        "gloss": {
          "en": "No fever. Yesterday I drank too much iced water.",
          "ko": "열은 없어요. 어제 얼음물을 너무 많이 마셨어요."
        },
        "frames": [
          "vi-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Thế à. Bạn ăn gì chưa? Thuốc này phải uống sau khi ăn.",
        "gloss": {
          "en": "I see. Have you eaten? This medicine has to be taken after a meal.",
          "ko": "그렇군요. 식사는 하셨어요? 이 약은 식후에 드셔야 해요."
        }
      },
      {
        "who": "me",
        "text": "Tôi ăn sáng rồi. Bây giờ tôi uống luôn được không?",
        "gloss": {
          "en": "I've had breakfast. Can I take it right now?",
          "ko": "아침 먹었어요. 지금 바로 먹어도 돼요?"
        },
        "frames": [
          "vi-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Được. Một ngày uống ba lần. Bạn nên uống nước ấm.",
        "gloss": {
          "en": "Yes. Three times a day. You should drink warm water.",
          "ko": "네. 하루 세 번 드세요. 따뜻한 물을 드시는 게 좋아요."
        }
      },
      {
        "who": "me",
        "text": "Thật à? Vì tôi thích uống nước đá nên mới bị đau họng à?",
        "gloss": {
          "en": "Really? So I got a sore throat because I like iced water?",
          "ko": "정말요? 얼음물을 좋아해서 목이 아픈 거예요?"
        },
        "frames": [
          "vi-f2-14",
          "vi-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Có thể đấy. Mấy ngày tới đừng uống đá nhé.",
        "gloss": {
          "en": "Could be. Don't have ice for the next few days.",
          "ko": "그럴 수도 있어요. 며칠 동안은 얼음 드시지 마세요."
        }
      },
      {
        "who": "me",
        "text": "Tiếc quá! Nhưng tôi sẽ nghe chị. Cảm ơn chị nhé.",
        "gloss": {
          "en": "What a pity! But I'll listen to you. Thank you.",
          "ko": "아쉽네요! 그래도 말씀대로 할게요. 고마워요."
        },
        "frames": [
          "vi-f2-13",
          "vi-f2-03",
          "vi-f1-15"
        ]
      }
    ]
  },
  {
    "id": "vi-2-x1",
    "stage": 2,
    "setting": {
      "en": "Meeting an older neighbour again after a trip home",
      "ko": "고향에 다녀온 뒤 이웃 언니(누나)를 다시 만나기"
    },
    "expressions": [
      "dạo này thế nào",
      "ăn cơm chưa"
    ],
    "grammar": [
      0,
      3,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ơ, chào em! Em về Hà Nội rồi à?",
        "gloss": {
          "en": "Oh, hello! You're back in Hanoi?",
          "ko": "어, 안녕! 하노이에 돌아왔어?"
        }
      },
      {
        "who": "me",
        "text": "Chào chị! Em về hôm qua. Chị dạo này thế nào ạ?",
        "gloss": {
          "en": "Hi! I got back yesterday. How have you been?",
          "ko": "안녕하세요! 어제 왔어요. 요즘 어떻게 지내세요?"
        },
        "frames": [
          "vi-f2-19"
        ]
      },
      {
        "who": "them",
        "text": "Chị vẫn khỏe. Em ăn cơm chưa? Vào nhà chị ăn cơm đi.",
        "gloss": {
          "en": "I'm fine. Have you eaten? Come in and eat with me.",
          "ko": "잘 지내지. 밥 먹었어? 우리 집에 와서 밥 먹어."
        }
      },
      {
        "who": "me",
        "text": "Em ăn rồi ạ. Chị ăn cơm chưa?",
        "gloss": {
          "en": "I've already eaten. Have you had your meal?",
          "ko": "저는 먹었어요. 언니(누나)는 식사하셨어요?"
        },
        "frames": [
          "vi-f2-02",
          "vi-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "Chị chưa. Thế ngồi uống trà với chị nhé.",
        "gloss": {
          "en": "Not yet. Then sit and have tea with me.",
          "ko": "아직. 그럼 나랑 차 마시자."
        }
      },
      {
        "who": "me",
        "text": "Vâng, em muốn uống trà lắm. Cảm ơn chị!",
        "gloss": {
          "en": "Sure, I'd love some tea. Thank you!",
          "ko": "네, 차 정말 마시고 싶어요. 고마워요!"
        },
        "frames": [
          "vi-f2-05"
        ]
      }
    ]
  },
  {
    "id": "vi-3-1",
    "stage": 3,
    "situation": 0,
    "setting": {
      "en": "At the office, telling your older coworker Mai about your trip to Đà Lạt",
      "ko": "사무실에서 선배 동료 마이에게 달랏 여행 이야기하기"
    },
    "expressions": [
      "nói chung",
      "lúc đầu",
      "sau đó",
      "cuối cùng"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Em đi Đà Lạt về rồi à? Thế nào, vui không?",
        "gloss": {
          "en": "You're back from Đà Lạt? How was it, fun?",
          "ko": "달랏 다녀왔어? 어땠어, 재미있었어?"
        },
        "alt": [
          {
            "text": "Nghe nói em vừa đi Đà Lạt. Chuyến đi thế nào?",
            "gloss": {
              "en": "I heard you just went to Đà Lạt. How was the trip?",
              "ko": "달랏 다녀왔다며. 여행 어땠어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Vui lắm chị ạ. Nói chung là đẹp hơn em nghĩ nhiều.",
        "gloss": {
          "en": "It was great. All in all, it was much prettier than I expected.",
          "ko": "정말 재미있었어요. 전체적으로 생각보다 훨씬 예뻤어요."
        },
        "frames": [
          "vi-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Thời tiết thế nào? Có lạnh không?",
        "gloss": {
          "en": "What was the weather like? Was it cold?",
          "ko": "날씨는 어땠어? 추웠어?"
        }
      },
      {
        "who": "me",
        "text": "Đà Lạt mát hơn Hà Nội, nhưng buổi tối thì hơi lạnh. Lúc đầu em không mang áo khoác.",
        "gloss": {
          "en": "Đà Lạt is cooler than Hanoi, but it's a bit cold at night. At first I didn't bring a jacket.",
          "ko": "달랏이 하노이보다 시원한데, 밤에는 좀 추워요. 처음엔 겉옷을 안 가져갔어요."
        },
        "frames": [
          "vi-f3-01",
          "vi-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Thế à? Thế em làm thế nào?",
        "gloss": {
          "en": "Really? So what did you do?",
          "ko": "그래? 그래서 어떻게 했어?"
        },
        "alt": [
          {
            "text": "Rồi sao nữa?",
            "gloss": {
              "en": "And then what?",
              "ko": "그다음엔?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Sau khi ăn tối, em ra chợ đêm mua một cái áo len. Sau đó em đi dạo quanh hồ Xuân Hương.",
        "gloss": {
          "en": "After dinner, I went to the night market and bought a sweater. After that I walked around Xuân Hương Lake.",
          "ko": "저녁 먹고 야시장에 가서 스웨터를 하나 샀어요. 그다음에 쑤언흐엉 호수를 산책했어요."
        },
        "frames": [
          "vi-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "Nghe hay quá. Em có đi Thung lũng Tình Yêu không?",
        "gloss": {
          "en": "Sounds lovely. Did you go to the Valley of Love?",
          "ko": "좋았겠다. 사랑의 계곡에도 갔어?"
        }
      },
      {
        "who": "me",
        "text": "Em định đi, nhưng lại bị lạc đường. Cuối cùng em lại về khách sạn.",
        "gloss": {
          "en": "I meant to, but I got lost. In the end I went back to the hotel.",
          "ko": "가려고 했는데 길을 잃었어요. 결국 호텔로 돌아갔어요."
        },
        "frames": [
          "vi-f3-04",
          "vi-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Tiếc thế! Thế đồ ăn có ngon không?",
        "gloss": {
          "en": "What a shame! And was the food good?",
          "ko": "아쉽다! 그럼 음식은 맛있었어?"
        },
        "alt": [
          {
            "text": "Ôi tiếc quá. Còn đồ ăn thì sao?",
            "gloss": {
              "en": "Oh, what a pity. And the food?",
              "ko": "아이고 아쉽네. 음식은 어땠어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Tuy hơi đắt nhưng ngon lắm. Em nghĩ là bánh căn ở đó ngon nhất.",
        "gloss": {
          "en": "It was a bit pricey but delicious. I think the bánh căn there was the best.",
          "ko": "좀 비싸지만 정말 맛있었어요. 거기 반깐이 제일 맛있었던 것 같아요."
        },
        "frames": [
          "vi-f3-08",
          "vi-f3-13",
          "vi-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Lần sau chị cũng muốn đi. Mùa nào đẹp nhất?",
        "gloss": {
          "en": "I want to go next time too. Which season is the best?",
          "ko": "다음엔 나도 가고 싶다. 어느 계절이 제일 좋아?"
        }
      },
      {
        "who": "me",
        "text": "Em nghĩ là tháng mười một. Nếu chị đi thì nhớ mang áo khoác nhé!",
        "gloss": {
          "en": "I think November. If you go, remember to bring a jacket!",
          "ko": "십일월인 것 같아요. 가시면 겉옷 꼭 챙기세요!"
        },
        "frames": [
          "vi-f3-07",
          "vi-f3-13"
        ]
      }
    ]
  },
  {
    "id": "vi-3-2",
    "stage": 3,
    "situation": 1,
    "setting": {
      "en": "Phoning your landlord Tuấn in the evening because the air conditioner has stopped working",
      "ko": "저녁에 집주인 뚜언에게 에어컨 고장으로 전화하기"
    },
    "expressions": [
      "bị hỏng rồi",
      "có vấn đề",
      "may quá"
    ],
    "grammar": [
      1,
      2,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Alô, anh Tuấn đây. Có chuyện gì thế em?",
        "gloss": {
          "en": "Hello, Tuấn here. What's up?",
          "ko": "여보세요, 뚜언이야. 무슨 일이야?"
        },
        "alt": [
          {
            "text": "Alô, ai đấy ạ?",
            "gloss": {
              "en": "Hello, who's calling?",
              "ko": "여보세요, 누구세요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Chào anh, em ở phòng ba lẻ hai ạ. Điều hòa phòng em bị hỏng rồi.",
        "gloss": {
          "en": "Hello, it's me from room three-oh-two. The air conditioner in my room is broken.",
          "ko": "안녕하세요, 삼백이 호예요. 제 방 에어컨이 고장 났어요."
        },
        "frames": [
          "vi-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Thế à? Hỏng từ bao giờ?",
        "gloss": {
          "en": "Oh? Since when?",
          "ko": "그래? 언제부터?"
        },
        "alt": [
          {
            "text": "Ôi, sao thế? Từ lúc nào?",
            "gloss": {
              "en": "Oh, what happened? Since when?",
              "ko": "아이고, 왜 그래? 언제부터?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Em vừa về đến nhà thì thấy nó không chạy.",
        "gloss": {
          "en": "I'd just got home when I saw it wasn't running.",
          "ko": "방금 집에 왔는데 안 돌아가더라고요."
        },
        "frames": [
          "vi-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "Em thử tắt đi rồi bật lại chưa?",
        "gloss": {
          "en": "Have you tried turning it off and on again?",
          "ko": "껐다가 다시 켜 봤어?"
        }
      },
      {
        "who": "me",
        "text": "Em thử rồi, nhưng vẫn có vấn đề. Trước khi gọi anh, em đã kiểm tra cả điều khiển.",
        "gloss": {
          "en": "I tried, but there's still a problem. Before calling you, I checked the remote too.",
          "ko": "해 봤는데 여전히 문제가 있어요. 전화하기 전에 리모컨도 확인했어요."
        },
        "frames": [
          "vi-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "Tối nay thợ bận rồi. Mai được không em?",
        "gloss": {
          "en": "The repairman is busy tonight. Is tomorrow OK?",
          "ko": "오늘 밤엔 기사가 바빠. 내일 괜찮아?"
        },
        "alt": [
          {
            "text": "Giờ muộn rồi, chắc phải để mai thôi.",
            "gloss": {
              "en": "It's late now, it'll probably have to wait till tomorrow.",
              "ko": "지금 늦어서 아마 내일 해야 할 거야."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Nếu để đến mai thì em không ngủ được, nóng lắm anh ạ.",
        "gloss": {
          "en": "If it waits till tomorrow, I won't be able to sleep. It's really hot.",
          "ko": "내일까지 기다리면 잠을 못 자요, 너무 더워요."
        },
        "frames": [
          "vi-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Ừ, để anh gọi thử. Có lẽ tám giờ thợ đến được.",
        "gloss": {
          "en": "OK, let me try calling. Maybe the repairman can come at eight.",
          "ko": "그래, 내가 전화해 볼게. 아마 여덟 시에 기사가 갈 수 있을 거야."
        }
      },
      {
        "who": "me",
        "text": "May quá! Em cảm ơn anh nhiều.",
        "gloss": {
          "en": "What a relief! Thank you so much.",
          "ko": "다행이다! 정말 고마워요."
        }
      },
      {
        "who": "them",
        "text": "Không có gì. Có gì cứ gọi anh nhé.",
        "gloss": {
          "en": "No problem. Call me if anything comes up.",
          "ko": "별말을. 무슨 일 있으면 전화해."
        }
      },
      {
        "who": "me",
        "text": "Vâng ạ. Em sẽ ở nhà đợi thợ.",
        "gloss": {
          "en": "Will do. I'll stay home and wait for the repairman.",
          "ko": "네. 집에서 기사님 기다릴게요."
        },
        "frames": [
          "vi-f2-03"
        ]
      }
    ]
  },
  {
    "id": "vi-3-3",
    "stage": 3,
    "situation": 2,
    "setting": {
      "en": "At a phone shop, choosing a mobile plan with a young sales assistant",
      "ko": "휴대폰 가게에서 젊은 직원과 요금제 고르기"
    },
    "expressions": [
      "cái nào tốt hơn",
      "để tôi xem",
      "thật ra",
      "theo tôi",
      "nhầm rồi"
    ],
    "grammar": [
      0,
      1,
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Chào bạn, bạn cần giúp gì ạ?",
        "gloss": {
          "en": "Hello, how can I help you?",
          "ko": "안녕하세요, 무엇을 도와드릴까요?"
        },
        "alt": [
          {
            "text": "Xin chào, bạn muốn mua sim hay đăng ký gói cước?",
            "gloss": {
              "en": "Hello, do you want a SIM card or a phone plan?",
              "ko": "안녕하세요, 유심 사실래요, 요금제 가입하실래요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Tôi muốn đăng ký gói cước điện thoại. Hai gói này, cái nào tốt hơn?",
        "gloss": {
          "en": "I'd like to sign up for a phone plan. Of these two, which one is better?",
          "ko": "휴대폰 요금제에 가입하고 싶어요. 이 두 개 중에 어느 게 더 나아요?"
        },
        "frames": [
          "vi-f3-03",
          "vi-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Gói này rẻ hơn, nhưng gói kia được nhiều dữ liệu hơn.",
        "gloss": {
          "en": "This one is cheaper, but that one gives you more data.",
          "ko": "이게 더 싸고, 저건 데이터를 더 많이 줘요."
        }
      },
      {
        "who": "me",
        "text": "Để tôi xem... Gói nào nhiều dữ liệu nhất?",
        "gloss": {
          "en": "Let me see... Which plan has the most data?",
          "ko": "어디 봐요... 데이터가 제일 많은 요금제는 뭐예요?"
        },
        "frames": [
          "vi-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Gói này nhiều nhất, sáu mươi gigabyte một tháng. Nếu bạn xem video nhiều thì nên chọn gói này.",
        "gloss": {
          "en": "This one has the most, sixty gigabytes a month. If you watch a lot of videos, you should pick this one.",
          "ko": "이게 제일 많아요, 한 달에 육십 기가요. 영상을 많이 보시면 이걸 고르세요."
        },
        "alt": [
          {
            "text": "Gói sáu mươi gigabyte là nhiều nhất ạ, nhưng giá hơi cao.",
            "gloss": {
              "en": "The sixty-gigabyte plan has the most, but it's a bit pricey.",
              "ko": "육십 기가 요금제가 제일 많은데 가격이 좀 비싸요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Thật ra tôi không xem video nhiều lắm. Tôi nghĩ là gói nhỏ cũng đủ.",
        "gloss": {
          "en": "Actually, I don't watch that many videos. I think the small plan is enough.",
          "ko": "사실 영상을 그렇게 많이 보지 않아요. 작은 요금제로도 충분할 것 같아요."
        },
        "frames": [
          "vi-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Vâng. Gói nhỏ thì hết dữ liệu sẽ bị chậm.",
        "gloss": {
          "en": "Sure. With the small plan, it gets slow when the data runs out.",
          "ko": "네. 작은 요금제는 데이터가 다 떨어지면 느려져요."
        }
      },
      {
        "who": "me",
        "text": "Nếu bị chậm thì tôi có thể mua thêm không?",
        "gloss": {
          "en": "If it gets slow, can I buy more?",
          "ko": "느려지면 더 살 수 있어요?"
        },
        "frames": [
          "vi-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Được ạ. Bạn muốn trả theo tháng hay theo năm?",
        "gloss": {
          "en": "Yes. Do you want to pay monthly or yearly?",
          "ko": "네. 매달 내실래요, 일 년 치 내실래요?"
        },
        "alt": [
          {
            "text": "Có chứ. Bạn muốn đăng ký một tháng hay cả năm?",
            "gloss": {
              "en": "Of course. Do you want to sign up for a month or a whole year?",
              "ko": "그럼요. 한 달로 하실래요, 일 년으로 하실래요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Theo tôi, trả theo tháng thì tiện hơn.",
        "gloss": {
          "en": "In my opinion, paying monthly is more convenient.",
          "ko": "제 생각엔 매달 내는 게 더 편해요."
        },
        "frames": [
          "vi-f3-15",
          "vi-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Vâng. Bạn cho tôi xem hộ chiếu nhé.",
        "gloss": {
          "en": "OK. May I see your passport, please?",
          "ko": "네. 여권 좀 보여 주세요."
        }
      },
      {
        "who": "me",
        "text": "Đây. Ơ, nhầm rồi, đây là thẻ ngân hàng. Hộ chiếu đây.",
        "gloss": {
          "en": "Here. Oh, wrong one, that's my bank card. Here's the passport.",
          "ko": "여기요. 어, 잘못 줬네요, 이건 은행 카드예요. 여권 여기 있어요."
        }
      }
    ]
  },
  {
    "id": "vi-3-4",
    "stage": 3,
    "situation": 3,
    "setting": {
      "en": "Chatting with your friend Hùng about a viral cat video",
      "ko": "친구 훙과 화제의 고양이 영상 이야기하기"
    },
    "expressions": [
      "thế à",
      "có lẽ",
      "không hẳn",
      "đúng rồi",
      "tùy bạn",
      "chán thật"
    ],
    "grammar": [
      2,
      3,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bạn xem cái video con mèo chơi đàn chưa? Hot lắm!",
        "gloss": {
          "en": "Have you seen the video of the cat playing the piano? It's everywhere!",
          "ko": "고양이가 피아노 치는 영상 봤어? 완전 난리야!"
        },
        "alt": [
          {
            "text": "Video con mèo chơi đàn đang nổi khắp mạng đấy, xem chưa?",
            "gloss": {
              "en": "That piano-playing cat video is all over the internet, seen it?",
              "ko": "피아노 치는 고양이 영상이 인터넷에 쫙 퍼졌어, 봤어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Mình vừa xem sáng nay. Buồn cười quá!",
        "gloss": {
          "en": "I just watched it this morning. So funny!",
          "ko": "나 오늘 아침에 막 봤어. 너무 웃겨!"
        },
        "frames": [
          "vi-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "Nghe nói video đó được hơn mười triệu lượt xem rồi.",
        "gloss": {
          "en": "I heard that video has over ten million views already.",
          "ko": "그 영상 조회수가 벌써 천만이 넘었대."
        }
      },
      {
        "who": "me",
        "text": "Thế à? Nhiều thế! Nhưng có lẽ video đó là giả.",
        "gloss": {
          "en": "Really? That many! But maybe the video is fake.",
          "ko": "그래? 엄청 많네! 근데 아마 그 영상 가짜일 거야."
        },
        "frames": [
          "vi-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Không phải đâu. Chủ của nó nói là nó tự học.",
        "gloss": {
          "en": "No way. Its owner said it taught itself.",
          "ko": "아니야. 주인이 고양이가 혼자 배웠다고 했어."
        },
        "alt": [
          {
            "text": "Mình không nghĩ thế. Chủ con mèo nói là nó học đàn cả năm.",
            "gloss": {
              "en": "I don't think so. The owner said it's been learning for a whole year.",
              "ko": "난 그렇게 생각 안 해. 주인이 일 년 동안 배웠다고 했어."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Không hẳn. Mình nghĩ là họ đã dạy nó rất lâu, rồi mới quay video.",
        "gloss": {
          "en": "Not exactly. I think they trained it for a long time and only then filmed it.",
          "ko": "꼭 그렇진 않아. 오랫동안 가르친 다음에야 찍었을 것 같아."
        },
        "frames": [
          "vi-f3-18",
          "vi-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Ừ, có thể. Mà mèo nhà Lan còn thông minh hơn ấy.",
        "gloss": {
          "en": "Yeah, maybe. But Lan's cat is even smarter.",
          "ko": "응, 그럴 수도. 근데 란네 고양이가 더 똑똑해."
        }
      },
      {
        "who": "me",
        "text": "Đúng rồi! Mèo của Lan còn biết mở tủ lạnh nữa.",
        "gloss": {
          "en": "That's right! Lan's cat can even open the fridge.",
          "ko": "맞아! 란네 고양이는 냉장고도 열 줄 알아."
        }
      },
      {
        "who": "them",
        "text": "Cuối tuần này mình đến nhà Lan quay video con mèo nhé? Thứ bảy hay chủ nhật?",
        "gloss": {
          "en": "Shall we go to Lan's this weekend and film her cat? Saturday or Sunday?",
          "ko": "이번 주말에 란네 가서 고양이 영상 찍을까? 토요일, 일요일?"
        },
        "alt": [
          {
            "text": "Hay mình rủ Lan quay video mèo nhé? Bạn rảnh hôm nào?",
            "gloss": {
              "en": "How about we ask Lan to film her cat? Which day are you free?",
              "ko": "란한테 고양이 영상 찍자고 할까? 너 언제 시간 돼?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Tùy bạn, ngày nào mình cũng rảnh. Nếu video nổi tiếng thì Lan sẽ vui lắm.",
        "gloss": {
          "en": "Up to you, I'm free any day. If the video goes viral, Lan will be thrilled.",
          "ko": "너 편한 대로 해, 난 아무 날이나 괜찮아. 영상이 뜨면 란이 엄청 좋아하겠다."
        },
        "frames": [
          "vi-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Mà nếu không ai xem thì sao?",
        "gloss": {
          "en": "But what if nobody watches it?",
          "ko": "근데 아무도 안 보면 어떡해?"
        }
      },
      {
        "who": "me",
        "text": "Thì chán thật! Nhưng tuy ít người xem nhưng mình vẫn có kỷ niệm vui.",
        "gloss": {
          "en": "Then that'd be a real bummer! But even if few people watch, we'll still have a fun memory.",
          "ko": "그럼 진짜 김빠지지! 그래도 보는 사람이 적어도 즐거운 추억은 남잖아."
        },
        "frames": [
          "vi-f3-08"
        ]
      }
    ]
  },
  {
    "id": "vi-3-x1",
    "stage": 3,
    "setting": {
      "en": "At a roadside motorbike repair stand with a flat tyre",
      "ko": "길가 오토바이 수리점에서 펑크 난 타이어 고치기"
    },
    "expressions": [
      "sửa giúp tôi",
      "may quá",
      "tôi cũng nghĩ vậy"
    ],
    "grammar": [
      1,
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Chào bạn. Xe của bạn làm sao thế?",
        "gloss": {
          "en": "Hello. What's wrong with your bike?",
          "ko": "안녕하세요. 오토바이가 왜 그래요?"
        }
      },
      {
        "who": "me",
        "text": "Xe tôi bị thủng lốp. Anh sửa giúp tôi được không?",
        "gloss": {
          "en": "My bike has a flat tyre. Could you fix it for me?",
          "ko": "타이어가 펑크 났어요. 좀 고쳐 주실 수 있어요?"
        },
        "frames": [
          "vi-f3-04",
          "vi-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Được. Khoảng mười lăm phút thôi.",
        "gloss": {
          "en": "Sure. Only about fifteen minutes.",
          "ko": "네. 십오 분 정도면 돼요."
        }
      },
      {
        "who": "me",
        "text": "May quá. Tôi sắp phải đi làm rồi.",
        "gloss": {
          "en": "What luck. I have to go to work soon.",
          "ko": "다행이에요. 곧 출근해야 하거든요."
        },
        "frames": [
          "vi-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "Lốp này cũ quá rồi. Thay lốp mới thì tốt hơn.",
        "gloss": {
          "en": "This tyre is really old. A new one would be better.",
          "ko": "이 타이어 너무 낡았네요. 새 걸로 바꾸는 게 나아요."
        }
      },
      {
        "who": "me",
        "text": "Tôi cũng nghĩ vậy. Nếu không đắt quá thì anh thay luôn giúp tôi.",
        "gloss": {
          "en": "I think so too. If it's not too expensive, please change it for me.",
          "ko": "저도 그렇게 생각해요. 너무 비싸지 않으면 바로 바꿔 주세요."
        },
        "frames": [
          "vi-f3-07"
        ]
      }
    ]
  },
  {
    "id": "vi-4-1",
    "stage": 4,
    "situation": 0,
    "setting": {
      "en": "Weekly project meeting with your team lead Hưng about a delayed app launch",
      "ko": "팀장 흥과 앱 출시 지연을 두고 주간 프로젝트 회의"
    },
    "expressions": [
      "để em xác nhận lại",
      "hạn chót",
      "phương án khác",
      "chịu trách nhiệm",
      "chốt lại"
    ],
    "grammar": [
      0,
      1,
      2,
      4,
      5,
      6
    ],
    "earlierGrammar": [
      "3:5",
      "2:1"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bắt đầu nhé. Về tiến độ app mới thì em báo cáo giúp anh.",
        "gloss": {
          "en": "Let's start. On the new app's progress, could you give us an update?",
          "ko": "시작하자. 새 앱 진행 상황은 네가 보고해 줘."
        },
        "alt": [
          {
            "text": "Mọi người đủ rồi. Em cập nhật tình hình dự án trước nhé.",
            "gloss": {
              "en": "Everyone's here. You update us on the project first.",
              "ko": "다 모였네. 먼저 프로젝트 상황 공유해 줘."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Dạ. Về phần thiết kế thì bọn em đã xong, nhưng phần kiểm thử còn chậm.",
        "gloss": {
          "en": "Sure. As for design, we've finished, but testing is still behind.",
          "ko": "네. 디자인 쪽은 끝났는데, 테스트가 아직 늦어지고 있어요."
        },
        "frames": [
          "vi-f4-07"
        ]
      },
      {
        "who": "them",
        "text": "Chậm khoảng bao lâu? Hạn chót là cuối tháng này đấy.",
        "gloss": {
          "en": "Behind by how much? The deadline is the end of this month.",
          "ko": "얼마나 늦어? 마감이 이번 달 말이야."
        }
      },
      {
        "who": "me",
        "text": "Khoảng một tuần ạ. Để em xác nhận lại với đội kiểm thử, nhưng em nghĩ là khá khó kịp hạn chót.",
        "gloss": {
          "en": "About a week. Let me double-check with the testing team, but I think it'll be fairly hard to meet the deadline.",
          "ko": "일주일쯤이요. 테스트팀에 다시 확인해 보겠지만, 마감 맞추기는 꽤 어려울 것 같아요."
        },
        "frames": [
          "vi-f4-19",
          "vi-f4-06",
          "vi-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Thế thì không ổn. Khách hàng không muốn lùi lịch đâu.",
        "gloss": {
          "en": "That won't do. The client won't want to push the schedule back.",
          "ko": "그럼 곤란한데. 고객이 일정 미루는 걸 원하지 않아."
        },
        "alt": [
          {
            "text": "Lùi lịch thì khó lắm, khách đã chốt ngày ra mắt rồi.",
            "gloss": {
              "en": "Pushing it back is tough, the client has already fixed the launch date.",
              "ko": "일정 미루기는 어려워, 고객이 출시일을 이미 확정했거든."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Vâng, nên em có một phương án khác. Mình thuê thêm hai người kiểm thử để rút ngắn thời gian.",
        "gloss": {
          "en": "Yes, so I have another option. We hire two more testers to shorten the time.",
          "ko": "네, 그래서 다른 방안이 있어요. 테스터 두 명을 더 써서 기간을 줄이는 거예요."
        },
        "frames": [
          "vi-f4-03"
        ]
      },
      {
        "who": "them",
        "text": "Thuê thêm người thì tốn ngân sách. Có cách nào khác không?",
        "gloss": {
          "en": "Hiring more people costs budget. Is there any other way?",
          "ko": "사람을 더 쓰면 예산이 들잖아. 다른 방법은 없어?"
        }
      },
      {
        "who": "me",
        "text": "Thuê thêm người không những nhanh hơn mà còn giảm rủi ro lỗi khi ra mắt.",
        "gloss": {
          "en": "Hiring more people is not only faster but also reduces the risk of bugs at launch.",
          "ko": "사람을 더 쓰면 빠를 뿐만 아니라 출시 때 오류 위험도 줄어요."
        },
        "frames": [
          "vi-f4-01",
          "vi-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Ừ, nhưng ai sẽ quản lý hai người đó?",
        "gloss": {
          "en": "Right, but who will manage those two?",
          "ko": "그래, 근데 그 두 사람은 누가 관리해?"
        },
        "alt": [
          {
            "text": "Được, nhưng ai sẽ hướng dẫn họ?",
            "gloss": {
              "en": "OK, but who will train them?",
              "ko": "좋아, 근데 누가 그 사람들을 가르쳐?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Em sẽ chịu trách nhiệm phần đó. Dù hơi bận, em vẫn sắp xếp được.",
        "gloss": {
          "en": "I'll take responsibility for that. Even though I'm a bit busy, I can still manage.",
          "ko": "그 부분은 제가 책임질게요. 좀 바쁘긴 해도 조정할 수 있어요."
        },
        "frames": [
          "vi-f4-20",
          "vi-f4-02",
          "vi-f4-05"
        ]
      },
      {
        "who": "them",
        "text": "Tốt. Ngoài ra, báo cáo tuần này em gửi khi nào?",
        "gloss": {
          "en": "Good. Also, when will you send this week's report?",
          "ko": "좋아. 그리고 이번 주 보고서는 언제 보낼 거야?"
        }
      },
      {
        "who": "me",
        "text": "Em sẽ gửi trước thứ sáu. Tuy nhiên, số liệu kiểm thử thì phải đợi đến thứ năm mới có.",
        "gloss": {
          "en": "I'll send it before Friday. However, the test figures won't be available until Thursday.",
          "ko": "금요일 전에 보낼게요. 다만 테스트 수치는 목요일이 돼야 나와요."
        },
        "frames": [
          "vi-f4-08"
        ]
      },
      {
        "who": "them",
        "text": "Được. Còn gì nữa không?",
        "gloss": {
          "en": "OK. Anything else?",
          "ko": "알았어. 더 있어?"
        }
      },
      {
        "who": "me",
        "text": "Chốt lại là: thuê thêm hai người kiểm thử, em phụ trách, và hạn chót vẫn giữ nguyên ạ.",
        "gloss": {
          "en": "To wrap up: we hire two more testers, I'm in charge, and the deadline stays the same.",
          "ko": "정리하면, 테스터 두 명 추가, 제가 담당, 마감은 그대로입니다."
        },
        "frames": [
          "vi-f4-15"
        ]
      }
    ]
  },
  {
    "id": "vi-4-2",
    "stage": 4,
    "situation": 1,
    "setting": {
      "en": "Debating a ban on motorbikes in the city centre with your friend Minh",
      "ko": "친구 민과 도심 오토바이 금지를 두고 토론하기"
    },
    "expressions": [
      "nói thẳng ra",
      "điều quan trọng là",
      "có lý",
      "mặt khác",
      "chưa chắc",
      "đồng ý một phần"
    ],
    "grammar": [
      0,
      1,
      2,
      3
    ],
    "earlierGrammar": [
      "3:2",
      "2:5"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bạn đọc tin chưa? Hà Nội sắp cấm xe máy ở trung tâm đấy.",
        "gloss": {
          "en": "Have you read the news? Hanoi is about to ban motorbikes in the centre.",
          "ko": "뉴스 봤어? 하노이가 곧 도심에서 오토바이를 금지한대."
        },
        "alt": [
          {
            "text": "Nghe nói thành phố định cấm xe máy trong phố cổ, bạn thấy sao?",
            "gloss": {
              "en": "I hear the city plans to ban motorbikes in the Old Quarter, what do you think?",
              "ko": "시에서 구시가지 오토바이를 금지한다던데, 넌 어떻게 생각해?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Ừ, mình có đọc. Nói thẳng ra là mình ủng hộ.",
        "gloss": {
          "en": "Yeah, I read it. To be honest, I'm for it.",
          "ko": "응, 읽었어. 솔직히 말하면 난 찬성이야."
        },
        "frames": [
          "vi-f4-10"
        ]
      },
      {
        "who": "them",
        "text": "Ủng hộ á? Thế người đi làm bằng xe máy thì sao?",
        "gloss": {
          "en": "You support it? What about people who ride to work?",
          "ko": "찬성이라고? 그럼 오토바이로 출근하는 사람들은?"
        }
      },
      {
        "who": "me",
        "text": "Mình hiểu, nhưng điều quan trọng là không khí. Xe càng nhiều, không khí càng bẩn.",
        "gloss": {
          "en": "I get it, but what matters is the air. The more vehicles there are, the dirtier the air gets.",
          "ko": "알아, 근데 중요한 건 공기야. 차가 많을수록 공기가 더러워지잖아."
        },
        "frames": [
          "vi-f4-11",
          "vi-f4-04"
        ]
      },
      {
        "who": "them",
        "text": "Nhưng xe buýt bây giờ vừa chậm vừa đông.",
        "gloss": {
          "en": "But buses now are both slow and crowded.",
          "ko": "근데 지금 버스는 느리고 붐비잖아."
        },
        "alt": [
          {
            "text": "Nhưng phương tiện công cộng ở mình chưa tốt mà.",
            "gloss": {
              "en": "But our public transport isn't good enough yet.",
              "ko": "근데 우리 대중교통이 아직 별로잖아."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Có lý. Mặt khác, nếu cấm xe máy thì thành phố sẽ phải đầu tư thêm xe buýt.",
        "gloss": {
          "en": "Fair point. On the other hand, if they ban motorbikes, the city will have to invest in more buses.",
          "ko": "일리 있어. 한편으로는 오토바이를 금지하면 시가 버스에 더 투자해야 하겠지."
        },
        "frames": [
          "vi-f4-13",
          "vi-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Bạn nghĩ họ sẽ làm kịp à?",
        "gloss": {
          "en": "You think they'll manage it in time?",
          "ko": "제때 할 수 있을 것 같아?"
        }
      },
      {
        "who": "me",
        "text": "Chưa chắc. Dù có kế hoạch, họ vẫn cần ít nhất vài năm.",
        "gloss": {
          "en": "Not necessarily. Even with a plan, they'll still need at least a few years.",
          "ko": "꼭 그렇진 않아. 계획이 있어도 최소 몇 년은 걸릴 거야."
        },
        "frames": [
          "vi-f4-02"
        ]
      },
      {
        "who": "them",
        "text": "Đấy, thế thì cấm bây giờ là quá sớm.",
        "gloss": {
          "en": "See, so banning it now is too early.",
          "ko": "거봐, 그러니까 지금 금지하는 건 너무 일러."
        },
        "alt": [
          {
            "text": "Thế nên mình mới nói là cấm bây giờ vội quá.",
            "gloss": {
              "en": "That's why I'm saying banning it now is too hasty.",
              "ko": "그래서 내가 지금 금지하는 건 너무 성급하다는 거야."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Mình đồng ý một phần. Có lẽ nên cấm từng khu một để mọi người quen dần.",
        "gloss": {
          "en": "I partly agree. Maybe they should ban it one area at a time so people get used to it.",
          "ko": "부분적으로는 동의해. 사람들이 익숙해지게 구역별로 하나씩 금지하는 게 좋겠어."
        },
        "frames": [
          "vi-f4-14",
          "vi-f4-03",
          "vi-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Ừ, cách đó cũng hay. Cấm vào cuối tuần trước chẳng hạn.",
        "gloss": {
          "en": "Yeah, that's a good approach. Ban it on weekends first, for example.",
          "ko": "응, 그 방법도 좋다. 예를 들면 주말에 먼저 금지하는 거지."
        }
      },
      {
        "who": "me",
        "text": "Đúng. Cấm cuối tuần không những dễ làm mà còn giúp phố cổ đẹp hơn.",
        "gloss": {
          "en": "Exactly. A weekend ban is not only easy to do but also makes the Old Quarter nicer.",
          "ko": "맞아. 주말 금지는 하기도 쉽고 구시가지도 더 보기 좋아질 거야."
        },
        "frames": [
          "vi-f4-01"
        ]
      },
      {
        "who": "them",
        "text": "Thôi, nói mãi không hết. Đi ăn bún chả không?",
        "gloss": {
          "en": "OK, we could go on forever. Want to get bún chả?",
          "ko": "됐다, 끝이 없네. 분짜 먹으러 갈래?"
        }
      },
      {
        "who": "me",
        "text": "Đi! Nhưng mình đi bộ thôi nhé, cho đúng tinh thần.",
        "gloss": {
          "en": "Let's go! But let's walk, in the spirit of things.",
          "ko": "가자! 근데 취지에 맞게 걸어가자."
        }
      }
    ]
  },
  {
    "id": "vi-4-3",
    "stage": 4,
    "situation": 2,
    "setting": {
      "en": "Negotiating the rent for a flat with the landlord before signing",
      "ko": "계약 전에 집주인과 월세 협상하기"
    },
    "expressions": [
      "giảm được không",
      "tôi hiểu ý anh",
      "nếu được thì",
      "tôi e là",
      "hai bên cùng có lợi",
      "thôi thì"
    ],
    "grammar": [
      2,
      4,
      5,
      6
    ],
    "earlierGrammar": [
      "3:4"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Phòng này mười triệu một tháng, hợp đồng một năm.",
        "gloss": {
          "en": "This flat is ten million a month, on a one-year contract.",
          "ko": "이 방은 한 달에 천만 동, 일 년 계약이에요."
        },
        "alt": [
          {
            "text": "Giá thuê là mười triệu, đặt cọc hai tháng nhé.",
            "gloss": {
              "en": "The rent is ten million, with two months' deposit.",
              "ko": "월세는 천만 동이고, 보증금은 두 달 치예요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Phòng khá đẹp, nhưng giá hơi cao so với khu này. Anh giảm được không?",
        "gloss": {
          "en": "The flat is quite nice, but the price is a bit high for this area. Can you lower it?",
          "ko": "방은 꽤 좋은데 이 동네치고 가격이 좀 높네요. 깎아 주실 수 있어요?"
        },
        "frames": [
          "vi-f4-06",
          "vi-f4-05",
          "vi-f4-17"
        ]
      },
      {
        "who": "them",
        "text": "Khu này gần hồ, giá đó là bình thường rồi.",
        "gloss": {
          "en": "This area is near the lake; that price is normal.",
          "ko": "이 동네는 호수 근처라 그 정도면 보통이에요."
        }
      },
      {
        "who": "me",
        "text": "Tôi hiểu ý anh. Tuy nhiên, phòng bên cạnh chỉ có tám triệu thôi.",
        "gloss": {
          "en": "I see your point. However, the flat next door is only eight million.",
          "ko": "무슨 말씀인지 알아요. 그런데 옆 방은 팔백만 동밖에 안 하던데요."
        },
        "frames": [
          "vi-f4-08"
        ]
      },
      {
        "who": "them",
        "text": "Phòng đó nhỏ hơn, lại không có ban công.",
        "gloss": {
          "en": "That one is smaller, and it has no balcony.",
          "ko": "그 방은 더 작고 발코니도 없어요."
        },
        "alt": [
          {
            "text": "Nhưng phòng đó cũ hơn nhiều, đồ đạc cũng không có.",
            "gloss": {
              "en": "But that one is much older, and has no furniture.",
              "ko": "그 방은 훨씬 낡았고 가구도 없어요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Đúng vậy. Nếu được thì tôi muốn ký hợp đồng hai năm để anh không phải tìm người mới.",
        "gloss": {
          "en": "True. If possible, I'd like to sign for two years so you don't have to find a new tenant.",
          "ko": "맞아요. 가능하면 이 년 계약을 해서 새 세입자를 안 찾으셔도 되게 하고 싶어요."
        },
        "frames": [
          "vi-f4-18",
          "vi-f4-03"
        ]
      },
      {
        "who": "them",
        "text": "Hai năm thì tốt. Nhưng giá thì tôi chỉ bớt được năm trăm nghìn.",
        "gloss": {
          "en": "Two years is good. But I can only take five hundred thousand off the price.",
          "ko": "이 년이면 좋죠. 그래도 가격은 오십만 동밖에 못 깎아 드려요."
        }
      },
      {
        "who": "me",
        "text": "Tôi e là vẫn hơi cao. Chín triệu thì hai bên cùng có lợi.",
        "gloss": {
          "en": "I'm afraid that's still a bit high. Nine million would work for both of us.",
          "ko": "죄송하지만 그래도 좀 비싸요. 구백만 동이면 서로 좋을 것 같아요."
        },
        "frames": [
          "vi-f4-12",
          "vi-f4-05"
        ]
      },
      {
        "who": "them",
        "text": "Chín triệu thì khó quá. Chín triệu rưỡi nhé?",
        "gloss": {
          "en": "Nine million is too hard. Nine and a half?",
          "ko": "구백만은 너무 힘들어요. 구백오십만 어때요?"
        },
        "alt": [
          {
            "text": "Chín triệu thì tôi lỗ mất. Chín triệu rưỡi, không thể thấp hơn.",
            "gloss": {
              "en": "At nine million I'd lose money. Nine and a half, I can't go lower.",
              "ko": "구백만이면 손해예요. 구백오십만, 더는 못 내려요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Thôi thì chín triệu rưỡi cũng được. Ngoài ra, anh sửa cái vòi nước trước khi tôi chuyển vào nhé.",
        "gloss": {
          "en": "Well then, nine and a half is fine. Also, please fix the tap before I move in.",
          "ko": "그럼 구백오십만도 괜찮아요. 그리고 제가 이사 오기 전에 수도꼭지 좀 고쳐 주세요."
        },
        "frames": [
          "vi-f4-09"
        ]
      },
      {
        "who": "them",
        "text": "Được, tuần này tôi cho thợ đến.",
        "gloss": {
          "en": "Fine, I'll send a repairman this week.",
          "ko": "네, 이번 주에 기사를 보낼게요."
        }
      },
      {
        "who": "me",
        "text": "Về tiền cọc thì tôi chuyển khoản một tháng trước, được không anh?",
        "gloss": {
          "en": "As for the deposit, can I transfer one month first?",
          "ko": "보증금은 먼저 한 달 치를 송금해도 될까요?"
        },
        "frames": [
          "vi-f4-07"
        ]
      },
      {
        "who": "them",
        "text": "Được. Thứ bảy ký hợp đồng nhé.",
        "gloss": {
          "en": "OK. Let's sign the contract on Saturday.",
          "ko": "좋아요. 토요일에 계약해요."
        }
      },
      {
        "who": "me",
        "text": "Vâng. Cảm ơn anh đã giảm giá để tôi có thể ở lâu dài.",
        "gloss": {
          "en": "Sure. Thank you for lowering the price so I can stay long-term.",
          "ko": "네. 오래 살 수 있게 가격을 깎아 주셔서 감사해요."
        },
        "frames": [
          "vi-f4-03"
        ]
      }
    ]
  },
  {
    "id": "vi-4-4",
    "stage": 4,
    "situation": 3,
    "setting": {
      "en": "Talking with a friend about last night's episode of a talk show",
      "ko": "친구와 어젯밤 토크쇼 회차 이야기하기"
    },
    "expressions": [
      "về mặt này",
      "khó nói lắm",
      "tóm lại"
    ],
    "grammar": [
      0,
      1,
      3,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Tối qua bạn có xem tập mới của chương trình 'Cà phê sáng' không?",
        "gloss": {
          "en": "Did you watch the new episode of 'Morning Coffee' last night?",
          "ko": "어젯밤에 '모닝 커피' 새 회차 봤어?"
        },
        "alt": [
          {
            "text": "Tập mới của 'Cà phê sáng' tối qua, bạn xem chưa?",
            "gloss": {
              "en": "Last night's new 'Morning Coffee', have you seen it?",
              "ko": "어젯밤 '모닝 커피' 새 회차, 봤어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Có, mình xem rồi. Khách mời khá thú vị, nhưng MC nói hơi nhiều.",
        "gloss": {
          "en": "Yes, I watched it. The guest was quite interesting, but the host talked a bit too much.",
          "ko": "응, 봤어. 게스트는 꽤 재미있었는데 진행자가 말이 좀 많더라."
        },
        "frames": [
          "vi-f4-06",
          "vi-f4-05"
        ]
      },
      {
        "who": "them",
        "text": "Ừ, mình cũng thấy vậy. Bạn thấy phần nói về áp lực đi làm thế nào?",
        "gloss": {
          "en": "Yeah, I thought so too. What did you think of the part about work pressure?",
          "ko": "응, 나도 그렇게 느꼈어. 직장 스트레스 얘기한 부분은 어땠어?"
        }
      },
      {
        "who": "me",
        "text": "Về mặt này thì mình thấy chương trình nói rất đúng. Người trẻ càng làm nhiều, càng ít thời gian cho bản thân.",
        "gloss": {
          "en": "On this point, I think the show got it right. The more young people work, the less time they have for themselves.",
          "ko": "이 부분에선 프로그램 말이 정말 맞는 것 같아. 젊은 사람들은 일을 많이 할수록 자기 시간이 줄어."
        },
        "frames": [
          "vi-f4-07",
          "vi-f4-04"
        ]
      },
      {
        "who": "them",
        "text": "Nhưng khách mời bảo là cứ cố gắng thì sẽ thành công.",
        "gloss": {
          "en": "But the guest said that if you keep trying, you'll succeed.",
          "ko": "근데 게스트는 계속 노력하면 성공한다고 했잖아."
        },
        "alt": [
          {
            "text": "Mình thì không đồng ý với khách mời lắm, bạn thì sao?",
            "gloss": {
              "en": "I don't really agree with the guest, what about you?",
              "ko": "난 게스트 말에 별로 동의 안 해, 넌?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Khó nói lắm. Chị ấy không những làm việc chăm chỉ mà còn rất may mắn.",
        "gloss": {
          "en": "It's hard to say. She not only worked hard but was also very lucky.",
          "ko": "말하기 어려워. 그분은 열심히 일했을 뿐 아니라 운도 정말 좋았잖아."
        },
        "frames": [
          "vi-f4-01"
        ]
      },
      {
        "who": "them",
        "text": "Đúng. Nhiều người cố mãi mà vẫn không thành công.",
        "gloss": {
          "en": "Right. Lots of people try forever and still don't make it.",
          "ko": "맞아. 계속 노력해도 성공 못 하는 사람이 많지."
        }
      },
      {
        "who": "me",
        "text": "Dù biết thế, mình vẫn thích cách chương trình động viên khán giả.",
        "gloss": {
          "en": "Even knowing that, I still like how the show encourages its viewers.",
          "ko": "그걸 알면서도 난 프로그램이 시청자를 응원하는 방식이 좋아."
        },
        "frames": [
          "vi-f4-02"
        ]
      },
      {
        "who": "them",
        "text": "Mà bạn có thấy MC hỏi hơi khó không?",
        "gloss": {
          "en": "And didn't you think the host's questions were a bit hard?",
          "ko": "근데 진행자 질문이 좀 어렵지 않았어?"
        },
        "alt": [
          {
            "text": "Còn MC thì sao, hỏi có khó quá không?",
            "gloss": {
              "en": "And the host, were the questions too hard?",
              "ko": "진행자는 어땠어, 질문이 너무 어렵지 않았어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Hơi khó, nhưng cũng hay. Ngoài ra, phần âm nhạc cuối chương trình rất cảm động.",
        "gloss": {
          "en": "A bit hard, but good too. Besides, the music at the end of the show was very moving.",
          "ko": "좀 어렵긴 했지만 괜찮았어. 그리고 마지막 음악 부분이 정말 감동적이었어."
        },
        "frames": [
          "vi-f4-05",
          "vi-f4-09"
        ]
      },
      {
        "who": "them",
        "text": "Tuần sau có tập về chuyện cha mẹ và con cái đấy.",
        "gloss": {
          "en": "Next week there's an episode about parents and children.",
          "ko": "다음 주엔 부모와 자식 이야기 회차래."
        }
      },
      {
        "who": "me",
        "text": "Thế thì chắc chắn mình sẽ xem. Chủ đề đó càng bàn càng thấy hay.",
        "gloss": {
          "en": "Then I'll definitely watch. The more you discuss that topic, the more interesting it gets.",
          "ko": "그럼 꼭 봐야지. 그 주제는 얘기할수록 재미있어."
        },
        "frames": [
          "vi-f4-04"
        ]
      },
      {
        "who": "them",
        "text": "Thế nói chung bạn chấm tập này mấy điểm?",
        "gloss": {
          "en": "So overall, how many points would you give this episode?",
          "ko": "그래서 전체적으로 이번 회차 몇 점 줄래?"
        }
      },
      {
        "who": "me",
        "text": "Tóm lại là tám trên mười: hơi dài, nhưng đáng xem.",
        "gloss": {
          "en": "In short, eight out of ten: a bit long, but worth watching.",
          "ko": "요약하면 십 점 만점에 팔 점이야. 좀 길지만 볼 만해."
        },
        "frames": [
          "vi-f4-16",
          "vi-f4-05"
        ]
      }
    ]
  },
  {
    "id": "vi-5-1",
    "stage": 5,
    "situation": 0,
    "setting": {
      "en": "At your colleague Nam's wedding, the MC invites you up to toast the couple on behalf of the office",
      "ko": "동료 남의 결혼식에서 사회자가 회사 대표로 축사를 청한다"
    },
    "goal": {
      "en": "Give a warm toast on behalf of your team: tease the groom kindly, praise him sincerely, and end with a proper wedding wish.",
      "ko": "팀을 대표해 따뜻한 축사를 한다: 신랑을 기분 좋게 놀리고, 진심으로 칭찬하고, 격식 있는 결혼 덕담으로 마무리한다."
    },
    "expressions": [
      "xin phép được",
      "thay mặt",
      "được cái là",
      "nói vui thôi",
      "trăm năm hạnh phúc",
      "ăn nên làm ra"
    ],
    "grammar": [
      0,
      1,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Và bây giờ, xin mời đại diện đồng nghiệp của chú rể lên phát biểu vài lời.",
        "gloss": {
          "en": "And now, we invite a representative of the groom's colleagues to say a few words.",
          "ko": "이제 신랑의 회사 동료 대표 한 분을 모셔 축사를 듣겠습니다."
        }
      },
      {
        "who": "me",
        "text": "Xin phép được thay mặt anh chị em phòng kinh doanh gửi lời chúc mừng đến anh Nam và chị Thu.",
        "gloss": {
          "en": "Allow me, on behalf of everyone in the sales department, to congratulate Nam and Thu.",
          "ko": "영업부 모든 동료를 대신해 남 씨와 투 씨에게 축하 인사를 드리겠습니다."
        },
        "frames": [
          "vi-f5-18",
          "vi-f5-19"
        ]
      },
      {
        "who": "them",
        "text": "Hay lắm! Kể chuyện anh Nam ở công ty đi!",
        "gloss": {
          "en": "Great! Tell us what Nam is like at work!",
          "ko": "좋아요! 회사에서 남 씨 얘기 좀 해 줘요!"
        }
      },
      {
        "who": "me",
        "text": "Anh Nam ở công ty thì nghiêm túc lắm. Chính anh ấy là người về muộn nhất phòng.",
        "gloss": {
          "en": "At work Nam is very serious. He's the very one who leaves the office last.",
          "ko": "회사에서 남 씨는 정말 진지해요. 사무실에서 제일 늦게 퇴근하는 사람이 바로 남 씨예요."
        },
        "frames": [
          "vi-f5-01"
        ]
      },
      {
        "who": "them",
        "text": "Thế sao lại cưới được chị Thu xinh thế?",
        "gloss": {
          "en": "Then how did he manage to marry someone as lovely as Thu?",
          "ko": "그런데 어떻게 그렇게 예쁜 투 씨랑 결혼했대요?"
        }
      },
      {
        "who": "me",
        "text": "Đấy cũng là câu hỏi của cả phòng đấy ạ! Ngay cả sếp cũng bất ngờ khi nhận thiệp cưới.",
        "gloss": {
          "en": "That's the whole department's question too! Even the boss was surprised when he got the invitation.",
          "ko": "그게 바로 저희 부서 전체의 궁금증이에요! 청첩장 받았을 때 사장님마저 놀라셨거든요."
        },
        "frames": [
          "vi-f5-02",
          "vi-f5-06"
        ]
      },
      {
        "who": "them",
        "text": "Ha ha! Thế chị Thu có biết anh Nam hay về muộn không?",
        "gloss": {
          "en": "Ha ha! So does Thu know Nam often comes home late?",
          "ko": "하하! 그럼 투 씨는 남 씨가 늦게 들어오는 걸 알아요?"
        }
      },
      {
        "who": "me",
        "text": "Biết chứ ạ. Chị Thu hiền hiền, nhẹ nhàng, nhưng được cái là rất biết cách bắt anh Nam về nhà đúng giờ.",
        "gloss": {
          "en": "Of course she does. Thu is gentle and soft-spoken, but the good thing is she knows exactly how to get Nam home on time.",
          "ko": "당연히 알죠. 투 씨는 순하고 다정하지만, 좋은 건 남 씨를 제시간에 집에 들어오게 하는 법을 잘 안다는 거예요."
        },
        "frames": [
          "vi-f5-05",
          "vi-f5-17"
        ]
      },
      {
        "who": "them",
        "text": "Đúng thế! Từ khi yêu chị Thu, anh Nam về sớm hẳn.",
        "gloss": {
          "en": "That's right! Since he fell for Thu, Nam goes home much earlier.",
          "ko": "맞아요! 투 씨를 만나고부터 남 씨가 확실히 일찍 들어가요."
        }
      },
      {
        "who": "me",
        "text": "Nói vui thôi ạ. Đối với chúng tôi, anh Nam là một người đồng nghiệp tận tâm và tốt bụng.",
        "gloss": {
          "en": "Just joking. For all of us, Nam is a dedicated and kind colleague.",
          "ko": "농담이에요. 저희에게 남 씨는 헌신적이고 마음씨 좋은 동료입니다."
        },
        "frames": [
          "vi-f5-09"
        ]
      },
      {
        "who": "them",
        "text": "Hay quá! Thế còn lời chúc thì sao?",
        "gloss": {
          "en": "Lovely! And what about your wish for them?",
          "ko": "멋져요! 그럼 축하 인사는요?"
        }
      },
      {
        "who": "me",
        "text": "Trong bối cảnh ai cũng bận rộn như bây giờ, tìm được một người thật sự hiểu mình là điều rất quý.",
        "gloss": {
          "en": "In times like these when everyone is so busy, finding someone who truly understands you is something precious.",
          "ko": "모두가 이렇게 바쁜 요즘 같은 때에, 나를 진심으로 이해해 주는 사람을 찾는 건 정말 귀한 일이에요."
        },
        "frames": [
          "vi-f5-10"
        ]
      },
      {
        "who": "them",
        "text": "Đúng rồi, nâng ly thôi!",
        "gloss": {
          "en": "That's right, let's raise our glasses!",
          "ko": "맞아요, 건배합시다!"
        }
      },
      {
        "who": "me",
        "text": "Vâng. Chúc hai anh chị trăm năm hạnh phúc, sớm có một em bé xinh xinh.",
        "gloss": {
          "en": "Yes. I wish you both a lifetime of happiness, and a lovely little baby soon.",
          "ko": "네. 두 분 백년해로하시고, 귀여운 아기도 빨리 생기길 바랍니다."
        }
      },
      {
        "who": "them",
        "text": "Một, hai, ba, dô!",
        "gloss": {
          "en": "One, two, three, cheers!",
          "ko": "하나, 둘, 셋, 건배!"
        }
      },
      {
        "who": "me",
        "text": "Và chúc anh chị làm ăn ngày càng ăn nên làm ra. Xin cảm ơn mọi người!",
        "gloss": {
          "en": "And may your fortunes keep growing. Thank you, everyone!",
          "ko": "그리고 하시는 일마다 번창하시길 바랍니다. 모두 감사합니다!"
        }
      }
    ]
  },
  {
    "id": "vi-5-2",
    "stage": 5,
    "situation": 1,
    "setting": {
      "en": "Your manager Quang offers you a team-lead post in Đà Nẵng, and you need to say no",
      "ko": "꽝 팀장이 다낭 팀장 자리를 제안하지만 거절해야 한다"
    },
    "goal": {
      "en": "Turn down the transfer without offending your manager: show gratitude, give a real reason, and offer a good alternative.",
      "ko": "팀장의 기분을 상하지 않게 전근 제안을 거절한다: 감사를 표하고, 진짜 이유를 말하고, 좋은 대안을 제시한다."
    },
    "expressions": [
      "nói thật lòng",
      "ngại quá",
      "biết là thế",
      "nể mặt",
      "cũng tùy",
      "đành vậy",
      "cứ từ từ"
    ],
    "grammar": [
      0,
      1,
      2,
      4
    ],
    "earlierGrammar": [
      "4:4",
      "3:6"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Em này, tháng sau anh muốn em sang phụ trách dự án ở Đà Nẵng. Cơ hội tốt đấy.",
        "gloss": {
          "en": "Listen, next month I'd like you to go and lead the project in Đà Nẵng. It's a good opportunity.",
          "ko": "있잖아, 다음 달에 다낭 프로젝트를 네가 맡아 줬으면 해. 좋은 기회야."
        }
      },
      {
        "who": "me",
        "text": "Dạ, em cảm ơn anh đã tin tưởng. Được anh nghĩ đến em là em mừng lắm rồi.",
        "gloss": {
          "en": "Thank you for trusting me. I'm already really glad you thought of me.",
          "ko": "믿어 주셔서 감사합니다. 저를 떠올려 주신 것만으로도 정말 기뻐요."
        }
      },
      {
        "who": "them",
        "text": "Thế thì nhận luôn đi. Ở đó lương cao hơn, lại được làm trưởng nhóm.",
        "gloss": {
          "en": "Then take it. The pay is higher there, and you'd be team lead.",
          "ko": "그럼 바로 받아. 거기가 월급도 더 높고 팀장도 되잖아."
        }
      },
      {
        "who": "me",
        "text": "Nói thật lòng, em cũng rất muốn. Không phải là em không thích thử thách, nhưng hoàn cảnh gia đình em bây giờ hơi khó.",
        "gloss": {
          "en": "Honestly, I'd really like to. It's not that I don't like a challenge, but my family situation right now is a bit difficult.",
          "ko": "솔직히 말씀드리면 저도 정말 하고 싶어요. 도전이 싫은 건 아닌데, 지금 집안 사정이 좀 어려워서요."
        },
        "frames": [
          "vi-f5-14",
          "vi-f5-12"
        ]
      },
      {
        "who": "them",
        "text": "Có chuyện gì à? Em cứ nói anh nghe.",
        "gloss": {
          "en": "Is something wrong? Go ahead and tell me.",
          "ko": "무슨 일 있어? 편하게 말해 봐."
        }
      },
      {
        "who": "me",
        "text": "Mẹ em vừa mổ xong, em muốn ở gần để chăm sóc ạ. Ngại quá, đúng lúc anh đang cần người.",
        "gloss": {
          "en": "My mother just had surgery, and I want to stay close to look after her. I feel so bad, right when you need someone.",
          "ko": "어머니가 막 수술을 받으셔서 가까이서 돌봐 드리고 싶어요. 하필 팀장님이 사람이 필요하실 때라 정말 죄송해요."
        }
      },
      {
        "who": "them",
        "text": "Anh hiểu. Nhưng anh đã nói với giám đốc là em sẽ đi rồi.",
        "gloss": {
          "en": "I understand. But I already told the director you'd go.",
          "ko": "이해해. 근데 이미 이사님께 네가 간다고 말씀드렸어."
        }
      },
      {
        "who": "me",
        "text": "Em biết là thế, và em rất nể mặt anh. Chính vì vậy em mới muốn nói thẳng với anh sớm.",
        "gloss": {
          "en": "I know that, and I really don't want to make you lose face. That's exactly why I wanted to tell you straight away.",
          "ko": "그건 알아요, 팀장님 체면도 정말 생각하고 있어요. 바로 그래서 일찍 솔직하게 말씀드리고 싶었어요."
        },
        "frames": [
          "vi-f5-15",
          "vi-f5-01"
        ]
      },
      {
        "who": "them",
        "text": "Hay em đi sáu tháng thôi rồi về?",
        "gloss": {
          "en": "How about going for just six months and then coming back?",
          "ko": "그럼 육 개월만 갔다 오는 건 어때?"
        }
      },
      {
        "who": "me",
        "text": "Sáu tháng thì cũng tùy tình hình sức khỏe của mẹ em ạ. Nhận rồi lại bỏ dở thì có phải giúp anh đâu.",
        "gloss": {
          "en": "Six months would depend on how my mother's health goes. Taking it on and then leaving it half-done wouldn't really be helping you, would it?",
          "ko": "육 개월은 어머니 건강 상태에 따라 다를 것 같아요. 맡았다가 중간에 그만두면 팀장님을 돕는 게 아니잖아요."
        },
        "frames": [
          "vi-f5-08"
        ]
      },
      {
        "who": "them",
        "text": "Ừ, em nói cũng phải. Vậy em có ai giới thiệu không?",
        "gloss": {
          "en": "Yes, you have a point. So is there anyone you'd recommend?",
          "ko": "그래, 네 말도 맞다. 그럼 추천할 사람 있어?"
        }
      },
      {
        "who": "me",
        "text": "Em nghĩ anh Đức hợp lắm. Anh ấy từng làm ở Đà Nẵng ba năm, lại nói chuyện với khách rất khéo.",
        "gloss": {
          "en": "I think Đức would be a great fit. He worked in Đà Nẵng for three years, and he's very good with clients.",
          "ko": "득 선배가 잘 맞을 것 같아요. 다낭에서 삼 년 일했고, 고객 응대도 정말 잘해요."
        }
      },
      {
        "who": "them",
        "text": "Đức à? Ừ, cũng được. Nhưng anh vẫn tiếc vì không phải em.",
        "gloss": {
          "en": "Đức? Yes, that could work. But I'm still sorry it's not you.",
          "ko": "득? 그래, 괜찮겠다. 그래도 네가 아니라서 아쉽네."
        }
      },
      {
        "who": "me",
        "text": "Em cũng tiếc lắm chứ ạ. Nhưng đành vậy, khi nào mẹ em khỏe, có dự án nào anh cứ gọi em nhé.",
        "gloss": {
          "en": "I'm really sorry too, of course. But it can't be helped. Once my mother is well, call me for any project.",
          "ko": "저도 당연히 정말 아쉬워요. 하지만 어쩔 수 없죠. 어머니가 나으시면 어떤 프로젝트든 불러 주세요."
        },
        "frames": [
          "vi-f5-05"
        ]
      },
      {
        "who": "them",
        "text": "Được rồi. Cứ lo cho mẹ trước đã.",
        "gloss": {
          "en": "All right. Take care of your mother first.",
          "ko": "알았어. 일단 어머니부터 챙겨."
        }
      },
      {
        "who": "me",
        "text": "Dạ, em cảm ơn anh nhiều. Việc bàn giao thì anh cứ từ từ, em sẽ hỗ trợ anh Đức hết sức.",
        "gloss": {
          "en": "Thank you so much. Take your time with the handover; I'll support Đức as much as I can.",
          "ko": "정말 감사합니다. 인수인계는 천천히 하셔도 돼요, 득 선배를 최선을 다해 도울게요."
        }
      }
    ]
  },
  {
    "id": "vi-5-3",
    "stage": 5,
    "situation": 2,
    "setting": {
      "en": "Voice messages in a group chat with old school friends before a class reunion",
      "ko": "동창회 전, 옛 학교 친구들 단톡방에서 음성 메시지 주고받기"
    },
    "goal": {
      "en": "Tease a friend who always leaves things to the last minute, then smooth things over when someone pretends to be offended, keeping the chat light.",
      "ko": "늘 막판에 일을 처리하는 친구를 놀리고, 삐진 척하는 친구를 달래며 단톡방 분위기를 가볍게 유지한다."
    },
    "expressions": [
      "trời ơi",
      "nước đến chân mới nhảy",
      "đâu vào đấy",
      "một công đôi việc",
      "thôi bỏ đi",
      "chuyện nhỏ"
    ],
    "grammar": [
      1,
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Các cậu ơi, thứ bảy họp lớp mà Tùng vẫn chưa đặt nhà hàng à?",
        "gloss": {
          "en": "Guys, the reunion is on Saturday and Tùng still hasn't booked a restaurant?",
          "ko": "얘들아, 토요일이 동창회인데 퉁이 아직 식당 예약을 안 했어?"
        }
      },
      {
        "who": "me",
        "text": "Trời ơi, lại thế à? Tùng nhà mình đúng kiểu nước đến chân mới nhảy.",
        "gloss": {
          "en": "Oh my god, again? Our Tùng only ever moves when the water reaches his feet.",
          "ko": "아이고, 또야? 우리 퉁은 딱 발등에 불 떨어져야 움직이는 타입이야."
        }
      },
      {
        "who": "them",
        "text": "Ơ kìa, tớ đặt rồi mà! Chỉ là chưa báo thôi.",
        "gloss": {
          "en": "Hey, I did book it! I just hadn't told you.",
          "ko": "야, 나 예약했거든! 아직 말을 안 했을 뿐이야."
        }
      },
      {
        "who": "me",
        "text": "Đặt rồi cơ á? Sao lại không nói sớm cho cả nhóm đỡ lo?",
        "gloss": {
          "en": "You booked it already? Then why didn't you say so earlier and spare us all the worry?",
          "ko": "벌써 했다고? 그럼 왜 일찍 말 안 해서 다들 걱정하게 해?"
        },
        "frames": [
          "vi-f5-07"
        ]
      },
      {
        "who": "them",
        "text": "Tại tớ muốn tạo bất ngờ. Yên tâm, có tớ lo hết.",
        "gloss": {
          "en": "I wanted it to be a surprise. Relax, I've got everything covered.",
          "ko": "깜짝 놀래 주려고 그랬지. 걱정 마, 내가 다 알아서 해."
        }
      },
      {
        "who": "me",
        "text": "Có cậu lo nên bọn tớ mới lo đấy. Nhưng thôi, miễn là mọi thứ đâu vào đấy là được.",
        "gloss": {
          "en": "It's because you're in charge that we're worried. But fine, as long as everything's in order.",
          "ko": "네가 맡아서 우리가 걱정하는 거야. 그래도 뭐, 다 제대로만 되면 됐어."
        },
        "frames": [
          "vi-f5-06"
        ]
      },
      {
        "who": "them",
        "text": "Ha ha. À, ai mang loa với micro đi hát?",
        "gloss": {
          "en": "Ha ha. Oh, who's bringing the speaker and mic for singing?",
          "ko": "하하. 아, 노래할 스피커랑 마이크는 누가 가져와?"
        }
      },
      {
        "who": "me",
        "text": "Để tớ mang. Tớ đi qua nhà Hoa đón cậu ấy luôn, một công đôi việc.",
        "gloss": {
          "en": "I'll bring them. I'll swing by Hoa's and pick her up too, two birds with one stone.",
          "ko": "내가 가져갈게. 가는 길에 호아네 들러서 데려가면 일석이조지."
        }
      },
      {
        "who": "them",
        "text": "Cảm ơn nhé! Mà đừng đến sớm quá, tớ còn phải trang điểm.",
        "gloss": {
          "en": "Thanks! But don't come too early, I still have to do my make-up.",
          "ko": "고마워! 근데 너무 일찍 오지 마, 화장해야 하거든."
        }
      },
      {
        "who": "me",
        "text": "Trang điểm nhè nhẹ thôi nhé, kẻo lại muộn như năm ngoái.",
        "gloss": {
          "en": "Keep the make-up light, or you'll be late again like last year.",
          "ko": "화장은 살짝만 해, 작년처럼 또 늦지 말고."
        },
        "frames": [
          "vi-f5-13"
        ]
      },
      {
        "who": "them",
        "text": "Năm ngoái có phải lỗi của tớ đâu! Tại tắc đường mà.",
        "gloss": {
          "en": "Last year wasn't my fault! It was the traffic.",
          "ko": "작년엔 내 잘못이 아니었거든! 길이 막혀서 그랬지."
        }
      },
      {
        "who": "me",
        "text": "Ừ ừ, tắc đường từ phòng ngủ ra đến cửa chứ gì!",
        "gloss": {
          "en": "Yeah, yeah, the traffic from your bedroom to the front door, right!",
          "ko": "그래그래, 침실에서 현관까지 길이 막혔겠지!"
        },
        "frames": [
          "vi-f5-05"
        ]
      },
      {
        "who": "them",
        "text": "Hứ, giận rồi đấy. Không cho cậu đón nữa.",
        "gloss": {
          "en": "Hmph, now I'm offended. You're not picking me up anymore.",
          "ko": "흥, 삐졌어. 이제 너랑 안 가."
        }
      },
      {
        "who": "me",
        "text": "Thôi bỏ đi mà, tớ xin lỗi. Tối thứ bảy tớ mua trà sữa đền nhé.",
        "gloss": {
          "en": "Come on, let it go, I'm sorry. I'll buy you bubble tea on Saturday night to make up for it.",
          "ko": "에이 그만 풀어, 미안해. 토요일 저녁에 버블티 사 줄게."
        }
      },
      {
        "who": "them",
        "text": "Một cốc trà sữa mà đòi xong à? Hai cốc!",
        "gloss": {
          "en": "You think one bubble tea settles it? Two!",
          "ko": "버블티 한 잔으로 끝내려고? 두 잔!"
        }
      },
      {
        "who": "me",
        "text": "Chuyện nhỏ! Ba cốc cũng được, miễn là bạn Hoa đừng giận nữa.",
        "gloss": {
          "en": "No problem at all! Even three, as long as dear Hoa isn't cross anymore.",
          "ko": "그 정도야 뭐! 세 잔도 돼, 우리 호아만 안 삐지면."
        }
      }
    ]
  },
  {
    "id": "vi-5-4",
    "stage": 5,
    "situation": 3,
    "setting": {
      "en": "After a film, chatting with two friends from Saigon about what you watched",
      "ko": "영화를 본 뒤 사이공 출신 친구 둘과 영화 이야기하기"
    },
    "goal": {
      "en": "Share your honest view of the film's ending, disagree politely with your Saigon friends, and keep up with their Southern way of speaking.",
      "ko": "영화 결말에 대한 솔직한 생각을 말하고, 사이공 친구들과 공손하게 의견을 달리하며, 남부식 말투를 따라간다."
    },
    "expressions": [
      "nói gì thì nói"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bạn coi phim 'Mưa trên phố cũ' chưa? Quay ở Sài Gòn đó, đẹp lắm.",
        "gloss": {
          "en": "Have you seen 'Rain on the Old Street'? It was shot in Saigon, it's beautiful.",
          "ko": "'옛 거리의 비' 봤어? 사이공에서 찍었는데 정말 예뻐."
        }
      },
      {
        "who": "me",
        "text": "Mình xem rồi. Cảnh mưa ở chợ Bến Thành lành lạnh, buồn buồn, đúng là rất đẹp.",
        "gloss": {
          "en": "I've seen it. The rain scene at Bến Thành market, a bit chilly and a little sad, was really beautiful.",
          "ko": "봤어. 벤탄 시장 비 오는 장면이 쌀쌀하고 좀 쓸쓸한 게 정말 예뻤어."
        }
      },
      {
        "who": "them",
        "text": "Đó, tui nói rồi mà. Mà bạn thấy kết phim sao?",
        "gloss": {
          "en": "See, I told you. So what did you think of the ending?",
          "ko": "거봐, 내가 말했잖아. 근데 결말은 어땠어?"
        }
      },
      {
        "who": "me",
        "text": "Nói gì thì nói, mình vẫn thấy cái kết hơi vội. Đến cả nhân vật chính cũng chưa kịp nói lời tạm biệt.",
        "gloss": {
          "en": "Whatever anyone says, I still think the ending was a bit rushed. Even the main character didn't get to say goodbye.",
          "ko": "누가 뭐래도 난 결말이 좀 급했다고 봐. 주인공조차 작별 인사할 틈이 없었잖아."
        },
        "frames": [
          "vi-f5-16",
          "vi-f5-03"
        ]
      },
      {
        "who": "them",
        "text": "Vội đâu! Đạo diễn cố ý để khán giả tự nghĩ đó.",
        "gloss": {
          "en": "It wasn't rushed! The director did it on purpose so the audience would think for themselves.",
          "ko": "급하긴! 감독이 일부러 관객이 생각하게 남겨 둔 거야."
        }
      },
      {
        "who": "me",
        "text": "Biết là vậy, nhưng mình vẫn muốn thêm vài phút nữa cơ.",
        "gloss": {
          "en": "I know, but I still wanted a few more minutes.",
          "ko": "그건 아는데, 그래도 몇 분만 더 있었으면 했단 말이야."
        },
        "frames": [
          "vi-f5-15"
        ]
      },
      {
        "who": "them",
        "text": "Ha, người Bắc khó tính ghê. Vậy diễn viên thì sao?",
        "gloss": {
          "en": "Ha, you Northerners are so picky. What about the actors?",
          "ko": "하, 북부 사람들 진짜 까다롭다. 그럼 배우들은?"
        }
      },
      {
        "who": "me",
        "text": "Diễn viên thì không chê vào đâu được. Chính cô ấy làm cả rạp khóc.",
        "gloss": {
          "en": "The acting was beyond criticism. She's the one who made the whole cinema cry.",
          "ko": "배우들은 흠잡을 데가 없었어. 극장 전체를 울린 게 바로 그 여배우야."
        },
        "frames": [
          "vi-f5-01"
        ]
      },
      {
        "who": "them",
        "text": "Đúng rồi, cảnh cô ấy ngồi khóc ở bến xe, tui khóc theo luôn.",
        "gloss": {
          "en": "Right, the scene where she sits crying at the bus station, I cried along with her.",
          "ko": "맞아, 그 여자가 버스 터미널에서 우는 장면에서 나도 따라 울었어."
        }
      },
      {
        "who": "me",
        "text": "Mà mình hỏi thật, ở Sài Gòn người ta có nói nhanh như trong phim không? Mình nghe không kịp ấy.",
        "gloss": {
          "en": "Seriously though, do people in Saigon really talk as fast as in the film? I couldn't keep up.",
          "ko": "근데 진짜 궁금한데, 사이공 사람들 정말 영화처럼 말이 빨라? 난 못 따라가겠더라."
        }
      },
      {
        "who": "them",
        "text": "Có chứ! Người Sài Gòn nói nhanh vậy đó. Bạn nghe quen là được.",
        "gloss": {
          "en": "Sure! Saigon people talk that fast. You'll be fine once you get used to it.",
          "ko": "그럼! 사이공 사람들 원래 그렇게 빨라. 익숙해지면 돼."
        }
      },
      {
        "who": "me",
        "text": "Không phải là mình không thích giọng miền Nam, nhưng phải xem lại lần nữa mới hiểu hết.",
        "gloss": {
          "en": "It's not that I don't like the Southern accent, but I'll need to watch it again to understand everything.",
          "ko": "남부 말투가 싫은 건 아닌데, 다 이해하려면 한 번 더 봐야겠어."
        },
        "frames": [
          "vi-f5-12"
        ]
      },
      {
        "who": "them",
        "text": "Vậy cuối tuần coi lại với tụi tui nha? Có phụ đề nữa.",
        "gloss": {
          "en": "Then watch it again with us this weekend? There'll be subtitles too.",
          "ko": "그럼 주말에 우리랑 다시 볼래? 자막도 있어."
        }
      },
      {
        "who": "me",
        "text": "Sao lại không? Đối với người học tiếng Việt như mình, đây là cơ hội tốt mà.",
        "gloss": {
          "en": "Why not? For someone learning Vietnamese like me, it's a great chance.",
          "ko": "왜 안 되겠어? 나처럼 베트남어 배우는 사람한테는 좋은 기회잖아."
        },
        "frames": [
          "vi-f5-07",
          "vi-f5-09"
        ]
      },
      {
        "who": "them",
        "text": "Vậy chốt nha. Thứ bảy, bảy giờ tối, rạp ở quận Một.",
        "gloss": {
          "en": "Then it's settled. Saturday, seven in the evening, the cinema in District One.",
          "ko": "그럼 정했다. 토요일 저녁 일곱 시, 일군 극장."
        }
      },
      {
        "who": "me",
        "text": "Được, mình sẽ mua bắp rang. Nhưng nói trước, lần này mình không khóc đâu đấy!",
        "gloss": {
          "en": "Great, I'll buy the popcorn. But I'm telling you now, this time I'm not going to cry!",
          "ko": "좋아, 팝콘은 내가 살게. 근데 미리 말하는데, 이번엔 안 울 거야!"
        },
        "frames": [
          "vi-f5-06"
        ]
      }
    ]
  }
];
