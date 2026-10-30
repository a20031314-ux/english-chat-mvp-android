import type { StageScript } from "../../stageScripts.ts";

/**
 * vi 대본 은행(2026-10-30 사용자 "여러 개 만들어 두고 추천" → A: 지금 단계 이하에서) — 단계 조건·상황 목록과 따로, 오늘 할 것 끝의 대화 한 칸으로 추천(curriculum/scriptBank.ts).
 * 1~3단계 20개씩, 줄 8개, 내 줄에 그 단계 이하 틀 태그. Claude가 쓰고 scripts/script-bank.ts로 검사, 원어민 확인 전.
 */
export const VI_BANK: StageScript[] = [
  {
    "id": "vi-1-b01",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a café counter",
      "ko": "카페 계산대에서"
    },
    "expressions": [
      "cảm ơn",
      "hẹn gặp lại"
    ],
    "grammar": [
      1,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Chào bạn! Bạn uống gì?",
        "gloss": {
          "en": "Hi! What would you like to drink?",
          "ko": "안녕하세요! 뭐 마실래요?"
        }
      },
      {
        "who": "me",
        "text": "Cho tôi một cốc cà phê sữa đá.",
        "gloss": {
          "en": "An iced milk coffee, please.",
          "ko": "연유 아이스커피 한 잔 주세요."
        },
        "frames": [
          "vi-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Uống ở đây hay mang về?",
        "gloss": {
          "en": "For here or to go?",
          "ko": "여기서 드세요, 가져가세요?"
        }
      },
      {
        "who": "me",
        "text": "Mang về. Cốc này bao nhiêu tiền?",
        "gloss": {
          "en": "To go. How much is it?",
          "ko": "가져갈게요. 이거 얼마예요?"
        },
        "frames": [
          "vi-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Ba mươi lăm nghìn.",
        "gloss": {
          "en": "Thirty-five thousand.",
          "ko": "삼만 오천 동이에요."
        }
      },
      {
        "who": "me",
        "text": "Đây ạ. Cảm ơn chị.",
        "gloss": {
          "en": "Here you go. Thank you.",
          "ko": "여기요. 고마워요."
        },
        "frames": [
          "vi-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Không có gì. Cà phê của bạn đây.",
        "gloss": {
          "en": "You're welcome. Here's your coffee.",
          "ko": "천만에요. 커피 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "Hẹn gặp lại chị.",
        "gloss": {
          "en": "See you again.",
          "ko": "또 봐요."
        },
        "frames": [
          "vi-f1-16"
        ]
      }
    ]
  },
  {
    "id": "vi-1-b02",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Meeting a classmate on the first day at university",
      "ko": "대학교 첫날 같은 반 친구를 만나다"
    },
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
    "expressions": [
      "xin chào",
      "rất vui được gặp",
      "tôi là người Hàn Quốc"
    ],
    "grammar": [
      0,
      1,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Xin chào! Bạn là sinh viên mới à?",
        "gloss": {
          "en": "Hello! Are you a new student?",
          "ko": "안녕하세요! 새로 온 학생이에요?"
        }
      },
      {
        "who": "me",
        "text": "Xin chào. Vâng, tôi tên là Min-ho.",
        "gloss": {
          "en": "Hello. Yes, my name is Min-ho.",
          "ko": "안녕하세요. 네, 제 이름은 민호예요."
        },
        "frames": [
          "vi-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "Rất vui được gặp bạn. Tôi là Lan.",
        "gloss": {
          "en": "Nice to meet you. I'm Lan.",
          "ko": "만나서 반가워요. 저는 란이에요."
        }
      },
      {
        "who": "me",
        "text": "Rất vui được gặp bạn, Lan.",
        "gloss": {
          "en": "Nice to meet you, Lan.",
          "ko": "만나서 반가워요, 란."
        }
      },
      {
        "who": "them",
        "text": "Bạn là người nước nào?",
        "gloss": {
          "en": "Where are you from?",
          "ko": "어느 나라 사람이에요?"
        }
      },
      {
        "who": "me",
        "text": "Tôi là người Hàn Quốc.",
        "gloss": {
          "en": "I'm Korean.",
          "ko": "저는 한국 사람이에요."
        },
        "frames": [
          "vi-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "Ồ, hay quá! Bạn học tiếng Việt lâu chưa?",
        "gloss": {
          "en": "Oh, great! Have you studied Vietnamese long?",
          "ko": "와, 좋네요! 베트남어 오래 배웠어요?"
        }
      },
      {
        "who": "me",
        "text": "Chưa lâu. Tôi là người mới học.",
        "gloss": {
          "en": "Not long. I'm a beginner.",
          "ko": "오래 안 됐어요. 저는 초보예요."
        },
        "frames": [
          "vi-f1-01"
        ]
      }
    ]
  },
  {
    "id": "vi-1-b03",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Looking for the toilet in a restaurant",
      "ko": "식당에서 화장실 찾기"
    },
    "expressions": [
      "xin lỗi",
      "cảm ơn"
    ],
    "grammar": [
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bạn cần gì ạ?",
        "gloss": {
          "en": "Can I help you?",
          "ko": "뭐 필요하세요?"
        }
      },
      {
        "who": "me",
        "text": "Xin lỗi, ở đây có nhà vệ sinh không?",
        "gloss": {
          "en": "Excuse me, is there a toilet here?",
          "ko": "실례지만, 여기 화장실 있어요?"
        },
        "frames": [
          "vi-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Có ạ.",
        "gloss": {
          "en": "Yes, there is.",
          "ko": "네, 있어요."
        }
      },
      {
        "who": "me",
        "text": "Nhà vệ sinh ở đâu?",
        "gloss": {
          "en": "Where is the toilet?",
          "ko": "화장실은 어디예요?"
        },
        "frames": [
          "vi-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Ở tầng hai, bên trái.",
        "gloss": {
          "en": "On the second floor, on the left.",
          "ko": "이 층 왼쪽에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Tầng hai à? Cảm ơn anh.",
        "gloss": {
          "en": "The second floor? Thank you.",
          "ko": "이 층이요? 고마워요."
        },
        "frames": [
          "vi-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Không có gì. Cầu thang ở kia.",
        "gloss": {
          "en": "No problem. The stairs are over there.",
          "ko": "별말씀을요. 계단은 저쪽이에요."
        }
      },
      {
        "who": "me",
        "text": "Vâng, tôi thấy rồi.",
        "gloss": {
          "en": "OK, I see it.",
          "ko": "네, 보여요."
        }
      }
    ]
  },
  {
    "id": "vi-1-b04",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "A taxi driver who talks too fast",
      "ko": "말이 빠른 택시 기사님과"
    },
    "expressions": [
      "tôi không hiểu",
      "nói chậm thôi",
      "không sao"
    ],
    "grammar": [
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Chào bạn, bạn đi đâu?",
        "gloss": {
          "en": "Hello, where are you going?",
          "ko": "안녕하세요, 어디 가세요?"
        }
      },
      {
        "who": "me",
        "text": "Chào anh. Tôi ở khách sạn Hoa Sen.",
        "gloss": {
          "en": "Hello. I'm staying at the Hoa Sen Hotel.",
          "ko": "안녕하세요. 저는 호아센 호텔에 묵어요."
        },
        "frames": [
          "vi-f1-04",
          "vi-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "Khách sạn Hoa Sen ở phố nào, gần chợ hay gần hồ?",
        "gloss": {
          "en": "Which street is the Hoa Sen Hotel on, near the market or the lake?",
          "ko": "호아센 호텔이 어느 거리에 있어요, 시장 근처예요, 호수 근처예요?"
        }
      },
      {
        "who": "me",
        "text": "Xin lỗi, tôi không hiểu. Anh nói chậm thôi.",
        "gloss": {
          "en": "Sorry, I don't understand. Please speak more slowly.",
          "ko": "죄송해요, 이해를 못 했어요. 천천히 말해 주세요."
        },
        "frames": [
          "vi-f1-11",
          "vi-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "Gần chợ hay gần hồ?",
        "gloss": {
          "en": "Near the market or near the lake?",
          "ko": "시장 근처요, 호수 근처요?"
        }
      },
      {
        "who": "me",
        "text": "Gần hồ. Tôi có địa chỉ đây.",
        "gloss": {
          "en": "Near the lake. I have the address here.",
          "ko": "호수 근처요. 주소 여기 있어요."
        },
        "frames": [
          "vi-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "À, tôi biết rồi. Đi thôi.",
        "gloss": {
          "en": "Ah, I know it. Let's go.",
          "ko": "아, 알겠어요. 가요."
        }
      },
      {
        "who": "me",
        "text": "Không sao. Cảm ơn anh.",
        "gloss": {
          "en": "That's fine. Thank you.",
          "ko": "괜찮아요. 고마워요."
        },
        "frames": [
          "vi-f1-15"
        ]
      }
    ]
  },
  {
    "id": "vi-1-b05",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Checking in at a hotel",
      "ko": "호텔 체크인"
    },
    "expressions": [
      "chào chị"
    ],
    "grammar": [
      1,
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Xin chào, bạn cần giúp gì ạ?",
        "gloss": {
          "en": "Hello, how can I help you?",
          "ko": "안녕하세요, 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Chào chị. Tôi có đặt một phòng.",
        "gloss": {
          "en": "Hello. I have a room booked.",
          "ko": "안녕하세요. 방 하나 예약했어요."
        },
        "frames": [
          "vi-f1-04",
          "vi-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Vâng, cho tôi xem hộ chiếu.",
        "gloss": {
          "en": "Sure, may I see your passport?",
          "ko": "네, 여권 좀 보여 주세요."
        }
      },
      {
        "who": "me",
        "text": "Đây ạ. Ở đây có wifi không?",
        "gloss": {
          "en": "Here it is. Is there wifi here?",
          "ko": "여기요. 여기 와이파이 있어요?"
        },
        "frames": [
          "vi-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Có. Mật khẩu ở trên thẻ này.",
        "gloss": {
          "en": "Yes. The password is on this card.",
          "ko": "있어요. 비밀번호는 이 카드에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Vâng. Thang máy ở đâu?",
        "gloss": {
          "en": "OK. Where's the lift?",
          "ko": "네. 엘리베이터는 어디예요?"
        },
        "frames": [
          "vi-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Ở bên phải. Phòng bạn ở tầng năm.",
        "gloss": {
          "en": "On the right. Your room is on the fifth floor.",
          "ko": "오른쪽에 있어요. 방은 오 층이에요."
        }
      },
      {
        "who": "me",
        "text": "Cảm ơn chị.",
        "gloss": {
          "en": "Thank you.",
          "ko": "고마워요."
        },
        "frames": [
          "vi-f1-15"
        ]
      }
    ]
  },
  {
    "id": "vi-1-b06",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Greeting a neighbour in the lift in the morning",
      "ko": "아침에 엘리베이터에서 이웃과 인사하기"
    },
    "expressions": [
      "chào anh",
      "hẹn gặp lại"
    ],
    "grammar": [
      1,
      2,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Chào bạn! Bạn đi làm à?",
        "gloss": {
          "en": "Hi! Off to work?",
          "ko": "안녕하세요! 출근하세요?"
        }
      },
      {
        "who": "me",
        "text": "Chào anh. Anh có khỏe không?",
        "gloss": {
          "en": "Hi. How are you?",
          "ko": "안녕하세요. 잘 지내세요?"
        },
        "frames": [
          "vi-f1-04",
          "vi-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Tôi khỏe. Bạn ở tầng mấy?",
        "gloss": {
          "en": "I'm well. Which floor do you live on?",
          "ko": "잘 지내요. 몇 층에 사세요?"
        }
      },
      {
        "who": "me",
        "text": "Tôi ở tầng ba.",
        "gloss": {
          "en": "I live on the third floor.",
          "ko": "삼 층에 살아요."
        },
        "frames": [
          "vi-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "Tối qua tôi nghe thấy tiếng chó. Của bạn à?",
        "gloss": {
          "en": "I heard a dog last night. Is it yours?",
          "ko": "어젯밤에 개 소리가 들렸는데, 그쪽 개예요?"
        }
      },
      {
        "who": "me",
        "text": "Vâng, tôi có một con chó nhỏ.",
        "gloss": {
          "en": "Yes, I have a little dog.",
          "ko": "네, 작은 개 한 마리 있어요."
        },
        "frames": [
          "vi-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Không sao. Con chó dễ thương lắm.",
        "gloss": {
          "en": "That's OK. It's very cute.",
          "ko": "괜찮아요. 개가 참 귀엽던데요."
        }
      },
      {
        "who": "me",
        "text": "Cảm ơn anh. Hẹn gặp lại anh.",
        "gloss": {
          "en": "Thank you. See you later.",
          "ko": "고마워요. 또 봬요."
        },
        "frames": [
          "vi-f1-15",
          "vi-f1-16"
        ]
      }
    ]
  },
  {
    "id": "vi-1-b07",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying mangoes at a market stall",
      "ko": "시장 노점에서 망고 사기"
    },
    "expressions": [
      "bao nhiêu tiền",
      "đắt quá",
      "cảm ơn"
    ],
    "grammar": [
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Mua gì đi em! Xoài ngon lắm.",
        "gloss": {
          "en": "Buy something! The mangoes are very good.",
          "ko": "뭐 사 가요! 망고가 아주 맛있어요."
        }
      },
      {
        "who": "me",
        "text": "Chào chị. Xoài này bao nhiêu tiền?",
        "gloss": {
          "en": "Hello. How much are these mangoes?",
          "ko": "안녕하세요. 이 망고 얼마예요?"
        },
        "frames": [
          "vi-f1-04",
          "vi-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Sáu mươi nghìn một cân.",
        "gloss": {
          "en": "Sixty thousand a kilo.",
          "ko": "일 킬로에 육만 동이에요."
        }
      },
      {
        "who": "me",
        "text": "Đắt quá! Năm mươi nghìn, được không?",
        "gloss": {
          "en": "Too expensive! Fifty thousand, OK?",
          "ko": "너무 비싸요! 오만 동 어때요?"
        }
      },
      {
        "who": "them",
        "text": "Thôi được. Em lấy mấy quả?",
        "gloss": {
          "en": "All right. How many do you want?",
          "ko": "좋아요. 몇 개 줄까요?"
        }
      },
      {
        "who": "me",
        "text": "Cho tôi hai quả xoài này.",
        "gloss": {
          "en": "These two mangoes, please.",
          "ko": "이 망고 두 개 주세요."
        },
        "frames": [
          "vi-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Của em đây.",
        "gloss": {
          "en": "Here you are.",
          "ko": "여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "Cảm ơn chị.",
        "gloss": {
          "en": "Thank you.",
          "ko": "고마워요."
        },
        "frames": [
          "vi-f1-15"
        ]
      }
    ]
  },
  {
    "id": "vi-1-b08",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "A phone call from a delivery driver",
      "ko": "배달 기사님의 전화"
    },
    "expressions": [
      "nói chậm thôi",
      "vâng"
    ],
    "grammar": [
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Alô, tôi giao hàng. Bạn ở nhà không?",
        "gloss": {
          "en": "Hello, I'm delivering a package. Are you home?",
          "ko": "여보세요, 택배예요. 집에 계세요?"
        }
      },
      {
        "who": "me",
        "text": "Vâng, tôi ở nhà.",
        "gloss": {
          "en": "Yes, I'm at home.",
          "ko": "네, 집에 있어요."
        },
        "frames": [
          "vi-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "Tôi ở cổng rồi, bạn xuống lấy hàng nhé, tôi không lên được.",
        "gloss": {
          "en": "I'm at the gate. Please come down for it, I can't come up.",
          "ko": "지금 정문이에요, 내려와서 받아 가세요, 저는 못 올라가요."
        }
      },
      {
        "who": "me",
        "text": "Xin lỗi, anh nói chậm thôi.",
        "gloss": {
          "en": "Sorry, please speak more slowly.",
          "ko": "죄송해요, 천천히 말해 주세요."
        },
        "frames": [
          "vi-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "Bạn xuống cổng nhé.",
        "gloss": {
          "en": "Please come down to the gate.",
          "ko": "정문으로 내려오세요."
        }
      },
      {
        "who": "me",
        "text": "Vâng. Tôi không biết cổng nào.",
        "gloss": {
          "en": "OK. I don't know which gate.",
          "ko": "네. 어느 문인지 모르겠어요."
        },
        "frames": [
          "vi-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Cổng chính, gần quán cà phê.",
        "gloss": {
          "en": "The main gate, near the café.",
          "ko": "정문이요, 카페 근처요."
        }
      },
      {
        "who": "me",
        "text": "Vâng, cảm ơn anh.",
        "gloss": {
          "en": "OK, thank you.",
          "ko": "네, 고마워요."
        },
        "frames": [
          "vi-f1-15"
        ]
      }
    ]
  },
  {
    "id": "vi-1-b09",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Asking the way to the bus stop",
      "ko": "버스 정류장 가는 길 묻기"
    },
    "expressions": [
      "xin lỗi",
      "cảm ơn"
    ],
    "grammar": [
      3,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bạn tìm gì à?",
        "gloss": {
          "en": "Are you looking for something?",
          "ko": "뭐 찾으세요?"
        }
      },
      {
        "who": "me",
        "text": "Xin lỗi chị, bến xe buýt ở đâu?",
        "gloss": {
          "en": "Excuse me, where is the bus stop?",
          "ko": "실례지만, 버스 정류장이 어디예요?"
        },
        "frames": [
          "vi-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Đi thẳng, rồi rẽ phải.",
        "gloss": {
          "en": "Go straight, then turn right.",
          "ko": "쭉 가서 오른쪽으로 도세요."
        }
      },
      {
        "who": "me",
        "text": "Ở đây có bản đồ không?",
        "gloss": {
          "en": "Is there a map here?",
          "ko": "여기 지도 있어요?"
        },
        "frames": [
          "vi-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Không có. Bạn có điện thoại không?",
        "gloss": {
          "en": "No. Do you have a phone?",
          "ko": "없어요. 휴대폰 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Có, tôi có điện thoại, nhưng không có mạng.",
        "gloss": {
          "en": "Yes, I have a phone, but no internet.",
          "ko": "네, 휴대폰은 있는데 인터넷이 안 돼요."
        },
        "frames": [
          "vi-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Không sao, gần lắm. Năm phút thôi.",
        "gloss": {
          "en": "No problem, it's very close. Just five minutes.",
          "ko": "괜찮아요, 아주 가까워요. 오 분이면 돼요."
        }
      },
      {
        "who": "me",
        "text": "Cảm ơn chị nhiều.",
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
    "id": "vi-1-b10",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "First day at a new office",
      "ko": "새 회사 첫 출근"
    },
    "expressions": [
      "chào anh",
      "rất vui được gặp",
      "hẹn gặp lại"
    ],
    "grammar": [
      0,
      1,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Chào bạn. Bạn là nhân viên mới à?",
        "gloss": {
          "en": "Hi. Are you the new staff member?",
          "ko": "안녕하세요. 새로 온 직원이세요?"
        }
      },
      {
        "who": "me",
        "text": "Chào anh. Vâng, tôi là nhân viên mới.",
        "gloss": {
          "en": "Hi. Yes, I'm the new staff member.",
          "ko": "안녕하세요. 네, 새로 온 직원이에요."
        },
        "frames": [
          "vi-f1-04",
          "vi-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "Rất vui được gặp bạn. Tôi là Nam.",
        "gloss": {
          "en": "Nice to meet you. I'm Nam.",
          "ko": "만나서 반가워요. 저는 남이에요."
        }
      },
      {
        "who": "me",
        "text": "Rất vui được gặp anh. Anh là người Hà Nội à?",
        "gloss": {
          "en": "Nice to meet you. Are you from Hanoi?",
          "ko": "만나서 반가워요. 하노이 사람이세요?"
        }
      },
      {
        "who": "them",
        "text": "Không, tôi là người Huế. Còn bạn?",
        "gloss": {
          "en": "No, I'm from Huế. And you?",
          "ko": "아니요, 저는 후에 사람이에요. 당신은요?"
        }
      },
      {
        "who": "me",
        "text": "Tôi là người Hàn Quốc.",
        "gloss": {
          "en": "I'm Korean.",
          "ko": "저는 한국 사람이에요."
        },
        "frames": [
          "vi-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "Hay quá. Thôi, tôi đi họp đây.",
        "gloss": {
          "en": "Great. Well, I'm off to a meeting.",
          "ko": "좋네요. 그럼 저는 회의 가 볼게요."
        }
      },
      {
        "who": "me",
        "text": "Vâng. Hẹn gặp lại anh.",
        "gloss": {
          "en": "OK. See you later.",
          "ko": "네. 또 봬요."
        },
        "frames": [
          "vi-f1-16"
        ]
      }
    ]
  },
  {
    "id": "vi-1-b11",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying a shirt at a clothes shop",
      "ko": "옷가게에서 셔츠 사기"
    },
    "expressions": [
      "cho tôi cái này",
      "bao nhiêu tiền"
    ],
    "grammar": [
      2,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Chào chị, chị xem áo à?",
        "gloss": {
          "en": "Hi, are you looking at shirts?",
          "ko": "안녕하세요, 셔츠 보세요?"
        }
      },
      {
        "who": "me",
        "text": "Vâng. Cái áo này bao nhiêu tiền?",
        "gloss": {
          "en": "Yes. How much is this shirt?",
          "ko": "네. 이 셔츠 얼마예요?"
        },
        "frames": [
          "vi-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Hai trăm nghìn ạ.",
        "gloss": {
          "en": "Two hundred thousand.",
          "ko": "이십만 동이에요."
        }
      },
      {
        "who": "me",
        "text": "Áo này có màu trắng không?",
        "gloss": {
          "en": "Does this shirt come in white?",
          "ko": "이 셔츠 흰색 있어요?"
        },
        "frames": [
          "vi-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Có ạ. Màu trắng đây.",
        "gloss": {
          "en": "Yes. Here's the white one.",
          "ko": "있어요. 흰색 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "Đẹp quá. Cho tôi cái này.",
        "gloss": {
          "en": "It's lovely. I'll take this one.",
          "ko": "예쁘네요. 이걸로 주세요."
        },
        "frames": [
          "vi-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Vâng. Chị trả tiền mặt hay thẻ?",
        "gloss": {
          "en": "Sure. Cash or card?",
          "ko": "네. 현금으로 하세요, 카드로 하세요?"
        }
      },
      {
        "who": "me",
        "text": "Tôi không có tiền mặt. Thẻ được không?",
        "gloss": {
          "en": "I don't have cash. Is card OK?",
          "ko": "현금이 없어요. 카드 돼요?"
        },
        "frames": [
          "vi-f1-11"
        ]
      }
    ]
  },
  {
    "id": "vi-1-b12",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a small pharmacy",
      "ko": "작은 약국에서"
    },
    "expressions": [
      "xin chào",
      "cảm ơn"
    ],
    "grammar": [
      2,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Chào bạn, bạn cần gì?",
        "gloss": {
          "en": "Hello, what do you need?",
          "ko": "안녕하세요, 뭐 필요하세요?"
        }
      },
      {
        "who": "me",
        "text": "Xin chào. Ở đây có thuốc đau đầu không?",
        "gloss": {
          "en": "Hello. Do you have headache medicine here?",
          "ko": "안녕하세요. 여기 두통약 있어요?"
        },
        "frames": [
          "vi-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Có. Bạn có sốt không?",
        "gloss": {
          "en": "Yes. Do you have a fever?",
          "ko": "있어요. 열 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Tôi không sốt.",
        "gloss": {
          "en": "I don't have a fever.",
          "ko": "열은 없어요."
        },
        "frames": [
          "vi-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Vậy bạn uống thuốc này nhé.",
        "gloss": {
          "en": "Then take this medicine.",
          "ko": "그럼 이 약 드세요."
        }
      },
      {
        "who": "me",
        "text": "Thuốc này bao nhiêu tiền?",
        "gloss": {
          "en": "How much is this medicine?",
          "ko": "이 약 얼마예요?"
        },
        "frames": [
          "vi-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Ba mươi nghìn.",
        "gloss": {
          "en": "Thirty thousand.",
          "ko": "삼만 동이에요."
        }
      },
      {
        "who": "me",
        "text": "Đây ạ. Cảm ơn chị.",
        "gloss": {
          "en": "Here you go. Thank you.",
          "ko": "여기요. 고마워요."
        },
        "frames": [
          "vi-f1-15"
        ]
      }
    ]
  },
  {
    "id": "vi-1-b13",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a language exchange café",
      "ko": "언어 교환 카페에서"
    },
    "expressions": [
      "xin chào",
      "rất vui được gặp"
    ],
    "grammar": [
      0,
      1,
      2,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Xin chào! Chỗ này có ai ngồi không?",
        "gloss": {
          "en": "Hello! Is anyone sitting here?",
          "ko": "안녕하세요! 여기 누구 앉아요?"
        }
      },
      {
        "who": "me",
        "text": "Xin chào. Không có ai. Bạn tên là gì?",
        "gloss": {
          "en": "Hello. No one. What's your name?",
          "ko": "안녕하세요. 아무도 없어요. 이름이 뭐예요?"
        },
        "frames": [
          "vi-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "Tôi tên là Hương. Tôi là giáo viên.",
        "gloss": {
          "en": "My name is Hương. I'm a teacher.",
          "ko": "제 이름은 흐엉이에요. 저는 선생님이에요."
        }
      },
      {
        "who": "me",
        "text": "Rất vui được gặp bạn. Tôi là sinh viên.",
        "gloss": {
          "en": "Nice to meet you. I'm a student.",
          "ko": "만나서 반가워요. 저는 학생이에요."
        },
        "frames": [
          "vi-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "Bạn học tiếng Việt ở đâu?",
        "gloss": {
          "en": "Where do you study Vietnamese?",
          "ko": "베트남어는 어디서 배워요?"
        }
      },
      {
        "who": "me",
        "text": "Ở trường gần đây. Bạn có học tiếng Hàn không?",
        "gloss": {
          "en": "At a school near here. Do you study Korean?",
          "ko": "이 근처 학교에서요. 한국어 공부해요?"
        },
        "frames": [
          "vi-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Có, nhưng tôi nói chưa tốt.",
        "gloss": {
          "en": "Yes, but I don't speak it well yet.",
          "ko": "네, 그런데 아직 잘 못해요."
        }
      },
      {
        "who": "me",
        "text": "Tôi cũng vậy. Tôi không nói tốt.",
        "gloss": {
          "en": "Me too. I don't speak well.",
          "ko": "저도요. 잘 못 말해요."
        },
        "frames": [
          "vi-f1-11"
        ]
      }
    ]
  },
  {
    "id": "vi-1-b14",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Ordering at a street food restaurant",
      "ko": "길거리 식당에서 주문하기"
    },
    "expressions": [
      "cho tôi cái này",
      "cảm ơn"
    ],
    "grammar": [
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Mời bạn ngồi. Bạn ăn gì?",
        "gloss": {
          "en": "Please sit down. What will you eat?",
          "ko": "앉으세요. 뭐 드실래요?"
        }
      },
      {
        "who": "me",
        "text": "Cho tôi cái này.",
        "gloss": {
          "en": "This one, please.",
          "ko": "이거 주세요."
        },
        "frames": [
          "vi-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Bún chả nhé. Có cay không?",
        "gloss": {
          "en": "Bún chả, then. Spicy?",
          "ko": "분짜요. 맵게 해 드려요?"
        }
      },
      {
        "who": "me",
        "text": "Không. Tôi không ăn cay.",
        "gloss": {
          "en": "No. I don't eat spicy food.",
          "ko": "아니요. 매운 거 못 먹어요."
        },
        "frames": [
          "vi-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Vâng. Bạn uống gì không?",
        "gloss": {
          "en": "OK. Anything to drink?",
          "ko": "네. 마실 거 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Cho tôi một chai nước.",
        "gloss": {
          "en": "A bottle of water, please.",
          "ko": "물 한 병 주세요."
        },
        "frames": [
          "vi-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Có ngay. Của bạn đây.",
        "gloss": {
          "en": "Coming right up. Here you are.",
          "ko": "바로 드릴게요. 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "Cảm ơn anh.",
        "gloss": {
          "en": "Thank you.",
          "ko": "고마워요."
        },
        "frames": [
          "vi-f1-15"
        ]
      }
    ]
  },
  {
    "id": "vi-1-b15",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Talking about family at a friend's home",
      "ko": "친구 집에서 가족 이야기"
    },
    "expressions": [],
    "grammar": [
      2,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Đây là ảnh gia đình mình. Bạn có anh chị em không?",
        "gloss": {
          "en": "This is my family photo. Do you have any brothers or sisters?",
          "ko": "이건 우리 가족 사진이야. 너는 형제 있어?"
        }
      },
      {
        "who": "me",
        "text": "Có. Tôi có một em gái.",
        "gloss": {
          "en": "Yes. I have a younger sister.",
          "ko": "응. 여동생이 한 명 있어."
        },
        "frames": [
          "vi-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Em gái bạn ở đâu?",
        "gloss": {
          "en": "Where does your sister live?",
          "ko": "여동생은 어디 살아?"
        }
      },
      {
        "who": "me",
        "text": "Em ấy ở Seoul. Tôi ở Hà Nội.",
        "gloss": {
          "en": "She lives in Seoul. I live in Hanoi.",
          "ko": "동생은 서울에 살아. 나는 하노이에 살고."
        },
        "frames": [
          "vi-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "Bố mẹ bạn khỏe không?",
        "gloss": {
          "en": "Are your parents well?",
          "ko": "부모님은 건강하셔?"
        }
      },
      {
        "who": "me",
        "text": "Khỏe. Bố mẹ bạn có khỏe không?",
        "gloss": {
          "en": "Yes. Are your parents well?",
          "ko": "건강하셔. 네 부모님은 건강하셔?"
        },
        "frames": [
          "vi-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Khỏe lắm. Bố mình đang nấu cơm đấy.",
        "gloss": {
          "en": "Very well. My dad is cooking right now.",
          "ko": "아주 건강하셔. 아빠가 지금 밥하고 계셔."
        }
      },
      {
        "who": "me",
        "text": "Ồ, cảm ơn bạn nhé.",
        "gloss": {
          "en": "Oh, thank you so much.",
          "ko": "아, 정말 고마워."
        },
        "frames": [
          "vi-f1-15"
        ]
      }
    ]
  },
  {
    "id": "vi-1-b16",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Looking for a book in a bookstore",
      "ko": "서점에서 책 찾기"
    },
    "expressions": [
      "xin lỗi",
      "đợi một chút"
    ],
    "grammar": [
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Chào bạn, bạn tìm sách gì?",
        "gloss": {
          "en": "Hello, what book are you looking for?",
          "ko": "안녕하세요, 무슨 책 찾으세요?"
        }
      },
      {
        "who": "me",
        "text": "Xin lỗi, ở đây có sách tiếng Hàn không?",
        "gloss": {
          "en": "Excuse me, do you have Korean books here?",
          "ko": "실례지만, 여기 한국어 책 있어요?"
        },
        "frames": [
          "vi-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Có, nhưng ít thôi. Bạn đợi một chút nhé.",
        "gloss": {
          "en": "Yes, but only a few. Please wait a moment.",
          "ko": "있는데 조금밖에 없어요. 잠깐만 기다리세요."
        }
      },
      {
        "who": "me",
        "text": "Vâng, tôi đợi một chút.",
        "gloss": {
          "en": "OK, I'll wait a moment.",
          "ko": "네, 잠깐 기다릴게요."
        }
      },
      {
        "who": "them",
        "text": "Đây, cuốn này.",
        "gloss": {
          "en": "Here, this one.",
          "ko": "여기, 이 책이요."
        }
      },
      {
        "who": "me",
        "text": "Cuốn này bao nhiêu tiền?",
        "gloss": {
          "en": "How much is this book?",
          "ko": "이 책 얼마예요?"
        },
        "frames": [
          "vi-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Một trăm hai mươi nghìn.",
        "gloss": {
          "en": "A hundred and twenty thousand.",
          "ko": "십이만 동이에요."
        }
      },
      {
        "who": "me",
        "text": "Vâng. Quầy tính tiền ở đâu?",
        "gloss": {
          "en": "OK. Where's the checkout?",
          "ko": "네. 계산대는 어디예요?"
        },
        "frames": [
          "vi-f1-09"
        ]
      }
    ]
  },
  {
    "id": "vi-1-b17",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "In a Vietnamese class with a fast-talking teacher",
      "ko": "말이 빠른 선생님의 베트남어 수업"
    },
    "expressions": [
      "tôi không hiểu",
      "nói chậm thôi",
      "cảm ơn"
    ],
    "grammar": [
      1,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Các bạn mở sách trang mười hai, đọc bài hai rồi trả lời câu hỏi nhé.",
        "gloss": {
          "en": "Everyone, open your books to page twelve, read lesson two and answer the questions.",
          "ko": "여러분, 책 십이 쪽 펴고 이 과 읽은 다음 질문에 답하세요."
        }
      },
      {
        "who": "me",
        "text": "Xin lỗi cô, tôi không hiểu.",
        "gloss": {
          "en": "Sorry, teacher, I don't understand.",
          "ko": "죄송해요, 선생님, 이해를 못 했어요."
        },
        "frames": [
          "vi-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Không hiểu chỗ nào?",
        "gloss": {
          "en": "Which part didn't you understand?",
          "ko": "어느 부분을 모르겠어요?"
        }
      },
      {
        "who": "me",
        "text": "Cô nói chậm thôi ạ.",
        "gloss": {
          "en": "Please speak more slowly.",
          "ko": "선생님, 천천히 말씀해 주세요."
        },
        "frames": [
          "vi-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "Được. Trang mười hai. Bài hai.",
        "gloss": {
          "en": "OK. Page twelve. Lesson two.",
          "ko": "그래요. 십이 쪽. 이 과."
        }
      },
      {
        "who": "me",
        "text": "Vâng. Tôi có sách rồi.",
        "gloss": {
          "en": "OK. I have the book now.",
          "ko": "네. 책 폈어요."
        },
        "frames": [
          "vi-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Tốt lắm. Đọc đi.",
        "gloss": {
          "en": "Very good. Go ahead and read.",
          "ko": "좋아요. 읽어 보세요."
        }
      },
      {
        "who": "me",
        "text": "Cảm ơn cô.",
        "gloss": {
          "en": "Thank you, teacher.",
          "ko": "고맙습니다, 선생님."
        },
        "frames": [
          "vi-f1-15"
        ]
      }
    ]
  },
  {
    "id": "vi-1-b18",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Asking for the post office on the street",
      "ko": "길에서 우체국 묻기"
    },
    "expressions": [
      "xin lỗi",
      "vâng",
      "tạm biệt"
    ],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bạn cần giúp không?",
        "gloss": {
          "en": "Do you need help?",
          "ko": "도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Vâng. Xin lỗi anh, bưu điện ở đâu?",
        "gloss": {
          "en": "Yes. Excuse me, where is the post office?",
          "ko": "네. 실례지만, 우체국이 어디예요?"
        },
        "frames": [
          "vi-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Bưu điện ở phố bên kia. Bạn biết phố Hàng Bài không?",
        "gloss": {
          "en": "The post office is on the next street. Do you know Hàng Bài Street?",
          "ko": "우체국은 저쪽 거리에 있어요. 항바이 거리 알아요?"
        }
      },
      {
        "who": "me",
        "text": "Không, tôi không biết.",
        "gloss": {
          "en": "No, I don't know it.",
          "ko": "아니요, 몰라요."
        },
        "frames": [
          "vi-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Bạn đi thẳng, đến ngân hàng thì rẽ trái.",
        "gloss": {
          "en": "Go straight, and turn left at the bank.",
          "ko": "쭉 가다가 은행에서 왼쪽으로 도세요."
        }
      },
      {
        "who": "me",
        "text": "Ngân hàng à? Cảm ơn anh.",
        "gloss": {
          "en": "The bank? Thank you.",
          "ko": "은행이요? 고마워요."
        },
        "frames": [
          "vi-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Không có gì.",
        "gloss": {
          "en": "You're welcome.",
          "ko": "천만에요."
        }
      },
      {
        "who": "me",
        "text": "Tạm biệt anh.",
        "gloss": {
          "en": "Goodbye.",
          "ko": "안녕히 계세요."
        }
      }
    ]
  },
  {
    "id": "vi-1-b19",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Calling hotel reception from your room",
      "ko": "호텔 방에서 프런트에 전화하기"
    },
    "expressions": [
      "cảm ơn"
    ],
    "grammar": [
      3,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Lễ tân xin nghe.",
        "gloss": {
          "en": "Reception, how can I help?",
          "ko": "프런트입니다."
        }
      },
      {
        "who": "me",
        "text": "Chào chị. Tôi ở phòng năm lẻ một.",
        "gloss": {
          "en": "Hello. I'm in room five-oh-one.",
          "ko": "안녕하세요. 오백일 호예요."
        },
        "frames": [
          "vi-f1-04",
          "vi-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "Vâng, phòng bạn có vấn đề gì?",
        "gloss": {
          "en": "Yes, is there a problem with your room?",
          "ko": "네, 방에 무슨 문제 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Phòng tôi không có khăn. Cho tôi hai cái khăn.",
        "gloss": {
          "en": "There are no towels in my room. Two towels, please.",
          "ko": "방에 수건이 없어요. 수건 두 장 주세요."
        },
        "frames": [
          "vi-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Vâng, bạn đợi một chút nhé.",
        "gloss": {
          "en": "Sure, please wait a moment.",
          "ko": "네, 잠시만 기다려 주세요."
        }
      },
      {
        "who": "me",
        "text": "Ở đây có bàn chải đánh răng không?",
        "gloss": {
          "en": "Do you have toothbrushes here?",
          "ko": "여기 칫솔 있어요?"
        },
        "frames": [
          "vi-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Có ạ. Tôi mang lên luôn.",
        "gloss": {
          "en": "Yes. I'll bring them up now.",
          "ko": "있어요. 바로 가져다 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "Cảm ơn chị nhiều.",
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
    "id": "vi-1-b20",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Leaving after dinner at a friend's home",
      "ko": "친구 집에서 저녁 먹고 나서며"
    },
    "expressions": [
      "cảm ơn",
      "không sao",
      "hẹn gặp lại"
    ],
    "grammar": [
      2,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Muộn rồi, bạn về à?",
        "gloss": {
          "en": "It's late. Are you heading home?",
          "ko": "늦었네, 집에 가?"
        }
      },
      {
        "who": "me",
        "text": "Vâng. Cảm ơn chị, cơm ngon lắm.",
        "gloss": {
          "en": "Yes. Thank you, the food was delicious.",
          "ko": "응. 고마워요, 밥 정말 맛있었어요."
        },
        "frames": [
          "vi-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Không có gì. Nhà bạn có xa không?",
        "gloss": {
          "en": "Not at all. Is your place far?",
          "ko": "별말씀을. 집이 멀어?"
        }
      },
      {
        "who": "me",
        "text": "Không xa. Tôi ở gần chợ.",
        "gloss": {
          "en": "Not far. I live near the market.",
          "ko": "안 멀어요. 시장 근처에 살아요."
        },
        "frames": [
          "vi-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "Bạn có xe máy không?",
        "gloss": {
          "en": "Do you have a motorbike?",
          "ko": "오토바이 있어?"
        }
      },
      {
        "who": "me",
        "text": "Tôi không có xe máy, nhưng không sao. Tôi đi bộ.",
        "gloss": {
          "en": "I don't have a motorbike, but it's fine. I'll walk.",
          "ko": "오토바이는 없지만 괜찮아요. 걸어갈게요."
        },
        "frames": [
          "vi-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Ừ, đi cẩn thận nhé.",
        "gloss": {
          "en": "OK, be careful on the way.",
          "ko": "그래, 조심히 가."
        }
      },
      {
        "who": "me",
        "text": "Vâng. Hẹn gặp lại chị.",
        "gloss": {
          "en": "OK. See you again.",
          "ko": "네. 또 봬요."
        },
        "frames": [
          "vi-f1-16"
        ]
      }
    ]
  },
  {
    "id": "vi-2-b01",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Ordering phở at a street stall",
      "ko": "길거리 가게에서 쌀국수 주문하기"
    },
    "expressions": [
      "không cay",
      "cho thêm",
      "hay quá",
      "tính tiền"
    ],
    "grammar": [
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Chào bạn, ăn gì nào?",
        "gloss": {
          "en": "Hi, what are you having?",
          "ko": "어서 와요, 뭐 먹을래요?"
        }
      },
      {
        "who": "me",
        "text": "Cho tôi một bát phở gà, không cay.",
        "gloss": {
          "en": "A bowl of chicken phở, not spicy, please.",
          "ko": "닭고기 쌀국수 한 그릇 주세요, 안 맵게요."
        },
        "frames": [
          "vi-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "Có ngay. Bạn có ăn hành không?",
        "gloss": {
          "en": "Coming up. Do you eat spring onions?",
          "ko": "바로 줄게요. 파 먹어요?"
        }
      },
      {
        "who": "me",
        "text": "Có. Cho thêm rau nhé.",
        "gloss": {
          "en": "Yes. Some extra herbs, please.",
          "ko": "네. 채소 좀 더 주세요."
        },
        "frames": [
          "vi-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Của bạn đây. Ăn thử xem.",
        "gloss": {
          "en": "Here you are. Give it a try.",
          "ko": "여기 있어요. 한번 먹어 봐요."
        }
      },
      {
        "who": "me",
        "text": "Ngon quá! Nước dùng hay quá.",
        "gloss": {
          "en": "So good! The broth is great.",
          "ko": "정말 맛있어요! 국물이 끝내줘요."
        },
        "frames": [
          "vi-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "Cảm ơn bạn. Ăn thêm bát nữa không?",
        "gloss": {
          "en": "Thanks. Want another bowl?",
          "ko": "고마워요. 한 그릇 더 먹을래요?"
        }
      },
      {
        "who": "me",
        "text": "Thôi, tôi no rồi. Tính tiền nhé.",
        "gloss": {
          "en": "No, I'm full. The bill, please.",
          "ko": "아니에요, 배불러요. 계산해 주세요."
        },
        "frames": [
          "vi-f2-02"
        ]
      }
    ]
  },
  {
    "id": "vi-2-b02",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Bumping into an old friend on the street",
      "ko": "길에서 오랜 친구를 우연히 만나다"
    },
    "expressions": [
      "lâu rồi không gặp"
    ],
    "grammar": [
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ơ, lâu rồi không gặp!",
        "gloss": {
          "en": "Oh, long time no see!",
          "ko": "어, 오랜만이야!"
        }
      },
      {
        "who": "me",
        "text": "Lâu rồi không gặp! Dạo này bạn thế nào?",
        "gloss": {
          "en": "Long time no see! How have you been lately?",
          "ko": "오랜만이야! 요즘 어떻게 지내?"
        },
        "frames": [
          "vi-f2-19"
        ]
      },
      {
        "who": "them",
        "text": "Mình vẫn khỏe. Bạn đang làm gì ở đây?",
        "gloss": {
          "en": "I'm still well. What are you doing here?",
          "ko": "나는 잘 지내. 여기서 뭐 해?"
        }
      },
      {
        "who": "me",
        "text": "Tôi đang đi mua quà cho mẹ.",
        "gloss": {
          "en": "I'm out buying a present for my mum.",
          "ko": "엄마 선물 사러 가는 중이야."
        },
        "frames": [
          "vi-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Thật à? Mẹ bạn sang Việt Nam à?",
        "gloss": {
          "en": "Really? Is your mum coming to Vietnam?",
          "ko": "정말? 어머니가 베트남에 오셔?"
        }
      },
      {
        "who": "me",
        "text": "Không, tháng sau tôi sẽ về Hàn Quốc.",
        "gloss": {
          "en": "No, I'm going back to Korea next month.",
          "ko": "아니, 다음 달에 내가 한국에 가."
        },
        "frames": [
          "vi-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Thế à. Bạn có rảnh không?",
        "gloss": {
          "en": "I see. Are you free now?",
          "ko": "그렇구나. 지금 시간 있어?"
        }
      },
      {
        "who": "me",
        "text": "Có. Mình đi uống cà phê nhé.",
        "gloss": {
          "en": "Yes. Let's go for a coffee.",
          "ko": "응. 우리 커피 마시러 가자."
        },
        "frames": [
          "vi-f2-11"
        ]
      }
    ]
  },
  {
    "id": "vi-2-b03",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Riding a motorbike taxi home",
      "ko": "오토바이 택시를 타고 집에 가기"
    },
    "expressions": [
      "rẽ trái",
      "đi thẳng",
      "dừng ở đây"
    ],
    "grammar": [
      4,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bạn đi đường nào? Tôi không biết đường nhỏ này.",
        "gloss": {
          "en": "Which way are we going? I don't know this little road.",
          "ko": "어느 길로 가요? 이 작은 길은 잘 몰라요."
        }
      },
      {
        "who": "me",
        "text": "Anh đi thẳng, rồi rẽ trái ở ngã tư nhé.",
        "gloss": {
          "en": "Go straight, then turn left at the crossroads.",
          "ko": "쭉 가다가 사거리에서 왼쪽으로 도세요."
        },
        "frames": [
          "vi-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "Được. Đường đông quá. Bạn có vội không?",
        "gloss": {
          "en": "OK. The roads are so busy. Are you in a hurry?",
          "ko": "알겠어요. 길이 너무 막히네요. 급해요?"
        }
      },
      {
        "who": "me",
        "text": "Không vội. Vì tôi đi sớm nên không sao.",
        "gloss": {
          "en": "Not in a hurry. I left early, so it's fine.",
          "ko": "안 급해요. 일찍 나와서 괜찮아요."
        },
        "frames": [
          "vi-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Sắp đến chưa?",
        "gloss": {
          "en": "Are we nearly there?",
          "ko": "거의 다 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "Sắp đến rồi. Nhà tôi ở gần quán phở kia.",
        "gloss": {
          "en": "Almost. My house is near that phở shop.",
          "ko": "거의 다 왔어요. 우리 집은 저 쌀국수 가게 근처예요."
        },
        "frames": [
          "vi-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Quán phở này à?",
        "gloss": {
          "en": "This phở shop?",
          "ko": "이 쌀국수 가게요?"
        }
      },
      {
        "who": "me",
        "text": "Vâng. Làm ơn dừng ở đây. Cảm ơn anh.",
        "gloss": {
          "en": "Yes. Please stop here. Thank you.",
          "ko": "네. 여기서 세워 주세요. 고마워요."
        },
        "frames": [
          "vi-f2-08"
        ]
      }
    ]
  },
  {
    "id": "vi-2-b04",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "At the doctor's with a stomach ache",
      "ko": "배가 아파서 병원에 가다"
    },
    "expressions": [],
    "grammar": [
      0,
      2,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bạn bị làm sao?",
        "gloss": {
          "en": "What seems to be the problem?",
          "ko": "어디가 불편하세요?"
        }
      },
      {
        "who": "me",
        "text": "Tôi bị đau bụng từ tối qua.",
        "gloss": {
          "en": "I've had a stomach ache since last night.",
          "ko": "어젯밤부터 배가 아파요."
        },
        "frames": [
          "vi-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "Hôm qua bạn ăn gì?",
        "gloss": {
          "en": "What did you eat yesterday?",
          "ko": "어제 뭐 먹었어요?"
        }
      },
      {
        "who": "me",
        "text": "Hôm qua tôi đã ăn hải sản ở chợ đêm.",
        "gloss": {
          "en": "Yesterday I ate seafood at the night market.",
          "ko": "어제 야시장에서 해산물을 먹었어요."
        },
        "frames": [
          "vi-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Bạn uống thuốc chưa?",
        "gloss": {
          "en": "Have you taken any medicine?",
          "ko": "약은 먹었어요?"
        }
      },
      {
        "who": "me",
        "text": "Tôi uống rồi, nhưng vẫn đau.",
        "gloss": {
          "en": "I have, but it still hurts.",
          "ko": "먹었는데 아직 아파요."
        },
        "frames": [
          "vi-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Bạn uống thuốc này, và nghỉ ngơi nhiều nhé.",
        "gloss": {
          "en": "Take this medicine and get plenty of rest.",
          "ko": "이 약 먹고 푹 쉬세요."
        }
      },
      {
        "who": "me",
        "text": "Vâng. Hôm nay tôi sẽ nghỉ ở nhà.",
        "gloss": {
          "en": "OK. I'll rest at home today.",
          "ko": "네. 오늘은 집에서 쉴게요."
        },
        "frames": [
          "vi-f2-03"
        ]
      }
    ]
  },
  {
    "id": "vi-2-b05",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Inviting a coworker to the cinema",
      "ko": "회사 동료에게 영화 보자고 하기"
    },
    "expressions": [
      "mấy giờ"
    ],
    "grammar": [
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Tối nay bạn có rảnh không?",
        "gloss": {
          "en": "Are you free tonight?",
          "ko": "오늘 저녁에 시간 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Có. Mình đi xem phim nhé.",
        "gloss": {
          "en": "Yes. Let's go see a film.",
          "ko": "네. 우리 영화 보러 가요."
        },
        "frames": [
          "vi-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "Hay đấy! Bạn thích phim gì?",
        "gloss": {
          "en": "Good idea! What kind of films do you like?",
          "ko": "좋아요! 어떤 영화 좋아해요?"
        }
      },
      {
        "who": "me",
        "text": "Tôi thích phim hài. Tôi không thích phim kinh dị.",
        "gloss": {
          "en": "I like comedies. I don't like horror films.",
          "ko": "코미디 좋아해요. 공포 영화는 싫어요."
        },
        "frames": [
          "vi-f2-06",
          "vi-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Mình cũng thế. Có phim hài mới ở rạp gần công ty.",
        "gloss": {
          "en": "Me too. There's a new comedy at the cinema near the office.",
          "ko": "저도요. 회사 근처 극장에 새 코미디가 있어요."
        }
      },
      {
        "who": "me",
        "text": "Phim bắt đầu lúc mấy giờ?",
        "gloss": {
          "en": "What time does the film start?",
          "ko": "영화 몇 시에 시작해요?"
        },
        "frames": [
          "vi-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "Bảy giờ tối. Mình gặp ở cổng rạp nhé.",
        "gloss": {
          "en": "Seven in the evening. Let's meet at the cinema entrance.",
          "ko": "저녁 일곱 시요. 극장 입구에서 만나요."
        }
      },
      {
        "who": "me",
        "text": "Được. Tôi sẽ đến sớm mua vé.",
        "gloss": {
          "en": "OK. I'll come early to buy the tickets.",
          "ko": "좋아요. 제가 일찍 가서 표 살게요."
        },
        "frames": [
          "vi-f2-03"
        ]
      }
    ]
  },
  {
    "id": "vi-2-b06",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Asking a homestay owner in Hội An about local food",
      "ko": "호이안 홈스테이 주인에게 현지 음식 묻기"
    },
    "expressions": [
      "món gì ngon"
    ],
    "grammar": [
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bạn đến Hội An lần đầu à?",
        "gloss": {
          "en": "Is this your first time in Hội An?",
          "ko": "호이안은 처음이에요?"
        }
      },
      {
        "who": "me",
        "text": "Vâng. Ở đây có món gì ngon?",
        "gloss": {
          "en": "Yes. What's good to eat here?",
          "ko": "네. 여기 뭐가 맛있어요?"
        },
        "frames": [
          "vi-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "Cao lầu và cơm gà. Bạn thích món nào?",
        "gloss": {
          "en": "Cao lầu and chicken rice. Which do you like?",
          "ko": "까오러우랑 닭고기 밥이요. 어떤 게 좋아요?"
        }
      },
      {
        "who": "me",
        "text": "Tôi muốn ăn cao lầu.",
        "gloss": {
          "en": "I want to try cao lầu.",
          "ko": "까오러우 먹어 보고 싶어요."
        },
        "frames": [
          "vi-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Có một quán ngon ở gần chợ.",
        "gloss": {
          "en": "There's a good place near the market.",
          "ko": "시장 근처에 맛있는 집이 하나 있어요."
        }
      },
      {
        "who": "me",
        "text": "Quán mở cửa lúc mấy giờ?",
        "gloss": {
          "en": "What time does it open?",
          "ko": "그 가게 몇 시에 문 열어요?"
        },
        "frames": [
          "vi-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "Mười một giờ trưa. Nhưng đông lắm.",
        "gloss": {
          "en": "Eleven in the morning. But it gets very busy.",
          "ko": "오전 열한 시요. 그런데 사람이 아주 많아요."
        }
      },
      {
        "who": "me",
        "text": "Vì quán đông nên tôi sẽ đi sớm.",
        "gloss": {
          "en": "Since it's busy, I'll go early.",
          "ko": "사람이 많으니까 일찍 갈게요."
        },
        "frames": [
          "vi-f2-14",
          "vi-f2-03"
        ]
      }
    ]
  },
  {
    "id": "vi-2-b07",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Lunchtime at the office",
      "ko": "회사 점심시간"
    },
    "expressions": [
      "ăn cơm chưa",
      "ở đâu cũng được",
      "đi cùng nhé"
    ],
    "grammar": [
      0,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ơ, bạn vẫn đang làm việc à?",
        "gloss": {
          "en": "Oh, you're still working?",
          "ko": "어, 아직도 일해요?"
        }
      },
      {
        "who": "me",
        "text": "Vâng, tôi đang viết báo cáo. Chị ăn cơm chưa?",
        "gloss": {
          "en": "Yes, I'm writing a report. Have you eaten?",
          "ko": "네, 보고서 쓰는 중이에요. 밥 먹었어요?"
        },
        "frames": [
          "vi-f2-04",
          "vi-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "Chưa. Mình đi ăn cùng không?",
        "gloss": {
          "en": "Not yet. Shall we go eat together?",
          "ko": "아직요. 같이 먹으러 갈래요?"
        }
      },
      {
        "who": "me",
        "text": "Được. Mình đi cùng nhé.",
        "gloss": {
          "en": "Sure. Let's go together.",
          "ko": "좋아요. 같이 가요."
        },
        "frames": [
          "vi-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "Bạn muốn ăn ở đâu?",
        "gloss": {
          "en": "Where do you want to eat?",
          "ko": "어디서 먹고 싶어요?"
        }
      },
      {
        "who": "me",
        "text": "Ở đâu cũng được. Tôi thích cơm tấm.",
        "gloss": {
          "en": "Anywhere is fine. I like broken rice.",
          "ko": "어디든 좋아요. 저는 껌떰 좋아해요."
        },
        "frames": [
          "vi-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Thế đi quán cơm tấm đầu ngõ nhé.",
        "gloss": {
          "en": "Then let's go to the broken-rice place at the end of the alley.",
          "ko": "그럼 골목 입구 껌떰 집에 가요."
        }
      },
      {
        "who": "me",
        "text": "Hay quá! Tôi đói quá rồi.",
        "gloss": {
          "en": "Great! I'm starving.",
          "ko": "좋아요! 너무 배고파요."
        },
        "frames": [
          "vi-f2-13"
        ]
      }
    ]
  },
  {
    "id": "vi-2-b08",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Ordering bubble tea",
      "ko": "버블티 주문하기"
    },
    "expressions": [
      "ít đường"
    ],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Chào bạn, bạn uống gì?",
        "gloss": {
          "en": "Hi, what would you like?",
          "ko": "안녕하세요, 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Tôi muốn một cốc trà sữa trân châu.",
        "gloss": {
          "en": "I'd like a bubble milk tea.",
          "ko": "버블 밀크티 한 잔 주세요."
        },
        "frames": [
          "vi-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Bạn uống ngọt bình thường hay ít đường?",
        "gloss": {
          "en": "Normal sweetness or less sugar?",
          "ko": "단맛 보통으로 할까요, 덜 달게 할까요?"
        }
      },
      {
        "who": "me",
        "text": "Ít đường. Tôi không thích ngọt quá.",
        "gloss": {
          "en": "Less sugar. I don't like it too sweet.",
          "ko": "덜 달게요. 너무 단 건 싫어요."
        },
        "frames": [
          "vi-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Vâng. Bạn có lấy đá không?",
        "gloss": {
          "en": "OK. Do you want ice?",
          "ko": "네. 얼음 넣을까요?"
        }
      },
      {
        "who": "me",
        "text": "Có. Cho thêm đá nhé.",
        "gloss": {
          "en": "Yes. Extra ice, please.",
          "ko": "네. 얼음 많이 넣어 주세요."
        },
        "frames": [
          "vi-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Của bạn đây. Ba mươi nghìn ạ.",
        "gloss": {
          "en": "Here you are. Thirty thousand.",
          "ko": "여기 있어요. 삼만 동이에요."
        }
      },
      {
        "who": "me",
        "text": "Rẻ quá! Cảm ơn em.",
        "gloss": {
          "en": "That's cheap! Thanks.",
          "ko": "싸네요! 고마워요."
        },
        "frames": [
          "vi-f2-13"
        ]
      }
    ]
  },
  {
    "id": "vi-2-b09",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Phoning a friend about weekend plans",
      "ko": "친구와 주말 계획 통화"
    },
    "expressions": [
      "đi cùng nhé",
      "mấy giờ"
    ],
    "grammar": [
      1,
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Alô, cuối tuần này bạn làm gì?",
        "gloss": {
          "en": "Hello, what are you doing this weekend?",
          "ko": "여보세요, 이번 주말에 뭐 해?"
        }
      },
      {
        "who": "me",
        "text": "Tôi sẽ đi Ba Vì leo núi.",
        "gloss": {
          "en": "I'm going hiking at Ba Vì.",
          "ko": "바비에 등산하러 갈 거야."
        },
        "frames": [
          "vi-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Ồ, mình cũng muốn đi!",
        "gloss": {
          "en": "Oh, I want to go too!",
          "ko": "오, 나도 가고 싶다!"
        }
      },
      {
        "who": "me",
        "text": "Thế mình đi cùng nhé.",
        "gloss": {
          "en": "Then let's go together.",
          "ko": "그럼 같이 가자."
        },
        "frames": [
          "vi-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "Được. Mình đi bằng xe máy à?",
        "gloss": {
          "en": "OK. Are we going by motorbike?",
          "ko": "좋아. 오토바이로 가?"
        }
      },
      {
        "who": "me",
        "text": "Không, tôi đang tìm xe buýt.",
        "gloss": {
          "en": "No, I'm looking for a bus.",
          "ko": "아니, 지금 버스 찾고 있어."
        },
        "frames": [
          "vi-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Xe buýt đi lúc mấy giờ?",
        "gloss": {
          "en": "What time does the bus leave?",
          "ko": "버스 몇 시에 출발해?"
        }
      },
      {
        "who": "me",
        "text": "Tôi chưa biết xe đi lúc mấy giờ. Tôi sẽ nhắn bạn.",
        "gloss": {
          "en": "I don't know what time it leaves yet. I'll text you.",
          "ko": "몇 시에 가는지 아직 몰라. 문자 줄게."
        },
        "frames": [
          "vi-f2-16",
          "vi-f2-03"
        ]
      }
    ]
  },
  {
    "id": "vi-2-b10",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Cancelling plans because of heavy rain",
      "ko": "폭우 때문에 약속 취소하기"
    },
    "expressions": [
      "tiếc quá"
    ],
    "grammar": [
      2,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Alô, bạn đến chưa? Mình đang đợi ở quán.",
        "gloss": {
          "en": "Hello, are you here yet? I'm waiting at the café.",
          "ko": "여보세요, 아직이야? 나 카페에서 기다리고 있어."
        }
      },
      {
        "who": "me",
        "text": "Xin lỗi. Vì trời mưa to quá nên tôi chưa đi được.",
        "gloss": {
          "en": "Sorry. It's raining so hard that I haven't been able to leave.",
          "ko": "미안해. 비가 너무 많이 와서 아직 못 나갔어."
        },
        "frames": [
          "vi-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Thế à. Bây giờ bạn đang làm gì?",
        "gloss": {
          "en": "I see. What are you doing now?",
          "ko": "그렇구나. 지금 뭐 하고 있어?"
        }
      },
      {
        "who": "me",
        "text": "Tôi đang ở nhà, đợi trời tạnh.",
        "gloss": {
          "en": "I'm at home, waiting for the rain to stop.",
          "ko": "집에서 비 그치길 기다리고 있어."
        },
        "frames": [
          "vi-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Thế thì hôm nay không gặp được rồi.",
        "gloss": {
          "en": "So we can't meet today, then.",
          "ko": "그럼 오늘은 못 만나겠네."
        }
      },
      {
        "who": "me",
        "text": "Tiếc quá! Mai mình gặp nhau nhé.",
        "gloss": {
          "en": "Such a shame! Let's meet tomorrow.",
          "ko": "아쉽다! 내일 만나자."
        },
        "frames": [
          "vi-f2-13",
          "vi-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "Được. Mai mấy giờ?",
        "gloss": {
          "en": "OK. What time tomorrow?",
          "ko": "좋아. 내일 몇 시?"
        }
      },
      {
        "who": "me",
        "text": "Mười giờ sáng. Tôi sẽ đến sớm.",
        "gloss": {
          "en": "Ten in the morning. I'll come early.",
          "ko": "아침 열 시. 일찍 갈게."
        },
        "frames": [
          "vi-f2-03"
        ]
      }
    ]
  },
  {
    "id": "vi-2-b11",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "At the hairdresser's",
      "ko": "미용실에서"
    },
    "expressions": [],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Chào bạn, bạn muốn cắt thế nào?",
        "gloss": {
          "en": "Hello, how would you like it cut?",
          "ko": "안녕하세요, 어떻게 잘라 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Làm ơn cắt ngắn một chút.",
        "gloss": {
          "en": "Please cut it a little shorter.",
          "ko": "조금 짧게 잘라 주세요."
        },
        "frames": [
          "vi-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Ngắn như ảnh này được không?",
        "gloss": {
          "en": "Short like this photo?",
          "ko": "이 사진처럼 짧게요?"
        }
      },
      {
        "who": "me",
        "text": "Không, ngắn quá. Tôi không thích tóc ngắn quá.",
        "gloss": {
          "en": "No, that's too short. I don't like my hair too short.",
          "ko": "아니요, 너무 짧아요. 머리가 너무 짧은 건 싫어요."
        },
        "frames": [
          "vi-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Vâng, thế cắt một ít thôi nhé. Bạn có gội đầu không?",
        "gloss": {
          "en": "OK, just a little then. Do you want a hair wash?",
          "ko": "네, 그럼 조금만 자를게요. 머리도 감겨 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Có. Tôi muốn gội đầu.",
        "gloss": {
          "en": "Yes. I'd like a wash.",
          "ko": "네. 감겨 주세요."
        },
        "frames": [
          "vi-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Xong rồi. Bạn xem thế nào?",
        "gloss": {
          "en": "All done. What do you think?",
          "ko": "다 됐어요. 어때요?"
        }
      },
      {
        "who": "me",
        "text": "Đẹp quá! Cảm ơn chị.",
        "gloss": {
          "en": "It looks great! Thank you.",
          "ko": "너무 예뻐요! 고마워요."
        },
        "frames": [
          "vi-f2-13"
        ]
      }
    ]
  },
  {
    "id": "vi-2-b12",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Monday morning chat with a coworker about the weekend",
      "ko": "월요일 아침 동료와 주말 이야기"
    },
    "expressions": [],
    "grammar": [
      0,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Cuối tuần của bạn thế nào?",
        "gloss": {
          "en": "How was your weekend?",
          "ko": "주말 어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "Vui lắm. Hôm qua tôi đã đi Hạ Long.",
        "gloss": {
          "en": "It was fun. Yesterday I went to Hạ Long.",
          "ko": "재밌었어요. 어제 하롱베이에 갔어요."
        },
        "frames": [
          "vi-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Thật à? Bạn đi tàu ngắm vịnh chưa?",
        "gloss": {
          "en": "Really? Did you take a boat around the bay?",
          "ko": "정말요? 배 타고 만 구경했어요?"
        }
      },
      {
        "who": "me",
        "text": "Tôi đi rồi. Đẹp quá!",
        "gloss": {
          "en": "I did. It was so beautiful!",
          "ko": "탔어요. 정말 예뻤어요!"
        },
        "frames": [
          "vi-f2-02",
          "vi-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "Bạn có ăn hải sản không?",
        "gloss": {
          "en": "Did you eat seafood?",
          "ko": "해산물 먹었어요?"
        }
      },
      {
        "who": "me",
        "text": "Có. Tôi thích mực nướng ở đó.",
        "gloss": {
          "en": "Yes. I loved the grilled squid there.",
          "ko": "네. 거기 오징어구이가 좋았어요."
        },
        "frames": [
          "vi-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Hay quá. Mình cũng muốn đi.",
        "gloss": {
          "en": "That's great. I want to go too.",
          "ko": "좋겠다. 저도 가고 싶어요."
        }
      },
      {
        "who": "me",
        "text": "Hè này mình đi cùng nhé.",
        "gloss": {
          "en": "Let's go together this summer.",
          "ko": "이번 여름에 같이 가요."
        },
        "frames": [
          "vi-f2-11"
        ]
      }
    ]
  },
  {
    "id": "vi-2-b13",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Buying a bánh mì from a street cart",
      "ko": "길거리 수레에서 반미 사기"
    },
    "expressions": [
      "cho thêm"
    ],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bánh mì đây! Bạn lấy loại nào?",
        "gloss": {
          "en": "Bánh mì here! Which kind would you like?",
          "ko": "반미 있어요! 어떤 걸로 줄까요?"
        }
      },
      {
        "who": "me",
        "text": "Tôi muốn một cái bánh mì thịt.",
        "gloss": {
          "en": "I'd like a pork bánh mì.",
          "ko": "고기 반미 하나 주세요."
        },
        "frames": [
          "vi-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Có ăn ớt không?",
        "gloss": {
          "en": "Do you eat chilli?",
          "ko": "고추 넣어요?"
        }
      },
      {
        "who": "me",
        "text": "Có, tôi thích cay. Cho thêm ớt nhé.",
        "gloss": {
          "en": "Yes, I like it spicy. Extra chilli, please.",
          "ko": "네, 매운 거 좋아해요. 고추 더 넣어 주세요."
        },
        "frames": [
          "vi-f2-06",
          "vi-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Có rau mùi không?",
        "gloss": {
          "en": "Coriander?",
          "ko": "고수 넣어요?"
        }
      },
      {
        "who": "me",
        "text": "Không. Tôi không thích rau mùi.",
        "gloss": {
          "en": "No. I don't like coriander.",
          "ko": "아니요. 고수는 싫어요."
        },
        "frames": [
          "vi-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Được. Mười lăm nghìn nhé.",
        "gloss": {
          "en": "OK. Fifteen thousand.",
          "ko": "알겠어요. 만 오천 동이에요."
        }
      },
      {
        "who": "me",
        "text": "Đây ạ. Thơm quá!",
        "gloss": {
          "en": "Here you go. It smells so good!",
          "ko": "여기요. 냄새 너무 좋아요!"
        },
        "frames": [
          "vi-f2-13"
        ]
      }
    ]
  },
  {
    "id": "vi-2-b14",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Studying with a classmate before a test",
      "ko": "시험 전에 반 친구와 공부하기"
    },
    "expressions": [
      "thật à"
    ],
    "grammar": [
      0,
      2,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bạn làm bài tập chưa?",
        "gloss": {
          "en": "Have you done the homework?",
          "ko": "숙제 했어?"
        }
      },
      {
        "who": "me",
        "text": "Tôi làm rồi. Bạn làm chưa?",
        "gloss": {
          "en": "I've done it. Have you?",
          "ko": "했어. 너는 했어?"
        },
        "frames": [
          "vi-f2-02",
          "vi-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "Chưa. Vì mình bận quá nên chưa làm.",
        "gloss": {
          "en": "Not yet. I've been too busy.",
          "ko": "아직. 너무 바빠서 못 했어."
        }
      },
      {
        "who": "me",
        "text": "Thật à? Tôi đang ôn bài, mình học cùng nhé.",
        "gloss": {
          "en": "Really? I'm reviewing now. Let's study together.",
          "ko": "정말? 나 지금 복습 중인데, 같이 공부하자."
        },
        "frames": [
          "vi-f2-04",
          "vi-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "Ừ. Bài thi bắt đầu lúc mấy giờ nhỉ?",
        "gloss": {
          "en": "OK. What time does the test start again?",
          "ko": "응. 시험 몇 시에 시작하더라?"
        }
      },
      {
        "who": "me",
        "text": "Tôi quên rồi. Mình hỏi cô nhé.",
        "gloss": {
          "en": "I forgot. Let's ask the teacher.",
          "ko": "까먹었어. 선생님께 여쭤보자."
        },
        "frames": [
          "vi-f2-02",
          "vi-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "Ừ, để mình nhắn tin hỏi cô.",
        "gloss": {
          "en": "OK, I'll text the teacher and ask.",
          "ko": "응, 내가 선생님께 문자로 여쭤볼게."
        }
      },
      {
        "who": "me",
        "text": "Cảm ơn bạn. Tôi sẽ mua nước cho bạn.",
        "gloss": {
          "en": "Thanks. I'll buy you a drink.",
          "ko": "고마워. 음료수 사 줄게."
        },
        "frames": [
          "vi-f2-03"
        ]
      }
    ]
  },
  {
    "id": "vi-2-b15",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Guiding a friend to your house by phone",
      "ko": "전화로 친구에게 우리 집 가는 길 알려 주기"
    },
    "expressions": [
      "đi thẳng",
      "rẽ trái"
    ],
    "grammar": [
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Alô, mình đến đầu ngõ rồi. Đi tiếp thế nào?",
        "gloss": {
          "en": "Hello, I'm at the start of the alley. Which way now?",
          "ko": "여보세요, 골목 입구에 왔어. 이제 어떻게 가?"
        }
      },
      {
        "who": "me",
        "text": "Bạn đi thẳng, rồi rẽ trái ở hiệu thuốc nhé.",
        "gloss": {
          "en": "Go straight, then turn left at the pharmacy.",
          "ko": "쭉 오다가 약국에서 왼쪽으로 돌아."
        },
        "frames": [
          "vi-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "Hiệu thuốc à? Mình thấy rồi.",
        "gloss": {
          "en": "The pharmacy? I see it.",
          "ko": "약국? 보인다."
        }
      },
      {
        "who": "me",
        "text": "Tôi đang đợi ở cổng.",
        "gloss": {
          "en": "I'm waiting at the gate.",
          "ko": "나 대문에서 기다리고 있어."
        },
        "frames": [
          "vi-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Cổng màu gì?",
        "gloss": {
          "en": "What colour is the gate?",
          "ko": "대문 무슨 색이야?"
        }
      },
      {
        "who": "me",
        "text": "Màu xanh. Tôi đang vẫy tay đây.",
        "gloss": {
          "en": "Green. I'm waving now.",
          "ko": "초록색. 지금 손 흔들고 있어."
        },
        "frames": [
          "vi-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "À, thấy bạn rồi!",
        "gloss": {
          "en": "Ah, I see you!",
          "ko": "아, 너 보인다!"
        }
      },
      {
        "who": "me",
        "text": "Hay quá! Vào nhà đi, tôi nấu cơm rồi.",
        "gloss": {
          "en": "Great! Come in, I've already cooked.",
          "ko": "잘됐다! 들어와, 밥 다 해 놨어."
        },
        "frames": [
          "vi-f2-13",
          "vi-f2-02"
        ]
      }
    ]
  },
  {
    "id": "vi-2-b16",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Asking about breakfast at a hotel front desk",
      "ko": "호텔 프런트에서 아침 식사 묻기"
    },
    "expressions": [
      "mấy giờ",
      "món gì ngon"
    ],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Chào buổi tối. Bạn cần gì ạ?",
        "gloss": {
          "en": "Good evening. Can I help you?",
          "ko": "안녕하세요. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Bữa sáng bắt đầu lúc mấy giờ?",
        "gloss": {
          "en": "What time does breakfast start?",
          "ko": "아침 식사는 몇 시에 시작해요?"
        },
        "frames": [
          "vi-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "Sáu giờ rưỡi, ở tầng hai.",
        "gloss": {
          "en": "Half past six, on the second floor.",
          "ko": "여섯 시 반이요, 이 층에서요."
        }
      },
      {
        "who": "me",
        "text": "Mai tôi muốn ăn sáng sớm.",
        "gloss": {
          "en": "I want to have breakfast early tomorrow.",
          "ko": "내일 아침 일찍 먹고 싶어요."
        },
        "frames": [
          "vi-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Không sao, bạn đến lúc sáu giờ rưỡi là được.",
        "gloss": {
          "en": "No problem, just come at half past six.",
          "ko": "괜찮아요, 여섯 시 반에 오시면 돼요."
        }
      },
      {
        "who": "me",
        "text": "Bữa sáng có món gì ngon?",
        "gloss": {
          "en": "What's good at breakfast?",
          "ko": "아침 식사에 뭐가 맛있어요?"
        },
        "frames": [
          "vi-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "Bún bò và bánh cuốn ngon lắm.",
        "gloss": {
          "en": "The beef noodle soup and steamed rice rolls are very good.",
          "ko": "분보랑 바인꾸온이 아주 맛있어요."
        }
      },
      {
        "who": "me",
        "text": "Tôi thích bánh cuốn. Cảm ơn chị.",
        "gloss": {
          "en": "I like steamed rice rolls. Thank you.",
          "ko": "바인꾸온 좋아해요. 고마워요."
        },
        "frames": [
          "vi-f2-06"
        ]
      }
    ]
  },
  {
    "id": "vi-2-b17",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Trying on shoes at a shoe shop",
      "ko": "신발 가게에서 신발 신어 보기"
    },
    "expressions": [],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bạn thử đôi này đi.",
        "gloss": {
          "en": "Try this pair on.",
          "ko": "이거 신어 보세요."
        }
      },
      {
        "who": "me",
        "text": "Tôi muốn thử cỡ ba mươi chín.",
        "gloss": {
          "en": "I'd like to try a size thirty-nine.",
          "ko": "삼십구 사이즈 신어 보고 싶어요."
        },
        "frames": [
          "vi-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Đây ạ. Vừa không?",
        "gloss": {
          "en": "Here you are. Do they fit?",
          "ko": "여기요. 맞아요?"
        }
      },
      {
        "who": "me",
        "text": "Chật quá. Làm ơn cho tôi cỡ to hơn.",
        "gloss": {
          "en": "They're too tight. Please give me a bigger size.",
          "ko": "너무 꽉 껴요. 더 큰 사이즈 주세요."
        },
        "frames": [
          "vi-f2-13",
          "vi-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Cỡ bốn mươi đây. Bạn thích màu đen hay màu trắng?",
        "gloss": {
          "en": "Here's a forty. Do you like black or white?",
          "ko": "사십 사이즈요. 검은색이 좋아요, 흰색이 좋아요?"
        }
      },
      {
        "who": "me",
        "text": "Tôi không thích màu trắng. Màu đen nhé.",
        "gloss": {
          "en": "I don't like white. Black, please.",
          "ko": "흰색은 싫어요. 검은색으로 할게요."
        },
        "frames": [
          "vi-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Vâng. Đôi này vừa chưa?",
        "gloss": {
          "en": "OK. Do these fit now?",
          "ko": "네. 이건 맞아요?"
        }
      },
      {
        "who": "me",
        "text": "Vừa rồi. Tôi lấy đôi này.",
        "gloss": {
          "en": "They fit now. I'll take this pair.",
          "ko": "이제 맞아요. 이걸로 살게요."
        },
        "frames": [
          "vi-f2-02"
        ]
      }
    ]
  },
  {
    "id": "vi-2-b18",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Chatting with a gym friend about hobbies",
      "ko": "헬스장 친구와 취미 이야기"
    },
    "expressions": [
      "đi cùng nhé"
    ],
    "grammar": [
      2,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Chào bạn! Lâu lắm mới thấy bạn đến tập.",
        "gloss": {
          "en": "Hi! It's been ages since I saw you at the gym.",
          "ko": "안녕! 운동하러 온 거 진짜 오랜만이다."
        }
      },
      {
        "who": "me",
        "text": "Ừ. Dạo này công việc thế nào?",
        "gloss": {
          "en": "Yeah. How's work been lately?",
          "ko": "응. 요즘 일은 어때?"
        },
        "frames": [
          "vi-f2-19"
        ]
      },
      {
        "who": "them",
        "text": "Bận lắm. Còn bạn, dạo này thế nào?",
        "gloss": {
          "en": "Very busy. And you, how have you been?",
          "ko": "엄청 바빠. 너는 요즘 어때?"
        }
      },
      {
        "who": "me",
        "text": "Tôi đang học bơi.",
        "gloss": {
          "en": "I'm learning to swim.",
          "ko": "나 수영 배우는 중이야."
        },
        "frames": [
          "vi-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Hay đấy! Bạn thích bơi à?",
        "gloss": {
          "en": "Nice! Do you like swimming?",
          "ko": "좋네! 수영 좋아해?"
        }
      },
      {
        "who": "me",
        "text": "Tôi thích bơi lắm, nhưng bơi chưa giỏi.",
        "gloss": {
          "en": "I really like it, but I'm not good yet.",
          "ko": "엄청 좋아하는데 아직 잘 못해."
        },
        "frames": [
          "vi-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Cuối tuần mình hay đi bơi ở hồ Tây.",
        "gloss": {
          "en": "I often swim at West Lake on weekends.",
          "ko": "나 주말마다 서호에서 수영해."
        }
      },
      {
        "who": "me",
        "text": "Thế à? Mình đi cùng nhé.",
        "gloss": {
          "en": "Really? Let's go together.",
          "ko": "그래? 같이 가자."
        },
        "frames": [
          "vi-f2-11"
        ]
      }
    ]
  },
  {
    "id": "vi-2-b19",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Phoning a restaurant to book a table",
      "ko": "식당에 전화해서 자리 예약하기"
    },
    "expressions": [
      "mấy giờ"
    ],
    "grammar": [
      1,
      3,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Alô, nhà hàng Sen xin nghe.",
        "gloss": {
          "en": "Hello, Sen Restaurant.",
          "ko": "여보세요, 센 레스토랑입니다."
        }
      },
      {
        "who": "me",
        "text": "Chào chị. Tôi muốn đặt bàn cho bốn người.",
        "gloss": {
          "en": "Hello. I'd like to book a table for four.",
          "ko": "안녕하세요. 네 명 자리 예약하고 싶어요."
        },
        "frames": [
          "vi-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Vâng, bạn đặt cho tối nay à?",
        "gloss": {
          "en": "Sure, is that for tonight?",
          "ko": "네, 오늘 저녁이요?"
        }
      },
      {
        "who": "me",
        "text": "Không, tối thứ bảy. Nhà hàng đóng cửa lúc mấy giờ?",
        "gloss": {
          "en": "No, Saturday evening. What time do you close?",
          "ko": "아니요, 토요일 저녁이요. 몇 시에 문 닫아요?"
        },
        "frames": [
          "vi-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "Mười giờ tối ạ.",
        "gloss": {
          "en": "Ten in the evening.",
          "ko": "밤 열 시요."
        }
      },
      {
        "who": "me",
        "text": "Vì bạn tôi tan làm muộn nên chúng tôi sẽ đến lúc tám giờ.",
        "gloss": {
          "en": "My friend finishes work late, so we'll come at eight.",
          "ko": "친구가 늦게 퇴근해서 여덟 시에 갈게요."
        },
        "frames": [
          "vi-f2-14",
          "vi-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Được ạ. Bạn có muốn ngồi ngoài trời không?",
        "gloss": {
          "en": "OK. Would you like to sit outside?",
          "ko": "알겠습니다. 야외 자리로 하실래요?"
        }
      },
      {
        "who": "me",
        "text": "Không, trời nóng quá. Ngồi trong nhà nhé.",
        "gloss": {
          "en": "No, it's too hot. Inside, please.",
          "ko": "아니요, 너무 더워요. 안쪽으로 해 주세요."
        },
        "frames": [
          "vi-f2-13"
        ]
      }
    ]
  },
  {
    "id": "vi-2-b20",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Calling your manager to take a sick day",
      "ko": "아파서 팀장님께 전화로 병가 내기"
    },
    "expressions": [
      "tôi bị đau họng"
    ],
    "grammar": [
      0,
      1,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Alô, có chuyện gì thế?",
        "gloss": {
          "en": "Hello, what's up?",
          "ko": "여보세요, 무슨 일이에요?"
        }
      },
      {
        "who": "me",
        "text": "Chào anh. Tôi bị đau họng, sốt nữa.",
        "gloss": {
          "en": "Hello. I have a sore throat, and a fever too.",
          "ko": "안녕하세요, 팀장님. 목이 아프고 열도 나요."
        },
        "frames": [
          "vi-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "Thế à? Bạn đi khám chưa?",
        "gloss": {
          "en": "Really? Have you seen a doctor?",
          "ko": "그래요? 병원은 갔어요?"
        }
      },
      {
        "who": "me",
        "text": "Hôm qua tôi đã đi khám rồi.",
        "gloss": {
          "en": "I went to the doctor yesterday.",
          "ko": "어제 병원에 다녀왔어요."
        },
        "frames": [
          "vi-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Bác sĩ nói gì?",
        "gloss": {
          "en": "What did the doctor say?",
          "ko": "의사가 뭐래요?"
        }
      },
      {
        "who": "me",
        "text": "Vì tôi bị sốt nên bác sĩ bảo nghỉ hai ngày.",
        "gloss": {
          "en": "Because I have a fever, the doctor said to rest for two days.",
          "ko": "열이 나서 의사가 이틀 쉬라고 했어요."
        },
        "frames": [
          "vi-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Được, bạn nghỉ đi. Đừng lo việc nhé.",
        "gloss": {
          "en": "OK, take the time off. Don't worry about work.",
          "ko": "알겠어요, 쉬어요. 일 걱정은 하지 말고요."
        }
      },
      {
        "who": "me",
        "text": "Cảm ơn anh. Tôi sẽ gửi email cho anh.",
        "gloss": {
          "en": "Thank you. I'll send you an email.",
          "ko": "고맙습니다. 이메일 보내 드릴게요."
        },
        "frames": [
          "vi-f2-03"
        ]
      }
    ]
  },
  {
    "id": "vi-3-b01",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Reporting a lost wallet at the hotel reception",
      "ko": "호텔 프런트에 지갑 잃어버린 일 알리기"
    },
    "expressions": [
      "lúc đầu",
      "có lẽ"
    ],
    "grammar": [
      1,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Chào bạn, trông bạn lo lắng quá. Có chuyện gì vậy?",
        "gloss": {
          "en": "Hi, you look worried. What's happened?",
          "ko": "안녕하세요, 걱정스러워 보이네요. 무슨 일 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Chị ơi, tôi bị mất ví rồi. Trong đó có thẻ ngân hàng.",
        "gloss": {
          "en": "I've lost my wallet. My bank card is in it.",
          "ko": "저기요, 지갑을 잃어버렸어요. 안에 은행 카드가 있어요."
        },
        "frames": [
          "vi-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "Ôi, bạn nhớ lần cuối thấy nó ở đâu không?",
        "gloss": {
          "en": "Oh no, do you remember where you last saw it?",
          "ko": "어머, 마지막으로 어디서 봤는지 기억나요?"
        }
      },
      {
        "who": "me",
        "text": "Lúc đầu tôi nghĩ là để trong phòng, nhưng không thấy.",
        "gloss": {
          "en": "At first I thought I'd left it in the room, but it's not there.",
          "ko": "처음엔 방에 둔 줄 알았는데, 없어요."
        },
        "frames": [
          "vi-f3-11",
          "vi-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Bạn có đi taxi hay ăn ở đâu không?",
        "gloss": {
          "en": "Did you take a taxi or eat anywhere?",
          "ko": "택시를 탔거나 어디서 밥을 먹었어요?"
        }
      },
      {
        "who": "me",
        "text": "Có lẽ tôi để quên trên taxi sáng nay.",
        "gloss": {
          "en": "Maybe I left it in the taxi this morning.",
          "ko": "아마 오늘 아침 택시에 두고 내린 것 같아요."
        },
        "frames": [
          "vi-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Bạn có hóa đơn taxi không? Để tôi gọi cho hãng xe.",
        "gloss": {
          "en": "Do you have the taxi receipt? Let me call the taxi company.",
          "ko": "택시 영수증 있어요? 제가 택시 회사에 전화해 볼게요."
        }
      },
      {
        "who": "me",
        "text": "Có đây. Nếu tìm được ví thì tôi cảm ơn chị nhiều lắm.",
        "gloss": {
          "en": "Here it is. If you find the wallet, I'll be so grateful.",
          "ko": "여기 있어요. 지갑을 찾으면 정말 고맙겠어요."
        },
        "frames": [
          "vi-f3-07"
        ]
      }
    ]
  },
  {
    "id": "vi-3-b02",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling a repairman about a broken washing machine",
      "ko": "고장 난 세탁기 때문에 수리 기사님께 전화하기"
    },
    "expressions": [
      "bị hỏng rồi",
      "sửa giúp tôi"
    ],
    "grammar": [
      1,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Alô, sửa chữa điện máy xin nghe.",
        "gloss": {
          "en": "Hello, appliance repairs.",
          "ko": "여보세요, 가전 수리입니다."
        }
      },
      {
        "who": "me",
        "text": "Chào anh. Máy giặt nhà tôi bị hỏng rồi.",
        "gloss": {
          "en": "Hello. My washing machine is broken.",
          "ko": "안녕하세요. 저희 집 세탁기가 고장 났어요."
        },
        "frames": [
          "vi-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Máy bị làm sao? Không chạy hay không xả nước?",
        "gloss": {
          "en": "What's wrong with it? It won't run, or it won't drain?",
          "ko": "어떻게 안 돼요? 안 돌아가요, 물이 안 빠져요?"
        }
      },
      {
        "who": "me",
        "text": "Tôi vừa giặt quần áo xong thì nó không xả nước nữa.",
        "gloss": {
          "en": "I'd just finished a wash when it stopped draining.",
          "ko": "방금 빨래를 끝냈는데 물이 안 빠져요."
        },
        "frames": [
          "vi-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "Bạn kiểm tra ống nước chưa?",
        "gloss": {
          "en": "Have you checked the hose?",
          "ko": "배수 호스는 확인했어요?"
        }
      },
      {
        "who": "me",
        "text": "Trước khi gọi anh, tôi đã kiểm tra rồi. Ống nước vẫn bình thường.",
        "gloss": {
          "en": "Before calling you, I checked it. The hose looks normal.",
          "ko": "전화하기 전에 확인했어요. 호스는 괜찮아요."
        },
        "frames": [
          "vi-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "Thế thì chiều nay tôi qua xem nhé.",
        "gloss": {
          "en": "Then I'll come over and look this afternoon.",
          "ko": "그럼 오늘 오후에 가서 볼게요."
        }
      },
      {
        "who": "me",
        "text": "Vâng. Anh sửa giúp tôi cái máy giặt được không? Tôi cần dùng gấp.",
        "gloss": {
          "en": "OK. Could you fix the washing machine for me? I need it urgently.",
          "ko": "네. 세탁기 좀 고쳐 주실 수 있어요? 급하게 써야 해요."
        },
        "frames": [
          "vi-f3-06"
        ]
      }
    ]
  },
  {
    "id": "vi-3-b03",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Choosing between two laptops at an electronics store",
      "ko": "전자제품 매장에서 노트북 두 대 중 고르기"
    },
    "expressions": [
      "cái nào tốt hơn",
      "theo tôi"
    ],
    "grammar": [
      0,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Chào bạn, bạn đang tìm máy tính à?",
        "gloss": {
          "en": "Hi, are you looking for a laptop?",
          "ko": "안녕하세요, 노트북 찾으세요?"
        }
      },
      {
        "who": "me",
        "text": "Vâng. Hai cái này, cái nào tốt hơn?",
        "gloss": {
          "en": "Yes. Of these two, which one is better?",
          "ko": "네. 이 두 개 중에 어떤 게 더 좋아요?"
        },
        "frames": [
          "vi-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Cái này nhẹ hơn, còn cái kia nhanh hơn.",
        "gloss": {
          "en": "This one is lighter, and that one is faster.",
          "ko": "이건 더 가볍고, 저건 더 빨라요."
        }
      },
      {
        "who": "me",
        "text": "Cái nào pin lâu nhất?",
        "gloss": {
          "en": "Which one has the longest battery life?",
          "ko": "어떤 게 배터리가 제일 오래가요?"
        },
        "frames": [
          "vi-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Cái nhẹ này pin lâu nhất, khoảng mười tiếng.",
        "gloss": {
          "en": "This light one has the longest battery, about ten hours.",
          "ko": "이 가벼운 게 배터리가 제일 오래가요, 열 시간쯤이요."
        }
      },
      {
        "who": "me",
        "text": "Nhưng nó đắt hơn cái kia nhiều không?",
        "gloss": {
          "en": "But is it much more expensive than that one?",
          "ko": "그런데 저것보다 많이 비싸요?"
        },
        "frames": [
          "vi-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Chỉ đắt hơn hai triệu thôi.",
        "gloss": {
          "en": "It's only two million more.",
          "ko": "이백만 동만 더 비싸요."
        }
      },
      {
        "who": "me",
        "text": "Theo tôi, cái nhẹ tiện hơn vì tôi hay đi công tác.",
        "gloss": {
          "en": "In my opinion, the light one is more convenient because I travel for work a lot.",
          "ko": "제 생각엔 가벼운 게 더 편해요, 출장을 자주 가거든요."
        },
        "frames": [
          "vi-f3-15"
        ]
      }
    ]
  },
  {
    "id": "vi-3-b04",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Planning a weekend hike with a friend",
      "ko": "친구와 주말 등산 계획 세우기"
    },
    "expressions": [
      "có lẽ",
      "tôi cũng nghĩ vậy"
    ],
    "grammar": [
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Cuối tuần này mình đi leo núi Ba Vì không?",
        "gloss": {
          "en": "Shall we go hiking at Ba Vì this weekend?",
          "ko": "이번 주말에 바비산 등산 갈래?"
        }
      },
      {
        "who": "me",
        "text": "Nếu trời đẹp thì mình đi nhé.",
        "gloss": {
          "en": "If the weather's nice, let's go.",
          "ko": "날씨 좋으면 가자."
        },
        "frames": [
          "vi-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Dự báo nói là thứ bảy có thể mưa.",
        "gloss": {
          "en": "The forecast says it might rain on Saturday.",
          "ko": "예보에서 토요일에 비 올 수도 있대."
        }
      },
      {
        "who": "me",
        "text": "Có lẽ chủ nhật đẹp hơn. Mình đi chủ nhật nhé.",
        "gloss": {
          "en": "Maybe Sunday will be nicer. Let's go on Sunday.",
          "ko": "아마 일요일이 더 좋을 거야. 일요일에 가자."
        },
        "frames": [
          "vi-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Được. Mình đi xe máy hay đi xe buýt?",
        "gloss": {
          "en": "OK. Shall we go by motorbike or by bus?",
          "ko": "좋아. 오토바이로 갈까, 버스로 갈까?"
        }
      },
      {
        "who": "me",
        "text": "Tôi nghĩ là đi xe máy tiện hơn.",
        "gloss": {
          "en": "I think going by motorbike is more convenient.",
          "ko": "오토바이가 더 편할 것 같아."
        },
        "frames": [
          "vi-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Ừ, nhưng phải đi sớm, đường xa lắm.",
        "gloss": {
          "en": "Yeah, but we need to leave early, it's a long way.",
          "ko": "응, 근데 일찍 출발해야 해, 길이 멀어."
        }
      },
      {
        "who": "me",
        "text": "Tôi cũng nghĩ vậy. Mình sáu giờ sáng đi nhé.",
        "gloss": {
          "en": "I think so too. Let's leave at six in the morning.",
          "ko": "나도 그렇게 생각해. 아침 여섯 시에 출발하자."
        },
        "frames": [
          "vi-f2-11"
        ]
      }
    ]
  },
  {
    "id": "vi-3-b05",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Recommending a restaurant to a new coworker",
      "ko": "새 동료에게 식당 추천하기"
    },
    "expressions": [
      "thật ra"
    ],
    "grammar": [
      0,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Gần công ty có quán nào ngon không?",
        "gloss": {
          "en": "Is there anywhere good to eat near the office?",
          "ko": "회사 근처에 맛있는 데 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Có. Tôi nghĩ là quán bún chả đầu ngõ ngon nhất.",
        "gloss": {
          "en": "Yes. I think the bún chả place at the end of the alley is the best.",
          "ko": "있어요. 골목 입구 분짜 집이 제일 맛있는 것 같아요."
        },
        "frames": [
          "vi-f3-13",
          "vi-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Quán đó có đông không?",
        "gloss": {
          "en": "Is it crowded?",
          "ko": "거기 사람 많아요?"
        }
      },
      {
        "who": "me",
        "text": "Tuy hơi đông nhưng phục vụ rất nhanh.",
        "gloss": {
          "en": "Although it's a bit crowded, the service is very fast.",
          "ko": "좀 붐비긴 해도 음식이 아주 빨리 나와요."
        },
        "frames": [
          "vi-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Giá thế nào?",
        "gloss": {
          "en": "How are the prices?",
          "ko": "가격은 어때요?"
        }
      },
      {
        "who": "me",
        "text": "Thật ra rẻ hơn quán ở toà nhà mình.",
        "gloss": {
          "en": "Actually, it's cheaper than the place in our building.",
          "ko": "사실 우리 건물 안 식당보다 싸요."
        },
        "frames": [
          "vi-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Thế à? Trưa nay đi thử không?",
        "gloss": {
          "en": "Really? Shall we try it at lunch today?",
          "ko": "그래요? 오늘 점심에 가 볼까요?"
        }
      },
      {
        "who": "me",
        "text": "Được. Nếu đi sớm thì không phải đợi.",
        "gloss": {
          "en": "Sure. If we go early, we won't have to wait.",
          "ko": "좋아요. 일찍 가면 안 기다려도 돼요."
        },
        "frames": [
          "vi-f3-07"
        ]
      }
    ]
  },
  {
    "id": "vi-3-b06",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Telling a friend about getting lost on a trip",
      "ko": "친구에게 여행 중 길 잃은 이야기 하기"
    },
    "expressions": [
      "lúc đầu",
      "sau đó",
      "cuối cùng",
      "may quá"
    ],
    "grammar": [
      1,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Chuyến đi Sa Pa của bạn thế nào?",
        "gloss": {
          "en": "How was your trip to Sa Pa?",
          "ko": "사파 여행 어땠어?"
        }
      },
      {
        "who": "me",
        "text": "Vui, nhưng tôi bị lạc đường một lần.",
        "gloss": {
          "en": "Fun, but I got lost once.",
          "ko": "재밌었는데, 한 번 길을 잃었어."
        },
        "frames": [
          "vi-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "Thật à? Sao thế?",
        "gloss": {
          "en": "Really? How come?",
          "ko": "정말? 왜?"
        }
      },
      {
        "who": "me",
        "text": "Lúc đầu tôi đi theo bản đồ trên điện thoại. Sau đó điện thoại hết pin.",
        "gloss": {
          "en": "At first I followed the map on my phone. Then my phone died.",
          "ko": "처음엔 휴대폰 지도를 보고 갔어. 그런데 휴대폰 배터리가 나갔어."
        },
        "frames": [
          "vi-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Ôi, rồi bạn làm thế nào?",
        "gloss": {
          "en": "Oh no, so what did you do?",
          "ko": "어머, 그래서 어떻게 했어?"
        }
      },
      {
        "who": "me",
        "text": "Sau khi hỏi mấy người dân, tôi tìm được đường lớn.",
        "gloss": {
          "en": "After asking a few locals, I found the main road.",
          "ko": "현지 사람 몇 명한테 물어보고 나서 큰길을 찾았어."
        },
        "frames": [
          "vi-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "May quá! Thế bạn về khách sạn kịp không?",
        "gloss": {
          "en": "Lucky! So did you make it back to the hotel in time?",
          "ko": "다행이다! 그럼 호텔엔 제때 돌아갔어?"
        }
      },
      {
        "who": "me",
        "text": "Cuối cùng tôi về muộn, nhưng may quá, không sao.",
        "gloss": {
          "en": "In the end I got back late, but luckily it was fine.",
          "ko": "결국 늦게 돌아갔지만, 다행히 괜찮았어."
        },
        "frames": [
          "vi-f3-12"
        ]
      }
    ]
  },
  {
    "id": "vi-3-b07",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Passing on a message from the boss about a meeting",
      "ko": "팀장님 말씀을 동료에게 전하기"
    },
    "expressions": [
      "có lẽ"
    ],
    "grammar": [
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bạn có gặp anh Quân không? Mình tìm anh ấy mãi.",
        "gloss": {
          "en": "Have you seen Quân? I've been looking for him for ages.",
          "ko": "꽌 씨 봤어요? 한참 찾았어요."
        }
      },
      {
        "who": "me",
        "text": "Tôi vừa nói chuyện với anh ấy.",
        "gloss": {
          "en": "I've just talked to him.",
          "ko": "방금 그분이랑 얘기했어요."
        },
        "frames": [
          "vi-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "Thế cuộc họp chiều nay vẫn hai giờ chứ?",
        "gloss": {
          "en": "So is this afternoon's meeting still at two?",
          "ko": "그럼 오늘 오후 회의는 그대로 두 시예요?"
        }
      },
      {
        "who": "me",
        "text": "Không. Anh ấy nói là cuộc họp dời sang bốn giờ.",
        "gloss": {
          "en": "No. He said the meeting has been moved to four.",
          "ko": "아니요. 회의가 네 시로 바뀌었대요."
        },
        "frames": [
          "vi-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "Sao lại dời?",
        "gloss": {
          "en": "Why was it moved?",
          "ko": "왜 미뤄졌어요?"
        }
      },
      {
        "who": "me",
        "text": "Có lẽ vì khách hàng đến muộn.",
        "gloss": {
          "en": "Probably because the client is arriving late.",
          "ko": "아마 고객이 늦게 와서일 거예요."
        },
        "frames": [
          "vi-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Ừ. Bạn đi ăn trưa không?",
        "gloss": {
          "en": "OK. Are you going for lunch?",
          "ko": "네. 점심 먹으러 가요?"
        }
      },
      {
        "who": "me",
        "text": "Tôi sắp đi rồi. Đi cùng không?",
        "gloss": {
          "en": "I'm about to go. Want to come along?",
          "ko": "막 가려던 참이에요. 같이 갈래요?"
        },
        "frames": [
          "vi-f3-17"
        ]
      }
    ]
  },
  {
    "id": "vi-3-b08",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A friendly debate about Hanoi and Saigon food",
      "ko": "하노이 음식과 사이공 음식 가벼운 논쟁"
    },
    "expressions": [
      "không hẳn",
      "theo tôi",
      "nói chung"
    ],
    "grammar": [
      0,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Mình thấy đồ ăn Hà Nội ngon hơn Sài Gòn nhiều.",
        "gloss": {
          "en": "I think Hanoi food is much better than Saigon food.",
          "ko": "나는 하노이 음식이 사이공보다 훨씬 맛있는 것 같아."
        }
      },
      {
        "who": "me",
        "text": "Không hẳn, tôi nghĩ hơi khác.",
        "gloss": {
          "en": "Not exactly, I see it a bit differently.",
          "ko": "꼭 그렇진 않아, 나는 생각이 좀 달라."
        },
        "frames": [
          "vi-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "Thế à? Bạn thích ở đâu hơn?",
        "gloss": {
          "en": "Really? Which do you prefer?",
          "ko": "그래? 어디가 더 좋은데?"
        }
      },
      {
        "who": "me",
        "text": "Theo tôi, phở Hà Nội ngon hơn, nhưng cơm tấm Sài Gòn ngon nhất.",
        "gloss": {
          "en": "In my view, Hanoi phở is better, but Saigon broken rice is the best.",
          "ko": "내 생각엔 쌀국수는 하노이가 낫지만, 껌떰은 사이공이 최고야."
        },
        "frames": [
          "vi-f3-15",
          "vi-f3-01",
          "vi-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Ha ha, bạn công bằng quá.",
        "gloss": {
          "en": "Ha ha, you're so fair.",
          "ko": "하하, 너 참 공평하다."
        }
      },
      {
        "who": "me",
        "text": "Nói chung, tôi nghĩ là ở đâu cũng có món ngon.",
        "gloss": {
          "en": "Generally, I think there's good food everywhere.",
          "ko": "대체로 어디든 맛있는 게 있는 것 같아."
        },
        "frames": [
          "vi-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Đúng là thế. Bạn đã ăn bánh xèo miền Tây chưa?",
        "gloss": {
          "en": "That's true. Have you had bánh xèo from the Mekong Delta?",
          "ko": "맞아. 메콩 지역 반쎄오 먹어 봤어?"
        }
      },
      {
        "who": "me",
        "text": "Chưa. Nếu có dịp thì tôi sẽ ăn thử.",
        "gloss": {
          "en": "Not yet. If I get the chance, I'll try it.",
          "ko": "아직. 기회가 되면 먹어 볼게."
        },
        "frames": [
          "vi-f3-07"
        ]
      }
    ]
  },
  {
    "id": "vi-3-b09",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "The waiter brings the wrong dish",
      "ko": "종업원이 음식을 잘못 가져왔을 때"
    },
    "expressions": [
      "nhầm rồi"
    ],
    "grammar": [
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Món của bạn đây: bò lúc lắc.",
        "gloss": {
          "en": "Here's your dish: shaking beef.",
          "ko": "주문하신 보룩락 나왔습니다."
        }
      },
      {
        "who": "me",
        "text": "Xin lỗi, tôi nghĩ là anh mang nhầm rồi.",
        "gloss": {
          "en": "Sorry, I think you've brought the wrong dish.",
          "ko": "죄송한데, 음식이 잘못 나온 것 같아요."
        },
        "frames": [
          "vi-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Ồ, bạn gọi món gì ạ?",
        "gloss": {
          "en": "Oh, what did you order?",
          "ko": "아, 뭐 주문하셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Tôi vừa gọi cơm rang hải sản.",
        "gloss": {
          "en": "I just ordered seafood fried rice.",
          "ko": "방금 해산물 볶음밥 시켰어요."
        },
        "frames": [
          "vi-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "Xin lỗi bạn. Có lẽ bàn bên cạnh gọi món này.",
        "gloss": {
          "en": "I'm sorry. Maybe the next table ordered this.",
          "ko": "죄송합니다. 아마 옆 테이블 음식인가 봐요."
        }
      },
      {
        "who": "me",
        "text": "Không sao. Có lẽ cơm rang sắp xong rồi chứ?",
        "gloss": {
          "en": "No problem. The fried rice is probably nearly ready, right?",
          "ko": "괜찮아요. 볶음밥은 아마 거의 다 됐겠죠?"
        },
        "frames": [
          "vi-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Vâng, năm phút nữa thôi ạ.",
        "gloss": {
          "en": "Yes, just five more minutes.",
          "ko": "네, 오 분만 기다려 주세요."
        }
      },
      {
        "who": "me",
        "text": "Được. Nếu lâu quá thì cho tôi biết nhé.",
        "gloss": {
          "en": "OK. If it takes too long, let me know.",
          "ko": "알겠어요. 너무 오래 걸리면 알려 주세요."
        },
        "frames": [
          "vi-f3-07"
        ]
      }
    ]
  },
  {
    "id": "vi-3-b10",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Getting a cracked phone screen fixed",
      "ko": "깨진 휴대폰 화면 고치기"
    },
    "expressions": [
      "bị hỏng rồi",
      "sửa giúp tôi",
      "để tôi xem"
    ],
    "grammar": [
      1,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Chào bạn, điện thoại bạn bị sao thế?",
        "gloss": {
          "en": "Hi, what's wrong with your phone?",
          "ko": "안녕하세요, 휴대폰이 어떻게 됐어요?"
        }
      },
      {
        "who": "me",
        "text": "Tôi làm rơi điện thoại. Màn hình bị hỏng rồi.",
        "gloss": {
          "en": "I dropped my phone. The screen is broken.",
          "ko": "휴대폰을 떨어뜨렸어요. 화면이 고장 났어요."
        },
        "frames": [
          "vi-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Để tôi xem. Ừ, phải thay màn hình mới.",
        "gloss": {
          "en": "Let me see. Yes, it needs a new screen.",
          "ko": "어디 봐요. 네, 화면을 새로 갈아야 해요."
        }
      },
      {
        "who": "me",
        "text": "Anh sửa giúp tôi cái màn hình được không?",
        "gloss": {
          "en": "Could you fix the screen for me?",
          "ko": "화면 좀 고쳐 주실 수 있어요?"
        },
        "frames": [
          "vi-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Được, nhưng phải đợi khoảng hai tiếng.",
        "gloss": {
          "en": "Sure, but you'll have to wait about two hours.",
          "ko": "네, 그런데 두 시간쯤 기다리셔야 해요."
        }
      },
      {
        "who": "me",
        "text": "Nếu đợi hai tiếng thì tôi đi ăn trưa rồi quay lại.",
        "gloss": {
          "en": "If it's two hours, I'll go have lunch and come back.",
          "ko": "두 시간이면 점심 먹고 다시 올게요."
        },
        "frames": [
          "vi-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Vâng. Bạn có muốn dán kính cường lực luôn không?",
        "gloss": {
          "en": "OK. Would you like a tempered glass protector too?",
          "ko": "네. 강화유리 필름도 같이 붙여 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Có. Để tôi xem giá trước đã. Cái nào tốt nhất?",
        "gloss": {
          "en": "Yes. Let me check the price first. Which one is the best?",
          "ko": "네. 가격 먼저 볼게요. 어떤 게 제일 좋아요?"
        },
        "frames": [
          "vi-f3-02"
        ]
      }
    ]
  },
  {
    "id": "vi-3-b11",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Comparing two flats with a rental agent",
      "ko": "부동산 중개인과 집 두 곳 비교하기"
    },
    "expressions": [
      "để tôi xem"
    ],
    "grammar": [
      0,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bạn xem xong hai căn rồi. Bạn thấy thế nào?",
        "gloss": {
          "en": "You've seen both flats. What do you think?",
          "ko": "두 집 다 보셨네요. 어떠세요?"
        }
      },
      {
        "who": "me",
        "text": "Căn ở tầng mười sáng hơn căn ở tầng ba.",
        "gloss": {
          "en": "The flat on the tenth floor is brighter than the one on the third.",
          "ko": "십 층 집이 삼 층 집보다 더 밝아요."
        },
        "frames": [
          "vi-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Đúng vậy, nhưng căn tầng ba gần chợ hơn.",
        "gloss": {
          "en": "That's right, but the third-floor one is closer to the market.",
          "ko": "맞아요, 그런데 삼 층 집이 시장에 더 가까워요."
        }
      },
      {
        "who": "me",
        "text": "Tuy căn tầng mười hơi xa nhưng rất yên tĩnh.",
        "gloss": {
          "en": "Although the tenth-floor one is a bit far, it's very quiet.",
          "ko": "십 층 집은 좀 멀긴 해도 아주 조용해요."
        },
        "frames": [
          "vi-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Giá thì căn tầng mười đắt hơn một triệu một tháng.",
        "gloss": {
          "en": "Price-wise, the tenth-floor one is a million more a month.",
          "ko": "가격은 십 층 집이 한 달에 백만 동 더 비싸요."
        }
      },
      {
        "who": "me",
        "text": "Để tôi xem... Hai căn này, căn nào tốt hơn cho người ở một mình?",
        "gloss": {
          "en": "Let me think... Of these two, which is better for someone living alone?",
          "ko": "어디 보자… 이 두 집 중에 혼자 사는 사람한테는 어디가 더 좋아요?"
        },
        "frames": [
          "vi-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Nếu bạn làm việc ở nhà thì tôi nghĩ căn tầng mười hợp hơn.",
        "gloss": {
          "en": "If you work from home, I think the tenth-floor one suits you better.",
          "ko": "재택근무하시면 십 층 집이 더 맞을 것 같아요."
        }
      },
      {
        "who": "me",
        "text": "Theo tôi, yên tĩnh quan trọng hơn. Tôi chọn căn tầng mười.",
        "gloss": {
          "en": "In my view, quiet matters more. I'll take the tenth-floor flat.",
          "ko": "제 생각엔 조용한 게 더 중요해요. 십 층 집으로 할게요."
        },
        "frames": [
          "vi-f3-15"
        ]
      }
    ]
  },
  {
    "id": "vi-3-b12",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Leaving the office and making evening plans",
      "ko": "퇴근하며 저녁 약속 잡기"
    },
    "expressions": [
      "tùy bạn"
    ],
    "grammar": [
      2,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bạn chưa về à? Muộn rồi đấy.",
        "gloss": {
          "en": "You haven't gone home yet? It's late.",
          "ko": "아직 퇴근 안 했어요? 늦었어요."
        }
      },
      {
        "who": "me",
        "text": "Tôi sắp về rồi. Tôi đang gửi nốt cái email.",
        "gloss": {
          "en": "I'm about to leave. I'm just sending one last email.",
          "ko": "이제 곧 가요. 마지막 이메일 보내는 중이에요."
        },
        "frames": [
          "vi-f3-17",
          "vi-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Tối nay bạn có kế hoạch gì không?",
        "gloss": {
          "en": "Do you have any plans tonight?",
          "ko": "오늘 저녁에 무슨 계획 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Sau khi ăn tối, tôi định đi dạo hồ Tây.",
        "gloss": {
          "en": "After dinner, I'm planning to take a walk around West Lake.",
          "ko": "저녁 먹고 나서 서호에 산책 가려고요."
        },
        "frames": [
          "vi-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "Hay đấy. Mình đi cùng được không?",
        "gloss": {
          "en": "Nice. Can I come along?",
          "ko": "좋네요. 같이 가도 돼요?"
        }
      },
      {
        "who": "me",
        "text": "Được chứ. Nếu bạn đói thì mình ăn tối cùng luôn.",
        "gloss": {
          "en": "Of course. If you're hungry, let's have dinner together too.",
          "ko": "물론이죠. 배고프면 저녁도 같이 먹어요."
        },
        "frames": [
          "vi-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Ăn gì bây giờ nhỉ?",
        "gloss": {
          "en": "What shall we eat?",
          "ko": "뭐 먹을까요?"
        }
      },
      {
        "who": "me",
        "text": "Tùy bạn. Tôi nghĩ là ăn lẩu cũng được.",
        "gloss": {
          "en": "Up to you. I think hotpot would be fine.",
          "ko": "마음대로 해요. 저는 훠궈도 괜찮을 것 같아요."
        },
        "frames": [
          "vi-f3-13"
        ]
      }
    ]
  },
  {
    "id": "vi-3-b13",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Choosing between train and bus at a travel agency",
      "ko": "여행사에서 기차와 버스 중 고르기"
    },
    "expressions": [
      "cái nào tốt hơn"
    ],
    "grammar": [
      0,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bạn muốn đi Đà Nẵng bằng tàu hay xe khách?",
        "gloss": {
          "en": "Would you like to go to Đà Nẵng by train or coach?",
          "ko": "다낭에 기차로 가실래요, 버스로 가실래요?"
        }
      },
      {
        "who": "me",
        "text": "Tôi chưa biết. Tàu hay xe khách, cái nào tốt hơn?",
        "gloss": {
          "en": "I don't know yet. Train or coach, which is better?",
          "ko": "아직 모르겠어요. 기차랑 버스 중 어떤 게 더 좋아요?"
        },
        "frames": [
          "vi-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Tàu thoải mái hơn, nhưng xe khách rẻ hơn.",
        "gloss": {
          "en": "The train is more comfortable, but the coach is cheaper.",
          "ko": "기차가 더 편하고, 버스는 더 싸요."
        }
      },
      {
        "who": "me",
        "text": "Tàu có chậm hơn xe khách không?",
        "gloss": {
          "en": "Is the train slower than the coach?",
          "ko": "기차가 버스보다 느려요?"
        },
        "frames": [
          "vi-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Thật ra gần như nhau, khoảng mười lăm tiếng.",
        "gloss": {
          "en": "Actually, they're about the same, around fifteen hours.",
          "ko": "사실 거의 비슷해요, 열다섯 시간쯤이요."
        }
      },
      {
        "who": "me",
        "text": "Theo tôi, đi tàu đêm thì ngủ được, tiện hơn.",
        "gloss": {
          "en": "In my view, an overnight train is more convenient since I can sleep.",
          "ko": "제 생각엔 야간 기차를 타면 잘 수 있어서 더 편해요."
        },
        "frames": [
          "vi-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "Vâng, nhưng vé tàu tuần này sắp hết rồi.",
        "gloss": {
          "en": "Yes, but train tickets for this week are almost sold out.",
          "ko": "네, 그런데 이번 주 기차표가 거의 매진이에요."
        }
      },
      {
        "who": "me",
        "text": "Có lẽ tôi nên đặt ngay bây giờ.",
        "gloss": {
          "en": "Maybe I should book right now.",
          "ko": "아마 지금 바로 예약하는 게 좋겠어요."
        },
        "frames": [
          "vi-f3-19"
        ]
      }
    ]
  },
  {
    "id": "vi-3-b14",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A follow-up visit at the clinic",
      "ko": "병원 재진료"
    },
    "expressions": [
      "đúng rồi"
    ],
    "grammar": [
      1,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hôm nay bạn thấy thế nào? Đỡ hơn chưa?",
        "gloss": {
          "en": "How do you feel today? Any better?",
          "ko": "오늘은 좀 어때요? 나아졌어요?"
        }
      },
      {
        "who": "me",
        "text": "Đỡ hơn nhiều rồi. Sau khi uống thuốc, tôi ngủ ngon hơn.",
        "gloss": {
          "en": "Much better. After taking the medicine, I sleep better.",
          "ko": "많이 나아졌어요. 약 먹고 나서 잠을 더 잘 자요."
        },
        "frames": [
          "vi-f3-09",
          "vi-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Tốt quá. Còn ho không?",
        "gloss": {
          "en": "Great. Are you still coughing?",
          "ko": "다행이네요. 기침은 아직 해요?"
        }
      },
      {
        "who": "me",
        "text": "Còn một chút. Tối qua tôi bị ho nhiều.",
        "gloss": {
          "en": "A little. Last night I coughed a lot.",
          "ko": "조금요. 어젯밤에 기침을 많이 했어요."
        },
        "frames": [
          "vi-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "Có lẽ vì trời lạnh. Bạn có uống nước ấm không?",
        "gloss": {
          "en": "Probably because of the cold. Are you drinking warm water?",
          "ko": "아마 날씨가 추워서일 거예요. 따뜻한 물 마셔요?"
        }
      },
      {
        "who": "me",
        "text": "Đúng rồi, tôi nghĩ là tại trời lạnh. Tôi vừa mua thêm áo ấm.",
        "gloss": {
          "en": "Right, I think it's because of the cold. I've just bought a warm jacket.",
          "ko": "맞아요, 추워서 그런 것 같아요. 방금 따뜻한 옷도 더 샀어요."
        },
        "frames": [
          "vi-f3-13",
          "vi-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "Tốt. Bạn uống thuốc thêm ba ngày nữa nhé.",
        "gloss": {
          "en": "Good. Keep taking the medicine for three more days.",
          "ko": "좋아요. 약은 사흘 더 드세요."
        }
      },
      {
        "who": "me",
        "text": "Vâng. Nếu không đỡ thì tôi sẽ quay lại.",
        "gloss": {
          "en": "OK. If I don't get better, I'll come back.",
          "ko": "네. 안 나으면 다시 올게요."
        },
        "frames": [
          "vi-f3-07"
        ]
      }
    ]
  },
  {
    "id": "vi-3-b15",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Talking to the building manager about noisy neighbours",
      "ko": "관리인에게 이웃 소음 이야기하기"
    },
    "expressions": [
      "có vấn đề",
      "chán thật"
    ],
    "grammar": [
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Chào bạn, có việc gì thế?",
        "gloss": {
          "en": "Hi, what can I do for you?",
          "ko": "안녕하세요, 무슨 일이세요?"
        }
      },
      {
        "who": "me",
        "text": "Chào anh. Phòng bên cạnh có vấn đề. Tối nào cũng hát karaoke.",
        "gloss": {
          "en": "Hello. There's a problem with the flat next door. They sing karaoke every night.",
          "ko": "안녕하세요. 옆집에 문제가 있어요. 매일 밤 노래방 기계로 노래해요."
        },
        "frames": [
          "vi-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "Thế à? Tôi đã nói chuyện với anh chủ nhà đó rồi.",
        "gloss": {
          "en": "Really? I already talked to the man who lives there.",
          "ko": "그래요? 그 집 주인이랑 이미 얘기했어요."
        }
      },
      {
        "who": "me",
        "text": "Vâng, hôm qua tôi cũng gặp anh ấy. Anh ấy nói là sẽ hát nhỏ hơn.",
        "gloss": {
          "en": "Yes, I met him yesterday too. He said he'd sing more quietly.",
          "ko": "네, 저도 어제 그분 만났어요. 더 작게 부르겠다고 했어요."
        },
        "frames": [
          "vi-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "Nhưng vẫn ồn à?",
        "gloss": {
          "en": "But it's still noisy?",
          "ko": "그런데 아직도 시끄러워요?"
        }
      },
      {
        "who": "me",
        "text": "Tuy nhỏ hơn một chút nhưng vẫn hát đến mười hai giờ đêm. Chán thật.",
        "gloss": {
          "en": "Although it's a bit quieter, they still sing until midnight. It's really annoying.",
          "ko": "조금 작아지긴 했지만 아직도 밤 열두 시까지 불러요. 정말 짜증 나요."
        },
        "frames": [
          "vi-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Để tôi nói lại với họ. Họ phải dừng trước mười giờ.",
        "gloss": {
          "en": "I'll talk to them again. They have to stop before ten.",
          "ko": "제가 다시 얘기할게요. 열 시 전에는 그만해야 해요."
        }
      },
      {
        "who": "me",
        "text": "Cảm ơn anh. Tôi nghĩ là như vậy thì tốt hơn.",
        "gloss": {
          "en": "Thank you. I think that would be better.",
          "ko": "고마워요. 그러면 더 좋을 것 같아요."
        },
        "frames": [
          "vi-f3-13"
        ]
      }
    ]
  },
  {
    "id": "vi-3-b16",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Talking with a tutor about learning Vietnamese",
      "ko": "과외 선생님과 베트남어 공부 이야기"
    },
    "expressions": [
      "lúc đầu",
      "cuối cùng",
      "không hẳn"
    ],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bạn học tiếng Việt được một năm rồi. Bạn thấy khó không?",
        "gloss": {
          "en": "You've been studying Vietnamese for a year. Do you find it hard?",
          "ko": "베트남어 배운 지 일 년 됐네요. 어려워요?"
        }
      },
      {
        "who": "me",
        "text": "Lúc đầu tôi thấy thanh điệu khó nhất.",
        "gloss": {
          "en": "At first I found the tones the hardest.",
          "ko": "처음엔 성조가 제일 어려웠어요."
        },
        "frames": [
          "vi-f3-11",
          "vi-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Bây giờ thì sao?",
        "gloss": {
          "en": "And now?",
          "ko": "지금은요?"
        }
      },
      {
        "who": "me",
        "text": "Tuy vẫn hay sai nhưng tôi nghe hiểu nhiều hơn.",
        "gloss": {
          "en": "Although I still make mistakes often, I understand much more.",
          "ko": "아직 자주 틀리긴 해도 훨씬 많이 알아들어요."
        },
        "frames": [
          "vi-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Vậy bây giờ ngữ pháp là khó nhất à?",
        "gloss": {
          "en": "So now grammar is the hardest part?",
          "ko": "그럼 이제는 문법이 제일 어려워요?"
        }
      },
      {
        "who": "me",
        "text": "Không hẳn, tôi thấy từ vựng khó hơn.",
        "gloss": {
          "en": "Not exactly, I find vocabulary harder.",
          "ko": "꼭 그렇진 않아요, 저는 어휘가 더 어려워요."
        },
        "frames": [
          "vi-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "Bạn học từ mới thế nào?",
        "gloss": {
          "en": "How do you learn new words?",
          "ko": "새 단어는 어떻게 외워요?"
        }
      },
      {
        "who": "me",
        "text": "Tôi thử nhiều cách. Cuối cùng tôi chọn xem phim có phụ đề.",
        "gloss": {
          "en": "I tried lots of ways. In the end I chose watching films with subtitles.",
          "ko": "여러 방법을 해 봤어요. 결국 자막 있는 영화 보기로 정했어요."
        },
        "frames": [
          "vi-f3-12"
        ]
      }
    ]
  },
  {
    "id": "vi-3-b17",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A delivered fan arrives broken",
      "ko": "배송받은 선풍기가 고장 나서 왔을 때"
    },
    "expressions": [
      "bị hỏng rồi"
    ],
    "grammar": [
      1,
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Alô, cửa hàng điện máy xin nghe.",
        "gloss": {
          "en": "Hello, electronics store.",
          "ko": "여보세요, 전자제품 매장입니다."
        }
      },
      {
        "who": "me",
        "text": "Chào chị. Tôi vừa nhận cái quạt điện chị gửi.",
        "gloss": {
          "en": "Hello. I've just received the electric fan you sent.",
          "ko": "안녕하세요. 보내 주신 선풍기를 방금 받았어요."
        },
        "frames": [
          "vi-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "Vâng, quạt có vấn đề gì ạ?",
        "gloss": {
          "en": "Yes, is there a problem with the fan?",
          "ko": "네, 선풍기에 무슨 문제 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Cái quạt bị hỏng rồi. Bật lên nhưng không quay.",
        "gloss": {
          "en": "The fan is broken. It turns on but doesn't spin.",
          "ko": "선풍기가 고장 났어요. 켜지는데 안 돌아가요."
        },
        "frames": [
          "vi-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Xin lỗi bạn. Có lẽ bị hỏng lúc giao hàng.",
        "gloss": {
          "en": "I'm sorry. It was probably damaged during delivery.",
          "ko": "죄송합니다. 아마 배송 중에 고장 난 것 같아요."
        }
      },
      {
        "who": "me",
        "text": "Tôi nghĩ là vậy. Hộp cũng bị móp.",
        "gloss": {
          "en": "I think so. The box is dented too.",
          "ko": "저도 그렇게 생각해요. 상자도 찌그러졌어요."
        },
        "frames": [
          "vi-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Chúng tôi sẽ đổi cái mới cho bạn.",
        "gloss": {
          "en": "We'll exchange it for a new one.",
          "ko": "새 걸로 바꿔 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "Nếu chiều nay giao được thì tốt quá.",
        "gloss": {
          "en": "If you can deliver it this afternoon, that would be great.",
          "ko": "오늘 오후에 배송되면 정말 좋겠어요."
        },
        "frames": [
          "vi-f3-07"
        ]
      }
    ]
  },
  {
    "id": "vi-3-b18",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Choosing a gift for your mother at a department store",
      "ko": "백화점에서 어머니 선물 고르기"
    },
    "expressions": [
      "cái nào tốt hơn",
      "để tôi xem"
    ],
    "grammar": [
      0,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bạn tìm quà cho ai ạ?",
        "gloss": {
          "en": "Who are you looking for a gift for?",
          "ko": "누구 선물 찾으세요?"
        }
      },
      {
        "who": "me",
        "text": "Cho mẹ tôi. Hai cái khăn này, cái nào tốt hơn?",
        "gloss": {
          "en": "For my mother. Of these two scarves, which is better?",
          "ko": "어머니 드릴 거예요. 이 스카프 두 개 중에 어떤 게 더 좋아요?"
        },
        "frames": [
          "vi-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Khăn lụa này mềm hơn, nhưng khăn len ấm hơn.",
        "gloss": {
          "en": "This silk scarf is softer, but the wool one is warmer.",
          "ko": "이 실크 스카프가 더 부드럽고, 울 스카프는 더 따뜻해요."
        }
      },
      {
        "who": "me",
        "text": "Mẹ tôi ở Seoul, mùa đông lạnh lắm. Tôi nghĩ là khăn len hợp hơn.",
        "gloss": {
          "en": "My mum lives in Seoul, the winters are very cold. I think the wool one suits better.",
          "ko": "어머니가 서울에 사시는데 겨울이 아주 추워요. 울 스카프가 더 맞을 것 같아요."
        },
        "frames": [
          "vi-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Khăn len này là loại bán chạy nhất đấy.",
        "gloss": {
          "en": "This wool scarf is our best-seller.",
          "ko": "이 울 스카프가 제일 잘 팔려요."
        }
      },
      {
        "who": "me",
        "text": "Để tôi xem màu. Màu nào đẹp nhất?",
        "gloss": {
          "en": "Let me look at the colours. Which colour is the nicest?",
          "ko": "색깔 좀 볼게요. 어떤 색이 제일 예뻐요?"
        },
        "frames": [
          "vi-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Màu đỏ và màu xám. Bạn thích màu nào?",
        "gloss": {
          "en": "Red and grey. Which do you like?",
          "ko": "빨간색이랑 회색이요. 어떤 색이 좋아요?"
        }
      },
      {
        "who": "me",
        "text": "Theo tôi, màu đỏ trẻ hơn. Tôi lấy màu đỏ.",
        "gloss": {
          "en": "In my view, red looks younger. I'll take the red one.",
          "ko": "제 생각엔 빨간색이 더 젊어 보여요. 빨간색으로 할게요."
        },
        "frames": [
          "vi-f3-15"
        ]
      }
    ]
  },
  {
    "id": "vi-3-b19",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Missing a flight at the airport",
      "ko": "공항에서 비행기를 놓쳤을 때"
    },
    "expressions": [
      "cuối cùng"
    ],
    "grammar": [
      1,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Chào bạn, tôi giúp gì được ạ?",
        "gloss": {
          "en": "Hello, how can I help?",
          "ko": "안녕하세요, 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Chào chị. Tôi bị lỡ chuyến bay đi Đà Nẵng.",
        "gloss": {
          "en": "Hello. I've missed my flight to Đà Nẵng.",
          "ko": "안녕하세요. 다낭행 비행기를 놓쳤어요."
        },
        "frames": [
          "vi-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "Ôi, sao bạn đến muộn thế?",
        "gloss": {
          "en": "Oh no, why were you so late?",
          "ko": "어머, 왜 그렇게 늦으셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Trước khi ra sân bay, tôi đã gọi taxi, nhưng đường tắc quá.",
        "gloss": {
          "en": "Before heading to the airport, I called a taxi, but the traffic was terrible.",
          "ko": "공항 오기 전에 택시를 불렀는데, 길이 너무 막혔어요."
        },
        "frames": [
          "vi-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "Chuyến tiếp theo là bốn giờ chiều. Bạn có muốn đổi vé không?",
        "gloss": {
          "en": "The next flight is at four in the afternoon. Do you want to change your ticket?",
          "ko": "다음 편은 오후 네 시예요. 표 바꾸시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "Có. Đổi vé có đắt hơn mua vé mới không?",
        "gloss": {
          "en": "Yes. Is changing the ticket more expensive than buying a new one?",
          "ko": "네. 표를 바꾸는 게 새로 사는 것보다 비싸요?"
        },
        "frames": [
          "vi-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Không, đổi vé rẻ hơn. Bạn trả thêm năm trăm nghìn thôi.",
        "gloss": {
          "en": "No, changing is cheaper. You only pay five hundred thousand extra.",
          "ko": "아니요, 바꾸는 게 더 싸요. 오십만 동만 더 내시면 돼요."
        }
      },
      {
        "who": "me",
        "text": "Vâng. Cuối cùng cũng có vé. Cảm ơn chị.",
        "gloss": {
          "en": "OK. At last I have a ticket. Thank you.",
          "ko": "네. 결국 표를 구했네요. 고마워요."
        },
        "frames": [
          "vi-f3-12"
        ]
      }
    ]
  },
  {
    "id": "vi-3-b20",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Planning a birthday party with your flatmate",
      "ko": "룸메이트와 생일 파티 계획하기"
    },
    "expressions": [],
    "grammar": [
      2,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Thứ bảy là sinh nhật Hoa. Mình làm tiệc ở nhà nhé?",
        "gloss": {
          "en": "Saturday is Hoa's birthday. Shall we have a party at home?",
          "ko": "토요일이 호아 생일이야. 집에서 파티할까?"
        }
      },
      {
        "who": "me",
        "text": "Hay đấy. Trước khi mời mọi người, mình phải dọn nhà.",
        "gloss": {
          "en": "Good idea. Before inviting everyone, we need to clean the house.",
          "ko": "좋다. 사람들 초대하기 전에 집 청소부터 해야 해."
        },
        "frames": [
          "vi-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "Đúng rồi. Còn đồ ăn thì sao?",
        "gloss": {
          "en": "Right. What about food?",
          "ko": "맞아. 음식은 어떻게 하지?"
        }
      },
      {
        "who": "me",
        "text": "Nếu nấu ở nhà thì rẻ hơn, nhưng mệt lắm.",
        "gloss": {
          "en": "If we cook at home it's cheaper, but it's tiring.",
          "ko": "집에서 요리하면 더 싸지만 아주 힘들어."
        },
        "frames": [
          "vi-f3-07",
          "vi-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Thế gọi đồ ăn về nhé? Tùy bạn.",
        "gloss": {
          "en": "Then shall we order food in? Up to you.",
          "ko": "그럼 배달 시킬까? 네 마음대로 해."
        }
      },
      {
        "who": "me",
        "text": "Được. Sau khi ăn, mình cắt bánh sinh nhật.",
        "gloss": {
          "en": "OK. After eating, we'll cut the birthday cake.",
          "ko": "좋아. 밥 먹고 나서 생일 케이크 자르자."
        },
        "frames": [
          "vi-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "Ai đi mua bánh?",
        "gloss": {
          "en": "Who's buying the cake?",
          "ko": "케이크는 누가 사 와?"
        }
      },
      {
        "who": "me",
        "text": "Tôi sắp ra ngoài rồi, để tôi mua luôn.",
        "gloss": {
          "en": "I'm about to head out, so I'll buy it.",
          "ko": "나 곧 나가니까 내가 사 올게."
        },
        "frames": [
          "vi-f3-17"
        ]
      }
    ]
  }
];
