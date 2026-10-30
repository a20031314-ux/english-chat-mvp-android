import type { Frame } from "../frames.ts";

/** 힌디어 1~5단계 틀(curriculum/frames.ts) — 기능 id(fn)는 curriculum/functions.ts. Claude가 쓰고 규칙 검사, 원어민 확인 전. */
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
  },
  {
    "id": "hi-f4-01",
    "stage": 4,
    "fn": "persuade",
    "pattern": "मेरा सुझाव है कि ___।",
    "core": [
      "मेरा सुझाव है कि"
    ],
    "meaning": {
      "en": "Making a suggestion: My suggestion is that ___.",
      "ko": "제안하기: 제 제안은 ~하자는 거예요."
    },
    "grammar": [
      1
    ],
    "expressions": [
      "मेरा सुझाव है"
    ],
    "examples": [
      {
        "text": "मेरा सुझाव है कि हम यह काम अगले हफ़्ते तक पूरा करें।",
        "slot": "हम यह काम अगले हफ़्ते तक पूरा करें",
        "cue": {
          "en": "we finish this work by next week",
          "ko": "이 일을 다음 주까지 끝내다"
        },
        "gloss": {
          "en": "My suggestion is that we finish this work by next week.",
          "ko": "이 일을 다음 주까지 끝내자는 게 제 제안이에요."
        }
      },
      {
        "text": "मेरा सुझाव है कि आप पहले मैनेजर से बात करें।",
        "slot": "आप पहले मैनेजर से बात करें",
        "cue": {
          "en": "you talk to the manager first",
          "ko": "먼저 매니저와 이야기하다"
        },
        "gloss": {
          "en": "I suggest you talk to the manager first.",
          "ko": "먼저 매니저와 이야기해 보시길 제안해요."
        }
      },
      {
        "text": "मेरा सुझाव है कि बैठक सुबह रखी जाए।",
        "slot": "बैठक सुबह रखी जाए",
        "cue": {
          "en": "the meeting be held in the morning",
          "ko": "회의를 아침에 잡다"
        },
        "gloss": {
          "en": "I suggest the meeting be held in the morning.",
          "ko": "회의를 아침에 잡자는 게 제 제안이에요."
        }
      },
      {
        "text": "मेरा सुझाव है कि हम दोनों विकल्पों को एक बार फिर देखें।",
        "slot": "हम दोनों विकल्पों को एक बार फिर देखें",
        "cue": {
          "en": "we look at both options once more",
          "ko": "두 선택지를 한 번 더 보다"
        },
        "gloss": {
          "en": "I suggest we look at both options once more.",
          "ko": "두 선택지를 한 번 더 살펴보자고 제안해요."
        }
      }
    ]
  },
  {
    "id": "hi-f4-02",
    "stage": 4,
    "fn": "hypothetical",
    "pattern": "अगर मैं आपकी जगह होता, तो ___।",
    "core": [
      "अगर मैं आपकी जगह होता"
    ],
    "meaning": {
      "en": "Advice through a hypothetical: If I were in your place, I would ___.",
      "ko": "가정해서 조언하기: 제가 당신이라면 ~할 텐데요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "अगर मैं आपकी जगह होता, तो यह नौकरी ले लेता।",
        "slot": "यह नौकरी ले लेता",
        "cue": {
          "en": "take this job",
          "ko": "이 일자리를 받아들이다"
        },
        "gloss": {
          "en": "If I were you, I'd take this job.",
          "ko": "제가 당신이라면 이 일자리를 받아들일 거예요."
        }
      },
      {
        "text": "अगर मैं आपकी जगह होता, तो पहले डॉक्टर से पूछता।",
        "slot": "पहले डॉक्टर से पूछता",
        "cue": {
          "en": "ask the doctor first",
          "ko": "먼저 의사에게 묻다"
        },
        "gloss": {
          "en": "If I were you, I'd ask the doctor first.",
          "ko": "제가 당신이라면 먼저 의사에게 물어볼 거예요."
        }
      },
      {
        "text": "अगर मैं आपकी जगह होता, तो थोड़ा और इंतज़ार करता।",
        "slot": "थोड़ा और इंतज़ार करता",
        "cue": {
          "en": "wait a little longer",
          "ko": "조금 더 기다리다"
        },
        "gloss": {
          "en": "If I were you, I'd wait a little longer.",
          "ko": "제가 당신이라면 조금 더 기다릴 거예요."
        }
      },
      {
        "text": "अगर मैं आपकी जगह होता, तो यह घर नहीं ख़रीदता।",
        "slot": "यह घर नहीं ख़रीदता",
        "cue": {
          "en": "not buy this house",
          "ko": "이 집을 사지 않다"
        },
        "gloss": {
          "en": "If I were you, I wouldn't buy this house.",
          "ko": "제가 당신이라면 이 집은 안 살 거예요."
        }
      }
    ]
  },
  {
    "id": "hi-f4-03",
    "stage": 4,
    "fn": "regret-light",
    "pattern": "अगर आपने पहले बताया होता, तो मैं ___।",
    "core": [
      "अगर आपने पहले बताया होता"
    ],
    "meaning": {
      "en": "Counterfactual about the past: If you had told me earlier, I would have ___.",
      "ko": "지난 일 가정하기: 미리 말씀하셨으면 ~했을 텐데요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "अगर आपने पहले बताया होता, तो मैं बजट बना लेता।",
        "slot": "बजट बना लेता",
        "cue": {
          "en": "make a budget",
          "ko": "예산을 세우다"
        },
        "gloss": {
          "en": "If you had told me earlier, I'd have made a budget.",
          "ko": "미리 말씀하셨으면 예산을 세웠을 텐데요."
        }
      },
      {
        "text": "अगर आपने पहले बताया होता, तो मैं टिकट बदल लेता।",
        "slot": "टिकट बदल लेता",
        "cue": {
          "en": "change the ticket",
          "ko": "표를 바꾸다"
        },
        "gloss": {
          "en": "If you had told me earlier, I'd have changed the ticket.",
          "ko": "미리 말씀하셨으면 표를 바꿨을 텐데요."
        }
      },
      {
        "text": "अगर आपने पहले बताया होता, तो मैं स्टेशन पर आ जाता।",
        "slot": "स्टेशन पर आ जाता",
        "cue": {
          "en": "come to the station",
          "ko": "역으로 오다"
        },
        "gloss": {
          "en": "If you had told me earlier, I'd have come to the station.",
          "ko": "미리 말씀하셨으면 역으로 나갔을 텐데요."
        }
      },
      {
        "text": "अगर आपने पहले बताया होता, तो मैं मीटिंग टाल देता।",
        "slot": "मीटिंग टाल देता",
        "cue": {
          "en": "put off the meeting",
          "ko": "회의를 미루다"
        },
        "gloss": {
          "en": "If you had told me earlier, I'd have put off the meeting.",
          "ko": "미리 말씀하셨으면 회의를 미뤘을 텐데요."
        }
      }
    ]
  },
  {
    "id": "hi-f4-04",
    "stage": 4,
    "fn": "regret-light",
    "pattern": "काश मैंने ___ होता!",
    "core": [
      "काश मैंने"
    ],
    "meaning": {
      "en": "Regret: If only I had ___!",
      "ko": "후회 말하기: ~했더라면 좋았을 텐데!"
    },
    "grammar": [
      0
    ],
    "expressions": [
      "काश"
    ],
    "examples": [
      {
        "text": "काश मैंने पहले पूछा होता!",
        "slot": "पहले पूछा",
        "cue": {
          "en": "asked earlier",
          "ko": "미리 묻다"
        },
        "gloss": {
          "en": "If only I had asked earlier!",
          "ko": "미리 물어봤더라면 좋았을 텐데!"
        }
      },
      {
        "text": "काश मैंने यह घर पहले देखा होता!",
        "slot": "यह घर पहले देखा",
        "cue": {
          "en": "seen this house earlier",
          "ko": "이 집을 더 일찍 보다"
        },
        "gloss": {
          "en": "If only I had seen this house earlier!",
          "ko": "이 집을 더 일찍 봤더라면 좋았을 텐데!"
        }
      },
      {
        "text": "काश मैंने उसका जन्मदिन याद रखा होता!",
        "slot": "उसका जन्मदिन याद रखा",
        "cue": {
          "en": "remembered her birthday",
          "ko": "그녀의 생일을 기억하다"
        },
        "gloss": {
          "en": "If only I had remembered her birthday!",
          "ko": "그 사람 생일을 기억했더라면 좋았을 텐데!"
        }
      },
      {
        "text": "काश मैंने वह मौक़ा नहीं छोड़ा होता!",
        "slot": "वह मौक़ा नहीं छोड़ा",
        "cue": {
          "en": "not let that chance go",
          "ko": "그 기회를 놓치지 않다"
        },
        "gloss": {
          "en": "If only I hadn't let that chance go!",
          "ko": "그 기회를 놓치지 않았더라면 좋았을 텐데!"
        }
      }
    ]
  },
  {
    "id": "hi-f4-05",
    "stage": 4,
    "fn": "deadline",
    "pattern": "यह ___ तक भेज दिया जाएगा।",
    "core": [
      "भेज दिया जाएगा"
    ],
    "meaning": {
      "en": "Promising a deadline (passive): It will be sent by ___.",
      "ko": "마감 약속하기(수동): ~까지 보내질 거예요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "यह आज शाम तक भेज दिया जाएगा।",
        "slot": "आज शाम",
        "cue": {
          "en": "this evening",
          "ko": "오늘 저녁"
        },
        "gloss": {
          "en": "It will be sent by this evening.",
          "ko": "오늘 저녁까지 보내 드릴 거예요."
        }
      },
      {
        "text": "यह सोमवार सुबह तक भेज दिया जाएगा।",
        "slot": "सोमवार सुबह",
        "cue": {
          "en": "Monday morning",
          "ko": "월요일 아침"
        },
        "gloss": {
          "en": "It will be sent by Monday morning.",
          "ko": "월요일 아침까지 보내질 거예요."
        }
      },
      {
        "text": "यह अगले हफ़्ते तक भेज दिया जाएगा।",
        "slot": "अगले हफ़्ते",
        "cue": {
          "en": "next week",
          "ko": "다음 주"
        },
        "gloss": {
          "en": "It will be sent by next week.",
          "ko": "다음 주까지 보내질 거예요."
        }
      },
      {
        "text": "यह महीने के आख़िर तक भेज दिया जाएगा।",
        "slot": "महीने के आख़िर",
        "cue": {
          "en": "the end of the month",
          "ko": "월말"
        },
        "gloss": {
          "en": "It will be sent by the end of the month.",
          "ko": "월말까지 보내질 거예요."
        }
      }
    ]
  },
  {
    "id": "hi-f4-06",
    "stage": 4,
    "fn": "complain",
    "pattern": "___ कब ठीक कराया जाएगा?",
    "core": [
      "कब ठीक कराया जाएगा"
    ],
    "meaning": {
      "en": "Asking when a repair will be done (passive): When will ___ be fixed?",
      "ko": "수리 일정 묻기(수동): ~는 언제 고쳐지나요?"
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "बालकनी का नल कब ठीक कराया जाएगा?",
        "slot": "बालकनी का नल",
        "cue": {
          "en": "the balcony tap",
          "ko": "발코니 수도꼭지"
        },
        "gloss": {
          "en": "When will the balcony tap be fixed?",
          "ko": "발코니 수도꼭지는 언제 고쳐 주시나요?"
        }
      },
      {
        "text": "रसोई का पंखा कब ठीक कराया जाएगा?",
        "slot": "रसोई का पंखा",
        "cue": {
          "en": "the kitchen fan",
          "ko": "부엌 환풍기"
        },
        "gloss": {
          "en": "When will the kitchen fan be fixed?",
          "ko": "부엌 환풍기는 언제 고쳐지나요?"
        }
      },
      {
        "text": "दफ़्तर का एसी कब ठीक कराया जाएगा?",
        "slot": "दफ़्तर का एसी",
        "cue": {
          "en": "the office air conditioner",
          "ko": "사무실 에어컨"
        },
        "gloss": {
          "en": "When will the office AC be fixed?",
          "ko": "사무실 에어컨은 언제 고쳐지나요?"
        }
      },
      {
        "text": "मुख्य दरवाज़ा कब ठीक कराया जाएगा?",
        "slot": "मुख्य दरवाज़ा",
        "cue": {
          "en": "the main door",
          "ko": "정문"
        },
        "gloss": {
          "en": "When will the main door be fixed?",
          "ko": "정문은 언제 고쳐지나요?"
        }
      }
    ]
  },
  {
    "id": "hi-f4-07",
    "stage": 4,
    "fn": "feedback-give",
    "pattern": "जो ___, वह बहुत काम की थी।",
    "core": [
      "वह बहुत काम की थी"
    ],
    "meaning": {
      "en": "Praising something specific (relative clause): The ___ that…, it was very useful.",
      "ko": "구체적으로 칭찬하기(관계절): ~한 그것은 아주 쓸모 있었어요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "जो रिपोर्ट आपने भेजी थी, वह बहुत काम की थी।",
        "slot": "रिपोर्ट आपने भेजी थी",
        "cue": {
          "en": "the report you sent",
          "ko": "보내 준 보고서"
        },
        "gloss": {
          "en": "The report you sent was very useful.",
          "ko": "보내 주신 보고서가 아주 도움이 됐어요."
        }
      },
      {
        "text": "जो सलाह आपने दी थी, वह बहुत काम की थी।",
        "slot": "सलाह आपने दी थी",
        "cue": {
          "en": "the advice you gave",
          "ko": "해 준 조언"
        },
        "gloss": {
          "en": "The advice you gave was very useful.",
          "ko": "해 주신 조언이 아주 도움이 됐어요."
        }
      },
      {
        "text": "जो किताब आपने सुझाई थी, वह बहुत काम की थी।",
        "slot": "किताब आपने सुझाई थी",
        "cue": {
          "en": "the book you suggested",
          "ko": "추천해 준 책"
        },
        "gloss": {
          "en": "The book you suggested was very useful.",
          "ko": "추천해 주신 책이 아주 유용했어요."
        }
      },
      {
        "text": "जो जानकारी हमें क्लाइंट से मिली, वह बहुत काम की थी।",
        "slot": "जानकारी हमें क्लाइंट से मिली",
        "cue": {
          "en": "the information we got from the client",
          "ko": "고객에게서 받은 정보"
        },
        "gloss": {
          "en": "The information we got from the client was very useful.",
          "ko": "고객에게서 받은 정보가 아주 쓸모 있었어요."
        }
      }
    ]
  },
  {
    "id": "hi-f4-08",
    "stage": 4,
    "fn": "explain-process",
    "pattern": "पहले ___ ठीक करके ही हम आगे बढ़ेंगे।",
    "core": [
      "ठीक करके ही"
    ],
    "meaning": {
      "en": "Setting a condition for the next step: Only after fixing ___ will we move on.",
      "ko": "순서 정하기: ~를 고친 다음에야 넘어갈 거예요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "पहले सारे बग ठीक करके ही हम आगे बढ़ेंगे।",
        "slot": "सारे बग",
        "cue": {
          "en": "all the bugs",
          "ko": "모든 버그"
        },
        "gloss": {
          "en": "We'll move on only after fixing all the bugs.",
          "ko": "버그를 다 고친 다음에야 넘어갈 거예요."
        }
      },
      {
        "text": "पहले ये ग़लतियाँ ठीक करके ही हम आगे बढ़ेंगे।",
        "slot": "ये ग़लतियाँ",
        "cue": {
          "en": "these mistakes",
          "ko": "이 실수들"
        },
        "gloss": {
          "en": "We'll move on only after fixing these mistakes.",
          "ko": "이 실수들을 고친 다음에야 넘어갈 거예요."
        }
      },
      {
        "text": "पहले डिज़ाइन ठीक करके ही हम आगे बढ़ेंगे।",
        "slot": "डिज़ाइन",
        "cue": {
          "en": "the design",
          "ko": "디자인"
        },
        "gloss": {
          "en": "We'll move on only after fixing the design.",
          "ko": "디자인을 고친 다음에야 넘어갈 거예요."
        }
      },
      {
        "text": "पहले बजट का हिसाब ठीक करके ही हम आगे बढ़ेंगे।",
        "slot": "बजट का हिसाब",
        "cue": {
          "en": "the budget figures",
          "ko": "예산 계산"
        },
        "gloss": {
          "en": "We'll move on only after sorting out the budget figures.",
          "ko": "예산 계산을 바로잡은 다음에야 넘어갈 거예요."
        }
      }
    ]
  },
  {
    "id": "hi-f4-09",
    "stage": 4,
    "fn": "guess",
    "pattern": "वह अभी ___ होगा।",
    "core": [
      "होगा"
    ],
    "meaning": {
      "en": "Guessing where someone is: He must be ___ now.",
      "ko": "짐작하기: 그는 지금 아마 ~에 있을 거예요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "वह अभी क्लाइंट कॉल पर होगा।",
        "slot": "क्लाइंट कॉल पर",
        "cue": {
          "en": "on a client call",
          "ko": "고객 통화 중"
        },
        "gloss": {
          "en": "He must be on a client call now.",
          "ko": "그 사람은 지금 고객과 통화 중일 거예요."
        }
      },
      {
        "text": "वह अभी रास्ते में होगा।",
        "slot": "रास्ते में",
        "cue": {
          "en": "on the way",
          "ko": "오는 길"
        },
        "gloss": {
          "en": "He must be on the way now.",
          "ko": "그 사람은 지금 오는 길일 거예요."
        }
      },
      {
        "text": "वह अभी दफ़्तर में होगा।",
        "slot": "दफ़्तर में",
        "cue": {
          "en": "at the office",
          "ko": "사무실"
        },
        "gloss": {
          "en": "He must be at the office now.",
          "ko": "그 사람은 지금 사무실에 있을 거예요."
        }
      },
      {
        "text": "वह अभी किसी मीटिंग में होगा।",
        "slot": "किसी मीटिंग में",
        "cue": {
          "en": "in some meeting",
          "ko": "어떤 회의 중"
        },
        "gloss": {
          "en": "He must be in a meeting now.",
          "ko": "그 사람은 지금 회의 중일 거예요."
        }
      }
    ]
  },
  {
    "id": "hi-f4-10",
    "stage": 4,
    "fn": "concede",
    "pattern": "___, फिर भी यह विकल्प बेहतर है।",
    "core": [
      "फिर भी"
    ],
    "meaning": {
      "en": "Conceding but keeping your choice: ___, even so this option is better.",
      "ko": "인정하면서 고르기: ~지만 그래도 이 선택지가 나아요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ख़र्च ज़्यादा है, फिर भी यह विकल्प बेहतर है।",
        "slot": "ख़र्च ज़्यादा है",
        "cue": {
          "en": "the cost is high",
          "ko": "비용이 많이 들다"
        },
        "gloss": {
          "en": "The cost is high, but even so this option is better.",
          "ko": "비용이 많이 들지만 그래도 이 선택지가 나아요."
        }
      },
      {
        "text": "इसमें थोड़ा ज़्यादा समय लगेगा, फिर भी यह विकल्प बेहतर है।",
        "slot": "इसमें थोड़ा ज़्यादा समय लगेगा",
        "cue": {
          "en": "it will take a bit more time",
          "ko": "시간이 좀 더 걸리다"
        },
        "gloss": {
          "en": "It'll take a bit more time, but even so this option is better.",
          "ko": "시간이 좀 더 걸리겠지만 그래도 이 선택지가 나아요."
        }
      },
      {
        "text": "रास्ता लंबा है, फिर भी यह विकल्प बेहतर है।",
        "slot": "रास्ता लंबा है",
        "cue": {
          "en": "the route is long",
          "ko": "길이 멀다"
        },
        "gloss": {
          "en": "The route is long, but even so this option is better.",
          "ko": "길은 멀지만 그래도 이 선택지가 나아요."
        }
      },
      {
        "text": "काम थोड़ा मुश्किल है, फिर भी यह विकल्प बेहतर है।",
        "slot": "काम थोड़ा मुश्किल है",
        "cue": {
          "en": "the work is a bit hard",
          "ko": "일이 좀 어렵다"
        },
        "gloss": {
          "en": "The work is a bit hard, but even so this option is better.",
          "ko": "일이 좀 어렵긴 해도 이 선택지가 나아요."
        }
      }
    ]
  },
  {
    "id": "hi-f4-11",
    "stage": 4,
    "fn": "compare",
    "pattern": "पहला विकल्प ___ है, जबकि दूसरा सस्ता है।",
    "core": [
      "जबकि"
    ],
    "meaning": {
      "en": "Contrasting two options: The first option is ___, whereas the second is cheaper.",
      "ko": "두 선택지 대조하기: 첫 번째는 ~한 반면 두 번째는 더 싸요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "पहला विकल्प तेज़ है, जबकि दूसरा सस्ता है।",
        "slot": "तेज़",
        "cue": {
          "en": "fast",
          "ko": "빠르다"
        },
        "gloss": {
          "en": "The first option is fast, whereas the second is cheap.",
          "ko": "첫 번째는 빠른 반면 두 번째는 싸요."
        }
      },
      {
        "text": "पहला विकल्प ज़्यादा सुरक्षित है, जबकि दूसरा सस्ता है।",
        "slot": "ज़्यादा सुरक्षित",
        "cue": {
          "en": "safer",
          "ko": "더 안전하다"
        },
        "gloss": {
          "en": "The first option is safer, whereas the second is cheap.",
          "ko": "첫 번째는 더 안전한 반면 두 번째는 싸요."
        }
      },
      {
        "text": "पहला विकल्प इस्तेमाल में आसान है, जबकि दूसरा सस्ता है।",
        "slot": "इस्तेमाल में आसान",
        "cue": {
          "en": "easy to use",
          "ko": "쓰기 쉽다"
        },
        "gloss": {
          "en": "The first option is easy to use, whereas the second is cheap.",
          "ko": "첫 번째는 쓰기 쉬운 반면 두 번째는 싸요."
        }
      },
      {
        "text": "पहला विकल्प बड़ी टीमों के लिए अच्छा है, जबकि दूसरा सस्ता है।",
        "slot": "बड़ी टीमों के लिए अच्छा",
        "cue": {
          "en": "good for big teams",
          "ko": "큰 팀에 좋다"
        },
        "gloss": {
          "en": "The first option is good for big teams, whereas the second is cheap.",
          "ko": "첫 번째는 큰 팀에 좋은 반면 두 번째는 싸요."
        }
      }
    ]
  },
  {
    "id": "hi-f4-12",
    "stage": 4,
    "fn": "pros-cons",
    "pattern": "एक तरफ़ ___, दूसरी तरफ़ इसमें ख़र्च ज़्यादा है।",
    "core": [
      "एक तरफ़",
      "दूसरी तरफ़"
    ],
    "meaning": {
      "en": "Weighing pros and cons: On one hand ___, on the other hand it costs more.",
      "ko": "장단점 따지기: 한편으로는 ~지만, 다른 한편으로는 비용이 더 들어요."
    },
    "grammar": [
      6
    ],
    "expressions": [
      "एक तरफ़",
      "दूसरी तरफ़"
    ],
    "examples": [
      {
        "text": "एक तरफ़ यह जगह शहर के पास है, दूसरी तरफ़ इसमें ख़र्च ज़्यादा है।",
        "slot": "यह जगह शहर के पास है",
        "cue": {
          "en": "this place is near the city",
          "ko": "이곳이 시내와 가깝다"
        },
        "gloss": {
          "en": "On one hand this place is near the city, on the other it costs more.",
          "ko": "한편으로 이곳은 시내와 가깝지만, 다른 한편으로 비용이 더 들어요."
        }
      },
      {
        "text": "एक तरफ़ हमें समय पर ऐप मिलेगा, दूसरी तरफ़ इसमें ख़र्च ज़्यादा है।",
        "slot": "हमें समय पर ऐप मिलेगा",
        "cue": {
          "en": "we'll get the app on time",
          "ko": "앱을 제때 받다"
        },
        "gloss": {
          "en": "On one hand we'll get the app on time, on the other it costs more.",
          "ko": "한편으로 앱을 제때 받겠지만, 다른 한편으로 비용이 더 들어요."
        }
      },
      {
        "text": "एक तरफ़ यह नौकरी अच्छी है, दूसरी तरफ़ इसमें ख़र्च ज़्यादा है।",
        "slot": "यह नौकरी अच्छी है",
        "cue": {
          "en": "this job is good",
          "ko": "이 일자리가 좋다"
        },
        "gloss": {
          "en": "On one hand this job is good, on the other it costs more.",
          "ko": "한편으로 이 일은 좋지만, 다른 한편으로 돈이 더 들어요."
        }
      },
      {
        "text": "एक तरफ़ टीम को आराम मिलेगा, दूसरी तरफ़ इसमें ख़र्च ज़्यादा है।",
        "slot": "टीम को आराम मिलेगा",
        "cue": {
          "en": "the team will get a rest",
          "ko": "팀이 쉴 수 있다"
        },
        "gloss": {
          "en": "On one hand the team will get a rest, on the other it costs more.",
          "ko": "한편으로 팀이 쉴 수 있지만, 다른 한편으로 비용이 더 들어요."
        }
      }
    ]
  },
  {
    "id": "hi-f4-13",
    "stage": 4,
    "fn": "concede",
    "pattern": "आपकी बात सही है, लेकिन ___।",
    "core": [
      "आपकी बात सही है, लेकिन"
    ],
    "meaning": {
      "en": "Conceding a point, then objecting: You have a point, but ___.",
      "ko": "일부 인정하고 반론하기: 말씀은 맞는데요, ~."
    },
    "grammar": [
      6
    ],
    "expressions": [
      "आपकी बात सही है, लेकिन"
    ],
    "examples": [
      {
        "text": "आपकी बात सही है, लेकिन तब डिज़ाइन तैयार नहीं था।",
        "slot": "तब डिज़ाइन तैयार नहीं था",
        "cue": {
          "en": "the design wasn't ready then",
          "ko": "그때 디자인이 준비되지 않았다"
        },
        "gloss": {
          "en": "You have a point, but the design wasn't ready then.",
          "ko": "말씀은 맞는데요, 그때는 디자인이 준비되지 않았어요."
        }
      },
      {
        "text": "आपकी बात सही है, लेकिन बजट भी देखना पड़ेगा।",
        "slot": "बजट भी देखना पड़ेगा",
        "cue": {
          "en": "we'll have to look at the budget too",
          "ko": "예산도 봐야 한다"
        },
        "gloss": {
          "en": "You have a point, but we'll have to look at the budget too.",
          "ko": "말씀은 맞는데요, 예산도 봐야 해요."
        }
      },
      {
        "text": "आपकी बात सही है, लेकिन ग्राहक इतना इंतज़ार नहीं करेंगे।",
        "slot": "ग्राहक इतना इंतज़ार नहीं करेंगे",
        "cue": {
          "en": "customers won't wait that long",
          "ko": "고객이 그렇게 오래 기다리지 않는다"
        },
        "gloss": {
          "en": "You have a point, but customers won't wait that long.",
          "ko": "말씀은 맞는데요, 고객들이 그렇게 오래 기다리지 않을 거예요."
        }
      },
      {
        "text": "आपकी बात सही है, लेकिन ऐसा पहली बार हुआ है।",
        "slot": "ऐसा पहली बार हुआ है",
        "cue": {
          "en": "this has happened for the first time",
          "ko": "이런 일은 처음이다"
        },
        "gloss": {
          "en": "You have a point, but this is the first time it's happened.",
          "ko": "말씀은 맞는데요, 이런 일은 처음이에요."
        }
      }
    ]
  },
  {
    "id": "hi-f4-14",
    "stage": 4,
    "fn": "clarify",
    "pattern": "इसका मतलब यह है कि ___।",
    "core": [
      "इसका मतलब यह है कि"
    ],
    "meaning": {
      "en": "Spelling out what it means: That means ___.",
      "ko": "뜻 정리하기: 그 말은 ~라는 뜻이네요."
    },
    "grammar": [],
    "expressions": [
      "इसका मतलब यह है"
    ],
    "examples": [
      {
        "text": "इसका मतलब यह है कि मुझे हर महीने ज़्यादा किराया देना होगा।",
        "slot": "मुझे हर महीने ज़्यादा किराया देना होगा",
        "cue": {
          "en": "I'll have to pay more rent every month",
          "ko": "매달 월세를 더 내야 한다"
        },
        "gloss": {
          "en": "That means I'll have to pay more rent every month.",
          "ko": "그 말은 제가 매달 월세를 더 내야 한다는 뜻이네요."
        }
      },
      {
        "text": "इसका मतलब यह है कि हमें शनिवार को भी काम करना पड़ेगा।",
        "slot": "हमें शनिवार को भी काम करना पड़ेगा",
        "cue": {
          "en": "we'll have to work on Saturday too",
          "ko": "토요일에도 일해야 한다"
        },
        "gloss": {
          "en": "That means we'll have to work on Saturday too.",
          "ko": "그 말은 토요일에도 일해야 한다는 뜻이네요."
        }
      },
      {
        "text": "इसका मतलब यह है कि लॉन्च अगले महीने होगा।",
        "slot": "लॉन्च अगले महीने होगा",
        "cue": {
          "en": "the launch will be next month",
          "ko": "출시는 다음 달이다"
        },
        "gloss": {
          "en": "That means the launch will be next month.",
          "ko": "그 말은 출시가 다음 달이라는 뜻이네요."
        }
      },
      {
        "text": "इसका मतलब यह है कि आप इस योजना से ख़ुश नहीं हैं।",
        "slot": "आप इस योजना से ख़ुश नहीं हैं",
        "cue": {
          "en": "you're not happy with this plan",
          "ko": "이 계획이 마음에 들지 않는다"
        },
        "gloss": {
          "en": "That means you're not happy with this plan.",
          "ko": "그 말은 이 계획이 마음에 안 드신다는 뜻이네요."
        }
      }
    ]
  },
  {
    "id": "hi-f4-15",
    "stage": 4,
    "fn": "clarify",
    "pattern": "आप कहना चाह रहे हैं कि ___?",
    "core": [
      "आप कहना चाह रहे हैं कि"
    ],
    "meaning": {
      "en": "Checking what someone means: Are you saying that ___?",
      "ko": "상대 말 확인하기: ~라는 말씀이신가요?"
    },
    "grammar": [],
    "expressions": [
      "आप कहना चाह रहे हैं"
    ],
    "examples": [
      {
        "text": "आप कहना चाह रहे हैं कि बजट कम है?",
        "slot": "बजट कम है",
        "cue": {
          "en": "the budget is small",
          "ko": "예산이 적다"
        },
        "gloss": {
          "en": "Are you saying the budget is small?",
          "ko": "예산이 적다는 말씀이신가요?"
        }
      },
      {
        "text": "आप कहना चाह रहे हैं कि हमें यह प्रोजेक्ट छोड़ देना चाहिए?",
        "slot": "हमें यह प्रोजेक्ट छोड़ देना चाहिए",
        "cue": {
          "en": "we should drop this project",
          "ko": "이 프로젝트를 그만둬야 한다"
        },
        "gloss": {
          "en": "Are you saying we should drop this project?",
          "ko": "이 프로젝트를 그만둬야 한다는 말씀이신가요?"
        }
      },
      {
        "text": "आप कहना चाह रहे हैं कि मीटिंग की ज़रूरत नहीं है?",
        "slot": "मीटिंग की ज़रूरत नहीं है",
        "cue": {
          "en": "there's no need for a meeting",
          "ko": "회의가 필요 없다"
        },
        "gloss": {
          "en": "Are you saying there's no need for a meeting?",
          "ko": "회의가 필요 없다는 말씀이신가요?"
        }
      },
      {
        "text": "आप कहना चाह रहे हैं कि ग़लती हमारी टीम की थी?",
        "slot": "ग़लती हमारी टीम की थी",
        "cue": {
          "en": "the mistake was our team's",
          "ko": "실수가 우리 팀 탓이었다"
        },
        "gloss": {
          "en": "Are you saying the mistake was our team's?",
          "ko": "실수가 우리 팀 탓이었다는 말씀이신가요?"
        }
      }
    ]
  },
  {
    "id": "hi-f4-16",
    "stage": 4,
    "fn": "opinion",
    "pattern": "जहाँ तक मैं समझता हूँ, ___।",
    "core": [
      "जहाँ तक मैं समझता हूँ"
    ],
    "meaning": {
      "en": "Hedging what you know: As far as I understand, ___.",
      "ko": "아는 범위에서 말하기: 제가 알기로는 ~."
    },
    "grammar": [],
    "expressions": [
      "जहाँ तक मैं समझता हूँ"
    ],
    "examples": [
      {
        "text": "जहाँ तक मैं समझता हूँ, इस पद की तनख़्वाह काफ़ी अच्छी है।",
        "slot": "इस पद की तनख़्वाह काफ़ी अच्छी है",
        "cue": {
          "en": "the salary for this post is quite good",
          "ko": "이 자리 연봉이 꽤 좋다"
        },
        "gloss": {
          "en": "As far as I understand, the salary for this post is quite good.",
          "ko": "제가 알기로는 이 자리 연봉이 꽤 괜찮아요."
        }
      },
      {
        "text": "जहाँ तक मैं समझता हूँ, क्लाइंट को यह डिज़ाइन पसंद आया।",
        "slot": "क्लाइंट को यह डिज़ाइन पसंद आया",
        "cue": {
          "en": "the client liked this design",
          "ko": "고객이 이 디자인을 마음에 들어 했다"
        },
        "gloss": {
          "en": "As far as I understand, the client liked this design.",
          "ko": "제가 알기로는 고객이 이 디자인을 마음에 들어 했어요."
        }
      },
      {
        "text": "जहाँ तक मैं समझता हूँ, यह नियम अगले साल से लागू होगा।",
        "slot": "यह नियम अगले साल से लागू होगा",
        "cue": {
          "en": "this rule takes effect from next year",
          "ko": "이 규정이 내년부터 시행된다"
        },
        "gloss": {
          "en": "As far as I understand, this rule takes effect next year.",
          "ko": "제가 알기로는 이 규정은 내년부터 시행돼요."
        }
      },
      {
        "text": "जहाँ तक मैं समझता हूँ, हमें अभी और लोगों की ज़रूरत नहीं है।",
        "slot": "हमें अभी और लोगों की ज़रूरत नहीं है",
        "cue": {
          "en": "we don't need more people yet",
          "ko": "아직 사람이 더 필요하지 않다"
        },
        "gloss": {
          "en": "As far as I understand, we don't need more people yet.",
          "ko": "제가 알기로는 아직 사람이 더 필요하지 않아요."
        }
      }
    ]
  },
  {
    "id": "hi-f4-17",
    "stage": 4,
    "fn": "persuade",
    "pattern": "मुद्दे की बात यह है कि ___।",
    "core": [
      "मुद्दे की बात यह है कि"
    ],
    "meaning": {
      "en": "Getting to the point: The main point is that ___.",
      "ko": "요점 짚기: 핵심은 ~라는 거예요."
    },
    "grammar": [],
    "expressions": [
      "मुद्दे की बात"
    ],
    "examples": [
      {
        "text": "मुद्दे की बात यह है कि मैं हमेशा समय पर किराया देता हूँ।",
        "slot": "मैं हमेशा समय पर किराया देता हूँ",
        "cue": {
          "en": "I always pay the rent on time",
          "ko": "항상 월세를 제때 낸다"
        },
        "gloss": {
          "en": "The point is that I always pay the rent on time.",
          "ko": "핵심은 제가 항상 월세를 제때 낸다는 거예요."
        }
      },
      {
        "text": "मुद्दे की बात यह है कि हमारे पास समय बहुत कम है।",
        "slot": "हमारे पास समय बहुत कम है",
        "cue": {
          "en": "we have very little time",
          "ko": "시간이 아주 적다"
        },
        "gloss": {
          "en": "The point is that we have very little time.",
          "ko": "핵심은 우리에게 시간이 아주 없다는 거예요."
        }
      },
      {
        "text": "मुद्दे की बात यह है कि ग्राहक को जल्दी जवाब चाहिए।",
        "slot": "ग्राहक को जल्दी जवाब चाहिए",
        "cue": {
          "en": "the customer wants a quick answer",
          "ko": "고객이 빠른 답을 원한다"
        },
        "gloss": {
          "en": "The point is that the customer wants a quick answer.",
          "ko": "핵심은 고객이 빠른 답을 원한다는 거예요."
        }
      },
      {
        "text": "मुद्दे की बात यह है कि यह योजना सबके लिए फ़ायदेमंद है।",
        "slot": "यह योजना सबके लिए फ़ायदेमंद है",
        "cue": {
          "en": "this plan benefits everyone",
          "ko": "이 계획이 모두에게 이롭다"
        },
        "gloss": {
          "en": "The point is that this plan benefits everyone.",
          "ko": "핵심은 이 계획이 모두에게 이롭다는 거예요."
        }
      }
    ]
  },
  {
    "id": "hi-f4-18",
    "stage": 4,
    "fn": "report",
    "pattern": "सबसे बड़ी समस्या ___ की है।",
    "core": [
      "सबसे बड़ी समस्या"
    ],
    "meaning": {
      "en": "Naming the main problem: The biggest problem is (one of) ___.",
      "ko": "가장 큰 문제 짚기: 가장 큰 문제는 ~예요."
    },
    "grammar": [],
    "expressions": [
      "सबसे बड़ी समस्या"
    ],
    "examples": [
      {
        "text": "सबसे बड़ी समस्या टेस्टिंग की है।",
        "slot": "टेस्टिंग",
        "cue": {
          "en": "testing",
          "ko": "테스트"
        },
        "gloss": {
          "en": "The biggest problem is testing.",
          "ko": "가장 큰 문제는 테스트예요."
        }
      },
      {
        "text": "सबसे बड़ी समस्या पैसों की है।",
        "slot": "पैसों",
        "cue": {
          "en": "money",
          "ko": "돈"
        },
        "gloss": {
          "en": "The biggest problem is money.",
          "ko": "가장 큰 문제는 돈이에요."
        }
      },
      {
        "text": "सबसे बड़ी समस्या जगह की है।",
        "slot": "जगह",
        "cue": {
          "en": "space",
          "ko": "공간"
        },
        "gloss": {
          "en": "The biggest problem is space.",
          "ko": "가장 큰 문제는 공간이에요."
        }
      },
      {
        "text": "सबसे बड़ी समस्या लोगों की कमी की है।",
        "slot": "लोगों की कमी",
        "cue": {
          "en": "a shortage of people",
          "ko": "인력 부족"
        },
        "gloss": {
          "en": "The biggest problem is a shortage of people.",
          "ko": "가장 큰 문제는 인력 부족이에요."
        }
      }
    ]
  },
  {
    "id": "hi-f4-19",
    "stage": 4,
    "fn": "negotiate",
    "pattern": "क्या हम ___ को लेकर कोई बीच का रास्ता निकाल सकते हैं?",
    "core": [
      "बीच का रास्ता"
    ],
    "meaning": {
      "en": "Proposing a compromise: Can we find a middle way on ___?",
      "ko": "타협 제안하기: ~에 대해 중간 지점을 찾을 수 있을까요?"
    },
    "grammar": [],
    "expressions": [
      "बीच का रास्ता"
    ],
    "examples": [
      {
        "text": "क्या हम किराए को लेकर कोई बीच का रास्ता निकाल सकते हैं?",
        "slot": "किराए",
        "cue": {
          "en": "the rent",
          "ko": "월세"
        },
        "gloss": {
          "en": "Can we find a middle way on the rent?",
          "ko": "월세 문제에서 중간 지점을 찾을 수 있을까요?"
        }
      },
      {
        "text": "क्या हम डेडलाइन को लेकर कोई बीच का रास्ता निकाल सकते हैं?",
        "slot": "डेडलाइन",
        "cue": {
          "en": "the deadline",
          "ko": "마감"
        },
        "gloss": {
          "en": "Can we find a middle way on the deadline?",
          "ko": "마감에 대해 중간 지점을 찾을 수 있을까요?"
        }
      },
      {
        "text": "क्या हम क़ीमत को लेकर कोई बीच का रास्ता निकाल सकते हैं?",
        "slot": "क़ीमत",
        "cue": {
          "en": "the price",
          "ko": "가격"
        },
        "gloss": {
          "en": "Can we find a middle way on the price?",
          "ko": "가격에서 중간 지점을 찾을 수 있을까요?"
        }
      },
      {
        "text": "क्या हम छुट्टियों को लेकर कोई बीच का रास्ता निकाल सकते हैं?",
        "slot": "छुट्टियों",
        "cue": {
          "en": "the holidays",
          "ko": "휴가"
        },
        "gloss": {
          "en": "Can we find a middle way on the holidays?",
          "ko": "휴가 문제에서 중간 지점을 찾을 수 있을까요?"
        }
      }
    ]
  },
  {
    "id": "hi-f4-20",
    "stage": 4,
    "fn": "hypothetical",
    "pattern": "मान लीजिए ___, तो हम क्या करेंगे?",
    "core": [
      "मान लीजिए"
    ],
    "meaning": {
      "en": "Raising a 'what if': Suppose ___, then what will we do?",
      "ko": "가정해 보기: ~라고 쳐요, 그럼 어떻게 하죠?"
    },
    "grammar": [],
    "expressions": [
      "मान लीजिए"
    ],
    "examples": [
      {
        "text": "मान लीजिए क्लाइंट न माने, तो हम क्या करेंगे?",
        "slot": "क्लाइंट न माने",
        "cue": {
          "en": "the client doesn't agree",
          "ko": "고객이 동의하지 않다"
        },
        "gloss": {
          "en": "Suppose the client doesn't agree, then what will we do?",
          "ko": "고객이 동의하지 않는다고 쳐요, 그럼 어떻게 하죠?"
        }
      },
      {
        "text": "मान लीजिए बजट आधा हो जाए, तो हम क्या करेंगे?",
        "slot": "बजट आधा हो जाए",
        "cue": {
          "en": "the budget is cut in half",
          "ko": "예산이 반으로 줄다"
        },
        "gloss": {
          "en": "Suppose the budget is halved, then what will we do?",
          "ko": "예산이 반으로 준다고 쳐요, 그럼 어떻게 하죠?"
        }
      },
      {
        "text": "मान लीजिए टीम में कोई बीमार पड़ जाए, तो हम क्या करेंगे?",
        "slot": "टीम में कोई बीमार पड़ जाए",
        "cue": {
          "en": "someone on the team falls ill",
          "ko": "팀에서 누가 아프다"
        },
        "gloss": {
          "en": "Suppose someone on the team falls ill, then what will we do?",
          "ko": "팀에서 누가 아프다고 쳐요, 그럼 어떻게 하죠?"
        }
      },
      {
        "text": "मान लीजिए सर्वर बंद हो जाए, तो हम क्या करेंगे?",
        "slot": "सर्वर बंद हो जाए",
        "cue": {
          "en": "the server goes down",
          "ko": "서버가 멈추다"
        },
        "gloss": {
          "en": "Suppose the server goes down, then what will we do?",
          "ko": "서버가 멈춘다고 쳐요, 그럼 어떻게 하죠?"
        }
      }
    ]
  },
  {
    "id": "hi-f5-01",
    "stage": 5,
    "fn": "formal-humble",
    "pattern": "आप ___ बैठिए ना, मैं पानी लाता हूँ।",
    "core": [
      "बैठिए ना"
    ],
    "meaning": {
      "en": "Warmly seating an elder (आप register): Please sit ___, I'll bring water.",
      "ko": "어른께 공손히 권하기(आप 높임): ~ 앉으세요, 물 가져올게요."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "आप यहाँ बैठिए ना, मैं पानी लाता हूँ।",
        "slot": "यहाँ",
        "cue": {
          "en": "here",
          "ko": "여기"
        },
        "gloss": {
          "en": "Please sit here, I'll bring some water.",
          "ko": "여기 앉으세요, 물 가져올게요."
        }
      },
      {
        "text": "आप आराम से बैठिए ना, मैं पानी लाता हूँ।",
        "slot": "आराम से",
        "cue": {
          "en": "comfortably",
          "ko": "편히"
        },
        "gloss": {
          "en": "Please sit comfortably, I'll bring some water.",
          "ko": "편히 앉으세요, 물 가져올게요."
        }
      },
      {
        "text": "आप इस कुर्सी पर बैठिए ना, मैं पानी लाता हूँ।",
        "slot": "इस कुर्सी पर",
        "cue": {
          "en": "on this chair",
          "ko": "이 의자에"
        },
        "gloss": {
          "en": "Please sit on this chair, I'll bring some water.",
          "ko": "이 의자에 앉으세요, 물 가져올게요."
        }
      },
      {
        "text": "आप अंदर बैठिए ना, मैं पानी लाता हूँ।",
        "slot": "अंदर",
        "cue": {
          "en": "inside",
          "ko": "안에"
        },
        "gloss": {
          "en": "Please sit inside, I'll bring some water.",
          "ko": "안에 앉으세요, 물 가져올게요."
        }
      }
    ]
  },
  {
    "id": "hi-f5-02",
    "stage": 5,
    "fn": "request-thing",
    "pattern": "तुम ज़रा ___ ले आओ।",
    "core": [
      "ले आओ"
    ],
    "meaning": {
      "en": "Asking a friend or younger person (तुम register): Could you just bring ___.",
      "ko": "친구·아랫사람에게 부탁하기(तुम): ~ 좀 가져와."
    },
    "grammar": [
      0
    ],
    "expressions": [],
    "examples": [
      {
        "text": "तुम ज़रा पानी ले आओ।",
        "slot": "पानी",
        "cue": {
          "en": "water",
          "ko": "물"
        },
        "gloss": {
          "en": "Just bring some water, will you.",
          "ko": "물 좀 가져와."
        }
      },
      {
        "text": "तुम ज़रा मेरा चश्मा ले आओ।",
        "slot": "मेरा चश्मा",
        "cue": {
          "en": "my glasses",
          "ko": "내 안경"
        },
        "gloss": {
          "en": "Just bring my glasses, will you.",
          "ko": "내 안경 좀 가져와."
        }
      },
      {
        "text": "तुम ज़रा थोड़ी मिठाई ले आओ।",
        "slot": "थोड़ी मिठाई",
        "cue": {
          "en": "some sweets",
          "ko": "단것 조금"
        },
        "gloss": {
          "en": "Just bring some sweets, will you.",
          "ko": "단것 좀 가져와."
        }
      },
      {
        "text": "तुम ज़रा बाज़ार से दूध ले आओ।",
        "slot": "बाज़ार से दूध",
        "cue": {
          "en": "milk from the market",
          "ko": "시장에서 우유"
        },
        "gloss": {
          "en": "Just bring some milk from the market, will you.",
          "ko": "시장에서 우유 좀 사 와."
        }
      }
    ]
  },
  {
    "id": "hi-f5-03",
    "stage": 5,
    "fn": "formal-request",
    "pattern": "आप सबसे मेरा निवेदन है कि ___।",
    "core": [
      "मेरा निवेदन है कि"
    ],
    "meaning": {
      "en": "Formal request to an audience: My humble request to you all is that ___.",
      "ko": "격식 있게 청하기: 여러분께 ~해 주시길 부탁드립니다."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "आप सबसे मेरा निवेदन है कि अपने विचार ज़रूर साझा करें।",
        "slot": "अपने विचार ज़रूर साझा करें",
        "cue": {
          "en": "do share your thoughts",
          "ko": "생각을 꼭 나누다"
        },
        "gloss": {
          "en": "I request you all to do share your thoughts.",
          "ko": "여러분의 생각을 꼭 나눠 주시길 부탁드립니다."
        }
      },
      {
        "text": "आप सबसे मेरा निवेदन है कि कार्यक्रम के दौरान फ़ोन बंद रखें।",
        "slot": "कार्यक्रम के दौरान फ़ोन बंद रखें",
        "cue": {
          "en": "keep phones off during the event",
          "ko": "행사 중 전화를 꺼 두다"
        },
        "gloss": {
          "en": "I request you all to keep your phones off during the event.",
          "ko": "행사 중에는 휴대전화를 꺼 주시길 부탁드립니다."
        }
      },
      {
        "text": "आप सबसे मेरा निवेदन है कि समय पर अपनी जगह ले लें।",
        "slot": "समय पर अपनी जगह ले लें",
        "cue": {
          "en": "take your seats on time",
          "ko": "제시간에 자리에 앉다"
        },
        "gloss": {
          "en": "I request you all to take your seats on time.",
          "ko": "제시간에 자리에 앉아 주시길 부탁드립니다."
        }
      },
      {
        "text": "आप सबसे मेरा निवेदन है कि नए सदस्यों का स्वागत करें।",
        "slot": "नए सदस्यों का स्वागत करें",
        "cue": {
          "en": "welcome the new members",
          "ko": "새 회원을 환영하다"
        },
        "gloss": {
          "en": "I request you all to welcome the new members.",
          "ko": "새 회원들을 환영해 주시길 부탁드립니다."
        }
      }
    ]
  },
  {
    "id": "hi-f5-04",
    "stage": 5,
    "fn": "debate",
    "pattern": "मेरे विचार से ___।",
    "core": [
      "मेरे विचार से"
    ],
    "meaning": {
      "en": "Stating a view formally: In my view, ___.",
      "ko": "격식 있게 견해 밝히기: 제 견해로는 ~."
    },
    "grammar": [
      1
    ],
    "expressions": [],
    "examples": [
      {
        "text": "मेरे विचार से कुछ परंपराएँ आज भी प्रासंगिक हैं।",
        "slot": "कुछ परंपराएँ आज भी प्रासंगिक हैं",
        "cue": {
          "en": "some traditions are still relevant",
          "ko": "어떤 전통은 지금도 의미가 있다"
        },
        "gloss": {
          "en": "In my view, some traditions are still relevant today.",
          "ko": "제 견해로는 어떤 전통은 오늘날에도 의미가 있습니다."
        }
      },
      {
        "text": "मेरे विचार से शिक्षा सबसे बड़ा निवेश है।",
        "slot": "शिक्षा सबसे बड़ा निवेश है",
        "cue": {
          "en": "education is the biggest investment",
          "ko": "교육이 가장 큰 투자다"
        },
        "gloss": {
          "en": "In my view, education is the biggest investment.",
          "ko": "제 견해로는 교육이 가장 큰 투자입니다."
        }
      },
      {
        "text": "मेरे विचार से इस विषय पर खुलकर चर्चा होनी चाहिए।",
        "slot": "इस विषय पर खुलकर चर्चा होनी चाहिए",
        "cue": {
          "en": "this subject should be discussed openly",
          "ko": "이 주제를 터놓고 논의해야 한다"
        },
        "gloss": {
          "en": "In my view, this subject should be discussed openly.",
          "ko": "제 견해로는 이 주제를 터놓고 논의해야 합니다."
        }
      },
      {
        "text": "मेरे विचार से तकनीक ने रिश्तों को बदल दिया है।",
        "slot": "तकनीक ने रिश्तों को बदल दिया है",
        "cue": {
          "en": "technology has changed relationships",
          "ko": "기술이 관계를 바꿔 놓았다"
        },
        "gloss": {
          "en": "In my view, technology has changed relationships.",
          "ko": "제 견해로는 기술이 인간관계를 바꿔 놓았습니다."
        }
      }
    ]
  },
  {
    "id": "hi-f5-05",
    "stage": 5,
    "fn": "apologize",
    "pattern": "मैं ___ भूल बैठा।",
    "core": [
      "भूल बैठा"
    ],
    "meaning": {
      "en": "Admitting a slip (compound verb बैठना): I went and forgot ___.",
      "ko": "실수 털어놓기(복합동사 बैठना): 그만 ~를 깜빡해 버렸어요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "मैं कल उसका जन्मदिन भूल बैठा।",
        "slot": "कल उसका जन्मदिन",
        "cue": {
          "en": "her birthday yesterday",
          "ko": "어제 그녀의 생일"
        },
        "gloss": {
          "en": "I went and forgot her birthday yesterday.",
          "ko": "어제 그 사람 생일을 그만 깜빡해 버렸어."
        }
      },
      {
        "text": "मैं बैठक का समय भूल बैठा।",
        "slot": "बैठक का समय",
        "cue": {
          "en": "the meeting time",
          "ko": "회의 시간"
        },
        "gloss": {
          "en": "I went and forgot the meeting time.",
          "ko": "회의 시간을 그만 깜빡해 버렸어요."
        }
      },
      {
        "text": "मैं उनका नाम भूल बैठा।",
        "slot": "उनका नाम",
        "cue": {
          "en": "his name",
          "ko": "그분 이름"
        },
        "gloss": {
          "en": "I went and forgot his name.",
          "ko": "그분 이름을 그만 깜빡해 버렸어요."
        }
      },
      {
        "text": "मैं जल्दी में अपना बटुआ घर पर भूल बैठा।",
        "slot": "जल्दी में अपना बटुआ घर पर",
        "cue": {
          "en": "my wallet at home in a rush",
          "ko": "급하게 지갑을 집에"
        },
        "gloss": {
          "en": "In my rush I went and left my wallet at home.",
          "ko": "급하게 나오다 지갑을 집에 두고 와 버렸어요."
        }
      }
    ]
  },
  {
    "id": "hi-f5-06",
    "stage": 5,
    "fn": "storytelling",
    "pattern": "मैंने एक ही रात में ___ कर डाला।",
    "core": [
      "कर डाला"
    ],
    "meaning": {
      "en": "Telling a feat (compound verb डालना): In just one night I got ___ done.",
      "ko": "무용담 말하기(복합동사 डालना): 하룻밤 만에 ~를 해치웠어요."
    },
    "grammar": [
      2
    ],
    "expressions": [],
    "examples": [
      {
        "text": "मैंने एक ही रात में सारा काम कर डाला।",
        "slot": "सारा काम",
        "cue": {
          "en": "all the work",
          "ko": "일 전부"
        },
        "gloss": {
          "en": "I got all the work done in just one night.",
          "ko": "하룻밤 만에 일을 다 해치웠어요."
        }
      },
      {
        "text": "मैंने एक ही रात में पूरा प्रोजेक्ट कर डाला।",
        "slot": "पूरा प्रोजेक्ट",
        "cue": {
          "en": "the whole project",
          "ko": "프로젝트 전체"
        },
        "gloss": {
          "en": "I knocked out the whole project in one night.",
          "ko": "하룻밤 만에 프로젝트를 통째로 해치웠어요."
        }
      },
      {
        "text": "मैंने एक ही रात में पूरा घर साफ़ कर डाला।",
        "slot": "पूरा घर साफ़",
        "cue": {
          "en": "the whole house clean",
          "ko": "집 전체 청소"
        },
        "gloss": {
          "en": "I cleaned the whole house in just one night.",
          "ko": "하룻밤 만에 집 청소를 다 해치웠어요."
        }
      },
      {
        "text": "मैंने एक ही रात में सारा सामान पैक कर डाला।",
        "slot": "सारा सामान पैक",
        "cue": {
          "en": "all the luggage packed",
          "ko": "짐 싸기 전부"
        },
        "gloss": {
          "en": "I packed everything in just one night.",
          "ko": "하룻밤 만에 짐을 다 싸 버렸어요."
        }
      }
    ]
  },
  {
    "id": "hi-f5-07",
    "stage": 5,
    "fn": "changed",
    "pattern": "___ बदलता जा रहा है।",
    "core": [
      "बदलता जा रहा है"
    ],
    "meaning": {
      "en": "Describing ongoing change (-ता जाना): ___ keeps on changing.",
      "ko": "계속되는 변화 말하기(-ता जाना): ~가 점점 바뀌어 가고 있어요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "हमारा शहर तेज़ी से बदलता जा रहा है।",
        "slot": "हमारा शहर तेज़ी से",
        "cue": {
          "en": "our city, fast",
          "ko": "우리 도시가 빠르게"
        },
        "gloss": {
          "en": "Our city keeps changing fast.",
          "ko": "우리 도시가 빠르게 바뀌어 가고 있어요."
        }
      },
      {
        "text": "त्योहार मनाने का तरीक़ा बदलता जा रहा है।",
        "slot": "त्योहार मनाने का तरीक़ा",
        "cue": {
          "en": "the way festivals are celebrated",
          "ko": "명절을 보내는 방식"
        },
        "gloss": {
          "en": "The way festivals are celebrated keeps changing.",
          "ko": "명절을 보내는 방식이 점점 바뀌어 가고 있어요."
        }
      },
      {
        "text": "गाँव का माहौल धीरे-धीरे बदलता जा रहा है।",
        "slot": "गाँव का माहौल धीरे-धीरे",
        "cue": {
          "en": "the village atmosphere, slowly",
          "ko": "마을 분위기가 서서히"
        },
        "gloss": {
          "en": "The village atmosphere is slowly changing.",
          "ko": "마을 분위기가 서서히 바뀌어 가고 있어요."
        }
      },
      {
        "text": "काम करने का ढंग बदलता जा रहा है।",
        "slot": "काम करने का ढंग",
        "cue": {
          "en": "the way of working",
          "ko": "일하는 방식"
        },
        "gloss": {
          "en": "The way we work keeps changing.",
          "ko": "일하는 방식이 점점 바뀌어 가고 있어요."
        }
      }
    ]
  },
  {
    "id": "hi-f5-08",
    "stage": 5,
    "fn": "plan-intent",
    "pattern": "मैं ___ करता रहूँगा।",
    "core": [
      "करता रहूँगा"
    ],
    "meaning": {
      "en": "Promising to keep at it (-ते रहना): I'll keep on ___.",
      "ko": "꾸준히 하겠다고 말하기(-ते रहना): 계속 ~할게요."
    },
    "grammar": [
      3
    ],
    "expressions": [],
    "examples": [
      {
        "text": "मैं उनकी टीम से पता करता रहूँगा।",
        "slot": "उनकी टीम से पता",
        "cue": {
          "en": "find out from their team",
          "ko": "그쪽 팀에 알아보다"
        },
        "gloss": {
          "en": "I'll keep checking with their team.",
          "ko": "그쪽 팀에 계속 알아볼게요."
        }
      },
      {
        "text": "मैं हर दिन अभ्यास करता रहूँगा।",
        "slot": "हर दिन अभ्यास",
        "cue": {
          "en": "practise every day",
          "ko": "매일 연습하다"
        },
        "gloss": {
          "en": "I'll keep practising every day.",
          "ko": "매일 계속 연습할게요."
        }
      },
      {
        "text": "मैं आपको फ़ोन करता रहूँगा।",
        "slot": "आपको फ़ोन",
        "cue": {
          "en": "phone you",
          "ko": "당신에게 전화하다"
        },
        "gloss": {
          "en": "I'll keep calling you.",
          "ko": "계속 전화드릴게요."
        }
      },
      {
        "text": "मैं इस पर काम करता रहूँगा।",
        "slot": "इस पर काम",
        "cue": {
          "en": "work on this",
          "ko": "이 일을 하다"
        },
        "gloss": {
          "en": "I'll keep working on this.",
          "ko": "이 일은 계속 붙잡고 할게요."
        }
      }
    ]
  },
  {
    "id": "hi-f5-09",
    "stage": 5,
    "fn": "changed",
    "pattern": "___ बढ़ता ही जा रहा है।",
    "core": [
      "बढ़ता ही जा रहा है"
    ],
    "meaning": {
      "en": "Stressing a growing trend (ही + -ता जाना): ___ just keeps on growing.",
      "ko": "커지는 흐름 강조하기: ~가 갈수록 늘기만 해요."
    },
    "grammar": [
      3,
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "आजकल दिखावा बढ़ता ही जा रहा है।",
        "slot": "आजकल दिखावा",
        "cue": {
          "en": "showing off these days",
          "ko": "요즘 과시"
        },
        "gloss": {
          "en": "Showing off just keeps growing these days.",
          "ko": "요즘 과시가 갈수록 늘기만 해요."
        }
      },
      {
        "text": "शहर में ट्रैफ़िक बढ़ता ही जा रहा है।",
        "slot": "शहर में ट्रैफ़िक",
        "cue": {
          "en": "traffic in the city",
          "ko": "도시의 교통량"
        },
        "gloss": {
          "en": "Traffic in the city just keeps growing.",
          "ko": "도시 교통량이 갈수록 늘기만 해요."
        }
      },
      {
        "text": "घर का ख़र्च बढ़ता ही जा रहा है।",
        "slot": "घर का ख़र्च",
        "cue": {
          "en": "household expenses",
          "ko": "집안 지출"
        },
        "gloss": {
          "en": "Household expenses just keep going up.",
          "ko": "집안 지출이 갈수록 늘기만 해요."
        }
      },
      {
        "text": "काम का दबाव बढ़ता ही जा रहा है।",
        "slot": "काम का दबाव",
        "cue": {
          "en": "pressure at work",
          "ko": "업무 압박"
        },
        "gloss": {
          "en": "The pressure at work just keeps growing.",
          "ko": "업무 압박이 갈수록 커지기만 해요."
        }
      }
    ]
  },
  {
    "id": "hi-f5-10",
    "stage": 5,
    "fn": "agree",
    "pattern": "मैं तो पहले ही कह रहा था कि ___।",
    "core": [
      "मैं तो पहले ही कह रहा था"
    ],
    "meaning": {
      "en": "I-told-you-so (emphatic तो / ही): I was saying all along that ___.",
      "ko": "거봐요(강조 तो·ही): 제가 진작 ~라고 했잖아요."
    },
    "grammar": [
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "मैं तो पहले ही कह रहा था कि बारिश होगी।",
        "slot": "बारिश होगी",
        "cue": {
          "en": "it will rain",
          "ko": "비가 오다"
        },
        "gloss": {
          "en": "I was saying all along that it would rain.",
          "ko": "제가 진작 비 온다고 했잖아요."
        }
      },
      {
        "text": "मैं तो पहले ही कह रहा था कि यह योजना नहीं चलेगी।",
        "slot": "यह योजना नहीं चलेगी",
        "cue": {
          "en": "this plan won't work",
          "ko": "이 계획은 안 된다"
        },
        "gloss": {
          "en": "I was saying all along this plan wouldn't work.",
          "ko": "제가 진작 이 계획은 안 될 거라고 했잖아요."
        }
      },
      {
        "text": "मैं तो पहले ही कह रहा था कि वह देर से आएगा।",
        "slot": "वह देर से आएगा",
        "cue": {
          "en": "he'll come late",
          "ko": "그가 늦게 오다"
        },
        "gloss": {
          "en": "I was saying all along he'd be late.",
          "ko": "제가 진작 그 사람 늦을 거라고 했잖아요."
        }
      },
      {
        "text": "मैं तो पहले ही कह रहा था कि टिकट जल्दी ख़त्म हो जाएँगे।",
        "slot": "टिकट जल्दी ख़त्म हो जाएँगे",
        "cue": {
          "en": "the tickets will sell out fast",
          "ko": "표가 금방 매진되다"
        },
        "gloss": {
          "en": "I was saying all along the tickets would sell out fast.",
          "ko": "제가 진작 표가 금방 매진될 거라고 했잖아요."
        }
      }
    ]
  },
  {
    "id": "hi-f5-11",
    "stage": 5,
    "fn": "debate",
    "pattern": "आप ही तो कहते रहते हैं कि ___।",
    "core": [
      "आप ही तो कहते रहते हैं कि"
    ],
    "meaning": {
      "en": "Turning someone's own words back (ही तो): But you're the one who always says ___.",
      "ko": "상대 말 되돌려주기(ही तो): 늘 ~라고 하시는 분이 바로 당신이잖아요."
    },
    "grammar": [
      3,
      4
    ],
    "expressions": [],
    "examples": [
      {
        "text": "आप ही तो कहते रहते हैं कि सच बोलो, पर मीठा बोलो।",
        "slot": "सच बोलो, पर मीठा बोलो",
        "cue": {
          "en": "speak the truth, but sweetly",
          "ko": "진실을 말하되 부드럽게 말하라"
        },
        "gloss": {
          "en": "You're the one who always says: tell the truth, but kindly.",
          "ko": "진실을 말하되 부드럽게 하라고 늘 하시는 분이 바로 당신이잖아요."
        }
      },
      {
        "text": "आप ही तो कहते रहते हैं कि सेहत सबसे बड़ा धन है।",
        "slot": "सेहत सबसे बड़ा धन है",
        "cue": {
          "en": "health is the greatest wealth",
          "ko": "건강이 가장 큰 재산이다"
        },
        "gloss": {
          "en": "You're the one who always says health is the greatest wealth.",
          "ko": "건강이 최고의 재산이라고 늘 하시잖아요."
        }
      },
      {
        "text": "आप ही तो कहते रहते हैं कि वक़्त की क़द्र करो।",
        "slot": "वक़्त की क़द्र करो",
        "cue": {
          "en": "value your time",
          "ko": "시간을 소중히 하라"
        },
        "gloss": {
          "en": "You're the one who always says to value time.",
          "ko": "시간을 소중히 하라고 늘 하시잖아요."
        }
      },
      {
        "text": "आप ही तो कहते रहते हैं कि हर ग़लती से कुछ सीखना चाहिए।",
        "slot": "हर ग़लती से कुछ सीखना चाहिए",
        "cue": {
          "en": "one should learn from every mistake",
          "ko": "모든 실수에서 배워야 한다"
        },
        "gloss": {
          "en": "You're the one who always says we should learn from every mistake.",
          "ko": "모든 실수에서 뭔가 배워야 한다고 늘 하시잖아요."
        }
      }
    ]
  },
  {
    "id": "hi-f5-12",
    "stage": 5,
    "fn": "nuance-soften",
    "pattern": "ज़रा ___ एक बार फिर सोचिएगा।",
    "core": [
      "सोचिएगा"
    ],
    "meaning": {
      "en": "Softened request (ज़रा + -इएगा): Do think again about ___, if you would.",
      "ko": "부드럽게 부탁하기(ज़रा·-इएगा): ~에 대해 한 번만 더 생각해 봐 주세요."
    },
    "grammar": [
      5
    ],
    "expressions": [],
    "examples": [
      {
        "text": "ज़रा इस पर एक बार फिर सोचिएगा।",
        "slot": "इस पर",
        "cue": {
          "en": "about this",
          "ko": "이것에 대해"
        },
        "gloss": {
          "en": "Do think about this once more, if you would.",
          "ko": "이것에 대해 한 번만 더 생각해 봐 주세요."
        }
      },
      {
        "text": "ज़रा मेरे सुझाव पर एक बार फिर सोचिएगा।",
        "slot": "मेरे सुझाव पर",
        "cue": {
          "en": "about my suggestion",
          "ko": "제 제안에 대해"
        },
        "gloss": {
          "en": "Do think over my suggestion once more.",
          "ko": "제 제안을 한 번만 더 생각해 봐 주세요."
        }
      },
      {
        "text": "ज़रा इस फ़ैसले पर एक बार फिर सोचिएगा।",
        "slot": "इस फ़ैसले पर",
        "cue": {
          "en": "about this decision",
          "ko": "이 결정에 대해"
        },
        "gloss": {
          "en": "Do reconsider this decision once more.",
          "ko": "이 결정을 한 번만 더 생각해 봐 주세요."
        }
      },
      {
        "text": "ज़रा बच्चों की बात पर एक बार फिर सोचिएगा।",
        "slot": "बच्चों की बात पर",
        "cue": {
          "en": "about what the children said",
          "ko": "아이들 말에 대해"
        },
        "gloss": {
          "en": "Do think again about what the children said.",
          "ko": "아이들 말을 한 번만 더 생각해 봐 주세요."
        }
      }
    ]
  },
  {
    "id": "hi-f5-13",
    "stage": 5,
    "fn": "nuance-soften",
    "pattern": "बुरा मत मानिएगा, पर ___।",
    "core": [
      "बुरा मत मानिएगा"
    ],
    "meaning": {
      "en": "Cushioning criticism: Please don't take it badly, but ___.",
      "ko": "비판 누그러뜨리기: 언짢게 듣지 마세요, 그런데 ~."
    },
    "grammar": [
      5
    ],
    "expressions": [
      "बुरा मत मानिए"
    ],
    "examples": [
      {
        "text": "बुरा मत मानिएगा, पर स्लाइड्स थोड़ी भरी हुई थीं।",
        "slot": "स्लाइड्स थोड़ी भरी हुई थीं",
        "cue": {
          "en": "the slides were a bit crowded",
          "ko": "슬라이드가 좀 빽빽했다"
        },
        "gloss": {
          "en": "Please don't mind, but the slides were a bit crowded.",
          "ko": "언짢게 듣지 마세요, 슬라이드가 좀 빽빽했어요."
        }
      },
      {
        "text": "बुरा मत मानिएगा, पर खाने में नमक थोड़ा ज़्यादा था।",
        "slot": "खाने में नमक थोड़ा ज़्यादा था",
        "cue": {
          "en": "the food was a bit salty",
          "ko": "음식이 좀 짰다"
        },
        "gloss": {
          "en": "Please don't mind, but the food had a bit too much salt.",
          "ko": "언짢게 듣지 마세요, 음식이 좀 짰어요."
        }
      },
      {
        "text": "बुरा मत मानिएगा, पर आपकी आवाज़ पीछे तक नहीं पहुँच रही थी।",
        "slot": "आपकी आवाज़ पीछे तक नहीं पहुँच रही थी",
        "cue": {
          "en": "your voice wasn't reaching the back",
          "ko": "목소리가 뒤까지 안 들렸다"
        },
        "gloss": {
          "en": "Please don't mind, but your voice wasn't reaching the back.",
          "ko": "언짢게 듣지 마세요, 목소리가 뒤까지 안 들렸어요."
        }
      },
      {
        "text": "बुरा मत मानिएगा, पर यह रंग आप पर ज़्यादा नहीं जँचता।",
        "slot": "यह रंग आप पर ज़्यादा नहीं जँचता",
        "cue": {
          "en": "this colour doesn't really suit you",
          "ko": "이 색이 별로 안 어울린다"
        },
        "gloss": {
          "en": "Please don't mind, but this colour doesn't really suit you.",
          "ko": "언짢게 듣지 마세요, 이 색은 별로 안 어울리세요."
        }
      }
    ]
  },
  {
    "id": "hi-f5-14",
    "stage": 5,
    "fn": "invite",
    "pattern": "चल, पहले ___ खाते हैं।",
    "core": [
      "खाते हैं"
    ],
    "meaning": {
      "en": "Casual invitation with echo words: Come on, let's eat ___ and stuff first.",
      "ko": "편하게 권하기(메아리 낱말): 야, 먼저 ~ 같은 거 먹자."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "चल, पहले जलेबी-वलेबी खाते हैं।",
        "slot": "जलेबी-वलेबी",
        "cue": {
          "en": "jalebis and such",
          "ko": "잘레비 같은 거"
        },
        "gloss": {
          "en": "Come on, let's have some jalebis and stuff first.",
          "ko": "야, 먼저 잘레비 같은 거 먹자."
        }
      },
      {
        "text": "चल, पहले समोसे-वमोसे खाते हैं।",
        "slot": "समोसे-वमोसे",
        "cue": {
          "en": "samosas and such",
          "ko": "사모사 같은 거"
        },
        "gloss": {
          "en": "Come on, let's grab some samosas or something first.",
          "ko": "야, 먼저 사모사 같은 거 먹자."
        }
      },
      {
        "text": "चल, पहले चाट-वाट खाते हैं।",
        "slot": "चाट-वाट",
        "cue": {
          "en": "chaat and such",
          "ko": "차트 같은 거"
        },
        "gloss": {
          "en": "Come on, let's get some chaat or something first.",
          "ko": "야, 먼저 차트 같은 거 먹자."
        }
      },
      {
        "text": "चल, पहले पकौड़े-वकौड़े खाते हैं।",
        "slot": "पकौड़े-वकौड़े",
        "cue": {
          "en": "pakoras and such",
          "ko": "파코라 같은 거"
        },
        "gloss": {
          "en": "Come on, let's eat some pakoras or whatever first.",
          "ko": "야, 먼저 파코라 같은 거 먹자."
        }
      }
    ]
  },
  {
    "id": "hi-f5-15",
    "stage": 5,
    "fn": "ongoing",
    "pattern": "मैं धीरे-धीरे ___ सीख रहा हूँ।",
    "core": [
      "धीरे-धीरे"
    ],
    "meaning": {
      "en": "Saying you're learning bit by bit (reduplication): I'm slowly learning ___.",
      "ko": "조금씩 배우는 중이라고 말하기(반복어): 저는 차근차근 ~를 배우고 있어요."
    },
    "grammar": [
      6
    ],
    "expressions": [],
    "examples": [
      {
        "text": "मैं धीरे-धीरे खाना बनाना सीख रहा हूँ।",
        "slot": "खाना बनाना",
        "cue": {
          "en": "to cook",
          "ko": "요리하기"
        },
        "gloss": {
          "en": "I'm slowly learning to cook.",
          "ko": "저는 차근차근 요리를 배우고 있어요."
        }
      },
      {
        "text": "मैं धीरे-धीरे गाड़ी चलाना सीख रहा हूँ।",
        "slot": "गाड़ी चलाना",
        "cue": {
          "en": "to drive",
          "ko": "운전하기"
        },
        "gloss": {
          "en": "I'm slowly learning to drive.",
          "ko": "저는 차근차근 운전을 배우고 있어요."
        }
      },
      {
        "text": "मैं धीरे-धीरे टीम पर भरोसा करना सीख रहा हूँ।",
        "slot": "टीम पर भरोसा करना",
        "cue": {
          "en": "to trust the team",
          "ko": "팀을 믿기"
        },
        "gloss": {
          "en": "I'm slowly learning to trust the team.",
          "ko": "저는 차근차근 팀을 믿는 법을 배우고 있어요."
        }
      },
      {
        "text": "मैं धीरे-धीरे पैसे बचाना सीख रहा हूँ।",
        "slot": "पैसे बचाना",
        "cue": {
          "en": "to save money",
          "ko": "돈 모으기"
        },
        "gloss": {
          "en": "I'm slowly learning to save money.",
          "ko": "저는 차근차근 돈 모으는 법을 배우고 있어요."
        }
      }
    ]
  },
  {
    "id": "hi-f5-16",
    "stage": 5,
    "fn": "idiom-react",
    "pattern": "___ देखकर मुँह में पानी आ गया।",
    "core": [
      "मुँह में पानी आ गया"
    ],
    "meaning": {
      "en": "Idiom for craving food: Seeing ___ made my mouth water.",
      "ko": "관용구로 반응하기: ~를 보니 군침이 돌았어요."
    },
    "grammar": [],
    "expressions": [
      "मुँह में पानी आ गया"
    ],
    "examples": [
      {
        "text": "गरम जलेबियाँ देखकर मुँह में पानी आ गया।",
        "slot": "गरम जलेबियाँ",
        "cue": {
          "en": "hot jalebis",
          "ko": "따뜻한 잘레비"
        },
        "gloss": {
          "en": "Seeing the hot jalebis made my mouth water.",
          "ko": "따끈한 잘레비를 보니 군침이 돌았어요."
        }
      },
      {
        "text": "माँ के हाथ के पराठे देखकर मुँह में पानी आ गया।",
        "slot": "माँ के हाथ के पराठे",
        "cue": {
          "en": "mum's homemade parathas",
          "ko": "엄마가 만든 파라타"
        },
        "gloss": {
          "en": "Seeing mum's parathas made my mouth water.",
          "ko": "엄마가 만든 파라타를 보니 군침이 돌았어요."
        }
      },
      {
        "text": "चाट की दुकान देखकर मुँह में पानी आ गया।",
        "slot": "चाट की दुकान",
        "cue": {
          "en": "the chaat stall",
          "ko": "차트 가게"
        },
        "gloss": {
          "en": "Seeing the chaat stall made my mouth water.",
          "ko": "차트 가게를 보니 군침이 돌았어요."
        }
      },
      {
        "text": "मेज़ पर रखी बिरयानी देखकर मुँह में पानी आ गया।",
        "slot": "मेज़ पर रखी बिरयानी",
        "cue": {
          "en": "the biryani on the table",
          "ko": "식탁 위의 비리야니"
        },
        "gloss": {
          "en": "Seeing the biryani on the table made my mouth water.",
          "ko": "식탁 위 비리야니를 보니 군침이 돌았어요."
        }
      }
    ]
  },
  {
    "id": "hi-f5-17",
    "stage": 5,
    "fn": "read-between",
    "pattern": "___, दाल में कुछ काला है।",
    "core": [
      "दाल में कुछ काला है"
    ],
    "meaning": {
      "en": "Idiom for suspicion: ___ — something's fishy.",
      "ko": "관용구로 수상함 말하기: ~, 뭔가 구린 데가 있어요."
    },
    "grammar": [],
    "expressions": [
      "दाल में कुछ काला है"
    ],
    "examples": [
      {
        "text": "वह हर सवाल टाल रहा है, दाल में कुछ काला है।",
        "slot": "वह हर सवाल टाल रहा है",
        "cue": {
          "en": "he's dodging every question",
          "ko": "그가 질문마다 피한다"
        },
        "gloss": {
          "en": "He's dodging every question — something's fishy.",
          "ko": "저 사람이 질문을 다 피하네요, 뭔가 구린 데가 있어요."
        }
      },
      {
        "text": "दफ़्तर अचानक बंद है, दाल में कुछ काला है।",
        "slot": "दफ़्तर अचानक बंद है",
        "cue": {
          "en": "the office is suddenly shut",
          "ko": "사무실이 갑자기 닫혔다"
        },
        "gloss": {
          "en": "The office is suddenly shut — something's fishy.",
          "ko": "사무실이 갑자기 닫혔네요, 뭔가 수상해요."
        }
      },
      {
        "text": "वे बार-बार कहानी बदल रहे हैं, दाल में कुछ काला है।",
        "slot": "वे बार-बार कहानी बदल रहे हैं",
        "cue": {
          "en": "they keep changing their story",
          "ko": "그들이 자꾸 말을 바꾼다"
        },
        "gloss": {
          "en": "They keep changing their story — something's fishy.",
          "ko": "자꾸 말을 바꾸네요, 뭔가 구린 데가 있어요."
        }
      },
      {
        "text": "सब अचानक चुप हो गए, दाल में कुछ काला है।",
        "slot": "सब अचानक चुप हो गए",
        "cue": {
          "en": "everyone suddenly went quiet",
          "ko": "모두 갑자기 조용해졌다"
        },
        "gloss": {
          "en": "Everyone suddenly went quiet — something's fishy.",
          "ko": "다들 갑자기 조용해졌네요, 뭔가 수상해요."
        }
      }
    ]
  },
  {
    "id": "hi-f5-18",
    "stage": 5,
    "fn": "idiom-react",
    "pattern": "___ के लिए यह तो ऊँट के मुँह में ज़ीरा है।",
    "core": [
      "ऊँट के मुँह में ज़ीरा"
    ],
    "meaning": {
      "en": "Idiom for 'a drop in the ocean': For ___ this is next to nothing.",
      "ko": "관용구로 반응하기: ~에 비하면 이건 새 발의 피예요."
    },
    "grammar": [],
    "expressions": [
      "ऊँट के मुँह में ज़ीरा"
    ],
    "examples": [
      {
        "text": "इतने बड़े परिवार के लिए यह तो ऊँट के मुँह में ज़ीरा है।",
        "slot": "इतने बड़े परिवार",
        "cue": {
          "en": "such a big family",
          "ko": "이렇게 큰 가족"
        },
        "gloss": {
          "en": "For such a big family this is a drop in the ocean.",
          "ko": "이렇게 큰 식구한테 이건 새 발의 피예요."
        }
      },
      {
        "text": "इतनी मेहनत के लिए यह तो ऊँट के मुँह में ज़ीरा है।",
        "slot": "इतनी मेहनत",
        "cue": {
          "en": "so much hard work",
          "ko": "그 많은 수고"
        },
        "gloss": {
          "en": "For so much hard work this is next to nothing.",
          "ko": "그 고생에 비하면 이건 새 발의 피예요."
        }
      },
      {
        "text": "इस बड़े शहर के लिए यह तो ऊँट के मुँह में ज़ीरा है।",
        "slot": "इस बड़े शहर",
        "cue": {
          "en": "this big city",
          "ko": "이 큰 도시"
        },
        "gloss": {
          "en": "For this big city this is a drop in the ocean.",
          "ko": "이 큰 도시에 이건 새 발의 피예요."
        }
      },
      {
        "text": "इतने काम के लिए यह तो ऊँट के मुँह में ज़ीरा है।",
        "slot": "इतने काम",
        "cue": {
          "en": "this much work",
          "ko": "이렇게 많은 일"
        },
        "gloss": {
          "en": "For this much work it's next to nothing.",
          "ko": "이렇게 많은 일에 비하면 이건 새 발의 피예요."
        }
      }
    ]
  },
  {
    "id": "hi-f5-19",
    "stage": 5,
    "fn": "complain",
    "pattern": "___ सच में नाक में दम कर देता है।",
    "core": [
      "नाक में दम"
    ],
    "meaning": {
      "en": "Idiom for exasperation: ___ really drives me up the wall.",
      "ko": "관용구로 불평하기: ~ 때문에 정말 진절머리가 나요."
    },
    "grammar": [],
    "expressions": [
      "नाक में दम"
    ],
    "examples": [
      {
        "text": "पड़ोसी का कुत्ता सच में नाक में दम कर देता है।",
        "slot": "पड़ोसी का कुत्ता",
        "cue": {
          "en": "the neighbour's dog",
          "ko": "이웃집 개"
        },
        "gloss": {
          "en": "The neighbour's dog really drives me up the wall.",
          "ko": "이웃집 개 때문에 정말 진절머리가 나요."
        }
      },
      {
        "text": "रोज़ का ट्रैफ़िक सच में नाक में दम कर देता है।",
        "slot": "रोज़ का ट्रैफ़िक",
        "cue": {
          "en": "the daily traffic",
          "ko": "매일의 교통 체증"
        },
        "gloss": {
          "en": "The daily traffic really drives me up the wall.",
          "ko": "매일 막히는 길 때문에 정말 진절머리가 나요."
        }
      },
      {
        "text": "मेरा छोटा भाई सच में नाक में दम कर देता है।",
        "slot": "मेरा छोटा भाई",
        "cue": {
          "en": "my little brother",
          "ko": "내 남동생"
        },
        "gloss": {
          "en": "My little brother really drives me up the wall.",
          "ko": "남동생 때문에 정말 진절머리가 나요."
        }
      },
      {
        "text": "यह पुराना कंप्यूटर सच में नाक में दम कर देता है।",
        "slot": "यह पुराना कंप्यूटर",
        "cue": {
          "en": "this old computer",
          "ko": "이 낡은 컴퓨터"
        },
        "gloss": {
          "en": "This old computer really drives me up the wall.",
          "ko": "이 낡은 컴퓨터 때문에 정말 진절머리가 나요."
        }
      }
    ]
  },
  {
    "id": "hi-f5-20",
    "stage": 5,
    "fn": "storytelling",
    "pattern": "हम ___ से बाल-बाल बचे।",
    "core": [
      "बाल-बाल बचे"
    ],
    "meaning": {
      "en": "Telling a near miss (reduplication idiom): We narrowly escaped ___.",
      "ko": "아슬아슬했던 일 말하기: ~를 간발의 차로 피했어요."
    },
    "grammar": [
      6
    ],
    "expressions": [
      "बाल-बाल बचे"
    ],
    "examples": [
      {
        "text": "हम एक बड़े हादसे से बाल-बाल बचे।",
        "slot": "एक बड़े हादसे",
        "cue": {
          "en": "a big accident",
          "ko": "큰 사고"
        },
        "gloss": {
          "en": "We narrowly escaped a big accident.",
          "ko": "큰 사고를 간발의 차로 피했어요."
        }
      },
      {
        "text": "हम गिरने से बाल-बाल बचे।",
        "slot": "गिरने",
        "cue": {
          "en": "falling",
          "ko": "넘어지기"
        },
        "gloss": {
          "en": "We only just avoided falling.",
          "ko": "하마터면 넘어질 뻔했어요."
        }
      },
      {
        "text": "हम बारिश में फँसने से बाल-बाल बचे।",
        "slot": "बारिश में फँसने",
        "cue": {
          "en": "getting caught in the rain",
          "ko": "비에 갇히기"
        },
        "gloss": {
          "en": "We only just escaped getting caught in the rain.",
          "ko": "하마터면 비에 갇힐 뻔했어요."
        }
      },
      {
        "text": "हम ट्रेन छूटने से बाल-बाल बचे।",
        "slot": "ट्रेन छूटने",
        "cue": {
          "en": "missing the train",
          "ko": "기차를 놓치기"
        },
        "gloss": {
          "en": "We only just avoided missing the train.",
          "ko": "하마터면 기차를 놓칠 뻔했어요."
        }
      }
    ]
  }
];
