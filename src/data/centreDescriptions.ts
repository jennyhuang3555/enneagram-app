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
  "7": {
    head: {
      title: "The Head Center: Type 7 - The Enthusiast",
      centerOverview: "The Head Center, comprising Types 5, 6, and 7, is the realm of mental intelligence. It governs perception, thinking, planning, and problem-solving, but at its core, it is also the center of fear.",
      typeInContext: "Type 7, the Enthusiast, is unique among them in how it orients attention. While Type 5 moves inward into intellectual depth and Type 6 oscillates between doubt and seeking security, Type 7 projects outward—chasing possibility, stimulation, and adventure.",
      typeComparison: "In simple terms: The 5 retreats into the mind, the 6 vacillates between external reliance and doubt, and the 7 escapes forward into the world.",
      mentalPattern: "The Seven's mind is highly active: it moves quickly across ideas, often connecting them in unexpected ways. Their mental energy is forward-moving, expansive, and filled with an insatiable hunger for stimulation.",
      coreStruggle: "Beneath their enthusiasm, 7s, like all head types, are deeply concerned with security. However, rather than meeting this fear directly, they avoid it by filling their minds and schedules with options.",
      commonPhrases: [
        "There's so much I want to do! I can't just pick one thing.",
        "Let's keep our options open.",
        "I don't want to be tied down.",
        "We can figure it out later—let's just go for it!"
      ],
      hiddenFears: "Yet underneath, a quieter fear lingers: 'What if this moment is all there is? What if I don't find what I'm looking for?'",
      keyChallenge: "A common trap for Sevens is the illusion that more options equal more freedom. But paradoxically, their fear of committing to one thing leaves them scattered, stuck in an endless cycle of anticipation rather than deep engagement. The mind, always looking forward, rarely lands long enough to be nourished by the present.",
      spiritualLesson: "This is where the deeper spiritual lesson of the Seven emerges: True freedom is not found in having endless choices, but in the ability to be fully present with what is."
    }
  },
  "5": {
    head: {
      title: "The Head Center: Type 5 - The Investigator",
      centerOverview: "The Head Center, comprising Types 5, 6, and 7, is the realm of mental intelligence. It governs perception, thinking, planning, and problem-solving, but at its core, it is also the center of fear.",
      typeInContext: "Type 5, the Investigator, represents the most inward-moving expression of the Head Center. While Type 6 seeks certainty through testing and Type 7 chases possibilities, Type 5 retreats into the mind to find safety through understanding.",
      typeComparison: "In simple terms: The 7 escapes forward into possibilities, the 6 oscillates between trust and doubt, and the 5 withdraws into knowledge and observation.",
      mentalPattern: "The Five's mind is precise and penetrating: it moves deeply into subjects, seeking mastery and complete understanding. Their mental energy is concentrated, focused, and characterized by a desire to conserve resources while maximizing comprehension.",
      coreStruggle: "Like all head types, 5s are fundamentally concerned with security. However, their unique strategy is to withdraw and minimize needs while maximizing knowledge and understanding. They believe that if they can understand everything, they can protect themselves from the world's demands.",
      commonPhrases: [
        "I need more time to think about this.",
        "Let me research that first.",
        "I prefer to observe rather than participate.",
        "I need space to process this."
      ],
      hiddenFears: "Beneath the surface lies a deeper fear: 'What if I'm not capable enough? What if I don't have enough resources (knowledge, energy, time) to engage with life?'",
      keyChallenge: "Fives often don't realize that their strategy of withdrawal, while providing a sense of safety, actually prevents them from fully participating in life. Their attempt to prepare for life by understanding it completely before engaging means they miss out on the direct experience that would truly nourish them.",
      spiritualLesson: "The spiritual journey for the Five involves recognizing that true knowing comes not just from observation and analysis, but from direct participation in life. Wisdom emerges from engagement, not just understanding."
    }
  },
  "6": {
    head: {
      title: "The Head Center: Type 6 - The Loyalist",
      centerOverview: "The Head Center, comprising Types 5, 6, and 7, is the realm of mental intelligence. It governs perception, thinking, planning, and problem-solving, but at its core, it is also the center of fear.",
      typeInContext: "Type 6, the Loyalist, embodies the most complex relationship with fear in the Head Center. While Type 5 retreats from fear and Type 7 runs ahead of it, Type 6 engages directly with fear through constant vigilance and preparation.",
      typeComparison: "In simple terms: The 5 withdraws to understand, the 7 moves forward to avoid, and the 6 scans the environment to prepare.",
      mentalPattern: "The Six's mind is scanning and questioning: it moves between different scenarios, anticipating potential problems and solutions. Their mental energy is vigilant, seeking to create security through preparation and alliance-building.",
      coreStruggle: "Like all head types, 6s are deeply concerned with security. Their strategy involves both seeking authority/guidance and questioning it, creating a characteristic push-pull pattern in their relationship with trust and doubt.",
      commonPhrases: [
        "What if something goes wrong?",
        "I need to be prepared for every possibility.",
        "Can we trust this?",
        "I see both sides of the situation."
      ],
      hiddenFears: "At the core lies the fear: 'What if I can't trust my own judgment? What if I make the wrong decision and lose support?'",
      keyChallenge: "Sixes often don't realize that their constant preparation and questioning, while aimed at creating security, actually maintains their state of anxiety. The more they try to eliminate uncertainty, the more uncertain they feel.",
      spiritualLesson: "The spiritual journey for the Six involves discovering that true security comes not from external guarantees or perfect preparation, but from developing trust in one's own inner guidance and in the fundamental support of existence itself."
    }
  },
  // Continue with all types...
}; 