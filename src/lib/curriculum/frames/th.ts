import type { Frame } from "../frames.ts";

/** 태국어 1~3단계 틀(curriculum/frames.ts) — 기능 id(fn)는 curriculum/functions.ts. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
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
  }
];
