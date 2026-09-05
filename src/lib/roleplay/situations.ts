/**
 * The situations worth being able to handle.
 *
 * A list of briefs, not scripts. Each one says where it happens, who the tutor
 * plays and what the learner is there to get done; the graph that realises it is
 * drafted from this and then reviewed by a person, because a phrasing nobody
 * checked is not a neutral mistake in a language app — it is teaching the wrong
 * thing.
 *
 * Chosen for being unavoidable rather than interesting. These are the exchanges
 * someone actually has in a week abroad, in roughly the order they meet them,
 * and the reason a learner would open the app at all. Nothing here is a lesson
 * topic; every one is an errand.
 */

export type SituationBrief = {
  /** Becomes the scenario id, so it is stable once audio exists for it. */
  id: string;
  title: string;
  /** Who the tutor plays. The learner always plays themselves. */
  tutorRole: string;
  /** Where this happens, in enough detail to place a tutor arriving mid-scene. */
  setting: string;
  /** What the learner is trying to walk away with. */
  objective: string;
  /**
   * The turn most likely to go wrong, which is where a branch or a scripted
   * recovery earns its keep. Written down because the drafter cannot guess it
   * and a reviewer should not have to rediscover it.
   */
  likelyTrouble: string;
};

export const SITUATIONS: SituationBrief[] = [
  {
    id: "cafe-order",
    title: "Ordering at a café",
    tutorRole: "barista",
    setting:
      "A small café at mid-morning. The tutor is the barista behind the counter; the learner is a customer who has just walked in. It is not busy, so the barista has time to be friendly and to repeat things.",
    objective: "Order a drink, choose a size, and pay.",
    likelyTrouble: "Not knowing that \"for here or to go\" is asking where they will drink it.",
  },
  {
    id: "restaurant-table",
    title: "Getting a table",
    tutorRole: "host at the door",
    setting:
      "The entrance of a busy restaurant at dinner time. The tutor is the host with a tablet; the learner has arrived without a booking.",
    objective: "Ask for a table, say how many people, and accept or decline the wait.",
    likelyTrouble: "Answering a wait time with a yes or no instead of deciding.",
  },
  {
    id: "restaurant-order",
    title: "Ordering a meal",
    tutorRole: "server",
    setting:
      "A restaurant table, menus already handed out. The tutor is the server coming back to take the order; the learner has read the menu but not decided everything.",
    objective: "Order a main, ask one question about a dish, and settle drinks.",
    likelyTrouble: "Wanting to ask what is in something and having no phrase for it.",
  },
  {
    id: "shop-size",
    title: "Trying something on",
    tutorRole: "shop assistant",
    setting:
      "A clothing shop. The tutor works there; the learner is holding something in the wrong size.",
    objective: "Ask for another size, find the fitting room, and decide.",
    likelyTrouble: "Asking for a size without saying which item.",
  },
  {
    id: "pharmacy",
    title: "Buying medicine",
    tutorRole: "pharmacist",
    setting:
      "A pharmacy counter. The tutor is the pharmacist; the learner is unwell and does not know the local name for what they need.",
    objective: "Describe the symptom, get something for it, and understand the dose.",
    likelyTrouble: "Describing a symptom without the word for it.",
  },
  {
    id: "directions",
    title: "Asking the way",
    tutorRole: "passer-by",
    setting:
      "A street corner. The tutor is a local who is happy to help but walking somewhere; the learner is lost and holding a phone.",
    objective: "Ask for a place, follow the directions, and confirm them back.",
    likelyTrouble: "Nodding through directions that were not understood.",
  },
  {
    id: "taxi",
    title: "Taking a taxi",
    tutorRole: "driver",
    setting:
      "The back of a taxi that has just pulled over. The tutor is the driver; the learner has an address written down.",
    objective: "Give the destination, agree the route or price, and stop where they want.",
    likelyTrouble: "Not being able to say \"here is fine\" at the right moment.",
  },
  {
    id: "hotel-checkin",
    title: "Checking into a hotel",
    tutorRole: "receptionist",
    setting:
      "A hotel front desk in the afternoon. The tutor is the receptionist; the learner has a booking on their phone.",
    objective: "Give the booking name, hand over ID, and learn the breakfast time.",
    likelyTrouble: "Being asked for something and not catching which document.",
  },
  {
    id: "hotel-problem",
    title: "Something wrong with the room",
    tutorRole: "receptionist",
    setting:
      "A hotel front desk, evening. The tutor is the receptionist; the learner has come down because something in the room does not work.",
    objective: "Explain the problem, say the room number, and agree what happens next.",
    likelyTrouble: "Describing a fault without the noun for the thing that is broken.",
  },
  {
    id: "airport-checkin",
    title: "Checking in for a flight",
    tutorRole: "check-in agent",
    setting:
      "An airline desk. The tutor is the agent; the learner has one bag to check and a preference about seats.",
    objective: "Check a bag, ask about a seat, and understand the gate and time.",
    likelyTrouble: "Losing the gate number in a sentence full of other numbers.",
  },
  {
    id: "immigration",
    title: "At passport control",
    tutorRole: "border officer",
    setting:
      "An immigration desk. The tutor is the officer, polite but brisk; the learner is arriving as a tourist.",
    objective: "Say why they are visiting, how long, and where they are staying.",
    likelyTrouble: "Answering \"how long\" with a date instead of a duration.",
  },
  {
    id: "supermarket",
    title: "Finding something in a shop",
    tutorRole: "shop worker stacking shelves",
    setting:
      "A supermarket aisle. The tutor works there and is mid-task but willing to help; the learner cannot find one item.",
    objective: "Ask where something is and understand the aisle directions.",
    likelyTrouble: "Not knowing the local word for the item at all.",
  },
  {
    id: "bank-account",
    title: "Opening an account",
    tutorRole: "bank clerk",
    setting:
      "A bank branch, seated at a desk. The tutor is the clerk with a form on screen; the learner has just moved to the country.",
    objective: "Say what kind of account, provide documents, and learn what happens next.",
    likelyTrouble: "Being asked for a document they do not have with them.",
  },
  {
    id: "phone-plan",
    title: "Getting a phone plan",
    tutorRole: "shop assistant",
    setting:
      "A mobile phone shop. The tutor is the assistant; the learner wants data but not a long contract.",
    objective: "Say what they need, compare two plans, and choose one.",
    likelyTrouble: "Agreeing to a contract length they did not understand.",
  },
  {
    id: "doctor-visit",
    title: "Seeing a doctor",
    tutorRole: "doctor",
    setting:
      "A consulting room. The tutor is the doctor; the learner has been unwell for a few days.",
    objective: "Describe symptoms, say how long, and understand the advice.",
    likelyTrouble: "Understanding instructions about when and how often to take something.",
  },
  {
    id: "haircut",
    title: "Getting a haircut",
    tutorRole: "hairdresser",
    setting:
      "A salon chair. The tutor is the hairdresser; the learner has an idea of what they want but not the words.",
    objective: "Say how much to take off and stop it going too short.",
    likelyTrouble: "Having no way to say \"a bit shorter\" without risking a lot shorter.",
  },
  {
    id: "post-office",
    title: "Sending a parcel",
    tutorRole: "post office clerk",
    setting:
      "A post office counter. The tutor is the clerk; the learner has a box to send abroad.",
    objective: "Send it, choose a speed, and understand the cost.",
    likelyTrouble: "Being asked what is inside and how much it is worth.",
  },
  {
    id: "apartment-viewing",
    title: "Viewing a flat",
    tutorRole: "letting agent",
    setting:
      "An empty flat during a viewing. The tutor is the agent; the learner is deciding whether to apply.",
    objective: "Ask about rent, bills and the contract, and say whether they are interested.",
    likelyTrouble: "Not asking what is included, and finding out later.",
  },
  {
    id: "job-interview",
    title: "A first interview",
    tutorRole: "interviewer",
    setting:
      "A meeting room. The tutor is interviewing for a junior role; the learner has a CV and some nerves.",
    objective: "Introduce themselves, describe experience, and ask one question back.",
    likelyTrouble: "Answering \"tell me about yourself\" with a life story.",
  },
  {
    id: "small-talk-colleague",
    title: "Small talk at work",
    tutorRole: "colleague by the kettle",
    setting:
      "An office kitchen on a Monday. The tutor is a friendly colleague; the learner has been there two weeks.",
    objective: "Get through a short exchange about the weekend without stalling.",
    likelyTrouble: "Answering a question and leaving nothing for the other person.",
  },
  {
    id: "meeting-opinion",
    title: "Saying what you think in a meeting",
    tutorRole: "team lead",
    setting:
      "A small team meeting. The tutor is running it and has just asked for opinions; the learner disagrees with the plan.",
    objective: "Disagree politely, give a reason, and suggest something.",
    likelyTrouble: "Disagreeing so softly nobody notices, or so bluntly it lands badly.",
  },
  {
    id: "phone-call-booking",
    title: "Booking by phone",
    tutorRole: "person answering the phone",
    setting:
      "A phone call to a restaurant. Neither side can see the other, and the line is not perfect.",
    objective: "Book a table for a date and time and confirm the name.",
    likelyTrouble: "Spelling a name aloud, and numbers heard wrong.",
  },
  {
    id: "complaint-shop",
    title: "Returning something",
    tutorRole: "shop assistant",
    setting:
      "A shop counter. The tutor is the assistant; the learner has something faulty and a receipt.",
    objective: "Explain what is wrong, ask for a refund or exchange, and reach an outcome.",
    likelyTrouble: "Softening the complaint until it sounds like a question.",
  },
  {
    id: "lost-property",
    title: "Losing something",
    tutorRole: "station staff member",
    setting:
      "A station information desk. The tutor works there; the learner left a bag on a train an hour ago.",
    objective: "Describe the item, say where and when, and leave contact details.",
    likelyTrouble: "Describing an object in enough detail to be found.",
  },
  {
    id: "train-ticket",
    title: "Buying a train ticket",
    tutorRole: "ticket clerk",
    setting:
      "A ticket window. The tutor is the clerk; there is a queue behind the learner.",
    objective: "Buy the right ticket for a time and understand the platform.",
    likelyTrouble: "Return versus single, decided under time pressure.",
  },
  {
    id: "gym-signup",
    title: "Joining a gym",
    tutorRole: "receptionist",
    setting:
      "A gym reception. The tutor is showing the learner around; the learner wants a short membership.",
    objective: "Ask about prices and terms, and avoid signing up for a year.",
    likelyTrouble: "Being sold the longer plan and not knowing how to say no.",
  },
  {
    id: "neighbour-noise",
    title: "A word with a neighbour",
    tutorRole: "neighbour",
    setting:
      "A doorway, late evening. The tutor is the neighbour whose music is loud; the learner has to live next to them tomorrow.",
    objective: "Raise the problem without making an enemy, and agree something.",
    likelyTrouble: "Going straight to the complaint with no softening at all.",
  },
  {
    id: "delivery-problem",
    title: "A delivery that went wrong",
    tutorRole: "customer service agent",
    setting:
      "A phone call to a delivery company. The tutor is the agent following a script; the learner's parcel never arrived.",
    objective: "Give the order details, explain the problem, and get a resolution.",
    likelyTrouble: "Losing the thread while reading out a long order number.",
  },
  {
    id: "making-plans",
    title: "Making plans with a friend",
    tutorRole: "friend",
    setting:
      "A message-like conversation, spoken. The tutor is a friend suggesting something this weekend; the learner is busy on one of the days.",
    objective: "Agree a day and a time, and say what they will do.",
    likelyTrouble: "Turning down a day without sounding like turning down the plan.",
  },
  {
    id: "introducing-yourself",
    title: "Meeting someone new",
    tutorRole: "someone at a gathering",
    setting:
      "A party where the learner knows one person. The tutor is a stranger who has just said hello.",
    objective: "Exchange names, say what they do, and find one thing in common.",
    likelyTrouble: "Running out after the name and the job.",
  },
];

export function findSituation(id: string): SituationBrief | null {
  return SITUATIONS.find((situation) => situation.id === id) ?? null;
}
