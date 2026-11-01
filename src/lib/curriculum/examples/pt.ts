/** pt 새 예문(scripts/extra-examples.mjs가 pt.json에서 만듦). */
import type { ExtraExample } from "./types.ts";

export const PT_EXTRA: Record<string, ExtraExample[]> = {
 "f|pt-f1-01": [
  {
   "text": "Oi! Meu nome é Lucas.",
   "en": "Hi! My name is Lucas.",
   "ko": "안녕하세요! 제 이름은 루카스예요.",
   "replaces": "Tudo bem! Meu nome é Ji-woo. Prazer."
  }
 ],
 "f|pt-f1-16": [
  {
   "text": "Olá, Marcos! Tudo bem?",
   "en": "Hello, Marcos! How are you?",
   "ko": "안녕하세요, 마르쿠스! 잘 지내요?",
   "replaces": "Tudo bem! Meu nome é Ji-woo. Prazer."
  },
  {
   "text": "Oi, Ana! Tudo bem com você?",
   "en": "Hi, Ana! Is everything okay with you?",
   "ko": "안녕, 아나! 잘 지내요?",
   "replaces": "Boa noite! Tudo bem, e você?"
  }
 ],
 "e|prazer": [
  {
   "text": "Prazer! Eu sou a Carla.",
   "en": "Nice to meet you! I'm Carla.",
   "ko": "반가워요! 저는 카를라예요.",
   "replaces": "Tudo bem! Meu nome é Ji-woo. Prazer."
  },
  {
   "text": "Prazer, Marcos. Eu sou a vizinha do lado.",
   "en": "Nice to meet you, Marcos. I'm the next-door neighbor.",
   "ko": "반가워요, 마르쿠스. 저는 옆집 사람이에요.",
   "replaces": "Prazer, Diego! Aliás, eu já tinha ouvido teu sotaque numa novela. Achei lindo."
  }
 ],
 "f|pt-f1-06": [
  {
   "text": "Moço, onde fica o banheiro?",
   "en": "Excuse me, sir, where is the bathroom?",
   "ko": "저기요, 화장실이 어디예요?",
   "replaces": "Boa tarde! Com licença, onde fica a Avenida Paulista?"
  }
 ],
 "e|boa tarde": [
  {
   "text": "Boa tarde! Uma mesa para dois.",
   "en": "Good afternoon! A table for two.",
   "ko": "안녕하세요! 두 명 자리 부탁해요.",
   "replaces": "Boa tarde! Com licença, onde fica a Avenida Paulista?"
  },
  {
   "text": "Boa tarde, professora. Posso entrar?",
   "en": "Good afternoon, teacher. May I come in?",
   "ko": "안녕하세요, 선생님. 들어가도 돼요?",
   "replaces": "Boa tarde. Estou com dor de garganta desde ontem à noite."
  }
 ],
 "e|onde fica": [
  {
   "text": "E a padaria, onde fica?",
   "en": "And the bakery, where is it?",
   "ko": "그럼 빵집은 어디에 있어요?",
   "replaces": "Boa tarde! Com licença, onde fica a Avenida Paulista?"
  }
 ],
 "f|pt-f1-07": [
  {
   "text": "Quanto custa esse livro?",
   "en": "How much is this book?",
   "ko": "이 책은 얼마예요?",
   "replaces": "Pequeno. Quanto custa?"
  },
  {
   "text": "Quanto custa uma água?",
   "en": "How much is a bottle of water?",
   "ko": "물 한 병에 얼마예요?",
   "replaces": "Linha verde, estação Consolação. Quanto custa a passagem?"
  }
 ],
 "f|pt-f1-09": [
  {
   "text": "Me vê um café com leite.",
   "en": "Can I get a coffee with milk?",
   "ko": "카페라테 하나 주세요.",
   "replaces": "Bom dia! Me vê um pão de queijo, por favor."
  }
 ],
 "e|bom dia": [
  {
   "text": "Bom dia! Dormiu bem?",
   "en": "Good morning! Did you sleep well?",
   "ko": "좋은 아침이에요! 잘 잤어요?",
   "replaces": "Bom dia! Me vê um pão de queijo, por favor."
  },
  {
   "text": "Bom dia, mãe! O café está pronto?",
   "en": "Good morning, Mom! Is the coffee ready?",
   "ko": "엄마, 좋은 아침이에요! 커피 다 됐어요?",
   "replaces": "Bom dia. Uma passagem para Santos, ida e volta, por favor."
  }
 ],
 "e|por favor": [
  {
   "text": "Uma água, por favor.",
   "en": "A water, please.",
   "ko": "물 한 잔 주세요.",
   "replaces": "Bom dia! Me vê um pão de queijo, por favor."
  },
  {
   "text": "Fala mais alto, por favor.",
   "en": "Speak louder, please.",
   "ko": "좀 더 크게 말해 주세요.",
   "replaces": "Bom dia. Uma passagem para Santos, ida e volta, por favor."
  },
  {
   "text": "Fecha a janela, por favor, está frio.",
   "en": "Close the window, please, it's cold.",
   "ko": "창문 좀 닫아 주세요, 추워요.",
   "replaces": "Comecei ontem! Mas sem spoiler, por favor, ainda estou no terceiro episódio."
  }
 ],
 "e|obrigado": [
  {
   "text": "Obrigado pela ajuda!",
   "en": "Thanks for the help!",
   "ko": "도와줘서 고마워요!",
   "replaces": "Obrigado! Mas eu não falo muito bem ainda."
  },
  {
   "text": "Obrigado pelo presente, eu adorei.",
   "en": "Thanks for the gift, I loved it.",
   "ko": "선물 고마워요, 정말 마음에 들어요.",
   "replaces": "Que ótimo. Espero que a doutora não se importe com a mudança. Obrigado!"
  },
  {
   "text": "Obrigado! A comida estava uma delícia.",
   "en": "Thank you! The food was delicious.",
   "ko": "고마워요! 음식이 정말 맛있었어요.",
   "replaces": "Obrigado! Você poderia me passar a senha do wi-fi do novo quarto também?"
  },
  {
   "text": "Obrigado por esperar. Já cheguei.",
   "en": "Thanks for waiting. I'm here now.",
   "ko": "기다려 줘서 고마워요. 이제 도착했어요.",
   "replaces": "Obrigado! Sou da Coreia, mas moro em São Paulo faz quatro anos. Tu é do Sul, né?"
  },
  {
   "text": "Obrigado, mas eu já comi.",
   "en": "Thanks, but I've already eaten.",
   "ko": "고맙지만 저는 벌써 먹었어요.",
   "replaces": "Obrigado a vocês. E, sem querer ser chato, mas já sendo: o debate continua lá fora, no café!"
  },
  {
   "text": "Obrigado pelo convite! Que legal.",
   "en": "Thanks for the invitation! How nice.",
   "ko": "초대해 줘서 고마워요! 좋네요.",
   "replaces": "Perfeito. Muito obrigado pela conversa, foi um prazer."
  },
  {
   "text": "Obrigado, doutor. Já me sinto melhor.",
   "en": "Thank you, doctor. I already feel better.",
   "ko": "고맙습니다, 선생님. 벌써 좀 나아졌어요.",
   "replaces": "Obrigado! Até logo!"
  },
  {
   "text": "Obrigado pela carona até aqui!",
   "en": "Thanks for the ride here!",
   "ko": "여기까지 태워 줘서 고마워요!",
   "replaces": "Ah, não sei quem é. Mas obrigado! Até logo!"
  }
 ],
 "f|pt-f1-15": [
  {
   "text": "Pode abrir a porta?",
   "en": "Can you open the door?",
   "ko": "문 좀 열어 줄 수 있어요?",
   "replaces": "Desculpa, não entendi. Pode repetir mais devagar?"
  }
 ],
 "e|não entendi": [
  {
   "text": "Hmm, não entendi a pergunta.",
   "en": "Hmm, I didn't understand the question.",
   "ko": "음, 질문을 이해 못 했어요.",
   "replaces": "Desculpa, não entendi. Pode repetir mais devagar?"
  }
 ],
 "e|pode repetir": [
  {
   "text": "Pode repetir o seu nome?",
   "en": "Can you repeat your name?",
   "ko": "이름을 다시 말해 줄 수 있어요?",
   "replaces": "Desculpa, não entendi. Pode repetir mais devagar?"
  }
 ],
 "e|mais devagar": [
  {
   "text": "Fala mais devagar, a ligação está ruim.",
   "en": "Talk more slowly, the connection is bad.",
   "ko": "좀 더 천천히 말해 줘요, 연결이 안 좋아요.",
   "replaces": "Desculpa, não entendi. Pode repetir mais devagar?"
  }
 ],
 "e|boa noite": [
  {
   "text": "Boa noite, filho. Dorme bem.",
   "en": "Good night, son. Sleep well.",
   "ko": "잘 자, 아들. 푹 자.",
   "replaces": "Boa noite! Tudo bem, e você?"
  },
  {
   "text": "Boa noite! Vocês ainda estão abertos?",
   "en": "Good evening! Are you still open?",
   "ko": "안녕하세요! 아직 영업하세요?",
   "replaces": "Boa noite. Aconteceu um problema no quarto trezentos e doze."
  }
 ],
 "f|pt-f1-18": [
  {
   "text": "Tchau, até sábado!",
   "en": "Bye, see you Saturday!",
   "ko": "안녕, 토요일에 봐요!",
   "replaces": "Aqui está. Obrigada! Tchau!"
  }
 ],
 "e|tchau": [
  {
   "text": "Tchau, mãe! Te amo.",
   "en": "Bye, Mom! Love you.",
   "ko": "엄마, 다녀올게요! 사랑해요.",
   "replaces": "Aqui está. Obrigada! Tchau!"
  }
 ],
 "f|pt-f2-02": [
  {
   "text": "Ontem eu fui ao cinema com a minha irmã.",
   "en": "Yesterday I went to the movies with my sister.",
   "ko": "어제 언니랑 영화관에 갔어요.",
   "replaces": "E aí! Beleza. Meu fim de semana foi ótimo. No sábado eu fui à praia."
  },
  {
   "text": "No domingo eu fui ao mercado.",
   "en": "On Sunday I went to the market.",
   "ko": "일요일에 시장에 갔어요.",
   "replaces": "Fui há um mês. Nossa, que lugar lindo!"
  }
 ],
 "e|beleza": [
  {
   "text": "Beleza, te espero na porta.",
   "en": "Okay, I'll wait for you at the door.",
   "ko": "좋아요, 문 앞에서 기다릴게요.",
   "replaces": "E aí! Beleza. Meu fim de semana foi ótimo. No sábado eu fui à praia."
  }
 ],
 "e|fim de semana": [
  {
   "text": "Neste fim de semana eu quero descansar.",
   "en": "This weekend I want to rest.",
   "ko": "이번 주말에는 쉬고 싶어요.",
   "replaces": "E aí! Beleza. Meu fim de semana foi ótimo. No sábado eu fui à praia."
  }
 ],
 "f|pt-f2-09": [
  {
   "text": "Eu cheguei há dez minutos.",
   "en": "I arrived ten minutes ago.",
   "ko": "저는 십 분 전에 도착했어요.",
   "replaces": "Fui há um mês. Nossa, que lugar lindo!"
  }
 ],
 "f|pt-f2-03": [
  {
   "text": "Vou tomar um banho.",
   "en": "I'm going to take a shower.",
   "ko": "샤워하러 갈게요.",
   "replaces": "Combinado! Vou fazer outro no mês que vem."
  },
  {
   "text": "Amanhã? Vou trabalhar o dia todo.",
   "en": "Tomorrow? I'm going to work all day.",
   "ko": "내일요? 하루 종일 일할 거예요.",
   "replaces": "Tanto faz o preço. Vou levar o spray. Valeu!"
  },
  {
   "text": "Vou ligar para a minha mãe hoje.",
   "en": "I'm going to call my mom today.",
   "ko": "오늘 엄마한테 전화할 거예요.",
   "replaces": "Vou voltar amanhã. A que horas sai o último ônibus?"
  },
  {
   "text": "Vou comprar pão na esquina.",
   "en": "I'm going to buy bread at the corner.",
   "ko": "모퉁이 가게에서 빵 사 올게요.",
   "replaces": "Ainda não. Vou visitar no fim de semana."
  }
 ],
 "e|valeu": [
  {
   "text": "Valeu pela dica!",
   "en": "Thanks for the tip!",
   "ko": "알려 줘서 고마워요!",
   "replaces": "Tanto faz o preço. Vou levar o spray. Valeu!"
  }
 ],
 "f|pt-f2-12": [
  {
   "text": "A que horas abre o banco?",
   "en": "What time does the bank open?",
   "ko": "은행은 몇 시에 문을 열어요?",
   "replaces": "Vou voltar amanhã. A que horas sai o último ônibus?"
  }
 ],
 "f|pt-f2-04": [
  {
   "text": "Não posso falar, estou dirigindo agora.",
   "en": "I can't talk, I'm driving now.",
   "ko": "지금 운전 중이라 통화 못 해요.",
   "replaces": "Às sete eu ainda estou trabalhando. Pode ser às nove?"
  }
 ],
 "f|pt-f2-15": [
  {
   "text": "Pode ser no sábado à tarde?",
   "en": "How about Saturday afternoon?",
   "ko": "토요일 오후는 어때요?",
   "replaces": "Às sete eu ainda estou trabalhando. Pode ser às nove?"
  }
 ],
 "f|pt-f2-05": [
  {
   "text": "Gosto muito de música brasileira.",
   "en": "I really like Brazilian music.",
   "ko": "저는 브라질 음악을 정말 좋아해요.",
   "replaces": "Gosto muito de cozinhar. De vez em quando eu faço churrasco."
  }
 ],
 "f|pt-f2-18": [
  {
   "text": "De vez em quando eu corro no parque.",
   "en": "Every now and then I run in the park.",
   "ko": "가끔 공원에서 달려요.",
   "replaces": "Gosto muito de cozinhar. De vez em quando eu faço churrasco."
  }
 ],
 "f|pt-f2-07": [
  {
   "text": "Esse vestido é mais bonito do que aquele.",
   "en": "This dress is prettier than that one.",
   "ko": "이 원피스가 저것보다 더 예뻐요.",
   "replaces": "Eu gosto mais de comédia do que de terror."
  }
 ],
 "f|pt-f2-08": [
  {
   "text": "Faz dois anos que moro aqui.",
   "en": "I've lived here for two years.",
   "ko": "여기 산 지 이 년 됐어요.",
   "replaces": "Janela, por favor. Faz um ano que eu não vejo o mar!"
  }
 ],
 "f|pt-f2-10": [
  {
   "text": "Estou com dor de cabeça hoje.",
   "en": "I have a headache today.",
   "ko": "오늘 머리가 아파요.",
   "replaces": "Boa tarde. Estou com dor de garganta desde ontem à noite."
  }
 ],
 "e|ontem à noite": [
  {
   "text": "Ontem à noite eu vi um filme em casa.",
   "en": "Last night I watched a movie at home.",
   "ko": "어젯밤에 집에서 영화를 봤어요.",
   "replaces": "Boa tarde. Estou com dor de garganta desde ontem à noite."
  }
 ],
 "f|pt-f2-11": [
  {
   "text": "Tem remédio para gripe?",
   "en": "Do you have something for the flu?",
   "ko": "감기약 있어요?",
   "replaces": "Não. Tem remédio para dor de garganta sem receita?"
  }
 ],
 "f|pt-f2-13": [
  {
   "text": "Quanto tempo leva daqui até o centro?",
   "en": "How long does it take from here to downtown?",
   "ko": "여기서 시내까지 얼마나 걸려요?",
   "replaces": "Então às dez. Quanto tempo leva a viagem?"
  }
 ],
 "f|pt-f2-14": [
  {
   "text": "Vamos tomar um sorvete?",
   "en": "Shall we get some ice cream?",
   "ko": "아이스크림 먹으러 갈까요?",
   "replaces": "Vamos sim! Que legal. Qual filme?"
  }
 ],
 "e|vamos sim": [
  {
   "text": "Vamos sim, eu adoro esse parque!",
   "en": "Yes, let's go, I love that park!",
   "ko": "네, 가요! 저 그 공원 정말 좋아해요!",
   "replaces": "Vamos sim! Que legal. Qual filme?"
  }
 ],
 "f|pt-f2-16": [
  {
   "text": "Hoje eu não posso, tenho prova. Fica pra próxima!",
   "en": "I can't today, I have a test. Next time!",
   "ko": "오늘은 시험이 있어서 안 돼요. 다음에 해요!",
   "replaces": "Que pena, ele não pode. Ele foi para Curitiba. Fica pra próxima!"
  }
 ],
 "e|que pena": [
  {
   "text": "Que pena, a loja já fechou.",
   "en": "Too bad, the store already closed.",
   "ko": "아쉽네요, 가게가 벌써 문을 닫았어요.",
   "replaces": "Que pena, ele não pode. Ele foi para Curitiba. Fica pra próxima!"
  }
 ],
 "f|pt-f2-17": [
  {
   "text": "Hoje tô cansado porque dormi pouco.",
   "en": "I'm tired today because I didn't sleep much.",
   "ko": "오늘은 잠을 별로 못 자서 피곤해요.",
   "replaces": "No domingo eu fiz um churrasco. Agora tô cansado!"
  }
 ],
 "f|pt-f3-01": [
  {
   "text": "Nossa, acho que esqueci a chave no carro.",
   "en": "Oh no, I think I left the key in the car.",
   "ko": "이런, 열쇠를 차에 두고 온 것 같아요.",
   "replaces": "Eu acho que a história é ótima, mas o começo é um pouco lento."
  },
  {
   "text": "Hmm, acho que vai chover hoje.",
   "en": "Hmm, I think it's going to rain today.",
   "ko": "음, 오늘 비가 올 것 같아요.",
   "replaces": "Concordo, japonês é caro. Mas eu acho que hoje vale a pena."
  },
  {
   "text": "Sinceramente, acho que esse filme é longo demais.",
   "en": "Honestly, I think this movie is too long.",
   "ko": "솔직히 이 영화는 너무 긴 것 같아요.",
   "replaces": "Eu acho que o híbrido é melhor: dois dias no escritório para as equipes se encontrarem."
  }
 ],
 "f|pt-f3-13": [
  {
   "text": "Esse curso é caro, mas vale a pena.",
   "en": "This course is expensive, but it's worth it.",
   "ko": "이 강좌는 비싸지만 그만한 가치가 있어요.",
   "replaces": "Concordo, japonês é caro. Mas eu acho que hoje vale a pena."
  },
  {
   "text": "Acordar cedo para ver o sol nascer vale a pena.",
   "en": "Waking up early to see the sunrise is worth it.",
   "ko": "일찍 일어나서 해 뜨는 걸 볼 만해요.",
   "replaces": "Maravilhosa. Vale a pena provar o acarajé, com certeza."
  }
 ],
 "f|pt-f3-16": [
  {
   "text": "Concordo, essa praia é linda.",
   "en": "I agree, this beach is beautiful.",
   "ko": "맞아요, 이 해변 정말 예뻐요.",
   "replaces": "Concordo, japonês é caro. Mas eu acho que hoje vale a pena."
  }
 ],
 "e|eu acho que": [
  {
   "text": "Olha, eu acho que ela tem razão.",
   "en": "Look, I think she's right.",
   "ko": "있잖아요, 제 생각엔 그 사람 말이 맞아요.",
   "replaces": "Concordo, japonês é caro. Mas eu acho que hoje vale a pena."
  }
 ],
 "e|vale a pena": [
  {
   "text": "O museu? Vale a pena, sim.",
   "en": "The museum? Yes, it's worth it.",
   "ko": "박물관요? 네, 가 볼 만해요.",
   "replaces": "Concordo, japonês é caro. Mas eu acho que hoje vale a pena."
  },
  {
   "text": "Esse restaurante vale a pena pelo preço.",
   "en": "This restaurant is worth it for the price.",
   "ko": "이 식당은 가격 대비 가 볼 만해요.",
   "replaces": "Maravilhosa. Vale a pena provar o acarajé, com certeza."
  }
 ],
 "f|pt-f3-02": [
  {
   "text": "Na minha opinião, o inverno aqui é muito úmido.",
   "en": "In my opinion, the winter here is very humid.",
   "ko": "제 생각에 여기 겨울은 너무 습해요.",
   "replaces": "Não é bem assim. Na minha opinião, o segundo é muito melhor."
  }
 ],
 "f|pt-f3-17": [
  {
   "text": "Não é bem assim, ele só chegou um pouco atrasado.",
   "en": "It's not quite like that, he just arrived a little late.",
   "ko": "꼭 그런 건 아니에요, 그 사람은 조금 늦게 왔을 뿐이에요.",
   "replaces": "Não é bem assim. Na minha opinião, o segundo é muito melhor."
  },
  {
   "text": "Não é bem assim, o trabalho dele é bem difícil.",
   "en": "It's not quite like that, his job is really hard.",
   "ko": "꼭 그렇지만은 않아요, 그 사람 일은 꽤 힘들어요.",
   "replaces": "Com todo respeito, não é bem assim. Pelo contrário: quanto mais fácil a ferramenta, mais o aluno precisa de orientação."
  }
 ],
 "e|não é bem assim": [
  {
   "text": "Ela é brava? Não é bem assim.",
   "en": "Is she grumpy? It's not quite like that.",
   "ko": "그 사람이 성격이 사나워요? 꼭 그렇진 않아요.",
   "replaces": "Não é bem assim. Na minha opinião, o segundo é muito melhor."
  },
  {
   "text": "Não é bem assim, a gente só mudou o horário.",
   "en": "It's not quite like that, we just changed the schedule.",
   "ko": "꼭 그런 건 아니고, 우리는 시간만 바꿨어요.",
   "replaces": "Com todo respeito, não é bem assim. Pelo contrário: quanto mais fácil a ferramenta, mais o aluno precisa de orientação."
  }
 ],
 "f|pt-f3-03": [
  {
   "text": "Quando eu era criança, eu jogava bola na rua.",
   "en": "When I was a kid, I played soccer in the street.",
   "ko": "어렸을 때 길에서 공을 차고 놀았어요.",
   "replaces": "Pois é! Quando eu era criança, minha avó assistia todas as novelas que ela fazia."
  }
 ],
 "f|pt-f3-04": [
  {
   "text": "Eu estava cozinhando quando a luz acabou.",
   "en": "I was cooking when the power went out.",
   "ko": "요리하고 있는데 전기가 나갔어요.",
   "replaces": "O ar-condicionado não está funcionando. Eu estava dormindo quando ele desligou de repente."
  },
  {
   "text": "Eu estava no banho quando o telefone tocou.",
   "en": "I was in the shower when the phone rang.",
   "ko": "샤워하고 있는데 전화가 울렸어요.",
   "replaces": "Teve! Um dia a gente estava voltando de barco quando, de repente, começou uma tempestade."
  }
 ],
 "f|pt-f3-14": [
  {
   "text": "O chuveiro não está funcionando.",
   "en": "The shower isn't working.",
   "ko": "샤워기가 작동하지 않아요.",
   "replaces": "O ar-condicionado não está funcionando. Eu estava dormindo quando ele desligou de repente."
  }
 ],
 "f|pt-f3-19": [
  {
   "text": "O dia estava lindo e, de repente, começou a chover.",
   "en": "The day was beautiful and, suddenly, it started to rain.",
   "ko": "날씨가 좋았는데 갑자기 비가 오기 시작했어요.",
   "replaces": "O ar-condicionado não está funcionando. Eu estava dormindo quando ele desligou de repente."
  },
  {
   "text": "Eu abri a porta e, de repente, o gato saiu correndo.",
   "en": "I opened the door and, suddenly, the cat ran out.",
   "ko": "문을 열었더니 갑자기 고양이가 뛰쳐나갔어요.",
   "replaces": "Teve! Um dia a gente estava voltando de barco quando, de repente, começou uma tempestade."
  }
 ],
 "e|de repente": [
  {
   "text": "Ele ficou quieto de repente.",
   "en": "He suddenly went quiet.",
   "ko": "그 사람이 갑자기 조용해졌어요.",
   "replaces": "O ar-condicionado não está funcionando. Eu estava dormindo quando ele desligou de repente."
  }
 ],
 "f|pt-f3-05": [
  {
   "text": "Espero que o ônibus não atrase hoje.",
   "en": "I hope the bus isn't late today.",
   "ko": "오늘 버스가 늦지 않으면 좋겠어요.",
   "replaces": "Beleza. Espero que eles entreguem rápido, estou morrendo de fome!"
  }
 ],
 "f|pt-f3-06": [
  {
   "text": "É importante que todos cheguem na hora.",
   "en": "It's important that everyone arrives on time.",
   "ko": "모두 제시간에 오는 게 중요해요.",
   "replaces": "Seria possível trocar de quarto hoje? É importante que eu durma bem, porque tenho uma reunião cedo."
  }
 ],
 "f|pt-f3-08": [
  {
   "text": "Seria possível mudar a data da consulta?",
   "en": "Would it be possible to change the appointment date?",
   "ko": "진료 날짜를 바꿀 수 있을까요?",
   "replaces": "Seria possível trocar de quarto hoje? É importante que eu durma bem, porque tenho uma reunião cedo."
  }
 ],
 "f|pt-f3-10": [
  {
   "text": "Você me indica um bom livro?",
   "en": "Can you recommend a good book?",
   "ko": "좋은 책 하나 추천해 줄래요?",
   "replaces": "Quero! Você me indica algum lugar bom?"
  }
 ],
 "f|pt-f3-15": [
  {
   "text": "Dá para trocar essa camisa por um tamanho maior?",
   "en": "Can I exchange this shirt for a bigger size?",
   "ko": "이 셔츠를 더 큰 사이즈로 바꿀 수 있어요?",
   "replaces": "O negócio é o seguinte: vou viajar a trabalho. Dá para trocar para a semana que vem?"
  }
 ],
 "e|o negócio é o seguinte": [
  {
   "text": "O negócio é o seguinte: o carro quebrou e eu preciso de ajuda.",
   "en": "Here's the thing: the car broke down and I need help.",
   "ko": "사실은 이래요. 차가 고장 나서 도움이 필요해요.",
   "replaces": "O negócio é o seguinte: vou viajar a trabalho. Dá para trocar para a semana que vem?"
  }
 ],
 "f|pt-f5-13": [
  {
   "text": "Ele não é tímido. Pelo contrário: fala com todo mundo.",
   "en": "He's not shy. On the contrary, he talks to everyone.",
   "ko": "그 사람은 수줍음이 없어요. 오히려 모두와 이야기해요.",
   "replaces": "Com todo respeito, não é bem assim. Pelo contrário: quanto mais fácil a ferramenta, mais o aluno precisa de orientação."
  },
  {
   "text": "A prova não foi difícil. Pelo contrário, foi bem tranquila.",
   "en": "The test wasn't hard. On the contrary, it was pretty easy.",
   "ko": "시험은 어렵지 않았어요. 오히려 꽤 수월했어요.",
   "replaces": "O resto fica para o dia vinte. E não vamos fazer vista grossa pra nenhum teste; pelo contrário, vamos testar em dobro."
  }
 ],
 "f|pt-f5-16": [
  {
   "text": "Com todo respeito, doutor, eu gostaria de uma segunda opinião.",
   "en": "With all due respect, doctor, I'd like a second opinion.",
   "ko": "실례지만 선생님, 다른 의사 의견도 들어 보고 싶어요.",
   "replaces": "Com todo respeito, não é bem assim. Pelo contrário: quanto mais fácil a ferramenta, mais o aluno precisa de orientação."
  },
  {
   "text": "Com todo respeito, essa decisão devia ter sido discutida com a equipe.",
   "en": "With all due respect, this decision should have been discussed with the team.",
   "ko": "외람되지만, 이 결정은 팀과 먼저 의논했어야 했어요.",
   "replaces": "Com todo respeito, tia, quem acordou tarde foi o Rafa. Inclusive, liguei pra ele duas vezes."
  }
 ],
 "e|pelo contrário": [
  {
   "text": "Não estou bravo. Pelo contrário: estou muito feliz por você.",
   "en": "I'm not angry. On the contrary, I'm very happy for you.",
   "ko": "화난 거 아니에요. 오히려 정말 기뻐요.",
   "replaces": "Com todo respeito, não é bem assim. Pelo contrário: quanto mais fácil a ferramenta, mais o aluno precisa de orientação."
  },
  {
   "text": "O bairro não ficou pior com a obra. Pelo contrário, ficou muito bonito.",
   "en": "The neighborhood didn't get worse with the construction. On the contrary, it got really nice.",
   "ko": "공사로 동네가 나빠지지 않았어요. 오히려 아주 예뻐졌어요.",
   "replaces": "O resto fica para o dia vinte. E não vamos fazer vista grossa pra nenhum teste; pelo contrário, vamos testar em dobro."
  }
 ],
 "f|pt-f3-18": [
  {
   "text": "Ontem fiquei sabendo que a Júlia vai se mudar.",
   "en": "Yesterday I heard that Júlia is going to move.",
   "ko": "어제 줄리아가 이사 간다는 얘기를 들었어요.",
   "replaces": "Ótimo. E fiquei sabendo que vocês têm estacionamento agora. É verdade?"
  }
 ],
 "f|pt-f4-02": [
  {
   "text": "Se você viesse ao meu aniversário, eu ficaria muito feliz.",
   "en": "If you came to my birthday, I would be very happy.",
   "ko": "제 생일에 와 주면 정말 기쁠 거예요.",
   "replaces": "Em resumo: flexível, mas com encontros. Se a empresa me desse essa opção, eu ficaria feliz."
  }
 ],
 "f|pt-f4-19": [
  {
   "text": "Em resumo, o projeto atrasou por falta de dinheiro.",
   "en": "In short, the project was delayed for lack of money.",
   "ko": "요약하면, 돈이 부족해서 프로젝트가 늦어졌어요.",
   "replaces": "Em resumo: flexível, mas com encontros. Se a empresa me desse essa opção, eu ficaria feliz."
  }
 ],
 "f|pt-f4-04": [
  {
   "text": "Me avisa assim que chegar em casa.",
   "en": "Let me know as soon as you get home.",
   "ko": "집에 도착하자마자 알려 줘요.",
   "replaces": "Se não me engano, ele recomendou começar com pouco, assim que a pessoa tiver uma reserva."
  }
 ],
 "f|pt-f4-20": [
  {
   "text": "Se não me engano, a reunião foi cancelada.",
   "en": "If I'm not mistaken, the meeting was canceled.",
   "ko": "제가 알기로는 회의가 취소됐어요.",
   "replaces": "Se não me engano, ele recomendou começar com pouco, assim que a pessoa tiver uma reserva."
  },
  {
   "text": "Se não me engano, a farmácia fecha às oito.",
   "en": "If I'm not mistaken, the pharmacy closes at eight.",
   "ko": "제 기억이 맞다면 약국은 여덟 시에 문을 닫아요.",
   "replaces": "Se não me engano, ainda faltam três telas e todos os testes."
  }
 ],
 "f|pt-f4-05": [
  {
   "text": "Embora seja longe, esse mercado tem tudo.",
   "en": "Although it's far, this market has everything.",
   "ko": "멀긴 하지만 이 시장엔 없는 게 없어요.",
   "replaces": "Faz sentido para eles também. Embora seja menos do que pediram, é mais seguro a longo prazo."
  }
 ],
 "e|a longo prazo": [
  {
   "text": "Esse hábito faz bem para a saúde a longo prazo.",
   "en": "This habit is good for your health in the long run.",
   "ko": "이 습관은 길게 보면 건강에 좋아요.",
   "replaces": "Faz sentido para eles também. Embora seja menos do que pediram, é mais seguro a longo prazo."
  }
 ],
 "f|pt-f4-07": [
  {
   "text": "Ultimamente tenho trabalhado de casa.",
   "en": "Lately I've been working from home.",
   "ko": "요즘은 집에서 일하고 있어요.",
   "replaces": "Bom dia. Eu sou designer e, nos últimos dois anos, tenho trabalhado com aplicativos de saúde."
  }
 ],
 "f|pt-f4-09": [
  {
   "text": "A Marina disse que vai chegar atrasada.",
   "en": "Marina said she's going to be late.",
   "ko": "마리나가 늦을 거라고 했어요.",
   "replaces": "Pois é, ele disse que um cafezinho por dia vira uma passagem de avião no fim do ano."
  }
 ],
 "f|pt-f4-11": [
  {
   "text": "Por um lado, morar sozinho dá liberdade, mas sai caro.",
   "en": "On the one hand, living alone gives you freedom, but it's expensive.",
   "ko": "한편으로는 혼자 살면 자유롭지만 돈이 많이 들어요.",
   "replaces": "Por um lado, podemos entregar as telas principais na sexta. Por outro lado, os testes ficam para terça."
  },
  {
   "text": "Por um lado, o novo horário é bom para mim, mas não para as crianças.",
   "en": "On the one hand, the new schedule is good for me, but not for the kids.",
   "ko": "한편으로는 새 시간표가 저한테는 좋지만 아이들한테는 아니에요.",
   "replaces": "Por um lado, sim. Por outro lado, a longo prazo, essas coisinhas fazem diferença."
  }
 ],
 "f|pt-f4-12": [
  {
   "text": "O apartamento é pequeno. Por outro lado, fica perto do trabalho.",
   "en": "The apartment is small. On the other hand, it's close to work.",
   "ko": "아파트는 작아요. 그 대신 회사에서 가까워요.",
   "replaces": "Por um lado, podemos entregar as telas principais na sexta. Por outro lado, os testes ficam para terça."
  },
  {
   "text": "Viajar de ônibus demora. Por outro lado, é bem barato.",
   "en": "Traveling by bus takes a long time. On the other hand, it's really cheap.",
   "ko": "버스 여행은 오래 걸려요. 반면에 아주 싸요.",
   "replaces": "Por um lado, sim. Por outro lado, a longo prazo, essas coisinhas fazem diferença."
  }
 ],
 "e|por um lado": [
  {
   "text": "Por um lado, eu entendo a sua raiva.",
   "en": "On the one hand, I understand your anger.",
   "ko": "한편으로는 화난 마음을 이해해요.",
   "replaces": "Por um lado, podemos entregar as telas principais na sexta. Por outro lado, os testes ficam para terça."
  },
  {
   "text": "Por um lado, trabalhar à noite paga melhor, mas cansa muito.",
   "en": "On the one hand, working nights pays better, but it's very tiring.",
   "ko": "한편으로는 밤에 일하면 돈은 더 받지만 많이 피곤해요.",
   "replaces": "Por um lado, sim. Por outro lado, a longo prazo, essas coisinhas fazem diferença."
  }
 ],
 "e|por outro lado": [
  {
   "text": "O salário é baixo. Por outro lado, a equipe é ótima.",
   "en": "The salary is low. On the other hand, the team is great.",
   "ko": "월급은 적어요. 반면에 팀은 정말 좋아요.",
   "replaces": "Por um lado, sim. Por outro lado, a longo prazo, essas coisinhas fazem diferença."
  }
 ],
 "f|pt-f4-13": [
  {
   "text": "Entendo seu ponto, mas agora não temos verba para isso.",
   "en": "I see your point, but right now we don't have the budget for it.",
   "ko": "무슨 말인지 알겠지만 지금은 그럴 예산이 없어요.",
   "replaces": "Entendo seu ponto, só que, se a gente tivesse mais uma pessoa, terminaria com muito mais qualidade."
  }
 ],
 "e|só que": [
  {
   "text": "Eu queria ir, só que estou sem carro.",
   "en": "I wanted to go, but I don't have a car.",
   "ko": "가고 싶었는데 차가 없어요.",
   "replaces": "Entendo seu ponto, só que, se a gente tivesse mais uma pessoa, terminaria com muito mais qualidade."
  }
 ],
 "f|pt-f4-14": [
  {
   "text": "A questão é que ninguém avisou o cliente.",
   "en": "The thing is that nobody told the client.",
   "ko": "문제는 아무도 고객에게 알리지 않았다는 거예요.",
   "replaces": "A questão é que a gente tem trabalhado até tarde há semanas. A equipe está cansada."
  }
 ],
 "f|pt-f4-15": [
  {
   "text": "Tem como mudar a reserva para domingo?",
   "en": "Is there a way to move the reservation to Sunday?",
   "ko": "예약을 일요일로 바꿀 수 있을까요?",
   "replaces": "Tem como a gente chegar a um acordo? Que tal cinco por cento?"
  },
  {
   "text": "Tem como você me mandar o arquivo hoje?",
   "en": "Is there a way you could send me the file today?",
   "ko": "오늘 파일을 보내 줄 수 있어요?",
   "replaces": "Com órgão público, não. Lá não tem como dar um jeitinho; tem que seguir o protocolo."
  }
 ],
 "e|tem como": [
  {
   "text": "Tem como pagar com cartão?",
   "en": "Is it possible to pay by card?",
   "ko": "카드로 결제할 수 있어요?",
   "replaces": "Tem como a gente chegar a um acordo? Que tal cinco por cento?"
  },
  {
   "text": "Desculpa, mas hoje não tem como eu te ajudar.",
   "en": "Sorry, but there's no way I can help you today.",
   "ko": "미안하지만 오늘은 도와줄 수가 없어요.",
   "replaces": "Com órgão público, não. Lá não tem como dar um jeitinho; tem que seguir o protocolo."
  }
 ],
 "f|pt-f4-16": [
  {
   "text": "Levando em conta o tamanho do quarto, acho justo o preço.",
   "en": "Taking the size of the room into account, I think the price is fair.",
   "ko": "방 크기를 생각하면 가격이 적당한 것 같아요.",
   "replaces": "Levando em conta que eu mesmo pintei a sala, acho justo. Em compensação, posso assinar por mais dois anos."
  },
  {
   "text": "Levando em conta a chuva, é melhor sair cedo.",
   "en": "Taking the rain into account, it's better to leave early.",
   "ko": "비가 오는 걸 생각하면 일찍 나가는 게 좋아요.",
   "replaces": "Eu priorizo o essencial. Embora eu goste de detalhes, sei a hora de parar, levando em conta o prazo."
  }
 ],
 "f|pt-f4-17": [
  {
   "text": "O hotel é simples. Em compensação, o café da manhã é ótimo.",
   "en": "The hotel is simple. On the plus side, the breakfast is great.",
   "ko": "호텔은 소박해요. 그 대신 아침 식사가 아주 좋아요.",
   "replaces": "Levando em conta que eu mesmo pintei a sala, acho justo. Em compensação, posso assinar por mais dois anos."
  }
 ],
 "e|levando em conta": [
  {
   "text": "Levando em conta a distância, o táxi não ficou caro.",
   "en": "Considering the distance, the taxi wasn't expensive.",
   "ko": "거리를 생각하면 택시비가 비싸지 않았어요.",
   "replaces": "Levando em conta que eu mesmo pintei a sala, acho justo. Em compensação, posso assinar por mais dois anos."
  }
 ],
 "f|pt-f4-18": [
  {
   "text": "Perdi o ônibus. O lado bom é que consegui caminhar um pouco.",
   "en": "I missed the bus. The good thing is that I got to walk a bit.",
   "ko": "버스를 놓쳤어요. 좋은 점은 좀 걸을 수 있었다는 거예요.",
   "replaces": "Sete eu aceito. O lado bom é que nenhum de nós precisa se preocupar com isso tão cedo."
  }
 ],
 "f|pt-f5-01": [
  {
   "text": "Quando cheguei na festa, o bolo já tinha acabado.",
   "en": "When I got to the party, the cake had already run out.",
   "ko": "파티에 도착했을 때는 케이크가 이미 다 떨어졌어요.",
   "replaces": "Eu já tinha saído de casa, tia, mas o trânsito deu ruim na Marginal."
  },
  {
   "text": "Eu já tinha jantado quando você ligou.",
   "en": "I had already had dinner when you called.",
   "ko": "전화했을 때 저는 이미 저녁을 먹은 뒤였어요.",
   "replaces": "Subiram em algumas escolas, sim. Aliás, em muitas delas os professores já tinham feito um curso antes."
  },
  {
   "text": "Quando o médico chegou, a febre já tinha passado.",
   "en": "When the doctor arrived, the fever had already gone down.",
   "ko": "의사가 왔을 때는 열이 이미 내려 있었어요.",
   "replaces": "Prazer, Diego! Aliás, eu já tinha ouvido teu sotaque numa novela. Achei lindo."
  }
 ],
 "f|pt-f5-14": [
  {
   "text": "Gostei muito do jantar. Aliás, onde você comprou esse vinho?",
   "en": "I really liked the dinner. By the way, where did you buy this wine?",
   "ko": "저녁 정말 맛있었어요. 그런데 이 와인은 어디서 샀어요?",
   "replaces": "Subiram em algumas escolas, sim. Aliás, em muitas delas os professores já tinham feito um curso antes."
  },
  {
   "text": "A reunião foi boa. Aliás, o chefe elogiou o seu relatório.",
   "en": "The meeting went well. In fact, the boss praised your report.",
   "ko": "회의 잘 됐어요. 게다가 상사가 당신 보고서를 칭찬했어요.",
   "replaces": "Prazer, Diego! Aliás, eu já tinha ouvido teu sotaque numa novela. Achei lindo."
  },
  {
   "text": "Ela fala três línguas. Aliás, está aprendendo uma quarta.",
   "en": "She speaks three languages. In fact, she's learning a fourth.",
   "ko": "그 사람은 세 개 언어를 해요. 게다가 네 번째도 배우고 있어요.",
   "replaces": "Valeu, vó. Aliás, o cheiro tá incrível, deu pra sentir lá do portão."
  }
 ],
 "f|pt-f5-02": [
  {
   "text": "Caso precise de alguma coisa, é só me chamar.",
   "en": "In case you need anything, just call me.",
   "ko": "필요한 게 있으면 언제든 불러요.",
   "replaces": "Tiraram, mas eu aprendi a ficar de boa. Caso alguém zoe, eu zoo de volta!"
  }
 ],
 "f|pt-f5-03": [
  {
   "text": "A gente vai à praia amanhã, a não ser que chova.",
   "en": "We're going to the beach tomorrow, unless it rains.",
   "ko": "비만 안 오면 내일 해변에 가요.",
   "replaces": "Pode ficar de boa, tio, é só brincadeira. Mas um pedacinho de pudim eu aceito, a não ser que já tenha acabado."
  }
 ],
 "f|pt-f5-04": [
  {
   "text": "Contanto que você devolva no domingo, pode levar meu carro.",
   "en": "As long as you bring it back on Sunday, you can take my car.",
   "ko": "일요일에 돌려주기만 하면 제 차를 가져가도 돼요.",
   "replaces": "Totalmente. Por isso queria te pedir uma coisinha: dá uma olhadinha nas telas até quarta? Contanto que vocês aprovem, o cadastro sai na sexta."
  },
  {
   "text": "Contanto que a gente volte cedo, eu topo a viagem.",
   "en": "As long as we come back early, I'm in for the trip.",
   "ko": "일찍 돌아오기만 하면 여행 갈게요.",
   "replaces": "Bora! Vou ver e te falo o dia. Contanto que tenha pão de alho, eu topo qualquer data!"
  }
 ],
 "f|pt-f5-06": [
  {
   "text": "Queria te pedir uma coisinha: você pode regar minhas plantas amanhã?",
   "en": "I wanted to ask you a little favor: can you water my plants tomorrow?",
   "ko": "작은 부탁 하나 해도 될까요? 내일 제 화분에 물 좀 줄 수 있어요?",
   "replaces": "Totalmente. Por isso queria te pedir uma coisinha: dá uma olhadinha nas telas até quarta? Contanto que vocês aprovem, o cadastro sai na sexta."
  }
 ],
 "f|pt-f5-18": [
  {
   "text": "Vou ver e te falo amanhã se consigo ir.",
   "en": "I'll see and let you know tomorrow if I can go.",
   "ko": "확인해 보고 갈 수 있는지 내일 알려 줄게요.",
   "replaces": "Bora! Vou ver e te falo o dia. Contanto que tenha pão de alho, eu topo qualquer data!"
  },
  {
   "text": "Vou ver e te falo depois do almoço.",
   "en": "I'll see and let you know after lunch.",
   "ko": "알아보고 점심 먹고 나서 알려 줄게요.",
   "replaces": "Vou ver e te falo até amanhã. Não quero prometer de novo e falhar."
  }
 ],
 "f|pt-f5-08": [
  {
   "text": "O que eu não entendo é por que ele mentiu.",
   "en": "What I don't understand is why he lied.",
   "ko": "제가 이해 못 하는 건 그 사람이 왜 거짓말을 했냐는 거예요.",
   "replaces": "Sem querer ser chato, mas o que eu ainda não entendo é o oxe. É tipo nossa?"
  }
 ],
 "f|pt-f5-17": [
  {
   "text": "Sem querer ser chato, mas a música está alta demais.",
   "en": "Not to be a pain, but the music is too loud.",
   "ko": "까다롭게 굴려는 건 아닌데, 음악이 너무 커요.",
   "replaces": "Sem querer ser chato, mas o que eu ainda não entendo é o oxe. É tipo nossa?"
  },
  {
   "text": "Sem querer ser chato, mas alguém pegou o meu iogurte da geladeira.",
   "en": "Not to be a pain, but someone took my yogurt from the fridge.",
   "ko": "쪼잔하게 굴려는 건 아닌데, 누가 냉장고에서 제 요거트를 가져갔어요.",
   "replaces": "Obrigado a vocês. E, sem querer ser chato, mas já sendo: o debate continua lá fora, no café!"
  }
 ],
 "e|sem querer ser chato": [
  {
   "text": "Sem querer ser chato, mas você ainda me deve aquele livro.",
   "en": "Not to be a pain, but you still owe me that book.",
   "ko": "귀찮게 하려는 건 아닌데, 아직 그 책 안 돌려줬어요.",
   "replaces": "Sem querer ser chato, mas o que eu ainda não entendo é o oxe. É tipo nossa?"
  }
 ],
 "e|aliás": [
  {
   "text": "Chegou a sua encomenda. Aliás, deixei na portaria.",
   "en": "Your package arrived. By the way, I left it at the front desk.",
   "ko": "택배 왔어요. 참, 경비실에 맡겨 뒀어요.",
   "replaces": "Valeu, vó. Aliás, o cheiro tá incrível, deu pra sentir lá do portão."
  }
 ],
 "f|pt-f5-15": [
  {
   "text": "Ela é ótima cozinheira. Inclusive, já ganhou um concurso no bairro.",
   "en": "She's a great cook. In fact, she's already won a contest in the neighborhood.",
   "ko": "그 사람은 요리를 정말 잘해요. 심지어 동네 대회에서 상도 받았어요.",
   "replaces": "Com todo respeito, tia, quem acordou tarde foi o Rafa. Inclusive, liguei pra ele duas vezes."
  },
  {
   "text": "Ele adora o Japão. Inclusive, está estudando japonês.",
   "en": "He loves Japan. In fact, he's studying Japanese.",
   "ko": "그 사람은 일본을 정말 좋아해요. 심지어 일본어도 공부하고 있어요.",
   "replaces": "Pode até ser, mas dizer que nada vai mudar é conversa fiada. Inclusive, alguns estados já estão fazendo isso."
  }
 ],
 "e|inclusive": [
  {
   "text": "O parque está bem cuidado. Inclusive, plantaram árvores novas.",
   "en": "The park is well kept. In fact, they planted new trees.",
   "ko": "공원이 잘 관리되고 있어요. 심지어 새 나무도 심었어요.",
   "replaces": "Com todo respeito, tia, quem acordou tarde foi o Rafa. Inclusive, liguei pra ele duas vezes."
  },
  {
   "text": "A gente se dá muito bem. Inclusive, passamos o Natal juntos.",
   "en": "We get along really well. In fact, we spent Christmas together.",
   "ko": "우리는 정말 잘 지내요. 심지어 크리스마스도 같이 보냈어요.",
   "replaces": "Pode até ser, mas dizer que nada vai mudar é conversa fiada. Inclusive, alguns estados já estão fazendo isso."
  }
 ],
 "e|vou ver e te falo": [
  {
   "text": "Vou ver e te falo, ainda não sei a minha agenda.",
   "en": "I'll see and let you know, I don't know my schedule yet.",
   "ko": "알아보고 말해 줄게요, 아직 일정을 몰라요.",
   "replaces": "Vou ver e te falo até amanhã. Não quero prometer de novo e falhar."
  }
 ],
 "f|pt-f5-19": [
  {
   "text": "Na real, eu nem queria ir a essa festa.",
   "en": "Honestly, I didn't even want to go to that party.",
   "ko": "솔직히 저는 그 파티에 가고 싶지도 않았어요.",
   "replaces": "Vó, eu já comi dois pratos. Na real, não cabe mais nada!"
  },
  {
   "text": "Na real, o problema não é o dinheiro, é o tempo.",
   "en": "Truth is, the problem isn't the money, it's the time.",
   "ko": "사실 문제는 돈이 아니라 시간이에요.",
   "replaces": "Tinha, sim. Na real, só caiu a ficha da gravidade na sexta, e eu preferi confirmar antes de te ligar."
  },
  {
   "text": "Ele parece sério. Na real, é super engraçado.",
   "en": "He looks serious. Truth is, he's super funny.",
   "ko": "그 사람은 진지해 보여요. 사실은 엄청 웃겨요.",
   "replaces": "Lá é mais meu e mano. Na real, depois de quatro anos, eu nem percebo mais."
  }
 ],
 "f|pt-f5-20": [
  {
   "text": "Só agora caiu a ficha: amanhã é o meu último dia aqui.",
   "en": "It only just hit me: tomorrow is my last day here.",
   "ko": "이제야 실감이 나요. 내일이 여기서 마지막 날이에요.",
   "replaces": "Tinha, sim. Na real, só caiu a ficha da gravidade na sexta, e eu preferi confirmar antes de te ligar."
  }
 ],
 "e|na real": [
  {
   "text": "Na real, eu prefiro ficar em casa hoje.",
   "en": "Honestly, I'd rather stay home today.",
   "ko": "솔직히 오늘은 집에 있고 싶어요.",
   "replaces": "Tinha, sim. Na real, só caiu a ficha da gravidade na sexta, e eu preferi confirmar antes de te ligar."
  }
 ],
 "e|até logo": [
  {
   "text": "Até logo, pessoal!",
   "en": "See you later, everyone!",
   "ko": "다들 이따 봐요!",
   "replaces": "Ah, não sei quem é. Mas obrigado! Até logo!"
  }
 ],
 "e|a que horas": [
  {
   "text": "E o jogo, a que horas começa?",
   "en": "And the game, what time does it start?",
   "ko": "그럼 경기는 몇 시에 시작해요?",
   "replaces": "Depende. Na quarta, a que horas?"
  }
 ],
 "e|combinado": [
  {
   "text": "Combinado, te vejo às oito.",
   "en": "Deal, see you at eight.",
   "ko": "좋아요, 여덟 시에 봐요.",
   "replaces": "Combinado! Até amanhã!"
  }
 ],
 "e|com certeza": [
  {
   "text": "Você vem amanhã? Com certeza!",
   "en": "Are you coming tomorrow? Definitely!",
   "ko": "내일 와요? 당연하죠!",
   "replaces": "Com certeza. E tomara que a segunda temporada saia logo."
  }
 ],
 "e|vamos alinhar": [
  {
   "text": "Vamos alinhar os detalhes antes da apresentação?",
   "en": "Shall we go over the details before the presentation?",
   "ko": "발표 전에 세부 사항을 맞춰 볼까요?",
   "replaces": "Fechou. Vamos alinhar de novo amanhã cedo?"
  }
 ],
 "e|não tem jeito": [
  {
   "text": "Não tem jeito, vou ter que pegar um táxi.",
   "en": "There's no way around it, I'll have to take a taxi.",
   "ko": "어쩔 수 없네요, 택시를 타야겠어요.",
   "replaces": "Não tem jeito, então. Vai ter que correr atrás de outra vaga!"
  }
 ],
 "e|tirar de letra": [
  {
   "text": "Você estudou bastante, vai tirar de letra essa prova.",
   "en": "You studied a lot, you'll ace this test.",
   "ko": "공부 많이 했으니 이 시험은 식은 죽 먹기일 거예요.",
   "replaces": "O que eu peço é simples: não vamos chutar o balde com a escola pública. Com apoio, qualquer professor vai tirar de letra."
  }
 ]
};
