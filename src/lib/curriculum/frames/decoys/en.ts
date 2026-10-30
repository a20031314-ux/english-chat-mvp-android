/**
 * en 문장구조 조각마다 헷갈리는 오답(2026-10-30, scripts/frame-decoys.ts) — "틀 id|조각" → 살짝 틀린 꼴. Claude가 씀, 원어민 확인 전.
 */
export const EN_DECOYS: Record<string, string[]> = {
  "en-f1-01|My name is": [
    "My name are",
    "Me name is",
    "My name's is"
  ],
  "en-f1-01|my name is": [
    "my name are",
    "me name is",
    "my name's is"
  ],
  "en-f1-02|I'm from": [
    "I from",
    "I'm come from",
    "Me from"
  ],
  "en-f1-03|I'm a": [
    "I a",
    "I'm is a",
    "I is a"
  ],
  "en-f1-03|I'm an": [
    "I an",
    "I'm one",
    "I is an"
  ],
  "en-f1-04|I work at": [
    "I works at",
    "I working at",
    "I work to"
  ],
  "en-f1-04|works at": [
    "is work at",
    "working at",
    "works to"
  ],
  "en-f1-05|How much is": [
    "How many is",
    "How much are",
    "How much it is"
  ],
  "en-f1-05|how much is": [
    "how many is",
    "how much are",
    "how much it is"
  ],
  "en-f1-06|Can I have": [
    "Can I has",
    "Can me have",
    "Can I to have"
  ],
  "en-f1-06|can I have": [
    "can I has",
    "can me have",
    "can I to have"
  ],
  "en-f1-07|Where is": [
    "Where are",
    "Where it is",
    "Where does"
  ],
  "en-f1-07|where is": [
    "where are",
    "where it is",
    "where does"
  ],
  "en-f1-08|next to": [
    "next of",
    "next at",
    "next from"
  ],
  "en-f1-09|I like": [
    "Me like",
    "I am like",
    "I liking"
  ],
  "en-f1-10|I don't": [
    "I doesn't",
    "I not",
    "I no"
  ],
  "en-f1-11|I can": [
    "Me can",
    "I am can",
    "I'm can"
  ],
  "en-f1-12|I can't": [
    "I don't can",
    "I not can",
    "Me can't"
  ],
  "en-f1-13|Can you": [
    "Do you can",
    "Are you can",
    "Can to you"
  ],
  "en-f1-13|can you": [
    "do you can",
    "are you can",
    "can to you"
  ],
  "en-f1-14|get up at": [
    "get up in",
    "getting up at",
    "get at up"
  ],
  "en-f1-14|gets up at": [
    "gets up in",
    "getting up at",
    "gets at up"
  ],
  "en-f1-15|Do you have": [
    "Does you have",
    "Do you has",
    "Are you have"
  ],
  "en-f1-15|do you have": [
    "does you have",
    "do you has",
    "are you have"
  ],
  "en-f1-16|See you": [
    "Saw you",
    "Look you",
    "Sees you"
  ],
  "en-f1-16|see you": [
    "saw you",
    "look you",
    "sees you"
  ],
  "en-f1-17|I'd like": [
    "I'd to like",
    "I'm like",
    "I'll like"
  ],
  "en-f1-18|I have": [
    "I has",
    "I am have",
    "Me have"
  ],
  "en-f1-19|What time is": [
    "What time are",
    "What time it is",
    "What time does"
  ],
  "en-f1-19|what time is": [
    "what time are",
    "what time it is",
    "what time does"
  ],
  "en-f2-01|Last night": [
    "Yesterday night",
    "Past night",
    "Before night"
  ],
  "en-f2-01|last night": [
    "yesterday night",
    "past night",
    "before night"
  ],
  "en-f2-02|How was your": [
    "How were your",
    "How your was",
    "How did your"
  ],
  "en-f2-02|how was your": [
    "how were your",
    "how your was",
    "how did your"
  ],
  "en-f2-03|It was": [
    "It were",
    "It's was",
    "It been"
  ],
  "en-f2-03|it was": [
    "it were",
    "it's was",
    "it been"
  ],
  "en-f2-04|right now": [
    "now right",
    "in now",
    "at now"
  ],
  "en-f2-05|going to": [
    "go to",
    "going for",
    "goes to"
  ],
  "en-f2-06|I'm meeting": [
    "I meeting",
    "I am meet",
    "I'm met"
  ],
  "en-f2-07|Are you free on": [
    "Is you free on",
    "Are you free of",
    "Do you free on"
  ],
  "en-f2-07|are you free on": [
    "is you free on",
    "are you free of",
    "do you free on"
  ],
  "en-f2-08|Let's meet at": [
    "Let's meet on",
    "Let's meeting at",
    "Let's to meet at"
  ],
  "en-f2-08|let's meet at": [
    "let's meet on",
    "let's meeting at",
    "let's to meet at"
  ],
  "en-f2-09|than": [
    "then",
    "as",
    "from"
  ],
  "en-f2-10|Which one is": [
    "Which one are",
    "Which ones is",
    "Which one does"
  ],
  "en-f2-10|which one is": [
    "which one are",
    "which ones is",
    "which one does"
  ],
  "en-f2-11|Can I get": [
    "Can I got",
    "Can me get",
    "Can I to get"
  ],
  "en-f2-11|can I get": [
    "can I got",
    "can me get",
    "can I to get"
  ],
  "en-f2-12|because": [
    "so",
    "why",
    "although"
  ],
  "en-f2-13|, so": [
    ", because",
    ", why",
    ", although"
  ],
  "en-f2-14|have breakfast": [
    "having breakfast",
    "have the breakfast",
    "do breakfast"
  ],
  "en-f2-14|has breakfast": [
    "haves breakfast",
    "has the breakfast",
    "is have breakfast"
  ],
  "en-f2-15|any": [
    "much",
    "every",
    "one"
  ],
  "en-f2-16|much": [
    "lot",
    "a lot",
    "plenty"
  ],
  "en-f2-16|many": [
    "lot",
    "a lot",
    "plenty"
  ],
  "en-f2-17|Is this": [
    "Is these",
    "Are this",
    "Does this"
  ],
  "en-f2-17|is this": [
    "is these",
    "are this",
    "does this"
  ],
  "en-f2-18|How long does it take": [
    "How long do it take",
    "How long does it took",
    "How long is it take"
  ],
  "en-f2-18|how long does it take": [
    "how long do it take",
    "how long does it took",
    "how long is it take"
  ],
  "en-f2-19|Maybe next time": [
    "Maybe last time",
    "Maybe after time",
    "Maybe other time"
  ],
  "en-f2-19|maybe next time": [
    "maybe last time",
    "maybe after time",
    "maybe other time"
  ],
  "en-f3-01|Have you ever": [
    "Did you ever",
    "Has you ever",
    "Are you ever"
  ],
  "en-f3-01|have you ever": [
    "did you ever",
    "has you ever",
    "are you ever"
  ],
  "en-f3-02|I've never": [
    "I've ever",
    "I'm never",
    "I've no"
  ],
  "en-f3-02|I have never": [
    "I has never",
    "I have ever",
    "I am never"
  ],
  "en-f3-03|when it happened": [
    "when it happens",
    "when it was happen",
    "when happened"
  ],
  "en-f3-03|when": [
    "what",
    "if",
    "which"
  ],
  "en-f3-04|I'll call you back": [
    "I'll call back you",
    "I'd call you back",
    "I'll calling you back"
  ],
  "en-f3-04|If it": [
    "If is",
    "If they",
    "Is it"
  ],
  "en-f3-04|if it": [
    "if is",
    "if they",
    "is it"
  ],
  "en-f3-05|You should": [
    "You are should",
    "Your should",
    "You do should"
  ],
  "en-f3-05|you should": [
    "you are should",
    "your should",
    "you do should"
  ],
  "en-f3-06|have to": [
    "must to",
    "having to",
    "have for"
  ],
  "en-f3-06|has to": [
    "haves to",
    "has for",
    "must to"
  ],
  "en-f3-06|had to": [
    "had for",
    "haded to",
    "hads to"
  ],
  "en-f3-07|decided to": [
    "decided for",
    "deciding to",
    "decided of"
  ],
  "en-f3-08|worth trying": [
    "worth to try",
    "worthy trying",
    "worth tried"
  ],
  "en-f3-09|who": [
    "which",
    "what",
    "how"
  ],
  "en-f3-09|where": [
    "which",
    "what",
    "there"
  ],
  "en-f3-10|was sent to": [
    "was send to",
    "were sent to",
    "was sent at"
  ],
  "en-f3-11|so": [
    "very",
    "too",
    "much"
  ],
  "en-f3-11|such a": [
    "a such",
    "so a",
    "such the"
  ],
  "en-f3-12|felt really": [
    "feeled really",
    "feeling really",
    "fell really"
  ],
  "en-f3-12|felt so": [
    "feeled so",
    "feeling so",
    "felt such"
  ],
  "en-f3-13|get back to me": [
    "get back me",
    "get back for me",
    "get to back me"
  ],
  "en-f3-14|told me": [
    "said me",
    "told to me",
    "talked me"
  ],
  "en-f3-14|was told": [
    "was said",
    "was telled",
    "were told"
  ],
  "en-f3-15|said it would": [
    "said it wills",
    "said would",
    "said it was"
  ],
  "en-f3-15|said": [
    "told",
    "talked",
    "sayed"
  ],
  "en-f3-16|Let me know": [
    "Let me to know",
    "Let I know",
    "Make me know"
  ],
  "en-f3-16|let me know": [
    "let me to know",
    "let I know",
    "make me know"
  ],
  "en-f3-17|What do you mean": [
    "What are you mean",
    "What does you mean",
    "What do mean you"
  ],
  "en-f3-17|what do you mean": [
    "what are you mean",
    "what does you mean",
    "what do mean you"
  ],
  "en-f3-18|To be honest": [
    "To being honest",
    "For be honest",
    "To am honest"
  ],
  "en-f3-18|to be honest": [
    "to being honest",
    "for be honest",
    "to am honest"
  ],
  "en-f3-19|Make sure": [
    "Do sure",
    "Make to sure",
    "Make you sure"
  ],
  "en-f3-19|make sure": [
    "do sure",
    "make to sure",
    "make you sure"
  ],
  "en-f3-20|It turned out": [
    "It turn out",
    "It was turned out",
    "It turned off"
  ],
  "en-f3-20|it turned out": [
    "it turn out",
    "it was turned out",
    "it turned off"
  ]
};
