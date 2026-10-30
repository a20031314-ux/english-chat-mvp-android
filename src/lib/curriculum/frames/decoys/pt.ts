/**
 * pt 문장구조 조각마다 헷갈리는 오답(2026-10-30, scripts/frame-decoys.ts) — "틀 id|조각" → 살짝 틀린 꼴. Claude가 씀, 원어민 확인 전.
 */
export const PT_DECOYS: Record<string, string[]> = {
  "pt-f1-01|Meu nome é": [
    "Minha nome é",
    "Meu nome está",
    "Meu nome sou"
  ],
  "pt-f1-01|meu nome é": [
    "minha nome é",
    "meu nome está",
    "meu nome sou"
  ],
  "pt-f1-02|Sou de": [
    "Estou de",
    "Sou em",
    "Sou a"
  ],
  "pt-f1-02|sou de": [
    "estou de",
    "sou em",
    "sou a"
  ],
  "pt-f1-03|trabalho em": [
    "trabalho no",
    "trabalho a",
    "trabalhos em"
  ],
  "pt-f1-03|Trabalho em": [
    "Trabalho no",
    "Trabalho a",
    "Trabalhos em"
  ],
  "pt-f1-04|Estou em": [
    "Sou em",
    "Estou no",
    "Estou a"
  ],
  "pt-f1-04|estou em": [
    "sou em",
    "estou no",
    "estou a"
  ],
  "pt-f1-05|Estou": [
    "Tenho",
    "Estoy",
    "Estar"
  ],
  "pt-f1-05|estou": [
    "tenho",
    "estoy",
    "estar"
  ],
  "pt-f1-06|Onde fica": [
    "Onde fico",
    "Onde fique",
    "Onde faz"
  ],
  "pt-f1-06|onde fica": [
    "onde fico",
    "onde fique",
    "onde faz"
  ],
  "pt-f1-07|Quanto custa": [
    "Quanto custo",
    "Quantos custa",
    "Quanto costa"
  ],
  "pt-f1-07|quanto custa": [
    "quanto custo",
    "quantos custa",
    "quanto costa"
  ],
  "pt-f1-08|quero": [
    "quiero",
    "queiro",
    "querer"
  ],
  "pt-f1-08|Quero": [
    "Quiero",
    "Queiro",
    "Querer"
  ],
  "pt-f1-09|Me vê um": [
    "Mim vê um",
    "Me ver um",
    "Me vê a"
  ],
  "pt-f1-09|me vê um": [
    "mim vê um",
    "me ver um",
    "me vê a"
  ],
  "pt-f1-10|Você tem": [
    "Você tenho",
    "Você há",
    "Você está"
  ],
  "pt-f1-10|você tem": [
    "você tenho",
    "você há",
    "você está"
  ],
  "pt-f1-11|tenho": [
    "tengo",
    "estou",
    "hei"
  ],
  "pt-f1-11|Tenho": [
    "Tengo",
    "Estou",
    "Hei"
  ],
  "pt-f1-12|não falo": [
    "falo não",
    "não digo",
    "não falar"
  ],
  "pt-f1-12|Não falo": [
    "Falo não",
    "Não digo",
    "Não falar"
  ],
  "pt-f1-13|moro em": [
    "moro a",
    "moro de",
    "morro em"
  ],
  "pt-f1-13|Moro em": [
    "Moro a",
    "Moro de",
    "Morro em"
  ],
  "pt-f1-13|moro no": [
    "moro o",
    "moro do",
    "morro no"
  ],
  "pt-f1-13|moro na": [
    "moro à",
    "moro da",
    "morro na"
  ],
  "pt-f1-14|O que é": [
    "O que está",
    "O qual é",
    "O que são"
  ],
  "pt-f1-14|o que é": [
    "o que está",
    "o qual é",
    "o que são"
  ],
  "pt-f1-15|Pode": [
    "Puede",
    "Pede",
    "Posso"
  ],
  "pt-f1-15|pode": [
    "puede",
    "pede",
    "posso"
  ],
  "pt-f1-16|tudo bem": [
    "todo bem",
    "tudo é bem",
    "tudo bens"
  ],
  "pt-f1-16|Tudo bem": [
    "Todo bem",
    "Tudo é bem",
    "Tudo bens"
  ],
  "pt-f1-17|é muito boa": [
    "é muito bom",
    "é muita boa",
    "é muito bem"
  ],
  "pt-f1-18|Tchau": [
    "Oi",
    "Olá",
    "Chao"
  ],
  "pt-f1-18|tchau": [
    "oi",
    "olá",
    "chao"
  ],
  "pt-f2-01|Ontem eu": [
    "Amanhã eu",
    "Ontem me",
    "Ontem mim"
  ],
  "pt-f2-01|ontem eu": [
    "amanhã eu",
    "ontem me",
    "ontem mim"
  ],
  "pt-f2-02|fui": [
    "foi",
    "fiz",
    "fue"
  ],
  "pt-f2-02|Fui": [
    "Foi",
    "Fiz",
    "Fue"
  ],
  "pt-f2-03|Vou": [
    "Voy",
    "Voo",
    "Estou"
  ],
  "pt-f2-03|vou": [
    "voy",
    "voo",
    "estou"
  ],
  "pt-f2-04|Estou": [
    "Sou",
    "Tenho",
    "Estar"
  ],
  "pt-f2-04|estou": [
    "sou",
    "tenho",
    "estar"
  ],
  "pt-f2-05|gosto de": [
    "gosto a",
    "gosto em",
    "gusto de"
  ],
  "pt-f2-05|Gosto de": [
    "Gosto a",
    "Gosto em",
    "Gusto de"
  ],
  "pt-f2-05|gosto muito de": [
    "gosto muito a",
    "gosto muita de",
    "gosto muito em"
  ],
  "pt-f2-05|Gosto muito de": [
    "Gosto muito a",
    "Gosto muita de",
    "Gosto muito em"
  ],
  "pt-f2-05|gosto mais de": [
    "gosto mais a",
    "gosto mas de",
    "gosto mais em"
  ],
  "pt-f2-06|Não gosto": [
    "Gosto não",
    "Não me gosto",
    "Não gusto"
  ],
  "pt-f2-06|não gosto": [
    "gosto não",
    "não me gosto",
    "não gusto"
  ],
  "pt-f2-07|mais": [
    "mas",
    "muito",
    "maior"
  ],
  "pt-f2-07|do que": [
    "de que",
    "como",
    "que do"
  ],
  "pt-f2-08|faz": [
    "desde",
    "faço",
    "fez"
  ],
  "pt-f2-08|Faz": [
    "Desde",
    "Faço",
    "Fez"
  ],
  "pt-f2-09|há": [
    "à",
    "atrás",
    "desde"
  ],
  "pt-f2-10|Estou com dor de": [
    "Estou com dor da",
    "Tenho com dor de",
    "Estou dor de"
  ],
  "pt-f2-10|estou com dor de": [
    "estou com dor da",
    "tenho com dor de",
    "estou dor de"
  ],
  "pt-f2-11|Tem remédio para": [
    "Tem remédio por",
    "Tem medicina para",
    "Está remédio para"
  ],
  "pt-f2-11|tem remédio para": [
    "tem remédio por",
    "tem medicina para",
    "está remédio para"
  ],
  "pt-f2-12|A que horas": [
    "Em que horas",
    "A qual horas",
    "Às que horas"
  ],
  "pt-f2-12|a que horas": [
    "em que horas",
    "a qual horas",
    "às que horas"
  ],
  "pt-f2-13|Quanto tempo leva": [
    "Quanto tempo levo",
    "Quantos tempo leva",
    "Quanto tempo toma"
  ],
  "pt-f2-13|quanto tempo leva": [
    "quanto tempo levo",
    "quantos tempo leva",
    "quanto tempo toma"
  ],
  "pt-f2-14|Vamos": [
    "Somos",
    "Estamos",
    "Ir"
  ],
  "pt-f2-14|vamos": [
    "somos",
    "estamos",
    "ir"
  ],
  "pt-f2-15|Pode ser": [
    "Posso ser",
    "Pode é",
    "Pode seja"
  ],
  "pt-f2-15|pode ser": [
    "posso ser",
    "pode é",
    "pode seja"
  ],
  "pt-f2-16|Fica pra próxima": [
    "Fico pra próxima",
    "Fica pra próximo",
    "Fica pro próxima"
  ],
  "pt-f2-16|fica pra próxima": [
    "fico pra próxima",
    "fica pra próximo",
    "fica pro próxima"
  ],
  "pt-f2-17|Tô cansado": [
    "Sou cansado",
    "Tenho cansado",
    "Tô cansei"
  ],
  "pt-f2-17|tô cansado": [
    "sou cansado",
    "tenho cansado",
    "tô cansei"
  ],
  "pt-f2-18|De vez em quando": [
    "De vezes em quando",
    "De vez em quanto",
    "De vez a quando"
  ],
  "pt-f2-18|de vez em quando": [
    "de vezes em quando",
    "de vez em quanto",
    "de vez a quando"
  ],
  "pt-f3-01|acho que": [
    "acho de",
    "acho o que",
    "acho se"
  ],
  "pt-f3-01|Acho que": [
    "Acho de",
    "Acho o que",
    "Acho se"
  ],
  "pt-f3-02|Na minha opinião": [
    "Na meu opinião",
    "Para minha opinião",
    "Na mi opinião"
  ],
  "pt-f3-02|na minha opinião": [
    "na meu opinião",
    "para minha opinião",
    "na mi opinião"
  ],
  "pt-f3-03|Quando eu era criança": [
    "Quando eu fui criança",
    "Quando eu estava criança",
    "Quando eu sou criança"
  ],
  "pt-f3-03|quando eu era criança": [
    "quando eu fui criança",
    "quando eu estava criança",
    "quando eu sou criança"
  ],
  "pt-f3-04|Eu estava": [
    "Eu era",
    "Eu estou",
    "Mim estava"
  ],
  "pt-f3-04|eu estava": [
    "eu era",
    "eu estou",
    "mim estava"
  ],
  "pt-f3-04|estava": [
    "era",
    "estou",
    "estaba"
  ],
  "pt-f3-05|Espero que": [
    "Espero de",
    "Espero o que",
    "Esperança que"
  ],
  "pt-f3-05|espero que": [
    "espero de",
    "espero o que",
    "esperança que"
  ],
  "pt-f3-06|É importante que": [
    "Está importante que",
    "É importante de",
    "É importância que"
  ],
  "pt-f3-06|é importante que": [
    "está importante que",
    "é importante de",
    "é importância que"
  ],
  "pt-f3-07|poderia": [
    "puderia",
    "pudesse",
    "podría"
  ],
  "pt-f3-07|Poderia": [
    "Puderia",
    "Pudesse",
    "Podría"
  ],
  "pt-f3-08|Seria possível": [
    "Estaria possível",
    "Seria possíveis",
    "Seria possibilidade"
  ],
  "pt-f3-08|seria possível": [
    "estaria possível",
    "seria possíveis",
    "seria possibilidade"
  ],
  "pt-f3-09|te ligo": [
    "ti ligo",
    "te ligar",
    "te liguei"
  ],
  "pt-f3-09|Te ligo": [
    "Ti ligo",
    "Te ligar",
    "Te liguei"
  ],
  "pt-f3-10|me indica": [
    "mim indica",
    "me indico",
    "te indica"
  ],
  "pt-f3-11|A gente": [
    "O gente",
    "As gentes",
    "Nos"
  ],
  "pt-f3-11|a gente": [
    "o gente",
    "as gentes",
    "nos"
  ],
  "pt-f3-12|onde": [
    "qual",
    "quem",
    "cujo"
  ],
  "pt-f3-13|Vale a pena": [
    "Vale o pena",
    "Vale pena",
    "Vala a pena"
  ],
  "pt-f3-13|vale a pena": [
    "vale o pena",
    "vale pena",
    "vala a pena"
  ],
  "pt-f3-14|não está funcionando": [
    "não é funcionando",
    "não está funcionado",
    "está não funcionando"
  ],
  "pt-f3-15|Dá para trocar": [
    "Dá de trocar",
    "Dou para trocar",
    "Dá trocar"
  ],
  "pt-f3-15|dá para trocar": [
    "dá de trocar",
    "dou para trocar",
    "dá trocar"
  ],
  "pt-f3-16|Concordo": [
    "Acordo",
    "Concordar",
    "Concuerdo"
  ],
  "pt-f3-16|concordo": [
    "acordo",
    "concordar",
    "concuerdo"
  ],
  "pt-f3-17|Não é bem assim": [
    "É não bem assim",
    "Não é bem así",
    "Não é bem tão"
  ],
  "pt-f3-17|não é bem assim": [
    "é não bem assim",
    "não é bem así",
    "não é bem tão"
  ],
  "pt-f3-18|Fiquei sabendo que": [
    "Fiquei saber que",
    "Fiquei sabido que",
    "Estive sabendo que"
  ],
  "pt-f3-18|fiquei sabendo que": [
    "fiquei saber que",
    "fiquei sabido que",
    "estive sabendo que"
  ],
  "pt-f3-19|De repente": [
    "Do repente",
    "Em repente",
    "De repentino"
  ],
  "pt-f3-19|de repente": [
    "do repente",
    "em repente",
    "de repentino"
  ],
  "pt-f4-01|Se eu tivesse": [
    "Se eu tenho",
    "Se eu teria",
    "Se eu tinha"
  ],
  "pt-f4-01|se eu tivesse": [
    "se eu tenho",
    "se eu teria",
    "se eu tinha"
  ],
  "pt-f4-02|eu ficaria": [
    "eu ficarei",
    "eu fiquei",
    "eu fique"
  ],
  "pt-f4-03|Quando você puder": [
    "Quando você pode",
    "Quando você poder",
    "Quando você possa"
  ],
  "pt-f4-03|quando você puder": [
    "quando você pode",
    "quando você poder",
    "quando você possa"
  ],
  "pt-f4-04|Assim que": [
    "Assim como",
    "Assim quando",
    "Assim de"
  ],
  "pt-f4-04|assim que": [
    "assim como",
    "assim quando",
    "assim de"
  ],
  "pt-f4-05|Embora seja": [
    "Embora é",
    "Embora era",
    "Embora ser"
  ],
  "pt-f4-05|embora seja": [
    "embora é",
    "embora era",
    "embora ser"
  ],
  "pt-f4-06|para vocês saberem": [
    "para vocês saber",
    "para vocês sabem",
    "para vocês saibam"
  ],
  "pt-f4-07|tenho trabalhado": [
    "tenho trabalhando",
    "tenho trabalhar",
    "tenho trabalhou"
  ],
  "pt-f4-07|Tenho trabalhado": [
    "Tenho trabalhando",
    "Tenho trabalhar",
    "Tenho trabalhou"
  ],
  "pt-f4-08|tenho sentido falta": [
    "tenho sentindo falta",
    "tenho sentir falta",
    "tenho sentido falto"
  ],
  "pt-f4-08|Tenho sentido falta": [
    "Tenho sentindo falta",
    "Tenho sentir falta",
    "Tenho sentido falto"
  ],
  "pt-f4-09|disse que": [
    "dizeu que",
    "disse de que",
    "disse se"
  ],
  "pt-f4-09|disseram que": [
    "dizeram que",
    "disserem que",
    "disseram de que"
  ],
  "pt-f4-10|Fala-se muito": [
    "Falam-se muito",
    "Fala-se muita",
    "Fala-me muito"
  ],
  "pt-f4-10|fala-se muito": [
    "falam-se muito",
    "fala-se muita",
    "fala-me muito"
  ],
  "pt-f4-11|Por um lado": [
    "Pelo um lado",
    "Por uma lado",
    "Para um lado"
  ],
  "pt-f4-11|por um lado": [
    "pelo um lado",
    "por uma lado",
    "para um lado"
  ],
  "pt-f4-12|Por outro lado": [
    "Pelo outro lado",
    "Por outra lado",
    "Para outro lado"
  ],
  "pt-f4-12|por outro lado": [
    "pelo outro lado",
    "por outra lado",
    "para outro lado"
  ],
  "pt-f4-13|Entendo seu ponto": [
    "Entendo seu ponta",
    "Entendo sua ponto",
    "Entendo seu pontos"
  ],
  "pt-f4-13|entendo seu ponto": [
    "entendo seu ponta",
    "entendo sua ponto",
    "entendo seu pontos"
  ],
  "pt-f4-14|A questão é que": [
    "A questão é de",
    "A questão está que",
    "A questão é se"
  ],
  "pt-f4-14|a questão é que": [
    "a questão é de",
    "a questão está que",
    "a questão é se"
  ],
  "pt-f4-15|Tem como": [
    "Tem com",
    "Tem como de",
    "Tem que"
  ],
  "pt-f4-15|tem como": [
    "tem com",
    "tem como de",
    "tem que"
  ],
  "pt-f4-16|Levando em conta": [
    "Levando em contas",
    "Levando a conta",
    "Levado em conta"
  ],
  "pt-f4-16|levando em conta": [
    "levando em contas",
    "levando a conta",
    "levado em conta"
  ],
  "pt-f4-17|Em compensação": [
    "Na compensação",
    "Em compensado",
    "Por compensação"
  ],
  "pt-f4-17|em compensação": [
    "na compensação",
    "em compensado",
    "por compensação"
  ],
  "pt-f4-18|O lado bom é que": [
    "O lado bem é que",
    "A lado bom é que",
    "O lado bom é de"
  ],
  "pt-f4-18|o lado bom é que": [
    "o lado bem é que",
    "a lado bom é que",
    "o lado bom é de"
  ],
  "pt-f4-19|Em resumo": [
    "No resumo",
    "Em resumido",
    "Por resumo"
  ],
  "pt-f4-19|em resumo": [
    "no resumo",
    "em resumido",
    "por resumo"
  ],
  "pt-f4-20|Se não me engano": [
    "Se não me enganho",
    "Se não engano",
    "Se não me engane"
  ],
  "pt-f4-20|se não me engano": [
    "se não me enganho",
    "se não engano",
    "se não me engane"
  ],
  "pt-f5-01|já tinha": [
    "já tenho",
    "já tive",
    "já tinhei"
  ],
  "pt-f5-01|já tinham": [
    "já tinha",
    "já tiveram",
    "já tenham"
  ],
  "pt-f5-02|Caso": [
    "Em caso",
    "Caso de",
    "Se caso"
  ],
  "pt-f5-02|caso": [
    "em caso",
    "caso de",
    "se caso"
  ],
  "pt-f5-03|a não ser que": [
    "a não sendo que",
    "a menos de que",
    "a não ser se"
  ],
  "pt-f5-03|A não ser que": [
    "A não sendo que",
    "A menos de que",
    "A não ser se"
  ],
  "pt-f5-04|Contanto que": [
    "Contando que",
    "Contanto de",
    "Com tanto que"
  ],
  "pt-f5-04|contanto que": [
    "contando que",
    "contanto de",
    "com tanto que"
  ],
  "pt-f5-05|Dá uma olhadinha": [
    "Dá um olhadinha",
    "Dá uma olhadinho",
    "Dá uma olhadinhas"
  ],
  "pt-f5-05|dá uma olhadinha": [
    "dá um olhadinha",
    "dá uma olhadinho",
    "dá uma olhadinhas"
  ],
  "pt-f5-06|uma coisinha": [
    "um coisinha",
    "uma coisinho",
    "uma coisita"
  ],
  "pt-f5-07|O que me incomoda é": [
    "O que me incomodo é",
    "Que me incomoda é",
    "O que me incomoda está"
  ],
  "pt-f5-07|o que me incomoda é": [
    "o que me incomodo é",
    "que me incomoda é",
    "o que me incomoda está"
  ],
  "pt-f5-08|não entendo é": [
    "não entendo que é",
    "não entende é",
    "não entendo está"
  ],
  "pt-f5-09|Venho por meio deste": [
    "Venho para meio deste",
    "Venho por meio desse",
    "Venho em meio deste"
  ],
  "pt-f5-09|venho por meio deste": [
    "venho para meio deste",
    "venho por meio desse",
    "venho em meio deste"
  ],
  "pt-f5-10|Agradecemos desde já": [
    "Agradecemos de já",
    "Agradecimos desde já",
    "Agradecemos desde agora"
  ],
  "pt-f5-10|agradecemos desde já": [
    "agradecemos de já",
    "agradecimos desde já",
    "agradecemos desde agora"
  ],
  "pt-f5-11|Informamos que": [
    "Informemos que",
    "Informamos a que",
    "Informamo que"
  ],
  "pt-f5-11|informamos que": [
    "informemos que",
    "informamos a que",
    "informamo que"
  ],
  "pt-f5-12|Tu é": [
    "Tu são",
    "Ti é",
    "Tu está"
  ],
  "pt-f5-12|tu é": [
    "tu são",
    "ti é",
    "tu está"
  ],
  "pt-f5-13|pelo contrário": [
    "por contrário",
    "pelo contrária",
    "no contrário"
  ],
  "pt-f5-13|Pelo contrário": [
    "Por contrário",
    "Pelo contrária",
    "No contrário"
  ],
  "pt-f5-14|Aliás": [
    "Aliás de",
    "Além",
    "Ali"
  ],
  "pt-f5-14|aliás": [
    "aliás de",
    "além",
    "ali"
  ],
  "pt-f5-15|Inclusive": [
    "Incluso",
    "Inclusivo",
    "Incluindo"
  ],
  "pt-f5-15|inclusive": [
    "incluso",
    "inclusivo",
    "incluindo"
  ],
  "pt-f5-16|Com todo respeito": [
    "Com toda respeito",
    "Com todos respeito",
    "Em todo respeito"
  ],
  "pt-f5-16|com todo respeito": [
    "com toda respeito",
    "com todos respeito",
    "em todo respeito"
  ],
  "pt-f5-17|Sem querer ser chato": [
    "Sem quer ser chato",
    "Sem querendo ser chato",
    "Sem querer de ser chato"
  ],
  "pt-f5-17|sem querer ser chato": [
    "sem quer ser chato",
    "sem querendo ser chato",
    "sem querer de ser chato"
  ],
  "pt-f5-18|Vou ver e te falo": [
    "Vou ver e te fala",
    "Vou ver e te falei",
    "Vou ver e te falo de"
  ],
  "pt-f5-18|vou ver e te falo": [
    "vou ver e te fala",
    "vou ver e te falei",
    "vou ver e te falo de"
  ],
  "pt-f5-19|Na real": [
    "No real",
    "Na reais",
    "Em real"
  ],
  "pt-f5-19|na real": [
    "no real",
    "na reais",
    "em real"
  ],
  "pt-f5-20|caiu a ficha": [
    "caiu o ficha",
    "caíram a ficha",
    "caiu a fichas"
  ]
};
