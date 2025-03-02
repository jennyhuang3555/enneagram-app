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