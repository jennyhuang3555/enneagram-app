interface GrowthPathContent {
  title: string;
  description: string;
  keyPoints?: string[];
  commonTriggers?: string[];
  copingStrategies?: string[];
  manifestations?: string[];
  developmentPath?: string;
}

type TypeContent = {
  [key: string]: GrowthPathContent;
}

export const growthPathsContent: {
  'core-fear': TypeContent;
  'triggers': TypeContent;
  'spiritual-gift': TypeContent;
} = {
  'core-fear': {
    '6': {
      title: "The Fear of Uncertainty and Betrayal",
      description: "Type Sixes deeply fear being without support or guidance in threatening situations. This core fear manifests as a constant scanning for potential dangers and a need to build systems of security.",
      keyPoints: [
        "Fear of being without support or guidance in challenging times",
        "Deep anxiety about making wrong decisions",
        "Fear of betrayal or unreliable authority figures",
        "Underlying worry about being unprepared for threats"
      ]
    },
    '9': {
      title: "The Fear of Loss and Separation",
      description: "Type Nines deeply fear conflict, separation, and loss of connection. This core fear manifests as a tendency to merge with others and avoid asserting themselves.",
      keyPoints: [
        "Fear of being in conflict with others leads to peace-keeping at any cost",
        "Deep anxiety about standing out or being too assertive",
        "Fear of loss of connection drives tendency to accommodate others",
        "Underlying worry about being truly seen and known"
      ]
    },
    // Add other types...
  },
  
  'triggers': {
    '6': {
      title: "Security and Trust",
      description: "Type Sixes are triggered by situations that threaten their sense of security or challenge their trust in systems and relationships.",
      commonTriggers: [
        "Unexpected changes or uncertainty",
        "Feeling pressured to make decisions without enough information",
        "Perceived threats to security or stability",
        "Authority figures who seem untrustworthy"
      ],
      copingStrategies: [
        "Build trust gradually through small steps",
        "Develop inner authority through mindful decision-making",
        "Practice distinguishing real from imagined threats",
        "Create reliable support systems while maintaining autonomy"
      ]
    },
    '9': {
      title: "Conflict and Assertiveness",
      description: "Type Nines are triggered by situations that force confrontation or require strong self-assertion.",
      commonTriggers: [
        "Direct conflict or confrontation",
        "Being pushed to make quick decisions",
        "Feeling pressured to take a strong stance",
        "Others' anger or intense emotions"
      ],
      copingStrategies: [
        "Practice small moments of healthy self-assertion",
        "Set gentle but firm boundaries",
        "Use 'both-and' thinking to navigate conflicts",
        "Stay connected to your own priorities and needs"
      ]
    },
    // Add other types...
  },

  'spiritual-gift': {
    '6': {
      title: "The Gift of Courage",
      description: "Type Sixes bring the spiritual gift of genuine courage and the ability to build trustworthy communities and systems that support others.",
      manifestations: [
        "Natural ability to spot potential problems and solutions",
        "Capacity for genuine courage in facing fears",
        "Gift for building reliable support systems",
        "Deep understanding of what creates true security"
      ],
      developmentPath: "Your path involves learning to trust your inner guidance while maintaining your gift for creating external security. True courage comes from facing uncertainty while staying grounded in your own wisdom."
    },
    '9': {
      title: "The Gift of Unity",
      description: "Type Nines bring the spiritual gift of genuine peace and the ability to see multiple perspectives, creating harmony and understanding.",
      manifestations: [
        "Natural ability to see all sides of a situation",
        "Capacity to create genuine peace and harmony",
        "Gift for bringing people together",
        "Deep understanding of universal connection"
      ],
      developmentPath: "Your path involves learning to maintain inner peace while fully showing up in the world. True peace comes not from avoiding conflict but from being fully present with yourself and others."
    },
    // Add other types...
  }
}; 