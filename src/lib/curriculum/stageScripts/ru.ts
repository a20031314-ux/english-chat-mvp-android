import type { StageScript } from "../stageScripts.ts";

/** ru 단계 대본(curriculum/stageScripts.ts) — 상황 대본 + 표현·문법 대본(x), 1~3단계 내 줄에 틀 태그. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
export const RU: StageScript[] = [
  {
    "id": "ru-1-1",
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
    "stage": 1,
    "situation": 0,
    "setting": {
      "en": "A language exchange evening: meeting Anya for the first time",
      "ko": "언어 교환 모임에서 아냐를 처음 만남"
    },
    "expressions": [
      "Привет",
      "Меня зовут",
      "Очень приятно",
      "Я из Кореи",
      "Спасибо"
    ],
    "grammar": [
      0,
      1,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Привет! Я Аня. А тебя как зовут?",
        "gloss": {
          "en": "Hi! I'm Anya. And what's your name?",
          "ko": "안녕! 나는 아냐야. 너는 이름이 뭐야?"
        }
      },
      {
        "who": "me",
        "text": "Привет! Меня зовут Минсу. Очень приятно.",
        "gloss": {
          "en": "Hi! My name is Minsu. Nice to meet you.",
          "ko": "안녕! 내 이름은 민수야. 만나서 반가워."
        },
        "frames": [
          "ru-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "Мне тоже очень приятно. Ты откуда?",
        "gloss": {
          "en": "Nice to meet you too. Where are you from?",
          "ko": "나도 반가워. 어디서 왔어?"
        }
      },
      {
        "who": "me",
        "text": "Я из Кореи, из Сеула. А ты?",
        "gloss": {
          "en": "I'm from Korea, from Seoul. And you?",
          "ko": "한국, 서울에서 왔어. 너는?"
        },
        "frames": [
          "ru-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "Я из Москвы. Ты студент?",
        "gloss": {
          "en": "I'm from Moscow. Are you a student?",
          "ko": "나는 모스크바 출신이야. 너 학생이야?"
        }
      },
      {
        "who": "me",
        "text": "Нет, я программист. Я работаю в банке.",
        "gloss": {
          "en": "No, I'm a programmer. I work at a bank.",
          "ko": "아니, 나는 프로그래머야. 은행에서 일해."
        },
        "frames": [
          "ru-f1-03",
          "ru-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "Здорово! А я учительница. Ой, это твой телефон?",
        "gloss": {
          "en": "Cool! And I'm a teacher. Oh, is that your phone?",
          "ko": "멋지다! 나는 선생님이야. 어, 이거 네 휴대폰이야?"
        }
      },
      {
        "who": "me",
        "text": "Да, это мой телефон. Спасибо!",
        "gloss": {
          "en": "Yes, that's my phone. Thank you!",
          "ko": "응, 내 휴대폰이야. 고마워!"
        },
        "frames": [
          "ru-f1-10"
        ]
      }
    ]
  },
  {
    "id": "ru-1-2",
    "stage": 1,
    "situation": 1,
    "setting": {
      "en": "Buying water and a snack at a street kiosk",
      "ko": "길거리 가판대에서 물과 간식 사기"
    },
    "expressions": [
      "Здравствуйте",
      "Пожалуйста",
      "Сколько стоит",
      "Извините",
      "Я не понимаю",
      "Ещё раз",
      "Это всё",
      "Пакет не нужен",
      "Спасибо"
    ],
    "grammar": [
      2,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Здравствуйте! Что вам?",
        "gloss": {
          "en": "Hello! What can I get you?",
          "ko": "안녕하세요! 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Здравствуйте! Можно воду без газа, пожалуйста?",
        "gloss": {
          "en": "Hello! Can I have still water, please?",
          "ko": "안녕하세요! 탄산 없는 물 주시겠어요?"
        },
        "frames": [
          "ru-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Маленькую или большую?",
        "gloss": {
          "en": "Small or large?",
          "ko": "작은 거요, 큰 거요?"
        }
      },
      {
        "who": "me",
        "text": "Маленькую. А сколько стоит этот шоколад?",
        "gloss": {
          "en": "Small. And how much is this chocolate?",
          "ko": "작은 거요. 그리고 이 초콜릿은 얼마예요?"
        },
        "frames": [
          "ru-f1-06"
        ]
      },
      {
        "who": "them",
        "text": "Сто двадцать рублей.",
        "gloss": {
          "en": "A hundred and twenty roubles.",
          "ko": "120루블이에요."
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
        "text": "Сто двадцать. Вот, на экране. Что-то ещё?",
        "gloss": {
          "en": "A hundred and twenty. Here, on the screen. Anything else?",
          "ko": "120이요. 여기 화면에요. 더 필요한 거 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Нет, это всё. Пакет не нужен, спасибо.",
        "gloss": {
          "en": "No, that's all. I don't need a bag, thanks.",
          "ko": "아니요, 이게 다예요. 봉투는 필요 없어요, 감사합니다."
        }
      }
    ]
  },
  {
    "id": "ru-1-3",
    "stage": 1,
    "situation": 2,
    "setting": {
      "en": "Asking a passer-by the way to the metro",
      "ko": "지나가는 사람에게 지하철역 가는 길 묻기"
    },
    "expressions": [
      "Пожалуйста",
      "Где здесь туалет",
      "Говорите медленнее",
      "Хорошо",
      "Спасибо",
      "До свидания"
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
        "text": "Да, пожалуйста. Где здесь метро?",
        "gloss": {
          "en": "Yes, please. Where is the metro around here?",
          "ko": "네, 부탁해요. 여기 지하철역이 어디예요?"
        },
        "frames": [
          "ru-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "Метро? Прямо, потом налево, около банка.",
        "gloss": {
          "en": "The metro? Straight on, then left, near the bank.",
          "ko": "지하철역이요? 쭉 가다가 왼쪽, 은행 옆이에요."
        }
      },
      {
        "who": "me",
        "text": "Говорите медленнее, пожалуйста.",
        "gloss": {
          "en": "Please speak more slowly.",
          "ko": "좀 천천히 말해 주세요."
        },
        "frames": [
          "ru-f1-14"
        ]
      },
      {
        "who": "them",
        "text": "Прямо... потом налево. Там банк, а рядом метро.",
        "gloss": {
          "en": "Straight on... then left. There's a bank, and the metro is next to it.",
          "ko": "쭉 가서... 왼쪽이요. 거기 은행이 있고, 그 옆이 지하철역이에요."
        }
      },
      {
        "who": "me",
        "text": "Хорошо, спасибо. А где здесь туалет?",
        "gloss": {
          "en": "OK, thanks. And where is the toilet around here?",
          "ko": "알겠어요, 고마워요. 그리고 여기 화장실은 어디예요?"
        },
        "frames": [
          "ru-f1-05"
        ]
      },
      {
        "who": "them",
        "text": "Туалет есть в метро, внизу, у кассы.",
        "gloss": {
          "en": "There's a toilet in the metro, downstairs, by the ticket office.",
          "ko": "지하철역 안에 있어요, 아래층 매표소 옆에요."
        }
      },
      {
        "who": "me",
        "text": "Понятно. Спасибо большое! До свидания!",
        "gloss": {
          "en": "Got it. Thank you very much! Goodbye!",
          "ko": "알겠어요. 정말 고마워요! 안녕히 계세요!"
        }
      }
    ]
  },
  {
    "id": "ru-1-4",
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
    "stage": 1,
    "situation": 3,
    "setting": {
      "en": "Saying goodbye to your host family on the last morning",
      "ko": "마지막 날 아침 홈스테이 가족과 작별 인사"
    },
    "expressions": [
      "Минуточку",
      "Конечно",
      "Спасибо",
      "Пока",
      "До свидания"
    ],
    "grammar": [
      3,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Минсу, ты уже уезжаешь? Всё собрал?",
        "gloss": {
          "en": "Minsu, are you leaving already? Have you packed everything?",
          "ko": "민수야, 벌써 가니? 짐 다 챙겼어?"
        }
      },
      {
        "who": "me",
        "text": "Минуточку... Да, это моя сумка, а это мой рюкзак.",
        "gloss": {
          "en": "Just a moment... Yes, this is my bag, and this is my backpack.",
          "ko": "잠깐만요... 네, 이게 제 가방이고 이게 제 배낭이에요."
        },
        "frames": [
          "ru-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "Хорошо. А у тебя есть билет?",
        "gloss": {
          "en": "Good. And do you have your ticket?",
          "ko": "그래. 표는 있니?"
        }
      },
      {
        "who": "me",
        "text": "Конечно, у меня есть билет и паспорт.",
        "gloss": {
          "en": "Of course, I have my ticket and passport.",
          "ko": "물론이죠, 표랑 여권 있어요."
        },
        "frames": [
          "ru-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "Молодец. Вот, это пирожки тебе в дорогу.",
        "gloss": {
          "en": "Good boy. Here, some pirozhki for the journey.",
          "ko": "잘했다. 자, 가는 길에 먹으라고 피로시키야."
        }
      },
      {
        "who": "me",
        "text": "Спасибо за пирожки! Можно ваш номер телефона?",
        "gloss": {
          "en": "Thanks for the pirozhki! Can I have your phone number?",
          "ko": "피로시키 고마워요! 전화번호 주실 수 있어요?"
        },
        "frames": [
          "ru-f1-15",
          "ru-f1-07"
        ]
      },
      {
        "who": "them",
        "text": "Конечно, вот. Пиши нам! Пока!",
        "gloss": {
          "en": "Of course, here. Write to us! Bye!",
          "ko": "그럼, 여기. 연락하렴! 잘 가!"
        }
      },
      {
        "who": "me",
        "text": "Пока! До свидания, и спасибо за всё!",
        "gloss": {
          "en": "Bye! Goodbye, and thank you for everything!",
          "ko": "안녕히 계세요! 정말 다 감사했어요!"
        },
        "frames": [
          "ru-f1-15"
        ]
      }
    ]
  },
  {
    "id": "ru-2-1",
    "stage": 2,
    "situation": 0,
    "setting": {
      "en": "Running into your friend Dima and making weekend plans",
      "ko": "친구 디마를 만나 주말 약속 잡기"
    },
    "expressions": [
      "Давно не виделись",
      "Отлично",
      "Как дела",
      "Правда",
      "Давай",
      "Где встретимся",
      "Договорились"
    ],
    "grammar": [
      1,
      3,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Привет! Ого, сколько лет, сколько зим!",
        "gloss": {
          "en": "Hi! Wow, it's been ages!",
          "ko": "안녕! 와, 이게 얼마 만이야!"
        }
      },
      {
        "who": "me",
        "text": "Привет! Да, давно не виделись! Всё отлично, а у тебя как дела?",
        "gloss": {
          "en": "Hi! Yes, long time no see! All great, and how are you?",
          "ko": "안녕! 그러게, 오랜만이다! 난 아주 잘 지내, 너는 어때?"
        }
      },
      {
        "who": "them",
        "text": "Тоже хорошо. Что ты делаешь в выходные?",
        "gloss": {
          "en": "Good too. What are you doing at the weekend?",
          "ko": "나도 잘 지내. 주말에 뭐 해?"
        }
      },
      {
        "who": "me",
        "text": "В субботу я буду работать, но в воскресенье я свободен.",
        "gloss": {
          "en": "On Saturday I'll be working, but on Sunday I'm free.",
          "ko": "토요일엔 일할 거고, 일요일엔 시간 있어."
        },
        "frames": [
          "ru-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "Здорово! В воскресенье в парке концерт. Пойдёшь?",
        "gloss": {
          "en": "Great! There's a concert in the park on Sunday. Will you come?",
          "ko": "좋다! 일요일에 공원에서 콘서트 해. 갈래?"
        }
      },
      {
        "who": "me",
        "text": "Правда? Давай пойдём вместе! Я хочу послушать живую музыку.",
        "gloss": {
          "en": "Really? Let's go together! I want to hear some live music.",
          "ko": "정말? 같이 가자! 라이브 음악 듣고 싶어."
        },
        "frames": [
          "ru-f2-10",
          "ru-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Давай! Концерт в пять.",
        "gloss": {
          "en": "Let's! The concert is at five.",
          "ko": "그러자! 콘서트는 다섯 시야."
        }
      },
      {
        "who": "me",
        "text": "Хорошо. Где встретимся? У метро?",
        "gloss": {
          "en": "OK. Where shall we meet? At the metro?",
          "ko": "좋아. 어디서 만날까? 지하철역 앞?"
        },
        "frames": [
          "ru-f2-13"
        ]
      },
      {
        "who": "them",
        "text": "Да, у метро «Парк культуры», в половине пятого.",
        "gloss": {
          "en": "Yes, at Park Kultury metro, at half past four.",
          "ko": "응, '파르크 쿨투리'역 앞에서 네 시 반에."
        }
      },
      {
        "who": "me",
        "text": "Договорились! До воскресенья!",
        "gloss": {
          "en": "Deal! See you on Sunday!",
          "ko": "좋아, 그렇게 하자! 일요일에 봐!"
        }
      }
    ]
  },
  {
    "id": "ru-2-2",
    "stage": 2,
    "situation": 1,
    "setting": {
      "en": "Describing a sore throat at a pharmacy",
      "ko": "약국에서 목 아픈 증상 말하기"
    },
    "expressions": [
      "У меня болит голова",
      "Подождите",
      "Что посоветуете"
    ],
    "grammar": [
      0,
      2,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Здравствуйте. Что вам?",
        "gloss": {
          "en": "Hello. What can I do for you?",
          "ko": "안녕하세요. 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Здравствуйте. У меня болит горло. И ещё у меня болит голова.",
        "gloss": {
          "en": "Hello. I have a sore throat. And I also have a headache.",
          "ko": "안녕하세요. 목이 아파요. 그리고 머리도 아파요."
        },
        "frames": [
          "ru-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "Давно? Температура есть?",
        "gloss": {
          "en": "Since when? Do you have a temperature?",
          "ko": "언제부터요? 열은 있어요?"
        }
      },
      {
        "who": "me",
        "text": "Со вчерашнего дня. Вчера я весь день был на улице, а было холодно.",
        "gloss": {
          "en": "Since yesterday. Yesterday I was outside all day, and it was cold.",
          "ko": "어제부터요. 어제 하루 종일 밖에 있었는데 추웠거든요."
        },
        "frames": [
          "ru-f2-01"
        ]
      },
      {
        "who": "them",
        "text": "Понятно. Вот спрей для горла и таблетки.",
        "gloss": {
          "en": "I see. Here's a throat spray and some tablets.",
          "ko": "그렇군요. 여기 목 스프레이랑 알약이요."
        }
      },
      {
        "who": "me",
        "text": "Скажите, пожалуйста, как их принимать?",
        "gloss": {
          "en": "Could you tell me how to take them?",
          "ko": "어떻게 먹어야 하는지 알려 주시겠어요?"
        },
        "frames": [
          "ru-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Спрей три раза в день, таблетки — после еды.",
        "gloss": {
          "en": "The spray three times a day, the tablets after meals.",
          "ko": "스프레이는 하루 세 번, 알약은 식후에요."
        }
      },
      {
        "who": "me",
        "text": "Подождите, я запишу. А что посоветуете от кашля?",
        "gloss": {
          "en": "Wait, let me write it down. And what do you recommend for a cough?",
          "ko": "잠깐만요, 적을게요. 그리고 기침에는 뭐가 좋아요?"
        },
        "frames": [
          "ru-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "Вот этот сироп хороший. И пейте больше тёплого чая.",
        "gloss": {
          "en": "This syrup is good. And drink more warm tea.",
          "ko": "이 시럽이 좋아요. 그리고 따뜻한 차를 많이 드세요."
        }
      },
      {
        "who": "me",
        "text": "Спасибо. Я возьму сироп, потому что ночью я кашляю.",
        "gloss": {
          "en": "Thanks. I'll take the syrup, because I cough at night.",
          "ko": "감사합니다. 밤에 기침을 해서 시럽도 살게요."
        },
        "frames": [
          "ru-f2-11"
        ]
      }
    ]
  },
  {
    "id": "ru-2-3",
    "stage": 2,
    "situation": 2,
    "setting": {
      "en": "Ordering lunch at a canteen-style café",
      "ko": "셀프식 식당에서 점심 주문하기"
    },
    "expressions": [
      "Что посоветуете",
      "Отлично",
      "Можно сфотографировать",
      "Здорово"
    ],
    "grammar": [
      2,
      3
    ],
    "lines": [
      {
        "who": "them",
        "text": "Следующий! Что будете брать?",
        "gloss": {
          "en": "Next! What will you have?",
          "ko": "다음 분! 뭐 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Что посоветуете? Я здесь первый раз.",
        "gloss": {
          "en": "What do you recommend? It's my first time here.",
          "ko": "뭐가 좋아요? 여기 처음이에요."
        },
        "frames": [
          "ru-f2-16"
        ]
      },
      {
        "who": "them",
        "text": "Сегодня хороший борщ и котлеты с пюре.",
        "gloss": {
          "en": "Today the borscht and the cutlets with mash are good.",
          "ko": "오늘은 보르시랑 커틀릿에 으깬 감자가 좋아요."
        }
      },
      {
        "who": "me",
        "text": "Отлично. Мне, пожалуйста, борщ и котлету с пюре.",
        "gloss": {
          "en": "Great. I'll have the borscht and a cutlet with mash, please.",
          "ko": "좋아요. 보르시랑 커틀릿에 으깬 감자 주세요."
        },
        "frames": [
          "ru-f2-17"
        ]
      },
      {
        "who": "them",
        "text": "Хлеб берёте? Компот, чай?",
        "gloss": {
          "en": "Will you take bread? Kompot, tea?",
          "ko": "빵도 드려요? 콤포트나 차는요?"
        }
      },
      {
        "who": "me",
        "text": "Да, хлеб и чай. Можно сфотографировать меню? Я хочу запомнить названия.",
        "gloss": {
          "en": "Yes, bread and tea. May I take a photo of the menu? I want to remember the names.",
          "ko": "네, 빵이랑 차요. 메뉴판 사진 찍어도 돼요? 음식 이름을 외우고 싶어서요."
        },
        "frames": [
          "ru-f2-15",
          "ru-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Конечно, фотографируйте. С вас триста сорок рублей.",
        "gloss": {
          "en": "Of course, go ahead. That's three hundred and forty roubles.",
          "ko": "그럼요, 찍으세요. 340루블입니다."
        }
      },
      {
        "who": "me",
        "text": "Вот, пожалуйста. Скажите, пожалуйста, где можно сесть?",
        "gloss": {
          "en": "Here you are. Could you tell me where I can sit?",
          "ko": "여기요. 어디 앉으면 되는지 알려 주시겠어요?"
        },
        "frames": [
          "ru-f2-04"
        ]
      },
      {
        "who": "them",
        "text": "Наверху, у окна, есть свободные места. Приятного аппетита!",
        "gloss": {
          "en": "Upstairs, by the window, there are free seats. Enjoy your meal!",
          "ko": "위층 창가에 빈자리가 있어요. 맛있게 드세요!"
        }
      },
      {
        "who": "me",
        "text": "Здорово, спасибо!",
        "gloss": {
          "en": "Great, thank you!",
          "ko": "좋네요, 감사합니다!"
        }
      }
    ]
  },
  {
    "id": "ru-2-4",
    "stage": 2,
    "situation": 3,
    "setting": {
      "en": "Checking tomorrow's meeting time with your coworker Lena",
      "ko": "동료 레나와 내일 회의 시간 확인하기"
    },
    "expressions": [
      "Во сколько",
      "Что случилось",
      "Ничего страшного",
      "Давай",
      "Не за что",
      "До завтра",
      "Удачи"
    ],
    "grammar": [
      3,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Привет! Ты завтра будешь на совещании?",
        "gloss": {
          "en": "Hi! Will you be at the meeting tomorrow?",
          "ko": "안녕! 내일 회의 들어와?"
        }
      },
      {
        "who": "me",
        "text": "Да, буду. А во сколько оно? В десять, в большой переговорной?",
        "gloss": {
          "en": "Yes, I will. What time is it? At ten, in the big meeting room?",
          "ko": "응, 들어가. 근데 몇 시야? 열 시, 큰 회의실에서 맞지?"
        },
        "frames": [
          "ru-f2-12"
        ]
      },
      {
        "who": "them",
        "text": "Да, в десять. Ой, а в десять я буду у врача!",
        "gloss": {
          "en": "Yes, at ten. Oh, but at ten I'll be at the doctor's!",
          "ko": "응, 열 시. 아, 근데 나 열 시에 병원 가야 하는데!"
        }
      },
      {
        "who": "me",
        "text": "Что случилось? Ты заболела?",
        "gloss": {
          "en": "What happened? Are you ill?",
          "ko": "무슨 일 있어? 아파?"
        }
      },
      {
        "who": "them",
        "text": "Нет, просто плановый осмотр. Извини, я забыла сказать раньше.",
        "gloss": {
          "en": "No, just a routine check-up. Sorry, I forgot to say earlier.",
          "ko": "아니, 그냥 정기 검진이야. 미리 말한다는 걸 잊었어, 미안."
        }
      },
      {
        "who": "me",
        "text": "Ничего страшного. Давай спросим у Олега, может, можно перенести.",
        "gloss": {
          "en": "No big deal. Let's ask Oleg, maybe we can move it.",
          "ko": "괜찮아. 올레그한테 물어보자, 미룰 수 있을지도 몰라."
        },
        "frames": [
          "ru-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "Он сегодня в командировке, в Казани.",
        "gloss": {
          "en": "He's on a business trip today, in Kazan.",
          "ko": "올레그는 오늘 카잔으로 출장 갔어."
        }
      },
      {
        "who": "me",
        "text": "Тогда я ему напишу. Я хочу перенести совещание на одиннадцать.",
        "gloss": {
          "en": "Then I'll text him. I want to move the meeting to eleven.",
          "ko": "그럼 내가 메시지 보낼게. 회의를 열한 시로 옮기고 싶다고."
        },
        "frames": [
          "ru-f2-06"
        ]
      },
      {
        "who": "them",
        "text": "Спасибо тебе большое!",
        "gloss": {
          "en": "Thank you so much!",
          "ko": "정말 고마워!"
        }
      },
      {
        "who": "me",
        "text": "Не за что! До завтра! Удачи у врача!",
        "gloss": {
          "en": "Don't mention it! See you tomorrow! Good luck at the doctor's!",
          "ko": "별말을! 내일 봐! 병원 잘 다녀와!"
        }
      }
    ]
  },
  {
    "id": "ru-2-x1",
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
    "stage": 2,
    "setting": {
      "en": "On the phone with a friend: lost on the way to a party",
      "ko": "파티 가는 길에 길을 잃고 친구와 통화"
    },
    "expressions": [
      "Я заблудился",
      "Жаль"
    ],
    "grammar": [
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Алло, Минсу? Ты где? Мы уже все здесь.",
        "gloss": {
          "en": "Hello, Minsu? Where are you? We're all here already.",
          "ko": "여보세요, 민수? 어디야? 우리 다 와 있어."
        }
      },
      {
        "who": "me",
        "text": "Привет! Я заблудился. Я еду в центр на автобусе, но, кажется, не туда.",
        "gloss": {
          "en": "Hi! I'm lost. I'm going to the centre by bus, but I think it's the wrong way.",
          "ko": "안녕! 나 길을 잃었어. 시내 가는 버스를 탔는데 반대쪽인 것 같아."
        },
        "frames": [
          "ru-f2-09"
        ]
      },
      {
        "who": "them",
        "text": "Ой! А какую остановку ты видишь?",
        "gloss": {
          "en": "Oh! What stop can you see?",
          "ko": "어머! 지금 무슨 정류장이 보여?"
        }
      },
      {
        "who": "me",
        "text": "Не вижу. Сейчас я иду в магазин, там спрошу.",
        "gloss": {
          "en": "I can't see one. I'm going into a shop now, I'll ask there.",
          "ko": "안 보여. 지금 가게에 들어가서 물어볼게."
        },
        "frames": [
          "ru-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "Хорошо. Кстати, торт уже съели, извини!",
        "gloss": {
          "en": "OK. By the way, the cake's already gone, sorry!",
          "ko": "알았어. 그런데 케이크는 벌써 다 먹었어, 미안!"
        }
      },
      {
        "who": "me",
        "text": "Жаль! Ладно, я еду в гости на такси.",
        "gloss": {
          "en": "Shame! OK, I'm coming over by taxi.",
          "ko": "아쉽다! 알았어, 택시 타고 갈게."
        },
        "frames": [
          "ru-f2-09"
        ]
      }
    ]
  },
  {
    "id": "ru-3-1",
    "stage": 3,
    "situation": 0,
    "setting": {
      "en": "Running late to the cinema where your friend Katya is waiting",
      "ko": "영화관에서 기다리는 친구 카탸에게 늦게 도착함"
    },
    "expressions": [
      "Прости за опоздание",
      "Честно говоря",
      "Слушай",
      "Кстати",
      "Ну ладно"
    ],
    "grammar": [
      2,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ну наконец-то! Фильм уже начался.",
        "gloss": {
          "en": "Finally! The film has already started.",
          "ko": "드디어 왔네! 영화 벌써 시작했어."
        }
      },
      {
        "who": "me",
        "text": "Прости за опоздание! Автобус ушёл прямо передо мной.",
        "gloss": {
          "en": "Sorry I'm late! The bus left right in front of me.",
          "ko": "늦어서 미안! 버스가 눈앞에서 떠나 버렸어."
        },
        "frames": [
          "ru-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "Ничего. Только начало мы уже пропустили.",
        "gloss": {
          "en": "It's OK. We've already missed the beginning, though.",
          "ko": "괜찮아. 근데 앞부분은 벌써 놓쳤어."
        },
        "alt": [
          {
            "text": "Ладно. Но начало мы уже пропустили.",
            "gloss": {
              "en": "Fine. But we've already missed the start.",
              "ko": "알았어. 근데 시작 부분은 이미 놓쳤어."
            }
          },
          {
            "text": "Я уже думала, ты не придёшь.",
            "gloss": {
              "en": "I was starting to think you weren't coming.",
              "ko": "안 오는 줄 알았잖아."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Честно говоря, я поздно вышел из дома. Если бы я вышел раньше, я бы успел.",
        "gloss": {
          "en": "To be honest, I left home late. If I'd left earlier, I'd have made it.",
          "ko": "솔직히 집에서 늦게 나왔어. 일찍 나왔으면 안 늦었을 텐데."
        },
        "frames": [
          "ru-f3-19",
          "ru-f3-06"
        ]
      },
      {
        "who": "them",
        "text": "Да ладно. Пойдём быстрее, пока идёт реклама.",
        "gloss": {
          "en": "Never mind. Let's hurry while the ads are on.",
          "ko": "됐어. 광고 나올 때 빨리 들어가자."
        },
        "alt": [
          {
            "text": "Ничего страшного, пошли, там ещё реклама.",
            "gloss": {
              "en": "No big deal, come on, the ads are still on.",
              "ko": "괜찮아, 가자, 아직 광고 중이야."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Слушай, давай я куплю попкорн, чтобы загладить вину.",
        "gloss": {
          "en": "Listen, let me buy popcorn to make it up to you.",
          "ko": "있잖아, 미안하니까 내가 팝콘 살게."
        },
        "frames": [
          "ru-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "Не надо, потом. Садись быстрее.",
        "gloss": {
          "en": "No need, later. Sit down, quick.",
          "ko": "괜찮아, 나중에. 빨리 앉아."
        }
      },
      {
        "who": "me",
        "text": "Хорошо. Кстати, а этот фильм долго идёт?",
        "gloss": {
          "en": "OK. By the way, how long is this film?",
          "ko": "알았어. 그런데 이 영화 길어?"
        },
        "frames": [
          "ru-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "Почти три часа.",
        "gloss": {
          "en": "Almost three hours.",
          "ko": "거의 세 시간."
        },
        "alt": [
          {
            "text": "Часа два с половиной, кажется.",
            "gloss": {
              "en": "About two and a half hours, I think.",
              "ko": "두 시간 반쯤일 거야."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Ого! Ну ладно, главное — я всё-таки пришёл.",
        "gloss": {
          "en": "Wow! Oh well, the main thing is I made it after all.",
          "ko": "와! 뭐, 어쨌든 내가 오긴 왔으니까."
        }
      },
      {
        "who": "them",
        "text": "Тихо, начинается самое интересное!",
        "gloss": {
          "en": "Shh, the best part is starting!",
          "ko": "쉿, 이제 제일 재밌는 부분 시작해!"
        }
      },
      {
        "who": "me",
        "text": "Всё, молчу. Ещё раз прости!",
        "gloss": {
          "en": "OK, I'll be quiet. Sorry again!",
          "ko": "알았어, 조용히 할게. 다시 한번 미안!"
        }
      }
    ]
  },
  {
    "id": "ru-3-2",
    "stage": 3,
    "situation": 1,
    "setting": {
      "en": "Calling reception about a broken air conditioner in your hotel room",
      "ko": "호텔 방 에어컨이 고장 나서 프런트에 전화하기"
    },
    "expressions": [
      "Что-то не работает",
      "Вы не могли бы",
      "Мне кажется",
      "Без проблем"
    ],
    "grammar": [
      0,
      1,
      2,
      5,
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ресепшен, добрый вечер. Слушаю вас.",
        "gloss": {
          "en": "Reception, good evening. How can I help?",
          "ko": "프런트입니다, 안녕하세요. 말씀하세요."
        }
      },
      {
        "who": "me",
        "text": "Добрый вечер. Это номер триста пять. Что-то не работает кондиционер.",
        "gloss": {
          "en": "Good evening. This is room three hundred five. Something's wrong with the air conditioner — it isn't working.",
          "ko": "안녕하세요. 305호인데요. 에어컨이 안 되는 것 같아요."
        },
        "frames": [
          "ru-f3-13"
        ]
      },
      {
        "who": "them",
        "text": "Понятно. Вы его включали с пульта?",
        "gloss": {
          "en": "I see. Did you turn it on with the remote?",
          "ko": "그렇군요. 리모컨으로 켜 보셨어요?"
        },
        "alt": [
          {
            "text": "А пульт работает? Лампочка горит?",
            "gloss": {
              "en": "Is the remote working? Is the light on?",
              "ko": "리모컨은 되나요? 불이 들어와요?"
            }
          },
          {
            "text": "Вы проверили, окно закрыто?",
            "gloss": {
              "en": "Did you check that the window is closed?",
              "ko": "창문 닫혀 있는지 확인하셨어요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Да, я уже всё попробовал. Я долго нажимал кнопки, но он так и не включился.",
        "gloss": {
          "en": "Yes, I've already tried everything. I kept pressing the buttons, but it never came on.",
          "ko": "네, 이미 다 해 봤어요. 버튼을 한참 눌렀는데 결국 안 켜졌어요."
        }
      },
      {
        "who": "them",
        "text": "Извините. Мастер может прийти только завтра утром.",
        "gloss": {
          "en": "I'm sorry. The repairman can only come tomorrow morning.",
          "ko": "죄송합니다. 수리 기사는 내일 아침에야 갈 수 있어요."
        },
        "alt": [
          {
            "text": "Сейчас мастера нет, он будет только утром.",
            "gloss": {
              "en": "The repairman isn't here now, he'll only be in in the morning.",
              "ko": "지금은 기사가 없어서, 아침에야 와요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Вы не могли бы прислать кого-нибудь сегодня? В номере очень жарко.",
        "gloss": {
          "en": "Could you send someone today? It's very hot in the room.",
          "ko": "오늘 누구라도 보내 주실 수 있을까요? 방이 너무 더워요."
        },
        "frames": [
          "ru-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "К сожалению, сегодня никого нет. Могу предложить вентилятор.",
        "gloss": {
          "en": "Unfortunately there's nobody today. I can offer you a fan.",
          "ko": "죄송하지만 오늘은 사람이 없어요. 선풍기는 드릴 수 있어요."
        }
      },
      {
        "who": "me",
        "text": "Мне кажется, вентилятор не поможет. А другой номер есть?",
        "gloss": {
          "en": "I don't think a fan will help. Is there another room?",
          "ko": "선풍기로는 안 될 것 같아요. 다른 방은 없나요?"
        },
        "frames": [
          "ru-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Минуточку, я посмотрю. Есть свободный номер на пятом этаже, но он меньше.",
        "gloss": {
          "en": "One moment, I'll check. There's a free room on the fifth floor, but it's smaller.",
          "ko": "잠시만요, 확인해 볼게요. 5층에 빈방이 있는데, 더 작아요."
        },
        "alt": [
          {
            "text": "Сейчас проверю... Да, есть один, но окна выходят на дорогу.",
            "gloss": {
              "en": "Let me check... Yes, there's one, but the windows face the road.",
              "ko": "확인해 볼게요... 네, 하나 있는데 창문이 도로 쪽이에요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Без проблем. Мне надо просто нормально выспаться.",
        "gloss": {
          "en": "No problem. I just need a proper night's sleep.",
          "ko": "괜찮아요. 그냥 푹 자기만 하면 돼요."
        },
        "frames": [
          "ru-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Хорошо. Через пять минут к вам зайдёт сотрудник с ключом.",
        "gloss": {
          "en": "All right. In five minutes a staff member will come by with the key.",
          "ko": "알겠습니다. 5분 뒤에 직원이 열쇠를 가지고 갈 거예요."
        }
      },
      {
        "who": "me",
        "text": "Отлично, спасибо. Я пока соберу вещи, чтобы его не задерживать.",
        "gloss": {
          "en": "Great, thanks. I'll pack my things meanwhile so I don't keep him waiting.",
          "ko": "좋아요, 감사합니다. 직원분 안 기다리게 그동안 짐 챙길게요."
        },
        "frames": [
          "ru-f3-08"
        ]
      }
    ]
  },
  {
    "id": "ru-3-3",
    "stage": 3,
    "situation": 2,
    "setting": {
      "en": "Chatting with your friend Sasha about a detective series",
      "ko": "친구 사샤와 보고 있는 수사 드라마 이야기"
    },
    "expressions": [
      "По-моему",
      "Мне кажется",
      "Ты серьёзно",
      "Вообще-то",
      "Не может быть",
      "Я так и думал"
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
        "text": "Слушай, ты смотришь «Метод»? Все о нём говорят.",
        "gloss": {
          "en": "Listen, are you watching \"The Method\"? Everyone's talking about it.",
          "ko": "야, 너 '메토드' 봐? 다들 그 얘기던데."
        }
      },
      {
        "who": "me",
        "text": "Да! Вчера я наконец досмотрел второй сезон.",
        "gloss": {
          "en": "Yes! Yesterday I finally finished the second season.",
          "ko": "응! 어제 드디어 두 번째 시즌 다 봤어."
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
          "ko": "그래서 어땠어?"
        },
        "alt": [
          {
            "text": "И что скажешь? Понравилось?",
            "gloss": {
              "en": "And what do you think? Did you like it?",
              "ko": "어때? 재밌었어?"
            }
          },
          {
            "text": "И как? Стоит смотреть?",
            "gloss": {
              "en": "And? Is it worth watching?",
              "ko": "어때? 볼 만해?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "По-моему, первый сезон был лучше. Второй мне кажется слишком длинным.",
        "gloss": {
          "en": "In my opinion, the first season was better. The second seems too long to me.",
          "ko": "내 생각엔 첫 시즌이 더 나았어. 두 번째는 너무 긴 것 같아."
        },
        "frames": [
          "ru-f3-02",
          "ru-f3-01"
        ]
      },
      {
        "who": "them",
        "text": "Правда? А мне второй больше понравился.",
        "gloss": {
          "en": "Really? I liked the second one more.",
          "ko": "그래? 난 두 번째가 더 좋던데."
        }
      },
      {
        "who": "me",
        "text": "Ты серьёзно? Там столько скучных серий!",
        "gloss": {
          "en": "Are you serious? There are so many boring episodes!",
          "ko": "진짜? 지루한 에피소드가 얼마나 많은데!"
        },
        "frames": [
          "ru-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "Зато там есть следователь, который всё время шутит.",
        "gloss": {
          "en": "But it has that detective who jokes all the time.",
          "ko": "대신 계속 농담하는 형사가 나오잖아."
        },
        "alt": [
          {
            "text": "Зато новый следователь классный, согласись.",
            "gloss": {
              "en": "But the new detective is great, you have to admit.",
              "ko": "그래도 새 형사는 멋지잖아, 인정해."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Вообще-то, он мне тоже нравится. Это персонаж, который спасает весь сериал.",
        "gloss": {
          "en": "Actually, I like him too. He's the character who saves the whole series.",
          "ko": "사실 나도 그 사람 좋아. 드라마 전체를 살리는 캐릭터야."
        },
        "frames": [
          "ru-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "Кстати, говорят, будет третий сезон.",
        "gloss": {
          "en": "By the way, they say there'll be a third season.",
          "ko": "그런데 세 번째 시즌 나온대."
        }
      },
      {
        "who": "me",
        "text": "Не может быть! Хотя я так и думал, что они не остановятся.",
        "gloss": {
          "en": "No way! Although I thought they wouldn't stop.",
          "ko": "말도 안 돼! 하긴 안 멈출 줄 알았어."
        }
      },
      {
        "who": "them",
        "text": "Давай посмотрим первую серию вместе, когда выйдет?",
        "gloss": {
          "en": "Shall we watch the first episode together when it comes out?",
          "ko": "나오면 첫 화 같이 볼래?"
        }
      },
      {
        "who": "me",
        "text": "Давай! Если бы он вышел завтра, я бы взял выходной.",
        "gloss": {
          "en": "Let's! If it came out tomorrow, I'd take a day off.",
          "ko": "좋아! 내일 나오면 휴가 낼 거야."
        },
        "frames": [
          "ru-f3-06"
        ]
      }
    ]
  },
  {
    "id": "ru-3-4",
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
    "stage": 3,
    "situation": 3,
    "setting": {
      "en": "Asking a colleague for help with a report you don't understand",
      "ko": "이해가 안 되는 보고서 때문에 동료에게 도움 청하기"
    },
    "expressions": [
      "Честно говоря",
      "Вы не могли бы",
      "Без проблем",
      "Может быть",
      "Давай на ты",
      "Короче",
      "Я не уверен"
    ],
    "grammar": [
      2,
      3,
      4,
      5,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "Минсу, у вас всё в порядке? Вы какой-то грустный.",
        "gloss": {
          "en": "Minsu, is everything all right? You look a bit down.",
          "ko": "민수 씨, 괜찮아요? 좀 우울해 보여요."
        }
      },
      {
        "who": "me",
        "text": "Честно говоря, нет. Мне нужно сдать отчёт в пятницу, а я не понимаю таблицы.",
        "gloss": {
          "en": "To be honest, no. I need to hand in a report on Friday, and I don't understand the spreadsheets.",
          "ko": "솔직히 아니에요. 금요일에 보고서를 내야 하는데 표를 이해를 못 하겠어요."
        },
        "frames": [
          "ru-f3-19",
          "ru-f3-07"
        ]
      },
      {
        "who": "them",
        "text": "Какие таблицы? Те, которые прислал финансовый отдел?",
        "gloss": {
          "en": "Which spreadsheets? The ones finance sent?",
          "ko": "무슨 표요? 재무팀이 보낸 거요?"
        },
        "alt": [
          {
            "text": "Финансовые? Да, они всех сначала пугают.",
            "gloss": {
              "en": "The finance ones? Yes, they scare everyone at first.",
              "ko": "재무 표요? 그거 처음엔 다들 겁먹어요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Да, те, которые прислали в понедельник. Вы не могли бы мне помочь?",
        "gloss": {
          "en": "Yes, the ones they sent on Monday. Could you help me?",
          "ko": "네, 월요일에 보낸 거요. 좀 도와주실 수 있을까요?"
        },
        "frames": [
          "ru-f3-09",
          "ru-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "Конечно. Только давайте после обеда, сейчас у меня встреча.",
        "gloss": {
          "en": "Of course. But let's do it after lunch, I have a meeting now.",
          "ko": "그럼요. 근데 점심 먹고 해요, 지금 회의가 있어서요."
        },
        "alt": [
          {
            "text": "Конечно. Но сейчас я занята, давайте в два?",
            "gloss": {
              "en": "Of course. But I'm busy now, shall we say two?",
              "ko": "물론이죠. 근데 지금은 바빠서, 두 시 어때요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Без проблем. Я зайду к вам в два, если удобно.",
        "gloss": {
          "en": "No problem. I'll come by at two, if that's convenient.",
          "ko": "괜찮아요. 괜찮으시면 두 시에 갈게요."
        },
        "frames": [
          "ru-f3-11"
        ]
      },
      {
        "who": "them",
        "text": "Договорились. Я покажу, как там всё считается.",
        "gloss": {
          "en": "Deal. I'll show you how everything is calculated there.",
          "ko": "좋아요. 거기 계산이 어떻게 되는지 보여 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "Спасибо огромное! И, может быть, давай на ты?",
        "gloss": {
          "en": "Thanks a lot! And maybe we could switch to \"ty\"?",
          "ko": "정말 고마워요! 그리고 우리 말 편하게 할까요?"
        },
        "frames": [
          "ru-f3-14"
        ]
      },
      {
        "who": "them",
        "text": "С удовольствием! Тогда приходи в два, разберёмся.",
        "gloss": {
          "en": "With pleasure! Then come at two, we'll sort it out.",
          "ko": "좋지! 그럼 두 시에 와, 같이 보자."
        }
      },
      {
        "who": "me",
        "text": "Короче, я вообще не понимаю, как считаются бонусы.",
        "gloss": {
          "en": "Basically, I have no idea how the bonuses are calculated.",
          "ko": "한마디로, 보너스가 어떻게 계산되는지 전혀 모르겠어."
        }
      },
      {
        "who": "them",
        "text": "Это просто, там одна формула. Я уже делала такой отчёт.",
        "gloss": {
          "en": "It's simple, there's one formula. I've done that report before.",
          "ko": "간단해, 공식 하나야. 나 그 보고서 해 봤어."
        }
      },
      {
        "who": "me",
        "text": "Отлично. Я не уверен, что пойму с первого раза, но я постараюсь.",
        "gloss": {
          "en": "Great. I'm not sure I'll get it the first time, but I'll try.",
          "ko": "좋아. 한 번에 이해할지는 모르겠지만 노력해 볼게."
        },
        "frames": [
          "ru-f3-15"
        ]
      }
    ]
  },
  {
    "id": "ru-3-x1",
    "stage": 3,
    "setting": {
      "en": "Cheering up a friend who failed his driving test again",
      "ko": "운전면허 시험에 또 떨어진 친구 위로하기"
    },
    "expressions": [
      "Бывает",
      "Как тебе"
    ],
    "grammar": [
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Слушай, я опять не сдал на права. Третий раз!",
        "gloss": {
          "en": "Listen, I failed my driving test again. Third time!",
          "ko": "야, 나 운전면허 또 떨어졌어. 세 번째야!"
        }
      },
      {
        "who": "me",
        "text": "Бывает. Что случилось на этот раз?",
        "gloss": {
          "en": "It happens. What happened this time?",
          "ko": "그럴 수도 있지. 이번엔 무슨 일이었어?"
        }
      },
      {
        "who": "them",
        "text": "Я заехал не на ту полосу. Инструктор сразу всё остановил.",
        "gloss": {
          "en": "I drove into the wrong lane. The examiner stopped everything right away.",
          "ko": "차선을 잘못 들어갔어. 감독관이 바로 멈췄어."
        }
      },
      {
        "who": "me",
        "text": "Обидно. А как тебе новый инструктор? Лучше, чем старый?",
        "gloss": {
          "en": "That's annoying. And how do you like the new instructor? Better than the old one?",
          "ko": "속상하겠다. 새 강사는 어때? 전 강사보다 나아?"
        },
        "frames": [
          "ru-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "Он строгий, но объясняет хорошо.",
        "gloss": {
          "en": "He's strict, but he explains well.",
          "ko": "엄격한데 설명은 잘해."
        }
      },
      {
        "who": "me",
        "text": "Тогда в следующий раз точно сдашь. Хочешь, я поезжу с тобой, чтобы ты потренировался?",
        "gloss": {
          "en": "Then next time you'll definitely pass. Want me to ride with you so you can practise?",
          "ko": "그럼 다음엔 꼭 붙을 거야. 연습하게 내가 같이 타 줄까?"
        },
        "frames": [
          "ru-f3-08"
        ]
      }
    ]
  },
  {
    "id": "ru-4-1",
    "stage": 4,
    "situation": 0,
    "setting": {
      "en": "A project meeting: the client wants the deadline moved forward",
      "ko": "프로젝트 회의: 고객이 마감을 앞당겨 달라고 함"
    },
    "expressions": [
      "Давайте обсудим",
      "Если честно",
      "Дело в том",
      "С одной стороны",
      "С другой стороны",
      "Я согласен",
      "Я имею в виду",
      "Насколько я знаю"
    ],
    "grammar": [
      1,
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Итак, коллеги, заказчик просит сдать проект на две недели раньше. Что скажете?",
        "gloss": {
          "en": "So, colleagues, the client wants the project delivered two weeks early. What do you say?",
          "ko": "자, 여러분, 고객이 프로젝트를 2주 앞당겨 달래요. 어떻게 생각해요?"
        }
      },
      {
        "who": "me",
        "text": "Давайте обсудим, что именно они хотят получить к этой дате.",
        "gloss": {
          "en": "Let's discuss what exactly they want to have by that date.",
          "ko": "그날까지 정확히 뭘 받고 싶어 하는지부터 이야기해 보죠."
        }
      },
      {
        "who": "them",
        "text": "Полную версию приложения, протестированную и готовую к запуску.",
        "gloss": {
          "en": "The full version of the app, tested and ready to launch.",
          "ko": "테스트까지 끝나서 바로 출시할 수 있는 앱 완성본이요."
        },
        "alt": [
          {
            "text": "Всё сразу: и дизайн, и тестирование, и документацию.",
            "gloss": {
              "en": "Everything at once: design, testing and documentation.",
              "ko": "전부 한꺼번에요. 디자인, 테스트, 문서까지."
            }
          },
          {
            "text": "Насколько я поняла, полностью готовый продукт.",
            "gloss": {
              "en": "As far as I understood, a completely finished product.",
              "ko": "제가 알기로는 완전히 완성된 제품이요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Если честно, это нереально. Дело в том, что тестирование ещё даже не начато.",
        "gloss": {
          "en": "Honestly, that's unrealistic. The thing is, testing hasn't even been started yet.",
          "ko": "솔직히 불가능해요. 문제는 테스트를 아직 시작도 안 했다는 거예요."
        }
      },
      {
        "who": "them",
        "text": "А если подключить ребят из соседнего отдела?",
        "gloss": {
          "en": "What if we bring in people from the next department?",
          "ko": "옆 부서 사람들을 투입하면요?"
        },
        "alt": [
          {
            "text": "Может, взять людей из другой команды?",
            "gloss": {
              "en": "Maybe take people from another team?",
              "ko": "다른 팀 사람들을 데려오면 어때요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "С одной стороны, это ускорит работу. С другой стороны, им нужно время, чтобы разобраться в коде.",
        "gloss": {
          "en": "On the one hand, it'll speed things up. On the other hand, they need time to understand the code.",
          "ko": "한편으로는 일이 빨라지겠죠. 다른 한편으로는 그 사람들이 코드를 파악할 시간이 필요해요."
        }
      },
      {
        "who": "them",
        "text": "Тем не менее, заказчик важный. Отказываться не хочется.",
        "gloss": {
          "en": "Still, it's an important client. I don't want to say no.",
          "ko": "그래도 중요한 고객이에요. 거절하고 싶지는 않아요."
        }
      },
      {
        "who": "me",
        "text": "Я согласен, отказываться нельзя. Но можно предложить сдать проект частями.",
        "gloss": {
          "en": "I agree, we can't refuse. But we could offer to deliver the project in parts.",
          "ko": "동의해요, 거절하면 안 되죠. 대신 나눠서 납품하자고 제안할 수 있어요."
        }
      },
      {
        "who": "them",
        "text": "Что вы имеете в виду?",
        "gloss": {
          "en": "What do you mean?",
          "ko": "무슨 뜻이에요?"
        },
        "alt": [
          {
            "text": "Частями — это как?",
            "gloss": {
              "en": "In parts — how would that work?",
              "ko": "나눠서요? 어떻게요?"
            }
          },
          {
            "text": "Поясните, пожалуйста.",
            "gloss": {
              "en": "Please explain.",
              "ko": "설명 좀 해 주세요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Я имею в виду, что основные функции мы сдаём раньше, а остальное — в срок.",
        "gloss": {
          "en": "I mean we deliver the core features early and the rest on time.",
          "ko": "핵심 기능은 먼저 넘기고, 나머지는 원래 기한에 넘기자는 거예요."
        }
      },
      {
        "who": "them",
        "text": "Интересно. А вы уверены, что заказчик согласится?",
        "gloss": {
          "en": "Interesting. And are you sure the client will agree?",
          "ko": "흥미롭네요. 고객이 동의할 거라고 확신해요?"
        }
      },
      {
        "who": "me",
        "text": "Насколько я знаю, им важнее всего запуск. Получив главное вовремя, они будут довольны.",
        "gloss": {
          "en": "As far as I know, the launch matters most to them. Getting the key part on time, they'll be happy.",
          "ko": "제가 알기로는 그쪽에 제일 중요한 건 출시예요. 핵심을 제때 받으면 만족할 거예요."
        }
      },
      {
        "who": "them",
        "text": "Хорошо. Тогда я спрошу у них, устроит ли их такой вариант.",
        "gloss": {
          "en": "All right. Then I'll ask them whether this option suits them.",
          "ko": "좋아요. 그럼 이 방식이 괜찮은지 제가 물어볼게요."
        }
      },
      {
        "who": "me",
        "text": "Отлично. Чем раньше мы им напишем, тем лучше.",
        "gloss": {
          "en": "Great. The sooner we write to them, the better.",
          "ko": "좋아요. 빨리 연락할수록 좋아요."
        }
      }
    ]
  },
  {
    "id": "ru-4-2",
    "stage": 4,
    "situation": 1,
    "setting": {
      "en": "Your friend Pasha can't decide whether to move to St Petersburg",
      "ko": "상트페테르부르크로 이사할지 고민하는 친구 파샤"
    },
    "expressions": [
      "Это зависит от",
      "Получается",
      "Судя по всему",
      "Само собой",
      "Мне надоело",
      "Я за",
      "В любом случае",
      "В общем"
    ],
    "grammar": [
      0,
      3,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Мне предложили работу в Петербурге. Не знаю, ехать или нет.",
        "gloss": {
          "en": "I've been offered a job in St Petersburg. I don't know whether to go.",
          "ko": "상트페테르부르크에서 일자리 제안을 받았어. 갈지 말지 모르겠어."
        }
      },
      {
        "who": "me",
        "text": "Ого, поздравляю! А зарплата там гораздо выше?",
        "gloss": {
          "en": "Wow, congratulations! Is the salary much higher there?",
          "ko": "와, 축하해! 거기 월급이 훨씬 높아?"
        }
      },
      {
        "who": "them",
        "text": "Намного. Но я тут всех знаю, а там — никого.",
        "gloss": {
          "en": "Much. But I know everyone here, and nobody there.",
          "ko": "훨씬. 근데 여기선 다 아는 사람인데, 거기엔 아무도 없어."
        },
        "alt": [
          {
            "text": "Почти в два раза. Но друзья-то все здесь.",
            "gloss": {
              "en": "Almost double. But all my friends are here.",
              "ko": "거의 두 배야. 근데 친구들은 다 여기 있잖아."
            }
          },
          {
            "text": "Выше, но и квартиры там дорогие.",
            "gloss": {
              "en": "Higher, but flats there are expensive too.",
              "ko": "높긴 한데, 집값도 비싸."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Ну, это зависит от того, что для тебя важнее: деньги или привычная жизнь.",
        "gloss": {
          "en": "Well, it depends on what matters more to you: money or the life you're used to.",
          "ko": "글쎄, 너한테 뭐가 더 중요한지에 달렸지. 돈이냐, 익숙한 생활이냐."
        }
      },
      {
        "who": "them",
        "text": "Честно говоря, здесь мне уже скучно. Каждый день одно и то же.",
        "gloss": {
          "en": "To be honest, I'm already bored here. Same thing every day.",
          "ko": "솔직히 여기선 이제 지루해. 매일 똑같아."
        }
      },
      {
        "who": "me",
        "text": "Получается, ты уже почти решил? Хотя ты и сомневаешься, по голосу слышно, что хочешь ехать.",
        "gloss": {
          "en": "So you've almost decided? Although you have doubts, I can hear in your voice that you want to go.",
          "ko": "그럼 거의 결정한 거네? 망설이긴 해도 목소리 들으니까 가고 싶어 하는 게 느껴져."
        }
      },
      {
        "who": "them",
        "text": "Может быть. Но я боюсь, что не найду там друзей.",
        "gloss": {
          "en": "Maybe. But I'm afraid I won't find friends there.",
          "ko": "그럴지도. 근데 거기서 친구를 못 사귈까 봐 걱정돼."
        },
        "alt": [
          {
            "text": "Наверное. Но страшно начинать всё с нуля.",
            "gloss": {
              "en": "Probably. But it's scary to start from scratch.",
              "ko": "아마도. 근데 처음부터 다시 시작하는 게 무서워."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Судя по всему, ты зря волнуешься. Человек, умеющий так легко знакомиться, быстро найдёт друзей.",
        "gloss": {
          "en": "By the looks of it, you're worrying for nothing. Someone who makes friends so easily will find friends fast.",
          "ko": "보아하니 괜한 걱정이야. 너처럼 쉽게 사람 사귀는 사람은 금방 친구 생겨."
        }
      },
      {
        "who": "them",
        "text": "Ха, спасибо. А ты бы сам поехал?",
        "gloss": {
          "en": "Ha, thanks. Would you go yourself?",
          "ko": "하, 고마워. 너라면 갈 거야?"
        },
        "alt": [
          {
            "text": "А ты на моём месте что бы сделал?",
            "gloss": {
              "en": "What would you do in my place?",
              "ko": "너라면 내 입장에서 어떻게 할 거야?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Само собой! Мне надоело жить в одном городе всю жизнь.",
        "gloss": {
          "en": "Of course! I'm tired of living in one city my whole life.",
          "ko": "당연하지! 평생 한 도시에서만 사는 거 지겨워."
        }
      },
      {
        "who": "them",
        "text": "Значит, ты за то, чтобы я ехал?",
        "gloss": {
          "en": "So you're in favour of me going?",
          "ko": "그러니까 내가 가는 거에 찬성이야?"
        }
      },
      {
        "who": "me",
        "text": "Я за. В любом случае, ты всегда сможешь вернуться.",
        "gloss": {
          "en": "I'm for it. Either way, you can always come back.",
          "ko": "찬성이야. 어쨌든 언제든 돌아올 수 있잖아."
        }
      },
      {
        "who": "them",
        "text": "Тоже правда. Ладно, подумаю ещё неделю.",
        "gloss": {
          "en": "That's true too. OK, I'll think about it for another week.",
          "ko": "그것도 맞네. 알았어, 일주일만 더 생각해 볼게."
        }
      },
      {
        "who": "me",
        "text": "В общем, не думай слишком долго: чем дольше думаешь, тем страшнее.",
        "gloss": {
          "en": "Anyway, don't think too long: the longer you think, the scarier it gets.",
          "ko": "아무튼 너무 오래 고민하지 마. 오래 생각할수록 더 무서워져."
        }
      }
    ]
  },
  {
    "id": "ru-4-3",
    "stage": 4,
    "situation": 2,
    "setting": {
      "en": "Calling an online shop to return a tablet with a cracked screen",
      "ko": "화면이 깨진 태블릿을 반품하려고 온라인 쇼핑몰에 전화하기"
    },
    "expressions": [
      "Как раз",
      "Не совсем так",
      "Тем не менее"
    ],
    "grammar": [
      1,
      2,
      4,
      5
    ],
    "earlierGrammar": [
      "3:6"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Служба поддержки, меня зовут Олег. Чем могу помочь?",
        "gloss": {
          "en": "Customer support, my name is Oleg. How can I help?",
          "ko": "고객센터 올레그입니다. 무엇을 도와드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "Здравствуйте. Я вчера получил заказ, но, открыв коробку, увидел, что экран разбит.",
        "gloss": {
          "en": "Hello. I received my order yesterday, but on opening the box I saw the screen was cracked.",
          "ko": "안녕하세요. 어제 주문한 걸 받았는데, 상자를 열어 보니 화면이 깨져 있었어요."
        }
      },
      {
        "who": "them",
        "text": "Очень жаль. Назовите, пожалуйста, номер заказа.",
        "gloss": {
          "en": "I'm very sorry. Please give me the order number.",
          "ko": "정말 죄송합니다. 주문 번호를 말씀해 주세요."
        },
        "alt": [
          {
            "text": "Приносим извинения. Подскажите номер заказа?",
            "gloss": {
              "en": "We apologize. Could you give me the order number?",
              "ko": "사과드립니다. 주문 번호 알려 주시겠어요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Конечно. Номер заказа: девяносто один, сорок пять, ноль семь.",
        "gloss": {
          "en": "Of course. The order number is ninety-one, forty-five, oh seven.",
          "ko": "네. 주문 번호는 91-45-07이에요."
        }
      },
      {
        "who": "them",
        "text": "Вижу ваш заказ. Вы хотите вернуть деньги или заменить товар?",
        "gloss": {
          "en": "I can see your order. Do you want a refund or a replacement?",
          "ko": "주문 확인됐습니다. 환불을 원하세요, 교환을 원하세요?"
        },
        "alt": [
          {
            "text": "Нашёл. Вам нужна замена или возврат денег?",
            "gloss": {
              "en": "Found it. Do you need a replacement or a refund?",
              "ko": "찾았습니다. 교환하실 건가요, 환불하실 건가요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Возврат денег. Я как раз нашёл такой же планшет в другом магазине, гораздо дешевле.",
        "gloss": {
          "en": "A refund. As it happens, I've just found the same tablet in another shop, much cheaper.",
          "ko": "환불이요. 마침 다른 가게에서 같은 태블릿을 훨씬 싸게 찾았거든요."
        }
      },
      {
        "who": "them",
        "text": "Хорошо. Но сначала курьер должен забрать товар, а это до пяти рабочих дней.",
        "gloss": {
          "en": "All right. But first a courier has to collect the item, and that takes up to five working days.",
          "ko": "알겠습니다. 다만 먼저 택배 기사가 물건을 회수해야 하고, 영업일로 최대 5일 걸려요."
        }
      },
      {
        "who": "me",
        "text": "Не совсем так. На вашем сайте сказано, что курьер приезжает в течение двух дней.",
        "gloss": {
          "en": "That's not quite right. Your website says the courier comes within two days.",
          "ko": "꼭 그렇진 않던데요. 사이트에는 이틀 안에 기사가 온다고 쓰여 있어요."
        }
      },
      {
        "who": "them",
        "text": "Да, вы правы, извините. Курьер может приехать завтра.",
        "gloss": {
          "en": "Yes, you're right, sorry. The courier can come tomorrow.",
          "ko": "네, 맞습니다, 죄송해요. 기사가 내일 갈 수 있어요."
        },
        "alt": [
          {
            "text": "Возможно. Тогда давайте назначим курьера на завтра.",
            "gloss": {
              "en": "Possibly. Then let's book the courier for tomorrow.",
              "ko": "그럴 수 있죠. 그럼 내일로 기사 예약할게요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Отлично. Подскажите, пожалуйста, нужна ли оригинальная коробка? Я не уверен, что сохранил её.",
        "gloss": {
          "en": "Great. Could you tell me whether the original box is needed? I'm not sure I kept it.",
          "ko": "좋아요. 원래 상자가 꼭 필요한가요? 버리지 않았는지 잘 모르겠어서요."
        }
      },
      {
        "who": "them",
        "text": "Желательно, но не обязательно. Главное — сам товар и чек.",
        "gloss": {
          "en": "Preferably, but it's not required. The main thing is the item itself and the receipt.",
          "ko": "있으면 좋지만 필수는 아니에요. 중요한 건 제품이랑 영수증이에요."
        }
      },
      {
        "who": "me",
        "text": "Тем не менее, я её поищу. Не хочу, чтобы возврат задержали из-за коробки.",
        "gloss": {
          "en": "Still, I'll look for it. I don't want the refund to be held up because of a box.",
          "ko": "그래도 찾아볼게요. 상자 때문에 환불이 늦어지면 싫으니까요."
        }
      },
      {
        "who": "them",
        "text": "Курьер позвонит вам завтра до обеда. Что-нибудь ещё?",
        "gloss": {
          "en": "The courier will call you tomorrow before lunch. Anything else?",
          "ko": "기사가 내일 오전에 전화드릴 거예요. 더 필요한 거 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "Нет, это всё. Спасибо, вы мне очень помогли.",
        "gloss": {
          "en": "No, that's all. Thank you, you've been a great help.",
          "ko": "아니요, 그게 다예요. 감사합니다, 정말 도움이 됐어요."
        }
      }
    ]
  },
  {
    "id": "ru-4-4",
    "stage": 4,
    "situation": 3,
    "setting": {
      "en": "Discussing a news story about companies ending remote work",
      "ko": "기업들이 재택근무를 끝낸다는 뉴스로 토론하기"
    },
    "expressions": [
      "Судя по всему",
      "Не совсем так",
      "Я согласен",
      "В общем",
      "Ни в коем случае"
    ],
    "grammar": [
      0,
      1,
      3,
      4,
      6
    ],
    "earlierGrammar": [
      "3:2"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Читал новость? Крупные компании возвращают сотрудников в офисы.",
        "gloss": {
          "en": "Did you read the news? Big companies are bringing staff back to the office.",
          "ko": "뉴스 봤어? 대기업들이 직원들을 다시 사무실로 부른대."
        }
      },
      {
        "who": "me",
        "text": "Да, видел. Судя по всему, многим начальникам не нравится удалёнка.",
        "gloss": {
          "en": "Yes, I saw. Apparently a lot of bosses don't like remote work.",
          "ko": "응, 봤어. 보아하니 재택근무를 싫어하는 상사들이 많은가 봐."
        }
      },
      {
        "who": "them",
        "text": "И правильно. Дома люди работают гораздо меньше.",
        "gloss": {
          "en": "And quite right. People work much less at home.",
          "ko": "그럴 만하지. 집에선 사람들이 일을 훨씬 덜 하잖아."
        },
        "alt": [
          {
            "text": "По-моему, они правы: дома все расслабляются.",
            "gloss": {
              "en": "I think they're right: everyone relaxes at home.",
              "ko": "내 생각엔 맞아. 집에선 다들 늘어지거든."
            }
          },
          {
            "text": "Я их понимаю, в офисе дисциплина лучше.",
            "gloss": {
              "en": "I understand them, there's better discipline in the office.",
              "ko": "이해돼. 사무실이 기강이 더 잡히잖아."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Не совсем так. Исследование, проводившееся целый год, показало обратное.",
        "gloss": {
          "en": "Not quite. A study that ran for a whole year showed the opposite.",
          "ko": "꼭 그렇진 않아. 1년 동안 진행된 연구에서는 반대 결과가 나왔어."
        }
      },
      {
        "who": "them",
        "text": "Может, и так. Но команда, работающая вместе, быстрее решает проблемы.",
        "gloss": {
          "en": "Maybe so. But a team working together solves problems faster.",
          "ko": "그럴 수도. 하지만 같이 일하는 팀이 문제를 더 빨리 풀잖아."
        },
        "alt": [
          {
            "text": "Возможно, но в офисе проще договориться.",
            "gloss": {
              "en": "Possibly, but it's easier to agree on things in the office.",
              "ko": "그럴 수도 있지만 사무실에서 합의하기가 더 쉬워."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Я согласен, хотя многие вопросы можно решить и по видеосвязи.",
        "gloss": {
          "en": "I agree, although many issues can be solved over video too.",
          "ko": "동의해, 많은 문제는 화상 통화로도 해결할 수 있지만."
        }
      },
      {
        "who": "them",
        "text": "А ты сам как предпочитаешь работать?",
        "gloss": {
          "en": "And how do you prefer to work yourself?",
          "ko": "너는 어떻게 일하는 게 좋아?"
        }
      },
      {
        "who": "me",
        "text": "Работая из дома, я не трачу два часа на дорогу. Это огромная разница.",
        "gloss": {
          "en": "Working from home, I don't spend two hours commuting. That's a huge difference.",
          "ko": "집에서 일하면 출퇴근에 두 시간을 안 써. 그게 엄청 커."
        }
      },
      {
        "who": "them",
        "text": "Ну, тебе повезло. А я дома всё время отвлекаюсь.",
        "gloss": {
          "en": "Well, you're lucky. I get distracted all the time at home.",
          "ko": "너는 운이 좋네. 난 집에선 계속 딴짓해."
        }
      },
      {
        "who": "me",
        "text": "В общем, всем подходит разное. Вопрос в том, готовы ли компании это признать.",
        "gloss": {
          "en": "Basically, different things suit different people. The question is whether companies are ready to admit it.",
          "ko": "결국 사람마다 맞는 게 달라. 문제는 회사들이 그걸 인정할 준비가 됐느냐지."
        }
      },
      {
        "who": "them",
        "text": "А ты бы вернулся в офис на пять дней в неделю?",
        "gloss": {
          "en": "Would you go back to the office five days a week?",
          "ko": "너라면 주 5일 사무실로 돌아갈 거야?"
        },
        "alt": [
          {
            "text": "А если твоя компания тоже всех вернёт?",
            "gloss": {
              "en": "And what if your company brings everyone back too?",
              "ko": "너희 회사도 다 불러들이면?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "Ни в коем случае! Я бы скорее поменял работу.",
        "gloss": {
          "en": "No way! I'd rather change jobs.",
          "ko": "절대 안 가! 차라리 회사를 옮기겠어."
        }
      },
      {
        "who": "them",
        "text": "Серьёзно? Многие так говорят, а потом остаются.",
        "gloss": {
          "en": "Seriously? Lots of people say that and then stay.",
          "ko": "진짜? 다들 그렇게 말하고 남던데."
        }
      },
      {
        "who": "me",
        "text": "Возможно. Но чем больше людей уходит, тем быстрее компании меняют правила.",
        "gloss": {
          "en": "Maybe. But the more people leave, the faster companies change the rules.",
          "ko": "그럴 수도. 그래도 떠나는 사람이 많을수록 회사가 규칙을 더 빨리 바꿔."
        }
      }
    ]
  },
  {
    "id": "ru-5-1",
    "stage": 5,
    "situation": 0,
    "setting": {
      "en": "Your colleague Katya asks you to take on part of her presentation",
      "ko": "동료 카탸가 자기 발표 준비 일부를 맡아 달라고 함"
    },
    "goal": {
      "en": "Turn down most of the extra work without souring things, agree to one small part, and steer the rest back to the boss.",
      "ko": "분위기를 해치지 않고 추가 업무 대부분을 거절하되 작은 부분만 맡고, 나머지는 상사에게 돌린다."
    },
    "expressions": [
      "Ну и ну",
      "Мне не до этого",
      "Ну ты даёшь",
      "Так и быть",
      "Как бы не так",
      "Вот именно"
    ],
    "grammar": [
      0,
      1,
      2,
      4,
      6
    ],
    "earlierGrammar": [
      "2:6"
    ],
    "lines": [
      {
        "who": "them",
        "text": "Слушай, у тебя минутка есть? Тут такое дело...",
        "gloss": {
          "en": "Listen, have you got a minute? Here's the thing...",
          "ko": "있잖아, 잠깐 시간 돼? 일이 좀 생겨서..."
        }
      },
      {
        "who": "me",
        "text": "Минутка-то есть, а вот свободного времени — не очень. Что такое?",
        "gloss": {
          "en": "A minute, sure, but free time — not really. What's up?",
          "ko": "잠깐은 되는데, 한가하진 않아. 무슨 일이야?"
        }
      },
      {
        "who": "them",
        "text": "Шеф просит к пятнице подготовить презентацию для инвесторов, а я не успеваю.",
        "gloss": {
          "en": "The boss wants an investor presentation ready by Friday, and I can't make it in time.",
          "ko": "부장님이 금요일까지 투자자 발표 자료를 만들라는데, 나 혼자선 시간이 안 돼."
        }
      },
      {
        "who": "me",
        "text": "Ну и ну. А ведь ещё на прошлой неделе говорили, что сроки сдвинут.",
        "gloss": {
          "en": "Well, well. And only last week they were saying the deadlines would be pushed back.",
          "ko": "어이가 없네. 지난주만 해도 일정 미룬다고 했잖아."
        }
      },
      {
        "who": "them",
        "text": "Говорили, да. Но в итоге всё наоборот.",
        "gloss": {
          "en": "They did, yes. But in the end it's the other way round.",
          "ko": "그랬지. 근데 결국 정반대가 됐어."
        }
      },
      {
        "who": "me",
        "text": "Честно скажу: мне не до этого, у меня свой отчёт горит.",
        "gloss": {
          "en": "I'll be honest: I can't deal with that right now, my own report is due.",
          "ko": "솔직히 말할게. 나 그럴 여유 없어, 내 보고서 마감이 코앞이야."
        }
      },
      {
        "who": "them",
        "text": "Понимаю... Но ты же лучше всех делаешь слайды. Может, хотя бы графики?",
        "gloss": {
          "en": "I understand... But you make the best slides of anyone. Maybe just the charts?",
          "ko": "알지... 근데 슬라이드는 네가 제일 잘 만들잖아. 그래프만이라도 안 될까?"
        }
      },
      {
        "who": "me",
        "text": "Ну ты даёшь, лестью решила взять! Ладно, так и быть: графики сделаю, а текст — уже ты.",
        "gloss": {
          "en": "You're something else, trying flattery! All right, fine: I'll do the charts, but the text is on you.",
          "ko": "너 진짜, 칭찬으로 넘어가려고! 알았어, 그래프는 해 줄게. 글은 네가 해."
        }
      },
      {
        "who": "them",
        "text": "Спасибо огромное! А может, и вступление заодно?",
        "gloss": {
          "en": "Thanks so much! And maybe the introduction while you're at it?",
          "ko": "정말 고마워! 그럼 도입부도 같이 해 주면 안 돼?"
        }
      },
      {
        "who": "me",
        "text": "Как бы не так! Вступление пусть пишет тот, кто будет выступать.",
        "gloss": {
          "en": "Not a chance! Let whoever is presenting write the introduction.",
          "ko": "어림없지! 도입부는 발표하는 사람이 써야지."
        }
      },
      {
        "who": "them",
        "text": "Ну да, логично. Шеф, кстати, сам хотел выступать.",
        "gloss": {
          "en": "Well, yes, that makes sense. The boss wanted to present himself, by the way.",
          "ko": "하긴 그렇네. 그러고 보니 부장님이 직접 발표하고 싶어 했어."
        }
      },
      {
        "who": "me",
        "text": "Вот именно. Слушай-ка, а давай ему так и скажем: часть делаем мы, часть — он.",
        "gloss": {
          "en": "Exactly. Listen, why don't we tell him just that: we do part of it, he does part.",
          "ko": "바로 그거야. 있잖아, 부장님한테 그대로 말하자. 일부는 우리가, 일부는 부장님이."
        }
      },
      {
        "who": "them",
        "text": "Боюсь, он обидится.",
        "gloss": {
          "en": "I'm afraid he'll be offended.",
          "ko": "서운해하실까 봐 걱정이야."
        }
      },
      {
        "who": "me",
        "text": "Не обидится. Он ведь сам вечно говорит, что работу надо делить.",
        "gloss": {
          "en": "He won't. He's always saying himself that work should be shared.",
          "ko": "안 그러실 거야. 일은 나눠서 해야 한다고 맨날 본인이 말하시잖아."
        }
      },
      {
        "who": "them",
        "text": "Ладно, попробую. Спасибо, выручаешь.",
        "gloss": {
          "en": "OK, I'll try. Thanks, you're a lifesaver.",
          "ko": "알았어, 해 볼게. 고마워, 덕분에 살았다."
        }
      },
      {
        "who": "me",
        "text": "Да не за что. Вот бы ещё мне кто-нибудь с отчётом помог!",
        "gloss": {
          "en": "Don't mention it. If only someone would help me with my report too!",
          "ko": "별말을. 나도 누가 보고서 좀 도와주면 좋겠다!"
        }
      }
    ]
  },
  {
    "id": "ru-5-2",
    "stage": 5,
    "situation": 1,
    "setting": {
      "en": "Catching up with old friends at their dacha",
      "ko": "다차에서 오랜 친구들과 근황 나누기"
    },
    "goal": {
      "en": "Catch up warmly, admit with humour that you haven't done what you planned, and agree to meet more often.",
      "ko": "반갑게 근황을 나누고, 계획한 일을 못 했다는 걸 유머 있게 인정하며, 더 자주 만나기로 한다."
    },
    "expressions": [
      "Ещё бы",
      "Руки не доходят",
      "Что поделаешь",
      "Как говорится",
      "Была не была",
      "Кто бы сомневался",
      "Всё равно"
    ],
    "grammar": [
      0,
      1,
      3,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ну, проходи, садись! Чайку налить?",
        "gloss": {
          "en": "Come in, sit down! Shall I pour you some tea?",
          "ko": "자, 들어와서 앉아! 차 한잔 줄까?"
        }
      },
      {
        "who": "me",
        "text": "Ещё бы! С дороги — самое то. А домик-то вы как отремонтировали!",
        "gloss": {
          "en": "You bet! Just what I need after the road. And look how you've done up the house!",
          "ko": "당연하지! 오는 길에 지쳤는데 딱이다. 그나저나 집을 이렇게 고쳤어!"
        }
      },
      {
        "who": "them",
        "text": "Да это всё Серёжа, золотые руки. А ты как? Всё пишешь свою книгу?",
        "gloss": {
          "en": "That's all Seryozha, he's good with his hands. And you? Still writing your book?",
          "ko": "다 세료자 솜씨야, 손재주가 좋잖아. 너는 어때? 책은 아직 쓰고 있어?"
        }
      },
      {
        "who": "me",
        "text": "Пишу — это громко сказано. Руки не доходят: то работа, то переезд.",
        "gloss": {
          "en": "\"Writing\" is a big word. I never get round to it: first work, then the move.",
          "ko": "쓴다고 하기엔 좀 그렇고. 손을 못 대고 있어, 일에 이사에."
        }
      },
      {
        "who": "them",
        "text": "Ты же три года назад говорил, что почти закончил!",
        "gloss": {
          "en": "But three years ago you said you'd nearly finished!",
          "ko": "3년 전에 거의 다 썼다고 했잖아!"
        }
      },
      {
        "who": "me",
        "text": "Говорил. Что поделаешь — как говорится, хотели как лучше, а получилось как всегда.",
        "gloss": {
          "en": "I did. What can you do — as they say, we meant well, but it turned out as usual.",
          "ko": "그랬지. 어쩌겠어. 흔히 말하듯 잘해 보려 했는데 늘 그렇듯 됐지."
        }
      },
      {
        "who": "them",
        "text": "Оставайся ночевать. Тут тишина, воздух...",
        "gloss": {
          "en": "Stay the night. It's quiet here, the air...",
          "ko": "자고 가. 여긴 조용하고 공기도 좋고..."
        }
      },
      {
        "who": "me",
        "text": "Вот бы! В городе мне в последнее время совсем не спится.",
        "gloss": {
          "en": "I wish! In the city I just can't seem to sleep lately.",
          "ko": "그러고 싶다! 요즘 도시에선 통 잠이 안 와."
        }
      },
      {
        "who": "them",
        "text": "Так оставайся, кто тебе мешает? Завтра шашлычок сделаем.",
        "gloss": {
          "en": "So stay, who's stopping you? We'll do a little barbecue tomorrow.",
          "ko": "그럼 자고 가, 누가 말려? 내일 샤슬릭 구워 먹자."
        }
      },
      {
        "who": "me",
        "text": "Была не была, остаюсь! Только маме позвоню, предупрежу.",
        "gloss": {
          "en": "Oh, what the heck, I'm staying! I'll just call my mum and let her know.",
          "ko": "에라 모르겠다, 자고 갈게! 엄마한테만 전화해서 말해 둘게."
        }
      },
      {
        "who": "them",
        "text": "Кстати, Лёшка в августе женится. Ты знал?",
        "gloss": {
          "en": "By the way, Lyoshka is getting married in August. Did you know?",
          "ko": "참, 료시카가 8월에 결혼한대. 알고 있었어?"
        }
      },
      {
        "who": "me",
        "text": "Кто бы сомневался! Он же со школы был влюблён в Машу.",
        "gloss": {
          "en": "Who'd have doubted it! He's been in love with Masha since school.",
          "ko": "그럴 줄 알았어! 학교 때부터 마샤를 좋아했잖아."
        }
      },
      {
        "who": "them",
        "text": "Вот-вот. Всех нас на свадьбу зовёт. Поедешь?",
        "gloss": {
          "en": "Exactly. He's inviting all of us to the wedding. Will you go?",
          "ko": "그러니까. 우리 다 결혼식에 오래. 갈 거야?"
        }
      },
      {
        "who": "me",
        "text": "Обязательно. Мне всё равно, где праздновать, главное — с вами.",
        "gloss": {
          "en": "Definitely. I don't mind where we celebrate, the main thing is being with you.",
          "ko": "당연히 가지. 어디서 축하하든 상관없어, 너희랑 같이면 돼."
        }
      },
      {
        "who": "them",
        "text": "Слушай, а давай чаще видеться? А то встречаемся только на свадьбах.",
        "gloss": {
          "en": "Listen, why don't we see each other more often? Otherwise we only meet at weddings.",
          "ko": "있잖아, 우리 좀 더 자주 보자. 결혼식에서만 보잖아."
        }
      },
      {
        "who": "me",
        "text": "Давай. Хорошо бы каждое лето вот так собираться — здесь, у вас, с чайком.",
        "gloss": {
          "en": "Let's. It'd be nice to get together like this every summer — here, at yours, with a cup of tea.",
          "ko": "그러자. 매년 여름 이렇게 모이면 좋겠다. 여기 너희 집에서 차 마시면서."
        }
      }
    ]
  },
  {
    "id": "ru-5-3",
    "stage": 5,
    "situation": 2,
    "setting": {
      "en": "Reading a notice on the building door to your elderly neighbour",
      "ko": "건물 문에 붙은 안내문을 나이 든 이웃에게 읽어 주기"
    },
    "goal": {
      "en": "Read the official notice aloud, explain in plain words what changes for your neighbour, and reassure her with practical help.",
      "ko": "공식 안내문을 읽고 이웃에게 무엇이 달라지는지 쉬운 말로 설명한 뒤, 실제 도움을 제안해 안심시킨다."
    },
    "expressions": [
      "Делать нечего",
      "Не берите в голову"
    ],
    "grammar": [
      0,
      1,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "Голубчик, посмотри-ка, что там на двери повесили? Я без очков ничего не вижу.",
        "gloss": {
          "en": "Dear, have a look at what they've put up on the door, will you? I can't see a thing without my glasses.",
          "ko": "얘야, 문에 뭘 붙여 놨는지 좀 봐 줄래? 안경이 없어서 하나도 안 보이네."
        }
      },
      {
        "who": "me",
        "text": "Сейчас прочитаю: «В связи с проведением ремонтных работ подача горячей воды будет временно прекращена».",
        "gloss": {
          "en": "Let me read it: \"In connection with repair works, the hot water supply will be temporarily suspended.\"",
          "ko": "읽어 드릴게요. '수리 공사 시행에 따라 온수 공급이 일시 중단될 예정입니다.'"
        }
      },
      {
        "who": "them",
        "text": "Ох, батюшки. А по-человечески это что значит?",
        "gloss": {
          "en": "Oh, good heavens. And what does that mean in plain words?",
          "ko": "아이고. 그걸 쉬운 말로 하면 뭔데?"
        }
      },
      {
        "who": "me",
        "text": "Это значит, что горячей воды не будет. Трубы ремонтируют.",
        "gloss": {
          "en": "It means there won't be any hot water. They're repairing the pipes.",
          "ko": "뜨거운 물이 안 나온다는 거예요. 배관을 고친대요."
        }
      },
      {
        "who": "them",
        "text": "И долго? Мне же внуков в субботу купать!",
        "gloss": {
          "en": "For how long? I've got to bath my grandchildren on Saturday!",
          "ko": "오래? 토요일에 손주들 씻겨야 하는데!"
        }
      },
      {
        "who": "me",
        "text": "Там дальше: «Работы осуществляются с десятого по двадцатое июня».",
        "gloss": {
          "en": "It goes on: \"Works will be carried out from the tenth to the twentieth of June.\"",
          "ko": "더 쓰여 있어요. '공사는 6월 10일부터 20일까지 진행됩니다.'"
        }
      },
      {
        "who": "them",
        "text": "Десять дней без горячей воды?! Это же безобразие!",
        "gloss": {
          "en": "Ten days without hot water?! That's outrageous!",
          "ko": "열흘 동안 온수가 안 나온다고?! 이건 말도 안 돼!"
        }
      },
      {
        "who": "me",
        "text": "Делать нечего, летом всегда так. Зато потом трубы будут новые.",
        "gloss": {
          "en": "Nothing to be done, it's like this every summer. But afterwards the pipes will be new.",
          "ko": "어쩔 수 없죠, 여름마다 이래요. 대신 나중엔 배관이 새것이 될 거예요."
        }
      },
      {
        "who": "them",
        "text": "Да мне-то что эти трубы... Мне вода нужна.",
        "gloss": {
          "en": "What do I care about pipes... I need water.",
          "ko": "배관이 나랑 무슨 상관이야... 나는 물이 필요한데."
        }
      },
      {
        "who": "me",
        "text": "Понимаю. Но тут ещё кое-что: «В целях безопасности лифт будет отключён на два дня».",
        "gloss": {
          "en": "I understand. But there's something else: \"For safety reasons, the lift will be switched off for two days.\"",
          "ko": "알아요. 그런데 하나 더 있어요. '안전을 위해 엘리베이터 운행을 이틀간 중지합니다.'"
        }
      },
      {
        "who": "them",
        "text": "И лифт тоже?! Как же я на седьмой этаж с сумками поднимусь?",
        "gloss": {
          "en": "The lift too?! How am I going to get up to the seventh floor with my bags?",
          "ko": "엘리베이터까지?! 장바구니 들고 7층까지 어떻게 올라가?"
        }
      },
      {
        "who": "me",
        "text": "Не берите в голову, Валентина Петровна. Сумки я вам сам занесу.",
        "gloss": {
          "en": "Don't worry about it, Valentina Petrovna. I'll carry your bags up myself.",
          "ko": "걱정 마세요, 발렌티나 페트로브나. 장바구니는 제가 올려다 드릴게요."
        }
      },
      {
        "who": "them",
        "text": "Ой, спасибо, сынок. Что бы я без тебя делала.",
        "gloss": {
          "en": "Oh, thank you, son. What would I do without you.",
          "ko": "아이고, 고맙다. 너 없으면 내가 어쩔 뻔했니."
        }
      },
      {
        "who": "me",
        "text": "А воду можно у меня греть, у меня ведь бойлер есть.",
        "gloss": {
          "en": "And you can heat water at my place, I've got a boiler after all.",
          "ko": "그리고 물은 저희 집에서 데우셔도 돼요, 저희 집엔 온수기가 있잖아요."
        }
      },
      {
        "who": "them",
        "text": "Ну золото, а не сосед! Зайди-ка вечерком, я пирожков напеку.",
        "gloss": {
          "en": "What a treasure of a neighbour! Drop by this evening, I'll bake some pirozhki.",
          "ko": "이런 보배 같은 이웃이 있나! 저녁에 들르렴, 피로시키 구워 줄게."
        }
      },
      {
        "who": "me",
        "text": "Зайду обязательно — за вашими пирожками-то как не зайти!",
        "gloss": {
          "en": "I'll definitely come — how could I miss your pirozhki!",
          "ko": "꼭 갈게요. 할머니 피로시키라면 안 갈 수가 없죠!"
        }
      }
    ]
  },
  {
    "id": "ru-5-4",
    "stage": 5,
    "situation": 3,
    "setting": {
      "en": "Talking about an art-house film your friend Lena loved and you didn't",
      "ko": "친구 레나는 좋아했지만 나는 별로였던 예술 영화 이야기"
    },
    "goal": {
      "en": "Say honestly that you didn't like the film without hurting your friend, find something you both agree on, and settle how to choose next time.",
      "ko": "친구 기분을 상하게 하지 않으면서 영화가 별로였다고 솔직히 말하고, 서로 동의하는 점을 찾아 다음 영화 고르는 방법을 정한다."
    },
    "expressions": [
      "Так себе",
      "Не в этом дело",
      "Проехали",
      "Я тут подумал"
    ],
    "grammar": [
      0,
      1,
      2,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "Ну? Скажи, гениально же! Я до сих пор под впечатлением.",
        "gloss": {
          "en": "Well? Admit it, it was brilliant! I'm still blown away.",
          "ko": "어때? 천재적이지 않아? 난 아직도 여운이 남아."
        }
      },
      {
        "who": "me",
        "text": "Ну... так себе, если честно. Я половину фильма смотрел на часы.",
        "gloss": {
          "en": "Well... so-so, to be honest. I spent half the film looking at my watch.",
          "ko": "음... 솔직히 그저 그랬어. 영화 절반은 시계만 봤어."
        }
      },
      {
        "who": "them",
        "text": "Ты серьёзно? Там же такая операторская работа!",
        "gloss": {
          "en": "Are you serious? The cinematography was amazing!",
          "ko": "진짜? 촬영이 얼마나 좋은데!"
        }
      },
      {
        "who": "me",
        "text": "Снято красиво, не спорю. Не в этом дело. Сюжет-то где?",
        "gloss": {
          "en": "It's beautifully shot, I won't argue. That's not the point. Where's the plot?",
          "ko": "화면은 예뻤어, 인정해. 그게 문제가 아니야. 줄거리가 어디 있냐고?"
        }
      },
      {
        "who": "them",
        "text": "Ну, сюжет там не главное. Это кино про настроение.",
        "gloss": {
          "en": "Well, the plot isn't the main thing. It's a film about mood.",
          "ko": "뭐, 줄거리가 중요한 게 아니야. 분위기 영화잖아."
        }
      },
      {
        "who": "me",
        "text": "Ну да, настроение. Три часа настроения... Мне под конец уже просто не сиделось.",
        "gloss": {
          "en": "Oh yes, mood. Three hours of mood... By the end I just couldn't sit still.",
          "ko": "그래, 분위기. 세 시간짜리 분위기... 마지막엔 그냥 좀이 쑤셔서 못 앉아 있겠더라."
        }
      },
      {
        "who": "them",
        "text": "Ой, всё, ты просто ничего не понимаешь в авторском кино!",
        "gloss": {
          "en": "Oh, come on, you just don't understand anything about art-house cinema!",
          "ko": "아, 됐어, 넌 예술 영화를 하나도 몰라!"
        }
      },
      {
        "who": "me",
        "text": "Ну вот, начинается. Я же не говорю, что фильм плохой — он просто не мой.",
        "gloss": {
          "en": "Here we go. I'm not saying the film is bad — it's just not my thing.",
          "ko": "또 시작이다. 영화가 나쁘다는 게 아니라, 그냥 내 취향이 아니라는 거야."
        }
      },
      {
        "who": "them",
        "text": "Ладно, извини, погорячилась. Но музыка-то тебе понравилась?",
        "gloss": {
          "en": "OK, sorry, I got carried away. But you liked the music, at least?",
          "ko": "그래, 미안, 좀 흥분했네. 그래도 음악은 좋았지?"
        }
      },
      {
        "who": "me",
        "text": "Вот музыка — да, тут не поспоришь. Саундтрек я бы ещё раз послушал.",
        "gloss": {
          "en": "Now the music — yes, no arguing there. The soundtrack I'd listen to again.",
          "ko": "음악은 인정, 그건 반박 못 하지. OST는 다시 듣고 싶어."
        }
      },
      {
        "who": "them",
        "text": "Видишь! Значит, не всё потеряно.",
        "gloss": {
          "en": "See! So not all is lost.",
          "ko": "거 봐! 아직 희망이 있네."
        }
      },
      {
        "who": "me",
        "text": "Проехали. Давай лучше решим, что смотрим в следующий раз.",
        "gloss": {
          "en": "Let's drop it. Let's decide what we're watching next time instead.",
          "ko": "됐어, 넘어가자. 다음엔 뭐 볼지나 정하자."
        }
      },
      {
        "who": "them",
        "text": "Только не твои боевики, умоляю.",
        "gloss": {
          "en": "Just not your action films, I beg you.",
          "ko": "제발 네가 좋아하는 액션 영화만 빼고."
        }
      },
      {
        "who": "me",
        "text": "Я тут подумал: давай-ка по очереди выбирать. Сегодня ты, в следующий раз — я.",
        "gloss": {
          "en": "I was just thinking: let's take turns choosing. Today you, next time me.",
          "ko": "생각해 봤는데, 번갈아 가며 고르자. 오늘은 너, 다음엔 나."
        }
      },
      {
        "who": "them",
        "text": "Справедливо. Тогда я выберу ещё одно авторское кино!",
        "gloss": {
          "en": "Fair enough. Then I'll pick another art-house film!",
          "ko": "공평하네. 그럼 나는 또 예술 영화 고를 거야!"
        }
      },
      {
        "who": "me",
        "text": "Вот бы оно хоть было покороче. Ну ладно, ради тебя потерплю.",
        "gloss": {
          "en": "If only it were a bit shorter. Oh well, I'll put up with it for you.",
          "ko": "좀 짧기라도 하면 좋겠다. 뭐, 너를 위해서 참을게."
        }
      }
    ]
  },
  {
    "id": "ru-5-x1",
    "stage": 5,
    "setting": {
      "en": "Wishing a nervous friend luck the night before a job interview",
      "ko": "면접 전날 긴장한 친구에게 행운 빌어 주기"
    },
    "expressions": [
      "Ни пуха ни пера"
    ],
    "grammar": [
      0,
      1,
      2,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "Завтра собеседование, а я весь трясусь. Что-то мне сегодня не сидится на месте.",
        "gloss": {
          "en": "The interview's tomorrow and I'm shaking all over. I just can't sit still today.",
          "ko": "내일 면접인데 온몸이 떨려. 오늘은 가만히 앉아 있지를 못하겠어."
        }
      },
      {
        "who": "me",
        "text": "Да брось, ты же лучший кандидат. Ни пуха ни пера!",
        "gloss": {
          "en": "Oh, come on, you're the best candidate. Break a leg!",
          "ko": "에이, 네가 제일 좋은 지원자잖아. 잘 될 거야!"
        }
      },
      {
        "who": "them",
        "text": "К чёрту! Спасибо. Вот бы ещё выспаться перед этим.",
        "gloss": {
          "en": "To the devil! Thanks. If only I could get some sleep beforehand.",
          "ko": "고마워! 그 전에 잠이라도 푹 잤으면 좋겠다."
        }
      },
      {
        "who": "me",
        "text": "Выпей-ка на ночь тёплого молочка и ложись пораньше.",
        "gloss": {
          "en": "Have some warm milk before bed and turn in early.",
          "ko": "자기 전에 따뜻한 우유 한 잔 마시고 일찍 자."
        }
      },
      {
        "who": "them",
        "text": "Ты как моя бабушка, честное слово.",
        "gloss": {
          "en": "You sound like my grandma, honestly.",
          "ko": "너 진짜 우리 할머니 같아."
        }
      },
      {
        "who": "me",
        "text": "Бабушки плохого не посоветуют. Позвони мне сразу после, ладно?",
        "gloss": {
          "en": "Grandmas never give bad advice. Call me right after, OK?",
          "ko": "할머니 말씀은 틀린 게 없어. 끝나고 바로 전화해, 알았지?"
        }
      }
    ]
  }
];
