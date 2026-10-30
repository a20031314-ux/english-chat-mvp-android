import type { StageScript } from "../../stageScripts.ts";

/**
 * id 대본 은행(2026-10-30 사용자 "여러 개 만들어 두고 추천" → A: 지금 단계 이하에서) — 단계 조건·상황 목록과 따로, 오늘 할 것 끝의 대화 한 칸으로 추천(curriculum/scriptBank.ts).
 * 1~3단계 20개씩, 줄 8개, 내 줄에 그 단계 이하 틀 태그. Claude가 쓰고 scripts/script-bank.ts로 검사, 원어민 확인 전.
 */
export const ID_BANK: StageScript[] = [
  {
    "id": "id-1-b01",
    "stage": 1,
    "bank": true,
    "name": {
      "text": [
        "Ji-woo"
      ],
      "en": [
        "Ji-woo"
      ],
      "ko": [
        "지우"
      ]
    },
    "setting": {
      "en": "Checking in at a hotel reception",
      "ko": "호텔 프런트에서 체크인"
    },
    "expressions": [
      "selamat malam",
      "terima kasih",
      "nama saya"
    ],
    "grammar": [
      0,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat malam. Ada yang bisa dibantu?",
        "gloss": {
          "en": "Good evening. How can I help you?",
          "ko": "안녕하세요. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Selamat malam. Nama saya Ji-woo.",
        "gloss": {
          "en": "Good evening. My name is Ji-woo.",
          "ko": "안녕하세요. 제 이름은 지우예요."
        },
        "frames": [
          "id-f1-05",
          "id-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "Oh, Ji-woo. Dari Korea, ya?",
        "gloss": {
          "en": "Oh, Ji-woo. From Korea, right?",
          "ko": "아, 지우 님. 한국에서 오셨죠?"
        }
      },
      {
        "who": "me",
        "text": "Ya, saya dari Seoul.",
        "gloss": {
          "en": "Yes, I'm from Seoul.",
          "ko": "네, 서울에서 왔어요."
        },
        "frames": [
          "id-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "Ini kunci kamar Anda. Kamar dua ratus sepuluh.",
        "gloss": {
          "en": "Here's your room key. Room two hundred ten.",
          "ko": "여기 방 열쇠예요. 이백십 호예요."
        }
      },
      {
        "who": "me",
        "text": "Liftnya di mana?",
        "gloss": {
          "en": "Where's the lift?",
          "ko": "엘리베이터는 어디예요?"
        },
        "frames": [
          "id-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Di sebelah kiri.",
        "gloss": {
          "en": "On the left.",
          "ko": "왼쪽에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Terima kasih, Mbak.",
        "gloss": {
          "en": "Thank you.",
          "ko": "고마워요."
        },
        "frames": [
          "id-f1-06"
        ]
      }
    ]
  },
  {
    "id": "id-1-b02",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying fruit at a market stall",
      "ko": "시장 과일 노점에서"
    },
    "expressions": [
      "terima kasih"
    ],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Silakan, Kak. Mau buah apa?",
        "gloss": {
          "en": "Come on in. What fruit would you like?",
          "ko": "어서 오세요. 무슨 과일 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Ini buah apa?",
        "gloss": {
          "en": "What fruit is this?",
          "ko": "이건 무슨 과일이에요?"
        },
        "frames": [
          "id-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Itu salak. Manis sekali.",
        "gloss": {
          "en": "That's snake fruit. It's very sweet.",
          "ko": "그건 살락이에요. 아주 달아요."
        }
      },
      {
        "who": "me",
        "text": "Satu kilo berapa?",
        "gloss": {
          "en": "How much is one kilo?",
          "ko": "한 킬로에 얼마예요?"
        },
        "frames": [
          "id-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Dua puluh ribu sekilo.",
        "gloss": {
          "en": "Twenty thousand a kilo.",
          "ko": "한 킬로에 이만 루피아예요."
        }
      },
      {
        "who": "me",
        "text": "Saya mau dua kilo.",
        "gloss": {
          "en": "I'd like two kilos.",
          "ko": "두 킬로 주세요."
        },
        "frames": [
          "id-f1-20"
        ]
      },
      {
        "who": "them",
        "text": "Oke. Ini, Kak.",
        "gloss": {
          "en": "Okay. Here you go.",
          "ko": "네. 여기요."
        }
      },
      {
        "who": "me",
        "text": "Terima kasih, Bu.",
        "gloss": {
          "en": "Thank you, ma'am.",
          "ko": "고마워요."
        },
        "frames": [
          "id-f1-06"
        ]
      }
    ]
  },
  {
    "id": "id-1-b03",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Meeting a new coworker on the first day",
      "ko": "첫 출근 날 새 동료와 인사"
    },
    "expressions": [
      "terima kasih",
      "senang bertemu",
      "sampai jumpa"
    ],
    "grammar": [
      0,
      1,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Halo! Kamu orang baru, ya?",
        "gloss": {
          "en": "Hi! You're new, right?",
          "ko": "안녕하세요! 새로 오셨죠?"
        }
      },
      {
        "who": "me",
        "text": "Ya. Saya desainer.",
        "gloss": {
          "en": "Yes. I'm a designer.",
          "ko": "네. 저는 디자이너예요."
        },
        "frames": [
          "id-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "Oh, saya juga desainer!",
        "gloss": {
          "en": "Oh, I'm a designer too!",
          "ko": "아, 저도 디자이너예요!"
        }
      },
      {
        "who": "me",
        "text": "Wah! Nama kamu siapa?",
        "gloss": {
          "en": "Wow! What's your name?",
          "ko": "와! 이름이 뭐예요?"
        },
        "frames": [
          "id-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "Nama saya Rina. Senang bertemu.",
        "gloss": {
          "en": "My name is Rina. Nice to meet you.",
          "ko": "저는 리나예요. 반가워요."
        }
      },
      {
        "who": "me",
        "text": "Senang bertemu, Rina.",
        "gloss": {
          "en": "Nice to meet you, Rina.",
          "ko": "반가워요, 리나 씨."
        }
      },
      {
        "who": "them",
        "text": "Ini meja kamu.",
        "gloss": {
          "en": "This is your desk.",
          "ko": "여기가 자리예요."
        }
      },
      {
        "who": "me",
        "text": "Terima kasih. Sampai jumpa nanti.",
        "gloss": {
          "en": "Thank you. See you later.",
          "ko": "고마워요. 이따 봐요."
        },
        "frames": [
          "id-f1-06",
          "id-f1-18"
        ]
      }
    ]
  },
  {
    "id": "id-1-b04",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "A friend calls while you wait at a station",
      "ko": "역에서 기다리는데 친구가 전화함"
    },
    "expressions": [
      "terima kasih",
      "maaf",
      "sampai jumpa"
    ],
    "grammar": [
      4,
      5,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Halo? Kamu di mana?",
        "gloss": {
          "en": "Hello? Where are you?",
          "ko": "여보세요? 어디야?"
        }
      },
      {
        "who": "me",
        "text": "Saya di stasiun.",
        "gloss": {
          "en": "I'm at the station.",
          "ko": "나 역에 있어."
        },
        "frames": [
          "id-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "Stasiun apa?",
        "gloss": {
          "en": "Which station?",
          "ko": "무슨 역?"
        }
      },
      {
        "who": "me",
        "text": "Maaf, saya tidak tahu.",
        "gloss": {
          "en": "Sorry, I don't know.",
          "ko": "미안, 모르겠어."
        },
        "frames": [
          "id-f1-19",
          "id-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Ada nama di papan?",
        "gloss": {
          "en": "Is there a name on the sign?",
          "ko": "표지판에 이름 있어?"
        }
      },
      {
        "who": "me",
        "text": "Ada. Stasiun Sudirman.",
        "gloss": {
          "en": "Yes. Sudirman Station.",
          "ko": "있어. 수디르만역이야."
        }
      },
      {
        "who": "them",
        "text": "Oke, saya ke sana sekarang.",
        "gloss": {
          "en": "Okay, I'm coming there now.",
          "ko": "알았어, 지금 그리로 갈게."
        }
      },
      {
        "who": "me",
        "text": "Terima kasih. Sampai jumpa di sana.",
        "gloss": {
          "en": "Thanks. See you there.",
          "ko": "고마워. 거기서 봐."
        },
        "frames": [
          "id-f1-06",
          "id-f1-18"
        ]
      }
    ]
  },
  {
    "id": "id-1-b05",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying a T-shirt at a clothes shop",
      "ko": "옷 가게에서 티셔츠 사기"
    },
    "expressions": [
      "sama-sama",
      "saya mau ini"
    ],
    "grammar": [
      3,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat siang. Cari apa, Kak?",
        "gloss": {
          "en": "Good afternoon. What are you looking for?",
          "ko": "안녕하세요. 뭐 찾으세요?"
        }
      },
      {
        "who": "me",
        "text": "Ada kaus putih?",
        "gloss": {
          "en": "Do you have white T-shirts?",
          "ko": "흰 티셔츠 있어요?"
        },
        "frames": [
          "id-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Ada. Ini, Kak.",
        "gloss": {
          "en": "Yes. Here you are.",
          "ko": "있어요. 여기요."
        }
      },
      {
        "who": "me",
        "text": "Ini berapa?",
        "gloss": {
          "en": "How much is this?",
          "ko": "이거 얼마예요?"
        },
        "frames": [
          "id-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Delapan puluh ribu.",
        "gloss": {
          "en": "Eighty thousand.",
          "ko": "팔만 루피아예요."
        }
      },
      {
        "who": "me",
        "text": "Oke. Saya mau ini.",
        "gloss": {
          "en": "Okay. I'll take this.",
          "ko": "좋아요. 이걸로 할게요."
        },
        "frames": [
          "id-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Terima kasih, Kak.",
        "gloss": {
          "en": "Thank you.",
          "ko": "감사합니다."
        }
      },
      {
        "who": "me",
        "text": "Sama-sama.",
        "gloss": {
          "en": "You're welcome.",
          "ko": "천만에요."
        }
      }
    ]
  },
  {
    "id": "id-1-b06",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Arriving at a restaurant for dinner",
      "ko": "저녁에 식당에 도착해서"
    },
    "expressions": [
      "terima kasih",
      "maaf",
      "toiletnya di mana"
    ],
    "grammar": [
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat malam. Silakan duduk.",
        "gloss": {
          "en": "Good evening. Please have a seat.",
          "ko": "안녕하세요. 앉으세요."
        }
      },
      {
        "who": "me",
        "text": "Maaf, toiletnya di mana?",
        "gloss": {
          "en": "Excuse me, where's the toilet?",
          "ko": "실례지만 화장실이 어디예요?"
        },
        "frames": [
          "id-f1-19",
          "id-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Di belakang, sebelah kanan.",
        "gloss": {
          "en": "At the back, on the right.",
          "ko": "뒤쪽 오른편이에요."
        }
      },
      {
        "who": "me",
        "text": "Terima kasih, Mas.",
        "gloss": {
          "en": "Thank you.",
          "ko": "고마워요."
        },
        "frames": [
          "id-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Mau minum apa?",
        "gloss": {
          "en": "What would you like to drink?",
          "ko": "뭐 마실래요?"
        }
      },
      {
        "who": "me",
        "text": "Ada jus jeruk?",
        "gloss": {
          "en": "Do you have orange juice?",
          "ko": "오렌지 주스 있어요?"
        },
        "frames": [
          "id-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Maaf, tidak ada. Ada jus mangga.",
        "gloss": {
          "en": "Sorry, we don't. We have mango juice.",
          "ko": "죄송해요, 없어요. 망고 주스는 있어요."
        }
      },
      {
        "who": "me",
        "text": "Saya mau jus mangga.",
        "gloss": {
          "en": "I'll have mango juice.",
          "ko": "망고 주스로 할게요."
        },
        "frames": [
          "id-f1-10"
        ]
      }
    ]
  },
  {
    "id": "id-1-b07",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying a bus ticket at the terminal",
      "ko": "버스 터미널에서 표 사기"
    },
    "expressions": [
      "terima kasih",
      "maaf",
      "saya tidak mengerti",
      "pelan-pelan saja",
      "tolong"
    ],
    "grammar": [
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Mau ke mana, Kak?",
        "gloss": {
          "en": "Where are you going?",
          "ko": "어디 가세요?"
        }
      },
      {
        "who": "me",
        "text": "Ke Bandung. Tiketnya berapa?",
        "gloss": {
          "en": "To Bandung. How much is the ticket?",
          "ko": "반둥이요. 표가 얼마예요?"
        },
        "frames": [
          "id-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Seratus dua puluh ribu. Busnya berangkat jam sembilan lewat seperempat.",
        "gloss": {
          "en": "One hundred twenty thousand. The bus leaves at a quarter past nine.",
          "ko": "십이만 루피아예요. 버스는 아홉 시 십오 분에 출발해요."
        }
      },
      {
        "who": "me",
        "text": "Maaf, saya tidak mengerti. Tolong pelan-pelan saja.",
        "gloss": {
          "en": "Sorry, I don't understand. Please speak slowly.",
          "ko": "죄송해요, 못 알아들었어요. 천천히 말해 주세요."
        },
        "frames": [
          "id-f1-19",
          "id-f1-13",
          "id-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Seratus... dua puluh... ribu. Jam... sembilan.",
        "gloss": {
          "en": "One hundred... twenty... thousand. At... nine.",
          "ko": "십이만... 루피아요. 아홉... 시요."
        }
      },
      {
        "who": "me",
        "text": "Oke. Saya mau satu tiket.",
        "gloss": {
          "en": "Okay. I'd like one ticket.",
          "ko": "네. 표 한 장 주세요."
        },
        "frames": [
          "id-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Ini tiketnya. Bus nomor lima, ya.",
        "gloss": {
          "en": "Here's the ticket. Bus number five.",
          "ko": "표 여기 있어요. 오 번 버스예요."
        }
      },
      {
        "who": "me",
        "text": "Terima kasih banyak, Pak.",
        "gloss": {
          "en": "Thank you very much.",
          "ko": "정말 고마워요."
        },
        "frames": [
          "id-f1-06"
        ]
      }
    ]
  },
  {
    "id": "id-1-b08",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At airport baggage claim",
      "ko": "공항 수하물 찾는 곳에서"
    },
    "expressions": [
      "terima kasih",
      "maaf"
    ],
    "grammar": [
      2,
      3,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Permisi, Kak. Ini tas Anda?",
        "gloss": {
          "en": "Excuse me. Is this your bag?",
          "ko": "실례합니다. 이거 손님 가방이에요?"
        }
      },
      {
        "who": "me",
        "text": "Bukan. Ini tas saya.",
        "gloss": {
          "en": "No. This one is my bag.",
          "ko": "아니요. 이게 제 가방이에요."
        },
        "frames": [
          "id-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "Oh, maaf. Tas biru itu tas siapa, ya?",
        "gloss": {
          "en": "Oh, sorry. Whose is that blue bag, then?",
          "ko": "아, 죄송해요. 그럼 저 파란 가방은 누구 거죠?"
        }
      },
      {
        "who": "me",
        "text": "Maaf, saya tidak tahu.",
        "gloss": {
          "en": "Sorry, I don't know.",
          "ko": "죄송해요, 모르겠어요."
        },
        "frames": [
          "id-f1-19",
          "id-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Oke. Kakak mau ke mana?",
        "gloss": {
          "en": "Okay. Where are you heading?",
          "ko": "네. 어디 가세요?"
        }
      },
      {
        "who": "me",
        "text": "Saya mau ke hotel. Taksi di mana?",
        "gloss": {
          "en": "I want to go to my hotel. Where are the taxis?",
          "ko": "호텔에 가려고요. 택시는 어디 있어요?"
        },
        "frames": [
          "id-f1-10",
          "id-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Di pintu tiga.",
        "gloss": {
          "en": "At door three.",
          "ko": "삼 번 출구에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Oke, terima kasih.",
        "gloss": {
          "en": "Okay, thank you.",
          "ko": "네, 고마워요."
        },
        "frames": [
          "id-f1-06"
        ]
      }
    ]
  },
  {
    "id": "id-1-b09",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Someone mistakes you for a Japanese tourist",
      "ko": "관광지에서 일본인으로 오해받음"
    },
    "expressions": [
      "terima kasih",
      "sampai jumpa"
    ],
    "grammar": [
      0,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Konnichiwa! Dari Jepang, ya?",
        "gloss": {
          "en": "Konnichiwa! From Japan, right?",
          "ko": "곤니치와! 일본에서 오셨죠?"
        }
      },
      {
        "who": "me",
        "text": "Bukan, saya bukan orang Jepang.",
        "gloss": {
          "en": "No, I'm not Japanese.",
          "ko": "아니요, 저는 일본 사람이 아니에요."
        },
        "frames": [
          "id-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "Oh, maaf! Dari mana?",
        "gloss": {
          "en": "Oh, sorry! Where are you from?",
          "ko": "아, 죄송해요! 어디서 오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Saya dari Korea.",
        "gloss": {
          "en": "I'm from Korea.",
          "ko": "한국에서 왔어요."
        },
        "frames": [
          "id-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "Wah, Korea! Liburan di sini?",
        "gloss": {
          "en": "Wow, Korea! On holiday here?",
          "ko": "와, 한국! 여기 휴가 오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Tidak. Saya guru di sekolah internasional.",
        "gloss": {
          "en": "No. I'm a teacher at an international school.",
          "ko": "아니요. 저는 국제학교 선생님이에요."
        },
        "frames": [
          "id-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "Oh, keren! Selamat bekerja, ya.",
        "gloss": {
          "en": "Oh, cool! Enjoy your work.",
          "ko": "오, 멋지네요! 일 잘하세요."
        }
      },
      {
        "who": "me",
        "text": "Terima kasih. Sampai jumpa!",
        "gloss": {
          "en": "Thank you. See you!",
          "ko": "고마워요. 또 봬요!"
        },
        "frames": [
          "id-f1-06",
          "id-f1-18"
        ]
      }
    ]
  },
  {
    "id": "id-1-b10",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Meeting a new neighbour in the morning",
      "ko": "아침에 새 이웃과 인사"
    },
    "expressions": [
      "selamat pagi",
      "sampai jumpa"
    ],
    "grammar": [
      0,
      2,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat pagi! Tetangga baru, ya?",
        "gloss": {
          "en": "Good morning! You're the new neighbour?",
          "ko": "좋은 아침이에요! 새로 이사 오셨죠?"
        }
      },
      {
        "who": "me",
        "text": "Selamat pagi, Pak. Ya, ini rumah saya.",
        "gloss": {
          "en": "Good morning. Yes, this is my house.",
          "ko": "안녕하세요. 네, 여기가 저희 집이에요."
        },
        "frames": [
          "id-f1-05",
          "id-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "Selamat datang! Kerja di mana?",
        "gloss": {
          "en": "Welcome! Where do you work?",
          "ko": "환영해요! 어디서 일하세요?"
        }
      },
      {
        "who": "me",
        "text": "Saya kerja di rumah sakit.",
        "gloss": {
          "en": "I work at a hospital.",
          "ko": "병원에서 일해요."
        },
        "frames": [
          "id-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "Oh, dokter?",
        "gloss": {
          "en": "Oh, are you a doctor?",
          "ko": "아, 의사세요?"
        }
      },
      {
        "who": "me",
        "text": "Bukan. Saya bukan dokter. Saya apoteker.",
        "gloss": {
          "en": "No. I'm not a doctor. I'm a pharmacist.",
          "ko": "아니요. 의사는 아니에요. 약사예요."
        },
        "frames": [
          "id-f1-12",
          "id-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "Wah, bagus. Sampai jumpa, ya!",
        "gloss": {
          "en": "Oh, nice. See you around!",
          "ko": "오, 좋네요. 또 봬요!"
        }
      },
      {
        "who": "me",
        "text": "Sampai jumpa besok, Pak!",
        "gloss": {
          "en": "See you tomorrow!",
          "ko": "내일 봬요!"
        },
        "frames": [
          "id-f1-18"
        ]
      }
    ]
  },
  {
    "id": "id-1-b11",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Ordering at a coffee shop",
      "ko": "카페에서 주문하기"
    },
    "expressions": [
      "selamat pagi",
      "sama-sama",
      "sampai jumpa"
    ],
    "grammar": [
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat pagi! Mau pesan apa?",
        "gloss": {
          "en": "Good morning! What would you like?",
          "ko": "좋은 아침이에요! 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Selamat pagi. Ada kopi susu?",
        "gloss": {
          "en": "Good morning. Do you have coffee with milk?",
          "ko": "안녕하세요. 밀크커피 있어요?"
        },
        "frames": [
          "id-f1-05",
          "id-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Ada. Panas atau dingin?",
        "gloss": {
          "en": "Yes. Hot or iced?",
          "ko": "있어요. 뜨거운 걸로요, 차가운 걸로요?"
        }
      },
      {
        "who": "me",
        "text": "Dingin. Kopi susu dingin berapa?",
        "gloss": {
          "en": "Iced. How much is an iced coffee with milk?",
          "ko": "차가운 걸로요. 아이스 밀크커피는 얼마예요?"
        },
        "frames": [
          "id-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Dua puluh lima ribu.",
        "gloss": {
          "en": "Twenty-five thousand.",
          "ko": "이만 오천 루피아예요."
        }
      },
      {
        "who": "me",
        "text": "Oke. Saya mau dua.",
        "gloss": {
          "en": "Okay. I'll take two.",
          "ko": "좋아요. 두 잔 주세요."
        },
        "frames": [
          "id-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Ini, Kak. Terima kasih!",
        "gloss": {
          "en": "Here you go. Thank you!",
          "ko": "여기요. 감사합니다!"
        }
      },
      {
        "who": "me",
        "text": "Sama-sama. Sampai jumpa!",
        "gloss": {
          "en": "You're welcome. See you!",
          "ko": "천만에요. 또 올게요!"
        },
        "frames": [
          "id-f1-18"
        ]
      }
    ]
  },
  {
    "id": "id-1-b12",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a dental clinic reception",
      "ko": "치과 접수처에서"
    },
    "expressions": [
      "selamat siang",
      "terima kasih",
      "maaf"
    ],
    "grammar": [
      4,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat siang. Ada yang bisa dibantu?",
        "gloss": {
          "en": "Good afternoon. How can I help you?",
          "ko": "안녕하세요. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Selamat siang. Saya mau ke dokter gigi.",
        "gloss": {
          "en": "Good afternoon. I'd like to see the dentist.",
          "ko": "안녕하세요. 치과 진료 받고 싶어요."
        },
        "frames": [
          "id-f1-05",
          "id-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Baik. Ada janji?",
        "gloss": {
          "en": "Sure. Do you have an appointment?",
          "ko": "네. 예약하셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Tidak ada.",
        "gloss": {
          "en": "No, I don't.",
          "ko": "아니요, 안 했어요."
        }
      },
      {
        "who": "them",
        "text": "Tidak apa-apa. Dokter Sari ada sekarang.",
        "gloss": {
          "en": "That's okay. Doctor Sari is in now.",
          "ko": "괜찮아요. 지금 사리 선생님 계세요."
        }
      },
      {
        "who": "me",
        "text": "Maaf, nama dokternya siapa?",
        "gloss": {
          "en": "Sorry, what's the doctor's name?",
          "ko": "죄송한데, 선생님 성함이 뭐라고요?"
        },
        "frames": [
          "id-f1-19",
          "id-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "Dokter Sari. Silakan tunggu di sini.",
        "gloss": {
          "en": "Doctor Sari. Please wait here.",
          "ko": "사리 선생님이요. 여기서 기다리세요."
        }
      },
      {
        "who": "me",
        "text": "Oke. Terima kasih, Mbak.",
        "gloss": {
          "en": "Okay. Thank you.",
          "ko": "네. 고마워요."
        },
        "frames": [
          "id-f1-06"
        ]
      }
    ]
  },
  {
    "id": "id-1-b13",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Visiting a friend's home",
      "ko": "친구 집에 놀러 감"
    },
    "expressions": [
      "terima kasih",
      "maaf"
    ],
    "grammar": [
      3,
      4,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ayo masuk! Ini tehnya.",
        "gloss": {
          "en": "Come on in! Here's some tea.",
          "ko": "들어와! 차 여기 있어."
        }
      },
      {
        "who": "me",
        "text": "Terima kasih. Ini teh apa?",
        "gloss": {
          "en": "Thank you. What tea is this?",
          "ko": "고마워. 이거 무슨 차야?"
        },
        "frames": [
          "id-f1-06",
          "id-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Teh melati. Enak!",
        "gloss": {
          "en": "Jasmine tea. It's good!",
          "ko": "재스민차야. 맛있어!"
        }
      },
      {
        "who": "me",
        "text": "Wah, enak. Ini kue apa?",
        "gloss": {
          "en": "Wow, it's good. What cake is this?",
          "ko": "와, 맛있다. 이건 무슨 케이크야?"
        },
        "frames": [
          "id-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Kue lapis. Coba saja.",
        "gloss": {
          "en": "Layer cake. Go ahead, try it.",
          "ko": "라피스 케이크야. 먹어 봐."
        }
      },
      {
        "who": "me",
        "text": "Maaf, saya tidak suka manis.",
        "gloss": {
          "en": "Sorry, I don't like sweet things.",
          "ko": "미안, 나 단 거 안 좋아해."
        },
        "frames": [
          "id-f1-19",
          "id-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Tidak apa-apa. Ada kacang juga.",
        "gloss": {
          "en": "That's okay. There are peanuts too.",
          "ko": "괜찮아. 땅콩도 있어."
        }
      },
      {
        "who": "me",
        "text": "Oke, saya mau kacang.",
        "gloss": {
          "en": "Okay, I'll have some peanuts.",
          "ko": "좋아, 땅콩 먹을게."
        },
        "frames": [
          "id-f1-10"
        ]
      }
    ]
  },
  {
    "id": "id-1-b14",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "A courier calls about your delivery",
      "ko": "택배 기사가 배달 전화를 함"
    },
    "expressions": [
      "terima kasih",
      "tolong"
    ],
    "grammar": [
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Halo, Kak. Saya kurir. Kakak di mana?",
        "gloss": {
          "en": "Hello. I'm the courier. Where are you?",
          "ko": "안녕하세요. 택배예요. 어디 계세요?"
        }
      },
      {
        "who": "me",
        "text": "Saya di kantor, lantai lima.",
        "gloss": {
          "en": "I'm at the office, on the fifth floor.",
          "ko": "사무실 오 층에 있어요."
        },
        "frames": [
          "id-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "Kantornya di mana, Kak?",
        "gloss": {
          "en": "Where's the office?",
          "ko": "사무실이 어디예요?"
        }
      },
      {
        "who": "me",
        "text": "Di Jalan Melati, sebelah bank.",
        "gloss": {
          "en": "On Melati Street, next to the bank.",
          "ko": "멜라티 거리, 은행 옆이에요."
        }
      },
      {
        "who": "them",
        "text": "Oke. Saya di depan sekarang.",
        "gloss": {
          "en": "Okay. I'm out front now.",
          "ko": "네. 지금 앞에 와 있어요."
        }
      },
      {
        "who": "me",
        "text": "Tolong tunggu di lobi, ya.",
        "gloss": {
          "en": "Please wait in the lobby.",
          "ko": "로비에서 기다려 주세요."
        },
        "frames": [
          "id-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Siap, Kak.",
        "gloss": {
          "en": "Sure.",
          "ko": "알겠어요."
        }
      },
      {
        "who": "me",
        "text": "Terima kasih, Mas. Saya turun sekarang.",
        "gloss": {
          "en": "Thank you. I'm coming down now.",
          "ko": "고마워요. 지금 내려갈게요."
        },
        "frames": [
          "id-f1-06"
        ]
      }
    ]
  },
  {
    "id": "id-1-b15",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Asking a stranger to take your photo at a temple",
      "ko": "사원에서 사진 부탁하기"
    },
    "expressions": [
      "terima kasih",
      "maaf",
      "tolong"
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
        "text": "Halo! Kakak turis, ya?",
        "gloss": {
          "en": "Hi! Are you a tourist?",
          "ko": "안녕하세요! 관광객이세요?"
        }
      },
      {
        "who": "me",
        "text": "Ya. Maaf, ini candi apa?",
        "gloss": {
          "en": "Yes. Sorry, what temple is this?",
          "ko": "네. 실례지만 이건 무슨 사원이에요?"
        },
        "frames": [
          "id-f1-19",
          "id-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Ini Candi Prambanan. Bagus, kan?",
        "gloss": {
          "en": "This is Prambanan Temple. Beautiful, isn't it?",
          "ko": "프람바난 사원이에요. 멋지죠?"
        }
      },
      {
        "who": "me",
        "text": "Bagus sekali! Tolong fotokan saya, ya.",
        "gloss": {
          "en": "Really beautiful! Please take a photo of me.",
          "ko": "정말 멋져요! 사진 좀 찍어 주세요."
        },
        "frames": [
          "id-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Boleh. Di sini?",
        "gloss": {
          "en": "Sure. Here?",
          "ko": "그럼요. 여기서요?"
        }
      },
      {
        "who": "me",
        "text": "Ya, di sini. Terima kasih, Kak!",
        "gloss": {
          "en": "Yes, here. Thank you!",
          "ko": "네, 여기서요. 고마워요!"
        },
        "frames": [
          "id-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Sama-sama. Kakak dari mana?",
        "gloss": {
          "en": "You're welcome. Where are you from?",
          "ko": "천만에요. 어디서 오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Saya dari Australia.",
        "gloss": {
          "en": "I'm from Australia.",
          "ko": "호주에서 왔어요."
        },
        "frames": [
          "id-f1-02"
        ]
      }
    ]
  },
  {
    "id": "id-1-b16",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Small talk about the weather at a bus stop",
      "ko": "버스 정류장에서 날씨 이야기"
    },
    "expressions": [
      "terima kasih"
    ],
    "grammar": [
      3,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat sore. Panas sekali hari ini, ya!",
        "gloss": {
          "en": "Good afternoon. It's so hot today!",
          "ko": "안녕하세요. 오늘 정말 덥네요!"
        }
      },
      {
        "who": "me",
        "text": "Selamat sore. Ya, panas sekali.",
        "gloss": {
          "en": "Good afternoon. Yes, very hot.",
          "ko": "안녕하세요. 네, 정말 더워요."
        },
        "frames": [
          "id-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "Tapi nanti malam hujan, lho.",
        "gloss": {
          "en": "But it's going to rain tonight, you know.",
          "ko": "그런데 오늘 밤에 비 온대요."
        }
      },
      {
        "who": "me",
        "text": "Oh, saya tidak bawa payung.",
        "gloss": {
          "en": "Oh, I didn't bring an umbrella.",
          "ko": "아, 저 우산 안 가져왔어요."
        },
        "frames": [
          "id-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Di toko itu ada payung.",
        "gloss": {
          "en": "That shop has umbrellas.",
          "ko": "저 가게에 우산 있어요."
        }
      },
      {
        "who": "me",
        "text": "Oh ya? Payungnya berapa?",
        "gloss": {
          "en": "Really? How much are the umbrellas?",
          "ko": "그래요? 우산은 얼마예요?"
        },
        "frames": [
          "id-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Mungkin tiga puluh ribu.",
        "gloss": {
          "en": "Maybe thirty thousand.",
          "ko": "아마 삼만 루피아쯤이요."
        }
      },
      {
        "who": "me",
        "text": "Oke. Terima kasih, Pak!",
        "gloss": {
          "en": "Okay. Thank you!",
          "ko": "네. 고마워요!"
        },
        "frames": [
          "id-f1-06"
        ]
      }
    ]
  },
  {
    "id": "id-1-b17",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "First day at university",
      "ko": "대학교 첫날"
    },
    "expressions": [
      "terima kasih"
    ],
    "grammar": [
      0,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hai! Kamu mahasiswa baru?",
        "gloss": {
          "en": "Hi! Are you a new student?",
          "ko": "안녕! 너 신입생이야?"
        }
      },
      {
        "who": "me",
        "text": "Ya, saya mahasiswa baru.",
        "gloss": {
          "en": "Yes, I'm a new student.",
          "ko": "응, 나 신입생이야."
        },
        "frames": [
          "id-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "Saya juga! Kelas bahasa, kan?",
        "gloss": {
          "en": "Me too! The language class, right?",
          "ko": "나도! 언어 수업 맞지?"
        }
      },
      {
        "who": "me",
        "text": "Ya. Kelasnya di mana?",
        "gloss": {
          "en": "Yes. Where's the classroom?",
          "ko": "응. 강의실이 어디야?"
        },
        "frames": [
          "id-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Di lantai tiga. Saya juga ke sana.",
        "gloss": {
          "en": "On the third floor. I'm going there too.",
          "ko": "삼 층이야. 나도 거기 가."
        }
      },
      {
        "who": "me",
        "text": "Oke. Nama dosennya siapa?",
        "gloss": {
          "en": "Okay. What's the lecturer's name?",
          "ko": "좋아. 교수님 성함이 뭐야?"
        },
        "frames": [
          "id-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "Pak Hadi. Dia baik sekali.",
        "gloss": {
          "en": "Mr Hadi. He's really nice.",
          "ko": "하디 교수님이야. 엄청 친절하셔."
        }
      },
      {
        "who": "me",
        "text": "Bagus. Terima kasih, ya!",
        "gloss": {
          "en": "Great. Thanks!",
          "ko": "잘됐다. 고마워!"
        },
        "frames": [
          "id-f1-06"
        ]
      }
    ]
  },
  {
    "id": "id-1-b18",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying cold medicine at a pharmacy",
      "ko": "약국에서 감기약 사기"
    },
    "expressions": [
      "selamat malam",
      "terima kasih",
      "maaf"
    ],
    "grammar": [
      3,
      4,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat malam. Cari apa?",
        "gloss": {
          "en": "Good evening. What are you looking for?",
          "ko": "안녕하세요. 뭐 찾으세요?"
        }
      },
      {
        "who": "me",
        "text": "Selamat malam. Ada obat flu?",
        "gloss": {
          "en": "Good evening. Do you have flu medicine?",
          "ko": "안녕하세요. 감기약 있어요?"
        },
        "frames": [
          "id-f1-05",
          "id-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Ada. Ini, Kak.",
        "gloss": {
          "en": "Yes. Here you are.",
          "ko": "있어요. 여기요."
        }
      },
      {
        "who": "me",
        "text": "Ini berapa?",
        "gloss": {
          "en": "How much is this?",
          "ko": "이거 얼마예요?"
        },
        "frames": [
          "id-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Lima belas ribu.",
        "gloss": {
          "en": "Fifteen thousand.",
          "ko": "만 오천 루피아예요."
        }
      },
      {
        "who": "me",
        "text": "Maaf, saya tidak punya uang kecil.",
        "gloss": {
          "en": "Sorry, I don't have small change.",
          "ko": "죄송해요, 잔돈이 없어요."
        },
        "frames": [
          "id-f1-19",
          "id-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Tidak apa-apa. Ini kembaliannya.",
        "gloss": {
          "en": "That's okay. Here's your change.",
          "ko": "괜찮아요. 거스름돈 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "Terima kasih, Bu.",
        "gloss": {
          "en": "Thank you, ma'am.",
          "ko": "고마워요."
        },
        "frames": [
          "id-f1-06"
        ]
      }
    ]
  },
  {
    "id": "id-1-b19",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying tomatoes at a vegetable stall",
      "ko": "채소 가게에서 토마토 사기"
    },
    "expressions": [
      "terima kasih",
      "sampai jumpa"
    ],
    "grammar": [
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Mau apa, Kak? Tomatnya segar!",
        "gloss": {
          "en": "What would you like? The tomatoes are fresh!",
          "ko": "뭐 드릴까요? 토마토 싱싱해요!"
        }
      },
      {
        "who": "me",
        "text": "Tomat sekilo berapa?",
        "gloss": {
          "en": "How much is a kilo of tomatoes?",
          "ko": "토마토 한 킬로에 얼마예요?"
        },
        "frames": [
          "id-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Dua belas ribu.",
        "gloss": {
          "en": "Twelve thousand.",
          "ko": "만 이천 루피아예요."
        }
      },
      {
        "who": "me",
        "text": "Saya mau dua kilo.",
        "gloss": {
          "en": "I'd like two kilos.",
          "ko": "두 킬로 주세요."
        },
        "frames": [
          "id-f1-20"
        ]
      },
      {
        "who": "them",
        "text": "Cabai juga?",
        "gloss": {
          "en": "Chillies too?",
          "ko": "고추도 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Tidak, terima kasih. Saya tidak suka pedas.",
        "gloss": {
          "en": "No, thank you. I don't like spicy food.",
          "ko": "아니요, 괜찮아요. 매운 거 안 좋아해요."
        },
        "frames": [
          "id-f1-13",
          "id-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Oke. Semuanya dua puluh empat ribu.",
        "gloss": {
          "en": "Okay. That's twenty-four thousand altogether.",
          "ko": "네. 전부 이만 사천 루피아예요."
        }
      },
      {
        "who": "me",
        "text": "Ini uangnya. Sampai jumpa, Bu!",
        "gloss": {
          "en": "Here's the money. See you!",
          "ko": "여기 돈이요. 또 올게요!"
        },
        "frames": [
          "id-f1-18"
        ]
      }
    ]
  },
  {
    "id": "id-1-b20",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "A waiter finds your phone at a café",
      "ko": "카페 직원이 두고 간 휴대폰을 찾아 줌"
    },
    "expressions": [
      "selamat malam",
      "terima kasih",
      "maaf"
    ],
    "grammar": [
      2,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Kak, ini HP siapa?",
        "gloss": {
          "en": "Excuse me, whose phone is this?",
          "ko": "저기요, 이거 누구 휴대폰이에요?"
        }
      },
      {
        "who": "me",
        "text": "Oh! Ini HP saya.",
        "gloss": {
          "en": "Oh! This is my phone.",
          "ko": "아! 이거 제 휴대폰이에요."
        },
        "frames": [
          "id-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "Tadi di meja nomor empat.",
        "gloss": {
          "en": "It was on table four.",
          "ko": "아까 사 번 테이블에 있었어요."
        }
      },
      {
        "who": "me",
        "text": "Terima kasih banyak, Mas!",
        "gloss": {
          "en": "Thank you so much!",
          "ko": "정말 고마워요!"
        },
        "frames": [
          "id-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Sama-sama. Hati-hati, ya.",
        "gloss": {
          "en": "You're welcome. Take care.",
          "ko": "천만에요. 조심하세요."
        }
      },
      {
        "who": "me",
        "text": "Maaf, ATM di mana?",
        "gloss": {
          "en": "Sorry, where's an ATM?",
          "ko": "죄송한데, 현금인출기는 어디 있어요?"
        },
        "frames": [
          "id-f1-19",
          "id-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Di sebelah kafe ini.",
        "gloss": {
          "en": "Next to this café.",
          "ko": "이 카페 옆에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Oke. Selamat malam!",
        "gloss": {
          "en": "Okay. Good night!",
          "ko": "네. 안녕히 계세요!"
        },
        "frames": [
          "id-f1-05"
        ]
      }
    ]
  },
  {
    "id": "id-2-b01",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Texting a friend in the evening",
      "ko": "저녁에 친구와 메시지"
    },
    "expressions": [
      "belum",
      "ayo",
      "boleh",
      "nanti",
      "besok"
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
        "text": "Hai! Lagi apa?",
        "gloss": {
          "en": "Hi! What are you up to?",
          "ko": "안녕! 뭐 해?"
        }
      },
      {
        "who": "me",
        "text": "Aku lagi nonton film di rumah.",
        "gloss": {
          "en": "I'm watching a film at home.",
          "ko": "집에서 영화 보는 중이야."
        },
        "frames": [
          "id-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Seru? Kamu udah makan malam?",
        "gloss": {
          "en": "Is it good? Have you had dinner?",
          "ko": "재밌어? 저녁은 먹었어?"
        }
      },
      {
        "who": "me",
        "text": "Belum. Nanti aja, habis filmnya.",
        "gloss": {
          "en": "Not yet. Later, after the film.",
          "ko": "아직. 영화 끝나고 이따 먹을래."
        }
      },
      {
        "who": "them",
        "text": "Oke. Besok kamu ada acara?",
        "gloss": {
          "en": "Okay. Do you have plans tomorrow?",
          "ko": "그래. 내일 무슨 일정 있어?"
        }
      },
      {
        "who": "me",
        "text": "Besok aku mau ke pasar pagi.",
        "gloss": {
          "en": "Tomorrow I'm going to the morning market.",
          "ko": "내일은 아침 시장에 갈 거야."
        },
        "frames": [
          "id-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Oh, aku ikut, ya?",
        "gloss": {
          "en": "Oh, can I come along?",
          "ko": "오, 나도 같이 가도 돼?"
        }
      },
      {
        "who": "me",
        "text": "Boleh! Ayo berangkat jam tujuh!",
        "gloss": {
          "en": "Sure! Let's leave at seven!",
          "ko": "좋아! 일곱 시에 출발하자!"
        },
        "frames": [
          "id-f2-06"
        ]
      }
    ]
  },
  {
    "id": "id-2-b02",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Ordering chicken noodles at a restaurant",
      "ko": "식당에서 미 아얌 주문하기"
    },
    "expressions": [
      "belum",
      "boleh",
      "nggak pedas ya",
      "makan di sini"
    ],
    "grammar": [
      0,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat siang. Mau pesan apa, Kak?",
        "gloss": {
          "en": "Good afternoon. What would you like to order?",
          "ko": "안녕하세요. 뭐 주문하시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "Saya pesan mi ayam satu, nggak pedas ya.",
        "gloss": {
          "en": "I'll have one chicken noodles, not spicy, please.",
          "ko": "미 아얌 하나요, 안 맵게 해 주세요."
        },
        "frames": [
          "id-f2-13",
          "id-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Baik. Minumnya?",
        "gloss": {
          "en": "Sure. And to drink?",
          "ko": "네. 음료는요?"
        }
      },
      {
        "who": "me",
        "text": "Es jeruk satu. Boleh saya duduk di dekat jendela?",
        "gloss": {
          "en": "One iced orange. May I sit by the window?",
          "ko": "아이스 오렌지 하나요. 창가에 앉아도 돼요?"
        },
        "frames": [
          "id-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Boleh, silakan. Makan di sini atau bungkus?",
        "gloss": {
          "en": "Sure, go ahead. Eat in or takeaway?",
          "ko": "그럼요, 앉으세요. 드시고 가세요, 포장이에요?"
        }
      },
      {
        "who": "me",
        "text": "Makan di sini. Saya belum makan dari pagi.",
        "gloss": {
          "en": "Eating here. I haven't eaten since the morning.",
          "ko": "먹고 갈게요. 아침부터 아무것도 안 먹었어요."
        },
        "frames": [
          "id-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Oke. Tunggu sebentar, ya.",
        "gloss": {
          "en": "Okay. Just a moment.",
          "ko": "네. 잠깐만 기다리세요."
        }
      },
      {
        "who": "me",
        "text": "Oke, terima kasih, Mbak.",
        "gloss": {
          "en": "Okay, thank you.",
          "ko": "네, 고마워요."
        }
      }
    ]
  },
  {
    "id": "id-2-b03",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Riding a ride-hailing car to the airport",
      "ko": "차량 호출 택시로 공항 가기"
    },
    "expressions": [
      "belum",
      "minta tolong"
    ],
    "grammar": [
      0,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat pagi, Kak. Ke bandara, ya?",
        "gloss": {
          "en": "Good morning. To the airport, right?",
          "ko": "안녕하세요. 공항 가시죠?"
        }
      },
      {
        "who": "me",
        "text": "Iya, Pak. Minta tolong agak cepat, ya. Saya buru-buru.",
        "gloss": {
          "en": "Yes. Could you go a bit faster, please? I'm in a hurry.",
          "ko": "네. 조금 빨리 가 주세요. 좀 급해요."
        },
        "frames": [
          "id-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Siap. Pesawatnya jam berapa?",
        "gloss": {
          "en": "Sure. What time is your flight?",
          "ko": "알겠어요. 비행기가 몇 시예요?"
        }
      },
      {
        "who": "me",
        "text": "Jam sepuluh. Saya belum check-in.",
        "gloss": {
          "en": "At ten. I haven't checked in yet.",
          "ko": "열 시요. 아직 체크인을 안 했어요."
        },
        "frames": [
          "id-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Tenang, kita sampai jam delapan.",
        "gloss": {
          "en": "Don't worry, we'll get there by eight.",
          "ko": "걱정 마세요, 여덟 시에 도착해요."
        }
      },
      {
        "who": "me",
        "text": "Wah, syukurlah. Terima kasih, Pak.",
        "gloss": {
          "en": "Oh, what a relief. Thank you.",
          "ko": "와, 다행이에요. 고마워요."
        }
      },
      {
        "who": "them",
        "text": "Terminal tiga, kan, Kak? Berhenti di mana?",
        "gloss": {
          "en": "Terminal three, right? Where should I stop?",
          "ko": "삼 터미널 맞죠? 어디에 세울까요?"
        }
      },
      {
        "who": "me",
        "text": "Berhenti di sini, Pak.",
        "gloss": {
          "en": "Stop here, please.",
          "ko": "여기 세워 주세요."
        },
        "frames": [
          "id-f2-15"
        ]
      }
    ]
  },
  {
    "id": "id-2-b04",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "At the doctor with a stomach ache",
      "ko": "배가 아파서 병원에 감"
    },
    "expressions": [
      "boleh"
    ],
    "grammar": [
      0,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat pagi. Sakit apa?",
        "gloss": {
          "en": "Good morning. What's wrong?",
          "ko": "안녕하세요. 어디가 아프세요?"
        }
      },
      {
        "who": "me",
        "text": "Selamat pagi, Dok. Saya sakit perut.",
        "gloss": {
          "en": "Good morning, doctor. I have a stomach ache.",
          "ko": "안녕하세요, 선생님. 배가 아파요."
        },
        "frames": [
          "id-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "Sejak kapan?",
        "gloss": {
          "en": "Since when?",
          "ko": "언제부터요?"
        }
      },
      {
        "who": "me",
        "text": "Saya mual sejak tadi malam.",
        "gloss": {
          "en": "I've felt sick since last night.",
          "ko": "어젯밤부터 속이 메스꺼워요."
        },
        "frames": [
          "id-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "Kemarin makan apa?",
        "gloss": {
          "en": "What did you eat yesterday?",
          "ko": "어제 뭐 드셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Sate di pinggir jalan. Mungkin karena itu.",
        "gloss": {
          "en": "Satay from a street stall. Maybe it's because of that.",
          "ko": "길거리 사테요. 아마 그것 때문인 것 같아요."
        },
        "frames": [
          "id-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Oke, ini obatnya. Jangan makan pedas dulu, ya.",
        "gloss": {
          "en": "Okay, here's the medicine. No spicy food for now.",
          "ko": "네, 약 여기 있어요. 당분간 매운 건 드시지 마세요."
        }
      },
      {
        "who": "me",
        "text": "Baik, Dok. Boleh saya minum kopi?",
        "gloss": {
          "en": "All right, doctor. May I drink coffee?",
          "ko": "알겠어요, 선생님. 커피는 마셔도 돼요?"
        },
        "frames": [
          "id-f2-07"
        ]
      }
    ]
  },
  {
    "id": "id-2-b05",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Borrowing a book at the library",
      "ko": "도서관에서 책 빌리기"
    },
    "expressions": [
      "belum",
      "boleh"
    ],
    "grammar": [
      0,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat siang. Ada yang bisa dibantu?",
        "gloss": {
          "en": "Good afternoon. Can I help you?",
          "ko": "안녕하세요. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Siang, Mbak. Saya ingin pinjam buku ini.",
        "gloss": {
          "en": "Good afternoon. I'd like to borrow this book.",
          "ko": "안녕하세요. 이 책을 빌리고 싶어요."
        },
        "frames": [
          "id-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Boleh. Sudah punya kartu anggota?",
        "gloss": {
          "en": "Sure. Do you have a membership card?",
          "ko": "네. 회원 카드 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Belum. Saya baru pertama kali ke sini.",
        "gloss": {
          "en": "Not yet. This is my first time here.",
          "ko": "아직 없어요. 여기 처음 왔어요."
        }
      },
      {
        "who": "them",
        "text": "Isi formulir ini dulu, ya.",
        "gloss": {
          "en": "Please fill in this form first.",
          "ko": "먼저 이 양식을 작성해 주세요."
        }
      },
      {
        "who": "me",
        "text": "Oke. Boleh saya pinjam pulpen?",
        "gloss": {
          "en": "Okay. May I borrow a pen?",
          "ko": "네. 펜 좀 빌려도 돼요?"
        },
        "frames": [
          "id-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Ini. Bukunya dikembalikan dua minggu lagi, ya.",
        "gloss": {
          "en": "Here. Please return the book in two weeks.",
          "ko": "여기요. 책은 이 주 뒤에 반납해 주세요."
        }
      },
      {
        "who": "me",
        "text": "Siap. Terima kasih, Mbak.",
        "gloss": {
          "en": "Got it. Thank you.",
          "ko": "알겠어요. 고마워요."
        },
        "frames": [
          "id-f1-06"
        ]
      }
    ]
  },
  {
    "id": "id-2-b06",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Talking about hobbies at a café",
      "ko": "카페에서 취미 이야기"
    },
    "expressions": [
      "ayo",
      "seru banget"
    ],
    "grammar": [
      2,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Kamu suka olahraga?",
        "gloss": {
          "en": "Do you like sport?",
          "ko": "너 운동 좋아해?"
        }
      },
      {
        "who": "me",
        "text": "Suka. Setiap pagi saya lari di taman.",
        "gloss": {
          "en": "I do. Every morning I go running in the park.",
          "ko": "좋아해. 매일 아침 공원에서 달려."
        },
        "frames": [
          "id-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "Wah, rajin! Aku lebih suka yoga.",
        "gloss": {
          "en": "Wow, you're dedicated! I prefer yoga.",
          "ko": "와, 부지런하다! 나는 요가가 더 좋아."
        }
      },
      {
        "who": "me",
        "text": "Kamu pernah ikut kelas yoga di Ubud?",
        "gloss": {
          "en": "Have you ever taken a yoga class in Ubud?",
          "ko": "우붓에서 요가 수업 들어 본 적 있어?"
        },
        "frames": [
          "id-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "Pernah, tahun lalu. Bagus sekali.",
        "gloss": {
          "en": "Yes, last year. It was really good.",
          "ko": "응, 작년에. 정말 좋았어."
        }
      },
      {
        "who": "me",
        "text": "Ayo ikut kelas bareng minggu depan!",
        "gloss": {
          "en": "Let's take a class together next week!",
          "ko": "다음 주에 같이 수업 듣자!"
        },
        "frames": [
          "id-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Ayo! Nanti aku cari jadwalnya, ya.",
        "gloss": {
          "en": "Let's! I'll look up the schedule.",
          "ko": "좋아! 내가 시간표 찾아볼게."
        }
      },
      {
        "who": "me",
        "text": "Oke. Pasti seru banget!",
        "gloss": {
          "en": "Okay. It's going to be so much fun!",
          "ko": "좋아. 진짜 재밌겠다!"
        },
        "frames": [
          "id-f2-19"
        ]
      }
    ]
  },
  {
    "id": "id-2-b07",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Making plans to see a film",
      "ko": "영화 보러 갈 약속 정하기"
    },
    "expressions": [
      "jam berapa",
      "besok"
    ],
    "grammar": [
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Halo! Besok jadi nonton?",
        "gloss": {
          "en": "Hi! Are we still going to the film tomorrow?",
          "ko": "여보세요! 내일 영화 보는 거 그대로지?"
        }
      },
      {
        "who": "me",
        "text": "Jadi. Filmnya mulai jam berapa?",
        "gloss": {
          "en": "Yes. What time does the film start?",
          "ko": "응. 영화 몇 시에 시작해?"
        },
        "frames": [
          "id-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "Jam tujuh malam.",
        "gloss": {
          "en": "At seven in the evening.",
          "ko": "저녁 일곱 시."
        }
      },
      {
        "who": "me",
        "text": "Oke. Ketemu di depan bioskop, ya?",
        "gloss": {
          "en": "Okay. Let's meet in front of the cinema, okay?",
          "ko": "좋아. 영화관 앞에서 만나자, 응?"
        },
        "frames": [
          "id-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "Boleh. Kamu naik apa?",
        "gloss": {
          "en": "Sure. How are you getting there?",
          "ko": "좋아. 뭐 타고 와?"
        }
      },
      {
        "who": "me",
        "text": "Besok aku mau naik busway.",
        "gloss": {
          "en": "Tomorrow I'm going to take the TransJakarta bus.",
          "ko": "내일은 버스웨이 타고 갈 거야."
        },
        "frames": [
          "id-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Oke. Jangan telat, ya!",
        "gloss": {
          "en": "Okay. Don't be late!",
          "ko": "알았어. 늦지 마!"
        }
      },
      {
        "who": "me",
        "text": "Tenang. Sampai jumpa besok!",
        "gloss": {
          "en": "Relax. See you tomorrow!",
          "ko": "걱정 마. 내일 봐!"
        },
        "frames": [
          "id-f1-18"
        ]
      }
    ]
  },
  {
    "id": "id-2-b08",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Asking for help at a hotel front desk",
      "ko": "호텔 프런트에 부탁하기"
    },
    "expressions": [
      "boleh",
      "jam berapa",
      "minta tolong",
      "besok"
    ],
    "grammar": [
      1,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat malam. Ada yang bisa dibantu?",
        "gloss": {
          "en": "Good evening. Can I help you?",
          "ko": "안녕하세요. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Malam, Mbak. Sarapan jam berapa?",
        "gloss": {
          "en": "Good evening. What time is breakfast?",
          "ko": "안녕하세요. 아침 식사는 몇 시예요?"
        },
        "frames": [
          "id-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "Dari jam enam sampai jam sepuluh.",
        "gloss": {
          "en": "From six to ten.",
          "ko": "여섯 시부터 열 시까지예요."
        }
      },
      {
        "who": "me",
        "text": "Oke. Minta tolong bangunkan saya jam lima, ya.",
        "gloss": {
          "en": "Okay. Could you please wake me at five?",
          "ko": "네. 다섯 시에 모닝콜 부탁드려요."
        },
        "frames": [
          "id-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Baik, Kak. Ada lagi?",
        "gloss": {
          "en": "Certainly. Anything else?",
          "ko": "네. 더 필요하신 거 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Boleh saya titip koper di sini besok?",
        "gloss": {
          "en": "May I leave my suitcase here tomorrow?",
          "ko": "내일 여기에 캐리어 맡겨도 돼요?"
        },
        "frames": [
          "id-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Boleh, sampai sore.",
        "gloss": {
          "en": "Yes, until the afternoon.",
          "ko": "네, 오후까지 돼요."
        }
      },
      {
        "who": "me",
        "text": "Terima kasih banyak, Mbak.",
        "gloss": {
          "en": "Thank you very much.",
          "ko": "정말 고마워요."
        },
        "frames": [
          "id-f1-06"
        ]
      }
    ]
  },
  {
    "id": "id-2-b09",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Arriving late to the office",
      "ko": "회사에 지각함"
    },
    "expressions": [
      "belum",
      "sudah"
    ],
    "grammar": [
      0,
      1,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Pagi! Kok telat?",
        "gloss": {
          "en": "Morning! Why are you late?",
          "ko": "좋은 아침! 왜 늦었어요?"
        }
      },
      {
        "who": "me",
        "text": "Maaf, saya telat karena macet.",
        "gloss": {
          "en": "Sorry, I'm late because of the traffic.",
          "ko": "죄송해요, 길이 막혀서 늦었어요."
        },
        "frames": [
          "id-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Oh, nggak apa-apa. Rapatnya belum mulai.",
        "gloss": {
          "en": "Oh, that's fine. The meeting hasn't started.",
          "ko": "아, 괜찮아요. 회의 아직 안 시작했어요."
        }
      },
      {
        "who": "me",
        "text": "Syukurlah. Saya sudah kirim laporannya kemarin.",
        "gloss": {
          "en": "Thank goodness. I sent the report yesterday.",
          "ko": "다행이다. 보고서는 어제 보냈어요."
        },
        "frames": [
          "id-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Iya, bagus. Terima kasih.",
        "gloss": {
          "en": "Yes, it's good. Thanks.",
          "ko": "네, 좋았어요. 고마워요."
        }
      },
      {
        "who": "me",
        "text": "Tapi saya belum menyiapkan slide-nya.",
        "gloss": {
          "en": "But I haven't prepared the slides yet.",
          "ko": "그런데 슬라이드는 아직 준비 못 했어요."
        },
        "frames": [
          "id-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Tidak apa-apa. Rapatnya jam sepuluh.",
        "gloss": {
          "en": "That's fine. The meeting's at ten.",
          "ko": "괜찮아요. 회의는 열 시예요."
        }
      },
      {
        "who": "me",
        "text": "Oke. Saya siapkan sekarang.",
        "gloss": {
          "en": "Okay. I'll get them ready now.",
          "ko": "네. 지금 준비할게요."
        }
      }
    ]
  },
  {
    "id": "id-2-b10",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Invited to a friend's birthday party",
      "ko": "친구 생일 파티에 초대받음"
    },
    "expressions": [],
    "grammar": [
      0,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Sabtu ini aku ulang tahun. Datang, ya!",
        "gloss": {
          "en": "It's my birthday this Saturday. Come along!",
          "ko": "이번 토요일 내 생일이야. 꼭 와!"
        }
      },
      {
        "who": "me",
        "text": "Wah, selamat! Saya pasti datang.",
        "gloss": {
          "en": "Oh, happy birthday! I'll definitely come.",
          "ko": "와, 축하해! 꼭 갈게."
        }
      },
      {
        "who": "them",
        "text": "Acaranya di rumahku, jam tujuh malam.",
        "gloss": {
          "en": "It's at my place, at seven in the evening.",
          "ko": "우리 집에서 저녁 일곱 시야."
        }
      },
      {
        "who": "me",
        "text": "Oke. Ketemu di halte dulu, ya?",
        "gloss": {
          "en": "Okay. Let's meet at the bus stop first, okay?",
          "ko": "좋아. 먼저 정류장에서 만나자, 응?"
        },
        "frames": [
          "id-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "Boleh. Kamu mau bawa apa?",
        "gloss": {
          "en": "Sure. What do you want to bring?",
          "ko": "좋아. 뭐 가져올 거야?"
        }
      },
      {
        "who": "me",
        "text": "Saya ingin bawa kue cokelat.",
        "gloss": {
          "en": "I'd like to bring a chocolate cake.",
          "ko": "초콜릿 케이크 가져가고 싶어."
        },
        "frames": [
          "id-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Wah, enak! Terima kasih.",
        "gloss": {
          "en": "Ooh, yummy! Thanks.",
          "ko": "와, 맛있겠다! 고마워."
        }
      },
      {
        "who": "me",
        "text": "Sama-sama. Sampai jumpa hari Sabtu!",
        "gloss": {
          "en": "You're welcome. See you on Saturday!",
          "ko": "천만에. 토요일에 봐!"
        },
        "frames": [
          "id-f1-18"
        ]
      }
    ]
  },
  {
    "id": "id-2-b11",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Taking an angkot minibus to the market",
      "ko": "앙꼿 미니버스 타고 시장 가기"
    },
    "expressions": [
      "sudah",
      "minta tolong",
      "kiri di sini"
    ],
    "grammar": [
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Mau ke mana, Mbak?",
        "gloss": {
          "en": "Where are you going?",
          "ko": "어디 가세요?"
        }
      },
      {
        "who": "me",
        "text": "Ke Pasar Baru, Pak. Lewat sini, kan?",
        "gloss": {
          "en": "To Pasar Baru. It goes this way, right?",
          "ko": "파사르 바루요. 이쪽으로 가죠?"
        }
      },
      {
        "who": "them",
        "text": "Iya, lewat. Duduk di belakang, ya.",
        "gloss": {
          "en": "Yes, it does. Sit in the back.",
          "ko": "네, 가요. 뒤에 앉으세요."
        }
      },
      {
        "who": "me",
        "text": "Minta tolong kasih tahu kalau sudah dekat, ya.",
        "gloss": {
          "en": "Could you please tell me when we're close?",
          "ko": "가까워지면 좀 알려 주세요."
        },
        "frames": [
          "id-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Oke. Mbak lagi kuliah di sini?",
        "gloss": {
          "en": "Okay. Are you studying here?",
          "ko": "네. 여기서 대학 다니세요?"
        }
      },
      {
        "who": "me",
        "text": "Nggak, aku lagi liburan.",
        "gloss": {
          "en": "No, I'm on holiday.",
          "ko": "아니요, 지금 여행 중이에요."
        },
        "frames": [
          "id-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Oh. Nah, sudah sampai pasar.",
        "gloss": {
          "en": "Oh. There, we've reached the market.",
          "ko": "아. 자, 시장 다 왔어요."
        }
      },
      {
        "who": "me",
        "text": "Kiri di sini, Pak. Terima kasih!",
        "gloss": {
          "en": "Stop here on the left, please. Thank you!",
          "ko": "여기서 세워 주세요. 고마워요!"
        },
        "frames": [
          "id-f2-15",
          "id-f1-06"
        ]
      }
    ]
  },
  {
    "id": "id-2-b12",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Buying fried rice from a street cart",
      "ko": "길거리 수레에서 나시고렝 사기"
    },
    "expressions": [
      "belum",
      "nggak pedas ya"
    ],
    "grammar": [
      0,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "Malam, Mas. Nasi goreng?",
        "gloss": {
          "en": "Evening. Fried rice?",
          "ko": "안녕하세요. 나시고렝이요?"
        }
      },
      {
        "who": "me",
        "text": "Iya. Saya pesan dua, dibungkus.",
        "gloss": {
          "en": "Yes. I'll have two, to take away.",
          "ko": "네. 두 개 주세요, 포장으로요."
        },
        "frames": [
          "id-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "Pedas atau nggak?",
        "gloss": {
          "en": "Spicy or not?",
          "ko": "맵게요, 안 맵게요?"
        }
      },
      {
        "who": "me",
        "text": "Satu pedas, satu lagi nggak pedas ya.",
        "gloss": {
          "en": "One spicy, and the other not spicy, please.",
          "ko": "하나는 맵게, 하나는 안 맵게 해 주세요."
        },
        "frames": [
          "id-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Pakai telur? Tunggu lima belas menit, ya.",
        "gloss": {
          "en": "With egg? Wait fifteen minutes.",
          "ko": "계란 넣을까요? 십오 분 기다리세요."
        }
      },
      {
        "who": "me",
        "text": "Pakai. Saya tunggu di sini.",
        "gloss": {
          "en": "With egg. I'll wait here.",
          "ko": "넣어 주세요. 여기서 기다릴게요."
        }
      },
      {
        "who": "them",
        "text": "Ini, Mas. Sudah siap!",
        "gloss": {
          "en": "Here you go. It's ready!",
          "ko": "여기요. 다 됐어요!"
        }
      },
      {
        "who": "me",
        "text": "Terima kasih. Saya belum bayar, kan?",
        "gloss": {
          "en": "Thanks. I haven't paid yet, have I?",
          "ko": "고마워요. 아직 계산 안 했죠?"
        },
        "frames": [
          "id-f2-02"
        ]
      }
    ]
  },
  {
    "id": "id-2-b13",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Telling your manager you feel unwell",
      "ko": "팀장에게 몸이 안 좋다고 말하기"
    },
    "expressions": [
      "belum",
      "sudah",
      "besok"
    ],
    "grammar": [
      0,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "Kamu kelihatan pucat. Sakit?",
        "gloss": {
          "en": "You look pale. Are you ill?",
          "ko": "얼굴이 창백하네요. 아파요?"
        }
      },
      {
        "who": "me",
        "text": "Iya, Bu. Saya sakit tenggorokan.",
        "gloss": {
          "en": "Yes. I have a sore throat.",
          "ko": "네, 팀장님. 목이 아파요."
        },
        "frames": [
          "id-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "Sejak kapan?",
        "gloss": {
          "en": "Since when?",
          "ko": "언제부터요?"
        }
      },
      {
        "who": "me",
        "text": "Saya batuk sejak hari Senin.",
        "gloss": {
          "en": "I've been coughing since Monday.",
          "ko": "월요일부터 기침을 해요."
        },
        "frames": [
          "id-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "Sudah minum obat?",
        "gloss": {
          "en": "Have you taken any medicine?",
          "ko": "약은 먹었어요?"
        }
      },
      {
        "who": "me",
        "text": "Saya sudah minum, tapi belum sembuh.",
        "gloss": {
          "en": "I've taken some, but I'm not better yet.",
          "ko": "먹었는데 아직 안 나았어요."
        },
        "frames": [
          "id-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Pulang saja, istirahat di rumah.",
        "gloss": {
          "en": "Just go home and rest.",
          "ko": "그냥 집에 가서 쉬어요."
        }
      },
      {
        "who": "me",
        "text": "Terima kasih, Bu. Besok saya kabari.",
        "gloss": {
          "en": "Thank you. I'll let you know tomorrow.",
          "ko": "고마워요, 팀장님. 내일 연락드릴게요."
        },
        "frames": [
          "id-f1-06"
        ]
      }
    ]
  },
  {
    "id": "id-2-b14",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Morning at a homestay",
      "ko": "홈스테이에서 맞는 아침"
    },
    "expressions": [
      "boleh"
    ],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Pagi! Tidur nyenyak?",
        "gloss": {
          "en": "Morning! Did you sleep well?",
          "ko": "좋은 아침! 잘 잤어요?"
        }
      },
      {
        "who": "me",
        "text": "Nyenyak, Bu. Setiap pagi saya jalan kaki.",
        "gloss": {
          "en": "Very well. Every morning I go for a walk.",
          "ko": "잘 잤어요. 저는 매일 아침 산책해요."
        },
        "frames": [
          "id-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "Oh, mau jalan sekarang?",
        "gloss": {
          "en": "Oh, do you want to go now?",
          "ko": "아, 지금 나가려고요?"
        }
      },
      {
        "who": "me",
        "text": "Iya. Boleh saya keluar sebentar?",
        "gloss": {
          "en": "Yes. May I go out for a bit?",
          "ko": "네. 잠깐 나갔다 와도 돼요?"
        },
        "frames": [
          "id-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Boleh. Hati-hati, ya. Sarapannya mau apa?",
        "gloss": {
          "en": "Of course. Be careful. What would you like for breakfast?",
          "ko": "그럼요. 조심해요. 아침은 뭐 먹을래요?"
        }
      },
      {
        "who": "me",
        "text": "Saya ingin coba bubur ayam.",
        "gloss": {
          "en": "I'd like to try chicken porridge.",
          "ko": "부부르 아얌을 먹어 보고 싶어요."
        },
        "frames": [
          "id-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Oke, nanti Ibu masak bubur ayam.",
        "gloss": {
          "en": "Okay, I'll make chicken porridge.",
          "ko": "좋아요, 이따 부부르 아얌 만들어 줄게요."
        }
      },
      {
        "who": "me",
        "text": "Wah, terima kasih, Bu!",
        "gloss": {
          "en": "Oh, thank you!",
          "ko": "와, 고마워요!"
        },
        "frames": [
          "id-f1-06"
        ]
      }
    ]
  },
  {
    "id": "id-2-b15",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Chatting with a traveller at a hostel",
      "ko": "호스텔에서 여행자와 대화"
    },
    "expressions": [
      "ayo",
      "besok",
      "seru banget"
    ],
    "grammar": [
      0,
      3,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hai! Kamu baru datang?",
        "gloss": {
          "en": "Hi! Did you just arrive?",
          "ko": "안녕! 방금 왔어?"
        }
      },
      {
        "who": "me",
        "text": "Iya, tadi pagi. Kamu pernah ke Bromo?",
        "gloss": {
          "en": "Yes, this morning. Have you ever been to Bromo?",
          "ko": "응, 오늘 아침에. 브로모 가 본 적 있어?"
        },
        "frames": [
          "id-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "Pernah! Bagus banget, apalagi waktu matahari terbit.",
        "gloss": {
          "en": "Yes! It's gorgeous, especially at sunrise.",
          "ko": "가 봤지! 엄청 멋져, 특히 해 뜰 때."
        }
      },
      {
        "who": "me",
        "text": "Besok aku mau ke sana.",
        "gloss": {
          "en": "Tomorrow I'm going to go there.",
          "ko": "내일 거기 갈 거야."
        },
        "frames": [
          "id-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Biasanya berangkat jam satu malam, lho.",
        "gloss": {
          "en": "People usually leave at one in the morning, you know.",
          "ko": "보통 새벽 한 시에 출발해."
        }
      },
      {
        "who": "me",
        "text": "Jam satu? Aku lagi cari tur sekarang.",
        "gloss": {
          "en": "One o'clock? I'm looking for a tour right now.",
          "ko": "한 시? 지금 투어 찾는 중이야."
        },
        "frames": [
          "id-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Ikut tur kami saja!",
        "gloss": {
          "en": "Just join our tour!",
          "ko": "우리 투어에 같이 가자!"
        }
      },
      {
        "who": "me",
        "text": "Wah, ayo! Pasti seru banget!",
        "gloss": {
          "en": "Oh, let's! It'll be so much fun!",
          "ko": "와, 가자! 진짜 재밌겠다!"
        },
        "frames": [
          "id-f2-06",
          "id-f2-19"
        ]
      }
    ]
  },
  {
    "id": "id-2-b16",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Getting a phone screen repaired",
      "ko": "휴대폰 액정 수리 맡기기"
    },
    "expressions": [
      "sudah",
      "jam berapa",
      "minta tolong"
    ],
    "grammar": [
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat siang. HP-nya kenapa, Kak?",
        "gloss": {
          "en": "Good afternoon. What's wrong with the phone?",
          "ko": "안녕하세요. 휴대폰이 어떻게 됐어요?"
        }
      },
      {
        "who": "me",
        "text": "Layarnya rusak karena jatuh.",
        "gloss": {
          "en": "The screen broke because I dropped it.",
          "ko": "떨어뜨려서 액정이 깨졌어요."
        },
        "frames": [
          "id-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Oh, bisa diganti, tapi agak lama.",
        "gloss": {
          "en": "Oh, it can be replaced, but it takes a while.",
          "ko": "아, 교체할 수 있는데 시간이 좀 걸려요."
        }
      },
      {
        "who": "me",
        "text": "Selesai jam berapa?",
        "gloss": {
          "en": "What time will it be done?",
          "ko": "몇 시에 끝나요?"
        },
        "frames": [
          "id-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "Jam empat sore.",
        "gloss": {
          "en": "At four in the afternoon.",
          "ko": "오후 네 시요."
        }
      },
      {
        "who": "me",
        "text": "Oke. Minta tolong telepon saya kalau sudah selesai, ya.",
        "gloss": {
          "en": "Okay. Could you please call me when it's done?",
          "ko": "네. 다 되면 전화 좀 주세요."
        },
        "frames": [
          "id-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Baik. Nomornya berapa?",
        "gloss": {
          "en": "Sure. What's your number?",
          "ko": "네. 번호가 어떻게 되세요?"
        }
      },
      {
        "who": "me",
        "text": "Ini kartu nama saya.",
        "gloss": {
          "en": "This is my business card.",
          "ko": "이거 제 명함이에요."
        },
        "frames": [
          "id-f1-14"
        ]
      }
    ]
  },
  {
    "id": "id-2-b17",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "A friend drops by while you're cooking",
      "ko": "요리하는데 친구가 들름"
    },
    "expressions": [
      "ayo",
      "boleh",
      "minta tolong"
    ],
    "grammar": [
      0,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Halo, aku sudah di depan rumahmu!",
        "gloss": {
          "en": "Hi, I'm outside your house!",
          "ko": "여보세요, 나 너희 집 앞이야!"
        }
      },
      {
        "who": "me",
        "text": "Masuk aja! Aku lagi masak rendang.",
        "gloss": {
          "en": "Come on in! I'm cooking rendang.",
          "ko": "들어와! 나 렌당 만드는 중이야."
        },
        "frames": [
          "id-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Wah, harum banget! Masih lama?",
        "gloss": {
          "en": "Wow, it smells amazing! Will it take long?",
          "ko": "와, 냄새 좋다! 아직 오래 걸려?"
        }
      },
      {
        "who": "me",
        "text": "Masih satu jam lagi.",
        "gloss": {
          "en": "Another hour still.",
          "ko": "아직 한 시간 더 걸려."
        }
      },
      {
        "who": "them",
        "text": "Aku bantu, ya?",
        "gloss": {
          "en": "Shall I help?",
          "ko": "내가 도와줄까?"
        }
      },
      {
        "who": "me",
        "text": "Boleh. Minta tolong potong sayurnya, ya.",
        "gloss": {
          "en": "Sure. Could you please cut the vegetables?",
          "ko": "좋아. 채소 좀 썰어 줘."
        },
        "frames": [
          "id-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Oke! Habis makan kita ngapain?",
        "gloss": {
          "en": "Okay! What shall we do after eating?",
          "ko": "알았어! 밥 먹고 뭐 할까?"
        }
      },
      {
        "who": "me",
        "text": "Ayo nonton film!",
        "gloss": {
          "en": "Let's watch a film!",
          "ko": "영화 보자!"
        },
        "frames": [
          "id-f2-06"
        ]
      }
    ]
  },
  {
    "id": "id-2-b18",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Buying a train ticket to Yogyakarta",
      "ko": "족자카르타행 기차표 사기"
    },
    "expressions": [
      "boleh",
      "jam berapa"
    ],
    "grammar": [
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat pagi. Mau ke mana?",
        "gloss": {
          "en": "Good morning. Where to?",
          "ko": "안녕하세요. 어디 가세요?"
        }
      },
      {
        "who": "me",
        "text": "Pagi, Pak. Saya ingin ke Yogyakarta hari ini.",
        "gloss": {
          "en": "Good morning. I'd like to go to Yogyakarta today.",
          "ko": "안녕하세요. 오늘 족자카르타에 가고 싶어요."
        },
        "frames": [
          "id-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Ada kereta jam sepuluh dan jam dua siang.",
        "gloss": {
          "en": "There are trains at ten and at two in the afternoon.",
          "ko": "열 시 기차랑 오후 두 시 기차가 있어요."
        }
      },
      {
        "who": "me",
        "text": "Kereta jam sepuluh sampai jam berapa?",
        "gloss": {
          "en": "What time does the ten o'clock train arrive?",
          "ko": "열 시 기차는 몇 시에 도착해요?"
        },
        "frames": [
          "id-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "Sampai jam empat sore.",
        "gloss": {
          "en": "It arrives at four in the afternoon.",
          "ko": "오후 네 시에 도착해요."
        }
      },
      {
        "who": "me",
        "text": "Oke, yang itu. Boleh saya bayar pakai kartu?",
        "gloss": {
          "en": "Okay, that one. May I pay by card?",
          "ko": "네, 그걸로 할게요. 카드로 결제해도 돼요?"
        },
        "frames": [
          "id-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Boleh. Ini tiketnya.",
        "gloss": {
          "en": "Yes. Here's your ticket.",
          "ko": "네. 표 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "Terima kasih. Peronnya di mana?",
        "gloss": {
          "en": "Thank you. Where's the platform?",
          "ko": "고마워요. 승강장은 어디예요?"
        },
        "frames": [
          "id-f1-08"
        ]
      }
    ]
  },
  {
    "id": "id-2-b19",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Telling a friend about last night's concert",
      "ko": "어젯밤 콘서트 이야기"
    },
    "expressions": [
      "sudah",
      "ayo",
      "seru banget"
    ],
    "grammar": [
      0,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Gimana konsernya semalam?",
        "gloss": {
          "en": "How was the concert last night?",
          "ko": "어젯밤 콘서트 어땠어?"
        }
      },
      {
        "who": "me",
        "text": "Konsernya seru banget!",
        "gloss": {
          "en": "The concert was so much fun!",
          "ko": "콘서트 진짜 재밌었어!"
        },
        "frames": [
          "id-f2-19"
        ]
      },
      {
        "who": "them",
        "text": "Wah, iri! Penyanyinya bagus?",
        "gloss": {
          "en": "Oh, I'm jealous! Was the singer good?",
          "ko": "와, 부럽다! 가수 잘했어?"
        }
      },
      {
        "who": "me",
        "text": "Bagus banget. Kamu pernah nonton dia?",
        "gloss": {
          "en": "Really good. Have you ever seen her live?",
          "ko": "엄청 잘했어. 너 그 가수 공연 본 적 있어?"
        },
        "frames": [
          "id-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "Belum pernah. Ada videonya?",
        "gloss": {
          "en": "Never. Do you have a video?",
          "ko": "한 번도 없어. 영상 있어?"
        }
      },
      {
        "who": "me",
        "text": "Ada. Saya sudah kirim ke WhatsApp kamu.",
        "gloss": {
          "en": "Yes. I've already sent it to your WhatsApp.",
          "ko": "있어. 네 왓츠앱으로 벌써 보냈어."
        },
        "frames": [
          "id-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Oke, nanti aku lihat.",
        "gloss": {
          "en": "Okay, I'll watch it later.",
          "ko": "알았어, 이따 볼게."
        }
      },
      {
        "who": "me",
        "text": "Lain kali ayo nonton bareng!",
        "gloss": {
          "en": "Next time let's go together!",
          "ko": "다음엔 같이 보러 가자!"
        },
        "frames": [
          "id-f2-06"
        ]
      }
    ]
  },
  {
    "id": "id-2-b20",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Picking up a parcel from the apartment guard",
      "ko": "아파트 경비실에서 택배 받기"
    },
    "expressions": [
      "belum",
      "sudah",
      "minta tolong"
    ],
    "grammar": [
      0,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat sore, Kak. Ada paket untuk Kakak.",
        "gloss": {
          "en": "Good afternoon. There's a parcel for you.",
          "ko": "안녕하세요. 택배 왔어요."
        }
      },
      {
        "who": "me",
        "text": "Oh, terima kasih, Pak. Saya sudah tunggu dari kemarin.",
        "gloss": {
          "en": "Oh, thank you. I've been waiting since yesterday.",
          "ko": "아, 고마워요. 어제부터 기다리고 있었어요."
        },
        "frames": [
          "id-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Sama-sama. Masih ada paket lain?",
        "gloss": {
          "en": "You're welcome. Are there more parcels coming?",
          "ko": "천만에요. 다른 택배도 더 와요?"
        }
      },
      {
        "who": "me",
        "text": "Ada satu lagi. Saya belum terima yang kedua.",
        "gloss": {
          "en": "One more. I haven't received the second one yet.",
          "ko": "하나 더 있어요. 두 번째 건 아직 못 받았어요."
        },
        "frames": [
          "id-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Nanti kalau datang, saya simpan di sini.",
        "gloss": {
          "en": "When it comes, I'll keep it here.",
          "ko": "오면 여기 보관해 둘게요."
        }
      },
      {
        "who": "me",
        "text": "Oke. Minta tolong kabari saya, ya.",
        "gloss": {
          "en": "Okay. Could you please let me know?",
          "ko": "네. 오면 좀 알려 주세요."
        },
        "frames": [
          "id-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Siap, Kak.",
        "gloss": {
          "en": "Will do.",
          "ko": "알겠어요."
        }
      },
      {
        "who": "me",
        "text": "Terima kasih. Selamat sore, Pak!",
        "gloss": {
          "en": "Thank you. Good afternoon!",
          "ko": "고마워요. 수고하세요!"
        },
        "frames": [
          "id-f1-05"
        ]
      }
    ]
  },
  {
    "id": "id-3-b01",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "The restaurant brings the wrong dish",
      "ko": "식당에서 다른 음식이 나옴"
    },
    "expressions": [
      "untungnya",
      "ada masalah",
      "sudah saya cek"
    ],
    "grammar": [
      0,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ini pesanannya, Kak. Nasi goreng seafood.",
        "gloss": {
          "en": "Here's your order. Seafood fried rice.",
          "ko": "주문하신 음식 나왔습니다. 해산물 나시고렝이요."
        }
      },
      {
        "who": "me",
        "text": "Maaf, Mas, ada masalah dengan pesanan saya. Saya pesan nasi goreng ayam.",
        "gloss": {
          "en": "Sorry, there's a problem with my order. I ordered chicken fried rice.",
          "ko": "죄송한데 주문이 잘못된 것 같아요. 저는 치킨 나시고렝을 시켰어요."
        },
        "frames": [
          "id-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Oh, maaf sekali! Saya ganti sekarang, ya.",
        "gloss": {
          "en": "Oh, I'm so sorry! I'll change it right away.",
          "ko": "아, 정말 죄송해요! 바로 바꿔 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "Tidak apa-apa. Bisa tolong buatkan yang tidak terlalu pedas?",
        "gloss": {
          "en": "That's all right. Could you make it not too spicy?",
          "ko": "괜찮아요. 너무 맵지 않게 만들어 주실 수 있어요?"
        },
        "frames": [
          "id-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Baik. Minumannya sudah benar, kan?",
        "gloss": {
          "en": "Sure. The drink is right, isn't it?",
          "ko": "네. 음료는 맞게 나왔죠?"
        }
      },
      {
        "who": "me",
        "text": "Sudah. Es tehnya sudah saya cek, tidak pakai gula.",
        "gloss": {
          "en": "Yes. I've checked the iced tea — no sugar.",
          "ko": "네. 아이스티는 확인했어요, 설탕 없이 나왔어요."
        },
        "frames": [
          "id-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Ini nasi goreng ayamnya, Kak. Maaf sudah menunggu.",
        "gloss": {
          "en": "Here's the chicken fried rice. Sorry for the wait.",
          "ko": "치킨 나시고렝 나왔습니다. 기다리게 해서 죄송해요."
        }
      },
      {
        "who": "me",
        "text": "Untungnya, saya belum terlalu lapar. Terima kasih, ya.",
        "gloss": {
          "en": "Luckily, I wasn't too hungry yet. Thank you.",
          "ko": "다행히 아직 많이 배고프진 않았어요. 고마워요."
        },
        "frames": [
          "id-f3-15"
        ]
      }
    ]
  },
  {
    "id": "id-3-b02",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling lost and found about a wallet left on a train",
      "ko": "기차에 두고 내린 지갑 분실물 센터에 전화"
    },
    "expressions": [],
    "grammar": [
      0,
      1,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat siang, layanan barang hilang. Ada yang bisa dibantu?",
        "gloss": {
          "en": "Good afternoon, lost and found. How can I help?",
          "ko": "안녕하세요, 분실물 센터입니다. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Selamat siang. Dompet saya tertinggal di kereta tadi pagi.",
        "gloss": {
          "en": "Good afternoon. I left my wallet on the train this morning.",
          "ko": "안녕하세요. 오늘 아침에 기차에 지갑을 두고 내렸어요."
        },
        "frames": [
          "id-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "Kereta yang mana, Kak?",
        "gloss": {
          "en": "Which train was it?",
          "ko": "어느 기차였어요?"
        }
      },
      {
        "who": "me",
        "text": "Waktu saya turun di Stasiun Bogor, sekitar jam delapan.",
        "gloss": {
          "en": "It was when I got off at Bogor Station, around eight.",
          "ko": "보고르역에서 내릴 때였어요, 여덟 시쯤이요."
        },
        "frames": [
          "id-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Sebentar, ya. Dompetnya warna cokelat?",
        "gloss": {
          "en": "One moment. Is the wallet brown?",
          "ko": "잠시만요. 지갑이 갈색인가요?"
        }
      },
      {
        "who": "me",
        "text": "Iya, betul! Dompetnya sudah ditemukan?",
        "gloss": {
          "en": "Yes, that's it! Has it been found?",
          "ko": "네, 맞아요! 지갑 찾으셨어요?"
        },
        "frames": [
          "id-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Sudah, Kak. Bisa diambil di kantor kami di Stasiun Bogor.",
        "gloss": {
          "en": "Yes. You can collect it at our office at Bogor Station.",
          "ko": "네. 보고르역 저희 사무실에서 찾아가시면 돼요."
        }
      },
      {
        "who": "me",
        "text": "Bisa tolong simpankan sampai sore? Saya ke sana jam lima.",
        "gloss": {
          "en": "Could you keep it until the afternoon? I'll be there at five.",
          "ko": "오후까지 보관해 주실 수 있어요? 다섯 시에 갈게요."
        },
        "frames": [
          "id-f3-05"
        ]
      }
    ]
  },
  {
    "id": "id-3-b03",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Choosing a new phone at an electronics shop",
      "ko": "전자제품 매장에서 휴대폰 고르기"
    },
    "expressions": [
      "menurut saya"
    ],
    "grammar": [
      2,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Mau cari HP yang seperti apa, Kak?",
        "gloss": {
          "en": "What kind of phone are you looking for?",
          "ko": "어떤 휴대폰 찾으세요?"
        }
      },
      {
        "who": "me",
        "text": "Saya mau yang baterainya awet.",
        "gloss": {
          "en": "I'd like one with a long-lasting battery.",
          "ko": "배터리가 오래가는 걸로 사고 싶어요."
        },
        "frames": [
          "id-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "Ini ada dua. Yang hitam dan yang putih.",
        "gloss": {
          "en": "There are these two. The black one and the white one.",
          "ko": "이 두 개가 있어요. 검은색이랑 흰색이요."
        }
      },
      {
        "who": "me",
        "text": "Yang hitam lebih mahal daripada yang putih?",
        "gloss": {
          "en": "Is the black one more expensive than the white one?",
          "ko": "검은색이 흰색보다 더 비싸요?"
        },
        "frames": [
          "id-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Iya, sedikit. Tapi kameranya lebih bagus.",
        "gloss": {
          "en": "Yes, a little. But the camera is better.",
          "ko": "네, 조금요. 대신 카메라가 더 좋아요."
        }
      },
      {
        "who": "me",
        "text": "Yang paling laris itu yang mana?",
        "gloss": {
          "en": "Which one sells best?",
          "ko": "제일 잘 팔리는 건 어떤 거예요?"
        },
        "frames": [
          "id-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "Yang hitam, Kak. Banyak yang suka.",
        "gloss": {
          "en": "The black one. Lots of people like it.",
          "ko": "검은색이요. 좋아하는 분이 많아요."
        }
      },
      {
        "who": "me",
        "text": "Menurut saya, yang putih juga cukup. Saya ambil yang putih saja.",
        "gloss": {
          "en": "I think the white one is good enough. I'll just take the white one.",
          "ko": "제 생각엔 흰색도 충분해요. 흰색으로 할게요."
        },
        "frames": [
          "id-f3-01"
        ]
      }
    ]
  },
  {
    "id": "id-3-b04",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Weather and a trip to a waterfall",
      "ko": "날씨 보고 폭포 나들이 정하기"
    },
    "expressions": [
      "kayaknya",
      "terus"
    ],
    "grammar": [
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Besok jadi ke curug?",
        "gloss": {
          "en": "Are we still going to the waterfall tomorrow?",
          "ko": "내일 폭포 가는 거 그대로야?"
        }
      },
      {
        "who": "me",
        "text": "Kayaknya besok hujan deras.",
        "gloss": {
          "en": "It looks like it'll rain hard tomorrow.",
          "ko": "내일 비가 많이 올 것 같아."
        },
        "frames": [
          "id-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Yah. Terus gimana?",
        "gloss": {
          "en": "Oh no. So what now?",
          "ko": "아이고. 그럼 어떡해?"
        }
      },
      {
        "who": "me",
        "text": "Kalau hujan, kita nonton film di rumah saja.",
        "gloss": {
          "en": "If it rains, let's just watch a film at home.",
          "ko": "비 오면 그냥 집에서 영화 보자."
        },
        "frames": [
          "id-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Oke, tapi kalau cerah?",
        "gloss": {
          "en": "Okay, but what if it's sunny?",
          "ko": "좋아, 근데 날씨 맑으면?"
        }
      },
      {
        "who": "me",
        "text": "Kalau cerah, kita berangkat pagi-pagi.",
        "gloss": {
          "en": "If it's sunny, we'll leave early in the morning.",
          "ko": "맑으면 아침 일찍 출발하자."
        },
        "frames": [
          "id-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Sip. Aku bawa bekal, ya.",
        "gloss": {
          "en": "Great. I'll bring a packed lunch.",
          "ko": "좋아. 내가 도시락 싸 갈게."
        }
      },
      {
        "who": "me",
        "text": "Oke. Terus, aku bawa minumannya.",
        "gloss": {
          "en": "Okay. Then I'll bring the drinks.",
          "ko": "좋아. 그럼 나는 음료 가져갈게."
        },
        "frames": [
          "id-f3-17"
        ]
      }
    ]
  },
  {
    "id": "id-3-b05",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A team meeting about a launch date",
      "ko": "출시 날짜를 정하는 팀 회의"
    },
    "expressions": [
      "menurut saya",
      "sebenarnya",
      "saya setuju",
      "sudah saya cek",
      "lebih baik"
    ],
    "grammar": [
      0,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Jadi, peluncurannya minggu depan atau bulan depan?",
        "gloss": {
          "en": "So, should the launch be next week or next month?",
          "ko": "그럼 출시는 다음 주로 할까요, 다음 달로 할까요?"
        }
      },
      {
        "who": "me",
        "text": "Menurut saya, lebih baik bulan depan.",
        "gloss": {
          "en": "In my opinion, next month is better.",
          "ko": "제 생각엔 다음 달이 나아요."
        },
        "frames": [
          "id-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Kenapa? Timnya belum siap?",
        "gloss": {
          "en": "Why? Isn't the team ready?",
          "ko": "왜요? 팀이 아직 준비가 안 됐어요?"
        }
      },
      {
        "who": "me",
        "text": "Sebenarnya desainnya belum selesai.",
        "gloss": {
          "en": "Actually, the design isn't finished yet.",
          "ko": "사실 디자인이 아직 안 끝났어요."
        },
        "frames": [
          "id-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Oke. Datanya sudah lengkap?",
        "gloss": {
          "en": "Okay. Is the data complete?",
          "ko": "알겠어요. 데이터는 다 됐어요?"
        }
      },
      {
        "who": "me",
        "text": "Datanya sudah saya cek kemarin. Semuanya lengkap.",
        "gloss": {
          "en": "I checked the data yesterday. It's all complete.",
          "ko": "데이터는 어제 제가 확인했어요. 다 있어요."
        },
        "frames": [
          "id-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Baik, kita pilih bulan depan.",
        "gloss": {
          "en": "All right, we'll go with next month.",
          "ko": "좋아요, 다음 달로 하죠."
        }
      },
      {
        "who": "me",
        "text": "Saya setuju dengan keputusan itu.",
        "gloss": {
          "en": "I agree with that decision.",
          "ko": "그 결정에 동의해요."
        },
        "frames": [
          "id-f3-13"
        ]
      }
    ]
  },
  {
    "id": "id-3-b06",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "The air conditioning in your hotel room is broken",
      "ko": "호텔 방 에어컨이 고장 남"
    },
    "expressions": [
      "untungnya",
      "sayangnya",
      "ada masalah"
    ],
    "grammar": [
      0,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat malam, resepsionis. Ada yang bisa dibantu?",
        "gloss": {
          "en": "Good evening, reception. How can I help?",
          "ko": "안녕하세요, 프런트입니다. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Selamat malam. Ada masalah dengan AC di kamar saya.",
        "gloss": {
          "en": "Good evening. There's a problem with the air conditioning in my room.",
          "ko": "안녕하세요. 제 방 에어컨에 문제가 있어요."
        },
        "frames": [
          "id-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Oh, maaf. AC-nya kenapa, Kak?",
        "gloss": {
          "en": "Oh, sorry. What's wrong with it?",
          "ko": "아, 죄송합니다. 에어컨이 어떤가요?"
        }
      },
      {
        "who": "me",
        "text": "Sayangnya, AC-nya tidak dingin sama sekali.",
        "gloss": {
          "en": "Unfortunately, it isn't cooling at all.",
          "ko": "아쉽게도 전혀 시원해지지 않아요."
        },
        "frames": [
          "id-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "Kami kirim teknisi sekarang, ya.",
        "gloss": {
          "en": "We'll send a technician now.",
          "ko": "지금 기사님을 보내 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "Bisa tolong pindahkan saya ke kamar lain?",
        "gloss": {
          "en": "Could you move me to another room?",
          "ko": "다른 방으로 옮겨 주실 수 있어요?"
        },
        "frames": [
          "id-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Bisa. Kamar sebelah sudah dibersihkan, Kak.",
        "gloss": {
          "en": "Yes. The room next door has been cleaned.",
          "ko": "네. 옆방은 청소가 끝났어요."
        }
      },
      {
        "who": "me",
        "text": "Untungnya, masih ada kamar kosong. Terima kasih!",
        "gloss": {
          "en": "Luckily, there's still a free room. Thank you!",
          "ko": "다행히 빈방이 있네요. 고마워요!"
        },
        "frames": [
          "id-f3-15"
        ]
      }
    ]
  },
  {
    "id": "id-3-b07",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Telling a coworker about your weekend in Bandung",
      "ko": "동료에게 반둥 주말 여행 이야기"
    },
    "expressions": [
      "terus",
      "ternyata"
    ],
    "grammar": [
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Gimana akhir pekannya?",
        "gloss": {
          "en": "How was your weekend?",
          "ko": "주말 어땠어?"
        }
      },
      {
        "who": "me",
        "text": "Seru! Aku ke Bandung naik kereta.",
        "gloss": {
          "en": "Great! I went to Bandung by train.",
          "ko": "재밌었어! 기차 타고 반둥 갔어."
        }
      },
      {
        "who": "them",
        "text": "Oh ya? Ngapain di sana?",
        "gloss": {
          "en": "Really? What did you do there?",
          "ko": "그래? 거기서 뭐 했어?"
        }
      },
      {
        "who": "me",
        "text": "Waktu sampai, aku langsung ke kebun teh.",
        "gloss": {
          "en": "When I arrived, I went straight to the tea plantation.",
          "ko": "도착하자마자 바로 차밭에 갔어."
        },
        "frames": [
          "id-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Wah, pasti dingin.",
        "gloss": {
          "en": "Wow, it must have been cold.",
          "ko": "와, 추웠겠다."
        }
      },
      {
        "who": "me",
        "text": "Iya. Terus, kami makan siang di warung Sunda.",
        "gloss": {
          "en": "Yes. Then we had lunch at a Sundanese eatery.",
          "ko": "응. 그러고 나서 순다 음식점에서 점심 먹었어."
        },
        "frames": [
          "id-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "Enak?",
        "gloss": {
          "en": "Was it good?",
          "ko": "맛있었어?"
        }
      },
      {
        "who": "me",
        "text": "Enak banget. Ternyata harganya murah sekali.",
        "gloss": {
          "en": "Really good. It turned out to be really cheap.",
          "ko": "엄청 맛있었어. 알고 보니 가격도 엄청 싸더라."
        },
        "frames": [
          "id-f3-14"
        ]
      }
    ]
  },
  {
    "id": "id-3-b08",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Helping a friend choose a city to move to",
      "ko": "친구가 이사 갈 도시 고르는 걸 도와줌"
    },
    "expressions": [
      "kayaknya"
    ],
    "grammar": [
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Aku mau pindah kerja. Pilih Jakarta atau Surabaya, ya?",
        "gloss": {
          "en": "I'm changing jobs. Should I pick Jakarta or Surabaya?",
          "ko": "나 이직하려고. 자카르타랑 수라바야 중에 어디가 좋을까?"
        }
      },
      {
        "who": "me",
        "text": "Menurut kamu, gajinya lebih tinggi di mana?",
        "gloss": {
          "en": "What do you think — where's the salary higher?",
          "ko": "네 생각엔 어디가 월급이 더 높아?"
        },
        "frames": [
          "id-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "Jakarta, tapi biaya hidupnya juga lebih mahal.",
        "gloss": {
          "en": "Jakarta, but the cost of living is higher too.",
          "ko": "자카르타인데, 생활비도 더 비싸."
        }
      },
      {
        "who": "me",
        "text": "Kayaknya Surabaya lebih santai daripada Jakarta.",
        "gloss": {
          "en": "I guess Surabaya is more relaxed than Jakarta.",
          "ko": "수라바야가 자카르타보다 더 여유로운 것 같아."
        },
        "frames": [
          "id-f3-02",
          "id-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Iya, macetnya juga nggak separah Jakarta.",
        "gloss": {
          "en": "Yes, and the traffic isn't as bad as Jakarta.",
          "ko": "맞아, 교통 체증도 자카르타만큼 심하지 않아."
        }
      },
      {
        "who": "me",
        "text": "Yang paling penting itu kamu betah.",
        "gloss": {
          "en": "The most important thing is that you feel at home.",
          "ko": "제일 중요한 건 네가 거기서 잘 지내는 거야."
        },
        "frames": [
          "id-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "Betul juga. Aku pikir dulu, deh.",
        "gloss": {
          "en": "That's true. I'll think about it.",
          "ko": "그것도 맞네. 좀 생각해 볼게."
        }
      },
      {
        "who": "me",
        "text": "Kalau butuh bantuan pindahan, kabari aku, ya.",
        "gloss": {
          "en": "If you need help moving, let me know.",
          "ko": "이사 도움 필요하면 말해."
        },
        "frames": [
          "id-f3-08"
        ]
      }
    ]
  },
  {
    "id": "id-3-b09",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling customer service about a missing parcel",
      "ko": "택배가 안 와서 고객센터에 전화"
    },
    "expressions": [
      "sayangnya",
      "ada masalah",
      "sudah saya cek"
    ],
    "grammar": [
      0,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Halo, layanan pelanggan. Ada yang bisa dibantu?",
        "gloss": {
          "en": "Hello, customer service. How can I help?",
          "ko": "안녕하세요, 고객센터입니다. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Halo. Ada masalah dengan paket saya. Statusnya sudah diterima, tapi saya belum terima.",
        "gloss": {
          "en": "Hello. There's a problem with my parcel. It says delivered, but I haven't got it.",
          "ko": "안녕하세요. 택배에 문제가 있어요. 배송 완료로 나오는데 아직 못 받았어요."
        },
        "frames": [
          "id-f3-06",
          "id-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Boleh saya minta nomor pesanannya?",
        "gloss": {
          "en": "May I have your order number?",
          "ko": "주문 번호 알려 주시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "Sudah saya kirim lewat chat. Pos satpam juga sudah saya cek.",
        "gloss": {
          "en": "I've sent it by chat. I've checked the security post too.",
          "ko": "채팅으로 보냈어요. 경비실도 제가 확인했어요."
        },
        "frames": [
          "id-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Baik, kami cek dengan kurirnya dulu.",
        "gloss": {
          "en": "All right, we'll check with the courier first.",
          "ko": "네, 먼저 택배 기사님께 확인해 볼게요."
        }
      },
      {
        "who": "me",
        "text": "Bisa tolong kabari saya hari ini?",
        "gloss": {
          "en": "Could you let me know today?",
          "ko": "오늘 안에 알려 주실 수 있어요?"
        },
        "frames": [
          "id-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Bisa, Kak. Paling lambat jam lima sore.",
        "gloss": {
          "en": "Yes. By five in the afternoon at the latest.",
          "ko": "네. 늦어도 오후 다섯 시까지요."
        }
      },
      {
        "who": "me",
        "text": "Oke, terima kasih. Sayangnya, saya butuh barangnya besok.",
        "gloss": {
          "en": "Okay, thank you. Unfortunately, I need it tomorrow.",
          "ko": "네, 고마워요. 아쉽게도 그 물건이 내일 필요해요."
        },
        "frames": [
          "id-f3-16"
        ]
      }
    ]
  },
  {
    "id": "id-3-b10",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A follow-up visit to the doctor",
      "ko": "병원 재진"
    },
    "expressions": [
      "kayaknya",
      "sebenarnya",
      "lebih baik"
    ],
    "grammar": [
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Gimana, masih pusing?",
        "gloss": {
          "en": "How are you? Still dizzy?",
          "ko": "어떠세요, 아직 어지러우세요?"
        }
      },
      {
        "who": "me",
        "text": "Sudah lebih baik, Dok. Sebenarnya saya masih susah tidur.",
        "gloss": {
          "en": "Better, doctor. Actually, I still have trouble sleeping.",
          "ko": "좀 나아졌어요, 선생님. 사실 아직 잠을 잘 못 자요."
        },
        "frames": [
          "id-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Mungkin Anda terlalu banyak kerja.",
        "gloss": {
          "en": "Maybe you're working too much.",
          "ko": "일을 너무 많이 하시는 것 같아요."
        }
      },
      {
        "who": "me",
        "text": "Iya. Kayaknya saya juga kurang minum air.",
        "gloss": {
          "en": "Yes. I guess I don't drink enough water either.",
          "ko": "네. 물도 잘 안 마시는 것 같아요."
        },
        "frames": [
          "id-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Kalau begitu, istirahat yang cukup dan minum air delapan gelas sehari.",
        "gloss": {
          "en": "Then get enough rest and drink eight glasses of water a day.",
          "ko": "그럼 충분히 쉬시고 하루에 물 여덟 잔 드세요."
        }
      },
      {
        "who": "me",
        "text": "Kalau masih pusing minggu depan, saya harus kembali?",
        "gloss": {
          "en": "If I'm still dizzy next week, should I come back?",
          "ko": "다음 주에도 어지러우면 다시 와야 해요?"
        },
        "frames": [
          "id-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Iya, kembali saja kalau belum sembuh.",
        "gloss": {
          "en": "Yes, come back if you're not better.",
          "ko": "네, 안 나으면 다시 오세요."
        }
      },
      {
        "who": "me",
        "text": "Baik, Dok. Bisa tolong tuliskan resepnya?",
        "gloss": {
          "en": "All right. Could you write the prescription, please?",
          "ko": "알겠어요, 선생님. 처방전 써 주실 수 있어요?"
        },
        "frames": [
          "id-f3-05"
        ]
      }
    ]
  },
  {
    "id": "id-3-b11",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Sharing food opinions with a friend",
      "ko": "친구와 음식 취향 이야기"
    },
    "expressions": [
      "menurut saya",
      "sebenarnya"
    ],
    "grammar": [
      2,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Kamu sudah coba sate di Jalan Sabang?",
        "gloss": {
          "en": "Have you tried the satay on Sabang Street?",
          "ko": "사방 거리 사테 먹어 봤어?"
        }
      },
      {
        "who": "me",
        "text": "Sudah. Menurut saya, rasanya biasa saja.",
        "gloss": {
          "en": "Yes. In my opinion, it tastes pretty ordinary.",
          "ko": "응. 내 생각엔 맛이 그냥 그래."
        },
        "frames": [
          "id-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Masa sih? Aku suka banget!",
        "gloss": {
          "en": "Really? I love it!",
          "ko": "진짜? 난 완전 좋던데!"
        }
      },
      {
        "who": "me",
        "text": "Sebenarnya saya kurang suka daging kambing.",
        "gloss": {
          "en": "Actually, I'm not really into goat meat.",
          "ko": "사실 나 염소고기 별로 안 좋아해."
        },
        "frames": [
          "id-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Oh, pantas. Terus kamu suka makan apa?",
        "gloss": {
          "en": "Oh, that explains it. So what do you like to eat?",
          "ko": "아, 그래서구나. 그럼 뭐 좋아해?"
        }
      },
      {
        "who": "me",
        "text": "Yang paling enak itu soto ayam di dekat kantor.",
        "gloss": {
          "en": "The tastiest is the chicken soto near the office.",
          "ko": "제일 맛있는 건 회사 근처 소토 아얌이야."
        },
        "frames": [
          "id-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "Oh ya? Ajak aku kapan-kapan!",
        "gloss": {
          "en": "Really? Take me there sometime!",
          "ko": "그래? 언제 나도 데려가!"
        }
      },
      {
        "who": "me",
        "text": "Oke. Kalau kamu senggang, kita makan siang di sana besok.",
        "gloss": {
          "en": "Okay. If you're free, let's have lunch there tomorrow.",
          "ko": "좋아. 너 시간 되면 내일 거기서 점심 먹자."
        },
        "frames": [
          "id-f3-08"
        ]
      }
    ]
  },
  {
    "id": "id-3-b12",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Planning a group presentation with classmates",
      "ko": "같은 반 친구들과 조별 발표 준비"
    },
    "expressions": [
      "saya setuju"
    ],
    "grammar": [
      0,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Aku mau presentasinya pakai video saja. Gimana?",
        "gloss": {
          "en": "I want to do the presentation with just a video. What do you think?",
          "ko": "발표를 영상으로만 하고 싶은데, 어때?"
        }
      },
      {
        "who": "me",
        "text": "Saya setuju dengan idenya, tapi videonya jangan terlalu panjang.",
        "gloss": {
          "en": "I agree with the idea, but the video shouldn't be too long.",
          "ko": "그 아이디어엔 찬성인데 영상이 너무 길면 안 돼."
        },
        "frames": [
          "id-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Oke. Berapa menit?",
        "gloss": {
          "en": "Okay. How many minutes?",
          "ko": "알았어. 몇 분으로 할까?"
        }
      },
      {
        "who": "me",
        "text": "Lima menit cukup. Menurut kamu, slide-nya perlu juga?",
        "gloss": {
          "en": "Five minutes is enough. What do you think — do we need slides too?",
          "ko": "오 분이면 충분해. 네 생각엔 슬라이드도 필요해?"
        },
        "frames": [
          "id-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "Perlu, untuk datanya. Siapa yang bikin?",
        "gloss": {
          "en": "Yes, for the data. Who's making them?",
          "ko": "필요해, 데이터 때문에. 누가 만들래?"
        }
      },
      {
        "who": "me",
        "text": "Saya saja. Bisa tolong kirimkan datanya ke saya?",
        "gloss": {
          "en": "I'll do it. Could you send me the data?",
          "ko": "내가 할게. 데이터 좀 보내 줄래?"
        },
        "frames": [
          "id-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Bisa, nanti malam aku kirim.",
        "gloss": {
          "en": "Sure, I'll send it tonight.",
          "ko": "응, 오늘 밤에 보낼게."
        }
      },
      {
        "who": "me",
        "text": "Oke. Kalau sudah dikirim, nanti saya cek.",
        "gloss": {
          "en": "Okay. Once it's been sent, I'll check it.",
          "ko": "좋아. 보내 주면 내가 확인할게."
        },
        "frames": [
          "id-f3-08",
          "id-f3-11"
        ]
      }
    ]
  },
  {
    "id": "id-3-b13",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Viewing a room for rent",
      "ko": "하숙방 보러 가기"
    },
    "expressions": [
      "ada masalah"
    ],
    "grammar": [
      0,
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ini kamarnya. Sudah dibersihkan kemarin.",
        "gloss": {
          "en": "This is the room. It was cleaned yesterday.",
          "ko": "이 방이에요. 어제 청소했어요."
        }
      },
      {
        "who": "me",
        "text": "Kamarnya lebih luas daripada yang di foto.",
        "gloss": {
          "en": "The room is bigger than in the photo.",
          "ko": "방이 사진보다 더 넓네요."
        },
        "frames": [
          "id-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Iya. Listrik dan air sudah termasuk.",
        "gloss": {
          "en": "Yes. Electricity and water are included.",
          "ko": "네. 전기랑 수도는 포함이에요."
        }
      },
      {
        "who": "me",
        "text": "Kalau internetnya, sudah dipasang?",
        "gloss": {
          "en": "And the internet — has it been installed?",
          "ko": "인터넷은 설치돼 있어요?"
        },
        "frames": [
          "id-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Sudah, Kak. Kecepatannya lumayan.",
        "gloss": {
          "en": "Yes. The speed is decent.",
          "ko": "네. 속도도 괜찮아요."
        }
      },
      {
        "who": "me",
        "text": "Tapi ada masalah dengan jendelanya, Bu. Tidak bisa ditutup.",
        "gloss": {
          "en": "But there's a problem with the window. It won't close.",
          "ko": "그런데 창문에 문제가 있어요. 안 닫혀요."
        },
        "frames": [
          "id-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Oh, nanti saya perbaiki besok.",
        "gloss": {
          "en": "Oh, I'll fix it tomorrow.",
          "ko": "아, 내일 고쳐 둘게요."
        }
      },
      {
        "who": "me",
        "text": "Oke. Kalau sudah diperbaiki, saya pindah minggu ini.",
        "gloss": {
          "en": "Okay. Once it's been fixed, I'll move in this week.",
          "ko": "좋아요. 고쳐지면 이번 주에 이사 올게요."
        },
        "frames": [
          "id-f3-08"
        ]
      }
    ]
  },
  {
    "id": "id-3-b14",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Telling a friend you missed your flight",
      "ko": "친구에게 비행기 놓친 이야기"
    },
    "expressions": [
      "terus",
      "untungnya",
      "sayangnya",
      "ternyata"
    ],
    "grammar": [
      0,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Katanya kemarin kamu ketinggalan pesawat?",
        "gloss": {
          "en": "I heard you missed your flight yesterday?",
          "ko": "어제 비행기 놓쳤다며?"
        }
      },
      {
        "who": "me",
        "text": "Iya. Ternyata jadwalnya diganti ke jam enam pagi.",
        "gloss": {
          "en": "Yes. It turned out the schedule had been changed to six in the morning.",
          "ko": "응. 알고 보니 일정이 아침 여섯 시로 바뀌었더라."
        },
        "frames": [
          "id-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "Waduh! Terus gimana?",
        "gloss": {
          "en": "Oh no! So what happened?",
          "ko": "헐! 그래서 어떻게 했어?"
        }
      },
      {
        "who": "me",
        "text": "Terus, aku langsung ke loket maskapai.",
        "gloss": {
          "en": "Then I went straight to the airline counter.",
          "ko": "그래서 바로 항공사 카운터로 갔지."
        },
        "frames": [
          "id-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "Dapat tiket baru?",
        "gloss": {
          "en": "Did you get a new ticket?",
          "ko": "새 표는 구했어?"
        }
      },
      {
        "who": "me",
        "text": "Untungnya, masih ada kursi di penerbangan siang.",
        "gloss": {
          "en": "Luckily, there was still a seat on the afternoon flight.",
          "ko": "다행히 오후 비행기에 자리가 있었어."
        },
        "frames": [
          "id-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "Syukurlah. Tapi bayar lagi?",
        "gloss": {
          "en": "Thank goodness. But did you have to pay again?",
          "ko": "다행이다. 근데 돈 또 냈어?"
        }
      },
      {
        "who": "me",
        "text": "Sayangnya, aku harus bayar tiga ratus ribu lagi.",
        "gloss": {
          "en": "Unfortunately, I had to pay another three hundred thousand.",
          "ko": "아쉽게도 삼십만 루피아를 더 내야 했어."
        },
        "frames": [
          "id-f3-16"
        ]
      }
    ]
  },
  {
    "id": "id-3-b15",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "You left your umbrella at a friend's place",
      "ko": "친구 집에 우산을 두고 옴"
    },
    "expressions": [
      "kayaknya",
      "sama saja"
    ],
    "grammar": [
      1,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Halo! Ada apa?",
        "gloss": {
          "en": "Hello! What's up?",
          "ko": "여보세요! 무슨 일이야?"
        }
      },
      {
        "who": "me",
        "text": "Kayaknya payungku tertinggal di rumahmu tadi.",
        "gloss": {
          "en": "I think I left my umbrella at your place earlier.",
          "ko": "아까 너희 집에 우산 두고 온 것 같아."
        },
        "frames": [
          "id-f3-02",
          "id-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "Sebentar, aku lihat. Payung hijau?",
        "gloss": {
          "en": "Hang on, let me look. A green umbrella?",
          "ko": "잠깐, 볼게. 초록색 우산?"
        }
      },
      {
        "who": "me",
        "text": "Iya, itu! Bisa tolong simpankan dulu?",
        "gloss": {
          "en": "Yes, that's it! Could you keep it for now?",
          "ko": "응, 그거! 일단 좀 맡아 줄래?"
        },
        "frames": [
          "id-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Bisa. Mau diambil kapan?",
        "gloss": {
          "en": "Sure. When do you want to pick it up?",
          "ko": "그래. 언제 가지러 올래?"
        }
      },
      {
        "who": "me",
        "text": "Waktu pulang kerja besok, aku mampir, ya.",
        "gloss": {
          "en": "I'll drop by tomorrow on my way home from work.",
          "ko": "내일 퇴근길에 들를게."
        },
        "frames": [
          "id-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Oke. Atau aku antarkan saja?",
        "gloss": {
          "en": "Okay. Or shall I just bring it to you?",
          "ko": "알았어. 아니면 내가 갖다줄까?"
        }
      },
      {
        "who": "me",
        "text": "Nggak usah, sama saja. Aku memang lewat situ.",
        "gloss": {
          "en": "No need, it's all the same. I go past there anyway.",
          "ko": "괜찮아, 어차피 똑같아. 나 원래 거기 지나가."
        }
      }
    ]
  },
  {
    "id": "id-3-b16",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Signing up for a language course",
      "ko": "어학원 수강 신청"
    },
    "expressions": [],
    "grammar": [
      2,
      3,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Kami punya kelas pagi dan kelas malam.",
        "gloss": {
          "en": "We have morning classes and evening classes.",
          "ko": "오전반과 저녁반이 있어요."
        }
      },
      {
        "who": "me",
        "text": "Saya mau yang kelas malam, karena saya kerja pagi.",
        "gloss": {
          "en": "I'd like the evening class, because I work in the mornings.",
          "ko": "저녁반으로 하고 싶어요, 오전에 일하거든요."
        },
        "frames": [
          "id-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "Kelas malam ada dua: hari Senin dan hari Kamis.",
        "gloss": {
          "en": "There are two evening classes: Monday and Thursday.",
          "ko": "저녁반은 월요일반과 목요일반 두 개예요."
        }
      },
      {
        "who": "me",
        "text": "Yang paling sepi itu kelas yang mana?",
        "gloss": {
          "en": "Which class is the least crowded?",
          "ko": "제일 한산한 반은 어디예요?"
        },
        "frames": [
          "id-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "Hari Kamis. Kelas Senin lebih ramai.",
        "gloss": {
          "en": "Thursday. The Monday class is busier.",
          "ko": "목요일이요. 월요일반이 더 붐벼요."
        }
      },
      {
        "who": "me",
        "text": "Kalau begitu, hari Kamis lebih cocok daripada hari Senin.",
        "gloss": {
          "en": "In that case, Thursday suits me better than Monday.",
          "ko": "그럼 월요일보다 목요일이 더 맞겠네요."
        },
        "frames": [
          "id-f3-08",
          "id-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Baik. Pembayarannya hari ini, ya.",
        "gloss": {
          "en": "All right. Payment is due today.",
          "ko": "네. 결제는 오늘 해 주세요."
        }
      },
      {
        "who": "me",
        "text": "Bisa tolong kirimkan nomor rekeningnya?",
        "gloss": {
          "en": "Could you send me the account number?",
          "ko": "계좌 번호 보내 주실 수 있어요?"
        },
        "frames": [
          "id-f3-05"
        ]
      }
    ]
  },
  {
    "id": "id-3-b17",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Asking a neighbour to turn the music down",
      "ko": "이웃에게 음악 소리 줄여 달라고 부탁"
    },
    "expressions": [
      "menurut saya",
      "sebenarnya",
      "saya setuju",
      "lebih baik"
    ],
    "grammar": [
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Eh, selamat malam. Ada apa, ya?",
        "gloss": {
          "en": "Oh, good evening. What's the matter?",
          "ko": "아, 안녕하세요. 무슨 일이세요?"
        }
      },
      {
        "who": "me",
        "text": "Selamat malam, Pak. Maaf mengganggu. Sebenarnya suara musiknya agak keras.",
        "gloss": {
          "en": "Good evening. Sorry to bother you. Actually, the music is a bit loud.",
          "ko": "안녕하세요. 방해해서 죄송해요. 사실 음악 소리가 좀 커서요."
        },
        "frames": [
          "id-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Oh, maaf! Saya tidak sadar.",
        "gloss": {
          "en": "Oh, sorry! I didn't realise.",
          "ko": "아, 죄송해요! 몰랐어요."
        }
      },
      {
        "who": "me",
        "text": "Tidak apa-apa. Kalau bisa, musiknya dikecilkan sedikit.",
        "gloss": {
          "en": "That's all right. If possible, please turn it down a little.",
          "ko": "괜찮아요. 가능하면 소리를 조금만 줄여 주세요."
        },
        "frames": [
          "id-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Tentu. Besok saya ada pesta kecil, boleh sampai jam sepuluh?",
        "gloss": {
          "en": "Of course. I'm having a small party tomorrow — is ten o'clock all right?",
          "ko": "물론이죠. 내일 작은 파티가 있는데 열 시까지 괜찮을까요?"
        }
      },
      {
        "who": "me",
        "text": "Saya setuju, tapi jangan lewat jam sepuluh, ya.",
        "gloss": {
          "en": "I agree, but not past ten, please.",
          "ko": "좋아요, 대신 열 시는 넘기지 말아 주세요."
        },
        "frames": [
          "id-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Siap. Terima kasih sudah bilang langsung.",
        "gloss": {
          "en": "Sure. Thanks for telling me directly.",
          "ko": "알겠어요. 직접 말해 줘서 고마워요."
        }
      },
      {
        "who": "me",
        "text": "Sama-sama. Menurut saya, lebih baik begitu.",
        "gloss": {
          "en": "You're welcome. I think it's better that way.",
          "ko": "천만에요. 제 생각엔 그게 더 나아요."
        },
        "frames": [
          "id-f3-01"
        ]
      }
    ]
  },
  {
    "id": "id-3-b18",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Discussing a novel at a book club",
      "ko": "독서 모임에서 소설 이야기"
    },
    "expressions": [
      "kayaknya",
      "ternyata",
      "lumayan"
    ],
    "grammar": [
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Bukunya sudah selesai dibaca?",
        "gloss": {
          "en": "Have you finished the book?",
          "ko": "책 다 읽었어?"
        }
      },
      {
        "who": "me",
        "text": "Sudah. Ternyata akhirnya sedih sekali.",
        "gloss": {
          "en": "Yes. The ending turned out to be really sad.",
          "ko": "응. 알고 보니 결말이 엄청 슬프더라."
        },
        "frames": [
          "id-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "Iya. Menurutmu, tokoh utamanya salah?",
        "gloss": {
          "en": "Yes. Do you think the main character was wrong?",
          "ko": "그치. 네 생각엔 주인공이 잘못한 것 같아?"
        }
      },
      {
        "who": "me",
        "text": "Kayaknya dia tidak punya pilihan.",
        "gloss": {
          "en": "I guess she didn't have a choice.",
          "ko": "그 사람은 선택의 여지가 없었던 것 같아."
        },
        "frames": [
          "id-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Hmm, aku kurang setuju. Dia bisa pergi lebih awal.",
        "gloss": {
          "en": "Hmm, I don't quite agree. She could have left earlier.",
          "ko": "음, 난 좀 생각이 달라. 더 일찍 떠날 수도 있었잖아."
        }
      },
      {
        "who": "me",
        "text": "Menurut kamu, bukunya lebih bagus daripada filmnya?",
        "gloss": {
          "en": "What do you think — is the book better than the film?",
          "ko": "네 생각엔 책이 영화보다 더 나아?"
        },
        "frames": [
          "id-f3-18",
          "id-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Jelas! Filmnya terlalu pendek.",
        "gloss": {
          "en": "Definitely! The film is too short.",
          "ko": "당연하지! 영화는 너무 짧아."
        }
      },
      {
        "who": "me",
        "text": "Iya, lumayan. Bulan depan kita baca buku apa?",
        "gloss": {
          "en": "Yeah, fair enough. What book are we reading next month?",
          "ko": "응, 그렇긴 해. 다음 달엔 무슨 책 읽어?"
        }
      }
    ]
  },
  {
    "id": "id-3-b19",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "The ATM swallowed your card",
      "ko": "현금인출기가 카드를 삼킴"
    },
    "expressions": [
      "ada masalah",
      "sudah saya cek"
    ],
    "grammar": [
      0,
      1,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat pagi. Ada yang bisa dibantu?",
        "gloss": {
          "en": "Good morning. How can I help you?",
          "ko": "안녕하세요. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Pagi, Bu. Ada masalah dengan kartu ATM saya. Kartunya tertelan mesin.",
        "gloss": {
          "en": "Good morning. There's a problem with my bank card. The machine swallowed it.",
          "ko": "안녕하세요. 현금카드에 문제가 있어요. 기계가 카드를 먹어 버렸어요."
        },
        "frames": [
          "id-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Oh. Di ATM yang mana, Kak?",
        "gloss": {
          "en": "Oh. Which ATM?",
          "ko": "아. 어느 현금인출기요?"
        }
      },
      {
        "who": "me",
        "text": "Di ATM depan kantor ini, tadi malam.",
        "gloss": {
          "en": "The ATM in front of this branch, last night.",
          "ko": "이 지점 앞 현금인출기요, 어젯밤에요."
        }
      },
      {
        "who": "them",
        "text": "Baik. Kartunya sudah diblokir?",
        "gloss": {
          "en": "All right. Has the card been blocked?",
          "ko": "네. 카드는 정지하셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Sudah, lewat aplikasi. Saldonya juga sudah saya cek, aman.",
        "gloss": {
          "en": "Yes, through the app. I've checked the balance too — it's fine.",
          "ko": "네, 앱으로요. 잔액도 확인했는데 괜찮아요."
        },
        "frames": [
          "id-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Bagus. Kartunya bisa diambil tiga hari lagi.",
        "gloss": {
          "en": "Good. You can collect the card in three days.",
          "ko": "좋아요. 카드는 사흘 뒤에 찾으실 수 있어요."
        }
      },
      {
        "who": "me",
        "text": "Tiga hari? Bisa tolong buatkan kartu baru hari ini saja?",
        "gloss": {
          "en": "Three days? Could you just make me a new card today?",
          "ko": "사흘이요? 그냥 오늘 새 카드를 만들어 주실 수 있어요?"
        },
        "frames": [
          "id-f3-05"
        ]
      }
    ]
  },
  {
    "id": "id-3-b20",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Buying souvenirs for your mother",
      "ko": "어머니께 드릴 기념품 사기"
    },
    "expressions": [
      "kayaknya"
    ],
    "grammar": [
      2,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Cari oleh-oleh, Kak?",
        "gloss": {
          "en": "Looking for souvenirs?",
          "ko": "기념품 찾으세요?"
        }
      },
      {
        "who": "me",
        "text": "Iya. Saya mau yang khas Yogyakarta.",
        "gloss": {
          "en": "Yes. I'd like something typical of Yogyakarta.",
          "ko": "네. 족자카르타다운 걸로 사고 싶어요."
        },
        "frames": [
          "id-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "Ada batik, ada bakpia. Yang paling laris itu bakpia.",
        "gloss": {
          "en": "There's batik and there's bakpia. Bakpia sells best.",
          "ko": "바틱도 있고 박피아도 있어요. 박피아가 제일 잘 팔려요."
        }
      },
      {
        "who": "me",
        "text": "Kayaknya ibu saya lebih suka batik.",
        "gloss": {
          "en": "I think my mother would prefer batik.",
          "ko": "저희 어머니는 바틱을 더 좋아하실 것 같아요."
        },
        "frames": [
          "id-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Kalau batik, yang ini bagus. Warnanya lembut.",
        "gloss": {
          "en": "For batik, this one is nice. The colours are soft.",
          "ko": "바틱이라면 이게 좋아요. 색이 은은해요."
        }
      },
      {
        "who": "me",
        "text": "Wah, bagus. Yang paling murah itu yang mana?",
        "gloss": {
          "en": "Oh, nice. Which one is the cheapest?",
          "ko": "와, 예쁘네요. 제일 싼 건 어떤 거예요?"
        },
        "frames": [
          "id-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "Yang biru, seratus lima puluh ribu.",
        "gloss": {
          "en": "The blue one, one hundred fifty thousand.",
          "ko": "파란 거요, 십오만 루피아예요."
        }
      },
      {
        "who": "me",
        "text": "Oke, saya ambil yang biru. Bisa tolong bungkuskan?",
        "gloss": {
          "en": "Okay, I'll take the blue one. Could you wrap it?",
          "ko": "네, 파란 걸로 할게요. 포장해 주실 수 있어요?"
        },
        "frames": [
          "id-f3-05"
        ]
      }
    ]
  }
];
