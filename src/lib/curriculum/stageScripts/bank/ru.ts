import type { StageScript } from "../../stageScripts.ts";

/**
 * ru 대본 은행(2026-10-30 사용자 "여러 개 만들어 두고 추천" → A: 지금 단계 이하에서) — 단계 조건·상황 목록과 따로, 오늘 할 것 끝의 대화 한 칸으로 추천(curriculum/scriptBank.ts).
 * 1~3단계 20개씩, 줄 8개, 내 줄에 그 단계 이하 틀 태그. Claude가 쓰고 scripts/script-bank.ts로 검사, 원어민 확인 전.
 */
export const RU_BANK: StageScript[] = [
  {
    "id": "ru-1-b01",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At a café counter",
      "ko": "카페 계산대에서"
    },
    "expressions": [
      "Здравствуйте",
      "Сколько стоит",
      "Хорошо",
      "Спасибо"
    ],
    "grammar": [
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Здравствуйте! Что вы хотите?",
        "gloss": {
          "en": "Hello! What would you like?",
          "ko": "안녕하세요! 뭘 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Здравствуйте. Можно чай, пожалуйста?",
        "gloss": {
          "en": "Hello. Can I have a tea, please?",
          "ko": "안녕하세요. 차 한 잔 주시겠어요?"
        },
        "frames": [
          "ru-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Чёрный или зелёный?",
        "gloss": {
          "en": "Black or green?",
          "ko": "홍차요, 녹차요?"
        }
      },
      {
        "who": "me",
        "text": "Зелёный. Сколько стоит чай?",
        "gloss": {
          "en": "Green. How much is the tea?",
          "ko": "녹차요. 차는 얼마예요?"
        },
        "frames": [
          "ru-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Сто рублей.",
        "gloss": {
          "en": "A hundred rubles.",
          "ko": "백 루블이에요."
        }
      },
      {
        "who": "me",
        "text": "Хорошо. У вас есть сахар?",
        "gloss": {
          "en": "OK. Do you have sugar?",
          "ko": "좋아요. 설탕 있어요?"
        },
        "frames": [
          "ru-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Да, вот сахар.",
        "gloss": {
          "en": "Yes, here's the sugar.",
          "ko": "네, 설탕 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "Спасибо!",
        "gloss": {
          "en": "Thank you!",
          "ko": "고마워요!"
        }
      }
    ]
  },
  {
    "id": "ru-1-b02",
    "stage": 1,
    "bank": true,
    "name": {
      "text": [
        "Минсу"
      ],
      "en": [
        "Minsu"
      ],
      "ko": [
        "민수"
      ]
    },
    "setting": {
      "en": "Meeting someone at a language exchange",
      "ko": "언어 교환 모임에서 처음 만남"
    },
    "expressions": [
      "Привет",
      "Меня зовут",
      "Очень приятно",
      "Я из Кореи",
      "Спасибо",
      "Пока"
    ],
    "grammar": [
      0,
      1,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Привет! Как тебя зовут?",
        "gloss": {
          "en": "Hi! What's your name?",
          "ko": "안녕하세요! 이름이 뭐예요?"
        }
      },
      {
        "who": "me",
        "text": "Привет! Меня зовут Минсу.",
        "gloss": {
          "en": "Hi! My name is Minsu.",
          "ko": "안녕하세요! 제 이름은 민수예요."
        },
        "frames": [
          "ru-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "Очень приятно! Я Катя. Ты откуда?",
        "gloss": {
          "en": "Nice to meet you! I'm Katya. Where are you from?",
          "ko": "반가워요! 저는 카탸예요. 어디서 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "Очень приятно. Я из Кореи.",
        "gloss": {
          "en": "Nice to meet you. I'm from Korea.",
          "ko": "반가워요. 저는 한국에서 왔어요."
        },
        "frames": [
          "ru-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "Ты студент?",
        "gloss": {
          "en": "Are you a student?",
          "ko": "학생이에요?"
        }
      },
      {
        "who": "me",
        "text": "Да, я студент. Я изучаю русский язык.",
        "gloss": {
          "en": "Yes, I'm a student. I study Russian.",
          "ko": "네, 학생이에요. 러시아어를 공부해요."
        },
        "frames": [
          "ru-f1-03",
          "ru-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "Здорово! Удачи!",
        "gloss": {
          "en": "Great! Good luck!",
          "ko": "멋지네요! 화이팅!"
        }
      },
      {
        "who": "me",
        "text": "Спасибо, Катя! Пока!",
        "gloss": {
          "en": "Thanks, Katya! Bye!",
          "ko": "고마워요, 카탸! 안녕!"
        }
      }
    ]
  },
  {
    "id": "ru-1-b03",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Asking the way near a station",
      "ko": "역 근처에서 길 묻기"
    },
    "expressions": [
      "Извините",
      "Я не понимаю",
      "Спасибо"
    ],
    "grammar": [
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Вам помочь?",
        "gloss": {
          "en": "Can I help you?",
          "ko": "도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Да, спасибо. Где здесь метро?",
        "gloss": {
          "en": "Yes, thanks. Where is the metro around here?",
          "ko": "네, 고마워요. 이 근처에 지하철역이 어디예요?"
        },
        "frames": [
          "ru-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "Метро там, налево, за магазином.",
        "gloss": {
          "en": "The metro is over there, to the left, behind the shop.",
          "ko": "지하철은 저쪽 왼쪽, 가게 뒤에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Извините, я не понимаю.",
        "gloss": {
          "en": "Sorry, I don't understand.",
          "ko": "죄송해요, 이해가 안 돼요."
        }
      },
      {
        "who": "them",
        "text": "Налево. Вот там.",
        "gloss": {
          "en": "To the left. Right there.",
          "ko": "왼쪽이요. 바로 저기요."
        }
      },
      {
        "who": "me",
        "text": "А, понятно. Спасибо за помощь!",
        "gloss": {
          "en": "Ah, I see. Thanks for your help!",
          "ko": "아, 알겠어요. 도와주셔서 고마워요!"
        },
        "frames": [
          "ru-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Не за что.",
        "gloss": {
          "en": "You're welcome.",
          "ko": "천만에요."
        }
      },
      {
        "who": "me",
        "text": "Я не понимаю, где вход. Там?",
        "gloss": {
          "en": "I can't tell where the entrance is. Over there?",
          "ko": "입구가 어딘지 모르겠어요. 저기예요?"
        },
        "frames": [
          "ru-f1-13"
        ]
      }
    ]
  },
  {
    "id": "ru-1-b04",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At the supermarket checkout",
      "ko": "마트 계산대에서"
    },
    "expressions": [
      "Спасибо",
      "Пакет не нужен",
      "Сколько стоит",
      "Пожалуйста",
      "Это всё"
    ],
    "grammar": [
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Здравствуйте! Пакет нужен?",
        "gloss": {
          "en": "Hello! Do you need a bag?",
          "ko": "안녕하세요! 봉투 필요하세요?"
        }
      },
      {
        "who": "me",
        "text": "Нет, спасибо. Пакет не нужен.",
        "gloss": {
          "en": "No, thanks. I don't need a bag.",
          "ko": "아니요, 괜찮아요. 봉투는 필요 없어요."
        }
      },
      {
        "who": "them",
        "text": "Хорошо. Что-то ещё?",
        "gloss": {
          "en": "OK. Anything else?",
          "ko": "네. 더 필요한 거 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "У вас есть вода без газа?",
        "gloss": {
          "en": "Do you have still water?",
          "ko": "탄산 없는 물 있어요?"
        },
        "frames": [
          "ru-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Да, вот здесь.",
        "gloss": {
          "en": "Yes, right here.",
          "ko": "네, 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "Сколько стоит вода?",
        "gloss": {
          "en": "How much is the water?",
          "ko": "물은 얼마예요?"
        },
        "frames": [
          "ru-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Пятьдесят рублей.",
        "gloss": {
          "en": "Fifty rubles.",
          "ko": "오십 루블이에요."
        }
      },
      {
        "who": "me",
        "text": "Можно эту воду, пожалуйста? Это всё.",
        "gloss": {
          "en": "Can I have this water, please? That's all.",
          "ko": "이 물 주세요. 이게 다예요."
        },
        "frames": [
          "ru-f1-07"
        ]
      }
    ]
  },
  {
    "id": "ru-1-b05",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Checking in at a hotel",
      "ko": "호텔 체크인"
    },
    "expressions": [
      "Минуточку",
      "Пожалуйста",
      "Хорошо"
    ],
    "grammar": [
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Добрый вечер! Ваш паспорт, пожалуйста.",
        "gloss": {
          "en": "Good evening! Your passport, please.",
          "ko": "안녕하세요! 여권 주세요."
        }
      },
      {
        "who": "me",
        "text": "Минуточку... Где мой паспорт?",
        "gloss": {
          "en": "Just a moment... Where is my passport?",
          "ko": "잠깐만요... 제 여권이 어디 있지?"
        },
        "frames": [
          "ru-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "Посмотрите в сумке.",
        "gloss": {
          "en": "Look in your bag.",
          "ko": "가방 안을 보세요."
        }
      },
      {
        "who": "me",
        "text": "А, вот он. Пожалуйста.",
        "gloss": {
          "en": "Ah, here it is. Here you go.",
          "ko": "아, 여기 있네요. 여기요."
        }
      },
      {
        "who": "them",
        "text": "Спасибо. Ваш номер двести пять.",
        "gloss": {
          "en": "Thank you. Your room is two hundred five.",
          "ko": "고마워요. 방은 이백오 호예요."
        }
      },
      {
        "who": "me",
        "text": "Спасибо. У вас есть вайфай?",
        "gloss": {
          "en": "Thanks. Do you have Wi-Fi?",
          "ko": "고마워요. 와이파이 있어요?"
        },
        "frames": [
          "ru-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Да, пароль на карточке.",
        "gloss": {
          "en": "Yes, the password is on the card.",
          "ko": "네, 비밀번호는 카드에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Хорошо. Спасибо за помощь!",
        "gloss": {
          "en": "OK. Thanks for your help!",
          "ko": "좋아요. 도와주셔서 고마워요!"
        },
        "frames": [
          "ru-f1-15"
        ]
      }
    ]
  },
  {
    "id": "ru-1-b06",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Russian class: noun gender",
      "ko": "러시아어 수업: 명사의 성"
    },
    "expressions": [
      "Извините",
      "Говорите медленнее",
      "Спасибо"
    ],
    "grammar": [
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Итак, книга. Как правильно: мой, моя или моё?",
        "gloss": {
          "en": "So, 'book'. Which is right: мой, моя or моё?",
          "ko": "자, '책'이에요. 뭐가 맞을까요? мой, моя, моё?"
        }
      },
      {
        "who": "me",
        "text": "Моя! Это моя книга!",
        "gloss": {
          "en": "Moya! This is my book!",
          "ko": "моя요! 이건 제 책이에요!"
        },
        "frames": [
          "ru-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Правильно! А окно? Он, она или оно?",
        "gloss": {
          "en": "Right! And 'window'? He, she or it?",
          "ko": "맞아요! 그럼 '창문'은요? 남성, 여성, 중성?"
        }
      },
      {
        "who": "me",
        "text": "Извините, что такое «окно»?",
        "gloss": {
          "en": "Sorry, what is «окно»?",
          "ko": "죄송한데, «окно»가 뭐예요?"
        },
        "frames": [
          "ru-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Окно — это вот это. Оно.",
        "gloss": {
          "en": "«Окно» is this. It's «оно».",
          "ko": "«окно»는 바로 이거예요. 중성이에요."
        }
      },
      {
        "who": "me",
        "text": "Говорите медленнее, пожалуйста.",
        "gloss": {
          "en": "Please speak more slowly.",
          "ko": "좀 더 천천히 말해 주세요."
        },
        "frames": [
          "ru-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "Хорошо. Окно. Оно. Моё окно.",
        "gloss": {
          "en": "OK. Window. It. My window.",
          "ko": "네. 창문. 중성. 내 창문."
        }
      },
      {
        "who": "me",
        "text": "Понятно! Спасибо за урок!",
        "gloss": {
          "en": "I see! Thank you for the lesson!",
          "ko": "알겠어요! 수업 고마워요!"
        },
        "frames": [
          "ru-f1-15"
        ]
      }
    ]
  },
  {
    "id": "ru-1-b07",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Meeting a friend's family at a birthday party",
      "ko": "생일 파티에서 친구 가족과 인사"
    },
    "expressions": [
      "Здравствуйте",
      "Привет",
      "Я из Кореи",
      "Спасибо"
    ],
    "grammar": [
      0,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Это моя сестра Маша и моя мама Анна Петровна.",
        "gloss": {
          "en": "This is my sister Masha and my mom Anna Petrovna.",
          "ko": "이쪽은 제 여동생 마샤, 이쪽은 엄마 안나 페트로브나예요."
        }
      },
      {
        "who": "me",
        "text": "Здравствуйте, Анна Петровна! Привет, Маша!",
        "gloss": {
          "en": "Hello, Anna Petrovna! Hi, Masha!",
          "ko": "안녕하세요, 안나 페트로브나! 안녕, 마샤!"
        },
        "frames": [
          "ru-f1-16"
        ]
      },
      {
        "who": "them",
        "text": "Здравствуй! Ты откуда?",
        "gloss": {
          "en": "Hello! Where are you from?",
          "ko": "안녕하세요! 어디서 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "Я из Кореи. Я работаю в банке.",
        "gloss": {
          "en": "I'm from Korea. I work at a bank.",
          "ko": "한국에서 왔어요. 은행에서 일해요."
        },
        "frames": [
          "ru-f1-02",
          "ru-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "Ты хорошо говоришь по-русски!",
        "gloss": {
          "en": "You speak Russian well!",
          "ko": "러시아어를 잘하네요!"
        }
      },
      {
        "who": "me",
        "text": "Спасибо! Я изучаю русский язык.",
        "gloss": {
          "en": "Thank you! I'm studying Russian.",
          "ko": "고마워요! 러시아어를 공부하고 있어요."
        },
        "frames": [
          "ru-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "Молодец! Проходи, пожалуйста.",
        "gloss": {
          "en": "Well done! Come in, please.",
          "ko": "대단해요! 어서 들어오세요."
        }
      },
      {
        "who": "me",
        "text": "Спасибо! Это вам.",
        "gloss": {
          "en": "Thank you! This is for you.",
          "ko": "고마워요! 이거 선물이에요."
        }
      }
    ]
  },
  {
    "id": "ru-1-b08",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying fruit at the market",
      "ko": "시장에서 과일 사기"
    },
    "expressions": [
      "Здравствуйте",
      "Сколько стоит",
      "Хорошо",
      "Пожалуйста",
      "Это всё",
      "Спасибо"
    ],
    "grammar": [
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Здравствуйте! Что хотите?",
        "gloss": {
          "en": "Hello! What would you like?",
          "ko": "안녕하세요! 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Здравствуйте. Сколько стоит килограмм яблок?",
        "gloss": {
          "en": "Hello. How much is a kilo of apples?",
          "ko": "안녕하세요. 사과 일 킬로에 얼마예요?"
        },
        "frames": [
          "ru-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Сто двадцать рублей.",
        "gloss": {
          "en": "A hundred and twenty rubles.",
          "ko": "백이십 루블이에요."
        }
      },
      {
        "who": "me",
        "text": "Хорошо. Можно два килограмма, пожалуйста?",
        "gloss": {
          "en": "OK. Can I have two kilos, please?",
          "ko": "좋아요. 이 킬로 주시겠어요?"
        },
        "frames": [
          "ru-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Вот, пожалуйста. Что-то ещё?",
        "gloss": {
          "en": "Here you go. Anything else?",
          "ko": "여기요. 더 필요한 거 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "У вас есть груши?",
        "gloss": {
          "en": "Do you have pears?",
          "ko": "배도 있어요?"
        },
        "frames": [
          "ru-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Нет, груш сегодня нет.",
        "gloss": {
          "en": "No, no pears today.",
          "ko": "아니요, 오늘은 배가 없어요."
        }
      },
      {
        "who": "me",
        "text": "Хорошо. Это всё. Спасибо!",
        "gloss": {
          "en": "OK. That's all. Thank you!",
          "ko": "알겠어요. 이게 다예요. 고마워요!"
        }
      }
    ]
  },
  {
    "id": "ru-1-b09",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "First day at a new office",
      "ko": "새 사무실 첫날"
    },
    "expressions": [
      "Здравствуйте",
      "Очень приятно",
      "Говорите медленнее"
    ],
    "grammar": [
      0,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Здравствуйте! Вы новый сотрудник?",
        "gloss": {
          "en": "Hello! Are you the new employee?",
          "ko": "안녕하세요! 새로 오신 직원이세요?"
        }
      },
      {
        "who": "me",
        "text": "Здравствуйте! Да, я новый менеджер.",
        "gloss": {
          "en": "Hello! Yes, I'm the new manager.",
          "ko": "안녕하세요! 네, 새로 온 매니저예요."
        },
        "frames": [
          "ru-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "Очень приятно. Я Сергей. Вы из Москвы?",
        "gloss": {
          "en": "Nice to meet you. I'm Sergey. Are you from Moscow?",
          "ko": "반가워요. 저는 세르게이예요. 모스크바에서 오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Очень приятно. Нет, я из Сеула.",
        "gloss": {
          "en": "Nice to meet you. No, I'm from Seoul.",
          "ko": "반가워요. 아니요, 서울에서 왔어요."
        },
        "frames": [
          "ru-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "А, интересно! Вы говорите по-русски?",
        "gloss": {
          "en": "Oh, interesting! Do you speak Russian?",
          "ko": "아, 그렇군요! 러시아어 하세요?"
        }
      },
      {
        "who": "me",
        "text": "Немного. Говорите медленнее, пожалуйста.",
        "gloss": {
          "en": "A little. Please speak more slowly.",
          "ko": "조금요. 좀 더 천천히 말해 주세요."
        },
        "frames": [
          "ru-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "Конечно. Вот ваш стол.",
        "gloss": {
          "en": "Of course. Here's your desk.",
          "ko": "물론이죠. 여기가 자리예요."
        }
      },
      {
        "who": "me",
        "text": "Спасибо. А где здесь кухня?",
        "gloss": {
          "en": "Thanks. And where is the kitchen around here?",
          "ko": "고마워요. 여기 탕비실은 어디예요?"
        },
        "frames": [
          "ru-f1-05"
        ]
      }
    ]
  },
  {
    "id": "ru-1-b10",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At the pharmacy",
      "ko": "약국에서"
    },
    "expressions": [
      "Здравствуйте",
      "Хорошо",
      "Пакет не нужен",
      "До свидания"
    ],
    "grammar": [
      2,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Здравствуйте. Слушаю вас.",
        "gloss": {
          "en": "Hello. How can I help?",
          "ko": "안녕하세요. 말씀하세요."
        }
      },
      {
        "who": "me",
        "text": "Здравствуйте. У вас есть аспирин?",
        "gloss": {
          "en": "Hello. Do you have aspirin?",
          "ko": "안녕하세요. 아스피린 있어요?"
        },
        "frames": [
          "ru-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Да, есть. Вот.",
        "gloss": {
          "en": "Yes, we do. Here.",
          "ko": "네, 있어요. 여기요."
        }
      },
      {
        "who": "me",
        "text": "Хорошо. Можно две пачки, пожалуйста?",
        "gloss": {
          "en": "OK. Can I have two packs, please?",
          "ko": "좋아요. 두 통 주시겠어요?"
        },
        "frames": [
          "ru-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Вот, пожалуйста. Пакет нужен?",
        "gloss": {
          "en": "Here you go. Do you need a bag?",
          "ko": "여기요. 봉투 필요하세요?"
        }
      },
      {
        "who": "me",
        "text": "Нет, пакет не нужен. У меня есть сумка.",
        "gloss": {
          "en": "No, I don't need a bag. I have a bag with me.",
          "ko": "아니요, 봉투는 필요 없어요. 가방이 있어요."
        },
        "frames": [
          "ru-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Хорошо. Всего доброго!",
        "gloss": {
          "en": "OK. All the best!",
          "ko": "네. 안녕히 가세요!"
        }
      },
      {
        "who": "me",
        "text": "Спасибо за помощь. До свидания!",
        "gloss": {
          "en": "Thanks for your help. Goodbye!",
          "ko": "도와주셔서 고마워요. 안녕히 계세요!"
        },
        "frames": [
          "ru-f1-15"
        ]
      }
    ]
  },
  {
    "id": "ru-1-b11",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Buying a museum ticket",
      "ko": "박물관 표 사기"
    },
    "expressions": [
      "Сколько стоит",
      "Спасибо",
      "Где здесь туалет"
    ],
    "grammar": [
      0,
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Добрый день! Билет?",
        "gloss": {
          "en": "Good afternoon! A ticket?",
          "ko": "안녕하세요! 표 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Да. Сколько стоит билет?",
        "gloss": {
          "en": "Yes. How much is a ticket?",
          "ko": "네. 표가 얼마예요?"
        },
        "frames": [
          "ru-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Пятьсот рублей. Вы студент?",
        "gloss": {
          "en": "Five hundred rubles. Are you a student?",
          "ko": "오백 루블이에요. 학생이세요?"
        }
      },
      {
        "who": "me",
        "text": "Да, я студент.",
        "gloss": {
          "en": "Yes, I'm a student.",
          "ko": "네, 학생이에요."
        },
        "frames": [
          "ru-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "Тогда триста. У вас есть студенческий?",
        "gloss": {
          "en": "Then three hundred. Do you have a student card?",
          "ko": "그럼 삼백이에요. 학생증 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Да, у меня есть студенческий. Вот.",
        "gloss": {
          "en": "Yes, I have a student card. Here.",
          "ko": "네, 학생증 있어요. 여기요."
        },
        "frames": [
          "ru-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Хорошо. Вот ваш билет.",
        "gloss": {
          "en": "OK. Here's your ticket.",
          "ko": "네. 표 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "Спасибо! Где здесь туалет?",
        "gloss": {
          "en": "Thank you! Where's the restroom around here?",
          "ko": "고마워요! 여기 화장실이 어디예요?"
        },
        "frames": [
          "ru-f1-05"
        ]
      }
    ]
  },
  {
    "id": "ru-1-b12",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Passport control at the airport",
      "ko": "공항 입국 심사"
    },
    "expressions": [
      "Пожалуйста",
      "Я из Кореи",
      "Спасибо",
      "Извините"
    ],
    "grammar": [
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Здравствуйте! Ваш паспорт, пожалуйста.",
        "gloss": {
          "en": "Hello! Your passport, please.",
          "ko": "안녕하세요! 여권 주세요."
        }
      },
      {
        "who": "me",
        "text": "Вот, пожалуйста.",
        "gloss": {
          "en": "Here you are.",
          "ko": "여기 있어요."
        }
      },
      {
        "who": "them",
        "text": "Вы из Кореи?",
        "gloss": {
          "en": "Are you from Korea?",
          "ko": "한국에서 오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Да, я из Кореи.",
        "gloss": {
          "en": "Yes, I'm from Korea.",
          "ko": "네, 한국에서 왔어요."
        },
        "frames": [
          "ru-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "Хорошо. Добро пожаловать!",
        "gloss": {
          "en": "OK. Welcome!",
          "ko": "네. 환영합니다!"
        }
      },
      {
        "who": "me",
        "text": "Спасибо. Извините, где выход?",
        "gloss": {
          "en": "Thank you. Excuse me, where is the exit?",
          "ko": "고마워요. 실례지만 출구가 어디예요?"
        },
        "frames": [
          "ru-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "Выход там, направо.",
        "gloss": {
          "en": "The exit is over there, to the right.",
          "ko": "출구는 저쪽 오른쪽이에요."
        }
      },
      {
        "who": "me",
        "text": "Спасибо! А где здесь такси?",
        "gloss": {
          "en": "Thanks! And where are the taxis around here?",
          "ko": "고마워요! 그리고 여기 택시는 어디서 타요?"
        },
        "frames": [
          "ru-f1-05"
        ]
      }
    ]
  },
  {
    "id": "ru-1-b13",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Ordering at a Russian restaurant",
      "ko": "러시아 식당에서 주문"
    },
    "expressions": [
      "Спасибо",
      "Хорошо"
    ],
    "grammar": [
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Добрый вечер! Вот меню.",
        "gloss": {
          "en": "Good evening! Here's the menu.",
          "ko": "안녕하세요! 메뉴판 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "Спасибо. Что такое пельмени?",
        "gloss": {
          "en": "Thank you. What are pelmeni?",
          "ko": "고마워요. 펠메니가 뭐예요?"
        },
        "frames": [
          "ru-f1-11"
        ]
      },
      {
        "who": "them",
        "text": "Это русское блюдо, с мясом. Очень вкусно!",
        "gloss": {
          "en": "It's a Russian dish, with meat. Very tasty!",
          "ko": "고기가 들어간 러시아 요리예요. 아주 맛있어요!"
        }
      },
      {
        "who": "me",
        "text": "Хорошо. Можно пельмени, пожалуйста?",
        "gloss": {
          "en": "OK. Can I have the pelmeni, please?",
          "ko": "좋아요. 펠메니 주시겠어요?"
        },
        "frames": [
          "ru-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Конечно. А пить?",
        "gloss": {
          "en": "Of course. And to drink?",
          "ko": "물론이죠. 음료는요?"
        }
      },
      {
        "who": "me",
        "text": "У вас есть квас?",
        "gloss": {
          "en": "Do you have kvass?",
          "ko": "크바스 있어요?"
        },
        "frames": [
          "ru-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Да, есть.",
        "gloss": {
          "en": "Yes, we do.",
          "ko": "네, 있어요."
        }
      },
      {
        "who": "me",
        "text": "Хорошо, спасибо.",
        "gloss": {
          "en": "Great, thanks.",
          "ko": "좋아요, 고마워요."
        }
      }
    ]
  },
  {
    "id": "ru-1-b14",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Getting a library card",
      "ko": "도서관 카드 만들기"
    },
    "expressions": [
      "Минуточку",
      "Пожалуйста",
      "Спасибо"
    ],
    "grammar": [
      0,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Здравствуйте! Вам нужна карта библиотеки?",
        "gloss": {
          "en": "Hello! Do you need a library card?",
          "ko": "안녕하세요! 도서관 카드가 필요하세요?"
        }
      },
      {
        "who": "me",
        "text": "Да. Я студент. Я изучаю историю.",
        "gloss": {
          "en": "Yes. I'm a student. I study history.",
          "ko": "네. 학생이에요. 역사를 공부해요."
        },
        "frames": [
          "ru-f1-03",
          "ru-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "Хорошо. Ваш паспорт, пожалуйста.",
        "gloss": {
          "en": "OK. Your passport, please.",
          "ko": "네. 여권 주세요."
        }
      },
      {
        "who": "me",
        "text": "Минуточку... Вот, пожалуйста.",
        "gloss": {
          "en": "Just a moment... Here you go.",
          "ko": "잠깐만요... 여기 있어요."
        }
      },
      {
        "who": "them",
        "text": "Спасибо. А телефон?",
        "gloss": {
          "en": "Thank you. And a phone number?",
          "ko": "고마워요. 전화번호는요?"
        }
      },
      {
        "who": "me",
        "text": "У меня есть только корейский номер.",
        "gloss": {
          "en": "I only have a Korean number.",
          "ko": "한국 번호밖에 없어요."
        },
        "frames": [
          "ru-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Ничего. Вот ваша карта.",
        "gloss": {
          "en": "That's fine. Here's your card.",
          "ko": "괜찮아요. 카드 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "Спасибо за помощь!",
        "gloss": {
          "en": "Thanks for your help!",
          "ko": "도와주셔서 고마워요!"
        },
        "frames": [
          "ru-f1-15"
        ]
      }
    ]
  },
  {
    "id": "ru-1-b15",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Leaving things behind at a café",
      "ko": "카페에 물건을 두고 감"
    },
    "expressions": [
      "Спасибо",
      "Пожалуйста"
    ],
    "grammar": [
      2,
      3,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Молодой человек! Это ваш телефон?",
        "gloss": {
          "en": "Excuse me, young man! Is this your phone?",
          "ko": "저기요! 이거 손님 휴대폰이에요?"
        }
      },
      {
        "who": "me",
        "text": "Ой, да, это мой телефон! Спасибо!",
        "gloss": {
          "en": "Oh, yes, that's my phone! Thank you!",
          "ko": "어머, 네, 제 휴대폰이에요! 고마워요!"
        }
      },
      {
        "who": "them",
        "text": "Пожалуйста. А вы не забыли сумку?",
        "gloss": {
          "en": "You're welcome. And didn't you forget your bag?",
          "ko": "천만에요. 그런데 가방은 안 두고 가세요?"
        }
      },
      {
        "who": "me",
        "text": "Сумку? Ой, где моя сумка?",
        "gloss": {
          "en": "My bag? Oh, where's my bag?",
          "ko": "가방요? 어, 제 가방 어디 있지?"
        },
        "frames": [
          "ru-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "Вот она, на стуле.",
        "gloss": {
          "en": "Here it is, on the chair.",
          "ko": "여기 의자 위에 있어요."
        }
      },
      {
        "who": "me",
        "text": "А, да. Спасибо за помощь!",
        "gloss": {
          "en": "Ah, yes. Thanks for your help!",
          "ko": "아, 맞아요. 도와주셔서 고마워요!"
        },
        "frames": [
          "ru-f1-15"
        ]
      },
      {
        "who": "them",
        "text": "Не за что. Что-то ещё?",
        "gloss": {
          "en": "No problem. Anything else?",
          "ko": "천만에요. 더 필요한 거 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Да. Можно счёт, пожалуйста?",
        "gloss": {
          "en": "Yes. Can I have the bill, please?",
          "ko": "네. 계산서 주시겠어요?"
        },
        "frames": [
          "ru-f1-07"
        ]
      }
    ]
  },
  {
    "id": "ru-1-b16",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Chatting with another parent at a playground",
      "ko": "놀이터에서 다른 부모와 대화"
    },
    "expressions": [
      "Очень приятно"
    ],
    "grammar": [
      0,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Здравствуйте! Это ваш сын?",
        "gloss": {
          "en": "Hello! Is that your son?",
          "ko": "안녕하세요! 저 아이가 아드님이에요?"
        }
      },
      {
        "who": "me",
        "text": "Да. У меня есть сын и дочка.",
        "gloss": {
          "en": "Yes. I have a son and a daughter.",
          "ko": "네. 아들 하나, 딸 하나 있어요."
        },
        "frames": [
          "ru-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Какие хорошие! Вы живёте здесь?",
        "gloss": {
          "en": "How lovely! Do you live here?",
          "ko": "아이들이 참 예쁘네요! 여기 사세요?"
        }
      },
      {
        "who": "me",
        "text": "Да. Я работаю в школе рядом.",
        "gloss": {
          "en": "Yes. I work at the school nearby.",
          "ko": "네. 근처 학교에서 일해요."
        },
        "frames": [
          "ru-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "О, вы учитель?",
        "gloss": {
          "en": "Oh, are you a teacher?",
          "ko": "아, 선생님이세요?"
        }
      },
      {
        "who": "me",
        "text": "Да, я учитель английского.",
        "gloss": {
          "en": "Yes, I'm an English teacher.",
          "ko": "네, 영어 선생님이에요."
        },
        "frames": [
          "ru-f1-03"
        ]
      },
      {
        "who": "them",
        "text": "Здорово! Я Лена. Приятно познакомиться.",
        "gloss": {
          "en": "Great! I'm Lena. Nice to meet you.",
          "ko": "멋지네요! 저는 레나예요. 반가워요."
        }
      },
      {
        "who": "me",
        "text": "Очень приятно!",
        "gloss": {
          "en": "Nice to meet you!",
          "ko": "반가워요!"
        }
      }
    ]
  },
  {
    "id": "ru-1-b17",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Phoning a restaurant to book a table",
      "ko": "식당에 전화로 자리 예약"
    },
    "expressions": [
      "Здравствуйте",
      "Хорошо",
      "Спасибо",
      "До свидания"
    ],
    "grammar": [
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Алло! Ресторан «Берёзка», слушаю.",
        "gloss": {
          "en": "Hello! Beryozka restaurant, speaking.",
          "ko": "여보세요! 베료즈카 식당입니다."
        }
      },
      {
        "who": "me",
        "text": "Алло! Говорите громче, пожалуйста.",
        "gloss": {
          "en": "Hello! Please speak louder.",
          "ko": "여보세요! 좀 더 크게 말씀해 주세요."
        },
        "frames": [
          "ru-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "Ресторан «Берёзка»! Слушаю вас!",
        "gloss": {
          "en": "Beryozka restaurant! How can I help?",
          "ko": "베료즈카 식당이에요! 말씀하세요!"
        }
      },
      {
        "who": "me",
        "text": "Здравствуйте! У вас есть столик на вечер?",
        "gloss": {
          "en": "Hello! Do you have a table for this evening?",
          "ko": "안녕하세요! 오늘 저녁에 자리 있어요?"
        },
        "frames": [
          "ru-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "Да, есть. На сколько человек?",
        "gloss": {
          "en": "Yes, we do. For how many people?",
          "ko": "네, 있어요. 몇 분이세요?"
        }
      },
      {
        "who": "me",
        "text": "На двоих. Извините, где ваш ресторан?",
        "gloss": {
          "en": "For two. Excuse me, where is your restaurant?",
          "ko": "두 명이요. 죄송한데 식당이 어디예요?"
        },
        "frames": [
          "ru-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "На Садовой улице, дом пять.",
        "gloss": {
          "en": "On Sadovaya Street, number five.",
          "ko": "사도바야 거리 오 번지예요."
        }
      },
      {
        "who": "me",
        "text": "Хорошо, спасибо. До свидания!",
        "gloss": {
          "en": "OK, thank you. Goodbye!",
          "ko": "네, 고마워요. 안녕히 계세요!"
        }
      }
    ]
  },
  {
    "id": "ru-1-b18",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Meeting a roommate at a hostel",
      "ko": "호스텔에서 룸메이트와 인사"
    },
    "expressions": [
      "Привет",
      "Пожалуйста",
      "Пока"
    ],
    "grammar": [
      0,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Привет! Это твоя кровать?",
        "gloss": {
          "en": "Hi! Is this your bed?",
          "ko": "안녕하세요! 여기가 당신 침대예요?"
        }
      },
      {
        "who": "me",
        "text": "Да. Привет! Где здесь кухня?",
        "gloss": {
          "en": "Yes. Hi! Where's the kitchen around here?",
          "ko": "네. 안녕하세요! 여기 부엌이 어디예요?"
        },
        "frames": [
          "ru-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "Там, направо. Ты турист?",
        "gloss": {
          "en": "Over there, to the right. Are you a tourist?",
          "ko": "저기 오른쪽이요. 여행 왔어요?"
        }
      },
      {
        "who": "me",
        "text": "Нет, я студент. Я изучаю русский язык.",
        "gloss": {
          "en": "No, I'm a student. I study Russian.",
          "ko": "아니요, 학생이에요. 러시아어를 공부해요."
        },
        "frames": [
          "ru-f1-03",
          "ru-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "Круто! У тебя есть карта города?",
        "gloss": {
          "en": "Cool! Do you have a city map?",
          "ko": "멋지네요! 시내 지도 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Да, у меня есть карта. Вот.",
        "gloss": {
          "en": "Yes, I have a map. Here.",
          "ko": "네, 지도 있어요. 여기요."
        },
        "frames": [
          "ru-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Спасибо!",
        "gloss": {
          "en": "Thanks!",
          "ko": "고마워요!"
        }
      },
      {
        "who": "me",
        "text": "Пожалуйста! Пока!",
        "gloss": {
          "en": "You're welcome! Bye!",
          "ko": "천만에요! 안녕!"
        }
      }
    ]
  },
  {
    "id": "ru-1-b19",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "Sending a letter at the post office",
      "ko": "우체국에서 편지 보내기"
    },
    "expressions": [
      "Здравствуйте",
      "Пожалуйста",
      "Сколько стоит",
      "Извините",
      "Я не понимаю",
      "Ещё раз",
      "Спасибо",
      "Это всё"
    ],
    "grammar": [
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Здравствуйте. Что у вас?",
        "gloss": {
          "en": "Hello. What do you need?",
          "ko": "안녕하세요. 무슨 일로 오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Здравствуйте. Можно конверт, пожалуйста?",
        "gloss": {
          "en": "Hello. Can I have an envelope, please?",
          "ko": "안녕하세요. 봉투 하나 주시겠어요?"
        },
        "frames": [
          "ru-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Вот. Что-нибудь ещё?",
        "gloss": {
          "en": "Here. Anything else?",
          "ko": "여기요. 더 필요한 거 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Сколько стоит марка в Корею?",
        "gloss": {
          "en": "How much is a stamp to Korea?",
          "ko": "한국 가는 우표는 얼마예요?"
        },
        "frames": [
          "ru-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Восемьдесят рублей.",
        "gloss": {
          "en": "Eighty rubles.",
          "ko": "팔십 루블이에요."
        }
      },
      {
        "who": "me",
        "text": "Извините, я не понимаю. Ещё раз, пожалуйста.",
        "gloss": {
          "en": "Sorry, I don't understand. Once more, please.",
          "ko": "죄송해요, 못 알아들었어요. 한 번 더 말해 주세요."
        },
        "frames": [
          "ru-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Во-семь-де-сят.",
        "gloss": {
          "en": "Eigh-ty.",
          "ko": "팔-십."
        }
      },
      {
        "who": "me",
        "text": "Спасибо. Это всё.",
        "gloss": {
          "en": "Thank you. That's all.",
          "ko": "고마워요. 이게 다예요."
        }
      }
    ]
  },
  {
    "id": "ru-1-b20",
    "stage": 1,
    "bank": true,
    "setting": {
      "en": "At the clinic reception",
      "ko": "병원 접수처에서"
    },
    "expressions": [
      "Я не понимаю"
    ],
    "grammar": [
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Здравствуйте. Вы на приём?",
        "gloss": {
          "en": "Hello. Are you here for an appointment?",
          "ko": "안녕하세요. 진료 받으러 오셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Да. Но я не понимаю эту анкету.",
        "gloss": {
          "en": "Yes. But I don't understand this form.",
          "ko": "네. 그런데 이 서류를 잘 모르겠어요."
        },
        "frames": [
          "ru-f1-13"
        ]
      },
      {
        "who": "them",
        "text": "Ничего, я помогу. Ваш паспорт, пожалуйста.",
        "gloss": {
          "en": "That's fine, I'll help. Your passport, please.",
          "ko": "괜찮아요, 도와드릴게요. 여권 주세요."
        }
      },
      {
        "who": "me",
        "text": "Вот. Это мой паспорт.",
        "gloss": {
          "en": "Here. This is my passport.",
          "ko": "여기요. 제 여권이에요."
        }
      },
      {
        "who": "them",
        "text": "Хорошо. Где вы работаете?",
        "gloss": {
          "en": "OK. Where do you work?",
          "ko": "네. 어디서 일하세요?"
        }
      },
      {
        "who": "me",
        "text": "Я работаю в банке.",
        "gloss": {
          "en": "I work at a bank.",
          "ko": "은행에서 일해요."
        },
        "frames": [
          "ru-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "Хорошо. У вас есть страховка?",
        "gloss": {
          "en": "OK. Do you have insurance?",
          "ko": "네. 보험 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Да, у меня есть страховка.",
        "gloss": {
          "en": "Yes, I have insurance.",
          "ko": "네, 보험 있어요."
        },
        "frames": [
          "ru-f1-08"
        ]
      }
    ]
  },
  {
    "id": "ru-2-b01",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Running into an old friend on the street",
      "ko": "길에서 오랜 친구와 마주침"
    },
    "expressions": [
      "Отлично",
      "Давай"
    ],
    "grammar": [
      0,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Привет! Давно не виделись! Как дела?",
        "gloss": {
          "en": "Hi! Long time no see! How are you?",
          "ko": "안녕하세요! 오랜만이에요! 어떻게 지내요?"
        }
      },
      {
        "who": "me",
        "text": "Привет! Отлично. Вчера я вернулся из Казани.",
        "gloss": {
          "en": "Hi! Great. Yesterday I came back from Kazan.",
          "ko": "안녕하세요! 아주 잘 지내요. 어제 카잔에서 돌아왔어요."
        },
        "frames": [
          "ru-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Здорово! А что ты там делал?",
        "gloss": {
          "en": "Great! What did you do there?",
          "ko": "좋네요! 거기서 뭐 했어요?"
        }
      },
      {
        "who": "me",
        "text": "Я ходил в музеи и гулял по городу.",
        "gloss": {
          "en": "I went to museums and walked around the city.",
          "ko": "박물관에 가고 시내를 돌아다녔어요."
        },
        "frames": [
          "ru-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Правда? А сейчас куда?",
        "gloss": {
          "en": "Really? And where are you off to now?",
          "ko": "정말요? 지금은 어디 가요?"
        }
      },
      {
        "who": "me",
        "text": "Я иду в кафе. Давай со мной!",
        "gloss": {
          "en": "I'm going to a café. Come with me!",
          "ko": "카페에 가는 중이에요. 같이 가요!"
        },
        "frames": [
          "ru-f2-08",
          "ru-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "С удовольствием! Я как раз свободна.",
        "gloss": {
          "en": "With pleasure! I'm free right now.",
          "ko": "좋아요! 마침 시간이 있어요."
        }
      },
      {
        "who": "me",
        "text": "Отлично! Пойдём.",
        "gloss": {
          "en": "Great! Let's go.",
          "ko": "좋아요! 가요."
        }
      }
    ]
  },
  {
    "id": "ru-2-b02",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Seeing a doctor about a sore throat",
      "ko": "목이 아파서 병원 진료"
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
        "text": "Здравствуйте. Что случилось?",
        "gloss": {
          "en": "Hello. What's the matter?",
          "ko": "안녕하세요. 어디가 불편하세요?"
        }
      },
      {
        "who": "me",
        "text": "Здравствуйте. У меня болит горло.",
        "gloss": {
          "en": "Hello. My throat hurts.",
          "ko": "안녕하세요. 목이 아파요."
        },
        "frames": [
          "ru-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Давно?",
        "gloss": {
          "en": "For long?",
          "ko": "오래됐어요?"
        }
      },
      {
        "who": "me",
        "text": "Два дня. Вчера я весь день работал на улице.",
        "gloss": {
          "en": "Two days. Yesterday I worked outside all day.",
          "ko": "이틀이요. 어제 하루 종일 밖에서 일했어요."
        },
        "frames": [
          "ru-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Понятно. Температура есть?",
        "gloss": {
          "en": "I see. Do you have a temperature?",
          "ko": "그렇군요. 열은 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Да, немного. Я плохо сплю, потому что горло очень болит.",
        "gloss": {
          "en": "Yes, a little. I sleep badly because my throat really hurts.",
          "ko": "네, 조금요. 목이 너무 아파서 잠을 잘 못 자요."
        },
        "frames": [
          "ru-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "Вот рецепт. Пейте тёплый чай.",
        "gloss": {
          "en": "Here's a prescription. Drink warm tea.",
          "ko": "처방전 여기 있어요. 따뜻한 차를 드세요."
        }
      },
      {
        "who": "me",
        "text": "Спасибо. Скажите, пожалуйста, где здесь аптека?",
        "gloss": {
          "en": "Thank you. Could you tell me where the pharmacy is?",
          "ko": "고마워요. 여기 약국이 어디인지 알려 주시겠어요?"
        },
        "frames": [
          "ru-f2-04"
        ]
      }
    ]
  },
  {
    "id": "ru-2-b03",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Ordering dinner at a restaurant",
      "ko": "식당에서 저녁 주문"
    },
    "expressions": [
      "Что посоветуете",
      "Можно сфотографировать"
    ],
    "grammar": [
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Добрый вечер! Вы уже выбрали?",
        "gloss": {
          "en": "Good evening! Have you decided?",
          "ko": "안녕하세요! 고르셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Ещё нет. Что посоветуете на ужин?",
        "gloss": {
          "en": "Not yet. What do you recommend for dinner?",
          "ko": "아직이요. 저녁으로 뭐가 좋을까요?"
        },
        "frames": [
          "ru-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "Попробуйте наш борщ, он очень вкусный.",
        "gloss": {
          "en": "Try our borscht, it's very good.",
          "ko": "저희 보르시를 드셔 보세요, 아주 맛있어요."
        }
      },
      {
        "who": "me",
        "text": "Хорошо. Мне, пожалуйста, борщ и хлеб.",
        "gloss": {
          "en": "OK. I'll have the borscht and bread, please.",
          "ko": "좋아요. 보르시랑 빵 주세요."
        },
        "frames": [
          "ru-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "А пить что будете?",
        "gloss": {
          "en": "And what will you drink?",
          "ko": "음료는 뭘로 하시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "Чай, пожалуйста. Можно сфотографировать меню?",
        "gloss": {
          "en": "Tea, please. May I take a photo of the menu?",
          "ko": "차 주세요. 메뉴판 사진 찍어도 돼요?"
        },
        "frames": [
          "ru-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "Конечно, пожалуйста.",
        "gloss": {
          "en": "Of course, go ahead.",
          "ko": "물론이죠, 찍으세요."
        }
      },
      {
        "who": "me",
        "text": "Спасибо!",
        "gloss": {
          "en": "Thank you!",
          "ko": "고마워요!"
        }
      }
    ]
  },
  {
    "id": "ru-2-b04",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "At the metro lost-and-found office",
      "ko": "지하철 분실물 센터에서"
    },
    "expressions": [],
    "grammar": [
      0,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Здравствуйте. Чем могу помочь?",
        "gloss": {
          "en": "Hello. How can I help?",
          "ko": "안녕하세요. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Здравствуйте. Я потерял телефон в метро.",
        "gloss": {
          "en": "Hello. I lost my phone on the metro.",
          "ko": "안녕하세요. 지하철에서 휴대폰을 잃어버렸어요."
        },
        "frames": [
          "ru-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "Когда?",
        "gloss": {
          "en": "When?",
          "ko": "언제요?"
        }
      },
      {
        "who": "me",
        "text": "Вчера я ехал домой вечером, на синей линии.",
        "gloss": {
          "en": "Yesterday I was going home in the evening, on the blue line.",
          "ko": "어제 저녁에 파란 노선을 타고 집에 가고 있었어요."
        },
        "frames": [
          "ru-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Какой телефон?",
        "gloss": {
          "en": "What kind of phone?",
          "ko": "어떤 휴대폰이에요?"
        }
      },
      {
        "who": "me",
        "text": "Чёрный, в красном чехле.",
        "gloss": {
          "en": "Black, in a red case.",
          "ko": "검은색에 빨간 케이스예요."
        }
      },
      {
        "who": "them",
        "text": "Минуточку... Этот?",
        "gloss": {
          "en": "One moment... This one?",
          "ko": "잠깐만요... 이거예요?"
        }
      },
      {
        "who": "me",
        "text": "Да! Спасибо большое! Покажите, пожалуйста, где подписать.",
        "gloss": {
          "en": "Yes! Thank you so much! Please show me where to sign.",
          "ko": "네! 정말 고마워요! 어디에 서명하는지 알려 주세요."
        },
        "frames": [
          "ru-f2-05"
        ]
      }
    ]
  },
  {
    "id": "ru-2-b05",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Lost in the city centre",
      "ko": "시내에서 길을 잃음"
    },
    "expressions": [
      "Я заблудился"
    ],
    "grammar": [
      2,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Здравствуйте! Вам помочь?",
        "gloss": {
          "en": "Hello! Can I help you?",
          "ko": "안녕하세요! 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Да, пожалуйста. Я заблудился. Я хочу найти Красную площадь.",
        "gloss": {
          "en": "Yes, please. I'm lost. I want to find Red Square.",
          "ko": "네, 부탁해요. 길을 잃었어요. 붉은 광장을 찾고 싶어요."
        },
        "frames": [
          "ru-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Это недалеко. Вы пешком?",
        "gloss": {
          "en": "It's not far. Are you on foot?",
          "ko": "멀지 않아요. 걸어가세요?"
        }
      },
      {
        "who": "me",
        "text": "Да, я иду пешком.",
        "gloss": {
          "en": "Yes, I'm walking.",
          "ko": "네, 걸어가요."
        },
        "frames": [
          "ru-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Тогда прямо и налево. Минут десять.",
        "gloss": {
          "en": "Then straight on and left. About ten minutes.",
          "ko": "그럼 쭉 가다가 왼쪽이에요. 십 분쯤이요."
        }
      },
      {
        "who": "me",
        "text": "Покажите, пожалуйста, на карте.",
        "gloss": {
          "en": "Please show me on the map.",
          "ko": "지도에서 보여 주세요."
        },
        "frames": [
          "ru-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Вот здесь, видите?",
        "gloss": {
          "en": "Right here, see?",
          "ko": "바로 여기요, 보이세요?"
        }
      },
      {
        "who": "me",
        "text": "Да, вижу. Спасибо большое!",
        "gloss": {
          "en": "Yes, I see. Thank you so much!",
          "ko": "네, 보여요. 정말 고마워요!"
        }
      }
    ]
  },
  {
    "id": "ru-2-b06",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Making plans for the cinema by phone",
      "ko": "전화로 영화 약속 잡기"
    },
    "expressions": [
      "Давай",
      "Во сколько",
      "До завтра"
    ],
    "grammar": [
      1,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Привет! Ты завтра свободен?",
        "gloss": {
          "en": "Hi! Are you free tomorrow?",
          "ko": "안녕하세요! 내일 시간 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Утром нет. Завтра я буду работать до обеда.",
        "gloss": {
          "en": "Not in the morning. Tomorrow I'll be working until lunch.",
          "ko": "오전엔 안 돼요. 내일은 점심때까지 일할 거예요."
        },
        "frames": [
          "ru-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "А вечером? Давай в кино!",
        "gloss": {
          "en": "And in the evening? Let's go to the cinema!",
          "ko": "저녁엔요? 영화 보러 가요!"
        }
      },
      {
        "who": "me",
        "text": "Давай! Во сколько фильм?",
        "gloss": {
          "en": "Let's! What time is the film?",
          "ko": "좋아요! 영화 몇 시예요?"
        },
        "frames": [
          "ru-f2-10",
          "ru-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "В семь. Где встретимся?",
        "gloss": {
          "en": "At seven. Where shall we meet?",
          "ko": "일곱 시요. 어디서 만날까요?"
        }
      },
      {
        "who": "me",
        "text": "Встретимся у метро?",
        "gloss": {
          "en": "Shall we meet at the metro?",
          "ko": "지하철역에서 만날까요?"
        },
        "frames": [
          "ru-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "Договорились. До завтра!",
        "gloss": {
          "en": "Deal. See you tomorrow!",
          "ko": "좋아요. 내일 봐요!"
        }
      },
      {
        "who": "me",
        "text": "До завтра!",
        "gloss": {
          "en": "See you tomorrow!",
          "ko": "내일 봐요!"
        }
      }
    ]
  },
  {
    "id": "ru-2-b07",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Opening a bank account",
      "ko": "은행 계좌 만들기"
    },
    "expressions": [
      "Подождите"
    ],
    "grammar": [
      2,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Здравствуйте. Чем могу помочь?",
        "gloss": {
          "en": "Hello. How can I help?",
          "ko": "안녕하세요. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Здравствуйте. Я хочу открыть счёт.",
        "gloss": {
          "en": "Hello. I want to open an account.",
          "ko": "안녕하세요. 계좌를 만들고 싶어요."
        },
        "frames": [
          "ru-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Хорошо. Где вы живёте?",
        "gloss": {
          "en": "OK. Where do you live?",
          "ko": "네. 어디 사세요?"
        }
      },
      {
        "who": "me",
        "text": "Я живу в Москве, на Тверской улице.",
        "gloss": {
          "en": "I live in Moscow, on Tverskaya Street.",
          "ko": "모스크바 트베르스카야 거리에 살아요."
        },
        "frames": [
          "ru-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "У вас есть регистрация?",
        "gloss": {
          "en": "Do you have a residence registration?",
          "ko": "거주 등록증 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Да, подождите... Вот она. Скажите, пожалуйста, это долго?",
        "gloss": {
          "en": "Yes, wait... Here it is. Could you tell me, will it take long?",
          "ko": "네, 잠깐만요... 여기 있어요. 오래 걸리는지 알려 주시겠어요?"
        },
        "frames": [
          "ru-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Нет, минут двадцать.",
        "gloss": {
          "en": "No, about twenty minutes.",
          "ko": "아니요, 이십 분쯤이요."
        }
      },
      {
        "who": "me",
        "text": "Хорошо, я подожду.",
        "gloss": {
          "en": "OK, I'll wait.",
          "ko": "좋아요, 기다릴게요."
        }
      }
    ]
  },
  {
    "id": "ru-2-b08",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Buying a train ticket",
      "ko": "기차표 사기"
    },
    "expressions": [
      "Во сколько",
      "Отлично"
    ],
    "grammar": [
      2,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Здравствуйте. Куда едете?",
        "gloss": {
          "en": "Hello. Where are you travelling to?",
          "ko": "안녕하세요. 어디 가세요?"
        }
      },
      {
        "who": "me",
        "text": "Здравствуйте. В субботу я еду в Петербург.",
        "gloss": {
          "en": "Hello. On Saturday I'm going to Petersburg.",
          "ko": "안녕하세요. 토요일에 페테르부르크에 가요."
        },
        "frames": [
          "ru-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Утром или вечером?",
        "gloss": {
          "en": "Morning or evening?",
          "ko": "오전이요, 저녁이요?"
        }
      },
      {
        "who": "me",
        "text": "Утром. Во сколько первый поезд?",
        "gloss": {
          "en": "Morning. What time is the first train?",
          "ko": "오전이요. 첫 기차가 몇 시예요?"
        },
        "frames": [
          "ru-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "В шесть утра. Подойдёт?",
        "gloss": {
          "en": "At six in the morning. Does that work?",
          "ko": "아침 여섯 시요. 괜찮으세요?"
        }
      },
      {
        "who": "me",
        "text": "Нет, это рано. Я хочу поехать в девять.",
        "gloss": {
          "en": "No, that's early. I want to go at nine.",
          "ko": "아니요, 너무 일러요. 아홉 시에 가고 싶어요."
        },
        "frames": [
          "ru-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Хорошо, есть поезд в девять.",
        "gloss": {
          "en": "OK, there's a train at nine.",
          "ko": "네, 아홉 시 기차가 있어요."
        }
      },
      {
        "who": "me",
        "text": "Отлично. Мне, пожалуйста, один билет.",
        "gloss": {
          "en": "Great. One ticket for me, please.",
          "ko": "좋아요. 표 한 장 주세요."
        },
        "frames": [
          "ru-f2-17"
        ]
      }
    ]
  },
  {
    "id": "ru-2-b09",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Visiting an art museum",
      "ko": "미술관 관람"
    },
    "expressions": [
      "Можно сфотографировать",
      "Что посоветуете"
    ],
    "grammar": [
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Простите, здесь нельзя с рюкзаком.",
        "gloss": {
          "en": "Excuse me, you can't come in with a backpack.",
          "ko": "죄송하지만 배낭을 메고는 못 들어가세요."
        }
      },
      {
        "who": "me",
        "text": "Извините. Скажите, пожалуйста, где гардероб?",
        "gloss": {
          "en": "Sorry. Could you tell me where the cloakroom is?",
          "ko": "죄송해요. 보관소가 어디인지 알려 주시겠어요?"
        },
        "frames": [
          "ru-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Внизу, направо.",
        "gloss": {
          "en": "Downstairs, on the right.",
          "ko": "아래층 오른쪽이요."
        }
      },
      {
        "who": "me",
        "text": "Спасибо. А можно сфотографировать эту картину?",
        "gloss": {
          "en": "Thanks. And may I take a photo of this painting?",
          "ko": "고마워요. 이 그림 사진 찍어도 돼요?"
        },
        "frames": [
          "ru-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "Можно, но без вспышки.",
        "gloss": {
          "en": "You may, but without flash.",
          "ko": "돼요, 그런데 플래시는 끄세요."
        }
      },
      {
        "who": "me",
        "text": "Хорошо. Что посоветуете посмотреть ещё?",
        "gloss": {
          "en": "OK. What else do you recommend seeing?",
          "ko": "알겠어요. 또 뭘 보면 좋을까요?"
        },
        "frames": [
          "ru-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "Обязательно второй этаж.",
        "gloss": {
          "en": "The second floor, for sure.",
          "ko": "이 층은 꼭 보세요."
        }
      },
      {
        "who": "me",
        "text": "Спасибо! Я хочу посмотреть всё.",
        "gloss": {
          "en": "Thank you! I want to see everything.",
          "ko": "고마워요! 전부 다 보고 싶어요."
        },
        "frames": [
          "ru-f2-06"
        ]
      }
    ]
  },
  {
    "id": "ru-2-b10",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Monday chat with a colleague",
      "ko": "월요일에 동료와 수다"
    },
    "expressions": [
      "Давай"
    ],
    "grammar": [
      0,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Привет! Как прошли выходные?",
        "gloss": {
          "en": "Hi! How was your weekend?",
          "ko": "안녕하세요! 주말 어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "Хорошо! В субботу я ходил в театр.",
        "gloss": {
          "en": "Good! On Saturday I went to the theatre.",
          "ko": "좋았어요! 토요일에 극장에 갔어요."
        },
        "frames": [
          "ru-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Здорово! А что смотрел?",
        "gloss": {
          "en": "Great! What did you see?",
          "ko": "좋네요! 뭐 봤어요?"
        }
      },
      {
        "who": "me",
        "text": "«Лебединое озеро». Было очень красиво.",
        "gloss": {
          "en": "Swan Lake. It was very beautiful.",
          "ko": "«백조의 호수»요. 정말 아름다웠어요."
        }
      },
      {
        "who": "them",
        "text": "Правда? Я тоже хочу пойти.",
        "gloss": {
          "en": "Really? I want to go too.",
          "ko": "정말요? 저도 가 보고 싶어요."
        }
      },
      {
        "who": "me",
        "text": "Давай пойдём вместе в следующий раз!",
        "gloss": {
          "en": "Let's go together next time!",
          "ko": "다음엔 같이 가요!"
        },
        "frames": [
          "ru-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "Давай! А в пятницу ты свободен?",
        "gloss": {
          "en": "Let's! Are you free on Friday?",
          "ko": "좋아요! 금요일에 시간 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Нет, в пятницу я занят, потому что у меня экзамен.",
        "gloss": {
          "en": "No, I'm busy on Friday because I have an exam.",
          "ko": "아니요, 금요일엔 시험이 있어서 바빠요."
        },
        "frames": [
          "ru-f2-11"
        ]
      }
    ]
  },
  {
    "id": "ru-2-b11",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Checking out of a hotel",
      "ko": "호텔 체크아웃"
    },
    "expressions": [],
    "grammar": [
      0,
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Доброе утро! Вы уезжаете?",
        "gloss": {
          "en": "Good morning! Are you leaving?",
          "ko": "좋은 아침이에요! 오늘 떠나세요?"
        }
      },
      {
        "who": "me",
        "text": "Да, сегодня я еду в аэропорт.",
        "gloss": {
          "en": "Yes, today I'm going to the airport.",
          "ko": "네, 오늘 공항에 가요."
        },
        "frames": [
          "ru-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Вам вызвать такси?",
        "gloss": {
          "en": "Shall I call you a taxi?",
          "ko": "택시 불러 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Да, пожалуйста. Скажите, пожалуйста, сколько это стоит?",
        "gloss": {
          "en": "Yes, please. Could you tell me how much it costs?",
          "ko": "네, 부탁해요. 요금이 얼마인지 알려 주시겠어요?"
        },
        "frames": [
          "ru-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Около тысячи рублей. Ваш ключ, пожалуйста.",
        "gloss": {
          "en": "About a thousand rubles. Your key, please.",
          "ko": "천 루블쯤이에요. 방 열쇠 주세요."
        }
      },
      {
        "who": "me",
        "text": "Извините, я потерял ключ от номера.",
        "gloss": {
          "en": "Sorry, I lost my room key.",
          "ko": "죄송해요, 방 열쇠를 잃어버렸어요."
        },
        "frames": [
          "ru-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "Ничего страшного, бывает.",
        "gloss": {
          "en": "No big deal, it happens.",
          "ko": "괜찮아요, 그럴 수 있죠."
        }
      },
      {
        "who": "me",
        "text": "Спасибо! Вы очень помогли.",
        "gloss": {
          "en": "Thank you! You've been very helpful.",
          "ko": "고마워요! 정말 많이 도와주셨어요."
        }
      }
    ]
  },
  {
    "id": "ru-2-b12",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Turning down a football game",
      "ko": "축구 제안 거절"
    },
    "expressions": [
      "Давай",
      "Удачи"
    ],
    "grammar": [
      0,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Привет! Давай сегодня поиграем в футбол!",
        "gloss": {
          "en": "Hi! Let's play football today!",
          "ko": "안녕하세요! 오늘 축구 해요!"
        }
      },
      {
        "who": "me",
        "text": "Извини, не могу. У меня болит нога.",
        "gloss": {
          "en": "Sorry, I can't. My leg hurts.",
          "ko": "미안해요, 못 해요. 다리가 아파요."
        },
        "frames": [
          "ru-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Ой, что случилось?",
        "gloss": {
          "en": "Oh, what happened?",
          "ko": "어머, 무슨 일이에요?"
        }
      },
      {
        "who": "me",
        "text": "Вчера я упал на улице.",
        "gloss": {
          "en": "Yesterday I fell in the street.",
          "ko": "어제 길에서 넘어졌어요."
        },
        "frames": [
          "ru-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Жаль! Тогда в другой раз.",
        "gloss": {
          "en": "That's a shame! Another time, then.",
          "ko": "아쉽네요! 그럼 다음에 해요."
        }
      },
      {
        "who": "me",
        "text": "Да, давай в воскресенье!",
        "gloss": {
          "en": "Yes, let's do Sunday!",
          "ko": "네, 일요일에 해요!"
        },
        "frames": [
          "ru-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "Договорились. Выздоравливай!",
        "gloss": {
          "en": "Deal. Get well soon!",
          "ko": "좋아요. 빨리 나아요!"
        }
      },
      {
        "who": "me",
        "text": "Спасибо! Удачи в игре!",
        "gloss": {
          "en": "Thanks! Good luck in the game!",
          "ko": "고마워요! 경기 잘해요!"
        }
      }
    ]
  },
  {
    "id": "ru-2-b13",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "A delivery courier at the door",
      "ko": "배달 기사와 통화"
    },
    "expressions": [
      "Подождите",
      "Отлично"
    ],
    "grammar": [
      2,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Алло, здравствуйте! Это доставка. Я у вашего дома.",
        "gloss": {
          "en": "Hello! It's the delivery. I'm at your building.",
          "ko": "여보세요, 안녕하세요! 배달이에요. 건물 앞에 왔어요."
        }
      },
      {
        "who": "me",
        "text": "Здравствуйте! Я живу в третьем подъезде.",
        "gloss": {
          "en": "Hello! I live in the third entrance.",
          "ko": "안녕하세요! 저는 삼 번 출입구 쪽에 살아요."
        },
        "frames": [
          "ru-f2-07"
        ]
      },
      {
        "who": "them",
        "text": "А какая квартира?",
        "gloss": {
          "en": "And which flat?",
          "ko": "몇 호예요?"
        }
      },
      {
        "who": "me",
        "text": "Сорок пятая. Подождите, я иду вниз.",
        "gloss": {
          "en": "Forty-five. Wait, I'm coming down.",
          "ko": "사십오 호요. 기다리세요, 지금 내려갈게요."
        },
        "frames": [
          "ru-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Хорошо, жду у двери.",
        "gloss": {
          "en": "OK, I'm waiting at the door.",
          "ko": "네, 문 앞에서 기다릴게요."
        }
      },
      {
        "who": "me",
        "text": "Скажите, пожалуйста, можно оплатить картой?",
        "gloss": {
          "en": "Could you tell me, can I pay by card?",
          "ko": "카드로 결제할 수 있는지 알려 주시겠어요?"
        },
        "frames": [
          "ru-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Да, конечно.",
        "gloss": {
          "en": "Yes, of course.",
          "ko": "네, 물론이죠."
        }
      },
      {
        "who": "me",
        "text": "Отлично, спасибо!",
        "gloss": {
          "en": "Great, thanks!",
          "ko": "좋아요, 고마워요!"
        }
      }
    ]
  },
  {
    "id": "ru-2-b14",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "At the bakery before work",
      "ko": "출근 전 빵집에서"
    },
    "expressions": [
      "Что посоветуете",
      "Отлично"
    ],
    "grammar": [
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Здравствуйте! Что вам?",
        "gloss": {
          "en": "Hello! What can I get you?",
          "ko": "안녕하세요! 뭘 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Здравствуйте. Что посоветуете к чаю?",
        "gloss": {
          "en": "Hello. What do you recommend with tea?",
          "ko": "안녕하세요. 차랑 먹기 좋은 게 뭐예요?"
        },
        "frames": [
          "ru-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "Возьмите пирожки с вишней, они сегодня свежие.",
        "gloss": {
          "en": "Take the cherry pies, they're fresh today.",
          "ko": "체리 파이를 드세요, 오늘 갓 만들었어요."
        }
      },
      {
        "who": "me",
        "text": "Отлично. Мне, пожалуйста, два пирожка.",
        "gloss": {
          "en": "Great. Two pies for me, please.",
          "ko": "좋아요. 파이 두 개 주세요."
        },
        "frames": [
          "ru-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "С собой или здесь?",
        "gloss": {
          "en": "To take away or to eat here?",
          "ko": "포장이에요, 드시고 가세요?"
        }
      },
      {
        "who": "me",
        "text": "С собой, потому что я иду на работу.",
        "gloss": {
          "en": "To take away, because I'm on my way to work.",
          "ko": "포장이요, 출근하는 길이라서요."
        },
        "frames": [
          "ru-f2-11",
          "ru-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Вот, пожалуйста. Хорошего дня!",
        "gloss": {
          "en": "Here you go. Have a nice day!",
          "ko": "여기 있어요. 좋은 하루 보내세요!"
        }
      },
      {
        "who": "me",
        "text": "Спасибо, вам тоже!",
        "gloss": {
          "en": "Thank you, you too!",
          "ko": "고마워요, 좋은 하루 보내세요!"
        }
      }
    ]
  },
  {
    "id": "ru-2-b15",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "A friend's birthday invitation",
      "ko": "친구 생일 초대"
    },
    "expressions": [
      "Во сколько",
      "Отлично"
    ],
    "grammar": [
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "Привет! В субботу у меня день рождения. Придёшь?",
        "gloss": {
          "en": "Hi! It's my birthday on Saturday. Will you come?",
          "ko": "안녕하세요! 토요일이 제 생일이에요. 올 거죠?"
        }
      },
      {
        "who": "me",
        "text": "Конечно! Во сколько вечеринка?",
        "gloss": {
          "en": "Of course! What time is the party?",
          "ko": "물론이죠! 파티는 몇 시예요?"
        },
        "frames": [
          "ru-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "В шесть вечера, у меня дома.",
        "gloss": {
          "en": "At six in the evening, at my place.",
          "ko": "저녁 여섯 시, 우리 집에서요."
        }
      },
      {
        "who": "me",
        "text": "Отлично! Что тебе подарить?",
        "gloss": {
          "en": "Great! What should I get you?",
          "ko": "좋아요! 선물은 뭐가 좋아요?"
        }
      },
      {
        "who": "them",
        "text": "Ничего не надо! Просто приходи.",
        "gloss": {
          "en": "You don't need anything! Just come.",
          "ko": "아무것도 필요 없어요! 그냥 와요."
        }
      },
      {
        "who": "me",
        "text": "Хорошо. Завтра я буду в центре, куплю торт.",
        "gloss": {
          "en": "OK. Tomorrow I'll be in the centre, I'll buy a cake.",
          "ko": "알겠어요. 내일 시내에 갈 거니까 케이크 살게요."
        },
        "frames": [
          "ru-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Здорово, спасибо!",
        "gloss": {
          "en": "Great, thanks!",
          "ko": "좋아요, 고마워요!"
        }
      },
      {
        "who": "me",
        "text": "Встретимся в субботу!",
        "gloss": {
          "en": "See you on Saturday!",
          "ko": "토요일에 만나요!"
        },
        "frames": [
          "ru-f2-13"
        ]
      }
    ]
  },
  {
    "id": "ru-2-b16",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Asking a passer-by about the bus",
      "ko": "행인에게 버스 묻기"
    },
    "expressions": [
      "Во сколько"
    ],
    "grammar": [
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Вы что-то ищете?",
        "gloss": {
          "en": "Are you looking for something?",
          "ko": "뭘 찾으세요?"
        }
      },
      {
        "who": "me",
        "text": "Да. Скажите, пожалуйста, где остановка автобуса?",
        "gloss": {
          "en": "Yes. Could you tell me where the bus stop is?",
          "ko": "네. 버스 정류장이 어디인지 알려 주시겠어요?"
        },
        "frames": [
          "ru-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Вон там, за углом. А куда вам?",
        "gloss": {
          "en": "Over there, round the corner. Where do you need to go?",
          "ko": "저기 모퉁이 돌면 있어요. 어디 가세요?"
        }
      },
      {
        "who": "me",
        "text": "Я еду в университет.",
        "gloss": {
          "en": "I'm going to the university.",
          "ko": "대학교에 가요."
        },
        "frames": [
          "ru-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Тогда вам нужен автобус номер семь.",
        "gloss": {
          "en": "Then you need bus number seven.",
          "ko": "그럼 칠 번 버스를 타세요."
        }
      },
      {
        "who": "me",
        "text": "А во сколько он приходит?",
        "gloss": {
          "en": "And what time does it come?",
          "ko": "몇 시에 와요?"
        },
        "frames": [
          "ru-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "Каждые десять минут.",
        "gloss": {
          "en": "Every ten minutes.",
          "ko": "십 분마다 와요."
        }
      },
      {
        "who": "me",
        "text": "Спасибо большое!",
        "gloss": {
          "en": "Thank you so much!",
          "ko": "정말 고마워요!"
        }
      }
    ]
  },
  {
    "id": "ru-2-b17",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Weekend plans with a flatmate",
      "ko": "룸메이트와 주말 계획"
    },
    "expressions": [
      "Давай",
      "Отлично"
    ],
    "grammar": [
      1,
      3,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Что ты будешь делать завтра?",
        "gloss": {
          "en": "What will you do tomorrow?",
          "ko": "내일 뭐 할 거예요?"
        }
      },
      {
        "who": "me",
        "text": "Завтра я буду убирать квартиру.",
        "gloss": {
          "en": "Tomorrow I'll be cleaning the flat.",
          "ko": "내일은 집 청소를 할 거예요."
        },
        "frames": [
          "ru-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Весь день? Давай потом погуляем!",
        "gloss": {
          "en": "All day? Let's go for a walk afterwards!",
          "ko": "하루 종일요? 끝나고 산책해요!"
        }
      },
      {
        "who": "me",
        "text": "Давай! Я хочу пойти в парк.",
        "gloss": {
          "en": "Let's! I want to go to the park.",
          "ko": "좋아요! 공원에 가고 싶어요."
        },
        "frames": [
          "ru-f2-10",
          "ru-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Отлично. А когда?",
        "gloss": {
          "en": "Great. And when?",
          "ko": "좋아요. 언제요?"
        }
      },
      {
        "who": "me",
        "text": "Встретимся в четыре у входа в парк?",
        "gloss": {
          "en": "Shall we meet at four at the park entrance?",
          "ko": "네 시에 공원 입구에서 만날까요?"
        },
        "frames": [
          "ru-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "Договорились!",
        "gloss": {
          "en": "Deal!",
          "ko": "좋아요!"
        }
      },
      {
        "who": "me",
        "text": "Отлично!",
        "gloss": {
          "en": "Great!",
          "ko": "좋아요!"
        }
      }
    ]
  },
  {
    "id": "ru-2-b18",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Booking a dentist appointment",
      "ko": "치과 예약 전화"
    },
    "expressions": [
      "До завтра"
    ],
    "grammar": [
      1,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Стоматология, здравствуйте.",
        "gloss": {
          "en": "Dental clinic, hello.",
          "ko": "치과입니다, 안녕하세요."
        }
      },
      {
        "who": "me",
        "text": "Здравствуйте. У меня болит зуб. Можно записаться?",
        "gloss": {
          "en": "Hello. I have a toothache. Can I make an appointment?",
          "ko": "안녕하세요. 이가 아파요. 예약할 수 있어요?"
        },
        "frames": [
          "ru-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Да. Завтра в десять удобно?",
        "gloss": {
          "en": "Yes. Is tomorrow at ten convenient?",
          "ko": "네. 내일 열 시 괜찮으세요?"
        }
      },
      {
        "who": "me",
        "text": "Нет, завтра я буду на работе до шести.",
        "gloss": {
          "en": "No, tomorrow I'll be at work until six.",
          "ko": "아니요, 내일은 여섯 시까지 회사에 있어요."
        },
        "frames": [
          "ru-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "А в семь вечера?",
        "gloss": {
          "en": "And at seven in the evening?",
          "ko": "저녁 일곱 시는요?"
        }
      },
      {
        "who": "me",
        "text": "Да, хорошо. Скажите, пожалуйста, ваш адрес?",
        "gloss": {
          "en": "Yes, fine. Could you tell me your address?",
          "ko": "네, 좋아요. 주소를 알려 주시겠어요?"
        },
        "frames": [
          "ru-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Улица Мира, дом три.",
        "gloss": {
          "en": "Mira Street, number three.",
          "ko": "미라 거리 삼 번지예요."
        }
      },
      {
        "who": "me",
        "text": "Спасибо. До завтра!",
        "gloss": {
          "en": "Thank you. See you tomorrow!",
          "ko": "고마워요. 내일 봬요!"
        }
      }
    ]
  },
  {
    "id": "ru-2-b19",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Buying a souvenir for mom",
      "ko": "엄마 선물로 기념품 사기"
    },
    "expressions": [
      "Можно сфотографировать"
    ],
    "grammar": [
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Здравствуйте! Ищете подарок?",
        "gloss": {
          "en": "Hello! Looking for a gift?",
          "ko": "안녕하세요! 선물 찾으세요?"
        }
      },
      {
        "who": "me",
        "text": "Да, я хочу купить подарок маме.",
        "gloss": {
          "en": "Yes, I want to buy a gift for my mom.",
          "ko": "네, 엄마 선물을 사고 싶어요."
        },
        "frames": [
          "ru-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Посмотрите платки. Они очень красивые.",
        "gloss": {
          "en": "Have a look at the shawls. They're very beautiful.",
          "ko": "스카프를 보세요. 아주 예뻐요."
        }
      },
      {
        "who": "me",
        "text": "Покажите, пожалуйста, этот синий.",
        "gloss": {
          "en": "Please show me this blue one.",
          "ko": "이 파란 거 보여 주세요."
        },
        "frames": [
          "ru-f2-05"
        ]
      },
      {
        "who": "them",
        "text": "Вот, пожалуйста.",
        "gloss": {
          "en": "Here you go.",
          "ko": "여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "Красиво! Можно сфотографировать? Я покажу сестре.",
        "gloss": {
          "en": "Beautiful! May I take a photo? I'll show my sister.",
          "ko": "예쁘네요! 사진 찍어도 돼요? 누나한테 보여 줄게요."
        },
        "frames": [
          "ru-f2-15"
        ]
      },
      {
        "who": "them",
        "text": "Конечно.",
        "gloss": {
          "en": "Of course.",
          "ko": "물론이죠."
        }
      },
      {
        "who": "me",
        "text": "Спасибо. Мне, пожалуйста, этот платок.",
        "gloss": {
          "en": "Thank you. I'll take this shawl, please.",
          "ko": "고마워요. 이 스카프로 주세요."
        },
        "frames": [
          "ru-f2-17"
        ]
      }
    ]
  },
  {
    "id": "ru-2-b20",
    "stage": 2,
    "bank": true,
    "setting": {
      "en": "Lost keys after a busy day",
      "ko": "바쁜 하루 뒤 열쇠 분실"
    },
    "expressions": [
      "Правда",
      "Давай"
    ],
    "grammar": [
      0,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Что случилось? Ты какой-то грустный.",
        "gloss": {
          "en": "What happened? You look kind of sad.",
          "ko": "무슨 일 있어요? 좀 우울해 보여요."
        }
      },
      {
        "who": "me",
        "text": "Я потерял ключи от квартиры.",
        "gloss": {
          "en": "I lost my flat keys.",
          "ko": "집 열쇠를 잃어버렸어요."
        },
        "frames": [
          "ru-f2-18"
        ]
      },
      {
        "who": "them",
        "text": "Ой! Где ты был сегодня?",
        "gloss": {
          "en": "Oh no! Where were you today?",
          "ko": "어떡해요! 오늘 어디 갔었어요?"
        }
      },
      {
        "who": "me",
        "text": "Утром я ходил в бассейн, потом в магазин.",
        "gloss": {
          "en": "In the morning I went to the pool, then to the shop.",
          "ko": "아침에 수영장에 갔다가 가게에 갔어요."
        },
        "frames": [
          "ru-f2-02"
        ]
      },
      {
        "who": "them",
        "text": "Может, они в бассейне?",
        "gloss": {
          "en": "Maybe they're at the pool?",
          "ko": "혹시 수영장에 있는 거 아니에요?"
        }
      },
      {
        "who": "me",
        "text": "Правда! Давай позвоним туда.",
        "gloss": {
          "en": "True! Let's call them.",
          "ko": "맞아요! 거기 전화해 봐요."
        },
        "frames": [
          "ru-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "Давай. Вот номер.",
        "gloss": {
          "en": "OK. Here's the number.",
          "ko": "그래요. 번호 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "Спасибо за идею!",
        "gloss": {
          "en": "Thanks for the idea!",
          "ko": "좋은 생각이에요, 고마워요!"
        }
      }
    ]
  },
  {
    "id": "ru-3-b01",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Arriving late to meet a friend at the cinema",
      "ko": "영화관 약속에 늦게 도착"
    },
    "expressions": [
      "Прости за опоздание",
      "Кстати",
      "Честно говоря"
    ],
    "grammar": [
      4,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ну наконец-то! Я жду уже двадцать минут.",
        "gloss": {
          "en": "Finally! I've been waiting for twenty minutes.",
          "ko": "드디어 왔네요! 이십 분이나 기다렸어요."
        }
      },
      {
        "who": "me",
        "text": "Прости за опоздание, автобус долго не приходил.",
        "gloss": {
          "en": "Sorry I'm late, the bus took ages to come.",
          "ko": "늦어서 미안해요, 버스가 한참 안 왔어요."
        },
        "frames": [
          "ru-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Бывает. Фильм ещё не начался?",
        "gloss": {
          "en": "It happens. Has the film started yet?",
          "ko": "그럴 수 있죠. 영화 아직 시작 안 했죠?"
        }
      },
      {
        "who": "me",
        "text": "Нет, он начинается в семь, у нас есть десять минут.",
        "gloss": {
          "en": "No, it starts at seven, we have ten minutes.",
          "ko": "아니요, 일곱 시에 시작해요, 십 분 남았어요."
        },
        "frames": [
          "ru-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "Отлично. Давай купим попкорн.",
        "gloss": {
          "en": "Great. Let's get some popcorn.",
          "ko": "좋아요. 팝콘 사요."
        }
      },
      {
        "who": "me",
        "text": "Давай. Кстати, я взял места в середине, чтобы было лучше видно.",
        "gloss": {
          "en": "Sure. By the way, I got seats in the middle so we can see better.",
          "ko": "그래요. 참, 잘 보이게 가운데 자리로 샀어요."
        },
        "frames": [
          "ru-f3-17",
          "ru-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Супер. Как ты вообще?",
        "gloss": {
          "en": "Great. How are you anyway?",
          "ko": "좋아요. 요즘 어때요?"
        }
      },
      {
        "who": "me",
        "text": "Честно говоря, устал после работы.",
        "gloss": {
          "en": "To be honest, I'm tired after work.",
          "ko": "솔직히 퇴근하고 나서 좀 피곤해요."
        },
        "frames": [
          "ru-f3-19"
        ]
      }
    ]
  },
  {
    "id": "ru-3-b02",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "The air conditioner breaks in a hotel room",
      "ko": "호텔 방 에어컨 고장"
    },
    "expressions": [
      "Мне кажется",
      "Вы не могли бы"
    ],
    "grammar": [
      0,
      1,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ресепшен, добрый вечер.",
        "gloss": {
          "en": "Reception, good evening.",
          "ko": "프런트입니다, 안녕하세요."
        }
      },
      {
        "who": "me",
        "text": "Добрый вечер. Что-то кондиционер в номере не работает.",
        "gloss": {
          "en": "Good evening. The air conditioner in my room isn't working.",
          "ko": "안녕하세요. 방 에어컨이 작동을 안 해요."
        },
        "frames": [
          "ru-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Извините, пожалуйста. Вы пробовали пульт?",
        "gloss": {
          "en": "I'm very sorry. Have you tried the remote?",
          "ko": "죄송합니다. 리모컨은 써 보셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Да, пробовал. Мне кажется, он сломался.",
        "gloss": {
          "en": "Yes, I tried. It seems to me it's broken.",
          "ko": "네, 해 봤어요. 고장 난 것 같아요."
        },
        "frames": [
          "ru-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Понятно. Мастер сможет прийти только утром.",
        "gloss": {
          "en": "I see. The technician can only come in the morning.",
          "ko": "알겠습니다. 기사님은 아침에야 오실 수 있어요."
        }
      },
      {
        "who": "me",
        "text": "Вы не могли бы дать мне другой номер? Очень жарко.",
        "gloss": {
          "en": "Could you possibly give me another room? It's very hot.",
          "ko": "다른 방으로 바꿔 주실 수 있을까요? 너무 더워요."
        },
        "frames": [
          "ru-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Да, конечно. Есть номер на пятом этаже.",
        "gloss": {
          "en": "Yes, of course. There's a room on the fifth floor.",
          "ko": "네, 물론이죠. 오 층에 방이 있어요."
        }
      },
      {
        "who": "me",
        "text": "Отлично, спасибо. Я зайду за ключом через пять минут.",
        "gloss": {
          "en": "Great, thanks. I'll drop by for the key in five minutes.",
          "ko": "좋아요, 고마워요. 오 분 뒤에 열쇠 받으러 들를게요."
        },
        "frames": [
          "ru-f3-11"
        ]
      }
    ]
  },
  {
    "id": "ru-3-b03",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Talking about a new TV series",
      "ko": "새 드라마 이야기"
    },
    "expressions": [
      "Может быть",
      "Честно говоря",
      "Ну ладно",
      "Кстати"
    ],
    "grammar": [
      0,
      1,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ты смотрел новый сериал про врачей?",
        "gloss": {
          "en": "Have you watched the new series about doctors?",
          "ko": "의사 나오는 새 드라마 봤어요?"
        }
      },
      {
        "who": "me",
        "text": "Да, я наконец посмотрел все серии.",
        "gloss": {
          "en": "Yes, I finally watched all the episodes.",
          "ko": "네, 드디어 전편 다 봤어요."
        },
        "frames": [
          "ru-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "Ну и как тебе?",
        "gloss": {
          "en": "So how did you like it?",
          "ko": "그래서 어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "Мне нравится главный герой. Это врач, который никогда не сдаётся.",
        "gloss": {
          "en": "I like the main character. He's a doctor who never gives up.",
          "ko": "주인공이 좋아요. 절대 포기하지 않는 의사예요."
        },
        "frames": [
          "ru-f3-03",
          "ru-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "А по-моему, середина скучная.",
        "gloss": {
          "en": "Well, I think the middle is boring.",
          "ko": "저는 중간이 지루하던데요."
        }
      },
      {
        "who": "me",
        "text": "Может быть. Честно говоря, я её промотал.",
        "gloss": {
          "en": "Maybe. To be honest, I skipped through it.",
          "ko": "그럴지도요. 솔직히 저는 그 부분 넘겼어요."
        },
        "frames": [
          "ru-f3-14",
          "ru-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Ха! Тогда ты не всё видел!",
        "gloss": {
          "en": "Ha! Then you didn't see everything!",
          "ko": "하! 그럼 다 본 게 아니네요!"
        }
      },
      {
        "who": "me",
        "text": "Ну ладно. Кстати, когда выйдет второй сезон?",
        "gloss": {
          "en": "Oh well. By the way, when is the second season coming out?",
          "ko": "뭐 그렇죠. 그런데 시즌 이는 언제 나와요?"
        },
        "frames": [
          "ru-f3-17"
        ]
      }
    ]
  },
  {
    "id": "ru-3-b04",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Leaving the office early",
      "ko": "회사에서 일찍 퇴근"
    },
    "expressions": [
      "Я не уверен"
    ],
    "grammar": [
      4,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ты куда так рано?",
        "gloss": {
          "en": "Where are you off to so early?",
          "ko": "이렇게 일찍 어디 가요?"
        }
      },
      {
        "who": "me",
        "text": "Мне надо забрать сына из садика.",
        "gloss": {
          "en": "I need to pick up my son from kindergarten.",
          "ko": "아들을 유치원에서 데려와야 해요."
        },
        "frames": [
          "ru-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "А, понятно. Завтра придёшь?",
        "gloss": {
          "en": "Ah, I see. Will you come in tomorrow?",
          "ko": "아, 그렇군요. 내일은 나와요?"
        }
      },
      {
        "who": "me",
        "text": "Да, я приду пораньше, чтобы закончить отчёт.",
        "gloss": {
          "en": "Yes, I'll come early to finish the report.",
          "ko": "네, 보고서 끝내려고 일찍 올 거예요."
        },
        "frames": [
          "ru-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Хорошо. Кстати, принтер опять не печатает.",
        "gloss": {
          "en": "OK. By the way, the printer isn't printing again.",
          "ko": "좋아요. 그런데 프린터가 또 인쇄가 안 돼요."
        }
      },
      {
        "who": "me",
        "text": "Да, что-то принтер не работает с утра.",
        "gloss": {
          "en": "Yes, the printer hasn't been working since the morning.",
          "ko": "네, 아침부터 프린터가 안 되네요."
        },
        "frames": [
          "ru-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Надо позвонить в техподдержку.",
        "gloss": {
          "en": "We should call tech support.",
          "ko": "기술 지원팀에 전화해야겠어요."
        }
      },
      {
        "who": "me",
        "text": "Я не уверен, что они придут сегодня.",
        "gloss": {
          "en": "I'm not sure they'll come today.",
          "ko": "오늘 와 줄지는 잘 모르겠어요."
        },
        "frames": [
          "ru-f3-15"
        ]
      }
    ]
  },
  {
    "id": "ru-3-b05",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Discussing a new restaurant with a friend",
      "ko": "친구와 새 식당 평가"
    },
    "expressions": [
      "По-моему",
      "Честно говоря",
      "Как тебе"
    ],
    "grammar": [
      1,
      2
    ],
    "lines": [
      {
        "who": "them",
        "text": "Как тебе этот ресторан?",
        "gloss": {
          "en": "How do you like this restaurant?",
          "ko": "이 식당 어때요?"
        }
      },
      {
        "who": "me",
        "text": "Мне нравится интерьер, но, по-моему, тут шумно.",
        "gloss": {
          "en": "I like the interior, but I think it's noisy here.",
          "ko": "인테리어는 마음에 드는데, 여기 좀 시끄러운 것 같아요."
        },
        "frames": [
          "ru-f3-03",
          "ru-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Согласна. А суп как?",
        "gloss": {
          "en": "Agreed. And how's the soup?",
          "ko": "맞아요. 수프는 어때요?"
        }
      },
      {
        "who": "me",
        "text": "Честно говоря, он слишком солёный.",
        "gloss": {
          "en": "To be honest, it's too salty.",
          "ko": "솔직히 너무 짜요."
        },
        "frames": [
          "ru-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Жаль. А моя паста очень вкусная.",
        "gloss": {
          "en": "Too bad. My pasta is really good.",
          "ko": "아쉽네요. 제 파스타는 정말 맛있어요."
        }
      },
      {
        "who": "me",
        "text": "Если бы я знал, я бы тоже заказал пасту.",
        "gloss": {
          "en": "If I'd known, I'd have ordered pasta too.",
          "ko": "알았으면 저도 파스타 시켰을 텐데요."
        },
        "frames": [
          "ru-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Ничего, зато десерты здесь отличные!",
        "gloss": {
          "en": "Never mind, the desserts here are great though!",
          "ko": "괜찮아요, 대신 여기 디저트가 최고예요!"
        }
      },
      {
        "who": "me",
        "text": "Правда? Как тебе чизкейк?",
        "gloss": {
          "en": "Really? How's the cheesecake?",
          "ko": "정말요? 치즈케이크는 어때요?"
        },
        "frames": [
          "ru-f3-04"
        ]
      }
    ]
  },
  {
    "id": "ru-3-b06",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Getting friendly at a yoga class",
      "ko": "요가 수업에서 친해지기"
    },
    "expressions": [
      "Давай на ты",
      "Ты серьёзно",
      "Может быть"
    ],
    "grammar": [
      1,
      5,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Вы тоже ходите на эти курсы йоги?",
        "gloss": {
          "en": "Do you also come to these yoga classes?",
          "ko": "이 요가 수업 다니세요?"
        }
      },
      {
        "who": "me",
        "text": "Да, уже месяц. Мне нравится преподаватель.",
        "gloss": {
          "en": "Yes, for a month now. I like the instructor.",
          "ko": "네, 한 달째요. 선생님이 마음에 들어요."
        },
        "frames": [
          "ru-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Мне тоже. Кстати, давай на ты?",
        "gloss": {
          "en": "Me too. By the way, shall we use «ты»?",
          "ko": "저도요. 그런데 우리 말 편하게 할까요?"
        }
      },
      {
        "who": "me",
        "text": "Давай на ты! Ты серьёзно ходишь сюда каждый день?",
        "gloss": {
          "en": "Sure, let's! Are you serious, you come here every day?",
          "ko": "좋아요, 편하게 해요! 진짜 여기 매일 와요?"
        },
        "frames": [
          "ru-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "Да, утром. Это помогает проснуться.",
        "gloss": {
          "en": "Yes, in the mornings. It helps me wake up.",
          "ko": "네, 아침마다요. 잠 깨는 데 도움이 돼요."
        }
      },
      {
        "who": "me",
        "text": "Мне надо тоже ходить чаще, чтобы спина не болела.",
        "gloss": {
          "en": "I need to come more often too, so my back doesn't hurt.",
          "ko": "저도 허리가 안 아프게 더 자주 와야겠어요."
        },
        "frames": [
          "ru-f3-07",
          "ru-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Приходи завтра утром, вместе позанимаемся.",
        "gloss": {
          "en": "Come tomorrow morning, we'll practise together.",
          "ko": "내일 아침에 와요, 같이 해요."
        }
      },
      {
        "who": "me",
        "text": "Может быть. Занятие начинается в восемь?",
        "gloss": {
          "en": "Maybe. Does the class start at eight?",
          "ko": "그럴까요. 수업이 여덟 시에 시작해요?"
        },
        "frames": [
          "ru-f3-14",
          "ru-f3-18"
        ]
      }
    ]
  },
  {
    "id": "ru-3-b07",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling the landlord about the heating",
      "ko": "집주인에게 난방 고장 전화"
    },
    "expressions": [
      "Я не уверен",
      "Вы не могли бы"
    ],
    "grammar": [
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Алло, слушаю.",
        "gloss": {
          "en": "Hello, I'm listening.",
          "ko": "여보세요, 말씀하세요."
        }
      },
      {
        "who": "me",
        "text": "Здравствуйте, это ваш жилец из двенадцатой квартиры.",
        "gloss": {
          "en": "Hello, this is your tenant from flat twelve.",
          "ko": "안녕하세요, 십이 호 세입자예요."
        }
      },
      {
        "who": "them",
        "text": "Да, здравствуйте. Что-то случилось?",
        "gloss": {
          "en": "Yes, hello. Has something happened?",
          "ko": "네, 안녕하세요. 무슨 일 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Что-то отопление не работает со вчерашнего дня.",
        "gloss": {
          "en": "The heating hasn't been working since yesterday.",
          "ko": "어제부터 난방이 안 돼요."
        },
        "frames": [
          "ru-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Ой. Может быть, это во всём доме.",
        "gloss": {
          "en": "Oh. Maybe it's the whole building.",
          "ko": "어머. 건물 전체가 그런 걸 수도 있어요."
        }
      },
      {
        "who": "me",
        "text": "Я не уверен, что во всём. У соседей тепло.",
        "gloss": {
          "en": "I'm not sure it's the whole building. The neighbours are warm.",
          "ko": "건물 전체인지는 모르겠어요. 이웃집은 따뜻하대요."
        },
        "frames": [
          "ru-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "Хорошо, я пришлю мастера завтра.",
        "gloss": {
          "en": "OK, I'll send a repairman tomorrow.",
          "ko": "알겠어요, 내일 기사를 보낼게요."
        }
      },
      {
        "who": "me",
        "text": "Вы не могли бы прислать его сегодня? Очень холодно.",
        "gloss": {
          "en": "Could you possibly send him today? It's very cold.",
          "ko": "오늘 보내 주실 수 있을까요? 너무 추워요."
        },
        "frames": [
          "ru-f3-05"
        ]
      }
    ]
  },
  {
    "id": "ru-3-b08",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Turning down a trip to the dacha",
      "ko": "다차 여행 거절"
    },
    "expressions": [
      "Кстати"
    ],
    "grammar": [
      2,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Слушай, поедешь с нами на дачу в субботу?",
        "gloss": {
          "en": "Listen, will you come with us to the dacha on Saturday?",
          "ko": "있잖아요, 토요일에 우리랑 다차에 갈래요?"
        }
      },
      {
        "who": "me",
        "text": "Если бы я был свободен, я бы поехал.",
        "gloss": {
          "en": "If I were free, I'd go.",
          "ko": "시간이 있으면 갈 텐데요."
        },
        "frames": [
          "ru-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "А что у тебя в субботу?",
        "gloss": {
          "en": "What's on for you on Saturday?",
          "ko": "토요일에 뭐 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Мне надо помочь брату с переездом.",
        "gloss": {
          "en": "I need to help my brother move.",
          "ko": "형 이사를 도와줘야 해요."
        },
        "frames": [
          "ru-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Жаль. А в воскресенье?",
        "gloss": {
          "en": "Too bad. What about Sunday?",
          "ko": "아쉽네요. 일요일은요?"
        }
      },
      {
        "who": "me",
        "text": "Может быть, смогу. Я зайду к вам вечером.",
        "gloss": {
          "en": "Maybe I can. I'll drop by your place in the evening.",
          "ko": "아마 될 것 같아요. 저녁에 들를게요."
        },
        "frames": [
          "ru-f3-14",
          "ru-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Отлично, ждём!",
        "gloss": {
          "en": "Great, we'll be waiting!",
          "ko": "좋아요, 기다릴게요!"
        }
      },
      {
        "who": "me",
        "text": "Договорились. Кстати, что привезти?",
        "gloss": {
          "en": "Deal. By the way, what should I bring?",
          "ko": "좋아요. 그런데 뭐 가져갈까요?"
        },
        "frames": [
          "ru-f3-17"
        ]
      }
    ]
  },
  {
    "id": "ru-3-b09",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Book club: talking about the ending",
      "ko": "독서 모임: 결말 이야기"
    },
    "expressions": [
      "Мне кажется",
      "По-моему"
    ],
    "grammar": [
      0,
      1,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ну что, ты прочитал книгу для клуба?",
        "gloss": {
          "en": "So, did you read the book for the club?",
          "ko": "그래서 독서 모임 책 다 읽었어요?"
        }
      },
      {
        "who": "me",
        "text": "Да, я наконец прочитал её вчера ночью.",
        "gloss": {
          "en": "Yes, I finally finished it last night.",
          "ko": "네, 어젯밤에 드디어 다 읽었어요."
        },
        "frames": [
          "ru-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "И как тебе?",
        "gloss": {
          "en": "And what did you think?",
          "ko": "어땠어요?"
        }
      },
      {
        "who": "me",
        "text": "Мне кажется, конец слишком грустный.",
        "gloss": {
          "en": "It seems to me the ending is too sad.",
          "ko": "결말이 너무 슬픈 것 같아요."
        },
        "frames": [
          "ru-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "А мне понравился. Особенно главный герой.",
        "gloss": {
          "en": "I liked it. Especially the main character.",
          "ko": "저는 좋았어요. 특히 주인공이요."
        }
      },
      {
        "who": "me",
        "text": "Это тот герой, который всё время врёт?",
        "gloss": {
          "en": "Is that the character who lies all the time?",
          "ko": "계속 거짓말하는 그 주인공 말이에요?"
        },
        "frames": [
          "ru-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "Да! Он сложный, но интересный.",
        "gloss": {
          "en": "Yes! He's complicated, but interesting.",
          "ko": "네! 복잡하지만 흥미로운 인물이에요."
        }
      },
      {
        "who": "me",
        "text": "По-моему, он просто трус.",
        "gloss": {
          "en": "In my opinion, he's just a coward.",
          "ko": "제 생각엔 그냥 겁쟁이예요."
        },
        "frames": [
          "ru-f3-02"
        ]
      }
    ]
  },
  {
    "id": "ru-3-b10",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Wrong order from an online shop",
      "ko": "온라인 쇼핑몰 주문 오배송"
    },
    "expressions": [
      "Мне кажется",
      "Вы не могли бы"
    ],
    "grammar": [
      1,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Служба поддержки, здравствуйте.",
        "gloss": {
          "en": "Customer support, hello.",
          "ko": "고객센터입니다, 안녕하세요."
        }
      },
      {
        "who": "me",
        "text": "Здравствуйте. Мне привезли не тот заказ.",
        "gloss": {
          "en": "Hello. I received the wrong order.",
          "ko": "안녕하세요. 주문한 게 아닌 물건이 왔어요."
        }
      },
      {
        "who": "them",
        "text": "Извините. Что именно вы получили?",
        "gloss": {
          "en": "Sorry about that. What exactly did you receive?",
          "ko": "죄송합니다. 정확히 뭘 받으셨어요?"
        }
      },
      {
        "who": "me",
        "text": "Мне кажется, это чужой заказ: тут детские игрушки.",
        "gloss": {
          "en": "It seems to me it's someone else's order: there are kids' toys in it.",
          "ko": "다른 사람 주문 같아요. 아이 장난감이 들어 있어요."
        },
        "frames": [
          "ru-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Понятно. Мы заберём его завтра.",
        "gloss": {
          "en": "I see. We'll collect it tomorrow.",
          "ko": "알겠습니다. 내일 회수해 갈게요."
        }
      },
      {
        "who": "me",
        "text": "Вы не могли бы привезти мой заказ тоже завтра?",
        "gloss": {
          "en": "Could you possibly bring my order tomorrow too?",
          "ko": "제 주문도 내일 같이 가져다주실 수 있을까요?"
        },
        "frames": [
          "ru-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Да, курьер привезёт его утром.",
        "gloss": {
          "en": "Yes, the courier will bring it in the morning.",
          "ko": "네, 택배 기사가 오전에 가져다드릴 거예요."
        }
      },
      {
        "who": "me",
        "text": "Хорошо. Мне надо знать время, чтобы быть дома.",
        "gloss": {
          "en": "OK. I need to know the time so I can be at home.",
          "ko": "좋아요. 집에 있으려면 시간을 알아야 해요."
        },
        "frames": [
          "ru-f3-07",
          "ru-f3-08"
        ]
      }
    ]
  },
  {
    "id": "ru-3-b11",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Checking the time of a concert",
      "ko": "콘서트 시간 확인"
    },
    "expressions": [
      "Ты серьёзно",
      "Кстати"
    ],
    "grammar": [
      1,
      4,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ты идёшь на концерт в пятницу?",
        "gloss": {
          "en": "Are you going to the concert on Friday?",
          "ko": "금요일 콘서트 가요?"
        }
      },
      {
        "who": "me",
        "text": "Конечно! Концерт начинается в восемь, да?",
        "gloss": {
          "en": "Of course! The concert starts at eight, right?",
          "ko": "물론이죠! 콘서트 여덟 시에 시작하죠?"
        },
        "frames": [
          "ru-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "Нет, в семь. А вход открывается в шесть.",
        "gloss": {
          "en": "No, at seven. And the doors open at six.",
          "ko": "아니요, 일곱 시요. 입장은 여섯 시부터예요."
        }
      },
      {
        "who": "me",
        "text": "Ты серьёзно? Я думал, в восемь.",
        "gloss": {
          "en": "Are you serious? I thought it was at eight.",
          "ko": "진짜요? 여덟 시인 줄 알았어요."
        },
        "frames": [
          "ru-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "Да, лучше прийти пораньше.",
        "gloss": {
          "en": "Yes, it's better to come early.",
          "ko": "네, 일찍 가는 게 좋아요."
        }
      },
      {
        "who": "me",
        "text": "Хорошо. Я зайду за тобой в шесть, чтобы не опоздать.",
        "gloss": {
          "en": "OK. I'll come by for you at six so we're not late.",
          "ko": "좋아요. 늦지 않게 여섯 시에 데리러 갈게요."
        },
        "frames": [
          "ru-f3-11",
          "ru-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Отлично, буду готова.",
        "gloss": {
          "en": "Great, I'll be ready.",
          "ko": "좋아요, 준비하고 있을게요."
        }
      },
      {
        "who": "me",
        "text": "Кстати, как тебе их новый альбом?",
        "gloss": {
          "en": "By the way, how do you like their new album?",
          "ko": "그런데 그 밴드 새 앨범 어때요?"
        },
        "frames": [
          "ru-f3-17",
          "ru-f3-04"
        ]
      }
    ]
  },
  {
    "id": "ru-3-b12",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Choosing a gift for a friend in a shop",
      "ko": "가게에서 친구 선물 고르기"
    },
    "expressions": [
      "Честно говоря",
      "Я не уверен",
      "По-моему"
    ],
    "grammar": [
      1,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Вам что-нибудь подсказать?",
        "gloss": {
          "en": "Can I help you find something?",
          "ko": "찾으시는 거 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Да. Мне надо купить подарок другу.",
        "gloss": {
          "en": "Yes. I need to buy a present for a friend.",
          "ko": "네. 친구 선물을 사야 해요."
        },
        "frames": [
          "ru-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "А что он любит?",
        "gloss": {
          "en": "What does he like?",
          "ko": "친구분이 뭘 좋아하세요?"
        }
      },
      {
        "who": "me",
        "text": "Это друг, который очень любит готовить.",
        "gloss": {
          "en": "He's a friend who really loves cooking.",
          "ko": "요리를 정말 좋아하는 친구예요."
        },
        "frames": [
          "ru-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "Тогда посмотрите этот набор ножей.",
        "gloss": {
          "en": "Then have a look at this knife set.",
          "ko": "그럼 이 칼 세트 보세요."
        }
      },
      {
        "who": "me",
        "text": "Честно говоря, я не уверен, что ножи — хороший подарок.",
        "gloss": {
          "en": "To be honest, I'm not sure knives are a good present.",
          "ko": "솔직히 칼이 좋은 선물인지 잘 모르겠어요."
        },
        "frames": [
          "ru-f3-19",
          "ru-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "Тогда, может быть, кулинарная книга?",
        "gloss": {
          "en": "Then maybe a cookbook?",
          "ko": "그럼 요리책은 어떠세요?"
        }
      },
      {
        "who": "me",
        "text": "По-моему, это отличная идея!",
        "gloss": {
          "en": "I think that's a great idea!",
          "ko": "제 생각엔 아주 좋은 생각이에요!"
        },
        "frames": [
          "ru-f3-02"
        ]
      }
    ]
  },
  {
    "id": "ru-3-b13",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Clouds on a weekend walk",
      "ko": "주말 산책 중 먹구름"
    },
    "expressions": [
      "Может быть",
      "Ну ладно"
    ],
    "grammar": [
      1,
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Смотри, какие тучи. Будет дождь.",
        "gloss": {
          "en": "Look at those clouds. It's going to rain.",
          "ko": "저 구름 좀 봐요. 비 오겠어요."
        }
      },
      {
        "who": "me",
        "text": "Может быть. Давай вернёмся, чтобы не промокнуть.",
        "gloss": {
          "en": "Maybe. Let's head back so we don't get wet.",
          "ko": "그럴지도요. 비 안 맞게 돌아가요."
        },
        "frames": [
          "ru-f3-14",
          "ru-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Да, ты прав. Кстати, у тебя есть зонт?",
        "gloss": {
          "en": "Yes, you're right. By the way, do you have an umbrella?",
          "ko": "네, 맞아요. 그런데 우산 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Нет, он дома. Если бы я знал, я бы взял.",
        "gloss": {
          "en": "No, it's at home. If I'd known, I'd have taken it.",
          "ko": "아니요, 집에 있어요. 알았으면 가져왔을 텐데요."
        },
        "frames": [
          "ru-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Ничего, тут рядом кафе.",
        "gloss": {
          "en": "Never mind, there's a café nearby.",
          "ko": "괜찮아요, 근처에 카페가 있어요."
        }
      },
      {
        "who": "me",
        "text": "Отлично. Мне нравится это кафе, там вкусный чай.",
        "gloss": {
          "en": "Great. I like that café, the tea there is good.",
          "ko": "좋아요. 그 카페 좋아해요, 차가 맛있어요."
        },
        "frames": [
          "ru-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "Вообще-то, оно закрывается в пять.",
        "gloss": {
          "en": "Actually, it closes at five.",
          "ko": "사실 거기 다섯 시에 닫아요."
        }
      },
      {
        "who": "me",
        "text": "Ну ладно. Сейчас только четыре, успеем.",
        "gloss": {
          "en": "Oh well. It's only four now, we'll make it.",
          "ko": "뭐 괜찮아요. 지금 네 시니까 갈 수 있어요."
        }
      }
    ]
  },
  {
    "id": "ru-3-b14",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Colleagues complaining about the new schedule",
      "ko": "새 근무 일정에 대한 동료와의 대화"
    },
    "expressions": [
      "Честно говоря",
      "Мне кажется",
      "Может быть"
    ],
    "grammar": [
      1,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Слушай, как тебе новый график работы?",
        "gloss": {
          "en": "Listen, how do you like the new work schedule?",
          "ko": "있잖아요, 새 근무 일정 어때요?"
        }
      },
      {
        "who": "me",
        "text": "Честно говоря, не очень.",
        "gloss": {
          "en": "To be honest, not much.",
          "ko": "솔직히 별로예요."
        },
        "frames": [
          "ru-f3-19"
        ]
      },
      {
        "who": "them",
        "text": "Почему?",
        "gloss": {
          "en": "Why?",
          "ko": "왜요?"
        }
      },
      {
        "who": "me",
        "text": "Мне кажется, совещания слишком рано начинаются.",
        "gloss": {
          "en": "It seems to me the meetings start too early.",
          "ko": "회의가 너무 일찍 시작하는 것 같아요."
        },
        "frames": [
          "ru-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Да, в восемь утра — это тяжело.",
        "gloss": {
          "en": "Yes, eight in the morning is hard.",
          "ko": "맞아요, 아침 여덟 시는 힘들죠."
        }
      },
      {
        "who": "me",
        "text": "Может быть, стоит поговорить с начальником?",
        "gloss": {
          "en": "Maybe we should talk to the boss?",
          "ko": "부장님께 말씀드려 보는 게 어떨까요?"
        },
        "frames": [
          "ru-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "Давай. Ты ему напишешь?",
        "gloss": {
          "en": "OK. Will you write to him?",
          "ko": "그래요. 부장님께 메시지 보낼 거예요?"
        }
      },
      {
        "who": "me",
        "text": "Хорошо. Я зайду к нему после обеда.",
        "gloss": {
          "en": "OK. I'll drop in on him after lunch.",
          "ko": "좋아요. 점심 먹고 찾아가 볼게요."
        },
        "frames": [
          "ru-f3-11"
        ]
      }
    ]
  },
  {
    "id": "ru-3-b15",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Water leaking into the neighbour's flat",
      "ko": "아래층으로 물이 샘"
    },
    "expressions": [
      "Не может быть",
      "Мне кажется",
      "Вы не могли бы"
    ],
    "grammar": [
      1,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Здравствуйте! Простите, у меня с потолка капает. У вас всё в порядке?",
        "gloss": {
          "en": "Hello! Sorry, water is dripping from my ceiling. Is everything OK at your place?",
          "ko": "안녕하세요! 실례지만 우리 집 천장에서 물이 떨어져요. 댁은 괜찮으세요?"
        }
      },
      {
        "who": "me",
        "text": "Не может быть! Сейчас посмотрю.",
        "gloss": {
          "en": "No way! I'll take a look now.",
          "ko": "말도 안 돼요! 지금 볼게요."
        }
      },
      {
        "who": "them",
        "text": "Спасибо. Может, у вас труба течёт?",
        "gloss": {
          "en": "Thanks. Maybe a pipe is leaking at your place?",
          "ko": "고마워요. 혹시 그 집 배관이 새는 거 아니에요?"
        }
      },
      {
        "who": "me",
        "text": "Да, в ванной вода. Мне кажется, это труба под раковиной.",
        "gloss": {
          "en": "Yes, there's water in the bathroom. It seems to me it's the pipe under the sink.",
          "ko": "네, 욕실에 물이 있어요. 세면대 밑 배관인 것 같아요."
        },
        "frames": [
          "ru-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Надо срочно вызвать сантехника.",
        "gloss": {
          "en": "We need to call a plumber right away.",
          "ko": "빨리 배관공을 불러야 해요."
        }
      },
      {
        "who": "me",
        "text": "Да, мне надо позвонить в управляющую компанию.",
        "gloss": {
          "en": "Yes, I need to call the building management.",
          "ko": "네, 관리 사무소에 전화해야겠어요."
        },
        "frames": [
          "ru-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "У меня есть их номер.",
        "gloss": {
          "en": "I have their number.",
          "ko": "저한테 번호가 있어요."
        }
      },
      {
        "who": "me",
        "text": "Спасибо огромное! Вы не могли бы продиктовать его?",
        "gloss": {
          "en": "Thank you so much! Could you possibly read it out to me?",
          "ko": "정말 고마워요! 번호를 불러 주실 수 있을까요?"
        },
        "frames": [
          "ru-f3-05"
        ]
      }
    ]
  },
  {
    "id": "ru-3-b16",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A friend visits the new flat",
      "ko": "친구가 새 집에 놀러 옴"
    },
    "expressions": [
      "Кстати"
    ],
    "grammar": [
      0,
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ого, какая квартира! Ты наконец переехал?",
        "gloss": {
          "en": "Wow, what a flat! You finally moved?",
          "ko": "와, 집 좋네요! 드디어 이사했어요?"
        }
      },
      {
        "who": "me",
        "text": "Да, я наконец переехал на прошлой неделе.",
        "gloss": {
          "en": "Yes, I finally moved last week.",
          "ko": "네, 지난주에 드디어 이사했어요."
        },
        "frames": [
          "ru-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "Мне нравится! Особенно кухня.",
        "gloss": {
          "en": "I like it! Especially the kitchen.",
          "ko": "마음에 들어요! 특히 부엌이요."
        }
      },
      {
        "who": "me",
        "text": "Мне тоже. Это стол, который мне подарили родители.",
        "gloss": {
          "en": "Me too. This is the table my parents gave me.",
          "ko": "저도요. 이건 부모님이 선물해 주신 식탁이에요."
        },
        "frames": [
          "ru-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "Красивый! А где диван?",
        "gloss": {
          "en": "Nice! And where's the sofa?",
          "ko": "예쁘네요! 소파는 어디 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Его привезут завтра. Если бы его привезли раньше, я бы позвал тебя в субботу.",
        "gloss": {
          "en": "They're delivering it tomorrow. If it had come earlier, I'd have invited you on Saturday.",
          "ko": "내일 와요. 더 일찍 왔으면 토요일에 불렀을 텐데요."
        },
        "frames": [
          "ru-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Ничего, я ещё приду!",
        "gloss": {
          "en": "No problem, I'll come again!",
          "ko": "괜찮아요, 또 올게요!"
        }
      },
      {
        "who": "me",
        "text": "Кстати, хочешь чаю?",
        "gloss": {
          "en": "By the way, would you like some tea?",
          "ko": "참, 차 마실래요?"
        },
        "frames": [
          "ru-f3-17"
        ]
      }
    ]
  },
  {
    "id": "ru-3-b17",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Calling a gym about the schedule",
      "ko": "헬스장에 시간표 문의"
    },
    "expressions": [],
    "grammar": [
      5,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Фитнес-клуб «Энергия», здравствуйте.",
        "gloss": {
          "en": "Energy fitness club, hello.",
          "ko": "에네르기야 피트니스 클럽입니다, 안녕하세요."
        }
      },
      {
        "who": "me",
        "text": "Здравствуйте. Мне надо узнать расписание на субботу.",
        "gloss": {
          "en": "Hello. I need to find out the Saturday schedule.",
          "ko": "안녕하세요. 토요일 시간표를 알고 싶어요."
        },
        "frames": [
          "ru-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Пожалуйста. В субботу есть йога и бассейн.",
        "gloss": {
          "en": "Sure. On Saturday there's yoga and the pool.",
          "ko": "네. 토요일엔 요가랑 수영장이 있어요."
        }
      },
      {
        "who": "me",
        "text": "Отлично. Йога начинается в десять?",
        "gloss": {
          "en": "Great. Does yoga start at ten?",
          "ko": "좋아요. 요가는 열 시에 시작해요?"
        },
        "frames": [
          "ru-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "Нет, в одиннадцать. А бассейн работает весь день.",
        "gloss": {
          "en": "No, at eleven. And the pool is open all day.",
          "ko": "아니요, 열한 시요. 수영장은 하루 종일 열어요."
        }
      },
      {
        "who": "me",
        "text": "Понятно. Вы не могли бы записать меня на йогу?",
        "gloss": {
          "en": "I see. Could you possibly sign me up for yoga?",
          "ko": "알겠어요. 요가 수업에 등록해 주실 수 있을까요?"
        },
        "frames": [
          "ru-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Конечно. Первое занятие бесплатно.",
        "gloss": {
          "en": "Of course. The first class is free.",
          "ko": "물론이죠. 첫 수업은 무료예요."
        }
      },
      {
        "who": "me",
        "text": "Здорово! Я зайду пораньше, чтобы посмотреть клуб.",
        "gloss": {
          "en": "Great! I'll drop by early to look around the club.",
          "ko": "좋아요! 클럽을 둘러보게 좀 일찍 들를게요."
        },
        "frames": [
          "ru-f3-11",
          "ru-f3-08"
        ]
      }
    ]
  },
  {
    "id": "ru-3-b18",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "A friend has never seen a classic New Year film",
      "ko": "친구가 연말 명작 영화를 처음 봄"
    },
    "expressions": [
      "Ты серьёзно",
      "Как тебе",
      "По-моему",
      "Мне кажется"
    ],
    "grammar": [
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "Вчера я в первый раз посмотрела «Иронию судьбы».",
        "gloss": {
          "en": "Yesterday I watched «The Irony of Fate» for the first time.",
          "ko": "어제 «운명의 아이러니»를 처음 봤어요."
        }
      },
      {
        "who": "me",
        "text": "Ты серьёзно? Её же показывают каждый Новый год!",
        "gloss": {
          "en": "Are you serious? It's on every New Year!",
          "ko": "진짜요? 매년 새해마다 TV에서 하잖아요!"
        },
        "frames": [
          "ru-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "Знаю, но я всегда была занята.",
        "gloss": {
          "en": "I know, but I was always busy.",
          "ko": "알아요, 근데 늘 바빴어요."
        }
      },
      {
        "who": "me",
        "text": "Ну и как тебе?",
        "gloss": {
          "en": "So how did you like it?",
          "ko": "그래서 어땠어요?"
        },
        "frames": [
          "ru-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "Очень понравилось! Особенно песни.",
        "gloss": {
          "en": "I loved it! Especially the songs.",
          "ko": "정말 좋았어요! 특히 노래요."
        }
      },
      {
        "who": "me",
        "text": "По-моему, это лучший новогодний фильм.",
        "gloss": {
          "en": "In my opinion, it's the best New Year film.",
          "ko": "제 생각엔 최고의 새해 영화예요."
        },
        "frames": [
          "ru-f3-02"
        ]
      },
      {
        "who": "them",
        "text": "Согласна. Посмотрим вместе в этом году?",
        "gloss": {
          "en": "Agreed. Shall we watch it together this year?",
          "ko": "맞아요. 올해는 같이 볼까요?"
        }
      },
      {
        "who": "me",
        "text": "С удовольствием! Мне кажется, будет весело.",
        "gloss": {
          "en": "With pleasure! I think it'll be fun.",
          "ko": "좋아요! 재밌을 것 같아요."
        },
        "frames": [
          "ru-f3-01"
        ]
      }
    ]
  },
  {
    "id": "ru-3-b19",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Wi-Fi problem in a café",
      "ko": "카페 와이파이 문제"
    },
    "expressions": [
      "Я не уверен",
      "Вы не могли бы",
      "Кстати"
    ],
    "grammar": [
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Что-то случилось?",
        "gloss": {
          "en": "Is something wrong?",
          "ko": "무슨 문제 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Да. Что-то вайфай не работает.",
        "gloss": {
          "en": "Yes. The Wi-Fi isn't working.",
          "ko": "네. 와이파이가 안 돼요."
        },
        "frames": [
          "ru-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Странно. Может быть, вы ввели не тот пароль?",
        "gloss": {
          "en": "Strange. Maybe you entered the wrong password?",
          "ko": "이상하네요. 비밀번호를 잘못 입력하신 거 아닐까요?"
        }
      },
      {
        "who": "me",
        "text": "Я не уверен, что ввёл правильно. Вы не могли бы показать?",
        "gloss": {
          "en": "I'm not sure I typed it right. Could you possibly show me?",
          "ko": "제대로 입력했는지 모르겠어요. 보여 주실 수 있을까요?"
        },
        "frames": [
          "ru-f3-15",
          "ru-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Конечно. Вот пароль, на чеке.",
        "gloss": {
          "en": "Of course. Here's the password, on the receipt.",
          "ko": "물론이죠. 비밀번호는 영수증에 있어요."
        }
      },
      {
        "who": "me",
        "text": "Теперь работает! Мне надо отправить письмо, чтобы успеть до обеда.",
        "gloss": {
          "en": "It works now! I need to send an email to make it before lunch.",
          "ko": "이제 돼요! 점심 전에 맞추려면 메일을 보내야 해요."
        },
        "frames": [
          "ru-f3-07",
          "ru-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Отлично. Ещё кофе?",
        "gloss": {
          "en": "Great. More coffee?",
          "ko": "좋네요. 커피 더 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Да, пожалуйста. Кстати, во сколько вы закрываетесь?",
        "gloss": {
          "en": "Yes, please. By the way, what time do you close?",
          "ko": "네, 주세요. 그런데 몇 시에 닫아요?"
        },
        "frames": [
          "ru-f3-17"
        ]
      }
    ]
  },
  {
    "id": "ru-3-b20",
    "stage": 3,
    "bank": true,
    "setting": {
      "en": "Late for a study group meeting",
      "ko": "스터디 모임에 늦음"
    },
    "expressions": [
      "Прости за опоздание",
      "Как тебе",
      "Мне кажется"
    ],
    "grammar": [
      1,
      2,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Привет! Мы уже начали.",
        "gloss": {
          "en": "Hi! We've already started.",
          "ko": "안녕하세요! 벌써 시작했어요."
        }
      },
      {
        "who": "me",
        "text": "Прости за опоздание, я не мог найти аудиторию.",
        "gloss": {
          "en": "Sorry I'm late, I couldn't find the room.",
          "ko": "늦어서 미안해요, 강의실을 못 찾았어요."
        },
        "frames": [
          "ru-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Ничего, бывает. Мы обсуждаем проект.",
        "gloss": {
          "en": "No problem, it happens. We're discussing the project.",
          "ko": "괜찮아요, 그럴 수 있죠. 프로젝트 얘기 중이에요."
        }
      },
      {
        "who": "me",
        "text": "Как тебе идея с опросом?",
        "gloss": {
          "en": "What do you think of the survey idea?",
          "ko": "설문 조사 아이디어 어때요?"
        },
        "frames": [
          "ru-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "Мне нравится, но времени мало.",
        "gloss": {
          "en": "I like it, but there's not much time.",
          "ko": "좋은데 시간이 별로 없어요."
        }
      },
      {
        "who": "me",
        "text": "Если бы у нас была ещё неделя, я бы сделал большой опрос.",
        "gloss": {
          "en": "If we had another week, I'd do a big survey.",
          "ko": "일주일만 더 있으면 큰 설문을 할 텐데요."
        },
        "frames": [
          "ru-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Может быть, сделаем короткий?",
        "gloss": {
          "en": "Maybe we'll do a short one?",
          "ko": "짧은 걸로 하면 어때요?"
        }
      },
      {
        "who": "me",
        "text": "Хорошо. Мне кажется, это реально, если начнём сегодня.",
        "gloss": {
          "en": "OK. I think it's doable if we start today.",
          "ko": "좋아요. 오늘 시작하면 할 수 있을 것 같아요."
        },
        "frames": [
          "ru-f3-01"
        ]
      }
    ]
  }
];
