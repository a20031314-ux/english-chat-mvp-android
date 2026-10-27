import type { Frame } from "../frames.ts";

/** 힌디어 1~3단계 틀(curriculum/frames.ts) — 기능 id(fn)는 curriculum/functions.ts. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
export const HI_FRAMES: Frame[] = [
  {
    "id": "hi-f1-01",
    "stage": 1,
    "fn": "introduce",
    "pattern": "मेरा नाम ___ है।",
    "core": [
      "मेरा नाम"
    ],
    "meaning": {
      "en": "Saying your name: My name is ___.",
      "ko": "이름 말하기: 제 이름은 ___예요."
    },
    "grammar": [
      0,
      2
    ],
    "expressions": [
      "मेरा नाम"
    ],
    "examples": [
      {
        "text": "मेरा नाम मिनजुन है।",
        "slot": "मिनजुन",
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
        "text": "मेरा नाम प्रिया है।",
        "slot": "प्रिया",
        "cue": {
          "en": "Priya",
          "ko": "프리야"
        },
        "gloss": {
          "en": "My name is Priya.",
          "ko": "제 이름은 프리야예요."
        }
      },
      {
        "text": "मेरा नाम राहुल शर्मा है।",
        "slot": "राहुल शर्मा",
        "cue": {
          "en": "Rahul Sharma (full name)",
          "ko": "라훌 샤르마(성과 이름)"
        },
        "gloss": {
          "en": "My name is Rahul Sharma.",
          "ko": "제 이름은 라훌 샤르마예요."
        }
      },
      {
        "text": "मेरा नाम डैनियल है।",
        "slot": "डैनियल",
        "cue": {
          "en": "Daniel",
          "ko": "다니엘"
        },
        "gloss": {
          "en": "My name is Daniel.",
          "ko": "제 이름은 다니엘이에요."
        }
      }
    ]
  },
  {
    "id": "hi-f1-02",
    "stage": 1,
    "fn": "origin",
    "pattern": "मैं ___ से हूँ।",
    "core": [
      "से हूँ"
    ],
    "meaning": {
      "en": "Saying where you are from: I'm from ___.",
      "ko": "출신 말하기: 저는 ___에서 왔어요."
    },
    "grammar": [
      0,
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "मैं कोरिया से हूँ।",
        "slot": "कोरिया",
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
        "text": "मैं सियोल से हूँ।",
        "slot": "सियोल",
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
        "text": "मैं जापान से हूँ।",
        "slot": "जापान",
        "cue": {
          "en": "Japan",
          "ko": "일본"
        },
        "gloss": {
          "en": "I'm from Japan.",
          "ko": "저는 일본에서 왔어요."
        }
      },
      {
        "text": "मैं अमेरिका से हूँ।",
        "slot": "अमेरिका",
        "cue": {
          "en": "America",
          "ko": "미국"
        },
        "gloss": {
          "en": "I'm from America.",
          "ko": "저는 미국에서 왔어요."
        }
      }
    ]
  },
  {
    "id": "hi-f1-03",
    "stage": 1,
    "fn": "job",
    "pattern": "मैं ___ हूँ।",
    "core": [
      "मैं"
    ],
    "meaning": {
      "en": "Saying what you are: I'm a ___.",
      "ko": "직업·신분 말하기: 저는 ___예요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "मैं छात्र हूँ।",
        "slot": "छात्र",
        "cue": {
          "en": "a student",
          "ko": "학생"
        },
        "gloss": {
          "en": "I'm a student.",
          "ko": "저는 학생이에요."
        }
      },
      {
        "text": "मैं टीचर हूँ।",
        "slot": "टीचर",
        "cue": {
          "en": "a teacher",
          "ko": "선생님"
        },
        "gloss": {
          "en": "I'm a teacher.",
          "ko": "저는 선생님이에요."
        }
      },
      {
        "text": "मैं डॉक्टर हूँ।",
        "slot": "डॉक्टर",
        "cue": {
          "en": "a doctor",
          "ko": "의사"
        },
        "gloss": {
          "en": "I'm a doctor.",
          "ko": "저는 의사예요."
        }
      },
      {
        "text": "मैं इंजीनियर हूँ।",
        "slot": "इंजीनियर",
        "cue": {
          "en": "an engineer",
          "ko": "엔지니어"
        },
        "gloss": {
          "en": "I'm an engineer.",
          "ko": "저는 엔지니어예요."
        }
      }
    ]
  },
  {
    "id": "hi-f1-04",
    "stage": 1,
    "fn": "ask-where",
    "pattern": "___ कहाँ है?",
    "core": [
      "कहाँ है"
    ],
    "meaning": {
      "en": "Asking where something is: Where is ___?",
      "ko": "위치 묻기: ___ 어디 있어요?"
    },
    "grammar": [
      5
    ],
    "expressions": [
      "कहाँ है"
    ],
    "examples": [
      {
        "text": "स्टेशन कहाँ है?",
        "slot": "स्टेशन",
        "cue": {
          "en": "the station",
          "ko": "역"
        },
        "gloss": {
          "en": "Where is the station?",
          "ko": "역이 어디 있어요?"
        }
      },
      {
        "text": "टॉयलेट कहाँ है?",
        "slot": "टॉयलेट",
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
        "text": "मेट्रो कहाँ है?",
        "slot": "मेट्रो",
        "cue": {
          "en": "the metro",
          "ko": "지하철"
        },
        "gloss": {
          "en": "Where is the metro?",
          "ko": "지하철이 어디 있어요?"
        }
      },
      {
        "text": "बाज़ार कहाँ है?",
        "slot": "बाज़ार",
        "cue": {
          "en": "the market",
          "ko": "시장"
        },
        "gloss": {
          "en": "Where is the market?",
          "ko": "시장이 어디 있어요?"
        }
      }
    ]
  },
  {
    "id": "hi-f1-05",
    "stage": 1,
    "fn": "ask-price",
    "pattern": "___ कितने का है?",
    "core": [
      "कितने का है"
    ],
    "meaning": {
      "en": "Asking the price: How much is ___?",
      "ko": "값 묻기: ___ 얼마예요?"
    },
    "grammar": [
      3,
      5
    ],
    "expressions": [
      "कितने का है"
    ],
    "examples": [
      {
        "text": "यह कितने का है?",
        "slot": "यह",
        "cue": {
          "en": "this",
          "ko": "이것"
        },
        "gloss": {
          "en": "How much is this?",
          "ko": "이거 얼마예요?"
        }
      },
      {
        "text": "यह पपीता कितने का है?",
        "slot": "यह पपीता",
        "cue": {
          "en": "this papaya",
          "ko": "이 파파야"
        },
        "gloss": {
          "en": "How much is this papaya?",
          "ko": "이 파파야 얼마예요?"
        }
      },
      {
        "text": "वह बैग कितने का है?",
        "slot": "वह बैग",
        "cue": {
          "en": "that bag",
          "ko": "저 가방"
        },
        "gloss": {
          "en": "How much is that bag?",
          "ko": "저 가방 얼마예요?"
        }
      },
      {
        "text": "एक किलो आम कितने का है?",
        "slot": "एक किलो आम",
        "cue": {
          "en": "a kilo of mangoes",
          "ko": "망고 일 킬로"
        },
        "gloss": {
          "en": "How much is a kilo of mangoes?",
          "ko": "망고 일 킬로에 얼마예요?"
        }
      }
    ]
  },
  {
    "id": "hi-f1-06",
    "stage": 1,
    "fn": "want",
    "pattern": "मुझे ___ चाहिए।",
    "core": [
      "चाहिए"
    ],
    "meaning": {
      "en": "Saying what you need: I need ___.",
      "ko": "필요한 것 말하기: ___ 필요해요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "मुझे पानी चाहिए।",
        "slot": "पानी",
        "cue": {
          "en": "water",
          "ko": "물"
        },
        "gloss": {
          "en": "I need water.",
          "ko": "물이 필요해요."
        }
      },
      {
        "text": "मुझे एक टिकट चाहिए।",
        "slot": "एक टिकट",
        "cue": {
          "en": "a ticket",
          "ko": "표 한 장"
        },
        "gloss": {
          "en": "I need a ticket.",
          "ko": "표 한 장 필요해요."
        }
      },
      {
        "text": "मुझे मदद चाहिए।",
        "slot": "मदद",
        "cue": {
          "en": "help",
          "ko": "도움"
        },
        "gloss": {
          "en": "I need help.",
          "ko": "도움이 필요해요."
        }
      },
      {
        "text": "मुझे थोड़ा समय चाहिए।",
        "slot": "थोड़ा समय",
        "cue": {
          "en": "a little time",
          "ko": "시간 조금"
        },
        "gloss": {
          "en": "I need a little time.",
          "ko": "시간이 좀 필요해요."
        }
      }
    ]
  },
  {
    "id": "hi-f1-07",
    "stage": 1,
    "fn": "ask-have",
    "pattern": "क्या आपके पास ___ है?",
    "core": [
      "क्या आपके पास"
    ],
    "meaning": {
      "en": "Asking if someone has something: Do you have ___?",
      "ko": "있는지 묻기: ___ 있어요?"
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "क्या आपके पास पेन है?",
        "slot": "पेन",
        "cue": {
          "en": "a pen",
          "ko": "펜"
        },
        "gloss": {
          "en": "Do you have a pen?",
          "ko": "펜 있어요?"
        }
      },
      {
        "text": "क्या आपके पास पानी है?",
        "slot": "पानी",
        "cue": {
          "en": "water",
          "ko": "물"
        },
        "gloss": {
          "en": "Do you have water?",
          "ko": "물 있어요?"
        }
      },
      {
        "text": "क्या आपके पास नक्शा है?",
        "slot": "नक्शा",
        "cue": {
          "en": "a map",
          "ko": "지도"
        },
        "gloss": {
          "en": "Do you have a map?",
          "ko": "지도 있어요?"
        }
      },
      {
        "text": "क्या आपके पास फ़ोन चार्जर है?",
        "slot": "फ़ोन चार्जर",
        "cue": {
          "en": "a phone charger",
          "ko": "휴대폰 충전기"
        },
        "gloss": {
          "en": "Do you have a phone charger?",
          "ko": "휴대폰 충전기 있어요?"
        }
      }
    ]
  },
  {
    "id": "hi-f1-08",
    "stage": 1,
    "fn": "repeat-slow",
    "pattern": "___ बोलिए।",
    "core": [
      "बोलिए"
    ],
    "meaning": {
      "en": "Asking someone to speak a certain way: Please say it ___.",
      "ko": "말하는 방식 부탁하기: ___ 말해 주세요."
    },
    "grammar": [
      7
    ],
    "expressions": [
      "धीरे बोलिए",
      "फिर से बोलिए"
    ],
    "examples": [
      {
        "text": "धीरे बोलिए।",
        "slot": "धीरे",
        "cue": {
          "en": "slowly",
          "ko": "천천히"
        },
        "gloss": {
          "en": "Please speak slowly.",
          "ko": "천천히 말해 주세요."
        }
      },
      {
        "text": "फिर से बोलिए।",
        "slot": "फिर से",
        "cue": {
          "en": "again",
          "ko": "다시"
        },
        "gloss": {
          "en": "Please say it again.",
          "ko": "다시 말해 주세요."
        }
      },
      {
        "text": "थोड़ा ज़ोर से बोलिए।",
        "slot": "थोड़ा ज़ोर से",
        "cue": {
          "en": "a bit louder",
          "ko": "조금 크게"
        },
        "gloss": {
          "en": "Please speak a bit louder.",
          "ko": "조금 크게 말해 주세요."
        }
      },
      {
        "text": "हिंदी में बोलिए।",
        "slot": "हिंदी में",
        "cue": {
          "en": "in Hindi",
          "ko": "힌디어로"
        },
        "gloss": {
          "en": "Please say it in Hindi.",
          "ko": "힌디어로 말해 주세요."
        }
      }
    ]
  },
  {
    "id": "hi-f1-09",
    "stage": 1,
    "fn": "request-action",
    "pattern": "___ चलिए।",
    "core": [
      "चलिए"
    ],
    "meaning": {
      "en": "Telling a driver where to go: Please go ___.",
      "ko": "기사에게 행선지 말하기: ___로 가 주세요."
    },
    "grammar": [
      7
    ],
    "expressions": [],
    "examples": [
      {
        "text": "इंडिया गेट चलिए।",
        "slot": "इंडिया गेट",
        "cue": {
          "en": "India Gate",
          "ko": "인디아 게이트"
        },
        "gloss": {
          "en": "Please go to India Gate.",
          "ko": "인디아 게이트로 가 주세요."
        }
      },
      {
        "text": "स्टेशन चलिए।",
        "slot": "स्टेशन",
        "cue": {
          "en": "the station",
          "ko": "역"
        },
        "gloss": {
          "en": "Please go to the station.",
          "ko": "역으로 가 주세요."
        }
      },
      {
        "text": "सीधे चलिए।",
        "slot": "सीधे",
        "cue": {
          "en": "straight",
          "ko": "직진"
        },
        "gloss": {
          "en": "Please go straight.",
          "ko": "곧장 가 주세요."
        }
      },
      {
        "text": "मीटर से चलिए।",
        "slot": "मीटर से",
        "cue": {
          "en": "by the meter",
          "ko": "미터기로"
        },
        "gloss": {
          "en": "Please go by the meter.",
          "ko": "미터기 켜고 가 주세요."
        }
      }
    ]
  },
  {
    "id": "hi-f1-10",
    "stage": 1,
    "fn": "request-thing",
    "pattern": "___ दीजिए।",
    "core": [
      "दीजिए"
    ],
    "meaning": {
      "en": "Asking for something: Please give me ___.",
      "ko": "달라고 하기: ___ 주세요."
    },
    "grammar": [
      3,
      7
    ],
    "expressions": [
      "यह दीजिए"
    ],
    "examples": [
      {
        "text": "यह दीजिए।",
        "slot": "यह",
        "cue": {
          "en": "this",
          "ko": "이것"
        },
        "gloss": {
          "en": "Please give me this.",
          "ko": "이거 주세요."
        }
      },
      {
        "text": "दो आम दीजिए।",
        "slot": "दो आम",
        "cue": {
          "en": "two mangoes",
          "ko": "망고 두 개"
        },
        "gloss": {
          "en": "Please give me two mangoes.",
          "ko": "망고 두 개 주세요."
        }
      },
      {
        "text": "एक पानी दीजिए।",
        "slot": "एक पानी",
        "cue": {
          "en": "a bottle of water",
          "ko": "물 하나"
        },
        "gloss": {
          "en": "Please give me a water.",
          "ko": "물 하나 주세요."
        }
      },
      {
        "text": "एक किलो सेब दीजिए।",
        "slot": "एक किलो सेब",
        "cue": {
          "en": "a kilo of apples",
          "ko": "사과 일 킬로"
        },
        "gloss": {
          "en": "Please give me a kilo of apples.",
          "ko": "사과 일 킬로 주세요."
        }
      }
    ]
  },
  {
    "id": "hi-f1-11",
    "stage": 1,
    "fn": "ask-what",
    "pattern": "___ क्या है?",
    "core": [
      "क्या है"
    ],
    "meaning": {
      "en": "Asking what something is: What is ___?",
      "ko": "무엇인지 묻기: ___ 뭐예요?"
    },
    "grammar": [
      3,
      5
    ],
    "expressions": [
      "आपका नाम क्या है"
    ],
    "examples": [
      {
        "text": "यह क्या है?",
        "slot": "यह",
        "cue": {
          "en": "this",
          "ko": "이것"
        },
        "gloss": {
          "en": "What is this?",
          "ko": "이게 뭐예요?"
        }
      },
      {
        "text": "वह क्या है?",
        "slot": "वह",
        "cue": {
          "en": "that",
          "ko": "저것"
        },
        "gloss": {
          "en": "What is that?",
          "ko": "저게 뭐예요?"
        }
      },
      {
        "text": "आपका नाम क्या है?",
        "slot": "आपका नाम",
        "cue": {
          "en": "your name",
          "ko": "당신 이름"
        },
        "gloss": {
          "en": "What is your name?",
          "ko": "이름이 뭐예요?"
        }
      },
      {
        "text": "इसका नाम क्या है?",
        "slot": "इसका नाम",
        "cue": {
          "en": "its name",
          "ko": "이것의 이름"
        },
        "gloss": {
          "en": "What is it called?",
          "ko": "이거 이름이 뭐예요?"
        }
      }
    ]
  },
  {
    "id": "hi-f1-12",
    "stage": 1,
    "fn": "possession",
    "pattern": "यह मेरा ___ है।",
    "core": [
      "यह मेरा"
    ],
    "meaning": {
      "en": "Saying something is yours (masculine noun): This is my ___.",
      "ko": "내 것 말하기(남성 명사): 이건 제 ___예요."
    },
    "grammar": [
      2,
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "यह मेरा बैग है।",
        "slot": "बैग",
        "cue": {
          "en": "bag",
          "ko": "가방"
        },
        "gloss": {
          "en": "This is my bag.",
          "ko": "이건 제 가방이에요."
        }
      },
      {
        "text": "यह मेरा फ़ोन है।",
        "slot": "फ़ोन",
        "cue": {
          "en": "phone",
          "ko": "휴대폰"
        },
        "gloss": {
          "en": "This is my phone.",
          "ko": "이건 제 휴대폰이에요."
        }
      },
      {
        "text": "यह मेरा टिकट है।",
        "slot": "टिकट",
        "cue": {
          "en": "ticket",
          "ko": "표"
        },
        "gloss": {
          "en": "This is my ticket.",
          "ko": "이건 제 표예요."
        }
      },
      {
        "text": "यह मेरा दोस्त है।",
        "slot": "दोस्त",
        "cue": {
          "en": "friend",
          "ko": "친구"
        },
        "gloss": {
          "en": "This is my friend.",
          "ko": "이쪽은 제 친구예요."
        }
      }
    ]
  },
  {
    "id": "hi-f1-13",
    "stage": 1,
    "fn": "possession",
    "pattern": "यह मेरी ___ है।",
    "core": [
      "यह मेरी"
    ],
    "meaning": {
      "en": "Saying something is yours (feminine noun): This is my ___.",
      "ko": "내 것 말하기(여성 명사): 이건 제 ___예요."
    },
    "grammar": [
      2,
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "यह मेरी किताब है।",
        "slot": "किताब",
        "cue": {
          "en": "book",
          "ko": "책"
        },
        "gloss": {
          "en": "This is my book.",
          "ko": "이건 제 책이에요."
        }
      },
      {
        "text": "यह मेरी सीट है।",
        "slot": "सीट",
        "cue": {
          "en": "seat",
          "ko": "자리"
        },
        "gloss": {
          "en": "This is my seat.",
          "ko": "여기는 제 자리예요."
        }
      },
      {
        "text": "यह मेरी बहन है।",
        "slot": "बहन",
        "cue": {
          "en": "sister",
          "ko": "여동생·누나"
        },
        "gloss": {
          "en": "This is my sister.",
          "ko": "이쪽은 제 여자 형제예요."
        }
      },
      {
        "text": "यह मेरी चाय है।",
        "slot": "चाय",
        "cue": {
          "en": "tea",
          "ko": "차"
        },
        "gloss": {
          "en": "This is my tea.",
          "ko": "이건 제 차예요."
        }
      }
    ]
  },
  {
    "id": "hi-f1-14",
    "stage": 1,
    "fn": "location-now",
    "pattern": "मैं ___ में हूँ।",
    "core": [
      "में हूँ"
    ],
    "meaning": {
      "en": "Saying where you are now: I'm in ___.",
      "ko": "지금 있는 곳 말하기: 저는 ___에 있어요."
    },
    "grammar": [
      0,
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "मैं दिल्ली में हूँ।",
        "slot": "दिल्ली",
        "cue": {
          "en": "Delhi",
          "ko": "델리"
        },
        "gloss": {
          "en": "I'm in Delhi.",
          "ko": "저는 델리에 있어요."
        }
      },
      {
        "text": "मैं मेट्रो में हूँ।",
        "slot": "मेट्रो",
        "cue": {
          "en": "the metro",
          "ko": "지하철"
        },
        "gloss": {
          "en": "I'm on the metro.",
          "ko": "저는 지하철 안이에요."
        }
      },
      {
        "text": "मैं क्लास में हूँ।",
        "slot": "क्लास",
        "cue": {
          "en": "class",
          "ko": "수업"
        },
        "gloss": {
          "en": "I'm in class.",
          "ko": "저는 수업 중이에요."
        }
      },
      {
        "text": "मैं बाज़ार में हूँ।",
        "slot": "बाज़ार",
        "cue": {
          "en": "the market",
          "ko": "시장"
        },
        "gloss": {
          "en": "I'm in the market.",
          "ko": "저는 시장에 있어요."
        }
      }
    ]
  },
  {
    "id": "hi-f1-15",
    "stage": 1,
    "fn": "yes-no",
    "pattern": "क्या आप ___ हैं?",
    "core": [
      "क्या आप"
    ],
    "meaning": {
      "en": "Asking a yes/no question about someone: Are you ___?",
      "ko": "예/아니요 질문: ___이세요?"
    },
    "grammar": [
      0,
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "क्या आप छात्र हैं?",
        "slot": "छात्र",
        "cue": {
          "en": "a student",
          "ko": "학생"
        },
        "gloss": {
          "en": "Are you a student?",
          "ko": "학생이세요?"
        }
      },
      {
        "text": "क्या आप ठीक हैं?",
        "slot": "ठीक",
        "cue": {
          "en": "okay",
          "ko": "괜찮은"
        },
        "gloss": {
          "en": "Are you okay?",
          "ko": "괜찮으세요?"
        }
      },
      {
        "text": "क्या आप यहाँ नए हैं?",
        "slot": "यहाँ नए",
        "cue": {
          "en": "new here",
          "ko": "여기 처음 온"
        },
        "gloss": {
          "en": "Are you new here?",
          "ko": "여기 처음 오셨어요?"
        }
      },
      {
        "text": "क्या आप भारत से हैं?",
        "slot": "भारत से",
        "cue": {
          "en": "from India",
          "ko": "인도 출신"
        },
        "gloss": {
          "en": "Are you from India?",
          "ko": "인도 분이세요?"
        }
      }
    ]
  },
  {
    "id": "hi-f1-16",
    "stage": 1,
    "fn": "not-understand",
    "pattern": "मुझे ___ समझ नहीं आया।",
    "core": [
      "समझ नहीं आया"
    ],
    "meaning": {
      "en": "Saying you didn't understand: I didn't understand ___.",
      "ko": "이해 못 했다고 하기: ___ 이해가 안 돼요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "मुझे यह समझ नहीं आया।",
        "slot": "यह",
        "cue": {
          "en": "this",
          "ko": "이것"
        },
        "gloss": {
          "en": "I didn't understand this.",
          "ko": "이게 이해가 안 됐어요."
        }
      },
      {
        "text": "मुझे यह शब्द समझ नहीं आया।",
        "slot": "यह शब्द",
        "cue": {
          "en": "this word",
          "ko": "이 단어"
        },
        "gloss": {
          "en": "I didn't understand this word.",
          "ko": "이 단어를 이해 못 했어요."
        }
      },
      {
        "text": "मुझे आपका सवाल समझ नहीं आया।",
        "slot": "आपका सवाल",
        "cue": {
          "en": "your question",
          "ko": "당신 질문"
        },
        "gloss": {
          "en": "I didn't understand your question.",
          "ko": "질문을 이해 못 했어요."
        }
      },
      {
        "text": "मुझे वह समझ नहीं आया।",
        "slot": "वह",
        "cue": {
          "en": "that",
          "ko": "그것"
        },
        "gloss": {
          "en": "I didn't understand that.",
          "ko": "그건 이해가 안 됐어요."
        }
      }
    ]
  },
  {
    "id": "hi-f1-17",
    "stage": 1,
    "fn": "ask-what",
    "pattern": "___ कौन है?",
    "core": [
      "कौन है"
    ],
    "meaning": {
      "en": "Asking who someone is: Who is ___?",
      "ko": "누구인지 묻기: ___ 누구예요?"
    },
    "grammar": [
      3,
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "वह कौन है?",
        "slot": "वह",
        "cue": {
          "en": "that person",
          "ko": "저 사람"
        },
        "gloss": {
          "en": "Who is that?",
          "ko": "저 사람은 누구예요?"
        }
      },
      {
        "text": "यह लड़का कौन है?",
        "slot": "यह लड़का",
        "cue": {
          "en": "this boy",
          "ko": "이 남자아이"
        },
        "gloss": {
          "en": "Who is this boy?",
          "ko": "이 남자아이는 누구예요?"
        }
      },
      {
        "text": "आपका दोस्त कौन है?",
        "slot": "आपका दोस्त",
        "cue": {
          "en": "your friend",
          "ko": "당신 친구"
        },
        "gloss": {
          "en": "Who is your friend?",
          "ko": "친구분은 누구예요?"
        }
      },
      {
        "text": "वहाँ कौन है?",
        "slot": "वहाँ",
        "cue": {
          "en": "there",
          "ko": "저기"
        },
        "gloss": {
          "en": "Who is there?",
          "ko": "저기 누구예요?"
        }
      }
    ]
  },
  {
    "id": "hi-f1-18",
    "stage": 1,
    "fn": "thank",
    "pattern": "___ के लिए धन्यवाद।",
    "core": [
      "के लिए धन्यवाद"
    ],
    "meaning": {
      "en": "Thanking for something: Thank you for ___.",
      "ko": "고마움 말하기: ___ 고마워요."
    },
    "grammar": [],
    "expressions": [
      "धन्यवाद"
    ],
    "examples": [
      {
        "text": "मदद के लिए धन्यवाद।",
        "slot": "मदद",
        "cue": {
          "en": "the help",
          "ko": "도움"
        },
        "gloss": {
          "en": "Thank you for the help.",
          "ko": "도와줘서 고마워요."
        }
      },
      {
        "text": "चाय के लिए धन्यवाद।",
        "slot": "चाय",
        "cue": {
          "en": "the tea",
          "ko": "차"
        },
        "gloss": {
          "en": "Thank you for the tea.",
          "ko": "차 고마워요."
        }
      },
      {
        "text": "पानी के लिए धन्यवाद।",
        "slot": "पानी",
        "cue": {
          "en": "the water",
          "ko": "물"
        },
        "gloss": {
          "en": "Thank you for the water.",
          "ko": "물 고마워요."
        }
      },
      {
        "text": "सब कुछ के लिए धन्यवाद।",
        "slot": "सब कुछ",
        "cue": {
          "en": "everything",
          "ko": "모든 것"
        },
        "gloss": {
          "en": "Thank you for everything.",
          "ko": "모두 고마워요."
        }
      }
    ]
  },
  {
    "id": "hi-f2-01",
    "stage": 2,
    "fn": "routine",
    "pattern": "मैं रोज़ ___ बजे उठता हूँ।",
    "core": [
      "उठता हूँ",
      "रोज़"
    ],
    "meaning": {
      "en": "Saying when you get up every day: I get up at ___ every day.",
      "ko": "기상 시간 말하기: 매일 ___시에 일어나요."
    },
    "grammar": [
      0,
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "मैं रोज़ छह बजे उठता हूँ।",
        "slot": "छह",
        "cue": {
          "en": "six",
          "ko": "여섯"
        },
        "gloss": {
          "en": "I get up at six every day.",
          "ko": "매일 여섯 시에 일어나요."
        }
      },
      {
        "text": "मैं रोज़ सात बजे उठता हूँ।",
        "slot": "सात",
        "cue": {
          "en": "seven",
          "ko": "일곱"
        },
        "gloss": {
          "en": "I get up at seven every day.",
          "ko": "매일 일곱 시에 일어나요."
        }
      },
      {
        "text": "मैं रोज़ साढ़े छह बजे उठता हूँ।",
        "slot": "साढ़े छह",
        "cue": {
          "en": "half past six",
          "ko": "여섯 시 반"
        },
        "gloss": {
          "en": "I get up at half past six every day.",
          "ko": "매일 여섯 시 반에 일어나요."
        }
      },
      {
        "text": "मैं रोज़ आठ बजे उठता हूँ।",
        "slot": "आठ",
        "cue": {
          "en": "eight",
          "ko": "여덟"
        },
        "gloss": {
          "en": "I get up at eight every day.",
          "ko": "매일 여덟 시에 일어나요."
        }
      }
    ]
  },
  {
    "id": "hi-f2-02",
    "stage": 2,
    "fn": "routine",
    "pattern": "मैं रोज़ ___ करता हूँ।",
    "core": [
      "करता हूँ"
    ],
    "meaning": {
      "en": "Saying what you do every day: I do ___ every day.",
      "ko": "매일 하는 일 말하기: 매일 ___ 해요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "मैं रोज़ योगा करता हूँ।",
        "slot": "योगा",
        "cue": {
          "en": "yoga",
          "ko": "요가"
        },
        "gloss": {
          "en": "I do yoga every day.",
          "ko": "매일 요가를 해요."
        }
      },
      {
        "text": "मैं रोज़ हिंदी की पढ़ाई करता हूँ।",
        "slot": "हिंदी की पढ़ाई",
        "cue": {
          "en": "Hindi study",
          "ko": "힌디어 공부"
        },
        "gloss": {
          "en": "I study Hindi every day.",
          "ko": "매일 힌디어 공부를 해요."
        }
      },
      {
        "text": "मैं रोज़ काम करता हूँ।",
        "slot": "काम",
        "cue": {
          "en": "work",
          "ko": "일"
        },
        "gloss": {
          "en": "I work every day.",
          "ko": "매일 일해요."
        }
      },
      {
        "text": "मैं रोज़ घर की सफ़ाई करता हूँ।",
        "slot": "घर की सफ़ाई",
        "cue": {
          "en": "house cleaning",
          "ko": "집 청소"
        },
        "gloss": {
          "en": "I clean the house every day.",
          "ko": "매일 집 청소를 해요."
        }
      }
    ]
  },
  {
    "id": "hi-f2-03",
    "stage": 2,
    "fn": "ongoing",
    "pattern": "मैं अभी ___ रहा हूँ।",
    "core": [
      "रहा हूँ"
    ],
    "meaning": {
      "en": "Saying what you're doing right now: I'm ___ right now.",
      "ko": "지금 하는 일 말하기: 지금 ___ 중이에요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "मैं अभी खाना खा रहा हूँ।",
        "slot": "खाना खा",
        "cue": {
          "en": "eating",
          "ko": "밥 먹는"
        },
        "gloss": {
          "en": "I'm eating right now.",
          "ko": "지금 밥 먹고 있어요."
        }
      },
      {
        "text": "मैं अभी घर जा रहा हूँ।",
        "slot": "घर जा",
        "cue": {
          "en": "going home",
          "ko": "집에 가는"
        },
        "gloss": {
          "en": "I'm going home right now.",
          "ko": "지금 집에 가고 있어요."
        }
      },
      {
        "text": "मैं अभी हिंदी सीख रहा हूँ।",
        "slot": "हिंदी सीख",
        "cue": {
          "en": "learning Hindi",
          "ko": "힌디어 배우는"
        },
        "gloss": {
          "en": "I'm learning Hindi right now.",
          "ko": "지금 힌디어를 배우고 있어요."
        }
      },
      {
        "text": "मैं अभी टीवी देख रहा हूँ।",
        "slot": "टीवी देख",
        "cue": {
          "en": "watching TV",
          "ko": "TV 보는"
        },
        "gloss": {
          "en": "I'm watching TV right now.",
          "ko": "지금 TV 보고 있어요."
        }
      }
    ]
  },
  {
    "id": "hi-f2-04",
    "stage": 2,
    "fn": "future-plan",
    "pattern": "कल मैं ___ जाऊँगा।",
    "core": [
      "जाऊँगा"
    ],
    "meaning": {
      "en": "Saying where you'll go: Tomorrow I'll go to ___.",
      "ko": "갈 곳 말하기: 내일 ___에 갈 거예요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "कल मैं बाज़ार जाऊँगा।",
        "slot": "बाज़ार",
        "cue": {
          "en": "the market",
          "ko": "시장"
        },
        "gloss": {
          "en": "Tomorrow I'll go to the market.",
          "ko": "내일 시장에 갈 거예요."
        }
      },
      {
        "text": "कल मैं ऑफ़िस जाऊँगा।",
        "slot": "ऑफ़िस",
        "cue": {
          "en": "the office",
          "ko": "사무실"
        },
        "gloss": {
          "en": "Tomorrow I'll go to the office.",
          "ko": "내일 회사에 갈 거예요."
        }
      },
      {
        "text": "कल मैं आगरा जाऊँगा।",
        "slot": "आगरा",
        "cue": {
          "en": "Agra",
          "ko": "아그라"
        },
        "gloss": {
          "en": "Tomorrow I'll go to Agra.",
          "ko": "내일 아그라에 갈 거예요."
        }
      },
      {
        "text": "कल मैं दोस्त के घर जाऊँगा।",
        "slot": "दोस्त के घर",
        "cue": {
          "en": "a friend's house",
          "ko": "친구 집"
        },
        "gloss": {
          "en": "Tomorrow I'll go to a friend's house.",
          "ko": "내일 친구 집에 갈 거예요."
        }
      }
    ]
  },
  {
    "id": "hi-f2-05",
    "stage": 2,
    "fn": "past-did",
    "pattern": "पिछले हफ़्ते मैं ___ गया।",
    "core": [
      "पिछले हफ़्ते"
    ],
    "meaning": {
      "en": "Saying where you went: Last week I went to ___.",
      "ko": "다녀온 곳 말하기: 지난주에 ___에 갔어요."
    },
    "grammar": [
      3
    ],
    "expressions": [
      "पिछले हफ़्ते"
    ],
    "examples": [
      {
        "text": "पिछले हफ़्ते मैं जयपुर गया।",
        "slot": "जयपुर",
        "cue": {
          "en": "Jaipur",
          "ko": "자이푸르"
        },
        "gloss": {
          "en": "Last week I went to Jaipur.",
          "ko": "지난주에 자이푸르에 갔어요."
        }
      },
      {
        "text": "पिछले हफ़्ते मैं गोवा गया।",
        "slot": "गोवा",
        "cue": {
          "en": "Goa",
          "ko": "고아"
        },
        "gloss": {
          "en": "Last week I went to Goa.",
          "ko": "지난주에 고아에 갔어요."
        }
      },
      {
        "text": "पिछले हफ़्ते मैं मुंबई गया।",
        "slot": "मुंबई",
        "cue": {
          "en": "Mumbai",
          "ko": "뭄바이"
        },
        "gloss": {
          "en": "Last week I went to Mumbai.",
          "ko": "지난주에 뭄바이에 갔어요."
        }
      },
      {
        "text": "पिछले हफ़्ते मैं अपने गाँव गया।",
        "slot": "अपने गाँव",
        "cue": {
          "en": "my village",
          "ko": "고향 마을"
        },
        "gloss": {
          "en": "Last week I went to my village.",
          "ko": "지난주에 고향 마을에 갔어요."
        }
      }
    ]
  },
  {
    "id": "hi-f2-06",
    "stage": 2,
    "fn": "like",
    "pattern": "मुझे ___ पसंद है।",
    "core": [
      "पसंद है"
    ],
    "meaning": {
      "en": "Saying what you like: I like ___.",
      "ko": "좋아하는 것 말하기: ___ 좋아해요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "मुझे चाय पसंद है।",
        "slot": "चाय",
        "cue": {
          "en": "tea",
          "ko": "차"
        },
        "gloss": {
          "en": "I like tea.",
          "ko": "차를 좋아해요."
        }
      },
      {
        "text": "मुझे क्रिकेट पसंद है।",
        "slot": "क्रिकेट",
        "cue": {
          "en": "cricket",
          "ko": "크리켓"
        },
        "gloss": {
          "en": "I like cricket.",
          "ko": "크리켓을 좋아해요."
        }
      },
      {
        "text": "मुझे घर का खाना पसंद है।",
        "slot": "घर का खाना",
        "cue": {
          "en": "home cooking",
          "ko": "집밥"
        },
        "gloss": {
          "en": "I like home cooking.",
          "ko": "집밥을 좋아해요."
        }
      },
      {
        "text": "मुझे यह शहर पसंद है।",
        "slot": "यह शहर",
        "cue": {
          "en": "this city",
          "ko": "이 도시"
        },
        "gloss": {
          "en": "I like this city.",
          "ko": "이 도시가 좋아요."
        }
      }
    ]
  },
  {
    "id": "hi-f2-07",
    "stage": 2,
    "fn": "dislike",
    "pattern": "मुझे ___ पसंद नहीं।",
    "core": [
      "पसंद नहीं"
    ],
    "meaning": {
      "en": "Saying what you don't like: I don't like ___.",
      "ko": "싫어하는 것 말하기: ___ 별로예요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "मुझे भीड़ पसंद नहीं।",
        "slot": "भीड़",
        "cue": {
          "en": "crowds",
          "ko": "사람 많은 곳"
        },
        "gloss": {
          "en": "I don't like crowds.",
          "ko": "붐비는 건 싫어요."
        }
      },
      {
        "text": "मुझे ज़्यादा गर्मी पसंद नहीं।",
        "slot": "ज़्यादा गर्मी",
        "cue": {
          "en": "too much heat",
          "ko": "너무 더운 날씨"
        },
        "gloss": {
          "en": "I don't like too much heat.",
          "ko": "너무 더운 건 싫어요."
        }
      },
      {
        "text": "मुझे कड़वी कॉफ़ी पसंद नहीं।",
        "slot": "कड़वी कॉफ़ी",
        "cue": {
          "en": "bitter coffee",
          "ko": "쓴 커피"
        },
        "gloss": {
          "en": "I don't like bitter coffee.",
          "ko": "쓴 커피는 별로예요."
        }
      },
      {
        "text": "मुझे प्याज़ पसंद नहीं।",
        "slot": "प्याज़",
        "cue": {
          "en": "onion",
          "ko": "양파"
        },
        "gloss": {
          "en": "I don't like onion.",
          "ko": "양파는 별로예요."
        }
      }
    ]
  },
  {
    "id": "hi-f2-08",
    "stage": 2,
    "fn": "suggest-time",
    "pattern": "चलो, ___ बजे मिलते हैं।",
    "core": [
      "बजे मिलते हैं"
    ],
    "meaning": {
      "en": "Suggesting a time to meet: Let's meet at ___.",
      "ko": "만날 시간 정하기: ___시에 만나자."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "चलो, पाँच बजे मिलते हैं।",
        "slot": "पाँच",
        "cue": {
          "en": "five",
          "ko": "다섯"
        },
        "gloss": {
          "en": "Let's meet at five.",
          "ko": "다섯 시에 만나자."
        }
      },
      {
        "text": "चलो, छह बजे मिलते हैं।",
        "slot": "छह",
        "cue": {
          "en": "six",
          "ko": "여섯"
        },
        "gloss": {
          "en": "Let's meet at six.",
          "ko": "여섯 시에 만나자."
        }
      },
      {
        "text": "चलो, साढ़े सात बजे मिलते हैं।",
        "slot": "साढ़े सात",
        "cue": {
          "en": "half past seven",
          "ko": "일곱 시 반"
        },
        "gloss": {
          "en": "Let's meet at half past seven.",
          "ko": "일곱 시 반에 만나자."
        }
      },
      {
        "text": "चलो, दस बजे मिलते हैं।",
        "slot": "दस",
        "cue": {
          "en": "ten",
          "ko": "열"
        },
        "gloss": {
          "en": "Let's meet at ten.",
          "ko": "열 시에 만나자."
        }
      }
    ]
  },
  {
    "id": "hi-f2-09",
    "stage": 2,
    "fn": "time-when",
    "pattern": "___ कितने बजे है?",
    "core": [
      "कितने बजे"
    ],
    "meaning": {
      "en": "Asking what time something is: What time is ___?",
      "ko": "시간 묻기: ___ 몇 시예요?"
    },
    "grammar": [
      6
    ],
    "expressions": [
      "कितने बजे"
    ],
    "examples": [
      {
        "text": "फ़िल्म कितने बजे है?",
        "slot": "फ़िल्म",
        "cue": {
          "en": "the film",
          "ko": "영화"
        },
        "gloss": {
          "en": "What time is the film?",
          "ko": "영화 몇 시야?"
        }
      },
      {
        "text": "ट्रेन कितने बजे है?",
        "slot": "ट्रेन",
        "cue": {
          "en": "the train",
          "ko": "기차"
        },
        "gloss": {
          "en": "What time is the train?",
          "ko": "기차 몇 시예요?"
        }
      },
      {
        "text": "क्लास कितने बजे है?",
        "slot": "क्लास",
        "cue": {
          "en": "the class",
          "ko": "수업"
        },
        "gloss": {
          "en": "What time is the class?",
          "ko": "수업 몇 시예요?"
        }
      },
      {
        "text": "मीटिंग कितने बजे है?",
        "slot": "मीटिंग",
        "cue": {
          "en": "the meeting",
          "ko": "회의"
        },
        "gloss": {
          "en": "What time is the meeting?",
          "ko": "회의 몇 시예요?"
        }
      }
    ]
  },
  {
    "id": "hi-f2-10",
    "stage": 2,
    "fn": "sequence",
    "pattern": "___ के बाद मैं थोड़ा आराम करता हूँ।",
    "core": [
      "के बाद"
    ],
    "meaning": {
      "en": "Saying what you do after something: After ___ I rest a bit.",
      "ko": "순서 말하기: ___ 후에 좀 쉬어요."
    },
    "grammar": [
      0,
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "खाने के बाद मैं थोड़ा आराम करता हूँ।",
        "slot": "खाने",
        "cue": {
          "en": "eating",
          "ko": "식사"
        },
        "gloss": {
          "en": "After eating I rest a bit.",
          "ko": "밥 먹고 나서 좀 쉬어요."
        }
      },
      {
        "text": "काम के बाद मैं थोड़ा आराम करता हूँ।",
        "slot": "काम",
        "cue": {
          "en": "work",
          "ko": "일"
        },
        "gloss": {
          "en": "After work I rest a bit.",
          "ko": "일 끝나고 좀 쉬어요."
        }
      },
      {
        "text": "क्लास के बाद मैं थोड़ा आराम करता हूँ।",
        "slot": "क्लास",
        "cue": {
          "en": "class",
          "ko": "수업"
        },
        "gloss": {
          "en": "After class I rest a bit.",
          "ko": "수업 끝나고 좀 쉬어요."
        }
      },
      {
        "text": "योगा के बाद मैं थोड़ा आराम करता हूँ।",
        "slot": "योगा",
        "cue": {
          "en": "yoga",
          "ko": "요가"
        },
        "gloss": {
          "en": "After yoga I rest a bit.",
          "ko": "요가 끝나고 좀 쉬어요."
        }
      }
    ]
  },
  {
    "id": "hi-f2-11",
    "stage": 2,
    "fn": "time-when",
    "pattern": "मैं ___ से पहले घर आऊँगा।",
    "core": [
      "से पहले"
    ],
    "meaning": {
      "en": "Saying you'll do something before a time: I'll come home before ___.",
      "ko": "~ 전에 하기: ___ 전에 집에 올게요."
    },
    "grammar": [
      2,
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "मैं आठ बजे से पहले घर आऊँगा।",
        "slot": "आठ बजे",
        "cue": {
          "en": "eight o'clock",
          "ko": "여덟 시"
        },
        "gloss": {
          "en": "I'll come home before eight.",
          "ko": "여덟 시 전에 집에 올게요."
        }
      },
      {
        "text": "मैं खाने से पहले घर आऊँगा।",
        "slot": "खाने",
        "cue": {
          "en": "dinner",
          "ko": "저녁 식사"
        },
        "gloss": {
          "en": "I'll come home before dinner.",
          "ko": "저녁 먹기 전에 집에 올게요."
        }
      },
      {
        "text": "मैं अँधेरे से पहले घर आऊँगा।",
        "slot": "अँधेरे",
        "cue": {
          "en": "dark",
          "ko": "어두워지기"
        },
        "gloss": {
          "en": "I'll come home before dark.",
          "ko": "어두워지기 전에 집에 올게요."
        }
      },
      {
        "text": "मैं बारिश से पहले घर आऊँगा।",
        "slot": "बारिश",
        "cue": {
          "en": "the rain",
          "ko": "비"
        },
        "gloss": {
          "en": "I'll come home before the rain.",
          "ko": "비 오기 전에 집에 올게요."
        }
      }
    ]
  },
  {
    "id": "hi-f2-12",
    "stage": 2,
    "fn": "live-where",
    "pattern": "मेरा घर ___ के पास है।",
    "core": [
      "के पास है"
    ],
    "meaning": {
      "en": "Saying what your home is near: My home is near ___.",
      "ko": "사는 곳 말하기: 우리 집은 ___ 근처예요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "मेरा घर मेट्रो स्टेशन के पास है।",
        "slot": "मेट्रो स्टेशन",
        "cue": {
          "en": "the metro station",
          "ko": "지하철역"
        },
        "gloss": {
          "en": "My home is near the metro station.",
          "ko": "우리 집은 지하철역 근처예요."
        }
      },
      {
        "text": "मेरा घर पार्क के पास है।",
        "slot": "पार्क",
        "cue": {
          "en": "the park",
          "ko": "공원"
        },
        "gloss": {
          "en": "My home is near the park.",
          "ko": "우리 집은 공원 근처예요."
        }
      },
      {
        "text": "मेरा घर बाज़ार के पास है।",
        "slot": "बाज़ार",
        "cue": {
          "en": "the market",
          "ko": "시장"
        },
        "gloss": {
          "en": "My home is near the market.",
          "ko": "우리 집은 시장 근처예요."
        }
      },
      {
        "text": "मेरा घर कॉलेज के पास है।",
        "slot": "कॉलेज",
        "cue": {
          "en": "the college",
          "ko": "대학"
        },
        "gloss": {
          "en": "My home is near the college.",
          "ko": "우리 집은 대학 근처예요."
        }
      }
    ]
  },
  {
    "id": "hi-f2-13",
    "stage": 2,
    "fn": "order",
    "pattern": "___ ले आइए।",
    "core": [
      "ले आइए"
    ],
    "meaning": {
      "en": "Asking staff to bring something: Please bring ___.",
      "ko": "가져다 달라고 하기: ___ 가져다주세요."
    },
    "grammar": [],
    "expressions": [
      "बिल ले आइए"
    ],
    "examples": [
      {
        "text": "बिल ले आइए।",
        "slot": "बिल",
        "cue": {
          "en": "the bill",
          "ko": "계산서"
        },
        "gloss": {
          "en": "Please bring the bill.",
          "ko": "계산서 가져다주세요."
        }
      },
      {
        "text": "दो रोटी और ले आइए।",
        "slot": "दो रोटी और",
        "cue": {
          "en": "two more rotis",
          "ko": "로티 두 장 더"
        },
        "gloss": {
          "en": "Please bring two more rotis.",
          "ko": "로티 두 장 더 가져다주세요."
        }
      },
      {
        "text": "एक प्लेट दाल ले आइए।",
        "slot": "एक प्लेट दाल",
        "cue": {
          "en": "a plate of dal",
          "ko": "달 한 접시"
        },
        "gloss": {
          "en": "Please bring a plate of dal.",
          "ko": "달 한 접시 가져다주세요."
        }
      },
      {
        "text": "ठंडा पानी ले आइए।",
        "slot": "ठंडा पानी",
        "cue": {
          "en": "cold water",
          "ko": "찬물"
        },
        "gloss": {
          "en": "Please bring cold water.",
          "ko": "찬물 좀 가져다주세요."
        }
      }
    ]
  },
  {
    "id": "hi-f2-14",
    "stage": 2,
    "fn": "invite",
    "pattern": "चलो, ___ चलते हैं।",
    "core": [
      "चलते हैं"
    ],
    "meaning": {
      "en": "Inviting a friend: Come on, let's go ___.",
      "ko": "같이 하자고 하기: 자, ___ 가자."
    },
    "grammar": [],
    "expressions": [],
    "examples": [
      {
        "text": "चलो, फ़िल्म देखने चलते हैं।",
        "slot": "फ़िल्म देखने",
        "cue": {
          "en": "to see a film",
          "ko": "영화 보러"
        },
        "gloss": {
          "en": "Come on, let's go see a film.",
          "ko": "자, 영화 보러 가자."
        }
      },
      {
        "text": "चलो, बाहर खाने चलते हैं।",
        "slot": "बाहर खाने",
        "cue": {
          "en": "out to eat",
          "ko": "밖에 밥 먹으러"
        },
        "gloss": {
          "en": "Come on, let's go out to eat.",
          "ko": "자, 밖에 밥 먹으러 가자."
        }
      },
      {
        "text": "चलो, घूमने चलते हैं।",
        "slot": "घूमने",
        "cue": {
          "en": "for a walk",
          "ko": "바람 쐬러"
        },
        "gloss": {
          "en": "Come on, let's go for a walk.",
          "ko": "자, 바람 쐬러 가자."
        }
      },
      {
        "text": "चलो, मार्केट चलते हैं।",
        "slot": "मार्केट",
        "cue": {
          "en": "to the market",
          "ko": "시장에"
        },
        "gloss": {
          "en": "Come on, let's go to the market.",
          "ko": "자, 시장에 가자."
        }
      }
    ]
  },
  {
    "id": "hi-f2-15",
    "stage": 2,
    "fn": "past-did",
    "pattern": "आज सुबह मैं ___ गया।",
    "core": [
      "आज सुबह"
    ],
    "meaning": {
      "en": "Saying where you went this morning: This morning I went to ___.",
      "ko": "오늘 아침 한 일: 오늘 아침에 ___에 갔어요."
    },
    "grammar": [
      3
    ],
    "expressions": [
      "आज सुबह"
    ],
    "examples": [
      {
        "text": "आज सुबह मैं पार्क गया।",
        "slot": "पार्क",
        "cue": {
          "en": "the park",
          "ko": "공원"
        },
        "gloss": {
          "en": "This morning I went to the park.",
          "ko": "오늘 아침에 공원에 갔어요."
        }
      },
      {
        "text": "आज सुबह मैं मंदिर गया।",
        "slot": "मंदिर",
        "cue": {
          "en": "the temple",
          "ko": "사원"
        },
        "gloss": {
          "en": "This morning I went to the temple.",
          "ko": "오늘 아침에 사원에 갔어요."
        }
      },
      {
        "text": "आज सुबह मैं जिम गया।",
        "slot": "जिम",
        "cue": {
          "en": "the gym",
          "ko": "헬스장"
        },
        "gloss": {
          "en": "This morning I went to the gym.",
          "ko": "오늘 아침에 헬스장에 갔어요."
        }
      },
      {
        "text": "आज सुबह मैं बैंक गया।",
        "slot": "बैंक",
        "cue": {
          "en": "the bank",
          "ko": "은행"
        },
        "gloss": {
          "en": "This morning I went to the bank.",
          "ko": "오늘 아침에 은행에 갔어요."
        }
      }
    ]
  },
  {
    "id": "hi-f2-16",
    "stage": 2,
    "fn": "describe-person",
    "pattern": "मेरा बड़ा भाई ___ में रहता है।",
    "core": [
      "बड़ा भाई"
    ],
    "meaning": {
      "en": "Talking about family: My older brother lives in ___.",
      "ko": "가족 이야기: 우리 형은 ___에 살아요."
    },
    "grammar": [
      0
    ],
    "expressions": [
      "बड़ा भाई"
    ],
    "examples": [
      {
        "text": "मेरा बड़ा भाई मुंबई में रहता है।",
        "slot": "मुंबई",
        "cue": {
          "en": "Mumbai",
          "ko": "뭄바이"
        },
        "gloss": {
          "en": "My older brother lives in Mumbai.",
          "ko": "우리 형은 뭄바이에 살아요."
        }
      },
      {
        "text": "मेरा बड़ा भाई सियोल में रहता है।",
        "slot": "सियोल",
        "cue": {
          "en": "Seoul",
          "ko": "서울"
        },
        "gloss": {
          "en": "My older brother lives in Seoul.",
          "ko": "우리 형은 서울에 살아요."
        }
      },
      {
        "text": "मेरा बड़ा भाई अमेरिका में रहता है।",
        "slot": "अमेरिका",
        "cue": {
          "en": "America",
          "ko": "미국"
        },
        "gloss": {
          "en": "My older brother lives in America.",
          "ko": "우리 형은 미국에 살아요."
        }
      },
      {
        "text": "मेरा बड़ा भाई हमारे गाँव में रहता है।",
        "slot": "हमारे गाँव",
        "cue": {
          "en": "our village",
          "ko": "우리 고향 마을"
        },
        "gloss": {
          "en": "My older brother lives in our village.",
          "ko": "우리 형은 고향 마을에 살아요."
        }
      }
    ]
  },
  {
    "id": "hi-f2-17",
    "stage": 2,
    "fn": "future-plan",
    "pattern": "इस वीकेंड मैं ___ करूँगा।",
    "core": [
      "करूँगा"
    ],
    "meaning": {
      "en": "Saying what you'll do: This weekend I'll ___.",
      "ko": "할 일 말하기: 이번 주말에 ___ 할 거예요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "इस वीकेंड मैं आराम करूँगा।",
        "slot": "आराम",
        "cue": {
          "en": "rest",
          "ko": "휴식"
        },
        "gloss": {
          "en": "This weekend I'll rest.",
          "ko": "이번 주말에 쉴 거예요."
        }
      },
      {
        "text": "इस वीकेंड मैं थोड़ी शॉपिंग करूँगा।",
        "slot": "थोड़ी शॉपिंग",
        "cue": {
          "en": "some shopping",
          "ko": "쇼핑 조금"
        },
        "gloss": {
          "en": "This weekend I'll do some shopping.",
          "ko": "이번 주말에 쇼핑 좀 할 거예요."
        }
      },
      {
        "text": "इस वीकेंड मैं पढ़ाई करूँगा।",
        "slot": "पढ़ाई",
        "cue": {
          "en": "studying",
          "ko": "공부"
        },
        "gloss": {
          "en": "This weekend I'll study.",
          "ko": "이번 주말에 공부할 거예요."
        }
      },
      {
        "text": "इस वीकेंड मैं घर की सफ़ाई करूँगा।",
        "slot": "घर की सफ़ाई",
        "cue": {
          "en": "house cleaning",
          "ko": "집 청소"
        },
        "gloss": {
          "en": "This weekend I'll clean the house.",
          "ko": "이번 주말에 집 청소할 거예요."
        }
      }
    ]
  },
  {
    "id": "hi-f3-01",
    "stage": 3,
    "fn": "opinion",
    "pattern": "मुझे लगता है कि ___।",
    "core": [
      "मुझे लगता है कि"
    ],
    "meaning": {
      "en": "Giving your opinion: I think that ___.",
      "ko": "생각 말하기: ~인 것 같아요."
    },
    "grammar": [
      5
    ],
    "expressions": [
      "मुझे लगता है"
    ],
    "examples": [
      {
        "text": "मुझे लगता है कि यह सही नहीं है।",
        "slot": "यह सही नहीं है",
        "cue": {
          "en": "it's not right",
          "ko": "옳지 않다"
        },
        "gloss": {
          "en": "I think this isn't right.",
          "ko": "이건 옳지 않은 것 같아요."
        }
      },
      {
        "text": "मुझे लगता है कि फ़िल्म थोड़ी लंबी थी।",
        "slot": "फ़िल्म थोड़ी लंबी थी",
        "cue": {
          "en": "the film was a bit long",
          "ko": "영화가 좀 길었다"
        },
        "gloss": {
          "en": "I think the film was a bit long.",
          "ko": "영화가 좀 길었던 것 같아요."
        }
      },
      {
        "text": "मुझे लगता है कि वह सच बोल रहा है।",
        "slot": "वह सच बोल रहा है",
        "cue": {
          "en": "he's telling the truth",
          "ko": "그가 사실을 말한다"
        },
        "gloss": {
          "en": "I think he's telling the truth.",
          "ko": "그 사람 말이 사실인 것 같아요."
        }
      },
      {
        "text": "मुझे लगता है कि बारिश होगी।",
        "slot": "बारिश होगी",
        "cue": {
          "en": "it'll rain",
          "ko": "비가 올 것이다"
        },
        "gloss": {
          "en": "I think it'll rain.",
          "ko": "비가 올 것 같아요."
        }
      }
    ]
  },
  {
    "id": "hi-f3-02",
    "stage": 3,
    "fn": "opinion",
    "pattern": "मेरे ख़याल से ___।",
    "core": [
      "मेरे ख़याल से"
    ],
    "meaning": {
      "en": "Giving your view: In my view, ___.",
      "ko": "의견 말하기: 제 생각엔 ~예요."
    },
    "grammar": [],
    "expressions": [
      "मेरे ख़याल से"
    ],
    "examples": [
      {
        "text": "मेरे ख़याल से यह अच्छा आइडिया है।",
        "slot": "यह अच्छा आइडिया है",
        "cue": {
          "en": "it's a good idea",
          "ko": "좋은 생각이다"
        },
        "gloss": {
          "en": "In my view, it's a good idea.",
          "ko": "제 생각엔 좋은 아이디어예요."
        }
      },
      {
        "text": "मेरे ख़याल से हमें इंतज़ार करना चाहिए।",
        "slot": "हमें इंतज़ार करना चाहिए",
        "cue": {
          "en": "we should wait",
          "ko": "기다려야 한다"
        },
        "gloss": {
          "en": "In my view, we should wait.",
          "ko": "제 생각엔 기다려야 해요."
        }
      },
      {
        "text": "मेरे ख़याल से उसकी एक्टिंग अच्छी थी।",
        "slot": "उसकी एक्टिंग अच्छी थी",
        "cue": {
          "en": "his acting was good",
          "ko": "그의 연기가 좋았다"
        },
        "gloss": {
          "en": "In my view, his acting was good.",
          "ko": "제 생각엔 그 사람 연기가 좋았어요."
        }
      },
      {
        "text": "मेरे ख़याल से यह बहुत महँगा है।",
        "slot": "यह बहुत महँगा है",
        "cue": {
          "en": "it's too expensive",
          "ko": "너무 비싸다"
        },
        "gloss": {
          "en": "In my view, it's too expensive.",
          "ko": "제 생각엔 너무 비싸요."
        }
      }
    ]
  },
  {
    "id": "hi-f3-03",
    "stage": 3,
    "fn": "polite-request",
    "pattern": "क्या आप ___ सकते हैं?",
    "core": [
      "सकते हैं"
    ],
    "meaning": {
      "en": "Asking politely: Could you ___?",
      "ko": "공손히 부탁하기: ~해 주실 수 있어요?"
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "क्या आप मेरी मदद कर सकते हैं?",
        "slot": "मेरी मदद कर",
        "cue": {
          "en": "help me",
          "ko": "저를 도와"
        },
        "gloss": {
          "en": "Could you help me?",
          "ko": "저 좀 도와주실 수 있어요?"
        }
      },
      {
        "text": "क्या आप थोड़ा धीरे बोल सकते हैं?",
        "slot": "थोड़ा धीरे बोल",
        "cue": {
          "en": "speak a bit slower",
          "ko": "조금 천천히 말해"
        },
        "gloss": {
          "en": "Could you speak a bit slower?",
          "ko": "조금 천천히 말씀해 주실 수 있어요?"
        }
      },
      {
        "text": "क्या आप इसे ठीक कर सकते हैं?",
        "slot": "इसे ठीक कर",
        "cue": {
          "en": "fix this",
          "ko": "이걸 고쳐"
        },
        "gloss": {
          "en": "Could you fix this?",
          "ko": "이것 좀 고쳐 주실 수 있어요?"
        }
      },
      {
        "text": "क्या आप आज शाम आ सकते हैं?",
        "slot": "आज शाम आ",
        "cue": {
          "en": "come this evening",
          "ko": "오늘 저녁에 와"
        },
        "gloss": {
          "en": "Could you come this evening?",
          "ko": "오늘 저녁에 와 주실 수 있어요?"
        }
      }
    ]
  },
  {
    "id": "hi-f3-04",
    "stage": 3,
    "fn": "can",
    "pattern": "मैं ___ सकता हूँ।",
    "core": [
      "सकता हूँ"
    ],
    "meaning": {
      "en": "Saying what you can do: I can ___.",
      "ko": "할 수 있는 것: ~할 수 있어요."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "मैं कल आ सकता हूँ।",
        "slot": "कल आ",
        "cue": {
          "en": "come tomorrow",
          "ko": "내일 와"
        },
        "gloss": {
          "en": "I can come tomorrow.",
          "ko": "내일 올 수 있어요."
        }
      },
      {
        "text": "मैं हिंदी पढ़ सकता हूँ।",
        "slot": "हिंदी पढ़",
        "cue": {
          "en": "read Hindi",
          "ko": "힌디어를 읽어"
        },
        "gloss": {
          "en": "I can read Hindi.",
          "ko": "힌디어를 읽을 수 있어요."
        }
      },
      {
        "text": "मैं यह काम कर सकता हूँ।",
        "slot": "यह काम कर",
        "cue": {
          "en": "do this job",
          "ko": "이 일을 해"
        },
        "gloss": {
          "en": "I can do this job.",
          "ko": "이 일을 할 수 있어요."
        }
      },
      {
        "text": "मैं थोड़ा इंतज़ार कर सकता हूँ।",
        "slot": "थोड़ा इंतज़ार कर",
        "cue": {
          "en": "wait a little",
          "ko": "조금 기다려"
        },
        "gloss": {
          "en": "I can wait a little.",
          "ko": "조금 기다릴 수 있어요."
        }
      }
    ]
  },
  {
    "id": "hi-f3-05",
    "stage": 3,
    "fn": "advice-give",
    "pattern": "आपको ___ चाहिए।",
    "core": [
      "आपको"
    ],
    "meaning": {
      "en": "Giving advice: You should ___.",
      "ko": "조언하기: ~하는 게 좋겠어요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "आपको डॉक्टर से मिलना चाहिए।",
        "slot": "डॉक्टर से मिलना",
        "cue": {
          "en": "see a doctor",
          "ko": "의사를 만나다"
        },
        "gloss": {
          "en": "You should see a doctor.",
          "ko": "의사를 만나 보는 게 좋겠어요."
        }
      },
      {
        "text": "आपको आराम करना चाहिए।",
        "slot": "आराम करना",
        "cue": {
          "en": "rest",
          "ko": "쉬다"
        },
        "gloss": {
          "en": "You should rest.",
          "ko": "쉬는 게 좋겠어요."
        }
      },
      {
        "text": "आपको उससे बात करना चाहिए।",
        "slot": "उससे बात करना",
        "cue": {
          "en": "talk to him",
          "ko": "그와 이야기하다"
        },
        "gloss": {
          "en": "You should talk to him.",
          "ko": "그 사람이랑 이야기해 보는 게 좋겠어요."
        }
      },
      {
        "text": "आपको जल्दी निकलना चाहिए।",
        "slot": "जल्दी निकलना",
        "cue": {
          "en": "leave early",
          "ko": "일찍 나가다"
        },
        "gloss": {
          "en": "You should leave early.",
          "ko": "일찍 나가는 게 좋겠어요."
        }
      }
    ]
  },
  {
    "id": "hi-f3-06",
    "stage": 3,
    "fn": "advice-ask",
    "pattern": "क्या मुझे ___ चाहिए?",
    "core": [
      "क्या मुझे"
    ],
    "meaning": {
      "en": "Asking for advice: Should I ___?",
      "ko": "조언 구하기: 제가 ~해야 할까요?"
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "क्या मुझे टिकट कैंसल करना चाहिए?",
        "slot": "टिकट कैंसल करना",
        "cue": {
          "en": "cancel the ticket",
          "ko": "표를 취소하다"
        },
        "gloss": {
          "en": "Should I cancel the ticket?",
          "ko": "표를 취소해야 할까요?"
        }
      },
      {
        "text": "क्या मुझे उसे फ़ोन करना चाहिए?",
        "slot": "उसे फ़ोन करना",
        "cue": {
          "en": "call him",
          "ko": "그에게 전화하다"
        },
        "gloss": {
          "en": "Should I call him?",
          "ko": "그 사람한테 전화해야 할까요?"
        }
      },
      {
        "text": "क्या मुझे कल फिर आना चाहिए?",
        "slot": "कल फिर आना",
        "cue": {
          "en": "come again tomorrow",
          "ko": "내일 다시 오다"
        },
        "gloss": {
          "en": "Should I come again tomorrow?",
          "ko": "내일 다시 와야 할까요?"
        }
      },
      {
        "text": "क्या मुझे डॉक्टर के पास जाना चाहिए?",
        "slot": "डॉक्टर के पास जाना",
        "cue": {
          "en": "go to the doctor",
          "ko": "병원에 가다"
        },
        "gloss": {
          "en": "Should I go to the doctor?",
          "ko": "병원에 가야 할까요?"
        }
      }
    ]
  },
  {
    "id": "hi-f3-07",
    "stage": 3,
    "fn": "story-past",
    "pattern": "मैंने कल ___ देखी।",
    "core": [
      "मैंने"
    ],
    "meaning": {
      "en": "Saying what you watched: Yesterday I watched ___.",
      "ko": "본 것 말하기: 어제 ___을 봤어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "मैंने कल वह फ़िल्म देखी।",
        "slot": "वह फ़िल्म",
        "cue": {
          "en": "that film",
          "ko": "그 영화"
        },
        "gloss": {
          "en": "Yesterday I watched that film.",
          "ko": "어제 그 영화를 봤어요."
        }
      },
      {
        "text": "मैंने कल एक नई सीरीज़ देखी।",
        "slot": "एक नई सीरीज़",
        "cue": {
          "en": "a new series",
          "ko": "새 시리즈"
        },
        "gloss": {
          "en": "Yesterday I watched a new series.",
          "ko": "어제 새 시리즈를 봤어요."
        }
      },
      {
        "text": "मैंने कल एक डॉक्यूमेंट्री देखी।",
        "slot": "एक डॉक्यूमेंट्री",
        "cue": {
          "en": "a documentary",
          "ko": "다큐멘터리"
        },
        "gloss": {
          "en": "Yesterday I watched a documentary.",
          "ko": "어제 다큐멘터리를 봤어요."
        }
      },
      {
        "text": "मैंने कल उसकी नई फ़िल्म देखी।",
        "slot": "उसकी नई फ़िल्म",
        "cue": {
          "en": "his new film",
          "ko": "그의 새 영화"
        },
        "gloss": {
          "en": "Yesterday I watched his new film.",
          "ko": "어제 그 사람 새 영화를 봤어요."
        }
      }
    ]
  },
  {
    "id": "hi-f3-08",
    "stage": 3,
    "fn": "story-past",
    "pattern": "मैंने ___ ख़रीदा।",
    "core": [
      "ख़रीदा"
    ],
    "meaning": {
      "en": "Saying what you bought: I bought ___.",
      "ko": "산 것 말하기: ___을 샀어요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "मैंने नया फ़ोन ख़रीदा।",
        "slot": "नया फ़ोन",
        "cue": {
          "en": "a new phone",
          "ko": "새 휴대폰"
        },
        "gloss": {
          "en": "I bought a new phone.",
          "ko": "새 휴대폰을 샀어요."
        }
      },
      {
        "text": "मैंने यह पंखा ख़रीदा।",
        "slot": "यह पंखा",
        "cue": {
          "en": "this fan",
          "ko": "이 선풍기"
        },
        "gloss": {
          "en": "I bought this fan.",
          "ko": "이 선풍기를 샀어요."
        }
      },
      {
        "text": "मैंने ट्रेन का टिकट ख़रीदा।",
        "slot": "ट्रेन का टिकट",
        "cue": {
          "en": "a train ticket",
          "ko": "기차표"
        },
        "gloss": {
          "en": "I bought a train ticket.",
          "ko": "기차표를 샀어요."
        }
      },
      {
        "text": "मैंने एक बैग ख़रीदा।",
        "slot": "एक बैग",
        "cue": {
          "en": "a bag",
          "ko": "가방 하나"
        },
        "gloss": {
          "en": "I bought a bag.",
          "ko": "가방을 하나 샀어요."
        }
      }
    ]
  },
  {
    "id": "hi-f3-09",
    "stage": 3,
    "fn": "while-when",
    "pattern": "जब फ़ोन आया, मैं ___ रहा था।",
    "core": [
      "रहा था"
    ],
    "meaning": {
      "en": "Saying what you were doing when something happened: When the phone rang, I was ___.",
      "ko": "~할 때 하던 일: 전화 왔을 때 ___ 중이었어요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "जब फ़ोन आया, मैं सो रहा था।",
        "slot": "सो",
        "cue": {
          "en": "sleeping",
          "ko": "자는"
        },
        "gloss": {
          "en": "When the phone rang, I was sleeping.",
          "ko": "전화 왔을 때 자고 있었어요."
        }
      },
      {
        "text": "जब फ़ोन आया, मैं खाना बना रहा था।",
        "slot": "खाना बना",
        "cue": {
          "en": "cooking",
          "ko": "요리하는"
        },
        "gloss": {
          "en": "When the phone rang, I was cooking.",
          "ko": "전화 왔을 때 요리하고 있었어요."
        }
      },
      {
        "text": "जब फ़ोन आया, मैं नहा रहा था।",
        "slot": "नहा",
        "cue": {
          "en": "having a bath",
          "ko": "씻는"
        },
        "gloss": {
          "en": "When the phone rang, I was having a bath.",
          "ko": "전화 왔을 때 씻고 있었어요."
        }
      },
      {
        "text": "जब फ़ोन आया, मैं गाड़ी चला रहा था।",
        "slot": "गाड़ी चला",
        "cue": {
          "en": "driving",
          "ko": "운전하는"
        },
        "gloss": {
          "en": "When the phone rang, I was driving.",
          "ko": "전화 왔을 때 운전하고 있었어요."
        }
      }
    ]
  },
  {
    "id": "hi-f3-10",
    "stage": 3,
    "fn": "condition",
    "pattern": "अगर ___, तो मुझे बताइए।",
    "core": [
      "अगर"
    ],
    "meaning": {
      "en": "Saying what to do if something happens: If ___, let me know.",
      "ko": "조건 말하기: ~하면 알려 주세요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "अगर कोई दिक़्क़त हो, तो मुझे बताइए।",
        "slot": "कोई दिक़्क़त हो",
        "cue": {
          "en": "there's any problem",
          "ko": "문제가 있다"
        },
        "gloss": {
          "en": "If there's any problem, let me know.",
          "ko": "문제가 있으면 알려 주세요."
        }
      },
      {
        "text": "अगर ट्रेन लेट हो, तो मुझे बताइए।",
        "slot": "ट्रेन लेट हो",
        "cue": {
          "en": "the train is late",
          "ko": "기차가 늦는다"
        },
        "gloss": {
          "en": "If the train is late, let me know.",
          "ko": "기차가 늦으면 알려 주세요."
        }
      },
      {
        "text": "अगर आपको समय मिले, तो मुझे बताइए।",
        "slot": "आपको समय मिले",
        "cue": {
          "en": "you get time",
          "ko": "시간이 난다"
        },
        "gloss": {
          "en": "If you get time, let me know.",
          "ko": "시간 나시면 알려 주세요."
        }
      },
      {
        "text": "अगर सीट ख़ाली हो, तो मुझे बताइए।",
        "slot": "सीट ख़ाली हो",
        "cue": {
          "en": "a seat is free",
          "ko": "자리가 빈다"
        },
        "gloss": {
          "en": "If a seat is free, let me know.",
          "ko": "자리가 나면 알려 주세요."
        }
      }
    ]
  },
  {
    "id": "hi-f3-11",
    "stage": 3,
    "fn": "condition",
    "pattern": "अगर बारिश हुई, तो हम ___।",
    "core": [
      "अगर बारिश हुई"
    ],
    "meaning": {
      "en": "Saying a plan B: If it rains, we'll ___.",
      "ko": "조건 말하기: 비가 오면 우리는 ~할 거예요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "अगर बारिश हुई, तो हम घर पर रहेंगे।",
        "slot": "घर पर रहेंगे",
        "cue": {
          "en": "stay home",
          "ko": "집에 있다"
        },
        "gloss": {
          "en": "If it rains, we'll stay home.",
          "ko": "비가 오면 집에 있을 거예요."
        }
      },
      {
        "text": "अगर बारिश हुई, तो हम फ़िल्म देखेंगे।",
        "slot": "फ़िल्म देखेंगे",
        "cue": {
          "en": "watch a film",
          "ko": "영화를 본다"
        },
        "gloss": {
          "en": "If it rains, we'll watch a film.",
          "ko": "비가 오면 영화 볼 거예요."
        }
      },
      {
        "text": "अगर बारिश हुई, तो हम कल चलेंगे।",
        "slot": "कल चलेंगे",
        "cue": {
          "en": "go tomorrow",
          "ko": "내일 간다"
        },
        "gloss": {
          "en": "If it rains, we'll go tomorrow.",
          "ko": "비가 오면 내일 갈 거예요."
        }
      },
      {
        "text": "अगर बारिश हुई, तो हम टैक्सी लेंगे।",
        "slot": "टैक्सी लेंगे",
        "cue": {
          "en": "take a taxi",
          "ko": "택시를 탄다"
        },
        "gloss": {
          "en": "If it rains, we'll take a taxi.",
          "ko": "비가 오면 택시 탈 거예요."
        }
      }
    ]
  },
  {
    "id": "hi-f3-12",
    "stage": 3,
    "fn": "try-doing",
    "pattern": "मैं ___ लूँगा।",
    "core": [
      "लूँगा"
    ],
    "meaning": {
      "en": "Saying you'll take care of it: I'll ___ (myself).",
      "ko": "해 보겠다고 하기: 제가 ~할게요."
    },
    "grammar": [
      6
    ],
    "expressions": [
      "मैं देख लूँगा"
    ],
    "examples": [
      {
        "text": "मैं देख लूँगा।",
        "slot": "देख",
        "cue": {
          "en": "look into it",
          "ko": "알아보다"
        },
        "gloss": {
          "en": "I'll look into it.",
          "ko": "제가 알아볼게요."
        }
      },
      {
        "text": "मैं बात कर लूँगा।",
        "slot": "बात कर",
        "cue": {
          "en": "talk to them",
          "ko": "이야기해 보다"
        },
        "gloss": {
          "en": "I'll talk to them.",
          "ko": "제가 얘기해 볼게요."
        }
      },
      {
        "text": "मैं ठीक करवा लूँगा।",
        "slot": "ठीक करवा",
        "cue": {
          "en": "get it fixed",
          "ko": "고쳐 놓다"
        },
        "gloss": {
          "en": "I'll get it fixed.",
          "ko": "제가 고쳐 놓을게요."
        }
      },
      {
        "text": "मैं सँभाल लूँगा।",
        "slot": "सँभाल",
        "cue": {
          "en": "handle it",
          "ko": "처리하다"
        },
        "gloss": {
          "en": "I'll handle it.",
          "ko": "제가 처리할게요."
        }
      }
    ]
  },
  {
    "id": "hi-f3-13",
    "stage": 3,
    "fn": "changed",
    "pattern": "___ ख़राब हो गया।",
    "core": [
      "ख़राब हो गया"
    ],
    "meaning": {
      "en": "Reporting something broken: ___ broke down.",
      "ko": "고장 알리기: ___이 고장 났어요."
    },
    "grammar": [
      6
    ],
    "expressions": [
      "ख़राब हो गया"
    ],
    "examples": [
      {
        "text": "पंखा ख़राब हो गया।",
        "slot": "पंखा",
        "cue": {
          "en": "the fan",
          "ko": "선풍기"
        },
        "gloss": {
          "en": "The fan broke down.",
          "ko": "선풍기가 고장 났어요."
        }
      },
      {
        "text": "मेरा फ़ोन ख़राब हो गया।",
        "slot": "मेरा फ़ोन",
        "cue": {
          "en": "my phone",
          "ko": "제 휴대폰"
        },
        "gloss": {
          "en": "My phone broke down.",
          "ko": "제 휴대폰이 고장 났어요."
        }
      },
      {
        "text": "एसी ख़राब हो गया।",
        "slot": "एसी",
        "cue": {
          "en": "the AC",
          "ko": "에어컨"
        },
        "gloss": {
          "en": "The AC broke down.",
          "ko": "에어컨이 고장 났어요."
        }
      },
      {
        "text": "लैपटॉप ख़राब हो गया।",
        "slot": "लैपटॉप",
        "cue": {
          "en": "the laptop",
          "ko": "노트북"
        },
        "gloss": {
          "en": "The laptop broke down.",
          "ko": "노트북이 고장 났어요."
        }
      }
    ]
  },
  {
    "id": "hi-f3-14",
    "stage": 3,
    "fn": "apologize-late",
    "pattern": "माफ़ कीजिए, ___ देर हो गई।",
    "core": [
      "देर हो गई"
    ],
    "meaning": {
      "en": "Apologizing for being late: Sorry, ___ I'm late.",
      "ko": "늦어서 사과하기: 죄송해요, ~ 늦었어요."
    },
    "grammar": [
      6
    ],
    "expressions": [
      "देर हो गई"
    ],
    "examples": [
      {
        "text": "माफ़ कीजिए, ट्रैफ़िक की वजह से देर हो गई।",
        "slot": "ट्रैफ़िक की वजह से",
        "cue": {
          "en": "because of traffic",
          "ko": "차가 막혀서"
        },
        "gloss": {
          "en": "Sorry, I'm late because of traffic.",
          "ko": "죄송해요, 차가 막혀서 늦었어요."
        }
      },
      {
        "text": "माफ़ कीजिए, थोड़ी देर हो गई।",
        "slot": "थोड़ी",
        "cue": {
          "en": "a little",
          "ko": "조금"
        },
        "gloss": {
          "en": "Sorry, I'm a little late.",
          "ko": "죄송해요, 조금 늦었어요."
        }
      },
      {
        "text": "माफ़ कीजिए, आज फिर देर हो गई।",
        "slot": "आज फिर",
        "cue": {
          "en": "again today",
          "ko": "오늘 또"
        },
        "gloss": {
          "en": "Sorry, I'm late again today.",
          "ko": "죄송해요, 오늘 또 늦었어요."
        }
      },
      {
        "text": "माफ़ कीजिए, बारिश की वजह से देर हो गई।",
        "slot": "बारिश की वजह से",
        "cue": {
          "en": "because of the rain",
          "ko": "비 때문에"
        },
        "gloss": {
          "en": "Sorry, I'm late because of the rain.",
          "ko": "죄송해요, 비 때문에 늦었어요."
        }
      }
    ]
  },
  {
    "id": "hi-f3-15",
    "stage": 3,
    "fn": "agree",
    "pattern": "आप सही कह रहे हैं, ___।",
    "core": [
      "आप सही कह रहे हैं"
    ],
    "meaning": {
      "en": "Agreeing and adding: You're right, ___.",
      "ko": "동의하기: 맞는 말씀이에요, ~."
    },
    "grammar": [],
    "expressions": [
      "आप सही कह रहे हैं"
    ],
    "examples": [
      {
        "text": "आप सही कह रहे हैं, यह बहुत महँगा है।",
        "slot": "यह बहुत महँगा है",
        "cue": {
          "en": "it's too expensive",
          "ko": "너무 비싸다"
        },
        "gloss": {
          "en": "You're right, it's too expensive.",
          "ko": "맞는 말씀이에요, 너무 비싸요."
        }
      },
      {
        "text": "आप सही कह रहे हैं, हमें जल्दी चलना चाहिए।",
        "slot": "हमें जल्दी चलना चाहिए",
        "cue": {
          "en": "we should go soon",
          "ko": "빨리 가야 한다"
        },
        "gloss": {
          "en": "You're right, we should go soon.",
          "ko": "맞아요, 빨리 가야 해요."
        }
      },
      {
        "text": "आप सही कह रहे हैं, गाने बहुत अच्छे थे।",
        "slot": "गाने बहुत अच्छे थे",
        "cue": {
          "en": "the songs were great",
          "ko": "노래가 좋았다"
        },
        "gloss": {
          "en": "You're right, the songs were great.",
          "ko": "맞아요, 노래가 정말 좋았어요."
        }
      },
      {
        "text": "आप सही कह रहे हैं, यह आसान नहीं है।",
        "slot": "यह आसान नहीं है",
        "cue": {
          "en": "it's not easy",
          "ko": "쉽지 않다"
        },
        "gloss": {
          "en": "You're right, it's not easy.",
          "ko": "맞는 말씀이에요, 쉽지 않아요."
        }
      }
    ]
  },
  {
    "id": "hi-f3-16",
    "stage": 3,
    "fn": "disagree-soft",
    "pattern": "मैं सहमत नहीं हूँ, ___।",
    "core": [
      "मैं सहमत नहीं हूँ"
    ],
    "meaning": {
      "en": "Disagreeing with a reason: I don't agree, ___.",
      "ko": "부드럽게 반대하기: 저는 동의하지 않아요, ~."
    },
    "grammar": [],
    "expressions": [
      "मैं सहमत नहीं हूँ"
    ],
    "examples": [
      {
        "text": "मैं सहमत नहीं हूँ, मुझे तो फ़िल्म अच्छी लगी।",
        "slot": "मुझे तो फ़िल्म अच्छी लगी",
        "cue": {
          "en": "I liked the film",
          "ko": "나는 영화가 좋았다"
        },
        "gloss": {
          "en": "I don't agree, I liked the film.",
          "ko": "저는 동의 안 해요, 영화 좋았는데요."
        }
      },
      {
        "text": "मैं सहमत नहीं हूँ, यह इतना आसान नहीं है।",
        "slot": "यह इतना आसान नहीं है",
        "cue": {
          "en": "it isn't that easy",
          "ko": "그렇게 쉽지 않다"
        },
        "gloss": {
          "en": "I don't agree, it isn't that easy.",
          "ko": "저는 동의하지 않아요, 그렇게 쉽지 않아요."
        }
      },
      {
        "text": "मैं सहमत नहीं हूँ, उसकी कोई ग़लती नहीं थी।",
        "slot": "उसकी कोई ग़लती नहीं थी",
        "cue": {
          "en": "it wasn't his fault",
          "ko": "그의 잘못이 아니었다"
        },
        "gloss": {
          "en": "I don't agree, it wasn't his fault.",
          "ko": "저는 동의하지 않아요, 그 사람 잘못이 아니었어요."
        }
      },
      {
        "text": "मैं सहमत नहीं हूँ, हमें और समय चाहिए।",
        "slot": "हमें और समय चाहिए",
        "cue": {
          "en": "we need more time",
          "ko": "시간이 더 필요하다"
        },
        "gloss": {
          "en": "I don't agree, we need more time.",
          "ko": "저는 동의하지 않아요, 시간이 더 필요해요."
        }
      }
    ]
  },
  {
    "id": "hi-f3-17",
    "stage": 3,
    "fn": "wish",
    "pattern": "उम्मीद है कि ___।",
    "core": [
      "उम्मीद है कि"
    ],
    "meaning": {
      "en": "Saying what you hope: I hope that ___.",
      "ko": "바람 말하기: ~하면 좋겠어요."
    },
    "grammar": [
      5
    ],
    "expressions": [
      "उम्मीद है"
    ],
    "examples": [
      {
        "text": "उम्मीद है कि पैसे वापस मिलेंगे।",
        "slot": "पैसे वापस मिलेंगे",
        "cue": {
          "en": "I'll get the money back",
          "ko": "돈을 돌려받는다"
        },
        "gloss": {
          "en": "I hope I'll get the money back.",
          "ko": "돈을 돌려받으면 좋겠어요."
        }
      },
      {
        "text": "उम्मीद है कि ट्रेन समय पर आएगी।",
        "slot": "ट्रेन समय पर आएगी",
        "cue": {
          "en": "the train will come on time",
          "ko": "기차가 제시간에 온다"
        },
        "gloss": {
          "en": "I hope the train comes on time.",
          "ko": "기차가 제시간에 오면 좋겠어요."
        }
      },
      {
        "text": "उम्मीद है कि कल तक ठीक हो जाएगा।",
        "slot": "कल तक ठीक हो जाएगा",
        "cue": {
          "en": "it'll be fixed by tomorrow",
          "ko": "내일까지 고쳐진다"
        },
        "gloss": {
          "en": "I hope it'll be fixed by tomorrow.",
          "ko": "내일까지 고쳐지면 좋겠어요."
        }
      },
      {
        "text": "उम्मीद है कि आपको पसंद आएगा।",
        "slot": "आपको पसंद आएगा",
        "cue": {
          "en": "you'll like it",
          "ko": "마음에 든다"
        },
        "gloss": {
          "en": "I hope you'll like it.",
          "ko": "마음에 드시면 좋겠어요."
        }
      }
    ]
  },
  {
    "id": "hi-f3-18",
    "stage": 3,
    "fn": "guess",
    "pattern": "हो सकता है कि ___।",
    "core": [
      "हो सकता है"
    ],
    "meaning": {
      "en": "Guessing: Maybe ___.",
      "ko": "짐작하기: ~일지도 몰라요."
    },
    "grammar": [
      5
    ],
    "expressions": [
      "हो सकता है"
    ],
    "examples": [
      {
        "text": "हो सकता है कि वह लेट आए।",
        "slot": "वह लेट आए",
        "cue": {
          "en": "he comes late",
          "ko": "그가 늦게 온다"
        },
        "gloss": {
          "en": "Maybe he'll come late.",
          "ko": "그 사람 늦게 올지도 몰라요."
        }
      },
      {
        "text": "हो सकता है कि ट्रेन कैंसल हो जाए।",
        "slot": "ट्रेन कैंसल हो जाए",
        "cue": {
          "en": "the train gets cancelled",
          "ko": "기차가 취소된다"
        },
        "gloss": {
          "en": "Maybe the train will be cancelled.",
          "ko": "기차가 취소될지도 몰라요."
        }
      },
      {
        "text": "हो सकता है कि दुकान बंद हो।",
        "slot": "दुकान बंद हो",
        "cue": {
          "en": "the shop is closed",
          "ko": "가게가 닫혀 있다"
        },
        "gloss": {
          "en": "Maybe the shop is closed.",
          "ko": "가게가 닫혀 있을지도 몰라요."
        }
      },
      {
        "text": "हो सकता है कि उसने मेरा मैसेज नहीं देखा।",
        "slot": "उसने मेरा मैसेज नहीं देखा",
        "cue": {
          "en": "he didn't see my message",
          "ko": "그가 내 메시지를 못 봤다"
        },
        "gloss": {
          "en": "Maybe he didn't see my message.",
          "ko": "그 사람이 제 메시지를 못 봤을지도 몰라요."
        }
      }
    ]
  }
];
