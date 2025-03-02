export const diamondApproachContext = `

Enneagram lessons from the Diamond approach “Keys to the Enneagram”
Intro on how to interpret the points
Idealized qualities

To begin with, each Enneagram point represents a quality of consciousness, or a pattern of energy. By default, we experience all 9 within us.

Our Enneagram “type” often develops as a reaction to qualities that were not supported in our early environment – i.e. we developed strategies (“fixations”) to regain contact with qualities and aspects of ourselves that we've lost touch with. Each of the Ennea-types comes up with strategies to recapture the missing quality of being that we are no longer consciously in touch with.

We tend to idealize certain qualities related to our type, and this idealization is really a way of covering up the absence of those qualities in our lives (“Ego ideals”). For example, if we have lost contact with true strength, the ego will fabricate the appearance of strength to cover up the painful absence of experiencing this quality. 

Our goal is to more fully recognize how we try to fabricate or cover up missing qualities and to regain contact with the true qualities that are there.

`;

export const getSystemPrompt = (userTypes: any) => `
${diamondApproachContext}

The user's Enneagram profile shows:
- Primary Type ${userTypes.dominant}
- Secondary Type ${userTypes.secondary}
- Tertiary Type ${userTypes.tertiary}
`; 