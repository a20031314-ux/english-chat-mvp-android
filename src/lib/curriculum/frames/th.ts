import type { Frame } from "../frames.ts";

/** 태국어 1~5단계 틀(curriculum/frames.ts) — 기능 id(fn)는 curriculum/functions.ts. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
export const TH_FRAMES: Frame[] = [
  {
    "id": "th-f1-01",
    "stage": 1,
    "fn": "introduce",
    "pattern": "ผมชื่อ___ครับ",
    "core": [
      "ผมชื่อ",
      "ฉันชื่อ"
    ],
    "meaning": {
      "en": "Saying your name: My name is ___.",
      "ko": "이름 말하기: 제 이름은 ___예요."
    },
    "grammar": [
      1,
      2
    ],
    "expressions": [
      "ยินดีที่ได้รู้จัก"
    ],
    "examples": [
      {
        "text": "ผมชื่อมินจุนครับ",
        "slot": "มินจุน",
        "cue": {
          "en": "Min-jun (your name)",
          "ko": "민준(내 이름)"
        },
        "gloss": {
          "en": "My name is Min-jun.",
          "ko": "제 이름은 민준이에요."
        }
      },
      {
        "text": "สวัสดีครับ ผมชื่อเดวิดครับ",
        "slot": "เดวิด",
        "cue": {
          "en": "David",
          "ko": "데이비드"
        },
        "gloss": {
          "en": "Hello, my name is David.",
          "ko": "안녕하세요, 제 이름은 데이비드예요."
        }
      },
      {
        "text": "ฉันชื่อมินจีค่ะ",
        "slot": "มินจี",
        "cue": {
          "en": "Min-ji (a woman speaking)",
          "ko": "민지(여성 화자)"
        },
        "gloss": {
          "en": "My name is Min-ji.",
          "ko": "제 이름은 민지예요."
        }
      },
      {
        "text": "ผมชื่อโทมัสครับ ยินดีที่ได้รู้จักครับ",
        "slot": "โทมัส",
        "cue": {
          "en": "Thomas",
          "ko": "토마스"
        },
        "gloss": {
          "en": "My name is Thomas. Nice to meet you.",
          "ko": "저는 토마스예요. 만나서 반가워요."
        }
      }
    ]
  },
  {
    "id": "th-f1-02",
    "stage": 1,
    "fn": "origin",
    "pattern": "ผมมาจาก___ครับ",
    "core": [
      "มาจาก"
    ],
    "meaning": {
      "en": "Saying where you are from: I'm from ___.",
      "ko": "출신 말하기: 저는 ___에서 왔어요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ผมมาจากเกาหลีครับ",
        "slot": "เกาหลี",
        "cue": {
          "en": "Korea",
          "ko": "한국"
        },
        "gloss": {
          "en": "I'm from Korea.",
          "ko": "저는 한국에서 왔어요."
        }
      },
      {
        "text": "ผมมาจากโซลครับ",
        "slot": "โซล",
        "cue": {
          "en": "Seoul",
          "ko": "서울"
        },
        "gloss": {
          "en": "I'm from Seoul.",
          "ko": "저는 서울에서 왔어요."
        }
      },
      {
        "text": "ฉันมาจากญี่ปุ่นค่ะ",
        "slot": "ญี่ปุ่น",
        "cue": {
          "en": "Japan (a woman speaking)",
          "ko": "일본(여성 화자)"
        },
        "gloss": {
          "en": "I'm from Japan.",
          "ko": "저는 일본에서 왔어요."
        }
      },
      {
        "text": "ผมมาจากปูซาน ประเทศเกาหลีครับ",
        "slot": "ปูซาน",
        "cue": {
          "en": "Busan",
          "ko": "부산"
        },
        "gloss": {
          "en": "I'm from Busan, in Korea.",
          "ko": "저는 한국 부산에서 왔어요."
        }
      }
    ]
  },
  {
    "id": "th-f1-03",
    "stage": 1,
    "fn": "job",
    "pattern": "ผมเป็น___ครับ",
    "core": [
      "ผมเป็น",
      "ฉันเป็น"
    ],
    "meaning": {
      "en": "Saying what you are: I am a ___.",
      "ko": "하는 일 말하기: 저는 ___예요."
    },
    "grammar": [
      0,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ผมเป็นนักเรียนครับ",
        "slot": "นักเรียน",
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
        "text": "ผมเป็นพนักงานบริษัทครับ",
        "slot": "พนักงานบริษัท",
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
        "text": "ฉันเป็นครูค่ะ",
        "slot": "ครู",
        "cue": {
          "en": "teacher (a woman speaking)",
          "ko": "선생님(여성 화자)"
        },
        "gloss": {
          "en": "I'm a teacher.",
          "ko": "저는 선생님이에요."
        }
      },
      {
        "text": "ผมเป็นหมอครับ",
        "slot": "หมอ",
        "cue": {
          "en": "doctor",
          "ko": "의사"
        },
        "gloss": {
          "en": "I'm a doctor.",
          "ko": "저는 의사예요."
        }
      }
    ]
  },
  {
    "id": "th-f1-04",
    "stage": 1,
    "fn": "ask-what",
    "pattern": "___คืออะไรครับ",
    "core": [
      "คืออะไร"
    ],
    "meaning": {
      "en": "Asking what something is: What is ___?",
      "ko": "무엇인지 묻기: ___은/는 뭐예요?"
    },
    "grammar": [
      5,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ทุเรียนคืออะไรครับ",
        "slot": "ทุเรียน",
        "cue": {
          "en": "durian",
          "ko": "두리안"
        },
        "gloss": {
          "en": "What is durian?",
          "ko": "두리안이 뭐예요?"
        }
      },
      {
        "text": "ส้มตำคืออะไรครับ",
        "slot": "ส้มตำ",
        "cue": {
          "en": "som tam (papaya salad)",
          "ko": "쏨땀(파파야 샐러드)"
        },
        "gloss": {
          "en": "What is som tam?",
          "ko": "쏨땀이 뭐예요?"
        }
      },
      {
        "text": "คำนี้คืออะไรครับ",
        "slot": "คำนี้",
        "cue": {
          "en": "this word",
          "ko": "이 단어"
        },
        "gloss": {
          "en": "What is this word?",
          "ko": "이 단어는 뭐예요?"
        }
      },
      {
        "text": "ผลไม้นี้คืออะไรครับ",
        "slot": "ผลไม้นี้",
        "cue": {
          "en": "this fruit",
          "ko": "이 과일"
        },
        "gloss": {
          "en": "What is this fruit?",
          "ko": "이 과일은 뭐예요?"
        }
      }
    ]
  },
  {
    "id": "th-f1-05",
    "stage": 1,
    "fn": "ask-where",
    "pattern": "___อยู่ที่ไหนครับ",
    "core": [
      "อยู่ที่ไหน"
    ],
    "meaning": {
      "en": "Asking where something is: Where is ___?",
      "ko": "어디 있는지 묻기: ___은/는 어디 있어요?"
    },
    "grammar": [
      5,
      6,
      2
    ],
    "expressions": [
      "ห้องน้ำอยู่ที่ไหน"
    ],
    "examples": [
      {
        "text": "ห้องน้ำอยู่ที่ไหนครับ",
        "slot": "ห้องน้ำ",
        "cue": {
          "en": "the toilet",
          "ko": "화장실"
        },
        "gloss": {
          "en": "Where is the toilet?",
          "ko": "화장실이 어디 있어요?"
        }
      },
      {
        "text": "ลิฟต์อยู่ที่ไหนครับ",
        "slot": "ลิฟต์",
        "cue": {
          "en": "the lift",
          "ko": "엘리베이터"
        },
        "gloss": {
          "en": "Where is the lift?",
          "ko": "엘리베이터가 어디 있어요?"
        }
      },
      {
        "text": "สถานีรถไฟฟ้าอยู่ที่ไหนครับ",
        "slot": "สถานีรถไฟฟ้า",
        "cue": {
          "en": "the Skytrain station",
          "ko": "지상철역"
        },
        "gloss": {
          "en": "Where is the Skytrain station?",
          "ko": "지상철역이 어디 있어요?"
        }
      },
      {
        "text": "ร้านกาแฟอยู่ที่ไหนคะ",
        "slot": "ร้านกาแฟ",
        "cue": {
          "en": "the café (a woman speaking)",
          "ko": "카페(여성 화자)"
        },
        "gloss": {
          "en": "Where is the café?",
          "ko": "카페가 어디 있어요?"
        }
      }
    ]
  },
  {
    "id": "th-f1-06",
    "stage": 1,
    "fn": "location-now",
    "pattern": "ผมอยู่ที่___ครับ",
    "core": [
      "อยู่ที่"
    ],
    "meaning": {
      "en": "Saying where you or something is: I'm at ___.",
      "ko": "있는 곳 말하기: 저는 ___에 있어요."
    },
    "grammar": [
      6,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ผมอยู่ที่ตลาดครับ",
        "slot": "ตลาด",
        "cue": {
          "en": "the market",
          "ko": "시장"
        },
        "gloss": {
          "en": "I'm at the market.",
          "ko": "저는 시장에 있어요."
        }
      },
      {
        "text": "ตอนนี้ผมอยู่ที่โรงแรมครับ",
        "slot": "โรงแรม",
        "cue": {
          "en": "the hotel",
          "ko": "호텔"
        },
        "gloss": {
          "en": "I'm at the hotel now.",
          "ko": "지금 호텔에 있어요."
        }
      },
      {
        "text": "ผมอยู่ที่ชั้นสองครับ",
        "slot": "ชั้นสอง",
        "cue": {
          "en": "the second floor",
          "ko": "이 층"
        },
        "gloss": {
          "en": "I'm on the second floor.",
          "ko": "저는 이 층에 있어요."
        }
      },
      {
        "text": "บ้านผมอยู่ที่โซลครับ",
        "slot": "โซล",
        "cue": {
          "en": "Seoul",
          "ko": "서울"
        },
        "gloss": {
          "en": "My home is in Seoul.",
          "ko": "우리 집은 서울에 있어요."
        }
      }
    ]
  },
  {
    "id": "th-f1-07",
    "stage": 1,
    "fn": "ask-price",
    "pattern": "___เท่าไรครับ",
    "core": [
      "เท่าไร"
    ],
    "meaning": {
      "en": "Asking the price: How much is ___?",
      "ko": "값 묻기: ___ 얼마예요?"
    },
    "grammar": [
      2
    ],
    "expressions": [
      "เท่าไร"
    ],
    "examples": [
      {
        "text": "มะม่วงกิโลละเท่าไรครับ",
        "slot": "มะม่วง",
        "cue": {
          "en": "mangoes (per kilo)",
          "ko": "망고(킬로당)"
        },
        "gloss": {
          "en": "How much are the mangoes a kilo?",
          "ko": "망고 1킬로에 얼마예요?"
        }
      },
      {
        "text": "อันนี้เท่าไรครับ",
        "slot": "อันนี้",
        "cue": {
          "en": "this one",
          "ko": "이거"
        },
        "gloss": {
          "en": "How much is this one?",
          "ko": "이거 얼마예요?"
        }
      },
      {
        "text": "ส้มโอลูกละเท่าไรครับ",
        "slot": "ส้มโอ",
        "cue": {
          "en": "pomelos (each)",
          "ko": "포멜로(한 개에)"
        },
        "gloss": {
          "en": "How much is one pomelo?",
          "ko": "포멜로 한 개에 얼마예요?"
        }
      },
      {
        "text": "ทั้งหมดเท่าไรคะ",
        "slot": "ทั้งหมด",
        "cue": {
          "en": "all of it (a woman speaking)",
          "ko": "전부(여성 화자)"
        },
        "gloss": {
          "en": "How much is it altogether?",
          "ko": "전부 얼마예요?"
        }
      }
    ]
  },
  {
    "id": "th-f1-08",
    "stage": 1,
    "fn": "request-thing",
    "pattern": "ขอ___ครับ",
    "core": [
      "ขอ"
    ],
    "meaning": {
      "en": "Asking for something: May I have ___?",
      "ko": "달라고 하기: ___ 주세요."
    },
    "grammar": [
      7,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ขอน้ำเปล่าหนึ่งขวดครับ",
        "slot": "น้ำเปล่าหนึ่งขวด",
        "cue": {
          "en": "a bottle of water",
          "ko": "물 한 병"
        },
        "gloss": {
          "en": "A bottle of water, please.",
          "ko": "물 한 병 주세요."
        }
      },
      {
        "text": "ขอเมนูครับ",
        "slot": "เมนู",
        "cue": {
          "en": "the menu",
          "ko": "메뉴판"
        },
        "gloss": {
          "en": "The menu, please.",
          "ko": "메뉴판 주세요."
        }
      },
      {
        "text": "ขอถุงหนึ่งใบครับ",
        "slot": "ถุงหนึ่งใบ",
        "cue": {
          "en": "a bag",
          "ko": "봉지 하나"
        },
        "gloss": {
          "en": "A bag, please.",
          "ko": "봉지 하나 주세요."
        }
      },
      {
        "text": "ขอใบเสร็จด้วยค่ะ",
        "slot": "ใบเสร็จ",
        "cue": {
          "en": "the receipt (a woman speaking)",
          "ko": "영수증(여성 화자)"
        },
        "gloss": {
          "en": "The receipt too, please.",
          "ko": "영수증도 주세요."
        }
      }
    ]
  },
  {
    "id": "th-f1-09",
    "stage": 1,
    "fn": "ask-have",
    "pattern": "มี___ไหมครับ",
    "core": [
      "ไหม"
    ],
    "meaning": {
      "en": "Asking if there is ___: Do you have ___?",
      "ko": "있는지 묻기: ___ 있어요?"
    },
    "grammar": [
      3,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "มีมังคุดไหมครับ",
        "slot": "มังคุด",
        "cue": {
          "en": "mangosteens",
          "ko": "망고스틴"
        },
        "gloss": {
          "en": "Do you have mangosteens?",
          "ko": "망고스틴 있어요?"
        }
      },
      {
        "text": "มีถุงไหมครับ",
        "slot": "ถุง",
        "cue": {
          "en": "a bag",
          "ko": "봉지"
        },
        "gloss": {
          "en": "Do you have a bag?",
          "ko": "봉지 있어요?"
        }
      },
      {
        "text": "มีไวไฟไหมครับ",
        "slot": "ไวไฟ",
        "cue": {
          "en": "Wi-Fi",
          "ko": "와이파이"
        },
        "gloss": {
          "en": "Is there Wi-Fi?",
          "ko": "와이파이 있어요?"
        }
      },
      {
        "text": "มีห้องว่างไหมคะ",
        "slot": "ห้องว่าง",
        "cue": {
          "en": "a free room (a woman speaking)",
          "ko": "빈방(여성 화자)"
        },
        "gloss": {
          "en": "Do you have a free room?",
          "ko": "빈방 있어요?"
        }
      }
    ]
  },
  {
    "id": "th-f1-10",
    "stage": 1,
    "fn": "yes-no",
    "pattern": "ไม่___ครับ",
    "core": [
      "ไม่"
    ],
    "meaning": {
      "en": "Saying no: It's not ___.",
      "ko": "아니라고 답하기: ___ 아니에요/안 ___요."
    },
    "grammar": [
      4,
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ไม่เผ็ดครับ",
        "slot": "เผ็ด",
        "cue": {
          "en": "spicy",
          "ko": "맵다"
        },
        "gloss": {
          "en": "It's not spicy.",
          "ko": "안 매워요."
        }
      },
      {
        "text": "ไม่ใช่ครับ",
        "slot": "ใช่",
        "cue": {
          "en": "that's right (ใช่)",
          "ko": "맞다(ใช่)"
        },
        "gloss": {
          "en": "No, that's not right.",
          "ko": "아니에요."
        }
      },
      {
        "text": "ไม่แพงครับ",
        "slot": "แพง",
        "cue": {
          "en": "expensive",
          "ko": "비싸다"
        },
        "gloss": {
          "en": "It's not expensive.",
          "ko": "안 비싸요."
        }
      },
      {
        "text": "ไม่หวานค่ะ",
        "slot": "หวาน",
        "cue": {
          "en": "sweet (a woman speaking)",
          "ko": "달다(여성 화자)"
        },
        "gloss": {
          "en": "It's not sweet.",
          "ko": "안 달아요."
        }
      }
    ]
  },
  {
    "id": "th-f1-11",
    "stage": 1,
    "fn": "not-understand",
    "pattern": "ผมไม่เข้าใจ___ครับ",
    "core": [
      "ไม่เข้าใจ"
    ],
    "meaning": {
      "en": "Saying you don't understand ___.",
      "ko": "모르겠다고 말하기: ___을/를 이해 못 했어요."
    },
    "grammar": [
      4,
      2
    ],
    "expressions": [
      "ไม่เข้าใจ"
    ],
    "examples": [
      {
        "text": "ขอโทษครับ ผมไม่เข้าใจคำนี้",
        "slot": "คำนี้",
        "cue": {
          "en": "this word",
          "ko": "이 단어"
        },
        "gloss": {
          "en": "Sorry, I don't understand this word.",
          "ko": "죄송해요, 이 단어를 모르겠어요."
        }
      },
      {
        "text": "ผมไม่เข้าใจคำถามครับ",
        "slot": "คำถาม",
        "cue": {
          "en": "the question",
          "ko": "질문"
        },
        "gloss": {
          "en": "I don't understand the question.",
          "ko": "질문을 이해 못 했어요."
        }
      },
      {
        "text": "ผมไม่เข้าใจป้ายนี้ครับ",
        "slot": "ป้ายนี้",
        "cue": {
          "en": "this sign",
          "ko": "이 표지판"
        },
        "gloss": {
          "en": "I don't understand this sign.",
          "ko": "이 표지판을 모르겠어요."
        }
      },
      {
        "text": "ฉันไม่เข้าใจเมนูนี้ค่ะ",
        "slot": "เมนูนี้",
        "cue": {
          "en": "this menu (a woman speaking)",
          "ko": "이 메뉴(여성 화자)"
        },
        "gloss": {
          "en": "I don't understand this menu.",
          "ko": "이 메뉴를 모르겠어요."
        }
      }
    ]
  },
  {
    "id": "th-f1-12",
    "stage": 1,
    "fn": "request-action",
    "pattern": "___ได้ไหมครับ",
    "core": [
      "ได้ไหม"
    ],
    "meaning": {
      "en": "Asking if someone can do something: Could you ___?",
      "ko": "해 달라고 부탁하기: ___ 해 주실 수 있어요?"
    },
    "grammar": [
      3,
      2
    ],
    "expressions": [
      "พูดช้าๆ หน่อย",
      "อีกครั้ง",
      "ลดได้ไหม"
    ],
    "examples": [
      {
        "text": "พูดช้าๆ หน่อยได้ไหมครับ",
        "slot": "พูดช้าๆ หน่อย",
        "cue": {
          "en": "speak a bit slowly",
          "ko": "좀 천천히 말하다"
        },
        "gloss": {
          "en": "Could you speak a bit slowly?",
          "ko": "좀 천천히 말해 주실 수 있어요?"
        }
      },
      {
        "text": "พูดอีกครั้งได้ไหมครับ",
        "slot": "พูดอีกครั้ง",
        "cue": {
          "en": "say it again",
          "ko": "다시 말하다"
        },
        "gloss": {
          "en": "Could you say it again?",
          "ko": "다시 말해 주실 수 있어요?"
        }
      },
      {
        "text": "ลดได้ไหมครับ",
        "slot": "ลด",
        "cue": {
          "en": "lower (the price)",
          "ko": "깎다"
        },
        "gloss": {
          "en": "Can you lower the price?",
          "ko": "깎아 주실 수 있어요?"
        }
      },
      {
        "text": "เขียนให้ดูได้ไหมคะ",
        "slot": "เขียนให้ดู",
        "cue": {
          "en": "write it down for me (a woman speaking)",
          "ko": "써서 보여 주다(여성 화자)"
        },
        "gloss": {
          "en": "Could you write it down for me?",
          "ko": "써서 보여 주실 수 있어요?"
        }
      }
    ]
  },
  {
    "id": "th-f1-13",
    "stage": 1,
    "fn": "want",
    "pattern": "เอา___ครับ",
    "core": [
      "เอา"
    ],
    "meaning": {
      "en": "Choosing what you want: I'll take ___.",
      "ko": "원하는 것 말하기: ___(으)로 할게요."
    },
    "grammar": [
      2
    ],
    "expressions": [
      "เอาอันนี้"
    ],
    "examples": [
      {
        "text": "เอาอันนี้ครับ",
        "slot": "อันนี้",
        "cue": {
          "en": "this one",
          "ko": "이거"
        },
        "gloss": {
          "en": "I'll take this one.",
          "ko": "이걸로 할게요."
        }
      },
      {
        "text": "เอาสองกิโลครับ",
        "slot": "สองกิโล",
        "cue": {
          "en": "two kilos",
          "ko": "2킬로"
        },
        "gloss": {
          "en": "I'll take two kilos.",
          "ko": "2킬로 주세요."
        }
      },
      {
        "text": "เอามะม่วงครับ",
        "slot": "มะม่วง",
        "cue": {
          "en": "mangoes",
          "ko": "망고"
        },
        "gloss": {
          "en": "I'll take the mangoes.",
          "ko": "망고로 할게요."
        }
      },
      {
        "text": "เอาลูกใหญ่ค่ะ",
        "slot": "ลูกใหญ่",
        "cue": {
          "en": "the big ones (a woman speaking)",
          "ko": "큰 거(여성 화자)"
        },
        "gloss": {
          "en": "I'll take the big ones.",
          "ko": "큰 걸로 할게요."
        }
      }
    ]
  },
  {
    "id": "th-f1-14",
    "stage": 1,
    "fn": "thank",
    "pattern": "ขอบคุณสำหรับ___ครับ",
    "core": [
      "ขอบคุณ"
    ],
    "meaning": {
      "en": "Thanking: Thank you for ___.",
      "ko": "고마움 말하기: ___ 고마워요."
    },
    "grammar": [
      2
    ],
    "expressions": [
      "ขอบคุณ"
    ],
    "examples": [
      {
        "text": "ขอบคุณสำหรับทุกอย่างครับ",
        "slot": "ทุกอย่าง",
        "cue": {
          "en": "everything",
          "ko": "모든 것"
        },
        "gloss": {
          "en": "Thank you for everything.",
          "ko": "여러 가지로 고마워요."
        }
      },
      {
        "text": "ขอบคุณสำหรับความช่วยเหลือครับ",
        "slot": "ความช่วยเหลือ",
        "cue": {
          "en": "your help",
          "ko": "도와준 것"
        },
        "gloss": {
          "en": "Thank you for your help.",
          "ko": "도와줘서 고마워요."
        }
      },
      {
        "text": "ขอบคุณสำหรับกาแฟครับ",
        "slot": "กาแฟ",
        "cue": {
          "en": "the coffee",
          "ko": "커피"
        },
        "gloss": {
          "en": "Thank you for the coffee.",
          "ko": "커피 고마워요."
        }
      },
      {
        "text": "ขอบคุณสำหรับวันนี้ค่ะ",
        "slot": "วันนี้",
        "cue": {
          "en": "today (a woman speaking)",
          "ko": "오늘(여성 화자)"
        },
        "gloss": {
          "en": "Thank you for today.",
          "ko": "오늘 고마웠어요."
        }
      }
    ]
  },
  {
    "id": "th-f1-15",
    "stage": 1,
    "fn": "greet",
    "pattern": "สวัสดีครับ ___",
    "core": [
      "สวัสดี"
    ],
    "meaning": {
      "en": "Greeting someone: Hello, ___.",
      "ko": "인사하기: 안녕하세요, ___."
    },
    "grammar": [
      2
    ],
    "expressions": [
      "สวัสดี"
    ],
    "examples": [
      {
        "text": "สวัสดีครับ คุณนิด",
        "slot": "คุณนิด",
        "cue": {
          "en": "Ms. Nid",
          "ko": "닛 씨"
        },
        "gloss": {
          "en": "Hello, Nid.",
          "ko": "안녕하세요, 닛 씨."
        }
      },
      {
        "text": "สวัสดีครับ คุณครู",
        "slot": "คุณครู",
        "cue": {
          "en": "teacher",
          "ko": "선생님"
        },
        "gloss": {
          "en": "Hello, teacher.",
          "ko": "안녕하세요, 선생님."
        }
      },
      {
        "text": "สวัสดีค่ะ พี่แอน",
        "slot": "พี่แอน",
        "cue": {
          "en": "Ann (older, a woman speaking)",
          "ko": "앤 언니(여성 화자)"
        },
        "gloss": {
          "en": "Hello, Ann.",
          "ko": "안녕하세요, 앤 언니."
        }
      },
      {
        "text": "สวัสดีครับ ทุกคน",
        "slot": "ทุกคน",
        "cue": {
          "en": "everyone",
          "ko": "여러분"
        },
        "gloss": {
          "en": "Hello, everyone.",
          "ko": "안녕하세요, 여러분."
        }
      }
    ]
  },
  {
    "id": "th-f1-16",
    "stage": 1,
    "fn": "ask-what",
    "pattern": "___ชื่ออะไรครับ",
    "core": [
      "ชื่ออะไร"
    ],
    "meaning": {
      "en": "Asking a name: What is ___ called?",
      "ko": "이름 묻기: ___ 이름이 뭐예요?"
    },
    "grammar": [
      1,
      5,
      2
    ],
    "expressions": [
      "ชื่ออะไร"
    ],
    "examples": [
      {
        "text": "คุณชื่ออะไรครับ",
        "slot": "คุณ",
        "cue": {
          "en": "you",
          "ko": "당신"
        },
        "gloss": {
          "en": "What's your name?",
          "ko": "이름이 뭐예요?"
        }
      },
      {
        "text": "ร้านนี้ชื่ออะไรครับ",
        "slot": "ร้านนี้",
        "cue": {
          "en": "this shop",
          "ko": "이 가게"
        },
        "gloss": {
          "en": "What's this shop called?",
          "ko": "이 가게 이름이 뭐예요?"
        }
      },
      {
        "text": "ผลไม้นี้ชื่ออะไรครับ",
        "slot": "ผลไม้นี้",
        "cue": {
          "en": "this fruit",
          "ko": "이 과일"
        },
        "gloss": {
          "en": "What's this fruit called?",
          "ko": "이 과일 이름이 뭐예요?"
        }
      },
      {
        "text": "ครูชื่ออะไรคะ",
        "slot": "ครู",
        "cue": {
          "en": "the teacher (a woman speaking)",
          "ko": "선생님(여성 화자)"
        },
        "gloss": {
          "en": "What's the teacher's name?",
          "ko": "선생님 이름이 뭐예요?"
        }
      }
    ]
  },
  {
    "id": "th-f2-01",
    "stage": 2,
    "fn": "past-did",
    "pattern": "ผม___แล้วครับ",
    "core": [
      "แล้ว"
    ],
    "meaning": {
      "en": "Saying something is already done: I've already ___.",
      "ko": "한 일 말하기: 벌써 ___했어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ผมกินข้าวแล้วครับ",
        "slot": "กินข้าว",
        "cue": {
          "en": "eat",
          "ko": "밥을 먹다"
        },
        "gloss": {
          "en": "I've already eaten.",
          "ko": "밥 먹었어요."
        }
      },
      {
        "text": "ผมจ่ายเงินแล้วครับ",
        "slot": "จ่ายเงิน",
        "cue": {
          "en": "pay",
          "ko": "돈을 내다"
        },
        "gloss": {
          "en": "I've already paid.",
          "ko": "이미 돈 냈어요."
        }
      },
      {
        "text": "ผมกินยาแล้วครับ",
        "slot": "กินยา",
        "cue": {
          "en": "take the medicine",
          "ko": "약을 먹다"
        },
        "gloss": {
          "en": "I've already taken the medicine.",
          "ko": "약 먹었어요."
        }
      },
      {
        "text": "ฉันถึงบ้านแล้วค่ะ",
        "slot": "ถึงบ้าน",
        "cue": {
          "en": "get home (a woman speaking)",
          "ko": "집에 도착하다(여성 화자)"
        },
        "gloss": {
          "en": "I'm home now.",
          "ko": "집에 도착했어요."
        }
      }
    ]
  },
  {
    "id": "th-f2-02",
    "stage": 2,
    "fn": "future-plan",
    "pattern": "พรุ่งนี้ผมจะ___ครับ",
    "core": [
      "จะ"
    ],
    "meaning": {
      "en": "Saying what you will do: Tomorrow I'll ___.",
      "ko": "할 일 말하기: 내일 ___할 거예요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "พรุ่งนี้ผมจะไปเชียงใหม่ครับ",
        "slot": "ไปเชียงใหม่",
        "cue": {
          "en": "go to Chiang Mai",
          "ko": "치앙마이에 가다"
        },
        "gloss": {
          "en": "Tomorrow I'll go to Chiang Mai.",
          "ko": "내일 치앙마이에 갈 거예요."
        }
      },
      {
        "text": "พรุ่งนี้ผมจะไปทำงานครับ",
        "slot": "ไปทำงาน",
        "cue": {
          "en": "go to work",
          "ko": "출근하다"
        },
        "gloss": {
          "en": "Tomorrow I'll go to work.",
          "ko": "내일 출근할 거예요."
        }
      },
      {
        "text": "พรุ่งนี้ผมจะไปหาหมอครับ",
        "slot": "ไปหาหมอ",
        "cue": {
          "en": "see a doctor",
          "ko": "병원에 가다"
        },
        "gloss": {
          "en": "Tomorrow I'll see a doctor.",
          "ko": "내일 병원에 갈 거예요."
        }
      },
      {
        "text": "พรุ่งนี้ฉันจะอยู่บ้านค่ะ",
        "slot": "อยู่บ้าน",
        "cue": {
          "en": "stay home (a woman speaking)",
          "ko": "집에 있다(여성 화자)"
        },
        "gloss": {
          "en": "Tomorrow I'll stay home.",
          "ko": "내일은 집에 있을 거예요."
        }
      }
    ]
  },
  {
    "id": "th-f2-03",
    "stage": 2,
    "fn": "ongoing",
    "pattern": "ผมกำลัง___อยู่ครับ",
    "core": [
      "กำลัง"
    ],
    "meaning": {
      "en": "Saying what you're doing now: I'm ___ right now.",
      "ko": "지금 하고 있는 일 말하기: 지금 ___하고 있어요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ผมกำลังกินข้าวอยู่ครับ",
        "slot": "กินข้าว",
        "cue": {
          "en": "eat",
          "ko": "밥을 먹다"
        },
        "gloss": {
          "en": "I'm eating right now.",
          "ko": "지금 밥 먹고 있어요."
        }
      },
      {
        "text": "ผมกำลังทำงานอยู่ครับ",
        "slot": "ทำงาน",
        "cue": {
          "en": "work",
          "ko": "일하다"
        },
        "gloss": {
          "en": "I'm working right now.",
          "ko": "지금 일하고 있어요."
        }
      },
      {
        "text": "ผมกำลังรออยู่หน้าร้านครับ",
        "slot": "รอ",
        "cue": {
          "en": "wait (in front of the shop)",
          "ko": "(가게 앞에서) 기다리다"
        },
        "gloss": {
          "en": "I'm waiting in front of the shop.",
          "ko": "가게 앞에서 기다리고 있어요."
        }
      },
      {
        "text": "ฉันกำลังดูหนังอยู่ค่ะ",
        "slot": "ดูหนัง",
        "cue": {
          "en": "watch a film (a woman speaking)",
          "ko": "영화를 보다(여성 화자)"
        },
        "gloss": {
          "en": "I'm watching a film.",
          "ko": "지금 영화 보고 있어요."
        }
      }
    ]
  },
  {
    "id": "th-f2-04",
    "stage": 2,
    "fn": "want",
    "pattern": "ผมอยาก___ครับ",
    "core": [
      "อยาก"
    ],
    "meaning": {
      "en": "Saying what you want to do: I want to ___.",
      "ko": "원하는 것 말하기: ___하고 싶어요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ผมอยากไปทะเลครับ",
        "slot": "ไปทะเล",
        "cue": {
          "en": "go to the sea",
          "ko": "바다에 가다"
        },
        "gloss": {
          "en": "I want to go to the sea.",
          "ko": "바다에 가고 싶어요."
        }
      },
      {
        "text": "ผมอยากกินส้มตำครับ",
        "slot": "กินส้มตำ",
        "cue": {
          "en": "eat som tam",
          "ko": "쏨땀을 먹다"
        },
        "gloss": {
          "en": "I want to eat som tam.",
          "ko": "쏨땀 먹고 싶어요."
        }
      },
      {
        "text": "ผมอยากลองอาหารใต้ครับ",
        "slot": "ลองอาหารใต้",
        "cue": {
          "en": "try southern food",
          "ko": "남부 음식을 먹어 보다"
        },
        "gloss": {
          "en": "I want to try southern Thai food.",
          "ko": "남부 음식을 먹어 보고 싶어요."
        }
      },
      {
        "text": "ฉันอยากไปเที่ยวเชียงใหม่ค่ะ",
        "slot": "ไปเที่ยวเชียงใหม่",
        "cue": {
          "en": "travel to Chiang Mai (a woman speaking)",
          "ko": "치앙마이 여행 가다(여성 화자)"
        },
        "gloss": {
          "en": "I want to travel to Chiang Mai.",
          "ko": "치앙마이에 여행 가고 싶어요."
        }
      }
    ]
  },
  {
    "id": "th-f2-05",
    "stage": 2,
    "fn": "request-action",
    "pattern": "ช่วย___หน่อยครับ",
    "core": [
      "ช่วย"
    ],
    "meaning": {
      "en": "Asking someone to do something: Please ___ for me.",
      "ko": "해 달라고 부탁하기: ___ 좀 해 주세요."
    },
    "grammar": [
      4
    ],
    "expressions": [
      "จอดตรงนี้"
    ],
    "examples": [
      {
        "text": "ช่วยเปิดแอร์หน่อยครับ",
        "slot": "เปิดแอร์",
        "cue": {
          "en": "turn on the air con",
          "ko": "에어컨을 켜다"
        },
        "gloss": {
          "en": "Please turn on the air con.",
          "ko": "에어컨 좀 켜 주세요."
        }
      },
      {
        "text": "ช่วยจอดตรงนี้หน่อยครับ",
        "slot": "จอดตรงนี้",
        "cue": {
          "en": "stop here",
          "ko": "여기 세우다"
        },
        "gloss": {
          "en": "Please stop here.",
          "ko": "여기 좀 세워 주세요."
        }
      },
      {
        "text": "ช่วยเปิดมิเตอร์หน่อยครับ",
        "slot": "เปิดมิเตอร์",
        "cue": {
          "en": "turn on the meter",
          "ko": "미터기를 켜다"
        },
        "gloss": {
          "en": "Please turn on the meter.",
          "ko": "미터기 좀 켜 주세요."
        }
      },
      {
        "text": "ช่วยถ่ายรูปให้หน่อยค่ะ",
        "slot": "ถ่ายรูปให้",
        "cue": {
          "en": "take a photo for me (a woman speaking)",
          "ko": "사진을 찍어 주다(여성 화자)"
        },
        "gloss": {
          "en": "Could you take a photo for me?",
          "ko": "사진 좀 찍어 주세요."
        }
      }
    ]
  },
  {
    "id": "th-f2-06",
    "stage": 2,
    "fn": "invite",
    "pattern": "ไป___ด้วยกันไหมครับ",
    "core": [
      "กันไหม"
    ],
    "meaning": {
      "en": "Inviting someone: Shall we go ___ together?",
      "ko": "같이 하자고 하기: 같이 ___하러 갈래요?"
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ไปกินข้าวด้วยกันไหมครับ",
        "slot": "กินข้าว",
        "cue": {
          "en": "eat",
          "ko": "밥 먹다"
        },
        "gloss": {
          "en": "Shall we go and eat together?",
          "ko": "같이 밥 먹으러 갈래요?"
        }
      },
      {
        "text": "ไปดูหนังด้วยกันไหมครับ",
        "slot": "ดูหนัง",
        "cue": {
          "en": "watch a film",
          "ko": "영화 보다"
        },
        "gloss": {
          "en": "Shall we go and see a film?",
          "ko": "같이 영화 보러 갈래요?"
        }
      },
      {
        "text": "ไปตลาดนัดด้วยกันไหมครับ",
        "slot": "ตลาดนัด",
        "cue": {
          "en": "the weekend market",
          "ko": "주말 시장"
        },
        "gloss": {
          "en": "Shall we go to the weekend market together?",
          "ko": "같이 주말 시장에 갈래요?"
        }
      },
      {
        "text": "ไปว่ายน้ำด้วยกันไหมคะ",
        "slot": "ว่ายน้ำ",
        "cue": {
          "en": "swim (a woman speaking)",
          "ko": "수영하다(여성 화자)"
        },
        "gloss": {
          "en": "Shall we go swimming together?",
          "ko": "같이 수영하러 갈래요?"
        }
      }
    ]
  },
  {
    "id": "th-f2-07",
    "stage": 2,
    "fn": "experience",
    "pattern": "เคย___ไหมครับ",
    "core": [
      "เคย"
    ],
    "meaning": {
      "en": "Asking about experience: Have you ever ___?",
      "ko": "해 본 적 있는지 묻기: ___해 본 적 있어요?"
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "เคยไปภูเก็ตไหมครับ",
        "slot": "ไปภูเก็ต",
        "cue": {
          "en": "go to Phuket",
          "ko": "푸껫에 가다"
        },
        "gloss": {
          "en": "Have you ever been to Phuket?",
          "ko": "푸껫에 가 본 적 있어요?"
        }
      },
      {
        "text": "เคยกินทุเรียนไหมครับ",
        "slot": "กินทุเรียน",
        "cue": {
          "en": "eat durian",
          "ko": "두리안을 먹다"
        },
        "gloss": {
          "en": "Have you ever eaten durian?",
          "ko": "두리안 먹어 본 적 있어요?"
        }
      },
      {
        "text": "เคยดูมวยไทยไหมครับ",
        "slot": "ดูมวยไทย",
        "cue": {
          "en": "watch Muay Thai",
          "ko": "무에타이를 보다"
        },
        "gloss": {
          "en": "Have you ever watched Muay Thai?",
          "ko": "무에타이 본 적 있어요?"
        }
      },
      {
        "text": "เคยขึ้นรถตุ๊กตุ๊กไหมคะ",
        "slot": "ขึ้นรถตุ๊กตุ๊ก",
        "cue": {
          "en": "ride a tuk-tuk (a woman speaking)",
          "ko": "툭툭을 타다(여성 화자)"
        },
        "gloss": {
          "en": "Have you ever ridden a tuk-tuk?",
          "ko": "툭툭 타 본 적 있어요?"
        }
      }
    ]
  },
  {
    "id": "th-f2-08",
    "stage": 2,
    "fn": "experience",
    "pattern": "ผมไม่เคย___เลยครับ",
    "core": [
      "ไม่เคย"
    ],
    "meaning": {
      "en": "Saying you've never done something: I've never ___.",
      "ko": "해 본 적 없다고 말하기: ___해 본 적이 없어요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ผมไม่เคยกินทุเรียนเลยครับ",
        "slot": "กินทุเรียน",
        "cue": {
          "en": "eat durian",
          "ko": "두리안을 먹다"
        },
        "gloss": {
          "en": "I've never eaten durian.",
          "ko": "두리안을 먹어 본 적이 없어요."
        }
      },
      {
        "text": "ผมไม่เคยไปเชียงใหม่เลยครับ",
        "slot": "ไปเชียงใหม่",
        "cue": {
          "en": "go to Chiang Mai",
          "ko": "치앙마이에 가다"
        },
        "gloss": {
          "en": "I've never been to Chiang Mai.",
          "ko": "치앙마이에 가 본 적이 없어요."
        }
      },
      {
        "text": "ผมไม่เคยดำน้ำเลยครับ",
        "slot": "ดำน้ำ",
        "cue": {
          "en": "go diving",
          "ko": "다이빙하다"
        },
        "gloss": {
          "en": "I've never been diving.",
          "ko": "다이빙을 해 본 적이 없어요."
        }
      },
      {
        "text": "ฉันไม่เคยขี่ช้างเลยค่ะ",
        "slot": "ขี่ช้าง",
        "cue": {
          "en": "ride an elephant (a woman speaking)",
          "ko": "코끼리를 타다(여성 화자)"
        },
        "gloss": {
          "en": "I've never ridden an elephant.",
          "ko": "코끼리를 타 본 적이 없어요."
        }
      }
    ]
  },
  {
    "id": "th-f2-09",
    "stage": 2,
    "fn": "reason",
    "pattern": "…เพราะ___ครับ",
    "core": [
      "เพราะ"
    ],
    "meaning": {
      "en": "Giving a reason: …because ___.",
      "ko": "이유 말하기: ___ 때문에 …"
    },
    "grammar": [
      7
    ],
    "expressions": [
      "ไม่สบาย",
      "ปวดหัว"
    ],
    "examples": [
      {
        "text": "วันนี้ไม่ไปเพราะฝนตกครับ",
        "slot": "ฝนตก",
        "cue": {
          "en": "it's raining",
          "ko": "비가 오다"
        },
        "gloss": {
          "en": "I'm not going today because it's raining.",
          "ko": "비가 와서 오늘은 안 가요."
        }
      },
      {
        "text": "ผมไม่ไปเพราะไม่สบายครับ",
        "slot": "ไม่สบาย",
        "cue": {
          "en": "I'm not well",
          "ko": "몸이 안 좋다"
        },
        "gloss": {
          "en": "I'm not going because I'm not well.",
          "ko": "몸이 안 좋아서 안 가요."
        }
      },
      {
        "text": "ผมกลับก่อนเพราะปวดหัวครับ",
        "slot": "ปวดหัว",
        "cue": {
          "en": "I have a headache",
          "ko": "머리가 아프다"
        },
        "gloss": {
          "en": "I'm leaving early because I have a headache.",
          "ko": "머리가 아파서 먼저 갈게요."
        }
      },
      {
        "text": "ฉันมาสายเพราะรถติดค่ะ",
        "slot": "รถติด",
        "cue": {
          "en": "the traffic was bad (a woman speaking)",
          "ko": "길이 막히다(여성 화자)"
        },
        "gloss": {
          "en": "I'm late because of the traffic.",
          "ko": "길이 막혀서 늦었어요."
        }
      }
    ]
  },
  {
    "id": "th-f2-10",
    "stage": 2,
    "fn": "directions",
    "pattern": "ไปที่___ครับ",
    "core": [
      "ไปที่"
    ],
    "meaning": {
      "en": "Telling a driver where to go: To ___, please.",
      "ko": "목적지 말하기: ___(으)로 가 주세요."
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "ไปที่สยามครับ",
        "slot": "สยาม",
        "cue": {
          "en": "Siam",
          "ko": "시암"
        },
        "gloss": {
          "en": "To Siam, please.",
          "ko": "시암으로 가 주세요."
        }
      },
      {
        "text": "ไปที่สนามบินครับ",
        "slot": "สนามบิน",
        "cue": {
          "en": "the airport",
          "ko": "공항"
        },
        "gloss": {
          "en": "To the airport, please.",
          "ko": "공항으로 가 주세요."
        }
      },
      {
        "text": "ไปที่ตลาดนัดจตุจักรครับ",
        "slot": "ตลาดนัดจตุจักร",
        "cue": {
          "en": "Chatuchak Market",
          "ko": "짜뚜짝 시장"
        },
        "gloss": {
          "en": "To Chatuchak Market, please.",
          "ko": "짜뚜짝 시장으로 가 주세요."
        }
      },
      {
        "text": "ไปที่โรงแรมนี้ค่ะ",
        "slot": "โรงแรมนี้",
        "cue": {
          "en": "this hotel (a woman speaking)",
          "ko": "이 호텔(여성 화자)"
        },
        "gloss": {
          "en": "To this hotel, please.",
          "ko": "이 호텔로 가 주세요."
        }
      }
    ]
  },
  {
    "id": "th-f2-11",
    "stage": 2,
    "fn": "directions",
    "pattern": "เลี้ยวซ้ายตรง___ครับ",
    "core": [
      "เลี้ยวซ้าย",
      "เลี้ยวขวา"
    ],
    "meaning": {
      "en": "Giving directions: Turn left/right at ___.",
      "ko": "길 알려 주기: ___에서 왼쪽/오른쪽으로 도세요."
    },
    "grammar": [],
    "expressions": [
      "เลี้ยวซ้าย",
      "เลี้ยวขวา"
    ],
    "examples": [
      {
        "text": "เลี้ยวซ้ายตรงไฟแดงครับ",
        "slot": "ไฟแดง",
        "cue": {
          "en": "the traffic lights",
          "ko": "신호등"
        },
        "gloss": {
          "en": "Turn left at the traffic lights.",
          "ko": "신호등에서 왼쪽으로 도세요."
        }
      },
      {
        "text": "เลี้ยวขวาตรงเซเว่นครับ",
        "slot": "เซเว่น",
        "cue": {
          "en": "the 7-Eleven",
          "ko": "세븐일레븐"
        },
        "gloss": {
          "en": "Turn right at the 7-Eleven.",
          "ko": "세븐일레븐에서 오른쪽으로 도세요."
        }
      },
      {
        "text": "เลี้ยวซ้ายตรงซอยหน้าครับ",
        "slot": "ซอยหน้า",
        "cue": {
          "en": "the next lane",
          "ko": "다음 골목"
        },
        "gloss": {
          "en": "Turn left at the next lane.",
          "ko": "다음 골목에서 왼쪽으로 도세요."
        }
      },
      {
        "text": "ตรงไปแล้วเลี้ยวขวาตรงปั๊มน้ำมันค่ะ",
        "slot": "ปั๊มน้ำมัน",
        "cue": {
          "en": "the petrol station (a woman speaking)",
          "ko": "주유소(여성 화자)"
        },
        "gloss": {
          "en": "Go straight, then turn right at the petrol station.",
          "ko": "직진하다가 주유소에서 오른쪽으로 도세요."
        }
      }
    ]
  },
  {
    "id": "th-f2-12",
    "stage": 2,
    "fn": "order",
    "pattern": "ขอ___ไม่เผ็ดครับ",
    "core": [
      "ไม่เผ็ด"
    ],
    "meaning": {
      "en": "Ordering food: ___, not spicy, please.",
      "ko": "주문하기: ___ 안 맵게 주세요."
    },
    "grammar": [],
    "expressions": [
      "ไม่เผ็ด"
    ],
    "examples": [
      {
        "text": "ขอผัดกะเพราหมูไม่เผ็ดครับ",
        "slot": "ผัดกะเพราหมู",
        "cue": {
          "en": "stir-fried pork with holy basil",
          "ko": "돼지고기 바질 볶음"
        },
        "gloss": {
          "en": "Pork with holy basil, not spicy, please.",
          "ko": "돼지고기 바질 볶음 안 맵게 주세요."
        }
      },
      {
        "text": "ขอส้มตำไม่เผ็ดครับ",
        "slot": "ส้มตำ",
        "cue": {
          "en": "som tam",
          "ko": "쏨땀"
        },
        "gloss": {
          "en": "Som tam, not spicy, please.",
          "ko": "쏨땀 안 맵게 주세요."
        }
      },
      {
        "text": "ขอต้มยำกุ้งไม่เผ็ดครับ",
        "slot": "ต้มยำกุ้ง",
        "cue": {
          "en": "tom yum with prawns",
          "ko": "똠얌꿍"
        },
        "gloss": {
          "en": "Tom yum with prawns, not spicy, please.",
          "ko": "똠얌꿍 안 맵게 주세요."
        }
      },
      {
        "text": "ขอข้าวผัดไม่เผ็ดค่ะ",
        "slot": "ข้าวผัด",
        "cue": {
          "en": "fried rice (a woman speaking)",
          "ko": "볶음밥(여성 화자)"
        },
        "gloss": {
          "en": "Fried rice, not spicy, please.",
          "ko": "볶음밥 안 맵게 주세요."
        }
      }
    ]
  },
  {
    "id": "th-f2-13",
    "stage": 2,
    "fn": "like",
    "pattern": "ผมชอบ___มากครับ",
    "core": [
      "ชอบ"
    ],
    "meaning": {
      "en": "Saying what you like: I really like ___.",
      "ko": "좋아하는 것 말하기: ___ 정말 좋아해요."
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "ผมชอบอาหารไทยมากครับ",
        "slot": "อาหารไทย",
        "cue": {
          "en": "Thai food",
          "ko": "태국 음식"
        },
        "gloss": {
          "en": "I really like Thai food.",
          "ko": "태국 음식을 정말 좋아해요."
        }
      },
      {
        "text": "ผมชอบทะเลมากครับ",
        "slot": "ทะเล",
        "cue": {
          "en": "the sea",
          "ko": "바다"
        },
        "gloss": {
          "en": "I really like the sea.",
          "ko": "바다를 정말 좋아해요."
        }
      },
      {
        "text": "ผมชอบมะม่วงมากครับ",
        "slot": "มะม่วง",
        "cue": {
          "en": "mangoes",
          "ko": "망고"
        },
        "gloss": {
          "en": "I really like mangoes.",
          "ko": "망고를 정말 좋아해요."
        }
      },
      {
        "text": "ฉันชอบเพลงไทยมากค่ะ",
        "slot": "เพลงไทย",
        "cue": {
          "en": "Thai songs (a woman speaking)",
          "ko": "태국 노래(여성 화자)"
        },
        "gloss": {
          "en": "I really like Thai songs.",
          "ko": "태국 노래를 정말 좋아해요."
        }
      }
    ]
  },
  {
    "id": "th-f2-14",
    "stage": 2,
    "fn": "dislike",
    "pattern": "ผมไม่ค่อยชอบ___ครับ",
    "core": [
      "ไม่ค่อยชอบ"
    ],
    "meaning": {
      "en": "Saying what you don't really like: I don't really like ___.",
      "ko": "싫어하는 것 말하기: ___ 별로 안 좋아해요."
    },
    "grammar": [],
    "expressions": [
      "ไม่ค่อยชอบ"
    ],
    "examples": [
      {
        "text": "ผมไม่ค่อยชอบอาหารหวานครับ",
        "slot": "อาหารหวาน",
        "cue": {
          "en": "sweet food",
          "ko": "단 음식"
        },
        "gloss": {
          "en": "I don't really like sweet food.",
          "ko": "단 음식은 별로 안 좋아해요."
        }
      },
      {
        "text": "ผมไม่ค่อยชอบอากาศร้อนครับ",
        "slot": "อากาศร้อน",
        "cue": {
          "en": "hot weather",
          "ko": "더운 날씨"
        },
        "gloss": {
          "en": "I don't really like hot weather.",
          "ko": "더운 날씨는 별로 안 좋아해요."
        }
      },
      {
        "text": "ผมไม่ค่อยชอบผักชีครับ",
        "slot": "ผักชี",
        "cue": {
          "en": "coriander",
          "ko": "고수"
        },
        "gloss": {
          "en": "I don't really like coriander.",
          "ko": "고수는 별로 안 좋아해요."
        }
      },
      {
        "text": "ฉันไม่ค่อยชอบรถติดค่ะ",
        "slot": "รถติด",
        "cue": {
          "en": "traffic jams (a woman speaking)",
          "ko": "교통 체증(여성 화자)"
        },
        "gloss": {
          "en": "I don't really like traffic jams.",
          "ko": "길 막히는 건 별로 안 좋아해요."
        }
      }
    ]
  },
  {
    "id": "th-f2-15",
    "stage": 2,
    "fn": "symptom",
    "pattern": "ผมปวด___ครับ",
    "core": [
      "ปวด"
    ],
    "meaning": {
      "en": "Saying where it hurts: I have a ___ ache.",
      "ko": "아픈 곳 말하기: ___이/가 아파요."
    },
    "grammar": [],
    "expressions": [
      "ปวดหัว"
    ],
    "examples": [
      {
        "text": "ผมปวดหัวครับ",
        "slot": "หัว",
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
        "text": "ผมปวดท้องนิดหน่อยครับ",
        "slot": "ท้อง",
        "cue": {
          "en": "stomach",
          "ko": "배"
        },
        "gloss": {
          "en": "I have a bit of a stomach ache.",
          "ko": "배가 좀 아파요."
        }
      },
      {
        "text": "ผมปวดหลังครับ",
        "slot": "หลัง",
        "cue": {
          "en": "back",
          "ko": "허리"
        },
        "gloss": {
          "en": "My back hurts.",
          "ko": "허리가 아파요."
        }
      },
      {
        "text": "ฉันปวดฟันค่ะ",
        "slot": "ฟัน",
        "cue": {
          "en": "tooth (a woman speaking)",
          "ko": "이(여성 화자)"
        },
        "gloss": {
          "en": "I have a toothache.",
          "ko": "이가 아파요."
        }
      }
    ]
  },
  {
    "id": "th-f2-16",
    "stage": 2,
    "fn": "past-did",
    "pattern": "___หรือยังครับ",
    "core": [
      "หรือยัง"
    ],
    "meaning": {
      "en": "Asking if something is done yet: Have you ___ yet?",
      "ko": "했는지 묻기: ___했어요?"
    },
    "grammar": [],
    "expressions": [
      "กินข้าวหรือยัง"
    ],
    "examples": [
      {
        "text": "กินข้าวหรือยังครับ",
        "slot": "กินข้าว",
        "cue": {
          "en": "eat",
          "ko": "밥을 먹다"
        },
        "gloss": {
          "en": "Have you eaten yet?",
          "ko": "밥 먹었어요?"
        }
      },
      {
        "text": "ถึงบ้านหรือยังครับ",
        "slot": "ถึงบ้าน",
        "cue": {
          "en": "get home",
          "ko": "집에 도착하다"
        },
        "gloss": {
          "en": "Are you home yet?",
          "ko": "집에 도착했어요?"
        }
      },
      {
        "text": "เสร็จหรือยังครับ",
        "slot": "เสร็จ",
        "cue": {
          "en": "finish",
          "ko": "끝나다"
        },
        "gloss": {
          "en": "Is it done yet?",
          "ko": "다 끝났어요?"
        }
      },
      {
        "text": "จ่ายเงินหรือยังคะ",
        "slot": "จ่ายเงิน",
        "cue": {
          "en": "pay (a woman speaking)",
          "ko": "돈을 내다(여성 화자)"
        },
        "gloss": {
          "en": "Have you paid yet?",
          "ko": "돈 냈어요?"
        }
      }
    ]
  },
  {
    "id": "th-f2-17",
    "stage": 2,
    "fn": "suggest-time",
    "pattern": "เจอกันที่___นะครับ",
    "core": [
      "เจอกัน"
    ],
    "meaning": {
      "en": "Setting a meeting place: Let's meet at ___.",
      "ko": "만날 곳 정하기: ___에서 만나요."
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "เจอกันที่สถานีสยามนะครับ",
        "slot": "สถานีสยาม",
        "cue": {
          "en": "Siam station",
          "ko": "시암역"
        },
        "gloss": {
          "en": "Let's meet at Siam station.",
          "ko": "시암역에서 만나요."
        }
      },
      {
        "text": "เจอกันที่หน้าร้านกาแฟนะครับ",
        "slot": "หน้าร้านกาแฟ",
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
        "text": "เจอกันที่ตลาดนะครับ",
        "slot": "ตลาด",
        "cue": {
          "en": "the market",
          "ko": "시장"
        },
        "gloss": {
          "en": "Let's meet at the market.",
          "ko": "시장에서 만나요."
        }
      },
      {
        "text": "เจอกันที่ล็อบบี้โรงแรมนะคะ",
        "slot": "ล็อบบี้โรงแรม",
        "cue": {
          "en": "the hotel lobby (a woman speaking)",
          "ko": "호텔 로비(여성 화자)"
        },
        "gloss": {
          "en": "Let's meet in the hotel lobby.",
          "ko": "호텔 로비에서 만나요."
        }
      }
    ]
  },
  {
    "id": "th-f3-01",
    "stage": 3,
    "fn": "condition",
    "pattern": "ถ้า___ ก็…",
    "core": [
      "ถ้า"
    ],
    "meaning": {
      "en": "Saying what happens if: If ___, then …",
      "ko": "조건 말하기: ___(으)면 …"
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ถ้าฝนตก เราก็อยู่บ้านดูหนังกันครับ",
        "slot": "ฝนตก",
        "cue": {
          "en": "it rains",
          "ko": "비가 오다"
        },
        "gloss": {
          "en": "If it rains, we'll stay home and watch a film.",
          "ko": "비가 오면 집에서 영화 봐요."
        }
      },
      {
        "text": "ถ้าแอร์ยังไม่เย็น ผมก็อยากเปลี่ยนห้องครับ",
        "slot": "แอร์ยังไม่เย็น",
        "cue": {
          "en": "the air con still isn't cold",
          "ko": "에어컨이 아직 안 시원하다"
        },
        "gloss": {
          "en": "If the air con still isn't cold, I'd like to change rooms.",
          "ko": "에어컨이 계속 안 시원하면 방을 바꾸고 싶어요."
        }
      },
      {
        "text": "ถ้าคุณว่าง เราก็ไปด้วยกันครับ",
        "slot": "คุณว่าง",
        "cue": {
          "en": "you're free",
          "ko": "당신이 시간이 있다"
        },
        "gloss": {
          "en": "If you're free, let's go together.",
          "ko": "시간 되면 같이 가요."
        }
      },
      {
        "text": "ถ้าวันพฤหัสไม่สะดวก ฉันก็มาวันศุกร์ได้ค่ะ",
        "slot": "วันพฤหัสไม่สะดวก",
        "cue": {
          "en": "Thursday isn't convenient (a woman speaking)",
          "ko": "목요일이 불편하다(여성 화자)"
        },
        "gloss": {
          "en": "If Thursday isn't convenient, I can come on Friday.",
          "ko": "목요일이 불편하시면 금요일에 와도 돼요."
        }
      }
    ]
  },
  {
    "id": "th-f3-02",
    "stage": 3,
    "fn": "sequence",
    "pattern": "หลังจากที่___ …",
    "core": [
      "หลังจากที่"
    ],
    "meaning": {
      "en": "Ordering events: After ___, …",
      "ko": "순서대로 말하기: ___한 뒤에 …"
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "หลังจากที่กินข้าวเสร็จ เราไปเดินเล่นที่ตลาดน้ำครับ",
        "slot": "กินข้าวเสร็จ",
        "cue": {
          "en": "we finished eating",
          "ko": "밥을 다 먹다"
        },
        "gloss": {
          "en": "After we finished eating, we went for a walk at the floating market.",
          "ko": "밥을 다 먹고 나서 수상 시장을 걸었어요."
        }
      },
      {
        "text": "หลังจากที่ถึงโรงแรม ผมไปทะเลเลยครับ",
        "slot": "ถึงโรงแรม",
        "cue": {
          "en": "I got to the hotel",
          "ko": "호텔에 도착하다"
        },
        "gloss": {
          "en": "After I got to the hotel, I went straight to the beach.",
          "ko": "호텔에 도착하고 나서 바로 바다에 갔어요."
        }
      },
      {
        "text": "หลังจากที่ดูตอนแรก ผมก็ติดเลยครับ",
        "slot": "ดูตอนแรก",
        "cue": {
          "en": "I watched the first episode",
          "ko": "첫 화를 보다"
        },
        "gloss": {
          "en": "After I watched the first episode, I was hooked.",
          "ko": "첫 화를 보고 나서 바로 빠졌어요."
        }
      },
      {
        "text": "หลังจากที่เลิกงาน ฉันจะโทรกลับค่ะ",
        "slot": "เลิกงาน",
        "cue": {
          "en": "I finish work (a woman speaking)",
          "ko": "퇴근하다(여성 화자)"
        },
        "gloss": {
          "en": "After I finish work, I'll call you back.",
          "ko": "퇴근하고 나서 다시 전화할게요."
        }
      }
    ]
  },
  {
    "id": "th-f3-03",
    "stage": 3,
    "fn": "sequence",
    "pattern": "ก่อนที่จะ___ …",
    "core": [
      "ก่อนที่"
    ],
    "meaning": {
      "en": "Ordering events: Before ___, …",
      "ko": "순서대로 말하기: ___하기 전에 …"
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ก่อนที่จะออกไป ผมเปิดแอร์ไว้แล้วครับ",
        "slot": "ออกไป",
        "cue": {
          "en": "going out",
          "ko": "나가다"
        },
        "gloss": {
          "en": "Before going out, I left the air con on.",
          "ko": "나가기 전에 에어컨을 켜 놨어요."
        }
      },
      {
        "text": "ก่อนที่จะไปเกาะ เราแวะตลาดก่อนครับ",
        "slot": "ไปเกาะ",
        "cue": {
          "en": "going to the island",
          "ko": "섬에 가다"
        },
        "gloss": {
          "en": "Before going to the island, we stopped at the market.",
          "ko": "섬에 가기 전에 먼저 시장에 들렀어요."
        }
      },
      {
        "text": "ก่อนที่จะนอน ผมดูละครอีกหนึ่งตอนครับ",
        "slot": "นอน",
        "cue": {
          "en": "going to bed",
          "ko": "자다"
        },
        "gloss": {
          "en": "Before going to bed, I watch one more episode.",
          "ko": "자기 전에 드라마 한 편 더 봐요."
        }
      },
      {
        "text": "ก่อนที่จะมาคลินิก ฉันจะโทรบอกก่อนค่ะ",
        "slot": "มาคลินิก",
        "cue": {
          "en": "coming to the clinic (a woman speaking)",
          "ko": "병원에 오다(여성 화자)"
        },
        "gloss": {
          "en": "Before coming to the clinic, I'll call first.",
          "ko": "병원에 가기 전에 먼저 전화할게요."
        }
      }
    ]
  },
  {
    "id": "th-f3-04",
    "stage": 3,
    "fn": "describe-thing",
    "pattern": "___ที่ผม / ที่คุณ / ที่เรา …",
    "core": [
      "ที่คุณ",
      "ที่ผม",
      "ที่เรา"
    ],
    "meaning": {
      "en": "Describing a thing with a clause: the ___ that I / you / we …",
      "ko": "물건·장소 묘사하기: 내가/네가/우리가 …한 ___"
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ละครที่คุณแนะนำสนุกมากครับ",
        "slot": "ละคร",
        "cue": {
          "en": "the drama",
          "ko": "드라마"
        },
        "gloss": {
          "en": "The drama you recommended is really fun.",
          "ko": "추천해 준 드라마 정말 재밌어요."
        }
      },
      {
        "text": "ร้านที่คุณแนะนำอร่อยมากครับ",
        "slot": "ร้าน",
        "cue": {
          "en": "the restaurant",
          "ko": "식당"
        },
        "gloss": {
          "en": "The restaurant you recommended was really good.",
          "ko": "추천해 준 식당 정말 맛있었어요."
        }
      },
      {
        "text": "โรงแรมที่ผมจองไว้ดีมากครับ",
        "slot": "โรงแรม",
        "cue": {
          "en": "the hotel",
          "ko": "호텔"
        },
        "gloss": {
          "en": "The hotel I booked is really nice.",
          "ko": "제가 예약한 호텔 정말 좋아요."
        }
      },
      {
        "text": "ตลาดที่เราไปเมื่อวานสนุกมากค่ะ",
        "slot": "ตลาด",
        "cue": {
          "en": "the market (a woman speaking)",
          "ko": "시장(여성 화자)"
        },
        "gloss": {
          "en": "The market we went to yesterday was really fun.",
          "ko": "어제 간 시장 정말 재밌었어요."
        }
      }
    ]
  },
  {
    "id": "th-f3-05",
    "stage": 3,
    "fn": "opinion",
    "pattern": "ผมคิดว่า___ครับ",
    "core": [
      "คิดว่า"
    ],
    "meaning": {
      "en": "Giving your opinion: I think ___.",
      "ko": "내 생각 말하기: ___인 것 같아요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ผมคิดว่าภาคนี้สนุกกว่าภาคแรกครับ",
        "slot": "ภาคนี้สนุกกว่าภาคแรก",
        "cue": {
          "en": "this season is more fun than the first",
          "ko": "이번 시즌이 첫 시즌보다 재밌다"
        },
        "gloss": {
          "en": "I think this season is more fun than the first.",
          "ko": "이번 시즌이 첫 시즌보다 재밌는 것 같아요."
        }
      },
      {
        "text": "ผมคิดว่าราคานี้คุ้มมากครับ",
        "slot": "ราคานี้คุ้มมาก",
        "cue": {
          "en": "this price is great value",
          "ko": "이 가격이면 아주 괜찮다"
        },
        "gloss": {
          "en": "I think this price is great value.",
          "ko": "이 가격이면 정말 괜찮은 것 같아요."
        }
      },
      {
        "text": "ผมคิดว่าพระเอกเล่นดีมากครับ",
        "slot": "พระเอกเล่นดีมาก",
        "cue": {
          "en": "the lead actor is very good",
          "ko": "남자 주인공 연기가 아주 좋다"
        },
        "gloss": {
          "en": "I think the lead actor is very good.",
          "ko": "남자 주인공 연기가 정말 좋은 것 같아요."
        }
      },
      {
        "text": "ฉันคิดว่าตอนจบดีมากค่ะ",
        "slot": "ตอนจบดีมาก",
        "cue": {
          "en": "the ending is very good (a woman speaking)",
          "ko": "결말이 아주 좋다(여성 화자)"
        },
        "gloss": {
          "en": "I think the ending is great.",
          "ko": "결말이 정말 좋은 것 같아요."
        }
      }
    ]
  },
  {
    "id": "th-f3-06",
    "stage": 3,
    "fn": "ask-opinion",
    "pattern": "คุณคิดว่า___เป็นยังไงครับ",
    "core": [
      "คิดว่า"
    ],
    "meaning": {
      "en": "Asking what someone thinks: What do you think of ___?",
      "ko": "상대 생각 묻기: ___ 어떻게 생각해요?"
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "คุณคิดว่าละครเรื่องนี้เป็นยังไงครับ",
        "slot": "ละครเรื่องนี้",
        "cue": {
          "en": "this drama",
          "ko": "이 드라마"
        },
        "gloss": {
          "en": "What do you think of this drama?",
          "ko": "이 드라마 어떻게 생각해요?"
        }
      },
      {
        "text": "คุณคิดว่าตอนจบเป็นยังไงครับ",
        "slot": "ตอนจบ",
        "cue": {
          "en": "the ending",
          "ko": "결말"
        },
        "gloss": {
          "en": "What did you think of the ending?",
          "ko": "결말 어땠어요?"
        }
      },
      {
        "text": "คุณคิดว่าร้านนี้เป็นยังไงครับ",
        "slot": "ร้านนี้",
        "cue": {
          "en": "this restaurant",
          "ko": "이 식당"
        },
        "gloss": {
          "en": "What do you think of this restaurant?",
          "ko": "이 식당 어때요?"
        }
      },
      {
        "text": "คุณคิดว่าที่พักนั้นเป็นยังไงคะ",
        "slot": "ที่พักนั้น",
        "cue": {
          "en": "that place to stay (a woman speaking)",
          "ko": "그 숙소(여성 화자)"
        },
        "gloss": {
          "en": "What did you think of that place to stay?",
          "ko": "그 숙소 어땠어요?"
        }
      }
    ]
  },
  {
    "id": "th-f3-07",
    "stage": 3,
    "fn": "compare",
    "pattern": "___กว่าที่คิดครับ",
    "core": [
      "กว่าที่คิด"
    ],
    "meaning": {
      "en": "Comparing with what you expected: more ___ than I thought.",
      "ko": "생각과 비교하기: 생각보다 ___해요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "สนุกกว่าที่คิดครับ",
        "slot": "สนุก",
        "cue": {
          "en": "fun",
          "ko": "재밌다"
        },
        "gloss": {
          "en": "It's more fun than I thought.",
          "ko": "생각보다 재밌어요."
        }
      },
      {
        "text": "แพงกว่าที่คิดครับ",
        "slot": "แพง",
        "cue": {
          "en": "expensive",
          "ko": "비싸다"
        },
        "gloss": {
          "en": "It's more expensive than I thought.",
          "ko": "생각보다 비싸요."
        }
      },
      {
        "text": "ไกลกว่าที่คิดครับ",
        "slot": "ไกล",
        "cue": {
          "en": "far",
          "ko": "멀다"
        },
        "gloss": {
          "en": "It's further than I thought.",
          "ko": "생각보다 멀어요."
        }
      },
      {
        "text": "ภาษาไทยง่ายกว่าที่คิดค่ะ",
        "slot": "ง่าย",
        "cue": {
          "en": "easy (a woman speaking)",
          "ko": "쉽다(여성 화자)"
        },
        "gloss": {
          "en": "Thai is easier than I thought.",
          "ko": "태국어가 생각보다 쉬워요."
        }
      }
    ]
  },
  {
    "id": "th-f3-08",
    "stage": 3,
    "fn": "compare",
    "pattern": "ผมชอบ___ที่สุดครับ",
    "core": [
      "ที่สุด"
    ],
    "meaning": {
      "en": "Saying what's best: I like ___ the most.",
      "ko": "가장 좋은 것 말하기: ___이/가 제일 좋아요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ผมชอบตอนจบที่สุดครับ",
        "slot": "ตอนจบ",
        "cue": {
          "en": "the ending",
          "ko": "결말"
        },
        "gloss": {
          "en": "I like the ending the most.",
          "ko": "결말이 제일 좋아요."
        }
      },
      {
        "text": "ผมชอบทะเลที่กระบี่ที่สุดครับ",
        "slot": "ทะเลที่กระบี่",
        "cue": {
          "en": "the sea at Krabi",
          "ko": "끄라비 바다"
        },
        "gloss": {
          "en": "I like the sea at Krabi the most.",
          "ko": "끄라비 바다가 제일 좋아요."
        }
      },
      {
        "text": "ผมชอบพระเอกที่สุดครับ",
        "slot": "พระเอก",
        "cue": {
          "en": "the male lead",
          "ko": "남자 주인공"
        },
        "gloss": {
          "en": "I like the male lead the most.",
          "ko": "남자 주인공이 제일 좋아요."
        }
      },
      {
        "text": "ฉันชอบต้มยำกุ้งที่สุดค่ะ",
        "slot": "ต้มยำกุ้ง",
        "cue": {
          "en": "tom yum with prawns (a woman speaking)",
          "ko": "똠얌꿍(여성 화자)"
        },
        "gloss": {
          "en": "I like tom yum with prawns the most.",
          "ko": "똠얌꿍이 제일 좋아요."
        }
      }
    ]
  },
  {
    "id": "th-f3-09",
    "stage": 3,
    "fn": "can",
    "pattern": "ผม___ได้นิดหน่อยครับ",
    "core": [
      "ได้นิดหน่อย"
    ],
    "meaning": {
      "en": "Saying what you can do: I can ___ a little.",
      "ko": "할 수 있는 것 말하기: ___ 조금 할 수 있어요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ผมอ่านภาษาไทยได้นิดหน่อยครับ",
        "slot": "อ่านภาษาไทย",
        "cue": {
          "en": "read Thai",
          "ko": "태국어를 읽다"
        },
        "gloss": {
          "en": "I can read Thai a little.",
          "ko": "태국어를 조금 읽을 수 있어요."
        }
      },
      {
        "text": "ผมพูดภาษาไทยได้นิดหน่อยครับ",
        "slot": "พูดภาษาไทย",
        "cue": {
          "en": "speak Thai",
          "ko": "태국어를 말하다"
        },
        "gloss": {
          "en": "I can speak Thai a little.",
          "ko": "태국어를 조금 할 수 있어요."
        }
      },
      {
        "text": "ผมทำอาหารไทยได้นิดหน่อยครับ",
        "slot": "ทำอาหารไทย",
        "cue": {
          "en": "cook Thai food",
          "ko": "태국 음식을 만들다"
        },
        "gloss": {
          "en": "I can cook Thai food a little.",
          "ko": "태국 음식을 조금 만들 수 있어요."
        }
      },
      {
        "text": "ฉันว่ายน้ำได้นิดหน่อยค่ะ",
        "slot": "ว่ายน้ำ",
        "cue": {
          "en": "swim (a woman speaking)",
          "ko": "수영하다(여성 화자)"
        },
        "gloss": {
          "en": "I can swim a little.",
          "ko": "수영을 조금 할 수 있어요."
        }
      }
    ]
  },
  {
    "id": "th-f3-10",
    "stage": 3,
    "fn": "polite-request",
    "pattern": "ขอ___ได้ไหมครับ",
    "core": [
      "ได้ไหม"
    ],
    "meaning": {
      "en": "Making a polite request: Could I ___?",
      "ko": "더 공손하게 부탁하기: ___해도 될까요?"
    },
    "grammar": [
      5
    ],
    "expressions": [
      "เปลี่ยนห้องได้ไหม",
      "ขอเลื่อนนัด"
    ],
    "examples": [
      {
        "text": "ขอเปลี่ยนห้องได้ไหมครับ",
        "slot": "เปลี่ยนห้อง",
        "cue": {
          "en": "change rooms",
          "ko": "방을 바꾸다"
        },
        "gloss": {
          "en": "Could I change rooms?",
          "ko": "방을 바꿀 수 있을까요?"
        }
      },
      {
        "text": "ขอเลื่อนนัดได้ไหมครับ",
        "slot": "เลื่อนนัด",
        "cue": {
          "en": "move my appointment",
          "ko": "예약을 미루다"
        },
        "gloss": {
          "en": "Could I move my appointment?",
          "ko": "예약을 미룰 수 있을까요?"
        }
      },
      {
        "text": "ขอดูห้องก่อนได้ไหมครับ",
        "slot": "ดูห้องก่อน",
        "cue": {
          "en": "see the room first",
          "ko": "방을 먼저 보다"
        },
        "gloss": {
          "en": "Could I see the room first?",
          "ko": "방을 먼저 볼 수 있을까요?"
        }
      },
      {
        "text": "ขอเช็กเอาต์ช้าหน่อยได้ไหมคะ",
        "slot": "เช็กเอาต์ช้าหน่อย",
        "cue": {
          "en": "check out a bit late (a woman speaking)",
          "ko": "조금 늦게 체크아웃하다(여성 화자)"
        },
        "gloss": {
          "en": "Could I check out a little late?",
          "ko": "조금 늦게 체크아웃해도 될까요?"
        }
      }
    ]
  },
  {
    "id": "th-f3-11",
    "stage": 3,
    "fn": "polite-request",
    "pattern": "ช่วยให้___มาดูหน่อยครับ",
    "core": [
      "ให้"
    ],
    "meaning": {
      "en": "Having someone do something: Please have ___ come and look.",
      "ko": "누구에게 시키기: ___이/가 와서 봐 주게 해 주세요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ช่วยให้ช่างมาดูหน่อยครับ",
        "slot": "ช่าง",
        "cue": {
          "en": "a technician",
          "ko": "기사"
        },
        "gloss": {
          "en": "Please have a technician come and look.",
          "ko": "기사님이 와서 좀 봐 주시게 해 주세요."
        }
      },
      {
        "text": "ช่วยให้พนักงานมาดูหน่อยครับ",
        "slot": "พนักงาน",
        "cue": {
          "en": "a staff member",
          "ko": "직원"
        },
        "gloss": {
          "en": "Please have a staff member come and look.",
          "ko": "직원분이 와서 좀 봐 주시게 해 주세요."
        }
      },
      {
        "text": "ช่วยให้แม่บ้านมาดูหน่อยครับ",
        "slot": "แม่บ้าน",
        "cue": {
          "en": "housekeeping",
          "ko": "객실 청소 직원"
        },
        "gloss": {
          "en": "Please have housekeeping come and look.",
          "ko": "청소 직원분이 와서 좀 봐 주시게 해 주세요."
        }
      },
      {
        "text": "ช่วยให้คนมาดูหน่อยค่ะ",
        "slot": "คน",
        "cue": {
          "en": "someone (a woman speaking)",
          "ko": "누군가(여성 화자)"
        },
        "gloss": {
          "en": "Please have someone come and look.",
          "ko": "누가 와서 좀 봐 주게 해 주세요."
        }
      }
    ]
  },
  {
    "id": "th-f3-12",
    "stage": 3,
    "fn": "must",
    "pattern": "___ให้ผม…ครับ",
    "core": [
      "ให้ผม",
      "ให้ฉัน"
    ],
    "meaning": {
      "en": "Saying someone told you to do something: ___ had me …",
      "ko": "시킨 일 말하기: ___이/가 저보고 …하래요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "หมอให้ผมพักผ่อนเยอะๆ ครับ",
        "slot": "หมอ",
        "cue": {
          "en": "the doctor",
          "ko": "의사"
        },
        "gloss": {
          "en": "The doctor told me to rest a lot.",
          "ko": "의사가 푹 쉬라고 했어요."
        }
      },
      {
        "text": "หัวหน้าให้ผมส่งรายงานพรุ่งนี้ครับ",
        "slot": "หัวหน้า",
        "cue": {
          "en": "my boss",
          "ko": "상사"
        },
        "gloss": {
          "en": "My boss told me to hand in the report tomorrow.",
          "ko": "상사가 내일 보고서를 내라고 했어요."
        }
      },
      {
        "text": "พนักงานให้ผมรอที่ล็อบบี้ครับ",
        "slot": "พนักงาน",
        "cue": {
          "en": "the staff",
          "ko": "직원"
        },
        "gloss": {
          "en": "The staff told me to wait in the lobby.",
          "ko": "직원이 로비에서 기다리라고 했어요."
        }
      },
      {
        "text": "แม่ให้ฉันกลับบ้านเร็วค่ะ",
        "slot": "แม่",
        "cue": {
          "en": "my mother (a woman speaking)",
          "ko": "엄마(여성 화자)"
        },
        "gloss": {
          "en": "My mother told me to come home early.",
          "ko": "엄마가 일찍 들어오라고 했어요."
        }
      }
    ]
  },
  {
    "id": "th-f3-13",
    "stage": 3,
    "fn": "duration",
    "pattern": "ผม…มา___แล้วครับ",
    "core": [
      "แล้ว"
    ],
    "meaning": {
      "en": "Saying how long so far: I've been … for ___.",
      "ko": "얼마나 됐는지 말하기: …한 지 ___ 됐어요."
    },
    "grammar": [
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ผมเรียนภาษาไทยมาสองปีแล้วครับ",
        "slot": "สองปี",
        "cue": {
          "en": "two years",
          "ko": "2년"
        },
        "gloss": {
          "en": "I've been learning Thai for two years.",
          "ko": "태국어를 배운 지 2년 됐어요."
        }
      },
      {
        "text": "ผมอยู่กรุงเทพฯ มาหกเดือนแล้วครับ",
        "slot": "หกเดือน",
        "cue": {
          "en": "six months",
          "ko": "6개월"
        },
        "gloss": {
          "en": "I've lived in Bangkok for six months.",
          "ko": "방콕에 산 지 6개월 됐어요."
        }
      },
      {
        "text": "ผมปวดหัวมาสามวันแล้วครับ",
        "slot": "สามวัน",
        "cue": {
          "en": "three days",
          "ko": "사흘"
        },
        "gloss": {
          "en": "I've had a headache for three days.",
          "ko": "머리가 아픈 지 사흘 됐어요."
        }
      },
      {
        "text": "ฉันทำงานที่นี่มาหนึ่งปีแล้วค่ะ",
        "slot": "หนึ่งปี",
        "cue": {
          "en": "one year (a woman speaking)",
          "ko": "1년(여성 화자)"
        },
        "gloss": {
          "en": "I've worked here for a year.",
          "ko": "여기서 일한 지 1년 됐어요."
        }
      }
    ]
  },
  {
    "id": "th-f3-14",
    "stage": 3,
    "fn": "complain",
    "pattern": "___เสียครับ",
    "core": [
      "เสีย"
    ],
    "meaning": {
      "en": "Reporting something broken: The ___ is broken.",
      "ko": "고장 알리기: ___이/가 고장 났어요."
    },
    "grammar": [],
    "expressions": [
      "แอร์เสีย"
    ],
    "examples": [
      {
        "text": "แอร์เสียครับ",
        "slot": "แอร์",
        "cue": {
          "en": "the air con",
          "ko": "에어컨"
        },
        "gloss": {
          "en": "The air con is broken.",
          "ko": "에어컨이 고장 났어요."
        }
      },
      {
        "text": "ทีวีในห้องเสียครับ",
        "slot": "ทีวีในห้อง",
        "cue": {
          "en": "the TV in the room",
          "ko": "방 안 TV"
        },
        "gloss": {
          "en": "The TV in the room is broken.",
          "ko": "방 TV가 고장 났어요."
        }
      },
      {
        "text": "ฝักบัวเสียครับ",
        "slot": "ฝักบัว",
        "cue": {
          "en": "the shower",
          "ko": "샤워기"
        },
        "gloss": {
          "en": "The shower is broken.",
          "ko": "샤워기가 고장 났어요."
        }
      },
      {
        "text": "ไฟในห้องน้ำเสียค่ะ",
        "slot": "ไฟในห้องน้ำ",
        "cue": {
          "en": "the bathroom light (a woman speaking)",
          "ko": "화장실 전등(여성 화자)"
        },
        "gloss": {
          "en": "The bathroom light is broken.",
          "ko": "화장실 불이 고장 났어요."
        }
      }
    ]
  },
  {
    "id": "th-f3-15",
    "stage": 3,
    "fn": "change-plan",
    "pattern": "ขอเลื่อนนัดเป็น___ได้ไหมครับ",
    "core": [
      "เลื่อนนัด"
    ],
    "meaning": {
      "en": "Moving an appointment: Could I move it to ___?",
      "ko": "약속 바꾸기: ___(으)로 미룰 수 있을까요?"
    },
    "grammar": [],
    "expressions": [
      "ขอเลื่อนนัด"
    ],
    "examples": [
      {
        "text": "ขอเลื่อนนัดเป็นวันศุกร์ได้ไหมครับ",
        "slot": "วันศุกร์",
        "cue": {
          "en": "Friday",
          "ko": "금요일"
        },
        "gloss": {
          "en": "Could I move the appointment to Friday?",
          "ko": "예약을 금요일로 미룰 수 있을까요?"
        }
      },
      {
        "text": "ขอเลื่อนนัดเป็นบ่ายสามโมงได้ไหมครับ",
        "slot": "บ่ายสามโมง",
        "cue": {
          "en": "three in the afternoon",
          "ko": "오후 세 시"
        },
        "gloss": {
          "en": "Could I move it to three in the afternoon?",
          "ko": "오후 세 시로 미룰 수 있을까요?"
        }
      },
      {
        "text": "ขอเลื่อนนัดเป็นพรุ่งนี้ได้ไหมครับ",
        "slot": "พรุ่งนี้",
        "cue": {
          "en": "tomorrow",
          "ko": "내일"
        },
        "gloss": {
          "en": "Could I move it to tomorrow?",
          "ko": "내일로 미룰 수 있을까요?"
        }
      },
      {
        "text": "ขอเลื่อนนัดเป็นสัปดาห์หน้าได้ไหมคะ",
        "slot": "สัปดาห์หน้า",
        "cue": {
          "en": "next week (a woman speaking)",
          "ko": "다음 주(여성 화자)"
        },
        "gloss": {
          "en": "Could I move it to next week?",
          "ko": "다음 주로 미룰 수 있을까요?"
        }
      }
    ]
  },
  {
    "id": "th-f3-16",
    "stage": 3,
    "fn": "guess",
    "pattern": "…น่าจะ___ครับ",
    "core": [
      "น่าจะ"
    ],
    "meaning": {
      "en": "Guessing: It's probably ___.",
      "ko": "짐작하기: 아마 ___일 거예요."
    },
    "grammar": [],
    "expressions": [
      "น่าจะ"
    ],
    "examples": [
      {
        "text": "พรุ่งนี้น่าจะว่างครับ",
        "slot": "ว่าง",
        "cue": {
          "en": "free",
          "ko": "한가하다"
        },
        "gloss": {
          "en": "I'll probably be free tomorrow.",
          "ko": "내일은 아마 시간이 될 거예요."
        }
      },
      {
        "text": "ภาคสองน่าจะออกปีหน้าครับ",
        "slot": "ออกปีหน้า",
        "cue": {
          "en": "come out next year",
          "ko": "내년에 나오다"
        },
        "gloss": {
          "en": "Season two will probably come out next year.",
          "ko": "시즌 2는 아마 내년에 나올 거예요."
        }
      },
      {
        "text": "เขาน่าจะมาสายครับ",
        "slot": "มาสาย",
        "cue": {
          "en": "be late",
          "ko": "늦게 오다"
        },
        "gloss": {
          "en": "He'll probably be late.",
          "ko": "그 사람 아마 늦을 거예요."
        }
      },
      {
        "text": "แอร์น่าจะเสียค่ะ",
        "slot": "เสีย",
        "cue": {
          "en": "be broken (a woman speaking)",
          "ko": "고장 나다(여성 화자)"
        },
        "gloss": {
          "en": "The air con is probably broken.",
          "ko": "에어컨이 고장 난 것 같아요."
        }
      }
    ]
  },
  {
    "id": "th-f3-17",
    "stage": 3,
    "fn": "duration",
    "pattern": "___มานานแค่ไหนแล้วครับ",
    "core": [
      "นานแค่ไหน"
    ],
    "meaning": {
      "en": "Asking how long: How long have you been ___?",
      "ko": "얼마나 됐는지 묻기: ___한 지 얼마나 됐어요?"
    },
    "grammar": [
      7
    ],
    "expressions": [
      "นานแค่ไหน"
    ],
    "examples": [
      {
        "text": "เรียนภาษาไทยมานานแค่ไหนแล้วครับ",
        "slot": "เรียนภาษาไทย",
        "cue": {
          "en": "learning Thai",
          "ko": "태국어를 배우다"
        },
        "gloss": {
          "en": "How long have you been learning Thai?",
          "ko": "태국어 배운 지 얼마나 됐어요?"
        }
      },
      {
        "text": "อยู่เมืองไทยมานานแค่ไหนแล้วครับ",
        "slot": "อยู่เมืองไทย",
        "cue": {
          "en": "living in Thailand",
          "ko": "태국에 살다"
        },
        "gloss": {
          "en": "How long have you lived in Thailand?",
          "ko": "태국에 산 지 얼마나 됐어요?"
        }
      },
      {
        "text": "รอมานานแค่ไหนแล้วครับ",
        "slot": "รอ",
        "cue": {
          "en": "waiting",
          "ko": "기다리다"
        },
        "gloss": {
          "en": "How long have you been waiting?",
          "ko": "기다린 지 얼마나 됐어요?"
        }
      },
      {
        "text": "ทำงานที่นี่มานานแค่ไหนแล้วคะ",
        "slot": "ทำงานที่นี่",
        "cue": {
          "en": "working here (a woman speaking)",
          "ko": "여기서 일하다(여성 화자)"
        },
        "gloss": {
          "en": "How long have you worked here?",
          "ko": "여기서 일한 지 얼마나 됐어요?"
        }
      }
    ]
  },
  {
    "id": "th-f4-01",
    "stage": 4,
    "fn": "concede",
    "pattern": "ถึงแม้ว่า___ แต่…",
    "core": [
      "ถึงแม้ว่า"
    ],
    "meaning": {
      "en": "Conceding a point: Although ___, …",
      "ko": "일부 인정하기: ___지만 …"
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ถึงแม้ว่าราคาจะสูง แต่คุณภาพคุ้มค่ามากครับ",
        "slot": "ราคาจะสูง",
        "cue": {
          "en": "the price is high",
          "ko": "값이 비싸다"
        },
        "gloss": {
          "en": "Although the price is high, the quality is well worth it.",
          "ko": "값은 비싸지만 품질이 그만한 가치가 있어요."
        }
      },
      {
        "text": "ถึงแม้ว่าผมจะเหนื่อย แต่จะทำรายงานให้เสร็จคืนนี้ครับ",
        "slot": "ผมจะเหนื่อย",
        "cue": {
          "en": "I am tired",
          "ko": "내가 피곤하다"
        },
        "gloss": {
          "en": "Although I'm tired, I'll finish the report tonight.",
          "ko": "피곤하지만 오늘 밤에 보고서를 끝낼게요."
        }
      },
      {
        "text": "ถึงแม้ว่าบ้านจะไกล แต่ผมพร้อมย้ายครับ",
        "slot": "บ้านจะไกล",
        "cue": {
          "en": "home is far",
          "ko": "집이 멀다"
        },
        "gloss": {
          "en": "Although my home is far, I'm ready to move.",
          "ko": "집이 멀지만 이사할 준비가 돼 있어요."
        }
      },
      {
        "text": "ถึงแม้ว่าแผนนี้จะใช้เวลานาน แต่ความเสี่ยงต่ำกว่าครับ",
        "slot": "แผนนี้จะใช้เวลานาน",
        "cue": {
          "en": "this plan takes a long time",
          "ko": "이 안은 시간이 오래 걸리다"
        },
        "gloss": {
          "en": "Although this plan takes longer, the risk is lower.",
          "ko": "이 안은 시간이 오래 걸리지만 위험이 더 낮아요."
        }
      }
    ]
  },
  {
    "id": "th-f4-02",
    "stage": 4,
    "fn": "report",
    "pattern": "…ถูก___ครับ",
    "core": [
      "ถูก"
    ],
    "meaning": {
      "en": "Saying something bad happened to someone: … got ___ (passive)",
      "ko": "당한 일 말하기: …이 ___당했어요"
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "เขาถูกหัวหน้าตำหนิต่อหน้าทุกคนครับ",
        "slot": "หัวหน้าตำหนิ",
        "cue": {
          "en": "the boss scolds",
          "ko": "상사가 꾸짖다"
        },
        "gloss": {
          "en": "He was scolded by the boss in front of everyone.",
          "ko": "그는 모두 앞에서 상사한테 혼났어요."
        }
      },
      {
        "text": "กระเป๋าของผมถูกขโมยที่สถานีครับ",
        "slot": "ขโมย",
        "cue": {
          "en": "steal",
          "ko": "훔치다"
        },
        "gloss": {
          "en": "My bag was stolen at the station.",
          "ko": "역에서 가방을 도둑맞았어요."
        }
      },
      {
        "text": "โปรเจกต์นี้ถูกยกเลิกกะทันหันครับ",
        "slot": "ยกเลิก",
        "cue": {
          "en": "cancel",
          "ko": "취소하다"
        },
        "gloss": {
          "en": "This project was suddenly cancelled.",
          "ko": "이 프로젝트가 갑자기 취소됐어요."
        }
      },
      {
        "text": "เพื่อนร่วมงานของผมถูกย้ายไปสาขาอื่นครับ",
        "slot": "ย้ายไปสาขาอื่น",
        "cue": {
          "en": "be transferred to another branch",
          "ko": "다른 지점으로 옮기다"
        },
        "gloss": {
          "en": "My colleague was transferred to another branch.",
          "ko": "동료가 다른 지점으로 발령 났어요."
        }
      }
    ]
  },
  {
    "id": "th-f4-03",
    "stage": 4,
    "fn": "explain-process",
    "pattern": "…โดย___ครับ",
    "core": [
      "โดย"
    ],
    "meaning": {
      "en": "Explaining how: … by ___",
      "ko": "방법 말하기: ___해서(___하는 방법으로) …"
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "เราจะแก้ปัญหานี้โดยเพิ่มคนอีกสองคนครับ",
        "slot": "เพิ่มคนอีกสองคน",
        "cue": {
          "en": "add two more people",
          "ko": "두 사람을 더 넣다"
        },
        "gloss": {
          "en": "We'll solve this by adding two more people.",
          "ko": "두 사람을 더 넣어서 이 문제를 해결할 거예요."
        }
      },
      {
        "text": "ผมเรียนภาษาไทยโดยดูละครทุกคืนครับ",
        "slot": "ดูละครทุกคืน",
        "cue": {
          "en": "watch dramas every night",
          "ko": "매일 밤 드라마를 보다"
        },
        "gloss": {
          "en": "I learn Thai by watching dramas every night.",
          "ko": "매일 밤 드라마를 보면서 태국어를 배워요."
        }
      },
      {
        "text": "เราลดต้นทุนโดยใช้ผู้ผลิตในประเทศครับ",
        "slot": "ใช้ผู้ผลิตในประเทศ",
        "cue": {
          "en": "use local manufacturers",
          "ko": "국내 제조사를 쓰다"
        },
        "gloss": {
          "en": "We cut costs by using local manufacturers.",
          "ko": "국내 제조사를 써서 비용을 줄였어요."
        }
      },
      {
        "text": "ผมแก้โดยรายงานความคืบหน้าให้ลูกค้าทุกวันครับ",
        "slot": "รายงานความคืบหน้าให้ลูกค้าทุกวัน",
        "cue": {
          "en": "report progress to the client every day",
          "ko": "매일 고객에게 진행 상황을 보고하다"
        },
        "gloss": {
          "en": "I fixed it by reporting progress to the client every day.",
          "ko": "매일 고객에게 진행 상황을 보고해서 해결했어요."
        }
      }
    ]
  },
  {
    "id": "th-f4-04",
    "stage": 4,
    "fn": "deadline",
    "pattern": "…จนกว่า___นะครับ",
    "core": [
      "จนกว่า"
    ],
    "meaning": {
      "en": "Saying until when: … until ___",
      "ko": "～할 때까지: ___할 때까지 …"
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "รอจนกว่าลูกค้าจะตอบกลับนะครับ",
        "slot": "ลูกค้าจะตอบกลับ",
        "cue": {
          "en": "the client replies",
          "ko": "고객이 답하다"
        },
        "gloss": {
          "en": "Let's wait until the client replies.",
          "ko": "고객이 답할 때까지 기다려요."
        }
      },
      {
        "text": "ผมจะอยู่ออฟฟิศจนกว่างานจะเสร็จนะครับ",
        "slot": "งานจะเสร็จ",
        "cue": {
          "en": "the work is done",
          "ko": "일이 끝나다"
        },
        "gloss": {
          "en": "I'll stay at the office until the work is done.",
          "ko": "일이 끝날 때까지 사무실에 있을게요."
        }
      },
      {
        "text": "อย่าเพิ่งส่งอีเมลจนกว่าหัวหน้าจะอนุมัตินะครับ",
        "slot": "หัวหน้าจะอนุมัติ",
        "cue": {
          "en": "the boss approves",
          "ko": "상사가 승인하다"
        },
        "gloss": {
          "en": "Don't send the email until the boss approves.",
          "ko": "상사가 승인할 때까지 메일 보내지 마세요."
        }
      },
      {
        "text": "ห้ามใช้ห้องนี้จนกว่าช่างจะซ่อมแอร์เสร็จนะครับ",
        "slot": "ช่างจะซ่อมแอร์เสร็จ",
        "cue": {
          "en": "the technician finishes fixing the air con",
          "ko": "기사가 에어컨 수리를 마치다"
        },
        "gloss": {
          "en": "Don't use this room until the technician has fixed the air con.",
          "ko": "기사가 에어컨을 다 고칠 때까지 이 방은 쓰지 마세요."
        }
      }
    ]
  },
  {
    "id": "th-f4-05",
    "stage": 4,
    "fn": "guess",
    "pattern": "…คง___ครับ",
    "core": [
      "คง"
    ],
    "meaning": {
      "en": "Saying something is probably so: … probably ___",
      "ko": "확신 정도(아마 ～일 거예요): 아마 ___일 거예요"
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "โครงการนี้คงเสร็จไม่ทันสิ้นเดือนครับ",
        "slot": "เสร็จไม่ทันสิ้นเดือน",
        "cue": {
          "en": "not finish by the end of the month",
          "ko": "월말까지 못 끝내다"
        },
        "gloss": {
          "en": "This project probably won't be done by the end of the month.",
          "ko": "이 프로젝트는 아마 월말까지 못 끝날 거예요."
        }
      },
      {
        "text": "วันนี้ฝนตกหนัก รถคงติดมากครับ",
        "slot": "ติดมาก",
        "cue": {
          "en": "be very jammed",
          "ko": "많이 막히다"
        },
        "gloss": {
          "en": "It's raining hard today, so traffic is probably terrible.",
          "ko": "오늘 비가 많이 와서 아마 차가 많이 막힐 거예요."
        }
      },
      {
        "text": "เขาไม่รับสาย คงประชุมอยู่ครับ",
        "slot": "ประชุมอยู่",
        "cue": {
          "en": "be in a meeting",
          "ko": "회의 중이다"
        },
        "gloss": {
          "en": "He's not answering; he's probably in a meeting.",
          "ko": "전화를 안 받네요. 아마 회의 중일 거예요."
        }
      },
      {
        "text": "ราคาแค่นี้ลูกค้าคงไม่ยอมครับ",
        "slot": "ไม่ยอม",
        "cue": {
          "en": "not accept",
          "ko": "받아들이지 않다"
        },
        "gloss": {
          "en": "At this price, the client probably won't accept.",
          "ko": "이 가격이면 고객이 아마 안 받아들일 거예요."
        }
      }
    ]
  },
  {
    "id": "th-f4-06",
    "stage": 4,
    "fn": "guess",
    "pattern": "…อาจจะ___ก็ได้ครับ",
    "core": [
      "อาจจะ"
    ],
    "meaning": {
      "en": "Saying something might happen: … might ___",
      "ko": "확신 정도(～할 수도 있어요): ___할 수도 있어요"
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "พรุ่งนี้ผมอาจจะเข้าออฟฟิศสายหน่อยก็ได้ครับ",
        "slot": "เข้าออฟฟิศสายหน่อย",
        "cue": {
          "en": "come into the office a bit late",
          "ko": "사무실에 조금 늦게 오다"
        },
        "gloss": {
          "en": "I might come into the office a bit late tomorrow.",
          "ko": "내일 사무실에 조금 늦게 갈 수도 있어요."
        }
      },
      {
        "text": "ด่านทางบกอาจจะเก็บค่าธรรมเนียมทีหลังก็ได้ครับ",
        "slot": "เก็บค่าธรรมเนียมทีหลัง",
        "cue": {
          "en": "collect the fee later",
          "ko": "수수료를 나중에 받다"
        },
        "gloss": {
          "en": "Land borders might collect the fee later.",
          "ko": "육로 국경에서는 수수료를 나중에 받을 수도 있어요."
        }
      },
      {
        "text": "ลูกค้าอาจจะขอเปลี่ยนแบบอีกก็ได้ครับ",
        "slot": "ขอเปลี่ยนแบบอีก",
        "cue": {
          "en": "ask to change the design again",
          "ko": "디자인을 또 바꿔 달라고 하다"
        },
        "gloss": {
          "en": "The client might ask to change the design again.",
          "ko": "고객이 디자인을 또 바꿔 달라고 할 수도 있어요."
        }
      },
      {
        "text": "ถ้าเลื่อนประชุม เราอาจจะต้องทำงานวันเสาร์ก็ได้ครับ",
        "slot": "ต้องทำงานวันเสาร์",
        "cue": {
          "en": "have to work on Saturday",
          "ko": "토요일에 일해야 하다"
        },
        "gloss": {
          "en": "If the meeting is postponed, we might have to work on Saturday.",
          "ko": "회의가 미뤄지면 토요일에 일해야 할 수도 있어요."
        }
      }
    ]
  },
  {
    "id": "th-f4-07",
    "stage": 4,
    "fn": "persuade",
    "pattern": "ไม่ว่า___ ก็…",
    "core": [
      "ไม่ว่า"
    ],
    "meaning": {
      "en": "Saying it doesn't matter which: No matter ___, …",
      "ko": "～든 상관없이: ___든 …"
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ไม่ว่าจะเลือกแบบไหน ก็ต้องใช้เวลาอย่างน้อยหนึ่งเดือนครับ",
        "slot": "จะเลือกแบบไหน",
        "cue": {
          "en": "whichever option we choose",
          "ko": "어느 안을 고르다"
        },
        "gloss": {
          "en": "Whichever option we choose, it'll take at least a month.",
          "ko": "어느 안을 고르든 적어도 한 달은 걸려요."
        }
      },
      {
        "text": "ไม่ว่าฝนจะตกหรือไม่ เราก็จะจัดงานตามเดิมครับ",
        "slot": "ฝนจะตกหรือไม่",
        "cue": {
          "en": "whether or not it rains",
          "ko": "비가 오든 안 오든"
        },
        "gloss": {
          "en": "Whether it rains or not, we'll hold the event as planned.",
          "ko": "비가 오든 안 오든 행사는 예정대로 해요."
        }
      },
      {
        "text": "ไม่ว่าใครจะเป็นหัวหน้าทีม ผมก็พร้อมช่วยเต็มที่ครับ",
        "slot": "ใครจะเป็นหัวหน้าทีม",
        "cue": {
          "en": "whoever becomes team leader",
          "ko": "누가 팀장이 되다"
        },
        "gloss": {
          "en": "Whoever becomes team leader, I'm ready to help all I can.",
          "ko": "누가 팀장이 되든 저는 힘껏 도울게요."
        }
      },
      {
        "text": "ไม่ว่ายังไงผมก็จะดูแลห้องอย่างดีครับ",
        "slot": "ยังไง",
        "cue": {
          "en": "whatever happens",
          "ko": "어떻게 되다"
        },
        "gloss": {
          "en": "Whatever happens, I'll take good care of the room.",
          "ko": "어떻게 되든 방은 잘 관리할게요."
        }
      }
    ]
  },
  {
    "id": "th-f4-08",
    "stage": 4,
    "fn": "report",
    "pattern": "เท่าที่ผม___ …",
    "core": [
      "เท่าที่"
    ],
    "meaning": {
      "en": "Reporting what you know so far: As far as I ___, …",
      "ko": "～하는 한: 제가 ___한 바로는 …"
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "เท่าที่ผมทราบ ลูกค้ายังไม่ได้ตัดสินใจครับ",
        "slot": "ทราบ",
        "cue": {
          "en": "know (polite)",
          "ko": "알다(공손)"
        },
        "gloss": {
          "en": "As far as I know, the client hasn't decided yet.",
          "ko": "제가 알기로는 고객이 아직 결정 안 했어요."
        }
      },
      {
        "text": "เท่าที่ผมดูมา ห้องขนาดนี้ราคาประมาณนี้ครับ",
        "slot": "ดูมา",
        "cue": {
          "en": "have looked around",
          "ko": "둘러보다"
        },
        "gloss": {
          "en": "From what I've seen, rooms this size cost about this much.",
          "ko": "제가 본 바로는 이 크기 방은 이 정도 가격이에요."
        }
      },
      {
        "text": "เท่าที่ผมอ่านมา กฎใหม่จะเริ่มปีหน้าครับ",
        "slot": "อ่านมา",
        "cue": {
          "en": "have read",
          "ko": "읽어 보다"
        },
        "gloss": {
          "en": "From what I've read, the new rule starts next year.",
          "ko": "제가 읽은 바로는 새 규정이 내년부터 시작돼요."
        }
      },
      {
        "text": "เท่าที่ผมจำได้ เราเคยคุยเรื่องนี้แล้วครับ",
        "slot": "จำได้",
        "cue": {
          "en": "remember",
          "ko": "기억하다"
        },
        "gloss": {
          "en": "As far as I remember, we've already talked about this.",
          "ko": "제 기억으로는 이 얘기는 전에 했어요."
        }
      }
    ]
  },
  {
    "id": "th-f4-09",
    "stage": 4,
    "fn": "the-more",
    "pattern": "ยิ่ง___ ยิ่ง…",
    "core": [
      "ยิ่ง"
    ],
    "meaning": {
      "en": "Saying the more…, the more…: The more ___, the more …",
      "ko": "～할수록 ～: ___할수록 …"
    },
    "grammar": [
      7
    ],
    "expressions": [
      "เลื่อนออกไป"
    ],
    "examples": [
      {
        "text": "ยิ่งรอนาน ยิ่งเสียโอกาสครับ",
        "slot": "รอนาน",
        "cue": {
          "en": "wait long",
          "ko": "오래 기다리다"
        },
        "gloss": {
          "en": "The longer we wait, the more chances we lose.",
          "ko": "오래 기다릴수록 기회를 잃어요."
        }
      },
      {
        "text": "ยิ่งฝึกพูดบ่อย ยิ่งมั่นใจครับ",
        "slot": "ฝึกพูดบ่อย",
        "cue": {
          "en": "practise speaking often",
          "ko": "자주 말하기 연습을 하다"
        },
        "gloss": {
          "en": "The more you practise speaking, the more confident you get.",
          "ko": "말하기를 자주 연습할수록 자신감이 생겨요."
        }
      },
      {
        "text": "ยิ่งราคาถูก คนยิ่งซื้อเยอะครับ",
        "slot": "ราคาถูก",
        "cue": {
          "en": "the price is low",
          "ko": "값이 싸다"
        },
        "gloss": {
          "en": "The cheaper it is, the more people buy.",
          "ko": "값이 쌀수록 사람들이 많이 사요."
        }
      },
      {
        "text": "ยิ่งเราเลื่อนออกไปนาน ลูกค้ายิ่งไม่มั่นใจครับ",
        "slot": "เราเลื่อนออกไปนาน",
        "cue": {
          "en": "we postpone for long",
          "ko": "우리가 오래 미루다"
        },
        "gloss": {
          "en": "The longer we postpone, the less confident the client gets.",
          "ko": "오래 미룰수록 고객이 불안해해요."
        }
      }
    ]
  },
  {
    "id": "th-f4-10",
    "stage": 4,
    "fn": "report",
    "pattern": "ตามที่คุยกันไว้ ___ครับ",
    "core": [
      "ตามที่คุยกันไว้"
    ],
    "meaning": {
      "en": "Referring back to what was agreed: As we discussed, ___",
      "ko": "합의한 것 짚기: 얘기한 대로 ___"
    },
    "grammar": [],
    "expressions": [
      "ตามที่คุยกันไว้"
    ],
    "examples": [
      {
        "text": "ตามที่คุยกันไว้ ผมส่งร่างสัญญาให้แล้วครับ",
        "slot": "ผมส่งร่างสัญญาให้แล้ว",
        "cue": {
          "en": "I have sent the draft contract",
          "ko": "계약서 초안을 보냈다"
        },
        "gloss": {
          "en": "As we discussed, I've sent you the draft contract.",
          "ko": "얘기한 대로 계약서 초안을 보내 드렸어요."
        }
      },
      {
        "text": "ตามที่คุยกันไว้ เราจะประชุมกันอีกทีวันจันทร์ครับ",
        "slot": "เราจะประชุมกันอีกทีวันจันทร์",
        "cue": {
          "en": "we meet again on Monday",
          "ko": "월요일에 다시 회의하다"
        },
        "gloss": {
          "en": "As we agreed, we'll meet again on Monday.",
          "ko": "얘기한 대로 월요일에 다시 회의해요."
        }
      },
      {
        "text": "ตามที่คุยกันไว้ ทีมออกแบบจะส่งงานก่อนสิ้นเดือนครับ",
        "slot": "ทีมออกแบบจะส่งงานก่อนสิ้นเดือน",
        "cue": {
          "en": "the design team delivers before month end",
          "ko": "디자인팀이 월말 전에 넘기다"
        },
        "gloss": {
          "en": "As discussed, the design team will deliver before the end of the month.",
          "ko": "얘기한 대로 디자인팀이 월말 전에 넘길 거예요."
        }
      },
      {
        "text": "ตามที่คุยกันไว้ ค่าเช่ารวมค่าน้ำแล้วนะครับ",
        "slot": "ค่าเช่ารวมค่าน้ำแล้วนะ",
        "cue": {
          "en": "the rent includes water",
          "ko": "월세에 수도세가 포함되다"
        },
        "gloss": {
          "en": "As we agreed, the rent includes water.",
          "ko": "얘기한 대로 월세에 수도세가 포함돼 있어요."
        }
      }
    ]
  },
  {
    "id": "th-f4-11",
    "stage": 4,
    "fn": "feedback-give",
    "pattern": "พูดตรงๆ นะครับ ___",
    "core": [
      "พูดตรงๆ นะ"
    ],
    "meaning": {
      "en": "Giving frank feedback: To be honest, ___",
      "ko": "솔직하게 피드백하기: 솔직히 말하면 ___"
    },
    "grammar": [],
    "expressions": [
      "พูดตรงๆ นะ"
    ],
    "examples": [
      {
        "text": "พูดตรงๆ นะครับ รายงานนี้ยังไม่พร้อมส่งลูกค้าครับ",
        "slot": "รายงานนี้ยังไม่พร้อมส่งลูกค้า",
        "cue": {
          "en": "this report isn't ready for the client",
          "ko": "이 보고서는 아직 고객에게 보낼 수 없다"
        },
        "gloss": {
          "en": "To be honest, this report isn't ready to send to the client.",
          "ko": "솔직히 이 보고서는 아직 고객에게 보낼 수준이 아니에요."
        }
      },
      {
        "text": "พูดตรงๆ นะครับ ผมว่าสีนี้ดูเก่าไปหน่อย",
        "slot": "ผมว่าสีนี้ดูเก่าไปหน่อย",
        "cue": {
          "en": "I think this colour looks a bit dated",
          "ko": "이 색은 좀 낡아 보이다"
        },
        "gloss": {
          "en": "To be honest, I think this colour looks a bit dated.",
          "ko": "솔직히 이 색은 좀 촌스러워 보여요."
        }
      },
      {
        "text": "พูดตรงๆ นะครับ งบเท่านี้ทำไม่ได้ครับ",
        "slot": "งบเท่านี้ทำไม่ได้",
        "cue": {
          "en": "it can't be done on this budget",
          "ko": "이 예산으로는 못 하다"
        },
        "gloss": {
          "en": "Frankly, it can't be done on this budget.",
          "ko": "솔직히 이 예산으로는 안 돼요."
        }
      },
      {
        "text": "พูดตรงๆ นะครับ พี่พูดเร็วไปหน่อยตอนนำเสนอ",
        "slot": "พี่พูดเร็วไปหน่อยตอนนำเสนอ",
        "cue": {
          "en": "you spoke a bit fast in the presentation",
          "ko": "발표 때 좀 빨리 말하다"
        },
        "gloss": {
          "en": "To be honest, you spoke a bit fast in the presentation.",
          "ko": "솔직히 발표 때 좀 빨리 말하셨어요."
        }
      }
    ]
  },
  {
    "id": "th-f4-12",
    "stage": 4,
    "fn": "opinion",
    "pattern": "ในความเห็นส่วนตัว ผมว่า___ครับ",
    "core": [
      "ในความเห็นส่วนตัว"
    ],
    "meaning": {
      "en": "Giving a personal view: Personally, I think ___",
      "ko": "개인 의견 말하기: 개인적으로는 ___라고 생각해요"
    },
    "grammar": [],
    "expressions": [
      "ในความเห็นส่วนตัว"
    ],
    "examples": [
      {
        "text": "ในความเห็นส่วนตัว ผมว่าก็สมเหตุสมผลนะครับ",
        "slot": "ก็สมเหตุสมผลนะ",
        "cue": {
          "en": "it is reasonable",
          "ko": "합리적이다"
        },
        "gloss": {
          "en": "Personally, I think it's reasonable.",
          "ko": "개인적으로는 합리적이라고 생각해요."
        }
      },
      {
        "text": "ในความเห็นส่วนตัว ผมว่าแบบที่สองดีกว่าครับ",
        "slot": "แบบที่สองดีกว่า",
        "cue": {
          "en": "the second option is better",
          "ko": "두 번째 안이 낫다"
        },
        "gloss": {
          "en": "Personally, I think the second option is better.",
          "ko": "개인적으로는 두 번째 안이 더 나아요."
        }
      },
      {
        "text": "ในความเห็นส่วนตัว ผมว่าควรรออีกสักเดือนครับ",
        "slot": "ควรรออีกสักเดือน",
        "cue": {
          "en": "we should wait another month",
          "ko": "한 달쯤 더 기다려야 하다"
        },
        "gloss": {
          "en": "Personally, I think we should wait another month or so.",
          "ko": "개인적으로는 한 달쯤 더 기다려야 한다고 봐요."
        }
      },
      {
        "text": "ในความเห็นส่วนตัว ผมว่าการทำงานที่บ้านเหมาะกับทีมเราครับ",
        "slot": "การทำงานที่บ้านเหมาะกับทีมเรา",
        "cue": {
          "en": "working from home suits our team",
          "ko": "재택근무가 우리 팀에 맞다"
        },
        "gloss": {
          "en": "Personally, I think working from home suits our team.",
          "ko": "개인적으로는 재택근무가 우리 팀에 맞는다고 생각해요."
        }
      }
    ]
  },
  {
    "id": "th-f4-13",
    "stage": 4,
    "fn": "disagree-soft",
    "pattern": "ผมไม่ค่อยเห็นด้วยกับ___ครับ",
    "core": [
      "ไม่ค่อยเห็นด้วย"
    ],
    "meaning": {
      "en": "Disagreeing gently: I don't quite agree with ___",
      "ko": "부드럽게 반대하기: ___에는 별로 동의하지 않아요"
    },
    "grammar": [],
    "expressions": [
      "ไม่ค่อยเห็นด้วย"
    ],
    "examples": [
      {
        "text": "ผมไม่ค่อยเห็นด้วยกับแผนลดคนครับ",
        "slot": "แผนลดคน",
        "cue": {
          "en": "the plan to cut staff",
          "ko": "인원 감축안"
        },
        "gloss": {
          "en": "I don't quite agree with the plan to cut staff.",
          "ko": "인원 감축안에는 별로 동의하지 않아요."
        }
      },
      {
        "text": "ผมไม่ค่อยเห็นด้วยกับการขึ้นราคาตอนนี้ครับ",
        "slot": "การขึ้นราคาตอนนี้",
        "cue": {
          "en": "raising prices now",
          "ko": "지금 가격을 올리는 것"
        },
        "gloss": {
          "en": "I don't really agree with raising prices now.",
          "ko": "지금 가격을 올리는 건 별로 찬성하지 않아요."
        }
      },
      {
        "text": "ผมไม่ค่อยเห็นด้วยกับความเห็นของพี่เรื่องนี้ครับ",
        "slot": "ความเห็นของพี่เรื่องนี้",
        "cue": {
          "en": "your view on this",
          "ko": "이 일에 대한 당신 의견"
        },
        "gloss": {
          "en": "I don't quite agree with your view on this.",
          "ko": "이 일에 대한 선배 의견에는 별로 동의하지 않아요."
        }
      },
      {
        "text": "ผมไม่ค่อยเห็นด้วยกับกฎใหม่ของหมู่บ้านครับ",
        "slot": "กฎใหม่ของหมู่บ้าน",
        "cue": {
          "en": "the new rule in our housing estate",
          "ko": "단지의 새 규칙"
        },
        "gloss": {
          "en": "I don't really agree with the estate's new rule.",
          "ko": "단지의 새 규칙에는 별로 동의하지 않아요."
        }
      }
    ]
  },
  {
    "id": "th-f4-14",
    "stage": 4,
    "fn": "pros-cons",
    "pattern": "___มีข้อดีข้อเสียครับ",
    "core": [
      "มีข้อดีข้อเสีย"
    ],
    "meaning": {
      "en": "Weighing pros and cons: ___ has its pros and cons",
      "ko": "장단점 따지기: ___에는 장단점이 있어요"
    },
    "grammar": [],
    "expressions": [
      "มีข้อดีข้อเสีย"
    ],
    "examples": [
      {
        "text": "ทั้งสองแบบมีข้อดีข้อเสียครับ",
        "slot": "ทั้งสองแบบ",
        "cue": {
          "en": "both options",
          "ko": "두 안 모두"
        },
        "gloss": {
          "en": "Both options have their pros and cons.",
          "ko": "두 안 모두 장단점이 있어요."
        }
      },
      {
        "text": "การทำงานที่บ้านมีข้อดีข้อเสียครับ",
        "slot": "การทำงานที่บ้าน",
        "cue": {
          "en": "working from home",
          "ko": "재택근무"
        },
        "gloss": {
          "en": "Working from home has its pros and cons.",
          "ko": "재택근무에는 장단점이 있어요."
        }
      },
      {
        "text": "การเช่าคอนโดใกล้รถไฟฟ้ามีข้อดีข้อเสียครับ",
        "slot": "การเช่าคอนโดใกล้รถไฟฟ้า",
        "cue": {
          "en": "renting a condo near the skytrain",
          "ko": "전철역 근처 콘도를 빌리는 것"
        },
        "gloss": {
          "en": "Renting a condo near the skytrain has pros and cons.",
          "ko": "전철역 근처 콘도를 빌리는 데는 장단점이 있어요."
        }
      },
      {
        "text": "ระบบใหม่นี้มีข้อดีข้อเสียครับ",
        "slot": "ระบบใหม่นี้",
        "cue": {
          "en": "this new system",
          "ko": "이 새 시스템"
        },
        "gloss": {
          "en": "This new system has its pros and cons.",
          "ko": "이 새 시스템에는 장단점이 있어요."
        }
      }
    ]
  },
  {
    "id": "th-f4-15",
    "stage": 4,
    "fn": "negotiate",
    "pattern": "___ต่อรองได้ไหมครับ",
    "core": [
      "ต่อรองได้ไหม"
    ],
    "meaning": {
      "en": "Opening a negotiation: Is ___ negotiable?",
      "ko": "조건 조율하기: ___ 조정할 수 있을까요?"
    },
    "grammar": [],
    "expressions": [
      "ต่อรองได้ไหม"
    ],
    "examples": [
      {
        "text": "ค่าเช่าต่อรองได้ไหมครับ",
        "slot": "ค่าเช่า",
        "cue": {
          "en": "the rent",
          "ko": "월세"
        },
        "gloss": {
          "en": "Is the rent negotiable?",
          "ko": "월세 조정할 수 있을까요?"
        }
      },
      {
        "text": "ราคานี้ต่อรองได้ไหมครับ",
        "slot": "ราคานี้",
        "cue": {
          "en": "this price",
          "ko": "이 가격"
        },
        "gloss": {
          "en": "Is this price negotiable?",
          "ko": "이 가격 조정 가능할까요?"
        }
      },
      {
        "text": "วันส่งงานต่อรองได้ไหมครับ",
        "slot": "วันส่งงาน",
        "cue": {
          "en": "the delivery date",
          "ko": "납품일"
        },
        "gloss": {
          "en": "Can we negotiate the delivery date?",
          "ko": "납품일을 조정할 수 있을까요?"
        }
      },
      {
        "text": "เงื่อนไขการจ่ายเงินต่อรองได้ไหมครับ",
        "slot": "เงื่อนไขการจ่ายเงิน",
        "cue": {
          "en": "the payment terms",
          "ko": "지불 조건"
        },
        "gloss": {
          "en": "Are the payment terms negotiable?",
          "ko": "지불 조건은 조정할 수 있을까요?"
        }
      }
    ]
  },
  {
    "id": "th-f4-16",
    "stage": 4,
    "fn": "decline",
    "pattern": "เรื่อง___ ขอคิดดูก่อนนะครับ",
    "core": [
      "ขอคิดดูก่อน"
    ],
    "meaning": {
      "en": "Buying time before deciding: About ___, let me think it over first",
      "ko": "결정 미루기: ___는 좀 생각해 볼게요"
    },
    "grammar": [],
    "expressions": [
      "ขอคิดดูก่อน"
    ],
    "examples": [
      {
        "text": "เรื่องราคา ขอคิดดูก่อนนะครับ",
        "slot": "ราคา",
        "cue": {
          "en": "the price",
          "ko": "가격"
        },
        "gloss": {
          "en": "About the price, let me think it over first.",
          "ko": "가격은 좀 생각해 볼게요."
        }
      },
      {
        "text": "เรื่องสัญญาสองปี ขอคิดดูก่อนนะครับ",
        "slot": "สัญญาสองปี",
        "cue": {
          "en": "a two-year contract",
          "ko": "이 년 계약"
        },
        "gloss": {
          "en": "As for a two-year contract, let me think about it first.",
          "ko": "이 년 계약은 좀 생각해 볼게요."
        }
      },
      {
        "text": "เรื่องย้ายไปสาขาเชียงใหม่ ขอคิดดูก่อนนะครับ",
        "slot": "ย้ายไปสาขาเชียงใหม่",
        "cue": {
          "en": "moving to the Chiang Mai branch",
          "ko": "치앙마이 지점으로 옮기는 것"
        },
        "gloss": {
          "en": "About moving to the Chiang Mai branch, let me think it over.",
          "ko": "치앙마이 지점으로 옮기는 건 좀 생각해 볼게요."
        }
      },
      {
        "text": "เรื่องข้อเสนอของคุณ ขอคิดดูก่อนนะครับ",
        "slot": "ข้อเสนอของคุณ",
        "cue": {
          "en": "your offer",
          "ko": "당신의 제안"
        },
        "gloss": {
          "en": "About your offer, let me think about it first.",
          "ko": "제안해 주신 건 좀 생각해 볼게요."
        }
      }
    ]
  },
  {
    "id": "th-f4-17",
    "stage": 4,
    "fn": "report",
    "pattern": "สรุปว่า___ ตกลงตามนี้นะครับ",
    "core": [
      "สรุปว่า"
    ],
    "meaning": {
      "en": "Wrapping up a decision: So, to sum up, ___ — agreed?",
      "ko": "정리해서 확정하기: 정리하면 ___, 이대로 해요"
    },
    "grammar": [],
    "expressions": [
      "สรุปว่า",
      "ตกลงตามนี้"
    ],
    "examples": [
      {
        "text": "สรุปว่าเราตัดฟีเจอร์ก่อน ตกลงตามนี้นะครับ",
        "slot": "เราตัดฟีเจอร์ก่อน",
        "cue": {
          "en": "we cut features first",
          "ko": "기능을 먼저 줄이다"
        },
        "gloss": {
          "en": "So we cut features first — agreed?",
          "ko": "정리하면 기능부터 줄이는 거예요. 이대로 해요."
        }
      },
      {
        "text": "สรุปว่าประชุมครั้งหน้าวันพุธ ตกลงตามนี้นะครับ",
        "slot": "ประชุมครั้งหน้าวันพุธ",
        "cue": {
          "en": "the next meeting is on Wednesday",
          "ko": "다음 회의는 수요일"
        },
        "gloss": {
          "en": "So the next meeting is on Wednesday — agreed?",
          "ko": "정리하면 다음 회의는 수요일이에요. 이대로 해요."
        }
      },
      {
        "text": "สรุปว่าทีมขายดูแลลูกค้ารายนี้ ตกลงตามนี้นะครับ",
        "slot": "ทีมขายดูแลลูกค้ารายนี้",
        "cue": {
          "en": "the sales team handles this client",
          "ko": "영업팀이 이 고객을 맡다"
        },
        "gloss": {
          "en": "So the sales team handles this client — agreed?",
          "ko": "정리하면 이 고객은 영업팀이 맡아요. 이대로 해요."
        }
      },
      {
        "text": "สรุปว่าเราไม่เลื่อนวันเปิดร้าน ตกลงตามนี้นะครับ",
        "slot": "เราไม่เลื่อนวันเปิดร้าน",
        "cue": {
          "en": "we don't postpone the opening day",
          "ko": "개업일을 미루지 않다"
        },
        "gloss": {
          "en": "So we won't postpone the opening — agreed?",
          "ko": "정리하면 개업일은 안 미뤄요. 이대로 해요."
        }
      }
    ]
  },
  {
    "id": "th-f4-18",
    "stage": 4,
    "fn": "persuade",
    "pattern": "ประเด็นคือ___ครับ",
    "core": [
      "ประเด็นคือ"
    ],
    "meaning": {
      "en": "Getting to the real point: The point is ___",
      "ko": "핵심 짚기: 핵심은 ___예요"
    },
    "grammar": [],
    "expressions": [
      "ประเด็นคือ"
    ],
    "examples": [
      {
        "text": "ประเด็นคือเรามีคนไม่พอครับ",
        "slot": "เรามีคนไม่พอ",
        "cue": {
          "en": "we don't have enough people",
          "ko": "사람이 모자라다"
        },
        "gloss": {
          "en": "The point is we don't have enough people.",
          "ko": "핵심은 사람이 모자란다는 거예요."
        }
      },
      {
        "text": "ประเด็นคืองบประมาณปีนี้ถูกตัดไปครึ่งหนึ่งครับ",
        "slot": "งบประมาณปีนี้ถูกตัดไปครึ่งหนึ่ง",
        "cue": {
          "en": "this year's budget was cut by half",
          "ko": "올해 예산이 반으로 깎이다"
        },
        "gloss": {
          "en": "The point is this year's budget was cut by half.",
          "ko": "핵심은 올해 예산이 반으로 깎였다는 거예요."
        }
      },
      {
        "text": "ประเด็นคือลูกค้ายังไม่ได้ส่งข้อมูลมาครับ",
        "slot": "ลูกค้ายังไม่ได้ส่งข้อมูลมา",
        "cue": {
          "en": "the client hasn't sent the data yet",
          "ko": "고객이 아직 자료를 안 보내다"
        },
        "gloss": {
          "en": "The thing is, the client hasn't sent the data yet.",
          "ko": "핵심은 고객이 아직 자료를 안 보냈다는 거예요."
        }
      },
      {
        "text": "ประเด็นคือราคาไม่ใช่ปัญหา แต่เป็นเรื่องเวลาครับ",
        "slot": "ราคาไม่ใช่ปัญหา แต่เป็นเรื่องเวลา",
        "cue": {
          "en": "price isn't the problem, time is",
          "ko": "가격이 아니라 시간이 문제다"
        },
        "gloss": {
          "en": "The point is that price isn't the problem — time is.",
          "ko": "핵심은 가격이 아니라 시간이 문제라는 거예요."
        }
      }
    ]
  },
  {
    "id": "th-f4-19",
    "stage": 4,
    "fn": "clarify",
    "pattern": "จริงๆ แล้ว___ครับ",
    "core": [
      "จริงๆ แล้ว"
    ],
    "meaning": {
      "en": "Saying how things really are: Actually, ___",
      "ko": "사실 말하기: 사실은 ___"
    },
    "grammar": [],
    "expressions": [
      "จริงๆ แล้ว"
    ],
    "examples": [
      {
        "text": "จริงๆ แล้วผมชอบห้องนี้มากครับ",
        "slot": "ผมชอบห้องนี้มาก",
        "cue": {
          "en": "I like this room a lot",
          "ko": "이 방이 아주 마음에 들다"
        },
        "gloss": {
          "en": "Actually, I really like this room.",
          "ko": "사실 이 방이 아주 마음에 들어요."
        }
      },
      {
        "text": "จริงๆ แล้วงานนี้ไม่ได้ยากอย่างที่คิดครับ",
        "slot": "งานนี้ไม่ได้ยากอย่างที่คิด",
        "cue": {
          "en": "this job isn't as hard as people think",
          "ko": "이 일은 생각만큼 어렵지 않다"
        },
        "gloss": {
          "en": "Actually, this job isn't as hard as you'd think.",
          "ko": "사실 이 일은 생각만큼 어렵지 않아요."
        }
      },
      {
        "text": "จริงๆ แล้วผมไม่ได้โกรธเลยครับ",
        "slot": "ผมไม่ได้โกรธเลย",
        "cue": {
          "en": "I'm not angry at all",
          "ko": "전혀 화나지 않았다"
        },
        "gloss": {
          "en": "Actually, I'm not angry at all.",
          "ko": "사실 저 전혀 화 안 났어요."
        }
      },
      {
        "text": "จริงๆ แล้วลูกค้าอยากได้สีเข้มกว่านี้ครับ",
        "slot": "ลูกค้าอยากได้สีเข้มกว่านี้",
        "cue": {
          "en": "the client wants a darker colour",
          "ko": "고객은 더 진한 색을 원하다"
        },
        "gloss": {
          "en": "Actually, the client wants a darker colour than this.",
          "ko": "사실 고객은 이보다 진한 색을 원해요."
        }
      }
    ]
  },
  {
    "id": "th-f5-01",
    "stage": 5,
    "fn": "formal-humble",
    "pattern": "ขอขอบพระคุณทุกท่านที่___",
    "core": [
      "ขอบพระคุณ"
    ],
    "meaning": {
      "en": "Thanking formally: I sincerely thank everyone for ___",
      "ko": "격식 있게 감사하기: ___해 주신 모든 분께 깊이 감사드립니다"
    },
    "grammar": [
      0
    ],
    "expressions": [
      "ขอบพระคุณ"
    ],
    "examples": [
      {
        "text": "ดิฉันขอขอบพระคุณทุกท่านที่มาร่วมงานในวันนี้ค่ะ",
        "slot": "มาร่วมงานในวันนี้",
        "cue": {
          "en": "come to today's event",
          "ko": "오늘 행사에 오다"
        },
        "gloss": {
          "en": "I sincerely thank you all for coming today.",
          "ko": "오늘 행사에 와 주신 모든 분께 깊이 감사드립니다."
        }
      },
      {
        "text": "ผมขอขอบพระคุณทุกท่านที่รับฟังครับ",
        "slot": "รับฟัง",
        "cue": {
          "en": "listen",
          "ko": "들어 주다"
        },
        "gloss": {
          "en": "I sincerely thank you all for listening.",
          "ko": "들어 주신 모든 분께 깊이 감사드립니다."
        }
      },
      {
        "text": "ขอขอบพระคุณทุกท่านที่ให้การสนับสนุนโครงการนี้มาตลอดครับ",
        "slot": "ให้การสนับสนุนโครงการนี้มาตลอด",
        "cue": {
          "en": "support this project all along",
          "ko": "이 프로젝트를 늘 지원하다"
        },
        "gloss": {
          "en": "Our sincere thanks to everyone who has supported this project all along.",
          "ko": "이 프로젝트를 늘 지원해 주신 모든 분께 깊이 감사드립니다."
        }
      },
      {
        "text": "ดิฉันขอขอบพระคุณทุกท่านที่สละเวลามาในวันหยุดค่ะ",
        "slot": "สละเวลามาในวันหยุด",
        "cue": {
          "en": "give up your day off to come",
          "ko": "휴일에 시간을 내서 오다"
        },
        "gloss": {
          "en": "I sincerely thank you all for giving up your day off to be here.",
          "ko": "휴일에 시간 내서 와 주신 모든 분께 깊이 감사드립니다."
        }
      }
    ]
  },
  {
    "id": "th-f5-02",
    "stage": 5,
    "fn": "formal-humble",
    "pattern": "…รู้สึกเป็นเกียรติอย่างยิ่งที่ได้___",
    "core": [
      "เป็นเกียรติอย่างยิ่ง"
    ],
    "meaning": {
      "en": "Saying you are honoured (formal): It is a great honour to ___",
      "ko": "격식 있게 영광이라고 말하기: ___하게 되어 큰 영광입니다"
    },
    "grammar": [
      0
    ],
    "expressions": [
      "เป็นเกียรติอย่างยิ่ง"
    ],
    "examples": [
      {
        "text": "ผมรู้สึกเป็นเกียรติอย่างยิ่งที่ได้พูดในวันนี้ครับ",
        "slot": "พูดในวันนี้",
        "cue": {
          "en": "speak today",
          "ko": "오늘 말하다"
        },
        "gloss": {
          "en": "It is a great honour for me to speak today.",
          "ko": "오늘 이 자리에서 말씀드리게 되어 큰 영광입니다."
        }
      },
      {
        "text": "ดิฉันรู้สึกเป็นเกียรติอย่างยิ่งที่ได้รับรางวัลนี้ค่ะ",
        "slot": "รับรางวัลนี้",
        "cue": {
          "en": "receive this award",
          "ko": "이 상을 받다"
        },
        "gloss": {
          "en": "I am deeply honoured to receive this award.",
          "ko": "이 상을 받게 되어 큰 영광입니다."
        }
      },
      {
        "text": "ผมรู้สึกเป็นเกียรติอย่างยิ่งที่ได้ทำงานร่วมกับทุกท่านครับ",
        "slot": "ทำงานร่วมกับทุกท่าน",
        "cue": {
          "en": "work with all of you",
          "ko": "여러분과 함께 일하다"
        },
        "gloss": {
          "en": "It has been a great honour to work with you all.",
          "ko": "여러분과 함께 일하게 되어 큰 영광입니다."
        }
      },
      {
        "text": "ดิฉันรู้สึกเป็นเกียรติอย่างยิ่งที่ได้เป็นตัวแทนของทีมค่ะ",
        "slot": "เป็นตัวแทนของทีม",
        "cue": {
          "en": "represent the team",
          "ko": "팀을 대표하다"
        },
        "gloss": {
          "en": "I am deeply honoured to represent the team.",
          "ko": "팀을 대표하게 되어 큰 영광입니다."
        }
      }
    ]
  },
  {
    "id": "th-f5-03",
    "stage": 5,
    "fn": "opinion",
    "pattern": "…ถือว่า___ครับ",
    "core": [
      "ถือว่า"
    ],
    "meaning": {
      "en": "Evaluating something: It can be considered ___",
      "ko": "평가하기: ___라고 볼 수 있어요"
    },
    "grammar": [
      1
    ],
    "expressions": [
      "ถือว่าโอเค"
    ],
    "examples": [
      {
        "text": "ถือว่าเป็นโอกาสที่ดีมากสำหรับทีมเราครับ",
        "slot": "เป็นโอกาสที่ดีมากสำหรับทีมเรา",
        "cue": {
          "en": "a great opportunity for our team",
          "ko": "우리 팀에 아주 좋은 기회"
        },
        "gloss": {
          "en": "It's a really good opportunity for our team.",
          "ko": "우리 팀에게는 아주 좋은 기회라고 볼 수 있어요."
        }
      },
      {
        "text": "ยอดขายเดือนนี้ถือว่าโอเคครับ",
        "slot": "โอเค",
        "cue": {
          "en": "okay",
          "ko": "괜찮다"
        },
        "gloss": {
          "en": "This month's sales are fair enough.",
          "ko": "이번 달 매출은 괜찮은 편이라고 볼 수 있어요."
        }
      },
      {
        "text": "สำหรับมือใหม่ ถือว่าทำได้ดีมากแล้วครับ",
        "slot": "ทำได้ดีมากแล้ว",
        "cue": {
          "en": "have done very well",
          "ko": "아주 잘했다"
        },
        "gloss": {
          "en": "For a beginner, that's very good going.",
          "ko": "초보치고는 아주 잘한 거예요."
        }
      },
      {
        "text": "ราคานี้ถือว่าคุ้มค่าครับ",
        "slot": "คุ้มค่า",
        "cue": {
          "en": "good value",
          "ko": "값어치가 있다"
        },
        "gloss": {
          "en": "At this price, it's good value.",
          "ko": "이 가격이면 값어치가 있다고 봐요."
        }
      }
    ]
  },
  {
    "id": "th-f5-04",
    "stage": 5,
    "fn": "compliment",
    "pattern": "…นับว่า___เลยครับ",
    "core": [
      "นับว่า"
    ],
    "meaning": {
      "en": "Evaluating with praise: It really counts as ___",
      "ko": "높게 평가하기: ___라고 할 만해요"
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ปีนี้นับว่าเป็นปีที่ดีที่สุดของบริษัทเลยครับ",
        "slot": "เป็นปีที่ดีที่สุดของบริษัท",
        "cue": {
          "en": "the company's best year",
          "ko": "회사 최고의 해"
        },
        "gloss": {
          "en": "This year really counts as the company's best.",
          "ko": "올해는 회사 최고의 해라고 할 만해요."
        }
      },
      {
        "text": "เขาเพิ่งเรียนได้ไม่นาน นับว่าเก่งมากเลยครับ",
        "slot": "เก่งมาก",
        "cue": {
          "en": "very good",
          "ko": "아주 잘하다"
        },
        "gloss": {
          "en": "He's only just started learning, so he's really very good.",
          "ko": "배운 지 얼마 안 됐는데 아주 잘한다고 할 만해요."
        }
      },
      {
        "text": "งานแรกออกมาแบบนี้ นับว่าน่าพอใจเลยครับ",
        "slot": "น่าพอใจ",
        "cue": {
          "en": "satisfying",
          "ko": "만족스럽다"
        },
        "gloss": {
          "en": "For a first job, this is really quite satisfying.",
          "ko": "첫 작업이 이 정도면 만족스럽다고 할 만해요."
        }
      },
      {
        "text": "การแข่งขันครั้งนี้นับว่าสนุกที่สุดเลยครับ",
        "slot": "สนุกที่สุด",
        "cue": {
          "en": "the most fun",
          "ko": "가장 재미있다"
        },
        "gloss": {
          "en": "This competition was truly the most fun.",
          "ko": "이번 대회는 가장 재미있었다고 할 만해요."
        }
      }
    ]
  },
  {
    "id": "th-f5-05",
    "stage": 5,
    "fn": "nuance-soften",
    "pattern": "…ค่อนข้าง___ครับ",
    "core": [
      "ค่อนข้าง"
    ],
    "meaning": {
      "en": "Softening a statement: … rather ___",
      "ko": "말 누그러뜨리기: 꽤(다소) ___"
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "วันอาทิตย์ผมคงค่อนข้างเหนื่อยครับ",
        "slot": "เหนื่อย",
        "cue": {
          "en": "tired",
          "ko": "피곤하다"
        },
        "gloss": {
          "en": "I'll probably be rather tired on Sunday.",
          "ko": "일요일에는 아마 좀 피곤할 거예요."
        }
      },
      {
        "text": "ราคานี้ค่อนข้างสูงสำหรับเราครับ",
        "slot": "สูงสำหรับเรา",
        "cue": {
          "en": "high for us",
          "ko": "우리에게 비싸다"
        },
        "gloss": {
          "en": "This price is rather high for us.",
          "ko": "이 가격은 저희한테 좀 비싼 편이에요."
        }
      },
      {
        "text": "แผนนี้ค่อนข้างเสี่ยงครับ",
        "slot": "เสี่ยง",
        "cue": {
          "en": "risky",
          "ko": "위험하다"
        },
        "gloss": {
          "en": "This plan is rather risky.",
          "ko": "이 안은 다소 위험해요."
        }
      },
      {
        "text": "ผมค่อนข้างเป็นคนธรรมดาครับ",
        "slot": "เป็นคนธรรมดา",
        "cue": {
          "en": "be an ordinary person",
          "ko": "평범한 사람이다"
        },
        "gloss": {
          "en": "I'm a fairly ordinary person.",
          "ko": "저는 꽤 평범한 사람이에요."
        }
      }
    ]
  },
  {
    "id": "th-f5-06",
    "stage": 5,
    "fn": "feedback-give",
    "pattern": "…ออกจะ___ไปหน่อยนะครับ",
    "core": [
      "ออกจะ"
    ],
    "meaning": {
      "en": "Criticising gently: … is a bit too ___",
      "ko": "비판 누그러뜨리기: 좀 ___한 편이에요"
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ไอเดียนี้ออกจะเสี่ยงไปหน่อยนะครับ",
        "slot": "เสี่ยง",
        "cue": {
          "en": "risky",
          "ko": "위험하다"
        },
        "gloss": {
          "en": "This idea is a bit on the risky side.",
          "ko": "이 아이디어는 좀 위험한 편이에요."
        }
      },
      {
        "text": "มุกเรื่องนี้ออกจะแรงไปหน่อยนะครับ",
        "slot": "แรง",
        "cue": {
          "en": "harsh",
          "ko": "세다"
        },
        "gloss": {
          "en": "This joke is a bit on the harsh side.",
          "ko": "이 농담은 좀 센 편이에요."
        }
      },
      {
        "text": "ชุดนี้ออกจะเป็นทางการไปหน่อยนะครับ",
        "slot": "เป็นทางการ",
        "cue": {
          "en": "formal",
          "ko": "격식을 차리다"
        },
        "gloss": {
          "en": "This outfit is a little too formal.",
          "ko": "이 옷은 좀 너무 격식 차린 편이에요."
        }
      },
      {
        "text": "สีนี้ออกจะสดไปหน่อยนะครับ",
        "slot": "สด",
        "cue": {
          "en": "bright",
          "ko": "선명하다"
        },
        "gloss": {
          "en": "This colour is a little too bright.",
          "ko": "이 색은 좀 너무 튀는 편이에요."
        }
      }
    ]
  },
  {
    "id": "th-f5-07",
    "stage": 5,
    "fn": "storytelling",
    "pattern": "___เสียจน…",
    "core": [
      "เสียจน"
    ],
    "meaning": {
      "en": "Telling how extreme something was: So ___ that …",
      "ko": "너무 ～해서 ～: 너무 ___해서 …"
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "เขาพูดเร็วเสียจนไม่มีใครตามทันครับ",
        "slot": "พูดเร็ว",
        "cue": {
          "en": "speak fast",
          "ko": "빨리 말하다"
        },
        "gloss": {
          "en": "He spoke so fast that nobody could keep up.",
          "ko": "그는 너무 빨리 말해서 아무도 못 따라갔어요."
        }
      },
      {
        "text": "ผมขำเสียจนคนบนรถไฟฟ้าหันมามองครับ",
        "slot": "ขำ",
        "cue": {
          "en": "laugh",
          "ko": "웃다"
        },
        "gloss": {
          "en": "I laughed so much that people on the skytrain turned to look.",
          "ko": "너무 웃어서 전철 안 사람들이 돌아봤어요."
        }
      },
      {
        "text": "พี่ใจเย็นเสียจนไม่มีใครเคยเห็นพี่โกรธครับ",
        "slot": "ใจเย็น",
        "cue": {
          "en": "be calm",
          "ko": "침착하다"
        },
        "gloss": {
          "en": "He's so calm that no one has ever seen him angry.",
          "ko": "선배는 너무 침착해서 화내는 걸 본 사람이 없어요."
        }
      },
      {
        "text": "อาหารร้านนี้อร่อยเสียจนต้องกลับมาอีกครับ",
        "slot": "อร่อย",
        "cue": {
          "en": "delicious",
          "ko": "맛있다"
        },
        "gloss": {
          "en": "The food here is so good I had to come back.",
          "ko": "이 집 음식이 너무 맛있어서 또 와야 했어요."
        }
      }
    ]
  },
  {
    "id": "th-f5-08",
    "stage": 5,
    "fn": "idiom-react",
    "pattern": "___ต้องค่อยเป็นค่อยไปครับ",
    "core": [
      "ค่อยเป็นค่อยไป"
    ],
    "meaning": {
      "en": "Advising patience with an idiom: ___ has to be taken step by step",
      "ko": "관용 표현으로 조언하기: ___은 차근차근 해야 해요"
    },
    "grammar": [
      4
    ],
    "expressions": [
      "ค่อยเป็นค่อยไป"
    ],
    "examples": [
      {
        "text": "งานนี้ต้องค่อยเป็นค่อยไป อย่าเพิ่งใจร้อนครับ",
        "slot": "งานนี้",
        "cue": {
          "en": "this work",
          "ko": "이 일"
        },
        "gloss": {
          "en": "This job has to be taken step by step — don't rush.",
          "ko": "이 일은 차근차근 해야 해요. 서두르지 마세요."
        }
      },
      {
        "text": "การเรียนภาษาต้องค่อยเป็นค่อยไปครับ",
        "slot": "การเรียนภาษา",
        "cue": {
          "en": "learning a language",
          "ko": "언어 공부"
        },
        "gloss": {
          "en": "Learning a language has to go step by step.",
          "ko": "언어 공부는 차근차근 해야 해요."
        }
      },
      {
        "text": "เรื่องความรักต้องค่อยเป็นค่อยไปครับ",
        "slot": "เรื่องความรัก",
        "cue": {
          "en": "love",
          "ko": "사랑"
        },
        "gloss": {
          "en": "Love needs to take its time.",
          "ko": "사랑은 천천히 가야 해요."
        }
      },
      {
        "text": "การลดน้ำหนักต้องค่อยเป็นค่อยไปครับ",
        "slot": "การลดน้ำหนัก",
        "cue": {
          "en": "losing weight",
          "ko": "살 빼기"
        },
        "gloss": {
          "en": "Losing weight has to be gradual.",
          "ko": "살 빼기는 천천히 해야 해요."
        }
      }
    ]
  },
  {
    "id": "th-f5-09",
    "stage": 5,
    "fn": "best-to",
    "pattern": "น้ำขึ้นให้รีบตัก ___ครับ",
    "core": [
      "น้ำขึ้นให้รีบตัก"
    ],
    "meaning": {
      "en": "Urging someone to seize the moment (idiom): Make hay while the sun shines — ___",
      "ko": "관용 표현으로 기회 잡으라고 하기: 물 들어올 때 노 저어야죠, ___"
    },
    "grammar": [
      4
    ],
    "expressions": [
      "น้ำขึ้นให้รีบตัก"
    ],
    "examples": [
      {
        "text": "น้ำขึ้นให้รีบตัก ตอนนี้ราคาลดอยู่ ซื้อเลยครับ",
        "slot": "ตอนนี้ราคาลดอยู่ ซื้อเลย",
        "cue": {
          "en": "it's on sale now, buy it",
          "ko": "지금 세일 중이니 사다"
        },
        "gloss": {
          "en": "Strike while the iron's hot — it's on sale now, buy it.",
          "ko": "물 들어올 때 노 저어야죠. 지금 세일하니까 사세요."
        }
      },
      {
        "text": "น้ำขึ้นให้รีบตัก ลูกค้าสนใจแล้ว รีบส่งใบเสนอราคาครับ",
        "slot": "ลูกค้าสนใจแล้ว รีบส่งใบเสนอราคา",
        "cue": {
          "en": "the client is interested, send the quote fast",
          "ko": "고객이 관심 있으니 견적서를 빨리 보내다"
        },
        "gloss": {
          "en": "Strike while the iron's hot — the client's interested, send the quote now.",
          "ko": "물 들어올 때 노 저어야죠. 고객이 관심 있을 때 견적서 빨리 보내요."
        }
      },
      {
        "text": "น้ำขึ้นให้รีบตัก มีคนชวนไปทำงานต่างประเทศ ก็ไปเถอะครับ",
        "slot": "มีคนชวนไปทำงานต่างประเทศ ก็ไปเถอะ",
        "cue": {
          "en": "someone offers work abroad, just go",
          "ko": "해외 일 제안이 왔으니 가다"
        },
        "gloss": {
          "en": "Seize the chance — someone's offering you work abroad, go for it.",
          "ko": "물 들어올 때 노 저어야죠. 해외 일 제안 왔으면 가세요."
        }
      },
      {
        "text": "น้ำขึ้นให้รีบตัก ถ้าไม่รีบโพสต์ อาทิตย์หน้าก็ตกเทรนด์แล้วครับ",
        "slot": "ถ้าไม่รีบโพสต์ อาทิตย์หน้าก็ตกเทรนด์แล้ว",
        "cue": {
          "en": "if we don't post now, it'll be out of fashion next week",
          "ko": "빨리 안 올리면 다음 주엔 유행이 지나다"
        },
        "gloss": {
          "en": "Make hay while the sun shines — if we don't post now, it'll be old news next week.",
          "ko": "물 들어올 때 노 저어야죠. 빨리 안 올리면 다음 주엔 유행 지나요."
        }
      }
    ]
  },
  {
    "id": "th-f5-10",
    "stage": 5,
    "fn": "read-between",
    "pattern": "___ปากว่าตาขยิบจริงๆ ครับ",
    "core": [
      "ปากว่าตาขยิบ"
    ],
    "meaning": {
      "en": "Calling out hypocrisy with an idiom: ___ really says one thing and does another",
      "ko": "관용 표현으로 위선 꼬집기: ___은 정말 말과 행동이 달라요"
    },
    "grammar": [
      4
    ],
    "expressions": [
      "ปากว่าตาขยิบ"
    ],
    "examples": [
      {
        "text": "คนที่บอกให้ประหยัดแต่ซื้อของแพงทุกวัน ปากว่าตาขยิบจริงๆ ครับ",
        "slot": "คนที่บอกให้ประหยัดแต่ซื้อของแพงทุกวัน",
        "cue": {
          "en": "people who preach saving but buy expensive things daily",
          "ko": "절약하라면서 매일 비싼 걸 사는 사람"
        },
        "gloss": {
          "en": "People who preach saving but buy pricey things every day really don't practise what they preach.",
          "ko": "절약하라면서 매일 비싼 걸 사는 사람은 정말 말과 행동이 달라요."
        }
      },
      {
        "text": "เรื่องลดหวาน ผมปากว่าตาขยิบจริงๆ ครับ",
        "slot": "เรื่องลดหวาน",
        "cue": {
          "en": "cutting down on sugar",
          "ko": "단 것 줄이기"
        },
        "gloss": {
          "en": "When it comes to cutting sugar, I really don't practise what I preach.",
          "ko": "단 거 줄이는 건 저도 정말 말뿐이에요."
        }
      },
      {
        "text": "หัวหน้าที่ห้ามคนอื่นมาสายแต่ตัวเองมาสาย ปากว่าตาขยิบจริงๆ ครับ",
        "slot": "หัวหน้าที่ห้ามคนอื่นมาสายแต่ตัวเองมาสาย",
        "cue": {
          "en": "a boss who bans lateness but is late himself",
          "ko": "남은 지각 못 하게 하면서 자기는 늦는 상사"
        },
        "gloss": {
          "en": "A boss who bans lateness but turns up late himself is a real hypocrite.",
          "ko": "남한테는 지각하지 말라면서 자기는 늦는 상사는 정말 말과 행동이 달라요."
        }
      },
      {
        "text": "นักการเมืองบางคนปากว่าตาขยิบจริงๆ ครับ",
        "slot": "นักการเมืองบางคน",
        "cue": {
          "en": "some politicians",
          "ko": "일부 정치인"
        },
        "gloss": {
          "en": "Some politicians really say one thing and do another.",
          "ko": "일부 정치인은 정말 말과 행동이 달라요."
        }
      }
    ]
  },
  {
    "id": "th-f5-11",
    "stage": 5,
    "fn": "tact-refuse",
    "pattern": "ไม่___หรอกครับ",
    "core": [
      "หรอก"
    ],
    "meaning": {
      "en": "Softly denying or reassuring with หรอก: It's not ___ at all, really",
      "ko": "หรอก으로 부드럽게 부정하기: 별로 ___하지 않아요"
    },
    "grammar": [
      5
    ],
    "expressions": [
      "ไม่ได้แย่ขนาดนั้น"
    ],
    "examples": [
      {
        "text": "ไม่ต้องห่วงหรอกครับ",
        "slot": "ต้องห่วง",
        "cue": {
          "en": "need to worry",
          "ko": "걱정해야 하다"
        },
        "gloss": {
          "en": "There's really no need to worry.",
          "ko": "걱정 안 하셔도 돼요."
        }
      },
      {
        "text": "ไม่ยากหรอกครับ ลองดูก่อน",
        "slot": "ยาก",
        "cue": {
          "en": "difficult",
          "ko": "어렵다"
        },
        "gloss": {
          "en": "It's not hard, really — give it a try.",
          "ko": "별로 안 어려워요. 한번 해 보세요."
        }
      },
      {
        "text": "ไม่ได้แย่ขนาดนั้นหรอกครับ",
        "slot": "ได้แย่ขนาดนั้น",
        "cue": {
          "en": "be that bad",
          "ko": "그렇게 나쁘다"
        },
        "gloss": {
          "en": "It's not that bad, really.",
          "ko": "그렇게까지 나쁘진 않아요."
        }
      },
      {
        "text": "ไม่กล้าโพสต์หรอกครับ",
        "slot": "กล้าโพสต์",
        "cue": {
          "en": "dare to post",
          "ko": "올릴 엄두가 나다"
        },
        "gloss": {
          "en": "I wouldn't dare post it.",
          "ko": "올릴 엄두는 안 나요."
        }
      }
    ]
  },
  {
    "id": "th-f5-12",
    "stage": 5,
    "fn": "idiom-react",
    "pattern": "ก็บอกแล้วไงล่ะ ว่า___",
    "core": [
      "บอกแล้วไงล่ะ"
    ],
    "meaning": {
      "en": "Saying 'I told you so' with ล่ะ: Didn't I tell you ___?",
      "ko": "ล่ะ로 '내가 뭐랬어' 하기: ___라고 했잖아요"
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ก็บอกแล้วไงล่ะ ว่าไม่ต้องรีบ",
        "slot": "ไม่ต้องรีบ",
        "cue": {
          "en": "no need to hurry",
          "ko": "서두를 필요 없다"
        },
        "gloss": {
          "en": "Didn't I tell you there was no need to rush?",
          "ko": "서두를 필요 없다고 했잖아."
        }
      },
      {
        "text": "ก็บอกแล้วไงล่ะ ว่าร้านนี้คนเยอะ",
        "slot": "ร้านนี้คนเยอะ",
        "cue": {
          "en": "this place is crowded",
          "ko": "이 가게는 사람이 많다"
        },
        "gloss": {
          "en": "I told you this place gets crowded.",
          "ko": "이 가게 사람 많다고 했잖아."
        }
      },
      {
        "text": "ก็บอกแล้วไงล่ะ ว่าให้เอาร่มมาด้วย",
        "slot": "ให้เอาร่มมาด้วย",
        "cue": {
          "en": "bring an umbrella",
          "ko": "우산을 가져오다"
        },
        "gloss": {
          "en": "Didn't I tell you to bring an umbrella?",
          "ko": "우산 가져오라고 했잖아."
        }
      },
      {
        "text": "ก็บอกแล้วไงล่ะ ว่าเขาไม่มาตรงเวลาหรอก",
        "slot": "เขาไม่มาตรงเวลาหรอก",
        "cue": {
          "en": "he won't come on time",
          "ko": "그는 제시간에 안 오다"
        },
        "gloss": {
          "en": "I told you he wouldn't be on time.",
          "ko": "걔 제시간에 안 온다고 했잖아."
        }
      }
    ]
  },
  {
    "id": "th-f5-13",
    "stage": 5,
    "fn": "explain-process",
    "pattern": "การ___ต้องใช้ความ…",
    "core": [
      "ต้องใช้ความ",
      "ต้องอาศัยความ"
    ],
    "meaning": {
      "en": "Talking about what something takes, with การ / ความ: ___ takes (quality)",
      "ko": "การ / ความ으로 추상적으로 말하기: ___하려면 (자질)이 필요해요"
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "การเปิดร้านต้องใช้ความพร้อมหลายอย่างครับ",
        "slot": "เปิดร้าน",
        "cue": {
          "en": "open a shop",
          "ko": "가게를 열다"
        },
        "gloss": {
          "en": "Opening a shop takes being ready in many ways.",
          "ko": "가게를 여는 데는 여러 가지 준비가 필요해요."
        }
      },
      {
        "text": "การตัดสินใจครั้งนี้ต้องอาศัยความกล้าพอสมควรครับ",
        "slot": "ตัดสินใจครั้งนี้",
        "cue": {
          "en": "make this decision",
          "ko": "이번 결정을 내리다"
        },
        "gloss": {
          "en": "This decision takes a fair amount of courage.",
          "ko": "이번 결정에는 꽤 용기가 필요해요."
        }
      },
      {
        "text": "การเลี้ยงลูกต้องใช้ความอดทนมากครับ",
        "slot": "เลี้ยงลูก",
        "cue": {
          "en": "raise children",
          "ko": "아이를 키우다"
        },
        "gloss": {
          "en": "Raising children takes a lot of patience.",
          "ko": "아이를 키우는 데는 인내심이 많이 필요해요."
        }
      },
      {
        "text": "การเรียนภาษาให้เก่งต้องอาศัยความสม่ำเสมอครับ",
        "slot": "เรียนภาษาให้เก่ง",
        "cue": {
          "en": "get good at a language",
          "ko": "언어를 잘하게 되다"
        },
        "gloss": {
          "en": "Getting good at a language takes consistency.",
          "ko": "언어를 잘하려면 꾸준함이 필요해요."
        }
      }
    ]
  },
  {
    "id": "th-f5-14",
    "stage": 5,
    "fn": "clarify",
    "pattern": "อันที่จริง___",
    "core": [
      "อันที่จริง"
    ],
    "meaning": {
      "en": "Revealing the real story: As a matter of fact, ___",
      "ko": "사실을 털어놓기: 실은 ___"
    },
    "grammar": [
      7
    ],
    "expressions": [
      "อันที่จริง"
    ],
    "examples": [
      {
        "text": "อันที่จริงผมก็อยากช่วยพี่ครับ",
        "slot": "ผมก็อยากช่วยพี่",
        "cue": {
          "en": "I do want to help you",
          "ko": "저도 돕고 싶다"
        },
        "gloss": {
          "en": "As a matter of fact, I do want to help you.",
          "ko": "실은 저도 선배를 돕고 싶어요."
        }
      },
      {
        "text": "อันที่จริงเริ่มเพราะเหงาครับ",
        "slot": "เริ่มเพราะเหงา",
        "cue": {
          "en": "started out of loneliness",
          "ko": "외로워서 시작하다"
        },
        "gloss": {
          "en": "Actually, it started because I was lonely.",
          "ko": "실은 외로워서 시작했어요."
        }
      },
      {
        "text": "อันที่จริงวันแรกที่ผมมาทำงาน ผมส่งอีเมลผิดครับ",
        "slot": "วันแรกที่ผมมาทำงาน ผมส่งอีเมลผิด",
        "cue": {
          "en": "on my first day I sent an email to the wrong people",
          "ko": "출근 첫날 메일을 잘못 보내다"
        },
        "gloss": {
          "en": "As a matter of fact, on my first day I sent an email to the wrong people.",
          "ko": "실은 출근 첫날 메일을 잘못 보냈어요."
        }
      },
      {
        "text": "อันที่จริงโครงการนี้เริ่มจากความคิดของน้องในทีมครับ",
        "slot": "โครงการนี้เริ่มจากความคิดของน้องในทีม",
        "cue": {
          "en": "this project began with a junior's idea",
          "ko": "이 프로젝트는 팀 후배의 아이디어에서 시작되다"
        },
        "gloss": {
          "en": "Actually, this project began as an idea from a junior on the team.",
          "ko": "실은 이 프로젝트는 팀 후배 아이디어에서 시작됐어요."
        }
      }
    ]
  },
  {
    "id": "th-f5-15",
    "stage": 5,
    "fn": "concession",
    "pattern": "ทั้งนี้ทั้งนั้น ก็ขึ้นอยู่กับ___ด้วยครับ",
    "core": [
      "ทั้งนี้ทั้งนั้น"
    ],
    "meaning": {
      "en": "Adding a qualifying condition: All that said, it also depends on ___",
      "ko": "단서 달기: 어쨌든 ___에 달려 있기도 해요"
    },
    "grammar": [
      7
    ],
    "expressions": [
      "ทั้งนี้ทั้งนั้น"
    ],
    "examples": [
      {
        "text": "ทั้งนี้ทั้งนั้น ก็ขึ้นอยู่กับงบประมาณของปีหน้าด้วยครับ",
        "slot": "งบประมาณของปีหน้า",
        "cue": {
          "en": "next year's budget",
          "ko": "내년 예산"
        },
        "gloss": {
          "en": "All that said, it also depends on next year's budget.",
          "ko": "어쨌든 내년 예산에 달려 있기도 해요."
        }
      },
      {
        "text": "ทั้งนี้ทั้งนั้น ก็ขึ้นอยู่กับความอดทนด้วยครับ",
        "slot": "ความอดทน",
        "cue": {
          "en": "patience",
          "ko": "인내"
        },
        "gloss": {
          "en": "Even so, it also comes down to patience.",
          "ko": "어쨌든 인내심에 달려 있기도 해요."
        }
      },
      {
        "text": "ทั้งนี้ทั้งนั้น ก็ขึ้นอยู่กับสภาพอากาศวันนั้นด้วยครับ",
        "slot": "สภาพอากาศวันนั้น",
        "cue": {
          "en": "the weather that day",
          "ko": "그날 날씨"
        },
        "gloss": {
          "en": "That said, it also depends on the weather on the day.",
          "ko": "어쨌든 그날 날씨에 달려 있기도 해요."
        }
      },
      {
        "text": "ทั้งนี้ทั้งนั้น ก็ขึ้นอยู่กับการตัดสินใจของลูกค้าด้วยครับ",
        "slot": "การตัดสินใจของลูกค้า",
        "cue": {
          "en": "the client's decision",
          "ko": "고객의 결정"
        },
        "gloss": {
          "en": "In any case, it also depends on the client's decision.",
          "ko": "어쨌든 고객의 결정에 달려 있기도 해요."
        }
      }
    ]
  },
  {
    "id": "th-f5-16",
    "stage": 5,
    "fn": "tact-refuse",
    "pattern": "ไม่ใช่ไม่อยากนะครับ แต่___",
    "core": [
      "ไม่ใช่ไม่อยากนะ"
    ],
    "meaning": {
      "en": "Refusing without hurting feelings: It's not that I don't want to, but ___",
      "ko": "눈치 있게 거절하기: 하기 싫은 게 아니라 ___"
    },
    "grammar": [],
    "expressions": [
      "ไม่ใช่ไม่อยากนะ"
    ],
    "examples": [
      {
        "text": "ไม่ใช่ไม่อยากนะครับ แต่เสาร์นี้ผมต้องไปงานแต่งเพื่อนครับ",
        "slot": "เสาร์นี้ผมต้องไปงานแต่งเพื่อน",
        "cue": {
          "en": "I have a friend's wedding this Saturday",
          "ko": "이번 토요일에 친구 결혼식에 가야 하다"
        },
        "gloss": {
          "en": "It's not that I don't want to, but I have a friend's wedding this Saturday.",
          "ko": "하기 싫은 게 아니라 이번 토요일에 친구 결혼식에 가야 해요."
        }
      },
      {
        "text": "ไม่ใช่ไม่อยากนะครับ แต่ช่วงนี้งานยุ่งมากจริงๆ ครับ",
        "slot": "ช่วงนี้งานยุ่งมากจริงๆ",
        "cue": {
          "en": "work is really busy these days",
          "ko": "요즘 일이 정말 바쁘다"
        },
        "gloss": {
          "en": "It's not that I don't want to, but I'm really swamped at the moment.",
          "ko": "하기 싫은 게 아니라 요즘 일이 정말 바빠요."
        }
      },
      {
        "text": "ไม่ใช่ไม่อยากนะคะ แต่ดิฉันไม่ถนัดเรื่องนี้ค่ะ",
        "slot": "ดิฉันไม่ถนัดเรื่องนี้",
        "cue": {
          "en": "I'm not good at this (woman speaking)",
          "ko": "이 일에 서툴다(여성 화자)"
        },
        "gloss": {
          "en": "It's not that I don't want to, but this isn't my strong point.",
          "ko": "하기 싫은 게 아니라 제가 이런 일엔 서툴러요."
        }
      },
      {
        "text": "ไม่ใช่ไม่อยากนะครับ แต่งบเดือนนี้หมดแล้วครับ",
        "slot": "งบเดือนนี้หมดแล้ว",
        "cue": {
          "en": "this month's budget is used up",
          "ko": "이번 달 예산을 다 쓰다"
        },
        "gloss": {
          "en": "It's not that I don't want to, but this month's budget is gone.",
          "ko": "하기 싫은 게 아니라 이번 달 예산이 다 떨어졌어요."
        }
      }
    ]
  },
  {
    "id": "th-f5-17",
    "stage": 5,
    "fn": "tact-refuse",
    "pattern": "___ เกรงว่าจะไม่สะดวกครับ",
    "core": [
      "เกรงว่าจะไม่สะดวก"
    ],
    "meaning": {
      "en": "Declining politely: ___ — I'm afraid it won't be convenient",
      "ko": "정중하게 거절하기: ___는 어려울 것 같아요"
    },
    "grammar": [
      0
    ],
    "expressions": [
      "เกรงว่าจะไม่สะดวก"
    ],
    "examples": [
      {
        "text": "วันเสาร์นี้ เกรงว่าจะไม่สะดวกครับ",
        "slot": "วันเสาร์นี้",
        "cue": {
          "en": "this Saturday",
          "ko": "이번 토요일"
        },
        "gloss": {
          "en": "This Saturday, I'm afraid, won't be convenient.",
          "ko": "이번 토요일은 어려울 것 같아요."
        }
      },
      {
        "text": "ถ้าเป็นช่วงเช้า เกรงว่าจะไม่สะดวกครับ",
        "slot": "ถ้าเป็นช่วงเช้า",
        "cue": {
          "en": "if it's in the morning",
          "ko": "오전이라면"
        },
        "gloss": {
          "en": "If it's in the morning, I'm afraid it won't suit me.",
          "ko": "오전이라면 어려울 것 같아요."
        }
      },
      {
        "text": "ส่งภายในวันนี้ เกรงว่าจะไม่สะดวกครับ",
        "slot": "ส่งภายในวันนี้",
        "cue": {
          "en": "deliver by today",
          "ko": "오늘 안에 보내다"
        },
        "gloss": {
          "en": "Sending it by today, I'm afraid, won't be possible.",
          "ko": "오늘 안에 보내는 건 어려울 것 같아요."
        }
      },
      {
        "text": "เรื่องนัดคืนพรุ่งนี้ เกรงว่าจะไม่สะดวกค่ะ",
        "slot": "เรื่องนัดคืนพรุ่งนี้",
        "cue": {
          "en": "the appointment tomorrow night",
          "ko": "내일 밤 약속"
        },
        "gloss": {
          "en": "About tomorrow night, I'm afraid it won't be convenient.",
          "ko": "내일 밤 약속은 어려울 것 같아요."
        }
      }
    ]
  },
  {
    "id": "th-f5-18",
    "stage": 5,
    "fn": "sympathy",
    "pattern": "เข้าใจหัวอกเลยครับ ___",
    "core": [
      "เข้าใจหัวอก"
    ],
    "meaning": {
      "en": "Showing deep sympathy (idiom): I really know how you feel — ___",
      "ko": "관용 표현으로 공감하기: 그 마음 정말 알아요, ___"
    },
    "grammar": [
      4
    ],
    "expressions": [
      "เข้าใจหัวอกเลย"
    ],
    "examples": [
      {
        "text": "เข้าใจหัวอกเลยครับ ความกดดันแบบนี้ผมก็เคยเจอ",
        "slot": "ความกดดันแบบนี้ผมก็เคยเจอ",
        "cue": {
          "en": "I've faced this kind of pressure too",
          "ko": "이런 압박은 나도 겪어 봤다"
        },
        "gloss": {
          "en": "I really know how you feel — I've been under this kind of pressure too.",
          "ko": "그 마음 정말 알아요. 이런 압박은 저도 겪어 봤어요."
        }
      },
      {
        "text": "เข้าใจหัวอกเลยครับ ทำงานหนักแล้วไม่มีใครเห็น",
        "slot": "ทำงานหนักแล้วไม่มีใครเห็น",
        "cue": {
          "en": "working hard and no one notices",
          "ko": "열심히 일해도 아무도 몰라주다"
        },
        "gloss": {
          "en": "I know exactly how you feel — working hard and nobody noticing.",
          "ko": "그 마음 정말 알아요. 열심히 해도 아무도 몰라주죠."
        }
      },
      {
        "text": "เข้าใจหัวอกเลยครับ ลูกป่วยแบบนี้คงนอนไม่หลับ",
        "slot": "ลูกป่วยแบบนี้คงนอนไม่หลับ",
        "cue": {
          "en": "with your child sick you probably can't sleep",
          "ko": "아이가 아프니 잠도 못 자겠다"
        },
        "gloss": {
          "en": "I really feel for you — with your child ill like this you must not be sleeping.",
          "ko": "그 마음 정말 알아요. 아이가 이렇게 아프면 잠도 못 주무시겠어요."
        }
      },
      {
        "text": "เข้าใจหัวอกเลยครับ ย้ายมาอยู่ที่ใหม่แต่ยังไม่มีเพื่อน",
        "slot": "ย้ายมาอยู่ที่ใหม่แต่ยังไม่มีเพื่อน",
        "cue": {
          "en": "moving somewhere new with no friends yet",
          "ko": "새 곳에 왔는데 아직 친구가 없다"
        },
        "gloss": {
          "en": "I know how that feels — moving somewhere new without any friends yet.",
          "ko": "그 마음 정말 알아요. 새 곳에 왔는데 아직 친구가 없죠."
        }
      }
    ]
  },
  {
    "id": "th-f5-19",
    "stage": 5,
    "fn": "surprise",
    "pattern": "…___เกินคาดมากครับ",
    "core": [
      "เกินคาด"
    ],
    "meaning": {
      "en": "Saying something beat your expectations: … was more ___ than expected",
      "ko": "예상 밖이라고 말하기: 생각보다 훨씬 ___했어요"
    },
    "grammar": [],
    "expressions": [
      "เกินคาด"
    ],
    "examples": [
      {
        "text": "ตอนแรกนึกว่าจะเฉยๆ แต่ตลกเกินคาดมากครับ",
        "slot": "ตลก",
        "cue": {
          "en": "funny",
          "ko": "웃기다"
        },
        "gloss": {
          "en": "I thought it'd be so-so, but it was way funnier than expected.",
          "ko": "처음엔 그저 그럴 줄 알았는데 생각보다 훨씬 웃겼어요."
        }
      },
      {
        "text": "ร้านเล็กๆ นี้อร่อยเกินคาดมากครับ",
        "slot": "อร่อย",
        "cue": {
          "en": "delicious",
          "ko": "맛있다"
        },
        "gloss": {
          "en": "This little place was far tastier than I expected.",
          "ko": "이 작은 가게가 생각보다 훨씬 맛있었어요."
        }
      },
      {
        "text": "การสอบครั้งนี้ง่ายเกินคาดมากครับ",
        "slot": "ง่าย",
        "cue": {
          "en": "easy",
          "ko": "쉽다"
        },
        "gloss": {
          "en": "This exam was much easier than expected.",
          "ko": "이번 시험은 생각보다 훨씬 쉬웠어요."
        }
      },
      {
        "text": "คนมางานเยอะเกินคาดมากครับ",
        "slot": "เยอะ",
        "cue": {
          "en": "many",
          "ko": "많다"
        },
        "gloss": {
          "en": "Far more people came to the event than expected.",
          "ko": "행사에 생각보다 훨씬 많은 사람이 왔어요."
        }
      }
    ]
  }
];
