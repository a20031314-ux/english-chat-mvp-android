/**
 * it 단계 핵심 표현마다 헷갈리는 오답(2026-10-30, scripts/expr-decoys.ts) — 표현 → 살짝 틀린 꼴. Claude가 씀, 원어민 확인 전.
 */
export const IT_EXPR_DECOYS: Record<string, string[]> = {
  "piacere": [],
  "ciao": [],
  "buongiorno": [
    "buona giorno",
    "buono giorno",
    "buon giornata"
  ],
  "buonasera": [
    "buono sera",
    "buon sera"
  ],
  "arrivederci": [
    "arrivedere"
  ],
  "a presto": [
    "al presto",
    "in presto"
  ],
  "grazie": [
    "grazia"
  ],
  "prego": [
    "prega"
  ],
  "scusi": [
    "scuso",
    "scusare"
  ],
  "per favore": [
    "per favori",
    "da favore"
  ],
  "mi chiamo": [
    "mi chiama",
    "io chiamo",
    "me chiamo"
  ],
  "sono di": [
    "sono da",
    "sono a"
  ],
  "quanto costa": [
    "quanto costo",
    "quanta costa",
    "quanto è costa"
  ],
  "lo prendo": [
    "lo prende",
    "gli prendo",
    "prendo lo"
  ],
  "dov'è il bagno": [
    "dove il bagno",
    "dov'è la bagno",
    "dove sono il bagno"
  ],
  "non capisco": [
    "no capisco",
    "non capisce",
    "non capito"
  ],
  "può ripetere": [
    "può ripeto",
    "posso ripetere",
    "può a ripetere"
  ],
  "un attimo": [
    "una attimo",
    "un'attimo",
    "in attimo"
  ],
  "va bene": [
    "va buono"
  ],
  "certo": [],
  "come stai": [
    "come sei",
    "come stare"
  ],
  "tutto bene": [
    "tutti bene",
    "tutto buono",
    "tutta bene"
  ],
  "che fai stasera": [
    "che fare stasera",
    "chi fai stasera",
    "che faci stasera"
  ],
  "ci vediamo": [
    "si vediamo",
    "ci vedemo",
    "ci vedono"
  ],
  "a che ora": [
    "in che ora",
    "a che ore",
    "alle che ora"
  ],
  "volentieri": [
    "volentiere"
  ],
  "che peccato": [
    "che peccata",
    "quale peccato"
  ],
  "davvero": [
    "da vero",
    "di vero"
  ],
  "che bello": [
    "come bello",
    "che bene"
  ],
  "mi piacerebbe": [
    "mi piacerei",
    "io piacerebbe"
  ],
  "cosa mi consiglia": [
    "cosa mi consiglio",
    "cosa me consiglia"
  ],
  "il conto": [
    "la conto",
    "lo conto"
  ],
  "posso fare una foto": [
    "posso fare un foto",
    "posso faccio una foto"
  ],
  "mi fa male la testa": [
    "mi fa male il testa",
    "mi fanno male la testa",
    "ho male la testa"
  ],
  "mi sono perso": [
    "mi ho perso",
    "ho perso me",
    "mi sono perdito"
  ],
  "non ancora": [
    "non già",
    "no ancora"
  ],
  "ho già finito": [
    "sono già finito",
    "ho già finisco",
    "ho già finita"
  ],
  "buon appetito": [
    "buono appetito",
    "buona appetito"
  ],
  "in bocca al lupo": [
    "in bocca del lupo",
    "nella bocca al lupo",
    "in bocca a lupo"
  ],
  "a domani": [
    "al domani",
    "in domani"
  ],
  "d'accordo": [
    "di accordo",
    "d'accorda"
  ],
  "insomma": [
    "in somma"
  ],
  "infatti": [
    "in fatti"
  ],
  "comunque": [],
  "allora": [
    "all'ora"
  ],
  "magari": [],
  "per fortuna": [
    "per fortune",
    "con fortuna",
    "da fortuna"
  ],
  "purtroppo": [
    "per troppo"
  ],
  "pazienza": [],
  "dai": [],
  "boh": [],
  "scusa il ritardo": [
    "scusa la ritardo",
    "scuso il ritardo",
    "scusa il ritardato"
  ],
  "non ti preoccupare": [
    "non ti preoccupi",
    "non te preoccupare",
    "no ti preoccupare"
  ],
  "non fa niente": [
    "non fai niente",
    "no fa niente"
  ],
  "se ti va": [
    "si ti va",
    "se te va",
    "se tu va"
  ],
  "ci penso": [
    "ci pensa",
    "ne penso"
  ],
  "meno male": [
    "meno malo",
    "meno mala"
  ],
  "che casino": [
    "che casina",
    "che casinò",
    "come casino"
  ],
  "sul serio": [
    "su serio",
    "sul seria",
    "al serio"
  ],
  "ce l'ho fatta": [
    "ce l'ho fatto",
    "ci l'ho fatta",
    "ce l'ha fatta"
  ],
  "non vedo l'ora": [
    "non vedo l'ore",
    "non vedo ora",
    "non guardo l'ora"
  ],
  "ho capito": [
    "sono capito",
    "ho capisco",
    "ho capita"
  ],
  "secondo me": [
    "secondo mi",
    "secondo a me",
    "secondo io"
  ],
  "dipende": [
    "dipendo",
    "dipenda"
  ],
  "hai ragione": [
    "hai ragioni",
    "sei ragione",
    "hai la ragione"
  ],
  "non sono d'accordo": [
    "non sono di accordo",
    "non ho d'accordo",
    "non sono d'accorda"
  ],
  "in realtà": [
    "a realtà",
    "in reale"
  ],
  "da un lato": [
    "dal un lato",
    "da una lato",
    "di un lato"
  ],
  "dall'altro": [
    "dal altro",
    "del altro",
    "dall'altri"
  ],
  "il punto è": [
    "il punto sono",
    "la punto è",
    "il punto ha"
  ],
  "tra l'altro": [
    "tra l'altra",
    "tra altro",
    "tra gli altro"
  ],
  "mi spiego": [
    "mi spiega",
    "me spiego",
    "io spiego"
  ],
  "non mi sembra": [
    "non mi sembro",
    "non me sembra",
    "non mi sembri"
  ],
  "vale la pena": [
    "vale il pena",
    "vale la pene",
    "valere la pena"
  ],
  "ne parliamo": [
    "ne parlamo",
    "lo parliamo",
    "ne parliate"
  ],
  "sarebbe meglio": [
    "sarebbe migliore",
    "sarebbe più meglio",
    "sarei meglio"
  ],
  "mi dispiace": [
    "mi dispiaccio",
    "mi dispiacci",
    "io dispiace"
  ],
  "a proposito": [
    "a proposta",
    "di proposito",
    "a propositi"
  ],
  "per quanto riguarda": [
    "per quanto riguardo",
    "per quanti riguarda",
    "da quanto riguarda"
  ],
  "ti faccio sapere": [
    "ti fai sapere",
    "ti faccio di sapere"
  ],
  "in ogni caso": [
    "in ogni casa",
    "in ogni casi",
    "a ogni caso"
  ],
  "a dire il vero": [
    "a dire la vero",
    "al dire il vero",
    "a dico il vero"
  ],
  "ci mancherebbe": [
    "ci mancherei",
    "si mancherebbe",
    "ci mancheremmo"
  ],
  "figurati": [
    "figurate",
    "figurato"
  ],
  "non è che": [
    "non è chi",
    "non ha che",
    "non è cosa"
  ],
  "a dirla tutta": [
    "a dirlo tutta",
    "a dirla tutto",
    "di dirla tutta"
  ],
  "tutto sommato": [
    "tutto sommata",
    "tutti sommato"
  ],
  "per carità": [
    "con carità"
  ],
  "mettiamola così": [
    "mettiamolo così",
    "mettiamola come",
    "mettemola così"
  ],
  "non ci piove": [
    "non ci piova",
    "non si piove",
    "non ci piovono"
  ],
  "acqua in bocca": [
    "acqua nella bocca",
    "acqua a bocca",
    "acque in bocca"
  ],
  "costa un occhio della testa": [
    "costa un occhio dalla testa",
    "costa un occhi della testa",
    "costa una occhio della testa"
  ],
  "in quattro e quattr'otto": [
    "in quattro e quattro otto",
    "a quattro e quattr'otto",
    "in quattro o quattr'otto"
  ],
  "non me la sento": [
    "non mi la sento",
    "non me lo sento",
    "non me la sente"
  ],
  "se non sbaglio": [
    "se no sbaglio",
    "se non sbaglia",
    "se non sbagliamo"
  ],
  "con tutto il rispetto": [
    "con tutta il rispetto",
    "con tutti il rispetto",
    "per tutto il rispetto"
  ],
  "a quanto pare": [
    "a quanto paio",
    "a quanto para",
    "in quanto pare"
  ],
  "lasciamo perdere": [
    "lasciamo perduto",
    "lasciamo perdiamo",
    "lasciamo a perdere"
  ],
  "chi l'avrebbe detto": [
    "chi l'avrebbe detta",
    "chi l'avrei detto",
    "che l'avrebbe detto"
  ],
  "mi sa che": [
    "mi sa di",
    "mi sai che",
    "me sa che"
  ],
  "senza dubbio": [
    "senza il dubbio",
    "senza dubbia"
  ],
  "fammi capire": [
    "fami capire",
    "fammi capisco",
    "fammi a capire"
  ]
};
