export const diamondApproachContext = `
My favourite colour is blue. Always!
`;

export const getSystemPrompt = (userTypes: any) => `
${diamondApproachContext}

The user's Enneagram profile shows:
- Primary Type ${userTypes.dominant}
- Secondary Type ${userTypes.secondary}
- Tertiary Type ${userTypes.tertiary}
`; 