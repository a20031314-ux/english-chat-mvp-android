import type { StageScript } from "../stageScripts.ts";

/** id 단계 대본(curriculum/stageScripts.ts) — 상황 대본 + 표현·문법 대본(x), 1~3단계 내 줄에 틀 태그. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
export const ID: StageScript[] = [
  {
    "id": "id-1-1",
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
    "stage": 1,
    "situation": 0,
    "setting": {
      "en": "First day of an Indonesian class: meeting Dewi, a classmate",
      "ko": "인도네시아어 수업 첫날, 같은 반 데위와 인사하기"
    },
    "expressions": [
      "selamat pagi",
      "nama saya",
      "senang bertemu",
      "terima kasih"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat pagi! Nama saya Dewi. Nama kamu siapa?",
        "gloss": {
          "en": "Good morning! My name is Dewi. What's your name?",
          "ko": "좋은 아침! 내 이름은 데위야. 너는 이름이 뭐야?"
        }
      },
      {
        "who": "me",
        "text": "Selamat pagi, Dewi. Nama saya Ji-woo.",
        "gloss": {
          "en": "Good morning, Dewi. My name is Ji-woo.",
          "ko": "안녕, 데위. 내 이름은 지우야."
        },
        "frames": [
          "id-f1-05",
          "id-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "Senang bertemu, Ji-woo. Kamu dari mana?",
        "gloss": {
          "en": "Nice to meet you, Ji-woo. Where are you from?",
          "ko": "반가워, 지우. 어디서 왔어?"
        }
      },
      {
        "who": "me",
        "text": "Senang bertemu juga. Saya dari Korea.",
        "gloss": {
          "en": "Nice to meet you too. I'm from Korea.",
          "ko": "나도 반가워. 나는 한국에서 왔어."
        },
        "frames": [
          "id-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "Oh, Korea! Kamu mahasiswa?",
        "gloss": {
          "en": "Oh, Korea! Are you a university student?",
          "ko": "오, 한국! 너 대학생이야?"
        }
      },
      {
        "who": "me",
        "text": "Bukan, saya bukan mahasiswa. Saya perawat.",
        "gloss": {
          "en": "No, I'm not a student. I'm a nurse.",
          "ko": "아니, 대학생 아니야. 나는 간호사야."
        },
        "frames": [
          "id-f1-12",
          "id-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "Oh, begitu. Eh, itu tas siapa?",
        "gloss": {
          "en": "Oh, I see. Hey, whose bag is that?",
          "ko": "아, 그렇구나. 어, 저거 누구 가방이야?"
        }
      },
      {
        "who": "me",
        "text": "Oh, itu tas saya. Terima kasih!",
        "gloss": {
          "en": "Oh, that's my bag. Thank you!",
          "ko": "아, 그거 내 가방이야. 고마워!"
        },
        "frames": [
          "id-f1-14",
          "id-f1-06"
        ]
      }
    ]
  },
  {
    "id": "id-1-2",
    "stage": 1,
    "situation": 1,
    "setting": {
      "en": "At a fruit stall in a traditional market, buying from the seller",
      "ko": "전통 시장 과일 노점에서 아주머니에게 과일 사기"
    },
    "expressions": [
      "selamat siang",
      "berapa harganya",
      "maaf",
      "saya tidak mengerti",
      "pelan-pelan saja",
      "saya mau ini"
    ],
    "grammar": [
      3,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat siang! Mau beli apa?",
        "gloss": {
          "en": "Good afternoon! What would you like to buy?",
          "ko": "안녕하세요! 뭐 사시려고요?"
        }
      },
      {
        "who": "me",
        "text": "Selamat siang, Bu. Itu buah apa?",
        "gloss": {
          "en": "Good afternoon, ma'am. What fruit is that?",
          "ko": "안녕하세요. 그건 무슨 과일이에요?"
        },
        "frames": [
          "id-f1-05",
          "id-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Ini manggis. Manis sekali!",
        "gloss": {
          "en": "This is mangosteen. It's really sweet!",
          "ko": "이건 망고스틴이에요. 엄청 달아요!"
        }
      },
      {
        "who": "me",
        "text": "Berapa harganya satu kilo?",
        "gloss": {
          "en": "How much is it for one kilo?",
          "ko": "1킬로에 얼마예요?"
        },
        "frames": [
          "id-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Tiga puluh ribu sekilo, Kak.",
        "gloss": {
          "en": "Thirty thousand a kilo.",
          "ko": "1킬로에 3만 루피아예요."
        }
      },
      {
        "who": "me",
        "text": "Maaf, saya tidak mengerti. Pelan-pelan saja.",
        "gloss": {
          "en": "Sorry, I don't understand. Slowly, please.",
          "ko": "죄송해요, 못 알아들었어요. 천천히 말해 주세요."
        },
        "frames": [
          "id-f1-19",
          "id-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Tiga... puluh... ribu. Satu kilo, tiga puluh ribu.",
        "gloss": {
          "en": "Thirty... thousand. One kilo, thirty thousand.",
          "ko": "삼만... 루피아요. 1킬로에 삼만 루피아."
        }
      },
      {
        "who": "me",
        "text": "Oke. Saya mau ini, satu kilo.",
        "gloss": {
          "en": "Okay. I'll take these, one kilo.",
          "ko": "네. 이걸로 1킬로 주세요."
        },
        "frames": [
          "id-f1-10",
          "id-f1-20"
        ]
      }
    ]
  },
  {
    "id": "id-1-3",
    "stage": 1,
    "situation": 2,
    "setting": {
      "en": "In a shopping mall, asking a security guard for directions",
      "ko": "쇼핑몰에서 경비원에게 길 묻기"
    },
    "expressions": [
      "permisi",
      "toiletnya di mana",
      "maaf",
      "sekali lagi",
      "terima kasih"
    ],
    "grammar": [
      4,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat malam, Kak. Ada yang bisa saya bantu?",
        "gloss": {
          "en": "Good evening. Can I help you?",
          "ko": "안녕하세요. 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Permisi, Pak. Toiletnya di mana?",
        "gloss": {
          "en": "Excuse me, sir. Where's the toilet?",
          "ko": "실례합니다. 화장실이 어디예요?"
        },
        "frames": [
          "id-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Toiletnya di lantai tiga, dekat bioskop.",
        "gloss": {
          "en": "The toilet is on the third floor, near the cinema.",
          "ko": "화장실은 3층, 영화관 근처에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Maaf, sekali lagi, Pak?",
        "gloss": {
          "en": "Sorry, once more, sir?",
          "ko": "죄송한데 한 번 더 말씀해 주시겠어요?"
        },
        "frames": [
          "id-f1-19"
        ]
      },
      {
        "who": "them",
        "text": "Di lantai tiga, Kak. Naik lift itu.",
        "gloss": {
          "en": "On the third floor. Take that lift.",
          "ko": "3층이요. 저 엘리베이터 타세요."
        }
      },
      {
        "who": "me",
        "text": "Oh, lantai tiga. Ada ATM di sana?",
        "gloss": {
          "en": "Oh, the third floor. Is there an ATM there?",
          "ko": "아, 3층이요. 거기 현금인출기 있어요?"
        },
        "frames": [
          "id-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Ada, di sebelah kiri lift.",
        "gloss": {
          "en": "Yes, to the left of the lift.",
          "ko": "있어요, 엘리베이터 왼쪽에요."
        }
      },
      {
        "who": "me",
        "text": "Terima kasih banyak, Pak.",
        "gloss": {
          "en": "Thank you very much, sir.",
          "ko": "정말 감사합니다."
        },
        "frames": [
          "id-f1-06"
        ]
      }
    ]
  },
  {
    "id": "id-1-4",
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
    "stage": 1,
    "situation": 3,
    "setting": {
      "en": "Checking in at a small guesthouse in the evening",
      "ko": "저녁에 작은 게스트하우스에 체크인하기"
    },
    "expressions": [
      "kabar baik",
      "terima kasih",
      "nama saya",
      "tidak apa-apa",
      "selamat malam"
    ],
    "grammar": [
      1,
      2,
      3,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat malam! Selamat datang. Apa kabar?",
        "gloss": {
          "en": "Good evening! Welcome. How are you?",
          "ko": "안녕하세요! 어서 오세요. 잘 지내셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Kabar baik, terima kasih. Nama saya Ji-woo.",
        "gloss": {
          "en": "I'm fine, thank you. My name is Ji-woo.",
          "ko": "잘 지내요, 감사합니다. 제 이름은 지우예요."
        },
        "frames": [
          "id-f1-01",
          "id-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Oh ya, Ji-woo dari Korea, ya? Dua malam?",
        "gloss": {
          "en": "Ah yes, Ji-woo from Korea, right? Two nights?",
          "ko": "아, 한국에서 온 지우 씨죠? 2박이요?"
        }
      },
      {
        "who": "me",
        "text": "Ya, dua malam. Ini paspor saya.",
        "gloss": {
          "en": "Yes, two nights. Here's my passport.",
          "ko": "네, 2박이요. 이건 제 여권이에요."
        },
        "frames": [
          "id-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "Terima kasih. Kamarnya nomor tujuh, di lantai dua.",
        "gloss": {
          "en": "Thank you. Your room is number seven, on the second floor.",
          "ko": "감사합니다. 방은 7호, 2층이에요."
        }
      },
      {
        "who": "me",
        "text": "Di lantai dua? Ada lift?",
        "gloss": {
          "en": "On the second floor? Is there a lift?",
          "ko": "2층이요? 엘리베이터 있어요?"
        },
        "frames": [
          "id-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Maaf, tidak ada lift. Tangganya di sana.",
        "gloss": {
          "en": "Sorry, there's no lift. The stairs are over there.",
          "ko": "죄송해요, 엘리베이터는 없어요. 계단은 저쪽이에요."
        }
      },
      {
        "who": "me",
        "text": "Tidak apa-apa. Selamat malam, Bu!",
        "gloss": {
          "en": "That's okay. Good night, ma'am!",
          "ko": "괜찮아요. 안녕히 주무세요!"
        },
        "frames": [
          "id-f1-05"
        ]
      }
    ]
  },
  {
    "id": "id-1-x1",
    "stage": 1,
    "setting": {
      "en": "Meeting your neighbour Pak Budi in the morning",
      "ko": "아침에 이웃 부디 아저씨를 만나기"
    },
    "expressions": [
      "sama-sama",
      "apa kabar",
      "sampai jumpa"
    ],
    "grammar": [
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat pagi! Ini payung kamu, ya? Terima kasih, ya.",
        "gloss": {
          "en": "Good morning! This is your umbrella, right? Thanks.",
          "ko": "좋은 아침! 이거 네 우산이지? 고마웠어."
        }
      },
      {
        "who": "me",
        "text": "Pagi, Pak Budi. Sama-sama. Apa kabar?",
        "gloss": {
          "en": "Morning, Pak Budi. You're welcome. How are you?",
          "ko": "안녕하세요, 부디 아저씨. 천만에요. 잘 지내세요?"
        }
      },
      {
        "who": "them",
        "text": "Baik. Kamu mau ke mana?",
        "gloss": {
          "en": "Good. Where are you going?",
          "ko": "잘 지내. 너 어디 가?"
        }
      },
      {
        "who": "me",
        "text": "Saya mau ke pasar. Bapak?",
        "gloss": {
          "en": "I'm going to the market. And you?",
          "ko": "시장에 가요. 아저씨는요?"
        },
        "frames": [
          "id-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Saya ke kantor. Sampai jumpa, ya!",
        "gloss": {
          "en": "I'm off to the office. See you!",
          "ko": "나는 회사 가. 또 보자!"
        }
      },
      {
        "who": "me",
        "text": "Ya, sampai jumpa nanti, Pak!",
        "gloss": {
          "en": "Yes, see you later!",
          "ko": "네, 이따 봬요!"
        },
        "frames": [
          "id-f1-18"
        ]
      }
    ]
  },
  {
    "id": "id-1-x2",
    "stage": 1,
    "setting": {
      "en": "At a small café, ordering when you can't read the menu",
      "ko": "작은 카페에서 메뉴를 못 읽어 주문하기"
    },
    "expressions": [
      "tidak apa-apa",
      "tolong",
      "terima kasih"
    ],
    "grammar": [
      3,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Silakan, mau pesan apa?",
        "gloss": {
          "en": "Go ahead, what would you like to order?",
          "ko": "어서 오세요, 뭐 주문하시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "Ada menu bahasa Inggris?",
        "gloss": {
          "en": "Is there an English menu?",
          "ko": "영어 메뉴 있어요?"
        },
        "frames": [
          "id-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Maaf, tidak ada. Menunya cuma bahasa Indonesia.",
        "gloss": {
          "en": "Sorry, there isn't. The menu is only in Indonesian.",
          "ko": "죄송해요, 없어요. 메뉴는 인도네시아어로만 있어요."
        }
      },
      {
        "who": "me",
        "text": "Oh, tidak apa-apa. Ini apa?",
        "gloss": {
          "en": "Oh, that's okay. What's this?",
          "ko": "아, 괜찮아요. 이건 뭐예요?"
        },
        "frames": [
          "id-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Itu nasi uduk. Nasi dengan santan.",
        "gloss": {
          "en": "That's nasi uduk. Rice cooked in coconut milk.",
          "ko": "그건 나시 우둑이에요. 코코넛 밀크로 지은 밥이에요."
        }
      },
      {
        "who": "me",
        "text": "Tolong tulis namanya di sini. Terima kasih!",
        "gloss": {
          "en": "Please write its name here. Thank you!",
          "ko": "이름을 여기에 써 주세요. 감사합니다!"
        },
        "frames": [
          "id-f1-11",
          "id-f1-06"
        ]
      }
    ]
  },
  {
    "id": "id-2-1",
    "stage": 2,
    "situation": 0,
    "setting": {
      "en": "Chatting with a friend to make weekend plans",
      "ko": "친구와 메신저로 주말 약속 잡기"
    },
    "expressions": [
      "lagi apa",
      "belum",
      "nanti",
      "besok",
      "ayo",
      "ketemu di mana",
      "oke deh",
      "seru banget"
    ],
    "grammar": [
      0,
      2,
      3,
      5
    ],
    "earlierGrammar": [
      "1:6"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Hai! Aku baru pulang kerja nih. Capek!",
        "gloss": {
          "en": "Hi! I just got home from work. So tired!",
          "ko": "안녕! 나 방금 퇴근했어. 피곤해!"
        }
      },
      {
        "who": "me",
        "text": "Wah, kasihan. Sekarang lagi apa?",
        "gloss": {
          "en": "Aw, poor you. What are you up to now?",
          "ko": "아이고, 고생했네. 지금 뭐 해?"
        },
        "frames": [
          "id-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Lagi makan mi. Kamu udah makan?",
        "gloss": {
          "en": "Eating noodles. Have you eaten?",
          "ko": "라면 먹는 중. 너는 밥 먹었어?"
        }
      },
      {
        "who": "me",
        "text": "Belum, nanti aja. Eh, besok kamu ada acara?",
        "gloss": {
          "en": "Not yet, later. Hey, do you have plans tomorrow?",
          "ko": "아직, 이따 먹을래. 근데 내일 약속 있어?"
        },
        "frames": [
          "id-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Nggak ada. Kenapa?",
        "gloss": {
          "en": "No. Why?",
          "ko": "없어. 왜?"
        }
      },
      {
        "who": "me",
        "text": "Ayo ke pantai! Aku ingin berenang.",
        "gloss": {
          "en": "Let's go to the beach! I want to swim.",
          "ko": "해변 가자! 나 수영하고 싶어."
        },
        "frames": [
          "id-f2-06",
          "id-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Boleh banget! Kita berangkat jam berapa?",
        "gloss": {
          "en": "Sure thing! What time do we leave?",
          "ko": "완전 좋아! 몇 시에 출발해?"
        }
      },
      {
        "who": "me",
        "text": "Jam tujuh aja. Ketemu di mana?",
        "gloss": {
          "en": "Let's say seven. Where shall we meet?",
          "ko": "7시로 하자. 어디서 만날까?"
        },
        "frames": [
          "id-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "Di stasiun aja, ya. Aku tunggu di depan.",
        "gloss": {
          "en": "At the station, okay? I'll wait out front.",
          "ko": "역에서 보자. 내가 앞에서 기다릴게."
        }
      },
      {
        "who": "me",
        "text": "Oke deh. Pasti seru banget!",
        "gloss": {
          "en": "Okay then. It's going to be so much fun!",
          "ko": "알았어. 진짜 재밌겠다!"
        },
        "frames": [
          "id-f2-19"
        ]
      }
    ]
  },
  {
    "id": "id-2-2",
    "stage": 2,
    "situation": 1,
    "setting": {
      "en": "Ordering lunch at a warung, a small local eatery",
      "ko": "와룽(작은 식당)에서 점심 주문하기"
    },
    "expressions": [
      "nggak pedas ya",
      "makan di sini",
      "boleh",
      "belum",
      "bungkus",
      "nanti"
    ],
    "grammar": [
      0,
      3,
      4,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Silakan, Kak. Mau pesan apa?",
        "gloss": {
          "en": "Go ahead. What would you like?",
          "ko": "어서 오세요. 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Saya pesan nasi goreng satu, nggak pedas ya.",
        "gloss": {
          "en": "I'll have one fried rice, not spicy, please.",
          "ko": "나시고렝 하나요, 안 맵게 해 주세요."
        },
        "frames": [
          "id-f2-13",
          "id-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Oke. Makan di sini atau bungkus?",
        "gloss": {
          "en": "Okay. Eat here or take away?",
          "ko": "네. 드시고 가세요, 포장이에요?"
        }
      },
      {
        "who": "me",
        "text": "Makan di sini, Bu. Boleh saya duduk di situ?",
        "gloss": {
          "en": "Eat here, ma'am. May I sit over there?",
          "ko": "먹고 갈게요. 저기 앉아도 돼요?"
        },
        "frames": [
          "id-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Boleh, silakan. Minumnya apa?",
        "gloss": {
          "en": "Sure, go ahead. What would you like to drink?",
          "ko": "그럼요, 앉으세요. 음료는요?"
        }
      },
      {
        "who": "me",
        "text": "Es teh manis. Saya belum pernah coba es cendol. Enak?",
        "gloss": {
          "en": "Sweet iced tea. I've never tried es cendol. Is it good?",
          "ko": "달콤한 아이스티요. 에스 첸돌은 아직 안 먹어 봤는데, 맛있어요?"
        },
        "frames": [
          "id-f2-10",
          "id-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Enak sekali! Mau coba?",
        "gloss": {
          "en": "It's delicious! Want to try it?",
          "ko": "엄청 맛있어요! 드셔 보실래요?"
        }
      },
      {
        "who": "me",
        "text": "Mau, Bu. Cendolnya bungkus aja, untuk nanti.",
        "gloss": {
          "en": "Yes please. Wrap the cendol to go, for later.",
          "ko": "네, 첸돌은 포장해 주세요, 이따 먹게요."
        }
      },
      {
        "who": "them",
        "text": "Siap. Semuanya tiga puluh lima ribu.",
        "gloss": {
          "en": "Sure. That's thirty-five thousand altogether.",
          "ko": "네. 전부 3만 5천 루피아예요."
        }
      },
      {
        "who": "me",
        "text": "Saya bayar sekarang ya, Bu, karena saya buru-buru.",
        "gloss": {
          "en": "I'll pay now, ma'am, because I'm in a hurry.",
          "ko": "지금 계산할게요, 좀 바빠서요."
        },
        "frames": [
          "id-f2-09"
        ]
      }
    ]
  },
  {
    "id": "id-2-3",
    "stage": 2,
    "situation": 2,
    "setting": {
      "en": "Taking an online motorbike taxi (ojek) to the station",
      "ko": "앱으로 부른 오토바이 택시(오젝)로 역에 가기"
    },
    "expressions": [
      "minta tolong",
      "sudah",
      "belum",
      "seru banget",
      "lurus terus",
      "kiri di sini"
    ],
    "grammar": [
      0,
      4
    ],
    "earlierGrammar": [
      "1:6"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Halo, Kak. Saya sudah di depan gerbang, ya.",
        "gloss": {
          "en": "Hello. I'm already in front of the gate.",
          "ko": "안녕하세요. 저 벌써 정문 앞에 와 있어요."
        }
      },
      {
        "who": "me",
        "text": "Oke, Pak. Saya lagi jalan ke sana.",
        "gloss": {
          "en": "Okay. I'm on my way there.",
          "ko": "네, 지금 그쪽으로 가는 중이에요."
        },
        "frames": [
          "id-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Ini helmnya, Kak. Ke Stasiun Gambir, ya?",
        "gloss": {
          "en": "Here's your helmet. To Gambir Station, right?",
          "ko": "헬멧 여기요. 감비르역 맞으시죠?"
        }
      },
      {
        "who": "me",
        "text": "Iya. Minta tolong jangan cepat-cepat, ya.",
        "gloss": {
          "en": "Yes. Please don't go too fast.",
          "ko": "네. 너무 빨리 가지 말아 주세요."
        },
        "frames": [
          "id-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Siap. Kakak dari mana? Sudah lama di Jakarta?",
        "gloss": {
          "en": "Sure. Where are you from? Been in Jakarta long?",
          "ko": "알겠어요. 어디서 오셨어요? 자카르타에 오래 계셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Saya dari Korea. Sudah dua minggu di sini.",
        "gloss": {
          "en": "I'm from Korea. I've been here two weeks.",
          "ko": "한국에서 왔어요. 여기 온 지 2주 됐어요."
        },
        "frames": [
          "id-f1-02",
          "id-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Oh, Korea! Sudah pernah naik ojek sebelumnya?",
        "gloss": {
          "en": "Oh, Korea! Have you ridden an ojek before?",
          "ko": "오, 한국! 오젝은 전에 타 보셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Belum, ini pertama kali. Seru banget!",
        "gloss": {
          "en": "No, this is my first time. It's so much fun!",
          "ko": "아니요, 이번이 처음이에요. 진짜 재밌어요!"
        },
        "frames": [
          "id-f2-02",
          "id-f2-19"
        ]
      },
      {
        "who": "them",
        "text": "Kita sudah dekat. Habis ini belok ke mana, Kak?",
        "gloss": {
          "en": "We're almost there. Where do I turn after this?",
          "ko": "거의 다 왔어요. 이다음에 어디로 꺾어요?"
        }
      },
      {
        "who": "me",
        "text": "Lurus terus, Pak. Nah, kiri di sini!",
        "gloss": {
          "en": "Keep going straight. Okay, pull over here on the left!",
          "ko": "쭉 직진이요. 자, 여기서 세워 주세요!"
        },
        "frames": [
          "id-f2-15"
        ]
      }
    ]
  },
  {
    "id": "id-2-4",
    "stage": 2,
    "situation": 3,
    "setting": {
      "en": "At a pharmacy, describing your cold to the pharmacist",
      "ko": "약국에서 약사에게 감기 증상 말하기"
    },
    "expressions": [
      "saya sakit kepala",
      "masuk angin",
      "belum",
      "boleh",
      "besok"
    ],
    "grammar": [
      0,
      2,
      3,
      4
    ],
    "earlierGrammar": [
      "1:5"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat sore. Ada yang bisa dibantu?",
        "gloss": {
          "en": "Good afternoon. How can I help?",
          "ko": "안녕하세요. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Sore, Bu. Saya sakit kepala dan batuk.",
        "gloss": {
          "en": "Good afternoon. I have a headache and a cough.",
          "ko": "안녕하세요. 머리가 아프고 기침이 나요."
        },
        "frames": [
          "id-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "Sudah berapa lama?",
        "gloss": {
          "en": "For how long?",
          "ko": "언제부터 그러셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Sejak kemarin malam. Saya juga masuk angin.",
        "gloss": {
          "en": "Since last night. I'm also feeling a chill.",
          "ko": "어젯밤부터요. 몸살 기운도 있어요."
        },
        "frames": [
          "id-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "Ada demam? Sudah minum obat?",
        "gloss": {
          "en": "Any fever? Have you taken any medicine?",
          "ko": "열은 있어요? 약은 드셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Tidak demam. Saya belum minum obat.",
        "gloss": {
          "en": "No fever. I haven't taken any medicine yet.",
          "ko": "열은 없어요. 약은 아직 안 먹었어요."
        },
        "frames": [
          "id-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Ini obat flu. Diminum tiga kali sehari, sesudah makan.",
        "gloss": {
          "en": "This is flu medicine. Take it three times a day, after meals.",
          "ko": "이건 감기약이에요. 하루 세 번, 식후에 드세요."
        }
      },
      {
        "who": "me",
        "text": "Tiga kali sehari. Boleh saya minum kopi?",
        "gloss": {
          "en": "Three times a day. May I drink coffee?",
          "ko": "하루 세 번이요. 커피 마셔도 돼요?"
        },
        "frames": [
          "id-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "Sebaiknya jangan dulu. Banyak minum air putih dan istirahat, ya.",
        "gloss": {
          "en": "Better not for now. Drink lots of water and rest.",
          "ko": "당분간은 안 드시는 게 좋아요. 물 많이 드시고 쉬세요."
        }
      },
      {
        "who": "me",
        "text": "Oke, Bu. Besok saya mau beristirahat seharian.",
        "gloss": {
          "en": "Okay. Tomorrow I'll rest all day.",
          "ko": "네. 내일은 하루 종일 쉴게요."
        },
        "frames": [
          "id-f2-04"
        ]
      }
    ]
  },
  {
    "id": "id-2-x1",
    "stage": 2,
    "setting": {
      "en": "A friend calls you in the evening to confirm tomorrow",
      "ko": "저녁에 친구가 내일 약속을 확인하려고 전화하다"
    },
    "expressions": [
      "udah makan",
      "jam berapa",
      "hati-hati"
    ],
    "grammar": [
      0,
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "Halo! Kamu lagi di mana?",
        "gloss": {
          "en": "Hello! Where are you right now?",
          "ko": "여보세요! 너 지금 어디야?"
        }
      },
      {
        "who": "me",
        "text": "Di rumah. Aku lagi membaca buku. Kamu udah makan?",
        "gloss": {
          "en": "At home. I'm reading a book. Have you eaten?",
          "ko": "집이야. 책 읽는 중이야. 너 밥 먹었어?"
        },
        "frames": [
          "id-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Udah. Eh, besok kita jadi ketemu, kan?",
        "gloss": {
          "en": "Yes. Hey, we're still meeting tomorrow, right?",
          "ko": "먹었지. 근데 내일 우리 만나는 거 맞지?"
        }
      },
      {
        "who": "me",
        "text": "Iya. Kita ketemu jam berapa?",
        "gloss": {
          "en": "Yes. What time are we meeting?",
          "ko": "응. 몇 시에 만나?"
        },
        "frames": [
          "id-f2-12",
          "id-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "Jam sepuluh, di kafe biasa. Aku jemput, ya?",
        "gloss": {
          "en": "Ten o'clock, at the usual café. Shall I pick you up?",
          "ko": "10시, 늘 가던 카페. 내가 데리러 갈까?"
        }
      },
      {
        "who": "me",
        "text": "Nggak usah, aku naik ojek aja. Hati-hati di jalan, ya!",
        "gloss": {
          "en": "No need, I'll take an ojek. Get home safe!",
          "ko": "괜찮아, 오젝 타고 갈게. 조심해서 가!"
        }
      }
    ]
  },
  {
    "id": "id-3-1",
    "stage": 3,
    "situation": 0,
    "setting": {
      "en": "Back from holiday, telling a friend about your trip to Lombok",
      "ko": "휴가에서 돌아와 친구에게 롬복 여행 이야기하기"
    },
    "expressions": [
      "pokoknya",
      "ternyata",
      "sayangnya",
      "untungnya",
      "lebih baik"
    ],
    "grammar": [
      0,
      1,
      2,
      5,
      6
    ],
    "earlierGrammar": [
      "2:2"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Eh, gimana liburannya? Jadi ke Lombok, kan?",
        "gloss": {
          "en": "Hey, how was the holiday? You did go to Lombok, right?",
          "ko": "야, 휴가 어땠어? 롬복 간 거 맞지?"
        }
      },
      {
        "who": "me",
        "text": "Jadi! Pokoknya seru banget, kamu harus ke sana.",
        "gloss": {
          "en": "I did! Anyway, it was so much fun — you have to go.",
          "ko": "갔지! 아무튼 진짜 재밌었어, 너도 꼭 가 봐."
        }
      },
      {
        "who": "them",
        "text": "Wah, iri banget. Pantainya bagus?",
        "gloss": {
          "en": "Wow, so jealous. Were the beaches nice?",
          "ko": "와, 완전 부럽다. 해변 예뻤어?"
        },
        "alt": [
          {
            "text": "Asyik banget! Pantainya gimana?",
            "gloss": {
              "en": "So cool! What were the beaches like?",
              "ko": "완전 좋았겠다! 해변은 어땠어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Bagus banget. Menurut aku, Lombok lebih indah daripada Bali.",
        "gloss": {
          "en": "Really nice. I think Lombok is more beautiful than Bali.",
          "ko": "엄청 예뻤어. 내 생각엔 롬복이 발리보다 더 아름다워."
        },
        "frames": [
          "id-f3-01",
          "id-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Oh ya? Terus kamu ke Gili juga?",
        "gloss": {
          "en": "Really? And did you go to Gili too?",
          "ko": "그래? 그럼 길리에도 갔어?"
        },
        "alt": [
          {
            "text": "Serius? Sempat ke Gili juga nggak?",
            "gloss": {
              "en": "Seriously? Did you get to Gili too?",
              "ko": "진짜? 길리에도 가 봤어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Iya. Waktu di Gili, aku snorkeling tiap hari. Ternyata airnya jernih banget.",
        "gloss": {
          "en": "Yes. When I was in Gili, I snorkelled every day. The water turned out to be so clear.",
          "ko": "응. 길리에 있을 때 매일 스노클링했어. 알고 보니 물이 엄청 맑더라."
        },
        "frames": [
          "id-f3-07",
          "id-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "Asyik! Ada kejadian lucu nggak?",
        "gloss": {
          "en": "Nice! Anything funny happen?",
          "ko": "좋다! 웃긴 일은 없었어?"
        }
      },
      {
        "who": "me",
        "text": "Ada. Sayangnya, kacamataku tertinggal di kapal.",
        "gloss": {
          "en": "Yes. Unfortunately, I left my glasses on the boat.",
          "ko": "있었지. 아쉽게도 안경을 배에 두고 내렸어."
        },
        "frames": [
          "id-f3-16",
          "id-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "Yah! Terus gimana?",
        "gloss": {
          "en": "Oh no! So what happened?",
          "ko": "아이고! 그래서 어떻게 됐어?"
        },
        "alt": [
          {
            "text": "Aduh, terus ketemu nggak?",
            "gloss": {
              "en": "Oh no, so did you find them?",
              "ko": "어머, 그래서 찾았어?"
            }
          },
          {
            "text": "Waduh! Hilang, dong?",
            "gloss": {
              "en": "Uh-oh! So they were lost?",
              "ko": "헐! 잃어버린 거야?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Untungnya, kacamatanya sudah ditemukan sama awak kapal.",
        "gloss": {
          "en": "Luckily, the crew had already found them.",
          "ko": "다행히 선원들이 벌써 안경을 찾아 놨더라."
        },
        "frames": [
          "id-f3-15",
          "id-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Syukurlah. Kalau aku mau ke sana, enaknya kapan, ya?",
        "gloss": {
          "en": "Thank goodness. If I want to go, when's a good time?",
          "ko": "다행이다. 나도 가려면 언제가 좋아?"
        }
      },
      {
        "who": "me",
        "text": "Kalau mau sepi, lebih baik datang bulan Mei.",
        "gloss": {
          "en": "If you want it quiet, it's better to go in May.",
          "ko": "한적한 게 좋으면 5월에 가는 게 나아."
        },
        "frames": [
          "id-f3-08"
        ]
      }
    ]
  },
  {
    "id": "id-3-2",
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
    "stage": 3,
    "situation": 1,
    "setting": {
      "en": "Calling a hotel because your booking shows the wrong number of nights",
      "ko": "예약 박수가 잘못돼 호텔에 전화하기"
    },
    "expressions": [
      "ada masalah",
      "sudah saya cek",
      "bisa dibantu",
      "gimana ya"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      5
    ],
    "earlierGrammar": [
      "2:0"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat siang, Hotel Melati, dengan Rina. Ada yang bisa dibantu?",
        "gloss": {
          "en": "Good afternoon, Hotel Melati, Rina speaking. How can I help?",
          "ko": "안녕하세요, 멜라티 호텔 리나입니다. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Selamat siang. Ada masalah dengan pemesanan saya atas nama Ji-woo.",
        "gloss": {
          "en": "Good afternoon. There's a problem with my booking under the name Ji-woo.",
          "ko": "안녕하세요. 지우 이름으로 된 제 예약에 문제가 있어요."
        },
        "frames": [
          "id-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Baik, Kak Ji-woo. Masalahnya apa, ya?",
        "gloss": {
          "en": "All right, Ji-woo. What's the problem?",
          "ko": "네, 지우 님. 어떤 문제인가요?"
        },
        "alt": [
          {
            "text": "Boleh dijelaskan masalahnya, Kak?",
            "gloss": {
              "en": "Could you explain the problem?",
              "ko": "어떤 문제인지 말씀해 주시겠어요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Saya pesan kamar untuk dua malam, tapi di email tertulis satu malam.",
        "gloss": {
          "en": "I booked a room for two nights, but the email says one night.",
          "ko": "2박으로 예약했는데 이메일에는 1박으로 적혀 있어요."
        }
      },
      {
        "who": "them",
        "text": "Sebentar, saya cek dulu, ya.",
        "gloss": {
          "en": "One moment, let me check.",
          "ko": "잠시만요, 확인해 볼게요."
        },
        "alt": [
          {
            "text": "Mohon ditunggu sebentar, saya periksa dulu.",
            "gloss": {
              "en": "Please hold on a moment while I check.",
              "ko": "잠시만 기다려 주세요, 먼저 확인해 볼게요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Email konfirmasinya sudah saya cek dua kali.",
        "gloss": {
          "en": "I've checked the confirmation email twice.",
          "ko": "확인 이메일은 제가 두 번 확인했어요."
        },
        "frames": [
          "id-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Benar, Kak. Ternyata ada kesalahan di sistem kami. Mohon maaf, ya.",
        "gloss": {
          "en": "You're right. It turns out there was an error in our system. We're very sorry.",
          "ko": "맞네요. 저희 시스템 오류였어요. 정말 죄송합니다."
        }
      },
      {
        "who": "me",
        "text": "Tidak apa-apa. Apa bisa dibantu untuk diganti jadi dua malam?",
        "gloss": {
          "en": "That's okay. Could you help change it to two nights?",
          "ko": "괜찮아요. 2박으로 바꿔 주실 수 있을까요?"
        }
      },
      {
        "who": "them",
        "text": "Bisa, tapi kamar standar untuk malam kedua sudah penuh. Adanya kamar deluxe.",
        "gloss": {
          "en": "Yes, but standard rooms for the second night are full. There's only a deluxe room.",
          "ko": "가능한데 둘째 날 스탠더드 룸은 다 찼어요. 디럭스 룸만 있어요."
        },
        "alt": [
          {
            "text": "Bisa, Kak, tapi yang tersisa tinggal kamar deluxe.",
            "gloss": {
              "en": "We can, but only deluxe rooms are left.",
              "ko": "가능하지만 남은 건 디럭스 룸뿐이에요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Gimana ya... Kalau deluxe, harganya lebih mahal?",
        "gloss": {
          "en": "Hmm, I'm not sure... If it's deluxe, is it more expensive?",
          "ko": "음, 어쩌지... 디럭스면 더 비싸요?"
        },
        "frames": [
          "id-f3-08",
          "id-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Karena ini kesalahan kami, harganya sama saja, Kak.",
        "gloss": {
          "en": "Since it's our mistake, the price stays the same.",
          "ko": "저희 실수니까 가격은 똑같이 해 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "Wah, terima kasih. Bisa tolong kirimkan konfirmasi barunya ke email saya?",
        "gloss": {
          "en": "Oh, thank you. Could you please send the new confirmation to my email?",
          "ko": "와, 감사합니다. 새 확인서를 제 이메일로 보내 주실 수 있어요?"
        },
        "frames": [
          "id-f3-05"
        ]
      }
    ]
  },
  {
    "id": "id-3-3",
    "stage": 3,
    "situation": 2,
    "setting": {
      "en": "Over coffee, a coworker asks how your new job is going",
      "ko": "커피 마시며 동료가 새 일 어떤지 묻다"
    },
    "expressions": [
      "lumayan",
      "sebenarnya",
      "capek banget",
      "terus"
    ],
    "grammar": [
      0,
      2,
      4,
      5
    ],
    "earlierGrammar": [
      "2:6"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Gimana minggu pertama di kantor baru? Betah?",
        "gloss": {
          "en": "How was your first week at the new office? Settling in?",
          "ko": "새 회사 첫 주 어땠어? 적응 잘 돼?"
        }
      },
      {
        "who": "me",
        "text": "Lumayan. Sebenarnya kerjanya lebih santai daripada di kantor lama.",
        "gloss": {
          "en": "Not bad. Actually, the work is more relaxed than at my old office.",
          "ko": "괜찮아. 사실 일은 예전 회사보다 더 여유로워."
        },
        "frames": [
          "id-f3-19",
          "id-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Oh ya? Terus timnya gimana?",
        "gloss": {
          "en": "Oh yeah? And what's the team like?",
          "ko": "그래? 팀은 어때?"
        },
        "alt": [
          {
            "text": "Syukurlah. Orang-orangnya gimana?",
            "gloss": {
              "en": "Glad to hear it. What are the people like?",
              "ko": "다행이다. 사람들은 어때?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Baik semua. Yang paling ramah itu Pak Dodi, manajer kami.",
        "gloss": {
          "en": "They're all nice. The friendliest is Mr Dodi, our manager.",
          "ko": "다 좋아. 제일 친절한 사람은 우리 매니저 도디 씨야."
        },
        "frames": [
          "id-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "Pak Dodi memang baik. Tapi katanya kamu sering lembur?",
        "gloss": {
          "en": "Mr Dodi is nice. But I heard you often work late?",
          "ko": "도디 씨 좋지. 근데 너 야근 자주 한다며?"
        },
        "alt": [
          {
            "text": "Tapi kerjaannya banyak, kan?",
            "gloss": {
              "en": "But there's a lot of work, isn't there?",
              "ko": "그래도 일은 많지?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Iya, kemarin sampai jam sepuluh malam. Capek banget.",
        "gloss": {
          "en": "Yes, yesterday until ten at night. I was so tired.",
          "ko": "응, 어제는 밤 10시까지 했어. 진짜 피곤했어."
        }
      },
      {
        "who": "them",
        "text": "Waduh. Kenapa sampai selarut itu?",
        "gloss": {
          "en": "Yikes. Why so late?",
          "ko": "헐. 왜 그렇게 늦게까지?"
        }
      },
      {
        "who": "me",
        "text": "Waktu mau pulang, laptopku tiba-tiba mati. Terus semua datanya hilang.",
        "gloss": {
          "en": "Just as I was about to leave, my laptop suddenly died. Then all the data was gone.",
          "ko": "퇴근하려는데 노트북이 갑자기 꺼졌어. 그러고 나서 데이터가 다 날아갔어."
        },
        "frames": [
          "id-f3-07",
          "id-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "Aduh! Datanya bisa diselamatkan?",
        "gloss": {
          "en": "Oh no! Could the data be saved?",
          "ko": "어머! 데이터는 살렸어?"
        }
      },
      {
        "who": "me",
        "text": "Bisa, karena semua file sudah disimpan di cloud.",
        "gloss": {
          "en": "Yes, because all the files had been saved to the cloud.",
          "ko": "응, 파일이 다 클라우드에 저장돼 있었거든."
        },
        "frames": [
          "id-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Pintar! Kalau ada masalah lagi, kabari aku, ya.",
        "gloss": {
          "en": "Smart! If there's another problem, let me know.",
          "ko": "똑똑하네! 또 문제 생기면 나한테 알려 줘."
        }
      },
      {
        "who": "me",
        "text": "Siap. Kalau begitu, nanti aku traktir kopi, ya.",
        "gloss": {
          "en": "Will do. In that case, I'll buy you a coffee later.",
          "ko": "알았어. 그럼 나중에 내가 커피 살게."
        },
        "frames": [
          "id-f3-08"
        ]
      }
    ]
  },
  {
    "id": "id-3-4",
    "stage": 3,
    "situation": 3,
    "setting": {
      "en": "Talking with a friend about the series you are both watching",
      "ko": "친구와 같이 보는 드라마 이야기하기"
    },
    "expressions": [
      "nggak nyangka",
      "ternyata",
      "kayaknya",
      "kurang setuju",
      "masa sih",
      "parah",
      "sama saja"
    ],
    "grammar": [
      0,
      2,
      3,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Kamu sudah nonton episode terbaru? Akhirnya bikin kaget banget!",
        "gloss": {
          "en": "Have you watched the latest episode? The ending was such a shock!",
          "ko": "최신화 봤어? 결말 진짜 충격이었어!"
        }
      },
      {
        "who": "me",
        "text": "Sudah! Aku juga nggak nyangka dokternya ternyata pelakunya.",
        "gloss": {
          "en": "Yes! I didn't see it coming either — the doctor turned out to be the culprit.",
          "ko": "봤지! 나도 의사가 범인일 줄은 몰랐어."
        },
        "frames": [
          "id-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "Iya! Menurut kamu, ceritanya masuk akal nggak?",
        "gloss": {
          "en": "Right! Do you think the story makes sense?",
          "ko": "그치! 네 생각엔 이야기가 말이 돼?"
        },
        "alt": [
          {
            "text": "Tapi menurutmu, itu masuk akal nggak?",
            "gloss": {
              "en": "But do you think that made sense?",
              "ko": "근데 그게 말이 된다고 생각해?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Kayaknya agak dipaksakan. Aku kurang setuju sama keputusan penulisnya.",
        "gloss": {
          "en": "It seems a bit forced. I don't really agree with the writer's choice.",
          "ko": "좀 억지스러운 것 같아. 작가 선택엔 별로 동의 못 하겠어."
        },
        "frames": [
          "id-f3-02",
          "id-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Masa? Aku malah suka. Tokoh utamanya keren banget.",
        "gloss": {
          "en": "Really? I actually liked it. The main character is so cool.",
          "ko": "그래? 난 오히려 좋던데. 주인공 완전 멋있어."
        }
      },
      {
        "who": "me",
        "text": "Masa sih? Menurut aku, yang paling keren itu adiknya.",
        "gloss": {
          "en": "Seriously? I think the coolest one is her younger sister.",
          "ko": "진짜? 내 생각엔 제일 멋있는 건 동생이야."
        },
        "frames": [
          "id-f3-01",
          "id-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "Oh, si Rani? Iya sih, aktingnya bagus.",
        "gloss": {
          "en": "Oh, Rani? Yeah, her acting is good.",
          "ko": "아, 라니? 맞아, 연기 잘하더라."
        },
        "alt": [
          {
            "text": "Rani maksudnya? Oke, aktingnya memang bagus.",
            "gloss": {
              "en": "You mean Rani? Okay, her acting really is good.",
              "ko": "라니 말하는 거야? 그래, 연기는 확실히 좋아."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Setuju. Kalau Rani muncul, ceritanya jadi lebih seru.",
        "gloss": {
          "en": "Agreed. When Rani shows up, the story gets more exciting.",
          "ko": "그치. 라니가 나오면 이야기가 더 재밌어져."
        },
        "frames": [
          "id-f3-08",
          "id-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Episode berikutnya tayang kapan, ya?",
        "gloss": {
          "en": "When does the next episode come out?",
          "ko": "다음 화는 언제 나오지?"
        },
        "alt": [
          {
            "text": "Kamu tahu kapan episode selanjutnya keluar?",
            "gloss": {
              "en": "Do you know when the next episode comes out?",
              "ko": "다음 화 언제 나오는지 알아?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Katanya ditunda sampai bulan depan. Parah!",
        "gloss": {
          "en": "Apparently it's been postponed until next month. Terrible!",
          "ko": "다음 달로 미뤄졌대. 너무해!"
        }
      },
      {
        "who": "them",
        "text": "Yah, lama banget! Sambil nunggu, mau nonton film atau serial lain?",
        "gloss": {
          "en": "Ugh, that's so long! While we wait, want to watch a film or another series?",
          "ko": "아, 너무 오래 걸린다! 기다리는 동안 영화 볼래, 다른 드라마 볼래?"
        }
      },
      {
        "who": "me",
        "text": "Sama saja buat aku. Yang penting nontonnya bareng.",
        "gloss": {
          "en": "It's all the same to me. What matters is we watch together.",
          "ko": "나는 아무거나 상관없어. 같이 보는 게 중요하지."
        }
      }
    ]
  },
  {
    "id": "id-3-x1",
    "stage": 3,
    "setting": {
      "en": "Planning where to study for an exam with a classmate",
      "ko": "같은 반 친구와 시험공부 할 곳 정하기"
    },
    "expressions": [
      "menurut saya",
      "saya setuju"
    ],
    "grammar": [
      0,
      2,
      3,
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Kita belajar buat ujian di perpustakaan atau di kafe?",
        "gloss": {
          "en": "Shall we study for the exam at the library or at a café?",
          "ko": "시험공부 도서관에서 할까, 카페에서 할까?"
        }
      },
      {
        "who": "me",
        "text": "Menurut saya, perpustakaan lebih tenang daripada kafe.",
        "gloss": {
          "en": "In my opinion, the library is quieter than a café.",
          "ko": "내 생각엔 도서관이 카페보다 더 조용해."
        },
        "frames": [
          "id-f3-01",
          "id-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Betul, tapi perpustakaannya tutup jam lima sore.",
        "gloss": {
          "en": "True, but the library closes at five.",
          "ko": "맞아, 근데 도서관은 5시에 닫아."
        }
      },
      {
        "who": "me",
        "text": "Oh iya. Kalau begitu, kita ke kafe yang dekat kampus saja.",
        "gloss": {
          "en": "Oh right. In that case, let's just go to the café near campus.",
          "ko": "아 맞다. 그럼 그냥 학교 근처 카페로 가자."
        },
        "frames": [
          "id-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Oke, nanti aku pesankan meja di sana.",
        "gloss": {
          "en": "Okay, I'll book a table there later.",
          "ko": "좋아, 이따 내가 거기 자리 예약해 둘게."
        }
      },
      {
        "who": "me",
        "text": "Oke, saya setuju. Tolong kabari saya kalau mejanya sudah dipesan.",
        "gloss": {
          "en": "Okay, I agree. Please let me know once the table is booked.",
          "ko": "좋아, 찬성. 자리 예약되면 알려 줘."
        },
        "frames": [
          "id-f3-13",
          "id-f3-11"
        ]
      }
    ]
  },
  {
    "id": "id-4-1",
    "stage": 4,
    "situation": 0,
    "setting": {
      "en": "Project meeting with your manager, Bu Sari, about the delayed app launch",
      "ko": "매니저 사리 씨와 앱 출시 지연에 관한 프로젝트 회의"
    },
    "expressions": [
      "sejauh ini",
      "tapi masalahnya",
      "dengan kata lain",
      "mau tidak mau",
      "saya paham maksudnya",
      "kalau boleh usul",
      "kita sepakat",
      "saya tindak lanjuti"
    ],
    "grammar": [
      0,
      1,
      3,
      4,
      5
    ],
    "earlierGrammar": [
      "3:5",
      "3:4"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Oke, kita mulai. Bagaimana perkembangan aplikasinya sejauh ini?",
        "gloss": {
          "en": "Okay, let's begin. How is the app coming along so far?",
          "ko": "자, 시작하죠. 앱 진행 상황은 지금까지 어때요?"
        }
      },
      {
        "who": "me",
        "text": "Sejauh ini, sebagian besar fitur sudah selesai. Tapi masalahnya, ada keterlambatan di tahap pengujian.",
        "gloss": {
          "en": "So far, most features are done. But the problem is, there's a delay in the testing stage.",
          "ko": "지금까지 기능은 대부분 끝났습니다. 그런데 문제는 테스트 단계가 늦어지고 있다는 거예요."
        }
      },
      {
        "who": "them",
        "text": "Kenapa bisa terlambat? Seharusnya minggu lalu sudah beres.",
        "gloss": {
          "en": "How did it get delayed? It should have been done last week.",
          "ko": "왜 늦어졌어요? 지난주에 끝났어야 하잖아요."
        },
        "alt": [
          {
            "text": "Lho, bukannya pengujian dijadwalkan selesai minggu lalu?",
            "gloss": {
              "en": "Wait, wasn't testing scheduled to finish last week?",
              "ko": "어, 테스트는 지난주에 끝나기로 돼 있지 않았나요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Tim penguji bilang bahwa ada banyak bug di fitur pembayaran.",
        "gloss": {
          "en": "The testing team said that there are a lot of bugs in the payment feature.",
          "ko": "테스트 팀 말로는 결제 기능에 버그가 많다고 합니다."
        }
      },
      {
        "who": "them",
        "text": "Jadi, peluncurannya harus diundur?",
        "gloss": {
          "en": "So the launch has to be pushed back?",
          "ko": "그럼 출시를 미뤄야 해요?"
        }
      },
      {
        "who": "me",
        "text": "Mau tidak mau, iya. Dengan kata lain, kita butuh dua minggu lagi.",
        "gloss": {
          "en": "Like it or not, yes. In other words, we need two more weeks.",
          "ko": "어쩔 수 없이 그렇습니다. 다시 말해 2주가 더 필요해요."
        }
      },
      {
        "who": "them",
        "text": "Dua minggu terlalu lama. Klien sudah menunggu.",
        "gloss": {
          "en": "Two weeks is too long. The client is already waiting.",
          "ko": "2주는 너무 길어요. 고객이 벌써 기다리고 있어요."
        },
        "alt": [
          {
            "text": "Wah, dua minggu itu berat. Kliennya pasti kecewa.",
            "gloss": {
              "en": "Two weeks is tough. The client will definitely be disappointed.",
              "ko": "와, 2주는 부담스러워요. 고객이 분명 실망할 거예요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Saya paham maksudnya, Bu. Tapi kalau dirilis sekarang, kepercayaan pengguna bisa turun.",
        "gloss": {
          "en": "I understand what you mean. But if we release it now, users' trust could drop.",
          "ko": "무슨 말씀인지 압니다. 하지만 지금 출시하면 사용자 신뢰가 떨어질 수 있어요."
        }
      },
      {
        "who": "them",
        "text": "Lalu, apa usulannya?",
        "gloss": {
          "en": "Then what do you propose?",
          "ko": "그럼 제안이 뭐예요?"
        }
      },
      {
        "who": "me",
        "text": "Kalau boleh usul, kita fokus memperbaiki bug yang paling parah dulu, supaya peluncurannya tidak terlalu mundur.",
        "gloss": {
          "en": "If I may suggest, we focus on fixing the worst bugs first, so the launch isn't pushed back too far.",
          "ko": "제안드리자면, 가장 심각한 버그부터 고쳐서 출시가 너무 밀리지 않게 하는 게 좋겠습니다."
        }
      },
      {
        "who": "them",
        "text": "Oke, masuk akal. Tapi seharusnya ini dilaporkan dari awal.",
        "gloss": {
          "en": "Okay, that makes sense. But this should have been reported from the start.",
          "ko": "좋아요, 일리 있네요. 하지만 이건 처음부터 보고됐어야 했어요."
        },
        "alt": [
          {
            "text": "Masuk akal. Cuma, kenapa baru sekarang saya dengar?",
            "gloss": {
              "en": "Makes sense. Only, why am I only hearing about it now?",
              "ko": "일리는 있어요. 그런데 왜 이제야 듣는 거죠?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Betul, Bu. Seharusnya kami memberi kabar lebih awal.",
        "gloss": {
          "en": "You're right. We should have let you know earlier.",
          "ko": "맞습니다. 저희가 더 일찍 말씀드렸어야 했어요."
        }
      },
      {
        "who": "them",
        "text": "Ya sudah. Jadi kapan kita rilis?",
        "gloss": {
          "en": "All right. So when do we release?",
          "ko": "알겠어요. 그럼 언제 출시하죠?"
        }
      },
      {
        "who": "me",
        "text": "Jadi kita sepakat rilis akhir bulan, ya? Saya tindak lanjuti dengan klien hari ini.",
        "gloss": {
          "en": "So we agree to release at the end of the month? I'll follow up with the client today.",
          "ko": "그럼 월말 출시로 합의한 거죠? 오늘 고객과 후속 조치하겠습니다."
        }
      }
    ]
  },
  {
    "id": "id-4-2",
    "stage": 4,
    "situation": 1,
    "setting": {
      "en": "Negotiating next year's rent with your landlord, Pak Hendra",
      "ko": "집주인 헨드라 씨와 내년 월세 협상하기"
    },
    "expressions": [
      "mohon maaf sebelumnya",
      "harganya bisa kurang",
      "di satu sisi",
      "di sisi lain",
      "bagaimana kalau",
      "ada benarnya juga",
      "kita sepakat"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      6
    ],
    "earlierGrammar": [
      "3:5"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Jadi, kontraknya mau diperpanjang untuk tahun depan?",
        "gloss": {
          "en": "So, do you want to extend the contract for next year?",
          "ko": "그래서, 내년에도 계약 연장할 거예요?"
        }
      },
      {
        "who": "me",
        "text": "Iya, Pak. Tapi mohon maaf sebelumnya, saya mau bicara soal harga sewa.",
        "gloss": {
          "en": "Yes. But I apologise in advance — I'd like to talk about the rent.",
          "ko": "네. 그런데 먼저 양해 말씀드릴게요, 월세 얘기를 좀 하고 싶어서요."
        }
      },
      {
        "who": "them",
        "text": "Oh, harganya naik sepuluh persen mulai Januari.",
        "gloss": {
          "en": "Oh, the rent goes up ten percent from January.",
          "ko": "아, 1월부터 10퍼센트 올라요."
        },
        "alt": [
          {
            "text": "Iya, tahun depan harganya memang saya naikkan sedikit.",
            "gloss": {
              "en": "Yes, I am raising the price a little next year.",
              "ko": "네, 내년엔 가격을 조금 올리려고요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Naik sepuluh persen agak berat buat saya. Harganya bisa kurang sedikit, Pak?",
        "gloss": {
          "en": "Ten percent is a bit hard for me. Could the price come down a little?",
          "ko": "10퍼센트는 저한테 좀 부담돼요. 조금 깎아 주실 수 있을까요?"
        }
      },
      {
        "who": "them",
        "text": "Wah, semua sudah naik. Listrik, air, biaya perawatan.",
        "gloss": {
          "en": "Well, everything has gone up. Electricity, water, maintenance costs.",
          "ko": "에이, 다 올랐잖아요. 전기, 수도, 관리비까지."
        }
      },
      {
        "who": "me",
        "text": "Saya paham. Di satu sisi, biaya Bapak memang naik. Di sisi lain, saya sudah tiga tahun di sini dan selalu bayar tepat waktu.",
        "gloss": {
          "en": "I understand. On one hand, your costs really have gone up. On the other hand, I've been here three years and always pay on time.",
          "ko": "이해해요. 한편으로는 비용이 오른 게 맞죠. 다른 한편으로는 제가 여기 3년째 살면서 늘 제때 냈잖아요."
        }
      },
      {
        "who": "them",
        "text": "Itu benar. Penyewa seperti kamu memang jarang.",
        "gloss": {
          "en": "That's true. Tenants like you are rare.",
          "ko": "그건 맞아요. 당신 같은 세입자는 드물죠."
        },
        "alt": [
          {
            "text": "Iya, saya akui kamu penyewa yang baik.",
            "gloss": {
              "en": "Yes, I admit you're a good tenant.",
              "ko": "네, 좋은 세입자인 건 인정해요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Bagaimana kalau naiknya lima persen saja, tapi saya bayar enam bulan di muka?",
        "gloss": {
          "en": "How about a five percent increase, but I pay six months in advance?",
          "ko": "5퍼센트만 올리고 대신 제가 6개월치를 미리 내면 어떨까요?"
        }
      },
      {
        "who": "them",
        "text": "Lima persen? Itu terlalu kecil. Biaya perawatan saja sudah besar.",
        "gloss": {
          "en": "Five percent? That's too little. Maintenance alone costs a lot.",
          "ko": "5퍼센트요? 너무 적어요. 관리비만 해도 많이 들어요."
        }
      },
      {
        "who": "me",
        "text": "Ada benarnya juga. Meskipun begitu, atap kamar mandi masih bocor sejak bulan lalu.",
        "gloss": {
          "en": "You have a point. Even so, the bathroom roof has been leaking since last month.",
          "ko": "일리는 있네요. 그래도 욕실 지붕이 지난달부터 계속 새요."
        }
      },
      {
        "who": "them",
        "text": "Oh iya, atapnya. Itu memang harus diperbaiki.",
        "gloss": {
          "en": "Oh right, the roof. That really does need fixing.",
          "ko": "아 맞다, 지붕. 그건 고쳐야죠."
        },
        "alt": [
          {
            "text": "Soal atap itu, saya lupa. Nanti saya panggil tukang.",
            "gloss": {
              "en": "About the roof, I forgot. I'll call a repairman.",
              "ko": "지붕 건은 깜빡했네요. 기술자 부를게요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Kalau Bapak memperbaiki atapnya bulan ini, saya setuju naik tujuh persen, supaya sama-sama enak.",
        "gloss": {
          "en": "If you fix the roof this month, I'll agree to seven percent, so it works for both of us.",
          "ko": "이번 달에 지붕을 고쳐 주시면 7퍼센트 인상에 동의할게요, 서로 좋게요."
        }
      },
      {
        "who": "them",
        "text": "Oke. Tujuh persen, dan atapnya diperbaiki minggu depan. Setuju?",
        "gloss": {
          "en": "Okay. Seven percent, and the roof gets fixed next week. Deal?",
          "ko": "좋아요. 7퍼센트, 지붕은 다음 주에 고치고. 됐죠?"
        }
      },
      {
        "who": "me",
        "text": "Setuju, Pak. Kita sepakat, ya. Nanti saya kirim perjanjiannya lewat WhatsApp.",
        "gloss": {
          "en": "Agreed. It's a deal. I'll send the agreement over WhatsApp later.",
          "ko": "좋습니다. 합의된 거예요. 계약서는 이따 왓츠앱으로 보낼게요."
        }
      }
    ]
  },
  {
    "id": "id-4-3",
    "stage": 4,
    "situation": 2,
    "setting": {
      "en": "Debating Jakarta's traffic and public transport with friends",
      "ko": "친구들과 자카르타 교통 체증과 대중교통 토론하기"
    },
    "expressions": [
      "secara umum",
      "tergantung",
      "jangan salah paham",
      "nggak masuk akal",
      "intinya"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      4,
      6
    ],
    "earlierGrammar": [
      "3:6",
      "3:5"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Tadi aku kena macet dua jam di tol. Kemacetan di Jakarta makin parah, ya.",
        "gloss": {
          "en": "I was stuck in traffic for two hours on the toll road. Jakarta's congestion is getting worse.",
          "ko": "아까 고속도로에서 두 시간 막혔어. 자카르타 교통 체증 점점 심해진다."
        }
      },
      {
        "who": "me",
        "text": "Parah banget. Menurutku, pemerintah seharusnya memperbanyak bus dan kereta.",
        "gloss": {
          "en": "Really bad. I think the government should increase the number of buses and trains.",
          "ko": "진짜 심해. 내 생각엔 정부가 버스랑 기차를 더 늘려야 해."
        }
      },
      {
        "who": "them",
        "text": "Tapi transportasi umum kurang nyaman. Aku lebih suka naik mobil sendiri.",
        "gloss": {
          "en": "But public transport isn't very comfortable. I prefer driving my own car.",
          "ko": "근데 대중교통은 좀 불편해. 난 내 차 타는 게 더 좋아."
        },
        "alt": [
          {
            "text": "Masalahnya, naik bus itu ribet. Mending bawa mobil sendiri.",
            "gloss": {
              "en": "The thing is, taking the bus is a hassle. Better to drive yourself.",
              "ko": "문제는 버스 타는 게 번거롭다는 거야. 차라리 내 차 끌고 가지."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Secara umum, MRT sekarang sudah cukup nyaman, walaupun jalurnya masih sedikit.",
        "gloss": {
          "en": "Generally, the MRT is pretty comfortable now, even though there are still few lines.",
          "ko": "전반적으로 MRT는 이제 꽤 편해, 노선이 아직 적긴 하지만."
        }
      },
      {
        "who": "them",
        "text": "Iya, tapi rumahku jauh dari stasiun. Jadi tetap repot.",
        "gloss": {
          "en": "Yeah, but my house is far from the station. So it's still a hassle.",
          "ko": "응, 근데 우리 집은 역에서 멀어. 그래서 여전히 귀찮아."
        }
      },
      {
        "who": "me",
        "text": "Tergantung. Kalau ada bus pengumpan yang rutin, orang bisa ke stasiun dengan mudah.",
        "gloss": {
          "en": "It depends. If there are regular feeder buses, people can get to the station easily.",
          "ko": "그건 상황마다 달라. 연계 버스가 꾸준히 다니면 사람들이 역까지 쉽게 갈 수 있잖아."
        }
      },
      {
        "who": "them",
        "text": "Bus pengumpan di daerahku sering terlambat.",
        "gloss": {
          "en": "The feeder buses in my area are often late.",
          "ko": "우리 동네 연계 버스는 자주 늦어."
        },
        "alt": [
          {
            "text": "Bus pengumpan di daerahku jarang lewat.",
            "gloss": {
              "en": "Feeder buses rarely come by in my area.",
              "ko": "우리 동네엔 연계 버스가 잘 안 다녀."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Makanya jadwalnya harus diperbaiki, sehingga orang mau pindah dari mobil.",
        "gloss": {
          "en": "That's why the schedule needs fixing, so that people are willing to switch from cars.",
          "ko": "그러니까 배차를 개선해야 사람들이 차에서 갈아탈 마음이 생기지."
        }
      },
      {
        "who": "them",
        "text": "Terus soal ganjil-genap? Aku rasa itu nggak efektif.",
        "gloss": {
          "en": "And what about the odd-even plate rule? I don't think it works.",
          "ko": "그럼 홀짝제는? 난 그거 효과 없는 것 같아."
        }
      },
      {
        "who": "me",
        "text": "Jangan salah paham, aku nggak bilang aturan itu sempurna. Mungkin hasilnya kurang terasa sekarang.",
        "gloss": {
          "en": "Don't get me wrong, I'm not saying the rule is perfect. Maybe the results just aren't very noticeable yet.",
          "ko": "오해하지 마, 그 규칙이 완벽하다는 건 아니야. 지금은 효과가 덜 느껴지는 걸 수도 있어."
        }
      },
      {
        "who": "them",
        "text": "Ada juga yang usul tarif parkir dinaikkan tiga kali lipat.",
        "gloss": {
          "en": "Some people even suggest tripling parking fees.",
          "ko": "주차비를 세 배로 올리자는 사람도 있더라."
        },
        "alt": [
          {
            "text": "Katanya tarif parkir mau dinaikkan gila-gilaan.",
            "gloss": {
              "en": "Apparently they want to raise parking fees like crazy.",
              "ko": "주차비를 엄청 올린다던데."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Nah, itu nggak masuk akal. Yang naik cuma biayanya, bukan kualitas layanannya.",
        "gloss": {
          "en": "Now that doesn't make sense. Only the cost goes up, not the quality of service.",
          "ko": "그건 말이 안 되지. 오르는 건 비용뿐이고 서비스 질은 그대로잖아."
        }
      },
      {
        "who": "them",
        "text": "Jadi intinya, kamu tetap pro transportasi umum?",
        "gloss": {
          "en": "So basically, you're still pro public transport?",
          "ko": "그러니까 결론은, 넌 그래도 대중교통 편이라는 거지?"
        }
      },
      {
        "who": "me",
        "text": "Intinya begitu. Kenyamanan memang penting, tapi keselamatan dan waktu juga.",
        "gloss": {
          "en": "Basically, yes. Comfort matters, but so do safety and time.",
          "ko": "결론은 그거야. 편한 것도 중요하지만 안전이랑 시간도 중요하잖아."
        }
      }
    ]
  },
  {
    "id": "id-4-4",
    "stage": 4,
    "situation": 3,
    "setting": {
      "en": "A guest on a podcast, reacting to news about a ban on single-use plastic",
      "ko": "팟캐스트 게스트로 일회용 플라스틱 금지 뉴스에 반응하기"
    },
    "expressions": [
      "tergantung",
      "intinya"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "earlierGrammar": [
      "3:5",
      "3:4"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Oke, berita berikutnya. Pemerintah mau melarang plastik sekali pakai mulai tahun depan.",
        "gloss": {
          "en": "Okay, next story. The government wants to ban single-use plastic from next year.",
          "ko": "자, 다음 뉴스요. 정부가 내년부터 일회용 플라스틱을 금지한대요."
        }
      },
      {
        "who": "me",
        "text": "Ya, saya juga baca beritanya. Menterinya bilang bahwa larangan ini untuk mengurangi sampah laut.",
        "gloss": {
          "en": "Yes, I read the news too. The minister said that the ban is meant to reduce marine waste.",
          "ko": "네, 저도 기사 봤어요. 장관이 이 금지가 해양 쓰레기를 줄이기 위한 거라고 했죠."
        }
      },
      {
        "who": "them",
        "text": "Kamu sendiri setuju?",
        "gloss": {
          "en": "Do you agree yourself?",
          "ko": "본인은 찬성이에요?"
        },
        "alt": [
          {
            "text": "Gimana pendapatmu soal itu?",
            "gloss": {
              "en": "What's your take on that?",
              "ko": "그거에 대해 어떻게 생각해요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Secara pribadi setuju. Meskipun agak merepotkan, dampaknya bagus untuk lingkungan.",
        "gloss": {
          "en": "Personally, I agree. Even though it's a bit inconvenient, the impact is good for the environment.",
          "ko": "개인적으로는 찬성이에요. 좀 번거롭긴 해도 환경에는 좋은 영향이니까요."
        }
      },
      {
        "who": "them",
        "text": "Tapi para pedagang kecil protes. Mereka bilang biayanya mahal.",
        "gloss": {
          "en": "But small vendors are protesting. They say the cost is high.",
          "ko": "그런데 영세 상인들이 반발해요. 비용이 비싸다고요."
        },
        "alt": [
          {
            "text": "Banyak pedagang kecil yang keberatan, lho.",
            "gloss": {
              "en": "A lot of small vendors object, you know.",
              "ko": "반대하는 영세 상인이 많아요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Itu wajar. Seharusnya pemerintah memberi waktu persiapan yang cukup.",
        "gloss": {
          "en": "That's understandable. The government should give enough time to prepare.",
          "ko": "그럴 만해요. 정부가 준비 기간을 충분히 줬어야 해요."
        }
      },
      {
        "who": "them",
        "text": "Menurut kamu, aturan ini akan berhasil?",
        "gloss": {
          "en": "Do you think this rule will work?",
          "ko": "이 규칙이 성공할 거라고 봐요?"
        }
      },
      {
        "who": "me",
        "text": "Tergantung pelaksanaannya. Kalau pengawasannya lemah, hasilnya sama saja.",
        "gloss": {
          "en": "It depends on how it's carried out. If enforcement is weak, nothing will change.",
          "ko": "시행하기 나름이죠. 감독이 약하면 결과는 똑같을 거예요."
        }
      },
      {
        "who": "them",
        "text": "Ada pendengar yang bilang ini cuma pencitraan menjelang pemilu.",
        "gloss": {
          "en": "One listener says this is just image-building before the election.",
          "ko": "선거 앞두고 이미지 관리일 뿐이라는 청취자도 있어요."
        }
      },
      {
        "who": "me",
        "text": "Mungkin ada benarnya. Tapi kita jangan menolak ide bagus hanya karena curiga.",
        "gloss": {
          "en": "Maybe there's some truth in that. But we shouldn't reject a good idea just because we're suspicious.",
          "ko": "일리가 있을지도 몰라요. 그래도 의심스럽다는 이유만으로 좋은 아이디어를 거부하면 안 되죠."
        }
      },
      {
        "who": "them",
        "text": "Oke. Ada saran praktis untuk pendengar?",
        "gloss": {
          "en": "Okay. Any practical tips for listeners?",
          "ko": "좋아요. 청취자들에게 실용적인 조언이 있나요?"
        },
        "alt": [
          {
            "text": "Terus, apa yang bisa dilakukan pendengar mulai sekarang?",
            "gloss": {
              "en": "So what can listeners do starting now?",
              "ko": "그럼 청취자들이 지금부터 할 수 있는 건 뭘까요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Bawa tas belanja sendiri, supaya kita terbiasa sebelum aturannya berlaku.",
        "gloss": {
          "en": "Bring your own shopping bag, so we get used to it before the rule takes effect.",
          "ko": "장바구니를 챙겨 다니세요, 규칙이 시행되기 전에 익숙해지도록요."
        }
      },
      {
        "who": "them",
        "text": "Mantap. Jadi kesimpulannya?",
        "gloss": {
          "en": "Great. So what's the conclusion?",
          "ko": "좋네요. 그래서 결론은요?"
        }
      },
      {
        "who": "me",
        "text": "Intinya, aturan ini perlu, tapi pemerintah harus memperjelas detailnya.",
        "gloss": {
          "en": "Basically, the rule is needed, but the government must make the details clearer.",
          "ko": "결론은, 이 규칙은 필요하지만 정부가 세부 내용을 더 분명히 해야 한다는 거예요."
        }
      }
    ]
  },
  {
    "id": "id-4-x1",
    "stage": 4,
    "setting": {
      "en": "A client asks you for an extra sales report at short notice",
      "ko": "고객이 갑자기 추가 매출 보고서를 요청하다"
    },
    "expressions": [
      "tenggatnya kapan"
    ],
    "grammar": [
      2,
      3
    ],
    "earlierGrammar": [
      "2:4"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Selamat pagi. Kami butuh laporan tambahan untuk penjualan bulan lalu.",
        "gloss": {
          "en": "Good morning. We need an extra report on last month's sales.",
          "ko": "안녕하세요. 지난달 매출에 대한 추가 보고서가 필요해요."
        }
      },
      {
        "who": "me",
        "text": "Baik, Bu. Tenggatnya kapan, ya?",
        "gloss": {
          "en": "Certainly. When's the deadline?",
          "ko": "알겠습니다. 마감이 언제인가요?"
        }
      },
      {
        "who": "them",
        "text": "Kalau bisa hari Jumat. Maaf, agak mendadak.",
        "gloss": {
          "en": "Friday, if possible. Sorry, it's a bit sudden.",
          "ko": "가능하면 금요일이요. 좀 급해서 죄송해요."
        }
      },
      {
        "who": "me",
        "text": "Tidak apa-apa. Supaya cepat, boleh saya minta data mentahnya hari ini?",
        "gloss": {
          "en": "No problem. So that it goes quickly, could I get the raw data today?",
          "ko": "괜찮습니다. 빨리 진행하려면 원자료를 오늘 받을 수 있을까요?"
        }
      },
      {
        "who": "them",
        "text": "Bisa, nanti siang saya kirim.",
        "gloss": {
          "en": "Sure, I'll send it this afternoon.",
          "ko": "네, 오후에 보내 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "Terima kasih. Meskipun waktunya mepet, kami usahakan selesai hari Kamis.",
        "gloss": {
          "en": "Thank you. Even though time is tight, we'll try to finish by Thursday.",
          "ko": "감사합니다. 시간이 빠듯하지만 목요일까지 끝내 보겠습니다."
        }
      }
    ]
  },
  {
    "id": "id-5-1",
    "stage": 5,
    "situation": 0,
    "setting": {
      "en": "At the office farewell party for your colleague Bu Ratna, giving a speech for the team",
      "ko": "동료 라트나 씨의 사내 송별회에서 팀 대표로 인사말하기"
    },
    "goal": {
      "en": "Give a warm, lightly humorous farewell speech on behalf of the team that thanks your colleague and handles the interruptions gracefully.",
      "ko": "팀을 대표해 동료에게 감사를 전하고, 끼어드는 말도 재치 있게 받아넘기며 따뜻하고 유쾌한 송별 인사를 한다."
    },
    "expressions": [
      "izinkan saya",
      "atas nama tim",
      "basa-basi",
      "sungkan",
      "tak kenal maka tak sayang",
      "bikin baper",
      "jujur aja"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      5
    ],
    "earlierGrammar": [
      "3:5",
      "4:0"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Baik, sekarang kita dengarkan sambutan dari perwakilan tim. Silakan.",
        "gloss": {
          "en": "All right, now let's hear a few words from the team's representative. Go ahead.",
          "ko": "자, 이제 팀 대표의 인사말을 들어 보겠습니다. 시작하세요."
        }
      },
      {
        "who": "me",
        "text": "Terima kasih. Selamat sore semuanya. Izinkan saya menyampaikan beberapa kata atas nama tim.",
        "gloss": {
          "en": "Thank you. Good afternoon, everyone. Allow me to say a few words on behalf of the team.",
          "ko": "감사합니다. 여러분, 안녕하세요. 팀을 대표해 몇 마디 드리겠습니다."
        }
      },
      {
        "who": "them",
        "text": "Jangan panjang-panjang, ya! Makanannya keburu dingin!",
        "gloss": {
          "en": "Don't make it too long! The food's getting cold!",
          "ko": "너무 길게 하지 마! 음식 식는다!"
        }
      },
      {
        "who": "me",
        "text": "Tenang, nggak lama kok. Tanpa basa-basi, Bu Ratna adalah orang paling sabar di kantor ini.",
        "gloss": {
          "en": "Relax, it won't be long. No beating around the bush: Bu Ratna is the most patient person in this office.",
          "ko": "걱정 마, 금방 끝나. 빈말 없이 말하자면, 라트나 씨는 이 회사에서 제일 인내심 많은 분이에요."
        }
      },
      {
        "who": "them",
        "text": "Setuju! Apalagi kalau ngajarin anak magang.",
        "gloss": {
          "en": "Agreed! Especially when she's teaching the interns.",
          "ko": "인정! 특히 인턴 가르칠 때!"
        }
      },
      {
        "who": "me",
        "text": "Betul. Waktu saya baru masuk, saya sungkan banget bertanya. Tapi Bu Ratna selalu bilang, tak kenal maka tak sayang.",
        "gloss": {
          "en": "Exactly. When I first joined, I was too shy to ask anything. But Bu Ratna always said, you can't like what you don't know.",
          "ko": "맞아요. 제가 처음 들어왔을 때 질문하는 게 너무 어려웠는데, 라트나 씨는 늘 '알아야 정이 든다'고 하셨죠."
        }
      },
      {
        "who": "them",
        "text": "Itu memang kalimat favoritnya!",
        "gloss": {
          "en": "That really is her favourite line!",
          "ko": "그거 진짜 그분 단골 멘트야!"
        }
      },
      {
        "who": "me",
        "text": "Dan ternyata benar. Dari obrolan-obrolan kecil di pantry, kami jadi dekat kayak keluarga.",
        "gloss": {
          "en": "And it turned out to be true. From all those little chats in the pantry, we became close like family.",
          "ko": "그리고 그게 맞더라고요. 탕비실에서 나눈 소소한 수다 덕분에 가족처럼 가까워졌어요."
        }
      },
      {
        "who": "them",
        "text": "Aduh, jangan bikin nangis, dong!",
        "gloss": {
          "en": "Oh no, don't make us cry!",
          "ko": "아, 울리지 마!"
        }
      },
      {
        "who": "me",
        "text": "Iya nih, momen begini emang bikin baper. Jujur aja, kantor ini nggak akan sama tanpa Ibu.",
        "gloss": {
          "en": "I know, moments like this really get to you. Honestly, this office won't be the same without you.",
          "ko": "그러게요, 이런 순간은 감정이 북받치네요. 솔직히 선배 없는 회사는 예전 같지 않을 거예요."
        }
      },
      {
        "who": "them",
        "text": "Terus, Bu Ratna mau ke mana sih sebenarnya?",
        "gloss": {
          "en": "So where is Bu Ratna actually going?",
          "ko": "근데 라트나 씨는 어디로 가시는 거야?"
        }
      },
      {
        "who": "me",
        "text": "Soal itu, beliau mau buka usaha kue sendiri. Kami semua pasti jadi pelanggan setia.",
        "gloss": {
          "en": "As for that, she's going to start her own cake business. We'll all be loyal customers for sure.",
          "ko": "그 얘기라면, 직접 케이크 가게를 차리신대요. 저희 모두 단골 될 거예요."
        }
      },
      {
        "who": "them",
        "text": "Asal dapat diskon, ya!",
        "gloss": {
          "en": "As long as we get a discount!",
          "ko": "할인만 해 준다면!"
        }
      },
      {
        "who": "me",
        "text": "Nah, itu dia. Kalau dikasih diskon, kami janji promosiin ke mana-mana.",
        "gloss": {
          "en": "Exactly. If we get a discount, we promise to promote it everywhere.",
          "ko": "바로 그거죠. 할인해 주시면 여기저기 홍보해 드릴게요."
        }
      },
      {
        "who": "them",
        "text": "Hahaha. Oke, penutupnya?",
        "gloss": {
          "en": "Ha ha. Okay, how will you close?",
          "ko": "하하. 좋아, 마무리는?"
        }
      },
      {
        "who": "me",
        "text": "Bu Ratna, terima kasih untuk semuanya. Bekerja sama dengan Ibu merupakan pengalaman yang sangat berharga. Sukses selalu!",
        "gloss": {
          "en": "Bu Ratna, thank you for everything. Working with you has been a truly precious experience. Wishing you every success!",
          "ko": "라트나 씨, 모든 것에 감사드려요. 함께 일한 건 정말 소중한 경험이었어요. 늘 잘되시길!"
        }
      }
    ]
  },
  {
    "id": "id-5-2",
    "stage": 5,
    "situation": 1,
    "setting": {
      "en": "Hanging out at a café with close friends who tease you for being late",
      "ko": "늦게 왔다고 놀리는 친한 친구들과 카페에서 수다 떨기"
    },
    "goal": {
      "en": "Laugh along with your friends' teasing, tell a funny story about your date with good timing, and keep the mood light.",
      "ko": "친구들의 놀림을 웃으며 받아넘기고, 데이트 에피소드를 맛깔나게 풀며 가벼운 분위기를 이어 간다."
    },
    "expressions": [
      "ya ampun",
      "emang sih",
      "ujung-ujungnya",
      "kok bisa",
      "ada udang di balik batu",
      "santai aja",
      "gitu deh",
      "salah fokus",
      "mending",
      "lain kali aja"
    ],
    "grammar": [
      1,
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Eh, kok kamu telat sih? Kita udah nungguin dari tadi.",
        "gloss": {
          "en": "Hey, how come you're late? We've been waiting forever.",
          "ko": "야, 왜 늦었어? 우리 아까부터 기다렸잖아."
        }
      },
      {
        "who": "me",
        "text": "Ya ampun, maaf banget. Tadi ojeknya nyasar, muter-muter terus.",
        "gloss": {
          "en": "Oh my gosh, I'm so sorry. The ojek got lost and kept going round in circles.",
          "ko": "어머, 진짜 미안. 오젝 기사님이 길을 잃어서 계속 빙빙 돌았어."
        }
      },
      {
        "who": "them",
        "text": "Alasan klasik! Bilang aja kamu baru bangun.",
        "gloss": {
          "en": "Classic excuse! Just admit you only just woke up.",
          "ko": "단골 핑계네! 그냥 방금 일어났다고 해."
        }
      },
      {
        "who": "me",
        "text": "Emang sih aku baru bangun jam sebelas, tapi ojeknya tetap nyasar, kok!",
        "gloss": {
          "en": "Okay, true, I only woke up at eleven, but the ojek really did get lost!",
          "ko": "그건 맞아, 11시에 일어나긴 했어. 근데 오젝이 길 잃은 것도 진짜라니까!"
        }
      },
      {
        "who": "them",
        "text": "Hahaha, ngaku juga akhirnya. Eh, gimana kencan kamu kemarin?",
        "gloss": {
          "en": "Ha ha, finally you admit it. Hey, how was your date yesterday?",
          "ko": "하하, 결국 인정하네. 근데 어제 데이트는 어땠어?"
        }
      },
      {
        "who": "me",
        "text": "Kencannya sih lancar. Cuma ujung-ujungnya aku yang bayar semua.",
        "gloss": {
          "en": "The date itself went fine. It's just that in the end I paid for everything.",
          "ko": "데이트 자체는 순조로웠어. 근데 결국 내가 다 냈어."
        }
      },
      {
        "who": "them",
        "text": "Lho, katanya dia yang ngajak?",
        "gloss": {
          "en": "Wait, didn't you say he was the one who asked you out?",
          "ko": "엥, 걔가 먼저 만나자고 했다며?"
        }
      },
      {
        "who": "me",
        "text": "Nah, itu dia! Kok bisa, ya? Pas mau bayar, dompetnya tiba-tiba ketinggalan.",
        "gloss": {
          "en": "Exactly! How does that even happen? Right when it was time to pay, his wallet was suddenly 'left at home'.",
          "ko": "그러니까! 어떻게 그럴 수가 있지? 계산하려는데 갑자기 지갑을 두고 왔대."
        }
      },
      {
        "who": "them",
        "text": "Waduh, curiga aku. Jangan-jangan dia sengaja.",
        "gloss": {
          "en": "Uh-oh, I'm suspicious. Maybe he did it on purpose.",
          "ko": "헐, 수상한데. 혹시 일부러 그런 거 아냐?"
        }
      },
      {
        "who": "me",
        "text": "Aku juga mikir gitu. Kayaknya ada udang di balik batu, deh.",
        "gloss": {
          "en": "I was thinking the same. I bet there's something fishy going on.",
          "ko": "나도 그렇게 생각했어. 뭔가 꿍꿍이가 있는 것 같아."
        }
      },
      {
        "who": "them",
        "text": "Terus kamu marah nggak?",
        "gloss": {
          "en": "So were you angry?",
          "ko": "그래서 화났어?"
        }
      },
      {
        "who": "me",
        "text": "Ya nggak lah. Santai aja, anggap aja traktiran pertama. Gitu deh.",
        "gloss": {
          "en": "Of course not. I just took it easy, treated it as my first treat. That's how it went.",
          "ko": "아니 뭐. 그냥 쿨하게 첫 턱 낸 셈 쳤지. 그렇게 됐어."
        }
      },
      {
        "who": "them",
        "text": "Kamu terlalu baik. Eh, tapi foto profilnya cakep banget, lho.",
        "gloss": {
          "en": "You're too nice. But hey, his profile picture is really good-looking, you know.",
          "ko": "너 너무 착하다. 근데 걔 프로필 사진 진짜 잘생겼더라."
        }
      },
      {
        "who": "me",
        "text": "Kok kamu malah salah fokus sih? Yang penting kan dompetnya!",
        "gloss": {
          "en": "Why are you focusing on the wrong thing? The point is his wallet!",
          "ko": "왜 엉뚱한 데 꽂혀? 중요한 건 지갑이잖아!"
        }
      },
      {
        "who": "them",
        "text": "Hahaha, iya, iya. Terus, mau ketemu dia lagi?",
        "gloss": {
          "en": "Ha ha, okay, okay. So, are you going to see him again?",
          "ko": "하하, 알았어 알았어. 그래서 또 만날 거야?"
        }
      },
      {
        "who": "me",
        "text": "Mending lain kali aja, deh. Nanti aku kabarin kalau dompetnya udah ketemu.",
        "gloss": {
          "en": "Better to leave it for another time. I'll let you know once his wallet turns up.",
          "ko": "다음에 보는 게 낫겠어. 걔 지갑 찾으면 알려 줄게."
        }
      }
    ]
  },
  {
    "id": "id-5-3",
    "stage": 5,
    "situation": 2,
    "setting": {
      "en": "Your manager, Pak Arief, asks you to run a client event this Saturday",
      "ko": "상사 아리프 씨가 이번 토요일 고객 행사를 맡아 달라고 부탁하다"
    },
    "goal": {
      "en": "Turn down your manager's request without sounding unwilling, keep the relationship warm, and offer a workable alternative.",
      "ko": "하기 싫어하는 듯 보이지 않게 상사의 부탁을 거절하고, 관계를 지키면서 현실적인 대안을 제시한다."
    },
    "expressions": [
      "nggak enak hati",
      "dengan segala hormat",
      "apa boleh buat"
    ],
    "grammar": [
      3,
      4,
      5
    ],
    "earlierGrammar": [
      "4:6"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Eh, kebetulan ketemu. Ada waktu sebentar?",
        "gloss": {
          "en": "Oh, good timing. Do you have a minute?",
          "ko": "어, 마침 잘 만났네. 잠깐 시간 돼?"
        }
      },
      {
        "who": "me",
        "text": "Ada, Pak. Silakan, ada yang bisa saya bantu?",
        "gloss": {
          "en": "Yes, sir. Please, is there something I can help with?",
          "ko": "네, 부장님. 말씀하세요, 뭘 도와드릴까요?"
        }
      },
      {
        "who": "them",
        "text": "Sabtu ini ada gathering klien. Saya mau kamu yang pegang acaranya.",
        "gloss": {
          "en": "There's a client gathering this Saturday. I'd like you to run the event.",
          "ko": "이번 토요일에 고객 모임이 있어. 자네가 행사를 맡아 줬으면 해."
        }
      },
      {
        "who": "me",
        "text": "Wah, terima kasih atas kepercayaannya, Pak. Tapi saya jadi nggak enak hati, sebenarnya...",
        "gloss": {
          "en": "Oh, thank you for trusting me with it. But actually, I feel a bit awkward about this...",
          "ko": "와, 믿어 주셔서 감사합니다. 그런데 사실 좀 죄송한 마음이 드는 게..."
        }
      },
      {
        "who": "them",
        "text": "Kenapa? Kamu kan biasanya jago soal beginian.",
        "gloss": {
          "en": "Why? You're usually great at this sort of thing.",
          "ko": "왜? 자네 이런 거 원래 잘하잖아."
        }
      },
      {
        "who": "me",
        "text": "Dengan segala hormat, Pak, sepertinya Sabtu ini agak sulit buat saya.",
        "gloss": {
          "en": "With all due respect, sir, this Saturday seems a bit difficult for me.",
          "ko": "외람되지만, 이번 토요일은 제가 좀 어려울 것 같습니다."
        }
      },
      {
        "who": "them",
        "text": "Ada acara keluarga?",
        "gloss": {
          "en": "A family event?",
          "ko": "집안 행사라도 있어?"
        }
      },
      {
        "who": "me",
        "text": "Iya, Pak. Adik saya menikah, dan acaranya dari pagi sampai malam.",
        "gloss": {
          "en": "Yes, sir. My younger sibling is getting married, and it runs from morning till night.",
          "ko": "네. 동생이 결혼해서 아침부터 밤까지 행사가 있어요."
        }
      },
      {
        "who": "them",
        "text": "Oh, begitu. Padahal saya sudah bilang ke direktur.",
        "gloss": {
          "en": "Oh, I see. And I already told the director.",
          "ko": "아, 그렇구나. 이미 이사님께 말씀드렸는데."
        }
      },
      {
        "who": "me",
        "text": "Saya tahu waktunya mepet, Pak. Tapi apa boleh buat, acara keluarga ini sudah direncanakan lama.",
        "gloss": {
          "en": "I know it's short notice, sir. But it can't be helped — this family event was planned long ago.",
          "ko": "시간이 촉박한 거 압니다. 하지만 어쩔 수 없게도 이 행사는 오래전부터 잡혀 있었어요."
        }
      },
      {
        "who": "them",
        "text": "Ya sudah. Terus, siapa yang bisa gantiin kamu?",
        "gloss": {
          "en": "All right. So who can take your place?",
          "ko": "할 수 없지. 그럼 누가 대신할 수 있을까?"
        }
      },
      {
        "who": "me",
        "text": "Soal pengganti, Dimas sepertinya siap. Dia sudah ikut persiapan dari awal.",
        "gloss": {
          "en": "As for a replacement, Dimas seems ready. He's been part of the preparations from the start.",
          "ko": "대신할 사람이라면, 디마스가 준비돼 있는 것 같아요. 처음부터 준비에 참여했거든요."
        }
      },
      {
        "who": "them",
        "text": "Dimas? Dia masih baru, lho.",
        "gloss": {
          "en": "Dimas? He's still new, you know.",
          "ko": "디마스? 아직 신입이잖아."
        }
      },
      {
        "who": "me",
        "text": "Betul, tapi dia cepat belajar. Materinya biar saya siapkan malam ini, jadi dia tinggal jalan.",
        "gloss": {
          "en": "True, but he learns fast. Let me prepare the materials tonight, so he just has to run with it.",
          "ko": "맞습니다만 금방 배워요. 자료는 제가 오늘 밤 준비해 둘 테니 그대로 진행만 하면 돼요."
        }
      },
      {
        "who": "them",
        "text": "Hmm, ya sudah. Tolong briefing Dimas, ya.",
        "gloss": {
          "en": "Hmm, all right. Please brief Dimas, then.",
          "ko": "음, 알았어. 디마스한테 브리핑 좀 해 줘."
        }
      },
      {
        "who": "me",
        "text": "Siap, Pak. Besok pagi-pagi saya temui dia. Sekali lagi, terima kasih atas pengertiannya.",
        "gloss": {
          "en": "Will do, sir. I'll meet him first thing tomorrow. Once again, thank you for understanding.",
          "ko": "알겠습니다. 내일 아침 일찍 만나 볼게요. 다시 한번 이해해 주셔서 감사합니다."
        }
      }
    ]
  },
  {
    "id": "id-5-4",
    "stage": 5,
    "situation": 3,
    "setting": {
      "en": "Doing a live video review of a new film and answering your followers' comments",
      "ko": "새 영화 리뷰를 라이브 방송으로 하며 팔로워 댓글에 답하기"
    },
    "goal": {
      "en": "Give an honest, balanced, spoiler-free review in a lively social-media tone while responding naturally to followers' comments.",
      "ko": "스포일러 없이 솔직하고 균형 잡힌 리뷰를 SNS다운 생기 있는 말투로 전하면서 팔로워 댓글에 자연스럽게 반응한다."
    },
    "expressions": [
      "jujur aja",
      "bikin baper",
      "salah fokus",
      "mending",
      "ujung-ujungnya"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Halo, Kak! Udah nonton film 'Pulang' belum? Bagus nggak?",
        "gloss": {
          "en": "Hi! Have you watched the film 'Pulang' yet? Is it good?",
          "ko": "안녕하세요! 영화 '풀랑' 보셨어요? 재밌어요?"
        }
      },
      {
        "who": "me",
        "text": "Halo semua! Udah dong, semalam. Langsung aja ya, jujur aja filmnya bagus banget.",
        "gloss": {
          "en": "Hi everyone! Of course, last night. Let's get straight to it — honestly, the film is really good.",
          "ko": "안녕하세요 여러분! 당연히 봤죠, 어젯밤에. 바로 말할게요, 솔직히 영화 진짜 좋아요."
        }
      },
      {
        "who": "them",
        "text": "Nggak spoiler, kan? Aku belum nonton!",
        "gloss": {
          "en": "No spoilers, right? I haven't seen it yet!",
          "ko": "스포 없죠? 저 아직 안 봤어요!"
        }
      },
      {
        "who": "me",
        "text": "Tenang, nggak ada spoiler kok. Ceritanya, seorang anak pulang kampung setelah sepuluh tahun di kota.",
        "gloss": {
          "en": "Don't worry, no spoilers. The story is about a young man going back to his village after ten years in the city.",
          "ko": "걱정 마세요, 스포 없어요. 도시에서 10년을 지낸 청년이 고향에 돌아가는 이야기예요."
        }
      },
      {
        "who": "them",
        "text": "Aktingnya gimana, Kak?",
        "gloss": {
          "en": "How's the acting?",
          "ko": "연기는 어때요?"
        }
      },
      {
        "who": "me",
        "text": "Pemeran utamanya, wah, keren banget. Adegan di stasiun itu bikin baper parah.",
        "gloss": {
          "en": "The lead actor — wow, amazing. That scene at the station gets you right in the feels.",
          "ko": "주연 배우요? 와, 진짜 멋져요. 역 장면은 완전 감정 폭발이에요."
        }
      },
      {
        "who": "them",
        "text": "Ada yang kurang nggak?",
        "gloss": {
          "en": "Is anything lacking?",
          "ko": "아쉬운 점은 없어요?"
        }
      },
      {
        "who": "me",
        "text": "Ada sih. Bagian tengahnya agak lambat, jadi sempat ngantuk-ngantuk dikit.",
        "gloss": {
          "en": "There is something. The middle part is a bit slow, so I got a little drowsy.",
          "ko": "있긴 해요. 중간 부분이 좀 늘어져서 살짝 졸리더라고요."
        }
      },
      {
        "who": "them",
        "text": "Aku malah salah fokus sama pemandangannya di trailer!",
        "gloss": {
          "en": "I actually got distracted by the scenery in the trailer!",
          "ko": "저는 예고편 풍경에 시선 뺏겼어요!"
        }
      },
      {
        "who": "me",
        "text": "Sama, aku juga salah fokus! Sinematografinya merupakan yang terbaik tahun ini, menurutku.",
        "gloss": {
          "en": "Same, I got distracted too! I think the cinematography is the best of the year.",
          "ko": "저도 거기 꽂혔어요! 촬영은 올해 최고라고 생각해요."
        }
      },
      {
        "who": "them",
        "text": "Mending nonton di bioskop atau tunggu di streaming?",
        "gloss": {
          "en": "Is it better to see it in the cinema or wait for streaming?",
          "ko": "극장에서 보는 게 나아요, 스트리밍 기다리는 게 나아요?"
        }
      },
      {
        "who": "me",
        "text": "Mending di bioskop, deh. Suaranya beda jauh, apalagi pas adegan hujan.",
        "gloss": {
          "en": "Definitely better in the cinema. The sound is way different, especially in the rain scene.",
          "ko": "극장이 낫죠. 사운드가 확 달라요, 특히 비 오는 장면에서요."
        }
      },
      {
        "who": "them",
        "text": "Kalau dikasih nilai, berapa dari sepuluh?",
        "gloss": {
          "en": "If you had to rate it, how many out of ten?",
          "ko": "점수 주면 10점 만점에 몇 점이에요?"
        }
      },
      {
        "who": "me",
        "text": "Delapan dari sepuluh. Ujung-ujungnya, aku keluar bioskop sambil senyum-senyum sendiri.",
        "gloss": {
          "en": "Eight out of ten. In the end, I walked out of the cinema smiling to myself.",
          "ko": "10점 만점에 8점이요. 결국 극장 나오면서 혼자 실실 웃고 있더라고요."
        }
      },
      {
        "who": "them",
        "text": "Oke, Kak, makasih reviewnya!",
        "gloss": {
          "en": "Okay, thanks for the review!",
          "ko": "좋아요, 리뷰 고마워요!"
        }
      },
      {
        "who": "me",
        "text": "Sama-sama! Tulis pendapat kalian di kolom komentar, ya, nanti aku bacain satu-satu.",
        "gloss": {
          "en": "You're welcome! Write your thoughts in the comments, and I'll read them out one by one later.",
          "ko": "천만에요! 댓글로 의견 남겨 주세요, 나중에 하나하나 읽어 드릴게요."
        }
      }
    ]
  }
];
