import type { StageScript } from "../stageScripts.ts";

/** zh 단계 대본(curriculum/stageScripts.ts) — 상황 대본 + 표현·문법 대본(x), 1~5단계 내 줄에 틀 태그. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
export const ZH: StageScript[] = [
  {
    "id": "zh-1-1",
    "name": {
      "text": [
        "智宇"
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
      "en": "First day of Chinese class: meeting Wang Li, a classmate",
      "ko": "중국어 수업 첫날, 같은 반 친구 왕리와"
    },
    "expressions": [
      "你好",
      "认识你很高兴",
      "不是",
      "我是韩国人",
      "你呢"
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
        "text": "你好！我叫王丽。你叫什么名字？",
        "gloss": {
          "en": "Hi! I'm Wang Li. What's your name?",
          "ko": "안녕! 나는 왕리야. 너는 이름이 뭐야?"
        }
      },
      {
        "who": "me",
        "text": "你好，我叫智宇。认识你很高兴。",
        "gloss": {
          "en": "Hi, I'm Ji-woo. Nice to meet you.",
          "ko": "안녕, 나는 지우야. 만나서 반가워."
        },
        "frames": [
          "zh-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "我也很高兴。你是日本人吗？",
        "gloss": {
          "en": "Nice to meet you too. Are you Japanese?",
          "ko": "나도 반가워. 너 일본 사람이야?"
        }
      },
      {
        "who": "me",
        "text": "不是，我是韩国人。你呢？",
        "gloss": {
          "en": "No, I'm Korean. And you?",
          "ko": "아니, 나는 한국 사람이야. 너는?"
        },
        "frames": [
          "zh-f1-02"
        ]
      },
      {
        "who": "them",
        "text": "我是中国人，北京人。那个人是谁？",
        "gloss": {
          "en": "I'm Chinese, from Beijing. Who's that person?",
          "ko": "나는 중국 사람이고 베이징 출신이야. 저 사람은 누구야?"
        }
      },
      {
        "who": "me",
        "text": "他是我们的老师。他很好。",
        "gloss": {
          "en": "He's our teacher. He's very nice.",
          "ko": "우리 선생님이야. 아주 좋으신 분이야."
        }
      },
      {
        "who": "them",
        "text": "好的。这儿有人吗？",
        "gloss": {
          "en": "OK. Is anyone sitting here?",
          "ko": "그렇구나. 여기 자리 있어?"
        }
      },
      {
        "who": "me",
        "text": "没有，请坐。",
        "gloss": {
          "en": "No, please sit down.",
          "ko": "아니, 앉아."
        },
        "frames": [
          "zh-f1-13"
        ]
      }
    ]
  },
  {
    "id": "zh-1-2",
    "stage": 1,
    "situation": 1,
    "setting": {
      "en": "Buying fruit at a market stall",
      "ko": "시장 과일 노점에서"
    },
    "expressions": [
      "你好",
      "多少钱",
      "太贵了",
      "好的",
      "我要这个",
      "谢谢"
    ],
    "grammar": [
      1,
      3,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好！你要什么水果？",
        "gloss": {
          "en": "Hello! What fruit would you like?",
          "ko": "안녕하세요! 어떤 과일 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "你好。这个是什么？",
        "gloss": {
          "en": "Hello. What is this?",
          "ko": "안녕하세요. 이건 뭐예요?"
        },
        "frames": [
          "zh-f1-06",
          "zh-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "这是芒果，很甜。",
        "gloss": {
          "en": "It's mango. It's very sweet.",
          "ko": "망고예요. 아주 달아요."
        }
      },
      {
        "who": "me",
        "text": "芒果多少钱？",
        "gloss": {
          "en": "How much is the mango?",
          "ko": "망고 얼마예요?"
        },
        "frames": [
          "zh-f1-09"
        ]
      },
      {
        "who": "them",
        "text": "二十块一斤。",
        "gloss": {
          "en": "Twenty yuan for half a kilo.",
          "ko": "한 근에 이십 위안이에요."
        }
      },
      {
        "who": "me",
        "text": "太贵了。这儿有苹果吗？",
        "gloss": {
          "en": "That's too expensive. Do you have apples here?",
          "ko": "너무 비싸요. 여기 사과 있어요?"
        },
        "frames": [
          "zh-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "有，苹果八块一斤，很好吃。",
        "gloss": {
          "en": "Yes, apples are eight yuan for half a kilo. They're delicious.",
          "ko": "있어요. 사과는 한 근에 팔 위안이고 아주 맛있어요."
        }
      },
      {
        "who": "me",
        "text": "好的，我要这个。谢谢！",
        "gloss": {
          "en": "OK, I'll take these. Thank you!",
          "ko": "좋아요, 이거 주세요. 감사합니다!"
        },
        "frames": [
          "zh-f1-12"
        ]
      }
    ]
  },
  {
    "id": "zh-1-3",
    "stage": 1,
    "situation": 2,
    "setting": {
      "en": "Asking a staff member the way in a shopping mall",
      "ko": "쇼핑몰에서 직원에게 길 묻기"
    },
    "expressions": [
      "请问",
      "洗手间在哪儿",
      "对不起",
      "我听不懂",
      "请再说一遍",
      "好的",
      "谢谢",
      "再见"
    ],
    "grammar": [
      1,
      3,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好，欢迎光临！",
        "gloss": {
          "en": "Hello, welcome!",
          "ko": "안녕하세요, 어서 오세요!"
        }
      },
      {
        "who": "me",
        "text": "你好。请问，洗手间在哪儿？",
        "gloss": {
          "en": "Hello. Excuse me, where is the restroom?",
          "ko": "안녕하세요. 실례지만 화장실이 어디예요?"
        },
        "frames": [
          "zh-f1-08"
        ]
      },
      {
        "who": "them",
        "text": "洗手间在三楼，电梯在那儿。",
        "gloss": {
          "en": "The restroom is on the third floor. The elevator is over there.",
          "ko": "화장실은 3층에 있고, 엘리베이터는 저쪽이에요."
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
          "zh-f1-13",
          "zh-f1-17"
        ]
      },
      {
        "who": "them",
        "text": "没关系。洗手间在三楼。",
        "gloss": {
          "en": "No problem. The restroom is on the third floor.",
          "ko": "괜찮아요. 화장실은 3층이에요."
        }
      },
      {
        "who": "me",
        "text": "好的，谢谢。这儿有咖啡店吗？",
        "gloss": {
          "en": "OK, thanks. Is there a café here?",
          "ko": "네, 감사합니다. 여기 카페 있어요?"
        },
        "frames": [
          "zh-f1-10"
        ]
      },
      {
        "who": "them",
        "text": "这层没有。二楼有一个咖啡店。",
        "gloss": {
          "en": "Not on this floor. There's a café on the second floor.",
          "ko": "이 층엔 없어요. 2층에 카페가 하나 있어요."
        }
      },
      {
        "who": "me",
        "text": "好的，谢谢你。再见！",
        "gloss": {
          "en": "OK, thank you. Goodbye!",
          "ko": "네, 고맙습니다. 안녕히 계세요!"
        },
        "frames": [
          "zh-f1-20"
        ]
      }
    ]
  },
  {
    "id": "zh-1-4",
    "stage": 1,
    "situation": 3,
    "setting": {
      "en": "Morning in the office lobby: a colleague bumps into you",
      "ko": "아침 회사 로비에서 동료와 부딪혔을 때"
    },
    "expressions": [
      "早上好",
      "没关系",
      "谢谢",
      "等一下"
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
        "text": "早上好！啊，对不起！",
        "gloss": {
          "en": "Good morning! Oh, sorry!",
          "ko": "좋은 아침! 아, 미안해요!"
        }
      },
      {
        "who": "me",
        "text": "早上好。没关系。",
        "gloss": {
          "en": "Good morning. That's all right.",
          "ko": "좋은 아침이에요. 괜찮아요."
        },
        "frames": [
          "zh-f1-01"
        ]
      },
      {
        "who": "them",
        "text": "这本书是你的吗？",
        "gloss": {
          "en": "Is this book yours?",
          "ko": "이 책 당신 거예요?"
        }
      },
      {
        "who": "me",
        "text": "对，这是我的。谢谢！",
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
        "text": "不客气。哎呀，你的咖啡！真对不起！",
        "gloss": {
          "en": "You're welcome. Oh no, your coffee! I'm really sorry!",
          "ko": "천만에요. 어머, 커피가! 정말 미안해요!"
        }
      },
      {
        "who": "me",
        "text": "没关系，咖啡不热。我没事。",
        "gloss": {
          "en": "It's fine, the coffee isn't hot. I'm OK.",
          "ko": "괜찮아요, 커피가 안 뜨거워요. 저 괜찮아요."
        }
      },
      {
        "who": "them",
        "text": "我给你买一杯新的吧？",
        "gloss": {
          "en": "Let me buy you a new one?",
          "ko": "새 커피 한 잔 사 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "不用，谢谢。等一下，这个手机是你的吗？",
        "gloss": {
          "en": "No need, thanks. Wait a moment, is this phone yours?",
          "ko": "괜찮아요, 고마워요. 잠깐만요, 이 휴대폰 당신 거예요?"
        }
      }
    ]
  },
  {
    "id": "zh-1-x1",
    "name": {
      "text": [
        "智宇"
      ],
      "en": [
        "Ji-woo"
      ],
      "ko": [
        "지우"
      ]
    },
    "stage": 1,
    "setting": {
      "en": "Lending a pen to a new classmate",
      "ko": "새 반 친구에게 펜 빌려주기"
    },
    "expressions": [
      "不客气",
      "认识你很高兴"
    ],
    "grammar": [
      0,
      1,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好！请问，你有笔吗？",
        "gloss": {
          "en": "Hi! Excuse me, do you have a pen?",
          "ko": "안녕! 저기, 펜 있어?"
        }
      },
      {
        "who": "me",
        "text": "有，这个给你。",
        "gloss": {
          "en": "Yes, here, take this one.",
          "ko": "응, 이거 써."
        }
      },
      {
        "who": "them",
        "text": "太好了，谢谢你！",
        "gloss": {
          "en": "Great, thank you!",
          "ko": "잘됐다, 고마워!"
        }
      },
      {
        "who": "me",
        "text": "不客气。你是新同学吗？",
        "gloss": {
          "en": "You're welcome. Are you a new classmate?",
          "ko": "천만에. 너 새로 온 친구야?"
        },
        "frames": [
          "zh-f1-04"
        ]
      },
      {
        "who": "them",
        "text": "是，我叫李明。你叫什么名字？",
        "gloss": {
          "en": "Yes, I'm Li Ming. What's your name?",
          "ko": "응, 나는 리밍이야. 너는 이름이 뭐야?"
        }
      },
      {
        "who": "me",
        "text": "我叫智宇。认识你很高兴。",
        "gloss": {
          "en": "I'm Ji-woo. Nice to meet you.",
          "ko": "나는 지우야. 만나서 반가워."
        }
      }
    ]
  },
  {
    "id": "zh-2-1",
    "stage": 2,
    "situation": 0,
    "setting": {
      "en": "Messaging your friend Xiao Lin to make weekend plans",
      "ko": "친구 샤오린과 메시지로 주말 약속 잡기"
    },
    "expressions": [
      "有点儿累",
      "周末有空吗",
      "一起去吧",
      "我觉得",
      "几点见"
    ],
    "grammar": [
      0,
      1,
      2,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "在吗？你昨天去哪儿了？",
        "gloss": {
          "en": "You there? Where did you go yesterday?",
          "ko": "있어? 어제 어디 갔었어?"
        }
      },
      {
        "who": "me",
        "text": "我昨天去了博物馆，有点儿累。你周末有空吗？",
        "gloss": {
          "en": "I went to the museum yesterday, I'm a bit tired. Are you free this weekend?",
          "ko": "어제 박물관에 갔었는데 좀 피곤해. 너 주말에 시간 있어?"
        },
        "frames": [
          "zh-f2-01",
          "zh-f2-19"
        ]
      },
      {
        "who": "them",
        "text": "周六没空，周日有空。怎么了？",
        "gloss": {
          "en": "Not on Saturday, but I'm free on Sunday. Why?",
          "ko": "토요일은 안 되고 일요일은 돼. 왜?"
        }
      },
      {
        "who": "me",
        "text": "我想去看电影。一起去吧！",
        "gloss": {
          "en": "I want to go and see a film. Let's go together!",
          "ko": "영화 보러 가고 싶어. 같이 가자!"
        },
        "frames": [
          "zh-f2-03"
        ]
      },
      {
        "who": "them",
        "text": "好啊！你想看哪个电影？",
        "gloss": {
          "en": "Sure! Which film do you want to see?",
          "ko": "좋아! 어떤 영화 보고 싶어?"
        }
      },
      {
        "who": "me",
        "text": "我觉得那个新的动作片不错。你想看动作片还是喜剧？",
        "gloss": {
          "en": "I think that new action film looks good. Do you want to see an action film or a comedy?",
          "ko": "그 새 액션 영화 괜찮은 것 같아. 액션 영화 볼래, 코미디 볼래?"
        }
      },
      {
        "who": "them",
        "text": "动作片吧。我们怎么去？",
        "gloss": {
          "en": "Action, I guess. How shall we get there?",
          "ko": "액션 영화 보자. 어떻게 갈까?"
        }
      },
      {
        "who": "me",
        "text": "我们坐地铁去吧。几点见？",
        "gloss": {
          "en": "Let's take the subway. What time shall we meet?",
          "ko": "지하철 타고 가자. 몇 시에 볼까?"
        },
        "frames": [
          "zh-f2-14"
        ]
      },
      {
        "who": "them",
        "text": "下午三点，电影院门口见。",
        "gloss": {
          "en": "Three in the afternoon, at the cinema entrance.",
          "ko": "오후 세 시에 영화관 입구에서 보자."
        }
      },
      {
        "who": "me",
        "text": "好的，周日见！",
        "gloss": {
          "en": "OK, see you Sunday!",
          "ko": "좋아, 일요일에 봐!"
        },
        "frames": [
          "zh-f1-20"
        ]
      }
    ]
  },
  {
    "id": "zh-2-2",
    "stage": 2,
    "situation": 1,
    "setting": {
      "en": "Ordering lunch alone at a noodle restaurant",
      "ko": "국숫집에서 혼자 점심 주문하기"
    },
    "expressions": [
      "你推荐什么",
      "不要辣",
      "买单",
      "打包"
    ],
    "grammar": [
      1,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好，几位？",
        "gloss": {
          "en": "Hello, how many people?",
          "ko": "안녕하세요, 몇 분이세요?"
        }
      },
      {
        "who": "me",
        "text": "一个人。我可以坐这儿吗？",
        "gloss": {
          "en": "Just me. Can I sit here?",
          "ko": "한 명이에요. 여기 앉아도 돼요?"
        },
        "frames": [
          "zh-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "可以，请坐。这是菜单。",
        "gloss": {
          "en": "Sure, have a seat. Here's the menu.",
          "ko": "네, 앉으세요. 메뉴판 여기 있어요."
        }
      },
      {
        "who": "me",
        "text": "你推荐什么？",
        "gloss": {
          "en": "What do you recommend?",
          "ko": "뭘 추천하세요?"
        }
      },
      {
        "who": "them",
        "text": "我们的牛肉面很好吃。要大碗还是小碗？",
        "gloss": {
          "en": "Our beef noodles are very good. Large bowl or small bowl?",
          "ko": "저희 소고기 국수가 맛있어요. 큰 그릇으로 드릴까요, 작은 그릇으로 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "我要小碗的。不要辣，我不能吃辣。",
        "gloss": {
          "en": "I'll have a small bowl. Not spicy, please — I can't eat spicy food.",
          "ko": "작은 걸로 주세요. 안 맵게요, 저는 매운 걸 못 먹어요."
        },
        "frames": [
          "zh-f1-12"
        ]
      },
      {
        "who": "them",
        "text": "好的。在这儿吃还是带走？",
        "gloss": {
          "en": "OK. Eat in or take away?",
          "ko": "네. 드시고 가세요, 가져가세요?"
        }
      },
      {
        "who": "me",
        "text": "在这儿吃。我还想要一瓶水。",
        "gloss": {
          "en": "Eat in. I'd also like a bottle of water.",
          "ko": "여기서 먹을게요. 물도 한 병 주세요."
        }
      },
      {
        "who": "them",
        "text": "吃得怎么样？还要别的吗？",
        "gloss": {
          "en": "How was it? Anything else?",
          "ko": "식사 어떠셨어요? 더 필요하신 거 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "很好吃！服务员，买单。剩下的面可以打包吗？",
        "gloss": {
          "en": "Delicious! Excuse me, the bill please. Can I take the leftover noodles away?",
          "ko": "정말 맛있었어요! 여기요, 계산할게요. 남은 국수 포장해 갈 수 있어요?"
        },
        "frames": [
          "zh-f2-10"
        ]
      }
    ]
  },
  {
    "id": "zh-2-3",
    "stage": 2,
    "situation": 2,
    "setting": {
      "en": "Taking a taxi from the airport to your hotel",
      "ko": "공항에서 택시 타고 호텔 가기"
    },
    "expressions": [
      "师傅",
      "慢点儿说",
      "太好了",
      "有点儿累",
      "到了"
    ],
    "grammar": [
      0,
      1,
      2,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "你好，去哪儿？",
        "gloss": {
          "en": "Hello, where to?",
          "ko": "안녕하세요, 어디 가세요?"
        }
      },
      {
        "who": "me",
        "text": "师傅，我要去和平酒店。",
        "gloss": {
          "en": "Driver, I'd like to go to the Heping Hotel.",
          "ko": "기사님, 허핑 호텔로 가 주세요."
        }
      },
      {
        "who": "them",
        "text": "和平酒店？哪个和平酒店？城里有两个呢。",
        "gloss": {
          "en": "Heping Hotel? Which one? There are two in the city.",
          "ko": "허핑 호텔이요? 어느 허핑 호텔이요? 시내에 두 개 있거든요."
        }
      },
      {
        "who": "me",
        "text": "对不起，请慢点儿说。",
        "gloss": {
          "en": "Sorry, please speak more slowly.",
          "ko": "죄송해요, 좀 천천히 말해 주세요."
        }
      },
      {
        "who": "them",
        "text": "好。是人民路上的那个吗？",
        "gloss": {
          "en": "OK. Is it the one on Renmin Road?",
          "ko": "네. 런민루에 있는 거예요?"
        }
      },
      {
        "who": "me",
        "text": "对，在人民路。我们几点能到？",
        "gloss": {
          "en": "Yes, on Renmin Road. What time can we get there?",
          "ko": "네, 런민루요. 몇 시쯤 도착할 수 있어요?"
        }
      },
      {
        "who": "them",
        "text": "不堵车的话，二十分钟就到。",
        "gloss": {
          "en": "If there's no traffic, twenty minutes.",
          "ko": "안 막히면 이십 분이면 가요."
        }
      },
      {
        "who": "me",
        "text": "太好了。我今天坐了三个小时的飞机，有点儿累。",
        "gloss": {
          "en": "Great. I was on a plane for three hours today, I'm a bit tired.",
          "ko": "다행이네요. 오늘 비행기를 세 시간 탔더니 좀 피곤해요."
        },
        "frames": [
          "zh-f2-19"
        ]
      },
      {
        "who": "them",
        "text": "前面就是和平酒店。",
        "gloss": {
          "en": "The Heping Hotel is just ahead.",
          "ko": "바로 앞이 허핑 호텔이에요."
        }
      },
      {
        "who": "me",
        "text": "到了！师傅，可以用手机付吗？",
        "gloss": {
          "en": "We're here! Driver, can I pay with my phone?",
          "ko": "도착했네요! 기사님, 휴대폰으로 결제해도 돼요?"
        },
        "frames": [
          "zh-f2-10"
        ]
      }
    ]
  },
  {
    "id": "zh-2-4",
    "stage": 2,
    "situation": 3,
    "setting": {
      "en": "At a pharmacy with a headache",
      "ko": "머리가 아파서 약국에 감"
    },
    "expressions": [
      "我头疼",
      "怎么走"
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
        "text": "你好，哪儿不舒服？",
        "gloss": {
          "en": "Hello, what's bothering you?",
          "ko": "안녕하세요, 어디가 불편하세요?"
        }
      },
      {
        "who": "me",
        "text": "我头疼，还有点儿发烧。",
        "gloss": {
          "en": "I have a headache and a slight fever.",
          "ko": "머리가 아프고 열도 좀 나요."
        },
        "frames": [
          "zh-f2-18",
          "zh-f2-19"
        ]
      },
      {
        "who": "them",
        "text": "什么时候开始的？",
        "gloss": {
          "en": "When did it start?",
          "ko": "언제부터 그랬어요?"
        }
      },
      {
        "who": "me",
        "text": "我昨天晚上就头疼了。",
        "gloss": {
          "en": "My head started hurting last night.",
          "ko": "어젯밤부터 머리가 아팠어요."
        }
      },
      {
        "who": "them",
        "text": "你想要药片还是冲剂？",
        "gloss": {
          "en": "Would you like tablets or a powder to dissolve?",
          "ko": "알약으로 드릴까요, 가루약으로 드릴까요?"
        }
      },
      {
        "who": "me",
        "text": "我想要药片，冲剂太苦了。",
        "gloss": {
          "en": "I'd like tablets; the powder is too bitter.",
          "ko": "알약으로 주세요, 가루약은 너무 써요."
        }
      },
      {
        "who": "them",
        "text": "一天三次，饭后吃。多喝水，多休息。",
        "gloss": {
          "en": "Three times a day, after meals. Drink lots of water and rest.",
          "ko": "하루 세 번, 식후에 드세요. 물 많이 마시고 푹 쉬세요."
        }
      },
      {
        "who": "me",
        "text": "我明天要在公司上班，能吃这个药吗？",
        "gloss": {
          "en": "I have to work at the office tomorrow. Can I take this medicine?",
          "ko": "내일 회사에 출근해야 하는데 이 약 먹어도 돼요?"
        },
        "frames": [
          "zh-f2-08"
        ]
      },
      {
        "who": "them",
        "text": "可以，这个药不会让你困。一共四十五块。",
        "gloss": {
          "en": "Yes, it won't make you sleepy. That's forty-five yuan in total.",
          "ko": "네, 이 약은 졸리지 않아요. 모두 사십오 위안이에요."
        }
      },
      {
        "who": "me",
        "text": "好的，谢谢。附近有医院吗？怎么走？",
        "gloss": {
          "en": "OK, thanks. Is there a hospital nearby? How do I get there?",
          "ko": "네, 감사합니다. 근처에 병원 있어요? 어떻게 가요?"
        },
        "frames": [
          "zh-f2-17"
        ]
      }
    ]
  },
  {
    "id": "zh-2-x1",
    "stage": 2,
    "setting": {
      "en": "A friend invites you to hot pot tonight",
      "ko": "친구가 오늘 저녁 훠궈 먹자고 할 때"
    },
    "expressions": [
      "没空",
      "下次吧",
      "真的吗",
      "太好了",
      "还行",
      "差不多"
    ],
    "grammar": [
      2,
      5,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "智宇，今天晚上一起吃火锅吧？",
        "gloss": {
          "en": "Ji-woo, shall we have hot pot together tonight?",
          "ko": "지우야, 오늘 저녁에 같이 훠궈 먹을래?"
        }
      },
      {
        "who": "me",
        "text": "今天晚上没空，下次吧。",
        "gloss": {
          "en": "I'm not free tonight. Next time.",
          "ko": "오늘 저녁은 시간이 없어. 다음에 하자."
        }
      },
      {
        "who": "them",
        "text": "好吧。对了，我下个月要去北京工作。",
        "gloss": {
          "en": "OK. Oh, by the way, I'm going to work in Beijing next month.",
          "ko": "알았어. 참, 나 다음 달에 베이징으로 일하러 가."
        }
      },
      {
        "who": "me",
        "text": "真的吗？太好了！你坐飞机去还是坐高铁去？",
        "gloss": {
          "en": "Really? That's great! Are you going by plane or by high-speed train?",
          "ko": "정말? 잘됐다! 비행기 타고 가, 고속철 타고 가?"
        }
      },
      {
        "who": "them",
        "text": "坐高铁。你最近工作怎么样？忙吗？",
        "gloss": {
          "en": "High-speed train. How's work lately? Busy?",
          "ko": "고속철. 너 요즘 일은 어때? 바빠?"
        }
      },
      {
        "who": "me",
        "text": "还行，差不多每天八点下班。",
        "gloss": {
          "en": "It's OK. I finish work around eight every day.",
          "ko": "그럭저럭. 거의 매일 여덟 시에 퇴근해."
        }
      }
    ]
  },
  {
    "id": "zh-2-x2",
    "stage": 2,
    "setting": {
      "en": "Asking about the rules at a museum entrance",
      "ko": "박물관 입구에서 규칙 묻기"
    },
    "expressions": [
      "可以拍照吗"
    ],
    "grammar": [
      1,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "欢迎来到博物馆。",
        "gloss": {
          "en": "Welcome to the museum.",
          "ko": "박물관에 오신 걸 환영합니다."
        }
      },
      {
        "who": "me",
        "text": "你好，请问，这儿可以拍照吗？",
        "gloss": {
          "en": "Hello, excuse me, can I take photos here?",
          "ko": "안녕하세요, 실례지만 여기서 사진 찍어도 돼요?"
        },
        "frames": [
          "zh-f2-10"
        ]
      },
      {
        "who": "them",
        "text": "可以拍照，但是不能用闪光灯。",
        "gloss": {
          "en": "You can take photos, but you can't use the flash.",
          "ko": "사진은 찍으셔도 되는데 플래시는 안 돼요."
        }
      },
      {
        "who": "me",
        "text": "好的。我能在这儿喝水吗？",
        "gloss": {
          "en": "OK. Can I drink water in here?",
          "ko": "알겠습니다. 여기서 물 마셔도 돼요?"
        },
        "frames": [
          "zh-f2-11"
        ]
      },
      {
        "who": "them",
        "text": "这儿不行，你可以在外面喝。",
        "gloss": {
          "en": "Not in here, you can drink outside.",
          "ko": "여기서는 안 되고 밖에서 드시면 돼요."
        }
      },
      {
        "who": "me",
        "text": "知道了。我想在外面坐一下。",
        "gloss": {
          "en": "Got it. I'd like to sit outside for a bit.",
          "ko": "알겠습니다. 밖에서 좀 앉아 있을게요."
        }
      }
    ]
  },
  {
    "id": "zh-3-1",
    "stage": 3,
    "situation": 0,
    "setting": {
      "en": "Calling the front desk at night: your room's air conditioner is broken",
      "ko": "밤에 프런트에 전화해 방 에어컨 고장을 알리기"
    },
    "expressions": [
      "不好意思",
      "说实话",
      "麻烦你了"
    ],
    "grammar": [
      0,
      2,
      3,
      5,
      6,
      7
    ],
    "earlierGrammar": [
      "2:0"
    ],
    "lines": [
      {
        "who": "them",
        "text": "您好，前台。有什么可以帮您？",
        "gloss": {
          "en": "Hello, front desk. How can I help you?",
          "ko": "안녕하세요, 프런트입니다. 무엇을 도와드릴까요?"
        },
        "alt": [
          {
            "text": "您好，这里是前台，请问有什么需要？",
            "gloss": {
              "en": "Hello, this is the front desk. What do you need?",
              "ko": "안녕하세요, 프런트입니다. 필요하신 게 있으세요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "你好，我是八零六的客人。不好意思，房间的空调坏了。",
        "gloss": {
          "en": "Hi, I'm the guest in eight-oh-six. Sorry to bother you, but the air conditioner in my room is broken.",
          "ko": "안녕하세요, 806호 손님인데요. 죄송하지만 방 에어컨이 고장 났어요."
        }
      },
      {
        "who": "them",
        "text": "空调怎么了？",
        "gloss": {
          "en": "What's wrong with the air conditioner?",
          "ko": "에어컨이 어떻게 됐나요?"
        }
      },
      {
        "who": "me",
        "text": "开是开了，可是一直吹热风。我把温度调到最低了，还是很热。",
        "gloss": {
          "en": "It turns on, but it keeps blowing hot air. I set the temperature to the lowest, and it's still hot.",
          "ko": "켜지긴 하는데 계속 더운 바람이 나와요. 온도를 제일 낮게 맞췄는데도 여전히 더워요."
        }
      },
      {
        "who": "them",
        "text": "您试过遥控器上的模式键吗？",
        "gloss": {
          "en": "Have you tried the mode button on the remote?",
          "ko": "리모컨의 모드 버튼은 눌러 보셨어요?"
        },
        "alt": [
          {
            "text": "您按过遥控器上的那个模式键吗？",
            "gloss": {
              "en": "Have you pressed that mode button on the remote?",
              "ko": "리모컨에 있는 그 모드 버튼 눌러 보셨어요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "试过了，没用。说实话，我热得睡不着。",
        "gloss": {
          "en": "I've tried it, it didn't help. To be honest, it's so hot I can't sleep.",
          "ko": "해 봤는데 소용없어요. 솔직히 너무 더워서 잠을 못 자겠어요."
        },
        "frames": [
          "zh-f3-15"
        ]
      },
      {
        "who": "them",
        "text": "真抱歉。维修师傅正在别的房间修空调呢，可能要等一个小时。",
        "gloss": {
          "en": "I'm very sorry. The repairman is fixing an air conditioner in another room right now; it might take an hour.",
          "ko": "정말 죄송합니다. 수리 기사님이 지금 다른 방 에어컨을 고치는 중이라 한 시간쯤 기다리셔야 할 수도 있어요."
        }
      },
      {
        "who": "me",
        "text": "一个小时？太晚了。因为明天早上我要开会，所以今天必须好好睡觉。",
        "gloss": {
          "en": "An hour? That's too late. I have a meeting tomorrow morning, so I really need a good night's sleep.",
          "ko": "한 시간이요? 너무 늦어요. 내일 아침에 회의가 있어서 오늘은 꼭 푹 자야 하거든요."
        },
        "frames": [
          "zh-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "那我给您换一个房间，可以吗？",
        "gloss": {
          "en": "Then shall I move you to another room?",
          "ko": "그럼 방을 바꿔 드려도 될까요?"
        },
        "alt": [
          {
            "text": "要不然我给您换个房间吧？",
            "gloss": {
              "en": "How about I give you a different room?",
              "ko": "아니면 다른 방으로 바꿔 드릴까요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "好的，麻烦你了。我现在下去，请把新房卡给我。",
        "gloss": {
          "en": "OK, sorry for the trouble. I'll come down now — please give me the new room card.",
          "ko": "네, 번거롭게 해 드려 죄송해요. 지금 내려갈 테니 새 방 카드 좀 주세요."
        },
        "frames": [
          "zh-f3-10"
        ]
      },
      {
        "who": "them",
        "text": "好的。新房间是一二零八，空调没有问题。",
        "gloss": {
          "en": "Sure. The new room is twelve-oh-eight, and the air conditioner works fine.",
          "ko": "네. 새 방은 1208호이고 에어컨은 문제없어요."
        }
      },
      {
        "who": "me",
        "text": "太好了，谢谢。我拿完行李就下去。",
        "gloss": {
          "en": "Great, thanks. I'll come down as soon as I've grabbed my luggage.",
          "ko": "잘됐네요, 감사합니다. 짐 챙기고 바로 내려갈게요."
        }
      }
    ]
  },
  {
    "id": "zh-3-2",
    "stage": 3,
    "situation": 1,
    "setting": {
      "en": "Back at the office, telling coworkers about your holiday in Yunnan",
      "ko": "휴가 후 사무실에서 동료들에게 윈난 여행 이야기하기"
    },
    "expressions": [
      "第一次",
      "我去过",
      "越来越",
      "对了",
      "没想到"
    ],
    "grammar": [
      0,
      1,
      2,
      5,
      7
    ],
    "earlierGrammar": [
      "2:0",
      "2:3"
    ],
    "lines": [
      {
        "who": "them",
        "text": "智宇，休假回来了！去哪儿玩了？",
        "gloss": {
          "en": "Ji-woo, you're back from holiday! Where did you go?",
          "ko": "지우 씨, 휴가 다녀왔네요! 어디 갔었어요?"
        }
      },
      {
        "who": "me",
        "text": "我去了云南。这是我第一次去云南。",
        "gloss": {
          "en": "I went to Yunnan. It was my first time there.",
          "ko": "윈난에 갔었어요. 윈난은 처음이었어요."
        }
      },
      {
        "who": "them",
        "text": "云南！我也一直想去。那儿怎么样？",
        "gloss": {
          "en": "Yunnan! I've always wanted to go. What was it like?",
          "ko": "윈난이요! 저도 늘 가 보고 싶었어요. 어땠어요?"
        },
        "alt": [
          {
            "text": "云南好玩吗？我还没去过呢。",
            "gloss": {
              "en": "Was Yunnan fun? I've never been.",
              "ko": "윈난 재밌었어요? 저는 아직 안 가 봤어요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "特别漂亮。我去过丽江和大理，大理比丽江安静多了。",
        "gloss": {
          "en": "It was beautiful. I went to Lijiang and Dali — Dali is much quieter than Lijiang.",
          "ko": "정말 예뻤어요. 리장이랑 다리에 갔는데, 다리가 리장보다 훨씬 조용해요."
        },
        "frames": [
          "zh-f3-01",
          "zh-f3-03"
        ]
      },
      {
        "who": "them",
        "text": "听说云南的菜很辣，你吃得惯吗？",
        "gloss": {
          "en": "I heard Yunnan food is very spicy. Did you get used to it?",
          "ko": "윈난 음식이 맵다던데, 입에 맞았어요?"
        },
        "alt": [
          {
            "text": "那边的菜你吃得惯吗？",
            "gloss": {
              "en": "Could you handle the food there?",
              "ko": "거기 음식은 입에 맞았어요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "一开始吃不惯，后来越来越喜欢了。",
        "gloss": {
          "en": "At first I couldn't get used to it, but then I liked it more and more.",
          "ko": "처음엔 입에 안 맞았는데, 나중엔 점점 좋아졌어요."
        },
        "frames": [
          "zh-f3-18"
        ]
      },
      {
        "who": "them",
        "text": "你拍照片了吗？给我们看看！",
        "gloss": {
          "en": "Did you take photos? Show us!",
          "ko": "사진 찍었어요? 우리도 보여 줘요!"
        }
      },
      {
        "who": "me",
        "text": "拍了很多，可是我还没整理完。对了，我给你们带了点心。",
        "gloss": {
          "en": "Lots, but I haven't finished sorting them yet. Oh, by the way, I brought you some snacks.",
          "ko": "많이 찍었는데 아직 정리를 다 못 했어요. 참, 여러분 드리려고 간식 사 왔어요."
        },
        "frames": [
          "zh-f3-05"
        ]
      },
      {
        "who": "them",
        "text": "哇，谢谢！这个点心是那儿的特产吗？",
        "gloss": {
          "en": "Wow, thanks! Is this a local specialty from there?",
          "ko": "와, 고마워요! 이 간식이 거기 특산품이에요?"
        },
        "alt": [
          {
            "text": "好香啊！是云南的特产吗？",
            "gloss": {
              "en": "It smells great! Is it a Yunnan specialty?",
              "ko": "냄새 좋다! 윈난 특산품이에요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "对，是鲜花饼。没想到用花也能做点心。",
        "gloss": {
          "en": "Yes, they're flower cakes. I never expected you could make snacks out of flowers.",
          "ko": "네, 꽃빵이에요. 꽃으로도 간식을 만들 수 있을 줄은 몰랐어요."
        }
      },
      {
        "who": "them",
        "text": "真好吃！对了，你晒得好黑啊。",
        "gloss": {
          "en": "Delicious! Oh, you got really tanned.",
          "ko": "정말 맛있네요! 그런데 엄청 탔네요."
        }
      },
      {
        "who": "me",
        "text": "因为每天都在外面玩，所以晒黑了。",
        "gloss": {
          "en": "Because I was outside every day, I got a tan.",
          "ko": "매일 밖에서 놀아서 탔어요."
        },
        "frames": [
          "zh-f3-09"
        ]
      }
    ]
  },
  {
    "id": "zh-3-3",
    "stage": 3,
    "situation": 2,
    "setting": {
      "en": "Choosing a new phone plan at a mobile shop",
      "ko": "휴대폰 매장에서 새 요금제 고르기"
    },
    "expressions": [
      "比如说",
      "不好意思",
      "我同意"
    ],
    "grammar": [
      1,
      2,
      3,
      5,
      6
    ],
    "earlierGrammar": [
      "2:4"
    ],
    "lines": [
      {
        "who": "them",
        "text": "您好，想办什么业务？",
        "gloss": {
          "en": "Hello, what can I do for you?",
          "ko": "안녕하세요, 어떤 업무 보시겠어요?"
        },
        "alt": [
          {
            "text": "欢迎光临，您需要什么？",
            "gloss": {
              "en": "Welcome, what do you need?",
              "ko": "어서 오세요, 뭐가 필요하세요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "我想换一个手机套餐，现在的流量不够用。",
        "gloss": {
          "en": "I'd like to change my phone plan. My current data isn't enough.",
          "ko": "휴대폰 요금제를 바꾸고 싶어요. 지금 데이터가 모자라요."
        }
      },
      {
        "who": "them",
        "text": "您平时流量用得多吗？",
        "gloss": {
          "en": "Do you usually use a lot of data?",
          "ko": "평소에 데이터 많이 쓰세요?"
        },
        "alt": [
          {
            "text": "您平时上网多吗？",
            "gloss": {
              "en": "Are you online a lot?",
              "ko": "평소에 인터넷 많이 하세요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "用得很多。因为我经常看视频，所以每个月都用完了。",
        "gloss": {
          "en": "A lot. I watch videos all the time, so I use it all up every month.",
          "ko": "많이 써요. 동영상을 자주 봐서 매달 다 써 버려요."
        },
        "frames": [
          "zh-f3-09"
        ]
      },
      {
        "who": "them",
        "text": "那我推荐这两个。这个一百二十八块，那个九十八块。",
        "gloss": {
          "en": "Then I'd recommend these two. This one is a hundred and twenty-eight yuan, that one ninety-eight.",
          "ko": "그럼 이 두 개를 추천해요. 이건 백이십팔 위안, 저건 구십팔 위안이에요."
        }
      },
      {
        "who": "me",
        "text": "九十八的比这个便宜，可是流量是不是没有那么多？",
        "gloss": {
          "en": "The ninety-eight one is cheaper than this, but doesn't it have less data?",
          "ko": "구십팔 위안짜리가 이것보다 싸긴 한데, 데이터가 그만큼 많지는 않죠?"
        },
        "frames": [
          "zh-f3-03",
          "zh-f3-04"
        ]
      },
      {
        "who": "them",
        "text": "对，便宜的只有三十个G。",
        "gloss": {
          "en": "Right, the cheaper one only has thirty gigs.",
          "ko": "네, 싼 건 삼십 기가뿐이에요."
        },
        "alt": [
          {
            "text": "是，便宜的流量少一点儿，只有三十个G。",
            "gloss": {
              "en": "Yes, the cheaper one has a bit less data, only thirty gigs.",
              "ko": "네, 싼 건 데이터가 좀 적어서 삼십 기가예요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "三十个G不够。比如说，我每天坐地铁都看一个小时视频。",
        "gloss": {
          "en": "Thirty gigs isn't enough. For example, I watch an hour of videos on the subway every day.",
          "ko": "삼십 기가로는 부족해요. 예를 들면 매일 지하철에서 한 시간씩 동영상을 보거든요."
        }
      },
      {
        "who": "them",
        "text": "好的，那就办贵的这个。另外要签一个两年的合约，还要护照……",
        "gloss": {
          "en": "OK, the pricier one, then. You'll also need to sign a two-year contract, and I need your passport...",
          "ko": "네, 그럼 비싼 걸로 해 드릴게요. 그리고 이 년 약정을 하셔야 하고, 여권도 필요하고…"
        }
      },
      {
        "who": "me",
        "text": "不好意思，我没听清楚。您能说得慢一点儿吗？",
        "gloss": {
          "en": "Sorry, I didn't catch that. Could you speak a bit more slowly?",
          "ko": "죄송해요, 잘 못 들었어요. 조금 천천히 말씀해 주시겠어요?"
        }
      },
      {
        "who": "them",
        "text": "要签两年的合约，还要您的护照。",
        "gloss": {
          "en": "You need to sign a two-year contract, and I need your passport.",
          "ko": "이 년 약정을 하셔야 하고, 여권도 필요해요."
        }
      },
      {
        "who": "me",
        "text": "我同意。请等一下，我把护照拿出来。",
        "gloss": {
          "en": "I agree. Just a moment, I'll take out my passport.",
          "ko": "좋아요. 잠깐만요, 여권 꺼낼게요."
        }
      }
    ]
  },
  {
    "id": "zh-3-4",
    "stage": 3,
    "situation": 3,
    "setting": {
      "en": "Chatting with a friend about a TV drama you're both watching",
      "ko": "친구와 둘 다 보는 드라마 이야기하기"
    },
    "expressions": [
      "听说",
      "你说得对",
      "怪不得",
      "来不及了",
      "看情况",
      "我的意思是"
    ],
    "grammar": [
      3,
      4,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "你最近在看什么剧？",
        "gloss": {
          "en": "What drama are you watching these days?",
          "ko": "요즘 무슨 드라마 봐?"
        },
        "alt": [
          {
            "text": "最近有什么好看的剧吗？",
            "gloss": {
              "en": "Seen any good dramas lately?",
              "ko": "요즘 재밌는 드라마 있어?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "我正在看《长安的春天》呢，已经看了一半了。",
        "gloss": {
          "en": "I'm watching 'Spring in Chang'an' right now — I'm already halfway through.",
          "ko": "지금 '장안의 봄' 보고 있어. 벌써 반이나 봤어."
        },
        "frames": [
          "zh-f3-08"
        ]
      },
      {
        "who": "them",
        "text": "那个剧我也看过！你觉得怎么样？",
        "gloss": {
          "en": "I've seen that one too! What do you think of it?",
          "ko": "그거 나도 봤어! 어때?"
        }
      },
      {
        "who": "me",
        "text": "挺好看的。听说下周就是最后一集了。",
        "gloss": {
          "en": "It's pretty good. I heard the last episode is next week.",
          "ko": "꽤 재밌어. 다음 주가 마지막 회래."
        },
        "frames": [
          "zh-f3-17"
        ]
      },
      {
        "who": "them",
        "text": "对，女主角演得特别好。",
        "gloss": {
          "en": "Yes, the lead actress is really good.",
          "ko": "응, 여주인공 연기가 정말 좋아."
        },
        "alt": [
          {
            "text": "女主角演技真好，对吧？",
            "gloss": {
              "en": "The lead actress is a great actor, right?",
              "ko": "여주인공 연기 진짜 잘하지?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "你说得对，她哭得我也想哭。",
        "gloss": {
          "en": "You're right — when she cries, I want to cry too.",
          "ko": "맞아, 그 사람이 울면 나도 울고 싶어져."
        },
        "frames": [
          "zh-f3-16"
        ]
      },
      {
        "who": "them",
        "text": "其实她以前是歌手。",
        "gloss": {
          "en": "Actually, she used to be a singer.",
          "ko": "사실 그 배우 예전에 가수였어."
        }
      },
      {
        "who": "me",
        "text": "怪不得她唱得那么好听！",
        "gloss": {
          "en": "No wonder she sings so well!",
          "ko": "어쩐지 노래를 그렇게 잘하더라!"
        }
      },
      {
        "who": "them",
        "text": "今天晚上更新，一起看吗？",
        "gloss": {
          "en": "The new episode is out tonight — want to watch together?",
          "ko": "오늘 밤에 새 회 나오는데 같이 볼래?"
        },
        "alt": [
          {
            "text": "今晚要不要一起看新的一集？",
            "gloss": {
              "en": "Want to watch the new episode together tonight?",
              "ko": "오늘 밤에 새 회 같이 볼래?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "我今天要加班，可能来不及了。",
        "gloss": {
          "en": "I have to work late today, so I probably won't make it in time.",
          "ko": "오늘 야근해야 해서 시간 안에 못 갈 것 같아."
        }
      },
      {
        "who": "them",
        "text": "那周末呢？来我家看吧。",
        "gloss": {
          "en": "Then how about the weekend? Come watch it at my place.",
          "ko": "그럼 주말은? 우리 집에 와서 보자."
        }
      },
      {
        "who": "me",
        "text": "看情况吧。我的意思是，如果不加班，我就去。",
        "gloss": {
          "en": "We'll see. I mean, if I don't have to work late, I'll come.",
          "ko": "상황 봐서. 내 말은, 야근 안 하면 갈게."
        }
      }
    ]
  },
  {
    "id": "zh-3-x1",
    "stage": 3,
    "setting": {
      "en": "Rushing to catch a train with a friend",
      "ko": "친구와 기차 시간에 쫓길 때"
    },
    "expressions": [
      "怎么办",
      "算了"
    ],
    "grammar": [
      6,
      7
    ],
    "lines": [
      {
        "who": "them",
        "text": "快点儿！火车还有十分钟就开了。",
        "gloss": {
          "en": "Hurry! The train leaves in ten minutes.",
          "ko": "빨리! 기차 십 분 뒤에 출발해."
        }
      },
      {
        "who": "me",
        "text": "怎么办？我还没把票打印出来。",
        "gloss": {
          "en": "What do we do? I haven't printed the tickets yet.",
          "ko": "어떡해? 아직 표를 안 뽑았어."
        }
      },
      {
        "who": "them",
        "text": "手机上有电子票，不用打印。",
        "gloss": {
          "en": "There are e-tickets on your phone, no need to print.",
          "ko": "휴대폰에 전자표가 있어서 안 뽑아도 돼."
        }
      },
      {
        "who": "me",
        "text": "那太好了。我们现在跑过去，还来得及吗？",
        "gloss": {
          "en": "That's great. If we run there now, will we make it?",
          "ko": "그럼 다행이다. 지금 뛰어가면 늦지 않을까?"
        },
        "frames": [
          "zh-f3-12"
        ]
      },
      {
        "who": "them",
        "text": "来得及。你的咖啡呢？",
        "gloss": {
          "en": "We'll make it. What about your coffee?",
          "ko": "늦지 않아. 네 커피는?"
        }
      },
      {
        "who": "me",
        "text": "算了，不喝了。火车上再买吧。",
        "gloss": {
          "en": "Forget it, I'll skip it. I'll buy one on the train.",
          "ko": "됐어, 안 마실래. 기차에서 사지 뭐."
        }
      }
    ]
  },
  {
    "id": "zh-3-x2",
    "stage": 3,
    "setting": {
      "en": "Deciding what to have for dinner with a friend",
      "ko": "친구와 저녁 메뉴 정하기"
    },
    "expressions": [
      "随便",
      "有什么问题",
      "那倒也是"
    ],
    "grammar": [
      1
    ],
    "lines": [
      {
        "who": "them",
        "text": "晚上吃什么？你决定吧。",
        "gloss": {
          "en": "What shall we have for dinner? You decide.",
          "ko": "저녁에 뭐 먹을까? 네가 정해."
        }
      },
      {
        "who": "me",
        "text": "随便，你选吧。我吃什么都可以。",
        "gloss": {
          "en": "Whatever, you choose. I'm fine with anything.",
          "ko": "아무거나, 네가 골라. 난 다 괜찮아."
        }
      },
      {
        "who": "them",
        "text": "吃火锅吧。可是你昨天说胃不舒服。",
        "gloss": {
          "en": "Let's have hot pot. But you said your stomach was bad yesterday.",
          "ko": "훠궈 먹자. 그런데 너 어제 속이 안 좋다고 했잖아."
        }
      },
      {
        "who": "me",
        "text": "已经好多了。吃火锅有什么问题？",
        "gloss": {
          "en": "It's much better now. What's the problem with hot pot?",
          "ko": "이제 많이 나았어. 훠궈 먹는 게 뭐가 문제야?"
        }
      },
      {
        "who": "them",
        "text": "火锅很辣，对胃不好。",
        "gloss": {
          "en": "Hot pot is spicy, it's bad for your stomach.",
          "ko": "훠궈는 매워서 위에 안 좋아."
        }
      },
      {
        "who": "me",
        "text": "那倒也是。那我们点清汤锅吧，没有那么辣。",
        "gloss": {
          "en": "That's true. Then let's order the clear broth — it's not as spicy.",
          "ko": "그건 그렇네. 그럼 맑은 탕으로 시키자, 그렇게 안 매워."
        },
        "frames": [
          "zh-f3-04"
        ]
      }
    ]
  },
  {
    "id": "zh-4-1",
    "stage": 4,
    "situation": 0,
    "setting": {
      "en": "Leading a team meeting about a delayed app project",
      "ko": "늦어지는 앱 프로젝트를 두고 팀 회의 진행하기"
    },
    "expressions": [
      "首先",
      "问题在于",
      "我能理解",
      "你看怎么样",
      "据我所知",
      "先这样吧",
      "辛苦大家了"
    ],
    "grammar": [
      0,
      1,
      2,
      3
    ],
    "earlierGrammar": [
      "3:0"
    ],
    "lines": [
      {
        "who": "them",
        "text": "大家都到了，我们开始吧。智宇，项目现在进度怎么样？",
        "gloss": {
          "en": "Everyone's here, let's start. Ji-woo, how's the project going?",
          "ko": "다 모였으니 시작합시다. 지우 씨, 프로젝트 진행 상황이 어때요?"
        },
        "alt": [
          {
            "text": "人都齐了。智宇，先说说项目的情况吧。",
            "gloss": {
              "en": "Everyone's here. Ji-woo, tell us where the project stands first.",
              "ko": "다 왔네요. 지우 씨, 먼저 프로젝트 상황부터 말해 줘요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "首先，我要说一个坏消息：上线时间可能要推迟两周。",
        "gloss": {
          "en": "First, some bad news: the launch may have to be pushed back two weeks.",
          "ko": "우선 안 좋은 소식부터 말씀드릴게요. 출시가 이 주 정도 늦어질 것 같아요."
        }
      },
      {
        "who": "them",
        "text": "又推迟？上次不是说没问题吗？",
        "gloss": {
          "en": "Delayed again? Didn't you say last time there was no problem?",
          "ko": "또 미뤄요? 지난번엔 문제없다고 하지 않았어요?"
        }
      },
      {
        "who": "me",
        "text": "问题在于，测试的时候发现了很多bug，而且设计稿被客户改了三次。",
        "gloss": {
          "en": "The problem is that testing turned up a lot of bugs, and the client changed the designs three times.",
          "ko": "문제는 테스트하면서 버그가 많이 나왔고, 디자인 시안도 고객이 세 번이나 바꿨다는 거예요."
        },
        "frames": [
          "zh-f4-12"
        ]
      },
      {
        "who": "them",
        "text": "那也不能一直推迟啊。客户那边怎么交代？",
        "gloss": {
          "en": "We can't keep delaying, though. What do we tell the client?",
          "ko": "그래도 계속 미룰 순 없잖아요. 고객한테는 뭐라고 해요?"
        },
        "alt": [
          {
            "text": "可是客户已经等不及了，我们怎么跟他们解释？",
            "gloss": {
              "en": "But the client is already out of patience — how do we explain it to them?",
              "ko": "하지만 고객이 벌써 못 기다리겠다는데, 어떻게 설명하죠?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "我能理解大家的压力。虽然时间很紧，但是质量不能不管。",
        "gloss": {
          "en": "I understand the pressure everyone's under. Although time is tight, we can't ignore quality.",
          "ko": "다들 부담되는 거 이해해요. 시간이 빠듯하긴 하지만 품질을 놓칠 순 없어요."
        },
        "frames": [
          "zh-f4-01"
        ]
      },
      {
        "who": "them",
        "text": "那你说怎么办？",
        "gloss": {
          "en": "So what do you suggest?",
          "ko": "그럼 어떻게 하자는 거예요?"
        }
      },
      {
        "who": "me",
        "text": "只有再加两个测试人员，我们才能按新的时间完成。你看怎么样？",
        "gloss": {
          "en": "Only if we add two more testers can we finish on the new schedule. What do you think?",
          "ko": "테스트 인원을 두 명 더 넣어야만 새 일정에 맞출 수 있어요. 어떻게 생각하세요?"
        },
        "frames": [
          "zh-f4-05",
          "zh-f4-15"
        ]
      },
      {
        "who": "them",
        "text": "人手的事我得跟上面申请，不见得能批。",
        "gloss": {
          "en": "I'd have to request more staff from upper management; they won't necessarily approve it.",
          "ko": "인력은 위에 요청해야 하는데, 승인될지는 모르겠어요."
        },
        "alt": [
          {
            "text": "加人恐怕不容易，预算已经很紧了。",
            "gloss": {
              "en": "Adding people won't be easy, I'm afraid — the budget's already tight.",
              "ko": "사람 늘리는 건 쉽지 않을 거예요. 예산이 이미 빠듯해서요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "据我所知，隔壁组下个月就有两个人空出来。",
        "gloss": {
          "en": "As far as I know, two people on the team next door will be free next month.",
          "ko": "제가 알기로는 옆 팀에서 다음 달에 두 명이 비어요."
        },
        "frames": [
          "zh-f4-14"
        ]
      },
      {
        "who": "them",
        "text": "这倒是个办法。可是他们熟悉我们的系统吗？",
        "gloss": {
          "en": "That's one option. But do they know our system?",
          "ko": "그것도 방법이네요. 그런데 그 사람들이 우리 시스템을 알아요?"
        }
      },
      {
        "who": "me",
        "text": "他们不但熟悉，而且上个季度还帮我们做过测试。",
        "gloss": {
          "en": "Not only do they know it, they also did testing for us last quarter.",
          "ko": "알 뿐만 아니라 지난 분기에 우리 테스트도 도와줬어요."
        },
        "frames": [
          "zh-f4-02"
        ]
      },
      {
        "who": "them",
        "text": "好，那就这么定了。",
        "gloss": {
          "en": "OK, then it's settled.",
          "ko": "좋아요, 그럼 그렇게 합시다."
        }
      },
      {
        "who": "me",
        "text": "好，先这样吧。辛苦大家了！",
        "gloss": {
          "en": "OK, let's leave it there for now. Thanks for all your hard work, everyone!",
          "ko": "네, 일단 이렇게 하죠. 다들 수고 많으셨어요!"
        }
      }
    ]
  },
  {
    "id": "zh-4-2",
    "stage": 4,
    "situation": 1,
    "setting": {
      "en": "Debating working from home with friends over dinner",
      "ko": "저녁 먹으며 친구들과 재택근무 토론하기"
    },
    "expressions": [
      "我不太同意",
      "不见得",
      "话虽如此",
      "另一方面",
      "有道理",
      "关键是",
      "换句话说",
      "值得一试"
    ],
    "grammar": [
      3,
      4,
      6
    ],
    "lines": [
      {
        "who": "them",
        "text": "我觉得在家工作最好，不用挤地铁。",
        "gloss": {
          "en": "I think working from home is best — no squeezing onto the subway.",
          "ko": "난 재택근무가 최고라고 생각해. 지옥철 안 타도 되잖아."
        },
        "alt": [
          {
            "text": "在家上班多舒服啊，你说是不是？",
            "gloss": {
              "en": "Working from home is so comfortable, don't you think?",
              "ko": "집에서 일하면 얼마나 편해, 안 그래?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "我不太同意。在家工作不见得效率更高。",
        "gloss": {
          "en": "I don't really agree. Working from home isn't necessarily more efficient.",
          "ko": "난 별로 동의 안 해. 재택이 꼭 효율이 더 높은 건 아니야."
        },
        "frames": [
          "zh-f4-10",
          "zh-f4-13"
        ]
      },
      {
        "who": "them",
        "text": "为什么？在家多安静啊。",
        "gloss": {
          "en": "Why not? It's so quiet at home.",
          "ko": "왜? 집은 조용하잖아."
        }
      },
      {
        "who": "me",
        "text": "话虽如此，可是在家很容易分心。另一方面，跟同事沟通也不方便。",
        "gloss": {
          "en": "That may be so, but it's easy to get distracted at home. On the other hand, it's harder to communicate with colleagues.",
          "ko": "그렇긴 한데 집에서는 딴짓하기 쉬워. 다른 한편으로는 동료랑 소통하기도 불편하고."
        },
        "frames": [
          "zh-f4-11"
        ]
      },
      {
        "who": "them",
        "text": "难道视频会议不够用吗？",
        "gloss": {
          "en": "Surely video calls are enough?",
          "ko": "설마 화상 회의로 부족하다는 거야?"
        },
        "alt": [
          {
            "text": "现在有视频会议，沟通有什么问题？",
            "gloss": {
              "en": "We have video calls now — what's the problem with communication?",
              "ko": "요즘 화상 회의 있는데 소통이 뭐가 문제야?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "难道开个视频会议就能解决所有问题吗？很多小事当面说更快。",
        "gloss": {
          "en": "Do you really think a video call solves everything? Lots of little things are quicker face to face.",
          "ko": "화상 회의 한 번이면 모든 게 해결된다는 거야? 사소한 건 얼굴 보고 말하는 게 훨씬 빨라."
        },
        "frames": [
          "zh-f4-06"
        ]
      },
      {
        "who": "them",
        "text": "可是有些公司做得挺好的啊。",
        "gloss": {
          "en": "But some companies do it really well.",
          "ko": "그래도 잘하는 회사들도 있잖아."
        }
      },
      {
        "who": "me",
        "text": "有道理。关键是公司要有好的管理制度。",
        "gloss": {
          "en": "Fair point. The key is that the company needs a good management system.",
          "ko": "일리 있어. 핵심은 회사에 좋은 관리 제도가 있어야 한다는 거야."
        },
        "frames": [
          "zh-f4-16"
        ]
      },
      {
        "who": "them",
        "text": "对，只要管理好，在家工作就没问题。",
        "gloss": {
          "en": "Right, as long as it's managed well, working from home is fine.",
          "ko": "맞아, 관리만 잘되면 재택근무도 문제없어."
        }
      },
      {
        "who": "me",
        "text": "换句话说，问题不在地点，而在管理。",
        "gloss": {
          "en": "In other words, the problem isn't the place, it's the management.",
          "ko": "다시 말해 문제는 장소가 아니라 관리라는 거지."
        },
        "frames": [
          "zh-f4-19"
        ]
      },
      {
        "who": "them",
        "text": "我突然想起来，我们公司下个月要试行一周两天在家办公。",
        "gloss": {
          "en": "That reminds me — my company is trialling two days a week from home next month.",
          "ko": "갑자기 생각났는데, 우리 회사 다음 달부터 일주일에 이틀 재택을 시범으로 해."
        },
        "alt": [
          {
            "text": "对了，我们公司正好要试两天在家办公。",
            "gloss": {
              "en": "Oh, actually, my company is about to try two days from home.",
              "ko": "아 참, 우리 회사가 마침 이틀 재택을 해 본대."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "那值得一试。只要大家都习惯了，就能看出效果。",
        "gloss": {
          "en": "Then it's worth a try. As long as everyone gets used to it, you'll be able to see whether it works.",
          "ko": "그럼 해 볼 만하네. 다들 익숙해지기만 하면 효과가 보일 거야."
        },
        "frames": [
          "zh-f4-04"
        ]
      },
      {
        "who": "them",
        "text": "你们公司呢？",
        "gloss": {
          "en": "What about your company?",
          "ko": "너희 회사는?"
        }
      },
      {
        "who": "me",
        "text": "既然我们老板那么喜欢开会，就别指望了。",
        "gloss": {
          "en": "Since our boss loves meetings so much, I wouldn't count on it.",
          "ko": "우리 사장님이 회의를 그렇게 좋아하시니 기대도 안 해."
        },
        "frames": [
          "zh-f4-09"
        ]
      }
    ]
  },
  {
    "id": "zh-4-3",
    "stage": 4,
    "situation": 2,
    "setting": {
      "en": "Calling customer service about a late delivery",
      "ko": "배송 지연으로 고객센터에 전화하기"
    },
    "expressions": [
      "按理说",
      "这不合理",
      "说到底",
      "总的来说"
    ],
    "grammar": [
      0,
      2,
      3,
      4
    ],
    "lines": [
      {
        "who": "them",
        "text": "您好，这里是客服中心，请问有什么可以帮您？",
        "gloss": {
          "en": "Hello, this is customer service. How can I help you?",
          "ko": "안녕하세요, 고객센터입니다. 무엇을 도와드릴까요?"
        },
        "alt": [
          {
            "text": "您好，很高兴为您服务，请问您遇到了什么问题？",
            "gloss": {
              "en": "Hello, happy to help. What problem have you run into?",
              "ko": "안녕하세요, 무슨 문제가 있으신가요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "你好，我十天前买的空气净化器到现在还没到。",
        "gloss": {
          "en": "Hello, the air purifier I bought ten days ago still hasn't arrived.",
          "ko": "안녕하세요, 열흘 전에 산 공기청정기가 아직도 안 왔어요."
        }
      },
      {
        "who": "them",
        "text": "请您提供一下订单号。",
        "gloss": {
          "en": "Could you give me the order number, please?",
          "ko": "주문 번호를 알려 주시겠어요?"
        }
      },
      {
        "who": "me",
        "text": "订单号我发在聊天框里了。按理说三天就应该到了。",
        "gloss": {
          "en": "I've sent the order number in the chat. By rights it should have arrived in three days.",
          "ko": "주문 번호는 채팅창에 보냈어요. 원래대로라면 사흘이면 왔어야 하잖아요."
        },
        "frames": [
          "zh-f4-18"
        ]
      },
      {
        "who": "them",
        "text": "我查了一下，您的包裹被送到了别的城市。",
        "gloss": {
          "en": "I've checked: your parcel was delivered to a different city.",
          "ko": "확인해 보니 고객님 택배가 다른 도시로 배송됐네요."
        },
        "alt": [
          {
            "text": "系统显示您的包裹被转到了外地的仓库。",
            "gloss": {
              "en": "The system shows your parcel was sent to a warehouse in another city.",
              "ko": "시스템상 택배가 다른 지역 창고로 넘어갔다고 나와요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "被送到别的城市？这不合理。难道你们没有检查地址吗？",
        "gloss": {
          "en": "Sent to another city? That's unreasonable. Didn't you even check the address?",
          "ko": "다른 도시로요? 이건 말이 안 돼요. 주소 확인도 안 하셨어요?"
        },
        "frames": [
          "zh-f4-06"
        ]
      },
      {
        "who": "them",
        "text": "非常抱歉，这是我们的失误。我们会尽快重新发货。",
        "gloss": {
          "en": "We're very sorry, it was our mistake. We'll resend it as soon as possible.",
          "ko": "정말 죄송합니다. 저희 실수예요. 최대한 빨리 다시 보내 드릴게요."
        }
      },
      {
        "who": "me",
        "text": "虽然你们道歉了，但是我已经白等了十天了。",
        "gloss": {
          "en": "Although you've apologised, I've still waited ten days for nothing.",
          "ko": "사과는 하셨지만 저는 벌써 열흘을 헛되이 기다렸어요."
        },
        "frames": [
          "zh-f4-01"
        ]
      },
      {
        "who": "them",
        "text": "我能理解您的心情。我们可以送您一张五十元的优惠券。",
        "gloss": {
          "en": "I understand how you feel. We can give you a fifty-yuan coupon.",
          "ko": "고객님 마음 이해합니다. 오십 위안 쿠폰을 드릴 수 있어요."
        }
      },
      {
        "who": "me",
        "text": "说到底，我要的不是优惠券，是我的东西。",
        "gloss": {
          "en": "At the end of the day, what I want isn't a coupon, it's my order.",
          "ko": "결국 제가 원하는 건 쿠폰이 아니라 제 물건이에요."
        },
        "frames": [
          "zh-f4-20"
        ]
      },
      {
        "who": "them",
        "text": "明白。我们保证三天之内送到。",
        "gloss": {
          "en": "Understood. We guarantee delivery within three days.",
          "ko": "알겠습니다. 사흘 안에 꼭 도착하도록 하겠습니다."
        },
        "alt": [
          {
            "text": "好的，我们会用最快的方式，三天内一定送到。",
            "gloss": {
              "en": "Sure, we'll use the fastest shipping — it will definitely arrive within three days.",
              "ko": "네, 가장 빠른 방법으로 사흘 안에 꼭 보내 드리겠습니다."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "只要三天之内能送到，我就接受。",
        "gloss": {
          "en": "As long as it arrives within three days, I'll accept that.",
          "ko": "사흘 안에만 오면 받아들일게요."
        },
        "frames": [
          "zh-f4-04"
        ]
      },
      {
        "who": "them",
        "text": "好的，还有别的问题吗？",
        "gloss": {
          "en": "All right, is there anything else?",
          "ko": "네, 다른 문의 사항 있으세요?"
        }
      },
      {
        "who": "me",
        "text": "总的来说，我希望以后不再发生这种事。谢谢。",
        "gloss": {
          "en": "All in all, I hope this doesn't happen again. Thank you.",
          "ko": "전체적으로 앞으로 이런 일이 다시 없었으면 좋겠어요. 감사합니다."
        },
        "frames": [
          "zh-f4-17"
        ]
      }
    ]
  },
  {
    "id": "zh-4-4",
    "stage": 4,
    "situation": 3,
    "setting": {
      "en": "Talking with a coworker about a viral rescue video",
      "ko": "동료와 화제가 된 구조 영상 이야기하기"
    },
    "expressions": [
      "不见得",
      "据我所知",
      "这倒是",
      "话虽如此"
    ],
    "grammar": [
      1,
      2,
      3,
      5,
      6
    ],
    "earlierGrammar": [
      "3:7"
    ],
    "lines": [
      {
        "who": "them",
        "text": "你看了那个外卖小哥救人的视频吗？",
        "gloss": {
          "en": "Have you seen that video of the delivery guy saving someone?",
          "ko": "그 배달 기사가 사람 구한 영상 봤어요?"
        },
        "alt": [
          {
            "text": "那个外卖员救小孩的视频你刷到了吗？",
            "gloss": {
              "en": "Did that video of the delivery rider saving a kid show up in your feed?",
              "ko": "배달원이 아이 구한 영상 피드에 떴어요?"
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "看了！那个视频不但被转发了几百万次，而且还上了新闻。",
        "gloss": {
          "en": "I did! Not only was it shared millions of times, it even made the news.",
          "ko": "봤어요! 수백만 번 공유됐을 뿐 아니라 뉴스에도 나왔어요."
        },
        "frames": [
          "zh-f4-02"
        ]
      },
      {
        "who": "them",
        "text": "有人说是摆拍的。",
        "gloss": {
          "en": "Some people say it was staged.",
          "ko": "연출이라고 하는 사람도 있던데요."
        }
      },
      {
        "who": "me",
        "text": "不见得吧。据我所知，当地警察已经证实了。",
        "gloss": {
          "en": "Not necessarily. As far as I know, the local police have confirmed it.",
          "ko": "꼭 그렇진 않을걸요. 제가 알기로는 현지 경찰이 이미 사실이라고 확인했어요."
        },
        "frames": [
          "zh-f4-13",
          "zh-f4-14"
        ]
      },
      {
        "who": "them",
        "text": "可是现在网上的视频真真假假的。",
        "gloss": {
          "en": "But online videos these days are a mix of real and fake.",
          "ko": "근데 요즘 인터넷 영상은 진짜인지 가짜인지 모르잖아요."
        },
        "alt": [
          {
            "text": "现在的视频很多都是假的，谁知道呢。",
            "gloss": {
              "en": "Lots of videos are fake these days — who knows.",
              "ko": "요즘 영상은 가짜가 많아서 누가 알겠어요."
            }
          }
        ]
      },
      {
        "who": "me",
        "text": "这倒是。既然大家都不确定，就别急着下结论。",
        "gloss": {
          "en": "That's true. Since nobody's sure, let's not rush to conclusions.",
          "ko": "그건 그래요. 다들 확실하지 않으니 성급하게 결론 내리지 말죠."
        },
        "frames": [
          "zh-f4-09"
        ]
      },
      {
        "who": "them",
        "text": "他说他当时什么都没想就跳下去了。",
        "gloss": {
          "en": "He said he didn't think at all, he just jumped in.",
          "ko": "그 사람은 그때 아무 생각 없이 뛰어들었대요."
        }
      },
      {
        "who": "me",
        "text": "你这么一说，我想起来了，去年也有一个类似的新闻。",
        "gloss": {
          "en": "Now that you say that, I remember — there was a similar story last year.",
          "ko": "그 말 들으니 생각나네요. 작년에도 비슷한 뉴스가 있었어요."
        },
        "frames": [
          "zh-f4-07"
        ]
      },
      {
        "who": "them",
        "text": "对对，后来那个人还被公司奖励了。",
        "gloss": {
          "en": "Yes, yes — and that person was later rewarded by his company.",
          "ko": "맞아요, 나중에 그 사람 회사에서 포상도 받았죠."
        }
      },
      {
        "who": "me",
        "text": "只有这样的事多被宣传，社会风气才会越来越好。",
        "gloss": {
          "en": "Only if stories like this get publicised more will society get better and better.",
          "ko": "이런 일이 더 많이 알려져야 사회 분위기도 점점 좋아질 거예요."
        },
        "frames": [
          "zh-f4-05"
        ]
      },
      {
        "who": "them",
        "text": "不过评论区吵得很厉害，你看了吗？",
        "gloss": {
          "en": "But the comments section is a war zone — did you see?",
          "ko": "근데 댓글 창이 엄청 시끄럽던데, 봤어요?"
        }
      },
      {
        "who": "me",
        "text": "看了几条就看不下去了，太多人只会骂。",
        "gloss": {
          "en": "I read a few and couldn't go on — too many people just insult others.",
          "ko": "몇 개 보다가 더는 못 보겠더라고요. 욕만 하는 사람이 너무 많아서요."
        },
        "frames": [
          "zh-f4-08"
        ]
      },
      {
        "who": "them",
        "text": "哈哈，网上就是这样。",
        "gloss": {
          "en": "Haha, that's the internet for you.",
          "ko": "하하, 인터넷이 원래 그렇죠."
        }
      },
      {
        "who": "me",
        "text": "话虽如此，那个小哥还是真了不起。",
        "gloss": {
          "en": "Even so, that guy is truly amazing.",
          "ko": "그렇긴 해도 그 기사님은 정말 대단해요."
        },
        "frames": [
          "zh-f4-11"
        ]
      }
    ]
  },
  {
    "id": "zh-5-1",
    "stage": 5,
    "situation": 0,
    "setting": {
      "en": "A business dinner with Mr Wang, the head of a partner company",
      "ko": "협력사 왕 대표와의 비즈니스 식사"
    },
    "goal": {
      "en": "Return the toasts gracefully, accept praise modestly, and decline more drinks without making your host lose face.",
      "ko": "건배에 예의 있게 답하고, 칭찬은 겸손하게 받으며, 상대 체면을 지키면서 술을 더 사양한다."
    },
    "expressions": [
      "我先干为敬",
      "哪里哪里",
      "不敢当",
      "见外了",
      "恭敬不如从命",
      "改天再约"
    ],
    "grammar": [
      0,
      2,
      3,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "智宇，欢迎欢迎！来，我先敬你一杯。",
        "gloss": {
          "en": "Ji-woo, welcome, welcome! Come, let me toast you first.",
          "ko": "지우 씨, 어서 와요! 자, 내가 먼저 한 잔 권하죠."
        }
      },
      {
        "who": "me",
        "text": "王总太客气了。我是晚辈，应该我敬您。我先干为敬！",
        "gloss": {
          "en": "You're too kind, Mr Wang. I'm the junior here, I should toast you. I'll drain my glass first as a sign of respect!",
          "ko": "왕 대표님, 너무 겸손하세요. 제가 후배니까 제가 올려야죠. 제가 먼저 비우겠습니다!"
        }
      },
      {
        "who": "them",
        "text": "好酒量！听说这次的方案是你一个人做的？",
        "gloss": {
          "en": "You can hold your drink! I heard you did this proposal all by yourself?",
          "ko": "주량이 대단하네! 이번 기획안은 혼자 만들었다면서요?"
        }
      },
      {
        "who": "me",
        "text": "哪里哪里，不敢当。方案是整个团队熬了好几个通宵才做出来的。",
        "gloss": {
          "en": "Oh, not at all, I can't take the credit. The whole team pulled several all-nighters to produce it.",
          "ko": "아이고 아닙니다, 과찬이세요. 기획안은 팀 전체가 며칠 밤을 새워서 만든 거예요."
        },
        "frames": [
          "zh-f5-07"
        ]
      },
      {
        "who": "them",
        "text": "年轻人还挺谦虚。来，尝尝这道菜，是我们这儿的特色。",
        "gloss": {
          "en": "Modest for a young man. Here, try this dish — it's our local specialty.",
          "ko": "젊은 사람이 겸손하네. 자, 이 요리 좀 먹어 봐요. 여기 명물이에요."
        }
      },
      {
        "who": "me",
        "text": "好，我尝尝。嗯，色香味俱全，真是名不虚传。",
        "gloss": {
          "en": "Sure, let me try. Mm, it looks, smells and tastes perfect — it really lives up to its reputation.",
          "ko": "네, 맛볼게요. 음, 색깔·향·맛 다 훌륭하네요. 정말 명성 그대로예요."
        },
        "frames": [
          "zh-f5-12"
        ]
      },
      {
        "who": "them",
        "text": "再来一杯！今天不醉不归！",
        "gloss": {
          "en": "Another glass! Tonight we don't leave until we're drunk!",
          "ko": "한 잔 더! 오늘은 취할 때까지 마십시다!"
        }
      },
      {
        "who": "me",
        "text": "王总，我恐怕不能再喝了，明天一早还要赶飞机。",
        "gloss": {
          "en": "Mr Wang, I'm afraid I can't drink any more — I have an early flight tomorrow.",
          "ko": "대표님, 저는 더는 못 마실 것 같습니다. 내일 아침 일찍 비행기를 타야 해서요."
        },
        "frames": [
          "zh-f5-08"
        ]
      },
      {
        "who": "them",
        "text": "哎，这是不给我面子啊！",
        "gloss": {
          "en": "Oh come on, you're not doing me the honour!",
          "ko": "에이, 내 체면을 안 세워 주는 거네!"
        }
      },
      {
        "who": "me",
        "text": "您这话就见外了。这样吧，我以茶代酒，再敬您一杯。",
        "gloss": {
          "en": "Now you're treating me like a stranger. How about this — I'll toast you again with tea instead of wine.",
          "ko": "그런 말씀 마세요, 섭섭합니다. 이렇게 하죠, 술 대신 차로 한 잔 더 올리겠습니다."
        }
      },
      {
        "who": "them",
        "text": "好吧，那就喝茶。合作的事，你看下一步怎么安排？",
        "gloss": {
          "en": "All right, tea it is. As for our cooperation, how do you see the next step?",
          "ko": "좋아요, 그럼 차로 하죠. 협력 건은 다음 단계를 어떻게 하면 좋겠어요?"
        }
      },
      {
        "who": "me",
        "text": "鉴于双方都很有诚意，我建议下周先让技术团队碰个头，以便尽快确定细节。",
        "gloss": {
          "en": "Given that both sides are sincere, I suggest our technical teams meet next week so we can settle the details as soon as possible.",
          "ko": "양측 모두 의지가 있으니, 다음 주에 먼저 기술팀끼리 만나서 세부 사항을 빨리 정하는 게 좋겠습니다."
        },
        "frames": [
          "zh-f5-01",
          "zh-f5-02"
        ]
      },
      {
        "who": "them",
        "text": "好，就这么办。下次来北京，我带你去尝尝正宗的烤鸭。",
        "gloss": {
          "en": "Good, let's do that. Next time you're in Beijing, I'll take you for authentic roast duck.",
          "ko": "좋아요, 그렇게 합시다. 다음에 베이징 오면 정통 오리구이 먹으러 데려갈게요."
        }
      },
      {
        "who": "me",
        "text": "那我就恭敬不如从命了。到时候一定好好尝尝。",
        "gloss": {
          "en": "Then I'd better accept rather than stand on ceremony. I'll be sure to enjoy it.",
          "ko": "그럼 사양하지 않고 따르겠습니다. 그때 꼭 제대로 맛보겠습니다."
        }
      },
      {
        "who": "them",
        "text": "今天就到这儿吧，路上小心。",
        "gloss": {
          "en": "Let's call it a night. Get home safely.",
          "ko": "오늘은 여기까지 합시다. 조심히 들어가요."
        }
      },
      {
        "who": "me",
        "text": "谢谢王总款待，改天再约！",
        "gloss": {
          "en": "Thank you for your hospitality, Mr Wang. Let's meet again another day!",
          "ko": "대표님, 대접 감사합니다. 다음에 또 뵙겠습니다!"
        }
      }
    ]
  },
  {
    "id": "zh-5-2",
    "stage": 5,
    "situation": 1,
    "setting": {
      "en": "A friend asks you to translate a long contract for free by Friday",
      "ko": "친구가 긴 계약서를 금요일까지 무료로 번역해 달라고 부탁함"
    },
    "goal": {
      "en": "Turn down the full request honestly but warmly, steer your friend toward a better option, and offer a smaller kind of help.",
      "ko": "부탁 전체는 솔직하지만 따뜻하게 거절하고, 더 나은 방법을 권하며, 작은 도움은 해 주겠다고 한다."
    },
    "expressions": [
      "说白了",
      "这事儿不好办",
      "心里没底",
      "打个比方",
      "拿不准",
      "我尽量吧",
      "开个玩笑"
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
        "text": "智宇，帮我个忙呗？我们公司有份五十页的合同，周五前要翻成韩语。",
        "gloss": {
          "en": "Ji-woo, could you do me a favour? My company has a fifty-page contract that needs translating into Korean by Friday.",
          "ko": "지우야, 부탁 하나만 들어줄래? 우리 회사에 오십 쪽짜리 계약서가 있는데 금요일까지 한국어로 번역해야 해."
        }
      },
      {
        "who": "me",
        "text": "五十页？周五前？说白了，这事儿不好办啊。",
        "gloss": {
          "en": "Fifty pages? By Friday? To be blunt, that's a tough one.",
          "ko": "오십 쪽? 금요일까지? 솔직히 말해서 이건 좀 어려워."
        },
        "frames": [
          "zh-f5-15",
          "zh-f5-16"
        ]
      },
      {
        "who": "them",
        "text": "你中文那么好，这点儿事对你来说不算什么吧？",
        "gloss": {
          "en": "Your Chinese is so good — this is nothing for you, right?",
          "ko": "너 중국어 그렇게 잘하잖아. 이 정도는 일도 아니지?"
        }
      },
      {
        "who": "me",
        "text": "你太高看我了。法律合同我心里没底，翻错了可不是闹着玩的。",
        "gloss": {
          "en": "You think too highly of me. I'm not confident with legal contracts, and a mistranslation is no joke.",
          "ko": "날 너무 높게 봐 주는 거야. 법률 계약서는 자신이 없고, 잘못 번역하면 장난이 아니야."
        },
        "frames": [
          "zh-f5-17"
        ]
      },
      {
        "who": "them",
        "text": "哪怕你只翻一部分也行啊，帮帮忙嘛。",
        "gloss": {
          "en": "Even if you only translate part of it, that'd be fine. Come on, help me out.",
          "ko": "일부만 번역해 줘도 돼. 좀 도와줘."
        }
      },
      {
        "who": "me",
        "text": "不是我不想帮。即使我每天熬夜，也未必能翻完。",
        "gloss": {
          "en": "It's not that I don't want to help. Even if I stayed up every night, I might not finish.",
          "ko": "돕기 싫어서가 아니야. 매일 밤을 새워도 다 못 할 수도 있어."
        },
        "frames": [
          "zh-f5-04",
          "zh-f5-10"
        ]
      },
      {
        "who": "them",
        "text": "唉，那我怎么办？",
        "gloss": {
          "en": "Sigh, so what do I do?",
          "ko": "아휴, 그럼 나 어떡해?"
        }
      },
      {
        "who": "me",
        "text": "你不妨找个专业的翻译公司，他们连法律术语都很熟。",
        "gloss": {
          "en": "You might as well try a professional translation agency — they even know the legal terms well.",
          "ko": "전문 번역 회사에 맡겨 보는 것도 괜찮아. 거기는 법률 용어까지 잘 알거든."
        },
        "frames": [
          "zh-f5-09",
          "zh-f5-06"
        ]
      },
      {
        "who": "them",
        "text": "翻译公司太贵了，而且我跟他们不熟。",
        "gloss": {
          "en": "Agencies are too expensive, and I don't know any.",
          "ko": "번역 회사는 너무 비싸고, 아는 데도 없어."
        }
      },
      {
        "who": "me",
        "text": "打个比方吧，你会让一个刚拿驾照的人帮你开长途吗？",
        "gloss": {
          "en": "Let me put it this way: would you let someone who just got their licence drive you on a long trip?",
          "ko": "비유를 하나 들어 볼게. 면허 막 딴 사람한테 장거리 운전을 맡기겠어?"
        },
        "frames": [
          "zh-f5-19"
        ]
      },
      {
        "who": "them",
        "text": "哈哈，好吧，你说得也有道理。",
        "gloss": {
          "en": "Haha, OK, you have a point.",
          "ko": "하하, 알았어, 네 말도 일리가 있다."
        }
      },
      {
        "who": "me",
        "text": "这样，等你找好翻译，我帮你看看最重要的那几页。",
        "gloss": {
          "en": "Here's what: once you've found a translator, I'll look over the most important pages for you.",
          "ko": "이렇게 하자. 번역가를 구하면 내가 제일 중요한 몇 쪽은 봐 줄게."
        },
        "frames": [
          "zh-f5-14"
        ]
      },
      {
        "who": "them",
        "text": "真的？那太好了！",
        "gloss": {
          "en": "Really? That'd be great!",
          "ko": "정말? 그럼 너무 좋지!"
        }
      },
      {
        "who": "me",
        "text": "不过我只能晚上看，能看多少我也拿不准，我尽量吧。",
        "gloss": {
          "en": "But I can only do it in the evenings, and I'm not sure how much I can get through. I'll do my best.",
          "ko": "근데 저녁에만 볼 수 있어서 얼마나 볼 수 있을지 장담은 못 해. 최대한 해 볼게."
        }
      },
      {
        "who": "them",
        "text": "没事，你能帮忙我就很感激了。",
        "gloss": {
          "en": "That's fine, I'm grateful you're helping at all.",
          "ko": "괜찮아, 도와주는 것만으로도 정말 고마워."
        }
      },
      {
        "who": "me",
        "text": "咱俩谁跟谁啊。改天你请我吃顿饭就行——开个玩笑啦。",
        "gloss": {
          "en": "Come on, we're close. Just treat me to a meal sometime — I'm kidding.",
          "ko": "우리 사이에 뭘. 언제 밥이나 한 끼 사 — 농담이야."
        }
      }
    ]
  },
  {
    "id": "zh-5-3",
    "stage": 5,
    "situation": 2,
    "setting": {
      "en": "Negotiating contract terms with a supplier's sales manager",
      "ko": "공급업체 영업 담당자와 계약 조건 협상하기"
    },
    "goal": {
      "en": "Get a lower price and a shorter first contract while keeping the partner on good terms.",
      "ko": "관계를 해치지 않으면서 가격을 낮추고 첫 계약 기간을 짧게 받아 낸다."
    },
    "expressions": [
      "心里没底",
      "走一步看一步",
      "给个面子"
    ],
    "grammar": [
      0,
      1,
      2,
      4,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "关于报价，我们已经是最低价了，恐怕没有再降的空间。",
        "gloss": {
          "en": "As for the quote, this is already our lowest price; I'm afraid there's no room to go lower.",
          "ko": "견적은 이미 최저가라서, 더 내릴 여지는 없을 것 같습니다."
        }
      },
      {
        "who": "me",
        "text": "我理解。不过这个价格比别家高了百分之十，我们回去也很难交代。",
        "gloss": {
          "en": "I understand. But this is ten percent higher than other suppliers; it would be hard for us to justify internally.",
          "ko": "이해합니다. 다만 다른 곳보다 십 퍼센트 비싸서 저희도 회사에 설명하기가 어렵습니다."
        }
      },
      {
        "who": "them",
        "text": "我们的质量您也知道，连大品牌都在用我们的零件。",
        "gloss": {
          "en": "You know our quality — even the big brands use our parts.",
          "ko": "저희 품질은 아시잖아요. 대형 브랜드들도 저희 부품을 씁니다."
        }
      },
      {
        "who": "me",
        "text": "质量确实没得说。鉴于我们是第一次合作，能不能先签一年，从而降低双方的风险？",
        "gloss": {
          "en": "The quality is beyond question. Given that this is our first partnership, could we sign for one year first, thereby reducing the risk for both sides?",
          "ko": "품질은 정말 나무랄 데가 없죠. 다만 처음 협력하는 만큼 우선 일 년만 계약해서 양측 위험을 줄이면 어떨까요?"
        },
        "frames": [
          "zh-f5-01",
          "zh-f5-03"
        ]
      },
      {
        "who": "them",
        "text": "一年太短了，我们一般都签三年。",
        "gloss": {
          "en": "One year is too short; we usually sign for three.",
          "ko": "일 년은 너무 짧아요. 저희는 보통 삼 년 계약합니다."
        }
      },
      {
        "who": "me",
        "text": "三年的话，我们心里没底。不如先签一年，走一步看一步。",
        "gloss": {
          "en": "With three years, we don't feel confident. Better to sign for one year first and take it step by step.",
          "ko": "삼 년이면 저희가 확신이 없어서요. 일단 일 년 하고 차차 보는 게 낫겠습니다."
        },
        "frames": [
          "zh-f5-17",
          "zh-f5-18"
        ]
      },
      {
        "who": "them",
        "text": "那价格方面呢？",
        "gloss": {
          "en": "And what about the price?",
          "ko": "그럼 가격은요?"
        }
      },
      {
        "who": "me",
        "text": "价格上您给个面子，降五个点，我们保证明年的订单量只多不少。",
        "gloss": {
          "en": "Do us a favour on price — five points off — and we guarantee next year's orders will only go up.",
          "ko": "가격은 저희 체면 좀 세워 주세요. 오 퍼센트만 내려 주시면 내년 주문량은 늘면 늘었지 줄진 않을 겁니다."
        }
      },
      {
        "who": "them",
        "text": "五个点太多了，最多三个点。",
        "gloss": {
          "en": "Five points is too much; three at most.",
          "ko": "오 퍼센트는 너무 많아요. 많아야 삼 퍼센트예요."
        }
      },
      {
        "who": "me",
        "text": "三个点也行，但付款期得从三十天改成六十天。",
        "gloss": {
          "en": "Three points is fine, but the payment term would need to change from thirty days to sixty.",
          "ko": "삼 퍼센트도 좋습니다. 대신 결제 기한을 삼십 일에서 육십 일로 바꿔야 합니다."
        }
      },
      {
        "who": "them",
        "text": "六十天恐怕不行，财务那边不会同意的。",
        "gloss": {
          "en": "Sixty days probably won't work; our finance department won't agree.",
          "ko": "육십 일은 어려울 것 같아요. 재무팀에서 동의하지 않을 거예요."
        }
      },
      {
        "who": "me",
        "text": "那四十五天呢？咱们各让一步，皆大欢喜。",
        "gloss": {
          "en": "Then how about forty-five days? We each give a little and everyone's happy.",
          "ko": "그럼 사십오 일은요? 서로 한 발씩 양보하면 모두 좋잖아요."
        }
      },
      {
        "who": "them",
        "text": "这个嘛……我得回去跟老板商量商量。",
        "gloss": {
          "en": "Well... I'll need to go back and talk it over with my boss.",
          "ko": "그건… 돌아가서 사장님과 상의해 봐야겠네요."
        }
      },
      {
        "who": "me",
        "text": "没问题，您先商量商量，我们等您的好消息。",
        "gloss": {
          "en": "No problem, talk it over and we'll wait for your good news.",
          "ko": "물론이죠, 상의해 보시고 좋은 소식 기다리겠습니다."
        }
      },
      {
        "who": "them",
        "text": "今天谈得挺顺利的。",
        "gloss": {
          "en": "Today's talks went quite smoothly.",
          "ko": "오늘 협상은 꽤 순조로웠네요."
        }
      },
      {
        "who": "me",
        "text": "是啊。即使还有些分歧，我们也是很有诚意的。",
        "gloss": {
          "en": "Yes. Even if there are still some differences, we really are sincere about this.",
          "ko": "네. 아직 이견이 좀 있더라도 저희는 정말 진심입니다."
        },
        "frames": [
          "zh-f5-04"
        ]
      }
    ]
  },
  {
    "id": "zh-5-4",
    "stage": 5,
    "situation": 3,
    "setting": {
      "en": "Joking around with friends in a group chat about your cooking",
      "ko": "단체 채팅방에서 내 요리 실력을 두고 농담 주고받기"
    },
    "goal": {
      "en": "Laugh at your own cooking, tease back without offending anyone, and get the group to agree on a meet-up.",
      "ko": "내 요리 실력을 스스로 웃음거리로 삼고, 기분 상하지 않게 받아치며, 모임 날짜를 정하게 한다."
    },
    "expressions": [
      "一言难尽",
      "没什么大不了",
      "开个玩笑",
      "凑合",
      "不在话下",
      "有两下子",
      "走一步看一步"
    ],
    "grammar": [
      1,
      2,
      5
    ],
    "lines": [
      {
        "who": "them",
        "text": "智宇，听说你周末去学做饭了？厨艺怎么样？",
        "gloss": {
          "en": "Ji-woo, I heard you took a cooking class at the weekend? How are your cooking skills?",
          "ko": "지우, 주말에 요리 배우러 갔다며? 요리 실력은 좀 어때?"
        }
      },
      {
        "who": "me",
        "text": "一言难尽啊。连煮个面都差点儿把厨房烧了。",
        "gloss": {
          "en": "It's a long story. I nearly set the kitchen on fire just boiling noodles.",
          "ko": "말하자면 길어. 라면 하나 끓이다가 부엌 태울 뻔했어."
        },
        "frames": [
          "zh-f5-06"
        ]
      },
      {
        "who": "them",
        "text": "哈哈哈！那你还敢请我们吃饭吗？",
        "gloss": {
          "en": "Hahaha! Do you still dare to invite us for dinner?",
          "ko": "하하하! 그래도 우리한테 밥 해 준다고 할 수 있어?"
        }
      },
      {
        "who": "me",
        "text": "有什么不敢的？吃坏了肚子也没什么大不了的嘛。开个玩笑。",
        "gloss": {
          "en": "Why not? Even if you get a stomach ache, it's no big deal. Just kidding.",
          "ko": "못 할 게 뭐 있어? 배탈 좀 나도 별일 아니잖아. 농담이야."
        },
        "frames": [
          "zh-f5-20"
        ]
      },
      {
        "who": "them",
        "text": "我可不去，我还想多活几年。小李，你去不去？",
        "gloss": {
          "en": "I'm not going, I'd like to live a few more years. Xiao Li, are you going?",
          "ko": "난 안 가, 좀 더 오래 살고 싶거든. 샤오리, 너는 갈 거야?"
        }
      },
      {
        "who": "me",
        "text": "小李上次还说我做的蛋炒饭凑合呢。",
        "gloss": {
          "en": "Last time Xiao Li said my egg fried rice was passable.",
          "ko": "샤오리는 지난번에 내가 만든 계란볶음밥이 그럭저럭 먹을 만하다고 했는데."
        }
      },
      {
        "who": "them",
        "text": "小李：我那是给你面子好不好！",
        "gloss": {
          "en": "Xiao Li: I was just being polite, OK!",
          "ko": "샤오리: 그건 체면 세워 준 거거든!"
        }
      },
      {
        "who": "me",
        "text": "好吧好吧，我承认，炒饭这种事对你来说才是不在话下。",
        "gloss": {
          "en": "OK, OK, I admit it — fried rice is a piece of cake for you, not me.",
          "ko": "알았어, 알았어. 인정할게. 볶음밥 같은 건 너한테나 식은 죽 먹기지."
        }
      },
      {
        "who": "them",
        "text": "那当然，我做饭可是有两下子的。",
        "gloss": {
          "en": "Of course, I know my way around a kitchen.",
          "ko": "당연하지, 나 요리 좀 하거든."
        }
      },
      {
        "who": "me",
        "text": "对对对，你有两下子。那下次你掌勺，我负责洗碗。",
        "gloss": {
          "en": "Yes, yes, you've got skills. So next time you cook and I'll do the dishes.",
          "ko": "맞아 맞아, 너 실력 있어. 그럼 다음엔 네가 요리하고 내가 설거지 맡을게."
        }
      },
      {
        "who": "them",
        "text": "成交！哪天？",
        "gloss": {
          "en": "Deal! Which day?",
          "ko": "콜! 언제?"
        }
      },
      {
        "who": "me",
        "text": "哪怕只有三个人，我们也要聚一聚。周六怎么样？",
        "gloss": {
          "en": "Even if it's only three of us, we should get together. How about Saturday?",
          "ko": "세 명만 모여도 꼭 한번 보자. 토요일 어때?"
        },
        "frames": [
          "zh-f5-05"
        ]
      },
      {
        "who": "them",
        "text": "周六我可能加班，现在还说不好。",
        "gloss": {
          "en": "I might have to work on Saturday, I can't say yet.",
          "ko": "토요일엔 야근할 수도 있어서 아직 모르겠어."
        }
      },
      {
        "who": "me",
        "text": "那就走一步看一步，周五再定。",
        "gloss": {
          "en": "Then let's play it by ear and decide on Friday.",
          "ko": "그럼 상황 봐 가면서 금요일에 다시 정하자."
        },
        "frames": [
          "zh-f5-18"
        ]
      },
      {
        "who": "them",
        "text": "行，到时候群里说。",
        "gloss": {
          "en": "OK, we'll sort it out in the group then.",
          "ko": "좋아, 그때 단톡방에서 얘기하자."
        }
      },
      {
        "who": "me",
        "text": "好嘞，大家先想想吃什么，别到时候又说随便。",
        "gloss": {
          "en": "Great, everyone think about what to eat, and don't just say 'whatever' when the time comes.",
          "ko": "좋아, 다들 뭐 먹을지 미리 생각해 둬. 그때 가서 또 아무거나라고 하지 말고."
        }
      }
    ]
  }
];
