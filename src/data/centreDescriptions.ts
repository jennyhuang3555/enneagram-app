interface CentreDescription {
  title: string;
  centerOverview: string;
  typeInContext: string;
  typeComparison: string;
  mentalPattern: string;
  coreStruggle: string;
  commonPhrases: string[];
  hiddenFears: string;
  keyChallenge: string;
  spiritualLesson: string;
}

interface CentreTypeDescriptions {
  [key: string]: {
    head?: CentreDescription;
    heart?: CentreDescription;
    body?: CentreDescription;
  };
}

export const centreDescriptions: CentreTypeDescriptions = {
  "1": {
    body: {
      title: "The Body Center: Type 1 - The Reformer",
      centerOverview: "The Body Center, comprising Types 8, 9, and 1, is the realm of instinctual intelligence. It governs our relationship with power, autonomy, and physical presence.",
      typeInContext: "Type 1, the Reformer, channels body energy into precise, controlled action. While Type 8 expresses raw power and Type 9 seeks peace, Type 1 strives for perfection through disciplined behavior.",
      typeComparison: "In simple terms: The 8 asserts power directly, the 9 diffuses it, and the 1 controls it through principle and structure.",
      mentalPattern: "The One's body awareness is highly regulated: every movement and action is monitored for correctness and improvement.",
      coreStruggle: "Ones struggle with an inner tension between natural impulses and their strict internal standards.",
      commonPhrases: [
        "This needs to be done right.",
        "There's a better way to do this.",
        "That's not correct.",
        "It should be perfect."
      ],
      hiddenFears: "Beneath the surface lies the fear: 'What if I'm fundamentally flawed or corrupt?'",
      keyChallenge: "The One's challenge is learning to relax their grip on perfection and accept the natural flow of life.",
      spiritualLesson: "True perfection includes imperfection. The spiritual journey involves finding peace with what is, rather than constantly trying to improve it."
    }
  },
  "2": {
    heart: {
      title: "The Heart Center: Type 2 - The Helper",
      centerOverview: "The Heart Center, comprising Types 2, 3, and 4, is the realm of emotional intelligence. It governs our relationship with identity, image, and feelings.",
      typeInContext: "Type 2, the Helper, expresses heart energy through connection and care. While Type 3 achieves and Type 4 individualizes, Type 2 relates and supports.",
      typeComparison: "In simple terms: The 3 performs to be valued, the 4 expresses to be unique, and the 2 gives to be loved.",
      mentalPattern: "The Two's emotional awareness is focused outward: constantly scanning for others' needs and feelings.",
      coreStruggle: "Twos struggle with acknowledging their own needs while being hyper-aware of others' needs.",
      commonPhrases: [
        "Let me help you with that.",
        "What do you need?",
        "I'm here for you.",
        "It's no trouble at all."
      ],
      hiddenFears: "Beneath the surface lies the fear: 'Am I worthy of love for myself, not just for what I give?'",
      keyChallenge: "The Two's challenge is learning to receive as freely as they give and to acknowledge their own needs.",
      spiritualLesson: "True love includes self-love. The spiritual journey involves learning that giving and receiving are equally sacred."
    }
  },
  "3": {
    heart: {
      title: "The Heart Center: Type 3 - The Achiever",
      centerOverview: "The Heart Center, comprising Types 2, 3, and 4, is the realm of emotional intelligence. It governs our relationship with identity, image, and feelings.",
      typeInContext: "Type 3, the Achiever, channels heart energy into accomplishment and success. While Type 2 connects through giving and Type 4 through authenticity, Type 3 connects through achievement.",
      typeComparison: "In simple terms: The 2 gives to be loved, the 4 expresses to be unique, and the 3 achieves to be valued.",
      mentalPattern: "The Three's emotional awareness is focused on goals and image: constantly adapting to succeed in any context.",
      coreStruggle: "Threes struggle with maintaining authentic connection while pursuing success and recognition.",
      commonPhrases: [
        "I can make this happen.",
        "Let's be efficient.",
        "What's the goal here?",
        "I've got this covered."
      ],
      hiddenFears: "Beneath the surface lies the fear: 'Am I valuable for who I am, not just for what I achieve?'",
      keyChallenge: "The Three's challenge is learning to value being over doing and to connect with their authentic feelings.",
      spiritualLesson: "True success includes failure. The spiritual journey involves discovering that worth comes from essence, not achievement."
    }
  },
  "4": {
    heart: {
      title: "The Heart Center: Type 4 - The Individualist",
      centerOverview: "The Heart Center, comprising Types 2, 3, and 4, is the realm of emotional intelligence. It governs our relationship with identity, image, and feelings.",
      typeInContext: "Type 4, the Individualist, expresses heart energy through depth and authenticity. While Type 2 connects through giving and Type 3 through achieving, Type 4 connects through emotional depth.",
      typeComparison: "In simple terms: The 2 gives to be loved, the 3 achieves to be valued, and the 4 expresses to be unique.",
      mentalPattern: "The Four's emotional awareness is intensely internal: constantly exploring the depths of feeling and meaning.",
      coreStruggle: "Fours struggle with feeling different or deficient while yearning for authentic connection.",
      commonPhrases: [
        "This feels meaningful.",
        "Something's missing.",
        "No one really understands.",
        "This isn't authentic enough."
      ],
      hiddenFears: "Beneath the surface lies the fear: 'Am I too flawed or different to ever truly belong?'",
      keyChallenge: "The Four's challenge is learning to find beauty in the ordinary and connection in the present moment.",
      spiritualLesson: "True uniqueness includes commonality. The spiritual journey involves discovering that depth exists in simplicity."
    }
  },
  "5": {
    head: {
      title: "The Head Center: Type 5 - The Investigator",
      centerOverview: "The Head Center, comprising Types 5, 6, and 7, is the realm of mental intelligence. It governs perception, thinking, planning, and problem-solving, but at its core, it is also the center of fear.",
      typeInContext: "Type 5, the Investigator, represents the most inward-moving expression of the Head Center. While Type 6 seeks certainty through testing and Type 7 chases possibilities, Type 5 retreats into the mind to find safety through understanding.",
      typeComparison: "In simple terms: The 7 escapes forward into possibilities, the 6 oscillates between trust and doubt, and the 5 withdraws into knowledge and observation.",
      mentalPattern: "The Five's mind is precise and penetrating: it moves deeply into subjects, seeking mastery and complete understanding.",
      coreStruggle: "Fives struggle with feeling overwhelmed by the world's demands while seeking safety through knowledge.",
      commonPhrases: [
        "I need more time to think about this.",
        "Let me research that first.",
        "I prefer to observe rather than participate.",
        "I need space to process this."
      ],
      hiddenFears: "Beneath the surface lies the fear: 'Am I capable enough to engage with the world?'",
      keyChallenge: "The Five's challenge is learning to participate in life directly rather than always preparing through knowledge.",
      spiritualLesson: "True wisdom includes direct experience. The spiritual journey involves discovering that understanding comes through engagement."
    }
  },
  "6": {
    head: {
      title: "The Head Center: Type 6 - The Loyalist",
      centerOverview: "The Head Center, comprising Types 5, 6, and 7, is the realm of mental intelligence. It governs perception, thinking, planning, and problem-solving, but at its core, it is also the center of fear.",
      typeInContext: "Type 6, the Loyalist, embodies the most complex relationship with fear in the Head Center. While Type 5 retreats from fear and Type 7 runs ahead of it, Type 6 engages directly with fear through vigilance.",
      typeComparison: "In simple terms: The 5 withdraws to understand, the 7 moves forward to avoid, and the 6 scans to prepare.",
      mentalPattern: "The Six's mind is scanning and questioning: constantly evaluating situations for potential threats and allies.",
      coreStruggle: "Sixes struggle with doubt and certainty, seeking security while questioning authority.",
      commonPhrases: [
        "What if something goes wrong?",
        "Let's think this through.",
        "Can we trust this?",
        "I see both sides."
      ],
      hiddenFears: "Beneath the surface lies the fear: 'Can I trust my own judgment?'",
      keyChallenge: "The Six's challenge is learning to trust their inner guidance rather than constantly seeking external security.",
      spiritualLesson: "True security includes uncertainty. The spiritual journey involves finding faith in oneself and life itself."
    }
  },
  "7": {
    head: {
      title: "The Head Center: Type 7 - The Enthusiast",
      centerOverview: "The Head Center, comprising Types 5, 6, and 7, is the realm of mental intelligence. It governs perception, thinking, planning, and problem-solving, but at its core, it is also the center of fear.",
      typeInContext: "Type 7, the Enthusiast, represents the most outward-moving expression of the Head Center. While Type 5 retreats into depth and Type 6 scans for security, Type 7 moves forward into possibility.",
      typeComparison: "In simple terms: The 5 withdraws to understand, the 6 scans to prepare, and the 7 advances to explore.",
      mentalPattern: "The Seven's mind is quick and expansive: constantly generating options and possibilities.",
      coreStruggle: "Sevens struggle with staying present with difficult emotions while seeking pleasure and possibility.",
      commonPhrases: [
        "Let's keep our options open.",
        "This could be exciting!",
        "What's next?",
        "Why limit ourselves?"
      ],
      hiddenFears: "Beneath the surface lies the fear: 'Will I be trapped in pain or limitation?'",
      keyChallenge: "The Seven's challenge is learning to find depth and satisfaction in the present moment.",
      spiritualLesson: "True freedom includes commitment. The spiritual journey involves discovering that joy includes pain."
    }
  },
  "8": {
    body: {
      title: "The Body Center: Type 8 - The Challenger",
      centerOverview: "The Body Center, comprising Types 8, 9, and 1, is the realm of instinctual intelligence. It governs our relationship with power, autonomy, and physical presence.",
      typeInContext: "Type 8, the Challenger, expresses body energy most directly. While Type 9 diffuses power and Type 1 controls it, Type 8 asserts power directly.",
      typeComparison: "In simple terms: The 9 merges with others, the 1 controls through principle, and the 8 confronts directly.",
      mentalPattern: "The Eight's body awareness is strong and assertive: instinctively moving into action and confrontation.",
      coreStruggle: "Eights struggle with vulnerability while maintaining their strong protective presence.",
      commonPhrases: [
        "Let's get to the truth.",
        "I'll handle this.",
        "Don't try to control me.",
        "Stand up for yourself!"
      ],
      hiddenFears: "Beneath the surface lies the fear: 'Will I be betrayed or controlled if I'm vulnerable?'",
      keyChallenge: "The Eight's challenge is learning to embrace vulnerability without losing their strength.",
      spiritualLesson: "True strength includes tenderness. The spiritual journey involves discovering that power includes vulnerability."
    }
  },
  "9": {
    body: {
      title: "The Body Center: Type 9 - The Peacemaker",
      centerOverview: "The Body Center, comprising Types 8, 9, and 1, is the realm of instinctual intelligence. It governs our relationship with power, autonomy, and physical presence.",
      typeInContext: "Type 9, the Peacemaker, diffuses body energy to maintain harmony. While Type 8 asserts power and Type 1 controls it, Type 9 merges with others to create peace.",
      typeComparison: "In simple terms: The 8 confronts directly, the 1 improves through principle, and the 9 harmonizes through merger.",
      mentalPattern: "The Nine's body awareness is receptive and inclusive: naturally attuning to others and the environment.",
      coreStruggle: "Nines struggle with maintaining their own presence while creating harmony with others.",
      commonPhrases: [
        "Let's find a way that works for everyone.",
        "I see all sides.",
        "It's not that important.",
        "Whatever you prefer is fine."
      ],
      hiddenFears: "Beneath the surface lies the fear: 'Will I be separated or in conflict if I assert myself?'",
      keyChallenge: "The Nine's challenge is learning to maintain their own presence while staying connected to others.",
      spiritualLesson: "True peace includes assertion. The spiritual journey involves discovering that harmony includes differentiation."
    }
  }
}; 