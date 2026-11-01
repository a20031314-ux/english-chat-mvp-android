/** fr 새 예문(scripts/extra-examples.mjs가 fr.json에서 만듦). */
import type { ExtraExample } from "./types.ts";

export const FR_EXTRA: Record<string, ExtraExample[]> = {
 "f|fr-f1-01": [
  {
   "text": "Je m'appelle Sophie, et toi ?",
   "en": "My name is Sophie, and you?",
   "ko": "제 이름은 소피예요, 당신은요?",
   "replaces": "Bonsoir, Claire. Je m'appelle Minho. Enchanté."
  }
 ],
 "e|Enchanté": [
  {
   "text": "Enchanté, madame Martin.",
   "en": "Nice to meet you, Mrs Martin.",
   "ko": "만나서 반가워요, 마르탱 부인.",
   "replaces": "Bonsoir, Claire. Je m'appelle Minho. Enchanté."
  }
 ],
 "e|Je m'appelle": [
  {
   "text": "Moi, je m'appelle Léa.",
   "en": "Me, my name is Léa.",
   "ko": "저는 레아라고 해요.",
   "replaces": "Bonsoir, Claire. Je m'appelle Minho. Enchanté."
  }
 ],
 "f|fr-f1-02": [
  {
   "text": "Je viens de Lyon, en France.",
   "en": "I'm from Lyon, in France.",
   "ko": "저는 프랑스 리옹에서 왔어요.",
   "replaces": "Je viens de Corée. J'habite à Séoul."
  }
 ],
 "f|fr-f1-06": [
  {
   "text": "Je voudrais un thé au citron.",
   "en": "I'd like a lemon tea.",
   "ko": "레몬차 한 잔 주세요.",
   "replaces": "Bonjour. Je voudrais une baguette, s'il vous plaît."
  },
  {
   "text": "Je voudrais deux croissants.",
   "en": "I'd like two croissants.",
   "ko": "크루아상 두 개 주세요.",
   "replaces": "Bonjour. Je voudrais un café, s'il vous plaît."
  },
  {
   "text": "Je voudrais réserver une table pour ce soir.",
   "en": "I'd like to book a table for tonight.",
   "ko": "오늘 저녁 테이블을 예약하고 싶어요.",
   "replaces": "Trois semaines ? Je voudrais plutôt que vous me le remplaciez."
  }
 ],
 "e|Bonjour": [
  {
   "text": "Bonjour, madame !",
   "en": "Hello, madam!",
   "ko": "안녕하세요!",
   "replaces": "Bonjour. Je voudrais une baguette, s'il vous plaît."
  },
  {
   "text": "Bonjour à tous !",
   "en": "Hello, everyone!",
   "ko": "여러분, 안녕하세요!",
   "replaces": "Bonjour. Je voudrais un café, s'il vous plaît."
  },
  {
   "text": "Bonjour, vous êtes ouverts ?",
   "en": "Hello, are you open?",
   "ko": "안녕하세요, 영업하세요?",
   "replaces": "Bonjour. J'ai mal à la tête et j'ai mal à la gorge."
  },
  {
   "text": "Bonjour, c'est pour une livraison.",
   "en": "Hello, it's for a delivery.",
   "ko": "안녕하세요, 배달 왔어요.",
   "replaces": "Bonjour, c'est Minho, de l'appartement rue Lepic. Il y a un souci avec le chauffe-eau."
  }
 ],
 "e|S'il vous plaît": [
  {
   "text": "Un ticket de métro, s'il vous plaît.",
   "en": "A metro ticket, please.",
   "ko": "지하철 표 한 장 주세요.",
   "replaces": "Bonjour. Je voudrais une baguette, s'il vous plaît."
  },
  {
   "text": "Deux cafés, s'il vous plaît.",
   "en": "Two coffees, please.",
   "ko": "커피 두 잔 주세요.",
   "replaces": "Bonjour. Je voudrais un café, s'il vous plaît."
  },
  {
   "text": "Fermez la porte, s'il vous plaît.",
   "en": "Close the door, please.",
   "ko": "문 좀 닫아 주세요.",
   "replaces": "Excusez-moi, où est la ligne quatre, s'il vous plaît ?"
  },
  {
   "text": "Un verre d'eau, s'il vous plaît.",
   "en": "A glass of water, please.",
   "ko": "물 한 잔 주세요.",
   "replaces": "Plus lentement, s'il vous plaît. Je ne parle pas bien français."
  },
  {
   "text": "Parlez plus fort, s'il vous plaît.",
   "en": "Speak louder, please.",
   "ko": "좀 더 크게 말해 주세요.",
   "replaces": "Non, merci. J'ai déjà fini. L'addition, s'il vous plaît."
  },
  {
   "text": "Attendez un instant, s'il vous plaît.",
   "en": "Wait a moment, please.",
   "ko": "잠시만 기다려 주세요.",
   "replaces": "Ça ne m'étonne pas. Vous pourriez l'appeler, s'il vous plaît ?"
  }
 ],
 "f|fr-f1-07": [
  {
   "text": "Il y a une pharmacie près d'ici ?",
   "en": "Is there a pharmacy near here?",
   "ko": "이 근처에 약국 있어요?",
   "replaces": "De rien. Il y a un autre colis pour toi aujourd'hui."
  }
 ],
 "f|fr-f1-08": [
  {
   "text": "Où est la boulangerie ?",
   "en": "Where is the bakery?",
   "ko": "빵집이 어디예요?",
   "replaces": "Excusez-moi, où est la ligne quatre, s'il vous plaît ?"
  }
 ],
 "f|fr-f1-10": [
  {
   "text": "Désolée, je ne parle pas italien.",
   "en": "Sorry, I don't speak Italian.",
   "ko": "미안해요, 저는 이탈리아어를 못해요.",
   "replaces": "Plus lentement, s'il vous plaît. Je ne parle pas bien français."
  }
 ],
 "f|fr-f1-13": [
  {
   "text": "Vous pouvez parler plus lentement ?",
   "en": "Can you speak more slowly?",
   "ko": "좀 더 천천히 말해 주실 수 있어요?",
   "replaces": "Pardon, je ne comprends pas. Vous pouvez répéter ?"
  }
 ],
 "f|fr-f1-18": [
  {
   "text": "Je ne comprends pas cette lettre de la banque.",
   "en": "I don't understand this letter from the bank.",
   "ko": "은행에서 온 이 편지를 이해 못 하겠어요.",
   "replaces": "Pardon, je ne comprends pas. Vous pouvez répéter ?"
  }
 ],
 "e|Pardon": [
  {
   "text": "Pardon, je cherche la sortie.",
   "en": "Excuse me, I'm looking for the exit.",
   "ko": "실례합니다, 출구를 찾고 있어요.",
   "replaces": "Pardon, je ne comprends pas. Vous pouvez répéter ?"
  }
 ],
 "e|Vous pouvez répéter": [
  {
   "text": "Vous pouvez répéter le prix ?",
   "en": "Can you repeat the price?",
   "ko": "가격을 다시 말해 주실 수 있어요?",
   "replaces": "Pardon, je ne comprends pas. Vous pouvez répéter ?"
  }
 ],
 "f|fr-f1-14": [
  {
   "text": "Salut, Marc ! Ça va ?",
   "en": "Hi, Marc! How are you?",
   "ko": "안녕, 마크! 잘 지내요?",
   "replaces": "Salut ! Ça va bien, merci. Et toi ?"
  }
 ],
 "e|Ça va": [
  {
   "text": "Oui, ça va, et vous ?",
   "en": "Yes, I'm fine, and you?",
   "ko": "네, 잘 지내요, 당신은요?",
   "replaces": "Salut ! Ça va bien, merci. Et toi ?"
  },
  {
   "text": "Ça va mieux aujourd'hui ?",
   "en": "Are you feeling better today?",
   "ko": "오늘은 좀 나아졌어요?",
   "replaces": "Je n'y avais pas pensé. Ça vaut le coup d'essayer, mais il faut qu'elle connaisse le projet."
  },
  {
   "text": "Ça va, je n'ai pas froid.",
   "en": "It's okay, I'm not cold.",
   "ko": "괜찮아요, 안 추워요.",
   "replaces": "Alors, ça vaut le coup. Tu peux toujours revenir voir tes amis en prenant le train."
  }
 ],
 "f|fr-f1-19": [
  {
   "text": "Bonne soirée, Julie !",
   "en": "Have a nice evening, Julie!",
   "ko": "줄리, 좋은 저녁 보내요!",
   "replaces": "Voilà. Merci beaucoup. Bonne journée !"
  }
 ],
 "e|Merci beaucoup": [
  {
   "text": "Merci beaucoup pour le cadeau !",
   "en": "Thank you very much for the present!",
   "ko": "선물 정말 고마워요!",
   "replaces": "Voilà. Merci beaucoup. Bonne journée !"
  },
  {
   "text": "Merci beaucoup, c'est très gentil.",
   "en": "Thank you very much, that's very kind.",
   "ko": "정말 감사해요, 친절하시네요.",
   "replaces": "D'accord, merci beaucoup. Au revoir !"
  }
 ],
 "f|fr-f2-01": [
  {
   "text": "Hier, j'ai vu un très bon film.",
   "en": "Yesterday I saw a really good film.",
   "ko": "어제 아주 좋은 영화를 봤어요.",
   "replaces": "Non, merci. J'ai déjà fini. L'addition, s'il vous plaît."
  },
  {
   "text": "Ce matin, j'ai pris le bus.",
   "en": "This morning I took the bus.",
   "ko": "오늘 아침에 버스를 탔어요.",
   "replaces": "Oui, j'ai déjà fini. Je vais l'envoyer ce soir."
  }
 ],
 "e|J'ai déjà fini": [
  {
   "text": "Le ménage ? J'ai déjà fini.",
   "en": "The cleaning? I've already finished.",
   "ko": "청소요? 벌써 다 했어요.",
   "replaces": "Non, merci. J'ai déjà fini. L'addition, s'il vous plaît."
  }
 ],
 "f|fr-f2-03": [
  {
   "text": "Ce soir, je vais voir ma grand-mère.",
   "en": "Tonight I'm going to see my grandmother.",
   "ko": "오늘 저녁에 할머니를 뵈러 갈 거예요.",
   "replaces": "Samedi, je vais visiter le musée d'Orsay. Ça te dit ?"
  },
  {
   "text": "Demain, je vais faire les courses.",
   "en": "Tomorrow I'm going to do the shopping.",
   "ko": "내일 장을 볼 거예요.",
   "replaces": "Ça marche ! Je vais réserver les billets ce soir."
  },
  {
   "text": "Je vais appeler le médecin.",
   "en": "I'm going to call the doctor.",
   "ko": "의사에게 전화할 거예요.",
   "replaces": "Merci beaucoup. Je vais rester au lit ce soir."
  }
 ],
 "f|fr-f2-05": [
  {
   "text": "Je peux goûter ce fromage ?",
   "en": "Can I taste this cheese?",
   "ko": "이 치즈 맛봐도 돼요?",
   "replaces": "Excusez-moi, je peux prendre une photo de la terrasse ?"
  }
 ],
 "e|Excusez-moi": [
  {
   "text": "Excusez-moi, vous avez l'heure ?",
   "en": "Excuse me, do you have the time?",
   "ko": "실례지만, 지금 몇 시예요?",
   "replaces": "Excusez-moi, je peux prendre une photo de la terrasse ?"
  },
  {
   "text": "Excusez-moi, c'est ma place.",
   "en": "Excuse me, that's my seat.",
   "ko": "실례지만, 여기 제 자리예요.",
   "replaces": "Non, merci. Excusez-moi, où sont les toilettes ?"
  }
 ],
 "f|fr-f2-06": [
  {
   "text": "Tu peux m'aider à porter ce sac ?",
   "en": "Can you help me carry this bag?",
   "ko": "이 가방 드는 것 좀 도와줄래요?",
   "replaces": "Pas de problème. Tu peux arriver un peu en retard."
  }
 ],
 "e|Un peu": [
  {
   "text": "Je parle un peu anglais.",
   "en": "I speak a little English.",
   "ko": "저는 영어를 조금 해요.",
   "replaces": "Pas de problème. Tu peux arriver un peu en retard."
  },
  {
   "text": "Ajoute un peu de sel.",
   "en": "Add a bit of salt.",
   "ko": "소금을 조금 넣어요.",
   "replaces": "Dans l'ensemble, ça avance bien. Cela dit, on a pris un peu de retard sur les tests."
  },
  {
   "text": "Il fait un peu froid ce soir.",
   "en": "It's a bit cold tonight.",
   "ko": "오늘 저녁은 좀 추워요.",
   "replaces": "Sans vouloir te vexer, le refrain est un peu long. Le reste, j'aime beaucoup."
  }
 ],
 "f|fr-f2-10": [
  {
   "text": "Je prends un taxi parce que mon train est annulé.",
   "en": "I'm taking a taxi because my train is cancelled.",
   "ko": "기차가 취소돼서 택시를 타요.",
   "replaces": "Un peu, oui. Et je me réveille souvent la nuit parce que je tousse."
  }
 ],
 "f|fr-f2-11": [
  {
   "text": "On se retrouve chez Thomas vers huit heures ?",
   "en": "Shall we meet at Thomas's place around eight?",
   "ko": "여덟 시쯤 토마 집에서 만날까요?",
   "replaces": "D'accord. À quelle heure, alors ? Et on se retrouve où ?"
  }
 ],
 "e|D'accord": [
  {
   "text": "D'accord, à ce soir.",
   "en": "Okay, see you tonight.",
   "ko": "좋아요, 오늘 저녁에 봐요.",
   "replaces": "D'accord. À quelle heure, alors ? Et on se retrouve où ?"
  },
  {
   "text": "D'accord, je t'attends ici.",
   "en": "Okay, I'll wait for you here.",
   "ko": "알겠어요, 여기서 기다릴게요.",
   "replaces": "Je ne suis pas d'accord. Il faut qu'on se voie au moins la moitié de la semaine."
  },
  {
   "text": "Elle est d'accord avec moi.",
   "en": "She agrees with me.",
   "ko": "그녀는 제 말에 동의해요.",
   "replaces": "D'accord, merci beaucoup. Au revoir !"
  }
 ],
 "e|On se retrouve où": [
  {
   "text": "Pour le pique-nique, on se retrouve où ?",
   "en": "For the picnic, where shall we meet?",
   "ko": "소풍은 어디서 만나요?",
   "replaces": "D'accord. À quelle heure, alors ? Et on se retrouve où ?"
  }
 ],
 "f|fr-f2-12": [
  {
   "text": "On peut manger dehors ?",
   "en": "Can we eat outside?",
   "ko": "밖에서 먹어도 돼요?",
   "replaces": "Pas de problème. On peut y aller l'après-midi."
  }
 ],
 "f|fr-f2-13": [
  {
   "text": "J'ai mal au dos.",
   "en": "My back hurts.",
   "ko": "허리가 아파요.",
   "replaces": "Bonjour. J'ai mal à la tête et j'ai mal à la gorge."
  }
 ],
 "f|fr-f2-14": [
  {
   "text": "Qu'est-ce que vous conseillez comme fromage avec ce pain ?",
   "en": "What cheese do you recommend with this bread?",
   "ko": "이 빵에는 어떤 치즈를 추천하세요?",
   "replaces": "Pas encore. Qu'est-ce que vous conseillez ?"
  }
 ],
 "e|Pas encore": [
  {
   "text": "Pas encore, j'arrive dans dix minutes.",
   "en": "Not yet, I'll be there in ten minutes.",
   "ko": "아직이요, 십 분 뒤에 도착해요.",
   "replaces": "Pas encore. Qu'est-ce que vous conseillez ?"
  }
 ],
 "f|fr-f2-15": [
  {
   "text": "Pour moi, je vais prendre le poisson.",
   "en": "For me, I'll have the fish.",
   "ko": "저는 생선으로 할게요.",
   "replaces": "Hmm, je n'aime pas trop le chocolat. Je vais prendre la tarte et un thé."
  }
 ],
 "f|fr-f2-17": [
  {
   "text": "Je n'aime pas trop le froid.",
   "en": "I'm not very keen on the cold.",
   "ko": "저는 추위를 별로 안 좋아해요.",
   "replaces": "Hmm, je n'aime pas trop le chocolat. Je vais prendre la tarte et un thé."
  }
 ],
 "f|fr-f2-18": [
  {
   "text": "Je me suis coupé le doigt.",
   "en": "I cut my finger.",
   "ko": "손가락을 베었어요.",
   "replaces": "Je suis désolé ! Je me suis perdu dans le métro."
  },
  {
   "text": "Hier soir, je me suis couché tard.",
   "en": "Last night I went to bed late.",
   "ko": "어젯밤에 늦게 잤어요.",
   "replaces": "Avec plaisir ! Je me suis levé très tôt ce matin."
  }
 ],
 "e|Je suis désolé": [
  {
   "text": "Je suis désolé, je ne peux pas venir demain.",
   "en": "I'm sorry, I can't come tomorrow.",
   "ko": "미안해요, 내일 못 가요.",
   "replaces": "Je suis désolé ! Je me suis perdu dans le métro."
  },
  {
   "text": "Oh, je suis désolé pour ton chat.",
   "en": "Oh, I'm sorry about your cat.",
   "ko": "아, 고양이 일은 정말 안됐어요.",
   "replaces": "Alors là, c'est la goutte d'eau qui fait déborder le vase. Je suis désolé que tu aies vécu ça."
  }
 ],
 "f|fr-f3-01": [
  {
   "text": "Je pense que le magasin est fermé le dimanche.",
   "en": "I think the shop is closed on Sundays.",
   "ko": "그 가게는 일요일에 문을 닫는 것 같아요.",
   "replaces": "Je pense que c'est mieux. Je t'invite à boire un verre en attendant."
  }
 ],
 "f|fr-f3-02": [
  {
   "text": "Je trouve que cette ville est très agréable.",
   "en": "I find this city very pleasant.",
   "ko": "이 도시는 정말 쾌적한 것 같아요.",
   "replaces": "À mon avis, la deuxième partie était plus intéressante. Je trouve que les acteurs sont meilleurs."
  }
 ],
 "f|fr-f3-03": [
  {
   "text": "À mon avis, le train est plus pratique que la voiture.",
   "en": "In my opinion, the train is more practical than the car.",
   "ko": "제 생각에는 기차가 차보다 더 편리해요.",
   "replaces": "À mon avis, la deuxième partie était plus intéressante. Je trouve que les acteurs sont meilleurs."
  },
  {
   "text": "À mon avis, tu devrais te reposer ce week-end.",
   "en": "In my opinion, you should rest this weekend.",
   "ko": "제 생각에는 이번 주말에 쉬는 게 좋겠어요.",
   "replaces": "Ça se discute. Ce que l'auteur suggère, à mon avis, c'est qu'on ne s'en sort jamais vraiment."
  }
 ],
 "e|À mon avis": [
  {
   "text": "Ce restaurant est, à mon avis, le meilleur du quartier.",
   "en": "This restaurant is, in my opinion, the best in the neighbourhood.",
   "ko": "제 생각에 이 식당은 동네에서 제일 좋아요.",
   "replaces": "Ça se discute. Ce que l'auteur suggère, à mon avis, c'est qu'on ne s'en sort jamais vraiment."
  }
 ],
 "f|fr-f3-06": [
  {
   "text": "En fait, je ne suis jamais allé à Paris.",
   "en": "Actually, I've never been to Paris.",
   "ko": "사실 저는 파리에 가 본 적이 없어요.",
   "replaces": "Tu as raison. En fait, j'avais plus de batterie."
  }
 ],
 "f|fr-f3-13": [
  {
   "text": "Tu as raison, il vaut mieux partir tôt.",
   "en": "You're right, it's better to leave early.",
   "ko": "맞아요, 일찍 떠나는 게 나아요.",
   "replaces": "Tu as raison. En fait, j'avais plus de batterie."
  }
 ],
 "e|Tu as raison": [
  {
   "text": "Bon, tu as raison, c'était une mauvaise idée.",
   "en": "Okay, you're right, it was a bad idea.",
   "ko": "그래요, 맞아요, 나쁜 생각이었어요.",
   "replaces": "Tu as raison. En fait, j'avais plus de batterie."
  }
 ],
 "f|fr-f3-07": [
  {
   "text": "Vous pourriez fermer la fenêtre ?",
   "en": "Could you close the window?",
   "ko": "창문 좀 닫아 주시겠어요?",
   "replaces": "Parfait. Vous pourriez me prévenir par message ? Je serai peut-être au musée."
  },
  {
   "text": "Tu pourrais m'apporter un verre d'eau ?",
   "en": "Could you bring me a glass of water?",
   "ko": "물 한 잔 갖다줄래요?",
   "replaces": "Je ne suis pas sûr de comprendre. Tu pourrais me montrer comment faire ?"
  },
  {
   "text": "Vous pourriez m'indiquer le chemin de la gare ?",
   "en": "Could you show me the way to the station?",
   "ko": "역 가는 길 좀 알려 주시겠어요?",
   "replaces": "Ça ne m'étonne pas. Vous pourriez l'appeler, s'il vous plaît ?"
  }
 ],
 "f|fr-f3-11": [
  {
   "text": "Je ne suis pas sûr de l'heure du rendez-vous.",
   "en": "I'm not sure about the time of the appointment.",
   "ko": "약속 시간이 확실하지 않아요.",
   "replaces": "Je ne suis pas sûr de comprendre. Tu pourrais me montrer comment faire ?"
  }
 ],
 "f|fr-f3-09": [
  {
   "text": "Il y a un souci avec la facture d'électricité.",
   "en": "There's a problem with the electricity bill.",
   "ko": "전기 요금 고지서에 문제가 있어요.",
   "replaces": "Bonjour, c'est Minho, de l'appartement rue Lepic. Il y a un souci avec le chauffe-eau."
  }
 ],
 "f|fr-f3-10": [
  {
   "text": "Mon téléphone ne marche pas depuis hier.",
   "en": "My phone hasn't worked since yesterday.",
   "ko": "제 휴대폰이 어제부터 안 돼요.",
   "replaces": "Ça ne marche pas. Ce matin, l'eau était froide quand j'ai pris ma douche."
  },
  {
   "text": "La machine à café ne marche pas.",
   "en": "The coffee machine doesn't work.",
   "ko": "커피 머신이 고장 났어요.",
   "replaces": "Merci. Pour résumer : l'appareil ne marche pas, alors que je l'ai à peine utilisé."
  }
 ],
 "f|fr-f4-18": [
  {
   "text": "Mon frère adore le sport, alors que moi, je préfère lire.",
   "en": "My brother loves sport, whereas I prefer reading.",
   "ko": "제 오빠는 운동을 좋아하는데, 저는 책 읽는 걸 더 좋아해요.",
   "replaces": "Merci. Pour résumer : l'appareil ne marche pas, alors que je l'ai à peine utilisé."
  },
  {
   "text": "Elle travaille le week-end, alors que son mari est toujours libre.",
   "en": "She works at weekends, whereas her husband is always free.",
   "ko": "그녀는 주말에 일하는데, 남편은 늘 한가해요.",
   "replaces": "Je me demande si ça suffirait. Les loyers augmentent, alors que beaucoup d'appartements sont vides."
  }
 ],
 "f|fr-f4-20": [
  {
   "text": "Pour résumer, le projet avance bien mais coûte cher.",
   "en": "To sum up, the project is going well but it's expensive.",
   "ko": "요약하면, 프로젝트는 잘 진행되지만 비용이 많이 들어요.",
   "replaces": "Merci. Pour résumer : l'appareil ne marche pas, alors que je l'ai à peine utilisé."
  }
 ],
 "f|fr-f3-15": [
  {
   "text": "Le marché est ouvert ce matin. On y va ensemble ?",
   "en": "The market is open this morning. Shall we go together?",
   "ko": "오늘 아침에 시장이 열려요. 같이 갈까요?",
   "replaces": "Ah, mince. Du coup, on fait quoi ? On y va quand même ?"
  }
 ],
 "f|fr-f3-19": [
  {
   "text": "Désolé du retard, j'ai raté mon bus.",
   "en": "Sorry I'm late, I missed my bus.",
   "ko": "늦어서 미안해요, 버스를 놓쳤어요.",
   "replaces": "Désolé du retard ! Le métro s'est arrêté entre deux stations."
  }
 ],
 "f|fr-f4-01": [
  {
   "text": "D'un côté, j'aime mon travail, mais il est très fatigant.",
   "en": "On the one hand, I like my job, but it's very tiring.",
   "ko": "한편으로는 제 일이 좋지만, 아주 피곤해요.",
   "replaces": "D'un côté, on gagne du temps. De l'autre, on se sent vite isolé."
  }
 ],
 "e|De l'autre": [
  {
   "text": "D'une part, le loyer est bas ; de l'autre, l'appartement est petit.",
   "en": "On the one hand, the rent is low; on the other, the flat is small.",
   "ko": "한편으로는 집세가 싸고, 다른 한편으로는 집이 작아요.",
   "replaces": "D'un côté, on gagne du temps. De l'autre, on se sent vite isolé."
  }
 ],
 "f|fr-f4-02": [
  {
   "text": "Le film était long. Cela dit, je ne me suis pas ennuyé.",
   "en": "The film was long. That said, I wasn't bored.",
   "ko": "영화가 길었어요. 그렇긴 해도 지루하지 않았어요.",
   "replaces": "Dans l'ensemble, ça avance bien. Cela dit, on a pris un peu de retard sur les tests."
  }
 ],
 "e|Dans l'ensemble": [
  {
   "text": "Dans l'ensemble, les vacances se sont bien passées.",
   "en": "On the whole, the holiday went well.",
   "ko": "전반적으로 휴가는 잘 보냈어요.",
   "replaces": "Dans l'ensemble, ça avance bien. Cela dit, on a pris un peu de retard sur les tests."
  }
 ],
 "f|fr-f4-03": [
  {
   "text": "Le quartier est bruyant. En revanche, les loyers sont bas.",
   "en": "The neighbourhood is noisy. On the other hand, rents are low.",
   "ko": "동네가 시끄러워요. 반면에 집세는 싸요.",
   "replaces": "En revanche, si on livrait à temps, il y aurait sûrement des bugs."
  }
 ],
 "f|fr-f4-04": [
  {
   "text": "J'adore la mer. Par contre, je déteste le sable.",
   "en": "I love the sea. But I hate sand.",
   "ko": "저는 바다를 좋아해요. 그런데 모래는 싫어요.",
   "replaces": "Je comprends ton point de vue. Par contre, une visio, ça ne remplace pas un café ensemble."
  }
 ],
 "f|fr-f4-07": [
  {
   "text": "Je comprends ton point de vue, mais je préfère attendre.",
   "en": "I see your point, but I'd rather wait.",
   "ko": "당신 입장은 이해하지만, 저는 기다리고 싶어요.",
   "replaces": "Je comprends ton point de vue. Par contre, une visio, ça ne remplace pas un café ensemble."
  }
 ],
 "e|Par contre": [
  {
   "text": "Le gâteau est bon, par contre il est trop sucré.",
   "en": "The cake is good, but it's too sweet.",
   "ko": "케이크는 맛있는데, 너무 달아요.",
   "replaces": "Je comprends ton point de vue. Par contre, une visio, ça ne remplace pas un café ensemble."
  }
 ],
 "f|fr-f4-05": [
  {
   "text": "Le magasin ferme à midi. Autrement dit, il faut se dépêcher.",
   "en": "The shop closes at noon. In other words, we need to hurry.",
   "ko": "가게가 정오에 문을 닫아요. 다시 말해 서둘러야 해요.",
   "replaces": "Il faudrait qu'on puisse décaler la livraison d'une semaine. Autrement dit, au vingt-deux."
  }
 ],
 "f|fr-f4-11": [
  {
   "text": "Il faudrait qu'on parte plus tôt demain.",
   "en": "We would need to leave earlier tomorrow.",
   "ko": "내일은 더 일찍 출발해야 할 것 같아요.",
   "replaces": "Il faudrait qu'on puisse décaler la livraison d'une semaine. Autrement dit, au vingt-deux."
  }
 ],
 "e|Il faudrait": [
  {
   "text": "Il faudrait acheter du pain pour ce soir.",
   "en": "We'd need to buy some bread for tonight.",
   "ko": "오늘 저녁에 먹을 빵을 사야 할 것 같아요.",
   "replaces": "Il faudrait qu'on puisse décaler la livraison d'une semaine. Autrement dit, au vingt-deux."
  }
 ],
 "f|fr-f4-06": [
  {
   "text": "Je ne suis pas d'accord : ce film n'est pas ennuyeux.",
   "en": "I don't agree: this film isn't boring.",
   "ko": "동의하지 않아요. 이 영화는 지루하지 않아요.",
   "replaces": "Je ne suis pas d'accord. Il faut qu'on se voie au moins la moitié de la semaine."
  }
 ],
 "f|fr-f4-10": [
  {
   "text": "Il faut que je parte maintenant.",
   "en": "I have to leave now.",
   "ko": "이제 가야 해요.",
   "replaces": "Je ne suis pas d'accord. Il faut qu'on se voie au moins la moitié de la semaine."
  },
  {
   "text": "Il faut qu'il voie un médecin rapidement.",
   "en": "He has to see a doctor quickly.",
   "ko": "그는 빨리 의사에게 가 봐야 해요.",
   "replaces": "Je n'y avais pas pensé. Ça vaut le coup d'essayer, mais il faut qu'elle connaisse le projet."
  }
 ],
 "f|fr-f4-08": [
  {
   "text": "Si j'étais toi, je prendrais un parapluie.",
   "en": "If I were you, I'd take an umbrella.",
   "ko": "제가 당신이라면 우산을 챙길 거예요.",
   "replaces": "Si j'étais toi, je ne refuserais pas une offre pareille."
  }
 ],
 "f|fr-f4-19": [
  {
   "text": "Ça vaut le coup de visiter ce musée.",
   "en": "It's worth visiting this museum.",
   "ko": "이 박물관은 가 볼 만해요.",
   "replaces": "Je n'y avais pas pensé. Ça vaut le coup d'essayer, mais il faut qu'elle connaisse le projet."
  },
  {
   "text": "Le voyage est long, mais ça vaut le coup de voir la mer.",
   "en": "The journey is long, but it's worth it to see the sea.",
   "ko": "가는 길은 길지만 바다를 볼 만한 가치가 있어요.",
   "replaces": "Alors, ça vaut le coup. Tu peux toujours revenir voir tes amis en prenant le train."
  }
 ],
 "e|Ça vaut le coup": [
  {
   "text": "C'est cher, mais ça vaut le coup.",
   "en": "It's expensive, but it's worth it.",
   "ko": "비싸지만 그만한 가치가 있어요.",
   "replaces": "Je n'y avais pas pensé. Ça vaut le coup d'essayer, mais il faut qu'elle connaisse le projet."
  }
 ],
 "f|fr-f4-15": [
  {
   "text": "Le contrat ? Je vous l'envoie demain matin.",
   "en": "The contract? I'll send it to you tomorrow morning.",
   "ko": "계약서요? 내일 아침에 보내 드릴게요.",
   "replaces": "Comme convenu, je vous l'envoie ce soir, et je vous tiens au courant pour les tests."
  }
 ],
 "e|Je vous tiens au courant": [
  {
   "text": "Le médecin doit me rappeler, je vous tiens au courant.",
   "en": "The doctor is supposed to call me back, I'll keep you posted.",
   "ko": "의사가 다시 전화하기로 했어요, 소식 알려 드릴게요.",
   "replaces": "Comme convenu, je vous l'envoie ce soir, et je vous tiens au courant pour les tests."
  }
 ],
 "f|fr-f4-17": [
  {
   "text": "Je me détends en prenant un bain chaud.",
   "en": "I relax by taking a hot bath.",
   "ko": "따뜻한 목욕을 하면서 긴장을 풀어요.",
   "replaces": "Alors, ça vaut le coup. Tu peux toujours revenir voir tes amis en prenant le train."
  }
 ],
 "f|fr-f5-01": [
  {
   "text": "À vrai dire, je n'ai jamais aimé le café.",
   "en": "To tell the truth, I've never liked coffee.",
   "ko": "사실대로 말하면 저는 커피를 좋아한 적이 없어요.",
   "replaces": "À vrai dire, je dirais plutôt qu'elle est maladroite. Scandaleuse, je n'irais pas jusque-là."
  },
  {
   "text": "À vrai dire, je préfère rester à la maison ce soir.",
   "en": "To tell the truth, I'd rather stay home tonight.",
   "ko": "사실 오늘 저녁은 집에 있고 싶어요.",
   "replaces": "À vrai dire, les personnages aussi caricaturaux, ce n'est pas mon truc."
  }
 ],
 "f|fr-f5-02": [
  {
   "text": "Triste ? Je dirais plutôt qu'il est fatigué.",
   "en": "Sad? I'd rather say he's tired.",
   "ko": "슬퍼 보인다고요? 오히려 피곤한 것 같아요.",
   "replaces": "À vrai dire, je dirais plutôt qu'elle est maladroite. Scandaleuse, je n'irais pas jusque-là."
  }
 ],
 "f|fr-f5-03": [
  {
   "text": "Un chef-d'œuvre ? Je n'irais pas jusque-là.",
   "en": "A masterpiece? I wouldn't go that far.",
   "ko": "걸작이요? 그렇게까지는 아니에요.",
   "replaces": "À vrai dire, je dirais plutôt qu'elle est maladroite. Scandaleuse, je n'irais pas jusque-là."
  }
 ],
 "e|À vrai dire": [
  {
   "text": "Le repas, à vrai dire, ne m'a pas impressionné.",
   "en": "To tell the truth, the meal didn't impress me.",
   "ko": "솔직히 그 식사는 별로 인상적이지 않았어요.",
   "replaces": "À vrai dire, je dirais plutôt qu'elle est maladroite. Scandaleuse, je n'irais pas jusque-là."
  }
 ],
 "e|Je n'irais pas jusque-là": [
  {
   "text": "La meilleure de l'équipe ? Je n'irais pas jusque-là.",
   "en": "The best on the team? I wouldn't go that far.",
   "ko": "팀에서 최고라고요? 그렇게까지는 아니에요.",
   "replaces": "À vrai dire, je dirais plutôt qu'elle est maladroite. Scandaleuse, je n'irais pas jusque-là."
  }
 ],
 "f|fr-f5-18": [
  {
   "text": "Les jeux vidéo, ce n'est pas mon truc.",
   "en": "Video games aren't my thing.",
   "ko": "비디오 게임은 제 취향이 아니에요.",
   "replaces": "À vrai dire, les personnages aussi caricaturaux, ce n'est pas mon truc."
  },
  {
   "text": "Danser en boîte, ce n'est pas mon truc.",
   "en": "Dancing in clubs isn't my thing.",
   "ko": "클럽에서 춤추는 건 제 취향이 아니에요.",
   "replaces": "Il me semble qu'on pourrait couper la deuxième partie sans rien perdre. Les refrains interminables, ce n'est pas mon truc."
  }
 ],
 "e|Ce n'est pas mon truc": [
  {
   "text": "Merci pour l'invitation, mais le camping, ce n'est pas mon truc.",
   "en": "Thanks for the invitation, but camping isn't my thing.",
   "ko": "초대해 줘서 고마워요, 그런데 캠핑은 제 취향이 아니에요.",
   "replaces": "À vrai dire, les personnages aussi caricaturaux, ce n'est pas mon truc."
  }
 ],
 "f|fr-f5-04": [
  {
   "text": "Ce qui me gêne, c'est le bruit la nuit.",
   "en": "What bothers me is the noise at night.",
   "ko": "제가 신경 쓰이는 건 밤의 소음이에요.",
   "replaces": "C'est pas faux. Ce qui me gêne, c'est justement la méthode, pas forcément le fond."
  }
 ],
 "f|fr-f5-05": [
  {
   "text": "C'est toi qui as choisi ce restaurant ?",
   "en": "Are you the one who chose this restaurant?",
   "ko": "이 식당을 고른 사람이 당신이에요?",
   "replaces": "Bref, et si on parlait plutôt du dessert ? Il paraît que c'est toi qui l'as fait."
  }
 ],
 "f|fr-f5-06": [
  {
   "text": "Bien que la maison soit petite, on s'y sent bien.",
   "en": "Although the house is small, we feel at home there.",
   "ko": "집은 작지만 지내기 좋아요.",
   "replaces": "Ha ! Loin de là. Bien que je comprenne le problème du financement, j'aurais préféré un vrai débat."
  },
  {
   "text": "Bien que je sois fatigué, je finirai ce dossier ce soir.",
   "en": "Although I'm tired, I'll finish this file tonight.",
   "ko": "피곤하지만 오늘 밤에 이 서류를 끝낼 거예요.",
   "replaces": "Ah, tant mieux ! Bien que je reste sceptique, j'irai le voir."
  },
  {
   "text": "Bien que le film dure trois heures, on ne s'ennuie pas.",
   "en": "Although the film lasts three hours, you don't get bored.",
   "ko": "영화가 세 시간이나 되지만 지루하지 않아요.",
   "replaces": "Il ne manquait plus que ça ! Bien que ce soit rageant, tu as au moins bien mangé ?"
  }
 ],
 "f|fr-f5-08": [
  {
   "text": "J'aurais dû prendre un parapluie.",
   "en": "I should have taken an umbrella.",
   "ko": "우산을 챙겼어야 했어요.",
   "replaces": "Tant pis, elle a l'air délicieuse. J'aurais dû apporter du cidre pour l'accompagner !"
  },
  {
   "text": "J'aurais dû t'écouter.",
   "en": "I should have listened to you.",
   "ko": "당신 말을 들었어야 했어요.",
   "replaces": "Bref, ce soir, je t'emmène dîner. J'aurais dû te le proposer plus tôt !"
  }
 ],
 "f|fr-f5-10": [
  {
   "text": "Je suis désolé que tu aies raté ton train.",
   "en": "I'm sorry you missed your train.",
   "ko": "기차를 놓쳤다니 안타까워요.",
   "replaces": "Alors là, c'est la goutte d'eau qui fait déborder le vase. Je suis désolé que tu aies vécu ça."
  }
 ],
 "f|fr-f5-12": [
  {
   "text": "Il semblerait que la réunion soit annulée.",
   "en": "It would seem the meeting has been cancelled.",
   "ko": "회의가 취소된 것 같아요.",
   "replaces": "Il semblerait que personne n'ait vraiment écouté les syndicats, soit dit en passant."
  }
 ],
 "f|fr-f5-13": [
  {
   "text": "Il serait peut-être utile de prévenir les voisins avant les travaux.",
   "en": "It might be useful to warn the neighbours before the work starts.",
   "ko": "공사 전에 이웃에게 미리 알리는 게 좋을 것 같아요.",
   "replaces": "Il serait peut-être utile de comparer ce qui est inclus dans chaque offre."
  }
 ],
 "f|fr-f5-15": [
  {
   "text": "Force est de constater que les prix ont beaucoup augmenté.",
   "en": "One has to admit that prices have gone up a lot.",
   "ko": "물가가 많이 올랐다는 걸 인정할 수밖에 없어요.",
   "replaces": "Force est de constater que tout le monde est resté sur ses positions."
  }
 ],
 "f|fr-f5-16": [
  {
   "text": "Il se trouve que je connais bien ce quartier.",
   "en": "As it happens, I know this neighbourhood well.",
   "ko": "마침 제가 이 동네를 잘 알아요.",
   "replaces": "Je comprends. Il se trouve que ce tarif comprend la maintenance pendant un an."
  }
 ],
 "f|fr-f5-17": [
  {
   "text": "Sans vouloir te vexer, ta soupe manque de sel.",
   "en": "No offence, but your soup needs more salt.",
   "ko": "기분 나쁘게 듣지 마요, 수프가 좀 싱거워요.",
   "replaces": "Sans vouloir te vexer, le refrain est un peu long. Le reste, j'aime beaucoup."
  }
 ],
 "e|On pourrait": [
  {
   "text": "On pourrait aller au cinéma ce soir.",
   "en": "We could go to the cinema tonight.",
   "ko": "오늘 저녁에 영화 보러 갈까요?",
   "replaces": "Il me semble qu'on pourrait couper la deuxième partie sans rien perdre. Les refrains interminables, ce n'est pas mon truc."
  },
  {
   "text": "S'il fait beau, on pourrait manger dans le jardin.",
   "en": "If the weather's nice, we could eat in the garden.",
   "ko": "날씨가 좋으면 정원에서 먹어도 좋겠어요.",
   "replaces": "Quoi qu'il en soit, on pourrait en reparler autour d'un autre verre."
  }
 ],
 "f|fr-f5-19": [
  {
   "text": "Il vaudrait peut-être mieux que nous partions avant la pluie.",
   "en": "It might be better for us to leave before the rain.",
   "ko": "비 오기 전에 떠나는 게 나을 것 같아요.",
   "replaces": "Il vaudrait peut-être mieux que tu lui dises clairement ce que tu ressens."
  }
 ],
 "e|Pas de problème": [
  {
   "text": "Pas de problème, je t'attends.",
   "en": "No problem, I'll wait for you.",
   "ko": "문제없어요, 기다릴게요.",
   "replaces": "Pas de problème, ça arrive. Merci pour votre aide !"
  }
 ],
 "e|Bon courage": [
  {
   "text": "Bon courage pour ton examen !",
   "en": "Good luck with your exam!",
   "ko": "시험 잘 봐요!",
   "replaces": "À demain ! Et bon courage pour le dentiste !"
  }
 ],
 "e|Ça dépend": [
  {
   "text": "Ça dépend du temps qu'il fera.",
   "en": "It depends on the weather.",
   "ko": "날씨에 따라 달라요.",
   "replaces": "Aucune idée. Ça dépend des scénaristes, je suppose."
  }
 ]
};
