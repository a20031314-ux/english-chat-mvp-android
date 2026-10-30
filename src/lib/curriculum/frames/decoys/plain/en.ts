/** en 문장구조 오답 중 확실히 틀린 꼴(scripts/plain-decoys.mjs가 en.json에서 만듦). */
export const EN_PLAIN: Record<string, string[]> = {
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
    "Which ones is"
  ],
  "en-f2-10|which one is": [
    "which one are",
    "which ones is"
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
    "why"
  ],
  "en-f2-13|, so": [
    ", why"
  ],
  "en-f2-14|have breakfast": [
    "having breakfast",
    "have the breakfast"
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
    "Maybe after time",
    "Maybe other time"
  ],
  "en-f2-19|maybe next time": [
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
    "which"
  ],
  "en-f3-04|I'll call you back": [
    "I'll call back you",
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
  ],
  "en-f4-01|If I were": [
    "If I was being",
    "If I am",
    "If I would be"
  ],
  "en-f4-01|if I were": [
    "if I am",
    "if I would be",
    "if I will be"
  ],
  "en-f4-02|If I'd": [
    "If I would",
    "If I have",
    "If I'll"
  ],
  "en-f4-02|If we'd": [
    "If we would",
    "If we have",
    "If we'll"
  ],
  "en-f4-02|if he'd": [
    "if he would",
    "if he has",
    "if he'll"
  ],
  "en-f4-03|would have": [
    "would had",
    "will have",
    "would has"
  ],
  "en-f4-03|wouldn't have": [
    "wouldn't had",
    "won't have",
    "wouldn't has"
  ],
  "en-f4-04|By the time": [
    "By the moment",
    "Until the time",
    "In the time"
  ],
  "en-f4-04|by the time": [
    "by the moment",
    "until the time",
    "in the time"
  ],
  "en-f4-05|must have": [
    "must had",
    "must has",
    "must to have"
  ],
  "en-f4-06|can't have": [
    "can't had",
    "can't has",
    "don't can have"
  ],
  "en-f4-07|might have": [
    "might had",
    "might has",
    "might to have"
  ],
  "en-f4-08|I wish I'd": [
    "I wish I would",
    "I wish I have",
    "I wish I will"
  ],
  "en-f4-08|I wish I had": [
    "I wish I have",
    "I wish I would have",
    "I wish I has"
  ],
  "en-f4-09|should have": [
    "should had",
    "should has",
    "should to have"
  ],
  "en-f4-09|shouldn't have": [
    "shouldn't had",
    "shouldn't has",
    "shouldn't to have"
  ],
  "en-f4-10|There used to be": [
    "There use to be",
    "There was used to be",
    "There used to being"
  ],
  "en-f4-10|there used to be": [
    "there use to be",
    "there was used to be",
    "there used to being"
  ],
  "en-f4-11|I used to": [
    "I use to",
    "I was used to"
  ],
  "en-f4-11|We used to": [
    "We use to",
    "We were used to"
  ],
  "en-f4-12|not used to": [
    "not use to",
    "not used",
    "not using to"
  ],
  "en-f4-13|the point is": [
    "the point are",
    "the pointing is",
    "the point it is"
  ],
  "en-f4-14|That's a good point": [
    "That's a good points",
    "That's good point",
    "That's a well point"
  ],
  "en-f4-14|that's a good point": [
    "that's a good points",
    "that's good point",
    "that's a well point"
  ],
  "en-f4-15|On the other hand": [
    "On the other side",
    "In the other hand",
    "On other hand"
  ],
  "en-f4-15|on the other hand": [
    "on the other side",
    "in the other hand",
    "on other hand"
  ],
  "en-f4-16|To be fair": [
    "To be fairly",
    "For be fair",
    "To being fair"
  ],
  "en-f4-16|to be fair": [
    "to be fairly",
    "for be fair",
    "to being fair"
  ],
  "en-f4-17|Having said that": [
    "Have said that",
    "Having say that",
    "Having saying that"
  ],
  "en-f4-17|having said that": [
    "have said that",
    "having say that",
    "having saying that"
  ],
  "en-f4-18|make a decision": [
    "do a decision",
    "make a decide",
    "make decision"
  ],
  "en-f4-19|meet halfway": [
    "meet half",
    "meet in halfway",
    "meet the halfway"
  ],
  "en-f4-20|When it comes to": [
    "When it come to",
    "When it comes for",
    "When it coming to"
  ],
  "en-f4-20|when it comes to": [
    "when it come to",
    "when it comes for",
    "when it coming to"
  ],
  "en-f5-01|If I hadn't": [
    "If I didn't",
    "If I haven't",
    "If I wouldn't have"
  ],
  "en-f5-01|if I hadn't": [
    "if I didn't",
    "if I haven't",
    "if I wouldn't have"
  ],
  "en-f5-02|Had I": [
    "Have I",
    "If had I",
    "Did I"
  ],
  "en-f5-02|had I": [
    "have I",
    "if had I",
    "did I"
  ],
  "en-f5-03|What bothers me is": [
    "What bothers me are",
    "What it bothers me is",
    "That bothers me is"
  ],
  "en-f5-03|what bothers me is": [
    "what bothers me are",
    "what it bothers me is",
    "that bothers me is"
  ],
  "en-f5-04|Not once did": [
    "Not once he did",
    "Not one did"
  ],
  "en-f5-04|not once did": [
    "not once he did",
    "not one did"
  ],
  "en-f5-05|Not knowing": [
    "Don't knowing",
    "Not know",
    "No knowing"
  ],
  "en-f5-05|not knowing": [
    "don't knowing",
    "not know",
    "no knowing"
  ],
  "en-f5-06|Having": [
    "Have",
    "Had",
    "Being"
  ],
  "en-f5-06|having": [
    "have",
    "had",
    "being"
  ],
  "en-f5-07|It seems to me that": [
    "It seems me that",
    "It's seems to me that",
    "It seems for me that"
  ],
  "en-f5-07|it seems to me that": [
    "it seems me that",
    "it's seems to me that",
    "it seems for me that"
  ],
  "en-f5-08|It would appear that": [
    "It would appears that",
    "It would appearing that",
    "It would be appear that"
  ],
  "en-f5-08|it would appear that": [
    "it would appears that",
    "it would appearing that",
    "it would be appear that"
  ],
  "en-f5-09|I'd suggest": [
    "I'd suggest to",
    "I'd suggesting",
    "I'd suggests"
  ],
  "en-f5-10|Admittedly": [
    "Admitted",
    "Admittingly",
    "Admit"
  ],
  "en-f5-10|admittedly": [
    "admitted",
    "admittingly",
    "admit"
  ],
  "en-f5-11|Even so": [
    "Even though",
    "Even if",
    "Even that"
  ],
  "en-f5-11|even so": [
    "even though",
    "even if",
    "even that"
  ],
  "en-f5-12|Although": [
    "Despite",
    "In spite",
    "Although that"
  ],
  "en-f5-12|although": [
    "despite",
    "in spite",
    "although that"
  ],
  "en-f5-13|decision to": [
    "decision of",
    "decision for",
    "decide to"
  ],
  "en-f5-14|delay in": [
    "delay on",
    "delay at"
  ],
  "en-f5-15|With all due respect": [
    "With all the due respect",
    "With all due respects",
    "With all respect due to"
  ],
  "en-f5-15|with all due respect": [
    "with all the due respect",
    "with all due respects",
    "with all respect due to"
  ],
  "en-f5-16|The bottom line is": [
    "The bottom line are",
    "The bottom lines is",
    "The bottom of line is"
  ],
  "en-f5-16|the bottom line is": [
    "the bottom line are",
    "the bottom lines is",
    "the bottom of line is"
  ],
  "en-f5-17|Bear in mind": [
    "Bear on mind",
    "Keep in the mind",
    "Bear in the mind"
  ],
  "en-f5-17|bear in mind": [
    "bear on mind",
    "keep in the mind",
    "bear in the mind"
  ],
  "en-f5-18|Be that as it may": [
    "Be that as it might",
    "Being that as it may",
    "Be that like it may"
  ],
  "en-f5-18|be that as it may": [
    "be that as it might",
    "being that as it may",
    "be that like it may"
  ]
};
